const fetch = require('node-fetch');
const debug = require('debug')('app:netlify');

const config = require('../../config');

async function main() {
  const postConfig = {
    method: 'POST',
  };

  const site = config.get('netlify');

  await fetch(site, postConfig);

  debug('updated');
}

if (require.main === module) {
  main().then(() => {
    process.exit(0);
  });
}

module.exports = main;
