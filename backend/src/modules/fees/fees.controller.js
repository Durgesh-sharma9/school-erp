import prisma from '../../config/db.js';

// Multi-Tenant Partitioned Fee Accounts: schoolId -> { admNo -> account }
export const TENANT_FEE_ACCOUNTS = {
  // School A: J D International School
  'sch_jd_intl': {
    '1621': {
      student: {
        admNo: '1621',
        srNo: '1621',
        name: 'AADITYA SINGH CHOUDHARY',
        fatherName: 'NARENDRA SINGH CHOUDHARY',
        className: 'Class I',
        section: 'A',
        feeType: 'Day Scholar',
        mobile: '9829012345'
      },
      heads: [
        { id: 'h_jd_1', feeHead: 'Admission Fee', amount: 5000, discount: 0, fine: 0, netPayable: 5000, isPaid: true },
        { id: 'h_jd_2', feeHead: 'Tuition Fee (Q1)', amount: 12000, discount: 0, fine: 0, netPayable: 12000, isPaid: true },
        { id: 'h_jd_3', feeHead: 'Tuition Fee (Q2)', amount: 12000, discount: 0, fine: 0, netPayable: 12000, isPaid: false },
        { id: 'h_jd_4', feeHead: 'Activity & Sports Fee', amount: 2000, discount: 500, fine: 0, netPayable: 1500, isPaid: false }
      ],
      receipts: [
        { receiptNo: 'JD-REC-001', paidAmount: 17000, payMode: 'UPI', date: '2026-04-10' }
      ]
    },
    '2059': {
      student: {
        admNo: '2059',
        srNo: '2059',
        name: 'AADHYA CHOUDHARY',
        fatherName: 'RAMESH CHOUDHARY',
        className: 'Nursery - PP3+',
        section: 'A',
        feeType: 'Day Scholar',
        mobile: '6377281034'
      },
      heads: [
        { id: 'h_jd_10', feeHead: 'Admission Fee', amount: 4000, discount: 0, fine: 0, netPayable: 4000, isPaid: true },
        { id: 'h_jd_11', feeHead: 'Tuition Fee (Term 1)', amount: 9500, discount: 0, fine: 0, netPayable: 9500, isPaid: true },
        { id: 'h_jd_12', feeHead: 'Tuition Fee (Term 2)', amount: 9500, discount: 0, fine: 0, netPayable: 9500, isPaid: false }
      ],
      receipts: [
        { receiptNo: 'JD-REC-002', paidAmount: 13500, payMode: 'Cash', date: '2026-04-12' }
      ]
    },
    '2060': {
      student: {
        admNo: '2060',
        srNo: '2060',
        name: 'ROHAN SHARMA',
        fatherName: 'MUKESH SHARMA',
        className: 'X',
        section: 'A',
        feeType: 'Day Scholar',
        mobile: '9829012345'
      },
      heads: [
        { id: 'h_jd_20', feeHead: 'Tuition Fee (Q1)', amount: 15000, discount: 0, fine: 0, netPayable: 15000, isPaid: true },
        { id: 'h_jd_21', feeHead: 'Tuition Fee (Q2)', amount: 15000, discount: 0, fine: 0, netPayable: 15000, isPaid: false },
        { id: 'h_jd_22', feeHead: 'Board Exam Fee', amount: 3500, discount: 0, fine: 0, netPayable: 3500, isPaid: false }
      ],
      receipts: [
        { receiptNo: 'JD-REC-003', paidAmount: 15000, payMode: 'Bank Transfer', date: '2026-05-02' }
      ]
    }
  },

  // School B: Delhi Public Academy
  'sch_dps_branch2': {
    'DPS-101': {
      student: {
        admNo: 'DPS-101',
        srNo: '501',
        name: 'ROHAN SHARMA',
        fatherName: 'SUNIL SHARMA',
        className: 'Class 10',
        section: 'A',
        feeType: 'Day Scholar',
        mobile: '9810033445'
      },
      heads: [
        { id: 'h_dps_1', feeHead: 'Board Registration Fee', amount: 3500, discount: 0, fine: 0, netPayable: 3500, isPaid: true },
        { id: 'h_dps_2', feeHead: 'Tuition Fee (Quarter 1)', amount: 14500, discount: 0, fine: 0, netPayable: 14500, isPaid: false }
      ],
      receipts: [
        { receiptNo: 'DPS-REC-101', paidAmount: 3500, payMode: 'Bank Transfer', date: '2026-04-15' }
      ]
    }
  }
};

