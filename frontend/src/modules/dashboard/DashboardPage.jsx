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
  ArrowRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';

export function DashboardPage({ onNavigate }) {
  const { schoolId, schoolName, switchSchool } = useAuth();

  const [stats, setStats] = useState(() => tenantStore.getDashboardStats(schoolId));
  const [activeReminderTab, setActiveReminderTab] = useState('Today');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const data = tenantStore.getDashboardStats(schoolId);
    setStats(data);
  }, [schoolId]);

  const handleRefreshEstimates = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const refreshed = tenantStore.getDashboardStats(schoolId);
      setStats(refreshed);
      setIsRefreshing(false);
    }, 300);
  };

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
  const expectedHeight = expectedAmount > 0 ? Math.max(18, Math.round((expectedAmount / maxBar) * 120)) : 8;
  const receivedHeight = receivedAmount > 0 ? Math.max(18, Math.round((receivedAmount / maxBar) * 120)) : 8;
  const dueHeight = dueAmount > 0 ? Math.max(18, Math.round((dueAmount / maxBar) * 120)) : 8;

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
    <div className="testmaster-bg min-h-screen p-3 sm:p-5 max-w-[1600px] mx-auto space-y-3.5 pb-28">
      {/* Multi-Tenant Isolation Status Banner */}
      <div className={`p-3 sm:p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs ${
        isNewSchool
          ? 'bg-gradient-to-r from-amber-50 via-orange-50/60 to-white border-amber-200/80 text-amber-950'
          : isSchoolB
          ? 'bg-gradient-to-r from-emerald-50 via-teal-50/60 to-white border-emerald-200/80 text-emerald-950'
          : 'bg-gradient-to-r from-blue-50 via-indigo-50/60 to-white border-blue-200/80 text-indigo-950'
      }`}>
        <div className="flex items-center space-x-2.5">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shadow-2xs shrink-0 ${
            isNewSchool ? 'bg-amber-600' : isSchoolB ? 'bg-emerald-600' : 'bg-indigo-600'
          }`}>
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">{schoolName}</h2>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                isNewSchool
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : isSchoolB
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
              }`}>
                {isNewSchool ? '✨ Fresh Registered Tenant' : isSchoolB ? 'Tenant B (Delhi Public)' : 'Tenant A (J D Intl)'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
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
      <div className="flex items-center space-x-2 text-xs text-slate-500 pt-0.5 pb-0.5">
        <span className="font-bold text-slate-900 text-sm">Dashboard</span>
        <span>&bull;</span>
        <Home className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-500">&bull; Dashboard ({schoolName})</span>
      </div>

      {/* Row 1: 4 Core Top Cards (1:1 Exact Dimensions & Colors, Elevated to Super Admin Polish) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Today Collection (Blue-50 Header) */}
        <div className="bg-white rounded-xl shadow-2xs hover:shadow-xs border border-slate-200/90 overflow-hidden relative select-none transition-all duration-200">
          <button
            onClick={() => onNavigate && onNavigate('/fee-collection')}
            className="absolute top-2 right-2.5 text-slate-400 hover:text-indigo-600 transition-colors"
            title="Open Fee Register"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <div className="bg-gradient-to-r from-blue-50/90 via-indigo-50/40 to-white border-b border-blue-100/80 py-1.5 px-3.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <h3 className="font-bold text-xs text-slate-800 tracking-tight">Today Collection</h3>
          </div>

          <div className="p-3.5 pt-2.5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xl font-black text-slate-900 tracking-tight font-mono">
                ₹{formatINR(stats.todayCollection.total)}
              </span>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-bold px-2 py-0.5 text-[10.5px] rounded-full">
                Receipts: <strong>{stats.todayCollection.receiptsCount}</strong>
              </span>
            </div>

            <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-100">
              <div className="text-left">
                <p className="text-emerald-700 font-bold font-mono leading-none">₹{formatINR(stats.todayCollection.cash)}</p>
                <p className="text-[10.5px] text-slate-500 mt-1 flex items-center font-medium">
                  <span className="text-emerald-600 font-bold mr-1">₹</span> Cash Counter
                </p>
              </div>
              <div className="text-right">
                <p className="text-blue-700 font-bold font-mono leading-none">₹{formatINR(stats.todayCollection.bank)}</p>
                <p className="text-[10.5px] text-slate-500 mt-1 flex items-center justify-end font-medium">
                  <Building2 className="w-3 h-3 text-blue-600 mr-1" /> Bank / Online
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Fee Revenue Summary (Orange-50 Header) */}
        <div className="bg-white rounded-xl shadow-2xs hover:shadow-xs border border-slate-200/90 overflow-hidden relative select-none transition-all duration-200">
          <div className="bg-gradient-to-r from-orange-50/90 via-amber-50/40 to-white border-b border-orange-100/80 py-1.5 px-3.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            <h3 className="font-bold text-xs text-slate-800 tracking-tight">Fee Revenue Summary</h3>
          </div>

          <div className="p-3.5 pt-2.5 space-y-2">
            <p className="text-xl font-black text-slate-900 tracking-tight font-mono">
              ₹{formatINR(stats.feeRevenueSummary.totalRevenue)}
            </p>

            {/* Total Due Row */}
            <div>
              <div className="flex justify-between items-center text-[10px] text-slate-600">
                <span className="font-medium">Total Due</span>
                <span className="font-semibold text-slate-800 font-mono">
                  ₹{formatINR(stats.feeRevenueSummary.totalDue)}{' '}
                  <span className="text-rose-600 font-bold">&nbsp;({stats.feeRevenueSummary.duePercentage}%)</span>
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                <div className="bg-rose-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, stats.feeRevenueSummary.duePercentage || 0)}%` }}></div>
              </div>
            </div>

            {/* Total Received (YTD) Row */}
            <div>
              <div className="flex justify-between items-center text-[10px] text-slate-600">
                <span className="font-medium">Total Received (YTD)</span>
                <span className="font-semibold text-slate-800 font-mono">
                  ₹{formatINR(stats.feeRevenueSummary.totalReceivedYTD)}{' '}
                  <span className="text-emerald-700 font-bold">&nbsp;({stats.feeRevenueSummary.receivedPercentage}%)</span>
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, stats.feeRevenueSummary.receivedPercentage || 0)}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Total Student (Yellow-50 Header with Boy/Girl breakdown) */}
        <div className="bg-white rounded-xl shadow-2xs hover:shadow-xs border border-slate-200/90 overflow-hidden relative select-none transition-all duration-200">
          <div className="bg-gradient-to-r from-amber-50/90 via-yellow-50/40 to-white border-b border-amber-100/80 py-1.5 px-3.5 flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <h3 className="font-bold text-xs text-slate-800 tracking-tight">Total Student</h3>
            </div>
            <span className="text-sm font-black text-slate-900 font-mono flex items-center">
              {stats.totalStudents.total}&nbsp;
              <span className="text-emerald-700 text-[10px] font-bold">({stats.totalStudents.growthRate})</span>
            </span>
          </div>

          <div className="p-3.5 pt-2.5 space-y-2">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="flex items-center text-slate-600 font-medium">
                  <span className="text-blue-600 mr-1.5 font-bold">👦</span> Boy
                </span>
                <span className="font-bold text-slate-900 font-mono">{stats.totalStudents.boys}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center text-slate-600 font-medium">
                  <span className="text-pink-600 mr-1.5 font-bold">👧</span> Girl
                </span>
                <span className="font-bold text-slate-900 font-mono">{stats.totalStudents.girls}</span>
              </div>
            </div>

            <div className="flex justify-between pt-2 border-t border-slate-100 text-[10.5px]">
              <div className="bg-emerald-50 text-emerald-800 border border-emerald-200/70 px-2 py-0.5 rounded-md font-semibold">
                New : <strong className="font-mono">{stats.totalStudents.newAdmissions}</strong>
              </div>
              <div className="bg-purple-50 text-purple-800 border border-purple-200/70 px-2 py-0.5 rounded-md font-semibold">
                Old : <strong className="font-mono">{stats.totalStudents.oldStudents}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Student Attendance (Rose-50 Header) */}
        <div className="bg-white rounded-xl shadow-2xs hover:shadow-xs border border-slate-200/90 overflow-hidden relative select-none transition-all duration-200">
          <button
            onClick={() => onNavigate && onNavigate('/student-attendance')}
            className="absolute top-2 right-2.5 text-slate-400 hover:text-indigo-600 transition-colors"
            title="Mark Attendance"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <div className="bg-gradient-to-r from-rose-50/90 via-pink-50/40 to-white border-b border-rose-100/80 py-1.5 px-3.5 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <h3 className="font-bold text-xs text-slate-800 tracking-tight">Student Attendance</h3>
          </div>

          <div className="p-3.5 pt-2.5">
            <div className="flex justify-between items-baseline mb-3">
              <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                {stats.attendanceToday.trend}
              </span>
              <span className="text-xl font-black text-slate-900 font-mono">
                {stats.attendanceToday.percentage}%
              </span>
            </div>

            <div className="flex justify-around items-center pt-2 border-t border-slate-100 text-xs">
              <div className="text-center">
                <p className="text-rose-600 font-bold font-mono leading-none">{stats.attendanceToday.totalAbsent}</p>
                <p className="text-[10px] text-slate-500 mt-1 font-medium">Absent</p>
              </div>
              <div className="text-center">
                <p className="text-emerald-600 font-bold font-mono leading-none">{stats.attendanceToday.totalPresent}</p>
                <p className="text-[10px] text-slate-500 mt-1 font-medium">Present</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Today's Paymode Summary (Lime-50 Header Grid) */}
      <div className="bg-white rounded-xl shadow-2xs border border-slate-200/90 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-50/70 via-teal-50/40 to-white border-b border-emerald-100 px-3.5 py-2 flex items-center space-x-2">
          <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
            🔍
          </div>
          <h3 className="font-bold text-xs text-slate-800 tracking-tight">
            Today's Paymode Summary
          </h3>
        </div>

        <div className="p-3.5">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 max-w-5xl mx-auto">
            {/* CASH */}
            <div className="flex items-center justify-center space-x-2.5 p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-white hover:border-emerald-300 transition-all">
              <IndianRupee className="w-4 h-4 text-emerald-700" />
              <div className="text-center text-emerald-800">
                <p className="text-xs font-black font-mono leading-none">0</p>
                <p className="text-[10px] font-bold mt-1 text-slate-600 uppercase tracking-wider">CASH</p>
              </div>
            </div>

            {/* BANK */}
            <div className="flex items-center justify-center space-x-2.5 p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-white hover:border-blue-300 transition-all">
              <Building2 className="w-4 h-4 text-blue-700" />
              <div className="text-center text-blue-800">
                <p className="text-xs font-black font-mono leading-none">0</p>
                <p className="text-[10px] font-bold mt-1 text-slate-600 uppercase tracking-wider">BANK</p>
              </div>
            </div>

            {/* CHEQUE */}
            <div className="flex items-center justify-center space-x-2.5 p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-white hover:border-amber-300 transition-all">
              <Receipt className="w-4 h-4 text-amber-600" />
              <div className="text-center text-amber-700">
                <p className="text-xs font-black font-mono leading-none">0</p>
                <p className="text-[10px] font-bold mt-1 text-slate-600 uppercase tracking-wider">CHEQUE</p>
              </div>
            </div>

            {/* ONLINE */}
            <div className="flex items-center justify-center space-x-2.5 p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-white hover:border-sky-300 transition-all">
              <Globe className="w-4 h-4 text-sky-700" />
              <div className="text-center text-sky-800">
                <p className="text-xs font-black font-mono leading-none">0</p>
                <p className="text-[10px] font-bold mt-1 text-slate-600 uppercase tracking-wider">ONLINE</p>
              </div>
            </div>

            {/* UPI */}
            <div className="flex items-center justify-center space-x-2.5 p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-white hover:border-violet-300 transition-all">
              <QrCode className="w-4 h-4 text-violet-700" />
              <div className="text-center text-violet-800">
                <p className="text-xs font-black font-mono leading-none">0</p>
                <p className="text-[10px] font-bold mt-1 text-slate-600 uppercase tracking-wider">UPI</p>
              </div>
            </div>

            {/* DEBIT/CREDIT */}
            <div className="flex items-center justify-center space-x-2.5 p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-white hover:border-fuchsia-300 transition-all">
              <CreditCard className="w-4 h-4 text-fuchsia-700" />
              <div className="text-center text-fuchsia-800">
                <p className="text-xs font-black font-mono leading-none">0</p>
                <p className="text-[10px] font-bold mt-1 text-slate-600 uppercase tracking-wider">CARD</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Estimated Fee Collection Chart, Recent Transactions, and Accounts Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {/* Estimated Fee Collection */}
        <div className="bg-white rounded-xl shadow-2xs border border-slate-200/90 overflow-hidden relative">
          <div className="bg-gradient-to-r from-rose-50/80 via-pink-50/40 to-white border-b border-rose-100 px-3.5 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center text-xs">
                🏦
              </div>
              <h3 className="font-bold text-xs text-slate-800 tracking-tight">
                Estimated Fee Collection
              </h3>
            </div>
            <button
              type="button"
              onClick={handleRefreshEstimates}
              title="Refresh Estimates"
              className="text-slate-400 hover:text-slate-700 cursor-pointer p-1 rounded-md transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
            </button>
          </div>

          <div className="p-3.5">
            <div className="flex items-center justify-center space-x-4 text-[11px] font-semibold mb-3">
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span className="text-slate-700">Expected</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-slate-700">Received</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <span className="text-slate-700">Due</span>
              </span>
            </div>

            {/* Bar Visual Representation */}
            <div className="h-44 flex items-end justify-around border-b border-slate-100 pb-2 px-4">
              <div className="flex flex-col items-center space-y-1.5">
                <div className="w-8 bg-gradient-to-t from-rose-600 to-rose-400 rounded-t-md shadow-2xs transition-all duration-500" style={{ height: `${expectedHeight}px` }}></div>
                <span className="text-[10px] text-slate-500 font-medium">Expected</span>
                <span className="text-[11px] font-bold font-mono text-slate-800">{formatShortAmount(expectedAmount)}</span>
              </div>
              <div className="flex flex-col items-center space-y-1.5">
                <div className="w-8 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-md shadow-2xs transition-all duration-500" style={{ height: `${receivedHeight}px` }}></div>
                <span className="text-[10px] text-slate-500 font-medium">Received</span>
                <span className="text-[11px] font-bold font-mono text-slate-800">{formatShortAmount(receivedAmount)}</span>
              </div>
              <div className="flex flex-col items-center space-y-1.5">
                <div className="w-8 bg-gradient-to-t from-amber-500 to-amber-300 rounded-t-md shadow-2xs transition-all duration-500" style={{ height: `${dueHeight}px` }}></div>
                <span className="text-[10px] text-slate-500 font-medium">Due</span>
                <span className="text-[11px] font-bold font-mono text-slate-800">{formatShortAmount(dueAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions Widget (Orange-50 Header) */}
        <div className="bg-white rounded-xl shadow-2xs border border-slate-200/90 overflow-hidden flex flex-col">
          <div className="bg-gradient-to-r from-orange-50/80 via-amber-50/40 to-white border-b border-orange-100 px-3.5 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center text-xs">
                📜
              </div>
              <h3 className="font-bold text-xs text-slate-800 tracking-tight">
                Recent Transactions
              </h3>
            </div>
          </div>

          <div className="p-4 flex-1 flex flex-col items-center justify-center text-center text-slate-400 text-xs py-10">
            <Receipt className="w-8 h-8 text-slate-300 mb-2" />
            <p className="font-bold text-slate-700 text-xs">No Transactions Today</p>
            <p className="text-[11px] text-slate-400 mt-0.5">All collected receipts will appear here in real-time</p>
          </div>
        </div>

        {/* Accounts Widget (Teal-50 Header) */}
        <div className="bg-white rounded-xl shadow-2xs border border-slate-200/90 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-50/80 via-emerald-50/40 to-white border-b border-teal-100 px-3.5 py-2 flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center text-xs">
              💰
            </div>
            <h3 className="font-bold text-xs text-slate-800 tracking-tight">
              Accounts
            </h3>
          </div>

          <div className="p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              {/* Total Transactions Counter */}
              <div className="w-1/2 flex flex-col items-center justify-center border-r border-slate-100 pr-2">
                <span className="text-4xl font-black text-emerald-600 font-mono leading-none">0</span>
                <span className="text-[11px] text-slate-600 mt-1 font-semibold">Transactions</span>
              </div>

              {/* Today Accounts Mini Table */}
              <div className="w-1/2 pl-2 text-xs">
                <p className="text-[10px] font-bold text-center text-slate-500 uppercase tracking-wider mb-1">Today Ledger</p>
                <div className="grid grid-cols-4 gap-1 text-center font-medium">
                  <div className="p-1 rounded bg-slate-50 border border-slate-100">
                    <span className="text-[9px] text-slate-400 block font-semibold">Cash</span>
                    <span className="font-bold font-mono">0</span>
                  </div>
                  <div className="p-1 rounded bg-slate-50 border border-slate-100">
                    <span className="text-[9px] text-slate-400 block font-semibold">Bank</span>
                    <span className="font-bold font-mono">0</span>
                  </div>
                  <div className="p-1 rounded bg-emerald-50 border border-emerald-100">
                    <span className="text-[9px] text-emerald-700 block font-semibold">Earn</span>
                    <span className="font-bold font-mono text-emerald-700">0</span>
                  </div>
                  <div className="p-1 rounded bg-rose-50 border border-rose-100">
                    <span className="text-[9px] text-rose-700 block font-semibold">Exp</span>
                    <span className="font-bold font-mono text-rose-700">0</span>
                  </div>
                </div>

                <div className="mt-2 text-center">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10.5px] font-bold">
                    Net: 0 ↑
                  </span>
                </div>
              </div>
            </div>

            {/* Year Till Date Summary */}
            <div className="pt-2.5 border-t border-slate-100">
              <p className="text-[10px] text-center font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Year Till Date Summary
              </p>
              <div className="grid grid-cols-3 text-center text-xs gap-1.5">
                <div className="p-1.5 rounded-lg bg-emerald-50/50 border border-emerald-100 text-emerald-900">
                  <p className="text-[9.5px] font-semibold text-emerald-700">Cash</p>
                  <p className="font-bold font-mono text-xs mt-0.5">₹{ytdCash}</p>
                </div>
                <div className="p-1.5 rounded-lg bg-blue-50/50 border border-blue-100 text-blue-900">
                  <p className="text-[9.5px] font-semibold text-blue-700">Bank</p>
                  <p className="font-bold font-mono text-xs mt-0.5">₹{ytdBank}</p>
                </div>
                <div className="p-1.5 rounded-lg bg-amber-50/50 border border-amber-100 text-amber-900">
                  <p className="text-[9.5px] font-semibold text-amber-700">Total</p>
                  <p className="font-bold font-mono text-xs mt-0.5">₹{ytdTotal}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Fee Reminders, Complaints, Calendar, and Staff Attendance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Fee Reminders (Cyan-50 Header) */}
        <div className="bg-white rounded-xl shadow-2xs border border-slate-200/90 overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-50/80 via-sky-50/40 to-white border-b border-cyan-100 px-3.5 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <div className="w-6 h-6 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center text-xs">
                🔔
              </div>
              <h3 className="font-bold text-xs text-slate-800 tracking-tight">Fee Reminders</h3>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-indigo-600 transition-colors" />
          </div>

          <div className="p-3.5">
            <div className="flex border-b border-slate-100 text-xs font-semibold mb-2">
              <button
                onClick={() => setActiveReminderTab('Today')}
                className={`flex-1 pb-1.5 text-center transition-colors cursor-pointer ${
                  activeReminderTab === 'Today' ? 'border-b-2 border-cyan-600 text-cyan-700 font-bold' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setActiveReminderTab('Upcoming')}
                className={`flex-1 pb-1.5 text-center transition-colors cursor-pointer ${
                  activeReminderTab === 'Upcoming' ? 'border-b-2 border-cyan-600 text-cyan-700 font-bold' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Upcoming
              </button>
            </div>
            <div className="py-7 text-center text-xs text-slate-400">
              No fee reminders scheduled for {activeReminderTab.toLowerCase()}
            </div>
          </div>
        </div>

        {/* Complaints (Yellow-50 Header) */}
        <div className="bg-white rounded-xl shadow-2xs border border-slate-200/90 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-50/80 via-yellow-50/40 to-white border-b border-amber-100 px-3.5 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-xs">
                ✏️
              </div>
              <h3 className="font-bold text-xs text-slate-800 tracking-tight">Complaints</h3>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-indigo-600 transition-colors" />
          </div>

          <div className="p-3.5 py-9 text-center text-xs text-slate-400">
            <p className="font-bold text-slate-700">No Open Complaints</p>
            <p className="text-[10.5px] text-slate-400 mt-0.5">Parent &amp; student grievance box clear</p>
          </div>
        </div>

        {/* Calendar (Teal-50 Header) */}
        <div className="bg-white rounded-xl shadow-2xs border border-slate-200/90 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-50/80 via-emerald-50/40 to-white border-b border-teal-100 px-3.5 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <div className="w-6 h-6 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center text-xs">
                📅
              </div>
              <h3 className="font-bold text-xs text-slate-800 tracking-tight">Calendar (October)</h3>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-indigo-600 transition-colors" />
          </div>

          <div className="p-3.5">
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-1.5">
              <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-slate-700">
              {[...Array(31)].map((_, i) => (
                <span
                  key={i}
                  className={`p-1 rounded-md transition-colors ${
                    i + 1 === 10
                      ? 'bg-indigo-600 text-white font-bold shadow-2xs'
                      : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  {i + 1}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Staff Attendance (Orange-50 Header) */}
        <div className="bg-white rounded-xl shadow-2xs border border-slate-200/90 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-50/80 via-amber-50/40 to-white border-b border-orange-100 px-3.5 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <div className="w-6 h-6 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center text-xs">
                👆
              </div>
              <h3 className="font-bold text-xs text-slate-800 tracking-tight">Staff Attendance</h3>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-indigo-600 transition-colors" />
          </div>

          <div className="p-4 space-y-2.5 text-xs">
            <div className="flex justify-between items-center bg-slate-50 border border-slate-100 p-2.5 rounded-lg">
              <span className="font-semibold text-slate-700">Present (P):</span>
              <span className="font-bold text-emerald-600 font-mono text-sm">0</span>
            </div>
            <div className="flex justify-between items-center bg-slate-50 border border-slate-100 p-2.5 rounded-lg">
              <span className="font-semibold text-slate-700">Absent (Ab):</span>
              <span className="font-bold text-rose-600 font-mono text-sm">0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 5: Student Birthdays, Staff Birthdays, Leave Requests, and Live Vehicle Tracking */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Student Birthday ({birthdays.length}) (Pink-50 Header) */}
        <div className="bg-white rounded-xl shadow-2xs border border-slate-200/90 overflow-hidden">
          <div className="bg-gradient-to-r from-pink-50/80 via-rose-50/40 to-white border-b border-pink-100 px-3.5 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <div className="w-6 h-6 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center text-xs">
                🎂
              </div>
              <h3 className="font-bold text-xs text-slate-800 tracking-tight">
                Student Birthday ({birthdays.length})
              </h3>
            </div>
          </div>

          <div className="p-3.5 divide-y divide-slate-100 text-xs">
            {birthdays.length > 0 ? (
              birthdays.map((b, i) => (
                <div key={i} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900 leading-tight">{b.name}</p>
                    <p className="text-[10.5px] text-pink-600 font-semibold mt-0.5">{b.classSec}</p>
                  </div>
                  <span className="text-base" title="Wish Birthday">🎂</span>
                </div>
              ))
            ) : (
              <div className="py-9 text-center text-xs text-slate-400">
                No student birthdays today
              </div>
            )}
          </div>
        </div>

        {/* Staff Birthday (0) (Blue-50 Header) */}
        <div className="bg-white rounded-xl shadow-2xs border border-slate-200/90 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50/80 via-indigo-50/40 to-white border-b border-blue-100 px-3.5 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-xs">
                🎂
              </div>
              <h3 className="font-bold text-xs text-slate-800 tracking-tight">Staff Birthday (0)</h3>
            </div>
          </div>

          <div className="p-3.5 py-11 text-center text-xs text-slate-400">
            No staff birthdays today
          </div>
        </div>

        {/* Staff/Student Leave Request (Blue-50 Header) */}
        <div className="bg-white rounded-xl shadow-2xs border border-slate-200/90 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-50/80 via-blue-50/40 to-white border-b border-indigo-100 px-3.5 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">
                📝
              </div>
              <h3 className="font-bold text-xs text-slate-800 tracking-tight">Staff/Student Leave Request</h3>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-indigo-600 transition-colors" />
          </div>

          <div className="p-3.5 py-11 text-center text-xs text-slate-400">
            No Data Found !
          </div>
        </div>

        {/* Live Vehicle Tracking (Teal-50 Header Table) */}
        <div className="bg-white rounded-xl shadow-2xs border border-slate-200/90 overflow-hidden flex flex-col">
          <div className="bg-gradient-to-r from-teal-50/80 via-emerald-50/40 to-white border-b border-teal-100 px-3.5 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <div className="w-6 h-6 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center text-xs">
                🚌
              </div>
              <h3 className="font-bold text-xs text-slate-800 tracking-tight">Vehicle Tracking</h3>
            </div>
          </div>

          <div className="p-3 overflow-y-auto max-h-48 flex-1">
            <table className="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-1.5">S.No</th>
                  <th className="py-1.5">Vehicle</th>
                  <th className="py-1.5">Driver</th>
                  <th className="py-1.5 text-right">Cap</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {vehicles.length > 0 ? (
                  vehicles.map((v) => (
                    <tr key={v.sNo} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-1.5 text-slate-400 font-mono">{v.sNo}</td>
                      <td className="py-1.5 font-bold text-slate-800">{v.name}</td>
                      <td className="py-1.5 text-slate-600">{v.driver}</td>
                      <td className="py-1.5 text-right font-mono font-bold text-indigo-700">{v.capacity}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-7 text-slate-400">
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
