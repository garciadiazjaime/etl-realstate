const mapSeries = require('async/mapSeries');

const debug = require('debug')('app:proceso');

const listETL = require('./list-etl');
const articleETL = require('./article-etl');
const { NewsModel } = require('../news/model');
const { openDB, closeDB } = require('../support/database');

async function main() {
  const source = 'proceso';
  const url = 'https://www.proceso.com.mx';

  const articles = await listETL(url, source);

  debug(`found:${articles.length}`);

  let newCount = 0;

  await mapSeries(articles, async (article) => {
    const documents = await NewsModel.countDocuments({ url: article.url });

    if (!documents) {
      newCount += 1;

      await articleETL(article, url);
    }
  });

  debug(`new:${newCount}`);
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
