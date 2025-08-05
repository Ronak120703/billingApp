const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  customerPhone: {
    type: String,
    trim: true
  },
  invoiceNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  date: {
    type: String,
    required: true
  },
  wheatWeightKg: {
    type: String,
    default: ''
  },
  wheatWeightMaund: {
    type: String,
    default: ''
  },
  cutPieces: {
    type: String,
    default: ''
  },
  number2: {
    type: String,
    default: ''
  },
  number5: {
    type: String,
    default: ''
  },
  totalWeightKg: {
    type: String,
    default: '0'
  },
  totalWeightMaund: {
    type: String,
    default: '૦ મણ'
  },
  bagQuantity: {
    type: String,
    default: ''
  },
  pricePerKg: {
    type: String,
    default: ''
  },
  bagAmount: {
    type: String,
    default: ''
  },
  totalBagPrice: {
    type: String,
    default: ''
  },
  totalAmount: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for faster queries
invoiceSchema.index({ invoiceNumber: 1 });
invoiceSchema.index({ customerName: 1 });
invoiceSchema.index({ date: 1 });

module.exports = mongoose.model('Invoice', invoiceSchema); 