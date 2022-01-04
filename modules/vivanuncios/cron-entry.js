const debug = require('debug')('app:inmuebles24');

const { openDB } = require('../support/database');
const extract = require('../support/extract');
const load = require('../support/load');

function getCurrency(item) {
  if (item.minimumPrice && item.minimumPrice.currency) {
    return item.minimumPrice.currency;
  }

  if (item.price && item.price.currency) {
    return item.price.currency;
  }

  return null;
}

function getPrice(item) {
  if (item.minimumPrice && item.minimumPrice.amount) {
    return item.minimumPrice.amount;
  }

  if (item.price && item.price.amount) {
    return item.price.amount;
  }

  return null;
}

function getLocation(place, latitude, longitude) {
  if (latitude && longitude) {
    return {
      ...place,
      gps: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
    };
  }

  return place;
}

function getLatitude(item) {
  if (item.geo && item.geo.latitude) {
    return item.geo.latitude;
  }

  if (item.geo && item.geo.map && item.geo.map.latitude) {
    return item.geo.map.latitude;
  }

  return null;
}

function getLongitude(item) {
  if (item.geo && item.geo.longitude) {
    return item.geo.latitude;
  }

  if (item.geo && item.geo.map && item.geo.map.longitude) {
    return item.geo.map.longitude;
  }

  return null;
}

function getImages(item) {
  const response = [];
  if (Array.isArray(item.pictures) && item.pictures.length) {
    response.push(item.pictures[0].url);
  }

  if (Array.isArray(item.backgroundImagesMobile) && item.backgroundImagesMobile.length) {
    response.push(item.backgroundImagesMobile[0]);
  }

  if (Array.isArray(item.backgroundImagesDesktop) && item.backgroundImagesDesktop.length) {
    response.push(item.backgroundImagesDesktop[0]);
  }

  return response;
}

function transform(html, source, city) {
  const domain = 'https://www.vivanuncios.com.mx';
  const matches = html.match(/adsToPlot":(.*),"ads":/);
  const data = JSON.parse(matches[1]);

  const places = data.map((item) => {
    let place = {
      address: item.geo.address || item.geo.displayName,
      city,
      currency: getCurrency(item),
      description: item.title,
      images: getImages(item),
      price: getPrice(item),
      phone: item.phone,
      source,
      title: item.title,
      url: domain + (item.viewSeoUrl || item.seoUrl),
    };

    const latitude = getLatitude(item);
    const longitude = getLongitude(item);

    place = getLocation(place, latitude, longitude);

    return place;
  });

  return places;
}

async function main() {
  const city = 'tijuana';
  const source = 'vivanuncios';
  const url = 'https://www.vivanuncios.com.mx/s-venta-inmuebles/tijuana/v1c1097l10015p1';

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
