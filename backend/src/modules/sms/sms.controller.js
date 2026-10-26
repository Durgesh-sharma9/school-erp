// In-memory data store for SMS & WhatsApp templates, logs, and mock recipients

let smsBalance = {
  textSms: 4500,
  whatsapp: 2200
};

let whatsappTemplates = [
  {
    id: 'TPL-001',
    tempId: '9842109841',
    tempName: 'fee_due_reminder_v1',
    tempType: 'Text',
    language: 'English',
    category: 'UTILITY',
    status: 'APPROVED',
    content: 'Dear {{name}}, this is a gentle reminder that your school fee of ₹{{due_amount}} for the months {{months}} is pending. Kindly clear it before {{date}} to avoid late charges. - J D International School'
  },
  {
    id: 'TPL-002',
    tempId: '9842109842',
    tempName: 'student_absent_alert',
    tempType: 'Text',
    language: 'English',
    category: 'UTILITY',
    status: 'APPROVED',
    content: 'Dear Parent, your ward {{name}} of class {{class}} is absent today ({{date}}) without prior leave notice. Please verify. - J D International School'
  },
  {
    id: 'TPL-003',
    tempId: '9842109843',
    tempName: 'birthday_greetings',
    tempType: 'Text',
    language: 'English',
    category: 'MARKETING',
    status: 'APPROVED',
    content: 'Happy Birthday {{name}}! May this year bring you joy, knowledge, and success. Wishing you a wonderful day! - J D International School'
  },
  {
    id: 'TPL-004',
    tempId: '9842109844',
    tempName: 'holiday_announcement',
    tempType: 'Text',
    language: 'English',
    category: 'UTILITY',
    status: 'APPROVED',
    content: 'Dear Parents/Staff, please note that the school will remain closed tomorrow on account of {{subject}}. Regular classes resume on the next working day.'
  },
  {
    id: 'TPL-005',
    tempId: '9842109845',
    tempName: 'visitor_thank_you',
    tempType: 'Text',
    language: 'English',
    category: 'UTILITY',
    status: 'APPROVED',
    content: 'Dear Visitor, thank you for visiting J D International School today. For any admissions or fee queries, please reach our helpdesk at 8947919195.'
  }
];

let smsLogs = [
  {
    id: '1',
    msgId: 'MSG-2026-901',
    mobileNo: '7891008092',
    type: 'WhatsApp',
    message: 'Dear AARAV SHARMA, this is a gentle reminder that your school fee of ₹2500 is pending.',
    status: 'Success',
    errorMessage: '-',
    date: '2026-04-10',
    recipientType: 'Student'
  },
  {
    id: '2',
    msgId: 'MSG-2026-902',
    mobileNo: '9999900001',
    type: 'Text',
    message: 'Staff Meeting scheduled today at 3:30 PM in the Principal Conference Hall.',
    status: 'Success',
    errorMessage: '-',
    date: '2026-04-11',
    recipientType: 'Staff'
  },
  {
    id: '3',
    msgId: 'MSG-2026-903',
    mobileNo: '9999900002',
    type: 'WhatsApp',
    message: 'Happy Birthday KABIR MEHTA! Wishing you joy, health, and bright success ahead.',
    status: 'Success',
    errorMessage: '-',
    date: '2026-04-12',
    recipientType: 'Student'
  },
  {
    id: '4',
    msgId: 'MSG-2026-904',
    mobileNo: '9999900003',
    type: 'Text',
    message: 'School holiday declared on 14th April on account of Ambedkar Jayanti.',
    status: 'Success',
    errorMessage: '-',
    date: '2026-04-13',
    recipientType: 'Student'
  },
  {
    id: '5',
    msgId: 'MSG-2026-905',
    mobileNo: '9999900005',
    type: 'WhatsApp',
    message: 'Thank you for visiting J D International School. We hope to see you soon.',
    status: 'Failed',
    errorMessage: 'Destination number not registered on WhatsApp',
    date: '2026-04-14',
    recipientType: 'Visitor'
  }
];

