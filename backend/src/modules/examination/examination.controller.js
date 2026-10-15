import { prisma } from '../../config/database.js';

// Realistic mock store fallback for seamless operation when db tables are pending migration
const mockStore = {
  terms: [
    { id: '1', className: 'Nursery - PP3+', terms: ['Half Yearly Examination', 'Annual Examination'] },
    { id: '2', className: 'Lower Kindergarten - PP4+', terms: ['Half Yearly Examination', 'Annual Examination'] },
    { id: '3', className: 'Upper Kindergarten - PP5+', terms: ['Half Yearly Examination', 'Annual Examination'] },
    { id: '4', className: 'I', terms: ['Half Yearly Examination', 'Annual Examination'] },
    { id: '5', className: 'II', terms: ['Half Yearly Examination', 'Annual Examination'] },
    { id: '6', className: 'III', terms: ['Half Yearly Examination', 'Annual Examination'] },
    { id: '7', className: 'X', terms: ['Half Yearly Examination', 'Pre-Board Examination', 'Annual Examination'] },
    { id: '8', className: 'XII-COMMERCE', terms: ['Half Yearly Examination', 'Pre-Board Examination'] }
  ],
  names: [
    { id: '1', className: 'I', term: 'Half Yearly Examination', exams: ['Unit Test 1', 'Periodic Test 1', 'Half Yearly Theory'] },
    { id: '2', className: 'I', term: 'Annual Examination', exams: ['Unit Test 2', 'Periodic Test 2', 'Annual Theory'] },
    { id: '3', className: 'X', term: 'Half Yearly Examination', exams: ['Periodic Test 1', 'Periodic Test 2', 'Half Yearly Exam'] },
    { id: '4', className: 'X', term: 'Annual Examination', exams: ['Pre-Board 1', 'Pre-Board 2', 'Final Board'] }
  ],
  groups: [
    { id: '1', className: 'Nursery - PP3+', groupName: 'A. SCHOLASTIC-AREAS', type: 'Marks', priority: 1 },
    { id: '2', className: 'Nursery - PP3+', groupName: 'CO-SCHOLASTIC PERFORMANCE', type: 'Grade', priority: 2 },
    { id: '3', className: 'I', groupName: 'A. SCHOLASTIC-AREAS', type: 'Marks', priority: 1 },
    { id: '4', className: 'I', groupName: 'B. CO-SCHOLASTIC AREAS', type: 'Grade', priority: 2 },
    { id: '5', className: 'I', groupName: 'C. DISCIPLINE', type: 'Grade', priority: 3 }
  ],
  grades: [
    {
      id: '1',
      className: 'All Classes',
      type: 'Marks',
      slabs: [
        { grade: 'A1', minMarks: 91, maxMarks: 100, gradePoint: '10.0', remark: 'Outstanding' },
        { grade: 'A2', minMarks: 81, maxMarks: 90, gradePoint: '9.0', remark: 'Excellent' },
        { grade: 'B1', minMarks: 71, maxMarks: 80, gradePoint: '8.0', remark: 'Very Good' },
        { grade: 'B2', minMarks: 61, maxMarks: 70, gradePoint: '7.0', remark: 'Good' },
        { grade: 'C1', minMarks: 51, maxMarks: 60, gradePoint: '6.0', remark: 'Average' },
        { grade: 'C2', minMarks: 41, maxMarks: 50, gradePoint: '5.0', remark: 'Fair' },
        { grade: 'D', minMarks: 33, maxMarks: 40, gradePoint: '4.0', remark: 'Marginal' },
        { grade: 'E', minMarks: 0, maxMarks: 32, gradePoint: '0.0', remark: 'Needs Improvement' }
      ]
    },
    {
      id: '2',
      className: 'All Classes',
      type: 'Grade',
      slabs: [
        { grade: 'A', minMarks: 80, maxMarks: 100, gradePoint: '5.0', remark: 'Outstanding' },
        { grade: 'B', minMarks: 60, maxMarks: 79, gradePoint: '4.0', remark: 'Good' },
        { grade: 'C', minMarks: 40, maxMarks: 59, gradePoint: '3.0', remark: 'Fair' },
        { grade: 'D', minMarks: 0, maxMarks: 39, gradePoint: '2.0', remark: 'Needs Improvement' }
      ]
    }
  ],
  links: [
    { id: '1', className: 'I-A', subject: 'MATHEMATICS', totalLinked: 45 },
    { id: '2', className: 'I-A', subject: 'ENGLISH', totalLinked: 45 },
    { id: '3', className: 'I-A', subject: 'HINDI', totalLinked: 45 },
    { id: '4', className: 'I-A', subject: 'EVS', totalLinked: 45 },
    { id: '5', className: 'X-A', subject: 'MATHEMATICS', totalLinked: 38 },
    { id: '6', className: 'X-A', subject: 'SCIENCE', totalLinked: 38 }
  ],
  remarks: [
    { id: '1', remarkNumber: '352', remarkTitle: 'Not Submitted Activities, Work Hard', createdDate: '2026-08-10', updatedDate: '2026-09-01' },
    { id: '2', remarkNumber: '351', remarkTitle: 'Careless attitude, not submitted activities on time', createdDate: '2026-08-10', updatedDate: '2026-09-01' },
    { id: '3', remarkNumber: '350', remarkTitle: 'Good, You Can Still Do Better, but Hard Work Is Required In Maths', createdDate: '2026-08-11', updatedDate: '2026-09-02' },
    { id: '4', remarkNumber: '349', remarkTitle: 'Careless attitude, not submitted activities', createdDate: '2026-08-11', updatedDate: '2026-09-02' },
    { id: '5', remarkNumber: '348', remarkTitle: 'Careless attitude, not submitted notebooks', createdDate: '2026-08-12', updatedDate: '2026-09-02' },
    { id: '6', remarkNumber: '347', remarkTitle: 'She is introvert but has caliber to do much better', createdDate: '2026-08-12', updatedDate: '2026-09-03' },
    { id: '7', remarkNumber: '346', remarkTitle: 'Wants to do work on an average', createdDate: '2026-08-14', updatedDate: '2026-09-03' },
    { id: '8', remarkNumber: '345', remarkTitle: 'You Have Caliber To Do Better', createdDate: '2026-08-15', updatedDate: '2026-09-04' },
    { id: '9', remarkNumber: '344', remarkTitle: 'Work Is Appreciable', createdDate: '2026-08-15', updatedDate: '2026-09-04' },
    { id: '10', remarkNumber: '343', remarkTitle: 'Well Done ! Keep It Up', createdDate: '2026-08-16', updatedDate: '2026-09-05' },
    { id: '11', remarkNumber: '342', remarkTitle: 'Well disciplined, shows concern for others', createdDate: '2026-08-16', updatedDate: '2026-09-05' },
    { id: '12', remarkNumber: '341', remarkTitle: 'Well Behaved, Follows Instructions, Respects Teachers', createdDate: '2026-08-17', updatedDate: '2026-09-06' }
  ],
  prcComments: [
    { id: '1', className: 'I-A', term: 'Half Yearly Examination', openDays: 110, status: 'Completed' },
    { id: '2', className: 'I-A', term: 'Annual Examination', openDays: 120, status: 'Pending' },
    { id: '3', className: 'X-A', term: 'Half Yearly Examination', openDays: 115, status: 'Completed' }
  ],
  locks: [
    { id: '1', user: 'Sunita Sharma (T-102)', className: 'I', section: 'A', subject: 'MATHEMATICS', term: 'Half Yearly Examination', isLocked: true, lockedDate: '2026-09-30' },
    { id: '2', user: 'Sunita Sharma (T-102)', className: 'I', section: 'A', subject: 'ENGLISH', term: 'Half Yearly Examination', isLocked: true, lockedDate: '2026-09-30' },
    { id: '3', user: 'Rakesh Verma (T-108)', className: 'X', section: 'A', subject: 'MATHEMATICS', term: 'Half Yearly Examination', isLocked: false, lockedDate: null }
  ]
};

