import React, { useState } from 'react';
import {
  IndianRupee,
  Search,
  ArrowRight,
  Receipt,
  CreditCard,
  AlertCircle,
  FileSpreadsheet,
  Award,
  Wallet,
  Clock,
  Layers,
  BookOpen,
  XCircle,
  Percent,
  GraduationCap,
  X
} from 'lucide-react';

const COLOR_THEMES = {
  emerald: {
    gradient: 'from-emerald-500 to-teal-600',
    glow: 'shadow-emerald-500/20',
    badgeBg: 'bg-emerald-50/80 text-emerald-700 border-emerald-200/70',
  },
  blue: {
    gradient: 'from-blue-600 to-indigo-600',
    glow: 'shadow-blue-500/20',
    badgeBg: 'bg-blue-50/80 text-blue-700 border-blue-200/70',
  },
  indigo: {
    gradient: 'from-indigo-600 to-violet-600',
    glow: 'shadow-indigo-500/20',
    badgeBg: 'bg-indigo-50/80 text-indigo-700 border-indigo-200/70',
  },
  rose: {
    gradient: 'from-rose-500 to-pink-600',
    glow: 'shadow-rose-500/20',
    badgeBg: 'bg-rose-50/80 text-rose-700 border-rose-200/70',
  },
  amber: {
    gradient: 'from-amber-500 to-orange-600',
    glow: 'shadow-amber-500/20',
    badgeBg: 'bg-amber-50/80 text-amber-800 border-amber-200/70',
  },
  purple: {
    gradient: 'from-purple-600 to-pink-600',
    glow: 'shadow-purple-500/20',
    badgeBg: 'bg-purple-50/80 text-purple-700 border-purple-200/70',
  },
  teal: {
    gradient: 'from-teal-500 to-emerald-600',
    glow: 'shadow-teal-500/20',
    badgeBg: 'bg-teal-50/80 text-teal-700 border-teal-200/70',
  },
  cyan: {
    gradient: 'from-cyan-500 to-blue-600',
    glow: 'shadow-cyan-500/20',
    badgeBg: 'bg-cyan-50/80 text-cyan-700 border-cyan-200/70',
  },
  violet: {
    gradient: 'from-violet-600 to-indigo-600',
    glow: 'shadow-violet-500/20',
    badgeBg: 'bg-violet-50/80 text-violet-700 border-violet-200/70',
  },
  orange: {
    gradient: 'from-orange-500 to-amber-600',
    glow: 'shadow-orange-500/20',
    badgeBg: 'bg-orange-50/80 text-orange-700 border-orange-200/70',
  }
};

export const ALL_FEE_REPORTS = [
  {
    id: 'fee-collection-summary',
    title: 'Fee Collection Summary',
    path: '/fee-collection-summary',
    badge: 'Collection',
    color: 'emerald',
    icon: IndianRupee,
    description: 'Daily and monthly fee collection register, payment mode breakdown (Cash, Online, Cheque), and cashier settlement.'
  },
  {
    id: 'online-collection-summary',
    title: 'Online Collection Summary',
    path: '/online-collection-summary',
    badge: 'Online / Gateway',
    color: 'blue',
    icon: CreditCard,
    description: 'Digital payment gateway settlements, UPI & NetBanking transactions, gateway transaction IDs, and reconciliation status.'
  },
  {
    id: 'board-online-collection-summary',
    title: 'Board Collection Summary',
    path: '/board-online-collection-summary',
    badge: 'Board Exams',
    color: 'indigo',
    icon: GraduationCap,
    description: 'CBSE / State Board examination fee collections, student registration status, and board payment settlement ledger.'
  },
  {
    id: 'board-fee-due-list',
    title: 'Board Fee Due List',
    path: '/board-fee-due-list',
    badge: 'Defaulters',
    color: 'rose',
    icon: AlertCircle,
    description: 'Outstanding board examination fees roster, class-wise pending balances, roll numbers, and parent contacts.'
  },
  {
    id: 'fee-due-list',
    title: 'Fee Due List (Month-Wise)',
    path: '/fee-due-list-month-wise',
    badge: 'Outstanding',
    color: 'amber',
    icon: AlertCircle,
    description: 'Class-wise student fee defaulters, month-wise arrears, parent phone numbers, and one-click payment reminder SMS.'
  },
  {
    id: 'fee-concession-summary',
    title: 'Fee Concession Summary',
    path: '/fee-concession-summary',
    badge: 'Concessions',
    color: 'purple',
    icon: Award,
    description: 'Special student fee concessions, staff ward discounts, sibling benefits, and trust/scholarship allocations register.'
  },
  {
    id: 'fee-advance-report',
    title: 'Advance Report',
    path: '/fee-advance-report',
    badge: 'Advances',
    color: 'teal',
    icon: Wallet,
    description: 'Prepaid student tuition fee deposits, unadjusted advance credits, carry-forward balances, and ledger adjustments.'
  },
  {
    id: 'fee-structure-report',
    title: 'Fee Structure Report',
    path: '/fee-structure-report',
    badge: 'Master Rates',
    color: 'cyan',
    icon: Layers,
    description: 'Master fee schedules for all classes, fee head distributions, frequency breakdowns (Monthly, Quarterly, Annual).'
  },
  {
    id: 'fee-opening-balance-report',
    title: 'Fee Opening Balance Report',
    path: '/fee-opening-balance-report',
    badge: 'Balances',
    color: 'violet',
    icon: Clock,
    description: 'Session transition opening balances, previous academic year arrears carry-forward, and initial ledger setup.'
  },
  {
    id: 'student-fees-statement',
    title: 'Student Fees Statement',
    path: '/student-fees-statement',
    badge: 'Statement',
    color: 'blue',
    icon: FileSpreadsheet,
    description: 'Comprehensive 360° individual student fee ledger, complete invoice and receipt history, and outstanding balance summary.'
  },
  {
    id: 'fee-book-report',
    title: 'Fee Book Report',
    path: '/fee-book-report',
    badge: 'Cashbook',
    color: 'emerald',
    icon: BookOpen,
    description: 'Official chronological receipt register, printed fee receipt book series, cashier daily counter logs, and totals.'
  },
  {
    id: 'cancel-fee-receipt-report',
    title: 'Cancel Fee Receipt Report',
    path: '/cancel-fee-receipt-report',
    badge: 'Voided Receipts',
    color: 'rose',
    icon: XCircle,
    description: 'Complete audit log of cancelled and refunded fee receipts, cancellation reasons, user timestamps, and reversing vouchers.'
  },
  {
    id: 'discount-fee-receipt-report',
    title: 'Discount Fee Receipt Report',
    path: '/discount-fee-receipt-report',
    badge: 'Discounts',
    color: 'orange',
    icon: Percent,
    description: 'Special fee discounts, scholarship waivers, trust grants, and approved concession transaction log.'
  }
];

