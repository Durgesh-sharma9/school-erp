import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Home,
  Printer,
  FileDown,
  DollarSign,
  Layers,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

const INITIAL_BOOKS = [
  { id: '1', bookNo: 'BK-1001', title: 'Mathematics Class X Exemplar', author: 'R.D. Sharma', publication: 'Dhanpat Rai Publications', category: 'Mathematics', edition: '2026 Revised', openQty: 30, availableQty: 24, issuedQty: 5, damagedQty: 1, rate: 450 },
  { id: '2', bookNo: 'BK-1002', title: 'Concepts of Physics Part 1', author: 'H.C. Verma', publication: 'Bharati Bhawan', category: 'Physics & Science', edition: '2025-26', openQty: 25, availableQty: 20, issuedQty: 4, damagedQty: 1, rate: 520 },
  { id: '3', bookNo: 'BK-1003', title: 'Godaan (गोदान)', author: 'Munshi Premchand', publication: 'NCERT New Delhi', category: 'Literature & Fiction', edition: '2024 Classic Edition', openQty: 20, availableQty: 16, issuedQty: 3, damagedQty: 1, rate: 180 },
  { id: '4', bookNo: 'BK-1004', title: 'Wings of Fire', author: 'Dr. A.P.J. Abdul Kalam', publication: 'Penguin Random House', category: 'General Knowledge & Biography', edition: 'Special Illustrated', openQty: 15, availableQty: 12, issuedQty: 3, damagedQty: 0, rate: 299 },
  { id: '5', bookNo: 'BK-1005', title: 'Python & AI for Secondary Students', author: 'Ruskin Bond', publication: 'Oxford University Press', category: 'Computer Science & AI', edition: '2026 Edition 2.0', openQty: 35, availableQty: 31, issuedQty: 4, damagedQty: 0, rate: 380 }
];

export function BooksSummaryReportPage({ onNavigate }) {
  const [books, setBooks] = useState(INITIAL_BOOKS);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    fetch('/api/library/books')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.length) setBooks(data.data);
      })
      .catch(() => {});
  }, []);

  const categories = ['All', ...new Set(books.map(b => b.category))];

  const filtered = books.filter(b => {
    const matchesCat = categoryFilter === 'All' || b.category === categoryFilter;
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.bookNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.publication.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const totalTitles = filtered.length;
  const totalStock = filtered.reduce((s, b) => s + (Number(b.openQty) || 0), 0);
  const totalAvailable = filtered.reduce((s, b) => s + (Number(b.availableQty) || 0), 0);
  const totalIssued = filtered.reduce((s, b) => s + (Number(b.issuedQty) || 0), 0);
  const totalValuation = filtered.reduce((s, b) => s + ((Number(b.openQty) || 0) * (Number(b.rate) || 0)), 0);

  const exportCSV = () => {
    const headers = ['S.NO.', 'BOOK NO', 'BOOK TITLE', 'AUTHOR', 'PUBLICATION', 'CATEGORY', 'EDITION', 'TOTAL STOCK', 'ISSUED', 'DAMAGED', 'AVAILABLE', 'UNIT RATE (₹)', 'VALUATION (₹)'];
    const rows = filtered.map((b, idx) => [
      idx + 1,
      `"${b.bookNo}"`,
      `"${b.title}"`,
      `"${b.author}"`,
      `"${b.publication}"`,
      `"${b.category}"`,
      `"${b.edition}"`,
      b.openQty,
      b.issuedQty,
      b.damagedQty,
      b.availableQty,
      b.rate,
      (Number(b.openQty) * Number(b.rate))
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Books_Summary_Report_${new Date().toISOString().slice(0, 10)}.csv`;
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
          <span className="text-indigo-600 text-sm font-semibold">Books Summary</span>
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

      {/* KPI Stats Banner */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Book Titles</p>
          <h4 className="text-xl font-bold text-slate-800 mt-1">{totalTitles}</h4>
          <span className="text-[11px] text-slate-400">Unique registered</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Total Copies</p>
          <h4 className="text-xl font-bold text-indigo-600 mt-1">{totalStock}</h4>
          <span className="text-[11px] text-indigo-500">Cumulative stock</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Available In Library</p>
          <h4 className="text-xl font-bold text-emerald-600 mt-1">{totalAvailable}</h4>
          <span className="text-[11px] text-emerald-500">In shelf stock</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Currently Borrowed</p>
          <h4 className="text-xl font-bold text-amber-600 mt-1">{totalIssued}</h4>
          <span className="text-[11px] text-amber-500">Active borrower hold</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Inventory Valuation</p>
          <h4 className="text-xl font-bold text-slate-800 mt-1">₹{totalValuation.toLocaleString('en-IN')}</h4>
          <span className="text-[11px] text-slate-400">Gross purchase value</span>
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
                placeholder="Search title, book no, author..."
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
            Showing {filtered.length} of {books.length} Records
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
                <th className="py-3 px-3">AUTHOR</th>
                <th className="py-3 px-3">PUBLICATION</th>
                <th className="py-3 px-3">CATEGORY</th>
                <th className="py-3 px-3 text-center">TOTAL STOCK</th>
                <th className="py-3 px-3 text-center">ISSUED</th>
                <th className="py-3 px-3 text-center">DAMAGED</th>
                <th className="py-3 px-3 text-center">AVAILABLE</th>
                <th className="py-3 px-3 text-right">RATE (₹)</th>
                <th className="py-3 px-4 text-right">VALUATION (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map((b, idx) => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 text-center font-medium text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-3 font-mono font-semibold text-indigo-700">{b.bookNo}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{b.title}</td>
                    <td className="py-3 px-3 text-slate-700">{b.author}</td>
                    <td className="py-3 px-3 text-slate-500">{b.publication}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px]">
                        {b.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-800">{b.openQty}</td>
                    <td className="py-3 px-3 text-center font-semibold text-amber-600">{b.issuedQty}</td>
                    <td className="py-3 px-3 text-center font-semibold text-rose-600">{b.damagedQty}</td>
                    <td className="py-3 px-3 text-center font-bold text-emerald-600">{b.availableQty}</td>
                    <td className="py-3 px-3 text-right text-slate-600">₹{b.rate}</td>
                    <td className="py-3 px-4 text-right font-bold text-slate-800">
                      ₹{(Number(b.openQty) * Number(b.rate)).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={12} className="py-8 text-center text-slate-400">
                    No books found matching the search criteria.
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
export default BooksSummaryReportPage;
