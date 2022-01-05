const cron = require('node-cron');
const debug = require('debug')('app:cron');

const lamudiCron = require('../lamudi/cron-entry');
const inmuebles24Cron = require('../inmuebles24/cron-entry');
const vivanunciosCron = require('../vivanuncios/cron-entry');
const icasasCron = require('../icasas/cron-entry');
const { ping } = require('./heroku');

async function setupCron() {
  let prodCount = 0;

  cron.schedule('7 * * * *', async () => {
    prodCount += 1;
    debug(`========JOB:lamudiCron:${prodCount}========`);

    await lamudiCron();
    await inmuebles24Cron();
    await vivanunciosCron();
    await icasasCron();
  });

  cron.schedule('*/12 * * * *', async () => {
    await ping();
  });

  await ping();

  await icasasCron();

  return debug('CRON_SETUP');
}

module.exports = {
  setupCron,
};
