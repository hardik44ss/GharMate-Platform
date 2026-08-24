const User = require('../models/User');
const { sanitizeUser } = require('../utils/helpers');

/**
 * User service — encapsulates user profile business logic.
 * Separates data access from route handlers.
 */

/**
 * Finds a user by id excluding the password field.
 * Throws an error with statusCode=404 if the user does not exist.
 */
const findById = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return user;
};

/**
 * Updates only the allowed profile fields (fullName, avatarUrl).
 * All other fields (password, role, email, _id, createdAt, ...) are
 * intentionally ignored here, enforced by the update whitelist.
 */
const updateProfile = async (userId, profileData) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  if (profileData.fullName !== undefined) {
    user.fullName = profileData.fullName;
  }
  if (profileData.avatarUrl !== undefined) {
    user.avatarUrl = profileData.avatarUrl;
  }

  await user.save();
  return sanitizeUser(user);
};

/**
 * Returns a contractor's own profile (password excluded).
 * Throws an error with statusCode=404 if the user does not exist.
 */
const getContractorProfile = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    const error = new Error('Contractor not found');
    error.statusCode = 404;
    throw error;
  }
  return sanitizeUser(user);
};

/**
 * Updates only the allowed contractor-specific profile fields.
 * All other fields (email, password, role, kycStatus, isActive, _id,
 * createdAt, ...) are intentionally ignored here, enforced by the
 * update whitelist.
 */
const updateContractorProfile = async (userId, profileData) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('Contractor not found');
    error.statusCode = 404;
    throw error;
  }

  const allowed = [
    'businessName',
    'businessDescription',
    'phone',
    'city',
    'state',
    'experienceYears',
    'skills',
    'serviceCategories',
  ];

  for (const field of allowed) {
    if (profileData[field] !== undefined) {
      user[field] = profileData[field];
    }
  }

  await user.save();
  return sanitizeUser(user);
};

module.exports = {
  findById,
  updateProfile,
  getContractorProfile,
  updateContractorProfile,
};