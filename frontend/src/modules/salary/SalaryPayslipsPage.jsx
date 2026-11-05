import React, { useState, useMemo, useEffect } from 'react';
import {
  FileText,
  Printer,
  Download,
  Mail,
  Search,
  Calendar,
  Building,
  CheckCircle2,
  Users,
  ShieldCheck,
  ChevronRight,
  IndianRupee,
  RefreshCcw,
  Eye,
  Check,
  X,
  Sparkles,
  ArrowDownToLine
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  salaryStorage,
  DEFAULT_MONTHLY_CONFIG,
  calculateSalaryDetails
} from './salaryStore';

// Convert number to Indian currency words
export const convertNumberToWords = (num) => {
  const n = Math.round(Math.max(0, Number(num) || 0));
  if (n === 0) return 'Rupees Zero Only';

  const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 
                 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const convertLessThanOneThousand = (val) => {
    let str = '';
    if (val >= 100) {
      str += units[Math.floor(val / 100)] + ' Hundred ';
      val %= 100;
    }
    if (val >= 20) {
      str += tens[Math.floor(val / 10)] + ' ';
      val %= 10;
    }
    if (val > 0) {
      str += units[val] + ' ';
    }
    return str.trim();
  };

  let words = '';
  let integerPart = n;

  if (integerPart >= 10000000) {
    words += convertLessThanOneThousand(Math.floor(integerPart / 10000000)) + ' Crore ';
    integerPart %= 10000000;
  }
  if (integerPart >= 100000) {
    words += convertLessThanOneThousand(Math.floor(integerPart / 100000)) + ' Lakh ';
    integerPart %= 100000;
  }
  if (integerPart >= 1000) {
    words += convertLessThanOneThousand(Math.floor(integerPart / 1000)) + ' Thousand ';
    integerPart %= 1000;
  }
  if (integerPart > 0) {
    words += convertLessThanOneThousand(integerPart) + ' ';
  }

  return `Rupees ${words.trim()} Only`;
};

