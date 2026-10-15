import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Home,
  Printer,
  FileDown,
  AlertTriangle,
  DollarSign,
  Calendar
} from 'lucide-react';

const INITIAL_DAMAGED = [
  { id: '1', bookNo: 'BK-1001', bookTitle: 'Mathematics Class X Exemplar', author: 'R.D. Sharma', publication: 'Dhanpat Rai Publications', damagedQty: 1, rate: 450, damageDate: '2026-09-28', reason: 'Water spill during monsoon library leakage', remark: 'Sent for binding restoration or scrap' },
  { id: '2', bookNo: 'BK-1002', bookTitle: 'Concepts of Physics Part 1', author: 'H.C. Verma', publication: 'Bharati Bhawan', damagedQty: 1, rate: 520, damageDate: '2026-10-02', reason: 'Pages 120-145 torn and spine detached', remark: 'Replaced with reserve stock' },
  { id: '3', bookNo: 'BK-1003', bookTitle: 'Godaan (गोदान)', author: 'Munshi Premchand', publication: 'NCERT New Delhi', damagedQty: 1, rate: 180, damageDate: '2026-10-06', reason: 'Cover page missing & ink stains', remark: 'Logged in damaged register' }
];

export function DamagedBooksReportPage({ onNavigate }) {
  const [damagedBooks, setDamagedBooks] = useState(INITIAL_DAMAGED);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/library/damaged-books')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.length) {
          const mapped = data.data.map(d => ({
            ...d,
            rate: d.rate || 350
          }));
          setDamagedBooks(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const filtered = damagedBooks.filter(d =>
    d.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.bookNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalDamagedCount = filtered.reduce((s, d) => s + (Number(d.damagedQty) || 0), 0);
  const totalLoss = filtered.reduce((s, d) => s + ((Number(d.damagedQty) || 0) * (Number(d.rate) || 350)), 0);

  const exportCSV = () => {
    const headers = ['S.NO.', 'BOOK NO', 'BOOK TITLE', 'AUTHOR', 'PUBLICATION', 'DAMAGE DATE', 'DAMAGED QTY', 'RATE (₹)', 'LOSS (₹)', 'REASON', 'REMARK'];
    const rows = filtered.map((d, idx) => [
      idx + 1,
      `"${d.bookNo}"`,
      `"${d.bookTitle}"`,
      `"${d.author}"`,
      `"${d.publication}"`,
      `"${d.damageDate}"`,
      d.damagedQty,
      d.rate || 350,
      ((Number(d.damagedQty) || 0) * (Number(d.rate) || 350)),
      `"${d.reason}"`,
      `"${d.remark || ''}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Damaged_Books_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 text-slate-800">
      {/* Breadcrumb & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate?.('/dashboard')}
            className="text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1 text-sm font-medium"
          >
            <Home className="w-4 h-4" />
            Home
          </button>
          <span className="text-slate-400">/</span>
          <button
            onClick={() => onNavigate?.('/library-reports')}
            className="text-slate-500 hover:text-indigo-600 transition-colors text-sm font-medium"
          >
            Library Reports
          </button>
          <span className="text-slate-400">/</span>
          <span className="text-indigo-600 text-sm font-semibold">Damaged Books Report</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-sm transition-all"
          >
            <FileDown className="w-3.5 h-3.5 text-emerald-600" />
            CSV Export
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-sm transition-all"
          >
            <Printer className="w-3.5 h-3.5 text-blue-600" />
            Print Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Total Damaged Copies</p>
            <h4 className="text-xl font-bold text-rose-600 mt-1">{totalDamagedCount} Copies</h4>
            <span className="text-[11px] text-slate-400">Written-off / decommissioned</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Estimated Book Loss Value</p>
            <h4 className="text-xl font-bold text-slate-800 mt-1">₹{totalLoss.toLocaleString('en-IN')}</h4>
            <span className="text-[11px] text-slate-400">Inventory depreciation</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Search */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search title, book no, reason..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
          <span className="text-xs text-slate-500">
            Showing {filtered.length} of {damagedBooks.length} Damaged Entries
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3 text-center w-12">S.NO.</th>
                <th className="py-3 px-3">BOOK NO</th>
                <th className="py-3 px-4">BOOK TITLE</th>
                <th className="py-3 px-3">AUTHOR</th>
                <th className="py-3 px-3">PUBLICATION</th>
                <th className="py-3 px-3">DAMAGE DATE</th>
                <th className="py-3 px-3 text-center">DAMAGED QTY</th>
                <th className="py-3 px-3 text-right">RATE (₹)</th>
                <th className="py-3 px-3 text-right">LOSS VALUE (₹)</th>
                <th className="py-3 px-4">REASON & REMARK</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map((d, idx) => (
                  <tr key={d.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 text-center font-medium text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <span className="font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-semibold text-[11px]">
                        {d.bookNo}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{d.bookTitle}</td>
                    <td className="py-3 px-3 text-slate-600">{d.author}</td>
                    <td className="py-3 px-3 text-slate-500">{d.publication}</td>
                    <td className="py-3 px-3 text-slate-600">{d.damageDate}</td>
                    <td className="py-3 px-3 text-center font-bold text-rose-600">{d.damagedQty}</td>
                    <td className="py-3 px-3 text-right text-slate-600">₹{d.rate || 350}</td>
                    <td className="py-3 px-3 text-right font-bold text-rose-700">
                      ₹{((Number(d.damagedQty) || 0) * (Number(d.rate) || 350)).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-medium">{d.reason}</div>
                      {d.remark && <div className="text-[11px] text-slate-400">{d.remark}</div>}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    No damaged book logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default DamagedBooksReportPage;
