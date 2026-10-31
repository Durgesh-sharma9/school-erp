import React, { useState, useEffect } from 'react';
import {
  Boxes,
  Search,
  Home,
  Printer,
  FileDown,
  Layers,
  AlertTriangle
} from 'lucide-react';

const INITIAL_STOCK = [];

export function StockReportPage({ onNavigate }) {
  const [stockList, setStockList] = useState(INITIAL_STOCK);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetch('/api/stationary/items')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          const mapped = data.data.map((item, idx) => {
            const open = Number(item.openQuantity) || 50;
            const purch = 100;
            const issued = Math.min(open + purch, 75);
            const stock = open + purch - issued;
            return {
              id: item.id || String(idx + 1),
              categoryName: item.categoryName || 'General',
              itemName: item.itemName || `Item ${idx + 1}`,
              openQty: open,
              purchaseQty: purch,
              issuedQty: issued,
              stockQty: stock,
              reorderLevel: Number(item.reorderQuantity) || 20
            };
          });
          setStockList(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const categories = ['All', ...new Set(stockList.map(s => s.categoryName))];

  const filteredStock = stockList.filter(s => {
    const matchesCategory = selectedCategory === 'All' || s.categoryName === selectedCategory;
    const matchesSearch =
      s.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalOpen = filteredStock.reduce((acc, s) => acc + s.openQty, 0);
  const totalPurchase = filteredStock.reduce((acc, s) => acc + s.purchaseQty, 0);
  const totalIssued = filteredStock.reduce((acc, s) => acc + s.issuedQty, 0);
  const totalStock = filteredStock.reduce((acc, s) => acc + s.stockQty, 0);

  const exportCSV = () => {
    const headers = ['S.NO.', 'CATEGORY', 'ITEM NAME', 'OPEN QTY', 'PURCHASE QTY', 'ISSUED QTY', 'STOCK QTY'];
    const rows = filteredStock.map((s, i) => [
      i + 1,
      `"${s.categoryName}"`,
      `"${s.itemName}"`,
      s.openQty,
      s.purchaseQty,
      s.issuedQty,
      s.stockQty
    ]);
    const summaryRow = ['Total', '', '', totalOpen, totalPurchase, totalIssued, totalStock];
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(e => e.join(',')), summaryRow.join(',')].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `stock_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 bg-slate-50 min-h-screen text-slate-800">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 bg-white p-3 rounded-lg shadow-sm border border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Boxes className="w-6 h-6 text-indigo-600" />
            Stock Report
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span
              className="flex items-center gap-1 hover:text-indigo-600 cursor-pointer"
              onClick={() => onNavigate && onNavigate('/')}
            >
              <Home className="w-3.5 h-3.5" /> Home
            </span>
            <span>/</span>
            <span
              className="hover:text-indigo-600 cursor-pointer"
              onClick={() => onNavigate && onNavigate('/stationary-reports')}
            >
              Stationary
            </span>
            <span>/</span>
            <span className="text-indigo-600 font-semibold">Stock Report</span>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2 mt-3 md:mt-0">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold shadow-sm transition-all"
            title="Export CSV"
          >
            <FileDown className="w-4 h-4" /> CSV Export
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-800 text-white rounded text-xs font-semibold shadow-sm transition-all"
            title="Print Report"
          >
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>
      </div>

      {/* Filter Card */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Search by item name or category..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-slate-600">Category:</label>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <span className="text-xs text-slate-500 font-medium ml-2">
              Total Items: <span className="font-semibold text-slate-800">{filteredStock.length}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Table View */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3">S.NO.</th>
                <th className="py-2.5 px-3">CATEGORY</th>
                <th className="py-2.5 px-3">ITEM NAME</th>
                <th className="py-2.5 px-3 text-center">OPEN QTY</th>
                <th className="py-2.5 px-3 text-center">PURCHASE QTY</th>
                <th className="py-2.5 px-3 text-center">ISSUED QTY</th>
                <th className="py-2.5 px-3 text-center">STOCK QTY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStock.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">
                    No items found in stock matching criteria
                  </td>
                </tr>
              ) : (
                filteredStock.map((s, index) => {
                  const isLow = s.stockQty <= s.reorderLevel;
                  return (
                    <tr key={s.id || index} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2 px-3 text-slate-500">{index + 1}</td>
                      <td className="py-2 px-3 font-semibold text-slate-700">{s.categoryName}</td>
                      <td className="py-2 px-3 font-medium text-slate-900">{s.itemName}</td>
                      <td className="py-2 px-3 text-center text-slate-600 font-medium">{s.openQty}</td>
                      <td className="py-2 px-3 text-center text-indigo-600 font-medium">{s.purchaseQty}</td>
                      <td className="py-2 px-3 text-center text-amber-600 font-medium">{s.issuedQty}</td>
                      <td className="py-2 px-3 text-center font-bold">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${
                            isLow
                              ? 'bg-rose-100 text-rose-700 border border-rose-300'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {isLow && <AlertTriangle className="w-3 h-3 text-rose-600" />}
                          {s.stockQty}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {filteredStock.length > 0 && (
              <tfoot>
                <tr className="bg-slate-100 border-t-2 border-slate-300 font-bold text-slate-800 text-[11px]">
                  <td className="py-2.5 px-3 uppercase" colSpan="3">
                    Total
                  </td>
                  <td className="py-2.5 px-3 text-center text-slate-700 font-bold">{totalOpen}</td>
                  <td className="py-2.5 px-3 text-center text-indigo-700 font-bold">{totalPurchase}</td>
                  <td className="py-2.5 px-3 text-center text-amber-700 font-bold">{totalIssued}</td>
                  <td className="py-2.5 px-3 text-center text-emerald-800 font-bold">{totalStock}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
export default StockReportPage;
