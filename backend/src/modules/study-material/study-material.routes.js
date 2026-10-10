import { Router } from 'express';
import {
  getStudyMaterials,
  createStudyMaterial,
  getHomeworkList,
  createHomework,
  getPreviousYearPapers,
  createPreviousYearPaper
} from './study-material.controller.js';

const router = Router();

router.get('/materials', getStudyMaterials);
router.post('/materials', createStudyMaterial);

router.get('/homework', getHomeworkList);
router.post('/homework', createHomework);

router.get('/papers', getPreviousYearPapers);
router.post('/papers', createPreviousYearPaper);

export default router;
