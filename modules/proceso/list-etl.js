const cheerio = require('cheerio');

const { getHTMLLean } = require('../support/extract');

function transform(html, domain, source) {
  const $ = cheerio.load(html);

  const article = $('.article-fullw a');
  const firstNews = {
    source,
    title: article.find('h2').text(),
    url: `${domain}${article.attr('href')}`,
  };
  const response = [firstNews];

  $('#main-content .titulo a').toArray().forEach((item) => {
    const url = $(item).attr('href');
    const title = $(item).text().replace(/\n/g, '').trim();

    response.push({
      source,
      title,
      url: `${domain}${url}`,
    });
  });

  return response;
}

async function main(url, source) {
  const html = await getHTMLLean(url);

  const articles = await transform(html, url, source);

  return articles;
}

module.exports = main;
