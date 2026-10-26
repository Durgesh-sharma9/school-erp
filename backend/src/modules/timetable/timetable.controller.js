import { ApiResponse } from '../../core/utils/apiResponse.js';
import { asyncHandler } from '../../core/utils/asyncHandler.js';
import prisma from '../../config/db.js';
import { classesStore, subjectsStore } from '../academics/academics.controller.js';
import { usersList } from '../user-management/user-management.controller.js';

// =================================================================
// Pre-seeded Master Data (Default Slots, Teachers, Classes, Subjects)
// =================================================================

export const PERIOD_SLOTS = [
  { id: 'p_1', periodNumber: 1, startTime: '08:00', endTime: '08:45', time: '08:00 AM - 08:45 AM', label: 'Period 1', isBreak: false },
  { id: 'p_2', periodNumber: 2, startTime: '08:45', endTime: '09:30', time: '08:45 AM - 09:30 AM', label: 'Period 2', isBreak: false },
  { id: 'p_3', periodNumber: 3, startTime: '09:30', endTime: '10:15', time: '09:30 AM - 10:15 AM', label: 'Period 3', isBreak: false },
  { id: 'p_4', periodNumber: 4, startTime: '10:15', endTime: '11:00', time: '10:15 AM - 11:00 AM', label: 'Period 4', isBreak: false },
  { id: 'p_break', periodNumber: 0, startTime: '11:00', endTime: '11:30', time: '11:00 AM - 11:30 AM', label: 'Recess / Lunch', isBreak: true },
  { id: 'p_5', periodNumber: 5, startTime: '11:30', endTime: '12:15', time: '11:30 AM - 12:15 PM', label: 'Period 5', isBreak: false },
  { id: 'p_6', periodNumber: 6, startTime: '12:15', endTime: '13:00', time: '12:15 PM - 01:00 PM', label: 'Period 6', isBreak: false },
  { id: 'p_7', periodNumber: 7, startTime: '13:00', endTime: '13:45', time: '01:00 PM - 01:45 PM', label: 'Period 7', isBreak: false },
  { id: 'p_8', periodNumber: 8, startTime: '13:45', endTime: '14:30', time: '01:45 PM - 02:30 PM', label: 'Period 8', isBreak: false }
];

export const ROOMS_LIST = []; // Room removed from timetable system

export const getSyncedClasses = () => {
  const list = [];
  (classesStore || []).forEach((cls) => {
    (cls.sections || ['A']).forEach((sec) => {
      list.push({
        id: `cls_${cls.id}_${sec.toLowerCase()}`,
        masterClassId: cls.id,
        name: `${cls.name} - ${sec}`,
        shortName: `${cls.name} (${sec})`,
        grade: cls.name,
        section: sec,
        wing: cls.wing || '',
        stream: cls.stream || '',
        classTeacher: cls.classTeacher || '',
        studentCount: cls.studentCount || 0
      });
    });
  });

  // Legacy aliases for backward compatibility with existing slots
  const legacyAliases = [
    { id: 'c_10a', name: 'Class X - A', grade: 'Class X', section: 'A' },
    { id: 'c_10b', name: 'Class X - B', grade: 'Class X', section: 'B' },
    { id: 'c_9a', name: 'Class IX - A', grade: 'Class IX', section: 'A' },
    { id: 'c_9b', name: 'Class IX - B', grade: 'Class IX', section: 'B' },
    { id: 'c_8a', name: 'Class VIII - A', grade: 'Class VIII', section: 'A' },
    { id: 'c_8b', name: 'Class VIII - B', grade: 'Class VIII', section: 'B' },
    { id: 'c_7a', name: 'Class VII - A', grade: 'Class VII', section: 'A' }
  ];
  legacyAliases.forEach(a => {
    if (!list.some(c => c.id === a.id)) {
      list.push(a);
    }
  });

  return list;
};

export const getSyncedSubjects = () => {
  const palette = [
    '#4f46e5', '#0284c7', '#0d9488', '#16a34a', '#7c3aed',
    '#ea580c', '#d97706', '#2563eb', '#059669', '#db2777',
    '#6366f1', '#0891b2', '#059669', '#d97706', '#9333ea'
  ];

  const list = (subjectsStore || []).map((s, idx) => ({
    id: s.id,
    name: s.name,
    code: s.code || s.shortName || s.name.substring(0, 4).toUpperCase(),
    shortName: s.shortName || s.name,
    group: s.group || '',
    color: palette[idx % palette.length]
  }));

  const legacySubjectAliases = [
    { id: 'sub_math', name: 'MATHEMATICS', code: 'MATH', color: '#4f46e5' },
    { id: 'sub_phy', name: 'PHYSICS(042)', code: '042', color: '#0284c7' },
    { id: 'sub_chem', name: 'CHEMISTRY(043)', code: '043', color: '#0d9488' },
    { id: 'sub_bio', name: 'BIOLOGY(044)', code: '044', color: '#16a34a' },
    { id: 'sub_eng', name: 'ENGLISH', code: 'ENG', color: '#7c3aed' },
    { id: 'sub_hindi', name: 'HINDI', code: 'HIN', color: '#ea580c' },
    { id: 'sub_sst', name: 'SOCIAL SCIENCE', code: '087', color: '#d97706' },
    { id: 'sub_cs', name: 'COMPUTER', code: 'COMP', color: '#2563eb' },
    { id: 'sub_pe', name: 'PHYSICAL EDUCATION (048)', code: '048', color: '#059669' },
    { id: 'sub_art', name: 'ART EDUCATION', code: 'ART', color: '#db2777' }
  ];
  legacySubjectAliases.forEach(a => {
    if (!list.some(s => s.id === a.id)) list.push(a);
  });

  return list;
};

export const getSyncedTeachers = () => {
  const teaching = (usersList || []).filter(u => 
    u.category === 'Teaching' || 
    u.role === 'Teacher' || 
    u.department === 'Academics'
  );

  const list = teaching.map(u => ({
    id: u.id,
    empCode: u.empCode || '',
    name: u.displayName || u.name.replace(/^\[\d+\]\s*/, ''),
    fullName: u.name,
    email: u.email || '',
    phone: u.phone || '',
    designation: u.designation || 'Faculty',
    department: u.department || 'Academics',
    active: u.isActive !== false,
    classes: u.classes || [],
    subjects: u.subjects || []
  }));

  // Legacy teacher ID aliases
  const legacyTeachers = [
    { id: 't_kanwar', name: 'Pooja Kanwar', email: 'pooja.kanwar@jdintl.edu', active: true, subjects: ['sub_sst'], classes: ['c_10a'] },
    { id: 't_verma', name: 'Priti Verma', email: 'priti.verma@jdintl.edu', active: true, subjects: ['sub_eng'], classes: ['c_10a'] },
    { id: 't_sen', name: 'Dr. Suresh Sen', email: 'suresh.sen@school.edu', active: true, subjects: ['sub_phy', 'sub_bio'], classes: ['c_10a'] },
    { id: 't_sharma', name: 'R. K. Sharma', email: 'rk.sharma@school.edu', active: true, subjects: ['sub_math'], classes: ['c_10a'] },
    { id: 't_joshi', name: 'Meenakshi Joshi', email: 'meenakshi.j@school.edu', active: true, subjects: ['sub_chem'], classes: ['c_10a'] },
    { id: 't_saxena', name: 'Amit Saxena', email: 'amit.saxena@school.edu', active: true, subjects: ['sub_cs'], classes: ['c_10a'] },
    { id: 't_kavita', name: 'Kavita Sharma', email: 'kavita.sharma@school.edu', active: true, subjects: ['sub_hindi'], classes: ['c_10a'] },
    { id: 't_singh', name: 'Vikram Singh', email: 'vikram.singh@school.edu', active: true, subjects: ['sub_pe'], classes: ['c_10a'] },
    { id: 't_rathore', name: 'Neetu Rathore', email: 'neetu.rathore@school.edu', active: true, subjects: ['sub_art'], classes: ['c_10a'] }
  ];
  legacyTeachers.forEach(lt => {
    if (!list.some(t => t.id === lt.id)) list.push(lt);
  });

  return list;
};

