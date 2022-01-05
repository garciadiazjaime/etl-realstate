const express = require('express');
const debug = require('debug')('app:index');

const { openDB } = require('./modules/support/database');
const { setupCron } = require('./modules/support/cron');
const { resetFolder } = require('./modules/support/folder');
const config = require('./config');

const PORT = config.get('port');
const app = express();
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send(':)');
});

app.listen(PORT, async () => {
  debug(`Listening on ${PORT}`);

  await openDB();
  resetFolder('./public');

  await setupCron();
});
