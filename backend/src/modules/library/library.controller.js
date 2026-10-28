// In-memory multi-tenant store for Library Module

let authors = [
  { id: '1', name: 'R.D. Sharma', createdAt: '2026-01-10' },
  { id: '2', name: 'H.C. Verma', createdAt: '2026-01-12' },
  { id: '3', name: 'Munshi Premchand', createdAt: '2026-01-15' },
  { id: '4', name: 'William Shakespeare', createdAt: '2026-01-20' },
  { id: '5', name: 'Dr. A.P.J. Abdul Kalam', createdAt: '2026-02-01' },
  { id: '6', name: 'Ruskin Bond', createdAt: '2026-02-10' }
];

let publications = [
  { id: '1', name: 'NCERT New Delhi', createdAt: '2026-01-10' },
  { id: '2', name: 'Dhanpat Rai Publications', createdAt: '2026-01-12' },
  { id: '3', name: 'Bharati Bhawan', createdAt: '2026-01-15' },
  { id: '4', name: 'Oxford University Press', createdAt: '2026-01-18' },
  { id: '5', name: 'Penguin Random House', createdAt: '2026-02-05' },
  { id: '6', name: 'S. Chand Publishing', createdAt: '2026-02-12' }
];

let categories = [
  { id: '1', name: 'Mathematics', createdAt: '2026-01-10' },
  { id: '2', name: 'Physics & Science', createdAt: '2026-01-10' },
  { id: '3', name: 'Literature & Fiction', createdAt: '2026-01-15' },
  { id: '4', name: 'Social Studies & History', createdAt: '2026-01-15' },
  { id: '5', name: 'General Knowledge & Biography', createdAt: '2026-02-01' },
  { id: '6', name: 'Computer Science & AI', createdAt: '2026-02-10' }
];

let fineSettings = {
  finePerDay: 5,
  gracePeriodDays: 2,
  maxFineLimit: 200,
  updatedAt: '2026-03-01'
};

let suppliers = [
  {
    id: '1',
    name: 'Goyal Book Depot',
    mobile: '9829012345',
    gstNo: '08AAAAA0000A1Z5',
    aadhaarNo: '456789123456',
    panNo: 'ABCDE1234F',
    address: 'Shop No. 14, Chaura Rasta',
    city: 'Jaipur',
    pincode: '302003',
    remark: 'Authorized NCERT and CBSE distributor'
  },
  {
    id: '2',
    name: 'National Book House',
    mobile: '9414055667',
    gstNo: '08BBBBB1111B2Z6',
    aadhaarNo: '789012345678',
    panNo: 'FGHIJ5678K',
    address: 'Near City Plaza, Tonk Road',
    city: 'Jaipur',
    pincode: '302015',
    remark: 'Specialist in reference books and olympiad material'
  },
  {
    id: '3',
    name: 'Vikas Book Store',
    mobile: '9828033445',
    gstNo: '08CCCCC2222C3Z7',
    aadhaarNo: '234567890123',
    panNo: 'KLMNO9012P',
    address: 'Opp. Maharaja College, JLN Marg',
    city: 'Jaipur',
    pincode: '302004',
    remark: 'College and senior secondary level reference supplier'
  }
];

