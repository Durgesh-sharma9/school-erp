// Complete 1:1 In-Memory & Database-backed Store for Academics / Master Module (Clean Fresh State)

export let classesStore = [];
export let subjectGroupsStore = [];
export let subjectsStore = [];
export let streamsStore = [];
export let subjectLinksStore = [];

// ==========================================
// 1. CLASS CONTROLLER (Multi-Tenant Partitioned)
// ==========================================
const TENANT_CLASSES = {
  'sch_jd_intl': classesStore,
  'sch_dps_branch2': []
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
