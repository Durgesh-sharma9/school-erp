import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Calendar,
  CalendarDays,
  Settings,
  Users,
  Search,
  Lock,
  Unlock,
  Eye,
  Edit3,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  RefreshCw,
  X,
  FileSpreadsheet,
  Check,
  Award,
  Sparkles,
  HelpCircle,
  Copy,
  Trash2,
  Play
} from 'lucide-react';
import toast from 'react-hot-toast';
import { salaryStorage, calculateSalaryDetails } from './salaryStore';

const getDeptEmoji = (name) => {
  if (!name) return '🏫';
  const n = name.toLowerCase();
  if (n.includes('admin')) return '📘';
  if (n.includes('science') || n.includes('physic') || n.includes('chem') || n.includes('bio')) return '🔬';
  if (n.includes('computer') || n.includes('it') || n.includes('tech')) return '💻';
  if (n.includes('english')) return '📚';
  if (n.includes('math')) return '📐';
  if (n.includes('hindi')) return '✍️';
  if (n.includes('reception')) return '🛎️';
  if (n.includes('security')) return '🛡️';
  if (n.includes('sport') || n.includes('pe')) return '⚽';
  if (n.includes('accounts') || n.includes('finance')) return '💰';
  if (n.includes('library')) return '📖';
  if (n.includes('transport') || n.includes('driver')) return '🚌';
  return '🏫';
};

const MONTHS = [
  { value: 0, label: 'January' },
  { value: 1, label: 'February' },
  { value: 2, label: 'March' },
  { value: 3, label: 'April' },
  { value: 4, label: 'May' },
  { value: 5, label: 'June' },
  { value: 6, label: 'July' },
  { value: 7, label: 'August' },
  { value: 8, label: 'September' },
  { value: 9, label: 'October' },
  { value: 10, label: 'November' },
  { value: 11, label: 'December' }
];

const YEARS = [2024, 2025, 2026, 2027, 2028];

