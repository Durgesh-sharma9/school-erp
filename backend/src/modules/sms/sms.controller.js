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
    // April (matching UAB exact data)
  {
    id: '201',
    srNo: '2001',
    admNo: '2001',
    name: 'DEVRAJ CHOUDHARY',
    className: 'Lower Kindergarten - PP4+ - A',
    fatherName: 'RAMESH CHOUDHARY',
    motherName: 'MANJU DEVI',
    contactNo: '7062142122',
    dob: '2026-04-01',
    type: 'Student',
    month: 'April'
  },
  {
    id: '202',
    srNo: '2034',
    admNo: '2034',
    name: 'DEVRAJ CHOUDHARY',
    className: 'Nursery - PP3+ - A',
    fatherName: 'RAMESH CHOUDHARY',
    motherName: 'MANJU DEVI',
    contactNo: '7062142122',
    dob: '2026-04-01',
    type: 'Student',
    month: 'April'
  },
  {
    id: '203',
    srNo: '0',
    admNo: 'A156',
    name: 'AVADH',
    className: 'IV-A',
    fatherName: 'VIKRAM SINGH',
    motherName: 'SUSHILA DEVI',
    contactNo: '9929512948',
    dob: '2026-04-01',
    type: 'Student',
    month: 'April'
  },
  {
    id: '204',
    srNo: '1999',
    admNo: '1999',
    name: 'CHIRAG DEPAN',
    className: 'Lower Kindergarten - PP4+ - A',
    fatherName: 'KISHAN DEPAN',
    motherName: 'SUNITA DEPAN',
    contactNo: '9413486049',
    dob: '2026-04-02',
    type: 'Student',
    month: 'April'
  },
  {
    id: '205',
    srNo: '1988',
    admNo: '1988',
    name: 'VISHESH MEHRA',
    className: 'II-A',
    fatherName: 'SANJAY MEHRA',
    motherName: 'ANITA MEHRA',
    contactNo: '0',
    dob: '2026-04-02',
    type: 'Student',
    month: 'April'
  },
  {
    id: '206',
    srNo: '1575',
    admNo: '1575',
    name: 'TANISHA JAIN',
    className: 'V-A',
    fatherName: 'PRADEEP JAIN',
    motherName: 'PRIYANKA JAIN',
    contactNo: '9302095457',
    dob: '2026-04-02',
    type: 'Student',
    month: 'April'
  },
  {
    id: '207',
    srNo: '1854',
    admNo: '1854',
    name: 'KHUSHI SINGH',
    className: 'VI-A',
    fatherName: 'DILIP SINGH',
    motherName: 'SAROJ SINGH',
    contactNo: '8104008861',
    dob: '2026-04-02',
    type: 'Student',
    month: 'April'
  },
  {
    id: '208',
    srNo: '159602',
    admNo: '159602',
    name: 'DEEPAK MALAWAT',
    className: 'II-A',
    fatherName: 'MUKESH MALAWAT',
    motherName: 'GEETA MALAWAT',
    contactNo: '0',
    dob: '2026-04-03',
    type: 'Student',
    month: 'April'
  },
  {
    id: '209',
    srNo: '908',
    admNo: '908',
    name: 'GAURI PAURUSH',
    className: 'VII-A',
    fatherName: 'AMIT PAURUSH',
    motherName: 'NEELAM PAURUSH',
    contactNo: '84334838503',
    dob: '2026-04-03',
    type: 'Student',
    month: 'April'
  },
  // October
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
  },
  {
    id: '6',
    srNo: '101',
    admNo: 'ADM-2024-001',
    name: 'RAJESH SHARMA',
    studentName: 'AARAV SHARMA',
    className: 'I - A',
    fatherName: 'RAJESH SHARMA',
    motherName: 'PRIYA SHARMA',
    contactNo: '7891008092',
    dob: '1985-10-20',
    type: 'Father',
    month: 'October'
  },
  {
    id: '7',
    srNo: '101',
    admNo: 'ADM-2024-001',
    name: 'PRIYA SHARMA',
    studentName: 'AARAV SHARMA',
    className: 'I - A',
    fatherName: 'RAJESH SHARMA',
    motherName: 'PRIYA SHARMA',
    contactNo: '7891008092',
    dob: '1988-10-24',
    type: 'Mother',
    month: 'October'
  },

  // July
  {
    id: '8',
    srNo: '106',
    admNo: 'ADM-2024-031',
    name: 'AARADHYA VERMA',
    className: 'III - A',
    fatherName: 'SANJAY VERMA',
    motherName: 'RITU VERMA',
    contactNo: '9876543210',
    dob: '2018-07-08',
    type: 'Student',
    month: 'July'
  },
  {
    id: '9',
    srNo: '107',
    admNo: 'ADM-2024-032',
    name: 'ROHAN PATEL',
    className: 'IV - B',
    fatherName: 'MANOJ PATEL',
    motherName: 'SUNITA PATEL',
    contactNo: '9876543211',
    dob: '2017-07-15',
    type: 'Student',
    month: 'July'
  },
  {
    id: '10',
    srNo: '108',
    admNo: 'ADM-2024-033',
    name: 'PRIYA NAIR',
    className: 'II - A',
    fatherName: 'RAMESH NAIR',
    motherName: 'DEEPA NAIR',
    contactNo: '9876543212',
    dob: '2019-07-22',
    type: 'Student',
    month: 'July'
  },
  {
    id: '11',
    srNo: 'EMP-15',
    admNo: 'STF-015',
    name: 'SUNITA SHARMA',
    className: 'PRT - English',
    fatherName: 'OMPRAKASH SHARMA',
    motherName: 'SHANTI DEVI',
    contactNo: '9876543213',
    dob: '1985-07-12',
    type: 'Staff',
    month: 'July'
  },
  {
    id: '12',
    srNo: '106',
    admNo: 'ADM-2024-031',
    name: 'SANJAY VERMA',
    studentName: 'AARADHYA VERMA',
    className: 'III - A',
    fatherName: 'SANJAY VERMA',
    motherName: 'RITU VERMA',
    contactNo: '9876543210',
    dob: '1982-07-19',
    type: 'Father',
    month: 'July'
  },
  {
    id: '13',
    srNo: '107',
    admNo: 'ADM-2024-032',
    name: 'SUNITA PATEL',
    studentName: 'ROHAN PATEL',
    className: 'IV - B',
    fatherName: 'MANOJ PATEL',
    motherName: 'SUNITA PATEL',
    contactNo: '9876543211',
    dob: '1986-07-25',
    type: 'Mother',
    month: 'July'
  },

  // January
  {
    id: '14',
    srNo: '109',
    admNo: 'ADM-2024-041',
    name: 'AYUSH MISHRA',
    className: 'VI - A',
    fatherName: 'DEEPAK MISHRA',
    motherName: 'POOJA MISHRA',
    contactNo: '9811223344',
    dob: '2014-01-10',
    type: 'Student',
    month: 'January'
  },
  {
    id: '15',
    srNo: 'EMP-08',
    admNo: 'STF-008',
    name: 'ANIL KUMAR JOSHI',
    className: 'PGT - Physics',
    fatherName: 'GOPAL JOSHI',
    motherName: 'SAVITRI JOSHI',
    contactNo: '9811223345',
    dob: '1982-01-18',
    type: 'Staff',
    month: 'January'
  },

  // March
  {
    id: '16',
    srNo: '110',
    admNo: 'ADM-2024-051',
    name: 'TANVI CHAUHAN',
    className: 'VII - B',
    fatherName: 'VIJAY CHAUHAN',
    motherName: 'ANITA CHAUHAN',
    contactNo: '9822334455',
    dob: '2013-03-05',
    type: 'Student',
    month: 'March'
  },

  // August
  {
    id: '17',
    srNo: '111',
    admNo: 'ADM-2024-061',
    name: 'HARSHIT AGARWAL',
    className: 'VIII - A',
    fatherName: 'PAWAN AGARWAL',
    motherName: 'SUMAN AGARWAL',
    contactNo: '9833445566',
    dob: '2012-08-14',
    type: 'Student',
    month: 'August'
  },

  // November
  {
    id: '18',
    srNo: '112',
    admNo: 'ADM-2024-071',
    name: 'DIYA KAPOOR',
    className: 'I - B',
    fatherName: 'RAJAT KAPOOR',
    motherName: 'NEETU KAPOOR',
    contactNo: '9844556677',
    dob: '2019-11-20',
    type: 'Student',
    month: 'November'
  },

  // December
  {
    id: '19',
    srNo: '113',
    admNo: 'ADM-2024-081',
    name: 'SARTHAK YADAV',
    className: 'X - A',
    fatherName: 'DEVENDRA YADAV',
    motherName: 'MAMTA YADAV',
    contactNo: '9855667788',
    dob: '2010-12-25',
    type: 'Student',
    month: 'December'
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
