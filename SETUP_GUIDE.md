# MongoDB Setup Guide for Billing App

This guide will help you connect MongoDB to your billing app and save all form fields to the database.

## 🚀 Quick Start

### 1. Install MongoDB

#### Option A: Local MongoDB (Recommended for Development)
```bash
# Windows
# Download and install from https://www.mongodb.com/try/download/community

# macOS (using Homebrew)
brew tap mongodb/brew
brew install mongodb-community

# Ubuntu/Debian
sudo apt-get install mongodb
```

#### Option B: MongoDB Atlas (Cloud Service)
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string

### 2. Setup Backend Server

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Run setup to test MongoDB connection
npm run setup

# Start the server
npm run dev
```

### 3. Test the Connection

The server should start on `http://localhost:3001` and you should see:
```
✅ MongoDB Connected Successfully!
Server running on port 3001
```

## 📁 Project Structure

```
billingApp/
├── app/                    # React Native frontend
│   └── (tabs)/
│       └── create-invoice.tsx  # Your form
├── server/                 # Backend with MongoDB
│   ├── models/
│   │   └── Invoice.js      # MongoDB schema
│   ├── routes/
│   │   └── invoices.js     # API endpoints
│   ├── server.js           # Express server
│   ├── package.json        # Backend dependencies
│   └── config.env          # Environment variables
└── services/
    └── api.ts              # Frontend API service
```

## 🔧 Configuration

### Environment Variables (server/config.env)
```env
# For local MongoDB
MONGODB_URI=mongodb://localhost:27017/billingApp

# For MongoDB Atlas (replace with your connection string)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/billingApp?retryWrites=true&w=majority

# Server Configuration
PORT=3001
NODE_ENV=development
```

## 📊 Database Schema

All form fields from `create-invoice.tsx` are saved to MongoDB:

```javascript
{
  _id: ObjectId,
  customerName: String (required),
  customerPhone: String,
  invoiceNumber: String (required, unique),
  date: String (required),
  wheatWeightKg: String,
  wheatWeightMaund: String,
  cutPieces: String,
  number2: String,
  number5: String,
  totalWeightKg: String,
  totalWeightMaund: String,
  bagQuantity: String,
  pricePerKg: String,
  bagAmount: String,
  totalBagPrice: String,
  totalAmount: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 API Endpoints

The backend provides these endpoints:

- `POST /api/invoices` - Create new invoice (saves all form fields)
- `GET /api/invoices` - Get all invoices
- `GET /api/invoices/:id` - Get invoice by ID
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice
- `GET /api/invoices/next-number/next` - Get next invoice number
- `GET /api/invoices/stats/stats` - Get statistics
- `GET /api/invoices/search/:customerName` - Search invoices

## 🎯 How It Works

### 1. Form Submission
When you click "Save" in the create-invoice form:
1. All form data is collected
2. Sent to `http://localhost:3001/api/invoices`
3. Saved directly to MongoDB database

### 2. Data Flow
```
Form Fields → API Service → Express Server → MongoDB
```

### 3. Form Fields Saved
- Customer Name
- Customer Phone
- Invoice Number
- Date
- Wheat Weight (Kg & Maund)
- Cut Pieces
- 2+5 Number
- Total Weight
- Bag Quantity
- Price per Kg
- Bag Amount
- Total Bag Price
- Total Amount

## 🛠️ Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   ```bash
   # Check if MongoDB is running
   # Windows
   services.msc  # Look for MongoDB service
   
   # macOS
   brew services list | grep mongodb
   
   # Linux
   sudo systemctl status mongod
   ```

2. **Port Already in Use**
   ```bash
   # Change port in config.env
   PORT=3002
   ```

3. **CORS Issues**
   - The server is configured to allow all origins
   - Check if the server is running on the correct port

### Debug Mode
```bash
# Add to config.env
DEBUG=mongoose:*
```

## 🚀 Running the Complete App

1. **Start Backend**
   ```bash
   cd server
   npm run dev
   ```

2. **Start Frontend**
   ```bash
   # In another terminal
   npm start
   ```

3. **Test the App**
   - Go to "Create" tab
   - Fill in the form
   - Click "Save"
   - Check the "Invoices" tab to see saved data

## 📱 Frontend Integration

The frontend is already configured to work with the MongoDB backend:

- `services/api.ts` - Handles API calls
- `hooks/useInvoices.ts` - Manages invoice state
- `app/(tabs)/create-invoice.tsx` - Form with save functionality

## 🔒 Security Notes

- For production, use MongoDB Atlas or a managed service
- Set up proper authentication
- Configure CORS for your domain
- Use environment variables for sensitive data
- Enable SSL/TLS

## 📈 Monitoring

Check the server logs for:
- MongoDB connection status
- API request logs
- Error messages

## 🆘 Support

If you encounter issues:

1. Run `npm run setup` in the server directory
2. Check MongoDB is running
3. Verify connection string in `config.env`
4. Check server logs for error messages
5. Ensure all dependencies are installed

## ✅ Success Indicators

You'll know everything is working when:

1. ✅ Server starts without errors
2. ✅ MongoDB connection successful
3. ✅ Form saves data without errors
4. ✅ Invoices appear in the "Invoices" tab
5. ✅ No CORS errors in browser console 