import { Router } from 'express';
import {
  getStudyMaterials,
  createStudyMaterial,
  getHomeworkList,
  createHomework,
  getPreviousYearPapers,
  createPreviousYearPaper,
  getHomeworkStatusReport
} from './study-material.controller.js';

const router = Router();

router.get('/materials', getStudyMaterials);
router.post('/materials', createStudyMaterial);

router.get('/homework', getHomeworkList);
router.post('/homework', createHomework);

router.get('/papers', getPreviousYearPapers);
router.post('/papers', createPreviousYearPaper);

router.get('/homework-status-report', getHomeworkStatusReport);
router.post('/get-homework-status-report', getHomeworkStatusReport);

export default router;

