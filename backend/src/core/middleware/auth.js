import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import prisma from '../../config/db.js';

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new ApiError(401, 'Unauthorized: No token provided');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'school_erp_super_secret_jwt_key_2026_webncode');
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        school: true
      }
    });

    if (!user) {
      throw new ApiError(401, 'Unauthorized: User not found or invalid token');
    }

    if (!user.isActive) {
      throw new ApiError(403, 'Account is deactivated. Contact administrator.');
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error.message || 'Invalid or expired token');
  }
});
