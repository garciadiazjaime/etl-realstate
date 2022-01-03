const mongoose = require('mongoose');
const debug = require('debug')('app:database');

const config = require('../../config');

function openDB() {
  debug('open');

  return mongoose.connect(config.get('db.url'), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

module.exports = {
  openDB,
};
