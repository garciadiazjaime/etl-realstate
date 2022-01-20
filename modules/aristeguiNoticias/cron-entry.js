const mapSeries = require('async/mapSeries');

const debug = require('debug')('app:aristeguiNoticias');

const listETL = require('./list-etl');
const articleETL = require('./article-etl');
const { openDB, closeDB } = require('../support/database');
const { getPage, closeBrowser } = require('../support/extract');

async function main(count = 0) {
  const source = 'aristeguinoticias';
  const url = 'https://aristeguinoticias.com';

  const { browser, page } = await getPage();

  const articles = await listETL(page, source, url, count);
  debug(`found:${articles.length}`);

  let newNewsCount = 0;

  await mapSeries(articles.slice(0, 1), async (article) => {
    newNewsCount += await articleETL(article, page, url);
  });

  debug(`new:${newNewsCount}`);

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
