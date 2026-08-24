const express = require('express');
const {
  getProfile,
  updateProfile,
} = require('../controllers/user.controller');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * User Routes — mounted at /api/users
 *
 * GET  /api/users/profile   → Get authenticated user's own profile (JWT required)
 * PUT  /api/users/profile   → Update allowed profile fields (JWT required)
 */

router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);

module.exports = router;