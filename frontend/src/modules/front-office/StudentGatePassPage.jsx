import React, { useState } from 'react';
import {
  IdCard,
  Search,
  Home,
  Plus,
  Printer,
  FileDown,
  X,
  Clock,
  Phone,
  Camera,
  User,
  CheckCircle,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

const INITIAL_PASSES = [];

export function StudentGatePassPage({ onNavigate }) {
  const [passes, setPasses] = useState(INITIAL_PASSES);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPassForPrint, setSelectedPassForPrint] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    visitorName: '',
    contactNo: '',
    relation: 'Father',
    timeIn: '10:00 AM',
    timeOut: '11:00 AM',
    reason: '',
    remark: '',
    status: 'Approved',
    admNo: '1621',
    studentName: 'AADITYA SINGH CHOUDHARY',
    className: 'Class I-A',
    photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'
  });

  const openAddModal = () => {
    setFormData({
      visitorName: '',
      contactNo: '',
      relation: 'Father',
      timeIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timeOut: '',
      reason: '',
      remark: '',
      status: 'Approved',
      admNo: '1621',
      studentName: 'AADITYA SINGH CHOUDHARY',
      className: 'Class I-A',
      photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'
    });
    setIsModalOpen(true);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!formData.visitorName || !formData.contactNo) {
      toast.error('Please enter visitor name and contact number');
      return;
    }
    const newPass = {
      id: String(Date.now()),
      passNo: `GP-2026-00${passes.length + 1}`,
      date: new Date().toISOString().slice(0, 10),
      ...formData
    };
    setPasses([newPass, ...passes]);
    toast.success('Gate pass issued successfully');
    setIsModalOpen(false);
  };

  const handlePrintSlip = (pass) => {
    setSelectedPassForPrint(pass);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const filteredPasses = passes.filter(p =>
    p.visitorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.contactNo.includes(searchQuery) ||
    p.passNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportCSV = () => {
    const headers = ['S.NO.', 'PASS NO.', 'VISITOR NAME', 'CONTACT NO.', 'DATE', 'TIME IN', 'TIME OUT', 'STUDENT NAME', 'CLASS', 'RELATION', 'REASON', 'STATUS'];
    const rows = filteredPasses.map((p, i) => [
      i + 1,
      `"${p.passNo}"`,
      `"${p.visitorName}"`,
      `"${p.contactNo}"`,
      `"${p.date}"`,
      `"${p.timeIn}"`,
      `"${p.timeOut}"`,
      `"${p.studentName}"`,
      `"${p.className}"`,
      `"${p.relation}"`,
      `"${p.reason}"`,
      `"${p.status}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Student_Gate_Passes_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1:1 Secondary Top Header Toolbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20 print:hidden">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-bold text-slate-800 pr-3 border-r border-slate-300 flex items-center gap-2">
            <IdCard size={18} className="text-blue-600" />
            <span>Student Gate Pass</span>
          </h1>
          <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
            <button onClick={() => onNavigate && onNavigate('/')} className="hover:text-blue-600 flex items-center gap-1 transition-colors">
              <Home size={13} />
              <span>Home</span>
            </button>
            <span>/</span>
            <span className="text-slate-400">Front Office</span>
            <span>/</span>
            <span className="text-slate-700 font-semibold">Student Gate Pass</span>
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
            <span>Print List</span>
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
              placeholder="Search Visitor, Student, Phone, Pass No..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={openAddModal}
            className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105"
            title="Issue Gate Pass"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Passes Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 uppercase font-semibold">
                  <th className="py-3 px-4 w-12 text-center">S.NO.</th>
                  <th className="py-3 px-4 w-16">PHOTO</th>
                  <th className="py-3 px-4">VISITOR NAME</th>
                  <th className="py-3 px-4">CONTACT NO.</th>
                  <th className="py-3 px-4">DATE</th>
                  <th className="py-3 px-4">TIME (IN/OUT)</th>
                  <th className="py-3 px-4">STUDENT NAME</th>
                  <th className="py-3 px-4 text-center">STATUS</th>
                  <th className="py-3 px-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPasses.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="py-8 text-center text-slate-400">
                      No gate passes recorded. Click + to issue one.
                    </td>
                  </tr>
                ) : (
                  filteredPasses.map((p, idx) => (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 text-center font-medium text-slate-500">{idx + 1}</td>
                      <td className="py-3 px-4">
                        <img
                          src={p.photo}
                          alt={p.visitorName}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-xs"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{p.visitorName}</div>
                        <div className="text-[11px] text-slate-400">Relation: {p.relation}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700">{p.contactNo}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{p.date}</td>
                      <td className="py-3 px-4 font-mono text-slate-700 text-[11px]">
                        <div>In: {p.timeIn}</div>
                        <div className="text-slate-400">Out: {p.timeOut || 'In Campus'}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-blue-700">{p.studentName}</div>
                        <div className="text-[11px] text-slate-400">{p.className} (Adm: {p.admNo})</div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1.5">
                        <button
                          onClick={() => handlePrintSlip(p)}
                          className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-[11px] font-semibold transition-colors inline-flex items-center gap-1"
                        >
                          <Printer size={12} />
                          <span>Print Pass</span>
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

      {/* Printable Pass Slip */}
      {selectedPassForPrint && (
        <div className="hidden print:block p-8 max-w-lg mx-auto border-2 border-slate-800 rounded-xl">
          <div className="text-center border-b pb-3 mb-4">
            <h2 className="text-xl font-bold uppercase tracking-wider text-slate-900">J D INTERNATIONAL SCHOOL</h2>
            <p className="text-xs text-slate-500">Official Student Gate Pass Slip</p>
            <div className="text-xs font-mono font-bold mt-1 text-blue-600">Pass No: {selectedPassForPrint.passNo}</div>
          </div>

          <div className="flex gap-4 mb-4">
            <img src={selectedPassForPrint.photo} alt="Visitor" className="w-20 h-24 object-cover border rounded" />
            <div className="text-xs space-y-1">
              <div><strong>Visitor Name:</strong> {selectedPassForPrint.visitorName} ({selectedPassForPrint.relation})</div>
              <div><strong>Contact No:</strong> {selectedPassForPrint.contactNo}</div>
              <div><strong>Date:</strong> {selectedPassForPrint.date}</div>
              <div><strong>Time In:</strong> {selectedPassForPrint.timeIn} | <strong>Time Out:</strong> {selectedPassForPrint.timeOut}</div>
              <div><strong>Reason:</strong> {selectedPassForPrint.reason}</div>
            </div>
          </div>

          <div className="bg-slate-100 p-3 rounded text-xs space-y-1 mb-4">
            <div className="font-bold text-slate-800">STUDENT INFORMATION</div>
            <div><strong>Student Name:</strong> {selectedPassForPrint.studentName}</div>
            <div><strong>Class:</strong> {selectedPassForPrint.className} | <strong>Adm No:</strong> {selectedPassForPrint.admNo}</div>
          </div>

          <div className="flex justify-between items-end pt-8 text-xs text-slate-600">
            <div>
              <div className="w-32 border-b border-slate-400 mb-1"></div>
              <span>Visitor Signature</span>
            </div>
            <div>
              <div className="w-32 border-b border-slate-400 mb-1"></div>
              <span>Front Desk / Security</span>
            </div>
          </div>
        </div>
      )}

      {/* 1:1 GATE PASS Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="font-bold text-sm uppercase tracking-wide">GATE PASS</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-5 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <span className="font-bold text-blue-900 block mb-1">STUDENT INFORMATION</span>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div><span className="text-slate-500">Student:</span> <strong>AADITYA SINGH CHOUDHARY</strong></div>
                  <div><span className="text-slate-500">Class:</span> Class I-A</div>
                  <div><span className="text-slate-500">Father:</span> Ramesh Choudhary</div>
                  <div><span className="text-slate-500">Adm No:</span> 1621</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Visitor Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter visitor name"
                    value={formData.visitorName}
                    onChange={e => setFormData({ ...formData, visitorName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Visitor's Ph. No. *</label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile"
                    value={formData.contactNo}
                    onChange={e => setFormData({ ...formData, contactNo: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Relation</label>
                  <select
                    value={formData.relation}
                    onChange={e => setFormData({ ...formData, relation: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Brother">Brother</option>
                    <option value="Sister">Sister</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Driver">Driver / Van Operator</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Time In</label>
                  <input
                    type="text"
                    value={formData.timeIn}
                    onChange={e => setFormData({ ...formData, timeIn: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Time Out</label>
                  <input
                    type="text"
                    placeholder="Estimated exit"
                    value={formData.timeOut}
                    onChange={e => setFormData({ ...formData, timeOut: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Reason for Entry / Early Pickup</label>
                <input
                  type="text"
                  required
                  placeholder="Medical, Family emergency, Document collection..."
                  value={formData.reason}
                  onChange={e => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Remark</label>
                <input
                  type="text"
                  placeholder="Authorization remarks..."
                  value={formData.remark}
                  onChange={e => setFormData({ ...formData, remark: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="text-[11px] text-slate-400">Status: Approved</span>
                <div className="space-x-2">
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
                    Issue Gate Pass
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
