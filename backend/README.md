# Billing App Backend

This is the Express.js backend server for the Billing App. It provides REST API endpoints for managing invoices and connects to MongoDB for data persistence.

## Features

- RESTful API for invoice management
- MongoDB integration with Mongoose ODM
- CORS enabled for cross-origin requests
- Automatic invoice number generation
- Invoice statistics and search functionality
- Health check endpoint

## Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your MongoDB connection string:
   ```
   MONGODB_URI=mongodb://localhost:27017/billing-app
   PORT=3000
   ```

3. **Start the server:**
   ```bash
   # Development mode (with auto-restart)
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Invoices

- `GET /api/invoices` - Get all invoices
- `GET /api/invoices/:id` - Get invoice by ID
- `GET /api/invoices/number/:invoiceNumber` - Get invoice by number
- `POST /api/invoices` - Create new invoice
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice
- `GET /api/invoices/next-number` - Get next invoice number
- `GET /api/invoices/stats` - Get invoice statistics
- `GET /api/invoices/search/:customerName` - Search invoices by customer name

### Health Check

- `GET /api/health` - Server health status

## Database Schema

The invoice schema includes:
- Invoice number (unique)
- Customer information (name, email, phone, address)
- Dates (invoice date, due date)
- Items array with description, quantity, rate, and amount
- Totals (subtotal, tax, total)
- Notes and status
- Timestamps (created, updated)

## Development

The server runs on port 3000 by default. Make sure your React Native app is configured to connect to `http://localhost:3000/api` for development.

For production, update the API base URL in your React Native app to point to your deployed backend server. 