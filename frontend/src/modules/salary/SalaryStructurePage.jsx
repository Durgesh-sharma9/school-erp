import React, { useState, useMemo, useEffect } from 'react';
import {
  Users,
  Search,
  Plus,
  Download,
  Eye,
  Edit2,
  Trash2,
  RefreshCcw,
  CheckSquare,
  Square,
  Lock,
  ChevronRight,
  ChevronLeft,
  X,
  Building,
  Upload,
  Check,
  Paperclip,
  Briefcase,
  IndianRupee,
  Phone,
  Mail,
  Landmark,
  ShieldCheck,
  Calendar,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  salaryStorage,
  getAllStaffRoster,
  getActiveStaffRoster,
  calculateStaffSalary,
  DEFAULT_DEPARTMENTS,
  DEFAULT_DESIGNATIONS
} from './salaryStore';

export function SalaryStructurePage({ onNavigate }) {
  // Staff records state from store
  const [staffList, setStaffList] = useState(() => getAllStaffRoster());
  const [policies, setPolicies] = useState(() => salaryStorage.getPolicies());
  const [departments, setDepartments] = useState(() => salaryStorage.getDepartments());
  const [designations, setDesignations] = useState(() => salaryStorage.getDesignations());

  // Filters & Search
  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [empTypeFilter, setEmpTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkStatus, setBulkStatus] = useState('');

  // Modals state
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState(null);
  const [step, setStep] = useState(1);
  const [viewingStaff, setViewingStaff] = useState(null);

  // Sub-modals for inline master creation
  const [showAddDeptModal, setShowAddDeptModal] = useState(false);
  const [showAddDesgModal, setShowAddDesgModal] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  const [newDesgName, setNewDesgName] = useState('');

  // Wizard form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: 'Male',
    dob: '1990-01-01',
    joiningDate: new Date().toISOString().slice(0, 10),
    department: 'Administration',
    designation: 'Principal',
    category: 'Teaching',
    employmentType: 'Permanent',
    workType: 'Full Time',
    workingHours: 8,
    email: '',
    phone: '',
    pan: 'ABCDE1234F',
    aadhaar: '123456789012',
    address: 'Jaipur, Rajasthan',
    enablePortalAccess: false,
    portalRole: 'Employee',
    monthlyGross: 35000,
    salaryStartDate: new Date().toISOString().slice(0, 10),
    salaryBasic: 15750,
    salaryHra: 6300,
    salarySpecialAllowance: 3500,
    salaryTransport: 1800,
    salaryMedical: 1250,
    salaryOtherAllowance: 6400,
    salaryPf: 1800,
    salaryEsi: 0,
    salaryProfessionalTax: 200,
    bankAccountHolder: '',
    bankName: 'State Bank of India',
    bankAccountNumber: '389201948201',
    bankConfirmAccountNumber: '389201948201',
    bankIfscCode: 'SBIN0001234',
    bankBranchName: 'Bhankrota, Jaipur',
    bankUpiId: ''
  });

  // Re-fetch staff when updated
  const refreshData = () => {
    setStaffList(getAllStaffRoster());
    setDepartments(salaryStorage.getDepartments());
    setDesignations(salaryStorage.getDesignations());
    setPolicies(salaryStorage.getPolicies());
  };

  useEffect(() => {
    const handleUpdate = () => refreshData();
    window.addEventListener('school_erp_staff_salary_updated', handleUpdate);
    window.addEventListener('school_erp_salary_departments_updated', handleUpdate);
    window.addEventListener('school_erp_salary_designations_updated', handleUpdate);
    return () => {
      window.removeEventListener('school_erp_staff_salary_updated', handleUpdate);
      window.removeEventListener('school_erp_salary_departments_updated', handleUpdate);
      window.removeEventListener('school_erp_salary_designations_updated', handleUpdate);
    };
  }, []);

  // Filtered staff
  const filteredStaff = useMemo(() => {
    return staffList.filter(s => {
      if (genderFilter && s.gender !== genderFilter) return false;
      if (categoryFilter && s.category !== categoryFilter) return false;
      if (deptFilter && s.department !== deptFilter) return false;
      if (empTypeFilter && s.employmentType !== empTypeFilter) return false;
      if (statusFilter && s.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = s.name?.toLowerCase().includes(q);
        const matchCode = s.code?.toLowerCase().includes(q);
        const matchPhone = s.phone?.includes(q);
        const matchEmail = s.email?.toLowerCase().includes(q);
        if (!matchName && !matchCode && !matchPhone && !matchEmail) return false;
      }
      return true;
    });
  }, [staffList, genderFilter, categoryFilter, deptFilter, empTypeFilter, statusFilter, search]);

  // Bulk Selection Handlers
  const handleSelectRow = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredStaff.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredStaff.map(s => s.id));
    }
  };

  const handleBulkStatusChange = () => {
    if (selectedIds.length === 0 || !bulkStatus) return;
    salaryStorage.bulkUpdateStaffStatus(selectedIds, bulkStatus);
    toast.success(`Updated ${selectedIds.length} staff to ${bulkStatus}`);
    setSelectedIds([]);
    setBulkStatus('');
    refreshData();
  };

  // CSV Export
  const handleExportCSV = () => {
    if (filteredStaff.length === 0) {
      toast.error('No staff records to export');
      return;
    }
    const headers = ['Employee ID', 'Name', 'Department', 'Designation', 'Category', 'Employment Type', 'Mobile', 'Email', 'Gross Salary', 'Basic Salary', 'Bank Name', 'Account No', 'IFSC', 'PAN', 'Status'];
    const rows = filteredStaff.map(s => [
      s.code,
      `"${s.name}"`,
      `"${s.department}"`,
      `"${s.designation}"`,
      s.category || 'Teaching',
      s.employmentType || 'Permanent',
      s.phone || '',
      s.email || '',
      s.grossSalary || 0,
      s.basicSalary || 0,
      `"${s.bankName || ''}"`,
      `"${s.accNo || ''}"`,
      s.ifsc || '',
      s.pan || '',
      s.status || 'Active'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Staff_Roster_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Staff roster exported to CSV!');
  };

  // Soft Deactivate
  const handleDeactivate = (staff) => {
    if (window.confirm(`Are you sure you want to mark ${staff.name} as Inactive? This will not delete historical records.`)) {
      salaryStorage.deleteStaffMember(staff.id);
      toast.success(`${staff.name} marked as Inactive`);
      refreshData();
    }
  };

  // Open Add Onboard Wizard
  const openAddStaff = () => {
    setIsEditing(false);
    setEditingStaffId(null);
    setStep(1);
    setFormData({
      firstName: '',
      lastName: '',
      gender: 'Male',
      dob: '1990-01-01',
      joiningDate: new Date().toISOString().slice(0, 10),
      department: departments[0]?.name || 'Administration',
      designation: designations[0]?.name || 'Principal',
      category: 'Teaching',
      employmentType: 'Permanent',
      workType: 'Full Time',
      workingHours: 8,
      email: '',
      phone: '',
      pan: 'ABCDE1234F',
      aadhaar: '123456789012',
      address: 'Jaipur, Rajasthan',
      enablePortalAccess: false,
      portalRole: 'Employee',
      monthlyGross: 35000,
      salaryStartDate: new Date().toISOString().slice(0, 10),
      salaryBasic: 15750,
      salaryHra: 6300,
      salarySpecialAllowance: 3500,
      salaryTransport: 1800,
      salaryMedical: 1250,
      salaryOtherAllowance: 6400,
      salaryPf: 1800,
      salaryEsi: 0,
      salaryProfessionalTax: 200,
      bankAccountHolder: '',
      bankName: 'State Bank of India',
      bankAccountNumber: '389201948201',
      bankConfirmAccountNumber: '389201948201',
      bankIfscCode: 'SBIN0001234',
      bankBranchName: 'Bhankrota, Jaipur',
      bankUpiId: ''
    });
    setIsOpenAddModal(true);
  };

  // Start Edit
  const startEdit = (staff) => {
    setIsEditing(true);
    setEditingStaffId(staff.id);
    setStep(1);
    const parts = (staff.name || '').split(' ');
    const fName = parts[0] || '';
    const lName = parts.slice(1).join(' ') || '';
    const gross = Number(staff.grossSalary || 35000);
    const basic = Number(staff.basicSalary || Math.round(gross * 0.45));

    // Dynamic component split
    const hra = Math.round(basic * 0.4);
    const special = Math.round(gross * 0.1);
    const transport = 1800;
    const medical = 1250;
    const other = Math.max(0, gross - (basic + hra + special + transport + medical));

    setFormData({
      firstName: fName,
      lastName: lName,
      gender: staff.gender || 'Male',
      dob: staff.dob || '1990-01-01',
      joiningDate: staff.joinDate || new Date().toISOString().slice(0, 10),
      department: staff.department || 'Administration',
      designation: staff.designation || 'Staff',
      category: staff.category || 'Teaching',
      employmentType: staff.employmentType || 'Permanent',
      workType: staff.workType || 'Full Time',
      workingHours: 8,
      email: staff.email || '',
      phone: staff.phone || '',
      pan: staff.pan || 'ABCDE1234F',
      aadhaar: staff.aadhaar || '123456789012',
      address: staff.address || 'Jaipur, Rajasthan',
      enablePortalAccess: false,
      portalRole: 'Employee',
      monthlyGross: gross,
      salaryStartDate: staff.joinDate || new Date().toISOString().slice(0, 10),
      salaryBasic: basic,
      salaryHra: hra,
      salarySpecialAllowance: special,
      salaryTransport: transport,
      salaryMedical: medical,
      salaryOtherAllowance: other,
      salaryPf: basic > 15000 ? 1800 : Math.round(basic * 0.12),
      salaryEsi: gross <= 21000 ? Math.round(gross * 0.0075) : 0,
      salaryProfessionalTax: 200,
      bankAccountHolder: staff.name || '',
      bankName: staff.bankName || 'State Bank of India',
      bankAccountNumber: staff.accNo || '',
      bankConfirmAccountNumber: staff.accNo || '',
      bankIfscCode: staff.ifsc || 'SBIN0001234',
      bankBranchName: 'Jaipur',
      bankUpiId: ''
    });
    setIsOpenAddModal(true);
  };

  // Auto-calculate breakdown when Gross changes
  const handleGrossChange = (val) => {
    const gross = Number(val) || 0;
    const basic = Math.round(gross * 0.45);
    const hra = Math.round(basic * 0.4);
    const special = Math.round(gross * 0.1);
    const transport = 1800;
    const medical = 1250;
    const other = Math.max(0, gross - (basic + hra + special + transport + medical));
    const pf = basic > 15000 ? 1800 : Math.round(basic * 0.12);
    const esi = gross <= 21000 ? Math.round(gross * 0.0075) : 0;

    setFormData(prev => ({
      ...prev,
      monthlyGross: gross,
      salaryBasic: basic,
      salaryHra: hra,
      salarySpecialAllowance: special,
      salaryTransport: transport,
      salaryMedical: medical,
      salaryOtherAllowance: other,
      salaryPf: pf,
      salaryEsi: esi
    }));
  };

  // Form Submission
  const handleWizardSubmit = (e) => {
    e.preventDefault();
    const fullName = `${formData.firstName} ${formData.lastName}`.trim() || 'New Staff';

    if (isEditing) {
      salaryStorage.updateStaffMember(editingStaffId, {
        name: fullName,
        department: formData.department,
        designation: formData.designation,
        category: formData.category,
        employmentType: formData.employmentType,
        workType: formData.workType,
        gender: formData.gender,
        phone: formData.phone,
        email: formData.email,
        pan: formData.pan,
        bankName: formData.bankName,
        accNo: formData.bankAccountNumber,
        ifsc: formData.bankIfscCode,
        grossSalary: Number(formData.monthlyGross),
        basicSalary: Number(formData.salaryBasic)
      });
      toast.success(`Staff record for ${fullName} updated!`);
    } else {
      salaryStorage.addStaffMember({
        name: fullName,
        department: formData.department,
        designation: formData.designation,
        category: formData.category,
        employmentType: formData.employmentType,
        workType: formData.workType,
        gender: formData.gender,
        phone: formData.phone,
        email: formData.email || `${formData.firstName.toLowerCase()}@jdinternationalschool.com`,
        pan: formData.pan,
        bankName: formData.bankName,
        accNo: formData.bankAccountNumber,
        ifsc: formData.bankIfscCode,
        grossSalary: Number(formData.monthlyGross),
        basicSalary: Number(formData.salaryBasic),
        joinDate: formData.joiningDate
      });
      toast.success(`Staff member ${fullName} onboarded successfully!`);
    }
    setIsOpenAddModal(false);
    refreshData();
  };

  // Master Data Add Handlers
  const handleAddDept = () => {
    if (!newDeptName.trim()) return;
    const newDept = { id: `dept_${Date.now()}`, name: newDeptName.trim() };
    const updated = [...departments, newDept];
    salaryStorage.saveDepartments(updated);
    setDepartments(updated);
    setFormData(p => ({ ...p, department: newDept.name }));
    setNewDeptName('');
    setShowAddDeptModal(false);
    toast.success('Department created!');
  };

  const handleAddDesg = () => {
    if (!newDesgName.trim()) return;
    const newDesg = { id: `desg_${Date.now()}`, name: newDesgName.trim() };
    const updated = [...designations, newDesg];
    salaryStorage.saveDesignations(updated);
    setDesignations(updated);
    setFormData(p => ({ ...p, designation: newDesg.name }));
    setNewDesgName('');
    setShowAddDesgModal(false);
    toast.success('Designation created!');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="cursor-pointer hover:text-blue-600" onClick={() => onNavigate?.('/salary-hub')}>Salary Hub</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-slate-700">Staff Management</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Staff Management</h1>
          <p className="text-sm text-slate-500">Add, edit, filter, and deactivate profiles inside JD International School, Jaipur.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 bg-white rounded-xl text-xs font-bold shadow-soft transition-all"
          >
            <Download className="w-4 h-4 text-slate-500" /> Export CSV
          </button>
          <button
            onClick={openAddStaff}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-soft hover:shadow transition-all"
          >
            <Plus className="w-4 h-4" /> Add Staff
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Total Staff Roster</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-800">{staffList.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Active: {staffList.filter(s => s.status !== 'Inactive').length} &bull; Teaching: {staffList.filter(s => s.category === 'Teaching').length}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Total Monthly Gross</span>
            <IndianRupee className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-800">
            ₹{staffList.filter(s => s.status !== 'Inactive').reduce((acc, s) => acc + (s.grossSalary || 0), 0).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Approved package commitments</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Average Package</span>
            <Briefcase className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-800">
            ₹{Math.round(staffList.reduce((acc, s) => acc + (s.grossSalary || 0), 0) / (staffList.length || 1)).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Per staff monthly average</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Active Departments</span>
            <Building className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-800">11</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Across all functional faculties</div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search name, ID, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50/50 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {/* Gender Filter */}
        <select
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
          className="border border-slate-200 rounded-xl py-2 px-3 text-xs bg-slate-50/50 text-slate-700 font-medium focus:outline-none"
        >
          <option value="">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border border-slate-200 rounded-xl py-2 px-3 text-xs bg-slate-50/50 text-slate-700 font-medium focus:outline-none"
        >
          <option value="">All Categories</option>
          <option value="Teaching">Teaching</option>
          <option value="Non Teaching">Non Teaching</option>
        </select>

        {/* Employment Type */}
        <select
          value={empTypeFilter}
          onChange={(e) => setEmpTypeFilter(e.target.value)}
          className="border border-slate-200 rounded-xl py-2 px-3 text-xs bg-slate-50/50 text-slate-700 font-medium focus:outline-none"
        >
          <option value="">All Types</option>
          <option value="Permanent">Permanent</option>
          <option value="Temporary">Temporary</option>
          <option value="Full Time">Full Time</option>
          <option value="Part Time">Part Time</option>
        </select>

        {/* Status */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-slate-200 rounded-xl py-2 px-3 text-xs bg-slate-50/50 text-slate-700 font-medium focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Suspended">Suspended</option>
        </select>

        {/* Department */}
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="border border-slate-200 rounded-xl py-2 px-3 text-xs bg-slate-50/50 text-slate-700 font-medium focus:outline-none"
        >
          <option value="">All Departments</option>
          {departments.map((d, idx) => (
            <option key={d.id || idx} value={d.name}>{d.name}</option>
          ))}
        </select>

        {/* Clear Filters */}
        {(search || genderFilter || categoryFilter || deptFilter || empTypeFilter || statusFilter) && (
          <button
            onClick={() => {
              setSearch('');
              setGenderFilter('');
              setCategoryFilter('');
              setDeptFilter('');
              setEmpTypeFilter('');
              setStatusFilter('');
            }}
            className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1 ml-auto"
          >
            <RefreshCcw className="w-3.5 h-3.5" /> Clear Filters
          </button>
        )}
      </div>

      {/* Bulk Action Strip */}
      {selectedIds.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-2xl flex items-center justify-between text-xs text-blue-800 animate-fadeIn shadow-sm">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-blue-600" />
            <span className="font-bold">{selectedIds.length} staff selected</span>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value)}
              className="border border-blue-200 rounded-xl py-1.5 px-3 bg-white text-xs text-slate-700 font-semibold focus:outline-none"
            >
              <option value="">Bulk Action Status...</option>
              <option value="Active">Mark Active</option>
              <option value="Inactive">Mark Inactive</option>
              <option value="Suspended">Mark Suspended</option>
            </select>
            <button
              onClick={handleBulkStatusChange}
              disabled={!bulkStatus}
              className="px-4 py-1.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-soft"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Main Staff Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="p-3.5 pl-4 w-10">
                  <button onClick={handleSelectAll} className="p-1 text-slate-400 hover:text-slate-600">
                    {selectedIds.length === filteredStaff.length && filteredStaff.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="p-3.5">Staff Member</th>
                <th className="p-3.5">Category / Role</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5">Type</th>
                <th className="p-3.5 text-right">Gross Salary</th>
                <th className="p-3.5 text-right">Basic Base</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-center pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-12 text-slate-400">
                    No staff records found matching the active filters.
                  </td>
                </tr>
              ) : (
                filteredStaff.map((staff) => {
                  const isSelected = selectedIds.includes(staff.id);
                  const isInactive = staff.status === 'Inactive';
                  const isSuspended = staff.status === 'Suspended';
                  return (
                    <tr
                      key={staff.id}
                      className={`hover:bg-slate-50/80 transition-colors ${isSelected ? 'bg-blue-50/40' : ''}`}
                    >
                      <td className="p-3.5 pl-4">
                        <button onClick={() => handleSelectRow(staff.id)} className="p-1 text-slate-400 hover:text-slate-600">
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs border border-blue-200 shadow-inner flex-shrink-0">
                            {staff.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 leading-tight">{staff.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium mt-0.5">{staff.code} &bull; {staff.phone || staff.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <p className="font-semibold text-slate-800 text-xs">{staff.category || 'Teaching'}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{staff.designation || 'Staff'}</p>
                      </td>

                      <td className="p-3.5">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[11px] font-semibold border border-slate-200">
                          {staff.department || 'General'}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <span className="text-xs font-semibold text-slate-600">
                          {staff.employmentType || 'Permanent'}
                        </span>
                      </td>

                      <td className="p-3.5 text-right font-extrabold text-slate-800">
                        ₹{(staff.grossSalary || 0).toLocaleString('en-IN')}
                      </td>

                      <td className="p-3.5 text-right font-semibold text-slate-600">
                        ₹{(staff.basicSalary || 0).toLocaleString('en-IN')}
                      </td>

                      <td className="p-3.5">
                        <span
                          className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                            isInactive
                              ? 'bg-slate-100 text-slate-600'
                              : isSuspended
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {staff.status || 'Active'}
                        </span>
                      </td>

                      <td className="p-3.5 pr-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setViewingStaff(staff)}
                            className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
                            title="View Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => startEdit(staff)}
                            className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors"
                            title="Edit Profile"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeactivate(staff)}
                            className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                            title="Deactivate Member"
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

        {/* Table Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>Showing {filteredStaff.length} of {staffList.length} staff records</span>
          <div className="flex items-center gap-4 text-slate-600 font-semibold">
            <span>Teaching: {filteredStaff.filter(s => s.category === 'Teaching').length}</span>
            <span>Non-Teaching: {filteredStaff.filter(s => s.category !== 'Teaching').length}</span>
            <span className="text-emerald-700 font-bold">Total Gross: ₹{filteredStaff.reduce((a, s) => a + (s.grossSalary || 0), 0).toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* --- ADD / EDIT 2-STEP WIZARD MODAL --- */}
      {isOpenAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6 animate-scaleUp">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="text-lg font-extrabold text-slate-800">
                  {isEditing ? 'Edit Staff Profile' : 'Onboard New Staff Member'}
                </h2>
                <p className="text-xs text-slate-500">Configure employment details and statutory salary breakdown.</p>
              </div>
              <button
                onClick={() => setIsOpenAddModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-200 text-slate-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Stepper Indicator */}
            <div className="flex items-center justify-center py-3.5 px-6 border-b border-slate-100 bg-slate-50/30">
              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    step === 1 ? 'bg-blue-600 text-white shadow-soft ring-4 ring-blue-100' : 'bg-emerald-500 text-white'
                  }`}
                >
                  {step > 1 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : '1'}
                </div>
                <div>
                  <p className={`text-xs font-bold leading-tight ${step === 1 ? 'text-slate-800' : 'text-slate-600'}`}>Step 1</p>
                  <p className="text-[10px] text-slate-400">Basic Details</p>
                </div>
              </div>

              <div className={`w-16 h-0.5 mx-4 transition-all duration-300 ${step > 1 ? 'bg-emerald-500' : 'bg-slate-200'}`} />

              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    step === 2 ? 'bg-blue-600 text-white shadow-soft ring-4 ring-blue-100' : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  2
                </div>
                <div>
                  <p className={`text-xs font-bold leading-tight ${step === 2 ? 'text-slate-800' : 'text-slate-400'}`}>Step 2</p>
                  <p className="text-[10px] text-slate-400">Salary & Documents</p>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleWizardSubmit}>
              <div className="p-6 max-h-[62vh] overflow-y-auto space-y-6">
                {step === 1 ? (
                  <div className="space-y-5 animate-fadeIn">
                    {/* Personal Information */}
                    <div>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Personal Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-slate-600 font-semibold mb-1">First Name <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            required
                            value={formData.firstName}
                            onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                            className="w-full h-10 px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            placeholder="First name"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-600 font-semibold mb-1">Last Name <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            required
                            value={formData.lastName}
                            onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                            className="w-full h-10 px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            placeholder="Last name"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-slate-600 font-semibold mb-1">Gender</label>
                          <select
                            value={formData.gender}
                            onChange={e => setFormData({ ...formData, gender: e.target.value })}
                            className="w-full h-10 px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs text-slate-600 font-semibold mb-1">Mobile Number <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            required
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full h-10 px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            placeholder="10-digit mobile"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-slate-600 font-semibold mb-1">Email Address</label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            className="w-full h-10 px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            placeholder="email@example.com"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-slate-600 font-semibold mb-1">PAN Card Number</label>
                          <input
                            type="text"
                            value={formData.pan}
                            onChange={e => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                            className="w-full h-10 px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 uppercase"
                            placeholder="ABCDE1234F"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="h-px bg-slate-100" />

                    {/* Employment Details */}
                    <div>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Employment Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-slate-600 font-semibold mb-1">Date of Joining</label>
                          <input
                            type="date"
                            value={formData.joiningDate}
                            onChange={e => setFormData({ ...formData, joiningDate: e.target.value })}
                            className="w-full h-10 px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-slate-600 font-semibold mb-1">Staff Category</label>
                          <select
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                            className="w-full h-10 px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          >
                            <option value="Teaching">Teaching</option>
                            <option value="Non Teaching">Non Teaching</option>
                          </select>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="block text-xs text-slate-600 font-semibold">Department</label>
                            <button
                              type="button"
                              onClick={() => setShowAddDeptModal(true)}
                              className="text-[10px] text-blue-600 font-bold hover:underline"
                            >
                              + Add New
                            </button>
                          </div>
                          <select
                            value={formData.department}
                            onChange={e => setFormData({ ...formData, department: e.target.value })}
                            className="w-full h-10 px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          >
                            {departments.map((d, i) => (
                              <option key={d.id || i} value={d.name}>{d.name}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="block text-xs text-slate-600 font-semibold">Designation</label>
                            <button
                              type="button"
                              onClick={() => setShowAddDesgModal(true)}
                              className="text-[10px] text-blue-600 font-bold hover:underline"
                            >
                              + Add New
                            </button>
                          </div>
                          <select
                            value={formData.designation}
                            onChange={e => setFormData({ ...formData, designation: e.target.value })}
                            className="w-full h-10 px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          >
                            {designations.map((d, i) => (
                              <option key={d.id || i} value={d.name}>{d.name}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs text-slate-600 font-semibold mb-1">Employment Type</label>
                          <select
                            value={formData.employmentType}
                            onChange={e => setFormData({ ...formData, employmentType: e.target.value })}
                            className="w-full h-10 px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          >
                            <option value="Permanent">Permanent</option>
                            <option value="Temporary">Temporary</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs text-slate-600 font-semibold mb-1">Work Type</label>
                          <select
                            value={formData.workType}
                            onChange={e => setFormData({ ...formData, workType: e.target.value })}
                            className="w-full h-10 px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          >
                            <option value="Full Time">Full Time</option>
                            <option value="Part Time">Part Time</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 animate-fadeIn">
                    {/* Gross Salary Header */}
                    <div>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Salary Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs text-slate-600 font-semibold mb-1">Monthly Gross Salary (₹) <span className="text-red-500">*</span></label>
                          <input
                            type="number"
                            min="1000"
                            required
                            value={formData.monthlyGross}
                            onChange={e => handleGrossChange(e.target.value)}
                            className="w-full h-10 px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-slate-400 font-semibold mb-1">Annual CTC (₹) (Read Only)</label>
                          <div className="relative">
                            <input
                              type="text"
                              readOnly
                              value={`₹${(Number(formData.monthlyGross) * 12).toLocaleString('en-IN')}`}
                              className="w-full h-10 pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 text-slate-500 font-bold cursor-not-allowed"
                            />
                            <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs text-slate-600 font-semibold mb-1">Effective Date</label>
                          <input
                            type="date"
                            value={formData.salaryStartDate}
                            onChange={e => setFormData({ ...formData, salaryStartDate: e.target.value })}
                            className="w-full h-10 px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="h-px bg-slate-100" />

                    {/* Breakdown */}
                    <div>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Salary Structure (Breakdown)</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                        {/* Earnings */}
                        <div className="space-y-3">
                          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-1 text-emerald-700">Earnings Components</h4>
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                              <label className="block text-[10px] text-slate-500 font-bold mb-0.5">Basic Base</label>
                              <input
                                type="number"
                                value={formData.salaryBasic}
                                onChange={e => setFormData({ ...formData, salaryBasic: Number(e.target.value) })}
                                className="w-full h-9 px-2.5 py-1 border border-slate-200 rounded-lg text-xs font-semibold"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-slate-500 font-bold mb-0.5">HRA (40%)</label>
                              <input
                                type="number"
                                value={formData.salaryHra}
                                onChange={e => setFormData({ ...formData, salaryHra: Number(e.target.value) })}
                                className="w-full h-9 px-2.5 py-1 border border-slate-200 rounded-lg text-xs font-semibold"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-slate-500 font-bold mb-0.5">Special Allowance</label>
                              <input
                                type="number"
                                value={formData.salarySpecialAllowance}
                                onChange={e => setFormData({ ...formData, salarySpecialAllowance: Number(e.target.value) })}
                                className="w-full h-9 px-2.5 py-1 border border-slate-200 rounded-lg text-xs font-semibold"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-slate-500 font-bold mb-0.5">Transport Allowance</label>
                              <input
                                type="number"
                                value={formData.salaryTransport}
                                onChange={e => setFormData({ ...formData, salaryTransport: Number(e.target.value) })}
                                className="w-full h-9 px-2.5 py-1 border border-slate-200 rounded-lg text-xs font-semibold"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-slate-500 font-bold mb-0.5">Medical Allowance</label>
                              <input
                                type="number"
                                value={formData.salaryMedical}
                                onChange={e => setFormData({ ...formData, salaryMedical: Number(e.target.value) })}
                                className="w-full h-9 px-2.5 py-1 border border-slate-200 rounded-lg text-xs font-semibold"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-slate-500 font-bold mb-0.5">Other Allowance</label>
                              <input
                                type="number"
                                value={formData.salaryOtherAllowance}
                                onChange={e => setFormData({ ...formData, salaryOtherAllowance: Number(e.target.value) })}
                                className="w-full h-9 px-2.5 py-1 border border-slate-200 rounded-lg text-xs font-semibold"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Deductions */}
                        <div className="space-y-3">
                          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-1 text-red-600">Statutory Deductions</h4>
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                              <label className="block text-[10px] text-slate-500 font-bold mb-0.5">PF Deduction (12%)</label>
                              <input
                                type="number"
                                value={formData.salaryPf}
                                onChange={e => setFormData({ ...formData, salaryPf: Number(e.target.value) })}
                                className="w-full h-9 px-2.5 py-1 border border-slate-200 rounded-lg text-xs text-red-700 font-semibold"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-slate-500 font-bold mb-0.5">ESI Deduction</label>
                              <input
                                type="number"
                                value={formData.salaryEsi}
                                onChange={e => setFormData({ ...formData, salaryEsi: Number(e.target.value) })}
                                className="w-full h-9 px-2.5 py-1 border border-slate-200 rounded-lg text-xs text-red-700 font-semibold"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-slate-500 font-bold mb-0.5">Professional Tax</label>
                              <input
                                type="number"
                                value={formData.salaryProfessionalTax}
                                onChange={e => setFormData({ ...formData, salaryProfessionalTax: Number(e.target.value) })}
                                className="w-full h-9 px-2.5 py-1 border border-slate-200 rounded-lg text-xs text-red-700 font-semibold"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="h-px bg-slate-100" />

                    {/* Bank Details */}
                    <div>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Bank Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-slate-600 font-semibold mb-1">Bank Name</label>
                          <input
                            type="text"
                            value={formData.bankName}
                            onChange={e => setFormData({ ...formData, bankName: e.target.value })}
                            className="w-full h-10 px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-800"
                            placeholder="e.g. State Bank of India"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-slate-600 font-semibold mb-1">Account Number</label>
                          <input
                            type="text"
                            value={formData.bankAccountNumber}
                            onChange={e => setFormData({ ...formData, bankAccountNumber: e.target.value })}
                            className="w-full h-10 px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-800"
                            placeholder="Account number"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-slate-600 font-semibold mb-1">IFSC Code</label>
                          <input
                            type="text"
                            value={formData.bankIfscCode}
                            onChange={e => setFormData({ ...formData, bankIfscCode: e.target.value.toUpperCase() })}
                            className="w-full h-10 px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-800 uppercase"
                            placeholder="SBIN0001234"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-slate-600 font-semibold mb-1">Branch Name</label>
                          <input
                            type="text"
                            value={formData.bankBranchName}
                            onChange={e => setFormData({ ...formData, bankBranchName: e.target.value })}
                            className="w-full h-10 px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-800"
                            placeholder="Branch location"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Wizard Footer Controls */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
                {step === 1 ? (
                  <div></div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 transition"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous Step
                  </button>
                )}

                {step === 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-soft transition"
                  >
                    Next: Salary & Bank <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-soft transition"
                  >
                    <Check className="w-4 h-4" /> {isEditing ? 'Save Staff Changes' : 'Complete Onboarding'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- VIEW STAFF PROFILE MODAL --- */}
      {viewingStaff && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-scaleUp">
            <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center font-black text-xl border border-white/30">
                  {viewingStaff.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-black">{viewingStaff.name}</h3>
                  <p className="text-xs text-blue-100 mt-0.5">{viewingStaff.designation} &bull; {viewingStaff.department}</p>
                  <p className="text-[10px] text-blue-200 mt-0.5">Emp ID: {viewingStaff.code} &bull; Status: {viewingStaff.status || 'Active'}</p>
                </div>
              </div>
              <button
                onClick={() => setViewingStaff(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-slate-400 font-semibold">Phone:</span>
                  <p className="font-bold text-slate-800 mt-0.5">{viewingStaff.phone || '—'}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold">Email:</span>
                  <p className="font-bold text-slate-800 mt-0.5">{viewingStaff.email || '—'}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold">Category:</span>
                  <p className="font-bold text-slate-800 mt-0.5">{viewingStaff.category || 'Teaching'}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold">Employment:</span>
                  <p className="font-bold text-slate-800 mt-0.5">{viewingStaff.employmentType || 'Permanent'}</p>
                </div>
              </div>

              {/* Salary Snapshot */}
              <div className="bg-emerald-50/60 border border-emerald-200 p-4 rounded-2xl flex justify-between items-center">
                <div>
                  <span className="text-[10px] uppercase font-extrabold text-emerald-800">Monthly Gross Salary</span>
                  <p className="text-xl font-extrabold text-emerald-900 mt-0.5">₹{(viewingStaff.grossSalary || 0).toLocaleString('en-IN')}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Basic Component</span>
                  <p className="text-sm font-bold text-slate-700 mt-0.5">₹{(viewingStaff.basicSalary || 0).toLocaleString('en-IN')}</p>
                </div>
              </div>

              {/* Bank Details */}
              <div className="border border-slate-200 p-4 rounded-2xl space-y-2">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Disbursement Account</span>
                <div className="grid grid-cols-2 gap-2 text-slate-700 font-medium">
                  <div>Bank: <span className="font-bold text-slate-900">{viewingStaff.bankName || 'State Bank of India'}</span></div>
                  <div>Account: <span className="font-bold text-slate-900">{viewingStaff.accNo || '—'}</span></div>
                  <div>IFSC: <span className="font-bold text-slate-900">{viewingStaff.ifsc || 'SBIN0001234'}</span></div>
                  <div>PAN: <span className="font-bold text-slate-900">{viewingStaff.pan || 'ABCDE1234F'}</span></div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => {
                  const s = viewingStaff;
                  setViewingStaff(null);
                  startEdit(s);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-soft"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inline Add Department Modal */}
      {showAddDeptModal && (
        <div className="fixed inset-0 z-60 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 border border-slate-200 shadow-xl">
            <h3 className="text-sm font-bold text-slate-800">Add New Department</h3>
            <input
              type="text"
              autoFocus
              value={newDeptName}
              onChange={e => setNewDeptName(e.target.value)}
              placeholder="e.g. Computer Science"
              className="w-full px-3 py-2 border rounded-xl text-xs"
            />
            <div className="flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setShowAddDeptModal(false)}
                className="px-3 py-1.5 border rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddDept}
                className="px-4 py-1.5 bg-blue-600 text-white font-bold rounded-lg"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inline Add Designation Modal */}
      {showAddDesgModal && (
        <div className="fixed inset-0 z-60 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 border border-slate-200 shadow-xl">
            <h3 className="text-sm font-bold text-slate-800">Add New Designation</h3>
            <input
              type="text"
              autoFocus
              value={newDesgName}
              onChange={e => setNewDesgName(e.target.value)}
              placeholder="e.g. Senior PGT Teacher"
              className="w-full px-3 py-2 border rounded-xl text-xs"
            />
            <div className="flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setShowAddDesgModal(false)}
                className="px-3 py-1.5 border rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddDesg}
                className="px-4 py-1.5 bg-blue-600 text-white font-bold rounded-lg"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default SalaryStructurePage;
