import { Router } from 'express';
import {
  getBalance,
  getTemplates,
  createTemplate,
  syncTemplates,
  deleteTemplate,
  sendStudentSms,
  sendStaffSms,
  sendBirthdaySms,
  sendIndividualSms,
  sendVisitorSms,
  getStatusReport,
  getBirthdayReport
} from './sms.controller.js';

const router = Router();

router.get('/balance', getBalance);
router.get('/templates', getTemplates);
router.post('/templates', createTemplate);
router.post('/templates/sync', syncTemplates);
router.delete('/templates/:id', deleteTemplate);

router.post('/send-student', sendStudentSms);
router.post('/send-staff', sendStaffSms);
router.post('/send-birthday', sendBirthdaySms);
router.post('/send-individual', sendIndividualSms);
router.post('/send-visitor', sendVisitorSms);

router.get('/reports/status', getStatusReport);
router.get('/reports/birthdays', getBirthdayReport);

export default router;
