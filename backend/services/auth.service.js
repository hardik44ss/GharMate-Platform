const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { sanitizeUser } = require('../utils/helpers');

/**
 * Auth service — encapsulates authentication business logic.
 * Separates data access and token generation from route handlers.
 */

/**
 * Creates a new user after checking for duplicate email.
 * Throws an error with statusCode=400 if email is taken.
 */
const createUser = async (userData) => {
  const existing = await User.findOne({ email: userData.email });
  if (existing) {
    const error = new Error('User already exists with this email');
    error.statusCode = 400;
    throw error;
  }

  const user = new User(userData);
  await user.save();
  return user;
};

/**
 * Finds a user by email (used during login).
 */
const findUserByEmail = async (email) => {
  return User.findOne({ email, isActive: true });
};

/**
 * Builds the standard authentication response: { token, user }.
 * The user object is sanitized (password stripped, _id → id).
 */
const generateAuthResponse = (user) => {
  const token = generateToken({ id: user._id, role: user.role, email: user.email });
  return {
    token,
    user: sanitizeUser(user),
  };
};

module.exports = {
  createUser,
  findUserByEmail,
  generateAuthResponse,
};