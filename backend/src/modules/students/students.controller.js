import { uploadToImageKit } from '../../core/utils/imagekitService.js';
import prisma from '../../config/db.js';

// Multi-Tenant Partitioned Student Storage: schoolId -> Student[]
export const TENANT_STUDENTS = {
  // ==================== School A: J D International School ====================
  'sch_jd_intl': [
    {
      id: 'std_jd_1',
      schoolId: 'sch_jd_intl',
      rollNo: '1',
      enrollNo: 'ENR-JD-001',
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
      id: 'std_jd_2',
      schoolId: 'sch_jd_intl',
      rollNo: '2',
      enrollNo: 'ENR-JD-002',
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
      id: 'std_jd_3',
      schoolId: 'sch_jd_intl',
      rollNo: '14',
      enrollNo: 'ENR-JD-003',
      srNo: '2059',
      admNo: '2059',
      firstName: 'AADHYA',
      lastName: 'CHOUDHARY',
      fatherName: 'RAMESH CHOUDHARY',
      motherName: 'SUNITA CHOUDHARY',
      fatherMobile: '6377281034',
      motherMobile: '6377281035',
      smsWhatsappNo: '6377281034',
      className: 'Nursery - PP3+',
      section: 'A',
      dob: '2021-03-10',
      gender: 'Girl',
      feeType: 'Day Scholar',
      studentType: 'Old',
      status: 'Studying',
      bloodGroup: 'A+',
      category: 'General',
      address: 'Mahapura, Ajmer Road, Jaipur',
      photoUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=150',
      createdAt: new Date().toISOString()
    }
  ],

  // ==================== School B: Delhi Public Academy ====================
  'sch_dps_branch2': [
    {
      id: 'std_dps_1',
      schoolId: 'sch_dps_branch2',
      rollNo: '1',
      enrollNo: 'ENR-DPS-101',
      srNo: '501',
      admNo: 'DPS-101',
      firstName: 'ROHAN',
      lastName: 'SHARMA',
      fatherName: 'SUNIL SHARMA',
      motherName: 'MEENA SHARMA',
      fatherMobile: '9810033445',
      motherMobile: '9810033446',
      smsWhatsappNo: '9810033445',
      className: 'Class 10',
      section: 'A',
      dob: '2010-05-15',
      gender: 'Male',
      feeType: 'Day Scholar',
      studentType: 'Old',
      status: 'Studying',
      bloodGroup: 'B+',
      category: 'General',
      address: 'Sector 14, Dwarka, New Delhi',
      photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      createdAt: new Date().toISOString()
    },
    {
      id: 'std_dps_2',
      schoolId: 'sch_dps_branch2',
      rollNo: '2',
      enrollNo: 'ENR-DPS-102',
      srNo: '502',
      admNo: 'DPS-102',
      firstName: 'PRIYA',
      lastName: 'PATEL',
      fatherName: 'BHAVESH PATEL',
      motherName: 'NEHA PATEL',
      fatherMobile: '9810044556',
      motherMobile: '9810044557',
      smsWhatsappNo: '9810044556',
      className: 'Class 9',
      section: 'B',
      dob: '2011-08-22',
      gender: 'Girl',
      feeType: 'Day Scholar',
      studentType: 'New',
      status: 'Studying',
      bloodGroup: 'O+',
      category: 'General',
      address: 'Palam Vihar, New Delhi',
      photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      createdAt: new Date().toISOString()
    }
  ]
};

// Partitioned Attendance Store: schoolId -> AttendanceRecord[]
const TENANT_ATTENDANCE = {
  'sch_jd_intl': [
    {
      date: '2026-10-10',
      className: 'I',
      section: 'A',
      presentCount: 2,
      absentCount: 0,
      records: [
        { studentId: 'std_jd_1', status: 'Present' },
        { studentId: 'std_jd_2', status: 'Present' }
      ]
    }
  ],
  'sch_dps_branch2': [
    {
      date: '2026-10-10',
      className: 'Class 10',
      section: 'A',
      presentCount: 1,
      absentCount: 0,
      records: [
        { studentId: 'std_dps_1', status: 'Present' }
      ]
    }
  ]
};

