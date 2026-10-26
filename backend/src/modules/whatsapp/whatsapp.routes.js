import { Router } from 'express';
import * as whatsappController from './whatsapp.controller.js';

const router = Router();

router.get('/status', whatsappController.getStatusAndQr);
router.post('/start-session', whatsappController.startQrSession);
router.post('/send', whatsappController.sendMessage);
router.post('/logout', whatsappController.logoutSession);

export default router;
