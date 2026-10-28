import React, { useState, useMemo } from 'react';
import {
  Package,
  Layers,
  ArrowDownLeft,
  ArrowUpRight,
  RotateCcw,
  Users,
  Truck,
  FileText,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Search,
  Plus,
  Trash2,
  Printer,
  FileDown,
  X,
  CreditCard,
  DollarSign,
  TrendingUp,
  Tag,
  ShieldAlert,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Filter,
  Check,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

// Initial Demo State grounded in the Android Inventory App & School ERP
const INITIAL_ITEMS = [
  { id: '1', name: 'School Diary 2026-27', category: 'Diary', barcode: 'BC-DIR-001', purchasePrice: 90, sellingPrice: 150, stock: 280, minStock: 50, unit: 'Pcs' },
  { id: '2', name: 'Summer Polo T-Shirt (Size 22)', category: 'Uniform', barcode: 'BC-TSH-022', purchasePrice: 180, sellingPrice: 300, stock: 75, minStock: 20, unit: 'Pcs' },
  { id: '3', name: 'Summer Polo T-Shirt (Size 24)', category: 'Uniform', barcode: 'BC-TSH-024', purchasePrice: 180, sellingPrice: 300, stock: 55, minStock: 20, unit: 'Pcs' },
  { id: '4', name: 'Navy Blue School Trouser (Size 20)', category: 'Uniform', barcode: 'BC-PNT-020', purchasePrice: 280, sellingPrice: 450, stock: 7, minStock: 15, unit: 'Pcs' }, // Low stock
  { id: '5', name: 'Track Pant / Pajama (Size 26)', category: 'Uniform', barcode: 'BC-PAJ-026', purchasePrice: 160, sellingPrice: 280, stock: 4, minStock: 10, unit: 'Pcs' }, // Low stock
  { id: '6', name: '4-Line English Notebook (172 Pgs)', category: 'Notebooks', barcode: 'BC-NBK-001', purchasePrice: 28, sellingPrice: 45, stock: 340, minStock: 100, unit: 'Pcs' },
  { id: '7', name: '2-Line Hindi Notebook (172 Pgs)', category: 'Notebooks', barcode: 'BC-NBK-002', purchasePrice: 28, sellingPrice: 45, stock: 290, minStock: 100, unit: 'Pcs' },
  { id: '8', name: 'Mathematics Square Notebook', category: 'Notebooks', barcode: 'BC-NBK-003', purchasePrice: 28, sellingPrice: 45, stock: 310, minStock: 100, unit: 'Pcs' },
  { id: '9', name: 'Practical Science Register', category: 'Stationery', barcode: 'BC-REG-001', purchasePrice: 50, sellingPrice: 85, stock: 110, minStock: 40, unit: 'Pcs' },
  { id: '10', name: 'School Tie & Belt Set', category: 'Accessories', barcode: 'BC-TIE-001', purchasePrice: 70, sellingPrice: 120, stock: 18, minStock: 25, unit: 'Set' },
  { id: '11', name: 'Junior Drawing Book (A4)', category: 'Stationery', barcode: 'BC-DRW-001', purchasePrice: 35, sellingPrice: 60, stock: 2, minStock: 30, unit: 'Pcs' } // Critical stock
];

const INITIAL_STUDENTS = [
  { id: 'ST-101', rollNo: '101', name: 'Aaditya Singh Choudhary', className: 'Class 5', section: 'A', fatherName: 'Rajesh Choudhary', phone: '8947919195' },
  { id: 'ST-102', rollNo: '102', name: 'Aadhya Choudhary', className: 'Class 5', section: 'A', fatherName: 'Vikram Choudhary', phone: '6377281034' },
  { id: 'ST-103', rollNo: '103', name: 'Rohan Sharma', className: 'Class 5', section: 'A', fatherName: 'Manoj Sharma', phone: '9829012345' },
  { id: 'ST-104', rollNo: '104', name: 'Priya Meena', className: 'Class 5', section: 'A', fatherName: 'Kailash Meena', phone: '9414011223' },
  { id: 'ST-105', rollNo: '105', name: 'Aman Verma', className: 'Class 5', section: 'A', fatherName: 'Suresh Verma', phone: '9785002233' },
  { id: 'ST-106', rollNo: '106', name: 'Divya Rathore', className: 'Class 5', section: 'B', fatherName: 'Bhawani Singh', phone: '9636001144' },
  { id: 'ST-107', rollNo: '107', name: 'Harsh Vardhan', className: 'Class 5', section: 'B', fatherName: 'Rajendra Singh', phone: '9928003355' },
  { id: 'ST-108', rollNo: '101', name: 'Sneha Jain', className: 'Class 6', section: 'A', fatherName: 'Pankaj Jain', phone: '9828004466' }
];

const INITIAL_PACKAGES = [
  {
    id: 'PKG-1',
    name: 'Class 5 Complete Book & Diary Set',
    category: 'Book Set',
    price: 330,
    items: [
      { itemId: '1', qty: 1, name: 'School Diary 2026-27', price: 150 },
      { itemId: '6', qty: 2, name: '4-Line English Notebook (172 Pgs)', price: 90 },
      { itemId: '7', qty: 2, name: '2-Line Hindi Notebook (172 Pgs)', price: 90 }
    ]
  },
  {
    id: 'PKG-2',
    name: 'Summer Uniform & Accessory Kit',
    category: 'Uniform Set',
    price: 870,
    items: [
      { itemId: '2', qty: 1, name: 'Summer Polo T-Shirt (Size 22)', price: 300 },
      { itemId: '4', qty: 1, name: 'Navy Blue School Trouser (Size 20)', price: 450 },
      { itemId: '10', qty: 1, name: 'School Tie & Belt Set', price: 120 }
    ]
  }
];

const INITIAL_SUPPLIERS = [
  { id: 'SUP-1', name: 'J D Book Depot & Publishers', contactPerson: 'Jagdish Agarwal', phone: '9829011122', gstin: '08AAAAA0000A1Z5', address: 'Chaura Rasta, Jaipur', totalPurchased: 145000, totalPaid: 125000, balance: 20000 },
  { id: 'SUP-2', name: 'Standard Uniforms & Garments', contactPerson: 'Ramesh Pareek', phone: '9414022334', gstin: '08BBBBB1111B2Z6', address: 'Bapu Bazar, Jaipur', totalPurchased: 210000, totalPaid: 180000, balance: 30000 },
  { id: 'SUP-3', name: 'Natraj Stationery Mart', contactPerson: 'Mohan Lal', phone: '9785033445', gstin: '08CCCCC2222C3Z7', address: 'Station Road, Jaipur', totalPurchased: 85000, totalPaid: 85000, balance: 0 }
];

const INITIAL_TRANSACTIONS = [
  { id: 'TX-1001', type: 'ISSUE', refNo: 'SB-2026-001', date: '2026-10-24 10:30 AM', student: 'Aaditya Singh Choudhary (Class 5-A)', itemsCount: 3, totalAmount: 330, paidAmount: 330, status: 'PAID' },
  { id: 'TX-1002', type: 'BULK_ISSUE', refNo: 'BLK-2026-089', date: '2026-10-25 11:15 AM', student: 'Class 5-A (5 Students)', itemsCount: 15, totalAmount: 1650, paidAmount: 1650, status: 'PAID' },
  { id: 'TX-1003', type: 'PURCHASE', refNo: 'PO-2026-042', date: '2026-10-26 02:45 PM', supplier: 'J D Book Depot & Publishers', itemsCount: 100, totalAmount: 9000, paidAmount: 9000, status: 'RESTOCKED' },
  { id: 'TX-1004', type: 'RETURN', refNo: 'RET-2026-012', date: '2026-10-27 09:20 AM', student: 'Rohan Sharma (Class 5-A)', itemsCount: 1, totalAmount: 0, status: 'RESTOCKED', condition: 'Good' },
  { id: 'TX-1005', type: 'LOSS_DAMAGE', refNo: 'DMG-2026-003', date: '2026-10-27 03:10 PM', student: 'Priya Meena (Class 5-A)', itemsCount: 1, fineAmount: 150, status: 'FINED', condition: 'Lost Diary' }
];

export function SchoolInventoryHubPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'bulk_issue' | 'returns' | 'suppliers' | 'audit' | 'rollover'

  // State
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [students] = useState(INITIAL_STUDENTS);
  const [packages] = useState(INITIAL_PACKAGES);
  const [suppliers, setSuppliers] = useState(INITIAL_SUPPLIERS);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);

  // Bulk Issue Form State
  const [bulkClass, setBulkClass] = useState('Class 5');
  const [bulkSection, setBulkSection] = useState('A');
  const [selectedPackageId, setSelectedPackageId] = useState('PKG-1');
  const [selectedStudentIds, setSelectedStudentIds] = useState(
    INITIAL_STUDENTS.filter(s => s.className === 'Class 5' && s.section === 'A').map(s => s.id)
  );
  const [bulkDiscount, setBulkDiscount] = useState(0);
  const [bulkPaymentStatus, setBulkPaymentStatus] = useState('PAID');

  // Return & Damage State
  const [returnSearch, setReturnSearch] = useState('');
  const [selectedReturnStudent, setSelectedReturnStudent] = useState(null);
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [returnCondition, setReturnCondition] = useState('GOOD'); // 'GOOD' | 'DAMAGED' | 'LOST'
  const [returnFineAmount, setReturnFineAmount] = useState(0);
  const [returnItemToProcess, setReturnItemToProcess] = useState(null);

  // Supplier Stock-In Modal State
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [purchaseSupplierId, setPurchaseSupplierId] = useState('SUP-1');
  const [purchaseInvoiceNo, setPurchaseInvoiceNo] = useState('');
  const [purchaseItemId, setPurchaseItemId] = useState('1');
  const [purchaseQty, setPurchaseQty] = useState(50);
  const [purchaseUnitCost, setPurchaseUnitCost] = useState(90);
  const [purchasePaidNow, setPurchasePaidNow] = useState(4500);

  // Supplier Payment Modal
  const [supplierPayModalOpen, setSupplierPayModalOpen] = useState(false);
  const [activeSupplierForPay, setActiveSupplierForPay] = useState(null);
  const [supplierPayAmount, setSupplierPayAmount] = useState(0);

  // KPI calculations
  const totalValuation = useMemo(() => {
    return items.reduce((acc, it) => acc + (it.stock * it.purchasePrice), 0);
  }, [items]);

  const lowStockItems = useMemo(() => {
    return items.filter(it => it.stock <= it.minStock);
  }, [items]);

  const outOfStockItems = useMemo(() => {
    return items.filter(it => it.stock === 0);
  }, [items]);

  // Bulk issue filtered students
  const filteredBulkStudents = useMemo(() => {
    return students.filter(s => s.className === bulkClass && (bulkSection === 'ALL' || s.section === bulkSection));
  }, [students, bulkClass, bulkSection]);

  const activePackage = useMemo(() => {
    return packages.find(p => p.id === selectedPackageId) || packages[0];
  }, [packages, selectedPackageId]);

  // Handlers
  const handleToggleStudentSelection = (stId) => {
    setSelectedStudentIds(prev =>
      prev.includes(stId) ? prev.filter(id => id !== stId) : [...prev, stId]
    );
  };

  const handleSelectAllStudents = () => {
    if (selectedStudentIds.length === filteredBulkStudents.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(filteredBulkStudents.map(s => s.id));
    }
  };

  const executeBulkIssuance = () => {
    if (!selectedStudentIds.length) {
      toast.error('Kripya kam se kam ek student select karein!');
      return;
    }

    const qtyNeeded = selectedStudentIds.length;
    // Check stock for all package items
    let hasStockIssue = false;
    activePackage.items.forEach(pkgItem => {
      const liveItem = items.find(it => it.id === pkgItem.itemId);
      const totalNeeded = pkgItem.qty * qtyNeeded;
      if (!liveItem || liveItem.stock < totalNeeded) {
        hasStockIssue = true;
        toast.error(`Stock kam hai: ${pkgItem.name} chahiye ${totalNeeded}, uplabdh hai ${liveItem?.stock || 0}`);
      }
    });

    if (hasStockIssue) return;

    // Deduct stock
    setItems(prevItems =>
      prevItems.map(it => {
        const pkgMatch = activePackage.items.find(pi => pi.itemId === it.id);
        if (pkgMatch) {
          return { ...it, stock: it.stock - (pkgMatch.qty * qtyNeeded) };
        }
        return it;
      })
    );

    // Record Transaction
    const newTx = {
      id: `TX-${Date.now().toString().slice(-4)}`,
      type: 'BULK_ISSUE',
      refNo: `BLK-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toLocaleString(),
      student: `${bulkClass}-${bulkSection} (${qtyNeeded} Students)`,
      itemsCount: activePackage.items.length * qtyNeeded,
      totalAmount: (activePackage.price * qtyNeeded) - bulkDiscount,
      paidAmount: bulkPaymentStatus === 'PAID' ? (activePackage.price * qtyNeeded) - bulkDiscount : 0,
      status: bulkPaymentStatus
    };

    setTransactions([newTx, ...transactions]);
    toast.success(`🎉 ${qtyNeeded} students ko ${activePackage.name} safaltapoorvak issue ho gaya!`);
  };

  const handleReturnItem = () => {
    if (!returnItemToProcess) return;

    const restocked = returnCondition === 'GOOD';
    // Update stock if good condition
    if (restocked) {
      setItems(prev =>
        prev.map(it => it.id === returnItemToProcess.id ? { ...it, stock: it.stock + 1 } : it)
      );
    }

    const newTx = {
      id: `TX-${Date.now().toString().slice(-4)}`,
      type: returnCondition === 'GOOD' ? 'RETURN' : 'LOSS_DAMAGE',
      refNo: `RET-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toLocaleString(),
      student: `${selectedReturnStudent.name} (${selectedReturnStudent.className}-${selectedReturnStudent.section})`,
      itemsCount: 1,
      fineAmount: returnCondition !== 'GOOD' ? Number(returnFineAmount) : 0,
      status: returnCondition === 'GOOD' ? 'RESTOCKED' : 'FINED',
      condition: returnCondition === 'GOOD' ? 'Good Condition (Restocked)' : (returnCondition === 'DAMAGED' ? 'Damaged / Wear & Tear' : 'Lost / Penalty')
    };

    setTransactions([newTx, ...transactions]);
    setReturnModalOpen(false);
    toast.success(restocked ? 'Samaan wapas stock me add ho gaya!' : `Penalty / Fine ₹${returnFineAmount} record ho gaya!`);
  };

  const handleRecordStockIn = (e) => {
    e.preventDefault();
    const qty = Number(purchaseQty);
    const unitCost = Number(purchaseUnitCost);
    const totalCost = qty * unitCost;
    const paid = Number(purchasePaidNow);
    const remaining = totalCost - paid;

    // Update stock
    setItems(prev =>
      prev.map(it => it.id === purchaseItemId ? { ...it, stock: it.stock + qty, purchasePrice: unitCost } : it)
    );

    // Update supplier ledger
    setSuppliers(prev =>
      prev.map(sup => {
        if (sup.id === purchaseSupplierId) {
          return {
            ...sup,
            totalPurchased: sup.totalPurchased + totalCost,
            totalPaid: sup.totalPaid + paid,
            balance: sup.balance + remaining
          };
        }
        return sup;
      })
    );

    const supObj = suppliers.find(s => s.id === purchaseSupplierId);
    const newTx = {
      id: `TX-${Date.now().toString().slice(-4)}`,
      type: 'PURCHASE',
      refNo: purchaseInvoiceNo || `PO-${Date.now().toString().slice(-4)}`,
      date: new Date().toLocaleString(),
      supplier: supObj?.name || 'Supplier',
      itemsCount: qty,
      totalAmount: totalCost,
      paidAmount: paid,
      status: 'RESTOCKED'
    };

    setTransactions([newTx, ...transactions]);
    setPurchaseModalOpen(false);
    toast.success(`📦 ${qty} units stock me add ho gaye! Supplier ledger updated.`);
  };

  const handlePaySupplier = (e) => {
    e.preventDefault();
    if (!activeSupplierForPay || supplierPayAmount <= 0) return;

    setSuppliers(prev =>
      prev.map(sup => {
        if (sup.id === activeSupplierForPay.id) {
          return {
            ...sup,
            totalPaid: sup.totalPaid + Number(supplierPayAmount),
            balance: Math.max(0, sup.balance - Number(supplierPayAmount))
          };
        }
        return sup;
      })
    );

    setSupplierPayModalOpen(false);
    toast.success(`₹${supplierPayAmount} payment ${activeSupplierForPay.name} ko record ho gayi!`);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-fuchsia-50 flex items-center justify-center text-fuchsia-600">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">School Inventory & Stock Hub</h1>
              <p className="text-xs text-gray-500">Android Inventory App ke saare features ab live Web ERP me integrated</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setActiveTab('bulk_issue');
              toast('Bulk Class Issue screen khul gayi!', { icon: '🚀' });
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-fuchsia-600 text-white text-xs font-semibold hover:bg-fuchsia-700 shadow-sm transition"
          >
            <Users className="w-4 h-4" />
            Bulk Issue to Class
          </button>
          <button
            onClick={() => setPurchaseModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Stock-In Purchase
          </button>
          <button
            onClick={() => onNavigate?.('/stationary-reports')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-xs font-medium hover:bg-gray-50 transition"
          >
            <FileText className="w-4 h-4" />
            Reports
          </button>
        </div>
      </div>

      {/* Modern Pill Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview & Stock Health', icon: TrendingUp },
          { id: 'bulk_issue', label: '🚀 Bulk Class Issuance', icon: Users, badge: 'Popular' },
          { id: 'returns', label: '🔄 Returns & Damage Control', icon: RotateCcw },
          { id: 'suppliers', label: '🚚 Supplier Ledgers & Purchases', icon: Truck },
          { id: 'audit', label: '📑 All Movement Audit Log', icon: FileText },
          { id: 'rollover', label: '📅 Session Rollover', icon: Calendar }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-fuchsia-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${isActive ? 'bg-fuchsia-800 text-white' : 'bg-fuchsia-100 text-fuchsia-700'}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: OVERVIEW & STOCK HEALTH ================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Top 4 KPI Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500">Total Valuation</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">₹{totalValuation.toLocaleString()}</p>
                  <span className="text-[11px] text-emerald-600 font-medium">Godown current assets</span>
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500">Total Unique Items</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{items.length}</p>
                  <span className="text-[11px] text-fuchsia-600 font-medium">Across all categories</span>
                </div>
                <div className="w-10 h-10 rounded-lg bg-fuchsia-50 text-fuchsia-600 flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500">Low Stock Warnings</p>
                  <p className="text-2xl font-bold text-amber-600 mt-1">{lowStockItems.length}</p>
                  <span className="text-[11px] text-amber-600 font-medium">Below reorder threshold</span>
                </div>
                <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500">Supplier Dues</p>
                  <p className="text-2xl font-bold text-rose-600 mt-1">
                    ₹{suppliers.reduce((a, s) => a + s.balance, 0).toLocaleString()}
                  </p>
                  <span className="text-[11px] text-rose-600 font-medium">Outstanding vendor bills</span>
                </div>
                <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Access & Stock Table */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stock Alerts & Catalog Table */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-fuchsia-600" />
                  <h2 className="text-sm font-semibold text-gray-900">Live Stock Health & Inventory Catalog</h2>
                </div>
                <span className="text-xs text-gray-500">{items.length} items total</span>
              </div>

              <div className="overflow-x-auto mt-3">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50/80 text-gray-600 font-semibold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-2.5">Item Name</th>
                      <th className="p-2.5">Category</th>
                      <th className="p-2.5">Rate (₹)</th>
                      <th className="p-2.5 text-center">Available Stock</th>
                      <th className="p-2.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {items.map(item => {
                      const isLow = item.stock <= item.minStock;
                      const isOut = item.stock === 0;
                      return (
                        <tr key={item.id} className="hover:bg-gray-50/60 transition">
                          <td className="p-2.5 font-medium text-gray-900">
                            <div>{item.name}</div>
                            <span className="text-[10px] text-gray-400 font-mono">{item.barcode}</span>
                          </td>
                          <td className="p-2.5">
                            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[10px]">
                              {item.category}
                            </span>
                          </td>
                          <td className="p-2.5 font-semibold">₹{item.sellingPrice}</td>
                          <td className="p-2.5 text-center font-bold">
                            {item.stock} {item.unit}
                          </td>
                          <td className="p-2.5 text-center">
                            {isOut ? (
                              <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold">
                                Out of Stock
                              </span>
                            ) : isLow ? (
                              <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold">
                                Low Stock ({item.stock})
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold">
                                In Stock
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Column: Pre-configured Packages / Sets from Android App */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-fuchsia-600" />
                    <h3 className="text-sm font-semibold text-gray-900">Standard Packages / Sets</h3>
                  </div>
                </div>

                <div className="space-y-3 mt-3">
                  {packages.map(pkg => (
                    <div key={pkg.id} className="p-3 rounded-lg border border-gray-100 bg-gray-50/50 hover:border-fuchsia-200 transition">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-gray-900">{pkg.name}</span>
                        <span className="text-xs font-bold text-fuchsia-600">₹{pkg.price}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1">Includes {pkg.items.length} items:</p>
                      <ul className="text-[10px] text-gray-600 list-disc list-inside mt-0.5">
                        {pkg.items.map((it, idx) => (
                          <li key={idx}>{it.name} (Qty: {it.qty})</li>
                        ))}
                      </ul>
                      <button
                        onClick={() => {
                          setSelectedPackageId(pkg.id);
                          setActiveTab('bulk_issue');
                        }}
                        className="mt-2.5 w-full py-1 text-[11px] font-medium rounded bg-white border border-gray-200 text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-700 hover:border-fuchsia-200 transition"
                      >
                        Issue this Kit in Bulk →
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Audit Feed */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <h3 className="text-xs font-semibold text-gray-900">Live Inventory Activity</h3>
                  <button onClick={() => setActiveTab('audit')} className="text-[11px] text-fuchsia-600 hover:underline">
                    View All
                  </button>
                </div>
                <div className="space-y-2 mt-3">
                  {transactions.slice(0, 4).map(tx => (
                    <div key={tx.id} className="text-xs flex items-center justify-between p-2 rounded bg-gray-50/60">
                      <div>
                        <p className="font-medium text-gray-900">{tx.refNo}</p>
                        <p className="text-[10px] text-gray-500">{tx.student || tx.supplier}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-gray-800">₹{tx.totalAmount}</span>
                        <p className="text-[9px] text-gray-400">{tx.date.split(' ')[0]}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: BULK CLASS ISSUANCE ================= */}
      {activeTab === 'bulk_issue' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-6">
          <div>
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-fuchsia-600" />
              Bulk Issue to Entire Class / Section
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Ek click me poori class ya batch ko Book Set, Uniform Kit ya Diaries issue karein
            </p>
          </div>

          {/* Selection Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Select Class</label>
              <select
                value={bulkClass}
                onChange={e => {
                  setBulkClass(e.target.value);
                  setSelectedStudentIds(students.filter(s => s.className === e.target.value && (bulkSection === 'ALL' || s.section === bulkSection)).map(s => s.id));
                }}
                className="w-full text-xs rounded-lg border-gray-300 shadow-sm focus:border-fuchsia-500 focus:ring-fuchsia-500"
              >
                <option value="Class 5">Class 5</option>
                <option value="Class 6">Class 6</option>
                <option value="Class 7">Class 7</option>
                <option value="Class 8">Class 8</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Select Section</label>
              <select
                value={bulkSection}
                onChange={e => {
                  setBulkSection(e.target.value);
                  setSelectedStudentIds(students.filter(s => s.className === bulkClass && (e.target.value === 'ALL' || s.section === e.target.value)).map(s => s.id));
                }}
                className="w-full text-xs rounded-lg border-gray-300 shadow-sm focus:border-fuchsia-500 focus:ring-fuchsia-500"
              >
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="ALL">All Sections</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Kit / Package to Issue</label>
              <select
                value={selectedPackageId}
                onChange={e => setSelectedPackageId(e.target.value)}
                className="w-full text-xs rounded-lg border-gray-300 shadow-sm focus:border-fuchsia-500 focus:ring-fuchsia-500 font-medium"
              >
                {packages.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} (₹{p.price})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Payment Status</label>
              <select
                value={bulkPaymentStatus}
                onChange={e => setBulkPaymentStatus(e.target.value)}
                className="w-full text-xs rounded-lg border-gray-300 shadow-sm focus:border-fuchsia-500 focus:ring-fuchsia-500"
              >
                <option value="PAID">Paid (Cash/Online)</option>
                <option value="DUE">Mark as Student Due</option>
                <option value="COMPLIMENTARY">Free / Complimentary</option>
              </select>
            </div>
          </div>

          {/* Student Checklist & Live Summary Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Student Checklist (2 cols) */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-700">
                  Students in {bulkClass}-{bulkSection} ({selectedStudentIds.length} of {filteredBulkStudents.length} selected)
                </span>
                <button
                  type="button"
                  onClick={handleSelectAllStudents}
                  className="text-xs text-fuchsia-600 hover:text-fuchsia-700 font-semibold"
                >
                  {selectedStudentIds.length === filteredBulkStudents.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-100 max-h-[380px] overflow-y-auto">
                {filteredBulkStudents.map(st => {
                  const isChecked = selectedStudentIds.includes(st.id);
                  return (
                    <label
                      key={st.id}
                      className={`flex items-center justify-between p-3 cursor-pointer text-xs transition ${
                        isChecked ? 'bg-fuchsia-50/40' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleStudentSelection(st.id)}
                          className="rounded text-fuchsia-600 focus:ring-fuchsia-500 h-4 w-4"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">{st.name}</p>
                          <p className="text-[11px] text-gray-500">Roll No: {st.rollNo} • F/N: {st.fatherName}</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono text-gray-400">{st.phone}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Live Calculation & Execution Card */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200/80 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Bulk Issuance Summary</h3>
                <div className="bg-white p-3 rounded-lg border border-gray-200 text-xs space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Kit Price per Student</span>
                    <span className="font-semibold text-gray-900">₹{activePackage.price}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Selected Students</span>
                    <span className="font-semibold text-gray-900">{selectedStudentIds.length}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Total Items Being Issued</span>
                    <span className="font-semibold text-gray-900">
                      {selectedStudentIds.length * activePackage.items.reduce((a, b) => a + b.qty, 0)} Pcs
                    </span>
                  </div>
                  <div className="pt-2 border-t border-gray-100 flex justify-between text-sm font-bold text-gray-900">
                    <span>Total Billing Value</span>
                    <span className="text-fuchsia-600">₹{(activePackage.price * selectedStudentIds.length).toLocaleString()}</span>
                  </div>
                </div>

                <div className="text-[11px] text-gray-500 space-y-1">
                  <p className="font-medium text-gray-700">Stock Availability Check:</p>
                  {activePackage.items.map((pi, idx) => {
                    const currentIt = items.find(i => i.id === pi.itemId);
                    const needed = pi.qty * selectedStudentIds.length;
                    const isEnough = (currentIt?.stock || 0) >= needed;
                    return (
                      <div key={idx} className="flex justify-between items-center text-[10px]">
                        <span>{pi.name}</span>
                        <span className={isEnough ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                          Need {needed} / Have {currentIt?.stock || 0}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={executeBulkIssuance}
                disabled={selectedStudentIds.length === 0}
                className="w-full py-2.5 px-4 rounded-lg bg-fuchsia-600 text-white text-xs font-bold hover:bg-fuchsia-700 disabled:opacity-50 transition shadow-sm"
              >
                1-Click Bulk Issue Karein ({selectedStudentIds.length} Students)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: RETURN & DAMAGE CONTROL ================= */}
      {activeTab === 'returns' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-6">
          <div>
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-fuchsia-600" />
              Item Return, Damage & Lost Asset Tracking
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Bacho se issued books/uniforms wapas lena ya damage/lost hone par automatic fine lagana
            </p>
          </div>

          {/* Student Search */}
          <div className="max-w-md">
            <label className="block text-xs font-semibold text-gray-700 mb-1">Search Student to Process Return</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Student Name, Roll No ya Mobile search karein..."
                value={returnSearch}
                onChange={e => setReturnSearch(e.target.value)}
                className="w-full pl-9 text-xs rounded-lg border-gray-300 shadow-sm focus:border-fuchsia-500 focus:ring-fuchsia-500"
              />
            </div>
          </div>

          {/* Student Search Results */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {students
              .filter(s =>
                !returnSearch ||
                s.name.toLowerCase().includes(returnSearch.toLowerCase()) ||
                s.phone.includes(returnSearch) ||
                s.rollNo.includes(returnSearch)
              )
              .slice(0, 6)
              .map(st => (
                <div
                  key={st.id}
                  onClick={() => setSelectedReturnStudent(st)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition ${
                    selectedReturnStudent?.id === st.id
                      ? 'border-fuchsia-500 bg-fuchsia-50/50 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold text-gray-900">{st.name}</p>
                      <p className="text-[11px] text-gray-500">{st.className} - {st.section} • Roll #{st.rollNo}</p>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5">{st.phone}</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold">
                      3 Items Active
                    </span>
                  </div>
                </div>
              ))}
          </div>

          {/* Selected Student's Currently Issued Items */}
          {selectedReturnStudent && (
            <div className="mt-6 border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                    Currently Issued Items for: <span className="text-fuchsia-700">{selectedReturnStudent.name}</span>
                  </h3>
                  <p className="text-[11px] text-gray-500">Neeche diye gaye item par action le kar return ya damage mark karein</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { id: '1', name: 'School Diary 2026-27', issueDate: '2026-10-10', condition: 'Issued' },
                  { id: '2', name: 'Summer Polo T-Shirt (Size 22)', issueDate: '2026-10-12', condition: 'Issued' },
                  { id: '9', name: 'Practical Science Register', issueDate: '2026-10-15', condition: 'Issued' }
                ].map(item => (
                  <div key={item.id} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between">
                        <span className="text-xs font-bold text-gray-900">{item.name}</span>
                        <span className="text-[10px] text-gray-400 font-medium">Issued {item.issueDate}</span>
                      </div>
                      <span className="inline-block mt-1 text-[10px] font-semibold text-fuchsia-700 bg-fuchsia-50 px-2 py-0.5 rounded">
                        Active Possession
                      </span>
                    </div>

                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => {
                          setReturnItemToProcess(item);
                          setReturnCondition('GOOD');
                          setReturnFineAmount(0);
                          setReturnModalOpen(true);
                        }}
                        className="flex-1 py-1.5 rounded bg-emerald-50 text-emerald-700 text-xs font-bold hover:bg-emerald-100 transition"
                      >
                        Return (Good)
                      </button>
                      <button
                        onClick={() => {
                          setReturnItemToProcess(item);
                          setReturnCondition('DAMAGED');
                          setReturnFineAmount(100);
                          setReturnModalOpen(true);
                        }}
                        className="flex-1 py-1.5 rounded bg-amber-50 text-amber-700 text-xs font-bold hover:bg-amber-100 transition"
                      >
                        Damaged / Lost
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 4: SUPPLIER LEDGERS & PURCHASES ================= */}
      {activeTab === 'suppliers' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-fuchsia-600" />
                Supplier Directory & Purchase Ledgers
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Vendors se naya stock khareedne, bill chadhane aur outstanding payments ka hisaab
              </p>
            </div>
            <button
              onClick={() => setPurchaseModalOpen(true)}
              className="px-3.5 py-2 rounded-lg bg-fuchsia-600 text-white text-xs font-bold hover:bg-fuchsia-700 transition flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              New Stock-In Purchase
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {suppliers.map(sup => (
              <div key={sup.id} className="bg-white rounded-xl border border-gray-200/80 p-4 shadow-sm space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xs font-bold text-gray-900">{sup.name}</h3>
                    <p className="text-[11px] text-gray-500">{sup.contactPerson} • {sup.phone}</p>
                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">GSTIN: {sup.gstin}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    sup.balance > 0 ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    {sup.balance > 0 ? `₹${sup.balance.toLocaleString()} Due` : 'All Paid'}
                  </span>
                </div>

                <div className="bg-gray-50 p-2.5 rounded-lg text-xs space-y-1">
                  <div className="flex justify-between text-gray-600">
                    <span>Total Purchased:</span>
                    <span className="font-semibold text-gray-900">₹{sup.totalPurchased.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Amount Paid:</span>
                    <span className="font-semibold text-emerald-600">₹{sup.totalPaid.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 pt-1 border-t border-gray-200">
                    <span>Current Balance:</span>
                    <span className={sup.balance > 0 ? 'text-rose-600' : 'text-gray-900'}>
                      ₹{sup.balance.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setActiveSupplierForPay(sup);
                      setSupplierPayAmount(sup.balance);
                      setSupplierPayModalOpen(true);
                    }}
                    disabled={sup.balance === 0}
                    className="flex-1 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 disabled:opacity-40 transition"
                  >
                    Pay Supplier
                  </button>
                  <button
                    onClick={() => {
                      setPurchaseSupplierId(sup.id);
                      setPurchaseModalOpen(true);
                    }}
                    className="flex-1 py-1.5 rounded-lg border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition"
                  >
                    + Stock In
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 5: ALL MOVEMENT AUDIT LOG ================= */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-fuchsia-600" />
                Complete Stock Movement & Transaction Ledger
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Saare Issue, Bulk Issue, Purchase, Return aur Damage transactions ka live master log
              </p>
            </div>
            <button
              onClick={() => toast.success('CSV Export ready!')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 text-xs font-medium hover:bg-gray-50 transition"
            >
              <FileDown className="w-4 h-4" />
              Export CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 text-gray-600 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Ref / Bill No</th>
                  <th className="p-3">Date & Time</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Party (Student / Vendor)</th>
                  <th className="p-3 text-center">Items Qty</th>
                  <th className="p-3 text-right">Amount (₹)</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {transactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-gray-50/60 transition">
                    <td className="p-3 font-mono font-bold text-gray-900">{tx.refNo}</td>
                    <td className="p-3 text-gray-500">{tx.date}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        tx.type === 'BULK_ISSUE' ? 'bg-fuchsia-50 text-fuchsia-700' :
                        tx.type === 'ISSUE' ? 'bg-blue-50 text-blue-700' :
                        tx.type === 'PURCHASE' ? 'bg-emerald-50 text-emerald-700' :
                        tx.type === 'RETURN' ? 'bg-teal-50 text-teal-700' :
                        'bg-rose-50 text-rose-700'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="p-3 font-medium text-gray-900">{tx.student || tx.supplier}</td>
                    <td className="p-3 text-center font-semibold">{tx.itemsCount} Pcs</td>
                    <td className="p-3 text-right font-bold text-gray-900">
                      ₹{(tx.totalAmount || tx.fineAmount || 0).toLocaleString()}
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[10px] font-semibold">
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 6: ACADEMIC SESSION ROLLOVER ================= */}
      {activeTab === 'rollover' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6 max-w-3xl">
          <div>
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-fuchsia-600" />
              Academic Session Inventory Rollover Wizard
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Current Academic Session (2025-26) ka stock audit karke new session (2026-27) me carry forward karein
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <div className="text-xs text-amber-800 space-y-1">
              <p className="font-bold">Year-End Stock Audit & Carry Forward</p>
              <p>
                Session rollover karne se pehle godown ke actual items ko count karke verification karein. Unverified stock automatically "Write-off" ho jayega.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 rounded-lg border border-gray-200">
              <div>
                <p className="text-xs font-bold text-gray-900">Current Session Active Items</p>
                <p className="text-[11px] text-gray-500">{items.length} items with ₹{totalValuation.toLocaleString()} valuation</p>
              </div>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Ready to Roll
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-lg border border-gray-200">
              <div>
                <p className="text-xs font-bold text-gray-900">Pending Student Dues from Stationary</p>
                <p className="text-[11px] text-gray-500">Auto-transferred to Fee Balance Ledger</p>
              </div>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Reconciled
              </span>
            </div>
          </div>

          <button
            onClick={() => toast.success('Academic Session 2026-27 rollover verified successfully!')}
            className="w-full py-2.5 rounded-lg bg-fuchsia-600 text-white text-xs font-bold hover:bg-fuchsia-700 transition shadow-sm"
          >
            Carry Forward Stock to New Session (2026-27)
          </button>
        </div>
      )}

      {/* ================= MODAL: RETURN / DAMAGE POPUP ================= */}
      {returnModalOpen && returnItemToProcess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-gray-100 w-full max-w-md p-5 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">Process Item Return / Damage</h3>
              <button onClick={() => setReturnModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg text-xs space-y-1">
              <p><span className="text-gray-500">Student:</span> <strong className="text-gray-900">{selectedReturnStudent?.name}</strong></p>
              <p><span className="text-gray-500">Item:</span> <strong className="text-gray-900">{returnItemToProcess.name}</strong></p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Return Condition</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'GOOD', label: 'Good (Stock In)' },
                    { id: 'DAMAGED', label: 'Damaged' },
                    { id: 'LOST', label: 'Lost Item' }
                  ].map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setReturnCondition(c.id)}
                      className={`py-2 px-2 rounded-lg text-xs font-bold border transition ${
                        returnCondition === c.id
                          ? 'bg-fuchsia-600 text-white border-fuchsia-600'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {returnCondition !== 'GOOD' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Fine / Penalty Amount (₹)</label>
                  <input
                    type="number"
                    value={returnFineAmount}
                    onChange={e => setReturnFineAmount(e.target.value)}
                    className="w-full text-xs rounded-lg border-gray-300 shadow-sm focus:border-fuchsia-500 focus:ring-fuchsia-500"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">Ye fine student ke pending ledger me record ho jayega.</p>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReturnModalOpen(false)}
                className="flex-1 py-2 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReturnItem}
                className="flex-1 py-2 rounded-lg bg-fuchsia-600 text-white text-xs font-bold hover:bg-fuchsia-700 shadow-sm"
              >
                Confirm Return
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: STOCK-IN PURCHASE ================= */}
      {purchaseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-gray-100 w-full max-w-lg p-5 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600" />
                Record Stock-In Purchase Bill
              </h3>
              <button onClick={() => setPurchaseModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRecordStockIn} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Supplier / Vendor</label>
                  <select
                    value={purchaseSupplierId}
                    onChange={e => setPurchaseSupplierId(e.target.value)}
                    className="w-full text-xs rounded-lg border-gray-300"
                  >
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Invoice / Bill No</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. INV-9042"
                    value={purchaseInvoiceNo}
                    onChange={e => setPurchaseInvoiceNo(e.target.value)}
                    className="w-full text-xs rounded-lg border-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Select Item to Restock</label>
                <select
                  value={purchaseItemId}
                  onChange={e => setPurchaseItemId(e.target.value)}
                  className="w-full text-xs rounded-lg border-gray-300 font-medium"
                >
                  {items.map(it => (
                    <option key={it.id} value={it.id}>
                      {it.name} (Current Stock: {it.stock})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={purchaseQty}
                    onChange={e => {
                      setPurchaseQty(e.target.value);
                      setPurchasePaidNow(Number(e.target.value) * Number(purchaseUnitCost));
                    }}
                    className="w-full text-xs rounded-lg border-gray-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Purchase Rate (₹)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={purchaseUnitCost}
                    onChange={e => {
                      setPurchaseUnitCost(e.target.value);
                      setPurchasePaidNow(Number(purchaseQty) * Number(e.target.value));
                    }}
                    className="w-full text-xs rounded-lg border-gray-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Total Bill (₹)</label>
                  <input
                    type="number"
                    disabled
                    value={Number(purchaseQty) * Number(purchaseUnitCost)}
                    className="w-full text-xs rounded-lg border-gray-200 bg-gray-100 font-bold text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Amount Paid Now (₹)</label>
                <input
                  type="number"
                  min="0"
                  max={Number(purchaseQty) * Number(purchaseUnitCost)}
                  value={purchasePaidNow}
                  onChange={e => setPurchasePaidNow(e.target.value)}
                  className="w-full text-xs rounded-lg border-gray-300"
                />
                <p className="text-[10px] text-gray-500 mt-1">
                  Remaining ₹{(Number(purchaseQty) * Number(purchaseUnitCost)) - Number(purchasePaidNow)} will be recorded as Vendor Outstanding.
                </p>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setPurchaseModalOpen(false)}
                  className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-sm"
                >
                  Add to Stock & Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: SUPPLIER PAYMENT ================= */}
      {supplierPayModalOpen && activeSupplierForPay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-gray-100 w-full max-w-sm p-5 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">Pay Vendor Outstanding</h3>
              <button onClick={() => setSupplierPayModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg text-xs space-y-1">
              <p className="font-semibold text-gray-900">{activeSupplierForPay.name}</p>
              <p className="text-rose-600 font-bold">Outstanding Due: ₹{activeSupplierForPay.balance.toLocaleString()}</p>
            </div>

            <form onSubmit={handlePaySupplier} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Payment Amount (₹)</label>
                <input
                  type="number"
                  min="1"
                  max={activeSupplierForPay.balance}
                  required
                  value={supplierPayAmount}
                  onChange={e => setSupplierPayAmount(e.target.value)}
                  className="w-full text-xs rounded-lg border-gray-300"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSupplierPayModalOpen(false)}
                  className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-sm"
                >
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SchoolInventoryHubPage;
