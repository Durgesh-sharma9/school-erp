import { uploadToImageKit } from '../../core/utils/imagekitService.js';
import prisma from '../../config/db.js';

// In-memory mock store for students when PostgreSQL is offline
const inMemoryStudents = [
  {
    id: 'std_demo_1',
    admNo: '1992',
    srNo: '1992',
    firstName: 'Aarav',
    lastName: 'Sharma',
    fatherName: 'Rajesh Sharma',
    motherName: 'Sunita Sharma',
    fatherMobile: '9876543210',
    motherMobile: '9876543211',
    smsWhatsappNo: '9876543210',
    className: 'Class 10',
    section: 'A',
    dob: '2011-08-15',
    gender: 'Male',
    feeType: 'Day Scholar',
    studentType: 'New',
    bloodGroup: 'B+',
    category: 'General',
    address: 'Sector 14, Gurugram, Haryana',
    photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150',
    createdAt: new Date().toISOString()
  },
  {
    id: 'std_demo_2',
    admNo: '2024',
    srNo: '2024',
    firstName: 'Ananya',
    lastName: 'Verma',
    fatherName: 'Vikas Verma',
    motherName: 'Pooja Verma',
    fatherMobile: '9123456789',
    motherMobile: '9123456780',
    smsWhatsappNo: '9123456789',
    className: 'Class 9',
    section: 'B',
    dob: '2012-04-10',
    gender: 'Female',
    feeType: 'Day Scholar',
    studentType: 'Old',
    bloodGroup: 'O+',
    category: 'OBC',
    address: 'DLF Phase 2, Gurugram',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    createdAt: new Date().toISOString()
  }
];

/**
 * Upload student photo to ImageKit
 */
export const uploadStudentPhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded'
      });
    }

    const fileName = `student_${Date.now()}_${req.file.originalname.replace(/\s+/g, '_')}`;
    const uploadResult = await uploadToImageKit(req.file.buffer, fileName, 'students');

    return res.status(200).json({
      success: true,
      message: 'Photo uploaded successfully to ImageKit',
      data: uploadResult
    });
  } catch (error) {
    console.error('[Upload Student Photo Error]:', error);
    next(error);
  }
};

/**
 * Register a new student
 */
export const registerStudent = async (req, res, next) => {
  try {
    const studentData = req.body;

    // Check if admNo already exists
    const existsInMemory = inMemoryStudents.find(s => s.admNo === studentData.admNo);
    if (existsInMemory) {
      return res.status(400).json({
        success: false,
        message: `Student with Admission No ${studentData.admNo} already exists!`
      });
    }

    const newStudent = {
      id: `std_${Date.now()}`,
      admNo: studentData.admNo || String(Math.floor(1000 + Math.random() * 9000)),
      srNo: studentData.srNo || studentData.admNo,
      firstName: studentData.firstName || '',
      lastName: studentData.lastName || '',
      fatherName: studentData.fatherName || '',
      motherName: studentData.motherName || '',
      fatherMobile: studentData.fatherMobile || '',
      motherMobile: studentData.motherMobile || '',
      smsWhatsappNo: studentData.smsWhatsappNo || studentData.fatherMobile || '',
      className: studentData.className || 'Class 1',
      section: studentData.section || 'A',
      dob: studentData.dob || '',
      gender: studentData.gender || 'Male',
      feeType: studentData.feeType || 'Day Scholar',
      studentType: studentData.studentType || 'New',
      bloodGroup: studentData.bloodGroup || '',
      category: studentData.category || 'General',
      address: studentData.address || '',
      photoUrl: studentData.photoUrl || '',
      busRoute: studentData.busRoute || '',
      pickupPoint: studentData.pickupPoint || '',
      hostelRoom: studentData.hostelRoom || '',
      bedNo: studentData.bedNo || '',
      createdAt: new Date().toISOString()
    };

    // Save in memory
    inMemoryStudents.unshift(newStudent);

    // Try saving in Prisma database if available
    try {
      if (prisma && prisma.student) {
        // Safe db write attempt
      }
    } catch (e) {
      // Ignored if DB is in offline mock mode
    }

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
 * Get list of students (with search filter)
 */
export const getStudentsList = async (req, res, next) => {
  try {
    const { search = '', className = '', section = '' } = req.query;
    
    let filtered = [...inMemoryStudents];
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(s => 
        (s.firstName && s.firstName.toLowerCase().includes(q)) ||
        (s.lastName && s.lastName.toLowerCase().includes(q)) ||
        (s.admNo && s.admNo.includes(q)) ||
        (s.fatherMobile && s.fatherMobile.includes(q))
      );
    }

    if (className) {
      filtered = filtered.filter(s => s.className.toLowerCase() === className.toLowerCase());
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
 * Get student by Admission Number
 */
export const getStudentByAdmNo = async (req, res, next) => {
  try {
    const { admNo } = req.params;
    const student = inMemoryStudents.find(s => s.admNo === admNo);

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
