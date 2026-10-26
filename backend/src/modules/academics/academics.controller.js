// Complete 1:1 In-Memory & Database-backed Store for Academics / Master Module

export let classesStore = [
  { id: '1', name: 'Nursery - PP3+', wing: 'Pre-Primary', stream: '', sections: ['A', 'B'], priority: 1, studentCount: 26, classTeacher: 'Mrs. Suman Meena', roomNo: 'KG-01' },
  { id: '2', name: 'Lower Kindergarten - PP4+', wing: 'Pre-Primary', stream: '', sections: ['A', 'B'], priority: 2, studentCount: 49, classTeacher: 'Mrs. Aarti Sen', roomNo: 'KG-02' },
  { id: '3', name: 'Upper Kindergarten - PP5+', wing: 'Pre-Primary', stream: '', sections: ['A', 'B'], priority: 3, studentCount: 71, classTeacher: 'Mrs. Rekha Sharma', roomNo: 'KG-03' },
  { id: '4', name: 'Class I', wing: 'Primary', stream: '', sections: ['A', 'B'], priority: 4, studentCount: 82, classTeacher: 'Mrs. Monika Rani', roomNo: '101' },
  { id: '5', name: 'Class II', wing: 'Primary', stream: '', sections: ['A', 'B'], priority: 5, studentCount: 72, classTeacher: 'Mrs. Sunita Kumari', roomNo: '102' },
  { id: '6', name: 'Class III', wing: 'Primary', stream: '', sections: ['A', 'B'], priority: 6, studentCount: 65, classTeacher: 'Mr. Rajesh Meena', roomNo: '103' },
  { id: '7', name: 'Class IV', wing: 'Primary', stream: '', sections: ['A', 'B'], priority: 7, studentCount: 78, classTeacher: 'Ms. Neha Gupta', roomNo: '104' },
  { id: '8', name: 'Class V', wing: 'Primary', stream: '', sections: ['A', 'B'], priority: 8, studentCount: 80, classTeacher: 'Mrs. Priya Kanwar', roomNo: '105' },
  { id: '9', name: 'Class VI', wing: 'Middle', stream: '', sections: ['A', 'B'], priority: 9, studentCount: 85, classTeacher: 'Mr. Amit Pareek', roomNo: '201' },
  { id: '10', name: 'Class VII', wing: 'Middle', stream: '', sections: ['A', 'B'], priority: 10, studentCount: 90, classTeacher: 'Mrs. Kavita Verma', roomNo: '202' },
  { id: '11', name: 'Class VIII', wing: 'Middle', stream: '', sections: ['A', 'B'], priority: 11, studentCount: 88, classTeacher: 'Mr. Vikram Rathore', roomNo: '203' },
  { id: '12', name: 'Class IX', wing: 'Secondary', stream: '', sections: ['A', 'B', 'C'], priority: 12, studentCount: 92, classTeacher: 'Dr. Arun Joshi', roomNo: '204' },
  { id: '13', name: 'Class X', wing: 'Secondary', stream: '', sections: ['A', 'B', 'C'], priority: 13, studentCount: 95, classTeacher: 'Mr. Rakesh Sharma', roomNo: '205' },
  { id: '14', name: 'Class XI - Humanities', wing: 'Senior Secondary', stream: 'HUMANITIES', sections: ['A'], priority: 14, studentCount: 35, classTeacher: 'Ms. Ananya Roy', roomNo: '301' },
  { id: '15', name: 'Class XII - Humanities', wing: 'Senior Secondary', stream: 'HUMANITIES', sections: ['A'], priority: 15, studentCount: 32, classTeacher: 'Mr. Manish Yadav', roomNo: '302' },
  { id: '16', name: 'Class XI - Science (Medical)', wing: 'Senior Secondary', stream: 'SCIENCE', sections: ['A'], priority: 16, studentCount: 28, classTeacher: 'Dr. Arun Joshi', roomNo: '303' },
  { id: '17', name: 'Class XII - Science (Medical)', wing: 'Senior Secondary', stream: 'SCIENCE', sections: ['A'], priority: 17, studentCount: 25, classTeacher: 'Mrs. Deepa Bhatt', roomNo: '304' },
  { id: '18', name: 'Class XI - Science (Non-Medical)', wing: 'Senior Secondary', stream: 'SCIENCE', sections: ['A'], priority: 18, studentCount: 30, classTeacher: 'Mr. Rakesh Sharma', roomNo: '305' },
  { id: '19', name: 'Class XII - Science (Non-Medical)', wing: 'Senior Secondary', stream: 'SCIENCE', sections: ['A'], priority: 19, studentCount: 28, classTeacher: 'Mr. Dinesh Choudhary', roomNo: '306' },
  { id: '20', name: 'Class XI - Commerce', wing: 'Senior Secondary', stream: 'COMMERCE', sections: ['A'], priority: 20, studentCount: 31, classTeacher: 'Ms. Pooja Saxena', roomNo: '307' },
  { id: '21', name: 'Class XII - Commerce', wing: 'Senior Secondary', stream: 'COMMERCE', sections: ['A'], priority: 21, studentCount: 29, classTeacher: 'Mr. Hemant Soni', roomNo: '308' }
];

