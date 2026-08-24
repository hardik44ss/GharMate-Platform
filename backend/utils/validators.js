/**
 * Request body validators for auth and user-profile endpoints.
 * Each validator returns { isValid, errors } where errors is null if valid.
 */

const validateRegisterInput = (body) => {
  const errors = {};
  const { fullName, email, password, role } = body;

  if (!fullName || fullName.trim().length < 2) {
    errors.fullName = 'Full name must be at least 2 characters';
  }

  if (!email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    errors.email = 'Please provide a valid email address';
  }

  if (!password || password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }

  // Only CLIENT and CONTRACTOR can self-register; ADMIN must be seeded
  const validRoles = ['ROLE_CLIENT', 'ROLE_CONTRACTOR'];
  if (role && !validRoles.includes(role)) {
    errors.role = 'Invalid role';
  }

  return {
    errors: Object.keys(errors).length > 0 ? errors : null,
    isValid: Object.keys(errors).length === 0,
  };
};

const validateLoginInput = (body) => {
  const errors = {};
  const { email, password } = body;

  if (!email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    errors.email = 'Please provide a valid email address';
  }

  if (!password) {
    errors.password = 'Password is required';
  }

  return {
    errors: Object.keys(errors).length > 0 ? errors : null,
    isValid: Object.keys(errors).length === 0,
  };
};

/**
 * Validates profile update payload for PUT /api/users/profile.
 * Only fullName and avatarUrl may be updated. Disallowed immutable fields
 * (password, role, email, _id, createdAt) are rejected with errors.
 */
const validateProfileUpdate = (body) => {
  const errors = {};

  // Fields that self-service users must not be able to change.
  const disallowed = ['password', 'role', 'email', '_id', 'createdAt'];
  for (const field of disallowed) {
    if (body[field] !== undefined) {
      errors[field] = `Field '${field}' cannot be updated`;
    }
  }

  if (body.fullName !== undefined) {
    if (typeof body.fullName !== 'string' || body.fullName.trim().length < 2) {
      errors.fullName = 'Full name must be at least 2 characters';
    } else if (body.fullName.trim().length > 100) {
      errors.fullName = 'Full name cannot exceed 100 characters';
    }
  }

  if (body.avatarUrl !== undefined) {
    if (typeof body.avatarUrl !== 'string') {
      errors.avatarUrl = 'avatarUrl must be a string';
    } else if (body.avatarUrl !== '') {
      const validUrl = /^https?:\/\/(.+)/.test(body.avatarUrl);
      if (!validUrl) {
        errors.avatarUrl = 'Please provide a valid http(s) URL for avatarUrl';
      }
    }
  }

  return {
    errors: Object.keys(errors).length > 0 ? errors : null,
    isValid: Object.keys(errors).length === 0,
  };
};

/**
 * Validates contractor profile update payload for PUT /api/contractors/profile.
 * Allows contractor-specific fields. Disallowed immutable fields
 * (_id, email, password, role, kycStatus, isActive, createdAt) are rejected.
 */
