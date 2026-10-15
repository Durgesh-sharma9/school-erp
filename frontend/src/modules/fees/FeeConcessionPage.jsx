import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Download, Printer, Percent, X, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export function FeeConcessionPage() {
  const [concessions, setConcessions] = useState([
    { id: '1', admNo: '2049', srNo: '2049', studentName: 'BHAVYA', className: 'III-A', fatherName: 'NAVEEN YADAV', concessionType: 'Staff', concessionBy: 'Principal', amount: 5000, percentage: 50, status: 'APPROVED' },
    { id: '2', admNo: '2050', srNo: '2050', studentName: 'PRIYANSHU JOYA', className: 'V-A', fatherName: 'NARPAT LAL JOYA', concessionType: 'Poor Student', concessionBy: 'Management', amount: 8000, percentage: 100, status: 'APPROVED' }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    admNo: '',
    srNo: '',
    studentName: '',
    className: 'Class I-A',
    fatherName: '',
    concessionType: 'Staff',
    concessionBy: 'Principal',
    amount: '5000',
    percentage: '50'
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchConcessions();
  }, []);

  const fetchConcessions = async () => {
    try {
      const res = await fetch('/api/fees/concessions');
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        setConcessions(data.data);
      }
    } catch {
      // Keep defaults
    }
  };

  const handleOpenModal = () => {
    setFormData({
      admNo: '',
      srNo: '',
      studentName: '',
      className: 'Class I-A',
      fatherName: '',
      concessionType: 'Staff',
      concessionBy: 'Principal',
      amount: '5000',
      percentage: '50'
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.admNo.trim() || !formData.studentName.trim()) {
      toast.error('Enter Admission Number and Student Name');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        admNo: formData.admNo.trim(),
        srNo: formData.srNo.trim() || formData.admNo.trim(),
        studentName: formData.studentName.trim(),
        className: formData.className,
        fatherName: formData.fatherName.trim() || 'Parent',
        concessionType: formData.concessionType,
        concessionBy: formData.concessionBy,
        amount: Number(formData.amount) || 0,
        percentage: Number(formData.percentage) || 0
      };

      await fetch('/api/fees/concessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const newRecord = { id: String(Date.now()), ...payload, status: 'APPROVED' };
      setConcessions(prev => [newRecord, ...prev]);
      toast.success('Fee concession assigned successfully');
      setIsModalOpen(false);
    } catch {
      toast.error('Failed to assign concession');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this concession assignment?')) return;
    try {
      await fetch(`/api/fees/concessions/${id}`, { method: 'DELETE' });
      setConcessions(prev => prev.filter(c => c.id !== id));
      toast.success('Concession removed');
    } catch {
      toast.error('Failed to delete concession');
    }
  };

  const exportExcel = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["S.No.,Adm No,SR No,Student Name,Class,Father Name,Concession Type,Concession By,Amount,Percentage"].concat(
        concessions.map((c, i) => `${i + 1},"${c.admNo}","${c.srNo}","${c.studentName}","${c.className}","${c.fatherName}","${c.concessionType}","${c.concessionBy}",₹${c.amount},${c.percentage}%`)
      ).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Fee_Concessions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Exported to CSV');
  };

  const filtered = concessions.filter(c =>
    c.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.admNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.concessionType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* 1:1 Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Percent className="w-6 h-6 text-indigo-600" />
            Fee Concession
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Fees &bull; <span className="text-indigo-600 font-medium">Student Fee Concession Allotment</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button
            onClick={handleOpenModal}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            Add Fee Concession
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by student name, adm no, or concession type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Total Allotted: <span className="font-bold text-slate-800">{filtered.length}</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-500 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6 w-16">S.NO.</th>
                <th className="py-3.5 px-6 w-24">ADM.NO.</th>
                <th className="py-3.5 px-6 w-24">SR.NO.</th>
                <th className="py-3.5 px-6">NAME</th>
                <th className="py-3.5 px-6 w-28">CLASS</th>
                <th className="py-3.5 px-6">FATHER'S NAME</th>
                <th className="py-3.5 px-6 w-36">CONCESSION TYPE</th>
                <th className="py-3.5 px-6 w-32">CONCESSION BY</th>
                <th className="py-3.5 px-6 w-28">DISCOUNT</th>
                <th className="py-3.5 px-6 w-20 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((c, idx) => (
                <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-6 font-medium text-slate-800">{idx + 1}</td>
                  <td className="py-3.5 px-6 font-mono font-semibold text-indigo-700">{c.admNo}</td>
                  <td className="py-3.5 px-6 font-mono text-slate-600">{c.srNo}</td>
                  <td className="py-3.5 px-6 font-bold text-slate-900">{c.studentName}</td>
                  <td className="py-3.5 px-6 font-medium text-slate-700">{c.className}</td>
                  <td className="py-3.5 px-6 text-slate-600">{c.fatherName}</td>
                  <td className="py-3.5 px-6">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-50 text-indigo-700">
                      {c.concessionType}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-slate-600 font-medium">{c.concessionBy}</td>
                  <td className="py-3.5 px-6 font-extrabold text-emerald-700">₹{c.amount} ({c.percentage}%)</td>
                  <td className="py-3.5 px-6 text-right">
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Remove Concession"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="10" className="py-12 text-center text-slate-400">
                    No student concessions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Concession Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Percent className="w-4 h-4 text-indigo-600" />
                Assign Fee Concession to Student
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 rounded-lg p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Admission No. *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2059"
                    value={formData.admNo}
                    onChange={(e) => setFormData(prev => ({ ...prev, admNo: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aadhya Choudhary"
                    value={formData.studentName}
                    onChange={(e) => setFormData(prev => ({ ...prev, studentName: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Class
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Nursery - PP3+-A"
                    value={formData.className}
                    onChange={(e) => setFormData(prev => ({ ...prev, className: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Father's Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Choudhary"
                    value={formData.fatherName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fatherName: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Concession Category
                  </label>
                  <select
                    value={formData.concessionType}
                    onChange={(e) => setFormData(prev => ({ ...prev, concessionType: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="Staff">Staff</option>
                    <option value="Poor Student">Poor Student (EWS)</option>
                    <option value="Handicap">Handicap</option>
                    <option value="Principal">Principal Discretionary</option>
                    <option value="Management">Management Quota</option>
                    <option value="3rd Child">3rd Child</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Approved By
                  </label>
                  <select
                    value={formData.concessionBy}
                    onChange={(e) => setFormData(prev => ({ ...prev, concessionBy: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="Principal">Principal</option>
                    <option value="Director">Director</option>
                    <option value="Management">Management</option>
                    <option value="Trust">Trust</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Discount Amount (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Percentage (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.percentage}
                    onChange={(e) => setFormData(prev => ({ ...prev, percentage: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
                >
                  {isLoading ? 'Saving...' : 'Assign Concession'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
