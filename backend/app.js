require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

const config = require('./config/env');
const authRoutes = require('./routes/auth.routes');
const errorHandler = require('./middleware/error.middleware');

const app = express();

// ─── Security Middleware ───────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
  })
);
app.use(mongoSanitize());

// ─── Body Parsing ──────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Logging ───────────────────────────────────────────────────────
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// ─── Rate Limiting ─────────────────────────────────────────────────
// General rate limiter — 100 requests per 15 minutes per IP
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: { message: 'Too many requests, please try again later.' },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth-specific rate limiter — 50 auth requests per 15 minutes per IP
// Stricter to prevent brute-force attacks on login/register
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    error: { message: 'Too many authentication attempts, please try again later.' },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(generalLimiter);

// ─── Routes ────────────────────────────────────────────────────────
app.use('/api/auth', authLimiter, authRoutes);

// ─── Health Check ──────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// ─── 404 Handler ───────────────────────────────────────────────────
app.use('*', (req, res) => {
  res.status(404).json({
    error: { message: 'Route not found' },
  });
});

// ─── Global Error Handler (must be last) ───────────────────────────
app.use(errorHandler);

module.exports = app;