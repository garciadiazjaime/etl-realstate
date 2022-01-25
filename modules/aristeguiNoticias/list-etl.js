const cheerio = require('cheerio');

const { getHTML, printScreen } = require('../support/extract');

function transform(html, domain, source) {
  const $ = cheerio.load(html);
  const response = [];
  const urlsMap = {};

  $('#home a[itemprop="url"]').toArray().forEach((item) => {
    const url = $(item).attr('href');

    if (!urlsMap[url]) {
      urlsMap[url] = true;

      response.push({
        source,
        url: `${domain}${url}`,
      });
    }
  });

  return response;
}

async function main(page, source, url, count) {
  const html = await getHTML(page, url);

  await printScreen(page, html, count, source);

  const articles = transform(html, url, source);

  return articles;
}

module.exports = main;
