const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

async function testConnection() {
  console.log('Testing MongoDB connection...');
  console.log('URI:', MONGODB_URI?.replace(/\/\/(.*)@/, '//***:***@'));
  
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('✅ Connection successful!');
    console.log('Database:', mongoose.connection.db.databaseName);
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('\nPossible fixes:');
    console.log('1. Check your internet connection');
    console.log('2. Try using a VPN (some ISPs block MongoDB Atlas)');
    console.log('3. Switch to local MongoDB (mongodb://localhost:27017)');
  }
}

testConnection();