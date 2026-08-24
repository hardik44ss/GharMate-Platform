const express = require('express');
const {
  stats,
  users,
} = require('../controllers/admin.controller');
const auth = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');

const router = express.Router();

/**
 * Admin Routes — mounted at /api/admin (all require ROLE_ADMIN)
 *
 * GET /api/admin/stats → platform aggregate counts + mock revenue
 * GET /api/admin/users → list all users with filters (role, kycStatus, search)
 */

router.get('/stats', auth, authorize('ROLE_ADMIN'), stats);
router.get('/users', auth, authorize('ROLE_ADMIN'), users);

module.exports = router;