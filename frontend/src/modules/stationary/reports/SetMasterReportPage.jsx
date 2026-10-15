import React, { useState, useEffect } from 'react';
import {
  Layers,
  Search,
  Home,
  Printer,
  FileDown,
  Eye,
  X
} from 'lucide-react';

const INITIAL_SETS = [
  {
    id: '1',
    setCode: 'SET-CLS1',
    className: 'Class I',
    categoryName: 'Books & Note Books',
    setName: 'Class I Complete Academic Kit',
    noOfItems: 4,
    totalCost: 1250,
    items: [
      { itemName: 'English & Math Textbooks Bundle', qty: 1, rate: 850 },
      { itemName: 'School Diary 2026-27', qty: 1, rate: 150 },
      { itemName: '4-Line English Notebook (172 Pgs)', qty: 4, rate: 45 },
      { itemName: '2-Line Hindi Notebook (172 Pgs)', qty: 3, rate: 45 }
    ]
  },
  {
    id: '2',
    setCode: 'SET-CLS5',
    className: 'Class V',
    categoryName: 'Books & Note Books',
    setName: 'Class V Complete Book & Stationery Set',
    noOfItems: 4,
    totalCost: 1850,
    items: [
      { itemName: 'Class V NCERT & Reference Bundle', qty: 1, rate: 1350 },
      { itemName: 'School Diary 2026-27', qty: 1, rate: 150 },
      { itemName: '4-Line English Notebook (172 Pgs)', qty: 4, rate: 45 },
      { itemName: 'Practical File / Register', qty: 2, rate: 85 }
    ]
  },
  {
    id: '3',
    setCode: 'SET-UNIFORM-M',
    className: 'Class I - V',
    categoryName: 'Uniform',
    setName: 'Junior Boy Summer Uniform Pack',
    noOfItems: 2,
    totalCost: 1050,
    items: [
      { itemName: 'T Shirt- W (22)', qty: 2, rate: 300 },
      { itemName: 'Pant ( 20 )', qty: 1, rate: 450 }
    ]
  }
];

export function SetMasterReportPage({ onNavigate }) {
  const [sets, setSets] = useState(INITIAL_SETS);
  const [searchQuery, setSearchQuery] = useState('');
  const [reportType, setReportType] = useState('All');
  const [selectedSet, setSelectedSet] = useState(null);

  useEffect(() => {
    fetch('/api/stationary/sets')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.length) setSets(data.data);
      })
      .catch(() => {});
  }, []);

  const filteredSets = sets.filter(s =>
    s.setName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportCSV = () => {
    const headers = ['S.NO.', 'CLASS', 'SET NAME', 'CATEGORIES', 'TOTAL ITEMS', 'TOTAL COST (₹)'];
    const rows = filteredSets.map((s, idx) => [
      idx + 1,
      `"${s.className}"`,
      `"${s.setName}"`,
      `"${s.categoryName}"`,
      s.noOfItems,
      s.totalCost
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Set_Master_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 text-slate-800">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate?.('/dashboard')}
            className="text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1 text-sm font-medium"
          >
            <Home className="w-4 h-4" />
            Home
          </button>
          <span className="text-slate-400">/</span>
          <button
            onClick={() => onNavigate?.('/stationary-reports')}
            className="text-slate-500 hover:text-indigo-600 transition-colors text-sm font-medium"
          >
            Stationary Reports
          </button>
          <span className="text-slate-400">/</span>
          <span className="text-indigo-600 text-sm font-semibold">Set Master Report</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-sm transition-all"
          >
            <FileDown className="w-3.5 h-3.5 text-emerald-600" />
            CSV Export
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-sm transition-all"
          >
            <Printer className="w-3.5 h-3.5 text-blue-600" />
            Print Report
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search set name, class..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-600">Report Type:</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
              >
                <option value="All">All</option>
                <option value="Category">Category</option>
              </select>
            </div>
          </div>

          <span className="text-xs text-slate-500">
            Showing {filteredSets.length} of {sets.length} Sets
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 text-center w-16">S.NO.</th>
                <th className="py-3 px-4">CLASS</th>
                <th className="py-3 px-4">SET NAME</th>
                <th className="py-3 px-4">CATEGORIES</th>
                <th className="py-3 px-4 text-center">TOTAL ITEMS</th>
                <th className="py-3 px-4 text-right">TOTAL COST (₹)</th>
                <th className="py-3 px-4 text-center w-20">VIEW</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSets.length > 0 ? (
                filteredSets.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-center font-medium text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{s.className}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{s.setName}</div>
                      <span className="font-mono text-[11px] text-indigo-600">{s.setCode}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{s.categoryName}</td>
                    <td className="py-3 px-4 text-center font-bold text-slate-700">{s.noOfItems}</td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-700">₹{s.totalCost}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setSelectedSet(s)}
                        className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                        title="View Kit Breakdown"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No set reports found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Set Details Dialog */}
      {selectedSet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 p-6 space-y-4">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-bold text-slate-800 text-sm">{selectedSet.setName}</h4>
                <p className="text-[11px] text-slate-400">Class: {selectedSet.className} • Code: {selectedSet.setCode}</p>
              </div>
              <button onClick={() => setSelectedSet(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="border border-slate-200 rounded overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="p-2 text-left">Item Name</th>
                    <th className="p-2 text-center">Qty</th>
                    <th className="p-2 text-right">Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedSet.items?.map((it, i) => (
                    <tr key={i}>
                      <td className="p-2">{it.itemName}</td>
                      <td className="p-2 text-center font-bold">{it.qty}</td>
                      <td className="p-2 text-right">₹{it.rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between font-bold text-slate-800 pt-2 text-sm">
              <span>Total Price:</span>
              <span className="text-emerald-700">₹{selectedSet.totalCost}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default SetMasterReportPage;
