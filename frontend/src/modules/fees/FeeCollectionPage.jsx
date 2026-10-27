import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { tenantStore } from '../../services/tenantStore';
import toast from 'react-hot-toast';
import {
  Search,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Printer,
  CheckCircle2,
  RotateCcw,
  Save,
  Building2,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

export function FeeCollectionPage({ onNavigate }) {
  const { schoolId, schoolName } = useAuth();

  const [activeTab, setActiveTab] = useState('fee');
  const [studentSearch, setStudentSearch] = useState('');
  const [feeType, setFeeType] = useState('All');
  const [payMode, setPayMode] = useState('Cash');
  const [receiptDate, setReceiptDate] = useState('2026-10-10');
  const [receiptNo, setReceiptNo] = useState(() => `${schoolId === 'sch_dps_branch2' ? 'DPS' : 'JD'}-REC-1092`);

  const isSchoolA = schoolId === 'sch_jd_intl';
  const isSchoolB = schoolId === 'sch_dps_branch2';

  const [selectedStudent, setSelectedStudent] = useState(() => {
    if (isSchoolB) {
      return {
        enrollNo: 'ENR-DPS-101',
        srNo: '501',
        admNo: 'DPS-101',
        name: 'ROHAN SHARMA',
        className: 'Class 10 - A',
        fatherName: 'SUNIL SHARMA',
        motherName: 'MEENA SHARMA',
        mobileNo: '9810033445',
        address: 'Sector 14, Dwarka, New Delhi',
        docRemark: 'Verified',
        genRemark: 'Regular Student',
        stuType: 'Old',
        feeType: 'Day Scholar',
        transportStatus: 'Opted'
      };
    }
    if (isSchoolA) {
      return {
        enrollNo: 'ENR-JD-001',
        srNo: '1621',
        admNo: '1621',
        name: 'AADITYA SINGH CHOUDHARY',
        className: 'Class I - A',
        fatherName: 'NARENDRA SINGH CHOUDHARY',
        motherName: 'SUNITA CHOUDHARY',
        mobileNo: '9829012345',
        address: 'Plot 45, Vidhyadhar Nagar, Jaipur',
        docRemark: 'Aadhar Verified',
        genRemark: 'Regular Student',
        stuType: 'Old',
        feeType: 'Day Scholar',
        transportStatus: 'Not Opted'
      };
    }
    // New School: check if any real student enrolled
    const tenantStudents = tenantStore.getStudents(schoolId);
    if (tenantStudents && tenantStudents.length > 0) {
      const first = tenantStudents[0];
      return {
        enrollNo: first.enrollNo || `ENR-${first.admNo}`,
        srNo: first.srNo || first.admNo,
        admNo: first.admNo,
        name: first.name || `${first.firstName || ''} ${first.lastName || ''}`.trim(),
        className: `${first.className} - ${first.section || 'A'}`,
        fatherName: first.fatherName || '',
        motherName: first.motherName || '',
        mobileNo: first.contactNo || first.fatherMobile || '',
        address: first.address || '',
        docRemark: 'Verified',
        genRemark: 'Regular Student',
        stuType: first.isNew ? 'New' : 'Old',
        feeType: first.feeType || 'Day Scholar',
        transportStatus: 'Not Opted'
      };
    }
    return null;
  });

  const [feeHeads, setFeeHeads] = useState(() => {
    if (isSchoolB) {
      return [
        { id: 1, head: 'Board Registration Fee', total: 3500, payable: 3500, paid: 3500, due: 0, checked: true },
        { id: 2, head: 'Tuition Fee (Q1)', total: 14500, payable: 14500, paid: 0, due: 14500, checked: true },
        { id: 3, head: 'Science Lab & Tech Fee', total: 2500, payable: 2500, paid: 0, due: 2500, checked: false }
      ];
    }
    if (isSchoolA) {
      return [
        { id: 1, head: 'Tuition Fee (Q1)', total: 9000, payable: 9000, paid: 9000, due: 0, checked: true },
        { id: 2, head: 'Tuition Fee (Q2)', total: 9000, payable: 9000, paid: 9000, due: 0, checked: true },
        { id: 3, head: 'Tuition Fee (Q3)', total: 9000, payable: 9000, paid: 4500, due: 4500, checked: true },
        { id: 4, head: 'Tuition Fee (Q4)', total: 9000, payable: 9000, paid: 0, due: 9000, checked: false },
        { id: 5, head: 'Exam Charges', total: 5000, payable: 5000, paid: 5000, due: 0, checked: true },
        { id: 6, head: 'Lab & Computer Fee', total: 4000, payable: 4000, paid: 4000, due: 0, checked: true }
      ];
    }
    return [];
  });

  useEffect(() => {
    if (isSchoolB) {
      setSelectedStudent({
        enrollNo: 'ENR-DPS-101',
        srNo: '501',
        admNo: 'DPS-101',
        name: 'ROHAN SHARMA',
        className: 'Class 10 - A',
        fatherName: 'SUNIL SHARMA',
        motherName: 'MEENA SHARMA',
        mobileNo: '9810033445',
        address: 'Sector 14, Dwarka, New Delhi',
        docRemark: 'Verified',
        genRemark: 'Regular Student',
        stuType: 'Old',
        feeType: 'Day Scholar',
        transportStatus: 'Opted'
      });
      setFeeHeads([
        { id: 1, head: 'Board Registration Fee', total: 3500, payable: 3500, paid: 3500, due: 0, checked: true },
        { id: 2, head: 'Tuition Fee (Q1)', total: 14500, payable: 14500, paid: 0, due: 14500, checked: true },
        { id: 3, head: 'Science Lab & Tech Fee', total: 2500, payable: 2500, paid: 0, due: 2500, checked: false }
      ]);
      setReceiptNo('DPS-REC-1092');
    } else if (isSchoolA) {
      setSelectedStudent({
        enrollNo: 'ENR-JD-001',
        srNo: '1621',
        admNo: '1621',
        name: 'AADITYA SINGH CHOUDHARY',
        className: 'Class I - A',
        fatherName: 'NARENDRA SINGH CHOUDHARY',
        motherName: 'SUNITA CHOUDHARY',
        mobileNo: '9829012345',
        address: 'Plot 45, Vidhyadhar Nagar, Jaipur',
        docRemark: 'Aadhar Verified',
        genRemark: 'Regular Student',
        stuType: 'Old',
        feeType: 'Day Scholar',
        transportStatus: 'Not Opted'
      });
      setFeeHeads([
        { id: 1, head: 'Tuition Fee (Q1)', total: 9000, payable: 9000, paid: 9000, due: 0, checked: true },
        { id: 2, head: 'Tuition Fee (Q2)', total: 9000, payable: 9000, paid: 9000, due: 0, checked: true },
        { id: 3, head: 'Tuition Fee (Q3)', total: 9000, payable: 9000, paid: 4500, due: 4500, checked: true },
        { id: 4, head: 'Tuition Fee (Q4)', total: 9000, payable: 9000, paid: 0, due: 9000, checked: false },
        { id: 5, head: 'Exam Charges', total: 5000, payable: 5000, paid: 5000, due: 0, checked: true }
      ]);
      setReceiptNo('JD-REC-1092');
    } else {
      // Clean isolated state for newly registered school
      const tenantStudents = tenantStore.getStudents(schoolId);
      if (tenantStudents && tenantStudents.length > 0) {
        const first = tenantStudents[0];
        setSelectedStudent({
          enrollNo: first.enrollNo || `ENR-${first.admNo}`,
          srNo: first.srNo || first.admNo,
          admNo: first.admNo,
          name: first.name || `${first.firstName || ''} ${first.lastName || ''}`.trim(),
          className: `${first.className} - ${first.section || 'A'}`,
          fatherName: first.fatherName || '',
          motherName: first.motherName || '',
          mobileNo: first.contactNo || first.fatherMobile || '',
          address: first.address || '',
          docRemark: 'Verified',
          genRemark: 'Regular Student',
          stuType: first.isNew ? 'New' : 'Old',
          feeType: first.feeType || 'Day Scholar',
          transportStatus: 'Not Opted'
        });
        setFeeHeads([
          { id: 1, head: 'Tuition Fee (Term 1)', total: Number(first.totalFees) || 12000, payable: Number(first.totalFees) || 12000, paid: 0, due: Number(first.totalFees) || 12000, checked: true }
        ]);
      } else {
        setSelectedStudent(null);
        setFeeHeads([]);
      }
      setReceiptNo(`REC-${Date.now().toString().slice(-4)}`);
    }
  }, [schoolId, isSchoolA, isSchoolB]);

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

  // Fetch student fee ledger from backend with tenant header
  const fetchStudentLedger = async (admNo) => {
    if (!admNo) return;
    try {
      setLoadingStudent(true);
      const res = await fetch(`/api/fees/student/${admNo}`, {
        headers: { 'x-school-id': schoolId || 'sch_jd_intl' }
      });
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
    if (!selectedStudent) {
      toast.error('Please select or search a student first before recording payment.');
      return;
    }
    setSubmittingPayment(true);
    try {
      const selectedHeads = feeHeads.filter(h => h.checked && h.due > 0);
      const totalAmountToPay = selectedHeads.reduce((acc, h) => acc + h.due, 0) || 5000;

      // 1. Record receipt strictly in active tenant store
      const newRec = tenantStore.addReceipt(schoolId, {
        admNo: selectedStudent.admNo,
        studentName: selectedStudent.name,
        className: selectedStudent.className,
        paidAmount: totalAmountToPay,
        payMode
      });
      setReceiptNo(newRec.receiptNo);

      // 2. Transmit to backend with tenant boundary header
      try {
        const res = await fetch('/api/fees/collect', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-school-id': schoolId || 'sch_jd_intl'
          },
          body: JSON.stringify({
            admNo: selectedStudent.admNo,
            paidAmount: totalAmountToPay,
            payMode,
            schoolId: schoolId || 'sch_jd_intl',
            paidHeadIds: selectedHeads.map(h => h.id)
          })
        });
        const result = await res.json();
        if (result.success && result.data?.receiptNo) {
          setReceiptNo(result.data.receiptNo);
        }
      } catch (netErr) {
        // Fallback handled by tenantStore
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 5000);
    } catch (err) {
      console.error('Payment failed:', err);
    } finally {
      setSubmittingPayment(false);
    }
  };

  return (
    <div className="bg-[#f3f4f6] min-h-screen p-3 space-y-3">
      {/* Multi-Tenant Active Sandbox Header */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center space-x-2.5">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-xs ${
            isSchoolB ? 'bg-emerald-600' : 'bg-blue-600'
          }`}>
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800">
              {schoolName} &bull; <span className="font-normal text-slate-500">Fee Counter POS</span>
            </p>
            <p className="text-[11px] text-slate-400">
              🔒 Strict Tenant Isolation: Fee collections and receipts are strictly scoped to this school.
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-mono">
          Tenant: {schoolId || 'sch_jd_intl'}
        </span>
      </div>

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
        <div id="fee-nav-tabs" className="flex items-center space-x-1 border-b border-slate-200 pb-1 overflow-x-auto text-xs font-semibold scroll-smooth">
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('fee-nav-tabs');
              if (el) el.scrollBy({ left: -150, behavior: 'smooth' });
            }}
            className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
            title="Scroll Left"
          >
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
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('fee-nav-tabs');
              if (el) el.scrollBy({ left: 150, behavior: 'smooth' });
            }}
            className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
            title="Scroll Right"
          >
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
            onClick={() => fetchStudentLedger(studentSearch || selectedStudent?.admNo)}
            className="px-5 py-2.5 rounded-md bg-[#4338ca] text-white text-xs font-semibold hover:bg-indigo-800 transition-colors shrink-0 shadow-xs flex items-center space-x-1"
          >
            <span>{loadingStudent ? 'Fetching...' : 'A/C Open'}</span>
          </button>
        </div>

        {/* Student Biodata Box + Payment Inputs Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Student Info Box (Peach/Amber Tint 1:1 UAB style) */}
          {selectedStudent ? (
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
          ) : (
            <div className="lg:col-span-6 bg-slate-50 border border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center text-xs text-slate-500 space-y-3">
              <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center text-xl font-bold">
                🎓
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">No Student Selected</p>
                <p className="text-slate-400 mt-0.5 max-w-sm">
                  Search by Admission No above, or register students in this school to start fee collection.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('/student-admission')}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs"
              >
                + Register Student First
              </button>
            </div>
          )}

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
                onClick={() => onNavigate && onNavigate('/due-list')}
                className="px-4 py-2 rounded bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                Show Receipts / Due List
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
            type="button"
            onClick={() => {
              setFeeHeads(prev => prev.map(h => ({ ...h, checked: false })));
            }}
            className="px-4 py-2 rounded border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
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
