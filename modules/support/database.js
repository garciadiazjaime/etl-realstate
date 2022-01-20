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

function closeDB() {
  debug('close');

  return mongoose.connection.close();
}

module.exports = {
  openDB,
  closeDB,
};
