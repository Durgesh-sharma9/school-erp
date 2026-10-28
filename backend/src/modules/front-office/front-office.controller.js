// In-memory multi-tenant store for Front Office Module (Clean fresh state)

let appUsers = [];

let reminders = [
  { id: '1', fromDate: '2026-10-15', toDate: '2026-10-20', description: 'Quarterly Parent-Teacher Meeting announcement and report card review', status: 'Active' },
  { id: '2', fromDate: '2026-10-22', toDate: '2026-10-25', description: 'Diwali break holiday homework dispatch and online portal updates', status: 'Upcoming' },
  { id: '3', fromDate: '2026-09-01', toDate: '2026-09-05', description: 'Teachers Day felicitation and award preparation', status: 'Expired' }
];

let studentGatePasses = [];

let visitorEnquiries = [
  {
    id: '1',
    enquiryDate: '2026-10-15',
    visitorName: 'Dr. Alok Nath',
    contactNo: '9828012345',
    purpose: 'Admission Query',
    type: 'Prospective Parent',
    studentName: 'Aarav Nath',
    className: 'Nursery',
    gender: 'Male',
    address: 'Flat 402, Royal Palms, C-Scheme, Jaipur',
    description: 'Looking for Nursery admission for upcoming academic session. Enquired about fee structure, sports academy, and school bus routes.',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: '2',
    enquiryDate: '2026-10-14',
    visitorName: 'Sanjay Mathur',
    contactNo: '9414088990',
    purpose: 'Document Verification',
    type: 'Official / Education Board',
    studentName: 'N/A',
    className: 'CBSE Secondary',
    gender: 'Male',
    address: 'CBSE Regional Office, Sector 5, Mansarovar, Jaipur',
    description: 'Annual affiliation checklist inspection and lab infrastructure verification.',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80'
  }
];

let preAdmissions = [
  {
    id: '1',
    regNo: 'PRE-2026-101',
    firstName: 'Vivaan',
    lastName: 'Sharma',
    gender: 'Male',
    dob: '2022-04-12',
    contactNo: '9829033445',
    email: 'vivaan.parents@gmail.com',
    className: 'Nursery - PP3+',
    fatherName: 'Gaurav Sharma',
    fatherOccupation: 'Chartered Accountant',
    motherName: 'Megha Sharma',
    motherOccupation: 'Software Engineer',
    address: 'D-84, Hanuman Nagar, Vaishali Nagar, Jaipur',
    prevSchool: 'Kids Care Play School, Jaipur',
    feedback: 'Child is very active and communicative. Cleared basic interaction session.',
    status: 'Shortlisted',
    photo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: '2',
    regNo: 'PRE-2026-102',
    firstName: 'Ananya',
    lastName: 'Singhal',
    gender: 'Female',
    dob: '2020-09-18',
    contactNo: '9783011223',
    email: 'ananya.singhal@yahoo.com',
    className: 'Class I',
    fatherName: 'Amit Singhal',
    fatherOccupation: 'Businessman',
    motherName: 'Ritu Singhal',
    motherOccupation: 'Homemaker',
    address: 'Plot 12, Tonk Road, Jaipur',
    prevSchool: 'Seedling Nursery, Jaipur',
    feedback: 'Good academic readiness and polite behavior.',
    status: 'Admitted',
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80'
  }
];

let calendarPlanning = [
  {
    id: '1',
    type: 'Planning',
    startDate: '2026-10-18',
    endDate: '2026-10-18',
    title: 'Inter-House Science Exhibition & Robo-Tech Expo',
    className: 'Class VI - XII',
    section: 'All',
    description: 'Students will present STEM working models in the main auditorium. Chief Guest will be Prof. from MNIT Jaipur.',
    isHoliday: false
  },
  {
    id: '2',
    type: 'Event',
    startDate: '2026-10-31',
    endDate: '2026-11-04',
    title: 'Diwali & Govardhan Puja Holidays',
    className: 'All Classes',
    section: 'All',
    description: 'School campus will remain closed on account of Diwali festival. Online assignments accessible on student app.',
    isHoliday: true
  },
  {
    id: '3',
    type: 'Planning',
    startDate: '2026-11-14',
    endDate: '2026-11-14',
    title: 'Children’s Day Carnival & Sports Gala',
    className: 'Pre-Primary to Class XII',
    section: 'All',
    description: 'Food stalls, games, fancy dress competition and fun races organized by teaching staff for students.',
    isHoliday: false
  }
];

