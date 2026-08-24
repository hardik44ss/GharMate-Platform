const {
  getStats,
  getUsers,
} = require('../services/admin.service');

/**
 * Admin Controller — route handlers for /api/admin (ROLE_ADMIN only).
 */

/**
 * GET /api/admin/stats — platform aggregate counts + mock revenue.
 */
const stats = async (req, res, next) => {
  try {
    const data = await getStats();
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/users — list all users with optional filters.
 */
const users = async (req, res, next) => {
  try {
    const users = await getUsers(req.query);
    return res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

module.exports = { stats, users };