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
  Eye,
  Building,
  DollarSign
} from 'lucide-react';
import toast from 'react-hot-toast';

const INITIAL_PURCHASES = [];

export function PurchaseItemsPage({ onNavigate }) {
  const [purchases, setPurchases] = useState(INITIAL_PURCHASES);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewInvoice, setViewInvoice] = useState(null);

  const [formData, setFormData] = useState({
    supplierName: 'Maheshwari Garments',
    mobileNo: '9414055667',
    discount: 0,
    paidAmt: 15000,
    items: [
      { itemCode: 'BC-TSH-024', itemName: 'T Shirt- Y (24)', qty: 50, rate: 300, gst: 0, total: 15000 }
    ]
  });

  useEffect(() => {
    fetch('/api/stationary/purchases')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.length) setPurchases(data.data);
      })
      .catch(() => {});
  }, []);

  const openAddModal = () => {
    setFormData({
      supplierName: 'Maheshwari Garments',
      mobileNo: '9414055667',
      discount: 0,
      paidAmt: 15000,
      items: [
        { itemCode: 'BC-TSH-024', itemName: 'T Shirt- Y (24)', qty: 50, rate: 300, gst: 0, total: 15000 }
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
      updated[index].total = q * r;
    }
    setFormData({ ...formData, items: updated });
  };

  const addItemRow = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        { itemCode: `BC-${Date.now().toString().slice(-4)}`, itemName: '', qty: 10, rate: 100, gst: 0, total: 1000 }
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

  const grossTotal = formData.items.reduce((s, it) => s + (Number(it.total) || 0), 0);
  const netPayable = Math.max(0, grossTotal - Number(formData.discount));

  const handleSavePurchase = (e) => {
    e.preventDefault();
    if (!formData.supplierName) {
      toast.error('Supplier is required');
      return;
    }

    const newPurchase = {
      id: String(Date.now()),
      supplierName: formData.supplierName,
      mobileNo: formData.mobileNo,
      noOfItem: formData.items.length,
      totalCost: grossTotal,
      paidAmt: Number(formData.paidAmt),
      discount: Number(formData.discount),
      purchaseDate: new Date().toISOString().slice(0, 10),
      items: formData.items
    };

    setPurchases(prev => [newPurchase, ...prev]);
    toast.success('Purchase recorded and inventory updated');
    setIsModalOpen(false);

    fetch('/api/stationary/purchases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPurchase)
    }).catch(() => {});
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this purchase bill?')) {
      setPurchases(prev => prev.filter(p => p.id !== id));
      toast.success('Purchase bill removed');
      fetch(`/api/stationary/purchases/${id}`, { method: 'DELETE' }).catch(() => {});
    }
  };

  const filteredPurchases = purchases.filter(p =>
    p.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.mobileNo.includes(searchQuery)
  );

  const exportCSV = () => {
    const headers = ['S.NO.', 'SUPPLIER NAME', 'NO OF ITEM', 'TOTAL COST', 'PAID AMT', 'DISCOUNT', 'PURCHASE DATE'];
    const rows = filteredPurchases.map((p, idx) => [
      idx + 1,
      `"${p.supplierName}"`,
      p.noOfItem,
      p.totalCost,
      p.paidAmt,
      p.discount,
      `"${p.purchaseDate}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Stationary_Purchases_${new Date().toISOString().slice(0, 10)}.csv`;
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
          <span className="text-indigo-600 text-sm font-semibold">Purchase Items</span>
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
            Add Purchase
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
              placeholder="Search supplier, mobile..."
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
                <th className="py-3 px-4 text-center w-16">S.NO.</th>
                <th className="py-3 px-4">SUPPLIER NAME</th>
                <th className="py-3 px-4 text-center">NO OF ITEM</th>
                <th className="py-3 px-4 text-right">TOTAL COST</th>
                <th className="py-3 px-4 text-right">PAID AMT</th>
                <th className="py-3 px-4 text-right">DISCOUNT</th>
                <th className="py-3 px-4 text-center w-28">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPurchases.length > 0 ? (
                filteredPurchases.map((p, idx) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-center font-medium text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{p.supplierName}</div>
                      <div className="text-[11px] text-slate-400">{p.mobileNo} • {p.purchaseDate}</div>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-700">{p.noOfItem}</td>
                    <td className="py-3 px-4 text-right font-medium text-slate-800">₹{p.totalCost.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-700">₹{p.paidAmt.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4 text-right text-slate-500">₹{p.discount}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setViewInvoice(p)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="View Items"
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
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No purchase records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: PURCHASE ITEMS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50 sticky top-0 z-10">
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <Package className="w-4 h-4 text-indigo-600" />
                PURCHASE ITEMS
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePurchase} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Supplier <span className="text-rose-500">*</span></label>
                  <select
                    value={formData.supplierName}
                    onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                  >
                    <option value="Maheshwari Garments">Maheshwari Garments</option>
                    <option value="Rajasthan Stationery Mart">Rajasthan Stationery Mart</option>
                    <option value="Prabhat Paper Mills">Prabhat Paper Mills</option>
                  </select>
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

              {/* Items Breakdown Table */}
              <div className="pt-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-slate-700">Purchased Items Breakdown</span>
                  <button
                    type="button"
                    onClick={addItemRow}
                    className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Item
                  </button>
                </div>

                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-2 text-center w-10">S.NO</th>
                        <th className="py-2 px-2 w-24">ITEM CODE</th>
                        <th className="py-2 px-3">ITEM NAME</th>
                        <th className="py-2 px-2 w-16">QTY</th>
                        <th className="py-2 px-2 w-20">RATE</th>
                        <th className="py-2 px-2 w-16">GST(%)</th>
                        <th className="py-2 px-3 text-right w-24">TOTAL</th>
                        <th className="py-2 px-1 w-8 text-center"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {formData.items.map((it, idx) => (
                        <tr key={idx}>
                          <td className="p-2 text-center text-slate-400">{idx + 1}</td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={it.itemCode}
                              onChange={(e) => handleItemChange(idx, 'itemCode', e.target.value)}
                              className="w-full px-1.5 py-1 text-xs rounded border border-slate-300 font-mono"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              placeholder="Item Name"
                              value={it.itemName}
                              onChange={(e) => handleItemChange(idx, 'itemName', e.target.value)}
                              className="w-full px-2 py-1 text-xs rounded border border-slate-300"
                              required
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              min="1"
                              value={it.qty}
                              onChange={(e) => handleItemChange(idx, 'qty', Number(e.target.value))}
                              className="w-full px-1.5 py-1 text-xs rounded border border-slate-300"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              min="0"
                              value={it.rate}
                              onChange={(e) => handleItemChange(idx, 'rate', Number(e.target.value))}
                              className="w-full px-1.5 py-1 text-xs rounded border border-slate-300"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              min="0"
                              value={it.gst}
                              onChange={(e) => handleItemChange(idx, 'gst', Number(e.target.value))}
                              className="w-full px-1.5 py-1 text-xs rounded border border-slate-300"
                            />
                          </td>
                          <td className="p-2 text-right font-semibold text-slate-700">
                            ₹{it.total}
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

                {/* Summary Row */}
                <div className="grid grid-cols-3 gap-3 pt-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Discount (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.discount}
                      onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                      className="w-full px-2.5 py-1 text-xs rounded border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Paid Amount (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.paidAmt}
                      onChange={(e) => setFormData({ ...formData, paidAmt: Number(e.target.value) })}
                      className="w-full px-2.5 py-1 text-xs rounded border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Grand Total (₹)</label>
                    <div className="px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 rounded border border-emerald-200">
                      ₹{netPayable}
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
                  Add
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
                <h4 className="font-bold text-slate-800 text-sm">Purchase Bill: {viewInvoice.supplierName}</h4>
                <p className="text-[11px] text-slate-400">Date: {viewInvoice.purchaseDate} • Mobile: {viewInvoice.mobileNo}</p>
              </div>
              <button onClick={() => setViewInvoice(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="border border-slate-200 rounded overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="p-2 text-left">Item Name</th>
                    <th className="p-2 text-center">Qty</th>
                    <th className="p-2 text-right">Rate</th>
                    <th className="p-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {viewInvoice.items?.map((it, i) => (
                    <tr key={i}>
                      <td className="p-2">{it.itemName}</td>
                      <td className="p-2 text-center font-bold">{it.qty}</td>
                      <td className="p-2 text-right">₹{it.rate}</td>
                      <td className="p-2 text-right font-semibold">₹{it.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between font-bold text-slate-800 pt-2 text-sm">
              <span>Total Invoice Cost:</span>
              <span className="text-emerald-700">₹{viewInvoice.totalCost.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default PurchaseItemsPage;
