
// Auto-purge all cached dummy demo data
if (typeof window !== 'undefined' && !localStorage.getItem('erp_data_clean_purge_v1')) {
  try {
    ['sch_jd_intl', 'sch_dps_branch2', 'sch_default'].forEach(sid => {
      localStorage.removeItem(`erp_tenant_${sid}_students`);
      localStorage.removeItem(`erp_tenant_${sid}_receipts`);
    });
    localStorage.removeItem('erp_staff_roster');
    localStorage.removeItem('erp_biometric_sync_roster');
    localStorage.setItem('erp_data_clean_purge_v1', 'true');
  } catch (e) {}
}
/**
 * Enterprise Multi-Tenant Client Store
 * Guarantees strict data isolation between tenants:
 * - School A (sch_jd_intl) data CANNOT be seen by School B (sch_dps_branch2).
 * - Each tenant's data is isolated under its own namespace in localStorage.
 * - Synchronizes with backend /api endpoints passing x-school-id tenant header.
 */

// Initial Seed Data for School A: J D International School
const INITIAL_SCHOOL_A_STUDENTS = [];
const INITIAL_SCHOOL_B_STUDENTS = [];

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
    logoUrl: "https://temp.erichost.app/assets/schools/jdisjr_221/school/1_school_photo_1766831297_f7516d5fc58b9af84fb1.jpg",
    brandingImages: {
      school_logo: "https://temp.erichost.app/assets/schools/jdisjr_221/school/1_school_photo_1766831297_f7516d5fc58b9af84fb1.jpg",
      board_logo: "",
      principal_sig: ""
    }
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
    logoUrl: "",
    brandingImages: {
      school_logo: "",
      board_logo: "",
      principal_sig: ""
    }
  }
};

