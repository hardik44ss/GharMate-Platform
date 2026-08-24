const User = require('../models/User');
const { sanitizeUser } = require('../utils/helpers');

/**
 * KYC service — encapsulates contractor verification logic.
 */

/**
 * Submits KYC documents for a contractor (mock upload for now).
 * Sets status to PENDING and records submission time.
 */
const submitKyc = async (contractorId, documents) => {
  const user = await User.findById(contractorId);
  if (!user) {
    const error = new Error('Contractor not found');
    error.statusCode = 404;
    throw error;
  }
  if (user.role !== 'ROLE_CONTRACTOR') {
    const error = new Error('Only contractors can submit KYC');
    error.statusCode = 403;
    throw error;
  }

  if (Array.isArray(documents) && documents.length > 0) {
    user.kycDocuments = documents.map((doc) => ({
      type: doc.type || 'other',
      url: doc.url || '',
    }));
  }
  user.kycStatus = 'PENDING';
  user.kycSubmittedAt = new Date();
  user.kycVerifiedAt = null;
  user.kycRejectionReason = '';
  await user.save();

  return sanitizeUser(user);
};

/**
 * Returns all contractors whose KYC is pending (admin review queue).
 */
const getPendingKyc = async (query = {}) => {
  const filter = { role: 'ROLE_CONTRACTOR', kycStatus: 'PENDING' };
  if (query.after) {
    filter.kycSubmittedAt = { $gte: new Date(query.after) };
  }
  return User.find(filter).select('-password').sort({ kycSubmittedAt: 1 });
};

/**
 * Approves or rejects a contractor's KYC submission.
 */
const reviewKyc = async (userId, decision) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  if (user.role !== 'ROLE_CONTRACTOR') {
    const error = new Error('Only contractors can be KYC-verified');
    error.statusCode = 400;
    throw error;
  }

  if (decision.status === 'VERIFIED') {
    user.kycStatus = 'VERIFIED';
    user.kycVerifiedAt = new Date();
    user.kycRejectionReason = '';
  } else if (decision.status === 'REJECTED') {
    user.kycStatus = 'REJECTED';
    user.kycVerifiedAt = null;
    user.kycRejectionReason = decision.reason || 'KYC submission rejected';
  } else {
    const error = new Error('Decision must be VERIFIED or REJECTED');
    error.statusCode = 400;
    throw error;
  }

  await user.save();
  return sanitizeUser(user);
};

module.exports = {
  submitKyc,
  getPendingKyc,
  reviewKyc,
};