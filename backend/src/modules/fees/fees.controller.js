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
        { id: 'h_jd_11', feeHead: 'Tuition Fee (Term 1)', amount: 9500, discount: 0, fine: 0, netPayable: 9500, isPaid: true }
      ],
      receipts: [
        { receiptNo: 'JD-REC-002', paidAmount: 13500, payMode: 'Cash', date: '2026-04-12' }
      ]
    }
  },

  // School B: Delhi Public Academy (Different students, completely separate ledger)
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
        { id: 'h_dps_2', feeHead: 'Tuition Fee (Quarter 1)', amount: 14500, discount: 0, fine: 0, netPayable: 14500, isPaid: false },
        { id: 'h_dps_3', feeHead: 'Science Lab & Tech Fee', amount: 2500, discount: 0, fine: 0, netPayable: 2500, isPaid: false }
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
  ],
  'sch_dps_branch2': [
    {
      receiptNo: 'DPS-REC-101',
      admNo: 'DPS-101',
      studentName: 'ROHAN SHARMA',
      className: 'Class 10-A',
      paidAmount: 3500,
      payMode: 'Bank Transfer',
      date: '2026-04-15'
    }
  ]
};

const getActiveSchoolId = (req) => {
  return req.schoolId || req.user?.schoolId || req.headers['x-school-id'] || 'sch_jd_intl';
};

/**
 * Get student fee ledger strictly scoped to active tenant
 */
export const getStudentFeeLedger = async (req, res, next) => {
  try {
    const schoolId = getActiveSchoolId(req);
    const { admNo } = req.params;

    const schoolAccounts = TENANT_FEE_ACCOUNTS[schoolId] || {};
    const account = schoolAccounts[admNo];

    if (!account) {
      // Create on the fly account for newly registered student in this specific school
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
 * Process fee collection payment strictly within tenant boundaries
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

    const schoolPrefix = schoolId === 'sch_dps_branch2' ? 'DPS' : 'REC';
    const count = TENANT_RECEIPTS[schoolId].length + 1;
    const receiptNo = `${schoolPrefix}-2026-${String(count).padStart(3, '0')}`;

    const newReceipt = {
      receiptNo,
      admNo,
      schoolId,
      paidAmount: Number(paidAmount),
      payMode,
      chequeNo,
      bankName,
      remarks,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };

    TENANT_RECEIPTS[schoolId].unshift(newReceipt);

    // Update account if found in this school
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
 * Get recent fee receipts strictly for active school
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
