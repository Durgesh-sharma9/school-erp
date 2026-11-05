import React, { useState, useMemo } from 'react';
import {
  Users,
  UserPlus,
  ShieldAlert,
  IndianRupee,
  Settings,
  Calendar,
  CalendarRange,
  Clock,
  CheckCircle2,
  Calculator,
  FileSpreadsheet,
  FileText,
  Activity,
  Library,
  Building2,
  Building,
  School,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Download,
  Printer
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { salaryStorage } from './salaryStore';

export function SalaryHubPage({ onNavigate }) {
  const [selectedMonth, setSelectedMonth] = useState('2026-11');
  const records = useMemo(() => salaryStorage.getMonthlyRecords(selectedMonth), [selectedMonth]);
  const departments = useMemo(() => salaryStorage.getDepartments(), []);

  // Aggregated Statistics
  const totalStaff = records.length;
  const teachingStaff = records.filter(r => r.category === 'Teaching' || ['PGT', 'TGT', 'PRT', 'Teacher', 'Music Teacher', 'Principal', 'Vice Principal'].includes(r.designation)).length;
  const nonTeachingStaff = totalStaff - teachingStaff;

  const totalBasic = records.reduce((sum, r) => sum + (r.basic || r.basicSalary || 0), 0);
  const totalGross = records.reduce((sum, r) => sum + (r.grossSalary || r.gross || 0), 0);
  const totalNet = records.reduce((sum, r) => sum + (r.netSalary || r.net || 0), 0);
  const totalDeductions = totalGross - totalNet;

  const leavesToday = 1;
  const workingToday = totalStaff - leavesToday;
  const workingDays = 23;
  const holidays = 0;
  const weeklyOffs = 5;

  const formatCurrency = (val) => {
    return '₹' + Number(val || 0).toLocaleString('en-IN');
  };

  // Department Table & Chart Data
  const departmentData = useMemo(() => {
    const map = {};
    departments.forEach(d => {
      map[d.name] = {
        name: d.name,
        employees: 0,
        monthlyPayroll: 0,
        totalBasic: 0,
        lopDays: 0
      };
    });

    records.forEach(r => {
      const deptName = r.department || 'General';
      if (!map[deptName]) {
        map[deptName] = {
          name: deptName,
          employees: 0,
          monthlyPayroll: 0,
          totalBasic: 0,
          lopDays: 0
        };
      }
      map[deptName].employees += 1;
      map[deptName].monthlyPayroll += r.netSalary || 0;
      map[deptName].totalBasic += r.basicSalary || r.basic || 0;
      map[deptName].lopDays += r.unpaidLeaveDays || 0;
    });

    return Object.values(map)
      .filter(d => d.employees > 0)
      .sort((a, b) => b.employees - a.employees);
  }, [records, departments]);

  const chartData = useMemo(() => {
    return departmentData.slice(0, 8).map(d => ({
      name: d.name.length > 8 ? d.name.substring(0, 8) + '..' : d.name,
      fullName: d.name,
      staff: d.employees,
      payroll: Math.round(d.monthlyPayroll / 1000) // in Thousands (K)
    }));
  }, [departmentData]);

  // Recent system audit logs
  const auditLogs = [
    {
      id: 'log_1',
      time: '12:45 PM',
      date: '05 Nov 2026',
      actor: 'Admin',
      action: 'Payroll Approved',
      details: 'Admin authorized and approved November 2026 salary disbursement for 45 staff members.'
    },
    {
      id: 'log_2',
      time: '11:15 AM',
      date: '05 Nov 2026',
      actor: 'Accountant',
      action: 'Bank Advice Generated',
      details: 'Exported official NEFT/RTGS bank advice file for State Bank of India.'
    },
    {
      id: 'log_3',
      time: '09:30 AM',
      date: '05 Nov 2026',
      actor: 'System',
      action: 'Attendance Recalculation',
      details: 'Automated 23-day calendar locking and LOP validation complete.'
    },
    {
      id: 'log_4',
      time: '04:10 PM',
      date: '04 Nov 2026',
      actor: 'HR Desk',
      action: 'Salary Structure Updated',
      details: 'Updated PF/ESI compliance ceilings according to Rajasthan government guidelines.'
    }
  ];

  return (
    <div className="p-3 sm:p-4 lg:p-5 space-y-4 w-full antialiased text-slate-800 pb-16 min-h-screen bg-[#F4F7F6]/60">
      
      {/* ─── 1. HEADER TOOLBAR (1:1 with Salary Software) ─── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl border border-slate-100 shadow-2xs gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs border border-blue-100">
              <Building2 className="w-3.5 h-3.5" />
              J D International School
            </span>
          </div>
          <h1 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            School HRMS Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time overview of staff, attendance, and payroll operations.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-stretch sm:self-auto justify-between sm:justify-end">
          {/* Month Selector */}
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="text-xs font-black text-slate-800 bg-transparent focus:outline-hidden cursor-pointer"
            >
              <option value="2026-11">November 2026</option>
              <option value="2026-10">October 2026</option>
              <option value="2026-09">September 2026</option>
            </select>
          </div>

          <div className="text-right text-[10px] text-slate-400 font-bold uppercase tracking-wider bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100">
            JD INTERNATIONAL SCHOOL
          </div>
        </div>
      </div>

      {/* ─── 2. BALANCED SUMMARY CARDS GRID (8 Cards - 2 Rows of 4) ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Card 1: Total Staff */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-2xs flex flex-col justify-between hover:shadow-md hover:border-slate-200 transition-all duration-200">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Staff</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900">{totalStaff}</span>
            <p className="text-[10px] text-slate-500 mt-1">Teaching: {teachingStaff} | Support: {nonTeachingStaff}</p>
          </div>
        </div>

        {/* Card 2: Today's Leaves */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-2xs flex flex-col justify-between hover:shadow-md hover:border-slate-200 transition-all duration-200">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Leaves Today</span>
            <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
              <Calendar className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-rose-600">{leavesToday}</span>
            <p className="text-[10px] text-slate-500 mt-1">Working: {workingToday}</p>
          </div>
        </div>

        {/* Card 3: Net Payroll */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-2xs flex flex-col justify-between hover:shadow-md hover:border-slate-200 transition-all duration-200">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Net Payroll</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <IndianRupee className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900">{formatCurrency(totalNet)}</span>
            <p className="text-[10px] text-slate-500 mt-1">Gross: {formatCurrency(totalGross)}</p>
          </div>
        </div>

        {/* Card 4: Paid / Pending */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-2xs flex flex-col justify-between hover:shadow-md hover:border-slate-200 transition-all duration-200">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Paid / Pending</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-xl font-black text-slate-900">{formatCurrency(totalNet)}</span>
            <p className="text-[10px] text-slate-500 mt-1">Pending Release: ₹0</p>
          </div>
        </div>

        {/* Card 5: Payroll Status */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-2xs flex flex-col justify-between hover:shadow-md hover:border-slate-200 transition-all duration-200">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Payroll Status</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <Calculator className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-lg font-black text-emerald-600">Locked</span>
            <p className="text-[10px] text-slate-500 mt-1">Pending Runs: 0</p>
          </div>
        </div>

        {/* Card 6: Departments */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-2xs flex flex-col justify-between hover:shadow-md hover:border-slate-200 transition-all duration-200">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Departments</span>
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Library className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900">{departments.length}</span>
            <p className="text-[10px] text-slate-500 mt-1">Average Staff: {Math.round(totalStaff / (departments.length || 1))} / dept</p>
          </div>
        </div>

        {/* Card 7: Monthly Calendar */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-2xs flex flex-col justify-between hover:shadow-md hover:border-slate-200 transition-all duration-200">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Monthly Calendar</span>
            <span className="p-1.5 rounded-lg bg-teal-50 text-teal-600">
              <CalendarRange className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900">{workingDays} Working Days</span>
            <p className="text-[10px] text-slate-500 mt-1">Holidays: {holidays} | Offs: {weeklyOffs}</p>
          </div>
        </div>

        {/* Card 8: Integrity Alerts */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-2xs flex flex-col justify-between hover:shadow-md hover:border-slate-200 transition-all duration-200">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Integrity Alerts</span>
            <span className="p-1.5 rounded-lg bg-red-50 text-red-600">
              <ShieldAlert className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-red-600">{totalStaff}</span>
            <p className="text-[10px] text-slate-500 mt-1">No Bank: 0 | Missing Docs: {totalStaff}</p>
          </div>
        </div>

      </div>

      {/* ─── 3. QUICK OPERATIONAL SHORTCUTS (1:1 with Salary Software) ─── */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-2xs">
        <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-3">
          Quick Operational Shortcuts
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {[
            { label: 'Register Staff', path: '/payroll-registration', Icon: UserPlus, color: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200/70' },
            { label: 'Process Payroll', path: '/salary-processing', Icon: Calculator, color: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200/70' },
            { label: 'Generate Payslips', path: '/salary-payslips', Icon: FileSpreadsheet, color: 'bg-teal-50 text-teal-700 hover:bg-teal-100 border-teal-200/70' },
            { label: 'Attendance logs', path: '/salary-attendance', Icon: Calendar, color: 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200/70' },
            { label: 'Leave Summary', path: '/salary-attendance', Icon: CalendarRange, color: 'bg-orange-50 text-orange-700 hover:bg-orange-100 border-orange-200/70' },
            { label: 'Staff Directory', path: '/salary-structure', Icon: Users, color: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200/70' },
            { label: 'Detailed Reports', path: '/salary-reports', Icon: FileText, color: 'bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200/70' },
            { label: 'System Settings', path: '/salary-settings', Icon: Settings, color: 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200' }
          ].map((act, i) => {
            const Icon = act.Icon;
            return (
              <button
                key={i}
                type="button"
                onClick={() => onNavigate?.(act.path)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all text-center gap-1.5 cursor-pointer shadow-2xs hover:shadow hover:-translate-y-0.5 active:translate-y-0 ${act.color}`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="text-[10px] font-bold tracking-tight leading-none">{act.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── 4. MAIN STREAMLINED GRID WIDGETS (7 Cols Left / 5 Cols Right) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* LEFT COLUMN: Department Salary & Staff Distribution (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-100 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Library className="w-4 h-4 text-indigo-500" />
                Department Salary & Staff Distribution
              </h3>
              <button
                type="button"
                onClick={() => onNavigate?.('/salary-analytics')}
                className="text-[11px] font-bold text-indigo-600 hover:underline cursor-pointer"
              >
                Full Analytics &rarr;
              </button>
            </div>

            {/* Department Bar Chart */}
            <div className="h-44 bg-slate-50/50 p-2 rounded-xl border border-slate-100">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip
                    formatter={(val) => [`₹${val}k`, 'Monthly Net']}
                    labelFormatter={(label, payload) => payload?.[0]?.payload?.fullName || label}
                  />
                  <Bar dataKey="payroll" fill="#2563eb" radius={[4, 4, 0, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Department Detailed Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-100 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <table className="w-full text-left border-collapse table-auto text-xs min-w-[450px]">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="pl-3 py-2 text-[10px] font-extrabold tracking-wider text-slate-500 uppercase">Department</th>
                    <th className="px-2 py-2 text-[10px] font-extrabold tracking-wider text-slate-500 uppercase text-center">Staff Count</th>
                    <th className="px-2 py-2 text-[10px] font-extrabold tracking-wider text-slate-500 uppercase text-right">Monthly Payroll</th>
                    <th className="px-2 py-2 text-[10px] font-extrabold tracking-wider text-slate-500 uppercase text-right">Average Salary</th>
                    <th className="pr-3 py-2 text-[10px] font-extrabold tracking-wider text-slate-500 uppercase text-center">LOP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {departmentData.map((d, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="pl-3 py-2.5 font-bold text-slate-800 flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        {d.name}
                      </td>
                      <td className="px-2 py-2.5 text-center font-bold text-slate-600">{d.employees}</td>
                      <td className="px-2 py-2.5 text-right font-extrabold text-slate-900">{formatCurrency(d.monthlyPayroll)}</td>
                      <td className="px-2 py-2.5 text-right font-medium text-slate-500">
                        {formatCurrency(d.employees > 0 ? Math.round(d.monthlyPayroll / d.employees) : 0)}
                      </td>
                      <td className="pr-3 py-2.5 text-center">
                        {d.lopDays > 0 ? (
                          <span className="inline-block text-[10px] bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded-md font-bold border border-rose-100">
                            {d.lopDays} LOP
                          </span>
                        ) : (
                          <span className="text-slate-400 font-mono">--</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

          {/* Recent System Audit Logs */}
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-100 shadow-2xs space-y-3">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-blue-500" /> Recent System Audit Logs
            </h3>
            
            <div className="relative border-l-2 border-slate-100 pl-4 space-y-3 ml-2">
              {auditLogs.map((act) => (
                <div key={act.id} className="relative">
                  <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-white" />
                  <div className="bg-slate-50/60 hover:bg-slate-50 border border-slate-100 p-2.5 rounded-xl transition-all text-xs space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-blue-500" />
                        {act.date} • {act.time}
                      </span>
                      <span className="font-bold text-slate-600 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        {act.actor}
                      </span>
                    </div>
                    <p className="font-bold text-slate-800">
                      {act.action}
                    </p>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {act.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Attendance Month Snapshot & Quick Staff Overview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Attendance Month Snapshot */}
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-100 shadow-2xs space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <CalendarRange className="w-4 h-4 text-blue-500" /> Attendance Month Snapshot
              </h3>
              <button
                type="button"
                onClick={() => onNavigate?.('/staff-attendance')}
                className="text-[10px] font-extrabold text-blue-600 hover:underline cursor-pointer"
              >
                View Calendar →
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-slate-50 p-2.5 rounded-xl text-center border border-slate-100">
                <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider">Working Days</span>
                <span className="block text-sm font-black text-slate-800 mt-0.5">{workingDays}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl text-center border border-slate-100">
                <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider">Holidays</span>
                <span className="block text-sm font-black text-slate-800 mt-0.5">{holidays}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl text-center border border-slate-100">
                <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider">Weekly Offs</span>
                <span className="block text-sm font-black text-slate-800 mt-0.5">{weeklyOffs}</span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center text-xs pt-1 border-t border-slate-100">
              <div>
                <span className="block text-[9px] text-slate-500 font-semibold">Paid Leaves</span>
                <span className="block font-bold text-slate-700 mt-0.5">0 d</span>
              </div>
              <div>
                <span className="block text-[9px] text-slate-500 font-semibold">LOP Days</span>
                <span className="block font-bold text-rose-600 mt-0.5">0 d</span>
              </div>
              <div>
                <span className="block text-[9px] text-slate-500 font-semibold">Half Days</span>
                <span className="block font-bold text-amber-600 mt-0.5">0 d</span>
              </div>
              <div>
                <span className="block text-[9px] text-slate-500 font-semibold">Overtime</span>
                <span className="block font-bold text-purple-600 mt-0.5">0h</span>
              </div>
            </div>
          </div>

          {/* Staff Composition Breakdown */}
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-100 shadow-2xs space-y-4">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-600" />
              Staff Composition Breakdown
            </h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700">Teaching Faculty</span>
                  <span className="text-blue-600">{teachingStaff} / {totalStaff} ({Math.round((teachingStaff / totalStaff) * 100)}%)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${Math.round((teachingStaff / totalStaff) * 100)}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700">Support & Administrative Staff</span>
                  <span className="text-emerald-600">{nonTeachingStaff} / {totalStaff} ({Math.round((nonTeachingStaff / totalStaff) * 100)}%)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.round((nonTeachingStaff / totalStaff) * 100)}%` }} />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => onNavigate?.('/salary-structure')}
                className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
              >
                <span>View Salary Structures</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate?.('/salary-processing')}
                className="font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <span>Process Payroll</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Bank Advice & Export Pill */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-2xl p-4 text-white shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-white/10 text-emerald-300">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Disbursement Ready
              </span>
              <span className="text-[10px] font-mono text-slate-400">SBI e-Payment</span>
            </div>

            <div>
              <h4 className="text-sm font-extrabold text-white">November 2026 Bank Transfer Advice</h4>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Export approved NEFT/RTGS payment sheet for 45 verified staff members.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => onNavigate?.('/salary-reports')}
                className="flex-1 py-2 bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold rounded-xl text-center shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Bank Sheet</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate?.('/salary-payslips')}
                className="py-2 px-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl text-center transition cursor-pointer border border-white/20"
              >
                Payslips
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default SalaryHubPage;
