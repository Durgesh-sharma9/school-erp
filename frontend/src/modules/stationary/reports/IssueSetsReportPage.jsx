import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Home,
  Printer,
  FileDown,
  Calendar,
  Filter,
  RefreshCw,
  ShoppingBag
} from 'lucide-react';

const INITIAL_RECORDS = [
  {
    id: '1',
    name: 'AARAV SHARMA',
    className: 'I - A',
    billNo: 'BILL-2026-001',
    noOfSets: 1,
    type: 'Sale',
    totalCost: 1850,
    gst: 0,
    finalCost: 1850,
    cash: 1850,
    bank: 0,
    discount: 0,
    paid: 1850,
    balance: 0,
    issueDate: '2026-04-02'
  },
  {
    id: '2',
    name: 'ANANYA VERMA',
    className: 'II - A',
    billNo: 'BILL-2026-002',
    noOfSets: 1,
    type: 'Sale',
    totalCost: 2100,
    gst: 0,
    finalCost: 2100,
    cash: 1000,
    bank: 0,
    discount: 100,
    paid: 1000,
    balance: 1000,
    issueDate: '2026-04-03'
  },
  {
    id: '3',
    name: 'KABIR MEHTA',
    className: 'V - B',
    billNo: 'BILL-2026-003',
    noOfSets: 1,
    type: 'Sale',
    totalCost: 2750,
    gst: 0,
    finalCost: 2750,
    cash: 0,
    bank: 2750,
    discount: 0,
    paid: 2750,
    balance: 0,
    issueDate: '2026-04-05'
  },
  {
    id: '4',
    name: 'DIVYA SINGH',
    className: 'IX - A',
    billNo: 'BILL-2026-004',
    noOfSets: 2,
    type: 'Sale',
    totalCost: 6400,
    gst: 0,
    finalCost: 6400,
    cash: 3000,
    bank: 3400,
    discount: 0,
    paid: 6400,
    balance: 0,
    issueDate: '2026-04-06'
  },
  {
    id: '5',
    name: 'ROHAN PATEL',
    className: 'XI - SCI',
    billNo: 'BILL-2026-005',
    noOfSets: 1,
    type: 'Sale',
    totalCost: 4200,
    gst: 0,
    finalCost: 4200,
    cash: 2000,
    bank: 0,
    discount: 200,
    paid: 2000,
    balance: 2000,
    issueDate: '2026-04-08'
  }
];

