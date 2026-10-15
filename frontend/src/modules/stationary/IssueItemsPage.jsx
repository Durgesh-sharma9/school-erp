import React, { useState, useEffect } from 'react';
import {
  Package,
  Search,
  Home,
  Plus,
  Trash2,
  Printer,
  FileDown,
  X,
  DollarSign,
  User,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const INITIAL_SALES = [
  {
    id: '1',
    billNo: 'SB-2026-001',
    className: 'Class I-A',
    name: 'AADITYA SINGH CHOUDHARY',
    mobileNo: '8947919195',
    shopName: 'J D Book',
    type: 'Sale',
    noOfSets: 1,
    totalCost: 1250,
    gst: 0,
    finalCost: 1250,
    cash: 1250,
    bank: 0,
    discount: 50,
    paidAmt: 1200,
    due: 0,
    issueDate: '2026-10-10',
    receipt: 'RCP-1001'
  },
  {
    id: '2',
    billNo: 'SB-2026-002',
    className: 'Nursery - PP3+-A',
    name: 'AADHYA CHOUDHARY',
    mobileNo: '6377281034',
    shopName: 'J D Uniform',
    type: 'Sale',
    noOfSets: 1,
    totalCost: 1050,
    gst: 0,
    finalCost: 1050,
    cash: 800,
    bank: 0,
    discount: 0,
    paidAmt: 800,
    due: 250,
    issueDate: '2026-10-12',
    receipt: 'RCP-1002'
  },
  {
    id: '3',
    billNo: 'SB-2026-003',
    className: 'Class X-A',
    name: 'ROHAN SHARMA',
    mobileNo: '9829012345',
    shopName: 'J D Book',
    type: 'Sale',
    noOfSets: 1,
    totalCost: 1850,
    gst: 0,
    finalCost: 1850,
    cash: 1500,
    bank: 0,
    discount: 50,
    paidAmt: 1500,
    due: 300,
    issueDate: '2026-10-14',
    receipt: 'RCP-1003'
  }
];

export function IssueItemsPage({ onNavigate }) {
  const [sales, setSales] = useState(INITIAL_SALES);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [receiptModal, setReceiptModal] = useState(null);

  const [formData, setFormData] = useState({
    shopName: 'J D Book',
    className: 'Class I-A',
    name: '',
    mobileNo: '',
    payMode: 'Cash',
    noOfSets: 1,
    unitPrice: 1250,
    discount: 0,
    paidAmt: 1250
  });

  useEffect(() => {
    fetch('/api/stationary/sales')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.length) setSales(data.data);
      })
      .catch(() => {});
  }, []);

  const openAddModal = () => {
    setFormData({
      shopName: 'J D Book',
      className: 'Class I-A',
      name: '',
      mobileNo: '',
      payMode: 'Cash',
      noOfSets: 1,
      unitPrice: 1250,
      discount: 0,
      paidAmt: 1250
    });
    setIsModalOpen(true);
  };

  const grandTotal = Math.max(0, (formData.unitPrice * formData.noOfSets) - formData.discount);
  const balance = Math.max(0, grandTotal - formData.paidAmt);

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Customer / Student name is required');
      return;
    }

    const newSale = {
      id: String(Date.now()),
      billNo: `SB-2026-${String(sales.length + 1).padStart(3, '0')}`,
      className: formData.className,
      name: formData.name,
      mobileNo: formData.mobileNo,
      shopName: formData.shopName,
      type: 'Sale',
      noOfSets: formData.noOfSets,
      totalCost: formData.unitPrice * formData.noOfSets,
      gst: 0,
      finalCost: grandTotal,
      cash: formData.payMode === 'Cash' ? formData.paidAmt : 0,
      bank: formData.payMode === 'Bank' ? formData.paidAmt : 0,
      discount: formData.discount,
      paidAmt: formData.paidAmt,
      due: balance,
      issueDate: new Date().toISOString().slice(0, 10),
      receipt: `RCP-${1000 + sales.length + 1}`
    };

    setSales(prev => [newSale, ...prev]);
    toast.success('Items issued and bill recorded successfully');
    setIsModalOpen(false);

    fetch('/api/stationary/sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSale)
    }).catch(() => {});
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this sale record?')) {
      setSales(prev => prev.filter(s => s.id !== id));
      toast.success('Sale record removed');
      fetch(`/api/stationary/sales/${id}`, { method: 'DELETE' }).catch(() => {});
    }
  };

  const filteredSales = sales.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.billNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.mobileNo.includes(searchQuery)
  );

  const exportCSV = () => {
    const headers = ['S.NO.', 'BILL NO', 'CLASS', 'NAME', 'TYPE', 'TOTAL COST', 'DISCOUNT', 'PAID AMT', 'DUE', 'RECEIPT'];
    const rows = filteredSales.map((s, idx) => [
      idx + 1,
      `"${s.billNo}"`,
      `"${s.className}"`,
      `"${s.name}"`,
      `"${s.type}"`,
      s.totalCost,
      s.discount,
      s.paidAmt,
      s.due,
      `"${s.receipt}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Stationary_Issue_Items_${new Date().toISOString().slice(0, 10)}.csv`;
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
          <span className="text-indigo-600 text-sm font-semibold">Issue Items</span>
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
          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Sale
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Search */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by student name, bill no, mobile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
          <span className="text-xs text-slate-500">
            Showing {filteredSales.length} of {sales.length} Bills
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3 text-center w-12">S.NO.</th>
                <th className="py-3 px-3">BILL NO</th>
                <th className="py-3 px-3">CLASS</th>
                <th className="py-3 px-4">NAME</th>
                <th className="py-3 px-3">TYPE</th>
                <th className="py-3 px-3 text-right">PAID AMT.</th>
                <th className="py-3 px-3 text-right">DUE</th>
                <th className="py-3 px-3 text-center">RECEIPT</th>
                <th className="py-3 px-3 text-center w-28">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSales.length > 0 ? (
                filteredSales.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 text-center font-medium text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <span className="font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-semibold text-[11px]">
                        {s.billNo}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{s.className}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{s.name}</div>
                      <div className="text-[11px] text-slate-400">{s.mobileNo} • {s.shopName}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                        {s.type}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-800">₹{s.paidAmt}</td>
                    <td className="py-3 px-3 text-right">
                      <span className={s.due > 0 ? 'font-bold text-rose-600' : 'text-slate-400'}>
                        ₹{s.due}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-[11px] text-slate-500">{s.receipt}</td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setReceiptModal(s)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Print Receipt"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No sale/issue records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: ISSUE ITEMS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <Package className="w-4 h-4 text-indigo-600" />
                ISSUE ITEMS
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Shop Name</label>
                  <select
                    value={formData.shopName}
                    onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                  >
                    <option value="J D Book">J D Book</option>
                    <option value="J D Uniform">J D Uniform</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Class</label>
                  <select
                    value={formData.className}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                  >
                    <option value="Class I-A">Class I-A</option>
                    <option value="Class II-A">Class II-A</option>
                    <option value="Class III-A">Class III-A</option>
                    <option value="Nursery - PP3+-A">Nursery - PP3+-A</option>
                    <option value="Class X-A">Class X-A</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Student / Customer Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile No</label>
                  <input
                    type="text"
                    placeholder="Enter Mobile No"
                    value={formData.mobileNo}
                    onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pay Mode</label>
                  <select
                    value={formData.payMode}
                    onChange={(e) => setFormData({ ...formData, payMode: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Bank">Bank</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">No of Sets / Qty</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.noOfSets}
                    onChange={(e) => setFormData({ ...formData, noOfSets: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Unit Rate (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({ ...formData, unitPrice: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Discount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Paid Amount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.paidAmt}
                    onChange={(e) => setFormData({ ...formData, paidAmt: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Total Summary Banner */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center text-xs">
                <div>
                  <span className="text-slate-500">Grand Total :- </span>
                  <strong className="text-slate-800 text-sm">₹{grandTotal}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Balance / Due :- </span>
                  <strong className={`text-sm ${balance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>₹{balance}</strong>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sale Receipt Dialog */}
      {receiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 p-6 space-y-4">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-bold text-slate-800 text-sm">J D INTERNATIONAL SCHOOL</h4>
                <p className="text-[11px] text-slate-400">Stationary & Uniform Sale Receipt #{receiptModal.billNo}</p>
              </div>
              <button onClick={() => setReceiptModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Customer: <strong className="text-slate-800">{receiptModal.name}</strong></span>
                <span>Class: {receiptModal.className}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Date: {receiptModal.issueDate}</span>
                <span>Receipt: {receiptModal.receipt}</span>
              </div>
              <div className="flex justify-between py-1 border-t border-slate-100">
                <span>Total Amount:</span>
                <span className="font-semibold text-slate-800">₹{receiptModal.totalCost}</span>
              </div>
              <div className="flex justify-between py-1 text-emerald-700">
                <span>Paid Amount:</span>
                <span className="font-bold">₹{receiptModal.paidAmt}</span>
              </div>
              <div className="flex justify-between py-1 font-bold text-rose-600 bg-rose-50 px-2 rounded">
                <span>Balance Due:</span>
                <span>₹{receiptModal.due}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Bill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default IssueItemsPage;
