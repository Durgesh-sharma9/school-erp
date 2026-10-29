import express from 'express';
import multer from 'multer';
import {
  registerStudent,
  uploadStudentPhoto,
  getStudentsList,
  getStudentByAdmNo,
  updateStudent,
  assignRollNumbers,
  getAttendance,
  saveAttendance,
  getOnlineClasses,
  createOnlineClass,
  promoteStudents,
  getExamDateSheets,
  createExamDateSheet,
  updateExamDateSheet,
  deleteExamDateSheet,
  getBulkStudents,
  saveBulkStudents,
  getStudentPhotosList,
  saveSingleStudentPhoto
} from './students.controller.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Photo upload
router.post('/upload-photo', upload.single('photo'), uploadStudentPhoto);

// Bulk Students (1:1 with UAB add-edit-bulk-students)
router.get('/bulk', getBulkStudents);
router.post('/bulk-save', saveBulkStudents);

// Student Photo Management (1:1 with UAB student-photo-management)
router.get('/photos-list', getStudentPhotosList);
router.post('/save-student-photo', saveSingleStudentPhoto);

// Roll Number Assignment
router.post('/assign-roll', assignRollNumbers);

// Attendance
router.get('/attendance', getAttendance);
router.post('/attendance', saveAttendance);

// Online Classes
router.get('/online-classes', getOnlineClasses);
router.post('/online-classes', createOnlineClass);

// Promotion
router.post('/promote', promoteStudents);

// Exam Date Sheets
router.get('/exam-date-sheets', getExamDateSheets);
router.post('/exam-date-sheets', createExamDateSheet);
router.put('/exam-date-sheets/:id', updateExamDateSheet);
router.delete('/exam-date-sheets/:id', deleteExamDateSheet);

// Student registration and queries
router.post('/', registerStudent);
router.get('/', getStudentsList);
router.get('/:admNo', getStudentByAdmNo);
router.put('/:admNo', updateStudent);

export default router;

