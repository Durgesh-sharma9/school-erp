// Official CBSE Circular No. TRG-02/2025 CPD Catalog & Default Curriculum / Timeline Constants

export const DOMAIN_INFO = {
  CORE_VALUES_ETHICS: {
    id: 'CORE_VALUES_ETHICS',
    title: 'Domain 1: Core Values and Ethics',
    totalHours: 12,
    cbseHours: 6,
    schoolHours: 6,
    color: '#6366f1',
    description: 'Annexure-I topics: 6h Offline by CBSE + 6h Offline/Online by School or aligned with NPST Standard.',
  },
  KNOWLEDGE_PRACTICE: {
    id: 'KNOWLEDGE_PRACTICE',
    title: 'Domain 2: Knowledge and Practice',
    totalHours: 24,
    cbseHours: 16,
    schoolHours: 8,
    color: '#0ea5e9',
    description: 'Annexure-II topics: 16h CBSE (12h offline subject + 4h other) + 8h School (6h offline + 2h).',
  },
  PROFESSIONAL_GROWTH: {
    id: 'PROFESSIONAL_GROWTH',
    title: 'Domain 3: Professional Growth and Development',
    totalHours: 14,
    cbseHours: 3,
    schoolHours: 11,
    color: '#10b981',
    description: 'Annexure-III topics & Academic activities: 3h CBSE + 11h School (up to 11h academic activities).',
  },
};

export const ANNEXURE_I_TOPICS = [
  { id: 'ann1-1', title: 'Adolescent Education Programme', domain: 'CORE_VALUES_ETHICS', annexure: 'ANNEXURE_I', defaultHours: 12, description: '2 Days = 12 hours' },
  { id: 'ann1-2', title: 'Ethics & Integrity', domain: 'CORE_VALUES_ETHICS', annexure: 'ANNEXURE_I', defaultHours: 12, description: '2 Days = 12 hours' },
  { id: 'ann1-3', title: 'Gender Sensitivity in Schools', domain: 'CORE_VALUES_ETHICS', annexure: 'ANNEXURE_I', defaultHours: 6, description: '1 Day = 06 hours' },
  { id: 'ann1-4', title: 'Inclusive Education', domain: 'CORE_VALUES_ETHICS', annexure: 'ANNEXURE_I', defaultHours: 12, description: '2 Days = 12 hours' },
  { id: 'ann1-5', title: 'Life skills (Advance)', domain: 'CORE_VALUES_ETHICS', annexure: 'ANNEXURE_I', defaultHours: 6, description: '1 Day = 06 hours' },
  { id: 'ann1-6', title: 'Life skills (Basic)', domain: 'CORE_VALUES_ETHICS', annexure: 'ANNEXURE_I', defaultHours: 6, description: '1 Day = 06 hours' },
  { id: 'ann1-7', title: 'Promoting Mental Health and Wellness among Students', domain: 'CORE_VALUES_ETHICS', annexure: 'ANNEXURE_I', defaultHours: 6, description: '1 Day = 06 hours' },
  { id: 'ann1-8', title: 'School Health & Wellness', domain: 'CORE_VALUES_ETHICS', annexure: 'ANNEXURE_I', defaultHours: 12, description: '2 Days = 12 hours' },
  { id: 'ann1-9', title: 'Values Education', domain: 'CORE_VALUES_ETHICS', annexure: 'ANNEXURE_I', defaultHours: 6, description: '1 Day = 06 hours' },
];

