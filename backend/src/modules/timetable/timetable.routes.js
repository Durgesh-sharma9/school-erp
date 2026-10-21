import { Router } from 'express';
import {
  getClassTimetable,
  getTeacherSubstitutions,
  assignSubstitution
} from './timetable.controller.js';

const router = Router();

router.get('/class', getClassTimetable);
router.get('/substitutions', getTeacherSubstitutions);
router.post('/assign-substitution', assignSubstitution);

export default router;
