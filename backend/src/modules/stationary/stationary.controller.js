// In-memory multi-tenant store for Stationary Module

let shops = [
  { id: '1', shopName: 'J D Book', mobileNo: '8947919195', city: 'Jaipur', state: 'Rajasthan', gstNo: '08AAAAA1111A1Z1', pincode: '302003', address: 'Main Gate Complex, J D Campus', remark: 'Textbooks, notebooks, and reference study sets' },
  { id: '2', shopName: 'J D Uniform', mobileNo: '9829012345', city: 'Jaipur', state: 'Rajasthan', gstNo: '08BBBBB2222B2Z2', pincode: '302015', address: 'Sports & Tailoring Wing, Block B', remark: 'Summer/Winter school uniform, sportswear, ties & badges' }
];

let suppliers = [
  { id: '1', shopName: 'J D Uniform', supplierName: 'Maheshwari Garments', mobileNo: '9414055667', city: 'Jaipur', state: 'Rajasthan', gstNo: '08CCCCC3333C3Z3', aadharNo: '456789123456', panNo: 'ABCDE1234F', pincode: '302001', address: 'Plot 45, Textile Market, Sanganer', remark: 'Primary uniform fabric manufacturer' },
  { id: '2', shopName: 'J D Book', supplierName: 'Rajasthan Stationery Mart', mobileNo: '9828012345', city: 'Jaipur', state: 'Rajasthan', gstNo: '08DDDDD4444D4Z4', aadharNo: '789012345678', panNo: 'FGHIJ5678K', pincode: '302003', address: 'Shop 12, Chaura Rasta, Jaipur', remark: 'School diaries, registers, exam papers' },
  { id: '3', shopName: 'J D Book', supplierName: 'Prabhat Paper Mills', mobileNo: '9829098765', city: 'Jaipur', state: 'Rajasthan', gstNo: '08EEEEE5555E5Z5', aadharNo: '234567890123', panNo: 'KLMNO9012P', pincode: '302013', address: 'VKIA Road No 9, Jaipur', remark: 'Notebooks and customized school stationery' }
];

let categories = [
  { id: '1', shopName: 'J D Uniform', categoryName: 'Uniform', percentage: 0 },
  { id: '2', shopName: 'J D Book', categoryName: 'Books', percentage: 0 },
  { id: '3', shopName: 'J D Book', categoryName: 'Note Books', percentage: 0 },
  { id: '4', shopName: 'J D Book', categoryName: 'Diary', percentage: 0 },
  { id: '5', shopName: 'J D Book', categoryName: 'Register', percentage: 0 },
  { id: '6', shopName: 'J D Uniform', categoryName: 'Sports Wear', percentage: 5 }
];

let items = [
  { id: '1', shopName: 'J D Book', categoryName: 'Diary', barcode: 'BC-DIR-001', hsnCode: '4820', itemName: 'School Diary 2026-27', rate: 150, openQty: 500, reorderQty: 50, purchasedQty: 100, issuedQty: 320, availableQty: 280 },
  { id: '2', shopName: 'J D Uniform', categoryName: 'Uniform', barcode: 'BC-TSH-022', hsnCode: '6203', itemName: 'T Shirt- W (22)', rate: 300, openQty: 120, reorderQty: 20, purchasedQty: 50, issuedQty: 95, availableQty: 75 },
  { id: '3', shopName: 'J D Uniform', categoryName: 'Uniform', barcode: 'BC-TSH-024', hsnCode: '6203', itemName: 'T Shirt- Y (24)', rate: 300, openQty: 100, reorderQty: 20, purchasedQty: 40, issuedQty: 85, availableQty: 55 },
  { id: '4', shopName: 'J D Uniform', categoryName: 'Uniform', barcode: 'BC-TSH-020', hsnCode: '6203', itemName: 'T-Shirt -W( 20 )', rate: 300, openQty: 80, reorderQty: 15, purchasedQty: 30, issuedQty: 60, availableQty: 50 },
  { id: '5', shopName: 'J D Uniform', categoryName: 'Uniform', barcode: 'BC-PNT-020', hsnCode: '6203', itemName: 'Pant ( 20 )', rate: 450, openQty: 40, reorderQty: 10, purchasedQty: 10, issuedQty: 43, availableQty: 7 },
  { id: '6', shopName: 'J D Uniform', categoryName: 'Uniform', barcode: 'BC-PNT-030', hsnCode: '6203', itemName: 'Pant ( 30 )', rate: 520, openQty: 30, reorderQty: 10, purchasedQty: 10, issuedQty: 35, availableQty: 5 },
  { id: '7', shopName: 'J D Uniform', categoryName: 'Uniform', barcode: 'BC-PAJ-026', hsnCode: '6203', itemName: 'Pajama ( 26 )', rate: 280, openQty: 25, reorderQty: 10, purchasedQty: 5, issuedQty: 26, availableQty: 4 },
  { id: '8', shopName: 'J D Book', categoryName: 'Note Books', barcode: 'BC-NBK-001', hsnCode: '4820', itemName: '4-Line English Notebook (172 Pgs)', rate: 45, openQty: 600, reorderQty: 100, purchasedQty: 200, issuedQty: 457, availableQty: 343 },
  { id: '9', shopName: 'J D Book', categoryName: 'Note Books', barcode: 'BC-NBK-002', hsnCode: '4820', itemName: '2-Line Hindi Notebook (172 Pgs)', rate: 45, openQty: 550, reorderQty: 100, purchasedQty: 150, issuedQty: 410, availableQty: 290 },
  { id: '10', shopName: 'J D Book', categoryName: 'Register', barcode: 'BC-REG-001', hsnCode: '4820', itemName: 'Practical File / Register', rate: 85, openQty: 250, reorderQty: 40, purchasedQty: 50, issuedQty: 190, availableQty: 110 }
];

