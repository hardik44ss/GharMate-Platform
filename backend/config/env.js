/**
 * Environment configuration loader.
 * All environment variables are read here with sensible defaults.
 * server.js calls dotenv.config() before requiring this module.
 */
module.exports = {
  port: process.env.PORT || 8080,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/gharmate',
  jwtSecret: process.env.JWT_SECRET || 'gharmate_development_secret_change_in_production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS, 10) || 12,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};