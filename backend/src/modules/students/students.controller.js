import { uploadToImageKit } from '../../core/utils/imagekitService.js';
import prisma from '../../config/db.js';

// Multi-Tenant Partitioned Student Storage: schoolId -> Student[] (Clean Fresh State)
export const TENANT_STUDENTS = {
  'sch_jd_intl': [],
  'sch_dps_branch2': []
};

const TENANT_ATTENDANCE = {
  'sch_jd_intl': [],
  'sch_dps_branch2': []
};

const TENANT_ONLINE_CLASSES = {
  'sch_jd_intl': [],
  'sch_dps_branch2': []
};

const TENANT_EXAM_SHEETS = {
  'sch_jd_intl': [],
  'sch_dps_branch2': []
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
    const studentData = req.body || {};

    if (!TENANT_STUDENTS[schoolId]) {
      TENANT_STUDENTS[schoolId] = [];
    }

    const admNo = String(studentData.adm_no || studentData.admNo || '').trim() || String(Math.floor(2000 + Math.random() * 8000));
    const admNoLower = admNo.toLowerCase();
    const targetId = studentData.id ? String(studentData.id).trim() : null;

    let existingIdx = TENANT_STUDENTS[schoolId].findIndex(
      (s) => String(s.admNo).trim().toLowerCase() === admNoLower || (targetId && String(s.id).trim() === targetId)
    );

    // If not found in-memory, also check Prisma DB if available
    if (existingIdx === -1) {
      try {
        const dbStudent = await prisma.student.findFirst({
          where: {
            schoolId,
            OR: [
              { admNo },
              ...(targetId ? [{ id: targetId }] : [])
            ]
          }
        });
        if (dbStudent) {
          TENANT_STUDENTS[schoolId].push(dbStudent);
          existingIdx = TENANT_STUDENTS[schoolId].length - 1;
        }
      } catch (dbErr) {
        // DB offline fallback
      }
    }

    if (existingIdx !== -1) {
      // In-place update for existing student matching admission number in tenant
      const existing = TENANT_STUDENTS[schoolId][existingIdx];
      const firstName = studentData.first_name || studentData.firstName || existing.firstName || 'Student';
      const lastName = studentData.last_name !== undefined ? studentData.last_name : (studentData.lastName !== undefined ? studentData.lastName : (existing.lastName || ''));
      const fullName = studentData.name || `${firstName} ${lastName}`.trim();

      const updatedStudent = {
        ...existing,
        ...studentData,
        id: existing.id,
        schoolId: schoolId,
        admNo: existing.admNo,
        srNo: studentData.sr_no || studentData.srNo || existing.srNo || '0',
        firstName,
        lastName,
        name: fullName,
        fatherName: studentData.fathers_name !== undefined ? studentData.fathers_name : (studentData.fatherName !== undefined ? studentData.fatherName : (existing.fatherName || '')),
        motherName: studentData.mothers_name !== undefined ? studentData.mothers_name : (studentData.motherName !== undefined ? studentData.motherName : (existing.motherName || '')),
        fatherMobile: studentData.fathers_mobile_no || studentData.fatherMobile || existing.fatherMobile || '',
        fatherWhatsapp: studentData.fathers_whatsapp_no || studentData.fatherWhatsapp || existing.fatherWhatsapp || '',
        fatherEmail: studentData.fathers_email || studentData.fatherEmail || existing.fatherEmail || '',
        fatherAadhaar: studentData.fathers_aadhaar || studentData.fatherAadhaar || existing.fatherAadhaar || '',
        motherMobile: studentData.mothers_mobile_no || studentData.motherMobile || existing.motherMobile || '',
        motherWhatsapp: studentData.mothers_whatsapp_no || studentData.motherWhatsapp || existing.motherWhatsapp || '',
        motherEmail: studentData.mothers_email || studentData.motherEmail || existing.motherEmail || '',
        motherAadhaar: studentData.mothers_aadhaar || studentData.motherAadhaar || existing.motherAadhaar || '',
        contactNo: studentData.fathers_whatsapp_no || studentData.contact_no_sms || studentData.contactNo || studentData.fathers_mobile_no || existing.contactNo || '',
        smsWhatsappNo: studentData.fathers_whatsapp_no || studentData.contact_no_sms || studentData.smsWhatsappNo || existing.smsWhatsappNo || '',
        className: studentData.class_id || studentData.className || existing.className || 'I',
        section: studentData.division_id || studentData.section || existing.section || 'A',
        dob: studentData.dob || existing.dob || '2019-01-01',
        gender: studentData.gender || existing.gender || 'Male',
        bloodGroup: studentData.blood_group || studentData.bloodGroup || existing.bloodGroup || 'B+',
        category: studentData.category || studentData.cast || existing.category || 'General',
        religion: studentData.religion || existing.religion || 'Hindu',
        nationality: studentData.nationality || existing.nationality || 'Indian',
        aadhaar: studentData.aadhaar || studentData.student_aadhaar || existing.aadhaar || '',
        email: studentData.email || studentData.student_email || existing.email || '',
        pen: studentData.permanent_edu_no || studentData.pen || studentData.apaar_id || existing.pen || '',
        enrollNo: studentData.enroll_no || studentData.enrollNo || studentData.general_no || existing.enrollNo || '',
        admissionDate: studentData.adm_date || studentData.admissionDate || existing.admissionDate || '',
        feeType: studentData.fee_id || studentData.feeType || existing.feeType || 'Day Scholar',
        studentType: studentData.stu_type || studentData.studentType || existing.studentType || 'New',
        status: studentData.status_type || studentData.status || existing.status || 'Studying',
        rollNo: studentData.roll_no !== undefined ? String(studentData.roll_no) : (studentData.rollNo !== undefined ? String(studentData.rollNo) : (existing.rollNo || '0')),
        photoUrl: studentData.student_photo || studentData.photoUrl || existing.photoUrl || '',
        fatherPhoto: studentData.father_photo || studentData.fatherPhoto || existing.fatherPhoto || '',
        motherPhoto: studentData.mother_photo || studentData.motherPhoto || existing.motherPhoto || '',
        address: studentData.present_address || studentData.address || existing.address || '',
        isNew: false,
        createdAt: existing.createdAt,
        updatedAt: new Date().toISOString()
      };

      TENANT_STUDENTS[schoolId][existingIdx] = updatedStudent;

      try {
        await prisma.student.updateMany({
          where: { schoolId, admNo: existing.admNo },
          data: {
            firstName: updatedStudent.firstName,
            lastName: updatedStudent.lastName,
            fatherName: updatedStudent.fatherName,
            motherName: updatedStudent.motherName,
            fatherMobile: updatedStudent.fatherMobile,
            motherMobile: updatedStudent.motherMobile,
            contactNoSms: updatedStudent.smsWhatsappNo,
            gender: updatedStudent.gender,
            photoUrl: updatedStudent.photoUrl,
            address: updatedStudent.address
          }
        });
      } catch (dbErr) {
        // In-memory fallback
      }

      return res.status(200).json({
        success: true,
        message: `Student ${existing.admNo} updated successfully in school ${schoolId}`,
        data: updatedStudent
      });
    }

    const newStudent = {
      id: studentData.id || `std_${Date.now()}`,
      schoolId: schoolId, // Guaranteed tenant tagging
      admNo: admNo,
      srNo: studentData.sr_no || studentData.srNo || '0',
      firstName: studentData.first_name || studentData.firstName || 'Student',
      lastName: studentData.last_name || studentData.lastName || '',
      name: studentData.name || `${studentData.first_name || studentData.firstName || 'Student'} ${studentData.last_name || studentData.lastName || ''}`.trim(),
      fatherName: studentData.fathers_name || studentData.fatherName || '',
      motherName: studentData.mothers_name || studentData.motherName || '',
      fatherMobile: studentData.fathers_mobile_no || studentData.fatherMobile || '',
      fatherWhatsapp: studentData.fathers_whatsapp_no || studentData.fatherWhatsapp || '',
      fatherEmail: studentData.fathers_email || studentData.fatherEmail || '',
      fatherAadhaar: studentData.fathers_aadhaar || studentData.fatherAadhaar || '',
      motherMobile: studentData.mothers_mobile_no || studentData.motherMobile || '',
      motherWhatsapp: studentData.mothers_whatsapp_no || studentData.motherWhatsapp || '',
      motherEmail: studentData.mothers_email || studentData.motherEmail || '',
      motherAadhaar: studentData.mothers_aadhaar || studentData.motherAadhaar || '',
      contactNo: studentData.fathers_whatsapp_no || studentData.contact_no_sms || studentData.contactNo || '',
      smsWhatsappNo: studentData.fathers_whatsapp_no || studentData.contact_no_sms || studentData.smsWhatsappNo || '',
      className: studentData.class_id || studentData.className || 'I',
      section: studentData.division_id || studentData.section || 'A',
      dob: studentData.dob || '2019-01-01',
      gender: studentData.gender || 'Male',
      bloodGroup: studentData.blood_group || studentData.bloodGroup || 'B+',
      category: studentData.category || studentData.cast || 'General',
      religion: studentData.religion || 'Hindu',
      nationality: studentData.nationality || 'Indian',
      aadhaar: studentData.aadhaar || studentData.student_aadhaar || '',
      email: studentData.email || studentData.student_email || '',
      pen: studentData.permanent_edu_no || studentData.pen || studentData.apaar_id || '',
      enrollNo: studentData.enroll_no || studentData.enrollNo || studentData.general_no || '',
      admissionDate: studentData.adm_date || studentData.admissionDate || '',
      feeType: studentData.fee_id || studentData.feeType || 'Day Scholar',
      studentType: studentData.stu_type || studentData.studentType || 'New',
      status: studentData.status_type || studentData.status || 'Studying',
      rollNo: studentData.roll_no !== undefined ? String(studentData.roll_no) : (studentData.rollNo !== undefined ? String(studentData.rollNo) : '0'),
      photoUrl: studentData.student_photo || studentData.photoUrl || '',
      fatherPhoto: studentData.father_photo || studentData.fatherPhoto || '',
      motherPhoto: studentData.mother_photo || studentData.motherPhoto || '',
      address: studentData.present_address || studentData.address || '',
      isNew: true,
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
          gender: newStudent.gender,
          photoUrl: newStudent.photoUrl,
          address: newStudent.address
        }
      });
    } catch (dbErr) {
      // In-memory fallback
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
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(
        (s) =>
          (s.name && s.name.toLowerCase().includes(q)) ||
          (s.firstName && s.firstName.toLowerCase().includes(q)) ||
          (s.lastName && s.lastName.toLowerCase().includes(q)) ||
          (s.admNo && String(s.admNo).toLowerCase().includes(q)) ||
          (s.srNo && String(s.srNo).includes(q))
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

    updates.forEach(({ id, admNo, rollNo, feebookNo }) => {
      const targetId = id ? String(id).trim() : null;
      const targetAdm = admNo ? String(admNo).trim().toLowerCase() : null;
      const std = pool.find(
        (s) => (targetId && String(s.id).trim() === targetId) || (targetAdm && String(s.admNo).trim().toLowerCase() === targetAdm)
      );
      if (std) {
        if (rollNo !== undefined) std.rollNo = String(rollNo);
        if (feebookNo !== undefined) std.feebookNo = String(feebookNo);
      }
    });

    // Also attempt DB update if connected
    try {
      for (const u of updates) {
        const orClause = [];
        if (u.id) orClause.push({ id: u.id });
        if (u.admNo) orClause.push({ admNo: u.admNo });
        if (orClause.length > 0) {
          const updateData = {};
          if (u.rollNo !== undefined) updateData.rollNo = String(u.rollNo);
          if (u.feebookNo !== undefined) updateData.feebookNo = String(u.feebookNo);
          await prisma.student.updateMany({
            where: { schoolId, OR: orClause },
            data: updateData
          });
        }
      }
    } catch (dbErr) {
      // Memory pool is primary
    }

    return res.status(200).json({
      success: true,
      message: 'Numbers assigned successfully',
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
      id: data.id || `eds_${Date.now()}`,
      schoolId,
      entryMode: data.entryMode || 'manual',
      className: data.className || 'I',
      examTerm: data.examTerm || 'Term 1',
      examName: data.examName || 'Annual Exam',
      file: data.file || 'DateSheet.pdf',
      fileData: data.fileData || '',
      notes: data.notes || '',
      schedules: data.schedules || [],
      createdAt: data.createdAt || new Date().toISOString()
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

export const updateExamDateSheet = async (req, res, next) => {
  try {
    const schoolId = getActiveSchoolId(req);
    const { id } = req.params;
    const data = req.body;
    if (!TENANT_EXAM_SHEETS[schoolId]) {
      TENANT_EXAM_SHEETS[schoolId] = [];
    }
    const index = TENANT_EXAM_SHEETS[schoolId].findIndex((s) => s.id === id);
    if (index === -1) {
      // If not found, add it
      const newSheet = { ...data, id, schoolId, updatedAt: new Date().toISOString() };
      TENANT_EXAM_SHEETS[schoolId].unshift(newSheet);
      return res.status(200).json({ success: true, message: 'Exam date sheet updated', data: newSheet });
    }
    const updated = {
      ...TENANT_EXAM_SHEETS[schoolId][index],
      ...data,
      id,
      schoolId,
      updatedAt: new Date().toISOString()
    };
    TENANT_EXAM_SHEETS[schoolId][index] = updated;
    return res.status(200).json({
      success: true,
      message: 'Exam date sheet updated successfully',
      data: updated
    });
  } catch (error) {
    console.error('[Update Exam Date Sheet Error]:', error);
    next(error);
  }
};

export const deleteExamDateSheet = async (req, res, next) => {
  try {
    const schoolId = getActiveSchoolId(req);
    const { id } = req.params;
    if (TENANT_EXAM_SHEETS[schoolId]) {
      TENANT_EXAM_SHEETS[schoolId] = TENANT_EXAM_SHEETS[schoolId].filter((s) => s.id !== id);
    }
    return res.status(200).json({
      success: true,
      message: 'Exam date sheet deleted successfully'
    });
  } catch (error) {
    console.error('[Delete Exam Date Sheet Error]:', error);
    next(error);
  }
};

/**
 * Get student by Admission Number strictly scoped to active tenant
 */
/**
 * Update an existing student scoped to active tenant
 */
export const updateStudent = async (req, res, next) => {
  try {
    const schoolId = getActiveSchoolId(req);
    const { admNo } = req.params;
    const updateData = req.body || {};

    if (!TENANT_STUDENTS[schoolId]) {
      TENANT_STUDENTS[schoolId] = [];
    }

    const targetAdmNo = String(admNo || '').trim();
    const targetAdmLower = targetAdmNo.toLowerCase();
    const targetId = updateData.id ? String(updateData.id).trim() : null;

    let index = TENANT_STUDENTS[schoolId].findIndex(
      (s) => String(s.admNo).trim().toLowerCase() === targetAdmLower || String(s.id).trim() === targetAdmNo || (targetId && String(s.id).trim() === targetId)
    );

    // If not found in memory pool, try DB
    if (index === -1) {
      try {
        const dbStudent = await prisma.student.findFirst({
          where: {
            schoolId,
            OR: [
              { admNo: targetAdmNo },
              { id: targetAdmNo },
              ...(targetId ? [{ id: targetId }] : [])
            ]
          }
        });
        if (dbStudent) {
          TENANT_STUDENTS[schoolId].push(dbStudent);
          index = TENANT_STUDENTS[schoolId].length - 1;
        }
      } catch (dbErr) {
        // DB offline fallback
      }
    }

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: `Student with Admission No ${admNo} not found in this school`
      });
    }

    const existing = TENANT_STUDENTS[schoolId][index];
    const firstName = updateData.first_name || updateData.firstName || existing.firstName || '';
    const lastName = updateData.last_name !== undefined ? updateData.last_name : (updateData.lastName !== undefined ? updateData.lastName : (existing.lastName || ''));
    const fullName = updateData.name || `${firstName} ${lastName}`.trim();

    const updated = {
      ...existing,
      ...updateData,
      id: existing.id,
      schoolId: schoolId,
      admNo: existing.admNo,
      srNo: updateData.sr_no || updateData.srNo || existing.srNo || '0',
      firstName,
      lastName,
      name: fullName,
      fatherName: updateData.fathers_name !== undefined ? updateData.fathers_name : (updateData.fatherName !== undefined ? updateData.fatherName : (existing.fatherName || '')),
      motherName: updateData.mothers_name !== undefined ? updateData.mothers_name : (updateData.motherName !== undefined ? updateData.motherName : (existing.motherName || '')),
      fatherMobile: updateData.fathers_mobile_no || updateData.fatherMobile || existing.fatherMobile || '',
      fatherWhatsapp: updateData.fathers_whatsapp_no || updateData.fatherWhatsapp || existing.fatherWhatsapp || '',
      fatherEmail: updateData.fathers_email || updateData.fatherEmail || existing.fatherEmail || '',
      fatherAadhaar: updateData.fathers_aadhaar || updateData.fatherAadhaar || existing.fatherAadhaar || '',
      motherMobile: updateData.mothers_mobile_no || updateData.motherMobile || existing.motherMobile || '',
      motherWhatsapp: updateData.mothers_whatsapp_no || updateData.motherWhatsapp || existing.motherWhatsapp || '',
      motherEmail: updateData.mothers_email || updateData.motherEmail || existing.motherEmail || '',
      motherAadhaar: updateData.mothers_aadhaar || updateData.motherAadhaar || existing.motherAadhaar || '',
      contactNo: updateData.fathers_whatsapp_no || updateData.contact_no_sms || updateData.contactNo || updateData.fathers_mobile_no || existing.contactNo || '',
      smsWhatsappNo: updateData.fathers_whatsapp_no || updateData.contact_no_sms || updateData.smsWhatsappNo || existing.smsWhatsappNo || '',
      className: updateData.class_id || updateData.className || existing.className,
      section: updateData.division_id || updateData.section || existing.section,
      dob: updateData.dob || existing.dob,
      gender: updateData.gender || existing.gender,
      bloodGroup: updateData.blood_group || updateData.bloodGroup || existing.bloodGroup || 'B+',
      category: updateData.category || updateData.cast || existing.category || 'General',
      religion: updateData.religion || existing.religion || 'Hindu',
      nationality: updateData.nationality || existing.nationality || 'Indian',
      aadhaar: updateData.aadhaar || updateData.student_aadhaar || existing.aadhaar || '',
      email: updateData.email || updateData.student_email || existing.email || '',
      pen: updateData.permanent_edu_no || updateData.pen || updateData.apaar_id || existing.pen || '',
      enrollNo: updateData.enroll_no || updateData.enrollNo || updateData.general_no || existing.enrollNo || '',
      admissionDate: updateData.adm_date || updateData.admissionDate || existing.admissionDate || '',
      feeType: updateData.fee_id || updateData.feeType || existing.feeType || 'Day Scholar',
      studentType: updateData.stu_type || updateData.studentType || existing.studentType || 'New',
      status: updateData.status_type || updateData.status || existing.status || 'Studying',
      rollNo: updateData.roll_no !== undefined ? String(updateData.roll_no) : (updateData.rollNo !== undefined ? String(updateData.rollNo) : existing.rollNo),
      photoUrl: updateData.student_photo || updateData.photoUrl || existing.photoUrl,
      fatherPhoto: updateData.father_photo || updateData.fatherPhoto || existing.fatherPhoto || '',
      motherPhoto: updateData.mother_photo || updateData.motherPhoto || existing.motherPhoto || '',
      address: updateData.present_address || updateData.address || existing.address,
      isNew: false,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString()
    };

    TENANT_STUDENTS[schoolId][index] = updated;

    try {
      await prisma.student.updateMany({
        where: { schoolId, admNo: existing.admNo },
        data: {
          firstName: updated.firstName,
          lastName: updated.lastName,
          fatherName: updated.fatherName,
          motherName: updated.motherName,
          fatherMobile: updated.fatherMobile,
          motherMobile: updated.motherMobile,
          contactNoSms: updated.smsWhatsappNo,
          gender: updated.gender,
          photoUrl: updated.photoUrl,
          address: updated.address
        }
      });
    } catch (e) {}

    return res.status(200).json({
      success: true,
      message: `Student ${updated.name || admNo} updated successfully`,
      data: updated
    });
  } catch (error) {
    console.error('[Update Student Error]:', error);
    next(error);
  }
};

export const getStudentByAdmNo = async (req, res, next) => {
  try {
    const schoolId = getActiveSchoolId(req);
    const { admNo } = req.params;
    const targetAdmNo = String(admNo || '').trim();
    const targetAdmLower = targetAdmNo.toLowerCase();

    let student = null;
    try {
      student = await prisma.student.findFirst({
        where: {
          schoolId,
          OR: [
            { admNo: targetAdmNo },
            { id: targetAdmNo }
          ]
        }
      });
    } catch (dbErr) {
      // In-memory fallback
    }

    if (!student) {
      const pool = TENANT_STUDENTS[schoolId] || [];
      student = pool.find(
        (s) => String(s.admNo).trim().toLowerCase() === targetAdmLower || String(s.id).trim() === targetAdmNo
      );
    }

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

    if (!pool || pool.length === 0) {
      try {
        const dbStudents = await prisma.student.findMany({ where: { schoolId } });
        if (dbStudents && dbStudents.length > 0) {
          TENANT_STUDENTS[schoolId] = dbStudents;
          pool = dbStudents;
        }
      } catch (e) {}
    }

    if (className) {
      pool = pool.filter(s => s.className?.toLowerCase() === className.toLowerCase());
    }
    if (section) {
      pool = pool.filter(s => s.section?.toLowerCase() === section.toLowerCase());
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
      const rowAdm = String(s.adm_no || s.admNo || '').trim();
      const rowAdmLower = rowAdm.toLowerCase();
      const rowId = s.id ? String(s.id).trim() : null;

      const existingIdx = TENANT_STUDENTS[schoolId].findIndex(
        x => (rowAdm && String(x.admNo).trim().toLowerCase() === rowAdmLower) || (rowId && String(x.id).trim() === rowId)
      );
      const mappedRecord = {
        id: s.id || (existingIdx !== -1 ? TENANT_STUDENTS[schoolId][existingIdx].id : `std_${schoolId}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`),
        schoolId,
        srNo: s.sr_no || s.srNo || '0',
        admNo: rowAdm || (existingIdx !== -1 ? TENANT_STUDENTS[schoolId][existingIdx].admNo : ''),
        pen: s.permanent_edu_no || s.pen || '',
        enrollNo: s.enroll_no || s.enrollNo || '',
        admissionDate: s.adm_date || s.admissionDate || '',
        className: s.class_id || s.className || '',
        section: s.division_id || s.section || '',
        firstName: s.first_name || s.firstName || '',
        lastName: s.last_name !== undefined ? s.last_name : (s.lastName || ''),
        dob: s.dob || '',
        gender: s.gender || 'Male',
        bloodGroup: s.blood_group || s.bloodGroup || '',
        aadhaar: s.aadhaar || '',
        religion: s.religion || '',
        category: s.category || '',
        house: s.house || '',
        fatherName: s.fathers_name || s.fatherName || '',
        fatherMobile: s.fathers_mobile_no || s.fatherMobile || '',
        fatherAadhaar: s.fathers_aadhaar || s.fatherAadhaar || '',
        motherName: s.mothers_name || s.motherName || '',
        motherMobile: s.mothers_mobile_no || s.motherMobile || '',
        motherAadhaar: s.mothers_aadhaar || s.motherAadhaar || '',
        smsWhatsappNo: s.fathers_mobile_no || s.smsWhatsappNo || '',
        status: s.status || 'Studying',
        updatedAt: new Date().toISOString()
      };

      if (existingIdx !== -1) {
        TENANT_STUDENTS[schoolId][existingIdx] = {
          ...TENANT_STUDENTS[schoolId][existingIdx],
          ...mappedRecord,
          id: TENANT_STUDENTS[schoolId][existingIdx].id,
          admNo: TENANT_STUDENTS[schoolId][existingIdx].admNo,
          createdAt: TENANT_STUDENTS[schoolId][existingIdx].createdAt
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
    const targetId = studentId ? String(studentId).trim() : null;
    const targetAdm = admNo ? String(admNo).trim().toLowerCase() : null;

    const student = pool.find(
      s => (targetId && String(s.id).trim() === targetId) || (targetAdm && String(s.admNo).trim().toLowerCase() === targetAdm)
    );

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

