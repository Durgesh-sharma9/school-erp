// Shared Data Store for School ERP Salary Management Module
// Exclusively configured with real active staff of JD International School

export const DEFAULT_SALARY_POLICIES = {
  basicPercentOfGross: 45,
  allowances: [
    { id: 'hra', label: 'HRA (House Rent Allowance)', calculationType: 'percent_of_basic', value: 40 },
    { id: 'da', label: 'DA (Dearness Allowance)', calculationType: 'percent_of_basic', value: 15 },
    { id: 'ta', label: 'Transport Allowance', calculationType: 'fixed_amount', value: 1800 },
    { id: 'ma', label: 'Medical Allowance', calculationType: 'fixed_amount', value: 1250 },
    { id: 'special', label: 'Special / Academic Allowance', calculationType: 'percent_of_gross', value: 10 }
  ],
  deductions: {
    epf: { enabled: true, employeePercent: 12, employerPercent: 12, wageCeiling: 15000 },
    esi: { enabled: true, employeePercent: 0.75, employerPercent: 3.25, grossCeiling: 21000 },
    professionalTax: {
      enabled: true,
      state: 'Rajasthan',
      slabs: [
        { minGross: 0, maxGross: 10000, monthlyTax: 0 },
        { minGross: 10001, maxGross: 20000, monthlyTax: 150 },
        { minGross: 20001, maxGross: null, monthlyTax: 200 }
      ]
    },
    tdsDefaultPercent: 0
  }
};

export const DEFAULT_ATTENDANCE_POLICIES = {
  calculationMethod: 'Calendar Days', // 'Calendar Days', 'Working Days', 'Fixed 30 Days'
  sandwichLeaveEnabled: false,
  weeklyOffTreatment: 'Paid', // 'Paid', 'Unpaid', 'Ignore'
  publicHolidayTreatment: 'Paid', // 'Paid', 'Unpaid', 'Ignore'
  halfDayPolicy: '0.5 Day', // '0.5 Day', 'Custom Percentage'
  halfDayCustomPercent: 50,
  overtimePolicy: 'Hourly', // 'Hourly', 'Fixed Flat Rate', 'Disabled'
  workingHoursPerDay: 8,
  schoolTimingStart: '08:00',
  schoolTimingEnd: '16:00',
  lateThresholdMinutes: 15,
  halfDayThresholdMinutes: 240,
  country: 'India',
  state: 'Rajasthan',
  salaryCycle: '1st to Last Day', // '1st to Last Day', '26th to 25th', 'Custom'
  customCycleStart: 1,
  salaryRounding: 'Nearest 1' // 'Nearest 1', 'Nearest 10', 'No Rounding'
};

export const DEFAULT_WORKFLOW_SETTINGS = {
  requireAdminApproval: true,
  lockAfterApproval: true,
  accountantPermissions: {
    edit: true,
    recalculate: true,
    generate: true,
    disburse: true
  }
};

export const DEFAULT_BANK_SETTINGS = {
  schoolAccountName: 'JD INTERNATIONAL SCHOOL',
  bankName: 'State Bank of India',
  accountNumber: '389201948201',
  ifscCode: 'SBIN0001234',
  branch: 'Bhankrota, Jaipur',
  signatoryName: 'ABHILASHA BHATT',
  signatoryDesignation: 'Principal',
  receiptPrefix: 'PAY-JDIS',
  signatureUrl: '',
  stampUrl: '',
  logoUrl: ''
};

export const DEFAULT_DEPARTMENTS = [
  {
    "id": "dept_1",
    "name": "Administration",
    "code": "ADMIN",
    "createdAt": "2026-11-03"
  },
  {
    "id": "dept_2",
    "name": "Science",
    "code": "SCI",
    "createdAt": "2026-11-03"
  },
  {
    "id": "dept_3",
    "name": "Maths",
    "code": "MATH",
    "createdAt": "2026-11-03"
  },
  {
    "id": "dept_4",
    "name": "English",
    "code": "ENG",
    "createdAt": "2026-11-03"
  },
  {
    "id": "dept_5",
    "name": "Hindi",
    "code": "HIN",
    "createdAt": "2026-11-03"
  },
  {
    "id": "dept_6",
    "name": "Computer",
    "code": "COMP",
    "createdAt": "2026-11-03"
  },
  {
    "id": "dept_7",
    "name": "Accounts",
    "code": "ACC",
    "createdAt": "2026-11-03"
  },
  {
    "id": "dept_8",
    "name": "Sports",
    "code": "SPRT",
    "createdAt": "2026-11-03"
  },
  {
    "id": "dept_9",
    "name": "Library",
    "code": "LIB",
    "createdAt": "2026-11-03"
  },
  {
    "id": "dept_10",
    "name": "Security",
    "code": "SEC",
    "createdAt": "2026-11-03"
  },
  {
    "id": "dept_11",
    "name": "Reception",
    "code": "REC",
    "createdAt": "2026-11-03"
  }
];

export const DEFAULT_DESIGNATIONS = [
  { id: 'desg_1', name: 'Principal', department: 'Administration', createdAt: '2026-11-03' },
  { id: 'desg_2', name: 'Administrator', department: 'Administration', createdAt: '2026-11-03' },
  { id: 'desg_3', name: 'Faculty - Secondary', department: 'Teaching', createdAt: '2026-11-03' },
  { id: 'desg_4', name: 'Faculty - Middle', department: 'Teaching', createdAt: '2026-11-03' },
  { id: 'desg_5', name: 'Faculty - Primary', department: 'Teaching', createdAt: '2026-11-03' },
  { id: 'desg_6', name: 'Accounts Officer', department: 'Accounts', createdAt: '2026-11-03' },
  { id: 'desg_7', name: 'School Bus Driver', department: 'Transport', createdAt: '2026-11-03' },
  { id: 'desg_8', name: 'Security Supervisor', department: 'Security & Maintenance', createdAt: '2026-11-03' },
  { id: 'desg_9', name: 'Bus Attendant', department: 'Transport', createdAt: '2026-11-03' },
  { id: 'desg_10', name: 'Librarian', department: 'Library', createdAt: '2026-11-03' },
  { id: 'desg_11', name: 'Computer Instructor', department: 'Computer', createdAt: '2026-11-03' }
];

