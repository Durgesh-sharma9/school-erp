import React, { useState, useEffect } from 'react';
import {
  Tag,
  Search,
  Home,
  Printer,
  FileDown,
  Package
} from 'lucide-react';

const INITIAL_ITEMS = [
  { id: '1', categoryName: 'Diary', itemName: 'School Diary 2026-27', price: 150, gst: 0, amtGst: 150 },
  { id: '2', categoryName: 'Uniform', itemName: 'T Shirt- W (22)', price: 300, gst: 0, amtGst: 300 },
  { id: '3', categoryName: 'Uniform', itemName: 'T Shirt- Y (24)', price: 300, gst: 0, amtGst: 300 },
  { id: '4', categoryName: 'Uniform', itemName: 'T-Shirt -W( 20 )', price: 300, gst: 0, amtGst: 300 },
  { id: '5', categoryName: 'Uniform', itemName: 'Pant ( 20 )', price: 450, gst: 0, amtGst: 450 },
  { id: '6', categoryName: 'Uniform', itemName: 'Pant ( 30 )', price: 520, gst: 0, amtGst: 520 },
  { id: '7', categoryName: 'Uniform', itemName: 'Pajama ( 26 )', price: 280, gst: 0, amtGst: 280 },
  { id: '8', categoryName: 'Note Books', itemName: '4-Line English Notebook (172 Pgs)', price: 45, gst: 0, amtGst: 45 },
  { id: '9', categoryName: 'Note Books', itemName: '2-Line Hindi Notebook (172 Pgs)', price: 45, gst: 0, amtGst: 45 },
  { id: '10', categoryName: 'Register', itemName: 'Practical File / Register', price: 85, gst: 0, amtGst: 85 }
];

export function CategoryItemsReportPage({ onNavigate }) {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [reportType, setReportType] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetch('/api/stationary/items')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.length) {
          const mapped = data.data.map(i => ({
            id: i.id,
            categoryName: i.categoryName,
            itemName: i.itemName,
            price: i.rate,
            gst: 0,
            amtGst: i.rate
          }));
          setItems(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const categories = ['All', ...new Set(items.map(i => i.categoryName))];

  const filteredItems = items.filter(i => {
    const matchesCat = selectedCategory === 'All' || i.categoryName === selectedCategory;
    const matchesSearch =
      i.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const exportCSV = () => {
    const headers = ['S.NO.', 'CATEGORY', 'ITEM NAME', 'PRICE', 'AMT + GST'];
    const rows = filteredItems.map((i, idx) => [
      idx + 1,
      `"${i.categoryName}"`,
      `"${i.itemName}"`,
      i.price,
      i.amtGst
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Category_Items_Report_${new Date().toISOString().slice(0, 10)}.csv`;
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
          <span className="text-indigo-600 text-sm font-semibold">Category Items Report</span>
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
                placeholder="Search item or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-600">Report Type:</label>
              <select
                value={reportType}
                onChange={(e) => {
                  setReportType(e.target.value);
                  if (e.target.value === 'All') setSelectedCategory('All');
                }}
                className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
              >
                <option value="All">All</option>
                <option value="Category">Category</option>
              </select>
            </div>

            {reportType === 'Category' && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
              >
                {categories.map((c, i) => (
                  <option key={i} value={c}>{c}</option>
                ))}
              </select>
            )}
          </div>

          <span className="text-xs text-slate-500">
            Showing {filteredItems.length} of {items.length} Items
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 text-center w-16">S.NO.</th>
                <th className="py-3 px-4">CATEGORY</th>
                <th className="py-3 px-4">ITEM NAME</th>
                <th className="py-3 px-4 text-right">PRICE (₹)</th>
                <th className="py-3 px-4 text-right">AMT + GST (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length > 0 ? (
                filteredItems.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-center font-medium text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] bg-indigo-50 text-indigo-700 font-semibold">
                        {item.categoryName}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{item.itemName}</td>
                    <td className="py-3 px-4 text-right font-medium text-slate-700">₹{item.price}</td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-700">₹{item.amtGst}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No items found matching the selected filter.
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
export default CategoryItemsReportPage;
