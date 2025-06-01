const mongoose = require('mongoose');

const ExportSchema = new mongoose.Schema({
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true }, // Giá xuất trên một sản phẩm
  totalPrice: { type: Number, required: true }, // quantity * unitPrice
  exportDate: { type: Date, required: true },
  userName: { type: String, default: 'Admin' } // Tên người xuất, mặc định là Admin
}, { timestamps: true });

module.exports = mongoose.model('Export', ExportSchema);