import React, { useState } from 'react';
import {
  FileWarning,
  Search,
  Home,
  Printer,
  FileDown,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';

const INITIAL_REPORT_DATA = [
  {
    id: '1',
    date: '2026-10-10',
    againstStaff: 'HANSRAJ JAT',
    dept: 'TRANSPORT',
    complaintType: 'Punctuality',
    reason: 'Bus Route No. 3 arrived 25 minutes late at Mansarovar stop without prior notification to parents.',
    status: 'Investigated & Resolved',
    actionTaken: 'Warning letter issued to driver; vehicle GPS recalibrated.'
  },
  {
    id: '2',
    date: '2026-10-11',
    againstStaff: 'RAJENDRA SINGH',
    dept: 'SECURITY & MAINTENANCE',
    complaintType: 'Misbehavior',
    reason: 'Rude behavior with visitor during gate entry verification.',
    status: 'Under Review',
    actionTaken: 'Explained protocol to security team; customer-service refresher conducted.'
  },
  {
    id: '3',
    date: '2026-09-28',
    againstStaff: 'SUNITA KUMARI',
    dept: 'TEACHING',
    complaintType: 'Communication',
    reason: 'Parent reported delay in returning corrected homework notebooks.',
    status: 'Investigated & Resolved',
    actionTaken: 'Notebooks checked and returned; schedule streamlined with academic coordinator.'
  }
];

export function ManualComplaintReportPage({ onNavigate }) {
  const [data, setData] = useState(INITIAL_REPORT_DATA);
  const [reportType, setReportType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = data.filter(d => {
    const matchesType = reportType === 'All' || d.status.toLowerCase().includes(reportType.toLowerCase());
    const matchesSearch =
      d.againstStaff.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.complaintType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.reason.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const exportCSV = () => {
    const headers = ['S.NO.', 'DATE', 'STAFF NAME', 'DEPARTMENT', 'TYPE', 'REASON', 'STATUS', 'ACTION TAKEN'];
    const rows = filteredData.map((d, i) => [
      i + 1,
      `"${d.date}"`,
      `"${d.againstStaff}"`,
      `"${d.dept}"`,
      `"${d.complaintType}"`,
      `"${d.reason}"`,
      `"${d.status}"`,
      `"${d.actionTaken}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Staff_Complaint_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1:1 Secondary Top Header Toolbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20 print:hidden">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-bold text-slate-800 pr-3 border-r border-slate-300">
            Staff Complaint Report
          </h1>
          <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
            <button onClick={() => onNavigate && onNavigate('/')} className="hover:text-blue-600 flex items-center gap-1 transition-colors">
              <Home size={13} />
              <span>Home</span>
            </button>
            <span>/</span>
            <button onClick={() => onNavigate && onNavigate('/front-office-reports')} className="hover:text-blue-600 transition-colors">
              Front Office Reports
            </button>
            <span>/</span>
            <span className="text-slate-700 font-semibold">Staff Complaint Report</span>
          </nav>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={exportCSV}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold shadow-sm transition-all"
          >
            <FileDown size={14} />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-semibold shadow-sm transition-all"
          >
            <Printer size={14} />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:hidden">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <FileWarning size={20} />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">Total Complaints Logged</div>
              <div className="text-lg font-bold text-slate-800">{data.length}</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">Resolved Complaints</div>
              <div className="text-lg font-bold text-emerald-600">
                {data.filter(d => d.status.includes('Resolved')).length}
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Clock size={20} />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">Pending Review</div>
              <div className="text-lg font-bold text-amber-600">
                {data.filter(d => d.status.includes('Review')).length}
              </div>
            </div>
          </div>
        </div>

        {/* Filters Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm print:hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Report Type</label>
              <select
                value={reportType}
                onChange={e => setReportType(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="All">All Statuses</option>
                <option value="Resolved">Resolved</option>
                <option value="Review">Under Review</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Search Staff / Reason</label>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Staff Name, Complaint Type, Details..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Printable Header */}
        <div className="hidden print:block text-center border-b pb-4 mb-4">
          <h2 className="text-xl font-bold uppercase tracking-wider text-slate-900">J D International School</h2>
          <p className="text-xs text-slate-500">STAFF COMPLAINT & GRIEVANCE REPORT</p>
          <p className="text-xs text-slate-400">Generated on: {new Date().toLocaleString()}</p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 uppercase font-semibold">
                  <th className="py-3 px-4 w-12 text-center">S.NO.</th>
                  <th className="py-3 px-4">DATE</th>
                  <th className="py-3 px-4">COMPLAINT AGAINST</th>
                  <th className="py-3 px-4">DEPARTMENT</th>
                  <th className="py-3 px-4">COMPLAINT TYPE</th>
                  <th className="py-3 px-4">REASON / DETAILS</th>
                  <th className="py-3 px-4 text-center">STATUS</th>
                  <th className="py-3 px-4">ACTION TAKEN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-8 text-center text-slate-400">
                      No complaint records match the selected filter.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((d, index) => (
                    <tr key={d.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 text-center font-medium text-slate-500">{index + 1}</td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-700">{d.date}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{d.againstStaff}</td>
                      <td className="py-3 px-4 text-slate-600">{d.dept}</td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          {d.complaintType}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 max-w-sm">{d.reason}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          d.status.includes('Resolved') ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {d.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 italic text-[11px] max-w-xs">{d.actionTaken}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
