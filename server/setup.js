const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    console.log('Connection string:', process.env.MONGODB_URI);
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB Connected Successfully!');
    console.log(`Host: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    
    // Test creating a collection
    const testCollection = mongoose.connection.collection('test');
    await testCollection.insertOne({ test: true, timestamp: new Date() });
    console.log('✅ Database write test successful');
    
    // Clean up test data
    await testCollection.deleteOne({ test: true });
    console.log('✅ Database cleanup successful');
    
    await mongoose.connection.close();
    console.log('✅ Connection closed successfully');
    
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error(error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Troubleshooting tips:');
      console.log('1. Make sure MongoDB is installed and running');
      console.log('2. For local MongoDB: Start the MongoDB service');
      console.log('3. For MongoDB Atlas: Check your connection string and network access');
      console.log('4. Verify the connection string in config.env');
    }
    
    return false;
  }
}

async function checkDependencies() {
  console.log('Checking dependencies...');
  
  const requiredDeps = [
    'express',
    'mongoose', 
    'cors',
    'dotenv',
    'helmet',
    'morgan'
  ];
  
  let allInstalled = true;
  
  for (const dep of requiredDeps) {
    try {
      require.resolve(dep);
      console.log(`✅ ${dep}`);
    } catch (error) {
      console.log(`❌ ${dep} - Not installed`);
      allInstalled = false;
    }
  }
  
  if (!allInstalled) {
    console.log('\n💡 Run "npm install" to install missing dependencies');
  }
  
  return allInstalled;
}

async function main() {
  console.log('🚀 Billing App Backend Setup');
  console.log('==============================\n');
  
  // Check dependencies
  const depsOk = await checkDependencies();
  console.log('');
  
  if (!depsOk) {
    console.log('Please install missing dependencies first.');
    process.exit(1);
  }
  
  // Test MongoDB connection
  const dbOk = await testConnection();
  console.log('');
  
  if (dbOk) {
    console.log('🎉 Setup completed successfully!');
    console.log('You can now start the server with:');
    console.log('  npm run dev  (for development)');
    console.log('  npm start     (for production)');
  } else {
    console.log('❌ Setup failed. Please fix the issues above.');
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testConnection, checkDependencies }; 