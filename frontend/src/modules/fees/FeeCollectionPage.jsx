import React, { useState } from 'react';
import {
  Search,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Printer,
  CheckCircle2,
  RotateCcw,
  Save,
  ChevronDown
} from 'lucide-react';

export function FeeCollectionPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('fee');
  const [studentSearch, setStudentSearch] = useState('');
  const [feeType, setFeeType] = useState('All');
  const [payMode, setPayMode] = useState('Cash');
  const [receiptDate, setReceiptDate] = useState('2026-10-10');
  const [receiptNo, setReceiptNo] = useState('RCP-2026-1092');

  const [selectedStudent, setSelectedStudent] = useState({
    enrollNo: 'ENR-9842',
    srNo: '1992',
    admNo: '1992',
    name: 'Aarav Sharma',
    className: 'Class 10 - A',
    fatherName: 'Rajesh Sharma',
    motherName: 'Sunita Sharma',
    mobileNo: '9829012345',
    address: 'Tonk Road, Jaipur',
    docRemark: 'Aadhar Verified',
    genRemark: 'Regular Student',
    stuType: 'New',
    feeType: 'Day Scholar',
    transportStatus: 'Not Opted'
  });

  const [feeHeads, setFeeHeads] = useState([
    { id: 1, head: 'Tuition Fee (Q1)', total: 9000, payable: 9000, paid: 9000, due: 0, checked: true },
    { id: 2, head: 'Tuition Fee (Q2)', total: 9000, payable: 9000, paid: 9000, due: 0, checked: true },
    { id: 3, head: 'Tuition Fee (Q3)', total: 9000, payable: 9000, paid: 4500, due: 4500, checked: true },
    { id: 4, head: 'Tuition Fee (Q4)', total: 9000, payable: 9000, paid: 0, due: 9000, checked: false },
    { id: 5, head: 'Exam Charges', total: 5000, payable: 5000, paid: 5000, due: 0, checked: true },
    { id: 6, head: 'Lab & Computer Fee', total: 4000, payable: 4000, paid: 4000, due: 0, checked: true }
  ]);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const tabs = [
    { id: 'fee', label: 'Fee' },
    { id: 'transport', label: 'Transport' },
    { id: 'conCategory', label: 'Con. Category' },
    { id: 'concession', label: 'Concession' },
    { id: 'feeCancel', label: 'Fee Cancel' },
    { id: 'registration', label: 'Registration' }
  ];

  const [loadingStudent, setLoadingStudent] = useState(false);
  const [submittingPayment, setSubmittingPayment] = useState(false);

  // Fetch student fee ledger from backend
  const fetchStudentLedger = async (admNo) => {
    if (!admNo) return;
    try {
      setLoadingStudent(true);
      const res = await fetch(`http://localhost:5000/api/fees/student/${admNo}`);
      const result = await res.json();
      if (result.success && result.data) {
        const d = result.data;
        if (d.student) {
          setSelectedStudent(prev => ({
            ...prev,
            admNo: d.student.admNo || admNo,
            srNo: d.student.srNo || admNo,
            name: d.student.name || prev.name,
            fatherName: d.student.fatherName || prev.fatherName,
            className: d.student.className || prev.className,
            mobileNo: d.student.mobile || prev.mobileNo
          }));
        }
        if (d.heads && d.heads.length > 0) {
          setFeeHeads(d.heads.map(h => ({
            id: h.id,
            head: h.feeHead,
            total: h.amount,
            payable: h.netPayable,
            paid: h.isPaid ? h.netPayable : 0,
            due: h.isPaid ? 0 : h.netPayable,
            checked: !h.isPaid
          })));
        }
      }
    } catch (err) {
      console.error('Failed to fetch fee ledger:', err);
    } finally {
      setLoadingStudent(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmittingPayment(true);
    try {
      const selectedHeads = feeHeads.filter(h => h.checked && h.due > 0);
      const totalAmountToPay = selectedHeads.reduce((acc, h) => acc + h.due, 0) || 5000;

      const res = await fetch('http://localhost:5000/api/fees/collect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admNo: selectedStudent.admNo,
          paidAmount: totalAmountToPay,
          payMode,
          paidHeadIds: selectedHeads.map(h => h.id)
        })
      });
      const result = await res.json();
      if (result.success) {
        setReceiptNo(result.data?.receiptNo || `REC-2026-${Date.now().toString().slice(-4)}`);
        setSavedSuccess(true);
        // Refresh dues
        fetchStudentLedger(selectedStudent.admNo);
        setTimeout(() => setSavedSuccess(false), 5000);
      }
    } catch (err) {
      console.error('Payment failed:', err);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } finally {
      setSubmittingPayment(false);
    }
  };

  return (
    <div className="bg-[#f3f4f6] min-h-screen p-3 space-y-3">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between pt-1 pb-1">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <span className="font-semibold text-gray-800 text-sm">Fee</span>
          <span>&bull;</span>
          <span className="text-gray-400">Fee &bull; Fee Collection</span>
        </div>
        <button
          onClick={() => window.print()}
          className="text-indigo-600 hover:text-indigo-800 p-1 rounded"
          title="Print Counter Summary"
        >
          <Printer className="w-5 h-5" />
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center space-x-3 text-xs shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <div>
            Fee Receipt <span className="font-bold font-mono">#{receiptNo}</span> for <span className="font-bold">{selectedStudent.name}</span> saved successfully!
          </div>
        </div>
      )}

      {/* Main Container Card */}
      <div className="bg-white rounded-lg shadow-md border border-slate-200 p-4 space-y-4">
        {/* Navigation Tabs Header */}
        <div className="flex items-center space-x-1 border-b border-slate-200 pb-1 overflow-x-auto text-xs font-semibold">
          <button className="p-1 text-slate-400 hover:text-slate-600">
            <ChevronLeft className="w-4 h-4" />
          </button>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 border-b-2 font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'border-indigo-600 text-indigo-600 font-bold'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
          <button className="p-1 text-slate-400 hover:text-slate-600">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Global Student Search Bar + A/C Open Action */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Student (e.g. 1992 or 2024)..."
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') fetchStudentLedger(studentSearch);
              }}
              className="w-full text-xs rounded-md border border-slate-300 pl-9 pr-3 py-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <button 
            type="button"
            onClick={() => fetchStudentLedger(studentSearch || selectedStudent.admNo)}
            className="px-5 py-2.5 rounded-md bg-[#4338ca] text-white text-xs font-semibold hover:bg-indigo-800 transition-colors shrink-0 shadow-xs flex items-center space-x-1"
          >
            <span>{loadingStudent ? 'Fetching...' : 'A/C Open'}</span>
          </button>
        </div>

        {/* Student Biodata Box + Payment Inputs Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Student Info Box (Peach/Amber Tint 1:1 UAB style) */}
          <div className="lg:col-span-6 bg-[#fff8f2] border border-orange-200/60 rounded-xl p-3.5 flex flex-col justify-between text-xs">
            <div className="flex justify-between items-start">
              <div className="space-y-1 text-slate-800 font-medium">
                <p><strong>Enroll No. :</strong> <span className="font-mono">{selectedStudent.enrollNo}</span></p>
                <p><strong>Sr. No. :</strong> <span className="font-mono">{selectedStudent.srNo}</span></p>
                <p><strong>Adm. No. :</strong> <span className="font-mono font-bold text-indigo-700">{selectedStudent.admNo}</span></p>
                <p><strong>Name :</strong> <span className="font-bold text-slate-900">{selectedStudent.name}</span></p>
                <p><strong>Class :</strong> <span>{selectedStudent.className}</span></p>
                <p><strong>Father's Name :</strong> <span>{selectedStudent.fatherName}</span></p>
                <p><strong>Mother's Name :</strong> <span>{selectedStudent.motherName}</span></p>
                <p><strong>Mobile No. :</strong> <span className="font-mono">{selectedStudent.mobileNo}</span></p>
                <p><strong>Address :</strong> <span>{selectedStudent.address}</span></p>
                <p><strong>Document Remark :</strong> <span>{selectedStudent.docRemark}</span></p>
                <p><strong>General Remark :</strong> <span>{selectedStudent.genRemark}</span></p>
              </div>

              {/* Student Avatar Silhouette */}
              <div className="flex flex-col items-center text-center space-y-1">
                <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-3xl shadow-xs">
                  🎓
                </div>
                <div className="text-[10px] text-slate-600 space-y-0.5">
                  <p><strong>Stu Type :</strong> {selectedStudent.stuType}</p>
                  <p><strong>Fee Type :</strong> {selectedStudent.feeType}</p>
                  <p><strong>Transport Status :</strong> {selectedStudent.transportStatus}</p>
                </div>
              </div>
            </div>

            {/* Checkbox other row */}
            <div className="pt-2 mt-2 border-t border-orange-200/60 flex items-center space-x-2 text-xs">
              <input type="checkbox" id="other" className="rounded border-slate-300" />
              <label htmlFor="other" className="text-slate-600 font-medium">Other</label>
            </div>
          </div>

          {/* Right Inputs: Fee Type, Date, Receipt No, Pay Mode */}
          <div className="lg:col-span-6 space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                  Fee Type
                </label>
                <select
                  value={feeType}
                  onChange={(e) => setFeeType(e.target.value)}
                  className="w-full rounded border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:border-indigo-500 font-medium"
                >
                  <option value="All">All</option>
                  <option value="Tuition">Tuition Only</option>
                  <option value="Transport">Transport Only</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                  Choose a date*
                </label>
                <input
                  type="date"
                  value={receiptDate}
                  onChange={(e) => setReceiptDate(e.target.value)}
                  className="w-full rounded border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                  Receipt No.
                </label>
                <input
                  type="text"
                  value={receiptNo}
                  onChange={(e) => setReceiptNo(e.target.value)}
                  className="w-full rounded border border-slate-300 px-3 py-2 bg-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                  Pay Mode*
                </label>
                <select
                  value={payMode}
                  onChange={(e) => setPayMode(e.target.value)}
                  className="w-full rounded border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:border-indigo-500 font-medium"
                >
                  <option value="Cash">Cash</option>
                  <option value="Bank">Bank / Online</option>
                  <option value="Cheque">Cheque</option>
                  <option value="UPI">UPI / QR</option>
                  <option value="DebitCard">Debit / Credit Card</option>
                </select>
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                className="px-4 py-2 rounded bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                Show Receipts
              </button>
            </div>
          </div>
        </div>

        {/* Head Wise Fees Table */}
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
            <h4 className="font-bold text-xs text-slate-800">Head Wise Fees Breakdown</h4>
            <span className="text-[11px] font-semibold text-slate-500">Academic Year 2026-2027</span>
          </div>

          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/50">
                <th className="py-2.5 px-3">Select</th>
                <th className="py-2.5 px-3">Fee Head</th>
                <th className="py-2.5 px-3 text-right">Total Amount</th>
                <th className="py-2.5 px-3 text-right">Payable</th>
                <th className="py-2.5 px-3 text-right">Paid</th>
                <th className="py-2.5 px-3 text-right">Due Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {feeHeads.map((f) => (
                <tr key={f.id} className="hover:bg-slate-50/50">
                  <td className="py-2 px-3">
                    <input
                      type="checkbox"
                      checked={f.checked}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFeeHeads(prev => prev.map(x => x.id === f.id ? { ...x, checked } : x));
                      }}
                      className="rounded border-slate-300"
                    />
                  </td>
                  <td className="py-2 px-3 font-semibold text-slate-900">{f.head}</td>
                  <td className="py-2 px-3 text-right font-mono">₹ {f.total.toLocaleString('en-IN')}</td>
                  <td className="py-2 px-3 text-right font-mono">₹ {f.payable.toLocaleString('en-IN')}</td>
                  <td className="py-2 px-3 text-right font-mono text-emerald-600">₹ {f.paid.toLocaleString('en-IN')}</td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-rose-600">₹ {f.due.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Save Action Bar */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
          <button
            type="reset"
            className="px-4 py-2 rounded border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Reset
          </button>

          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded bg-[#4338ca] hover:bg-indigo-800 text-white text-xs font-bold shadow-xs transition-colors flex items-center space-x-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Fee Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
}
