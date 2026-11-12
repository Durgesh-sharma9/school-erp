// Centralized API client & View-Session state helper for Syllabus Tracker module

const API_BASE = '/api/syllabus-tracker';

function safeParseJson(str, fallback = null) {
  try {
    return str ? JSON.parse(str) : fallback;
  } catch {
    return fallback;
  }
}

export function getAuthContextHeaders(explicitSchoolId) {
  const user = safeParseJson(localStorage.getItem('uab_user'), {});
  const schoolId = explicitSchoolId || localStorage.getItem('active_school_id') || user?.schoolId || 'sch_jd_intl';
  const token = localStorage.getItem('token') || '';
  const viewingSess = getViewingSession(schoolId);

  const headers = {
    'Content-Type': 'application/json',
    'x-school-id': schoolId,
    'x-user-id': String(user?.id || ''),
    'x-user-name': String(user?.name || ''),
    'x-user-role': String(user?.role || 'ADMIN'),
    'x-emp-code': String(user?.empCode || ''),
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (viewingSess?.id) headers['x-session-id'] = viewingSess.id;
  return headers;
}

const VIEWING_SESSION_KEY = 'syllabus_viewing_session_v1';

export function getViewingSession(schoolId) {
  const id = schoolId || localStorage.getItem('active_school_id') || 'sch_jd_intl';
  const map = safeParseJson(localStorage.getItem(VIEWING_SESSION_KEY), {});
  return map?.[id] || null;
}

export function setViewingSession(schoolId, sessionObj) {
  const id = schoolId || localStorage.getItem('active_school_id') || 'sch_jd_intl';
  const map = safeParseJson(localStorage.getItem(VIEWING_SESSION_KEY), {});
  if (sessionObj) {
    map[id] = sessionObj;
  } else {
    delete map[id];
  }
  localStorage.setItem(VIEWING_SESSION_KEY, JSON.stringify(map));
  window.dispatchEvent(new CustomEvent('syllabus-session-changed', { detail: { schoolId: id, session: sessionObj } }));
}

async function request(path, options = {}) {
  const headers = {
    ...getAuthContextHeaders(options.schoolId),
    ...(options.headers || {}),
  };
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });
  const payload = await res.json().catch(() => ({ success: false, message: `HTTP ${res.status}` }));
  if (!res.ok || payload?.success === false) {
    throw new Error(payload?.message || `Request failed (${res.status})`);
  }
  return payload.data;
}

