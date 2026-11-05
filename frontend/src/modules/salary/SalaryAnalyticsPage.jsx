import React, { useState, useMemo, useEffect } from 'react';
import {
  TrendingUp,
  PieChart as PieIcon,
  Calendar,
  Home,
  Users,
  Building,
  GraduationCap,
  DollarSign,
  Activity,
  Target,
  AlertCircle,
  CheckCircle2,
  RefreshCcw,
  Search,
  ChevronDown,
  Download,
  Filter,
  BarChart3,
  Layers,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import toast from 'react-hot-toast';
import { salaryStorage } from './salaryStore';

const PIE_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

export function SalaryAnalyticsPage({ onNavigate }) {
  const [selectedMonth, setSelectedMonth] = useState('2026-11');
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'staff-ratio'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('ALL');
  const [deptDropdownOpen, setDeptDropdownOpen] = useState(false);
  const [selectedDeptIds, setSelectedDeptIds] = useState([]);

  // Load records from shared store
  const records = useMemo(() => salaryStorage.getMonthlyRecords(selectedMonth), [selectedMonth]);

  // Extract departments from staff records
  const departmentsList = useMemo(() => {
    return Array.from(new Set(records.map(r => r.department || 'GENERAL')));
  }, [records]);

  // Initialize selected departments
  useEffect(() => {
    if (departmentsList.length > 0 && selectedDeptIds.length === 0) {
      setSelectedDeptIds(departmentsList);
    }
  }, [departmentsList]);

  // School Academic & Financial Benchmarks (Grounding JD International School)
  const totalStudents = 460;
  const totalClasses = 14;
  const annualTuitionRevenue = 6048000; // ~₹5,04,000 / month avg fee collection
  const monthlyTuitionCollection = Math.round(annualTuitionRevenue / 12);

  // Filtered records based on department selection
  const filteredRecords = useMemo(() => {
    if (selectedDeptIds.length === 0) return records;
    return records.filter(r => selectedDeptIds.includes(r.department));
  }, [records, selectedDeptIds]);

  // Financial aggregates
  const totalStaffCount = filteredRecords.length;
  const monthlyPayrollGross = filteredRecords.reduce((sum, r) => sum + (r.grossSalary || 0), 0);
  const monthlyPayrollNet = filteredRecords.reduce((sum, r) => sum + (r.netSalary || 0), 0);
  const annualPayroll = monthlyPayrollGross * 12;
  const totalDeductions = filteredRecords.reduce((sum, r) => sum + (r.totalDeductions || 0), 0);

  // Salary to Fee Ratio calculation (Monthly Gross Salary / Monthly Tuition)
  const salaryToFeeRatio = monthlyTuitionCollection > 0
    ? Number(((monthlyPayrollGross / monthlyTuitionCollection) * 100).toFixed(1))
    : 0;

  const averageMonthlySalary = totalStaffCount > 0 ? Math.round(monthlyPayrollGross / totalStaffCount) : 0;
  const averageStudentFee = totalStudents > 0 ? Math.round(annualTuitionRevenue / totalStudents) : 0;

  // Department Distribution for Pie Chart
  const departmentSalaryDistribution = useMemo(() => {
    const map = {};
    records.forEach(r => {
      const dept = r.department || 'General';
      if (!map[dept]) map[dept] = { department: dept, salary: 0, count: 0 };
      map[dept].salary += (r.grossSalary || 0);
      map[dept].count += 1;
    });

    const totalSalaryAll = Object.values(map).reduce((acc, curr) => acc + curr.salary, 0);

    return Object.values(map).map(item => ({
      ...item,
      percentage: totalSalaryAll > 0 ? Number(((item.salary / totalSalaryAll) * 100).toFixed(1)) : 0
    })).sort((a, b) => b.salary - a.salary);
  }, [records]);

  // Monthly Revenue vs Salary Trend Bar Chart
  const revenueVsSalaryData = useMemo(() => {
    const months = ['Jul 26', 'Aug 26', 'Sep 26', 'Oct 26', 'Nov 26', 'Dec 26'];
    const baseRev = monthlyTuitionCollection;
    const baseSal = monthlyPayrollGross;
    return months.map((m, idx) => {
      const revMod = idx === 1 ? 1.15 : (idx === 4 ? 1.05 : 0.98); // higher in admission/quarter starts
      return {
        month: m,
        tuitionFee: Math.round(baseRev * revMod),
        salaryExpense: baseSal,
        netSurplus: Math.round(baseRev * revMod - baseSal)
      };
    });
  }, [monthlyTuitionCollection, monthlyPayrollGross]);

  // Staff Salary Ratio Table Data
  const staffRatioRows = useMemo(() => {
    return records
      .filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.designation.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDept = selectedDeptFilter === 'ALL' || s.department === selectedDeptFilter;
        return matchesSearch && matchesDept;
      })
      .map(s => {
        const annualSal = (s.grossSalary || 0) * 12;
        const ratio = annualTuitionRevenue > 0 ? ((annualSal / annualTuitionRevenue) * 100).toFixed(2) : '0';
        return {
          ...s,
          annualSalary: annualSal,
          salaryRatio: ratio
        };
      });
  }, [records, searchQuery, selectedDeptFilter, annualTuitionRevenue]);

  const exportRatioCSV = () => {
    const headers = ['Employee Code', 'Staff Name', 'Department', 'Designation', 'Monthly Gross (₹)', 'Annual Gross (₹)', 'Tuition Ratio (%)'];
    const rows = staffRatioRows.map(s => [
      `"${s.code}"`,
      `"${s.name}"`,
      `"${s.department}"`,
      `"${s.designation}"`,
      s.grossSalary,
      s.annualSalary,
      `"${s.salaryRatio}%"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `JD_International_Staff_Salary_Ratio_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Staff Salary Ratio exported to CSV!');
  };

  const getRatioStatusBadge = (ratio) => {
    if (ratio < 30) return { bg: 'bg-emerald-100 text-emerald-800 border-emerald-300', text: 'Healthy Budget' };
    if (ratio < 50) return { bg: 'bg-blue-100 text-blue-800 border-blue-300', text: 'Balanced' };
    if (ratio <= 65) return { bg: 'bg-amber-100 text-amber-800 border-amber-300', text: 'Standard CBSE Range' };
    return { bg: 'bg-rose-100 text-rose-800 border-rose-300', text: 'Critical / High Outlay' };
  };

  const ratioBadge = getRatioStatusBadge(salaryToFeeRatio);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-20 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button onClick={() => onNavigate?.('/')} className="text-slate-500 hover:text-emerald-600 transition flex items-center text-xs">
              <Home className="w-3.5 h-3.5 mr-1" />
              Home
            </button>
            <span className="text-slate-300">•</span>
            <button onClick={() => onNavigate?.('/salary-hub')} className="text-slate-500 hover:text-emerald-600 transition text-xs">
              Salary
            </button>
            <span className="text-slate-300">•</span>
            <span className="text-slate-800 font-bold text-xs">Analytics Studio</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">School HRMS & Salary Analytics</h1>
              <p className="text-xs text-slate-500">
                Institutional financial intelligence, salary-to-tuition ratios, and department expenditure breakdown
              </p>
            </div>
          </div>
        </div>

        {/* Month Selector & View Tabs */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="2026-11">November 2026</option>
              <option value="2026-10">October 2026</option>
              <option value="2026-09">September 2026</option>
            </select>
          </div>

          <div className="bg-slate-100 p-1 rounded-xl flex items-center">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'overview' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Analytics Dashboard
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('staff-ratio')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'staff-ratio' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Staff Salary Ratio
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* Department Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xs font-bold text-slate-800">Filter Department Scope</h3>
            <p className="text-[11px] text-slate-400">Live filter analytics and ratios by selecting academic and administrative departments</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedDeptIds(departmentsList)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition ${
                  selectedDeptIds.length === departmentsList.length
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                All ({departmentsList.length})
              </button>
              {departmentsList.map(dept => {
                const isSelected = selectedDeptIds.includes(dept);
                return (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        if (selectedDeptIds.length > 1) {
                          setSelectedDeptIds(selectedDeptIds.filter(d => d !== dept));
                        }
                      } else {
                        setSelectedDeptIds([...selectedDeptIds, dept]);
                      }
                    }}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-800 font-bold'
                        : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    {dept}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Row 1: Primary Metrics (4 Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Students */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Total Enrolled Students</span>
                  <div className="text-2xl font-black text-slate-900">{totalStudents}</div>
                  <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">Campus Strength</span>
                </div>
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              {/* Total Classes */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Academic Divisions</span>
                  <div className="text-2xl font-black text-slate-900">{totalClasses} Classes</div>
                  <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">Nursery to Class XII</span>
                </div>
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
              </div>

              {/* Annual Tuition Revenue */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Annual Tuition Revenue</span>
                  <div className="text-2xl font-black text-purple-700">₹{(annualTuitionRevenue / 100000).toFixed(2)} Lakh</div>
                  <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">₹{monthlyTuitionCollection.toLocaleString('en-IN')}/month</span>
                </div>
                <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>

              {/* Annual Payroll */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Annual Payroll Outlay</span>
                  <div className="text-2xl font-black text-emerald-700">₹{(annualPayroll / 100000).toFixed(2)} Lakh</div>
                  <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">₹{monthlyPayrollGross.toLocaleString('en-IN')}/month Gross</span>
                </div>
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Row 2: Secondary Performance Cards (Including Signature 59.3% Salary Ratio) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Salary Ratio (Signature KPI) */}
              <div className="bg-white p-5 rounded-2xl border border-indigo-200 shadow-xs relative overflow-hidden ring-2 ring-indigo-500/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Target className="w-4.5 h-4.5" />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${ratioBadge.bg}`}>
                    {ratioBadge.text}
                  </span>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Salary to Fee Ratio</span>
                <div className="text-3xl font-black text-indigo-900 mt-1">{salaryToFeeRatio}%</div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Salary cost relative to student tuition collection
                </p>
              </div>

              {/* Average Student Fee */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-2">
                  <Activity className="w-4.5 h-4.5" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Average Fee / Student</span>
                <div className="text-2xl font-black text-slate-900 mt-1">₹{averageStudentFee.toLocaleString('en-IN')}</div>
                <span className="text-[10px] text-slate-500 mt-1 block">Annual tuition per child</span>
              </div>

              {/* Average Staff Salary */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
                  <Building className="w-4.5 h-4.5" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Average Staff CTC</span>
                <div className="text-2xl font-black text-slate-900 mt-1">₹{averageMonthlySalary.toLocaleString('en-IN')}</div>
                <span className="text-[10px] text-slate-500 mt-1 block">Monthly average across {totalStaffCount} staff</span>
              </div>

              {/* Outstanding / Held Deductions */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-2">
                  <AlertCircle className="w-4.5 h-4.5" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Statutory Deductions</span>
                <div className="text-2xl font-black text-rose-600 mt-1">₹{totalDeductions.toLocaleString('en-IN')}</div>
                <span className="text-[10px] text-slate-500 mt-1 block">EPF, ESIC, Tax held this month</span>
              </div>
            </div>

            {/* Visual Charts: Department Pie & Revenue vs Salary Bar */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 1. Department Salary Distribution Pie Chart */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <PieIcon className="w-4 h-4 text-emerald-600" />
                      Department Salary Distribution
                    </h3>
                    <p className="text-xs text-slate-500">Breakdown of gross salary allocation across school wings</p>
                  </div>
                </div>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={departmentSalaryDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={95}
                        paddingAngle={3}
                        dataKey="salary"
                        nameKey="department"
                        label={({ department, percentage }) => `${department.split(' ')[0]}: ${percentage}%`}
                        labelLine={false}
                      >
                        {departmentSalaryDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 2. Monthly Tuition Collection vs Salary Outlay */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-indigo-600" />
                      Fee Revenue vs Salary Expense Trend
                    </h3>
                    <p className="text-xs text-slate-500">6-Month institutional surplus and cashflow analysis</p>
                  </div>
                </div>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueVsSalaryData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} tickFormatter={(val) => `₹${val / 1000}k`} />
                      <Tooltip formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`} />
                      <Legend />
                      <Bar dataKey="tuitionFee" name="Tuition Revenue" fill="#10B981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="salaryExpense" name="Salary Expense" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STAFF SALARY RATIO TABLE */}
        {activeTab === 'staff-ratio' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Staff Salary Ratio Matrix</h3>
                <p className="text-xs text-slate-500">
                  Individual staff member annual compensation expressed as a percentage of total school tuition revenue
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={exportRatioCSV}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600" />
                  Export CSV
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search staff by name, code, designation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                />
              </div>

              <select
                value={selectedDeptFilter}
                onChange={(e) => setSelectedDeptFilter(e.target.value)}
                className="px-3 py-1.5 text-xs font-semibold border border-slate-300 rounded-lg bg-white"
              >
                <option value="ALL">All Departments</option>
                {departmentsList.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Emp Code</th>
                    <th className="py-2.5 px-3">Staff Name</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3">Designation</th>
                    <th className="py-2.5 px-3 text-right">Monthly Gross</th>
                    <th className="py-2.5 px-3 text-right">Annual Gross</th>
                    <th className="py-2.5 px-3 text-right">Salary Ratio %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {staffRatioRows.map((staff) => (
                    <tr key={staff.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{staff.code}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{staff.name}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold">
                          {staff.department}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">{staff.designation}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                        ₹{(staff.grossSalary || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 px-3 text-right font-semibold text-slate-700">
                        ₹{staff.annualSalary.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200 text-[11px]">
                          {staff.salaryRatio}%
                        </span>
                      </td>
                    </tr>
                  ))}
                  {staffRatioRows.length === 0 && (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-slate-400 font-medium">
                        No staff members matching search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
