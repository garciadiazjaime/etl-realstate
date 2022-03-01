const mongoose = require('mongoose');

const { Schema } = mongoose;

const GaritaSchema = new Schema({
  city: String,
  report: {},
}, {
  timestamps: true,
});

const GaritaModel = mongoose.model('garita', GaritaSchema);

module.exports = {
  GaritaModel,
};
