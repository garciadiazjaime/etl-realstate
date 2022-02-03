const cheerio = require('cheerio');

const debug = require('debug')('app:propiedades');

const { openDB } = require('../support/database');
const extract = require('../support/extract');
const { getCurrency } = require('../support/currency');
const { getLocation } = require('../support/place');
const { cleanString } = require('../support/string');
const load = require('../support/load');

function transform(html, source, city) {
  const $ = cheerio.load(html);

  return $('[data-test="results-item"]').toArray().map((element) => {
    const value = $(element).find('.item-price').text().trim();
    const price = value.replace(/\D/g, '');
    const currency = getCurrency(value);
    const description = $(element).find('.item-description').text().trim();
    const title = $(element).find('.item-title').text().trim();
    const images = [`https:${$(element).find('img').attr('src')}`];
    const url = $(element).find('a').attr('href');
    const address = cleanString($(element).find('.address ').text());
    const latitude = $(element).find('meta[itemprop="latitude"]').attr('content');
    const longitude = $(element).find('meta[itemprop="longitude"]').attr('content');

    let place = {
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

    place = getLocation(place, latitude, longitude);

    return place;
  });
}

async function main(count = 0) {
  const city = 'tijuana';
  const source = 'trovit';
  const url = 'https://casas.trovit.com.mx/casa-tijuana';

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
