import { Router } from 'express';
import {
  getLeads,
  createLead,
  updateLeadStatus,
  deleteLead
} from './crm.controller.js';

const router = Router();

router.get('/leads', getLeads);
router.post('/leads', createLead);
router.patch('/leads/:id', updateLeadStatus);
router.delete('/leads/:id', deleteLead);

export default router;
