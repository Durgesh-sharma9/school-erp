import { ApiError } from '../utils/apiError.js';

/**
 * Restricts route access to specified roles
 * @param  {...string} roles - e.g. 'SUPER_ADMIN', 'SCHOOL_ADMIN', 'ACCOUNTANT', 'TEACHER'
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Unauthorized: User not authenticated'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, `Forbidden: Role [${req.user.role}] does not have permission to access this resource`));
    }

    next();
  };
};
