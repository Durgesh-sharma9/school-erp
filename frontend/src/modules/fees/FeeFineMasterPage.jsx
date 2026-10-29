import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Download, Printer, Gavel, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { tenantStore } from '../../services/tenantStore';

export function FeeFineMasterPage() {
  const { schoolId } = useAuth();
  const [fines, setFines] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFine, setEditingFine] = useState(null);
  const [formData, setFormData] = useState({
    fineName: '',
    fineType: 'Per Day',
    increasePeriod: 'Daily',
    graceDays: '10',
    amount: '20'
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchFines();
  }, [schoolId]);

  const fetchFines = async () => {
    try {
      const local = tenantStore.getFineMasters(schoolId) || [];
      setFines(local);

      const res = await fetch('/api/fees/fines', {
        headers: { 'x-school-id': schoolId }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setFines(data.data);
      }
    } catch {}
  };

  const handleOpenModal = (f = null) => {
    if (f) {
      setEditingFine(f);
      setFormData({
        fineName: f.fineName,
        fineType: f.fineType,
        increasePeriod: f.increasePeriod,
        graceDays: String(f.graceDays),
        amount: String(f.amount)
      });
    } else {
      setEditingFine(null);
      setFormData({
        fineName: '',
        fineType: 'Per Day',
        increasePeriod: 'Daily',
        graceDays: '10',
        amount: '20'
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.fineName.trim()) {
      toast.error('Please enter Fine Name');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        id: editingFine?.id,
        fineName: formData.fineName.trim(),
        fineType: formData.fineType,
        increasePeriod: formData.increasePeriod,
        graceDays: Number(formData.graceDays) || 0,
        amount: Number(formData.amount) || 0
      };

      await fetch('/api/fees/fines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-school-id': schoolId },
        body: JSON.stringify(payload)
      });

      const today = new Date().toISOString().split('T')[0];
      if (editingFine) {
        const updatedFines = fines.map(item => item.id === editingFine.id ? { ...item, ...payload, updatedAt: today } : item);
        tenantStore.saveFineMasters(schoolId, updatedFines);
        setFines(updatedFines);
        toast.success('Fine rule updated');
      } else {
        const newFine = { id: String(Date.now()), ...payload, createdAt: today, updatedAt: today, user: 'Admin' };
        const updatedFines = [...fines, newFine];
        tenantStore.saveFineMasters(schoolId, updatedFines);
        setFines(updatedFines);
        toast.success('Fine rule created');
      }
      setIsModalOpen(false);
    } catch {
      toast.error('Failed to save fine rule');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this fine rule?')) return;
    try {
      await fetch(`/api/fees/fines/${id}`, { method: 'DELETE', headers: { 'x-school-id': schoolId } });
      const updatedFines = fines.filter(f => f.id !== id);
      tenantStore.saveFineMasters(schoolId, updatedFines);
      setFines(updatedFines);
      toast.success('Fine rule removed');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const exportExcel = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["S.No.,Fine Name,Type,Period,Grace Days,Amount,User,Created At"].concat(
        fines.map((f, i) => `${i + 1},"${f.fineName}","${f.fineType}","${f.increasePeriod}",${f.graceDays},${f.amount},"${f.user}","${f.createdAt}"`)
      ).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Fee_Fine_Master.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Exported to CSV');
  };

  const filtered = fines.filter(f =>
    f.fineName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* 1:1 Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Gavel className="w-6 h-6 text-indigo-600" />
            Fine Master
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Fees &bull; <span className="text-indigo-600 font-medium">Automated Late Fee Penalties</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            Add Fine
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search fine rule..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Total Rules: <span className="font-bold text-slate-800">{filtered.length}</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-500 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6 w-16">S.NO.</th>
                <th className="py-3.5 px-6">FINE NAME</th>
                <th className="py-3.5 px-6 w-28">FINE TYPE</th>
                <th className="py-3.5 px-6 w-28">PERIOD</th>
                <th className="py-3.5 px-6 w-28">GRACE DAYS</th>
                <th className="py-3.5 px-6 w-28">AMOUNT</th>
                <th className="py-3.5 px-6 w-24">USER</th>
                <th className="py-3.5 px-6 w-32">CREATED AT</th>
                <th className="py-3.5 px-6 w-24 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((f, idx) => (
                <tr key={f.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-6 font-medium text-slate-800">{idx + 1}</td>
                  <td className="py-3.5 px-6 font-semibold text-slate-900">{f.fineName}</td>
                  <td className="py-3.5 px-6">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-800">
                      {f.fineType}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-slate-600">{f.increasePeriod}</td>
                  <td className="py-3.5 px-6 font-medium text-amber-700">{f.graceDays} Days</td>
                  <td className="py-3.5 px-6 font-bold text-slate-900">₹{f.amount}</td>
                  <td className="py-3.5 px-6 text-slate-500">{f.user}</td>
                  <td className="py-3.5 px-6 text-slate-500">{f.createdAt}</td>
                  <td className="py-3.5 px-6 text-right space-x-2">
                    <button
                      onClick={() => handleOpenModal(f)}
                      className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                      title="Edit Fine"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(f.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Delete Fine"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-400">
                    No Fine rules configured yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Gavel className="w-4 h-4 text-indigo-600" />
                {editingFine ? 'Edit Fine Rule' : 'Add Fine Rule'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 rounded-lg p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Fine Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Late Fee Penalty, Cheque Bounce Charge"
                  value={formData.fineName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fineName: e.target.value }))}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Fine Type
                  </label>
                  <select
                    value={formData.fineType}
                    onChange={(e) => setFormData(prev => ({ ...prev, fineType: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="Per Day">Per Day</option>
                    <option value="Fixed">Fixed Amount</option>
                    <option value="Percentage">Percentage</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Increase Period
                  </label>
                  <select
                    value={formData.increasePeriod}
                    onChange={(e) => setFormData(prev => ({ ...prev, increasePeriod: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Grace Days *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.graceDays}
                    onChange={(e) => setFormData(prev => ({ ...prev, graceDays: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Fine Amount (₹) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
                >
                  {isLoading ? 'Saving...' : 'Save Fine Rule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
