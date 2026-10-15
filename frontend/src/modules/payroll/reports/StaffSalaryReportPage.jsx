import React, { useState } from 'react';
import {
  Users,
  Search,
  Home,
  Printer,
  FileDown,
  FileText,
  IndianRupee,
  Eye,
  X
} from 'lucide-react';

const INITIAL_SALARY_DATA = [
  { id: '1', month: '2026-09', code: '101', name: 'ABHILASHA BHATT', desig: 'Principal', dept: 'ADMINISTRATIVE & MANAGEMENT', bs: 65000, gross: 85750, deductions: 8643, net: 77107, payMode: 'Bank Transfer', payDate: '01/10/2026', status: 'Paid' },
  { id: '2', month: '2026-09', code: '102', name: 'PRITI VERMA', desig: 'Administrator', dept: 'ADMINISTRATIVE & MANAGEMENT', bs: 42000, gross: 57000, deductions: 5667, net: 51333, payMode: 'Bank Transfer', payDate: '01/10/2026', status: 'Paid' },
  { id: '3', month: '2026-09', code: '201', name: 'MONIKA RANI VERMA', desig: 'Teacher', dept: 'TEACHING', bs: 35000, gross: 48250, deductions: 4762, net: 43488, payMode: 'Bank Transfer', payDate: '01/10/2026', status: 'Paid' },
  { id: '4', month: '2026-09', code: '202', name: 'SUNITA KUMARI', desig: 'Teacher', dept: 'TEACHING', bs: 32000, gross: 44500, deductions: 6874, net: 37626, payMode: 'Bank Transfer', payDate: '01/10/2026', status: 'Paid' },
  { id: '5', month: '2026-09', code: '501', name: 'BHARAT JANGID', desig: 'Driver', dept: 'TRANSPORT', bs: 22000, gross: 31500, deductions: 6409, net: 25091, payMode: 'Bank Transfer', payDate: '01/10/2026', status: 'Paid' },
  { id: '6', month: '2026-09', code: '502', name: 'HANSRAJ JAT', desig: 'Driver', dept: 'TRANSPORT', bs: 24000, gross: 34000, deductions: 3335, net: 30665, payMode: 'Bank Transfer', payDate: '01/10/2026', status: 'Paid' }
];

