const cheerio = require('cheerio');

const { NewsModel } = require('../news/model');
const { getHTML } = require('../support/extract');

function transform(html, item, domain) {
  const $ = cheerio.load(html);

  const description = $('.main-article p')
    .toArray()
    .map((desc) => $(desc).text().replace('\n', '').trim())
    .filter((desc) => desc.length && !desc.includes('Fragmento del reportaje'));

  const image = $('.main-gallery figure img').attr('src');

  const article = {
    ...item,
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

async function main(item, page, domain) {
  const html = await getHTML(page, item.url);

  const article = transform(html, item, domain);

  await load(article);
}

module.exports = main;