export const syllabusApi = {
  // Sessions
  listSessions: (schoolId) => request('/sessions', { schoolId }),
  createSession: (body, schoolId) => request('/sessions', { method: 'POST', body: JSON.stringify(body), schoolId }),
  updateSession: (id, body, schoolId) => request(`/sessions/${id}`, { method: 'PATCH', body: JSON.stringify(body), schoolId }),
  switchSession: (id, schoolId) => request(`/sessions/${id}/switch`, { method: 'POST', schoolId }),
  archiveSession: (id, schoolId) => request(`/sessions/${id}/archive`, { method: 'PATCH', schoolId }),
  deleteSession: (id, schoolId) => request(`/sessions/${id}`, { method: 'DELETE', schoolId }),
  importSessionData: (type, body, schoolId) =>
    request(`/sessions/import/${type}`, { method: 'POST', body: JSON.stringify(body), schoolId }),

  // Academic Timeline
  listAcademicTerms: (schoolId) => request('/academic-terms', { schoolId }),
  createAcademicTerm: (body, schoolId) => request('/academic-terms', { method: 'POST', body: JSON.stringify(body), schoolId }),
  updateAcademicTerm: (id, body, schoolId) => request(`/academic-terms/${id}`, { method: 'PATCH', body: JSON.stringify(body), schoolId }),
  deleteAcademicTerm: (id, schoolId) => request(`/academic-terms/${id}`, { method: 'DELETE', schoolId }),
  addVacationPeriod: (termId, body, schoolId) =>
    request(`/academic-terms/${termId}/vacations`, { method: 'POST', body: JSON.stringify(body), schoolId }),
  deleteVacationPeriod: (termId, vacId, schoolId) =>
    request(`/academic-terms/${termId}/vacations/${vacId}`, { method: 'DELETE', schoolId }),

  // Syllabus Structure & Progress
  getSyllabusTree: ({ search = '', termTag = '' } = {}, schoolId) => {
    const qs = new URLSearchParams();
    if (search) qs.set('search', search);
    if (termTag) qs.set('termTag', termTag);
    const queryStr = qs.toString();
    return request(`/tree${queryStr ? `?${queryStr}` : ''}`, { schoolId });
  },
  linkSubjectToClass: (body, schoolId) =>
    request('/class-subjects', { method: 'POST', body: JSON.stringify(body), schoolId }),
  updateSubjectTeacher: (classSubjectId, body, schoolId) =>
    request(`/class-subjects/${classSubjectId}/teacher`, { method: 'PATCH', body: JSON.stringify(body), schoolId }),
  createChapter: (body, schoolId) => request('/chapters', { method: 'POST', body: JSON.stringify(body), schoolId }),
  updateChapter: (id, body, schoolId) => request(`/chapters/${id}`, { method: 'PATCH', body: JSON.stringify(body), schoolId }),
  deleteChapter: (id, schoolId) => request(`/chapters/${id}`, { method: 'DELETE', schoolId }),
  updateChapterProgress: (chapterId, body, schoolId) =>
    request(`/progress/chapters/${chapterId}`, { method: 'PATCH', body: JSON.stringify(body), schoolId }),

  // Teacher Assigned Classes
  getTeacherClasses: (schoolId) => request('/classes/assigned', { schoolId }),
  getTeacherClassDetail: (classId, schoolId) => request(`/classes/${classId}`, { schoolId }),

  // Dashboard & Progression
  getDashboardAnalytics: (schoolId) => request('/dashboard/analytics', { schoolId }),
  getTeacherDrilldown: (teacherName, schoolId) =>
    request(`/dashboard/teacher-progress/${encodeURIComponent(teacherName)}`, { schoolId }),
  getProgressionAnalytics: ({ termTag = 'ALL' } = {}, schoolId) =>
    request(`/progression/analytics?termTag=${encodeURIComponent(termTag)}`, { schoolId }),
  updatePacingSettings: (body, schoolId) =>
    request('/progression/settings', { method: 'PATCH', body: JSON.stringify(body), schoolId }),
  getTeacherProgression: (schoolId) => request('/progression/teacher', { schoolId }),

  // Exam Papers & Templates
  listExamPapers: ({ status = '', classId = '', subjectId = '', search = '' } = {}, schoolId) => {
    const qs = new URLSearchParams();
    if (status) qs.set('status', status);
    if (classId) qs.set('classId', classId);
    if (subjectId) qs.set('subjectId', subjectId);
    if (search) qs.set('search', search);
    const s = qs.toString();
    return request(`/exam-papers${s ? `?${s}` : ''}`, { schoolId });
  },
  getExamPaper: (id, schoolId) => request(`/exam-papers/${id}`, { schoolId }),
  createExamPaper: (body, schoolId) => request('/exam-papers', { method: 'POST', body: JSON.stringify(body), schoolId }),
  updateExamPaper: (id, body, schoolId) => request(`/exam-papers/${id}`, { method: 'PATCH', body: JSON.stringify(body), schoolId }),
  deleteExamPaper: (id, schoolId) => request(`/exam-papers/${id}`, { method: 'DELETE', schoolId }),
  getExamNames: (schoolId) => request('/exam-papers/exam-names', { schoolId }),
  updateExamNames: (names, schoolId) =>
    request('/exam-papers/exam-names', { method: 'POST', body: JSON.stringify({ names }), schoolId }),
  getExamTemplate: (schoolId) => request('/exam-papers/template', { schoolId }),
  saveExamTemplate: (body, schoolId) =>
    request('/exam-papers/template', { method: 'POST', body: JSON.stringify(body), schoolId }),

  // Teacher Training (CBSE 50h CPD)
  getTrainingCatalog: (schoolId) => request('/trainings/catalog', { schoolId }),
  listTeacherCpd: ({ complianceStatus = 'ALL', search = '' } = {}, schoolId) => {
    const qs = new URLSearchParams();
    if (complianceStatus) qs.set('complianceStatus', complianceStatus);
    if (search) qs.set('search', search);
    return request(`/trainings?${qs.toString()}`, { schoolId });
  },
  getTeacherCpdDetail: (teacherId, schoolId) => request(`/trainings/teacher/${teacherId}`, { schoolId }),
  getMyCpd: (schoolId) => request('/trainings/my', { schoolId }),
  createTrainingRecord: (body, { isTeacherSelf = false, schoolId } = {}) =>
    request(isTeacherSelf ? '/trainings/my' : '/trainings', {
      method: 'POST',
      body: JSON.stringify(body),
      schoolId,
    }),
  updateTrainingRecord: (id, body, schoolId) =>
    request(`/trainings/${id}`, { method: 'PATCH', body: JSON.stringify(body), schoolId }),
  deleteTrainingRecord: (id, schoolId) => request(`/trainings/${id}`, { method: 'DELETE', schoolId }),
};
