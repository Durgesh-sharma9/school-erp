import axios from 'axios';

/**
 * Format phone number to international E.164 without '+'
 * @param {string} phone
 * @returns {string}
 */
const formatIndianPhoneNumber = (phone) => {
  let cleanPhone = String(phone).replace(/\D/g, '');
  if (cleanPhone.length === 10) {
    cleanPhone = `91${cleanPhone}`;
  }
  return cleanPhone;
};

/**
 * Send WhatsApp text or template message via Meta Cloud API
 * @param {Object} options
 * @param {string} options.phoneNo - Recipient phone number
 * @param {string} options.message - Message body for regular text
 * @param {string} [options.templateName] - Optional Meta template name
 * @param {Array} [options.templateParams] - Optional template parameters
 */
export const sendWhatsAppMessage = async ({ phoneNo, message, templateName, templateParams = [] }) => {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || token === 'your_whatsapp_meta_access_token' || !phoneNumberId || phoneNumberId === 'your_whatsapp_phone_number_id') {
    console.warn(`[WhatsApp Service] Meta credentials not configured. Skipped sending message to: ${phoneNo}`);
    return { success: false, message: 'WhatsApp credentials not configured.' };
  }

  if (!phoneNo) {
    return { success: false, error: 'Recipient phone number is required.' };
  }

  const recipient = formatIndianPhoneNumber(phoneNo);

  try {
    const url = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;

    let payload;
    if (templateName) {
      payload = {
        messaging_product: 'whatsapp',
        to: recipient,
        type: 'template',
        template: {
          name: templateName,
          language: { code: 'en' },
          components: [
            {
              type: 'body',
              parameters: templateParams.map(param => ({ type: 'text', text: String(param) }))
            }
          ]
        }
      };
    } else {
      payload = {
        messaging_product: 'whatsapp',
        to: recipient,
        type: 'text',
        text: { preview_url: true, body: message }
      };
    }

    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return { success: true, messageId: response.data.messages?.[0]?.id };
  } catch (error) {
    console.error(`[WhatsApp Service Error to ${phoneNo}]:`, error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};
