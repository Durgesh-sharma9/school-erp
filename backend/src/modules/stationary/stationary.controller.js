// In-memory multi-tenant store for Stationary Module (Clean - Real Data Only)

let shops = [];
let suppliers = [];
let categories = [];
let items = [];
let sets = [];
let sales = [];
let purchases = [];

// --- SHOPS ---
export const getShops = (req, res) => res.json({ success: true, data: shops });
export const createShop = (req, res) => {
  const { shopName, mobileNo, city, state, gstNo, pincode, address, remark } = req.body;
  if (!shopName) return res.status(400).json({ success: false, message: 'Shop Name is required' });
  const newShop = {
    id: String(Date.now()),
    shopName,
    mobileNo: mobileNo || '',
    city: city || 'Jaipur',
    state: state || 'Rajasthan',
    gstNo: gstNo || '',
    pincode: pincode || '',
    address: address || '',
    remark: remark || ''
  };
  shops.push(newShop);
  res.status(201).json({ success: true, data: newShop, message: 'Shop added successfully' });
};
export const deleteShop = (req, res) => {
  shops = shops.filter(s => s.id !== req.params.id);
  res.json({ success: true, message: 'Shop deleted successfully' });
};

// --- SUPPLIERS ---
export const getSuppliers = (req, res) => res.json({ success: true, data: suppliers });
export const createSupplier = (req, res) => {
  const { shopName, supplierName, mobileNo, city, state, gstNo, aadharNo, panNo, pincode, address, remark } = req.body;
  if (!supplierName) return res.status(400).json({ success: false, message: 'Supplier Name is required' });
  const newSup = {
    id: String(Date.now()),
    shopName: shopName || 'J D Book',
    supplierName,
    mobileNo: mobileNo || '',
    city: city || 'Jaipur',
    state: state || 'Rajasthan',
    gstNo: gstNo || '',
    aadharNo: aadharNo || '',
    panNo: panNo || '',
    pincode: pincode || '',
    address: address || '',
    remark: remark || ''
  };
  suppliers.push(newSup);
  res.status(201).json({ success: true, data: newSup, message: 'Supplier added successfully' });
};
export const deleteSupplier = (req, res) => {
  suppliers = suppliers.filter(s => s.id !== req.params.id);
  res.json({ success: true, message: 'Supplier deleted successfully' });
};

// --- CATEGORIES ---
export const getCategories = (req, res) => {
  const categoriesWithCounts = categories.map(cat => {
    const count = items.filter(it => (it.categoryName || '').toLowerCase() === (cat.categoryName || '').toLowerCase()).length;
    return { ...cat, itemsCount: count };
  });
  res.json({ success: true, data: categoriesWithCounts });
};

export const createCategory = (req, res) => {
  const { shopName, categoryName, categoryType, issueScope, applicableClasses, percentage, remark } = req.body;
  if (!categoryName || !categoryName.trim()) {
    return res.status(400).json({ success: false, message: 'Category Name is required' });
  }
  const cleanName = categoryName.trim();
  const existing = categories.find(c => c.categoryName.toLowerCase() === cleanName.toLowerCase());
  if (existing) {
    return res.status(400).json({ success: false, message: 'Category with this name already exists' });
  }
  const newCat = {
    id: String(Date.now()),
    shopName: shopName || 'Main Store',
    categoryName: cleanName,
    categoryType: categoryType || 'General',
    issueScope: issueScope || 'ALL',
    applicableClasses: Array.isArray(applicableClasses) ? applicableClasses : (applicableClasses ? [applicableClasses] : []),
    percentage: Number(percentage) || 0,
    remark: remark || ''
  };
  categories.push(newCat);
  res.status(201).json({ success: true, data: { ...newCat, itemsCount: 0 }, message: 'Category created successfully' });
};

