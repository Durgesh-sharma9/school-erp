import express from 'express';
import {
  getAllClasses,
  createClass,
  deleteClass,
  getAllSubjectGroups,
  createSubjectGroup,
  deleteSubjectGroup,
  getAllSubjects,
  createSubject,
  deleteSubject,
  getAllStreams,
  createStream,
  deleteStream,
  getAllSubjectLinks,
  updateSubjectLink
} from './academics.controller.js';

const router = express.Router();

// 1. Classes
router.get('/classes', getAllClasses);
router.post('/classes', createClass);
router.delete('/classes/:id', deleteClass);

// 2. Subject Groups
router.get('/subject-groups', getAllSubjectGroups);
router.post('/subject-groups', createSubjectGroup);
router.delete('/subject-groups/:id', deleteSubjectGroup);

// 3. Subjects
router.get('/subjects', getAllSubjects);
router.post('/subjects', createSubject);
router.delete('/subjects/:id', deleteSubject);

// 4. Streams
router.get('/streams', getAllStreams);
router.post('/streams', createStream);
router.delete('/streams/:id', deleteStream);

// 5. Subject Links
router.get('/subject-links', getAllSubjectLinks);
router.post('/subject-links', updateSubjectLink);

export default router;
