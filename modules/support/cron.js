const cron = require('node-cron');
const debug = require('debug')('app:cron');

const lamudiCron = require('../lamudi/cron-entry');
const { ping } = require('./heroku');

async function setupCron() {
  let prodCount = 0;

  cron.schedule('7 * * * *', async () => {
    prodCount += 1;
    debug(`========JOB:lamudiCron:${prodCount}========`);

    await lamudiCron();
  });

  cron.schedule('*/12 * * * *', async () => {
    await ping();
  });

  await ping();

  await lamudiCron();

  return debug('CRON_SETUP');
}

module.exports = {
  setupCron,
};
