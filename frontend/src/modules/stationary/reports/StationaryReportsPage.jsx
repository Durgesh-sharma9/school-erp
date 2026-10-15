import React from 'react';
import {
  ShoppingBag,
  Tag,
  Package,
  Layers,
  Truck,
  FileSpreadsheet,
  Boxes,
  AlertOctagon,
  ArrowRight,
  Home,
  Printer,
  FileDown
} from 'lucide-react';

export function StationaryReportsPage({ onNavigate }) {
  const reports = [
    {
      title: 'Category Items Report',
      path: '/category-items-report',
      desc: 'Complete catalog of stationery items filtered by category with rate, GST, and net payable amounts.',
      icon: Tag,
      color: 'bg-indigo-50 text-indigo-600',
      badge: 'Catalog & Rates'
    },
    {
      title: 'Set Master Report',
      path: '/set-master-report',
      desc: 'Class-wise bundled stationery sets, categorized contents breakdown, item count, and full bundle pricing.',
      icon: Package,
      color: 'bg-blue-50 text-blue-600',
      badge: 'Bundle Structure'
    },
    {
      title: 'Issue Sets Report',
      path: '/issue-sets-report',
      desc: 'Detailed student-wise stationery distribution audit, bill numbers, payment modes, discounts, and outstanding balances.',
      icon: ShoppingBag,
      color: 'bg-emerald-50 text-emerald-600',
      badge: 'Sales & Distribution'
    },
    {
      title: 'Supplier Master Report',
      path: '/supplier-report',
      desc: 'Directory of registered vendors and book suppliers with contact numbers, GSTIN, PAN, and full addresses.',
      icon: Truck,
      color: 'bg-purple-50 text-purple-600',
      badge: 'Vendor Directory'
    },
    {
      title: 'Purchase Items Report',
      path: '/purchase-items-report',
      desc: 'Procurement transaction log showing supplier invoices, item-wise quantities, purchase rates, and GST taxes.',
      icon: FileSpreadsheet,
      color: 'bg-cyan-50 text-cyan-600',
      badge: 'Procurement Log'
    },
    {
      title: 'Stock Report',
      path: '/stock-report',
      desc: 'Live stock ledger tracking opening balance, purchased stock, issued/sold quantities, and current shelf balance.',
      icon: Boxes,
      color: 'bg-amber-50 text-amber-600',
      badge: 'Inventory Audit'
    },
    {
      title: 'Low Stock Report',
      path: '/low-stock-report',
      desc: 'Early warning alerts for items that have dropped below minimum reorder thresholds requiring vendor restock.',
      icon: AlertOctagon,
      color: 'bg-rose-50 text-rose-600',
      badge: 'Reorder Alerts'
    }
  ];

  return (
    <div className="p-4 bg-slate-50 min-h-screen text-slate-800">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-indigo-600" />
            Stationary Reports Hub
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span
              className="flex items-center gap-1 hover:text-indigo-600 cursor-pointer"
              onClick={() => onNavigate && onNavigate('dashboard')}
            >
              <Home className="w-3.5 h-3.5" /> Home
            </span>
            <span>/</span>
            <span className="text-indigo-600 font-semibold">Stationary Reports</span>
          </div>
        </div>

        <div className="mt-3 md:mt-0 flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-800 text-white rounded text-xs font-semibold shadow-sm transition-all"
          >
            <Printer className="w-4 h-4" /> Print Overview
          </button>
        </div>
      </div>

      {/* Grid of Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {reports.map((report, idx) => {
          const Icon = report.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigate && onNavigate(report.path.replace(/^\//, ''))}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-lg ${report.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 uppercase">
                    {report.badge}
                  </span>
                </div>
                <h2 className="text-base font-bold text-slate-800 group-hover:text-indigo-600 transition-colors mb-1.5">
                  {report.title}
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {report.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600 group-hover:translate-x-0.5 transition-transform">
                <span>View Full Report</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default StationaryReportsPage;