export const findClass = (id) => {
  const clsList = getSyncedClasses();
  return clsList.find(c => c.id === id || c.id === `cls_${id}` || c.name.toLowerCase().includes(String(id).toLowerCase())) || { id, name: String(id) };
};

export const findSubject = (id) => {
  const subList = getSyncedSubjects();
  return subList.find(s => s.id === id || s.code === id || s.name.toLowerCase() === String(id).toLowerCase()) || { id, name: String(id), color: '#6366f1' };
};

export const findTeacher = (id) => {
  const teachList = getSyncedTeachers();
  return teachList.find(t => t.id === id || t.empCode === id || t.name.toLowerCase().includes(String(id).toLowerCase())) || { id, name: String(id) };
};

export const CLASSES_LIST = getSyncedClasses();
export const SUBJECTS_LIST = getSyncedSubjects();
export const TEACHERS_LIST = getSyncedTeachers();
// Helper seed slots for Class X-A
const SEED_SLOTS_10A = [
  // Monday
  { id: 's_m_1', dayOfWeek: 1, periodId: 'p_1', classId: 'c_10a', subjectId: 'sub_math', teacherId: 't_sharma' },
  { id: 's_m_2', dayOfWeek: 1, periodId: 'p_2', classId: 'c_10a', subjectId: 'sub_phy', teacherId: 't_sen' },
  { id: 's_m_3', dayOfWeek: 1, periodId: 'p_3', classId: 'c_10a', subjectId: 'sub_eng', teacherId: 't_verma' },
  { id: 's_m_4', dayOfWeek: 1, periodId: 'p_4', classId: 'c_10a', subjectId: 'sub_chem', teacherId: 't_joshi' },
  { id: 's_m_5', dayOfWeek: 1, periodId: 'p_5', classId: 'c_10a', subjectId: 'sub_cs', teacherId: 't_saxena' },
  { id: 's_m_6', dayOfWeek: 1, periodId: 'p_6', classId: 'c_10a', subjectId: 'sub_sst', teacherId: 't_kanwar' },
  { id: 's_m_7', dayOfWeek: 1, periodId: 'p_7', classId: 'c_10a', subjectId: 'sub_hindi', teacherId: 't_kavita' },
  { id: 's_m_8', dayOfWeek: 1, periodId: 'p_8', classId: 'c_10a', subjectId: 'sub_pe', teacherId: 't_singh' },

  // Tuesday
  { id: 's_t_1', dayOfWeek: 2, periodId: 'p_1', classId: 'c_10a', subjectId: 'sub_eng', teacherId: 't_verma' },
  { id: 's_t_2', dayOfWeek: 2, periodId: 'p_2', classId: 'c_10a', subjectId: 'sub_math', teacherId: 't_sharma' },
  { id: 's_t_3', dayOfWeek: 2, periodId: 'p_3', classId: 'c_10a', subjectId: 'sub_bio', teacherId: 't_sen' },
  { id: 's_t_4', dayOfWeek: 2, periodId: 'p_4', classId: 'c_10a', subjectId: 'sub_chem', teacherId: 't_joshi' },
  { id: 's_t_5', dayOfWeek: 2, periodId: 'p_5', classId: 'c_10a', subjectId: 'sub_hindi', teacherId: 't_kavita' },
  { id: 's_t_6', dayOfWeek: 2, periodId: 'p_6', classId: 'c_10a', subjectId: 'sub_cs', teacherId: 't_saxena' },
  { id: 's_t_7', dayOfWeek: 2, periodId: 'p_7', classId: 'c_10a', subjectId: 'sub_sst', teacherId: 't_kanwar' },
  { id: 's_t_8', dayOfWeek: 2, periodId: 'p_8', classId: 'c_10a', subjectId: 'sub_art', teacherId: 't_rathore' },

  // Wednesday
  { id: 's_w_1', dayOfWeek: 3, periodId: 'p_1', classId: 'c_10a', subjectId: 'sub_math', teacherId: 't_sharma' },
  { id: 's_w_2', dayOfWeek: 3, periodId: 'p_2', classId: 'c_10a', subjectId: 'sub_phy', teacherId: 't_sen' },
  { id: 's_w_3', dayOfWeek: 3, periodId: 'p_3', classId: 'c_10a', subjectId: 'sub_eng', teacherId: 't_verma' },
  { id: 's_w_4', dayOfWeek: 3, periodId: 'p_4', classId: 'c_10a', subjectId: 'sub_chem', teacherId: 't_joshi' },
  { id: 's_w_5', dayOfWeek: 3, periodId: 'p_5', classId: 'c_10a', subjectId: 'sub_sst', teacherId: 't_kanwar' },
  { id: 's_w_6', dayOfWeek: 3, periodId: 'p_6', classId: 'c_10a', subjectId: 'sub_math', teacherId: 't_sharma' },
  { id: 's_w_7', dayOfWeek: 3, periodId: 'p_7', classId: 'c_10a', subjectId: 'sub_art', teacherId: 't_rathore' },
  { id: 's_w_8', dayOfWeek: 3, periodId: 'p_8', classId: 'c_10a', subjectId: 'sub_pe', teacherId: 't_singh' },

  // Thursday
  { id: 's_th_1', dayOfWeek: 4, periodId: 'p_1', classId: 'c_10a', subjectId: 'sub_phy', teacherId: 't_sen' },
  { id: 's_th_2', dayOfWeek: 4, periodId: 'p_2', classId: 'c_10a', subjectId: 'sub_math', teacherId: 't_sharma' },
  { id: 's_th_3', dayOfWeek: 4, periodId: 'p_3', classId: 'c_10a', subjectId: 'sub_hindi', teacherId: 't_kavita' },
  { id: 's_th_4', dayOfWeek: 4, periodId: 'p_4', classId: 'c_10a', subjectId: 'sub_eng', teacherId: 't_verma' },
  { id: 's_th_5', dayOfWeek: 4, periodId: 'p_5', classId: 'c_10a', subjectId: 'sub_cs', teacherId: 't_saxena' },
  { id: 's_th_6', dayOfWeek: 4, periodId: 'p_6', classId: 'c_10a', subjectId: 'sub_chem', teacherId: 't_joshi' },
  { id: 's_th_7', dayOfWeek: 4, periodId: 'p_7', classId: 'c_10a', subjectId: 'sub_sst', teacherId: 't_kanwar' },
  { id: 's_th_8', dayOfWeek: 4, periodId: 'p_8', classId: 'c_10a', subjectId: 'sub_pe', teacherId: 't_singh' },

  // Friday
  { id: 's_f_1', dayOfWeek: 5, periodId: 'p_1', classId: 'c_10a', subjectId: 'sub_math', teacherId: 't_sharma' },
  { id: 's_f_2', dayOfWeek: 5, periodId: 'p_2', classId: 'c_10a', subjectId: 'sub_chem', teacherId: 't_joshi' },
  { id: 's_f_3', dayOfWeek: 5, periodId: 'p_3', classId: 'c_10a', subjectId: 'sub_phy', teacherId: 't_sen' },
  { id: 's_f_4', dayOfWeek: 5, periodId: 'p_4', classId: 'c_10a', subjectId: 'sub_eng', teacherId: 't_verma' },
  { id: 's_f_5', dayOfWeek: 5, periodId: 'p_5', classId: 'c_10a', subjectId: 'sub_sst', teacherId: 't_kanwar' },
  { id: 's_f_6', dayOfWeek: 5, periodId: 'p_6', classId: 'c_10a', subjectId: 'sub_hindi', teacherId: 't_kavita' },
  { id: 's_f_7', dayOfWeek: 5, periodId: 'p_7', classId: 'c_10a', subjectId: 'sub_cs', teacherId: 't_saxena' },
  { id: 's_f_8', dayOfWeek: 5, periodId: 'p_8', classId: 'c_10a', subjectId: 'sub_pe', teacherId: 't_singh' },

  // Saturday
  { id: 's_sa_1', dayOfWeek: 6, periodId: 'p_1', classId: 'c_10a', subjectId: 'sub_math', teacherId: 't_sharma' },
  { id: 's_sa_2', dayOfWeek: 6, periodId: 'p_2', classId: 'c_10a', subjectId: 'sub_phy', teacherId: 't_sen' },
  { id: 's_sa_3', dayOfWeek: 6, periodId: 'p_3', classId: 'c_10a', subjectId: 'sub_eng', teacherId: 't_verma' },
  { id: 's_sa_4', dayOfWeek: 6, periodId: 'p_4', classId: 'c_10a', subjectId: 'sub_pe', teacherId: 't_singh' }
];