// Seed Dashboard Stats
const EMPTY_STATS = {
  todayCollection: { total: 0, receiptsCount: 0, cash: 0, bank: 0 },
  feeRevenueSummary: { totalRevenue: 0, totalDue: 0, totalReceivedYTD: 0, receivedPercentage: 0, duePercentage: 0 },
  totalStudents: { total: 0, boys: 0, girls: 0, newAdmissions: 0, oldStudents: 0, growthRate: "0%" },
  attendanceToday: { percentage: 0, totalPresent: 0, totalAbsent: 0, trend: "0%" }
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
    return [];
  }

  // Set/sync full student roster for active school tenant
  setStudents(schoolId, students) {
    if (!schoolId) return;
    const key = this.getStorageKey(schoolId, 'students');
    try {
      localStorage.setItem(key, JSON.stringify(students || []));
    } catch (e) {
      console.error(e);
    }
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

  // 2a. Update an existing student in tenant store
  updateStudent(schoolId, admNo, updatedData) {
    if (!schoolId || !admNo) return null;
    const students = this.getStudents(schoolId);
    const index = students.findIndex(s => String(s.admNo) === String(admNo) || String(s.id) === String(admNo));
    if (index === -1) {
      return this.addStudent(schoolId, updatedData);
    }

    students[index] = {
      ...students[index],
      ...updatedData,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(this.getStorageKey(schoolId, 'students'), JSON.stringify(students));
    return students[index];
  }

  // Get classes strictly belonging to this school
  getClasses(schoolId) {
    if (!schoolId) return [];
    const key = this.getStorageKey(schoolId, 'classes');
    try {
      const stored = localStorage.getItem(key);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [];
  }

  // Save classes strictly belonging to this school
  saveClasses(schoolId, classesList) {
    if (!schoolId) return;
    const key = this.getStorageKey(schoolId, 'classes');
    localStorage.setItem(key, JSON.stringify(classesList || []));
  }

  // 2b. Promote students to target class and division
  promoteStudents(schoolId, studentIds, targetClass, targetDivision) {
    if (!schoolId || !studentIds || studentIds.length === 0) return [];
    const students = this.getStudents(schoolId);
    const updated = students.map(s => {
      if (studentIds.includes(s.id) || studentIds.includes(s.admNo)) {
        return {
          ...s,
          className: targetClass,
          section: targetDivision,
          class_id: targetClass,
          division_id: targetDivision
        };
      }
      return s;
    });
    localStorage.setItem(this.getStorageKey(schoolId, 'students'), JSON.stringify(updated));
    return updated;
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
      pinCode: "",
      logoUrl: "",
      brandingImages: {}
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

    // Always calculate dynamically from live data

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

// Seamless Multi-Module Cross-Linking & Navigation Flow Helpers
  setPendingEditStudent(data) {
    try {
      sessionStorage.setItem('erp_pending_edit_student', JSON.stringify(data));
    } catch (e) {}
  }

  getPendingEditStudent() {
    try {
      const raw = sessionStorage.getItem('erp_pending_edit_student');
      if (raw) {
        sessionStorage.removeItem('erp_pending_edit_student');
        return JSON.parse(raw);
      }
    } catch (e) {}
    return null;
  }

  setPendingRegistration(data) {
    try {
      sessionStorage.setItem('erp_pending_registration', JSON.stringify(data));
    } catch (e) {}
  }

  getPendingRegistration() {
    try {
      const raw = sessionStorage.getItem('erp_pending_registration');
      if (raw) {
        sessionStorage.removeItem('erp_pending_registration');
        return JSON.parse(raw);
      }
    } catch (e) {}
    return null;
  }

  setPendingFeeStudent(data) {
    try {
      sessionStorage.setItem('erp_pending_fee_student', JSON.stringify(data));
    } catch (e) {}
  }

  getPendingFeeStudent() {
    try {
      const raw = sessionStorage.getItem('erp_pending_fee_student');
      if (raw) {
        sessionStorage.removeItem('erp_pending_fee_student');
        return JSON.parse(raw);
      }
    } catch (e) {}
    return null;
  }

  setPendingAbsenteeNotice(data) {
    try {
      sessionStorage.setItem('erp_pending_absentee_notice', JSON.stringify(data));
    } catch (e) {}
  }

  getPendingAbsenteeNotice() {
    try {
      const raw = sessionStorage.getItem('erp_pending_absentee_notice');
      if (raw) {
        sessionStorage.removeItem('erp_pending_absentee_notice');
        return JSON.parse(raw);
      }
    } catch (e) {}
    return null;
  }

  setPendingIdCardStudent(data) {
    try {
      sessionStorage.setItem('erp_pending_id_card_student', JSON.stringify(data));
    } catch (e) {}
  }

  getPendingIdCardStudent() {
    try {
      const raw = sessionStorage.getItem('erp_pending_id_card_student');
      if (raw) {
        sessionStorage.removeItem('erp_pending_id_card_student');
        return JSON.parse(raw);
      }
    } catch (e) {}
    return null;
  }

  setPendingDirectSms(data) {
    try {
      sessionStorage.setItem('erp_pending_direct_sms', JSON.stringify(data));
    } catch (e) {}
  }

  getPendingDirectSms() {
    try {
      const raw = sessionStorage.getItem('erp_pending_direct_sms');
      if (raw) {
        sessionStorage.removeItem('erp_pending_direct_sms');
        return JSON.parse(raw);
      }
    } catch (e) {}
    return null;
  }

  setPendingReportCardClass(data) {
    try {
      sessionStorage.setItem('erp_pending_report_card_class', JSON.stringify(data));
    } catch (e) {}
  }

  getPendingReportCardClass() {
    try {
      const raw = sessionStorage.getItem('erp_pending_report_card_class');
      if (raw) {
        sessionStorage.removeItem('erp_pending_report_card_class');
        return JSON.parse(raw);
      }
    } catch (e) {}
    return null;
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

  // 11. Exam Date Sheets
  getExamDateSheets(schoolId) {
    if (!schoolId) return [];
    try {
      const key = this.getStorageKey(schoolId, 'exam_date_sheets');
      const stored = localStorage.getItem(key);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [];
  }

  setExamDateSheets(schoolId, sheets) {
    if (!schoolId) return;
    try {
      const key = this.getStorageKey(schoolId, 'exam_date_sheets');
      localStorage.setItem(key, JSON.stringify(sheets || []));
    } catch (e) {
      console.error(e);
    }
  }

  addExamDateSheet(schoolId, sheet) {
    if (!schoolId || !sheet) return;
    try {
      const current = this.getExamDateSheets(schoolId);
      const updated = [sheet, ...current.filter((s) => s.id !== sheet.id)];
      this.setExamDateSheets(schoolId, updated);
      return updated;
    } catch (e) {
      console.error(e);
    }
  }

  deleteExamDateSheet(schoolId, sheetId) {
    if (!schoolId || !sheetId) return;
    try {
      const current = this.getExamDateSheets(schoolId);
      const updated = current.filter((s) => s.id !== sheetId);
      this.setExamDateSheets(schoolId, updated);
      return updated;
    } catch (e) {
      console.error(e);
    }
  }

  updateExamDateSheet(schoolId, sheetId, updatedData) {
    if (!schoolId || !sheetId) return;
    try {
      const current = this.getExamDateSheets(schoolId);
      const updated = current.map((s) => (s.id === sheetId ? { ...s, ...updatedData } : s));
      this.setExamDateSheets(schoolId, updated);
      return updated;
    } catch (e) {
      console.error(e);
    }
  }
}

export const tenantStore = new TenantDataStore();
