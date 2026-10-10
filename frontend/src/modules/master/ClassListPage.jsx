import React, { useState, useEffect } from 'react';
import {
  Home,
  FileSpreadsheet,
  Printer,
  FileDown,
  Search
} from 'lucide-react';

export function ClassListPage() {
  const [classList, setClassList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // 1:1 Class List Data from UAB
  const defaultClasses = [
    { sNo: 1, name: 'Nursery - PP3+', sections: 'A 26', total: 26, secA: 26 },
    { sNo: 2, name: 'Lower Kindergarten - PP4+', sections: 'A 49', total: 49, secA: 49 },
    { sNo: 3, name: 'Upper Kindergarten - PP5+', sections: 'A 71', total: 71, secA: 71 },
    { sNo: 4, name: 'I', sections: 'A 82', total: 82, secA: 82 },
    { sNo: 5, name: 'II', sections: 'A 72', total: 72, secA: 72 },
    { sNo: 6, name: 'III', sections: 'A 65', total: 65, secA: 65 },
    { sNo: 7, name: 'IV', sections: 'A 78', total: 78, secA: 78 },
    { sNo: 8, name: 'V', sections: 'A 80', total: 80, secA: 80 },
    { sNo: 9, name: 'VI', sections: 'A 85', total: 85, secA: 85 },
    { sNo: 10, name: 'VII', sections: 'A 90', total: 90, secA: 90 },
    { sNo: 11, name: 'VIII', sections: 'A 88', total: 88, secA: 88 },
    { sNo: 12, name: 'IX', sections: 'A 92', total: 92, secA: 92 },
    { sNo: 13, name: 'X', sections: 'A 95', total: 95, secA: 95 },
    { sNo: 14, name: 'XI- HUMANITIES', sections: 'A 35', total: 35, secA: 35 },
    { sNo: 15, name: 'XII-HUMANITIES', sections: 'A 32', total: 32, secA: 32 },
    { sNo: 16, name: 'XI-MEDICAL', sections: 'A 28', total: 28, secA: 28 },
    { sNo: 17, name: 'XII-MEDICAL', sections: 'A 25', total: 25, secA: 25 },
    { sNo: 18, name: 'XI-NON-MEDICAL', sections: 'A 30', total: 30, secA: 30 },
    { sNo: 19, name: 'XII-NON-MEDICAL', sections: 'A 28', total: 28, secA: 28 }
  ];

  useEffect(() => {
    setClassList(defaultClasses);
  }, []);

  const totalStudents = classList.reduce((acc, c) => acc + c.total, 0);

  const filtered = classList.filter((c) =>
    searchQuery ? c.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
  );

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['S.NO.,CLASS,SECTIONS,TOTAL,A']
        .concat(filtered.map((r) => `${r.sNo},"${r.name}","${r.sections}",${r.total},${r.secA}`))
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'class_list_report.csv');
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
            Class List
          </h1>
          <Home className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">&bull;</span>
          <span className="text-slate-500 hover:text-indigo-600 cursor-pointer">Master</span>
          <span className="text-slate-400">&bull;</span>
          <span className="text-slate-500 hover:text-indigo-600 cursor-pointer">Reports</span>
          <span className="text-slate-400">&bull;</span>
          <span className="text-indigo-600 font-semibold">Class List</span>
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
                  <th className="py-3 px-4">CLASS</th>
                  <th className="py-3 px-4">SECTIONS</th>
                  <th className="py-3 px-4">TOTAL</th>
                  <th className="py-3 px-4">A</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filtered.map((c, idx) => (
                  <tr key={c.sNo} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono">{idx + 1}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{c.name}</td>
                    <td className="py-3 px-4 font-mono">{c.sections}</td>
                    <td className="py-3 px-4 font-bold text-indigo-700 font-mono">{c.total}</td>
                    <td className="py-3 px-4 font-mono">{c.secA}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 font-bold text-slate-800 border-t border-slate-300">
                  <td colSpan={3} className="py-3 px-4 text-right uppercase tracking-wider text-[11px]">
                    Total Students:
                  </td>
                  <td className="py-3 px-4 font-mono text-indigo-700 font-bold text-sm">
                    {totalStudents}
                  </td>
                  <td className="py-3 px-4 font-mono text-sm">{totalStudents}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClassListPage;
