import express from 'express';
import {
  getStudentFeeLedger,
  collectFeePayment,
  getFeeRecentReceipts,
  getFeeHeadGroups,
  saveFeeHeadGroup,
  deleteFeeHeadGroup,
  getFeeHeads,
  saveFeeHead,
  deleteFeeHead,
  getConcessionTypes,
  saveConcessionType,
  deleteConcessionType,
  getFineMasters,
  saveFineMaster,
  deleteFineMaster,
  getFeeStructures,
  saveFeeStructure,
  deleteFeeStructure,
  getFeeManualStudents,
  saveFeeManualEdit,
  getStudentConcessions,
  saveStudentConcession,
  deleteStudentConcession,
  lookupSiblings,
  collectSiblingFee,
  cancelFeeReceipt,
  getBoardFeeStudents,
  collectBoardFee,
  getFeeReportsData
} from './fees.controller.js';

const router = express.Router();

// 1. Fee Entry / Collection
router.get('/student/:admNo', getStudentFeeLedger);
router.post('/collect', collectFeePayment);
router.get('/receipts', getFeeRecentReceipts);

// 2. Fee Head Groups
router.get('/head-groups', getFeeHeadGroups);
router.post('/head-groups', saveFeeHeadGroup);
router.delete('/head-groups/:id', deleteFeeHeadGroup);

// 3. Fee Heads
router.get('/heads', getFeeHeads);
router.post('/heads', saveFeeHead);
router.delete('/heads/:id', deleteFeeHead);

// 4. Concession Categories
router.get('/concession-types', getConcessionTypes);
router.post('/concession-types', saveConcessionType);
router.delete('/concession-types/:id', deleteConcessionType);

// 5. Fine Master
router.get('/fines', getFineMasters);
router.post('/fines', saveFineMaster);
router.delete('/fines/:id', deleteFineMaster);

// 6. Fee Structures
router.get('/structures', getFeeStructures);
router.post('/structures', saveFeeStructure);
router.delete('/structures/:id', deleteFeeStructure);

// 7. Fee Manual Edit
router.get('/manual-students', getFeeManualStudents);
router.post('/manual-edit', saveFeeManualEdit);

// 8. Fee Concession
router.get('/concessions', getStudentConcessions);
router.post('/concessions', saveStudentConcession);
router.delete('/concessions/:id', deleteStudentConcession);

// 9. Sibling Fee Entry
router.get('/sibling-lookup', lookupSiblings);
router.post('/sibling-collect', collectSiblingFee);

// 10. Cancel Fee
router.post('/cancel-receipt', cancelFeeReceipt);

// 11. Board Fee Manual Entry
router.get('/board-students', getBoardFeeStudents);
router.post('/board-collect', collectBoardFee);

// 12. Fee Reports
router.get('/reports', getFeeReportsData);

export default router;
