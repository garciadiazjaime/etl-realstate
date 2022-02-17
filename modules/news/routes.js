const express = require('express');
const cors = require('cors');

const { getNews, getNewsFromCategory } = require('./actions/get-news');

const router = express.Router();

router.get('/news', cors(), async (req, res) => {
  const news = await getNews();

  res.send(news);
});

router.get('/news/:category', cors(), async (req, res) => {
  const { category } = req.params;

  const news = await getNewsFromCategory(category);

  res.send(news);
});

module.exports = router;
