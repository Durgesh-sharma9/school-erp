import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Search,
  Printer,
  FileDown,
  Home,
  CheckCircle2
} from 'lucide-react';

export function StudentSignatureSheetReportPage({ onNavigate }) {
  const [selectedClass, setSelectedClass] = useState('I');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedTerm, setSelectedTerm] = useState('Half Yearly Examination');
  const [selectedExam, setSelectedExam] = useState('All Exams');
  const [sorting, setSorting] = useState('Roll No');
  const [isGenerated, setIsGenerated] = useState(true);

  const mockStudents = [
    { sNo: 1, rollNo: '01', scholarNo: 'JD-101', name: 'Aarav Sharma', father: 'Manoj Sharma', deskNo: 'D-01' },
    { sNo: 2, rollNo: '02', scholarNo: 'JD-102', name: 'Ananya Gupta', father: 'Rajesh Gupta', deskNo: 'D-02' },
    { sNo: 3, rollNo: '03', scholarNo: 'JD-103', name: 'Chirag Sethi', father: 'Vikram Sethi', deskNo: 'D-03' },
    { sNo: 4, rollNo: '04', scholarNo: 'JD-104', name: 'Diya Choudhary', father: 'Suresh Choudhary', deskNo: 'D-04' },
    { sNo: 5, rollNo: '05', scholarNo: 'JD-105', name: 'Kabir Verma', father: 'Anil Verma', deskNo: 'D-05' },
    { sNo: 6, rollNo: '06', scholarNo: 'JD-106', name: 'Mehul Soni', father: 'Kishore Soni', deskNo: 'D-06' },
    { sNo: 7, rollNo: '07', scholarNo: 'JD-107', name: 'Pari Rawat', father: 'Kamal Rawat', deskNo: 'D-07' },
    { sNo: 8, rollNo: '08', scholarNo: 'JD-108', name: 'Reyansh Singh', father: 'Digvijay Singh', deskNo: 'D-08' }
  ];

  const handleGenerate = (e) => {
    e.preventDefault();
    setIsGenerated(true);
  };

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["S.No,Roll No,Scholar No,Student Name,Father Name,Desk No,Signature"].concat(
        mockStudents.map((s, i) =>
          `"${i + 1}","${s.rollNo}","${s.scholarNo}","${s.name}","${s.father}","${s.deskNo}",""`
        )
      ).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `student_signature_sheet_${selectedClass}_${selectedSection}.csv`);
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
            Student Signature Sheet
          </h1>
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <button onClick={() => onNavigate?.('/')} className="hover:text-indigo-600 flex items-center">
              <Home className="w-3.5 h-3.5 mr-1" />
            </button>
            <span>•</span>
            <span className="hover:text-indigo-600 cursor-pointer" onClick={() => onNavigate?.('/examination-reports')}>Examination</span>
            <span>•</span>
            <span className="text-slate-800 font-medium">Student Signature Sheet</span>
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
          <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs items-end">
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
                <option value="Unit Test 1">Unit Test 1</option>
                <option value="Half Yearly Theory">Half Yearly Theory</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-600 mb-1">Sorting</label>
              <select
                value={sorting}
                onChange={(e) => setSorting(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 font-semibold"
              >
                <option value="Roll No">Roll No</option>
                <option value="Student Name">Student Name</option>
                <option value="Scholar No">Scholar No</option>
              </select>
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-xs flex items-center justify-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Generate Report</span>
              </button>
            </div>
          </form>
        </div>

        {/* Printable Signature Sheet */}
        {isGenerated && (
          <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-xs print:p-0 print:border-none print:shadow-none space-y-6">
            <div className="text-center border-b-2 border-slate-800 pb-4">
              <h2 className="text-xl font-extrabold uppercase text-slate-900 tracking-wide">
                J D International School
              </h2>
              <p className="text-xs text-slate-600 font-medium">Session: 2026-2027 | Student Examination Attendance & Signature Sheet</p>
              <div className="mt-3 flex flex-wrap items-center justify-between text-xs font-bold text-slate-800 bg-slate-100 px-4 py-2 rounded-lg border border-slate-300">
                <span>Class: {selectedClass} - {selectedSection}</span>
                <span>Term: {selectedTerm}</span>
                <span>Exam: {selectedExam}</span>
                <span>Total Candidates: {mockStudents.length}</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 text-[11px] font-bold text-slate-800 uppercase">
                    <th className="py-2.5 px-3 border-r border-slate-300 w-12 text-center">S.No.</th>
                    <th className="py-2.5 px-3 border-r border-slate-300 w-16 text-center">Roll No</th>
                    <th className="py-2.5 px-3 border-r border-slate-300 w-28">Scholar No</th>
                    <th className="py-2.5 px-3 border-r border-slate-300">Student Name</th>
                    <th className="py-2.5 px-3 border-r border-slate-300">Father's Name</th>
                    <th className="py-2.5 px-3 border-r border-slate-300 w-24 text-center">Desk No</th>
                    <th className="py-2.5 px-3 w-40 text-center">Candidate's Signature</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300 font-medium">
                  {mockStudents.map((s, i) => (
                    <tr key={s.sNo} className="h-10">
                      <td className="py-1.5 px-3 border-r border-slate-300 text-center font-bold text-slate-600">{i + 1}</td>
                      <td className="py-1.5 px-3 border-r border-slate-300 text-center font-mono font-bold text-slate-900">{s.rollNo}</td>
                      <td className="py-1.5 px-3 border-r border-slate-300 font-mono text-slate-700">{s.scholarNo}</td>
                      <td className="py-1.5 px-3 border-r border-slate-300 font-bold text-slate-900">{s.name}</td>
                      <td className="py-1.5 px-3 border-r border-slate-300 text-slate-600">{s.father}</td>
                      <td className="py-1.5 px-3 border-r border-slate-300 text-center font-bold text-indigo-700">{s.deskNo}</td>
                      <td className="py-1.5 px-3 text-center"></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-8 flex justify-between items-center text-xs font-bold text-slate-800">
              <div className="text-center">
                <div className="w-40 border-b border-slate-800 mb-1"></div>
                <span>Room Invigilator Signature</span>
              </div>
              <div className="text-center">
                <div className="w-40 border-b border-slate-800 mb-1"></div>
                <span>Centre Superintendent</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
