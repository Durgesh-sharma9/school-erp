import React, { useState } from 'react';
import {
  Search,
  ArrowRight,
  Home,
  FileText,
  Filter
} from 'lucide-react';
import {
  STUDENT_REPORT_CATEGORIES,
  ALL_STUDENT_REPORTS
} from './studentReportsCatalog';

export function StudentReportsPage({ onNavigate }) {
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
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 px-4 md:px-6 py-3 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-20 shadow-2xs">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800 leading-tight">
              Student Reports
            </h1>
            <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
              <button
                onClick={() => onNavigate && onNavigate('/')}
                className="hover:text-indigo-600 flex items-center gap-1"
              >
                <Home className="w-3 h-3" />
                <span>Home</span>
              </button>
              <span>•</span>
              <span className="text-slate-500">Student</span>
              <span>•</span>
              <span className="text-indigo-600 font-medium">Reports Directory</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Total Reports: <strong className="text-slate-800">18 Available</strong>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 md:p-6 max-w-7xl mx-auto w-full space-y-5 flex-1">
        {/* Intro Banner */}
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Student Reports & Records Directory
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Click on any report card below to view details, filter records, print, or export to CSV.
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search report by name or keyword..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition"
              />
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Showing <span className="font-bold text-indigo-600">{filteredReports.length}</span> of 18 reports
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                activeCategory === 'all'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              All Reports (18)
            </button>
            {STUDENT_REPORT_CATEGORIES.map(cat => {
              const count = ALL_STUDENT_REPORTS.filter(r => r.categoryId === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                    activeCategory === cat.id
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <span>{cat.title}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                    activeCategory === cat.id ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid Boxes (Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {filteredReports.map(report => {
            const Icon = report.icon;
            return (
              <div
                key={report.id}
                onClick={() => onNavigate && onNavigate(report.path)}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-200 flex items-center justify-center font-bold shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-700 rounded-full transition-colors">
                      {report.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm mb-1.5 group-hover:text-indigo-600 transition-colors">
                    {report.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {report.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
                  <span className="group-hover:underline">Open Report</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {filteredReports.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <Filter className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-800">No matching reports found</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No reports match "{searchQuery}". Try searching for words like Attendance, TC, Board, or Promotion.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition"
            >
              Reset Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
export default StudentReportsPage;
