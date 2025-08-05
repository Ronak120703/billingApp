const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');

// Get all invoices
router.get('/', async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

// Get invoice by ID
router.get('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch invoice' });
  }
});

// Get invoice by number
router.get('/number/:invoiceNumber', async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ invoiceNumber: req.params.invoiceNumber });
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch invoice' });
  }
});

// Create new invoice
router.post('/', async (req, res) => {
  try {
    const invoice = new Invoice(req.body);
    await invoice.save();
    res.status(201).json(invoice);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'Invoice number already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create invoice' });
    }
  }
});

// Update invoice
router.put('/:id', async (req, res) => {
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
    res.status(500).json({ error: 'Failed to update invoice' });
  }
});

// Delete invoice
router.delete('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete invoice' });
  }
});

// Get next invoice number
router.get('/next-number/next', async (req, res) => {
  try {
    const lastInvoice = await Invoice.findOne().sort({ invoiceNumber: -1 });
    let nextNumber = 'INV-001';
    
    if (lastInvoice) {
      const lastNumber = lastInvoice.invoiceNumber;
      const match = lastNumber.match(/INV-(\d+)/);
      if (match) {
        const nextNum = parseInt(match[1]) + 1;
        nextNumber = `INV-${nextNum.toString().padStart(3, '0')}`;
      }
    }
    
    res.json({ nextInvoiceNumber: nextNumber });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get next invoice number' });
  }
});

// Get invoice statistics
router.get('/stats/stats', async (req, res) => {
  try {
    const totalInvoices = await Invoice.countDocuments();
    const totalAmount = await Invoice.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: { $toDouble: '$totalAmount' }
          }
        }
      }
    ]);

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const currentMonthInvoices = await Invoice.countDocuments({
      createdAt: {
        $gte: new Date(currentYear, currentMonth, 1),
        $lt: new Date(currentYear, currentMonth + 1, 1)
      }
    });

    const currentMonthAmount = await Invoice.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(currentYear, currentMonth, 1),
            $lt: new Date(currentYear, currentMonth + 1, 1)
          }
        }
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: { $toDouble: '$totalAmount' }
          }
        }
      }
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
    res.status(500).json({ error: 'Failed to get invoice statistics' });
  }
});

// Search invoices by customer name
router.get('/search/:customerName', async (req, res) => {
  try {
    const customerName = req.params.customerName;
    const invoices = await Invoice.find({
      customerName: { $regex: customerName, $options: 'i' }
    }).sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search invoices' });
  }
});

module.exports = router; 