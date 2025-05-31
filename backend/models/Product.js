const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  retailPrice: { type: Number, required: true },
  costPrice: { type: Number, required: true },
  stock: { type: Number, required: true },
  unit: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema); 