const fetch = require('node-fetch');

const config = require('../../config');

const API_URL = config.get('api.url');

async function ping() {
  await fetch(API_URL);
}

module.exports = {
  ping,
};
