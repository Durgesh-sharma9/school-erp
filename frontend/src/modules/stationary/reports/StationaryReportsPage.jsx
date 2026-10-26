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
  ArrowRight
} from 'lucide-react';

export const ALL_STATIONARY_REPORTS = [
  {
    id: 'category-items-report',
    title: 'Category Items Report',
    path: '/category-items-report',
    badge: 'Catalog & Rates',
    icon: Tag,
    description: 'Complete catalog of stationery items filtered by category with rate, GST, and net payable amounts.'
  },
  {
    id: 'set-master-report',
    title: 'Set Master Report',
    path: '/set-master-report',
    badge: 'Bundle Structure',
    icon: Package,
    description: 'Class-wise bundled stationery sets, categorized contents breakdown, item count, and full bundle pricing.'
  },
  {
    id: 'issue-sets-report',
    title: 'Issue Sets Report',
    path: '/issue-sets-report',
    badge: 'Distribution Audit',
    icon: ShoppingBag,
    description: 'Detailed student-wise stationery distribution audit, bill numbers, payment modes, and outstanding balances.'
  },
  {
    id: 'supplier-report',
    title: 'Supplier Master Report',
    path: '/supplier-report',
    badge: 'Vendor Directory',
    icon: Truck,
    description: 'Directory of registered vendors and book suppliers with contact numbers, GSTIN, PAN, and addresses.'
  },
  {
    id: 'purchase-items-report',
    title: 'Purchase Items Report',
    path: '/purchase-items-report',
    badge: 'Procurement Log',
    icon: FileSpreadsheet,
    description: 'Procurement transaction log showing supplier invoices, item-wise quantities, purchase rates, and GST taxes.'
  },
  {
    id: 'stock-report',
    title: 'Stock Report',
    path: '/stock-report',
    badge: 'Inventory Audit',
    icon: Boxes,
    description: 'Live stock ledger tracking opening balance, purchased stock, issued/sold quantities, and shelf balance.'
  },
  {
    id: 'low-stock-report',
    title: 'Low Stock Report',
    path: '/low-stock-report',
    badge: 'Reorder Alerts',
    icon: AlertOctagon,
    description: 'Early warning alerts for items that have dropped below minimum reorder thresholds requiring restock.'
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
    <div className="min-h-screen bg-slate-50/60 p-3 md:p-5 flex flex-col space-y-3.5">
      {/* Compact Controls Bar: Title and Search */}
      <div className="bg-white rounded-xl p-3 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
            <ShoppingBag className="w-3.5 h-3.5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 leading-tight">
              Stationary Reports Directory
            </h1>
            <p className="text-[11px] text-slate-400">
              Showing {filteredReports.length} of {ALL_STATIONARY_REPORTS.length} stationary reports
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
            placeholder="Search stationary reports..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition"
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
              className="bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-200 flex items-center justify-center font-bold shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-700 rounded-md transition-colors truncate max-w-[120px]">
                    {report.badge}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-[13px] leading-tight mb-1 group-hover:text-indigo-600 transition-colors">
                  {report.title}
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                  {report.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-indigo-600">
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

export default StationaryReportsPage;