export let subjectGroupsStore = [
  // 1. Scholastic (Core Academic Subjects - Graded by Marks & Grades)
  { id: '1', name: 'MATHEMATICS', category: 'Scholastic', evaluationType: 'Marks & Grade', description: 'Core math curriculum for standard grades' },
  { id: '2', name: 'SCIENCE', category: 'Scholastic', evaluationType: 'Marks & Grade', description: 'General Science, Physics, Chemistry, Biology' },
  { id: '3', name: 'ENGLISH', category: 'Scholastic', evaluationType: 'Marks & Grade', description: 'English Language, Literature & Grammar' },
  { id: '4', name: 'HINDI', category: 'Scholastic', evaluationType: 'Marks & Grade', description: 'Hindi Course A/B, Grammar & Reader' },
  { id: '5', name: 'SOCIAL SCIENCE', category: 'Scholastic', evaluationType: 'Marks & Grade', description: 'History, Civics, Geography & Economics' },
  { id: '6', name: 'EVS', category: 'Scholastic', evaluationType: 'Marks & Grade', description: 'Environmental Studies for Primary Wing' },
  { id: '7', name: 'THIRD LANGUAGE', category: 'Scholastic', evaluationType: 'Marks & Grade', description: 'Sanskrit, French, Regional Languages' },
  { id: '8', name: 'GENERAL KNOWLEDGE', category: 'Scholastic', evaluationType: 'Marks & Grade', description: 'GK & Current Affairs' },
  { id: '9', name: 'GENERAL AWARENESS', category: 'Scholastic', evaluationType: 'Marks & Grade', description: 'Primary awareness modules' },
  { id: '10', name: 'MORAL SCIENCE', category: 'Scholastic', evaluationType: 'Marks & Grade', description: 'Values & Ethics Education' },

  // 2. Senior Secondary Streams (Classes 11 & 12)
  { id: '11', name: 'COMMERCE', category: 'Senior Streams', evaluationType: 'Marks & Grade', description: 'Accountancy, Business Studies, Economics' },
  { id: '12', name: 'HUMANITIES', category: 'Senior Streams', evaluationType: 'Marks & Grade', description: 'History, Political Science, Geography, Sociology' },
  { id: '13', name: 'SCIENCE STREAM', category: 'Senior Streams', evaluationType: 'Marks & Grade', description: 'Physics, Chemistry, Biology, Comp. Sci.' },
  { id: '14', name: 'CLASS XI & XII', category: 'Senior Streams', evaluationType: 'Marks & Grade', description: 'General Studies, Work Experience, HPE' },

  // 3. Co-Scholastic & Vocational Skills
  { id: '15', name: 'ART EDUCATION', category: 'Co-Scholastic', evaluationType: 'CCE Grade (A-E)', description: 'Visual arts, Drawing, Painting & Crafts' },
  { id: '16', name: 'HEALTH & PHYSICAL EDUCATION', category: 'Co-Scholastic', evaluationType: 'CCE Grade (A-E)', description: 'Physical fitness, Yoga, Health habits' },
  { id: '17', name: 'WORK EDUCATION', category: 'Co-Scholastic', evaluationType: 'CCE Grade (A-E)', description: 'Socially useful productive work (SUPW)' },
  { id: '18', name: 'COMPUTER', category: 'Co-Scholastic', evaluationType: 'Marks & Grade', description: 'Computer Applications & Coding' },
  { id: '19', name: 'ICT', category: 'Co-Scholastic', evaluationType: 'Marks & Grade', description: 'Information & Communication Technology' },
  { id: '20', name: 'SPORTS', category: 'Co-Scholastic', evaluationType: 'CCE Grade (A-E)', description: 'Athletics, Outdoor Games & Sports Meet' },
  { id: '21', name: 'SKILL SUBJECTS', category: 'Co-Scholastic', evaluationType: 'Marks & Grade', description: 'IT, Abacus, Front Office Operations' },
  { id: '22', name: 'PHYSICAL EDUCATION', category: 'Co-Scholastic', evaluationType: 'CCE Grade (A-E)', description: 'Sports & Physical Drill' },

  // 4. Discipline & Personality Traits (Report Card CCE Grading)
  { id: '23', name: 'DISCIPLINE', category: 'Discipline & Habits', evaluationType: 'Rating (1-5 / A-E)', description: 'Classroom conduct, behavior & obedience' },
  { id: '24', name: 'REGULARITY & PUNCTUALITY', category: 'Discipline & Habits', evaluationType: 'Rating (1-5 / A-E)', description: 'Attendance, timely arrival & task completion' },
  { id: '25', name: 'NEATNESS', category: 'Discipline & Habits', evaluationType: 'Rating (1-5 / A-E)', description: 'Uniform, notebook upkeep & personal hygiene' },
  { id: '26', name: 'CONFIDENCE', category: 'Discipline & Habits', evaluationType: 'Rating (1-5 / A-E)', description: 'Public speaking, participation & initiative' },
  { id: '27', name: 'CREATIVITY SKILLS', category: 'Discipline & Habits', evaluationType: 'Rating (1-5 / A-E)', description: 'Original thinking & project presentations' }
];