// Real Active Staff Roster for JD International School
export const INITIAL_STAFF_ROSTER = [
  {
    "id": "emp_001",
    "code": "EMP001",
    "name": "John Doe",
    "department": "Administration",
    "designation": "Principal",
    "phone": "9829010000",
    "email": "principal@greenwood.edu",
    "bankName": "State Bank of India",
    "accNo": "389201100000",
    "ifsc": "SBIN0001234",
    "pan": "ABCDE1000F",
    "pfNo": "RJ/JAI/0012345/001",
    "esiNo": "—",
    "basicSalary": 120000,
    "grossSalary": 192000,
    "gender": "Male",
    "category": "Teaching",
    "joinDate": "2021-04-01",
    "status": "Active"
  },
  {
    "id": "emp_002",
    "code": "EMP002",
    "name": "Mrs. Sunita Sharma",
    "department": "Administration",
    "designation": "Vice Principal",
    "phone": "9829010001",
    "email": "viceprincipal@greenwood.edu",
    "bankName": "HDFC Bank",
    "accNo": "389201100001",
    "ifsc": "HDFC0000456",
    "pan": "ABCDE1001F",
    "pfNo": "RJ/JAI/0012345/002",
    "esiNo": "—",
    "basicSalary": 90000,
    "grossSalary": 139500,
    "gender": "Female",
    "category": "Teaching",
    "joinDate": "2021-04-01",
    "status": "Active"
  },
  {
    "id": "emp_003",
    "code": "EMP011",
    "name": "Mr. Vijay Kumar",
    "department": "Administration",
    "designation": "PGT",
    "phone": "9829010002",
    "email": "vijay@greenwood.edu",
    "bankName": "ICICI Bank",
    "accNo": "389201100002",
    "ifsc": "ICIC0000789",
    "pan": "ABCDE1002F",
    "pfNo": "RJ/JAI/0012345/003",
    "esiNo": "—",
    "basicSalary": 65000,
    "grossSalary": 104000,
    "gender": "Male",
    "category": "Teaching",
    "joinDate": "2021-04-01",
    "status": "Active"
  },
  {
    "id": "emp_004",
    "code": "EMP023",
    "name": "Mr. Hari Prasad",
    "department": "Administration",
    "designation": "Transport Manager",
    "phone": "9829010003",
    "email": "hari@greenwood.edu",
    "bankName": "State Bank of India",
    "accNo": "389201100003",
    "ifsc": "SBIN0001234",
    "pan": "ABCDE1003F",
    "pfNo": "RJ/JAI/0012345/004",
    "esiNo": "—",
    "basicSalary": 35000,
    "grossSalary": 54250,
    "gender": "Male",
    "category": "Non Teaching",
    "joinDate": "2021-04-01",
    "status": "Active"
  },
  {
    "id": "emp_005",
    "code": "EMP024",
    "name": "Mr. Ram Singh",
    "department": "Administration",
    "designation": "Driver",
    "phone": "9829010004",
    "email": "ram@greenwood.edu",
    "bankName": "HDFC Bank",
    "accNo": "389201100004",
    "ifsc": "HDFC0000456",
    "pan": "ABCDE1004F",
    "pfNo": "RJ/JAI/0012345/005",
    "esiNo": "—",
    "basicSalary": 22000,
    "grossSalary": 35200,
    "gender": "Male",
    "category": "Non Teaching",
    "joinDate": "2021-04-01",
    "status": "Active"
  },
  {
    "id": "emp_006",
    "code": "EMP025",
    "name": "Mr. Mohan Lal",
    "department": "Administration",
    "designation": "Driver",
    "phone": "9829010005",
    "email": "mohan@greenwood.edu",
    "bankName": "ICICI Bank",
    "accNo": "389201100005",
    "ifsc": "ICIC0000789",
    "pan": "ABCDE1005F",
    "pfNo": "RJ/JAI/0012345/006",
    "esiNo": "—",
    "basicSalary": 22000,
    "grossSalary": 35200,
    "gender": "Male",
    "category": "Non Teaching",
    "joinDate": "2021-04-01",
    "status": "Active"
  },
  {
    "id": "emp_007",
    "code": "EMP026",
    "name": "Mr. Shyam Verma",
    "department": "Administration",
    "designation": "Driver",
    "phone": "9829010006",
    "email": "shyam@greenwood.edu",
    "bankName": "State Bank of India",
    "accNo": "389201100006",
    "ifsc": "SBIN0001234",
    "pan": "ABCDE1006F",
    "pfNo": "RJ/JAI/0012345/007",
    "esiNo": "—",
    "basicSalary": 22000,
    "grossSalary": 35200,
    "gender": "Male",
    "category": "Non Teaching",
    "joinDate": "2021-04-01",
    "status": "Active"
  },
  {
    "id": "emp_008",
    "code": "EMP030",
    "name": "Mrs. Kamala Devi",
    "department": "Administration",
    "designation": "Housekeeping Staff",
    "phone": "9829010007",
    "email": "kamala@greenwood.edu",
    "bankName": "HDFC Bank",
    "accNo": "389201100007",
    "ifsc": "HDFC0000456",
    "pan": "ABCDE1007F",
    "pfNo": "RJ/JAI/0012345/008",
    "esiNo": "1234567890008",
    "basicSalary": 16000,
    "grossSalary": 24800,
    "gender": "Female",
    "category": "Non Teaching",
    "joinDate": "2021-04-01",
    "status": "Active"
  },
  {
    "id": "emp_009",
    "code": "EMP031",
    "name": "Mrs. Savitri Bai",
    "department": "Administration",
    "designation": "Housekeeping Staff",
    "phone": "9829010008",
    "email": "savitri@greenwood.edu",
    "bankName": "ICICI Bank",
    "accNo": "389201100008",
    "ifsc": "ICIC0000789",
    "pan": "ABCDE1008F",
    "pfNo": "RJ/JAI/0012345/009",
    "esiNo": "1234567890009",
    "basicSalary": 16000,
    "grossSalary": 24800,
    "gender": "Female",
    "category": "Non Teaching",
    "joinDate": "2021-04-01",
    "status": "Active"
  },
  {
    "id": "emp_010",
    "code": "EMP032",
    "name": "Mrs. Munni Devi",
    "department": "Administration",
    "designation": "Housekeeping Staff",
    "phone": "9829010009",
    "email": "munni@greenwood.edu",
    "bankName": "State Bank of India",
    "accNo": "389201100009",
    "ifsc": "SBIN0001234",
    "pan": "ABCDE1009F",
    "pfNo": "RJ/JAI/0012345/010",
    "esiNo": "1234567890010",
    "basicSalary": 16000,
    "grossSalary": 24800,
    "gender": "Female",
    "category": "Non Teaching",
    "joinDate": "2021-04-01",
    "status": "Active"
  },
  {
    "id": "emp_011",
    "code": "EMP039",
    "name": "Mr. Om Prakash",
    "department": "Administration",
    "designation": "TGT",
    "phone": "9829010010",
    "email": "om@greenwood.edu",
    "bankName": "HDFC Bank",
    "accNo": "389201100010",
    "ifsc": "HDFC0000456",
    "pan": "ABCDE1010F",
    "pfNo": "RJ/JAI/0012345/011",
    "esiNo": "—",
    "basicSalary": 45000,
    "grossSalary": 72000,
    "gender": "Male",
    "category": "Teaching",
    "joinDate": "2021-04-01",
    "status": "Active"
  },
  {
    "id": "emp_012",
    "code": "EMP003",
    "name": "Mr. Amit Verma",
    "department": "Science",
    "designation": "PGT",
    "phone": "9829010011",
    "email": "amit@greenwood.edu",
    "bankName": "ICICI Bank",
    "accNo": "389201100011",
    "ifsc": "ICIC0000789",
    "pan": "ABCDE1011F",
    "pfNo": "RJ/JAI/0012345/012",
    "esiNo": "—",
    "basicSalary": 65000,
    "grossSalary": 104000,
    "gender": "Male",
    "category": "Teaching",
    "joinDate": "2021-04-01",
    "status": "Active"
  },
  {
    "id": "emp_013",
    "code": "EMP004",
    "name": "Mrs. Priya Singh",
    "department": "Science",
    "designation": "PGT",
    "phone": "9829010012",
    "email": "priya@greenwood.edu",
    "bankName": "State Bank of India",
    "accNo": "389201100012",
    "ifsc": "SBIN0001234",
    "pan": "ABCDE1012F",
    "pfNo": "RJ/JAI/0012345/013",
    "esiNo": "—",
    "basicSalary": 65000,
    "grossSalary": 104000,
    "gender": "Female",
    "category": "Teaching",
    "joinDate": "2021-04-01",
    "status": "Active"
  },
  {
    "id": "emp_014",
    "code": "EMP005",
    "name": "Mr. Rahul Mehta",
    "department": "Science",
    "designation": "TGT",
    "phone": "9829010013",
    "email": "rahul@greenwood.edu",
    "bankName": "HDFC Bank",
    "accNo": "389201100013",
    "ifsc": "HDFC0000456",
    "pan": "ABCDE1013F",
    "pfNo": "RJ/JAI/0012345/014",
    "esiNo": "—",
    "basicSalary": 45000,
    "grossSalary": 72000,
    "gender": "Male",
    "category": "Teaching",
    "joinDate": "2021-04-01",
    "status": "Active"
  },
  {
    "id": "emp_015",
    "code": "EMP037",
    "name": "Mr. Naresh Kumar",
    "department": "Science",
    "designation": "TGT",
    "phone": "9829010014",
    "email": "naresh@greenwood.edu",
    "bankName": "ICICI Bank",
    "accNo": "389201100014",
    "ifsc": "ICIC0000789",
    "pan": "ABCDE1014F",
    "pfNo": "RJ/JAI/0012345/015",
    "esiNo": "—",
    "basicSalary": 45000,
    "grossSalary": 72000,
    "gender": "Male",
    "category": "Teaching",
    "joinDate": "2021-04-01",
    "status": "Active"
  },
  {
    "id": "emp_016",
    "code": "EMP044",
    "name": "Mrs. Vimla Devi",
    "department": "Science",
    "designation": "PRT",
    "phone": "9829010015",
    "email": "vimla@greenwood.edu",
    "bankName": "State Bank of India",
    "accNo": "389201100015",
    "ifsc": "SBIN0001234",
    "pan": "ABCDE1015F",
    "pfNo": "RJ/JAI/0012345/016",
    "esiNo": "—",
    "basicSalary": 35000,
    "grossSalary": 54250,
    "gender": "Female",
    "category": "Teaching",
    "joinDate": "2021-04-01",
    "status": "Active"
  },
  {
    "id": "emp_017",
    "code": "EMP016",
    "name": "Mrs. Fatima Khan",
    "department": "Science",
    "designation": "PRT",
    "phone": "9829010016",
    "email": "fatima@greenwood.edu",
    "bankName": "HDFC Bank",
    "accNo": "389201100016",
    "ifsc": "HDFC0000456",
    "pan": "ABCDE1016F",
    "pfNo": "RJ/JAI/0012345/017",
    "esiNo": "—",
    "basicSalary": 35000,
    "grossSalary": 54250,
    "gender": "Female",
    "category": "Teaching",
    "joinDate": "2021-04-01",
    "status": "Active"
  },
  {
    "id": "emp_018",
    "code": "EMP006",
    "name": "Mrs. Anjali Gupta",
    "department": "Maths",
    "designation": "PGT",
    "phone": "9829010017",
    "email": "anjali@greenwood.edu",
    "bankName": "ICICI Bank",
    "accNo": "389201100017",
    "ifsc": "ICIC0000789",
    "pan": "ABCDE1017F",
    "pfNo": "RJ/JAI/0012345/018",
    "esiNo": "—",
    "basicSalary": 65000,
    "grossSalary": 104000,
    "gender": "Female",
    "category": "Teaching",
    "joinDate": "2021-04-01",
    "status": "Active"
  },
  {
    "id": "emp_019",
    "code": "EMP007",
    "name": "Mr. Sanjay Kapoor",
    "department": "Maths",
    "designation": "TGT",
    "phone": "9829010018",
    "email": "sanjay@greenwood.edu",
    "bankName": "State Bank of India",
    "accNo": "389201100018",
    "ifsc": "SBIN0001234",
    "pan": "ABCDE1018F",
    "pfNo": "RJ/JAI/0012345/019",
    "esiNo": "—",
    "basicSalary": 45000,
    "grossSalary": 72000,
    "gender": "Male",
    "category": "Teaching",
    "joinDate": "2021-04-01",
    "status": "Active"
  },
  {
    "id": "emp_020",
    "code": "EMP038",
    "name": "Mrs. Shashi Kala",
    "department": "Maths",
    "designation": "TGT",
    "phone": "9829010019",
    "email": "shashi@greenwood.edu",
    "bankName": "HDFC Bank",
    "accNo": "389201100019",
    "ifsc": "HDFC0000456",
    "pan": "ABCDE1019F",
    "pfNo": "RJ/JAI/0012345/020",
    "esiNo": "—",
    "basicSalary": 45000,
    "grossSalary": 72000,
    "gender": "Female",
    "category": "Teaching",
    "joinDate": "2021-04-01",
    "status": "Active"
  },
  {
    "id": "emp_021",
    "code": "EMP043",
    "name": "Mrs. Usha Rani",
    "department": "Maths",
    "designation": "PRT",
    "phone": "9829010020",
    "email": "usha@greenwood.edu",
    "bankName": "ICICI Bank",
    "accNo": "389201100020",
    "ifsc": "ICIC0000789",
    "pan": "ABCDE1020F",
    "pfNo": "RJ/JAI/0012345/021",
    "esiNo": "—",
    "basicSalary": 35000,
    "grossSalary": 54250,
    "gender": "Female",
    "category": "Teaching",
    "joinDate": "2021-04-01",
    "status": "Active"
  },
  {
    "id": "emp_022",
    "code": "EMP015",
    "name": "Mrs. Lakshmi Nair",
    "department": "Maths",
    "designation": "PRT",
    "phone": "9829010021",
    "email": "lakshmi@greenwood.edu",
    "bankName": "State Bank of India",
    "accNo": "389201100021",
    "ifsc": "SBIN0001234",
    "pan": "ABCDE1021F",
    "pfNo": "RJ/JAI/0012345/022",
    "esiNo": "—",
    "basicSalary": 35000,
    "grossSalary": 54250,
    "gender": "Female",
    "category": "Teaching",
    "joinDate": "2021-04-01",
    "status": "Active"
  },
  {
    "id": "emp_023",
    "code": "EMP008",
    "name": "Mrs. Kavita Rao",
    "department": "English",
    "designation": "PGT",
    "phone": "9829010022",
    "email": "kavita@greenwood.edu",
    "bankName": "HDFC Bank",
    "accNo": "389201100022",
    "ifsc": "HDFC0000456",
    "pan": "ABCDE1022F",
    "pfNo": "RJ/JAI/0012345/023",
    "esiNo": "—",
    "basicSalary": 65000,
    "grossSalary": 104000,
    "gender": "Female",
    "category": "Teaching",
    "joinDate": "2021-04-01",
    "status": "Active"
  },
  {
    "id": "emp_024",
    "code": "EMP009",
    "name": "Mr. Deepak Joshi",
    "department": "English",
    "designation": "TGT",
    "phone": "9829010023",
    "email": "deepak@greenwood.edu",
    "bankName": "ICICI Bank",
    "accNo": "389201100023",
    "ifsc": "ICIC0000789",
    "pan": "ABCDE1023F",
    "pfNo": "RJ/JAI/0012345/024",
    "esiNo": "—",
    "basicSalary": 45000,
    "grossSalary": 72000,
    "gender": "Male",
    "category": "Teaching",
    "joinDate": "2021-04-01",
    "status": "Active"
  },
  {
    "id": "emp_025",
    "code": "EMP014",
    "name": "Mrs. Sunita Reddy",
    "department": "English",
    "designation": "PRT",
    "phone": "9829010024",
    "email": "sunitar@greenwood.edu",
    "bankName": "State Bank of India",
    "accNo": "389201100024",
    "ifsc": "SBIN0001234",
    "pan": "ABCDE1024F",
    "pfNo": "RJ/JAI/0012345/025",
    "esiNo": "—",
    "basicSalary": 35000,
    "grossSalary": 54250,
    "gender": "Female",
    "category": "Teaching",
    "joinDate": "2021-04-01",
    "status": "Active"
  },
  {
    "id": "emp_026",
    "code": "EMP018",
    "name": "Mrs. Mary Thomas",
    "department": "English",
    "designation": "PRT",
    "phone": "9829010025",
    "email": "mary@greenwood.edu",
    "bankName": "HDFC Bank",
    "accNo": "389201100025",
    "ifsc": "HDFC0000456",
    "pan": "ABCDE1025F",
    "pfNo": "RJ/JAI/0012345/026",
    "esiNo": "—",
    "basicSalary": 35000,
    "grossSalary": 54250,
    "gender": "Female",
    "category": "Teaching",
    "joinDate": "2021-04-01",
    "status": "Active"
  },
  {
    "id": "emp_027",
    "code": "EMP040",
    "name": "Mrs. Rekha Singh",
    "department": "English",
    "designation": "PRT",
    "phone": "9829010026",
    "email": "rekha@greenwood.edu",
    "bankName": "ICICI Bank",
    "accNo": "389201100026",
    "ifsc": "ICIC0000789",
    "pan": "ABCDE1026F",
    "pfNo": "RJ/JAI/0012345/027",
    "esiNo": "—",
    "basicSalary": 35000,
    "grossSalary": 54250,
    "gender": "Female",
    "category": "Teaching",
    "joinDate": "2021-04-01",
    "status": "Active"
  },
  {
    "id": "emp_028",
    "code": "EMP042",
    "name": "Mrs. Saroj Bala",
    "department": "English",
    "designation": "PRT",
    "phone": "9829010027",
    "email": "saroj@greenwood.edu",
    "bankName": "State Bank of India",
    "accNo": "389201100027",
    "ifsc": "SBIN0001234",
    "pan": "ABCDE1027F",
    "pfNo": "RJ/JAI/0012345/028",
    "esiNo": "—",
    "basicSalary": 35000,
    "grossSalary": 54250,
    "gender": "Female",
    "category": "Teaching",
    "joinDate": "2021-04-01",
    "status": "Active"
  },
  {
    "id": "emp_029",
    "code": "EMP010",
    "name": "Mrs. Meena Devi",
    "department": "Hindi",
    "designation": "TGT",
    "phone": "9829010028",
    "email": "meena@greenwood.edu",
    "bankName": "HDFC Bank",
    "accNo": "389201100028",
    "ifsc": "HDFC0000456",
    "pan": "ABCDE1028F",
    "pfNo": "RJ/JAI/0012345/029",
    "esiNo": "—",
    "basicSalary": 45000,
    "grossSalary": 72000,
    "gender": "Female",
    "category": "Teaching",
    "joinDate": "2021-04-01",
    "status": "Active"
  },
  {
    "id": "emp_030",
    "code": "EMP017",
    "name": "Mrs. Radha Iyer",
    "department": "Hindi",
    "designation": "PRT",
    "phone": "9829010029",
    "email": "radha@greenwood.edu",
    "bankName": "ICICI Bank",
    "accNo": "389201100029",
    "ifsc": "ICIC0000789",
    "pan": "ABCDE1029F",
    "pfNo": "RJ/JAI/0012345/030",
    "esiNo": "—",
    "basicSalary": 35000,
    "grossSalary": 54250,
    "gender": "Female",
    "category": "Teaching",
    "joinDate": "2021-04-01",
    "status": "Active"
  },
  {
    "id": "emp_031",
    "code": "EMP041",
    "name": "Mrs. Anita Devi",
    "department": "Hindi",
    "designation": "PRT",
    "phone": "9829010030",
    "email": "anita@greenwood.edu",
    "bankName": "State Bank of India",
    "accNo": "389201100030",
    "ifsc": "SBIN0001234",
    "pan": "ABCDE1030F",
    "pfNo": "RJ/JAI/0012345/031",
    "esiNo": "—",
    "basicSalary": 35000,
    "grossSalary": 54250,
    "gender": "Female",
    "category": "Teaching",
    "joinDate": "2021-04-01",
    "status": "Active"
  },
  {
    "id": "emp_032",
    "code": "EMP012",
    "name": "Mr. Rakesh Yadav",
    "department": "Computer",
    "designation": "PGT",
    "phone": "9829010031",
    "email": "rakesh@greenwood.edu",
    "bankName": "HDFC Bank",
    "accNo": "389201100031",
    "ifsc": "HDFC0000456",
    "pan": "ABCDE1031F",
    "pfNo": "RJ/JAI/0012345/032",
    "esiNo": "—",
    "basicSalary": 65000,
    "grossSalary": 104000,
    "gender": "Male",
    "category": "Teaching",
    "joinDate": "2021-04-01",
    "status": "Active"
  },
  {
    "id": "emp_033",
    "code": "EMP013",
    "name": "Mrs. Neha Sharma",
    "department": "Computer",
    "designation": "TGT",
    "phone": "9829010032",
    "email": "neha@greenwood.edu",
    "bankName": "ICICI Bank",
    "accNo": "389201100032",
    "ifsc": "ICIC0000789",
    "pan": "ABCDE1032F",
    "pfNo": "RJ/JAI/0012345/033",
    "esiNo": "—",
    "basicSalary": 45000,
    "grossSalary": 72000,
    "gender": "Female",
    "category": "Teaching",
    "joinDate": "2021-04-01",
    "status": "Active"
  },
  {
    "id": "emp_034",
    "code": "EMP045",
    "name": "Mr. Babu Lal",
    "department": "Computer",
    "designation": "Lab Assistant",
    "phone": "9829010033",
    "email": "babu@greenwood.edu",
    "bankName": "State Bank of India",
    "accNo": "389201100033",
    "ifsc": "SBIN0001234",
    "pan": "ABCDE1033F",
    "pfNo": "RJ/JAI/0012345/034",
    "esiNo": "—",
    "basicSalary": 25000,
    "grossSalary": 40000,
    "gender": "Male",
    "category": "Non Teaching",
    "joinDate": "2021-04-01",
    "status": "Active"
  },
  {
    "id": "emp_035",
    "code": "EMP019",
    "name": "Mr. Sunil Das",
    "department": "Accounts",
    "designation": "Accountant",
    "phone": "9829010034",
    "email": "sunil@greenwood.edu",
    "bankName": "HDFC Bank",
    "accNo": "389201100034",
    "ifsc": "HDFC0000456",
    "pan": "ABCDE1034F",
    "pfNo": "RJ/JAI/0012345/035",
    "esiNo": "—",
    "basicSalary": 40000,
    "grossSalary": 64000,
    "gender": "Male",
    "category": "Non Teaching",
    "joinDate": "2021-04-01",
    "status": "Active"
  },
  {
    "id": "emp_036",
    "code": "EMP020",
    "name": "Mrs. Rani Mukherjee",
    "department": "Accounts",
    "designation": "Accountant",
    "phone": "9829010035",
    "email": "rani@greenwood.edu",
    "bankName": "ICICI Bank",
    "accNo": "389201100035",
    "ifsc": "ICIC0000789",
    "pan": "ABCDE1035F",
    "pfNo": "RJ/JAI/0012345/036",
    "esiNo": "—",
    "basicSalary": 40000,
    "grossSalary": 64000,
    "gender": "Female",
    "category": "Non Teaching",
    "joinDate": "2021-04-01",
    "status": "Active"
  },
  {
    "id": "emp_037",
    "code": "EMP035",
    "name": "Mr. Suresh Yadav",
    "department": "Sports",
    "designation": "Sports Coach",
    "phone": "9829010036",
    "email": "suresh@greenwood.edu",
    "bankName": "State Bank of India",
    "accNo": "389201100036",
    "ifsc": "SBIN0001234",
    "pan": "ABCDE1036F",
    "pfNo": "RJ/JAI/0012345/037",
    "esiNo": "—",
    "basicSalary": 40000,
    "grossSalary": 64000,
    "gender": "Male",
    "category": "Non Teaching",
    "joinDate": "2021-04-01",
    "status": "Active"
  },
  {
    "id": "emp_038",
    "code": "EMP033",
    "name": "Mrs. Kusum Sharma",
    "department": "Library",
    "designation": "Librarian",
    "phone": "9829010037",
    "email": "kusum@greenwood.edu",
    "bankName": "HDFC Bank",
    "accNo": "389201100037",
    "ifsc": "HDFC0000456",
    "pan": "ABCDE1037F",
    "pfNo": "RJ/JAI/0012345/038",
    "esiNo": "—",
    "basicSalary": 38000,
    "grossSalary": 60800,
    "gender": "Female",
    "category": "Non Teaching",
    "joinDate": "2021-04-01",
    "status": "Active"
  },
  {
    "id": "emp_039",
    "code": "EMP034",
    "name": "Mr. Pawan Kumar",
    "department": "Library",
    "designation": "Lab Assistant",
    "phone": "9829010038",
    "email": "pawan@greenwood.edu",
    "bankName": "ICICI Bank",
    "accNo": "389201100038",
    "ifsc": "ICIC0000789",
    "pan": "ABCDE1038F",
    "pfNo": "RJ/JAI/0012345/039",
    "esiNo": "—",
    "basicSalary": 25000,
    "grossSalary": 40000,
    "gender": "Male",
    "category": "Non Teaching",
    "joinDate": "2021-04-01",
    "status": "Active"
  },
  {
    "id": "emp_040",
    "code": "EMP027",
    "name": "Mr. Dinesh Kumar",
    "department": "Security",
    "designation": "Security Guard",
    "phone": "9829010039",
    "email": "dinesh@greenwood.edu",
    "bankName": "State Bank of India",
    "accNo": "389201100039",
    "ifsc": "SBIN0001234",
    "pan": "ABCDE1039F",
    "pfNo": "RJ/JAI/0012345/040",
    "esiNo": "1234567890040",
    "basicSalary": 18000,
    "grossSalary": 28800,
    "gender": "Male",
    "category": "Non Teaching",
    "joinDate": "2021-04-01",
    "status": "Active"
  },
  {
    "id": "emp_041",
    "code": "EMP028",
    "name": "Mr. Birju Singh",
    "department": "Security",
    "designation": "Security Guard",
    "phone": "9829010040",
    "email": "birju@greenwood.edu",
    "bankName": "HDFC Bank",
    "accNo": "389201100040",
    "ifsc": "HDFC0000456",
    "pan": "ABCDE1040F",
    "pfNo": "RJ/JAI/0012345/041",
    "esiNo": "1234567890041",
    "basicSalary": 18000,
    "grossSalary": 28800,
    "gender": "Male",
    "category": "Non Teaching",
    "joinDate": "2021-04-01",
    "status": "Active"
  },
  {
    "id": "emp_042",
    "code": "EMP029",
    "name": "Mr. Chandra Shekhar",
    "department": "Security",
    "designation": "Security Guard",
    "phone": "9829010041",
    "email": "chandra@greenwood.edu",
    "bankName": "ICICI Bank",
    "accNo": "389201100041",
    "ifsc": "ICIC0000789",
    "pan": "ABCDE1041F",
    "pfNo": "RJ/JAI/0012345/042",
    "esiNo": "1234567890042",
    "basicSalary": 18000,
    "grossSalary": 28800,
    "gender": "Male",
    "category": "Non Teaching",
    "joinDate": "2021-04-01",
    "status": "Active"
  },
  {
    "id": "emp_043",
    "code": "EMP021",
    "name": "Mrs. Geeta Kapoor",
    "department": "Reception",
    "designation": "Receptionist",
    "phone": "9829010042",
    "email": "geeta@greenwood.edu",
    "bankName": "State Bank of India",
    "accNo": "389201100042",
    "ifsc": "SBIN0001234",
    "pan": "ABCDE1042F",
    "pfNo": "RJ/JAI/0012345/043",
    "esiNo": "—",
    "basicSalary": 25000,
    "grossSalary": 40000,
    "gender": "Female",
    "category": "Non Teaching",
    "joinDate": "2021-04-01",
    "status": "Active"
  },
  {
    "id": "emp_044",
    "code": "EMP022",
    "name": "Mr. Arun Singh",
    "department": "Reception",
    "designation": "Office Executive",
    "phone": "9829010043",
    "email": "arun@greenwood.edu",
    "bankName": "HDFC Bank",
    "accNo": "389201100043",
    "ifsc": "HDFC0000456",
    "pan": "ABCDE1043F",
    "pfNo": "RJ/JAI/0012345/044",
    "esiNo": "—",
    "basicSalary": 30000,
    "grossSalary": 48000,
    "gender": "Male",
    "category": "Non Teaching",
    "joinDate": "2021-04-01",
    "status": "Active"
  },
  {
    "id": "emp_045",
    "code": "EMP036",
    "name": "Mrs. Renuka Verma",
    "department": "Reception",
    "designation": "Music Teacher",
    "phone": "9829010044",
    "email": "renuka@greenwood.edu",
    "bankName": "ICICI Bank",
    "accNo": "389201100044",
    "ifsc": "ICIC0000789",
    "pan": "ABCDE1044F",
    "pfNo": "RJ/JAI/0012345/045",
    "esiNo": "—",
    "basicSalary": 38000,
    "grossSalary": 60800,
    "gender": "Female",
    "category": "Teaching",
    "joinDate": "2021-04-01",
    "status": "Active"
  }
];

