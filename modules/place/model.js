const mongoose = require('mongoose');

const RealstateSchema = new mongoose.Schema({
  address: { type: String },
  city: { type: String },
  currency: { type: String },
  gps: {
    type: { type: String },
    coordinates: { type: [], default: undefined },
  },
  description: { type: String },
  images: { type: Array },
  phone: { type: String },
  price: { type: Number },
  source: { type: String },
  title: { type: String },
  url: { type: String, unique: true },
}, {
  timestamps: true,
});

RealstateSchema.index({ description: 'text', address: 'text' });
RealstateSchema.index({ gps: '2dsphere' });

const RealstateModel = mongoose.model('realstate', RealstateSchema);

module.exports = {
  RealstateModel,
};
