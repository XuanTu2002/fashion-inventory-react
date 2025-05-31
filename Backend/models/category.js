const mongoose = require('mongoose');
const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  stock: { type: Number, default: 0 }, // tổng tồn kho của danh mục
  description: { type: String },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });
module.exports = mongoose.model('Category', CategorySchema);