let studentAppPopups = [
  {
    id: '1',
    title: 'Diwali Festive Greetings & Holiday Assignment',
    fromDate: '2026-10-25',
    toDate: '2026-11-05',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    description: 'Wish you and your family a very Happy and Prosperous Diwali! Complete your holiday creative projects on time.',
    imageUrl: 'https://images.unsplash.com/photo-1512418490979-92798cec1380?w=500&auto=format&fit=crop&q=80',
    status: 'Active'
  },
  {
    id: '2',
    title: 'Annual Sports Day Registration Open',
    fromDate: '2026-11-01',
    toDate: '2026-11-10',
    videoUrl: '',
    description: 'Select your track & field events through student portal or meet Physical Education teacher.',
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&auto=format&fit=crop&q=80',
    status: 'Scheduled'
  }
];

let staffGatePasses = [
  {
    id: '1',
    staffCode: '201',
    name: 'MONIKA RANI VERMA',
    desig: 'Teacher',
    dept: 'TEACHING',
    date: '2026-10-15',
    timeIn: '08:00 AM',
    timeOut: '12:30 PM',
    reason: 'Bank official work & personal appointment',
    remark: 'Sanctioned by Vice-Principal, class covered by substitute teacher',
    status: 'Approved',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: '2',
    staffCode: '501',
    name: 'BHARAT JANGID',
    desig: 'Driver',
    dept: 'TRANSPORT',
    date: '2026-10-14',
    timeIn: '06:30 AM',
    timeOut: '11:00 AM',
    reason: 'Bus fuel filling and RTO certificate collection',
    remark: 'Transport Supervisor approved',
    status: 'Approved',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80'
  }
];

let visitStaffMeetings = [
  {
    id: '1',
    empCode: '101',
    employeeName: 'ABHILASHA BHATT',
    desig: 'Principal',
    dateRange: '2026-10-12 to 2026-10-13',
    schoolName: 'Delhi Public School, Jaipur',
    remark: 'CBSE Sahodaya School Complex Principals Conclave on NEP 2020 curriculum implementation.'
  },
  {
    id: '2',
    empCode: '102',
    employeeName: 'PRITI VERMA',
    desig: 'Administrator',
    dateRange: '2026-10-08 to 2026-10-08',
    schoolName: 'St. Xavier’s Senior Secondary School, Jaipur',
    remark: 'Inter-school administrative summit regarding digital fee collection and biometric access standards.'
  }
];

let studentComplaints = [];

let staffComplaints = [
  {
    id: '1',
    date: '2026-10-10',
    againstStaff: 'HANSRAJ JAT (Driver - Transport)',
    complaintType: 'Punctuality',
    reason: 'Bus Route No. 3 arrived 25 minutes late at Mansarovar stop without prior notification to parents.',
    status: 'Investigated & Resolved',
    actionTaken: 'Warning letter issued to driver; vehicle tracker recalibrated.'
  },
  {
    id: '2',
    date: '2026-10-11',
    againstStaff: 'RAJENDRA SINGH (Security Supervisor)',
    complaintType: 'Misbehavior',
    reason: 'Rude behavior with visitor during gate entry verification.',
    status: 'Under Review',
    actionTaken: 'Explained protocol to security team; customer-service refresher conducted.'
  }
];

// Controller Handlers

export const getAppUsers = (req, res) => {
  res.json({ success: true, count: appUsers.length, data: appUsers });
};

export const updateAppUserPermissions = (req, res) => {
  const { id } = req.params;
  const { appLoginPerm, notification } = req.body;
  const user = appUsers.find(u => u.id === id);
  if (user) {
    if (appLoginPerm !== undefined) user.appLoginPerm = appLoginPerm;
    if (notification !== undefined) user.notification = notification;
    return res.json({ success: true, data: user, message: 'Permissions updated successfully' });
  }
  res.status(404).json({ success: false, message: 'App user not found' });
};

