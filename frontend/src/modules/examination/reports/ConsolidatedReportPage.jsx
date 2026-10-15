import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Search,
  Printer,
  FileDown,
  Home,
  CheckCircle2
} from 'lucide-react';

export function ConsolidatedReportPage({ onNavigate }) {
  const [selectedClass, setSelectedClass] = useState('I');
  const [selectedSection, setSelectedSection] = useState('A');
  const [groupType, setGroupType] = useState('Marks');
  const [term, setTerm] = useState('Half Yearly Examination');
  const [reportType, setReportType] = useState('Horizontal');
  const [subject, setSubject] = useState('All');
  const [isGenerated, setIsGenerated] = useState(true);

  const subjects = ['ENGLISH', 'HINDI', 'MATHEMATICS', 'EVS'];

  const studentsMatrix = [
    { rollNo: '01', scholarNo: 'JD-101', name: 'Aarav Sharma', marks: { ENGLISH: 92, HINDI: 88, MATHEMATICS: 96, EVS: 90 }, total: 366, max: 400, pct: 91.5, grade: 'A1', result: 'PASS' },
    { rollNo: '02', scholarNo: 'JD-102', name: 'Ananya Gupta', marks: { ENGLISH: 95, HINDI: 92, MATHEMATICS: 98, EVS: 96 }, total: 381, max: 400, pct: 95.25, grade: 'A1', result: 'PASS' },
    { rollNo: '03', scholarNo: 'JD-103', name: 'Chirag Sethi', marks: { ENGLISH: 78, HINDI: 80, MATHEMATICS: 72, EVS: 76 }, total: 306, max: 400, pct: 76.5, grade: 'B1', result: 'PASS' },
    { rollNo: '04', scholarNo: 'JD-104', name: 'Diya Choudhary', marks: { ENGLISH: 98, HINDI: 96, MATHEMATICS: 100, EVS: 98 }, total: 392, max: 400, pct: 98.0, grade: 'A1', result: 'PASS' },
    { rollNo: '05', scholarNo: 'JD-105', name: 'Kabir Verma', marks: { ENGLISH: 84, HINDI: 82, MATHEMATICS: 88, EVS: 86 }, total: 340, max: 400, pct: 85.0, grade: 'A2', result: 'PASS' },
    { rollNo: '06', scholarNo: 'JD-106', name: 'Mehul Soni', marks: { ENGLISH: 68, HINDI: 70, MATHEMATICS: 65, EVS: 72 }, total: 275, max: 400, pct: 68.75, grade: 'B2', result: 'PASS' }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    setIsGenerated(true);
  };

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["Roll No,Scholar No,Student Name,English,Hindi,Maths,EVS,Total,Max,Percentage,Grade,Result"].concat(
        studentsMatrix.map(s =>
          `"${s.rollNo}","${s.scholarNo}","${s.name}","${s.marks.ENGLISH}","${s.marks.HINDI}","${s.marks.MATHEMATICS}","${s.marks.EVS}","${s.total}","${s.max}","${s.pct}%","${s.grade}","${s.result}"`
        )
      ).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `consolidated_report_${selectedClass}_${selectedSection}.csv`);
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
            Consolidated Report
          </h1>
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <button onClick={() => onNavigate?.('/')} className="hover:text-indigo-600 flex items-center">
              <Home className="w-3.5 h-3.5 mr-1" />
            </button>
            <span>•</span>
            <span className="hover:text-indigo-600 cursor-pointer" onClick={() => onNavigate?.('/examination-reports')}>Examination</span>
            <span>•</span>
            <span className="text-slate-800 font-medium">Consolidated Report</span>
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
              <label className="block font-bold text-slate-600 mb-1">Group Type</label>
              <select
                value={groupType}
                onChange={(e) => setGroupType(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 font-semibold"
              >
                <option value="Marks">Marks</option>
                <option value="Grade">Grade</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-600 mb-1">Term</label>
              <select
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 font-semibold"
              >
                <option value="Half Yearly Examination">Half Yearly Exam</option>
                <option value="Annual Examination">Annual Exam</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-600 mb-1">Report Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 font-semibold"
              >
                <option value="Horizontal">Horizontal Matrix</option>
                <option value="Vertical">Vertical Subject-wise</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-600 mb-1">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 font-semibold"
              >
                <option value="All">All Subjects</option>
                <option value="ENGLISH">English</option>
                <option value="MATHEMATICS">Mathematics</option>
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

        {/* Matrix View */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden print:border-none print:shadow-none">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap justify-between items-center text-xs font-bold text-slate-800">
            <span>Class {selectedClass}-{selectedSection} Consolidated Marksheet ({term})</span>
            <span>Total Candidates: {studentsMatrix.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-3 w-12 text-center">Roll</th>
                  <th className="py-3 px-3 w-24">Scholar No</th>
                  <th className="py-3 px-3 w-36">Student Name</th>
                  {subjects.map(sub => (
                    <th key={sub} className="py-3 px-3 text-center">{sub} (100)</th>
                  ))}
                  <th className="py-3 px-3 text-center font-bold text-slate-900">Total (400)</th>
                  <th className="py-3 px-3 text-center font-bold text-slate-900">%</th>
                  <th className="py-3 px-3 text-center font-bold text-slate-900">Grade</th>
                  <th className="py-3 px-3 text-center font-bold text-slate-900">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {studentsMatrix.map((s) => (
                  <tr key={s.scholarNo} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-600">{s.rollNo}</td>
                    <td className="py-3 px-3 font-mono text-slate-600">{s.scholarNo}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">{s.name}</td>
                    {subjects.map(sub => (
                      <td key={sub} className="py-3 px-3 text-center font-semibold">
                        {s.marks[sub]}
                      </td>
                    ))}
                    <td className="py-3 px-3 text-center font-extrabold text-indigo-700 bg-indigo-50/30">
                      {s.total}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-emerald-600">
                      {s.pct}%
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                        {s.grade}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-emerald-600 font-bold text-xs">{s.result}</span>
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
