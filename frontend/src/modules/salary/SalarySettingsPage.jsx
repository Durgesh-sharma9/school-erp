import React, { useState, useEffect } from 'react';
import {
  IndianRupee,
  Home,
  Save,
  RotateCcw,
  SlidersHorizontal,
  Calculator,
  CalendarDays,
  ShieldCheck,
  Building2,
  Plus,
  Trash2,
  CheckCircle2,
  Check,
  Info,
  Clock,
  Briefcase,
  Layers,
  Lock,
  Unlock,
  Sparkles,
  RefreshCcw,
  Edit2,
  X,
  Landmark,
  Users,
  UploadCloud,
  FileSignature,
  ExternalLink,
  Award,
  Image
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { tenantStore } from '../../services/tenantStore';
import {
  salaryStorage,
  DEFAULT_SALARY_POLICIES,
  DEFAULT_ATTENDANCE_POLICIES,
  DEFAULT_WORKFLOW_SETTINGS,
  DEFAULT_BANK_SETTINGS,
  DEFAULT_DEPARTMENTS,
  DEFAULT_DESIGNATIONS,
  getActiveStaffRoster
} from './salaryStore';

// iOS-style Smooth Toggle Component
const ToggleSwitch = ({ checked, onChange, label, description, badge }) => (
  <div className="flex items-center justify-between p-4 bg-slate-50/70 hover:bg-slate-50 border border-slate-200/80 rounded-2xl transition-all">
    <div className="pr-4 min-w-0">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-800">{label}</span>
        {badge && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
            {badge}
          </span>
        )}
      </div>
      {description && <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{description}</p>}
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
        checked ? 'bg-indigo-600' : 'bg-slate-300'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  </div>
);

