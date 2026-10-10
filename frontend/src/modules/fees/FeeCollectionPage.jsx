import React, { useState } from 'react';
import {
  CreditCard,
  Search,
  IndianRupee,
  Printer,
  CheckCircle2,
  Calendar,
  User,
  Receipt,
  FileCheck,
  AlertCircle
} from 'lucide-react';

export function FeeCollectionPage({ onNavigate }) {
  const [searchAdmNo, setSearchAdmNo] = useState('JD-2026-102');
  const [selectedStudent, setSelectedStudent] = useState({
    admNo: 'JD-2026-102',
    name: 'Ananya Gupta',
    fatherName: 'Sanjay Gupta',
    className: 'Class 10 - Sec A',
    totalAnnualFee: 45000,
    paidSoFar: 40500,
    currentDue: 4500,
    previousDue: 0
  });

  const [collectAmount, setCollectAmount] = useState('4500');
  const [payMode, setPayMode] = useState('Cash'); // Cash, UPI, Cheque, Bank
  const [discount, setDiscount] = useState('0');
  const [remarks, setRemarks] = useState('Quarter 4 Tuition Fee');
  const [receiptGenerated, setReceiptGenerated] = useState(null);

  const handleCollect = (e) => {
    e.preventDefault();
    const receipt = {
      receiptNo: 'RCP-2026-' + Math.floor(1000 + Math.random() * 9000),
      date: new Date().toLocaleDateString('en-IN'),
      student: selectedStudent,
      paid: collectAmount,
      mode: payMode,
      discount: discount,
      remarks: remarks
    };
    setReceiptGenerated(receipt);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Fee Counter
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <span>Fee Collection (POS Counter)</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
              Live Counter
            </span>
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onNavigate && onNavigate('/fee-structure')}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs"
          >
            <span>View Fee Structure</span>
          </button>
        </div>
      </div>

      {receiptGenerated && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
            <div>
              <div className="font-bold text-sm">
                Fee Receipt Generated Successfully! (#{receiptGenerated.receiptNo})
              </div>
              <div className="text-xs text-emerald-700">
                Received ₹ {receiptGenerated.paid} for {receiptGenerated.student.name} via {receiptGenerated.mode}.
              </div>
            </div>
          </div>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
        </div>
      )}

      {/* Counter Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Search & Student Dues Breakup */}
        <div className="lg:col-span-2 space-y-5">
          {/* Student Search Box */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex items-center space-x-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchAdmNo}
                onChange={(e) => setSearchAdmNo(e.target.value)}
                placeholder="Enter Student Admission No (e.g. JD-2026-102)..."
                className="w-full text-xs rounded-lg border border-slate-200 pl-9 pr-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono"
              />
            </div>
            <button className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-black text-white text-xs font-semibold shadow-xs">
              Search Dues
            </button>
          </div>

          {/* Student Summary Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-sm">
                  👧
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{selectedStudent.name}</h3>
                  <div className="text-xs text-slate-500 font-medium">
                    Adm: <span className="font-mono text-slate-800">{selectedStudent.admNo}</span> &bull; {selectedStudent.className}
                  </div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
                Due: ₹ {selectedStudent.currentDue.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Dues Breakup Table */}
            <div className="mt-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Fee Ledger & Installment Heads
              </h4>
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold text-[10px] bg-slate-50/50">
                    <th className="py-2 px-3">Fee Head</th>
                    <th className="py-2 px-3">Total Amount</th>
                    <th className="py-2 px-3">Paid Amount</th>
                    <th className="py-2 px-3 text-right">Pending Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">Tuition Fee (Q4)</td>
                    <td className="py-2.5 px-3 font-mono">₹ 25,000</td>
                    <td className="py-2.5 px-3 font-mono text-emerald-600">₹ 22,000</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-rose-600 text-right">₹ 3,000</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">Exam & Lab Charges</td>
                    <td className="py-2.5 px-3 font-mono">₹ 10,000</td>
                    <td className="py-2.5 px-3 font-mono text-emerald-600">₹ 8,500</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-rose-600 text-right">₹ 1,500</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">Annual Activity Fee</td>
                    <td className="py-2.5 px-3 font-mono">₹ 10,000</td>
                    <td className="py-2.5 px-3 font-mono text-emerald-600">₹ 10,000</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-400 text-right">₹ 0</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Payment Collection Box */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs h-fit space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
            <IndianRupee className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-sm text-slate-900">Receive Payment</h3>
          </div>

          <form onSubmit={handleCollect} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Collecting Amount (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                value={collectAmount}
                onChange={(e) => setCollectAmount(e.target.value)}
                className="w-full text-base font-extrabold text-emerald-900 rounded-lg border border-slate-200 px-3 py-2 bg-emerald-50/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Payment Mode <span className="text-rose-500">*</span>
              </label>
              <select
                value={payMode}
                onChange={(e) => setPayMode(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white font-semibold"
              >
                <option value="Cash">Cash Counter</option>
                <option value="UPI">UPI / QR Code</option>
                <option value="Bank">Bank Transfer / NEFT</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Concession / Discount (₹)
              </label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Receipt Remarks
              </label>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-xs transition-colors flex items-center justify-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Collect ₹ {collectAmount} & Generate Receipt</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
