const mapSeries = require('async/mapSeries');

const { PostModel } = require('../model');

const blockUsers = [
  'abbas_house',
  'la.ruta.del.licor',
];

async function getPostByCategory(category, source, limit = 50) {
  if (category) {
    return PostModel.aggregate([{
      $match: {
        $text: {
          $search: category,
        },
        source,
        'user.username': {
          $nin: blockUsers,
        },
      },
    }, {
      $group: {
        _id: '$user.id',
        caption: {
          $last: '$caption',
        },
        username: {
          $last: '$user.username',
        },
        fullName: {
          $last: '$user.fullName',
        },
        imageUrl: {
          $last: '$imageUrl',
        },
        source: {
          $last: '$source',
        },
        createdAt: {
          $last: '$createdAt',
        },

      },
    }, {
      $sort: {
        createdAt: -1,
      },
    }, {
      $limit: limit,
    }]);
  }

  const categories = ['restaurant', 'cafe', 'bar'];

  const response = [];
  const userIds = [];

  await mapSeries(categories, async (cat) => {
    const posts = await PostModel.aggregate([{
      $match: {
        source,
        'user.id': {
          $nin: userIds,
        },
      },
    }, {
      $group: {
        _id: '$user.id',
        caption: {
          $last: '$caption',
        },
        username: {
          $last: '$user.username',
        },
        fullName: {
          $last: '$user.fullName',
        },
        imageUrl: {
          $last: '$imageUrl',
        },
        source: {
          $last: '$source',
        },
        createdAt: {
          $last: '$createdAt',
        },

      },
    }, {
      $sort: {
        createdAt: -1,
      },
    }, {
      $limit: limit,
    }]);

    posts.forEach((post) => {
      userIds.push(post._id); //eslint-disable-line
    });

    response.push({
      name: cat,
      places: posts,
    });
  });

  return response;
}

module.exports = getPostByCategory;