const mockBirthdays = [
  {
    id: '1',
    srNo: '101',
    admNo: 'ADM-2024-001',
    name: 'AARAV SHARMA',
    className: 'I - A',
    fatherName: 'RAJESH SHARMA',
    motherName: 'PRIYA SHARMA',
    contactNo: '7891008092',
    dob: '2019-10-15',
    type: 'Student',
    month: 'October'
  },
  {
    id: '2',
    srNo: '102',
    admNo: 'ADM-2024-002',
    name: 'ANANYA VERMA',
    className: 'II - A',
    fatherName: 'SURESH VERMA',
    motherName: 'SUNITA VERMA',
    contactNo: '9999900001',
    dob: '2018-10-15',
    type: 'Student',
    month: 'October'
  },
  {
    id: '3',
    srNo: 'EMP-12',
    admNo: 'STF-012',
    name: 'VIKRAM CHOUDHARY',
    className: 'TGT - Mathematics',
    fatherName: 'RAMESHWAR CHOUDHARY',
    motherName: 'KAMLA DEVI',
    contactNo: '9999900002',
    dob: '1988-10-15',
    type: 'Staff',
    month: 'October'
  },
  {
    id: '4',
    srNo: '104',
    admNo: 'ADM-2023-089',
    name: 'KABIR MEHTA',
    className: 'V - B',
    fatherName: 'ALOK MEHTA',
    motherName: 'MEENA MEHTA',
    contactNo: '9999900003',
    dob: '2015-10-16',
    type: 'Student',
    month: 'October'
  },
  {
    id: '5',
    srNo: '105',
    admNo: 'ADM-2022-045',
    name: 'DIVYA SINGH',
    className: 'IX - A',
    fatherName: 'MAHESH SINGH',
    motherName: 'REKHA SINGH',
    contactNo: '9999900004',
    dob: '2011-10-18',
    type: 'Student',
    month: 'October'
  }
];

export const getBalance = (req, res) => {
  return res.json({
    success: true,
    data: smsBalance
  });
};

export const getTemplates = (req, res) => {
  return res.json({
    success: true,
    data: whatsappTemplates
  });
};

export const createTemplate = (req, res) => {
  const { tempName, language, content, tempType } = req.body;
  if (!tempName || !content) {
    return res.status(400).json({ success: false, message: 'Template name and content are required' });
  }
  const newTpl = {
    id: `TPL-${String(whatsappTemplates.length + 1).padStart(3, '0')}`,
    tempId: String(Math.floor(1000000000 + Math.random() * 9000000000)),
    tempName: tempName.toLowerCase().replace(/\s+/g, '_'),
    tempType: tempType || 'Text',
    language: language || 'English',
    category: 'UTILITY',
    status: 'APPROVED',
    content
  };
  whatsappTemplates.unshift(newTpl);
  return res.json({
    success: true,
    message: 'Template created successfully',
    data: newTpl
  });
};

export const syncTemplates = (req, res) => {
  return res.json({
    success: true,
    message: 'Templates successfully synced with WhatsApp Business API',
    data: whatsappTemplates
  });
};

export const deleteTemplate = (req, res) => {
  const { id } = req.params;
  whatsappTemplates = whatsappTemplates.filter(t => t.id !== id);
  return res.json({
    success: true,
    message: 'Template deleted successfully'
  });
};

export const sendStudentSms = (req, res) => {
  const { classes, sections, title, message, messageType, recipientCount, phone } = req.body;
  const count = recipientCount || 1;
  const targetPhone = phone || '7891008092';
  const newLog = {
    id: String(smsLogs.length + 1),
    msgId: `MSG-2026-${String(900 + smsLogs.length + 1)}`,
    mobileNo: targetPhone,
    type: messageType || 'Text',
    message: message || title || 'Student Notification',
    status: 'Success',
    errorMessage: '-',
    date: new Date().toISOString().split('T')[0],
    recipientType: 'Student'
  };
  smsLogs.unshift(newLog);
  if (messageType === 'WhatsApp') {
    smsBalance.whatsapp = Math.max(0, smsBalance.whatsapp - count);
  } else {
    smsBalance.textSms = Math.max(0, smsBalance.textSms - count);
  }
  return res.json({
    success: true,
    message: `Message sent to ${count} student(s) successfully (${targetPhone})`,
    data: newLog
  });
};

