const express = require('express');
const {
  create,
  list,
  myList,
  detail,
  update,
  remove,
} = require('../controllers/project.controller');
const auth = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');

const router = express.Router();

/**
 * Project Routes — mounted at /api/projects
 *
 * GET    /api/projects        → list all projects (any authenticated user)
 * GET    /api/projects/:id    → project detail + bids count + avg rating
 * POST   /api/projects        → create project (ROLE_CLIENT)
 * PUT    /api/projects/:id    → update own project (ROLE_CLIENT)
 * DELETE /api/projects/:id    → delete own project (ROLE_CLIENT)
 */

router.get('/', auth, list);
router.get('/mine', auth, myList);
router.get('/:id', auth, detail);

router.post('/', auth, authorize('ROLE_CLIENT'), create);
router.put('/:id', auth, authorize('ROLE_CLIENT'), update);
router.delete('/:id', auth, authorize('ROLE_CLIENT'), remove);

module.exports = router;