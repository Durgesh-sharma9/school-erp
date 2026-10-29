import express from 'express';
import {
  getAllClasses,
  createClass,
  updateClass,
  deleteClass,
  getAllSubjectGroups,
  createSubjectGroup,
  updateSubjectGroup,
  deleteSubjectGroup,
  getAllSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  getAllStreams,
  createStream,
  updateStream,
  deleteStream,
  getAllSubjectLinks,
  updateSubjectLink
} from './academics.controller.js';

const router = express.Router();

// 1. Classes
router.get('/classes', getAllClasses);
router.post('/classes', createClass);
router.put('/classes/:id', updateClass);
router.delete('/classes/:id', deleteClass);

// 2. Subject Groups
router.get('/subject-groups', getAllSubjectGroups);
router.post('/subject-groups', createSubjectGroup);
router.put('/subject-groups/:id', updateSubjectGroup);
router.delete('/subject-groups/:id', deleteSubjectGroup);

// 3. Subjects
router.get('/subjects', getAllSubjects);
router.post('/subjects', createSubject);
router.put('/subjects/:id', updateSubject);
router.patch('/subjects/:id', updateSubject);
router.delete('/subjects/:id', deleteSubject);

// 4. Streams
router.get('/streams', getAllStreams);
router.post('/streams', createStream);
router.put('/streams/:id', updateStream);
router.patch('/streams/:id', updateStream);
router.delete('/streams/:id', deleteStream);

// 5. Subject Links
router.get('/subject-links', getAllSubjectLinks);
router.post('/subject-links', updateSubjectLink);

export default router;
