import React, { useState } from 'react';
import {
  Bell,
  Search,
  Home,
  Printer,
  FileDown,
  Filter,
  CheckCircle2,
  Clock,
  Calendar
} from 'lucide-react';

const INITIAL_REMINDER_REPORTS = [
  {
    id: '1',
    fromDate: '15/10/2026',
    toDate: '20/10/2026',
    description: 'Quarterly Parent-Teacher Meeting announcement and report card review',
    status: 'Active'
  },
  {
    id: '2',
    fromDate: '22/10/2026',
    toDate: '25/10/2026',
    description: 'Diwali break holiday homework dispatch and online portal updates',
    status: 'Upcoming'
  },
  {
    id: '3',
    fromDate: '01/09/2026',
    toDate: '05/09/2026',
    description: 'Teachers Day felicitation and award preparation meeting',
    status: 'Expired'
  },
  {
    id: '4',
    fromDate: '15/08/2026',
    toDate: '15/08/2026',
    description: 'Independence Day flag hoisting dress code circular',
    status: 'Expired'
  }
];

export function ReminderReportPage({ onNavigate }) {
  const [data, setData] = useState(INITIAL_REMINDER_REPORTS);
  const [reportType, setReportType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = data.filter(d => {
    const matchesType = reportType === 'All' || d.status.toLowerCase() === reportType.toLowerCase();
    const matchesSearch = d.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const exportCSV = () => {
    const headers = ['S.NO.', 'FROM DATE', 'TO DATE', 'DESCRIPTION', 'STATUS'];
    const rows = filteredData.map((d, i) => [
      i + 1,
      `"${d.fromDate}"`,
      `"${d.toDate}"`,
      `"${d.description}"`,
      `"${d.status}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Reminders_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1:1 Secondary Top Header Toolbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20 print:hidden">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-bold text-slate-800 pr-3 border-r border-slate-300">
            Reminders Report
          </h1>
          <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
            <button onClick={() => onNavigate && onNavigate('dashboard')} className="hover:text-blue-600 flex items-center gap-1 transition-colors">
              <Home size={13} />
              <span>Home</span>
            </button>
            <span>/</span>
            <button onClick={() => onNavigate && onNavigate('front-office-reports')} className="hover:text-blue-600 transition-colors">
              Front Office Reports
            </button>
            <span>/</span>
            <span className="text-slate-700 font-semibold">Reminders Report</span>
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
        {/* Filters Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm print:hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Reminder Status</label>
              <select
                value={reportType}
                onChange={e => setReportType(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="All">All Reminders</option>
                <option value="Active">Active</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Expired">Expired</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Search Description</label>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Keywords in reminder..."
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
          <p className="text-xs text-slate-500">ADMINISTRATIVE REMINDER SCHEDULE LOG</p>
          <p className="text-xs text-slate-400">Status: {reportType} | Generated: {new Date().toLocaleString()}</p>
        </div>

        {/* Table 1:1 matching UAB columns */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 uppercase font-semibold">
                  <th className="py-3 px-4 w-12 text-center">S.NO.</th>
                  <th className="py-3 px-4">FROM DATE</th>
                  <th className="py-3 px-4">TO DATE</th>
                  <th className="py-3 px-4">DESCRIPTION</th>
                  <th className="py-3 px-4 text-center">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.map((d, index) => (
                  <tr key={d.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-center font-medium text-slate-500">{index + 1}</td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-700">{d.fromDate}</td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-700">{d.toDate}</td>
                    <td className="py-3 px-4 text-slate-800 font-medium max-w-lg">{d.description}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        d.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                        d.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
