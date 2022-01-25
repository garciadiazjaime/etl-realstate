const cheerio = require('cheerio');

const { getHTMLLean } = require('../support/extract');

function transform(html, domain, source) {
  const $ = cheerio.load(html);

  return $('main a.card, main a.media').toArray().map((item) => {
    const url = $(item).attr('href');

    return {
      source,
      url,
    };
  })
    .filter((item) => item.url && item.url.length > 17)
    .map((item) => ({ ...item, url: `${domain}${item.url}` }));
}

async function main(url, source) {
  const html = await getHTMLLean(url);

  const articles = await transform(html, url, source);

  return articles;
}

module.exports = main;
