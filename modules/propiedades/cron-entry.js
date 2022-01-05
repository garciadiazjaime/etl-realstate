const cheerio = require('cheerio');

const debug = require('debug')('app:propiedades');

const { openDB } = require('../support/database');
const extract = require('../support/extract');
const { getPrice, getCurrency } = require('../support/currency');
const { getLocation } = require('../support/place');
const { cleanString } = require('../support/string');
const load = require('../support/load');

function transform(html, source, city) {
  const $ = cheerio.load(html);

  return $('.properties-list').toArray().map((element) => {
    const value = $(element).find('.price').text();
    const price = getPrice(value);
    const currency = getCurrency(value);
    const description = cleanString($(element).find('.description-list h4').text());
    const title = $(element).find('.address-property').text().replace(/[\n\t]/g, ' ')
      .trim();
    const images = [$(element).find('.thumbnail-slider img').data('src')];
    const url = $(element).data('href');
    const address = cleanString($(element).find('.address .title-property a').text());
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

async function main() {
  const city = 'tijuana';
  const source = 'propiedades';
  const url = 'https://propiedades.com/tijuana/residencial-venta';

  const html = await extract(url, `${source}-${city}`);

  const places = transform(html, source, city);
  console.log(places);
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
