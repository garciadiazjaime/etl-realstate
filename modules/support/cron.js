const cron = require('node-cron');
const debug = require('debug')('app:cron');

const lamudiCron = require('../lamudi/cron-entry');
const inmuebles24Cron = require('../inmuebles24/cron-entry');
const vivanunciosCron = require('../vivanuncios/cron-entry');
const icasasCron = require('../icasas/cron-entry');
const propiedadesCron = require('../propiedades/cron-entry');
const trovitCron = require('../trovit/cron-entry');
const aristeguiCron = require('../aristeguiNoticias/cron-entry');
const eluniversalCron = require('../eluniversal/cron-entry');
const procesoCron = require('../proceso/cron-entry');
const excelsiorCron = require('../excelsior/cron-entry');
const eleconomistaCron = require('../eleconomista/cron-entry');
const netlifyCron = require('./netlify');
const { ping } = require('./heroku');

async function setupCron() {
  let realStateCount = 0;
  let newsCount = 0;

  cron.schedule('7 */12 * * *', async () => {
    realStateCount += 1;
    debug(`========JOB:${realStateCount}========`);

    debug('========lamudi');
    await lamudiCron(realStateCount);

    debug('========inmuebles24');
    await inmuebles24Cron(realStateCount);

    debug('========vivanuncios');
    await vivanunciosCron(realStateCount);

    debug('========icasas');
    await icasasCron(realStateCount);

    debug('========propiedades');
    await propiedadesCron(realStateCount);

    debug('========trovit');
    await trovitCron(realStateCount);
  });

  cron.schedule('*/12 * * * *', async () => {
    await ping();
  });

  cron.schedule('21 */8 * * *', async () => {
    newsCount += 1;

    await aristeguiCron(newsCount);
    await eluniversalCron(newsCount);
    await procesoCron(newsCount);
    await excelsiorCron(newsCount);
    await eleconomistaCron(newsCount);
  });

  cron.schedule('17 10 * * *', async () => {
    await netlifyCron();
  });

  await ping();

  return debug('CRON_SETUP');
}

module.exports = {
  setupCron,
};
