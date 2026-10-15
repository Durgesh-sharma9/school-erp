import React, { useState } from 'react';
import {
  Briefcase,
  Search,
  Home,
  Printer,
  FileDown,
  Filter,
  Calendar,
  Building2
} from 'lucide-react';

const INITIAL_VISIT_REPORTS = [
  {
    id: '1',
    date: '12/10/2026 - 13/10/2026',
    employeeName: 'ABHILASHA BHATT',
    desig: 'Principal',
    schoolName: 'Delhi Public School, Jaipur',
    remark: 'CBSE Sahodaya School Complex Principals Conclave on NEP 2020 curriculum implementation.'
  },
  {
    id: '2',
    date: '08/10/2026',
    employeeName: 'PRITI VERMA',
    desig: 'Administrator',
    schoolName: 'St. Xavier’s Senior Secondary School, Jaipur',
    remark: 'Inter-school administrative summit regarding digital fee collection and biometric access standards.'
  },
  {
    id: '3',
    date: '25/09/2026',
    employeeName: 'MONIKA RANI VERMA',
    desig: 'Teacher',
    schoolName: 'Maharaja Sawai Man Singh Vidyalaya, Jaipur',
    remark: 'Regional English Language Teachers pedagogical workshop organized by CBSE Centre of Excellence.'
  }
];

export function StaffVisitReportPage({ onNavigate }) {
  const [data, setData] = useState(INITIAL_VISIT_REPORTS);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = data.filter(d =>
    d.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.remark.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportCSV = () => {
    const headers = ['S.NO.', 'DATE', 'EMPLOYEE NAME', 'DESIGNATION', 'SCHOOL NAME', 'REMARK'];
    const rows = filteredData.map((d, i) => [
      i + 1,
      `"${d.date}"`,
      `"${d.employeeName}"`,
      `"${d.desig}"`,
      `"${d.schoolName}"`,
      `"${d.remark}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Staff_Visit_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1:1 Secondary Top Header Toolbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20 print:hidden">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-bold text-slate-800 pr-3 border-r border-slate-300">
            Staff Visit Report
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
            <span className="text-slate-700 font-semibold">Staff Visit Report</span>
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
          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search Staff, School Name, Purpose of Visit..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Printable Header */}
        <div className="hidden print:block text-center border-b pb-4 mb-4">
          <h2 className="text-xl font-bold uppercase tracking-wider text-slate-900">J D International School</h2>
          <p className="text-xs text-slate-500">STAFF EXTERNAL VISIT & INTER-SCHOOL MEETING LOG</p>
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
                  <th className="py-3 px-4">EMPLOYEE NAME</th>
                  <th className="py-3 px-4">SCHOOL NAME</th>
                  <th className="py-3 px-4">REMARK</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.map((d, index) => (
                  <tr key={d.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-center font-medium text-slate-500">{index + 1}</td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-700 whitespace-nowrap">{d.date}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{d.employeeName}</div>
                      <div className="text-[11px] text-slate-400">{d.desig}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-blue-700">{d.schoolName}</td>
                    <td className="py-3 px-4 text-slate-600 max-w-lg">{d.remark}</td>
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
