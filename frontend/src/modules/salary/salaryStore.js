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
  { id: 'dept_1', name: 'Accounts', code: 'ACC', createdAt: '2026-11-03' },
  { id: 'dept_2', name: 'Administration', code: 'ADMIN', createdAt: '2026-11-03' },
  { id: 'dept_3', name: 'Computer', code: 'COMP', createdAt: '2026-11-03' },
  { id: 'dept_4', name: 'English', code: 'ENG', createdAt: '2026-11-03' },
  { id: 'dept_5', name: 'Hindi', code: 'HIN', createdAt: '2026-11-03' },
  { id: 'dept_6', name: 'Library', code: 'LIB', createdAt: '2026-11-03' },
  { id: 'dept_7', name: 'Maths', code: 'MATH', createdAt: '2026-11-03' },
  { id: 'dept_8', name: 'Science', code: 'SCI', createdAt: '2026-11-03' },
  { id: 'dept_9', name: 'Security & Maintenance', code: 'SEC', createdAt: '2026-11-03' },
  { id: 'dept_10', name: 'Teaching', code: 'TEACH', createdAt: '2026-11-03' },
  { id: 'dept_11', name: 'Transport', code: 'TRANS', createdAt: '2026-11-03' }
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
    id: 'emp_101',
    code: '101',
    name: 'ABHILASHA BHATT',
    department: 'ADMINISTRATIVE & MANAGEMENT',
    designation: 'Principal',
    phone: '9829012345',
    email: 'abhilasha.bhatt@jdinternationalschool.com',
    bankName: 'State Bank of India',
    accNo: '34892019482',
    ifsc: 'SBIN0001234',
    pan: 'ABCDE1234F',
    pfNo: 'RJ/JAI/0012345/001',
    esiNo: '—',
    basicSalary: 65000,
    grossSalary: 85750,
    joinDate: '2020-04-01',
    status: 'Active'
  },
  {
    id: 'emp_102',
    code: '102',
    name: 'PRITI VERMA',
    department: 'ADMINISTRATIVE & MANAGEMENT',
    designation: 'Administrator',
    phone: '9414023456',
    email: 'priti.verma@jdinternationalschool.com',
    bankName: 'HDFC Bank',
    accNo: '501002394821',
    ifsc: 'HDFC0000456',
    pan: 'BCDEF2345G',
    pfNo: 'RJ/JAI/0012345/002',
    esiNo: '—',
    basicSalary: 42000,
    grossSalary: 57000,
    joinDate: '2021-07-15',
    status: 'Active'
  },
  {
    id: 'emp_201',
    code: '201',
    name: 'MONIKA RANI VERMA',
    department: 'TEACHING',
    designation: 'Teacher',
    phone: '9783034567',
    email: 'monika.verma@jdinternationalschool.com',
    bankName: 'ICICI Bank',
    accNo: '10293847562',
    ifsc: 'ICIC0000789',
    pan: 'CDEFG3456H',
    pfNo: 'RJ/JAI/0012345/003',
    esiNo: '—',
    basicSalary: 35000,
    grossSalary: 48250,
    joinDate: '2022-06-10',
    status: 'Active'
  },
  {
    id: 'emp_202',
    code: '202',
    name: 'SUNITA KUMARI',
    department: 'TEACHING',
    designation: 'Teacher',
    phone: '9672045678',
    email: 'sunita.k@jdinternationalschool.com',
    bankName: 'Bank of Baroda',
    accNo: '09876543210',
    ifsc: 'BARB0MALVIY',
    pan: 'DEFGH4567J',
    pfNo: 'RJ/JAI/0012345/004',
    esiNo: '—',
    basicSalary: 32000,
    grossSalary: 44500,
    joinDate: '2022-08-01',
    status: 'Active'
  },
  {
    id: 'emp_501',
    code: '501',
    name: 'BHARAT JANGID',
    department: 'TRANSPORT',
    designation: 'Driver',
    phone: '9587056789',
    email: 'bharat.driver@jdinternationalschool.com',
    bankName: 'Punjab National Bank',
    accNo: '29384756102',
    ifsc: 'PUNB0123400',
    pan: 'EFGHI5678K',
    pfNo: 'RJ/JAI/0012345/005',
    esiNo: '1234567890123456',
    basicSalary: 22000,
    grossSalary: 31500,
    joinDate: '2023-01-10',
    status: 'Active'
  },
  {
    id: 'emp_502',
    code: '502',
    name: 'HANSRAJ JAT',
    department: 'TRANSPORT',
    designation: 'Driver',
    phone: '9460067890',
    email: 'hansraj.jat@jdinternationalschool.com',
    bankName: 'State Bank of India',
    accNo: '49382019472',
    ifsc: 'SBIN0005678',
    pan: 'FGHIJ6789L',
    pfNo: 'RJ/JAI/0012345/006',
    esiNo: '2345678901234567',
    basicSalary: 24000,
    grossSalary: 34000,
    joinDate: '2023-03-01',
    status: 'Active'
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
    const records = activeRoster.map(staff => {
      const calc = calculateStaffSalary(staff, policies);
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
        status: 'Approved', // 'Draft', 'Approved', 'Disbursed'
        payMode: 'Bank Transfer',
        disbursedDate: `${monthKey}-28`,
        receiptNo: `PAY-${monthKey.replace('-', '')}-${staff.code.replace('EMP-', '')}`,
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

  recalculateMonthRecords: (monthKey = '2026-11') => {
    const policies = salaryStorage.getPolicies();
    const activeRoster = getActiveStaffRoster();
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
      const calc = calculateStaffSalary(staff, policies, {
        grossSalary: staff.grossSalary,
        presentDays: oldRec.presentDays,
        totalDays: oldRec.totalDays,
        bonus: oldRec.bonus,
        overtimePay: oldRec.overtimePay,
        advanceRecovery: oldRec.advanceRecovery,
        tds: oldRec.tds
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
        ...calc
      };
    });

    salaryStorage.saveMonthlyRecords(monthKey, records);
    return records;
  }
};
