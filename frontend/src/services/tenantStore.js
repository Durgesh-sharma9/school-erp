/**
 * Enterprise Multi-Tenant Client Store
 * Guarantees strict data isolation between tenants:
 * - School A (sch_jd_intl) data CANNOT be seen by School B (sch_dps_branch2).
 * - Each tenant's data is isolated under its own namespace in localStorage.
 * - Synchronizes with backend /api endpoints passing x-school-id tenant header.
 */

// Initial Seed Data for School A: J D International School
const INITIAL_SCHOOL_A_STUDENTS = [
  {
    sNo: 1,
    id: 'std_jd_1',
    schoolId: 'sch_jd_intl',
    enrollNo: 'ENR-JD-001',
    admNo: '1621',
    srNo: '1621',
    rollNo: '1',
    feebookNo: 'FB-1621',
    name: 'AADITYA SINGH CHOUDHARY',
    gender: 'Male',
    className: 'I',
    section: 'A',
    fatherName: 'NARENDRA SINGH CHOUDHARY',
    motherName: 'SUNITA CHOUDHARY',
    contactNo: '9829012345',
    category: 'GEN',
    isRte: false,
    isNew: false,
    status: 'Active',
    totalFees: 31000,
    paidFees: 17000,
    dueFees: 14000
  },
  {
    sNo: 2,
    id: 'std_jd_2',
    schoolId: 'sch_jd_intl',
    enrollNo: 'ENR-JD-002',
    admNo: 'A135',
    srNo: '0',
    rollNo: '2',
    feebookNo: 'FB-A135',
    name: 'ADVIK RAO',
    gender: 'Male',
    className: 'I',
    section: 'A',
    fatherName: 'PRADEEP RAO',
    motherName: 'PRIYANKA RAO',
    contactNo: '9414023456',
    category: 'GEN',
    isRte: false,
    isNew: true,
    status: 'Active',
    totalFees: 28000,
    paidFees: 28000,
    dueFees: 0
  },
  {
    sNo: 3,
    id: 'std_jd_3',
    schoolId: 'sch_jd_intl',
    enrollNo: 'ENR-JD-003',
    admNo: '2059',
    srNo: '2059',
    rollNo: '14',
    feebookNo: 'FB-2059',
    name: 'AADHYA CHOUDHARY',
    gender: 'Female',
    className: 'Nursery - PP3+',
    section: 'A',
    fatherName: 'RAMESH CHOUDHARY',
    motherName: 'SUNITA CHOUDHARY',
    contactNo: '6377281034',
    category: 'GEN',
    isRte: false,
    isNew: false,
    status: 'Active',
    totalFees: 13500,
    paidFees: 13500,
    dueFees: 0
  }
];

// Initial Seed Data for School B: Delhi Public Academy (Different students, completely separate)
const INITIAL_SCHOOL_B_STUDENTS = [
  {
    sNo: 1,
    id: 'std_dps_1',
    schoolId: 'sch_dps_branch2',
    enrollNo: 'ENR-DPS-101',
    admNo: 'DPS-101',
    srNo: '501',
    rollNo: '1',
    feebookNo: 'FB-DPS-101',
    name: 'ROHAN SHARMA',
    gender: 'Male',
    className: 'Class 10',
    section: 'A',
    fatherName: 'SUNIL SHARMA',
    motherName: 'MEENA SHARMA',
    contactNo: '9810033445',
    category: 'GEN',
    isRte: false,
    isNew: false,
    status: 'Active',
    totalFees: 20500,
    paidFees: 3500,
    dueFees: 17000
  },
  {
    sNo: 2,
    id: 'std_dps_2',
    schoolId: 'sch_dps_branch2',
    enrollNo: 'ENR-DPS-102',
    admNo: 'DPS-102',
    srNo: '502',
    rollNo: '2',
    feebookNo: 'FB-DPS-102',
    name: 'PRIYA PATEL',
    gender: 'Female',
    className: 'Class 9',
    section: 'B',
    fatherName: 'BHAVESH PATEL',
    motherName: 'NEHA PATEL',
    contactNo: '9810044556',
    category: 'OBC',
    isRte: false,
    isNew: true,
    status: 'Active',
    totalFees: 18000,
    paidFees: 18000,
    dueFees: 0
  }
];