// Multi-Tenant Partitioned Receipts Store
export const TENANT_RECEIPTS = {
  'sch_jd_intl': [
    {
      id: 'rec_1',
      receiptNo: 'JD-REC-001',
      admNo: '1621',
      studentName: 'AADITYA SINGH CHOUDHARY',
      className: 'Class I-A',
      fatherName: 'NARENDRA SINGH CHOUDHARY',
      paidAmount: 17000,
      payMode: 'UPI',
      date: '2026-04-10',
      status: 'SUCCESS',
      remarks: 'Quarter 1 Tuition & Admission Fee',
      receiptType: 'COUNTER'
    },
    {
      id: 'rec_2',
      receiptNo: 'JD-REC-002',
      admNo: '2059',
      studentName: 'AADHYA CHOUDHARY',
      className: 'Nursery - PP3+-A',
      fatherName: 'RAMESH CHOUDHARY',
      paidAmount: 13500,
      payMode: 'Cash',
      date: '2026-04-12',
      status: 'SUCCESS',
      remarks: 'Admission & Term 1 Tuition',
      receiptType: 'COUNTER'
    },
    {
      id: 'rec_3',
      receiptNo: 'JD-REC-003',
      admNo: '2060',
      studentName: 'ROHAN SHARMA',
      className: 'X-A',
      fatherName: 'MUKESH SHARMA',
      paidAmount: 15000,
      payMode: 'Bank Transfer',
      date: '2026-05-02',
      status: 'SUCCESS',
      remarks: 'Quarter 1 Tuition Fee',
      receiptType: 'COUNTER'
    }
  ],
  'sch_dps_branch2': [
    {
      id: 'rec_101',
      receiptNo: 'DPS-REC-101',
      admNo: 'DPS-101',
      studentName: 'ROHAN SHARMA',
      className: 'Class 10-A',
      fatherName: 'SUNIL SHARMA',
      paidAmount: 3500,
      payMode: 'Bank Transfer',
      date: '2026-04-15',
      status: 'SUCCESS',
      remarks: 'Board Registration Fee',
      receiptType: 'ONLINE'
    }
  ]
};

// 1. Fee Head Groups (Exact UAB)
export const TENANT_FEE_HEAD_GROUPS = {
  'sch_jd_intl': [
    { id: '1', headGroup: 'OFTHO', priority: 1, active: true },
    { id: '2', headGroup: 'Admission Fee', priority: 2, active: true },
    { id: '3', headGroup: 'Tution Fee', priority: 3, active: true },
    { id: '4', headGroup: 'Activity Fee', priority: 4, active: true },
    { id: '5', headGroup: 'Digital Learning Fee', priority: 5, active: true },
    { id: '6', headGroup: 'Admission Form', priority: 6, active: true },
    { id: '7', headGroup: 'Registration Fee', priority: 7, active: true },
    { id: '8', headGroup: 'Examination Fee', priority: 8, active: true },
    { id: '9', headGroup: 'School Application Fee', priority: 10, active: true }
  ],
  'sch_dps_branch2': [
    { id: '1', headGroup: 'Admission Group', priority: 1, active: true },
    { id: '2', headGroup: 'Academic Tuition', priority: 2, active: true },
    { id: '3', headGroup: 'Examination & Board', priority: 3, active: true }
  ]
};

