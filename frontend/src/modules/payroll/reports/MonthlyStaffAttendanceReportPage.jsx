import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Home,
  Printer,
  FileDown,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const INITIAL_STAFF_ROSTER = [
  { id: '1', code: '101', name: 'ABHILASHA BHATT', desig: 'Principal', dept: 'ADMINISTRATIVE & MANAGEMENT' },
  { id: '2', code: '102', name: 'PRITI VERMA', desig: 'Administrator', dept: 'ADMINISTRATIVE & MANAGEMENT' },
  { id: '3', code: '201', name: 'MONIKA RANI VERMA', desig: 'Teacher', dept: 'TEACHING' },
  { id: '4', code: '202', name: 'SUNITA KUMARI', desig: 'Teacher', dept: 'TEACHING' },
  { id: '5', code: '501', name: 'BHARAT JANGID', desig: 'Driver', dept: 'TRANSPORT' },
  { id: '6', code: '502', name: 'HANSRAJ JAT', desig: 'Driver', dept: 'TRANSPORT' },
  { id: '7', code: '301', name: 'RAJENDRA SINGH', desig: 'Security Supervisor', dept: 'SECURITY & MAINTENANCE' }
];

export function MonthlyStaffAttendanceReportPage({ onNavigate }) {
  const [selectedMonth, setSelectedMonth] = useState('2026-09');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedDesig, setSelectedDesig] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate days in the selected month
  const { year, monthNum, daysInMonth, daysArray } = useMemo(() => {
    const [y, m] = selectedMonth.split('-').map(Number);
    const date = new Date(y, m, 0);
    const days = date.getDate();
    const arr = [];
    for (let i = 1; i <= days; i++) {
      const d = new Date(y, m - 1, i);
      const dayOfWeek = d.getDay(); // 0 is Sunday
      arr.push({
        day: i,
        isSunday: dayOfWeek === 0,
        dayName: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][dayOfWeek]
      });
    }
    return { year: y, monthNum: m, daysInMonth: days, daysArray: arr };
  }, [selectedMonth]);

  // Generate deterministic attendance records per staff
  const staffAttendanceData = useMemo(() => {
    return INITIAL_STAFF_ROSTER.map((staff, idx) => {
      const dailyMap = {};
      let presentCount = 0;
      let absentCount = 0;
      let leaveCount = 0;
      let halfDayCount = 0;
      let sundayCount = 0;

      daysArray.forEach(({ day, isSunday }) => {
        if (isSunday) {
          dailyMap[day] = 'WO';
          sundayCount++;
        } else if (staff.id === '7' && day > 15) {
          // Inactive staff after 15th
          dailyMap[day] = 'A';
          absentCount++;
        } else if ((day + idx * 7) % 23 === 0) {
          dailyMap[day] = 'L';
          leaveCount++;
        } else if ((day + idx * 3) % 19 === 0) {
          dailyMap[day] = 'HD';
          halfDayCount++;
        } else if ((day + idx * 5) % 29 === 0) {
          dailyMap[day] = 'A';
          absentCount++;
        } else {
          dailyMap[day] = 'P';
          presentCount++;
        }
      });

      const payableDays = presentCount + sundayCount + leaveCount + (halfDayCount * 0.5);

      return {
        ...staff,
        dailyMap,
        presentCount,
        absentCount,
        leaveCount,
        halfDayCount,
        sundayCount,
        payableDays
      };
    });
  }, [daysArray]);

  const departments = ['All', ...new Set(INITIAL_STAFF_ROSTER.map(s => s.dept))];
  const designations = ['All', ...new Set(INITIAL_STAFF_ROSTER.map(s => s.desig))];

  const filteredRoster = staffAttendanceData.filter(s => {
    const matchesDept = selectedDept === 'All' || s.dept === selectedDept;
    const matchesDesig = selectedDesig === 'All' || s.desig === selectedDesig;
    const matchesQuery =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesDesig && matchesQuery;
  });

  const totalWorkingDays = daysArray.filter(d => !d.isSunday).length;

  const exportCSV = () => {
    const headerCols = ['S.No', 'Emp Code', 'Staff Name', 'Designation', 'Department'];
    daysArray.forEach(d => headerCols.push(`Day ${d.day} (${d.dayName})`));
    headerCols.push('Total Present', 'Total Absent', 'Total Leave', 'Half Days', 'Payable Days');

    const rows = filteredRoster.map((s, i) => {
      const row = [i + 1, `"${s.code}"`, `"${s.name}"`, `"${s.desig}"`, `"${s.dept}"`];
      daysArray.forEach(d => row.push(`"${s.dailyMap[d.day] || ''}"`));
      row.push(s.presentCount, s.absentCount, s.leaveCount, s.halfDayCount, s.payableDays);
      return row;
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headerCols.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Monthly_Staff_Attendance_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'P':
        return <span className="inline-block w-6 h-6 leading-6 text-center rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">P</span>;
      case 'A':
        return <span className="inline-block w-6 h-6 leading-6 text-center rounded bg-rose-100 text-rose-800 font-bold text-[10px]">A</span>;
      case 'L':
        return <span className="inline-block w-6 h-6 leading-6 text-center rounded bg-amber-100 text-amber-800 font-bold text-[10px]">L</span>;
      case 'HD':
        return <span className="inline-block w-6 h-6 leading-6 text-center rounded bg-orange-100 text-orange-800 font-bold text-[10px]">HD</span>;
      case 'WO':
        return <span className="inline-block w-6 h-6 leading-6 text-center rounded bg-slate-200 text-slate-500 font-semibold text-[10px]">WO</span>;
      default:
        return <span className="inline-block w-6 h-6 leading-6 text-center rounded bg-slate-100 text-slate-400 text-[10px]">-</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1:1 Secondary Top Header Toolbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20 print:hidden">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-bold text-slate-800 pr-3 border-r border-slate-300">
            Monthly Staff Attendance Report
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
            <span className="text-slate-700 font-semibold">Monthly Attendance</span>
          </nav>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={exportCSV}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold shadow-sm transition-all"
          >
            <FileDown size={14} />
            <span>Export Matrix</span>
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
        {/* Filter Section */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm print:hidden">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Select Month & Year</label>
              <div className="relative">
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={e => setSelectedMonth(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
                />
              </div>
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

          {/* Legend Banner */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs">
            <span className="font-semibold text-slate-700">Legend:</span>
            <span className="inline-flex items-center gap-1.5"><span className="w-5 h-5 rounded bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px]">P</span> Present</span>
            <span className="inline-flex items-center gap-1.5"><span className="w-5 h-5 rounded bg-rose-100 text-rose-800 font-bold flex items-center justify-center text-[10px]">A</span> Absent</span>
            <span className="inline-flex items-center gap-1.5"><span className="w-5 h-5 rounded bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-[10px]">L</span> Leave</span>
            <span className="inline-flex items-center gap-1.5"><span className="w-5 h-5 rounded bg-orange-100 text-orange-800 font-bold flex items-center justify-center text-[10px]">HD</span> Half Day</span>
            <span className="inline-flex items-center gap-1.5"><span className="w-5 h-5 rounded bg-slate-200 text-slate-600 font-semibold flex items-center justify-center text-[10px]">WO</span> Week Off</span>
            <span className="ml-auto text-slate-500 font-medium">Month Working Days: <strong className="text-slate-800">{totalWorkingDays}</strong></span>
          </div>
        </div>

        {/* Printable Letterhead */}
        <div className="hidden print:block text-center border-b pb-4 mb-4">
          <h2 className="text-xl font-bold uppercase tracking-wider text-slate-900">J D International School</h2>
          <p className="text-xs text-slate-500">MONTHLY STAFF ATTENDANCE SHEET & MATRIX</p>
          <p className="text-xs text-slate-400">Month: {selectedMonth} | Department: {selectedDept} | Generated: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Attendance Matrix Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 uppercase font-semibold">
                  <th className="py-2.5 px-3 w-10 text-center sticky left-0 bg-slate-100 z-10">S.No</th>
                  <th className="py-2.5 px-3 w-16 sticky left-10 bg-slate-100 z-10">Code</th>
                  <th className="py-2.5 px-4 min-w-[160px] sticky left-24 bg-slate-100 z-10">Staff Name</th>
                  {daysArray.map(d => (
                    <th
                      key={d.day}
                      className={`py-2 px-1 text-center w-8 border-l border-slate-200 ${
                        d.isSunday ? 'bg-slate-200/60 text-slate-500 font-bold' : ''
                      }`}
                    >
                      <div className="text-[10px] leading-none text-slate-400">{d.dayName}</div>
                      <div className="text-xs font-bold">{d.day}</div>
                    </th>
                  ))}
                  <th className="py-2.5 px-2 text-center bg-emerald-50 text-emerald-800 font-bold border-l border-slate-200">P</th>
                  <th className="py-2.5 px-2 text-center bg-rose-50 text-rose-800 font-bold">A</th>
                  <th className="py-2.5 px-2 text-center bg-amber-50 text-amber-800 font-bold">L</th>
                  <th className="py-2.5 px-2 text-center bg-orange-50 text-orange-800 font-bold">HD</th>
                  <th className="py-2.5 px-3 text-center bg-blue-50 text-blue-800 font-bold">Payable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRoster.map((staff, idx) => (
                  <tr key={staff.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2 px-3 text-center font-medium text-slate-500 sticky left-0 bg-white z-10">
                      {idx + 1}
                    </td>
                    <td className="py-2 px-3 font-mono font-bold text-blue-700 sticky left-10 bg-white z-10">
                      {staff.code}
                    </td>
                    <td className="py-2 px-4 sticky left-24 bg-white z-10 border-r border-slate-100 shadow-[2px_0_4px_rgba(0,0,0,0.02)]">
                      <div className="font-semibold text-slate-800 whitespace-nowrap">{staff.name}</div>
                      <div className="text-[10px] text-slate-400">{staff.desig}</div>
                    </td>
                    {daysArray.map(d => (
                      <td
                        key={d.day}
                        className={`py-1.5 px-1 text-center border-l border-slate-100 ${
                          d.isSunday ? 'bg-slate-50/80' : ''
                        }`}
                      >
                        {getStatusBadge(staff.dailyMap[d.day])}
                      </td>
                    ))}
                    <td className="py-2 px-2 text-center font-bold text-emerald-700 bg-emerald-50/40 border-l border-slate-200">
                      {staff.presentCount}
                    </td>
                    <td className="py-2 px-2 text-center font-bold text-rose-700 bg-rose-50/40">
                      {staff.absentCount}
                    </td>
                    <td className="py-2 px-2 text-center font-bold text-amber-700 bg-amber-50/40">
                      {staff.leaveCount}
                    </td>
                    <td className="py-2 px-2 text-center font-bold text-orange-700 bg-orange-50/40">
                      {staff.halfDayCount}
                    </td>
                    <td className="py-2 px-3 text-center font-bold text-blue-700 bg-blue-50/50">
                      {staff.payableDays}
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
