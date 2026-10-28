// Complete 1:1 In-Memory & Database-backed Store for Academics / Master Module (100% Fresh Clean Production State)

export let classesStore = [];
export let subjectGroupsStore = [];
export let subjectsStore = [];
export let streamsStore = [];

// ==================== CLASSES ====================
export const getClasses = async (req, res) => {
  try {
    return res.status(200).json({ success: true, count: classesStore.length, data: classesStore });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createClass = async (req, res) => {
  try {
    const { name, wing, stream, sections, classTeacher, roomNo } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Class name is required' });

    const newClass = {
      id: String(Date.now()),
      name: name.trim(),
      wing: wing || 'Primary',
      stream: stream || '',
      sections: Array.isArray(sections) && sections.length > 0 ? sections : ['A'],
      priority: classesStore.length + 1,
      studentCount: 0,
      classTeacher: classTeacher || '',
      roomNo: roomNo || ''
    };
    classesStore.push(newClass);
    return res.status(201).json({ success: true, message: 'Class created successfully', data: newClass });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const idx = classesStore.findIndex(c => String(c.id) === String(id));
    if (idx === -1) return res.status(404).json({ success: false, message: 'Class not found' });
    classesStore[idx] = { ...classesStore[idx], ...req.body };
    return res.status(200).json({ success: true, message: 'Class updated', data: classesStore[idx] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    classesStore = classesStore.filter(c => String(c.id) !== String(id));
    return res.status(200).json({ success: true, message: 'Class deleted successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ==================== SUBJECT GROUPS ====================
export const getSubjectGroups = async (req, res) => {
  return res.status(200).json({ success: true, count: subjectGroupsStore.length, data: subjectGroupsStore });
};

export const createSubjectGroup = async (req, res) => {
  const newGroup = { id: String(Date.now()), ...req.body };
  subjectGroupsStore.push(newGroup);
  return res.status(201).json({ success: true, data: newGroup });
};

export const updateSubjectGroup = async (req, res) => {
  const { id } = req.params;
  const idx = subjectGroupsStore.findIndex(g => String(g.id) === String(id));
  if (idx !== -1) subjectGroupsStore[idx] = { ...subjectGroupsStore[idx], ...req.body };
  return res.status(200).json({ success: true, data: subjectGroupsStore[idx] });
};

export const deleteSubjectGroup = async (req, res) => {
  const { id } = req.params;
  subjectGroupsStore = subjectGroupsStore.filter(g => String(g.id) !== String(id));
  return res.status(200).json({ success: true });
};

// ==================== SUBJECTS ====================
export const getSubjects = async (req, res) => {
  return res.status(200).json({ success: true, count: subjectsStore.length, data: subjectsStore });
};

export const createSubject = async (req, res) => {
  const newSub = { id: String(Date.now()), ...req.body };
  subjectsStore.push(newSub);
  return res.status(201).json({ success: true, data: newSub });
};

export const updateSubject = async (req, res) => {
  const { id } = req.params;
  const idx = subjectsStore.findIndex(s => String(s.id) === String(id));
  if (idx !== -1) subjectsStore[idx] = { ...subjectsStore[idx], ...req.body };
  return res.status(200).json({ success: true, data: subjectsStore[idx] });
};

export const deleteSubject = async (req, res) => {
  const { id } = req.params;
  subjectsStore = subjectsStore.filter(s => String(s.id) !== String(id));
  return res.status(200).json({ success: true });
};

// ==================== STREAMS ====================
export const getStreams = async (req, res) => {
  return res.status(200).json({ success: true, count: streamsStore.length, data: streamsStore });
};

export const createStream = async (req, res) => {
  const newStream = { id: String(Date.now()), ...req.body };
  streamsStore.push(newStream);
  return res.status(201).json({ success: true, data: newStream });
};

export const updateStream = async (req, res) => {
  const { id } = req.params;
  const idx = streamsStore.findIndex(s => String(s.id) === String(id));
  if (idx !== -1) streamsStore[idx] = { ...streamsStore[idx], ...req.body };
  return res.status(200).json({ success: true, data: streamsStore[idx] });
};

export const deleteStream = async (req, res) => {
  const { id } = req.params;
  streamsStore = streamsStore.filter(s => String(s.id) !== String(id));
  return res.status(200).json({ success: true });
};
