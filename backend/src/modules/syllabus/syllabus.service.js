import { randomUUID } from 'crypto';
import { loadJson, saveJson } from '../../core/utils/localStore.js';
import {
  classesStore,
  subjectsStore,
  subjectLinksStore,
} from '../academics/academics.controller.js';
import { usersList } from '../user-management/user-management.controller.js';
import {
  ANNEXURE_I_TOPICS,
  ANNEXURE_II_TOPICS,
  ANNEXURE_III_TOPICS,
  ACADEMIC_ACTIVITIES,
  DOMAIN_INFO,
  CPD_STANDARDS,
  getIndianHolidaysInRange,
} from './syllabus.constants.js';

const STORE_FILENAME = 'syllabus_tracker.json';

function uid(prefix = 'syl') {
  return `${prefix}_${randomUUID().slice(0, 8)}`;
}

function normStr(val) {
  return String(val || '')
    .replace(/^\[\d+\]\s*/i, '')
    .replace(/^(mr\.|mrs\.|ms\.|dr\.|prof\.)\s*/i, '')
    .trim()
    .toLowerCase();
}

function readRootStore() {
  const data = loadJson(STORE_FILENAME, { tenants: {} });
  if (!data || typeof data !== 'object') return { tenants: {} };
  if (!data.tenants || typeof data.tenants !== 'object') data.tenants = {};
  return data;
}

function writeRootStore(store) {
  saveJson(STORE_FILENAME, store);
}

// =====================================================================
// CHAPTER PROGRESS & PACING HELPERS
// =====================================================================
export function computeChapterProgressFields(row) {
  const t = Boolean(row?.teachingCompleted);
  const q = Boolean(row?.qaCompleted);
  const c = Boolean(row?.copyCheckedCompleted);
  const doneCount = (t ? 1 : 0) + (q ? 1 : 0) + (c ? 1 : 0);
  const completionPercentage = doneCount === 0 ? 0 : doneCount === 1 ? 33 : doneCount === 2 ? 67 : 100;
  const status = doneCount === 0 ? 'PENDING' : doneCount === 3 ? 'COMPLETED' : 'IN_PROGRESS';
  return {
    teachingCompleted: t,
    qaCompleted: q,
    copyCheckedCompleted: c,
    completionPercentage,
    status,
  };
}

export function classifyVelocity(actualPct, targetPct, settings = {}) {
  const onPaceMinDelta = Number.isFinite(Number(settings.onPaceMinDelta)) ? Number(settings.onPaceMinDelta) : -5;
  const aheadMinDelta = Number.isFinite(Number(settings.aheadMinDelta)) ? Number(settings.aheadMinDelta) : 5;
  const paceDelta = Math.round((Number(actualPct || 0) - Number(targetPct || 0)) * 10) / 10;
  let velocityStatus = 'ON_PACE';
  if (paceDelta >= aheadMinDelta) velocityStatus = 'AHEAD';
  else if (paceDelta < onPaceMinDelta) velocityStatus = 'BEHIND';
  return { paceDelta, velocityStatus };
}

// =====================================================================
// ACADEMIC TIMELINE WORKING DAYS ENGINE
// =====================================================================
function parseDateOnly(dateStr) {
  if (!dateStr) return null;
  const iso = String(dateStr).slice(0, 10);
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(Date.UTC(y, m - 1, d));
}