export const ANNEXURE_II_TOPICS = [
  { id: 'ann2-1', title: 'School Libraries', domain: 'KNOWLEDGE_PRACTICE', annexure: 'ANNEXURE_II', defaultHours: 6, description: '1 Day = 06 hours' },
  { id: 'ann2-2', title: 'Active Learning', domain: 'KNOWLEDGE_PRACTICE', annexure: 'ANNEXURE_II', defaultHours: 6, description: '1 Day = 06 hours' },
  { id: 'ann2-3', title: 'Art Integration', domain: 'KNOWLEDGE_PRACTICE', annexure: 'ANNEXURE_II', defaultHours: 6, description: '1 Day = 06 hours' },
  { id: 'ann2-4', title: 'Competency-Based Assessment (Secondary Level)- Generic', domain: 'KNOWLEDGE_PRACTICE', annexure: 'ANNEXURE_II', defaultHours: 12, description: '2 Days = 12 hours' },
  { id: 'ann2-5', title: 'Critical & Creative Thinking', domain: 'KNOWLEDGE_PRACTICE', annexure: 'ANNEXURE_II', defaultHours: 12, description: '2 Days = 12 hours' },
  { id: 'ann2-6', title: 'Experiential Learning', domain: 'KNOWLEDGE_PRACTICE', annexure: 'ANNEXURE_II', defaultHours: 12, description: '2 Days = 12 hours' },
  { id: 'ann2-7', title: 'Learning outcomes & Pedagogies', domain: 'KNOWLEDGE_PRACTICE', annexure: 'ANNEXURE_II', defaultHours: 6, description: '1 Day = 06 hours' },
  { id: 'ann2-8', title: 'Storytelling as Pedagogy', domain: 'KNOWLEDGE_PRACTICE', annexure: 'ANNEXURE_II', defaultHours: 6, description: '1 Day = 06 hours' },
  { id: 'ann2-9', title: 'Strengthening Assessment & Evaluation Practices', domain: 'KNOWLEDGE_PRACTICE', annexure: 'ANNEXURE_II', defaultHours: 12, description: '2 Days = 12 hours' },
  { id: 'ann2-10', title: 'Biology (Senior Secondary Classes)', domain: 'KNOWLEDGE_PRACTICE', annexure: 'ANNEXURE_II', defaultHours: 12, description: '2 Days = 12 hours' },
  { id: 'ann2-11', title: 'Chemistry (Senior Secondary Classes)', domain: 'KNOWLEDGE_PRACTICE', annexure: 'ANNEXURE_II', defaultHours: 12, description: '2 Days = 12 hours' },
  { id: 'ann2-12', title: 'Environmental Studies (Elementary Classes)', domain: 'KNOWLEDGE_PRACTICE', annexure: 'ANNEXURE_II', defaultHours: 6, description: '1 Day = 06 hours' },
  { id: 'ann2-13', title: 'Physics (Senior Secondary Classes)', domain: 'KNOWLEDGE_PRACTICE', annexure: 'ANNEXURE_II', defaultHours: 12, description: '2 Days = 12 hours' },
  { id: 'ann2-14', title: 'Python (Senior Secondary Classes)- Computer Science', domain: 'KNOWLEDGE_PRACTICE', annexure: 'ANNEXURE_II', defaultHours: 12, description: '2 Days = 12 hours' },
  { id: 'ann2-16', title: 'Python (Basic)', domain: 'KNOWLEDGE_PRACTICE', annexure: 'ANNEXURE_II', defaultHours: 6, description: '1 Day = 06 hours' },
  { id: 'ann2-17', title: 'Mathematics (Secondary Classes)', domain: 'KNOWLEDGE_PRACTICE', annexure: 'ANNEXURE_II', defaultHours: 12, description: '2 Days = 12 hours' },
  { id: 'ann2-18', title: 'Science (Secondary Classes)', domain: 'KNOWLEDGE_PRACTICE', annexure: 'ANNEXURE_II', defaultHours: 12, description: '2 Days = 12 hours' },
  { id: 'ann2-19', title: 'Mathematics (Elementary Classes)', domain: 'KNOWLEDGE_PRACTICE', annexure: 'ANNEXURE_II', defaultHours: 12, description: '2 Days = 12 hours' },
  { id: 'ann2-20', title: 'Science (Elementary Classes)', domain: 'KNOWLEDGE_PRACTICE', annexure: 'ANNEXURE_II', defaultHours: 6, description: '1 Day = 06 hours' },
  { id: 'ann2-21', title: 'Joyful Mathematics', domain: 'KNOWLEDGE_PRACTICE', annexure: 'ANNEXURE_II', defaultHours: 12, description: '2 Days = 12 hours' },
  { id: 'ann2-22', title: 'Competency Based Assessment (Secondary Level)- Mathematics', domain: 'KNOWLEDGE_PRACTICE', annexure: 'ANNEXURE_II', defaultHours: 12, description: '2 Days = 12 hours' },
  { id: 'ann2-23', title: 'Competency Based Assessment (Secondary Level)- Science', domain: 'KNOWLEDGE_PRACTICE', annexure: 'ANNEXURE_II', defaultHours: 12, description: '2 Days = 12 hours' },
  { id: 'ann2-24', title: 'Cyber Safety & Security', domain: 'KNOWLEDGE_PRACTICE', annexure: 'ANNEXURE_II', defaultHours: 6, description: '1 Day = 06 hours' },
  { id: 'ann2-25', title: 'Disaster Management', domain: 'KNOWLEDGE_PRACTICE', annexure: 'ANNEXURE_II', defaultHours: 6, description: '1 Day = 06 hours' },
  { id: 'ann2-26', title: 'Environmental Education and Conservation of Natural Resources', domain: 'KNOWLEDGE_PRACTICE', annexure: 'ANNEXURE_II', defaultHours: 6, description: '1 Day = 06 hours' },
  { id: 'ann2-27', title: 'Use of Artificial Intelligence in Classrooms', domain: 'KNOWLEDGE_PRACTICE', annexure: 'ANNEXURE_II', defaultHours: 6, description: '1 Day = 06 hours' },
  { id: 'ann2-36', title: 'Hindi Course-A (Secondary Classes)', domain: 'KNOWLEDGE_PRACTICE', annexure: 'ANNEXURE_II', defaultHours: 12, description: '2 Days = 12 hours' },
  { id: 'ann2-37', title: 'Social Science (Secondary Classes)', domain: 'KNOWLEDGE_PRACTICE', annexure: 'ANNEXURE_II', defaultHours: 12, description: '2 Days = 12 hours' },
  { id: 'ann2-39', title: 'English Language literature', domain: 'KNOWLEDGE_PRACTICE', annexure: 'ANNEXURE_II', defaultHours: 12, description: '2 Days = 12 hours' },
];