export const updateCategory = (req, res) => {
  const { shopName, categoryName, categoryType, issueScope, applicableClasses, percentage, remark } = req.body;
  const cat = categories.find(c => c.id === req.params.id);
  if (!cat) return res.status(404).json({ success: false, message: 'Category not found' });
  
  if (categoryName && categoryName.trim()) {
    const cleanName = categoryName.trim();
    const existing = categories.find(c => c.id !== req.params.id && c.categoryName.toLowerCase() === cleanName.toLowerCase());
    if (existing) return res.status(400).json({ success: false, message: 'Another category with this name already exists' });
    
    // Update items under old categoryName
    const oldName = cat.categoryName;
    items.forEach(it => {
      if (it.categoryName === oldName) it.categoryName = cleanName;
    });
    cat.categoryName = cleanName;
  }
  if (categoryType) cat.categoryType = categoryType;
  if (issueScope) cat.issueScope = issueScope;
  if (applicableClasses !== undefined) {
    cat.applicableClasses = Array.isArray(applicableClasses) ? applicableClasses : (applicableClasses ? [applicableClasses] : []);
  }
  if (percentage !== undefined) cat.percentage = Number(percentage) || 0;
  if (shopName) cat.shopName = shopName;
  if (remark !== undefined) cat.remark = remark;

  res.json({ success: true, data: cat, message: 'Category updated successfully' });
};

