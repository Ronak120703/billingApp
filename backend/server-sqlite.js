const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Create SQLite database
const dbPath = path.join(__dirname, 'billing-app.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
db.serialize(() => {
  // Drop existing tables if they exist
  db.run("DROP TABLE IF EXISTS invoices");
  
  // Create invoices table
  db.run(`
    CREATE TABLE invoices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoiceNumber TEXT UNIQUE NOT NULL,
      customerName TEXT NOT NULL,
      customerEmail TEXT,
      customerPhone TEXT,
      customerAddress TEXT,
      date TEXT NOT NULL,
      dueDate TEXT NOT NULL,
      subtotal REAL NOT NULL,
      tax REAL NOT NULL,
      total REAL NOT NULL,
      notes TEXT,
      status TEXT DEFAULT 'pending',
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create invoice_items table
  db.run(`
    CREATE TABLE invoice_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoiceId INTEGER NOT NULL,
      description TEXT NOT NULL,
      quantity REAL NOT NULL,
      rate REAL NOT NULL,
      amount REAL NOT NULL,
      FOREIGN KEY (invoiceId) REFERENCES invoices (id)
    )
  `);

  console.log('Database initialized successfully');
});

// Helper function to generate next invoice number
function getNextInvoiceNumber(callback) {
  db.get("SELECT invoiceNumber FROM invoices ORDER BY invoiceNumber DESC LIMIT 1", (err, row) => {
    if (err) {
      return callback(err);
    }
    
    if (!row) {
      return callback(null, 'INV-001');
    }
    
    const lastNumber = parseInt(row.invoiceNumber.split('-')[1]);
    const nextNumber = lastNumber + 1;
    const nextInvoiceNumber = `INV-${nextNumber.toString().padStart(3, '0')}`;
    callback(null, nextInvoiceNumber);
  });
}

// Routes

// GET all invoices
app.get('/api/invoices', (req, res) => {
  db.all(`
    SELECT i.*, 
           GROUP_CONCAT(ii.description || '|' || ii.quantity || '|' || ii.rate || '|' || ii.amount, '||') as items
    FROM invoices i
    LEFT JOIN invoice_items ii ON i.id = ii.invoiceId
    GROUP BY i.id
    ORDER BY i.createdAt DESC
  `, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    const invoices = rows.map(row => {
      const invoice = {
        _id: row.id.toString(),
        invoiceNumber: row.invoiceNumber,
        customerName: row.customerName,
        customerEmail: row.customerEmail,
        customerPhone: row.customerPhone,
        customerAddress: row.customerAddress,
        date: new Date(row.date),
        dueDate: new Date(row.dueDate),
        subtotal: row.subtotal,
        tax: row.tax,
        total: row.total,
        notes: row.notes,
        status: row.status,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        items: []
      };
      
      if (row.items) {
        invoice.items = row.items.split('||').map(item => {
          const [description, quantity, rate, amount] = item.split('|');
          return {
            description,
            quantity: parseFloat(quantity),
            rate: parseFloat(rate),
            amount: parseFloat(amount)
          };
        });
      }
      
      return invoice;
    });
    
    res.json(invoices);
  });
});

// GET single invoice by ID
app.get('/api/invoices/:id', (req, res) => {
  db.get("SELECT * FROM invoices WHERE id = ?", [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    // Get items for this invoice
    db.all("SELECT * FROM invoice_items WHERE invoiceId = ?", [req.params.id], (err, items) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      const invoice = {
        _id: row.id.toString(),
        invoiceNumber: row.invoiceNumber,
        customerName: row.customerName,
        customerEmail: row.customerEmail,
        customerPhone: row.customerPhone,
        customerAddress: row.customerAddress,
        date: new Date(row.date),
        dueDate: new Date(row.dueDate),
        subtotal: row.subtotal,
        tax: row.tax,
        total: row.total,
        notes: row.notes,
        status: row.status,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        items: items.map(item => ({
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
          amount: item.amount
        }))
      };
      
      res.json(invoice);
    });
  });
});

// GET invoice by number
app.get('/api/invoices/number/:invoiceNumber', (req, res) => {
  db.get("SELECT * FROM invoices WHERE invoiceNumber = ?", [req.params.invoiceNumber], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    // Get items for this invoice
    db.all("SELECT * FROM invoice_items WHERE invoiceId = ?", [row.id], (err, items) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      const invoice = {
        _id: row.id.toString(),
        invoiceNumber: row.invoiceNumber,
        customerName: row.customerName,
        customerEmail: row.customerEmail,
        customerPhone: row.customerPhone,
        customerAddress: row.customerAddress,
        date: new Date(row.date),
        dueDate: new Date(row.dueDate),
        subtotal: row.subtotal,
        tax: row.tax,
        total: row.total,
        notes: row.notes,
        status: row.status,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        items: items.map(item => ({
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
          amount: item.amount
        }))
      };
      
      res.json(invoice);
    });
  });
});

// POST create new invoice
app.post('/api/invoices', (req, res) => {
  const invoiceData = req.body;
  
  // Generate next invoice number if not provided
  if (!invoiceData.invoiceNumber) {
    getNextInvoiceNumber((err, nextNumber) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      invoiceData.invoiceNumber = nextNumber;
      createInvoice(invoiceData, res);
    });
  } else {
    createInvoice(invoiceData, res);
  }
});

function createInvoice(invoiceData, res) {
  const { items, ...invoiceFields } = invoiceData;
  
  db.run(`
    INSERT INTO invoices (
      invoiceNumber, customerName, customerEmail, customerPhone, customerAddress,
      date, dueDate, subtotal, tax, total, notes, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    invoiceFields.invoiceNumber,
    invoiceFields.customerName,
    invoiceFields.customerEmail || '',
    invoiceFields.customerPhone || '',
    invoiceFields.customerAddress || '',
    invoiceFields.date.toISOString(),
    invoiceFields.dueDate.toISOString(),
    invoiceFields.subtotal,
    invoiceFields.tax,
    invoiceFields.total,
    invoiceFields.notes || '',
    invoiceFields.status || 'pending'
  ], function(err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    
    const invoiceId = this.lastID;
    
    // Insert items
    if (items && items.length > 0) {
      const itemStmt = db.prepare(`
        INSERT INTO invoice_items (invoiceId, description, quantity, rate, amount)
        VALUES (?, ?, ?, ?, ?)
      `);
      
      items.forEach(item => {
        itemStmt.run([invoiceId, item.description, item.quantity, item.rate, item.amount]);
      });
      
      itemStmt.finalize();
    }
    
    // Return the created invoice
    db.get("SELECT * FROM invoices WHERE id = ?", [invoiceId], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      const invoice = {
        _id: row.id.toString(),
        invoiceNumber: row.invoiceNumber,
        customerName: row.customerName,
        customerEmail: row.customerEmail,
        customerPhone: row.customerPhone,
        customerAddress: row.customerAddress,
        date: new Date(row.date),
        dueDate: new Date(row.dueDate),
        subtotal: row.subtotal,
        tax: row.tax,
        total: row.total,
        notes: row.notes,
        status: row.status,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        items: items || []
      };
      
      res.status(201).json(invoice);
    });
  });
}

