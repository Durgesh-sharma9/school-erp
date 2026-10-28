// Clean dynamic student data provider for all Student Reports
// Replaced hardcoded dummy data with dynamic tenant store connection and fresh clean state
import { tenantStore } from '../../../services/tenantStore';

export const SCHOOL_CLASSES = [
  'Nursery - PP3+',
  'Lower Kindergarten - PP4+',
  'Upper Kindergarten - PP5+',
  'I',
  'II',
  'III',
  'IV',
  'V',
  'VI',
  'VII',
  'VIII',
  'IX',
  'X',
  'XI- HUMANITIES',
  'XII-HUMANITIES',
  'XI-MEDICAL',
  'XII-MEDICAL',
  'XI-NON-MEDICAL',
  'XII-NON-MEDICAL',
  'XI-COMMERCE'
];

// Helper to retrieve live registered students for current active tenant
export const getActiveSchoolStudents = () => {
  try {
    const authUser = JSON.parse(localStorage.getItem('erp_auth_user') || '{}');
    const schoolId = authUser.schoolId || 'sch_jd_intl';
    const students = tenantStore.getStudents(schoolId) || [];
    return students.map((s, idx) => ({
      sNo: idx + 1,
      enrollNo: s.enrollNo || `ENR-${s.admNo || idx + 1}`,
      admNo: s.admNo || `ADM-${idx + 1}`,
      srNo: s.srNo || String(idx + 1),
      rollNo: s.rollNo || String(idx + 1),
      feebookNo: s.feebookNo || `FB-${s.admNo || idx + 1}`,
      name: (s.name || `${s.firstName || ''} ${s.lastName || ''}`).trim() || 'Student',
      gender: s.gender || 'Male',
      className: s.className || s.class_id || 'I',
      section: s.section || s.division_id || 'A',
      fatherName: s.fatherName || s.fathers_name || '-',
      motherName: s.motherName || s.mothers_name || '-',
      contactNo: s.contactNo || s.fatherMobile || '-',
      category: s.category || 'General',
      isRte: Boolean(s.isRte),
      isNew: Boolean(s.studentType === 'New' || s.isNew),
      status: s.status || 'Active',
      donationAmount: 0,
      donationPaid: 0,
      donationDue: 0,
      siblingGroup: 'None',
      subjects: ['English', 'Hindi', 'Mathematics', 'EVS', 'Computer'],
      absentDays: 0,
      presentDays: 0,
      callStatus: 'Not Called',
      callRemark: ''
    }));
  } catch {
    return [];
  }
};

// Fresh production start: Empty arrays (0 seeded/mock records)
export const MOCK_STUDENTS = [];
export const MOCK_PROMOTION_LIST = [];
export const MOCK_TC_RECORDS = [];
export const MOCK_DAY_ATTENDANCE_SUMMARY = [];
export const MOCK_DATE_SHEET_ROWS = [];
export const MOCK_INACTIVE_STUDENTS = [];
