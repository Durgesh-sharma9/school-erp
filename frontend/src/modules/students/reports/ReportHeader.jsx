import React from 'react';
import { ArrowLeft, Printer, FileDown, Home } from 'lucide-react';
import { ALL_STUDENT_REPORTS } from './studentReportsCatalog';

export function ReportHeader({
  title,
  subtitle = 'Student',
  onNavigate,
  onPrint,
  onExport
}) {
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

  const activeReport = ALL_STUDENT_REPORTS.find(
    r =>
      r.path === currentPath ||
      (r.aliasPaths && r.aliasPaths.includes(currentPath)) ||
      r.title.toLowerCase() === (title || '').toLowerCase() ||
      r.shortTitle.toLowerCase() === (title || '').toLowerCase()
  );

  const Icon = activeReport ? activeReport.icon : null;

  return (
    <div className="bg-white border-b border-slate-200 px-4 md:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-30 shadow-2xs">
      {/* Left: Back to Reports Button + Title + Breadcrumbs */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => onNavigate && onNavigate('/student-reports')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold shadow-2xs transition-colors group"
          title="Back to Reports Grid"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-500 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Reports</span>
        </button>

        <span className="text-slate-300">|</span>

        <div className="flex items-center space-x-2.5">
          {Icon && (
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold shrink-0">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <div>
            <h1 className="text-sm md:text-base font-bold text-slate-800 leading-tight flex items-center gap-2">
              <span>{title}</span>
              {activeReport?.badge && (
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
                  {activeReport.badge}
                </span>
              )}
            </h1>
            <div className="hidden sm:flex items-center space-x-1.5 text-[11px] text-slate-400">
              <button
                onClick={() => onNavigate && onNavigate('/')}
                className="hover:text-indigo-600 transition-colors flex items-center gap-1"
              >
                <Home className="w-3 h-3" />
                <span>Home</span>
              </button>
              <span>•</span>
              <span className="text-slate-500">{subtitle}</span>
              <span>•</span>
              <button
                onClick={() => onNavigate && onNavigate('/student-reports')}
                className="hover:text-indigo-600 text-slate-500 transition-colors"
              >
                Reports
              </button>
              <span>•</span>
              <span className="text-indigo-600 font-medium">{title}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Print & Export Actions */}
      <div className="flex items-center gap-2">
        {onPrint && (
          <button
            onClick={onPrint}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium shadow-2xs transition-colors"
            title="Print current report"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print</span>
          </button>
        )}
        {onExport && (
          <button
            onClick={onExport}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold shadow-2xs transition-colors"
            title="Export CSV"
          >
            <FileDown className="w-3.5 h-3.5 text-indigo-600" />
            <span>Export CSV</span>
          </button>
        )}
      </div>
    </div>
  );
}
export default ReportHeader;
