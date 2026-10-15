import express from 'express';
import {
  getExamTerms,
  createExamTerm,
  getExamNames,
  createExamName,
  getExamGroups,
  createExamGroup,
  getGradeMaster,
  createGradeMaster,
  getLinkedStudentSubjects,
  getPrcComments,
  updatePrcComment,
  getMarksEntryLocks,
  toggleMarksEntryLock,
  getReportRemarks,
  createReportRemark,
  deleteReportRemark,
  getBlankExamFormatData,
  getStudentSignatureSheetData,
  getToppersListData
} from './examination.controller.js';

const router = express.Router();

// Master Endpoints
router.get('/terms', getExamTerms);
router.post('/terms', createExamTerm);

router.get('/names', getExamNames);
router.post('/names', createExamName);

router.get('/groups', getExamGroups);
router.post('/groups', createExamGroup);

router.get('/grades', getGradeMaster);
router.post('/grades', createGradeMaster);

router.get('/links', getLinkedStudentSubjects);

router.get('/prc-comments', getPrcComments);
router.put('/prc-comments/:id', updatePrcComment);

router.get('/locks', getMarksEntryLocks);
router.put('/locks/:id/toggle', toggleMarksEntryLock);

// Reports Endpoints
router.get('/reports/remarks', getReportRemarks);
router.post('/reports/remarks', createReportRemark);
router.delete('/reports/remarks/:id', deleteReportRemark);

router.get('/reports/blank-exam-format', getBlankExamFormatData);
router.get('/reports/signature-sheet', getStudentSignatureSheetData);
router.get('/reports/toppers-list', getToppersListData);

export default router;