// 2. Fee Heads (Exact UAB)
export const TENANT_FEE_HEADS = {
  'sch_jd_intl': [
    { id: '1', feeHead: 'Opening Balance', priority: 1, applyFor: 'Old', gender: 'Both', installment: 'Annually', feeType: 'dayscholar', isBoard: false },
    { id: '2', feeHead: 'Fine', priority: 2, applyFor: 'Both', gender: 'Both', installment: 'Monthly', feeType: 'dayscholar', isBoard: false },
    { id: '3', feeHead: 'Transport', priority: 3, applyFor: 'Both', gender: 'Both', installment: 'Monthly', feeType: 'dayscholar', isBoard: false },
    { id: '4', feeHead: 'Hostel', priority: 4, applyFor: 'Both', gender: 'Both', installment: 'Monthly', feeType: 'dayscholar', isBoard: false },
    { id: '5', feeHead: 'Other', priority: 5, applyFor: 'Both', gender: 'Both', installment: 'Monthly', feeType: 'dayscholar', isBoard: false },
    { id: '6', feeHead: 'Extra Concession', priority: 6, applyFor: 'Old', gender: 'Both', installment: 'Annually', feeType: 'dayscholar', isBoard: false },
    { id: '7', feeHead: 'Admission Fee', priority: 7, applyFor: 'New', gender: 'Both', installment: 'Only Once', feeType: 'dayscholar', isBoard: false },
    { id: '8', feeHead: 'Tuition Fee', priority: 8, applyFor: 'Both', gender: 'Both', installment: 'Quarterly', feeType: 'dayscholar', isBoard: false },
    { id: '9', feeHead: 'Activity Fee', priority: 9, applyFor: 'Both', gender: 'Both', installment: 'Annually', feeType: 'dayscholar', isBoard: false },
    { id: '10', feeHead: 'Digital Learning fee', priority: 10, applyFor: 'Both', gender: 'Both', installment: 'Annually', feeType: 'dayscholar', isBoard: false },
    { id: '11', feeHead: 'Registration fee', priority: 11, applyFor: 'New', gender: 'Both', installment: 'Only Once', feeType: 'dayscholar', isBoard: false },
    { id: '12', feeHead: 'Examination Fee', priority: 12, applyFor: 'Both', gender: 'Both', installment: 'Annually', feeType: 'dayscholar', isBoard: false },
    { id: '13', feeHead: 'School Application Fee', priority: 13, applyFor: 'Both', gender: 'Both', installment: 'Annually', feeType: 'dayscholar', isBoard: false }
  ],
  'sch_dps_branch2': [
    { id: '1', feeHead: 'Registration Fee', priority: 1, applyFor: 'New', gender: 'Both', installment: 'Only Once', feeType: 'dayscholar', isBoard: false },
    { id: '2', feeHead: 'Tuition Fee', priority: 2, applyFor: 'Both', gender: 'Both', installment: 'Quarterly', feeType: 'dayscholar', isBoard: false },
    { id: '3', feeHead: 'Board Registration Fee', priority: 3, applyFor: 'Both', gender: 'Both', installment: 'Annually', feeType: 'dayscholar', isBoard: true }
  ]
};

// 3. Concession Types (Exact UAB)
export const TENANT_CONCESSION_TYPES = {
  'sch_jd_intl': [
    { id: '1', concessionType: 'Handicap', description: 'Special disability concession policy', defaultPercent: 50 },
    { id: '2', concessionType: 'Poor Student', description: 'EWS scholarship support scheme', defaultPercent: 100 },
    { id: '3', concessionType: 'Staff', description: 'Staff children institutional discount', defaultPercent: 50 },
    { id: '4', concessionType: 'Principal', description: 'Discretionary scholarship approved by Principal', defaultPercent: 25 },
    { id: '5', concessionType: 'Management', description: 'Trustee / Management quota concession', defaultPercent: 50 },
    { id: '6', concessionType: 'Other', description: 'General athletic and merits concessions', defaultPercent: 20 },
    { id: '7', concessionType: '3rd Child', description: 'Family third sibling concession', defaultPercent: 30 }
  ],
  'sch_dps_branch2': [
    { id: '1', concessionType: 'Sibling Concession', description: 'Sibling waiver', defaultPercent: 25 },
    { id: '2', concessionType: 'Staff Ward', description: 'Staff child policy', defaultPercent: 50 }
  ]
};

