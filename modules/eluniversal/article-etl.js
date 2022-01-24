const cheerio = require('cheerio');

const { NewsModel } = require('../news/model');
const { getHTMLLean } = require('../support/extract');

function transform(html, item) {
  const $ = cheerio.load(html);

  const description = $('.contenido-principal p')
    .toArray()
    .map((desc) => $(desc).text().replace('\n', '').trim())
    .filter((desc) => desc.length && !desc.includes('Lee más') && !desc.includes('Lee también') && !desc.includes('Lea también') && !desc.includes('Puedes leer'));
  const image = $('figure.contenedor-ImagenArticulo img').attr('src');

  const article = {
    ...item,
    description: [
      $('.Encabezado-Articulo h2').text().trim(),
      ...description.slice(0, -2),
    ],
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
