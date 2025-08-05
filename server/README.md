# Billing App Backend

This is the backend server for the billing app with MongoDB integration.

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure MongoDB

#### Option A: Local MongoDB
1. Install MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service
3. The default connection string is: `mongodb://localhost:27017/billingApp`

#### Option B: MongoDB Atlas (Cloud)
1. Create a MongoDB Atlas account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get your connection string and update `config.env`

### 3. Environment Configuration

Edit `config.env` file:
```env
# For local MongoDB
MONGODB_URI=mongodb://localhost:27017/billingApp

# For MongoDB Atlas (replace with your connection string)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/billingApp?retryWrites=true&w=majority

# Server Configuration
PORT=3001
NODE_ENV=development
```

### 4. Start the Server

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3001`

### 5. Test the API

You can test the API endpoints:

- Health check: `GET http://localhost:3001/api/health`
- Get all invoices: `GET http://localhost:3001/api/invoices`
- Create invoice: `POST http://localhost:3001/api/invoices`
- Get next invoice number: `GET http://localhost:3001/api/invoices/next-number/next`

## API Endpoints

### Invoices
- `GET /api/invoices` - Get all invoices
- `GET /api/invoices/:id` - Get invoice by ID
- `GET /api/invoices/number/:invoiceNumber` - Get invoice by number
- `POST /api/invoices` - Create new invoice
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice
- `GET /api/invoices/next-number/next` - Get next invoice number
- `GET /api/invoices/stats/stats` - Get invoice statistics
- `GET /api/invoices/search/:customerName` - Search invoices by customer name

### Health Check
- `GET /api/health` - Server health status

## Database Schema

The MongoDB collection `invoices` has the following structure:

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

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Make sure MongoDB is running
   - Check the connection string in `config.env`
   - Verify network access (for Atlas)

2. **Port Already in Use**
   - Change the PORT in `config.env`
   - Or kill the process using port 3001

3. **CORS Issues**
   - The server is configured to allow all origins in development
   - For production, configure CORS properly

### Debug Mode

To enable debug logging, add to `config.env`:
```env
DEBUG=mongoose:*
```

## Production Deployment

1. Set `NODE_ENV=production` in environment variables
2. Use MongoDB Atlas or a managed MongoDB service
3. Configure proper CORS settings
4. Set up SSL/TLS certificates
5. Use a process manager like PM2
6. Set up monitoring and logging 