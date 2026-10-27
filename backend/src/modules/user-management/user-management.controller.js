// In-memory data store for User Privileges, Permissions & Role Assignments

export let usersList = [
  {
    id: 'att_101',
    empCode: 'ATT-101',
    name: '[ATT-101] RAMESH KUMAR',
    displayName: 'Ramesh Kumar',
    category: 'Non-Teaching',
    role: 'Attender',
    designation: 'Attendance Attender',
    department: 'Attendance & Operations',
    phone: '9876543210',
    email: 'ramesh.attender@jdintl.edu',
    driverLicense: '',
    vehicleAssigned: '',
    pic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    division: 'All Wings',
    modules: ['Attendance'],
    classes: ['All Classes'],
    subjects: [],
    examNames: [],
    bulkEditingColumns: [],
    isAdd: true,
    isView: true,
    isModify: false,
    isDelete: false,
    isActive: true
  },
  {
    id: '1',
    empCode: '301',
    name: '[301] POOJA KANWAR',
    displayName: 'Pooja Kanwar',
    category: 'Teaching',
    role: 'Teacher',
    designation: 'PRT Faculty',
    department: 'Academics',
    phone: '9876543210',
    email: 'pooja.kanwar@jdintl.edu',
    driverLicense: '',
    vehicleAssigned: '',
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
    displayName: 'Bharat Jangid',
    category: 'Non-Teaching',
    role: 'Staff',
    designation: 'Senior Accountant',
    department: 'Accounts',
    phone: '9829012345',
    email: 'bharat.jangid@jdintl.edu',
    driverLicense: '',
    vehicleAssigned: '',
    pic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    division: 'Administration',
    modules: ['Fee', 'Transport', 'Front Office', 'Payroll'],
    classes: [],
    subjects: [],
    examNames: [],
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
    displayName: 'Priti Verma',
    category: 'Teaching',
    role: 'Teacher',
    designation: 'Primary Teacher',
    department: 'Academics',
    phone: '9414056789',
    email: 'priti.verma@jdintl.edu',
    driverLicense: '',
    vehicleAssigned: '',
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
    displayName: 'Sunita Kumari',
    category: 'Teaching',
    role: 'Teacher',
    designation: 'PGT Faculty',
    department: 'Academics',
    phone: '9828098765',
    email: 'sunita.kumari@jdintl.edu',
    driverLicense: '',
    vehicleAssigned: '',
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
    displayName: 'Nisha Goyal',
    category: 'Teaching',
    role: 'Teacher',
    designation: 'Pre-Primary Teacher',
    department: 'Academics',
    phone: '9988776655',
    email: 'nisha.goyal@jdintl.edu',
    driverLicense: '',
    vehicleAssigned: '',
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
    id: 'f_101',
    empCode: '101',
    name: '[101] ABHILASHA BHATT',
    displayName: 'Abhilasha Bhatt',
    category: 'Teaching',
    role: 'Teacher',
    designation: 'TGT Faculty',
    department: 'Academics',
    phone: '9829011101',
    email: 'abhilasha.bhatt@jdintl.edu',
    driverLicense: '',
    vehicleAssigned: '',
    pic: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    division: 'Secondary',
    modules: ['Student', 'Attendance', 'Examination'],
    classes: ['VIII - A', 'IX - A', 'X - A'],
    subjects: ['English', 'Social Science'],
    examNames: ['Term 1 (Half Yearly)', 'Term 2 (Annual)'],
    bulkEditingColumns: [],
    isAdd: true,
    isView: true,
    isModify: true,
    isDelete: false,
    isActive: true
  },
  {
    id: 'f_201',
    empCode: '201',
    name: '[201] MONIKA RANI VERMA',
    displayName: 'Monika Rani Verma',
    category: 'Teaching',
    role: 'Teacher',
    designation: 'PRT Faculty',
    department: 'Academics',
    phone: '9829011201',
    email: 'monika.verma@jdintl.edu',
    driverLicense: '',
    vehicleAssigned: '',
    pic: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop',
    division: 'Primary',
    modules: ['Student', 'Attendance'],
    classes: ['Class I - A', 'Class II - A'],
    subjects: ['Mathematics', 'EVS'],
    examNames: ['Term 1 (Half Yearly)', 'Term 2 (Annual)'],
    bulkEditingColumns: [],
    isAdd: true,
    isView: true,
    isModify: true,
    isDelete: false,
    isActive: true
  },
  {
    id: 'f_204',
    empCode: '204',
    name: '[204] DR. ARUN JOSHI',
    displayName: 'Dr. Arun Joshi',
    category: 'Teaching',
    role: 'Teacher',
    designation: 'PGT Senior Science Faculty',
    department: 'Academics',
    phone: '9829011204',
    email: 'arun.joshi@jdintl.edu',
    driverLicense: '',
    vehicleAssigned: '',
    pic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    division: 'Secondary & Senior',
    modules: ['Student', 'Examination', 'Attendance'],
    classes: ['Class IX - A', 'Class X - A', 'Class XI - Science (Medical) - A'],
    subjects: ['Science', 'Biology(044)'],
    examNames: ['Term 1 (Half Yearly)', 'Term 2 (Annual)'],
    bulkEditingColumns: [],
    isAdd: true,
    isView: true,
    isModify: true,
    isDelete: false,
    isActive: true
  },
  {
    id: 'f_205',
    empCode: '205',
    name: '[205] RAKESH SHARMA',
    displayName: 'Mr. Rakesh Sharma',
    category: 'Teaching',
    role: 'Teacher',
    designation: 'PGT Senior Mathematics Faculty',
    department: 'Academics',
    phone: '9829011205',
    email: 'rakesh.sharma@jdintl.edu',
    driverLicense: '',
    vehicleAssigned: '',
    pic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    division: 'Secondary & Senior',
    modules: ['Student', 'Examination', 'Attendance'],
    classes: ['Class X - A', 'Class X - B', 'Class XI - Science (Non-Medical) - A'],
    subjects: ['Mathematics', 'Physics(042)'],
    examNames: ['Term 1 (Half Yearly)', 'Term 2 (Annual)'],
    bulkEditingColumns: [],
    isAdd: true,
    isView: true,
    isModify: true,
    isDelete: false,
    isActive: true
  },
  {
    id: 'f_105',
    empCode: '105',
    name: '[105] SUMAN MEENA',
    displayName: 'Mrs. Suman Meena',
    category: 'Teaching',
    role: 'Teacher',
    designation: 'Pre-Primary Faculty',
    department: 'Academics',
    phone: '9829011105',
    email: 'suman.meena@jdintl.edu',
    driverLicense: '',
    vehicleAssigned: '',
    pic: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    division: 'Pre-Primary',
    modules: ['Student', 'Attendance'],
    classes: ['Nursery - PP3+ - A'],
    subjects: ['General Awareness', 'Art Education'],
    examNames: [],
    bulkEditingColumns: [],
    isAdd: true,
    isView: true,
    isModify: true,
    isDelete: false,
    isActive: true
  },
  {
    id: 'f_111',
    empCode: '111',
    name: '[111] AMIT PAREEK',
    displayName: 'Mr. Amit Pareek',
    category: 'Teaching',
    role: 'Teacher',
    designation: 'TGT Science Faculty',
    department: 'Academics',
    phone: '9829011111',
    email: 'amit.pareek@jdintl.edu',
    driverLicense: '',
    vehicleAssigned: '',
    pic: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    division: 'Middle',
    modules: ['Student', 'Attendance', 'Examination'],
    classes: ['Class VI - A', 'Class VII - A'],
    subjects: ['Science', 'Computer'],
    examNames: [],
    bulkEditingColumns: [],
    isAdd: true,
    isView: true,
    isModify: true,
    isDelete: false,
    isActive: true
  },
  {
    id: 'f_113',
    empCode: '113',
    name: '[113] VIKRAM RATHORE',
    displayName: 'Mr. Vikram Rathore',
    category: 'Teaching',
    role: 'Teacher',
    designation: 'Physical Education Faculty',
    department: 'Academics',
    phone: '9829011113',
    email: 'vikram.rathore@jdintl.edu',
    driverLicense: '',
    vehicleAssigned: '',
    pic: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
    division: 'Middle & Secondary',
    modules: ['Student'],
    classes: ['Class VIII - A', 'Class IX - A', 'Class X - A'],
    subjects: ['Physical Education (048)', 'Sports'],
    examNames: [],
    bulkEditingColumns: [],
    isAdd: true,
    isView: true,
    isModify: true,
    isDelete: false,
    isActive: true
  },
  {
    id: 'f_114',
    empCode: '114',
    name: '[114] ANANYA ROY',
    displayName: 'Ms. Ananya Roy',
    category: 'Teaching',
    role: 'Teacher',
    designation: 'PGT Humanities Faculty',
    department: 'Academics',
    phone: '9829011114',
    email: 'ananya.roy@jdintl.edu',
    driverLicense: '',
    vehicleAssigned: '',
    pic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    division: 'Senior Secondary',
    modules: ['Student', 'Examination'],
    classes: ['Class XI - Humanities - A', 'Class XII - Humanities - A'],
    subjects: ['History(027)', 'Political Science(028)'],
    examNames: [],
    bulkEditingColumns: [],
    isAdd: true,
    isView: true,
    isModify: true,
    isDelete: false,
    isActive: true
  },
  {
    id: 'f_117',
    empCode: '117',
    name: '[117] DINESH CHOUDHARY',
    displayName: 'Mr. Dinesh Choudhary',
    category: 'Teaching',
    role: 'Teacher',
    designation: 'PGT Computer Science & IT',
    department: 'Academics',
    phone: '9829011117',
    email: 'dinesh.choudhary@jdintl.edu',
    driverLicense: '',
    vehicleAssigned: '',
    pic: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop',
    division: 'Senior Secondary',
    modules: ['Student', 'Examination'],
    classes: ['Class XI - Science (Non-Medical) - A', 'Class XII - Science (Non-Medical) - A'],
    subjects: ['Information Technology', 'Computer', 'ICT'],
    examNames: [],
    bulkEditingColumns: [],
    isAdd: true,
    isView: true,
    isModify: true,
    isDelete: false,
    isActive: true
  },
  {
    id: 'f_118',
    empCode: '118',
    name: '[118] POOJA SAXENA',
    displayName: 'Ms. Pooja Saxena',
    category: 'Teaching',
    role: 'Teacher',
    designation: 'PGT Commerce & Economics',
    department: 'Academics',
    phone: '9829011118',
    email: 'pooja.saxena@jdintl.edu',
    driverLicense: '',
    vehicleAssigned: '',
    pic: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    division: 'Senior Secondary',
    modules: ['Student', 'Examination'],
    classes: ['Class XI - Commerce - A', 'Class XII - Commerce - A'],
    subjects: ['Economics', 'Business Studies'],
    examNames: [],
    bulkEditingColumns: [],
    isAdd: true,
    isView: true,
    isModify: true,
    isDelete: false,
    isActive: true
  },
  {
    id: 'f_119',
    empCode: '119',
    name: '[119] HEMANT SONI',
    displayName: 'Mr. Hemant Soni',
    category: 'Teaching',
    role: 'Teacher',
    designation: 'PGT Accountancy Faculty',
    department: 'Academics',
    phone: '9829011119',
    email: 'hemant.soni@jdintl.edu',
    driverLicense: '',
    vehicleAssigned: '',
    pic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    division: 'Senior Secondary',
    modules: ['Student', 'Examination'],
    classes: ['Class XI - Commerce - A', 'Class XII - Commerce - A'],
    subjects: ['Accountancy', 'Economics'],
    examNames: [],
    bulkEditingColumns: [],
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
    displayName: 'Pratibha Singh',
    category: 'Non-Teaching',
    role: 'Staff',
    designation: 'Chief Librarian',
    department: 'Library',
    phone: '9812345678',
    email: 'pratibha.singh@jdintl.edu',
    driverLicense: '',
    vehicleAssigned: '',
    pic: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop',
    division: 'Library',
    modules: ['Library', 'Stationary', 'SMS'],
    classes: [],
    subjects: [],
    examNames: [],
    bulkEditingColumns: ['Aadhaar No'],
    isAdd: true,
    isView: true,
    isModify: false,
    isDelete: false,
    isActive: false
  },
  {
    id: '7',
    empCode: '601',
    name: '[601] SHAITAN SINGH',
    displayName: 'Shaitan Singh',
    category: 'Transport',
    role: 'Driver',
    designation: 'School Bus Driver',
    department: 'Transport',
    phone: '9829088211',
    email: 'shaitan.singh@jdintl.edu',
    driverLicense: 'RJ14-201500892',
    vehicleAssigned: 'RJ02PA2762 - Route 1 (Kalyanpura)',
    pic: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
    division: 'Transport',
    modules: ['Transport'],
    classes: [],
    subjects: [],
    examNames: [],
    bulkEditingColumns: [],
    isAdd: false,
    isView: true,
    isModify: false,
    isDelete: false,
    isActive: true
  },
  {
    id: '8',
    empCode: '602',
    name: '[602] HANSRAJ JAT',
    displayName: 'Hansraj Jat',
    category: 'Transport',
    role: 'Driver',
    designation: 'School Bus Driver',
    department: 'Transport',
    phone: '9829144521',
    email: 'hansraj.jat@jdintl.edu',
    driverLicense: 'RJ14-201600104',
    vehicleAssigned: 'RJ14PC5642 - Route 2 (Mansarovar)',
    pic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    division: 'Transport',
    modules: ['Transport'],
    classes: [],
    subjects: [],
    examNames: [],
    bulkEditingColumns: [],
    isAdd: false,
    isView: true,
    isModify: false,
    isDelete: false,
    isActive: true
  },
  {
    id: '9',
    empCode: '603',
    name: '[603] PRAKASH CHOUDHARY',
    displayName: 'Prakash Choudhary',
    category: 'Transport',
    role: 'Driver',
    designation: 'School Bus Driver',
    department: 'Transport',
    phone: '9414022319',
    email: 'prakash.choudhary@jdintl.edu',
    driverLicense: 'RJ14-201400511',
    vehicleAssigned: 'RJ14PB4311 - Route 3 (Vaishali)',
    pic: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    division: 'Transport',
    modules: ['Transport'],
    classes: [],
    subjects: [],
    examNames: [],
    bulkEditingColumns: [],
    isAdd: false,
    isView: true,
    isModify: false,
    isDelete: false,
    isActive: true
  },
  {
    id: '10',
    empCode: '604',
    name: '[604] SHYAM SUNDER',
    displayName: 'Shyam Sunder',
    category: 'Transport',
    role: 'Driver',
    designation: 'School Bus Driver',
    department: 'Transport',
    phone: '9828833110',
    email: 'shyam.sunder@jdintl.edu',
    driverLicense: 'RJ14-201700982',
    vehicleAssigned: 'RJ14PD9081 - Route 4 (Jagatpura)',
    pic: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop',
    division: 'Transport',
    modules: ['Transport'],
    classes: [],
    subjects: [],
    examNames: [],
    bulkEditingColumns: [],
    isAdd: false,
    isView: true,
    isModify: false,
    isDelete: false,
    isActive: true
  },
  {
    id: '101',
    empCode: '605',
    name: '[605] SUNITA DEVI',
    displayName: 'Sunita Devi',
    category: 'Transport',
    role: 'Driver',
    designation: 'Bus Nanny / Female Attendant (Aayah)',
    department: 'Transport & Fleet',
    phone: '9829011442',
    email: 'sunita.nanny@jdintl.edu',
    driverLicense: 'POL-PV-2026-8812',
    vehicleAssigned: 'RJ02PA2762 - Route 1',
    pic: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    division: 'Transport',
    modules: ['Transport'],
    classes: [],
    subjects: [],
    examNames: [],
    bulkEditingColumns: [],
    isAdd: false,
    isView: true,
    isModify: false,
    isDelete: false,
    isActive: true,
    basicSalary: 18000,
    bankName: 'State Bank of India',
    accountNo: '38291029482',
    ifscCode: 'SBIN0002144'
  },
  {
    id: '102',
    empCode: '606',
    name: '[606] RAMESH KUMAR',
    displayName: 'Ramesh Kumar',
    category: 'Transport',
    role: 'Driver',
    designation: 'Bus Conductor',
    department: 'Transport & Fleet',
    phone: '9829066541',
    email: 'ramesh.conductor@jdintl.edu',
    driverLicense: 'POL-PV-2026-9041',
    vehicleAssigned: 'RJ20PA9932 - Route 4',
    pic: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
    division: 'Transport',
    modules: ['Transport'],
    classes: [],
    subjects: [],
    examNames: [],
    bulkEditingColumns: [],
    isAdd: false,
    isView: true,
    isModify: false,
    isDelete: false,
    isActive: true,
    basicSalary: 19500,
    bankName: 'Punjab National Bank',
    accountNo: '49201948271',
    ifscCode: 'PUNB0123400'
  },
  {
    id: '11',
    empCode: '101',
    name: '[101] DR. RAJESH SHARMA',
    displayName: 'Dr. Rajesh Sharma',
    category: 'Management',
    role: 'Admin',
    designation: 'School Principal & Director',
    department: 'Administration',
    phone: '9829000101',
    email: 'principal@jdintl.edu',
    driverLicense: '',
    vehicleAssigned: '',
    pic: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    division: 'All',
    modules: ['Dashboard', 'Student', 'Attendance', 'Examination', 'Fee', 'Transport', 'Payroll', 'Security'],
    classes: [],
    subjects: [],
    examNames: [],
    bulkEditingColumns: [],
    isAdd: true,
    isView: true,
    isModify: true,
    isDelete: true,
    isActive: true,
    basicSalary: 85000,
    bankName: 'HDFC Bank',
    accountNo: '501002391024',
    ifscCode: 'HDFC0001244',
    accountHolder: 'Dr. Rajesh Sharma',
    panNo: 'ABCPR1010A',
    aadhaarNo: '7891-2345-1010',
    joiningDate: '2020-04-01',
    gender: 'Male',
    qualification: 'Ph.D., M.Ed'
  },
  {
    id: '12',
    empCode: '102',
    name: '[102] ANITA GUPTA',
    displayName: 'Anita Gupta',
    category: 'Management',
    role: 'Admin',
    designation: 'Vice Principal & Academic Head',
    department: 'Administration',
    phone: '9829000102',
    email: 'vp@jdintl.edu',
    driverLicense: '',
    vehicleAssigned: '',
    pic: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop',
    division: 'All',
    modules: ['Dashboard', 'Student', 'Attendance', 'Examination', 'Academics'],
    classes: [],
    subjects: [],
    examNames: [],
    bulkEditingColumns: [],
    isAdd: true,
    isView: true,
    isModify: true,
    isDelete: true,
    isActive: true,
    basicSalary: 68000,
    bankName: 'State Bank of India',
    accountNo: '489210202911',
    ifscCode: 'SBIN0001024',
    accountHolder: 'Anita Gupta',
    panNo: 'ABCPG1020B',
    aadhaarNo: '7891-2345-1020',
    joiningDate: '2021-06-15',
    gender: 'Female',
    qualification: 'M.Sc., M.Ed'
  }
];

