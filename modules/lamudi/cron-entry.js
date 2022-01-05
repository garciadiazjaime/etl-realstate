const cheerio = require('cheerio');

const debug = require('debug')('app:lamudi');
const { openDB } = require('../support/database');
const { getPrice, getCurrency } = require('../support/currency');
const extract = require('../support/extract');
const load = require('../support/load');
const { cleanString } = require('../support/string');

function transform(html, source, city) {
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
      city,
      currency,
      description,
      images,
      price,
      source,
      title,
      url,
    };

    return place;
  });
}

async function main(count) {
  const city = 'tijuana';
  const source = 'lamudi';
  const url = 'https://www.lamudi.com.mx/baja-california/tijuana/for-sale/';
  const html = await extract(url, `${source}-${city}`, count);

  const places = transform(html, source, city);

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
