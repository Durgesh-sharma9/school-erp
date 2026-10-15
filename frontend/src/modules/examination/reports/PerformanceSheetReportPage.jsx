import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Search,
  Printer,
  FileDown,
  Home,
  BarChart3,
  TrendingUp,
  Award
} from 'lucide-react';

export function PerformanceSheetReportPage({ onNavigate }) {
  const [selectedClass, setSelectedClass] = useState('I');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedTerm, setSelectedTerm] = useState('Half Yearly Examination');
  const [selectedExam, setSelectedExam] = useState('All Exams');
  const [passingPct, setPassingPct] = useState(33);
  const [subject, setSubject] = useState('All');
  const [sorting, setSorting] = useState('Roll No');
  const [withInactive, setWithInactive] = useState(false);
  const [isGenerated, setIsGenerated] = useState(true);

  const stats = {
    totalStudents: 45,
    appeared: 45,
    passed: 43,
    failed: 2,
    passPercentage: '95.6%',
    classAverage: '82.4%',
    highestScore: '98.4%'
  };

  const subjectPerformance = [
    { subject: 'MATHEMATICS', maxMarks: 100, passCount: 42, failCount: 3, avgMarks: 81.5, highest: 100, passRate: '93.3%' },
    { subject: 'ENGLISH', maxMarks: 100, passCount: 45, failCount: 0, avgMarks: 86.2, highest: 98, passRate: '100%' },
    { subject: 'HINDI', maxMarks: 100, passCount: 44, failCount: 1, avgMarks: 83.0, highest: 96, passRate: '97.8%' },
    { subject: 'EVS', maxMarks: 100, passCount: 45, failCount: 0, avgMarks: 88.4, highest: 99, passRate: '100%' }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    setIsGenerated(true);
  };

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["Subject,Max Marks,Passed,Failed,Average,Highest,Pass Rate"].concat(
        subjectPerformance.map(s =>
          `"${s.subject}","${s.maxMarks}","${s.passCount}","${s.failCount}","${s.avgMarks}","${s.highest}","${s.passRate}"`
        )
      ).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `performance_sheet_${selectedClass}_${selectedSection}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1:1 Secondary Top Header Toolbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20 print:hidden">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-bold text-slate-800 pr-3 border-r border-slate-300">
            Performance Sheet Report
          </h1>
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <button onClick={() => onNavigate?.('/')} className="hover:text-indigo-600 flex items-center">
              <Home className="w-3.5 h-3.5 mr-1" />
            </button>
            <span>•</span>
            <span className="hover:text-indigo-600 cursor-pointer" onClick={() => onNavigate?.('/examination-reports')}>Examination</span>
            <span>•</span>
            <span className="text-slate-800 font-medium">Performance Report</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={exportCSV}
            className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 text-xs font-semibold flex items-center gap-1.5"
            title="Excel Export"
          >
            <FileDown className="w-4 h-4" />
            <span className="hidden sm:inline">Excel</span>
          </button>
          <button
            onClick={() => window.print()}
            className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 text-xs font-semibold flex items-center gap-1.5"
            title="Print"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 max-w-7xl mx-auto w-full space-y-4">
        {/* Filters Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs print:hidden">
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 text-xs items-end">
            <div>
              <label className="block font-bold text-slate-600 mb-1">Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 font-semibold"
              >
                <option value="I">Class I</option>
                <option value="II">Class II</option>
                <option value="X">Class X</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-600 mb-1">Section</label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 font-semibold"
              >
                <option value="A">Section A</option>
                <option value="B">Section B</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-600 mb-1">Term</label>
              <select
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 font-semibold"
              >
                <option value="Half Yearly Examination">Half Yearly Exam</option>
                <option value="Annual Examination">Annual Exam</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-600 mb-1">Exam</label>
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 font-semibold"
              >
                <option value="All Exams">All Exams</option>
                <option value="Half Yearly Theory">Half Yearly Theory</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-600 mb-1">Passing %</label>
              <input
                type="number"
                value={passingPct}
                onChange={(e) => setPassingPct(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 font-semibold text-center"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-600 mb-1">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 font-semibold"
              >
                <option value="All">All Subjects</option>
                <option value="MATHEMATICS">Mathematics</option>
                <option value="ENGLISH">English</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-600 mb-1">Sorting</label>
              <select
                value={sorting}
                onChange={(e) => setSorting(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 font-semibold"
              >
                <option value="Roll No">Roll No.</option>
                <option value="Name">Name</option>
                <option value="Scholar No">Scholar No</option>
              </select>
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-xs flex items-center justify-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
              </button>
            </div>
          </form>
        </div>

        {/* Analytics Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Enrolled</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{stats.totalStudents}</div>
            <span className="text-[11px] font-semibold text-slate-400">100% Attendance in exam</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Overall Pass %</span>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">{stats.passPercentage}</div>
            <span className="text-[11px] font-semibold text-emerald-700">{stats.passed} Passed / {stats.failed} Needs Imp.</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Class Average</span>
            <div className="text-2xl font-extrabold text-indigo-600 mt-1">{stats.classAverage}</div>
            <span className="text-[11px] font-semibold text-slate-400">Above district benchmark</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Highest Score</span>
            <div className="text-2xl font-extrabold text-amber-500 mt-1">{stats.highestScore}</div>
            <span className="text-[11px] font-semibold text-slate-400">Diya Choudhary (JD-104)</span>
          </div>
        </div>

        {/* Subject-Wise Performance Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden print:border-none print:shadow-none">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs font-bold text-slate-800">
            <span>Subject-wise Breakdown: Class {selectedClass} - {selectedSection} ({selectedTerm})</span>
            <span>Cut-off: {passingPct}%</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4 w-16 text-center">S.No.</th>
                  <th className="py-3 px-4">Subject Name</th>
                  <th className="py-3 px-4 w-28 text-center">Max Marks</th>
                  <th className="py-3 px-4 w-28 text-center">Passed</th>
                  <th className="py-3 px-4 w-28 text-center">Failed</th>
                  <th className="py-3 px-4 w-28 text-center">Avg Marks</th>
                  <th className="py-3 px-4 w-28 text-center">Highest</th>
                  <th className="py-3 px-4 w-32 text-center">Pass Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {subjectPerformance.map((s, idx) => (
                  <tr key={s.subject} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center font-bold text-slate-500">{idx + 1}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{s.subject}</td>
                    <td className="py-3.5 px-4 text-center">{s.maxMarks}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-emerald-600">{s.passCount}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-red-500">{s.failCount}</td>
                    <td className="py-3.5 px-4 text-center font-semibold text-slate-800">{s.avgMarks}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-indigo-700">{s.highest}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {s.passRate}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
