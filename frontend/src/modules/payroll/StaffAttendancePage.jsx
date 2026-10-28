import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  UserCheck,
  UserX,
  Calendar,
  CalendarDays,
  Clock,
  ShieldCheck,
  TrendingUp,
  Download,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Plus,
  Sparkles,
  Building2,
  Briefcase,
  SlidersHorizontal,
  Home
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import toast from 'react-hot-toast';
import { PageHeader, ErpSection, PageStack } from '../../components/erp/PagePrimitives';
import StatsCard from '../../components/StatsCard';
import { cn } from '../../utils/cn';

// Sample Staff Master Roster
const INITIAL_STAFF_MASTER = [
  { id: '1', code: '101', name: 'ABHILASHA BHATT', designation: 'Principal', department: 'ADMINISTRATIVE', shift: 'General (08:00 - 15:00)', mobile: '9829011101', defaultIn: '07:55', defaultOut: '15:05', status: 'Present', gender: 'Female' },
  { id: '2', code: '102', name: 'PRITI VERMA', designation: 'Vice Principal', department: 'ADMINISTRATIVE', shift: 'General (08:00 - 15:00)', mobile: '9829011102', defaultIn: '08:00', defaultOut: '15:00', status: 'Present', gender: 'Female' },
  { id: '3', code: '201', name: 'MONIKA RANI VERMA', designation: 'Sr. PGT Teacher', department: 'TEACHING', shift: 'Morning (07:30 - 14:00)', mobile: '9870943695', defaultIn: '07:30', defaultOut: '14:00', status: 'Present', gender: 'Female' },
  { id: '4', code: '202', name: 'SUNITA KUMARI', designation: 'TGT Science Teacher', department: 'TEACHING', shift: 'Morning (07:30 - 14:00)', mobile: '9511719644', defaultIn: '07:35', defaultOut: '14:00', status: 'Present', gender: 'Female' },
  { id: '5', code: '203', name: 'PRIYANKA SHARMA', designation: 'PRT English Teacher', department: 'TEACHING', shift: 'Morning (07:30 - 14:00)', mobile: '9829011105', defaultIn: '07:30', defaultOut: '14:05', status: 'Present', gender: 'Female' },
  { id: '6', code: '204', name: 'RAKESH CHOUDHARY', designation: 'PGT Maths Teacher', department: 'TEACHING', shift: 'Morning (07:30 - 14:00)', mobile: '9829011106', defaultIn: '07:28', defaultOut: '14:00', status: 'Present', gender: 'Male' },
  { id: '7', code: '301', name: 'RAKESH SHARMA', designation: 'Sr. Accountant', department: 'ADMINISTRATIVE', shift: 'General (08:00 - 16:00)', mobile: '9829011107', defaultIn: '08:00', defaultOut: '16:00', status: 'Present', gender: 'Male' },
  { id: '8', code: '302', name: 'NEHA AGARWAL', designation: 'Fee Counter Clerk', department: 'ADMINISTRATIVE', shift: 'General (08:00 - 16:00)', mobile: '9829011108', defaultIn: '08:05', defaultOut: '16:00', status: 'Leave', gender: 'Female' },
  { id: '9', code: '501', name: 'BHARAT JANGID', designation: 'Bus Driver', department: 'TRANSPORT', shift: 'Split (06:30 - 16:30)', mobile: '9829011109', defaultIn: '06:30', defaultOut: '16:30', status: 'Present', gender: 'Male' },
  { id: '10', code: '502', name: 'HANSRAJ JAT', designation: 'Bus Driver', department: 'TRANSPORT', shift: 'Split (06:30 - 16:30)', mobile: '9829011110', defaultIn: '06:30', defaultOut: '16:30', status: 'Present', gender: 'Male' },
  { id: '11', code: '503', name: 'LALARAM', designation: 'Bus Driver', department: 'TRANSPORT', shift: 'Split (06:30 - 16:30)', mobile: '8209323925', defaultIn: '06:35', defaultOut: '16:30', status: 'Absent', gender: 'Male' },
  { id: '12', code: '504', name: 'SHAITAN SINGH', designation: 'Van Driver', department: 'TRANSPORT', shift: 'Split (06:30 - 16:30)', mobile: '8290058104', defaultIn: '06:30', defaultOut: '16:30', status: 'Present', gender: 'Male' },
  { id: '13', code: '601', name: 'RAMESH MEENA', designation: 'Lab Attendant', department: 'SUPPORT', shift: 'General (08:00 - 15:30)', mobile: '8824449233', defaultIn: '08:00', defaultOut: '15:30', status: 'Half-Day', gender: 'Male' },
  { id: '14', code: '602', name: 'SURESH VERMA', designation: 'Office Boy / Peon', department: 'SUPPORT', shift: 'General (07:30 - 16:00)', mobile: '9928461276', defaultIn: '07:30', defaultOut: '16:00', status: 'Present', gender: 'Male' }
];

const DEPARTMENTS = ['ALL', 'TEACHING', 'ADMINISTRATIVE', 'TRANSPORT', 'SUPPORT'];

