import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Home,
  X,
  Calendar,
  CheckCircle2,
  FileDown,
  UserCheck
} from 'lucide-react';

const INITIAL_ATTENDANCE_LOGS = [
  { id: '1', date: '2026-10-15', present: 13, absent: 1, leave: 0, total: 14 },
  { id: '2', date: '2026-10-14', present: 14, absent: 0, leave: 0, total: 14 },
  { id: '3', date: '2026-10-13', present: 12, absent: 1, leave: 1, total: 14 },
  { id: '4', date: '2026-10-12', present: 14, absent: 0, leave: 0, total: 14 }
];

const INITIAL_STAFF_ROSTER = [
  { id: '1', code: '101', name: 'ABHILASHA BHATT', designation: 'Principal', status: 'Present', inTime: '07:55', outTime: '14:10' },
  { id: '2', code: '102', name: 'PRITI VERMA', designation: 'Administrator', status: 'Present', inTime: '08:00', outTime: '14:00' },
  { id: '3', code: '201', name: 'MONIKA RANI VERMA', designation: 'Teacher', status: 'Present', inTime: '08:05', outTime: '14:00' },
  { id: '4', code: '202', name: 'SUNITA KUMARI', designation: 'Teacher', status: 'Present', inTime: '08:00', outTime: '14:00' },
  { id: '5', code: '501', name: 'BHARAT JANGID', designation: 'Driver', status: 'Present', inTime: '06:30', outTime: '15:30' },
  { id: '6', code: '502', name: 'HANSRAJ JAT', designation: 'Driver', status: 'Present', inTime: '06:30', outTime: '15:30' },
  { id: '7', code: '301', name: 'RAKESH SHARMA', designation: 'Accountant', status: 'Absent', inTime: '-', outTime: '-' }
];

export function StaffAttendancePage({ onNavigate }) {
  const [data, setData] = useState(INITIAL_ATTENDANCE_LOGS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isTakeAttendanceOpen, setIsTakeAttendanceOpen] = useState(false);
  const [attendanceDate, setAttendanceDate] = useState('2026-10-16');
  const [staffRoster, setStaffRoster] = useState(INITIAL_STAFF_ROSTER);

  const filteredData = data.filter(item =>
    item.date.includes(searchTerm)
  );

  const handleStatusToggle = (id, newStatus) => {
    setStaffRoster(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  const handleSaveAttendance = () => {
    const p = staffRoster.filter(s => s.status === 'Present').length;
    const a = staffRoster.filter(s => s.status === 'Absent').length;
    const l = staffRoster.filter(s => s.status === 'Leave').length;

    const newLog = {
      id: Date.now().toString(),
      date: attendanceDate,
      present: p,
      absent: a,
      leave: l,
      total: staffRoster.length
    };
    setData(prev => [newLog, ...prev]);
    setIsTakeAttendanceOpen(false);
  };

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["S.No,Date,Present,Absent,Leave,Total Staff"].concat(
        data.map((d, i) => `"${i + 1}","${d.date}","${d.present}","${d.absent}","${d.leave}","${d.total}"`)
      ).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "staff_attendance_logs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1:1 Secondary Top Header Toolbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-bold text-slate-800 pr-3 border-r border-slate-300">
            Staff Attendance
          </h1>
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <button onClick={() => onNavigate?.('/')} className="hover:text-indigo-600 flex items-center">
              <Home className="w-3.5 h-3.5 mr-1" />
            </button>
            <span>•</span>
            <span className="hover:text-indigo-600 cursor-pointer" onClick={() => onNavigate?.('/staff-attendance')}>Payroll</span>
            <span>•</span>
            <span className="text-slate-800 font-medium">Staff Attendance</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={exportCSV}
            title="Export CSV"
            className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 text-xs font-semibold flex items-center gap-1.5"
          >
            <FileDown className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 max-w-7xl mx-auto w-full space-y-4">
        {/* Search Bar & FAB */}
        <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search date (YYYY-MM-DD)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          <button
            onClick={() => setIsTakeAttendanceOpen(true)}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs active:scale-95 transition-transform"
          >
            <UserCheck className="w-4 h-4" />
            <span>Take Attendance</span>
          </button>
        </div>

        {/* Table View matching UAB 1:1 */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4 w-16 text-center">S.No.</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-center">Present</th>
                  <th className="py-3 px-4 text-center">Absent</th>
                  <th className="py-3 px-4 text-center">Leave</th>
                  <th className="py-3 px-4 text-center">Total Staff</th>
                  <th className="py-3 px-4 w-28 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center font-bold text-slate-500">{index + 1}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{item.date}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-emerald-600">{item.present}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-red-500">{item.absent}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-amber-600">{item.leave}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-800">{item.total}</td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => setIsTakeAttendanceOpen(true)}
                        className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-md font-bold text-[11px]"
                      >
                        View / Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Take Attendance Modal */}
      {isTakeAttendanceOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">
                    Mark Daily Staff Attendance
                  </h3>
                  <p className="text-[11px] text-slate-500">Record attendance status and in/out timings</p>
                </div>
              </div>
              <button onClick={() => setIsTakeAttendanceOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-600">Attendance Date:</span>
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white font-mono font-bold"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStaffRoster(prev => prev.map(s => ({ ...s, status: 'Present' })))}
                  className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-xs font-bold"
                >
                  Mark All Present
                </button>
              </div>
            </div>

            <div className="p-4 flex-1 overflow-y-auto space-y-2">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 sticky top-0">
                    <th className="py-2 px-3 w-16">Code</th>
                    <th className="py-2 px-3">Employee Name</th>
                    <th className="py-2 px-3">Designation</th>
                    <th className="py-2 px-3 text-center w-36">Status</th>
                    <th className="py-2 px-3 text-center w-24">In Time</th>
                    <th className="py-2 px-3 text-center w-24">Out Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {staffRoster.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-mono font-bold text-slate-600">{s.code}</td>
                      <td className="py-2 px-3 font-bold text-slate-900">{s.name}</td>
                      <td className="py-2 px-3 text-slate-600 font-medium">{s.designation}</td>
                      <td className="py-2 px-3 text-center">
                        <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-100 text-[11px] font-bold">
                          {['Present', 'Absent', 'Leave'].map(st => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => handleStatusToggle(s.id, st)}
                              className={`px-2 py-0.5 rounded transition-colors ${
                                s.status === st
                                  ? st === 'Present'
                                    ? 'bg-emerald-600 text-white'
                                    : st === 'Absent'
                                    ? 'bg-red-600 text-white'
                                    : 'bg-amber-600 text-white'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              {st === 'Present' ? 'P' : st === 'Absent' ? 'A' : 'L'}
                            </button>
                          ))}
                        </div>
                      </td>
                      <td className="py-2 px-3 text-center font-mono text-[11px] text-slate-600">{s.inTime}</td>
                      <td className="py-2 px-3 text-center font-mono text-[11px] text-slate-600">{s.outTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-slate-200 flex items-center justify-end gap-2 bg-slate-50">
              <button
                type="button"
                onClick={() => setIsTakeAttendanceOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAttendance}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs"
              >
                Save Attendance Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
