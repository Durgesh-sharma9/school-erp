import express from 'express';
import {
  getAppUsers,
  updateAppUserPermissions,
  getReminders,
  createReminder,
  deleteReminder,
  getStudentGatePasses,
  createStudentGatePass,
  getVisitorEnquiries,
  createVisitorEnquiry,
  getPreAdmissions,
  createPreAdmission,
  getCalendarPlanning,
  createCalendarPlanning,
  getStudentAppPopups,
  createStudentAppPopup,
  getStaffGatePasses,
  createStaffGatePass,
  getVisitStaffMeetings,
  createVisitStaffMeeting,
  getStudentComplaints,
  createStudentComplaint,
  getStaffComplaints,
  createStaffComplaint
} from './front-office.controller.js';

const router = express.Router();

// App Users
router.get('/app-users', getAppUsers);
router.patch('/app-users/:id/permissions', updateAppUserPermissions);

// Reminders
router.get('/reminders', getReminders);
router.post('/reminders', createReminder);
router.delete('/reminders/:id', deleteReminder);

// Student Gate Pass
router.get('/student-gate-passes', getStudentGatePasses);
router.post('/student-gate-passes', createStudentGatePass);

// Visitor Enquiry
router.get('/visitor-enquiries', getVisitorEnquiries);
router.post('/visitor-enquiries', createVisitorEnquiry);

// Pre Admission
router.get('/pre-admissions', getPreAdmissions);
router.post('/pre-admissions', createPreAdmission);

// Calendar Planning
router.get('/calendar-planning', getCalendarPlanning);
router.post('/calendar-planning', createCalendarPlanning);

// Student App Popup
router.get('/student-app-popups', getStudentAppPopups);
router.post('/student-app-popups', createStudentAppPopup);

// Staff Gate Pass
router.get('/staff-gate-passes', getStaffGatePasses);
router.post('/staff-gate-passes', createStaffGatePass);

// Visit Staff Meeting
router.get('/visit-staff-meetings', getVisitStaffMeetings);
router.post('/visit-staff-meetings', createVisitStaffMeeting);

// Student Complaints
router.get('/student-complaints', getStudentComplaints);
router.post('/student-complaints', createStudentComplaint);

// Staff Complaints
router.get('/staff-complaints', getStaffComplaints);
router.post('/staff-complaints', createStaffComplaint);

export default router;
