const cheerio = require('cheerio');

const { getHTML, printScreen } = require('../support/extract');

function transform(html, domain, source) {
  const $ = cheerio.load(html);

  return $('section.main a.cover-link, section.main h2 a, section.main h3 a, section.main h4 a').toArray().map((item) => {
    const url = $(item).attr('href');

    return {
      source,
      url,
    };
  })
    .filter((item) => item.url && item.url.length > 33 && !item.url.includes('SuscripcionesOnline') && !item.url.includes('cartones/'))
    .map((item) => ({ ...item, url: `${domain}${item.url}` }));
}

async function main(page, source, url, count) {
  const html = await getHTML(page, url);

  await printScreen(page, html, count, source);

  const articles = await transform(html, url, source);

  return articles;
}

module.exports = main;