export function StaffAttendancePage({ onNavigate }) {
  const { role, schoolName } = useAuth();
  const isAttender = role === 'ATTENDER';
  const todayStr = new Date().toISOString().split('T')[0];

  // Primary Segmented Tab State
  const [activeTab, setActiveTab] = useState('mark'); // 'manage' | 'mark' | 'reports' | 'analytics'

  // Mark Attendance State
  const [attendanceDate, setAttendanceDate] = useState(todayStr);
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [markSearchQuery, setMarkSearchQuery] = useState('');
  const [staffRoster, setStaffRoster] = useState(() => {
    try {
      const saved = localStorage.getItem(`staff_attendance_${todayStr}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_STAFF_MASTER.map(s => ({
      ...s,
      inTime: s.defaultIn,
      outTime: s.defaultOut,
      remarks: ''
    }));
  });

  // Manage / Shift Tab State
  const [manageDeptFilter, setManageDeptFilter] = useState('ALL');
  const [manageSearch, setManageSearch] = useState('');
  const [editingStaffShift, setEditingStaffShift] = useState(null);

  // Reports Tab State
  const [reportDatePreset, setReportDatePreset] = useState('month'); // 'today' | 'week' | 'month' | '30days'
  const [reportStartDate, setReportStartDate] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d.toISOString().split('T')[0];
  });
  const [reportEndDate, setReportEndDate] = useState(todayStr);
  const [reportDeptFilter, setReportDeptFilter] = useState('ALL');
  const [reportViewMode, setReportViewMode] = useState('matrix'); // 'matrix' | 'logs'

  // Analytics Tab State
  const [selectedStaffId, setSelectedStaffId] = useState(INITIAL_STAFF_MASTER[0].id);
  const [analyticsMonth, setAnalyticsMonth] = useState(new Date());
  const [analyticsViewMode, setAnalyticsViewMode] = useState('calendar'); // 'calendar' | 'chart'

  // Synchronize date if attender
  useEffect(() => {
    if (isAttender) setAttendanceDate(todayStr);
  }, [isAttender, todayStr]);

  // Handle Preset Changes for Reports
  const applyReportPreset = (preset) => {
    setReportDatePreset(preset);
    const today = new Date();
    const todayFormatted = today.toISOString().split('T')[0];

    if (preset === 'today') {
      setReportStartDate(todayFormatted);
      setReportEndDate(todayFormatted);
    } else if (preset === 'week') {
      const d = new Date(today);
      d.setDate(d.getDate() - 6);
      setReportStartDate(d.toISOString().split('T')[0]);
      setReportEndDate(todayFormatted);
    } else if (preset === 'month') {
      const first = new Date(today.getFullYear(), today.getMonth(), 1);
      setReportStartDate(first.toISOString().split('T')[0]);
      setReportEndDate(todayFormatted);
    } else if (preset === '30days') {
      const d = new Date(today);
      d.setDate(d.getDate() - 29);
      setReportStartDate(d.toISOString().split('T')[0]);
      setReportEndDate(todayFormatted);
    }
  };

  // --- Real-time Attendance KPI Calculations ---
  const stats = useMemo(() => {
    const total = staffRoster.length;
    const present = staffRoster.filter(s => s.status === 'Present').length;
    const absent = staffRoster.filter(s => s.status === 'Absent').length;
    const halfDay = staffRoster.filter(s => s.status === 'Half-Day').length;
    const leave = staffRoster.filter(s => s.status === 'Leave').length;
    const marked = present + absent + halfDay + leave;
    const rate = total > 0 ? (((present + halfDay * 0.5) / total) * 100).toFixed(1) : 0;
    return { total, present, absent, halfDay, leave, marked, rate };
  }, [staffRoster]);

  // Toggle single staff status
  const handleStatusChange = (staffId, newStatus) => {
    setStaffRoster(prev => prev.map(s => {
      if (s.id === staffId) {
        return {
          ...s,
          status: newStatus,
          inTime: newStatus === 'Absent' ? '-' : s.inTime === '-' ? s.defaultIn : s.inTime,
          outTime: newStatus === 'Absent' ? '-' : s.outTime === '-' ? s.defaultOut : s.outTime
        };
      }
      return s;
    }));
  };

  // Handle bulk mark
  const handleBulkMark = (statusToSet) => {
    setStaffRoster(prev => prev.map(s => ({
      ...s,
      status: statusToSet,
      inTime: statusToSet === 'Absent' ? '-' : s.defaultIn,
      outTime: statusToSet === 'Absent' ? '-' : s.defaultOut
    })));
    toast.success(`Marked all staff as ${statusToSet}`);
  };

  // Save current attendance to localStorage / Tenant simulation
  const handleSaveAttendance = () => {
    try {
      localStorage.setItem(`staff_attendance_${attendanceDate}`, JSON.stringify(staffRoster));
      toast.success(`Staff Attendance for ${attendanceDate} saved successfully!`);
    } catch (e) {
      toast.error('Failed to persist attendance');
    }
  };

  // Filtered Roster for Mark Tab
  const filteredMarkRoster = useMemo(() => {
    return staffRoster.filter(s => {
      const matchDept = selectedDept === 'ALL' || s.department === selectedDept;
      const matchSearch = !markSearchQuery ||
        s.name.toLowerCase().includes(markSearchQuery.toLowerCase()) ||
        s.code.includes(markSearchQuery) ||
        s.designation.toLowerCase().includes(markSearchQuery.toLowerCase());
      return matchDept && matchSearch;
    });
  }, [staffRoster, selectedDept, markSearchQuery]);

  // Selected Staff for Analytics
  const selectedStaff = useMemo(() => {
    return staffRoster.find(s => s.id === selectedStaffId) || staffRoster[0];
  }, [staffRoster, selectedStaffId]);

  // Deterministic Mock Monthly Attendance History for Selected Staff
  const staffMonthlyAnalytics = useMemo(() => {
    if (!selectedStaff) return { historyMap: new Map(), trendData: [], summary: {} };

    const year = analyticsMonth.getFullYear();
    const month = analyticsMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const historyMap = new Map();
    const trendData = [];

    let presentDays = 0;
    let absentDays = 0;
    let halfDays = 0;
    let leaveDays = 0;
    let workingDays = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const mStr = String(month + 1).padStart(2, '0');
      const dStr = String(day).padStart(2, '0');
      const dateKey = `${year}-${mStr}-${dStr}`;
      const dayOfWeek = new Date(year, month, day).getDay();
      const isSunday = dayOfWeek === 0;

      let status = 'Present';
      if (isSunday) {
        status = 'Weekend';
      } else {
        workingDays++;
        // pseudo-random deterministic distribution based on code and day
        const seed = (parseInt(selectedStaff.code, 10) * 7 + day) % 25;
        if (seed === 1) status = 'Absent';
        else if (seed === 2) status = 'Leave';
        else if (seed === 3) status = 'Half-Day';
        else status = 'Present';

        if (status === 'Present') presentDays++;
        if (status === 'Absent') absentDays++;
        if (status === 'Half-Day') halfDays++;
        if (status === 'Leave') leaveDays++;
      }

      historyMap.set(dateKey, {
        date: dateKey,
        day,
        isSunday,
        status,
        inTime: status === 'Present' ? selectedStaff.defaultIn : status === 'Half-Day' ? selectedStaff.defaultIn : '-',
        outTime: status === 'Present' ? selectedStaff.defaultOut : status === 'Half-Day' ? '12:00' : '-'
      });

      if (!isSunday && day <= new Date().getDate()) {
        const cumulativePresent = presentDays + halfDays * 0.5;
        const cumPct = workingDays > 0 ? Math.round((cumulativePresent / workingDays) * 100) : 100;
        trendData.push({
          dayLabel: `${day} ${analyticsMonth.toLocaleDateString('en-US', { month: 'short' })}`,
          rate: cumPct,
          status
        });
      }
    }

    const overallRate = workingDays > 0 ? (((presentDays + halfDays * 0.5) / workingDays) * 100).toFixed(1) : 100;

    return {
      historyMap,
      trendData,
      summary: {
        workingDays,
        presentDays,
        absentDays,
        halfDays,
        leaveDays,
        overallRate
      }
    };
  }, [selectedStaff, analyticsMonth]);

  // Calendar Grid Cells for Analytics Month
  const calendarCells = useMemo(() => {
    const year = analyticsMonth.getFullYear();
    const month = analyticsMonth.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells = [];
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const mStr = String(month + 1).padStart(2, '0');
      const dStr = String(day).padStart(2, '0');
      const dateKey = `${year}-${mStr}-${dStr}`;
      const rec = staffMonthlyAnalytics.historyMap.get(dateKey);
      cells.push(rec);
    }

    return cells;
  }, [analyticsMonth, staffMonthlyAnalytics]);

  // Matrix Data for Reports Tab
  const reportDates = useMemo(() => {
    const list = [];
    const curr = new Date(reportStartDate);
    const end = new Date(reportEndDate);
    while (curr <= end && list.length < 31) {
      list.push(curr.toISOString().split('T')[0]);
      curr.setDate(curr.getDate() + 1);
    }
    return list;
  }, [reportStartDate, reportEndDate]);

  // Export Matrix to CSV
  const handleExportMatrixCSV = () => {
    const header = ['S.No', 'Emp Code', 'Staff Name', 'Department', 'Designation', ...reportDates, 'Present', 'Absent', 'Rate %'];
    const rows = filteredMarkRoster.map((s, idx) => {
      let pCount = 0;
      let aCount = 0;
      const dateStatuses = reportDates.map(d => {
        const isSun = new Date(d).getDay() === 0;
        if (isSun) return 'OFF';
        const seed = (parseInt(s.code, 10) * 5 + new Date(d).getDate()) % 20;
        if (seed === 1) { aCount++; return 'A'; }
        if (seed === 2) { return 'L'; }
        pCount++;
        return 'P';
      });
      const totalW = pCount + aCount || 1;
      const rate = ((pCount / totalW) * 100).toFixed(0);
      return [idx + 1, s.code, `"${s.name}"`, s.department, s.designation, ...dateStatuses, pCount, aCount, `${rate}%`];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [header.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Staff_Attendance_Report_${reportStartDate}_to_${reportEndDate}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Attendance Matrix exported successfully!');
  };

  return (
    <PageStack className="gap-3 sm:gap-4.5 bg-slate-50/40 min-h-screen pb-24">
      {/* Page Header */}
      <PageHeader
        title="Staff & Faculty Attendance"
        description="Comprehensive daily attendance tracking, shift allocation, monthly matrix registers, and individual faculty analytics."
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('/dashboard')}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Home className="w-3.5 h-3.5 text-slate-400" />
            <span>Dashboard</span>
          </button>
        </div>
      </PageHeader>

      {/* 5-Card Stats Grid (Test Master Pro Theme: Compact, Clean Tint, 0 Harsh Lines) */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-2.5 sm:gap-3.5">
        <StatsCard
          title="Total Staff"
          value={stats.total}
          icon={Users}
          themeIndex={0}
          subtitle="Registered Faculty & Staff"
          badge="Active Roster"
        />

        <StatsCard
          title="Present Today"
          value={stats.present}
          icon={UserCheck}
          themeIndex={2}
          subtitle={`Rate: ${stats.rate}% on time`}
          badge="Verified"
        />

        <StatsCard
          title="Absent Staff"
          value={stats.absent}
          icon={UserX}
          themeIndex={5}
          subtitle="Unplanned leaves"
          badge={stats.absent > 0 ? 'Requires Follow-up' : 'Zero Absentees'}
        />

        <StatsCard
          title="Half-Day / Leave"
          value={stats.halfDay + stats.leave}
          icon={Clock}
          themeIndex={3}
          subtitle={`${stats.leave} On Leave · ${stats.halfDay} Half Day`}
          badge="Scheduled"
        />

        <StatsCard
          title="Attendance Rate"
          value={`${stats.rate}%`}
          icon={TrendingUp}
          themeIndex={1}
          subtitle="Faculty attendance benchmark"
          badge="Target > 92%"
        />
      </div>

      {/* TABS SEGMENTED HEADER (Exact Test Master Pro Architecture) */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200/90 w-full sm:w-fit overflow-x-auto shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveTab('mark')}
          className={cn(
            'flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs font-black rounded-xl transition-all duration-200 shrink-0 cursor-pointer',
            activeTab === 'mark'
              ? 'bg-white text-emerald-700 shadow-xs border border-emerald-100'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 font-bold'
          )}
        >
          <UserCheck className="h-4 w-4 text-emerald-600" />
          <span>Mark Attendance</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('reports')}
          className={cn(
            'flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs font-black rounded-xl transition-all duration-200 shrink-0 cursor-pointer',
            activeTab === 'reports'
              ? 'bg-white text-indigo-700 shadow-xs border border-indigo-100'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 font-bold'
          )}
        >
          <Calendar className="h-4 w-4 text-indigo-600" />
          <span>Attendance Matrix & Reports</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('analytics')}
          className={cn(
            'flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs font-black rounded-xl transition-all duration-200 shrink-0 cursor-pointer',
            activeTab === 'analytics'
              ? 'bg-white text-violet-700 shadow-xs border border-violet-100'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 font-bold'
          )}
        >
          <TrendingUp className="h-4 w-4 text-violet-600" />
          <span>Staff Analytics & Calendar</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('manage')}
          className={cn(
            'flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs font-black rounded-xl transition-all duration-200 shrink-0 cursor-pointer',
            activeTab === 'manage'
              ? 'bg-white text-blue-700 shadow-xs border border-blue-100'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 font-bold'
          )}
        >
          <ShieldCheck className="h-4 w-4 text-blue-600" />
          <span>Staff Roster & Shifts</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: MARK ATTENDANCE                                                   */}
      {/* ========================================================================= */}
      {activeTab === 'mark' && (
        <div className="space-y-3.5">
          {/* Controls Bar: Date Selector, Department Tabs, Quick Bulk Buttons */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Date Picker */}
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 shadow-2xs">
                  <CalendarDays className="w-4 h-4 text-indigo-600" />
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Date:</span>
                  <input
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    disabled={isAttender}
                    className="bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer"
                  />
                </div>

                {/* Quick Search */}
                <div className="relative min-w-[220px]">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={markSearchQuery}
                    onChange={(e) => setMarkSearchQuery(e.target.value)}
                    placeholder="Search name, code, designation..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50/50 focus:bg-white focus:border-indigo-400 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Bulk Quick Actions */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleBulkMark('Present')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Mark All Present</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleBulkMark('Absent')}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100/80 border border-rose-200 text-rose-800 text-xs font-bold shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Mark All Absent</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveAttendance}
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer ml-auto sm:ml-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Save Attendance</span>
                </button>
              </div>
            </div>

            {/* Department Filter Pills */}
            <div className="flex items-center gap-1.5 border-t border-slate-100 pt-3 overflow-x-auto">
              <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mr-1">Department:</span>
              {DEPARTMENTS.map(dept => (
                <button
                  key={dept}
                  type="button"
                  onClick={() => setSelectedDept(dept)}
                  className={cn(
                    'px-3 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer',
                    selectedDept === dept
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  )}
                >
                  {dept === 'ALL' ? 'All Staff' : dept}
                </button>
              ))}
            </div>
          </div>

          {/* Staff Roster Marking Table */}
          <ErpSection
            title={`Daily Staff Roster (${filteredMarkRoster.length} Members)`}
            icon={UserCheck}
            tone="green"
            action={
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <span className="text-emerald-700 font-bold font-mono">{stats.present} P</span>
                <span>•</span>
                <span className="text-rose-700 font-bold font-mono">{stats.absent} A</span>
                <span>•</span>
                <span className="text-amber-700 font-bold font-mono">{stats.halfDay} HD</span>
                <span>•</span>
                <span className="text-blue-700 font-bold font-mono">{stats.leave} L</span>
              </div>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px] bg-slate-50/60">
                    <th className="py-2.5 px-3">Emp Code</th>
                    <th className="py-2.5 px-3">Faculty / Staff Member</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3">Shift Timing</th>
                    <th className="py-2.5 px-3 text-center">In-Time</th>
                    <th className="py-2.5 px-3 text-center">Out-Time</th>
                    <th className="py-2.5 px-3 text-center">Attendance Status</th>
                    <th className="py-2.5 px-3">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredMarkRoster.map((staff) => {
                    const isPresent = staff.status === 'Present';
                    const isAbsent = staff.status === 'Absent';
                    const isHalfDay = staff.status === 'Half-Day';
                    const isLeave = staff.status === 'Leave';

                    return (
                      <tr key={staff.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Code */}
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                          #{staff.code}
                        </td>

                        {/* Name & Avatar */}
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-blue-50 border border-indigo-200 flex items-center justify-center font-bold text-indigo-700 text-xs shrink-0">
                              {staff.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 leading-tight">{staff.name}</p>
                              <p className="text-[10.5px] text-slate-500">{staff.designation}</p>
                            </div>
                          </div>
                        </td>

                        {/* Department */}
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 border border-slate-200 text-slate-700">
                            {staff.department}
                          </span>
                        </td>

                        {/* Shift */}
                        <td className="py-2.5 px-3 text-slate-600 text-[11px]">
                          {staff.shift}
                        </td>

                        {/* In-Time Input */}
                        <td className="py-2.5 px-3 text-center">
                          <input
                            type="time"
                            value={staff.inTime === '-' ? '' : staff.inTime}
                            onChange={(e) => {
                              const val = e.target.value || '-';
                              setStaffRoster(prev => prev.map(s => s.id === staff.id ? { ...s, inTime: val } : s));
                            }}
                            disabled={isAbsent}
                            className="w-20 px-1.5 py-0.5 text-center rounded border border-slate-200 bg-white text-xs font-mono disabled:bg-slate-100 disabled:text-slate-400 outline-none"
                          />
                        </td>

                        {/* Out-Time Input */}
                        <td className="py-2.5 px-3 text-center">
                          <input
                            type="time"
                            value={staff.outTime === '-' ? '' : staff.outTime}
                            onChange={(e) => {
                              const val = e.target.value || '-';
                              setStaffRoster(prev => prev.map(s => s.id === staff.id ? { ...s, outTime: val } : s));
                            }}
                            disabled={isAbsent}
                            className="w-20 px-1.5 py-0.5 text-center rounded border border-slate-200 bg-white text-xs font-mono disabled:bg-slate-100 disabled:text-slate-400 outline-none"
                          />
                        </td>

                        {/* Status Action Buttons */}
                        <td className="py-2.5 px-3 text-center">
                          <div className="inline-flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg border border-slate-200 shadow-2xs">
                            <button
                              type="button"
                              onClick={() => handleStatusChange(staff.id, 'Present')}
                              title="Present"
                              className={cn(
                                'px-2 py-1 text-[11px] font-black rounded-md transition-all cursor-pointer',
                                isPresent
                                  ? 'bg-emerald-600 text-white shadow-2xs'
                                  : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
                              )}
                            >
                              P
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(staff.id, 'Absent')}
                              title="Absent"
                              className={cn(
                                'px-2 py-1 text-[11px] font-black rounded-md transition-all cursor-pointer',
                                isAbsent
                                  ? 'bg-rose-600 text-white shadow-2xs'
                                  : 'text-slate-600 hover:text-rose-700 hover:bg-rose-50'
                              )}
                            >
                              A
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(staff.id, 'Half-Day')}
                              title="Half-Day"
                              className={cn(
                                'px-2 py-1 text-[11px] font-black rounded-md transition-all cursor-pointer',
                                isHalfDay
                                  ? 'bg-amber-500 text-white shadow-2xs'
                                  : 'text-slate-600 hover:text-amber-700 hover:bg-amber-50'
                              )}
                            >
                              HD
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(staff.id, 'Leave')}
                              title="Approved Leave"
                              className={cn(
                                'px-2 py-1 text-[11px] font-black rounded-md transition-all cursor-pointer',
                                isLeave
                                  ? 'bg-blue-600 text-white shadow-2xs'
                                  : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50'
                              )}
                            >
                              L
                            </button>
                          </div>
                        </td>

                        {/* Remarks */}
                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            value={staff.remarks || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setStaffRoster(prev => prev.map(s => s.id === staff.id ? { ...s, remarks: val } : s));
                            }}
                            placeholder="Add note..."
                            className="w-full px-2 py-1 text-[11px] rounded border border-slate-200 bg-white placeholder:text-slate-300 outline-none focus:border-indigo-400"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </ErpSection>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: REPORTS & MATRIX REGISTER                                          */}
      {/* ========================================================================= */}
      {activeTab === 'reports' && (
        <div className="space-y-3.5">
          {/* Preset Buttons & Filters */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              {/* Presets */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => applyReportPreset('today')}
                  className={cn(
                    'px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer',
                    reportDatePreset === 'today' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  )}
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => applyReportPreset('week')}
                  className={cn(
                    'px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer',
                    reportDatePreset === 'week' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  )}
                >
                  Last 7 Days
                </button>
                <button
                  type="button"
                  onClick={() => applyReportPreset('month')}
                  className={cn(
                    'px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer',
                    reportDatePreset === 'month' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  )}
                >
                  This Month
                </button>
                <button
                  type="button"
                  onClick={() => applyReportPreset('30days')}
                  className={cn(
                    'px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer',
                    reportDatePreset === '30days' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  )}
                >
                  Last 30 Days
                </button>
              </div>

              {/* Export Button */}
              <button
                type="button"
                onClick={handleExportMatrixCSV}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Matrix CSV</span>
              </button>
            </div>

            {/* Custom Dates & Department */}
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
                <span>From:</span>
                <input
                  type="date"
                  value={reportStartDate}
                  onChange={(e) => {
                    setReportStartDate(e.target.value);
                    setReportDatePreset('custom');
                  }}
                  className="px-2 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 font-mono text-xs outline-none"
                />
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
                <span>To:</span>
                <input
                  type="date"
                  value={reportEndDate}
                  onChange={(e) => {
                    setReportEndDate(e.target.value);
                    setReportDatePreset('custom');
                  }}
                  className="px-2 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 font-mono text-xs outline-none"
                />
              </div>

              <div className="flex items-center gap-1.5 ml-auto">
                <span className="text-xs text-slate-500 font-semibold">Department:</span>
                <select
                  value={reportDeptFilter}
                  onChange={(e) => setReportDeptFilter(e.target.value)}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 outline-none"
                >
                  {DEPARTMENTS.map(d => (
                    <option key={d} value={d}>{d === 'ALL' ? 'All Departments' : d}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Matrix Register View */}
          <ErpSection
            title={`Staff Attendance Matrix (${reportStartDate} to ${reportEndDate})`}
            icon={Calendar}
            tone="indigo"
          >
            <div className="overflow-x-auto pb-2">
              <table className="w-full text-left text-[11px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-2 px-2.5 sticky left-0 bg-slate-50 z-10">Code</th>
                    <th className="py-2 px-3 sticky left-[60px] bg-slate-50 z-10 min-w-[140px]">Staff Name</th>
                    {reportDates.map(dateStr => {
                      const dObj = new Date(dateStr);
                      const isSun = dObj.getDay() === 0;
                      return (
                        <th
                          key={dateStr}
                          className={cn(
                            'py-2 px-1 text-center min-w-[32px]',
                            isSun ? 'text-rose-500 bg-rose-50/50' : 'text-slate-600'
                          )}
                          title={dateStr}
                        >
                          <span className="block text-[9px] font-medium">{dObj.toLocaleDateString('en-US', { weekday: 'narrow' })}</span>
                          <span>{dObj.getDate()}</span>
                        </th>
                      );
                    })}
                    <th className="py-2 px-2 text-center text-emerald-700 bg-emerald-50/50">P</th>
                    <th className="py-2 px-2 text-center text-rose-700 bg-rose-50/50">A</th>
                    <th className="py-2 px-2 text-center font-bold">Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {staffRoster
                    .filter(s => reportDeptFilter === 'ALL' || s.department === reportDeptFilter)
                    .map(staff => {
                      let pCount = 0;
                      let aCount = 0;

                      return (
                        <tr key={staff.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2 px-2.5 font-mono font-bold text-slate-900 sticky left-0 bg-white z-10">
                            #{staff.code}
                          </td>
                          <td className="py-2 px-3 sticky left-[60px] bg-white z-10">
                            <p className="font-bold text-slate-900 truncate" title={staff.name}>{staff.name}</p>
                            <p className="text-[10px] text-slate-400 truncate">{staff.designation}</p>
                          </td>
                          {reportDates.map(dateStr => {
                            const isSun = new Date(dateStr).getDay() === 0;
                            if (isSun) {
                              return (
                                <td key={dateStr} className="py-2 px-1 text-center bg-rose-50/20 text-rose-400 text-[10px] font-bold">
                                  OFF
                                </td>
                              );
                            }

                            // Deterministic status mock
                            const seed = (parseInt(staff.code, 10) * 5 + new Date(dateStr).getDate()) % 20;
                            let status = 'P';
                            if (seed === 1) { status = 'A'; aCount++; }
                            else if (seed === 2) { status = 'L'; }
                            else { pCount++; }

                            return (
                              <td key={dateStr} className="py-2 px-1 text-center">
                                <span
                                  className={cn(
                                    'inline-flex items-center justify-center w-5 h-5 rounded font-black text-[10px]',
                                    status === 'P' && 'bg-emerald-100 text-emerald-800',
                                    status === 'A' && 'bg-rose-100 text-rose-800',
                                    status === 'L' && 'bg-blue-100 text-blue-800'
                                  )}
                                >
                                  {status}
                                </span>
                              </td>
                            );
                          })}
                          <td className="py-2 px-2 text-center font-bold text-emerald-700 font-mono bg-emerald-50/30">
                            {pCount}
                          </td>
                          <td className="py-2 px-2 text-center font-bold text-rose-700 font-mono bg-rose-50/30">
                            {aCount}
                          </td>
                          <td className="py-2 px-2 text-center font-bold font-mono text-slate-900">
                            {((pCount / (pCount + aCount || 1)) * 100).toFixed(0)}%
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </ErpSection>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: STAFF ANALYTICS & MONTHLY CALENDAR                                 */}
      {/* ========================================================================= */}
      {activeTab === 'analytics' && (
        <div className="space-y-3.5">
          {/* Staff Selector Bar */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-700 font-black text-sm flex items-center justify-center border border-violet-200 shrink-0">
                {selectedStaff.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">{selectedStaff.name}</h3>
                  <span className="text-[10.5px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
                    #{selectedStaff.code}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {selectedStaff.designation} &bull; {selectedStaff.department}
                </p>
              </div>
            </div>

            {/* Selector Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-semibold">Select Member:</span>
              <select
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 outline-none cursor-pointer focus:border-violet-400"
              >
                {staffRoster.map(s => (
                  <option key={s.id} value={s.id}>
                    #{s.code} - {s.name} ({s.designation})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Member KPI Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
            <StatsCard
              title="Monthly Rate"
              value={`${staffMonthlyAnalytics.summary.overallRate}%`}
              icon={TrendingUp}
              themeIndex={1}
              subtitle="Current Month Performance"
            />
            <StatsCard
              title="Present Days"
              value={staffMonthlyAnalytics.summary.presentDays}
              icon={UserCheck}
              themeIndex={2}
              subtitle={`Out of ${staffMonthlyAnalytics.summary.workingDays} working days`}
            />
            <StatsCard
              title="Absent Days"
              value={staffMonthlyAnalytics.summary.absentDays}
              icon={UserX}
              themeIndex={5}
              subtitle="Unapproved absences"
            />
            <StatsCard
              title="Leaves & Half Days"
              value={staffMonthlyAnalytics.summary.leaveDays + staffMonthlyAnalytics.summary.halfDays}
              icon={Clock}
              themeIndex={3}
              subtitle={`${staffMonthlyAnalytics.summary.leaveDays} Leaves · ${staffMonthlyAnalytics.summary.halfDays} Half Days`}
            />
          </div>

          {/* Calendar Grid & Trend Visual */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
            {/* Interactive Monthly Calendar (2 Columns) */}
            <div className="lg:col-span-2">
              <ErpSection
                title={`Monthly Attendance Calendar - ${analyticsMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`}
                icon={CalendarDays}
                tone="purple"
                action={
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        const d = new Date(analyticsMonth);
                        d.setMonth(d.getMonth() - 1);
                        setAnalyticsMonth(d);
                      }}
                      className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
                      title="Previous Month"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const d = new Date(analyticsMonth);
                        d.setMonth(d.getMonth() + 1);
                        setAnalyticsMonth(d);
                      }}
                      className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
                      title="Next Month"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                }
              >
                <div>
                  {/* Day Names */}
                  <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-bold text-slate-400 mb-2">
                    <span className="text-rose-500">SUN</span>
                    <span>MON</span>
                    <span>TUE</span>
                    <span>WED</span>
                    <span>THU</span>
                    <span>FRI</span>
                    <span>SAT</span>
                  </div>

                  {/* Days Grid */}
                  <div className="grid grid-cols-7 gap-1.5">
                    {calendarCells.map((cell, idx) => {
                      if (!cell) {
                        return <div key={`empty-${idx}`} className="h-14 rounded-xl bg-slate-50/40 border border-transparent"></div>;
                      }

                      const isSun = cell.isSunday;
                      const isPresent = cell.status === 'Present';
                      const isAbsent = cell.status === 'Absent';
                      const isHalf = cell.status === 'Half-Day';
                      const isLeave = cell.status === 'Leave';

                      return (
                        <div
                          key={cell.date}
                          className={cn(
                            'h-14 p-1.5 rounded-xl border flex flex-col justify-between transition-all group select-none shadow-2xs',
                            isSun && 'bg-rose-50/30 border-rose-100 text-rose-500',
                            isPresent && 'bg-emerald-50/60 border-emerald-200/80 text-emerald-950',
                            isAbsent && 'bg-rose-50/80 border-rose-200 text-rose-950',
                            isHalf && 'bg-amber-50/80 border-amber-200 text-amber-950',
                            isLeave && 'bg-blue-50/80 border-blue-200 text-blue-950'
                          )}
                          title={`${cell.date}: ${cell.status} (In: ${cell.inTime}, Out: ${cell.outTime})`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs">{cell.day}</span>
                            <span className="text-[10px]">
                              {isSun ? '🏖️' : isPresent ? '✓' : isAbsent ? '✕' : isHalf ? '½' : '📋'}
                            </span>
                          </div>
                          <div className="text-[9px] font-bold uppercase truncate">
                            {cell.status}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </ErpSection>
            </div>

            {/* Daily Trend Chart (1 Column) */}
            <ErpSection
              title="Daily Attendance Trend"
              icon={TrendingUp}
              tone="blue"
              className="flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>Cumulative Rate:</span>
                  <span className="font-bold text-blue-600 text-sm font-mono">
                    {staffMonthlyAnalytics.summary.overallRate}%
                  </span>
                </div>

                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={staffMonthlyAnalytics.trendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="staffRateGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="dayLabel" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <YAxis domain={[50, 100]} tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <RechartsTooltip
                        content={({ active, payload }) => {
                          if (!active || !payload?.length) return null;
                          return (
                            <div className="rounded-xl border border-slate-100 bg-white/95 px-3 py-1.5 shadow-xl text-xs">
                              <p className="font-bold text-slate-800">{payload[0].payload.dayLabel}</p>
                              <p className="text-indigo-600 font-black">{payload[0].value}% Attendance</p>
                              <p className="text-[10px] text-slate-500 font-semibold uppercase">{payload[0].payload.status}</p>
                            </div>
                          );
                        }}
                      />
                      <Area type="monotone" dataKey="rate" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#staffRateGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                  <div className="flex justify-between">
                    <span>Scheduled Shift:</span>
                    <strong className="text-slate-800">{selectedStaff.shift}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Contact Phone:</span>
                    <strong className="text-slate-800 font-mono">{selectedStaff.mobile}</strong>
                  </div>
                </div>
              </div>
            </ErpSection>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: STAFF ROSTER & SHIFTS                                              */}
      {/* ========================================================================= */}
      {activeTab === 'manage' && (
        <div className="space-y-3.5">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="relative min-w-[240px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={manageSearch}
                onChange={(e) => setManageSearch(e.target.value)}
                placeholder="Search staff, code, shift..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50/50 focus:bg-white focus:border-blue-400 outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-semibold">Department:</span>
              <select
                value={manageDeptFilter}
                onChange={(e) => setManageDeptFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 outline-none"
              >
                {DEPARTMENTS.map(d => (
                  <option key={d} value={d}>{d === 'ALL' ? 'All Departments' : d}</option>
                ))}
              </select>
            </div>
          </div>

          <ErpSection title="Staff Members & Shift Allocation" icon={ShieldCheck} tone="blue">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {staffRoster
                .filter(s => {
                  const matchD = manageDeptFilter === 'ALL' || s.department === manageDeptFilter;
                  const matchS = !manageSearch ||
                    s.name.toLowerCase().includes(manageSearch.toLowerCase()) ||
                    s.code.includes(manageSearch) ||
                    s.designation.toLowerCase().includes(manageSearch.toLowerCase());
                  return matchD && matchS;
                })
                .map(staff => (
                  <div
                    key={staff.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-xs transition-all flex flex-col justify-between gap-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-blue-700 text-xs shrink-0">
                          {staff.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-slate-900 text-xs leading-tight">{staff.name}</h4>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-bold">
                              #{staff.code}
                            </span>
                          </div>
                          <p className="text-[10.5px] text-slate-500 mt-0.5">{staff.designation}</p>
                        </div>
                      </div>
                      <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200/60">
                        {staff.department}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-100 space-y-1 text-[11px] text-slate-600">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Assigned Shift:</span>
                        <strong className="text-slate-800">{staff.shift}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Duty Timings:</span>
                        <span className="font-mono text-slate-700 font-bold">{staff.defaultIn} - {staff.defaultOut}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Phone:</span>
                        <span className="font-mono text-slate-700">{staff.mobile}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedStaffId(staff.id);
                          setActiveTab('analytics');
                        }}
                        className="flex-1 py-1 text-center rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] transition-colors cursor-pointer"
                      >
                        View Analytics →
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </ErpSection>
        </div>
      )}
    </PageStack>
  );
}

export default StaffAttendancePage;