let sets = [
  {
    id: '1',
    setCode: 'SET-CLS1',
    className: 'Class I',
    categoryName: 'Books & Note Books',
    setName: 'Class I Complete Academic Kit',
    noOfItems: 4,
    totalCost: 1250,
    items: [
      { itemName: 'English & Math Textbooks Bundle', qty: 1, rate: 850 },
      { itemName: 'School Diary 2026-27', qty: 1, rate: 150 },
      { itemName: '4-Line English Notebook (172 Pgs)', qty: 4, rate: 45 },
      { itemName: '2-Line Hindi Notebook (172 Pgs)', qty: 3, rate: 45 }
    ]
  },
  {
    id: '2',
    setCode: 'SET-CLS5',
    className: 'Class V',
    categoryName: 'Books & Note Books',
    setName: 'Class V Complete Book & Stationery Set',
    noOfItems: 5,
    totalCost: 1850,
    items: [
      { itemName: 'Class V NCERT & Reference Bundle', qty: 1, rate: 1350 },
      { itemName: 'School Diary 2026-27', qty: 1, rate: 150 },
      { itemName: '4-Line English Notebook (172 Pgs)', qty: 4, rate: 45 },
      { itemName: 'Practical File / Register', qty: 2, rate: 85 }
    ]
  },
  {
    id: '3',
    setCode: 'SET-UNIFORM-M',
    className: 'Class I - V',
    categoryName: 'Uniform',
    setName: 'Junior Boy Summer Uniform Pack',
    noOfItems: 3,
    totalCost: 1050,
    items: [
      { itemName: 'T Shirt- W (22)', qty: 2, rate: 300 },
      { itemName: 'Pant ( 20 )', qty: 1, rate: 450 }
    ]
  }
];

let sales = [];

let purchases = [
  {
    id: '1',
    supplierName: 'Maheshwari Garments',
    mobileNo: '9414055667',
    noOfItem: 2,
    totalCost: 37500,
    paidAmt: 35000,
    discount: 2500,
    purchaseDate: '2026-08-10',
    items: [
      { itemCode: 'BC-TSH-022', itemName: 'T Shirt- W (22)', qty: 50, rate: 300, gst: 0, total: 15000 },
      { itemCode: 'BC-PNT-020', itemName: 'Pant ( 20 )', qty: 50, rate: 450, gst: 0, total: 22500 }
    ]
  },
  {
    id: '2',
    supplierName: 'Rajasthan Stationery Mart',
    mobileNo: '9828012345',
    noOfItem: 3,
    totalCost: 31000,
    paidAmt: 30000,
    discount: 1000,
    purchaseDate: '2026-08-25',
    items: [
      { itemCode: 'BC-DIR-001', itemName: 'School Diary 2026-27', qty: 100, rate: 150, gst: 0, total: 15000 },
      { itemCode: 'BC-NBK-001', itemName: '4-Line English Notebook (172 Pgs)', qty: 200, rate: 45, gst: 0, total: 9000 },
      { itemCode: 'BC-NBK-002', itemName: '2-Line Hindi Notebook (172 Pgs)', qty: 150, rate: 45, gst: 0, total: 7000 }
    ]
  }
];

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
export const getCategories = (req, res) => res.json({ success: true, data: categories });
export const createCategory = (req, res) => {
  const { shopName, categoryName, percentage } = req.body;
  if (!categoryName) return res.status(400).json({ success: false, message: 'Category Name is required' });
  const newCat = {
    id: String(Date.now()),
    shopName: shopName || 'J D Book',
    categoryName,
    percentage: Number(percentage) || 0
  };
  categories.push(newCat);
  res.status(201).json({ success: true, data: newCat, message: 'Category created' });
};
export const deleteCategory = (req, res) => {
  categories = categories.filter(c => c.id !== req.params.id);
  res.json({ success: true, message: 'Category deleted' });
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
  const { billNo, className, name, mobileNo, shopName, noOfSets, totalCost, gst, discount, paidAmt, due, cash, bank } = req.body;
  if (!name) return res.status(400).json({ success: false, message: 'Customer name is required' });
  const newSale = {
    id: String(Date.now()),
    billNo: billNo || `SB-2026-${String(sales.length + 1).padStart(3, '0')}`,
    className: className || 'N/A',
    name,
    mobileNo: mobileNo || '',
    shopName: shopName || 'J D Book',
    type: 'Sale',
    noOfSets: Number(noOfSets) || 1,
    totalCost: Number(totalCost) || 0,
    gst: Number(gst) || 0,
    finalCost: Number(totalCost) || 0,
    cash: Number(cash) || Number(paidAmt) || 0,
    bank: Number(bank) || 0,
    discount: Number(discount) || 0,
    paidAmt: Number(paidAmt) || 0,
    due: Number(due) || 0,
    issueDate: new Date().toISOString().slice(0, 10),
    receipt: `RCP-${1000 + sales.length + 1}`
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
