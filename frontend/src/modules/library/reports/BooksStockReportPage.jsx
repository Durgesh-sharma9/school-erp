import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Home,
  Printer,
  FileDown,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Package
} from 'lucide-react';

const INITIAL_STOCK = [
  { id: '1', bookNo: 'BK-1001', title: 'Mathematics Class X Exemplar', category: 'Mathematics', openQty: 30, purchased: 0, issuedQty: 5, damagedQty: 1, availableQty: 24, reOrderLevel: 5 },
  { id: '2', bookNo: 'BK-1002', title: 'Concepts of Physics Part 1', category: 'Physics & Science', openQty: 25, purchased: 0, issuedQty: 4, damagedQty: 1, availableQty: 20, reOrderLevel: 5 },
  { id: '3', bookNo: 'BK-1003', title: 'Godaan (गोदान)', category: 'Literature & Fiction', openQty: 20, purchased: 0, issuedQty: 3, damagedQty: 1, availableQty: 16, reOrderLevel: 4 },
  { id: '4', bookNo: 'BK-1004', title: 'Wings of Fire', category: 'General Knowledge & Biography', openQty: 15, purchased: 0, issuedQty: 3, damagedQty: 0, availableQty: 12, reOrderLevel: 3 },
  { id: '5', bookNo: 'BK-1005', title: 'Python & AI for Secondary Students', category: 'Computer Science & AI', openQty: 35, purchased: 0, issuedQty: 4, damagedQty: 0, availableQty: 31, reOrderLevel: 6 }
];

export function BooksStockReportPage({ onNavigate }) {
  const [stockList, setStockList] = useState(INITIAL_STOCK);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    fetch('/api/library/books')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.length) setStockList(data.data);
      })
      .catch(() => {});
  }, []);

  const categories = ['All', ...new Set(stockList.map(s => s.category))];

  const filtered = stockList.filter(s => {
    const matchesCat = categoryFilter === 'All' || s.category === categoryFilter;
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.bookNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const totalStockUnits = filtered.reduce((sum, s) => sum + (Number(s.openQty) || 0), 0);
  const totalAvailable = filtered.reduce((sum, s) => sum + (Number(s.availableQty) || 0), 0);
  const totalIssued = filtered.reduce((sum, s) => sum + (Number(s.issuedQty) || 0), 0);
  const totalDamaged = filtered.reduce((sum, s) => sum + (Number(s.damagedQty) || 0), 0);

  const exportCSV = () => {
    const headers = ['S.NO.', 'BOOK NO', 'BOOK TITLE', 'CATEGORY', 'OPENING STOCK', 'ISSUED', 'DAMAGED', 'NET AVAILABLE', 'STATUS'];
    const rows = filtered.map((s, idx) => {
      const status = s.availableQty === 0 ? 'Out of Stock' : s.availableQty <= (s.reOrderLevel || 5) ? 'Low Stock' : 'In Stock';
      return [
        idx + 1,
        `"${s.bookNo}"`,
        `"${s.title}"`,
        `"${s.category}"`,
        s.openQty,
        s.issuedQty,
        s.damagedQty,
        s.availableQty,
        `"${status}"`
      ];
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Books_Stock_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 text-slate-800">
      {/* Breadcrumb & Actions */}
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
            onClick={() => onNavigate?.('/library-reports')}
            className="text-slate-500 hover:text-indigo-600 transition-colors text-sm font-medium"
          >
            Library Reports
          </button>
          <span className="text-slate-400">/</span>
          <span className="text-indigo-600 text-sm font-semibold">Books Stock Report</span>
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

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Gross Physical Stock</p>
            <h4 className="text-xl font-bold text-slate-800 mt-1">{totalStockUnits} Copies</h4>
            <span className="text-[11px] text-slate-400">Total in inventory</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Net On-Shelf Available</p>
            <h4 className="text-xl font-bold text-emerald-600 mt-1">{totalAvailable} Copies</h4>
            <span className="text-[11px] text-emerald-600 font-medium">Ready for checkout</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Currently Borrowed</p>
            <h4 className="text-xl font-bold text-amber-600 mt-1">{totalIssued} Copies</h4>
            <span className="text-[11px] text-slate-400">Under circulation</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Damaged / Written-Off</p>
            <h4 className="text-xl font-bold text-rose-600 mt-1">{totalDamaged} Copies</h4>
            <span className="text-[11px] text-rose-500 font-medium">Non-circulating</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search title, book no, category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
            >
              {categories.map((c, i) => (
                <option key={i} value={c}>Category: {c}</option>
              ))}
            </select>
          </div>

          <span className="text-xs text-slate-500">
            Showing {filtered.length} of {stockList.length} Stock Items
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3 text-center w-12">S.NO.</th>
                <th className="py-3 px-3">BOOK NO</th>
                <th className="py-3 px-4">BOOK TITLE</th>
                <th className="py-3 px-3">CATEGORY</th>
                <th className="py-3 px-3 text-center">OPENING STOCK</th>
                <th className="py-3 px-3 text-center">PURCHASED</th>
                <th className="py-3 px-3 text-center">ISSUED</th>
                <th className="py-3 px-3 text-center">DAMAGED</th>
                <th className="py-3 px-3 text-center font-bold">NET IN LIBRARY</th>
                <th className="py-3 px-3 text-center">STOCK STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map((s, idx) => {
                  const status =
                    s.availableQty === 0
                      ? 'Out of Stock'
                      : s.availableQty <= (s.reOrderLevel || 5)
                      ? 'Low Stock'
                      : 'In Stock';
                  return (
                    <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3 text-center font-medium text-slate-400">{idx + 1}</td>
                      <td className="py-3 px-3 font-mono font-semibold text-indigo-700">{s.bookNo}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{s.title}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700">
                          {s.category}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-medium text-slate-800">{s.openQty}</td>
                      <td className="py-3 px-3 text-center text-slate-500">{s.purchased || 0}</td>
                      <td className="py-3 px-3 text-center font-semibold text-amber-600">{s.issuedQty}</td>
                      <td className="py-3 px-3 text-center font-semibold text-rose-600">{s.damagedQty}</td>
                      <td className="py-3 px-3 text-center font-bold text-emerald-700 bg-emerald-50/50">
                        {s.availableQty}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            status === 'In Stock'
                              ? 'bg-emerald-100 text-emerald-800'
                              : status === 'Low Stock'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    No stock records found matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default BooksStockReportPage;
