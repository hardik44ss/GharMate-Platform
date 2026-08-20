require('dotenv').config();

const http = require('http');
const app = require('./app');
const connectDB = require('./config/database');
const config = require('./config/env');

/**
 * GharMate Backend Server — Entry Point
 *
 * 1. Loads environment variables
 * 2. Connects to MongoDB
 * 3. Creates HTTP server
 * 4. Starts listening on configured port
 */

// Connect to MongoDB
connectDB();

// Create HTTP server
const server = http.createServer(app);

// Start server
server.listen(config.port, () => {
  console.log(`\n┌────────────────────────────────────────┐`);
  console.log(`│  GharMate Backend Server               │`);
  console.log(`├────────────────────────────────────────┤`);
  console.log(`│  Port:     ${config.port}${' '.repeat(22 - String(config.port).length)}│`);
  console.log(`│  Env:      ${config.nodeEnv}${' '.repeat(22 - config.nodeEnv.length)}│`);
  console.log(`│  MongoDB:  ${config.mongoUri}${' '.repeat(Math.max(0, 22 - config.mongoUri.length))}│`);
  console.log(`│  API:      http://localhost:${config.port}/api${' '.repeat(Math.max(0, 22 - `http://localhost:${config.port}/api`.length))}│`);
  console.log(`└────────────────────────────────────────┘\n`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err.message);
  server.close(() => process.exit(1));
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
  });
});