import prisma from '../../config/db.js';
import { TENANT_STUDENTS } from '../students/students.controller.js';

// Multi-Tenant Partitioned Fee Accounts: schoolId -> { admNo -> account } (Clean Fresh State)
export const TENANT_FEE_ACCOUNTS = {
  'sch_jd_intl': {},
  'sch_dps_branch2': {}
};

export const TENANT_RECEIPTS = {
  'sch_jd_intl': [],
  'sch_dps_branch2': []
};

export const TENANT_FEE_HEAD_GROUPS = {
  'sch_jd_intl': [],
  'sch_dps_branch2': []
};

export const TENANT_FEE_HEADS = {
  'sch_jd_intl': [],
  'sch_dps_branch2': []
};

export const TENANT_CONCESSION_TYPES = {
  'sch_jd_intl': [],
  'sch_dps_branch2': []
};

export const TENANT_FINE_MASTERS = {
  'sch_jd_intl': [],
  'sch_dps_branch2': []
};

export const TENANT_FEE_STRUCTURES = {
  'sch_jd_intl': [],
  'sch_dps_branch2': []
};

export const TENANT_STUDENT_CONCESSIONS = {
  'sch_jd_intl': [],
  'sch_dps_branch2': []
};

const getActiveSchoolId = (req) => {
  return req.schoolId || req.user?.schoolId || req.headers['x-school-id'] || 'sch_jd_intl';
};

/**
 * 1. Get student fee ledger strictly scoped to active tenant
 */
export const getStudentFeeLedger = async (req, res, next) => {
  try {
    const schoolId = getActiveSchoolId(req);
    const { admNo } = req.params;
    const query = String(admNo || '').trim().toLowerCase();

    const schoolAccounts = TENANT_FEE_ACCOUNTS[schoolId] || {};
    let account = schoolAccounts[admNo];

    // If not found by exact admNo key, search by alternative fields in fee accounts
    if (!account) {
      const foundKey = Object.keys(schoolAccounts).find(k => {
        const acc = schoolAccounts[k];
        const s = acc?.student;
        if (!s) return false;
        return (
          String(s.admNo).toLowerCase() === query ||
          String(s.srNo).toLowerCase() === query ||
          String(s.name).toLowerCase().includes(query) ||
          String(s.mobile).includes(query)
        );
      });
      if (foundKey) {
        account = schoolAccounts[foundKey];
      }
    }

    // If still not found, search in tenant student pool
    if (!account) {
      const studentPool = TENANT_STUDENTS[schoolId] || [];
      const foundStudent = studentPool.find(s => {
        const fullName = `${s.firstName || ''} ${s.lastName || ''}`.trim().toLowerCase();
        return (
          String(s.admNo || '').toLowerCase() === query ||
          String(s.srNo || '').toLowerCase() === query ||
          String(s.enrollNo || '').toLowerCase() === query ||
          String(s.rollNo || '').toLowerCase() === query ||
          fullName.includes(query) ||
          String(s.fatherMobile || s.smsWhatsappNo || '').includes(query)
        );
      });

      if (foundStudent) {
        const sAdmNo = foundStudent.admNo || admNo;
        const sFullName = `${foundStudent.firstName || ''} ${foundStudent.lastName || ''}`.trim() || `Student ${sAdmNo}`;
        const sClass = `${foundStudent.className || 'Class I'} - ${foundStudent.section || 'A'}`;
        
        account = {
          student: {
            admNo: sAdmNo,
            srNo: foundStudent.srNo || sAdmNo,
            enrollNo: foundStudent.enrollNo || `ENR-${sAdmNo}`,
            name: sFullName,
            fatherName: foundStudent.fatherName || 'Guardian',
            motherName: foundStudent.motherName || '',
            className: sClass,
            section: foundStudent.section || 'A',
            feeType: foundStudent.feeType || 'Day Scholar',
            mobile: foundStudent.fatherMobile || foundStudent.smsWhatsappNo || '',
            address: foundStudent.address || '',
            stuType: foundStudent.studentType || 'Old',
            transportStatus: 'Not Opted'
          },
          heads: [
            { id: `h_${schoolId}_1`, feeHead: 'Admission / Reg. Fee', amount: 4000, discount: 0, fine: 0, netPayable: 4000, isPaid: false },
            { id: `h_${schoolId}_2`, feeHead: 'Tuition Fee (Quarter 1)', amount: 10000, discount: 0, fine: 0, netPayable: 1000, isPaid: false },
            { id: `h_${schoolId}_3`, feeHead: 'Tuition Fee (Quarter 2)', amount: 10000, discount: 0, fine: 0, netPayable: 10000, isPaid: false },
            { id: `h_${schoolId}_4`, feeHead: 'Activity & Lab Fee', amount: 2500, discount: 0, fine: 0, netPayable: 2500, isPaid: false }
          ],
          receipts: []
        };

        if (!TENANT_FEE_ACCOUNTS[schoolId]) {
          TENANT_FEE_ACCOUNTS[schoolId] = {};
        }
        TENANT_FEE_ACCOUNTS[schoolId][sAdmNo] = account;
      }
    }

    if (!account) {
      return res.status(200).json({
        success: true,
        schoolId,
        data: {
          student: {
            admNo,
            srNo: admNo,
            name: `Student (${admNo})`,
            fatherName: 'Guardian',
            className: 'Class 1',
            section: 'A',
            feeType: 'Day Scholar',
            mobile: ''
          },
          heads: [
            { id: `h_${schoolId}_1`, feeHead: 'Tuition Fee (Q1)', amount: 9000, discount: 0, fine: 0, netPayable: 9000, isPaid: false },
            { id: `h_${schoolId}_2`, feeHead: 'Tuition Fee (Q2)', amount: 9000, discount: 0, fine: 0, netPayable: 9000, isPaid: false },
            { id: `h_${schoolId}_3`, feeHead: 'Activity Fee', amount: 2000, discount: 0, fine: 0, netPayable: 2000, isPaid: false }
          ],
          receipts: []
        }
      });
    }

    return res.status(200).json({
      success: true,
      schoolId,
      data: account
    });
  } catch (error) {
    console.error('[Get Fee Ledger Error]:', error);
    next(error);
  }
};

