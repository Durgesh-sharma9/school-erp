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
  Filter
} from 'lucide-react';
import { ReportHeader } from './ReportHeader';
import {
  STUDENT_REPORT_CATEGORIES,
  ALL_STUDENT_REPORTS
} from './studentReportsCatalog';

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
      {/* 1:1 Unified Top Reports Navbar */}
      <ReportHeader
        title="Student Reports Center"
        subtitle="Student"
        onNavigate={onNavigate}
        showBack={false}
      />

      <div className="p-4 md:p-6 max-w-7xl mx-auto w-full space-y-6 flex-1">
        {/* Hero KPI Summary Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-indigo-500/10 to-transparent pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Centralized Student Reporting Suite</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-white">
                Student Reports & Records Directory
              </h2>
              <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Access, analyze, and export all 18 student lists, attendance matrices, board registrations, academic progression, and TC records in one click.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Reports</span>
                <p className="text-xl font-extrabold text-white mt-0.5">18</p>
                <span className="text-[10px] text-indigo-300">Available</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Students</span>
                <p className="text-xl font-extrabold text-white mt-0.5">1,248</p>
                <span className="text-[10px] text-emerald-400">Active Roster</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Attendance</span>
                <p className="text-xl font-extrabold text-white mt-0.5">94.8%</p>
                <span className="text-[10px] text-cyan-300">Today</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">TC Issued</span>
                <p className="text-xl font-extrabold text-white mt-0.5">14</p>
                <span className="text-[10px] text-amber-300">2026-27</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Live Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search report by name, keywords (e.g. Attendance, TC, Board)..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition"
              />
            </div>

            {/* Results count */}
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
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
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
                      : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
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

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReports.map(report => {
            const Icon = report.icon;
            return (
              <div
                key={report.id}
                onClick={() => onNavigate && onNavigate(report.path)}
                className="group bg-white rounded-xl border border-slate-200/90 hover:border-indigo-300 p-5 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-200 flex items-center justify-center font-bold shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-700 rounded-full transition-colors">
                      {report.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {report.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
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
              We couldn't find any student report matching "{searchQuery}". Try searching for words like Attendance, TC, Board, or Promotion.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
export default StudentReportsHubPage;
