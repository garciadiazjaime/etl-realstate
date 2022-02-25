const express = require('express');
const cors = require('cors');

const getCoupons = require('./handler/get-coupons');

const router = express.Router();

router.get('/coupons', cors(), async (req, res) => {
  const { merchant } = req.query;

  const coupons = await getCoupons(merchant);

  res.send(coupons);
});

module.exports = router;