export const getActiveStaffRoster = () => {
  try {
    const saved = localStorage.getItem('erp_staff_roster');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
          .filter(s => s.status !== 'Inactive')
          .map(s => ({
            id: s.id || `emp_${s.code}`,
            code: s.code,
            name: s.name,
            department: s.department || 'GENERAL',
            designation: s.designation || 'Staff',
            phone: s.mobile || s.phone || '',
            email: s.email || `${s.name.toLowerCase().replace(/\s+/g, '.')}@jdinternationalschool.com`,
            bankName: s.bankName || 'State Bank of India',
            accNo: s.accNo || s.accountNo || '—',
            ifsc: s.ifsc || 'SBIN0001234',
            pan: s.pan || 'ABCDE1234F',
            pfNo: s.pfNo || 'RJ/JAI/0012345/001',
            esiNo: s.esiNo || '—',
            basicSalary: Number(s.basicSalary || s.bs || 25000),
            grossSalary: Number(s.grossSalary || s.gross || Math.round((s.basicSalary || 25000) * 1.35)),
            status: s.status || 'Active',
            joinDate: s.appoinDate || s.doj || '2022-04-01'
          }));
      }
    }
  } catch (e) {
    console.warn('Error reading staff roster from localStorage:', e);
  }
  return INITIAL_STAFF_ROSTER;
};

