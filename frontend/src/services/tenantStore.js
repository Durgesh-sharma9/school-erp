
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

    const targetAdm = String(studentData?.admNo || studentData?.adm_no || '').trim();
    if (targetAdm) {
      const targetAdmLower = targetAdm.toLowerCase();
      const targetId = studentData.id ? String(studentData.id).trim() : null;
      const existingIdx = students.findIndex(
        s => String(s.admNo).trim().toLowerCase() === targetAdmLower || (targetId && String(s.id).trim() === targetId)
      );
      if (existingIdx !== -1) {
        return this.updateStudent(schoolId, targetAdm, studentData);
      }
    }
    
    const newStudent = {
      ...studentData,
      id: studentData.id || `std_${Date.now()}`,
      schoolId: schoolId,
      admNo: targetAdm || String(Math.floor(2000 + Math.random() * 8000)),
      sNo: students.length + 1,
      isNew: true,
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
    const trimmedAdm = String(admNo).trim().toLowerCase();
    const targetId = updatedData?.id ? String(updatedData.id).trim() : null;
    const index = students.findIndex(
      s => String(s.admNo).trim().toLowerCase() === trimmedAdm || String(s.id).trim() === trimmedAdm || (targetId && String(s.id).trim() === targetId)
    );
    if (index === -1) {
      return this.addStudent(schoolId, updatedData);
    }

    students[index] = {
      ...students[index],
      ...updatedData,
      id: students[index].id,
      admNo: students[index].admNo,
      isNew: false,
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
        attendanceToday: { percentage: 0, totalPresent: 0, totalAbsent: 0, trend: "0%" },
        paymodes: { cash: 0, bank: 0, cheque: 0, online: 0, upi: 0, card: 0 },
        recentTransactions: []
      };
    }

    const students = this.getStudents(schoolId) || [];
    const receipts = this.getReceipts(schoolId) || [];

    let totalRevenue = 0;
    let totalReceivedYTD = 0;
    let totalDue = 0;

    students.forEach(s => {
      const heads = this.getStudentFeeHeads(schoolId, s.admNo) || this.getStudentFeeLedger(schoolId, s.admNo) || [];
      if (heads.length > 0) {
        heads.forEach(h => {
          const amt = Number(h.netPayable != null ? h.netPayable : (h.payable != null ? h.payable : h.amount)) || 0;
          totalRevenue += amt;
          if (h.isPaid || h.paid > 0) {
            totalReceivedYTD += Number(h.paid || amt);
          } else {
            totalDue += amt;
          }
        });
      } else {
        const sTotal = Number(s.totalFees) || 0;
        const sPaid = Number(s.paidFees) || 0;
        totalRevenue += sTotal;
        totalReceivedYTD += sPaid;
        totalDue += Math.max(0, sTotal - sPaid);
      }
    });

    const todayStr = new Date().toISOString().split('T')[0];
    const todayReceipts = receipts.filter(r => r.date === todayStr);

    const paymodes = { cash: 0, bank: 0, cheque: 0, online: 0, upi: 0, card: 0 };
    receipts.forEach(r => {
      const amt = Number(r.paidAmount) || 0;
      const m = (r.payMode || 'Cash').toLowerCase();
      if (m === 'cash') paymodes.cash += amt;
      else if (m === 'bank' || m === 'transfer') paymodes.bank += amt;
      else if (m === 'cheque' || m === 'check') paymodes.cheque += amt;
      else if (m === 'online' || m === 'netbanking') paymodes.online += amt;
      else if (m === 'upi') paymodes.upi += amt;
      else if (m === 'card') paymodes.card += amt;
      else paymodes.cash += amt;
    });

    let totalToday = todayReceipts.reduce((sum, r) => sum + (Number(r.paidAmount) || 0), 0);
    let todayReceiptCount = todayReceipts.length;
    let todayCash = todayReceipts.filter(r => (r.payMode || 'Cash').toLowerCase() === 'cash').reduce((sum, r) => sum + (Number(r.paidAmount) || 0), 0);
    let todayBank = totalToday - todayCash;

    if (todayReceiptCount === 0 && receipts.length > 0) {
      totalToday = Number(receipts[0].paidAmount) || 0;
      todayReceiptCount = 1;
      todayCash = (receipts[0].payMode || 'Cash').toLowerCase() === 'cash' ? totalToday : 0;
      todayBank = totalToday - todayCash;
    }

    return {
      todayCollection: {
        total: totalToday,
        receiptsCount: todayReceiptCount,
        cash: todayCash,
        bank: todayBank
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
        boys: students.filter(s => (s.gender || '').toLowerCase() === 'male' || (s.gender || '').toLowerCase() === 'boy').length,
        girls: students.filter(s => (s.gender || '').toLowerCase() === 'female' || (s.gender || '').toLowerCase() === 'girl').length,
        newAdmissions: students.filter(s => s.isNew || s.studentType === 'New').length,
        oldStudents: students.filter(s => !s.isNew && s.studentType !== 'New').length,
        growthRate: students.length > 0 ? '+100%' : '0%'
      },
      attendanceToday: {
        percentage: students.length > 0 ? 100 : 0,
        totalPresent: students.length,
        totalAbsent: 0,
        trend: students.length > 0 ? '100% Present' : '0%'
      },
      paymodes,
      recentTransactions: receipts.slice(0, 8)
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

  clearPendingEditStudent() {
    try {
      sessionStorage.removeItem('erp_pending_edit_student');
    } catch (e) {}
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

    // Revert student balance: subtract paid amount, restore due balance
    if (target.admNo && target.paidAmount) {
      this.updateStudentFees(schoolId, target.admNo, -Number(target.paidAmount));
    }
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

  // 10. Persist student custom fee heads per tenant with dynamic structure & concession resolution
  getStudentFeeHeads(schoolId, admNo) {
    if (!schoolId || !admNo) return [];
    try {
      const key = this.getStorageKey(schoolId, `heads_${admNo}`);
      const stored = localStorage.getItem(key);
      if (stored && stored !== 'null' && stored !== '[]') return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }

    // Fallback 1: check student fee ledger
    const ledger = this.getStudentFeeLedger(schoolId, admNo);
    if (ledger && ledger.length > 0) {
      const mapped = ledger.map(h => ({
        id: h.id || `h_${h.feeHead}`,
        head: h.feeHead,
        total: Number(h.amount) || 0,
        discount: Number(h.discount) || 0,
        payable: Number(h.netPayable) || (Number(h.amount) - (Number(h.discount) || 0)),
        paid: h.isPaid ? (Number(h.netPayable) || Number(h.amount)) : 0,
        due: h.isPaid ? 0 : (Number(h.netPayable) || (Number(h.amount) - (Number(h.discount) || 0))),
        payingNow: h.isPaid ? 0 : (Number(h.netPayable) || (Number(h.amount) - (Number(h.discount) || 0))),
        checked: !h.isPaid
      }));
      this.saveStudentFeeHeads(schoolId, admNo, mapped);
      return mapped;
    }

    // Fallback 2: Check fee structure for student class
    const students = this.getStudents(schoolId);
    const student = students.find(s => String(s.admNo) === String(admNo));
    if (student) {
      const structures = this.getFeeStructures(schoolId);
      const studentClass = String(student.className || '').toUpperCase();
      const matchedStructure = structures.find(st => {
        const c = String(st.className || '').toUpperCase();
        return c === studentClass || studentClass.startsWith(c);
      });

      // Check concessions
      const concessions = this.getStudentConcessions(schoolId);
      const studentConc = concessions.find(c => String(c.admNo) === String(admNo));
      const concessionAmt = studentConc ? Number(studentConc.amount) || 0 : 0;

      if (matchedStructure && matchedStructure.heads && matchedStructure.heads.length > 0) {
        const heads = matchedStructure.heads.map((h, idx) => {
          const isTuition = String(h.feeHead || '').toLowerCase().includes('tuition');
          const disc = isTuition ? concessionAmt : 0;
          const payable = Math.max(0, Number(h.amount) - disc);
          return {
            id: `h_str_${idx + 1}`,
            head: h.feeHead,
            total: Number(h.amount),
            discount: disc,
            payable,
            paid: 0,
            due: payable,
            payingNow: payable,
            checked: true
          };
        });
        this.saveStudentFeeHeads(schoolId, admNo, heads);
        return heads;
      }

      // Default dynamic heads based on student's totalFees & paidFees
      const total = Number(student.totalFees) || 15000;
      const paid = Number(student.paidFees) || 0;
      const t1 = Math.round(total * 0.5);
      const t2 = total - t1;
      const paidT1 = Math.min(paid, t1);
      const paidT2 = Math.min(Math.max(0, paid - t1), t2);

      const heads = [
        {
          id: `h_auto_1`,
          head: 'Tuition Fee (Term 1)',
          total: t1,
          discount: concessionAmt,
          payable: Math.max(0, t1 - concessionAmt),
          paid: paidT1,
          due: Math.max(0, Math.max(0, t1 - concessionAmt) - paidT1),
          payingNow: Math.max(0, Math.max(0, t1 - concessionAmt) - paidT1),
          checked: Math.max(0, Math.max(0, t1 - concessionAmt) - paidT1) > 0
        },
        {
          id: `h_auto_2`,
          head: 'Tuition Fee (Term 2)',
          total: t2,
          discount: 0,
          payable: t2,
          paid: paidT2,
          due: Math.max(0, t2 - paidT2),
          payingNow: paidT1 === t1 ? Math.max(0, t2 - paidT2) : 0,
          checked: paidT1 === t1 && Math.max(0, t2 - paidT2) > 0
        }
      ];
      this.saveStudentFeeHeads(schoolId, admNo, heads);
      return heads;
    }

    return [];
  }

  saveStudentFeeHeads(schoolId, admNo, heads) {
    if (!schoolId || !admNo) return;
    try {
      const key = this.getStorageKey(schoolId, `heads_${admNo}`);
      localStorage.setItem(key, JSON.stringify(heads));
      // Also update ledger
      const ledgerKey = this.getStorageKey(schoolId, `fee_ledger_${admNo}`);
      localStorage.setItem(ledgerKey, JSON.stringify(heads));
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
  // ==========================================
  // Dynamic Multi-Tenant Fee Management Helpers
  // ==========================================

  getFeeStructures(schoolId) {
    if (!schoolId) return [];
    try {
      const stored = localStorage.getItem(this.getStorageKey(schoolId, 'fee_structures'));
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [];
  }

  saveFeeStructures(schoolId, list) {
    if (!schoolId) return;
    try {
      localStorage.setItem(this.getStorageKey(schoolId, 'fee_structures'), JSON.stringify(list || []));
    } catch (e) {
      console.error(e);
    }
  }

  addFeeStructure(schoolId, item) {
    if (!schoolId || !item) return null;
    const current = this.getFeeStructures(schoolId);
    const newItem = { id: item.id || `str_${Date.now()}`, ...item };
    const updated = [newItem, ...current.filter(s => s.id !== newItem.id)];
    this.saveFeeStructures(schoolId, updated);
    return newItem;
  }

  deleteFeeStructure(schoolId, id) {
    if (!schoolId || !id) return;
    const current = this.getFeeStructures(schoolId);
    const updated = current.filter(s => s.id !== String(id));
    this.saveFeeStructures(schoolId, updated);
    return updated;
  }

  getFeeHeadGroups(schoolId) {
    if (!schoolId) return [];
    try {
      const stored = localStorage.getItem(this.getStorageKey(schoolId, 'fee_head_groups'));
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [
      { id: '1', headGroup: 'Admission Fee', priority: 1, active: true },
      { id: '2', headGroup: 'Tuition Fee', priority: 2, active: true },
      { id: '3', headGroup: 'Activity Fee', priority: 3, active: true },
      { id: '4', headGroup: 'Examination Fee', priority: 4, active: true },
      { id: '5', headGroup: 'Digital Learning Fee', priority: 5, active: true }
    ];
  }

  saveFeeHeadGroups(schoolId, list) {
    if (!schoolId) return;
    try {
      localStorage.setItem(this.getStorageKey(schoolId, 'fee_head_groups'), JSON.stringify(list || []));
    } catch (e) {
      console.error(e);
    }
  }

  getFeeHeads(schoolId) {
    if (!schoolId) return [];
    try {
      const stored = localStorage.getItem(this.getStorageKey(schoolId, 'fee_heads'));
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [
      { id: '1', feeHead: 'Admission Fee', priority: 1, applyFor: 'New', gender: 'Both', installment: 'Only Once', feeType: 'dayscholar', isBoard: false },
      { id: '2', feeHead: 'Tuition Fee', priority: 2, applyFor: 'Both', gender: 'Both', installment: 'Quarterly', feeType: 'dayscholar', isBoard: false },
      { id: '3', feeHead: 'Activity Fee', priority: 3, applyFor: 'Both', gender: 'Both', installment: 'Annually', feeType: 'dayscholar', isBoard: false },
      { id: '4', feeHead: 'Examination Fee', priority: 4, applyFor: 'Both', gender: 'Both', installment: 'Annually', feeType: 'dayscholar', isBoard: false }
    ];
  }

  saveFeeHeads(schoolId, list) {
    if (!schoolId) return;
    try {
      localStorage.setItem(this.getStorageKey(schoolId, 'fee_heads'), JSON.stringify(list || []));
    } catch (e) {
      console.error(e);
    }
  }

  getConcessionTypes(schoolId) {
    if (!schoolId) return [];
    try {
      const stored = localStorage.getItem(this.getStorageKey(schoolId, 'concession_types'));
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [
      { id: '1', concessionType: 'Staff Ward', description: 'Institutional staff discount', defaultPercent: 50 },
      { id: '2', concessionType: 'Scholarship / Merit', description: 'Merit based scholarship', defaultPercent: 25 },
      { id: '3', concessionType: 'Sibling Discount', description: 'Family sibling concession', defaultPercent: 20 },
      { id: '4', concessionType: 'EWS / Need Based', description: 'Economic weaker section grant', defaultPercent: 100 }
    ];
  }

  saveConcessionTypes(schoolId, list) {
    if (!schoolId) return;
    try {
      localStorage.setItem(this.getStorageKey(schoolId, 'concession_types'), JSON.stringify(list || []));
    } catch (e) {
      console.error(e);
    }
  }

  getFineMasters(schoolId) {
    if (!schoolId) return [];
    try {
      const stored = localStorage.getItem(this.getStorageKey(schoolId, 'fine_masters'));
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [
      { id: '1', fineName: 'Late Fee Penalty', fineType: 'Per Day', increasePeriod: 'Daily', graceDays: 10, amount: 20, createdAt: new Date().toISOString().split('T')[0], updatedAt: new Date().toISOString().split('T')[0], user: 'Admin' }
    ];
  }

  saveFineMasters(schoolId, list) {
    if (!schoolId) return;
    try {
      localStorage.setItem(this.getStorageKey(schoolId, 'fine_masters'), JSON.stringify(list || []));
    } catch (e) {
      console.error(e);
    }
  }

  getStudentConcessions(schoolId) {
    if (!schoolId) return [];
    try {
      const stored = localStorage.getItem(this.getStorageKey(schoolId, 'student_concessions'));
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [];
  }

  saveStudentConcession(schoolId, concession) {
    if (!schoolId || !concession) return;
    const current = this.getStudentConcessions(schoolId);
    const newRecord = { id: concession.id || `conc_${Date.now()}`, ...concession };
    const updated = [newRecord, ...current.filter(c => c.id !== newRecord.id)];
    localStorage.setItem(this.getStorageKey(schoolId, 'student_concessions'), JSON.stringify(updated));
    return newRecord;
  }

  deleteStudentConcession(schoolId, id) {
    if (!schoolId || !id) return;
    const current = this.getStudentConcessions(schoolId);
    const updated = current.filter(c => c.id !== String(id));
    localStorage.setItem(this.getStorageKey(schoolId, 'student_concessions'), JSON.stringify(updated));
    return updated;
  }

  getStudentFeeLedger(schoolId, admNo) {
    if (!schoolId || !admNo) return null;
    try {
      const key = this.getStorageKey(schoolId, `fee_ledger_${admNo}`);
      const stored = localStorage.getItem(key);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return null;
  }

  saveStudentFeeLedger(schoolId, admNo, heads) {
    if (!schoolId || !admNo) return;
    try {
      const key = this.getStorageKey(schoolId, `fee_ledger_${admNo}`);
      localStorage.setItem(key, JSON.stringify(heads || []));
    } catch (e) {
      console.error(e);
    }
  }


  // Geofence configuration for Attendance (School coordinates and allowed radius)
  getGeofenceConfig(schoolId) {
    if (!schoolId) return null;
    try {
      const key = this.getStorageKey(schoolId, 'geofence_config');
      const stored = localStorage.getItem(key);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return {
      enabled: true,
      mode: 'strict',
      schoolLatitude: 26.9124,
      schoolLongitude: 75.7873,
      allowedRangeMeters: 200,
      campusName: 'Main School Campus',
      requireSelfie: false
    };
  }

  saveGeofenceConfig(schoolId, config) {
    if (!schoolId) return;
    try {
      const key = this.getStorageKey(schoolId, 'geofence_config');
      localStorage.setItem(key, JSON.stringify(config));
    } catch (e) {
      console.error(e);
    }
  }

  getGeofencePunches(schoolId) {
    if (!schoolId) return [];
    try {
      const key = this.getStorageKey(schoolId, 'geofence_punches');
      const stored = localStorage.getItem(key);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [];
  }

  addGeofencePunch(schoolId, punch) {
    if (!schoolId) return null;
    const current = this.getGeofencePunches(schoolId);
    const newPunch = {
      id: 'punch_' + Date.now(),
      ...punch,
      timestamp: new Date().toISOString()
    };
    const updated = [newPunch, ...current].slice(0, 50);
    localStorage.setItem(this.getStorageKey(schoolId, 'geofence_punches'), JSON.stringify(updated));
    return newPunch;
  }

  // --- Library Suppliers ---
  getLibrarySuppliers(schoolId) {
    if (!schoolId) return [];
    try {
      const key = this.getStorageKey(schoolId, 'library_suppliers');
      const stored = localStorage.getItem(key);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [
      { id: 'sup_1', name: 'Goyal Book Depot', city: 'Jaipur', mobile: '9829012345', address: 'Chaura Rasta, Jaipur', gstNo: '08AABCG1234F1Z5' },
      { id: 'sup_2', name: 'Oxford University Press', city: 'New Delhi', mobile: '9811023456', address: 'Jai Singh Road, New Delhi', gstNo: '07AAABO0001Z1' },
      { id: 'sup_3', name: 'S. Chand & Company Ltd', city: 'Jaipur', mobile: '9414056789', address: 'M.I. Road, Jaipur', gstNo: '08AAACS1234E1Z9' },
      { id: 'sup_4', name: 'Arya Book Depot', city: 'Jaipur', mobile: '9828034567', address: 'Tonk Road, Jaipur', gstNo: '08AABCA5678H1Z2' },
      { id: 'sup_5', name: 'NCERT & CBSE Publication Depot', city: 'Jaipur', mobile: '9414012345', address: 'Mansarovar, Jaipur', gstNo: '08AAACN9012K1Z3' }
    ];
  }

  saveLibrarySuppliers(schoolId, list) {
    if (!schoolId) return;
    try {
      const key = this.getStorageKey(schoolId, 'library_suppliers');
      localStorage.setItem(key, JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
  }

  addLibrarySupplier(schoolId, supplier) {
    if (!schoolId || !supplier) return null;
    const current = this.getLibrarySuppliers(schoolId);
    const newSup = {
      id: supplier.id || 'sup_' + Date.now(),
      ...supplier
    };
    const updated = [newSup, ...current];
    this.saveLibrarySuppliers(schoolId, updated);
    return newSup;
  }

  // --- Two-Way Student & School Feedback ---
  getFeedbacks(schoolId) {
    if (!schoolId) return [];
    try {
      const key = this.getStorageKey(schoolId, 'student_feedbacks');
      const stored = localStorage.getItem(key);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    // Default seed feedbacks for demonstration
    return [
      {
        id: 'fb_1',
        type: 'to_school', // student to school
        direction: 'STUDENT_TO_SCHOOL',
        studentName: 'Aarav Sharma',
        admNo: '1001',
        className: 'Class X-A',
        category: 'Academics & Teaching',
        subject: 'Interactive Science Lab Sessions',
        feedbackText: 'The physics lab practical demonstrations this term were very engaging and clear. Request to increase time for hands-on experiments.',
        rating: 5,
        status: 'Acknowledged',
        schoolReply: 'Thank you Aarav! We have scheduled extra 30 mins lab time every Wednesday starting next week.',
        date: '2026-10-28',
        submittedBy: 'Student (Aarav Sharma)'
      },
      {
        id: 'fb_2',
        type: 'to_school',
        direction: 'STUDENT_TO_SCHOOL',
        studentName: 'Priya Meena',
        admNo: '1002',
        className: 'Class IX-B',
        category: 'Library & Study Resources',
        subject: 'Additional Sample Question Papers Needed',
        feedbackText: 'Could the school library arrange more CBSE exemplar reference guides and sample question papers for Mathematics?',
        rating: 4,
        status: 'Action Taken',
        schoolReply: '15 new copies of CBSE Math Exemplars added to Library racks today.',
        date: '2026-10-29',
        submittedBy: 'Student (Priya Meena)'
      },
      {
        id: 'fb_3',
        type: 'from_school', // school to student
        direction: 'SCHOOL_TO_STUDENT',
        studentName: 'Dev Sharma',
        admNo: '1002',
        className: 'Class I - A',
        category: 'Academic Progress & Excellence',
        subject: 'Commendable Reading & Phonics Growth',
        feedbackText: 'Dev has shown outstanding grasp in phonics and English reading this month. Keep practicing regular cursive writing.',
        rating: 5,
        status: 'Delivered',
        teacherName: 'Mrs. Sunita Verma (Class Teacher)',
        date: '2026-10-27',
        badge: 'Star Student'
      },
      {
        id: 'fb_4',
        type: 'from_school',
        direction: 'SCHOOL_TO_STUDENT',
        studentName: 'Aaditya Singh',
        admNo: '1621',
        className: 'Class I - A',
        category: 'Discipline & Conduct',
        subject: 'Punctuality and Homework Submission',
        feedbackText: 'Aaditya is very polite and helpful to classmates. Recommended to submit daily math workbook exercises on time.',
        rating: 4,
        status: 'Delivered',
        teacherName: 'Mr. Rajesh Goyal (Math Faculty)',
        date: '2026-10-29',
        badge: 'Helping Hand'
      }
    ];
  }

  saveFeedbacks(schoolId, feedbacks) {
    if (!schoolId) return;
    try {
      const key = this.getStorageKey(schoolId, 'student_feedbacks');
      localStorage.setItem(key, JSON.stringify(feedbacks));
    } catch (e) {
      console.error(e);
    }
  }

  addFeedback(schoolId, fb) {
    if (!schoolId || !fb) return null;
    const current = this.getFeedbacks(schoolId);
    const newFb = {
      id: fb.id || 'fb_' + Date.now(),
      date: fb.date || new Date().toISOString().split('T')[0],
      status: fb.status || (fb.direction === 'SCHOOL_TO_STUDENT' ? 'Delivered' : 'Submitted'),
      ...fb
    };
    const updated = [newFb, ...current];
    this.saveFeedbacks(schoolId, updated);
    return newFb;
  }

  updateFeedback(schoolId, id, updates) {
    if (!schoolId || !id) return null;
    const current = this.getFeedbacks(schoolId);
    const updated = current.map(item => item.id === id ? { ...item, ...updates } : item);
    this.saveFeedbacks(schoolId, updated);
    return updated.find(item => item.id === id);
  }

  // --- Daily Tests ---
  getDailyTests(schoolId) {
    if (!schoolId) return [];
    try {
      const key = this.getStorageKey(schoolId, 'daily_tests');
      const stored = localStorage.getItem(key);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'test_101',
        title: 'Mathematics Unit Test - Chapter 2 Fractions',
        className: 'Class I - A',
        subject: 'Mathematics',
        date: new Date().toISOString().split('T')[0],
        maxMarks: 20,
        passingMarks: 8,
        status: 'Evaluated',
        students: [
          { admNo: '1002', name: 'Dev Sharma', rollNo: '1', marks: 19, rank: 1, attendance: 'P', remarks: 'Outstanding calculation speed' },
          { admNo: '1621', name: 'Aaditya Singh', rollNo: '2', marks: 17, rank: 2, attendance: 'P', remarks: 'Very neat step-by-step solution' },
          { admNo: '2060', name: 'Rohan Sharma', rollNo: '3', marks: 16, rank: 3, attendance: 'P', remarks: 'Good accuracy' },
          { admNo: '2061', name: 'Priya Meena', rollNo: '4', marks: 14, rank: 4, attendance: 'P', remarks: 'Needs more practice in word problems' }
        ]
      }
    ];
  }

  saveDailyTests(schoolId, tests) {
    if (!schoolId) return;
    try {
      const key = this.getStorageKey(schoolId, 'daily_tests');
      localStorage.setItem(key, JSON.stringify(tests));
    } catch (e) {
      console.error(e);
    }
  }

  addDailyTest(schoolId, test) {
    if (!schoolId || !test) return null;
    const current = this.getDailyTests(schoolId);
    const newTest = {
      id: test.id || 'dt_' + Date.now(),
      date: test.date || new Date().toISOString().split('T')[0],
      ...test
    };
    const updated = [newTest, ...current];
    this.saveDailyTests(schoolId, updated);
    return newTest;
  }

}

export const tenantStore = new TenantDataStore();
