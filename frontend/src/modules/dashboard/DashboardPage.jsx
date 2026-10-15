import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { tenantStore } from '../../services/tenantStore';
import {
  IndianRupee,
  RefreshCw,
  ExternalLink,
  CreditCard,
  Building2,
  QrCode,
  Globe,
  Receipt,
  Home,
  Cake,
  Calendar as CalendarIcon,
  Bell,
  Bus,
  Clock,
  UserCheck,
  FileText,
  AlertCircle,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export function DashboardPage({ onNavigate }) {
  const { schoolId, schoolName, switchSchool } = useAuth();

  const [stats, setStats] = useState(() => tenantStore.getDashboardStats(schoolId));
  const [activeReminderTab, setActiveReminderTab] = useState('Today');

  useEffect(() => {
    const data = tenantStore.getDashboardStats(schoolId);
    setStats(data);
  }, [schoolId]);

  const formatINR = (val) => {
    return Number(val || 0).toLocaleString('en-IN');
  };

  const formatShortAmount = (amount) => {
    if (!amount || amount === 0) return '₹0';
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)} k`;
    return `₹${amount}`;
  };

  const isSchoolA = schoolId === 'sch_jd_intl';
  const isSchoolB = schoolId === 'sch_dps_branch2';
  const isNewSchool = !isSchoolA && !isSchoolB;

  const expectedAmount = stats?.feeRevenueSummary?.totalRevenue || 0;
  const receivedAmount = stats?.feeRevenueSummary?.totalReceivedYTD || 0;
  const dueAmount = stats?.feeRevenueSummary?.totalDue || 0;
  const maxBar = Math.max(expectedAmount, receivedAmount, dueAmount, 1);
  const expectedHeight = expectedAmount > 0 ? Math.max(16, Math.round((expectedAmount / maxBar) * 120)) : 8;
  const receivedHeight = receivedAmount > 0 ? Math.max(16, Math.round((receivedAmount / maxBar) * 120)) : 8;
  const dueHeight = dueAmount > 0 ? Math.max(16, Math.round((dueAmount / maxBar) * 120)) : 8;

  const ytdCash = isSchoolA ? '43,355' : isSchoolB ? '18,500' : '0';
  const ytdBank = isSchoolA ? '2,07,090' : isSchoolB ? '85,000' : '0';
  const ytdTotal = isSchoolA ? '2,50,445' : isSchoolB ? '1,03,500' : '0';

  // Live vehicles data strictly partitioned per school (0 dummy data for newly registered school)
  const vehicles = isSchoolB ? [
    { sNo: 1, name: "[DL01PA4512] School Bus 1", driver: "[1] MANOJ KUMAR", capacity: 45, status: "Active" },
    { sNo: 2, name: "[DL01PA4513] School Bus 2", driver: "[2] SATISH CHANDRA", capacity: 40, status: "Active" }
  ] : isSchoolA ? [
    { sNo: 1, name: "[RJ02PA2762] Bus", driver: "[5] SHAITAN SINGH", capacity: 42, status: "Active" },
    { sNo: 2, name: "[RJ14PC1019] Bus", driver: "[1] HANSRAJ JAT", capacity: 42, status: "Active" },
    { sNo: 3, name: "[RJ14PC1037] Bus", driver: "[10] PRAKASH CHOUDHARY", capacity: 50, status: "Active" },
    { sNo: 4, name: "[RJ14PC2278] Bus", driver: "[7] SHYAM SUNDER", capacity: 40, status: "Active" },
    { sNo: 5, name: "[RJ14PC5938] Bus", driver: "[8] NARESH", capacity: 45, status: "Active" },
    { sNo: 6, name: "[RJ14PC7878] Bus", driver: "[6] BABU LAL", capacity: 42, status: "Active" },
    { sNo: 7, name: "[RJ14PE0832] Van", driver: "[3] RAMESH MEENA", capacity: 25, status: "Active" }
  ] : [];

  // Live student birthdays strictly partitioned per school (0 dummy data for newly registered school)
  const birthdays = isSchoolB ? [
    { name: "ROHAN SHARMA", classSec: "Class 10-A", roll: "01" },
    { name: "PRIYA PATEL", classSec: "Class 9-B", roll: "02" }
  ] : isSchoolA ? [
    { name: "DHRITI YADAV", classSec: "Lower Kindergarten - PP4+-A", roll: "12" },
    { name: "ABHIMANYU DUBEY", classSec: "VI-A", roll: "04" },
    { name: "ARYA KUMARI", classSec: "IX-A", roll: "18" }
  ] : [];

  return (
    <div className="bg-[#f3f4f6] min-h-screen p-3 space-y-3">
      {/* Multi-Tenant Isolation Status Banner */}
      <div className={`p-3 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs ${
        isNewSchool
          ? 'bg-gradient-to-r from-amber-50 via-orange-50 to-white border-amber-200'
          : isSchoolB
          ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-white border-emerald-200'
          : 'bg-gradient-to-r from-blue-50 via-indigo-50 to-white border-blue-200'
      }`}>
        <div className="flex items-center space-x-2.5">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shadow-xs ${
            isNewSchool ? 'bg-amber-600' : isSchoolB ? 'bg-emerald-600' : 'bg-blue-600'
          }`}>
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-bold text-slate-800">{schoolName}</h2>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                isNewSchool
                  ? 'bg-amber-100 text-amber-800'
                  : isSchoolB
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {isNewSchool ? '✨ Fresh Registered Tenant' : isSchoolB ? 'Tenant B (Delhi Public)' : 'Tenant A (J D Intl)'}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {isNewSchool ? (
                <span>
                  🛡️ <strong>Zero Data Sandbox:</strong> Newly registered school. Zero dummy data, 0 records from other schools. Start by registering students and fee structure.
                </span>
              ) : (
                <span>
                  🔒 <strong>Multi-Tenant Data Sandbox:</strong> School A ka data School B me nahi dikhega. Viewing strictly isolated metrics.
                </span>
              )}
            </p>
          </div>
        </div>

        {/* 1-Tap Switcher Pill for Testing */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            type="button"
            onClick={() => switchSchool(isSchoolB ? 'sch_jd_intl' : 'sch_dps_branch2')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 flex items-center space-x-1.5 shadow-2xs transition-all cursor-pointer"
          >
            <span>Switch Demo: {isSchoolB ? 'School A' : 'School B'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Breadcrumb Bar */}
      <div className="flex items-center space-x-2 text-xs text-gray-500 pt-1 pb-1">
        <span className="font-semibold text-gray-800 text-sm">Dashboard</span>
        <span>&bull;</span>
        <Home className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-400">&bull; Dashboard ({schoolName})</span>
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
                  <span className="text-red-600 font-bold">&nbsp;({stats.feeRevenueSummary.duePercentage}%)</span>
                </span>
              </div>
              <div className="w-full bg-zinc-200 rounded-lg h-1 mt-0.5 overflow-hidden">
                <div className="bg-red-600 h-1 rounded-sm" style={{ width: `${Math.min(100, stats.feeRevenueSummary.duePercentage || 0)}%` }}></div>
              </div>
            </div>

            {/* Total Received (YTD) Row */}
            <div>
              <div className="flex justify-between items-center text-[10px] text-slate-600">
                <span>Total Received (YTD)</span>
                <span className="font-semibold">
                  {formatINR(stats.feeRevenueSummary.totalReceivedYTD)}{' '}
                  <span className="text-green-600 font-bold">&nbsp;({stats.feeRevenueSummary.receivedPercentage}%)</span>
                </span>
              </div>
              <div className="w-full bg-zinc-200 rounded-lg h-1 mt-0.5 overflow-hidden">
                <div className="bg-green-500 h-1 rounded-sm" style={{ width: `${Math.min(100, stats.feeRevenueSummary.receivedPercentage || 0)}%` }}></div>
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
              <span className="text-green-600 text-[10px] font-semibold">({stats.totalStudents.growthRate})</span>
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

      {/* Row 3: Estimated Fee Collection Chart, Recent Transactions, and Accounts Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Estimated Fee Collection */}
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
            <button
              type="button"
              onClick={() => {
                const refreshed = tenantStore.getDashboardStats(schoolId);
                setStats(refreshed);
              }}
              title="Refresh Estimates"
              className="text-slate-400 hover:text-slate-700 cursor-pointer p-1 rounded"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-3">
            <div className="flex items-center justify-center space-x-3 text-[11px] font-semibold mb-2">
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
            <div className="h-40 flex items-end justify-around border-b border-slate-200 pb-2 px-4">
              <div className="flex flex-col items-center space-y-1">
                <div className="w-7 bg-rose-500 rounded-t transition-all duration-500" style={{ height: `${expectedHeight}px` }}></div>
                <span className="text-[10px] text-slate-500 font-medium">Expected</span>
                <span className="text-[10px] font-bold">{formatShortAmount(expectedAmount)}</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <div className="w-7 bg-emerald-500 rounded-t transition-all duration-500" style={{ height: `${receivedHeight}px` }}></div>
                <span className="text-[10px] text-slate-500 font-medium">Recieved</span>
                <span className="text-[10px] font-bold">{formatShortAmount(receivedAmount)}</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <div className="w-7 bg-amber-400 rounded-t transition-all duration-500" style={{ height: `${dueHeight}px` }}></div>
                <span className="text-[10px] text-slate-500 font-medium">Due</span>
                <span className="text-[10px] font-bold">{formatShortAmount(dueAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions Widget (Orange-50 Header) */}
        <div className="bg-white rounded-md shadow-md border border-slate-200 overflow-hidden flex flex-col">
          <div className="bg-orange-50 border-b border-orange-100 px-3 py-1 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-orange-200 text-orange-700 flex items-center justify-center text-xs">
                📜
              </div>
              <h3 className="font-semibold text-xs text-slate-800">
                Recent Transactions
              </h3>
            </div>
          </div>

          <div className="p-3 flex-1 flex flex-col items-center justify-center text-center text-slate-400 text-xs py-8">
            <Receipt className="w-8 h-8 text-slate-300 mb-2" />
            <p className="font-semibold text-slate-500">No Transactions Today</p>
            <p className="text-[10px] text-slate-400">All collected receipts will appear here in real-time</p>
          </div>
        </div>

        {/* Accounts Widget (Teal-50 Header) */}
        <div className="bg-white rounded-md shadow-md border border-slate-200 overflow-hidden">
          <div className="bg-teal-50 border-b border-teal-100 px-3 py-1 flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-teal-200 text-teal-700 flex items-center justify-center text-xs">
              💰
            </div>
            <h3 className="font-semibold text-xs text-slate-800">
              Accounts
            </h3>
          </div>

          <div className="p-3 space-y-2">
            <div className="flex items-center justify-between">
              {/* Total Transactions Counter */}
              <div className="w-1/2 flex flex-col items-center justify-center border-r border-slate-100 pr-2">
                <span className="text-4xl font-extrabold text-green-500 leading-none">0</span>
                <span className="text-xs text-slate-600 mt-1 font-medium">Transactions</span>
              </div>

              {/* Today Accounts Mini Table */}
              <div className="w-1/2 pl-2 text-xs">
                <p className="text-[10px] font-bold text-center text-slate-500 mb-0.5">Today</p>
                <div className="grid grid-cols-4 gap-1 text-center font-medium">
                  <div>
                    <span className="text-[9px] text-slate-400 block">Cash</span>
                    <span className="font-bold">0</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block">Bank</span>
                    <span className="font-bold">0</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-green-600 block">Earning</span>
                    <span className="font-bold text-green-600">0</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-red-600 block">Expense</span>
                    <span className="font-bold text-red-600">0</span>
                  </div>
                </div>

                <div className="mt-1 text-center">
                  <span className="inline-block px-2 py-0.5 rounded bg-green-100 text-green-700 text-[11px] font-bold">
                    : 0 ↑
                  </span>
                </div>
              </div>
            </div>

            {/* Year Till Date Summary */}
            <div className="pt-2 border-t border-slate-100">
              <p className="text-[10px] text-center font-bold text-slate-400 uppercase tracking-wider mb-1">
                Year Till Date
              </p>
              <div className="grid grid-cols-3 text-center text-xs">
                <div className="text-green-700">
                  <p className="text-[9px] font-semibold text-slate-500">Cash</p>
                  <p className="font-bold font-mono">₹{ytdCash}</p>
                </div>
                <div className="text-blue-700">
                  <p className="text-[9px] font-semibold text-slate-500">Bank</p>
                  <p className="font-bold font-mono">₹{ytdBank}</p>
                </div>
                <div className="text-orange-700">
                  <p className="text-[9px] font-semibold text-slate-500">Total</p>
                  <p className="font-bold font-mono">₹{ytdTotal}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Fee Reminders, Complaints, Calendar, and Staff Attendance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Fee Reminders (Cyan-50 Header) */}
        <div className="bg-white rounded-md shadow-md border border-slate-200 overflow-hidden">
          <div className="bg-cyan-50 border-b border-cyan-100 px-3 py-1 flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <div className="w-6 h-6 rounded-full bg-cyan-200 text-blue-600 flex items-center justify-center text-xs">
                🔔
              </div>
              <h3 className="font-semibold text-xs text-slate-800">Fee Reminders</h3>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 cursor-pointer" />
          </div>

          <div className="p-3">
            <div className="flex border-b border-slate-100 text-xs font-semibold mb-2">
              <button
                onClick={() => setActiveReminderTab('Today')}
                className={`flex-1 pb-1 text-center ${activeReminderTab === 'Today' ? 'border-b-2 border-cyan-500 text-cyan-600 font-bold' : 'text-slate-400'}`}
              >
                Today
              </button>
              <button
                onClick={() => setActiveReminderTab('Upcoming')}
                className={`flex-1 pb-1 text-center ${activeReminderTab === 'Upcoming' ? 'border-b-2 border-cyan-500 text-cyan-600 font-bold' : 'text-slate-400'}`}
              >
                Upcoming
              </button>
            </div>
            <div className="py-6 text-center text-xs text-slate-400">
              No fee reminders scheduled for {activeReminderTab.toLowerCase()}
            </div>
          </div>
        </div>

        {/* Complaints (Yellow-50 Header) */}
        <div className="bg-white rounded-md shadow-md border border-slate-200 overflow-hidden">
          <div className="bg-yellow-50 border-b border-yellow-100 px-3 py-1 flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <div className="w-6 h-6 rounded-full bg-yellow-200 text-yellow-800 flex items-center justify-center text-xs">
                ✏️
              </div>
              <h3 className="font-semibold text-xs text-slate-800">Complaints</h3>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 cursor-pointer" />
          </div>

          <div className="p-3 py-8 text-center text-xs text-slate-400">
            <p className="font-medium">No Open Complaints</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Parent and student grievance box clear</p>
          </div>
        </div>

        {/* Calendar (Teal-50 Header) */}
        <div className="bg-white rounded-md shadow-md border border-slate-200 overflow-hidden">
          <div className="bg-teal-50 border-b border-teal-100 px-3 py-1 flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <div className="w-6 h-6 rounded-full bg-teal-200 text-teal-700 flex items-center justify-center text-xs">
                📅
              </div>
              <h3 className="font-semibold text-xs text-slate-800">Calendar (Oct)</h3>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 cursor-pointer" />
          </div>

          <div className="p-3">
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-slate-400 mb-1">
              <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-700">
              {[...Array(31)].map((_, i) => (
                <span
                  key={i}
                  className={`p-1 rounded ${i + 1 === 10 ? 'bg-indigo-600 text-white font-bold' : 'hover:bg-slate-100'}`}
                >
                  {i + 1}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Staff Attendance (Orange-50 Header) */}
        <div className="bg-white rounded-md shadow-md border border-slate-200 overflow-hidden">
          <div className="bg-orange-50 border-b border-orange-100 px-3 py-1 flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs">
                👆
              </div>
              <h3 className="font-semibold text-xs text-slate-800">Staff Attendance</h3>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 cursor-pointer" />
          </div>

          <div className="p-4 space-y-2 text-xs">
            <div className="flex justify-between items-center bg-slate-50 p-2 rounded">
              <span className="font-semibold text-slate-700">Present (P):</span>
              <span className="font-bold text-emerald-600 font-mono">0</span>
            </div>
            <div className="flex justify-between items-center bg-slate-50 p-2 rounded">
              <span className="font-semibold text-slate-700">Absent (Ab):</span>
              <span className="font-bold text-rose-600 font-mono">0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 5: Student Birthdays, Staff Birthdays, Leave Requests, and Live Vehicle Tracking */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Student Birthday (3) (Pink-50 Header) */}
        {/* Student Birthday ({birthdays.length}) (Pink-50 Header) */}
        <div className="bg-white rounded-md shadow-md border border-slate-200 overflow-hidden">
          <div className="bg-pink-50 border-b border-pink-100 px-3 py-1 flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <div className="w-6 h-6 rounded-full bg-pink-200 text-pink-600 flex items-center justify-center text-xs">
                🎂
              </div>
              <h3 className="font-semibold text-xs text-slate-800">Student Birthday ({birthdays.length})</h3>
            </div>
          </div>

          <div className="p-3 divide-y divide-slate-100 text-xs">
            {birthdays.length > 0 ? (
              birthdays.map((b, i) => (
                <div key={i} className="py-2 first:pt-0 last:pb-0">
                  <p className="font-bold text-slate-900">{b.name}</p>
                  <p className="text-[11px] text-pink-600 font-medium">{b.classSec}</p>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-slate-400">
                No student birthdays today
              </div>
            )}
          </div>
        </div>

        {/* Staff Birthday (0) (Blue-50 Header) */}
        <div className="bg-white rounded-md shadow-md border border-slate-200 overflow-hidden">
          <div className="bg-blue-50 border-b border-blue-100 px-3 py-1 flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <div className="w-6 h-6 rounded-full bg-blue-200 text-blue-600 flex items-center justify-center text-xs">
                🎂
              </div>
              <h3 className="font-semibold text-xs text-slate-800">Staff Birthday (0)</h3>
            </div>
          </div>

          <div className="p-3 py-10 text-center text-xs text-slate-400">
            No staff birthdays today
          </div>
        </div>

        {/* Staff/Student Leave Request (Blue-50 Header) */}
        <div className="bg-white rounded-md shadow-md border border-slate-200 overflow-hidden">
          <div className="bg-blue-50 border-b border-blue-100 px-3 py-1 flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <div className="w-6 h-6 rounded-full bg-blue-200 text-blue-600 flex items-center justify-center text-xs">
                📝
              </div>
              <h3 className="font-semibold text-xs text-slate-800">Staff/Student Leave Request</h3>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 cursor-pointer" />
          </div>

          <div className="p-3 py-10 text-center text-xs text-slate-400">
            No Data Found !
          </div>
        </div>

        {/* Live Vehicle Tracking (Teal-50 Header Table) */}
        <div className="bg-white rounded-md shadow-md border border-slate-200 overflow-hidden flex flex-col">
          <div className="bg-teal-50 border-b border-teal-100 px-3 py-1 flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <div className="w-6 h-6 rounded-full bg-teal-200 text-teal-700 flex items-center justify-center text-xs">
                🚌
              </div>
              <h3 className="font-semibold text-xs text-slate-800">Vehicle Tracking</h3>
            </div>
          </div>

          <div className="p-2 overflow-y-auto max-h-48 flex-1">
            <table className="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                  <th className="py-1">S.No</th>
                  <th className="py-1">Vehicle</th>
                  <th className="py-1">Driver</th>
                  <th className="py-1 text-right">Cap</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {vehicles.length > 0 ? (
                  vehicles.map((v) => (
                    <tr key={v.sNo}>
                      <td className="py-1 text-slate-400 font-mono">{v.sNo}</td>
                      <td className="py-1 font-semibold text-slate-800">{v.name}</td>
                      <td className="py-1 text-slate-600">{v.driver}</td>
                      <td className="py-1 text-right font-mono font-bold text-indigo-700">{v.capacity}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-slate-400">
                      No vehicles registered yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}
