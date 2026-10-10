import { uploadToImageKit } from '../../core/utils/imagekitService.js';
import prisma from '../../config/db.js';

// Real-world sample students from J D International School
const inMemoryStudents = [
  {
    id: 'std_1',
    rollNo: '1',
    enrollNo: '',
    srNo: '1621',
    admNo: '1621',
    firstName: 'AADITYA SINGH',
    lastName: 'CHOUDHARY',
    fatherName: 'NARENDRA SINGH CHOUDHARY',
    motherName: 'SUNITA CHOUDHARY',
    fatherMobile: '9829012345',
    motherMobile: '9829012346',
    smsWhatsappNo: '9829012345',
    className: 'I',
    section: 'A',
    dob: '2019-04-12',
    gender: 'Male',
    feeType: 'Day Scholar',
    studentType: 'Old',
    status: 'Studying',
    bloodGroup: 'B+',
    category: 'General',
    address: 'Plot 45, Vidhyadhar Nagar, Jaipur',
    photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150',
    createdAt: new Date().toISOString()
  },
  {
    id: 'std_2',
    rollNo: '2',
    enrollNo: '',
    srNo: '0',
    admNo: 'A135',
    firstName: 'ADVIK',
    lastName: 'RAO',
    fatherName: 'PRADEEP RAO',
    motherName: 'PRIYANKA RAO',
    fatherMobile: '9414023456',
    motherMobile: '9414023457',
    smsWhatsappNo: '9414023456',
    className: 'I',
    section: 'A',
    dob: '2019-07-20',
    gender: 'Male',
    feeType: 'Day Scholar',
    studentType: 'New',
    status: 'Studying',
    bloodGroup: 'O+',
    category: 'General',
    address: 'Near Central Park, Jaipur',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    createdAt: new Date().toISOString()
  },
  {
    id: 'std_3',
    rollNo: '3',
    enrollNo: '',
    srNo: '0',
    admNo: 'A160',
    firstName: 'ANANYA RAJESH',
    lastName: 'KUMAR YADAV',
    fatherName: 'RAJESH KUMAR YADAV',
    motherName: 'SUSHILA YADAV',
    fatherMobile: '9828034567',
    motherMobile: '9828034568',
    smsWhatsappNo: '9828034567',
    className: 'I',
    section: 'A',
    dob: '2019-02-15',
    gender: 'Female',
    feeType: 'Day Scholar',
    studentType: 'Old',
    status: 'Studying',
    bloodGroup: 'A+',
    category: 'OBC',
    address: 'Shyam Nagar, Jaipur',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    createdAt: new Date().toISOString()
  },
  {
    id: 'std_4',
    rollNo: '4',
    enrollNo: '',
    srNo: '1590',
    admNo: '1590',
    firstName: 'ANVI',
    lastName: 'VERMA',
    fatherName: 'DINESH VERMA',
    motherName: 'MEENA VERMA',
    fatherMobile: '9784045678',
    motherMobile: '9784045679',
    smsWhatsappNo: '9784045678',
    className: 'I',
    section: 'A',
    dob: '2019-09-05',
    gender: 'Female',
    feeType: 'Day Scholar',
    studentType: 'Old',
    status: 'Studying',
    bloodGroup: 'AB+',
    category: 'General',
    address: 'Malviya Nagar, Jaipur',
    photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    createdAt: new Date().toISOString()
  },
  {
    id: 'std_5',
    rollNo: '5',
    enrollNo: '',
    srNo: '2051',
    admNo: '2051',
    firstName: 'ARADIYA',
    lastName: 'SAINI',
    fatherName: 'GANESH SAINI',
    motherName: 'KAVITA SAINI',
    fatherMobile: '9672056789',
    motherMobile: '9672056780',
    smsWhatsappNo: '9672056789',
    className: 'I',
    section: 'A',
    dob: '2019-11-18',
    gender: 'Male',
    feeType: 'Day Scholar',
    studentType: 'New',
    status: 'Studying',
    bloodGroup: 'B+',
    category: 'OBC',
    address: 'Sanganer, Jaipur',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    createdAt: new Date().toISOString()
  },
  {
    id: 'std_6',
    rollNo: '6',
    enrollNo: '',
    srNo: '2061',
    admNo: '2061',
    firstName: 'ARJUN',
    lastName: 'SHARMA',
    fatherName: 'UMAKANT SHARMA',
    motherName: 'RADHA SHARMA',
    fatherMobile: '9587067890',
    motherMobile: '9587067891',
    smsWhatsappNo: '9587067890',
    className: 'I',
    section: 'A',
    dob: '2019-06-30',
    gender: 'Male',
    feeType: 'Day Scholar',
    studentType: 'New',
    status: 'Studying',
    bloodGroup: 'O+',
    category: 'General',
    address: 'Mansarovar, Jaipur',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    createdAt: new Date().toISOString()
  }
];

