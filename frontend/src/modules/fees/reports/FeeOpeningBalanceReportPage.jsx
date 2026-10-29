import React, { useState } from 'react';
import { History, Search, Download, Printer } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';
import { tenantStore } from '../../../services/tenantStore';

export function FeeOpeningBalanceReportPage() {
  const { schoolId } = useAuth();
  const [reportType, setReportType] = useState('All');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedDivision, setSelectedDivision] = useState('All');

  const [records, setRecords] = useState([]);

  React.useEffect(() => {
    try {
      const realStudents = tenantStore.getStudents(schoolId) || [];
      const mapped = realStudents
        .filter(s => Number(s.openingBalance || 0) > 0)
        .map((s, idx) => ({
          sNo: idx + 1,
          admNo: s.admNo,
          srNo: s.srNo || s.admNo,
          name: (s.name || `${s.firstName || ''} ${s.lastName || ''}`).trim(),
          className: `${s.className || 'I'}-${s.section || 'A'}`,
          fatherName: s.fatherName || s.fathers_name || '-',
          mobileNo: s.fatherMobile || s.contactNo || '-',
          routeName: s.transportRoute || 'Self / Walker',
          due: Number(s.openingBalance || 0),
          paid: 0,
          balance: Number(s.openingBalance || 0)
        }));
      setRecords(mapped);
    } catch (e) {
      console.error(e);
    }
  }, [schoolId]);

  const filteredRecords = records.filter(r => {
    if (selectedClass !== 'All' && !r.className.startsWith(selectedClass)) return false;
    if (reportType === 'Pending Only' && r.balance <= 0) return false;
    if (reportType === 'Cleared Only' && r.balance > 0) return false;
    return true;
  });

  const totalDue = filteredRecords.reduce((sum, r) => sum + r.due, 0);
  const totalPaid = filteredRecords.reduce((sum, r) => sum + r.paid, 0);
  const totalBalance = filteredRecords.reduce((sum, r) => sum + r.balance, 0);

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["S.No.,Adm No,SR No,Student Name,Class,Father's Name,Mobile No,Route Name,Opening Due,Paid,Balance"].concat(
        filteredRecords.map(r => `${r.sNo},"${r.admNo}","${r.srNo}","${r.name}","${r.className}","${r.fatherName}","${r.mobileNo}","${r.routeName}",${r.due},${r.paid},${r.balance}`)
      ).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `Fee_Opening_Balance_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Exported to CSV');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-indigo-600" />
            Opening Balance Report
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Fees &bull; <span className="text-indigo-600 font-medium">Previous Session Arrears & Carry Forward Register</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={exportCSV} className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl">
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>
      </div>

      {/* Filter Bar (1:1 with UAB) */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Report type</label>
            <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">
              <option value="All">All Opening Balances</option>
              <option value="Pending Only">Pending Carry Forward Only</option>
              <option value="Cleared Only">Fully Cleared</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Class</label>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">
              <option value="All">All Classes</option>
              <option value="Class I">Class I</option>
              <option value="Class II">Class II</option>
              <option value="Class X">Class X</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Division</label>
            <select value={selectedDivision} onChange={(e) => setSelectedDivision(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">
              <option value="All">All Divisions</option>
              <option value="A">A</option>
              <option value="B">B</option>
            </select>
          </div>

          <div className="flex flex-col justify-end">
            <button onClick={() => toast.success('Opening balance report filtered')} className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5">
              <Search className="w-4 h-4" /> Search
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 flex justify-between items-center">
          <div>
            <div className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider">Total Opening Due</div>
            <div className="text-xl font-bold text-amber-900 mt-1">₹{totalDue.toLocaleString()}</div>
          </div>
        </div>
        <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 flex justify-between items-center">
          <div>
            <div className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">Opening Paid</div>
            <div className="text-xl font-bold text-emerald-900 mt-1">₹{totalPaid.toLocaleString()}</div>
          </div>
        </div>
        <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100 flex justify-between items-center">
          <div>
            <div className="text-[11px] font-semibold text-rose-600 uppercase tracking-wider">Unrecovered Balance</div>
            <div className="text-xl font-bold text-rose-900 mt-1">₹{totalBalance.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Table (1:1 with UAB) */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[11px] border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">S.NO.</th>
                <th className="py-3.5 px-6">ADM.NO.</th>
                <th className="py-3.5 px-6">SR.NO.</th>
                <th className="py-3.5 px-6">NAME</th>
                <th className="py-3.5 px-6">CLASS</th>
                <th className="py-3.5 px-6">FATHER'S NAME</th>
                <th className="py-3.5 px-6">MOBILE NO.</th>
                <th className="py-3.5 px-6">ROUTE NAME</th>
                <th className="py-3.5 px-6 text-right">DUE (₹)</th>
                <th className="py-3.5 px-6 text-right">PAID (₹)</th>
                <th className="py-3.5 px-6 text-right font-bold text-rose-600">BALANCE (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((r, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-6 text-slate-400 font-mono">{r.sNo}</td>
                  <td className="py-3.5 px-6 font-mono text-indigo-600">{r.admNo}</td>
                  <td className="py-3.5 px-6 font-mono">{r.srNo}</td>
                  <td className="py-3.5 px-6 font-bold text-slate-800">{r.name}</td>
                  <td className="py-3.5 px-6">{r.className}</td>
                  <td className="py-3.5 px-6">{r.fatherName}</td>
                  <td className="py-3.5 px-6 font-mono">{r.mobileNo}</td>
                  <td className="py-3.5 px-6">{r.routeName}</td>
                  <td className="py-3.5 px-6 text-right font-mono font-medium text-amber-700">₹{r.due.toLocaleString()}</td>
                  <td className="py-3.5 px-6 text-right font-mono font-medium text-emerald-700">₹{r.paid.toLocaleString()}</td>
                  <td className="py-3.5 px-6 text-right font-mono font-bold text-rose-600">₹{r.balance.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50/75 border-t border-slate-200 font-bold text-slate-900">
              <tr>
                <td colSpan="8" className="py-3.5 px-6 text-right text-xs">Total:</td>
                <td className="py-3.5 px-6 text-right font-mono text-amber-700">₹{totalDue.toLocaleString()}</td>
                <td className="py-3.5 px-6 text-right font-mono text-emerald-700">₹{totalPaid.toLocaleString()}</td>
                <td className="py-3.5 px-6 text-right font-mono text-rose-600">₹{totalBalance.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
