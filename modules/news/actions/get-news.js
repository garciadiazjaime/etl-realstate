const { NewsModel } = require('../model');

function getNews(lastDays = 1, limit = 50) {
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - lastDays);

  return NewsModel.find({
    createdAt: {
      $gte: startDate,
    },
  })
    .sort({ createdAt: -1 })
    .limit(limit);
}

module.exports = getNews;
