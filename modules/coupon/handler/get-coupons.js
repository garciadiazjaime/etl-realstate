const { CouponModel } = require('../model');

function getCoupons(lastDays = 30, limit = 50) {
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - lastDays);

  return CouponModel.find({
    createdAt: {
      $gte: startDate,
    },
  })
    .sort({ createdAt: -1 })
    .limit(limit);
}

module.exports = getCoupons;
