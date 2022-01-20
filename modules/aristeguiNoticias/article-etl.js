const cheerio = require('cheerio');

const { NewsModel } = require('../news/model');
const { getHTML } = require('../support/extract');

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
  const documents = await NewsModel.countDocuments({ url: article.url });

  if (documents) {
    return 0;
  }

  await NewsModel.findOneAndUpdate({ url: article.url }, {
    ...article,
  }, {
    upsert: true,
  });

  return 1;
}

async function main(item, page, domain, newNewsCount) {
  const html = await getHTML(page, item.url);

  const article = transform(html, item, domain);

  const isNew = await load(article, newNewsCount);

  return isNew;
}

module.exports = main;
