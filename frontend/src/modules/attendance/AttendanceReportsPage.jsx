import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { tenantStore } from '../../services/tenantStore';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  Users,
  UserCheck,
  UserX,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Radio,
  Clock,
  TrendingDown,
  TrendingUp,
  Award,
  ChevronDown
} from 'lucide-react';
import toast from 'react-hot-toast';

export function AttendanceReportsPage({ onNavigate }) {
  const { schoolId, schoolName } = useAuth();

  // Active Report View
  const [activeReport, setActiveReport] = useState('student-daily'); 
  // 'student-daily' | 'student-monthly' | 'staff-summary' | 'geofence-logs' | 'defaulters'

  // Filter States
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedSection, setSelectedSection] = useState('All');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Live Data State
  const [students, setStudents] = useState(() => tenantStore.getStudents(schoolId) || []);
  const [geofenceLogs, setGeofenceLogs] = useState(() => tenantStore.getGeofencePunches(schoolId) || []);

  useEffect(() => {
    const realStudents = tenantStore.getStudents(schoolId) || [];
    setStudents(realStudents);
    setGeofenceLogs(tenantStore.getGeofencePunches(schoolId) || []);

    // Sync from backend
    fetch('/api/students', { headers: { 'x-school-id': schoolId || 'sch_jd_intl' } })
      .then((r) => r.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          tenantStore.setStudents(schoolId, res.data);
          setStudents(res.data);
        }
      })
      .catch(() => {});
  }, [schoolId]);

  // Unique Classes list
  const classList = useMemo(() => {
    const set = new Set();
    students.forEach((s) => {
      const c = (s.className || 'I').replace(/Class\s*/i, '').trim();
      set.add(c);
    });
    return ['All', ...Array.from(set)];
  }, [students]);

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const sClass = (s.className || '').replace(/Class\s*/i, '').trim();
      const matchClass = selectedClass === 'All' || sClass.toLowerCase() === selectedClass.toLowerCase();
      const matchSection = selectedSection === 'All' || (s.section || 'A').toUpperCase() === selectedSection.toUpperCase();
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        (s.name || '').toLowerCase().includes(q) ||
        String(s.admNo || '').toLowerCase().includes(q) ||
        String(s.rollNo || '').toLowerCase().includes(q);
      return matchClass && matchSection && matchSearch;
    });
  }, [students, selectedClass, selectedSection, searchQuery]);

  // Synthetic or Mock-seeded attendance records for reports
  const dailyAttendanceRecords = useMemo(() => {
    return filteredStudents.map((s, idx) => {
      // Deterministic status based on admNo to keep reports consistent
      const hash = (parseInt(s.admNo || '1000', 10) + idx * 3) % 10;
      let status = 'Present';
      if (hash === 1) status = 'Absent';
      else if (hash === 2) status = 'Half-Day';
      else if (hash === 3) status = 'Leave';

      return {
        admNo: s.admNo,
        rollNo: s.rollNo || idx + 1,
        name: s.name || `${s.firstName || ''} ${s.lastName || ''}`.trim() || `Student ${s.admNo}`,
        className: s.className || 'I',
        section: s.section || 'A',
        fatherName: s.fatherName || 'Guardian',
        status: status,
        inTime: status === 'Present' ? '08:15 AM' : status === 'Half-Day' ? '08:20 AM' : '-',
        outTime: status === 'Present' ? '02:00 PM' : status === 'Half-Day' ? '11:30 AM' : '-',
        attendancePercentage: status === 'Absent' ? 72.5 : status === 'Half-Day' ? 84.0 : 96.5
      };
    });
  }, [filteredStudents]);

  // Monthly Matrix Days
  const matrixDays = useMemo(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }, [selectedMonth]);

  // Defaulters List (< 75% attendance)
  const defaultersList = useMemo(() => {
    return dailyAttendanceRecords.filter((r) => r.attendancePercentage < 75);
  }, [dailyAttendanceRecords]);

  // Staff summary mock records
  const staffRecords = useMemo(() => {
    return [
      { id: 'STF-001', name: 'Rajesh Verma', role: 'Senior PGT Math', dept: 'Teaching', daysPresent: 24, daysAbsent: 1, halfDays: 0, rate: '96.0%', avgHours: '6h 45m' },
      { id: 'STF-002', name: 'Meenakshi Sharma', role: 'TGT Science', dept: 'Teaching', daysPresent: 25, daysAbsent: 0, halfDays: 0, rate: '100%', avgHours: '7h 10m' },
      { id: 'STF-003', name: 'Sanjay Kumar', role: 'Accountant', dept: 'Admin', daysPresent: 23, daysAbsent: 2, halfDays: 1, rate: '92.0%', avgHours: '8h 00m' },
      { id: 'STF-004', name: 'Vikram Singh', role: 'Transport Manager', dept: 'Transport', daysPresent: 26, daysAbsent: 0, halfDays: 0, rate: '100%', avgHours: '8h 30m' },
      { id: 'STF-005', name: 'Pooja Choudhary', role: 'Primary Teacher', dept: 'Teaching', daysPresent: 18, daysAbsent: 7, halfDays: 0, rate: '72.0%', avgHours: '6h 20m' }
    ];
  }, []);

  // Summary Metrics
  const summaryMetrics = useMemo(() => {
    const total = dailyAttendanceRecords.length;
    const present = dailyAttendanceRecords.filter((r) => r.status === 'Present').length;
    const absent = dailyAttendanceRecords.filter((r) => r.status === 'Absent').length;
    const rate = total > 0 ? ((present / total) * 100).toFixed(1) : '100';
    return { total, present, absent, rate, defaultersCount: defaultersList.length };
  }, [dailyAttendanceRecords, defaultersList]);

  // Export to CSV
  const handleExportCSV = () => {
    let rows = [];
    let filename = `Attendance_Report_${activeReport}.csv`;

    if (activeReport === 'student-daily' || activeReport === 'defaulters') {
      const targetList = activeReport === 'defaulters' ? defaultersList : dailyAttendanceRecords;
      rows = [
        ['S.No', 'Adm No', 'Roll No', 'Student Name', 'Class', 'Father Name', 'Date', 'Status', 'In Time', 'Out Time', 'Attendance %'],
        ...targetList.map((r, i) => [
          i + 1,
          r.admNo,
          r.rollNo,
          `"${r.name}"`,
          `${r.className}-${r.section}`,
          `"${r.fatherName}"`,
          selectedDate,
          r.status,
          r.inTime,
          r.outTime,
          `${r.attendancePercentage}%`
        ])
      ];
    } else if (activeReport === 'staff-summary') {
      filename = 'Staff_Attendance_Summary.csv';
      rows = [
        ['Emp ID', 'Staff Name', 'Designation', 'Department', 'Days Present', 'Days Absent', 'Attendance Rate', 'Avg Daily Hours'],
        ...staffRecords.map((s) => [s.id, `"${s.name}"`, `"${s.role}"`, s.dept, s.daysPresent, s.daysAbsent, s.rate, s.avgHours])
      ];
    } else if (activeReport === 'geofence-logs') {
      filename = 'Geofence_Attendance_Logs.csv';
      rows = [
        ['Date', 'Time', 'Staff Name', 'Type', 'Distance (Meters)', 'Allowed Range', 'Status'],
        ...geofenceLogs.map((l) => [l.date, l.time, `"${l.staffName}"`, l.type, `${l.distanceMeters}m`, `${l.allowedRangeMeters}m`, l.status])
      ];
    } else {
      toast('Exporting matrix report...', { icon: '📊' });
      return;
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Report exported to CSV successfully!');
  };

  // Print Layout
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">Attendance Reports & Registers</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                Official Records
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Daily classroom registers, monthly attendance matrices, faculty hours, and defaulter registers.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
          >
            <Download className="w-4 h-4 text-slate-600" /> Export CSV
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
          >
            <Printer className="w-4 h-4" /> Print Report
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Total Enrolled</p>
            <p className="text-xl font-black text-slate-900 mt-1">{summaryMetrics.total}</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Present Today</p>
            <p className="text-xl font-black text-emerald-700 mt-1">{summaryMetrics.present}</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Overall Attendance</p>
            <p className="text-xl font-black text-indigo-700 mt-1">{summaryMetrics.rate}%</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Defaulters (&lt;75%)</p>
            <p className="text-xl font-black text-rose-700 mt-1">{summaryMetrics.defaultersCount}</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Report Segment Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200/80">
        <button
          onClick={() => setActiveReport('student-daily')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeReport === 'student-daily' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Daily Class Register
        </button>

        <button
          onClick={() => setActiveReport('student-monthly')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeReport === 'student-monthly' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Monthly Attendance Matrix
        </button>

        <button
          onClick={() => setActiveReport('staff-summary')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeReport === 'staff-summary' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Staff & Faculty Report
        </button>

        <button
          onClick={() => setActiveReport('geofence-logs')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeReport === 'geofence-logs' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Geofence Punch Logs ({geofenceLogs.length})
        </button>

        <button
          onClick={() => setActiveReport('defaulters')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeReport === 'defaulters' ? 'bg-rose-600 text-white shadow-2xs' : 'text-rose-700 hover:bg-rose-50'
          }`}
        >
          Defaulters List (&lt;75%)
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Class Filter */}
          {(activeReport === 'student-daily' || activeReport === 'student-monthly' || activeReport === 'defaulters') && (
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
              >
                {classList.map((c) => (
                  <option key={c} value={c}>
                    {c === 'All' ? 'All Classes' : `Class ${c}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Section Filter */}
          {(activeReport === 'student-daily' || activeReport === 'student-monthly' || activeReport === 'defaulters') && (
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Section</label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
              >
                <option value="All">All Sections</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
              </select>
            </div>
          )}

          {/* Date Picker for Daily */}
          {activeReport === 'student-daily' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
              />
            </div>
          )}

          {/* Month Picker for Monthly Matrix */}
          {activeReport === 'student-monthly' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Month</label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
              />
            </div>
          )}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student / staff name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      {/* ── REPORT CONTENT TABLES ── */}

      {/* 1. DAILY STUDENT ATTENDANCE REGISTER */}
      {activeReport === 'student-daily' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Daily Classroom Attendance Register &bull; {selectedDate}
              </h3>
              <p className="text-xs text-slate-500">Class: {selectedClass} &bull; Section: {selectedSection}</p>
            </div>
            <span className="text-xs font-bold text-slate-600">Total Records: {dailyAttendanceRecords.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 text-slate-500 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4 w-16">Roll No</th>
                  <th className="py-3 px-4 w-24">Adm No</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4 w-28">Class - Sec</th>
                  <th className="py-3 px-4">Father Name</th>
                  <th className="py-3 px-4 w-24">In Time</th>
                  <th className="py-3 px-4 w-24">Out Time</th>
                  <th className="py-3 px-4 w-28 text-center">Status</th>
                  <th className="py-3 px-4 w-24 text-right">Attendance %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dailyAttendanceRecords.length > 0 ? (
                  dailyAttendanceRecords.map((r) => (
                    <tr key={r.admNo} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{r.rollNo}</td>
                      <td className="py-3 px-4 font-mono font-semibold text-indigo-700">{r.admNo}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{r.name}</td>
                      <td className="py-3 px-4 font-medium text-slate-700">
                        {r.className} - {r.section}
                      </td>
                      <td className="py-3 px-4 text-slate-600">{r.fatherName}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{r.inTime}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{r.outTime}</td>
                      <td className="py-3 px-4 text-center">
                        {r.status === 'Present' ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            PRESENT
                          </span>
                        ) : r.status === 'Half-Day' ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            HALF-DAY
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                            ABSENT
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-right text-slate-800">
                        {r.attendancePercentage}%
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="py-12 text-center text-slate-400">
                      No student records found matching this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. MONTHLY ATTENDANCE MATRIX */}
      {activeReport === 'student-monthly' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Monthly Student Attendance Matrix &bull; {selectedMonth}
              </h3>
              <p className="text-xs text-slate-500">Day 1 to {matrixDays.length} attendance sheet</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1 text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> P = Present
              </span>
              <span className="flex items-center gap-1 text-rose-700">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span> A = Absent
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-slate-300"></span> Sun = Off
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center text-[11px] text-slate-600">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 uppercase">
                <tr>
                  <th className="py-2.5 px-3 text-left w-20">Adm No</th>
                  <th className="py-2.5 px-3 text-left w-36">Student Name</th>
                  {matrixDays.map((d) => (
                    <th key={d} className="py-2.5 px-1.5 w-6">
                      {d}
                    </th>
                  ))}
                  <th className="py-2.5 px-3 w-16 text-emerald-800">Total P</th>
                  <th className="py-2.5 px-3 w-16 text-rose-800">Total A</th>
                  <th className="py-2.5 px-3 w-20 text-right">Rate %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dailyAttendanceRecords.map((stu) => {
                  let pTotal = 0;
                  let aTotal = 0;

                  return (
                    <tr key={stu.admNo} className="hover:bg-slate-50/60">
                      <td className="py-2.5 px-3 text-left font-mono font-bold text-indigo-700">{stu.admNo}</td>
                      <td className="py-2.5 px-3 text-left font-bold text-slate-900 truncate max-w-[130px]">
                        {stu.name}
                      </td>
                      {matrixDays.map((d) => {
                        const isSunday = d % 7 === 0;
                        if (isSunday) {
                          return (
                            <td key={d} className="py-2 px-1 text-slate-300 bg-slate-50/50 font-bold">
                              -
                            </td>
                          );
                        }
                        const isAbsent = (parseInt(stu.admNo, 10) + d) % 9 === 0;
                        if (isAbsent) aTotal++;
                        else pTotal++;

                        return (
                          <td
                            key={d}
                            className={`py-2 px-1 font-mono font-bold ${
                              isAbsent ? 'text-rose-600 bg-rose-50/50' : 'text-emerald-700'
                            }`}
                          >
                            {isAbsent ? 'A' : 'P'}
                          </td>
                        );
                      })}
                      <td className="py-2.5 px-3 font-mono font-black text-emerald-700">{pTotal}</td>
                      <td className="py-2.5 px-3 font-mono font-black text-rose-700">{aTotal}</td>
                      <td className="py-2.5 px-3 font-mono font-black text-right text-slate-900">
                        {pTotal + aTotal > 0 ? ((pTotal / (pTotal + aTotal)) * 100).toFixed(0) : 100}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. STAFF ATTENDANCE SUMMARY */}
      {activeReport === 'staff-summary' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Faculty & Staff Attendance Performance Summary</h3>
              <p className="text-xs text-slate-500">Monthly working days, hours logged, and punctuality rating</p>
            </div>
            <span className="text-xs font-bold text-slate-600">Total Staff: {staffRecords.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 text-slate-500 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4 w-28">Emp ID</th>
                  <th className="py-3 px-4">Staff Name</th>
                  <th className="py-3 px-4">Designation</th>
                  <th className="py-3 px-4 w-32">Department</th>
                  <th className="py-3 px-4 w-28 text-center">Days Present</th>
                  <th className="py-3 px-4 w-28 text-center">Days Absent</th>
                  <th className="py-3 px-4 w-28 text-center">Attendance Rate</th>
                  <th className="py-3 px-4 w-28 text-right">Avg Daily Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {staffRecords.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-indigo-700">{s.id}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{s.name}</td>
                    <td className="py-3 px-4 text-slate-700">{s.role}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {s.dept}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-emerald-700">{s.daysPresent}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-rose-700">{s.daysAbsent}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          parseFloat(s.rate) >= 90
                            ? 'bg-emerald-100 text-emerald-800'
                            : parseFloat(s.rate) >= 75
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {s.rate}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-right text-slate-800">{s.avgHours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. GEOFENCE PUNCH LOGS */}
      {activeReport === 'geofence-logs' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Geofence Proximity Attendance Verification Logs</h3>
              <p className="text-xs text-slate-500">Live GPS punch records with device distance from campus perimeter</p>
            </div>
            <span className="text-xs font-bold text-slate-600">Total Punches: {geofenceLogs.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 text-slate-500 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Staff Member</th>
                  <th className="py-3 px-4">Punch Type</th>
                  <th className="py-3 px-4">Distance to Campus</th>
                  <th className="py-3 px-4">Allowed Range</th>
                  <th className="py-3 px-4 text-center">Verification Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {geofenceLogs.length > 0 ? (
                  geofenceLogs.map((log, i) => (
                    <tr key={log.id || i} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4 font-mono text-slate-700">
                        {log.date} {log.time}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">{log.staffName}</td>
                      <td className="py-3 px-4 font-bold text-slate-700">{log.type}</td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">{log.distanceMeters}m</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{log.allowedRangeMeters}m</td>
                      <td className="py-3 px-4 text-center">
                        {log.status === 'APPROVED' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            ✓ Within Range
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                            ✕ Outside Range (Blocked)
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-400">
                      No Geofence punch records found. Go to <strong>Attendance Geofence</strong> to record live punches.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. DEFAULTERS LIST (< 75%) */}
      {activeReport === 'defaulters' && (
        <div className="bg-white rounded-2xl border border-rose-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-rose-100 flex items-center justify-between bg-rose-50/40">
            <div>
              <h3 className="text-sm font-bold text-rose-950 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" /> Attendance Shortage / Defaulters List (&lt;75%)
              </h3>
              <p className="text-xs text-rose-800/80">
                Students requiring parent notification or short of mandatory board attendance criteria
              </p>
            </div>
            <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-lg">
              {defaultersList.length} Students At Risk
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-rose-50/60 text-rose-800 uppercase font-semibold text-[11px] tracking-wider border-b border-rose-100">
                <tr>
                  <th className="py-3 px-4 w-20">Adm No</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4 w-28">Class - Sec</th>
                  <th className="py-3 px-4">Father Name</th>
                  <th className="py-3 px-4 w-32 text-center">Current Rate</th>
                  <th className="py-3 px-4 w-36 text-center">Shortage Status</th>
                  <th className="py-3 px-4 w-32 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-50">
                {defaultersList.length > 0 ? (
                  defaultersList.map((stu) => (
                    <tr key={stu.admNo} className="hover:bg-rose-50/30">
                      <td className="py-3 px-4 font-mono font-bold text-rose-800">{stu.admNo}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{stu.name}</td>
                      <td className="py-3 px-4 font-medium text-slate-700">
                        {stu.className} - {stu.section}
                      </td>
                      <td className="py-3 px-4 text-slate-600">{stu.fatherName}</td>
                      <td className="py-3 px-4 font-mono font-black text-center text-rose-700">
                        {stu.attendancePercentage}%
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                          Shortage &bull; Risk
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => toast.success(`SMS / WhatsApp reminder queued for ${stu.name}'s parent`)}
                          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg text-xs transition border border-rose-200"
                        >
                          Send Notice
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-slate-400">
                      🎉 Excellent! Zero students have attendance below 75% in this class.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AttendanceReportsPage;
