import React, { useState } from 'react';
import {
  AlertCircle,
  Search,
  Home,
  Printer,
  FileDown,
  Filter,
  CheckCircle2,
  Clock
} from 'lucide-react';

const INITIAL_STUDENT_COMPLAINT_REPORTS = [
  {
    id: '1',
    date: '14/10/2026',
    studentName: 'ROHAN SHARMA',
    admNo: '2060',
    className: 'Class X-A',
    category: 'Against Student',
    complaintType: 'Discipline',
    complaintText: 'Continuous disturbance during Physics laboratory class and refusal to follow safety rules.',
    actionTaken: 'Parent notified via phone. Scheduled counselling session.',
    status: 'Pending Review'
  },
  {
    id: '2',
    date: '12/10/2026',
    studentName: 'AADITYA SINGH CHOUDHARY',
    admNo: '1621',
    className: 'Class I-A',
    category: 'By Student',
    complaintType: 'Bullying / Conflict',
    complaintText: 'Complained that another student snatched notebook during lunch break.',
    actionTaken: 'Class teacher investigated and amicably resolved the matter. Notebook returned.',
    status: 'Resolved'
  },
  {
    id: '3',
    date: '05/10/2026',
    studentName: 'PRIYA MEENA',
    admNo: '2061',
    className: 'Class IX-A',
    category: 'Against Student',
    complaintType: 'Uniform / Grooming',
    complaintText: 'Repeatedly attending assembly in improper sports shoes on non-sports days.',
    actionTaken: 'First warning noted in diary; advised to follow school dress code.',
    status: 'Resolved'
  }
];

export function StudentComplaintReportPage({ onNavigate }) {
  const [data, setData] = useState(INITIAL_STUDENT_COMPLAINT_REPORTS);
  const [reportType, setReportType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = data.filter(d => {
    const matchesType = reportType === 'All' || d.status.toLowerCase().includes(reportType.toLowerCase());
    const matchesSearch =
      d.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.complaintType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.complaintText.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const exportCSV = () => {
    const headers = ['S.NO.', 'DATE', 'STUDENT NAME', 'ADM NO', 'CLASS', 'CATEGORY', 'COMPLAINT TYPE', 'COMPLAINT TEXT', 'ACTION TAKEN', 'STATUS'];
    const rows = filteredData.map((d, i) => [
      i + 1,
      `"${d.date}"`,
      `"${d.studentName}"`,
      `"${d.admNo}"`,
      `"${d.className}"`,
      `"${d.category}"`,
      `"${d.complaintType}"`,
      `"${d.complaintText}"`,
      `"${d.actionTaken}"`,
      `"${d.status}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Student_Complaint_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1:1 Secondary Top Header Toolbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20 print:hidden">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-bold text-slate-800 pr-3 border-r border-slate-300">
            Student Complaint Report
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
            <span className="text-slate-700 font-semibold">Complaint Report</span>
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
              <label className="block text-xs font-medium text-slate-600 mb-1">Complaint Status</label>
              <select
                value={reportType}
                onChange={e => setReportType(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="All">All Complaints</option>
                <option value="Resolved">Resolved</option>
                <option value="Review">Pending Review</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Search Student / Details</label>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Student Name, Class, Type, Specifics..."
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
          <p className="text-xs text-slate-500">STUDENT DISCIPLINE & GRIEVANCE REPORT</p>
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
                  <th className="py-3 px-4">STUDENT NAME</th>
                  <th className="py-3 px-4">CLASS</th>
                  <th className="py-3 px-4">CATEGORY</th>
                  <th className="py-3 px-4">COMPLAINT TYPE</th>
                  <th className="py-3 px-4">COMPLAINT TEXT</th>
                  <th className="py-3 px-4">ACTION TAKEN</th>
                  <th className="py-3 px-4 text-center">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.map((d, index) => (
                  <tr key={d.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-center font-medium text-slate-500">{index + 1}</td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-700 whitespace-nowrap">{d.date}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{d.studentName}</td>
                    <td className="py-3 px-4 text-slate-600 font-medium">{d.className}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                        d.category === 'By Student' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {d.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        {d.complaintType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 max-w-xs">{d.complaintText}</td>
                    <td className="py-3 px-4 text-slate-500 italic max-w-xs">{d.actionTaken}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        d.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
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
