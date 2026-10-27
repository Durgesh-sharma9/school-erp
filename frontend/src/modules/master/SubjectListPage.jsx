import React, { useState, useEffect } from 'react';
import {
  Home,
  FileSpreadsheet,
  Printer,
  FileDown,
  Search
} from 'lucide-react';

export function SubjectListPage() {
  const [subjects, setSubjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch from backend
  const fetchSubjects = async () => {
    try {
      const res = await fetch('/api/academics/subjects');
      const data = await res.json();
      if (data.success && data.data) {
        setSubjects(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const filtered = subjects.filter((s) =>
    searchQuery
      ? s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.shortName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.group?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.code?.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['S.NO.,GROUP,CODE,NAME,SHORT NAME']
        .concat(filtered.map((s, idx) => `${idx + 1},"${s.group}","${s.code || ''}","${s.name}","${s.shortName || ''}"`))
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'subject_list_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#f3f4f6] min-h-screen">
      {/* 1:1 Secondary Toolbar Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs">
          <h1 className="text-xl font-bold text-slate-800 pr-3 border-r border-slate-300">
            Subject List
          </h1>
          <Home className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">&bull;</span>
          <span className="text-slate-500 hover:text-indigo-600 cursor-pointer">Master</span>
          <span className="text-slate-400">&bull;</span>
          <span className="text-slate-500 hover:text-indigo-600 cursor-pointer">Reports</span>
          <span className="text-slate-400">&bull;</span>
          <span className="text-indigo-600 font-semibold">Subject List</span>
        </div>

        {/* Action Buttons: Excel, Print, PDF */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleExportExcel}
            title="Excel"
            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-emerald-200"
          >
            <FileSpreadsheet className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handlePrint}
            title="Print"
            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-rose-200"
          >
            <Printer className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handlePrint}
            title="Download Pdf"
            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-rose-200"
          >
            <FileDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="p-6">
        <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
          {/* Search bar */}
          <div className="p-4 border-b border-slate-200 bg-white">
            <div className="relative max-w-sm">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs rounded-full border border-slate-200 pl-9 pr-4 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-700 font-bold text-[11px] uppercase">
                  <th className="py-3 px-4 w-16">S.NO.</th>
                  <th className="py-3 px-4">GROUP</th>
                  <th className="py-3 px-4">CODE</th>
                  <th className="py-3 px-4">NAME</th>
                  <th className="py-3 px-4">SHORT NAME</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filtered.map((s, idx) => (
                  <tr key={s.id || idx} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-4 font-mono">{idx + 1}</td>
                    <td className="py-2.5 px-4 font-semibold text-indigo-900">{s.group}</td>
                    <td className="py-2.5 px-4 font-mono text-slate-500">{s.code || '--'}</td>
                    <td className="py-2.5 px-4 font-bold text-slate-900">{s.name}</td>
                    <td className="py-2.5 px-4 text-slate-600">{s.shortName || '--'}</td>
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

export default SubjectListPage;
