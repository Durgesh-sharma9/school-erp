import toast from 'react-hot-toast';
import React, { useState } from 'react';
import { ReportHeader } from './ReportHeader';
import { MOCK_TC_RECORDS } from './studentReportsData';
import { Search } from 'lucide-react';

export function TcReportPage({ onNavigate }) {
  const [type, setType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const activeTcRecords = MOCK_TC_RECORDS.filter(r => !r.isCancelled);

  const filtered = activeTcRecords.filter(r =>
    !searchQuery ||
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.admNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.tcNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    toast.success(`Filtered ${filtered.length} record(s)`);
  };

  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['S.NO.,ADM.NO.,SR.NO.,NAME,CLASS,FATHER\'S NAME,TC NO.,ISSUE DATE,REASON']
        .concat(
          filtered.map(
            (r, i) =>
              `${i + 1},"${r.admNo}","${r.srNo}","${r.name}","${r.className}","${r.fatherName}","${r.tcNo}","${r.issueDate}","${r.reason}"`
          )
        )
        .join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encoded;
    link.download = 'tc_report.csv';
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <ReportHeader
        title="TC Report"
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
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="All">All Issued TCs</option>
                <option value="Current Session">Current Session (2026-2027)</option>
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

        {/* Results Table */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 overflow-hidden">
          <div className="p-4 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-medium text-slate-600">
              Total TC Records: <strong className="text-slate-900">{filtered.length}</strong>
            </span>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search TC no or student..."
                className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">S.NO.</th>
                  <th className="py-3 px-4">ADM.NO.</th>
                  <th className="py-3 px-4">SR.NO.</th>
                  <th className="py-3 px-4">NAME</th>
                  <th className="py-3 px-4">CLASS</th>
                  <th className="py-3 px-4">FATHER'S NAME</th>
                  <th className="py-3 px-4">TC NO.</th>
                  <th className="py-3 px-4">ISSUE DATE</th>
                  <th className="py-3 px-4">REASON</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((r, i) => (
                  <tr key={r.tcNo} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-slate-500">{i + 1}</td>
                    <td className="py-3 px-4 font-semibold text-indigo-600">{r.admNo}</td>
                    <td className="py-3 px-4 text-slate-600">{r.srNo}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{r.name}</td>
                    <td className="py-3 px-4">{r.className}</td>
                    <td className="py-3 px-4">{r.fatherName}</td>
                    <td className="py-3 px-4 font-mono font-bold text-amber-700">{r.tcNo}</td>
                    <td className="py-3 px-4 text-slate-600">{r.issueDate}</td>
                    <td className="py-3 px-4 text-slate-600 italic">{r.reason}</td>
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