// Role Privileges Matrix Store
let rolePrivilegesList = [
  { id: 'dashboard', name: 'Dashboard & School Analytics', admin: true, teacher: true, staff: true, driver: false },
  { id: 'students', name: 'Student Admissions & Information', admin: true, teacher: true, staff: true, driver: false },
  { id: 'attendance', name: 'Daily Attendance Marking & Reports', admin: true, teacher: true, staff: true, driver: false },
  { id: 'examination', name: 'Exams, Marks Entry & Report Cards', admin: true, teacher: true, staff: false, driver: false },
  { id: 'fee', name: 'Fee Collection, Receipts & Dues', admin: true, teacher: false, staff: true, driver: false },
  { id: 'transport', name: 'Transport Fleet, Buses & Routes', admin: true, teacher: false, staff: true, driver: true },
  { id: 'hostel', name: 'Hostel Rooms & Boarding Records', admin: true, teacher: false, staff: true, driver: false },
  { id: 'payroll', name: 'Staff Management & Payroll Records', admin: true, teacher: false, staff: true, driver: false },
  { id: 'library', name: 'Library Catalog & Books Issuance', admin: true, teacher: true, staff: true, driver: false },
  { id: 'front-office', name: 'Front Desk Visitors & Gate Passes', admin: true, teacher: false, staff: true, driver: false },
  { id: 'stationary', name: 'School Shop & Stationary Sets', admin: true, teacher: false, staff: true, driver: false },
  { id: 'sms', name: 'SMS & WhatsApp Notifications', admin: true, teacher: true, staff: true, driver: false },
  { id: 'users', name: 'User Access Control & Security', admin: true, teacher: false, staff: false, driver: false }
];

