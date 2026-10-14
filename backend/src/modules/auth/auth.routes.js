import { Router } from 'express';
import {
  login,
  getMe,
  switchRole,
  sendVerificationCode,
  verifyEmailCode,
  registerSchool
} from './auth.controller.js';
import { verifyJWT } from '../../core/middleware/auth.js';

const router = Router();

// Authentication
router.post('/login', login);
router.post('/switch-role', switchRole);
router.get('/me', verifyJWT, getMe);

// Self-Serve School Registration & Email Verification
router.post('/send-verification-code', sendVerificationCode);
router.post('/verify-code', verifyEmailCode);
router.post('/register-school', registerSchool);

export default router;