let books = [
  {
    id: '1',
    bookNo: 'BK-1001',
    barcode: '890123450001',
    title: 'Mathematics Class X Exemplar',
    author: 'R.D. Sharma',
    publication: 'Dhanpat Rai Publications',
    category: 'Mathematics',
    edition: '2026 Revised',
    volume: 'Vol 1',
    className: 'Class X',
    subject: 'Mathematics',
    openQty: 30,
    reOrderLevel: 5,
    rate: 450,
    remark: 'Standard curriculum reference textbook',
    eBooks: { pdfUrl: 'https://ncert.nic.in/exemplar/math-10.pdf', audioUrl: '', videoUrl: '' },
    availableQty: 24,
    issuedQty: 5,
    damagedQty: 1
  },
  {
    id: '2',
    bookNo: 'BK-1002',
    barcode: '890123450002',
    title: 'Concepts of Physics Part 1',
    author: 'H.C. Verma',
    publication: 'Bharati Bhawan',
    category: 'Physics & Science',
    edition: '2025-26',
    volume: 'Part I',
    className: 'Class XI',
    subject: 'Physics',
    openQty: 25,
    reOrderLevel: 5,
    rate: 520,
    remark: 'Recommended for Senior Secondary physics',
    eBooks: { pdfUrl: 'https://bharatibhawan.in/hcv-part1.pdf', audioUrl: '', videoUrl: '' },
    availableQty: 20,
    issuedQty: 4,
    damagedQty: 1
  },
  {
    id: '3',
    bookNo: 'BK-1003',
    barcode: '890123450003',
    title: 'Godaan (गोदान)',
    author: 'Munshi Premchand',
    publication: 'NCERT New Delhi',
    category: 'Literature & Fiction',
    edition: '2024 Classic Edition',
    volume: 'Complete',
    className: 'Class IX',
    subject: 'Hindi',
    openQty: 20,
    reOrderLevel: 4,
    rate: 180,
    remark: 'Hindi literature syllabus novel',
    eBooks: { pdfUrl: 'https://ncert.nic.in/hindi/godaan.pdf', audioUrl: '', videoUrl: '' },
    availableQty: 16,
    issuedQty: 3,
    damagedQty: 1
  },
  {
    id: '4',
    bookNo: 'BK-1004',
    barcode: '890123450004',
    title: 'Wings of Fire',
    author: 'Dr. A.P.J. Abdul Kalam',
    publication: 'Penguin Random House',
    category: 'General Knowledge & Biography',
    edition: 'Special Illustrated',
    volume: 'Autobiography',
    className: 'Class VIII',
    subject: 'General Reading',
    openQty: 15,
    reOrderLevel: 3,
    rate: 299,
    remark: 'Inspirational biography for library reading corner',
    eBooks: { pdfUrl: 'https://penguin.co.in/wings-of-fire.pdf', audioUrl: '', videoUrl: '' },
    availableQty: 12,
    issuedQty: 3,
    damagedQty: 0
  },
  {
    id: '5',
    bookNo: 'BK-1005',
    barcode: '890123450005',
    title: 'Python & AI for Secondary Students',
    author: 'Ruskin Bond',
    publication: 'Oxford University Press',
    category: 'Computer Science & AI',
    edition: '2026 Edition 2.0',
    volume: 'Vol 1',
    className: 'Class X',
    subject: 'Computer Applications',
    openQty: 35,
    reOrderLevel: 6,
    rate: 380,
    remark: 'Skill subject textbook with practical code labs',
    eBooks: { pdfUrl: 'https://oup.com/secondary/cs-ai.pdf', audioUrl: '', videoUrl: '' },
    availableQty: 31,
    issuedQty: 4,
    damagedQty: 0
  }
];

let issues = [];

let returns = [
  {
    id: '1',
    studentName: 'ANSHUMAN JOSHI',
    className: 'Class VI-A',
    actualReturnDate: '2026-10-14',
    noOfBooks: 1,
    books: [
      {
        bookNo: 'BK-1001',
        bookTitle: 'Mathematics Class X Exemplar',
        issueDate: '2026-09-25',
        dueDate: '2026-10-09',
        overdueDays: 5,
        fineAmount: 25,
        discount: 5,
        paidFine: 20,
        returnStatus: 'Returned on Time'
      }
    ],
    totalFine: 25,
    paidFine: 20
  },
  {
    id: '2',
    studentName: 'DEVENDRA SINGH',
    className: 'Class VIII-B',
    actualReturnDate: '2026-10-12',
    noOfBooks: 1,
    books: [
      {
        bookNo: 'BK-1004',
        bookTitle: 'Wings of Fire',
        issueDate: '2026-09-28',
        dueDate: '2026-10-12',
        overdueDays: 0,
        fineAmount: 0,
        discount: 0,
        paidFine: 0,
        returnStatus: 'Returned on Time'
      }
    ],
    totalFine: 0,
    paidFine: 0
  }
];

let purchases = [
  {
    id: '1',
    supplierName: 'Goyal Book Depot',
    city: 'Jaipur',
    mobileNo: '9829012345',
    purchaseDate: '2026-08-15',
    billNo: 'GBD/2026/892',
    billDate: '2026-08-15',
    gstRate: 5,
    quantity: 50,
    rate: 450,
    total: 22500,
    items: [
      { bookTitle: 'Mathematics Class X Exemplar', qty: 30, rate: 450, amount: 13500 },
      { bookTitle: 'Concepts of Physics Part 1', qty: 20, rate: 450, amount: 9000 }
    ]
  },
  {
    id: '2',
    supplierName: 'National Book House',
    city: 'Jaipur',
    mobileNo: '9414055667',
    purchaseDate: '2026-09-02',
    billNo: 'NBH/SEP/104',
    billDate: '2026-09-01',
    gstRate: 0,
    quantity: 35,
    rate: 260,
    total: 9100,
    items: [
      { bookTitle: 'Godaan (गोदान)', qty: 20, rate: 180, amount: 3600 },
      { bookTitle: 'Wings of Fire', qty: 15, rate: 299, amount: 4485 }
    ]
  },
  {
    id: '3',
    supplierName: 'Vikas Book Store',
    city: 'Jaipur',
    mobileNo: '9828033445',
    purchaseDate: '2026-09-18',
    billNo: 'VBS/2026/341',
    billDate: '2026-09-18',
    gstRate: 5,
    quantity: 35,
    rate: 380,
    total: 13300,
    items: [
      { bookTitle: 'Python & AI for Secondary Students', qty: 35, rate: 380, amount: 13300 }
    ]
  }
];

