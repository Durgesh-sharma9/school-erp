import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Home,
  Printer,
  FileDown,
  Filter,
  CheckCircle2,
  Calendar,
  Clock
} from 'lucide-react';

const INITIAL_STAFF_GATE_PASS_REPORTS = [
  {
    id: '1',
    passNo: 'SGP-2026-001',
    date: '2026-10-15',
    employeeName: 'MONIKA RANI VERMA',
    staffCode: '201',
    desig: 'Teacher',
    dept: 'TEACHING',
    timeInOut: '12:30 PM / 08:00 AM',
    reason: 'Bank official work & personal appointment',
    remark: 'Sanctioned by Vice-Principal',
    status: 'Approved'
  },
  {
    id: '2',
    passNo: 'SGP-2026-002',
    date: '2026-10-14',
    employeeName: 'BHARAT JANGID',
    staffCode: '501',
    desig: 'Driver',
    dept: 'TRANSPORT',
    timeInOut: '11:00 AM / 06:30 AM',
    reason: 'Bus fuel filling and RTO certificate collection',
    remark: 'Transport Supervisor approved',
    status: 'Approved'
  },
  {
    id: '3',
    passNo: 'SGP-2026-003',
    date: '2026-10-09',
    employeeName: 'PRITI VERMA',
    staffCode: '102',
    desig: 'Administrator',
    dept: 'ADMINISTRATIVE & MANAGEMENT',
    timeInOut: '02:00 PM / 08:00 AM',
    reason: 'Education department document submission at Shiksha Sankul',
    remark: 'Principal sanctioned',
    status: 'Approved'
  }
];

export function StaffGatePassReportPage({ onNavigate }) {
  const [data, setData] = useState(INITIAL_STAFF_GATE_PASS_REPORTS);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = data.filter(d => {
    const matchesStatus = selectedStatus === 'All' || d.status === selectedStatus;
    const matchesSearch =
      d.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.staffCode.includes(searchQuery) ||
      d.desig.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.reason.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const exportCSV = () => {
    const headers = ['S.NO.', 'PASS NO.', 'DATE', 'EMPLOYEE NAME', 'CODE', 'DESIGNATION', 'DEPARTMENT', 'TIME IN/OUT', 'REASON', 'REMARK', 'STATUS'];
    const rows = filteredData.map((d, i) => [
      i + 1,
      `"${d.passNo}"`,
      `"${d.date}"`,
      `"${d.employeeName}"`,
      `"${d.staffCode}"`,
      `"${d.desig}"`,
      `"${d.dept}"`,
      `"${d.timeInOut}"`,
      `"${d.reason}"`,
      `"${d.remark}"`,
      `"${d.status}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Staff_Gate_Pass_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1:1 Secondary Top Header Toolbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20 print:hidden">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-bold text-slate-800 pr-3 border-r border-slate-300">
            Staff Gate Pass Report
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
            <span className="text-slate-700 font-semibold">Staff Gate Pass Report</span>
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
              <label className="block text-xs font-medium text-slate-600 mb-1">Search Staff / Reason</label>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Staff Name, Code, Reason, Dept..."
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
          <p className="text-xs text-slate-500">FACULTY & STAFF GATE PASS AUDIT REPORT</p>
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
                  <th className="py-3 px-4">EMPLOYEE NAME</th>
                  <th className="py-3 px-4">DESIGNATION</th>
                  <th className="py-3 px-4">DEPARTMENT</th>
                  <th className="py-3 px-4">TIME (OUT/IN)</th>
                  <th className="py-3 px-4">REASON FOR LEAVING</th>
                  <th className="py-3 px-4">REMARK</th>
                  <th className="py-3 px-4 text-center">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.map((d, index) => (
                  <tr key={d.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-center font-medium text-slate-500">{index + 1}</td>
                    <td className="py-3 px-4 font-mono font-bold text-blue-700">{d.passNo}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{d.date}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{d.employeeName}</div>
                      <div className="text-[11px] font-mono text-slate-400">Code: {d.staffCode}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">{d.desig}</td>
                    <td className="py-3 px-4 text-slate-600">{d.dept}</td>
                    <td className="py-3 px-4 font-mono text-slate-700 text-[11px]">{d.timeInOut}</td>
                    <td className="py-3 px-4 text-slate-700 max-w-xs truncate" title={d.reason}>{d.reason}</td>
                    <td className="py-3 px-4 text-slate-600 text-[11px]">{d.remark}</td>
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
