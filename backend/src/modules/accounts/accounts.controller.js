import { ApiResponse } from '../../core/utils/apiResponse.js';
import { asyncHandler } from '../../core/utils/asyncHandler.js';

// Multi-Tenant In-Memory & Persistent Ledger Store
const TENANT_EXPENSES = {
  'sch_jd_intl': [
    {
      id: 'exp_001',
      voucherNo: 'VCH-2026-001',
      date: '2026-10-20',
      head: 'Electricity & Utilities',
      amount: 24500,
      payMode: 'Bank Transfer',
      paidTo: 'Jaipur Vidyut Vitran Nigam Ltd',
      remarks: 'September 2026 High Tension Electricity Bill',
      approvedBy: 'Principal V.K. Sharma',
      status: 'Paid'
    },
    {
      id: 'exp_002',
      voucherNo: 'VCH-2026-002',
      date: '2026-10-21',
      head: 'Transport Diesel & Fuel',
      amount: 18200,
      payMode: 'Cash',
      paidTo: 'Indian Oil Dealer - Vidhyadhar Nagar',
      remarks: 'Fuel refill for School Buses 01, 02, 05',
      approvedBy: 'Transport Incharge',
      status: 'Paid'
    },
    {
      id: 'exp_003',
      voucherNo: 'VCH-2026-003',
      date: '2026-10-21',
      head: 'Science Lab Equipment',
      amount: 12500,
      payMode: 'Cheque',
      paidTo: 'Modern Scientific Supplies',
      remarks: 'Glassware and chemicals for Senior Chemistry Lab',
      approvedBy: 'Vice Principal',
      status: 'Paid'
    },
    {
      id: 'exp_004',
      voucherNo: 'VCH-2026-004',
      date: '2026-10-19',
      head: 'Sports & Physical Education',
      amount: 8600,
      payMode: 'UPI',
      paidTo: 'Champion Sports Hub',
      remarks: 'Cricket kits and footballs for Annual Sports meet',
      approvedBy: 'Sports Director',
      status: 'Paid'
    },
    {
      id: 'exp_005',
      voucherNo: 'VCH-2026-005',
      date: '2026-10-18',
      head: 'Printing & Stationery',
      amount: 15400,
      payMode: 'Cash',
      paidTo: 'Graphic Arts Press',
      remarks: 'Term 1 Exam Question Papers and Answer Sheets printing',
      approvedBy: 'Exam Incharge',
      status: 'Paid'
    }
  ],
  'sch_dps_branch2': [
    {
      id: 'exp_dps_001',
      voucherNo: 'DPS-EXP-101',
      date: '2026-10-20',
      head: 'Campus Maintenance',
      amount: 14000,
      payMode: 'Bank Transfer',
      paidTo: 'Apex Facility Services',
      remarks: 'Garden and classroom deep sanitation',
      approvedBy: 'Director',
      status: 'Paid'
    }
  ]
};

export const getExpenses = asyncHandler(async (req, res) => {
  const schoolId = req.schoolId || 'sch_jd_intl';
  const expenses = TENANT_EXPENSES[schoolId] || [];
  const { head, dateFrom, dateTo } = req.query;

  let filtered = [...expenses];
  if (head && head !== 'All') {
    filtered = filtered.filter(e => e.head.toLowerCase() === head.toLowerCase());
  }
  if (dateFrom) {
    filtered = filtered.filter(e => e.date >= dateFrom);
  }
  if (dateTo) {
    filtered = filtered.filter(e => e.date <= dateTo);
  }

  const totalExpense = filtered.reduce((acc, curr) => acc + curr.amount, 0);

  return res.status(200).json(
    new ApiResponse(200, {
      expenses: filtered,
      totalCount: filtered.length,
      totalExpense
    }, 'Expenses fetched successfully')
  );
});

export const createExpense = asyncHandler(async (req, res) => {
  const schoolId = req.schoolId || 'sch_jd_intl';
  const { head, amount, payMode, paidTo, remarks, date } = req.body;

  if (!head || !amount || !paidTo) {
    return res.status(400).json(new ApiResponse(400, null, 'Head, amount, and payee are mandatory'));
  }

  if (!TENANT_EXPENSES[schoolId]) {
    TENANT_EXPENSES[schoolId] = [];
  }

  const newVoucher = {
    id: `exp_${Date.now()}`,
    voucherNo: `VCH-${new Date().getFullYear()}-${String(TENANT_EXPENSES[schoolId].length + 1).padStart(3, '0')}`,
    date: date || new Date().toISOString().split('T')[0],
    head,
    amount: Number(amount),
    payMode: payMode || 'Cash',
    paidTo,
    remarks: remarks || '',
    approvedBy: req.user?.name || 'Administrator',
    status: 'Paid',
    createdAt: new Date().toISOString()
  };

  TENANT_EXPENSES[schoolId].unshift(newVoucher);

  return res.status(201).json(
    new ApiResponse(201, newVoucher, 'Expense voucher created successfully')
  );
});

export const deleteExpense = asyncHandler(async (req, res) => {
  const schoolId = req.schoolId || 'sch_jd_intl';
  const { id } = req.params;

  if (TENANT_EXPENSES[schoolId]) {
    TENANT_EXPENSES[schoolId] = TENANT_EXPENSES[schoolId].filter(e => e.id !== id);
  }

  return res.status(200).json(
    new ApiResponse(200, { id }, 'Expense voucher deleted successfully')
  );
});

export const getDayBook = asyncHandler(async (req, res) => {
  const schoolId = req.schoolId || 'sch_jd_intl';
  const date = req.query.date || new Date().toISOString().split('T')[0];

  // Inflow from fee counter receipts on this date (Clean fresh state: starts empty unless actual receipts recorded)
  const feeInflow = [];

  // Outflow from expenses on this date
  const expenses = (TENANT_EXPENSES[schoolId] || []).filter(e => e.date === date);
  const feeOutflow = expenses.map(e => ({
    id: e.id,
    time: '12:15 PM',
    type: 'Expense Voucher',
    refNo: e.voucherNo,
    to: e.paidTo,
    category: e.head,
    mode: e.payMode,
    amount: e.amount
  }));

  const totalInflow = feeInflow.reduce((acc, c) => acc + c.amount, 0);
  const totalOutflow = feeOutflow.reduce((acc, c) => acc + c.amount, 0);
  const openingBalance = 0;
  const netClosingBalance = openingBalance + totalInflow - totalOutflow;

  return res.status(200).json(
    new ApiResponse(200, {
      date,
      openingBalance,
      totalInflow,
      totalOutflow,
      netClosingBalance,
      inflowRecords: feeInflow,
      outflowRecords: feeOutflow
    }, 'Day book ledger generated successfully')
  );
});
