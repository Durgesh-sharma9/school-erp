import React, { useState } from 'react';
import { Search, Download, Printer, RefreshCw, CheckCircle, Clock, AlertTriangle, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

export function OnlineCollectionSummaryReportPage() {
  const [startDate, setStartDate] = useState('2026-04-01');
  const [endDate, setEndDate] = useState('2026-10-15');
  const [statusType, setStatusType] = useState('Success');
  const [gateway, setGateway] = useState('All');

  const [transactions, setTransactions] = useState([
    { sNo: 1, txnId: 'ATOM_TXN_881920', date: '2026-04-10', admNo: '1621', studentName: 'AADITYA SINGH CHOUDHARY', className: 'Class I-A', gateway: 'Atom Gateway', status: 'SUCCESS', amount: 17000 },
    { sNo: 2, txnId: 'RZP_TXN_992102', date: '2026-05-02', admNo: '2060', studentName: 'ROHAN SHARMA', className: 'Class X-A', gateway: 'Razorpay', status: 'SUCCESS', amount: 15000 },
    { sNo: 3, txnId: 'EAZ_TXN_332110', date: '2026-06-14', admNo: '2059', studentName: 'AADHYA CHOUDHARY', className: 'Nursery - PP3+-A', gateway: 'Easebuzz', status: 'SUCCESS', amount: 9500 }
  ]);

  const handleRecheck = () => {
    toast.success('Synced online gateway settlement statuses');
  };

  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["S.No.,Txn ID,Date,Adm No,Student Name,Class,Gateway,Status,Amount"].concat(
        transactions.map(t => `${t.sNo},"${t.txnId}","${t.date}","${t.admNo}","${t.studentName}","${t.className}","${t.gateway}","${t.status}",${t.amount}`)
      ).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `Online_Collection_Summary.csv`);
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
            <Globe className="w-6 h-6 text-indigo-600" />
            Online Collection Summary
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Fees &bull; <span className="text-indigo-600 font-medium">Online Payment Gateway Settlements</span>
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
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">To Date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Status Type</label>
            <select value={statusType} onChange={(e) => setStatusType(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">
              <option value="Success">Success Only</option>
              <option value="All">All Transactions</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Gateway</label>
            <select value={gateway} onChange={(e) => setGateway(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">
              <option value="All">All Gateways</option>
              <option value="Atom">Atom Payment Gateway</option>
              <option value="Razorpay">Razorpay</option>
              <option value="Easebuzz">Easebuzz</option>
            </select>
          </div>

          <div className="flex gap-2 items-end">
            <button onClick={() => toast.success('Filtered transactions')} className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1">
              <Search className="w-3.5 h-3.5" /> Search
            </button>
            <button onClick={handleRecheck} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1" title="Recheck Gateway Status">
              <RefreshCw className="w-3.5 h-3.5" /> Recheck
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
                <th className="py-3.5 px-6">TRANSACTION ID</th>
                <th className="py-3.5 px-6">DATE</th>
                <th className="py-3.5 px-6">ADM. NO.</th>
                <th className="py-3.5 px-6">STUDENT NAME</th>
                <th className="py-3.5 px-6">CLASS</th>
                <th className="py-3.5 px-6">GATEWAY</th>
                <th className="py-3.5 px-6">STATUS</th>
                <th className="py-3.5 px-6 text-right font-bold text-slate-900">AMOUNT (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((t) => (
                <tr key={t.txnId} className="hover:bg-slate-50/60">
                  <td className="py-3.5 px-6 font-medium text-slate-800">{t.sNo}</td>
                  <td className="py-3.5 px-6 font-mono font-bold text-indigo-700">{t.txnId}</td>
                  <td className="py-3.5 px-6 text-slate-500">{t.date}</td>
                  <td className="py-3.5 px-6 font-mono text-slate-700">{t.admNo}</td>
                  <td className="py-3.5 px-6 font-bold text-slate-900">{t.studentName}</td>
                  <td className="py-3.5 px-6 text-slate-600">{t.className}</td>
                  <td className="py-3.5 px-6 font-medium text-slate-700">{t.gateway}</td>
                  <td className="py-3.5 px-6">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-3 h-3" /> {t.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right font-extrabold text-slate-900">₹{t.amount.toLocaleString('en-IN')}</td>
                </tr>
              ))}
              <tr className="bg-slate-50 font-bold border-t-2 border-slate-200">
                <td colSpan="8" className="py-3.5 px-6 text-right uppercase tracking-wider text-slate-700">Total Online Settled:</td>
                <td className="py-3.5 px-6 text-right font-black text-emerald-700 text-sm">₹{totalAmount.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
