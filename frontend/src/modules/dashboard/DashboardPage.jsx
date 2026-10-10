import React, { useEffect, useState } from 'react';
import {
  IndianRupee,
  RefreshCw,
  TrendingUp,
  Receipt,
  RotateCcw,
  ExternalLink,
  CreditCard,
  Building2,
  QrCode,
  Globe,
  Wallet,
  Home,
  ChevronRight,
  TrendingDown
} from 'lucide-react';
import axios from 'axios';

export function DashboardPage({ onNavigate }) {
  const [stats, setStats] = useState({
    todayCollection: { total: 0, receiptsCount: 0, cash: 0, bank: 0 },
    feeRevenueSummary: { totalRevenue: 31221901, totalDue: 30943456, totalReceivedYTD: 283445, receivedPercentage: 0.9, duePercentage: 99.1 },
    totalStudents: { total: 928, boys: 494, girls: 434, newAdmissions: 168, oldStudents: 760, growthRate: "18.1% ↑" },
    attendanceToday: { percentage: 0, totalPresent: 0, totalAbsent: 0, trend: "0% ↓" }
  });

  const formatINR = (val) => {
    return Number(val || 0).toLocaleString('en-IN');
  };

  return (
    <div className="bg-[#f3f4f6] min-h-screen p-3 space-y-3">
      {/* Breadcrumb Bar */}
      <div className="flex items-center space-x-2 text-xs text-gray-500 pt-1 pb-1">
        <span className="font-semibold text-gray-800 text-sm">Dashboard</span>
        <span>&bull;</span>
        <Home className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-400">&bull; Dashboard</span>
      </div>

      {/* Row 1: 4 Core Top Cards (1:1 UAB Exact Dimensions & Colors) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        
        {/* Card 1: Today Collection (Blue-50 Header) */}
        <div className="bg-white rounded-md shadow-md border border-slate-200 overflow-hidden relative cursor-grab select-none transition-transform duration-300 hover:scale-[1.02]">
          <button
            onClick={() => onNavigate && onNavigate('/fee-collection')}
            className="absolute top-1 right-2 text-slate-400 hover:text-indigo-600 transition-colors"
            title="Open Fee Register"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          
          <div className="bg-blue-50 border-b border-blue-100 py-1 px-3">
            <h3 className="font-medium text-xs text-slate-800">Today Collection</h3>
          </div>

          <div className="p-3 pt-2">
            <div className="flex justify-between items-center mb-3">
              <span className="text-base font-bold text-slate-900">
                {stats.todayCollection.total}
              </span>
              <span className="bg-green-100 text-green-700 font-semibold px-2 py-0.5 text-[11px] rounded-lg">
                Receipts: <strong>{stats.todayCollection.receiptsCount}</strong>
              </span>
            </div>

            <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-100">
              <div className="text-left">
                <p className="text-green-600 font-bold leading-none">{stats.todayCollection.cash}</p>
                <p className="text-[11px] text-slate-500 mt-0.5 flex items-center">
                  <span className="text-green-600 font-bold mr-1">₹</span> Cash
                </p>
              </div>
              <div className="text-right">
                <p className="text-blue-600 font-bold leading-none">{stats.todayCollection.bank}</p>
                <p className="text-[11px] text-slate-500 mt-0.5 flex items-center justify-end">
                  <Building2 className="w-3 h-3 text-blue-600 mr-1" /> Bank
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Fee Revenue Summary (Orange-50 Header) */}
        <div className="bg-white rounded-md shadow-md border border-slate-200 overflow-hidden relative cursor-grab select-none transition-transform duration-300 hover:scale-[1.02]">
          <div className="bg-orange-50 border-b border-orange-100 py-1 px-3">
            <h3 className="font-medium text-xs text-slate-800">Fee Revenue Summary</h3>
          </div>

          <div className="p-3 pt-2 space-y-2">
            <p className="text-sm font-bold text-slate-900">
              {formatINR(stats.feeRevenueSummary.totalRevenue)}
            </p>

            {/* Total Due Row */}
            <div>
              <div className="flex justify-between items-center text-[10px] text-slate-600">
                <span>Total Due</span>
                <span className="font-semibold">
                  {formatINR(stats.feeRevenueSummary.totalDue)}{' '}
                  <span className="text-red-600 font-bold">&nbsp;(99.1%)</span>
                </span>
              </div>
              <div className="w-full bg-zinc-200 rounded-lg h-1 mt-0.5 overflow-hidden">
                <div className="bg-red-600 h-1 rounded-sm" style={{ width: '99.1%' }}></div>
              </div>
            </div>

            {/* Total Received (YTD) Row */}
            <div>
              <div className="flex justify-between items-center text-[10px] text-slate-600">
                <span>Total Received (YTD)</span>
                <span className="font-semibold">
                  {formatINR(stats.feeRevenueSummary.totalReceivedYTD)}{' '}
                  <span className="text-green-600 font-bold">&nbsp;(0.9%)</span>
                </span>
              </div>
              <div className="w-full bg-zinc-200 rounded-lg h-1 mt-0.5 overflow-hidden">
                <div className="bg-green-500 h-1 rounded-sm" style={{ width: '0.9%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Total Student (Yellow-50 Header with Boy/Girl breakdown) */}
        <div className="bg-white rounded-md shadow-md border border-slate-200 overflow-hidden relative cursor-grab select-none transition-transform duration-300 hover:scale-[1.02]">
          <div className="bg-yellow-50 border-b border-yellow-100 py-1 px-3 flex justify-between items-center">
            <h3 className="font-medium text-xs text-slate-800">Total Student</h3>
            <span className="text-sm font-bold text-slate-900 flex items-center">
              {stats.totalStudents.total}&nbsp;
              <span className="text-green-600 text-[10px] font-semibold">(18.1% ↑)</span>
            </span>
          </div>

          <div className="p-3 pt-2 space-y-2">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between items-center">
                <span className="flex items-center text-slate-600">
                  <span className="text-blue-600 mr-1 font-bold">👦</span> Boy
                </span>
                <span className="font-semibold text-slate-800">{stats.totalStudents.boys}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center text-slate-600">
                  <span className="text-pink-600 mr-1 font-bold">👧</span> Girl
                </span>
                <span className="font-semibold text-slate-800">{stats.totalStudents.girls}</span>
              </div>
            </div>

            <div className="flex justify-between pt-1 border-t border-slate-100 text-[11px]">
              <div className="bg-green-100 text-green-700 px-2 py-0.5 rounded-lg font-medium">
                New : <strong>{stats.totalStudents.newAdmissions}</strong>
              </div>
              <div className="bg-pink-100 text-pink-700 px-2 py-0.5 rounded-lg font-medium">
                Old : <strong>{stats.totalStudents.oldStudents}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Student Attendance (Rose-50 Header) */}
        <div className="bg-white rounded-md shadow-md border border-slate-200 overflow-hidden relative cursor-grab select-none transition-transform duration-300 hover:scale-[1.02]">
          <button
            onClick={() => onNavigate && onNavigate('/student-attendance')}
            className="absolute top-1 right-2 text-slate-400 hover:text-indigo-600 transition-colors"
            title="Mark Attendance"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <div className="bg-rose-50 border-b border-rose-100 py-1 px-3 flex items-center space-x-1.5">
            <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-xs">
              👆
            </div>
            <h3 className="font-medium text-xs text-slate-800">Student Attendance</h3>
          </div>

          <div className="p-3 pt-2">
            <div className="flex justify-between items-baseline mb-3">
              <span className="text-xs font-bold text-red-600">
                {stats.attendanceToday.trend}
              </span>
              <span className="text-sm font-bold text-slate-900">
                {stats.attendanceToday.percentage}
              </span>
            </div>

            <div className="flex justify-around items-center pt-1 border-t border-slate-100 text-xs">
              <div className="text-center">
                <p className="text-pink-600 font-bold leading-none">{stats.attendanceToday.totalAbsent}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Absent</p>
              </div>
              <div className="text-center">
                <p className="text-green-600 font-bold leading-none">{stats.attendanceToday.totalPresent}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Present</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Row 2: Today's Paymode Summary (Lime-50 Header Grid) */}
      <div className="bg-white rounded-md shadow-md border border-slate-200 overflow-hidden">
        <div className="bg-lime-50 border-b border-lime-100 px-3 py-1 flex items-center space-x-1.5">
          <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs">
            🔍
          </div>
          <h3 className="font-medium text-xs text-slate-800">
            Today's Paymode Summary
          </h3>
        </div>

        <div className="p-3">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 max-w-5xl mx-auto">
            {/* CASH */}
            <div className="flex items-center justify-center space-x-2 p-2 rounded border border-slate-100 bg-slate-50/50">
              <IndianRupee className="w-4 h-4 text-green-700" />
              <div className="text-center text-green-700">
                <p className="text-xs font-bold leading-none">0</p>
                <p className="text-[10px] font-semibold mt-0.5 text-slate-600">CASH</p>
              </div>
            </div>

            {/* BANK */}
            <div className="flex items-center justify-center space-x-2 p-2 rounded border border-slate-100 bg-slate-50/50">
              <Building2 className="w-4 h-4 text-red-700" />
              <div className="text-center text-red-700">
                <p className="text-xs font-bold leading-none">0</p>
                <p className="text-[10px] font-semibold mt-0.5 text-slate-600">BANK</p>
              </div>
            </div>

            {/* CHEQUE */}
            <div className="flex items-center justify-center space-x-2 p-2 rounded border border-slate-100 bg-slate-50/50">
              <Receipt className="w-4 h-4 text-orange-500" />
              <div className="text-center text-orange-500">
                <p className="text-xs font-bold leading-none">0</p>
                <p className="text-[10px] font-semibold mt-0.5 text-slate-600">CHEQUE</p>
              </div>
            </div>

            {/* ONLINE */}
            <div className="flex items-center justify-center space-x-2 p-2 rounded border border-slate-100 bg-slate-50/50">
              <Globe className="w-4 h-4 text-blue-700" />
              <div className="text-center text-blue-700">
                <p className="text-xs font-bold leading-none">0</p>
                <p className="text-[10px] font-semibold mt-0.5 text-slate-600">ONLINE</p>
              </div>
            </div>

            {/* UPI */}
            <div className="flex items-center justify-center space-x-2 p-2 rounded border border-slate-100 bg-slate-50/50">
              <QrCode className="w-4 h-4 text-violet-700" />
              <div className="text-center text-violet-700">
                <p className="text-xs font-bold leading-none">0</p>
                <p className="text-[10px] font-semibold mt-0.5 text-slate-600">UPI</p>
              </div>
            </div>

            {/* DEBIT/CREDIT */}
            <div className="flex items-center justify-center space-x-2 p-2 rounded border border-slate-100 bg-slate-50/50">
              <CreditCard className="w-4 h-4 text-fuchsia-700" />
              <div className="text-center text-fuchsia-700">
                <p className="text-xs font-bold leading-none">0</p>
                <p className="text-[10px] font-semibold mt-0.5 text-slate-600">DEBIT/CREDIT</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Estimated Fee Collection Chart & Accounts Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Left: Estimated Fee Collection */}
        <div className="bg-white rounded-md shadow-md border border-slate-200 overflow-hidden relative">
          <div className="bg-rose-50 border-b border-rose-100 px-3 py-1 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-rose-200 text-rose-600 flex items-center justify-center text-xs">
                🏦
              </div>
              <h3 className="font-semibold text-xs text-slate-800">
                Estimated Fee Collection
              </h3>
            </div>
            <button className="text-slate-400 hover:text-slate-700">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-center space-x-4 text-xs font-semibold mb-3">
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span>Expected</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Recieved</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <span>Due</span>
              </span>
            </div>

            {/* Bar Visual Representation */}
            <div className="h-44 flex items-end justify-around border-b border-slate-200 pb-2 px-6">
              <div className="flex flex-col items-center space-y-1">
                <div className="w-8 bg-rose-500 rounded-t" style={{ height: '140px' }}></div>
                <span className="text-[10px] text-slate-500 font-medium">Expected</span>
                <span className="text-[10px] font-bold">3.12 Cr</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <div className="w-8 bg-emerald-500 rounded-t" style={{ height: '10px' }}></div>
                <span className="text-[10px] text-slate-500 font-medium">Recieved</span>
                <span className="text-[10px] font-bold">2.83 L</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <div className="w-8 bg-amber-400 rounded-t" style={{ height: '136px' }}></div>
                <span className="text-[10px] text-slate-500 font-medium">Due</span>
                <span className="text-[10px] font-bold">3.09 Cr</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Accounts Widget (Teal-50 Header) */}
        <div className="bg-white rounded-md shadow-md border border-slate-200 overflow-hidden">
          <div className="bg-teal-50 border-b border-teal-100 px-3 py-1 flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-teal-200 text-teal-700 flex items-center justify-center text-xs">
              💰
            </div>
            <h3 className="font-semibold text-xs text-slate-800">
              Accounts
            </h3>
          </div>

          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              {/* Total Transactions Counter */}
              <div className="w-1/2 flex flex-col items-center justify-center border-r border-slate-100 pr-3">
                <span className="text-5xl font-extrabold text-green-500 leading-none">0</span>
                <span className="text-xs text-slate-600 mt-1 font-medium">Transactions</span>
              </div>

              {/* Today Accounts Mini Table */}
              <div className="w-1/2 pl-3 text-xs">
                <p className="text-[11px] font-bold text-center text-slate-500 mb-1">Today</p>
                <div className="grid grid-cols-4 gap-1 text-center font-medium">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Cash</span>
                    <span className="font-bold">0</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Bank</span>
                    <span className="font-bold">0</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-green-600 block">Earning</span>
                    <span className="font-bold text-green-600">0</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-red-600 block">Expense</span>
                    <span className="font-bold text-red-600">0</span>
                  </div>
                </div>

                <div className="mt-2 text-center">
                  <span className="inline-block px-2.5 py-0.5 rounded bg-green-100 text-green-700 text-xs font-bold">
                    : 0 ↑
                  </span>
                </div>
              </div>
            </div>

            {/* Year Till Date Summary */}
            <div className="pt-2 border-t border-slate-100">
              <p className="text-[10px] text-center font-bold text-slate-400 uppercase tracking-wider mb-2">
                Year Till Date
              </p>
              <div className="grid grid-cols-3 text-center text-xs">
                <div className="text-green-700">
                  <p className="text-[10px] font-semibold text-slate-500">Cash</p>
                  <p className="font-bold font-mono">43,355</p>
                </div>
                <div className="text-blue-700">
                  <p className="text-[10px] font-semibold text-slate-500">Bank</p>
                  <p className="font-bold font-mono">2,07,090</p>
                </div>
                <div className="text-orange-700">
                  <p className="text-[10px] font-semibold text-slate-500">Total</p>
                  <p className="font-bold font-mono">2,50,445</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
