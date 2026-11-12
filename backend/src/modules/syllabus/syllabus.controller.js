import jwt from 'jsonwebtoken';
import { syllabusService } from './syllabus.service.js';

function getContext(req) {
  let jwtUser = req.user || null;
  if (!jwtUser && req.headers.authorization?.startsWith('Bearer ')) {
    const token = req.headers.authorization.split(' ')[1];
    try {
      const secret = process.env.JWT_SECRET;
      jwtUser = secret ? jwt.verify(token, secret) : jwt.decode(token);
    } catch {
      jwtUser = jwt.decode(token) || null;
    }
  }

  const schoolId = req.schoolId || jwtUser?.schoolId || req.headers['x-school-id'] || 'sch_jd_intl';
  const sessionId = req.headers['x-session-id'] || req.query.sessionId || req.body?.sessionId || undefined;
  const role = String(jwtUser?.role || req.headers['x-user-role'] || 'ADMIN').toUpperCase();
  const actor = {
    userId: jwtUser?.id || jwtUser?.userId || req.headers['x-user-id'] || '',
    name: jwtUser?.name || req.headers['x-user-name'] || '',
    email: jwtUser?.email || '',
    empCode: jwtUser?.empCode || req.headers['x-emp-code'] || '',
    role,
  };
  const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN' || role === 'SCHOOL_ADMIN';
  return { schoolId, sessionId, actor, role, isAdmin };
}

function handleErr(res, err) {
  const msg = err?.message || 'Operation failed';
  const status = msg.toLowerCase().includes('not found') ? 404 : 400;
  return res.status(status).json({ success: false, message: msg });
}

// =====================================================================
// SESSIONS
// =====================================================================
export const listSessions = (req, res) => {
  try {
    const { schoolId } = getContext(req);
    return res.json({ success: true, data: syllabusService.listSessions(schoolId) });
  } catch (err) {
    return handleErr(res, err);
  }
};

export const createSession = (req, res) => {
  try {
    const { schoolId } = getContext(req);
    const data = syllabusService.createSession(schoolId, req.body || {});
    return res.status(201).json({ success: true, data });
  } catch (err) {
    return handleErr(res, err);
  }
};

export const updateSession = (req, res) => {
  try {
    const { schoolId } = getContext(req);
    const data = syllabusService.updateSession(schoolId, req.params.id, req.body || {});
    return res.json({ success: true, data });
  } catch (err) {
    return handleErr(res, err);
  }
};

export const switchSession = (req, res) => {
  try {
    const { schoolId } = getContext(req);
    const id = req.params.id || req.body?.sessionId;
    const data = syllabusService.switchSession(schoolId, id);
    return res.json({ success: true, data });
  } catch (err) {
    return handleErr(res, err);
  }
};

export const archiveSession = (req, res) => {
  try {
    const { schoolId } = getContext(req);
    const data = syllabusService.archiveSession(schoolId, req.params.id);
    return res.json({ success: true, data });
  } catch (err) {
    return handleErr(res, err);
  }
};

export const deleteSession = (req, res) => {
  try {
    const { schoolId } = getContext(req);
    const data = syllabusService.deleteSession(schoolId, req.params.id);
    return res.json({ success: true, data });
  } catch (err) {
    return handleErr(res, err);
  }
};

export const importSessionData = (req, res) => {
  try {
    const { schoolId } = getContext(req);
    const { type } = req.params;
    const data = syllabusService.importFromSession(schoolId, type, req.body || {});
    return res.json({ success: true, data });
  } catch (err) {
    return handleErr(res, err);
  }
};

// =====================================================================
// ACADEMIC TIMELINE
// =====================================================================
export const listAcademicTerms = (req, res) => {
  try {
    const { schoolId, sessionId } = getContext(req);
    const data = syllabusService.listAcademicTerms(schoolId, sessionId);
    return res.json({ success: true, data });
  } catch (err) {
    return handleErr(res, err);
  }
};

export const createAcademicTerm = (req, res) => {
  try {
    const { schoolId } = getContext(req);
    const data = syllabusService.createAcademicTerm(schoolId, req.body || {});
    return res.status(201).json({ success: true, data });
  } catch (err) {
    return handleErr(res, err);
  }
};

export const updateAcademicTerm = (req, res) => {
  try {
    const { schoolId } = getContext(req);
    const data = syllabusService.updateAcademicTerm(schoolId, req.params.id, req.body || {});
    return res.json({ success: true, data });
  } catch (err) {
    return handleErr(res, err);
  }
};

export const deleteAcademicTerm = (req, res) => {
  try {
    const { schoolId } = getContext(req);
    const data = syllabusService.deleteAcademicTerm(schoolId, req.params.id);
    return res.json({ success: true, data });
  } catch (err) {
    return handleErr(res, err);
  }
};

export const addVacationPeriod = (req, res) => {
  try {
    const { schoolId } = getContext(req);
    const data = syllabusService.addVacationPeriod(schoolId, req.params.id, req.body || {});
    return res.status(201).json({ success: true, data });
  } catch (err) {
    return handleErr(res, err);
  }
};

