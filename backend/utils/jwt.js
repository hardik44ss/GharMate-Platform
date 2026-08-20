const jwt = require('jsonwebtoken');
const config = require('../config/env');

/**
 * JWT utility — token generation and verification.
 */

/**
 * Signs a JWT with the configured secret and expiry.
 * Uses the payload normally containing { id, role, email }.
 */
const generateToken = (payload) => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

/**
 * Verifies a JWT and returns the decoded payload.
 * Throws on invalid or expired tokens (handled by middleware).
 */
const verifyToken = (token) => {
  return jwt.verify(token, config.jwtSecret);
};

module.exports = { generateToken, verifyToken };