export function SalaryPayslipsPage({ onNavigate }) {
  const [selectedMonth, setSelectedMonth] = useState('2026-11');
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [selectedSlip, setSelectedSlip] = useState(null);

  // Month list for dropdown
  const monthsList = [
    { key: '2026-11', label: 'November 2026' },
    { key: '2026-10', label: 'October 2026' },
    { key: '2026-09', label: 'September 2026' },
    { key: '2026-08', label: 'August 2026' },
    { key: '2026-07', label: 'July 2026' }
  ];

  // Records for current month
  const [records, setRecords] = useState(() => salaryStorage.getMonthlyRecords(selectedMonth));
  const [attendance, setAttendance] = useState(() => salaryStorage.getMonthlyAttendance(selectedMonth));

  useEffect(() => {
    setRecords(salaryStorage.getMonthlyRecords(selectedMonth));
    setAttendance(salaryStorage.getMonthlyAttendance(selectedMonth));
  }, [selectedMonth]);

  // Departments list
  const departments = useMemo(() => {
    const set = new Set(records.map(r => r.department).filter(Boolean));
    return Array.from(set);
  }, [records]);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      if (deptFilter && r.department !== deptFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const mName = r.name?.toLowerCase().includes(q);
        const mCode = r.code?.toLowerCase().includes(q);
        const mDesg = r.designation?.toLowerCase().includes(q);
        if (!mName && !mCode && !mDesg) return false;
      }
      return true;
    });
  }, [records, deptFilter, search]);

  // Financial KPI totals
  const totalGross = filteredRecords.reduce((acc, r) => acc + (r.grossSalary || 0), 0);
  const totalNet = filteredRecords.reduce((acc, r) => acc + (r.netSalary || 0), 0);
  const totalDeductions = filteredRecords.reduce((acc, r) => acc + (r.totalDeductions || 0), 0);
  const totalAdvances = filteredRecords.reduce((acc, r) => acc + (r.advanceRecovery || 0), 0);

  // HTML Payslip Generator for Printing and PDF
  const generateSlipHtml = (slip) => {
    const att = attendance.find(a => a.staffId?.id === slip.staffId || a.staffId?.code === slip.code) || {};
    const workingDays = att.workingDays || 23;
    const lopDays = att.unpaidLeaveDays || 0;
    const paidDays = Math.max(0, workingDays - lopDays);
    const presentDays = att.presentDays || (workingDays - lopDays);
    const words = convertNumberToWords(slip.netSalary);

    return `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 24px; color: #1e293b; background: #fff;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 20px;">
          <div style="display: flex; align-items: center; gap: 14px;">
            <div style="background: #eff6ff; border: 1px solid #bfdbfe; width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 24px; font-weight: 900; color: #2563eb;">🏛️</span>
            </div>
            <div>
              <h1 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 0;">Greenwood High School</h1>
              <p style="font-size: 11px; color: #64748b; margin: 2px 0 0 0;">123, Varthur Road, Near Prestige Lakeside, Gunjur, Bengaluru, KA 560087</p>
              <p style="font-size: 11px; color: #64748b; margin: 2px 0 0 0;">Affiliation No: 1730000 &bull; Tel: +91 80 2200 6000 &bull; Email: info@greenwood.edu</p>
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 11px; font-weight: 800; color: #2563eb; text-transform: uppercase; letter-spacing: 0.5px;">Monthly Salary Slip</div>
            <div style="font-size: 12px; font-weight: 700; color: #1e293b; margin-top: 4px;">Pay Period: November 2026</div>
          </div>
        </div>

        <!-- Employee Info Two Columns -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 14px; border-radius: 12px; font-size: 11px; margin-bottom: 20px;">
          <div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;"><span style="color: #64748b;">Employee Name:</span> <strong style="color: #0f172a;">${slip.name}</strong></div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;"><span style="color: #64748b;">Employee ID:</span> <strong style="color: #0f172a;">${slip.code}</strong></div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;"><span style="color: #64748b;">Designation:</span> <span>${slip.designation}</span></div>
            <div style="display: flex; justify-content: space-between;"><span style="color: #64748b;">Department:</span> <span>${slip.department}</span></div>
          </div>
          <div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;"><span style="color: #64748b;">Bank Name:</span> <span>${slip.bankName || 'State Bank of India'}</span></div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;"><span style="color: #64748b;">Account No:</span> <span>${slip.accNo || '—'}</span></div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;"><span style="color: #64748b;">IFSC Code:</span> <span>${slip.ifsc || 'SBIN0001234'}</span></div>
            <div style="display: flex; justify-content: space-between;"><span style="color: #64748b;">PAN:</span> <span>${slip.pan || 'ABCDE1234F'}</span></div>
          </div>
        </div>

        <!-- Attendance Summary -->
        <div style="margin-bottom: 20px;">
          <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #475569; margin-bottom: 6px;">Attendance Summary</div>
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0; font-size: 11px; text-align: center;">
            <tr style="background: #f8fafc; font-weight: 700; color: #475569; border-bottom: 1px solid #e2e8f0;">
              <th style="padding: 6px; border-right: 1px solid #e2e8f0;">Working Days</th>
              <th style="padding: 6px; border-right: 1px solid #e2e8f0;">Present Days</th>
              <th style="padding: 6px; border-right: 1px solid #e2e8f0;">Absent Days</th>
              <th style="padding: 6px; border-right: 1px solid #e2e8f0;">Paid Leave</th>
              <th style="padding: 6px; border-right: 1px solid #e2e8f0; color: #ef4444;">LOP Days</th>
              <th style="padding: 6px; color: #16a34a;">Paid Days</th>
            </tr>
            <tr style="font-weight: 600;">
              <td style="padding: 6px; border-right: 1px solid #e2e8f0;">${workingDays}</td>
              <td style="padding: 6px; border-right: 1px solid #e2e8f0;">${presentDays}</td>
              <td style="padding: 6px; border-right: 1px solid #e2e8f0;">${lopDays}</td>
              <td style="padding: 6px; border-right: 1px solid #e2e8f0;">0</td>
              <td style="padding: 6px; border-right: 1px solid #e2e8f0; color: #ef4444;">${lopDays}</td>
              <td style="padding: 6px; color: #16a34a;">${paidDays}</td>
            </tr>
          </table>
        </div>

        <!-- Side-by-Side Tables -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; font-size: 11px; margin-bottom: 20px;">
          <!-- Earnings -->
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0;">
            <tr style="background: #f8fafc; font-weight: 700; color: #475569; border-bottom: 1px solid #e2e8f0;">
              <th style="padding: 6px 8px; text-align: left; border-right: 1px solid #e2e8f0;">Earnings Component</th>
              <th style="padding: 6px 8px; text-align: right;">Amount (INR)</th>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 5px 8px; border-right: 1px solid #e2e8f0;">Basic Pay</td><td style="padding: 5px 8px; text-align: right; font-weight: 600;">₹${(slip.basicSalary || 0).toLocaleString('en-IN')}</td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 5px 8px; border-right: 1px solid #e2e8f0;">House Rent Allowance (HRA)</td><td style="padding: 5px 8px; text-align: right; font-weight: 600;">₹${(slip.hra || Math.round((slip.basicSalary || 0) * 0.4)).toLocaleString('en-IN')}</td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 5px 8px; border-right: 1px solid #e2e8f0;">Special Allowance</td><td style="padding: 5px 8px; text-align: right; font-weight: 600;">₹${(slip.specialAllowance || Math.round((slip.grossSalary || 0) * 0.1)).toLocaleString('en-IN')}</td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 5px 8px; border-right: 1px solid #e2e8f0;">Transport Allowance</td><td style="padding: 5px 8px; text-align: right; font-weight: 600;">₹1,800</td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 5px 8px; border-right: 1px solid #e2e8f0;">Medical Allowance</td><td style="padding: 5px 8px; text-align: right; font-weight: 600;">₹1,250</td></tr>
            <tr style="background: #f8fafc; font-weight: 800; border-top: 1px solid #e2e8f0;">
              <td style="padding: 6px 8px; border-right: 1px solid #e2e8f0;">Gross Earnings</td>
              <td style="padding: 6px 8px; text-align: right; color: #0f172a;">₹${(slip.grossSalary || 0).toLocaleString('en-IN')}</td>
            </tr>
          </table>

          <!-- Deductions -->
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0;">
            <tr style="background: #f8fafc; font-weight: 700; color: #475569; border-bottom: 1px solid #e2e8f0;">
              <th style="padding: 6px 8px; text-align: left; border-right: 1px solid #e2e8f0;">Deductions Component</th>
              <th style="padding: 6px 8px; text-align: right;">Amount (INR)</th>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 5px 8px; border-right: 1px solid #e2e8f0;">Provident Fund (EPF)</td><td style="padding: 5px 8px; text-align: right; font-weight: 600;">₹${(slip.epfDeduction || 1800).toLocaleString('en-IN')}</td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 5px 8px; border-right: 1px solid #e2e8f0;">ESI Contribution</td><td style="padding: 5px 8px; text-align: right; font-weight: 600;">₹${(slip.esiDeduction || 0).toLocaleString('en-IN')}</td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 5px 8px; border-right: 1px solid #e2e8f0;">Professional Tax</td><td style="padding: 5px 8px; text-align: right; font-weight: 600;">₹${(slip.profTax || 200).toLocaleString('en-IN')}</td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 5px 8px; border-right: 1px solid #e2e8f0;">Loss of Pay (LOP)</td><td style="padding: 5px 8px; text-align: right; font-weight: 600; color: #ef4444;">₹${(slip.otherDeductions || 0).toLocaleString('en-IN')}</td></tr>
            <tr style="background: #f8fafc; font-weight: 800; border-top: 1px solid #e2e8f0;">
              <td style="padding: 6px 8px; border-right: 1px solid #e2e8f0;">Total Deductions</td>
              <td style="padding: 6px 8px; text-align: right; color: #dc2626;">₹${(slip.totalDeductions || 0).toLocaleString('en-IN')}</td>
            </tr>
          </table>
        </div>

        <!-- Highlighted Net Salary -->
        <div style="background: #ecfdf5; border: 1.5px solid #10b981; border-radius: 12px; padding: 14px 18px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <div>
            <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #047857; letter-spacing: 0.5px;">Net Disbursed Pay</div>
            <div style="font-size: 11px; font-weight: 700; color: #064e3b; margin-top: 2px;">${words}</div>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 22px; font-weight: 900; color: #065f46;">₹${(slip.netSalary || 0).toLocaleString('en-IN')}</span>
          </div>
        </div>

        <!-- Footer -->
        <div style="border-top: 1px solid #e2e8f0; padding-top: 14px; text-align: center; font-size: 10px; color: #94a3b8;">
          <p style="margin: 0;">This is a system-generated payslip and does not require a physical signature.</p>
          <p style="margin: 3px 0 0 0;">Greenwood High School HRMS & Payroll System &bull; Generated: ${new Date().toLocaleDateString('en-IN')}</p>
        </div>
      </div>
    `;
  };

  // Single Print
  const handlePrintSlip = (slip) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${slip.name}_Payslip_November_2026</title>
          <style>
            @page { size: A4 portrait; margin: 12mm; }
            body { margin: 0; background: #fff; font-family: sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          </style>
        </head>
        <body>
          ${generateSlipHtml(slip)}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 400);
  };

  // Batch Print All 45 Payslips
  const handleBatchPrintAll = () => {
    const printWindow = window.open('', '_blank');
    const allSlipsHtml = filteredRecords.map(slip => `
      <div style="page-break-after: always; padding-bottom: 20px;">
        ${generateSlipHtml(slip)}
      </div>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Batch_Payslips_November_2026</title>
          <style>
            @page { size: A4 portrait; margin: 12mm; }
            body { margin: 0; background: #fff; font-family: sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          </style>
        </head>
        <body>
          ${allSlipsHtml}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 600);
    toast.success(`Prepared ${filteredRecords.length} payslips for batch printing!`);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Employee ID', 'Name', 'Department', 'Designation', 'Gross Pay', 'Basic Pay', 'Total Additions', 'Total Deductions', 'Net Settled', 'Status'];
    const rows = filteredRecords.map(r => [
      r.code,
      `"${r.name}"`,
      `"${r.department}"`,
      `"${r.designation}"`,
      r.grossSalary,
      r.basicSalary,
      r.grossSalary - r.basicSalary,
      r.totalDeductions,
      r.netSalary,
      r.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Payslips_Ledger_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Payslips exported to CSV!');
  };

  // Simulated Email Dispatch
  const handleEmailSlip = (slip) => {
    toast.success(`Payslip sent via email to ${slip.email || slip.name}`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="cursor-pointer hover:text-blue-600" onClick={() => onNavigate?.('/salary-hub')}>Salary Hub</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-slate-700">Payslips Studio</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Payslips & Statements</h1>
          <p className="text-sm text-slate-500">Reconcile salary payments and print verified PDF monthly statements.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 bg-white rounded-xl text-xs font-bold shadow-soft transition-all"
          >
            <Download className="w-4 h-4 text-slate-500" /> Export CSV
          </button>
          <button
            onClick={handleBatchPrintAll}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-soft hover:shadow transition-all"
          >
            <Printer className="w-4 h-4" /> Batch Print All ({filteredRecords.length})
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Generated Payslips</span>
            <FileText className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-800">{filteredRecords.length}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">100% Ready for issuance</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Total Gross Pay</span>
            <IndianRupee className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-800">₹{totalGross.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Approved basic + allowances</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Total Net Settled</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-650">₹{totalNet.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Net bank disbursement</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Total Deductions</span>
            <ShieldCheck className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-extrabold text-red-600">-₹{totalDeductions.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">EPF, ESI, PT & LOP days</div>
        </div>
      </div>

      {/* Filter and Month Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft flex flex-wrap items-center gap-3">
        {/* Month Selector */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border border-slate-200 rounded-xl py-2 px-3 text-xs bg-slate-50 text-slate-800 font-bold focus:outline-none"
          >
            {monthsList.map(m => (
              <option key={m.key} value={m.key}>{m.label}</option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search employee name, code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50/50 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {/* Department Filter */}
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="border border-slate-200 rounded-xl py-2 px-3 text-xs bg-slate-50/50 text-slate-700 font-medium focus:outline-none"
        >
          <option value="">All Departments</option>
          {departments.map((d, idx) => (
            <option key={idx} value={d}>{d}</option>
          ))}
        </select>

        {(search || deptFilter) && (
          <button
            onClick={() => {
              setSearch('');
              setDeptFilter('');
            }}
            className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"
          >
            <RefreshCcw className="w-3.5 h-3.5" /> Clear
          </button>
        )}
      </div>

      {/* Main Payslips Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="p-3.5 pl-5">Employee</th>
                <th className="p-3.5">Month/Period</th>
                <th className="p-3.5 text-right">Base Pay</th>
                <th className="p-3.5 text-right">Total Additions</th>
                <th className="p-3.5 text-right">Total Deductions</th>
                <th className="p-3.5 text-right">Advance Ded.</th>
                <th className="p-3.5 text-right">Net Settled</th>
                <th className="p-3.5 text-center pr-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-slate-400">
                    No payslip records matching filter criteria.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((slip) => {
                  const additions = Math.max(0, (slip.grossSalary || 0) - (slip.basicSalary || 0));
                  return (
                    <tr key={slip.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 pl-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs border border-blue-200 shadow-inner flex-shrink-0">
                            {slip.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 leading-tight">{slip.name}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{slip.code} &bull; {slip.designation}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5 text-slate-600 font-medium">
                        November 2026
                      </td>

                      <td className="p-3.5 text-right font-semibold text-slate-600">
                        ₹{(slip.basicSalary || 0).toLocaleString('en-IN')}
                      </td>

                      <td className="p-3.5 text-right font-semibold text-emerald-600">
                        +₹{additions.toLocaleString('en-IN')}
                      </td>

                      <td className="p-3.5 text-right font-semibold text-red-600">
                        -₹{(slip.totalDeductions || 0).toLocaleString('en-IN')}
                      </td>

                      <td className="p-3.5 text-right font-semibold text-red-500">
                        -₹{(slip.advanceRecovery || 0).toLocaleString('en-IN')}
                      </td>

                      <td className="p-3.5 text-right font-extrabold text-slate-800">
                        ₹{(slip.netSalary || 0).toLocaleString('en-IN')}
                      </td>

                      <td className="p-3.5 pr-5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setSelectedSlip(slip)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg text-xs transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5" /> View
                          </button>
                          <button
                            onClick={() => handlePrintSlip(slip)}
                            className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-lg transition-colors"
                            title="Print Slip"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>{filteredRecords.length} payslips available in November 2026</span>
          <div className="flex items-center gap-4 text-slate-600 font-semibold">
            <span>Gross: ₹{totalGross.toLocaleString('en-IN')}</span>
            <span className="text-emerald-700 font-bold">Net Total: ₹{totalNet.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* --- PAYSLIP PREVIEW MODAL --- */}
      {selectedSlip && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6 animate-scaleUp">
            {/* Modal Header Bar */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-extrabold text-slate-800">Payslip Statement Preview</span>
              </div>
              <button
                onClick={() => setSelectedSlip(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-200 text-slate-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Embedded Live Slip */}
            <div className="p-6 max-h-[72vh] overflow-y-auto bg-slate-100/50">
              <div
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
                dangerouslySetInnerHTML={{ __html: generateSlipHtml(selectedSlip) }}
              />
            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 border-t border-slate-100 bg-white flex justify-between items-center">
              <button
                onClick={() => handleEmailSlip(selectedSlip)}
                className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-soft transition-colors"
              >
                <Mail className="w-3.5 h-3.5" /> Email Slip
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePrintSlip(selectedSlip)}
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-soft transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Statement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default SalaryPayslipsPage;
