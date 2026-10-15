import React, { useState } from 'react';
import {
  AlertCircle,
  Search,
  Home,
  Plus,
  Printer,
  FileDown,
  X,
  Trash2,
  CheckCircle,
  Clock,
  Shield,
  MessageSquare
} from 'lucide-react';
import toast from 'react-hot-toast';

const INITIAL_COMPLAINTS = [
  {
    id: '1',
    date: '2026-10-14',
    studentName: 'ROHAN SHARMA',
    admNo: '2060',
    className: 'Class X-A',
    complaintType: 'Discipline',
    complaintText: 'Continuous disturbance during Physics laboratory class and refusal to follow safety rules.',
    category: 'against-student',
    status: 'Pending Review',
    actionTaken: 'Parent notified via phone. Scheduled counselling session.'
  },
  {
    id: '2',
    date: '2026-10-12',
    studentName: 'AADITYA SINGH CHOUDHARY',
    admNo: '1621',
    className: 'Class I-A',
    complaintType: 'Bullying / Conflict',
    complaintText: 'Complained that another student snatched notebook during lunch break.',
    category: 'by-student',
    status: 'Resolved',
    actionTaken: 'Class teacher investigated and amicably resolved the matter. Notebook returned.'
  }
];

export function StudentComplaintPage({ onNavigate }) {
  const [complaints, setComplaints] = useState(INITIAL_COMPLAINTS);
  const [activeTab, setActiveTab] = useState('against-student'); // 'against-student' | 'by-student'
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    studentName: 'ROHAN SHARMA',
    admNo: '2060',
    className: 'Class X-A',
    complaintType: 'Discipline',
    complaintText: ''
  });

  const students = [
    { admNo: '1621', name: 'AADITYA SINGH CHOUDHARY', className: 'Class I-A' },
    { admNo: '2059', name: 'AADHYA CHOUDHARY', className: 'Nursery - PP3+-A' },
    { admNo: '2060', name: 'ROHAN SHARMA', className: 'Class X-A' },
    { admNo: '2061', name: 'PRIYA MEENA', className: 'Class IX-A' }
  ];

  const handleSelectStudent = (admNo) => {
    const s = students.find(item => item.admNo === admNo);
    if (s) {
      setFormData(prev => ({
        ...prev,
        admNo: s.admNo,
        studentName: s.name,
        className: s.className
      }));
    }
  };

  const openAddModal = () => {
    setFormData({
      studentName: 'ROHAN SHARMA',
      admNo: '2060',
      className: 'Class X-A',
      complaintType: 'Discipline',
      complaintText: ''
    });
    setIsModalOpen(true);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!formData.complaintText) {
      toast.error('Please enter complaint text');
      return;
    }
    const newComplaint = {
      id: String(Date.now()),
      date: new Date().toISOString().slice(0, 10),
      category: activeTab,
      status: 'Pending Review',
      actionTaken: 'Logged at Front Desk for Principal Review',
      ...formData
    };
    setComplaints([newComplaint, ...complaints]);
    toast.success('Complaint recorded successfully');
    setIsModalOpen(false);
  };

  const handleToggleResolve = (id) => {
    setComplaints(complaints.map(c =>
      c.id === id
        ? { ...c, status: c.status === 'Resolved' ? 'Pending Review' : 'Resolved' }
        : c
    ));
    toast.success('Status updated');
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this complaint record?')) {
      setComplaints(complaints.filter(c => c.id !== id));
      toast.success('Complaint deleted');
    }
  };

  const filteredComplaints = complaints.filter(c => {
    const matchesTab = c.category === activeTab;
    const matchesQuery =
      c.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.complaintType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.complaintText.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesQuery;
  });

  const exportCSV = () => {
    const headers = ['S.NO.', 'DATE', 'STUDENT NAME', 'ADM NO', 'CLASS', 'COMPLAINT TYPE', 'COMPLAINT TEXT', 'STATUS', 'ACTION TAKEN'];
    const rows = filteredComplaints.map((c, i) => [
      i + 1,
      `"${c.date}"`,
      `"${c.studentName}"`,
      `"${c.admNo}"`,
      `"${c.className}"`,
      `"${c.complaintType}"`,
      `"${c.complaintText}"`,
      `"${c.status}"`,
      `"${c.actionTaken}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Student_Complaints_${activeTab}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1:1 Secondary Top Header Toolbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20 print:hidden">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-bold text-slate-800 pr-3 border-r border-slate-300 flex items-center gap-2">
            <AlertCircle size={18} className="text-blue-600" />
            <span>Complaint</span>
          </h1>
          <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
            <button onClick={() => onNavigate && onNavigate('/')} className="hover:text-blue-600 flex items-center gap-1 transition-colors">
              <Home size={13} />
              <span>Home</span>
            </button>
            <span>/</span>
            <span className="text-slate-400">Front Office</span>
            <span>/</span>
            <span className="text-slate-700 font-semibold">Student Complaint</span>
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
        {/* Tabs 1:1 matching UAB screenshot */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-2 flex items-center justify-between gap-4 print:hidden">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('against-student')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'against-student'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Complaints Against Students
            </button>
            <button
              onClick={() => setActiveTab('by-student')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'by-student'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Complaints By Student
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search Complaints..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={openAddModal}
              className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-md transition-transform hover:scale-105 shrink-0"
              title="Add Complaint"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 uppercase font-semibold">
                  <th className="py-3 px-4 w-12 text-center">S.NO.</th>
                  <th className="py-3 px-4">DATE</th>
                  <th className="py-3 px-4">STUDENT NAME</th>
                  <th className="py-3 px-4">CLASS</th>
                  <th className="py-3 px-4">COMPLAINT TYPE</th>
                  <th className="py-3 px-4">DESCRIPTION</th>
                  <th className="py-3 px-4">ACTION TAKEN</th>
                  <th className="py-3 px-4 text-center">STATUS</th>
                  <th className="py-3 px-4 text-right print:hidden">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredComplaints.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="py-8 text-center text-slate-400">
                      No complaints registered in this tab. Click + to add one.
                    </td>
                  </tr>
                ) : (
                  filteredComplaints.map((c, idx) => (
                    <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 text-center font-medium text-slate-500">{idx + 1}</td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-700">{c.date}</td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{c.studentName}</div>
                        <div className="text-[11px] font-mono text-slate-400">Adm: {c.admNo}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">{c.className}</td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          {c.complaintType}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 max-w-xs">{c.complaintText}</td>
                      <td className="py-3 px-4 text-slate-500 italic max-w-xs">{c.actionTaken}</td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleToggleResolve(c.id)}
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-colors ${
                            c.status === 'Resolved'
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
                <label className="block text-slate-600 font-medium mb-1">Student Search</label>
                <select
                  value={formData.admNo}
                  onChange={e => handleSelectStudent(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {students.map(s => (
                    <option key={s.admNo} value={s.admNo}>
                      {s.name} ({s.className} - Adm: {s.admNo})
                    </option>
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
                  <option value="Discipline">Discipline</option>
                  <option value="Bullying / Conflict">Bullying / Conflict</option>
                  <option value="Academic Irresponsibility">Academic Irresponsibility</option>
                  <option value="Damage to School Property">Damage to School Property</option>
                  <option value="Uniform / Grooming">Uniform / Grooming</option>
                  <option value="Attendance / Truancy">Attendance / Truancy</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Complaint Text *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe incident in detail..."
                  value={formData.complaintText}
                  onChange={e => setFormData({ ...formData, complaintText: e.target.value })}
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
