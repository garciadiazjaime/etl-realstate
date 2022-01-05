const cheerio = require('cheerio');

const debug = require('debug')('app:icasas');

const { openDB } = require('../support/database');
const extract = require('../support/extract');
const { getPrice, getCurrency } = require('../support/currency');
const { getLocation } = require('../support/place');
const load = require('../support/load');

function transform(html, source, city) {
  const domain = 'https://www.icasas.mx';
  const $ = cheerio.load(html);

  return $('li[itemtype="https://schema.org/Residence"]').toArray().map((element) => {
    const value = $(element).find('.price').text();
    const price = getPrice(value);
    const currency = getCurrency(value);
    const description = $(element).find('p.description').text();
    const title = $(element).find('h2.title').text();
    const latitude = $(element).find('meta[itemprop="latitude"]').attr('content');
    const longitude = $(element).find('meta[itemprop="longitude"]').attr('content');
    const images = [$(element).find('.slider-ad img').attr('src')];
    const url = domain + $(element).find('.title a').attr('href');
    const address = $(element).find('meta[itemprop="addressLocality"]').attr('content');

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
  const source = 'icasas';
  const url = 'https://www.icasas.mx/venta/habitacionales-casas-baja-california-tijuana-2_5_3_0_13_0';

  const html = await extract(url, `${source}-${city}`);

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