export const deleteCategory = (req, res) => {
  const catToDelete = categories.find(c => c.id === req.params.id);
  if (catToDelete) {
    const hasItems = items.some(it => (it.categoryName || '').toLowerCase() === catToDelete.categoryName.toLowerCase());
    if (hasItems) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category "${catToDelete.categoryName}" because active items are assigned to it.`
      });
    }
  }
  categories = categories.filter(c => c.id !== req.params.id);
  res.json({ success: true, message: 'Category deleted successfully' });
};

// --- ITEMS ---
export const getItems = (req, res) => res.json({ success: true, data: items });
export const createItem = (req, res) => {
  const { shopName, categoryName, barcode, hsnCode, itemName, rate, openQty, reorderQty } = req.body;
  if (!itemName) return res.status(400).json({ success: false, message: 'Item Name is required' });
  const qty = Number(openQty) || 0;
  const newItem = {
    id: String(Date.now()),
    shopName: shopName || 'J D Book',
    categoryName: categoryName || 'General',
    barcode: barcode || `BC-${Date.now().toString().slice(-6)}`,
    hsnCode: hsnCode || '',
    itemName,
    rate: Number(rate) || 0,
    openQty: qty,
    reorderQty: Number(reorderQty) || 10,
    purchasedQty: 0,
    issuedQty: 0,
    availableQty: qty
  };
  items.push(newItem);
  res.status(201).json({ success: true, data: newItem, message: 'Item registered successfully' });
};
export const updateItem = (req, res) => {
  const { shopName, categoryName, barcode, hsnCode, itemName, rate, openQty, reorderQty } = req.body;
  const item = items.find(i => i.id === req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

  if (itemName) item.itemName = itemName;
  if (categoryName) item.categoryName = categoryName;
  if (shopName) item.shopName = shopName;
  if (barcode !== undefined) item.barcode = barcode;
  if (hsnCode !== undefined) item.hsnCode = hsnCode;
  if (rate !== undefined) item.rate = Number(rate) || 0;
  if (openQty !== undefined) {
    const prevOpen = item.openQty || 0;
    const diff = (Number(openQty) || 0) - prevOpen;
    item.openQty = Number(openQty) || 0;
    item.availableQty = Math.max(0, (item.availableQty || 0) + diff);
  }
  if (reorderQty !== undefined) item.reorderQty = Number(reorderQty) || 10;

  res.json({ success: true, data: item, message: 'Item updated successfully' });
};

export const deleteItem = (req, res) => {
  items = items.filter(i => i.id !== req.params.id);
  res.json({ success: true, message: 'Item deleted' });
};

// --- SETS ---
export const getSets = (req, res) => res.json({ success: true, data: sets });
export const createSet = (req, res) => {
  const { setCode, className, categoryName, setName, items: setItemsList } = req.body;
  if (!setName) return res.status(400).json({ success: false, message: 'Set Name is required' });
  const totalCost = (setItemsList || []).reduce((sum, it) => sum + (Number(it.qty) * Number(it.rate)), 0);
  const newSet = {
    id: String(Date.now()),
    setCode: setCode || `SET-${Date.now().toString().slice(-4)}`,
    className: className || 'General',
    categoryName: categoryName || 'Books & Stationery',
    setName,
    noOfItems: (setItemsList || []).length,
    totalCost,
    items: setItemsList || []
  };
  sets.push(newSet);
  res.status(201).json({ success: true, data: newSet, message: 'Set created successfully' });
};
export const deleteSet = (req, res) => {
  sets = sets.filter(s => s.id !== req.params.id);
  res.json({ success: true, message: 'Set deleted' });
};

// --- SALES / ISSUE ITEMS ---
export const getSales = (req, res) => res.json({ success: true, data: sales });
export const createSale = (req, res) => {
  const { billNo, className, name, mobileNo, shopName, noOfSets, totalCost, gst, discount, paidAmt, due, cash, bank, items: soldItems, payMode } = req.body;
  if (!name) return res.status(400).json({ success: false, message: 'Customer name is required' });

  // Deduct stock for issued items
  if (Array.isArray(soldItems)) {
    soldItems.forEach(si => {
      const it = items.find(i => i.id === si.id || (si.itemName && i.itemName.toLowerCase() === si.itemName.toLowerCase()));
      if (it) {
        const q = Number(si.qty) || 1;
        it.issuedQty = (it.issuedQty || 0) + q;
        it.availableQty = Math.max(0, (it.availableQty || 0) - q);
      }
    });
  }

  const newSale = {
    id: String(Date.now()),
    billNo: billNo || `SB-2026-${String(sales.length + 1).padStart(3, '0')}`,
    className: className || 'N/A',
    name,
    mobileNo: mobileNo || '',
    shopName: shopName || 'Main Store',
    type: 'Sale',
    noOfSets: Number(noOfSets) || (Array.isArray(soldItems) ? soldItems.length : 1),
    totalCost: Number(totalCost) || 0,
    gst: Number(gst) || 0,
    finalCost: Number(totalCost) || 0,
    cash: payMode === 'Cash' ? (Number(paidAmt) || 0) : (Number(cash) || 0),
    bank: payMode !== 'Cash' ? (Number(paidAmt) || 0) : (Number(bank) || 0),
    payMode: payMode || 'Cash',
    discount: Number(discount) || 0,
    paidAmt: Number(paidAmt) || 0,
    due: Number(due) || 0,
    issueDate: new Date().toISOString().slice(0, 10),
    receipt: `RCP-${1000 + sales.length + 1}`,
    items: Array.isArray(soldItems) ? soldItems : []
  };
  sales.push(newSale);
  res.status(201).json({ success: true, data: newSale, message: 'Sale recorded and items issued' });
};
export const deleteSale = (req, res) => {
  sales = sales.filter(s => s.id !== req.params.id);
  res.json({ success: true, message: 'Sale record deleted' });
};

// Collect Due Payment
export const collectDue = (req, res) => {
  const { id, paidAmt } = req.body;
  const sale = sales.find(s => s.id === id);
  if (sale) {
    const payment = Number(paidAmt) || 0;
    sale.paidAmt += payment;
    sale.due = Math.max(0, sale.due - payment);
    res.json({ success: true, data: sale, message: 'Due payment collected successfully' });
  } else {
    res.status(404).json({ success: false, message: 'Record not found' });
  }
};

// --- PURCHASES ---
export const getPurchases = (req, res) => res.json({ success: true, data: purchases });
export const createPurchase = (req, res) => {
  const { supplierName, mobileNo, totalCost, paidAmt, discount, items: purchaseItemsList } = req.body;
  if (!supplierName) return res.status(400).json({ success: false, message: 'Supplier is required' });
  const newPur = {
    id: String(Date.now()),
    supplierName,
    mobileNo: mobileNo || '',
    noOfItem: (purchaseItemsList || []).length,
    totalCost: Number(totalCost) || 0,
    paidAmt: Number(paidAmt) || 0,
    discount: Number(discount) || 0,
    purchaseDate: new Date().toISOString().slice(0, 10),
    items: purchaseItemsList || []
  };
  purchases.push(newPur);

  // Update item inventory
  (purchaseItemsList || []).forEach(pItem => {
    const item = items.find(i => i.itemName.toLowerCase() === (pItem.itemName || '').toLowerCase());
    if (item) {
      item.purchasedQty += Number(pItem.qty) || 0;
      item.availableQty += Number(pItem.qty) || 0;
    }
  });

  res.status(201).json({ success: true, data: newPur, message: 'Purchase recorded and stock added' });
};
export const deletePurchase = (req, res) => {
  purchases = purchases.filter(p => p.id !== req.params.id);
  res.json({ success: true, message: 'Purchase deleted' });
};
