const cheerio = require('cheerio');

const { getHTML, printScreen } = require('../support/extract');

function transform(html, domain, source) {
  const $ = cheerio.load(html);

  return $('.titulo').toArray().map((item) => {
    const url = $(item).find('a').attr('href');
    const title = $(item)
      .find('a')
      .text()
      .replace(/\n/g, '')
      .trim();

    return {
      url,
      title,
      source,
    };
  })
    .filter((item) => item.url.includes(domain));
}

async function main(page, source, url, count) {
  const html = await getHTML(page, url);

  await printScreen(page, html, count, source);

  const articles = await transform(html, url, source);

  return articles;
}

module.exports = main;
