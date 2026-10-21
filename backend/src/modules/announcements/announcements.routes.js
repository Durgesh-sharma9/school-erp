import { Router } from 'express';
import {
  getAnnouncements,
  getTargetMetadata,
  createAnnouncement,
  resendAnnouncement,
  deleteAnnouncement
} from './announcements.controller.js';

const router = Router();

router.get('/meta', getTargetMetadata);
router.get('/', getAnnouncements);
router.post('/', createAnnouncement);
router.post('/:id/resend', resendAnnouncement);
router.delete('/:id', deleteAnnouncement);

export default router;
