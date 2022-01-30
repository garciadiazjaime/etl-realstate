const express = require('express');
const cors = require('cors');

const getCoupons = require('./handler/get-coupons');

const router = express.Router();

router.get('/coupons', cors(), async (req, res) => {
  const coupons = await getCoupons();

  res.send(coupons);
});

module.exports = router;
