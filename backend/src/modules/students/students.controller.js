import { uploadToImageKit } from '../../core/utils/imagekitService.js';
import prisma from '../../config/db.js';

// Multi-Tenant Partitioned Student Storage: schoolId -> Student[] (100% Fresh Clean Production State)
export const TENANT_STUDENTS = {
  'sch_jd_intl': [],
  'sch_dps_branch2': []
};

// Global counter for auto-generating unique enroll & fee numbers
let studentCounter = 1;

/**
 * Controller: Get all students with tenant isolation & filters
 */
export const getAllStudents = async (req, res) => {
  try {
    const schoolId = req.headers['x-school-id'] || req.schoolId || 'sch_jd_intl';
    if (!TENANT_STUDENTS[schoolId]) {
      TENANT_STUDENTS[schoolId] = [];
    }
    const tenantList = TENANT_STUDENTS[schoolId];
    return res.status(200).json({
      success: true,
      total: tenantList.length,
      data: tenantList
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Controller: Register a new student
 */
export const registerStudent = async (req, res) => {
  try {
    const schoolId = req.headers['x-school-id'] || req.schoolId || 'sch_jd_intl';
    if (!TENANT_STUDENTS[schoolId]) {
      TENANT_STUDENTS[schoolId] = [];
    }

    const {
      firstName,
      lastName,
      fatherName,
      motherName,
      fatherMobile,
      className,
      section,
      gender,
      dob,
      address
    } = req.body;

    const newStudent = {
      id: `std_${Date.now()}`,
      schoolId,
      rollNo: String(TENANT_STUDENTS[schoolId].length + 1),
      enrollNo: `ENR-${Date.now().toString().slice(-4)}`,
      admNo: String(Date.now().toString().slice(-4)),
      srNo: String(Date.now().toString().slice(-4)),
      firstName: firstName || '',
      lastName: lastName || '',
      fatherName: fatherName || '',
      motherName: motherName || '',
      fatherMobile: fatherMobile || '',
      className: className || 'I',
      section: section || 'A',
      gender: gender || 'Male',
      dob: dob || '',
      status: 'Studying',
      address: address || ''
    };

    TENANT_STUDENTS[schoolId].unshift(newStudent);

    return res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      data: newStudent
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
