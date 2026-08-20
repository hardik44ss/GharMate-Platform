const {
  createUser,
  findUserByEmail,
  generateAuthResponse,
} = require('../services/auth.service');
const {
  validateRegisterInput,
  validateLoginInput,
} = require('../utils/validators');

/**
 * Auth Controller — route handlers for Phase 1 authentication.
 *
 * Register   → POST /api/auth/register
 * Login      → POST /api/auth/login
 * getProfile → GET  /api/auth/profile (JWT protected)
 */

/**
 * Register a new user (CLIENT or CONTRACTOR).
 * Validates input, creates the user, and returns { token, user }.
 */
const register = async (req, res, next) => {
  try {
    const validation = validateRegisterInput(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        error: { message: 'Validation failed', details: validation.errors },
      });
    }

    const { fullName, email, password, role } = req.body;
    const user = await createUser({ fullName, email, password, role });

    return res.status(201).json(generateAuthResponse(user));
  } catch (error) {
    next(error);
  }
};

/**
 * Log in an existing user with email + password.
 * Returns { token, user } on success, 401 on invalid credentials.
 */
const login = async (req, res, next) => {
  try {
    const validation = validateLoginInput(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        error: { message: 'Validation failed', details: validation.errors },
      });
    }

    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        error: { message: 'Invalid email or password' },
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        error: { message: 'Invalid email or password' },
      });
    }

    return res.status(200).json(generateAuthResponse(user));
  } catch (error) {
    next(error);
  }
};

/**
 * Get the profile of the currently authenticated user.
 * req.user is populated by the auth middleware (password already excluded).
 */
const getProfile = async (req, res, next) => {
  try {
    const { _id: id, fullName, email, role, kycStatus, avatarUrl } = req.user;
    return res.status(200).json({
      user: { id, fullName, email, role, kycStatus, avatarUrl },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getProfile };