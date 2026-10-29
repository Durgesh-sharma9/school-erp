import React, { useState, useEffect } from 'react';
import { Award, Search, IndianRupee, CheckCircle, Download, Printer, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { tenantStore } from '../../services/tenantStore';

export function BoardFeeManualCollectionPage() {
  const { schoolId } = useAuth();
  const [students, setStudents] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [payMode, setPayMode] = useState('Cash');
  const [paidAmount, setPaidAmount] = useState('3500');
  const [remarks, setRemarks] = useState('CBSE Board Examination Registration Fee');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchBoardStudents();
  }, [schoolId]);

  const fetchBoardStudents = async () => {
    try {
      const realStudents = tenantStore.getStudents(schoolId) || [];
      const boardEligible = realStudents
        .filter(s => {
          const cls = String(s.className || '').toUpperCase();
          return cls.includes('X') || cls.includes('10') || cls.includes('XII') || cls.includes('12');
        })
        .map(s => ({
          admNo: s.admNo,
          srNo: s.srNo || s.admNo,
          name: (s.name || `${s.firstName || ''} ${s.lastName || ''}`).trim() || `Student ${s.admNo}`,
          className: `${s.className || 'X'}-${s.section || 'A'}`,
          boardFee: Number(s.boardFee || 3500),
          paid: Boolean(s.boardFeePaid)
        }));

      setStudents(boardEligible);

      try {
        const res = await fetch('/api/fees/board-students', {
          headers: { 'x-school-id': schoolId }
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setStudents(data.data);
        }
      } catch (err) {}
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenCollect = (stu) => {
    setSelectedStudent(stu);
    setPaidAmount(String(stu.boardFee || 3500));
  };

  const handleConfirmCollect = async () => {
    if (!selectedStudent) return;
    setIsLoading(true);

    try {
      const res = await fetch('/api/fees/board-collect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admNo: selectedStudent.admNo,
          paidAmount: Number(paidAmount),
          payMode,
          remarks
        })
      });
      const data = await res.json();

      setStudents(prev => prev.map(s => s.admNo === selectedStudent.admNo ? { ...s, paid: true } : s));
      toast.success(`Board Fee collected for ${selectedStudent.name}. Receipt: ${data.data?.receiptNo || 'JD-BRD-001'}`);
      setSelectedStudent(null);
    } catch {
      toast.error('Board fee collection failed');
    } finally {
      setIsLoading(false);
    }
  };

  const exportExcel = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["S.No.,Adm No,Student Name,Class,Board Fee,Status"].concat(
        students.map((s, i) => `${i + 1},"${s.admNo}","${s.name}","${s.className}",₹${s.boardFee},${s.paid ? 'PAID' : 'DUE'}`)
      ).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Board_Fee_Collection.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Exported to CSV');
  };

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.admNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.className.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* 1:1 Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Award className="w-6 h-6 text-indigo-600" />
            Board Fee Manual Entry
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Fees &bull; <span className="text-indigo-600 font-medium">Class X & XII Board Examination Fee Portal</span>
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
            Print List
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
              placeholder="Search candidate name, adm no, or class..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Eligible Board Candidates: <span className="font-bold text-slate-800">{filtered.length}</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-500 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6 w-16">S.NO.</th>
                <th className="py-3.5 px-6 w-28">ADM.NO.</th>
                <th className="py-3.5 px-6">STUDENT NAME</th>
                <th className="py-3.5 px-6 w-36">CLASS</th>
                <th className="py-3.5 px-6 w-32">BOARD FEE</th>
                <th className="py-3.5 px-6 w-28">STATUS</th>
                <th className="py-3.5 px-6 w-32 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((s, idx) => (
                <tr key={s.admNo} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-6 font-medium text-slate-800">{idx + 1}</td>
                  <td className="py-3.5 px-6 font-mono font-bold text-indigo-700">{s.admNo}</td>
                  <td className="py-3.5 px-6 font-bold text-slate-900">{s.name}</td>
                  <td className="py-3.5 px-6 font-medium text-slate-700">{s.className}</td>
                  <td className="py-3.5 px-6 font-extrabold text-slate-900">₹{s.boardFee?.toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-6">
                    {s.paid ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                        <CheckCircle className="w-3 h-3" /> PAID
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
                        PENDING
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    {s.paid ? (
                      <span className="text-[11px] text-slate-400 font-medium">Receipt Issued</span>
                    ) : (
                      <button
                        onClick={() => handleOpenCollect(s)}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs shadow-xs transition"
                      >
                        <IndianRupee className="w-3.5 h-3.5" /> Collect Fee
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    No board candidates found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Collect Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-600" />
                Collect Board Examination Fee
              </h3>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-slate-400 hover:text-slate-600 rounded-lg p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Student:</span>
                  <span className="font-bold text-slate-900">{selectedStudent.name}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Adm No:</span>
                  <span className="font-mono text-indigo-600 font-bold">{selectedStudent.admNo}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Class:</span>
                  <span className="font-medium text-slate-800">{selectedStudent.className}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Board Fee Amount (₹) *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Payment Mode
                </label>
                <select
                  value={payMode}
                  onChange={(e) => setPayMode(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                >
                  <option value="Cash">Cash Counter</option>
                  <option value="UPI">UPI / QR Code</option>
                  <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
                  <option value="Cheque">Bank Cheque</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Remark
                </label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedStudent(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCollect}
                  disabled={isLoading}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
                >
                  {isLoading ? 'Saving...' : 'Collect & Issue Receipt'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
