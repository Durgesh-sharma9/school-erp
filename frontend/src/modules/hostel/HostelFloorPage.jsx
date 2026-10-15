import React, { useState, useEffect } from 'react';
import { AlignJustify, Plus, Search, Download, Printer, Edit2, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

export function HostelFloorPage() {
  const [floors, setFloors] = useState([
    { id: 1, floorName: 'Ground Floor', blockName: 'A-Block (Junior)', hostelName: 'Tagore Boys Hostel' },
    { id: 2, floorName: 'First Floor', blockName: 'A-Block (Junior)', hostelName: 'Tagore Boys Hostel' },
    { id: 3, floorName: 'Second Floor', blockName: 'A-Block (Junior)', hostelName: 'Tagore Boys Hostel' },
    { id: 4, floorName: 'Ground Floor', blockName: 'Main Girls Block', hostelName: 'Sarojini Girls Hostel' },
    { id: 5, floorName: 'First Floor', blockName: 'Main Girls Block', hostelName: 'Sarojini Girls Hostel' }
  ]);

  const hostelsList = ['Tagore Boys Hostel', 'Sarojini Girls Hostel', 'Kalam Senior Wing'];
  const blocksList = ['A-Block (Junior)', 'B-Block (Senior)', 'Main Girls Block', 'Executive Wing'];

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFloor, setEditingFloor] = useState(null);
  const [formData, setFormData] = useState({
    floorName: 'Ground Floor',
    blockName: 'A-Block (Junior)',
    hostelName: 'Tagore Boys Hostel'
  });

  useEffect(() => {
    fetchFloors();
  }, []);

  const fetchFloors = async () => {
    try {
      const res = await fetch('/api/hostel/floors');
      const data = await res.json();
      if (data.success && data.data?.length > 0) {
        setFloors(data.data);
      }
    } catch {
      // Fallback
    }
  };

  const openAddModal = () => {
    setEditingFloor(null);
    setFormData({
      floorName: 'Ground Floor',
      blockName: 'A-Block (Junior)',
      hostelName: 'Tagore Boys Hostel'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (f) => {
    setEditingFloor(f);
    setFormData({ ...f });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.floorName.trim()) {
      toast.error('Floor name is required');
      return;
    }

    try {
      if (editingFloor) {
        await fetch(`/api/hostel/floors/${editingFloor.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        setFloors(prev => prev.map(f => f.id === editingFloor.id ? { ...f, ...formData } : f));
        toast.success('Floor updated successfully');
      } else {
        const res = await fetch('/api/hostel/floors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const json = await res.json();
        const created = json.data || { id: Date.now(), ...formData };
        setFloors(prev => [...prev, created]);
        toast.success('Floor created successfully');
      }
      setIsModalOpen(false);
    } catch {
      toast.error('Failed to save floor');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this floor?')) return;
    try {
      await fetch(`/api/hostel/floors/${id}`, { method: 'DELETE' });
      setFloors(prev => prev.filter(f => f.id !== id));
      toast.success('Floor deleted');
    } catch {
      toast.error('Failed to delete floor');
    }
  };

  const filteredFloors = floors.filter(f =>
    f.floorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.blockName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.hostelName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["S.No.,Floor Name,Block Name,Hostel Name"].concat(
        filteredFloors.map((f, i) => `${i + 1},"${f.floorName}","${f.blockName}","${f.hostelName}"`)
      ).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "Hostel_Floor_List.csv");
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
            <span className="text-indigo-600 font-medium">Hostel Floor</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <AlignJustify className="w-6 h-6 text-indigo-600" />
            Hostel Floor
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search floor / block..."
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
            title="Add Floor"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Table (1:1 with UAB: S.NO., FLOOR NAME, BLOCK NAME, HOSTEL NAME, ACTION) */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[11px] border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6 w-20">S.NO.</th>
                <th className="py-3.5 px-6">FLOOR NAME</th>
                <th className="py-3.5 px-6">BLOCK NAME</th>
                <th className="py-3.5 px-6">HOSTEL NAME</th>
                <th className="py-3.5 px-6 text-right w-32">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFloors.map((f, idx) => (
                <tr key={f.id || idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-6 text-slate-400 font-mono">{idx + 1}</td>
                  <td className="py-3.5 px-6 font-bold text-slate-800">{f.floorName}</td>
                  <td className="py-3.5 px-6 text-slate-700 font-semibold">{f.blockName}</td>
                  <td className="py-3.5 px-6 text-slate-600">{f.hostelName}</td>
                  <td className="py-3.5 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(f)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                        title="Edit Floor"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(f.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Delete Floor"
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

      {/* 1:1 UAB HOSTEL FLOOR Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                {editingFloor ? 'EDIT HOSTEL FLOOR' : 'HOSTEL FLOOR'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Hostel *</label>
                <select
                  value={formData.hostelName}
                  onChange={(e) => setFormData({ ...formData, hostelName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  {hostelsList.map((h, i) => (
                    <option key={i} value={h}>{h}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Block *</label>
                <select
                  value={formData.blockName}
                  onChange={(e) => setFormData({ ...formData, blockName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  {blocksList.map((b, i) => (
                    <option key={i} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Floor Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ground Floor, First Floor"
                  value={formData.floorName}
                  onChange={(e) => setFormData({ ...formData, floorName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
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
                  {editingFloor ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
