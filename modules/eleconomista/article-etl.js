const cheerio = require('cheerio');

const { NewsModel } = require('../news/model');
const { getHTMLLean } = require('../support/extract');

function transform(html, item, domain) {
  const $ = cheerio.load(html);

  const title = $('.title h1').text();
  const description = $('section.main-content p')
    .toArray()
    .map((desc) => $(desc).text().replace('\n', '').trim())
    .filter((desc) => desc.length && !desc.includes('Archivado en'));

  const image = $('figure.img-top img').attr('src');

  const article = {
    ...item,
    title,
    description,
    image: `${domain}${image}`,
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