// Ensure full ERP account and document defaults
usersList = usersList.map(u => ({
  basicSalary: u.basicSalary || (u.role === 'Driver' ? 22000 : u.role === 'Teacher' ? 35000 : u.role === 'Admin' ? 75000 : 42000),
  bankName: u.bankName || 'State Bank of India',
  accountNo: u.accountNo || `4892${u.empCode || '101'}0291`,
  ifscCode: u.ifscCode || 'SBIN0001024',
  accountHolder: u.accountHolder || u.displayName || u.name,
  panNo: u.panNo || `ABCDE${u.empCode || '101'}F`,
  aadhaarNo: u.aadhaarNo || `7891-2345-${u.empCode || '101'}0`,
  joiningDate: u.joiningDate || '2024-07-01',
  gender: u.gender || (u.role === 'Driver' ? 'Male' : 'Female'),
  qualification: u.qualification || (u.role === 'Teacher' ? 'M.Sc, B.Ed' : u.role === 'Driver' ? '10th Pass (Commercial DL)' : 'M.Com / MBA'),
  documents: u.documents || [
    { name: 'Aadhaar Card', status: 'Verified', fileName: `aadhaar_${u.empCode || 'doc'}.pdf` },
    { name: 'PAN Card', status: 'Verified', fileName: `pan_${u.empCode || 'doc'}.pdf` }
  ],
  ...u
}));