export function FeeReportsPage({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReports = ALL_FEE_REPORTS.filter(report => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      report.title.toLowerCase().includes(q) ||
      report.description.toLowerCase().includes(q) ||
      report.badge.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] p-3 md:p-4 flex flex-col space-y-3.5">
      {/* Top Controls Bar - Compact */}
      <div className="bg-white rounded-xl p-3.5 md:p-4 border border-slate-200/90 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20 flex items-center justify-center font-bold shrink-0">
              <IndianRupee className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm md:text-base font-bold text-slate-900 leading-tight flex items-center gap-2">
                <span>Fee Reports & Financial Directory</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100/80">
                  {filteredReports.length} Reports
                </span>
              </h1>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Financial ledgers, collection registers, defaulter lists, and fee reconciliations
              </p>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search fee reports..."
              className="w-full pl-8 pr-8 py-1.5 text-xs bg-slate-50/80 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-md"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid of Compact Report Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filteredReports.map(report => {
          const Icon = report.icon;
          const theme = COLOR_THEMES[report.color] || COLOR_THEMES.emerald;

          return (
            <div
              key={report.id}
              onClick={() => onNavigate && onNavigate(report.path)}
              className="bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-lg hover:shadow-emerald-500/10 hover:border-emerald-400 hover:-translate-y-1 transition-all duration-200 cursor-pointer p-3.5 sm:p-4 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Subtle Interior Gradient Wash */}
              <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 via-transparent to-transparent pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10 flex-1 flex flex-col justify-between">
                <div>
                  {/* Top Row: Icon + Badge */}
                  <div className="flex items-start justify-between gap-2.5 mb-2.5">
                    <div
                      className={`w-9 h-9 rounded-lg bg-gradient-to-br ${theme.gradient} text-white shadow-sm ${theme.glow} flex items-center justify-center font-bold shrink-0 group-hover:scale-105 transition-all duration-200`}
                    >
                      <Icon className="w-4 h-4 text-white" />
                    </div>

                    <span
                      className={`px-2 py-0.5 text-[9.5px] font-bold tracking-wide rounded-md border ${theme.badgeBg} shadow-2xs truncate max-w-[125px]`}
                    >
                      {report.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-bold text-slate-900 text-[13.5px] leading-tight mb-1 group-hover:text-emerald-700 transition-colors">
                    {report.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-normal line-clamp-2 min-h-[30px]">
                    {report.description}
                  </p>
                </div>

                {/* Compact Action Footer */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-600 group-hover:text-emerald-700 transition-colors">
                    Open Report
                  </span>
                  <div className="w-6 h-6 rounded-md bg-slate-100 group-hover:bg-emerald-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-all duration-200 group-hover:translate-x-0.5 shadow-2xs">
                    <ArrowRight className="w-3 h-3 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FeeReportsPage;
