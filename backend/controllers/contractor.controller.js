const {
  getContractorProfile: getContractorByService,
  updateContractorProfile: updateContractorByService,
} = require('../services/user.service');
const {
  listContractors: listContractorsByService,
  getContractorById: getContractorByIdByService,
} = require('../services/contractor.service');
const {
  validateContractorProfileUpdate,
} = require('../utils/validators');

/**
 * Contractor Controller — route handlers for authenticated contractor profile.
 *
 * getProfile     → GET /api/contractors/profile
 * updateProfile  → PUT /api/contractors/profile
 * Both require a valid JWT AND role ROLE_CONTRACTOR (auth + authorize middleware).
 */

/**
 * Return the authenticated contractor's own profile.
 */
const getProfile = async (req, res, next) => {
  try {
    const profile = await getContractorByService(req.user._id);
    return res.status(200).json({ user: profile });
  } catch (error) {
    next(error);
  }
};

/**
 * Update allowed contractor-specific profile fields.
 * Disallowed fields are rejected by validation and never applied.
 */
const updateProfile = async (req, res, next) => {
  try {
    const validation = validateContractorProfileUpdate(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        error: { message: 'Validation failed', details: validation.errors },
      });
    }

    const updated = await updateContractorByService(req.user._id, req.body);
    return res.status(200).json({ user: updated });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/contractors — public list of verified contractor directory entries.
 */
const list = async (req, res, next) => {
  try {
    const contractors = await listContractorsByService();
    return res.status(200).json({ contractors });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/contractors/:id — public single contractor directory entry.
 */
const detail = async (req, res, next) => {
  try {
    const contractor = await getContractorByIdByService(req.params.id);
    return res.status(200).json({ contractor });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  list,
  detail,
};