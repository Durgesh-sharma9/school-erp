import React, { useState, useEffect, useMemo } from 'react';
import {
  Package,
  Tag,
  Search,
  Home,
  Plus,
  Trash2,
  Edit2,
  Printer,
  FileDown,
  X,
  Layers,
  CheckCircle2,
  AlertTriangle,
  FolderPlus,
  ChevronRight,
  Filter,
  Check,
  Building,
  BookOpen,
  Shirt,
  Notebook,
  PenTool,
  Award,
  FlaskConical,
  GraduationCap,
  Globe,
  Barcode,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

// Available School Classes
const SCHOOL_CLASSES = [
  'Nursery', 'LKG', 'UKG',
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
  'Class 11', 'Class 12'
];

// Category Item Types / Nature
const CATEGORY_TYPES = [
  { id: 'Books', label: 'Books & Textbooks', icon: BookOpen, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { id: 'Uniform', label: 'Uniform & Dress', icon: Shirt, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  { id: 'Notebooks', label: 'Notebooks & Registers', icon: Notebook, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { id: 'Stationery', label: 'Stationery & Writing', icon: PenTool, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { id: 'Sports', label: 'Sports & Games Kit', icon: Award, color: 'text-rose-600 bg-rose-50 border-rose-200' },
  { id: 'Lab', label: 'Lab & Science Equipment', icon: FlaskConical, color: 'text-teal-600 bg-teal-50 border-teal-200' },
  { id: 'General', label: 'General / Accessories', icon: Package, color: 'text-slate-600 bg-slate-50 border-slate-200' }
];

export function ItemsMasterPage({ onNavigate }) {
  // State: Data
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL'); // 'ALL' or categoryName

  // State: Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState('ALL'); // 'ALL' | 'IN_STOCK' | 'LOW_STOCK'
  const [categorySearch, setCategorySearch] = useState('');

  // State: Quick Inline Category
  const [quickCatName, setQuickCatName] = useState('');

  // State: Item Modal
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [itemForm, setItemForm] = useState({
    shopName: 'Main Store',
    categoryName: '',
    barcode: '',
    hsnCode: '',
    itemName: '',
    rate: '',
    openQty: '',
    reorderQty: '10'
  });

  // State: Category Modal
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCatId, setEditingCatId] = useState(null);
  const [catForm, setCatForm] = useState({
    categoryName: '',
    categoryType: 'Books',
    issueScope: 'ALL', // 'ALL' | 'SPECIFIC'
    applicableClasses: [],
    shopName: 'Main Store',
    percentage: 0,
    remark: ''
  });

  // Load Data from Backend
  const loadItems = () => {
    fetch('/api/stationary/items')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) setItems(data.data);
      })
      .catch(() => {});
  };

  const loadCategories = () => {
    fetch('/api/stationary/categories')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) setCategories(data.data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadItems();
    loadCategories();
  }, []);

  // Quick Add Category from Left Sidebar Input
  const handleQuickAddCategory = async (e) => {
    e?.preventDefault();
    const name = quickCatName.trim();
    if (!name) return;

    if (categories.some(c => c.categoryName.toLowerCase() === name.toLowerCase())) {
      toast.error('Category already exists');
      return;
    }

    try {
      const res = await fetch('/api/stationary/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryName: name,
          categoryType: 'General',
          issueScope: 'ALL',
          applicableClasses: []
        })
      });
      const d = await res.json();
      if (d.success) {
        toast.success(`Category "${name}" created!`);
        setQuickCatName('');
        loadCategories();
        setSelectedCategory(name);
      } else {
        toast.error(d.message || 'Failed to create category');
      }
    } catch {
      toast.error('Server error creating category');
    }
  };

  // Open Item Modal (Pre-fills selected category!)
  const openAddItemModal = () => {
    setEditingItemId(null);
    setItemForm({
      shopName: 'Main Store',
      categoryName: selectedCategory !== 'ALL' ? selectedCategory : (categories[0]?.categoryName || ''),
      barcode: '',
      hsnCode: '',
      itemName: '',
      rate: '',
      openQty: '',
      reorderQty: '10'
    });
    setIsItemModalOpen(true);
  };

  const handleGenerateBarcode = () => {
    const randomCode = `BC-${Math.floor(100000 + Math.random() * 900000)}`;
    setItemForm(prev => ({ ...prev, barcode: randomCode }));
    toast.success(`Generated Barcode: ${randomCode}`);
  };

  const openEditItemModal = (item) => {
    setEditingItemId(item.id);
    setItemForm({
      shopName: item.shopName || 'Main Store',
      categoryName: item.categoryName || '',
      barcode: item.barcode || '',
      hsnCode: item.hsnCode || '',
      itemName: item.itemName || '',
      rate: item.rate !== undefined && item.rate !== null ? String(item.rate) : '',
      openQty: item.openQty !== undefined && item.openQty !== null ? String(item.openQty) : '',
      reorderQty: item.reorderQty !== undefined && item.reorderQty !== null ? String(item.reorderQty) : '10'
    });
    setIsItemModalOpen(true);
  };

  // Save Item
  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (!itemForm.itemName.trim()) {
      toast.error('Item Name is required');
      return;
    }
    if (!itemForm.categoryName.trim()) {
      toast.error('Please select or specify a Category');
      return;
    }

    try {
      // If category doesn't exist in categories, auto-add it
      if (!categories.some(c => c.categoryName.toLowerCase() === itemForm.categoryName.trim().toLowerCase())) {
        await fetch('/api/stationary/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            categoryName: itemForm.categoryName.trim(),
            categoryType: 'General',
            issueScope: 'ALL'
          })
        });
        loadCategories();
      }

      const payload = {
        ...itemForm,
        rate: itemForm.rate === '' ? 0 : Number(itemForm.rate) || 0,
        openQty: itemForm.openQty === '' ? 0 : Number(itemForm.openQty) || 0,
        reorderQty: itemForm.reorderQty === '' ? 10 : Number(itemForm.reorderQty) || 10
      };

      if (editingItemId) {
        const res = await fetch(`/api/stationary/items/${editingItemId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const d = await res.json();
        if (d.success) {
          toast.success('Item updated successfully');
          loadItems();
          loadCategories();
          setIsItemModalOpen(false);
        } else {
          toast.error(d.message || 'Failed to update item');
        }
      } else {
        const res = await fetch('/api/stationary/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const d = await res.json();
        if (d.success) {
          toast.success('Item registered successfully');
          loadItems();
          loadCategories();
          setIsItemModalOpen(false);
        } else {
          toast.error(d.message || 'Failed to register item');
        }
      }
    } catch {
      toast.error('Server error saving item');
    }
  };

  // Delete Item
  const handleDeleteItem = async (id, name) => {
    if (window.confirm(`Delete item "${name}"?`)) {
      try {
        const res = await fetch(`/api/stationary/items/${id}`, { method: 'DELETE' });
        const d = await res.json();
        if (d.success) {
          toast.success('Item removed');
          loadItems();
          loadCategories();
        } else {
          toast.error(d.message || 'Failed to delete item');
        }
      } catch {
        toast.error('Server error deleting item');
      }
    }
  };

  // Category Modal Handlers
  const openAddCategoryModal = () => {
    setEditingCatId(null);
    setCatForm({
      categoryName: '',
      categoryType: 'Books',
      issueScope: 'ALL',
      applicableClasses: [],
      shopName: 'Main Store',
      percentage: 0,
      remark: ''
    });
    setIsCategoryModalOpen(true);
  };

  const openEditCategoryModal = (cat, e) => {
    e?.stopPropagation();
    setEditingCatId(cat.id);
    setCatForm({
      categoryName: cat.categoryName || '',
      categoryType: cat.categoryType || 'General',
      issueScope: cat.issueScope || 'ALL',
      applicableClasses: Array.isArray(cat.applicableClasses) ? cat.applicableClasses : [],
      shopName: cat.shopName || 'Main Store',
      percentage: cat.percentage || 0,
      remark: cat.remark || ''
    });
    setIsCategoryModalOpen(true);
  };

  const handleToggleClass = (className) => {
    setCatForm(prev => {
      const exists = prev.applicableClasses.includes(className);
      const updated = exists
        ? prev.applicableClasses.filter(c => c !== className)
        : [...prev.applicableClasses, className];
      return { ...prev, applicableClasses: updated };
    });
  };

  const handleSelectAllClasses = () => {
    setCatForm(prev => ({
      ...prev,
      applicableClasses: prev.applicableClasses.length === SCHOOL_CLASSES.length ? [] : [...SCHOOL_CLASSES]
    }));
  };

  const handleSelectClassRange = (rangeType) => {
    let selected = [];
    if (rangeType === 'PRIMARY') selected = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'];
    if (rangeType === 'MIDDLE') selected = ['Class 6', 'Class 7', 'Class 8'];
    if (rangeType === 'SECONDARY') selected = ['Class 9', 'Class 10', 'Class 11', 'Class 12'];
    if (rangeType === 'PREPRIMARY') selected = ['Nursery', 'LKG', 'UKG'];

    setCatForm(prev => {
      const merged = Array.from(new Set([...prev.applicableClasses, ...selected]));
      return { ...prev, applicableClasses: merged };
    });
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!catForm.categoryName.trim()) {
      toast.error('Category Name is required');
      return;
    }
    if (catForm.issueScope === 'SPECIFIC' && catForm.applicableClasses.length === 0) {
      toast.error('Please select at least one class for specific issuance');
      return;
    }

    try {
      if (editingCatId) {
        const res = await fetch(`/api/stationary/categories/${editingCatId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(catForm)
        });
        const d = await res.json();
        if (d.success) {
          toast.success('Category updated successfully');
          loadCategories();
          loadItems();
          setIsCategoryModalOpen(false);
        } else {
          toast.error(d.message || 'Failed to update category');
        }
      } else {
        const res = await fetch('/api/stationary/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(catForm)
        });
        const d = await res.json();
        if (d.success) {
          toast.success('Category created successfully');
          loadCategories();
          setIsCategoryModalOpen(false);
        } else {
          toast.error(d.message || 'Failed to create category');
        }
      }
    } catch {
      toast.error('Server error saving category');
    }
  };

  const handleDeleteCategory = async (cat, e) => {
    e?.stopPropagation();
    if (window.confirm(`Delete category "${cat.categoryName}"?`)) {
      try {
        const res = await fetch(`/api/stationary/categories/${cat.id}`, { method: 'DELETE' });
        const d = await res.json();
        if (d.success) {
          toast.success('Category deleted');
          if (selectedCategory === cat.categoryName) setSelectedCategory('ALL');
          loadCategories();
          loadItems();
        } else {
          toast.error(d.message || 'Failed to delete category');
        }
      } catch {
        toast.error('Server error deleting category');
      }
    }
  };

  // Filter Categories on the left
  const filteredCategoriesList = useMemo(() => {
    return categories.filter(c =>
      (c.categoryName || '').toLowerCase().includes(categorySearch.toLowerCase()) ||
      (c.categoryType || '').toLowerCase().includes(categorySearch.toLowerCase())
    );
  }, [categories, categorySearch]);

  // Filter Items on the right
  const filteredItems = useMemo(() => {
    return items.filter(it => {
      const matchesCategory = selectedCategory === 'ALL' || (it.categoryName || '').toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        (it.itemName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (it.barcode || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (it.hsnCode || '').toLowerCase().includes(searchQuery.toLowerCase());

      const stock = Number(it.availableQty || 0);
      const min = Number(it.reorderQty || 10);
      let matchesStock = true;
      if (stockFilter === 'IN_STOCK') matchesStock = stock > min;
      if (stockFilter === 'LOW_STOCK') matchesStock = stock <= min;

      return matchesCategory && matchesSearch && matchesStock;
    });
  }, [items, selectedCategory, searchQuery, stockFilter]);

  // Export CSV
  const exportCSV = () => {
    const headers = ['S.NO.', 'CATEGORY', 'ITEM NAME', 'BARCODE', 'H.S.N CODE', 'RATE (₹)', 'AVAILABLE STOCK'];
    const rows = filteredItems.map((i, idx) => [
      idx + 1,
      `"${i.categoryName}"`,
      `"${i.itemName}"`,
      `"${i.barcode || ''}"`,
      `"${i.hsnCode || ''}"`,
      i.rate,
      i.availableQty
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Inventory_Items_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 text-slate-800 space-y-4">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={() => onNavigate?.('/dashboard')}
              className="text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1 text-xs font-medium"
            >
              <Home className="w-3.5 h-3.5" />
              Home
            </button>
            <span className="text-slate-400 text-xs">/</span>
            <button
              onClick={() => onNavigate?.('/inventory-hub')}
              className="text-slate-500 hover:text-indigo-600 transition-colors text-xs font-medium"
            >
              Inventory Hub
            </button>
            <span className="text-slate-400 text-xs">/</span>
            <span className="text-indigo-600 text-xs font-semibold">Category & Items Master</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-600" />
            Category & Items Master Studio
          </h1>
          <p className="text-xs text-slate-500">
            Define categories with item nature (Books, Uniform, etc.) and class applicability on the left; manage items on the right.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-sm transition-all"
          >
            <FileDown className="w-3.5 h-3.5 text-emerald-600" />
            Export CSV
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-sm transition-all"
          >
            <Printer className="w-3.5 h-3.5 text-blue-600" />
            Print
          </button>
          <button
            onClick={openAddCategoryModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 shadow-sm transition-all"
          >
            <Tag className="w-3.5 h-3.5 text-indigo-600" />
            + Add Category
          </button>
          <button
            onClick={openAddItemModal}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            + Add Item
          </button>
        </div>
      </div>

      {/* Unified 2-Panel Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ================= LEFT PANEL: CATEGORIES MASTER ================= */}
        <div className="lg:col-span-4 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          {/* Categories Header */}
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">Item Categories</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700">
                {categories.length}
              </span>
            </div>
            <button
              onClick={openAddCategoryModal}
              className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-0.5"
              title="Add New Category"
            >
              <Plus className="w-3.5 h-3.5" /> New Category
            </button>
          </div>

          {/* Quick Add Inline Bar */}
          <form onSubmit={handleQuickAddCategory} className="p-2.5 border-b border-slate-100 bg-white">
            <div className="flex gap-1.5">
              <input
                type="text"
                placeholder="Quick category name..."
                value={quickCatName}
                onChange={e => setQuickCatName(e.target.value)}
                className="flex-1 px-2.5 py-1 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={!quickCatName.trim()}
                className="px-2.5 py-1 bg-indigo-600 disabled:bg-slate-200 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition"
              >
                Add
              </button>
            </div>
          </form>

          {/* Search Categories */}
          {categories.length > 5 && (
            <div className="px-2.5 py-2 border-b border-slate-100">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                <input
                  type="text"
                  placeholder="Filter categories..."
                  value={categorySearch}
                  onChange={e => setCategorySearch(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1 text-[11px] rounded-md border border-slate-200 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Categories List */}
          <div className="divide-y divide-slate-100 max-h-[620px] overflow-y-auto">
            {/* ALL ITEMS OPTION */}
            <button
              type="button"
              onClick={() => setSelectedCategory('ALL')}
              className={`w-full px-3.5 py-3 text-left text-xs flex items-center justify-between transition-colors ${
                selectedCategory === 'ALL'
                  ? 'bg-indigo-50/80 text-indigo-900 font-bold border-l-4 border-indigo-600'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold">All Categories</div>
                  <div className="text-[10px] text-slate-400 font-normal">Entire school inventory</div>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                selectedCategory === 'ALL' ? 'bg-indigo-200 text-indigo-800' : 'bg-slate-100 text-slate-600'
              }`}>
                {items.length} items
              </span>
            </button>

            {/* DYNAMIC CATEGORIES */}
            {filteredCategoriesList.length > 0 ? (
              filteredCategoriesList.map((cat) => {
                const count = items.filter(it => (it.categoryName || '').toLowerCase() === cat.categoryName.toLowerCase()).length;
                const isSelected = selectedCategory.toLowerCase() === cat.categoryName.toLowerCase();
                const typeObj = CATEGORY_TYPES.find(t => t.id === cat.categoryType) || CATEGORY_TYPES[6];
                const TypeIcon = typeObj.icon;

                const classesText = cat.issueScope === 'SPECIFIC' && cat.applicableClasses?.length
                  ? (cat.applicableClasses.length > 3
                      ? `${cat.applicableClasses.slice(0, 2).join(', ')} +${cat.applicableClasses.length - 2}`
                      : cat.applicableClasses.join(', '))
                  : 'All Classes';

                return (
                  <div
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.categoryName)}
                    className={`group px-3.5 py-2.5 text-left text-xs flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-indigo-50/80 text-indigo-900 font-bold border-l-4 border-indigo-600'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate pr-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border ${typeObj.color}`}>
                        <TypeIcon className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate">
                        <div className="truncate font-semibold text-slate-800">{cat.categoryName}</div>
                        <div className="flex items-center gap-1.5 text-[10px] font-normal text-slate-500 mt-0.5">
                          <span className="text-indigo-600 font-medium">{cat.categoryType || 'General'}</span>
                          <span>•</span>
                          <span className="text-slate-500">{classesText}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        count > 0
                          ? (isSelected ? 'bg-indigo-200 text-indigo-800' : 'bg-emerald-50 text-emerald-700 border border-emerald-200')
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {count}
                      </span>

                      {/* Edit / Delete Icons */}
                      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity">
                        <button
                          type="button"
                          onClick={(e) => openEditCategoryModal(cat, e)}
                          className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-blue-600"
                          title="Edit Category Details"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteCategory(cat, e)}
                          className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-rose-600"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : categories.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                <Tag className="w-6 h-6 mx-auto mb-1.5 text-slate-300" />
                <p className="font-semibold text-slate-600">No categories created</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Click "+ New Category" to create your first category.</p>
              </div>
            ) : (
              <div className="p-4 text-center text-slate-400 text-xs">
                No matching category found.
              </div>
            )}
          </div>
        </div>

        {/* ================= RIGHT PANEL: ITEMS MASTER ================= */}
        <div className="lg:col-span-8 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          {/* Header Bar */}
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Items in {selectedCategory === 'ALL' ? 'All Categories' : `"${selectedCategory}"`}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                  {filteredItems.length} items
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Search Items */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                <input
                  type="text"
                  placeholder="Search item name, barcode..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-2.5 py-1 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500 w-48 sm:w-56"
                />
              </div>

              {/* Stock Filter */}
              <select
                value={stockFilter}
                onChange={e => setStockFilter(e.target.value)}
                className="text-xs rounded-lg border border-slate-300 px-2 py-1 bg-white focus:outline-none focus:border-indigo-500"
              >
                <option value="ALL">All Stock</option>
                <option value="IN_STOCK">In Stock</option>
                <option value="LOW_STOCK">Low Stock</option>
              </select>

              <button
                onClick={openAddItemModal}
                className="flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 shadow-sm transition"
              >
                <Plus className="w-3 h-3" />
                Add Item
              </button>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3 text-center w-12">S.NO.</th>
                  <th className="py-3 px-4">ITEM NAME</th>
                  <th className="py-3 px-3">CATEGORY</th>
                  <th className="py-3 px-3">HSN CODE</th>
                  <th className="py-3 px-3 text-right">RATE (₹)</th>
                  <th className="py-3 px-3 text-center">STOCK</th>
                  <th className="py-3 px-3 text-center w-24">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item, idx) => {
                    const isLow = Number(item.availableQty || 0) <= Number(item.reorderQty || 10);
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-3 text-center font-medium text-slate-400">{idx + 1}</td>
                        <td className="py-3 px-4 font-semibold text-slate-800">
                          <div>{item.itemName}</div>
                          {item.barcode && (
                            <div className="text-[10px] font-mono text-slate-400">{item.barcode}</div>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <button
                            type="button"
                            onClick={() => setSelectedCategory(item.categoryName)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition"
                          >
                            <Tag className="w-2.5 h-2.5 text-indigo-500" />
                            {item.categoryName}
                          </button>
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-500">{item.hsnCode || '—'}</td>
                        <td className="py-3 px-3 text-right font-bold text-slate-800">₹{item.rate}</td>
                        <td className="py-3 px-3 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            isLow
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}>
                            {item.availableQty} Pcs
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => openEditItemModal(item)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="Edit Item"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id, item.itemName)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition-colors"
                              title="Delete Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <Package className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      <p className="font-semibold text-slate-600">
                        {selectedCategory === 'ALL'
                          ? 'No inventory items created yet.'
                          : `No items in category "${selectedCategory}".`}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Click "+ Add Item" to register your first item under this category.
                      </p>
                      <button
                        onClick={openAddItemModal}
                        className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add First Item
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ================= MODAL: ADD / EDIT ITEM ================= */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-y-auto border border-slate-200 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <Package className="w-4 h-4 text-indigo-600" />
                {editingItemId ? 'Edit Inventory Item' : 'Add New Inventory Item'}
              </h3>
              <button
                onClick={() => setIsItemModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="p-6 space-y-4">
              {/* Category Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category <span className="text-rose-500">*</span>
                </label>
                {categories.length > 0 ? (
                  <select
                    value={itemForm.categoryName}
                    onChange={(e) => setItemForm({ ...itemForm, categoryName: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                    required
                  >
                    <option value="">Select Category...</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.categoryName}>{c.categoryName} ({c.categoryType || 'General'})</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder="e.g. Books, Uniform..."
                    value={itemForm.categoryName}
                    onChange={(e) => setItemForm({ ...itemForm, categoryName: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    required
                  />
                )}
              </div>

              {/* Item Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Item Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mathematics Textbook Class 1, School Diary, Winter Jacket"
                  value={itemForm.itemName}
                  onChange={(e) => setItemForm({ ...itemForm, itemName: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  required
                  autoFocus
                />
              </div>

              {/* Barcode & HSN */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">Barcode / Code</label>
                    <button
                      type="button"
                      onClick={handleGenerateBarcode}
                      className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/60 px-2 py-0.5 rounded flex items-center gap-1 transition-colors"
                      title="Generate new random barcode"
                    >
                      <Sparkles className="w-3 h-3 text-indigo-600" />
                      Auto Generate
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter or scan barcode..."
                      value={itemForm.barcode}
                      onChange={(e) => setItemForm({ ...itemForm, barcode: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono pr-7"
                    />
                    {itemForm.barcode && (
                      <button
                        type="button"
                        onClick={() => setItemForm({ ...itemForm, barcode: '' })}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs px-1"
                        title="Clear barcode"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">HSN Code</label>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. 4820"
                    value={itemForm.hsnCode}
                    onChange={(e) => setItemForm({ ...itemForm, hsnCode: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              {/* Rate & Stocks */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Selling Rate (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={itemForm.rate}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setItemForm({ ...itemForm, rate: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Opening Stock</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={itemForm.openQty}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setItemForm({ ...itemForm, openQty: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Min Alert Level</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="10"
                    value={itemForm.reorderQty}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setItemForm({ ...itemForm, reorderQty: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 pb-1 border-t border-slate-100 sticky bottom-0 bg-white z-10">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
                >
                  {editingItemId ? 'Update Item' : 'Save Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT CATEGORY (WITH NATURE & APPLICABLE CLASSES) ================= */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto border border-slate-200 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50 sticky top-0 z-10">
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <Tag className="w-4 h-4 text-indigo-600" />
                {editingCatId ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="p-4 sm:p-5 space-y-3.5 text-xs">
              {/* 1. Category Name */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Category Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Primary NCERT Textbooks, Junior Summer Uniform, Exam Stationery"
                  value={catForm.categoryName}
                  onChange={(e) => setCatForm({ ...catForm, categoryName: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  required
                  autoFocus
                />
              </div>

              {/* 2. Category Nature / Item Type */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Item Type / Nature (Kya cheez hai?) <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {CATEGORY_TYPES.map(type => {
                    const isSelected = catForm.categoryType === type.id;
                    const IconComp = type.icon;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setCatForm({ ...catForm, categoryType: type.id })}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-indigo-50 border-indigo-600 text-indigo-900 font-bold ring-2 ring-indigo-500/20 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                          <IconComp className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs leading-tight whitespace-normal">{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Applicable Classes / Whom to Issue */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                <label className="block font-semibold text-slate-800">
                  Target Audience (Kisko Issue Hogi?)
                </label>

                {/* Scope Radio Toggle */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCatForm({ ...catForm, issueScope: 'ALL', applicableClasses: [] })}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-left transition-all ${
                      catForm.issueScope === 'ALL'
                        ? 'bg-white border-indigo-600 text-indigo-900 font-bold ring-2 ring-indigo-500/20 shadow-xs'
                        : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
                    }`}
                  >
                    <Globe className={`w-4 h-4 ${catForm.issueScope === 'ALL' ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <div>
                      <div className="font-semibold text-xs">All Classes (Universal)</div>
                      <div className="text-[10px] text-slate-400 font-normal">Diaries, ID Cards, General Badges</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCatForm({ ...catForm, issueScope: 'SPECIFIC' })}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-left transition-all ${
                      catForm.issueScope === 'SPECIFIC'
                        ? 'bg-white border-indigo-600 text-indigo-900 font-bold ring-2 ring-indigo-500/20 shadow-xs'
                        : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
                    }`}
                  >
                    <GraduationCap className={`w-4 h-4 ${catForm.issueScope === 'SPECIFIC' ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <div>
                      <div className="font-semibold text-xs">Specific Classes Only</div>
                      <div className="text-[10px] text-slate-400 font-normal">Select particular grades</div>
                    </div>
                  </button>
                </div>

                {/* Specific Class Selector Pills */}
                {catForm.issueScope === 'SPECIFIC' && (
                  <div className="pt-2 border-t border-slate-200/60 space-y-2">
                    {/* Quick Range Selectors */}
                    <div className="flex flex-wrap items-center justify-between gap-1 text-[10px]">
                      <span className="font-medium text-slate-500">Quick Select:</span>
                      <div className="flex flex-wrap gap-1">
                        <button
                          type="button"
                          onClick={() => handleSelectClassRange('PREPRIMARY')}
                          className="px-2 py-0.5 bg-white border border-slate-200 rounded hover:bg-slate-100 text-slate-700"
                        >
                          Pre-Primary
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSelectClassRange('PRIMARY')}
                          className="px-2 py-0.5 bg-white border border-slate-200 rounded hover:bg-slate-100 text-slate-700"
                        >
                          Primary (1-5)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSelectClassRange('MIDDLE')}
                          className="px-2 py-0.5 bg-white border border-slate-200 rounded hover:bg-slate-100 text-slate-700"
                        >
                          Middle (6-8)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSelectClassRange('SECONDARY')}
                          className="px-2 py-0.5 bg-white border border-slate-200 rounded hover:bg-slate-100 text-slate-700"
                        >
                          Secondary (9-12)
                        </button>
                        <button
                          type="button"
                          onClick={handleSelectAllClasses}
                          className="px-2 py-0.5 bg-indigo-50 border border-indigo-200 rounded text-indigo-700 font-bold"
                        >
                          {catForm.applicableClasses.length === SCHOOL_CLASSES.length ? 'Clear All' : 'Select All'}
                        </button>
                      </div>
                    </div>

                    {/* Class Checkboxes / Chips */}
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 pt-1">
                      {SCHOOL_CLASSES.map(cls => {
                        const isChecked = catForm.applicableClasses.includes(cls);
                        return (
                          <button
                            key={cls}
                            type="button"
                            onClick={() => handleToggleClass(cls)}
                            className={`px-2 py-1.5 rounded-md border text-[11px] font-semibold text-center transition flex items-center justify-center gap-1 ${
                              isChecked
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 flex-shrink-0" />}
                            <span>{cls}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* 4. GST Tax */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">GST Tax (%) (Optional)</label>
                <select
                  value={catForm.percentage}
                  onChange={(e) => setCatForm({ ...catForm, percentage: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                >
                  <option value="0">0% (Nil / Exempted)</option>
                  <option value="5">5% (Standard Books & Uniform)</option>
                  <option value="12">12%</option>
                  <option value="18">18% (Standard Stationery)</option>
                  <option value="28">28%</option>
                </select>
              </div>

              {/* Form Action Buttons */}
              <div className="flex justify-end gap-2 pt-3 pb-1 border-t border-slate-100 sticky bottom-0 bg-white z-10">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
                >
                  {editingCatId ? 'Update Category' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
