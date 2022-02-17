const { NewsModel } = require('../model');

function getNews(limit = 30) {
  return NewsModel.find({ title: { $ne: '' } })
    .sort({ createdAt: -1 })
    .limit(limit);
}

async function getNewsFromCategory(category, limit = 30) {
  return NewsModel.find({
    $text: {
      $search: category,
    },
  })
    .sort({ createdAt: -1 })
    .limit(limit);
}

module.exports = {
  getNews,
  getNewsFromCategory,
};