export function IssueSetsReportPage({ onNavigate }) {
  const [records, setRecords] = useState(INITIAL_RECORDS);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('Normal'); // 'Normal' or 'Summary'
  const [selectedType, setSelectedType] = useState('All');
  const [fromDate, setFromDate] = useState('2026-04-01');
  const [toDate, setToDate] = useState('2026-10-31');

  useEffect(() => {
    fetch('/api/stationary/sales')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.length) {
          const mapped = data.data.map((item, idx) => ({
            id: item.id || String(idx + 1),
            name: item.studentName || item.name || 'STUDENT',
            className: item.className || 'General',
            billNo: item.billNo || `BILL-${idx + 1}`,
            noOfSets: item.noOfSets || 1,
            type: item.type || 'Sale',
            totalCost: Number(item.totalCost) || 0,
            gst: Number(item.gst) || 0,
            finalCost: Number(item.finalCost || item.totalCost) || 0,
            cash: item.payMode === 'Cash' ? Number(item.paid) : 0,
            bank: item.payMode === 'Online/Bank' ? Number(item.paid) : 0,
            discount: Number(item.discount) || 0,
            paid: Number(item.paid) || 0,
            balance: Number(item.balance) || 0,
            issueDate: item.issueDate || '2026-04-01'
          }));
          setRecords(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const filteredRecords = records.filter(r => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.billNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.className.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'All' || r.type === selectedType;
    const matchesDate = (!fromDate || r.issueDate >= fromDate) && (!toDate || r.issueDate <= toDate);
    return matchesSearch && matchesType && matchesDate;
  });

  // Calculate totals
  const totalSets = filteredRecords.reduce((sum, r) => sum + Number(r.noOfSets || 0), 0);
  const totalCostSum = filteredRecords.reduce((sum, r) => sum + Number(r.totalCost || 0), 0);
  const totalGstSum = filteredRecords.reduce((sum, r) => sum + Number(r.gst || 0), 0);
  const totalFinalCostSum = filteredRecords.reduce((sum, r) => sum + Number(r.finalCost || 0), 0);
  const totalCashSum = filteredRecords.reduce((sum, r) => sum + Number(r.cash || 0), 0);
  const totalBankSum = filteredRecords.reduce((sum, r) => sum + Number(r.bank || 0), 0);
  const totalDiscountSum = filteredRecords.reduce((sum, r) => sum + Number(r.discount || 0), 0);
  const totalPaidSum = filteredRecords.reduce((sum, r) => sum + Number(r.paid || 0), 0);
  const totalBalanceSum = filteredRecords.reduce((sum, r) => sum + Number(r.balance || 0), 0);

  const exportCSV = () => {
    const headers = [
      'S.NO.',
      'NAME',
      'CLASS',
      'BILL NO',
      'NO OF SETS',
      'TYPE',
      'TOTAL COST',
      'GST',
      'FINAL COST',
      'CASH',
      'BANK',
      'DISCOUNT',
      'PAID',
      'BALANCE',
      'ISSUE DATE'
    ];
    const rows = filteredRecords.map((r, i) => [
      i + 1,
      r.name,
      r.className,
      r.billNo,
      r.noOfSets,
      r.type,
      r.totalCost,
      r.gst,
      r.finalCost,
      r.cash,
      r.bank,
      r.discount,
      r.paid,
      r.balance,
      r.issueDate
    ]);
    const summaryRow = [
      'Total',
      '',
      '',
      '',
      totalSets,
      '',
      totalCostSum,
      totalGstSum,
      totalFinalCostSum,
      totalCashSum,
      totalBankSum,
      totalDiscountSum,
      totalPaidSum,
      totalBalanceSum,
      ''
    ];
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(e => e.join(',')), summaryRow.join(',')].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `issue_sets_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 bg-slate-50 min-h-screen text-slate-800">
      {/* Top Breadcrumb & Action Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 bg-white p-3 rounded-lg shadow-sm border border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-indigo-600" />
            Issue Sets Report
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
            <span className="text-indigo-600 font-semibold">Issue Sets Report</span>
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
            <label className="block text-xs font-semibold text-slate-600 mb-1">View Mode</label>
            <select
              value={viewMode}
              onChange={e => setViewMode(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="Normal">Normal View</option>
              <option value="Summary">Summary View</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Type</label>
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="All">All Types</option>
              <option value="Sale">Sale</option>
              <option value="Complimentary">Complimentary</option>
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
        </div>

        {/* Search bar row */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Search by student name, bill no, class..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Showing <span className="font-semibold text-slate-800">{filteredRecords.length}</span> records
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
                <th className="py-2.5 px-3">NAME</th>
                <th className="py-2.5 px-3">CLASS</th>
                <th className="py-2.5 px-3">BILL NO</th>
                <th className="py-2.5 px-3 text-center">NO OF SETS</th>
                <th className="py-2.5 px-3 text-center">TYPE</th>
                <th className="py-2.5 px-3 text-right">TOTAL COST</th>
                <th className="py-2.5 px-3 text-right">GST</th>
                <th className="py-2.5 px-3 text-right">FINAL COST</th>
                <th className="py-2.5 px-3 text-right">CASH</th>
                <th className="py-2.5 px-3 text-right">BANK</th>
                <th className="py-2.5 px-3 text-right">DISCOUNT</th>
                <th className="py-2.5 px-3 text-right">PAID</th>
                <th className="py-2.5 px-3 text-right">BALANCE</th>
                <th className="py-2.5 px-3 text-center">ISSUE DATE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan="15" className="py-8 text-center text-slate-400">
                    No issue records found for selected filters
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r, index) => (
                  <tr key={r.id || index} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2 px-3 text-slate-500">{index + 1}</td>
                    <td className="py-2 px-3 font-semibold text-slate-800">{r.name}</td>
                    <td className="py-2 px-3 text-slate-600">{r.className}</td>
                    <td className="py-2 px-3 font-mono text-indigo-600 text-[11px]">{r.billNo}</td>
                    <td className="py-2 px-3 text-center font-bold text-slate-700">{r.noOfSets}</td>
                    <td className="py-2 px-3 text-center">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {r.type}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right font-medium text-slate-700">₹{r.totalCost.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right text-slate-500">₹{r.gst.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right font-bold text-slate-800">₹{r.finalCost.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right text-slate-600">₹{r.cash.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right text-slate-600">₹{r.bank.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right text-amber-600 font-medium">₹{r.discount.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right font-bold text-emerald-700">₹{r.paid.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right font-bold text-rose-600">
                      {r.balance > 0 ? `₹${r.balance.toLocaleString()}` : '-'}
                    </td>
                    <td className="py-2 px-3 text-center text-slate-500">{r.issueDate}</td>
                  </tr>
                ))
              )}
            </tbody>
            {/* Summary / Total Footer */}
            {filteredRecords.length > 0 && (
              <tfoot>
                <tr className="bg-slate-100 border-t-2 border-slate-300 font-bold text-slate-800 text-[11px]">
                  <td className="py-2.5 px-3 uppercase" colSpan="4">
                    Total
                  </td>
                  <td className="py-2.5 px-3 text-center text-indigo-700 font-bold">{totalSets}</td>
                  <td className="py-2.5 px-3 text-center">-</td>
                  <td className="py-2.5 px-3 text-right">₹{totalCostSum.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right">₹{totalGstSum.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right text-indigo-800">₹{totalFinalCostSum.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right">₹{totalCashSum.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right">₹{totalBankSum.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right text-amber-700">₹{totalDiscountSum.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right text-emerald-800">₹{totalPaidSum.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right text-rose-700">₹{totalBalanceSum.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-center">-</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
export default IssueSetsReportPage;
