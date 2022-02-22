const express = require('express');
const cors = require('cors');

const getPostByCategory = require('./handler/get-post-by-category');

const router = express.Router();

router.get('/posts/by-category', cors(), async (req, res) => {
  const { category, limit = 10, source = 'tijuanamakesmehungry' } = req.query;
  const posts = await getPostByCategory(category, source, parseInt(limit, 10));

  res.send(posts);
});

module.exports = router;
