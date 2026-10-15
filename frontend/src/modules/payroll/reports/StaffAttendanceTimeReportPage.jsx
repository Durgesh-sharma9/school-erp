import React, { useState } from 'react';
import {
  Users,
  Search,
  Home,
  Printer,
  FileDown,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Timer,
  Filter
} from 'lucide-react';

const INITIAL_TIME_ATTENDANCE = [
  {
    id: '1',
    code: '101',
    name: 'ABHILASHA BHATT',
    desig: 'Principal',
    dept: 'ADMINISTRATIVE & MANAGEMENT',
    shift: 'General (08:00 AM - 03:00 PM)',
    status: 'Present',
    inTime: '07:52 AM',
    outTime: '03:15 PM',
    totalHours: '7h 23m',
    lateBy: '0m',
    earlyLeaving: '0m',
    overtime: '23m'
  },
  {
    id: '2',
    code: '102',
    name: 'PRITI VERMA',
    desig: 'Administrator',
    dept: 'ADMINISTRATIVE & MANAGEMENT',
    shift: 'General (08:00 AM - 03:00 PM)',
    status: 'Present',
    inTime: '07:58 AM',
    outTime: '03:02 PM',
    totalHours: '7h 04m',
    lateBy: '0m',
    earlyLeaving: '0m',
    overtime: '4m'
  },
  {
    id: '3',
    code: '201',
    name: 'MONIKA RANI VERMA',
    desig: 'Teacher',
    dept: 'TEACHING',
    shift: 'Morning (08:00 AM - 02:00 PM)',
    status: 'Late',
    inTime: '08:18 AM',
    outTime: '02:05 PM',
    totalHours: '5h 47m',
    lateBy: '18m',
    earlyLeaving: '0m',
    overtime: '5m'
  },
  {
    id: '4',
    code: '202',
    name: 'SUNITA KUMARI',
    desig: 'Teacher',
    dept: 'TEACHING',
    shift: 'Morning (08:00 AM - 02:00 PM)',
    status: 'Present',
    inTime: '07:55 AM',
    outTime: '02:00 PM',
    totalHours: '6h 05m',
    lateBy: '0m',
    earlyLeaving: '0m',
    overtime: '0m'
  },
  {
    id: '5',
    code: '501',
    name: 'BHARAT JANGID',
    desig: 'Driver',
    dept: 'TRANSPORT',
    shift: 'Transport Split (06:30 AM - 04:30 PM)',
    status: 'Present',
    inTime: '06:22 AM',
    outTime: '04:45 PM',
    totalHours: '10h 23m',
    lateBy: '0m',
    earlyLeaving: '0m',
    overtime: '15m'
  },
  {
    id: '6',
    code: '502',
    name: 'HANSRAJ JAT',
    desig: 'Driver',
    dept: 'TRANSPORT',
    shift: 'Transport Split (06:30 AM - 04:30 PM)',
    status: 'Late',
    inTime: '06:42 AM',
    outTime: '04:30 PM',
    totalHours: '9h 48m',
    lateBy: '12m',
    earlyLeaving: '0m',
    overtime: '0m'
  },
  {
    id: '7',
    code: '301',
    name: 'RAJENDRA SINGH',
    desig: 'Security Supervisor',
    dept: 'SECURITY & MAINTENANCE',
    shift: 'Night Guard (08:00 PM - 08:00 AM)',
    status: 'Absent',
    inTime: '--:--',
    outTime: '--:--',
    totalHours: '0h 00m',
    lateBy: '--',
    earlyLeaving: '--',
    overtime: '0m'
  }
];