export const deleteVacationPeriod = (req, res) => {
  try {
    const { schoolId } = getContext(req);
    const data = syllabusService.deleteVacationPeriod(schoolId, req.params.id, req.params.vacId);
    return res.json({ success: true, data });
  } catch (err) {
    return handleErr(res, err);
  }
};

// =====================================================================
// SYLLABUS STRUCTURE, TEACHER CLASSES & PROGRESS
// =====================================================================
export const getSyllabusTree = (req, res) => {
  try {
    const { schoolId, sessionId } = getContext(req);
    const { search = '', termTag = '' } = req.query;
    const data = syllabusService.getSyllabusTree(schoolId, sessionId, { search, termTag });
    return res.json({ success: true, data });
  } catch (err) {
    return handleErr(res, err);
  }
};

export const linkSubjectToClass = (req, res) => {
  try {
    const { schoolId, sessionId } = getContext(req);
    const data = syllabusService.linkSubjectToClass(schoolId, sessionId, req.body || {});
    return res.status(201).json({ success: true, data });
  } catch (err) {
    return handleErr(res, err);
  }
};

export const updateSubjectTeacher = (req, res) => {
  try {
    const { schoolId } = getContext(req);
    const data = syllabusService.updateSubjectTeacher(schoolId, req.params.id, req.body || {});
    return res.json({ success: true, data });
  } catch (err) {
    return handleErr(res, err);
  }
};

export const createChapter = (req, res) => {
  try {
    const { schoolId, sessionId } = getContext(req);
    const data = syllabusService.createChapter(schoolId, sessionId, req.body || {});
    return res.status(201).json({ success: true, data });
  } catch (err) {
    return handleErr(res, err);
  }
};

export const updateChapter = (req, res) => {
  try {
    const { schoolId } = getContext(req);
    const data = syllabusService.updateChapter(schoolId, req.params.id, req.body || {});
    return res.json({ success: true, data });
  } catch (err) {
    return handleErr(res, err);
  }
};

export const deleteChapter = (req, res) => {
  try {
    const { schoolId } = getContext(req);
    const data = syllabusService.deleteChapter(schoolId, req.params.id);
    return res.json({ success: true, data });
  } catch (err) {
    return handleErr(res, err);
  }
};

export const updateChapterProgress = (req, res) => {
  try {
    const { schoolId, actor } = getContext(req);
    const data = syllabusService.updateChapterProgress(schoolId, req.params.chapterId, actor, req.body || {});
    return res.json({ success: true, data });
  } catch (err) {
    return handleErr(res, err);
  }
};

export const getTeacherAssignedClasses = (req, res) => {
  try {
    const { schoolId, sessionId, actor } = getContext(req);
    const data = syllabusService.getTeacherAssignedClasses(schoolId, sessionId, actor);
    return res.json({ success: true, data });
  } catch (err) {
    return handleErr(res, err);
  }
};

export const getTeacherClassDetail = (req, res) => {
  try {
    const { schoolId, sessionId, actor } = getContext(req);
    const result = syllabusService.getTeacherAssignedClasses(schoolId, sessionId, actor);
    const cls = result.classes.find((c) => c.id.toLowerCase() === String(req.params.id).toLowerCase());
    if (!cls) return res.status(404).json({ success: false, message: 'Assigned class not found' });
    return res.json({ success: true, data: { ...cls, teacher: result.teacher } });
  } catch (err) {
    return handleErr(res, err);
  }
};

// =====================================================================
// DASHBOARD & PROGRESSION
// =====================================================================
export const getDashboardAnalytics = (req, res) => {
  try {
    const { schoolId, sessionId } = getContext(req);
    const data = syllabusService.getDashboardAnalytics(schoolId, sessionId);
    return res.json({ success: true, data });
  } catch (err) {
    return handleErr(res, err);
  }
};

export const getTeacherDrilldown = (req, res) => {
  try {
    const { schoolId, sessionId } = getContext(req);
    const data = syllabusService.getTeacherDrilldown(schoolId, req.params.teacherName, sessionId);
    return res.json({ success: true, data });
  } catch (err) {
    return handleErr(res, err);
  }
};

export const getProgressionAnalytics = (req, res) => {
  try {
    const { schoolId, sessionId } = getContext(req);
    const { termTag = 'ALL' } = req.query;
    const data = syllabusService.getProgressionAnalytics(schoolId, sessionId, { termTag });
    return res.json({ success: true, data });
  } catch (err) {
    return handleErr(res, err);
  }
};

export const updatePacingSettings = (req, res) => {
  try {
    const { schoolId } = getContext(req);
    const data = syllabusService.updatePacingSettings(schoolId, req.body || {});
    return res.json({ success: true, data });
  } catch (err) {
    return handleErr(res, err);
  }
};

export const getTeacherProgression = (req, res) => {
  try {
    const { schoolId, sessionId, actor } = getContext(req);
    const data = syllabusService.getTeacherProgression(schoolId, sessionId, actor);
    return res.json({ success: true, data });
  } catch (err) {
    return handleErr(res, err);
  }
};