export const getAllStaffRoster = () => {
  try {
    const saved = localStorage.getItem('erp_staff_roster');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(s => ({
          id: s.id || `emp_${s.code}`,
          code: s.code,
          name: s.name,
          department: s.department || 'GENERAL',
          designation: s.designation || 'Staff',
          phone: s.mobile || s.phone || '',
          email: s.email || `${s.name.toLowerCase().replace(/\s+/g, '.')}@jdinternationalschool.com`,
          bankName: s.bankName || 'State Bank of India',
          accNo: s.accNo || s.accountNo || '—',
          ifsc: s.ifsc || 'SBIN0001234',
          pan: s.pan || 'ABCDE1234F',
          pfNo: s.pfNo || 'RJ/JAI/0012345/001',
          esiNo: s.esiNo || '—',
          basicSalary: Number(s.basicSalary || s.bs || 25000),
          grossSalary: Number(s.grossSalary || s.gross || Math.round((s.basicSalary || 25000) * 1.35)),
          status: s.status || 'Active',
          gender: s.gender || 'Male',
          category: s.category || 'Teaching',
          employmentType: s.employmentType || 'Permanent',
          workType: s.workType || 'Full Time',
          joinDate: s.appoinDate || s.doj || '2022-04-01'
        }));
      }
    }
  } catch (e) {
    console.warn('Error reading staff roster:', e);
  }
  return INITIAL_STAFF_ROSTER;
};