export let subjectsStore = [
  { id: '1', name: 'ART EDUCATION', shortName: 'Art Education', group: 'ART EDUCATION', code: '' },
  { id: '2', name: 'GENERAL STUDIES', shortName: 'General Studies', group: 'CLASS XI & XII', code: '503' },
  { id: '3', name: 'HEALTH & PHY. EDUCATION', shortName: 'Health & Phy. Education', group: 'CLASS XI & XII', code: '' },
  { id: '4', name: 'WORK EXPERIENCE', shortName: 'Work Experience', group: 'CLASS XI & XII', code: '' },
  { id: '5', name: 'ACCOUNTANCY', shortName: 'Acct.', group: 'COMMERCE', code: '055' },
  { id: '6', name: 'BUSINESS STUDIES', shortName: 'B.St.', group: 'COMMERCE', code: '054' },
  { id: '7', name: 'ECONOMICS', shortName: 'Eco.', group: 'COMMERCE', code: '030' },
  { id: '8', name: 'COMPUTER', shortName: 'Computer', group: 'COMPUTER', code: '' },
  { id: '9', name: 'CONFIDENCE', shortName: 'Confidence', group: 'CONFIDENCE', code: '' },
  { id: '10', name: 'CREATIVITY SKILLS', shortName: 'Creativity Skills', group: 'CREATIVITY SKILLS', code: '' },
  { id: '11', name: 'DISCIPLINE', shortName: 'Discipline', group: 'DISCIPLINE', code: '' },
  { id: '12', name: 'ENGLISH', shortName: 'Eng.', group: 'ENGLISH', code: '' },
  { id: '13', name: 'ENGLISH CORE(301)', shortName: 'Eng. Core', group: 'ENGLISH', code: '301' },
  { id: '14', name: 'ENGLISH ELECTIVE(001)', shortName: 'Eng. Elec.', group: 'ENGLISH', code: '001' },
  { id: '15', name: 'ENGLISH GRAMMAR', shortName: 'Eng. Gram.', group: 'ENGLISH', code: '' },
  { id: '16', name: 'ENGLISH LANGUAGE & LITERATURE(184)', shortName: 'Eng. Lang & Lit', group: 'ENGLISH', code: '184' },
  { id: '17', name: 'ENGLISH READER', shortName: 'Eng. Read.', group: 'ENGLISH', code: '' },
  { id: '18', name: 'EVS', shortName: 'EVS', group: 'EVS', code: '' },
  { id: '19', name: 'GENERAL AWARENESS', shortName: 'Gen. Aware.', group: 'GENERAL AWARENESS', code: '' },
  { id: '20', name: 'GENERAL KNOWLEDGE', shortName: 'GK', group: 'GENERAL KNOWLEDGE', code: '' },
  { id: '21', name: 'HEALTH & PHYSICAL EDUCATION', shortName: 'HPE', group: 'HEALTH & PHYSICAL EDUCATION', code: '' },
  { id: '22', name: 'HINDI', shortName: 'Hin.', group: 'HINDI', code: '' },
  { id: '23', name: 'HINDI COURSE A', shortName: 'Hin. Course A', group: 'HINDI', code: '002' },
  { id: '24', name: 'HINDI GRAMMAR', shortName: 'Hin. Gram.', group: 'HINDI', code: '' },
  { id: '25', name: 'HINDI READER', shortName: 'Hin. Read.', group: 'HINDI', code: '' },
  { id: '26', name: 'GEOGRAPHY(029)', shortName: 'Geo.', group: 'HUMANITIES', code: '029' },
  { id: '27', name: 'HISTORY(027)', shortName: 'Hist.', group: 'HUMANITIES', code: '027' },
  { id: '28', name: 'POLITICAL SCIENCE(028)', shortName: 'Pol. Sci.', group: 'HUMANITIES', code: '028' },
  { id: '29', name: 'SOCIOLOGY(039)', shortName: 'Socio.', group: 'HUMANITIES', code: '039' },
  { id: '30', name: 'ICT', shortName: 'ICT', group: 'ICT', code: '' },
  { id: '31', name: 'MATHEMATICS', shortName: 'Maths', group: 'MATHEMATICS', code: '' },
  { id: '32', name: 'MATHEMATICS BASIC', shortName: 'Maths Basic', group: 'MATHEMATICS', code: '241' },
  { id: '33', name: 'MATHEMATICS STANDARD', shortName: 'Maths Std', group: 'MATHEMATICS', code: '041' },
  { id: '34', name: 'MORAL SCIENCE', shortName: 'Mor. Sci.', group: 'MORAL SCIENCE', code: '' },
  { id: '35', name: 'NEATNESS', shortName: 'Neatness', group: 'NEATNESS', code: '' },
  { id: '36', name: 'PHYSICAL EDUCATION (048)', shortName: 'Phy. Edu.', group: 'PHYSICAL EDUCATION', code: '048' },
  { id: '37', name: 'REGULARITY & PUNCTUALITY', shortName: 'Reg. & Punct.', group: 'REGULARITY & PUNCTUALITY', code: '' },
  { id: '38', name: 'SCIENCE', shortName: 'Science', group: 'SCIENCE', code: '086' },
  { id: '39', name: 'BIOLOGY(044)', shortName: 'Bio.', group: 'SCIENCE STREAM', code: '044' },
  { id: '40', name: 'CHEMISTRY(043)', shortName: 'Chem.', group: 'SCIENCE STREAM', code: '043' },
  { id: '41', name: 'PHYSICS(042)', shortName: 'Phys.', group: 'SCIENCE STREAM', code: '042' },
  { id: '42', name: 'ABACUS', shortName: 'Abacus', group: 'SKILL SUBJECTS', code: '' },
  { id: '43', name: 'FRONT OFFICE OPERATIONS', shortName: 'FOO', group: 'SKILL SUBJECTS', code: '410' },
  { id: '44', name: 'Information Technology', shortName: 'IT', group: 'SKILL SUBJECTS', code: '402' },
  { id: '45', name: 'SOCIAL SCIENCE', shortName: 'S.St.', group: 'SOCIAL SCIENCE', code: '087' },
  { id: '46', name: 'SPORTS', shortName: 'Sports', group: 'SPORTS', code: '' },
  { id: '47', name: 'SANSKRIT', shortName: 'Skt.', group: 'THIRD LANGUAGE', code: '122' },
  { id: '48', name: 'WORK EDUCATION', shortName: 'Work Edu.', group: 'WORK EDUCATION', code: '' }
];

