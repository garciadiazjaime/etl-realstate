const express = require('express');
const cors = require('cors');

const getPlaces = require('./handler/get-places');

const router = express.Router();

router.get('/places', cors(), async (req, res) => {
  const places = await getPlaces();

  res.send(places);
});

module.exports = router;