export function SalarySettingsPage({ onNavigate }) {
  const { schoolId, schoolName: authSchoolName } = useAuth();
  const [activeTab, setActiveTab] = useState('rules'); // 'rules' | 'attendance' | 'workflow' | 'bank'
  const [isSaved, setIsSaved] = useState(false);

  // Helper to fetch official school name and branding images from School Profile (/school-info)
  const getSchoolBranding = () => {
    try {
      const profile = tenantStore.getSchoolProfile(schoolId);
      const branding = profile?.brandingImages || {};
      const logo = profile?.logoUrl || branding.school_logo || 'https://temp.erichost.app/assets/schools/jdisjr_221/school/1_school_photo_1766831297_f7516d5fc58b9af84fb1.jpg';
      const sig = branding.principal_sig || branding.manager_sig || branding.vice_principal_sig || '';
      const stamp = branding.school_stamp || '';
      const name = (profile?.schoolName || authSchoolName || 'JD INTERNATIONAL SCHOOL').trim().toUpperCase();
      return {
        schoolName: name,
        logoUrl: logo,
        signatureUrl: sig,
        stampUrl: stamp
      };
    } catch (e) {
      console.warn('Error reading school profile for salary settings:', e);
    }
    return {
      schoolName: 'JD INTERNATIONAL SCHOOL',
      logoUrl: 'https://temp.erichost.app/assets/schools/jdisjr_221/school/1_school_photo_1766831297_f7516d5fc58b9af84fb1.jpg',
      signatureUrl: '',
      stampUrl: ''
    };
  };

  const getOfficialSchoolName = () => getSchoolBranding().schoolName;

  // Real staff roster for staff count attribution
  const activeRoster = getActiveStaffRoster();

  // 1. Departments & Designations
  const [departments, setDepartments] = useState(() => salaryStorage.getDepartments());
  const [designations, setDesignations] = useState(() => salaryStorage.getDesignations());

  // Modal State for Department / Designation
  const [modalType, setModalType] = useState(null); // 'dept_add' | 'dept_edit' | 'desg_add' | 'desg_edit'
  const [activeItem, setActiveItem] = useState(null);
  const [deptForm, setDeptForm] = useState({ name: '', code: '' });
  const [desgForm, setDesgForm] = useState({ name: '', department: '' });

  // 2. Payroll Rules & Statutory Compliance
  const [policies, setPolicies] = useState(() => salaryStorage.getPolicies());

  // 3. Attendance & Leave Deduction Policies
  const [attPolicies, setAttPolicies] = useState(() => salaryStorage.getAttendancePolicies());

  // 4. Workflow & Security Permissions
  const [workflow, setWorkflow] = useState(() => salaryStorage.getWorkflowSettings());

  // 5. School Bank & Payout Configuration (Auto-sync school name, signature & images from School Profile)
  const [bankSettings, setBankSettings] = useState(() => {
    const saved = salaryStorage.getBankSettings();
    const branding = getSchoolBranding();
    return {
      ...saved,
      schoolAccountName: saved.schoolAccountName && saved.schoolAccountName !== 'JD INTERNATIONAL SCHOOL'
        ? saved.schoolAccountName
        : branding.schoolName,
      logoUrl: saved.logoUrl || branding.logoUrl,
      signatureUrl: saved.signatureUrl || branding.signatureUrl,
      stampUrl: saved.stampUrl || branding.stampUrl
    };
  });

  // Auto-sync school profile and branding on load
  useEffect(() => {
    const fetchProfileFromApi = async () => {
      try {
        const res = await fetch('/api/schools/profile', {
          headers: { 'x-school-id': schoolId || '' }
        });
        if (res.ok) {
          const json = await res.json();
          const p = json?.data || json;
          if (p) {
            const branding = p.brandingImages || {};
            const logo = p.logoUrl || branding.school_logo;
            const sig = branding.principal_sig || branding.manager_sig || branding.vice_principal_sig;
            const stamp = branding.school_stamp;
            setBankSettings(prev => ({
              ...prev,
              schoolAccountName: prev.schoolAccountName && prev.schoolAccountName !== 'JD INTERNATIONAL SCHOOL'
                ? prev.schoolAccountName
                : (p.schoolName || prev.schoolAccountName || 'JD INTERNATIONAL SCHOOL').trim().toUpperCase(),
              logoUrl: prev.logoUrl || logo || prev.logoUrl,
              signatureUrl: prev.signatureUrl || sig || prev.signatureUrl,
              stampUrl: prev.stampUrl || stamp || prev.stampUrl
            }));
          }
        }
      } catch (e) {
        // Fallback to local profile
      }
    };
    fetchProfileFromApi();
  }, [schoolId]);

  const handleSyncSchoolName = async () => {
    let branding = getSchoolBranding();
    try {
      const res = await fetch('/api/schools/profile', {
        headers: { 'x-school-id': schoolId || '' }
      });
      if (res.ok) {
        const json = await res.json();
        const p = json?.data || json;
        if (p) {
          const imgs = p.brandingImages || {};
          branding = {
            schoolName: (p.schoolName || branding.schoolName).trim().toUpperCase(),
            logoUrl: p.logoUrl || imgs.school_logo || branding.logoUrl,
            signatureUrl: imgs.principal_sig || imgs.manager_sig || imgs.vice_principal_sig || branding.signatureUrl,
            stampUrl: imgs.school_stamp || branding.stampUrl
          };
        }
      }
    } catch {}

    setBankSettings(prev => ({
      ...prev,
      schoolAccountName: branding.schoolName,
      logoUrl: branding.logoUrl || prev.logoUrl,
      signatureUrl: branding.signatureUrl || prev.signatureUrl,
      stampUrl: branding.stampUrl || prev.stampUrl
    }));
    toast.success('Successfully synchronized School Name, Signature, and Stamp from School Profile!');
  };

  const handleUploadAsset = (key, file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (PNG, JPG, SVG)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result;
      setBankSettings(prev => ({
        ...prev,
        [key]: base64
      }));

      // Two-way sync: save into School Profile (tenantStore) as well
      try {
        const slotKey = key === 'signatureUrl' ? 'principal_sig' : key === 'stampUrl' ? 'school_stamp' : 'school_logo';
        const prof = tenantStore.getSchoolProfile(schoolId);
        const updatedBranding = {
          ...(prof.brandingImages || {}),
          [slotKey]: base64
        };
        tenantStore.updateSchoolProfile(schoolId, {
          brandingImages: updatedBranding,
          ...(key === 'logoUrl' ? { logoUrl: base64 } : {})
        });
      } catch (err) {
        console.warn('Failed to two-way sync image to school profile:', err);
      }

      toast.success(`${key === 'signatureUrl' ? 'Authorized Signature' : key === 'stampUrl' ? 'School Stamp' : 'School Logo'} updated & synced with School Profile!`);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAsset = (key) => {
    setBankSettings(prev => ({
      ...prev,
      [key]: ''
    }));
    try {
      const slotKey = key === 'signatureUrl' ? 'principal_sig' : key === 'stampUrl' ? 'school_stamp' : 'school_logo';
      const prof = tenantStore.getSchoolProfile(schoolId);
      const updatedBranding = { ...(prof?.brandingImages || {}) };
      delete updatedBranding[slotKey];
      tenantStore.updateSchoolProfile(schoolId, {
        brandingImages: updatedBranding,
        ...(key === 'logoUrl' ? { logoUrl: '' } : {})
      });
    } catch (err) {
      console.warn('Failed to remove asset from school profile:', err);
    }
    toast.success(`${key === 'signatureUrl' ? 'Signature' : key === 'stampUrl' ? 'Stamp' : 'Logo'} removed.`);
  };

  // Department Handlers
  const openDeptModal = (dept = null) => {
    if (dept) {
      setActiveItem(dept);
      setDeptForm({ name: dept.name, code: dept.code || '' });
      setModalType('dept_edit');
    } else {
      setActiveItem(null);
      setDeptForm({ name: '', code: '' });
      setModalType('dept_add');
    }
  };

  const handleSaveDept = (e) => {
    e.preventDefault();
    const trimmed = deptForm.name.trim();
    if (!trimmed) {
      toast.error('Please enter department name');
      return;
    }

    const code = (deptForm.code.trim() || trimmed.slice(0, 4)).toUpperCase();
    const today = new Date().toLocaleDateString('en-GB'); // DD/MM/YYYY

    if (modalType === 'dept_edit' && activeItem) {
      const updated = departments.map(d =>
        d.id === activeItem.id ? { ...d, name: trimmed, code } : d
      );
      setDepartments(updated);
      salaryStorage.saveDepartments(updated);
      toast.success(`Department "${trimmed}" updated!`);
    } else {
      const isDuplicate = departments.some(d => d.name.toLowerCase() === trimmed.toLowerCase());
      if (isDuplicate) {
        toast.error(`Department "${trimmed}" already exists`);
        return;
      }
      const newDept = {
        id: `dept_${Date.now()}`,
        name: trimmed,
        code,
        createdAt: today
      };
      const updated = [...departments, newDept].sort((a, b) => a.name.localeCompare(b.name));
      setDepartments(updated);
      salaryStorage.saveDepartments(updated);
      toast.success(`Department "${trimmed}" created!`);
    }
    setModalType(null);
    setActiveItem(null);
  };

  const handleDeleteDept = (id) => {
    const target = departments.find(d => d.id === id);
    if (!target) return;
    if (window.confirm(`Are you sure you want to delete department "${target.name}"?`)) {
      const updated = departments.filter(d => d.id !== id);
      setDepartments(updated);
      salaryStorage.saveDepartments(updated);
      toast.success(`Department "${target.name}" removed`);
    }
  };

  // Designation Handlers
  const openDesgModal = (desg = null) => {
    if (desg) {
      setActiveItem(desg);
      setDesgForm({ name: desg.name, department: desg.department || (departments[0]?.name || '') });
      setModalType('desg_edit');
    } else {
      setActiveItem(null);
      setDesgForm({ name: '', department: departments[0]?.name || '' });
      setModalType('desg_add');
    }
  };

  const handleSaveDesg = (e) => {
    e.preventDefault();
    const trimmed = desgForm.name.trim();
    if (!trimmed) {
      toast.error('Please enter designation name');
      return;
    }

    const today = new Date().toLocaleDateString('en-GB');

    if (modalType === 'desg_edit' && activeItem) {
      const updated = designations.map(d =>
        d.id === activeItem.id ? { ...d, name: trimmed, department: desgForm.department } : d
      );
      setDesignations(updated);
      salaryStorage.saveDesignations(updated);
      toast.success(`Designation "${trimmed}" updated!`);
    } else {
      const isDuplicate = designations.some(d => d.name.toLowerCase() === trimmed.toLowerCase());
      if (isDuplicate) {
        toast.error(`Designation "${trimmed}" already exists`);
        return;
      }
      const newDesg = {
        id: `desg_${Date.now()}`,
        name: trimmed,
        department: desgForm.department || departments[0]?.name || 'Teaching',
        createdAt: today
      };
      const updated = [...designations, newDesg].sort((a, b) => a.name.localeCompare(b.name));
      setDesignations(updated);
      salaryStorage.saveDesignations(updated);
      toast.success(`Designation "${trimmed}" created!`);
    }
    setModalType(null);
    setActiveItem(null);
  };

  const handleDeleteDesg = (id) => {
    const target = designations.find(d => d.id === id);
    if (!target) return;
    if (window.confirm(`Are you sure you want to delete designation "${target.name}"?`)) {
      const updated = designations.filter(d => d.id !== id);
      setDesignations(updated);
      salaryStorage.saveDesignations(updated);
      toast.success(`Designation "${target.name}" removed`);
    }
  };

  // Allowance handlers
  const handleAddAllowance = () => {
    const newId = `allow_${Date.now()}`;
    setPolicies(prev => ({
      ...prev,
      allowances: [
        ...(prev.allowances || []),
        { id: newId, label: 'Custom Allowance', calculationType: 'fixed_amount', value: 1500 }
      ]
    }));
  };

  const handleUpdateAllowance = (index, field, value) => {
    setPolicies(prev => {
      const nextAllowances = [...(prev.allowances || [])];
      nextAllowances[index] = { ...nextAllowances[index], [field]: value };
      return { ...prev, allowances: nextAllowances };
    });
  };

  const handleRemoveAllowance = (index) => {
    setPolicies(prev => ({
      ...prev,
      allowances: (prev.allowances || []).filter((_, i) => i !== index)
    }));
  };

  // Professional Tax Slabs handlers
  const handleAddPtSlab = () => {
    setPolicies(prev => {
      const currentSlabs = prev.deductions?.professionalTax?.slabs || [];
      const last = currentSlabs[currentSlabs.length - 1];
      const nextMin = last && last.maxGross ? last.maxGross + 1 : 20001;
      return {
        ...prev,
        deductions: {
          ...prev.deductions,
          professionalTax: {
            ...prev.deductions?.professionalTax,
            slabs: [...currentSlabs, { minGross: nextMin, maxGross: null, monthlyTax: 200 }]
          }
        }
      };
    });
  };

  const handleUpdatePtSlab = (index, field, val) => {
    setPolicies(prev => {
      const currentSlabs = [...(prev.deductions?.professionalTax?.slabs || [])];
      currentSlabs[index] = {
        ...currentSlabs[index],
        [field]: val === '' ? null : Number(val)
      };
      return {
        ...prev,
        deductions: {
          ...prev.deductions,
          professionalTax: {
            ...prev.deductions?.professionalTax,
            slabs: currentSlabs
          }
        }
      };
    });
  };

  const handleRemovePtSlab = (index) => {
    setPolicies(prev => ({
      ...prev,
      deductions: {
        ...prev.deductions,
        professionalTax: {
          ...prev.deductions?.professionalTax,
          slabs: (prev.deductions?.professionalTax?.slabs || []).filter((_, i) => i !== index)
        }
      }
    }));
  };

  // Save All Settings
  const handleSaveAll = () => {
    salaryStorage.savePolicies(policies);
    salaryStorage.saveAttendancePolicies(attPolicies);
    salaryStorage.saveWorkflowSettings(workflow);
    salaryStorage.saveBankSettings(bankSettings);
    salaryStorage.saveDepartments(departments);
    salaryStorage.saveDesignations(designations);

    window.dispatchEvent(new Event('school_salary_settings_updated'));

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
    toast.success('Salary & Payroll Settings successfully saved!');
  };

  // Reset to Defaults
  const handleResetDefaults = () => {
    if (window.confirm('Reset all salary rules to standard JD International School configuration?')) {
      setPolicies(DEFAULT_SALARY_POLICIES);
      setAttPolicies(DEFAULT_ATTENDANCE_POLICIES);
      setWorkflow(DEFAULT_WORKFLOW_SETTINGS);
      setBankSettings(DEFAULT_BANK_SETTINGS);
      setDepartments(DEFAULT_DEPARTMENTS);
      setDesignations(DEFAULT_DESIGNATIONS);

      salaryStorage.savePolicies(DEFAULT_SALARY_POLICIES);
      salaryStorage.saveAttendancePolicies(DEFAULT_ATTENDANCE_POLICIES);
      salaryStorage.saveWorkflowSettings(DEFAULT_WORKFLOW_SETTINGS);
      salaryStorage.saveBankSettings(DEFAULT_BANK_SETTINGS);
      salaryStorage.saveDepartments(DEFAULT_DEPARTMENTS);
      salaryStorage.saveDesignations(DEFAULT_DESIGNATIONS);

      toast.success('Restored to standard institutional defaults.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      {/* 1:1 Executive Toolbar */}
      <div className="bg-white border-b border-slate-200/80 px-6 py-4 sticky top-0 z-20 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-slate-900 tracking-tight">Salary Settings</h1>
              <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-2xs">
                JD International School
              </span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
              <button onClick={() => onNavigate?.('/')} className="hover:text-indigo-600 flex items-center transition">
                <Home className="w-3.5 h-3.5 mr-1" />
                Home
              </button>
              <span>•</span>
              <button onClick={() => onNavigate?.('/salary-hub')} className="hover:text-indigo-600 transition">
                Salary
              </button>
              <span>•</span>
              <span className="text-slate-700 font-semibold">Institutional Policies</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            Reset Defaults
          </button>
          <button
            type="button"
            onClick={handleSaveAll}
            className={`flex items-center gap-2 px-5 py-2 text-xs font-bold text-white rounded-xl shadow-md transition-all ${
              isSaved
                ? 'bg-emerald-600 shadow-emerald-500/25'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/25 hover:shadow-indigo-500/35 active:scale-95'
            }`}
          >
            {isSaved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {isSaved ? 'Settings Saved!' : 'Save All Settings'}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 max-w-6xl mx-auto w-full space-y-6">
        {/* Compact Clean Tabs Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-white px-3 py-1 rounded-xl shadow-2xs">
          <div className="flex flex-wrap items-center gap-1">
            {[
              { id: 'rules', label: 'Payroll Rules & CTC', icon: Calculator },
              { id: 'attendance', label: 'Attendance & Leave Policy', icon: CalendarDays },
              { id: 'workflow', label: 'Approval Workflow', icon: ShieldCheck },
              { id: 'bank', label: 'School Bank & Signatory', icon: Landmark },
              { id: 'departments', label: 'Departments Master', icon: Building2 },
              { id: 'designations', label: 'Designations Master', icon: Briefcase }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer -mb-[5px] ${
                    isActive
                      ? 'border-indigo-600 text-indigo-600 bg-indigo-50/40 rounded-t-lg'
                      : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB: DEPARTMENTS */}
        {activeTab === 'departments' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Header toolbar */}
            <div className="flex flex-wrap justify-between items-center gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
                  {departments.length} DEPARTMENTS REGISTERED
                </span>
                <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">• Manage institutional branches & faculty divisions</span>
              </div>
              <button
                type="button"
                onClick={() => openDeptModal()}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs hover:shadow transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Department
              </button>
            </div>

            {/* Department Table */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/80 bg-slate-50/70 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                    <th className="px-6 py-3.5">Department Name</th>
                    <th className="px-6 py-3.5">Department Code</th>
                    <th className="px-6 py-3.5">Active Staff</th>
                    <th className="px-6 py-3.5">Created Date</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {departments.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                        No departments registered yet. Click &quot;Add Department&quot; above to create one.
                      </td>
                    </tr>
                  ) : (
                    departments.map((dept) => {
                      const staffCount = activeRoster.filter(s =>
                        s.department?.toLowerCase().includes(dept.name.toLowerCase()) ||
                        dept.name.toLowerCase().includes(s.department?.toLowerCase())
                      ).length;
                      return (
                        <tr key={dept.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-900">
                            <div className="flex items-center gap-2.5">
                              <div className="w-2 h-2 rounded-full bg-blue-600" />
                              <span>{dept.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-mono font-bold text-blue-700 text-[11px] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                              {dept.code || dept.name.slice(0, 4).toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              staffCount > 0
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-500'
                            }`}>
                              {staffCount} {staffCount === 1 ? 'Staff' : 'Staff'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-500 font-medium">
                            {dept.createdAt || '03/11/2026'}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="inline-flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => openDeptModal(dept)}
                                className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-blue-600 rounded-lg transition-colors cursor-pointer"
                                title="Edit Department"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteDept(dept.id)}
                                className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                                title="Delete Department"
                              >
                                <Trash2 className="w-4 h-4" />
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
          </div>
        )}

        {/* TAB: DESIGNATIONS */}
        {activeTab === 'designations' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Header toolbar */}
            <div className="flex flex-wrap justify-between items-center gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
                  {designations.length} DESIGNATIONS REGISTERED
                </span>
                <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">• Manage job roles & academic positions</span>
              </div>
              <button
                type="button"
                onClick={() => openDesgModal()}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs hover:shadow transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Designation
              </button>
            </div>

            {/* Designation Table */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/80 bg-slate-50/70 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                    <th className="px-6 py-3.5">Designation Name</th>
                    <th className="px-6 py-3.5">Department</th>
                    <th className="px-6 py-3.5">Active Staff</th>
                    <th className="px-6 py-3.5">Created Date</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {designations.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                        No designations registered yet. Click &quot;Add Designation&quot; above to create one.
                      </td>
                    </tr>
                  ) : (
                    designations.map((desg) => {
                      const staffCount = activeRoster.filter(s =>
                        s.designation?.toLowerCase().includes(desg.name.toLowerCase()) ||
                        desg.name.toLowerCase().includes(s.designation?.toLowerCase())
                      ).length;
                      return (
                        <tr key={desg.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-900">
                            <div className="flex items-center gap-2.5">
                              <div className="w-2 h-2 rounded-full bg-violet-600" />
                              <span>{desg.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-slate-700 text-[11px] bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                              {desg.department || 'General'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              staffCount > 0
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                : 'bg-slate-100 text-slate-500'
                            }`}>
                              {staffCount} {staffCount === 1 ? 'Staff' : 'Staff'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-500 font-medium">
                            {desg.createdAt || '03/11/2026'}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="inline-flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => openDesgModal(desg)}
                                className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-blue-600 rounded-lg transition-colors cursor-pointer"
                                title="Edit Designation"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteDesg(desg.id)}
                                className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                                title="Delete Designation"
                              >
                                <Trash2 className="w-4 h-4" />
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
          </div>
        )}

        {/* TAB 1: PAYROLL RULES & STATUTORY DEDUCTIONS */}
        {activeTab === 'rules' && (
          <div className="space-y-6 animate-fadeIn">
            {/* 1. Basic Component Slider */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-indigo-600" />
                    Core Basic Salary Ratio
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Defines the percentage allocated to Basic Pay when calculating monthly CTC component breakdowns.
                  </p>
                </div>
                <div className="bg-indigo-50 border border-indigo-200 text-indigo-800 px-3.5 py-1 rounded-xl text-xs font-extrabold shadow-2xs">
                  {policies.basicPercentOfGross}% of Gross CTC
                </div>
              </div>

              <div className="flex items-center gap-4 bg-slate-50/80 p-4 rounded-xl border border-slate-200/60">
                <input
                  type="range"
                  min="25"
                  max="70"
                  step="5"
                  value={policies.basicPercentOfGross}
                  onChange={(e) => setPolicies(prev => ({ ...prev, basicPercentOfGross: Number(e.target.value) }))}
                  className="flex-1 accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="25"
                    max="70"
                    value={policies.basicPercentOfGross}
                    onChange={(e) => setPolicies(prev => ({ ...prev, basicPercentOfGross: Number(e.target.value) }))}
                    className="w-16 px-2.5 py-1 text-center font-bold text-sm border border-slate-300 rounded-lg bg-white shadow-2xs"
                  />
                  <span className="text-xs font-bold text-slate-500">%</span>
                </div>
              </div>
            </div>

            {/* 2. Monthly Allowances Configuration */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Institutional Allowances</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Allowances credited to faculty and staff based on active institutional guidelines.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddAllowance}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 shadow-2xs transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Allowance
                </button>
              </div>

              <div className="space-y-3">
                {(policies.allowances || []).map((allowance, idx) => (
                  <div key={allowance.id || idx} className="flex flex-wrap items-center gap-3 p-3.5 bg-slate-50/80 border border-slate-200/80 rounded-2xl hover:border-slate-300 transition">
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                        Allowance Label
                      </label>
                      <input
                        type="text"
                        value={allowance.label}
                        onChange={(e) => handleUpdateAllowance(idx, 'label', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>

                    <div className="w-48">
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                        Calculation Mode
                      </label>
                      <select
                        value={allowance.calculationType}
                        onChange={(e) => handleUpdateAllowance(idx, 'calculationType', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
                      >
                        <option value="percent_of_basic">% of Basic Salary</option>
                        <option value="percent_of_gross">% of Gross CTC</option>
                        <option value="fixed_amount">Fixed Monthly Amount (₹)</option>
                      </select>
                    </div>

                    <div className="w-32">
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                        {allowance.calculationType === 'fixed_amount' ? 'Amount (₹)' : 'Value (%)'}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={allowance.value}
                        onChange={(e) => handleUpdateAllowance(idx, 'value', Number(e.target.value))}
                        className="w-full px-3 py-1.5 text-xs font-black border border-slate-200 rounded-xl bg-white text-slate-800"
                      />
                    </div>

                    <div className="pt-5">
                      <button
                        type="button"
                        onClick={() => handleRemoveAllowance(idx)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Remove Allowance"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Statutory Compliance (EPF, ESI, Professional Tax) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Statutory Deductions & Compliance</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Government regulations for Employees&apos; Provident Fund (EPF), ESIC, and State Professional Tax.
                </p>
              </div>

              {/* EPF Card */}
              <div className="border border-slate-200/90 rounded-2xl bg-white overflow-hidden shadow-2xs transition-all">
                {/* Card Header with embedded Toggle */}
                <div className="p-4 sm:p-5 flex items-center justify-between gap-4 bg-slate-50/60 border-b border-slate-100">
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100/80 shadow-2xs">
                      <Landmark className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-900">Employees&apos; Provident Fund (EPF)</span>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                          EPFO Act
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed truncate sm:overflow-visible">
                        Standard 12% deduction capped at ₹15,000 monthly statutory wage ceiling.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={policies.deductions?.epf?.enabled ?? true}
                    onClick={() => setPolicies(prev => ({
                      ...prev,
                      deductions: { ...prev.deductions, epf: { ...prev.deductions?.epf, enabled: !prev.deductions?.epf?.enabled } }
                    }))}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                      policies.deductions?.epf?.enabled ? 'bg-indigo-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        policies.deductions?.epf?.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Card Body */}
                {policies.deductions?.epf?.enabled ? (
                  <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        Employee Share (%)
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type="number"
                          step="0.1"
                          value={policies.deductions?.epf?.employeePercent ?? 12}
                          onChange={(e) => setPolicies(prev => ({
                            ...prev,
                            deductions: { ...prev.deductions, epf: { ...prev.deductions?.epf, employeePercent: Number(e.target.value) } }
                          }))}
                          className="w-full pl-3.5 pr-8 py-2 text-xs font-black text-slate-900 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                        />
                        <span className="absolute right-3.5 text-xs font-bold text-slate-400 pointer-events-none">%</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        Employer Share (%)
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type="number"
                          step="0.1"
                          value={policies.deductions?.epf?.employerPercent ?? 12}
                          onChange={(e) => setPolicies(prev => ({
                            ...prev,
                            deductions: { ...prev.deductions, epf: { ...prev.deductions?.epf, employerPercent: Number(e.target.value) } }
                          }))}
                          className="w-full pl-3.5 pr-8 py-2 text-xs font-black text-slate-900 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                        />
                        <span className="absolute right-3.5 text-xs font-bold text-slate-400 pointer-events-none">%</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        Wage Ceiling Limit (₹)
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-xs font-bold text-slate-400 pointer-events-none">₹</span>
                        <input
                          type="number"
                          value={policies.deductions?.epf?.wageCeiling ?? 15000}
                          onChange={(e) => setPolicies(prev => ({
                            ...prev,
                            deductions: { ...prev.deductions, epf: { ...prev.deductions?.epf, wageCeiling: Number(e.target.value) } }
                          }))}
                          className="w-full pl-7 pr-3.5 py-2 text-xs font-black text-slate-900 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="px-5 py-3.5 bg-slate-50/40 text-xs font-medium text-slate-400 italic">
                    EPF deduction is disabled for this institution.
                  </div>
                )}
              </div>

              {/* ESIC Card */}
              <div className="border border-slate-200/90 rounded-2xl bg-white overflow-hidden shadow-2xs transition-all">
                {/* Card Header with embedded Toggle */}
                <div className="p-4 sm:p-5 flex items-center justify-between gap-4 bg-slate-50/60 border-b border-slate-100">
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0 border border-violet-100/80 shadow-2xs">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-900">Employees&apos; State Insurance (ESIC)</span>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
                          ESIC Act
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed truncate sm:overflow-visible">
                        Applicable for support staff and employees earning gross wages up to ₹21,000/month.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={policies.deductions?.esi?.enabled ?? true}
                    onClick={() => setPolicies(prev => ({
                      ...prev,
                      deductions: { ...prev.deductions, esi: { ...prev.deductions?.esi, enabled: !prev.deductions?.esi?.enabled } }
                    }))}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                      policies.deductions?.esi?.enabled ? 'bg-indigo-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        policies.deductions?.esi?.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Card Body */}
                {policies.deductions?.esi?.enabled ? (
                  <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        Employee Share (%)
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type="number"
                          step="0.05"
                          value={policies.deductions?.esi?.employeePercent ?? 0.75}
                          onChange={(e) => setPolicies(prev => ({
                            ...prev,
                            deductions: { ...prev.deductions, esi: { ...prev.deductions?.esi, employeePercent: Number(e.target.value) } }
                          }))}
                          className="w-full pl-3.5 pr-8 py-2 text-xs font-black text-slate-900 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                        />
                        <span className="absolute right-3.5 text-xs font-bold text-slate-400 pointer-events-none">%</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        Employer Share (%)
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type="number"
                          step="0.05"
                          value={policies.deductions?.esi?.employerPercent ?? 3.25}
                          onChange={(e) => setPolicies(prev => ({
                            ...prev,
                            deductions: { ...prev.deductions, esi: { ...prev.deductions?.esi, employerPercent: Number(e.target.value) } }
                          }))}
                          className="w-full pl-3.5 pr-8 py-2 text-xs font-black text-slate-900 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                        />
                        <span className="absolute right-3.5 text-xs font-bold text-slate-400 pointer-events-none">%</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        Gross Wage Ceiling (₹)
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-xs font-bold text-slate-400 pointer-events-none">₹</span>
                        <input
                          type="number"
                          value={policies.deductions?.esi?.grossCeiling ?? 21000}
                          onChange={(e) => setPolicies(prev => ({
                            ...prev,
                            deductions: { ...prev.deductions, esi: { ...prev.deductions?.esi, grossCeiling: Number(e.target.value) } }
                          }))}
                          className="w-full pl-7 pr-3.5 py-2 text-xs font-black text-slate-900 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="px-5 py-3.5 bg-slate-50/40 text-xs font-medium text-slate-400 italic">
                    ESIC deduction is disabled for this institution.
                  </div>
                )}
              </div>

              {/* Professional Tax Slabs Card */}
              <div className="border border-slate-200/90 rounded-2xl bg-white overflow-hidden shadow-2xs transition-all">
                {/* Card Header with embedded Toggle & Add Button */}
                <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 bg-slate-50/60 border-b border-slate-100">
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100/80 shadow-2xs">
                      <Calculator className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-900">State Professional Tax (PT) Slabs</span>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {policies.deductions?.professionalTax?.state || 'Rajasthan'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Statutory monthly slab deductions applied automatically to employee gross earnings.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-auto">
                    <button
                      type="button"
                      onClick={handleAddPtSlab}
                      className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 px-3.5 py-1.5 rounded-xl transition shadow-2xs cursor-pointer active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Slab
                    </button>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={policies.deductions?.professionalTax?.enabled ?? true}
                      onClick={() => setPolicies(prev => ({
                        ...prev,
                        deductions: {
                          ...prev.deductions,
                          professionalTax: {
                            ...prev.deductions?.professionalTax,
                            enabled: !prev.deductions?.professionalTax?.enabled
                          }
                        }
                      }))}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                        policies.deductions?.professionalTax?.enabled ? 'bg-indigo-600' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          policies.deductions?.professionalTax?.enabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Slabs Body */}
                {policies.deductions?.professionalTax?.enabled ? (
                  <div className="p-4 sm:p-5 space-y-2.5 bg-white">
                    <div className="hidden sm:grid grid-cols-12 gap-3 px-3 py-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      <div className="col-span-3">Minimum Gross</div>
                      <div className="col-span-3">Maximum Gross</div>
                      <div className="col-span-4">Monthly Tax</div>
                      <div className="col-span-2 text-right">Action</div>
                    </div>

                    {(policies.deductions?.professionalTax?.slabs || []).map((slab, sIdx) => (
                      <div key={sIdx} className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2.5 p-2.5 sm:p-3 bg-slate-50/70 hover:bg-slate-50 rounded-xl border border-slate-200/80 transition-colors">
                        <div className="sm:col-span-3">
                          <label className="block sm:hidden text-[10px] font-bold text-slate-400 mb-1">MIN GROSS</label>
                          <div className="relative flex items-center">
                            <span className="absolute left-3 text-xs font-bold text-slate-400">₹</span>
                            <input
                              type="number"
                              value={slab.minGross}
                              onChange={(e) => handleUpdatePtSlab(sIdx, 'minGross', e.target.value)}
                              placeholder="0"
                              className="w-full pl-7 pr-3 py-1.5 text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block sm:hidden text-[10px] font-bold text-slate-400 mb-1">MAX GROSS</label>
                          <div className="relative flex items-center">
                            <span className="absolute left-3 text-xs font-bold text-slate-400">₹</span>
                            <input
                              type="number"
                              value={slab.maxGross ?? ''}
                              onChange={(e) => handleUpdatePtSlab(sIdx, 'maxGross', e.target.value)}
                              placeholder="Above"
                              className="w-full pl-7 pr-3 py-1.5 text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-4">
                          <label className="block sm:hidden text-[10px] font-bold text-slate-400 mb-1">MONTHLY TAX</label>
                          <div className="relative flex items-center">
                            <span className="absolute left-3 text-xs font-black text-emerald-600">₹</span>
                            <input
                              type="number"
                              value={slab.monthlyTax}
                              onChange={(e) => handleUpdatePtSlab(sIdx, 'monthlyTax', e.target.value)}
                              className="w-full pl-7 pr-3 py-1.5 text-xs font-black text-emerald-700 bg-emerald-50/40 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-2 flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleRemovePtSlab(sIdx)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                            title="Remove Slab"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-5 py-3.5 bg-slate-50/40 text-xs font-medium text-slate-400 italic">
                    Professional Tax deduction is disabled for this institution.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ATTENDANCE & LEAVE DEDUCTION POLICIES */}
        {activeTab === 'attendance' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-indigo-600" />
                  Monthly Attendance Calculation Engine
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Determines how days are counted, how leave deductions occur, and how overtime is computed.
                </p>
              </div>

              {/* 3 Calculation Modes as Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    id: 'Calendar Days',
                    title: 'Actual Calendar Days',
                    desc: 'Divides salary by exact days in the month (28, 29, 30, or 31)'
                  },
                  {
                    id: 'Working Days',
                    title: 'Working Days Only',
                    desc: 'Excludes Sundays & official holidays from monthly divisor'
                  },
                  {
                    id: 'Fixed 30 Days',
                    title: 'Fixed 30-Day Month',
                    desc: 'Every month is normalized to exactly 30 billable days'
                  }
                ].map(method => {
                  const isSelected = attPolicies.calculationMethod === method.id;
                  return (
                    <div
                      key={method.id}
                      onClick={() => setAttPolicies(p => ({ ...p, calculationMethod: method.id }))}
                      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between min-h-[110px] h-auto gap-3 relative select-none ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 shadow-xs ring-2 ring-indigo-500/20'
                          : 'border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-extrabold text-xs text-slate-900 tracking-tight">{method.title}</span>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs'
                            : 'border-slate-300 bg-white'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                      <p className="text-[11.5px] text-slate-500 leading-relaxed font-medium m-0">{method.desc}</p>
                    </div>
                  );
                })}
              </div>

              {/* School Hours & Timings */}
              <div className="border border-slate-200/90 rounded-2xl bg-white overflow-hidden shadow-2xs">
                <div className="p-4 sm:p-5 bg-slate-50/60 border-b border-slate-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">School Hours & Timings</h4>
                    <p className="text-[11px] text-slate-500">Official institutional working schedule and daily shift window.</p>
                  </div>
                </div>

                <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Daily Working Hours
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="16"
                      value={attPolicies.workingHoursPerDay ?? 8}
                      onChange={(e) => setAttPolicies(p => ({ ...p, workingHoursPerDay: Number(e.target.value) }))}
                      className="w-full px-3.5 py-2 text-xs font-black text-slate-900 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Start Timing
                    </label>
                    <input
                      type="text"
                      placeholder="08:00"
                      value={attPolicies.schoolTimingStart ?? '08:00'}
                      onChange={(e) => setAttPolicies(p => ({ ...p, schoolTimingStart: e.target.value }))}
                      className="w-full px-3.5 py-2 text-xs font-bold font-mono text-slate-900 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      End Timing
                    </label>
                    <input
                      type="text"
                      placeholder="16:00"
                      value={attPolicies.schoolTimingEnd ?? '16:00'}
                      onChange={(e) => setAttPolicies(p => ({ ...p, schoolTimingEnd: e.target.value }))}
                      className="w-full px-3.5 py-2 text-xs font-bold font-mono text-slate-900 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Default Attendance Rules */}
              <div className="border border-slate-200/90 rounded-2xl bg-white overflow-hidden shadow-2xs">
                <div className="p-4 sm:p-5 bg-slate-50/60 border-b border-slate-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Default Attendance Rules</h4>
                    <p className="text-[11px] text-slate-500">Punctuality tolerance grace periods and half-day thresholds.</p>
                  </div>
                </div>

                <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Late Threshold (Minutes)
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="number"
                        min="0"
                        value={attPolicies.lateThresholdMinutes ?? 15}
                        onChange={(e) => setAttPolicies(p => ({ ...p, lateThresholdMinutes: Number(e.target.value) }))}
                        className="w-full pl-3.5 pr-14 py-2 text-xs font-black text-slate-900 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                      />
                      <span className="absolute right-3.5 text-xs font-bold text-slate-400 pointer-events-none">mins</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Half Day Threshold (Minutes)
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="number"
                        min="0"
                        value={attPolicies.halfDayThresholdMinutes ?? 240}
                        onChange={(e) => setAttPolicies(p => ({ ...p, halfDayThresholdMinutes: Number(e.target.value) }))}
                        className="w-full pl-3.5 pr-14 py-2 text-xs font-black text-slate-900 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                      />
                      <span className="absolute right-3.5 text-xs font-bold text-slate-400 pointer-events-none">mins</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Geographic Location (for Holiday Calendars) */}
              <div className="border border-slate-200/90 rounded-2xl bg-white overflow-hidden shadow-2xs">
                <div className="p-4 sm:p-5 bg-slate-50/60 border-b border-slate-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Geographic Location (for Holiday Calendars)</h4>
                    <p className="text-[11px] text-slate-500">Determines state holidays and regional statutory compliance.</p>
                  </div>
                </div>

                <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Country
                    </label>
                    <select
                      value={attPolicies.country ?? 'India'}
                      onChange={(e) => setAttPolicies(p => ({ ...p, country: e.target.value }))}
                      className="w-full px-3.5 py-2 text-xs font-bold text-slate-900 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                    >
                      <option value="India">India</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      State
                    </label>
                    <select
                      value={attPolicies.state ?? 'Rajasthan'}
                      onChange={(e) => setAttPolicies(p => ({ ...p, state: e.target.value }))}
                      className="w-full px-3.5 py-2 text-xs font-bold text-slate-900 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                    >
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Haryana">Haryana</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Madhya Pradesh">Madhya Pradesh</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Sandwich Leave & Half-day Rules */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ToggleSwitch
                  checked={attPolicies.sandwichLeaveEnabled}
                  onChange={(val) => setAttPolicies(p => ({ ...p, sandwichLeaveEnabled: val }))}
                  label="Sandwich Leave Policy"
                  description="Treat weekend as unpaid leave if absent on both Friday and Monday."
                />

                <div className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800">Half-Day Deduction Value</span>
                      <p className="text-[11px] text-slate-500">Percentage of day's salary paid for half-day work.</p>
                    </div>
                    <span className="text-xs font-extrabold text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded-full">
                      {attPolicies.halfDayCustomPercent || 50}% Pay
                    </span>
                  </div>
                  <input
                    type="range"
                    min="25"
                    max="75"
                    step="5"
                    value={attPolicies.halfDayCustomPercent || 50}
                    onChange={(e) => setAttPolicies(p => ({ ...p, halfDayCustomPercent: Number(e.target.value) }))}
                    className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Overtime Policy */}
              <div className="p-4.5 bg-slate-50/80 border border-slate-200/80 rounded-2xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-slate-800">Overtime & Extra-Duty Compensations</span>
                    <p className="text-[11px] text-slate-500">Applies to exam duties, sports coaching, or evening boarding supervisions.</p>
                  </div>
                  <select
                    value={attPolicies.overtimePolicy}
                    onChange={(e) => setAttPolicies(p => ({ ...p, overtimePolicy: e.target.value }))}
                    className="px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-xl bg-white shadow-2xs cursor-pointer"
                  >
                    <option value="Hourly">Hourly Rate Formula</option>
                    <option value="Fixed Flat Rate">Daily Flat Rate (₹500/day)</option>
                    <option value="Disabled">Disabled / No Overtime</option>
                  </select>
                </div>

                {attPolicies.overtimePolicy === 'Hourly' && (
                  <div className="flex items-center gap-3 pt-2 border-t border-slate-200/60">
                    <span className="text-xs font-bold text-slate-600">Standard Daily Working Hours:</span>
                    <input
                      type="number"
                      min="4"
                      max="12"
                      value={attPolicies.workingHoursPerDay}
                      onChange={(e) => setAttPolicies(p => ({ ...p, workingHoursPerDay: Number(e.target.value) }))}
                      className="w-20 px-2.5 py-1 text-xs font-black border border-slate-300 rounded-lg bg-white text-center"
                    />
                    <span className="text-[11px] text-slate-400">Formula: (Gross / Month Days / Hours) × OT Hours</span>
                  </div>
                )}
              </div>

              {/* Billing Cycle & Net Rounding */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Salary Period / Billing Cycle</label>
                  <select
                    value={attPolicies.salaryCycle}
                    onChange={(e) => setAttPolicies(p => ({ ...p, salaryCycle: e.target.value }))}
                    className="w-full px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500/20 cursor-pointer shadow-2xs"
                  >
                    <option value="1st to Last Day">1st to Last Day of Month (Standard)</option>
                    <option value="26th to 25th">26th of Last Month to 25th of Current Month</option>
                    <option value="Custom">Custom Start Date</option>
                  </select>
                </div>

                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Net Pay Rounding</label>
                  <select
                    value={attPolicies.salaryRounding}
                    onChange={(e) => setAttPolicies(p => ({ ...p, salaryRounding: e.target.value }))}
                    className="w-full px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500/20 cursor-pointer shadow-2xs"
                  >
                    <option value="Nearest 1">Round to Nearest ₹1 (e.g., ₹45,218)</option>
                    <option value="Nearest 10">Round to Nearest ₹10 (e.g., ₹45,220)</option>
                    <option value="No Rounding">Exact Decimals (e.g., ₹45,218.42)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: WORKFLOW & SECURITY PERMISSIONS */}
        {activeTab === 'workflow' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  Approval Workflow & Authorization Policies
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Control which actions require school management approval and manage role access.
                </p>
              </div>

              <div className="space-y-3.5">
                <ToggleSwitch
                  checked={workflow.requireAdminApproval}
                  onChange={(val) => setWorkflow(w => ({ ...w, requireAdminApproval: val }))}
                  label="Require Principal / Director Sign-off"
                  description="Salary batch status must transition through 'Approved' before bank NEFT advice can be exported."
                  badge="Security Policy"
                />

                <ToggleSwitch
                  checked={workflow.lockAfterApproval}
                  onChange={(val) => setWorkflow(w => ({ ...w, lockAfterApproval: val }))}
                  label="Lock Records After Final Approval"
                  description="Prevents accidental modifications to allowances, basic, or advance recoveries once signed."
                  badge="Audit Compliance"
                />
              </div>

              {/* Accountant Permissions */}
              <div className="pt-2">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">
                  Accountant / Payroll Operator Privileges
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: 'edit', label: 'Edit Basic Salary & Custom Adjustments' },
                    { key: 'recalculate', label: 'Recalculate Batch from Live Attendance' },
                    { key: 'generate', label: 'Generate Monthly Draft Payroll Batches' },
                    { key: 'disburse', label: 'Mark Batch as Disbursed / Paid' }
                  ].map(perm => {
                    const isAllowed = workflow.accountantPermissions[perm.key];
                    return (
                      <div
                        key={perm.key}
                        onClick={() => setWorkflow(w => ({
                          ...w,
                          accountantPermissions: {
                            ...w.accountantPermissions,
                            [perm.key]: !w.accountantPermissions[perm.key]
                          }
                        }))}
                        className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition ${
                          isAllowed
                            ? 'bg-indigo-50/50 border-indigo-300 text-indigo-950 font-bold shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-xs">{perm.label}</span>
                        <div className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs font-bold ${
                          isAllowed ? 'bg-indigo-600 text-white' : 'border border-slate-300'
                        }`}>
                          {isAllowed && '✓'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SCHOOL BANK & SIGNATORY CREDENTIALS */}
        {activeTab === 'bank' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  School Disbursing Bank & Authorized Signatory
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Appears on official bank transfer advice letters, salary certificates, and printed payslips.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                      School Account Holder Name
                    </label>
                    <button
                      type="button"
                      onClick={handleSyncSchoolName}
                      className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg border border-indigo-200/80 flex items-center gap-1 transition shadow-2xs cursor-pointer"
                      title="Fetch live name from School Profile (/school-info)"
                    >
                      <RefreshCcw className="w-3 h-3" />
                      Sync from School Profile
                    </button>
                  </div>
                  <input
                    type="text"
                    value={bankSettings.schoolAccountName}
                    onChange={(e) => setBankSettings(b => ({ ...b, schoolAccountName: e.target.value }))}
                    className="w-full px-3.5 py-2 text-xs font-extrabold border border-slate-200 rounded-xl bg-white uppercase tracking-wide focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Auto-fetched from School Profile ({getOfficialSchoolName()}). Can be customized if your bank account is under a Trust or Society name.
                  </p>
                </div>

                <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
                  <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">
                    Disbursing Bank Name
                  </label>
                  <input
                    type="text"
                    value={bankSettings.bankName}
                    onChange={(e) => setBankSettings(b => ({ ...b, bankName: e.target.value }))}
                    className="w-full px-3.5 py-2 text-xs font-bold border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
                  <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">
                    School Bank Account Number
                  </label>
                  <input
                    type="text"
                    value={bankSettings.accountNumber}
                    onChange={(e) => setBankSettings(b => ({ ...b, accountNumber: e.target.value }))}
                    className="w-full px-3.5 py-2 text-xs font-mono font-black border border-slate-200 rounded-xl bg-white tracking-wider focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
                  <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">
                    Bank IFSC Code & Branch
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={bankSettings.ifscCode}
                      onChange={(e) => setBankSettings(b => ({ ...b, ifscCode: e.target.value }))}
                      placeholder="IFSC"
                      className="w-full px-3 py-2 text-xs font-mono font-black border border-slate-200 rounded-xl bg-white uppercase tracking-wider focus:ring-2 focus:ring-indigo-500/20"
                    />
                    <input
                      type="text"
                      value={bankSettings.branch}
                      onChange={(e) => setBankSettings(b => ({ ...b, branch: e.target.value }))}
                      placeholder="Branch"
                      className="w-full px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>

                <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
                  <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">
                    Authorized Signatory Name
                  </label>
                  <input
                    type="text"
                    value={bankSettings.signatoryName}
                    onChange={(e) => setBankSettings(b => ({ ...b, signatoryName: e.target.value }))}
                    className="w-full px-3.5 py-2 text-xs font-extrabold border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
                  <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">
                    Signatory Designation
                  </label>
                  <input
                    type="text"
                    value={bankSettings.signatoryDesignation}
                    onChange={(e) => setBankSettings(b => ({ ...b, signatoryDesignation: e.target.value }))}
                    className="w-full px-3.5 py-2 text-xs font-bold border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              {/* Institutional Visual Branding & Official Seals */}
              <div className="border-t border-slate-100 pt-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <FileSignature className="w-4 h-4 text-indigo-600" />
                      Signatures, Official Stamp & Institutional Logo
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Automatically fetched from School Profile (<span className="text-indigo-600 font-bold">/school-info</span>). These visual assets print directly on salary payslips, certificates, and official bank letters.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSyncSchoolName}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-200 transition cursor-pointer"
                    >
                      <RefreshCcw className="w-3.5 h-3.5" />
                      Sync from School Profile
                    </button>
                    {onNavigate && (
                      <button
                        type="button"
                        onClick={() => onNavigate('/school-info')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Open School Profile
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Card 1: Authorized Signatory Signature */}
                  <div className="bg-slate-50/70 rounded-2xl border border-slate-200/80 p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                          <FileSignature className="w-3.5 h-3.5 text-indigo-600" />
                          Signatory Signature
                        </span>
                        {bankSettings.signatureUrl ? (
                          <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                            Not Set
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mb-3">
                        Principal / Director signature rendered on all generated payslips.
                      </p>

                      <div className="h-32 bg-white rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center p-3 relative overflow-hidden group">
                        {bankSettings.signatureUrl ? (
                          <img
                            src={bankSettings.signatureUrl}
                            alt="Principal Signature"
                            className="max-h-full max-w-full object-contain filter drop-shadow-xs group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="text-center">
                            <UploadCloud className="w-6 h-6 text-slate-300 mx-auto mb-1" />
                            <span className="text-[11px] font-semibold text-slate-400">No signature uploaded</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-200/60">
                      <input
                        id="sig-upload-input"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleUploadAsset('signatureUrl', e.target.files?.[0])}
                      />
                      <label
                        htmlFor="sig-upload-input"
                        className="flex-1 text-center py-1.5 px-3 text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-300 shadow-xs cursor-pointer transition"
                      >
                        {bankSettings.signatureUrl ? 'Change Signature' : 'Upload Signature'}
                      </label>
                      {bankSettings.signatureUrl && (
                        <button
                          type="button"
                          onClick={() => handleRemoveAsset('signatureUrl')}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl border border-rose-200 transition cursor-pointer"
                          title="Remove signature"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Card 2: Official School Stamp / Seal */}
                  <div className="bg-slate-50/70 rounded-2xl border border-slate-200/80 p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-purple-600" />
                          Official School Stamp
                        </span>
                        {bankSettings.stampUrl ? (
                          <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                            Not Set
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mb-3">
                        Official school seal watermarked over the principal signature.
                      </p>

                      <div className="h-32 bg-white rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center p-3 relative overflow-hidden group">
                        {bankSettings.stampUrl ? (
                          <img
                            src={bankSettings.stampUrl}
                            alt="School Stamp"
                            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="text-center">
                            <Award className="w-6 h-6 text-slate-300 mx-auto mb-1" />
                            <span className="text-[11px] font-semibold text-slate-400">No stamp uploaded</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-200/60">
                      <input
                        id="stamp-upload-input"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleUploadAsset('stampUrl', e.target.files?.[0])}
                      />
                      <label
                        htmlFor="stamp-upload-input"
                        className="flex-1 text-center py-1.5 px-3 text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-300 shadow-xs cursor-pointer transition"
                      >
                        {bankSettings.stampUrl ? 'Change Stamp' : 'Upload Stamp'}
                      </label>
                      {bankSettings.stampUrl && (
                        <button
                          type="button"
                          onClick={() => handleRemoveAsset('stampUrl')}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl border border-rose-200 transition cursor-pointer"
                          title="Remove stamp"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Card 3: Official School Logo */}
                  <div className="bg-slate-50/70 rounded-2xl border border-slate-200/80 p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                          <Image className="w-3.5 h-3.5 text-blue-600" />
                          School Emblem & Logo
                        </span>
                        {bankSettings.logoUrl ? (
                          <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                            Not Set
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mb-3">
                        Official crest printed in payslip header and bank letters.
                      </p>

                      <div className="h-32 bg-white rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center p-3 relative overflow-hidden group">
                        {bankSettings.logoUrl ? (
                          <img
                            src={bankSettings.logoUrl}
                            alt="School Logo"
                            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="text-center">
                            <Image className="w-6 h-6 text-slate-300 mx-auto mb-1" />
                            <span className="text-[11px] font-semibold text-slate-400">No logo uploaded</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-200/60">
                      <input
                        id="logo-upload-input"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleUploadAsset('logoUrl', e.target.files?.[0])}
                      />
                      <label
                        htmlFor="logo-upload-input"
                        className="flex-1 text-center py-1.5 px-3 text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-300 shadow-xs cursor-pointer transition"
                      >
                        {bankSettings.logoUrl ? 'Change Logo' : 'Upload Logo'}
                      </label>
                      {bankSettings.logoUrl && (
                        <button
                          type="button"
                          onClick={() => handleRemoveAsset('logoUrl')}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl border border-rose-200 transition cursor-pointer"
                          title="Remove logo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* DEPARTMENT & DESIGNATION MODAL */}
      {modalType && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-fadeIn">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  {modalType.startsWith('dept') ? <Building2 className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  {modalType === 'dept_add' && 'Add New Department'}
                  {modalType === 'dept_edit' && 'Edit Department'}
                  {modalType === 'desg_add' && 'Add New Designation'}
                  {modalType === 'desg_edit' && 'Edit Designation'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalType(null)}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            {modalType.startsWith('dept') ? (
              <form onSubmit={handleSaveDept} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">
                    Department Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    autoFocus
                    required
                    placeholder="e.g. Science, Accounts, Transport"
                    value={deptForm.name}
                    onChange={(e) => setDeptForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">
                    Department Code <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SCI, ACC, TRANS"
                    value={deptForm.code}
                    onChange={(e) => setDeptForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                    className="w-full px-3.5 py-2.5 text-xs font-mono font-bold uppercase border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Auto-generated from first 4 letters if left blank.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setModalType(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition active:scale-95 cursor-pointer"
                  >
                    {modalType === 'dept_edit' ? 'Update Department' : 'Save Department'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSaveDesg} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">
                    Designation Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    autoFocus
                    required
                    placeholder="e.g. Senior Faculty, Lab In-charge, Driver"
                    value={desgForm.name}
                    onChange={(e) => setDesgForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">
                    Assigned Department
                  </label>
                  <select
                    value={desgForm.department}
                    onChange={(e) => setDesgForm(f => ({ ...f, department: e.target.value }))}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setModalType(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition active:scale-95 cursor-pointer"
                  >
                    {modalType === 'desg_edit' ? 'Update Designation' : 'Save Designation'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