export let streamsStore = [
  { id: '1', stream: 'SCIENCE' },
  { id: '2', stream: 'COMMERCE' },
  { id: '3', stream: 'HUMANITIES' }
];

export let subjectLinksStore = classesStore.map((c) => ({
  className: c.name,
  linkedSubjectsCount: 10,
  linkedSubjectNames: ['HINDI', 'ENGLISH', 'MATHEMATICS', 'SCIENCE', 'SOCIAL SCIENCE', 'EVS', 'GENERAL KNOWLEDGE', 'MORAL SCIENCE', 'COMPUTER', 'ART EDUCATION']
}));

// ==========================================
// 1. CLASS CONTROLLER (Multi-Tenant Partitioned)
// ==========================================
const TENANT_CLASSES = {
  'sch_jd_intl': classesStore,
  'sch_dps_branch2': [
    { id: 'dps_c1', name: 'Nursery', sections: ['A'], priority: 1, studentCount: 20 },
    { id: 'dps_c2', name: 'Kindergarten', sections: ['A'], priority: 2, studentCount: 25 },
    { id: 'dps_c3', name: 'Class 1', sections: ['A', 'B'], priority: 3, studentCount: 40 },
    { id: 'dps_c4', name: 'Class 9', sections: ['A', 'B'], priority: 4, studentCount: 38 },
    { id: 'dps_c5', name: 'Class 10', sections: ['A'], priority: 5, studentCount: 35 }
  ]
};

