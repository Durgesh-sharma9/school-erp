import React, { useState } from 'react';
import {
  FileWarning,
  Search,
  Home,
  Plus,
  Printer,
  FileDown,
  X,
  Trash2,
  CheckCircle,
  AlertTriangle,
  UserX
} from 'lucide-react';
import toast from 'react-hot-toast';

const INITIAL_STAFF_COMPLAINTS = [];

export function StaffComplaintPage({ onNavigate }) {
  const [complaints, setComplaints] = useState(INITIAL_STAFF_COMPLAINTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    againstStaff: 'HANSRAJ JAT (Driver - Transport)',
    complaintType: 'Punctuality',
    reason: ''
  });

  const staffOptions = [
    'ABHILASHA BHATT (Principal)',
    'PRITI VERMA (Administrator)',
    'MONIKA RANI VERMA (Teacher)',
    'SUNITA KUMARI (Teacher)',
    'BHARAT JANGID (Driver - Transport)',
    'HANSRAJ JAT (Driver - Transport)',
    'RAJENDRA SINGH (Security Supervisor)'
  ];

  const openAddModal = () => {
    setFormData({
      againstStaff: 'HANSRAJ JAT (Driver - Transport)',
      complaintType: 'Punctuality',
      reason: ''
    });
    setIsModalOpen(true);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!formData.reason) {
      toast.error('Please enter complaint reason');
      return;
    }
    const newComplaint = {
      id: String(Date.now()),
      date: new Date().toISOString().slice(0, 10),
      status: 'Under Review',
      actionTaken: 'Registered at Front Office for Management Inquiry',
      ...formData
    };
    setComplaints([newComplaint, ...complaints]);
    toast.success('Staff complaint logged successfully');
    setIsModalOpen(false);
  };

  const handleToggleResolve = (id) => {
    setComplaints(complaints.map(c =>
      c.id === id
        ? { ...c, status: c.status === 'Investigated & Resolved' ? 'Under Review' : 'Investigated & Resolved' }
        : c
    ));
    toast.success('Complaint status updated');
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this complaint record?')) {
      setComplaints(complaints.filter(c => c.id !== id));
      toast.success('Staff complaint deleted');
    }
  };

  const filteredComplaints = complaints.filter(c =>
    c.againstStaff.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.complaintType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportCSV = () => {
    const headers = ['S.NO.', 'DATE', 'COMPLAINT AGAINST', 'COMPLAINT TYPE', 'REASON', 'STATUS', 'ACTION TAKEN'];
    const rows = filteredComplaints.map((c, i) => [
      i + 1,
      `"${c.date}"`,
      `"${c.againstStaff}"`,
      `"${c.complaintType}"`,
      `"${c.reason}"`,
      `"${c.status}"`,
      `"${c.actionTaken}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Staff_Complaints_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1:1 Secondary Top Header Toolbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20 print:hidden">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-bold text-slate-800 pr-3 border-r border-slate-300 flex items-center gap-2">
            <FileWarning size={18} className="text-blue-600" />
            <span>Staff Complaint (Manual Complaint)</span>
          </h1>
          <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
            <button onClick={() => onNavigate && onNavigate('/')} className="hover:text-blue-600 flex items-center gap-1 transition-colors">
              <Home size={13} />
              <span>Home</span>
            </button>
            <span>/</span>
            <span className="text-slate-400">Front Office</span>
            <span>/</span>
            <span className="text-slate-700 font-semibold">Staff Complaint</span>
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
              placeholder="Search Staff Complaints, Staff Name, Reason..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={openAddModal}
            className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105"
            title="Log Staff Complaint"
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
                  <th className="py-3 px-4">COMPLAINT AGAINST</th>
                  <th className="py-3 px-4">COMPLAINT TYPE</th>
                  <th className="py-3 px-4">REASON / DESCRIPTION</th>
                  <th className="py-3 px-4">ACTION TAKEN</th>
                  <th className="py-3 px-4 text-center">STATUS</th>
                  <th className="py-3 px-4 text-right print:hidden">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredComplaints.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-8 text-center text-slate-400">
                      No staff complaints recorded. Click + to add one.
                    </td>
                  </tr>
                ) : (
                  filteredComplaints.map((c, idx) => (
                    <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 text-center font-medium text-slate-500">{idx + 1}</td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-700">{c.date}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{c.againstStaff}</td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          {c.complaintType}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 max-w-sm">{c.reason}</td>
                      <td className="py-3 px-4 text-slate-500 italic max-w-xs">{c.actionTaken}</td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleToggleResolve(c.id)}
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-colors ${
                            c.status === 'Investigated & Resolved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {c.status}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right print:hidden">
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                          title="Delete"
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

      {/* 1:1 ADD COMPLAINT Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="font-bold text-sm uppercase tracking-wide">ADD COMPLAINT</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Complaint Against</label>
                <select
                  value={formData.againstStaff}
                  onChange={e => setFormData({ ...formData, againstStaff: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {staffOptions.map(staff => (
                    <option key={staff} value={staff}>{staff}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Complaint Type</label>
                <select
                  value={formData.complaintType}
                  onChange={e => setFormData({ ...formData, complaintType: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="Punctuality">Punctuality / Late Arrival</option>
                  <option value="Misbehavior">Misbehavior / Unprofessional Conduct</option>
                  <option value="Negligence">Negligence in Duty</option>
                  <option value="Harassment / Abuse">Harassment / Verbal Abuse</option>
                  <option value="Code of Conduct">Violation of Code of Conduct</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Complaint Reason *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detail the complaint reason and specifics..."
                  value={formData.reason}
                  onChange={e => setFormData({ ...formData, reason: e.target.value })}
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
