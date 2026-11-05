import React, { useState, useMemo, useEffect } from 'react';
import {
  IndianRupee,
  Calculator,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Lock,
  Unlock,
  Eye,
  Edit3,
  CheckSquare,
  Square,
  FileDown,
  Printer,
  Home,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Building,
  AlertCircle,
  X,
  Layers,
  Sparkles,
  RefreshCw,
  Calendar,
  Check
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { tenantStore } from '../../services/tenantStore';
import { salaryStorage, calculateStaffSalary } from './salaryStore';

export function SalaryProcessingPage({ onNavigate }) {
  const { currentSchool } = useAuth();
  const schoolId = currentSchool?.id || 'school_default';

  const [selectedMonth, setSelectedMonth] = useState('2026-11');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [records, setRecords] = useState(() => salaryStorage.getMonthlyRecords('2026-11'));
  const [selectedIds, setSelectedIds] = useState([]);

  // Modals
  const [breakdownModalItem, setBreakdownModalItem] = useState(null);
  const [editModalItem, setEditModalItem] = useState(null);

  // Listen for external salary changes
  useEffect(() => {
    const handleUpdate = () => {
      setRecords(salaryStorage.getMonthlyRecords(selectedMonth));
    };
    window.addEventListener('school_salary_records_updated', handleUpdate);
    return () => window.removeEventListener('school_salary_records_updated', handleUpdate);
  }, [selectedMonth]);

  // Month change
  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    const loaded = salaryStorage.getMonthlyRecords(month);
    setRecords(loaded);
    setSelectedIds([]);
  };

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchDept = selectedDept === 'ALL' || r.department === selectedDept;
      const matchQuery = !searchQuery.trim() ||
        r.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.designation?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDept && matchQuery;
    });
  }, [records, selectedDept, searchQuery]);

  // Unique departments for filter
  const departments = useMemo(() => {
    const set = new Set(records.map(r => r.department).filter(Boolean));
    return Array.from(set);
  }, [records]);

  // Selection
  const allSelected = filteredRecords.length > 0 && filteredRecords.every(r => selectedIds.includes(r.id));
  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredRecords.map(r => r.id));
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  // Summary Metrics
  const totalGross = filteredRecords.reduce((sum, r) => sum + (r.grossSalary || 0), 0);
  const totalDeductions = filteredRecords.reduce((sum, r) => sum + (r.totalDeductions || 0), 0);
  const totalNet = filteredRecords.reduce((sum, r) => sum + (r.netSalary || 0), 0);

  // Recalculate All Handlers
  const handleRecalculateAll = () => {
    const updated = salaryStorage.recalculateMonthRecords(selectedMonth);
    setRecords(updated);
    toast.success(`Recalculated all staff salaries for ${selectedMonth} with latest policies!`);
  };

  // Single Staff Status Change
  const handleToggleStatus = (recordId, newStatus) => {
    const updated = records.map(r => {
      if (r.id === recordId) {
        return {
          ...r,
          status: newStatus,
          ...(newStatus === 'Disbursed' ? { disbursedDate: new Date().toISOString().slice(0, 10) } : {})
        };
      }
      return r;
    });
    setRecords(updated);
    salaryStorage.saveMonthlyRecords(selectedMonth, updated);
    toast.success(`Salary marked as ${newStatus}`);
  };

  // Quick Action: Batch Approve / Lock
  const handleBatchApprove = () => {
    if (selectedIds.length === 0) {
      toast.error('Select at least one employee');
      return;
    }
    const updated = records.map(r => {
      if (selectedIds.includes(r.id)) {
        return { ...r, status: 'Approved' };
      }
      return r;
    });
    setRecords(updated);
    salaryStorage.saveMonthlyRecords(selectedMonth, updated);
    toast.success(`Approved payroll for ${selectedIds.length} staff members!`);
  };

  // Quick Action: Batch Disburse
  const handleBatchDisburse = () => {
    if (selectedIds.length === 0) {
      toast.error('Select at least one employee');
      return;
    }
    const updated = records.map(r => {
      if (selectedIds.includes(r.id)) {
        return { ...r, status: 'Disbursed', disbursedDate: new Date().toISOString().slice(0, 10) };
      }
      return r;
    });
    setRecords(updated);
    salaryStorage.saveMonthlyRecords(selectedMonth, updated);
    toast.success(`Marked ${selectedIds.length} staff salaries as Disbursed!`);
  };

  // Navigate directly to this staff member's payslip
  const handleNavigateToPayslip = (recordId) => {
    try {
      localStorage.setItem('salary_payslip_selected_staff', recordId);
    } catch (e) {
      console.warn('Storage set error:', e);
    }
    onNavigate?.('/salary-payslips');
  };

  // Save manual edit adjustments
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editModalItem) return;

    const policies = salaryStorage.getPolicies();
    const recalculated = calculateStaffSalary(editModalItem, policies, {
      grossSalary: Number(editModalItem.grossSalary),
      bonus: Number(editModalItem.bonus || 0),
      overtimePay: Number(editModalItem.overtimePay || 0),
      advanceRecovery: Number(editModalItem.advanceRecovery || 0),
      tds: Number(editModalItem.tds || 0),
      presentDays: Number(editModalItem.presentDays || 30),
      totalDays: Number(editModalItem.totalDays || 30)
    });

    const updated = records.map(r => {
      if (r.id === editModalItem.id) {
        return {
          ...r,
          ...recalculated,
          grossSalary: Number(editModalItem.grossSalary),
          bonus: Number(editModalItem.bonus || 0),
          overtimePay: Number(editModalItem.overtimePay || 0),
          advanceRecovery: Number(editModalItem.advanceRecovery || 0),
          tds: Number(editModalItem.tds || 0),
          presentDays: Number(editModalItem.presentDays || 30)
        };
      }
      return r;
    });

    setRecords(updated);
    salaryStorage.saveMonthlyRecords(selectedMonth, updated);
    setEditModalItem(null);
    toast.success('Salary adjustments saved and recalculated successfully!');
  };

  // Export CSV
  const exportCSV = () => {
    const headers = [
      'Emp Code', 'Name', 'Department', 'Designation', 'Present Days', 'Basic (₹)',
      'Allowances (₹)', 'Bonus (₹)', 'Gross (₹)', 'EPF (₹)', 'ESI (₹)', 'PT (₹)',
      'Advance (₹)', 'Total Deductions (₹)', 'Net Salary (₹)', 'Status', 'Bank Name', 'Account No', 'IFSC'
    ];

    const rows = filteredRecords.map(r => [
      `"${r.code}"`,
      `"${r.name}"`,
      `"${r.department}"`,
      `"${r.designation}"`,
      r.presentDays || 30,
      r.basic || 0,
      r.totalAllowances || 0,
      r.bonus || 0,
      r.grossSalary || 0,
      r.epf || 0,
      r.esi || 0,
      r.professionalTax || 0,
      r.advanceRecovery || 0,
      r.totalDeductions || 0,
      r.netSalary || 0,
      `"${r.status || 'Approved'}"`,
      `"${r.bankName || ''}"`,
      `"${r.accNo || ''}"`,
      `"${r.ifsc || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Salary_Register_${selectedMonth}.csv`;
    link.click();
    toast.success('Salary Register exported to CSV!');
  };

  // Print Formatted Payroll Sheet
  const handlePrintSheet = () => {
    const printWindow = window.open('', '_blank', 'width=1000,height=900');
    if (!printWindow) {
      toast.error('Pop-up blocked. Please allow pop-ups to print the payroll sheet.');
      return;
    }

    const bankSettings = salaryStorage.getBankSettings();
    const prof = tenantStore.getSchoolProfile(schoolId);
    const schoolName = bankSettings.schoolAccountName || prof?.schoolName || 'JD INTERNATIONAL SCHOOL';
    const address = prof?.address || 'Jaisinghpura, Bhankrota, Jaipur - 302026';

    const rowsHtml = filteredRecords.map((r, i) => `
      <tr>
        <td style="text-align: center;">${i + 1}</td>
        <td><strong>${r.name}</strong><br><small style="color: #64748b;">${r.code} • ${r.designation}</small></td>
        <td>${r.department}</td>
        <td style="text-align: center;">${r.presentDays || 28} / ${r.totalDays || 30}</td>
        <td style="text-align: right; font-family: monospace;">₹${r.basic?.toLocaleString('en-IN')}</td>
        <td style="text-align: right; font-family: monospace;">₹${r.totalAllowances?.toLocaleString('en-IN')}</td>
        <td style="text-align: right; font-family: monospace; font-weight: bold;">₹${r.grossSalary?.toLocaleString('en-IN')}</td>
        <td style="text-align: right; font-family: monospace; color: #dc2626;">-₹${r.totalDeductions?.toLocaleString('en-IN')}</td>
        <td style="text-align: right; font-family: monospace; font-weight: 900; color: #047857;">₹${r.netSalary?.toLocaleString('en-IN')}</td>
        <td style="text-align: center;"><span style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold;">${r.status || 'Approved'}</span></td>
        <td><small>${r.bankName || 'SBI'}<br>A/C: ${r.accNo || '—'}</small></td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Monthly Payroll Register - ${selectedMonth}</title>
        <style>
          @page { size: A4 landscape; margin: 10mm; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 11px; color: #0f172a; margin: 0; padding: 10px; }
          .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 12px; }
          .school-title { font-size: 18px; font-weight: 900; text-transform: uppercase; color: #065f46; }
          .school-sub { font-size: 10px; color: #475569; margin-top: 2px; }
          .sheet-title { font-size: 12px; font-weight: 800; text-transform: uppercase; margin-top: 6px; }
          .summary-bar { display: flex; justify-content: space-between; background: #f8fafc; border: 1px solid #cbd5e1; padding: 8px 12px; border-radius: 6px; margin-bottom: 12px; font-weight: bold; font-size: 11px; }
          table { width: 100%; border-collapse: collapse; font-size: 10px; }
          th { background: #f1f5f9; border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; font-weight: 800; text-transform: uppercase; font-size: 9px; }
          td { border: 1px solid #e2e8f0; padding: 5px 8px; }
          .footer-signs { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 40px; margin-top: 50px; text-align: center; font-weight: bold; font-size: 11px; }
          .sign-box { border-top: 1px solid #94a3b8; padding-top: 6px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="school-title">${schoolName}</div>
          <div class="school-sub">${address}</div>
          <div class="sheet-title">Monthly Staff Payroll Register & Remittance Summary &bull; Month: ${selectedMonth}</div>
        </div>

        <div class="summary-bar">
          <div>Total Staff: ${filteredRecords.length}</div>
          <div>Total Gross Wages: ₹${totalGross.toLocaleString('en-IN')}</div>
          <div>Total Deductions: ₹${totalDeductions.toLocaleString('en-IN')}</div>
          <div style="color: #047857;">Total Net Disbursed: ₹${totalNet.toLocaleString('en-IN')}</div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="text-align: center; width: 30px;">#</th>
              <th>Employee Details</th>
              <th>Department</th>
              <th style="text-align: center;">Days</th>
              <th style="text-align: right;">Basic (₹)</th>
              <th style="text-align: right;">Allowances</th>
              <th style="text-align: right;">Gross Pay (₹)</th>
              <th style="text-align: right;">Deductions</th>
              <th style="text-align: right;">Net Payable (₹)</th>
              <th style="text-align: center;">Status</th>
              <th>Bank Account</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

        <div class="footer-signs">
          <div><div class="sign-box">Prepared by (Accountant)</div></div>
          <div><div class="sign-box">Verified by (Finance Officer)</div></div>
          <div><div class="sign-box">${bankSettings.signatoryName || 'Principal / Director'}<br><small style="color:#64748b;">${bankSettings.signatoryDesignation || 'Authorized Signatory'}</small></div></div>
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
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 text-slate-800 space-y-4">
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
            <span className="text-emerald-600 text-xs font-semibold">Process Salary</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Calculator className="w-6 h-6 text-emerald-600" />
            Monthly Salary Processing Studio
          </h1>
          <p className="text-xs text-slate-500">
            Review staff earnings, verify attendance days, calculate statutory deductions & approve payouts.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleRecalculateAll}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold rounded-xl shadow-2xs transition cursor-pointer"
            title="Recalculate all records with latest policies"
          >
            <RefreshCw className="w-4 h-4 text-indigo-600" />
            Recalculate All
          </button>
          <button
            type="button"
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl shadow-2xs transition cursor-pointer"
          >
            <FileDown className="w-4 h-4 text-emerald-600" />
            Export CSV
          </button>
          <button
            type="button"
            onClick={handlePrintSheet}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl shadow-2xs transition cursor-pointer"
          >
            <Printer className="w-4 h-4 text-blue-600" />
            Print Sheet
          </button>
          <button
            type="button"
            onClick={handleBatchApprove}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            Approve ({selectedIds.length})
          </button>
          <button
            type="button"
            onClick={handleBatchDisburse}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
          >
            <CreditCard className="w-4 h-4" />
            Disburse ({selectedIds.length})
          </button>
        </div>
      </div>

      {/* Filter Toolbar & Summary Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Month Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <span className="text-xs font-bold text-slate-500">Month:</span>
            <select
              value={selectedMonth}
              onChange={(e) => handleMonthChange(e.target.value)}
              className="text-xs font-extrabold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="2026-11">Nov 2026</option>
              <option value="2026-10">Oct 2026</option>
              <option value="2026-09">Sep 2026</option>
              <option value="2026-08">Aug 2026</option>
            </select>
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Departments</option>
              {departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search staff name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 bg-slate-50"
            />
          </div>
        </div>

        {/* Live Quick Totals */}
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 w-full sm:w-auto justify-end">
          <div>
            Gross: <span className="font-extrabold text-slate-800 font-mono">₹{totalGross.toLocaleString('en-IN')}</span>
          </div>
          <div>
            Deductions: <span className="font-extrabold text-rose-600 font-mono">-₹{totalDeductions.toLocaleString('en-IN')}</span>
          </div>
          <div className="bg-emerald-50 text-emerald-800 px-3 py-1 rounded-xl border border-emerald-200 font-extrabold font-mono">
            Net: ₹{totalNet.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Main Processing Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-3 text-center w-10">
                  <button onClick={toggleSelectAll} className="cursor-pointer text-slate-500 hover:text-emerald-600">
                    {allSelected ? <CheckSquare className="w-4 h-4 text-emerald-600" /> : <Square className="w-4 h-4" />}
                  </button>
                </th>
                <th className="py-3 px-4">Employee Details</th>
                <th className="py-3 px-3">Department</th>
                <th className="py-3 px-3 text-center">Attendance</th>
                <th className="py-3 px-3 text-right">Basic (₹)</th>
                <th className="py-3 px-3 text-right">Allowances</th>
                <th className="py-3 px-3 text-right">Gross (₹)</th>
                <th className="py-3 px-3 text-right">EPF + ESI + PT</th>
                <th className="py-3 px-3 text-right">Net Salary</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-center w-36">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((rec) => {
                  const isChecked = selectedIds.includes(rec.id);
                  const isDisbursed = rec.status === 'Disbursed';
                  const isApproved = rec.status === 'Approved';

                  return (
                    <tr
                      key={rec.id}
                      className={`hover:bg-slate-50/80 transition-colors ${isChecked ? 'bg-emerald-50/30' : ''}`}
                    >
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => toggleSelectOne(rec.id)}
                          className="cursor-pointer text-slate-400 hover:text-emerald-600"
                        >
                          {isChecked ? <CheckSquare className="w-4 h-4 text-emerald-600" /> : <Square className="w-4 h-4" />}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-extrabold text-slate-900">{rec.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {rec.code} &bull; {rec.designation}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                          {rec.department}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                          {rec.presentDays || 28} / {rec.totalDays || 30} Days
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-medium font-mono text-slate-700">
                        ₹{rec.basic?.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 text-right font-medium font-mono text-slate-700">
                        ₹{rec.totalAllowances?.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 text-right font-bold font-mono text-slate-800">
                        ₹{rec.grossSalary?.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 text-right font-medium font-mono text-rose-600">
                        -₹{rec.totalDeductions?.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 text-right font-black font-mono text-emerald-600 text-sm">
                        ₹{rec.netSalary?.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isDisbursed
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : isApproved
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {rec.status || 'Approved'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => setBreakdownModalItem(rec)}
                            title="View Full Calculation Breakdown"
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditModalItem({ ...rec })}
                            title="Edit Adjustments / Days / Bonus / Advance"
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleNavigateToPayslip(rec.id)}
                            title="View / Print Official Payslip"
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          {/* 1-Click Status Quick Action */}
                          {!isDisbursed && (
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(rec.id, isApproved ? 'Disbursed' : 'Approved')}
                              title={isApproved ? "Mark as Disbursed" : "Approve Salary"}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition cursor-pointer ${
                                isApproved
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                                  : 'bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100'
                              }`}
                            >
                              {isApproved ? 'Disburse' : 'Approve'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-bold text-slate-700">No staff salary records found</p>
                    <p className="text-xs text-slate-400 mt-0.5">Try adjusting your department filter or search keyword.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL: DETAILED BREAKDOWN ================= */}
      {breakdownModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-emerald-600" />
                  Salary Calculation Breakdown
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  {breakdownModalItem.name} ({breakdownModalItem.code}) &bull; {selectedMonth}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setBreakdownModalItem(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/50 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              {/* Earnings Breakdown */}
              <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-3.5 space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center justify-between">
                  <span>Gross Earnings</span>
                  <span className="text-sm font-black text-emerald-700 font-mono">₹{breakdownModalItem.grossSalary?.toLocaleString('en-IN')}</span>
                </div>
                <div className="space-y-1.5 pt-1 text-slate-700">
                  <div className="flex justify-between">
                    <span>Basic Salary ({breakdownModalItem.payableDays || 28} payable days):</span>
                    <span className="font-bold font-mono">₹{breakdownModalItem.basic?.toLocaleString('en-IN')}</span>
                  </div>
                  {breakdownModalItem.allowancesBreakdown && Object.entries(breakdownModalItem.allowancesBreakdown).map(([k, v]) => (
                    <div key={k} className="flex justify-between text-slate-600">
                      <span className="uppercase text-[10px]">{k.toUpperCase()} Allowance:</span>
                      <span className="font-semibold font-mono">₹{v?.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                  {breakdownModalItem.bonus > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Performance Bonus / Incentive:</span>
                      <span className="font-mono">+₹{breakdownModalItem.bonus?.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {breakdownModalItem.overtimePay > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Overtime / Extra Classes:</span>
                      <span className="font-mono">+₹{breakdownModalItem.overtimePay?.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Deductions Breakdown */}
              <div className="bg-rose-50/50 border border-rose-200 rounded-xl p-3.5 space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-rose-800 flex items-center justify-between">
                  <span>Deductions & Statutory Contributions</span>
                  <span className="text-sm font-black text-rose-700 font-mono">-₹{breakdownModalItem.totalDeductions?.toLocaleString('en-IN')}</span>
                </div>
                <div className="space-y-1.5 pt-1 text-slate-700">
                  <div className="flex justify-between">
                    <span>Provident Fund (EPF 12%):</span>
                    <span className="font-bold font-mono">₹{breakdownModalItem.epf?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Employee State Insurance (ESIC):</span>
                    <span className="font-bold font-mono">₹{breakdownModalItem.esi?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Professional Tax (PT Slab):</span>
                    <span className="font-bold font-mono">₹{breakdownModalItem.professionalTax?.toLocaleString('en-IN')}</span>
                  </div>
                  {breakdownModalItem.advanceRecovery > 0 && (
                    <div className="flex justify-between text-amber-700 font-semibold">
                      <span>Salary Advance Recovery:</span>
                      <span className="font-mono">₹{breakdownModalItem.advanceRecovery?.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {breakdownModalItem.tds > 0 && (
                    <div className="flex justify-between text-rose-700 font-semibold">
                      <span>Income Tax (TDS Deduction):</span>
                      <span className="font-mono">₹{breakdownModalItem.tds?.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Net Payable Final Card */}
              <div className="bg-slate-900 text-white p-4 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Net Take-Home Pay</div>
                  <div className="text-xl font-black text-emerald-400 font-mono">
                    ₹{breakdownModalItem.netSalary?.toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="text-right text-[11px] text-slate-300">
                  <div>Bank: <strong>{breakdownModalItem.bankName}</strong></div>
                  <div className="font-mono text-[10px] text-slate-400">A/C: {breakdownModalItem.accNo}</div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
              <button
                type="button"
                onClick={() => handleNavigateToPayslip(breakdownModalItem.id)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                View & Print Payslip
              </button>
              <button
                type="button"
                onClick={() => setBreakdownModalItem(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Close Breakdown
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT SALARY ADJUSTMENTS ================= */}
      {editModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-amber-600" />
                  Edit Salary Adjustments
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  {editModalItem.name} &bull; {selectedMonth}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditModalItem(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/50 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Base Gross CTC (₹)</label>
                  <input
                    type="number"
                    step="500"
                    min="0"
                    value={editModalItem.grossSalary || 30000}
                    onChange={(e) => setEditModalItem({ ...editModalItem, grossSalary: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold focus:outline-none focus:border-emerald-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Present Working Days</label>
                  <input
                    type="number"
                    min="0"
                    max="31"
                    value={editModalItem.presentDays || 28}
                    onChange={(e) => setEditModalItem({ ...editModalItem, presentDays: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold focus:outline-none focus:border-emerald-500 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bonus / Incentive (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={editModalItem.bonus || 0}
                    onChange={(e) => setEditModalItem({ ...editModalItem, bonus: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono focus:outline-none focus:border-emerald-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Overtime Pay (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={editModalItem.overtimePay || 0}
                    onChange={(e) => setEditModalItem({ ...editModalItem, overtimePay: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono focus:outline-none focus:border-emerald-500 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Advance Recovery (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={editModalItem.advanceRecovery || 0}
                    onChange={(e) => setEditModalItem({ ...editModalItem, advanceRecovery: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono focus:outline-none focus:border-emerald-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">TDS Tax (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={editModalItem.tds || 0}
                    onChange={(e) => setEditModalItem({ ...editModalItem, tds: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono focus:outline-none focus:border-emerald-500 bg-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditModalItem(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition cursor-pointer"
                >
                  Recalculate & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
