const mapSeries = require('async/mapSeries');

const debug = require('debug')('app:eleconomista');

const listETL = require('./list-etl');
const articleETL = require('./article-etl');
const { NewsModel } = require('../news/model');
const { openDB, closeDB } = require('../support/database');
const { getPage, closeBrowser } = require('../support/extract');

async function main(count = 0) {
  const source = 'eleconomista';
  const url = 'https://www.eleconomista.com.mx';

  const { browser, page } = await getPage();

  const articles = await listETL(page, source, url, count);

  let newCount = 0;

  await mapSeries(articles, async (article) => {
    const documents = await NewsModel.countDocuments({ url: article.url });

    if (!documents) {
      newCount += 1;

      await articleETL(article, url);
    }
  });

  debug(`${articles.length}:${newCount}`);

  await closeBrowser(browser);
}

if (require.main === module) {
  (async () => {
    await openDB();
    await main();
    await closeDB();
    debug('end');
  })();
} else {
  module.exports = main;
}
