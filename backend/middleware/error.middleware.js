/**
 * Global Error Handler.
 *
 * Catches all errors passed via next(error) and returns a consistent
 * JSON response. Handles Mongoose validation errors, duplicate key
 * errors, and JWT errors with appropriate status codes.
 */
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      error: { message: 'Validation failed', details: errors },
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      error: { message: `Duplicate value for field: ${field}` },
    });
  }

  // JWT errors (should be caught by auth middleware, but catch here too)
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: { message: 'Invalid token' } });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: { message: 'Token has expired' } });
  }

  // Custom error with statusCode
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};

module.exports = errorHandler;