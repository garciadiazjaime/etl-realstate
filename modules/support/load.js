const mapSeries = require('async/mapSeries');

const debug = require('debug')('app:load');

const { RealstateModel } = require('../place/model');

async function load(places) {
  if (!Array.isArray(places) || !places.length) {
    debug('NO_PLACES');
  }

  debug(`places:${places.length}`);
  let newPostsCount = 0;

  await mapSeries(places, async (place) => {
    const documents = await RealstateModel.countDocuments({ url: place.url });

    if (documents) {
      return null;
    }

    newPostsCount += 1;

    return RealstateModel.findOneAndUpdate({ url: place.url }, {
      ...place,
    }, {
      upsert: true,
    });
  });

  debug(`new_places:${newPostsCount}`);
}

module.exports = load;