// PUT update invoice
app.put('/api/invoices/:id', (req, res) => {
  const invoiceData = req.body;
  const { items, ...invoiceFields } = invoiceData;
  
  db.run(`
    UPDATE invoices SET
      invoiceNumber = ?, customerName = ?, customerEmail = ?, customerPhone = ?,
      customerAddress = ?, date = ?, dueDate = ?, subtotal = ?, tax = ?,
      total = ?, notes = ?, status = ?, updatedAt = CURRENT_TIMESTAMP
    WHERE id = ?
  `, [
    invoiceFields.invoiceNumber,
    invoiceFields.customerName,
    invoiceFields.customerEmail || '',
    invoiceFields.customerPhone || '',
    invoiceFields.customerAddress || '',
    invoiceFields.date.toISOString(),
    invoiceFields.dueDate.toISOString(),
    invoiceFields.subtotal,
    invoiceFields.tax,
    invoiceFields.total,
    invoiceFields.notes || '',
    invoiceFields.status || 'pending',
    req.params.id
  ], function(err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    // Update items
    if (items) {
      // Delete existing items
      db.run("DELETE FROM invoice_items WHERE invoiceId = ?", [req.params.id]);
      
      // Insert new items
      if (items.length > 0) {
        const itemStmt = db.prepare(`
          INSERT INTO invoice_items (invoiceId, description, quantity, rate, amount)
          VALUES (?, ?, ?, ?, ?)
        `);
        
        items.forEach(item => {
          itemStmt.run([req.params.id, item.description, item.quantity, item.rate, item.amount]);
        });
        
        itemStmt.finalize();
      }
    }
    
    // Return the updated invoice
    db.get("SELECT * FROM invoices WHERE id = ?", [req.params.id], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      const invoice = {
        _id: row.id.toString(),
        invoiceNumber: row.invoiceNumber,
        customerName: row.customerName,
        customerEmail: row.customerEmail,
        customerPhone: row.customerPhone,
        customerAddress: row.customerAddress,
        date: new Date(row.date),
        dueDate: new Date(row.dueDate),
        subtotal: row.subtotal,
        tax: row.tax,
        total: row.total,
        notes: row.notes,
        status: row.status,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        items: items || []
      };
      
      res.json(invoice);
    });
  });
});

