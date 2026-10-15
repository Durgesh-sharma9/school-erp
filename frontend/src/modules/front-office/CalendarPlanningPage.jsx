import React, { useState } from 'react';
import {
  CalendarDays,
  Search,
  Home,
  Plus,
  Printer,
  FileDown,
  X,
  Trash2,
  Edit2,
  Calendar,
  Sparkles,
  PartyPopper
} from 'lucide-react';
import toast from 'react-hot-toast';

const INITIAL_CALENDAR_PLANS = [
  {
    id: '1',
    type: 'Planning',
    startDate: '2026-10-18',
    endDate: '2026-10-18',
    title: 'Inter-House Science Exhibition & Robo-Tech Expo',
    className: 'Class VI - XII',
    section: 'All',
    description: 'Students will present STEM working models in the main auditorium. Chief Guest will be Prof. from MNIT Jaipur.',
    isHoliday: false
  },
  {
    id: '2',
    type: 'Event',
    startDate: '2026-10-31',
    endDate: '2026-11-04',
    title: 'Diwali & Govardhan Puja Holidays',
    className: 'All Classes',
    section: 'All',
    description: 'School campus will remain closed on account of Diwali festival. Online assignments accessible on student app.',
    isHoliday: true
  },
  {
    id: '3',
    type: 'Planning',
    startDate: '2026-11-14',
    endDate: '2026-11-14',
    title: 'Children’s Day Carnival & Sports Gala',
    className: 'Pre-Primary to Class XII',
    section: 'All',
    description: 'Food stalls, games, fancy dress competition and fun races organized by teaching staff for students.',
    isHoliday: false
  }
];

export function CalendarPlanningPage({ onNavigate }) {
  const [plans, setPlans] = useState(INITIAL_CALENDAR_PLANS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    type: 'Planning',
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10),
    title: '',
    className: 'All Classes',
    section: 'All',
    description: '',
    isHoliday: false
  });

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      type: 'Planning',
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date().toISOString().slice(0, 10),
      title: '',
      className: 'All Classes',
      section: 'All',
      description: '',
      isHoliday: false
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingId(p.id);
    setFormData({
      type: p.type,
      startDate: p.startDate,
      endDate: p.endDate,
      title: p.title,
      className: p.className,
      section: p.section,
      description: p.description,
      isHoliday: p.isHoliday
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error('Please enter title');
      return;
    }
    if (editingId) {
      setPlans(plans.map(p => p.id === editingId ? { ...p, ...formData } : p));
      toast.success('Calendar plan updated');
    } else {
      const newPlan = {
        id: String(Date.now()),
        ...formData
      };
      setPlans([newPlan, ...plans]);
      toast.success('Calendar plan created');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this calendar schedule?')) {
      setPlans(plans.filter(p => p.id !== id));
      toast.success('Calendar schedule deleted');
    }
  };

  const filteredPlans = plans.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.className.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportCSV = () => {
    const headers = ['S.NO.', 'DATE', 'TITLE', 'TYPE', 'CLASS', 'SECTION', 'DESCRIPTION', 'HOLIDAY'];
    const rows = filteredPlans.map((p, i) => [
      i + 1,
      `"${p.startDate === p.endDate ? p.startDate : `${p.startDate} - ${p.endDate}`}"`,
      `"${p.title}"`,
      `"${p.type}"`,
      `"${p.className}"`,
      `"${p.section}"`,
      `"${p.description}"`,
      p.isHoliday ? 'YES' : 'NO'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Calendar_Planning_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1:1 Secondary Top Header Toolbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20 print:hidden">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-bold text-slate-800 pr-3 border-r border-slate-300 flex items-center gap-2">
            <CalendarDays size={18} className="text-blue-600" />
            <span>Calendar Planning</span>
          </h1>
          <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
            <button onClick={() => onNavigate && onNavigate('dashboard')} className="hover:text-blue-600 flex items-center gap-1 transition-colors">
              <Home size={13} />
              <span>Home</span>
            </button>
            <span>/</span>
            <span className="text-slate-400">Front Office</span>
            <span>/</span>
            <span className="text-slate-700 font-semibold">Calendar Planning</span>
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
        {/* Search Bar & FAB */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between gap-4 print:hidden">
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search Calendar Planning & Events..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={openAddModal}
            className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105"
            title="Add Calendar Entry"
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
                  <th className="py-3 px-4">DATE</th>
                  <th className="py-3 px-4">TITLE</th>
                  <th className="py-3 px-4">TYPE</th>
                  <th className="py-3 px-4">TARGET CLASS</th>
                  <th className="py-3 px-4">DESCRIPTION</th>
                  <th className="py-3 px-4 text-center">HOLIDAY</th>
                  <th className="py-3 px-4 text-right print:hidden">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPlans.map((p, idx) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-center font-medium text-slate-500">{idx + 1}</td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-700 whitespace-nowrap">
                      {p.startDate === p.endDate ? p.startDate : `${p.startDate} ~ ${p.endDate}`}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{p.title}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        p.type === 'Event' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {p.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-medium">{p.className}</td>
                    <td className="py-3 px-4 text-slate-600 max-w-sm truncate" title={p.description}>
                      {p.description}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                        p.isHoliday ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {p.isHoliday ? 'Holiday' : 'Regular'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5 print:hidden">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1 text-slate-400 hover:text-blue-600 rounded transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 1:1 ADD CALENDAR Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="font-bold text-sm uppercase tracking-wide">
                {editingId ? 'EDIT CALENDAR ENTRY' : 'ADD CALENDAR'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2 cursor-pointer font-medium text-slate-700">
                  <input
                    type="radio"
                    name="calendarType"
                    checked={formData.type === 'Planning'}
                    onChange={() => setFormData({ ...formData, type: 'Planning' })}
                    className="text-blue-600"
                  />
                  <span>Planning</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer font-medium text-slate-700">
                  <input
                    type="radio"
                    name="calendarType"
                    checked={formData.type === 'Event'}
                    onChange={() => setFormData({ ...formData, type: 'Event' })}
                    className="text-blue-600"
                  />
                  <span>Event</span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Science Exhibition, Annual Function, Unit Test"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Target Class</label>
                  <select
                    value={formData.className}
                    onChange={e => setFormData({ ...formData, className: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="All Classes">All Classes</option>
                    <option value="Pre-Primary">Pre-Primary</option>
                    <option value="Primary (I - V)">Primary (I - V)</option>
                    <option value="Middle (VI - VIII)">Middle (VI - VIII)</option>
                    <option value="Secondary (IX - X)">Secondary (IX - X)</option>
                    <option value="Sr. Secondary (XI - XII)">Sr. Secondary (XI - XII)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Section</label>
                  <select
                    value={formData.section}
                    onChange={e => setFormData({ ...formData, section: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="All">All Sections</option>
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Details of activities, venue, and instructions..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="holidayCheck"
                  checked={formData.isHoliday}
                  onChange={e => setFormData({ ...formData, isHoliday: e.target.checked })}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <label htmlFor="holidayCheck" className="text-slate-700 font-semibold cursor-pointer">
                  Declare as Official School Holiday
                </label>
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
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
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
