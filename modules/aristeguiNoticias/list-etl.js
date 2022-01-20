const { getHTML, printScreen } = require('../support/extract');

function extract(page) {
  return page.evaluate(() => window.__NEXT_DATA__ && window.__NEXT_DATA__.props.pageProps); // eslint-disable-line
}

function getItems(items, url, source) {
  if (!Array.isArray(items) || !items.length) {
    return [];
  }

  return items.map((item) => ({
    url: `${url}/${item.post_fecha}/c/${item.post_slug}/`,
    id: item.id,
    source,
  }));
}

function transform(data, url, source) {
  const response = [];
  const ids = {};

  response.push(...getItems(data.articulos, url, source));
  response.push(...getItems(data.articulos_articulistas, url, source));
  response.push(...getItems(data.articulos_dinero, url, source));
  response.push(...getItems(data.articulos_kiosko, url, source));
  response.push(...getItems(data.articulos_masleido, url, source));
  response.push(...getItems(data.articulos_mexico, url, source));
  response.push(...getItems(data.articulos_mundo, url, source));
  response.push(...getItems(data.articulos_recientes, url, source));

  return response.filter((item) => {
    const keepItem = !ids[item.id];
    ids[item.id] = true;

    return keepItem;
  });
}

async function main(page, source, url, count) {
  const html = await getHTML(page, url);

  await printScreen(page, html, count, source);

  const data = await extract(page);

  const articles = transform(data, url, source);

  return articles;
}

module.exports = main;