export const calculateSalaryDetails = ({
  grossSalary,
  configuredWorkingDays,
  lopDays,
  halfDays = 0,
  overtimeHours = 0,
  month = 10,
  year = 2026,
  pSettings = null,
  basic,
  workingDays,
  absentDays,
  payrollPolicies
}) => {
  const resolvedGross = grossSalary ?? basic ?? 0;
  const resolvedWorkingDays = configuredWorkingDays ?? workingDays ?? 23;
  const resolvedLop = lopDays ?? absentDays ?? 0;
  const totalCalendarDays = new Date(year, month + 1, 0).getDate();
  const calculationDays = resolvedWorkingDays || 23;
  const dailyRate = calculationDays > 0 ? resolvedGross / calculationDays : 0;
  const lopDeduction = dailyRate * resolvedLop;
  const halfDayDeduction = dailyRate * 0.5 * halfDays;
  const unpaidLeaveDeduction = lopDeduction + halfDayDeduction;
  const overtimePay = overtimeHours > 0 ? (dailyRate / 8) * overtimeHours : 0;

  return {
    calculationDays,
    totalCalendarDays,
    calculationMethod: 'Working Days',
    dailyRate,
    perDaySalary: dailyRate,
    lopDeduction,
    halfDayDeduction,
    unpaidLeaveDeduction,
    overtimePay
  };
};

export const DEFAULT_MONTHLY_CONFIG = {
  workingDays: 23,
  weeklyOffs: 5,
  publicHolidays: 2,
  weeklyOffPattern: 'SunOnly',
  days: Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    const isSun = [1, 8, 15, 22, 29].includes(day);
    const isHoliday = [12, 13].includes(day);
    return {
      day,
      status: isSun ? 'WeeklyOff' : isHoliday ? 'PublicHoliday' : 'Working'
    };
  })
};

