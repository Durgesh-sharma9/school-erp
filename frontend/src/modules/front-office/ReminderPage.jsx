import React, { useState } from 'react';
import {
  Bell,
  Search,
  Home,
  Plus,
  Trash2,
  Edit2,
  Printer,
  FileDown,
  X,
  Calendar,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

const INITIAL_REMINDERS = [
  { id: '1', fromDate: '2026-10-15', toDate: '2026-10-20', description: 'Quarterly Parent-Teacher Meeting announcement and report card review', status: 'Active' },
  { id: '2', fromDate: '2026-10-22', toDate: '2026-10-25', description: 'Diwali break holiday homework dispatch and online portal updates', status: 'Upcoming' },
  { id: '3', fromDate: '2026-09-01', toDate: '2026-09-05', description: 'Teachers Day felicitation and award preparation', status: 'Expired' }
];

export function ReminderPage({ onNavigate }) {
  const [reminders, setReminders] = useState(INITIAL_REMINDERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    fromDate: '',
    toDate: '',
    description: ''
  });

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      fromDate: new Date().toISOString().slice(0, 10),
      toDate: new Date().toISOString().slice(0, 10),
      description: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (r) => {
    setEditingId(r.id);
    setFormData({
      fromDate: r.fromDate,
      toDate: r.toDate,
      description: r.description
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.description) {
      toast.error('Please enter description');
      return;
    }
    if (editingId) {
      setReminders(prev => prev.map(r => r.id === editingId ? { ...r, ...formData } : r));
      toast.success('Reminder updated successfully');
    } else {
      const newR = {
        id: String(Date.now()),
        ...formData,
        status: 'Active'
      };
      setReminders(prev => [newR, ...prev]);
      toast.success('Reminder added successfully');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this reminder?')) {
      setReminders(prev => prev.filter(r => r.id !== id));
      toast.success('Reminder deleted');
    }
  };

  const filteredReminders = reminders.filter(r =>
    r.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportCSV = () => {
    const headers = ['S.NO.', 'FROM DATE', 'TO DATE', 'DESCRIPTION', 'STATUS'];
    const rows = filteredReminders.map((r, i) => [
      i + 1,
      `"${r.fromDate}"`,
      `"${r.toDate}"`,
      `"${r.description}"`,
      `"${r.status}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Reminders_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1:1 Secondary Top Header Toolbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20 print:hidden">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-bold text-slate-800 pr-3 border-r border-slate-300 flex items-center gap-2">
            <Bell size={18} className="text-blue-600" />
            <span>Reminder</span>
          </h1>
          <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
            <button onClick={() => onNavigate && onNavigate('dashboard')} className="hover:text-blue-600 flex items-center gap-1 transition-colors">
              <Home size={13} />
              <span>Home</span>
            </button>
            <span>/</span>
            <span className="text-slate-400">Front Office</span>
            <span>/</span>
            <span className="text-slate-700 font-semibold">Reminder</span>
          </nav>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={exportCSV}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold shadow-sm transition-all"
          >
            <FileDown size={14} />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-semibold shadow-sm transition-all"
          >
            <Printer size={14} />
            <span>Print</span>
          </button>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* Search Bar & Floating Add FAB */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between gap-4 print:hidden">
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search Reminders..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={openAddModal}
            className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105"
            title="Add Reminder"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 uppercase font-semibold">
                  <th className="py-3 px-4 w-12 text-center">S.NO.</th>
                  <th className="py-3 px-4">FROM DATE</th>
                  <th className="py-3 px-4">TO DATE</th>
                  <th className="py-3 px-4">DESCRIPTION</th>
                  <th className="py-3 px-4 text-center">STATUS</th>
                  <th className="py-3 px-4 text-right print:hidden">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReminders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400">
                      No reminders recorded. Click + to add one.
                    </td>
                  </tr>
                ) : (
                  filteredReminders.map((r, idx) => (
                    <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 text-center font-medium text-slate-500">{idx + 1}</td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-700">{r.fromDate}</td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-700">{r.toDate}</td>
                      <td className="py-3 px-4 text-slate-800 font-medium">{r.description}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          r.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                          r.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1.5 print:hidden">
                        <button
                          onClick={() => openEditModal(r)}
                          className="p-1 text-slate-400 hover:text-blue-600 rounded transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 1:1 ADD REMINDER Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="font-bold text-sm uppercase tracking-wide">
                {editingId ? 'EDIT REMINDER' : 'ADD REMINDER'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">From Date</label>
                  <input
                    type="date"
                    required
                    value={formData.fromDate}
                    onChange={e => setFormData({ ...formData, fromDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">To Date</label>
                  <input
                    type="date"
                    required
                    value={formData.toDate}
                    onChange={e => setFormData({ ...formData, toDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Description</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter reminder description..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
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
