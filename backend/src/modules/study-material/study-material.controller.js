// Study Material & Homework Controller - Unified School ERP
// 1:1 Parity with UAB Infosol Study Material workflows

let studyMaterials = [
  {
    id: 1,
    sNo: 1,
    date: '2026-10-10',
    className: 'X',
    division: 'A',
    subject: 'Mathematics Standard',
    days: '7',
    type: 'Study Material',
    title: 'Chapter 4 Quadratic Equations Formulas and Notes',
    description: 'Detailed NCERT chapter notes with solved exemplar questions.',
    fileName: 'Quadratic_Equations_Notes_Ch4.pdf',
    fileType: 'pdf'
  },
  {
    id: 2,
    sNo: 2,
    date: '2026-10-09',
    className: 'XII-NON-MEDICAL',
    division: 'A',
    subject: 'Physics',
    days: '10',
    type: 'Assignment',
    title: 'Electromagnetic Induction Practice Problems',
    description: 'Practice questions for unit test with previous year questions.',
    fileName: 'EMI_Practice_Worksheet_XII.pdf',
    fileType: 'pdf'
  }
];

let homeworkList = [
  {
    id: 1,
    sNo: 1,
    date: '2026-10-10',
    className: 'X - A',
    subject: 'Science',
    title: 'Chemical Reactions and Equations Exercise Questions 1 to 10',
    description: 'Solve textbook exercise questions 1 to 10 in fair notebook.',
    createdBy: 'Sunil Verma (Science Teacher)',
    fileName: 'Science_HW_Ch1.jpg'
  },
  {
    id: 2,
    sNo: 2,
    date: '2026-10-09',
    className: 'I - A',
    subject: 'English',
    title: 'Cursive Writing Book Pages 14-16',
    description: 'Complete cursive handwriting practice pages 14, 15 and 16.',
    createdBy: 'Pooja Sharma (Class Teacher)',
    fileName: null
  }
];

let previousYearPapers = [
  {
    id: 1,
    sNo: 1,
    title: 'Class X Board Annual Exam 2025 Paper',
    paperName: 'Mathematics Standard Annual Exam',
    className: 'X',
    year: '2024-2025',
    fileName: 'CBSE_Class_X_Maths_2025.pdf'
  },
  {
    id: 2,
    sNo: 2,
    title: 'Class XII Physics Pre-Board 2025 Paper',
    paperName: 'Physics Pre-Board Examination',
    className: 'XII-NON-MEDICAL',
    year: '2024-2025',
    fileName: 'Physics_PreBoard_XII_2025.pdf'
  }
];

// Study Material Endpoints
export const getStudyMaterials = async (req, res) => {
  try {
    res.status(200).json({ success: true, data: studyMaterials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createStudyMaterial = async (req, res) => {
  try {
    const newEntry = {
      id: Date.now(),
      sNo: studyMaterials.length + 1,
      date: req.body.date || new Date().toISOString().split('T')[0],
      ...req.body
    };
    studyMaterials.unshift(newEntry);
    res.status(201).json({ success: true, message: 'Study material added successfully', data: newEntry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Homework Endpoints
export const getHomeworkList = async (req, res) => {
  try {
    res.status(200).json({ success: true, data: homeworkList });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createHomework = async (req, res) => {
  try {
    const newEntry = {
      id: Date.now(),
      sNo: homeworkList.length + 1,
      date: req.body.date || new Date().toISOString().split('T')[0],
      createdBy: req.body.createdBy || 'Staff Teacher',
      ...req.body
    };
    homeworkList.unshift(newEntry);
    res.status(201).json({ success: true, message: 'Homework added successfully', data: newEntry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Previous Year Papers Endpoints
export const getPreviousYearPapers = async (req, res) => {
  try {
    res.status(200).json({ success: true, data: previousYearPapers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createPreviousYearPaper = async (req, res) => {
  try {
    const newEntry = {
      id: Date.now(),
      sNo: previousYearPapers.length + 1,
      ...req.body
    };
    previousYearPapers.unshift(newEntry);
    res.status(201).json({ success: true, message: 'Previous year paper added successfully', data: newEntry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
