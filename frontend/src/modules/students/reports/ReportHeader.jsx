import React, { useState, useRef, useEffect } from 'react';
import {
  Home,
  Printer,
  FileDown,
  ArrowLeft,
  LayoutGrid,
  ChevronDown,
  Search,
  Check,
  Sparkles
} from 'lucide-react';
import {
  STUDENT_REPORT_CATEGORIES,
  ALL_STUDENT_REPORTS
} from './studentReportsCatalog';

export function ReportHeader({
  title,
  subtitle = 'Student',
  onNavigate,
  onPrint,
  onExport,
  showBack = false
}) {
  // Identify the currently active report
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  const currentReport = ALL_STUDENT_REPORTS.find(
    r => r.title.toLowerCase() === (title || '').toLowerCase() ||
         r.shortTitle.toLowerCase() === (title || '').toLowerCase() ||
         r.path === currentPath ||
         (r.aliasPaths && r.aliasPaths.includes(currentPath))
  );

  // State for active category tab (defaults to current report's category, or 'students')
  const [selectedCategory, setSelectedCategory] = useState(() => {
    return currentReport ? currentReport.categoryId : 'students';
  });

  // Keep selectedCategory in sync if report changes
  useEffect(() => {
    if (currentReport) {
      setSelectedCategory(currentReport.categoryId);
    }
  }, [currentReport?.id]);

  // State for the "Jump to Report" quick dropdown
  const [isJumpOpen, setIsJumpOpen] = useState(false);
  const [jumpSearch, setJumpSearch] = useState('');
  const jumpRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (jumpRef.current && !jumpRef.current.contains(e.target)) {
        setIsJumpOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredJumpReports = jumpSearch.trim()
    ? ALL_STUDENT_REPORTS.filter(
        r =>
          r.title.toLowerCase().includes(jumpSearch.toLowerCase()) ||
          r.shortTitle.toLowerCase().includes(jumpSearch.toLowerCase()) ||
          r.description.toLowerCase().includes(jumpSearch.toLowerCase()) ||
          r.badge.toLowerCase().includes(jumpSearch.toLowerCase())
      )
    : ALL_STUDENT_REPORTS;

  // Active category reports list
  const categoryReports = ALL_STUDENT_REPORTS.filter(
    r => r.categoryId === selectedCategory
  );

  const isHubActive = currentPath === '/student-reports' || title === 'Student Reports Center';

  return (
    <header className="bg-white border-b border-slate-200/90 shadow-2xs sticky top-0 z-30">
      {/* 1. Main Action & Title Row */}
      <div className="px-4 md:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          {showBack && onNavigate && (
            <button
              onClick={() => onNavigate('/student-reports')}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              title="Back to Reports Hub"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold shrink-0">
              {currentReport ? (
                <currentReport.icon className="w-4 h-4" />
              ) : (
                <LayoutGrid className="w-4 h-4" />
              )}
            </div>
            <div>
              <h1 className="text-sm md:text-base font-bold text-slate-800 tracking-tight leading-tight flex items-center gap-2">
                <span>{title}</span>
                {currentReport?.badge && (
                  <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
                    {currentReport.badge}
                  </span>
                )}
              </h1>
              <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
                <button
                  onClick={() => onNavigate && onNavigate('/')}
                  className="hover:text-indigo-600 transition-colors flex items-center gap-1"
                >
                  <Home className="w-3 h-3" />
                  <span>Home</span>
                </button>
                <span>/</span>
                <span className="text-slate-500">{subtitle}</span>
                <span>/</span>
                <button
                  onClick={() => onNavigate && onNavigate('/student-reports')}
                  className="text-slate-500 hover:text-indigo-600 transition-colors"
                >
                  Reports
                </button>
                <span>/</span>
                <span className="text-indigo-600 font-medium truncate max-w-[140px] sm:max-w-none">
                  {title}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Action Tools: Jump Dropdown, Hub Button, Print, Export */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Jump to Report Dropdown */}
          <div className="relative" ref={jumpRef}>
            <button
              onClick={() => setIsJumpOpen(!isJumpOpen)}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
              title="Jump directly to any of the 18 student reports"
            >
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Jump Report</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isJumpOpen && (
              <div className="absolute right-0 mt-1.5 w-72 sm:w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 pb-2 border-b border-slate-100">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={jumpSearch}
                      onChange={e => setJumpSearch(e.target.value)}
                      placeholder="Search 18 student reports..."
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="max-h-64 overflow-y-auto px-1.5 py-1 space-y-0.5 custom-scrollbar">
                  {filteredJumpReports.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400 font-medium">
                      No matching reports found
                    </div>
                  ) : (
                    filteredJumpReports.map(rep => {
                      const Icon = rep.icon;
                      const isSelected =
                        currentReport?.id === rep.id || currentPath === rep.path;
                      return (
                        <button
                          key={rep.id}
                          onClick={() => {
                            setIsJumpOpen(false);
                            setJumpSearch('');
                            if (onNavigate) onNavigate(rep.path);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left text-xs transition ${
                            isSelected
                              ? 'bg-indigo-50 text-indigo-700 font-semibold'
                              : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center space-x-2 truncate">
                            <Icon
                              className={`w-3.5 h-3.5 shrink-0 ${
                                isSelected ? 'text-indigo-600' : 'text-slate-400'
                              }`}
                            />
                            <span className="truncate">{rep.title}</span>
                          </div>
                          {isSelected && (
                            <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 ml-1" />
                          )}
                        </button>
                      );
                    })
                  )}
                </div>

                <div className="pt-1.5 px-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>18 Reports Available</span>
                  <button
                    onClick={() => {
                      setIsJumpOpen(false);
                      if (onNavigate) onNavigate('/student-reports');
                    }}
                    className="text-indigo-600 hover:underline font-medium"
                  >
                    View All Hub →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Hub Overview Button */}
          <button
            onClick={() => onNavigate && onNavigate('/student-reports')}
            className={`inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
              isHubActive
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
            title="Overview Hub of all 18 student reports"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Hub</span>
          </button>

          {/* Print */}
          {onPrint && (
            <button
              onClick={onPrint}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium shadow-2xs transition-colors"
              title="Print active report"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Print</span>
            </button>
          )}

          {/* Export CSV */}
          {onExport && (
            <button
              onClick={onExport}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold shadow-2xs transition-colors"
              title="Export report data as CSV"
            >
              <FileDown className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Export</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Top Navigation Bar: Category Division Tabs */}
      <div className="px-4 md:px-6 pt-2 pb-1.5 bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Reports Hub Tab */}
          <button
            onClick={() => onNavigate && onNavigate('/student-reports')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isHubActive
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border border-slate-200/90'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>All Reports Hub</span>
          </button>

          <span className="h-4 w-px bg-slate-300 mx-1 shrink-0" />

          {/* Category Tabs */}
          {STUDENT_REPORT_CATEGORIES.map(cat => {
            const CatIcon = cat.icon;
            const isCategoryActive = selectedCategory === cat.id && !isHubActive;
            const count = ALL_STUDENT_REPORTS.filter(
              r => r.categoryId === cat.id
            ).length;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  // If we are currently on the Hub, jump to the first report in this category
                  if (isHubActive && onNavigate) {
                    const firstRep = ALL_STUDENT_REPORTS.find(
                      r => r.categoryId === cat.id
                    );
                    if (firstRep) onNavigate(firstRep.path);
                  }
                }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                  isCategoryActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/90'
                }`}
              >
                <CatIcon className="w-3.5 h-3.5" />
                <span>{cat.title}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                    isCategoryActive
                      ? 'bg-slate-700 text-slate-100'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Sub-Navbar: Active Category Report Pills */}
      {!isHubActive && (
        <div className="px-4 md:px-6 py-2 bg-white flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 shrink-0 hidden sm:inline">
            Reports:
          </span>
          {categoryReports.map(rep => {
            const Icon = rep.icon;
            const isSelected =
              currentReport?.id === rep.id || currentPath === rep.path;

            return (
              <button
                key={rep.id}
                onClick={() => onNavigate && onNavigate(rep.path)}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all shrink-0 ${
                  isSelected
                    ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                    : 'bg-slate-100/90 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border border-slate-200/60'
                }`}
                title={rep.description}
              >
                <Icon className="w-3 h-3" />
                <span>{rep.shortTitle}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
