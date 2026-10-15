import React, { useState } from 'react';
import {
  Briefcase,
  Search,
  Home,
  Plus,
  Printer,
  FileDown,
  X,
  Trash2,
  Calendar,
  Building
} from 'lucide-react';
import toast from 'react-hot-toast';

const INITIAL_VISITS = [
  {
    id: '1',
    empCode: '101',
    employeeName: 'ABHILASHA BHATT',
    desig: 'Principal',
    dateRange: '2026-10-12 to 2026-10-13',
    schoolName: 'Delhi Public School, Jaipur',
    remark: 'CBSE Sahodaya School Complex Principals Conclave on NEP 2020 curriculum implementation.'
  },
  {
    id: '2',
    empCode: '102',
    employeeName: 'PRITI VERMA',
    desig: 'Administrator',
    dateRange: '2026-10-08 to 2026-10-08',
    schoolName: 'St. Xavier’s Senior Secondary School, Jaipur',
    remark: 'Inter-school administrative summit regarding digital fee collection and biometric access standards.'
  }
];

export function VisitStaffMeetingPage({ onNavigate }) {
  const [visits, setVisits] = useState(INITIAL_VISITS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    empCode: '101',
    employeeName: 'ABHILASHA BHATT',
    desig: 'Principal',
    dateRange: `${new Date().toISOString().slice(0, 10)} to ${new Date().toISOString().slice(0, 10)}`,
    schoolName: '',
    remark: ''
  });

  const staffList = [
    { code: '101', name: 'ABHILASHA BHATT', desig: 'Principal' },
    { code: '102', name: 'PRITI VERMA', desig: 'Administrator' },
    { code: '201', name: 'MONIKA RANI VERMA', desig: 'Teacher' },
    { code: '202', name: 'SUNITA KUMARI', desig: 'Teacher' }
  ];

  const handleSelectStaff = (code) => {
    const s = staffList.find(opt => opt.code === code);
    if (s) {
      setFormData(prev => ({
        ...prev,
        empCode: s.code,
        employeeName: s.name,
        desig: s.desig
      }));
    }
  };

  const openAddModal = () => {
    setFormData({
      empCode: '101',
      employeeName: 'ABHILASHA BHATT',
      desig: 'Principal',
      dateRange: `${new Date().toISOString().slice(0, 10)} to ${new Date().toISOString().slice(0, 10)}`,
      schoolName: '',
      remark: ''
    });
    setIsModalOpen(true);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!formData.schoolName) {
      toast.error('Please enter visited institution/school name');
      return;
    }
    const newVisit = {
      id: String(Date.now()),
      ...formData
    };
    setVisits([newVisit, ...visits]);
    toast.success('Staff visit meeting recorded');
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this visit meeting record?')) {
      setVisits(visits.filter(v => v.id !== id));
      toast.success('Visit record deleted');
    }
  };

  const filteredVisits = visits.filter(v =>
    v.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.remark.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportCSV = () => {
    const headers = ['S.NO.', 'DATE', 'EMPLOYEE NAME', 'DESIGNATION', 'SCHOOL / INSTITUTION NAME', 'REMARK'];
    const rows = filteredVisits.map((v, i) => [
      i + 1,
      `"${v.dateRange}"`,
      `"${v.employeeName}"`,
      `"${v.desig}"`,
      `"${v.schoolName}"`,
      `"${v.remark}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Staff_Visit_Meetings_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1:1 Secondary Top Header Toolbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20 print:hidden">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-bold text-slate-800 pr-3 border-r border-slate-300 flex items-center gap-2">
            <Briefcase size={18} className="text-blue-600" />
            <span>Visit Staff Meeting</span>
          </h1>
          <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
            <button onClick={() => onNavigate && onNavigate('/')} className="hover:text-blue-600 flex items-center gap-1 transition-colors">
              <Home size={13} />
              <span>Home</span>
            </button>
            <span>/</span>
            <span className="text-slate-400">Front Office</span>
            <span>/</span>
            <span className="text-slate-700 font-semibold">Visit Staff Meeting</span>
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
              placeholder="Search Staff, Visited School, Remark..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={openAddModal}
            className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105"
            title="Add Staff Visit Meeting"
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
                  <th className="py-3 px-4">EMPLOYEE NAME</th>
                  <th className="py-3 px-4">SCHOOL / VENUE NAME</th>
                  <th className="py-3 px-4">REMARK / PURPOSE</th>
                  <th className="py-3 px-4 text-right print:hidden">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredVisits.map((v, idx) => (
                  <tr key={v.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-center font-medium text-slate-500">{idx + 1}</td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-700">{v.dateRange}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{v.employeeName}</div>
                      <div className="text-[11px] text-slate-400">{v.desig}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-blue-700">{v.schoolName}</td>
                    <td className="py-3 px-4 text-slate-600 max-w-md">{v.remark}</td>
                    <td className="py-3 px-4 text-right print:hidden">
                      <button
                        onClick={() => handleDelete(v.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        title="Delete"
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

      {/* 1:1 VISIT Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="font-bold text-sm uppercase tracking-wide">VISIT</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Employee Name</label>
                <select
                  value={formData.empCode}
                  onChange={e => handleSelectStaff(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {staffList.map(s => (
                    <option key={s.code} value={s.code}>
                      {s.name} ({s.desig})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Enter a date range</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2026-10-15 to 2026-10-16"
                  value={formData.dateRange}
                  onChange={e => setFormData({ ...formData, dateRange: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">School / Institution Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Visited venue or host school"
                  value={formData.schoolName}
                  onChange={e => setFormData({ ...formData, schoolName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Remark</label>
                <textarea
                  rows={3}
                  placeholder="Meeting agenda, minutes, and findings..."
                  value={formData.remark}
                  onChange={e => setFormData({ ...formData, remark: e.target.value })}
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
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