let damagedBooks = [
  {
    id: '1',
    bookNo: 'BK-1001',
    bookTitle: 'Mathematics Class X Exemplar',
    author: 'R.D. Sharma',
    publication: 'Dhanpat Rai Publications',
    damagedQty: 1,
    currentQty: 24,
    damageDate: '2026-09-28',
    reason: 'Water spill during monsoon library leakage',
    remark: 'Sent for binding restoration or scrap'
  },
  {
    id: '2',
    bookNo: 'BK-1002',
    bookTitle: 'Concepts of Physics Part 1',
    author: 'H.C. Verma',
    publication: 'Bharati Bhawan',
    damagedQty: 1,
    currentQty: 20,
    damageDate: '2026-10-02',
    reason: 'Pages 120-145 torn and spine detached',
    remark: 'Replaced with reserve stock'
  },
  {
    id: '3',
    bookNo: 'BK-1003',
    bookTitle: 'Godaan (गोदान)',
    author: 'Munshi Premchand',
    publication: 'NCERT New Delhi',
    damagedQty: 1,
    currentQty: 16,
    damageDate: '2026-10-06',
    reason: 'Cover page missing & ink stains',
    remark: 'Logged in damaged register'
  }
];

// --- AUTHORS ---
export const getAuthors = (req, res) => {
  res.json({ success: true, data: authors });
};

export const createAuthor = (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ success: false, message: 'Author name is required' });
  const newAuthor = {
    id: String(Date.now()),
    name,
    createdAt: new Date().toISOString().split('T')[0]
  };
  authors.push(newAuthor);
  res.status(201).json({ success: true, data: newAuthor, message: 'Author added successfully' });
};

export const deleteAuthor = (req, res) => {
  const { id } = req.params;
  authors = authors.filter(a => a.id !== id);
  res.json({ success: true, message: 'Author deleted successfully' });
};

// --- PUBLICATIONS ---
export const getPublications = (req, res) => {
  res.json({ success: true, data: publications });
};

export const createPublication = (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ success: false, message: 'Publication name is required' });
  const newPub = {
    id: String(Date.now()),
    name,
    createdAt: new Date().toISOString().split('T')[0]
  };
  publications.push(newPub);
  res.status(201).json({ success: true, data: newPub, message: 'Publication added successfully' });
};

export const deletePublication = (req, res) => {
  const { id } = req.params;
  publications = publications.filter(p => p.id !== id);
  res.json({ success: true, message: 'Publication deleted successfully' });
};

// --- CATEGORIES ---
export const getCategories = (req, res) => {
  res.json({ success: true, data: categories });
};

export const createCategory = (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ success: false, message: 'Category name is required' });
  const newCat = {
    id: String(Date.now()),
    name,
    createdAt: new Date().toISOString().split('T')[0]
  };
  categories.push(newCat);
  res.status(201).json({ success: true, data: newCat, message: 'Category added successfully' });
};

export const deleteCategory = (req, res) => {
  const { id } = req.params;
  categories = categories.filter(c => c.id !== id);
  res.json({ success: true, message: 'Category deleted successfully' });
};

// --- FINE SETTINGS ---
export const getFineSettings = (req, res) => {
  res.json({ success: true, data: fineSettings });
};

export const updateFineSettings = (req, res) => {
  const { finePerDay, gracePeriodDays, maxFineLimit } = req.body;
  fineSettings = {
    ...fineSettings,
    finePerDay: Number(finePerDay) || fineSettings.finePerDay,
    gracePeriodDays: Number(gracePeriodDays) || fineSettings.gracePeriodDays,
    maxFineLimit: Number(maxFineLimit) || fineSettings.maxFineLimit,
    updatedAt: new Date().toISOString().split('T')[0]
  };
  res.json({ success: true, data: fineSettings, message: 'Fine settings updated successfully' });
};

