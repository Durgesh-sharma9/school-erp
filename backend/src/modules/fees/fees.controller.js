import prisma from '../../config/db.js';
import { TENANT_STUDENTS } from '../students/students.controller.js';

// Multi-Tenant Partitioned Fee Accounts: schoolId -> { admNo -> account } (Clean Fresh State)
export const TENANT_FEE_ACCOUNTS = {
  'sch_jd_intl': {},
  'sch_dps_branch2': {}
};

// Master Receipt Ledger
export const TENANT_RECEIPTS = {
  'sch_jd_intl': [],
  'sch_dps_branch2': []
};

export const getStudentFeeAccount = async (req, res) => {
  try {
    const schoolId = req.headers['x-school-id'] || req.schoolId || 'sch_jd_intl';
    const { admNo } = req.params;

    if (!TENANT_FEE_ACCOUNTS[schoolId]) TENANT_FEE_ACCOUNTS[schoolId] = {};
    const account = TENANT_FEE_ACCOUNTS[schoolId][admNo];
    if (!account) {
      return res.status(200).json({
        success: true,
        data: {
          student: null,
          heads: [],
          receipts: []
        }
      });
    }

    return res.status(200).json({
      success: true,
      data: account
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const collectFees = async (req, res) => {
  try {
    const schoolId = req.headers['x-school-id'] || req.schoolId || 'sch_jd_intl';
    const { admNo, paidAmount, payMode, headsPaid } = req.body;

    if (!TENANT_RECEIPTS[schoolId]) TENANT_RECEIPTS[schoolId] = [];
    const receiptNo = `RCP-${Date.now().toString().slice(-4)}`;

    const newReceipt = {
      id: `rcp_${Date.now()}`,
      receiptNo,
      admNo,
      date: new Date().toISOString().split('T')[0],
      paidAmount: Number(paidAmount) || 0,
      payMode: payMode || 'Cash',
      heads: headsPaid || []
    };

    TENANT_RECEIPTS[schoolId].unshift(newReceipt);

    return res.status(201).json({
      success: true,
      message: 'Fee collected successfully',
      data: newReceipt
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getFeeReceipts = async (req, res) => {
  try {
    const schoolId = req.headers['x-school-id'] || req.schoolId || 'sch_jd_intl';
    if (!TENANT_RECEIPTS[schoolId]) TENANT_RECEIPTS[schoolId] = [];
    return res.status(200).json({
      success: true,
      count: TENANT_RECEIPTS[schoolId].length,
      data: TENANT_RECEIPTS[schoolId]
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