/**
 * 2. Process fee collection payment
 */
export const collectFeePayment = async (req, res, next) => {
  try {
    const schoolId = getActiveSchoolId(req);
    const {
      admNo,
      studentName = '',
      className = '',
      paidAmount,
      payMode = 'Cash',
      chequeNo = '',
      bankName = '',
      remarks = '',
      paidHeadIds = []
    } = req.body;

    if (!TENANT_RECEIPTS[schoolId]) {
      TENANT_RECEIPTS[schoolId] = [];
    }

    const schoolPrefix = schoolId === 'sch_dps_branch2' ? 'DPS' : schoolId === 'sch_jd_intl' ? 'JD' : 'REC';
    const count = TENANT_RECEIPTS[schoolId].length + 1;
    const receiptNo = `${schoolPrefix}-REC-${String(count).padStart(3, '0')}`;

    const newReceipt = {
      id: `rec_${Date.now()}`,
      receiptNo,
      admNo,
      studentName,
      className,
      schoolId,
      paidAmount: Number(paidAmount),
      payMode,
      chequeNo,
      bankName,
      remarks,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      status: 'SUCCESS',
      receiptType: 'COUNTER'
    };

    TENANT_RECEIPTS[schoolId].unshift(newReceipt);

    if (!TENANT_FEE_ACCOUNTS[schoolId]) {
      TENANT_FEE_ACCOUNTS[schoolId] = {};
    }

    if (TENANT_FEE_ACCOUNTS[schoolId][admNo]) {
      TENANT_FEE_ACCOUNTS[schoolId][admNo].receipts = TENANT_FEE_ACCOUNTS[schoolId][admNo].receipts || [];
      TENANT_FEE_ACCOUNTS[schoolId][admNo].receipts.unshift(newReceipt);
      if (paidHeadIds.length > 0 && TENANT_FEE_ACCOUNTS[schoolId][admNo].heads) {
        TENANT_FEE_ACCOUNTS[schoolId][admNo].heads = TENANT_FEE_ACCOUNTS[schoolId][admNo].heads.map(h => 
          paidHeadIds.includes(h.id) ? { ...h, isPaid: true } : h
        );
      }
    }

    return res.status(201).json({
      success: true,
      message: `Fee payment of ₹${paidAmount} collected successfully. Receipt No: ${receiptNo}`,
      data: newReceipt
    });
  } catch (error) {
    console.error('[Collect Fee Error]:', error);
    next(error);
  }
};

