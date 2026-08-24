const {
  findById,
  updateProfile: updateUserProfile,
} = require('../services/user.service');
const {
  validateProfileUpdate,
} = require('../utils/validators');

/**
 * User Controller — route handlers for authenticated user profile.
 *
 * getProfile     → GET /api/users/profile
 * updateProfile  → PUT /api/users/profile
 * Both require a valid JWT (auth middleware sets req.user).
 */

/**
 * Return the authenticated user's own profile.
 */
const getProfile = async (req, res, next) => {
  try {
    const profile = await findById(req.user._id);
    return res.status(200).json({ user: profile });
  } catch (error) {
    next(error);
  }
};

/**
 * Update allowed profile fields (fullName, avatarUrl).
 * Disallowed fields (password, role, email, _id, createdAt) are rejected
 * by validation and never applied.
 */
const updateProfile = async (req, res, next) => {
  try {
    const validation = validateProfileUpdate(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        error: { message: 'Validation failed', details: validation.errors },
      });
    }

    const updated = await updateUserProfile(req.user._id, req.body);
    return res.status(200).json({ user: updated });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
};