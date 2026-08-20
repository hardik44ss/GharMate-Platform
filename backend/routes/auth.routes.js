const express = require('express');
const { register, login, getProfile } = require('../controllers/auth.controller');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * Auth Routes — mounted at /api/auth
 *
 * POST   /api/auth/register   → Register a new user (CLIENT/CONTRACTOR)
 * POST   /api/auth/login      → Login with email + password → { token, user }
 * GET    /api/auth/profile    → Get current user profile (requires JWT)
 */

router.post('/register', register);
router.post('/login', login);
router.get('/profile', auth, getProfile);

module.exports = router;