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
const netlifyCron = require('./netlify');
const { ping } = require('./heroku');

async function setupCron() {
  let prodCount = 0;

  cron.schedule('7 */12 * * *', async () => {
    prodCount += 1;
    debug(`========JOB:${prodCount}========`);

    debug('========lamudi');
    await lamudiCron(prodCount);

    debug('========inmuebles24');
    await inmuebles24Cron(prodCount);

    debug('========vivanuncios');
    await vivanunciosCron(prodCount);

    debug('========icasas');
    await icasasCron(prodCount);

    debug('========propiedades');
    await propiedadesCron(prodCount);

    debug('========trovit');
    await trovitCron(prodCount);
  });

  cron.schedule('*/12 * * * *', async () => {
    await ping();
  });

  cron.schedule('21 */12 * * *', async () => {
    await aristeguiCron();
    await eluniversalCron();
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
