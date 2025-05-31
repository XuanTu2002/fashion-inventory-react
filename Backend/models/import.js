const mongoose = require('mongoose');

const ImportSchema = new mongoose.Schema({
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true }, // Giá nhập trên một sản phẩm
  totalPrice: { type: Number, required: true }, // quantity * unitPrice
  importDate: { type: Date, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Người nhập
}, { timestamps: true });

module.exports = mongoose.model('Import', ImportSchema);