const mapSeries = require('async/mapSeries');

const debug = require('debug')('app:excelsior');

const listETL = require('./list-etl');
const articleETL = require('./article-etl');
const { NewsModel } = require('../news/model');
const { openDB, closeDB } = require('../support/database');

async function main() {
  const source = 'excelsior';
  const url = 'https://www.excelsior.com.mx';

  const articles = await listETL(url, source);

  let newCount = 0;

  await mapSeries(articles, async (article) => {
    const documents = await NewsModel.countDocuments({ url: article.url });

    if (!documents) {
      newCount += 1;

      await articleETL(article);
    }
  });

  debug(`${articles.length}:${newCount}`);
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
