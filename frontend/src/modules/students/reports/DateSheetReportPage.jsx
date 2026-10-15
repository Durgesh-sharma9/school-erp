import toast from 'react-hot-toast';
import React, { useState } from 'react';
import { ReportHeader } from './ReportHeader';
import { SCHOOL_CLASSES, MOCK_DATE_SHEET_ROWS } from './studentReportsData';

export function DateSheetReportPage({ onNavigate }) {
  const [type, setType] = useState('Class Wise');
  const [selectedClass, setSelectedClass] = useState('X');
  const [term, setTerm] = useState('Term 1');
  const [exam, setExam] = useState('Mid Term Exam 2026');
  const [nameType, setNameType] = useState('Short Name');

  const rows = MOCK_DATE_SHEET_ROWS;

  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['S.NO.,DATE,DAY,TIME,SUBJECT,ROOM NO.']
        .concat(
          rows.map(
            (r, i) =>
              `${i + 1},"${r.date}","${r.day}","${r.time}","${r.subject}","${r.roomNo}"`
          )
        )
        .join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encoded;
    link.download = 'date_sheet_report.csv';
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <ReportHeader
        title="Date Sheet Report"
        onNavigate={onNavigate}
        onPrint={() => window.print()}
        onExport={handleExport}
      />

      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Class Wise">Class Wise</option>
                <option value="General">General</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Class
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                {SCHOOL_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Term
              </label>
              <select
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Term 1">Term 1</option>
                <option value="Term 2">Term 2</option>
                <option value="Final">Annual Exam</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Exam
              </label>
              <select
                value={exam}
                onChange={(e) => setExam(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Mid Term Exam 2026">Mid Term Exam 2026</option>
                <option value="Unit Test 1">Unit Test 1</option>
                <option value="Pre-Board Exam">Pre-Board Exam</option>
              </select>
            </div>

            <div>
              <button
                className="w-full bg-[#5c67f6] hover:bg-indigo-600 text-white text-xs font-semibold py-2.5 px-4 rounded-lg shadow-xs transition-colors"
               onClick={handleSearch} type="button">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Date Sheet Schedule Card */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 overflow-hidden">
          <div className="p-4 border-b border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="text-sm font-bold text-slate-900">
                Class: {selectedClass} • {exam} ({term})
              </span>
              <p className="text-xs text-slate-500 mt-0.5">Session 2026-2027 Schedule</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">S.NO.</th>
                  <th className="py-3 px-4">DATE</th>
                  <th className="py-3 px-4">DAY</th>
                  <th className="py-3 px-4">TIME</th>
                  <th className="py-3 px-4">SUBJECT</th>
                  <th className="py-3 px-4">ROOM NO.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {rows.map((r, i) => (
                  <tr key={r.sNo} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-slate-500">{i + 1}</td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-900">{r.date}</td>
                    <td className="py-3 px-4 text-slate-600">{r.day}</td>
                    <td className="py-3 px-4 text-slate-700 font-medium">{r.time}</td>
                    <td className="py-3 px-4 font-semibold text-indigo-600">{r.subject}</td>
                    <td className="py-3 px-4 text-slate-600">{r.roomNo}</td>
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
