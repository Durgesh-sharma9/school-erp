import React, { useState } from 'react';
import {
  ShoppingBag,
  Tag,
  Package,
  Truck,
  FileSpreadsheet,
  Boxes,
  AlertOctagon,
  Search,
  ArrowRight,
  X
} from 'lucide-react';

export const ALL_STATIONARY_REPORTS = [
  {
    id: 'category-items-report',
    title: 'Category Items Report',
    path: '/category-items-report',
    badge: 'Catalog & Rates',
    icon: Tag,
    gradient: 'from-blue-600 to-indigo-600',
    glow: 'shadow-blue-500/20',
    badgeBg: 'bg-blue-50/80 text-blue-700 border-blue-200/70',
    description: 'Complete catalog of stationery items filtered by category with rate, GST, and net payable amounts.'
  },
  {
    id: 'set-master-report',
    title: 'Set Master Report',
    path: '/set-master-report',
    badge: 'Bundle Structure',
    icon: Package,
    gradient: 'from-indigo-600 to-violet-600',
    glow: 'shadow-indigo-500/20',
    badgeBg: 'bg-indigo-50/80 text-indigo-700 border-indigo-200/70',
    description: 'Class-wise bundled stationery sets, categorized contents breakdown, item count, and full bundle pricing.'
  },
  {
    id: 'issue-sets-report',
    title: 'Issue Sets Report',
    path: '/issue-sets-report',
    badge: 'Distribution Audit',
    icon: ShoppingBag,
    gradient: 'from-emerald-500 to-teal-600',
    glow: 'shadow-emerald-500/20',
    badgeBg: 'bg-emerald-50/80 text-emerald-700 border-emerald-200/70',
    description: 'Detailed student-wise stationery distribution audit, bill numbers, payment modes, and outstanding balances.'
  },
  {
    id: 'supplier-report',
    title: 'Supplier Master Report',
    path: '/supplier-report',
    badge: 'Vendor Directory',
    icon: Truck,
    gradient: 'from-amber-500 to-orange-600',
    glow: 'shadow-amber-500/20',
    badgeBg: 'bg-amber-50/80 text-amber-800 border-amber-200/70',
    description: 'Directory of registered vendors and book suppliers with contact numbers, GSTIN, PAN, and addresses.'
  },
  {
    id: 'purchase-items-report',
    title: 'Purchase Items Report',
    path: '/purchase-items-report',
    badge: 'Inward Purchases',
    icon: FileSpreadsheet,
    gradient: 'from-purple-600 to-pink-600',
    glow: 'shadow-purple-500/20',
    badgeBg: 'bg-purple-50/80 text-purple-700 border-purple-200/70',
    description: 'Purchase voucher logs, item-wise intake quantities, invoice references, and procurement spending totals.'
  },
  {
    id: 'stock-report',
    title: 'Stationery Stock Report',
    path: '/stock-report',
    badge: 'Stock Position',
    icon: Boxes,
    gradient: 'from-cyan-500 to-blue-600',
    glow: 'shadow-cyan-500/20',
    badgeBg: 'bg-cyan-50/80 text-cyan-700 border-cyan-200/70',
    description: 'Real-time inventory levels, balance in stock, purchases, damaged stock write-offs, and store valuations.'
  },
  {
    id: 'low-stock-report',
    title: 'Low Stock Alert Report',
    path: '/low-stock-report',
    badge: 'Reorder Triggers',
    icon: AlertOctagon,
    gradient: 'from-rose-500 to-pink-600',
    glow: 'shadow-rose-500/20',
    badgeBg: 'bg-rose-50/80 text-rose-700 border-rose-200/70',
    description: 'Immediate reorder triggers for items falling below safety threshold quantities to prevent supply disruption.'
  }
];

export function StationaryReportsPage({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReports = ALL_STATIONARY_REPORTS.filter(report => {
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
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20 flex items-center justify-center font-bold shrink-0">
              <ShoppingBag className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm md:text-base font-bold text-slate-900 leading-tight flex items-center gap-2">
                <span>School Shop & Stationary Reports Directory</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100/80">
                  {filteredReports.length} Reports
                </span>
              </h1>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Item catalogs, stationery bundles, purchase registers, and low stock reorder alerts
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
              placeholder="Search stationery reports..."
              className="w-full pl-8 pr-8 py-1.5 text-xs bg-slate-50/80 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition"
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

          return (
            <div
              key={report.id}
              onClick={() => onNavigate && onNavigate(report.path)}
              className="bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-lg hover:shadow-indigo-500/10 hover:border-indigo-400 hover:-translate-y-1 transition-all duration-200 cursor-pointer p-3.5 sm:p-4 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Subtle Interior Gradient Wash */}
              <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 via-transparent to-transparent pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10 flex-1 flex flex-col justify-between">
                <div>
                  {/* Top Row: Icon + Badge */}
                  <div className="flex items-start justify-between gap-2.5 mb-2.5">
                    <div
                      className={`w-9 h-9 rounded-lg bg-gradient-to-br ${report.gradient} text-white shadow-sm ${report.glow} flex items-center justify-center font-bold shrink-0 group-hover:scale-105 transition-all duration-200`}
                    >
                      <Icon className="w-4 h-4 text-white" />
                    </div>

                    <span
                      className={`px-2 py-0.5 text-[9.5px] font-bold tracking-wide rounded-md border ${report.badgeBg} shadow-2xs truncate max-w-[125px]`}
                    >
                      {report.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-bold text-slate-900 text-[13.5px] leading-tight mb-1 group-hover:text-indigo-600 transition-colors">
                    {report.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-normal line-clamp-2 min-h-[30px]">
                    {report.description}
                  </p>
                </div>

                {/* Compact Action Footer */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-600 group-hover:text-indigo-600 transition-colors">
                    Open Report
                  </span>
                  <div className="w-6 h-6 rounded-md bg-slate-100 group-hover:bg-indigo-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-all duration-200 group-hover:translate-x-0.5 shadow-2xs">
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

export default StationaryReportsPage;
