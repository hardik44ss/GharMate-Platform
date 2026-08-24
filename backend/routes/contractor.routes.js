const express = require('express');
const {
  list,
  detail,
  getProfile,
  updateProfile,
} = require('../controllers/contractor.controller');
const auth = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');

const router = express.Router();

/**
 * Contractor Routes — mounted at /api/contractors
 *
 * GET  /api/contractors/profile   → Get authenticated contractor's own profile
 * PUT  /api/contractors/profile   → Update contractor-specific profile fields
 *
 * Both require: valid JWT + role ROLE_CONTRACTOR (clients get 403).
 */

router.get('/profile', auth, authorize('ROLE_CONTRACTOR'), getProfile);
router.put('/profile', auth, authorize('ROLE_CONTRACTOR'), updateProfile);

// ─── Public directory routes ────────────────────────────────────────────
// Registered AFTER the auth-protected /profile routes so the `:id` pattern
// never captures `profile`. No auth required — this powers the public
// contractor discovery page.
router.get('/', list);
router.get('/:id', detail);

module.exports = router;