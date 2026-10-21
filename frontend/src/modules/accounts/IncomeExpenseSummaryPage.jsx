import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  IndianRupee, 
  BarChart3, 
  PieChart, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function IncomeExpenseSummaryPage() {
  const { schoolName } = useAuth();

  const annualStats = {
    totalRevenueYTD: 31221901,
    totalExpensesYTD: 18450200,
    netSurplusYTD: 12771701,
    operatingMargin: '40.9%'
  };

  const revenueHeads = [
    { name: 'Tuition Fees', amount: 24500000, percentage: 78.5, color: 'bg-emerald-500' },
    { name: 'Transport & Fleet Fees', amount: 3800000, percentage: 12.2, color: 'bg-indigo-500' },
    { name: 'Admission & Registration', amount: 1650000, percentage: 5.3, color: 'bg-blue-500' },
    { name: 'Examination & Board Fees', amount: 820000, percentage: 2.6, color: 'bg-cyan-500' },
    { name: 'Stationery & Uniform Sales', amount: 451901, percentage: 1.4, color: 'bg-amber-500' }
  ];

  const expenseHeads = [
    { name: 'Teaching & Staff Salaries', amount: 12800000, percentage: 69.4, color: 'bg-rose-500' },
    { name: 'Electricity & Utilities', amount: 1850000, percentage: 10.0, color: 'bg-amber-500' },
    { name: 'Transport Fuel & Bus Maintenance', amount: 1420000, percentage: 7.7, color: 'bg-purple-500' },
    { name: 'Campus Repair & Infrastructure', amount: 1100000, percentage: 6.0, color: 'bg-slate-500' },
    { name: 'Lab Equipment & Printing Exam Sheets', amount: 840000, percentage: 4.5, color: 'bg-teal-500' },
    { name: 'Sports, Functions & Student Welfare', amount: 440200, percentage: 2.4, color: 'bg-blue-500' }
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <BarChart3 className="w-6 h-6 text-indigo-600" />
          Institutional Financial Health & P&L Statement
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Session 2026-2027 consolidated revenue inflow, operational expenditures, and institutional surplus.
        </p>
      </div>

      {/* Highlights Top Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Gross Inflow (YTD)</span>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600 mt-2">₹{annualStats.totalRevenueYTD.toLocaleString('en-IN')}</p>
          <p className="text-xs text-slate-500 mt-1 font-medium">99.1% Fee collection realization</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Gross Outflow (YTD)</span>
            <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-rose-600 mt-2">₹{annualStats.totalExpensesYTD.toLocaleString('en-IN')}</p>
          <p className="text-xs text-slate-500 mt-1 font-medium">Payroll, Utilities & Fleet operational costs</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Net Institutional Surplus</span>
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-indigo-700 mt-2">₹{annualStats.netSurplusYTD.toLocaleString('en-IN')}</p>
          <p className="text-xs text-emerald-600 font-semibold mt-1">Healthy positive balance sheet</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Operating Margin</span>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-800 mt-2">{annualStats.operatingMargin}</p>
          <p className="text-xs text-slate-500 mt-1 font-medium">Financial sustainability index</p>
        </div>
      </div>

      {/* Head Wise Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Sources */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            Revenue Inflow Streams
          </h2>
          <div className="space-y-3.5 pt-2">
            {revenueHeads.map(item => (
              <div key={item.name} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>{item.name}</span>
                  <span className="font-mono">₹{item.amount.toLocaleString('en-IN')} ({item.percentage}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className={`${item.color} h-full rounded-full transition-all duration-500`} style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expense Allocations */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-rose-600" />
            Expenditure Disbursements
          </h2>
          <div className="space-y-3.5 pt-2">
            {expenseHeads.map(item => (
              <div key={item.name} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>{item.name}</span>
                  <span className="font-mono">₹{item.amount.toLocaleString('en-IN')} ({item.percentage}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className={`${item.color} h-full rounded-full transition-all duration-500`} style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