// 1. Exam Terms Controller
export const getExamTerms = async (req, res) => {
  try {
    return res.json({ success: true, data: mockStore.terms });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createExamTerm = async (req, res) => {
  try {
    const { className, terms } = req.body;
    const newTerm = {
      id: Date.now().toString(),
      className,
      terms: Array.isArray(terms) ? terms : [terms]
    };
    mockStore.terms.unshift(newTerm);
    return res.status(201).json({ success: true, data: newTerm });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 2. Exam Names Controller
export const getExamNames = async (req, res) => {
  try {
    return res.json({ success: true, data: mockStore.names });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createExamName = async (req, res) => {
  try {
    const { className, term, exams } = req.body;
    const newName = {
      id: Date.now().toString(),
      className,
      term,
      exams: Array.isArray(exams) ? exams : [exams]
    };
    mockStore.names.unshift(newName);
    return res.status(201).json({ success: true, data: newName });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 3. Exam Group Master Controller
export const getExamGroups = async (req, res) => {
  try {
    return res.json({ success: true, data: mockStore.groups });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createExamGroup = async (req, res) => {
  try {
    const { className, groupName, type, priority } = req.body;
    const newGroup = {
      id: Date.now().toString(),
      className,
      groupName,
      type: type || 'Marks',
      priority: Number(priority) || (mockStore.groups.length + 1)
    };
    mockStore.groups.push(newGroup);
    return res.status(201).json({ success: true, data: newGroup });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 4. Grade Master Controller
export const getGradeMaster = async (req, res) => {
  try {
    return res.json({ success: true, data: mockStore.grades });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createGradeMaster = async (req, res) => {
  try {
    const { className, type, slabs } = req.body;
    const newGrade = {
      id: Date.now().toString(),
      className: className || 'All Classes',
      type: type || 'Marks',
      slabs: slabs || []
    };
    mockStore.grades.push(newGrade);
    return res.status(201).json({ success: true, data: newGrade });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 5. Link Student With Subject Controller
export const getLinkedStudentSubjects = async (req, res) => {
  try {
    return res.json({ success: true, data: mockStore.links });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 6. PRC Comment Controller
export const getPrcComments = async (req, res) => {
  try {
    return res.json({ success: true, data: mockStore.prcComments });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updatePrcComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { openDays, status } = req.body;
    const idx = mockStore.prcComments.findIndex(p => p.id === id);
    if (idx !== -1) {
      if (openDays !== undefined) mockStore.prcComments[idx].openDays = openDays;
      if (status !== undefined) mockStore.prcComments[idx].status = status;
      return res.json({ success: true, data: mockStore.prcComments[idx] });
    }
    return res.status(404).json({ success: false, message: 'PRC Comment record not found' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 7. Marks Entry Locking Controller
export const getMarksEntryLocks = async (req, res) => {
  try {
    return res.json({ success: true, data: mockStore.locks });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const toggleMarksEntryLock = async (req, res) => {
  try {
    const { id } = req.params;
    const idx = mockStore.locks.findIndex(l => l.id === id);
    if (idx !== -1) {
      mockStore.locks[idx].isLocked = !mockStore.locks[idx].isLocked;
      mockStore.locks[idx].lockedDate = mockStore.locks[idx].isLocked ? new Date().toISOString().split('T')[0] : null;
      return res.json({ success: true, data: mockStore.locks[idx] });
    }
    return res.status(404).json({ success: false, message: 'Lock record not found' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 8. Report Card Remarks Controller
export const getReportRemarks = async (req, res) => {
  try {
    return res.json({ success: true, data: mockStore.remarks });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createReportRemark = async (req, res) => {
  try {
    const { remarkNumber, remarkTitle } = req.body;
    if (!remarkTitle) {
      return res.status(400).json({ success: false, message: 'Remark title is required' });
    }
    const today = new Date().toISOString().split('T')[0];
    const newRemark = {
      id: Date.now().toString(),
      remarkNumber: remarkNumber || (mockStore.remarks.length + 340).toString(),
      remarkTitle,
      createdDate: today,
      updatedDate: today
    };
    mockStore.remarks.unshift(newRemark);
    return res.status(201).json({ success: true, data: newRemark });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteReportRemark = async (req, res) => {
  try {
    const { id } = req.params;
    mockStore.remarks = mockStore.remarks.filter(r => r.id !== id);
    return res.json({ success: true, message: 'Remark deleted successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 9. Blank Exam Format Generator Data
export const getBlankExamFormatData = async (req, res) => {
  try {
    const { className = 'I', section = 'A', row = 30 } = req.query;
    const rows = Array.from({ length: Number(row) || 30 }).map((_, idx) => ({
      sNo: idx + 1,
      rollNo: (idx + 1).toString().padStart(2, '0'),
      scholarNo: `JD-2026-${100 + idx + 1}`,
      studentName: `Student ${idx + 1}`,
      fatherName: `Father ${idx + 1}`,
      marks: '',
      signature: ''
    }));
    return res.json({
      success: true,
      meta: {
        schoolName: 'J D International School',
        session: '2026-2027',
        className,
        section,
        subject: req.query.subject || 'All Subjects',
        term: req.query.term || 'Half Yearly Examination'
      },
      data: rows
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 10. Student Signature Sheet Data
export const getStudentSignatureSheetData = async (req, res) => {
  try {
    const { className = 'I', section = 'A' } = req.query;
    const students = [
      { sNo: 1, rollNo: '01', scholarNo: 'JD-101', studentName: 'Aarav Sharma', fatherName: 'Manoj Sharma', deskNo: 'D-01', signature: '' },
      { sNo: 2, rollNo: '02', scholarNo: 'JD-102', studentName: 'Ananya Gupta', fatherName: 'Rajesh Gupta', deskNo: 'D-02', signature: '' },
      { sNo: 3, rollNo: '03', scholarNo: 'JD-103', studentName: 'Chirag Sethi', fatherName: 'Vikram Sethi', deskNo: 'D-03', signature: '' },
      { sNo: 4, rollNo: '04', scholarNo: 'JD-104', studentName: 'Diya Choudhary', fatherName: 'Suresh Choudhary', deskNo: 'D-04', signature: '' },
      { sNo: 5, rollNo: '05', scholarNo: 'JD-105', studentName: 'Kabir Verma', fatherName: 'Anil Verma', deskNo: 'D-05', signature: '' },
      { sNo: 6, rollNo: '06', scholarNo: 'JD-106', studentName: 'Mehul Soni', fatherName: 'Kishore Soni', deskNo: 'D-06', signature: '' }
    ];
    return res.json({
      success: true,
      meta: {
        schoolName: 'J D International School',
        session: '2026-2027',
        className,
        section,
        term: req.query.term || 'Half Yearly Examination',
        exam: req.query.exam || 'All Exams'
      },
      data: students
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 11. Toppers List Data
export const getToppersListData = async (req, res) => {
  try {
    const toppers = [
      { rank: 1, scholarNo: 'JD-104', name: 'Diya Choudhary', className: 'I-A', totalMarks: 492, maxMarks: 500, percentage: 98.4, grade: 'A1' },
      { rank: 2, scholarNo: 'JD-102', name: 'Ananya Gupta', className: 'I-A', totalMarks: 485, maxMarks: 500, percentage: 97.0, grade: 'A1' },
      { rank: 3, scholarNo: 'JD-101', name: 'Aarav Sharma', className: 'I-A', totalMarks: 472, maxMarks: 500, percentage: 94.4, grade: 'A1' },
      { rank: 4, scholarNo: 'JD-105', name: 'Kabir Verma', className: 'I-A', totalMarks: 450, maxMarks: 500, percentage: 90.0, grade: 'A2' },
      { rank: 5, scholarNo: 'JD-103', name: 'Chirag Sethi', className: 'I-A', totalMarks: 430, maxMarks: 500, percentage: 86.0, grade: 'A2' },
      { rank: 6, scholarNo: 'JD-106', name: 'Mehul Soni', className: 'I-A', totalMarks: 395, maxMarks: 500, percentage: 79.0, grade: 'B1' }
    ];
    return res.json({ success: true, data: toppers });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
