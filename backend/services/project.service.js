const Project = require('../models/Project');
const Bid = require('../models/Bid');
const Review = require('../models/Review');

/**
 * Project service — encapsulates project business logic.
 */

/**
 * Creates a new project for a client (creates bid & review reference).
 */
const createProject = async (clientId, data) => {
  const project = new Project({ ...data, clientId });
  await project.save();
  return project;
};

/**
 * Returns the projects owned by a specific client (the authenticated user).
 */
const getMyProjects = async (userId) => {
  return Project.find({ clientId: userId })
    .populate('clientId', 'fullName email')
    .sort({ createdAt: -1 });
};

/**
 * Returns projects with optional filters: status, location, budget range.
 */
const getProjects = async (query = {}) => {
  const filter = {};

  if (query.status) {
    filter.status = query.status;
  }

  if (query.location) {
    filter.location = { $regex: query.location, $options: 'i' };
  }

  if (query.minBudget !== undefined || query.maxBudget !== undefined) {
    filter.budget = {};
    if (query.minBudget !== undefined) filter.budget.$gte = Number(query.minBudget);
    if (query.maxBudget !== undefined) filter.budget.$lte = Number(query.maxBudget);
  }

  return Project.find(filter)
    .populate('clientId', 'fullName email')
    .sort({ createdAt: -1 });
};

/**
 * Finds a project by id, throwing 404 if not found.
 */
const getProjectById = async (projectId) => {
  const project = await Project.findById(projectId).populate('clientId', 'fullName email');
  if (!project) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }
  return project;
};

/**
 * Adds bids count and average rating info to project detail.
 */
const getProjectWithStats = async (projectId) => {
  const project = await getProjectById(projectId);
  const bidsCount = await Bid.countDocuments({ projectId: project._id });

  const ratingAgg = await Review.aggregate([
    { $match: { projectId: project._id } },
    { $group: { _id: null, average: { $avg: '$rating' } } },
  ]);
  const averageRating = ratingAgg.length > 0 ? Math.round(ratingAgg[0].average * 10) / 10 : 0;

  return { project, bidsCount, averageRating };
};

/**
 * Updates a project only if the caller is the owner (clientId matches).
 */
const updateProject = async (projectId, clientId, data) => {
  const project = await Project.findOne({ _id: projectId, clientId });
  if (!project) {
    const error = new Error('Project not found or you are not the owner');
    error.statusCode = 404;
    throw error;
  }

  const allowed = ['title', 'description', 'budget', 'location', 'status'];
  for (const field of allowed) {
    if (data[field] !== undefined) {
      project[field] = data[field];
    }
  }
  await project.save();
  return project;
};

/**
 * Deletes a project only if it belongs to the client.
 */
const deleteProject = async (projectId, clientId) => {
  const project = await Project.findOne({ _id: projectId, clientId });
  if (!project) {
    const error = new Error('Project not found or you are not the owner');
    error.statusCode = 404;
    throw error;
  }
  await project.deleteOne();
  return { id: projectId };
};

module.exports = {
  createProject,
  getProjects,
  getMyProjects,
  getProjectById,
  getProjectWithStats,
  updateProject,
  deleteProject,
};