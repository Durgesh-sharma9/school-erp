import React, { useState, useMemo } from 'react';
import {
  FileText,
  Printer,
  FileDown,
  Calendar,
  Home,
  ChevronRight,
  Landmark,
  ShieldCheck,
  Building,
  CheckCircle2,
  Search,
  Filter,
  Users
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { tenantStore } from '../../services/tenantStore';
import { salaryStorage } from './salaryStore';

// Convert number to Indian currency words
function numberToWordsINR(amount) {
  const num = Math.round(Number(amount) || 0);
  if (num === 0) return 'Zero Rupees Only';

  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function inWords(n) {
    if (n < 20) return a[n];
    const digit = n % 10;
    if (n < 100) return b[Math.floor(n / 10)] + (digit ? ' ' + a[digit] : ' ');
    if (n < 1000) return inWords(Math.floor(n / 100)) + 'Hundred ' + (n % 100 === 0 ? '' : 'and ' + inWords(n % 100));
    return '';
  }

  let str = '';
  const crore = Math.floor(num / 10000000);
  let rem = num % 10000000;
  if (crore > 0) str += inWords(crore) + 'Crore ';

  const lakh = Math.floor(rem / 100000);
  rem %= 100000;
  if (lakh > 0) str += inWords(lakh) + 'Lakh ';

  const thousand = Math.floor(rem / 1000);
  rem %= 1000;
  if (thousand > 0) str += inWords(thousand) + 'Thousand ';

  const hundred = rem;
  if (hundred > 0) str += inWords(hundred);

  return 'Rupees ' + str.trim() + ' Only';
}

export function SalaryReportsPage({ onNavigate }) {
  const { currentSchool } = useAuth();
  const schoolId = currentSchool?.id || 'school_default';

  const [selectedMonth, setSelectedMonth] = useState('2026-11');
  const [activeTab, setActiveTab] = useState('BANK_ADVICE'); // 'BANK_ADVICE' | 'SALARY_REGISTER' | 'EPF_ESI'
  const [searchQuery, setSearchQuery] = useState('');

  const records = useMemo(() => salaryStorage.getMonthlyRecords(selectedMonth), [selectedMonth]);
  const bankSettings = useMemo(() => salaryStorage.getBankSettings(), []);

  const branding = useMemo(() => {
    try {
      const prof = tenantStore.getSchoolProfile(schoolId);
      const bImages = prof?.brandingImages || {};
      return {
        schoolName: bankSettings.schoolAccountName || prof?.schoolName || 'JD INTERNATIONAL SCHOOL',
        address: prof?.address || 'Jaisinghpura, Bhankrota, Jaipur - 302026',
        affiliation: prof?.affiliationNo ? `Affiliation No: ${prof.affiliationNo}` : 'CBSE Affiliation No: 1730000',
        logoUrl: bankSettings.logoUrl || prof?.logoUrl || bImages.school_logo || '',
        signatureUrl: bankSettings.signatureUrl || bImages.principal_sig || bImages.manager_sig || '',
        stampUrl: bankSettings.stampUrl || bImages.school_stamp || '',
        signatoryName: bankSettings.signatoryName || 'Principal',
        signatoryDesignation: bankSettings.signatoryDesignation || 'Authorized Signatory'
      };
    } catch {
      return {
        schoolName: bankSettings.schoolAccountName || 'JD INTERNATIONAL SCHOOL',
        address: 'Jaisinghpura, Bhankrota, Jaipur - 302026',
        affiliation: 'CBSE Affiliation No: 1730000',
        logoUrl: bankSettings.logoUrl || '',
        signatureUrl: bankSettings.signatureUrl || '',
        stampUrl: bankSettings.stampUrl || '',
        signatoryName: bankSettings.signatoryName || 'Principal',
        signatoryDesignation: bankSettings.signatoryDesignation || 'Authorized Signatory'
      };
    }
  }, [schoolId, bankSettings]);

  const filteredRecords = useMemo(() => {
    return records.filter(r =>
      !searchQuery.trim() ||
      r.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.bankName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [records, searchQuery]);

  const totalNet = filteredRecords.reduce((sum, r) => sum + (r.netSalary || 0), 0);
  const totalGross = filteredRecords.reduce((sum, r) => sum + (r.grossSalary || 0), 0);
  const totalEpf = filteredRecords.reduce((sum, r) => sum + (r.epf || 0), 0);
  const totalEsi = filteredRecords.reduce((sum, r) => sum + (r.esi || 0), 0);

  // Export CSV Handler based on activeTab
  const handleExportCSV = () => {
    let headers = [];
    let rows = [];
    let fileName = `Salary_Report_${activeTab}_${selectedMonth}.csv`;

    if (activeTab === 'BANK_ADVICE') {
      headers = ['S.No', 'Beneficiary Name', 'Employee Code', 'Bank Name', 'Account Number', 'IFSC Code', 'Amount (INR)', 'Narration'];
      rows = filteredRecords.map((r, i) => [
        i + 1,
        `"${r.name}"`,
        `"${r.code}"`,
        `"${r.bankName || ''}"`,
        `"${r.accNo || ''}"`,
        `"${r.ifsc || ''}"`,
        r.netSalary || 0,
        `"Salary for ${selectedMonth}"`
      ]);
    } else if (activeTab === 'EPF_ESI') {
      headers = ['S.No', 'Employee Code', 'Name', 'PF No', 'ESI No', 'Basic Pay', 'Gross Pay', 'EPF Employee (12%)', 'EPF Employer (12%)', 'ESIC Employee (0.75%)'];
      rows = filteredRecords.map((r, i) => [
        i + 1,
        `"${r.code}"`,
        `"${r.name}"`,
        `"${r.pfNo || ''}"`,
        `"${r.esiNo || ''}"`,
        r.basic || 0,
        r.grossSalary || 0,
        r.epf || 0,
        r.epf || 0,
        r.esi || 0
      ]);
    } else {
      headers = ['S.No', 'Code', 'Name', 'Department', 'Designation', 'Present Days', 'Basic', 'Allowances', 'Gross', 'EPF', 'ESIC', 'PT', 'Net Salary'];
      rows = filteredRecords.map((r, i) => [
        i + 1,
        `"${r.code}"`,
        `"${r.name}"`,
        `"${r.department}"`,
        `"${r.designation}"`,
        r.presentDays || 28,
        r.basic || 0,
        r.totalAllowances || 0,
        r.grossSalary || 0,
        r.epf || 0,
        r.esi || 0,
        r.professionalTax || 0,
        r.netSalary || 0
      ]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = fileName;
    link.click();
    toast.success(`Exported ${activeTab} report to CSV!`);
  };

  // Dedicated Formatted Print Engine for Reports
  const handlePrintReport = () => {
    const printWindow = window.open('', '_blank', 'width=950,height=900');
    if (!printWindow) {
      toast.error('Pop-up blocked. Please allow pop-ups to print reports.');
      return;
    }

    const todayDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    let tableHtml = '';
    let reportTitle = '';
    let introHtml = '';

    if (activeTab === 'BANK_ADVICE') {
      reportTitle = 'Official Bank Transfer Disbursement Advice & Remittance Schedule';
      introHtml = `
        <div style="margin-bottom: 16px; border: 1px solid #cbd5e1; border-radius: 6px; padding: 12px; background: #f8fafc; font-size: 11px; line-height: 1.6;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <div><strong>To:</strong> The Branch Manager, ${bankSettings.bankName || 'State Bank of India'}, ${bankSettings.branch || 'Bhankrota, Jaipur'}</div>
            <div><strong>Date:</strong> ${todayDate}</div>
          </div>
          <div><strong>Subject:</strong> Monthly Staff Salary Disbursement via NEFT/RTGS for <u>${selectedMonth}</u></div>
          <div style="margin-top: 6px;">
            Dear Sir/Madam, Please debit our School Current Account No. <strong>${bankSettings.accountNumber}</strong> (IFSC: <strong>${bankSettings.ifscCode}</strong>) by the total sum of <strong>₹${totalNet.toLocaleString('en-IN')}</strong> (${numberToWordsINR(totalNet)}) and credit the savings accounts of our staff members as detailed below:
          </div>
        </div>
      `;
      tableHtml = `
        <table>
          <thead>
            <tr>
              <th style="width: 35px; text-align: center;">#</th>
              <th>Beneficiary Staff Name</th>
              <th>Code</th>
              <th>Bank Name</th>
              <th>Account Number</th>
              <th>IFSC Code</th>
              <th style="text-align: right;">Net Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${filteredRecords.map((r, i) => `
              <tr>
                <td style="text-align: center;">${i + 1}</td>
                <td><strong>${r.name}</strong></td>
                <td style="font-family: monospace;">${r.code}</td>
                <td>${r.bankName || 'State Bank of India'}</td>
                <td style="font-family: monospace; font-weight: bold;">${r.accNo || '—'}</td>
                <td style="font-family: monospace;">${r.ifsc || '—'}</td>
                <td style="text-align: right; font-family: monospace; font-weight: bold; color: #047857;">₹${r.netSalary?.toLocaleString('en-IN')}</td>
              </tr>
            `).join('')}
            <tr style="background: #f1f5f9; font-weight: 900; font-size: 11px;">
              <td colspan="6" style="text-align: right;">Total Salary Remittance:</td>
              <td style="text-align: right; font-family: monospace; color: #047857;">₹${totalNet.toLocaleString('en-IN')}</td>
            </tr>
          </tbody>
        </table>
      `;
    } else if (activeTab === 'EPF_ESI') {
      reportTitle = 'Statutory EPF & ESIC Monthly Contribution Statement';
      tableHtml = `
        <table>
          <thead>
            <tr>
              <th style="width: 35px; text-align: center;">#</th>
              <th>Employee Details</th>
              <th>PF Account No</th>
              <th>ESI IP Number</th>
              <th style="text-align: right;">Basic Pay (₹)</th>
              <th style="text-align: right;">EPF 12% (₹)</th>
              <th style="text-align: right;">ESIC 0.75% (₹)</th>
              <th style="text-align: right;">Total Statutory (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${filteredRecords.map((r, i) => `
              <tr>
                <td style="text-align: center;">${i + 1}</td>
                <td><strong>${r.name}</strong> (${r.code})</td>
                <td style="font-family: monospace;">${r.pfNo || '—'}</td>
                <td style="font-family: monospace;">${r.esiNo || '—'}</td>
                <td style="text-align: right; font-family: monospace;">₹${r.basic?.toLocaleString('en-IN')}</td>
                <td style="text-align: right; font-family: monospace; color: #2563eb; font-weight: bold;">₹${r.epf?.toLocaleString('en-IN')}</td>
                <td style="text-align: right; font-family: monospace; color: #d97706; font-weight: bold;">₹${r.esi?.toLocaleString('en-IN')}</td>
                <td style="text-align: right; font-family: monospace; font-weight: 900; color: #dc2626;">₹${((r.epf || 0) + (r.esi || 0)).toLocaleString('en-IN')}</td>
              </tr>
            `).join('')}
            <tr style="background: #f1f5f9; font-weight: 900;">
              <td colspan="5" style="text-align: right;">Grand Statutory Totals:</td>
              <td style="text-align: right; font-family: monospace; color: #2563eb;">₹${totalEpf.toLocaleString('en-IN')}</td>
              <td style="text-align: right; font-family: monospace; color: #d97706;">₹${totalEsi.toLocaleString('en-IN')}</td>
              <td style="text-align: right; font-family: monospace; color: #dc2626;">₹${(totalEpf + totalEsi).toLocaleString('en-IN')}</td>
            </tr>
          </tbody>
        </table>
      `;
    } else {
      reportTitle = 'Official Monthly Staff Salary Register';
      tableHtml = `
        <table>
          <thead>
            <tr>
              <th style="width: 35px; text-align: center;">#</th>
              <th>Employee Details</th>
              <th>Department</th>
              <th style="text-align: center;">Days</th>
              <th style="text-align: right;">Basic (₹)</th>
              <th style="text-align: right;">Allowances</th>
              <th style="text-align: right;">Gross (₹)</th>
              <th style="text-align: right;">Deductions</th>
              <th style="text-align: right;">Net Salary (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${filteredRecords.map((r, i) => `
              <tr>
                <td style="text-align: center;">${i + 1}</td>
                <td><strong>${r.name}</strong><br><small style="color: #64748b;">${r.code} • ${r.designation}</small></td>
                <td>${r.department}</td>
                <td style="text-align: center;">${r.presentDays || 28}</td>
                <td style="text-align: right; font-family: monospace;">₹${r.basic?.toLocaleString('en-IN')}</td>
                <td style="text-align: right; font-family: monospace;">₹${r.totalAllowances?.toLocaleString('en-IN')}</td>
                <td style="text-align: right; font-family: monospace; font-weight: bold;">₹${r.grossSalary?.toLocaleString('en-IN')}</td>
                <td style="text-align: right; font-family: monospace; color: #dc2626;">-₹${r.totalDeductions?.toLocaleString('en-IN')}</td>
                <td style="text-align: right; font-family: monospace; font-weight: 900; color: #047857;">₹${r.netSalary?.toLocaleString('en-IN')}</td>
              </tr>
            `).join('')}
            <tr style="background: #f1f5f9; font-weight: 900;">
              <td colspan="6" style="text-align: right;">Register Totals:</td>
              <td style="text-align: right; font-family: monospace;">₹${totalGross.toLocaleString('en-IN')}</td>
              <td style="text-align: right; font-family: monospace; color: #dc2626;">-₹${filteredRecords.reduce((s, r) => s + (r.totalDeductions || 0), 0).toLocaleString('en-IN')}</td>
              <td style="text-align: right; font-family: monospace; color: #047857;">₹${totalNet.toLocaleString('en-IN')}</td>
            </tr>
          </tbody>
        </table>
      `;
    }

    const logoHtml = branding.logoUrl
      ? `<div style="margin-bottom: 4px;"><img src="${branding.logoUrl}" style="height: 48px; max-width: 140px; object-fit: contain;" alt="Logo" /></div>`
      : '';

    const sigHtml = branding.signatureUrl
      ? `<div style="height: 42px; display: flex; align-items: flex-end; justify-content: center; margin-bottom: 4px;"><img src="${branding.signatureUrl}" style="max-height: 40px; max-width: 120px; object-fit: contain;" alt="Signature" /></div>`
      : `<div style="height: 42px;"></div>`;

    const stampHtml = branding.stampUrl
      ? `<img src="${branding.stampUrl}" style="position: absolute; right: 10px; bottom: 8px; width: 56px; height: 56px; object-fit: contain; opacity: 0.65; pointer-events: none;" alt="Stamp" />`
      : '';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${reportTitle} - ${selectedMonth}</title>
        <style>
          @page { size: A4 landscape; margin: 10mm; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 11px; color: #0f172a; margin: 0; padding: 10px; }
          .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 12px; }
          .school-title { font-size: 18px; font-weight: 900; text-transform: uppercase; color: #065f46; }
          .school-sub { font-size: 10px; color: #475569; margin-top: 2px; }
          .report-heading { font-size: 13px; font-weight: 800; text-transform: uppercase; margin-top: 6px; }
          table { width: 100%; border-collapse: collapse; font-size: 10px; margin-bottom: 16px; }
          th { background: #f1f5f9; border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; font-weight: 800; text-transform: uppercase; font-size: 9px; }
          td { border: 1px solid #e2e8f0; padding: 5px 8px; }
          .footer-signs { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 40px; margin-top: 40px; text-align: center; font-weight: bold; font-size: 11px; }
          .sign-box { border-top: 1px solid #94a3b8; padding-top: 6px; }
        </style>
      </head>
      <body>
        <div class="header">
          ${logoHtml}
          <div class="school-title">${branding.schoolName}</div>
          <div class="school-sub">${branding.address} | ${branding.affiliation}</div>
          <div class="report-heading">${reportTitle} &bull; Month: ${selectedMonth}</div>
        </div>

        ${introHtml}

        ${tableHtml}

        <div class="footer-signs">
          <div>
            <div style="height: 42px;"></div>
            <div class="sign-box">Prepared by (Accountant)</div>
          </div>
          <div>
            <div style="height: 42px;"></div>
            <div class="sign-box">Verified by (Finance Officer)</div>
          </div>
          <div style="position: relative;">
            ${stampHtml}
            ${sigHtml}
            <div class="sign-box">${branding.signatoryName}<br><small style="color:#64748b; font-weight: normal;">${branding.signatoryDesignation}</small></div>
          </div>
        </div>
        <script>
          window.onload = function() { window.print(); };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 text-slate-800 space-y-5">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={() => onNavigate?.('/dashboard')}
              className="text-slate-500 hover:text-emerald-600 transition-colors flex items-center gap-1 text-xs font-medium cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              Home
            </button>
            <span className="text-slate-400 text-xs">/</span>
            <button
              onClick={() => onNavigate?.('/salary-hub')}
              className="text-slate-500 hover:text-emerald-600 transition-colors text-xs font-medium cursor-pointer"
            >
              Salary Hub
            </button>
            <span className="text-slate-400 text-xs">/</span>
            <span className="text-emerald-600 text-xs font-semibold">Salary Reports</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Landmark className="w-6 h-6 text-emerald-600" />
            Official Salary & Statutory Compliance Reports
          </h1>
          <p className="text-xs text-slate-500">
            Bank transfer disbursement advice, monthly salary registers, and statutory EPF/ESI statements.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Month Selector */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="text-xs font-extrabold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="2026-11">Nov 2026</option>
              <option value="2026-10">Oct 2026</option>
              <option value="2026-09">Sep 2026</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl shadow-2xs transition cursor-pointer"
          >
            <FileDown className="w-4 h-4 text-emerald-600" />
            Export CSV
          </button>
          <button
            type="button"
            onClick={handlePrintReport}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Print Official Report
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto text-xs font-bold">
        {[
          { id: 'BANK_ADVICE', label: 'Bank Transfer Advice (NEFT / RTGS)', icon: Landmark },
          { id: 'SALARY_REGISTER', label: 'Monthly Salary Register', icon: FileText },
          { id: 'EPF_ESI', label: 'EPF & ESIC Statutory Compliance', icon: ShieldCheck }
        ].map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border-emerald-600 text-emerald-700 font-black'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <IconComp className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search Bar & Totals */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-3.5 flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search report records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="text-xs font-bold text-slate-600">
          Total Net Payout: <span className="text-emerald-700 text-sm font-black font-mono">₹{totalNet.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Report Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          {activeTab === 'BANK_ADVICE' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-3 text-center w-12">S.No</th>
                  <th className="py-3 px-4">Beneficiary Name</th>
                  <th className="py-3 px-3">Emp Code</th>
                  <th className="py-3 px-4">Bank Name</th>
                  <th className="py-3 px-4">Account Number</th>
                  <th className="py-3 px-3">IFSC Code</th>
                  <th className="py-3 px-4 text-right">Net Amount (₹)</th>
                  <th className="py-3 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((r, i) => (
                  <tr key={r.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-3 text-center text-slate-400 font-medium">{i + 1}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{r.name}</td>
                    <td className="py-3 px-3 font-mono text-slate-500">{r.code}</td>
                    <td className="py-3 px-4 font-semibold text-slate-700">{r.bankName || 'State Bank of India'}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{r.accNo || '—'}</td>
                    <td className="py-3 px-3 font-mono text-slate-600">{r.ifsc || '—'}</td>
                    <td className="py-3 px-4 text-right font-black font-mono text-emerald-600 text-sm">
                      ₹{r.netSalary?.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {r.status || 'Approved'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'EPF_ESI' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-3 text-center w-12">S.No</th>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-3">PF Account No</th>
                  <th className="py-3 px-3">ESI Number</th>
                  <th className="py-3 px-3 text-right">Basic Pay (₹)</th>
                  <th className="py-3 px-3 text-right">EPF (12%)</th>
                  <th className="py-3 px-3 text-right">ESIC (0.75%)</th>
                  <th className="py-3 px-3 text-right">Total Statutory</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((r, i) => (
                  <tr key={r.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-3 text-center text-slate-400 font-medium">{i + 1}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{r.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{r.code}</div>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-700">{r.pfNo || '—'}</td>
                    <td className="py-3 px-3 font-mono text-slate-700">{r.esiNo || '—'}</td>
                    <td className="py-3 px-3 text-right font-bold text-slate-800 font-mono">₹{r.basic?.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-right font-bold text-blue-600 font-mono">₹{r.epf?.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-right font-bold text-amber-600 font-mono">₹{r.esi?.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-right font-black text-rose-600 font-mono">
                      ₹{((r.epf || 0) + (r.esi || 0)).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'SALARY_REGISTER' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-3 text-center w-12">S.No</th>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3 text-center">Days</th>
                  <th className="py-3 px-3 text-right">Basic (₹)</th>
                  <th className="py-3 px-3 text-right">Allowances</th>
                  <th className="py-3 px-3 text-right">Gross (₹)</th>
                  <th className="py-3 px-3 text-right">Deductions</th>
                  <th className="py-3 px-3 text-right">Net Salary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((r, i) => (
                  <tr key={r.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-3 text-center text-slate-400 font-medium">{i + 1}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{r.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{r.code}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-semibold">{r.department}</td>
                    <td className="py-3 px-3 text-center font-bold text-blue-600">{r.presentDays || 28}</td>
                    <td className="py-3 px-3 text-right font-mono font-medium text-slate-800">₹{r.basic?.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-right font-mono text-slate-600">₹{r.totalAllowances?.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">₹{r.grossSalary?.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-right font-mono font-semibold text-rose-600">-₹{r.totalDeductions?.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-right font-mono font-black text-emerald-600 text-sm">
                      ₹{r.netSalary?.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
