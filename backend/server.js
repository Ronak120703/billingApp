const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/billing-app';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Invoice Schema
const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerAddress: { type: String, required: true },
  date: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  items: [{
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    rate: { type: Number, required: true },
    amount: { type: Number, required: true }
  }],
  subtotal: { type: Number, required: true },
  tax: { type: Number, required: true },
  total: { type: Number, required: true },
  notes: { type: String },
  status: { type: String, default: 'pending' }
}, {
  timestamps: true,
  collection: 'invoices'
});

// Add indexes
invoiceSchema.index({ invoiceNumber: 1 });
invoiceSchema.index({ customerName: 1 });
invoiceSchema.index({ date: 1 });
invoiceSchema.index({ createdAt: 1 });

// Ensure invoice number uniqueness
invoiceSchema.pre('save', async function(next) {
  if (this.isNew) {
    const existingInvoice = await this.constructor.findOne({ invoiceNumber: this.invoiceNumber });
    if (existingInvoice) {
      return next(new Error('Invoice number already exists'));
    }
  }
  next();
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

// Helper function to generate next invoice number
async function getNextInvoiceNumber() {
  const lastInvoice = await Invoice.findOne().sort({ invoiceNumber: -1 });
  if (!lastInvoice) {
    return 'INV-001';
  }
  
  const lastNumber = parseInt(lastInvoice.invoiceNumber.split('-')[1]);
  const nextNumber = lastNumber + 1;
  return `INV-${nextNumber.toString().padStart(3, '0')}`;
}

// Routes

// GET all invoices
app.get('/api/invoices', async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single invoice by ID
app.get('/api/invoices/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET invoice by number
app.get('/api/invoices/number/:invoiceNumber', async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ invoiceNumber: req.params.invoiceNumber });
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new invoice
app.post('/api/invoices', async (req, res) => {
  try {
    const invoiceData = req.body;
    
    // Generate next invoice number if not provided
    if (!invoiceData.invoiceNumber) {
      invoiceData.invoiceNumber = await getNextInvoiceNumber();
    }
    
    const invoice = new Invoice(invoiceData);
    await invoice.save();
    res.status(201).json(invoice);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update invoice
app.put('/api/invoices/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE invoice
app.delete('/api/invoices/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET next invoice number
app.get('/api/invoices/next-number', async (req, res) => {
  try {
    const nextNumber = await getNextInvoiceNumber();
    res.json({ nextInvoiceNumber: nextNumber });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET invoice statistics
app.get('/api/invoices/stats', async (req, res) => {
  try {
    const totalInvoices = await Invoice.countDocuments();
    const totalAmount = await Invoice.aggregate([
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);
    
    const currentMonthInvoices = await Invoice.countDocuments({
      createdAt: { $gte: currentMonth }
    });
    
    const currentMonthAmount = await Invoice.aggregate([
      { $match: { createdAt: { $gte: currentMonth } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    
    const stats = {
      totalInvoices,
      totalAmount: totalAmount[0]?.total || 0,
      currentMonthInvoices,
      currentMonthAmount: currentMonthAmount[0]?.total || 0,
      averageAmount: totalInvoices > 0 ? (totalAmount[0]?.total || 0) / totalInvoices : 0
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search invoices by customer name
app.get('/api/invoices/search/:customerName', async (req, res) => {
  try {
    const invoices = await Invoice.find({
      customerName: { $regex: req.params.customerName, $options: 'i' }
    }).sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 