const {
  createBid,
  getBidsForProject,
  getMyBids,
  updateBid,
  deleteBid,
  acceptBid,
  rejectBid,
} = require('../services/bid.service');
const {
  validateBidCreate,
  validateBidUpdate,
} = require('../utils/validators');
const Project = require('../models/Project');

/**
 * Bid Controller — route handlers for /api/bids.
 * Contractors create/update/delete their own bids; clients accept/reject.
 */

/**
 * POST /api/bids — Contractor places a bid on an OPEN project.
 */
const create = async (req, res, next) => {
  try {
    const validation = validateBidCreate(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        error: { message: 'Validation failed', details: validation.errors },
      });
    }
    const bid = await createBid(req.user._id, req.body);
    return res.status(201).json({ bid });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/bids/project/:projectId — all bids for a project.
 * Only the project's client may view them.
 */
const listForProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      throw error;
    }
    if (project.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: { message: 'Only the project client can view bids' },
      });
    }
    const bids = await getBidsForProject(req.params.projectId);
    return res.status(200).json({ bids });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/bids/:id — Contractor updates their own pending bid.
 */
const update = async (req, res, next) => {
  try {
    const validation = validateBidUpdate(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        error: { message: 'Validation failed', details: validation.errors },
      });
    }
    const bid = await updateBid(req.params.id, req.user._id, req.body);
    return res.status(200).json({ bid });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/bids/:id — Contractor deletes their own pending bid.
 */
const remove = async (req, res, next) => {
  try {
    const result = await deleteBid(req.params.id, req.user._id);
    return res.status(200).json({ message: 'Bid deleted', bidId: result.id });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/bids/:id/accept — Client accepts a bid on their project.
 */
const accept = async (req, res, next) => {
  try {
    const bid = await acceptBid(req.params.id, req.user._id);
    return res.status(200).json({ bid });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/bids/:id/reject — Client rejects a bid on their project.
 */
const reject = async (req, res, next) => {
  try {
    const bid = await rejectBid(req.params.id, req.user._id);
    return res.status(200).json({ bid });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/bids/mine — the authenticated contractor's own bids.
 */
const mine = async (req, res, next) => {
  try {
    const bids = await getMyBids(req.user._id);
    return res.status(200).json({ bids });
  } catch (error) {
    next(error);
  }
};

module.exports = { create, mine, listForProject, update, remove, accept, reject };