/**
 * 3. Get recent fee receipts
 */
export const getFeeRecentReceipts = async (req, res, next) => {
  try {
    const schoolId = getActiveSchoolId(req);
    const receipts = TENANT_RECEIPTS[schoolId] || [];

    return res.status(200).json({
      success: true,
      schoolId,
      data: receipts
    });
  } catch (error) {
    console.error('[Get Receipts Error]:', error);
    next(error);
  }
};

/**
 * 4. Fee Head Groups (CRUD)
 */
export const getFeeHeadGroups = async (req, res, next) => {
  try {
    const schoolId = getActiveSchoolId(req);
    const groups = TENANT_FEE_HEAD_GROUPS[schoolId] || [];
    return res.status(200).json({ success: true, data: groups });
  } catch (error) {
    next(error);
  }
};

export const saveFeeHeadGroup = async (req, res, next) => {
  try {
    const schoolId = getActiveSchoolId(req);
    const { id, headGroup, priority, active = true } = req.body;
    if (!TENANT_FEE_HEAD_GROUPS[schoolId]) TENANT_FEE_HEAD_GROUPS[schoolId] = [];

    if (id) {
      TENANT_FEE_HEAD_GROUPS[schoolId] = TENANT_FEE_HEAD_GROUPS[schoolId].map(g =>
        g.id === String(id) ? { ...g, headGroup, priority: Number(priority), active } : g
      );
      return res.status(200).json({ success: true, message: 'Fee Head Group updated successfully' });
    } else {
      const newGroup = {
        id: String(Date.now()),
        headGroup,
        priority: Number(priority) || TENANT_FEE_HEAD_GROUPS[schoolId].length + 1,
        active: true
      };
      TENANT_FEE_HEAD_GROUPS[schoolId].push(newGroup);
      return res.status(201).json({ success: true, message: 'Fee Head Group added successfully', data: newGroup });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteFeeHeadGroup = async (req, res, next) => {
  try {
    const schoolId = getActiveSchoolId(req);
    const { id } = req.params;
    if (TENANT_FEE_HEAD_GROUPS[schoolId]) {
      TENANT_FEE_HEAD_GROUPS[schoolId] = TENANT_FEE_HEAD_GROUPS[schoolId].filter(g => g.id !== String(id));
    }
    return res.status(200).json({ success: true, message: 'Fee Head Group deleted' });
  } catch (error) {
    next(error);
  }
};

/**
 * 5. Fee Heads (CRUD)
 */
export const getFeeHeads = async (req, res, next) => {
  try {
    const schoolId = getActiveSchoolId(req);
    const heads = TENANT_FEE_HEADS[schoolId] || [];
    return res.status(200).json({ success: true, data: heads });
  } catch (error) {
    next(error);
  }
};

export const saveFeeHead = async (req, res, next) => {
  try {
    const schoolId = getActiveSchoolId(req);
    const { id, feeHead, priority, applyFor = 'Both', gender = 'Both', installment = 'Quarterly', feeType = 'dayscholar', isBoard = false } = req.body;
    if (!TENANT_FEE_HEADS[schoolId]) TENANT_FEE_HEADS[schoolId] = [];

    if (id) {
      TENANT_FEE_HEADS[schoolId] = TENANT_FEE_HEADS[schoolId].map(h =>
        h.id === String(id) ? { ...h, feeHead, priority: Number(priority), applyFor, gender, installment, feeType, isBoard } : h
      );
      return res.status(200).json({ success: true, message: 'Fee Head updated successfully' });
    } else {
      const newHead = {
        id: String(Date.now()),
        feeHead,
        priority: Number(priority) || TENANT_FEE_HEADS[schoolId].length + 1,
        applyFor,
        gender,
        installment,
        feeType,
        isBoard
      };
      TENANT_FEE_HEADS[schoolId].push(newHead);
      return res.status(201).json({ success: true, message: 'Fee Head added successfully', data: newHead });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteFeeHead = async (req, res, next) => {
  try {
    const schoolId = getActiveSchoolId(req);
    const { id } = req.params;
    if (TENANT_FEE_HEADS[schoolId]) {
      TENANT_FEE_HEADS[schoolId] = TENANT_FEE_HEADS[schoolId].filter(h => h.id !== String(id));
    }
    return res.status(200).json({ success: true, message: 'Fee Head deleted' });
  } catch (error) {
    next(error);
  }
};

/**
 * 6. Concession Types (CRUD)
 */
export const getConcessionTypes = async (req, res, next) => {
  try {
    const schoolId = getActiveSchoolId(req);
    const types = TENANT_CONCESSION_TYPES[schoolId] || [];
    return res.status(200).json({ success: true, data: types });
  } catch (error) {
    next(error);
  }
};

export const saveConcessionType = async (req, res, next) => {
  try {
    const schoolId = getActiveSchoolId(req);
    const { id, concessionType, description, defaultPercent = 0 } = req.body;
    if (!TENANT_CONCESSION_TYPES[schoolId]) TENANT_CONCESSION_TYPES[schoolId] = [];

    if (id) {
      TENANT_CONCESSION_TYPES[schoolId] = TENANT_CONCESSION_TYPES[schoolId].map(c =>
        c.id === String(id) ? { ...c, concessionType, description, defaultPercent: Number(defaultPercent) } : c
      );
      return res.status(200).json({ success: true, message: 'Concession Category updated' });
    } else {
      const newType = {
        id: String(Date.now()),
        concessionType,
        description,
        defaultPercent: Number(defaultPercent)
      };
      TENANT_CONCESSION_TYPES[schoolId].push(newType);
      return res.status(201).json({ success: true, message: 'Concession Category created', data: newType });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteConcessionType = async (req, res, next) => {
  try {
    const schoolId = getActiveSchoolId(req);
    const { id } = req.params;
    if (TENANT_CONCESSION_TYPES[schoolId]) {
      TENANT_CONCESSION_TYPES[schoolId] = TENANT_CONCESSION_TYPES[schoolId].filter(c => c.id !== String(id));
    }
    return res.status(200).json({ success: true, message: 'Concession Category deleted' });
  } catch (error) {
    next(error);
  }
};

/**
 * 7. Fine Master (CRUD)
 */
export const getFineMasters = async (req, res, next) => {
  try {
    const schoolId = getActiveSchoolId(req);
    const fines = TENANT_FINE_MASTERS[schoolId] || [];
    return res.status(200).json({ success: true, data: fines });
  } catch (error) {
    next(error);
  }
};

export const saveFineMaster = async (req, res, next) => {
  try {
    const schoolId = getActiveSchoolId(req);
    const { id, fineName, fineType = 'Per Day', increasePeriod = 'Daily', graceDays = 10, amount = 20 } = req.body;
    if (!TENANT_FINE_MASTERS[schoolId]) TENANT_FINE_MASTERS[schoolId] = [];

    const now = new Date().toISOString().split('T')[0];
    if (id) {
      TENANT_FINE_MASTERS[schoolId] = TENANT_FINE_MASTERS[schoolId].map(f =>
        f.id === String(id) ? { ...f, fineName, fineType, increasePeriod, graceDays: Number(graceDays), amount: Number(amount), updatedAt: now } : f
      );
      return res.status(200).json({ success: true, message: 'Fine rule updated' });
    } else {
      const newFine = {
        id: String(Date.now()),
        fineName,
        fineType,
        increasePeriod,
        graceDays: Number(graceDays),
        amount: Number(amount),
        createdAt: now,
        updatedAt: now,
        user: 'Admin'
      };
      TENANT_FINE_MASTERS[schoolId].push(newFine);
      return res.status(201).json({ success: true, message: 'Fine rule created', data: newFine });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteFineMaster = async (req, res, next) => {
  try {
    const schoolId = getActiveSchoolId(req);
    const { id } = req.params;
    if (TENANT_FINE_MASTERS[schoolId]) {
      TENANT_FINE_MASTERS[schoolId] = TENANT_FINE_MASTERS[schoolId].filter(f => f.id !== String(id));
    }
    return res.status(200).json({ success: true, message: 'Fine rule removed' });
  } catch (error) {
    next(error);
  }
};

/**
 * 8. Fee Structures (CRUD)
 */
export const getFeeStructures = async (req, res, next) => {
  try {
    const schoolId = getActiveSchoolId(req);
    const structures = TENANT_FEE_STRUCTURES[schoolId] || [];
    return res.status(200).json({ success: true, data: structures });
  } catch (error) {
    next(error);
  }
};

export const saveFeeStructure = async (req, res, next) => {
  try {
    const schoolId = getActiveSchoolId(req);
    const { id, className, stream = 'None', structureType = 'Quarterly', grandTotal = 0, heads = [] } = req.body;
    if (!TENANT_FEE_STRUCTURES[schoolId]) TENANT_FEE_STRUCTURES[schoolId] = [];

    if (id) {
      TENANT_FEE_STRUCTURES[schoolId] = TENANT_FEE_STRUCTURES[schoolId].map(s =>
        s.id === String(id) ? { ...s, className, stream, structureType, grandTotal: Number(grandTotal), heads } : s
      );
      return res.status(200).json({ success: true, message: 'Fee structure updated' });
    } else {
      const newStructure = {
        id: String(Date.now()),
        className,
        stream,
        structureType,
        grandTotal: Number(grandTotal),
        heads
      };
      TENANT_FEE_STRUCTURES[schoolId].push(newStructure);
      return res.status(201).json({ success: true, message: 'Fee structure created', data: newStructure });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteFeeStructure = async (req, res, next) => {
  try {
    const schoolId = getActiveSchoolId(req);
    const { id } = req.params;
    if (TENANT_FEE_STRUCTURES[schoolId]) {
      TENANT_FEE_STRUCTURES[schoolId] = TENANT_FEE_STRUCTURES[schoolId].filter(s => s.id !== String(id));
    }
    return res.status(200).json({ success: true, message: 'Fee structure deleted' });
  } catch (error) {
    next(error);
  }
};

/**
 * 9. Fee Manual Edits (Student Ledger override)
 */
export const getFeeManualStudents = async (req, res, next) => {
  try {
    const schoolId = getActiveSchoolId(req);
    const accounts = TENANT_FEE_ACCOUNTS[schoolId] || {};
    let studentsList = Object.values(accounts).map((acc, idx) => ({
      sNo: idx + 1,
      admNo: acc.student.admNo,
      srNo: acc.student.srNo,
      name: acc.student.name,
      className: acc.student.className + (acc.student.section ? `-${acc.student.section}` : ''),
      fatherName: acc.student.fatherName,
      type: '0',
      heads: acc.heads,
      receipts: acc.receipts
    }));

    if (studentsList.length === 0) {
      const pool = TENANT_STUDENTS[schoolId] || [];
      studentsList = pool.map((s, idx) => ({
        sNo: idx + 1,
        admNo: s.admNo,
        srNo: s.srNo || s.admNo,
        name: (s.name || `${s.firstName || ''} ${s.lastName || ''}`).trim() || `Student ${s.admNo}`,
        className: `${s.className || 'I'}-${s.section || 'A'}`,
        fatherName: s.fatherName || s.fathers_name || '-',
        type: s.studentType || '0',
        heads: [
          { id: `h_${s.admNo}_1`, feeHead: 'Admission Fee', amount: 5000, discount: 0, fine: 0, netPayable: 5000, isPaid: false },
          { id: `h_${s.admNo}_2`, feeHead: 'Tuition Fee (Q1)', amount: 12000, discount: 0, fine: 0, netPayable: 12000, isPaid: false },
          { id: `h_${s.admNo}_3`, feeHead: 'Tuition Fee (Q2)', amount: 12000, discount: 0, fine: 0, netPayable: 12000, isPaid: false },
          { id: `h_${s.admNo}_4`, feeHead: 'Activity & Sports Fee', amount: 2000, discount: 0, fine: 0, netPayable: 2000, isPaid: false }
        ],
        receipts: []
      }));
    }

    return res.status(200).json({ success: true, data: studentsList });
  } catch (error) {
    next(error);
  }
};

export const saveFeeManualEdit = async (req, res, next) => {
  try {
    const schoolId = getActiveSchoolId(req);
    const { admNo, heads = [], remarks = '' } = req.body;
    if (!TENANT_FEE_ACCOUNTS[schoolId]) {
      TENANT_FEE_ACCOUNTS[schoolId] = {};
    }
    if (!TENANT_FEE_ACCOUNTS[schoolId][admNo]) {
      const studentPool = TENANT_STUDENTS[schoolId] || [];
      const s = studentPool.find(st => st.admNo === admNo) || {};
      TENANT_FEE_ACCOUNTS[schoolId][admNo] = {
        student: {
          admNo,
          srNo: s.srNo || admNo,
          name: (s.name || `${s.firstName || ''} ${s.lastName || ''}`).trim() || `Student ${admNo}`,
          className: `${s.className || 'I'}-${s.section || 'A'}`,
          fatherName: s.fatherName || '-'
        },
        heads: [],
        receipts: []
      };
    }
    TENANT_FEE_ACCOUNTS[schoolId][admNo].heads = heads;
    TENANT_FEE_ACCOUNTS[schoolId][admNo].manualRemark = remarks;
    return res.status(200).json({ success: true, message: `Fee updated manually for Student ${admNo}` });
  } catch (error) {
    next(error);
  }
};

/**
 * 10. Fee Concession Assignments
 */
export const getStudentConcessions = async (req, res, next) => {
  try {
    const schoolId = getActiveSchoolId(req);
    const concessions = TENANT_STUDENT_CONCESSIONS[schoolId] || [];
    return res.status(200).json({ success: true, data: concessions });
  } catch (error) {
    next(error);
  }
};

export const saveStudentConcession = async (req, res, next) => {
  try {
    const schoolId = getActiveSchoolId(req);
    const { admNo, srNo, studentName, className, fatherName, concessionType, concessionBy = 'Principal', amount = 0, percentage = 0 } = req.body;
    if (!TENANT_STUDENT_CONCESSIONS[schoolId]) TENANT_STUDENT_CONCESSIONS[schoolId] = [];

    const newConcession = {
      id: String(Date.now()),
      admNo,
      srNo: srNo || admNo,
      studentName,
      className,
      fatherName,
      concessionType,
      concessionBy,
      amount: Number(amount),
      percentage: Number(percentage),
      status: 'APPROVED'
    };

    TENANT_STUDENT_CONCESSIONS[schoolId].unshift(newConcession);
    return res.status(201).json({ success: true, message: 'Concession assigned to student successfully', data: newConcession });
  } catch (error) {
    next(error);
  }
};

export const deleteStudentConcession = async (req, res, next) => {
  try {
    const schoolId = getActiveSchoolId(req);
    const { id } = req.params;
    if (TENANT_STUDENT_CONCESSIONS[schoolId]) {
      TENANT_STUDENT_CONCESSIONS[schoolId] = TENANT_STUDENT_CONCESSIONS[schoolId].filter(c => c.id !== String(id));
    }
    return res.status(200).json({ success: true, message: 'Concession record removed' });
  } catch (error) {
    next(error);
  }
};

/**
 * 11. Sibling Fee Lookup & Joint Collection
 */
export const lookupSiblings = async (req, res, next) => {
  try {
    const schoolId = getActiveSchoolId(req);
    const { mobile = '', fatherName = '' } = req.query;
    const pool = TENANT_STUDENTS[schoolId] || [];
    const qMobile = String(mobile).trim();
    const qFather = String(fatherName).trim().toLowerCase();

    const matched = pool.filter(s => {
      const sMob = String(s.fatherMobile || s.contactNo || s.smsWhatsappNo || '');
      const sFat = String(s.fatherName || s.fathers_name || '').toLowerCase();
      if (qMobile && sMob.includes(qMobile)) return true;
      if (qFather && sFat.includes(qFather)) return true;
      return false;
    }).map(s => ({
      admNo: s.admNo,
      srNo: s.srNo || s.admNo,
      name: (s.name || `${s.firstName || ''} ${s.lastName || ''}`).trim() || `Student ${s.admNo}`,
      fatherName: s.fatherName || s.fathers_name || '-',
      className: `${s.className || 'I'}-${s.section || 'A'}`,
      mobile: s.fatherMobile || s.contactNo || '-',
      dueAmount: Number(s.totalFees || 10000),
      heads: [
        { id: `h_${s.admNo}_1`, feeHead: 'Tuition Fee (Q1)', amount: 10000, discount: 0, netPayable: 10000, isPaid: false }
      ]
    }));

    return res.status(200).json({ success: true, data: matched });
  } catch (error) {
    next(error);
  }
};

export const collectSiblingFee = async (req, res, next) => {
  try {
    const schoolId = getActiveSchoolId(req);
    const { payments = [], payMode = 'Cash', remarks = '' } = req.body;
    const schoolPrefix = schoolId === 'sch_dps_branch2' ? 'DPS' : 'JD';
    const count = (TENANT_RECEIPTS[schoolId]?.length || 0) + 1;
    const receiptNo = `${schoolPrefix}-SIB-${String(count).padStart(3, '0')}`;

    let totalPaid = 0;
    for (const p of payments) {
      totalPaid += Number(p.amount || 0);
      if (TENANT_FEE_ACCOUNTS[schoolId]?.[p.admNo]) {
        // Mark matching heads as paid
        TENANT_FEE_ACCOUNTS[schoolId][p.admNo].heads = TENANT_FEE_ACCOUNTS[schoolId][p.admNo].heads.map(h => {
          if (p.paidHeadIds?.includes(h.id)) return { ...h, isPaid: true };
          return h;
        });
      }
    }

    const newReceipt = {
      id: `rec_${Date.now()}`,
      receiptNo,
      admNo: payments.map(p => p.admNo).join(', '),
      studentName: `Sibling Joint (${payments.length} Students)`,
      className: 'Multiple',
      paidAmount: totalPaid,
      payMode,
      remarks,
      date: new Date().toISOString().split('T')[0],
      status: 'SUCCESS',
      receiptType: 'SIBLING_JOINT'
    };

    const student = (TENANT_STUDENTS[schoolId] || []).find(st => st.admNo === admNo);
    if (student) {
      student.boardFeePaid = true;
      newReceipt.studentName = (student.name || `${student.firstName || ''} ${student.lastName || ''}`).trim() || `Student ${admNo}`;
      newReceipt.className = `${student.className || 'X'}-${student.section || 'A'}`;
    }

    if (!TENANT_RECEIPTS[schoolId]) TENANT_RECEIPTS[schoolId] = [];
    TENANT_RECEIPTS[schoolId].unshift(newReceipt);

    return res.status(201).json({
      success: true,
      message: `Sibling joint fee payment of ₹${totalPaid} recorded. Receipt No: ${receiptNo}`,
      data: newReceipt
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 12. Cancel Fee Receipt
 */
export const cancelFeeReceipt = async (req, res, next) => {
  try {
    const schoolId = getActiveSchoolId(req);
    const { receiptNo, reason = '' } = req.body;

    if (TENANT_RECEIPTS[schoolId]) {
      const idx = TENANT_RECEIPTS[schoolId].findIndex(r => r.receiptNo === receiptNo);
      if (idx !== -1) {
        const cancelledRec = TENANT_RECEIPTS[schoolId][idx];
        cancelledRec.status = 'CANCELLED';
        cancelledRec.cancelReason = reason;
        cancelledRec.cancelledAt = new Date().toISOString();

        // Revert student dues in backend student pool
        const student = (TENANT_STUDENTS[schoolId] || []).find(st => st.admNo === cancelledRec.admNo);
        if (student) {
          student.paidFees = Math.max(0, (Number(student.paidFees) || 0) - Number(cancelledRec.paidAmount || 0));
          student.dueFees = Math.max(0, (Number(student.totalFees) || 0) - student.paidFees);
        }
        return res.status(200).json({ success: true, message: `Receipt ${receiptNo} marked as CANCELLED.` });
      }
    }
    return res.status(404).json({ success: false, message: 'Receipt not found' });
  } catch (error) {
    next(error);
  }
};

/**
 * 13. Board Fee Manual Entry
 */
export const getBoardFeeStudents = async (req, res, next) => {
  try {
    const schoolId = getActiveSchoolId(req);
    const pool = TENANT_STUDENTS[schoolId] || [];
    const boardStudents = pool
      .filter(s => {
        const cls = String(s.className || '').toUpperCase();
        return cls.includes('X') || cls.includes('10') || cls.includes('XII') || cls.includes('12');
      })
      .map(s => ({
        admNo: s.admNo,
        srNo: s.srNo || s.admNo,
        name: (s.name || `${s.firstName || ''} ${s.lastName || ''}`).trim() || `Student ${s.admNo}`,
        className: `${s.className || 'X'}-${s.section || 'A'}`,
        boardFee: 3500,
        paid: Boolean(s.boardFeePaid)
      }));

    return res.status(200).json({ success: true, data: boardStudents });
  } catch (error) {
    next(error);
  }
};

export const collectBoardFee = async (req, res, next) => {
  try {
    const schoolId = getActiveSchoolId(req);
    const { admNo, paidAmount = 3500, payMode = 'Cash', remarks = 'CBSE Board Examination Fee' } = req.body;
    const schoolPrefix = schoolId === 'sch_dps_branch2' ? 'DPS' : 'JD';
    const count = (TENANT_RECEIPTS[schoolId]?.length || 0) + 1;
    const receiptNo = `${schoolPrefix}-BRD-${String(count).padStart(3, '0')}`;

    const newReceipt = {
      id: `rec_${Date.now()}`,
      receiptNo,
      admNo,
      schoolId,
      paidAmount: Number(paidAmount),
      payMode,
      remarks,
      date: new Date().toISOString().split('T')[0],
      status: 'SUCCESS',
      receiptType: 'BOARD_MANUAL'
    };

    if (!TENANT_RECEIPTS[schoolId]) TENANT_RECEIPTS[schoolId] = [];
    TENANT_RECEIPTS[schoolId].unshift(newReceipt);

    if (TENANT_FEE_ACCOUNTS[schoolId]?.[admNo]) {
      const acc = TENANT_FEE_ACCOUNTS[schoolId][admNo];
      let foundBoard = false;
      acc.heads = acc.heads.map(h => {
        if (h.feeHead.toLowerCase().includes('board')) {
          foundBoard = true;
          return { ...h, isPaid: true };
        }
        return h;
      });
      if (!foundBoard) {
        acc.heads.push({
          id: `h_brd_${Date.now()}`,
          feeHead: 'Board Exam Fee',
          amount: Number(paidAmount),
          discount: 0,
          fine: 0,
          netPayable: Number(paidAmount),
          isPaid: true
        });
      }
    }

    return res.status(201).json({ success: true, message: `Board Fee collected successfully. Receipt: ${receiptNo}`, data: newReceipt });
  } catch (error) {
    next(error);
  }
};

/**
 * 14. Fee Reports Data Aggregator
 */
export const getFeeReportsData = async (req, res, next) => {
  try {
    const schoolId = getActiveSchoolId(req);
    const { reportType = 'collection-summary', startDate, endDate, className } = req.query;

    const receipts = TENANT_RECEIPTS[schoolId] || [];
    const accounts = TENANT_FEE_ACCOUNTS[schoolId] || {};

    let totalCollected = receipts.filter(r => r.status !== 'CANCELLED').reduce((s, r) => s + r.paidAmount, 0);
    let totalDues = 0;
    let defaulters = [];

    Object.values(accounts).forEach(acc => {
      const studentDues = acc.heads.filter(h => !h.isPaid).reduce((s, h) => s + (h.netPayable || h.amount), 0);
      totalDues += studentDues;
      if (studentDues > 0) {
        defaulters.push({
          admNo: acc.student.admNo,
          srNo: acc.student.srNo,
          name: acc.student.name,
          className: acc.student.className,
          fatherName: acc.student.fatherName,
          mobile: acc.student.mobile,
          dueAmount: studentDues,
          heads: acc.heads.filter(h => !h.isPaid)
        });
      }
    });

    return res.status(200).json({
      success: true,
      reportType,
      summary: {
        totalCollected,
        totalDues,
        receiptsCount: receipts.length,
        defaultersCount: defaulters.length
      },
      receipts,
      defaulters,
      structures: TENANT_FEE_STRUCTURES[schoolId] || [],
      concessions: TENANT_STUDENT_CONCESSIONS[schoolId] || []
    });
  } catch (error) {
    next(error);
  }
};
