import { Router } from 'express';
import {
  getManualCertificates,
  createManualCertificate,
  getManualTcList,
  createManualTc,
  bulkGenerateTc
} from './certificates.controller.js';

const router = Router();

router.get('/cc-bc', getManualCertificates);
router.post('/cc-bc', createManualCertificate);

router.get('/tc/manual', getManualTcList);
router.post('/tc/manual', createManualTc);
router.post('/tc/bulk', bulkGenerateTc);

export default router;
