import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Home,
  Printer,
  FileDown,
  Clock,
  AlertTriangle,
  MessageSquare,
  DollarSign
} from 'lucide-react';
import toast from 'react-hot-toast';

const INITIAL_PENDING = [
  { id: '1', srNo: '1621', memberType: 'Student', memberName: 'AADITYA SINGH CHOUDHARY', className: 'Class I-A', bookNo: 'BK-1001', bookTitle: 'Mathematics Class X Exemplar', issueDate: '2026-09-25', returnDate: '2026-10-09', daysOverdue: 6, fineAccrued: 30, contactNo: '8947919195' },
  { id: '2', srNo: '2060', memberType: 'Student', memberName: 'ROHAN SHARMA', className: 'Class X-A', bookNo: 'BK-1004', bookTitle: 'Wings of Fire', issueDate: '2026-09-20', returnDate: '2026-10-04', daysOverdue: 11, fineAccrued: 55, contactNo: '9829012345' },
  { id: '3', srNo: '2063', memberType: 'Student', memberName: 'KAVITA MEENA', className: 'Class IX-B', bookNo: 'BK-1002', bookTitle: 'Concepts of Physics Part 1', issueDate: '2026-09-15', returnDate: '2026-09-29', daysOverdue: 16, fineAccrued: 80, contactNo: '9414077889' }
];

export function PendingBooksReportPage({ onNavigate }) {
  const [pendingBooks, setPendingBooks] = useState(INITIAL_PENDING);
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('All');

  const classes = ['All', ...new Set(pendingBooks.map(p => p.className))];

  const filtered = pendingBooks.filter(p => {
    const matchesClass = classFilter === 'All' || p.className === classFilter;
    const matchesSearch =
      p.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.bookNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.srNo && p.srNo.includes(searchQuery));
    return matchesClass && matchesSearch;
  });

  const totalOverdueCount = filtered.length;
  const totalFineAccrued = filtered.reduce((s, p) => s + p.fineAccrued, 0);
  const highOverdueCount = filtered.filter(p => p.daysOverdue >= 10).length;

  const handleSendReminderSMS = (item) => {
    toast.success(`Reminder SMS queued for ${item.memberName} (${item.contactNo})`);
  };

  const exportCSV = () => {
    const headers = ['S.NO.', 'SR/ID', 'MEMBER NAME', 'CLASS/DEPT', 'BOOK NO', 'BOOK TITLE', 'ISSUE DATE', 'DUE DATE', 'DAYS OVERDUE', 'FINE ACCRUED (₹)', 'CONTACT NO'];
    const rows = filtered.map((p, idx) => [
      idx + 1,
      `"${p.srNo}"`,
      `"${p.memberName}"`,
      `"${p.className}"`,
      `"${p.bookNo}"`,
      `"${p.bookTitle}"`,
      `"${p.issueDate}"`,
      `"${p.returnDate}"`,
      p.daysOverdue,
      p.fineAccrued,
      `"${p.contactNo}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Pending_Overdue_Books_Report_${new Date().toISOString().slice(0, 10)}.csv`;
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
          <span className="text-indigo-600 text-sm font-semibold">Pending Books Report</span>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Overdue Books</p>
            <h4 className="text-xl font-bold text-rose-600 mt-1">{totalOverdueCount} Copies</h4>
            <span className="text-[11px] text-slate-400">Pending return</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Total Accrued Fine</p>
            <h4 className="text-xl font-bold text-slate-800 mt-1">₹{totalFineAccrued}</h4>
            <span className="text-[11px] text-slate-400">Calculated @ ₹5/day</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Critical Overdue (&gt;10 Days)</p>
            <h4 className="text-xl font-bold text-indigo-600 mt-1">{highOverdueCount} Cases</h4>
            <span className="text-[11px] text-indigo-500">Require immediate reminder</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search member, book title, SR..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
            >
              {classes.map((cls, i) => (
                <option key={i} value={cls}>Class: {cls}</option>
              ))}
            </select>
          </div>

          <span className="text-xs text-slate-500">
            Showing {filtered.length} of {pendingBooks.length} Overdue Records
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3 text-center w-12">S.NO.</th>
                <th className="py-3 px-3">SR / EMP NO</th>
                <th className="py-3 px-4">STUDENT / STAFF</th>
                <th className="py-3 px-3">CLASS</th>
                <th className="py-3 px-4">BOOK TITLE (NO)</th>
                <th className="py-3 px-3">ISSUE DATE</th>
                <th className="py-3 px-3">DUE DATE</th>
                <th className="py-3 px-3 text-center">DAYS OVERDUE</th>
                <th className="py-3 px-3 text-right">ACCRUED FINE (₹)</th>
                <th className="py-3 px-3">CONTACT NO</th>
                <th className="py-3 px-3 text-center w-28">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map((p, idx) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 text-center font-medium text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-3 font-mono font-medium text-slate-700">{p.srNo}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{p.memberName}</td>
                    <td className="py-3 px-3 text-slate-600">{p.className}</td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{p.bookTitle}</div>
                      <span className="font-mono text-[11px] text-slate-400">{p.bookNo}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{p.issueDate}</td>
                    <td className="py-3 px-3 font-semibold text-rose-600">{p.returnDate}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">
                        {p.daysOverdue} Days
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-800">₹{p.fineAccrued}</td>
                    <td className="py-3 px-3 font-mono text-slate-600">{p.contactNo}</td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => handleSendReminderSMS(p)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded border border-indigo-200 transition-colors"
                      >
                        <MessageSquare className="w-3 h-3" />
                        Remind
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-slate-400">
                    No overdue books currently pending.
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
export default PendingBooksReportPage;
