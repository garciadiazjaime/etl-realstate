const cheerio = require('cheerio');
const mapSeries = require('async/mapSeries');

const debug = require('debug')('app:couponfollow');

const { openDB, closeDB } = require('../../support/database');
const { getHTMLLean } = require('../../support/extract');
const { CouponModel } = require('../model');

function transform(html, source, merchant) {
  const $ = cheerio.load(html);

  return $('main .type-deal').toArray().map((element) => {
    const title = $(element).find('h2.title').text().replace(/\n/g, '')
      .trim();
    const description = $(element).find('p.explain').text().replace(/\n/g, '')
      .trim();
    const id = $(element).data('id') || $(element).data('sid');

    const coupon = {
      title,
      description,
      source,
      merchant,
      id,
    };

    return coupon;
  }).filter((coupon) => coupon.description.length);
}

async function load(coupon) {
  const documents = await CouponModel.countDocuments({ id: coupon.id });

  if (documents) {
    return 0;
  }

  await CouponModel.findOneAndUpdate({ id: coupon.id }, {
    ...coupon,
  }, {
    upsert: true,
  });

  return 1;
}

async function main(count = 0) {
  const merchants = ['amazon.com', 'turo.com', 'costco.com', 'papajohns.com', 'lowes.com'];
  const source = 'couponfollow';
  const url = 'https://couponfollow.com/site/';

  debug(`==== start:${count}`);

  await mapSeries(merchants, async (merchant) => {
    const html = await getHTMLLean(`${url}${merchant}`);

    const coupons = transform(html, source, merchant);
    let newCount = 0;

    await mapSeries(coupons, async (coupon) => {
      newCount += await load(coupon);
    });

    debug(`${merchant}:${coupons.length}:${newCount}`);
  });

  debug(`==== end:${count}`);
}

if (require.main === module) {
  (async () => {
    await openDB();
    await main();
    await closeDB();
    debug('done');
  })();
} else {
  module.exports = main;
}
