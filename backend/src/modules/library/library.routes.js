import express from 'express';
import {
  getAuthors,
  createAuthor,
  deleteAuthor,
  getPublications,
  createPublication,
  deletePublication,
  getCategories,
  createCategory,
  deleteCategory,
  getFineSettings,
  updateFineSettings,
  getSuppliers,
  createSupplier,
  deleteSupplier,
  getBooks,
  createBook,
  deleteBook,
  getIssues,
  createIssue,
  deleteIssue,
  getReturns,
  createReturn,
  getPurchases,
  createPurchase,
  deletePurchase,
  getDamagedBooks,
  createDamagedBook,
  deleteDamagedBook
} from './library.controller.js';

const router = express.Router();

// Authors
router.get('/authors', getAuthors);
router.post('/authors', createAuthor);
router.delete('/authors/:id', deleteAuthor);

// Publications
router.get('/publications', getPublications);
router.post('/publications', createPublication);
router.delete('/publications/:id', deletePublication);

// Categories
router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.delete('/categories/:id', deleteCategory);

// Fine Settings
router.get('/fine-settings', getFineSettings);
router.put('/fine-settings', updateFineSettings);

// Suppliers
router.get('/suppliers', getSuppliers);
router.post('/suppliers', createSupplier);
router.delete('/suppliers/:id', deleteSupplier);

// Books Catalog
router.get('/books', getBooks);
router.post('/books', createBook);
router.delete('/books/:id', deleteBook);

// Issues
router.get('/issues', getIssues);
router.post('/issues', createIssue);
router.delete('/issues/:id', deleteIssue);

// Returns
router.get('/returns', getReturns);
router.post('/returns', createReturn);

// Purchases
router.get('/purchases', getPurchases);
router.post('/purchases', createPurchase);
router.delete('/purchases/:id', deletePurchase);

// Damaged Books
router.get('/damaged-books', getDamagedBooks);
router.post('/damaged-books', createDamagedBook);
router.delete('/damaged-books/:id', deleteDamagedBook);

export default router;