export const getUsers = (req, res) => {
  const { role, category, department } = req.query;
  let result = [...usersList];
  if (category && category !== 'All') {
    result = result.filter(u => u.category?.toLowerCase() === category.toLowerCase());
  }
  if (role && role !== 'All') {
    result = result.filter(u => u.role?.toLowerCase() === role.toLowerCase());
  }
  if (department && department !== 'All') {
    result = result.filter(u => u.department?.toLowerCase() === department.toLowerCase());
  }
  return res.json({
    success: true,
    data: result
  });
};

export const createUser = (req, res) => {
  const {
    staffName,
    name,
    empCode: inputEmpCode,
    pic: inputPic,
    mobileNo,
    phone,
    email,
    password,
    category = 'Teaching', // 'Teaching' | 'Non-Teaching' | 'Transport' | 'Management'
    role = 'Teacher',
    designation = '',
    department = 'Academics',
    driverLicense = '',
    vehicleAssigned = '',
    division = 'Primary',
    modules = [],
    classes = [],
    subjects = [],
    isActive = true,
    // Bank & Accounts & Salary
    basicSalary = '',
    bankName = '',
    accountNo = '',
    ifscCode = '',
    accountHolder = '',
    panNo = '',
    aadhaarNo = '',
    joiningDate = '',
    gender = 'Female',
    qualification = '',
    documents = []
  } = req.body;

  const rawName = staffName || name;
  if (!rawName || !rawName.trim()) {
    return res.status(400).json({ success: false, message: 'Staff name is required' });
  }

  const empCode = inputEmpCode?.trim() ? inputEmpCode.trim().replace(/^#/, '') : String(Math.floor(100 + Math.random() * 900));
  const cleanName = rawName.trim().toUpperCase();
  const phoneNo = mobileNo || phone || '9876543210';
  const userEmail = email || `${rawName.toLowerCase().replace(/\s+/g, '.')}@jdintl.edu`;
  const isDriverStaff = category === 'Transport' || role === 'Driver';
  const isTeachingStaff = category === 'Teaching' || role === 'Teacher';

  const defaultPic = isDriverStaff
    ? 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop'
    : isTeachingStaff
    ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
    : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop';

  const defaultSalary = isDriverStaff ? 22000 : isTeachingStaff ? 35000 : 40000;

  const newUser = {
    id: String(Date.now()),
    empCode,
    name: `[${empCode}] ${cleanName}`,
    displayName: rawName.trim(),
    category: category || (isDriverStaff ? 'Transport' : isTeachingStaff ? 'Teaching' : 'Non-Teaching'),
    role: role || (isDriverStaff ? 'Driver' : isTeachingStaff ? 'Teacher' : 'Staff'),
    designation: designation || (isDriverStaff ? 'School Bus Driver' : isTeachingStaff ? 'Subject Teacher' : 'Office Staff'),
    department: department || (isDriverStaff ? 'Transport & Fleet' : isTeachingStaff ? 'Academics' : 'Administration'),
    phone: phoneNo,
    email: userEmail,
    driverLicense: driverLicense || '',
    vehicleAssigned: vehicleAssigned || '',
    pic: inputPic?.trim() || defaultPic,
    division: division || 'Primary',
    modules: modules.length > 0 ? modules : (isDriverStaff ? ['Transport'] : isTeachingStaff ? ['Student', 'Attendance', 'Examination'] : ['Fee', 'Front Office']),
    classes: isTeachingStaff ? (classes || []) : [],
    subjects: isTeachingStaff ? (subjects || []) : [],
    examNames: ['Term 1 (Half Yearly)'],
    bulkEditingColumns: ['Mobile No.'],
    isAdd: !isDriverStaff,
    isView: true,
    isModify: !isDriverStaff,
    isDelete: false,
    isActive: Boolean(isActive),
    // Salary & Accounts
    basicSalary: basicSalary !== '' ? Number(basicSalary) : defaultSalary,
    bankName: bankName || 'State Bank of India',
    accountNo: accountNo || '',
    ifscCode: ifscCode || '',
    accountHolder: accountHolder || rawName.trim(),
    panNo: panNo ? panNo.toUpperCase() : '',
    aadhaarNo: aadhaarNo || '',
    joiningDate: joiningDate || new Date().toISOString().slice(0, 10),
    gender: gender || (isDriverStaff ? 'Male' : 'Female'),
    qualification: qualification || (isDriverStaff ? '10th Pass (Commercial DL)' : isTeachingStaff ? 'M.A., B.Ed' : 'Graduate'),
    documents: documents || []
  };

  usersList.unshift(newUser);
  return res.json({
    success: true,
    message: `${newUser.displayName} added to ${newUser.category} staff successfully`,
    data: newUser
  });
};

export const updateUser = (req, res) => {
  const { id } = req.params;
  const user = usersList.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const {
    name,
    displayName,
    empCode,
    pic,
    phone,
    email,
    category,
    role,
    designation,
    department,
    driverLicense,
    vehicleAssigned,
    division,
    classes,
    subjects,
    modules,
    isActive,
    basicSalary,
    bankName,
    accountNo,
    ifscCode,
    accountHolder,
    panNo,
    aadhaarNo,
    joiningDate,
    gender,
    qualification,
    documents
  } = req.body;

  if (empCode !== undefined && empCode.trim()) {
    user.empCode = empCode.trim().replace(/^#/, '');
  }
  if (pic !== undefined && pic.trim()) {
    user.pic = pic.trim();
  }
  if (displayName) {
    user.displayName = displayName;
    user.name = `[${user.empCode || 'STAFF'}] ${displayName.toUpperCase()}`;
  } else if (name) {
    user.name = name;
  }
  if (phone !== undefined) user.phone = phone;
  if (email !== undefined) user.email = email;
  if (category !== undefined) user.category = category;
  if (role !== undefined) user.role = role;
  if (designation !== undefined) user.designation = designation;
  if (department !== undefined) user.department = department;
  if (driverLicense !== undefined) user.driverLicense = driverLicense;
  if (vehicleAssigned !== undefined) user.vehicleAssigned = vehicleAssigned;
  if (division !== undefined) user.division = division;
  if (classes !== undefined) user.classes = classes;
  if (subjects !== undefined) user.subjects = subjects;
  if (modules !== undefined) user.modules = modules;
  if (isActive !== undefined) user.isActive = isActive;

  // Accounts & Salary
  if (basicSalary !== undefined) user.basicSalary = Number(basicSalary);
  if (bankName !== undefined) user.bankName = bankName;
  if (accountNo !== undefined) user.accountNo = accountNo;
  if (ifscCode !== undefined) user.ifscCode = ifscCode;
  if (accountHolder !== undefined) user.accountHolder = accountHolder;
  if (panNo !== undefined) user.panNo = panNo.toUpperCase();
  if (aadhaarNo !== undefined) user.aadhaarNo = aadhaarNo;
  if (joiningDate !== undefined) user.joiningDate = joiningDate;
  if (gender !== undefined) user.gender = gender;
  if (qualification !== undefined) user.qualification = qualification;
  if (documents !== undefined) user.documents = documents;

  return res.json({
    success: true,
    message: 'Staff details updated successfully',
    data: user
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

export const bulkUserAction = (req, res) => {
  const { action, userIds } = req.body;
  if (!Array.isArray(userIds) || userIds.length === 0) {
    return res.status(400).json({ success: false, message: 'No users selected' });
  }

  if (action === 'activate') {
    usersList.forEach(u => {
      if (userIds.includes(u.id)) u.isActive = true;
    });
    return res.json({ success: true, message: `${userIds.length} users marked Active` });
  }

  if (action === 'deactivate') {
    usersList.forEach(u => {
      if (userIds.includes(u.id)) u.isActive = false;
    });
    return res.json({ success: true, message: `${userIds.length} users marked Inactive` });
  }

  if (action === 'delete') {
    usersList = usersList.filter(u => !userIds.includes(u.id));
    return res.json({ success: true, message: `${userIds.length} users removed` });
  }

  return res.status(400).json({ success: false, message: 'Invalid bulk action' });
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

export const getRolePrivileges = (req, res) => {
  return res.json({
    success: true,
    data: rolePrivilegesList
  });
};

export const saveRolePrivileges = (req, res) => {
  const { privileges } = req.body;
  if (Array.isArray(privileges) && privileges.length > 0) {
    rolePrivilegesList = privileges;
  }
  return res.json({
    success: true,
    message: 'Role-Based Access Control privileges saved successfully',
    data: rolePrivilegesList
  });
};

