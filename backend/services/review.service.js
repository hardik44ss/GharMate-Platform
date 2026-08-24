const Review = require('../models/Review');
const Project = require('../models/Project');

/**
 * Review service — encapsulates review business logic.
 */

/**
 * Creates a review. Only the client who owns a COMPLETED project can
 * review the contractor (revieweeId) on that project.
 */
const createReview = async (reviewerId, data) => {
  const project = await Project.findById(data.projectId);
  if (!project) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }
  if (project.status !== 'COMPLETED') {
    const error = new Error('Only completed projects can be reviewed');
    error.statusCode = 400;
    throw error;
  }
  if (project.clientId.toString() !== reviewerId.toString()) {
    const error = new Error('Only the project client can leave a review');
    error.statusCode = 403;
    throw error;
  }

  const review = new Review({ ...data, reviewerId });
  await review.save();
  return review;
};

/**
 * Returns reviews written about a contractor.
 */
const getReviewsForContractor = async (contractorId) => {
  return Review.find({ revieweeId: contractorId })
    .populate('reviewerId', 'fullName email avatarUrl')
    .populate('projectId', 'title')
    .sort({ createdAt: -1 });
};

/**
 * Returns reviews for the authenticated contractor (their own reviews).
 */
const getMyReviews = async (contractorId) => {
  return Review.find({ revieweeId: contractorId })
    .populate('reviewerId', 'fullName email avatarUrl')
    .populate('projectId', 'title')
    .sort({ createdAt: -1 });
};

/**
 * Computes average rating + count for a contractor via aggregation.
 */
const getAverageRating = async (contractorId) => {
  const result = await Review.aggregate([
    { $match: { revieweeId: contractorId } },
    { $group: { _id: null, average: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  if (result.length === 0) {
    return { averageRating: 0, ratingsCount: 0 };
  }
  return {
    averageRating: Math.round(result[0].average * 10) / 10,
    ratingsCount: result[0].count,
  };
};

module.exports = {
  createReview,
  getReviewsForContractor,
  getMyReviews,
  getAverageRating,
};