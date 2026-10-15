import { Router } from 'express';
import {
  getStudentLeaves,
  updateStudentLeaveStatus,
  deleteStudentLeave,
  getStaffLeaves,
  updateStaffLeaveStatus,
  deleteStaffLeave,
  applyLeave
} from './leave-management.controller.js';

const router = Router();

// Student leaves
router.get('/student-leaves', getStudentLeaves);
router.put('/student-leaves/:id/status', updateStudentLeaveStatus);
router.delete('/student-leaves/:id', deleteStudentLeave);

// Staff leaves
router.get('/staff-leaves', getStaffLeaves);
router.put('/staff-leaves/:id/status', updateStaffLeaveStatus);
router.delete('/staff-leaves/:id', deleteStaffLeave);

// Apply leave
router.post('/apply', applyLeave);

export default router;