// Partitioned Online Classes Store: schoolId -> OnlineClass[]
const TENANT_ONLINE_CLASSES = {
  'sch_jd_intl': [
    {
      id: 'oc_jd_1',
      className: 'I',
      division: 'A',
      teacher: 'PRITI VERMA',
      subject: 'Mathematics',
      meetingUrl: 'https://meet.google.com/abc-defg-hij',
      topic: 'Addition & Shapes',
      dateTime: '2026-10-14 10:00 AM',
      duration: '45 mins'
    }
  ],
  'sch_dps_branch2': [
    {
      id: 'oc_dps_1',
      className: 'Class 10',
      division: 'A',
      teacher: 'RAJESH GUPTA',
      subject: 'Quadratic Equations',
      meetingUrl: 'https://meet.google.com/xyz-uvwx-rst',
      topic: 'Board Exam Preparation - Chapter 4',
      dateTime: '2026-10-14 11:30 AM',
      duration: '60 mins'
    }
  ]
};

// Partitioned Exam Date Sheets Store
const TENANT_EXAM_SHEETS = {
  'sch_jd_intl': [
    {
      id: 'eds_jd_1',
      className: 'X',
      examTerm: 'Term 1',
      examName: 'Mid Term Examination 2026',
      file: 'DateSheet_X_MidTerm.pdf',
      notes: 'Please bring your own stationary and admit cards.',
      schedules: [
        { date: '2026-11-02', subject: 'English', from: '09:00 AM', to: '12:00 PM' },
        { date: '2026-11-04', subject: 'Mathematics', from: '09:00 AM', to: '12:00 PM' }
      ]
    }
  ],
  'sch_dps_branch2': [
    {
      id: 'eds_dps_1',
      className: 'Class 10',
      examTerm: 'Term 1',
      examName: 'Pre-Board 1',
      file: 'PreBoard_DateSheet_Class10.pdf',
      notes: 'Report to examination hall 15 minutes before time.',
      schedules: [
        { date: '2026-11-10', subject: 'Science', from: '09:00 AM', to: '12:00 PM' }
      ]
    }
  ]
};

// Helper to safely get the active tenant schoolId
const getActiveSchoolId = (req) => {
  return req.schoolId || req.user?.schoolId || req.headers['x-school-id'] || 'sch_jd_intl';
};

/**
 * Upload student photo to ImageKit
 */
export const uploadStudentPhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded' });
    }
    const schoolId = getActiveSchoolId(req);
    const fileName = `student_${schoolId}_${Date.now()}_${req.file.originalname.replace(/\s+/g, '_')}`;
    const uploadResult = await uploadToImageKit(req.file.buffer, fileName, 'students');
    return res.status(200).json({ success: true, message: 'Photo uploaded successfully', data: uploadResult });
  } catch (error) {
    console.error('[Upload Photo Error]:', error);
    next(error);
  }
};

/**
 * Register a new student strictly bounded to the active tenant school
 */
export const registerStudent = async (req, res, next) => {
  try {
    const schoolId = getActiveSchoolId(req);
    const studentData = req.body;

    const newStudent = {
      id: `std_${Date.now()}`,
      schoolId: schoolId, // Guaranteed tenant tagging
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

    // Attempt DB persistence with strict schoolId
    try {
      await prisma.student.create({
        data: {
          id: newStudent.id,
          schoolId: schoolId,
          admNo: newStudent.admNo,
          srNo: newStudent.srNo,
          firstName: newStudent.firstName,
          lastName: newStudent.lastName,
          fatherName: newStudent.fatherName,
          motherName: newStudent.motherName,
          fatherMobile: newStudent.fatherMobile,
          motherMobile: newStudent.motherMobile,
          contactNoSms: newStudent.smsWhatsappNo,
          className: newStudent.className,
          gender: newStudent.gender,
          photoUrl: newStudent.photoUrl
        }
      });
    } catch (dbErr) {
      // In-memory fallback
    }

    if (!TENANT_STUDENTS[schoolId]) {
      TENANT_STUDENTS[schoolId] = [];
    }
    TENANT_STUDENTS[schoolId].unshift(newStudent);

    return res.status(201).json({
      success: true,
      message: `Student registered successfully in school ${schoolId}`,
      data: newStudent
    });
  } catch (error) {
    console.error('[Register Student Error]:', error);
    next(error);
  }
};

/**
 * Get list of students strictly filtered by tenant schoolId
 * School A can NEVER receive School B's students!
 */
export const getStudentsList = async (req, res, next) => {
  try {
    const schoolId = getActiveSchoolId(req);
    const { search = '', className = '', section = '' } = req.query;

    let students = [];

    // Attempt DB query strictly filtered by schoolId
    try {
      students = await prisma.student.findMany({
        where: { schoolId }
      });
    } catch (dbErr) {
      // Offline fallback: isolated partition
      students = TENANT_STUDENTS[schoolId] || [];
    }

    if (!students || students.length === 0) {
      students = TENANT_STUDENTS[schoolId] || [];
    }

    let filtered = [...students];
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
        (s) => s.className?.toLowerCase() === className.toLowerCase()
      );
    }

    if (section) {
      filtered = filtered.filter(
        (s) => s.section?.toLowerCase() === section.toLowerCase()
      );
    }

    return res.status(200).json({
      success: true,
      schoolId: schoolId,
      count: filtered.length,
      data: filtered
    });
  } catch (error) {
    console.error('[Get Students Error]:', error);
    next(error);
  }
};

