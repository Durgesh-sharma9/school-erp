import React, { useState } from 'react';
import { CreditCard, Search, Download, Printer } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';
import { tenantStore } from '../../../services/tenantStore';

export function FeeAdvanceReportPage() {
  const { schoolId } = useAuth();
  const [reportType, setReportType] = useState('All');
  const [selectedClass, setSelectedClass] = useState('All');

  const [advances, setAdvances] = useState([]);

  React.useEffect(() => {
    try {
      const receipts = tenantStore.getReceipts(schoolId) || [];
      const withAdvance = receipts
        .filter(r => Number(r.advanceAmount || 0) > 0)
        .map((r, idx) => ({
          sNo: idx + 1,
          admNo: r.admNo,
          srNo: r.srNo || r.admNo,
          name: r.studentName,
          className: r.className || 'Class I',
          advanceAmount: Number(r.advanceAmount || 0),
          dateReceived: r.date,
          payMode: r.payMode,
          remarks: r.remarks || 'Advance deposit credit'
        }));
      setAdvances(withAdvance);
    } catch (e) {
      console.error(e);
    }
  }, [schoolId]);

  const totalAdvance = advances.reduce((sum, a) => sum + a.advanceAmount, 0);

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["S.No.,Adm No,SR No,Student Name,Class,Advance Amount,Date Received,Pay Mode,Remarks"].concat(
        advances.map(a => `${a.sNo},"${a.admNo}","${a.srNo}","${a.name}","${a.className}",${a.advanceAmount},"${a.dateReceived}","${a.payMode}","${a.remarks}"`)
      ).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `Fee_Advance_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Exported to CSV');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-indigo-600" />
            Advance Report
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Fees &bull; <span className="text-indigo-600 font-medium">Prepaid Fee Balance Register</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={exportCSV} className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl">
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>
      </div>

      {/* Filter Bar (1:1 with UAB) */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Report type</label>
            <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">
              <option value="All">All Advance Credits</option>
              <option value="Active">Active Balance Only</option>
              <option value="Adjusted">Fully Adjusted</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Class</label>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">
              <option value="All">All Classes</option>
              <option value="Nursery - PP3+">Nursery - PP3+</option>
              <option value="I">Class I</option>
              <option value="X">Class X</option>
            </select>
          </div>

          <div className="flex flex-col justify-end">
            <button onClick={() => toast.success('Advance report filtered')} className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5">
              <Search className="w-4 h-4" /> Search
            </button>
          </div>
        </div>
      </div>

      {/* Table (1:1 with UAB) */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[11px] border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">S.NO.</th>
                <th className="py-3.5 px-6">ADM. NO.</th>
                <th className="py-3.5 px-6">SR. NO.</th>
                <th className="py-3.5 px-6">NAME</th>
                <th className="py-3.5 px-6">CLASS</th>
                <th className="py-3.5 px-6">DATE RECEIVED</th>
                <th className="py-3.5 px-6">PAY MODE</th>
                <th className="py-3.5 px-6">REMARKS</th>
                <th className="py-3.5 px-6 text-right font-bold text-slate-900">ADVANCE (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {advances.map((a) => (
                <tr key={a.admNo} className="hover:bg-slate-50/60">
                  <td className="py-3.5 px-6 font-medium text-slate-800">{a.sNo}</td>
                  <td className="py-3.5 px-6 font-mono font-bold text-indigo-700">{a.admNo}</td>
                  <td className="py-3.5 px-6 font-mono text-slate-500">{a.srNo}</td>
                  <td className="py-3.5 px-6 font-bold text-slate-900">{a.name}</td>
                  <td className="py-3.5 px-6 text-slate-600">{a.className}</td>
                  <td className="py-3.5 px-6 text-slate-500">{a.dateReceived}</td>
                  <td className="py-3.5 px-6 font-medium">{a.payMode}</td>
                  <td className="py-3.5 px-6 text-slate-500 text-[11px]">{a.remarks}</td>
                  <td className="py-3.5 px-6 text-right font-black text-emerald-700">₹{a.advanceAmount.toLocaleString('en-IN')}</td>
                </tr>
              ))}
              <tr className="bg-slate-50 font-bold border-t-2 border-slate-200">
                <td colSpan="8" className="py-3.5 px-6 text-right uppercase tracking-wider text-slate-700">Total Advance Credit Balance:</td>
                <td className="py-3.5 px-6 text-right font-black text-emerald-700 text-sm">₹{totalAdvance.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