export const sendStaffSms = (req, res) => {
  const { branches, departments, designations, title, message, messageType, recipientCount } = req.body;
  const count = recipientCount || 15;
  const newLog = {
    id: String(smsLogs.length + 1),
    msgId: `MSG-2026-${String(900 + smsLogs.length + 1)}`,
    mobileNo: 'Staff Group',
    type: messageType || 'Text',
    message: message || title || 'Staff Notification',
    status: 'Success',
    errorMessage: '-',
    date: new Date().toISOString().split('T')[0],
    recipientType: 'Staff'
  };
  smsLogs.unshift(newLog);
  if (messageType === 'WhatsApp') {
    smsBalance.whatsapp = Math.max(0, smsBalance.whatsapp - count);
  } else {
    smsBalance.textSms = Math.max(0, smsBalance.textSms - count);
  }
  return res.json({
    success: true,
    message: `Message dispatched to ${count} staff members`,
    data: newLog
  });
};

export const sendBirthdaySms = (req, res) => {
  const { recipientIds, message, messageType } = req.body;
  const count = (recipientIds && recipientIds.length) || 1;
  const newLog = {
    id: String(smsLogs.length + 1),
    msgId: `MSG-2026-${String(900 + smsLogs.length + 1)}`,
    mobileNo: 'Birthday Celebrants',
    type: messageType || 'Text',
    message: message || 'Happy Birthday Wishes',
    status: 'Success',
    errorMessage: '-',
    date: new Date().toISOString().split('T')[0],
    recipientType: 'Birthday'
  };
  smsLogs.unshift(newLog);
  return res.json({
    success: true,
    message: `Birthday greetings sent to ${count} recipient(s)`
  });
};

export const sendIndividualSms = (req, res) => {
  const { numbers, message, messageType, sendingType } = req.body;
  const numberList = (numbers || '').split(/[,\n]/).map(n => n.trim()).filter(Boolean);
  const count = numberList.length || 1;
  const newLog = {
    id: String(smsLogs.length + 1),
    msgId: `MSG-2026-${String(900 + smsLogs.length + 1)}`,
    mobileNo: numberList.slice(0, 3).join(', ') + (numberList.length > 3 ? '...' : ''),
    type: messageType || 'Text',
    message: message || 'Direct Alert',
    status: 'Success',
    errorMessage: '-',
    date: new Date().toISOString().split('T')[0],
    recipientType: 'Individual'
  };
  smsLogs.unshift(newLog);
  return res.json({
    success: true,
    message: `Dispatched to ${count} number(s) [${sendingType || 'Instant'}]`
  });
};

export const sendVisitorSms = (req, res) => {
  const { visitorIds, message, messageType } = req.body;
  const count = (visitorIds && visitorIds.length) || 1;
  const newLog = {
    id: String(smsLogs.length + 1),
    msgId: `MSG-2026-${String(900 + smsLogs.length + 1)}`,
    mobileNo: 'Visitor Inquiries',
    type: messageType || 'Text',
    message: message || 'Visitor Message',
    status: 'Success',
    errorMessage: '-',
    date: new Date().toISOString().split('T')[0],
    recipientType: 'Visitor'
  };
  smsLogs.unshift(newLog);
  return res.json({
    success: true,
    message: `Message sent to ${count} visitor(s)`
  });
};

export const getStatusReport = (req, res) => {
  const { msgType, status, fromDate, toDate } = req.query;
  let filtered = [...smsLogs];
  if (msgType && msgType !== 'All') {
    filtered = filtered.filter(l => l.type === msgType);
  }
  if (status && status !== 'All') {
    filtered = filtered.filter(l => l.status === status);
  }
  if (fromDate) {
    filtered = filtered.filter(l => l.date >= fromDate);
  }
  if (toDate) {
    filtered = filtered.filter(l => l.date <= toDate);
  }
  return res.json({
    success: true,
    data: filtered,
    summary: {
      total: filtered.length,
      success: filtered.filter(l => l.status === 'Success').length,
      failed: filtered.filter(l => l.status === 'Failed').length,
      pending: filtered.filter(l => l.status === 'Pending').length
    }
  });
};

export const getBirthdayReport = (req, res) => {
  const { type, month } = req.query;
  let filtered = [...mockBirthdays];
  if (type && type !== 'All') {
    filtered = filtered.filter(b => b.type === type);
  }
  if (month && month !== 'Select' && month !== 'All') {
    filtered = filtered.filter(b => b.month === month);
  }
  return res.json({
    success: true,
    data: filtered
  });
};
