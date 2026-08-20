/**
 * Request body validators for auth endpoints.
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

module.exports = { validateRegisterInput, validateLoginInput };