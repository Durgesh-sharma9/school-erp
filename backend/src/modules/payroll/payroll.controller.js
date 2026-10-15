import { prisma } from '../../config/database.js';

// In-memory persistent mock store for payroll with multi-tenant readiness
const mockStore = {
  branches: [
    { id: '1', name: 'J D INTERNATIONAL SCHOOL', type: 'Secondary', address: 'Main Campus', phone: '9672992836' }
  ],
  departments: [
    { id: '1', department: 'ACCOUNTS', remark: 'Finance & Fee collection' },
    { id: '2', department: 'ADMINISTRATIVE & MANAGEMENT', remark: 'Leadership & front office' },
    { id: '3', department: 'LIBRARY', remark: 'Books and media collection' },
    { id: '4', department: 'NON TEACHING', remark: 'Support and maintenance staff' },
    { id: '5', department: 'TEACHING', remark: 'Academic faculty' },
    { id: '6', department: 'TRANSPORT', remark: 'Conveyance Services' }
  ],
  designations: [
    { id: '1', designation: 'Accountant', department: 'ACCOUNTS', payGrade: 'Grade C' },
    { id: '2', designation: 'Administrator', department: 'ADMINISTRATIVE & MANAGEMENT', payGrade: 'Grade A' },
    { id: '3', designation: 'Director', department: 'ADMINISTRATIVE & MANAGEMENT', payGrade: 'Grade A' },
    { id: '4', designation: 'Driver', department: 'TRANSPORT', payGrade: 'Grade A' },
    { id: '5', designation: 'LIBRARIAN', department: 'LIBRARY', payGrade: 'Grade A' },
    { id: '6', designation: 'Principal', department: 'ADMINISTRATIVE & MANAGEMENT', payGrade: 'Grade A' },
    { id: '7', designation: 'Teacher', department: 'TEACHING', payGrade: 'Grade B' }
  ],
  allowances: {
    da: { type: 'Percentage', value: 10 },
    hra: { type: 'Percentage', value: 15 },
    conv: { type: 'Amount', value: 1500 },
    med: { type: 'Amount', value: 1000 },
    spl: { type: 'Amount', value: 2000 },
    epf: { type: 'Percentage', value: 12 },
    esic: { type: 'Percentage', value: 0.75 },
    pt: { type: 'Amount', value: 200 },
    lic: { type: 'Amount', value: 0 },
    tds: { type: 'Percentage', value: 5 }
  },
  leaveSetup: [
    { id: '1', department: 'TEACHING', employeeType: 'Permanent', gender: 'All', casualLeave: 12, earnedLeave: 15, medicalLeave: 10 },
    { id: '2', department: 'ADMINISTRATIVE & MANAGEMENT', employeeType: 'Permanent', gender: 'All', casualLeave: 12, earnedLeave: 18, medicalLeave: 10 },
    { id: '3', department: 'TRANSPORT', employeeType: 'Permanent', gender: 'Male', casualLeave: 10, earnedLeave: 12, medicalLeave: 8 }
  ],
  shifts: [
    { id: '1', shiftName: 'Shift 1st (Morning)', shiftCode: '100', shiftIn: '08:00', shiftOut: '14:00', hourAllow: 6.00, overTime: 0.00 },
    { id: '2', shiftName: 'Shift 2nd (Afternoon)', shiftCode: '101', shiftIn: '14:00', shiftOut: '20:00', hourAllow: 6.00, overTime: 0.00 }
  ],
  staff: [
    { id: '1', code: '101', name: 'ABHILASHA BHATT', designation: 'Principal', department: 'ADMINISTRATIVE & MANAGEMENT', mobile: '9672992836', appoinDate: '02/01/2026', basicSalary: 65000, accNo: 'SBI-489211029', status: 'Active', gender: 'Female' },
    { id: '2', code: '102', name: 'PRITI VERMA', designation: 'Administrator', department: 'ADMINISTRATIVE & MANAGEMENT', mobile: '9079909813', appoinDate: '02/01/2026', basicSalary: 42000, accNo: 'HDFC-88291039', status: 'Active', gender: 'Female' },
    { id: '3', code: '201', name: 'MONIKA RANI VERMA', designation: 'Teacher', department: 'TEACHING', mobile: '9870943695', appoinDate: '05/01/2026', basicSalary: 35000, accNo: 'PNB-338291093', status: 'Active', gender: 'Female' },
    { id: '4', code: '202', name: 'SUNITA KUMARI', designation: 'Teacher', department: 'TEACHING', mobile: '9511719644', appoinDate: '05/01/2026', basicSalary: 32000, accNo: 'BOB-992019283', status: 'Active', gender: 'Female' },
    { id: '5', code: '501', name: 'BHARAT JANGID', designation: 'Driver', department: 'TRANSPORT', mobile: '8107187618', appoinDate: '30/12/2025', basicSalary: 22000, accNo: 'CBI-102938475', status: 'Active', gender: 'Male' },
    { id: '6', code: '502', name: 'HANSRAJ JAT', designation: 'Driver', department: 'TRANSPORT', mobile: '9636644293', appoinDate: '01/01/2016', basicSalary: 24000, accNo: 'SBI-772910283', status: 'Active', gender: 'Male' },
    { id: '7', code: '301', name: 'RAKESH SHARMA', designation: 'Accountant', department: 'ACCOUNTS', mobile: '9829989330', appoinDate: '01/02/2026', basicSalary: 38000, accNo: 'ICICI-22910293', status: 'Active', gender: 'Male' }
  ],
  attendance: [
    { id: '1', date: '2026-10-15', present: 6, absent: 1, leave: 0, total: 7 },
    { id: '2', date: '2026-10-14', present: 7, absent: 0, leave: 0, total: 7 }
  ],
  advanceSalary: [
    { id: '1', name: 'BHARAT JANGID (501)', installments: 3, payType: 'Cash', amount: 10000, paymentDate: '2026-09-15', remaining: 6667 },
    { id: '2', name: 'SUNITA KUMARI (202)', installments: 2, payType: 'Bank Transfer', amount: 15000, paymentDate: '2026-10-01', remaining: 7500 }
  ],
  salaries: [
    {
      id: '1',
      month: '2026-09',
      staffId: '1',
      code: '101',
      name: 'ABHILASHA BHATT',
      designation: 'Principal',
      department: 'ADMINISTRATIVE & MANAGEMENT',
      accNo: 'SBI-489211029',
      basicSalary: 65000,
      da: 6500,
      hra: 9750,
      conv: 1500,
      medReim: 1000,
      spl: 2000,
      gross: 85750,
      epf: 7800,
      esic: 487,
      proTax: 200,
      lic: 0,
      advDed: 0,
      netSalary: 77263,
      workingDays: 30,
      payableDays: 30,
      status: 'Paid',
      payMode: 'Bank Transfer',
      payDate: '2026-10-01'
    },
    {
      id: '2',
      month: '2026-09',
      staffId: '3',
      code: '201',
      name: 'MONIKA RANI VERMA',
      designation: 'Teacher',
      department: 'TEACHING',
      accNo: 'PNB-338291093',
      basicSalary: 35000,
      da: 3500,
      hra: 5250,
      conv: 1500,
      medReim: 1000,
      spl: 2000,
      gross: 48250,
      epf: 4200,
      esic: 262,
      proTax: 200,
      lic: 0,
      advDed: 0,
      netSalary: 43588,
      workingDays: 30,
      payableDays: 30,
      status: 'Paid',
      payMode: 'Bank Transfer',
      payDate: '2026-10-01'
    }
  ]
};

