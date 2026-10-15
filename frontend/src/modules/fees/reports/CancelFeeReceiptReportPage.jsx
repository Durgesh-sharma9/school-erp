import React, { useState } from 'react';
import { XCircle, Search, Download, Printer } from 'lucide-react';
import toast from 'react-hot-toast';

export function CancelFeeReceiptReportPage() {
  const [fromDate, setFromDate] = useState('2026-04-01');
  const [toDate, setToDate] = useState('2026-10-15');
  const [reportType, setReportType] = useState('All');
  const [selectedClass, setSelectedClass] = useState('All');

  const [cancelledReceipts] = useState([
    {
      sNo: 1,
      admNo: '1621',
      srNo: '1621',
      name: 'AADITYA SINGH CHOUDHARY',
      className: 'Nursery - PP3+-A',
      recNo: 'REC-2026-009',
      recDate: '2026-04-12',
      cancelDate: '2026-04-13',
      remark: 'Wrong head selection by cashier',
      amount: 4500,
      paid: 4500,
      cancelBy: 'ADMINISTRATOR',
      user: 'Cashier-01'
    },
    {
      sNo: 2,
      admNo: '1245',
      srNo: '1245',
      name: 'BHAVYA VERMA',
      className: 'Class II-B',
      recNo: 'REC-2026-034',
      recDate: '2026-05-02',
      cancelDate: '2026-05-03',
      remark: 'Cheque bounced / cancelled before clearance',
      amount: 6000,
      paid: 6000,
      cancelBy: 'PRINCIPAL',
      user: 'Accountant-Main'
    }
  ]);

  const totalCancelledAmount = cancelledReceipts.reduce((sum, r) => sum + r.amount, 0);

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["S.No.,Adm No,SR No,Student Name,Class,Rec No,Rec Date,Cancel Date,Remark,Amount,Paid,Cancel By,User"].concat(
        cancelledReceipts.map(r => `${r.sNo},"${r.admNo}","${r.srNo}","${r.name}","${r.className}","${r.recNo}","${r.recDate}","${r.cancelDate}","${r.remark}",${r.amount},${r.paid},"${r.cancelBy}","${r.user}"`)
      ).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `Cancelled_Fee_Receipts_Report.csv`);
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
            <XCircle className="w-6 h-6 text-rose-600" />
            Cancel Fee Receipt Report
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Fees &bull; <span className="text-rose-600 font-medium">Voided & Cancelled Receipts Audit Log</span>
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
            <label className="block text-xs font-semibold text-slate-700 mb-1">From Date</label>
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">To Date</label>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Report</label>
            <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">
              <option value="All">All Cancelled</option>
              <option value="Counter">Counter Receipts</option>
              <option value="Online">Online Receipts</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Class</label>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">
              <option value="All">All Classes</option>
              <option value="Nursery - PP3+">Nursery - PP3+</option>
              <option value="Class II">Class II</option>
              <option value="Class X">Class X</option>
            </select>
          </div>

          <div className="flex flex-col justify-end">
            <button onClick={() => toast.success('Cancelled receipts report filtered')} className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5">
              <Search className="w-4 h-4" /> Search
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100 flex justify-between items-center">
          <div>
            <div className="text-[11px] font-semibold text-rose-600 uppercase tracking-wider">Total Cancelled Receipts</div>
            <div className="text-xl font-bold text-rose-900 mt-1">{cancelledReceipts.length} Receipts Voided</div>
          </div>
        </div>
        <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 flex justify-between items-center">
          <div>
            <div className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider">Total Voided Amount</div>
            <div className="text-xl font-bold text-amber-900 mt-1">₹{totalCancelledAmount.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Table (1:1 with UAB) */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[11px] border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">S.NO.</th>
                <th className="py-3.5 px-4">ADM.NO.</th>
                <th className="py-3.5 px-4">SR.NO.</th>
                <th className="py-3.5 px-4">NAME</th>
                <th className="py-3.5 px-4">CLASS</th>
                <th className="py-3.5 px-4">REC.NO.</th>
                <th className="py-3.5 px-4">REC.DATE</th>
                <th className="py-3.5 px-4">CANCEL DATE</th>
                <th className="py-3.5 px-4">REMARK</th>
                <th className="py-3.5 px-4 text-right">AMOUNT (₹)</th>
                <th className="py-3.5 px-4 text-right">PAID (₹)</th>
                <th className="py-3.5 px-4">CANCEL BY</th>
                <th className="py-3.5 px-4">USER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cancelledReceipts.map((r, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 text-slate-400 font-mono">{r.sNo}</td>
                  <td className="py-3.5 px-4 font-mono text-indigo-600">{r.admNo}</td>
                  <td className="py-3.5 px-4 font-mono">{r.srNo}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">{r.name}</td>
                  <td className="py-3.5 px-4">{r.className}</td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-rose-600">{r.recNo}</td>
                  <td className="py-3.5 px-4 font-mono">{r.recDate}</td>
                  <td className="py-3.5 px-4 font-mono text-rose-500 font-medium">{r.cancelDate}</td>
                  <td className="py-3.5 px-4 italic text-[11px] text-slate-500">{r.remark}</td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-800">₹{r.amount.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-right font-mono text-emerald-700">₹{r.paid.toLocaleString()}</td>
                  <td className="py-3.5 px-4 font-semibold text-rose-700">{r.cancelBy}</td>
                  <td className="py-3.5 px-4 text-slate-500">{r.user}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50/75 border-t border-slate-200 font-bold text-slate-900">
              <tr>
                <td colSpan="9" className="py-3.5 px-4 text-right text-xs">Total Void Amount:</td>
                <td className="py-3.5 px-4 text-right font-mono text-rose-600">₹{totalCancelledAmount.toLocaleString()}</td>
                <td colSpan="3"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
