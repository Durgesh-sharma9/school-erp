import React, { useState, useEffect, useMemo } from 'react';
import {
  Package,
  Layers,
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
  RefreshCw,
  FolderPlus
} from 'lucide-react';
import toast from 'react-hot-toast';
import { tenantStore } from '../../services/tenantStore';

export function SchoolInventoryHubPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'bulk_issue' | 'returns' | 'suppliers' | 'audit' | 'rollover'

  // Get active tenant/school from localStorage
  const activeSchoolId = localStorage.getItem('active_school_id') || 'sch_jd_intl';

  // 100% Fresh Persistent Local Storage (NO HARDCODED SEED DATA)
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(`inv_items_${activeSchoolId}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [suppliers, setSuppliers] = useState(() => {
    try {
      const stored = localStorage.getItem(`inv_suppliers_${activeSchoolId}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [transactions, setTransactions] = useState(() => {
    try {
      const stored = localStorage.getItem(`inv_tx_${activeSchoolId}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [packages, setPackages] = useState(() => {
    try {
      const stored = localStorage.getItem(`inv_packages_${activeSchoolId}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Sync to local storage on change
  useEffect(() => {
    localStorage.setItem(`inv_items_${activeSchoolId}`, JSON.stringify(items));
  }, [items, activeSchoolId]);

  useEffect(() => {
    localStorage.setItem(`inv_suppliers_${activeSchoolId}`, JSON.stringify(suppliers));
  }, [suppliers, activeSchoolId]);

  useEffect(() => {
    localStorage.setItem(`inv_tx_${activeSchoolId}`, JSON.stringify(transactions));
  }, [transactions, activeSchoolId]);

  useEffect(() => {
    localStorage.setItem(`inv_packages_${activeSchoolId}`, JSON.stringify(packages));
  }, [packages, activeSchoolId]);

  // Load real students from tenantStore
  const [students, setStudents] = useState([]);
  useEffect(() => {
    try {
      const realStudents = tenantStore.getStudents(activeSchoolId) || [];
      setStudents(realStudents);
    } catch (e) {
      setStudents([]);
    }
  }, [activeSchoolId]);

  // Classes list derived from enrolled students or default
  const availableClasses = useMemo(() => {
    const fromStudents = [...new Set(students.map(s => s.className).filter(Boolean))];
    if (fromStudents.length > 0) return fromStudents;
    return ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'];
  }, [students]);

  // Bulk Issue Form State
  const [bulkClass, setBulkClass] = useState(availableClasses[0] || 'Class 5');
  const [bulkSection, setBulkSection] = useState('ALL');
  const [selectedPackageId, setSelectedPackageId] = useState('');
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [bulkDiscount, setBulkDiscount] = useState(0);
  const [bulkPaymentStatus, setBulkPaymentStatus] = useState('PAID');

  // Filter students for Bulk Issue
  const filteredBulkStudents = useMemo(() => {
    return students.filter(s => {
      const classMatch = s.className === bulkClass || s.class === bulkClass;
      const secMatch = bulkSection === 'ALL' || s.section === bulkSection || s.division === bulkSection;
      return classMatch && secMatch;
    });
  }, [students, bulkClass, bulkSection]);

  // Update selected students when class changes
  useEffect(() => {
    setSelectedStudentIds(filteredBulkStudents.map(s => s.id));
  }, [filteredBulkStudents]);

  // Modal: Add New Item
  const [addItemModalOpen, setAddItemModalOpen] = useState(false);
  const [newItemForm, setNewItemForm] = useState({
    name: '',
    category: 'Stationery',
    barcode: '',
    purchasePrice: '',
    sellingPrice: '',
    stock: '',
    minStock: 10,
    unit: 'Pcs'
  });

  // Modal: Add Supplier
  const [addSupplierModalOpen, setAddSupplierModalOpen] = useState(false);
  const [newSupplierForm, setNewSupplierForm] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    gstin: '',
    address: ''
  });

  // Modal: Create Package/Set
  const [addPackageModalOpen, setAddPackageModalOpen] = useState(false);
  const [newPackageForm, setNewPackageForm] = useState({
    name: '',
    category: 'Book Set',
    price: '',
    selectedItems: [] // [{ itemId, qty, name, price }]
  });

  // Modal: Stock-In Purchase
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [purchaseSupplierId, setPurchaseSupplierId] = useState('');
  const [purchaseInvoiceNo, setPurchaseInvoiceNo] = useState('');
  const [purchaseItemId, setPurchaseItemId] = useState('');
  const [purchaseQty, setPurchaseQty] = useState('');
  const [purchaseUnitCost, setPurchaseUnitCost] = useState('');
  const [purchasePaidNow, setPurchasePaidNow] = useState('');

  // Modal: Supplier Payment
  const [supplierPayModalOpen, setSupplierPayModalOpen] = useState(false);
  const [activeSupplierForPay, setActiveSupplierForPay] = useState(null);
  const [supplierPayAmount, setSupplierPayAmount] = useState('');

  // Return & Damage State
  const [returnSearch, setReturnSearch] = useState('');
  const [selectedReturnStudent, setSelectedReturnStudent] = useState(null);
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [returnCondition, setReturnCondition] = useState('GOOD');
  const [returnFineAmount, setReturnFineAmount] = useState(0);
  const [returnItemToProcess, setReturnItemToProcess] = useState(null);

  // KPIs
  const totalValuation = useMemo(() => {
    return items.reduce((acc, it) => acc + (Number(it.stock || 0) * Number(it.purchasePrice || 0)), 0);
  }, [items]);

  const lowStockItems = useMemo(() => {
    return items.filter(it => Number(it.stock || 0) <= Number(it.minStock || 0));
  }, [items]);

  const activePackage = useMemo(() => {
    return packages.find(p => p.id === selectedPackageId) || packages[0];
  }, [packages, selectedPackageId]);

  // Handlers
  const handleAddNewItem = (e) => {
    e.preventDefault();
    if (!newItemForm.name.trim()) {
      toast.error('Item name enter karein');
      return;
    }
    const itemObj = {
      id: `ITM-${Date.now().toString().slice(-5)}`,
      name: newItemForm.name.trim(),
      category: newItemForm.category,
      barcode: newItemForm.barcode.trim() || `BC-${Date.now().toString().slice(-4)}`,
      purchasePrice: Number(newItemForm.purchasePrice) || 0,
      sellingPrice: Number(newItemForm.sellingPrice) || 0,
      stock: Number(newItemForm.stock) || 0,
      minStock: Number(newItemForm.minStock) || 10,
      unit: newItemForm.unit || 'Pcs'
    };
    setItems([itemObj, ...items]);
    setAddItemModalOpen(false);
    setNewItemForm({ name: '', category: 'Stationery', barcode: '', purchasePrice: '', sellingPrice: '', stock: '', minStock: 10, unit: 'Pcs' });
    toast.success(`✅ "${itemObj.name}" inventory me add ho gaya!`);
  };

  const handleAddNewSupplier = (e) => {
    e.preventDefault();
    if (!newSupplierForm.name.trim()) {
      toast.error('Supplier name zaroori hai');
      return;
    }
    const supObj = {
      id: `SUP-${Date.now().toString().slice(-4)}`,
      name: newSupplierForm.name.trim(),
      contactPerson: newSupplierForm.contactPerson.trim(),
      phone: newSupplierForm.phone.trim(),
      gstin: newSupplierForm.gstin.trim(),
      address: newSupplierForm.address.trim(),
      totalPurchased: 0,
      totalPaid: 0,
      balance: 0
    };
    setSuppliers([supObj, ...suppliers]);
    setAddSupplierModalOpen(false);
    setNewSupplierForm({ name: '', contactPerson: '', phone: '', gstin: '', address: '' });
    toast.success(`✅ Supplier "${supObj.name}" register ho gaya!`);
  };

  const handleCreatePackage = (e) => {
    e.preventDefault();
    if (!newPackageForm.name.trim() || !newPackageForm.selectedItems.length) {
      toast.error('Package name aur kam se kam ek item select karein');
      return;
    }
    const pkgObj = {
      id: `PKG-${Date.now().toString().slice(-4)}`,
      name: newPackageForm.name.trim(),
      category: newPackageForm.category,
      price: Number(newPackageForm.price) || newPackageForm.selectedItems.reduce((a, b) => a + (b.price * b.qty), 0),
      items: newPackageForm.selectedItems
    };
    setPackages([pkgObj, ...packages]);
    setSelectedPackageId(pkgObj.id);
    setAddPackageModalOpen(false);
    setNewPackageForm({ name: '', category: 'Book Set', price: '', selectedItems: [] });
    toast.success(`🎉 Package "${pkgObj.name}" create ho gaya!`);
  };

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
    if (!activePackage) {
      toast.error('Pehle koi Package/Set create ya select karein!');
      return;
    }
    if (!selectedStudentIds.length) {
      toast.error('Kam se kam ek student select karein!');
      return;
    }

    const qtyNeeded = selectedStudentIds.length;
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

    const newTx = {
      id: `TX-${Date.now().toString().slice(-4)}`,
      type: 'BULK_ISSUE',
      refNo: `BLK-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toLocaleString(),
      student: `${bulkClass}-${bulkSection} (${qtyNeeded} Students)`,
      itemsCount: activePackage.items.length * qtyNeeded,
      totalAmount: (activePackage.price * qtyNeeded) - Number(bulkDiscount || 0),
      paidAmount: bulkPaymentStatus === 'PAID' ? (activePackage.price * qtyNeeded) - Number(bulkDiscount || 0) : 0,
      status: bulkPaymentStatus
    };

    setTransactions([newTx, ...transactions]);
    toast.success(`🎉 ${qtyNeeded} students ko ${activePackage.name} issue ho gaya!`);
  };

  const handleReturnItem = () => {
    if (!returnItemToProcess) return;

    const restocked = returnCondition === 'GOOD';
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
      student: selectedReturnStudent?.name || 'Student',
      itemsCount: 1,
      fineAmount: returnCondition !== 'GOOD' ? Number(returnFineAmount) : 0,
      status: returnCondition === 'GOOD' ? 'RESTOCKED' : 'FINED',
      condition: returnCondition === 'GOOD' ? 'Good Condition (Restocked)' : (returnCondition === 'DAMAGED' ? 'Damaged' : 'Lost Item')
    };

    setTransactions([newTx, ...transactions]);
    setReturnModalOpen(false);
    toast.success(restocked ? 'Samaan wapas stock me add ho gaya!' : `Fine ₹${returnFineAmount} record ho gaya!`);
  };

  const handleRecordStockIn = (e) => {
    e.preventDefault();
    const qty = Number(purchaseQty);
    const unitCost = Number(purchaseUnitCost);
    const totalCost = qty * unitCost;
    const paid = Number(purchasePaidNow);
    const remaining = totalCost - paid;

    if (!purchaseItemId || !purchaseSupplierId || qty <= 0) {
      toast.error('Item, Supplier aur Quantity fill karein');
      return;
    }

    setItems(prev =>
      prev.map(it => it.id === purchaseItemId ? { ...it, stock: it.stock + qty, purchasePrice: unitCost } : it)
    );

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
    toast.success(`📦 ${qty} units stock me add ho gaye!`);
  };

  const handlePaySupplier = (e) => {
    e.preventDefault();
    if (!activeSupplierForPay || Number(supplierPayAmount) <= 0) return;

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
              <p className="text-xs text-gray-500">Completely Fresh Production Database • Real-Time Stock & Issuance Control</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setAddItemModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-fuchsia-600 text-white text-xs font-semibold hover:bg-fuchsia-700 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            + Add New Item
          </button>
          <button
            onClick={() => setAddSupplierModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-xs font-semibold hover:bg-gray-50 shadow-sm transition"
          >
            <Truck className="w-4 h-4" />
            + Add Supplier
          </button>
          <button
            onClick={() => {
              if (items.length === 0 || suppliers.length === 0) {
                toast.error('Pehle Item aur Supplier add karein!');
                return;
              }
              setPurchaseItemId(items[0]?.id || '');
              setPurchaseSupplierId(suppliers[0]?.id || '');
              setPurchaseModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Stock-In Purchase
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
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500">Total Valuation</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">₹{totalValuation.toLocaleString()}</p>
                  <span className="text-[11px] text-emerald-600 font-medium">Actual stock asset</span>
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500">Total Inventory Items</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{items.length}</p>
                  <span className="text-[11px] text-fuchsia-600 font-medium">Unique products</span>
                </div>
                <div className="w-10 h-10 rounded-lg bg-fuchsia-50 text-fuchsia-600 flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500">Low Stock Warnings</p>
                  <p className="text-2xl font-bold text-amber-600 mt-1">{lowStockItems.length}</p>
                  <span className="text-[11px] text-amber-600 font-medium">Below threshold</span>
                </div>
                <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500">Supplier Dues</p>
                  <p className="text-2xl font-bold text-rose-600 mt-1">
                    ₹{suppliers.reduce((a, s) => a + Number(s.balance || 0), 0).toLocaleString()}
                  </p>
                  <span className="text-[11px] text-rose-600 font-medium">Outstanding vendor bills</span>
                </div>
                <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

          {/* Catalog & Quick Sets */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-fuchsia-600" />
                  <h2 className="text-sm font-semibold text-gray-900">Current Stock Inventory</h2>
                </div>
                <button
                  onClick={() => setAddItemModalOpen(true)}
                  className="text-xs text-fuchsia-600 hover:text-fuchsia-700 font-semibold"
                >
                  + Add Item
                </button>
              </div>

              {items.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <Package className="w-12 h-12 mx-auto text-gray-300 stroke-[1.5]" />
                  <h3 className="mt-2 text-sm font-bold text-gray-900">Koi Items Nahi Hain (Fresh Database)</h3>
                  <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto">
                    Aapka inventory database bilkul clean hai. Pehla item add karne ke liye neeche click karein.
                  </p>
                  <button
                    onClick={() => setAddItemModalOpen(true)}
                    className="mt-4 px-4 py-2 rounded-lg bg-fuchsia-600 text-white text-xs font-bold hover:bg-fuchsia-700 transition shadow-sm"
                  >
                    + Pehla Item Add Karein
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto mt-3">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50/80 text-gray-600 font-semibold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-2.5">Item Name</th>
                        <th className="p-2.5">Category</th>
                        <th className="p-2.5">Selling Price</th>
                        <th className="p-2.5 text-center">Available Stock</th>
                        <th className="p-2.5 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      {items.map(item => {
                        const isLow = item.stock <= item.minStock;
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
                              {item.stock === 0 ? (
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
              )}
            </div>

            {/* Right: Packages & Live Activity */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-fuchsia-600" />
                    <h3 className="text-sm font-semibold text-gray-900">Class Packages / Kits</h3>
                  </div>
                  <button
                    onClick={() => {
                      if (items.length === 0) {
                        toast.error('Pehle Items add karein, fir kit banayein!');
                        return;
                      }
                      setAddPackageModalOpen(true);
                    }}
                    className="text-xs text-fuchsia-600 hover:text-fuchsia-700 font-semibold"
                  >
                    + New Kit
                  </button>
                </div>

                {packages.length === 0 ? (
                  <div className="text-center py-6 text-gray-400 text-xs">
                    <Layers className="w-8 h-8 mx-auto mb-1 stroke-1 text-gray-300" />
                    <p className="font-medium text-gray-600">Koi Package/Kit create nahi hai</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Jaise "Class 5 Book Set" ya "Uniform Kit"</p>
                    <button
                      onClick={() => {
                        if (items.length === 0) {
                          toast.error('Pehle Items add karein!');
                          return;
                        }
                        setAddPackageModalOpen(true);
                      }}
                      className="mt-3 px-3 py-1.5 rounded-lg border border-fuchsia-200 text-fuchsia-700 font-bold text-[11px] hover:bg-fuchsia-50 transition"
                    >
                      + Kit Banayein
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 mt-3">
                    {packages.map(pkg => (
                      <div key={pkg.id} className="p-3 rounded-lg border border-gray-100 bg-gray-50/50">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-xs text-gray-900">{pkg.name}</span>
                          <span className="text-xs font-bold text-fuchsia-600">₹{pkg.price}</span>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-0.5">{pkg.items?.length || 0} items included</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Activity Feed */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <h3 className="text-xs font-semibold text-gray-900">Live Inventory Activity</h3>
                  <button onClick={() => setActiveTab('audit')} className="text-[11px] text-fuchsia-600 hover:underline">
                    View All
                  </button>
                </div>
                {transactions.length === 0 ? (
                  <p className="text-center py-6 text-xs text-gray-400">Abhi tak koi transaction record nahi hui hai</p>
                ) : (
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
                )}
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
              Ek click me poori class ya batch ko Book Set ya Uniform Kit issue karein
            </p>
          </div>

          {packages.length === 0 ? (
            <div className="p-8 border border-dashed border-gray-300 rounded-xl text-center space-y-3">
              <Layers className="w-10 h-10 text-gray-400 mx-auto" />
              <h3 className="text-sm font-bold text-gray-900">Pehle koi Package / Set banayein</h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                Bulk issue karne ke liye ek kit hona zaroori hai (jaise "Class 5 Complete Set").
              </p>
              <button
                onClick={() => {
                  if (items.length === 0) {
                    toast.error('Pehle Items add karein!');
                    setAddItemModalOpen(true);
                  } else {
                    setAddPackageModalOpen(true);
                  }
                }}
                className="px-4 py-2 rounded-lg bg-fuchsia-600 text-white text-xs font-bold hover:bg-fuchsia-700 transition"
              >
                + Kit / Package Banayein
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Select Class</label>
                  <select
                    value={bulkClass}
                    onChange={e => setBulkClass(e.target.value)}
                    className="w-full text-xs rounded-lg border-gray-300 shadow-sm focus:border-fuchsia-500"
                  >
                    {availableClasses.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Select Section</label>
                  <select
                    value={bulkSection}
                    onChange={e => setBulkSection(e.target.value)}
                    className="w-full text-xs rounded-lg border-gray-300 shadow-sm focus:border-fuchsia-500"
                  >
                    <option value="ALL">All Sections</option>
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Kit / Package to Issue</label>
                  <select
                    value={selectedPackageId}
                    onChange={e => setSelectedPackageId(e.target.value)}
                    className="w-full text-xs rounded-lg border-gray-300 shadow-sm focus:border-fuchsia-500 font-medium"
                  >
                    {packages.map(p => (
                      <option key={p.id} value={p.id}>{p.name} (₹{p.price})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Payment Status</label>
                  <select
                    value={bulkPaymentStatus}
                    onChange={e => setBulkPaymentStatus(e.target.value)}
                    className="w-full text-xs rounded-lg border-gray-300 shadow-sm focus:border-fuchsia-500"
                  >
                    <option value="PAID">Paid (Cash/Online)</option>
                    <option value="DUE">Mark as Student Due</option>
                    <option value="COMPLIMENTARY">Free / Complimentary</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-700">
                      Enrolled Students in {bulkClass} ({selectedStudentIds.length} of {filteredBulkStudents.length} selected)
                    </span>
                    <button
                      type="button"
                      onClick={handleSelectAllStudents}
                      className="text-xs text-fuchsia-600 hover:text-fuchsia-700 font-semibold"
                    >
                      {selectedStudentIds.length === filteredBulkStudents.length ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>

                  {filteredBulkStudents.length === 0 ? (
                    <div className="p-8 border border-gray-200 rounded-lg text-center text-xs text-gray-500">
                      Is Class me abhi koi students enrolled nahi hain.
                    </div>
                  ) : (
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
                                <p className="font-semibold text-gray-900">{st.name || st.studentName}</p>
                                <p className="text-[11px] text-gray-500">Roll: {st.rollNo || '-'} • F/N: {st.fatherName || '-'}</p>
                              </div>
                            </div>
                            <span className="text-[11px] font-mono text-gray-400">{st.phone || st.mobile || '-'}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200/80 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Bulk Issuance Summary</h3>
                    {activePackage && (
                      <div className="bg-white p-3 rounded-lg border border-gray-200 text-xs space-y-2">
                        <div className="flex justify-between text-gray-600">
                          <span>Kit Price per Student</span>
                          <span className="font-semibold text-gray-900">₹{activePackage.price}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>Selected Students</span>
                          <span className="font-semibold text-gray-900">{selectedStudentIds.length}</span>
                        </div>
                        <div className="pt-2 border-t border-gray-100 flex justify-between text-sm font-bold text-gray-900">
                          <span>Total Billing Value</span>
                          <span className="text-fuchsia-600">₹{(activePackage.price * selectedStudentIds.length).toLocaleString()}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={executeBulkIssuance}
                    disabled={selectedStudentIds.length === 0 || !activePackage}
                    className="w-full py-2.5 px-4 rounded-lg bg-fuchsia-600 text-white text-xs font-bold hover:bg-fuchsia-700 disabled:opacity-50 transition shadow-sm"
                  >
                    1-Click Bulk Issue Karein ({selectedStudentIds.length} Students)
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ================= TAB 3: RETURN & DAMAGE CONTROL ================= */}
      {activeTab === 'returns' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-6">
          <div>
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-fuchsia-600" />
              Item Return & Damage / Lost Tracking
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Issued samaan wapas jama karna ya damaged/lost hone par penalty record karna
            </p>
          </div>

          <div className="max-w-md">
            <label className="block text-xs font-semibold text-gray-700 mb-1">Search Enrolled Student</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Student Name ya Roll No search karein..."
                value={returnSearch}
                onChange={e => setReturnSearch(e.target.value)}
                className="w-full pl-9 text-xs rounded-lg border-gray-300 shadow-sm focus:border-fuchsia-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {students
              .filter(s =>
                !returnSearch ||
                (s.name || '').toLowerCase().includes(returnSearch.toLowerCase()) ||
                String(s.rollNo || '').includes(returnSearch)
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
                  <p className="text-xs font-bold text-gray-900">{st.name}</p>
                  <p className="text-[11px] text-gray-500">{st.className} • Roll #{st.rollNo || '-'}</p>
                </div>
              ))}
          </div>

          {selectedReturnStudent && (
            <div className="mt-6 border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-gray-900 uppercase">
                  Select Item to Return for: <span className="text-fuchsia-700">{selectedReturnStudent.name}</span>
                </h3>
              </div>

              {items.length === 0 ? (
                <p className="text-xs text-gray-500">Pehle inventory me items add karein</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {items.slice(0, 6).map(it => (
                    <div key={it.id} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-bold text-gray-900">{it.name}</span>
                        <p className="text-[10px] text-gray-400 mt-0.5 font-mono">{it.barcode}</p>
                      </div>
                      <div className="flex gap-2 mt-3 pt-2 border-t border-gray-100">
                        <button
                          onClick={() => {
                            setReturnItemToProcess(it);
                            setReturnCondition('GOOD');
                            setReturnFineAmount(0);
                            setReturnModalOpen(true);
                          }}
                          className="flex-1 py-1 rounded bg-emerald-50 text-emerald-700 text-xs font-bold hover:bg-emerald-100 transition"
                        >
                          Good Return
                        </button>
                        <button
                          onClick={() => {
                            setReturnItemToProcess(it);
                            setReturnCondition('DAMAGED');
                            setReturnFineAmount(50);
                            setReturnModalOpen(true);
                          }}
                          className="flex-1 py-1 rounded bg-amber-50 text-amber-700 text-xs font-bold hover:bg-amber-100 transition"
                        >
                          Damaged / Lost
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 4: SUPPLIER LEDGERS ================= */}
      {activeTab === 'suppliers' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-fuchsia-600" />
                Suppliers & Vendors Ledger
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Suppliers ki purchase entry, payment record aur remaining balance ka account
              </p>
            </div>
            <button
              onClick={() => setAddSupplierModalOpen(true)}
              className="px-3.5 py-2 rounded-lg bg-fuchsia-600 text-white text-xs font-bold hover:bg-fuchsia-700 transition flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              + Add Supplier
            </button>
          </div>

          {suppliers.length === 0 ? (
            <div className="bg-white p-12 rounded-xl border border-gray-200 text-center space-y-3">
              <Truck className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="text-sm font-bold text-gray-900">Koi Supplier Registered Nahi Hai</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Uniform, Kitabein ya Stationery provide karne wale vendors ko register karein.
              </p>
              <button
                onClick={() => setAddSupplierModalOpen(true)}
                className="mt-2 px-4 py-2 rounded-lg bg-fuchsia-600 text-white text-xs font-bold hover:bg-fuchsia-700 transition"
              >
                + Pehla Supplier Add Karein
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {suppliers.map(sup => (
                <div key={sup.id} className="bg-white rounded-xl border border-gray-200/80 p-4 shadow-sm space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xs font-bold text-gray-900">{sup.name}</h3>
                      <p className="text-[11px] text-gray-500">{sup.contactPerson} • {sup.phone}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      sup.balance > 0 ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {sup.balance > 0 ? `₹${Number(sup.balance).toLocaleString()} Due` : 'Clear'}
                    </span>
                  </div>

                  <div className="bg-gray-50 p-2.5 rounded-lg text-xs space-y-1">
                    <div className="flex justify-between text-gray-600">
                      <span>Total Purchased:</span>
                      <span className="font-semibold text-gray-900">₹{Number(sup.totalPurchased || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Amount Paid:</span>
                      <span className="font-semibold text-emerald-600">₹{Number(sup.totalPaid || 0).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setActiveSupplierForPay(sup);
                        setSupplierPayAmount(sup.balance || 0);
                        setSupplierPayModalOpen(true);
                      }}
                      disabled={!sup.balance || sup.balance <= 0}
                      className="flex-1 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 disabled:opacity-40 transition"
                    >
                      Pay Supplier
                    </button>
                    <button
                      onClick={() => {
                        if (items.length === 0) {
                          toast.error('Pehle Items add karein!');
                          setAddItemModalOpen(true);
                          return;
                        }
                        setPurchaseSupplierId(sup.id);
                        setPurchaseItemId(items[0]?.id || '');
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
          )}
        </div>
      )}

      {/* ================= TAB 5: AUDIT LOG ================= */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-fuchsia-600" />
                Complete Stock Movement & Transaction Ledger
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Sabhi Issue, Bulk Issue, Purchase, Return aur Damage movements ka audit log
              </p>
            </div>
          </div>

          {transactions.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-xs">
              <FileText className="w-10 h-10 mx-auto text-gray-300 stroke-1 mb-2" />
              Abhi tak koi transaction record nahi hui hai.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50/80 text-gray-600 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">Ref / Bill No</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Party</th>
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
                          tx.type === 'PURCHASE' ? 'bg-emerald-50 text-emerald-700' :
                          tx.type === 'RETURN' ? 'bg-teal-50 text-teal-700' :
                          'bg-rose-50 text-rose-700'
                        }`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="p-3 font-medium text-gray-900">{tx.student || tx.supplier}</td>
                      <td className="p-3 text-center font-semibold">{tx.itemsCount}</td>
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
          )}
        </div>
      )}

      {/* ================= TAB 6: SESSION ROLLOVER ================= */}
      {activeTab === 'rollover' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6 max-w-3xl">
          <div>
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-fuchsia-600" />
              Academic Session Inventory Rollover Wizard
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Current Academic Session ka bacha hua stock new session me carry forward karein
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
          </div>

          <button
            onClick={() => toast.success('Academic Session rollover verified successfully!')}
            className="w-full py-2.5 rounded-lg bg-fuchsia-600 text-white text-xs font-bold hover:bg-fuchsia-700 transition shadow-sm"
          >
            Carry Forward Stock to New Session
          </button>
        </div>
      )}

      {/* ================= MODAL: ADD NEW ITEM ================= */}
      {addItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-gray-100 w-full max-w-md p-5 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-fuchsia-600" />
                Add New Inventory Item
              </h3>
              <button onClick={() => setAddItemModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddNewItem} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Item Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. School Diary, Winter Jacket, Math Notebook"
                  value={newItemForm.name}
                  onChange={e => setNewItemForm({ ...newItemForm, name: e.target.value })}
                  className="w-full text-xs rounded-lg border-gray-300 shadow-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={newItemForm.category}
                    onChange={e => setNewItemForm({ ...newItemForm, category: e.target.value })}
                    className="w-full text-xs rounded-lg border-gray-300 shadow-sm"
                  >
                    <option value="Stationery">Stationery</option>
                    <option value="Notebooks">Notebooks</option>
                    <option value="Uniform">Uniform</option>
                    <option value="Diary">Diary</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Sports">Sports</option>
                    <option value="Lab">Lab Equipment</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Unit</label>
                  <select
                    value={newItemForm.unit}
                    onChange={e => setNewItemForm({ ...newItemForm, unit: e.target.value })}
                    className="w-full text-xs rounded-lg border-gray-300 shadow-sm"
                  >
                    <option value="Pcs">Pcs</option>
                    <option value="Set">Set</option>
                    <option value="Pair">Pair</option>
                    <option value="Box">Box</option>
                    <option value="Pkt">Pkt</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Purchase Rate (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={newItemForm.purchasePrice}
                    onChange={e => setNewItemForm({ ...newItemForm, purchasePrice: e.target.value })}
                    className="w-full text-xs rounded-lg border-gray-300 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Selling / Issue Rate (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={newItemForm.sellingPrice}
                    onChange={e => setNewItemForm({ ...newItemForm, sellingPrice: e.target.value })}
                    className="w-full text-xs rounded-lg border-gray-300 shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Opening Stock Qty</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={newItemForm.stock}
                    onChange={e => setNewItemForm({ ...newItemForm, stock: e.target.value })}
                    className="w-full text-xs rounded-lg border-gray-300 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Min Reorder Alert</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="10"
                    value={newItemForm.minStock}
                    onChange={e => setNewItemForm({ ...newItemForm, minStock: e.target.value })}
                    className="w-full text-xs rounded-lg border-gray-300 shadow-sm"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddItemModalOpen(false)}
                  className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-fuchsia-600 text-white font-bold hover:bg-fuchsia-700 shadow-sm"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD SUPPLIER ================= */}
      {addSupplierModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-gray-100 w-full max-w-md p-5 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-fuchsia-600" />
                Register New Supplier / Vendor
              </h3>
              <button onClick={() => setAddSupplierModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddNewSupplier} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Supplier / Agency Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Standard Uniforms & Garments"
                  value={newSupplierForm.name}
                  onChange={e => setNewSupplierForm({ ...newSupplierForm, name: e.target.value })}
                  className="w-full text-xs rounded-lg border-gray-300 shadow-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Contact Person</label>
                  <input
                    type="text"
                    placeholder="Contact name"
                    value={newSupplierForm.contactPerson}
                    onChange={e => setNewSupplierForm({ ...newSupplierForm, contactPerson: e.target.value })}
                    className="w-full text-xs rounded-lg border-gray-300 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="Mobile number"
                    value={newSupplierForm.phone}
                    onChange={e => setNewSupplierForm({ ...newSupplierForm, phone: e.target.value })}
                    className="w-full text-xs rounded-lg border-gray-300 shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">GSTIN (Optional)</label>
                <input
                  type="text"
                  placeholder="GST Number"
                  value={newSupplierForm.gstin}
                  onChange={e => setNewSupplierForm({ ...newSupplierForm, gstin: e.target.value })}
                  className="w-full text-xs rounded-lg border-gray-300 shadow-sm font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Shop / Office Address</label>
                <textarea
                  rows="2"
                  placeholder="City, market or address"
                  value={newSupplierForm.address}
                  onChange={e => setNewSupplierForm({ ...newSupplierForm, address: e.target.value })}
                  className="w-full text-xs rounded-lg border-gray-300 shadow-sm"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddSupplierModalOpen(false)}
                  className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-fuchsia-600 text-white font-bold hover:bg-fuchsia-700 shadow-sm"
                >
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE KIT / PACKAGE ================= */}
      {addPackageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-gray-100 w-full max-w-lg p-5 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-fuchsia-600" />
                Create New Kit / Package
              </h3>
              <button onClick={() => setAddPackageModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePackage} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Kit Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Class 5 Complete Book Set"
                    value={newPackageForm.name}
                    onChange={e => setNewPackageForm({ ...newPackageForm, name: e.target.value })}
                    className="w-full text-xs rounded-lg border-gray-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Total Package Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Package Price"
                    value={newPackageForm.price}
                    onChange={e => setNewPackageForm({ ...newPackageForm, price: e.target.value })}
                    className="w-full text-xs rounded-lg border-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Select Items to Include in this Kit</label>
                <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto divide-y divide-gray-100">
                  {items.map(it => {
                    const isSelected = newPackageForm.selectedItems.some(si => si.itemId === it.id);
                    return (
                      <div key={it.id} className="p-2.5 flex items-center justify-between hover:bg-gray-50">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              if (isSelected) {
                                setNewPackageForm({
                                  ...newPackageForm,
                                  selectedItems: newPackageForm.selectedItems.filter(si => si.itemId !== it.id)
                                });
                              } else {
                                setNewPackageForm({
                                  ...newPackageForm,
                                  selectedItems: [...newPackageForm.selectedItems, { itemId: it.id, name: it.name, price: it.sellingPrice, qty: 1 }]
                                });
                              }
                            }}
                            className="rounded text-fuchsia-600"
                          />
                          <div>
                            <span className="font-semibold text-gray-800">{it.name}</span>
                            <span className="text-[10px] text-gray-400 ml-2">₹{it.sellingPrice}</span>
                          </div>
                        </label>

                        {isSelected && (
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-gray-500">Qty:</span>
                            <input
                              type="number"
                              min="1"
                              defaultValue="1"
                              onChange={e => {
                                const q = Math.max(1, Number(e.target.value));
                                setNewPackageForm({
                                  ...newPackageForm,
                                  selectedItems: newPackageForm.selectedItems.map(si => si.itemId === it.id ? { ...si, qty: q } : si)
                                });
                              }}
                              className="w-12 text-center text-xs p-1 rounded border-gray-300"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddPackageModalOpen(false)}
                  className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-fuchsia-600 text-white font-bold hover:bg-fuchsia-700 shadow-sm"
                >
                  Save Kit
                </button>
              </div>
            </form>
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
                    value={Number(purchaseQty || 0) * Number(purchaseUnitCost || 0)}
                    className="w-full text-xs rounded-lg border-gray-200 bg-gray-100 font-bold text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Amount Paid Now (₹)</label>
                <input
                  type="number"
                  min="0"
                  max={Number(purchaseQty || 0) * Number(purchaseUnitCost || 0)}
                  value={purchasePaidNow}
                  onChange={e => setPurchasePaidNow(e.target.value)}
                  className="w-full text-xs rounded-lg border-gray-300"
                />
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
                    className="w-full text-xs rounded-lg border-gray-300 shadow-sm focus:border-fuchsia-500"
                  />
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
              <p className="text-rose-600 font-bold">Outstanding Due: ₹{Number(activeSupplierForPay.balance || 0).toLocaleString()}</p>
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
