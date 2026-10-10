import React, { useState } from 'react';
import { ReportHeader } from './ReportHeader';
import { MOCK_STUDENTS } from './studentReportsData';

export function MonthlyAttendanceReportPage({ onNavigate }) {
  const [type, setType] = useState('Without Time');
  const [reportType, setReportType] = useState('All');
  const [month, setMonth] = useState('October 2026');

  // Days 1 to 10 mock calendar
  const days = Array.from({ length: 15 }, (_, i) => i + 1);

  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['S.NO.,ADM.NO.,SR.NO.,NAME,FATHER\'S NAME,PRESENT DAYS,ABSENT DAYS']
        .concat(
          MOCK_STUDENTS.map(
            (r, i) =>
              `${i + 1},"${r.admNo}","${r.srNo}","${r.name}","${r.fatherName}",${r.presentDays},${r.absentDays}`
          )
        )
        .join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encoded;
    link.download = 'monthly_attendance_report.csv';
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <ReportHeader
        title="Monthly Attendance Report"
        onNavigate={onNavigate}
        onPrint={() => window.print()}
        onExport={handleExport}
      />

      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Select type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Without Time">Without Time</option>
                <option value="With Time">With Time</option>
              </select>
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
                <option value="All">All</option>
                <option value="Class Wise">Class Wise</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Month
              </label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="October 2026">October 2026</option>
                <option value="September 2026">September 2026</option>
                <option value="August 2026">August 2026</option>
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

        {/* Calendar Grid Table */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">S.NO.</th>
                  <th className="py-3 px-3">ADM.NO.</th>
                  <th className="py-3 px-3">NAME</th>
                  <th className="py-3 px-3">CLASS</th>
                  {days.map(d => (
                    <th key={d} className="py-3 px-1.5 text-center w-6 text-[11px] text-slate-600">{d}</th>
                  ))}
                  <th className="py-3 px-3 text-center text-emerald-600">P</th>
                  <th className="py-3 px-3 text-center text-rose-600">A</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {MOCK_STUDENTS.map((r, i) => (
                  <tr key={r.sNo} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 text-slate-500">{i + 1}</td>
                    <td className="py-2.5 px-3 font-semibold text-indigo-600">{r.admNo}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-900 whitespace-nowrap">{r.name}</td>
                    <td className="py-2.5 px-3 whitespace-nowrap">{r.className} - {r.section}</td>
                    {days.map(d => {
                      const isAbsent = d === 5 || d === 8;
                      return (
                        <td key={d} className="py-2.5 px-1.5 text-center">
                          <span className={`inline-block w-4 h-4 rounded-full text-[9px] font-bold leading-4 ${
                            isAbsent ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {isAbsent ? 'A' : 'P'}
                          </span>
                        </td>
                      );
                    })}
                    <td className="py-2.5 px-3 text-center font-bold text-emerald-600">{r.presentDays}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-rose-500">{r.absentDays}</td>
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