// --- SUPPLIERS ---
export const getSuppliers = (req, res) => {
  res.json({ success: true, data: suppliers });
};

export const createSupplier = (req, res) => {
  const { name, mobile, gstNo, aadhaarNo, panNo, address, city, pincode, remark } = req.body;
  if (!name || !mobile) {
    return res.status(400).json({ success: false, message: 'Supplier name and mobile are required' });
  }
  const newSupplier = {
    id: String(Date.now()),
    name,
    mobile,
    gstNo: gstNo || '',
    aadhaarNo: aadhaarNo || '',
    panNo: panNo || '',
    address: address || '',
    city: city || 'Jaipur',
    pincode: pincode || '',
    remark: remark || ''
  };
  suppliers.push(newSupplier);
  res.status(201).json({ success: true, data: newSupplier, message: 'Supplier created successfully' });
};

export const deleteSupplier = (req, res) => {
  const { id } = req.params;
  suppliers = suppliers.filter(s => s.id !== id);
  res.json({ success: true, message: 'Supplier deleted successfully' });
};

// --- BOOKS CATALOG ---
export const getBooks = (req, res) => {
  res.json({ success: true, data: books });
};

export const createBook = (req, res) => {
  const { bookNo, barcode, title, author, publication, category, edition, volume, className, subject, openQty, reOrderLevel, rate, remark, eBooks } = req.body;
  if (!bookNo || !title) {
    return res.status(400).json({ success: false, message: 'Book No and Title are required' });
  }
  const qty = Number(openQty) || 1;
  const newBook = {
    id: String(Date.now()),
    bookNo,
    barcode: barcode || `BC-${Date.now().toString().slice(-6)}`,
    title,
    author: author || 'General',
    publication: publication || 'General',
    category: category || 'General',
    edition: edition || '1st Edition',
    volume: volume || 'Vol 1',
    className: className || 'All',
    subject: subject || 'General',
    openQty: qty,
    reOrderLevel: Number(reOrderLevel) || 5,
    rate: Number(rate) || 0,
    remark: remark || '',
    eBooks: eBooks || { pdfUrl: '', audioUrl: '', videoUrl: '' },
    availableQty: qty,
    issuedQty: 0,
    damagedQty: 0
  };
  books.push(newBook);
  res.status(201).json({ success: true, data: newBook, message: 'Book added to catalog successfully' });
};

export const deleteBook = (req, res) => {
  const { id } = req.params;
  books = books.filter(b => b.id !== id);
  res.json({ success: true, message: 'Book deleted successfully' });
};

// --- ISSUES ---
export const getIssues = (req, res) => {
  res.json({ success: true, data: issues });
};

export const createIssue = (req, res) => {
  const { srNo, memberType, memberName, className, bookNo, bookTitle, qty, issueDate, returnDate, contactNo } = req.body;
  if (!memberName || !bookTitle) {
    return res.status(400).json({ success: false, message: 'Member and Book are required' });
  }
  const issueQty = Number(qty) || 1;
  const newIssue = {
    id: String(Date.now()),
    srNo: srNo || 'N/A',
    memberType: memberType || 'Student',
    memberName,
    className: className || 'N/A',
    bookNo: bookNo || 'BK-GEN',
    bookTitle,
    qty: issueQty,
    issueDate: issueDate || new Date().toISOString().split('T')[0],
    returnDate: returnDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    status: 'Issued',
    contactNo: contactNo || ''
  };
  issues.push(newIssue);

  // Update book available qty
  const targetBook = books.find(b => b.bookNo === bookNo || b.title === bookTitle);
  if (targetBook) {
    targetBook.availableQty = Math.max(0, targetBook.availableQty - issueQty);
    targetBook.issuedQty += issueQty;
  }

  res.status(201).json({ success: true, data: newIssue, message: 'Book issued successfully' });
};

export const deleteIssue = (req, res) => {
  const { id } = req.params;
  issues = issues.filter(i => i.id !== id);
  res.json({ success: true, message: 'Issue record deleted' });
};

// --- RETURNS ---
export const getReturns = (req, res) => {
  res.json({ success: true, data: returns });
};

