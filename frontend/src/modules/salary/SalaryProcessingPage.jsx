import React, { useState, useMemo, useEffect } from 'react';
import {
  Calculator,
  Landmark,
  IndianRupee,
  Plus,
  Check,
  X,
  ShieldCheck,
  Lock,
  Unlock,
  Eye,
  Edit3,
  Trash2,
  CreditCard,
  Calendar,
  Clock,
  AlertTriangle,
  Info,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Download,
  SlidersHorizontal,
  RefreshCw,
  Search,
  Building2,
  FileSpreadsheet,
  Coins,
  ArrowRightLeft,
  Users
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { salaryStorage, calculateStaffSalary, calculateSalaryDetails } from './salaryStore';

// Indian currency formatter
const formatINR = (val) => {
  const num = Math.round(Number(val) || 0);
  return '₹' + num.toLocaleString('en-IN');
};

const getDeptBadgeStyle = (dept) => {
  const d = (dept || '').toLowerCase();
  if (d.includes('admin')) return 'bg-blue-50 text-blue-700 border border-blue-200';
  if (d.includes('sci')) return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  if (d.includes('math')) return 'bg-indigo-50 text-indigo-700 border border-indigo-200';
  if (d.includes('eng')) return 'bg-amber-50 text-amber-700 border border-amber-200';
  if (d.includes('comp') || d.includes('tech')) return 'bg-purple-50 text-purple-700 border border-purple-200';
  if (d.includes('acc') || d.includes('fin')) return 'bg-teal-50 text-teal-700 border border-teal-200';
  return 'bg-slate-50 text-slate-700 border border-slate-200';
};

export function SalaryProcessingPage({ onNavigate }) {
  const { currentSchool } = useAuth();

  // Navigation tab: 'runs' | 'structures' | 'advances'
  const [activeTab, setActiveTab] = useState('runs');

  // Month & Year state (Default: November 2026)
  const [selectedMonth, setSelectedMonth] = useState('2026-11');
  const [records, setRecords] = useState(() => salaryStorage.getMonthlyRecords('2026-11'));
  const [advances, setAdvances] = useState(() => salaryStorage.getAdvances());
  const [monthlyConfig, setMonthlyConfig] = useState(() => salaryStorage.getMonthlyConfig('2026-11'));

  // Filter states
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedDepts, setCollapsedDepts] = useState({});

  // Modals state
  const [breakdownRecord, setBreakdownRecord] = useState(null);
  const [editAdjustmentRecord, setEditAdjustmentRecord] = useState(null);
  const [disburseModalOpen, setDisburseModalOpen] = useState(false);
  const [singleDisburseRecord, setSingleDisburseRecord] = useState(null);
  const [reopenModalOpen, setReopenModalOpen] = useState(false);
  const [reopenReason, setReopenReason] = useState('Attendance adjustments required');
  const [filtersDrawerOpen, setFiltersDrawerOpen] = useState(false);
  const [newAdvanceModalOpen, setNewAdvanceModalOpen] = useState(false);
  const [editStructureRecord, setEditStructureRecord] = useState(null);

  // Disburse Form
  const [disburseForm, setDisburseForm] = useState({
    payMethod: 'Bank Transfer',
    payDate: new Date().toISOString().slice(0, 10),
    payRef: 'NEFT-202611-BATCH01',
    payRemarks: 'November 2026 Monthly Staff Salary Disbursed'
  });

  // Edit Adjustment Form
  const [adjForm, setAdjForm] = useState({
    bonus: 0,
    overtimePay: 0,
    retroPay: 0,
    advanceRecovery: 0,
    tds: 0,
    otherDeductions: 0
  });

  // New Advance Form
  const [advForm, setAdvForm] = useState({
    staffId: '',
    amount: '',
    purpose: '',
    monthlyDeduction: ''
  });

  // Listen for storage updates
  useEffect(() => {
    const handleUpdate = () => {
      setRecords(salaryStorage.getMonthlyRecords(selectedMonth));
      setAdvances(salaryStorage.getAdvances());
      setMonthlyConfig(salaryStorage.getMonthlyConfig(selectedMonth));
    };
    window.addEventListener('school_salary_records_updated', handleUpdate);
    window.addEventListener('school_erp_salary_attendance_updated', handleUpdate);
    window.addEventListener('school_erp_salary_advances_updated', handleUpdate);
    window.addEventListener('school_erp_monthly_config_updated', handleUpdate);
    return () => {
      window.removeEventListener('school_salary_records_updated', handleUpdate);
      window.removeEventListener('school_erp_salary_attendance_updated', handleUpdate);
      window.removeEventListener('school_erp_salary_advances_updated', handleUpdate);
      window.removeEventListener('school_erp_monthly_config_updated', handleUpdate);
    };
  }, [selectedMonth]);

  // Handle Month Change
  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    const loaded = salaryStorage.getMonthlyRecords(month);
    setRecords(loaded);
    setMonthlyConfig(salaryStorage.getMonthlyConfig(month));
  };

  // Toggle Department Accordion Collapse
  const toggleDeptCollapse = (deptName) => {
    setCollapsedDepts((prev) => ({
      ...prev,
      [deptName]: !prev[deptName]
    }));
  };

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchDept = deptFilter === 'All' || r.department === deptFilter;
      const matchStatus = statusFilter === 'All' || r.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        r.name?.toLowerCase().includes(q) ||
        r.code?.toLowerCase().includes(q) ||
        r.designation?.toLowerCase().includes(q);
      return matchDept && matchStatus && matchQuery;
    });
  }, [records, deptFilter, statusFilter, searchQuery]);

  // Group by department
  const grouped = useMemo(() => {
    const map = {};
    filteredRecords.forEach((row) => {
      const deptName = row.department || 'Administration';
      if (!map[deptName]) {
        map[deptName] = [];
      }
      map[deptName].push(row);
    });
    return map;
  }, [filteredRecords]);

  // Sorted department list
  const sortedDeptNames = useMemo(() => {
    return Object.keys(grouped).sort((a, b) => {
      if (a === 'Administration') return -1;
      if (b === 'Administration') return 1;
      return a.localeCompare(b);
    });
  }, [grouped]);

  // Available unique departments
  const allDepartments = useMemo(() => {
    const set = new Set(records.map((r) => r.department).filter(Boolean));
    return Array.from(set).sort();
  }, [records]);

  // 6 Metric Summaries (Matching Screenshot Exactly)
  const totalGrossPayroll = records.reduce((sum, r) => sum + (r.grossSalary || 0), 0);
  const totalNetPayroll = records.reduce((sum, r) => sum + (r.netSalary || 0), 0);
  const totalDeductions = records.reduce((sum, r) => sum + (r.totalDeductions || 0), 0);
  const paidEmployeesCount = records.filter((r) => r.status === 'Paid' || r.status === 'Disbursed').length;
  const pendingPaymentsCount = records.length - paidEmployeesCount;
  const draftEmployeesCount = records.length;

  // Handle Bulk Disburse
  const handleConfirmDisburseAll = (e) => {
    e.preventDefault();

    // Pre-flight validation: check for missing bank details
    if (disburseForm.payMethod === 'Bank Transfer' || disburseForm.payMethod === 'NEFT' || disburseForm.payMethod === 'RTGS') {
      const missingBank = records.filter(r => (!r.accNo || r.accNo === '—' || !r.ifsc) && r.status !== 'Paid');
      if (missingBank.length > 0) {
        const proceed = window.confirm(
          `Pre-flight Notice: ${missingBank.length} employee(s) (e.g. ${missingBank[0]?.name}) have incomplete bank account details. Do you wish to continue disbursement via ${disburseForm.payMethod}?`
        );
        if (!proceed) return;
      }
    }

    const updated = salaryStorage.disburseAll(selectedMonth, disburseForm);
    setRecords(updated);
    // Mark admin approved as well
    salaryStorage.saveMonthlyConfig(selectedMonth, {
      ...monthlyConfig,
      adminApproved: true,
      accountantReviewed: true
    });
    setDisburseModalOpen(false);
    toast.success(`Successfully disbursed salaries for all ${records.length} staff members via ${disburseForm.payMethod}!`);
  };

  // Handle Single Disburse
  const handleConfirmSingleDisburse = (e) => {
    e.preventDefault();
    if (!singleDisburseRecord) return;

    if (disburseForm.payMethod === 'Bank Transfer' || disburseForm.payMethod === 'NEFT' || disburseForm.payMethod === 'RTGS') {
      if (!singleDisburseRecord.accNo || singleDisburseRecord.accNo === '—' || !singleDisburseRecord.ifsc) {
        const proceed = window.confirm(`Notice: ${singleDisburseRecord.name} does not have complete bank account details. Proceed with disbursement?`);
        if (!proceed) return;
      }
    }

    const updated = salaryStorage.disburseSingle(selectedMonth, singleDisburseRecord.id, disburseForm);
    setRecords(updated);
    setSingleDisburseRecord(null);
    toast.success(`Salary disbursed for ${singleDisburseRecord.name}!`);
  };

  // Handle Reopen
  const handleConfirmReopen = (e) => {
    e.preventDefault();
    const updated = salaryStorage.reopenPayroll(selectedMonth, { reason: reopenReason });
    setRecords(updated);
    setReopenModalOpen(false);
    toast.success(`Payroll reopened for adjustments. Status reset to Pending.`);
  };

  // Open Edit Adjustments Modal
  const openEditAdjustmentModal = (rec) => {
    setEditAdjustmentRecord(rec);
    setAdjForm({
      bonus: rec.bonus || 0,
      overtimePay: rec.overtimePay || 0,
      retroPay: rec.retroPay || 0,
      advanceRecovery: rec.advanceRecovery || 0,
      tds: rec.tds || 0,
      otherDeductions: rec.lopDeduction || 0
    });
  };

  // Save Edit Adjustment
  const handleSaveAdjustment = (e) => {
    e.preventDefault();
    if (!editAdjustmentRecord) return;

    const policies = salaryStorage.getPolicies();
    const calc = calculateStaffSalary(editAdjustmentRecord, policies, {
      grossSalary: editAdjustmentRecord.grossSalary,
      presentDays: editAdjustmentRecord.presentDays,
      totalDays: editAdjustmentRecord.totalDays,
      bonus: Number(adjForm.bonus) || 0,
      overtimePay: Number(adjForm.overtimePay) || 0,
      advanceRecovery: Number(adjForm.advanceRecovery) || 0,
      tds: Number(adjForm.tds) || 0,
      otherDeductions: Number(adjForm.otherDeductions) || 0
    });

    const updated = records.map((r) => {
      if (r.id === editAdjustmentRecord.id) {
        return {
          ...r,
          ...calc,
          bonus: Number(adjForm.bonus) || 0,
          overtimePay: Number(adjForm.overtimePay) || 0,
          retroPay: Number(adjForm.retroPay) || 0,
          advanceRecovery: Number(adjForm.advanceRecovery) || 0,
          tds: Number(adjForm.tds) || 0
        };
      }
      return r;
    });

    salaryStorage.saveMonthlyRecords(selectedMonth, updated);
    setRecords(updated);
    setEditAdjustmentRecord(null);
    toast.success(`Adjustments updated for ${editAdjustmentRecord.name}!`);
  };

  // Handle Add Advance
  const handleAddAdvance = (e) => {
    e.preventDefault();
    const targetStaff = records.find((r) => r.staffId === advForm.staffId || r.code === advForm.staffId);
    if (!targetStaff) {
      toast.error('Please select a valid staff member');
      return;
    }

    const updated = salaryStorage.addAdvance({
      staffId: targetStaff.staffId,
      staffCode: targetStaff.code,
      staffName: targetStaff.name,
      department: targetStaff.department,
      designation: targetStaff.designation,
      amount: Number(advForm.amount),
      monthlyDeduction: Number(advForm.monthlyDeduction),
      purpose: advForm.purpose
    });

    setAdvances(updated);
    setNewAdvanceModalOpen(false);
    setAdvForm({ staffId: '', amount: '', purpose: '', monthlyDeduction: '' });
    toast.success(`New salary advance recorded for ${targetStaff.name}!`);
  };

  return (
    <div className="p-4 md:p-6 space-y-4 bg-slate-50/50 min-h-screen antialiased text-slate-800 pb-20">
      
      {/* ─── TOP ORGANIZATION HEADER ─── */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 text-blue-800 font-extrabold text-xs border border-blue-100 shadow-2xs">
          <Building2 className="w-3.5 h-3.5" />
          J D International School
        </span>
      </div>

      {/* ─── 1. TOP 6 METRIC CARDS (Exact Match to Screenshot) ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: Gross Payroll */}
        <div className="bg-white p-3.5 rounded-xl border border-cyan-200/80 shadow-soft hover:shadow-md transition-all">
          <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
            Gross Payroll
          </span>
          <span className="block text-base sm:text-lg font-black text-slate-800 mt-1">
            {formatINR(totalGrossPayroll)}
          </span>
        </div>

        {/* Card 2: Net Payroll */}
        <div className="bg-white p-3.5 rounded-xl border border-blue-200/80 shadow-soft hover:shadow-md transition-all">
          <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
            Net Payroll
          </span>
          <span className="block text-base sm:text-lg font-black text-blue-600 mt-1">
            {formatINR(totalNetPayroll)}
          </span>
        </div>

        {/* Card 3: Total Deductions */}
        <div className="bg-white p-3.5 rounded-xl border border-rose-200/80 shadow-soft hover:shadow-md transition-all">
          <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
            Total Deductions
          </span>
          <span className="block text-base sm:text-lg font-black text-rose-600 mt-1">
            -{formatINR(totalDeductions)}
          </span>
        </div>

        {/* Card 4: Pending Payments */}
        <div className="bg-white p-3.5 rounded-xl border border-amber-200/80 shadow-soft hover:shadow-md transition-all">
          <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
            Pending Payments
          </span>
          <span className="block text-base sm:text-lg font-black text-slate-800 mt-1">
            {pendingPaymentsCount}
          </span>
        </div>

        {/* Card 5: Paid Employees */}
        <div className="bg-white p-3.5 rounded-xl border border-emerald-200/80 shadow-soft hover:shadow-md transition-all">
          <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
            Paid Employees
          </span>
          <span className="block text-base sm:text-lg font-black text-emerald-600 mt-1">
            {paidEmployeesCount}
          </span>
        </div>

        {/* Card 6: Draft Employees */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-soft hover:shadow-md transition-all">
          <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
            Draft Employees
          </span>
          <span className="block text-base sm:text-lg font-black text-slate-800 mt-1">
            {draftEmployeesCount}
          </span>
        </div>
      </div>

      {/* ─── 2. ACTION / MONTH CONTROL BAR (Exact Match to Screenshot) ─── */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-soft flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        {/* Left side: Month display, badge, employee count, updated time */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <select
              value={selectedMonth}
              onChange={(e) => handleMonthChange(e.target.value)}
              className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer"
            >
              <option value="2026-11">November 2026</option>
              <option value="2026-10">October 2026</option>
              <option value="2026-09">September 2026</option>
              <option value="2026-08">August 2026</option>
            </select>
          </div>

          <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider border border-purple-200 text-purple-700 bg-purple-50">
            Payslips Generated
          </span>

          <span className="text-xs text-slate-400 font-bold">• {records.length} Employees</span>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">• Last Updated: 03:07 pm</span>
        </div>

        {/* Right side: Action Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={() => setDisburseModalOpen(true)}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-soft hover:shadow hover:-translate-y-0.5 active:translate-y-0"
          >
            <CreditCard className="w-3.5 h-3.5" /> Disburse Salary
          </button>

          <button
            onClick={() => setReopenModalOpen(true)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-soft"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reopen
          </button>

          <button
            onClick={() => setFiltersDrawerOpen(!filtersDrawerOpen)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-soft"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
          </button>
        </div>
      </div>

      {/* ─── 3. WORKFLOW STATUS STEPPER (Exact Match to Screenshot & Fully Interactive) ─── */}
      <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-100 shadow-soft overflow-x-auto">
        <div className="flex items-center gap-2 text-[11px] font-bold whitespace-nowrap min-w-[700px]">
          <button
            onClick={() => onNavigate?.('/salary-attendance')}
            className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer transition-colors"
            title="Click to view or edit attendance summary"
          >
            ✓ Attendance →
          </button>
          <span className="text-emerald-600 flex items-center gap-1">✓ Calculated →</span>
          <button
            onClick={() => {
              const next = !(monthlyConfig.accountantReviewed ?? true);
              const updated = { ...monthlyConfig, accountantReviewed: next };
              salaryStorage.saveMonthlyConfig(selectedMonth, updated);
              setMonthlyConfig(updated);
              toast.success(`Accountant review marked as ${next ? 'complete' : 'pending'}`);
            }}
            className={`${(monthlyConfig.accountantReviewed ?? true) ? 'text-emerald-600' : 'text-amber-600'} hover:underline flex items-center gap-1 cursor-pointer`}
            title="Click to toggle accountant review status"
          >
            {(monthlyConfig.accountantReviewed ?? true) ? '✓ Accountant Review →' : '⏳ Accountant Review →'}
          </button>
          
          <button
            onClick={() => {
              const next = !(monthlyConfig.adminApproved ?? (paidEmployeesCount > 0));
              const updated = { ...monthlyConfig, adminApproved: next };
              salaryStorage.saveMonthlyConfig(selectedMonth, updated);
              setMonthlyConfig(updated);
              toast.success(`Admin approval marked as ${next ? 'approved' : 'pending'}`);
            }}
            className={`${(monthlyConfig.adminApproved || paidEmployeesCount > 0) ? 'text-emerald-600' : 'text-amber-600'} hover:underline flex items-center gap-1 cursor-pointer`}
            title="Click to toggle admin approval"
          >
            {(monthlyConfig.adminApproved || paidEmployeesCount > 0) ? '✓ Approved →' : '⏳ Pending Admin →'}
          </button>

          <button
            onClick={() => onNavigate?.('/salary-payslips')}
            className="text-amber-600 hover:text-amber-700 flex items-center gap-1 font-extrabold cursor-pointer transition-colors"
            title="Click to view & print payslips"
          >
            🟡 Payslips →
          </button>
          <span className={paidEmployeesCount === records.length && records.length > 0 ? 'text-emerald-600 font-extrabold' : 'text-slate-400'}>
            {paidEmployeesCount === records.length && records.length > 0 ? '✓ Paid' : paidEmployeesCount > 0 ? `🟡 Paid (${paidEmployeesCount}/${records.length})` : '⚪ Paid'}
          </span>
        </div>
      </div>

      {/* ─── 4. SEGMENTED NAVIGATION TABS (Runs, Salary Structures, Advances) ─── */}
      <div className="flex items-center gap-2">
        {[
          { id: 'runs', label: 'Runs' },
          { id: 'structures', label: 'Salary Structures' },
          { id: 'advances', label: 'Advances' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-soft'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── FILTERS DRAWER / QUICK BAR ─── */}
      {filtersDrawerOpen && (
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-soft grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in duration-150">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Filter by Department
            </label>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 bg-white"
            >
              <option value="All">All Departments ({records.length})</option>
              {allDepartments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 bg-white"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Search Staff
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, ID..."
                className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 1: PAYROLL RUNS (Exact Table Matching Screenshot) ─── */}
      {activeTab === 'runs' && (
        <div className="space-y-4">
          {sortedDeptNames.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-100 p-12 text-center shadow-soft">
              <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-700">No staff salary records found</h3>
              <p className="text-xs text-slate-400 mt-1">Try resetting the department or status filter.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-100 shadow-soft overflow-hidden">
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse table-auto min-w-[950px]">
                  <thead className="bg-slate-50/70 border-b border-slate-200">
                    <tr>
                      <th className="pl-4 pr-3 py-2 text-[10px] font-extrabold tracking-wider text-slate-500 uppercase">
                        Employee
                      </th>
                      <th className="px-3 py-2 text-[10px] font-extrabold tracking-wider text-slate-500 uppercase">
                        Department
                      </th>
                      <th className="px-3 py-2 text-[10px] font-extrabold tracking-wider text-slate-500 uppercase">
                        Gross Salary
                      </th>
                      <th className="px-3 py-2 text-[10px] font-extrabold tracking-wider text-slate-500 uppercase">
                        Deductions
                      </th>
                      <th className="px-3 py-2 text-[10px] font-extrabold tracking-wider text-slate-500 uppercase">
                        Net Salary
                      </th>
                      <th className="px-3 py-2 text-[10px] font-extrabold tracking-wider text-slate-500 uppercase">
                        Status
                      </th>
                      <th className="pr-4 pl-3 py-2 text-[10px] font-extrabold tracking-wider text-slate-500 uppercase text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {sortedDeptNames.map((deptName) => {
                      const deptRecords = grouped[deptName] || [];
                      const isCollapsed = !!collapsedDepts[deptName];

                      return (
                        <React.Fragment key={deptName}>
                          {/* Department Accordion Row */}
                          <tr
                            onClick={() => toggleDeptCollapse(deptName)}
                            className="bg-slate-50/80 border-y border-slate-150 cursor-pointer select-none hover:bg-slate-100/80 transition-colors"
                          >
                            <td colSpan="7" className="px-4 py-2">
                              <div className="flex items-center gap-2">
                                <span className="text-slate-400 text-xs">
                                  {isCollapsed ? '▶' : '▼'}
                                </span>
                                <span className="font-extrabold text-xs text-slate-800">
                                  {deptName}
                                </span>
                                <span className="text-[9px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                                  {deptRecords.length} Employees
                                </span>
                              </div>
                            </td>
                          </tr>

                          {/* Employee Rows under Department */}
                          {!isCollapsed &&
                            deptRecords.map((rec) => {
                              const isPaid = rec.status === 'Paid' || rec.status === 'Disbursed';
                              const totalDeds = rec.totalDeductions || 0;

                              return (
                                <tr
                                  key={rec.id}
                                  className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors odd:bg-white even:bg-slate-50/20"
                                >
                                  {/* Employee info */}
                                  <td className="pl-4 pr-3 py-2.5">
                                    <div className="flex items-center gap-2.5">
                                      <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-extrabold text-[11px] border border-slate-200 shrink-0">
                                        {rec.name?.charAt(0).toUpperCase() || 'E'}
                                      </div>
                                      <div>
                                        <p className="font-extrabold text-slate-850 text-xs leading-none">
                                          {rec.name}
                                        </p>
                                        <p className="text-[10px] text-slate-400 mt-1 font-semibold">
                                          {rec.code} • {rec.designation}
                                        </p>
                                      </div>
                                    </div>
                                  </td>

                                  {/* Department */}
                                  <td className="px-3 py-2.5 text-xs font-semibold text-slate-600">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-50 border border-slate-200">
                                      {rec.department}
                                    </span>
                                  </td>

                                  {/* Gross Salary */}
                                  <td className="px-3 py-2.5 text-xs">
                                    <span className="inline-block px-2.5 py-0.5 rounded text-emerald-800 bg-emerald-50 border border-emerald-200 font-bold">
                                      {formatINR(rec.grossSalary)}
                                    </span>
                                  </td>

                                  {/* Deductions */}
                                  <td className="px-3 py-2.5 text-xs">
                                    <span className="inline-block px-2.5 py-0.5 rounded text-rose-800 bg-rose-50 border border-rose-200 font-bold">
                                      -{formatINR(totalDeds)}
                                    </span>
                                  </td>

                                  {/* Net Salary */}
                                  <td className="px-3 py-2.5 text-xs">
                                    <span className="inline-block px-2.5 py-0.5 rounded text-blue-800 bg-blue-50 border border-blue-200 font-extrabold">
                                      {formatINR(rec.netSalary)}
                                    </span>
                                  </td>

                                  {/* Status */}
                                  <td className="px-3 py-2.5 text-xs">
                                    <span
                                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                        isPaid
                                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                                      }`}
                                    >
                                      {isPaid ? 'Paid' : 'Pending'}
                                    </span>
                                  </td>

                                  {/* Actions */}
                                  <td className="pr-4 pl-3 py-2.5 text-right whitespace-nowrap">
                                    <div className="flex items-center justify-end gap-1.5">
                                      {/* View Breakdown */}
                                      <button
                                        onClick={() => setBreakdownRecord(rec)}
                                        title="View Breakdown"
                                        className="p-1 border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-all cursor-pointer shadow-2xs hover:scale-105"
                                      >
                                        <Eye className="w-3.5 h-3.5" />
                                      </button>

                                      {/* Edit Adjustments */}
                                      {!isPaid && (
                                        <button
                                          onClick={() => openEditAdjustmentModal(rec)}
                                          title="Edit Adjustments (Bonus, OT, Advance)"
                                          className="p-1 border border-amber-250 text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-md transition-all cursor-pointer shadow-2xs hover:scale-105"
                                        >
                                          <Edit3 className="w-3.5 h-3.5" />
                                        </button>
                                      )}

                                      {/* Disburse Single */}
                                      {!isPaid && (
                                        <button
                                          onClick={() => setSingleDisburseRecord(rec)}
                                          title="Disburse Single Payment"
                                          className="p-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md shadow-2xs transition-all cursor-pointer hover:scale-105"
                                        >
                                          <CreditCard className="w-3.5 h-3.5" />
                                        </button>
                                      )}

                                      {/* Payslips Studio Shortcut */}
                                      <button
                                        onClick={() => onNavigate?.('/salary-payslips')}
                                        title="Go to Payslip Studio"
                                        className="p-1 border border-slate-200 text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-md transition-all cursor-pointer shadow-2xs hover:scale-105"
                                      >
                                        <FileSpreadsheet className="w-3.5 h-3.5 text-teal-600" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 2: SALARY STRUCTURES ─── */}
      {activeTab === 'structures' && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-soft p-4 space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800">
                School Staff Salary Structures Directory
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">
                View &amp; configure monthly gross salary packages and base pay.
              </p>
            </div>
            <button
              onClick={() => onNavigate?.('/salary-structure')}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-soft"
            >
              Open Full Structure Studio
            </button>
          </div>

          <div className="w-full overflow-x-auto rounded-lg border border-slate-100">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-2.5 font-extrabold text-slate-600">Employee</th>
                  <th className="p-2.5 font-extrabold text-slate-600">Department</th>
                  <th className="p-2.5 font-extrabold text-slate-600">Designation</th>
                  <th className="p-2.5 font-extrabold text-slate-600">Basic Pay</th>
                  <th className="p-2.5 font-extrabold text-slate-600">Gross Monthly</th>
                  <th className="p-2.5 font-extrabold text-slate-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((staff) => (
                  <tr key={staff.id} className="hover:bg-slate-50/50">
                    <td className="p-2.5 font-bold text-slate-800">
                      {staff.name}{' '}
                      <span className="text-[10px] text-slate-400 font-semibold block">
                        {staff.code}
                      </span>
                    </td>
                    <td className="p-2.5 text-slate-600">{staff.department}</td>
                    <td className="p-2.5 text-slate-600">{staff.designation}</td>
                    <td className="p-2.5 font-bold text-slate-700">{formatINR(staff.basic)}</td>
                    <td className="p-2.5 font-extrabold text-emerald-700">
                      {formatINR(staff.grossSalary)}
                    </td>
                    <td className="p-2.5 text-right">
                      <button
                        onClick={() => setEditStructureRecord(staff)}
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold"
                      >
                        Edit Structure
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── TAB 3: ADVANCES & LOANS ─── */}
      {activeTab === 'advances' && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-soft p-4 space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800">
                Staff Salary Advance &amp; Loan Register
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">
                Manage advance disbursements and monthly recovery deductions.
              </p>
            </div>
            <button
              onClick={() => setNewAdvanceModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-soft"
            >
              <Plus className="w-3.5 h-3.5" /> Issue New Advance
            </button>
          </div>

          <div className="w-full overflow-x-auto rounded-lg border border-slate-100">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-2.5 font-extrabold text-slate-600">Employee</th>
                  <th className="p-2.5 font-extrabold text-slate-600">Purpose</th>
                  <th className="p-2.5 font-extrabold text-slate-600">Advance Amount</th>
                  <th className="p-2.5 font-extrabold text-slate-600">Monthly EMI</th>
                  <th className="p-2.5 font-extrabold text-slate-600">Recovered</th>
                  <th className="p-2.5 font-extrabold text-slate-600">Balance</th>
                  <th className="p-2.5 font-extrabold text-slate-600 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {advances.map((adv) => (
                  <tr key={adv.id} className="hover:bg-slate-50/50">
                    <td className="p-2.5 font-bold text-slate-800">
                      {adv.staffName}{' '}
                      <span className="text-[10px] text-slate-400 font-semibold block">
                        {adv.staffCode} • {adv.department}
                      </span>
                    </td>
                    <td className="p-2.5 text-slate-600 font-medium">{adv.purpose}</td>
                    <td className="p-2.5 font-extrabold text-slate-900">{formatINR(adv.amount)}</td>
                    <td className="p-2.5 font-bold text-rose-600">
                      -{formatINR(adv.monthlyDeduction)} / mo
                    </td>
                    <td className="p-2.5 font-bold text-emerald-600">
                      {formatINR(adv.recoveredAmount)}
                    </td>
                    <td className="p-2.5 font-black text-amber-700">
                      {formatINR(adv.remainingAmount)}
                    </td>
                    <td className="p-2.5 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {adv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── MODAL 1: VIEW BREAKDOWN MODAL ─── */}
      {breakdownRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-sm text-slate-700 border border-slate-200">
                  {breakdownRecord.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-slate-800">{breakdownRecord.name}</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {breakdownRecord.code} • {breakdownRecord.designation}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setBreakdownRecord(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Salary Components */}
            <div className="space-y-2 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 space-y-1.5">
                <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                  Earnings Breakdown
                </p>
                <div className="flex justify-between">
                  <span>Basic Pay</span>
                  <span className="font-bold text-slate-800">{formatINR(breakdownRecord.basic)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Allowances (HRA, DA, Special)</span>
                  <span className="font-bold text-slate-800">
                    {formatINR(breakdownRecord.totalAllowances || 0)}
                  </span>
                </div>
                {breakdownRecord.bonus > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Performance Bonus</span>
                    <span>+{formatINR(breakdownRecord.bonus)}</span>
                  </div>
                )}
                {breakdownRecord.overtimePay > 0 && (
                  <div className="flex justify-between text-purple-600 font-bold">
                    <span>Overtime Allowance</span>
                    <span>+{formatINR(breakdownRecord.overtimePay)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-slate-200 pt-1.5 font-extrabold text-emerald-700 text-sm">
                  <span>Total Gross Salary</span>
                  <span>{formatINR(breakdownRecord.grossSalary)}</span>
                </div>
              </div>

              {/* Deductions Components */}
              <div className="bg-rose-50/60 p-3 rounded-xl border border-rose-150 space-y-1.5">
                <p className="text-[10px] font-extrabold text-rose-600 uppercase tracking-wider mb-1">
                  Deductions Breakdown
                </p>
                <div className="flex justify-between">
                  <span>EPF (Employee Contribution)</span>
                  <span className="font-bold text-rose-700">-{formatINR(breakdownRecord.epf || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>ESI Contribution</span>
                  <span className="font-bold text-rose-700">-{formatINR(breakdownRecord.esi || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Professional Tax</span>
                  <span className="font-bold text-rose-700">
                    -{formatINR(breakdownRecord.professionalTax || 0)}
                  </span>
                </div>
                {breakdownRecord.lopDeduction > 0 && (
                  <div className="flex justify-between text-rose-800 font-bold">
                    <span>Attendance LOP Deduction ({breakdownRecord.unpaidLeaveDays} days)</span>
                    <span>-{formatINR(breakdownRecord.lopDeduction)}</span>
                  </div>
                )}
                {breakdownRecord.tds > 0 && (
                  <div className="flex justify-between text-rose-800 font-bold">
                    <span>TDS / Income Tax</span>
                    <span>-{formatINR(breakdownRecord.tds)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-rose-200 pt-1.5 font-extrabold text-rose-800">
                  <span>Total Deductions</span>
                  <span>-{formatINR(breakdownRecord.totalDeductions)}</span>
                </div>
              </div>

              {/* Net Payable Card */}
              <div className="bg-blue-600 text-white p-3.5 rounded-xl shadow-soft flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-extrabold text-blue-200 uppercase tracking-wider block">
                    Take-Home Net Salary
                  </span>
                  <span className="text-xs text-blue-100">Disbursement Ready</span>
                </div>
                <span className="text-xl font-black">{formatINR(breakdownRecord.netSalary)}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t">
              <button
                onClick={() => setBreakdownRecord(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: DISBURSE SALARY MODAL ─── */}
      {disburseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-extrabold text-slate-800">
                  Confirm Monthly Payroll Disbursement
                </h2>
              </div>
              <button
                onClick={() => setDisburseModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmDisburseAll} className="space-y-3.5 text-xs">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <span className="text-[10px] font-bold text-emerald-700 uppercase">
                  Disbursement Summary
                </span>
                <p className="text-sm font-black text-emerald-900 mt-1">
                  Total {records.length} Employees • Net Payable: {formatINR(totalNetPayroll)}
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Disbursement Mode
                </label>
                <select
                  value={disburseForm.payMethod}
                  onChange={(e) => setDisburseForm({ ...disburseForm, payMethod: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-xs font-bold text-slate-800 bg-white"
                >
                  <option value="Bank Transfer">Bank Transfer (NEFT/RTGS/NACH)</option>
                  <option value="Cheque">Corporate Cheque</option>
                  <option value="Cash">Cash Voucher</option>
                  <option value="UPI">Direct UPI</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Payment Date
                  </label>
                  <input
                    type="date"
                    value={disburseForm.payDate}
                    onChange={(e) => setDisburseForm({ ...disburseForm, payDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs font-bold text-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Batch Ref / UTR
                  </label>
                  <input
                    type="text"
                    value={disburseForm.payRef}
                    onChange={(e) => setDisburseForm({ ...disburseForm, payRef: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs font-bold text-slate-800"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Remarks / Audit Note
                </label>
                <input
                  type="text"
                  value={disburseForm.payRemarks}
                  onChange={(e) => setDisburseForm({ ...disburseForm, payRemarks: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-xs font-medium text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setDisburseModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-xs font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-soft"
                >
                  Confirm &amp; Disburse All
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 3: REOPEN PAYROLL MODAL ─── */}
      {reopenModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-amber-600" />
                <h2 className="text-sm font-extrabold text-slate-800">
                  Reopen Payroll for Adjustments
                </h2>
              </div>
              <button
                onClick={() => setReopenModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmReopen} className="space-y-3.5 text-xs">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800">
                <p className="font-bold text-xs">Administrative Notice</p>
                <p className="text-[11px] mt-0.5">
                  Reopening will allow accountants and admin to modify attendance loss-of-pay,
                  bonus, or structure and recalculate payslips.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Reason for Reopening
                </label>
                <textarea
                  rows="3"
                  value={reopenReason}
                  onChange={(e) => setReopenReason(e.target.value)}
                  placeholder="e.g. Attendance records corrected after teacher leave approval..."
                  className="w-full px-3 py-2 border rounded-lg text-xs font-medium text-slate-800"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setReopenModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-xs font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-soft"
                >
                  Confirm Reopen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 4: EDIT ADJUSTMENTS MODAL ─── */}
      {editAdjustmentRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h2 className="text-sm font-extrabold text-slate-800">
                  Edit Salary Adjustments
                </h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                  {editAdjustmentRecord.name} • {editAdjustmentRecord.code}
                </p>
              </div>
              <button
                onClick={() => setEditAdjustmentRecord(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAdjustment} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Bonus / Incentive
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={adjForm.bonus}
                    onChange={(e) => setAdjForm({ ...adjForm, bonus: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Overtime Pay
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={adjForm.overtimePay}
                    onChange={(e) => setAdjForm({ ...adjForm, overtimePay: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs font-bold text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Advance Recovery
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={adjForm.advanceRecovery}
                    onChange={(e) => setAdjForm({ ...adjForm, advanceRecovery: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    TDS Deduction
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={adjForm.tds}
                    onChange={(e) => setAdjForm({ ...adjForm, tds: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs font-bold text-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setEditAdjustmentRecord(null)}
                  className="px-4 py-2 border rounded-lg text-xs font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-soft"
                >
                  Save &amp; Recalculate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 5: SINGLE DISBURSE MODAL ─── */}
      {singleDisburseRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h2 className="text-sm font-extrabold text-slate-800">Disburse Salary</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                  {singleDisburseRecord.name} • {singleDisburseRecord.code}
                </p>
              </div>
              <button
                onClick={() => setSingleDisburseRecord(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmSingleDisburse} className="space-y-3 text-xs">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex justify-between items-center">
                <span className="font-bold text-slate-600">Net Payable:</span>
                <span className="text-base font-black text-blue-800">
                  {formatINR(singleDisburseRecord.netSalary)}
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Payment Mode
                </label>
                <select
                  value={disburseForm.payMethod}
                  onChange={(e) => setDisburseForm({ ...disburseForm, payMethod: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-xs font-bold text-slate-800"
                >
                  <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Transaction Ref / Cheque No
                </label>
                <input
                  type="text"
                  value={disburseForm.payRef}
                  onChange={(e) => setDisburseForm({ ...disburseForm, payRef: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-xs font-bold text-slate-800"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setSingleDisburseRecord(null)}
                  className="px-4 py-2 border rounded-lg text-xs font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-soft"
                >
                  Mark Paid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 6: NEW ADVANCE MODAL ─── */}
      {newAdvanceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                <Coins className="w-4 h-4 text-emerald-600" />
                Issue New Staff Salary Advance
              </h2>
              <button
                onClick={() => setNewAdvanceModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddAdvance} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Select Staff Member
                </label>
                <select
                  value={advForm.staffId}
                  onChange={(e) => setAdvForm({ ...advForm, staffId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-xs font-semibold text-slate-800 bg-white"
                  required
                >
                  <option value="">-- Choose Employee --</option>
                  {records.map((r) => (
                    <option key={r.id} value={r.code}>
                      {r.name} ({r.code} • {r.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Advance Amount (₹)
                  </label>
                  <input
                    type="number"
                    min="500"
                    value={advForm.amount}
                    onChange={(e) => setAdvForm({ ...advForm, amount: e.target.value })}
                    placeholder="e.g. 15000"
                    className="w-full px-3 py-2 border rounded-lg text-xs font-bold text-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Monthly EMI Recovery (₹)
                  </label>
                  <input
                    type="number"
                    min="100"
                    value={advForm.monthlyDeduction}
                    onChange={(e) => setAdvForm({ ...advForm, monthlyDeduction: e.target.value })}
                    placeholder="e.g. 2500"
                    className="w-full px-3 py-2 border rounded-lg text-xs font-bold text-slate-800"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Purpose / Justification
                </label>
                <input
                  type="text"
                  value={advForm.purpose}
                  onChange={(e) => setAdvForm({ ...advForm, purpose: e.target.value })}
                  placeholder="e.g. Family medical emergency, festival..."
                  className="w-full px-3 py-2 border rounded-lg text-xs font-medium text-slate-800"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setNewAdvanceModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-xs font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-soft"
                >
                  Confirm &amp; Disburse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 7: EDIT STRUCTURE MODAL ─── */}
      {editStructureRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h2 className="text-sm font-extrabold text-slate-800">Update Salary Structure</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                  {editStructureRecord.name} • {editStructureRecord.code}
                </p>
              </div>
              <button
                onClick={() => setEditStructureRecord(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Gross Monthly Salary (₹)
                </label>
                <input
                  type="number"
                  defaultValue={editStructureRecord.grossSalary}
                  id="structure_gross_input"
                  className="w-full px-3 py-2 border rounded-lg text-xs font-black text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Base Basic Pay (₹)
                </label>
                <input
                  type="number"
                  defaultValue={editStructureRecord.basic}
                  id="structure_basic_input"
                  className="w-full px-3 py-2 border rounded-lg text-xs font-bold text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setEditStructureRecord(null)}
                  className="px-4 py-2 border rounded-lg text-xs font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const gross = document.getElementById('structure_gross_input')?.value;
                    const basic = document.getElementById('structure_basic_input')?.value;
                    salaryStorage.updateStaffSalary(editStructureRecord.staffId, {
                      grossSalary: gross,
                      basicSalary: basic
                    });
                    setEditStructureRecord(null);
                    toast.success(`Salary structure updated for ${editStructureRecord.name}!`);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-soft"
                >
                  Save Structure
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
