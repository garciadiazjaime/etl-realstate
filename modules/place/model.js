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

const PlaceSchema = new mongoose.Schema({
  id: String,
  name: String,
  gps: {
    type: { type: String },
    coordinates: { type: [] },
  },
  address: String,
  phone: String,
  price: Number,
  rating: Number,
  url: String,
  userRatings: Number,
  website: String,
  photoRef: String,
  photoURL: String,
  reviews: Array,
  type: String,
}, { timestamps: true });

PlaceSchema.index({ gps: '2dsphere' });

const PlaceModel = mongoose.model('place', PlaceSchema);

module.exports = {
  RealstateModel,
  PlaceModel,
};
