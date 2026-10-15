import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  Search,
  Home,
  Printer,
  FileDown,
  X,
  CreditCard,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const INITIAL_DUES = [
  {
    id: '2',
    billNo: 'SB-2026-002',
    className: 'Nursery - PP3+-A',
    name: 'AADHYA CHOUDHARY',
    mobileNo: '6377281034',
    shopName: 'J D Uniform',
    totalCost: 1050,
    paidAmt: 800,
    due: 250,
    issueDate: '2026-10-12'
  },
  {
    id: '3',
    billNo: 'SB-2026-003',
    className: 'Class X-A',
    name: 'ROHAN SHARMA',
    mobileNo: '9829012345',
    shopName: 'J D Book',
    totalCost: 1850,
    paidAmt: 1500,
    due: 300,
    issueDate: '2026-10-14'
  },
  {
    id: '4',
    billNo: 'SB-2026-004',
    className: 'Class VI-A',
    name: 'ANSHUMAN JOSHI',
    mobileNo: '9414022222',
    shopName: 'J D Book',
    totalCost: 1250,
    paidAmt: 850,
    due: 400,
    issueDate: '2026-10-15'
  }
];

export function DuePaymentPage({ onNavigate }) {
  const [dues, setDues] = useState(INITIAL_DUES);
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('All');
  const [selectedDue, setSelectedDue] = useState(null);
  const [collectionData, setCollectionData] = useState({
    amount: 0,
    payMode: 'Cash',
    date: new Date().toISOString().slice(0, 10),
    remark: ''
  });

  useEffect(() => {
    fetch('/api/stationary/sales')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.length) {
          const dueRecords = data.data.filter(s => Number(s.due) > 0);
          if (dueRecords.length) setDues(dueRecords);
        }
      })
      .catch(() => {});
  }, []);

  const classes = ['All', ...new Set(dues.map(d => d.className))];

  const filteredDues = dues.filter(d => {
    const matchesClass = classFilter === 'All' || d.className === classFilter;
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.billNo && d.billNo.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesClass && matchesSearch;
  });

  const openCollectModal = (record) => {
    setSelectedDue(record);
    setCollectionData({
      amount: record.due,
      payMode: 'Cash',
      date: new Date().toISOString().slice(0, 10),
      remark: ''
    });
  };

  const handleCollectSubmit = (e) => {
    e.preventDefault();
    const paid = Number(collectionData.amount);
    if (paid <= 0) {
      toast.error('Please enter a valid payment amount');
      return;
    }

    setDues(prev => prev.map(d => {
      if (d.id === selectedDue.id) {
        const remainingDue = Math.max(0, d.due - paid);
        return {
          ...d,
          paidAmt: (d.paidAmt || 0) + paid,
          due: remainingDue
        };
      }
      return d;
    }).filter(d => d.due > 0));

    toast.success(`Due payment of ₹${paid} collected successfully!`);
    setSelectedDue(null);

    fetch('/api/stationary/sales/collect-due', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selectedDue.id, paidAmt: paid })
    }).catch(() => {});
  };

  const totalOutstanding = filteredDues.reduce((s, d) => s + (Number(d.due) || 0), 0);

  const exportCSV = () => {
    const headers = ['S.NO.', 'CLASS', 'NAME', 'BILL NO', 'TOTAL COST', 'DUE (₹)', 'DATE'];
    const rows = filteredDues.map((d, idx) => [
      idx + 1,
      `"${d.className}"`,
      `"${d.name}"`,
      `"${d.billNo}"`,
      d.totalCost,
      d.due,
      `"${d.issueDate}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Stationary_Due_Payment_${new Date().toISOString().slice(0, 10)}.csv`;
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
          <span className="text-slate-500 text-sm font-medium">Stationary</span>
          <span className="text-slate-400">/</span>
          <span className="text-indigo-600 text-sm font-semibold">Due Payment</span>
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
            Print
          </button>
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
                placeholder="Search student, class, bill no..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
            >
              {classes.map((cls, i) => (
                <option key={i} value={cls}>Class: {cls}</option>
              ))}
            </select>
          </div>

          <div className="text-xs text-slate-500">
            Total Outstanding: <strong className="text-rose-600 text-sm">₹{totalOutstanding}</strong>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 text-center w-16">S.NO.</th>
                <th className="py-3 px-4">CLASS</th>
                <th className="py-3 px-4">NAME</th>
                <th className="py-3 px-4 text-right">TOTAL COST.</th>
                <th className="py-3 px-4 text-right">DUE</th>
                <th className="py-3 px-4 text-center w-36">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDues.length > 0 ? (
                filteredDues.map((d, idx) => (
                  <tr key={d.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-center font-medium text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-4 font-semibold text-slate-700">{d.className}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{d.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{d.billNo} • {d.mobileNo}</div>
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-slate-700">₹{d.totalCost}</td>
                    <td className="py-3 px-4 text-right font-bold text-rose-600">₹{d.due}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => openCollectModal(d)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold transition-colors shadow-xs"
                      >
                        Collect Due
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No pending dues found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Collect Due Payment Modal */}
      {selectedDue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                Collect Stationary Due Payment
              </h3>
              <button
                onClick={() => setSelectedDue(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCollectSubmit} className="p-6 space-y-4">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Student Name:</span>
                  <strong className="text-slate-800">{selectedDue.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Class:</span>
                  <span>{selectedDue.className}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Bill No:</span>
                  <span className="font-mono text-indigo-700">{selectedDue.billNo}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200 text-sm font-bold text-rose-600">
                  <span>Current Outstanding Due:</span>
                  <span>₹{selectedDue.due}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Amount Paid (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={selectedDue.due}
                    value={collectionData.amount}
                    onChange={(e) => setCollectionData({ ...collectionData, amount: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pay Mode</label>
                  <select
                    value={collectionData.payMode}
                    onChange={(e) => setCollectionData({ ...collectionData, payMode: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Bank / UPI">Bank / UPI</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Collection Date</label>
                <input
                  type="date"
                  value={collectionData.date}
                  onChange={(e) => setCollectionData({ ...collectionData, date: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedDue(null)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all"
                >
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export default DuePaymentPage;
