const mapSeries = require('async/mapSeries');

const { PostModel } = require('../model');

const blockUsers = [
  'abbas_house',
  'infomitijuana',
  'sachet_sucree',
  '_caffeinekicks',
  'la.ruta.del.licor',
  'joanna.jacquelinne',
];

async function getPostByCategory(categories, source, limit = 50) {
  const response = [];
  const userIds = [];

  await mapSeries(categories.split(','), async (category) => {
    const posts = await PostModel.aggregate([{
      $match: {
        source,
        'user.id': {
          $nin: userIds,
        },
        'user.username': {
          $nin: blockUsers,
        },
        $text: {
          $search: category,
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
        likeCount: {
          $sum: '$likeCount',
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
        likeCount: -1,
        createdAt: -1,
      },
    }, {
      $limit: limit,
    }]);

    posts.forEach((post) => {
      userIds.push(post._id); //eslint-disable-line
    });

    posts.forEach((post) => {
      response.push({
        ...post,
        category,
      });
    });
  });

  return response;
}

module.exports = getPostByCategory;
