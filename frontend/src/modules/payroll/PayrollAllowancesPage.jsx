import React, { useState } from 'react';
import {
  Users,
  Save,
  CheckCircle2,
  Home,
  Percent,
  IndianRupee,
  ShieldCheck
} from 'lucide-react';

export function PayrollAllowancesPage({ onNavigate }) {
  const [allowances, setAllowances] = useState({
    da: { type: 'Percentage', value: 10 },
    hra: { type: 'Percentage', value: 15 },
    conv: { type: 'Amount', value: 1500 },
    med: { type: 'Amount', value: 1000 },
    spl: { type: 'Amount', value: 2000 },
    epf: { type: 'Percentage', value: 12 },
    esic: { type: 'Percentage', value: 0.75 },
    pt: { type: 'Amount', value: 200 },
    lic: { type: 'Amount', value: 0 },
    tds: { type: 'Percentage', value: 5 }
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleUpdate = (field, key, val) => {
    setAllowances(prev => ({
      ...prev,
      [field]: { ...prev[field], [key]: key === 'value' ? Number(val) || 0 : val }
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1:1 Secondary Top Header Toolbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-bold text-slate-800 pr-3 border-r border-slate-300">
            Allowances Master
          </h1>
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <button onClick={() => onNavigate?.('/')} className="hover:text-indigo-600 flex items-center">
              <Home className="w-3.5 h-3.5 mr-1" />
            </button>
            <span>•</span>
            <span className="hover:text-indigo-600 cursor-pointer" onClick={() => onNavigate?.('/payroll-allowances')}>Payroll</span>
            <span>•</span>
            <span className="text-slate-800 font-medium">Allowances Master</span>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-transform"
        >
          <Save className="w-4 h-4" />
          <span>Save Allowances</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="p-6 max-w-5xl mx-auto w-full space-y-6">
        {savedSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center space-x-3 text-xs shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>Default salary allowances and statutory deduction rates saved successfully!</div>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Earning Allowances Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-200">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                1. Earnings & Benefit Allowances
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {[
                { key: 'da', label: 'Dearness Allowance (D.A.)' },
                { key: 'hra', label: 'House Rent Allowance (H.R.A.)' },
                { key: 'conv', label: 'Conveyance Allowance' },
                { key: 'med', label: 'Medical Reimbursement' },
                { key: 'spl', label: 'Special Allowance' }
              ].map(({ key, label }) => (
                <div key={key} className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-3">
                  <span className="font-bold text-slate-700">{label}</span>
                  <div className="flex items-center gap-1.5">
                    <select
                      value={allowances[key].type}
                      onChange={(e) => handleUpdate(key, 'type', e.target.value)}
                      className="px-2 py-1 border border-slate-300 rounded bg-white text-[11px] font-semibold"
                    >
                      <option value="Percentage">%</option>
                      <option value="Amount">Amount (₹)</option>
                    </select>
                    <input
                      type="number"
                      step="0.01"
                      value={allowances[key].value}
                      onChange={(e) => handleUpdate(key, 'value', e.target.value)}
                      className="w-24 px-2 py-1 border border-slate-300 rounded bg-white font-bold text-right text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Statutory Deductions Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-200">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                2. Statutory & Welfare Deductions
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {[
                { key: 'epf', label: "Employees' Provident Fund (EPF)" },
                { key: 'esic', label: 'Employees State Insurance (ESIC)' },
                { key: 'pt', label: 'Professional Tax (PT)' },
                { key: 'lic', label: 'Life Insurance Corporation (LIC)' },
                { key: 'tds', label: 'Tax Deducted at Source (TDS)' }
              ].map(({ key, label }) => (
                <div key={key} className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-3">
                  <span className="font-bold text-slate-700">{label}</span>
                  <div className="flex items-center gap-1.5">
                    <select
                      value={allowances[key].type}
                      onChange={(e) => handleUpdate(key, 'type', e.target.value)}
                      className="px-2 py-1 border border-slate-300 rounded bg-white text-[11px] font-semibold"
                    >
                      <option value="Percentage">%</option>
                      <option value="Amount">Amount (₹)</option>
                    </select>
                    <input
                      type="number"
                      step="0.01"
                      value={allowances[key].value}
                      onChange={(e) => handleUpdate(key, 'value', e.target.value)}
                      className="w-24 px-2 py-1 border border-slate-300 rounded bg-white font-bold text-right text-xs text-red-600"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs shadow-xs active:scale-95 transition-transform"
            >
              Save Allowances Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