export const ANNEXURE_III_TOPICS = [
  { id: 'ann3-1', title: 'National Curriculum Framework for School Education 2023 (NCF-SE)', domain: 'PROFESSIONAL_GROWTH', annexure: 'ANNEXURE_III', defaultHours: 6, description: '1 Day = 06 hours' },
  { id: 'ann3-2', title: 'National Curriculum Framework: Foundational Stage', domain: 'PROFESSIONAL_GROWTH', annexure: 'ANNEXURE_III', defaultHours: 6, description: '1 Day = 06 hours' },
  { id: 'ann3-3', title: 'Theory of Knowledge', domain: 'PROFESSIONAL_GROWTH', annexure: 'ANNEXURE_III', defaultHours: 6, description: '1 Day = 06 hours' },
  { id: 'ann3-4', title: 'National Education Policy 2020 (NEP 2020)', domain: 'PROFESSIONAL_GROWTH', annexure: 'ANNEXURE_III', defaultHours: 6, description: '1 Day = 06 hours' },
  { id: 'ann3-5', title: 'Happy Classrooms', domain: 'PROFESSIONAL_GROWTH', annexure: 'ANNEXURE_III', defaultHours: 6, description: '1 Day = 06 hours' },
  { id: 'ann3-6', title: 'Stress Management', domain: 'PROFESSIONAL_GROWTH', annexure: 'ANNEXURE_III', defaultHours: 6, description: '1 Day = 06 hours' },
  { id: 'ann3-7', title: 'Classroom Management', domain: 'PROFESSIONAL_GROWTH', annexure: 'ANNEXURE_III', defaultHours: 12, description: '2 Days = 12 hours' },
  { id: 'ann3-8', title: 'Career Guidance', domain: 'PROFESSIONAL_GROWTH', annexure: 'ANNEXURE_III', defaultHours: 12, description: '2 Days = 12 hours' },
  { id: 'ann3-9', title: 'Induction Training Programme (Guru Dakshta)', domain: 'PROFESSIONAL_GROWTH', annexure: 'ANNEXURE_III', defaultHours: 12, description: '2 Days = 12 hours' },
  { id: 'ann3-10', title: 'Leading Transformation', domain: 'PROFESSIONAL_GROWTH', annexure: 'ANNEXURE_III', defaultHours: 18, description: '3 Days = 18 hours' },
];

