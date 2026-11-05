import React, { useState, useMemo, useEffect } from 'react';
import {
  SlidersHorizontal,
  Plus,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  Calculator,
  Home,
  ChevronRight,
  Layers,
  Sparkles,
  Info,
  Users,
  Search,
  Filter,
  Edit3,
  IndianRupee,
  X,
  TrendingUp,
  RotateCcw,
  Building,
  Check
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  salaryStorage,
  DEFAULT_SALARY_POLICIES,
  getActiveStaffRoster,
  calculateStaffSalary
} from './salaryStore';

export function SalaryStructurePage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('STAFF_MASTER'); // 'STAFF_MASTER' | 'POLICY_RULES'
  const [policies, setPolicies] = useState(() => salaryStorage.getPolicies());
  const [staffList, setStaffList] = useState(() => getActiveStaffRoster());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('ALL');
  const [testGross, setTestGross] = useState(50000);

  // Edit Modal State
  const [editingStaff, setEditingStaff] = useState(null);
  const [formGross, setFormGross] = useState(0);
  const [formBasic, setFormBasic] = useState(0);

  // Re-fetch staff when salary is updated
  useEffect(() => {
    const handleUpdate = () => {
      setStaffList(getActiveStaffRoster());
    };
    window.addEventListener('school_erp_staff_salary_updated', handleUpdate);
    return () => window.removeEventListener('school_erp_staff_salary_updated', handleUpdate);
  }, []);

  // Department List
  const departments = useMemo(() => {
    const set = new Set(staffList.map(s => s.department).filter(Boolean));
    return Array.from(set);
  }, [staffList]);

  // Filtered staff roster
  const filteredStaff = useMemo(() => {
    return staffList.filter(s => {
      const matchDept = selectedDeptFilter === 'ALL' || s.department === selectedDeptFilter;
      const matchQuery = !searchQuery.trim() ||
        s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.designation?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDept && matchQuery;
    });
  }, [staffList, selectedDeptFilter, searchQuery]);

  // Computed Staff Salary Data for Display
  const computedStaffData = useMemo(() => {
    return filteredStaff.map(staff => {
      const calc = calculateStaffSalary(staff, policies, {
        grossSalary: staff.grossSalary,
        totalDays: 30,
        presentDays: 30,
        paidLeaveDays: 0
      });
      return {
        ...staff,
        ...calc
      };
    });
  }, [filteredStaff, policies]);

  // Metrics
  const totalMonthlyGross = computedStaffData.reduce((sum, s) => sum + (s.grossSalary || 0), 0);
  const totalMonthlyNet = computedStaffData.reduce((sum, s) => sum + (s.netSalary || 0), 0);
  const avgStaffGross = computedStaffData.length > 0 ? Math.round(totalMonthlyGross / computedStaffData.length) : 0;

  // Edit Staff Structure Handlers
  const handleOpenEdit = (staff) => {
    setEditingStaff(staff);
    setFormGross(staff.grossSalary || 30000);
    const basicPct = policies.basicPercentOfGross || 45;
    setFormBasic(staff.basicSalary || Math.round((staff.grossSalary || 30000) * (basicPct / 100)));
  };

  const handleGrossChange = (val) => {
    const gross = Math.max(0, Number(val));
    setFormGross(gross);
    const basicPct = policies.basicPercentOfGross || 45;
    setFormBasic(Math.round(gross * (basicPct / 100)));
  };

  const handleSaveStaffStructure = (e) => {
    e.preventDefault();
    if (!editingStaff) return;
    if (formGross <= 0) {
      toast.error('Gross salary must be greater than ₹0');
      return;
    }

    salaryStorage.updateStaffSalary(editingStaff.id, {
      grossSalary: formGross,
      basicSalary: formBasic
    });

    setStaffList(getActiveStaffRoster());
    setEditingStaff(null);
    toast.success(`Updated salary structure for ${editingStaff.name}!`);
  };

  // Allowances Handlers for Policy Tab
  const handleAddAllowance = () => {
    const newAl = {
      id: `al_${Date.now()}`,
      label: 'New Allowance',
      calculationType: 'percent_of_basic',
      value: 10
    };
    setPolicies(prev => ({
      ...prev,
      allowances: [...(prev.allowances || []), newAl]
    }));
  };

  const handleRemoveAllowance = (id) => {
    setPolicies(prev => ({
      ...prev,
      allowances: prev.allowances.filter(a => a.id !== id)
    }));
  };

  const handleUpdateAllowance = (id, field, value) => {
    setPolicies(prev => ({
      ...prev,
      allowances: prev.allowances.map(a => a.id === id ? { ...a, [field]: value } : a)
    }));
  };

  // Save Settings
  const handleSavePolicies = () => {
    salaryStorage.savePolicies(policies);
    salaryStorage.recalculateMonthRecords('2026-11');
    toast.success('Salary policy rules updated and payroll recalculated!');
  };

  const handleResetPolicies = () => {
    setPolicies(DEFAULT_SALARY_POLICIES);
    salaryStorage.savePolicies(DEFAULT_SALARY_POLICIES);
    salaryStorage.recalculateMonthRecords('2026-11');
    toast.success('Reset to standard CBSE school salary structure!');
  };

  // Live Simulation Calculator for Policy Tab
  const simBasic = Math.round(testGross * ((policies.basicPercentOfGross || 45) / 100));
  let simAllowances = 0;
  const simAllowancesBreakdown = (policies.allowances || []).map(al => {
    let amt = 0;
    if (al.calculationType === 'percent_of_basic') amt = Math.round(simBasic * (al.value / 100));
    else if (al.calculationType === 'percent_of_gross') amt = Math.round(testGross * (al.value / 100));
    else amt = Number(al.value) || 0;
    simAllowances += amt;
    return { ...al, amt };
  });

  const simGross = simBasic + simAllowances;
  const epfWage = Math.min(simBasic, policies.deductions?.epf?.wageCeiling || 15000);
  const epf = policies.deductions?.epf?.enabled ? Math.round(epfWage * ((policies.deductions.epf.employeePercent || 12) / 100)) : 0;
  const esi = (policies.deductions?.esi?.enabled && simGross <= (policies.deductions.esi.grossCeiling || 21000))
    ? Math.round(simGross * ((policies.deductions.esi.employeePercent || 0.75) / 100))
    : 0;
  const pt = 200;
  const simTotalDeductions = epf + esi + pt;
  const simNet = Math.max(0, simGross - simTotalDeductions);

  // Live preview for Modal
  const modalLiveCalc = useMemo(() => {
    if (!editingStaff) return null;
    return calculateStaffSalary({
      ...editingStaff,
      grossSalary: formGross,
      basicSalary: formBasic
    }, policies, {
      grossSalary: formGross,
      totalDays: 30,
      presentDays: 30,
      paidLeaveDays: 0
    });
  }, [editingStaff, formGross, formBasic, policies]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 text-slate-800 space-y-5">
      {/* Top Header */}
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
            <span className="text-emerald-600 text-xs font-semibold">Salary Structure</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <SlidersHorizontal className="w-6 h-6 text-emerald-600" />
            Salary Structure & Staff CTC Master
          </h1>
          <p className="text-xs text-slate-500">
            Manage individual staff compensation packages, allowances breakdown, and institutional statutory rules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'POLICY_RULES' ? (
            <>
              <button
                type="button"
                onClick={handleResetPolicies}
                className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                Reset Defaults
              </button>
              <button
                type="button"
                onClick={handleSavePolicies}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
              >
                Save Policy Rules
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => onNavigate?.('/salary-processing')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Calculator className="w-4 h-4" />
              Open Processing Studio
            </button>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center border-b border-slate-200 gap-6 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('STAFF_MASTER')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'STAFF_MASTER'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          Staff Salary Master ({staffList.length} Staff)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('POLICY_RULES')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'POLICY_RULES'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Institutional Rules & Slabs Setup
        </button>
      </div>

      {/* ================= TAB 1: STAFF SALARY MASTER ================= */}
      {activeTab === 'STAFF_MASTER' && (
        <div className="space-y-4 animate-fadeIn">
          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Total Monthly CTC Bill</span>
              <div className="text-xl font-black text-slate-900 mt-1 font-mono">
                ₹{totalMonthlyGross.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-slate-500">Gross across {computedStaffData.length} active staff</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Average Monthly CTC</span>
              <div className="text-xl font-black text-emerald-600 mt-1 font-mono">
                ₹{avgStaffGross.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-slate-500">Average compensation package</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Total Net Take-Home</span>
              <div className="text-xl font-black text-blue-600 mt-1 font-mono">
                ₹{totalMonthlyNet.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-slate-500">After statutory deductions</span>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-72">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search staff by name or code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 bg-slate-50"
                />
              </div>

              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={selectedDeptFilter}
                  onChange={(e) => setSelectedDeptFilter(e.target.value)}
                  className="text-xs font-semibold text-slate-700 bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Departments</option>
                  {departments.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <span className="text-xs font-bold text-slate-500">
              Showing {computedStaffData.length} of {staffList.length} staff
            </span>
          </div>

          {/* Staff CTC Master Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Staff Member</th>
                    <th className="py-3 px-3">Department</th>
                    <th className="py-3 px-3">Designation</th>
                    <th className="py-3 px-3 text-right">Gross CTC (₹)</th>
                    <th className="py-3 px-3 text-right">Basic Pay (₹)</th>
                    <th className="py-3 px-3 text-right">Allowances</th>
                    <th className="py-3 px-3 text-right">Statutory Deductions</th>
                    <th className="py-3 px-3 text-right">Net Take-Home</th>
                    <th className="py-3 px-4 text-center w-28">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {computedStaffData.map((staff) => (
                    <tr key={staff.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-slate-900">{staff.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          Code: {staff.code} &bull; {staff.phone || 'No phone'}
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                          {staff.department}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-slate-600">
                        {staff.designation}
                      </td>
                      <td className="py-3.5 px-3 text-right font-black font-mono text-slate-900">
                        ₹{staff.grossSalary?.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono text-slate-700">
                        ₹{staff.basic?.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono text-slate-700">
                        ₹{staff.totalAllowances?.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono text-rose-600 font-bold">
                        -₹{staff.totalDeductions?.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-3 text-right font-black font-mono text-emerald-600 text-sm">
                        ₹{staff.netSalary?.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(staff)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                          Edit CTC
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: INSTITUTIONAL POLICY SETUP ================= */}
      {activeTab === 'POLICY_RULES' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn">
          {/* Left 8 Cols: Policy Configuration Form */}
          <div className="lg:col-span-8 space-y-5">
            {/* 1. Basic Salary Component */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">1. Basic Salary Component</h3>
                  <p className="text-[11px] text-slate-400">Percentage of staff gross salary designated as core Basic Pay</p>
                </div>
                <span className="text-base font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                  {policies.basicPercentOfGross}%
                </span>
              </div>

              <div className="pt-2">
                <input
                  type="range"
                  min="30"
                  max="60"
                  step="5"
                  value={policies.basicPercentOfGross || 45}
                  onChange={(e) => setPolicies({ ...policies, basicPercentOfGross: Number(e.target.value) })}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1">
                  <span>30% Minimum</span>
                  <span>40% Standard</span>
                  <span>45% Recommended</span>
                  <span>50%</span>
                  <span>60% Maximum</span>
                </div>
              </div>
            </div>

            {/* 2. Allowances Master */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">2. Allowances & Compensation Additions</h3>
                  <p className="text-[11px] text-slate-400">HRA, DA, Travel, Medical, and custom institutional allowances</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddAllowance}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Allowance
                </button>
              </div>

              <div className="space-y-3">
                {(policies.allowances || []).map((al) => (
                  <div key={al.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center gap-3">
                    <div className="flex-1 w-full sm:w-auto">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Allowance Label</label>
                      <input
                        type="text"
                        value={al.label}
                        onChange={(e) => handleUpdateAllowance(al.id, 'label', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white font-semibold"
                      />
                    </div>

                    <div className="w-full sm:w-48">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Calculation Type</label>
                      <select
                        value={al.calculationType}
                        onChange={(e) => handleUpdateAllowance(al.id, 'calculationType', e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white font-medium"
                      >
                        <option value="percent_of_basic">% of Basic Pay</option>
                        <option value="percent_of_gross">% of Gross Salary</option>
                        <option value="fixed_amount">Fixed Amount (₹)</option>
                      </select>
                    </div>

                    <div className="w-full sm:w-28">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                        {al.calculationType === 'fixed_amount' ? 'Amount (₹)' : 'Value (%)'}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={al.value}
                        onChange={(e) => handleUpdateAllowance(al.id, 'value', Number(e.target.value))}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white font-bold"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveAllowance(al.id)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition self-end sm:self-center cursor-pointer"
                      title="Remove allowance"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Statutory Compliance Rules */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                3. Statutory Compliance Settings (EPF & ESIC)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* EPF Box */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">Employees' Provident Fund (EPF)</span>
                    <input
                      type="checkbox"
                      checked={policies.deductions?.epf?.enabled}
                      onChange={(e) => setPolicies({
                        ...policies,
                        deductions: {
                          ...policies.deductions,
                          epf: { ...policies.deductions?.epf, enabled: e.target.checked }
                        }
                      })}
                      className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">12% deduction on Basic Pay up to statutory ceiling.</p>
                  <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400">Employee Share (%)</label>
                      <input
                        type="number"
                        value={policies.deductions?.epf?.employeePercent || 12}
                        onChange={(e) => setPolicies({
                          ...policies,
                          deductions: {
                            ...policies.deductions,
                            epf: { ...policies.deductions?.epf, employeePercent: Number(e.target.value) }
                          }
                        })}
                        className="w-full px-2.5 py-1 rounded border border-slate-300 bg-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400">Ceiling Limit (₹)</label>
                      <input
                        type="number"
                        value={policies.deductions?.epf?.wageCeiling || 15000}
                        onChange={(e) => setPolicies({
                          ...policies,
                          deductions: {
                            ...policies.deductions,
                            epf: { ...policies.deductions?.epf, wageCeiling: Number(e.target.value) }
                          }
                        })}
                        className="w-full px-2.5 py-1 rounded border border-slate-300 bg-white font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* ESIC Box */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">Employees' State Insurance (ESIC)</span>
                    <input
                      type="checkbox"
                      checked={policies.deductions?.esi?.enabled}
                      onChange={(e) => setPolicies({
                        ...policies,
                        deductions: {
                          ...policies.deductions,
                          esi: { ...policies.deductions?.esi, enabled: e.target.checked }
                        }
                      })}
                      className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">0.75% deduction if gross wage is ≤ ₹21,000/month.</p>
                  <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400">Employee Share (%)</label>
                      <input
                        type="number"
                        step="0.05"
                        value={policies.deductions?.esi?.employeePercent || 0.75}
                        onChange={(e) => setPolicies({
                          ...policies,
                          deductions: {
                            ...policies.deductions,
                            esi: { ...policies.deductions?.esi, employeePercent: Number(e.target.value) }
                          }
                        })}
                        className="w-full px-2.5 py-1 rounded border border-slate-300 bg-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400">Gross Wage Ceiling (₹)</label>
                      <input
                        type="number"
                        value={policies.deductions?.esi?.grossCeiling || 21000}
                        onChange={(e) => setPolicies({
                          ...policies,
                          deductions: {
                            ...policies.deductions,
                            esi: { ...policies.deductions?.esi, grossCeiling: Number(e.target.value) }
                          }
                        })}
                        className="w-full px-2.5 py-1 rounded border border-slate-300 bg-white font-bold"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right 4 Cols: Live Simulation Calculator */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4 sticky top-20">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Calculator className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">Live Compensation Simulator</h3>
                <p className="text-[11px] text-slate-400">Test how policies calculate on sample salaries</p>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Sample Monthly Gross CTC (₹)
              </label>
              <input
                type="number"
                step="1000"
                value={testGross}
                onChange={(e) => setTestGross(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 text-sm font-mono font-bold rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Basic Salary ({policies.basicPercentOfGross}%):</span>
                <span className="font-mono font-bold text-slate-800">₹{simBasic.toLocaleString('en-IN')}</span>
              </div>

              {simAllowancesBreakdown.map(al => (
                <div key={al.id} className="flex justify-between py-1 text-slate-600 text-[11px]">
                  <span>{al.label}:</span>
                  <span className="font-mono font-semibold">₹{al.amt?.toLocaleString('en-IN')}</span>
                </div>
              ))}

              <div className="flex justify-between py-1.5 border-t border-slate-100 font-bold text-slate-900">
                <span>Calculated Gross:</span>
                <span className="font-mono text-emerald-700">₹{simGross.toLocaleString('en-IN')}</span>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-1">
                <div className="flex justify-between text-rose-600 text-[11px]">
                  <span>EPF Deduction (12%):</span>
                  <span className="font-mono">-₹{epf.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-rose-600 text-[11px]">
                  <span>ESIC Deduction:</span>
                  <span className="font-mono">-₹{esi.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-rose-600 text-[11px]">
                  <span>Professional Tax:</span>
                  <span className="font-mono">-₹{pt}</span>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mt-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-emerald-800">Net Take-Home Pay</span>
                  <div className="text-lg font-black text-emerald-700 font-mono">
                    ₹{simNet.toLocaleString('en-IN')}
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-white px-2.5 py-1 rounded-lg border border-emerald-200">
                  {simGross > 0 ? Math.round((simNet / simGross) * 100) : 0}% of Gross
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT STAFF SALARY STRUCTURE ================= */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-indigo-600" />
                  Assign & Edit Staff Salary Package
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  {editingStaff.name} ({editingStaff.code}) &bull; {editingStaff.designation}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingStaff(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/50 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveStaffStructure} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Gross Monthly CTC (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="500"
                    min="1"
                    value={formGross}
                    onChange={(e) => handleGrossChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold font-mono text-slate-900 focus:outline-none focus:border-indigo-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Basic Salary Component (₹)
                  </label>
                  <input
                    type="number"
                    step="500"
                    min="1"
                    value={formBasic}
                    onChange={(e) => setFormBasic(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold font-mono text-slate-900 focus:outline-none focus:border-indigo-500 bg-white"
                  />
                </div>
              </div>

              {/* Dynamic Live Calculated Breakdown Preview */}
              {modalLiveCalc && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                  <div className="text-[11px] font-extrabold uppercase text-slate-600 tracking-wider flex items-center justify-between border-b border-slate-200 pb-1.5">
                    <span>Structure Breakdown Preview</span>
                    <span className="text-emerald-700">Gross: ₹{formGross?.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="space-y-1 text-slate-600 text-[11px]">
                    <div className="flex justify-between">
                      <span>Basic Pay:</span>
                      <span className="font-mono font-bold text-slate-800">₹{modalLiveCalc.basic?.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Allowances (HRA/DA/Special):</span>
                      <span className="font-mono font-bold text-slate-800">₹{modalLiveCalc.totalAllowances?.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-rose-600">
                      <span>Statutory Deductions (EPF + ESI + PT):</span>
                      <span className="font-mono font-bold">-₹{modalLiveCalc.totalDeductions?.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-200 text-xs font-black text-emerald-700">
                      <span>Estimated Net Take-Home:</span>
                      <span className="font-mono text-sm">₹{modalLiveCalc.netSalary?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingStaff(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs transition cursor-pointer"
                >
                  Save Salary Structure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