export const getAllClasses = async (req, res, next) => {
  try {
    const schoolId = req.schoolId || req.user?.schoolId || req.headers['x-school-id'] || 'sch_jd_intl';
    if (!TENANT_CLASSES[schoolId]) {
      TENANT_CLASSES[schoolId] = [
        { id: '1', name: 'Class 1', sections: ['A'], priority: 1, studentCount: 0 }
      ];
    }
    return res.status(200).json({ success: true, schoolId, data: TENANT_CLASSES[schoolId] });
  } catch (error) {
    next(error);
  }
};

export const createClass = async (req, res, next) => {
  try {
    const schoolId = req.schoolId || req.user?.schoolId || req.headers['x-school-id'] || 'sch_jd_intl';
    const { name, sections, priority, studentCount, wing, stream, classTeacher, roomNo, sectionDetails } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Class name required' });
    
    if (!TENANT_CLASSES[schoolId]) {
      TENANT_CLASSES[schoolId] = [];
    }

    const newClass = {
      id: String(Date.now()),
      schoolId,
      name,
      wing: wing || '',
      stream: stream || '',
      sections: Array.isArray(sections) ? sections : (sections ? sections.split(',').map(s => s.trim()) : ['A']),
      priority: Number(priority) || TENANT_CLASSES[schoolId].length + 1,
      studentCount: Number(studentCount) || 0,
      classTeacher: classTeacher || '',
      roomNo: roomNo || '',
      sectionDetails: sectionDetails || []
    };
    TENANT_CLASSES[schoolId].push(newClass);
    return res.status(201).json({ success: true, message: 'Class created', data: newClass });
  } catch (error) {
    next(error);
  }
};

export const updateClass = async (req, res, next) => {
  try {
    const schoolId = req.schoolId || req.user?.schoolId || req.headers['x-school-id'] || 'sch_jd_intl';
    const { id } = req.params;
    const { name, sections, priority, studentCount, wing, stream, classTeacher, roomNo, sectionDetails } = req.body;
    
    if (TENANT_CLASSES[schoolId]) {
      const cls = TENANT_CLASSES[schoolId].find(c => c.id === id);
      if (cls) {
        if (name !== undefined) cls.name = name;
        if (sections !== undefined) cls.sections = Array.isArray(sections) ? sections : sections.split(',').map(s => s.trim());
        if (priority !== undefined) cls.priority = Number(priority);
        if (studentCount !== undefined) cls.studentCount = Number(studentCount);
        if (wing !== undefined) cls.wing = wing;
        if (stream !== undefined) cls.stream = stream;
        if (classTeacher !== undefined) cls.classTeacher = classTeacher;
        if (roomNo !== undefined) cls.roomNo = roomNo;
        if (sectionDetails !== undefined) cls.sectionDetails = sectionDetails;
        return res.status(200).json({ success: true, message: 'Class updated successfully', data: cls });
      }
    }
    return res.status(404).json({ success: false, message: 'Class not found' });
  } catch (error) {
    next(error);
  }
};