const validateContractorProfileUpdate = (body) => {
  const errors = {};

  const allowed = [
    'businessName',
    'businessDescription',
    'phone',
    'city',
    'state',
    'experienceYears',
    'skills',
    'serviceCategories',
  ];

  // Reject any field not in the allowed list (covers disallowed immutable
  // fields such as _id, email, password, role, kycStatus, isActive, createdAt,
  // as well as any unknown/extra fields).
  for (const key of Object.keys(body)) {
    if (!allowed.includes(key)) {
      errors.invalidField = `Field '${key}' is not allowed`;
      break;
    }
  }

  const stringField = (name, maxLen, required) => {
    if (body[name] === undefined) return;
    const val = body[name];
    if (typeof val !== 'string') {
      errors[name] = `${name} must be a string`;
      return;
    }
    if (required && val.trim().length < 2) {
      errors[name] = `${name} must be at least 2 characters`;
      return;
    }
    if (val.trim().length > maxLen) {
      errors[name] = `${name} cannot exceed ${maxLen} characters`;
    }
  };

  stringField('businessName', 100, false);
  stringField('businessDescription', 1000, false);
  stringField('phone', 20, false);
  stringField('city', 100, false);
  stringField('state', 100, false);

  if (body.experienceYears !== undefined) {
    if (typeof body.experienceYears !== 'number' || !Number.isInteger(body.experienceYears)) {
      errors.experienceYears = 'experienceYears must be an integer';
    } else if (body.experienceYears < 0) {
      errors.experienceYears = 'experienceYears cannot be negative';
    } else if (body.experienceYears > 100) {
      errors.experienceYears = 'experienceYears cannot exceed 100';
    }
  }

  const stringArray = (name) => {
    if (body[name] === undefined) return;
    const val = body[name];
    if (!Array.isArray(val)) {
      errors[name] = `${name} must be an array of strings`;
      return;
    }
    for (const item of val) {
      if (typeof item !== 'string' || !item.trim()) {
        errors[name] = `${name} must contain only non-empty strings`;
        break;
      }
    }
  };

  stringArray('skills');
  stringArray('serviceCategories');

  return {
    errors: Object.keys(errors).length > 0 ? errors : null,
    isValid: Object.keys(errors).length === 0,
  };
};

/**
 * Validates project creation payload (POST /api/projects).
 */
const validateProjectCreate = (body) => {
  const errors = {};

  if (!body.title || body.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters';
  } else if (body.title.trim().length > 200) {
    errors.title = 'Title cannot exceed 200 characters';
  }

  if (!body.description || body.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters';
  } else if (body.description.trim().length > 5000) {
    errors.description = 'Description cannot exceed 5000 characters';
  }

  if (body.budget === undefined || body.budget === null || isNaN(Number(body.budget))) {
    errors.budget = 'Budget is required and must be a number';
  } else if (Number(body.budget) < 0) {
    errors.budget = 'Budget cannot be negative';
  }

  if (!body.location || body.location.trim().length < 2) {
    errors.location = 'Location must be at least 2 characters';
  } else if (body.location.trim().length > 200) {
    errors.location = 'Location cannot exceed 200 characters';
  }

  return {
    errors: Object.keys(errors).length > 0 ? errors : null,
    isValid: Object.keys(errors).length === 0,
  };
};

/**
 * Validates project update payload (PUT /api/projects/:id).
 * Partial updates allowed; status must be a valid enum value.
 */
