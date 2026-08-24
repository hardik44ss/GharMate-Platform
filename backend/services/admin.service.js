const User = require('../models/User');
const Project = require('../models/Project');
const Bid = require('../models/Bid');
const Review = require('../models/Review');

/**
 * Admin service — dashboard stats and user management.
 */

/**
 * Returns aggregate platform counts (revenue is mocked for now).
 */
const getStats = async () => {
  const totalUsers = await User.countDocuments({});
  const totalContractors = await User.countDocuments({ role: 'ROLE_CONTRACTOR' });
  const totalClients = await User.countDocuments({ role: 'ROLE_CLIENT' });
  const totalProjects = await Project.countDocuments({});
  const totalBids = await Bid.countDocuments({});
  const totalReviews = await Review.countDocuments({});

  return {
    totalUsers,
    totalContractors,
    totalClients,
    totalProjects,
    totalBids,
    totalReviews,
    // Mock value until payments are implemented
    revenue: totalBids * 0,
  };
};

/**
 * Lists all users with optional filters.
 */
const getUsers = async (query = {}) => {
  const filter = {};

  if (query.role) {
    filter.role = query.role;
  }
  if (query.kycStatus) {
    filter.kycStatus = query.kycStatus;
  }
  if (query.isActive === 'true') {
    filter.isActive = true;
  } else if (query.isActive === 'false') {
    filter.isActive = false;
  }
  if (query.search) {
    filter.$or = [
      { fullName: { $regex: query.search, $options: 'i' } },
      { email: { $regex: query.search, $options: 'i' } },
    ];
  }

  return User.find(filter).select('-password').sort({ createdAt: -1 });
};

module.exports = {
  getStats,
  getUsers,
};