export const deleteClass = async (req, res, next) => {
  try {
    const schoolId = req.schoolId || req.user?.schoolId || req.headers['x-school-id'] || 'sch_jd_intl';
    const { id } = req.params;
    if (TENANT_CLASSES[schoolId]) {
      TENANT_CLASSES[schoolId] = TENANT_CLASSES[schoolId].filter(c => c.id !== id);
    }
    return res.status(200).json({ success: true, message: 'Class deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 2. SUBJECT GROUP CONTROLLER
// ==========================================
export const getAllSubjectGroups = async (req, res, next) => {
  try {
    return res.status(200).json({ success: true, data: subjectGroupsStore });
  } catch (error) {
    next(error);
  }
};

export const createSubjectGroup = async (req, res, next) => {
  try {
    const { name, category, evaluationType, description } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Group name required' });
    const newGroup = {
      id: String(Date.now()),
      name: name.toUpperCase().trim(),
      category: category || 'Scholastic',
      evaluationType: evaluationType || 'Marks & Grade',
      description: description || ''
    };
    subjectGroupsStore.push(newGroup);
    return res.status(201).json({ success: true, message: 'Subject Group created', data: newGroup });
  } catch (error) {
    next(error);
  }
};

export const updateSubjectGroup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, category, evaluationType, description } = req.body;
    const group = subjectGroupsStore.find(g => g.id === id);
    if (!group) return res.status(404).json({ success: false, message: 'Subject group not found' });

    if (name) group.name = name.toUpperCase().trim();
    if (category) group.category = category;
    if (evaluationType) group.evaluationType = evaluationType;
    if (description !== undefined) group.description = description;

    return res.status(200).json({ success: true, message: 'Subject group updated', data: group });
  } catch (error) {
    next(error);
  }
};

export const deleteSubjectGroup = async (req, res, next) => {
  try {
    const { id } = req.params;
    subjectGroupsStore = subjectGroupsStore.filter(g => g.id !== id);
    return res.status(200).json({ success: true, message: 'Subject group deleted' });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 3. SUBJECT MASTER CONTROLLER
// ==========================================
export const getAllSubjects = async (req, res, next) => {
  try {
    return res.status(200).json({ success: true, data: subjectsStore });
  } catch (error) {
    next(error);
  }
};

export const createSubject = async (req, res, next) => {
  try {
    const { name, shortName, group, code } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Subject name required' });
    const newSubject = {
      id: String(Date.now()),
      name: name.toUpperCase(),
      shortName: shortName || name,
      group: group || 'GENERAL',
      code: code || ''
    };
    subjectsStore.push(newSubject);
    return res.status(201).json({ success: true, message: 'Subject created', data: newSubject });
  } catch (error) {
    next(error);
  }
};

export const deleteSubject = async (req, res, next) => {
  try {
    const { id } = req.params;
    subjectsStore = subjectsStore.filter(s => s.id !== id);
    return res.status(200).json({ success: true, message: 'Subject deleted' });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 4. STREAM MASTER CONTROLLER
// ==========================================
export const getAllStreams = async (req, res, next) => {
  try {
    return res.status(200).json({ success: true, data: streamsStore });
  } catch (error) {
    next(error);
  }
};

export const createStream = async (req, res, next) => {
  try {
    const { stream } = req.body;
    if (!stream) return res.status(400).json({ success: false, message: 'Stream name required' });
    const newStream = { id: String(Date.now()), stream: stream.toUpperCase() };
    streamsStore.push(newStream);
    return res.status(201).json({ success: true, message: 'Stream created', data: newStream });
  } catch (error) {
    next(error);
  }
};

export const deleteStream = async (req, res, next) => {
  try {
    const { id } = req.params;
    streamsStore = streamsStore.filter(s => s.id !== id);
    return res.status(200).json({ success: true, message: 'Stream deleted' });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 5. SUBJECT LINK CONTROLLER
// ==========================================
export const getAllSubjectLinks = async (req, res, next) => {
  try {
    return res.status(200).json({ success: true, data: subjectLinksStore });
  } catch (error) {
    next(error);
  }
};

export const updateSubjectLink = async (req, res, next) => {
  try {
    const { className, linkedSubjects } = req.body;
    const index = subjectLinksStore.findIndex(s => s.className === className);
    if (index >= 0) {
      subjectLinksStore[index].linkedSubjectsCount = linkedSubjects.length;
      subjectLinksStore[index].linkedSubjectNames = linkedSubjects;
    } else {
      subjectLinksStore.push({
        className,
        linkedSubjectsCount: linkedSubjects.length,
        linkedSubjectNames: linkedSubjects
      });
    }
    return res.status(200).json({ success: true, message: 'Subject links updated' });
  } catch (error) {
    next(error);
  }
};
