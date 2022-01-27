const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  source: { type: String },
  merchant: { type: String },
  id: { type: String, unique: true },
}, {
  timestamps: true,
});

const CouponModel = mongoose.model('coupon', CouponSchema);

module.exports = {
  CouponModel,
};
