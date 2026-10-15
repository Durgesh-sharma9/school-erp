import React, { useState } from 'react';
import {
  Bell,
  Search,
  Home,
  Printer,
  FileDown,
  Filter,
  Smartphone,
  MessageSquare,
  CheckCircle2,
  Calendar
} from 'lucide-react';

const INITIAL_NOTIFICATION_STATS = [
  { id: '1', className: 'Nursery', section: 'PP3+-A', totalSent: 142, appPush: 138, sms: 4, category: 'Homework & Activities', lastDate: '2026-10-15' },
  { id: '2', className: 'Class I', section: 'A', totalSent: 186, appPush: 180, sms: 6, category: 'Fee & Circulars', lastDate: '2026-10-15' },
  { id: '3', className: 'Class II', section: 'A', totalSent: 165, appPush: 162, sms: 3, category: 'Daily Attendance Alert', lastDate: '2026-10-15' },
  { id: '4', className: 'Class VI', section: 'A', totalSent: 210, appPush: 204, sms: 6, category: 'Homework & Assignment', lastDate: '2026-10-14' },
  { id: '5', className: 'Class IX', section: 'A', totalSent: 245, appPush: 238, sms: 7, category: 'Exam Schedule & Marks', lastDate: '2026-10-14' },
  { id: '6', className: 'Class X', section: 'A', totalSent: 310, appPush: 298, sms: 12, category: 'Pre-Board Circulars', lastDate: '2026-10-15' }
];

export function NotificationCountReportPage({ onNavigate }) {
  const [data, setData] = useState(INITIAL_NOTIFICATION_STATS);
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = data.filter(d => {
    const matchesType = selectedType === 'All' || d.category.toLowerCase().includes(selectedType.toLowerCase());
    const matchesSearch =
      d.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.section.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const totalSentSum = filteredData.reduce((sum, d) => sum + d.totalSent, 0);
  const totalPushSum = filteredData.reduce((sum, d) => sum + d.appPush, 0);
  const totalSmsSum = filteredData.reduce((sum, d) => sum + d.sms, 0);

  const exportCSV = () => {
    const headers = ['S.NO.', 'CLASS', 'SECTION', 'CATEGORY', 'TOTAL NOTIFICATIONS', 'PUSH APP ALERTS', 'SMS DISPATCHED', 'LAST SENT DATE'];
    const rows = filteredData.map((d, i) => [
      i + 1,
      `"${d.className}"`,
      `"${d.section}"`,
      `"${d.category}"`,
      d.totalSent,
      d.appPush,
      d.sms,
      `"${d.lastDate}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Notification_Count_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1:1 Secondary Top Header Toolbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20 print:hidden">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-bold text-slate-800 pr-3 border-r border-slate-300">
            Notification Count Report
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
            <span className="text-slate-700 font-semibold">Notification Reports</span>
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
              <Bell size={20} />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">Total Notifications Sent</div>
              <div className="text-lg font-bold text-slate-800">{totalSentSum}</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Smartphone size={20} />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">Delivered via Student App</div>
              <div className="text-lg font-bold text-emerald-600">{totalPushSum}</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <MessageSquare size={20} />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">SMS / WhatsApp Gateway</div>
              <div className="text-lg font-bold text-purple-600">{totalSmsSum}</div>
            </div>
          </div>
        </div>

        {/* Filters Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm print:hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Notification Category</label>
              <select
                value={selectedType}
                onChange={e => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="All">All Categories</option>
                <option value="Homework">Homework & Assignment</option>
                <option value="Fee">Fee & Circulars</option>
                <option value="Attendance">Attendance Alerts</option>
                <option value="Exam">Exam Schedule & Marks</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Search Class / Category</label>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Class, Category, Section..."
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
          <p className="text-xs text-slate-500">CLASS-WISE NOTIFICATION DELIVERY COUNT REPORT</p>
          <p className="text-xs text-slate-400">Category: {selectedType} | Generated: {new Date().toLocaleString()}</p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 uppercase font-semibold">
                  <th className="py-3 px-4 w-12 text-center">S.NO.</th>
                  <th className="py-3 px-4">CLASS</th>
                  <th className="py-3 px-4">SECTION</th>
                  <th className="py-3 px-4">NOTIFICATION CATEGORY</th>
                  <th className="py-3 px-4 text-center">TOTAL SENT</th>
                  <th className="py-3 px-4 text-center">APP PUSH</th>
                  <th className="py-3 px-4 text-center">SMS GATEWAY</th>
                  <th className="py-3 px-4 text-right">LAST SENT DATE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.map((d, index) => (
                  <tr key={d.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-center font-medium text-slate-500">{index + 1}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">{d.className}</td>
                    <td className="py-3 px-4 text-slate-600">{d.section}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        {d.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-800">{d.totalSent}</td>
                    <td className="py-3 px-4 text-center font-semibold text-emerald-600">{d.appPush}</td>
                    <td className="py-3 px-4 text-center font-semibold text-purple-600">{d.sms}</td>
                    <td className="py-3 px-4 text-right font-mono text-slate-600">{d.lastDate}</td>
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