// In-Memory Database Stores (Multi-Tenant Stateful Store)
let STORE_TIMETABLES = [
  {
    id: 'tt_main_2026',
    schoolId: 'sch_jd_intl',
    name: 'Academic Master Timetable 2026-27',
    status: 'PUBLISHED',
    baseStartTime: '08:00',
    periodDuration: 45,
    workingDays: [1, 2, 3, 4, 5, 6],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    slots: [...SEED_SLOTS_10A]
  },
  {
    id: 'tt_exam_prep',
    schoolId: 'sch_jd_intl',
    name: 'Pre-Board Special Revision Schedule',
    status: 'DRAFT',
    baseStartTime: '08:00',
    periodDuration: 45,
    workingDays: [1, 2, 3, 4, 5],
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    slots: []
  }
];

let STORE_ATTENDANCE = [
  {
    id: 'att_01',
    schoolId: 'sch_jd_intl',
    teacherId: 't_sen',
    date: new Date().toISOString().split('T')[0],
    status: 'ABSENT',
    reason: 'Casual Leave (Approved Medical)'
  }
];

let STORE_REPLACEMENTS = [
  {
    id: 'rep_001',
    schoolId: 'sch_jd_intl',
    date: new Date().toISOString().split('T')[0],
    periodId: 'p_2',
    classId: 'c_10a',
    originalTeacherId: 't_sen',
    replacementTeacherId: 't_saxena',
    reason: 'Casual Leave',
    status: 'Assigned',
    notifiedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    createdAt: new Date().toISOString()
  }
];

let STORE_LESSON_PLANS = [
  {
    id: 'lp_001',
    schoolId: 'sch_jd_intl',
    teacherId: 't_sharma',
    classId: 'c_10a',
    subjectId: 'sub_math',
    periodId: 'p_1',
    planDate: new Date().toISOString().split('T')[0],
    lessonTitle: 'Quadratic Equations & Roots of Polynomials',
    topic: 'Algebra',
    chapter: 'Chapter 4',
    subtopic: 'Finding roots using quadratic formula',
    teachingAids: 'Smartboard, Graphing Calculator, NCERT Exemplar',
    activities: 'Group problem solving session on discriminant analysis.',
    homework: 'Exercise 4.3 Questions 1 to 6 in homework notebook.',
    learningOutcomes: 'Students should be able to determine real roots and apply formula to word problems.',
    estimatedDuration: 45,
    status: 'COMPLETED',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    comments: [
      { id: 'c_1', userId: 'usr_admin', authorName: 'Principal', content: 'Well structured lesson plan. Check student workbooks.', createdAt: new Date().toISOString() }
    ]
  },
  {
    id: 'lp_002',
    schoolId: 'sch_jd_intl',
    teacherId: 't_verma',
    classId: 'c_10a',
    subjectId: 'sub_eng',
    periodId: 'p_3',
    planDate: new Date().toISOString().split('T')[0],
    lessonTitle: 'Formal Letter Writing & Editorial Formats',
    topic: 'Writing Skills',
    chapter: 'Section B',
    subtopic: 'Letters to Editor regarding Civic Amenities',
    teachingAids: 'Newspaper clipping samples, Writing rubrics',
    activities: 'Peer evaluation of draft opening paragraphs.',
    homework: 'Draft complete letter on road safety in local area.',
    learningOutcomes: 'Familiarity with standard CBSE formal letter format.',
    estimatedDuration: 45,
    status: 'PLANNED',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    comments: []
  },
  {
    id: 'lp_003',
    schoolId: 'sch_jd_intl',
    teacherId: 't_joshi',
    classId: 'c_10a',
    subjectId: 'sub_chem',
    periodId: 'p_4',
    planDate: new Date().toISOString().split('T')[0],
    lessonTitle: 'Acids, Bases & Salts Lab Demonstration',
    topic: 'Chemical Reactions',
    chapter: 'Chapter 2',
    subtopic: 'pH scale indicators (Litmus, Phenolphthalein)',
    teachingAids: 'Test tubes, Indicator solutions, Safety goggles',
    activities: 'Live litmus test with HCl, NaOH, Lemon juice.',
    homework: 'Write lab observations in practical journal.',
    learningOutcomes: 'Understanding pH indicators and neutralisation reactions.',
    estimatedDuration: 45,
    status: 'PLANNED',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    comments: []
  }
];

let STORE_REPORTS = [
  {
    id: 'rep_daily_01',
    schoolId: 'sch_jd_intl',
    teacherId: 't_sharma',
    reportDate: new Date().toISOString().split('T')[0],
    status: 'SUBMITTED',
    submittedAt: new Date().toISOString(),
    entries: [
      {
        id: 'ent_1',
        classId: 'c_10a',
        subjectId: 'sub_math',
        description: 'Completed Quadratic Equations exercise 4.3; conducted quick 10-min oral quiz.',
        isCompleted: true,
        entryType: 'LESSON',
        activityCategory: 'Scholastic',
        activityDescription: 'Oral quiz on discriminant calculation',
        learningOutcome: 'All students grasped b^2 - 4ac rules.'
      }
    ]
  },
  {
    id: 'rep_daily_02',
    schoolId: 'sch_jd_intl',
    teacherId: 't_saxena',
    reportDate: new Date().toISOString().split('T')[0],
    status: 'SUBMITTED',
    submittedAt: new Date().toISOString(),
    entries: [
      {
        id: 'ent_2',
        classId: 'c_10a',
        subjectId: 'sub_cs',
        description: 'Taught Python loops (for and while) with dry run examples.',
        isCompleted: true,
        entryType: 'LESSON',
        activityCategory: 'Computer Lab Practical',
        activityDescription: 'Coding practical on star pattern generation',
        learningOutcome: 'Students wrote and executed nested loop programs.'
      },
      {
        id: 'ent_3',
        classId: 'c_10a',
        subjectId: 'sub_phy',
        description: 'Substitution period taken for Dr. Suresh Sen. Supervised physics numericals.',
        isCompleted: true,
        isProxy: true,
        entryType: 'ACTIVITY',
        activityCategory: 'Substitution Cover',
        activityDescription: 'Physics Ohm law revision numericals',
        learningOutcome: 'Kept class engaged and assisted with doubts.'
      }
    ]
  }
];

