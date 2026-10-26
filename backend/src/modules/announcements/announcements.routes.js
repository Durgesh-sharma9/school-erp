import { Router } from 'express';
import {
  getAnnouncements,
  getTargetMetadata,
  createAnnouncement,
  resendAnnouncement,
  deleteAnnouncement,
  // Polls
  getPolls,
  createPoll,
  castVote,
  togglePollStatus,
  deletePoll,
  getPollAnalytics,
  // Complaints & Feedback
  getFeedbackTickets,
  createFeedbackTicket,
  replyFeedbackTicket,
  updateFeedbackStatus
} from './announcements.controller.js';

const router = Router();

// Metadata & Announcements
router.get('/meta', getTargetMetadata);
router.get('/', getAnnouncements);
router.post('/', createAnnouncement);
router.post('/:id/resend', resendAnnouncement);
router.delete('/:id', deleteAnnouncement);

// Interactive Polls
router.get('/polls/list', getPolls);
router.get('/polls/:id/analytics', getPollAnalytics);
router.post('/polls', createPoll);
router.post('/polls/:id/vote', castVote);
router.post('/polls/:id/status', togglePollStatus);
router.delete('/polls/:id', deletePoll);

// Complaints & Grievance Feedback
router.get('/feedback/list', getFeedbackTickets);
router.post('/feedback', createFeedbackTicket);
router.post('/feedback/:id/reply', replyFeedbackTicket);
router.patch('/feedback/:id/status', updateFeedbackStatus);

export default router;
