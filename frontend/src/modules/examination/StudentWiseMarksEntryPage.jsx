import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Save,
  CheckCircle2,
  Home,
  User,
  Award,
  Search,
  Check
} from 'lucide-react';

export function StudentWiseMarksEntryPage({ onNavigate }) {
  const [selectedClass, setSelectedClass] = useState('I');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedTerm, setSelectedTerm] = useState('Half Yearly Examination');
  const [selectedStudent, setSelectedStudent] = useState('1');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const studentsList = [
    { id: '1', rollNo: '01', scholarNo: 'JD-101', name: 'Aarav Sharma' },
    { id: '2', rollNo: '02', scholarNo: 'JD-102', name: 'Ananya Gupta' },
    { id: '3', rollNo: '03', scholarNo: 'JD-103', name: 'Chirag Sethi' },
    { id: '4', rollNo: '04', scholarNo: 'JD-104', name: 'Diya Choudhary' },
    { id: '5', rollNo: '05', scholarNo: 'JD-105', name: 'Kabir Verma' }
  ];

  const [subjectsMarks, setSubjectsMarks] = useState([
    { id: 'sub-1', name: 'MATHEMATICS', maxMarks: 100, obtained: 88, grade: 'A2' },
    { id: 'sub-2', name: 'ENGLISH', maxMarks: 100, obtained: 92, grade: 'A1' },
    { id: 'sub-3', name: 'HINDI', maxMarks: 100, obtained: 85, grade: 'A2' },
    { id: 'sub-4', name: 'EVS', maxMarks: 100, obtained: 95, grade: 'A1' },
    { id: 'sub-5', name: 'COMPUTER SCIENCE', maxMarks: 50, obtained: 46, grade: 'A1' },
    { id: 'sub-6', name: 'GENERAL KNOWLEDGE', maxMarks: 50, obtained: 42, grade: 'A2' }
  ]);

  const handleMarkChange = (id, val) => {
    const num = Math.max(0, Number(val) || 0);
    setSubjectsMarks(prev => prev.map(s => {
      if (s.id === id) {
        const capped = Math.min(s.maxMarks, num);
        const pct = (capped / s.maxMarks) * 100;
        let grade = 'C';
        if (pct >= 91) grade = 'A1';
        else if (pct >= 81) grade = 'A2';
        else if (pct >= 71) grade = 'B1';
        else if (pct >= 61) grade = 'B2';
        else if (pct >= 51) grade = 'C1';
        else if (pct >= 41) grade = 'C2';
        else if (pct >= 33) grade = 'D';
        else grade = 'E';
        return { ...s, obtained: capped, grade };
      }
      return s;
    }));
  };

  const totalMax = subjectsMarks.reduce((acc, s) => acc + s.maxMarks, 0);
  const totalObtained = subjectsMarks.reduce((acc, s) => acc + s.obtained, 0);
  const overallPercentage = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(1) : '0';

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1:1 Secondary Top Header Toolbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-bold text-slate-800 pr-3 border-r border-slate-300">
            Student Wise Marks Entry
          </h1>
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <button onClick={() => onNavigate?.('/')} className="hover:text-indigo-600 flex items-center">
              <Home className="w-3.5 h-3.5 mr-1" />
            </button>
            <span>•</span>
            <span className="hover:text-indigo-600 cursor-pointer" onClick={() => onNavigate?.('/student-wise-marks-entry')}>Examination</span>
            <span>•</span>
            <span className="text-slate-800 font-medium">Student Wise Marks Entry</span>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-transform"
        >
          <Save className="w-4 h-4" />
          <span>Save Student Marks</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="p-6 max-w-7xl mx-auto w-full space-y-4">
        {savedSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center space-x-3 text-xs shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>Marks saved successfully for selected student!</div>
          </div>
        )}

        {/* Filters Grid */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-600 mb-1">Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-semibold"
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
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-semibold"
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
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-semibold"
              >
                <option value="Half Yearly Examination">Half Yearly Examination</option>
                <option value="Annual Examination">Annual Examination</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-600 mb-1">Student</label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-semibold text-indigo-700"
              >
                {studentsList.map(s => (
                  <option key={s.id} value={s.id}>
                    [{s.rollNo}] {s.name} ({s.scholarNo})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Marks Entry Spreadsheet */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                {studentsList.find(s => s.id === selectedStudent)?.rollNo}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  {studentsList.find(s => s.id === selectedStudent)?.name}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Scholar No: {studentsList.find(s => s.id === selectedStudent)?.scholarNo} | Class: {selectedClass}-{selectedSection}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-xs font-semibold">
              <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                <span className="text-slate-500">Total Marks:</span>{' '}
                <span className="font-bold text-slate-800">{totalObtained} / {totalMax}</span>
              </div>
              <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                <span className="text-slate-500">Percentage:</span>{' '}
                <span className="font-bold text-emerald-600">{overallPercentage}%</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4 w-16 text-center">S.No.</th>
                  <th className="py-3 px-4">Subject Name</th>
                  <th className="py-3 px-4 w-32 text-center">Max Marks</th>
                  <th className="py-3 px-4 w-40 text-center">Marks Obtained</th>
                  <th className="py-3 px-4 w-28 text-center">Grade</th>
                  <th className="py-3 px-4 w-28 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {subjectsMarks.map((sub, idx) => (
                  <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-center text-slate-500 font-bold">{idx + 1}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{sub.name}</td>
                    <td className="py-3 px-4 text-center font-semibold text-slate-600">{sub.maxMarks}</td>
                    <td className="py-3 px-4 text-center">
                      <input
                        type="number"
                        min="0"
                        max={sub.maxMarks}
                        value={sub.obtained}
                        onChange={(e) => handleMarkChange(sub.id, e.target.value)}
                        className="w-24 text-center py-1.5 px-2 border border-slate-300 rounded-lg bg-white font-bold text-indigo-700 focus:outline-hidden focus:border-indigo-600 text-sm"
                      />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {sub.grade}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {sub.obtained >= (sub.maxMarks * 0.33) ? (
                        <span className="text-emerald-600 font-bold">Pass</span>
                      ) : (
                        <span className="text-red-500 font-bold">Needs Imp.</span>
                      )}
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
