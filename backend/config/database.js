const mongoose = require('mongoose');
const config = require('./env');

/**
 * Establishes a connection to MongoDB using Mongoose.
 * Unlike the original implementation, a temporary Atlas outage does NOT kill
 * the process — the server keeps running and Mongoose retries automatically,
 * so API routes can degrade gracefully (mock fallbacks on the frontend).
 */
const connectDB = async () => {
  mongoose.connection.on('connected', () => console.log('MongoDB connected successfully'));
  mongoose.connection.on('disconnected', () => console.warn('MongoDB connection lost — Mongoose will auto-retry'));
  mongoose.connection.on('error', (err) => console.error('MongoDB connection error:', err.message));

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 8000 });
      console.log('MongoDB connected successfully');
      return;
    } catch (error) {
      console.error(`MongoDB connection attempt ${attempt}/2 failed:`, error.message);
      if (attempt < 2) await new Promise((r) => setTimeout(r, 3000));
    }
  }

  // Keep the server alive even without a DB. Mongoose auto-retries on demand and
  // the frontend falls back to demo/mock data when the API is unavailable.
  console.error('MongoDB could not be reached initially. Backend continues in degraded mode and will auto-retry.');
};

module.exports = connectDB;