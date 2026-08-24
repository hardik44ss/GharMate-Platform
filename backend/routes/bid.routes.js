const express = require('express');
const {
  create,
  mine,
  listForProject,
  update,
  remove,
  accept,
  reject,
} = require('../controllers/bid.controller');
const auth = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');

const router = express.Router();

/**
 * Bid Routes — mounted at /api/bids
 *
 * POST   /api/bids                    → create bid (ROLE_CONTRACTOR)
 * GET    /api/bids/project/:projectId → bids for a project (project client)
 * PUT    /api/bids/:id                → update own pending bid (ROLE_CONTRACTOR)
 * DELETE /api/bids/:id                → delete own pending bid (ROLE_CONTRACTOR)
 * PATCH  /api/bids/:id/accept         → accept bid (ROLE_CLIENT, project owner)
 * PATCH  /api/bids/:id/reject         → reject bid (ROLE_CLIENT, project owner)
 */

router.post('/', auth, authorize('ROLE_CONTRACTOR'), create);
router.get('/mine', auth, authorize('ROLE_CONTRACTOR'), mine);
router.get('/project/:projectId', auth, listForProject);
router.put('/:id', auth, authorize('ROLE_CONTRACTOR'), update);
router.delete('/:id', auth, authorize('ROLE_CONTRACTOR'), remove);
router.patch('/:id/accept', auth, authorize('ROLE_CLIENT'), accept);
router.patch('/:id/reject', auth, authorize('ROLE_CLIENT'), reject);

module.exports = router;