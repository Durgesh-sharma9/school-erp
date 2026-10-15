import express from 'express';
import {
  getBranches,
  createBranch,
  getDepartments,
  createDepartment,
  getDesignations,
  createDesignation,
  getAllowances,
  updateAllowances,
  getLeaveSetup,
  createLeaveSetup,
  getShifts,
  createShift,
  getStaffList,
  createStaff,
  getStaffAttendance,
  getAdvanceSalaries,
  createAdvanceSalary,
  getGeneratedSalaries,
  generateSalariesForMonth
} from './payroll.controller.js';

const router = express.Router();

// Masters
router.get('/branches', getBranches);
router.post('/branches', createBranch);

router.get('/departments', getDepartments);
router.post('/departments', createDepartment);

router.get('/designations', getDesignations);
router.post('/designations', createDesignation);

router.get('/allowances', getAllowances);
router.post('/allowances', updateAllowances);

router.get('/leave-setup', getLeaveSetup);
router.post('/leave-setup', createLeaveSetup);

router.get('/shifts', getShifts);
router.post('/shifts', createShift);

router.get('/staff', getStaffList);
router.post('/staff', createStaff);

router.get('/attendance', getStaffAttendance);

router.get('/advance', getAdvanceSalaries);
router.post('/advance', createAdvanceSalary);

router.get('/salary', getGeneratedSalaries);
router.post('/salary/generate', generateSalariesForMonth);

export default router;