let STORE_HOMEWORK = [
  {
    id: 'hw_001',
    schoolId: 'sch_jd_intl',
    teacherId: 't_sharma',
    classId: 'c_10a',
    title: 'Mathematics - Quadratic Formula Assignment',
    description: 'Solve questions 1 through 8 from NCERT Exercise 4.3. Highlight roots for questions with negative discriminant.',
    status: 'SENT_TO_ADMIN',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'hw_002',
    schoolId: 'sch_jd_intl',
    teacherId: 't_verma',
    classId: 'c_10a',
    title: 'English - Formal Letter on Civic Amenities',
    description: 'Draft a letter to the municipal commissioner addressing erratic water supply in your locality (120 words).',
    status: 'SENT_TO_ADMIN',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'hw_003',
    schoolId: 'sch_jd_intl',
    teacherId: 't_joshi',
    classId: 'c_10a',
    title: 'Chemistry - Practical File Record Entry',
    description: 'Write experiment 3 (Action of acids and bases on litmus and phenolphthalein) with diagrams in practical journal.',
    status: 'SENT_TO_ADMIN',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Helper to enrich slot
const enrichSlot = (slot) => {
  const p = PERIOD_SLOTS.find(item => item.id === slot.periodId) || {};
  const c = findClass(slot.classId);
  const s = findSubject(slot.subjectId);
  const t = findTeacher(slot.teacherId);

  return {
    ...slot,
    periodNumber: p.periodNumber || 0,
    startTime: p.startTime || '',
    endTime: p.endTime || '',
    periodLabel: p.label || '',
    className: c.name || slot.classId,
    subjectName: s.name || slot.subjectId,
    subjectColor: s.color || '#6366f1',
    teacherName: t.name || slot.teacherId,
    roomNumber: '' // Room removed
  };
};

// =================================================================
// 1. DASHBOARD & ANALYTICS CONTROLLERS
// =================================================================

export const getDashboardStats = asyncHandler(async (req, res) => {
  const schoolId = req.schoolId || 'sch_jd_intl';
  const today = req.query.date || new Date().toISOString().split('T')[0];

  // Active published timetable
  const activeTimetable = STORE_TIMETABLES.find(t => t.schoolId === schoolId && t.status === 'PUBLISHED') || STORE_TIMETABLES[0];

  // Absent teachers today
  const absentRecords = STORE_ATTENDANCE.filter(a => a.schoolId === schoolId && a.date === today && a.status === 'ABSENT');
  const absentTeachers = absentRecords.map(att => {
    const teacher = TEACHERS_LIST.find(t => t.id === att.teacherId) || { name: att.teacherId };
    return {
      id: att.id,
      teacherId: att.teacherId,
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone,
      reason: att.reason,
      status: att.status
    };
  });

  // Replacements today
  const todayReplacements = STORE_REPLACEMENTS.filter(r => r.schoolId === schoolId && r.date === today).map(rep => {
    const origTeacher = TEACHERS_LIST.find(t => t.id === rep.originalTeacherId) || { name: rep.originalTeacherId };
    const replTeacher = TEACHERS_LIST.find(t => t.id === rep.replacementTeacherId) || { name: rep.replacementTeacherId };
    const period = PERIOD_SLOTS.find(p => p.id === rep.periodId) || {};
    const cls = CLASSES_LIST.find(c => c.id === rep.classId) || {};
    return {
      ...rep,
      originalTeacherName: origTeacher.name,
      replacementTeacherName: replTeacher.name,
      periodLabel: period.label || `Period ${period.periodNumber || ''}`,
      time: period.time || '',
      className: cls.name || rep.classId
    };
  });

  // Teacher Workload Utilization
  const teacherWorkload = TEACHERS_LIST.map(teacher => {
    const assignedSlots = (activeTimetable?.slots || []).filter(s => s.teacherId === teacher.id).length;
    const maxWeekly = 24; // standard 24 periods/week max load
    const utilization = Math.min(100, Math.round((assignedSlots / maxWeekly) * 100));
    return {
      teacherId: teacher.id,
      name: teacher.name,
      email: teacher.email,
      assigned: assignedSlots,
      total: maxWeekly,
      remaining: Math.max(0, maxWeekly - assignedSlots),
      utilization
    };
  });

  // Subject distribution
  const subjectCounts = {};
  (activeTimetable?.slots || []).forEach(slot => {
    subjectCounts[slot.subjectId] = (subjectCounts[slot.subjectId] || 0) + 1;
  });
  const totalSlotsCount = (activeTimetable?.slots || []).length || 1;
  const subjectDistribution = SUBJECTS_LIST.map(sub => {
    const count = subjectCounts[sub.id] || 0;
    return {
      id: sub.id,
      name: sub.name,
      count,
      percentage: Math.round((count / totalSlotsCount) * 100),
      color: sub.color
    };
  }).filter(s => s.count > 0);

  // Lesson plans summary today
  const todayPlans = STORE_LESSON_PLANS.filter(p => p.schoolId === schoolId && p.planDate === today);
  const todayReports = STORE_REPORTS.filter(r => r.schoolId === schoolId && r.reportDate === today);

  const kpis = {
    totalTeachers: TEACHERS_LIST.length,
    activePeriodsCount: PERIOD_SLOTS.filter(p => !p.isBreak).length,
    totalSlots: activeTimetable?.slots?.length || 0,
    absentCount: absentTeachers.length,
    substitutionsCount: todayReplacements.length,
    activeTimetableName: activeTimetable?.name || 'Standard Timetable',
    lessonPlansCount: todayPlans.length,
    reportsCount: todayReports.length
  };

  return res.status(200).json(
    new ApiResponse(200, {
      kpis,
      absentTeachers,
      todayReplacements,
      teacherWorkload,
      subjectDistribution,
      activeTimetable: {
        id: activeTimetable?.id,
        name: activeTimetable?.name,
        status: activeTimetable?.status,
        slotCount: activeTimetable?.slots?.length || 0
      }
    }, 'Dashboard statistics fetched successfully')
  );
});

// =================================================================
// 2. TIMETABLES MANAGER & BUILDER CONTROLLERS
// =================================================================

export const getTimetablesList = asyncHandler(async (req, res) => {
  const schoolId = req.schoolId || 'sch_jd_intl';
  const list = STORE_TIMETABLES.filter(t => t.schoolId === schoolId).map(t => ({
    id: t.id,
    name: t.name,
    status: t.status,
    baseStartTime: t.baseStartTime,
    periodDuration: t.periodDuration,
    workingDays: t.workingDays,
    slotCount: (t.slots || []).length,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt
  }));

  return res.status(200).json(new ApiResponse(200, list, 'Timetables retrieved successfully'));
});

export const createTimetable = asyncHandler(async (req, res) => {
  const schoolId = req.schoolId || 'sch_jd_intl';
  const { name, baseStartTime = '08:00', periodDuration = 45, workingDays = [1, 2, 3, 4, 5, 6] } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json(new ApiResponse(400, null, 'Timetable name is required'));
  }

  const newTt = {
    id: `tt_${Date.now()}`,
    schoolId,
    name: name.trim(),
    status: 'DRAFT',
    baseStartTime,
    periodDuration: Number(periodDuration) || 45,
    workingDays,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    slots: []
  };

  STORE_TIMETABLES.unshift(newTt);

  return res.status(201).json(new ApiResponse(201, newTt, 'Timetable created successfully'));
});

export const getTimetableDetail = asyncHandler(async (req, res) => {
  const schoolId = req.schoolId || 'sch_jd_intl';
  const { id } = req.params;

  const tt = STORE_TIMETABLES.find(t => t.id === id && t.schoolId === schoolId) || STORE_TIMETABLES.find(t => t.id === id);

  if (!tt) {
    return res.status(404).json(new ApiResponse(404, null, 'Timetable not found'));
  }

  const enrichedSlots = (tt.slots || []).map(enrichSlot);

  return res.status(200).json(
    new ApiResponse(200, {
      id: tt.id,
      name: tt.name,
      status: tt.status,
      baseStartTime: tt.baseStartTime,
      periodDuration: tt.periodDuration,
      workingDays: tt.workingDays,
      periods: PERIOD_SLOTS,
      classes: getSyncedClasses(),
      subjects: getSyncedSubjects(),
      teachers: getSyncedTeachers(),
      rooms: [],
      slots: enrichedSlots
    }, 'Timetable details retrieved successfully')
  );
});

export const updateTimetable = asyncHandler(async (req, res) => {
  const schoolId = req.schoolId || 'sch_jd_intl';
  const { id } = req.params;
  const { name, status, workingDays, baseStartTime, periodDuration } = req.body;

  const tt = STORE_TIMETABLES.find(t => t.id === id && t.schoolId === schoolId) || STORE_TIMETABLES.find(t => t.id === id);

  if (!tt) {
    return res.status(404).json(new ApiResponse(404, null, 'Timetable not found'));
  }

  if (name !== undefined) tt.name = name.trim();
  if (workingDays !== undefined) tt.workingDays = workingDays;
  if (baseStartTime !== undefined) tt.baseStartTime = baseStartTime;
  if (periodDuration !== undefined) tt.periodDuration = Number(periodDuration);

  // If status changed to PUBLISHED, archive any other published ones for this school
  if (status === 'PUBLISHED') {
    STORE_TIMETABLES.forEach(item => {
      if (item.schoolId === schoolId && item.id !== id && item.status === 'PUBLISHED') {
        item.status = 'DRAFT';
      }
    });
    tt.status = 'PUBLISHED';
  } else if (status === 'DRAFT') {
    tt.status = 'DRAFT';
  }

  tt.updatedAt = new Date().toISOString();

  return res.status(200).json(new ApiResponse(200, tt, 'Timetable updated successfully'));
});

export const deleteTimetable = asyncHandler(async (req, res) => {
  const schoolId = req.schoolId || 'sch_jd_intl';
  const { id } = req.params;

  const idx = STORE_TIMETABLES.findIndex(t => t.id === id && (t.schoolId === schoolId || !t.schoolId));
  if (idx === -1) {
    return res.status(404).json(new ApiResponse(404, null, 'Timetable not found'));
  }

  STORE_TIMETABLES.splice(idx, 1);
  return res.status(200).json(new ApiResponse(200, { id }, 'Timetable deleted successfully'));
});

export const upsertTimetableSlot = asyncHandler(async (req, res) => {
  const schoolId = req.schoolId || 'sch_jd_intl';
  const { id: timetableId } = req.params;
  const { dayOfWeek, periodId, classId, subjectId, teacherId, roomId } = req.body;

  const tt = STORE_TIMETABLES.find(t => t.id === timetableId);
  if (!tt) {
    return res.status(404).json(new ApiResponse(404, null, 'Timetable not found'));
  }

  const d = Number(dayOfWeek);
  if (!d || !periodId || !classId || !subjectId || !teacherId) {
    return res.status(400).json(new ApiResponse(400, null, 'All slot fields (day, period, class, subject, teacher) are required'));
  }

  // Conflict Check 1: Teacher double-booking across different classes in the same period and day
  const teacherConflict = (tt.slots || []).find(s => 
    s.dayOfWeek === d &&
    s.periodId === periodId &&
    s.teacherId === teacherId &&
    s.classId !== classId
  );

  if (teacherConflict) {
    const cl = CLASSES_LIST.find(c => c.id === teacherConflict.classId);
    const teacher = TEACHERS_LIST.find(t => t.id === teacherId);
    return res.status(409).json(
      new ApiResponse(409, null, `Faculty Clash: ${teacher?.name || 'Teacher'} is already scheduled to teach ${cl?.name || teacherConflict.classId} in Period ${periodId}`)
    );
  }

  // Find existing slot for this class, day, and period to update, or create new
  const existingIdx = (tt.slots || []).findIndex(s => s.dayOfWeek === d && s.periodId === periodId && s.classId === classId);

  const slotData = {
    id: existingIdx >= 0 ? tt.slots[existingIdx].id : `slot_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    dayOfWeek: d,
    periodId,
    classId,
    subjectId,
    teacherId,
    roomId: roomId || null
  };

  if (existingIdx >= 0) {
    tt.slots[existingIdx] = slotData;
  } else {
    tt.slots.push(slotData);
  }

  tt.updatedAt = new Date().toISOString();

  return res.status(200).json(new ApiResponse(200, enrichSlot(slotData), 'Timetable slot saved successfully'));
});

export const deleteTimetableSlot = asyncHandler(async (req, res) => {
  const { id: timetableId, slotId } = req.params;

  const tt = STORE_TIMETABLES.find(t => t.id === timetableId);
  if (!tt) {
    return res.status(404).json(new ApiResponse(404, null, 'Timetable not found'));
  }

  const idx = (tt.slots || []).findIndex(s => s.id === slotId);
  if (idx === -1) {
    return res.status(404).json(new ApiResponse(404, null, 'Slot not found'));
  }

  tt.slots.splice(idx, 1);
  tt.updatedAt = new Date().toISOString();

  return res.status(200).json(new ApiResponse(200, { slotId }, 'Slot removed successfully'));
});

export const autoGenerateTimetable = asyncHandler(async (req, res) => {
  const { id: timetableId } = req.params;
  const tt = STORE_TIMETABLES.find(t => t.id === timetableId);

  if (!tt) {
    return res.status(404).json(new ApiResponse(404, null, 'Timetable not found'));
  }

  const workingDays = tt.workingDays || [1, 2, 3, 4, 5, 6];
  const activePeriods = PERIOD_SLOTS.filter(p => !p.isBreak);

  // Clear existing slots for clean AI generation
  tt.slots = [];

  // Generate slots across classes and days with clash prevention
  const genClasses = getSyncedClasses();
  const genSubjects = getSyncedSubjects();
  const genTeachers = getSyncedTeachers();

  genClasses.forEach(cls => {
    workingDays.forEach(day => {
      activePeriods.forEach((period, pIndex) => {
        const subject = genSubjects[(pIndex + day) % genSubjects.length];
        
        let assignedTeacher = genTeachers.find(t => 
          (t.subjects || []).some(sub => sub.toLowerCase().includes(subject.name.toLowerCase()) || subject.name.toLowerCase().includes(sub.toLowerCase())) &&
          !tt.slots.some(s => s.dayOfWeek === day && s.periodId === period.id && s.teacherId === t.id)
        );

        if (!assignedTeacher) {
          assignedTeacher = genTeachers.find(t => 
            !tt.slots.some(s => s.dayOfWeek === day && s.periodId === period.id && s.teacherId === t.id)
          );
        }

        if (assignedTeacher) {
          tt.slots.push({
            id: `ai_${cls.id}_${day}_${period.id}`,
            dayOfWeek: day,
            periodId: period.id,
            classId: cls.id,
            subjectId: subject.id,
            teacherId: assignedTeacher.id,
            roomId: null
          });
        }
      });
    });
  });

  tt.updatedAt = new Date().toISOString();

  return res.status(200).json(
    new ApiResponse(200, {
      totalGeneratedSlots: tt.slots.length,
      classesCount: CLASSES_LIST.length,
      workingDaysCount: workingDays.length
    }, 'Clash-free timetable schedule automatically generated successfully')
  );
});

// =================================================================
// 3. DAILY DESK CONTROLLERS (Attendance, Live Matrix, Substitutions)
// =================================================================

export const getDailyDeskData = asyncHandler(async (req, res) => {
  const schoolId = req.schoolId || 'sch_jd_intl';
  const date = req.query.date || new Date().toISOString().split('T')[0];
  
  // Calculate day of week (1=Mon ... 7=Sun)
  const dObj = new Date(date);
  const rawDay = dObj.getDay();
  const dayOfWeek = rawDay === 0 ? 7 : rawDay;

  // Active timetable
  const activeTimetable = STORE_TIMETABLES.find(t => t.schoolId === schoolId && t.status === 'PUBLISHED') || STORE_TIMETABLES[0];

  // Daily attendance for date
  const attendance = STORE_ATTENDANCE.filter(a => a.schoolId === schoolId && a.date === date);
  const absentTeacherIds = new Set(attendance.filter(a => a.status === 'ABSENT').map(a => a.teacherId));

  // Substitutions / Replacements for date
  const replacements = STORE_REPLACEMENTS.filter(r => r.schoolId === schoolId && r.date === date);

  // Available teaching periods
  const periods = PERIOD_SLOTS;

  // Slots for this day of week
  const daySlots = (activeTimetable?.slots || []).filter(s => s.dayOfWeek === dayOfWeek);

  // Build Grid: For each class, for each period, determine slot info, absent status, and replacement
  const syncedClasses = getSyncedClasses();
  const syncedTeachers = getSyncedTeachers();
  const syncedSubjects = getSyncedSubjects();
  const grid = syncedClasses.map(cls => {
    const classSlots = periods.map(period => {
      if (period.isBreak) {
        return {
          periodId: period.id,
          periodNumber: 0,
          label: period.label,
          time: period.time,
          isBreak: true,
          empty: true
        };
      }

      const assignedSlot = daySlots.find(s => s.classId === cls.id && s.periodId === period.id);

      if (!assignedSlot) {
        return {
          periodId: period.id,
          periodNumber: period.periodNumber,
          label: period.label,
          time: period.time,
          empty: true
        };
      }

      const teacher = findTeacher(assignedSlot.teacherId);
      const subject = findSubject(assignedSlot.subjectId);
      const isAbsent = absentTeacherIds.has(assignedSlot.teacherId);

      // Check if a replacement has been assigned for this period and class
      const rep = replacements.find(r => r.periodId === period.id && r.classId === cls.id);
      let replacementObj = null;
      if (rep) {
        const repTeacher = findTeacher(rep.replacementTeacherId);
        replacementObj = {
          id: rep.id,
          replacementTeacherId: rep.replacementTeacherId,
          replacementTeacherName: repTeacher?.name || rep.replacementTeacherId,
          status: rep.status,
          reason: rep.reason
        };
      }

      return {
        slotId: assignedSlot.id,
        periodId: period.id,
        periodNumber: period.periodNumber,
        label: period.label,
        time: period.time,
        empty: false,
        subjectId: assignedSlot.subjectId,
        subjectName: subject?.name || 'Subject',
        subjectColor: subject?.color || '#6366f1',
        teacherId: assignedSlot.teacherId,
        teacherName: teacher?.name || 'Teacher',
        isAbsent,
        replacement: replacementObj
      };
    });

    return {
      classId: cls.id,
      className: cls.name,
      // roomNumber removed
      slots: classSlots
    };
  });

  // Calculate list of free teachers for each period today
  const freeTeachersByPeriod = {};
  periods.forEach(p => {
    if (!p.isBreak) {
      const busyTeachers = new Set();
      // Regular scheduled teachers
      daySlots.filter(s => s.periodId === p.id).forEach(s => busyTeachers.add(s.teacherId));
      // Replacement teachers
      replacements.filter(r => r.periodId === p.id).forEach(r => busyTeachers.add(r.replacementTeacherId));
      // Absent teachers cannot be assigned
      absentTeacherIds.forEach(id => busyTeachers.add(id));

      freeTeachersByPeriod[p.id] = syncedTeachers.filter(t => !busyTeachers.has(t.id)).map(t => ({
        id: t.id,
        name: t.name,
        email: t.email,
        phone: t.phone
      }));
    }
  });

  return res.status(200).json(
    new ApiResponse(200, {
      date,
      dayOfWeek,
      classes: syncedClasses,
      periods,
      teachers: syncedTeachers,
      grid,
      attendance,
      replacements,
      freeTeachersByPeriod
    }, 'Daily Desk grid matrix loaded successfully')
  );
});

export const markTeacherAttendance = asyncHandler(async (req, res) => {
  const schoolId = req.schoolId || 'sch_jd_intl';
  const { teacherId, date, status = 'ABSENT', reason } = req.body;

  if (!teacherId || !date) {
    return res.status(400).json(new ApiResponse(400, null, 'Teacher ID and date are required'));
  }

  const existingIdx = STORE_ATTENDANCE.findIndex(a => a.schoolId === schoolId && a.teacherId === teacherId && a.date === date);

  if (status === 'PRESENT') {
    if (existingIdx >= 0) {
      STORE_ATTENDANCE.splice(existingIdx, 1);
    }
    return res.status(200).json(new ApiResponse(200, { teacherId, date, status: 'PRESENT' }, 'Teacher marked as Present'));
  }

  const rec = {
    id: existingIdx >= 0 ? STORE_ATTENDANCE[existingIdx].id : `att_${Date.now()}`,
    schoolId,
    teacherId,
    date,
    status: status || 'ABSENT',
    reason: reason || 'Leave Marked by Admin'
  };

  if (existingIdx >= 0) {
    STORE_ATTENDANCE[existingIdx] = rec;
  } else {
    STORE_ATTENDANCE.push(rec);
  }

  return res.status(200).json(new ApiResponse(200, rec, `Teacher marked as ${status}`));
});

export const createReplacementAssignment = asyncHandler(async (req, res) => {
  const schoolId = req.schoolId || 'sch_jd_intl';
  const { date, periodId, classId, originalTeacherId, replacementTeacherId, reason = 'Casual Leave' } = req.body;

  if (!date || !periodId || !classId || !replacementTeacherId) {
    return res.status(400).json(new ApiResponse(400, null, 'Date, period, class, and substitute teacher are required'));
  }

  // Prevent double booking substitute
  const alreadyBusy = STORE_REPLACEMENTS.find(r => 
    r.schoolId === schoolId &&
    r.date === date &&
    r.periodId === periodId &&
    r.replacementTeacherId === replacementTeacherId &&
    r.classId !== classId
  );

  if (alreadyBusy) {
    return res.status(409).json(new ApiResponse(409, null, 'Selected teacher is already assigned as substitute in another class for this period'));
  }

  const newRep = {
    id: `rep_${Date.now()}`,
    schoolId,
    date,
    periodId,
    classId,
    originalTeacherId: originalTeacherId || '',
    replacementTeacherId,
    reason,
    status: 'Assigned',
    notifiedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    createdAt: new Date().toISOString()
  };

  STORE_REPLACEMENTS.unshift(newRep);

  const replTeacher = TEACHERS_LIST.find(t => t.id === replacementTeacherId);
  return res.status(201).json(
    new ApiResponse(201, {
      ...newRep,
      replacementTeacherName: replTeacher?.name || replacementTeacherId
    }, 'Substitute teacher assigned successfully')
  );
});

export const getReplacementHistory = asyncHandler(async (req, res) => {
  const schoolId = req.schoolId || 'sch_jd_intl';

  // Group by date
  const datesMap = {};
  STORE_REPLACEMENTS.filter(r => r.schoolId === schoolId).forEach(r => {
    datesMap[r.date] = (datesMap[r.date] || 0) + 1;
  });

  const history = Object.keys(datesMap).sort().reverse().map(date => ({
    date,
    replacementCount: datesMap[date]
  }));

  return res.status(200).json(new ApiResponse(200, history, 'Replacement history fetched successfully'));
});

// =================================================================
// 4. LESSON PLANNING CONTROLLERS
// =================================================================

export const getLessonPlans = asyncHandler(async (req, res) => {
  const schoolId = req.schoolId || 'sch_jd_intl';
  const { dateFrom, dateTo, teacherId, classId, subjectId, status, search } = req.query;

  let plans = STORE_LESSON_PLANS.filter(p => p.schoolId === schoolId);

  if (dateFrom) plans = plans.filter(p => p.planDate >= dateFrom);
  if (dateTo) plans = plans.filter(p => p.planDate <= dateTo);
  if (teacherId && teacherId !== 'all') plans = plans.filter(p => p.teacherId === teacherId);
  if (classId && classId !== 'all') plans = plans.filter(p => p.classId === classId);
  if (subjectId && subjectId !== 'all') plans = plans.filter(p => p.subjectId === subjectId);
  if (status && status !== 'all') plans = plans.filter(p => p.status === status);

  if (search) {
    const q = search.toLowerCase();
    plans = plans.filter(p => 
      p.lessonTitle.toLowerCase().includes(q) ||
      (p.topic && p.topic.toLowerCase().includes(q)) ||
      (p.chapter && p.chapter.toLowerCase().includes(q))
    );
  }

  const enrichedPlans = plans.map(p => {
    const teacher = TEACHERS_LIST.find(t => t.id === p.teacherId) || {};
    const cls = CLASSES_LIST.find(c => c.id === p.classId) || {};
    const subject = SUBJECTS_LIST.find(s => s.id === p.subjectId) || {};
    const period = PERIOD_SLOTS.find(item => item.id === p.periodId) || {};
    return {
      ...p,
      teacher: { id: p.teacherId, name: teacher.name || 'Faculty' },
      class: { id: p.classId, name: cls.name || 'Class' },
      subject: { id: p.subjectId, name: subject.name || 'Subject' },
      period: { startTime: period.startTime || '', endTime: period.endTime || '', label: period.label || '' }
    };
  });

  return res.status(200).json(new ApiResponse(200, enrichedPlans, 'Lesson plans retrieved successfully'));
});

export const createLessonPlan = asyncHandler(async (req, res) => {
  const schoolId = req.schoolId || 'sch_jd_intl';
  const {
    lessonTitle,
    planDate,
    teacherId,
    classId,
    subjectId,
    periodId,
    topic,
    chapter,
    subtopic,
    teachingAids,
    activities,
    homework,
    learningOutcomes,
    estimatedDuration,
    status = 'PLANNED'
  } = req.body;

  if (!lessonTitle || !planDate || !teacherId || !classId) {
    return res.status(400).json(new ApiResponse(400, null, 'Lesson title, date, teacher, and class are required'));
  }

  const newPlan = {
    id: `lp_${Date.now()}`,
    schoolId,
    teacherId,
    classId,
    subjectId: subjectId || 'sub_math',
    periodId: periodId || 'p_1',
    planDate,
    lessonTitle: lessonTitle.trim(),
    topic: topic || '',
    chapter: chapter || '',
    subtopic: subtopic || '',
    teachingAids: teachingAids || '',
    activities: activities || '',
    homework: homework || '',
    learningOutcomes: learningOutcomes || '',
    estimatedDuration: Number(estimatedDuration) || 45,
    status: status || 'PLANNED',
    comments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  STORE_LESSON_PLANS.unshift(newPlan);

  return res.status(201).json(new ApiResponse(201, newPlan, 'Lesson plan created successfully'));
});

export const updateLessonPlan = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const plan = STORE_LESSON_PLANS.find(p => p.id === id);

  if (!plan) {
    return res.status(404).json(new ApiResponse(404, null, 'Lesson plan not found'));
  }

  Object.assign(plan, req.body, { updatedAt: new Date().toISOString() });
  return res.status(200).json(new ApiResponse(200, plan, 'Lesson plan updated successfully'));
});

export const addLessonPlanComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content, authorName = 'Administrator' } = req.body;

  const plan = STORE_LESSON_PLANS.find(p => p.id === id);
  if (!plan) {
    return res.status(404).json(new ApiResponse(404, null, 'Lesson plan not found'));
  }

  const newComment = {
    id: `comm_${Date.now()}`,
    authorName,
    content: (content || '').trim(),
    createdAt: new Date().toISOString()
  };

  if (!plan.comments) plan.comments = [];
  plan.comments.push(newComment);

  return res.status(201).json(new ApiResponse(201, newComment, 'Comment added to lesson plan'));
});

export const deleteLessonPlan = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const idx = STORE_LESSON_PLANS.findIndex(p => p.id === id);

  if (idx === -1) {
    return res.status(404).json(new ApiResponse(404, null, 'Lesson plan not found'));
  }

  STORE_LESSON_PLANS.splice(idx, 1);
  return res.status(200).json(new ApiResponse(200, { id }, 'Lesson plan deleted'));
});

// =================================================================
// 5. DAILY REPORTS CONTROLLERS
// =================================================================

export const getDailyReports = asyncHandler(async (req, res) => {
  const schoolId = req.schoolId || 'sch_jd_intl';
  const { date, teacherName, classId, subjectId } = req.query;

  let reports = STORE_REPORTS.filter(r => r.schoolId === schoolId);

  if (date) {
    reports = reports.filter(r => r.reportDate === date);
  }

  let enrichedReports = reports.map(r => {
    const teacher = TEACHERS_LIST.find(t => t.id === r.teacherId) || { name: 'Teacher', email: '' };
    const entries = (r.entries || []).map(ent => {
      const cls = CLASSES_LIST.find(c => c.id === ent.classId) || {};
      const sub = SUBJECTS_LIST.find(s => s.id === ent.subjectId) || {};
      return {
        ...ent,
        className: cls.name || ent.classId,
        subjectName: sub.name || ent.subjectId
      };
    });

    return {
      id: r.id,
      teacherId: r.teacherId,
      teacherName: teacher.name,
      teacherEmail: teacher.email,
      reportDate: r.reportDate,
      status: r.status,
      submittedAt: r.submittedAt,
      entries,
      entryCount: entries.length,
      proxyCount: entries.filter(e => e.isProxy).length,
      totalSessions: entries.length
    };
  });

  if (teacherName && teacherName.trim()) {
    const q = teacherName.toLowerCase();
    enrichedReports = enrichedReports.filter(r => r.teacherName.toLowerCase().includes(q));
  }

  if (classId) {
    enrichedReports = enrichedReports.filter(r => r.entries.some(e => e.classId === classId));
  }

  if (subjectId) {
    enrichedReports = enrichedReports.filter(r => r.entries.some(e => e.subjectId === subjectId));
  }

  return res.status(200).json(new ApiResponse(200, enrichedReports, 'Teacher reports fetched successfully'));
});

export const submitDailyReport = asyncHandler(async (req, res) => {
  const schoolId = req.schoolId || 'sch_jd_intl';
  const { teacherId, reportDate, entries } = req.body;

  if (!teacherId || !entries || !Array.isArray(entries)) {
    return res.status(400).json(new ApiResponse(400, null, 'Teacher ID and report entries are required'));
  }

  const date = reportDate || new Date().toISOString().split('T')[0];

  const existingIdx = STORE_REPORTS.findIndex(r => r.schoolId === schoolId && r.teacherId === teacherId && r.reportDate === date);

  const reportData = {
    id: existingIdx >= 0 ? STORE_REPORTS[existingIdx].id : `rep_${Date.now()}`,
    schoolId,
    teacherId,
    reportDate: date,
    status: 'SUBMITTED',
    submittedAt: new Date().toISOString(),
    entries: entries.map((ent, idx) => ({
      id: ent.id || `ent_${Date.now()}_${idx}`,
      classId: ent.classId || 'c_10a',
      subjectId: ent.subjectId || 'sub_math',
      description: ent.description || '',
      isCompleted: ent.isCompleted ?? true,
      isProxy: ent.isProxy ?? false,
      entryType: ent.entryType || 'LESSON',
      activityCategory: ent.activityCategory || '',
      activityDescription: ent.activityDescription || '',
      learningOutcome: ent.learningOutcome || ''
    }))
  };

  if (existingIdx >= 0) {
    STORE_REPORTS[existingIdx] = reportData;
  } else {
    STORE_REPORTS.unshift(reportData);
  }

  return res.status(201).json(new ApiResponse(201, reportData, 'Daily report submitted successfully'));
});

// =================================================================
// 6. HOMEWORK CONTROLLERS
// =================================================================

export const getHomeworkList = asyncHandler(async (req, res) => {
  const schoolId = req.schoolId || 'sch_jd_intl';
  const { date, classId, teacherId, status } = req.query;

  let hwList = STORE_HOMEWORK.filter(h => h.schoolId === schoolId);

  if (classId && classId !== 'all') hwList = hwList.filter(h => h.classId === classId);
  if (teacherId && teacherId !== 'all') hwList = hwList.filter(h => h.teacherId === teacherId);
  if (status && status !== 'all') hwList = hwList.filter(h => h.status === status);
  if (date) hwList = hwList.filter(h => h.createdAt.startsWith(date) || h.dueDate === date);

  const enrichedHw = hwList.map(hw => {
    const cls = CLASSES_LIST.find(c => c.id === hw.classId) || { name: 'Class' };
    const teacher = TEACHERS_LIST.find(t => t.id === hw.teacherId) || { name: 'Teacher', email: '' };
    return {
      ...hw,
      class: {
        id: hw.classId,
        name: cls.name,
        grade: cls.grade || '',
        section: cls.section || ''
      },
      teacher: {
        id: hw.teacherId,
        name: teacher.name,
        email: teacher.email
      }
    };
  });

  return res.status(200).json(new ApiResponse(200, enrichedHw, 'Homework assignments fetched successfully'));
});

export const createHomework = asyncHandler(async (req, res) => {
  const schoolId = req.schoolId || 'sch_jd_intl';
  const { title, description, classId, teacherId, dueDate, status = 'SENT_TO_ADMIN' } = req.body;

  if (!title || !description || !classId) {
    return res.status(400).json(new ApiResponse(400, null, 'Title, description, and class are required'));
  }

  const newHw = {
    id: `hw_${Date.now()}`,
    schoolId,
    teacherId: teacherId || 't_sharma',
    classId,
    title: title.trim(),
    description: description.trim(),
    dueDate: dueDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
    status: status || 'SENT_TO_ADMIN',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  STORE_HOMEWORK.unshift(newHw);

  const cls = CLASSES_LIST.find(c => c.id === newHw.classId) || { name: 'Class' };
  const teacher = TEACHERS_LIST.find(t => t.id === newHw.teacherId) || { name: 'Teacher', email: '' };

  return res.status(201).json(
    new ApiResponse(201, {
      ...newHw,
      class: { id: cls.id, name: cls.name },
      teacher: { id: teacher.id, name: teacher.name }
    }, 'Homework created successfully')
  );
});

export const updateHomework = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const hw = STORE_HOMEWORK.find(h => h.id === id);

  if (!hw) {
    return res.status(404).json(new ApiResponse(404, null, 'Homework not found'));
  }

  Object.assign(hw, req.body, { updatedAt: new Date().toISOString() });
  return res.status(200).json(new ApiResponse(200, hw, 'Homework updated successfully'));
});

export const deleteHomework = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const idx = STORE_HOMEWORK.findIndex(h => h.id === id);

  if (idx === -1) {
    return res.status(404).json(new ApiResponse(404, null, 'Homework not found'));
  }

  STORE_HOMEWORK.splice(idx, 1);
  return res.status(200).json(new ApiResponse(200, { id }, 'Homework removed successfully'));
});

// =================================================================
// 7. PRESERVED LEGACY COMPATIBILITY CONTROLLERS
// =================================================================

export const getClassTimetable = asyncHandler(async (req, res) => {
  const className = req.query.className || 'X';
  const section = req.query.section || 'A';
  const targetName = `Class ${className}-${section}`;

  // Find class matching or default to Class X-A
  const cls = CLASSES_LIST.find(c => c.name.toLowerCase().includes(`${className.toLowerCase()}-${section.toLowerCase()}`)) || CLASSES_LIST[0];

  const activeTimetable = STORE_TIMETABLES.find(t => t.status === 'PUBLISHED') || STORE_TIMETABLES[0];
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const schedule = {};

  dayNames.forEach((dayName, idx) => {
    const dayOfWeek = idx + 1;
    const slots = (activeTimetable?.slots || [])
      .filter(s => s.classId === cls.id && s.dayOfWeek === dayOfWeek)
      .map(s => {
        const period = PERIOD_SLOTS.find(p => p.id === s.periodId) || {};
        const sub = SUBJECTS_LIST.find(item => item.id === s.subjectId) || {};
        const teacher = TEACHERS_LIST.find(t => t.id === s.teacherId) || {};
        return {
          period: period.periodNumber || 1,
          time: period.time || '',
          subject: sub.name || '',
          teacher: teacher.name || '',
          room: ''
        };
      });
    schedule[dayName] = slots;
  });

  return res.status(200).json(
    new ApiResponse(200, {
      className,
      section,
      periodSlots: PERIOD_SLOTS,
      schedule
    }, 'Timetable fetched successfully')
  );
});

export const getTeacherSubstitutions = asyncHandler(async (req, res) => {
  const date = req.query.date || new Date().toISOString().split('T')[0];

  const absentTeachers = STORE_ATTENDANCE
    .filter(a => a.date === date && a.status === 'ABSENT')
    .map(att => {
      const t = TEACHERS_LIST.find(item => item.id === att.teacherId) || { name: att.teacherId };
      return {
        id: att.id,
        name: t.name,
        code: `EMP-${t.id}`,
        department: 'Academics',
        leaveType: att.reason || 'Casual Leave',
        affectedPeriods: (STORE_TIMETABLES[0]?.slots || [])
          .filter(s => s.teacherId === att.teacherId && s.dayOfWeek === 1)
          .map(s => {
            const p = PERIOD_SLOTS.find(item => item.id === s.periodId) || {};
            const sub = SUBJECTS_LIST.find(item => item.id === s.subjectId) || {};
            const c = CLASSES_LIST.find(item => item.id === s.classId) || {};
            return {
              period: p.periodNumber,
              time: p.time,
              class: c.name,
              subject: sub.name
            };
          })
      };
    });

  const freeTeachers = TEACHERS_LIST.filter(t => !absentTeachers.some(a => a.name === t.name)).map(t => ({
    id: t.id,
    name: t.name,
    department: 'Teaching',
    freePeriods: [2, 4, 6, 8]
  }));

  const activeSubstitutions = STORE_REPLACEMENTS.filter(r => r.date === date).map(r => {
    const orig = TEACHERS_LIST.find(t => t.id === r.originalTeacherId) || { name: r.originalTeacherId };
    const repl = TEACHERS_LIST.find(t => t.id === r.replacementTeacherId) || { name: r.replacementTeacherId };
    const p = PERIOD_SLOTS.find(item => item.id === r.periodId) || {};
    const c = CLASSES_LIST.find(item => item.id === r.classId) || {};
    return {
      id: r.id,
      date: r.date,
      absentTeacher: orig.name,
      period: p.periodNumber || 1,
      time: p.time || '',
      class: c.name || r.classId,
      subject: 'Substitution Class',
      assignedSubstitute: repl.name,
      status: r.status,
      notifiedAt: r.notifiedAt
    };
  });

  return res.status(200).json(
    new ApiResponse(200, {
      date,
      absentTeachers,
      freeTeachers,
      activeSubstitutions
    }, 'Substitutions data fetched successfully')
  );
});

export const assignSubstitution = asyncHandler(async (req, res) => {
  const { absentTeacher, period, time, className, subject, assignedSubstitute } = req.body;

  const newSub = {
    id: `sub_${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    absentTeacher: absentTeacher || 'Absent Teacher',
    period: period || 1,
    time: time || '08:45 AM - 09:30 AM',
    class: className || 'Class X-A',
    subject: subject || 'General Substitution',
    assignedSubstitute: assignedSubstitute || 'Substitute',
    status: 'Assigned',
    notifiedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  return res.status(201).json(
    new ApiResponse(201, newSub, 'Substitute teacher assigned successfully and notification dispatched')
  );
});
