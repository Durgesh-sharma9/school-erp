import React, { useState } from 'react';
import { ReportHeader } from './ReportHeader';
import { MOCK_DAY_ATTENDANCE_SUMMARY } from './studentReportsData';

export function DayWiseAttendanceSummaryPage({ onNavigate }) {
  const [fromDate, setFromDate] = useState('2026-10-01');
  const [toDate, setToDate] = useState('2026-10-10');
  const [reportType, setReportType] = useState('All');

  const rows = MOCK_DAY_ATTENDANCE_SUMMARY;
  const totalStudents = rows.reduce((a, b) => a + b.total, 0);
  const totalPresent = rows.reduce((a, b) => a + b.present, 0);
  const totalAbsent = rows.reduce((a, b) => a + b.absent, 0);

  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['S.NO.,ATTENDANCE DATE,CLASS,SECTION,TOTAL STUDENT,TOTAL PRESENT,TOTAL ABSENT']
        .concat(
          rows.map(
            (r, i) =>
              `${i + 1},"${r.date}","${r.className}","${r.section}",${r.total},${r.present},${r.absent}`
          )
        )
        .join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encoded;
    link.download = 'day_wise_attendance_summary.csv';
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <ReportHeader
        title="Day Wise Attendance Summary"
        onNavigate={onNavigate}
        onPrint={() => window.print()}
        onExport={handleExport}
      />

      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Select date range
              </label>
              <div className="flex items-center space-x-1">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-slate-400">–</span>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Report Type
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="All">All Classes Summary</option>
                <option value="Detailed">Detailed Summary</option>
              </select>
            </div>

            <div>
              <button
                className="w-full bg-[#5c67f6] hover:bg-indigo-600 text-white text-xs font-semibold py-2.5 px-4 rounded-lg shadow-xs transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">S.NO.</th>
                  <th className="py-3 px-4">ATTENDANCE DATE</th>
                  <th className="py-3 px-4">CLASS</th>
                  <th className="py-3 px-4">SECTION</th>
                  <th className="py-3 px-4 text-center">TOTAL STUDENT</th>
                  <th className="py-3 px-4 text-center">TOTAL PRESENT</th>
                  <th className="py-3 px-4 text-center">TOTAL ABSENT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {rows.map((r, i) => (
                  <tr key={r.sNo} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-slate-500">{i + 1}</td>
                    <td className="py-3 px-4 font-mono text-slate-900">{r.date}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{r.className}</td>
                    <td className="py-3 px-4 text-slate-600">{r.section}</td>
                    <td className="py-3 px-4 text-center font-bold text-slate-800">{r.total}</td>
                    <td className="py-3 px-4 text-center font-semibold text-emerald-600">{r.present}</td>
                    <td className="py-3 px-4 text-center font-semibold text-rose-500">{r.absent}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
                <tr>
                  <td colSpan="4" className="py-3 px-4 text-left">TOTAL:</td>
                  <td className="py-3 px-4 text-center">{totalStudents}</td>
                  <td className="py-3 px-4 text-center text-emerald-700">{totalPresent}</td>
                  <td className="py-3 px-4 text-center text-rose-700">{totalAbsent}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
