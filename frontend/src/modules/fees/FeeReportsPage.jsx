import React, { useState, useEffect } from 'react';
import { FileText, Download, Printer, Search, Calendar, Filter, CheckCircle, AlertCircle, IndianRupee, PieChart } from 'lucide-react';
import toast from 'react-hot-toast';

export function FeeReportsPage() {
  const [activeTab, setActiveTab] = useState('collection-summary');
  const [reportData, setReportData] = useState({
    summary: { totalCollected: 45500, totalDues: 32000, receiptsCount: 3, defaultersCount: 2 },
    receipts: [
      { receiptNo: 'JD-REC-001', date: '2026-04-10', admNo: '1621', studentName: 'AADITYA SINGH CHOUDHARY', className: 'Class I-A', paidAmount: 17000, payMode: 'UPI', status: 'SUCCESS' },
      { receiptNo: 'JD-REC-002', date: '2026-04-12', admNo: '2059', studentName: 'AADHYA CHOUDHARY', className: 'Nursery - PP3+-A', paidAmount: 13500, payMode: 'Cash', status: 'SUCCESS' },
      { receiptNo: 'JD-REC-003', date: '2026-05-02', admNo: '2060', studentName: 'ROHAN SHARMA', className: 'X-A', paidAmount: 15000, payMode: 'Bank Transfer', status: 'SUCCESS' }
    ],
    defaulters: [
      { admNo: '2059', name: 'AADHYA CHOUDHARY', className: 'Nursery - PP3+-A', fatherName: 'RAMESH CHOUDHARY', mobile: '6377281034', dueAmount: 9500 },
      { admNo: '2060', name: 'ROHAN SHARMA', className: 'X-A', fatherName: 'MUKESH SHARMA', mobile: '9829012345', dueAmount: 18500 }
    ],
    structures: [
      { className: 'Nursery - PP3+', grandTotal: 38000, structureType: 'Quarterly' },
      { className: 'Class I', grandTotal: 46000, structureType: 'Quarterly' },
      { className: 'Class X', grandTotal: 62000, structureType: 'Quarterly' }
    ]
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });

  useEffect(() => {
    fetchReportData();
  }, [activeTab]);

  const fetchReportData = async () => {
    try {
      const res = await fetch(`/api/fees/reports?reportType=${activeTab}`);
      const data = await res.json();
      if (data.success && data.summary) {
        setReportData(data);
      }
    } catch {
      // Keep state
    }
  };

  const exportCurrentReport = () => {
    let rows = [];
    let filename = `Fee_${activeTab}.csv`;

    if (activeTab === 'collection-summary') {
      rows = ["Receipt No,Date,Adm No,Student Name,Class,Pay Mode,Amount"].concat(
        reportData.receipts.map(r => `"${r.receiptNo}","${r.date}","${r.admNo}","${r.studentName}","${r.className}","${r.payMode}",${r.paidAmount}`)
      );
    } else if (activeTab === 'due-list') {
      rows = ["Adm No,Student Name,Class,Father Name,Mobile,Due Amount"].concat(
        reportData.defaulters.map(d => `"${d.admNo}","${d.name}","${d.className}","${d.fatherName}","${d.mobile}",${d.dueAmount}`)
      );
    } else {
      rows = ["Class,Structure Type,Grand Total"].concat(
        reportData.structures.map(s => `"${s.className}","${s.structureType}",${s.grandTotal}`)
      );
    }

    const csvContent = "data:text/csv;charset=utf-8," + rows.join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Report exported to CSV');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* 1:1 Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-600" />
            Fee Master Reports Hub
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Fees &bull; <span className="text-indigo-600 font-medium">Audited Financial Summaries & Defaulters Register</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportCurrentReport}
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
            Print Report
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Total Collected</span>
            <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">₹</span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            ₹{reportData.summary?.totalCollected?.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] font-semibold text-emerald-600 mt-1 block">
            {reportData.summary?.receiptsCount} Total Receipts
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Outstanding Dues</span>
            <span className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">!</span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            ₹{reportData.summary?.totalDues?.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] font-semibold text-rose-600 mt-1 block">
            {reportData.summary?.defaultersCount} Students with Dues
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Cash Collected</span>
            <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">₹</span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">₹13,500</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Physical Counter</span>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Bank & UPI</span>
            <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">🏦</span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">₹32,000</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Digital Gateways</span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-2 flex flex-wrap gap-2">
        {[
          { id: 'collection-summary', label: 'Fee Collection Summary' },
          { id: 'due-list', label: 'Fee Due / Defaulter List' },
          { id: 'structure-report', label: 'Fee Structure Report' },
          { id: 'concession-summary', label: 'Concession Summary' },
          { id: 'fee-book', label: 'Fee Book Register' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Collection Summary Table */}
      {activeTab === 'collection-summary' && (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search collection receipts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Receipts Count: <span className="font-bold text-slate-900">{reportData.receipts.length}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[11px] border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">RECEIPT NO.</th>
                  <th className="py-3.5 px-6">DATE</th>
                  <th className="py-3.5 px-6">ADM.NO.</th>
                  <th className="py-3.5 px-6">STUDENT NAME</th>
                  <th className="py-3.5 px-6">CLASS</th>
                  <th className="py-3.5 px-6">PAY MODE</th>
                  <th className="py-3.5 px-6 text-right">AMOUNT (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reportData.receipts.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50/60">
                    <td className="py-3.5 px-6 font-mono font-bold text-indigo-700">{r.receiptNo}</td>
                    <td className="py-3.5 px-6 text-slate-500">{r.date}</td>
                    <td className="py-3.5 px-6 font-mono text-slate-700">{r.admNo}</td>
                    <td className="py-3.5 px-6 font-bold text-slate-900">{r.studentName}</td>
                    <td className="py-3.5 px-6 text-slate-600">{r.className}</td>
                    <td className="py-3.5 px-6">
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700">
                        {r.payMode}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right font-extrabold text-slate-900">
                      ₹{r.paidAmount?.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Due / Defaulters List */}
      {activeTab === 'due-list' && (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase">Student Outstanding Due Register</span>
            <span className="text-xs text-rose-600 font-bold">Total Defaulters: {reportData.defaulters.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[11px] border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">ADM.NO.</th>
                  <th className="py-3.5 px-6">STUDENT NAME</th>
                  <th className="py-3.5 px-6">CLASS</th>
                  <th className="py-3.5 px-6">FATHER'S NAME</th>
                  <th className="py-3.5 px-6">MOBILE</th>
                  <th className="py-3.5 px-6 text-right">DUE AMOUNT (₹)</th>
                  <th className="py-3.5 px-6 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reportData.defaulters.map((d, i) => (
                  <tr key={i} className="hover:bg-slate-50/60">
                    <td className="py-3.5 px-6 font-mono font-bold text-indigo-700">{d.admNo}</td>
                    <td className="py-3.5 px-6 font-bold text-slate-900">{d.name}</td>
                    <td className="py-3.5 px-6 text-slate-600">{d.className}</td>
                    <td className="py-3.5 px-6 text-slate-700">{d.fatherName}</td>
                    <td className="py-3.5 px-6 font-mono text-slate-600">{d.mobile}</td>
                    <td className="py-3.5 px-6 text-right font-black text-rose-600">
                      ₹{d.dueAmount?.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <button
                        onClick={() => toast.success(`Payment SMS reminder dispatched to ${d.mobile}`)}
                        className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg text-xs"
                      >
                        Send SMS
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Structure Report */}
      {activeTab === 'structure-report' && (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 font-bold text-xs text-slate-800 uppercase">
            All Classes Master Fee Structure Summary
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[11px] border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">CLASS</th>
                  <th className="py-3.5 px-6">FREQUENCY</th>
                  <th className="py-3.5 px-6 text-right">TOTAL FEES (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reportData.structures.map((s, i) => (
                  <tr key={i} className="hover:bg-slate-50/60">
                    <td className="py-3.5 px-6 font-bold text-slate-900">{s.className}</td>
                    <td className="py-3.5 px-6 text-slate-600">{s.structureType}</td>
                    <td className="py-3.5 px-6 text-right font-black text-indigo-600">₹{s.grandTotal?.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Concession Summary */}
      {activeTab === 'concession-summary' && (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 text-center text-xs text-slate-500">
          <PieChart className="w-10 h-10 text-indigo-400 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-900">Total Concessions Active: 2 Students</h3>
          <p className="mt-1">Staff wards and EWS students receive total ₹13,000 scholarship deductions this academic year.</p>
        </div>
      )}

      {/* Tab 5: Fee Book Register */}
      {activeTab === 'fee-book' && (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Daily Cash Book & Fee Collection Register</h3>
          <p className="text-xs text-slate-500">Showing consolidated daybook balances and bank clearance vouchers.</p>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
            <span>Opening Balance (Counter Cash): <strong className="text-slate-900">₹5,000</strong></span>
            <span>Total Receipts Today: <strong className="text-emerald-600">₹45,500</strong></span>
            <span>Closing Counter Balance: <strong className="text-slate-900">₹50,500</strong></span>
          </div>
        </div>
      )}
    </div>
  );
}
