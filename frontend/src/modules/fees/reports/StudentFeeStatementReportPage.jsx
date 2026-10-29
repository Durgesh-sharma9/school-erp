import React, { useState } from 'react';
import { FileSpreadsheet, Search, Download, Printer, User, Phone, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';
import { tenantStore } from '../../../services/tenantStore';

export function StudentFeeStatementReportPage() {
  const { schoolId } = useAuth();
  const [availableStudents, setAvailableStudents] = useState([]);
  const [selectedStudentAdm, setSelectedStudentAdm] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedDivision, setSelectedDivision] = useState('A');

  const [statementRows, setStatementRows] = useState([]);

  React.useEffect(() => {
    try {
      const realStudents = tenantStore.getStudents(schoolId) || [];
      setAvailableStudents(realStudents);
      if (realStudents.length > 0) {
        setSelectedStudentAdm(realStudents[0].admNo);
      }
    } catch (e) {
      console.error(e);
    }
  }, [schoolId]);

  const currentStudent = availableStudents.find(s => String(s.admNo) === String(selectedStudentAdm)) || availableStudents[0] || null;

  const studentInfo = currentStudent ? {
    name: (currentStudent.name || `${currentStudent.firstName || ''} ${currentStudent.lastName || ''}`).trim() || `Student ${currentStudent.admNo}`,
    admNo: currentStudent.admNo,
    srNo: currentStudent.srNo || currentStudent.admNo,
    className: `${currentStudent.className || 'I'} (Section ${currentStudent.section || 'A'})`,
    fatherName: currentStudent.fatherName || currentStudent.fathers_name || '-',
    mobileNo: currentStudent.fatherMobile || currentStudent.contactNo || '-',
    category: currentStudent.category || 'General',
    transportRoute: currentStudent.transportRoute || 'Self / Walker'
  } : {
    name: 'No student enrolled',
    admNo: '-',
    srNo: '-',
    className: '-',
    fatherName: '-',
    mobileNo: '-',
    category: '-',
    transportRoute: '-'
  };

  React.useEffect(() => {
    if (!currentStudent) {
      setStatementRows([]);
      return;
    }
    try {
      const receipts = tenantStore.getReceipts(schoolId) || [];
      const studentReceipts = receipts
        .filter(r => String(r.admNo) === String(currentStudent.admNo))
        .map((r, idx) => ({
          sNo: idx + 1,
          recNo: r.receiptNo,
          recDate: r.date,
          period: 'Fee Receipt Payment',
          payMode: r.payMode,
          payableAmt: Number(r.paidAmount || 0),
          paidAmt: Number(r.paidAmount || 0),
          dueAmt: 0,
          advAmt: Number(r.advanceAmount || 0),
          remarks: r.remarks || 'Payment cleared'
        }));
      setStatementRows(studentReceipts);
    } catch (e) {
      console.error(e);
    }
  }, [selectedStudentAdm, schoolId, currentStudent]);

  const totalPayable = statementRows.reduce((sum, r) => sum + r.payableAmt, 0);
  const totalPaid = statementRows.reduce((sum, r) => sum + r.paidAmt, 0);
  const totalDue = statementRows.reduce((sum, r) => sum + r.dueAmt, 0);
  const totalAdv = statementRows.reduce((sum, r) => sum + r.advAmt, 0);

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      [`Student Name: ${studentInfo.name}, Adm No: ${studentInfo.admNo}, Class: ${studentInfo.className}`,
       "S.No.,Rec No,Rec Date,Period,Pay Mode,Payable Amt,Paid Amt,Due Amt,Adv Amt,Remarks"].concat(
        statementRows.map(r => `${r.sNo},"${r.recNo}","${r.recDate}","${r.period}","${r.payMode}",${r.payableAmt},${r.paidAmt},${r.dueAmt},${r.advAmt},"${r.remarks}"`)
      ).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `Fee_Statement_${studentInfo.admNo}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Exported student fee statement');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-indigo-600" />
            Student Fees Statement
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Fees &bull; <span className="text-indigo-600 font-medium">Individual Student Ledger & Transaction History</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={exportCSV} className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl">
            <Printer className="w-4 h-4" /> Print Statement
          </button>
        </div>
      </div>

      {/* Filter Bar (1:1 with UAB) */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Class</label>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">
              <option value="Nursery - PP3+">Nursery - PP3+</option>
              <option value="Class I">Class I</option>
              <option value="Class II">Class II</option>
              <option value="Class X">Class X</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Division</label>
            <select value={selectedDivision} onChange={(e) => setSelectedDivision(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">
              <option value="A">Section A</option>
              <option value="B">Section B</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Select Student</label>
            <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">
              <option value="1621 - AADITYA SINGH CHOUDHARY">1621 - AADITYA SINGH CHOUDHARY</option>
              <option value="2059 - AADHYA CHOUDHARY">2059 - AADHYA CHOUDHARY</option>
              <option value="1204 - AARAV SHARMA">1204 - AARAV SHARMA</option>
            </select>
          </div>

          <div className="flex flex-col justify-end">
            <button onClick={() => toast.success('Statement fetched')} className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5">
              <Search className="w-4 h-4" /> View Statement
            </button>
          </div>
        </div>
      </div>

      {/* Student Profile Card */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-100 flex flex-wrap gap-6 items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl font-bold shadow-sm">
            {studentInfo.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{studentInfo.name}</h2>
            <div className="flex items-center gap-3 text-xs text-slate-600 mt-1">
              <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5 text-indigo-500" /> {studentInfo.className}</span>
              <span>&bull;</span>
              <span>Adm No: <strong className="text-indigo-700">{studentInfo.admNo}</strong></span>
              <span>&bull;</span>
              <span>Father: <strong>{studentInfo.fatherName}</strong></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-600 border-l border-indigo-200/60 pl-6">
          <div>
            <div className="text-[11px] text-slate-400 font-semibold uppercase">Mobile</div>
            <div className="font-semibold text-slate-800">{studentInfo.mobileNo}</div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-semibold uppercase">Transport</div>
            <div className="font-semibold text-slate-800">{studentInfo.transportRoute}</div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-semibold uppercase">Category</div>
            <div className="font-semibold text-slate-800">{studentInfo.category}</div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="text-[11px] font-semibold text-slate-500 uppercase">Total Payable</div>
          <div className="text-xl font-bold text-slate-900 mt-1">₹{totalPayable.toLocaleString()}</div>
        </div>
        <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
          <div className="text-[11px] font-semibold text-emerald-600 uppercase">Total Paid</div>
          <div className="text-xl font-bold text-emerald-900 mt-1">₹{totalPaid.toLocaleString()}</div>
        </div>
        <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100">
          <div className="text-[11px] font-semibold text-rose-600 uppercase">Current Due</div>
          <div className="text-xl font-bold text-rose-900 mt-1">₹{totalDue.toLocaleString()}</div>
        </div>
        <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
          <div className="text-[11px] font-semibold text-indigo-600 uppercase">Advance Balance</div>
          <div className="text-xl font-bold text-indigo-900 mt-1">₹{totalAdv.toLocaleString()}</div>
        </div>
      </div>

      {/* Table (1:1 with UAB) */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[11px] border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">S.NO.</th>
                <th className="py-3.5 px-6">REC. NO.</th>
                <th className="py-3.5 px-6">REC. DATE</th>
                <th className="py-3.5 px-6">PERIOD</th>
                <th className="py-3.5 px-6">PAY MODE</th>
                <th className="py-3.5 px-6 text-right">PAYABLE AMT (₹)</th>
                <th className="py-3.5 px-6 text-right">PAID AMT (₹)</th>
                <th className="py-3.5 px-6 text-right">DUE AMT (₹)</th>
                <th className="py-3.5 px-6 text-right">ADV. AMT (₹)</th>
                <th className="py-3.5 px-6">REMARKS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {statementRows.map((r, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-6 text-slate-400 font-mono">{r.sNo}</td>
                  <td className="py-3.5 px-6 font-mono font-semibold text-indigo-600">{r.recNo}</td>
                  <td className="py-3.5 px-6 font-mono">{r.recDate}</td>
                  <td className="py-3.5 px-6 font-medium text-slate-800">{r.period}</td>
                  <td className="py-3.5 px-6"><span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">{r.payMode}</span></td>
                  <td className="py-3.5 px-6 text-right font-mono font-medium">₹{r.payableAmt.toLocaleString()}</td>
                  <td className="py-3.5 px-6 text-right font-mono font-medium text-emerald-700">₹{r.paidAmt.toLocaleString()}</td>
                  <td className="py-3.5 px-6 text-right font-mono font-medium text-rose-600">₹{r.dueAmt.toLocaleString()}</td>
                  <td className="py-3.5 px-6 text-right font-mono font-medium text-indigo-700">₹{r.advAmt.toLocaleString()}</td>
                  <td className="py-3.5 px-6 text-slate-500 italic text-[11px]">{r.remarks}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50/75 border-t border-slate-200 font-bold text-slate-900">
              <tr>
                <td colSpan="5" className="py-3.5 px-6 text-right text-xs">Total:</td>
                <td className="py-3.5 px-6 text-right font-mono">₹{totalPayable.toLocaleString()}</td>
                <td className="py-3.5 px-6 text-right font-mono text-emerald-700">₹{totalPaid.toLocaleString()}</td>
                <td className="py-3.5 px-6 text-right font-mono text-rose-600">₹{totalDue.toLocaleString()}</td>
                <td className="py-3.5 px-6 text-right font-mono text-indigo-700">₹{totalAdv.toLocaleString()}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
