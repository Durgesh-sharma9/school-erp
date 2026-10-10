import express from 'express';
import {
  getStudentFeeLedger,
  collectFeePayment,
  getFeeRecentReceipts
} from './fees.controller.js';

const router = express.Router();

// Get student dues and ledger
router.get('/student/:admNo', getStudentFeeLedger);

// Process fee collection transaction
router.post('/collect', collectFeePayment);

// Get recent transactions / receipts
router.get('/receipts', getFeeRecentReceipts);

export default router;
