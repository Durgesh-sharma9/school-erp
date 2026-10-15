import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Search,
  Printer,
  FileDown,
  Home,
  FileText
} from 'lucide-react';

export function BlankExamFormatReportPage({ onNavigate }) {
  const [reportType, setReportType] = useState('Exam Name Wise');
  const [selectedClass, setSelectedClass] = useState('I');
  const [selectedSection, setSelectedSection] = useState('A');
  const [groupType, setGroupType] = useState('Marks');
  const [term, setTerm] = useState('Half Yearly Examination');
  const [subject, setSubject] = useState('MATHEMATICS');
  const [rowCount, setRowCount] = useState(25);
  const [isGenerated, setIsGenerated] = useState(true);

  const handleSearch = (e) => {
    e.preventDefault();
    setIsGenerated(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["S.No,Roll No,Scholar No,Student Name,Father Name,Max Marks (100),Min Marks (33),Marks Obtained,Signature"].concat(
        Array.from({ length: Number(rowCount) || 25 }).map((_, i) =>
          `"${i + 1}","${(i + 1).toString().padStart(2, '0')}","JD-2026-${101 + i}","Student ${i + 1}","Father ${i + 1}","100","33","",""`
        )
      ).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `blank_exam_format_${selectedClass}_${subject}.csv`);
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
            Blank Exam Format
          </h1>
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <button onClick={() => onNavigate?.('/')} className="hover:text-indigo-600 flex items-center">
              <Home className="w-3.5 h-3.5 mr-1" />
            </button>
            <span>•</span>
            <span className="hover:text-indigo-600 cursor-pointer" onClick={() => onNavigate?.('/examination-reports')}>Examination</span>
            <span>•</span>
            <span className="text-slate-800 font-medium">Blank Exam Format</span>
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
            onClick={handlePrint}
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
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 text-xs items-end">
            <div>
              <label className="block font-bold text-slate-600 mb-1">Report Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 font-semibold"
              >
                <option value="Exam Name Wise">Exam Name Wise</option>
                <option value="Class Wise">Class Wise</option>
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
                <option value="III">Class III</option>
                <option value="IV">Class IV</option>
                <option value="V">Class V</option>
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
              <label className="block font-bold text-slate-600 mb-1">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 font-semibold"
              >
                <option value="MATHEMATICS">Mathematics</option>
                <option value="ENGLISH">English</option>
                <option value="HINDI">Hindi</option>
                <option value="EVS">EVS</option>
                <option value="SCIENCE">Science</option>
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

        {/* Printable Blank Sheet */}
        {isGenerated && (
          <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-xs print:p-0 print:border-none print:shadow-none space-y-6">
            {/* Header in Sheet */}
            <div className="text-center border-b-2 border-slate-800 pb-4">
              <h2 className="text-xl font-extrabold uppercase text-slate-900 tracking-wide">
                J D International School
              </h2>
              <p className="text-xs text-slate-600 font-medium">Session: 2026-2027 | Examination Evaluation Record</p>
              <div className="mt-3 flex flex-wrap items-center justify-between text-xs font-bold text-slate-800 bg-slate-100 px-4 py-2 rounded-lg border border-slate-300">
                <span>Class & Sec: {selectedClass} - {selectedSection}</span>
                <span>Term: {term}</span>
                <span>Subject: {subject}</span>
                <span>Max Marks: 100 | Min Marks: 33</span>
              </div>
            </div>

            {/* Blank Table for Marks Entry */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 text-[11px] font-bold text-slate-800 uppercase">
                    <th className="py-2.5 px-3 border-r border-slate-300 w-12 text-center">S.No.</th>
                    <th className="py-2.5 px-3 border-r border-slate-300 w-16 text-center">Roll No</th>
                    <th className="py-2.5 px-3 border-r border-slate-300 w-28">Scholar No</th>
                    <th className="py-2.5 px-3 border-r border-slate-300">Student's Name</th>
                    <th className="py-2.5 px-3 border-r border-slate-300">Father's Name</th>
                    <th className="py-2.5 px-3 border-r border-slate-300 w-32 text-center">Marks (Out of 100)</th>
                    <th className="py-2.5 px-3 w-36 text-center">Teacher Signature</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300 font-medium">
                  {Array.from({ length: Number(rowCount) || 25 }).map((_, i) => (
                    <tr key={i} className="h-9">
                      <td className="py-1.5 px-3 border-r border-slate-300 text-center font-bold text-slate-600">{i + 1}</td>
                      <td className="py-1.5 px-3 border-r border-slate-300 text-center font-mono font-bold">{(i + 1).toString().padStart(2, '0')}</td>
                      <td className="py-1.5 px-3 border-r border-slate-300 font-mono text-slate-700">JD-2026-{101 + i}</td>
                      <td className="py-1.5 px-3 border-r border-slate-300 font-bold text-slate-900">Student Name {i + 1}</td>
                      <td className="py-1.5 px-3 border-r border-slate-300 text-slate-600">Father Name {i + 1}</td>
                      <td className="py-1.5 px-3 border-r border-slate-300 text-center bg-slate-50/50"></td>
                      <td className="py-1.5 px-3 text-center"></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom Signatures */}
            <div className="pt-10 flex justify-between items-center text-xs font-bold text-slate-800">
              <div className="text-center">
                <div className="w-40 border-b border-slate-800 mb-1"></div>
                <span>Subject Teacher Signature</span>
              </div>
              <div className="text-center">
                <div className="w-40 border-b border-slate-800 mb-1"></div>
                <span>Exam In-Charge Signature</span>
              </div>
              <div className="text-center">
                <div className="w-40 border-b border-slate-800 mb-1"></div>
                <span>Principal / Director</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
