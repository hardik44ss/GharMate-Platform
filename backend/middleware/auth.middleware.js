const jwt = require('jsonwebtoken');
const config = require('../config/env');
const User = require('../models/User');

/**
 * JWT Authentication Middleware.
 *
 * - Extracts the Bearer token from the Authorization header.
 * - Verifies the JWT signature and expiry.
 * - Loads the user from MongoDB (excluding password).
 * - Checks that the user's account is active (not blocked).
 * - Attaches the user document to req.user.
 *
 * On failure: returns 401 with an error message.
 */
const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: { message: 'No token provided, authorization denied' },
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);

    // Load user from DB (exclude password from projection)
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        error: { message: 'Token is not valid — user not found' },
      });
    }

    // Check if user is blocked
    if (!user.isActive) {
      return res.status(401).json({
        error: { message: 'Account has been blocked' },
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: { message: 'Token has expired' },
      });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: { message: 'Invalid token' },
      });
    }
    next(error);
  }
};

module.exports = auth;