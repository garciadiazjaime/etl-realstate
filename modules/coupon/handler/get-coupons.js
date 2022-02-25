const { CouponModel } = require('../model');

function getCoupons(merchant, limit = 27) {
  if (merchant) {
    return CouponModel.find({
      merchant,
    })
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  return CouponModel.find()
    .sort({ createdAt: -1 })
    .limit(limit);
}

module.exports = getCoupons;
