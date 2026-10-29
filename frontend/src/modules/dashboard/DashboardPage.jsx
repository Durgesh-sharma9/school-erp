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
  Sparkles,
  Users,
  CalendarDays,
  GraduationCap,
  Activity,
  PartyPopper,
  CheckCircle2,
  XCircle,
  HelpCircle
} from 'lucide-react';
import StatsCard from '../../components/StatsCard';
import { PageHeader, ErpSection, PageStack } from '../../components/erp/PagePrimitives';
import { cn } from '../../utils/cn';

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

  const ytdCash = stats?.todayCollection?.cash ? formatINR(stats.todayCollection.cash) : '0';
  const ytdBank = stats?.todayCollection?.bank ? formatINR(stats.todayCollection.bank) : '0';
  const ytdTotal = stats?.todayCollection?.total ? formatINR(stats.todayCollection.total) : '0';

  const vehicles = [];

  const birthdays = [];

  // ── Module search data ──
  const ALL_MODULES = [
    { label: 'Dashboard', path: '/', icon: '🏠' },
    { label: 'Edit School', path: '/edit-school', icon: '🏫' },
    { label: 'WhatsApp Link', path: '/whatsapp-link', icon: '💬' },
    { label: 'Settings & Permissions', path: '/settings', icon: '⚙️' },
    { label: 'Student Registration', path: '/student-registration', icon: '📝' },
    { label: 'Student List', path: '/student-list', icon: '👨‍🎓' },
    { label: 'Assign Roll/Feebook No', path: '/assign-roll', icon: '🔢' },
    { label: 'Biometric Machine Sync', path: '/biometric-sync', icon: '🔏' },
    { label: 'Promotion', path: '/promotion', icon: '🎓' },
    { label: 'Student Portfolio', path: '/student-portfolio', icon: '📁' },
    { label: 'ID Card Generator', path: '/id-card', icon: '🪪' },
    { label: 'Admit Card Generator', path: '/admit-card', icon: '🗂️' },
    { label: 'Exam Date Sheet', path: '/exam-date-sheet', icon: '📅' },
    { label: 'Student Reports', path: '/student-reports', icon: '📊' },
    { label: 'Class Master', path: '/class-master', icon: '🏛️' },
    { label: 'Group Subject Master', path: '/group-subject-master', icon: '📚' },
    { label: 'Subject Master', path: '/subject', icon: '📖' },
    { label: 'Subject Link', path: '/subject-link', icon: '🔗' },
    { label: 'Stream Master', path: '/stream-master', icon: '🌊' },
    { label: 'Fee Collection', path: '/fee-collection', icon: '💰' },
    { label: 'Fee Reports', path: '/fee-reports', icon: '📈' },
    { label: 'CC/BC/TF Generator', path: '/cc-bc-tf', icon: '📜' },
    { label: 'TC Generation', path: '/tc-generation', icon: '📋' },
    { label: 'Timetable', path: '/timetable', icon: '📆' },
    { label: 'Attendance', path: '/attendance', icon: '✅' },
    { label: 'Staff Attendance', path: '/staff-attendance', icon: '👔' },
    { label: 'Hostel Master', path: '/hostel-master', icon: '🏠' },
    { label: 'Transport', path: '/transport', icon: '🚌' },
    { label: 'Library', path: '/library', icon: '📚' },
    { label: 'Stationery', path: '/stationery', icon: '🖊️' },
    { label: 'SMS / Notifications', path: '/sms', icon: '📱' },
    { label: 'Notice Board', path: '/notice-board', icon: '📌' },
    { label: 'Leave Management', path: '/leave-management', icon: '🗓️' },
    { label: 'Payroll', path: '/payroll', icon: '💵' },
    { label: 'Front Office', path: '/front-office', icon: '🏢' },
    { label: 'Announcements Hub', path: '/announcements', icon: '📢' },
    { label: 'CRM Dashboard', path: '/crm', icon: '🤝' },
    { label: 'Enquiries', path: '/enquiries', icon: '❓' },
    { label: 'Greeting Card', path: '/greeting-card', icon: '🎴' },
    { label: 'Bulk Editing', path: '/bulk-editing', icon: '✏️' },
    { label: 'Lesson Planning', path: '/lesson-planning', icon: '📝' },
    { label: 'Homework', path: '/homework', icon: '📓' },
    { label: 'Study Material', path: '/study-material', icon: '📗' },
    { label: 'Upload Pre Year Paper', path: '/prev-year-papers', icon: '📄' },
    { label: 'QR Code / Links', path: '/qr-code', icon: '🔳' },
    { label: 'Accounts & Expense', path: '/accounts', icon: '🧾' },
    { label: 'Examination', path: '/examination', icon: '📝' },
  ];

  const [moduleSearch, setModuleSearch] = useState('');
  const [showModuleDropdown, setShowModuleDropdown] = useState(false);

  const filteredModules = moduleSearch.trim().length >= 1
    ? ALL_MODULES.filter(m =>
        m.label.toLowerCase().includes(moduleSearch.toLowerCase())
      ).slice(0, 8)
    : [];

  return (
    <PageStack className="gap-3 sm:gap-4.5 bg-slate-50/40 min-h-screen pb-24">
      {/* Multi-Tenant Header & Branch Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-2xs shrink-0',
            isNewSchool ? 'bg-amber-600' : isSchoolB ? 'bg-emerald-600' : 'bg-indigo-600'
          )}>
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
                {schoolName}
              </h1>
              <span className={cn(
                'text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider',
                isNewSchool
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : isSchoolB
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
              )}>
                {isNewSchool ? 'Fresh Tenant' : isSchoolB ? 'Tenant B' : 'Tenant A'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              Multi-tenant data isolation active &bull; Academic Session 2026-2027
            </p>
          </div>
        </div>

        {/* 1-Tap Quick Switch Demo Tenant */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => switchSchool(isSchoolB ? 'sch_jd_intl' : 'sch_dps_branch2')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            title="Switch demo school for instant preview"
          >
            <span>Switch Demo: {isSchoolB ? 'School A' : 'School B'}</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
          </button>
        </div>
      </div>

      {/* ── Module Quick Search Widget ── */}
      <div className="relative">
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs px-4 py-3 flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="🔍  Search modules... (e.g. Fee, Attendance, Certificate)"
            value={moduleSearch}
            onChange={(e) => { setModuleSearch(e.target.value); setShowModuleDropdown(true); }}
            onFocus={() => setShowModuleDropdown(true)}
            onBlur={() => setTimeout(() => setShowModuleDropdown(false), 180)}
            className="flex-1 text-sm text-slate-700 bg-transparent outline-none placeholder-slate-400"
          />
          {moduleSearch && (
            <button onClick={() => { setModuleSearch(''); setShowModuleDropdown(false); }} className="text-slate-400 hover:text-slate-600">
              <XCircle className="w-4 h-4" />
            </button>
          )}
        </div>
        {showModuleDropdown && filteredModules.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
            {filteredModules.map((mod, i) => (
              <button
                key={i}
                onMouseDown={() => { onNavigate && onNavigate(mod.path); setModuleSearch(''); setShowModuleDropdown(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-indigo-50 transition-colors border-b border-slate-100 last:border-0"
              >
                <span className="text-base">{mod.icon}</span>
                <span className="font-medium text-slate-800">{mod.label}</span>
                <span className="ml-auto text-[11px] text-slate-400 font-mono">{mod.path}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Top 5 KPI Stats Cards (Test Master Pro Design: Compact, Tinted Backgrounds, Inside Elegance) */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-2.5 sm:gap-3.5">
        <StatsCard
          title="Today Collection"
          value={`₹${formatINR(stats?.todayCollection?.total || 0)}`}
          icon={IndianRupee}
          themeIndex={0}
          onClick={() => onNavigate && onNavigate('/fee-collection')}
          badge={`${stats?.todayCollection?.receiptsCount || 0} Receipts`}
          subtitle={
            <span className="flex items-center gap-1 text-[11px] font-medium text-blue-700 truncate">
              <span>Cash: ₹{formatINR(stats?.todayCollection?.cash || 0)}</span>
              <span className="text-blue-300">·</span>
              <span>Bank: ₹{formatINR(stats?.todayCollection?.bank || 0)}</span>
            </span>
          }
        />

        <StatsCard
          title="Fee Revenue"
          value={`₹${formatINR(stats?.feeRevenueSummary?.totalRevenue || 0)}`}
          icon={Receipt}
          themeIndex={4}
          onClick={() => onNavigate && onNavigate('/fee-reports')}
          badge={`${stats?.feeRevenueSummary?.receivedPercentage || 0}% Paid`}
          subtitle={
            <span className="flex items-center gap-1 text-[11px] font-medium text-orange-700 truncate">
              <span>Due: ₹{formatINR(stats?.feeRevenueSummary?.totalDue || 0)}</span>
              <span className="text-orange-300">·</span>
              <span className="font-bold text-rose-600">({stats?.feeRevenueSummary?.duePercentage || 0}%)</span>
            </span>
          }
        />

        <StatsCard
          title="Total Students"
          value={stats?.totalStudents?.total ?? 0}
          icon={Users}
          themeIndex={1}
          onClick={() => onNavigate && onNavigate('/student-reports')}
          badge={stats?.totalStudents?.growthRate || '+5.4%'}
          subtitle={
            <span className="flex items-center gap-1.5 text-[11px] font-medium text-violet-700">
              <span className="font-bold">👦 {stats?.totalStudents?.boys ?? 0}</span>
              <span className="text-violet-300">·</span>
              <span className="font-bold">👧 {stats?.totalStudents?.girls ?? 0}</span>
              <span className="text-violet-300">·</span>
              <span className="text-[10px] text-violet-600 font-semibold">New: {stats?.totalStudents?.newAdmissions ?? 0}</span>
            </span>
          }
        />

        <StatsCard
          title="Student Attendance"
          value={`${stats?.attendanceToday?.percentage || 0}%`}
          icon={UserCheck}
          themeIndex={2}
          onClick={() => onNavigate && onNavigate('/student-attendance')}
          badge={stats?.attendanceToday?.trend || 'Today'}
          subtitle={
            <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-800">
              <span className="font-bold">✓ {stats?.attendanceToday?.totalPresent || 0} P</span>
              <span className="text-emerald-300">·</span>
              <span className="font-bold text-rose-600">✕ {stats?.attendanceToday?.totalAbsent || 0} A</span>
            </span>
          }
        />

        <StatsCard
          title="Staff Attendance"
          value="Daily Register"
          icon={ShieldCheck}
          themeIndex={3}
          onClick={() => onNavigate && onNavigate('/staff-attendance')}
          badge="Faculty"
          subtitle={
            <span className="text-amber-800 text-[11px] font-bold hover:underline">
              Mark Staff Biometrics →
            </span>
          }
        />
      </div>

      {/* Today's Paymode Summary (ErpSection with Emerald Tone) */}
      <ErpSection title="Today's Paymode Summary" icon={CreditCard} tone="green">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {/* CASH */}
          <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-emerald-100 bg-emerald-50/50 hover:bg-white hover:border-emerald-300 transition-all">
            <IndianRupee className="w-4 h-4 text-emerald-700 shrink-0" />
            <div className="text-center text-emerald-800">
              <p className="text-xs font-black font-mono leading-none">0</p>
              <p className="text-[10px] font-bold mt-1 text-slate-600 uppercase tracking-wider">CASH</p>
            </div>
          </div>

          {/* BANK */}
          <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-blue-100 bg-blue-50/50 hover:bg-white hover:border-blue-300 transition-all">
            <Building2 className="w-4 h-4 text-blue-700 shrink-0" />
            <div className="text-center text-blue-800">
              <p className="text-xs font-black font-mono leading-none">0</p>
              <p className="text-[10px] font-bold mt-1 text-slate-600 uppercase tracking-wider">BANK</p>
            </div>
          </div>

          {/* CHEQUE */}
          <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-amber-100 bg-amber-50/50 hover:bg-white hover:border-amber-300 transition-all">
            <Receipt className="w-4 h-4 text-amber-600 shrink-0" />
            <div className="text-center text-amber-700">
              <p className="text-xs font-black font-mono leading-none">0</p>
              <p className="text-[10px] font-bold mt-1 text-slate-600 uppercase tracking-wider">CHEQUE</p>
            </div>
          </div>

          {/* ONLINE */}
          <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-sky-100 bg-sky-50/50 hover:bg-white hover:border-sky-300 transition-all">
            <Globe className="w-4 h-4 text-sky-700 shrink-0" />
            <div className="text-center text-sky-800">
              <p className="text-xs font-black font-mono leading-none">0</p>
              <p className="text-[10px] font-bold mt-1 text-slate-600 uppercase tracking-wider">ONLINE</p>
            </div>
          </div>

          {/* UPI */}
          <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-violet-100 bg-violet-50/50 hover:bg-white hover:border-violet-300 transition-all">
            <QrCode className="w-4 h-4 text-violet-700 shrink-0" />
            <div className="text-center text-violet-800">
              <p className="text-xs font-black font-mono leading-none">0</p>
              <p className="text-[10px] font-bold mt-1 text-slate-600 uppercase tracking-wider">UPI</p>
            </div>
          </div>

          {/* CARD */}
          <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-rose-100 bg-rose-50/50 hover:bg-white hover:border-rose-300 transition-all">
            <CreditCard className="w-4 h-4 text-rose-700 shrink-0" />
            <div className="text-center text-rose-800">
              <p className="text-xs font-black font-mono leading-none">0</p>
              <p className="text-[10px] font-bold mt-1 text-slate-600 uppercase tracking-wider">CARD</p>
            </div>
          </div>
        </div>
      </ErpSection>

      {/* Row 3: Estimated Fee Collection, Recent Transactions, and Accounts Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {/* Estimated Fee Collection */}
        <ErpSection
          title="Estimated Fee Collection"
          icon={Building2}
          tone="rose"
          action={
            <button
              type="button"
              onClick={handleRefreshEstimates}
              title="Refresh Estimates"
              className="text-slate-400 hover:text-slate-700 cursor-pointer p-1 rounded-md transition-colors"
            >
              <RefreshCw className={cn('w-3.5 h-3.5', isRefreshing && 'animate-spin text-rose-600')} />
            </button>
          }
        >
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-4 text-[11px] font-semibold">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span className="text-slate-700">Expected</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-slate-700">Received</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <span className="text-slate-700">Due</span>
              </span>
            </div>

            {/* Bar Visual Representation */}
            <div className="h-40 flex items-end justify-around border-b border-slate-100 pb-2 px-2">
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-8 bg-gradient-to-t from-rose-600 to-rose-400 rounded-t-md shadow-2xs transition-all duration-500" style={{ height: `${expectedHeight}px` }}></div>
                <span className="text-[10px] text-slate-500 font-medium">Expected</span>
                <span className="text-[11px] font-bold font-mono text-slate-800">{formatShortAmount(expectedAmount)}</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-8 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-md shadow-2xs transition-all duration-500" style={{ height: `${receivedHeight}px` }}></div>
                <span className="text-[10px] text-slate-500 font-medium">Received</span>
                <span className="text-[11px] font-bold font-mono text-slate-800">{formatShortAmount(receivedAmount)}</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-8 bg-gradient-to-t from-amber-500 to-amber-300 rounded-t-md shadow-2xs transition-all duration-500" style={{ height: `${dueHeight}px` }}></div>
                <span className="text-[10px] text-slate-500 font-medium">Due</span>
                <span className="text-[11px] font-bold font-mono text-slate-800">{formatShortAmount(dueAmount)}</span>
              </div>
            </div>
          </div>
        </ErpSection>

        {/* Recent Transactions Widget */}
        <ErpSection title="Recent Transactions" icon={Receipt} tone="orange" className="flex flex-col justify-between">
          <div className="py-8 flex-1 flex flex-col items-center justify-center text-center text-slate-400 text-xs">
            <Receipt className="w-8 h-8 text-slate-300 mb-2" />
            <p className="font-bold text-slate-700 text-xs">No Transactions Today</p>
            <p className="text-[11px] text-slate-400 mt-0.5">All collected receipts will appear here in real-time</p>
          </div>
        </ErpSection>

        {/* Accounts Widget */}
        <ErpSection title="Accounts" icon={CreditCard} tone="blue">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              {/* Total Transactions Counter */}
              <div className="w-1/2 flex flex-col items-center justify-center border-r border-slate-100 pr-2">
                <span className="text-3xl sm:text-4xl font-black text-emerald-600 font-mono leading-none">0</span>
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
                    Net: ₹0 ↑
                  </span>
                </div>
              </div>
            </div>

            {/* Year Till Date Summary */}
            <div className="pt-2 border-t border-slate-100">
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
        </ErpSection>
      </div>

      {/* Row 4: Fee Reminders, Complaints, Calendar, and Live Vehicle Tracking */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Fee Reminders */}
        <ErpSection
          title="Fee Reminders"
          icon={Bell}
          tone="blue"
          action={<ExternalLink className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-indigo-600 transition-colors" />}
        >
          <div>
            <div className="flex border-b border-slate-100 text-xs font-semibold mb-2">
              <button
                onClick={() => setActiveReminderTab('Today')}
                className={cn(
                  'flex-1 pb-1.5 text-center transition-colors cursor-pointer',
                  activeReminderTab === 'Today' ? 'border-b-2 border-indigo-600 text-indigo-700 font-bold' : 'text-slate-400 hover:text-slate-600'
                )}
              >
                Today
              </button>
              <button
                onClick={() => setActiveReminderTab('Upcoming')}
                className={cn(
                  'flex-1 pb-1.5 text-center transition-colors cursor-pointer',
                  activeReminderTab === 'Upcoming' ? 'border-b-2 border-indigo-600 text-indigo-700 font-bold' : 'text-slate-400 hover:text-slate-600'
                )}
              >
                Upcoming
              </button>
            </div>
            <div className="py-7 text-center text-xs text-slate-400">
              No fee reminders scheduled for {activeReminderTab.toLowerCase()}
            </div>
          </div>
        </ErpSection>

        {/* Complaints */}
        <ErpSection
          title="Complaints"
          icon={AlertCircle}
          tone="yellow"
          action={<ExternalLink className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-amber-600 transition-colors" />}
        >
          <div className="py-9 text-center text-xs text-slate-400">
            <p className="font-bold text-slate-700">No Open Complaints</p>
            <p className="text-[10.5px] text-slate-400 mt-0.5">Parent &amp; student grievance box clear</p>
          </div>
        </ErpSection>

        {/* Calendar */}
        <ErpSection
          title="Calendar (October)"
          icon={CalendarDays}
          tone="purple"
          action={<ExternalLink className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-purple-600 transition-colors" />}
        >
          <div>
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-1.5">
              <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-slate-700">
              {[...Array(31)].map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    'p-1 rounded-md transition-colors',
                    i + 1 === 10
                      ? 'bg-purple-600 text-white font-bold shadow-2xs'
                      : 'hover:bg-slate-100 text-slate-600'
                  )}
                >
                  {i + 1}
                </span>
              ))}
            </div>
          </div>
        </ErpSection>

        {/* Live Vehicle Tracking */}
        <ErpSection title="Vehicle Tracking" icon={Bus} tone="green" className="flex flex-col">
          <div className="overflow-y-auto max-h-48 flex-1">
            <table className="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-1">S.No</th>
                  <th className="py-1">Vehicle</th>
                  <th className="py-1">Driver</th>
                  <th className="py-1 text-right">Cap</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {vehicles.length > 0 ? (
                  vehicles.map((v) => (
                    <tr key={v.sNo} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-1.5 text-slate-400 font-mono">{v.sNo}</td>
                      <td className="py-1.5 font-bold text-slate-800">{v.name}</td>
                      <td className="py-1.5 text-slate-600">{v.driver}</td>
                      <td className="py-1.5 text-right font-mono font-bold text-teal-700">{v.capacity}</td>
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
        </ErpSection>
      </div>

      {/* Row 5: Student Birthdays & Staff Birthdays (Test Master Pro Carousel / Card styling) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        {/* Student Birthday Widget */}
        <ErpSection
          title={`Student Birthdays (${birthdays.length})`}
          icon={PartyPopper}
          tone="rose"
          action={
            <span className="text-[11px] text-pink-600 font-semibold bg-pink-100/60 px-2.5 py-0.5 rounded-full border border-pink-200/50">
              {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </span>
          }
        >
          {birthdays.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {birthdays.map((b, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-pink-100 bg-gradient-to-b from-pink-50/50 to-white hover:border-pink-300 transition-all group select-none shadow-2xs"
                >
                  <div className="relative">
                    <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-pink-300 shadow-xs flex items-center justify-center bg-pink-100 text-pink-600 font-black text-sm">
                      {b.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </div>
                    <span className="absolute -bottom-1 -right-1 text-sm">🎂</span>
                  </div>
                  <div className="text-center w-full">
                    <p className="font-bold text-slate-900 text-xs truncate" title={b.name}>{b.name}</p>
                    <p className="text-[10.5px] text-pink-600 font-semibold truncate">{b.classSec}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">
              <span className="text-2xl block mb-1">🎈</span>
              <p className="font-semibold text-slate-600">No student birthdays today</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Upcoming birthdays will appear here automatically</p>
            </div>
          )}
        </ErpSection>

        {/* Staff Birthdays — separate widget */}
        <ErpSection title="Staff Birthdays" icon={Cake} tone="indigo"
          action={
            <span className="text-[11px] text-indigo-600 font-semibold bg-indigo-100/60 px-2.5 py-0.5 rounded-full border border-indigo-200/50">
              {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </span>
          }
        >
          <div className="flex flex-col items-center justify-center text-center py-6">
            <span className="text-3xl mb-2">🎂</span>
            <p className="text-xs font-bold text-slate-800">Staff Birthdays</p>
            <p className="text-[11px] text-slate-500 mt-1">0 Staff birthdays today</p>
          </div>
        </ErpSection>
      </div>

      {/* Row 6: Staff Leave Requests — separate widget (full width) */}
      <div className="grid grid-cols-1 gap-3.5">
        <ErpSection title="Pending Leave Requests" icon={Clock} tone="amber"
          action={
            <span className="text-[11px] text-amber-700 font-semibold bg-amber-100/60 px-2.5 py-0.5 rounded-full border border-amber-200/50">
              Leave Management
            </span>
          }
        >
          <div className="flex flex-col items-center justify-center text-center py-6">
            <span className="text-3xl mb-2">📝</span>
            <p className="text-xs font-bold text-slate-800">No Pending Leave Requests</p>
            <p className="text-[11px] text-slate-500 mt-1">All leave requests have been processed</p>
          </div>
        </ErpSection>
      </div>
    </PageStack>
  );
}

export default DashboardPage;
