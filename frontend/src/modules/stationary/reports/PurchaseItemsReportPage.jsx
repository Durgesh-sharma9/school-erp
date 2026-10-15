import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Search,
  Home,
  Printer,
  FileDown,
  Calendar,
  Building2,
  DollarSign
} from 'lucide-react';

const INITIAL_PURCHASES = [
  {
    id: '1',
    supplierName: 'GLOBAL BOOK DISTRIBUTORS',
    phone: '9876543210',
    itemName: 'School Diary 2026-27',
    itemQty: 250,
    itemRate: 85,
    gstPercent: 0,
    purchaseDate: '2026-03-25',
    total: 21250
  },
  {
    id: '2',
    supplierName: 'GLOBAL BOOK DISTRIBUTORS',
    phone: '9876543210',
    itemName: '4-Line English Notebook (172 Pgs)',
    itemQty: 500,
    itemRate: 25,
    gstPercent: 0,
    purchaseDate: '2026-03-25',
    total: 12500
  },
  {
    id: '3',
    supplierName: 'ROYAL UNIFORMS & FABRICS',
    phone: '9414056789',
    itemName: 'T Shirt- W (22)',
    itemQty: 100,
    itemRate: 180,
    gstPercent: 5,
    purchaseDate: '2026-03-28',
    total: 18900
  },
  {
    id: '4',
    supplierName: 'ROYAL UNIFORMS & FABRICS',
    phone: '9414056789',
    itemName: 'Pant ( 20 )',
    itemQty: 100,
    itemRate: 280,
    gstPercent: 5,
    purchaseDate: '2026-03-28',
    total: 29400
  },
  {
    id: '5',
    supplierName: 'CLASSIC PAPER MART',
    phone: '9828098765',
    itemName: 'Practical File / Register',
    itemQty: 300,
    itemRate: 45,
    gstPercent: 12,
    purchaseDate: '2026-04-02',
    total: 15120
  }
];

export function PurchaseItemsReportPage({ onNavigate }) {
  const [records, setRecords] = useState(INITIAL_PURCHASES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('All');
  const [fromDate, setFromDate] = useState('2026-03-01');
  const [toDate, setToDate] = useState('2026-10-31');

  useEffect(() => {
    fetch('/api/stationary/purchases')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.length) {
          const flattened = [];
          data.data.forEach((p, pIdx) => {
            if (p.items && p.items.length) {
              p.items.forEach((it, iIdx) => {
                flattened.push({
                  id: `${p.id}-${iIdx}`,
                  supplierName: p.supplierName || 'Supplier',
                  phone: p.phone || p.mobileNo || '-',
                  itemName: it.itemName || `Item ${iIdx + 1}`,
                  itemQty: Number(it.qty) || 1,
                  itemRate: Number(it.rate) || 0,
                  gstPercent: Number(it.gst) || 0,
                  purchaseDate: p.purchaseDate || '2026-04-01',
                  total: Number(it.total) || (Number(it.qty) * Number(it.rate))
                });
              });
            } else {
              flattened.push({
                id: p.id || String(pIdx + 1),
                supplierName: p.supplierName || 'Supplier',
                phone: p.phone || '-',
                itemName: 'Bulk Stationery Purchase',
                itemQty: Number(p.noOfItems) || 1,
                itemRate: Number(p.totalCost) || 0,
                gstPercent: 0,
                purchaseDate: p.purchaseDate || '2026-04-01',
                total: Number(p.totalCost) || 0
              });
            }
          });
          if (flattened.length) {
            setRecords(flattened);
          }
        }
      })
      .catch(() => {});
  }, []);

  const suppliers = ['All', ...new Set(records.map(r => r.supplierName))];

  const filteredRecords = records.filter(r => {
    const matchesSupplier = selectedSupplier === 'All' || r.supplierName === selectedSupplier;
    const matchesSearch =
      r.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.phone.includes(searchQuery);
    const matchesDate = (!fromDate || r.purchaseDate >= fromDate) && (!toDate || r.purchaseDate <= toDate);
    return matchesSupplier && matchesSearch && matchesDate;
  });

  const totalQty = filteredRecords.reduce((sum, r) => sum + Number(r.itemQty || 0), 0);
  const totalAmount = filteredRecords.reduce((sum, r) => sum + Number(r.total || 0), 0);

  const exportCSV = () => {
    const headers = [
      'S.NO.',
      'SUPPLIER',
      'PHONE',
      'ITEM NAME',
      'ITEM QTY',
      'ITEM RATE',
      'GST %',
      'PURCHASE DATE',
      'TOTAL'
    ];
    const rows = filteredRecords.map((r, i) => [
      i + 1,
      `"${r.supplierName}"`,
      r.phone,
      `"${r.itemName}"`,
      r.itemQty,
      r.itemRate,
      r.gstPercent,
      r.purchaseDate,
      r.total
    ]);
    const summaryRow = ['Total', '', '', '', totalQty, '', '', '', totalAmount];
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(e => e.join(',')), summaryRow.join(',')].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `purchase_items_report_${new Date().toISOString().split('T')[0]}.csv`);
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
            <FileSpreadsheet className="w-6 h-6 text-indigo-600" />
            Purchase Items Report
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
            <span className="text-indigo-600 font-semibold">Purchase Items Report</span>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Supplier</label>
            <select
              value={selectedSupplier}
              onChange={e => setSelectedSupplier(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {suppliers.map(sup => (
                <option key={sup} value={sup}>
                  {sup}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={e => setToDate(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search item, supplier..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
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
                <th className="py-2.5 px-3">SUPPLIER</th>
                <th className="py-2.5 px-3">PHONE</th>
                <th className="py-2.5 px-3">ITEM NAME</th>
                <th className="py-2.5 px-3 text-center">ITEM QTY</th>
                <th className="py-2.5 px-3 text-right">ITEM RATE</th>
                <th className="py-2.5 px-3 text-center">GST %</th>
                <th className="py-2.5 px-3 text-center">PURCHASE DATE</th>
                <th className="py-2.5 px-3 text-right">TOTAL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-8 text-center text-slate-400">
                    No purchase records found
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r, index) => (
                  <tr key={r.id || index} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2 px-3 text-slate-500">{index + 1}</td>
                    <td className="py-2 px-3 font-semibold text-slate-800 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                      {r.supplierName}
                    </td>
                    <td className="py-2 px-3 font-mono text-slate-600">{r.phone}</td>
                    <td className="py-2 px-3 font-medium text-slate-800">{r.itemName}</td>
                    <td className="py-2 px-3 text-center font-bold text-slate-700">{r.itemQty}</td>
                    <td className="py-2 px-3 text-right text-slate-700">₹{r.itemRate.toLocaleString()}</td>
                    <td className="py-2 px-3 text-center text-slate-500">{r.gstPercent}%</td>
                    <td className="py-2 px-3 text-center text-slate-500">{r.purchaseDate}</td>
                    <td className="py-2 px-3 text-right font-bold text-indigo-700">₹{r.total.toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
            {filteredRecords.length > 0 && (
              <tfoot>
                <tr className="bg-slate-100 border-t-2 border-slate-300 font-bold text-slate-800 text-[11px]">
                  <td className="py-2.5 px-3 uppercase" colSpan="4">
                    Total
                  </td>
                  <td className="py-2.5 px-3 text-center text-indigo-700 font-bold">{totalQty}</td>
                  <td className="py-2.5 px-3" colSpan="3"></td>
                  <td className="py-2.5 px-3 text-right text-indigo-800 font-bold">₹{totalAmount.toLocaleString()}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
export default PurchaseItemsReportPage;