export const getReminders = (req, res) => {
  res.json({ success: true, count: reminders.length, data: reminders });
};

export const createReminder = (req, res) => {
  const newReminder = {
    id: String(reminders.length + 1),
    fromDate: req.body.fromDate || new Date().toISOString().slice(0, 10),
    toDate: req.body.toDate || new Date().toISOString().slice(0, 10),
    description: req.body.description || 'New Reminder',
    status: 'Active'
  };
  reminders.unshift(newReminder);
  res.status(201).json({ success: true, data: newReminder });
};

export const deleteReminder = (req, res) => {
  const { id } = req.params;
  reminders = reminders.filter(r => r.id !== id);
  res.json({ success: true, message: 'Reminder deleted successfully' });
};

export const getStudentGatePasses = (req, res) => {
  res.json({ success: true, count: studentGatePasses.length, data: studentGatePasses });
};

export const createStudentGatePass = (req, res) => {
  const newPass = {
    id: String(studentGatePasses.length + 1),
    passNo: `GP-2026-00${studentGatePasses.length + 1}`,
    visitorName: req.body.visitorName || 'Visitor',
    contactNo: req.body.contactNo || '',
    date: req.body.date || new Date().toISOString().slice(0, 10),
    timeIn: req.body.timeIn || '10:00 AM',
    timeOut: req.body.timeOut || '11:00 AM',
    studentName: req.body.studentName || 'Student Name',
    admNo: req.body.admNo || '',
    className: req.body.className || '',
    relation: req.body.relation || 'Parent',
    reason: req.body.reason || 'General Visit',
    remark: req.body.remark || '',
    status: req.body.status || 'Approved',
    photo: req.body.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'
  };
  studentGatePasses.unshift(newPass);
  res.status(201).json({ success: true, data: newPass });
};

export const getVisitorEnquiries = (req, res) => {
  res.json({ success: true, count: visitorEnquiries.length, data: visitorEnquiries });
};

export const createVisitorEnquiry = (req, res) => {
  const newEnquiry = {
    id: String(visitorEnquiries.length + 1),
    enquiryDate: req.body.enquiryDate || new Date().toISOString().slice(0, 10),
    visitorName: req.body.visitorName || '',
    contactNo: req.body.contactNo || '',
    purpose: req.body.purpose || 'General Enquiry',
    type: req.body.type || 'Visitor',
    studentName: req.body.studentName || '',
    className: req.body.className || '',
    gender: req.body.gender || 'Other',
    address: req.body.address || '',
    description: req.body.description || '',
    photo: req.body.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
  };
  visitorEnquiries.unshift(newEnquiry);
  res.status(201).json({ success: true, data: newEnquiry });
};

export const getPreAdmissions = (req, res) => {
  res.json({ success: true, count: preAdmissions.length, data: preAdmissions });
};

export const createPreAdmission = (req, res) => {
  const newPre = {
    id: String(preAdmissions.length + 1),
    regNo: `PRE-2026-${100 + preAdmissions.length + 1}`,
    firstName: req.body.firstName || '',
    lastName: req.body.lastName || '',
    gender: req.body.gender || 'Male',
    dob: req.body.dob || '2022-01-01',
    contactNo: req.body.contactNo || '',
    email: req.body.email || '',
    className: req.body.className || '',
    fatherName: req.body.fatherName || '',
    fatherOccupation: req.body.fatherOccupation || '',
    motherName: req.body.motherName || '',
    motherOccupation: req.body.motherOccupation || '',
    address: req.body.address || '',
    prevSchool: req.body.prevSchool || '',
    feedback: req.body.feedback || '',
    status: 'Registered',
    photo: req.body.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'
  };
  preAdmissions.unshift(newPre);
  res.status(201).json({ success: true, data: newPre });
};

export const getCalendarPlanning = (req, res) => {
  res.json({ success: true, count: calendarPlanning.length, data: calendarPlanning });
};

