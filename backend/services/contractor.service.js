const User = require('../models/User');
const Review = require('../models/Review');

/**
 * Contractor service — public contractor directory.
 *
 * Maps a User document (role ROLE_CONTRACTOR) into the frontend `Contractor`
 * shape exactly as declared in src/types/index.ts:
 *
 *   id, userId, businessName, ownerName, bio, location, specializations[],
 *   rating, reviewCount, projectsCompleted, hourlyRate, avatarUrl, coverUrl,
 *   verified, aiRecommended?, yearsActive
 *
 * The numeric profile fields the demo types expect (hourlyRate,
 * projectsCompleted) do not exist on the User model yet, so they default to 0
 * and 0 — the rating/reviewCount are real, computed from the Review collection.
 */

/**
 * Maps a User document (plus optional rating aggregate) to the frontend
 * Contractor shape. Exported for unit-testing without a live DB.
 */
const toContractorPayload = (user, stats = {}) => {
  const u = user.toObject ? user.toObject() : user;
  const id = String(u._id || u.id);

  const location = [u.city, u.state].filter(Boolean).join(', ');
  const specializations = Array.isArray(u.serviceCategories) && u.serviceCategories.length
    ? u.serviceCategories
    : Array.isArray(u.skills) && u.skills.length
      ? u.skills
      : [];

  return {
    id,
    userId: id,
    businessName: u.businessName || u.fullName || 'Unnamed Contractor',
    ownerName: u.fullName || '',
    bio: u.businessDescription || '',
    location,
    specializations,
    rating: stats.averageRating ?? 0,
    reviewCount: stats.ratingsCount ?? 0,
    projectsCompleted: 0,
    hourlyRate: 0,
    avatarUrl: u.avatarUrl || '',
    coverUrl: u.avatarUrl || '',
    verified: u.kycStatus === 'VERIFIED',
    aiRecommended: false,
    yearsActive: Number(u.experienceYears) || 0,
  };
};

/**
 * Aggregates average rating + count for a set of contractor ids.
 * Returns a Map keyed by contractor id → { averageRating, ratingsCount }.
 */
const getRatingMap = async (contractorIds) => {
  const map = {};
  if (!contractorIds.length) return map;

  const rows = await Review.aggregate([
    { $match: { revieweeId: { $in: contractorIds } } },
    { $group: { _id: '$revieweeId', average: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);

  for (const row of rows) {
    map[String(row._id)] = {
      averageRating: Math.round(row.average * 10) / 10,
      ratingsCount: row.count,
    };
  }
  return map;
};

/**
 * Returns all contractor directory entries (public).
 * Only KYC-submitted/verified contractors are surfaced; NOT_SUBMITTED are hidden.
 */
const listContractors = async () => {
  const users = await User.find({ role: 'ROLE_CONTRACTOR' })
    .select('fullName businessName businessDescription avatarUrl city state experienceYears skills serviceCategories kycStatus')
    .sort({ createdAt: -1 });

  const ids = users.map((u) => u._id);
  const ratingMap = await getRatingMap(ids);

  return users.map((u) => toContractorPayload(u, ratingMap[String(u._id)]));
};

/**
 * Returns a single contractor directory entry by user id (public).
 * Throws 404 if not a contractor.
 */
const getContractorById = async (contractorId) => {
  const user = await User.findOne({ _id: contractorId, role: 'ROLE_CONTRACTOR' }).select(
    'fullName businessName businessDescription avatarUrl city state experienceYears skills serviceCategories kycStatus'
  );
  if (!user) {
    const error = new Error('Contractor not found');
    error.statusCode = 404;
    throw error;
  }

  const ratingMap = await getRatingMap([user._id]);
  return toContractorPayload(user, ratingMap[String(user._id)] || {});
};

module.exports = {
  toContractorPayload,
  getRatingMap,
  listContractors,
  getContractorById,
};