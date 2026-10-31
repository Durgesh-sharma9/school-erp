import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  ChevronDown,
  User,
  CreditCard,
  Receipt,
  AlertCircle,
  FileText,
  Clock,
  ArrowRight,
  X,
  PlusCircle,
  Trash2,
  Check,
  DollarSign
} from 'lucide-react';

function numberToIndianWords(num) {
  if (!num || isNaN(num) || num <= 0) return 'Zero Rupees Only';
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const n = ('000000000' + Math.floor(num)).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return '';
  let str = '';
  str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
  str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
  str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
  str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
  str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
  return str.trim() ? `${str.trim()} Rupees Only` : 'Zero Rupees Only';
}

export function FeeCollectionPage({ onNavigate }) {
  const { schoolId, schoolName } = useAuth();
  const schoolProfile = tenantStore.getSchoolProfile(schoolId);

  const [activeTab, setActiveTab] = useState('fee');
  const [studentSearch, setStudentSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [feeType, setFeeType] = useState('All');
  const [payMode, setPayMode] = useState('Cash');
  const [chequeNo, setChequeNo] = useState('');
  const [bankName, setBankName] = useState('');
  const [remarks, setRemarks] = useState('');
  const [receiptDate, setReceiptDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [receiptNo, setReceiptNo] = useState('');

  // Selected student & fee ledger
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [feeHeads, setFeeHeads] = useState([]);
  const [loadingStudent, setLoadingStudent] = useState(false);
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeReceiptModal, setActiveReceiptModal] = useState(null);
  const [receiptCopyType, setReceiptCopyType] = useState("student"); // "student" | "office" | "dual"
  const [cancelModalReceipt, setCancelModalReceipt] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [receiptList, setReceiptList] = useState([]);

  const isSchoolA = schoolId === 'sch_jd_intl';
  const isSchoolB = schoolId === 'sch_dps_branch2';

  // Available students in current tenant with dynamic synchronization
  const [tenantStudents, setTenantStudents] = useState(() => tenantStore.getStudents(schoolId) || []);
  const allTenantStudents = tenantStudents;

  // Filtered students for search typeahead
  const matchedStudents = useMemo(() => {
    if (!studentSearch.trim()) return allTenantStudents.slice(0, 6);
    const q = studentSearch.toLowerCase().trim();
    return allTenantStudents.filter(s => {
      const name = (s.name || `${s.firstName || ''} ${s.lastName || ''}`).toLowerCase();
      const adm = String(s.admNo || '').toLowerCase();
      const sr = String(s.srNo || '').toLowerCase();
      const roll = String(s.rollNo || '').toLowerCase();
      const phone = String(s.contactNo || s.fatherMobile || '');
      return name.includes(q) || adm.includes(q) || sr.includes(q) || roll.includes(q) || phone.includes(q);
    }).slice(0, 8);
  }, [allTenantStudents, studentSearch]);

  // Generate initial or next receipt number
  const generateNextReceiptNo = () => {
    const receipts = tenantStore.getReceipts(schoolId);
    const prefix = schoolProfile?.schoolCode ? schoolProfile.schoolCode.replace(/[^A-Za-z0-9]/g, '').slice(0, 4).toUpperCase() : (isSchoolB ? 'DPS' : isSchoolA ? 'JD' : 'REC');
    return `${prefix || 'REC'}-2026-${String(receipts.length + 1).padStart(3, '0')}`;
  };

  // Refresh receipt history for this tenant
  const refreshReceipts = () => {
    const list = tenantStore.getReceipts(schoolId);
    setReceiptList(list);
  };

  // Initialize Default Student and sync with backend on tenant change
  useEffect(() => {
    refreshReceipts();
    setReceiptNo(generateNextReceiptNo());

    const localStudents = tenantStore.getStudents(schoolId) || [];
    setTenantStudents(localStudents);

    if (localStudents && localStudents.length > 0) {
      loadStudentAccount(localStudents[0]);
    } else {
      setSelectedStudent(null);
      setFeeHeads([]);
    }

    // Sync students from backend /api/students
    fetch('/api/students', {
      headers: { 'x-school-id': schoolId || 'sch_jd_intl' }
    })
      .then(res => res.json())
      .then(res => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          tenantStore.setStudents(schoolId, res.data);
          setTenantStudents(res.data);
          if (!selectedStudent) {
            loadStudentAccount(res.data[0]);
          }
        }
      })
      .catch(() => {});
  }, [schoolId]);

  // Load a student into active counter
  
  // Auto-load pending fee student when routed from student directory
  useEffect(() => {
    const pendingFeeStudent = tenantStore.getPendingFeeStudent();
    if (pendingFeeStudent) {
      setStudentSearch(pendingFeeStudent.admNo || '');
      loadStudentAccount(pendingFeeStudent);
      toast.success('Loaded fee ledger for ' + (pendingFeeStudent.name || pendingFeeStudent.admNo));
    }
  }, []);

  const loadStudentAccount = async (student) => {
    if (!student) return;
    setSavedSuccess(false);
    const admNo = student.admNo;
    const sName = (student.name || `${student.firstName || ''} ${student.lastName || ''}`).trim() || `Student ${admNo}`;
    const sClass = student.className ? (student.className.includes('-') ? student.className : `${student.className} - ${student.section || 'A'}`) : 'Class 1 - A';

    const formattedStudent = {
      enrollNo: student.enrollNo || `ENR-${admNo}`,
      srNo: student.srNo || admNo,
      admNo: admNo,
      name: sName,
      className: sClass,
      fatherName: student.fatherName || student.fathers_name || 'Guardian',
      motherName: student.motherName || '',
      mobileNo: student.contactNo || student.fatherMobile || student.smsWhatsappNo || '',
      address: student.address || '',
      docRemark: 'Verified',
      genRemark: 'Regular Student',
      stuType: student.isNew || student.studentType === 'New' ? 'New' : 'Old',
      feeType: student.feeType || 'Day Scholar',
      transportStatus: student.transportStatus || 'Not Opted'
    };

    setSelectedStudent(formattedStudent);

    // 1. Dynamic fee heads from tenantStore (with multi-tier fallback: ledger -> structure -> concession -> calculated)
    const heads = tenantStore.getStudentFeeHeads(schoolId, admNo);
    if (heads && heads.length > 0) {
      setFeeHeads(heads);
    } else {
      setFeeHeads([]);
    }

    // 2. Background sync with backend
    try {
      setLoadingStudent(true);
      const res = await fetch(`/api/fees/student/${admNo}`, {
        headers: { 'x-school-id': schoolId || 'sch_jd_intl' }
      });
      const result = await res.json();
      if (result.success && result.data?.heads && result.data.heads.length > 0 && (!heads || heads.length === 0)) {
        const synced = result.data.heads.map(h => ({
          id: h.id,
          head: h.feeHead,
          total: h.amount,
          discount: h.discount || 0,
          payable: h.netPayable,
          paid: h.isPaid ? h.netPayable : 0,
          due: h.isPaid ? 0 : h.netPayable,
          payingNow: h.isPaid ? 0 : h.netPayable,
          checked: !h.isPaid
        }));
        setFeeHeads(synced);
        tenantStore.saveStudentFeeHeads(schoolId, admNo, synced);
      }
    } catch (e) {
      // Handled gracefully in offline mode
    } finally {
      setLoadingStudent(false);
    }
  };

  // Perform search
  const handleSearchSubmit = (searchTerm) => {
    const term = (searchTerm || studentSearch).trim();
    if (!term) {
      toast('Please enter an Admission No, Roll No, or Student Name.', { icon: 'ℹ️' });
      return;
    }
    const q = term.toLowerCase();
    const found = allTenantStudents.find(s => {
      const name = (s.name || `${s.firstName || ''} ${s.lastName || ''}`).toLowerCase();
      return (
        String(s.admNo || '').toLowerCase() === q ||
        String(s.srNo || '').toLowerCase() === q ||
        String(s.rollNo || '').toLowerCase() === q ||
        name.includes(q) ||
        String(s.contactNo || s.fatherMobile || '').includes(q)
      );
    });

    if (found) {
      loadStudentAccount(found);
      setSearchFocused(false);
      toast.success(`Account opened for ${found.name || found.firstName}`);
    } else {
      // Query backend directly
      setLoadingStudent(true);
      fetch(`/api/fees/student/${term}`, {
        headers: { 'x-school-id': schoolId || 'sch_jd_intl' }
      })
        .then(res => res.json())
        .then(res => {
          if (res.success && res.data?.student) {
            const d = res.data;
            const stu = {
              admNo: d.student.admNo,
              srNo: d.student.srNo,
              enrollNo: d.student.enrollNo || `ENR-${d.student.admNo}`,
              name: d.student.name,
              className: d.student.className,
              fatherName: d.student.fatherName,
              motherName: d.student.motherName || '',
              mobileNo: d.student.mobile,
              address: d.student.address || '',
              stuType: d.student.stuType || 'Old',
              feeType: d.student.feeType || 'Day Scholar',
              transportStatus: 'Not Opted'
            };
            setSelectedStudent(stu);
            if (d.heads) {
              const mapped = d.heads.map(h => ({
                id: h.id,
                head: h.feeHead,
                total: h.amount,
                discount: h.discount || 0,
                payable: h.netPayable,
                paid: h.isPaid ? h.netPayable : 0,
                due: h.isPaid ? 0 : h.netPayable,
                payingNow: h.isPaid ? 0 : h.netPayable,
                checked: !h.isPaid
              }));
              setFeeHeads(mapped);
              tenantStore.saveStudentFeeHeads(schoolId, d.student.admNo, mapped);
            }
            toast.success(`Account opened for ${d.student.name}`);
          } else {
            toast.error(`Student with "${term}" not found in this school.`);
          }
        })
        .catch(() => {
          toast.error(`No student record found matching "${term}".`);
        })
        .finally(() => {
          setLoadingStudent(false);
          setSearchFocused(false);
        });
    }
  };

  // Toggle head checkbox
  const handleToggleHead = (id) => {
    setFeeHeads(prev => prev.map(h => {
      if (h.id === id) {
        const nextChecked = !h.checked;
        return {
          ...h,
          checked: nextChecked,
          payingNow: nextChecked ? h.due : 0
        };
      }
      return h;
    }));
  };

  // Select all due heads / Clear selection
  const handleSelectAllDue = (select) => {
    setFeeHeads(prev => prev.map(h => ({
      ...h,
      checked: select ? h.due > 0 : false,
      payingNow: select ? h.due : 0
    })));
  };

  // Update payingNow amount for a specific head
  const handlePayingAmountChange = (id, val) => {
    const num = Math.max(0, Number(val) || 0);
    setFeeHeads(prev => prev.map(h => {
      if (h.id === id) {
        const capped = Math.min(num, h.due);
        return {
          ...h,
          payingNow: capped,
          checked: capped > 0
        };
      }
      return h;
    }));
  };

  // Calculations
  const totalAmountOverall = feeHeads.reduce((acc, h) => acc + (Number(h.payable) || 0), 0);
  const totalPaidOverall = feeHeads.reduce((acc, h) => acc + (Number(h.paid) || 0), 0);
  const totalDueOverall = feeHeads.reduce((acc, h) => acc + (Number(h.due) || 0), 0);

  const selectedPayingHeads = feeHeads.filter(h => h.checked && (Number(h.payingNow) > 0 || Number(h.due) > 0));
  const currentTransactionTotal = selectedPayingHeads.reduce((acc, h) => {
    const amt = Number(h.payingNow) > 0 ? Number(h.payingNow) : Number(h.due);
    return acc + amt;
  }, 0);

  // Save Fee Payment & Open Official Receipt
  const handleSavePayment = async (e) => {
    if (e) e.preventDefault();

    if (!selectedStudent) {
      toast.error('Please select or search a student first before recording payment.');
      return;
    }

    if (currentTransactionTotal <= 0) {
      toast.error('Please select at least one fee head with a due balance to collect.');
      return;
    }

    setSubmittingPayment(true);
    try {
      const activeReceiptNo = receiptNo || generateNextReceiptNo();

      // 1. Prepare itemized breakdown
      const receiptItems = selectedPayingHeads.map(h => {
        const payingAmt = Number(h.payingNow) > 0 ? Number(h.payingNow) : Number(h.due);
        return {
          headId: h.id,
          feeHead: h.head,
          total: h.total,
          payable: h.payable,
          amount: payingAmt,
          remainingDue: Math.max(0, h.due - payingAmt)
        };
      });

      // 2. Save in client multi-tenant store
      const newRec = tenantStore.addReceipt(schoolId, {
        receiptNo: activeReceiptNo,
        admNo: selectedStudent.admNo,
        studentName: selectedStudent.name,
        className: selectedStudent.className,
        fatherName: selectedStudent.fatherName,
        rollNo: selectedStudent.srNo || selectedStudent.admNo,
        paidAmount: currentTransactionTotal,
        payMode,
        chequeNo: (payMode === 'Cheque' || payMode === 'Bank' || payMode === 'UPI') ? chequeNo : '',
        bankName: (payMode === 'Cheque' || payMode === 'Bank') ? bankName : '',
        remarks,
        date: receiptDate,
        items: receiptItems,
        words: numberToIndianWords(currentTransactionTotal)
      });

      // 3. Update student fee summary in tenantStore
      tenantStore.updateStudentFees(schoolId, selectedStudent.admNo, currentTransactionTotal);

      // 4. Update head balances in state and tenantStore
      const updatedHeads = feeHeads.map(h => {
        const item = receiptItems.find(it => it.headId === h.id);
        if (item) {
          const newPaid = h.paid + item.amount;
          const newDue = Math.max(0, h.payable - newPaid);
          return {
            ...h,
            paid: newPaid,
            due: newDue,
            payingNow: 0,
            checked: false
          };
        }
        return h;
      });

      setFeeHeads(updatedHeads);
      tenantStore.saveStudentFeeHeads(schoolId, selectedStudent.admNo, updatedHeads);

      // 5. Send to backend
      try {
const res = await fetch('/api/fees/collect', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-school-id': schoolId || 'sch_jd_intl'
          },
          body: JSON.stringify({
            admNo: selectedStudent.admNo,
            studentName: selectedStudent.name,
            className: selectedStudent.className,
            paidAmount: currentTransactionTotal,
            payMode,
            chequeNo,
            bankName,
            remarks,
            schoolId: schoolId || 'sch_jd_intl',
            paidHeadIds: selectedPayingHeads.map(h => h.id)
          })
        });
      } catch (err) {
        // Handled gracefully in offline mode
      }

      // 6. Refresh receipts & next receipt no
      refreshReceipts();
      setReceiptNo(generateNextReceiptNo());

      // 7. Pop up official printable receipt modal!
      setActiveReceiptModal(newRec);
      setSavedSuccess(true);
      toast.success(`Fee Receipt #${newRec.receiptNo} created successfully!`);
    } catch (err) {
      console.error('[Fee Collection Error]:', err);
      toast.error('An error occurred while saving the payment.');
    } finally {
      setSubmittingPayment(false);
    }
  };

  // Receipt cancellation action
  const handleCancelReceipt = () => {
    if (!cancelModalReceipt) return;
    const ok = tenantStore.cancelReceipt(schoolId, cancelModalReceipt.receiptNo, cancelReason || 'Counter Cancellation');
    if (ok) {
      // Revert student balance if needed
      tenantStore.updateStudentFees(schoolId, cancelModalReceipt.admNo, -Number(cancelModalReceipt.paidAmount || 0));
      refreshReceipts();
      toast.success(`Receipt #${cancelModalReceipt.receiptNo} marked as CANCELLED.`);
      setCancelModalReceipt(null);
      setCancelReason('');
    } else {
      toast.error('Failed to cancel receipt.');
    }
  };

  const tabs = [
    { id: 'fee', label: 'Fee Counter POS', icon: DollarSign },
    { id: 'history', label: 'Receipts History', icon: Receipt },
    { id: 'concession', label: 'Concession Policy', icon: FileText },
    { id: 'transport', label: 'Transport Fee', icon: Building2 },
    { id: 'registration', label: 'New Student Admission', icon: User }
  ];

  return (
    <div className="bg-[#f8fafc] min-h-screen p-3 md:p-5 space-y-4 font-sans text-slate-800">
      {/* Multi-Tenant Top Branding Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center space-x-3.5">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white shadow-sm ${
            isSchoolB ? 'bg-gradient-to-br from-emerald-600 to-teal-700' : 'bg-gradient-to-br from-indigo-600 to-blue-700'
          }`}>
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-extrabold text-slate-900 tracking-tight">
                {schoolName || schoolProfile.schoolName || 'School Fee Counter'}
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Live POS
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
              <span>Code: <strong className="font-mono text-slate-700">{schoolProfile.schoolCode || 'SCH-01'}</strong></span>
              <span>&bull;</span>
              <span>Affiliation: <strong className="text-slate-700">{schoolProfile.affiliationNo || 'CBSE 1730619'}</strong></span>
              <span>&bull;</span>
              <span className="text-indigo-600 font-medium">Session 2026-2027</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-start md:self-auto">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-mono flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Tenant: {schoolId || 'sch_jd_intl'}</span>
          </span>
          <button
            type="button"
            onClick={() => {
              if (selectedStudent) {
                const recs = receiptList.filter(r => r.admNo === selectedStudent.admNo);
                if (recs.length > 0) setActiveReceiptModal(recs[0]);
                else toast('No recent receipt on record to print for this student.', { icon: 'ℹ️' });
              }
            }}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 cursor-pointer transition-colors"
            title="Print Last Receipt"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 text-emerald-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm animate-fade-in">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="font-bold text-sm">
                Payment Recorded &bull; Receipt <span className="font-mono text-emerald-700">#{receiptNo}</span>
              </p>
              <p className="text-[11px] text-emerald-700">
                Student: <strong>{selectedStudent?.name}</strong> &bull; Class: <strong>{selectedStudent?.className}</strong> &bull; Mode: <strong>{payMode}</strong>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (selectedStudent) {
                  const recs = receiptList.filter(r => r.admNo === selectedStudent.admNo);
                  if (recs.length > 0) setActiveReceiptModal(recs[0]);
                  else window.print();
                } else {
                  window.print();
                }
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSavedSuccess(false);
                setStudentSearch('');
                toast('POS Ready for next fee collection');
              }}
              className="px-3.5 py-2 bg-white border border-emerald-300 hover:bg-emerald-100/50 text-emerald-800 font-semibold text-xs rounded-xl shadow-2xs cursor-pointer"
            >
              <span>+ Next Collection</span>
            </button>
          </div>
        </div>
      )}

      {/* Navigation Tabs Bar */}
      <div className="bg-white border border-slate-200 rounded-xl px-2 py-1.5 shadow-2xs flex items-center justify-between overflow-x-auto">
        <div className="flex items-center space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  if (tab.id === 'registration') {
                    if (onNavigate) onNavigate('/student-admission');
                    return;
                  }
                  setActiveTab(tab.id);
                }}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.id === 'history' && receiptList.length > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isActive ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-200 text-slate-700'}`}>
                    {receiptList.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-slate-500 pr-2">
          <span>Counter #1</span>
        </div>
      </div>

      {/* TAB 1: MAIN FEE COUNTER POS */}
      {activeTab === 'fee' && (
        <div className="space-y-4">
          {/* Smart Search Bar with Interactive Dropdown Suggestions */}
          <div className="relative z-30">
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center gap-2.5">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-600" />
                <input
                  type="text"
                  placeholder="Search student by Name, Admission No, Roll No, or Mobile Number..."
                  value={studentSearch}
                  onFocus={() => setSearchFocused(true)}
                  onChange={(e) => {
                    setStudentSearch(e.target.value);
                    setSearchFocused(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearchSubmit();
                  }}
                  className="w-full text-xs font-medium rounded-lg border border-slate-300 pl-10 pr-9 py-2.5 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                />
                {studentSearch && (
                  <button
                    type="button"
                    onClick={() => {
                      setStudentSearch('');
                      setSearchFocused(false);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleSearchSubmit()}
                  disabled={loadingStudent}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{loadingStudent ? 'Searching...' : 'A/C Open'}</span>
                </button>

                {/* Quick Switch Dropdown for Students in Current School */}
                <select
                  value={selectedStudent?.admNo || ''}
                  onChange={(e) => {
                    const st = allTenantStudents.find(s => String(s.admNo) === String(e.target.value));
                    if (st) loadStudentAccount(st);
                  }}
                  className="text-xs font-medium rounded-lg border border-slate-300 px-3 py-2.5 bg-white text-slate-700 focus:outline-none focus:border-indigo-600 cursor-pointer"
                >
                  <option value="" disabled>Select from {allTenantStudents.length} Students</option>
                  {allTenantStudents.map(s => (
                    <option key={s.admNo} value={s.admNo}>
                      {s.admNo} - {s.name || `${s.firstName || ''} ${s.lastName || ''}`} ({s.className || 'Class I'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Live Autocomplete Typeahead Dropdown */}
            {searchFocused && matchedStudents.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-40 max-h-72 overflow-y-auto divide-y divide-slate-100">
                <div className="px-3 py-1.5 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider flex justify-between">
                  <span>Matching Students in this School</span>
                  <span className="cursor-pointer text-indigo-600 hover:underline" onClick={() => setSearchFocused(false)}>Close</span>
                </div>
                {matchedStudents.map((st) => (
                  <div
                    key={st.admNo}
                    onClick={() => {
                      loadStudentAccount(st);
                      setStudentSearch('');
                      setSearchFocused(false);
                    }}
                    className="p-3 hover:bg-indigo-50/80 cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                        {st.name ? st.name.charAt(0) : 'S'}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">
                          {st.name || `${st.firstName || ''} ${st.lastName || ''}`}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Adm: <span className="font-mono font-semibold text-indigo-600">{st.admNo}</span> | Class: {st.className || 'I'} | Father: {st.fatherName || 'Guardian'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-rose-600 font-mono">
                        Due: ₹ {(Number(st.dueFees) || 0).toLocaleString('en-IN')}
                      </span>
                      <p className="text-[10px] text-slate-400">Click to Open A/C</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Student Bio Card + KPI Summary Row */}
          {selectedStudent ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left Student Biodata Box */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center text-xl font-bold shadow-xs">
                        🎓
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h2 className="text-sm font-bold text-slate-900">{selectedStudent.name}</h2>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 font-mono">
                            Adm #{selectedStudent.admNo}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">
                          {selectedStudent.className} &bull; Roll: <span className="font-mono">{selectedStudent.srNo}</span>
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
                      {selectedStudent.stuType} Student
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-3 text-xs">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Father's Name</span>
                      <span className="font-semibold text-slate-800">{selectedStudent.fatherName}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">Mother's Name</span>
                      <span className="font-semibold text-slate-800">{selectedStudent.motherName || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">Mobile No.</span>
                      <span className="font-semibold text-slate-800 font-mono">{selectedStudent.mobileNo || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">Fee Type</span>
                      <span className="font-semibold text-slate-800">{selectedStudent.feeType}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">Transport Status</span>
                      <span className="font-semibold text-slate-800">{selectedStudent.transportStatus}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">Enrollment No.</span>
                      <span className="font-mono text-slate-700 font-semibold">{selectedStudent.enrollNo}</span>
                    </div>
                  </div>

                  {selectedStudent.address && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 text-xs text-slate-500">
                      <span className="text-[11px] text-slate-400 font-medium">Address: </span>
                      <span>{selectedStudent.address}</span>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">Academic Year: 2026-2027</span>
                  <button
                    type="button"
                    onClick={() => {
                      const allUnpaid = feeHeads.some(h => h.due > 0 && !h.checked);
                      handleSelectAllDue(allUnpaid);
                    }}
                    className="text-indigo-600 hover:text-indigo-800 font-semibold text-xs cursor-pointer"
                  >
                    Quick Pay All Due Heads
                  </button>
                </div>
              </div>

              {/* Right Payment KPI Stat Cards */}
              <div className="lg:col-span-5 grid grid-cols-2 gap-3">
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Fee</span>
                  <div className="mt-2">
                    <p className="text-xl font-black text-slate-900 font-mono">
                      ₹ {totalAmountOverall.toLocaleString('en-IN')}
                    </p>
                    <span className="text-[10px] text-slate-400">Annual Structure</span>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-emerald-200/80 bg-emerald-50/20 shadow-xs flex flex-col justify-between">
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Paid YTD</span>
                  <div className="mt-2">
                    <p className="text-xl font-black text-emerald-600 font-mono">
                      ₹ {totalPaidOverall.toLocaleString('en-IN')}
                    </p>
                    <span className="text-[10px] text-emerald-600 font-medium">Cleared Receipts</span>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-rose-200/80 bg-rose-50/20 shadow-xs flex flex-col justify-between">
                  <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">Balance Due</span>
                  <div className="mt-2">
                    <p className="text-xl font-black text-rose-600 font-mono">
                      ₹ {totalDueOverall.toLocaleString('en-IN')}
                    </p>
                    <span className="text-[10px] text-rose-600 font-medium">Outstanding</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-3.5 rounded-2xl text-white shadow-xs flex flex-col justify-between">
                  <span className="text-[11px] font-bold text-indigo-200 uppercase tracking-wider">Paying Now</span>
                  <div className="mt-2">
                    <p className="text-xl font-black text-white font-mono">
                      ₹ {currentTransactionTotal.toLocaleString('en-IN')}
                    </p>
                    <span className="text-[10px] text-indigo-200">
                      {selectedPayingHeads.length} Head(s) Selected
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center flex flex-col items-center justify-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center text-2xl">
                🎓
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">No Student Selected</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  Search above by Admission No or select a student from the list to view their fee ledger and collect fees.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('/student-admission')}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors"
              >
                + Register New Student
              </button>
            </div>
          )}

          {/* Payment Parameters & Counter Inputs */}
          {selectedStudent && (
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                  <CreditCard className="w-4 h-4 text-indigo-600" />
                  <span>Payment Details & Counter Configuration</span>
                </h3>
                <span className="text-xs font-mono font-semibold text-slate-600">
                  Receipt: <strong className="text-indigo-600">{receiptNo}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Receipt Date *
                  </label>
                  <input
                    type="date"
                    value={receiptDate}
                    onChange={(e) => setReceiptDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-700 font-medium focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Pay Mode *
                  </label>
                  <select
                    value={payMode}
                    onChange={(e) => setPayMode(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-700 font-bold focus:outline-none focus:border-indigo-600"
                  >
                    <option value="Cash">💵 Cash</option>
                    <option value="UPI">📱 UPI / QR Code</option>
                    <option value="Bank">🏦 Bank Transfer (NEFT/RTGS)</option>
                    <option value="Cheque">📄 Cheque</option>
                    <option value="Card">💳 Debit / Credit Card</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    {payMode === 'Cheque' ? 'Cheque No. *' : payMode === 'UPI' ? 'UPI Ref / UTR No.' : 'Transaction / Ref No.'}
                  </label>
                  <input
                    type="text"
                    placeholder={payMode === 'Cash' ? 'Optional Cash Ref' : 'e.g. UTR12345678'}
                    value={chequeNo}
                    onChange={(e) => setChequeNo(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-700 font-mono focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    {payMode === 'Cheque' ? 'Drawee Bank Name *' : 'Bank / Channel'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SBI, HDFC, PNB"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-700 focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Collection Remarks / Notes
                </label>
                <input
                  type="text"
                  placeholder="Optional remarks (e.g. Quarter 2 Tuition + Sports fee paid by Father in Cash)"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-700 focus:outline-none focus:border-indigo-600 text-xs"
                />
              </div>
            </div>
          )}

          {/* Interactive Head-Wise Fee Ledger Table */}
          {selectedStudent && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                    Head-Wise Fee Ledger Breakdown
                  </h3>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    {feeHeads.length} Fee Heads
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleSelectAllDue(true)}
                    className="px-2.5 py-1 rounded-md bg-white border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 cursor-pointer"
                  >
                    Select All Due
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectAllDue(false)}
                    className="px-2.5 py-1 rounded-md bg-white border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/80">
                      <th className="py-3 px-4 w-12 text-center">Pay</th>
                      <th className="py-3 px-4">Fee Head</th>
                      <th className="py-3 px-4 text-right">Total Amount</th>
                      <th className="py-3 px-4 text-right">Discount</th>
                      <th className="py-3 px-4 text-right">Net Payable</th>
                      <th className="py-3 px-4 text-right">Paid</th>
                      <th className="py-3 px-4 text-right">Due Balance</th>
                      <th className="py-3 px-4 text-right w-44">Paying Now (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {feeHeads.map((f) => {
                      const isFullyPaid = f.due === 0;
                      return (
                        <tr
                          key={f.id}
                          className={`transition-colors ${
                            f.checked ? 'bg-indigo-50/30' : isFullyPaid ? 'bg-slate-50/30 text-slate-400' : 'hover:bg-slate-50/60'
                          }`}
                        >
                          <td className="py-3 px-4 text-center">
                            <input
                              type="checkbox"
                              checked={f.checked}
                              disabled={isFullyPaid}
                              onChange={() => handleToggleHead(f.id)}
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer h-4 w-4"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <span className={`font-bold ${isFullyPaid ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                              {f.head}
                            </span>
                            {isFullyPaid && (
                              <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                                CLEARED
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-slate-600">
                            ₹ {f.total.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-slate-500">
                            ₹ {(f.discount || 0).toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-semibold text-slate-800">
                            ₹ {f.payable.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-semibold text-emerald-600">
                            ₹ {f.paid.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-rose-600">
                            ₹ {f.due.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="relative inline-flex items-center">
                              <span className="absolute left-2.5 text-xs text-slate-400 font-mono">₹</span>
                              <input
                                type="number"
                                min="0"
                                max={f.due}
                                disabled={isFullyPaid}
                                value={f.payingNow}
                                onChange={(e) => handlePayingAmountChange(f.id, e.target.value)}
                                className={`w-32 text-right rounded-lg border px-2.5 pl-6 py-1.5 font-mono text-xs font-bold focus:outline-none ${
                                  f.checked
                                    ? 'border-indigo-500 bg-white text-indigo-900 ring-1 ring-indigo-500/20'
                                    : 'border-slate-200 bg-slate-50 text-slate-400'
                                }`}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-200">
                      <td colSpan="4" className="py-3 px-4 text-right uppercase tracking-wider text-xs">
                        Grand Totals:
                      </td>
                      <td className="py-3 px-4 text-right font-mono">
                        ₹ {totalAmountOverall.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-emerald-600">
                        ₹ {totalPaidOverall.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-rose-600">
                        ₹ {totalDueOverall.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-indigo-700 bg-indigo-50/80 text-sm">
                        ₹ {currentTransactionTotal.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Bottom Action Bar */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center space-x-2 text-xs text-slate-500">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  <span>
                    Amount to collect: <strong className="text-slate-900 font-mono">₹ {currentTransactionTotal.toLocaleString('en-IN')}</strong> ({numberToIndianWords(currentTransactionTotal)})
                  </span>
                </div>

                <div className="flex items-center space-x-2.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => handleSelectAllDue(false)}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-white cursor-pointer transition-colors"
                  >
                    Reset
                  </button>

                  <button
                    type="button"
                    onClick={handleSavePayment}
                    disabled={submittingPayment || currentTransactionTotal <= 0}
                    className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-white text-xs font-bold shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                      currentTransactionTotal > 0
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 shadow-indigo-200'
                        : 'bg-slate-400 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <Save className="w-4 h-4" />
                    <span>{submittingPayment ? 'Saving Receipt...' : 'Save & Issue Receipt'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: RECEIPTS HISTORY */}
      {activeTab === 'history' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Receipts Archive & Counter Log</h3>
              <p className="text-xs text-slate-400">Strictly scoped to {schoolName} ({schoolId})</p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 font-mono">
              Total Receipts: {receiptList.length}
            </span>
          </div>

          {receiptList.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No fee receipts issued yet for this school. Collect your first fee above!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/60">
                    <th className="py-2.5 px-3">Receipt No.</th>
                    <th className="py-2.5 px-3">Adm No.</th>
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">Class</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                    <th className="py-2.5 px-3">Pay Mode</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {receiptList.map((r, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60">
                      <td className="py-2.5 px-3 font-mono font-bold text-indigo-700">
                        {r.receiptNo}
                      </td>
                      <td className="py-2.5 px-3 font-mono">{r.admNo}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{r.studentName}</td>
                      <td className="py-2.5 px-3 text-slate-500">{r.className}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">
                        ₹ {Number(r.paidAmount || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[11px]">
                          {r.payMode}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-500">{r.date}</td>
                      <td className="py-2.5 px-3">
                        {r.status === 'CANCELLED' ? (
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px]">
                            CANCELLED
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            SUCCESS
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          <button
                            type="button"
                            onClick={() => setActiveReceiptModal(r)}
                            className="px-2.5 py-1 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                          >
                            <Printer className="w-3 h-3" />
                            <span>Print</span>
                          </button>
                          {r.status !== 'CANCELLED' && (
                            <button
                              type="button"
                              onClick={() => {
                                setCancelModalReceipt(r);
                                setCancelReason('');
                              }}
                              className="px-2 py-1 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold cursor-pointer"
                              title="Cancel Receipt"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CONCESSION POLICY */}
      {activeTab === 'concession' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Tenant Concession Categories & Policies</h3>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('/fee-concession')}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer"
            >
              Open Concession Manager &rarr;
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50">
              <span className="font-bold text-slate-900 block">Sibling Concession</span>
              <p className="text-slate-500 text-[11px] mt-1">25% waiver on second child's tuition fees</p>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50">
              <span className="font-bold text-slate-900 block">Staff Ward Policy</span>
              <p className="text-slate-500 text-[11px] mt-1">50% concession for permanent staff wards</p>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50">
              <span className="font-bold text-slate-900 block">Merit Scholarship</span>
              <p className="text-slate-500 text-[11px] mt-1">Up to 100% waiver for academic toppers</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TRANSPORT FEE */}
      {activeTab === 'transport' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Transport Fee Counter</h3>
            <span className="text-xs text-slate-400">Routes & Pickups</span>
          </div>
          <p className="text-xs text-slate-600">
            Current student: <strong>{selectedStudent?.name || 'None'}</strong> &bull; Status:{' '}
            <span className="font-bold text-indigo-700">{selectedStudent?.transportStatus || 'Not Opted'}</span>
          </p>
          <div className="p-4 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500 text-center">
            Transport fee heads automatically integrate into the main fee counter when a route is assigned to the student.
          </div>
        </div>
      )}

      {/* ==================== OFFICIAL PRINTABLE RECEIPT MODAL ==================== */}
      {activeReceiptModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 z-50 overflow-y-auto">
          {/* Print Stylesheet */}
          <style>{`
            @media print {
              body * {
                visibility: hidden !important;
              }
              #printable-receipt-wrapper, #printable-receipt-wrapper * {
                visibility: visible !important;
              }
              #printable-receipt-wrapper {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                padding: 0 !important;
                margin: 0 !important;
                box-shadow: none !important;
                border: none !important;
              }
              .no-print {
                display: none !important;
              }
            }
          `}</style>

          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-6">
            {/* Modal Top Control Bar */}
            <div className="bg-slate-900 text-white px-5 py-3 flex flex-wrap items-center justify-between gap-3 no-print">
              <div className="flex items-center space-x-2">
                <Receipt className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-xs uppercase tracking-wider">Official Fee Receipt</span>
              </div>

              {/* Copy Toggle */}
              <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-[11px]">
                <button
                  type="button"
                  onClick={() => setReceiptCopyType('student')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                    receiptCopyType === 'student' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Student Copy
                </button>
                <button
                  type="button"
                  onClick={() => setReceiptCopyType('office')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                    receiptCopyType === 'office' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Office Copy
                </button>
                <button
                  type="button"
                  onClick={() => setReceiptCopyType('dual')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                    receiptCopyType === 'dual' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Dual Copy (1-Page)
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-sm transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveReceiptModal(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable Receipt Paper Container */}
            <div id="printable-receipt-wrapper" className="p-6 md:p-8 space-y-5 text-slate-800 text-xs font-sans bg-white max-h-[85vh] overflow-y-auto">
              
              {/* Function to render single copy */}
              {[...(receiptCopyType === 'dual' ? ['STUDENT COPY', 'OFFICE COPY'] : [receiptCopyType === 'office' ? 'OFFICE COPY' : 'STUDENT COPY'])].map((copyTitle, copyIdx) => (
                <div key={copyIdx} className={copyIdx > 0 ? "pt-6 border-t-2 border-dashed border-slate-400 mt-6" : ""}>
                  {copyIdx > 0 && (
                    <div className="text-center -mt-3.5 mb-4">
                      <span className="bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-dashed border-slate-300 rounded-full">
                        ✂ Cut Here For Office Copy Record
                      </span>
                    </div>
                  )}

                  {/* Header with School Crest & Affiliation */}
                  <div className="flex items-start justify-between pb-3 border-b-2 border-slate-800 gap-4">
                    <div className="flex items-center gap-3">
                      {schoolProfile?.logoUrl ? (
                        <img
                          src={schoolProfile.logoUrl}
                          alt="School Crest"
                          className="w-16 h-16 object-contain rounded-lg border border-slate-200 p-0.5"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 font-black text-xl">
                          JD
                        </div>
                      )}
                      <div>
                        <h1 className="text-lg md:text-xl font-black text-slate-900 tracking-tight uppercase leading-tight font-serif">
                          {schoolName || schoolProfile?.schoolName || 'J D INTERNATIONAL SCHOOL'}
                        </h1>
                        <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                          {schoolProfile?.address || 'Mahapura, Ajmer Road, Jaipur'} &bull; Phone: {schoolProfile?.phone1 || '8947919195'}
                        </p>
                        <p className="text-[10px] text-slate-500 font-semibold tracking-wide mt-0.5">
                          Affiliated to {schoolProfile?.affiliationBoard || 'CBSE'}, New Delhi &bull; Affiliation No: {schoolProfile?.affiliationNo || '1730619'} | School Code: {schoolProfile?.schoolCode || '10964'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="inline-block px-2.5 py-0.5 rounded bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest shadow-2xs">
                        {copyTitle}
                      </span>
                      <p className="text-[10px] font-bold text-slate-500 font-mono mt-1">
                        SESSION 2026-2027
                      </p>
                    </div>
                  </div>

                  {/* Structured 4-Column Metadata Table */}
                  <div className="border border-slate-300 rounded-lg overflow-hidden my-3">
                    <table className="w-full text-xs">
                      <tbody className="divide-y divide-slate-200">
                        <tr>
                          <td className="bg-slate-50/80 px-2.5 py-1.5 font-bold text-slate-700 w-1/4 border-r border-slate-200">Receipt No.</td>
                          <td className="px-2.5 py-1.5 font-bold font-mono text-indigo-900 w-1/4 border-r border-slate-200">
                            {activeReceiptModal.receiptNo}
                          </td>
                          <td className="bg-slate-50/80 px-2.5 py-1.5 font-bold text-slate-700 w-1/4 border-r border-slate-200">Date & Time</td>
                          <td className="px-2.5 py-1.5 font-semibold font-mono text-slate-900 w-1/4">
                            {activeReceiptModal.date}
                          </td>
                        </tr>
                        <tr>
                          <td className="bg-slate-50/80 px-2.5 py-1.5 font-bold text-slate-700 border-r border-slate-200">Admission No.</td>
                          <td className="px-2.5 py-1.5 font-bold font-mono text-indigo-700 border-r border-slate-200">
                            {activeReceiptModal.admNo}
                          </td>
                          <td className="bg-slate-50/80 px-2.5 py-1.5 font-bold text-slate-700 border-r border-slate-200">Class & Section</td>
                          <td className="px-2.5 py-1.5 font-bold text-slate-900">
                            {activeReceiptModal.className || selectedStudent?.className}
                          </td>
                        </tr>
                        <tr>
                          <td className="bg-slate-50/80 px-2.5 py-1.5 font-bold text-slate-700 border-r border-slate-200">Student Name</td>
                          <td className="px-2.5 py-1.5 font-black uppercase text-slate-900 border-r border-slate-200">
                            {activeReceiptModal.studentName}
                          </td>
                          <td className="bg-slate-50/80 px-2.5 py-1.5 font-bold text-slate-700 border-r border-slate-200">Father's Name</td>
                          <td className="px-2.5 py-1.5 font-semibold text-slate-800">
                            {activeReceiptModal.fatherName || selectedStudent?.fatherName || '-'}
                          </td>
                        </tr>
                        <tr>
                          <td className="bg-slate-50/80 px-2.5 py-1.5 font-bold text-slate-700 border-r border-slate-200">Payment Mode</td>
                          <td className="px-2.5 py-1.5 font-bold text-emerald-800 border-r border-slate-200">
                            {activeReceiptModal.payMode} {activeReceiptModal.chequeNo ? `(${activeReceiptModal.chequeNo})` : ''}
                          </td>
                          <td className="bg-slate-50/80 px-2.5 py-1.5 font-bold text-slate-700 border-r border-slate-200">Counter Clerk</td>
                          <td className="px-2.5 py-1.5 text-slate-700 font-medium">Fee Counter #1</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Fee Line Items Table */}
                  <table className="w-full text-left text-xs border border-slate-300 rounded-lg overflow-hidden my-3">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                        <th className="py-2 px-3 w-10 text-center border-r border-slate-200">#</th>
                        <th className="py-2 px-3 border-r border-slate-200">Fee Particulars / Heads</th>
                        <th className="py-2 px-3 text-right">Amount Paid (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-medium">
                      {activeReceiptModal.items && activeReceiptModal.items.length > 0 ? (
                        activeReceiptModal.items.map((it, i) => (
                          <tr key={i} className="hover:bg-slate-50/50">
                            <td className="py-2 px-3 text-center font-mono text-slate-500 border-r border-slate-200">{i + 1}</td>
                            <td className="py-2 px-3 font-bold text-slate-900 border-r border-slate-200">{it.feeHead}</td>
                            <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                              ₹ {Number(it.amount).toLocaleString('en-IN')}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="py-2 px-3 text-center font-mono border-r border-slate-200">1</td>
                          <td className="py-2 px-3 font-semibold text-slate-900 border-r border-slate-200">Academic Tuition & Composite Fee</td>
                          <td className="py-2 px-3 text-right font-mono font-bold">
                            ₹ {Number(activeReceiptModal.paidAmount || 0).toLocaleString('en-IN')}
                          </td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-100/90 font-bold border-t-2 border-slate-800 text-slate-900">
                        <td colSpan="2" className="py-2.5 px-3 text-right uppercase tracking-wider font-bold">
                          Total Amount Received :
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-black text-sm text-emerald-800">
                          ₹ {Number(activeReceiptModal.paidAmount || 0).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    </tfoot>
                  </table>

                  {/* Amount in Words Strip */}
                  <div className="bg-slate-50/90 p-2.5 rounded-lg border border-slate-200 text-xs flex items-center justify-between">
                    <div>
                      <strong className="text-slate-700">Amount in Words: </strong>
                      <span className="font-bold text-slate-900 italic">
                        {activeReceiptModal.words || numberToIndianWords(activeReceiptModal.paidAmount)}
                      </span>
                    </div>
                    {activeReceiptModal.remarks && (
                      <div className="text-slate-500 italic text-[11px]">
                        <strong>Remarks:</strong> {activeReceiptModal.remarks}
                      </div>
                    )}
                  </div>

                  {/* Signatures & Legal Disclaimer */}
                  <div className="pt-4 grid grid-cols-2 gap-4 items-end text-xs">
                    <div>
                      <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
                        &bull; Fees once paid is strictly non-refundable under all circumstances.<br />
                        &bull; This is an authentic computer-generated fee counter receipt.<br />
                        &bull; Cheques / DD transactions are subject to actual bank realization.
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="border-b border-slate-400 w-48 mx-auto pb-1 mb-1 font-mono text-[11px] font-bold text-slate-800">
                        Authorized Signatory
                      </div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Accounts Officer / Cashier</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================== CANCEL RECEIPT MODAL ==================== */}
      {cancelModalReceipt && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-5 border border-slate-200 space-y-4">
            <div className="flex items-center space-x-2 text-rose-600">
              <AlertCircle className="w-5 h-5" />
              <h3 className="font-bold text-sm text-slate-900">Cancel Fee Receipt</h3>
            </div>
            <p className="text-xs text-slate-600">
              Are you sure you want to cancel Receipt <strong className="font-mono text-slate-900">#{cancelModalReceipt.receiptNo}</strong> for{' '}
              <strong>{cancelModalReceipt.studentName}</strong> (₹ {Number(cancelModalReceipt.paidAmount).toLocaleString('en-IN')})?
            </p>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Reason for Cancellation *
              </label>
              <textarea
                rows="2"
                placeholder="e.g. Cheque bounced, entered incorrect amount by mistake"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-none focus:border-rose-500"
              />
            </div>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalReceipt(null)}
                className="px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Keep Receipt
              </button>
              <button
                type="button"
                onClick={handleCancelReceipt}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FeeCollectionPage;
