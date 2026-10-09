import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import prisma from '../../config/db.js';

/**
 * Returns Prisma filter object for tenant isolation.
 * - If user is SUPER_ADMIN: returns {} (Global system access)
 * - Otherwise: returns { schoolId: req.user.schoolId }
 */
export const getSchoolFilter = (user) => {
  if (user.role === 'SUPER_ADMIN') {
    return {};
  }

  if (!user.schoolId) {
    throw new ApiError(403, 'Forbidden: No school associated with this account.');
  }

  return { schoolId: user.schoolId };
};

/**
 * Verifies that the tenant school exists and is active/paid
 */
export const requireSchoolActive = asyncHandler(async (req, res, next) => {
  if (!req.user) return next();

  if (req.user.role === 'SUPER_ADMIN') return next();

  if (!req.user.schoolId) {
    throw new ApiError(403, 'Forbidden: School account required.');
  }

  const school = req.user.school || await prisma.school.findUnique({
    where: { id: req.user.schoolId },
    include: { plan: true }
  });

  if (!school) {
    throw new ApiError(404, 'School not found.');
  }

  if (!school.isActive) {
    throw new ApiError(403, 'School account is deactivated or suspended.');
  }

  // Check subscription expiry if configured
  if (school.planExpiresAt && new Date(school.planExpiresAt) < new Date()) {
    throw new ApiError(402, 'School subscription has expired. Please renew the plan.');
  }

  req.school = school;
  next();
});
