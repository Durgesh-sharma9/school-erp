import React, { useState } from 'react';
import { Users, Search, IndianRupee, CheckCircle, Printer, Download, CreditCard, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { tenantStore } from '../../services/tenantStore';

export function SiblingFeeCollectionPage() {
  const { schoolId } = useAuth();
  const [searchMobile, setSearchMobile] = useState('');
  const [siblings, setSiblings] = useState([]);

  const [payMode, setPayMode] = useState('UPI');
  const [remarks, setRemarks] = useState('Sibling Joint Payment for Q2');
  const [receiptResult, setReceiptResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchMobile.trim()) {
      toast.error('Enter mobile number or father name');
      return;
    }
    const q = searchMobile.trim().toLowerCase();
    try {
      let foundList = [];
      const res = await fetch(`/api/fees/sibling-lookup?mobile=${encodeURIComponent(searchMobile.trim())}`, {
        headers: { 'x-school-id': schoolId || 'sch_jd_intl' }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        foundList = data.data;
      } else {
        // Dynamic client-side fallback from tenantStore
        const allStudents = tenantStore.getStudents(schoolId) || [];
        foundList = allStudents.filter(s => {
          const mob = String(s.contactNo || s.fatherMobile || s.smsWhatsappNo || '');
          const fat = String(s.fatherName || s.fathers_name || '').toLowerCase();
          return (mob && mob.includes(q)) || (fat && fat.includes(q));
        }).map(s => ({
          admNo: s.admNo,
          srNo: s.srNo || s.admNo,
          name: (s.name || `${s.firstName || ''} ${s.lastName || ''}`).trim() || `Student ${s.admNo}`,
          fatherName: s.fatherName || s.fathers_name || 'Guardian',
          className: `${s.className || 'I'}-${s.section || 'A'}`,
          mobile: s.contactNo || s.fatherMobile || '-',
          dueAmount: Number(s.dueFees || s.totalFees || 10000),
          heads: [
            { id: `h_${s.admNo}_1`, feeHead: 'Tuition Fee (Q1)', amount: 10000, netPayable: 10000, isPaid: false }
          ]
        }));
      }

      if (foundList.length > 0) {
        setSiblings(foundList.map(s => ({
          ...s,
          heads: (s.heads || []).filter(h => !h.isPaid).map(h => ({ ...h, selected: true }))
        })));
        toast.success(`Found ${foundList.length} student(s) with matching details`);
      } else {
        toast.error('No registered students found with this mobile / father name');
      }
    } catch {
      toast.error('Search encountered an issue');
    }
  };

  const toggleHeadSelection = (siblingIndex, headIndex) => {
    setSiblings(prev => {
      const updated = [...prev];
      updated[siblingIndex].heads[headIndex].selected = !updated[siblingIndex].heads[headIndex].selected;
      return updated;
    });
  };

  const calculateTotal = () => {
    let total = 0;
    siblings.forEach(s => {
      s.heads.forEach(h => {
        if (h.selected) total += (h.netPayable || h.amount);
      });
    });
    return total;
  };

  const handleCollectPayment = async () => {
    const totalAmount = calculateTotal();
    if (totalAmount === 0) {
      toast.error('Select at least one fee head to collect');
      return;
    }

    setIsLoading(true);
    try {
      const payments = siblings.map(s => ({
        admNo: s.admNo,
        studentName: s.name,
        className: s.className,
        amount: s.heads.filter(h => h.selected).reduce((sum, h) => sum + (h.netPayable || h.amount), 0),
        paidHeadIds: s.heads.filter(h => h.selected).map(h => h.id)
      })).filter(p => p.amount > 0);

      const res = await fetch('/api/fees/sibling-collect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-school-id': schoolId },
        body: JSON.stringify({
          payments,
          payMode,
          remarks
        })
      });
      const data = await res.json();

      const activeRecNo = data.data?.receiptNo || `SIB-2026-${Date.now().toString().slice(-4)}`;
      // Record receipts in tenantStore
      payments.forEach(p => {
        tenantStore.addReceipt(schoolId, {
          receiptNo: activeRecNo,
          admNo: p.admNo,
          studentName: p.studentName,
          className: p.className,
          paidAmount: p.amount,
          payMode,
          remarks: `Sibling Joint Payment: ${remarks}`,
          date: new Date().toISOString().split('T')[0]
        });
        tenantStore.updateStudentFees(schoolId, p.admNo, p.amount);
      });

      setReceiptResult({
        receiptNo: activeRecNo,
        date: new Date().toLocaleDateString('en-GB'),
        totalAmount,
        payMode,
        remarks,
        siblings: payments
      });

      toast.success('Sibling Joint Fee Receipt Generated!');
    } catch {
      toast.error('Collection failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" />
            Sibling Fee Entry
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Fees &bull; <span className="text-indigo-600 font-medium">Multi-Child Joint Counter Fee Collection</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search Father's Mobile / Name..."
            value={searchMobile}
            onChange={(e) => setSearchMobile(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500/20"
          />
          <button
            onClick={handleSearch}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
          >
            <Search className="w-4 h-4" />
            Find Siblings
          </button>
        </div>
      </div>

      {/* Sibling Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {siblings.map((s, sIdx) => (
          <div key={s.admNo} className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                  Ward #{sIdx + 1} &bull; Adm: {s.admNo}
                </span>
                <h3 className="font-extrabold text-slate-900 text-sm mt-0.5">{s.name}</h3>
                <p className="text-xs text-slate-500">{s.className} &bull; Father: {s.fatherName}</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-100 text-indigo-800 rounded-lg">
                Mobile: {s.mobile}
              </span>
            </div>

            <div className="p-4 space-y-2">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Pending Fee Heads
              </div>
              <div className="space-y-1.5">
                {s.heads.map((h, hIdx) => (
                  <label
                    key={h.id || hIdx}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition cursor-pointer text-xs ${
                      h.selected ? 'bg-indigo-50/60 border-indigo-200 text-indigo-950 font-medium' : 'bg-slate-50/60 border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={h.selected}
                        onChange={() => toggleHeadSelection(sIdx, hIdx)}
                        className="w-4 h-4 text-indigo-600 rounded-sm border-slate-300"
                      />
                      <span>{h.feeHead}</span>
                    </div>
                    <span className="font-bold text-slate-900">₹{(h.netPayable || h.amount)?.toLocaleString('en-IN')}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Combined Payment & Receipt Box */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-indigo-600" />
          Joint Payment Allocation & Final Receipt
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Payment Gateway / Mode
            </label>
            <select
              value={payMode}
              onChange={(e) => setPayMode(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
            >
              <option value="Cash">Cash Counter</option>
              <option value="UPI">UPI / QR Code</option>
              <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
              <option value="Cheque">Bank Cheque</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Receipt Remarks
            </label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Sibling Q2 Fee Joint Receipt"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
            />
          </div>

          <div className="flex flex-col justify-end">
            <button
              onClick={handleCollectPayment}
              disabled={isLoading}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition"
            >
              <IndianRupee className="w-4 h-4" />
              Collect ₹{calculateTotal().toLocaleString('en-IN')}
            </button>
          </div>
        </div>
      </div>

      {/* Joint Printable Receipt Modal */}
      {receiptResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden p-6 space-y-4">
            <div className="text-center border-b border-slate-200 pb-4">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                OFFICIAL SIBLING JOINT FEE RECEIPT
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-2">J D INTERNATIONAL SCHOOL</h2>
              <p className="text-xs text-slate-500">Mahapura, Ajmer Road, Jaipur &bull; Affiliation No: 1730619</p>
              <div className="flex justify-between items-center text-xs mt-3 pt-3 border-t border-dashed border-slate-200">
                <span className="font-mono font-bold text-slate-800">Receipt No: {receiptResult.receiptNo}</span>
                <span className="text-slate-500">Date: {receiptResult.date}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-700">Wards Breakdown:</div>
              {receiptResult.siblings.map((sib, i) => (
                <div key={i} className="flex justify-between p-2.5 bg-slate-50 rounded-xl text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{sib.studentName}</span>
                    <span className="text-slate-500 text-[11px] block">{sib.className} &bull; Adm: {sib.admNo}</span>
                  </div>
                  <span className="font-extrabold text-slate-900">₹{sib.amount.toLocaleString('en-IN')}</span>
                </div>
              ))}

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex justify-between items-center">
                <span className="text-xs font-bold text-emerald-950">Grand Joint Total Paid ({receiptResult.payMode}):</span>
                <span className="text-lg font-black text-emerald-700">₹{receiptResult.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setReceiptResult(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl"
              >
                <Printer className="w-4 h-4" /> Print Joint Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
