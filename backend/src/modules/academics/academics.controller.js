let classesStore = [
  { id: 'c1', name: 'Nursery', priority: 1, sections: ['A', 'B'], status: 'Active' },
  { id: 'c2', name: 'L.K.G', priority: 2, sections: ['A', 'B'], status: 'Active' },
  { id: 'c3', name: 'U.K.G', priority: 3, sections: ['A', 'B'], status: 'Active' },
  { id: 'c4', name: 'Class 1', priority: 4, sections: ['A', 'B', 'C'], status: 'Active' },
  { id: 'c5', name: 'Class 5', priority: 8, sections: ['A', 'B'], status: 'Active' },
  { id: 'c6', name: 'Class 8', priority: 11, sections: ['A', 'B'], status: 'Active' },
  { id: 'c7', name: 'Class 10', priority: 13, sections: ['A', 'B'], status: 'Active' },
  { id: 'c8', name: 'Class 12', priority: 15, sections: ['Sci', 'Comm'], status: 'Active' }
];

let subjectsStore = [
  { id: 'sub1', name: 'English', code: 'ENG', type: 'Theory' },
  { id: 'sub2', name: 'Hindi', code: 'HIN', type: 'Theory' },
  { id: 'sub3', name: 'Mathematics', code: 'MATH', type: 'Theory' },
  { id: 'sub4', name: 'Science', code: 'SCI', type: 'Theory + Practical' },
  { id: 'sub5', name: 'Social Studies', code: 'SST', type: 'Theory' }
];

export const getAllClasses = async (req, res, next) => {
  try {
    return res.status(200).json({ success: true, data: classesStore });
  } catch (error) {
    next(error);
  }
};

export const createClass = async (req, res, next) => {
  try {
    const { name, priority, sections } = req.body;
    const newClass = {
      id: `c_${Date.now()}`,
      name,
      priority: Number(priority) || classesStore.length + 1,
      sections: Array.isArray(sections) ? sections : (sections ? sections.split(',').map(s => s.trim()) : ['A']),
      status: 'Active'
    };
    classesStore.push(newClass);
    return res.status(201).json({ success: true, message: 'Class added', data: newClass });
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

export const getAllSubjects = async (req, res, next) => {
  try {
    return res.status(200).json({ success: true, data: subjectsStore });
  } catch (error) {
    next(error);
  }
};

export const createSubject = async (req, res, next) => {
  try {
    const { name, code, type } = req.body;
    const newSubject = { id: `sub_${Date.now()}`, name, code, type: type || 'Theory' };
    subjectsStore.push(newSubject);
    return res.status(201).json({ success: true, message: 'Subject created', data: newSubject });
  } catch (error) {
    next(error);
  }
};