const validateProjectUpdate = (body) => {
  const errors = {};

  const allowed = ['title', 'description', 'budget', 'location', 'status'];
  const hasAllowed = allowed.some((f) => body[f] !== undefined);
  if (!hasAllowed) {
    errors.general = 'No updatable fields provided';
    return { errors, isValid: false };
  }

  if (body.status !== undefined && !['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].includes(body.status)) {
    errors.status = 'Status must be OPEN, IN_PROGRESS, COMPLETED, or CANCELLED';
  }

  return {
    errors: Object.keys(errors).length > 0 ? errors : null,
    isValid: Object.keys(errors).length === 0,
  };
};
/**
 * Validates bid creation payload (POST /api/bids).
 */
const validateBidCreate = (body) => {
  const errors = {};

  if (!body.projectId) {
    errors.projectId = 'Project is required';
  }

  if (body.amount === undefined || body.amount === null || isNaN(Number(body.amount))) {
    errors.amount = 'Bid amount is required and must be a number';
  } else if (Number(body.amount) <= 0) {
    errors.amount = 'Bid amount must be greater than 0';
  }

  if (body.estimatedDays === undefined || body.estimatedDays === null || isNaN(Number(body.estimatedDays))) {
    errors.estimatedDays = 'Estimated days is required and must be a number';
  } else if (Number(body.estimatedDays) < 1) {
    errors.estimatedDays = 'Estimated days must be at least 1';
  }

  if (body.message !== undefined && body.message.length > 2000) {
    errors.message = 'Message cannot exceed 2000 characters';
  }

  return {
    errors: Object.keys(errors).length > 0 ? errors : null,
    isValid: Object.keys(errors).length === 0,
  };
};

/**
 * Validates bid update payload (PUT /api/bids/:id).
 * Only amount, estimatedDays, and message may be updated.
 */
const validateBidUpdate = (body) => {
  const errors = {};
  const allowed = ['amount', 'estimatedDays', 'message'];
  const hasAllowed = allowed.some((f) => body[f] !== undefined);
  if (!hasAllowed) {
    errors.general = 'No valid fields provided';
    return { errors, isValid: false };
  }

  if (body.amount !== undefined && (isNaN(Number(body.amount)) || Number(body.amount) <= 0)) {
    errors.amount = 'Amount must be a number greater than 0';
  }
  if (body.estimatedDays !== undefined && (isNaN(Number(body.estimatedDays)) || Number(body.estimatedDays) < 1)) {
    errors.estimatedDays = 'Estimated days must be at least 1';
  }
  if (body.message !== undefined && body.message.length > 2000) {
    errors.message = 'Message cannot exceed 2000 characters';
  }

  return {
    errors: Object.keys(errors).length > 0 ? errors : null,
    isValid: Object.keys(errors).length === 0,
  };
};
/**
 * Validates review creation payload (POST /api/reviews).
 */
const validateReviewCreate = (body) => {
  const errors = {};

  if (!body.projectId) {
    errors.projectId = 'Project is required';
  }
  if (!body.revieweeId) {
    errors.revieweeId = 'Reviewee is required';
  }

  if (body.rating === undefined || body.rating === null || isNaN(Number(body.rating))) {
    errors.rating = 'Rating is required and must be a number';
  } else {
    const rating = Number(body.rating);
    if (rating < 1 || rating > 5) {
      errors.rating = 'Rating must be between 1 and 5';
    }
  }

  if (body.comment !== undefined && body.comment.length > 1000) {
    errors.comment = 'Comment cannot exceed 1000 characters';
  }

  return {
    errors: Object.keys(errors).length > 0 ? errors : null,
    isValid: Object.keys(errors).length === 0,
  };
};

/**
 * Validates KYC submission payload (POST /api/kyc/submit).
 * documents is an array of { type, url } objects (mock upload).
 */
const validateKycSubmit = (body) => {
  const errors = {};

  if (!body.documents || !Array.isArray(body.documents)) {
    errors.documents = 'documents must be a non-empty array';
  } else if (body.documents.length === 0) {
    errors.documents = 'At least one document is required';
  } else {
    body.documents.forEach((doc, i) => {
      if (!doc || typeof doc !== 'object') {
        errors[`documents[${i}]`] = 'Each document must be an object';
      } else {
        if (!doc.type || !['government_id', 'license', 'certificate', 'other'].includes(doc.type)) {
          errors[`documents[${i}].type`] = 'Type must be government_id, license, certificate, or other';
        }
        if (!doc.url) {
          errors[`documents[${i}].url`] = 'URL is required';
        } else if (!/^https?:\/\/(.+)/.test(doc.url)) {
          errors[`documents[${i}].url`] = 'URL must be a valid http(s) URL';
        }
      }
    });
  }

  return {
    errors: Object.keys(errors).length > 0 ? errors : null,
    isValid: Object.keys(errors).length === 0,
  };
};

/**
 * Validates KYC review payload (PUT /api/kyc/admin/:userId).
 */
const validateKycReview = (body) => {
  const errors = {};

  if (!body.status || !['VERIFIED', 'REJECTED'].includes(body.status)) {
    errors.status = 'Status must be VERIFIED or REJECTED';
  }
  if (body.status === 'REJECTED' && (!body.reason || body.reason.trim().length < 5)) {
    errors.reason = 'A rejection reason of at least 5 characters is required';
  }

  return {
    errors: Object.keys(errors).length > 0 ? errors : null,
    isValid: Object.keys(errors).length === 0,
  };
};
module.exports = {
  validateRegisterInput,
  validateLoginInput,
  validateProfileUpdate,
  validateContractorProfileUpdate,
  validateProjectCreate,
  validateProjectUpdate,
  validateBidCreate,
  validateBidUpdate,
  validateReviewCreate,
  validateKycSubmit,
  validateKycReview,
};