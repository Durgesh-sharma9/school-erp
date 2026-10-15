import React, { useState } from 'react';
import {
  Users,
  Search,
  Home,
  CheckCircle2,
  FileDown,
  Calculator,
  IndianRupee,
  Calendar,
  CheckSquare,
  Square
} from 'lucide-react';

const INITIAL_SALARY_ROSTER = [
  { id: '1', code: '101', name: 'ABHILASHA BHATT', desig: 'Principal', accNo: 'SBI-489211029', bs: 65000, da: 6500, hra: 9750, conv: 1500, med: 1000, spl: 2000, gross: 85750, epf: 7800, esi: 643, pt: 200, lic: 0, adv: 0, net: 77107, workingDays: 30, payableDays: 30, isSelected: true },
  { id: '2', code: '102', name: 'PRITI VERMA', desig: 'Administrator', accNo: 'HDFC-88291039', bs: 42000, da: 4200, hra: 6300, conv: 1500, med: 1000, spl: 2000, gross: 57000, epf: 5040, esi: 427, pt: 200, lic: 0, adv: 0, net: 51333, workingDays: 30, payableDays: 30, isSelected: true },
  { id: '3', code: '201', name: 'MONIKA RANI VERMA', desig: 'Teacher', accNo: 'PNB-338291093', bs: 35000, da: 3500, hra: 5250, conv: 1500, med: 1000, spl: 2000, gross: 48250, epf: 4200, esi: 362, pt: 200, lic: 0, adv: 0, net: 43488, workingDays: 30, payableDays: 30, isSelected: true },
  { id: '4', code: '202', name: 'SUNITA KUMARI', desig: 'Teacher', accNo: 'BOB-992019283', bs: 32000, da: 3200, hra: 4800, conv: 1500, med: 1000, spl: 2000, gross: 44500, epf: 3840, esi: 334, pt: 200, lic: 0, adv: 2500, net: 37626, workingDays: 30, payableDays: 29, isSelected: true },
  { id: '5', code: '501', name: 'BHARAT JANGID', desig: 'Driver', accNo: 'CBI-102938475', bs: 22000, da: 2200, hra: 3300, conv: 1500, med: 1000, spl: 1500, gross: 31500, epf: 2640, esi: 236, pt: 200, lic: 0, adv: 3333, net: 25091, workingDays: 30, payableDays: 30, isSelected: true },
  { id: '6', code: '502', name: 'HANSRAJ JAT', desig: 'Driver', accNo: 'SBI-772910283', bs: 24000, da: 2400, hra: 3600, conv: 1500, med: 1000, spl: 1500, gross: 34000, epf: 2880, esi: 255, pt: 200, lic: 0, adv: 0, net: 30665, workingDays: 30, payableDays: 30, isSelected: true }
];

