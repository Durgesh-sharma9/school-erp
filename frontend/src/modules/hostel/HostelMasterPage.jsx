import React, { useState, useEffect } from 'react';
import { Building, Plus, Search, Download, Printer, Edit2, Trash2, X, Phone, MapPin, User } from 'lucide-react';
import toast from 'react-hot-toast';

export function HostelMasterPage() {
  const [hostels, setHostels] = useState([
    { id: 1, hostelName: 'Tagore Boys Hostel', type: 'Boys', wardenName: 'RAMESH CHANDRA SHARMA', contactNo: '9829012345', address: 'Campus West Wing, Jaipur', capacity: 120 },
    { id: 2, hostelName: 'Sarojini Girls Hostel', type: 'Girls', wardenName: 'DR. SUNITA MEENA', contactNo: '9414054321', address: 'Campus East Wing, Jaipur', capacity: 100 },
    { id: 3, hostelName: 'Kalam Senior Wing', type: 'Boys', wardenName: 'MUKESH JANGID', contactNo: '9876543210', address: 'Academic Block Ext., Jaipur', capacity: 80 }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHostel, setEditingHostel] = useState(null);
  const [formData, setFormData] = useState({
    hostelName: '',
    type: 'Boys',
    wardenName: '',
    contactNo: '',
    address: '',
    capacity: 100
  });

  useEffect(() => {
    fetchHostels();
  }, []);

  const fetchHostels = async () => {
    try {
      const res = await fetch('/api/hostel/hostels');
      const data = await res.json();
      if (data.success && data.data?.length > 0) {
        setHostels(data.data);
      }
    } catch {
      // Fallback
    }
  };

  const openAddModal = () => {
    setEditingHostel(null);
    setFormData({
      hostelName: '',
      type: 'Boys',
      wardenName: '',
      contactNo: '',
      address: '',
      capacity: 100
    });
    setIsModalOpen(true);
  };

  const openEditModal = (h) => {
    setEditingHostel(h);
    setFormData({ ...h });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.hostelName.trim()) {
      toast.error('Hostel name is required');
      return;
    }

    try {
      if (editingHostel) {
        await fetch(`/api/hostel/hostels/${editingHostel.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        setHostels(prev => prev.map(h => h.id === editingHostel.id ? { ...h, ...formData } : h));
        toast.success('Hostel updated successfully');
      } else {
        const res = await fetch('/api/hostel/hostels', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const json = await res.json();
        const created = json.data || { id: Date.now(), ...formData };
        setHostels(prev => [...prev, created]);
        toast.success('Hostel added successfully');
      }
      setIsModalOpen(false);
    } catch {
      toast.error('Failed to save hostel');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this hostel?')) return;
    try {
      await fetch(`/api/hostel/hostels/${id}`, { method: 'DELETE' });
      setHostels(prev => prev.filter(h => h.id !== id));
      toast.success('Hostel deleted');
    } catch {
      toast.error('Failed to delete hostel');
    }
  };

  const filteredHostels = hostels.filter(h =>
    h.hostelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.wardenName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["S.No.,Hostel Name,Type,Warden Name,Contact No,Capacity,Address"].concat(
        filteredHostels.map((h, i) => `${i + 1},"${h.hostelName}","${h.type}","${h.wardenName}","${h.contactNo}",${h.capacity},"${h.address}"`)
      ).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "Hostel_Master_List.csv");
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
            <span className="text-indigo-600 font-medium">Hostel Master</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Building className="w-6 h-6 text-indigo-600" />
            Hostel Master
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search hostel / warden..."
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
            title="Add Hostel"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Table (1:1 with UAB: S.NO., HOSTEL NAME, TYPE, WARDEN, CONTACT, CAPACITY, ACTIONS) */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[11px] border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6 w-20">S.NO.</th>
                <th className="py-3.5 px-6">HOSTEL NAME</th>
                <th className="py-3.5 px-6">TYPE</th>
                <th className="py-3.5 px-6">WARDEN NAME</th>
                <th className="py-3.5 px-6">CONTACT NO.</th>
                <th className="py-3.5 px-6 text-center">CAPACITY</th>
                <th className="py-3.5 px-6 text-right w-32">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredHostels.map((h, idx) => (
                <tr key={h.id || idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-6 text-slate-400 font-mono">{idx + 1}</td>
                  <td className="py-3.5 px-6 font-bold text-slate-800 flex items-center gap-2">
                    <Building className="w-4 h-4 text-indigo-600" />
                    {h.hostelName}
                  </td>
                  <td className="py-3.5 px-6">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      h.type === 'Boys' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      h.type === 'Girls' ? 'bg-pink-50 text-pink-700 border-pink-200' :
                      'bg-purple-50 text-purple-700 border-purple-200'
                    }`}>
                      {h.type} Hostel
                    </span>
                  </td>
                  <td className="py-3.5 px-6 font-medium text-slate-800">{h.wardenName}</td>
                  <td className="py-3.5 px-6 font-mono">{h.contactNo}</td>
                  <td className="py-3.5 px-6 text-center font-mono font-bold text-slate-700">{h.capacity} Beds</td>
                  <td className="py-3.5 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(h)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                        title="Edit Hostel"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(h.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Delete Hostel"
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

      {/* 1:1 UAB HOSTEL MASTER Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                {editingHostel ? 'EDIT HOSTEL MASTER' : 'HOSTEL MASTER'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Hostel Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tagore Boys Hostel"
                  value={formData.hostelName}
                  onChange={(e) => setFormData({ ...formData, hostelName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="Boys">Boys</option>
                    <option value="Girls">Girls</option>
                    <option value="Co-ed">Co-ed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Capacity (Beds) *</label>
                  <input
                    type="number"
                    required
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Warden Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Sharma"
                    value={formData.wardenName}
                    onChange={(e) => setFormData({ ...formData, wardenName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contact No.</label>
                  <input
                    type="tel"
                    placeholder="e.g. 9829012345"
                    value={formData.contactNo}
                    onChange={(e) => setFormData({ ...formData, contactNo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Address / Wing Location</label>
                <input
                  type="text"
                  placeholder="e.g. Campus West Wing, Jaipur"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
                  {editingHostel ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