function formatDateUtc(dt) {
  const y = dt.getUTCFullYear();
  const m = String(dt.getUTCMonth() + 1).padStart(2, '0');
  const d = String(dt.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function computeTermStats(term) {
  if (!term || !term.startDate || !term.endDate) return null;
  const start = parseDateOnly(term.startDate);
  const end = parseDateOnly(term.endDate);
  if (!start || !end || end < start) return null;

  const weeklyHolidays = Array.isArray(term.weeklyHolidays) ? term.weeklyHolidays.map(Number) : [0];
  const holidayDatesMap = new Map();
  if (Array.isArray(term.holidayDates)) {
    term.holidayDates.forEach((h) => {
      if (h?.date) {
        holidayDatesMap.set(String(h.date).slice(0, 10), {
          date: String(h.date).slice(0, 10),
          name: h.name || 'Holiday',
          isRemoved: Boolean(h.isRemoved),
          type: h.type || 'CUSTOM',
        });
      }
    });
  }

  // Merge Indian public holidays if enabled and not explicitly removed
  const indianList = term.includeIndianHolidays
    ? getIndianHolidaysInRange(formatDateUtc(start), formatDateUtc(end))
    : [];
  const indianMap = new Map(indianList.map((h) => [h.date, h.name]));

  // Build vacation lookup
  const vacations = Array.isArray(term.vacationPeriods) ? term.vacationPeriods : [];
  const isVacationDay = (dateIso) => {
    for (const v of vacations) {
      const vs = String(v.startDate || '').slice(0, 10);
      const ve = String(v.endDate || '').slice(0, 10);
      if (vs && ve && dateIso >= vs && dateIso <= ve) return v.name || 'Vacation';
    }
    return null;
  };

  const today = new Date();
  const todayUtc = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
  const todayIso = formatDateUtc(todayUtc);

  let totalDays = 0;
  let holidayDays = 0;
  let vacationDays = 0;
  let effectiveWorkingDays = 0;
  let elapsedWorkingDays = 0;
  let remainingWorkingDays = 0;

  const calendarDays = [];

  for (let dt = new Date(start.getTime()); dt <= end; dt.setUTCDate(dt.getUTCDate() + 1)) {
    totalDays += 1;
    const iso = formatDateUtc(dt);
    const dow = dt.getUTCDay();
    const override = holidayDatesMap.get(iso);
    const vacName = isVacationDay(iso);

    let dayKind = 'WORKING';
    let label = '';

    if (vacName) {
      dayKind = 'VACATION';
      label = vacName;
      vacationDays += 1;
    } else if (override) {
      if (!override.isRemoved) {
        dayKind = 'HOLIDAY';
        label = override.name || 'Declared Holiday';
        holidayDays += 1;
      } else {
        effectiveWorkingDays += 1;
        if (iso <= todayIso) elapsedWorkingDays += 1;
        else remainingWorkingDays += 1;
      }
    } else if (indianMap.has(iso)) {
      dayKind = 'INDIAN_HOLIDAY';
      label = indianMap.get(iso);
      holidayDays += 1;
    } else if (weeklyHolidays.includes(dow)) {
      dayKind = 'WEEKLY_OFF';
      label = dow === 0 ? 'Sunday' : dow === 6 ? 'Saturday' : 'Weekly Off';
      holidayDays += 1;
    } else {
      effectiveWorkingDays += 1;
      if (iso <= todayIso) elapsedWorkingDays += 1;
      else remainingWorkingDays += 1;
    }

    calendarDays.push({ date: iso, dow, dayKind, label });
  }

  let status = 'ACTIVE';
  if (todayIso < formatDateUtc(start)) status = 'UPCOMING';
  else if (todayIso > formatDateUtc(end)) status = 'COMPLETED';

  const timeProgressPercentage =
    effectiveWorkingDays > 0
      ? Math.min(100, Math.round((elapsedWorkingDays / effectiveWorkingDays) * 1000) / 10)
      : 0;

  return {
    ...term,
    status,
    totalDays,
    holidayDays,
    vacationDays,
    effectiveWorkingDays,
    elapsedWorkingDays,
    remainingWorkingDays,
    timeProgressPercentage,
    indianHolidaysDetected: indianList,
    calendarDays,
  };
}

// =====================================================================
// CPD 50-HOUR COMPLIANCE ENGINE
// =====================================================================
export function computeTeacherCpdSummary(teacher, records = []) {
  const verified = records.filter((r) => r.status === 'VERIFIED');
  const pendingCount = records.filter((r) => r.status === 'SUBMITTED').length;

  let cbseRaw = 0;
  let schoolRaw = 0;
  let d1Raw = 0;
  let d2Raw = 0;
  let d3TrainingRaw = 0;
  let academicActRaw = 0;

  for (const r of verified) {
    const hrs = Number(r.hours || 0);
    if (r.provider === 'CBSE') cbseRaw += hrs;
    else schoolRaw += hrs;

    if (r.domain === 'CORE_VALUES_ETHICS') d1Raw += hrs;
    else if (r.domain === 'KNOWLEDGE_PRACTICE') d2Raw += hrs;
    else {
      if (r.annexure === 'ACADEMIC_ACTIVITY') academicActRaw += hrs;
      else d3TrainingRaw += hrs;
    }
  }

  const effectiveCbseHours = Math.min(CPD_STANDARDS.cbseQuotaRequired, Math.round(cbseRaw * 10) / 10);
  const effectiveSchoolHours = Math.min(CPD_STANDARDS.schoolQuotaRequired, Math.round(schoolRaw * 10) / 10);
  const effectiveProviderHours = effectiveCbseHours + effectiveSchoolHours;

  const effectiveAcademicAct = Math.min(11, academicActRaw);
  const d3CombinedRaw = d3TrainingRaw + effectiveAcademicAct;

  const d1Effective = Math.min(12, Math.round(d1Raw * 10) / 10);
  const d2Effective = Math.min(24, Math.round(d2Raw * 10) / 10);
  const d3Effective = Math.min(14, Math.round(d3CombinedRaw * 10) / 10);
  const effectiveDomainHours = d1Effective + d2Effective + d3Effective;

  const effectiveTotalHours = Math.round(Math.min(effectiveProviderHours, effectiveDomainHours) * 10) / 10;
  const totalRawHours = Math.round((cbseRaw + schoolRaw) * 10) / 10;

  const compliant =
    cbseRaw >= 25 &&
    schoolRaw >= 25 &&
    d1Raw >= 12 &&
    d2Raw >= 24 &&
    d3CombinedRaw >= 14;

  const complianceStatus = compliant
    ? 'COMPLIANT'
    : totalRawHours > 0
      ? 'IN_PROGRESS'
      : 'NON_COMPLIANT';

  return {
    teacherId: teacher.id,
    empCode: teacher.empCode || '',
    name: teacher.name,
    email: teacher.email || '',
    phone: teacher.phone || '',
    designation: teacher.designation || 'Faculty',
    subjectNames: teacher.subjectNames || [],
    classesAssigned: teacher.classNames || [],
    totalRawHours,
    effectiveTotalHours,
    totalTarget: 50,
    cbseHours: Math.round(cbseRaw * 10) / 10,
    effectiveCbseHours,
    cbseTarget: 25,
    schoolHours: Math.round(schoolRaw * 10) / 10,
    effectiveSchoolHours,
    schoolTarget: 25,
    domain1Hours: Math.round(d1Raw * 10) / 10,
    domain1Effective: d1Effective,
    domain1Target: 12,
    domain2Hours: Math.round(d2Raw * 10) / 10,
    domain2Effective: d2Effective,
    domain2Target: 24,
    domain3Hours: Math.round(d3CombinedRaw * 10) / 10,
    domain3Effective: d3Effective,
    domain3Target: 14,
    academicActivityHours: Math.round(academicActRaw * 10) / 10,
    effectiveAcademicActivityHours: Math.round(effectiveAcademicAct * 10) / 10,
    academicActivityCap: 11,
    complianceStatus,
    pendingCount,
    recordCount: records.length,
    verifiedCount: verified.length,
    records,
  };
}

// =====================================================================
// SEED DATA BUILDERS (STRICTLY TENANT-ISOLATED)
// =====================================================================
function buildDemoChaptersForSubject(subjectName) {
  const key = subjectName.toLowerCase();
  if (key.includes('math')) {
    return [
      { no: 1, name: 'Real Numbers', termTag: 'Term 1' },
      { no: 2, name: 'Polynomials', termTag: 'Term 1' },
      { no: 3, name: 'Pair of Linear Equations in Two Variables', termTag: 'Term 1' },
      { no: 4, name: 'Quadratic Equations', termTag: 'Term 1' },
      { no: 5, name: 'Arithmetic Progressions', termTag: 'Term 2' },
      { no: 6, name: 'Triangles & Similarity', termTag: 'Term 2' },
      { no: 7, name: 'Coordinate Geometry', termTag: 'Term 2' },
      { no: 8, name: 'Introduction to Trigonometry', termTag: 'Term 2' },
    ];
  }
  if (key.includes('hindi')) {
    return [
      { no: 1, name: 'सूरदास के पद (काव्य खंड)', termTag: 'Term 1' },
      { no: 2, name: 'राम-लक्ष्मण-परशुराम संवाद', termTag: 'Term 1' },
      { no: 3, name: 'नेताजी का चश्मा (गद्य खंड)', termTag: 'Term 1' },
      { no: 4, name: 'बालगोबिन भगत', termTag: 'Term 2' },
      { no: 5, name: 'माता का अँचल (कृतिका)', termTag: 'Term 2' },
      { no: 6, name: 'व्याकरण: रचना के आधार पर वाक्य भेद', termTag: 'Term 2' },
    ];
  }
  if (key.includes('social')) {
    return [
      { no: 1, name: 'The Rise of Nationalism in Europe', termTag: 'Term 1' },
      { no: 2, name: 'Resources and Development', termTag: 'Term 1' },
      { no: 3, name: 'Power Sharing & Federalism', termTag: 'Term 1' },
      { no: 4, name: 'Nationalism in India', termTag: 'Term 2' },
      { no: 5, name: 'Sectors of the Indian Economy', termTag: 'Term 2' },
      { no: 6, name: 'Money and Credit', termTag: 'Term 2' },
    ];
  }
  if (key.includes('english')) {
    return [
      { no: 1, name: 'A Letter to God & Dust of Snow', termTag: 'Term 1' },
      { no: 2, name: 'Nelson Mandela: Long Walk to Freedom', termTag: 'Term 1' },
      { no: 3, name: 'Two Stories about Flying', termTag: 'Term 1' },
      { no: 4, name: 'From the Diary of Anne Frank', termTag: 'Term 2' },
      { no: 5, name: 'Glimpses of India', termTag: 'Term 2' },
      { no: 6, name: 'Madam Rides the Bus', termTag: 'Term 2' },
    ];
  }
  if (key.includes('science') || key.includes('physics') || key.includes('chem') || key.includes('bio')) {
    return [
      { no: 1, name: 'Chemical Reactions and Equations', termTag: 'Term 1' },
      { no: 2, name: 'Acids, Bases and Salts', termTag: 'Term 1' },
      { no: 3, name: 'Life Processes', termTag: 'Term 1' },
      { no: 4, name: 'Light - Reflection and Refraction', termTag: 'Term 2' },
      { no: 5, name: 'Electricity & Magnetic Effects', termTag: 'Term 2' },
    ];
  }
  return [
    { no: 1, name: `${subjectName}: Foundations & Core Concepts`, termTag: 'Term 1' },
    { no: 2, name: `${subjectName}: Intermediate Applications`, termTag: 'Term 1' },
    { no: 3, name: `${subjectName}: Problem Solving & Analysis`, termTag: 'Term 2' },
    { no: 4, name: `${subjectName}: Revision & Assessment Readiness`, termTag: 'Term 2' },
  ];
}

function buildDemoSeedForSchool(schoolId) {
  const isJd = schoolId === 'sch_jd_intl';
  const schoolDisplayName = isJd ? 'J.D. INTERNATIONAL SCHOOL' : 'DELHI PUBLIC SCHOOL - BRANCH 2';

  const sessPrevId = `${schoolId}_sess_25_26`;
  const sessActiveId = `${schoolId}_sess_26_27`;

  const sessions = [
    { id: sessPrevId, name: '2025-26', isActive: false, isArchived: true, createdAt: '2025-04-01T00:00:00Z' },
    { id: sessActiveId, name: '2026-27', isActive: true, isArchived: false, createdAt: '2026-04-01T00:00:00Z' },
  ];

  // Classes linked cleanly to ERP class structure (including Priti Verma's Classes III-A, IV-A & X-A)
  const demoClassDefs = isJd
    ? [
        { id: 'cls_3a', name: 'Class III', section: 'A', label: 'Class III - A' },
        { id: 'cls_4a', name: 'Class IV', section: 'A', label: 'Class IV - A' },
        { id: 'cls_9a', name: 'Class IX', section: 'A', label: 'Class IX - A' },
        { id: 'cls_10a', name: 'Class X', section: 'A', label: 'Class X - A' },
      ]
    : [
        { id: 'cls_b2_8a', name: 'Class VIII', section: 'A', label: 'Class VIII - A' },
        { id: 'cls_b2_10a', name: 'Class X', section: 'A', label: 'Class X - A' },
      ];

  const classes = [
    ...demoClassDefs.map((c) => ({ ...c, sessionId: sessActiveId })),
    ...demoClassDefs.slice(0, 2).map((c) => ({ ...c, id: `${c.id}_prev`, sessionId: sessPrevId })),
  ];

  // Teachers synced from ERP user-management
  const teachers = isJd
    ? [
        { id: '3', empCode: '102', name: 'Priti Verma', email: 'priti.verma@jdintl.edu', phone: '9414056789', designation: 'Primary & Secondary Teacher' },
        { id: '1', empCode: '301', name: 'Pooja Kanwar', email: 'pooja.kanwar@jdintl.edu', phone: '9876543210', designation: 'PRT Faculty' },
        { id: 'f_101', empCode: '101', name: 'Abhilasha Bhatt', email: 'abhilasha.bhatt@jdintl.edu', phone: '9829011101', designation: 'TGT Faculty' },
        { id: 'f_201', empCode: '201', name: 'Monika Rani Verma', email: 'monika.verma@jdintl.edu', phone: '9829011201', designation: 'PGT Mathematics' },
        { id: 'f_204', empCode: '204', name: 'Dr. Arun Joshi', email: 'arun.joshi@jdintl.edu', phone: '9829011204', designation: 'PGT Senior Science' },
        { id: 'f_205', empCode: '205', name: 'Mr. Rakesh Sharma', email: 'rakesh.sharma@jdintl.edu', phone: '9829011205', designation: 'PGT Senior Mathematics' },
      ]
    : [
        { id: 'usr_staff_dps_301', empCode: '301', name: 'Rajesh Gupta', email: 'rajesh.gupta@dpsb2.edu', phone: '9811000301', designation: 'Senior Science Faculty' },
        { id: 'dps_t2', empCode: '302', name: 'Meenakshi Nair', email: 'meenakshi@dpsb2.edu', phone: '9811000302', designation: 'PGT Mathematics' },
      ];

  const classSubjects = isJd
    ? [
        { id: 'cs_3a_hin', sessionId: sessActiveId, classId: 'cls_3a', className: 'Class III - A', subjectId: 'sub_hin', subjectName: 'Hindi', subjectCode: 'HIN', teacherId: '3', teacherName: 'Priti Verma' },
        { id: 'cs_3a_sst', sessionId: sessActiveId, classId: 'cls_3a', className: 'Class III - A', subjectId: 'sub_sst', subjectName: 'Social Science', subjectCode: 'SST', teacherId: '3', teacherName: 'Priti Verma' },
        { id: 'cs_4a_hin', sessionId: sessActiveId, classId: 'cls_4a', className: 'Class IV - A', subjectId: 'sub_hin', subjectName: 'Hindi', subjectCode: 'HIN', teacherId: '3', teacherName: 'Priti Verma' },
        { id: 'cs_4a_eng', sessionId: sessActiveId, classId: 'cls_4a', className: 'Class IV - A', subjectId: 'sub_eng', subjectName: 'English', subjectCode: 'ENG', teacherId: '1', teacherName: 'Pooja Kanwar' },
        { id: 'cs_9a_math', sessionId: sessActiveId, classId: 'cls_9a', className: 'Class IX - A', subjectId: 'sub_math', subjectName: 'Mathematics', subjectCode: '041', teacherId: 'f_201', teacherName: 'Monika Rani Verma' },
        { id: 'cs_9a_sci', sessionId: sessActiveId, classId: 'cls_9a', className: 'Class IX - A', subjectId: 'sub_sci', subjectName: 'Science', subjectCode: '086', teacherId: 'f_204', teacherName: 'Dr. Arun Joshi' },
        { id: 'cs_10a_math', sessionId: sessActiveId, classId: 'cls_10a', className: 'Class X - A', subjectId: 'sub_math', subjectName: 'Mathematics', subjectCode: '041', teacherId: 'f_205', teacherName: 'Mr. Rakesh Sharma' },
        { id: 'cs_10a_sst', sessionId: sessActiveId, classId: 'cls_10a', className: 'Class X - A', subjectId: 'sub_sst', subjectName: 'Social Science', subjectCode: '087', teacherId: '3', teacherName: 'Priti Verma' },
        { id: 'cs_10a_eng', sessionId: sessActiveId, classId: 'cls_10a', className: 'Class X - A', subjectId: 'sub_eng', subjectName: 'English', subjectCode: '184', teacherId: 'f_101', teacherName: 'Abhilasha Bhatt' },
      ]
    : [
        { id: 'cs_b2_8a_sci', sessionId: sessActiveId, classId: 'cls_b2_8a', className: 'Class VIII - A', subjectId: 'sub_sci', subjectName: 'Science', subjectCode: 'SCI', teacherId: 'usr_staff_dps_301', teacherName: 'Rajesh Gupta' },
        { id: 'cs_b2_10a_math', sessionId: sessActiveId, classId: 'cls_b2_10a', className: 'Class X - A', subjectId: 'sub_math', subjectName: 'Mathematics', subjectCode: '041', teacherId: 'dps_t2', teacherName: 'Meenakshi Nair' },
      ];

  const chapters = [];
  const topics = [];
  const chapterProgress = [];
  const recentUpdates = [];

  classSubjects.forEach((cs, csIdx) => {
    const chDefs = buildDemoChaptersForSubject(cs.subjectName);
    chDefs.forEach((cd, chIdx) => {
      const chId = `${cs.id}_ch_${cd.no}`;
      chapters.push({
        id: chId,
        sessionId: sessActiveId,
        classSubjectId: cs.id,
        classId: cs.classId,
        subjectId: cs.subjectId,
        chapterNo: cd.no,
        name: cd.name,
        termTag: cd.termTag,
        description: `${cs.subjectName} Chapter ${cd.no} for ${cs.className}`,
        createdAt: '2026-04-05T09:00:00Z',
      });

      // Realistic staggered progress across classes/teachers
      const teachingCompleted = chIdx < (csIdx % 3) + 2;
      const qaCompleted = chIdx < (csIdx % 3) + 1;
      const copyCheckedCompleted = chIdx < (csIdx % 2) + 1;
      const progFields = computeChapterProgressFields({
        teachingCompleted,
        qaCompleted,
        copyCheckedCompleted,
      });

      chapterProgress.push({
        id: `prog_${chId}`,
        chapterId: chId,
        sessionId: sessActiveId,
        teacherId: cs.teacherId,
        teacherName: cs.teacherName,
        ...progFields,
        updatedAt: '2026-10-18T10:30:00Z',
      });

      if (chIdx === 0) {
        recentUpdates.push({
          id: `upd_${chId}`,
          teacherName: cs.teacherName,
          className: cs.className,
          subjectName: cs.subjectName,
          chapterName: cd.name,
          status: progFields.status,
          completionPercentage: progFields.completionPercentage,
          updatedAt: '2026-10-18T10:30:00Z',
        });
      }
    });
  });

  // Also add 2 sample archived session subjects & chapters so Post-Session Import can be tested right away!
  const prevCs = {
    id: `${sessPrevId}_cs_10a_math`,
    sessionId: sessPrevId,
    classId: classes.find((c) => c.sessionId === sessPrevId)?.id || 'cls_prev_1',
    className: 'Class X - A',
    subjectId: 'sub_math',
    subjectName: 'Mathematics',
    subjectCode: '041',
    teacherId: teachers[0].id,
    teacherName: teachers[0].name,
  };
  classSubjects.push(prevCs);
  chapters.push({
    id: `${prevCs.id}_ch1`,
    sessionId: sessPrevId,
    classSubjectId: prevCs.id,
    classId: prevCs.classId,
    subjectId: prevCs.subjectId,
    chapterNo: 1,
    name: 'Real Numbers (2025-26 Archive)',
    termTag: 'Term 1',
    description: 'Archived session syllabus reference',
  });

  const academicTerms = [
    {
      id: `${schoolId}_term_26_27`,
      sessionId: sessActiveId,
      name: 'Academic Session 2026-27 Calendar',
      startDate: '2026-04-01',
      endDate: '2027-03-20',
      weeklyHolidays: [0],
      includeIndianHolidays: true,
      holidayDates: [
        { date: '2026-07-04', name: 'Rath Yatra / Founders Day', isRemoved: false, type: 'CUSTOM' },
      ],
      vacationPeriods: [
        { id: uid('vac'), name: 'Summer Vacation', startDate: '2026-05-18', endDate: '2026-06-27' },
        { id: uid('vac'), name: 'Diwali Break', startDate: '2026-11-06', endDate: '2026-11-12' },
        { id: uid('vac'), name: 'Winter Vacation', startDate: '2026-12-26', endDate: '2027-01-04' },
      ],
      terms: [
        { id: uid('subterm'), name: 'Term 1 (Half Yearly)', startDate: '2026-04-01', endDate: '2026-09-30' },
        { id: uid('subterm'), name: 'Term 2 (Annual)', startDate: '2026-10-01', endDate: '2027-03-20' },
      ],
    },
  ];

  const examNames = ['Unit Test 1', 'Half Yearly (Term 1)', 'Pre-Board', 'Annual Exam (Term 2)'];

  const examTemplate = {
    schoolName: schoolDisplayName,
    logoUrl: '',
    defaultTemplateType: 'SINGLE',
    defaultFontFamily: 'Times New Roman',
    defaultFontSize: '11pt',
    defaultColor: '#0f172a',
    showTeacherName: true,
    headerSubtitle: 'CBSE Affiliated Senior Secondary Institution',
  };

  const examPapers = [
    {
      id: `${schoolId}_ep_1`,
      sessionId: sessActiveId,
      teacherId: teachers[0].id,
      teacherName: teachers[0].name,
      classId: demoClassDefs[0].id,
      className: demoClassDefs[0].label,
      subjectId: 'sub_hin',
      subjectName: isJd ? 'Hindi' : 'Science',
      examName: 'Half Yearly (Term 1)',
      examDate: '2026-09-22',
      duration: 180,
      totalMarks: 20,
      templateType: 'SINGLE',
      styleFontFamily: 'Times New Roman',
      styleFontSize: '11pt',
      styleColor: '#0f172a',
      showTeacherName: true,
      status: 'SUBMITTED',
      driveSynced: false,
      instructions: '1. All questions are compulsory.\n2. Marks are indicated against each question.\n3. Write neat and legible answers.',
      sections: [
        {
          sectionTitle: 'Section A',
          sectionDescription: 'Objective & Multiple Choice Questions',
          segments: [
            {
              label: 'Multiple Choice Questions',
              type: 'MCQ',
              questionCount: 2,
              marksPerQuestion: 1,
            },
          ],
          questions: [
            {
              segmentType: 'MCQ',
              segmentLabel: 'Multiple Choice Questions',
              marks: 1,
              questionText: isJd ? 'सूरदास के पदों में मुख्य रस कौन-सा है?' : 'Which SI unit measures electric current?',
              options: isJd
                ? [
                    { text: 'वात्सल्य एवं शृंगार रस', isCorrect: true },
                    { text: 'वीर रस', isCorrect: false },
                    { text: 'भयानक रस', isCorrect: false },
                    { text: 'हास्य रस', isCorrect: false },
                  ]
                : [
                    { text: 'Ampere (A)', isCorrect: true },
                    { text: 'Volt (V)', isCorrect: false },
                    { text: 'Ohm (Ω)', isCorrect: false },
                    { text: 'Watt (W)', isCorrect: false },
                  ],
              alternatives: [],
            },
            {
              segmentType: 'MCQ',
              segmentLabel: 'Multiple Choice Questions',
              marks: 1,
              questionText: isJd ? '‘नेताजी का चश्मा’ पाठ के लेखक कौन हैं?' : 'What is the chemical formula of Calcium Carbonate?',
              options: isJd
                ? [
                    { text: 'स्वयं प्रकाश', isCorrect: true },
                    { text: 'प्रेमचंद', isCorrect: false },
                    { text: 'रामवृक्ष बेनीपुरी', isCorrect: false },
                    { text: 'यशपाल', isCorrect: false },
                  ]
                : [
                    { text: 'CaCO₃', isCorrect: true },
                    { text: 'Ca(OH)₂', isCorrect: false },
                    { text: 'CaO', isCorrect: false },
                    { text: 'Na₂CO₃', isCorrect: false },
                  ],
              alternatives: [],
            },
          ],
        },
        {
          sectionTitle: 'Section B',
          sectionDescription: 'Short & Long Answer Questions',
          segments: [
            {
              label: 'Short Answer Questions',
              type: 'SHORT_ANSWER',
              questionCount: 2,
              marksPerQuestion: 4,
            },
            {
              label: 'Long Answer Question',
              type: 'LONG_ANSWER',
              questionCount: 2,
              marksPerQuestion: 5,
            },
          ],
          questions: [
            {
              segmentType: 'SHORT_ANSWER',
              segmentLabel: 'Short Answer Questions',
              marks: 4,
              questionText: isJd
                ? 'गोपियों द्वारा उद्धव को भाग्यवान कहने में क्या व्यंग्य निहित है?'
                : 'State Ohm’s Law and draw a labelled circuit diagram to verify $V = IR$.',
              options: [],
              alternatives: [],
            },
            {
              segmentType: 'SHORT_ANSWER',
              segmentLabel: 'Short Answer Questions',
              marks: 4,
              questionText: isJd
                ? 'कैप्टन के प्रति पानवाले के मन में क्या भाव थे? स्पष्ट कीजिए।'
                : 'Differentiate between aerobic and anaerobic respiration with balanced equations.',
              options: [],
              alternatives: [],
            },
            {
              segmentType: 'LONG_ANSWER',
              segmentLabel: 'Long Answer Question',
              marks: 5,
              questionText: isJd
                ? '‘माता का अँचल’ पाठ के आधार पर ग्रामीण जीवन के चित्रण का वर्णन कीजिए।'
                : 'Explain the human excretory system with structure and function of a nephron.',
              options: [],
              alternatives: [
                {
                  segmentType: 'LONG_ANSWER',
                  questionText: isJd
                    ? 'बालगोबिन भगत के जीवन मूल्यों पर अपने विचार लिखिए।'
                    : 'Derive the lens formula $\\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u}$ with a ray diagram.',
                  options: [],
                },
              ],
            },
            {
              segmentType: 'LONG_ANSWER',
              segmentLabel: 'Long Answer Question',
              marks: 5,
              questionText: isJd
                ? 'रचना के आधार पर वाक्य के तीनों भेद सोदाहरण स्पष्ट कीजिए।'
                : 'Solve the quadratic equation $2x^{2} - 7x + 3 = 0$ by factorization method.',
              options: [],
              alternatives: [],
            },
          ],
        },
      ],
      createdAt: '2026-09-10T11:00:00Z',
      updatedAt: '2026-09-12T15:20:00Z',
    },
    {
      id: `${schoolId}_ep_2`,
      sessionId: sessActiveId,
      teacherId: teachers[teachers.length - 1].id,
      teacherName: teachers[teachers.length - 1].name,
      classId: demoClassDefs[demoClassDefs.length - 1].id,
      className: demoClassDefs[demoClassDefs.length - 1].label,
      subjectId: 'sub_math',
      subjectName: 'Mathematics',
      examName: 'Unit Test 1',
      examDate: '2026-07-18',
      duration: 90,
      totalMarks: 25,
      templateType: 'SPLIT',
      styleFontFamily: 'Times New Roman',
      styleFontSize: '11pt',
      styleColor: '#000000',
      showTeacherName: true,
      status: 'REVIEWED',
      driveSynced: true,
      reviewedAt: '2026-07-15T10:00:00Z',
      reviewedBy: 'Principal / Academic Coordinator',
      instructions: '1. Attempt all questions neatly.\n2. Use of calculator is not permitted.',
      sections: [
        {
          sectionTitle: 'Section A',
          sectionDescription: 'Objective Type',
          segments: [{ label: 'MCQ', type: 'MCQ', questionCount: 5, marksPerQuestion: 1 }],
          questions: Array.from({ length: 5 }, (_, i) => ({
            segmentType: 'MCQ',
            segmentLabel: 'MCQ',
            marks: 1,
            questionText: `Find the ${i + 1}${i === 0 ? 'st' : 'th'} root / discriminant of quadratic expression $x^{2} - ${i + 4}x + ${i + 3} = 0$.`,
            options: [
              { text: `Option A (${i + 1})`, isCorrect: true },
              { text: `Option B (${i + 2})`, isCorrect: false },
              { text: `Option C (${i + 3})`, isCorrect: false },
              { text: `Option D (${i + 4})`, isCorrect: false },
            ],
            alternatives: [],
          })),
        },
        {
          sectionTitle: 'Section B',
          sectionDescription: 'Problem Solving',
          segments: [{ label: 'Long Answer', type: 'LONG_ANSWER', questionCount: 4, marksPerQuestion: 5 }],
          questions: [
            { segmentType: 'LONG_ANSWER', segmentLabel: 'Long Answer', marks: 5, questionText: 'Prove that $\\sqrt{5}$ is an irrational number.', options: [], alternatives: [] },
            { segmentType: 'LONG_ANSWER', segmentLabel: 'Long Answer', marks: 5, questionText: 'Find the zeroes of $6x^{2} - 3 - 7x$ and verify relationship between zeroes and coefficients.', options: [], alternatives: [] },
            { segmentType: 'LONG_ANSWER', segmentLabel: 'Long Answer', marks: 5, questionText: 'Solve graphically: $2x + y = 6$ and $2x - y = 2$.', options: [], alternatives: [] },
            { segmentType: 'LONG_ANSWER', segmentLabel: 'Long Answer', marks: 5, questionText: 'If $\\tan\\theta = \\frac{4}{3}$, find $\\frac{\\sin\\theta + \\cos\\theta}{\\sin\\theta - \\cos\\theta}$.', options: [], alternatives: [] },
          ],
        },
      ],
      createdAt: '2026-07-10T09:00:00Z',
      updatedAt: '2026-07-15T10:00:00Z',
    },
  ];

  // Teacher CPD Training Records (verified + pending approvals)
  const teacherTrainings = [
    {
      id: `${schoolId}_trg_1`,
      sessionId: sessActiveId,
      teacherId: teachers[0].id,
      teacherName: teachers[0].name,
      title: 'Ethics & Integrity',
      provider: 'CBSE',
      domain: 'CORE_VALUES_ETHICS',
      annexure: 'ANNEXURE_I',
      hours: 12,
      mode: 'OFFLINE',
      trainingDate: '2026-06-14',
      certificateNo: 'CBSE-COE-2026-1042',
      organizer: 'CBSE COE Ajmer',
      notes: 'Completed 2-day Ethics & Integrity residential workshop',
      status: 'VERIFIED',
      createdAt: '2026-06-16T09:00:00Z',
    },
    {
      id: `${schoolId}_trg_2`,
      sessionId: sessActiveId,
      teacherId: teachers[0].id,
      teacherName: teachers[0].name,
      title: 'Experiential Learning',
      provider: 'CBSE',
      domain: 'KNOWLEDGE_PRACTICE',
      annexure: 'ANNEXURE_II',
      hours: 12,
      mode: 'OFFLINE',
      trainingDate: '2026-07-20',
      certificateNo: 'CBSE-COE-2026-2189',
      organizer: 'CBSE COE Ajmer',
      notes: 'Competency & Experiential pedagogy workshop',
      status: 'VERIFIED',
      createdAt: '2026-07-22T09:00:00Z',
    },
    {
      id: `${schoolId}_trg_3`,
      sessionId: sessActiveId,
      teacherId: teachers[0].id,
      teacherName: teachers[0].name,
      title: 'National Education Policy 2020 (NEP 2020)',
      provider: 'SCHOOL',
      domain: 'PROFESSIONAL_GROWTH',
      annexure: 'ANNEXURE_III',
      hours: 6,
      mode: 'ONLINE',
      trainingDate: '2026-08-10',
      certificateNo: 'SCH-INHOUSE-089',
      organizer: schoolDisplayName,
      notes: 'In-house NEP 2020 NCF-SE alignment seminar',
      status: 'VERIFIED',
      createdAt: '2026-08-11T09:00:00Z',
    },
    {
      id: `${schoolId}_trg_4`,
      sessionId: sessActiveId,
      teacherId: teachers[0].id,
      teacherName: teachers[0].name,
      title: 'Active Learning & Art Integration',
      provider: 'SAHODAYA',
      domain: 'KNOWLEDGE_PRACTICE',
      annexure: 'ANNEXURE_II',
      hours: 6,
      mode: 'OFFLINE',
      trainingDate: '2026-09-05',
      certificateNo: 'SAH-2026-441',
      organizer: 'Sahodaya School Complex',
      notes: 'Pending coordinator certificate verification',
      status: 'SUBMITTED',
      createdAt: '2026-09-06T12:00:00Z',
    },
    {
      id: `${schoolId}_trg_5`,
      sessionId: sessActiveId,
      teacherId: teachers[1]?.id || teachers[0].id,
      teacherName: teachers[1]?.name || teachers[0].name,
      title: 'Inclusive Education & Values Education',
      provider: 'CBSE',
      domain: 'CORE_VALUES_ETHICS',
      annexure: 'ANNEXURE_I',
      hours: 12,
      mode: 'OFFLINE',
      trainingDate: '2026-06-25',
      certificateNo: 'CBSE-2026-3310',
      organizer: 'CBSE COE',
      notes: 'Full Domain 1 compliance fulfilled',
      status: 'VERIFIED',
      createdAt: '2026-06-26T09:00:00Z',
    },
    {
      id: `${schoolId}_trg_6`,
      sessionId: sessActiveId,
      teacherId: teachers[1]?.id || teachers[0].id,
      teacherName: teachers[1]?.name || teachers[0].name,
      title: 'Use of Artificial Intelligence in Classrooms',
      provider: 'SCHOOL',
      domain: 'KNOWLEDGE_PRACTICE',
      annexure: 'ANNEXURE_II',
      hours: 6,
      mode: 'ONLINE',
      trainingDate: '2026-09-18',
      certificateNo: 'AI-EDU-092',
      organizer: schoolDisplayName,
      notes: 'Submitted for Admin approval',
      status: 'SUBMITTED',
      createdAt: '2026-09-19T14:00:00Z',
    },
  ];

  return {
    schoolId,
    sessions,
    activeSessionId: sessActiveId,
    classes,
    teachers,
    classSubjects,
    chapters,
    topics,
    chapterProgress,
    academicTerms,
    examNames,
    examTemplate,
    examPapers,
    teacherTrainings,
    pacingSettings: { onPaceMinDelta: -5, aheadMinDelta: 5 },
    recentUpdates,
  };
}

function buildEmptyTenantState(schoolId) {
  const sessActiveId = `${schoolId}_sess_26_27`;
  return {
    schoolId,
    sessions: [
      { id: sessActiveId, name: '2026-27', isActive: true, isArchived: false, createdAt: new Date().toISOString() },
    ],
    activeSessionId: sessActiveId,
    classes: [],
    teachers: [],
    classSubjects: [],
    chapters: [],
    topics: [],
    chapterProgress: [],
    academicTerms: [],
    examNames: ['Unit Test 1', 'Half Yearly (Term 1)', 'Pre-Board', 'Annual Exam (Term 2)'],
    examTemplate: {
      schoolName: 'SCHOOL ACADEMIC PORTAL',
      logoUrl: '',
      defaultTemplateType: 'SINGLE',
      defaultFontFamily: 'Times New Roman',
      defaultFontSize: '11pt',
      defaultColor: '#0f172a',
      showTeacherName: true,
      headerSubtitle: '',
    },
    examPapers: [],
    teacherTrainings: [],
    pacingSettings: { onPaceMinDelta: -5, aheadMinDelta: 5 },
    recentUpdates: [],
  };
}

function getTenantState(schoolId) {
  const id = schoolId || 'sch_jd_intl';
  const root = readRootStore();
  if (!root.tenants[id]) {
    const isDemo = id === 'sch_jd_intl' || id === 'sch_dps_branch2';
    root.tenants[id] = isDemo ? buildDemoSeedForSchool(id) : buildEmptyTenantState(id);
    writeRootStore(root);
  }
  return { root, tenant: root.tenants[id] };
}

function resolveEffectiveSessionId(tenant, requestedSessionId) {
  if (requestedSessionId && tenant.sessions.some((s) => s.id === requestedSessionId)) {
    return requestedSessionId;
  }
  const active = tenant.sessions.find((s) => s.isActive);
  return active?.id || tenant.sessions[0]?.id || null;
}

// Merge live ERP Master classes, subjects & teachers into lookups
function getMergedErpEntities(tenant, schoolId, sessionId) {
  // 1. ERP Classes
  const sessionClasses = tenant.classes.filter((c) => c.sessionId === sessionId);
  const erpClasses = schoolId === 'sch_jd_intl' ? classesStore || [] : [];
  const mergedClasses = [...sessionClasses];
  erpClasses.forEach((ec) => {
    const secs = Array.isArray(ec.sections) && ec.sections.length > 0 ? ec.sections : ['A'];
    secs.forEach((sec) => {
      const label = `${ec.name} - ${sec}`;
      if (!mergedClasses.some((c) => normStr(c.label) === normStr(label) || c.id === ec.id)) {
        mergedClasses.push({
          id: `erp_${ec.id}_${sec}`,
          sessionId,
          name: ec.name,
          section: sec,
          label,
          fromErpMaster: true,
        });
      }
    });
  });

  // 2. ERP Teachers (only Teaching staff / Teacher role from usersList for JD Intl, plus tenant teachers)
  const mergedTeachers = [...(tenant.teachers || [])];
  if (schoolId === 'sch_jd_intl' && Array.isArray(usersList)) {
    usersList
      .filter((u) => u.isActive !== false && (u.role === 'Teacher' || u.category === 'Teaching'))
      .forEach((u) => {
        const cleanName = u.displayName || String(u.name || '').replace(/^\[\d+\]\s*/i, '');
        const existing = mergedTeachers.find(
          (t) =>
            t.id === u.id ||
            (t.empCode && u.empCode && String(t.empCode) === String(u.empCode)) ||
            normStr(t.name) === normStr(cleanName),
        );
        if (!existing) {
          mergedTeachers.push({
            id: u.id,
            empCode: u.empCode || '',
            name: cleanName,
            email: u.email || '',
            phone: u.phone || '',
            designation: u.designation || 'Teacher',
            erpClasses: u.classes || [],
            erpSubjects: u.subjects || [],
          });
        } else {
          existing.erpClasses = u.classes || existing.erpClasses || [];
          existing.erpSubjects = u.subjects || existing.erpSubjects || [];
        }
      });
  }

  // 3. ERP Subjects + SubjectLinks
  const masterSubjects = [];
  if (schoolId === 'sch_jd_intl') {
    (subjectsStore || []).forEach((s) => {
      masterSubjects.push({ id: s.id, name: s.name, code: s.code || s.shortName || '' });
    });
    (subjectLinksStore || []).forEach((lnk) => {
      (lnk.linkedSubjectNames || []).forEach((subName) => {
        if (!masterSubjects.some((ms) => normStr(ms.name) === normStr(subName))) {
          masterSubjects.push({ id: `sub_${normStr(subName).replace(/\W+/g, '_')}`, name: subName, code: subName.slice(0, 4).toUpperCase() });
        }
      });
    });
  }
  tenant.classSubjects
    .filter((cs) => cs.sessionId === sessionId)
    .forEach((cs) => {
      if (!masterSubjects.some((ms) => normStr(ms.name) === normStr(cs.subjectName))) {
        masterSubjects.push({ id: cs.subjectId, name: cs.subjectName, code: cs.subjectCode || '' });
      }
    });

  // Fallback standard CBSE subjects list for quick linking if empty
  if (masterSubjects.length === 0) {
    ['Mathematics', 'Science', 'English', 'Hindi', 'Social Science', 'Computer Science'].forEach((n) => {
      masterSubjects.push({ id: `std_${normStr(n)}`, name: n, code: n.slice(0, 3).toUpperCase() });
    });
  }

  return { mergedClasses, mergedTeachers, masterSubjects };
}

function resolveActorTeacher(tenant, schoolId, sessionId, actor = {}) {
  const { mergedTeachers } = getMergedErpEntities(tenant, schoolId, sessionId);
  const actorId = String(actor.userId || actor.id || '').trim();
  const actorName = normStr(actor.name || actor.displayName || '');
  const actorEmpCode = String(actor.empCode || '').trim();

  // Handle demo ID like 'usr_staff_102' or 'usr_staff_dps_301'
  const empFromId = actorId.match(/(\d+)$/)?.[1] || '';

  const found = mergedTeachers.find((t) => {
    if (actorId && t.id === actorId) return true;
    if (actorEmpCode && t.empCode && String(t.empCode) === actorEmpCode) return true;
    if (empFromId && t.empCode && String(t.empCode) === empFromId) return true;
    if (actorName && normStr(t.name) === actorName) return true;
    return false;
  });

  if (found) return found;
  if (actor.name) {
    return {
      id: actorId || `usr_${normStr(actor.name).replace(/\W+/g, '_')}`,
      name: String(actor.name).replace(/^\[\d+\]\s*/i, ''),
      email: actor.email || '',
      phone: actor.phone || '',
      empCode: actorEmpCode,
      designation: 'Faculty',
    };
  }
  return mergedTeachers[0] || { id: 'teacher_1', name: 'Faculty Member', email: '', designation: 'Teacher' };
}

function getActiveTermStats(tenant, sessionId) {
  const terms = tenant.academicTerms.filter((t) => t.sessionId === sessionId);
  if (terms.length === 0) return null;
  const computed = terms.map((t) => computeTermStats(t)).filter(Boolean);
  return computed.find((t) => t.status === 'ACTIVE') || computed[0] || null;
}

// =====================================================================
// EXPORTED SERVICE API
// =====================================================================
export const syllabusService = {
  // ------------------- SESSIONS -------------------
  listSessions(schoolId) {
    const { tenant } = getTenantState(schoolId);
    const sessions = tenant.sessions.map((s) => ({
      ...s,
      _count: {
        classes: tenant.classes.filter((c) => c.sessionId === s.id).length,
        subjects: tenant.classSubjects.filter((cs) => cs.sessionId === s.id).length,
        chapters: tenant.chapters.filter((ch) => ch.sessionId === s.id).length,
        academicTerms: tenant.academicTerms.filter((t) => t.sessionId === s.id).length,
      },
    }));
    return { sessions, activeSessionId: resolveEffectiveSessionId(tenant) };
  },

  createSession(schoolId, { name, setAsActive = false }) {
    const cleanName = String(name || '').trim();
    if (!cleanName) throw new Error('Session name is required');
    const { root, tenant } = getTenantState(schoolId);
    if (tenant.sessions.some((s) => s.name.toLowerCase() === cleanName.toLowerCase())) {
      throw new Error(`Session "${cleanName}" already exists`);
    }
    if (setAsActive) {
      tenant.sessions.forEach((s) => { s.isActive = false; });
    }
    const newSess = {
      id: uid('sess'),
      name: cleanName,
      isActive: Boolean(setAsActive),
      isArchived: false,
      createdAt: new Date().toISOString(),
    };
    tenant.sessions.unshift(newSess);
    if (setAsActive) tenant.activeSessionId = newSess.id;
    writeRootStore(root);
    return newSess;
  },

  updateSession(schoolId, sessionId, { name }) {
    const cleanName = String(name || '').trim();
    if (!cleanName) throw new Error('Session name is required');
    const { root, tenant } = getTenantState(schoolId);
    const sess = tenant.sessions.find((s) => s.id === sessionId);
    if (!sess) throw new Error('Session not found');
    sess.name = cleanName;
    writeRootStore(root);
    return sess;
  },

  switchSession(schoolId, sessionId) {
    const { root, tenant } = getTenantState(schoolId);
    const sess = tenant.sessions.find((s) => s.id === sessionId);
    if (!sess) throw new Error('Session not found');
    tenant.sessions.forEach((s) => { s.isActive = s.id === sessionId; });
    sess.isArchived = false;
    tenant.activeSessionId = sessionId;
    writeRootStore(root);
    return sess;
  },

  archiveSession(schoolId, sessionId) {
    const { root, tenant } = getTenantState(schoolId);
    const sess = tenant.sessions.find((s) => s.id === sessionId);
    if (!sess) throw new Error('Session not found');
    if (sess.isActive) throw new Error('Cannot archive the currently active session. Switch active session first.');
    sess.isArchived = !sess.isArchived;
    writeRootStore(root);
    return sess;
  },

  deleteSession(schoolId, sessionId) {
    const { root, tenant } = getTenantState(schoolId);
    const sess = tenant.sessions.find((s) => s.id === sessionId);
    if (!sess) throw new Error('Session not found');
    if (sess.isActive) throw new Error('Cannot delete the active session.');
    tenant.sessions = tenant.sessions.filter((s) => s.id !== sessionId);
    tenant.classes = tenant.classes.filter((c) => c.sessionId !== sessionId);
    tenant.classSubjects = tenant.classSubjects.filter((cs) => cs.sessionId !== sessionId);
    tenant.chapters = tenant.chapters.filter((ch) => ch.sessionId !== sessionId);
    tenant.academicTerms = tenant.academicTerms.filter((t) => t.sessionId !== sessionId);
    writeRootStore(root);
    return { deleted: true, id: sessionId };
  },

  importFromSession(schoolId, importType, { sourceSessionId, targetSessionId }) {
    const { root, tenant } = getTenantState(schoolId);
    const targetId = targetSessionId || resolveEffectiveSessionId(tenant);
    if (!sourceSessionId || !targetId || sourceSessionId === targetId) {
      throw new Error('Select a valid source session different from target session');
    }
    const counts = { classesCopied: 0, subjectsCopied: 0, chaptersCopied: 0, teachersMapped: 0 };

    const doClasses = importType === 'classes' || importType === 'structure';
    const doSubjects = importType === 'subjects' || importType === 'structure';
    const doTeachers = importType === 'teachers' || importType === 'structure';
    const doSyllabus = importType === 'syllabus' || importType === 'structure';

    const classMap = new Map();
    if (doClasses || doSubjects || doSyllabus) {
      const srcClasses = tenant.classes.filter((c) => c.sessionId === sourceSessionId);
      srcClasses.forEach((sc) => {
        let existing = tenant.classes.find((c) => c.sessionId === targetId && normStr(c.label) === normStr(sc.label));
        if (!existing && doClasses) {
          existing = { ...sc, id: uid('cls'), sessionId: targetId };
          tenant.classes.push(existing);
          counts.classesCopied += 1;
        }
        if (existing) classMap.set(sc.id, existing);
      });
    }

    const csMap = new Map();
    if (doSubjects || doSyllabus || doTeachers) {
      const srcLinks = tenant.classSubjects.filter((cs) => cs.sessionId === sourceSessionId);
      srcLinks.forEach((sl) => {
        const mappedCls = classMap.get(sl.classId) || { id: sl.classId, label: sl.className };
        let targetCs = tenant.classSubjects.find(
          (cs) =>
            cs.sessionId === targetId &&
            normStr(cs.className) === normStr(mappedCls.label) &&
            normStr(cs.subjectName) === normStr(sl.subjectName),
        );
        if (!targetCs && (doSubjects || doSyllabus)) {
          targetCs = {
            ...sl,
            id: uid('cs'),
            sessionId: targetId,
            classId: mappedCls.id,
            className: mappedCls.label,
            teacherId: doTeachers ? sl.teacherId : '',
            teacherName: doTeachers ? sl.teacherName : '',
          };
          tenant.classSubjects.push(targetCs);
          counts.subjectsCopied += 1;
          if (doTeachers && sl.teacherName) counts.teachersMapped += 1;
        } else if (targetCs && doTeachers && sl.teacherName && !targetCs.teacherName) {
          targetCs.teacherId = sl.teacherId;
          targetCs.teacherName = sl.teacherName;
          counts.teachersMapped += 1;
        }
        if (targetCs) csMap.set(sl.id, targetCs);
      });
    }

    if (doSyllabus) {
      const srcChapters = tenant.chapters.filter((ch) => ch.sessionId === sourceSessionId);
      srcChapters.forEach((sch) => {
        const targetCs = csMap.get(sch.classSubjectId);
        if (!targetCs) return;
        const dup = tenant.chapters.some(
          (c) => c.sessionId === targetId && c.classSubjectId === targetCs.id && normStr(c.name) === normStr(sch.name),
        );
        if (!dup) {
          const newChId = uid('ch');
          tenant.chapters.push({
            ...sch,
            id: newChId,
            sessionId: targetId,
            classSubjectId: targetCs.id,
            classId: targetCs.classId,
            createdAt: new Date().toISOString(),
          });
          tenant.chapterProgress.push({
            id: uid('prog'),
            chapterId: newChId,
            sessionId: targetId,
            teacherId: targetCs.teacherId,
            teacherName: targetCs.teacherName,
            teachingCompleted: false,
            qaCompleted: false,
            copyCheckedCompleted: false,
            completionPercentage: 0,
            status: 'PENDING',
            updatedAt: new Date().toISOString(),
          });
          counts.chaptersCopied += 1;
        }
      });
    }

    writeRootStore(root);
    return counts;
  },

  // ------------------- ACADEMIC TIMELINE -------------------
  listAcademicTerms(schoolId, sessionId) {
    const { tenant } = getTenantState(schoolId);
    const sid = resolveEffectiveSessionId(tenant, sessionId);
    const terms = tenant.academicTerms
      .filter((t) => t.sessionId === sid)
      .map((t) => computeTermStats(t))
      .filter(Boolean);
    return { terms, sessionId: sid };
  },

  createAcademicTerm(schoolId, payload) {
    const { root, tenant } = getTenantState(schoolId);
    const sid = resolveEffectiveSessionId(tenant, payload.sessionId);
    const start = parseDateOnly(payload.startDate);
    const end = parseDateOnly(payload.endDate);
    if (!start || !end || end <= start) throw new Error('End date must be after start date');
    const diffDays = Math.round((end - start) / 86400000) + 1;
    if (diffDays < 30 || diffDays > 380) {
      throw new Error(`Academic timeline span (${diffDays} days) must be between 30 and 380 days`);
    }

    const newTerm = {
      id: uid('term'),
      sessionId: sid,
      name: String(payload.name || 'Academic Term').trim(),
      startDate: String(payload.startDate).slice(0, 10),
      endDate: String(payload.endDate).slice(0, 10),
      weeklyHolidays: Array.isArray(payload.weeklyHolidays) ? payload.weeklyHolidays.map(Number) : [0],
      includeIndianHolidays: payload.includeIndianHolidays !== false,
      holidayDates: Array.isArray(payload.holidayDates) ? payload.holidayDates : [],
      vacationPeriods: Array.isArray(payload.vacationPeriods) ? payload.vacationPeriods : [],
      terms: Array.isArray(payload.terms) ? payload.terms : [],
    };
    tenant.academicTerms.push(newTerm);
    writeRootStore(root);
    return computeTermStats(newTerm);
  },

  updateAcademicTerm(schoolId, termId, payload) {
    const { root, tenant } = getTenantState(schoolId);
    const idx = tenant.academicTerms.findIndex((t) => t.id === termId);
    if (idx === -1) throw new Error('Academic timeline not found');
    const current = tenant.academicTerms[idx];
    const next = {
      ...current,
      name: payload.name !== undefined ? String(payload.name).trim() : current.name,
      startDate: payload.startDate !== undefined ? String(payload.startDate).slice(0, 10) : current.startDate,
      endDate: payload.endDate !== undefined ? String(payload.endDate).slice(0, 10) : current.endDate,
      weeklyHolidays: payload.weeklyHolidays !== undefined ? payload.weeklyHolidays.map(Number) : current.weeklyHolidays,
      includeIndianHolidays: payload.includeIndianHolidays !== undefined ? Boolean(payload.includeIndianHolidays) : current.includeIndianHolidays,
      holidayDates: payload.holidayDates !== undefined ? payload.holidayDates : current.holidayDates,
      vacationPeriods: payload.vacationPeriods !== undefined ? payload.vacationPeriods : current.vacationPeriods,
      terms: payload.terms !== undefined ? payload.terms : current.terms,
    };
    const start = parseDateOnly(next.startDate);
    const end = parseDateOnly(next.endDate);
    if (!start || !end || end <= start) throw new Error('End date must be after start date');
    const diffDays = Math.round((end - start) / 86400000) + 1;
    if (diffDays < 30 || diffDays > 380) {
      throw new Error(`Timeline duration (${diffDays} days) must stay within 30 to 380 days`);
    }
    tenant.academicTerms[idx] = next;
    writeRootStore(root);
    return computeTermStats(next);
  },

  deleteAcademicTerm(schoolId, termId) {
    const { root, tenant } = getTenantState(schoolId);
    tenant.academicTerms = tenant.academicTerms.filter((t) => t.id !== termId);
    writeRootStore(root);
    return { deleted: true };
  },

  addVacationPeriod(schoolId, termId, { name, startDate, endDate }) {
    const { root, tenant } = getTenantState(schoolId);
    const term = tenant.academicTerms.find((t) => t.id === termId);
    if (!term) throw new Error('Academic timeline not found');
    if (!name || !startDate || !endDate) throw new Error('Vacation name, start date & end date required');
    if (String(endDate).slice(0, 10) < String(startDate).slice(0, 10)) {
      throw new Error('Vacation end date must be on or after start date');
    }
    term.vacationPeriods = term.vacationPeriods || [];
    term.vacationPeriods.push({
      id: uid('vac'),
      name: String(name).trim(),
      startDate: String(startDate).slice(0, 10),
      endDate: String(endDate).slice(0, 10),
    });
    writeRootStore(root);
    return computeTermStats(term);
  },

  deleteVacationPeriod(schoolId, termId, vacId) {
    const { root, tenant } = getTenantState(schoolId);
    const term = tenant.academicTerms.find((t) => t.id === termId);
    if (!term) throw new Error('Academic timeline not found');
    term.vacationPeriods = (term.vacationPeriods || []).filter((v) => v.id !== vacId);
    writeRootStore(root);
    return computeTermStats(term);
  },

  // ------------------- SYLLABUS TREE & PROGRESS -------------------
  getSyllabusTree(schoolId, sessionId, { search = '', termTag = '' } = {}) {
    const { tenant } = getTenantState(schoolId);
    const sid = resolveEffectiveSessionId(tenant, sessionId);
    const { mergedClasses, mergedTeachers, masterSubjects } = getMergedErpEntities(tenant, schoolId, sid);
    const q = search.trim().toLowerCase();

    const treeClasses = mergedClasses.map((cls) => {
      const subjects = tenant.classSubjects
        .filter((cs) => cs.sessionId === sid && (cs.classId === cls.id || normStr(cs.className) === normStr(cls.label)))
        .map((cs) => {
          let chs = tenant.chapters
            .filter((ch) => ch.sessionId === sid && ch.classSubjectId === cs.id)
            .sort((a, b) => Number(a.chapterNo || 0) - Number(b.chapterNo || 0))
            .map((ch) => {
              const prog = tenant.chapterProgress.find((p) => p.chapterId === ch.id) || {};
              const computed = computeChapterProgressFields(prog);
              const chTopics = tenant.topics.filter((tp) => tp.chapterId === ch.id);
              return { ...ch, ...computed, topics: chTopics };
            });

          if (termTag && termTag !== 'ALL') {
            chs = chs.filter((ch) => (ch.termTag || '') === termTag);
          }
          if (q) {
            const subMatch = cs.subjectName.toLowerCase().includes(q) || cs.teacherName?.toLowerCase().includes(q) || cls.label.toLowerCase().includes(q);
            if (!subMatch) {
              chs = chs.filter((ch) => ch.name.toLowerCase().includes(q));
            }
          }

          const avgCompletion = chs.length > 0
            ? Math.round(chs.reduce((s, c) => s + c.completionPercentage, 0) / chs.length)
            : 0;

          return {
            ...cs,
            chapters: chs,
            chapterCount: chs.length,
            completionPercentage: avgCompletion,
          };
        })
        .filter((s) => !q || s.chapters.length > 0 || s.subjectName.toLowerCase().includes(q) || cls.label.toLowerCase().includes(q));

      return {
        ...cls,
        subjects,
      };
    });

    return {
      sessionId: sid,
      classes: treeClasses,
      availableClasses: mergedClasses,
      availableSubjects: masterSubjects,
      availableTeachers: mergedTeachers,
    };
  },

  linkSubjectToClass(schoolId, sessionId, { classId, className, subjectName, subjectCode, teacherId, teacherName }) {
    const { root, tenant } = getTenantState(schoolId);
    const sid = resolveEffectiveSessionId(tenant, sessionId);
    const cleanSub = String(subjectName || '').trim();
    const cleanClsName = String(className || '').trim();
    if (!cleanSub || (!classId && !cleanClsName)) {
      throw new Error('Class and Subject are required');
    }

    // Ensure class exists in tenant.classes
    let clsObj = tenant.classes.find((c) => c.sessionId === sid && (c.id === classId || normStr(c.label) === normStr(cleanClsName)));
    if (!clsObj) {
      clsObj = {
        id: classId || uid('cls'),
        sessionId: sid,
        name: cleanClsName.split(' - ')[0] || cleanClsName,
        section: cleanClsName.split(' - ')[1] || 'A',
        label: cleanClsName,
      };
      tenant.classes.push(clsObj);
    }

    const existing = tenant.classSubjects.find(
      (cs) => cs.sessionId === sid && (cs.classId === clsObj.id || normStr(cs.className) === normStr(clsObj.label)) && normStr(cs.subjectName) === normStr(cleanSub),
    );
    if (existing) {
      if (teacherId !== undefined) existing.teacherId = teacherId;
      if (teacherName !== undefined) existing.teacherName = teacherName;
      writeRootStore(root);
      return existing;
    }

    const created = {
      id: uid('cs'),
      sessionId: sid,
      classId: clsObj.id,
      className: clsObj.label,
      subjectId: uid('sub'),
      subjectName: cleanSub,
      subjectCode: subjectCode || cleanSub.slice(0, 4).toUpperCase(),
      teacherId: teacherId || '',
      teacherName: teacherName || 'Unassigned',
    };
    tenant.classSubjects.push(created);
    writeRootStore(root);
    return created;
  },

  updateSubjectTeacher(schoolId, classSubjectId, { teacherId, teacherName }) {
    const { root, tenant } = getTenantState(schoolId);
    const cs = tenant.classSubjects.find((item) => item.id === classSubjectId);
    if (!cs) throw new Error('Class-Subject link not found');
    cs.teacherId = teacherId || cs.teacherId;
    cs.teacherName = teacherName || cs.teacherName;
    writeRootStore(root);
    return cs;
  },

  createChapter(schoolId, sessionId, payload) {
    const { root, tenant } = getTenantState(schoolId);
    const sid = resolveEffectiveSessionId(tenant, sessionId);
    const cs = tenant.classSubjects.find((item) => item.id === payload.classSubjectId);
    if (!cs) throw new Error('Subject mapping not found for this class');
    const cleanName = String(payload.name || '').trim();
    if (!cleanName) throw new Error('Chapter name is required');

    const chId = uid('ch');
    const newChapter = {
      id: chId,
      sessionId: sid,
      classSubjectId: cs.id,
      classId: cs.classId,
      subjectId: cs.subjectId,
      chapterNo: Number(payload.chapterNo || 1),
      name: cleanName,
      termTag: payload.termTag || 'Term 1',
      description: payload.description || '',
      createdAt: new Date().toISOString(),
    };
    tenant.chapters.push(newChapter);
    tenant.chapterProgress.push({
      id: uid('prog'),
      chapterId: chId,
      sessionId: sid,
      teacherId: cs.teacherId,
      teacherName: cs.teacherName,
      teachingCompleted: false,
      qaCompleted: false,
      copyCheckedCompleted: false,
      completionPercentage: 0,
      status: 'PENDING',
      updatedAt: new Date().toISOString(),
    });
    writeRootStore(root);
    return { ...newChapter, ...computeChapterProgressFields({}) };
  },

  updateChapter(schoolId, chapterId, payload) {
    const { root, tenant } = getTenantState(schoolId);
    const ch = tenant.chapters.find((c) => c.id === chapterId);
    if (!ch) throw new Error('Chapter not found');
    if (payload.name !== undefined) ch.name = String(payload.name).trim();
    if (payload.chapterNo !== undefined) ch.chapterNo = Number(payload.chapterNo);
    if (payload.termTag !== undefined) ch.termTag = payload.termTag;
    if (payload.description !== undefined) ch.description = payload.description;
    writeRootStore(root);
    return ch;
  },

  deleteChapter(schoolId, chapterId) {
    const { root, tenant } = getTenantState(schoolId);
    tenant.chapters = tenant.chapters.filter((c) => c.id !== chapterId);
    tenant.chapterProgress = tenant.chapterProgress.filter((p) => p.chapterId !== chapterId);
    tenant.topics = tenant.topics.filter((t) => t.chapterId !== chapterId);
    writeRootStore(root);
    return { deleted: true };
  },

  updateChapterProgress(schoolId, chapterId, actor, patch) {
    const { root, tenant } = getTenantState(schoolId);
    const ch = tenant.chapters.find((c) => c.id === chapterId);
    if (!ch) throw new Error('Chapter not found');
    const cs = tenant.classSubjects.find((s) => s.id === ch.classSubjectId);

    let prog = tenant.chapterProgress.find((p) => p.chapterId === chapterId);
    if (!prog) {
      prog = {
        id: uid('prog'),
        chapterId,
        sessionId: ch.sessionId,
        teacherId: cs?.teacherId || actor?.userId || '',
        teacherName: cs?.teacherName || actor?.name || 'Teacher',
        teachingCompleted: false,
        qaCompleted: false,
        copyCheckedCompleted: false,
      };
      tenant.chapterProgress.push(prog);
    }

    if (patch.teachingCompleted !== undefined) prog.teachingCompleted = Boolean(patch.teachingCompleted);
    if (patch.qaCompleted !== undefined) prog.qaCompleted = Boolean(patch.qaCompleted);
    if (patch.copyCheckedCompleted !== undefined) prog.copyCheckedCompleted = Boolean(patch.copyCheckedCompleted);
    const computed = computeChapterProgressFields(prog);
    Object.assign(prog, computed);
    prog.updatedAt = new Date().toISOString();

    tenant.recentUpdates.unshift({
      id: uid('upd'),
      teacherName: actor?.name || cs?.teacherName || 'Faculty',
      className: cs?.className || '',
      subjectName: cs?.subjectName || '',
      chapterName: ch.name,
      status: prog.status,
      completionPercentage: prog.completionPercentage,
      updatedAt: prog.updatedAt,
    });
    tenant.recentUpdates = tenant.recentUpdates.slice(0, 20);
    writeRootStore(root);
    return { ...ch, ...prog };
  },

  // ------------------- TEACHER ASSIGNED CLASSES -------------------
  getTeacherAssignedClasses(schoolId, sessionId, actor) {
    const { tenant } = getTenantState(schoolId);
    const sid = resolveEffectiveSessionId(tenant, sessionId);
    const teacher = resolveActorTeacher(tenant, schoolId, sid, actor);
    const tNameNorm = normStr(teacher.name);

    const assignedCs = tenant.classSubjects.filter(
      (cs) => cs.sessionId === sid && (cs.teacherId === teacher.id || normStr(cs.teacherName) === tNameNorm),
    );

    // Group by class
    const byClass = new Map();
    assignedCs.forEach((cs) => {
      if (!byClass.has(cs.classId)) {
        byClass.set(cs.classId, {
          id: cs.classId,
          label: cs.className,
          subjects: [],
        });
      }
      const chs = tenant.chapters
        .filter((c) => c.classSubjectId === cs.id)
        .map((c) => {
          const p = tenant.chapterProgress.find((pr) => pr.chapterId === c.id) || {};
          return { ...c, ...computeChapterProgressFields(p) };
        });
      const avgPct = chs.length > 0 ? Math.round(chs.reduce((s, c) => s + c.completionPercentage, 0) / chs.length) : 0;
      byClass.get(cs.classId).subjects.push({
        ...cs,
        chapters: chs,
        chapterCount: chs.length,
        completedCount: chs.filter((c) => c.status === 'COMPLETED').length,
        completionPercentage: avgPct,
      });
    });

    const classes = Array.from(byClass.values()).map((c) => {
      const totalCh = c.subjects.reduce((s, sub) => s + sub.chapterCount, 0);
      const completedCh = c.subjects.reduce((s, sub) => s + sub.completedCount, 0);
      const overallPct = c.subjects.length > 0
        ? Math.round(c.subjects.reduce((s, sub) => s + sub.completionPercentage, 0) / c.subjects.length)
        : 0;
      return { ...c, totalChapters: totalCh, completedChapters: completedCh, completionPercentage: overallPct };
    });

    return { teacher, classes, sessionId: sid };
  },

  // ------------------- DASHBOARD & ANALYTICS -------------------
  getDashboardAnalytics(schoolId, sessionId) {
    const { tenant } = getTenantState(schoolId);
    const sid = resolveEffectiveSessionId(tenant, sessionId);
    const { mergedClasses, mergedTeachers } = getMergedErpEntities(tenant, schoolId, sid);
    const activeTerm = getActiveTermStats(tenant, sid);
    const targetPct = activeTerm?.timeProgressPercentage || 0;

    const csList = tenant.classSubjects.filter((cs) => cs.sessionId === sid);
    const chList = tenant.chapters.filter((ch) => ch.sessionId === sid).map((ch) => {
      const p = tenant.chapterProgress.find((pr) => pr.chapterId === ch.id) || {};
      return { ...ch, ...computeChapterProgressFields(p) };
    });

    const totalChapters = chList.length;
    const completedChapters = chList.filter((c) => c.status === 'COMPLETED').length;
    const inProgressChapters = chList.filter((c) => c.status === 'IN_PROGRESS').length;
    const pendingChapters = chList.filter((c) => c.status === 'PENDING').length;
    const overallCompletion = totalChapters > 0
      ? Math.round(chList.reduce((s, c) => s + c.completionPercentage, 0) / totalChapters)
      : 0;

    // Class completion breakdown
    const classMap = new Map();
    csList.forEach((cs) => {
      if (!classMap.has(cs.classId)) classMap.set(cs.classId, { id: cs.classId, className: cs.className, total: 0, pctSum: 0, completed: 0 });
      const chs = chList.filter((c) => c.classSubjectId === cs.id);
      const entry = classMap.get(cs.classId);
      chs.forEach((c) => {
        entry.total += 1;
        entry.pctSum += c.completionPercentage;
        if (c.status === 'COMPLETED') entry.completed += 1;
      });
    });
    const completionByClass = Array.from(classMap.values()).map((e) => ({
      classId: e.id,
      name: e.className,
      totalChapters: e.total,
      completedChapters: e.completed,
      completionPercentage: e.total > 0 ? Math.round(e.pctSum / e.total) : 0,
    }));

    // Subject completion breakdown
    const subMap = new Map();
    csList.forEach((cs) => {
      const key = cs.subjectName;
      if (!subMap.has(key)) subMap.set(key, { name: key, total: 0, pctSum: 0, completed: 0 });
      const chs = chList.filter((c) => c.classSubjectId === cs.id);
      const entry = subMap.get(key);
      chs.forEach((c) => {
        entry.total += 1;
        entry.pctSum += c.completionPercentage;
        if (c.status === 'COMPLETED') entry.completed += 1;
      });
    });
    const completionBySubject = Array.from(subMap.values()).map((e) => ({
      name: e.name,
      totalChapters: e.total,
      completedChapters: e.completed,
      completionPercentage: e.total > 0 ? Math.round(e.pctSum / e.total) : 0,
    }));

    // Teacher performance
    const teacherMap = new Map();
    csList.forEach((cs) => {
      const tName = cs.teacherName || 'Unassigned';
      if (!teacherMap.has(tName)) {
        teacherMap.set(tName, {
          teacherId: cs.teacherId,
          teacherName: tName,
          subjects: new Set(),
          classes: new Set(),
          total: 0,
          pctSum: 0,
          completed: 0,
          inProgress: 0,
        });
      }
      const entry = teacherMap.get(tName);
      entry.subjects.add(cs.subjectName);
      entry.classes.add(cs.className);
      const chs = chList.filter((c) => c.classSubjectId === cs.id);
      chs.forEach((c) => {
        entry.total += 1;
        entry.pctSum += c.completionPercentage;
        if (c.status === 'COMPLETED') entry.completed += 1;
        else if (c.status === 'IN_PROGRESS') entry.inProgress += 1;
      });
    });

    const teacherPerformance = Array.from(teacherMap.values()).map((t) => {
      const pct = t.total > 0 ? Math.round(t.pctSum / t.total) : 0;
      const vel = classifyVelocity(pct, targetPct, tenant.pacingSettings);
      return {
        teacherId: t.teacherId,
        teacherName: t.teacherName,
        subjects: Array.from(t.subjects),
        classes: Array.from(t.classes),
        totalChapters: t.total,
        completedChapters: t.completed,
        inProgressChapters: t.inProgress,
        completionPercentage: pct,
        ...vel,
      };
    });

    const behindCount = teacherPerformance.filter((t) => t.velocityStatus === 'BEHIND').length;
    const onPaceCount = teacherPerformance.filter((t) => t.velocityStatus === 'ON_PACE').length;
    const aheadCount = teacherPerformance.filter((t) => t.velocityStatus === 'AHEAD').length;

    const papers = tenant.examPapers.filter((p) => p.sessionId === sid);
    const pendingTrainings = tenant.teacherTrainings.filter((t) => t.sessionId === sid && t.status === 'SUBMITTED').length;

    return {
      sessionId: sid,
      kpis: {
        totalClasses: Math.max(mergedClasses.length, classMap.size),
        totalTeachers: Math.max(mergedTeachers.length, teacherMap.size),
        totalSubjects: subMap.size,
        totalChapters,
        completedChapters,
        inProgressChapters,
        pendingChapters,
        overallCompletion,
        totalExamPapers: papers.length,
        reviewedPapers: papers.filter((p) => p.status === 'REVIEWED').length,
        pendingApprovals: pendingTrainings,
      },
      activeTerm,
      statusDistribution: [
        { name: 'Completed', value: completedChapters, color: '#10b981' },
        { name: 'In Progress', value: inProgressChapters, color: '#3b82f6' },
        { name: 'Pending', value: pendingChapters, color: '#cbd5e1' },
      ],
      velocityBreakdown: {
        targetPct,
        overallPct: overallCompletion,
        behindCount,
        onPaceCount,
        aheadCount,
        overallVelocity: classifyVelocity(overallCompletion, targetPct, tenant.pacingSettings),
      },
      completionByClass,
      completionBySubject,
      teacherPerformance,
      recentUpdates: tenant.recentUpdates.slice(0, 10),
    };
  },

  getTeacherDrilldown(schoolId, teacherName, sessionId) {
    const { tenant } = getTenantState(schoolId);
    const sid = resolveEffectiveSessionId(tenant, sessionId);
    const targetNorm = normStr(teacherName);
    const csList = tenant.classSubjects.filter((cs) => cs.sessionId === sid && normStr(cs.teacherName) === targetNorm);
    const items = csList.map((cs) => {
      const chs = tenant.chapters
        .filter((c) => c.classSubjectId === cs.id)
        .map((c) => ({ ...c, ...computeChapterProgressFields(tenant.chapterProgress.find((p) => p.chapterId === c.id) || {}) }));
      const pct = chs.length > 0 ? Math.round(chs.reduce((s, c) => s + c.completionPercentage, 0) / chs.length) : 0;
      return {
        classSubjectId: cs.id,
        className: cs.className,
        subjectName: cs.subjectName,
        completionPercentage: pct,
        chapters: chs,
      };
    });
    return { teacherName, subjects: items };
  },

  // ------------------- PROGRESSION & PACING -------------------
  getProgressionAnalytics(schoolId, sessionId, { termTag = 'ALL' } = {}) {
    const { tenant } = getTenantState(schoolId);
    const sid = resolveEffectiveSessionId(tenant, sessionId);
    const activeTerm = getActiveTermStats(tenant, sid);
    const targetPct = activeTerm?.timeProgressPercentage || 0;
    const settings = tenant.pacingSettings || { onPaceMinDelta: -5, aheadMinDelta: 5 };

    const csList = tenant.classSubjects.filter((cs) => cs.sessionId === sid);
    const chList = tenant.chapters
      .filter((c) => c.sessionId === sid && (termTag === 'ALL' || !termTag || c.termTag === termTag))
      .map((c) => ({
        ...c,
        ...computeChapterProgressFields(tenant.chapterProgress.find((p) => p.chapterId === c.id) || {}),
      }));

    // By Class
    const byClassMap = new Map();
    csList.forEach((cs) => {
      const chs = chList.filter((c) => c.classSubjectId === cs.id);
      if (chs.length === 0) return;
      if (!byClassMap.has(cs.classId)) {
        byClassMap.set(cs.classId, { id: cs.classId, name: cs.className, subjects: [], total: 0, pctSum: 0, completed: 0 });
      }
      const grp = byClassMap.get(cs.classId);
      const subPct = Math.round(chs.reduce((s, c) => s + c.completionPercentage, 0) / chs.length);
      grp.subjects.push({
        id: cs.id,
        subjectName: cs.subjectName,
        teacherName: cs.teacherName,
        totalChapters: chs.length,
        completedChapters: chs.filter((c) => c.status === 'COMPLETED').length,
        actualPercentage: subPct,
        ...classifyVelocity(subPct, targetPct, settings),
      });
      chs.forEach((c) => {
        grp.total += 1;
        grp.pctSum += c.completionPercentage;
        if (c.status === 'COMPLETED') grp.completed += 1;
      });
    });

    const classProgress = Array.from(byClassMap.values()).map((g) => {
      const actualPercentage = g.total > 0 ? Math.round(g.pctSum / g.total) : 0;
      return { ...g, actualPercentage, ...classifyVelocity(actualPercentage, targetPct, settings) };
    });

    // By Subject
    const bySubjectMap = new Map();
    csList.forEach((cs) => {
      const chs = chList.filter((c) => c.classSubjectId === cs.id);
      if (chs.length === 0) return;
      if (!bySubjectMap.has(cs.subjectName)) {
        bySubjectMap.set(cs.subjectName, { name: cs.subjectName, total: 0, pctSum: 0, completed: 0, classCount: 0 });
      }
      const grp = bySubjectMap.get(cs.subjectName);
      grp.classCount += 1;
      chs.forEach((c) => {
        grp.total += 1;
        grp.pctSum += c.completionPercentage;
        if (c.status === 'COMPLETED') grp.completed += 1;
      });
    });
    const subjectProgress = Array.from(bySubjectMap.values()).map((s) => {
      const actualPercentage = s.total > 0 ? Math.round(s.pctSum / s.total) : 0;
      return { ...s, actualPercentage, ...classifyVelocity(actualPercentage, targetPct, settings) };
    });

    // By Teacher
    const byTeacherMap = new Map();
    csList.forEach((cs) => {
      const chs = chList.filter((c) => c.classSubjectId === cs.id);
      if (chs.length === 0) return;
      const tName = cs.teacherName || 'Unassigned';
      if (!byTeacherMap.has(tName)) {
        byTeacherMap.set(tName, { name: tName, subjects: new Set(), classes: new Set(), total: 0, pctSum: 0, completed: 0 });
      }
      const grp = byTeacherMap.get(tName);
      grp.subjects.add(cs.subjectName);
      grp.classes.add(cs.className);
      chs.forEach((c) => {
        grp.total += 1;
        grp.pctSum += c.completionPercentage;
        if (c.status === 'COMPLETED') grp.completed += 1;
      });
    });
    const teacherProgress = Array.from(byTeacherMap.values()).map((t) => {
      const actualPercentage = t.total > 0 ? Math.round(t.pctSum / t.total) : 0;
      return {
        name: t.name,
        subjects: Array.from(t.subjects),
        classes: Array.from(t.classes),
        total: t.total,
        completed: t.completed,
        actualPercentage,
        ...classifyVelocity(actualPercentage, targetPct, settings),
      };
    });

    const overallActual = chList.length > 0 ? Math.round(chList.reduce((s, c) => s + c.completionPercentage, 0) / chList.length) : 0;

    return {
      sessionId: sid,
      activeTerm,
      targetPercentage: targetPct,
      overallActualPercentage: overallActual,
      overallVelocity: classifyVelocity(overallActual, targetPct, settings),
      pacingSettings: settings,
      classProgress,
      subjectProgress,
      teacherProgress,
    };
  },

  updatePacingSettings(schoolId, { onPaceMinDelta, aheadMinDelta }) {
    const { root, tenant } = getTenantState(schoolId);
    tenant.pacingSettings = {
      onPaceMinDelta: Number(onPaceMinDelta ?? -5),
      aheadMinDelta: Number(aheadMinDelta ?? 5),
    };
    writeRootStore(root);
    return tenant.pacingSettings;
  },

  getTeacherProgression(schoolId, sessionId, actor) {
    const { tenant } = getTenantState(schoolId);
    const sid = resolveEffectiveSessionId(tenant, sessionId);
    const teacher = resolveActorTeacher(tenant, schoolId, sid, actor);
    const activeTerm = getActiveTermStats(tenant, sid);
    const targetPct = activeTerm?.timeProgressPercentage || 0;
    const settings = tenant.pacingSettings || { onPaceMinDelta: -5, aheadMinDelta: 5 };
    const { classes } = this.getTeacherAssignedClasses(schoolId, sid, actor);

    const enrichedClasses = classes.map((c) => ({
      ...c,
      ...classifyVelocity(c.completionPercentage, targetPct, settings),
      subjects: c.subjects.map((sub) => ({
        ...sub,
        ...classifyVelocity(sub.completionPercentage, targetPct, settings),
      })),
    }));

    const overallPct = enrichedClasses.length > 0
      ? Math.round(enrichedClasses.reduce((s, c) => s + c.completionPercentage, 0) / enrichedClasses.length)
      : 0;

    return {
      teacher,
      sessionId: sid,
      activeTerm,
      targetPercentage: targetPct,
      overallPercentage: overallPct,
      overallVelocity: classifyVelocity(overallPct, targetPct, settings),
      classes: enrichedClasses,
    };
  },

  // ------------------- EXAM PAPERS -------------------
  listExamPapers(schoolId, sessionId, { role = 'ADMIN', status = '', classId = '', subjectId = '', search = '', actor = {} } = {}) {
    const { tenant } = getTenantState(schoolId);
    const sid = resolveEffectiveSessionId(tenant, sessionId);
    let papers = tenant.examPapers.filter((p) => p.sessionId === sid);

    if (String(role).toUpperCase() === 'STAFF' || String(role).toUpperCase() === 'TEACHER') {
      const teacher = resolveActorTeacher(tenant, schoolId, sid, actor);
      papers = papers.filter((p) => p.teacherId === teacher.id || normStr(p.teacherName) === normStr(teacher.name));
    }

    if (status && status !== 'ALL') papers = papers.filter((p) => p.status === status);
    if (classId && classId !== 'ALL') papers = papers.filter((p) => p.classId === classId || normStr(p.className) === normStr(classId));
    if (subjectId && subjectId !== 'ALL') papers = papers.filter((p) => p.subjectId === subjectId || normStr(p.subjectName) === normStr(subjectId));
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      papers = papers.filter((p) =>
        p.examName?.toLowerCase().includes(q) ||
        p.subjectName?.toLowerCase().includes(q) ||
        p.className?.toLowerCase().includes(q) ||
        p.teacherName?.toLowerCase().includes(q),
      );
    }

    return papers.sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime());
  },

  getExamPaper(schoolId, paperId) {
    const { tenant } = getTenantState(schoolId);
    const paper = tenant.examPapers.find((p) => p.id.toLowerCase() === String(paperId).toLowerCase());
    if (!paper) throw new Error('Exam paper not found');
    return paper;
  },

  createExamPaper(schoolId, sessionId, payload, actor = {}) {
    const { root, tenant } = getTenantState(schoolId);
    const sid = resolveEffectiveSessionId(tenant, sessionId);
    const teacher = resolveActorTeacher(tenant, schoolId, sid, actor);
    const paper = {
      id: uid('ep'),
      sessionId: sid,
      teacherId: payload.teacherId || teacher.id,
      teacherName: payload.teacherName || teacher.name,
      classId: payload.classId || '',
      className: payload.className || '',
      subjectId: payload.subjectId || '',
      subjectName: payload.subjectName || '',
      examName: payload.examName || 'Examination Paper',
      examDate: payload.examDate || new Date().toISOString().slice(0, 10),
      duration: Number(payload.duration || 180),
      totalMarks: Number(payload.totalMarks || 80),
      templateType: payload.templateType || tenant.examTemplate?.defaultTemplateType || 'SINGLE',
      styleFontFamily: payload.styleFontFamily || tenant.examTemplate?.defaultFontFamily || 'Times New Roman',
      styleFontSize: payload.styleFontSize || tenant.examTemplate?.defaultFontSize || '11pt',
      styleColor: payload.styleColor || tenant.examTemplate?.defaultColor || '#000000',
      showTeacherName: payload.showTeacherName !== undefined ? Boolean(payload.showTeacherName) : true,
      status: payload.status || 'DRAFT',
      driveSynced: Boolean(payload.driveSynced),
      instructions: payload.instructions || '',
      sections: Array.isArray(payload.sections) ? payload.sections : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    tenant.examPapers.unshift(paper);
    writeRootStore(root);
    return paper;
  },

  updateExamPaper(schoolId, paperId, payload) {
    const { root, tenant } = getTenantState(schoolId);
    const idx = tenant.examPapers.findIndex((p) => p.id.toLowerCase() === String(paperId).toLowerCase());
    if (idx === -1) throw new Error('Exam paper not found');
    const prev = tenant.examPapers[idx];
    const next = {
      ...prev,
      ...payload,
      id: prev.id,
      sessionId: prev.sessionId,
      updatedAt: new Date().toISOString(),
    };
    if (payload.status === 'REVIEWED' && prev.status !== 'REVIEWED') {
      next.reviewedAt = new Date().toISOString();
      next.reviewedBy = payload.reviewedBy || 'Academic Admin';
    }
    tenant.examPapers[idx] = next;
    writeRootStore(root);
    return next;
  },

  deleteExamPaper(schoolId, paperId) {
    const { root, tenant } = getTenantState(schoolId);
    tenant.examPapers = tenant.examPapers.filter((p) => p.id.toLowerCase() !== String(paperId).toLowerCase());
    writeRootStore(root);
    return { deleted: true };
  },

  getExamNames(schoolId) {
    const { tenant } = getTenantState(schoolId);
    return tenant.examNames || [];
  },

  updateExamNames(schoolId, names) {
    const { root, tenant } = getTenantState(schoolId);
    tenant.examNames = Array.isArray(names) ? names.map((n) => String(n).trim()).filter(Boolean) : [];
    writeRootStore(root);
    return tenant.examNames;
  },

  getExamTemplate(schoolId) {
    const { tenant } = getTenantState(schoolId);
    return tenant.examTemplate;
  },

  saveExamTemplate(schoolId, patch) {
    const { root, tenant } = getTenantState(schoolId);
    tenant.examTemplate = { ...tenant.examTemplate, ...patch };
    writeRootStore(root);
    return tenant.examTemplate;
  },

  // ------------------- TEACHER TRAINING (CPD 50h) -------------------
  getTrainingCatalog() {
    return {
      domains: DOMAIN_INFO,
      standards: CPD_STANDARDS,
      annexure1: ANNEXURE_I_TOPICS,
      annexure2: ANNEXURE_II_TOPICS,
      annexure3: ANNEXURE_III_TOPICS,
      academicActivities: ACADEMIC_ACTIVITIES,
    };
  },

  listTeacherCpdSummaries(schoolId, sessionId, { complianceStatus = 'ALL', search = '' } = {}) {
    const { tenant } = getTenantState(schoolId);
    const sid = resolveEffectiveSessionId(tenant, sessionId);
    const { mergedTeachers } = getMergedErpEntities(tenant, schoolId, sid);
    const allRecords = tenant.teacherTrainings.filter((r) => r.sessionId === sid);

    // Enrich teachers with their subjects & classes from classSubjects
    const summaries = mergedTeachers.map((t) => {
      const tCs = tenant.classSubjects.filter((cs) => cs.sessionId === sid && (cs.teacherId === t.id || normStr(cs.teacherName) === normStr(t.name)));
      const subNames = Array.from(new Set([...(t.erpSubjects || []), ...tCs.map((x) => x.subjectName)]));
      const clsNames = Array.from(new Set([...(t.erpClasses || []), ...tCs.map((x) => x.className)]));
      const records = allRecords.filter((r) => r.teacherId === t.id || normStr(r.teacherName) === normStr(t.name));
      return computeTeacherCpdSummary({ ...t, subjectNames: subNames, classNames: clsNames }, records);
    });

    let filtered = summaries;
    if (complianceStatus && complianceStatus !== 'ALL') {
      filtered = filtered.filter((s) => s.complianceStatus === complianceStatus);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter((s) =>
        s.name.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        s.subjectNames.some((sub) => sub.toLowerCase().includes(q)),
      );
    }

    const totalTeachers = summaries.length;
    const compliantCount = summaries.filter((s) => s.complianceStatus === 'COMPLIANT').length;
    const inProgressCount = summaries.filter((s) => s.complianceStatus === 'IN_PROGRESS').length;
    const avgEffectiveHours = totalTeachers > 0
      ? Math.round((summaries.reduce((acc, s) => acc + s.effectiveTotalHours, 0) / totalTeachers) * 10) / 10
      : 0;
    const pendingApprovals = allRecords.filter((r) => r.status === 'SUBMITTED');

    return {
      sessionId: sid,
      teachers: filtered,
      stats: {
        totalTeachers,
        compliantCount,
        inProgressCount,
        nonCompliantCount: Math.max(0, totalTeachers - compliantCount - inProgressCount),
        avgEffectiveHours,
        totalLoggedRecords: allRecords.length,
        pendingApprovalsCount: pendingApprovals.length,
      },
      pendingApprovals,
    };
  },

  getTeacherCpdDetail(schoolId, teacherId, sessionId) {
    const { teachers } = this.listTeacherCpdSummaries(schoolId, sessionId);
    const found = teachers.find((t) => t.teacherId === teacherId || normStr(t.name) === normStr(teacherId));
    if (!found) throw new Error('Teacher not found');
    return found;
  },

  getMyCpd(schoolId, sessionId, actor) {
    const { tenant } = getTenantState(schoolId);
    const sid = resolveEffectiveSessionId(tenant, sessionId);
    const teacher = resolveActorTeacher(tenant, schoolId, sid, actor);
    const { teachers } = this.listTeacherCpdSummaries(schoolId, sid);
    const matched = teachers.find((t) => t.teacherId === teacher.id || normStr(t.name) === normStr(teacher.name));
    if (matched) return matched;
    return computeTeacherCpdSummary(teacher, []);
  },

  createTrainingRecord(schoolId, sessionId, payload, actor = {}, { isAdmin = false } = {}) {
    const { root, tenant } = getTenantState(schoolId);
    const sid = resolveEffectiveSessionId(tenant, sessionId);
    const { mergedTeachers } = getMergedErpEntities(tenant, schoolId, sid);

    let targetIds = [];
    if (isAdmin && Array.isArray(payload.teacherIds) && payload.teacherIds.length > 0) {
      targetIds = payload.teacherIds;
    } else if (isAdmin && payload.teacherId) {
      targetIds = [payload.teacherId];
    } else {
      const selfTeacher = resolveActorTeacher(tenant, schoolId, sid, actor);
      targetIds = [selfTeacher.id];
    }

    const created = [];
    for (const tid of targetIds) {
      const tObj = mergedTeachers.find((t) => t.id === tid) || { id: tid, name: payload.teacherName || actor?.name || 'Teacher' };
      const rec = {
        id: uid('trg'),
        sessionId: sid,
        teacherId: tObj.id,
        teacherName: tObj.name,
        title: String(payload.title || '').trim(),
        provider: payload.provider || 'CBSE',
        domain: payload.domain || 'KNOWLEDGE_PRACTICE',
        annexure: payload.annexure || 'ANNEXURE_II',
        hours: Number(payload.hours || 6),
        mode: payload.mode || 'OFFLINE',
        trainingDate: payload.trainingDate || new Date().toISOString().slice(0, 10),
        certificateNo: payload.certificateNo || '',
        organizer: payload.organizer || '',
        notes: payload.notes || '',
        status: isAdmin ? (payload.status || 'VERIFIED') : 'SUBMITTED',
        createdAt: new Date().toISOString(),
      };
      if (!rec.title) throw new Error('Training topic / title is required');
      tenant.teacherTrainings.unshift(rec);
      created.push(rec);
    }

    writeRootStore(root);
    return created.length === 1 ? created[0] : created;
  },

  updateTrainingRecord(schoolId, recordId, payload, { isAdmin = false } = {}) {
    const { root, tenant } = getTenantState(schoolId);
    const idx = tenant.teacherTrainings.findIndex((r) => r.id === recordId);
    if (idx === -1) throw new Error('Training record not found');
    const prev = tenant.teacherTrainings[idx];
    const next = {
      ...prev,
      ...payload,
      id: prev.id,
      sessionId: prev.sessionId,
      teacherId: prev.teacherId,
      hours: payload.hours !== undefined ? Number(payload.hours) : prev.hours,
      updatedAt: new Date().toISOString(),
    };
    if (!isAdmin && payload.status) {
      // Teachers cannot self-verify
      next.status = prev.status === 'REJECTED' ? 'SUBMITTED' : prev.status;
    }
    tenant.teacherTrainings[idx] = next;
    writeRootStore(root);
    return next;
  },

  deleteTrainingRecord(schoolId, recordId) {
    const { root, tenant } = getTenantState(schoolId);
    tenant.teacherTrainings = tenant.teacherTrainings.filter((r) => r.id !== recordId);
    writeRootStore(root);
    return { deleted: true };
  },
};
