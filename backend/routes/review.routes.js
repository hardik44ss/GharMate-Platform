const express = require('express');
const {
  create,
  me,
  byContractor,
} = require('../controllers/review.controller');
const auth = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');

const router = express.Router();

/**
 * Review Routes — mounted at /api/reviews
 *
 * GET  /api/reviews/me                        → contractor's own reviews (ROLE_CONTRACTOR)
 * GET  /api/reviews/contractor/:contractorId  → a contractor's reviews (any authenticated)
 * POST /api/reviews                           → leave a review (ROLE_CLIENT)
 */

router.get('/me', auth, authorize('ROLE_CONTRACTOR'), me);
router.get('/contractor/:contractorId', auth, byContractor);

router.post('/', auth, authorize('ROLE_CLIENT'), create);

module.exports = router;