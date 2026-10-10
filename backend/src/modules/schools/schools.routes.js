import express from 'express';
import {
  getSchoolProfile,
  updateSchoolProfile,
  uploadSchoolLogo
} from './schools.controller.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.get('/profile', getSchoolProfile);
router.put('/profile', updateSchoolProfile);
router.post('/upload-logo', upload.single('logo'), uploadSchoolLogo);

export default router;