// Online classes mock store
const inMemoryOnlineClasses = [
  {
    id: 'oc_1',
    className: 'X',
    division: 'A',
    teacher: 'Mr. Rajesh Sharma',
    subject: 'Mathematics',
    meetingUrl: 'https://meet.google.com/abc-defg-hij',
    topic: 'Quadratic Equations & Solutions',
    dateTime: '2026-10-12 10:00 AM',
    duration: '45 mins',
    meetingId: '984 212 4432',
    password: 'jdis'
  },
  {
    id: 'oc_2',
    className: 'XII-NON-MEDICAL',
    division: 'A',
    teacher: 'Dr. Suresh Kumar',
    subject: 'Physics',
    meetingUrl: 'https://meet.google.com/xyz-uvwx-rst',
    topic: 'Electromagnetic Induction',
    dateTime: '2026-10-12 11:30 AM',
    duration: '60 mins',
    meetingId: '772 109 8812',
    password: 'jdis'
  }
];

// Exam Date Sheets mock store
const inMemoryExamDateSheets = [
  {
    id: 'eds_1',
    className: 'X',
    examTerm: 'Term 1',
    examName: 'Mid Term Examination 2026',
    file: 'DateSheet_X_MidTerm.pdf',
    notes: 'Please bring your own stationary and admit cards.',
    schedules: [
      { date: '2026-11-02', subject: 'English', from: '09:00 AM', to: '12:00 PM' },
      { date: '2026-11-04', subject: 'Mathematics', from: '09:00 AM', to: '12:00 PM' },
      { date: '2026-11-06', subject: 'Science', from: '09:00 AM', to: '12:00 PM' },
      { date: '2026-11-09', subject: 'Social Science', from: '09:00 AM', to: '12:00 PM' }
    ]
  }
];

// Attendance records
const inMemoryAttendance = [
  {
    date: '2026-10-10',
    className: 'I',
    section: 'A',
    presentCount: 5,
    absentCount: 1,
    records: [
      { studentId: 'std_1', status: 'Present' },
      { studentId: 'std_2', status: 'Present' },
      { studentId: 'std_3', status: 'Present' },
      { studentId: 'std_4', status: 'Present' },
      { studentId: 'std_5', status: 'Absent' },
      { studentId: 'std_6', status: 'Present' }
    ]
  }
];

/**
 * Upload student photo to ImageKit
 */
export const uploadStudentPhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded' });
    }
    const fileName = `student_${Date.now()}_${req.file.originalname.replace(/\s+/g, '_')}`;
    const uploadResult = await uploadToImageKit(req.file.buffer, fileName, 'students');
    return res.status(200).json({ success: true, message: 'Photo uploaded successfully', data: uploadResult });
  } catch (error) {
    console.error('[Upload Photo Error]:', error);
    next(error);
  }
};

/**
 * Register a new student
 */
export const registerStudent = async (req, res, next) => {
  try {
    const studentData = req.body;
    const newStudent = {
      id: `std_${Date.now()}`,
      admNo: studentData.adm_no || studentData.admNo || String(Math.floor(2000 + Math.random() * 8000)),
      srNo: studentData.sr_no || studentData.srNo || '0',
      firstName: studentData.first_name || studentData.firstName || 'Student',
      lastName: studentData.last_name || studentData.lastName || '',
      fatherName: studentData.fathers_name || studentData.fatherName || '',
      motherName: studentData.mothers_name || studentData.motherName || '',
      fatherMobile: studentData.fathers_mobile_no || studentData.fatherMobile || '',
      motherMobile: studentData.mothers_mobile_no || studentData.motherMobile || '',
      smsWhatsappNo: studentData.contact_no_sms || studentData.smsWhatsappNo || '',
      className: studentData.class_id || studentData.className || 'I',
      section: studentData.division_id || studentData.section || 'A',
      dob: studentData.dob || '2019-01-01',
      gender: studentData.gender || 'Male',
      feeType: studentData.fee_id || 'Day Scholar',
      studentType: studentData.stu_type || 'New',
      status: studentData.status_type || 'Studying',
      rollNo: studentData.roll_no || '0',
      photoUrl: studentData.student_photo || '',
      createdAt: new Date().toISOString()
    };

    inMemoryStudents.unshift(newStudent);

    return res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      data: newStudent
    });
  } catch (error) {
    console.error('[Register Student Error]:', error);
    next(error);
  }
};

/**
 * Get list of students (with search and class/division filter)
 */
export const getStudentsList = async (req, res, next) => {
  try {
    const { search = '', className = '', section = '' } = req.query;

    let filtered = [...inMemoryStudents];
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          (s.firstName && s.firstName.toLowerCase().includes(q)) ||
          (s.lastName && s.lastName.toLowerCase().includes(q)) ||
          (s.admNo && s.admNo.toLowerCase().includes(q)) ||
          (s.srNo && s.srNo.includes(q))
      );
    }

    if (className) {
      filtered = filtered.filter(
        (s) => s.className.toLowerCase() === className.toLowerCase()
      );
    }

    if (section) {
      filtered = filtered.filter(
        (s) => s.section.toLowerCase() === section.toLowerCase()
      );
    }

    return res.status(200).json({
      success: true,
      count: filtered.length,
      data: filtered
    });
  } catch (error) {
    console.error('[Get Students Error]:', error);
    next(error);
  }
};