// DELETE invoice
app.delete('/api/invoices/:id', (req, res) => {
  db.run("DELETE FROM invoice_items WHERE invoiceId = ?", [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    db.run("DELETE FROM invoices WHERE id = ?", [req.params.id], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Invoice not found' });
      }
      
      res.json({ message: 'Invoice deleted successfully' });
    });
  });
});

// GET next invoice number
app.get('/api/invoices/next-number', (req, res) => {
  getNextInvoiceNumber((err, nextNumber) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ nextInvoiceNumber: nextNumber });
  });
});

// GET invoice statistics
app.get('/api/invoices/stats', (req, res) => {
  db.get("SELECT COUNT(*) as totalInvoices, SUM(total) as totalAmount FROM invoices", (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);
    
    db.get(`
      SELECT COUNT(*) as currentMonthInvoices, SUM(total) as currentMonthAmount 
      FROM invoices 
      WHERE date >= ?
    `, [currentMonth.toISOString()], (err, monthRow) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      const stats = {
        totalInvoices: row.totalInvoices || 0,
        totalAmount: row.totalAmount || 0,
        currentMonthInvoices: monthRow.currentMonthInvoices || 0,
        currentMonthAmount: monthRow.currentMonthAmount || 0,
        averageAmount: row.totalInvoices > 0 ? (row.totalAmount || 0) / row.totalInvoices : 0
      };
      
      res.json(stats);
    });
  });
});

// Search invoices by customer name
app.get('/api/invoices/search/:customerName', (req, res) => {
  db.all(`
    SELECT i.*, 
           GROUP_CONCAT(ii.description || '|' || ii.quantity || '|' || ii.rate || '|' || ii.amount, '||') as items
    FROM invoices i
    LEFT JOIN invoice_items ii ON i.id = ii.invoiceId
    WHERE i.customerName LIKE ?
    GROUP BY i.id
    ORDER BY i.createdAt DESC
  `, [`%${req.params.customerName}%`], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    const invoices = rows.map(row => {
      const invoice = {
        _id: row.id.toString(),
        invoiceNumber: row.invoiceNumber,
        customerName: row.customerName,
        customerEmail: row.customerEmail,
        customerPhone: row.customerPhone,
        customerAddress: row.customerAddress,
        date: new Date(row.date),
        dueDate: new Date(row.dueDate),
        subtotal: row.subtotal,
        tax: row.tax,
        total: row.total,
        notes: row.notes,
        status: row.status,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        items: []
      };
      
      if (row.items) {
        invoice.items = row.items.split('||').map(item => {
          const [description, quantity, rate, amount] = item.split('|');
          return {
            description,
            quantity: parseFloat(quantity),
            rate: parseFloat(rate),
            amount: parseFloat(amount)
          };
        });
      }
      
      return invoice;
    });
    
    res.json(invoices);
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Database file: ${dbPath}`);
}); 