// 4. Fine Master
export const TENANT_FINE_MASTERS = {
  'sch_jd_intl': [
    { id: '1', fineName: 'Late Fee Penalty', fineType: 'Per Day', increasePeriod: 'Daily', graceDays: 10, amount: 20, createdAt: '2026-04-01', updatedAt: '2026-04-01', user: 'Admin' },
    { id: '2', fineName: 'Quarterly Due Flat Fine', fineType: 'Fixed', increasePeriod: 'Monthly', graceDays: 15, amount: 200, createdAt: '2026-04-01', updatedAt: '2026-04-01', user: 'Admin' }
  ],
  'sch_dps_branch2': [
    { id: '1', fineName: 'Late Fee Standard', fineType: 'Per Day', increasePeriod: 'Daily', graceDays: 7, amount: 25, createdAt: '2026-04-01', updatedAt: '2026-04-01', user: 'Admin' }
  ]
};

// 5. Fee Structures
export const TENANT_FEE_STRUCTURES = {
  'sch_jd_intl': [
    { id: '1', className: 'Nursery - PP3+', stream: 'None', structureType: 'Quarterly', grandTotal: 38000, heads: [{ feeHead: 'Tuition Fee', amount: 32000 }, { feeHead: 'Activity Fee', amount: 3000 }, { feeHead: 'Examination Fee', amount: 3000 }] },
    { id: '2', className: 'Lower Kindergarten - PP4+', stream: 'None', structureType: 'Quarterly', grandTotal: 40000, heads: [{ feeHead: 'Tuition Fee', amount: 34000 }, { feeHead: 'Activity Fee', amount: 3000 }, { feeHead: 'Examination Fee', amount: 3000 }] },
    { id: '3', className: 'Upper Kindergarten - PP5+', stream: 'None', structureType: 'Quarterly', grandTotal: 42000, heads: [{ feeHead: 'Tuition Fee', amount: 36000 }, { feeHead: 'Activity Fee', amount: 3000 }, { feeHead: 'Examination Fee', amount: 3000 }] },
    { id: '4', className: 'I', stream: 'None', structureType: 'Quarterly', grandTotal: 46000, heads: [{ feeHead: 'Tuition Fee', amount: 39000 }, { feeHead: 'Activity Fee', amount: 3500 }, { feeHead: 'Digital Learning fee', amount: 3500 }] },
    { id: '5', className: 'II', stream: 'None', structureType: 'Quarterly', grandTotal: 46000, heads: [{ feeHead: 'Tuition Fee', amount: 39000 }, { feeHead: 'Activity Fee', amount: 3500 }, { feeHead: 'Digital Learning fee', amount: 3500 }] },
    { id: '6', className: 'X', stream: 'None', structureType: 'Quarterly', grandTotal: 62000, heads: [{ feeHead: 'Tuition Fee', amount: 52000 }, { feeHead: 'Examination Fee', amount: 5000 }, { feeHead: 'Digital Learning fee', amount: 5000 }] },
    { id: '7', className: 'XI- HUMANITIES', stream: 'HUMANITIES', structureType: 'Quarterly', grandTotal: 68000, heads: [{ feeHead: 'Tuition Fee', amount: 58000 }, { feeHead: 'Examination Fee', amount: 5000 }, { feeHead: 'Digital Learning fee', amount: 5000 }] },
    { id: '8', className: 'XII-HUMANITIES', stream: 'SCIENCE', structureType: 'Quarterly', grandTotal: 72000, heads: [{ feeHead: 'Tuition Fee', amount: 60000 }, { feeHead: 'Examination Fee', amount: 6000 }, { feeHead: 'Digital Learning fee', amount: 6000 }] }
  ],
  'sch_dps_branch2': [
    { id: '1', className: 'Class 10', stream: 'None', structureType: 'Quarterly', grandTotal: 58000, heads: [{ feeHead: 'Tuition Fee', amount: 50000 }, { feeHead: 'Board Registration Fee', amount: 8000 }] }
  ]
};

