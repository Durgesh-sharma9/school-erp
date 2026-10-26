import * as whatsappService from './whatsapp.service.js';

export const getStatusAndQr = async (req, res) => {
  try {
    const data = await whatsappService.getWhatsAppStatus();
    return res.status(200).json({ success: true, ...data });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const startQrSession = async (req, res) => {
  try {
    const data = await whatsappService.initWhatsApp(true);
    return res.status(200).json({ success: true, ...data });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { to, message } = req.body;
    const result = await whatsappService.sendLiveWhatsAppMessage({ to, message });
    if (!result.success) {
      return res.status(400).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const logoutSession = async (req, res) => {
  try {
    const result = await whatsappService.logoutWhatsApp();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
