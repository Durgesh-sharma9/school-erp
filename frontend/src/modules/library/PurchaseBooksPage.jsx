import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Home,
  Plus,
  Trash2,
  Printer,
  FileDown,
  X,
  Building,
  DollarSign,
  Calendar,
  Layers,
  Eye,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

const INITIAL_PURCHASES = [];

export function PurchaseBooksPage({ onNavigate }) {
  const [purchases, setPurchases] = useState(INITIAL_PURCHASES);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewInvoice, setViewInvoice] = useState(null);

  const [formData, setFormData] = useState({
    supplierName: 'Goyal Book Depot',
    city: 'Jaipur',
    mobileNo: '9829012345',
    purchaseDate: new Date().toISOString().slice(0, 10),
    billNo: `INV-${Date.now().toString().slice(-5)}`,
    billDate: new Date().toISOString().slice(0, 10),
    gstRate: 5,
    items: [
      { bookTitle: 'Mathematics Class X Exemplar', qty: 10, rate: 450, amount: 4500 }
    ]
  });

  useEffect(() => {
    fetch('/api/library/purchases')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.length) setPurchases(data.data);
      })
      .catch(() => {});
  }, []);

  const openAddModal = () => {
    setFormData({
      supplierName: 'Goyal Book Depot',
      city: 'Jaipur',
      mobileNo: '9829012345',
      purchaseDate: new Date().toISOString().slice(0, 10),
      billNo: `INV-${Date.now().toString().slice(-5)}`,
      billDate: new Date().toISOString().slice(0, 10),
      gstRate: 5,
      items: [
        { bookTitle: 'Mathematics Class X Exemplar', qty: 10, rate: 450, amount: 4500 }
      ]
    });
    setIsModalOpen(true);
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...formData.items];
    updated[index][field] = value;
    if (field === 'qty' || field === 'rate') {
      const q = Number(updated[index].qty) || 0;
      const r = Number(updated[index].rate) || 0;
      updated[index].amount = q * r;
    }
    setFormData({ ...formData, items: updated });
  };

  const addItemRow = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        { bookTitle: '', qty: 1, rate: 200, amount: 200 }
      ]
    });
  };

  const removeItemRow = (idx) => {
    if (formData.items.length <= 1) return;
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== idx)
    });
  };

  const totalQty = formData.items.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
  const subTotal = formData.items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const taxAmount = (subTotal * Number(formData.gstRate)) / 100;
  const grandTotal = subTotal + taxAmount;

  const handleSavePurchase = (e) => {
    e.preventDefault();
    if (!formData.supplierName || !formData.billNo) {
      toast.error('Supplier and Bill No are required');
      return;
    }

    const newPurchase = {
      id: String(Date.now()),
      supplierName: formData.supplierName,
      city: formData.city,
      mobileNo: formData.mobileNo,
      purchaseDate: formData.purchaseDate,
      billNo: formData.billNo,
      billDate: formData.billDate,
      gstRate: formData.gstRate,
      quantity: totalQty,
      rate: Math.round(grandTotal / (totalQty || 1)),
      total: grandTotal,
      items: formData.items
    };

    setPurchases(prev => [newPurchase, ...prev]);
    toast.success('Book purchase invoice recorded and inventory updated');
    setIsModalOpen(false);

    fetch('/api/library/purchases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPurchase)
    }).catch(() => {});
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this purchase bill?')) {
      setPurchases(prev => prev.filter(p => p.id !== id));
      toast.success('Purchase invoice deleted');
      fetch(`/api/library/purchases/${id}`, { method: 'DELETE' }).catch(() => {});
    }
  };

  const filteredPurchases = purchases.filter(p =>
    p.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.billNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportCSV = () => {
    const headers = ['S.NO.', 'SUPPLIER NAME', 'CITY', 'MOBILE', 'PURCHASE DATE', 'BILL NO', 'BILL DATE', 'QTY', 'RATE', 'TOTAL (₹)'];
    const rows = filteredPurchases.map((p, idx) => [
      idx + 1,
      `"${p.supplierName}"`,
      `"${p.city}"`,
      `"${p.mobileNo}"`,
      `"${p.purchaseDate}"`,
      `"${p.billNo}"`,
      `"${p.billDate || ''}"`,
      p.quantity,
      p.rate,
      p.total
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Library_Purchases_${new Date().toISOString().slice(0, 10)}.csv`;
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
          <span className="text-slate-500 text-sm font-medium">Library</span>
          <span className="text-slate-400">/</span>
          <span className="text-indigo-600 text-sm font-semibold">Purchase Books</span>
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
            Purchase Book
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
              placeholder="Search supplier, bill no, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
          <span className="text-xs text-slate-500">
            Showing {filteredPurchases.length} of {purchases.length} Purchase Invoices
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3 text-center w-12">S.NO.</th>
                <th className="py-3 px-4">SUPPLIER NAME</th>
                <th className="py-3 px-3">CITY</th>
                <th className="py-3 px-3">MOBILE NO</th>
                <th className="py-3 px-3">PURCHASE DATE</th>
                <th className="py-3 px-3">BILL NO</th>
                <th className="py-3 px-3 text-center">QUANTITY</th>
                <th className="py-3 px-3 text-right">RATE (₹)</th>
                <th className="py-3 px-4 text-right">TOTAL (₹)</th>
                <th className="py-3 px-3 text-center w-28">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPurchases.length > 0 ? (
                filteredPurchases.map((p, idx) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 text-center font-medium text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{p.supplierName}</td>
                    <td className="py-3 px-3 text-slate-600">{p.city}</td>
                    <td className="py-3 px-3 text-slate-600 font-mono">{p.mobileNo}</td>
                    <td className="py-3 px-3 text-slate-600">{p.purchaseDate}</td>
                    <td className="py-3 px-3">
                      <span className="font-mono text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded text-[11px]">
                        {p.billNo}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-700">{p.quantity}</td>
                    <td className="py-3 px-3 text-right text-slate-600">₹{p.rate}</td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-700">₹{p.total.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setViewInvoice(p)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="View Invoice"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
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
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    No purchase records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Purchase Book */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50 sticky top-0 z-10">
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                Purchase Book Master - Record Purchase Invoice
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePurchase} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Supplier Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.supplierName}
                    onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile No</label>
                  <input
                    type="text"
                    value={formData.mobileNo}
                    onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Purchase Date</label>
                  <input
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Bill / Invoice No <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.billNo}
                    onChange={(e) => setFormData({ ...formData, billNo: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Bill Date</label>
                  <input
                    type="date"
                    value={formData.billDate}
                    onChange={(e) => setFormData({ ...formData, billDate: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">GST Rate (%)</label>
                  <select
                    value={formData.gstRate}
                    onChange={(e) => setFormData({ ...formData, gstRate: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                  >
                    <option value={0}>0% (Exempt)</option>
                    <option value={5}>5% Standard</option>
                    <option value={12}>12%</option>
                    <option value={18}>18%</option>
                  </select>
                </div>
              </div>

              {/* Items Breakdown Table */}
              <div className="pt-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-slate-700">Book Line Items</span>
                  <button
                    type="button"
                    onClick={addItemRow}
                    className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Another Book
                  </button>
                </div>

                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3">BOOK TITLE</th>
                        <th className="py-2 px-3 w-24">QTY</th>
                        <th className="py-2 px-3 w-28">RATE (₹)</th>
                        <th className="py-2 px-3 w-28 text-right">TOTAL (₹)</th>
                        <th className="py-2 px-2 w-10 text-center"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {formData.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="p-2">
                            <input
                              type="text"
                              placeholder="Enter book title..."
                              value={item.bookTitle}
                              onChange={(e) => handleItemChange(idx, 'bookTitle', e.target.value)}
                              className="w-full px-2 py-1 text-xs rounded border border-slate-300"
                              required
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              min="1"
                              value={item.qty}
                              onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                              className="w-full px-2 py-1 text-xs rounded border border-slate-300"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              min="0"
                              value={item.rate}
                              onChange={(e) => handleItemChange(idx, 'rate', e.target.value)}
                              className="w-full px-2 py-1 text-xs rounded border border-slate-300"
                            />
                          </td>
                          <td className="p-2 text-right font-semibold text-slate-700">
                            ₹{item.amount}
                          </td>
                          <td className="p-2 text-center">
                            {formData.items.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeItemRow(idx)}
                                className="text-rose-500 hover:text-rose-700"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals Summary */}
                <div className="flex justify-end pt-3">
                  <div className="w-64 space-y-1 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div className="flex justify-between">
                      <span>Total Copies:</span>
                      <strong className="text-slate-800">{totalQty}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₹{subTotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST ({formData.gstRate}%):</span>
                      <span>₹{taxAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-indigo-700 pt-1 border-t border-slate-200">
                      <span>Grand Total:</span>
                      <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
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
                  Save Purchase Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Details Dialog */}
      {viewInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 p-6 space-y-4">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Purchase Invoice #{viewInvoice.billNo}</h4>
                <p className="text-[11px] text-slate-400">Supplier: {viewInvoice.supplierName} ({viewInvoice.city})</p>
              </div>
              <button onClick={() => setViewInvoice(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Purchase Date: {viewInvoice.purchaseDate}</span>
                <span>Mobile: {viewInvoice.mobileNo}</span>
              </div>
              <div className="border border-slate-200 rounded overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 text-slate-700">
                    <tr>
                      <th className="p-2 text-left">Item</th>
                      <th className="p-2 text-center">Qty</th>
                      <th className="p-2 text-right">Rate</th>
                      <th className="p-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {viewInvoice.items?.map((it, i) => (
                      <tr key={i}>
                        <td className="p-2">{it.bookTitle}</td>
                        <td className="p-2 text-center">{it.qty}</td>
                        <td className="p-2 text-right">₹{it.rate}</td>
                        <td className="p-2 text-right">₹{it.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between font-bold text-slate-800 pt-2 text-sm">
                <span>Total Amount:</span>
                <span className="text-emerald-700">₹{viewInvoice.total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default PurchaseBooksPage;
