const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const mapSeries = require('async/mapSeries');

const debug = require('debug')('app:lamudi');

const { RealstateModel } = require('../place/model');
const { openDB } = require('../support/database');
const { getPrice, getCurrency } = require('../support/currency');
const { cleanString } = require('../support/string');

async function extract() {
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-gpu',
    ],
  });
  const page = await browser.newPage();
  const url = 'https://www.lamudi.com.mx/baja-california/tijuana/for-sale/';
  await page.goto(url);

  const html = await page.content();

  await browser.close();

  return html;
}

function transform(html) {
  const $ = cheerio.load(html);

  return $('.js-listingContainer .ListingCell-row .ListingCell-content').toArray().map((element) => {
    const value = $(element).find('.PriceSection-FirstPrice').text().trim() || $(element).find('.PriceSection-SecondPrice').text().trim();
    const price = getPrice(value) || null;
    const currency = getCurrency(value);
    const description = cleanString($(element).find('.ListingCell-shortDescription').text());
    const images = [$(element).find('.ListingCell-image img').data('src') || $(element).find('.ListingCell-image img').attr('src')];
    const url = $(element).find('.js-listing-link').attr('href');
    const address = cleanString($(element).find('.ListingCell-KeyInfo-address-text').text());
    const title = cleanString($(element).find('.ListingCell-KeyInfo-title').text());

    const place = {
      address,
      city: 'tijuana',
      currency,
      description,
      images,
      price,
      source: 'lamudi',
      title,
      url,
    };

    return place;
  });
}

async function load(places) {
  if (!Array.isArray(places) || !places.length) {
    debug('NO_PLACES');
  }

  debug(`places:${places.length}`);
  let newPostsCount = 0;

  await mapSeries(places, async (place) => {
    const documents = await RealstateModel.countDocuments({ url: place.url });

    if (documents) {
      return null;
    }

    newPostsCount += 1;

    return RealstateModel.findOneAndUpdate({ url: place.url }, {
      ...place,
    }, {
      upsert: true,
    });
  });

  debug(`new_places:${newPostsCount}`);
}

async function main() {
  const html = await extract();

  const places = transform(html);

  await load(places);
}

if (require.main === module) {
  (async () => {
    await openDB();
    await main();
    debug('done');
  })();
}

module.exports = main;