export const ACADEMIC_ACTIVITIES = [
  { id: 'act-1', title: 'Board Examination Evaluation duty as Examiner / AHE / HE (assigned by RO)', domain: 'PROFESSIONAL_GROWTH', annexure: 'ACADEMIC_ACTIVITY', defaultHours: 6, description: 'Max 6 Hrs' },
  { id: 'act-2', title: 'SQP / Marking Scheme / Item Development / Question Bank / Practical Examiner', domain: 'PROFESSIONAL_GROWTH', annexure: 'ACADEMIC_ACTIVITY', defaultHours: 3, description: 'Max 3 Hrs' },
  { id: 'act-3', title: 'Research Projects / Mentoring fellow teachers / Reflective Journals / Educational Blogs', domain: 'PROFESSIONAL_GROWTH', annexure: 'ACADEMIC_ACTIVITY', defaultHours: 2, description: 'Max 2 Hrs' },
  { id: 'act-4', title: 'Engaged as RP (Resource Person) for conducting CBSE CBPs', domain: 'PROFESSIONAL_GROWTH', annexure: 'ACADEMIC_ACTIVITY', defaultHours: 3, description: 'Max 3 Hrs' },
  { id: 'act-5', title: 'Viewing DD PM e-Vidya Channel CBSE 15 / Eklavya 3030 STEM Education', domain: 'PROFESSIONAL_GROWTH', annexure: 'ACADEMIC_ACTIVITY', defaultHours: 3, description: 'Max 3 Hrs' },
  { id: 'act-6', title: 'Integrating technology into teaching', domain: 'PROFESSIONAL_GROWTH', annexure: 'ACADEMIC_ACTIVITY', defaultHours: 2, description: 'Max 2 Hrs' },
  { id: 'act-7', title: 'Presentations / Participation in CBSE National-Conferences', domain: 'PROFESSIONAL_GROWTH', annexure: 'ACADEMIC_ACTIVITY', defaultHours: 3, description: 'Max 3 Hrs' },
];

export const CPD_STANDARDS = {
  totalHoursRequired: 50,
  cbseQuotaRequired: 25,
  schoolQuotaRequired: 25,
  domains: {
    CORE_VALUES_ETHICS: { required: 12, name: 'Core Values & Ethics (D1)' },
    KNOWLEDGE_PRACTICE: { required: 24, name: 'Knowledge & Practice (D2)' },
    PROFESSIONAL_GROWTH: { required: 14, name: 'Professional Growth & Development (D3)', maxAcademicActivities: 11 },
  },
};

export const INDIAN_PUBLIC_HOLIDAYS_BY_YEAR = {
  2025: [
    { date: '2025-01-26', name: 'Republic Day' },
    { date: '2025-03-14', name: 'Holi' },
    { date: '2025-03-31', name: 'Eid-ul-Fitr' },
    { date: '2025-04-14', name: 'Ambedkar Jayanti' },
    { date: '2025-04-18', name: 'Good Friday' },
    { date: '2025-08-15', name: 'Independence Day' },
    { date: '2025-08-16', name: 'Janmashtami' },
    { date: '2025-10-02', name: 'Gandhi Jayanti / Dussehra' },
    { date: '2025-10-20', name: 'Diwali' },
    { date: '2025-11-05', name: 'Guru Nanak Jayanti' },
    { date: '2025-12-25', name: 'Christmas Day' },
  ],
  2026: [
    { date: '2026-01-26', name: 'Republic Day' },
    { date: '2026-03-04', name: 'Holi' },
    { date: '2026-03-20', name: 'Eid-ul-Fitr' },
    { date: '2026-04-03', name: 'Good Friday' },
    { date: '2026-04-14', name: 'Ambedkar Jayanti' },
    { date: '2026-08-15', name: 'Independence Day' },
    { date: '2026-08-28', name: 'Raksha Bandhan' },
    { date: '2026-09-04', name: 'Janmashtami' },
    { date: '2026-10-02', name: 'Gandhi Jayanti' },
    { date: '2026-10-20', name: 'Dussehra (Vijayadashami)' },
    { date: '2026-11-08', name: 'Diwali' },
    { date: '2026-11-24', name: 'Guru Nanak Jayanti' },
    { date: '2026-12-25', name: 'Christmas Day' },
  ],
  2027: [
    { date: '2027-01-26', name: 'Republic Day' },
    { date: '2027-03-22', name: 'Holi' },
    { date: '2027-03-26', name: 'Good Friday' },
    { date: '2027-04-14', name: 'Ambedkar Jayanti' },
    { date: '2027-08-15', name: 'Independence Day' },
    { date: '2027-10-02', name: 'Gandhi Jayanti' },
    { date: '2027-10-29', name: 'Diwali' },
    { date: '2027-12-25', name: 'Christmas Day' },
  ],
};

export function getIndianHolidaysInRange(startDateStr, endDateStr) {
  const result = [];
  const startYear = new Date(startDateStr).getFullYear();
  const endYear = new Date(endDateStr).getFullYear();
  for (let yr = startYear; yr <= endYear; yr++) {
    const list = INDIAN_PUBLIC_HOLIDAYS_BY_YEAR[yr] || [];
    for (const h of list) {
      if (h.date >= startDateStr && h.date <= endDateStr) {
        result.push({ ...h });
      }
    }
  }
  return result;
}