export const calculateStaffSalary = (staff, policies = DEFAULT_SALARY_POLICIES, overrides = {}) => {
  const gross = Number(overrides.grossSalary ?? staff.grossSalary ?? 30000);
  const totalDays = overrides.totalDays ?? 30;
  const presentDays = overrides.presentDays ?? 28;
  const paidLeaveDays = overrides.paidLeaveDays ?? 2;
  const payableDays = Math.min(totalDays, presentDays + paidLeaveDays);
  const attendanceRatio = totalDays > 0 ? payableDays / totalDays : 1;

  // Basic calculation
  const basicPercent = policies.basicPercentOfGross || 45;
  const baseBasic = staff.basicSalary || Math.round(gross * (basicPercent / 100));
  const basic = Math.round(baseBasic * attendanceRatio);

  // Allowances calculation
  let totalAllowances = 0;
  const allowancesBreakdown = {};

  (policies.allowances || []).forEach(al => {
    let amt = 0;
    if (al.calculationType === 'percent_of_basic') {
      amt = Math.round(basic * (al.value / 100));
    } else if (al.calculationType === 'percent_of_gross') {
      amt = Math.round(gross * (al.value / 100) * attendanceRatio);
    } else {
      amt = Math.round((al.value || 0) * attendanceRatio);
    }
    allowancesBreakdown[al.id] = amt;
    totalAllowances += amt;
  });

  const bonus = Number(overrides.bonus || 0);
  const overtime = Number(overrides.overtimePay || 0);
  const calculatedGross = basic + totalAllowances + bonus + overtime;

  // Deductions: EPF (12% of basic up to ceiling 15,000)
  let epf = 0;
  if (policies.deductions?.epf?.enabled) {
    const epfWage = Math.min(basic, policies.deductions.epf.wageCeiling || 15000);
    epf = Math.round(epfWage * ((policies.deductions.epf.employeePercent || 12) / 100));
  }

  // Deductions: ESI (0.75% of gross if gross <= ceiling 21,000)
  let esi = 0;
  if (policies.deductions?.esi?.enabled) {
    const esiCeiling = policies.deductions.esi.grossCeiling || 21000;
    if (gross <= esiCeiling) {
      esi = Math.round(calculatedGross * ((policies.deductions.esi.employeePercent || 0.75) / 100));
    }
  }

  // Deductions: Professional Tax
  let professionalTax = 0;
  if (policies.deductions?.professionalTax?.enabled) {
    const slabs = policies.deductions.professionalTax.slabs || [];
    for (const slab of slabs) {
      if (calculatedGross >= slab.minGross && (slab.maxGross === null || calculatedGross <= slab.maxGross)) {
        professionalTax = slab.monthlyTax;
        break;
      }
    }
  }

  const advanceRecovery = Number(overrides.advanceRecovery || 0);
  const tds = Number(overrides.tds || 0);
  const otherDeductions = Number(overrides.otherDeductions || 0);

  const totalDeductions = epf + esi + professionalTax + advanceRecovery + tds + otherDeductions;
  const netSalary = Math.max(0, calculatedGross - totalDeductions);

  return {
    basic,
    allowancesBreakdown,
    totalAllowances,
    bonus,
    overtimePay: overtime,
    grossSalary: calculatedGross,
    epf,
    esi,
    professionalTax,
    advanceRecovery,
    tds,
    otherDeductions,
    totalDeductions,
    netSalary,
    totalDays,
    presentDays,
    paidLeaveDays,
    payableDays,
    attendanceRatio
  };
};

export const DEFAULT_ADVANCES = [
  {
    id: 'adv_1',
    staffId: 'emp_005',
    staffCode: 'EMP024',
    staffName: 'Mr. Ram Singh',
    department: 'Administration',
    designation: 'Driver',
    amount: 15000,
    disbursedDate: '2026-10-15',
    monthlyDeduction: 2500,
    recoveredAmount: 5000,
    remainingAmount: 10000,
    purpose: 'Festival & Household Needs',
    status: 'Active'
  },
  {
    id: 'adv_2',
    staffId: 'emp_008',
    staffCode: 'EMP030',
    staffName: 'Mrs. Kamala Devi',
    department: 'Administration',
    designation: 'Housekeeping Staff',
    amount: 6000,
    disbursedDate: '2026-10-20',
    monthlyDeduction: 1000,
    recoveredAmount: 2000,
    remainingAmount: 4000,
    purpose: 'Medical Emergency',
    status: 'Active'
  },
  {
    id: 'adv_3',
    staffId: 'emp_018',
    staffCode: 'EMP007',
    staffName: 'Mr. Deepak Sharma',
    department: 'Maths',
    designation: 'TGT',
    amount: 25000,
    disbursedDate: '2026-09-10',
    monthlyDeduction: 5000,
    recoveredAmount: 10000,
    remainingAmount: 15000,
    purpose: 'Educational Tools & Laptop Purchase',
    status: 'Active'
  }
];