export const createReturn = (req, res) => {
  const { studentName, className, actualReturnDate, noOfBooks, books: returnedBooksList, totalFine, paidFine } = req.body;
  if (!studentName || !returnedBooksList || returnedBooksList.length === 0) {
    return res.status(400).json({ success: false, message: 'Student and return book details are required' });
  }
  const newReturn = {
    id: String(Date.now()),
    studentName,
    className: className || 'General',
    actualReturnDate: actualReturnDate || new Date().toISOString().split('T')[0],
    noOfBooks: Number(noOfBooks) || returnedBooksList.length,
    books: returnedBooksList,
    totalFine: Number(totalFine) || 0,
    paidFine: Number(paidFine) || 0
  };
  returns.push(newReturn);

  // Return book to stock and update issue status
  returnedBooksList.forEach(rb => {
    const book = books.find(b => b.bookNo === rb.bookNo || b.title === rb.bookTitle);
    if (book) {
      book.availableQty += 1;
      book.issuedQty = Math.max(0, book.issuedQty - 1);
    }
    const issueIdx = issues.findIndex(i => i.bookNo === rb.bookNo && (i.memberName.toLowerCase().includes(studentName.toLowerCase()) || i.status !== 'Returned'));
    if (issueIdx !== -1) {
      issues[issueIdx].status = 'Returned';
    }
  });

  res.status(201).json({ success: true, data: newReturn, message: 'Books returned successfully' });
};

// --- PURCHASES ---
export const getPurchases = (req, res) => {
  res.json({ success: true, data: purchases });
};

export const createPurchase = (req, res) => {
  const { supplierName, city, mobileNo, purchaseDate, billNo, billDate, gstRate, quantity, rate, total, items } = req.body;
  if (!supplierName || !billNo) {
    return res.status(400).json({ success: false, message: 'Supplier Name and Bill No are required' });
  }
  const newPurchase = {
    id: String(Date.now()),
    supplierName,
    city: city || 'Jaipur',
    mobileNo: mobileNo || '',
    purchaseDate: purchaseDate || new Date().toISOString().split('T')[0],
    billNo,
    billDate: billDate || purchaseDate || new Date().toISOString().split('T')[0],
    gstRate: Number(gstRate) || 0,
    quantity: Number(quantity) || 1,
    rate: Number(rate) || 0,
    total: Number(total) || 0,
    items: items || []
  };
  purchases.push(newPurchase);

  // If purchase items exist, update book openQty and availableQty
  if (items && items.length > 0) {
    items.forEach(item => {
      const b = books.find(book => book.title.toLowerCase() === (item.bookTitle || '').toLowerCase());
      if (b) {
        b.openQty += Number(item.qty) || 0;
        b.availableQty += Number(item.qty) || 0;
      }
    });
  }

  res.status(201).json({ success: true, data: newPurchase, message: 'Purchase recorded and inventory updated' });
};

export const deletePurchase = (req, res) => {
  const { id } = req.params;
  purchases = purchases.filter(p => p.id !== id);
  res.json({ success: true, message: 'Purchase record deleted' });
};

// --- DAMAGED BOOKS ---
export const getDamagedBooks = (req, res) => {
  res.json({ success: true, data: damagedBooks });
};

export const createDamagedBook = (req, res) => {
  const { bookNo, bookTitle, author, publication, damagedQty, damageDate, reason, remark } = req.body;
  if (!bookNo && !bookTitle) {
    return res.status(400).json({ success: false, message: 'Book No or Book Title is required' });
  }
  const dQty = Number(damagedQty) || 1;
  const targetBook = books.find(b => b.bookNo === bookNo || b.title === bookTitle);

  const newDamaged = {
    id: String(Date.now()),
    bookNo: targetBook ? targetBook.bookNo : (bookNo || 'BK-CUSTOM'),
    bookTitle: targetBook ? targetBook.title : (bookTitle || 'Untitled Book'),
    author: targetBook ? targetBook.author : (author || 'General'),
    publication: targetBook ? targetBook.publication : (publication || 'General'),
    damagedQty: dQty,
    currentQty: targetBook ? targetBook.availableQty : 0,
    damageDate: damageDate || new Date().toISOString().split('T')[0],
    reason: reason || 'General wear and tear',
    remark: remark || ''
  };
  damagedBooks.push(newDamaged);

  if (targetBook) {
    targetBook.availableQty = Math.max(0, targetBook.availableQty - dQty);
    targetBook.damagedQty = (targetBook.damagedQty || 0) + dQty;
  }

  res.status(201).json({ success: true, data: newDamaged, message: 'Damaged book record logged' });
};

export const deleteDamagedBook = (req, res) => {
  const { id } = req.params;
  damagedBooks = damagedBooks.filter(d => d.id !== id);
  res.json({ success: true, message: 'Damaged book entry deleted' });
};
