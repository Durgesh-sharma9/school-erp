import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Home,
  Plus,
  Printer,
  FileDown,
  X,
  Clock,
  User,
  CheckCircle,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

const INITIAL_STAFF_PASSES = [];

export function StaffGatePassPage({ onNavigate }) {
  const [passes, setPasses] = useState(INITIAL_STAFF_PASSES);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPassForPrint, setSelectedPassForPrint] = useState(null);

  const [formData, setFormData] = useState({
    staffCode: '201',
    name: 'MONIKA RANI VERMA',
    desig: 'Teacher',
    dept: 'TEACHING',
    timeIn: '08:00 AM',
    timeOut: '12:00 PM',
    reason: '',
    remark: '',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80'
  });

  const staffOptions = [
    { code: '101', name: 'ABHILASHA BHATT', desig: 'Principal', dept: 'ADMINISTRATIVE & MANAGEMENT', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80' },
    { code: '102', name: 'PRITI VERMA', desig: 'Administrator', dept: 'ADMINISTRATIVE & MANAGEMENT', photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80' },
    { code: '201', name: 'MONIKA RANI VERMA', desig: 'Teacher', dept: 'TEACHING', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80' },
    { code: '202', name: 'SUNITA KUMARI', desig: 'Teacher', dept: 'TEACHING', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80' },
    { code: '501', name: 'BHARAT JANGID', desig: 'Driver', dept: 'TRANSPORT', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80' }
  ];

  const handleSelectStaff = (code) => {
    const s = staffOptions.find(opt => opt.code === code);
    if (s) {
      setFormData(prev => ({
        ...prev,
        staffCode: s.code,
        name: s.name,
        desig: s.desig,
        dept: s.dept,
        photo: s.photo
      }));
    }
  };

  const openAddModal = () => {
    setFormData({
      staffCode: '201',
      name: 'MONIKA RANI VERMA',
      desig: 'Teacher',
      dept: 'TEACHING',
      timeIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timeOut: '',
      reason: '',
      remark: '',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80'
    });
    setIsModalOpen(true);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!formData.reason) {
      toast.error('Please enter reason for leaving');
      return;
    }
    const newPass = {
      id: String(Date.now()),
      passNo: `SGP-2026-00${passes.length + 1}`,
      date: new Date().toISOString().slice(0, 10),
      status: 'Approved',
      ...formData
    };
    setPasses([newPass, ...passes]);
    toast.success('Staff gate pass issued successfully');
    setIsModalOpen(false);
  };

  const handlePrint = (pass) => {
    setSelectedPassForPrint(pass);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const filteredPasses = passes.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.staffCode.includes(searchQuery) ||
    p.desig.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportCSV = () => {
    const headers = ['S.NO.', 'PASS NO.', 'STAFF CODE', 'NAME', 'DESIGNATION', 'DEPARTMENT', 'DATE', 'TIME IN', 'TIME OUT', 'REASON', 'REMARK', 'STATUS'];
    const rows = filteredPasses.map((p, i) => [
      i + 1,
      `"${p.passNo}"`,
      `"${p.staffCode}"`,
      `"${p.name}"`,
      `"${p.desig}"`,
      `"${p.dept}"`,
      `"${p.date}"`,
      `"${p.timeIn}"`,
      `"${p.timeOut}"`,
      `"${p.reason}"`,
      `"${p.remark}"`,
      `"${p.status}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Staff_Gate_Passes_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1:1 Secondary Top Header Toolbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20 print:hidden">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-bold text-slate-800 pr-3 border-r border-slate-300 flex items-center gap-2">
            <ShieldAlert size={18} className="text-blue-600" />
            <span>Staff Gate Pass</span>
          </h1>
          <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
            <button onClick={() => onNavigate && onNavigate('/')} className="hover:text-blue-600 flex items-center gap-1 transition-colors">
              <Home size={13} />
              <span>Home</span>
            </button>
            <span>/</span>
            <span className="text-slate-400">Front Office</span>
            <span>/</span>
            <span className="text-slate-700 font-semibold">Staff Gate Pass</span>
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

      <div className="p-6 max-w-7xl mx-auto w-full space-y-6 print:hidden">
        {/* Search Bar & FAB */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search Staff Name, Code, Reason..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={openAddModal}
            className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105"
            title="Issue Staff Gate Pass"
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
                  <th className="py-3 px-4 w-16">PHOTO</th>
                  <th className="py-3 px-4">NAME</th>
                  <th className="py-3 px-4">DESIGNATION</th>
                  <th className="py-3 px-4">DEPARTMENT</th>
                  <th className="py-3 px-4">DATE</th>
                  <th className="py-3 px-4">TIME</th>
                  <th className="py-3 px-4">REASON FOR LEAVING</th>
                  <th className="py-3 px-4 text-center">STATUS</th>
                  <th className="py-3 px-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPasses.map((p, idx) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-center font-medium text-slate-500">{idx + 1}</td>
                    <td className="py-3 px-4">
                      <img
                        src={p.photo}
                        alt={p.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-xs"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{p.name}</div>
                      <div className="text-[11px] font-mono font-bold text-blue-600">ID: {p.staffCode}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">{p.desig}</td>
                    <td className="py-3 px-4 text-slate-600">{p.dept}</td>
                    <td className="py-3 px-4 font-mono text-slate-700">{p.date}</td>
                    <td className="py-3 px-4 font-mono text-slate-700 text-[11px]">
                      <div>Out: {p.timeOut}</div>
                      <div className="text-slate-400">In: {p.timeIn}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700 max-w-xs truncate" title={p.reason}>
                      {p.reason}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5">
                      <button
                        onClick={() => handlePrint(p)}
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-[11px] font-semibold transition-colors inline-flex items-center gap-1"
                      >
                        <Printer size={12} />
                        <span>Print Pass</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Printable Staff Pass Slip */}
      {selectedPassForPrint && (
        <div className="hidden print:block p-8 max-w-lg mx-auto border-2 border-slate-800 rounded-xl">
          <div className="text-center border-b pb-3 mb-4">
            <h2 className="text-xl font-bold uppercase tracking-wider text-slate-900">J D INTERNATIONAL SCHOOL</h2>
            <p className="text-xs text-slate-500">Official Staff Gate Pass Out Slip</p>
            <div className="text-xs font-mono font-bold mt-1 text-blue-600">Pass: {selectedPassForPrint.passNo}</div>
          </div>

          <div className="flex gap-4 mb-4">
            <img src={selectedPassForPrint.photo} alt="Staff" className="w-20 h-24 object-cover border rounded" />
            <div className="text-xs space-y-1">
              <div><strong>Staff Name:</strong> {selectedPassForPrint.name} (Code: {selectedPassForPrint.staffCode})</div>
              <div><strong>Designation:</strong> {selectedPassForPrint.desig}</div>
              <div><strong>Department:</strong> {selectedPassForPrint.dept}</div>
              <div><strong>Date:</strong> {selectedPassForPrint.date}</div>
              <div><strong>Out Time:</strong> {selectedPassForPrint.timeOut} | <strong>Return Time:</strong> {selectedPassForPrint.timeIn}</div>
              <div><strong>Reason:</strong> {selectedPassForPrint.reason}</div>
            </div>
          </div>

          <div className="bg-slate-100 p-2.5 rounded text-xs mb-4">
            <strong>Remark:</strong> {selectedPassForPrint.remark || 'Authorized by Department Head.'}
          </div>

          <div className="flex justify-between items-end pt-8 text-xs text-slate-600">
            <div>
              <div className="w-32 border-b border-slate-400 mb-1"></div>
              <span>Staff Signature</span>
            </div>
            <div>
              <div className="w-32 border-b border-slate-400 mb-1"></div>
              <span>Principal / Admin</span>
            </div>
          </div>
        </div>
      )}

      {/* 1:1 STAFF GATE PASS Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="font-bold text-sm uppercase tracking-wide">STAFF GATE PASS</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Staff Search..</label>
                <select
                  value={formData.staffCode}
                  onChange={e => handleSelectStaff(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {staffOptions.map(s => (
                    <option key={s.code} value={s.code}>
                      {s.name} ({s.desig} - {s.dept})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Exit Time (Time Out)</label>
                  <input
                    type="text"
                    required
                    value={formData.timeOut}
                    onChange={e => setFormData({ ...formData, timeOut: e.target.value })}
                    placeholder="e.g. 11:30 AM"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Estimated Return (Time In)</label>
                  <input
                    type="text"
                    value={formData.timeIn}
                    onChange={e => setFormData({ ...formData, timeIn: e.target.value })}
                    placeholder="e.g. 02:00 PM"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Reason For Leaving *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Official duty, Personal emergency, Bank work..."
                  value={formData.reason}
                  onChange={e => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Remark</label>
                <input
                  type="text"
                  placeholder="Sanctioning authority notes..."
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
                  Issue Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
