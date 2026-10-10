// Complete 1:1 In-Memory & Database-backed Store for Academics / Master Module

let classesStore = [
  { id: '1', name: 'Nursery - PP3+', sections: ['A'], priority: 1, studentCount: 26 },
  { id: '2', name: 'Lower Kindergarten - PP4+', sections: ['A'], priority: 2, studentCount: 49 },
  { id: '3', name: 'Upper Kindergarten - PP5+', sections: ['A'], priority: 3, studentCount: 71 },
  { id: '4', name: 'I', sections: ['A'], priority: 4, studentCount: 82 },
  { id: '5', name: 'II', sections: ['A'], priority: 5, studentCount: 72 },
  { id: '6', name: 'III', sections: ['A'], priority: 6, studentCount: 65 },
  { id: '7', name: 'IV', sections: ['A'], priority: 7, studentCount: 78 },
  { id: '8', name: 'V', sections: ['A'], priority: 8, studentCount: 80 },
  { id: '9', name: 'VI', sections: ['A'], priority: 9, studentCount: 85 },
  { id: '10', name: 'VII', sections: ['A'], priority: 10, studentCount: 90 },
  { id: '11', name: 'VIII', sections: ['A'], priority: 11, studentCount: 88 },
  { id: '12', name: 'IX', sections: ['A'], priority: 12, studentCount: 92 },
  { id: '13', name: 'X', sections: ['A'], priority: 13, studentCount: 95 },
  { id: '14', name: 'XI- HUMANITIES', sections: ['A'], priority: 14, studentCount: 35 },
  { id: '15', name: 'XII-HUMANITIES', sections: ['A'], priority: 15, studentCount: 32 },
  { id: '16', name: 'XI-MEDICAL', sections: ['A'], priority: 16, studentCount: 28 },
  { id: '17', name: 'XII-MEDICAL', sections: ['A'], priority: 17, studentCount: 25 },
  { id: '18', name: 'XI-NON-MEDICAL', sections: ['A'], priority: 18, studentCount: 30 },
  { id: '19', name: 'XII-NON-MEDICAL', sections: ['A'], priority: 19, studentCount: 28 },
  { id: '20', name: 'XII- COMMERCE', sections: ['A'], priority: 20, studentCount: 29 }
];

let subjectGroupsStore = [
  { id: '1', name: 'ART EDUCATION' },
  { id: '2', name: 'CLASS XI & XII' },
  { id: '3', name: 'COMMERCE' },
  { id: '4', name: 'COMPUTER' },
  { id: '5', name: 'CONFIDENCE' },
  { id: '6', name: 'CREATIVITY SKILLS' },
  { id: '7', name: 'DISCIPLINE' },
  { id: '8', name: 'ENGLISH' },
  { id: '9', name: 'EVS' },
  { id: '10', name: 'GENERAL AWARENESS' },
  { id: '11', name: 'GENERAL KNOWLEDGE' },
  { id: '12', name: 'HEALTH & PHYSICAL EDUCATION' },
  { id: '13', name: 'HINDI' },
  { id: '14', name: 'HUMANITIES' },
  { id: '15', name: 'ICT' },
  { id: '16', name: 'MATHEMATICS' },
  { id: '17', name: 'MORAL SCIENCE' },
  { id: '18', name: 'NEATNESS' },
  { id: '19', name: 'PHYSICAL EDUCATION' },
  { id: '20', name: 'REGULARITY & PUNCTUALITY' },
  { id: '21', name: 'SCIENCE' },
  { id: '22', name: 'SCIENCE STREAM' },
  { id: '23', name: 'SKILL SUBJECTS' },
  { id: '24', name: 'SOCIAL SCIENCE' },
  { id: '25', name: 'SPORTS' },
  { id: '26', name: 'THIRD LANGUAGE' },
  { id: '27', name: 'WORK EDUCATION' }
];

let subjectsStore = [
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

let streamsStore = [
  { id: '1', stream: 'SCIENCE' },
  { id: '2', stream: 'COMMERCE' },
  { id: '3', stream: 'HUMANITIES' }
];

let subjectLinksStore = classesStore.map((c) => ({
  className: c.name,
  linkedSubjectsCount: 10,
  linkedSubjectNames: ['HINDI', 'ENGLISH', 'MATHEMATICS', 'SCIENCE', 'SOCIAL SCIENCE', 'EVS', 'GENERAL KNOWLEDGE', 'MORAL SCIENCE', 'COMPUTER', 'ART EDUCATION']
}));

// ==========================================
// 1. CLASS CONTROLLER
// ==========================================
export const getAllClasses = async (req, res, next) => {
  try {
    return res.status(200).json({ success: true, data: classesStore });
  } catch (error) {
    next(error);
  }
};

export const createClass = async (req, res, next) => {
  try {
    const { name, sections, priority } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Class name required' });
    const newClass = {
      id: String(Date.now()),
      name,
      sections: Array.isArray(sections) ? sections : (sections ? sections.split(',').map(s => s.trim()) : ['A']),
      priority: Number(priority) || classesStore.length + 1,
      studentCount: 0
    };
    classesStore.push(newClass);
    return res.status(201).json({ success: true, message: 'Class created', data: newClass });
  } catch (error) {
    next(error);
  }
};

export const deleteClass = async (req, res, next) => {
  try {
    const { id } = req.params;
    classesStore = classesStore.filter(c => c.id !== id);
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
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Group name required' });
    const newGroup = { id: String(Date.now()), name: name.toUpperCase() };
    subjectGroupsStore.push(newGroup);
    return res.status(201).json({ success: true, message: 'Subject Group created', data: newGroup });
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
