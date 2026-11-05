import React, { useState, useMemo } from 'react';
import {
  IndianRupee,
  Calculator,
  Users,
  CheckCircle2,
  Clock,
  FileText,
  FileDown,
  Printer,
  Home,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Building,
  Sparkles,
  ArrowUpRight,
  Calendar,
  Layers,
  Search,
  PieChart,
  SlidersHorizontal,
  CreditCard
} from 'lucide-react';
import { salaryStorage } from './salaryStore';

export function SalaryHubPage({ onNavigate }) {
  const [selectedMonth, setSelectedMonth] = useState('2026-11');
  const records = useMemo(() => salaryStorage.getMonthlyRecords(selectedMonth), [selectedMonth]);
  const policies = useMemo(() => salaryStorage.getPolicies(), []);

  // Summary Metrics
  const totalStaff = records.length;
  const totalGross = records.reduce((acc, r) => acc + (r.grossSalary || 0), 0);
  const totalDeductions = records.reduce((acc, r) => acc + (r.totalDeductions || 0), 0);
  const totalNet = records.reduce((acc, r) => acc + (r.netSalary || 0), 0);
  const totalEpf = records.reduce((acc, r) => acc + (r.epf || 0), 0);
  const totalEsi = records.reduce((acc, r) => acc + (r.esi || 0), 0);
  const totalPt = records.reduce((acc, r) => acc + (r.professionalTax || 0), 0);

  const disbursedCount = records.filter(r => r.status === 'Disbursed').length;
  const approvedCount = records.filter(r => r.status === 'Approved').length;
  const pendingCount = records.filter(r => r.status === 'Draft' || !r.status).length;

  // Department Breakdown
  const deptSummary = useMemo(() => {
    const map = {};
    records.forEach(r => {
      const dept = r.department || 'General';
      if (!map[dept]) map[dept] = { count: 0, totalNet: 0 };
      map[dept].count += 1;
      map[dept].totalNet += r.netSalary || 0;
    });
    return Object.entries(map).map(([name, data]) => ({
      name,
      ...data,
      percent: totalNet > 0 ? Math.round((data.totalNet / totalNet) * 100) : 0
    })).sort((a, b) => b.totalNet - a.totalNet);
  }, [records, totalNet]);

  const getInitials = (name) => {
    if (!name) return 'ST';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      {/* 1:1 Executive Toolbar */}
      <div className="bg-white border-b border-slate-200/80 px-6 py-4 sticky top-0 z-20 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
            <IndianRupee className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-slate-900 tracking-tight">Salary & Compensation Hub</h1>
              <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-2xs">
                JD International School
              </span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
              <button onClick={() => onNavigate?.('/')} className="hover:text-emerald-600 flex items-center transition">
                <Home className="w-3.5 h-3.5 mr-1" />
                Home
              </button>
              <span>•</span>
              <span className="text-slate-700 font-semibold">Salary Studio Overview</span>
            </div>
          </div>
        </div>

        {/* Month Selector & Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-600">Payroll Month:</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="text-xs font-black text-slate-800 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="2026-11">November 2026</option>
              <option value="2026-10">October 2026</option>
              <option value="2026-09">September 2026</option>
            </select>
          </div>

          <button
            onClick={() => onNavigate?.('/salary-processing')}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/30 transition cursor-pointer"
          >
            <Calculator className="w-4 h-4" />
            Process Salary
          </button>

          <button
            onClick={() => onNavigate?.('/salary-payslips')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl shadow-2xs transition cursor-pointer"
          >
            <FileText className="w-4 h-4 text-emerald-600" />
            Payslips Studio
          </button>

          <button
            onClick={() => onNavigate?.('/salary-settings')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl shadow-2xs transition cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
            Salary Settings
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* KPI Stats Cards (4 Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Net Payroll */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs relative overflow-hidden group hover:border-emerald-300 transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Net Disbursement</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
                ₹
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              ₹{totalNet.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500">
              <span className="text-emerald-600 font-bold flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-0.5" />
                {disbursedCount + approvedCount} Ready
              </span>
              <span>&bull; Gross: ₹{totalGross.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Card 2: Total Deductions */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs relative overflow-hidden group hover:border-rose-300 transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Held Deductions</span>
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-black">
                <ShieldCheck className="w-4.5 h-4.5" />
              </div>
            </div>
            <div className="text-2xl font-black text-rose-600 tracking-tight">
              -₹{totalDeductions.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500">
              <span>EPF: ₹{totalEpf}</span>
              <span>&bull; ESIC: ₹{totalEsi}</span>
              <span>&bull; PT: ₹{totalPt}</span>
            </div>
          </div>

          {/* Card 3: Active Staff Count */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs relative overflow-hidden group hover:border-blue-300 transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Staff Members</span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Users className="w-4.5 h-4.5" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {totalStaff} Members
            </div>
            <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500">
              <span className="text-blue-600 font-bold">{deptSummary.length} Departments</span>
              <span>&bull; Active School Staff</span>
            </div>
          </div>

          {/* Card 4: Average Monthly Compensation */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs relative overflow-hidden group hover:border-amber-300 transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Average Net Salary</span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <TrendingUp className="w-4.5 h-4.5" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              ₹{totalStaff > 0 ? Math.round(totalNet / totalStaff).toLocaleString('en-IN') : 0}
            </div>
            <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500">
              <span>Per employee per month</span>
            </div>
          </div>
        </div>

        {/* Main 2-Column Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Recent Salary Disbursement Roster (8 Cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col">
            <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Staff Payroll Roster &mdash; {selectedMonth}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {records.length} Real Active Staff
                </span>
              </div>

              <button
                onClick={() => onNavigate?.('/salary-processing')}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 hover:underline cursor-pointer"
              >
                Open Processing Studio
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-500 font-extrabold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Employee</th>
                    <th className="py-3 px-3">Department</th>
                    <th className="py-3 px-3 text-right">Gross (₹)</th>
                    <th className="py-3 px-3 text-right">Deductions</th>
                    <th className="py-3 px-3 text-right">Net Payable</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {records.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 text-white font-extrabold text-[11px] flex items-center justify-center shadow-xs shrink-0">
                            {getInitials(rec.name)}
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-900">{rec.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono font-bold">{rec.code} &bull; {rec.designation}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-block px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-700">
                          {rec.department}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-slate-700">
                        ₹{rec.grossSalary?.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-rose-600">
                        -₹{rec.totalDeductions?.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 text-right font-black text-emerald-600 text-sm">
                        ₹{rec.netSalary?.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                          {rec.status || 'Approved'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            try {
                              localStorage.setItem('salary_payslip_selected_staff', rec.id);
                            } catch (e) {}
                            onNavigate?.('/salary-payslips');
                          }}
                          className="px-2.5 py-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition cursor-pointer"
                        >
                          Payslip
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium">All {records.length} active JD International School staff loaded</span>
              <button
                onClick={() => onNavigate?.('/salary-processing')}
                className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
              >
                Go to Salary Processing &rarr;
              </button>
            </div>
          </div>

          {/* Right Column: Department Breakdown & Quick Links (4 Cols) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Department Cost Distribution */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <PieChart className="w-4 h-4 text-emerald-600" />
                  Department Cost Distribution
                </h3>
                <button
                  onClick={() => onNavigate?.('/salary-analytics')}
                  className="text-[11px] font-bold text-emerald-600 hover:underline cursor-pointer"
                >
                  Analytics &rarr;
                </button>
              </div>

              <div className="space-y-3.5">
                {deptSummary.slice(0, 5).map(dept => (
                  <div key={dept.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">{dept.name}</span>
                      <span className="font-black text-slate-900">₹{dept.totalNet.toLocaleString('en-IN')} <span className="text-slate-400 font-normal">({dept.percent}%)</span></span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${dept.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Nav Cards */}
            <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900 rounded-2xl p-5 text-white shadow-lg space-y-3">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-white/15 text-white backdrop-blur-xs">
                <Sparkles className="w-3 h-3 text-amber-300" />
                Disbursement Ready
              </span>
              <h4 className="text-base font-extrabold leading-tight">
                November 2026 Salary Workflows
              </h4>
              <p className="text-xs text-indigo-200 leading-relaxed">
                Generate official bank transfer advice, export NEFT/RTGS payment sheets, or manage school allowance structure.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => onNavigate?.('/salary-reports')}
                  className="px-3 py-2 bg-white text-indigo-900 text-xs font-bold rounded-xl text-center shadow-xs hover:bg-indigo-50 transition cursor-pointer"
                >
                  Bank Advice
                </button>
                <button
                  onClick={() => onNavigate?.('/salary-settings')}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold rounded-xl text-center transition cursor-pointer"
                >
                  Salary Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
