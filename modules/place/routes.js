const express = require('express');
const cors = require('cors');

const getPlaces = require('./handler/get-places');
const { getPlacesByCategory, getPlacesFromCategory } = require('./handler/get-places-from-maps');

const router = express.Router();

router.get('/places', cors(), async (req, res) => {
  const places = await getPlaces();

  res.send(places);
});

router.get('/gmaps-place', cors(), async (req, res) => {
  const { limit } = req.query;
  const places = await getPlacesByCategory(limit);

  res.send(places);
});

router.get('/gmaps-place/:category', cors(), async (req, res) => {
  const { category } = req.params;
  const { limit } = req.query;

  const places = await getPlacesFromCategory(category, limit);

  res.send(places);
});

module.exports = router;
