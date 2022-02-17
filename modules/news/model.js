const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
  description: { type: [String] },
  id: { type: String },
  image: { type: String },
  title: { type: String },
  source: { type: String },
  url: { type: String, unique: true },
}, {
  timestamps: true,
});

NewsSchema.index({ description: 'text' });

const NewsModel = mongoose.model('new', NewsSchema);

module.exports = {
  NewsModel,
};
