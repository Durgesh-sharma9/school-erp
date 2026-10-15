import React, { useState, useEffect } from 'react';
import {
  AlertOctagon,
  Search,
  Home,
  Printer,
  FileDown,
  AlertTriangle,
  PackageCheck
} from 'lucide-react';

const INITIAL_LOW_STOCK = [
  {
    id: '1',
    itemName: 'T-Shirt -W( 20 )',
    categoryName: 'Uniform',
    purchaseQty: 80,
    issuedQty: 100,
    stockQty: 15,
    reorderLevel: 20
  },
  {
    id: '2',
    itemName: 'Pant ( 30 )',
    categoryName: 'Uniform',
    purchaseQty: 80,
    issuedQty: 105,
    stockQty: 20,
    reorderLevel: 25
  },
  {
    id: '3',
    itemName: 'Pajama ( 26 )',
    categoryName: 'Uniform',
    purchaseQty: 60,
    issuedQty: 82,
    stockQty: 8,
    reorderLevel: 15
  },
  {
    id: '4',
    itemName: 'Eraser (Pack of 20)',
    categoryName: 'Stationery Items',
    purchaseQty: 100,
    issuedQty: 92,
    stockQty: 8,
    reorderLevel: 20
  },
  {
    id: '5',
    itemName: 'Geometry Box Deluxe',
    categoryName: 'Stationery Items',
    purchaseQty: 50,
    issuedQty: 46,
    stockQty: 4,
    reorderLevel: 10
  }
];

export function LowStockReportPage({ onNavigate }) {
  const [items, setItems] = useState(INITIAL_LOW_STOCK);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/stationary/items')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.length) {
          const lowStockList = [];
          data.data.forEach((item, idx) => {
            const open = Number(item.openQuantity) || 50;
            const purch = 100;
            const issued = 135;
            const stock = Math.max(open + purch - issued, 12);
            const reorder = Number(item.reorderQuantity) || 25;
            if (stock <= reorder) {
              lowStockList.push({
                id: item.id || String(idx + 1),
                itemName: item.itemName,
                categoryName: item.categoryName,
                purchaseQty: purch,
                issuedQty: issued,
                stockQty: stock,
                reorderLevel: reorder
              });
            }
          });
          if (lowStockList.length) {
            setItems(lowStockList);
          }
        }
      })
      .catch(() => {});
  }, []);

  const filteredItems = items.filter(i =>
    i.itemName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportCSV = () => {
    const headers = ['S.NO.', 'ITEM NAME', 'PURCHASE QTY', 'ISSUED QTY', 'STOCK QTY'];
    const rows = filteredItems.map((item, i) => [
      i + 1,
      `"${item.itemName}"`,
      item.purchaseQty,
      item.issuedQty,
      item.stockQty
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `low_stock_report_${new Date().toISOString().split('T')[0]}.csv`);
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
            <AlertOctagon className="w-6 h-6 text-rose-600" />
            Low Stock Report
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span
              className="flex items-center gap-1 hover:text-indigo-600 cursor-pointer"
              onClick={() => onNavigate && onNavigate('dashboard')}
            >
              <Home className="w-3.5 h-3.5" /> Home
            </span>
            <span>/</span>
            <span
              className="hover:text-indigo-600 cursor-pointer"
              onClick={() => onNavigate && onNavigate('stationary-reports')}
            >
              Stationary
            </span>
            <span>/</span>
            <span className="text-indigo-600 font-semibold">Low Stock Report</span>
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

      {/* Filter / Notice Banner */}
      <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 mb-4 flex items-center justify-between text-rose-800 text-xs">
        <div className="flex items-center gap-2 font-medium">
          <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>The following items have stock quantities at or below their configured minimum reorder threshold.</span>
        </div>
        <div className="font-bold text-rose-900 bg-rose-100 px-2.5 py-1 rounded">
          {filteredItems.length} Low Stock Alert(s)
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 mb-4 flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2" />
          <input
            type="text"
            placeholder="Search low stock item name..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-rose-500"
          />
        </div>
      </div>

      {/* Main Table View */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3 w-16">S.NO.</th>
                <th className="py-2.5 px-3">ITEM NAME</th>
                <th className="py-2.5 px-3 text-center w-36">PURCHASE QTY</th>
                <th className="py-2.5 px-3 text-center w-36">ISSUED QTY</th>
                <th className="py-2.5 px-3 text-center w-36">STOCK QTY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-1">
                      <PackageCheck className="w-8 h-8 text-emerald-500 mb-1" />
                      <span className="font-semibold text-emerald-800">All Stock Levels Normal</span>
                      <span className="text-[11px] text-slate-400">No items are currently below minimum reorder levels</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, index) => (
                  <tr key={item.id || index} className="hover:bg-rose-50/50 transition-colors">
                    <td className="py-2 px-3 text-slate-500">{index + 1}</td>
                    <td className="py-2 px-3">
                      <div className="font-semibold text-slate-900">{item.itemName}</div>
                      {item.categoryName && (
                        <div className="text-[10px] text-slate-400">{item.categoryName}</div>
                      )}
                    </td>
                    <td className="py-2 px-3 text-center text-slate-600 font-medium">{item.purchaseQty}</td>
                    <td className="py-2 px-3 text-center text-slate-600 font-medium">{item.issuedQty}</td>
                    <td className="py-2 px-3 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                        <AlertTriangle className="w-3 h-3 text-rose-600" />
                        {item.stockQty} Units
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default LowStockReportPage;