// =====================================================================
// EXAM PAPERS & TEMPLATE
// =====================================================================
export const listExamPapers = (req, res) => {
  try {
    const { schoolId, sessionId, actor, role } = getContext(req);
    const data = syllabusService.listExamPapers(schoolId, sessionId, { ...req.query, role, actor });
    return res.json({ success: true, data });
  } catch (err) {
    return handleErr(res, err);
  }
};

export const getExamPaper = (req, res) => {
  try {
    const { schoolId } = getContext(req);
    const data = syllabusService.getExamPaper(schoolId, req.params.id);
    return res.json({ success: true, data });
  } catch (err) {
    return handleErr(res, err);
  }
};

export const createExamPaper = (req, res) => {
  try {
    const { schoolId, sessionId, actor } = getContext(req);
    const data = syllabusService.createExamPaper(schoolId, sessionId, req.body || {}, actor);
    return res.status(201).json({ success: true, data });
  } catch (err) {
    return handleErr(res, err);
  }
};

export const updateExamPaper = (req, res) => {
  try {
    const { schoolId } = getContext(req);
    const data = syllabusService.updateExamPaper(schoolId, req.params.id, req.body || {});
    return res.json({ success: true, data });
  } catch (err) {
    return handleErr(res, err);
  }
};

export const deleteExamPaper = (req, res) => {
  try {
    const { schoolId } = getContext(req);
    const data = syllabusService.deleteExamPaper(schoolId, req.params.id);
    return res.json({ success: true, data });
  } catch (err) {
    return handleErr(res, err);
  }
};

export const getExamNames = (req, res) => {
  try {
    const { schoolId } = getContext(req);
    return res.json({ success: true, data: syllabusService.getExamNames(schoolId) });
  } catch (err) {
    return handleErr(res, err);
  }
};

export const updateExamNames = (req, res) => {
  try {
    const { schoolId } = getContext(req);
    const names = req.body?.names || req.body?.examNames || [];
    return res.json({ success: true, data: syllabusService.updateExamNames(schoolId, names) });
  } catch (err) {
    return handleErr(res, err);
  }
};

export const getExamTemplate = (req, res) => {
  try {
    const { schoolId } = getContext(req);
    return res.json({ success: true, data: syllabusService.getExamTemplate(schoolId) });
  } catch (err) {
    return handleErr(res, err);
  }
};

export const saveExamTemplate = (req, res) => {
  try {
    const { schoolId } = getContext(req);
    return res.json({ success: true, data: syllabusService.saveExamTemplate(schoolId, req.body || {}) });
  } catch (err) {
    return handleErr(res, err);
  }
};

// =====================================================================
// TEACHER TRAINING (CBSE 50h CPD)
// =====================================================================
export const getTrainingCatalog = (_req, res) => {
  return res.json({ success: true, data: syllabusService.getTrainingCatalog() });
};

export const listTeacherCpd = (req, res) => {
  try {
    const { schoolId, sessionId } = getContext(req);
    const data = syllabusService.listTeacherCpdSummaries(schoolId, sessionId, req.query || {});
    return res.json({ success: true, data });
  } catch (err) {
    return handleErr(res, err);
  }
};

export const getTeacherCpdDetail = (req, res) => {
  try {
    const { schoolId, sessionId } = getContext(req);
    const data = syllabusService.getTeacherCpdDetail(schoolId, req.params.teacherId, sessionId);
    return res.json({ success: true, data });
  } catch (err) {
    return handleErr(res, err);
  }
};

export const getMyCpd = (req, res) => {
  try {
    const { schoolId, sessionId, actor } = getContext(req);
    const data = syllabusService.getMyCpd(schoolId, sessionId, actor);
    return res.json({ success: true, data });
  } catch (err) {
    return handleErr(res, err);
  }
};

export const createTrainingRecord = (req, res) => {
  try {
    const { schoolId, sessionId, actor, isAdmin } = getContext(req);
    const forceTeacherMode = req.path.endsWith('/my');
    const data = syllabusService.createTrainingRecord(schoolId, sessionId, req.body || {}, actor, {
      isAdmin: forceTeacherMode ? false : isAdmin,
    });
    return res.status(201).json({ success: true, data });
  } catch (err) {
    return handleErr(res, err);
  }
};

export const updateTrainingRecord = (req, res) => {
  try {
    const { schoolId, isAdmin } = getContext(req);
    const data = syllabusService.updateTrainingRecord(schoolId, req.params.id, req.body || {}, { isAdmin });
    return res.json({ success: true, data });
  } catch (err) {
    return handleErr(res, err);
  }
};

export const deleteTrainingRecord = (req, res) => {
  try {
    const { schoolId } = getContext(req);
    const data = syllabusService.deleteTrainingRecord(schoolId, req.params.id);
    return res.json({ success: true, data });
  } catch (err) {
    return handleErr(res, err);
  }
};