export function GenerateSalaryPage({ onNavigate }) {
  const [month, setMonth] = useState('2026-10');
  const [payMode, setPayMode] = useState('Bank Transfer');
  const [payDate, setPayDate] = useState('2026-10-31');
  const [roster, setRoster] = useState(INITIAL_SALARY_ROSTER);
  const [successMsg, setSuccessMsg] = useState(false);

  const allSelected = roster.every(s => s.isSelected);

  const handleToggleAll = () => {
    const next = !allSelected;
    setRoster(prev => prev.map(s => ({ ...s, isSelected: next })));
  };

  const handleToggleOne = (id) => {
    setRoster(prev => prev.map(s => s.id === id ? { ...s, isSelected: !s.isSelected } : s));
  };

  const selectedCount = roster.filter(s => s.isSelected).length;
  const totalNetPayable = roster.filter(s => s.isSelected).reduce((sum, s) => sum + s.net, 0);

  const handleGenerate = (e) => {
    e.preventDefault();
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["S.No,Emp Code,Name,Designation,A/C No,Basic Salary,DA,HRA,Gross Salary,EPF,ESIC,PT,Advance,Net Salary,Payable Days"].concat(
        roster.map((s, i) =>
          `"${i + 1}","${s.code}","${s.name}","${s.desig}","${s.accNo}","${s.bs}","${s.da}","${s.hra}","${s.gross}","${s.epf}","${s.esi}","${s.pt}","${s.adv}","${s.net}","${s.payableDays}"`
        )
      ).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `payroll_generated_${month}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1:1 Secondary Top Header Toolbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-bold text-slate-800 pr-3 border-r border-slate-300">
            Generate Salary
          </h1>
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <button onClick={() => onNavigate?.('/')} className="hover:text-indigo-600 flex items-center">
              <Home className="w-3.5 h-3.5 mr-1" />
            </button>
            <span>•</span>
            <span className="hover:text-indigo-600 cursor-pointer" onClick={() => onNavigate?.('/generate-staff-salary')}>Payroll</span>
            <span>•</span>
            <span className="text-slate-800 font-medium">Generate Salary</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={exportCSV}
            title="Export CSV"
            className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 text-xs font-semibold flex items-center gap-1.5"
          >
            <FileDown className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 max-w-7xl mx-auto w-full space-y-4">
        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center space-x-3 text-xs shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              Salary successfully generated and recorded for <span className="font-bold">{selectedCount}</span> employees for month <span className="font-bold">{month}</span>!
            </div>
          </div>
        )}

        {/* Top Controls Card matching UAB 1:1 */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs items-end">
            <div>
              <label className="block font-bold text-slate-600 mb-1">Month *</label>
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-bold font-mono focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-600 mb-1">Payment Mode</label>
              <select
                value={payMode}
                onChange={(e) => setPayMode(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-semibold"
              >
                <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
                <option value="Cash">Cash</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-600 mb-1">Payment Date</label>
              <input
                type="date"
                value={payDate}
                onChange={(e) => setPayDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-mono font-semibold"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
              >
                <Calculator className="w-4 h-4" />
                <span>Generate Salary</span>
              </button>
            </div>
          </form>
        </div>

        {/* Summary Metric Header */}
        <div className="bg-slate-100 rounded-xl border border-slate-200 p-3 px-4 flex flex-wrap items-center justify-between text-xs font-bold text-slate-800">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleToggleAll}
              className="flex items-center space-x-1.5 text-indigo-600 hover:text-indigo-800"
            >
              {allSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
              <span>SELECT ALL ({selectedCount} Selected)</span>
            </button>
          </div>
          <div>
            Total Net Disbursal:{' '}
            <span className="text-emerald-700 font-mono text-sm font-extrabold">
              ₹{totalNetPayable.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Big Spreadsheet Table matching UAB 1:1 columns */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-2.5 px-3 w-10 text-center">Sel</th>
                  <th className="py-2.5 px-3 w-12 text-center">S.N.</th>
                  <th className="py-2.5 px-3">EMP.NAME</th>
                  <th className="py-2.5 px-3">A/C NO.</th>
                  <th className="py-2.5 px-3 text-right">B.S.</th>
                  <th className="py-2.5 px-3 text-right">D.A.</th>
                  <th className="py-2.5 px-3 text-right">H.R.A.</th>
                  <th className="py-2.5 px-3 text-right">CONV.</th>
                  <th className="py-2.5 px-3 text-right">GROSS SALARY</th>
                  <th className="py-2.5 px-3 text-right text-red-600">E.P.F</th>
                  <th className="py-2.5 px-3 text-right text-red-600">E.S.I</th>
                  <th className="py-2.5 px-3 text-right text-red-600">PRO.TAX</th>
                  <th className="py-2.5 px-3 text-right text-red-600">ADV./LOAN</th>
                  <th className="py-2.5 px-3 text-right font-extrabold text-indigo-900 bg-indigo-50/50">NET SALARY</th>
                  <th className="py-2.5 px-3 text-center">PAYABLE DAYS</th>
                  <th className="py-2.5 px-3 text-center">WORKING DAYS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {roster.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={s.isSelected}
                        onChange={() => handleToggleOne(s.id)}
                        className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                      />
                    </td>
                    <td className="py-2.5 px-3 text-center text-slate-500 font-bold">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">
                      [{s.code}] {s.name}
                      <span className="block text-[10px] text-slate-400 font-normal">{s.desig}</span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">{s.accNo}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold">₹{s.bs.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right font-mono">₹{s.da.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right font-mono">₹{s.hra.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right font-mono">₹{s.conv.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">₹{s.gross.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-red-600">₹{s.epf.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-red-600">₹{s.esi.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-red-600">₹{s.pt.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-red-600">₹{s.adv.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-extrabold text-emerald-700 bg-emerald-50/30 text-sm">
                      ₹{s.net.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-slate-800">{s.payableDays}</td>
                    <td className="py-2.5 px-3 text-center text-slate-500">{s.workingDays}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
