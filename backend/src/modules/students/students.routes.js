import express from 'express';
import multer from 'multer';
import {
  registerStudent,
  uploadStudentPhoto,
  getStudentsList,
  getStudentByAdmNo
} from './students.controller.js';

const router = express.Router();

// Memory storage for multer so buffer can be streamed to ImageKit directly
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Photo upload to ImageKit
router.post('/upload-photo', upload.single('photo'), uploadStudentPhoto);

// Student registration and queries
router.post('/', registerStudent);
router.get('/', getStudentsList);
router.get('/:admNo', getStudentByAdmNo);

export default router;
