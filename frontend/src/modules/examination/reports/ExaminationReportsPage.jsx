import React from 'react';
import {
  FileSpreadsheet,
  FileText,
  Users,
  Trophy,
  Award,
  BarChart3,
  MessageSquare,
  Home,
  ArrowRight
} from 'lucide-react';

export function ExaminationReportsPage({ onNavigate }) {
  const reports = [
    {
      id: 'blank-exam-format',
      title: 'Blank Exam Format',
      path: '/blank-exam-format',
      icon: FileSpreadsheet,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
      description: 'Generate blank marksheet formats with student roster and empty boxes for manual exam evaluation by teachers.'
    },
    {
      id: 'student-signature-sheet',
      title: 'Student Signature Sheet',
      path: '/student-signature-sheet',
      icon: Users,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      description: 'Print examination hall attendance and candidate signature sheets with roll number, scholar number, and desk allocation.'
    },
    {
      id: 'toppers-list',
      title: 'Toppers List',
      path: '/toppers-list',
      icon: Trophy,
      color: 'bg-amber-50 text-amber-600 border-amber-200',
      description: 'Merit list and rank-wise topper students across terms and exams with scores, percentages, and medals.'
    },
    {
      id: 'consolidated-report',
      title: 'Consolidated Report',
      path: '/consolidated-report',
      icon: BarChart3,
      color: 'bg-purple-50 text-purple-600 border-purple-200',
      description: 'Comprehensive multi-subject mark sheet matrix for the entire class with total marks, percentages, and pass/fail summary.'
    },
    {
      id: 'progress-report-card',
      title: 'Progress Report Card',
      path: '/progress-report-card',
      icon: Award,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      description: 'Official CBSE format Progress Report Card (Marksheet) with Scholastic, Co-scholastic grades, remarks, and signatures.'
    },
    {
      id: 'performance-sheet',
      title: 'Performance Sheet Report',
      path: '/performance-sheet',
      icon: BarChart3,
      color: 'bg-teal-50 text-teal-600 border-teal-200',
      description: 'In-depth academic analytics, subject pass rates, grade distributions, and highest/lowest score comparisons.'
    },
    {
      id: 'report-card-remarks',
      title: 'Report Card Remarks',
      path: '/report-card-remark-report',
      icon: MessageSquare,
      color: 'bg-rose-50 text-rose-600 border-rose-200',
      description: 'Pre-saved library of performance, behavioral, and improvement remarks to quickly attach to students report cards.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1:1 Secondary Top Header Toolbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-bold text-slate-800 pr-3 border-r border-slate-300">
            Examination Reports
          </h1>
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <button onClick={() => onNavigate?.('/')} className="hover:text-indigo-600 flex items-center">
              <Home className="w-3.5 h-3.5 mr-1" />
            </button>
            <span>•</span>
            <span className="hover:text-indigo-600 cursor-pointer" onClick={() => onNavigate?.('/exam-terms')}>Examination</span>
            <span>•</span>
            <span className="text-slate-800 font-medium">Reports Overview</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Examination & Assessment Analytics Hub
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Access student progress report cards, blank evaluation sheets, toppers rosters, and marksheet matrices.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reports.map((report) => {
            const Icon = report.icon;
            return (
              <div
                key={report.id}
                onClick={() => onNavigate?.(report.path)}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${report.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm mb-1.5 group-hover:text-indigo-600 transition-colors">
                    {report.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {report.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
                  <span>Open Report</span>
                  <span>&rarr;</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
