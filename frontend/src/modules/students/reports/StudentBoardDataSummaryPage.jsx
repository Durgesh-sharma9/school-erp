import React, { useState } from 'react';
import { ReportHeader } from './ReportHeader';
import { SCHOOL_CLASSES } from './studentReportsData';

export function StudentBoardDataSummaryPage({ onNavigate }) {
  const [reportType, setReportType] = useState('All');
  const [selectedClass, setSelectedClass] = useState('All');

  const boardDataRows = [
    { sNo: 1, className: 'X', section: 'A', registered: 95, uploaded: 92, pending: 3, status: 'In-Progress' },
    { sNo: 2, className: 'XII-HUMANITIES', section: 'A', registered: 32, uploaded: 32, pending: 0, status: 'Completed' },
    { sNo: 3, className: 'XII-MEDICAL', section: 'A', registered: 25, uploaded: 25, pending: 0, status: 'Completed' },
    { sNo: 4, className: 'XII-NON-MEDICAL', section: 'A', registered: 28, uploaded: 27, pending: 1, status: 'In-Progress' }
  ];

  const filtered = boardDataRows.filter(r =>
    selectedClass !== 'All' ? r.className === selectedClass : true
  );

  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['S.NO.,CLASS,SECTION,STUDENTS REGISTERED,DATA UPLOADED,PENDING,STATUS']
        .concat(
          filtered.map(
            (r, i) =>
              `${i + 1},"${r.className}","${r.section}",${r.registered},${r.uploaded},${r.pending},"${r.status}"`
          )
        )
        .join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encoded;
    link.download = 'board_data_summary.csv';
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <ReportHeader
        title="Student Upload Data Report"
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

            {reportType === 'Class Wise' && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Class
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="All">All Board Classes</option>
                  <option value="X">X</option>
                  <option value="XII-HUMANITIES">XII-HUMANITIES</option>
                  <option value="XII-MEDICAL">XII-MEDICAL</option>
                  <option value="XII-NON-MEDICAL">XII-NON-MEDICAL</option>
                </select>
              </div>
            )}

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
          <div className="p-4 border-b border-slate-200/80 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">
              Total Board Batches: <strong className="text-slate-900">{filtered.length}</strong>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">S.NO.</th>
                  <th className="py-3 px-4">CLASS</th>
                  <th className="py-3 px-4">SECTION</th>
                  <th className="py-3 px-4 text-center">STUDENTS REGISTERED</th>
                  <th className="py-3 px-4 text-center">DATA UPLOADED</th>
                  <th className="py-3 px-4 text-center">PENDING</th>
                  <th className="py-3 px-4 text-center">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((r, i) => (
                  <tr key={r.sNo} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-slate-500">{i + 1}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{r.className}</td>
                    <td className="py-3 px-4 text-slate-600">{r.section}</td>
                    <td className="py-3 px-4 text-center font-bold text-slate-800">{r.registered}</td>
                    <td className="py-3 px-4 text-center font-medium text-emerald-600">{r.uploaded}</td>
                    <td className="py-3 px-4 text-center font-medium text-rose-500">{r.pending}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        r.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {r.status}
                      </span>
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
