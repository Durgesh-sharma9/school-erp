import React, { useState } from 'react';
import { Percent, Search, Download, Printer } from 'lucide-react';
import toast from 'react-hot-toast';

export function FeeConcessionSummaryReportPage() {
  const [reportType, setReportType] = useState('All');
  const [concessionType, setConcessionType] = useState('All');

  const [records, setRecords] = useState([
    { sNo: 1, admNo: '2049', srNo: '2049', name: 'BHAVYA', className: 'III-A', total: 5000, concessionBy: 'Principal', remarks: 'Staff ward fee discount' },
    { sNo: 2, admNo: '2050', srNo: '2050', name: 'PRIYANSHU JOYA', className: 'V-A', total: 8000, concessionBy: 'Management', remarks: 'EWS scholarship' }
  ]);

  const totalConcession = records.reduce((sum, r) => sum + r.total, 0);

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["S.No,Adm No,SR No,Student Name,Class,Total Concession,Concession By,Remarks"].concat(
        records.map(r => `${r.sNo},"${r.admNo}","${r.srNo}","${r.name}","${r.className}",${r.total},"${r.concessionBy}","${r.remarks}"`)
      ).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `Fee_Concession_Report.csv`);
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
            <Percent className="w-6 h-6 text-indigo-600" />
            Fee Concession Report
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Fees &bull; <span className="text-indigo-600 font-medium">Scholarships & Discretionary Fee Waivers</span>
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
              <option value="All">All Categories</option>
              <option value="Staff">Staff</option>
              <option value="Poor Student">Poor Student</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Concession Type</label>
            <select value={concessionType} onChange={(e) => setConcessionType(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">
              <option value="All">All Types</option>
              <option value="Principal">Principal Discretionary</option>
              <option value="Management">Management Quota</option>
            </select>
          </div>

          <div className="flex flex-col justify-end">
            <button onClick={() => toast.success('Concession report filtered')} className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5">
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
                <th className="py-3.5 px-6">S.NO</th>
                <th className="py-3.5 px-6">ADM.NO</th>
                <th className="py-3.5 px-6">SR.NO</th>
                <th className="py-3.5 px-6">NAME</th>
                <th className="py-3.5 px-6">CLASS</th>
                <th className="py-3.5 px-6">CONCESSION BY</th>
                <th className="py-3.5 px-6">REMARKS</th>
                <th className="py-3.5 px-6 text-right font-bold text-slate-900">TOTAL (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map((r) => (
                <tr key={r.admNo} className="hover:bg-slate-50/60">
                  <td className="py-3.5 px-6 font-medium text-slate-800">{r.sNo}</td>
                  <td className="py-3.5 px-6 font-mono font-bold text-indigo-700">{r.admNo}</td>
                  <td className="py-3.5 px-6 font-mono text-slate-500">{r.srNo}</td>
                  <td className="py-3.5 px-6 font-bold text-slate-900">{r.name}</td>
                  <td className="py-3.5 px-6 text-slate-600">{r.className}</td>
                  <td className="py-3.5 px-6 font-medium text-slate-700">{r.concessionBy}</td>
                  <td className="py-3.5 px-6 text-slate-500">{r.remarks}</td>
                  <td className="py-3.5 px-6 text-right font-black text-emerald-700">₹{r.total.toLocaleString('en-IN')}</td>
                </tr>
              ))}
              <tr className="bg-slate-50 font-bold border-t-2 border-slate-200">
                <td colSpan="7" className="py-3.5 px-6 text-right uppercase tracking-wider text-slate-700">Total Granted Concessions:</td>
                <td className="py-3.5 px-6 text-right font-black text-emerald-700 text-sm">₹{totalConcession.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
