const mongoose = require('mongoose');

const { Schema } = mongoose;

const GaritaSchema = new Schema({
  city: String,
  ports: [],
}, {
  timestamps: true,
});

const GaritaModel = mongoose.model('garita', GaritaSchema);

module.exports = {
  GaritaModel,
};
