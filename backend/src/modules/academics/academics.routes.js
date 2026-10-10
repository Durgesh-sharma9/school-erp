import express from 'express';
import {
  getAllClasses,
  createClass,
  deleteClass,
  getAllSubjects,
  createSubject
} from './academics.controller.js';

const router = express.Router();

router.get('/classes', getAllClasses);
router.post('/classes', createClass);
router.delete('/classes/:id', deleteClass);

router.get('/subjects', getAllSubjects);
router.post('/subjects', createSubject);

export default router;