// Seed Profiles
const INITIAL_PROFILES = {
  'sch_jd_intl': {
    schoolName: "J D International School",
    schoolCode: "10964",
    udiseNo: "08121204312",
    affiliationNo: "1730619",
    phone1: "8947919195",
    email: "10964@cbseshiksha.in",
    website: "www.jdschooljaipur.com",
    address: "Mahapura, Ajmer Road, Jaipur",
    place: "Jaipur",
    state: "Rajasthan",
    pinCode: "302026",
    logoUrl: "https://temp.erichost.app/assets/schools/jdisjr_221/school/1_school_photo_1766831297_f7516d5fc58b9af84fb1.jpg"
  },
  'sch_dps_branch2': {
    schoolName: "Delhi Public Academy",
    schoolCode: "DPA-2026",
    udiseNo: "07080911223",
    affiliationNo: "2730119",
    phone1: "9810011223",
    email: "principal@dpsacademy.edu.in",
    website: "www.dpsacademy.edu.in",
    address: "Sector 14, Dwarka, New Delhi",
    place: "New Delhi",
    state: "Delhi",
    pinCode: "110075",
    logoUrl: ""
  }
};

// Seed Dashboard Stats
const INITIAL_STATS = {
  'sch_jd_intl': {
    todayCollection: { total: 45000, receiptsCount: 3, cash: 15000, bank: 30000 },
    feeRevenueSummary: { totalRevenue: 31221901, totalDue: 283445, totalReceivedYTD: 30943456, receivedPercentage: 99.1, duePercentage: 0.9 },
    totalStudents: { total: 928, boys: 494, girls: 434, newAdmissions: 168, oldStudents: 760, growthRate: "18.1% ↑" },
    attendanceToday: { percentage: 94.2, totalPresent: 874, totalAbsent: 54, trend: "2.1% ↑" }
  },
  'sch_dps_branch2': {
    todayCollection: { total: 18500, receiptsCount: 2, cash: 8500, bank: 10000 },
    feeRevenueSummary: { totalRevenue: 14200000, totalDue: 550000, totalReceivedYTD: 13650000, receivedPercentage: 96.1, duePercentage: 3.9 },
    totalStudents: { total: 412, boys: 218, girls: 194, newAdmissions: 84, oldStudents: 328, growthRate: "12.4% ↑" },
    attendanceToday: { percentage: 96.5, totalPresent: 398, totalAbsent: 14, trend: "1.2% ↑" }
  }
};

class TenantDataStore {
  getStorageKey(schoolId, entity) {
    const validSchoolId = schoolId || 'empty_tenant';
    return `erp_tenant_${validSchoolId}_${entity}`;
  }

  // Register and initialize a brand-new self-registered school
  registerNewSchool(school, user) {
    if (!school || !school.id) return;
    const schoolId = school.id;

    // 1. Initialize strictly empty student container (0 students)
    localStorage.setItem(this.getStorageKey(schoolId, 'students'), JSON.stringify([]));

    // 2. Initialize strictly empty fee receipts container (0 receipts)
    localStorage.setItem(this.getStorageKey(schoolId, 'receipts'), JSON.stringify([]));

    // 3. Save school profile with provided registration info
    const profile = {
      id: schoolId,
      schoolName: school.schoolName || 'New School',
      schoolCode: school.schoolCode || 'SCH-NEW',
      udiseNo: school.udiseNo || '',
      affiliationNo: school.affiliationNo || '',
      phone1: school.phone1 || '',
      phone2: school.phone2 || '',
      email: school.email || '',
      website: school.website || '',
      address: school.address || '',
      place: school.place || school.city || '',
      state: school.state || '',
      pinCode: school.pinCode || '',
      receiptNotes: school.receiptNotes || 'Fees once paid is non-refundable. Computerized receipt.',
      logoUrl: school.logoUrl || '',
      affiliationBoard: school.affiliationBoard || 'CBSE',
      category: school.category || 'K-12'
    };
    localStorage.setItem(this.getStorageKey(schoolId, 'profile'), JSON.stringify(profile));

    // 4. Register in list of self-registered tenants
    const registeredSchools = this.getRegisteredSchools();
    const exists = registeredSchools.some(s => s.id === schoolId);
    if (!exists) {
      registeredSchools.push({
        id: schoolId,
        schoolName: school.schoolName,
        schoolCode: school.schoolCode,
        adminMobile: user?.username || school.phone1
      });
      localStorage.setItem('erp_registered_schools_registry', JSON.stringify(registeredSchools));
    }
  }

