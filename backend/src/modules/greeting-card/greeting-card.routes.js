import { Router } from 'express';
import {
  getGreetingCardRecipients,
  sendGreetingCard,
  getBirthdayReport
} from './greeting-card.controller.js';

const router = Router();

router.get('/recipients', getGreetingCardRecipients);
router.post('/send', sendGreetingCard);
router.post('/send-birthday-card', sendGreetingCard);
router.post('/send-student-msg', sendGreetingCard);

router.get('/birthday-report', getBirthdayReport);
router.post('/get-date-wise-birthday', getBirthdayReport);

export default router;
