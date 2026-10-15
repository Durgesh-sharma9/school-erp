import React, { useState, useEffect } from 'react';
import { Tag, Plus, Search, Download, Printer, Edit2, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

export function HostelRoomTypePage() {
  const [roomTypes, setRoomTypes] = useState([
    { id: 1, typeName: 'Single Bed (AC)', fee: 85000, amenities: 'Attached Bath, Study Table, AC, Geyser' },
    { id: 2, typeName: 'Double Sharing (AC)', fee: 65000, amenities: 'Attached Bath, AC, Dual Wardrobe' },
    { id: 3, typeName: 'Triple Sharing (Non-AC)', fee: 45000, amenities: 'Common Bath, Cooler, Study Tables' },
    { id: 4, typeName: 'Dormitory (4 Bed)', fee: 35000, amenities: 'Common Bath, Locker, Study Area' }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [formData, setFormData] = useState({
    typeName: '',
    fee: 65000,
    amenities: ''
  });

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const fetchRoomTypes = async () => {
    try {
      const res = await fetch('/api/hostel/room-types');
      const data = await res.json();
      if (data.success && data.data?.length > 0) {
        setRoomTypes(data.data);
      }
    } catch {
      // Fallback
    }
  };

  const openAddModal = () => {
    setEditingType(null);
    setFormData({ typeName: '', fee: 65000, amenities: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (t) => {
    setEditingType(t);
    setFormData({ ...t });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.typeName.trim() || !formData.fee) {
      toast.error('Type name and Fee are required');
      return;
    }

    try {
      if (editingType) {
        await fetch(`/api/hostel/room-types/${editingType.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        setRoomTypes(prev => prev.map(rt => rt.id === editingType.id ? { ...rt, ...formData, fee: Number(formData.fee) } : rt));
        toast.success('Room type updated successfully');
      } else {
        const res = await fetch('/api/hostel/room-types', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const json = await res.json();
        const created = json.data || { id: Date.now(), ...formData, fee: Number(formData.fee) };
        setRoomTypes(prev => [...prev, created]);
        toast.success('Room type created successfully');
      }
      setIsModalOpen(false);
    } catch {
      toast.error('Failed to save room type');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this room type?')) return;
    try {
      await fetch(`/api/hostel/room-types/${id}`, { method: 'DELETE' });
      setRoomTypes(prev => prev.filter(rt => rt.id !== id));
      toast.success('Room type deleted');
    } catch {
      toast.error('Failed to delete room type');
    }
  };

  const filteredTypes = roomTypes.filter(rt =>
    rt.typeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rt.amenities.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["S.No.,Room Type,Fee (₹),Amenities"].concat(
        filteredTypes.map((rt, i) => `${i + 1},"${rt.typeName}",${rt.fee},"${rt.amenities}"`)
      ).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "Hostel_Room_Types.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Exported to CSV');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* 1:1 Breadcrumbs & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-400 mb-1">
            <span>Hostel</span>
            <span>&gt;</span>
            <span className="text-indigo-600 font-medium">Room Type</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Tag className="w-6 h-6 text-indigo-600" />
            Room Type Master
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search room type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 w-52 outline-none"
            />
          </div>

          <button onClick={exportCSV} className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl">
            <Download className="w-4 h-4" /> CSV
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl">
            <Printer className="w-4 h-4" /> Print
          </button>

          <button
            onClick={openAddModal}
            className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-md shadow-indigo-200 transition-transform active:scale-95"
            title="Add Room Type"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Table (1:1 with UAB: S.NO., ROOM TYPE, FEE, AMENITIES, ACTION) */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[11px] border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6 w-20">S.NO.</th>
                <th className="py-3.5 px-6">ROOM TYPE</th>
                <th className="py-3.5 px-6 text-right font-bold text-slate-900">ANNUAL FEE (₹)</th>
                <th className="py-3.5 px-6">AMENITIES INCLUDED</th>
                <th className="py-3.5 px-6 text-right w-32">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTypes.map((rt, idx) => (
                <tr key={rt.id || idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-6 text-slate-400 font-mono">{idx + 1}</td>
                  <td className="py-3.5 px-6 font-bold text-slate-800">{rt.typeName}</td>
                  <td className="py-3.5 px-6 text-right font-mono font-bold text-indigo-700">₹{rt.fee?.toLocaleString()}</td>
                  <td className="py-3.5 px-6 text-slate-600">{rt.amenities || '-'}</td>
                  <td className="py-3.5 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(rt)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                        title="Edit Type"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(rt.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Delete Type"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 1:1 UAB ROOM TYPE Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                {editingType ? 'EDIT ROOM TYPE' : 'ROOM TYPE MASTER'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Room Type Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Single Bed (AC)"
                  value={formData.typeName}
                  onChange={(e) => setFormData({ ...formData, typeName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Annual Fee (₹) *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 65000"
                  value={formData.fee}
                  onChange={(e) => setFormData({ ...formData, fee: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Amenities</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Attached Bath, Study Table, AC, Geyser"
                  value={formData.amenities}
                  onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  {editingType ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
