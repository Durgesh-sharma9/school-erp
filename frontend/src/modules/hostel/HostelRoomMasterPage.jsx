import React, { useState, useEffect } from 'react';
import { Bed, Plus, Search, Download, Printer, Edit2, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

export function HostelRoomMasterPage() {
  const [rooms, setRooms] = useState([
    { id: 1, roomNo: 'A-101', roomType: 'Double Sharing (AC)', floor: 'Ground Floor', block: 'A-Block (Junior)', hostel: 'Tagore Boys Hostel', capacity: 2, occupied: 2, status: 'Full' },
    { id: 2, roomNo: 'A-102', roomType: 'Double Sharing (AC)', floor: 'Ground Floor', block: 'A-Block (Junior)', hostel: 'Tagore Boys Hostel', capacity: 2, occupied: 1, status: 'Partially Occupied' },
    { id: 3, roomNo: 'A-103', roomType: 'Triple Sharing (Non-AC)', floor: 'First Floor', block: 'A-Block (Junior)', hostel: 'Tagore Boys Hostel', capacity: 3, occupied: 3, status: 'Full' },
    { id: 4, roomNo: 'A-104', roomType: 'Single Bed (AC)', floor: 'First Floor', block: 'A-Block (Junior)', hostel: 'Tagore Boys Hostel', capacity: 1, occupied: 0, status: 'Vacant' },
    { id: 5, roomNo: 'G-201', roomType: 'Double Sharing (AC)', floor: 'Ground Floor', block: 'Main Girls Block', hostel: 'Sarojini Girls Hostel', capacity: 2, occupied: 2, status: 'Full' },
    { id: 6, roomNo: 'G-202', roomType: 'Single Bed (AC)', floor: 'First Floor', block: 'Main Girls Block', hostel: 'Sarojini Girls Hostel', capacity: 1, occupied: 1, status: 'Full' }
  ]);

  const hostelsList = ['Tagore Boys Hostel', 'Sarojini Girls Hostel', 'Kalam Senior Wing'];
  const blocksList = ['A-Block (Junior)', 'B-Block (Senior)', 'Main Girls Block', 'Executive Wing'];
  const floorsList = ['Ground Floor', 'First Floor', 'Second Floor'];
  const roomTypesList = ['Single Bed (AC)', 'Double Sharing (AC)', 'Triple Sharing (Non-AC)', 'Dormitory (4 Bed)'];

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    roomNo: '',
    roomType: 'Double Sharing (AC)',
    floor: 'Ground Floor',
    block: 'A-Block (Junior)',
    hostel: 'Tagore Boys Hostel',
    capacity: 2
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await fetch('/api/hostel/rooms');
      const data = await res.json();
      if (data.success && data.data?.length > 0) {
        setRooms(data.data);
      }
    } catch {
      // Fallback
    }
  };

  const openAddModal = () => {
    setEditingRoom(null);
    setFormData({
      roomNo: '',
      roomType: 'Double Sharing (AC)',
      floor: 'Ground Floor',
      block: 'A-Block (Junior)',
      hostel: 'Tagore Boys Hostel',
      capacity: 2
    });
    setIsModalOpen(true);
  };

  const openEditModal = (r) => {
    setEditingRoom(r);
    setFormData({ ...r });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.roomNo.trim()) {
      toast.error('Room number is required');
      return;
    }

    try {
      if (editingRoom) {
        await fetch(`/api/hostel/rooms/${editingRoom.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        setRooms(prev => prev.map(r => r.id === editingRoom.id ? { ...r, ...formData } : r));
        toast.success('Room updated successfully');
      } else {
        const res = await fetch('/api/hostel/rooms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const json = await res.json();
        const created = json.data || { id: Date.now(), ...formData, occupied: 0, status: 'Vacant' };
        setRooms(prev => [...prev, created]);
        toast.success('Room created successfully');
      }
      setIsModalOpen(false);
    } catch {
      toast.error('Failed to save room');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;
    try {
      await fetch(`/api/hostel/rooms/${id}`, { method: 'DELETE' });
      setRooms(prev => prev.filter(r => r.id !== id));
      toast.success('Room deleted');
    } catch {
      toast.error('Failed to delete room');
    }
  };

  const filteredRooms = rooms.filter(r =>
    r.roomNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.hostel.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.roomType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["S.No.,Room No,Room Type,Floor,Block,Hostel,Capacity,Occupied,Status"].concat(
        filteredRooms.map((r, i) => `${i + 1},"${r.roomNo}","${r.roomType}","${r.floor}","${r.block}","${r.hostel}",${r.capacity},${r.occupied},"${r.status}"`)
      ).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "Hostel_Room_Master.csv");
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
            <span className="text-indigo-600 font-medium">Room Master</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bed className="w-6 h-6 text-indigo-600" />
            Room Master
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search room..."
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
            title="Add Room"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Table (1:1 with UAB: S.NO., ROOM NO., ROOM TYPE, FLOOR, BLOCK, HOSTEL, CAPACITY, OCCUPIED, STATUS, ACTION) */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[11px] border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6 w-16">S.NO.</th>
                <th className="py-3.5 px-6">ROOM NO.</th>
                <th className="py-3.5 px-6">ROOM TYPE</th>
                <th className="py-3.5 px-6">FLOOR</th>
                <th className="py-3.5 px-6">BLOCK</th>
                <th className="py-3.5 px-6">HOSTEL</th>
                <th className="py-3.5 px-6 text-center">CAPACITY</th>
                <th className="py-3.5 px-6 text-center">OCCUPIED</th>
                <th className="py-3.5 px-6 text-center">STATUS</th>
                <th className="py-3.5 px-6 text-right w-28">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRooms.map((r, idx) => (
                <tr key={r.id || idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-6 text-slate-400 font-mono">{idx + 1}</td>
                  <td className="py-3.5 px-6 font-bold font-mono text-indigo-700">{r.roomNo}</td>
                  <td className="py-3.5 px-6 font-semibold text-slate-800">{r.roomType}</td>
                  <td className="py-3.5 px-6 text-slate-600">{r.floor}</td>
                  <td className="py-3.5 px-6 text-slate-700">{r.block}</td>
                  <td className="py-3.5 px-6 text-slate-600">{r.hostel}</td>
                  <td className="py-3.5 px-6 text-center font-mono font-bold text-slate-700">{r.capacity} Beds</td>
                  <td className="py-3.5 px-6 text-center font-mono font-medium text-slate-800">{r.occupied} Beds</td>
                  <td className="py-3.5 px-6 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      r.status === 'Full' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                      r.status === 'Partially Occupied' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(r)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                        title="Edit Room"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Delete Room"
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

      {/* 1:1 UAB ROOM MASTER Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                {editingRoom ? 'EDIT ROOM MASTER' : 'ROOM MASTER'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Hostel *</label>
                <select
                  value={formData.hostel}
                  onChange={(e) => setFormData({ ...formData, hostel: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  {hostelsList.map((h, i) => (
                    <option key={i} value={h}>{h}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Block *</label>
                  <select
                    value={formData.block}
                    onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    {blocksList.map((b, i) => (
                      <option key={i} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Floor *</label>
                  <select
                    value={formData.floor}
                    onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    {floorsList.map((f, i) => (
                      <option key={i} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Room No. *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. A-101"
                    value={formData.roomNo}
                    onChange={(e) => setFormData({ ...formData, roomNo: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Bed Capacity *</label>
                  <input
                    type="number"
                    required
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Room Type *</label>
                <select
                  value={formData.roomType}
                  onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                >
                  {roomTypesList.map((rt, i) => (
                    <option key={i} value={rt}>{rt}</option>
                  ))}
                </select>
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
                  {editingRoom ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
