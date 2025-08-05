const mongoose = require('mongoose');
require('dotenv').config();

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

const Invoice = mongoose.model('Invoice', invoiceSchema);

// Sample invoice data
const sampleInvoices = [
  {
    invoiceNumber: 'INV-001',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '+1234567890',
    customerAddress: '123 Main St, City, State 12345',
    date: new Date('2024-01-15'),
    dueDate: new Date('2024-02-15'),
    items: [
      {
        description: 'Web Development Services',
        quantity: 10,
        rate: 100,
        amount: 1000
      },
      {
        description: 'UI/UX Design',
        quantity: 5,
        rate: 150,
        amount: 750
      }
    ],
    subtotal: 1750,
    tax: 175,
    total: 1925,
    notes: 'Sample invoice for testing',
    status: 'paid'
  },
  {
    invoiceNumber: 'INV-002',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    customerPhone: '+0987654321',
    customerAddress: '456 Oak Ave, Town, State 54321',
    date: new Date('2024-01-20'),
    dueDate: new Date('2024-02-20'),
    items: [
      {
        description: 'Mobile App Development',
        quantity: 20,
        rate: 200,
        amount: 4000
      }
    ],
    subtotal: 4000,
    tax: 400,
    total: 4400,
    notes: 'Mobile app project',
    status: 'pending'
  }
];

async function createSampleData() {
  try {
    console.log('Creating sample invoices...');
    
    // Clear existing data
    await Invoice.deleteMany({});
    console.log('Cleared existing data');
    
    // Insert sample invoices
    const createdInvoices = await Invoice.insertMany(sampleInvoices);
    console.log(`Created ${createdInvoices.length} sample invoices`);
    
    // Display created invoices
    console.log('\nCreated invoices:');
    createdInvoices.forEach(invoice => {
      console.log(`- ${invoice.invoiceNumber}: ${invoice.customerName} - $${invoice.total}`);
    });
    
    console.log('\n✅ Database setup complete!');
    console.log('📊 You can now see the "billing-app" database in MongoDB Compass');
    console.log('🗂️  The "invoices" collection contains your sample data');
    
  } catch (error) {
    console.error('Error creating sample data:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed');
  }
}

createSampleData(); 