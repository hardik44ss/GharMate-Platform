const {
  createReview,
  getMyReviews,
  getReviewsForContractor,
  getAverageRating,
} = require('../services/review.service');
const {
  validateReviewCreate,
} = require('../utils/validators');

/**
 * Review Controller — route handlers for /api/reviews.
 * Clients create reviews; contractors read their own; anyone reads a contractor's.
 */

/**
 * POST /api/reviews — Client leaves a review after project completion.
 */
const create = async (req, res, next) => {
  try {
    const validation = validateReviewCreate(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        error: { message: 'Validation failed', details: validation.errors },
      });
    }
    const review = await createReview(req.user._id, req.body);
    return res.status(201).json({ review });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/reviews/me — the authenticated contractor's own reviews + rating.
 */
const me = async (req, res, next) => {
  try {
    const reviews = await getMyReviews(req.user._id);
    const rating = await getAverageRating(req.user._id);
    return res.status(200).json({ reviews, ...rating });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/reviews/contractor/:contractorId — any authenticated user
 * can view a contractor's reviews and average rating.
 */
const byContractor = async (req, res, next) => {
  try {
    const reviews = await getReviewsForContractor(req.params.contractorId);
    const rating = await getAverageRating(req.params.contractorId);
    return res.status(200).json({ reviews, ...rating });
  } catch (error) {
    next(error);
  }
};

module.exports = { create, me, byContractor };