export function StaffSalaryReportPage({ onNavigate }) {
  const [data, setData] = useState(INITIAL_SALARY_DATA);
  const [month, setMonth] = useState('2026-09');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedPayslip, setSelectedPayslip] = useState(null);

  const filteredData = data.filter(item => {
    const matchesMonth = !month || item.month === month;
    const matchesDept = selectedDept === 'All' || item.dept === selectedDept;
    return matchesMonth && matchesDept;
  });

  const totalGross = filteredData.reduce((sum, s) => sum + s.gross, 0);
  const totalNet = filteredData.reduce((sum, s) => sum + s.net, 0);
  const totalDed = filteredData.reduce((sum, s) => sum + s.deductions, 0);

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["S.No,Emp Code,Name,Designation,Department,Basic Salary,Gross Salary,Deductions,Net Salary,Payment Mode,Payment Date,Status"].concat(
        filteredData.map((s, i) =>
          `"${i + 1}","${s.code}","${s.name}","${s.desig}","${s.dept}","${s.bs}","${s.gross}","${s.deductions}","${s.net}","${s.payMode}","${s.payDate}","${s.status}"`
        )
      ).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `staff_salary_report_${month}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1:1 Secondary Top Header Toolbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20 print:hidden">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-bold text-slate-800 pr-3 border-r border-slate-300">
            Staff Salary Report
          </h1>
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <button onClick={() => onNavigate?.('/')} className="hover:text-indigo-600 flex items-center">
              <Home className="w-3.5 h-3.5 mr-1" />
            </button>
            <span>•</span>
            <span className="hover:text-indigo-600 cursor-pointer" onClick={() => onNavigate?.('/payroll-reports')}>Payroll</span>
            <span>•</span>
            <span className="text-slate-800 font-medium">Salary Report</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={exportCSV}
            title="Export CSV"
            className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 text-xs font-semibold flex items-center gap-1.5"
          >
            <FileDown className="w-4 h-4" />
            <span className="hidden sm:inline">Excel</span>
          </button>
          <button
            onClick={() => window.print()}
            title="Print"
            className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 text-xs font-semibold flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 max-w-7xl mx-auto w-full space-y-4">
        {/* Filters Card matching UAB 1:1 */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs print:hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs items-end">
            <div>
              <label className="block font-bold text-slate-600 mb-1">Month</label>
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-slate-50 font-bold font-mono focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-600 mb-1">Department</label>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-slate-50 font-semibold"
              >
                <option value="All">All Departments</option>
                <option value="TEACHING">TEACHING</option>
                <option value="ADMINISTRATIVE & MANAGEMENT">ADMINISTRATIVE & MANAGEMENT</option>
                <option value="TRANSPORT">TRANSPORT</option>
              </select>
            </div>

            <div>
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg border border-slate-300 flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Bulk Print Payslips</span>
              </button>
            </div>
          </div>
        </div>

        {/* Totals Metric Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Gross Payroll</span>
            <div className="text-xl font-extrabold text-slate-900 mt-1 font-mono">
              ₹{totalGross.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Deductions</span>
            <div className="text-xl font-extrabold text-red-600 mt-1 font-mono">
              ₹{totalDed.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Net Disbursed</span>
            <div className="text-xl font-extrabold text-emerald-600 mt-1 font-mono">
              ₹{totalNet.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Table View matching UAB 1:1 */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4 w-14 text-center">S.No.</th>
                  <th className="py-3 px-4 w-28 font-mono">Emp Code</th>
                  <th className="py-3 px-4">Employee Name</th>
                  <th className="py-3 px-4">Designation</th>
                  <th className="py-3 px-4 text-right">Basic Salary</th>
                  <th className="py-3 px-4 text-right">Gross</th>
                  <th className="py-3 px-4 text-right text-red-600">Deductions</th>
                  <th className="py-3 px-4 text-right font-bold text-indigo-900">Net Salary</th>
                  <th className="py-3 px-4 text-center">Mode</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 w-24 text-center">Payslip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredData.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center font-bold text-slate-500">{idx + 1}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">{s.code}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{s.name}</td>
                    <td className="py-3.5 px-4 text-slate-600">{s.desig}</td>
                    <td className="py-3.5 px-4 text-right font-mono">₹{s.bs.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-800">₹{s.gross.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-right font-mono text-red-600">₹{s.deductions.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-extrabold text-emerald-700 bg-emerald-50/30">
                      ₹{s.net.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-center text-slate-500 text-[11px]">{s.payMode}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => setSelectedPayslip(s)}
                        className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded text-xs font-bold"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Payslip Modal */}
      {selectedPayslip && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 p-6 space-y-4">
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm uppercase">J D International School</h3>
                <p className="text-[11px] text-slate-500">Official Payslip • Month: {selectedPayslip.month}</p>
              </div>
              <button onClick={() => setSelectedPayslip(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div><span className="text-slate-500">Name:</span> <span className="font-bold">{selectedPayslip.name}</span></div>
              <div><span className="text-slate-500">Emp Code:</span> <span className="font-bold">{selectedPayslip.code}</span></div>
              <div><span className="text-slate-500">Designation:</span> <span className="font-bold">{selectedPayslip.desig}</span></div>
              <div><span className="text-slate-500">Department:</span> <span className="font-bold">{selectedPayslip.dept}</span></div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="border border-slate-200 rounded-lg p-3 space-y-1 bg-emerald-50/20">
                <div className="font-bold text-emerald-800 border-b border-emerald-200 pb-1 mb-1">Earnings</div>
                <div className="flex justify-between"><span>Basic Salary:</span> <span className="font-mono font-bold">₹{selectedPayslip.bs}</span></div>
                <div className="flex justify-between"><span>Allowances:</span> <span className="font-mono font-bold">₹{selectedPayslip.gross - selectedPayslip.bs}</span></div>
                <div className="flex justify-between pt-1 border-t border-slate-200 font-bold"><span>Gross Total:</span> <span className="font-mono text-emerald-700">₹{selectedPayslip.gross}</span></div>
              </div>

              <div className="border border-slate-200 rounded-lg p-3 space-y-1 bg-red-50/20">
                <div className="font-bold text-red-800 border-b border-red-200 pb-1 mb-1">Deductions</div>
                <div className="flex justify-between"><span>EPF / ESI / PT:</span> <span className="font-mono font-bold">₹{selectedPayslip.deductions}</span></div>
                <div className="flex justify-between"><span>Advance Ded.:</span> <span className="font-mono font-bold">₹0</span></div>
                <div className="flex justify-between pt-1 border-t border-slate-200 font-bold"><span>Total Deductions:</span> <span className="font-mono text-red-700">₹{selectedPayslip.deductions}</span></div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 flex justify-between items-center text-xs font-bold text-indigo-900">
              <span>Net Take-Home Disbursed:</span>
              <span className="text-lg font-mono font-extrabold text-emerald-700">₹{selectedPayslip.net.toLocaleString()}</span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Payslip</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
