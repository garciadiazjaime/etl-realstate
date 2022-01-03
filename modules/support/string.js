function cleanString(value) {
  return value ? value.replace(/\r?\n|\r|\t|"|!|“|”|•/g, '').replace(/  +/g, ' ').trim() : '';
}

module.exports = {
  cleanString,
};
