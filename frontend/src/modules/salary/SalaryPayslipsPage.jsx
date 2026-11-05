import React, { useState, useMemo } from 'react';
import {
  FileText,
  Printer,
  Download,
  Search,
  Calendar,
  Home,
  ChevronRight,
  Building,
  CheckCircle2,
  Users,
  ShieldCheck,
  CreditCard,
  School
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

export function SalaryPayslipsPage({ onNavigate }) {
  const { currentSchool } = useAuth();
  const schoolId = currentSchool?.id || 'school_default';
  const [bankSettings, setBankSettings] = useState(() => salaryStorage.getBankSettings());

  // Listen for live updates from settings page
  React.useEffect(() => {
    const handleUpdate = () => {
      setBankSettings(salaryStorage.getBankSettings());
    };
    window.addEventListener('school_salary_settings_updated', handleUpdate);
    return () => window.removeEventListener('school_salary_settings_updated', handleUpdate);
  }, []);

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

  const [selectedMonth, setSelectedMonth] = useState('2026-11');
  const [searchQuery, setSearchQuery] = useState('');
  const records = useMemo(() => salaryStorage.getMonthlyRecords(selectedMonth), [selectedMonth]);
  const [selectedStaffId, setSelectedStaffId] = useState(() => {
    try {
      const stored = localStorage.getItem('salary_payslip_selected_staff');
      if (stored && records.some(r => r.id === stored)) return stored;
    } catch {}
    return records[0]?.id || '';
  });

  const filteredRecords = useMemo(() => {
    return records.filter(r =>
      !searchQuery.trim() ||
      r.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.department?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [records, searchQuery]);

  const activeSlip = useMemo(() => {
    return records.find(r => r.id === selectedStaffId) || records[0];
  }, [records, selectedStaffId]);

  const handlePrintSlip = () => {
    if (!activeSlip) return;
    const printWindow = window.open('', '_blank', 'width=850,height=900');
    if (!printWindow) {
      toast.error('Pop-up blocked. Please allow pop-ups to print payslips.');
      return;
    }

    const logoHtml = branding.logoUrl
      ? `<div style="margin-bottom: 6px;"><img src="${branding.logoUrl}" style="height: 50px; max-width: 140px; object-fit: contain;" alt="School Logo" /></div>`
      : '';

    const sigHtml = branding.signatureUrl
      ? `<div style="height: 48px; display: flex; align-items: flex-end; justify-content: center; margin-bottom: 4px;"><img src="${branding.signatureUrl}" style="max-height: 46px; max-width: 130px; object-fit: contain;" alt="Signature" /></div>`
      : `<div style="height: 48px;"></div>`;

    const stampHtml = branding.stampUrl
      ? `<img src="${branding.stampUrl}" style="position: absolute; right: 10px; bottom: 12px; width: 62px; height: 62px; object-fit: contain; opacity: 0.65; pointer-events: none;" alt="Stamp" />`
      : '';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Payslip - ${activeSlip.name} (${selectedMonth})</title>
        <style>
          @page { size: A4 portrait; margin: 12mm; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #0f172a; margin: 0; padding: 10px; }
          .payslip-box { border: 2px solid #0f172a; border-radius: 8px; padding: 20px; }
          .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 14px; }
          .school-name { font-size: 20px; font-weight: 900; letter-spacing: 0.5px; text-transform: uppercase; color: #065f46; margin-bottom: 2px; }
          .school-sub { font-size: 11px; color: #475569; }
          .slip-title { font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-top: 8px; background: #f1f5f9; padding: 4px; border-radius: 4px; display: inline-block; }
          .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 11px; margin-bottom: 14px; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; }
          .meta-row { display: flex; justify-content: space-between; padding: 2px 0; }
          .meta-label { color: #64748b; font-weight: 600; }
          .meta-val { font-weight: 700; color: #0f172a; }
          .tables-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
          table { width: 100%; border-collapse: collapse; font-size: 11px; }
          th { background: #f8fafc; border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; font-weight: 800; font-size: 10px; text-transform: uppercase; }
          td { border: 1px solid #e2e8f0; padding: 5px 8px; }
          .net-box { background: #f0fdf4; border: 2px solid #059669; border-radius: 6px; padding: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
          .net-amt { font-size: 18px; font-weight: 900; color: #047857; }
          .words { font-size: 10px; font-weight: 700; color: #065f46; font-style: italic; }
          .footer-signs { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; text-align: center; margin-top: 40px; font-size: 11px; font-weight: 700; color: #334155; }
          .sign-line { border-top: 1px solid #94a3b8; padding-top: 6px; }
        </style>
      </head>
      <body>
        <div class="payslip-box">
          <div class="header">
            ${logoHtml}
            <div class="school-name">${branding.schoolName}</div>
            <div class="school-sub">${branding.address} | ${branding.affiliation}</div>
            <div class="slip-title">Salary Payslip &bull; Month: ${selectedMonth}</div>
          </div>

          <div class="meta-grid">
            <div>
              <div class="meta-row"><span class="meta-label">Employee Code:</span><span class="meta-val">${activeSlip.code}</span></div>
              <div class="meta-row"><span class="meta-label">Employee Name:</span><span class="meta-val">${activeSlip.name}</span></div>
              <div class="meta-row"><span class="meta-label">Designation:</span><span class="meta-val">${activeSlip.designation}</span></div>
              <div class="meta-row"><span class="meta-label">Department:</span><span class="meta-val">${activeSlip.department}</span></div>
              <div class="meta-row"><span class="meta-label">Payable Days:</span><span class="meta-val">${activeSlip.presentDays || 28} / ${activeSlip.totalDays || 30} Days</span></div>
            </div>
            <div>
              <div class="meta-row"><span class="meta-label">Bank Name:</span><span class="meta-val">${activeSlip.bankName || 'State Bank of India'}</span></div>
              <div class="meta-row"><span class="meta-label">Bank A/C No:</span><span class="meta-val">${activeSlip.accNo || '—'}</span></div>
              <div class="meta-row"><span class="meta-label">IFSC Code:</span><span class="meta-val">${activeSlip.ifsc || '—'}</span></div>
              <div class="meta-row"><span class="meta-label">PAN Number:</span><span class="meta-val">${activeSlip.pan || '—'}</span></div>
              <div class="meta-row"><span class="meta-label">PF Number:</span><span class="meta-val">${activeSlip.pfNo || '—'}</span></div>
            </div>
          </div>

          <div class="tables-grid">
            <div>
              <table>
                <thead>
                  <tr><th>Earnings Component</th><th style="text-align:right">Amount (₹)</th></tr>
                </thead>
                <tbody>
                  <tr><td>Basic Salary</td><td style="text-align:right;font-weight:700">₹${activeSlip.basic?.toLocaleString('en-IN')}</td></tr>
                  ${activeSlip.allowancesBreakdown ? Object.entries(activeSlip.allowancesBreakdown).map(([k, v]) => `
                    <tr><td style="text-transform:uppercase">${k} Allowance</td><td style="text-align:right">₹${Number(v)?.toLocaleString('en-IN')}</td></tr>
                  `).join('') : ''}
                  ${activeSlip.bonus > 0 ? `<tr><td style="font-weight:700">Performance Bonus</td><td style="text-align:right">₹${activeSlip.bonus?.toLocaleString('en-IN')}</td></tr>` : ''}
                  <tr style="background:#f8fafc;font-weight:800">
                    <td>TOTAL GROSS EARNINGS</td>
                    <td style="text-align:right;color:#047857">₹${activeSlip.grossSalary?.toLocaleString('en-IN')}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <table>
                <thead>
                  <tr><th>Deductions & Statutory</th><th style="text-align:right">Amount (₹)</th></tr>
                </thead>
                <tbody>
                  <tr><td>Provident Fund (EPF 12%)</td><td style="text-align:right">₹${activeSlip.epf?.toLocaleString('en-IN')}</td></tr>
                  <tr><td>ESI Contribution</td><td style="text-align:right">₹${activeSlip.esi?.toLocaleString('en-IN')}</td></tr>
                  <tr><td>Professional Tax (PT)</td><td style="text-align:right">₹${activeSlip.professionalTax?.toLocaleString('en-IN')}</td></tr>
                  ${activeSlip.advanceRecovery > 0 ? `<tr><td>Salary Advance Recovery</td><td style="text-align:right">₹${activeSlip.advanceRecovery?.toLocaleString('en-IN')}</td></tr>` : ''}
                  ${activeSlip.tds > 0 ? `<tr><td>TDS / Tax Deduction</td><td style="text-align:right">₹${activeSlip.tds?.toLocaleString('en-IN')}</td></tr>` : ''}
                  <tr style="background:#f8fafc;font-weight:800">
                    <td>TOTAL DEDUCTIONS</td>
                    <td style="text-align:right;color:#dc2626">-₹${activeSlip.totalDeductions?.toLocaleString('en-IN')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="net-box">
            <div>
              <div style="font-size:10px;text-transform:uppercase;font-weight:800;color:#065f46">Net Disbursed Take-Home Salary</div>
              <div class="words">${numberToWordsINR(activeSlip.netSalary)}</div>
            </div>
            <div class="net-amt">₹${activeSlip.netSalary?.toLocaleString('en-IN')}</div>
          </div>

          <div class="footer-signs">
            <div>
              <div style="height: 48px;"></div>
              <div class="sign-line">Employee Signature</div>
            </div>
            <div>
              <div style="height: 48px;"></div>
              <div class="sign-line">Senior Accountant</div>
            </div>
            <div style="position: relative;">
              ${stampHtml}
              ${sigHtml}
              <div class="sign-line">${branding.signatoryName}</div>
              <div style="font-size: 9px; color: #64748b; font-weight: 600; margin-top: 2px;">${branding.signatoryDesignation}</div>
            </div>
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

  const handlePrintAllSlips = () => {
    if (records.length === 0) {
      toast.error('No salary records found for this month.');
      return;
    }
    const printWindow = window.open('', '_blank', 'width=850,height=900');
    if (!printWindow) {
      toast.error('Pop-up blocked. Please allow pop-ups to print payslips.');
      return;
    }

    const slipsHtml = records.map(slip => {
      const logoHtml = branding.logoUrl
        ? `<div style="margin-bottom: 6px;"><img src="${branding.logoUrl}" style="height: 50px; max-width: 140px; object-fit: contain;" alt="School Logo" /></div>`
        : '';

      const sigHtml = branding.signatureUrl
        ? `<div style="height: 48px; display: flex; align-items: flex-end; justify-content: center; margin-bottom: 4px;"><img src="${branding.signatureUrl}" style="max-height: 46px; max-width: 130px; object-fit: contain;" alt="Signature" /></div>`
        : `<div style="height: 48px;"></div>`;

      const stampHtml = branding.stampUrl
        ? `<img src="${branding.stampUrl}" style="position: absolute; right: 10px; bottom: 12px; width: 62px; height: 62px; object-fit: contain; opacity: 0.65; pointer-events: none;" alt="Stamp" />`
        : '';

      return `
        <div class="payslip-box" style="page-break-after: always; margin-bottom: 24px;">
          <div class="header">
            ${logoHtml}
            <div class="school-name">${branding.schoolName}</div>
            <div class="school-sub">${branding.address} | ${branding.affiliation}</div>
            <div class="slip-title">Salary Payslip &bull; Month: ${selectedMonth}</div>
          </div>

          <div class="meta-grid">
            <div>
              <div class="meta-row"><span class="meta-label">Employee Code:</span><span class="meta-val">${slip.code}</span></div>
              <div class="meta-row"><span class="meta-label">Employee Name:</span><span class="meta-val">${slip.name}</span></div>
              <div class="meta-row"><span class="meta-label">Designation:</span><span class="meta-val">${slip.designation}</span></div>
              <div class="meta-row"><span class="meta-label">Department:</span><span class="meta-val">${slip.department}</span></div>
              <div class="meta-row"><span class="meta-label">Payable Days:</span><span class="meta-val">${slip.presentDays || 28} / ${slip.totalDays || 30} Days</span></div>
            </div>
            <div>
              <div class="meta-row"><span class="meta-label">Bank Name:</span><span class="meta-val">${slip.bankName || 'State Bank of India'}</span></div>
              <div class="meta-row"><span class="meta-label">Bank A/C No:</span><span class="meta-val">${slip.accNo || '—'}</span></div>
              <div class="meta-row"><span class="meta-label">IFSC Code:</span><span class="meta-val">${slip.ifsc || '—'}</span></div>
              <div class="meta-row"><span class="meta-label">PAN Number:</span><span class="meta-val">${slip.pan || '—'}</span></div>
              <div class="meta-row"><span class="meta-label">PF Number:</span><span class="meta-val">${slip.pfNo || '—'}</span></div>
            </div>
          </div>

          <div class="tables-grid">
            <div>
              <table>
                <thead>
                  <tr><th>Earnings Component</th><th style="text-align:right">Amount (₹)</th></tr>
                </thead>
                <tbody>
                  <tr><td>Basic Salary</td><td style="text-align:right">₹${slip.basic?.toLocaleString('en-IN')}</td></tr>
                  <tr><td>Dearness Allowance (DA)</td><td style="text-align:right">₹${slip.da?.toLocaleString('en-IN')}</td></tr>
                  <tr><td>House Rent Allowance (HRA)</td><td style="text-align:right">₹${slip.hra?.toLocaleString('en-IN')}</td></tr>
                  <tr><td>Special / Other Allowance</td><td style="text-align:right">₹${slip.specialAllowance?.toLocaleString('en-IN')}</td></tr>
                  <tr style="background:#f8fafc;font-weight:800">
                    <td>Total Gross Earnings</td>
                    <td style="text-align:right;color:#047857">₹${slip.grossSalary?.toLocaleString('en-IN')}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <table>
                <thead>
                  <tr><th>Deductions Component</th><th style="text-align:right">Amount (₹)</th></tr>
                </thead>
                <tbody>
                  <tr><td>Provident Fund (EPF)</td><td style="text-align:right">₹${slip.epf?.toLocaleString('en-IN')}</td></tr>
                  <tr><td>Employee State Insurance (ESIC)</td><td style="text-align:right">₹${slip.esi?.toLocaleString('en-IN')}</td></tr>
                  <tr><td>Professional Tax (PT)</td><td style="text-align:right">₹${slip.pt?.toLocaleString('en-IN')}</td></tr>
                  <tr><td>Tax Deducted at Source (TDS)</td><td style="text-align:right">₹${slip.tds?.toLocaleString('en-IN')}</td></tr>
                  <tr style="background:#f8fafc;font-weight:800">
                    <td>Total Statutory Deductions</td>
                    <td style="text-align:right;color:#be123c">₹${slip.totalDeductions?.toLocaleString('en-IN')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="net-box">
            <div>
              <div style="font-size:10px;text-transform:uppercase;font-weight:800;color:#065f46">Net Disbursed Take-Home Salary</div>
              <div class="words">${numberToWordsINR(slip.netSalary)}</div>
            </div>
            <div class="net-amt">₹${slip.netSalary?.toLocaleString('en-IN')}</div>
          </div>

          <div class="footer-signs">
            <div>
              <div style="height: 48px;"></div>
              <div class="sign-line">Employee Signature</div>
            </div>
            <div>
              <div style="height: 48px;"></div>
              <div class="sign-line">Senior Accountant</div>
            </div>
            <div style="position: relative;">
              ${stampHtml}
              ${sigHtml}
              <div class="sign-line">${branding.signatoryName}</div>
              <div style="font-size: 9px; color: #64748b; font-weight: 600; margin-top: 2px;">${branding.signatoryDesignation}</div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Batch Payslips - ${selectedMonth}</title>
        <style>
          @page { size: A4 portrait; margin: 12mm; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #0f172a; margin: 0; padding: 10px; }
          .payslip-box { border: 2px solid #0f172a; border-radius: 8px; padding: 20px; }
          .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 14px; }
          .school-name { font-size: 20px; font-weight: 900; letter-spacing: 0.5px; text-transform: uppercase; color: #065f46; margin-bottom: 2px; }
          .school-sub { font-size: 11px; color: #475569; }
          .slip-title { font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-top: 8px; background: #f1f5f9; padding: 4px; border-radius: 4px; display: inline-block; }
          .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 11px; margin-bottom: 14px; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; }
          .meta-row { display: flex; justify-content: space-between; padding: 2px 0; }
          .meta-label { color: #64748b; font-weight: 600; }
          .meta-val { font-weight: 700; color: #0f172a; }
          .tables-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
          table { width: 100%; border-collapse: collapse; font-size: 11px; }
          th { background: #f8fafc; border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; font-weight: 800; font-size: 10px; text-transform: uppercase; }
          td { border: 1px solid #e2e8f0; padding: 5px 8px; }
          .net-box { background: #f0fdf4; border: 2px solid #059669; border-radius: 6px; padding: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
          .net-amt { font-size: 18px; font-weight: 900; color: #047857; }
          .words { font-size: 10px; font-weight: 700; color: #065f46; font-style: italic; }
          .footer-signs { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; text-align: center; margin-top: 40px; font-size: 11px; font-weight: 700; color: #334155; }
          .sign-line { border-top: 1px solid #94a3b8; padding-top: 6px; }
          @media print {
            .payslip-box { page-break-after: always; }
          }
        </style>
      </head>
      <body>
        ${slipsHtml}
        <script>
          window.onload = function() { window.print(); };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 text-slate-800 space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={() => onNavigate?.('/dashboard')}
              className="text-slate-500 hover:text-emerald-600 transition-colors flex items-center gap-1 text-xs font-medium"
            >
              <Home className="w-3.5 h-3.5" />
              Home
            </button>
            <span className="text-slate-400 text-xs">/</span>
            <button
              onClick={() => onNavigate?.('/salary-hub')}
              className="text-slate-500 hover:text-emerald-600 transition-colors text-xs font-medium"
            >
              Salary Hub
            </button>
            <span className="text-slate-400 text-xs">/</span>
            <span className="text-emerald-600 text-xs font-semibold">Payslips Studio</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-600" />
            Digital Salary Slip & Payslip Studio
          </h1>
          <p className="text-xs text-slate-500">
            Generate, preview, print and distribute official school payslips with automated earnings and deductions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Month Selector */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="2026-11">Nov 2026</option>
              <option value="2026-10">Oct 2026</option>
              <option value="2026-09">Sep 2026</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handlePrintAllSlips}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold rounded-xl shadow-2xs transition cursor-pointer"
            title="Print all staff payslips for this month in one batch"
          >
            <Printer className="w-4 h-4 text-indigo-600" />
            Print All ({records.length}) Slips
          </button>
          <button
            type="button"
            onClick={handlePrintSlip}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Print Active Payslip
          </button>
        </div>
      </div>

      {/* Main 2-Panel Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Staff Selector List (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col">
          <div className="p-3 bg-slate-50 border-b border-slate-200">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search staff name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 bg-white"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-100 max-h-[640px] overflow-y-auto">
            {filteredRecords.map((staff) => {
              const isSelected = activeSlip?.id === staff.id;
              return (
                <div
                  key={staff.id}
                  onClick={() => setSelectedStaffId(staff.id)}
                  className={`p-3.5 cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-emerald-50/70 border-l-4 border-emerald-600'
                      : 'hover:bg-slate-50/70'
                  }`}
                >
                  <div>
                    <div className="font-extrabold text-xs text-slate-900">{staff.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {staff.code} &bull; {staff.designation}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-xs text-emerald-600 font-mono">
                      ₹{staff.netSalary?.toLocaleString('en-IN')}
                    </div>
                    <span className="inline-block px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-100 text-slate-600">
                      {staff.department?.split(' ')[0]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Payslip Preview Card (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-5">
          {activeSlip ? (
            <div className="border-2 border-slate-900 rounded-xl p-6 bg-white space-y-5">
              {/* Official School Header */}
              <div className="text-center border-b-2 border-slate-900 pb-4">
                {branding.logoUrl && (
                  <div className="flex justify-center mb-2">
                    <img
                      src={branding.logoUrl}
                      alt="School Logo"
                      className="h-12 max-w-[140px] object-contain"
                    />
                  </div>
                )}
                <div className="text-lg font-black tracking-wide text-emerald-900 uppercase">
                  {branding.schoolName}
                </div>
                <div className="text-[11px] text-slate-600 font-medium">
                  {branding.address} | {branding.affiliation}
                </div>
                <div className="mt-2 inline-block px-3 py-1 rounded bg-slate-100 text-slate-800 text-xs font-extrabold uppercase tracking-wider">
                  Salary Payslip &bull; Month of {selectedMonth}
                </div>
              </div>

              {/* Employee Metadata Grid */}
              <div className="grid grid-cols-2 gap-4 text-xs border-b border-slate-200 pb-4">
                <div className="space-y-1">
                  <div className="flex justify-between"><span className="text-slate-500 font-semibold">Employee ID:</span><span className="font-bold text-slate-900">{activeSlip.code}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500 font-semibold">Employee Name:</span><span className="font-extrabold text-slate-900">{activeSlip.name}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500 font-semibold">Designation:</span><span className="font-bold text-slate-900">{activeSlip.designation}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500 font-semibold">Department:</span><span className="font-bold text-slate-900">{activeSlip.department}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500 font-semibold">Payable Days:</span><span className="font-bold text-emerald-700">{activeSlip.presentDays || 28} / {activeSlip.totalDays || 30} Days</span></div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between"><span className="text-slate-500 font-semibold">Bank Name:</span><span className="font-bold text-slate-900">{activeSlip.bankName || 'State Bank of India'}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500 font-semibold">Bank A/C No:</span><span className="font-mono font-bold text-slate-900">{activeSlip.accNo || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500 font-semibold">IFSC Code:</span><span className="font-mono font-bold text-slate-900">{activeSlip.ifsc || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500 font-semibold">PAN Number:</span><span className="font-mono font-bold text-slate-900">{activeSlip.pan || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500 font-semibold">PF Account No:</span><span className="font-mono font-bold text-slate-900">{activeSlip.pfNo || '—'}</span></div>
                </div>
              </div>

              {/* Earnings & Deductions Tables */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                {/* Earnings */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-emerald-50 text-emerald-900 px-3 py-2 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                    Earnings
                  </div>
                  <div className="p-3 space-y-1.5 text-slate-700">
                    <div className="flex justify-between font-semibold"><span>Basic Salary:</span><span>₹{activeSlip.basic?.toLocaleString('en-IN')}</span></div>
                    {activeSlip.allowancesBreakdown && Object.entries(activeSlip.allowancesBreakdown).map(([k, v]) => (
                      <div key={k} className="flex justify-between text-slate-600 text-[11px]">
                        <span className="uppercase">{k} Allowance:</span>
                        <span>₹{Number(v)?.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                    {activeSlip.bonus > 0 && (
                      <div className="flex justify-between font-bold text-emerald-700"><span>Bonus:</span><span>₹{activeSlip.bonus?.toLocaleString('en-IN')}</span></div>
                    )}
                    <div className="pt-2 border-t border-slate-200 flex justify-between font-extrabold text-slate-900 text-xs">
                      <span>Total Gross:</span>
                      <span className="text-emerald-700 font-black">₹{activeSlip.grossSalary?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-rose-50 text-rose-900 px-3 py-2 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                    Deductions
                  </div>
                  <div className="p-3 space-y-1.5 text-slate-700">
                    <div className="flex justify-between font-semibold"><span>Provident Fund (EPF):</span><span>₹{activeSlip.epf?.toLocaleString('en-IN')}</span></div>
                    <div className="flex justify-between font-semibold"><span>ESIC Contribution:</span><span>₹{activeSlip.esi?.toLocaleString('en-IN')}</span></div>
                    <div className="flex justify-between font-semibold"><span>Professional Tax (PT):</span><span>₹{activeSlip.professionalTax?.toLocaleString('en-IN')}</span></div>
                    {activeSlip.advanceRecovery > 0 && (
                      <div className="flex justify-between text-amber-700"><span>Advance Recovery:</span><span>₹{activeSlip.advanceRecovery?.toLocaleString('en-IN')}</span></div>
                    )}
                    <div className="pt-2 border-t border-slate-200 flex justify-between font-extrabold text-slate-900 text-xs">
                      <span>Total Deductions:</span>
                      <span className="text-rose-600 font-black">-₹{activeSlip.totalDeductions?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Net Payable Pill */}
              <div className="bg-emerald-50 border-2 border-emerald-600 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-emerald-800">Net Take-Home Salary</div>
                  <div className="text-xs font-bold text-emerald-700 italic mt-0.5">
                    {numberToWordsINR(activeSlip.netSalary)}
                  </div>
                </div>
                <div className="text-2xl font-black text-emerald-700 font-mono">
                  ₹{activeSlip.netSalary?.toLocaleString('en-IN')}
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-3 gap-6 pt-6 text-center text-xs font-bold text-slate-600">
                <div className="flex flex-col justify-end">
                  <div className="h-14"></div>
                  <div className="border-t border-slate-400 pt-2">Employee Signature</div>
                </div>
                <div className="flex flex-col justify-end">
                  <div className="h-14"></div>
                  <div className="border-t border-slate-400 pt-2">Accountant Signature</div>
                </div>
                <div className="flex flex-col justify-end relative">
                  {branding.stampUrl && (
                    <img
                      src={branding.stampUrl}
                      alt="Official Stamp"
                      className="absolute bottom-6 right-2 w-16 h-16 object-contain opacity-70 pointer-events-none"
                    />
                  )}
                  {branding.signatureUrl ? (
                    <div className="h-14 flex items-end justify-center pb-1">
                      <img
                        src={branding.signatureUrl}
                        alt="Authorized Signatory"
                        className="max-h-12 max-w-[130px] object-contain filter drop-shadow-xs"
                      />
                    </div>
                  ) : (
                    <div className="h-14"></div>
                  )}
                  <div className="border-t border-slate-400 pt-2">
                    <div>{branding.signatoryName}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{branding.signatoryDesignation}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-slate-400">
              Select a staff member from the left list to view payslip.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
