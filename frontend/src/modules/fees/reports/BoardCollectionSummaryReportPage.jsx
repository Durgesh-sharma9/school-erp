import React, { useState } from 'react';
import { Award, Search, Download, Printer, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';
import { tenantStore } from '../../../services/tenantStore';

export function BoardCollectionSummaryReportPage() {
  const [fromDate, setFromDate] = useState('2026-04-01');
  const [toDate, setToDate] = useState('2026-10-15');

  const [records, setRecords] = useState([
    { sNo: 1, receiptNo: 'JD-BRD-001', date: '2026-05-02', admNo: '2060', name: 'ROHAN SHARMA', className: 'X-A', rollNo: '1014', amount: 3500, payMode: 'Bank Transfer', status: 'SUCCESS' },
    { sNo: 2, receiptNo: 'JD-BRD-002', date: '2026-05-18', admNo: '2055', name: 'SAURAV', className: 'X-A', rollNo: '1015', amount: 3500, payMode: 'Cash', status: 'SUCCESS' },
    { sNo: 3, receiptNo: 'JD-BRD-003', date: '2026-06-04', admNo: '2070', name: 'KAVITA MEENA', className: 'XII-HUMANITIES-A', rollNo: '1209', amount: 3800, payMode: 'UPI', status: 'SUCCESS' }
  ]);

  const totalBoardCollected = records.reduce((sum, r) => sum + r.amount, 0);

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["S.No.,Receipt No,Date,Adm No,Student Name,Class,Roll No,Amount,Pay Mode,Status"].concat(
        records.map(r => `${r.sNo},"${r.receiptNo}","${r.date}","${r.admNo}","${r.name}","${r.className}","${r.rollNo}",${r.amount},"${r.payMode}","${r.status}"`)
      ).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `Board_Collection_Summary.csv`);
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
            <Award className="w-6 h-6 text-indigo-600" />
            Board Collection Summary
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Fees &bull; <span className="text-indigo-600 font-medium">Class X & XII Board Examination Fees Registry</span>
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
            <label className="block text-xs font-semibold text-slate-700 mb-1">From Date</label>
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">To Date</label>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs" />
          </div>

          <div className="flex flex-col justify-end">
            <button onClick={() => toast.success('Board collection filtered')} className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5">
              <Search className="w-4 h-4" /> Search
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[11px] border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">S.NO.</th>
                <th className="py-3.5 px-6">RECEIPT NO.</th>
                <th className="py-3.5 px-6">DATE</th>
                <th className="py-3.5 px-6">ADM. NO.</th>
                <th className="py-3.5 px-6">STUDENT NAME</th>
                <th className="py-3.5 px-6">CLASS</th>
                <th className="py-3.5 px-6">ROLL NO.</th>
                <th className="py-3.5 px-6">PAY MODE</th>
                <th className="py-3.5 px-6">STATUS</th>
                <th className="py-3.5 px-6 text-right font-bold text-slate-900">AMOUNT (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map((r) => (
                <tr key={r.receiptNo} className="hover:bg-slate-50/60">
                  <td className="py-3.5 px-6 font-medium text-slate-800">{r.sNo}</td>
                  <td className="py-3.5 px-6 font-mono font-bold text-indigo-700">{r.receiptNo}</td>
                  <td className="py-3.5 px-6 text-slate-500">{r.date}</td>
                  <td className="py-3.5 px-6 font-mono text-slate-700">{r.admNo}</td>
                  <td className="py-3.5 px-6 font-bold text-slate-900">{r.name}</td>
                  <td className="py-3.5 px-6 text-slate-600">{r.className}</td>
                  <td className="py-3.5 px-6 font-mono text-slate-600">{r.rollNo}</td>
                  <td className="py-3.5 px-6 font-medium">{r.payMode}</td>
                  <td className="py-3.5 px-6">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-3 h-3" /> {r.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right font-extrabold text-slate-900">₹{r.amount.toLocaleString('en-IN')}</td>
                </tr>
              ))}
              <tr className="bg-slate-50 font-bold border-t-2 border-slate-200">
                <td colSpan="9" className="py-3.5 px-6 text-right uppercase tracking-wider text-slate-700">Total Board Fees Collected:</td>
                <td className="py-3.5 px-6 text-right font-black text-indigo-700 text-sm">₹{totalBoardCollected.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
