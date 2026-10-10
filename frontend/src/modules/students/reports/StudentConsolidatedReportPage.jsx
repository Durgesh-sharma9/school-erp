import React, { useState } from 'react';
import { ReportHeader } from './ReportHeader';
import { SCHOOL_CLASSES } from './studentReportsData';

export function StudentConsolidatedReportPage({ onNavigate }) {
  const [type, setType] = useState('All');

  const consolidatedRows = [
    { sNo: 1, className: 'Nursery - PP3+', boys: 14, girls: 12, gen: 16, obc: 6, sc: 2, st: 2, total: 26 },
    { sNo: 2, className: 'Lower Kindergarten - PP4+', boys: 27, girls: 22, gen: 30, obc: 12, sc: 4, st: 3, total: 49 },
    { sNo: 3, className: 'Upper Kindergarten - PP5+', boys: 38, girls: 33, gen: 42, obc: 18, sc: 6, st: 5, total: 71 },
    { sNo: 4, className: 'I', boys: 44, girls: 38, gen: 48, obc: 20, sc: 8, st: 6, total: 82 },
    { sNo: 5, className: 'II', boys: 39, girls: 33, gen: 41, obc: 19, sc: 7, st: 5, total: 72 },
    { sNo: 6, className: 'III', boys: 35, girls: 30, gen: 38, obc: 16, sc: 6, st: 5, total: 65 },
    { sNo: 7, className: 'X', boys: 51, girls: 44, gen: 55, obc: 24, sc: 9, st: 7, total: 95 },
    { sNo: 8, className: 'XII-NON-MEDICAL', boys: 16, girls: 12, gen: 18, obc: 6, sc: 2, st: 2, total: 28 }
  ];

  const totalBoys = consolidatedRows.reduce((a, b) => a + b.boys, 0);
  const totalGirls = consolidatedRows.reduce((a, b) => a + b.girls, 0);
  const totalGen = consolidatedRows.reduce((a, b) => a + b.gen, 0);
  const totalObc = consolidatedRows.reduce((a, b) => a + b.obc, 0);
  const totalSc = consolidatedRows.reduce((a, b) => a + b.sc, 0);
  const totalSt = consolidatedRows.reduce((a, b) => a + b.st, 0);
  const grandTotal = consolidatedRows.reduce((a, b) => a + b.total, 0);

  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['S.NO.,CLASS,BOYS,GIRLS,GEN,OBC,SC,ST,TOTAL STUDENTS']
        .concat(
          consolidatedRows.map(
            (r, i) =>
              `${i + 1},"${r.className}",${r.boys},${r.girls},${r.gen},${r.obc},${r.sc},${r.st},${r.total}`
          )
        )
        .join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encoded;
    link.download = 'student_consolidated_report.csv';
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <ReportHeader
        title="Student Consolidated Report"
        subtitle="Students > Reports"
        onNavigate={onNavigate}
        onPrint={() => window.print()}
        onExport={handleExport}
      />

      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Students</span>
            <p className="text-2xl font-bold text-slate-900 mt-1">{grandTotal}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-blue-600 uppercase">Total Boys</span>
            <p className="text-2xl font-bold text-blue-600 mt-1">{totalBoys}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-pink-600 uppercase">Total Girls</span>
            <p className="text-2xl font-bold text-pink-600 mt-1">{totalGirls}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-indigo-600 uppercase">Girl Ratio</span>
            <p className="text-2xl font-bold text-indigo-600 mt-1">
              {((totalGirls / grandTotal) * 100).toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="All">All Categories & Gender</option>
                <option value="Category Only">Category Wise Only</option>
                <option value="Gender Only">Gender Wise Only</option>
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

        {/* Consolidated Table */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">S.NO.</th>
                  <th className="py-3 px-4">CLASS</th>
                  <th className="py-3 px-4 text-center">BOYS</th>
                  <th className="py-3 px-4 text-center">GIRLS</th>
                  <th className="py-3 px-4 text-center">GEN</th>
                  <th className="py-3 px-4 text-center">OBC</th>
                  <th className="py-3 px-4 text-center">SC</th>
                  <th className="py-3 px-4 text-center">ST</th>
                  <th className="py-3 px-4 text-center">TOTAL STUDENTS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {consolidatedRows.map((r, i) => (
                  <tr key={r.sNo} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-slate-500">{i + 1}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{r.className}</td>
                    <td className="py-3 px-4 text-center text-blue-600 font-medium">{r.boys}</td>
                    <td className="py-3 px-4 text-center text-pink-600 font-medium">{r.girls}</td>
                    <td className="py-3 px-4 text-center">{r.gen}</td>
                    <td className="py-3 px-4 text-center">{r.obc}</td>
                    <td className="py-3 px-4 text-center">{r.sc}</td>
                    <td className="py-3 px-4 text-center">{r.st}</td>
                    <td className="py-3 px-4 text-center font-bold text-slate-900">{r.total}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
                <tr>
                  <td colSpan="2" className="py-3 px-4 text-left">TOTAL:</td>
                  <td className="py-3 px-4 text-center text-blue-700">{totalBoys}</td>
                  <td className="py-3 px-4 text-center text-pink-700">{totalGirls}</td>
                  <td className="py-3 px-4 text-center">{totalGen}</td>
                  <td className="py-3 px-4 text-center">{totalObc}</td>
                  <td className="py-3 px-4 text-center">{totalSc}</td>
                  <td className="py-3 px-4 text-center">{totalSt}</td>
                  <td className="py-3 px-4 text-center text-indigo-700 text-sm">{grandTotal}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
