import React, { useState } from 'react';
import {
  CalendarDays,
  Search,
  Home,
  Printer,
  FileDown,
  Filter,
  Calendar,
  Sparkles
} from 'lucide-react';

const INITIAL_CALENDAR_REPORTS = [
  {
    id: '1',
    date: '18/10/2026',
    title: 'Inter-House Science Exhibition & Robo-Tech Expo',
    type: 'Planning',
    targetClass: 'Class VI - XII',
    section: 'All',
    description: 'Students will present STEM working models in the main auditorium. Chief Guest from MNIT Jaipur.',
    isHoliday: false
  },
  {
    id: '2',
    date: '31/10/2026 - 04/11/2026',
    title: 'Diwali & Govardhan Puja Holidays',
    type: 'Event',
    targetClass: 'All Classes',
    section: 'All',
    description: 'School campus will remain closed on account of Diwali festival. Holiday homework on app.',
    isHoliday: true
  },
  {
    id: '3',
    date: '14/11/2026',
    title: 'Children’s Day Carnival & Sports Gala',
    type: 'Planning',
    targetClass: 'Pre-Primary to Class XII',
    section: 'All',
    description: 'Food stalls, games, fancy dress competition and fun races organized by teaching staff.',
    isHoliday: false
  },
  {
    id: '4',
    date: '25/12/2026',
    title: 'Christmas Day Celebration & Winter Break Begins',
    type: 'Event',
    targetClass: 'All Classes',
    section: 'All',
    description: 'Special Christmas assembly followed by commencement of annual winter vacation.',
    isHoliday: true
  }
];

export function CalendarPlanningReportPage({ onNavigate }) {
  const [data, setData] = useState(INITIAL_CALENDAR_REPORTS);
  const [reportType, setReportType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = data.filter(d => {
    const matchesType =
      reportType === 'All' ||
      (reportType === 'Holiday' ? d.isHoliday : d.type === reportType);
    const matchesSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.targetClass.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const exportCSV = () => {
    const headers = ['S.NO.', 'DATE', 'TITLE', 'TYPE', 'TARGET CLASS', 'SECTION', 'DESCRIPTION', 'HOLIDAY'];
    const rows = filteredData.map((d, i) => [
      i + 1,
      `"${d.date}"`,
      `"${d.title}"`,
      `"${d.type}"`,
      `"${d.targetClass}"`,
      `"${d.section}"`,
      `"${d.description}"`,
      d.isHoliday ? 'YES' : 'NO'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Calendar_Planning_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1:1 Secondary Top Header Toolbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20 print:hidden">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-bold text-slate-800 pr-3 border-r border-slate-300">
            Calendar Planning Report
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
            <span className="text-slate-700 font-semibold">Calendar Planning Report</span>
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
              <label className="block text-xs font-medium text-slate-600 mb-1">Report Type</label>
              <select
                value={reportType}
                onChange={e => setReportType(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="All">All Entries</option>
                <option value="Planning">Academic & School Planning</option>
                <option value="Event">Events & Celebrations</option>
                <option value="Holiday">Holidays Only</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Search Calendar</label>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Title, Class, Description..."
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
          <p className="text-xs text-slate-500">ANNUAL ACADEMIC CALENDAR & ACTIVITY PLANNING REPORT</p>
          <p className="text-xs text-slate-400">Generated on: {new Date().toLocaleString()}</p>
        </div>

        {/* Table 1:1 matching UAB columns */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 uppercase font-semibold">
                  <th className="py-3 px-4 w-12 text-center">S.NO.</th>
                  <th className="py-3 px-4">DATE</th>
                  <th className="py-3 px-4">TITLE</th>
                  <th className="py-3 px-4">TYPE</th>
                  <th className="py-3 px-4">TARGET CLASS</th>
                  <th className="py-3 px-4">SECTION</th>
                  <th className="py-3 px-4">DESCRIPTION</th>
                  <th className="py-3 px-4 text-center">HOLIDAY</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.map((d, index) => (
                  <tr key={d.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-center font-medium text-slate-500">{index + 1}</td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-700 whitespace-nowrap">{d.date}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">{d.title}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        d.type === 'Event' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {d.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">{d.targetClass}</td>
                    <td className="py-3 px-4 text-slate-600">{d.section}</td>
                    <td className="py-3 px-4 text-slate-600 max-w-sm truncate" title={d.description}>{d.description}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                        d.isHoliday ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {d.isHoliday ? 'Holiday' : 'Regular'}
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
