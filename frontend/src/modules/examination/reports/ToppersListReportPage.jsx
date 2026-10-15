import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Search,
  Printer,
  FileDown,
  Home,
  Trophy,
  Medal,
  Award
} from 'lucide-react';

export function ToppersListReportPage({ onNavigate }) {
  const [reportType, setReportType] = useState('Topper List');
  const [selectedClass, setSelectedClass] = useState('I');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedTerm, setSelectedTerm] = useState('Half Yearly Examination');
  const [selectedExam, setSelectedExam] = useState('All Exams');
  const [limit, setLimit] = useState('All');
  const [isGenerated, setIsGenerated] = useState(true);

  const mockToppers = [
    { rank: 1, scholarNo: 'JD-104', name: 'Diya Choudhary', father: 'Suresh Choudhary', marks: '492/500', percentage: '98.4%', grade: 'A1' },
    { rank: 2, scholarNo: 'JD-102', name: 'Ananya Gupta', father: 'Rajesh Gupta', marks: '485/500', percentage: '97.0%', grade: 'A1' },
    { rank: 3, scholarNo: 'JD-101', name: 'Aarav Sharma', father: 'Manoj Sharma', marks: '472/500', percentage: '94.4%', grade: 'A1' },
    { rank: 4, scholarNo: 'JD-105', name: 'Kabir Verma', father: 'Anil Verma', marks: '450/500', percentage: '90.0%', grade: 'A2' },
    { rank: 5, scholarNo: 'JD-103', name: 'Chirag Sethi', father: 'Vikram Sethi', marks: '430/500', percentage: '86.0%', grade: 'A2' },
    { rank: 6, scholarNo: 'JD-106', name: 'Mehul Soni', father: 'Kishore Soni', marks: '395/500', percentage: '79.0%', grade: 'B1' }
  ];

  const displayedList = limit === 'Top 3'
    ? mockToppers.slice(0, 3)
    : limit === 'Top 5'
    ? mockToppers.slice(0, 5)
    : mockToppers;

  const handleSearch = (e) => {
    e.preventDefault();
    setIsGenerated(true);
  };

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["Rank,Scholar No,Student Name,Father Name,Marks,Percentage,Grade"].concat(
        displayedList.map(t =>
          `"${t.rank}","${t.scholarNo}","${t.name}","${t.father}","${t.marks}","${t.percentage}","${t.grade}"`
        )
      ).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `toppers_list_${selectedClass}_${selectedSection}.csv`);
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
            Toppers List
          </h1>
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <button onClick={() => onNavigate?.('/')} className="hover:text-indigo-600 flex items-center">
              <Home className="w-3.5 h-3.5 mr-1" />
            </button>
            <span>•</span>
            <span className="hover:text-indigo-600 cursor-pointer" onClick={() => onNavigate?.('/examination-reports')}>Examination</span>
            <span>•</span>
            <span className="text-slate-800 font-medium">Toppers List</span>
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
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 text-xs items-end">
            <div>
              <label className="block font-bold text-slate-600 mb-1">Report Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 font-semibold"
              >
                <option value="Topper List">Topper List</option>
                <option value="Class Toppers">Class Toppers</option>
              </select>
            </div>

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
              <label className="block font-bold text-slate-600 mb-1">Limit</label>
              <select
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 font-semibold text-indigo-700"
              >
                <option value="All">All Toppers</option>
                <option value="Top 3">Top 3 Only</option>
                <option value="Top 5">Top 5 Only</option>
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

        {/* Podium Banner for Top 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:hidden">
          {displayedList.slice(0, 3).map((t, idx) => (
            <div
              key={t.scholarNo}
              className={`p-4 rounded-xl border flex items-center gap-4 shadow-xs ${
                idx === 0
                  ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                  : idx === 1
                  ? 'bg-slate-100 border-slate-300 text-slate-800'
                  : 'bg-orange-50/80 border-orange-200 text-orange-900'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-extrabold shadow-xs ${
                idx === 0 ? 'bg-amber-400 text-white' : idx === 1 ? 'bg-slate-400 text-white' : 'bg-orange-400 text-white'
              }`}>
                {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold uppercase tracking-wider opacity-75">
                  Rank #{t.rank} • {t.grade}
                </div>
                <h4 className="font-extrabold text-sm truncate">{t.name}</h4>
                <div className="text-xs font-semibold mt-0.5">
                  Score: <span className="font-bold">{t.marks}</span> ({t.percentage})
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Table View */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden print:border-none print:shadow-none">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs font-bold text-slate-800">
            <span>Toppers Merit Roster: Class {selectedClass} - {selectedSection} ({selectedTerm})</span>
            <span>Total Listed: {displayedList.length}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4 w-16 text-center">Rank</th>
                  <th className="py-3 px-4 w-28">Scholar No</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Father Name</th>
                  <th className="py-3 px-4 text-center">Marks Obtained</th>
                  <th className="py-3 px-4 text-center">Percentage</th>
                  <th className="py-3 px-4 text-center">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {displayedList.map((t) => (
                  <tr key={t.scholarNo} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-extrabold text-xs ${
                        t.rank === 1
                          ? 'bg-amber-100 text-amber-800'
                          : t.rank === 2
                          ? 'bg-slate-200 text-slate-700'
                          : t.rank === 3
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {t.rank}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{t.scholarNo}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{t.name}</td>
                    <td className="py-3.5 px-4 text-slate-600">{t.father}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-800">{t.marks}</td>
                    <td className="py-3.5 px-4 text-center font-extrabold text-emerald-600">{t.percentage}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {t.grade}
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
