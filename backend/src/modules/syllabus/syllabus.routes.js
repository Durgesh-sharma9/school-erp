import { Router } from 'express';
import {
  listSessions,
  createSession,
  updateSession,
  switchSession,
  archiveSession,
  deleteSession,
  importSessionData,
  listAcademicTerms,
  createAcademicTerm,
  updateAcademicTerm,
  deleteAcademicTerm,
  addVacationPeriod,
  deleteVacationPeriod,
  getSyllabusTree,
  linkSubjectToClass,
  updateSubjectTeacher,
  createChapter,
  updateChapter,
  deleteChapter,
  updateChapterProgress,
  getTeacherAssignedClasses,
  getTeacherClassDetail,
  getDashboardAnalytics,
  getTeacherDrilldown,
  getProgressionAnalytics,
  updatePacingSettings,
  getTeacherProgression,
  listExamPapers,
  getExamPaper,
  createExamPaper,
  updateExamPaper,
  deleteExamPaper,
  getExamNames,
  updateExamNames,
  getExamTemplate,
  saveExamTemplate,
  getTrainingCatalog,
  listTeacherCpd,
  getTeacherCpdDetail,
  getMyCpd,
  createTrainingRecord,
  updateTrainingRecord,
  deleteTrainingRecord,
} from './syllabus.controller.js';

const router = Router();

// 1. Academic Sessions & Post-Session Import
router.get('/sessions', listSessions);
router.post('/sessions', createSession);
router.post('/sessions/switch', switchSession);
router.post('/sessions/:id/switch', switchSession);
router.patch('/sessions/:id/archive', archiveSession);
router.patch('/sessions/:id', updateSession);
router.delete('/sessions/:id', deleteSession);
router.post('/sessions/import/:type', importSessionData);

// 2. Academic Timeline
router.get('/academic-terms', listAcademicTerms);
router.post('/academic-terms', createAcademicTerm);
router.patch('/academic-terms/:id', updateAcademicTerm);
router.delete('/academic-terms/:id', deleteAcademicTerm);
router.post('/academic-terms/:id/vacations', addVacationPeriod);
router.delete('/academic-terms/:id/vacations/:vacId', deleteVacationPeriod);

// 3. Syllabus Structure, Teacher Classes & Progress Workflow
router.get('/tree', getSyllabusTree);
router.post('/class-subjects', linkSubjectToClass);
router.patch('/class-subjects/:id/teacher', updateSubjectTeacher);
router.post('/chapters', createChapter);
router.patch('/chapters/:id', updateChapter);
router.delete('/chapters/:id', deleteChapter);
router.patch('/progress/chapters/:chapterId', updateChapterProgress);
router.get('/classes/assigned', getTeacherAssignedClasses);
router.get('/classes/:id', getTeacherClassDetail);

// 4. Dashboard & Pacing Analytics
router.get('/dashboard/analytics', getDashboardAnalytics);
router.get('/dashboard/teacher-progress/:teacherName', getTeacherDrilldown);
router.get('/progression/analytics', getProgressionAnalytics);
router.patch('/progression/settings', updatePacingSettings);
router.get('/progression/teacher', getTeacherProgression);

// 5. Exam Papers & Paper Header Template
router.get('/exam-papers/exam-names', getExamNames);
router.post('/exam-papers/exam-names', updateExamNames);
router.get('/exam-papers/template', getExamTemplate);
router.post('/exam-papers/template', saveExamTemplate);
router.get('/exam-papers', listExamPapers);
router.post('/exam-papers', createExamPaper);
router.get('/exam-papers/:id', getExamPaper);
router.patch('/exam-papers/:id', updateExamPaper);
router.delete('/exam-papers/:id', deleteExamPaper);

// 6. Teacher Training (CBSE 50h CPD)
router.get('/trainings/catalog', getTrainingCatalog);
router.get('/trainings/my', getMyCpd);
router.post('/trainings/my', createTrainingRecord);
router.get('/trainings/teacher/:teacherId', getTeacherCpdDetail);
router.get('/trainings', listTeacherCpd);
router.post('/trainings', createTrainingRecord);
router.patch('/trainings/:id', updateTrainingRecord);
router.delete('/trainings/:id', deleteTrainingRecord);

export default router;
