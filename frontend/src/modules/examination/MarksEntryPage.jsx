import React, { useState } from 'react';
import { tenantStore } from '../../services/tenantStore';
import {
  FileSpreadsheet,
  Save,
  CheckCircle2,
  Filter,
  Check,
  Award,
  FileText,
  Lock,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

export function MarksEntryPage({ onNavigate }) {
  const [examName, setExamName] = useState('Half Yearly Examination');
  const [selectedClass, setSelectedClass] = useState('Class 10');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [maxMarks, setMaxMarks] = useState(80);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [marksData, setMarksData] = useState([
    { id: '1', rollNo: '01', admNo: 'JD-2026-101', name: 'Aarav Sharma', obtained: 74, grade: 'A1' },
    { id: '2', rollNo: '02', admNo: 'JD-2026-102', name: 'Ananya Gupta', obtained: 78, grade: 'A1' },
    { id: '3', rollNo: '03', admNo: 'JD-2026-103', name: 'Chirag Sethi', obtained: 62, grade: 'B1' },
    { id: '4', rollNo: '04', admNo: 'JD-2026-104', name: 'Diya Choudhary', obtained: 80, grade: 'A1' },
    { id: '5', rollNo: '05', admNo: 'JD-2026-105', name: 'Kabir Verma', obtained: 68, grade: 'B1' },
    { id: '6', rollNo: '06', admNo: 'JD-2026-106', name: 'Mehul Soni', obtained: 55, grade: 'C1' },
  ]);

  const handleMarkChange = (id, val) => {
    const num = Math.min(maxMarks, Math.max(0, Number(val) || 0));
    setMarksData(prev => prev.map(m => {
      if (m.id === id) {
        let grade = 'C';
        const pct = (num / maxMarks) * 100;
        if (pct >= 90) grade = 'A1';
        else if (pct >= 80) grade = 'A2';
        else if (pct >= 70) grade = 'B1';
        else if (pct >= 60) grade = 'B2';
        else if (pct >= 50) grade = 'C1';
        return { ...m, obtained: num, grade };
      }
      return m;
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    toast.success('Marks saved successfully!');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Examination Portal
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <span>Marks Entry & Evaluation Sheet</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              CBSE Grading
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate?.('/progress-report-card')}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Report Cards</span>
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Marks</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex flex-wrap items-center justify-between gap-3 text-sm shadow-xs">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              Marks for <span className="font-bold">{selectedClass} - {selectedSubject}</span> saved successfully!
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                tenantStore.setPendingReportCardClass({
                  className: selectedClass,
                  examName: examName
                });
                onNavigate?.('/progress-report-card');
              }}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Generate Progress Report Cards</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate?.('/marks-entry-locking')}
              className="px-3 py-1.5 rounded-lg bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock Marks</span>
            </button>
            <button
              type="button"
              onClick={() => setSavedSuccess(false)}
              className="p-1 rounded-lg text-emerald-600 hover:text-emerald-900 hover:bg-emerald-100 transition-colors cursor-pointer"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Filter Selection Grid */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center gap-4 text-xs">
        <div>
          <label className="block text-[11px] font-bold text-slate-500 mb-1">Exam Name</label>
          <select
            value={examName}
            onChange={(e) => setExamName(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 bg-slate-50 font-semibold"
          >
            <option value="Unit Test 1">Unit Test 1</option>
            <option value="Half Yearly Examination">Half Yearly Examination</option>
            <option value="Annual Examination">Annual Examination</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 mb-1">Class</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 bg-slate-50 font-semibold"
          >
            <option value="Class 10">Class 10</option>
            <option value="Class 9">Class 9</option>
            <option value="Class 8">Class 8</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 mb-1">Subject</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 bg-slate-50 font-semibold"
          >
            <option value="Mathematics">Mathematics</option>
            <option value="Science">Science</option>
            <option value="English">English</option>
            <option value="Social Studies">Social Studies</option>
            <option value="Hindi">Hindi</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 mb-1">Max Marks</label>
          <input
            type="number"
            value={maxMarks}
            onChange={(e) => setMaxMarks(Number(e.target.value))}
            className="w-20 rounded-lg border border-slate-200 px-3 py-1.5 bg-slate-50 font-bold font-mono"
          />
        </div>
      </div>

      {/* Marks Fill Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold text-[10px] bg-slate-50/70">
              <th className="py-3 px-4">Roll No</th>
              <th className="py-3 px-4">Adm No</th>
              <th className="py-3 px-4">Student Name</th>
              <th className="py-3 px-4 text-center">Marks Obtained (Out of {maxMarks})</th>
              <th className="py-3 px-4 text-center">Grade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
            {marksData.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-slate-500">{m.rollNo}</td>
                <td className="py-3 px-4 font-mono font-semibold text-indigo-700">{m.admNo}</td>
                <td className="py-3 px-4 font-bold text-slate-900">{m.name}</td>
                <td className="py-3 px-4 text-center">
                  <input
                    type="number"
                    max={maxMarks}
                    min={0}
                    value={m.obtained}
                    onChange={(e) => handleMarkChange(m.id, e.target.value)}
                    className="w-24 text-center font-bold font-mono text-xs rounded-lg border border-slate-300 py-1.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-100 text-xs">
                    {m.grade}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
