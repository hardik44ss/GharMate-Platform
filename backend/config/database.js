const mongoose = require('mongoose');
const config = require('./env');

/**
 * Establishes a connection to MongoDB using Mongoose.
 * Exits the process if the connection fails.
 */
const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;