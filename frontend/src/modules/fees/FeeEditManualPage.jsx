import React, { useState, useEffect } from 'react';
import { Search, Edit3, Download, Printer, FileEdit, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export function FeeEditManualPage() {
  const [students, setStudents] = useState([
    {
      sNo: 1,
      admNo: '1621',
      srNo: '1621',
      name: 'AADITYA SINGH CHOUDHARY',
      className: 'Class I-A',
      fatherName: 'NARENDRA SINGH CHOUDHARY',
      type: '0',
      heads: [
        { id: 'h_jd_1', feeHead: 'Admission Fee', amount: 5000, discount: 0, fine: 0, netPayable: 5000, isPaid: true },
        { id: 'h_jd_2', feeHead: 'Tuition Fee (Q1)', amount: 12000, discount: 0, fine: 0, netPayable: 12000, isPaid: true },
        { id: 'h_jd_3', feeHead: 'Tuition Fee (Q2)', amount: 12000, discount: 0, fine: 0, netPayable: 12000, isPaid: false },
        { id: 'h_jd_4', feeHead: 'Activity & Sports Fee', amount: 2000, discount: 500, fine: 0, netPayable: 1500, isPaid: false }
      ]
    },
    {
      sNo: 2,
      admNo: '2059',
      srNo: '2059',
      name: 'AADHYA CHOUDHARY',
      className: 'Nursery - PP3+-A',
      fatherName: 'RAMESH CHOUDHARY',
      type: '0',
      heads: [
        { id: 'h_jd_10', feeHead: 'Admission Fee', amount: 4000, discount: 0, fine: 0, netPayable: 4000, isPaid: true },
        { id: 'h_jd_11', feeHead: 'Tuition Fee (Term 1)', amount: 9500, discount: 0, fine: 0, netPayable: 9500, isPaid: true },
        { id: 'h_jd_12', feeHead: 'Tuition Fee (Term 2)', amount: 9500, discount: 0, fine: 0, netPayable: 9500, isPaid: false }
      ]
    },
    {
      sNo: 3,
      admNo: '2060',
      srNo: '2060',
      name: 'ROHAN SHARMA',
      className: 'X-A',
      fatherName: 'MUKESH SHARMA',
      type: '0',
      heads: [
        { id: 'h_jd_20', feeHead: 'Tuition Fee (Q1)', amount: 15000, discount: 0, fine: 0, netPayable: 15000, isPaid: true },
        { id: 'h_jd_21', feeHead: 'Tuition Fee (Q2)', amount: 15000, discount: 0, fine: 0, netPayable: 15000, isPaid: false },
        { id: 'h_jd_22', feeHead: 'Board Exam Fee', amount: 3500, discount: 0, fine: 0, netPayable: 3500, isPaid: false }
      ]
    },
    {
      sNo: 4,
      admNo: '2061',
      srNo: '2061',
      name: 'PRIYA KUMAWAT',
      className: 'Upper Kindergarten - PP5+-A',
      fatherName: 'DINESH KUMAWAT',
      type: '0',
      heads: [
        { id: 'h_jd_30', feeHead: 'Tuition Fee', amount: 18000, discount: 0, fine: 0, netPayable: 18000, isPaid: false },
        { id: 'h_jd_31', feeHead: 'Activity Fee', amount: 3000, discount: 0, fine: 0, netPayable: 3000, isPaid: false }
      ]
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editableHeads, setEditableHeads] = useState([]);
  const [manualRemark, setManualRemark] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchManualStudents();
  }, []);

  const fetchManualStudents = async () => {
    try {
      const res = await fetch('/api/fees/manual-students');
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        setStudents(data.data);
      }
    } catch {
      // Keep resilient defaults
    }
  };

  const handleOpenEdit = (stu) => {
    setSelectedStudent(stu);
    setEditableHeads(JSON.parse(JSON.stringify(stu.heads || [])));
    setManualRemark(stu.manualRemark || '');
  };

  const handleAmountChange = (index, val) => {
    setEditableHeads(prev => {
      const copy = [...prev];
      copy[index].amount = Number(val) || 0;
      copy[index].netPayable = copy[index].amount - (copy[index].discount || 0);
      return copy;
    });
  };

  const handleDiscountChange = (index, val) => {
    setEditableHeads(prev => {
      const copy = [...prev];
      copy[index].discount = Number(val) || 0;
      copy[index].netPayable = copy[index].amount - copy[index].discount;
      return copy;
    });
  };

  const handleSaveManualEdit = async () => {
    if (!selectedStudent) return;
    setIsLoading(true);

    try {
      await fetch('/api/fees/manual-edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admNo: selectedStudent.admNo,
          heads: editableHeads,
          remarks: manualRemark
        })
      });

      setStudents(prev => prev.map(s => s.admNo === selectedStudent.admNo ? { ...s, heads: editableHeads, manualRemark } : s));
      toast.success(`Fee ledger manually updated for ${selectedStudent.name}`);
      setSelectedStudent(null);
    } catch {
      toast.error('Failed to update student fee');
    } finally {
      setIsLoading(false);
    }
  };

  const exportExcel = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["S.No.,Adm No,SR No,Student Name,Class,Father Name,Net Due Amount"].concat(
        students.map((s, i) => {
          const dues = (s.heads || []).filter(h => !h.isPaid).reduce((sum, h) => sum + (h.netPayable || h.amount), 0);
          return `${i + 1},"${s.admNo}","${s.srNo}","${s.name}","${s.className}","${s.fatherName}",₹${dues}`;
        })
      ).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Fee_Edit_Manual_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Exported to CSV');
  };

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.admNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.fatherName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* 1:1 Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileEdit className="w-6 h-6 text-indigo-600" />
            Fee Edit Manual
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Fees &bull; <span className="text-indigo-600 font-medium">Individual Student Fee Ledger Customization</span>
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
              placeholder="Search by student name, adm no, or father name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Total Students: <span className="font-bold text-slate-800">{filtered.length}</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-500 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6 w-16">S.NO.</th>
                <th className="py-3.5 px-6 w-28">ADM.NO.</th>
                <th className="py-3.5 px-6 w-28">SR.NO.</th>
                <th className="py-3.5 px-6">NAME</th>
                <th className="py-3.5 px-6 w-32">CLASS</th>
                <th className="py-3.5 px-6">FATHER'S NAME</th>
                <th className="py-3.5 px-6 w-28">NET DUES</th>
                <th className="py-3.5 px-6 w-24 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((s, idx) => {
                const totalDue = (s.heads || []).filter(h => !h.isPaid).reduce((sum, h) => sum + (h.netPayable || h.amount), 0);
                return (
                  <tr key={s.admNo} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-6 font-medium text-slate-800">{idx + 1}</td>
                    <td className="py-3.5 px-6 font-mono font-semibold text-indigo-700">{s.admNo}</td>
                    <td className="py-3.5 px-6 font-mono text-slate-600">{s.srNo || s.admNo}</td>
                    <td className="py-3.5 px-6 font-bold text-slate-900">{s.name}</td>
                    <td className="py-3.5 px-6 font-medium text-slate-700">{s.className}</td>
                    <td className="py-3.5 px-6 text-slate-600">{s.fatherName}</td>
                    <td className="py-3.5 px-6 font-extrabold text-amber-700">₹{totalDue.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-6 text-right">
                      <button
                        onClick={() => handleOpenEdit(s)}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-lg text-xs transition"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit Fee
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    No students found matching your query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Fee Adjustment Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <FileEdit className="w-4 h-4 text-indigo-600" />
                  Manual Fee Adjustment: {selectedStudent.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Adm No: <span className="font-mono text-indigo-600 font-bold">{selectedStudent.admNo}</span> &bull; Class: {selectedStudent.className}
                </p>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-slate-400 hover:text-slate-600 rounded-lg p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                    <tr>
                      <th className="p-2.5">Fee Head</th>
                      <th className="p-2.5 w-28">Amount (₹)</th>
                      <th className="p-2.5 w-28">Discount (₹)</th>
                      <th className="p-2.5 w-28 text-right">Net Payable</th>
                      <th className="p-2.5 w-24 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {editableHeads.map((h, i) => (
                      <tr key={i} className="hover:bg-slate-50/50">
                        <td className="p-2.5 font-medium text-slate-800">{h.feeHead}</td>
                        <td className="p-2.5">
                          <input
                            type="number"
                            min="0"
                            disabled={h.isPaid}
                            value={h.amount}
                            onChange={(e) => handleAmountChange(i, e.target.value)}
                            className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 disabled:bg-slate-100"
                          />
                        </td>
                        <td className="p-2.5">
                          <input
                            type="number"
                            min="0"
                            disabled={h.isPaid}
                            value={h.discount || 0}
                            onChange={(e) => handleDiscountChange(i, e.target.value)}
                            className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-emerald-700 disabled:bg-slate-100"
                          />
                        </td>
                        <td className="p-2.5 text-right font-extrabold text-slate-900">
                          ₹{(h.netPayable || h.amount)?.toLocaleString('en-IN')}
                        </td>
                        <td className="p-2.5 text-center">
                          {h.isPaid ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              PAID
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                              DUE
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reason / Adjustment Remark
                </label>
                <input
                  type="text"
                  placeholder="e.g. Approved fee revision by Director / Special concession"
                  value={manualRemark}
                  onChange={(e) => setManualRemark(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <div className="text-xs text-slate-500">
                Total Revised Dues: <span className="font-extrabold text-slate-900">
                  ₹{editableHeads.filter(h => !h.isPaid).reduce((s, h) => s + (h.netPayable || h.amount), 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedStudent(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveManualEdit}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
                >
                  <Check className="w-4 h-4" />
                  {isLoading ? 'Saving...' : 'Apply Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
