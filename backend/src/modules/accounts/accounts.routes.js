import { Router } from 'express';
import {
  getExpenses,
  createExpense,
  deleteExpense,
  getDayBook
} from './accounts.controller.js';

const router = Router();

router.get('/expenses', getExpenses);
router.post('/expenses', createExpense);
router.delete('/expenses/:id', deleteExpense);
router.get('/day-book', getDayBook);

export default router;
