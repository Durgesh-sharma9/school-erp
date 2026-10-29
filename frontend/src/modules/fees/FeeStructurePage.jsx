import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Download, Printer, Receipt, Eye, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { tenantStore } from '../../services/tenantStore';

export function FeeStructurePage() {
  const { schoolId } = useAuth();
  const [structures, setStructures] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingStructure, setViewingStructure] = useState(null);
  const [editingStructure, setEditingStructure] = useState(null);
  const [formData, setFormData] = useState({
    className: 'I',
    stream: 'None',
    structureType: 'Quarterly',
    heads: [
      { feeHead: 'Tuition Fee', amount: 35000 },
      { feeHead: 'Activity Fee', amount: 3000 },
      { feeHead: 'Examination Fee', amount: 2000 }
    ]
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchStructures();
  }, [schoolId]);

  const fetchStructures = async () => {
    try {
      const local = tenantStore.getFeeStructures(schoolId) || [];
      setStructures(local);

      const res = await fetch('/api/fees/structures', {
        headers: { 'x-school-id': schoolId }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setStructures(data.data);
      }
    } catch {
      // tenantStore active
    }
  };

  const handleOpenModal = (struct = null) => {
    if (struct) {
      setEditingStructure(struct);
      setFormData({
        className: struct.className,
        stream: struct.stream,
        structureType: struct.structureType,
        heads: struct.heads && struct.heads.length > 0 ? struct.heads : [
          { feeHead: 'Tuition Fee', amount: struct.grandTotal || 35000 }
        ]
      });
    } else {
      setEditingStructure(null);
      setFormData({
        className: 'III',
        stream: 'None',
        structureType: 'Quarterly',
        heads: [
          { feeHead: 'Tuition Fee', amount: 35000 },
          { feeHead: 'Activity Fee', amount: 3000 },
          { feeHead: 'Examination Fee', amount: 2000 }
        ]
      });
    }
    setIsModalOpen(true);
  };

  const handleHeadAmountChange = (index, amount) => {
    setFormData(prev => {
      const updated = [...prev.heads];
      updated[index].amount = Number(amount) || 0;
      return { ...prev, heads: updated };
    });
  };

  const handleAddHead = () => {
    setFormData(prev => ({
      ...prev,
      heads: [...prev.heads, { feeHead: 'Other Fee', amount: 1000 }]
    }));
  };

  const handleRemoveHead = (index) => {
    setFormData(prev => ({
      ...prev,
      heads: prev.heads.filter((_, i) => i !== index)
    }));
  };

  const calculateGrandTotal = () => {
    return formData.heads.reduce((sum, h) => sum + (Number(h.amount) || 0), 0);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const grandTotal = calculateGrandTotal();

    try {
      const payload = {
        id: editingStructure?.id,
        className: formData.className,
        stream: formData.stream,
        structureType: formData.structureType,
        grandTotal,
        heads: formData.heads
      };

      // 1. Save in tenantStore
      let newStruct;
      if (editingStructure) {
        const current = tenantStore.getFeeStructures(schoolId);
        const updated = current.map(s => s.id === editingStructure.id ? { ...s, ...payload } : s);
        tenantStore.saveFeeStructures(schoolId, updated);
        setStructures(updated);
        toast.success('Fee structure updated');
      } else {
        newStruct = tenantStore.addFeeStructure(schoolId, payload);
        setStructures(prev => [newStruct, ...prev.filter(s => s.id !== newStruct.id)]);
        toast.success('Fee structure created');
      }

      // 2. Sync to API
      await fetch('/api/fees/structures', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-school-id': schoolId
        },
        body: JSON.stringify(payload)
      });
      setIsModalOpen(false);
    } catch {
      toast.error('Failed to save fee structure');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this Fee Structure?')) return;
    try {
      tenantStore.deleteFeeStructure(schoolId, id);
      await fetch(`/api/fees/structures/${id}`, { method: 'DELETE', headers: { 'x-school-id': schoolId } });
      setStructures(prev => prev.filter(s => s.id !== id));
      toast.success('Fee structure removed');
    } catch {
      toast.error('Failed to delete structure');
    }
  };

  const exportExcel = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["S.No.,Class,Stream,Structure Type,Grand Total"].concat(
        structures.map((s, i) => `${i + 1},"${s.className}","${s.stream}","${s.structureType}",${s.grandTotal}`)
      ).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Fee_Structures.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Exported to CSV');
  };

  const filtered = structures.filter(s =>
    s.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.stream.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* 1:1 Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Receipt className="w-6 h-6 text-indigo-600" />
            Fee Structure
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Fees &bull; <span className="text-indigo-600 font-medium">Class & Stream Fee Master</span>
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
            Add Fee Structure
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
              placeholder="Search class or stream..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Total Structures: <span className="font-bold text-slate-800">{filtered.length}</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-500 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6 w-16">S.NO.</th>
                <th className="py-3.5 px-6">CLASS</th>
                <th className="py-3.5 px-6 w-36">STREAM</th>
                <th className="py-3.5 px-6 w-36">STRUCTURE TYPE</th>
                <th className="py-3.5 px-6 w-36 font-bold text-slate-800">GRAND TOTAL</th>
                <th className="py-3.5 px-6 w-32 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((s, idx) => (
                <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-6 font-medium text-slate-800">{idx + 1}</td>
                  <td className="py-3.5 px-6 font-semibold text-slate-900">{s.className}</td>
                  <td className="py-3.5 px-6 text-slate-600">{s.stream}</td>
                  <td className="py-3.5 px-6">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-800">
                      {s.structureType}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 font-extrabold text-indigo-600">₹{s.grandTotal?.toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-6 text-right space-x-2">
                    <button
                      onClick={() => setViewingStructure(s)}
                      className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                      title="View Breakdown"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenModal(s)}
                      className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                      title="Edit Structure"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Delete Structure"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    No Fee Structures found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Breakdown View Modal */}
      {viewingStructure && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Fee Breakdown &bull; {viewingStructure.className}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Stream: {viewingStructure.stream} &bull; {viewingStructure.structureType}</p>
              </div>
              <button
                onClick={() => setViewingStructure(null)}
                className="text-slate-400 hover:text-slate-600 rounded-lg p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                  <tr>
                    <th className="p-2">Fee Head</th>
                    <th className="p-2 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(viewingStructure.heads || []).map((h, i) => (
                    <tr key={i}>
                      <td className="p-2 font-medium text-slate-700">{h.feeHead}</td>
                      <td className="p-2 text-right font-bold text-slate-900">₹{h.amount?.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                  <tr className="bg-indigo-50/50 font-bold text-indigo-900 border-t-2 border-indigo-200">
                    <td className="p-2">Grand Total</td>
                    <td className="p-2 text-right text-sm">₹{viewingStructure.grandTotal?.toLocaleString('en-IN')}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setViewingStructure(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Structure Builder Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Receipt className="w-4 h-4 text-indigo-600" />
                {editingStructure ? 'Edit Fee Structure' : 'Add Fee Structure'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 rounded-lg p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Class *
                  </label>
                  <select
                    value={formData.className}
                    onChange={(e) => setFormData(prev => ({ ...prev, className: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="Nursery - PP3+">Nursery - PP3+</option>
                    <option value="Lower Kindergarten - PP4+">Lower Kindergarten - PP4+</option>
                    <option value="Upper Kindergarten - PP5+">Upper Kindergarten - PP5+</option>
                    <option value="I">Class I</option>
                    <option value="II">Class II</option>
                    <option value="III">Class III</option>
                    <option value="IV">Class IV</option>
                    <option value="V">Class V</option>
                    <option value="VI">Class VI</option>
                    <option value="VII">Class VII</option>
                    <option value="VIII">Class VIII</option>
                    <option value="IX">Class IX</option>
                    <option value="X">Class X</option>
                    <option value="XI- HUMANITIES">Class XI</option>
                    <option value="XII-HUMANITIES">Class XII</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Stream
                  </label>
                  <select
                    value={formData.stream}
                    onChange={(e) => setFormData(prev => ({ ...prev, stream: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="None">None</option>
                    <option value="SCIENCE">Science</option>
                    <option value="COMMERCE">Commerce</option>
                    <option value="HUMANITIES">Humanities</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Frequency
                  </label>
                  <select
                    value={formData.structureType}
                    onChange={(e) => setFormData(prev => ({ ...prev, structureType: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="Quarterly">Quarterly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Annually">Annually</option>
                  </select>
                </div>
              </div>

              {/* Head-wise Amount Configuration */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-800">Fee Head Allocation</label>
                  <button
                    type="button"
                    onClick={handleAddHead}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    + Add Head
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {formData.heads.map((h, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={h.feeHead}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData(prev => {
                            const updated = [...prev.heads];
                            updated[i].feeHead = val;
                            return { ...prev, heads: updated };
                          });
                        }}
                        placeholder="Fee Head"
                        className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                      />
                      <div className="relative w-32">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">₹</span>
                        <input
                          type="number"
                          min="0"
                          value={h.amount}
                          onChange={(e) => handleHeadAmountChange(i, e.target.value)}
                          className="w-full pl-6 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                        />
                      </div>
                      {formData.heads.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveHead(i)}
                          className="p-1.5 text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Grand Total Bar */}
                <div className="mt-3 p-3 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between">
                  <span className="text-xs font-semibold text-indigo-900">Total Calculated Structure:</span>
                  <span className="text-base font-extrabold text-indigo-600">
                    ₹{calculateGrandTotal().toLocaleString('en-IN')}
                  </span>
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
                  {isLoading ? 'Saving...' : 'Save Structure'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
