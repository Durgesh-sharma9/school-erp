import React, { useState, useEffect, useMemo } from 'react';
import {
  Package,
  Search,
  Home,
  Plus,
  Trash2,
  Printer,
  FileDown,
  X,
  User,
  CheckCircle2,
  AlertCircle,
  ShoppingCart,
  Tag,
  GraduationCap,
  Calendar,
  CreditCard,
  Layers,
  ArrowRight,
  Barcode
} from 'lucide-react';
import toast from 'react-hot-toast';
import { tenantStore } from '../../services/tenantStore';

const ALL_CLASSES = [
  'Nursery', 'LKG', 'UKG',
  'Class I', 'Class II', 'Class III', 'Class IV', 'Class V',
  'Class VI', 'Class VII', 'Class VIII', 'Class IX', 'Class X',
  'Class XI', 'Class XII'
];

export function IssueItemsPage({ onNavigate }) {
  const [sales, setSales] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [inventorySets, setInventorySets] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [receiptModal, setReceiptModal] = useState(null);

  // Form State for Issue Items (POS)
  const [selectedClass, setSelectedClass] = useState('Class I');
  const [customerType, setCustomerType] = useState('STUDENT'); // 'STUDENT' | 'WALKIN'
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [payMode, setPayMode] = useState('Cash');
  const [issueDate, setIssueDate] = useState(() => new Date().toISOString().slice(0, 10));

  // Cart / Line items
  const [cartItems, setCartItems] = useState([
    { id: '1', itemId: '', itemName: '', categoryName: '', rate: '', qty: '1', total: 0 }
  ]);
  const [discount, setDiscount] = useState('');
  const [paidAmt, setPaidAmt] = useState('');
  const [isPaidCustomized, setIsPaidCustomized] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState('');

  // Auto Scan & Add Barcode to Cart
  const handleBarcodeSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const cleanCode = scannedBarcode.trim();
    if (!cleanCode) return;

    // Search inventoryItems by barcode or hsnCode
    const foundItem = inventoryItems.find(
      it => String(it.barcode || '').trim().toLowerCase() === cleanCode.toLowerCase() ||
            String(it.hsnCode || '').trim().toLowerCase() === cleanCode.toLowerCase()
    );

    if (foundItem) {
      const itemKey = `ITEM:${foundItem.id}`;
      const existingIndex = cartItems.findIndex(r => r.itemId === itemKey);

      if (existingIndex !== -1) {
        setCartItems(prev => prev.map((r, idx) => {
          if (idx === existingIndex) {
            const nextQty = (Number(r.qty) || 1) + 1;
            const rRate = Number(r.rate) || 0;
            return { ...r, qty: String(nextQty), total: nextQty * rRate };
          }
          return r;
        }));
        toast.success(`Updated quantity for "${foundItem.itemName}"`);
      } else {
        const rate = Number(foundItem.rate) || 0;
        const newRow = {
          id: String(Date.now() + Math.random()),
          itemId: itemKey,
          itemName: foundItem.itemName,
          categoryName: foundItem.categoryName || 'General',
          rate: String(rate),
          qty: '1',
          total: rate
        };

        if (cartItems.length === 1 && !cartItems[0].itemName) {
          setCartItems([newRow]);
        } else {
          setCartItems(prev => [...prev, newRow]);
        }
        toast.success(`Scanned: ${foundItem.itemName} (₹${rate}) added to bill!`);
      }
      setScannedBarcode('');
    } else {
      // Check sets by setCode
      const foundSet = inventorySets.find(
        s => String(s.setCode || '').trim().toLowerCase() === cleanCode.toLowerCase()
      );
      if (foundSet) {
        const setKey = `SET:${foundSet.id || foundSet.setCode}`;
        const rate = foundSet.totalCost || foundSet.items?.reduce((sum, it) => sum + (Number(it.rate) * Number(it.qty || 1)), 0) || 0;
        const newRow = {
          id: String(Date.now() + Math.random()),
          itemId: setKey,
          itemName: `[SET] ${foundSet.setName}`,
          categoryName: foundSet.categoryName || 'Set Bundle',
          rate: String(rate),
          qty: '1',
          total: rate
        };
        if (cartItems.length === 1 && !cartItems[0].itemName) {
          setCartItems([newRow]);
        } else {
          setCartItems(prev => [...prev, newRow]);
        }
        toast.success(`Scanned Set: ${foundSet.setName} (₹${rate}) added to bill!`);
        setScannedBarcode('');
      } else {
        toast.error(`No inventory item found for barcode "${cleanCode}"`);
      }
    }
  };

  // Load backend sales, items, sets and students
  const loadData = () => {
    // 1. Sales
    fetch('/api/stationary/sales')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) setSales(data.data);
      })
      .catch(() => {});

    // 2. Inventory Items
    fetch('/api/stationary/items')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) setInventoryItems(data.data);
      })
      .catch(() => {});

    // 3. Inventory Sets
    fetch('/api/stationary/sets')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) setInventorySets(data.data);
      })
      .catch(() => {});

    // 4. Students from Backend + Local Store
    const schoolId = localStorage.getItem('active_school_id') || 'sch_jd_intl';
    const localStds = tenantStore.getStudents(schoolId) || [];

    fetch('/api/students')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          // Merge avoiding duplicates by id
          const map = new Map();
          localStds.forEach(s => map.set(s.id || s.admNo, s));
          data.data.forEach(s => map.set(s.id || s.admNo, s));
          setStudents(Array.from(map.values()));
        } else {
          setStudents(localStds);
        }
      })
      .catch(() => {
        setStudents(localStds);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter students by selectedClass
  const filteredStudents = useMemo(() => {
    if (!selectedClass) return students;
    const cleanCls = selectedClass.toLowerCase().replace(/^class\s*/i, '').trim();
    return students.filter(s => {
      const sCls = String(s.className || '').toLowerCase().replace(/^class\s*/i, '').trim();
      return sCls === cleanCls || sCls.startsWith(cleanCls);
    });
  }, [students, selectedClass]);

  // Handle Class Change
  const handleClassChange = (newClass) => {
    setSelectedClass(newClass);
    setSelectedStudentId('');
    if (customerType === 'STUDENT') {
      setCustomerName('');
      setMobileNo('');
    }
  };

  // Handle Student Selection
  const handleStudentSelect = (studentId) => {
    setSelectedStudentId(studentId);
    if (!studentId) {
      setCustomerName('');
      setMobileNo('');
      return;
    }
    const std = students.find(s => String(s.id) === String(studentId) || String(s.admNo) === String(studentId));
    if (std) {
      const fullName = std.name || `${std.firstName || ''} ${std.lastName || ''}`.trim();
      setCustomerName(fullName);
      setMobileNo(std.fatherMobile || std.contactNo || std.smsWhatsappNo || '');
    }
  };

  // Cart item management
  const handleAddItemRow = () => {
    setCartItems(prev => [
      ...prev,
      { id: String(Date.now() + Math.random()), itemId: '', itemName: '', categoryName: '', rate: '', qty: '1', total: 0 }
    ]);
  };

  const handleRemoveItemRow = (rowId) => {
    if (cartItems.length <= 1) {
      // Just reset the row
      setCartItems([{ id: '1', itemId: '', itemName: '', categoryName: '', rate: '', qty: '1', total: 0 }]);
      return;
    }
    setCartItems(prev => prev.filter(r => r.id !== rowId));
  };

  // When an item or set is selected in a row
  const handleItemSelect = (rowId, selectedVal) => {
    // selectedVal can be "ITEM:<id>" or "SET:<id>"
    setCartItems(prev => prev.map(row => {
      if (row.id !== rowId) return row;

      if (!selectedVal) {
        return { ...row, itemId: '', itemName: '', categoryName: '', rate: '', total: 0 };
      }

      if (selectedVal.startsWith('SET:')) {
        const setId = selectedVal.replace('SET:', '');
        const foundSet = inventorySets.find(s => String(s.id) === setId || String(s.setCode) === setId);
        const rate = foundSet ? (foundSet.totalCost || foundSet.items?.reduce((sum, it) => sum + (Number(it.rate) * Number(it.qty || 1)), 0) || 0) : 0;
        const qtyNum = Number(row.qty) || 1;
        return {
          ...row,
          itemId: selectedVal,
          itemName: foundSet ? `[SET] ${foundSet.setName}` : 'Item Set',
          categoryName: foundSet?.categoryName || 'Set Bundle',
          rate: String(rate),
          total: qtyNum * rate
        };
      } else {
        const itemId = selectedVal.replace('ITEM:', '');
        const foundItem = inventoryItems.find(i => String(i.id) === itemId);
        const rate = foundItem ? (Number(foundItem.rate) || 0) : 0;
        const qtyNum = Number(row.qty) || 1;
        return {
          ...row,
          itemId: selectedVal,
          itemName: foundItem ? foundItem.itemName : '',
          categoryName: foundItem?.categoryName || 'General',
          rate: String(rate),
          total: qtyNum * rate
        };
      }
    }));
  };

  // Handle Qty or Rate edit
  const handleRowChange = (rowId, field, value) => {
    setCartItems(prev => prev.map(row => {
      if (row.id !== rowId) return row;
      const updated = { ...row, [field]: value };
      const q = field === 'qty' ? (Number(value) || 0) : (Number(row.qty) || 0);
      const r = field === 'rate' ? (Number(value) || 0) : (Number(row.rate) || 0);
      updated.total = q * r;
      return updated;
    }));
  };

  // Calculations
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, row) => acc + (Number(row.total) || 0), 0);
  }, [cartItems]);

  const discountNum = Number(discount) || 0;
  const grandTotal = Math.max(0, subtotal - discountNum);

  // Sync paidAmt with grandTotal if user hasn't explicitly customized it
  useEffect(() => {
    if (!isPaidCustomized) {
      setPaidAmt(grandTotal > 0 ? String(grandTotal) : '');
    }
  }, [grandTotal, isPaidCustomized]);

  const paidNum = paidAmt === '' ? 0 : (Number(paidAmt) || 0);
  const balanceDue = Math.max(0, grandTotal - paidNum);

  // Open Sale Modal
  const openAddModal = () => {
    setSelectedClass('Class I');
    setCustomerType('STUDENT');
    setSelectedStudentId('');
    setCustomerName('');
    setMobileNo('');
    setPayMode('Cash');
    setIssueDate(new Date().toISOString().slice(0, 10));
    setCartItems([
      { id: '1', itemId: '', itemName: '', categoryName: '', rate: '', qty: '1', total: 0 }
    ]);
    setDiscount('');
    setPaidAmt('');
    setIsPaidCustomized(false);
    setScannedBarcode('');
    setIsModalOpen(true);
  };

  // Save Sale / Issue Items
  const handleSave = async (e) => {
    e.preventDefault();
    if (!customerName.trim()) {
      toast.error('Student / Customer Name is required');
      return;
    }

    const validItems = cartItems.filter(r => r.itemName.trim() !== '');
    if (validItems.length === 0) {
      toast.error('Please select at least one item to issue');
      return;
    }

    const newSale = {
      id: String(Date.now()),
      billNo: `SB-2026-${String(sales.length + 1).padStart(3, '0')}`,
      className: selectedClass || 'N/A',
      name: customerName.trim(),
      mobileNo: mobileNo.trim(),
      shopName: 'Main Store',
      type: 'Sale',
      noOfSets: validItems.length,
      totalCost: subtotal,
      gst: 0,
      finalCost: grandTotal,
      payMode,
      discount: discountNum,
      paidAmt: paidNum,
      due: balanceDue,
      issueDate,
      receipt: `RCP-${1000 + sales.length + 1}`,
      items: validItems.map(vi => ({
        id: vi.itemId.replace(/^(ITEM|SET):/, ''),
        itemName: vi.itemName,
        categoryName: vi.categoryName,
        rate: Number(vi.rate) || 0,
        qty: Number(vi.qty) || 1,
        total: Number(vi.total) || 0
      }))
    };

    try {
      const res = await fetch('/api/stationary/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSale)
      });
      const d = await res.json();
      if (d.success) {
        setSales(prev => [d.data || newSale, ...prev]);
        toast.success('Items issued and bill generated successfully!');
        setIsModalOpen(false);
        setReceiptModal(d.data || newSale);
        loadData(); // reload inventory to show deducted stock
      } else {
        toast.error(d.message || 'Failed to record sale');
      }
    } catch {
      // Offline fallback
      setSales(prev => [newSale, ...prev]);
      toast.success('Items issued and bill recorded locally');
      setIsModalOpen(false);
      setReceiptModal(newSale);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this sale record?')) {
      setSales(prev => prev.filter(s => s.id !== id));
      toast.success('Sale record removed');
      fetch(`/api/stationary/sales/${id}`, { method: 'DELETE' }).catch(() => {});
    }
  };

  const filteredSales = sales.filter(s =>
    (s.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.billNo || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.className || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.mobileNo || '').includes(searchQuery)
  );

  const exportCSV = () => {
    const headers = ['S.NO.', 'BILL NO', 'DATE', 'CLASS', 'STUDENT NAME', 'ITEMS COUNT', 'TOTAL (₹)', 'DISCOUNT (₹)', 'PAID (₹)', 'DUE (₹)', 'PAY MODE', 'RECEIPT'];
    const rows = filteredSales.map((s, idx) => [
      idx + 1,
      `"${s.billNo}"`,
      `"${s.issueDate || ''}"`,
      `"${s.className}"`,
      `"${s.name}"`,
      s.noOfSets || s.items?.length || 1,
      s.totalCost,
      s.discount,
      s.paidAmt,
      s.due,
      `"${s.payMode || 'Cash'}"`,
      `"${s.receipt}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Stationary_Issue_Items_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 text-slate-800">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate?.('/dashboard')}
            className="text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1 text-sm font-medium"
          >
            <Home className="w-4 h-4" />
            Home
          </button>
          <span className="text-slate-400">/</span>
          <span className="text-slate-500 text-sm font-medium">Stationary</span>
          <span className="text-slate-400">/</span>
          <span className="text-indigo-600 text-sm font-semibold">Issue Items (POS)</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-sm transition-all"
          >
            <FileDown className="w-3.5 h-3.5 text-emerald-600" />
            CSV Export
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-sm transition-all"
          >
            <Printer className="w-3.5 h-3.5 text-blue-600" />
            Print
          </button>
          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all"
          >
            <ShoppingCart className="w-4 h-4" />
            + New Item Sale / Issue
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Search */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by student name, bill no, class, mobile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-800">{filteredSales.length}</strong> of <strong className="text-slate-800">{sales.length}</strong> Issue Bills
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3 text-center w-12">S.No.</th>
                <th className="py-3 px-3">Bill No</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Class</th>
                <th className="py-3 px-4">Student / Customer</th>
                <th className="py-3 px-3 text-center">Items</th>
                <th className="py-3 px-3 text-right">Total (₹)</th>
                <th className="py-3 px-3 text-right">Paid (₹)</th>
                <th className="py-3 px-3 text-right">Due (₹)</th>
                <th className="py-3 px-3 text-center">Receipt</th>
                <th className="py-3 px-3 text-center w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSales.length > 0 ? (
                filteredSales.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 text-center font-medium text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <span className="font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-bold text-[11px]">
                        {s.billNo}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                      {s.issueDate || '—'}
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                        {s.className}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800">{s.name}</div>
                      {s.mobileNo && <div className="text-[11px] text-slate-400">{s.mobileNo}</div>}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700">
                        {s.items?.length || s.noOfSets || 1} Items
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-semibold text-slate-700">₹{s.totalCost}</td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-700">₹{s.paidAmt}</td>
                    <td className="py-3 px-3 text-right">
                      {s.due > 0 ? (
                        <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                          ₹{s.due}
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-semibold text-[11px]">Paid</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-[11px] text-slate-500">
                      {s.receipt}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setReceiptModal(s)}
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="View / Print Receipt"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    <Package className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    No item issuance records found. Click "+ New Item Sale / Issue" to start.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL: ISSUE ITEMS (POS) ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto border border-slate-200 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50 sticky top-0 z-20">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                  <ShoppingCart className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Issue Items & Generate Bill (POS)</h3>
                  <p className="text-[11px] text-slate-500">Select class, student, items, and auto-calculate total with discount</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-4 text-xs flex-1">
              {/* STEP 1: CLASS & STUDENT SELECTION */}
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wide text-[11px]">
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                    1. Select Class & Student
                  </span>
                  {/* Customer Type Toggle */}
                  <div className="flex rounded-lg border border-slate-200 bg-white p-0.5 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setCustomerType('STUDENT')}
                      className={`px-2.5 py-1 rounded-md font-semibold transition ${
                        customerType === 'STUDENT'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-800'
                      }`}
                    >
                      Enrolled Student
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCustomerType('WALKIN');
                        setSelectedStudentId('');
                      }}
                      className={`px-2.5 py-1 rounded-md font-semibold transition ${
                        customerType === 'WALKIN'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-800'
                      }`}
                    >
                      Walk-in / Custom
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Class Dropdown */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Class <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={selectedClass}
                      onChange={(e) => handleClassChange(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white font-medium"
                      required
                    >
                      {ALL_CLASSES.map(cls => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))}
                    </select>
                  </div>

                  {/* Student Dropdown (Filtered to Selected Class) */}
                  {customerType === 'STUDENT' ? (
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Select Student ({filteredStudents.length} available) <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={selectedStudentId}
                        onChange={(e) => handleStudentSelect(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                        required
                      >
                        <option value="">Choose Student from {selectedClass}...</option>
                        {filteredStudents.map(std => {
                          const sName = std.name || `${std.firstName || ''} ${std.lastName || ''}`.trim();
                          const roll = std.rollNo && std.rollNo !== '0' ? `Roll #${std.rollNo}` : '';
                          const adm = std.admNo ? `Adm: ${std.admNo}` : '';
                          const tag = [roll, adm].filter(Boolean).join(', ');
                          return (
                            <option key={std.id || std.admNo} value={std.id || std.admNo}>
                              {sName} {tag ? `(${tag})` : ''}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Student / Customer Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter full name..."
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                        required
                      />
                    </div>
                  )}

                  {/* Mobile No */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Mobile No
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 9829012345"
                      value={mobileNo}
                      onChange={(e) => setMobileNo(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                    />
                  </div>
                </div>

                {/* Selected Student Confirmation Pill */}
                {customerType === 'STUDENT' && customerName && (
                  <div className="flex items-center gap-2 bg-indigo-50/80 border border-indigo-200/80 px-3 py-1.5 rounded-lg text-indigo-900 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                    <span>Selected: <strong>{customerName}</strong> ({selectedClass}) {mobileNo ? `• Mobile: ${mobileNo}` : ''}</span>
                  </div>
                )}
              </div>

              {/* STEP 2: ITEMS SELECTION (AUTO PRICE & QUANTITY) */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wide text-[11px]">
                    <Package className="w-3.5 h-3.5 text-indigo-600" />
                    2. Select Items to Issue / Sell
                  </span>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/60 px-2.5 py-1 rounded-lg flex items-center gap-1 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    + Add Another Item
                  </button>
                </div>

                {/* Instant Barcode Scanner Input */}
                <div className="p-2.5 bg-indigo-50/70 border border-indigo-200 rounded-xl flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
                    <Barcode className="w-4 h-4" />
                  </div>
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Scan item barcode with handheld scanner or type barcode (e.g. BC-674347)..."
                      value={scannedBarcode}
                      onChange={(e) => setScannedBarcode(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleBarcodeSubmit();
                        }
                      }}
                      className="w-full pl-3 pr-24 py-1.5 text-xs rounded-lg border border-indigo-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono placeholder:font-sans placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={handleBarcodeSubmit}
                      className="absolute right-1 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-md shadow-2xs transition"
                    >
                      Scan / Add
                    </button>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3">Item / Set Name</th>
                        <th className="py-2 px-3 w-28 text-right">Unit Price (₹)</th>
                        <th className="py-2 px-3 w-24 text-center">Quantity</th>
                        <th className="py-2 px-3 w-28 text-right">Total (₹)</th>
                        <th className="py-2 px-2 text-center w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {cartItems.map((row, idx) => (
                        <tr key={row.id} className="hover:bg-slate-50/50">
                          {/* Item Dropdown */}
                          <td className="py-2 px-3">
                            <select
                              value={row.itemId}
                              onChange={(e) => handleItemSelect(row.id, e.target.value)}
                              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                              required
                            >
                              <option value="">Select Item or Set...</option>

                              {/* Inventory Sets */}
                              {inventorySets.length > 0 && (
                                <optgroup label="📦 Pre-configured Sets (Bundles)">
                                  {inventorySets.map(st => (
                                    <option key={st.id || st.setCode} value={`SET:${st.id || st.setCode}`}>
                                      [SET] {st.setName} ({st.className}) — ₹{st.totalCost || 0}
                                    </option>
                                  ))}
                                </optgroup>
                              )}

                              {/* Individual Items */}
                              <optgroup label="📚 Individual Inventory Items">
                                {inventoryItems.map(it => (
                                  <option key={it.id} value={`ITEM:${it.id}`}>
                                    {it.itemName} ({it.categoryName || 'General'}) — ₹{it.rate} [Stock: {it.availableQty ?? it.openQty ?? 0}]
                                  </option>
                                ))}
                              </optgroup>
                            </select>
                          </td>

                          {/* Unit Rate (Auto-filled, but editable if needed) */}
                          <td className="py-2 px-3 text-right">
                            <input
                              type="number"
                              min="0"
                              placeholder="0"
                              value={row.rate}
                              onFocus={(e) => e.target.select()}
                              onChange={(e) => handleRowChange(row.id, 'rate', e.target.value)}
                              className="w-full text-right px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            />
                          </td>

                          {/* Qty */}
                          <td className="py-2 px-3 text-center">
                            <input
                              type="number"
                              min="1"
                              placeholder="1"
                              value={row.qty}
                              onFocus={(e) => e.target.select()}
                              onChange={(e) => handleRowChange(row.id, 'qty', e.target.value)}
                              className="w-full text-center px-2 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-semibold"
                            />
                          </td>

                          {/* Row Total */}
                          <td className="py-2 px-3 text-right font-bold text-slate-800">
                            ₹{row.total}
                          </td>

                          {/* Remove button */}
                          <td className="py-2 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveItemRow(row.id)}
                              className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-slate-100 transition"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* STEP 3: BILLING, DISCOUNT & PAYMENT SUMMARY */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <span className="font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wide text-[11px]">
                  <CreditCard className="w-3.5 h-3.5 text-indigo-600" />
                  3. Payment, Discount & Final Billing
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Subtotal */}
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Subtotal (₹)</label>
                    <div className="px-3 py-2 bg-white rounded-lg border border-slate-200 font-bold text-slate-800 text-sm">
                      ₹{subtotal}
                    </div>
                  </div>

                  {/* Discount */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Discount (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={discount}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => setDiscount(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white font-semibold text-emerald-700"
                    />
                  </div>

                  {/* Grand Total */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Grand Total (₹)</label>
                    <div className="px-3 py-2 bg-indigo-50 rounded-lg border border-indigo-200 font-extrabold text-indigo-900 text-sm">
                      ₹{grandTotal}
                    </div>
                  </div>

                  {/* Payment Mode */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Payment Mode</label>
                    <select
                      value={payMode}
                      onChange={(e) => setPayMode(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white font-medium"
                    >
                      <option value="Cash">Cash</option>
                      <option value="UPI / QR">UPI / QR</option>
                      <option value="Online">Online</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Cheque">Cheque</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-200/60">
                  {/* Paid Amount */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-semibold text-slate-700">Paid Amount (₹)</label>
                      <button
                        type="button"
                        onClick={() => {
                          setPaidAmt(String(grandTotal));
                          setIsPaidCustomized(false);
                        }}
                        className="text-[10px] text-indigo-600 font-bold hover:underline"
                      >
                        Full Paid (₹{grandTotal})
                      </button>
                    </div>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={paidAmt}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => {
                        setIsPaidCustomized(true);
                        setPaidAmt(e.target.value);
                      }}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white font-bold text-slate-800"
                    />
                  </div>

                  {/* Balance / Due */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Balance / Due (₹)</label>
                    <div className={`px-3 py-2 rounded-lg border font-extrabold text-sm flex items-center justify-between ${
                      balanceDue > 0
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      <span>₹{balanceDue}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        {balanceDue > 0 ? 'Payment Due' : 'Fully Settled'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 sticky bottom-0 bg-white z-10 pb-1">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Issue Items & Save Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: SALE RECEIPT (PRINTABLE INVOICE) ================= */}
      {receiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 p-6 space-y-4 print:p-0 print:border-none print:shadow-none">
            {/* Receipt Header */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <h4 className="font-extrabold text-slate-900 text-base tracking-wide">J D INTERNATIONAL SCHOOL</h4>
                <p className="text-[11px] text-slate-500">Academic Stationery, Books & Uniform Invoice</p>
                <div className="text-[11px] font-mono font-bold text-indigo-700 mt-0.5">
                  Bill No: {receiptModal.billNo} • Receipt: {receiptModal.receipt}
                </div>
              </div>
              <button
                onClick={() => setReceiptModal(null)}
                className="text-slate-400 hover:text-slate-600 print:hidden p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Student & Date Info */}
            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <div>
                <span className="text-slate-500">Student / Customer:</span>
                <div className="font-bold text-slate-800">{receiptModal.name}</div>
              </div>
              <div>
                <span className="text-slate-500">Class:</span>
                <div className="font-bold text-slate-800">{receiptModal.className}</div>
              </div>
              <div>
                <span className="text-slate-500">Date:</span>
                <div className="font-medium text-slate-700">{receiptModal.issueDate || new Date().toISOString().slice(0, 10)}</div>
              </div>
              <div>
                <span className="text-slate-500">Payment Mode:</span>
                <div className="font-medium text-slate-700">{receiptModal.payMode || 'Cash'}</div>
              </div>
            </div>

            {/* Itemized Table */}
            {Array.isArray(receiptModal.items) && receiptModal.items.length > 0 && (
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-1.5 px-3">Item</th>
                      <th className="py-1.5 px-2 text-center">Qty</th>
                      <th className="py-1.5 px-2 text-right">Rate</th>
                      <th className="py-1.5 px-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {receiptModal.items.map((it, i) => (
                      <tr key={i}>
                        <td className="py-1.5 px-3 font-medium text-slate-800">{it.itemName}</td>
                        <td className="py-1.5 px-2 text-center text-slate-600">{it.qty}</td>
                        <td className="py-1.5 px-2 text-right text-slate-600">₹{it.rate}</td>
                        <td className="py-1.5 px-3 text-right font-semibold text-slate-800">₹{it.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Financial Summary */}
            <div className="space-y-1.5 text-xs pt-1 border-t border-slate-100">
              <div className="flex justify-between text-slate-600">
                <span>Total Amount:</span>
                <span className="font-semibold text-slate-800">₹{receiptModal.totalCost}</span>
              </div>
              {receiptModal.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Discount:</span>
                  <span>- ₹{receiptModal.discount}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-800 font-bold border-t border-slate-200 pt-1">
                <span>Grand Total:</span>
                <span>₹{receiptModal.finalCost ?? receiptModal.totalCost}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Paid Amount:</span>
                <span>₹{receiptModal.paidAmt}</span>
              </div>
              <div className="flex justify-between font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded">
                <span>Balance Due:</span>
                <span>₹{receiptModal.due}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 print:hidden">
              <button
                type="button"
                onClick={() => setReceiptModal(null)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 flex items-center gap-1.5 shadow-sm transition"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default IssueItemsPage;
