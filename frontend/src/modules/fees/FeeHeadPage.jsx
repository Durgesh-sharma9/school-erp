import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Download, Printer, Tag, X, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { tenantStore } from '../../services/tenantStore';

export function FeeHeadPage() {
  const { schoolId } = useAuth();
  const [heads, setHeads] = useState([]);
  const [feeGroups, setFeeGroups] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHead, setEditingHead] = useState(null);
  const [formData, setFormData] = useState({
    feeGroup: '',
    installment: '',
    feeHead: '',
    shortName: '',
    feeType: 'Day Scholar',
    applyFor: 'Both',
    gender: 'Both',
    isBoard: false,
    priority: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchHeads();
    fetchFeeGroups();
  }, [schoolId]);

  const fetchFeeGroups = async () => {
    try {
      const local = tenantStore.getFeeHeadGroups(schoolId) || [];
      if (local && local.length > 0) {
        setFeeGroups(local);
      }

      const res = await fetch('/api/fees/head-groups', {
        headers: { 'x-school-id': schoolId }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setFeeGroups(data.data);
      }
    } catch (err) {
      console.error('[Fetch Fee Groups error]:', err);
    }
  };

  const fetchHeads = async () => {
    try {
      const local = tenantStore.getFeeHeads(schoolId) || [];
      setHeads(local);

      const res = await fetch('/api/fees/heads', {
        headers: { 'x-school-id': schoolId }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setHeads(data.data);
      }
    } catch {}
  };

  const handleOpenModal = (head = null) => {
    fetchFeeGroups();
    setErrors({});
    if (head) {
      setEditingHead(head);
      setFormData({
        feeGroup: head.feeGroup || '',
        installment: head.installment || '',
        feeHead: head.feeHead || '',
        shortName: head.shortName || '',
        feeType: head.feeType || 'Day Scholar',
        applyFor: head.applyFor || 'Both',
        gender: head.gender || 'Both',
        isBoard: Boolean(head.isBoard),
        priority: head.priority || 1
      });
    } else {
      setEditingHead(null);
      setFormData({
        feeGroup: '',
        installment: '',
        feeHead: '',
        shortName: '',
        feeType: 'Day Scholar',
        applyFor: 'Both',
        gender: 'Both',
        isBoard: false,
        priority: heads.length + 1
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.feeGroup || !formData.feeGroup.trim()) {
      newErrors.feeGroup = 'Fee Group is required !';
    }
    if (!formData.installment || !formData.installment.trim()) {
      newErrors.installment = 'Installment Type is required !';
    }
    if (!formData.feeHead || !formData.feeHead.trim()) {
      newErrors.feeHead = 'Fee Head Name is required !';
    }
    if (!formData.shortName || !formData.shortName.trim()) {
      newErrors.shortName = 'Fee Head Short Name is required !';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        id: editingHead?.id,
        feeGroup: formData.feeGroup.trim(),
        installment: formData.installment.trim(),
        feeHead: formData.feeHead.trim(),
        shortName: formData.shortName.trim(),
        feeType: formData.feeType,
        applyFor: formData.applyFor,
        gender: formData.gender,
        isBoard: Boolean(formData.isBoard),
        priority: Number(formData.priority) || 1
      };

      await fetch('/api/fees/heads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-school-id': schoolId },
        body: JSON.stringify(payload)
      });

      if (editingHead) {
        const updatedHeads = heads.map(h => (h.id === editingHead.id ? { ...h, ...payload } : h));
        tenantStore.saveFeeHeads(schoolId, updatedHeads);
        setHeads(updatedHeads);
        toast.success('Fee Head updated successfully');
      } else {
        const newHead = { id: String(Date.now()), ...payload };
        const updatedHeads = [...heads, newHead];
        tenantStore.saveFeeHeads(schoolId, updatedHeads);
        setHeads(updatedHeads);
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
      await fetch(`/api/fees/heads/${id}`, { method: 'DELETE', headers: { 'x-school-id': schoolId } });
      const updatedHeads = heads.filter(h => h.id !== id);
      tenantStore.saveFeeHeads(schoolId, updatedHeads);
      setHeads(updatedHeads);
      toast.success('Fee Head removed');
    } catch {
      toast.error('Failed to delete fee head');
    }
  };

  const exportExcel = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['S.No.,Fee Head,Short Name,Fee Group,Priority,Apply For,Gender,Installment,Fee Type'].concat(
        heads.map(
          (h, i) =>
            `${i + 1},"${h.feeHead || ''}","${h.shortName || ''}","${h.feeGroup || ''}",${h.priority || ''},"${h.applyFor || ''}","${h.gender || ''}","${h.installment || ''}","${h.feeType || ''}"`
        )
      ).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Fee_Heads_Master.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Exported to CSV');
  };

  const filtered = heads.filter(h =>
    (h.feeHead || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (h.shortName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (h.feeGroup || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (h.installment || '').toLowerCase().includes(searchQuery.toLowerCase())
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
              placeholder="Search fee head, group, or short name..."
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
                <th className="py-3.5 px-6 w-36">FEE GROUP</th>
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
                  <td className="py-3.5 px-6 font-semibold text-slate-900">
                    <div className="flex items-center gap-2">
                      <span>{h.feeHead}</span>
                      {h.shortName && (
                        <span className="text-[10px] bg-slate-100 text-slate-600 font-mono font-medium px-1.5 py-0.5 rounded">
                          {h.shortName}
                        </span>
                      )}
                      {h.isBoard && (
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded-sm">
                          BOARD
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-6">
                    {h.feeGroup ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-indigo-50 text-indigo-700">
                        {h.feeGroup}
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700">
                      #{h.priority || idx + 1}
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
                  <td colSpan="9" className="py-12 text-center text-slate-400">
                    No Fee Heads found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal - Exact 1:1 Matching User Specification */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-800 text-sm tracking-wider uppercase">
                FEE HEAD
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4.5">
              {/* Row 1: Fee Group & Installment Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Fee Group Dropdown */}
                <div>
                  <div className="relative">
                    <select
                      value={formData.feeGroup}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, feeGroup: e.target.value }));
                        if (errors.feeGroup) setErrors(prev => ({ ...prev, feeGroup: '' }));
                      }}
                      className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-xs appearance-none pr-9 focus:outline-none transition ${
                        errors.feeGroup
                          ? 'border-red-500 text-red-500 focus:border-red-500'
                          : formData.feeGroup
                          ? 'border-slate-300 text-slate-800 focus:border-indigo-500'
                          : 'border-slate-300 text-slate-500 focus:border-indigo-500'
                      }`}
                    >
                      <option value="" className="text-slate-400">
                        Fee Group *
                      </option>
                      {feeGroups.map(g => (
                        <option key={g.id || g.headGroup} value={g.headGroup} className="text-slate-800">
                          {g.headGroup}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                      <ChevronDown
                        className={`w-4 h-4 ${errors.feeGroup ? 'text-red-500' : 'text-slate-400'}`}
                      />
                    </div>
                  </div>
                  {errors.feeGroup && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.feeGroup}</p>
                  )}
                </div>

                {/* Installment Type Dropdown */}
                <div>
                  <div className="relative">
                    <select
                      value={formData.installment}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, installment: e.target.value }));
                        if (errors.installment) setErrors(prev => ({ ...prev, installment: '' }));
                      }}
                      className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-xs appearance-none pr-9 focus:outline-none transition ${
                        errors.installment
                          ? 'border-red-500 text-red-500 focus:border-red-500'
                          : formData.installment
                          ? 'border-slate-300 text-slate-800 focus:border-indigo-500'
                          : 'border-slate-300 text-slate-500 focus:border-indigo-500'
                      }`}
                    >
                      <option value="" className="text-slate-400">
                        Installment Type*
                      </option>
                      <option value="Monthly" className="text-slate-800">Monthly</option>
                      <option value="Quarterly" className="text-slate-800">Quarterly</option>
                      <option value="Half-Yearly" className="text-slate-800">Half-Yearly</option>
                      <option value="Annually" className="text-slate-800">Annually</option>
                      <option value="Only Once" className="text-slate-800">Only Once</option>
                      <option value="One Time" className="text-slate-800">One Time</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                      <ChevronDown
                        className={`w-4 h-4 ${errors.installment ? 'text-red-500' : 'text-slate-400'}`}
                      />
                    </div>
                  </div>
                  {errors.installment && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.installment}</p>
                  )}
                </div>
              </div>

              {/* Row 2: Fee Head Name & Fee Head Short Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Fee Head Name */}
                <div>
                  <input
                    type="text"
                    placeholder="Fee Head Name*"
                    value={formData.feeHead}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, feeHead: e.target.value }));
                      if (errors.feeHead) setErrors(prev => ({ ...prev, feeHead: '' }));
                    }}
                    className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-xs focus:outline-none transition ${
                      errors.feeHead
                        ? 'border-red-500 text-red-500 placeholder:text-red-400 focus:border-red-500'
                        : 'border-slate-300 text-slate-800 placeholder:text-slate-400 focus:border-indigo-500'
                    }`}
                  />
                  {errors.feeHead && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.feeHead}</p>
                  )}
                </div>

                {/* Fee Head Short Name */}
                <div>
                  <input
                    type="text"
                    placeholder="Fee Head Short Name*"
                    value={formData.shortName}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, shortName: e.target.value }));
                      if (errors.shortName) setErrors(prev => ({ ...prev, shortName: '' }));
                    }}
                    className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-xs focus:outline-none transition ${
                      errors.shortName
                        ? 'border-red-500 text-red-500 placeholder:text-red-500 focus:border-red-500'
                        : 'border-slate-300 text-slate-800 placeholder:text-slate-400 focus:border-indigo-500'
                    }`}
                  />
                  {errors.shortName && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.shortName}</p>
                  )}
                </div>
              </div>

              {/* Row 3: Fee Type (Outlined with notched legend label) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div className="relative">
                  <label className="absolute -top-2 left-3 bg-white px-1 text-[11px] text-slate-600 font-medium z-10 pointer-events-none">
                    Fee Type*
                  </label>
                  <select
                    value={formData.feeType}
                    onChange={(e) => setFormData(prev => ({ ...prev, feeType: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 appearance-none pr-9 focus:outline-none focus:border-indigo-500 transition"
                  >
                    <option value="Day Scholar">Day Scholar</option>
                    <option value="Hosteler">Hosteler</option>
                    <option value="Both">Both</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
                <div></div>
              </div>

              {/* Row 4: Head Type & Gender Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Head Type */}
                <div>
                  <label className="block text-xs font-normal text-slate-600 mb-2">
                    Head Type
                  </label>
                  <div className="flex items-center gap-5 text-xs text-slate-700">
                    {['Both', 'New', 'Old'].map((type) => (
                      <label key={type} className="inline-flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="radio"
                          name="applyFor"
                          value={type}
                          checked={formData.applyFor === type}
                          onChange={(e) => setFormData(prev => ({ ...prev, applyFor: e.target.value }))}
                          className="w-4 h-4 text-red-500 accent-red-500 focus:ring-red-400 cursor-pointer"
                        />
                        <span>{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Gender Type */}
                <div>
                  <label className="block text-xs font-normal text-slate-600 mb-2">
                    Gender Type
                  </label>
                  <div className="flex items-center gap-5 text-xs text-slate-700">
                    {['Both', 'Male', 'Female'].map((gender) => (
                      <label key={gender} className="inline-flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="radio"
                          name="gender"
                          value={gender}
                          checked={formData.gender === gender}
                          onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                          className="w-4 h-4 text-red-500 accent-red-500 focus:ring-red-400 cursor-pointer"
                        />
                        <span>{gender}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 5: Is Board Fee */}
              <div className="pt-1">
                <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-normal text-slate-700 select-none">
                  <input
                    type="checkbox"
                    checked={formData.isBoard}
                    onChange={(e) => setFormData(prev => ({ ...prev, isBoard: e.target.checked }))}
                    className="w-4 h-4 rounded-xs border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <span>Is Board Fee</span>
                </label>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs font-semibold rounded-lg shadow-xs transition cursor-pointer"
                >
                  {isLoading ? 'Saving...' : editingHead ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default FeeHeadPage;
