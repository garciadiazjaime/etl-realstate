const { RealstateModel } = require('../model');

function getPlaces(slug, limit = 27) {
  if (slug) {
    return RealstateModel.find({
      $text: {
        $search: slug,
      },
    })
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  return RealstateModel.find()
    .sort({ createdAt: -1 })
    .limit(limit);
}

module.exports = getPlaces;
