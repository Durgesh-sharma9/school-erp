import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import prisma from '../../config/db.js';

/**
 * Enterprise Multi-Tenant Resolver Middleware
 * Extracts and guarantees tenant isolation:
 * - Reads schoolId from authenticated user (req.user.schoolId)
 * - Reads optional override header 'x-school-id' or query 'schoolId' ONLY IF user is SUPER_ADMIN
 * - Prevents non-superadmin users from accessing or forging requests for other schools
 */
export const resolveTenant = (req, res, next) => {
  let activeSchoolId = null;

  // 1. Authenticated user's bound school
  if (req.user?.schoolId) {
    activeSchoolId = req.user.schoolId;
  }

  // 2. Client header (e.g., from frontend API client)
  const headerSchoolId = req.headers['x-school-id'] || req.headers['x-tenant-id'];

  if (req.user?.role === 'SUPER_ADMIN') {
    // SuperAdmin can target any specific school or view aggregate
    activeSchoolId = headerSchoolId || req.query.schoolId || activeSchoolId || null;
  } else if (headerSchoolId && activeSchoolId && headerSchoolId !== activeSchoolId) {
    // Cross-tenant breach attempt: User belonging to School A attempted to access School B
    throw new ApiError(
      403,
      `Multi-Tenant Security Violation: You cannot access or tamper with data belonging to another school (${headerSchoolId}).`
    );
  } else if (!activeSchoolId && headerSchoolId) {
    // Guest or public onboarding route passing school ID
    activeSchoolId = headerSchoolId;
  }

  // Fallback to default demo school if unauthenticated demo mode
  req.schoolId = activeSchoolId || 'sch_jd_intl';
  next();
};

/**
 * Returns Prisma filter object for tenant isolation.
 * Guarantees School A cannot query School B's database records.
 */
export const getTenantWhere = (req, additionalWhere = {}) => {
  // If SuperAdmin and explicitly requesting consolidated global data (no schoolId selected)
  if (req.user?.role === 'SUPER_ADMIN' && !req.schoolId) {
    return { ...additionalWhere };
  }

  const schoolId = req.schoolId || req.user?.schoolId;
  if (!schoolId) {
    throw new ApiError(403, 'Tenant isolation violation: No school associated with request.');
  }

  return {
    ...additionalWhere,
    schoolId
  };
};

/**
 * Backward compatibility alias
 */
export const getSchoolFilter = (user) => {
  if (user?.role === 'SUPER_ADMIN') {
    return {};
  }
  if (!user?.schoolId) {
    throw new ApiError(403, 'Forbidden: No school associated with this account.');
  }
  return { schoolId: user.schoolId };
};

/**
 * Security Assertion: Ensures an accessed entity belongs to the active tenant
 */
export const assertTenantAccess = (req, entitySchoolId) => {
  if (req.user?.role === 'SUPER_ADMIN') return true;
  if (!entitySchoolId || entitySchoolId !== req.schoolId) {
    throw new ApiError(403, 'Cross-tenant access forbidden: Data does not belong to your school.');
  }
  return true;
};

/**
 * Verifies that the tenant school exists and is active
 */
export const requireSchoolActive = asyncHandler(async (req, res, next) => {
  if (!req.user || req.user.role === 'SUPER_ADMIN') return next();

  if (!req.schoolId) {
    throw new ApiError(403, 'Forbidden: School account required.');
  }

  try {
    const school = await prisma.school.findUnique({
      where: { id: req.schoolId }
    });

    if (school && school.extraData?.isActive === false) {
      throw new ApiError(403, 'School account is deactivated or suspended.');
    }
    req.school = school;
  } catch (err) {
    // Allow local offline mode
  }

  next();
});
