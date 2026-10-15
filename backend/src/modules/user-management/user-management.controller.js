// In-memory data store for User Privileges, Permissions & Role Assignments

let usersList = [
  {
    id: '1',
    empCode: '301',
    name: '[301] POOJA KANWAR',
    phone: '9876543210',
    email: 'pooja.kanwar@jdintl.edu',
    pic: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    division: 'Primary',
    modules: ['Student', 'Attendance', 'Examination'],
    classes: ['I - A', 'I - B', 'II - A'],
    subjects: ['English', 'EVS'],
    examNames: ['Term 1 (Half Yearly)', 'Term 2 (Annual)'],
    bulkEditingColumns: ['Father Name', 'Mother Name', 'Mobile No.'],
    isAdd: true,
    isView: true,
    isModify: true,
    isDelete: false,
    isActive: true
  },
  {
    id: '2',
    empCode: '501',
    name: '[501] BHARAT JANGID',
    phone: '9829012345',
    email: 'bharat.jangid@jdintl.edu',
    pic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    division: 'Secondary',
    modules: ['Fee', 'Transport', 'Front Office'],
    classes: ['VI - A', 'VII - A', 'VIII - A'],
    subjects: ['Mathematics'],
    examNames: ['Term 1 (Half Yearly)'],
    bulkEditingColumns: ['Fee Category', 'Route Name'],
    isAdd: true,
    isView: true,
    isModify: true,
    isDelete: true,
    isActive: true
  },
  {
    id: '3',
    empCode: '102',
    name: '[102] PRITI VERMA',
    phone: '9414056789',
    email: 'priti.verma@jdintl.edu',
    pic: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    division: 'Primary',
    modules: ['Student', 'Homework', 'Certificates'],
    classes: ['III - A', 'IV - A'],
    subjects: ['Hindi', 'Social Science'],
    examNames: ['Term 1 (Half Yearly)', 'Term 2 (Annual)'],
    bulkEditingColumns: ['Address', 'Blood Group'],
    isAdd: true,
    isView: true,
    isModify: false,
    isDelete: false,
    isActive: true
  },
  {
    id: '4',
    empCode: '202',
    name: '[202] SUNITA KUMARI',
    phone: '9828098765',
    email: 'sunita.kumari@jdintl.edu',
    pic: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop',
    division: 'Senior Secondary',
    modules: ['Examination', 'Study Material', 'Library'],
    classes: ['XI - SCI', 'XII - SCI'],
    subjects: ['Physics', 'Chemistry'],
    examNames: ['Unit Test 1', 'Half Yearly', 'Pre Board'],
    bulkEditingColumns: ['Roll No', 'Registration No'],
    isAdd: true,
    isView: true,
    isModify: true,
    isDelete: false,
    isActive: true
  },
  {
    id: '5',
    empCode: '210',
    name: '[210] NISHA GOYAL',
    phone: '9988776655',
    email: 'nisha.goyal@jdintl.edu',
    pic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    division: 'Primary',
    modules: ['Student', 'Attendance'],
    classes: ['Nursery', 'LKG', 'UKG'],
    subjects: ['General Knowledge'],
    examNames: ['Assessment 1', 'Assessment 2'],
    bulkEditingColumns: ['DOB', 'Gender'],
    isAdd: true,
    isView: true,
    isModify: true,
    isDelete: false,
    isActive: true
  },
  {
    id: '6',
    empCode: '237',
    name: '[237] PRATIBHA SINGH',
    phone: '9812345678',
    email: 'pratibha.singh@jdintl.edu',
    pic: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop',
    division: 'Secondary',
    modules: ['Library', 'Stationary', 'SMS'],
    classes: ['IX - A', 'X - A'],
    subjects: ['Computer Science'],
    examNames: ['Term 1 (Half Yearly)'],
    bulkEditingColumns: ['Aadhaar No'],
    isAdd: true,
    isView: true,
    isModify: false,
    isDelete: false,
    isActive: false
  }
];

export const getUsers = (req, res) => {
  return res.json({
    success: true,
    data: usersList
  });
};

export const createUser = (req, res) => {
  const { staffName, mobileNo, email, password } = req.body;
  if (!staffName) {
    return res.status(400).json({ success: false, message: 'Staff name is required' });
  }

  const empCode = String(Math.floor(100 + Math.random() * 900));
  const newUser = {
    id: String(usersList.length + 1),
    empCode,
    name: `[${empCode}] ${staffName.toUpperCase()}`,
    phone: mobileNo || '9876543210',
    email: email || `${staffName.toLowerCase().replace(/\s+/g, '.')}@jdintl.edu`,
    pic: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    division: 'Primary',
    modules: ['Student'],
    classes: ['I - A'],
    subjects: ['General'],
    examNames: ['Term 1 (Half Yearly)'],
    bulkEditingColumns: ['Mobile No.'],
    isAdd: true,
    isView: true,
    isModify: false,
    isDelete: false,
    isActive: true
  };
  usersList.unshift(newUser);
  return res.json({
    success: true,
    message: 'User privilege profile created successfully',
    data: newUser
  });
};

export const updatePermissions = (req, res) => {
  const { id } = req.params;
  const user = usersList.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const { isAdd, isView, isModify, isDelete, modules, classes, subjects, examNames, bulkEditingColumns } = req.body;
  if (isAdd !== undefined) user.isAdd = isAdd;
  if (isView !== undefined) user.isView = isView;
  if (isModify !== undefined) user.isModify = isModify;
  if (isDelete !== undefined) user.isDelete = isDelete;
  if (modules !== undefined) user.modules = modules;
  if (classes !== undefined) user.classes = classes;
  if (subjects !== undefined) user.subjects = subjects;
  if (examNames !== undefined) user.examNames = examNames;
  if (bulkEditingColumns !== undefined) user.bulkEditingColumns = bulkEditingColumns;

  return res.json({
    success: true,
    message: 'Permissions updated successfully',
    data: user
  });
};

export const toggleUserStatus = (req, res) => {
  const { id } = req.params;
  const user = usersList.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  user.isActive = !user.isActive;
  return res.json({
    success: true,
    message: `User is now ${user.isActive ? 'Active' : 'Inactive'}`,
    data: user
  });
};

export const deleteUser = (req, res) => {
  const { id } = req.params;
  usersList = usersList.filter(u => u.id !== id);
  return res.json({
    success: true,
    message: 'User removed successfully'
  });
};

export const getPrivilegeReport = (req, res) => {
  const { division } = req.query;
  let filtered = [...usersList];
  if (division && division !== 'All') {
    filtered = filtered.filter(u => u.division === division);
  }
  return res.json({
    success: true,
    data: filtered
  });
};
