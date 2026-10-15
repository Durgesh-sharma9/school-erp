import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Home,
  Printer,
  FileDown,
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

const INITIAL_ISSUES = [
  { id: '1', srNo: '1621', memberType: 'Student', memberName: 'AADITYA SINGH CHOUDHARY', className: 'Class I-A', bookNo: 'BK-1001', bookTitle: 'Mathematics Class X Exemplar', qty: 1, issueDate: '2026-10-01', returnDate: '2026-10-15', status: 'Overdue', contactNo: '8947919195' },
  { id: '2', srNo: '2059', memberType: 'Student', memberName: 'AADHYA CHOUDHARY', className: 'Nursery - PP3+-A', bookNo: 'BK-1003', bookTitle: 'Godaan (गोदान)', qty: 1, issueDate: '2026-10-08', returnDate: '2026-10-22', status: 'Issued', contactNo: '6377281034' },
  { id: '3', srNo: 'EMP-102', memberType: 'Staff', memberName: 'Sunita Kumari (Teacher)', className: 'Teaching Staff', bookNo: 'BK-1002', bookTitle: 'Concepts of Physics Part 1', qty: 1, issueDate: '2026-10-05', returnDate: '2026-10-25', status: 'Issued', contactNo: '9829014567' },
  { id: '4', srNo: '2060', memberType: 'Student', memberName: 'ROHAN SHARMA', className: 'Class X-A', bookNo: 'BK-1004', bookTitle: 'Wings of Fire', qty: 1, issueDate: '2026-09-20', returnDate: '2026-10-04', status: 'Overdue', contactNo: '9829012345' },
  { id: '5', srNo: '2061', memberType: 'Student', memberName: 'PRIYA MEENA', className: 'Class IX-A', bookNo: 'BK-1005', bookTitle: 'Python & AI for Secondary Students', qty: 1, issueDate: '2026-10-10', returnDate: '2026-10-24', status: 'Issued', contactNo: '9829011111' }
];

export function IssuedBooksReportPage({ onNavigate }) {
  const [issues, setIssues] = useState(INITIAL_ISSUES);
  const [searchQuery, setSearchQuery] = useState('');
  const [memberTypeFilter, setMemberTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetch('/api/library/issues')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.length) setIssues(data.data);
      })
      .catch(() => {});
  }, []);

  const filtered = issues.filter(i => {
    const matchesType = memberTypeFilter === 'All' || i.memberType === memberTypeFilter;
    const matchesStatus = statusFilter === 'All' || i.status === statusFilter;
    const matchesSearch =
      i.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.bookNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (i.srNo && i.srNo.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesStatus && matchesSearch;
  });

  const exportCSV = () => {
    const headers = ['S.NO.', 'MEMBER TYPE', 'SR/EMP NO', 'NAME', 'CLASS/DEPT', 'BOOK NO', 'BOOK TITLE', 'QTY', 'ISSUE DATE', 'DUE DATE', 'STATUS', 'CONTACT'];
    const rows = filtered.map((item, idx) => [
      idx + 1,
      `"${item.memberType}"`,
      `"${item.srNo}"`,
      `"${item.memberName}"`,
      `"${item.className}"`,
      `"${item.bookNo}"`,
      `"${item.bookTitle}"`,
      item.qty,
      `"${item.issueDate}"`,
      `"${item.returnDate}"`,
      `"${item.status}"`,
      `"${item.contactNo || ''}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Issued_Books_Report_${new Date().toISOString().slice(0, 10)}.csv`;
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
          <span className="text-indigo-600 text-sm font-semibold">Issued Books Report</span>
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

      {/* Main Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
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
              value={memberTypeFilter}
              onChange={(e) => setMemberTypeFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
            >
              <option value="All">All Members</option>
              <option value="Student">Students Only</option>
              <option value="Staff">Staff Only</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
            >
              <option value="All">All Status</option>
              <option value="Issued">Active (Issued)</option>
              <option value="Overdue">Overdue</option>
              <option value="Returned">Returned</option>
            </select>
          </div>

          <span className="text-xs text-slate-500">
            Showing {filtered.length} of {issues.length} Records
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3 text-center w-12">S.NO.</th>
                <th className="py-3 px-3">TYPE</th>
                <th className="py-3 px-3">SR / EMP NO</th>
                <th className="py-3 px-4">MEMBER NAME</th>
                <th className="py-3 px-3">CLASS / DEPT</th>
                <th className="py-3 px-3">BOOK NO</th>
                <th className="py-3 px-4">BOOK TITLE</th>
                <th className="py-3 px-3">ISSUE DATE</th>
                <th className="py-3 px-3">RETURN DATE</th>
                <th className="py-3 px-3 text-center">STATUS</th>
                <th className="py-3 px-3">CONTACT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 text-center font-medium text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700">
                        {item.memberType}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-medium text-slate-700">{item.srNo}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{item.memberName}</td>
                    <td className="py-3 px-3 text-slate-600">{item.className}</td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-600">{item.bookNo}</td>
                    <td className="py-3 px-4 font-medium text-slate-800">{item.bookTitle}</td>
                    <td className="py-3 px-3 text-slate-600">{item.issueDate}</td>
                    <td className="py-3 px-3">
                      <span className={item.status === 'Overdue' ? 'font-semibold text-rose-600' : 'text-slate-600'}>
                        {item.returnDate}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          item.status === 'Returned'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'Overdue'
                            ? 'bg-rose-100 text-rose-800 animate-pulse'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">{item.contactNo || 'N/A'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-slate-400">
                    No issued books records match your filters.
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
export default IssuedBooksReportPage;