// 1. Branch Controllers
export const getBranches = async (req, res) => {
  try {
    return res.json({ success: true, data: mockStore.branches });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createBranch = async (req, res) => {
  try {
    const { name, type, address, phone } = req.body;
    const newBranch = {
      id: Date.now().toString(),
      name,
      type: type || 'Secondary',
      address,
      phone
    };
    mockStore.branches.push(newBranch);
    return res.status(201).json({ success: true, data: newBranch });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 2. Department Controllers
export const getDepartments = async (req, res) => {
  try {
    return res.json({ success: true, data: mockStore.departments });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createDepartment = async (req, res) => {
  try {
    const { department, remark } = req.body;
    const newDept = {
      id: Date.now().toString(),
      department: department.toUpperCase(),
      remark: remark || ''
    };
    mockStore.departments.push(newDept);
    return res.status(201).json({ success: true, data: newDept });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 3. Designation Controllers
export const getDesignations = async (req, res) => {
  try {
    return res.json({ success: true, data: mockStore.designations });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createDesignation = async (req, res) => {
  try {
    const { designation, department, payGrade } = req.body;
    const newDesig = {
      id: Date.now().toString(),
      designation,
      department,
      payGrade: payGrade || 'Grade B'
    };
    mockStore.designations.push(newDesig);
    return res.status(201).json({ success: true, data: newDesig });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 4. Allowances Controllers
export const getAllowances = async (req, res) => {
  try {
    return res.json({ success: true, data: mockStore.allowances });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateAllowances = async (req, res) => {
  try {
    mockStore.allowances = { ...mockStore.allowances, ...req.body };
    return res.json({ success: true, data: mockStore.allowances });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 5. Leave Setup Controllers
export const getLeaveSetup = async (req, res) => {
  try {
    return res.json({ success: true, data: mockStore.leaveSetup });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createLeaveSetup = async (req, res) => {
  try {
    const { department, employeeType, gender, casualLeave, earnedLeave, medicalLeave } = req.body;
    const newSetup = {
      id: Date.now().toString(),
      department,
      employeeType: employeeType || 'Permanent',
      gender: gender || 'All',
      casualLeave: Number(casualLeave) || 12,
      earnedLeave: Number(earnedLeave) || 15,
      medicalLeave: Number(medicalLeave) || 10
    };
    mockStore.leaveSetup.push(newSetup);
    return res.status(201).json({ success: true, data: newSetup });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 6. Shift Master Controllers
export const getShifts = async (req, res) => {
  try {
    return res.json({ success: true, data: mockStore.shifts });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createShift = async (req, res) => {
  try {
    const { shiftName, shiftCode, shiftIn, shiftOut, hourAllow, overTime } = req.body;
    const newShift = {
      id: Date.now().toString(),
      shiftName,
      shiftCode: shiftCode || (100 + mockStore.shifts.length).toString(),
      shiftIn,
      shiftOut,
      hourAllow: Number(hourAllow) || 6.0,
      overTime: Number(overTime) || 0.0
    };
    mockStore.shifts.push(newShift);
    return res.status(201).json({ success: true, data: newShift });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 7. Staff Registration Controllers
export const getStaffList = async (req, res) => {
  try {
    return res.json({ success: true, data: mockStore.staff });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createStaff = async (req, res) => {
  try {
    const { code, name, designation, department, mobile, appoinDate, basicSalary, accNo, gender } = req.body;
    const newStaff = {
      id: Date.now().toString(),
      code: code || (mockStore.staff.length + 101).toString(),
      name,
      designation,
      department,
      mobile,
      appoinDate: appoinDate || new Date().toISOString().split('T')[0],
      basicSalary: Number(basicSalary) || 25000,
      accNo: accNo || 'N/A',
      status: 'Active',
      gender: gender || 'Female'
    };
    mockStore.staff.unshift(newStaff);
    return res.status(201).json({ success: true, data: newStaff });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 8. Staff Attendance Controllers
export const getStaffAttendance = async (req, res) => {
  try {
    return res.json({ success: true, data: mockStore.attendance });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 9. Advance Salary Controllers
export const getAdvanceSalaries = async (req, res) => {
  try {
    return res.json({ success: true, data: mockStore.advanceSalary });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createAdvanceSalary = async (req, res) => {
  try {
    const { name, installments, payType, amount, paymentDate } = req.body;
    const newAdv = {
      id: Date.now().toString(),
      name,
      installments: Number(installments) || 1,
      payType: payType || 'Cash',
      amount: Number(amount) || 5000,
      paymentDate: paymentDate || new Date().toISOString().split('T')[0],
      remaining: Number(amount) || 5000
    };
    mockStore.advanceSalary.unshift(newAdv);
    return res.status(201).json({ success: true, data: newAdv });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 10. Generate Salary Controllers
export const getGeneratedSalaries = async (req, res) => {
  try {
    const { month } = req.query;
    const results = month ? mockStore.salaries.filter(s => s.month === month) : mockStore.salaries;
    return res.json({ success: true, data: results });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const generateSalariesForMonth = async (req, res) => {
  try {
    const { month, payMode = 'Bank Transfer', payDate } = req.body;
    // Calculate for all active staff
    const generated = mockStore.staff.map(st => {
      const bs = st.basicSalary;
      const da = Math.round(bs * 0.1);
      const hra = Math.round(bs * 0.15);
      const conv = 1500;
      const medReim = 1000;
      const spl = 2000;
      const gross = bs + da + hra + conv + medReim + spl;
      const epf = Math.round(bs * 0.12);
      const esic = Math.round(gross * 0.0075);
      const proTax = 200;
      const lic = 0;
      const advDed = 0;
      const net = gross - (epf + esic + proTax + lic + advDed);

      return {
        id: `${month}-${st.id}`,
        month,
        staffId: st.id,
        code: st.code,
        name: st.name,
        designation: st.designation,
        department: st.department,
        accNo: st.accNo,
        basicSalary: bs,
        da,
        hra,
        conv,
        medReim,
        spl,
        gross,
        epf,
        esic,
        proTax,
        lic,
        advDed,
        netSalary: net,
        workingDays: 30,
        payableDays: 30,
        status: 'Generated',
        payMode,
        payDate: payDate || new Date().toISOString().split('T')[0]
      };
    });

    // Store in mockStore
    mockStore.salaries = [...generated, ...mockStore.salaries.filter(s => s.month !== month)];

    return res.status(201).json({ success: true, data: generated });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