/**
 * Batch update / assign roll numbers
 */
export const assignRollNumbers = async (req, res, next) => {
  try {
    const { updates = [] } = req.body;
    updates.forEach(({ id, rollNo }) => {
      const std = inMemoryStudents.find((s) => s.id === id);
      if (std) std.rollNo = String(rollNo);
    });

    return res.status(200).json({
      success: true,
      message: 'Roll numbers assigned successfully',
      data: inMemoryStudents
    });
  } catch (error) {
    console.error('[Assign Roll Numbers Error]:', error);
    next(error);
  }
};

/**
 * Student Attendance List & Submission
 */
export const getAttendance = async (req, res, next) => {
  try {
    const { date, className, section } = req.query;
    const record = inMemoryAttendance.find(
      (a) =>
        (!date || a.date === date) &&
        (!className || a.className === className) &&
        (!section || a.section === section)
    );

    return res.status(200).json({
      success: true,
      data: record || null,
      history: inMemoryAttendance
    });
  } catch (error) {
    console.error('[Get Attendance Error]:', error);
    next(error);
  }
};

export const saveAttendance = async (req, res, next) => {
  try {
    const { date, className, section, records = [] } = req.body;
    const presentCount = records.filter((r) => r.status === 'Present').length;
    const absentCount = records.filter((r) => r.status === 'Absent').length;

    const newRecord = {
      date: date || new Date().toISOString().split('T')[0],
      className: className || 'I',
      section: section || 'A',
      presentCount,
      absentCount,
      records
    };

    inMemoryAttendance.unshift(newRecord);

    return res.status(200).json({
      success: true,
      message: 'Attendance saved successfully',
      data: newRecord
    });
  } catch (error) {
    console.error('[Save Attendance Error]:', error);
    next(error);
  }
};

/**
 * Online Classes Endpoints
 */
export const getOnlineClasses = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      count: inMemoryOnlineClasses.length,
      data: inMemoryOnlineClasses
    });
  } catch (error) {
    console.error('[Get Online Classes Error]:', error);
    next(error);
  }
};

export const createOnlineClass = async (req, res, next) => {
  try {
    const data = req.body;
    const newClass = {
      id: `oc_${Date.now()}`,
      className: data.className || 'I',
      division: data.division || 'A',
      teacher: data.teacher || 'Teacher',
      subject: data.subject || 'Subject',
      meetingUrl: data.meetingUrl || data.link || '',
      topic: data.topic || data.title || '',
      dateTime: `${data.date || '2026-10-12'} ${data.time || '10:00 AM'}`,
      duration: data.duration || '45 mins',
      meetingId: data.meetingId || '',
      password: data.password || ''
    };

    inMemoryOnlineClasses.unshift(newClass);

    return res.status(201).json({
      success: true,
      message: 'Online class created successfully',
      data: newClass
    });
  } catch (error) {
    console.error('[Create Online Class Error]:', error);
    next(error);
  }
};

/**
 * Promote Students
 */
export const promoteStudents = async (req, res, next) => {
  try {
    const { studentIds = [], targetClass, targetDivision } = req.body;
    studentIds.forEach((id) => {
      const std = inMemoryStudents.find((s) => s.id === id);
      if (std) {
        std.className = targetClass;
        std.section = targetDivision;
      }
    });

    return res.status(200).json({
      success: true,
      message: `${studentIds.length} students promoted to ${targetClass}-${targetDivision}`,
      data: inMemoryStudents
    });
  } catch (error) {
    console.error('[Promote Students Error]:', error);
    next(error);
  }
};

/**
 * Exam Date Sheets Endpoints
 */
export const getExamDateSheets = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      count: inMemoryExamDateSheets.length,
      data: inMemoryExamDateSheets
    });
  } catch (error) {
    console.error('[Get Exam Date Sheets Error]:', error);
    next(error);
  }
};

export const createExamDateSheet = async (req, res, next) => {
  try {
    const data = req.body;
    const newSheet = {
      id: `eds_${Date.now()}`,
      className: data.className || 'I',
      examTerm: data.examTerm || 'Term 1',
      examName: data.examName || 'Annual Exam',
      file: data.file || 'DateSheet.pdf',
      notes: data.notes || '',
      schedules: data.schedules || []
    };

    inMemoryExamDateSheets.unshift(newSheet);

    return res.status(201).json({
      success: true,
      message: 'Exam date sheet saved successfully',
      data: newSheet
    });
  } catch (error) {
    console.error('[Create Exam Date Sheet Error]:', error);
    next(error);
  }
};

/**
 * Get student by Admission Number
 */
export const getStudentByAdmNo = async (req, res, next) => {
  try {
    const { admNo } = req.params;
    const student = inMemoryStudents.find((s) => s.admNo === admNo);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student with Admission No ${admNo} not found`
      });
    }

    return res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    console.error('[Get Student By AdmNo Error]:', error);
    next(error);
  }
};
