const cheerio = require('cheerio');

const { NewsModel } = require('../news/model');
const { getHTMLLean } = require('../support/extract');

function transform(html, item) {
  const $ = cheerio.load(html);

  const title = $('main h1').text();
  const description = $('article #node-article-body p, article #id-body-node p')
    .toArray()
    .map((desc) => $(desc).text().replace('\n', '').trim())
    .filter((desc) => desc.length > 7 && !desc.includes('La ley de derechos') && !desc.includes('En el siguiente enlace') && !desc.includes('Puedes leer la nota'));

  const image = $('figure.main-image img').length ? $('figure.main-image img').attr('src') : $('#content-main article img.single-image').attr('src');

  const article = {
    ...item,
    title,
    description,
    image,
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

async function main(item) {
  const html = await getHTMLLean(item.url);

  const article = transform(html, item);

  await load(article);
}

module.exports = main;
