# MongoDB Setup Guide

This guide will help you set up MongoDB for your billing app.

## Prerequisites

1. **MongoDB Installation**
   - Install MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
   - Or use MongoDB Atlas (cloud service)

2. **Node.js Dependencies**
   - The required packages are already installed: `mongodb` and `mongoose`

## Setup Options

### Option 1: Local MongoDB (Recommended for Development)

1. **Install MongoDB Community Server**
   ```bash
   # Windows
   # Download and install from https://www.mongodb.com/try/download/community
   
   # macOS (using Homebrew)
   brew tap mongodb/brew
   brew install mongodb-community
   
   # Ubuntu/Debian
   sudo apt-get install mongodb
   ```

2. **Start MongoDB Service**
   ```bash
   # Windows
   # MongoDB should start automatically as a service
   
   # macOS
   brew services start mongodb-community
   
   # Ubuntu/Debian
   sudo systemctl start mongod
   ```

3. **Verify Installation**
   ```bash
   mongosh
   # You should see the MongoDB shell
   ```

### Option 2: MongoDB Atlas (Cloud Service)

1. **Create MongoDB Atlas Account**
   - Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose "FREE" tier
   - Select your preferred cloud provider and region
   - Click "Create"

3. **Set Up Database Access**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Create a username and password
   - Select "Read and write to any database"
   - Click "Add User"

4. **Set Up Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in the left sidebar
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string

## Configuration

### Environment Variables

Create a `.env` file in your project root:

```env
# For local MongoDB
MONGODB_URI=mongodb://localhost:27017/billingApp

# For MongoDB Atlas (replace with your actual connection string)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/billingApp?retryWrites=true&w=majority
```

### Update Configuration

The app is configured to use the following default settings:

- **Database Name**: `billingApp`
- **Collection**: `invoices`
- **Connection Options**: Optimized for performance and reliability

## Testing the Connection

1. **Start your app**
   ```bash
   npm start
   ```

2. **Create an invoice**
   - Go to the "Create" tab
   - Fill in the invoice details
   - Click "Save"
   - You should see a success message

3. **View invoices**
   - Go to the "Invoices" tab
   - You should see your saved invoice

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Make sure MongoDB is running
   - Check if the port 27017 is available
   - Verify firewall settings

2. **Authentication Failed**
   - Check your MongoDB Atlas credentials
   - Ensure the user has proper permissions
   - Verify the connection string format

3. **Network Timeout**
   - Check your internet connection (for Atlas)
   - Verify IP whitelist settings
   - Try increasing timeout values in the config

### Debug Mode

To enable debug logging, add this to your `.env` file:

```env
DEBUG=mongoose:*
```

## Production Deployment

For production deployment:

1. **Use MongoDB Atlas** or a managed MongoDB service
2. **Set up proper authentication** with strong passwords
3. **Configure network access** to only allow your app's IP
4. **Enable SSL/TLS** for secure connections
5. **Set up monitoring** and alerts
6. **Regular backups** of your database

## Database Schema

The app uses the following MongoDB collections:

### Invoices Collection
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

## Security Best Practices

1. **Never commit credentials** to version control
2. **Use environment variables** for sensitive data
3. **Implement proper authentication** in production
4. **Regular security updates** for MongoDB
5. **Monitor database access** and logs
6. **Backup your data** regularly

## Support

If you encounter issues:

1. Check the MongoDB logs
2. Verify your connection string
3. Test with a simple MongoDB client
4. Check the app's console for error messages
5. Ensure all dependencies are installed correctly 