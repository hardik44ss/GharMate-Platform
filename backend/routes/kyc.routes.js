const express = require('express');
const {
  submit,
  pending,
  review,
} = require('../controllers/kyc.controller');
const auth = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');

const router = express.Router();

/**
 * KYC Routes — mounted at /api/kyc
 *
 * POST /api/kyc/submit       → contractor submits KYC (ROLE_CONTRACTOR)
 * GET  /api/kyc/admin/pending → admin lists pending submissions (ROLE_ADMIN)
 * PUT  /api/kyc/admin/:userId → admin approves/rejects (ROLE_ADMIN)
 */

router.post('/submit', auth, authorize('ROLE_CONTRACTOR'), submit);

router.get('/admin/pending', auth, authorize('ROLE_ADMIN'), pending);
router.put('/admin/:userId', auth, authorize('ROLE_ADMIN'), review);

module.exports = router;