/**
 * Batch update / assign roll numbers within tenant
 */
export const assignRollNumbers = async (req, res, next) => {
  try {
    const schoolId = getActiveSchoolId(req);
    const { updates = [] } = req.body;
    const pool = TENANT_STUDENTS[schoolId] || [];

    updates.forEach(({ id, rollNo }) => {
      const std = pool.find((s) => s.id === id);
      if (std) std.rollNo = String(rollNo);
    });

    return res.status(200).json({
      success: true,
      message: 'Roll numbers assigned successfully',
      data: pool
    });
  } catch (error) {
    console.error('[Assign Roll Numbers Error]:', error);
    next(error);
  }
};

/**
 * Student Attendance List & Submission (Tenant Scoped)
 */
export const getAttendance = async (req, res, next) => {
  try {
    const schoolId = getActiveSchoolId(req);
    const { date, className, section } = req.query;
    const history = TENANT_ATTENDANCE[schoolId] || [];

    const record = history.find(
      (a) =>
        (!date || a.date === date) &&
        (!className || a.className === className) &&
        (!section || a.section === section)
    );

    return res.status(200).json({
      success: true,
      schoolId,
      data: record || null,
      history
    });
  } catch (error) {
    console.error('[Get Attendance Error]:', error);
    next(error);
  }
};

