import React, { useState } from 'react';
import {
  IdCard,
  Search,
  Home,
  Printer,
  FileDown,
  Filter,
  CheckCircle2,
  Calendar,
  Clock
} from 'lucide-react';

const INITIAL_GATE_PASS_REPORTS = [
  {
    id: '1',
    passNo: 'GP-2026-001',
    date: '2026-10-15',
    visitorName: 'Ramesh Choudhary',
    contactNo: '9829012345',
    timeInOut: '10:30 AM / 11:15 AM',
    studentName: 'AADITYA SINGH CHOUDHARY',
    className: 'Class I-A',
    relation: 'Father',
    reason: 'Family Emergency / Doctor Appointment',
    status: 'Approved'
  },
  {
    id: '2',
    passNo: 'GP-2026-002',
    date: '2026-10-14',
    visitorName: 'Mukesh Sharma',
    contactNo: '9414023456',
    timeInOut: '01:00 PM / 01:45 PM',
    studentName: 'ROHAN SHARMA',
    className: 'Class X-A',
    relation: 'Father',
    reason: 'Passport Document Verification Appointment',
    status: 'Approved'
  },
  {
    id: '3',
    passNo: 'GP-2026-003',
    date: '2026-10-11',
    visitorName: 'Sunil Joshi',
    contactNo: '9414022222',
    timeInOut: '11:15 AM / 12:00 PM',
    studentName: 'ANSHUMAN JOSHI',
    className: 'Class VI-A',
    relation: 'Father',
    reason: 'Inter-School Sports Competition Departure',
    status: 'Approved'
  }
];

export function GatePassReportPage({ onNavigate }) {
  const [data, setData] = useState(INITIAL_GATE_PASS_REPORTS);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = data.filter(d => {
    const matchesStatus = selectedStatus === 'All' || d.status === selectedStatus;
    const matchesSearch =
      d.visitorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.contactNo.includes(searchQuery) ||
      d.passNo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const exportCSV = () => {
    const headers = ['S.NO.', 'PASS NO.', 'DATE', 'VISITOR NAME', 'CONTACT NO.', 'TIME IN/OUT', 'STUDENT NAME', 'CLASS', 'RELATION', 'REASON', 'STATUS'];
    const rows = filteredData.map((d, i) => [
      i + 1,
      `"${d.passNo}"`,
      `"${d.date}"`,
      `"${d.visitorName}"`,
      `"${d.contactNo}"`,
      `"${d.timeInOut}"`,
      `"${d.studentName}"`,
      `"${d.className}"`,
      `"${d.relation}"`,
      `"${d.reason}"`,
      `"${d.status}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Student_Gate_Pass_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1:1 Secondary Top Header Toolbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20 print:hidden">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-bold text-slate-800 pr-3 border-r border-slate-300">
            Student Gate Pass Report
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
            <span className="text-slate-700 font-semibold">Gate Pass Report</span>
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
              <label className="block text-xs font-medium text-slate-600 mb-1">Pass Status</label>
              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="All">All Passes</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Search Visitor / Student</label>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Visitor Name, Student, Phone, Pass No..."
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
          <p className="text-xs text-slate-500">STUDENT GATE PASS AUDIT REPORT</p>
          <p className="text-xs text-slate-400">Generated on: {new Date().toLocaleString()}</p>
        </div>

        {/* Table 1:1 matching UAB columns */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 uppercase font-semibold">
                  <th className="py-3 px-4 w-12 text-center">S.NO.</th>
                  <th className="py-3 px-4">PASS NO.</th>
                  <th className="py-3 px-4">DATE</th>
                  <th className="py-3 px-4">VISITOR NAME</th>
                  <th className="py-3 px-4">CONTACT NO.</th>
                  <th className="py-3 px-4">TIME (IN/OUT)</th>
                  <th className="py-3 px-4">STUDENT NAME</th>
                  <th className="py-3 px-4">CLASS</th>
                  <th className="py-3 px-4">RELATION</th>
                  <th className="py-3 px-4">REASON</th>
                  <th className="py-3 px-4 text-center">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.map((d, index) => (
                  <tr key={d.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-center font-medium text-slate-500">{index + 1}</td>
                    <td className="py-3 px-4 font-mono font-bold text-blue-700">{d.passNo}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{d.date}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{d.visitorName}</td>
                    <td className="py-3 px-4 font-mono text-slate-700">{d.contactNo}</td>
                    <td className="py-3 px-4 font-mono text-slate-700 text-[11px]">{d.timeInOut}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{d.studentName}</td>
                    <td className="py-3 px-4 text-slate-600 font-medium">{d.className}</td>
                    <td className="py-3 px-4 text-slate-600">{d.relation}</td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate" title={d.reason}>{d.reason}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
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
