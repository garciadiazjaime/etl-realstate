const { RealstateModel } = require('../model');

function getPlaces(lastDays = 30, limit = 100) {
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - lastDays);

  return RealstateModel.find({
    createdAt: {
      $gte: startDate,
    },
  })
    .sort({ createdAt: -1 })
    .limit(limit);
}

module.exports = getPlaces;
