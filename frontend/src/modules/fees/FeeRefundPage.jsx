import React, { useState, useEffect } from 'react';
import { Search, Ban, Download, Printer, ShieldAlert, CheckCircle, X, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export function FeeRefundPage() {
  const [receipts, setReceipts] = useState([
    {
      id: 'rec_1',
      receiptNo: 'JD-REC-001',
      admNo: '1621',
      studentName: 'AADITYA SINGH CHOUDHARY',
      className: 'Class I-A',
      fatherName: 'NARENDRA SINGH CHOUDHARY',
      paidAmount: 17000,
      payMode: 'UPI',
      date: '2026-04-10',
      status: 'SUCCESS',
      remarks: 'Quarter 1 Tuition & Admission Fee'
    },
    {
      id: 'rec_2',
      receiptNo: 'JD-REC-002',
      admNo: '2059',
      studentName: 'AADHYA CHOUDHARY',
      className: 'Nursery - PP3+-A',
      fatherName: 'RAMESH CHOUDHARY',
      paidAmount: 13500,
      payMode: 'Cash',
      date: '2026-04-12',
      status: 'SUCCESS',
      remarks: 'Admission & Term 1 Tuition'
    },
    {
      id: 'rec_3',
      receiptNo: 'JD-REC-003',
      admNo: '2060',
      studentName: 'ROHAN SHARMA',
      className: 'X-A',
      fatherName: 'MUKESH SHARMA',
      paidAmount: 15000,
      payMode: 'Bank Transfer',
      date: '2026-05-02',
      status: 'SUCCESS',
      remarks: 'Quarter 1 Tuition Fee'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [cancellingReceipt, setCancellingReceipt] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchReceipts();
  }, []);

  const fetchReceipts = async () => {
    try {
      const res = await fetch('/api/fees/receipts');
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        setReceipts(data.data);
      }
    } catch {
      // Keep defaults
    }
  };

  const handleConfirmCancel = async () => {
    if (!cancellingReceipt) return;
    if (!cancelReason.trim()) {
      toast.error('Please specify reason for cancellation');
      return;
    }

    setIsLoading(true);
    try {
      await fetch('/api/fees/cancel-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiptNo: cancellingReceipt.receiptNo,
          reason: cancelReason.trim()
        })
      });

      setReceipts(prev => prev.map(r =>
        r.receiptNo === cancellingReceipt.receiptNo
          ? { ...r, status: 'CANCELLED', cancelReason: cancelReason.trim() }
          : r
      ));

      toast.success(`Receipt ${cancellingReceipt.receiptNo} has been CANCELLED`);
      setCancellingReceipt(null);
      setCancelReason('');
    } catch {
      toast.error('Failed to cancel receipt');
    } finally {
      setIsLoading(false);
    }
  };

  const exportExcel = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["S.No.,Receipt No,Date,Adm No,Student Name,Class,Amount,Pay Mode,Status,Reason"].concat(
        receipts.map((r, i) => `${i + 1},"${r.receiptNo}","${r.date}","${r.admNo}","${r.studentName}","${r.className}",₹${r.paidAmount},"${r.payMode}","${r.status}","${r.cancelReason || r.remarks || ''}"`)
      ).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Cancelled_Fee_Receipts.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Exported to CSV');
  };

  const filtered = receipts.filter(r =>
    r.receiptNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.admNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* 1:1 Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Ban className="w-6 h-6 text-rose-600" />
            Cancel Fee Receipt
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Fees &bull; <span className="text-rose-600 font-medium">Receipt Cancellation & Audit Register</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
          >
            <Printer className="w-4 h-4" />
            Print Register
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by receipt no, student name, or adm no..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Total Receipts: <span className="font-bold text-slate-800">{filtered.length}</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-500 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6 w-16">S.NO.</th>
                <th className="py-3.5 px-6 w-32">RECEIPT NO.</th>
                <th className="py-3.5 px-6 w-28">DATE</th>
                <th className="py-3.5 px-6 w-24">ADM.NO.</th>
                <th className="py-3.5 px-6">STUDENT NAME</th>
                <th className="py-3.5 px-6 w-28">CLASS</th>
                <th className="py-3.5 px-6 w-28">AMOUNT</th>
                <th className="py-3.5 px-6 w-24">PAY MODE</th>
                <th className="py-3.5 px-6 w-28">STATUS</th>
                <th className="py-3.5 px-6 w-28 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((r, idx) => (
                <tr key={r.id || r.receiptNo} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-6 font-medium text-slate-800">{idx + 1}</td>
                  <td className="py-3.5 px-6 font-mono font-bold text-slate-900">{r.receiptNo}</td>
                  <td className="py-3.5 px-6 text-slate-500">{r.date}</td>
                  <td className="py-3.5 px-6 font-mono text-indigo-600">{r.admNo}</td>
                  <td className="py-3.5 px-6 font-semibold text-slate-900">{r.studentName}</td>
                  <td className="py-3.5 px-6 text-slate-600">{r.className}</td>
                  <td className="py-3.5 px-6 font-extrabold text-slate-900">₹{r.paidAmount?.toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-6 text-slate-600">{r.payMode}</td>
                  <td className="py-3.5 px-6">
                    {r.status === 'CANCELLED' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full">
                        <AlertTriangle className="w-3 h-3" /> CANCELLED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                        <CheckCircle className="w-3 h-3" /> VALID
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    {r.status === 'CANCELLED' ? (
                      <span className="text-[11px] text-slate-400 italic">Cancelled</span>
                    ) : (
                      <button
                        onClick={() => setCancellingReceipt(r)}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-lg text-xs transition"
                      >
                        <Ban className="w-3.5 h-3.5" /> Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="10" className="py-12 text-center text-slate-400">
                    No receipts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {cancellingReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-rose-100 flex items-center justify-between bg-rose-50">
              <h3 className="font-bold text-rose-900 text-sm flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                Cancel Fee Receipt
              </h3>
              <button
                onClick={() => setCancellingReceipt(null)}
                className="text-slate-400 hover:text-slate-600 rounded-lg p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Receipt No:</span>
                  <span className="font-bold text-slate-900">{cancellingReceipt.receiptNo}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Student:</span>
                  <span className="font-medium text-slate-800">{cancellingReceipt.studentName}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Amount:</span>
                  <span className="font-extrabold text-rose-600">₹{cancellingReceipt.paidAmount?.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reason for Cancellation *
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="e.g. Incorrect bank entry / Cheque bounced / Double collection"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-rose-500/20"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCancellingReceipt(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCancel}
                  disabled={isLoading}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
                >
                  {isLoading ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
