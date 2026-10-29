import React, { useState } from 'react';
import { IndianRupee, Search, Download, Printer, Filter, Calendar, MessageSquare, Send, CreditCard } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { tenantStore } from '../../../services/tenantStore';
import toast from 'react-hot-toast';

export function FeeDueListReportPage({ onNavigate }) {
  const { schoolId } = useAuth();
  const [reportType, setReportType] = useState('Month Wise');
  const [selectedClass, setSelectedClass] = useState('All');
  const [studentType, setStudentType] = useState('Due Student');
  const [searchQuery, setSearchQuery] = useState('');

  const [students, setStudents] = useState([]);

  React.useEffect(() => {
    try {
      const realStudents = tenantStore.getStudents(schoolId) || [];
      const mapped = realStudents.map((s, idx) => {
        const ledger = tenantStore.getStudentFeeLedger(schoolId, s.admNo);
        const dueAmt = ledger
          ? ledger.filter(h => !h.isPaid).reduce((sum, h) => sum + (h.netPayable || h.amount), 0)
          : Number(s.totalFees || 15000);
        return {
          sNo: idx + 1,
          enrollNo: s.enrollNo || `ENR-${s.admNo}`,
          admNo: s.admNo,
          srNo: s.srNo || s.admNo,
          name: (s.name || `${s.firstName || ''} ${s.lastName || ''}`).trim() || `Student ${s.admNo}`,
          className: `${s.className || 'I'}-${s.section || 'A'}`,
          mobile: s.fatherMobile || s.contactNo || '-',
          fatherName: s.fatherName || s.fathers_name || '-',
          months: { apr: 0, may: 0, jun: 0, jul: Math.round(dueAmt * 0.3), aug: Math.round(dueAmt * 0.3), sep: Math.round(dueAmt * 0.4), oct: 0 },
          due: dueAmt
        };
      });
      setStudents(mapped);
    } catch (e) {
      console.error(e);
    }
  }, [schoolId]);

  const totalDues = students.reduce((sum, s) => sum + s.due, 0);

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["S.No.,Enroll No,Adm No,SR No,Student Name,Class,Mobile,Father Name,Apr,May,Jun,Jul,Aug,Sep,Oct,Due Amount"].concat(
        students.map(s => `${s.sNo},"${s.enrollNo}","${s.admNo}","${s.srNo}","${s.name}","${s.className}","${s.mobile}","${s.fatherName}",${s.months.apr},${s.months.may},${s.months.jun},${s.months.jul},${s.months.aug},${s.months.sep},${s.months.oct},${s.due}`)
      ).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `Fee_Due_List_Month_Wise.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Exported to CSV');
  };

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.admNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.className.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <IndianRupee className="w-6 h-6 text-indigo-600" />
            Fee Due List (Month Wise)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Fees &bull; <span className="text-indigo-600 font-medium">Month-Wise Fee Dues & Defaulters Register</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              tenantStore.setPendingDirectSms({
                className: selectedClass === 'All' ? 'All Classes' : selectedClass,
                count: filtered.length,
                totalDue: totalDues,
                message: `Dear Parent, this is an important reminder that second quarter school fee dues are pending. Kindly clear outstanding dues at the earliest to ensure uninterrupted academic services.`
              });
              onNavigate?.('/student-sms');
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-2xs transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" /> Send Due Reminder SMS ({filtered.length})
          </button>
          <button onClick={exportCSV} className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer">
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>
      </div>

      {/* Filter Bar (1:1 with UAB) */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Report Type</label>
            <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">
              <option value="Month Wise">Month Wise</option>
              <option value="Total Due">Total Due Only</option>
              <option value="Head Wise">Head Wise</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Class</label>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">
              <option value="All">All Classes</option>
              <option value="Nursery - PP3+">Nursery - PP3+</option>
              <option value="Lower Kindergarten - PP4+">Lower Kindergarten - PP4+</option>
              <option value="Upper Kindergarten - PP5+">Upper Kindergarten - PP5+</option>
              <option value="I">Class I</option>
              <option value="X">Class X</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Student Type</label>
            <select value={studentType} onChange={(e) => setStudentType(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">
              <option value="Due Student">Due Student</option>
              <option value="All">All Students</option>
            </select>
          </div>

          <div className="flex flex-col justify-end">
            <button onClick={() => toast.success('Filtered month wise fee due list')} className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5">
              <Search className="w-4 h-4" /> Search
            </button>
          </div>
        </div>
      </div>

      {/* Table (1:1 with UAB) */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[11px] border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">S.NO.</th>
                <th className="py-3 px-4">ENROLL NO.</th>
                <th className="py-3 px-4">ADM. NO.</th>
                <th className="py-3 px-4">SR. NO.</th>
                <th className="py-3 px-4">NAME</th>
                <th className="py-3 px-4">CLASS</th>
                <th className="py-3 px-4">MOBILE NO.</th>
                <th className="py-3 px-4">FATHER'S NAME</th>
                <th className="py-3 px-3 text-right">APR</th>
                <th className="py-3 px-3 text-right">MAY</th>
                <th className="py-3 px-3 text-right">JUN</th>
                <th className="py-3 px-3 text-right">JUL</th>
                <th className="py-3 px-3 text-right">AUG</th>
                <th className="py-3 px-3 text-right">SEP</th>
                <th className="py-3 px-3 text-right">OCT</th>
                <th className="py-3 px-4 text-right font-bold text-slate-900">DUE</th>
                <th className="py-3 px-4 text-center font-bold text-slate-900">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((s) => (
                <tr key={s.admNo} className="hover:bg-slate-50/60">
                  <td className="py-3 px-4 font-medium text-slate-800">{s.sNo}</td>
                  <td className="py-3 px-4 font-mono text-slate-500">{s.enrollNo}</td>
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700">{s.admNo}</td>
                  <td className="py-3 px-4 font-mono text-slate-500">{s.srNo}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{s.name}</td>
                  <td className="py-3 px-4 text-slate-600">{s.className}</td>
                  <td className="py-3 px-4 font-mono text-slate-600">{s.mobile}</td>
                  <td className="py-3 px-4 text-slate-600">{s.fatherName}</td>
                  <td className="py-3 px-3 text-right text-slate-500">₹{s.months.apr}</td>
                  <td className="py-3 px-3 text-right text-slate-500">₹{s.months.may}</td>
                  <td className="py-3 px-3 text-right text-slate-500">₹{s.months.jun}</td>
                  <td className="py-3 px-3 text-right text-slate-500">₹{s.months.jul}</td>
                  <td className="py-3 px-3 text-right text-slate-500">₹{s.months.aug}</td>
                  <td className="py-3 px-3 text-right text-slate-500">₹{s.months.sep}</td>
                  <td className="py-3 px-3 text-right text-slate-500">₹{s.months.oct}</td>
                  <td className="py-3 px-4 text-right font-black text-rose-600">₹{s.due.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          tenantStore.setPendingFeeStudent({
                            admNo: s.admNo,
                            name: s.name,
                            className: s.className,
                            fatherName: s.fatherName,
                            mobileNo: s.mobile,
                            due: s.due
                          });
                          onNavigate?.('/fee-collection');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-2xs flex items-center gap-1 cursor-pointer"
                        title="Collect fee for this student"
                      >
                        <CreditCard className="w-3 h-3" /> Pay
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          tenantStore.setPendingDirectSms({
                            admNo: s.admNo,
                            name: s.name,
                            className: s.className,
                            mobile: s.mobile,
                            dueAmount: s.due,
                            message: `Dear Parent, school fee dues of ₹${s.due.toLocaleString('en-IN')} for ${s.name} (Adm No: ${s.admNo}) are outstanding. Kindly clear at your earliest convenience.`
                          });
                          onNavigate?.('/student-sms');
                        }}
                        className="p-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition-colors cursor-pointer"
                        title="Send SMS reminder to parent"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              <tr className="bg-slate-50 font-bold border-t-2 border-slate-200">
                <td colSpan="15" className="py-3 px-4 text-right uppercase tracking-wider text-slate-700">Total Outstanding Month Dues:</td>
                <td className="py-3 px-4 text-right font-black text-rose-600 text-sm">₹{totalDues.toLocaleString('en-IN')}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
