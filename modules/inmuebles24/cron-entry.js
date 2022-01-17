const cheerio = require('cheerio');

const debug = require('debug')('app:inmuebles24');

const { openDB } = require('../support/database');
const { getPrice, getCurrency } = require('../support/currency');
const { cleanString } = require('../support/string');
const extract = require('../support/extract');
const load = require('../support/load');
const config = require('../../config');

function getImage($, element) {
  const image = $(element).find('.posting-gallery-slider .flickity-slider .is-selected img').attr('src');
  if (image) {
    return image;
  }

  const galleryHTML = $(element).find('.posting-gallery-slider').html();
  const images = galleryHTML.match(/https:\/\/[\w\.\/]*/gi);

  return Array.isArray(images) ? images[0] : '';
}

function transform(html, source, city) {
  const $ = cheerio.load(html);
  const domain = 'https://www.inmuebles24.com';

  const places = $('.list-card-container > div .postingCardContent').toArray().map((element) => {
    const value = $(element).find('.firstPrice').text().trim();
    const price = getPrice(value);
    const currency = getCurrency(value);
    const description = cleanString($(element).find('.postingCardDescription').text());
    const images = [getImage($, element)];
    const url = domain + $(element).find('.postingCardTitle a').attr('href');
    const address = cleanString($(element).find('.postingCardLocationBlock').text());
    const title = cleanString($(element).find('.postingCardTitle a').text());

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

  return places;
}

function getCookies() {
  const cachedCookies = config.get('cookies');

  if (cachedCookies) {
    debug('cookies from environment');
    return JSON.parse(decodeURIComponent(cachedCookies));
  }

  return null;
}

async function main(count) {
  const city = 'tijuana';
  const source = 'inmuebles24';
  const url = 'https://www.inmuebles24.com/inmuebles-en-venta-en-tijuana.html';

  const cookies = getCookies();

  const html = await extract(url, `${source}-${city}`, count, cookies);

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