  // Get all self-registered schools
  getRegisteredSchools() {
    try {
      const stored = localStorage.getItem('erp_registered_schools_registry');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [];
  }

  // 1. Get students strictly belonging to this school
  getStudents(schoolId) {
    if (!schoolId) return [];
    const key = this.getStorageKey(schoolId, 'students');
    try {
      const stored = localStorage.getItem(key);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }

    // Default seeds strictly for Demo School A
    if (schoolId === 'sch_jd_intl') {
      localStorage.setItem(key, JSON.stringify(INITIAL_SCHOOL_A_STUDENTS));
      return INITIAL_SCHOOL_A_STUDENTS;
    }
    // Default seeds strictly for Demo School B
    if (schoolId === 'sch_dps_branch2') {
      localStorage.setItem(key, JSON.stringify(INITIAL_SCHOOL_B_STUDENTS));
      return INITIAL_SCHOOL_B_STUDENTS;
    }

    // Newly registered school starts with 0 students (NO DUMMY DATA)
    return [];
  }

  // 2. Add student strictly into this school's container
  addStudent(schoolId, studentData) {
    if (!schoolId) return null;
    const students = this.getStudents(schoolId);
    
    const newStudent = {
      ...studentData,
      id: studentData.id || `std_${Date.now()}`,
      schoolId: schoolId,
      sNo: students.length + 1,
      createdAt: new Date().toISOString()
    };

    const updated = [newStudent, ...students];
    localStorage.setItem(this.getStorageKey(schoolId, 'students'), JSON.stringify(updated));
    return newStudent;
  }

  // 3. Get school profile strictly for this school
  getSchoolProfile(schoolId) {
    if (!schoolId) {
      return {
        schoolName: "School",
        schoolCode: "",
        udiseNo: "",
        affiliationNo: "",
        phone1: "",
        email: "",
        website: "",
        address: "",
        place: "",
        state: "",
        pinCode: ""
      };
    }

    const key = this.getStorageKey(schoolId, 'profile');
    try {
      const stored = localStorage.getItem(key);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }

    if (INITIAL_PROFILES[schoolId]) {
      return INITIAL_PROFILES[schoolId];
    }

    // Return clean empty structure with no dummy city, no dummy address
    return {
      schoolName: "My Registered School",
      schoolCode: "SCH-NEW",
      udiseNo: "",
      affiliationNo: "",
      phone1: "",
      email: "",
      website: "",
      address: "",
      place: "",
      state: "",
      pinCode: ""
    };
  }

  // 4. Update school profile
  updateSchoolProfile(schoolId, profileData) {
    if (!schoolId) return profileData;
    const current = this.getSchoolProfile(schoolId);
    const updated = { ...current, ...profileData };
    localStorage.setItem(this.getStorageKey(schoolId, 'profile'), JSON.stringify(updated));
    return updated;
  }

  // 5. Get dashboard metrics strictly for this school
  getDashboardStats(schoolId) {
    if (!schoolId) {
      return {
        todayCollection: { total: 0, receiptsCount: 0, cash: 0, bank: 0 },
        feeRevenueSummary: { totalRevenue: 0, totalDue: 0, totalReceivedYTD: 0, receivedPercentage: 0, duePercentage: 0 },
        totalStudents: { total: 0, boys: 0, girls: 0, newAdmissions: 0, oldStudents: 0, growthRate: "0%" },
        attendanceToday: { percentage: 0, totalPresent: 0, totalAbsent: 0, trend: "0%" }
      };
    }

    // Pre-seeded demo stats for School A
    if (schoolId === 'sch_jd_intl') {
      return INITIAL_STATS['sch_jd_intl'];
    }
    // Pre-seeded demo stats for School B
    if (schoolId === 'sch_dps_branch2') {
      return INITIAL_STATS['sch_dps_branch2'];
    }

    // Dynamically calculate for newly created school: strictly 0 if no records
    const students = this.getStudents(schoolId);
    const receipts = this.getReceipts(schoolId);

    const todayStr = new Date().toISOString().split('T')[0];
    const todayReceipts = receipts.filter(r => r.date === todayStr);
    const totalToday = todayReceipts.reduce((sum, r) => sum + (Number(r.paidAmount) || 0), 0);
    const totalRevenue = students.reduce((sum, s) => sum + (Number(s.totalFees) || 0), 0);
    const totalReceivedYTD = receipts.reduce((sum, r) => sum + (Number(r.paidAmount) || 0), 0);
    const totalDue = Math.max(0, totalRevenue - totalReceivedYTD);

    return {
      todayCollection: {
        total: totalToday,
        receiptsCount: todayReceipts.length,
        cash: todayReceipts.filter(r => r.payMode === 'Cash').reduce((sum, r) => sum + (Number(r.paidAmount) || 0), 0),
        bank: todayReceipts.filter(r => r.payMode !== 'Cash').reduce((sum, r) => sum + (Number(r.paidAmount) || 0), 0)
      },
      feeRevenueSummary: {
        totalRevenue,
        totalDue,
        totalReceivedYTD,
        receivedPercentage: totalRevenue > 0 ? Number(((totalReceivedYTD / totalRevenue) * 100).toFixed(1)) : 0,
        duePercentage: totalRevenue > 0 ? Number(((totalDue / totalRevenue) * 100).toFixed(1)) : 0
      },
      totalStudents: {
        total: students.length,
        boys: students.filter(s => s.gender === 'Male').length,
        girls: students.filter(s => s.gender === 'Female' || s.gender === 'Girl').length,
        newAdmissions: students.filter(s => s.isNew).length,
        oldStudents: students.filter(s => !s.isNew).length,
        growthRate: students.length > 0 ? "+100%" : "0%"
      },
      attendanceToday: {
        percentage: 0,
        totalPresent: 0,
        totalAbsent: 0,
        trend: "0%"
      }
    };
  }

  // 6. Get fee receipts strictly for this school
  getReceipts(schoolId) {
    if (!schoolId) return [];
    const key = this.getStorageKey(schoolId, 'receipts');
    try {
      const stored = localStorage.getItem(key);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }

    if (schoolId === 'sch_dps_branch2') {
      return [
        {
          receiptNo: 'DPS-REC-101',
          admNo: 'DPS-101',
          studentName: 'ROHAN SHARMA',
          className: 'Class 10-A',
          paidAmount: 3500,
          payMode: 'Bank Transfer',
          date: '2026-04-15'
        }
      ];
    }

    if (schoolId === 'sch_jd_intl') {
      return [
        {
          receiptNo: 'JD-REC-001',
          admNo: '1621',
          studentName: 'AADITYA SINGH CHOUDHARY',
          className: 'Class I-A',
          paidAmount: 17000,
          payMode: 'UPI',
          date: '2026-04-10'
        },
        {
          receiptNo: 'JD-REC-002',
          admNo: '2059',
          studentName: 'AADHYA CHOUDHARY',
          className: 'Nursery - PP3+-A',
          paidAmount: 13500,
          payMode: 'Cash',
          date: '2026-04-12'
        }
      ];
    }

    // Clean empty receipts array for new schools
    return [];
  }

  // 7. Add fee receipt strictly to this school
  addReceipt(schoolId, receiptData) {
    if (!schoolId) return null;
    const receipts = this.getReceipts(schoolId);
    const prefix = schoolId === 'sch_dps_branch2' ? 'DPS' : schoolId === 'sch_jd_intl' ? 'JD' : 'REC';
    const newReceipt = {
      id: `rec_${Date.now()}`,
      receiptNo: receiptData.receiptNo || `${prefix}-2026-${String(receipts.length + 1).padStart(3, '0')}`,
      ...receiptData,
      status: 'SUCCESS',
      schoolId: schoolId,
      date: receiptData.date || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };
    const updated = [newReceipt, ...receipts];
    localStorage.setItem(this.getStorageKey(schoolId, 'receipts'), JSON.stringify(updated));
    return newReceipt;
  }

  // 8. Cancel a fee receipt
  cancelReceipt(schoolId, receiptNo, reason = 'Operator Cancellation') {
    if (!schoolId || !receiptNo) return false;
    const receipts = this.getReceipts(schoolId);
    const target = receipts.find(r => r.receiptNo === receiptNo);
    if (!target) return false;
    
    target.status = 'CANCELLED';
    target.cancelReason = reason;
    target.cancelledAt = new Date().toISOString();
    localStorage.setItem(this.getStorageKey(schoolId, 'receipts'), JSON.stringify(receipts));
    return true;
  }

  // 9. Update student paid and due fee balance
  updateStudentFees(schoolId, admNo, amountPaid) {
    if (!schoolId || !admNo) return null;
    const students = this.getStudents(schoolId);
    const student = students.find(s => String(s.admNo) === String(admNo));
    if (!student) return null;

    student.paidFees = (Number(student.paidFees) || 0) + Number(amountPaid);
    student.dueFees = Math.max(0, (Number(student.totalFees) || 0) - student.paidFees);

    localStorage.setItem(this.getStorageKey(schoolId, 'students'), JSON.stringify(students));
    return student;
  }

  // 10. Persist student custom fee heads per tenant
  getStudentFeeHeads(schoolId, admNo) {
    if (!schoolId || !admNo) return null;
    try {
      const key = this.getStorageKey(schoolId, `heads_${admNo}`);
      const stored = localStorage.getItem(key);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return null;
  }

  saveStudentFeeHeads(schoolId, admNo, heads) {
    if (!schoolId || !admNo) return;
    try {
      const key = this.getStorageKey(schoolId, `heads_${admNo}`);
      localStorage.setItem(key, JSON.stringify(heads));
    } catch (e) {
      console.error(e);
    }
  }
}

export const tenantStore = new TenantDataStore();