export const createCalendarPlanning = (req, res) => {
  const newPlan = {
    id: String(calendarPlanning.length + 1),
    type: req.body.type || 'Planning',
    startDate: req.body.startDate || new Date().toISOString().slice(0, 10),
    endDate: req.body.endDate || req.body.startDate || new Date().toISOString().slice(0, 10),
    title: req.body.title || '',
    className: req.body.className || 'All Classes',
    section: req.body.section || 'All',
    description: req.body.description || '',
    isHoliday: req.body.isHoliday || false
  };
  calendarPlanning.unshift(newPlan);
  res.status(201).json({ success: true, data: newPlan });
};

export const getStudentAppPopups = (req, res) => {
  res.json({ success: true, count: studentAppPopups.length, data: studentAppPopups });
};

export const createStudentAppPopup = (req, res) => {
  const newPopup = {
    id: String(studentAppPopups.length + 1),
    title: req.body.title || '',
    fromDate: req.body.fromDate || new Date().toISOString().slice(0, 10),
    toDate: req.body.toDate || new Date().toISOString().slice(0, 10),
    videoUrl: req.body.videoUrl || '',
    description: req.body.description || '',
    imageUrl: req.body.imageUrl || 'https://images.unsplash.com/photo-1512418490979-92798cec1380?w=500&auto=format&fit=crop&q=80',
    status: 'Active'
  };
  studentAppPopups.unshift(newPopup);
  res.status(201).json({ success: true, data: newPopup });
};

export const getStaffGatePasses = (req, res) => {
  res.json({ success: true, count: staffGatePasses.length, data: staffGatePasses });
};

export const createStaffGatePass = (req, res) => {
  const newPass = {
    id: String(staffGatePasses.length + 1),
    staffCode: req.body.staffCode || '101',
    name: req.body.name || 'Staff Member',
    desig: req.body.desig || 'Staff',
    dept: req.body.dept || 'Administration',
    date: req.body.date || new Date().toISOString().slice(0, 10),
    timeIn: req.body.timeIn || '08:00 AM',
    timeOut: req.body.timeOut || '02:00 PM',
    reason: req.body.reason || 'Official Work',
    remark: req.body.remark || '',
    status: 'Approved',
    photo: req.body.photo || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80'
  };
  staffGatePasses.unshift(newPass);
  res.status(201).json({ success: true, data: newPass });
};

export const getVisitStaffMeetings = (req, res) => {
  res.json({ success: true, count: visitStaffMeetings.length, data: visitStaffMeetings });
};

export const createVisitStaffMeeting = (req, res) => {
  const newVisit = {
    id: String(visitStaffMeetings.length + 1),
    empCode: req.body.empCode || '',
    employeeName: req.body.employeeName || '',
    desig: req.body.desig || 'Faculty',
    dateRange: req.body.dateRange || '2026-10-15',
    schoolName: req.body.schoolName || '',
    remark: req.body.remark || ''
  };
  visitStaffMeetings.unshift(newVisit);
  res.status(201).json({ success: true, data: newVisit });
};

export const getStudentComplaints = (req, res) => {
  res.json({ success: true, count: studentComplaints.length, data: studentComplaints });
};

export const createStudentComplaint = (req, res) => {
  const newComplaint = {
    id: String(studentComplaints.length + 1),
    date: new Date().toISOString().slice(0, 10),
    studentName: req.body.studentName || '',
    admNo: req.body.admNo || '',
    className: req.body.className || '',
    complaintType: req.body.complaintType || 'General',
    complaintText: req.body.complaintText || '',
    category: req.body.category || 'against-student',
    status: 'Pending Review',
    actionTaken: 'Registered at Front Office desk'
  };
  studentComplaints.unshift(newComplaint);
  res.status(201).json({ success: true, data: newComplaint });
};

export const getStaffComplaints = (req, res) => {
  res.json({ success: true, count: staffComplaints.length, data: staffComplaints });
};

export const createStaffComplaint = (req, res) => {
  const newComplaint = {
    id: String(staffComplaints.length + 1),
    date: new Date().toISOString().slice(0, 10),
    againstStaff: req.body.againstStaff || '',
    complaintType: req.body.complaintType || 'General',
    reason: req.body.reason || '',
    status: 'Under Review',
    actionTaken: 'Logged for management review'
  };
  staffComplaints.unshift(newComplaint);
  res.status(201).json({ success: true, data: newComplaint });
};
