import nodemailer from 'nodemailer';

const isConfigured = 
  process.env.SMTP_HOST && 
  process.env.SMTP_USER && 
  process.env.SMTP_USER !== 'your_email@gmail.com' &&
  process.env.SMTP_PASS && 
  process.env.SMTP_PASS !== 'your_app_password';

const transporter = isConfigured ? nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 465),
  secure: Number(process.env.SMTP_PORT || 465) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
}) : null;

const MAIL_FROM = process.env.MAIL_FROM || `"School ERP" <noreply@schoolerp.in>`;

/**
 * Send an email via SMTP
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Subject line
 * @param {string} options.html - HTML body
 * @param {Array} [options.attachments] - Optional attachments (e.g. PDF fee slips)
 */
export const sendEmail = async ({ to, subject, html, attachments = [] }) => {
  if (!isConfigured || !transporter) {
    console.warn(`[Email Service] SMTP not configured. Skipped sending email to: ${to} (Subject: ${subject})`);
    return { success: false, message: 'SMTP not configured' };
  }

  try {
    const info = await transporter.sendMail({
      from: MAIL_FROM,
      to,
      subject,
      html,
      attachments
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[Email Service Error to ${to}]:`, error.message);
    return { success: false, error: error.message };
  }
};