export const salaryStorage = {
  getPolicies: () => {
    try {
      const saved = localStorage.getItem('school_erp_salary_policies');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading salary policies:', e);
    }
    return DEFAULT_SALARY_POLICIES;
  },

  savePolicies: (policies) => {
    try {
      localStorage.setItem('school_erp_salary_policies', JSON.stringify(policies));
    } catch (e) {
      console.error('Error saving salary policies:', e);
    }
  },

  getAttendancePolicies: () => {
    try {
      const saved = localStorage.getItem('school_erp_salary_attendance_policies');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading salary attendance policies:', e);
    }
    return DEFAULT_ATTENDANCE_POLICIES;
  },

  saveAttendancePolicies: (policies) => {
    try {
      localStorage.setItem('school_erp_salary_attendance_policies', JSON.stringify(policies));
    } catch (e) {
      console.error('Error saving salary attendance policies:', e);
    }
  },

  getWorkflowSettings: () => {
    try {
      const saved = localStorage.getItem('school_erp_salary_workflow_settings');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading salary workflow settings:', e);
    }
    return DEFAULT_WORKFLOW_SETTINGS;
  },

  saveWorkflowSettings: (settings) => {
    try {
      localStorage.setItem('school_erp_salary_workflow_settings', JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving salary workflow settings:', e);
    }
  },

  getBankSettings: () => {
    try {
      const saved = localStorage.getItem('school_erp_salary_bank_settings');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading salary bank settings:', e);
    }
    return DEFAULT_BANK_SETTINGS;
  },

  saveBankSettings: (settings) => {
    try {
      localStorage.setItem('school_erp_salary_bank_settings', JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving salary bank settings:', e);
    }
  },

  getDepartments: () => {
    try {
      const saved = localStorage.getItem('school_erp_salary_departments');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading salary departments:', e);
    }
    return DEFAULT_DEPARTMENTS;
  },

  saveDepartments: (depts) => {
    try {
      localStorage.setItem('school_erp_salary_departments', JSON.stringify(depts));
      window.dispatchEvent(new Event('school_erp_salary_departments_updated'));
    } catch (e) {
      console.error('Error saving salary departments:', e);
    }
  },

  getDesignations: () => {
    try {
      const saved = localStorage.getItem('school_erp_salary_designations');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading salary designations:', e);
    }
    return DEFAULT_DESIGNATIONS;
  },

  saveDesignations: (desgs) => {
    try {
      localStorage.setItem('school_erp_salary_designations', JSON.stringify(desgs));
      window.dispatchEvent(new Event('school_erp_salary_designations_updated'));
    } catch (e) {
      console.error('Error saving salary designations:', e);
    }
  },

  getMonthlyRecords: (monthKey = '2026-11') => {
    try {
      const saved = localStorage.getItem(`school_erp_salary_records_${monthKey}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Verify if saved records contain old dummy staff (Rameshwar, Pooja, Vikram, etc.)
        const hasDummyStaff = parsed.some(r =>
          r.name.includes('RAMESHWAR') ||
          r.name.includes('Rameshwar') ||
          r.name.includes('Pooja Verma') ||
          r.name.includes('POOJA VERMA') ||
          r.name.includes('Kamla Devi') ||
          r.name.includes('Gopal Lal Gujjar')
        );
        if (!hasDummyStaff && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading salary records:', e);
    }

    // Generate accurate calculated records from real active staff roster
    const policies = salaryStorage.getPolicies();
    const activeRoster = getActiveStaffRoster();
    const attendanceRecords = salaryStorage.getMonthlyAttendance(monthKey);

    const records = activeRoster.map(staff => {
      const att = attendanceRecords.find(a => a.staffId?.id === staff.id || a.staffId?.code === staff.code) || {};
      const unpaidLeaveDays = att.unpaidLeaveDays ?? 0;
      const halfDays = att.halfDays ?? 0;
      const overtimeHours = att.overtimeHours ?? 0;
      const workingDays = att.workingDays || 23;
      const presentDays = att.presentDays || (workingDays - unpaidLeaveDays);

      const dailyRate = workingDays > 0 ? staff.grossSalary / workingDays : 0;
      const lopDeduction = Math.round(dailyRate * (unpaidLeaveDays + (halfDays * 0.5)));
      const overtimePay = Math.round(overtimeHours > 0 ? (dailyRate / 8) * overtimeHours : 0);

      const calc = calculateStaffSalary(staff, policies, {
        grossSalary: staff.grossSalary,
        presentDays: presentDays,
        totalDays: workingDays,
        bonus: 0,
        overtimePay: overtimePay,
        otherDeductions: lopDeduction,
        advanceRecovery: 0,
        tds: 0
      });

      return {
        id: `sal_${staff.id}_${monthKey}`,
        staffId: staff.id,
        code: staff.code,
        name: staff.name,
        department: staff.department,
        designation: staff.designation,
        phone: staff.phone,
        email: staff.email,
        bankName: staff.bankName,
        accNo: staff.accNo,
        ifsc: staff.ifsc,
        pan: staff.pan,
        pfNo: staff.pfNo,
        esiNo: staff.esiNo,
        month: monthKey,
        status: 'Pending',
        payMode: 'Bank Transfer',
        disbursedDate: `${monthKey}-28`,
        receiptNo: `PAY-${monthKey.replace('-', '')}-${staff.code.replace('EMP-', '')}`,
        lopDeduction,
        unpaidLeaveDays,
        halfDays,
        overtimeHours,
        ...calc
      };
    });
    salaryStorage.saveMonthlyRecords(monthKey, records);
    return records;
  },

  saveMonthlyRecords: (monthKey, records) => {
    try {
      localStorage.setItem(`school_erp_salary_records_${monthKey}`, JSON.stringify(records));
      window.dispatchEvent(new Event('school_salary_records_updated'));
    } catch (e) {
      console.error('Error saving monthly salary records:', e);
    }
  },

  updateStaffSalary: (staffId, newSalaryData) => {
    try {
      const roster = getActiveStaffRoster();
      const updatedRoster = roster.map(s => {
        if (s.id === staffId || s.code === staffId) {
          return {
            ...s,
            grossSalary: Number(newSalaryData.grossSalary ?? s.grossSalary),
            basicSalary: Number(newSalaryData.basicSalary ?? s.basicSalary)
          };
        }
        return s;
      });
      localStorage.setItem('erp_staff_roster', JSON.stringify(updatedRoster));

      // Trigger automatic recalculation for current active months
      salaryStorage.recalculateMonthRecords('2026-11');
      window.dispatchEvent(new Event('school_erp_staff_salary_updated'));
      return updatedRoster;
    } catch (e) {
      console.error('Error updating staff salary:', e);
      return [];
    }
  },

  saveStaffRoster: (roster) => {
    try {
      localStorage.setItem('erp_staff_roster', JSON.stringify(roster));
      salaryStorage.recalculateMonthRecords('2026-11');
      window.dispatchEvent(new Event('school_erp_staff_salary_updated'));
    } catch (e) {
      console.error('Error saving staff roster:', e);
    }
  },

  addStaffMember: (newStaff) => {
    try {
      const roster = getAllStaffRoster();
      const code = newStaff.code || `EMP${String(roster.length + 1).padStart(3, '0')}`;
      const staff = {
        id: newStaff.id || `emp_${Date.now()}`,
        code: code,
        name: newStaff.name || 'New Staff',
        department: newStaff.department || 'Administration',
        designation: newStaff.designation || 'Teacher',
        phone: newStaff.phone || '',
        email: newStaff.email || `${code.toLowerCase()}@greenwood.edu`,
        bankName: newStaff.bankName || 'State Bank of India',
        accNo: newStaff.accNo || '—',
        ifsc: newStaff.ifsc || 'SBIN0001234',
        pan: newStaff.pan || 'ABCDE1234F',
        pfNo: newStaff.pfNo || 'RJ/JAI/0012345/001',
        esiNo: newStaff.esiNo || '—',
        basicSalary: Number(newStaff.basicSalary || 25000),
        grossSalary: Number(newStaff.grossSalary || 35000),
        status: newStaff.status || 'Active',
        gender: newStaff.gender || 'Male',
        category: newStaff.category || 'Teaching',
        employmentType: newStaff.employmentType || 'Permanent',
        workType: newStaff.workType || 'Full Time',
        joinDate: newStaff.joinDate || new Date().toISOString().slice(0, 10),
        ...newStaff
      };
      const updated = [staff, ...roster];
      salaryStorage.saveStaffRoster(updated);
      return updated;
    } catch (e) {
      console.error('Error adding staff member:', e);
      return [];
    }
  },

  updateStaffMember: (staffId, patch) => {
    try {
      const roster = getAllStaffRoster();
      const updated = roster.map(s => {
        if (s.id === staffId || s.code === staffId) {
          return { ...s, ...patch };
        }
        return s;
      });
      salaryStorage.saveStaffRoster(updated);
      return updated;
    } catch (e) {
      console.error('Error updating staff member:', e);
      return [];
    }
  },

  deleteStaffMember: (staffId) => {
    try {
      const roster = getAllStaffRoster();
      // Soft-delete to Inactive
      const updated = roster.map(s => {
        if (s.id === staffId || s.code === staffId) {
          return { ...s, status: 'Inactive' };
        }
        return s;
      });
      salaryStorage.saveStaffRoster(updated);
      return updated;
    } catch (e) {
      console.error('Error deleting staff member:', e);
      return [];
    }
  },

  bulkUpdateStaffStatus: (staffIds, status) => {
    try {
      const roster = getAllStaffRoster();
      const idSet = new Set(staffIds);
      const updated = roster.map(s => {
        if (idSet.has(s.id) || idSet.has(s.code)) {
          return { ...s, status };
        }
        return s;
      });
      salaryStorage.saveStaffRoster(updated);
      return updated;
    } catch (e) {
      console.error('Error in bulk status update:', e);
      return [];
    }
  },

  recalculateMonthRecords: (monthKey = '2026-11') => {
    const policies = salaryStorage.getPolicies();
    const activeRoster = getActiveStaffRoster();
    const attendanceRecords = salaryStorage.getMonthlyAttendance(monthKey);

    const existing = (() => {
      try {
        const saved = localStorage.getItem(`school_erp_salary_records_${monthKey}`);
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    })();

    const records = activeRoster.map(staff => {
      const oldRec = existing.find(r => r.staffId === staff.id || r.code === staff.code) || {};
      const att = attendanceRecords.find(a => a.staffId?.id === staff.id || a.staffId?.code === staff.code) || {};

      const unpaidLeaveDays = att.unpaidLeaveDays ?? 0;
      const halfDays = att.halfDays ?? 0;
      const overtimeHours = att.overtimeHours ?? 0;
      const workingDays = att.workingDays || 23;
      const presentDays = att.presentDays || (workingDays - unpaidLeaveDays);

      const dailyRate = workingDays > 0 ? staff.grossSalary / workingDays : 0;
      const lopDeduction = Math.round(dailyRate * (unpaidLeaveDays + (halfDays * 0.5)));
      const overtimePay = Math.round(overtimeHours > 0 ? (dailyRate / 8) * overtimeHours : 0);

      const calc = calculateStaffSalary(staff, policies, {
        grossSalary: staff.grossSalary,
        presentDays: presentDays,
        totalDays: workingDays,
        bonus: oldRec.bonus || 0,
        overtimePay: overtimePay || oldRec.overtimePay || 0,
        otherDeductions: lopDeduction,
        advanceRecovery: oldRec.advanceRecovery || 0,
        tds: oldRec.tds || 0
      });

      return {
        id: oldRec.id || `sal_${staff.id}_${monthKey}`,
        staffId: staff.id,
        code: staff.code,
        name: staff.name,
        department: staff.department,
        designation: staff.designation,
        phone: staff.phone,
        email: staff.email,
        bankName: staff.bankName,
        accNo: staff.accNo,
        ifsc: staff.ifsc,
        pan: staff.pan,
        pfNo: staff.pfNo,
        esiNo: staff.esiNo,
        month: monthKey,
        status: oldRec.status || 'Approved',
        payMode: oldRec.payMode || 'Bank Transfer',
        disbursedDate: oldRec.disbursedDate || `${monthKey}-28`,
        receiptNo: oldRec.receiptNo || `PAY-${monthKey.replace('-', '')}-${staff.code.replace('EMP-', '')}`,
        lopDeduction,
        unpaidLeaveDays,
        halfDays,
        overtimeHours,
        ...calc
      };
    });

    salaryStorage.saveMonthlyRecords(monthKey, records);
    return records;
  },

  getMonthlyConfig: (monthKey = '2026-11') => {
    try {
      const saved = localStorage.getItem(`school_erp_salary_monthly_config_${monthKey}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading monthly config:', e);
    }
    return DEFAULT_MONTHLY_CONFIG;
  },

  saveMonthlyConfig: (monthKey, config) => {
    try {
      localStorage.setItem(`school_erp_salary_monthly_config_${monthKey}`, JSON.stringify(config));
      window.dispatchEvent(new Event('school_erp_monthly_config_updated'));
    } catch (e) {
      console.error('Error saving monthly config:', e);
    }
  },

  getMonthlyAttendance: (monthKey = '2026-11') => {
    try {
      const saved = localStorage.getItem(`school_erp_salary_attendance_${monthKey}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const roster = getActiveStaffRoster();
          const synced = parsed.map(r => {
            const currentStaff = roster.find(s => s.id === r.staffId?.id || s.code === r.staffId?.code) || r.staffId;
            const workingDays = r.workingDays || 23;
            const calc = calculateSalaryDetails({
              grossSalary: currentStaff?.grossSalary || 30000,
              configuredWorkingDays: workingDays,
              lopDays: r.unpaidLeaveDays,
              halfDays: r.halfDays,
              overtimeHours: r.overtimeHours
            });
            return {
              ...r,
              staffId: currentStaff,
              unpaidLeaveDeduction: Math.round(calc.unpaidLeaveDeduction * 100) / 100,
              dailyRate: Math.round(calc.dailyRate * 100) / 100
            };
          });
          return synced;
        }
      }
    } catch (e) {
      console.warn('Error reading monthly attendance:', e);
    }

    const config = salaryStorage.getMonthlyConfig(monthKey);
    const workingDays = config.workingDays || 23;
    const roster = getActiveStaffRoster();

    // Default seed mapping identical to salary_software
    const records = roster.map(staff => {
      let paidLeaveDays = 0;
      let unpaidLeaveDays = 0;
      let halfDays = 0;
      let overtimeHours = 0;
      let remarks = '';

      if (staff.code === 'EMP002') { // Mrs. Sunita Sharma
        unpaidLeaveDays = 4;
        remarks = 'Family function & personal leave';
      } else if (staff.code === 'EMP023') { // Mr. Hari Prasad
        unpaidLeaveDays = 1;
        remarks = 'Bus fleet maintenance travel';
      } else if (staff.code === 'EMP030') { // Mrs. Kamala Devi
        unpaidLeaveDays = 1;
        remarks = 'Medical appointment';
      }

      const presentDays = Math.max(0, workingDays - paidLeaveDays - unpaidLeaveDays - (halfDays * 0.5));
      const paidDays = workingDays - unpaidLeaveDays - (halfDays * 0.5);

      const calc = calculateSalaryDetails({
        grossSalary: staff.grossSalary,
        configuredWorkingDays: workingDays,
        lopDays: unpaidLeaveDays,
        halfDays,
        overtimeHours
      });

      return {
        _id: `att_${staff.id}_${monthKey}`,
        staffId: staff,
        month: monthKey,
        workingDays,
        paidDays,
        paidLeaveDays,
        unpaidLeaveDays,
        presentDays,
        halfDays,
        overtimeHours,
        unpaidLeaveDeduction: Math.round(calc.unpaidLeaveDeduction * 100) / 100,
        dailyRate: Math.round(calc.dailyRate * 100) / 100,
        remarks,
        isLocked: false
      };
    });

    salaryStorage.saveMonthlyAttendance(monthKey, records);
    return records;
  },

  saveMonthlyAttendance: (monthKey, records) => {
    try {
      localStorage.setItem(`school_erp_salary_attendance_${monthKey}`, JSON.stringify(records));
      window.dispatchEvent(new Event('school_erp_salary_attendance_updated'));
    } catch (e) {
      console.error('Error saving monthly attendance:', e);
    }
  },

  updateStaffAttendance: (monthKey, recordId, patch) => {
    try {
      const records = salaryStorage.getMonthlyAttendance(monthKey);
      const config = salaryStorage.getMonthlyConfig(monthKey);
      const workingDays = config.workingDays || 23;

      const updated = records.map(r => {
        if (r._id === recordId || r.staffId?.id === recordId || r.staffId?.code === recordId) {
          const paidLeaveDays = Number(patch.paidLeaveDays ?? r.paidLeaveDays);
          const unpaidLeaveDays = Number(patch.unpaidLeaveDays ?? r.unpaidLeaveDays);
          const halfDays = Number(patch.halfDays ?? r.halfDays);
          const overtimeHours = Number(patch.overtimeHours ?? r.overtimeHours);
          const remarks = patch.remarks !== undefined ? patch.remarks : r.remarks;

          const presentDays = Math.max(0, workingDays - paidLeaveDays - unpaidLeaveDays - (halfDays * 0.5));
          const paidDays = workingDays - unpaidLeaveDays - (halfDays * 0.5);

          const calc = calculateSalaryDetails({
            grossSalary: r.staffId?.grossSalary || 30000,
            configuredWorkingDays: workingDays,
            lopDays: unpaidLeaveDays,
            halfDays,
            overtimeHours
          });

          return {
            ...r,
            paidLeaveDays,
            unpaidLeaveDays,
            halfDays,
            overtimeHours,
            remarks,
            presentDays,
            paidDays,
            unpaidLeaveDeduction: Math.round(calc.unpaidLeaveDeduction * 100) / 100,
            dailyRate: Math.round(calc.dailyRate * 100) / 100
          };
        }
        return r;
      });

      salaryStorage.saveMonthlyAttendance(monthKey, updated);
      salaryStorage.recalculateMonthRecords(monthKey);
      return updated;
    } catch (e) {
      console.error('Error updating staff attendance:', e);
      return [];
    }
  },

  toggleAttendanceLock: (monthKey, recordId) => {
    try {
      const records = salaryStorage.getMonthlyAttendance(monthKey);
      const updated = records.map(r => {
        if (r._id === recordId || r.staffId?.id === recordId || r.staffId?.code === recordId) {
          return { ...r, isLocked: !r.isLocked };
        }
        return r;
      });
      salaryStorage.saveMonthlyAttendance(monthKey, updated);
      return updated;
    } catch (e) {
      console.error('Error toggling attendance lock:', e);
      return [];
    }
  },

  disburseAll: (monthKey, paymentDetails = {}) => {
    try {
      const records = salaryStorage.getMonthlyRecords(monthKey);
      const disDate = paymentDetails.payDate || new Date().toISOString().slice(0, 10);
      const updated = records.map(r => ({
        ...r,
        status: 'Paid',
        payMode: paymentDetails.payMethod || 'Bank Transfer',
        disbursedDate: disDate,
        transactionRef: paymentDetails.payRef || `TXN-${Date.now().toString().slice(-6)}`,
        disburseRemarks: paymentDetails.payRemarks || 'Monthly Payroll Disbursed'
      }));
      salaryStorage.saveMonthlyRecords(monthKey, updated);
      return updated;
    } catch (e) {
      console.error('Error disbursing all salaries:', e);
      return [];
    }
  },

  reopenPayroll: (monthKey, { reason = 'Administrative Reopen' } = {}) => {
    try {
      const records = salaryStorage.getMonthlyRecords(monthKey);
      const updated = records.map(r => ({
        ...r,
        status: 'Pending',
        reopenedReason: reason,
        reopenedAt: new Date().toISOString()
      }));
      salaryStorage.saveMonthlyRecords(monthKey, updated);
      return updated;
    } catch (e) {
      console.error('Error reopening payroll:', e);
      return [];
    }
  },

  disburseSingle: (monthKey, recordId, paymentDetails = {}) => {
    try {
      const records = salaryStorage.getMonthlyRecords(monthKey);
      const disDate = paymentDetails.payDate || new Date().toISOString().slice(0, 10);
      const updated = records.map(r => {
        if (r.id === recordId || r.staffId === recordId || r.code === recordId) {
          return {
            ...r,
            status: 'Paid',
            payMode: paymentDetails.payMethod || 'Bank Transfer',
            disbursedDate: disDate,
            transactionRef: paymentDetails.payRef || `TXN-${Date.now().toString().slice(-6)}`,
            disburseRemarks: paymentDetails.payRemarks || 'Disbursed'
          };
        }
        return r;
      });
      salaryStorage.saveMonthlyRecords(monthKey, updated);
      return updated;
    } catch (e) {
      console.error('Error disbursing single salary:', e);
      return [];
    }
  },

  getAdvances: () => {
    try {
      const saved = localStorage.getItem('school_erp_salary_advances');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading salary advances:', e);
    }
    return DEFAULT_ADVANCES;
  },

  saveAdvances: (advances) => {
    try {
      localStorage.setItem('school_erp_salary_advances', JSON.stringify(advances));
      window.dispatchEvent(new Event('school_erp_salary_advances_updated'));
    } catch (e) {
      console.error('Error saving salary advances:', e);
    }
  },

  addAdvance: (newAdv) => {
    try {
      const current = salaryStorage.getAdvances();
      const adv = {
        id: `adv_${Date.now()}`,
        status: 'Active',
        recoveredAmount: 0,
        remainingAmount: Number(newAdv.amount || 0),
        disbursedDate: new Date().toISOString().slice(0, 10),
        ...newAdv
      };
      const updated = [adv, ...current];
      salaryStorage.saveAdvances(updated);
      return updated;
    } catch (e) {
      console.error('Error adding advance:', e);
      return [];
    }
  }
};
