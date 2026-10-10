import React from 'react';
import { Home, Printer, FileDown, ArrowLeft } from 'lucide-react';

export function ReportHeader({ title, subtitle = 'Student', onNavigate, onPrint, onExport, showBack = false }) {
  return (
    <div className="bg-white border-b border-slate-200/80 px-4 md:px-8 py-3 flex flex-wrap items-center justify-between gap-3 shadow-xs sticky top-0 z-30">
      <div className="flex items-center space-x-3">
        {showBack && onNavigate && (
          <button
            onClick={() => onNavigate('/')}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
        <h1 className="text-base md:text-lg font-semibold text-slate-800 tracking-tight">
          {title}
        </h1>
        <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400 pl-3 border-l border-slate-200">
          <button
            onClick={() => onNavigate && onNavigate('/')}
            className="text-slate-400 hover:text-indigo-600 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
          </button>
          <span>•</span>
          <span className="text-slate-500">{subtitle}</span>
          <span>•</span>
          <span className="text-indigo-600 font-medium">{title}</span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {onPrint && (
          <button
            onClick={onPrint}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium shadow-2xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print</span>
          </button>
        )}
        {onExport && (
          <button
            onClick={onExport}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium shadow-2xs transition-colors"
          >
            <FileDown className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
        )}
      </div>
    </div>
  );
}
