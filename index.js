const express = require('express');
const debug = require('debug')('app:index');

const { openDB } = require('./modules/support/database');
const { setupCron } = require('./modules/support/cron');
const config = require('./config');

const PORT = config.get('port');
const app = express();

app.get('/', (req, res) => {
  res.send(':)');
});

app.listen(PORT, async () => {
  debug(`Listening on ${PORT}`);

  await openDB();

  await setupCron();
});
