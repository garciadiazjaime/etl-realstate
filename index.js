const express = require('express');
const debug = require('debug')('app:index');

const placeRoutes = require('./modules/place/routes');
const newsRoutes = require('./modules/news/routes');
const couponsRoutes = require('./modules/coupon/routes');
const instagramRoutes = require('./modules/instagram/routes');
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

app.use('', placeRoutes);
app.use('', newsRoutes);
app.use('', couponsRoutes);
app.use('', instagramRoutes);

app.listen(PORT, async () => {
  debug(`Listening on ${PORT}`);

  await openDB();
  resetFolder('./public');

  if (config.get('env') === 'production') {
    await setupCron();
  }
});
