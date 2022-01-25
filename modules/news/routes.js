const express = require('express');
const cors = require('cors');

const getNews = require('./actions/get-news');

const router = express.Router();

router.get('/news', cors(), async (req, res) => {
  const news = await getNews();

  res.send(news);
});

module.exports = router;
