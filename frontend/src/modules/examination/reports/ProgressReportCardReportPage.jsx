import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Search,
  Printer,
  FileDown,
  Home,
  Award,
  Eye
} from 'lucide-react';

export function ProgressReportCardReportPage({ onNavigate }) {
  const [selectedClass, setSelectedClass] = useState('I');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedTerm, setSelectedTerm] = useState('Half Yearly Examination');
  const [selectedStudent, setSelectedStudent] = useState('1');
  const [examDate, setExamDate] = useState('2026-09-25');
  const [reopenDate, setReopenDate] = useState('2026-10-05');
  const [withInactive, setWithInactive] = useState(false);
  const [isGenerated, setIsGenerated] = useState(true);

  const students = [
    { id: '1', rollNo: '01', scholarNo: 'JD-101', name: 'Aarav Sharma', father: 'Manoj Sharma', mother: 'Pooja Sharma', dob: '14/08/2019', attendance: '104/110' },
    { id: '2', rollNo: '02', scholarNo: 'JD-102', name: 'Ananya Gupta', father: 'Rajesh Gupta', mother: 'Sunita Gupta', dob: '22/05/2019', attendance: '108/110' },
    { id: '3', rollNo: '04', scholarNo: 'JD-104', name: 'Diya Choudhary', father: 'Suresh Choudhary', mother: 'Rekha Choudhary', dob: '11/11/2019', attendance: '110/110' }
  ];

  const currentStudent = students.find(s => s.id === selectedStudent) || students[0];

  const scholasticMarks = [
    { subject: 'ENGLISH', ut: 18, halfYearly: 74, total: 92, grade: 'A1' },
    { subject: 'HINDI', ut: 17, halfYearly: 71, total: 88, grade: 'A2' },
    { subject: 'MATHEMATICS', ut: 20, halfYearly: 76, total: 96, grade: 'A1' },
    { subject: 'ENVIRONMENTAL STUDIES', ut: 19, halfYearly: 71, total: 90, grade: 'A1' },
    { subject: 'GENERAL KNOWLEDGE', ut: 19, halfYearly: 73, total: 92, grade: 'A1' },
    { subject: 'COMPUTER SCIENCE', ut: 19, halfYearly: 75, total: 94, grade: 'A1' }
  ];

  const coScholastic = [
    { area: 'Work Education / Pre-Vocational', grade: 'A' },
    { area: 'Art Education', grade: 'A' },
    { area: 'Health & Physical Education', grade: 'A' },
    { area: 'Discipline', grade: 'A' }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    setIsGenerated(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1:1 Secondary Top Header Toolbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20 print:hidden">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-bold text-slate-800 pr-3 border-r border-slate-300">
            Progress Report Card
          </h1>
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <button onClick={() => onNavigate?.('/')} className="hover:text-indigo-600 flex items-center">
              <Home className="w-3.5 h-3.5 mr-1" />
            </button>
            <span>•</span>
            <span className="hover:text-indigo-600 cursor-pointer" onClick={() => onNavigate?.('/examination-reports')}>Examination</span>
            <span>•</span>
            <span className="text-slate-800 font-medium">Progress Report Card</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrint}
            className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 text-xs font-semibold flex items-center gap-1.5"
            title="Print Report Card"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print Marksheet</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 max-w-7xl mx-auto w-full space-y-4">
        {/* Filters Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs print:hidden">
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 text-xs items-end">
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
              <label className="block font-bold text-slate-600 mb-1">Student</label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 font-semibold text-indigo-700"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    [{s.rollNo}] {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-600 mb-1">Exam Date</label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-600 mb-1">Reopen Date</label>
              <input
                type="date"
                value={reopenDate}
                onChange={(e) => setReopenDate(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 font-semibold"
              />
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

        {/* Official Progress Report Card */}
        {isGenerated && (
          <div className="bg-white rounded-2xl border-2 border-indigo-900/40 p-8 shadow-sm print:p-0 print:border-none print:shadow-none space-y-6 max-w-4xl mx-auto">
            {/* School Header */}
            <div className="text-center border-b-2 border-indigo-900 pb-4">
              <div className="flex items-center justify-center gap-3">
                <div className="w-14 h-14 rounded-full bg-indigo-50 border-2 border-indigo-800 flex items-center justify-center text-2xl font-bold text-indigo-900">
                  🏫
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold uppercase text-slate-900 tracking-wider">
                    J D International School
                  </h2>
                  <p className="text-xs font-semibold text-slate-600">
                    Affiliated to CBSE, New Delhi | School Code: 2026-JD | Session 2026-2027
                  </p>
                </div>
              </div>
              <div className="mt-3 inline-block px-4 py-1 bg-indigo-900 text-white font-bold text-xs uppercase tracking-widest rounded-md">
                Continuous & Comprehensive Evaluation (CCE) - Progress Report Card
              </div>
            </div>

            {/* Student Profile Info */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 text-xs border border-slate-200 p-4 rounded-xl bg-slate-50/50">
              <div><span className="text-slate-500 font-medium">Student Name:</span> <span className="font-bold text-slate-900">{currentStudent.name}</span></div>
              <div><span className="text-slate-500 font-medium">Scholar No:</span> <span className="font-bold text-slate-800">{currentStudent.scholarNo}</span></div>
              <div><span className="text-slate-500 font-medium">Roll No:</span> <span className="font-bold text-slate-800">{currentStudent.rollNo}</span></div>
              <div><span className="text-slate-500 font-medium">Class & Sec:</span> <span className="font-bold text-slate-800">{selectedClass} - {selectedSection}</span></div>
              <div><span className="text-slate-500 font-medium">Father's Name:</span> <span className="font-bold text-slate-800">{currentStudent.father}</span></div>
              <div><span className="text-slate-500 font-medium">Mother's Name:</span> <span className="font-bold text-slate-800">{currentStudent.mother}</span></div>
              <div><span className="text-slate-500 font-medium">Date of Birth:</span> <span className="font-bold text-slate-800">{currentStudent.dob}</span></div>
              <div><span className="text-slate-500 font-medium">Attendance:</span> <span className="font-bold text-emerald-700">{currentStudent.attendance} Days</span></div>
              <div><span className="text-slate-500 font-medium">Evaluation Term:</span> <span className="font-bold text-indigo-700">{selectedTerm}</span></div>
            </div>

            {/* Part 1: Scholastic Areas */}
            <div>
              <div className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-900"></span>
                <span>Part 1: Scholastic Areas</span>
              </div>
              <div className="overflow-x-auto border border-slate-300 rounded-lg">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300 font-bold text-slate-800">
                      <th className="py-2 px-3 border-r border-slate-300">Subject Name</th>
                      <th className="py-2 px-3 border-r border-slate-300 text-center w-28">Unit Test (20)</th>
                      <th className="py-2 px-3 border-r border-slate-300 text-center w-32">Half Yearly (80)</th>
                      <th className="py-2 px-3 border-r border-slate-300 text-center w-32 font-extrabold">Total (100)</th>
                      <th className="py-2 px-3 text-center w-24">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium">
                    {scholasticMarks.map((m, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-2 px-3 border-r border-slate-300 font-bold text-slate-900">{m.subject}</td>
                        <td className="py-2 px-3 border-r border-slate-300 text-center">{m.ut}</td>
                        <td className="py-2 px-3 border-r border-slate-300 text-center">{m.halfYearly}</td>
                        <td className="py-2 px-3 border-r border-slate-300 text-center font-bold text-indigo-700">{m.total}</td>
                        <td className="py-2 px-3 text-center font-bold">{m.grade}</td>
                      </tr>
                    ))}
                    <tr className="bg-indigo-50/50 font-bold border-t-2 border-indigo-200">
                      <td className="py-2.5 px-3 border-r border-slate-300">Grand Total</td>
                      <td colSpan="2" className="py-2.5 px-3 border-r border-slate-300 text-right pr-4">Out of 600</td>
                      <td className="py-2.5 px-3 border-r border-slate-300 text-center text-indigo-900 font-extrabold text-sm">
                        552 (92.0%)
                      </td>
                      <td className="py-2.5 px-3 text-center text-emerald-700 font-extrabold">A1</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Part 2: Co-Scholastic & Discipline */}
            <div>
              <div className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-900"></span>
                <span>Part 2: Co-Scholastic Activities & Discipline (3-Point Grading Scale)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs border border-slate-300 rounded-lg p-3">
                {coScholastic.map((c, i) => (
                  <div key={i} className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-200">
                    <span className="font-semibold text-slate-700">{c.area}</span>
                    <span className="font-extrabold text-indigo-700 px-2 py-0.5 bg-indigo-100 rounded text-xs">{c.grade}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Remarks & Result */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
              <div className="flex gap-2">
                <span className="font-bold text-slate-800">Class Teacher's Remarks:</span>
                <span className="text-slate-700 font-medium">
                  Well behaved, obedient and shows keen interest in studies. Outstanding performance!
                </span>
              </div>
              <div className="flex gap-4 font-bold text-xs pt-1 border-t border-slate-200">
                <div>Result: <span className="text-emerald-700">PASSED & PROMOTED</span></div>
                <div>School Reopens On: <span className="text-indigo-700">{reopenDate}</span></div>
              </div>
            </div>

            {/* Bottom Signatures */}
            <div className="pt-8 flex justify-between items-center text-xs font-bold text-slate-800">
              <div className="text-center">
                <div className="w-36 border-b border-slate-800 mb-1"></div>
                <span>Class Teacher</span>
              </div>
              <div className="text-center">
                <div className="w-36 border-b border-slate-800 mb-1"></div>
                <span>Parent / Guardian</span>
              </div>
              <div className="text-center">
                <div className="w-36 border-b border-slate-800 mb-1"></div>
                <span>Principal</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
