/**
 * Helper utilities for sanitizing and formatting Mongoose documents.
 */

/**
 * Converts a Mongoose document to a safe plain object suitable for API responses.
 * - Maps _id to id (to match frontend conventions)
 * - Removes password, __v, and other internal fields
 */
const sanitizeUser = (user) => {
  const obj = user.toObject ? user.toObject() : { ...user };
  if (obj._id) {
    obj.id = obj._id;
    delete obj._id;
  }
  delete obj.__v;
  delete obj.password;
  return obj;
};

module.exports = { sanitizeUser };