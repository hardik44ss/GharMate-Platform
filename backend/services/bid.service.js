const Bid = require('../models/Bid');
const Project = require('../models/Project');

/**
 * Bid service — encapsulates bid business logic.
 */

/**
 * Creates a bid on a project (only allowed while project is OPEN).
 */
const createBid = async (contractorId, data) => {
  const project = await Project.findById(data.projectId);
  if (!project) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }
  if (project.status !== 'OPEN') {
    const error = new Error('Bids can only be placed on open projects');
    error.statusCode = 400;
    throw error;
  }

  const bid = new Bid({ ...data, contractorId });
  await bid.save();
  return bid;
};

/**
 * Returns all bids for a project (with contractor details).
 */
const getBidsForProject = async (projectId) => {
  return Bid.find({ projectId })
    .populate('contractorId', 'fullName email businessName avatarUrl')
    .sort({ createdAt: -1 });
};

/**
 * Returns a contractor's own bids (with project summary detail).
 */
const getMyBids = async (contractorId) => {
  return Bid.find({ contractorId })
    .populate('projectId', 'title status location budget')
    .sort({ createdAt: -1 });
};

/**
 * Returns a single bid by id.
 */
const getBidById = async (bidId) => {
  const bid = await Bid.findById(bidId)
    .populate('contractorId', 'fullName email businessName avatarUrl')
    .populate('projectId', 'title status clientId');
  if (!bid) {
    const error = new Error('Bid not found');
    error.statusCode = 404;
    throw error;
  }
  return bid;
};

/**
 * Updates a contractor's own bid, only while still PENDING.
 */
const updateBid = async (bidId, contractorId, data) => {
  const bid = await Bid.findOne({ _id: bidId, contractorId });
  if (!bid) {
    const error = new Error('Bid not found or you are not the owner');
    error.statusCode = 404;
    throw error;
  }
  if (bid.status !== 'PENDING') {
    const error = new Error('Only pending bids can be updated');
    error.statusCode = 400;
    throw error;
  }

  const allowed = ['amount', 'estimatedDays', 'message'];
  for (const field of allowed) {
    if (data[field] !== undefined) {
      bid[field] = data[field];
    }
  }
  await bid.save();
  return bid;
};

/**
 * Deletes a contractor's own bid, only while still PENDING.
 */
const deleteBid = async (bidId, contractorId) => {
  const bid = await Bid.findOne({ _id: bidId, contractorId });
  if (!bid) {
    const error = new Error('Bid not found or you are not the owner');
    error.statusCode = 404;
    throw error;
  }
  if (bid.status !== 'PENDING') {
    const error = new Error('Only pending bids can be deleted');
    error.statusCode = 400;
    throw error;
  }
  await bid.deleteOne();
  return { id: bidId };
};

/**
 * Accepts a bid (client action on their own project's bid).
 */
const acceptBid = async (bidId, clientId) => {
  const bid = await getBidById(bidId);
  const project = await Project.findById(bid.projectId);
  if (!project) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }
  if (project.clientId.toString() !== clientId.toString()) {
    const error = new Error('Only the project client can accept bids');
    error.statusCode = 403;
    throw error;
  }
  bid.status = 'ACCEPTED';
  await bid.save();
  return bid;
};

/**
 * Rejects a bid (client acts on their own project's bid).
 */
const rejectBid = async (bidId, clientId) => {
  const bid = await getBidById(bidId);
  const project = await Project.findById(bid.projectId);
  if (!project) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }
  if (project.clientId.toString() !== clientId.toString()) {
    const error = new Error('Only the project owner can reject bids');
    error.statusCode = 403;
    throw error;
  }
  bid.status = 'REJECTED';
  await bid.save();
  return bid;
};

module.exports = {
  createBid,
  getBidsForProject,
  getMyBids,
  getBidById,
  updateBid,
  deleteBid,
  acceptBid,
  rejectBid,
};