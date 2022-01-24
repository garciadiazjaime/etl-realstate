const cheerio = require('cheerio');

const { NewsModel } = require('../news/model');
const { getHTMLLean } = require('../support/extract');

function transform(html, item, domain) {
  const $ = cheerio.load(html);

  const title = $('.titulo-principal').text();
  const description = $('#section-main article p')
    .toArray()
    .map((desc) => $(desc).text().replace('\n', '').trim())
    .filter((desc) => desc.length);
  const image = $('#section-main figure img.full').attr('src');

  const article = {
    description,
    image: `${domain}${image}`,
    ...item,
    title,
  };

  return article;
}

async function load(article) {
  return NewsModel.findOneAndUpdate({ url: article.url }, {
    ...article,
  }, {
    upsert: true,
  });
}

async function main(item, domain) {
  const html = await getHTMLLean(item.url);

  const article = transform(html, item, domain);

  await load(article);
}

module.exports = main;
