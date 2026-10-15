import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Home,
  Printer,
  FileDown,
  Building,
  DollarSign,
  Package,
  Calendar
} from 'lucide-react';

const INITIAL_PURCHASES = [
  { id: '1', supplierName: 'Goyal Book Depot', city: 'Jaipur', mobileNo: '9829012345', purchaseDate: '2026-08-15', billNo: 'GBD/2026/892', billDate: '2026-08-15', gstRate: 5, quantity: 50, rate: 450, total: 22500 },
  { id: '2', supplierName: 'National Book House', city: 'Jaipur', mobileNo: '9414055667', purchaseDate: '2026-09-02', billNo: 'NBH/SEP/104', billDate: '2026-09-01', gstRate: 0, quantity: 35, rate: 260, total: 9100 },
  { id: '3', supplierName: 'Vikas Book Store', city: 'Jaipur', mobileNo: '9828033445', purchaseDate: '2026-09-18', billNo: 'VBS/2026/341', billDate: '2026-09-18', gstRate: 5, quantity: 35, rate: 380, total: 13300 }
];

export function PurchasedBooksReportPage({ onNavigate }) {
  const [purchases, setPurchases] = useState(INITIAL_PURCHASES);
  const [searchQuery, setSearchQuery] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('All');

  useEffect(() => {
    fetch('/api/library/purchases')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.length) setPurchases(data.data);
      })
      .catch(() => {});
  }, []);

  const suppliers = ['All', ...new Set(purchases.map(p => p.supplierName))];

  const filtered = purchases.filter(p => {
    const matchesSupplier = supplierFilter === 'All' || p.supplierName === supplierFilter;
    const matchesSearch =
      p.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.billNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSupplier && matchesSearch;
  });

  const totalInvoices = filtered.length;
  const totalCopiesPurchased = filtered.reduce((s, p) => s + (Number(p.quantity) || 0), 0);
  const totalAmountSpent = filtered.reduce((s, p) => s + (Number(p.total) || 0), 0);

  const exportCSV = () => {
    const headers = ['S.NO.', 'BILL NO', 'BILL DATE', 'PURCHASE DATE', 'SUPPLIER NAME', 'CITY', 'MOBILE', 'QTY', 'GST %', 'TOTAL (₹)'];
    const rows = filtered.map((p, idx) => [
      idx + 1,
      `"${p.billNo}"`,
      `"${p.billDate || ''}"`,
      `"${p.purchaseDate}"`,
      `"${p.supplierName}"`,
      `"${p.city}"`,
      `"${p.mobileNo}"`,
      p.quantity,
      p.gstRate,
      p.total
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Purchased_Books_Report_${new Date().toISOString().slice(0, 10)}.csv`;
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
          <span className="text-indigo-600 text-sm font-semibold">Purchased Books Report</span>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Total Purchase Invoices</p>
            <h4 className="text-xl font-bold text-slate-800 mt-1">{totalInvoices} Invoices</h4>
            <span className="text-[11px] text-slate-400">Supplier deliveries</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Building className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Books Procured</p>
            <h4 className="text-xl font-bold text-indigo-600 mt-1">{totalCopiesPurchased} Copies</h4>
            <span className="text-[11px] text-slate-400">New additions to catalog</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Total Acquisition Cost</p>
            <h4 className="text-xl font-bold text-emerald-700 mt-1">₹{totalAmountSpent.toLocaleString('en-IN')}</h4>
            <span className="text-[11px] text-emerald-600 font-medium">Billed to school fund</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <DollarSign className="w-5 h-5" />
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
                placeholder="Search bill no, supplier, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <select
              value={supplierFilter}
              onChange={(e) => setSupplierFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
            >
              {suppliers.map((s, i) => (
                <option key={i} value={s}>Supplier: {s}</option>
              ))}
            </select>
          </div>

          <span className="text-xs text-slate-500">
            Showing {filtered.length} of {purchases.length} Invoices
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3 text-center w-12">S.NO.</th>
                <th className="py-3 px-3">BILL NO</th>
                <th className="py-3 px-3">BILL DATE</th>
                <th className="py-3 px-3">PURCHASE DATE</th>
                <th className="py-3 px-4">SUPPLIER NAME</th>
                <th className="py-3 px-3">CITY</th>
                <th className="py-3 px-3">MOBILE NO</th>
                <th className="py-3 px-3 text-center">QUANTITY</th>
                <th className="py-3 px-3 text-center">GST %</th>
                <th className="py-3 px-4 text-right">TOTAL AMOUNT (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map((p, idx) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 text-center font-medium text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <span className="font-mono text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded text-[11px]">
                        {p.billNo}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{p.billDate || p.purchaseDate}</td>
                    <td className="py-3 px-3 text-slate-600">{p.purchaseDate}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{p.supplierName}</td>
                    <td className="py-3 px-3 text-slate-600">{p.city}</td>
                    <td className="py-3 px-3 font-mono text-slate-600">{p.mobileNo}</td>
                    <td className="py-3 px-3 text-center font-bold text-slate-800">{p.quantity}</td>
                    <td className="py-3 px-3 text-center text-slate-500">{p.gstRate}%</td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-700">
                      ₹{p.total.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    No purchase records match the search query.
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
export default PurchasedBooksReportPage;
