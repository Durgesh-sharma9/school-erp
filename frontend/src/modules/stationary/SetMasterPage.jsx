import React, { useState, useEffect } from 'react';
import {
  Layers,
  Search,
  Home,
  Plus,
  Trash2,
  Printer,
  FileDown,
  X,
  Package,
  Eye,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

const INITIAL_SETS = [];

export function SetMasterPage({ onNavigate }) {
  const [sets, setSets] = useState(INITIAL_SETS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewSet, setViewSet] = useState(null);

  const [formData, setFormData] = useState({
    setCode: `SET-${Date.now().toString().slice(-4)}`,
    className: 'Class I',
    categoryName: 'Books & Note Books',
    setName: '',
    items: [
      { itemName: 'School Diary 2026-27', qty: 1, rate: 150 }
    ]
  });

  useEffect(() => {
    fetch('/api/stationary/sets')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.length) setSets(data.data);
      })
      .catch(() => {});
  }, []);

  const openAddModal = () => {
    setFormData({
      setCode: `SET-${Date.now().toString().slice(-4)}`,
      className: 'Class I',
      categoryName: 'Books & Note Books',
      setName: '',
      items: [
        { itemName: 'School Diary 2026-27', qty: 1, rate: 150 }
      ]
    });
    setIsModalOpen(true);
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...formData.items];
    updated[index][field] = value;
    setFormData({ ...formData, items: updated });
  };

  const addItemRow = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { itemName: '', qty: 1, rate: 100 }]
    });
  };

  const removeItemRow = (idx) => {
    if (formData.items.length <= 1) return;
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== idx)
    });
  };

  const totalCost = formData.items.reduce((s, it) => s + ((Number(it.qty) || 0) * (Number(it.rate) || 0)), 0);

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.setName) {
      toast.error('Set Name is required');
      return;
    }

    const newSet = {
      id: String(Date.now()),
      setCode: formData.setCode,
      className: formData.className,
      categoryName: formData.categoryName,
      setName: formData.setName,
      noOfItems: formData.items.length,
      totalCost,
      items: formData.items
    };

    setSets(prev => [newSet, ...prev]);
    toast.success('Stationary Kit / Set configured successfully');
    setIsModalOpen(false);

    fetch('/api/stationary/sets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSet)
    }).catch(() => {});
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this set configuration?')) {
      setSets(prev => prev.filter(s => s.id !== id));
      toast.success('Set removed');
      fetch(`/api/stationary/sets/${id}`, { method: 'DELETE' }).catch(() => {});
    }
  };

  const filteredSets = sets.filter(s =>
    s.setName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportCSV = () => {
    const headers = ['S.NO.', 'SET CODE', 'CLASS', 'SET NAME', 'CATEGORIES', 'NO OF ITEMS', 'TOTAL COST (₹)'];
    const rows = filteredSets.map((s, idx) => [
      idx + 1,
      `"${s.setCode}"`,
      `"${s.className}"`,
      `"${s.setName}"`,
      `"${s.categoryName}"`,
      s.noOfItems,
      s.totalCost
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Stationary_Sets_${new Date().toISOString().slice(0, 10)}.csv`;
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
          <span className="text-indigo-600 text-sm font-semibold">Set Master</span>
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
            Add Set
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Search */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search set name, class..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
          <span className="text-xs text-slate-500">
            Showing {filteredSets.length} of {sets.length} Sets
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 text-center w-16">S.NO.</th>
                <th className="py-3 px-4">CLASS</th>
                <th className="py-3 px-4">SET NAME</th>
                <th className="py-3 px-4">CATEGORIES</th>
                <th className="py-3 px-4 text-center">NO OF ITEMS</th>
                <th className="py-3 px-4 text-right">TOTAL COST (₹)</th>
                <th className="py-3 px-4 text-center w-28">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSets.length > 0 ? (
                filteredSets.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-center font-medium text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{s.className}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{s.setName}</div>
                      <span className="font-mono text-[11px] text-indigo-600">{s.setCode}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{s.categoryName}</td>
                    <td className="py-3 px-4 text-center font-bold text-slate-700">{s.noOfItems}</td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-700">₹{s.totalCost}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setViewSet(s)}
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded transition-colors"
                          title="View Set Contents"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
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
                    No kit/set configurations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: SET MASTER */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50 sticky top-0 z-10">
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                SET MASTER
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Set Code</label>
                  <input
                    type="text"
                    value={formData.setCode}
                    onChange={(e) => setFormData({ ...formData, setCode: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Class</label>
                  <select
                    value={formData.className}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                  >
                    <option value="Nursery">Nursery</option>
                    <option value="LKG">LKG</option>
                    <option value="UKG">UKG</option>
                    <option value="Class I">Class I</option>
                    <option value="Class II">Class II</option>
                    <option value="Class III">Class III</option>
                    <option value="Class IV">Class IV</option>
                    <option value="Class V">Class V</option>
                    <option value="Class VI - X">Class VI - X</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Select Category</label>
                  <select
                    value={formData.categoryName}
                    onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                  >
                    <option value="Books & Note Books">Books & Note Books</option>
                    <option value="Uniform">Uniform</option>
                    <option value="Stationery Combo">Stationery Combo</option>
                    <option value="Exam Kit">Exam Kit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Set Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Class I Complete Academic Kit"
                    value={formData.setName}
                    onChange={(e) => setFormData({ ...formData, setName: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="pt-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-slate-700">Set Items</span>
                  <button
                    type="button"
                    onClick={addItemRow}
                    className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Item
                  </button>
                </div>

                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3">ITEM NAME</th>
                        <th className="py-2 px-3 w-20">ITEM QTY.</th>
                        <th className="py-2 px-3 w-24">RATE (₹)</th>
                        <th className="py-2 px-2 w-10 text-center"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {formData.items.map((it, idx) => (
                        <tr key={idx}>
                          <td className="p-2">
                            <input
                              type="text"
                              placeholder="Item description"
                              value={it.itemName}
                              onChange={(e) => handleItemChange(idx, 'itemName', e.target.value)}
                              className="w-full px-2 py-1 text-xs rounded border border-slate-300"
                              required
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              min="1"
                              value={it.qty}
                              onChange={(e) => handleItemChange(idx, 'qty', Number(e.target.value))}
                              className="w-full px-2 py-1 text-xs rounded border border-slate-300"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              min="0"
                              value={it.rate}
                              onChange={(e) => handleItemChange(idx, 'rate', Number(e.target.value))}
                              className="w-full px-2 py-1 text-xs rounded border border-slate-300"
                            />
                          </td>
                          <td className="p-2 text-center">
                            {formData.items.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeItemRow(idx)}
                                className="text-rose-500 hover:text-rose-700"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between items-center pt-2 text-xs text-slate-600">
                  <span>No of Items : <strong>{formData.items.length}</strong></span>
                  <span className="text-sm font-bold text-emerald-700">Total Cost : ₹{totalCost}</span>
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
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Set Details Dialog */}
      {viewSet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 p-6 space-y-4">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-bold text-slate-800 text-sm">{viewSet.setName}</h4>
                <p className="text-[11px] text-slate-400">Class: {viewSet.className} • Code: {viewSet.setCode}</p>
              </div>
              <button onClick={() => setViewSet(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="border border-slate-200 rounded overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="p-2 text-left">Item Name</th>
                    <th className="p-2 text-center">Qty</th>
                    <th className="p-2 text-right">Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {viewSet.items?.map((it, i) => (
                    <tr key={i}>
                      <td className="p-2">{it.itemName}</td>
                      <td className="p-2 text-center font-bold">{it.qty}</td>
                      <td className="p-2 text-right">₹{it.rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between font-bold text-slate-800 pt-2 text-sm">
              <span>Total Set Price:</span>
              <span className="text-emerald-700">₹{viewSet.totalCost}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default SetMasterPage;
