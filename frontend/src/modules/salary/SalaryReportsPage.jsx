import React, { useState, useMemo, useEffect } from 'react';
import {
  FileText,
  Download,
  Printer,
  ChevronRight,
  Search,
  RefreshCw,
  Building,
  IndianRupee,
  Calendar,
  Landmark,
  ShieldCheck,
  CheckCircle2,
  Users
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  salaryStorage,
  getAllStaffRoster
} from './salaryStore';

export function SalaryReportsPage({ onNavigate }) {
  const [reportType, setReportType] = useState('bank-advice');
  const [selectedMonth, setSelectedMonth] = useState('2026-11');
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('2026-11-01');
  const [endDate, setEndDate] = useState('2026-11-30');

  // Load data
  const [records, setRecords] = useState(() => salaryStorage.getMonthlyRecords(selectedMonth));
  const [attendance, setAttendance] = useState(() => salaryStorage.getMonthlyAttendance(selectedMonth));
  const [staffRoster, setStaffRoster] = useState(() => getAllStaffRoster());

  useEffect(() => {
    setRecords(salaryStorage.getMonthlyRecords(selectedMonth));
    setAttendance(salaryStorage.getMonthlyAttendance(selectedMonth));
    setStaffRoster(getAllStaffRoster());
  }, [selectedMonth]);

  // Report Data Compute based on reportType
  const reportData = useMemo(() => {
    if (reportType === 'bank-advice') {
      return records.map((r, idx) => ({
        srNo: idx + 1,
        code: r.code,
        name: r.name,
        bankName: r.bankName || 'State Bank of India',
        accountNumber: r.accNo || '—',
        ifscCode: r.ifsc || 'SBIN0001234',
        netSalary: r.netSalary || 0,
        payMode: r.payMode || 'NEFT',
        status: r.status || 'Pending'
      }));
    }

    if (reportType === 'payroll') {
      return records.map(r => {
        const basic = r.basicSalary ?? r.basic ?? 0;
        return {
          code: r.code,
          name: r.name,
          department: r.department,
          basic: basic,
          allowances: (r.grossSalary || 0) - basic,
          deductions: r.totalDeductions || 0,
          netSalary: r.netSalary || 0,
          paymentStatus: r.status || 'Pending'
        };
      });
    }

    if (reportType === 'outstanding') {
      return records.map(r => ({
        code: r.code,
        name: r.name,
        department: r.department,
        netSalary: r.netSalary || 0,
        paidAmount: r.status === 'Paid' ? r.netSalary : 0,
        outstanding: r.status === 'Paid' ? 0 : r.netSalary,
        status: r.status || 'Pending'
      }));
    }

    if (reportType === 'attendance') {
      return attendance.map(a => ({
        code: a.staffId?.code || '—',
        name: a.staffId?.name || 'Staff',
        department: a.staffId?.department || 'General',
        workingDays: a.workingDays || 23,
        presentDays: a.presentDays || 23,
        lopDays: a.unpaidLeaveDays || 0,
        halfDays: a.halfDays || 0,
        overtimeHours: a.overtimeHours || 0,
        deduction: a.salaryDeduction || 0
      }));
    }

    if (reportType === 'departments') {
      const map = {};
      records.forEach(r => {
        const d = r.department || 'General';
        if (!map[d]) map[d] = { department: d, count: 0, totalBasic: 0, totalGross: 0, totalNet: 0 };
        map[d].count += 1;
        map[d].totalBasic += (r.basicSalary ?? r.basic ?? 0);
        map[d].totalGross += (r.grossSalary || 0);
        map[d].totalNet += (r.netSalary || 0);
      });
      return Object.values(map);
    }

    if (reportType === 'categories') {
      const teaching = staffRoster.filter(s => s.category === 'Teaching');
      const nonTeaching = staffRoster.filter(s => s.category !== 'Teaching');
      return [
        {
          category: 'Teaching Faculty',
          headcount: teaching.length,
          totalGross: teaching.reduce((a, s) => a + (s.grossSalary || 0), 0),
          averageSalary: teaching.length > 0 ? Math.round(teaching.reduce((a, s) => a + (s.grossSalary || 0), 0) / teaching.length) : 0
        },
        {
          category: 'Support & Administrative',
          headcount: nonTeaching.length,
          totalGross: nonTeaching.reduce((a, s) => a + (s.grossSalary || 0), 0),
          averageSalary: nonTeaching.length > 0 ? Math.round(nonTeaching.reduce((a, s) => a + (s.grossSalary || 0), 0) / nonTeaching.length) : 0
        }
      ];
    }

    return [];
  }, [reportType, records, attendance, staffRoster]);

  // Search Filter
  const filteredData = useMemo(() => {
    if (!search.trim()) return reportData;
    const q = search.toLowerCase();
    return reportData.filter(row => {
      return Object.values(row).some(v => String(v).toLowerCase().includes(q));
    });
  }, [reportData, search]);

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredData.length === 0) {
      toast.error('No records available to export');
      return;
    }
    const headers = Object.keys(filteredData[0]);
    const rows = filteredData.map(row =>
      Object.values(row).map(val => `"${String(val).replace(/"/g, '""')}"`).join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${reportType}_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Report downloaded in CSV!');
  };

  // Browser Print
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="cursor-pointer hover:text-blue-600" onClick={() => onNavigate?.('/salary-hub')}>Salary Hub</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-slate-700">Reports Ledger</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">SaaS HRMS Reports Ledger</h1>
          <p className="text-sm text-slate-500">Query and compile salary balances, bank disbursement advice, attendance percentages, and category totals.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 bg-white rounded-xl text-xs font-bold shadow-soft transition-all"
          >
            <Download className="w-4 h-4 text-slate-500" /> Export Excel
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-soft hover:shadow transition-all"
          >
            <Printer className="w-4 h-4" /> Print PDF
          </button>
        </div>
      </div>

      {/* Selector Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft flex flex-wrap gap-4 items-center justify-between no-print">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Report</label>
          <select
            value={reportType}
            onChange={e => setReportType(e.target.value)}
            className="border border-slate-200 rounded-xl py-2 px-3 text-xs bg-slate-50 text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="bank-advice">Bank Transfer Advice (NEFT / RTGS)</option>
            <option value="payroll">Monthly Payroll Register</option>
            <option value="outstanding">Outstanding Salary Report</option>
            <option value="attendance">Monthly Attendance & LOP Summary</option>
            <option value="departments">Department-wise Salary Costs</option>
            <option value="categories">Teaching vs Non-Teaching Mix</option>
          </select>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-semibold">Month:</span>
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="border border-slate-200 rounded-lg py-1 px-2 text-xs bg-slate-50 text-slate-700 font-semibold focus:outline-none"
            >
              <option value="2026-11">November 2026</option>
              <option value="2026-10">October 2026</option>
              <option value="2026-09">September 2026</option>
            </select>
          </div>
        </div>

        {/* Quick Search */}
        <div className="relative min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search report records..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-xl text-xs bg-slate-50/50 text-slate-700 placeholder-slate-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Printable Sheet Area */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden" id="print-area">
        {/* Printable Header Branding */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h2 className="text-xl font-black text-slate-900">JD INTERNATIONAL SCHOOL</h2>
            <p className="text-xs text-slate-500 font-medium">
              Jaisinghpura, Bhankrota, Jaipur, Rajasthan - 302026 &bull; CBSE Affiliation: 1730000
            </p>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {reportType.replace(/-/g, ' ').toUpperCase()} REPORT
            </span>
            <p className="text-[11px] text-slate-400 font-medium mt-1">Compiled: {new Date().toLocaleDateString('en-IN')}</p>
          </div>
        </div>

        {/* Dynamic Table based on reportType */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                {reportType === 'bank-advice' && (
                  <>
                    <th className="p-3.5 pl-5">#</th>
                    <th className="p-3.5">Emp ID</th>
                    <th className="p-3.5">Beneficiary Name</th>
                    <th className="p-3.5">Bank Name</th>
                    <th className="p-3.5">Account Number</th>
                    <th className="p-3.5">IFSC Code</th>
                    <th className="p-3.5 text-right">Net Amount (₹)</th>
                    <th className="p-3.5">Mode</th>
                    <th className="p-3.5 text-center pr-5">Status</th>
                  </>
                )}

                {reportType === 'payroll' && (
                  <>
                    <th className="p-3.5 pl-5">Emp ID</th>
                    <th className="p-3.5">Name</th>
                    <th className="p-3.5">Department</th>
                    <th className="p-3.5 text-right">Base Pay (₹)</th>
                    <th className="p-3.5 text-right">Allowances (₹)</th>
                    <th className="p-3.5 text-right">Deductions (₹)</th>
                    <th className="p-3.5 text-right">Net Pay (₹)</th>
                    <th className="p-3.5 text-center pr-5">Payment Status</th>
                  </>
                )}

                {reportType === 'outstanding' && (
                  <>
                    <th className="p-3.5 pl-5">Emp ID</th>
                    <th className="p-3.5">Employee Name</th>
                    <th className="p-3.5">Department</th>
                    <th className="p-3.5 text-right">Net Salary (₹)</th>
                    <th className="p-3.5 text-right">Paid Amount (₹)</th>
                    <th className="p-3.5 text-right">Outstanding Balance (₹)</th>
                    <th className="p-3.5 text-center pr-5">Status</th>
                  </>
                )}

                {reportType === 'attendance' && (
                  <>
                    <th className="p-3.5 pl-5">Emp ID</th>
                    <th className="p-3.5">Name</th>
                    <th className="p-3.5">Department</th>
                    <th className="p-3.5 text-center">Working Days</th>
                    <th className="p-3.5 text-center">Present Days</th>
                    <th className="p-3.5 text-center">LOP Days</th>
                    <th className="p-3.5 text-center">Overtime (hrs)</th>
                    <th className="p-3.5 text-right pr-5">Salary Deduction (₹)</th>
                  </>
                )}

                {reportType === 'departments' && (
                  <>
                    <th className="p-3.5 pl-5">Department Faculty</th>
                    <th className="p-3.5 text-center">Staff Headcount</th>
                    <th className="p-3.5 text-right">Total Base Pay (₹)</th>
                    <th className="p-3.5 text-right">Total Gross Cost (₹)</th>
                    <th className="p-3.5 text-right pr-5">Net Expense (₹)</th>
                  </>
                )}

                {reportType === 'categories' && (
                  <>
                    <th className="p-3.5 pl-5">Staff Category Group</th>
                    <th className="p-3.5 text-center">Staff Headcount</th>
                    <th className="p-3.5 text-right">Total Gross Payroll (₹)</th>
                    <th className="p-3.5 text-right pr-5">Average Monthly Salary (₹)</th>
                  </>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-12 text-slate-400">
                    No records found in this report view.
                  </td>
                </tr>
              ) : (
                filteredData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    {reportType === 'bank-advice' && (
                      <>
                        <td className="p-3.5 pl-5 text-slate-400 font-mono text-[11px]">{row.srNo}</td>
                        <td className="p-3.5 font-mono font-bold text-slate-700">{row.code}</td>
                        <td className="p-3.5 font-bold text-slate-900">{row.name}</td>
                        <td className="p-3.5 text-slate-600">{row.bankName}</td>
                        <td className="p-3.5 font-mono text-slate-700">{row.accountNumber}</td>
                        <td className="p-3.5 font-mono text-slate-700">{row.ifscCode}</td>
                        <td className="p-3.5 text-right font-extrabold text-slate-900">₹{Number(row.netSalary).toLocaleString('en-IN')}</td>
                        <td className="p-3.5 font-semibold text-slate-600">{row.payMode}</td>
                        <td className="p-3.5 text-center pr-5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            row.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {row.status}
                          </span>
                        </td>
                      </>
                    )}

                    {reportType === 'payroll' && (
                      <>
                        <td className="p-3.5 pl-5 font-mono font-bold text-slate-700">{row.code}</td>
                        <td className="p-3.5 font-bold text-slate-900">{row.name}</td>
                        <td className="p-3.5 text-slate-600">{row.department}</td>
                        <td className="p-3.5 text-right font-semibold text-slate-700">₹{Number(row.basic).toLocaleString('en-IN')}</td>
                        <td className="p-3.5 text-right font-semibold text-emerald-650">+₹{Number(row.allowances).toLocaleString('en-IN')}</td>
                        <td className="p-3.5 text-right font-semibold text-red-600">-₹{Number(row.deductions).toLocaleString('en-IN')}</td>
                        <td className="p-3.5 text-right font-extrabold text-slate-900">₹{Number(row.netSalary).toLocaleString('en-IN')}</td>
                        <td className="p-3.5 text-center pr-5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                            {row.paymentStatus}
                          </span>
                        </td>
                      </>
                    )}

                    {reportType === 'outstanding' && (
                      <>
                        <td className="p-3.5 pl-5 font-mono font-bold text-slate-700">{row.code}</td>
                        <td className="p-3.5 font-bold text-slate-900">{row.name}</td>
                        <td className="p-3.5 text-slate-600">{row.department}</td>
                        <td className="p-3.5 text-right font-bold text-slate-800">₹{Number(row.netSalary).toLocaleString('en-IN')}</td>
                        <td className="p-3.5 text-right font-semibold text-emerald-600">₹{Number(row.paidAmount).toLocaleString('en-IN')}</td>
                        <td className="p-3.5 text-right font-extrabold text-red-600">₹{Number(row.outstanding).toLocaleString('en-IN')}</td>
                        <td className="p-3.5 text-center pr-5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            row.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                          }`}>
                            {row.status === 'Paid' ? 'Cleared' : 'Pending'}
                          </span>
                        </td>
                      </>
                    )}

                    {reportType === 'attendance' && (
                      <>
                        <td className="p-3.5 pl-5 font-mono font-bold text-slate-700">{row.code}</td>
                        <td className="p-3.5 font-bold text-slate-900">{row.name}</td>
                        <td className="p-3.5 text-slate-600">{row.department}</td>
                        <td className="p-3.5 text-center font-bold text-slate-700">{row.workingDays}</td>
                        <td className="p-3.5 text-center font-bold text-emerald-650">{row.presentDays}</td>
                        <td className="p-3.5 text-center font-bold text-red-600">{row.lopDays}</td>
                        <td className="p-3.5 text-center text-slate-600">{row.overtimeHours}</td>
                        <td className="p-3.5 text-right pr-5 font-extrabold text-red-600">
                          {row.deduction > 0 ? `-₹${Number(row.deduction).toLocaleString('en-IN')}` : '₹0'}
                        </td>
                      </>
                    )}

                    {reportType === 'departments' && (
                      <>
                        <td className="p-3.5 pl-5 font-bold text-slate-900">{row.department}</td>
                        <td className="p-3.5 text-center font-bold text-slate-700">{row.count}</td>
                        <td className="p-3.5 text-right font-semibold text-slate-700">₹{Number(row.totalBasic).toLocaleString('en-IN')}</td>
                        <td className="p-3.5 text-right font-extrabold text-slate-900">₹{Number(row.totalGross).toLocaleString('en-IN')}</td>
                        <td className="p-3.5 text-right pr-5 font-extrabold text-emerald-650">₹{Number(row.totalNet).toLocaleString('en-IN')}</td>
                      </>
                    )}

                    {reportType === 'categories' && (
                      <>
                        <td className="p-3.5 pl-5 font-bold text-slate-900">{row.category}</td>
                        <td className="p-3.5 text-center font-bold text-slate-700">{row.headcount}</td>
                        <td className="p-3.5 text-right font-extrabold text-slate-900">₹{Number(row.totalGross).toLocaleString('en-IN')}</td>
                        <td className="p-3.5 text-right pr-5 font-semibold text-slate-700">₹{Number(row.averageSalary).toLocaleString('en-IN')}</td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Summary Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>Total records: {filteredData.length}</span>
          {reportType === 'bank-advice' && (
            <div className="text-slate-800 font-extrabold text-xs">
              Total Disbursement Commitment: ₹{filteredData.reduce((acc, r) => acc + (Number(r.netSalary) || 0), 0).toLocaleString('en-IN')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default SalaryReportsPage;