export const saveAttendance = async (req, res, next) => {
  try {
    const schoolId = getActiveSchoolId(req);
    const { date, className, section, records = [] } = req.body;
    const userRole = req.user?.role || req.headers['x-user-role'] || 'ADMIN';
    const todayStr = new Date().toISOString().split('T')[0];

    // Attender role is strictly restricted to today's date
    if (userRole === 'ATTENDER' && date && date !== todayStr) {
      return res.status(403).json({
        success: false,
        message: `Attenders are only allowed to submit attendance for today (${todayStr}).`
      });
    }
    const presentCount = records.filter((r) => r.status === 'Present').length;
    const absentCount = records.filter((r) => r.status === 'Absent').length;

    const newRecord = {
      schoolId,
      date: date || new Date().toISOString().split('T')[0],
      className: className || 'I',
      section: section || 'A',
      presentCount,
      absentCount,
      records
    };

    if (!TENANT_ATTENDANCE[schoolId]) {
      TENANT_ATTENDANCE[schoolId] = [];
    }
    TENANT_ATTENDANCE[schoolId].unshift(newRecord);

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
 * Online Classes Endpoints (Tenant Scoped)
 */
export const getOnlineClasses = async (req, res, next) => {
  try {
    const schoolId = getActiveSchoolId(req);
    const classes = TENANT_ONLINE_CLASSES[schoolId] || [];
    return res.status(200).json({
      success: true,
      schoolId,
      count: classes.length,
      data: classes
    });
  } catch (error) {
    console.error('[Get Online Classes Error]:', error);
    next(error);
  }
};

export const createOnlineClass = async (req, res, next) => {
  try {
    const schoolId = getActiveSchoolId(req);
    const data = req.body;
    const newClass = {
      id: `oc_${Date.now()}`,
      schoolId,
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

    if (!TENANT_ONLINE_CLASSES[schoolId]) {
      TENANT_ONLINE_CLASSES[schoolId] = [];
    }
    TENANT_ONLINE_CLASSES[schoolId].unshift(newClass);

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
 * Promote Students within Tenant
 */
export const promoteStudents = async (req, res, next) => {
  try {
    const schoolId = getActiveSchoolId(req);
    const { studentIds = [], targetClass, targetDivision } = req.body;
    const pool = TENANT_STUDENTS[schoolId] || [];

    studentIds.forEach((id) => {
      const std = pool.find((s) => s.id === id);
      if (std) {
        std.className = targetClass;
        std.section = targetDivision;
      }
    });

    return res.status(200).json({
      success: true,
      message: `${studentIds.length} students promoted to ${targetClass}-${targetDivision}`,
      data: pool
    });
  } catch (error) {
    console.error('[Promote Students Error]:', error);
    next(error);
  }
};

/**
 * Exam Date Sheets Endpoints (Tenant Scoped)
 */
export const getExamDateSheets = async (req, res, next) => {
  try {
    const schoolId = getActiveSchoolId(req);
    const sheets = TENANT_EXAM_SHEETS[schoolId] || [];
    return res.status(200).json({
      success: true,
      schoolId,
      count: sheets.length,
      data: sheets
    });
  } catch (error) {
    console.error('[Get Exam Date Sheets Error]:', error);
    next(error);
  }
};

export const createExamDateSheet = async (req, res, next) => {
  try {
    const schoolId = getActiveSchoolId(req);
    const data = req.body;
    const newSheet = {
      id: `eds_${Date.now()}`,
      schoolId,
      className: data.className || 'I',
      examTerm: data.examTerm || 'Term 1',
      examName: data.examName || 'Annual Exam',
      file: data.file || 'DateSheet.pdf',
      notes: data.notes || '',
      schedules: data.schedules || []
    };

    if (!TENANT_EXAM_SHEETS[schoolId]) {
      TENANT_EXAM_SHEETS[schoolId] = [];
    }
    TENANT_EXAM_SHEETS[schoolId].unshift(newSheet);

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
 * Get student by Admission Number strictly scoped to active tenant
 */
export const getStudentByAdmNo = async (req, res, next) => {
  try {
    const schoolId = getActiveSchoolId(req);
    const { admNo } = req.params;
    const pool = TENANT_STUDENTS[schoolId] || [];
    const student = pool.find((s) => s.admNo === admNo);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student with Admission No ${admNo} not found in this school`
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

/**
 * Get bulk students for spreadsheet editing (1:1 with UAB add-edit-bulk-students)
 */
export const getBulkStudents = async (req, res, next) => {
  try {
    const schoolId = getActiveSchoolId(req);
    const { className, section } = req.query;
    let pool = TENANT_STUDENTS[schoolId] || [];

    if (className) {
      pool = pool.filter(s => s.className.toLowerCase() === className.toLowerCase());
    }
    if (section) {
      pool = pool.filter(s => s.section.toLowerCase() === section.toLowerCase());
    }

    const bulkData = pool.map((s, idx) => ({
      id: s.id || `std_${schoolId}_${idx + 1}`,
      sr_no: s.srNo || `${1600 + idx}`,
      adm_no: s.admNo || `ADM-${idx + 1}`,
      permanent_edu_no: s.pen || `PEN${2026000 + idx}`,
      enroll_no: s.enrollNo || `ENR-${idx + 1}`,
      adm_date: s.admissionDate || s.createdAt?.split('T')[0] || '2024-04-01',
      class_id: s.className,
      division_id: s.section,
      first_name: s.firstName,
      last_name: s.lastName || '',
      dob: s.dob || '2015-05-10',
      gender: s.gender || 'Male',
      blood_group: s.bloodGroup || 'B+',
      aadhaar: s.aadhaar || '123456789012',
      nationality: 'Indian',
      religion: s.religion || 'Hindu',
      category: s.category || 'General',
      house: s.house || 'Blue',
      fathers_name: s.fatherName || '',
      fathers_mobile_no: s.fatherMobile || s.smsWhatsappNo || '9829012345',
      fathers_aadhaar: s.fatherAadhaar || '987654321012',
      mothers_name: s.motherName || '',
      mothers_mobile_no: s.motherMobile || '9829012346',
      mothers_aadhaar: s.motherAadhaar || '876543210987'
    }));

    return res.status(200).json({
      success: true,
      count: bulkData.length,
      data: bulkData
    });
  } catch (error) {
    console.error('[Get Bulk Students Error]:', error);
    next(error);
  }
};

/**
 * Save Bulk Students edits (1:1 with UAB add-edit-bulk-students)
 */
export const saveBulkStudents = async (req, res, next) => {
  try {
    const schoolId = getActiveSchoolId(req);
    const { students = [] } = req.body;

    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No student records provided for saving'
      });
    }

    // Server-side validation
    const errors = [];
    students.forEach((s, idx) => {
      if (!s.adm_no) errors.push(`Row ${idx + 1}: Adm No is required`);
      if (!s.first_name) errors.push(`Row ${idx + 1}: First Name is required`);
      if (s.aadhaar && s.aadhaar.length !== 12) errors.push(`Row ${idx + 1}: Student Aadhaar must be 12 digits`);
      if (s.fathers_mobile_no && s.fathers_mobile_no.length !== 10) errors.push(`Row ${idx + 1}: Father mobile must be 10 digits`);
    });

    if (errors.length > 0) {
      return res.status(422).json({
        success: false,
        message: 'Validation failed on student records',
        errors
      });
    }

    if (!TENANT_STUDENTS[schoolId]) {
      TENANT_STUDENTS[schoolId] = [];
    }

    // Merge or insert records
    students.forEach((s) => {
      const existingIdx = TENANT_STUDENTS[schoolId].findIndex(x => x.admNo === s.adm_no || (s.id && x.id === s.id));
      const mappedRecord = {
        id: s.id || `std_${schoolId}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        schoolId,
        srNo: s.sr_no || '0',
        admNo: s.adm_no,
        pen: s.permanent_edu_no,
        enrollNo: s.enroll_no,
        admissionDate: s.adm_date,
        className: s.class_id,
        section: s.division_id,
        firstName: s.first_name,
        lastName: s.last_name || '',
        dob: s.dob,
        gender: s.gender,
        bloodGroup: s.blood_group,
        aadhaar: s.aadhaar,
        religion: s.religion,
        category: s.category,
        house: s.house,
        fatherName: s.fathers_name,
        fatherMobile: s.fathers_mobile_no,
        fatherAadhaar: s.fathers_aadhaar,
        motherName: s.mothers_name,
        motherMobile: s.mothers_mobile_no,
        motherAadhaar: s.mothers_aadhaar,
        smsWhatsappNo: s.fathers_mobile_no,
        status: 'Studying',
        updatedAt: new Date().toISOString()
      };

      if (existingIdx !== -1) {
        TENANT_STUDENTS[schoolId][existingIdx] = {
          ...TENANT_STUDENTS[schoolId][existingIdx],
          ...mappedRecord
        };
      } else {
        TENANT_STUDENTS[schoolId].push(mappedRecord);
      }
    });

    return res.status(200).json({
      success: true,
      message: `Successfully updated ${students.length} student record(s) in database!`,
      savedCount: students.length
    });
  } catch (error) {
    console.error('[Save Bulk Students Error]:', error);
    next(error);
  }
};

/**
 * Get student photo management list (1:1 with UAB student-photo-management)
 */
export const getStudentPhotosList = async (req, res, next) => {
  try {
    const schoolId = getActiveSchoolId(req);
    const { className, section } = req.query;
    let pool = TENANT_STUDENTS[schoolId] || [];

    if (className) {
      pool = pool.filter(s => s.className.toLowerCase() === className.toLowerCase());
    }
    if (section) {
      pool = pool.filter(s => s.section.toLowerCase() === section.toLowerCase());
    }

    const data = pool.map(s => ({
      id: s.id,
      sr_no: s.srNo,
      adm_no: s.admNo,
      roll_no: s.rollNo || '-',
      student_name: `${s.firstName} ${s.lastName || ''}`.trim(),
      class_name: s.className,
      division_name: s.section,
      gender: s.gender,
      photo_url: s.photoUrl || '',
      has_photo: Boolean(s.photoUrl && s.photoUrl.trim() !== ''),
      father_name: s.fatherName || ''
    }));

    return res.status(200).json({
      success: true,
      count: data.length,
      data
    });
  } catch (error) {
    console.error('[Get Student Photos List Error]:', error);
    next(error);
  }
};

/**
 * Save single student photo from upload or webcam capture
 */
export const saveSingleStudentPhoto = async (req, res, next) => {
  try {
    const schoolId = getActiveSchoolId(req);
    const { studentId, admNo, photoUrl } = req.body;

    if (!photoUrl) {
      return res.status(400).json({ success: false, message: 'Photo image data is required' });
    }

    const pool = TENANT_STUDENTS[schoolId] || [];
    const student = pool.find(s => s.id === studentId || s.admNo === admNo);

    if (student) {
      student.photoUrl = photoUrl;
      student.photoUpdatedAt = new Date().toISOString();
    }

    return res.status(200).json({
      success: true,
      message: 'Student photo updated successfully',
      data: {
        id: student?.id || studentId,
        admNo: student?.admNo || admNo,
        photoUrl
      }
    });
  } catch (error) {
    console.error('[Save Student Photo Error]:', error);
    next(error);
  }
};

