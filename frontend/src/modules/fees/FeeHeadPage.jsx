import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Download, Printer, Tag, X } from 'lucide-react';
import toast from 'react-hot-toast';

export function FeeHeadPage() {
  const [heads, setHeads] = useState([
    { id: '1', feeHead: 'Opening Balance', priority: 1, applyFor: 'Old', gender: 'Both', installment: 'Annually', feeType: 'dayscholar', isBoard: false },
    { id: '2', feeHead: 'Fine', priority: 2, applyFor: 'Both', gender: 'Both', installment: 'Monthly', feeType: 'dayscholar', isBoard: false },
    { id: '3', feeHead: 'Transport', priority: 3, applyFor: 'Both', gender: 'Both', installment: 'Monthly', feeType: 'dayscholar', isBoard: false },
    { id: '4', feeHead: 'Hostel', priority: 4, applyFor: 'Both', gender: 'Both', installment: 'Monthly', feeType: 'dayscholar', isBoard: false },
    { id: '5', feeHead: 'Other', priority: 5, applyFor: 'Both', gender: 'Both', installment: 'Monthly', feeType: 'dayscholar', isBoard: false },
    { id: '6', feeHead: 'Extra Concession', priority: 6, applyFor: 'Old', gender: 'Both', installment: 'Annually', feeType: 'dayscholar', isBoard: false },
    { id: '7', feeHead: 'Admission Fee', priority: 7, applyFor: 'New', gender: 'Both', installment: 'Only Once', feeType: 'dayscholar', isBoard: false },
    { id: '8', feeHead: 'Tuition Fee', priority: 8, applyFor: 'Both', gender: 'Both', installment: 'Quarterly', feeType: 'dayscholar', isBoard: false },
    { id: '9', feeHead: 'Activity Fee', priority: 9, applyFor: 'Both', gender: 'Both', installment: 'Annually', feeType: 'dayscholar', isBoard: false },
    { id: '10', feeHead: 'Digital Learning fee', priority: 10, applyFor: 'Both', gender: 'Both', installment: 'Annually', feeType: 'dayscholar', isBoard: false },
    { id: '11', feeHead: 'Registration fee', priority: 11, applyFor: 'New', gender: 'Both', installment: 'Only Once', feeType: 'dayscholar', isBoard: false },
    { id: '12', feeHead: 'Examination Fee', priority: 12, applyFor: 'Both', gender: 'Both', installment: 'Annually', feeType: 'dayscholar', isBoard: false },
    { id: '13', feeHead: 'School Application Fee', priority: 13, applyFor: 'Both', gender: 'Both', installment: 'Annually', feeType: 'dayscholar', isBoard: false }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHead, setEditingHead] = useState(null);
  const [formData, setFormData] = useState({
    feeHead: '',
    priority: '',
    applyFor: 'Both',
    gender: 'Both',
    installment: 'Quarterly',
    feeType: 'dayscholar',
    isBoard: false
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchHeads();
  }, []);

  const fetchHeads = async () => {
    try {
      const res = await fetch('/api/fees/heads');
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        setHeads(data.data);
      }
    } catch {
      // Retain defaults
    }
  };

  const handleOpenModal = (head = null) => {
    if (head) {
      setEditingHead(head);
      setFormData({
        feeHead: head.feeHead,
        priority: head.priority,
        applyFor: head.applyFor,
        gender: head.gender,
        installment: head.installment,
        feeType: head.feeType,
        isBoard: head.isBoard || false
      });
    } else {
      setEditingHead(null);
      setFormData({
        feeHead: '',
        priority: heads.length + 1,
        applyFor: 'Both',
        gender: 'Both',
        installment: 'Quarterly',
        feeType: 'dayscholar',
        isBoard: false
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.feeHead.trim()) {
      toast.error('Please enter Fee Head name');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        id: editingHead?.id,
        feeHead: formData.feeHead.trim(),
        priority: Number(formData.priority) || 1,
        applyFor: formData.applyFor,
        gender: formData.gender,
        installment: formData.installment,
        feeType: formData.feeType,
        isBoard: Boolean(formData.isBoard)
      };

      await fetch('/api/fees/heads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (editingHead) {
        setHeads(prev => prev.map(h => h.id === editingHead.id ? { ...h, ...payload } : h));
        toast.success('Fee Head updated successfully');
      } else {
        const newHead = { id: String(Date.now()), ...payload };
        setHeads(prev => [...prev, newHead]);
        toast.success('Fee Head created successfully');
      }
      setIsModalOpen(false);
    } catch {
      toast.error('Failed to save fee head');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this Fee Head?')) return;
    try {
      await fetch(`/api/fees/heads/${id}`, { method: 'DELETE' });
      setHeads(prev => prev.filter(h => h.id !== id));
      toast.success('Fee Head removed');
    } catch {
      toast.error('Failed to delete fee head');
    }
  };

  const exportExcel = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["S.No.,Fee Head,Priority,Apply For,Gender,Installment,Fee Type"].concat(
        heads.map((h, i) => `${i + 1},"${h.feeHead}",${h.priority},"${h.applyFor}","${h.gender}","${h.installment}","${h.feeType}"`)
      ).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Fee_Heads_Master.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Exported to CSV');
  };

  const filtered = heads.filter(h =>
    h.feeHead.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.installment.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* 1:1 Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Tag className="w-6 h-6 text-indigo-600" />
            Fee Head
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Fees &bull; <span className="text-indigo-600 font-medium">Fee Head Configuration</span>
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
            Add Fee Head
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
              placeholder="Search fee head..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Total Heads: <span className="font-bold text-slate-800">{filtered.length}</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-500 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6 w-16">S.NO.</th>
                <th className="py-3.5 px-6">FEE HEAD</th>
                <th className="py-3.5 px-6 w-24">PRIORITY</th>
                <th className="py-3.5 px-6 w-28">APPLY FOR</th>
                <th className="py-3.5 px-6 w-24">GENDER</th>
                <th className="py-3.5 px-6 w-32">INSTALLMENT</th>
                <th className="py-3.5 px-6 w-32">FEE TYPE</th>
                <th className="py-3.5 px-6 w-24 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((h, idx) => (
                <tr key={h.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-6 font-medium text-slate-800">{idx + 1}</td>
                  <td className="py-3.5 px-6 font-semibold text-slate-900 flex items-center gap-2">
                    {h.feeHead}
                    {h.isBoard && (
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded-sm">
                        BOARD
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700">
                      #{h.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 font-medium text-slate-700">{h.applyFor}</td>
                  <td className="py-3.5 px-6 text-slate-600">{h.gender}</td>
                  <td className="py-3.5 px-6">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-800">
                      {h.installment}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 capitalize text-slate-600">{h.feeType}</td>
                  <td className="py-3.5 px-6 text-right space-x-2">
                    <button
                      onClick={() => handleOpenModal(h)}
                      className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                      title="Edit Head"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(h.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Delete Head"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    No Fee Heads found.
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
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Tag className="w-4 h-4 text-indigo-600" />
                {editingHead ? 'Edit Fee Head' : 'Add Fee Head'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 rounded-lg p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Fee Head Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tuition Fee, Admission Fee, Activity Fee"
                    value={formData.feeHead}
                    onChange={(e) => setFormData(prev => ({ ...prev, feeHead: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Priority / Order *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Apply For
                  </label>
                  <select
                    value={formData.applyFor}
                    onChange={(e) => setFormData(prev => ({ ...prev, applyFor: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="Both">Both (Old & New)</option>
                    <option value="New">New Admission Only</option>
                    <option value="Old">Old Existing Student Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="Both">Both</option>
                    <option value="Male">Male Only</option>
                    <option value="Female">Female Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Installment
                  </label>
                  <select
                    value={formData.installment}
                    onChange={(e) => setFormData(prev => ({ ...prev, installment: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="Quarterly">Quarterly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Annually">Annually</option>
                    <option value="Only Once">Only Once</option>
                    <option value="Half-Yearly">Half-Yearly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Fee Type
                  </label>
                  <select
                    value={formData.feeType}
                    onChange={(e) => setFormData(prev => ({ ...prev, feeType: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="dayscholar">Day Scholar</option>
                    <option value="hosteler">Hosteler</option>
                    <option value="both">Both</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="isBoard"
                    checked={formData.isBoard}
                    onChange={(e) => setFormData(prev => ({ ...prev, isBoard: e.target.checked }))}
                    className="w-4 h-4 text-indigo-600 rounded-sm border-slate-300 focus:ring-indigo-500"
                  />
                  <label htmlFor="isBoard" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    Is Board Examination Fee
                  </label>
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
                  {isLoading ? 'Saving...' : 'Save Fee Head'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
