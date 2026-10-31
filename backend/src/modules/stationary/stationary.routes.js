import express from 'express';
import {
  getShops,
  createShop,
  deleteShop,
  getSuppliers,
  createSupplier,
  deleteSupplier,
  getCategories,
  createCategory,
  deleteCategory,
  updateCategory,
  getItems,
  createItem,
  deleteItem,
  updateItem,
  getSets,
  createSet,
  deleteSet,
  getSales,
  createSale,
  deleteSale,
  collectDue,
  getPurchases,
  createPurchase,
  deletePurchase
} from './stationary.controller.js';

const router = express.Router();

// Shops
router.get('/shops', getShops);
router.post('/shops', createShop);
router.delete('/shops/:id', deleteShop);

// Suppliers
router.get('/suppliers', getSuppliers);
router.post('/suppliers', createSupplier);
router.delete('/suppliers/:id', deleteSupplier);

// Categories
router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.delete('/categories/:id', deleteCategory);
router.put('/categories/:id', updateCategory);

// Items
router.get('/items', getItems);
router.post('/items', createItem);
router.delete('/items/:id', deleteItem);
router.put('/items/:id', updateItem);

// Sets
router.get('/sets', getSets);
router.post('/sets', createSet);
router.delete('/sets/:id', deleteSet);

// Sales / Issue Items
router.get('/sales', getSales);
router.post('/sales', createSale);
router.delete('/sales/:id', deleteSale);
router.post('/sales/collect-due', collectDue);

// Purchases
router.get('/purchases', getPurchases);
router.post('/purchases', createPurchase);
router.delete('/purchases/:id', deletePurchase);

export default router;
