import React from 'react';
import {
  BookOpen,
  FileText,
  Clock,
  Package,
  Building,
  AlertTriangle,
  ArrowRight,
  Home,
  Layers,
  Printer,
  FileDown
} from 'lucide-react';

export function LibraryReportsPage({ onNavigate }) {
  const reports = [
    {
      title: 'Books Summary',
      path: '/get-books-report',
      desc: 'Complete overview of all registered library book titles, author details, categorized quantities, and financial valuation.',
      icon: BookOpen,
      color: 'bg-indigo-50 text-indigo-600',
      badge: 'Catalog Overview'
    },
    {
      title: 'Issued Books Report',
      path: '/get-issued-books-report',
      desc: 'Detailed log of all currently lent books with borrower information, class, issue date, and expected return schedules.',
      icon: Layers,
      color: 'bg-blue-50 text-blue-600',
      badge: 'Circulation Audit'
    },
    {
      title: 'Pending Books Report',
      path: '/get-pending-books-report',
      desc: 'Monitor books overdue past their due dates, accrued fine tracking @ ₹5/day, and trigger reminder SMS to students/parents.',
      icon: Clock,
      color: 'bg-rose-50 text-rose-600',
      badge: 'Overdue & Fines'
    },
    {
      title: 'Books Stock Report',
      path: '/get-books-stock-report',
      desc: 'Physical inventory audit tracking opening quantities, purchases, issues, damaged copies, and shelf availability.',
      icon: Package,
      color: 'bg-emerald-50 text-emerald-600',
      badge: 'Inventory Audit'
    },
    {
      title: 'Purchased Books Report',
      path: '/get-purchase-books-report',
      desc: 'Supplier-wise procurement history, invoice numbers, bill dates, GST breakdown, and acquisition expenditure.',
      icon: Building,
      color: 'bg-purple-50 text-purple-600',
      badge: 'Procurement Log'
    },
    {
      title: 'Damaged Books Report',
      path: '/get-damaged-books-report',
      desc: 'Decommissioned, torn, water-damaged, or written-off books register with depreciation loss valuations.',
      icon: AlertTriangle,
      color: 'bg-amber-50 text-amber-600',
      badge: 'Write-off Losses'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 text-slate-800">
      {/* Breadcrumb Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate?.('/dashboard')}
            className="text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1 text-sm font-medium"
          >
            <Home className="w-4 h-4" />
            Home
          </button>
          <span className="text-slate-400">/</span>
          <span className="text-slate-500 text-sm font-medium">Library</span>
          <span className="text-slate-400">/</span>
          <span className="text-indigo-600 text-sm font-semibold">Library Reports Hub</span>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-700 rounded-2xl p-6 md:p-8 text-white mb-8 shadow-sm">
        <div className="max-w-2xl">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md mb-3">
            Library Intelligence & Inventory Reports
          </span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Library Reports & Analytical Audits
          </h2>
          <p className="text-indigo-100 text-xs md:text-sm mt-2 leading-relaxed">
            Access 1:1 UAB-aligned circulation logs, stock balance verification, overdue tracking, procurement summaries, and loss logs.
          </p>
        </div>
      </div>

      {/* Grid of Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((rep, idx) => {
          const Icon = rep.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigate?.(rep.path)}
              className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-indigo-300 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${rep.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {rep.badge}
                  </span>
                </div>
                <h3 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">
                  {rep.title}
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {rep.desc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600 group-hover:text-indigo-700">
                <span>View Full Report</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default LibraryReportsPage;
