const fs = require('fs');
const debug = require('debug')('app:folder');

function resetFolder(folder) {
  if (fs.existsSync(folder)) {
    debug(`removing ${folder}...`);
    fs.rmdirSync(folder, { recursive: true });
  }

  debug(`${folder} created`);
  fs.mkdirSync(folder);
}

module.exports = {
  resetFolder,
};
