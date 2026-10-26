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
  GraduationCap
} from 'lucide-react';

export const ALL_FEE_REPORTS = [
  {
    id: 'fee-collection-summary',
    title: 'Fee Collection Summary',
    path: '/fee-collection-summary',
    badge: 'Collection',
    icon: IndianRupee,
    description: 'Daily and monthly fee collection register, payment mode breakdown (Cash, Online, Cheque), and cashier settlement.'
  },
  {
    id: 'online-collection-summary',
    title: 'Online Collection Summary',
    path: '/online-collection-summary',
    badge: 'Online / Gateway',
    icon: CreditCard,
    description: 'Digital payment gateway settlements, UPI & NetBanking transactions, gateway transaction IDs, and reconciliation status.'
  },
  {
    id: 'board-online-collection-summary',
    title: 'Board Collection Summary',
    path: '/board-online-collection-summary',
    badge: 'Board Exams',
    icon: GraduationCap,
    description: 'CBSE / State Board examination fee collections, student registration status, and board payment settlement ledger.'
  },
  {
    id: 'board-fee-due-list',
    title: 'Board Fee Due List',
    path: '/board-fee-due-list',
    badge: 'Defaulters',
    icon: AlertCircle,
    description: 'Outstanding board examination fees roster, class-wise pending balances, roll numbers, and parent contacts.'
  },
  {
    id: 'fee-due-list',
    title: 'Fee Due List (Month-Wise)',
    path: '/fee-due-list-month-wise',
    badge: 'Outstanding',
    icon: AlertCircle,
    description: 'Class-wise student fee defaulters, month-wise arrears, parent phone numbers, and one-click payment reminder SMS.'
  },
  {
    id: 'fee-concession-summary',
    title: 'Fee Concession Summary',
    path: '/fee-concession-summary',
    badge: 'Concessions',
    icon: Award,
    description: 'Special student fee concessions, staff ward discounts, sibling benefits, and trust/scholarship allocations register.'
  },
  {
    id: 'fee-advance-report',
    title: 'Advance Report',
    path: '/fee-advance-report',
    badge: 'Advances',
    icon: Wallet,
    description: 'Prepaid student tuition fee deposits, unadjusted advance credits, carry-forward balances, and ledger adjustments.'
  },
  {
    id: 'fee-structure-report',
    title: 'Fee Structure Report',
    path: '/fee-structure-report',
    badge: 'Master Rates',
    icon: Layers,
    description: 'Master fee schedules for all classes, fee head distributions, frequency breakdowns (Monthly, Quarterly, Annual).'
  },
  {
    id: 'fee-opening-balance-report',
    title: 'Fee Opening Balance Report',
    path: '/fee-opening-balance-report',
    badge: 'Balances',
    icon: Clock,
    description: 'Session transition opening balances, previous academic year arrears carry-forward, and initial ledger setup.'
  },
  {
    id: 'student-fees-statement',
    title: 'Student Fees Statement',
    path: '/student-fees-statement',
    badge: 'Statement',
    icon: FileSpreadsheet,
    description: 'Comprehensive 360° individual student fee ledger, complete invoice and receipt history, and outstanding balance summary.'
  },
  {
    id: 'fee-book-report',
    title: 'Fee Book Report',
    path: '/fee-book-report',
    badge: 'Cashbook',
    icon: BookOpen,
    description: 'Official chronological receipt register, printed fee receipt book series, cashier daily counter logs, and totals.'
  },
  {
    id: 'cancel-fee-receipt-report',
    title: 'Cancel Fee Receipt Report',
    path: '/cancel-fee-receipt-report',
    badge: 'Voided Receipts',
    icon: XCircle,
    description: 'Complete audit log of cancelled and refunded fee receipts, cancellation reasons, user timestamps, and reversing vouchers.'
  },
  {
    id: 'discount-fee-receipt-report',
    title: 'Discount Fee Receipt Report',
    path: '/discount-fee-receipt-report',
    badge: 'Discounts',
    icon: Percent,
    description: 'Special authorized fee waiver receipts, management discretionary discount records, and fee reduction log.'
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
    <div className="min-h-screen bg-slate-50/60 p-3 md:p-5 flex flex-col space-y-3.5">
      {/* Compact Controls Bar: Title and Search */}
      <div className="bg-white rounded-xl p-3 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
            <IndianRupee className="w-3.5 h-3.5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 leading-tight">
              Fee Reports & Financial Directory
            </h1>
            <p className="text-[11px] text-slate-400">
              Showing {filteredReports.length} of {ALL_FEE_REPORTS.length} fee reports
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search fee reports..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Grid of Compact Report Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filteredReports.map(report => {
          const Icon = report.icon;
          return (
            <div
              key={report.id}
              onClick={() => onNavigate && onNavigate(report.path)}
              className="bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-200 flex items-center justify-center font-bold shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-700 rounded-md transition-colors truncate max-w-[120px]">
                    {report.badge}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-[13px] leading-tight mb-1 group-hover:text-emerald-600 transition-colors">
                  {report.title}
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                  {report.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-emerald-600">
                <span className="group-hover:underline">Open Report</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FeeReportsPage;
