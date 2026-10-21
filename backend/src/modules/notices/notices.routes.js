import { Router } from 'express';
import {
  getNotices,
  createNotice,
  deleteNotice
} from './notices.controller.js';

const router = Router();

router.get('/', getNotices);
router.post('/', createNotice);
router.delete('/:id', deleteNotice);

export default router;
