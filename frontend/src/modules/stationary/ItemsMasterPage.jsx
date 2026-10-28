import React, { useState, useEffect } from 'react';
import {
  Package,
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
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';

const INITIAL_ITEMS = [];

export function ItemsMasterPage({ onNavigate }) {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    shopName: 'J D Book',
    categoryName: 'Diary',
    barcode: '',
    hsnCode: '',
    itemName: '',
    rate: 100,
    openQty: 50,
    reorderQty: 10
  });

  useEffect(() => {
    fetch('/api/stationary/items')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.length) setItems(data.data);
      })
      .catch(() => {});
  }, []);

  const categories = ['All', ...new Set(items.map(i => i.categoryName))];

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      shopName: 'J D Book',
      categoryName: 'Diary',
      barcode: `BC-${Date.now().toString().slice(-6)}`,
      hsnCode: '4820',
      itemName: '',
      rate: 100,
      openQty: 50,
      reorderQty: 10
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setFormData({
      shopName: item.shopName,
      categoryName: item.categoryName,
      barcode: item.barcode,
      hsnCode: item.hsnCode,
      itemName: item.itemName,
      rate: item.rate,
      openQty: item.openQty,
      reorderQty: item.reorderQty
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.itemName) {
      toast.error('Item Name is required');
      return;
    }

    if (editingId) {
      setItems(prev => prev.map(i => i.id === editingId ? {
        ...i,
        ...formData,
        rate: Number(formData.rate),
        openQty: Number(formData.openQty),
        reorderQty: Number(formData.reorderQty)
      } : i));
      toast.success('Item updated successfully');
    } else {
      const newItem = {
        id: String(Date.now()),
        ...formData,
        rate: Number(formData.rate),
        openQty: Number(formData.openQty),
        reorderQty: Number(formData.reorderQty),
        purchasedQty: 0,
        issuedQty: 0,
        availableQty: Number(formData.openQty)
      };
      setItems(prev => [newItem, ...prev]);
      toast.success('Item registered successfully');

      fetch('/api/stationary/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      }).catch(() => {});
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this item?')) {
      setItems(prev => prev.filter(i => i.id !== id));
      toast.success('Item removed');
      fetch(`/api/stationary/items/${id}`, { method: 'DELETE' }).catch(() => {});
    }
  };

  const filteredItems = items.filter(i => {
    const matchesCat = categoryFilter === 'All' || i.categoryName === categoryFilter;
    const matchesSearch =
      i.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.barcode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (i.hsnCode && i.hsnCode.includes(searchQuery));
    return matchesCat && matchesSearch;
  });

  const exportCSV = () => {
    const headers = ['S.NO.', 'CATEGORY NAME', 'BARCODE', 'H.S.N CODE', 'ITEM NAME', 'RATE (₹)', 'AVAILABLE QTY'];
    const rows = filteredItems.map((i, idx) => [
      idx + 1,
      `"${i.categoryName}"`,
      `"${i.barcode}"`,
      `"${i.hsnCode}"`,
      `"${i.itemName}"`,
      i.rate,
      i.availableQty
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Stationary_Items_${new Date().toISOString().slice(0, 10)}.csv`;
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
          <span className="text-indigo-600 text-sm font-semibold">Items Master</span>
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
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Item
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search item name, barcode, HSN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
            >
              {categories.map((c, i) => (
                <option key={i} value={c}>Category: {c}</option>
              ))}
            </select>
          </div>

          <span className="text-xs text-slate-500">
            Showing {filteredItems.length} of {items.length} Items
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3 text-center w-12">S.NO.</th>
                <th className="py-3 px-3">CATEGORY NAME</th>
                <th className="py-3 px-3">H.S.N CODE</th>
                <th className="py-3 px-4">ITEM NAME</th>
                <th className="py-3 px-3 text-right">RATE (₹)</th>
                <th className="py-3 px-3 text-center">AVAILABLE STOCK</th>
                <th className="py-3 px-3 text-center w-28">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length > 0 ? (
                filteredItems.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 text-center font-medium text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700">
                        {item.categoryName}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-500">{item.hsnCode || '—'}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      <div>{item.itemName}</div>
                      <div className="text-[11px] font-mono text-slate-400">{item.barcode}</div>
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-800">₹{item.rate}</td>
                    <td className="py-3 px-3 text-center">
                      <span className={`font-semibold ${item.availableQty <= (item.reorderQty || 10) ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {item.availableQty}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition-colors"
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
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No items found matching the filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: ITEMS MASTER */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <Package className="w-4 h-4 text-indigo-600" />
                ITEMS MASTER
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Select Shop</label>
                  <select
                    value={formData.shopName}
                    onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                  >
                    <option value="J D Book">J D Book</option>
                    <option value="J D Uniform">J D Uniform</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Select Category</label>
                  <select
                    value={formData.categoryName}
                    onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                  >
                    <option value="Diary">Diary</option>
                    <option value="Uniform">Uniform</option>
                    <option value="Note Books">Note Books</option>
                    <option value="Register">Register</option>
                    <option value="Sports Wear">Sports Wear</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Item Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. T Shirt- W (22) or School Diary"
                  value={formData.itemName}
                  onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Item Barcode</label>
                  <input
                    type="text"
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">H.S.N Code</label>
                  <input
                    type="text"
                    value={formData.hsnCode}
                    onChange={(e) => setFormData({ ...formData, hsnCode: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Rate (₹) <span className="text-rose-500">*</span></label>
                  <input
                    type="number"
                    min="0"
                    value={formData.rate}
                    onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Open Quantity</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.openQty}
                    onChange={(e) => setFormData({ ...formData, openQty: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Reorder Quantity</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.reorderQty}
                    onChange={(e) => setFormData({ ...formData, reorderQty: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all"
                >
                  {editingId ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export default ItemsMasterPage;
