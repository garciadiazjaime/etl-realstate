const { PlaceModel } = require('../model');

const categories = ['cafe', 'restaurant', 'bar'];

async function getPlacesByCategory(limit = 5) {
  const promises = categories.map((category) => PlaceModel.find({
    type: category,
  }).limit(limit));

  const places = await Promise.all(promises);

  const response = {};
  categories.forEach((slug, index) => {
    response[slug] = places[index];
  });

  return response;
}

function getPlacesFromCategory(category, limit = 20) {
  return PlaceModel.find({
    type: category,
  }).limit(limit);
}

module.exports = {
  getPlacesByCategory,
  getPlacesFromCategory,
};
