import React, { useState } from 'react';
import {
  Search,
  ArrowRight,
  TrendingUp,
  Users,
  CalendarCheck,
  GraduationCap,
  Award,
  Sparkles,
  FileCheck2,
  Filter,
  X
} from 'lucide-react';
import { ReportHeader } from './ReportHeader';
import {
  STUDENT_REPORT_CATEGORIES,
  ALL_STUDENT_REPORTS
} from './studentReportsCatalog';

const COLOR_THEMES = {
  blue: {
    gradient: 'from-blue-600 to-indigo-600',
    glow: 'shadow-blue-500/20',
    badgeBg: 'bg-blue-50/80 text-blue-700 border-blue-200/70',
  },
  slate: {
    gradient: 'from-slate-700 to-slate-900',
    glow: 'shadow-slate-500/20',
    badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
  },
  indigo: {
    gradient: 'from-indigo-600 to-violet-600',
    glow: 'shadow-indigo-500/20',
    badgeBg: 'bg-indigo-50/80 text-indigo-700 border-indigo-200/70',
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
  purple: {
    gradient: 'from-purple-600 to-pink-600',
    glow: 'shadow-purple-500/20',
    badgeBg: 'bg-purple-50/80 text-purple-700 border-purple-200/70',
  },
  violet: {
    gradient: 'from-violet-600 to-indigo-600',
    glow: 'shadow-violet-500/20',
    badgeBg: 'bg-violet-50/80 text-violet-700 border-violet-200/70',
  },
  fuchsia: {
    gradient: 'from-fuchsia-500 to-purple-600',
    glow: 'shadow-fuchsia-500/20',
    badgeBg: 'bg-fuchsia-50/80 text-fuchsia-700 border-fuchsia-200/70',
  },
  emerald: {
    gradient: 'from-emerald-500 to-teal-600',
    glow: 'shadow-emerald-500/20',
    badgeBg: 'bg-emerald-50/80 text-emerald-700 border-emerald-200/70',
  },
  green: {
    gradient: 'from-emerald-600 to-green-600',
    glow: 'shadow-green-500/20',
    badgeBg: 'bg-emerald-50/80 text-emerald-700 border-emerald-200/70',
  },
  lime: {
    gradient: 'from-emerald-500 to-teal-700',
    glow: 'shadow-teal-500/20',
    badgeBg: 'bg-teal-50/80 text-teal-700 border-teal-200/70',
  },
  amber: {
    gradient: 'from-amber-500 to-orange-600',
    glow: 'shadow-amber-500/20',
    badgeBg: 'bg-amber-50/80 text-amber-800 border-amber-200/70',
  },
  rose: {
    gradient: 'from-rose-500 to-pink-600',
    glow: 'shadow-rose-500/20',
    badgeBg: 'bg-rose-50/80 text-rose-700 border-rose-200/70',
  },
  orange: {
    gradient: 'from-orange-500 to-amber-600',
    glow: 'shadow-orange-500/20',
    badgeBg: 'bg-orange-50/80 text-orange-700 border-orange-200/70',
  }
};

export function StudentReportsHubPage({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredReports = ALL_STUDENT_REPORTS.filter(report => {
    const matchesCategory =
      activeCategory === 'all' || report.categoryId === activeCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      report.title.toLowerCase().includes(q) ||
      report.shortTitle.toLowerCase().includes(q) ||
      report.description.toLowerCase().includes(q) ||
      report.badge.toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Unified Top Reports Navbar */}
      <ReportHeader
        title="Student Reports Center"
        subtitle="Student"
        onNavigate={onNavigate}
        showBack={false}
      />

      <div className="p-3 md:p-4 max-w-7xl mx-auto w-full space-y-4 flex-1">
        {/* Filter & Search Bar - Compact */}
        <div className="bg-white rounded-xl p-3.5 md:p-4 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search report by name, keywords..."
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

            {/* Results count */}
            <div className="text-xs text-slate-500 font-medium">
              Showing <span className="font-bold text-indigo-600">{filteredReports.length}</span> of 18 reports
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 border-t border-slate-100">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all shrink-0 cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
              }`}
            >
              All Reports (18)
            </button>
            {STUDENT_REPORT_CATEGORIES.map(cat => {
              const count = ALL_STUDENT_REPORTS.filter(r => r.categoryId === cat.id).length;
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                  }`}
                >
                  <span>{cat.title}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Reports Grid with Compact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredReports.map(report => {
            const Icon = report.icon;
            const theme = COLOR_THEMES[report.color] || COLOR_THEMES.blue;

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
    </div>
  );
}

export default StudentReportsHubPage;