export function SalaryAttendancePage({ onNavigate }) {
  // State: Month & Year (Default to November 2026)
  const [selectedMonth, setSelectedMonth] = useState(10); // 0-indexed: 10 = November
  const [selectedYear, setSelectedYear] = useState(2026);
  const [deptFilter, setDeptFilter] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [searchVal, setSearchVal] = useState('');

  // Month key string
  const monthKey = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;

  // Data states
  const [records, setRecords] = useState(() => salaryStorage.getMonthlyAttendance(monthKey));
  const [monthlyConfig, setMonthlyConfig] = useState(() => salaryStorage.getMonthlyConfig(monthKey));
  const [collapsedDepts, setCollapsedDepts] = useState({});

  // Modals
  const [editRecord, setEditRecord] = useState(null);
  const [viewRecord, setViewRecord] = useState(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [leaveSummaryOpen, setLeaveSummaryOpen] = useState(false);

  // Edit Modal Form State
  const [editForm, setEditForm] = useState({
    paidLeaveDays: 0,
    unpaidLeaveDays: 0,
    halfDays: 0,
    overtimeHours: 0,
    remarks: ''
  });

  // Calendar Modal State
  const [calendarDays, setCalendarDays] = useState([]);
  const [weeklyOffPattern, setWeeklyOffPattern] = useState('SunOnly');
  const [selectedDays, setSelectedDays] = useState([]);

  // Load records whenever month/year changes
  useEffect(() => {
    const loadedRecords = salaryStorage.getMonthlyAttendance(monthKey);
    const loadedConfig = salaryStorage.getMonthlyConfig(monthKey);
    setRecords(loadedRecords);
    setMonthlyConfig(loadedConfig);
  }, [monthKey]);

  // Listen for storage events
  useEffect(() => {
    const handleUpdate = () => {
      setRecords(salaryStorage.getMonthlyAttendance(monthKey));
      setMonthlyConfig(salaryStorage.getMonthlyConfig(monthKey));
    };
    window.addEventListener('school_erp_salary_attendance_updated', handleUpdate);
    window.addEventListener('school_erp_monthly_config_updated', handleUpdate);
    return () => {
      window.removeEventListener('school_erp_salary_attendance_updated', handleUpdate);
      window.removeEventListener('school_erp_monthly_config_updated', handleUpdate);
    };
  }, [monthKey]);

  // Debounced search
  const searchDebounceRef = useRef(null);
  const handleSearchChange = (val) => {
    setSearchInput(val);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      setSearchVal(val.toLowerCase());
    }, 300);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSelectedMonth(10);
    setSelectedYear(2026);
    setDeptFilter('');
    setSearchInput('');
    setSearchVal('');
    toast.success('Filters reset to default (November 2026)');
  };

  // Department collapse toggle
  const toggleDeptCollapse = (deptName) => {
    setCollapsedDepts((prev) => ({
      ...prev,
      [deptName]: !prev[deptName]
    }));
  };

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const s = r.staffId || {};
      const matchDept = !deptFilter || s.department === deptFilter;
      const matchSearch =
        !searchVal ||
        s.name?.toLowerCase().includes(searchVal) ||
        s.code?.toLowerCase().includes(searchVal) ||
        s.designation?.toLowerCase().includes(searchVal);
      return matchDept && matchSearch;
    });
  }, [records, deptFilter, searchVal]);

  // Group records by Department
  const grouped = useMemo(() => {
    const map = {};
    filteredRecords.forEach((row) => {
      const deptName = row.staffId?.department || 'Administration';
      if (!map[deptName]) {
        map[deptName] = [];
      }
      map[deptName].push(row);
    });
    return map;
  }, [filteredRecords]);

  // Sorted department names
  const sortedDeptNames = useMemo(() => {
    return Object.keys(grouped).sort((a, b) => {
      if (a === 'Administration') return -1;
      if (b === 'Administration') return 1;
      return a.localeCompare(b);
    });
  }, [grouped]);

  // Available departments for dropdown
  const allDepartments = useMemo(() => {
    const set = new Set(records.map((r) => r.staffId?.department).filter(Boolean));
    return Array.from(set).sort();
  }, [records]);

  // Check if month payroll is already disbursed
  const isMonthDisbursed = useMemo(() => {
    const monthRecs = salaryStorage.getMonthlyRecords(monthKey);
    return monthRecs.length > 0 && monthRecs.every((r) => r.status === 'Paid');
  }, [monthKey, records]);

  // Lock Toggle
  const handleLockToggle = (record) => {
    if (isMonthDisbursed) {
      toast.error('Attendance is permanently locked for disbursed payroll months!');
      return;
    }
    const isCurrentlyLocked = record.isLocked;
    salaryStorage.toggleAttendanceLock(monthKey, record._id);
    toast.success(
      `${record.staffId?.name} attendance ${isCurrentlyLocked ? 'unlocked' : 'locked'} successfully!`
    );
  };

  // Open Edit Modal
  const openEditModal = (record) => {
    if (isMonthDisbursed) {
      toast.error('Attendance is locked because payroll for this month has already been disbursed!');
      return;
    }
    setEditRecord(record);
    setEditForm({
      paidLeaveDays: record.paidLeaveDays || 0,
      unpaidLeaveDays: record.unpaidLeaveDays || 0,
      halfDays: record.halfDays || 0,
      overtimeHours: record.overtimeHours || 0,
      remarks: record.remarks || ''
    });
  };

  // Live Payroll Preview in Edit Modal
  const editWorkingDays = editRecord?.workingDays || monthlyConfig?.workingDays || 23;
  const editGrossSalary = editRecord?.staffId?.grossSalary || 30000;

  const editCalc = useMemo(() => {
    return calculateSalaryDetails({
      grossSalary: editGrossSalary,
      configuredWorkingDays: editWorkingDays,
      lopDays: Number(editForm.unpaidLeaveDays) || 0,
      halfDays: Number(editForm.halfDays) || 0,
      overtimeHours: Number(editForm.overtimeHours) || 0,
      month: selectedMonth,
      year: selectedYear
    });
  }, [editGrossSalary, editWorkingDays, editForm, selectedMonth, selectedYear]);

  const editFinalPayable = Math.max(
    0,
    editGrossSalary - editCalc.unpaidLeaveDeduction + editCalc.overtimePay
  );
  const editSalaryImpact = -editCalc.unpaidLeaveDeduction + editCalc.overtimePay;

  // Handle Edit Save
  const handleEditSave = (e) => {
    e.preventDefault();
    if (!editRecord) return;
    if (isMonthDisbursed) {
      toast.error('Cannot edit attendance for a disbursed month!');
      return;
    }

    salaryStorage.updateStaffAttendance(monthKey, editRecord._id, {
      paidLeaveDays: Number(editForm.paidLeaveDays) || 0,
      unpaidLeaveDays: Number(editForm.unpaidLeaveDays) || 0,
      halfDays: Number(editForm.halfDays) || 0,
      overtimeHours: Number(editForm.overtimeHours) || 0,
      remarks: editForm.remarks
    });

    // Reactive sync: recalculate monthly salary records so processing updates immediately
    salaryStorage.recalculateMonthRecords(monthKey);

    toast.success(`Updated attendance for ${editRecord.staffId?.name}!`);
    setEditRecord(null);
  };

  // Open Working Calendar Modal
  const openCalendarModal = () => {
    const config = salaryStorage.getMonthlyConfig(monthKey);
    setCalendarDays(config.days || []);
    setWeeklyOffPattern(config.weeklyOffPattern || 'SunOnly');
    setSelectedDays([]);
    setCalendarOpen(true);
  };

  // Calendar Day Toggle
  const handleDayClick = (dayNum) => {
    setCalendarDays((prev) =>
      prev.map((d) => {
        if (d.day === dayNum) {
          let nextStatus = 'Working';
          if (d.status === 'Working') nextStatus = 'WeeklyOff';
          else if (d.status === 'WeeklyOff') nextStatus = 'PublicHoliday';
          else if (d.status === 'PublicHoliday') nextStatus = 'Working';
          return { ...d, status: nextStatus };
        }
        return d;
      })
    );
  };

  // Select day checkbox
  const handleSelectDay = (e, dayNum) => {
    e.stopPropagation();
    if (selectedDays.includes(dayNum)) {
      setSelectedDays(selectedDays.filter((d) => d !== dayNum));
    } else {
      setSelectedDays([...selectedDays, dayNum]);
    }
  };

  // Bulk mark calendar days
  const handleBulkMark = (status) => {
    if (selectedDays.length === 0) {
      toast.error('Please select one or more days first using their checkbox');
      return;
    }
    setCalendarDays((prev) =>
      prev.map((d) => (selectedDays.includes(d.day) ? { ...d, status } : d))
    );
    setSelectedDays([]);
    toast.success(`Marked selected days as ${status}`);
  };

  // Pattern change
  const handlePatternChange = (pattern) => {
    setWeeklyOffPattern(pattern);
    if (pattern === 'Custom') return;

    const updated = calendarDays.map((d) => {
      const date = new Date(selectedYear, selectedMonth, d.day);
      const dayOfWeek = date.getDay(); // 0 = Sun, 6 = Sat
      let isOff = false;

      if (pattern === 'SatSun') {
        isOff = dayOfWeek === 0 || dayOfWeek === 6;
      } else if (pattern === 'SunOnly') {
        isOff = dayOfWeek === 0;
      } else if (pattern === 'SecondSat') {
        if (dayOfWeek === 0) isOff = true;
        if (dayOfWeek === 6) {
          const nthSat = Math.ceil(d.day / 7);
          if (nthSat === 2) isOff = true;
        }
      } else if (pattern === 'SecondFourthSat') {
        if (dayOfWeek === 0) isOff = true;
        if (dayOfWeek === 6) {
          const nthSat = Math.ceil(d.day / 7);
          if (nthSat === 2 || nthSat === 4) isOff = true;
        }
      }

      return {
        ...d,
        status: isOff ? 'WeeklyOff' : d.status === 'WeeklyOff' ? 'Working' : d.status
      };
    });
    setCalendarDays(updated);
    toast.success(`Applied pattern: ${pattern}`);
  };

  // Save Working Calendar
  const handleSaveCalendar = () => {
    if (isMonthDisbursed) {
      toast.error('Cannot modify calendar for a disbursed month!');
      return;
    }
    const workingDays = calendarDays.filter((d) => d.status === 'Working').length;
    const weeklyOffs = calendarDays.filter((d) => d.status === 'WeeklyOff').length;
    const publicHolidays = calendarDays.filter((d) => d.status === 'PublicHoliday').length;

    const newConfig = {
      workingDays,
      weeklyOffs,
      publicHolidays,
      weeklyOffPattern,
      days: calendarDays
    };

    salaryStorage.saveMonthlyConfig(monthKey, newConfig);

    // Update all employee records with new working days
    const currentAttendance = salaryStorage.getMonthlyAttendance(monthKey);
    const updatedAttendance = currentAttendance.map((r) => {
      const presentDays = Math.max(
        0,
        workingDays - r.paidLeaveDays - r.unpaidLeaveDays - (r.halfDays || 0) * 0.5
      );
      const paidDays = workingDays - r.unpaidLeaveDays - (r.halfDays || 0) * 0.5;
      const calc = calculateSalaryDetails({
        grossSalary: r.staffId?.grossSalary || 30000,
        configuredWorkingDays: workingDays,
        lopDays: r.unpaidLeaveDays,
        halfDays: r.halfDays,
        overtimeHours: r.overtimeHours
      });
      return {
        ...r,
        workingDays,
        presentDays,
        paidDays,
        unpaidLeaveDeduction: Math.round(calc.unpaidLeaveDeduction * 100) / 100,
        dailyRate: Math.round(calc.dailyRate * 100) / 100
      };
    });

    salaryStorage.saveMonthlyAttendance(monthKey, updatedAttendance);
    // Reactive sync: recalculate monthly salary records with new working days
    salaryStorage.recalculateMonthRecords(monthKey);
    setMonthlyConfig(newConfig);
    setRecords(updatedAttendance);
    setCalendarOpen(false);
    toast.success(`Working calendar saved! Configured ${workingDays} working days applied.`);
  };

  return (
    <div className="space-y-4 p-4 md:p-6 bg-slate-50/50 min-h-screen">
      {/* Disbursed / Paid Immutability Alert */}
      {isMonthDisbursed && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-center justify-between text-amber-900 text-xs">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <div>
              <span className="font-extrabold">Attendance Immutability Guard Active:</span>
              <span className="ml-1 text-amber-800">
                Payroll for {MONTHS[selectedMonth]?.label} {selectedYear} has already been disbursed. Attendance records are locked to preserve accounting integrity.
              </span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-amber-200/60 font-bold text-[10px] text-amber-800">
            DISBURSED
          </span>
        </div>
      )}

      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl border border-slate-100 shadow-soft gap-4 transition-all duration-300 hover:shadow-md hover:border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-extrabold tracking-tight text-slate-800">
              Monthly Attendance Summary
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {MONTHS[selectedMonth]?.label} {selectedYear}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            Payroll-based attendance calculations with live loss-of-pay deductions
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setLeaveSummaryOpen(true)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-soft hover:shadow hover:-translate-y-0.5 active:translate-y-0 flex-1 sm:flex-initial"
          >
            <CalendarDays className="w-3.5 h-3.5" /> Leave Summary
          </button>
          <button
            onClick={openCalendarModal}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-soft hover:shadow hover:-translate-y-0.5 active:translate-y-0 flex-1 sm:flex-initial"
          >
            <Calendar className="w-3.5 h-3.5" /> Configure Working Calendar
          </button>
        </div>
      </div>

      {/* 2. Redesigned Compact Filter Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-soft flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Month selector */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              Month
            </span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
              className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 bg-white focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm"
            >
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* Year selector */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              Year
            </span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
              className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 bg-white focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              Dept
            </span>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 bg-white focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm"
            >
              <option value="">All Departments ({records.length})</option>
              {allDepartments.map((dept) => (
                <option key={dept} value={dept}>
                  {getDeptEmoji(dept)} {dept}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search input & Reset */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by staff name or ID..."
              className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 bg-white focus:outline-none focus:border-blue-500 shadow-sm"
            />
            {searchInput && (
              <button
                onClick={() => {
                  setSearchInput('');
                  setSearchVal('');
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm shrink-0"
            title="Reset all filters"
          >
            <RefreshCw className="w-3 h-3" /> Reset
          </button>
        </div>
      </div>

      {/* 3. Department-Grouped Accordions (1:1 with Screenshot) */}
      {sortedDeptNames.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-100 p-12 text-center shadow-soft">
          <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700">No staff attendance records found</h3>
          <p className="text-xs text-slate-400 mt-1">
            Try adjusting your search criteria or department filter.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedDeptNames.map((deptName) => {
            const deptRecords = grouped[deptName] || [];
            const isCollapsed = !!collapsedDepts[deptName];
            const totalEmployees = deptRecords.length;

            const totalPaidLeave = deptRecords.reduce((sum, r) => sum + (r.paidLeaveDays || 0), 0);
            const totalLOP = deptRecords.reduce(
              (sum, r) => sum + (r.unpaidLeaveDays || 0) + (r.halfDays || 0) * 0.5,
              0
            );
            const totalOT = deptRecords.reduce((sum, r) => sum + (r.overtimeHours || 0), 0);
            const totalDeduction = deptRecords.reduce(
              (sum, r) => sum + (r.unpaidLeaveDeduction || 0),
              0
            );
            const totalPresent = deptRecords.reduce((sum, r) => sum + (r.presentDays || 0), 0);
            const avgPresent = totalEmployees > 0 ? (totalPresent / totalEmployees).toFixed(1) : 0;
            const deptWorkingDays = deptRecords[0]?.workingDays || monthlyConfig?.workingDays || 23;

            return (
              <div
                key={deptName}
                className="bg-white rounded-xl border border-slate-100 shadow-soft overflow-hidden transition-all duration-300 hover:border-slate-200"
              >
                {/* Department Header Section */}
                <div
                  onClick={() => toggleDeptCollapse(deptName)}
                  className="p-3 bg-slate-50/50 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 cursor-pointer select-none hover:bg-slate-50 transition-colors"
                >
                  {/* Left side: Icon, Name, Count, Arrow */}
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{getDeptEmoji(deptName)}</span>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xs font-black text-slate-800 tracking-tight flex items-center gap-1.5">
                        {deptName}
                      </h2>
                      <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                        {totalEmployees} {totalEmployees === 1 ? 'Employee' : 'Employees'}
                      </span>
                    </div>
                    <span className="text-slate-400 text-[10px] ml-1">
                      {isCollapsed ? '▼' : '▲'}
                    </span>
                  </div>

                  {/* Right side: Quick summary chips */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-lg px-2.5 py-0.5 text-center shrink-0">
                      <span className="block text-[7px] uppercase tracking-wider font-extrabold text-emerald-600">
                        Working Days
                      </span>
                      <span className="block text-[11px] font-black leading-none mt-0.5">
                        {deptWorkingDays}
                      </span>
                    </div>
                    <div className="bg-amber-50 text-amber-800 border border-amber-100 rounded-lg px-2.5 py-0.5 text-center shrink-0">
                      <span className="block text-[7px] uppercase tracking-wider font-extrabold text-amber-600">
                        LOP Days
                      </span>
                      <span className="block text-[11px] font-black leading-none mt-0.5">
                        {totalLOP}
                      </span>
                    </div>
                    <div className="bg-rose-50 text-rose-800 border border-rose-100 rounded-lg px-2.5 py-0.5 text-center shrink-0">
                      <span className="block text-[7px] uppercase tracking-wider font-extrabold text-rose-600">
                        Deduction
                      </span>
                      <span className="block text-[11px] font-black leading-none mt-0.5">
                        ₹{totalDeduction.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Collapsible Content */}
                {!isCollapsed && (
                  <div className="p-3 space-y-3">
                    {/* 6-Card Detailed Department Metrics Panel */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                      <div className="bg-slate-50 border border-slate-100 rounded-lg p-1.5 text-center">
                        <span className="block text-[8px] font-extrabold text-slate-400 uppercase tracking-wider">
                          Total Employees
                        </span>
                        <span className="block text-xs font-black text-slate-800 mt-0.5">
                          {totalEmployees}
                        </span>
                      </div>
                      <div className="bg-blue-50 text-blue-800 border border-blue-100 rounded-lg p-1.5 text-center">
                        <span className="block text-[8px] font-extrabold text-blue-600 uppercase tracking-wider">
                          Paid Leave
                        </span>
                        <span className="block text-xs font-black mt-0.5">
                          {totalPaidLeave} Days
                        </span>
                      </div>
                      <div className="bg-amber-50 text-amber-800 border border-amber-100 rounded-lg p-1.5 text-center">
                        <span className="block text-[8px] font-extrabold text-amber-600 uppercase tracking-wider">
                          LOP Days
                        </span>
                        <span className="block text-xs font-black mt-0.5">{totalLOP} Days</span>
                      </div>
                      <div className="bg-purple-50 text-purple-800 border border-purple-100 rounded-lg p-1.5 text-center">
                        <span className="block text-[8px] font-extrabold text-purple-600 uppercase tracking-wider">
                          Overtime
                        </span>
                        <span className="block text-xs font-black mt-0.5">{totalOT} hrs</span>
                      </div>
                      <div className="bg-rose-50 text-rose-800 border border-rose-100 rounded-lg p-1.5 text-center">
                        <span className="block text-[8px] font-extrabold text-rose-600 uppercase tracking-wider">
                          Salary Deduction
                        </span>
                        <span className="block text-xs font-black mt-0.5">
                          ₹{totalDeduction.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="bg-indigo-50 text-indigo-900 border border-indigo-100 rounded-lg p-1.5 text-center">
                        <span className="block text-[8px] font-extrabold text-indigo-600 uppercase tracking-wider">
                          Avg Present
                        </span>
                        <span className="block text-xs font-black mt-0.5">{avgPresent} Days</span>
                      </div>
                    </div>

                    {/* Employee Table */}
                    <div className="w-full overflow-x-auto rounded-lg border border-slate-100">
                      <table className="w-full text-left border-collapse table-auto min-w-[1000px]">
                        <thead className="bg-slate-50 border-b border-slate-150">
                          <tr>
                            <th className="pl-4 pr-3 py-2 text-[10px] font-extrabold tracking-wider text-slate-500 uppercase text-left">
                              Employee
                            </th>
                            <th className="px-3 py-2 text-[10px] font-extrabold tracking-wider text-slate-500 uppercase text-left">
                              Designation
                            </th>
                            <th className="px-3 py-2 text-[10px] font-extrabold tracking-wider text-slate-500 uppercase text-center">
                              Working Days
                            </th>
                            <th className="px-3 py-2 text-[10px] font-extrabold tracking-wider text-slate-500 uppercase text-center">
                              Paid Days
                            </th>
                            <th className="px-3 py-2 text-[10px] font-extrabold tracking-wider text-slate-500 uppercase text-center">
                              Paid Leave
                            </th>
                            <th className="px-3 py-2 text-[10px] font-extrabold tracking-wider text-slate-500 uppercase text-center">
                              LOP Days
                            </th>
                            <th className="px-3 py-2 text-[10px] font-extrabold tracking-wider text-slate-500 uppercase text-center">
                              Present Days
                            </th>
                            <th className="px-3 py-2 text-[10px] font-extrabold tracking-wider text-slate-500 uppercase text-center">
                              Overtime
                            </th>
                            <th className="px-3 py-2 text-[10px] font-extrabold tracking-wider text-slate-500 uppercase text-center">
                              Salary Deduction
                            </th>
                            <th className="pr-4 pl-3 py-2 text-[10px] font-extrabold tracking-wider text-slate-500 uppercase text-center">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {deptRecords.map((row) => {
                            const s = row.staffId || {};
                            const locked = row.isLocked;
                            const deduction = row.unpaidLeaveDeduction || 0;

                            return (
                              <tr
                                key={row._id}
                                className="even:bg-slate-50/20 hover:bg-slate-50/50 transition-colors"
                              >
                                {/* Employee Details Cell */}
                                <td className="pl-4 pr-3 py-2 text-left">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-black text-xs text-slate-500 overflow-hidden shadow-inner border border-slate-200">
                                      {s.photo ? (
                                        <img
                                          src={s.photo}
                                          alt={s.name}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        s.name?.slice(0, 2).toUpperCase() || 'EM'
                                      )}
                                    </div>
                                    <div>
                                      <span className="font-extrabold text-slate-800 block text-xs leading-none">
                                        {s.name}
                                      </span>
                                      <span className="text-[9px] text-slate-400 font-bold block mt-1 uppercase tracking-wider">
                                        {s.code || s.employeeId}
                                      </span>
                                    </div>
                                  </div>
                                </td>

                                <td className="px-3 py-2 text-xs font-semibold text-slate-600">
                                  {s.designation || '--'}
                                </td>

                                {/* Working Days */}
                                <td className="px-3 py-2 text-center">
                                  <span className="inline-block text-[11px] font-bold text-emerald-800 bg-emerald-50 rounded-lg px-2.5 py-0.5 border border-emerald-100">
                                    {row.workingDays}
                                  </span>
                                </td>

                                {/* Paid Days */}
                                <td className="px-3 py-2 text-center">
                                  <span className="inline-block text-[11px] font-bold text-blue-800 bg-blue-50 rounded-lg px-2.5 py-0.5 border border-blue-100">
                                    {row.paidDays}
                                  </span>
                                </td>

                                {/* Paid Leave */}
                                <td className="px-3 py-2 text-center">
                                  <span className="inline-block text-[11px] font-bold text-amber-800 bg-amber-50 rounded-lg px-2.5 py-0.5 border border-amber-100">
                                    {row.paidLeaveDays}
                                  </span>
                                </td>

                                {/* LOP Days */}
                                <td className="px-3 py-2 text-center">
                                  <span className="inline-block text-[11px] font-bold text-rose-800 bg-rose-50 rounded-lg px-2.5 py-0.5 border border-rose-100">
                                    {row.unpaidLeaveDays}
                                  </span>
                                </td>

                                {/* Present Days */}
                                <td className="px-3 py-2 text-center">
                                  <span className="inline-block text-[11px] font-bold text-emerald-800 bg-emerald-50 rounded-lg px-2.5 py-0.5 border border-emerald-100">
                                    {row.presentDays}
                                  </span>
                                </td>

                                {/* Overtime */}
                                <td className="px-3 py-2 text-center">
                                  {row.overtimeHours > 0 ? (
                                    <span className="inline-block text-[11px] font-bold text-purple-800 bg-purple-50 rounded-lg px-2.5 py-0.5 border border-purple-100">
                                      {row.overtimeHours} hrs
                                    </span>
                                  ) : (
                                    <span className="text-slate-400 font-semibold text-xs">--</span>
                                  )}
                                </td>

                                {/* Salary Deduction */}
                                <td className="px-3 py-2 text-center">
                                  {deduction > 0 ? (
                                    <span className="inline-block text-[11px] font-extrabold text-rose-800 bg-rose-50 rounded-lg px-2.5 py-0.5 border border-rose-200">
                                      -₹{deduction.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                                    </span>
                                  ) : (
                                    <span className="inline-block text-[11px] font-extrabold text-emerald-800 bg-emerald-50 rounded-lg px-2.5 py-0.5 border border-emerald-200">
                                      ₹0
                                    </span>
                                  )}
                                </td>

                                {/* Actions */}
                                <td className="pr-4 pl-3 py-2 text-center">
                                  <div className="flex items-center justify-center gap-1.5">
                                    <button
                                      onClick={() => setViewRecord(row)}
                                      className="flex items-center gap-1 px-2 py-0.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer shadow-sm"
                                      title="View summary calculation details"
                                    >
                                      <Eye className="w-3 h-3 text-slate-500" /> View
                                    </button>

                                    <button
                                      onClick={() => openEditModal(row)}
                                      disabled={locked || isMonthDisbursed}
                                      className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer shadow-sm disabled:opacity-30 disabled:hover:bg-blue-50"
                                      title={isMonthDisbursed ? 'Locked: Month payroll already disbursed' : locked ? 'Record locked' : 'Edit summary correction variables'}
                                    >
                                      <Edit3 className="w-3 h-3 text-blue-500" /> Edit
                                    </button>

                                    <button
                                      onClick={() => handleLockToggle(row)}
                                      className={`p-1 border rounded-lg transition-all cursor-pointer ${
                                        locked
                                          ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
                                          : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                                      }`}
                                      title={locked ? 'Unlock record' : 'Lock record'}
                                    >
                                      {locked ? (
                                        <Lock className="w-3 h-3 text-rose-600" />
                                      ) : (
                                        <Unlock className="w-3 h-3" />
                                      )}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Bottom Standalone Pagination */}
      <div className="bg-white px-6 py-3 border border-slate-100 rounded-xl shadow-soft flex items-center justify-between">
        <span className="text-[11px] text-slate-500 font-bold">
          PAGE <span className="text-slate-800">1</span> OF <span className="text-slate-800">1</span> — TOTAL{' '}
          <span className="text-slate-800">{filteredRecords.length}</span> RECORDS
        </span>
        <div className="flex items-center gap-2">
          <button
            disabled
            className="p-1 border border-slate-200 bg-white rounded-lg text-slate-400 disabled:opacity-40 transition-all cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            disabled
            className="p-1 border border-slate-200 bg-white rounded-lg text-slate-400 disabled:opacity-40 transition-all cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* --- EDIT MONTHLY SUMMARY MODAL --- */}
      {editRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h2 className="text-sm font-extrabold text-slate-800">
                  Edit Monthly Summary - {editRecord.staffId?.name}
                </h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                  {editRecord.staffId?.code} — {editRecord.staffId?.designation}
                </p>
              </div>
              <button
                onClick={() => setEditRecord(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSave} className="space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-700">Monthly Calculations Details</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Month Working Days = {editWorkingDays} Days. Present Days will be recalculated
                    automatically as: workingDays - paidLeave - LOP - (halfDays × 0.5).
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {/* Form Fields Section */}
                <div className="md:col-span-3 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        Paid Leave Days
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max={editWorkingDays}
                        value={editForm.paidLeaveDays}
                        onChange={(e) =>
                          setEditForm({ ...editForm, paidLeaveDays: e.target.value })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        LOP Days (Unpaid Leave)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max={editWorkingDays}
                        value={editForm.unpaidLeaveDays}
                        onChange={(e) =>
                          setEditForm({ ...editForm, unpaidLeaveDays: e.target.value })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        Half Days
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={editWorkingDays}
                        value={editForm.halfDays}
                        onChange={(e) =>
                          setEditForm({ ...editForm, halfDays: e.target.value })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        Overtime Hours
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        value={editForm.overtimeHours}
                        onChange={(e) =>
                          setEditForm({ ...editForm, overtimeHours: e.target.value })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Remarks
                    </label>
                    <input
                      type="text"
                      value={editForm.remarks}
                      onChange={(e) =>
                        setEditForm({ ...editForm, remarks: e.target.value })
                      }
                      placeholder="Reason for adjustment / notes..."
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Live Payroll Preview Section */}
                <div className="md:col-span-2 bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-xs text-slate-800 border-b pb-1.5 mb-2.5">
                      Payroll Impact Preview
                    </h3>
                    <div className="space-y-2 text-xs font-bold">
                      <div className="flex justify-between items-center text-blue-600">
                        <span>Gross Monthly Salary</span>
                        <span>₹{Math.round(editGrossSalary).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-400 text-[10px] font-semibold">
                        <span>Calculation Method</span>
                        <span>Working Days ({editWorkingDays} days)</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-500">
                        <span>Daily Rate</span>
                        <span>₹{editCalc.dailyRate.toFixed(2)}</span>
                      </div>

                      <div className="border-t border-dashed border-slate-200 my-1"></div>

                      <div className="flex justify-between items-center text-slate-500">
                        <span>Paid Leave</span>
                        <span>{editForm.paidLeaveDays || 0} days (no deduction)</span>
                      </div>
                      <div className="flex justify-between items-center text-rose-600">
                        <span>LOP ({editForm.unpaidLeaveDays || 0} days)</span>
                        <span>-₹{editCalc.lopDeduction.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-rose-600">
                        <span>Half Days ({(editForm.halfDays || 0) * 0.5} day)</span>
                        <span>-₹{editCalc.halfDayDeduction.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-emerald-600">
                        <span>Overtime ({editForm.overtimeHours || 0} hrs)</span>
                        <span>+₹{editCalc.overtimePay.toFixed(2)}</span>
                      </div>

                      <div className="border-t border-dashed border-slate-200 my-1"></div>

                      <div className="flex justify-between items-center text-rose-700">
                        <span>Total LOP Deduction</span>
                        <span>-₹{editCalc.unpaidLeaveDeduction.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-emerald-700 text-sm font-extrabold">
                        <span>Final Payable Salary</span>
                        <span>₹{Math.round(editFinalPayable).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 p-2.5 rounded-lg text-center shadow-inner mt-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Salary Impact
                    </span>
                    <span
                      className={`text-sm font-black mt-1 block ${
                        editSalaryImpact < 0
                          ? 'text-rose-600'
                          : editSalaryImpact > 0
                          ? 'text-emerald-600'
                          : 'text-slate-500'
                      }`}
                    >
                      {editSalaryImpact < 0 ? '🔴' : editSalaryImpact > 0 ? '🟢' : '⚪'}{' '}
                      {editSalaryImpact >= 0 ? '+' : ''}₹{editSalaryImpact.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditRecord(null)}
                  className="px-4 py-2 border rounded-lg text-xs font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold cursor-pointer shadow-soft"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- VIEW DETAILS MODAL --- */}
      {viewRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-sm text-slate-600 border border-slate-200">
                  {viewRecord.staffId?.name?.slice(0, 2).toUpperCase() || 'EM'}
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-slate-800">
                    {viewRecord.staffId?.name}
                  </h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">
                    {viewRecord.staffId?.code} — {viewRecord.staffId?.designation}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewRecord(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Salary Calculation Summary */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3.5 space-y-2 text-xs">
              <p className="text-[10px] font-extrabold text-blue-700 uppercase tracking-wider mb-1">
                Salary Calculation Base
              </p>
              <div className="flex justify-between">
                <span className="text-slate-500">Gross Monthly Salary</span>
                <span className="font-extrabold text-slate-800">
                  ₹{Math.round(viewRecord.staffId?.grossSalary || 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Calculation Method</span>
                <span className="font-bold text-blue-700">Working Days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Configured Working Days</span>
                <span className="font-bold text-slate-700">{viewRecord.workingDays} days</span>
              </div>
              <div className="flex justify-between border-t border-blue-100 pt-1.5">
                <span className="text-slate-500">Daily Rate</span>
                <span className="font-extrabold text-blue-700">
                  ₹{viewRecord.dailyRate ? Number(viewRecord.dailyRate).toFixed(2) : '0.00'}
                </span>
              </div>
            </div>

            {/* Attendance Breakdown */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs p-1">
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="font-semibold text-slate-500">Paid Days</span>
                <span className="font-bold text-slate-800">{viewRecord.paidDays} days</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="font-semibold text-slate-500">Present Days</span>
                <span className="font-bold text-emerald-700">{viewRecord.presentDays} days</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="font-semibold text-slate-500">Paid Leave</span>
                <span className="font-bold text-blue-700">{viewRecord.paidLeaveDays} days</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="font-semibold text-slate-500">LOP Days</span>
                <span className="font-bold text-rose-600">{viewRecord.unpaidLeaveDays} days</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="font-semibold text-slate-500">Half Days</span>
                <span className="font-bold text-amber-700">{viewRecord.halfDays || 0}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="font-semibold text-slate-500">Overtime</span>
                <span className="font-bold text-purple-700">
                  {viewRecord.overtimeHours || 0} hrs
                </span>
              </div>
            </div>

            {/* Deductions & Final Amount */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs">
              <p className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider">
                Payroll Impact
              </p>
              <div className="flex justify-between">
                <span className="text-slate-500">Total LOP Deduction</span>
                <span className="font-extrabold text-rose-600">
                  -₹{Number(viewRecord.unpaidLeaveDeduction || 0).toLocaleString('en-IN', {
                    maximumFractionDigits: 2
                  })}
                </span>
              </div>
              {viewRecord.remarks && (
                <div className="bg-amber-50/60 p-2 rounded-lg border border-amber-100 text-[11px] mt-2">
                  <span className="font-bold text-amber-800">Remarks: </span>
                  <span className="text-slate-600">{viewRecord.remarks}</span>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewRecord(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- LEAVE SUMMARY MODAL --- */}
      {leaveSummaryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-4xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h2 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-emerald-600" />
                  Staff Annual Leave Summary &amp; Balance Register
                </h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                  Academic Session 2026-2027 • Approved Leave Quotas
                </p>
              </div>
              <button
                onClick={() => setLeaveSummaryOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quota Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-center">
                <span className="text-[10px] font-bold text-blue-600 uppercase">Casual Leave (CL)</span>
                <span className="block text-base font-black text-blue-900 mt-1">12 Days / yr</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
                <span className="text-[10px] font-bold text-emerald-600 uppercase">Sick Leave (SL)</span>
                <span className="block text-base font-black text-emerald-900 mt-1">10 Days / yr</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 text-center">
                <span className="text-[10px] font-bold text-amber-600 uppercase">Earned Leave (EL)</span>
                <span className="block text-base font-black text-amber-900 mt-1">15 Days / yr</span>
              </div>
              <div className="p-3 rounded-xl bg-purple-50 border border-purple-100 text-center">
                <span className="text-[10px] font-bold text-purple-600 uppercase">Special Leave</span>
                <span className="block text-base font-black text-purple-900 mt-1">On-Duty / Academic</span>
              </div>
            </div>

            {/* Staff Leaves Table */}
            <div className="w-full overflow-x-auto rounded-lg border border-slate-100">
              <table className="w-full text-left border-collapse table-auto text-xs">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="p-2.5 font-extrabold text-slate-600">Employee</th>
                    <th className="p-2.5 font-extrabold text-slate-600">Department</th>
                    <th className="p-2.5 font-extrabold text-slate-600 text-center">CL Balance</th>
                    <th className="p-2.5 font-extrabold text-slate-600 text-center">SL Balance</th>
                    <th className="p-2.5 font-extrabold text-slate-600 text-center">EL Balance</th>
                    <th className="p-2.5 font-extrabold text-slate-600 text-center">This Month Leaves</th>
                    <th className="p-2.5 font-extrabold text-slate-600 text-center">Total LOP (YTD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {records.slice(0, 15).map((row) => (
                    <tr key={row._id} className="hover:bg-slate-50/50">
                      <td className="p-2.5">
                        <span className="font-bold text-slate-800 block">{row.staffId?.name}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{row.staffId?.code}</span>
                      </td>
                      <td className="p-2.5 text-slate-600 font-medium">{row.staffId?.department}</td>
                      <td className="p-2.5 text-center font-bold text-blue-700">8 / 12</td>
                      <td className="p-2.5 text-center font-bold text-emerald-700">7 / 10</td>
                      <td className="p-2.5 text-center font-bold text-amber-700">11 / 15</td>
                      <td className="p-2.5 text-center font-extrabold text-slate-700">
                        {row.paidLeaveDays} Paid | {row.unpaidLeaveDays} LOP
                      </td>
                      <td className="p-2.5 text-center font-bold text-rose-600">
                        {row.unpaidLeaveDays} Days
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2 border-t">
              <button
                onClick={() => setLeaveSummaryOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- WORKING CALENDAR CONFIGURATION MODAL --- */}
      {calendarOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-3xl w-full p-6 space-y-4 max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h2 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  Configure Working Calendar — {MONTHS[selectedMonth]?.label} {selectedYear}
                </h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                  Click on any day cell to toggle: Working ➔ Weekly Off ➔ Public Holiday
                </p>
              </div>
              <button
                onClick={() => setCalendarOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Pattern preset & stats toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-slate-600">Weekly Off Pattern:</span>
                <select
                  value={weeklyOffPattern}
                  onChange={(e) => handlePatternChange(e.target.value)}
                  className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 bg-white"
                >
                  <option value="SunOnly">Sundays Only (5 Offs)</option>
                  <option value="SatSun">Saturdays &amp; Sundays</option>
                  <option value="SecondSat">2nd Saturday + Sundays</option>
                  <option value="SecondFourthSat">2nd &amp; 4th Saturday + Sundays</option>
                  <option value="Custom">Custom Selection</option>
                </select>
              </div>

              {/* Stats badges */}
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-extrabold text-[11px]">
                  Working: {calendarDays.filter((d) => d.status === 'Working').length}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 font-extrabold text-[11px]">
                  Weekly Offs: {calendarDays.filter((d) => d.status === 'WeeklyOff').length}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 font-extrabold text-[11px]">
                  Holidays: {calendarDays.filter((d) => d.status === 'PublicHoliday').length}
                </span>
              </div>
            </div>

            {/* Bulk actions if days are selected */}
            {selectedDays.length > 0 && (
              <div className="flex items-center justify-between bg-blue-50 border border-blue-200 p-2.5 rounded-xl text-xs">
                <span className="font-bold text-blue-800">
                  {selectedDays.length} day{selectedDays.length > 1 ? 's' : ''} selected:
                </span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleBulkMark('Working')}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold"
                  >
                    Mark Working
                  </button>
                  <button
                    onClick={() => handleBulkMark('WeeklyOff')}
                    className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-bold"
                  >
                    Mark Weekly Off
                  </button>
                  <button
                    onClick={() => handleBulkMark('PublicHoliday')}
                    className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[11px] font-bold"
                  >
                    Mark Holiday
                  </button>
                </div>
              </div>
            )}

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2 p-2 bg-white rounded-xl border border-slate-100">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <div
                  key={d}
                  className="text-center font-extrabold text-[11px] text-slate-400 uppercase py-1 border-b"
                >
                  {d}
                </div>
              ))}

              {calendarDays.map((d) => {
                const isSelected = selectedDays.includes(d.day);
                let bgStyle = 'bg-slate-50 border-slate-200 text-slate-800';
                let tag = 'Working';
                let tagColor = 'text-emerald-700 bg-emerald-100/70';

                if (d.status === 'WeeklyOff') {
                  bgStyle = 'bg-blue-50/70 border-blue-200 text-blue-900';
                  tag = 'Off';
                  tagColor = 'text-blue-700 bg-blue-100';
                } else if (d.status === 'PublicHoliday') {
                  bgStyle = 'bg-amber-50/70 border-amber-200 text-amber-900';
                  tag = 'Holiday';
                  tagColor = 'text-amber-800 bg-amber-100';
                }

                return (
                  <div
                    key={d.day}
                    onClick={() => handleDayClick(d.day)}
                    className={`relative p-2.5 rounded-xl border transition-all cursor-pointer select-none hover:shadow-md ${bgStyle} ${
                      isSelected ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-black">{d.day}</span>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleSelectDay(e, d.day)}
                        className="rounded cursor-pointer"
                      />
                    </div>
                    <span
                      className={`inline-block text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${tagColor}`}
                    >
                      {tag}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-between items-center pt-3 border-t">
              <button
                type="button"
                onClick={() => {
                  setCalendarDays(
                    calendarDays.map((d) => ({ ...d, status: 'Working' }))
                  );
                  setWeeklyOffPattern('Custom');
                  toast.success('Calendar cleared! All set to Working.');
                }}
                className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-bold"
              >
                Clear All
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCalendarOpen(false)}
                  className="px-4 py-2 border rounded-lg text-xs font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveCalendar}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-soft"
                >
                  Save Calendar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
