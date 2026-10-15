import React, { useState } from 'react';
import { Search, Download, Printer, Filter, Calendar, IndianRupee } from 'lucide-react';
import toast from 'react-hot-toast';

export function FeeCollectionSummaryReportPage() {
  const [reportType, setReportType] = useState('Date Wise');
  const [payMode, setPayMode] = useState('All');
  const [startDate, setStartDate] = useState('2026-04-01');
  const [endDate, setEndDate] = useState('2026-10-15');
  const [sortedBy, setSortedBy] = useState('Receipt No.');

  const [receipts, setReceipts] = useState([
    { sNo: 1, receiptNo: 'JD-REC-001', date: '2026-04-10', admNo: '1621', studentName: 'AADITYA SINGH CHOUDHARY', className: 'Class I-A', payMode: 'UPI', refNo: 'UPI/610291039', amount: 17000 },
    { sNo: 2, receiptNo: 'JD-REC-002', date: '2026-04-12', admNo: '2059', studentName: 'AADHYA CHOUDHARY', className: 'Nursery - PP3+-A', payMode: 'Cash', refNo: 'COUNTER CASH', amount: 13500 },
    { sNo: 3, receiptNo: 'JD-REC-003', date: '2026-05-02', admNo: '2060', studentName: 'ROHAN SHARMA', className: 'X-A', payMode: 'Bank Transfer', refNo: 'NEFT/HDFC/9921', amount: 15000 }
  ]);

  const handleSearch = () => {
    toast.success('Fee collection summary updated');
  };

  const totalAmount = receipts.reduce((sum, r) => sum + r.amount, 0);

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["S.No.,Receipt No,Date,Adm No,Student Name,Class,Pay Mode,Ref No,Amount"].concat(
        receipts.map(r => `${r.sNo},"${r.receiptNo}","${r.date}","${r.admNo}","${r.studentName}","${r.className}","${r.payMode}","${r.refNo}",${r.amount}`)
      ).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `Fee_Collection_Summary_${reportType}.csv`);
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
            <IndianRupee className="w-6 h-6 text-indigo-600" />
            Fee Collection Summary
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Fees &bull; <span className="text-indigo-600 font-medium">Fee Collection Summary</span>
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Report Type</label>
            <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">
              <option value="Date Wise">Date Wise</option>
              <option value="Month Wise">Month Wise</option>
              <option value="Class Wise">Class Wise</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Mode</label>
            <select value={payMode} onChange={(e) => setPayMode(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">
              <option value="All">All Modes</option>
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Bank">Bank Transfer</option>
              <option value="Cheque">Cheque</option>
              <option value="POS">POS / Card</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">From Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">To Date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs" />
          </div>

          <div className="flex flex-col justify-end">
            <button onClick={handleSearch} className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5">
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
                <th className="py-3.5 px-6">PAY MODE</th>
                <th className="py-3.5 px-6">REF / DETAILS</th>
                <th className="py-3.5 px-6 text-right font-bold text-slate-900">AMOUNT (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {receipts.map((r) => (
                <tr key={r.receiptNo} className="hover:bg-slate-50/60">
                  <td className="py-3.5 px-6 font-medium text-slate-800">{r.sNo}</td>
                  <td className="py-3.5 px-6 font-mono font-bold text-indigo-700">{r.receiptNo}</td>
                  <td className="py-3.5 px-6 text-slate-500">{r.date}</td>
                  <td className="py-3.5 px-6 font-mono text-slate-700">{r.admNo}</td>
                  <td className="py-3.5 px-6 font-bold text-slate-900">{r.studentName}</td>
                  <td className="py-3.5 px-6 text-slate-600">{r.className}</td>
                  <td className="py-3.5 px-6 font-medium">{r.payMode}</td>
                  <td className="py-3.5 px-6 text-slate-500 text-[11px]">{r.refNo}</td>
                  <td className="py-3.5 px-6 text-right font-extrabold text-slate-900">₹{r.amount.toLocaleString('en-IN')}</td>
                </tr>
              ))}
              <tr className="bg-slate-50 font-bold border-t-2 border-slate-200">
                <td colSpan="8" className="py-3.5 px-6 text-right uppercase tracking-wider text-slate-700">Total Collection:</td>
                <td className="py-3.5 px-6 text-right font-black text-emerald-700 text-sm">₹{totalAmount.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
