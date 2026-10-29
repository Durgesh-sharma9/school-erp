import React, { useState } from 'react';
import { BookOpen, Search, Download, Printer } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';
import { tenantStore } from '../../../services/tenantStore';

export function FeeBookReportPage() {
  const [selectedClass, setSelectedClass] = useState('Nursery - PP3+');
  const [selectedDivision, setSelectedDivision] = useState('All');
  const [reportType, setReportType] = useState('Fee');

  const [students] = useState([
    {
      sNo: 1,
      admNo: '1621',
      srNo: '1621',
      name: 'AADITYA SINGH CHOUDHARY',
      fatherName: 'VIKRAM SINGH',
      apr: { due: 2000, paid: 2000 },
      may: { due: 2000, paid: 2000 },
      jun: { due: 2000, paid: 2000 },
      jul: { due: 2000, paid: 2000 },
      aug: { due: 2000, paid: 2000 },
      sep: { due: 2000, paid: 2000 },
      oct: { due: 2000, paid: 2000 },
      nov: { due: 2000, paid: 0 },
      dec: { due: 2000, paid: 0 },
      jan: { due: 2000, paid: 0 },
      feb: { due: 2000, paid: 0 },
      mar: { due: 2000, paid: 0 },
      totalDemand: 24000,
      totalPaid: 14000,
      balance: 10000
    },
    {
      sNo: 2,
      admNo: '2059',
      srNo: '2059',
      name: 'AADHYA CHOUDHARY',
      fatherName: 'SURESH CHOUDHARY',
      apr: { due: 2000, paid: 2000 },
      may: { due: 2000, paid: 2000 },
      jun: { due: 2000, paid: 2000 },
      jul: { due: 2000, paid: 2000 },
      aug: { due: 2000, paid: 2000 },
      sep: { due: 2000, paid: 2000 },
      oct: { due: 2000, paid: 2000 },
      nov: { due: 2000, paid: 2000 },
      dec: { due: 2000, paid: 2000 },
      jan: { due: 2000, paid: 2000 },
      feb: { due: 2000, paid: 2000 },
      mar: { due: 2000, paid: 2000 },
      totalDemand: 24000,
      totalPaid: 24000,
      balance: 0
    },
    {
      sNo: 3,
      admNo: '1204',
      srNo: '1204',
      name: 'AARAV SHARMA',
      fatherName: 'RAJESH SHARMA',
      apr: { due: 2000, paid: 2000 },
      may: { due: 2000, paid: 2000 },
      jun: { due: 2000, paid: 0 },
      jul: { due: 2000, paid: 0 },
      aug: { due: 2000, paid: 0 },
      sep: { due: 2000, paid: 0 },
      oct: { due: 2000, paid: 0 },
      nov: { due: 2000, paid: 0 },
      dec: { due: 2000, paid: 0 },
      jan: { due: 2000, paid: 0 },
      feb: { due: 2000, paid: 0 },
      mar: { due: 2000, paid: 0 },
      totalDemand: 24000,
      totalPaid: 4000,
      balance: 20000
    }
  ]);

  const totalDemandAll = students.reduce((sum, s) => sum + s.totalDemand, 0);
  const totalPaidAll = students.reduce((sum, s) => sum + s.totalPaid, 0);
  const totalBalanceAll = students.reduce((sum, s) => sum + s.balance, 0);

  const months = ['apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec', 'jan', 'feb', 'mar'];

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["S.No.,Adm No,SR No,Student Name,Father Name,Total Demand,Total Paid,Balance"].concat(
        students.map(s => `${s.sNo},"${s.admNo}","${s.srNo}","${s.name}","${s.fatherName}",${s.totalDemand},${s.totalPaid},${s.balance}`)
      ).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `Fee_Book_Report_${selectedClass}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Exported Fee Book');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            Fee Book Report
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Fees &bull; <span className="text-indigo-600 font-medium">Session Ledger & Month-Wise Collection Register</span>
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
              <option value="All">All Divisions</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Report</label>
            <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">
              <option value="Fee">Fee Ledger Book</option>
              <option value="Bus">Bus Fee Book</option>
              <option value="Hostel">Hostel Fee Book</option>
            </select>
          </div>

          <div className="flex flex-col justify-end">
            <button onClick={() => toast.success('Fee book loaded')} className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5">
              <Search className="w-4 h-4" /> Generate Fee Book
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="text-[11px] font-semibold text-slate-500 uppercase">Enrolled Students</div>
          <div className="text-xl font-bold text-slate-900 mt-1">{students.length} Students</div>
        </div>
        <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
          <div className="text-[11px] font-semibold text-indigo-600 uppercase">Total Demand</div>
          <div className="text-xl font-bold text-indigo-900 mt-1">₹{totalDemandAll.toLocaleString()}</div>
        </div>
        <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
          <div className="text-[11px] font-semibold text-emerald-600 uppercase">Total Collected</div>
          <div className="text-xl font-bold text-emerald-900 mt-1">₹{totalPaidAll.toLocaleString()}</div>
        </div>
        <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100">
          <div className="text-[11px] font-semibold text-rose-600 uppercase">Outstanding Balance</div>
          <div className="text-xl font-bold text-rose-900 mt-1">₹{totalBalanceAll.toLocaleString()}</div>
        </div>
      </div>

      {/* Fee Book Table (Month-Wise Grid) */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] border-b border-slate-100">
              <tr>
                <th className="py-3 px-3">S.NO.</th>
                <th className="py-3 px-3">ADM.NO.</th>
                <th className="py-3 px-3">STUDENT NAME</th>
                {months.map(m => (
                  <th key={m} className="py-3 px-2 text-center uppercase">{m}</th>
                ))}
                <th className="py-3 px-3 text-right">DEMAND</th>
                <th className="py-3 px-3 text-right">PAID</th>
                <th className="py-3 px-3 text-right text-rose-600">BALANCE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {students.map((s, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 text-slate-400 font-sans">{s.sNo}</td>
                  <td className="py-3 px-3 text-indigo-600">{s.admNo}</td>
                  <td className="py-3 px-3 font-bold text-slate-800 font-sans whitespace-nowrap">{s.name}</td>
                  {months.map(m => {
                    const monthData = s[m];
                    const isFullyPaid = monthData.paid >= monthData.due;
                    return (
                      <td key={m} className="py-3 px-2 text-center">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          isFullyPaid ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          {monthData.paid > 0 ? `₹${monthData.paid}` : '-'}
                        </span>
                      </td>
                    );
                  })}
                  <td className="py-3 px-3 text-right font-medium">₹{s.totalDemand.toLocaleString()}</td>
                  <td className="py-3 px-3 text-right font-medium text-emerald-700">₹{s.totalPaid.toLocaleString()}</td>
                  <td className="py-3 px-3 text-right font-bold text-rose-600">₹{s.balance.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50/75 border-t border-slate-200 font-bold text-slate-900 font-mono">
              <tr>
                <td colSpan={15} className="py-3 px-3 text-right font-sans text-xs">Total:</td>
                <td className="py-3 px-3 text-right">₹{totalDemandAll.toLocaleString()}</td>
                <td className="py-3 px-3 text-right text-emerald-700">₹{totalPaidAll.toLocaleString()}</td>
                <td className="py-3 px-3 text-right text-rose-600">₹{totalBalanceAll.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
