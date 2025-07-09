// config/db.js
const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('Using existing MongoDB connection');
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/AchyutaJobportal');
    isConnected = true;
    console.log('MongoDB Connected:', process.env.MONGO_URI || 'mongodb://localhost:27017/AchyutaJobportal');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
};

module.exports = connectDB;