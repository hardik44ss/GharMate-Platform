const {
  createProject,
  getProjects,
  getMyProjects,
  getProjectWithStats,
  updateProject,
  deleteProject,
} = require('../services/project.service');
const {
  validateProjectCreate,
  validateProjectUpdate,
} = require('../utils/validators');

/**
 * Project Controller — route handlers for /api/projects.
 * Write actions require ROLE_CLIENT; reads require any authenticated user.
 */

/**
 * POST /api/projects — Client creates a project.
 */
const create = async (req, res, next) => {
  try {
    const validation = validateProjectCreate(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        error: { message: 'Validation failed', details: validation.errors },
      });
    }
    const project = await createProject(req.user._id, req.body);
    return res.status(201).json({ project });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/projects — list projects (filters: status, location, budget range).
 */
const list = async (req, res, next) => {
  try {
    const projects = await getProjects(req.query);
    return res.status(200).json({ projects });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/projects/:id — project detail with bids count + avg rating.
 */
const detail = async (req, res, next) => {
  try {
    const { project, bidsCount, averageRating } = await getProjectWithStats(req.params.id);
    return res.status(200).json({ project: { ...project.toObject(), bidsCount, averageRating } });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/projects/:id — Client updates their own project.
 */
const update = async (req, res, next) => {
  try {
    const validation = validateProjectUpdate(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        error: { message: 'Validation failed', details: validation.errors },
      });
    }
    const project = await updateProject(req.params.id, req.user._id, req.body);
    return res.status(200).json({ project });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/projects/:id — Client deletes their own project.
 */
const remove = async (req, res, next) => {
  try {
    const result = await deleteProject(req.params.id, req.user._id);
    return res.status(200).json({ message: 'Project deleted', projectId: result.id });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/projects/mine — list projects owned by the authenticated client.
 */
const myList = async (req, res, next) => {
  try {
    const projects = await getMyProjects(req.user._id);
    return res.status(200).json({ projects });
  } catch (error) {
    next(error);
  }
};

module.exports = { create, list, myList, detail, update, remove };