export function StaffAttendanceTimeReportPage({ onNavigate }) {
  const [data, setData] = useState(INITIAL_TIME_ATTENDANCE);
  const [attendanceDate, setAttendanceDate] = useState('2026-10-15');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedDesig, setSelectedDesig] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const departments = ['All', ...new Set(data.map(d => d.dept))];
  const designations = ['All', ...new Set(data.map(d => d.desig))];

  const filteredData = data.filter(item => {
    const matchesDept = selectedDept === 'All' || item.dept === selectedDept;
    const matchesDesig = selectedDesig === 'All' || item.desig === selectedDesig;
    const matchesQuery =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesDesig && matchesQuery;
  });

  const presentCount = filteredData.filter(d => d.status === 'Present').length;
  const lateCount = filteredData.filter(d => d.status === 'Late').length;
  const absentCount = filteredData.filter(d => d.status === 'Absent').length;

  const exportCSV = () => {
    const headers = [
      'S.No', 'Emp Code', 'Staff Name', 'Designation', 'Department', 'Shift',
      'Status', 'In Time', 'Out Time', 'Total Hours', 'Late By', 'Early Leaving', 'Overtime'
    ];
    const rows = filteredData.map((d, i) => [
      i + 1,
      `"${d.code}"`,
      `"${d.name}"`,
      `"${d.desig}"`,
      `"${d.dept}"`,
      `"${d.shift}"`,
      `"${d.status}"`,
      `"${d.inTime}"`,
      `"${d.outTime}"`,
      `"${d.totalHours}"`,
      `"${d.lateBy}"`,
      `"${d.earlyLeaving}"`,
      `"${d.overtime}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Staff_Attendance_Time_Report_${attendanceDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1:1 Secondary Top Header Toolbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20 print:hidden">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-bold text-slate-800 pr-3 border-r border-slate-300">
            Staff Attendance Time Report
          </h1>
          <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
            <button
              onClick={() => onNavigate && onNavigate('dashboard')}
              className="hover:text-blue-600 flex items-center gap-1 transition-colors"
            >
              <Home size={13} />
              <span>Home</span>
            </button>
            <span>/</span>
            <button
              onClick={() => onNavigate && onNavigate('payroll-reports')}
              className="hover:text-blue-600 transition-colors"
            >
              Payroll Reports
            </button>
            <span>/</span>
            <span className="text-slate-700 font-semibold">Attendance Time Report</span>
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
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:hidden">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Users size={20} />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">Total Staff</div>
              <div className="text-lg font-bold text-slate-800">{filteredData.length}</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">On Time / Present</div>
              <div className="text-lg font-bold text-emerald-600">{presentCount}</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Clock size={20} />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">Late Arrivals</div>
              <div className="text-lg font-bold text-amber-600">{lateCount}</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <XCircle size={20} />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">Absent</div>
              <div className="text-lg font-bold text-rose-600">{absentCount}</div>
            </div>
          </div>
        </div>

        {/* Filters Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm print:hidden">
          <div className="flex items-center space-x-2 text-slate-700 font-bold text-sm mb-4 border-b pb-2">
            <Filter size={16} className="text-blue-600" />
            <span>Attendance Date & Shift Filters</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Attendance Date</label>
              <input
                type="date"
                value={attendanceDate}
                onChange={e => setAttendanceDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Department</label>
              <select
                value={selectedDept}
                onChange={e => setSelectedDept(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {departments.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Designation</label>
              <select
                value={selectedDesig}
                onChange={e => setSelectedDesig(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {designations.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Search Staff</label>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Name or Code..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Printable Letterhead */}
        <div className="hidden print:block text-center border-b pb-4 mb-4">
          <h2 className="text-xl font-bold uppercase tracking-wider text-slate-900">J D International School</h2>
          <p className="text-xs text-slate-500">DAILY STAFF IN/OUT PUNCH TIME LOG REPORT</p>
          <p className="text-xs text-slate-400">Date: {attendanceDate} | Department: {selectedDept} | Generated: {new Date().toLocaleString()}</p>
        </div>

        {/* Time Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">
              Showing {filteredData.length} Staff Attendance Punches for {attendanceDate}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4 w-12 text-center">S.No</th>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Designation & Dept</th>
                  <th className="py-3 px-4">Shift</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4">In Time</th>
                  <th className="py-3 px-4">Out Time</th>
                  <th className="py-3 px-4 font-bold">Total Hours</th>
                  <th className="py-3 px-4">Late By</th>
                  <th className="py-3 px-4">Overtime</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="py-8 text-center text-slate-400">
                      No punch records found for this date.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((d, index) => (
                    <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 text-center font-medium text-slate-500">{index + 1}</td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{d.name}</div>
                        <div className="text-[11px] font-mono font-bold text-blue-600">ID: {d.code}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-slate-700 font-medium">{d.desig}</div>
                        <div className="text-[11px] text-slate-400">{d.dept}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 text-[11px]">{d.shift}</td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            d.status === 'Present'
                              ? 'bg-emerald-100 text-emerald-800'
                              : d.status === 'Late'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {d.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-700">{d.inTime}</td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-700">{d.outTime}</td>
                      <td className="py-3 px-4 font-mono font-bold text-blue-700">{d.totalHours}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {d.lateBy !== '0m' && d.lateBy !== '--' ? (
                          <span className="text-amber-600 font-bold">{d.lateBy}</span>
                        ) : (
                          d.lateBy
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {d.overtime !== '0m' ? (
                          <span className="text-emerald-600 font-bold">+{d.overtime}</span>
                        ) : (
                          d.overtime
                        )}
                      </td>
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
