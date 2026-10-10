import prisma from '../../config/db.js';

// In-memory ledger store for offline resilience matching live UAB fee structure
const inMemoryFeeAccounts = {
  '1992': {
    student: {
      admNo: '1992',
      srNo: '1992',
      name: 'Aarav Sharma',
      fatherName: 'Rajesh Sharma',
      className: 'Class 10',
      section: 'A',
      feeType: 'Day Scholar',
      mobile: '9876543210'
    },
    heads: [
      { id: 'h1', feeHead: 'Admission Fee', amount: 5000, discount: 0, fine: 0, netPayable: 5000, isPaid: false },
      { id: 'h2', feeHead: 'Tuition Fee (Q1)', amount: 12000, discount: 0, fine: 0, netPayable: 12000, isPaid: false },
      { id: 'h3', feeHead: 'Examination Fee', amount: 1500, discount: 0, fine: 0, netPayable: 1500, isPaid: false },
      { id: 'h4', feeHead: 'Activity & Sports Fee', amount: 2000, discount: 500, fine: 0, netPayable: 1500, isPaid: false },
      { id: 'h5', feeHead: 'Computer Lab Fee', amount: 1800, discount: 0, fine: 0, netPayable: 1800, isPaid: false }
    ],
    receipts: []
  },
  '2024': {
    student: {
      admNo: '2024',
      srNo: '2024',
      name: 'Ananya Verma',
      fatherName: 'Vikas Verma',
      className: 'Class 9',
      section: 'B',
      feeType: 'Day Scholar',
      mobile: '9123456789'
    },
    heads: [
      { id: 'h20', feeHead: 'Tuition Fee (Q1)', amount: 11000, discount: 0, fine: 0, netPayable: 11000, isPaid: false },
      { id: 'h21', feeHead: 'Computer Lab Fee', amount: 1500, discount: 0, fine: 0, netPayable: 1500, isPaid: false },
      { id: 'h22', feeHead: 'Library Fee', amount: 1000, discount: 0, fine: 0, netPayable: 1000, isPaid: false }
    ],
    receipts: []
  }
};

const allReceipts = [
  {
    receiptNo: 'REC-2026-001',
    admNo: '1992',
    studentName: 'Aarav Sharma',
    className: 'Class 10-A',
    amount: 15000,
    payMode: 'UPI',
    referenceNo: 'UPI98374291',
    date: '2026-04-05'
  }
];

/**
 * Get student fee ledger / dues
 */
export const getStudentFeeLedger = async (req, res, next) => {
  try {
    const { admNo } = req.params;
    const account = inMemoryFeeAccounts[admNo];

    if (!account) {
      // Create on the fly account for newly registered student
      return res.status(200).json({
        success: true,
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
            { id: 'h_new_1', feeHead: 'Admission Fee', amount: 3000, discount: 0, fine: 0, netPayable: 3000, isPaid: false },
            { id: 'h_new_2', feeHead: 'Tuition Fee', amount: 8000, discount: 0, fine: 0, netPayable: 8000, isPaid: false }
          ],
          receipts: []
        }
      });
    }

    return res.status(200).json({
      success: true,
      data: account
    });
  } catch (error) {
    console.error('[Get Fee Ledger Error]:', error);
    next(error);
  }
};

/**
 * Process fee collection payment
 */
export const collectFeePayment = async (req, res, next) => {
  try {
    const {
      admNo,
      paidAmount,
      payMode = 'Cash',
      chequeNo = '',
      bankName = '',
      remarks = '',
      paidHeadIds = []
    } = req.body;

    const receiptNo = `REC-2026-${String(allReceipts.length + 1).padStart(3, '0')}`;
    const newReceipt = {
      receiptNo,
      admNo,
      paidAmount: Number(paidAmount),
      payMode,
      chequeNo,
      bankName,
      remarks,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };

    allReceipts.unshift(newReceipt);

    // Update account if found
    if (inMemoryFeeAccounts[admNo]) {
      inMemoryFeeAccounts[admNo].receipts.unshift(newReceipt);
      if (paidHeadIds.length > 0) {
        inMemoryFeeAccounts[admNo].heads = inMemoryFeeAccounts[admNo].heads.map(h => 
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
 * Get recent fee receipts
 */
export const getFeeRecentReceipts = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      data: allReceipts
    });
  } catch (error) {
    console.error('[Get Receipts Error]:', error);
    next(error);
  }
};