// 6. Fee Concession Assignments
export const TENANT_STUDENT_CONCESSIONS = {
  'sch_jd_intl': [
    { id: '1', admNo: '2049', srNo: '2049', studentName: 'BHAVYA', className: 'III-A', fatherName: 'NAVEEN YADAV', concessionType: 'Staff', concessionBy: 'Principal', amount: 5000, percentage: 50, status: 'APPROVED' },
    { id: '2', admNo: '2050', srNo: '2050', studentName: 'PRIYANSHU JOYA', className: 'V-A', fatherName: 'NARPAT LAL JOYA', concessionType: 'Poor Student', concessionBy: 'Management', amount: 8000, percentage: 100, status: 'APPROVED' }
  ],
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

    const schoolAccounts = TENANT_FEE_ACCOUNTS[schoolId] || {};
    const account = schoolAccounts[admNo];

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
            { id: `h_${schoolId}_1`, feeHead: 'Admission Fee', amount: 3000, discount: 0, fine: 0, netPayable: 3000, isPaid: false },
            { id: `h_${schoolId}_2`, feeHead: 'Tuition Fee', amount: 8000, discount: 0, fine: 0, netPayable: 8000, isPaid: false }
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

    const schoolPrefix = schoolId === 'sch_dps_branch2' ? 'DPS' : 'JD';
    const count = TENANT_RECEIPTS[schoolId].length + 1;
    const receiptNo = `${schoolPrefix}-REC-${String(count).padStart(3, '0')}`;

    const newReceipt = {
      id: `rec_${Date.now()}`,
      receiptNo,
      admNo,
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
      TENANT_FEE_ACCOUNTS[schoolId][admNo].receipts.unshift(newReceipt);
      if (paidHeadIds.length > 0) {
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
    const studentsList = Object.values(accounts).map((acc, idx) => ({
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
    return res.status(200).json({ success: true, data: studentsList });
  } catch (error) {
    next(error);
  }
};

export const saveFeeManualEdit = async (req, res, next) => {
  try {
    const schoolId = getActiveSchoolId(req);
    const { admNo, heads = [], remarks = '' } = req.body;
    if (TENANT_FEE_ACCOUNTS[schoolId] && TENANT_FEE_ACCOUNTS[schoolId][admNo]) {
      TENANT_FEE_ACCOUNTS[schoolId][admNo].heads = heads;
      TENANT_FEE_ACCOUNTS[schoolId][admNo].manualRemark = remarks;
      return res.status(200).json({ success: true, message: `Fee updated manually for Student ${admNo}` });
    }
    return res.status(404).json({ success: false, message: 'Student account not found' });
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
    const accounts = TENANT_FEE_ACCOUNTS[schoolId] || {};
    
    let matched = Object.values(accounts).map(acc => ({
      admNo: acc.student.admNo,
      srNo: acc.student.srNo,
      name: acc.student.name,
      fatherName: acc.student.fatherName,
      className: acc.student.className,
      mobile: acc.student.mobile,
      dueAmount: acc.heads.filter(h => !h.isPaid).reduce((sum, h) => sum + (h.netPayable || h.amount), 0),
      heads: acc.heads
    }));

    if (mobile.trim()) {
      matched = matched.filter(s => s.mobile && s.mobile.includes(mobile.trim()));
    } else if (fatherName.trim()) {
      matched = matched.filter(s => s.fatherName && s.fatherName.toLowerCase().includes(fatherName.trim().toLowerCase()));
    }

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
        TENANT_RECEIPTS[schoolId][idx].status = 'CANCELLED';
        TENANT_RECEIPTS[schoolId][idx].cancelReason = reason;
        TENANT_RECEIPTS[schoolId][idx].cancelledAt = new Date().toISOString();
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
    const accounts = TENANT_FEE_ACCOUNTS[schoolId] || {};
    // Students eligible for board (Class X and XII)
    const boardStudents = Object.values(accounts)
      .filter(acc => acc.student.className.includes('X') || acc.student.className.includes('10') || acc.student.className.includes('XII') || acc.student.className.includes('12'))
      .map(acc => ({
        admNo: acc.student.admNo,
        srNo: acc.student.srNo,
        name: acc.student.name,
        className: acc.student.className,
        boardFee: 3500,
        paid: acc.heads.find(h => h.feeHead.toLowerCase().includes('board'))?.isPaid || false
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
