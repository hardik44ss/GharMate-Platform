/**
 * Role-Based Authorization Middleware (RBAC).
 *
 * Usage: router.get('/admin', auth, authorize('ROLE_ADMIN'), handler)
 *
 * Checks that req.user.role is in the list of allowed roles.
 * Returns 403 if the user's role is not permitted.
 *
 * Must be used AFTER the auth middleware (so req.user is populated).
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: { message: 'Authentication required' },
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: { message: 'Access denied — insufficient permissions' },
      });
    }

    next();
  };
};

module.exports = authorize;