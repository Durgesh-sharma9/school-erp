import React, { useState, useMemo, useEffect } from 'react';
import {
  Users,
  GraduationCap,
  IndianRupee,
  TrendingUp,
  Building,
  PieChart as PieIcon,
  BarChart3,
  RefreshCcw,
  AlertCircle,
  CheckCircle2,
  Activity,
  Target,
  ChevronDown,
  Search,
  ChevronRight,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import toast from 'react-hot-toast';
import { salaryStorage } from './salaryStore';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16', '#6366F1', '#14B8A6', '#F97316'];

export function SalaryAnalyticsPage({ onNavigate }) {
  const [selectedMonth, setSelectedMonth] = useState('2026-11');
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Load records from salaryStore
  const [records, setRecords] = useState(() => salaryStorage.getMonthlyRecords(selectedMonth));

  useEffect(() => {
    setRecords(salaryStorage.getMonthlyRecords(selectedMonth));
  }, [selectedMonth]);

  // Master departments list
  const departments = useMemo(() => {
    const set = new Set(records.map(r => r.department).filter(Boolean));
    return Array.from(set);
  }, [records]);

  // Selected department IDs for filtering
  const [selectedDeptIds, setSelectedDeptIds] = useState(() => departments);

  useEffect(() => {
    if (departments.length > 0 && selectedDeptIds.length === 0) {
      setSelectedDeptIds(departments);
    }
  }, [departments]);

  // Filtered records based on active department multi-select
  const filteredRecords = useMemo(() => {
    if (selectedDeptIds.length === 0) return records;
    return records.filter(r => selectedDeptIds.includes(r.department));
  }, [records, selectedDeptIds]);

  // Grounding Academic & Tuition Benchmarks (Consistent Monthly & Annual Scale)
  const totalStudents = 460;
  const totalClasses = 14;
  const monthlyTuitionCollection = 5840000; // ₹58.4 Lakhs/month (~₹12,700/student/mo)
  const annualTuitionRevenue = monthlyTuitionCollection * 12; // ₹7.008 Crore annually

  // Financial aggregates
  const totalPayroll = filteredRecords.reduce((acc, r) => acc + (r.grossSalary || 0), 0);
  const totalNet = filteredRecords.reduce((acc, r) => acc + (r.netSalary || 0), 0);
  const totalDeductions = filteredRecords.reduce((acc, r) => acc + (r.totalDeductions || 0), 0);
  const averageSalary = filteredRecords.length > 0 ? Math.round(totalPayroll / filteredRecords.length) : 0;
  const averageFee = totalStudents > 0 ? Math.round(monthlyTuitionCollection / totalStudents) : 0;

  // Salary to Fee Ratio (Monthly Gross Payroll / Monthly Tuition Revenue * 100)
  const salaryToFeeRatio = monthlyTuitionCollection > 0
    ? Number(((totalPayroll / monthlyTuitionCollection) * 100).toFixed(1))
    : 50.0;

  const getRatioStatus = (ratio) => {
    if (ratio < 40) return { label: 'Optimal', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    if (ratio < 55) return { label: 'Healthy', color: 'bg-blue-50 text-blue-700 border-blue-200' };
    if (ratio < 70) return { label: 'Moderate', color: 'bg-amber-50 text-amber-700 border-amber-200' };
    return { label: 'High Alert', color: 'bg-red-50 text-red-700 border-red-200' };
  };

  const ratioStatus = getRatioStatus(salaryToFeeRatio);

  // Department Salary Distribution for Donut Chart
  const departmentSalaryDistribution = useMemo(() => {
    const map = {};
    filteredRecords.forEach(r => {
      const dept = r.department || 'General';
      if (!map[dept]) map[dept] = { name: dept, value: 0, count: 0 };
      map[dept].value += (r.grossSalary || 0);
      map[dept].count += 1;
    });
    return Object.values(map);
  }, [filteredRecords]);

  // Revenue vs Payroll Bar Chart data (Monthly Comparison)
  const revenueVsPayrollData = [
    { month: 'Jul 26', tuition: 5600000, payroll: 2880000 },
    { month: 'Aug 26', tuition: 6200000, payroll: 2910000 },
    { month: 'Sep 26', tuition: 5400000, payroll: 2905000 },
    { month: 'Oct 26', tuition: 5800000, payroll: 2915000 },
    { month: 'Nov 26', tuition: monthlyTuitionCollection, payroll: totalPayroll }
  ];

  // Class-wise Student Strength Data
  const classWiseData = [
    { class: 'Nursery-UKG', students: 85, fee: 950000 },
    { class: 'Class 1-5', students: 160, fee: 2100000 },
    { class: 'Class 6-8', students: 115, fee: 1650000 },
    { class: 'Class 9-10', students: 60, fee: 820000 },
    { class: 'Class 11-12', students: 40, fee: 528000 }
  ];

  const getSelectedText = () => {
    if (selectedDeptIds.length === 0) return 'No Departments Selected';
    if (selectedDeptIds.length === departments.length) return 'All Departments';
    if (selectedDeptIds.length <= 2) return selectedDeptIds.join(', ');
    return `${selectedDeptIds.slice(0, 2).join(', ')} +${selectedDeptIds.length - 2}`;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="cursor-pointer hover:text-blue-600" onClick={() => onNavigate?.('/salary-hub')}>Salary Hub</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-slate-700">Analytics Dashboard</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">School HRMS Analytics</h1>
          <p className="text-sm text-slate-500">Complete analytics for your school's academic and financial performance.</p>
        </div>

        <button
          onClick={() => {
            setRecords(salaryStorage.getMonthlyRecords(selectedMonth));
            toast.success('Analytics data refreshed!');
          }}
          className="flex items-center gap-1.5 px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 bg-white rounded-xl text-xs font-bold shadow-soft transition-all"
        >
          <RefreshCcw className="w-4 h-4 text-slate-500" /> Refresh
        </button>
      </div>

      {/* Filter Data Scope Banner with Multiselect */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Filter Data Scope</h3>
          <p className="text-xs text-slate-500 mt-0.5">Select target departments to live-filter all summary indicators and visual graphs.</p>
        </div>

        {/* Dropdown UI */}
        <div className="relative inline-block text-left w-full md:w-80 z-20">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center justify-between w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-soft hover:bg-slate-50 transition-all focus:outline-none"
          >
            <span className="truncate pr-2 font-bold">{getSelectedText()}</span>
            <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0 ml-auto" />
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-xl z-40 p-4 space-y-3 animate-scaleUp">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search departments..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none"
                  />
                </div>

                {/* Operations */}
                <div className="flex justify-between items-center text-[10px] font-bold px-1">
                  <button
                    type="button"
                    onClick={() => setSelectedDeptIds(departments)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedDeptIds([])}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    Clear All
                  </button>
                </div>

                <div className="h-px bg-slate-100" />

                {/* Checkboxes List */}
                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 text-xs">
                  {departments
                    .filter(d => d.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((dept, idx) => {
                      const isChecked = selectedDeptIds.includes(dept);
                      return (
                        <label
                          key={idx}
                          className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer select-none"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                setSelectedDeptIds(selectedDeptIds.filter(id => id !== dept));
                              } else {
                                setSelectedDeptIds([...selectedDeptIds, dept]);
                              }
                            }}
                            className="w-3.5 h-3.5 text-blue-600 border-slate-300 rounded"
                          />
                          <span className="font-semibold text-slate-700">{dept}</span>
                        </label>
                      );
                    })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Row 1 Summary KPI Cards (4 cards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Students</span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{totalStudents}</div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">Across 14 active grade divisions</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Classes</span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{totalClasses}</div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">Nursery to Class 12</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <IndianRupee className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Payroll</span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">₹{totalPayroll.toLocaleString('en-IN')}</div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">Monthly commitment for {filteredRecords.length} staff</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tuition Revenue</span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">₹{annualTuitionRevenue.toLocaleString('en-IN')}</div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">Annual institutional collection</p>
        </div>
      </div>

      {/* Row 2 Analytical Cards (4 cards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft">
          <span className="text-xs text-slate-500 font-semibold">Average Salary</span>
          <div className="text-xl font-extrabold text-slate-800 mt-1">₹{averageSalary.toLocaleString('en-IN')}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Per staff monthly cost</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft">
          <span className="text-xs text-slate-500 font-semibold">Average Student Fee</span>
          <div className="text-xl font-extrabold text-slate-800 mt-1">₹{averageFee.toLocaleString('en-IN')}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Annual fee per student</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold">Salary-to-Fee Ratio</span>
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${ratioStatus.color}`}>
              {ratioStatus.label}
            </span>
          </div>
          <div className="text-xl font-extrabold text-slate-800 mt-1">{salaryToFeeRatio}%</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Gross payroll / Tuition collection</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft">
          <span className="text-xs text-slate-500 font-semibold">Outstanding Balance</span>
          <div className="text-xl font-extrabold text-emerald-600 mt-1">₹0</div>
          <p className="text-[10px] text-emerald-600 font-medium mt-0.5">100% reconciled & balanced</p>
        </div>
      </div>

      {/* Visual Charts Grid (2 columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Salary Distribution Donut Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-extrabold text-slate-800">Department Salary Distribution</h3>
              <PieIcon className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-xs text-slate-500">Gross payroll weight across faculties</p>
          </div>

          <div className="h-72 w-full my-4">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={departmentSalaryDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={105}
                  paddingAngle={3}
                >
                  {departmentSalaryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip
                  formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Gross Salary']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px', fontWeight: 'bold' }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-[10px]">
            {departmentSalaryDistribution.slice(0, 6).map((dept, i) => (
              <div key={i} className="flex items-center gap-1.5 truncate">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="font-semibold text-slate-600 truncate">{dept.name}:</span>
                <span className="font-bold text-slate-900">₹{(dept.value / 1000).toFixed(0)}k</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tuition Revenue vs Payroll Bar Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-extrabold text-slate-800">Revenue vs Payroll Outflow</h3>
              <BarChart3 className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-xs text-slate-500">Monthly comparison of tuition fees vs gross payroll expenses</p>
          </div>

          <div className="h-72 w-full my-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueVsPayrollData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 100000).toFixed(0)}L`} />
                <RechartsTooltip
                  formatter={(val, name) => [`₹${Number(val).toLocaleString('en-IN')}`, name === 'payroll' ? 'Gross Payroll' : 'Tuition Fees']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px', fontWeight: 'bold' }}
                />
                <Bar dataKey="tuition" name="Tuition Fee" fill="#10B981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="payroll" name="Payroll Cost" fill="#3B82F6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 pt-2 border-t border-slate-100 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-[#10B981]" />
              <span className="text-slate-600">Tuition Fee Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-[#3B82F6]" />
              <span className="text-slate-600">Gross Payroll Cost</span>
            </div>
          </div>
        </div>
      </div>

      {/* Department Breakdown Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-800">Department Operational Breakdown</h3>
            <p className="text-xs text-slate-500">Staff headcount and budget allocation per department</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="p-3.5 pl-5">Department</th>
                <th className="p-3.5 text-center">Staff Count</th>
                <th className="p-3.5 text-right">Total Monthly Gross</th>
                <th className="p-3.5 text-right">Average Package</th>
                <th className="p-3.5 text-right">% of Total Payroll</th>
                <th className="p-3.5 text-center pr-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {departmentSalaryDistribution.map((dept, idx) => {
                const pct = totalPayroll > 0 ? ((dept.value / totalPayroll) * 100).toFixed(1) : 0;
                const avg = dept.count > 0 ? Math.round(dept.value / dept.count) : 0;
                return (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 pl-5 font-bold text-slate-800">{dept.name}</td>
                    <td className="p-3.5 text-center font-bold text-slate-700">{dept.count}</td>
                    <td className="p-3.5 text-right font-extrabold text-slate-800">₹{dept.value.toLocaleString('en-IN')}</td>
                    <td className="p-3.5 text-right font-semibold text-slate-600">₹{avg.toLocaleString('en-IN')}</td>
                    <td className="p-3.5 text-right font-bold text-blue-600">{pct}%</td>
                    <td className="p-3.5 pr-5 text-center">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Operational
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default SalaryAnalyticsPage;
