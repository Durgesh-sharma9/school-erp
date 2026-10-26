import { Router } from 'express';
import {
  // Dashboard & Analytics
  getDashboardStats,

  // Timetables Manager & Builder
  getTimetablesList,
  createTimetable,
  getTimetableDetail,
  updateTimetable,
  deleteTimetable,
  upsertTimetableSlot,
  deleteTimetableSlot,
  autoGenerateTimetable,

  // Daily Desk
  getDailyDeskData,
  markTeacherAttendance,
  createReplacementAssignment,
  getReplacementHistory,

  // Lesson Planning
  getLessonPlans,
  createLessonPlan,
  updateLessonPlan,
  addLessonPlanComment,
  deleteLessonPlan,

  // Daily Reports
  getDailyReports,
  submitDailyReport,

  // Homework
  getHomeworkList,
  createHomework,
  updateHomework,
  deleteHomework,

  // Preserved Legacy Endpoints
  getClassTimetable,
  getTeacherSubstitutions,
  assignSubstitution
} from './timetable.controller.js';

const router = Router();

// =================================================================
// 1. Dashboard & Analytics
// =================================================================
router.get('/dashboard-stats', getDashboardStats);
router.get('/analytics', getDashboardStats);

// =================================================================
// 2. Timetables Manager & Builder
// =================================================================
router.get('/timetables', getTimetablesList);
router.post('/timetables', createTimetable);
router.get('/timetables/:id', getTimetableDetail);
router.patch('/timetables/:id', updateTimetable);
router.delete('/timetables/:id', deleteTimetable);
router.post('/timetables/:id/slots', upsertTimetableSlot);
router.delete('/timetables/:id/slots/:slotId', deleteTimetableSlot);
router.post('/timetables/:id/auto-generate', autoGenerateTimetable);

// =================================================================
// 3. Daily Desk (Substitutions & Matrix)
// =================================================================
router.get('/daily-desk', getDailyDeskData);
router.post('/attendance', markTeacherAttendance);
router.post('/replacements', createReplacementAssignment);
router.get('/replacement-history', getReplacementHistory);

// =================================================================
// 4. Lesson Planning
// =================================================================
router.get('/lesson-plans', getLessonPlans);
router.post('/lesson-plans', createLessonPlan);
router.patch('/lesson-plans/:id', updateLessonPlan);
router.post('/lesson-plans/:id/comments', addLessonPlanComment);
router.delete('/lesson-plans/:id', deleteLessonPlan);

// =================================================================
// 5. Daily Reports
// =================================================================
router.get('/reports', getDailyReports);
router.post('/reports', submitDailyReport);

// =================================================================
// 6. Homework
// =================================================================
router.get('/homework', getHomeworkList);
router.post('/homework', createHomework);
router.patch('/homework/:id', updateHomework);
router.delete('/homework/:id', deleteHomework);

// =================================================================
// 7. Preserved Legacy Endpoints
// =================================================================
router.get('/class', getClassTimetable);
router.get('/substitutions', getTeacherSubstitutions);
router.post('/assign-substitution', assignSubstitution);

export default router;
