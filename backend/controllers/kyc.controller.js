const {
  submitKyc,
  getPendingKyc,
  reviewKyc,
} = require('../services/kyc.service');
const {
  validateKycSubmit,
  validateKycReview,
} = require('../utils/validators');

/**
 * KYC Controller — route handlers for /api/kyc.
 * Contractors submit; admins review submissions.
 */

/**
 * POST /api/kyc/submit — Contractor submits KYC documents (mock upload).
 */
const submit = async (req, res, next) => {
  try {
    const validation = validateKycSubmit(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        error: { message: 'Validation failed', details: validation.errors },
      });
    }
    const user = await submitKyc(req.user._id, req.body.documents);
    return res.status(200).json({ message: 'KYC submitted for review', user });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/kyc/admin/pending — admin lists pending KYC submissions.
 */
const pending = async (req, res, next) => {
  try {
    const submissions = await getPendingKyc(req.query);
    return res.status(200).json({ kycSubmissions: submissions });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/kyc/admin/:userId — admin approves/rejects a KYC submission.
 */
const review = async (req, res, next) => {
  try {
    const validation = validateKycReview(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        error: { message: 'Validation failed', details: validation.errors },
      });
    }
    const user = await reviewKyc(req.params.userId, req.body);
    return res.status(200).json({ message: 'KYC status updated', user });
  } catch (error) {
    next(error);
  }
};

module.exports = { submit, pending, review };