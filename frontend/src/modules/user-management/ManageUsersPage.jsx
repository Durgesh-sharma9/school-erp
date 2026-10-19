import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Users,
  Search,
  Home,
  Plus,
  Edit2,
  Trash2,
  UserPlus,
  Bus,
  Briefcase,
  GraduationCap,
  Shield,
  Phone,
  Mail,
  Download,
  X,
  CheckCircle2,
  XCircle,
  Filter,
  Camera,
  Upload,
  CreditCard,
  FileText,
  User,
  Building2,
  IndianRupee,
  Calendar,
  Award,
  Check,
  ChevronRight,
  ChevronLeft,
  FileCheck,
  File,
  Eye,
  AlertCircle,
  ShieldCheck,
  Loader2,
  RotateCcw
} from 'lucide-react';
import toast from 'react-hot-toast';

const ROLES = [
  { id: 'Teacher', label: 'Teacher', icon: GraduationCap, color: 'emerald', defaultDept: 'Academics', defaultDesignation: 'Subject Teacher' },
  { id: 'Staff', label: 'Office Staff', icon: Briefcase, color: 'blue', defaultDept: 'Accounts & Finance', defaultDesignation: 'Office Staff' },
  { id: 'Driver', label: 'Driver', icon: Bus, color: 'amber', defaultDept: 'Transport & Fleet', defaultDesignation: 'School Bus Driver' },
  { id: 'Admin', label: 'Admin', icon: Shield, color: 'purple', defaultDept: 'Administration', defaultDesignation: 'Principal' }
];

const COMMON_DEPARTMENTS = [
  'Academics',
  'Accounts & Finance',
  'Administration',
  'Transport & Fleet',
  'Library',
  'Front Office',
  'Sports'
];

const POPULAR_BANKS = [
  'State Bank of India',
  'HDFC Bank',
  'ICICI Bank',
  'Punjab National Bank',
  'Bank of Baroda',
  'Axis Bank',
  'Canara Bank',
  'Union Bank of India',
  'Kotak Mahindra Bank',
  'Central Bank of India'
];

const DESIGNATION_PRESETS = {
  Teacher: ['PGT Teacher', 'TGT Teacher', 'PRT Teacher', 'Pre-Primary Teacher', 'Subject Teacher', 'Sports Coach', 'Art Teacher'],
  Staff: ['Senior Accountant', 'Junior Accountant', 'Chief Librarian', 'Assistant Librarian', 'Receptionist', 'Office Assistant', 'Clerk'],
  Driver: ['School Bus Driver', 'Van Driver', 'Senior Driver', 'Transport Incharge'],
  Admin: ['Principal', 'Vice Principal', 'School Administrator', 'Academic Director']
};

const getRoleDefaultAvatar = (role) => {
  switch (role) {
    case 'Driver':
      return 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop';
    case 'Teacher':
      return 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop';
    case 'Admin':
      return 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop';
    default:
      return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop';
  }
};

export function ManageUsersPage({ onNavigate, currentPath = '' }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleTab, setRoleTab] = useState(
    currentPath.includes('driver')
      ? 'Driver'
      : currentPath.includes('staff')
      ? 'Staff'
      : currentPath.includes('privilege')
      ? 'PRIVILEGE'
      : 'ALL'
  );
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'INACTIVE'
  const [selectedIds, setSelectedIds] = useState([]);

  // Role Privileges Matrix State & Persistence
  const [privileges, setPrivileges] = useState(() => {
    try {
      const cached = localStorage.getItem('school_erp_privileges');
      if (cached) return JSON.parse(cached);
    } catch {}
    return [
      { id: 'dashboard', name: 'Dashboard & School Analytics', admin: true, teacher: true, staff: true, driver: false },
      { id: 'students', name: 'Student Admissions & Information', admin: true, teacher: true, staff: true, driver: false },
      { id: 'attendance', name: 'Daily Attendance Marking & Reports', admin: true, teacher: true, staff: true, driver: false },
      { id: 'examination', name: 'Exams, Marks Entry & Report Cards', admin: true, teacher: true, staff: false, driver: false },
      { id: 'fee', name: 'Fee Collection, Receipts & Dues', admin: true, teacher: false, staff: true, driver: false },
      { id: 'transport', name: 'Transport Fleet, Buses & Routes', admin: true, teacher: false, staff: true, driver: true },
      { id: 'hostel', name: 'Hostel Rooms & Boarding Records', admin: true, teacher: false, staff: true, driver: false },
      { id: 'payroll', name: 'Staff Management & Payroll Records', admin: true, teacher: false, staff: true, driver: false },
      { id: 'library', name: 'Library Catalog & Books Issuance', admin: true, teacher: true, staff: true, driver: false },
      { id: 'front-office', name: 'Front Desk Visitors & Gate Passes', admin: true, teacher: false, staff: true, driver: false },
      { id: 'stationary', name: 'School Shop & Stationary Sets', admin: true, teacher: false, staff: true, driver: false },
      { id: 'sms', name: 'SMS & WhatsApp Notifications', admin: true, teacher: true, staff: true, driver: false },
      { id: 'users', name: 'User Access Control & Security', admin: true, teacher: false, staff: false, driver: false }
    ];
  });
  const [privilegeSearch, setPrivilegeSearch] = useState('');
  const [savingPrivileges, setSavingPrivileges] = useState(false);

  // Modal State & Tabs
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeModalTab, setActiveModalTab] = useState('profile'); // 'profile' | 'accounts' | 'documents'
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    empCode: '',
    pic: '',
    role: 'Teacher',
    designation: 'Subject Teacher',
    department: 'Academics',
    phone: '',
    email: '',
    isActive: true,
    gender: 'Female',
    joiningDate: new Date().toISOString().slice(0, 10),
    teachingSubject: '',
    assignedClass: '',
    driverLicense: '',
    workArea: '',
    // Accounts & Salary
    basicSalary: 35000,
    bankName: 'State Bank of India',
    accountNo: '',
    ifscCode: '',
    accountHolder: '',
    panNo: '',
    uanNo: '',
    // Documents & KYC
    aadhaarNo: '',
    qualification: '',
    documents: {
      aadhaar: null,
      pan: null,
      qualificationDoc: null,
      driverLicenseDoc: null,
      resumeDoc: null
    }
  });

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be under 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({ ...prev, pic: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleDocumentUpload = (docKey, file) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be under 10MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [docKey]: {
            name: file.name,
            size: (file.size / 1024).toFixed(1) + ' KB',
            type: file.type,
            data: reader.result,
            uploadedAt: 'Attached'
          }
        }
      }));
      toast.success(`${file.name} attached`);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveDocument = (docKey) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docKey]: null
      }
    }));
    toast.success('Document removed');
  };

  // Fetch Users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/user-management/users');
      const d = await res.json();
      if (d.success) setUsers(d.data);
    } catch {
      toast.error('Failed to load staff list');
    } finally {
      setLoading(false);
    }
  };

  // Fetch Privileges from backend
  const fetchPrivileges = async () => {
    try {
      const res = await fetch('/api/user-management/privileges');
      const d = await res.json();
      if (d.success && Array.isArray(d.data) && d.data.length > 0) {
        setPrivileges(d.data);
        try { localStorage.setItem('school_erp_privileges', JSON.stringify(d.data)); } catch {}
      }
    } catch {}
  };

  // Save Privileges
  const handleSavePrivileges = async () => {
    setSavingPrivileges(true);
    try {
      try { localStorage.setItem('school_erp_privileges', JSON.stringify(privileges)); } catch {}
      const res = await fetch('/api/user-management/privileges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ privileges })
      });
      const d = await res.json();
      if (d.success) {
        toast.success(d.message || 'Privileges saved successfully');
      } else {
        toast.success('Privileges saved locally');
      }
    } catch {
      toast.success('Privileges saved in local storage');
    } finally {
      setSavingPrivileges(false);
    }
  };

  // Bulk Toggle Privileges for a Role
  const handleToggleAllForRole = (roleKey, value) => {
    setPrivileges(prev =>
      prev.map(item => ({
        ...item,
        [roleKey]: value
      }))
    );
    toast.success(`All modules ${value ? 'Allowed' : 'Disabled'} for ${roleKey.toUpperCase()}`);
  };

  // Reset Privileges to Recommended System Defaults
  const handleResetPrivileges = () => {
    const defaults = [
      { id: 'dashboard', name: 'Dashboard & School Analytics', admin: true, teacher: true, staff: true, driver: false },
      { id: 'students', name: 'Student Admissions & Information', admin: true, teacher: true, staff: true, driver: false },
      { id: 'attendance', name: 'Daily Attendance Marking & Reports', admin: true, teacher: true, staff: true, driver: false },
      { id: 'examination', name: 'Exams, Marks Entry & Report Cards', admin: true, teacher: true, staff: false, driver: false },
      { id: 'fee', name: 'Fee Collection, Receipts & Dues', admin: true, teacher: false, staff: true, driver: false },
      { id: 'transport', name: 'Transport Fleet, Buses & Routes', admin: true, teacher: false, staff: true, driver: true },
      { id: 'hostel', name: 'Hostel Rooms & Boarding Records', admin: true, teacher: false, staff: true, driver: false },
      { id: 'payroll', name: 'Staff Management & Payroll Records', admin: true, teacher: false, staff: true, driver: false },
      { id: 'library', name: 'Library Catalog & Books Issuance', admin: true, teacher: true, staff: true, driver: false },
      { id: 'front-office', name: 'Front Desk Visitors & Gate Passes', admin: true, teacher: false, staff: true, driver: false },
      { id: 'stationary', name: 'School Shop & Stationary Sets', admin: true, teacher: false, staff: true, driver: false },
      { id: 'sms', name: 'SMS & WhatsApp Notifications', admin: true, teacher: true, staff: true, driver: false },
      { id: 'users', name: 'User Access Control & Security', admin: true, teacher: false, staff: false, driver: false }
    ];
    setPrivileges(defaults);
    toast.success('Privilege permissions reset to standard defaults');
  };

  useEffect(() => {
    fetchUsers();
    fetchPrivileges();
  }, []);

  useEffect(() => {
    if (currentPath.includes('driver')) setRoleTab('Driver');
    else if (currentPath.includes('staff')) setRoleTab('Staff');
    else if (currentPath.includes('privilege')) setRoleTab('PRIVILEGE');
    else setRoleTab('ALL');
  }, [currentPath]);

  // Open Add Modal
  const handleOpenAdd = (presetRole = 'Teacher') => {
    setEditingId(null);
    setActiveModalTab('profile');
    const matchedRole = ROLES.find(r => r.id === presetRole) || ROLES[0];
    const defaultSalary = presetRole === 'Driver' ? 22000 : presetRole === 'Teacher' ? 35000 : 40000;
    setFormData({
      name: '',
      empCode: '',
      pic: '',
      role: presetRole,
      designation: matchedRole.defaultDesignation,
      department: matchedRole.defaultDept,
      phone: '',
      email: '',
      isActive: true,
      gender: presetRole === 'Driver' ? 'Male' : 'Female',
      joiningDate: new Date().toISOString().slice(0, 10),
      teachingSubject: '',
      assignedClass: '',
      driverLicense: '',
      workArea: '',
      basicSalary: defaultSalary,
      bankName: 'State Bank of India',
      accountNo: '',
      ifscCode: '',
      accountHolder: '',
      panNo: '',
      uanNo: '',
      aadhaarNo: '',
      qualification: presetRole === 'Teacher' ? 'M.Sc, B.Ed' : presetRole === 'Driver' ? '10th Pass (Commercial DL)' : 'Graduate',
      documents: {
        aadhaar: null,
        pan: null,
        qualificationDoc: null,
        driverLicenseDoc: null,
        resumeDoc: null
      }
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (user) => {
    setEditingId(user.id);
    setActiveModalTab('profile');
    const resolvedRole = user.role === 'Accountant' ? 'Staff' : (user.role || 'Teacher');
    setFormData({
      name: user.displayName || user.name.replace(/^\[.*?\]\s*/, ''),
      empCode: user.empCode || '',
      pic: user.pic || '',
      role: resolvedRole,
      designation: user.designation || '',
      department: user.department || 'Academics',
      phone: user.phone || '',
      email: user.email || '',
      isActive: user.isActive !== undefined ? user.isActive : true,
      gender: user.gender || (resolvedRole === 'Driver' ? 'Male' : 'Female'),
      joiningDate: user.joiningDate || '2024-07-01',
      teachingSubject: (user.subjects && user.subjects.length > 0) ? user.subjects.join(', ') : '',
      assignedClass: (user.classes && user.classes.length > 0) ? user.classes.join(', ') : '',
      driverLicense: user.driverLicense || '',
      workArea: (user.modules && user.modules.length > 0) ? user.modules.join(', ') : '',
      basicSalary: user.basicSalary || (resolvedRole === 'Driver' ? 22000 : resolvedRole === 'Teacher' ? 35000 : 42000),
      bankName: user.bankName || 'State Bank of India',
      accountNo: user.accountNo || '',
      ifscCode: user.ifscCode || '',
      accountHolder: user.accountHolder || (user.displayName || user.name.replace(/^\[.*?\]\s*/, '')),
      panNo: user.panNo || '',
      uanNo: user.uanNo || '',
      aadhaarNo: user.aadhaarNo || '',
      qualification: user.qualification || '',
      documents: user.documents && typeof user.documents === 'object' && !Array.isArray(user.documents)
        ? user.documents
        : {
            aadhaar: user.aadhaarNo ? { name: 'Aadhaar_Document.pdf', size: '240 KB', uploadedAt: 'Verified' } : null,
            pan: user.panNo ? { name: 'PAN_Card.pdf', size: '180 KB', uploadedAt: 'Verified' } : null,
            qualificationDoc: null,
            driverLicenseDoc: user.driverLicense ? { name: 'Driving_License.pdf', size: '310 KB', uploadedAt: 'Verified' } : null,
            resumeDoc: null
          }
    });
    setIsModalOpen(true);
  };

  // Submit Add / Edit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Please enter name');
      return;
    }
    if (!formData.phone.trim()) {
      toast.error('Please enter phone number');
      return;
    }

    const payload = {
      displayName: formData.name.trim(),
      staffName: formData.name.trim(),
      name: formData.name.trim(),
      empCode: formData.empCode.trim(),
      pic: formData.pic.trim() || getRoleDefaultAvatar(formData.role),
      role: formData.role,
      designation: formData.designation.trim() || (formData.role === 'Driver' ? 'School Bus Driver' : formData.role === 'Teacher' ? 'Subject Teacher' : 'Office Staff'),
      department: formData.department,
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      isActive: formData.isActive,
      gender: formData.gender,
      joiningDate: formData.joiningDate,
      driverLicense: formData.role === 'Driver' ? formData.driverLicense.trim() : '',
      classes: formData.role === 'Teacher' && formData.assignedClass ? formData.assignedClass.split(',').map(s => s.trim()).filter(Boolean) : [],
      subjects: formData.role === 'Teacher' && formData.teachingSubject ? formData.teachingSubject.split(',').map(s => s.trim()).filter(Boolean) : [],
      modules: formData.role === 'Driver' ? ['Transport'] : formData.role === 'Teacher' ? ['Student', 'Attendance', 'Academics'] : ['Fee', 'Payroll', 'Front Office'],
      // Accounts & Payroll
      basicSalary: Number(formData.basicSalary) || 0,
      bankName: formData.bankName,
      accountNo: formData.accountNo.trim(),
      ifscCode: formData.ifscCode.trim().toUpperCase(),
      accountHolder: formData.accountHolder.trim() || formData.name.trim(),
      panNo: formData.panNo.trim().toUpperCase(),
      uanNo: formData.uanNo.trim(),
      // Documents & KYC
      aadhaarNo: formData.aadhaarNo.trim(),
      qualification: formData.qualification.trim(),
      documents: formData.documents
    };

    try {
      if (editingId) {
        const res = await fetch(`/api/user-management/users/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const d = await res.json();
        if (d.success) {
          toast.success('Staff details updated');
          setIsModalOpen(false);
          fetchUsers();
        } else {
          toast.error(d.message || 'Update failed');
        }
      } else {
        const res = await fetch('/api/user-management/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const d = await res.json();
        if (d.success) {
          toast.success('Staff member added');
          setIsModalOpen(false);
          fetchUsers();
        } else {
          toast.error(d.message || 'Creation failed');
        }
      }
    } catch {
      toast.error('Network error');
    }
  };

  // Toggle Status
  const handleToggleStatus = async (user) => {
    try {
      const res = await fetch(`/api/user-management/users/${user.id}/status`, { method: 'PUT' });
      const d = await res.json();
      if (d.success) {
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isActive: !u.isActive } : u));
        toast.success(`${user.displayName || user.name} is now ${!user.isActive ? 'Active' : 'Inactive'}`);
      }
    } catch {
      toast.error('Failed to change status');
    }
  };

  // Delete User
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name || 'this staff member'}?`)) return;
    try {
      const res = await fetch(`/api/user-management/users/${id}`, { method: 'DELETE' });
      const d = await res.json();
      if (d.success) {
        toast.success('Staff member removed');
        setSelectedIds(prev => prev.filter(i => i !== id));
        fetchUsers();
      }
    } catch {
      toast.error('Failed to delete');
    }
  };

  // Bulk Actions
  const handleBulkAction = async (action) => {
    if (selectedIds.length === 0) return;
    if (action === 'delete' && !window.confirm(`Delete ${selectedIds.length} staff members?`)) return;

    try {
      const res = await fetch('/api/user-management/users/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, userIds: selectedIds })
      });
      const d = await res.json();
      if (d.success) {
        toast.success(d.message);
        if (action === 'delete') setSelectedIds([]);
        fetchUsers();
      }
    } catch {
      toast.error('Bulk action failed');
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (users.length === 0) return;
    const headers = ['Emp Code', 'Name', 'Role', 'Designation', 'Department', 'Phone', 'Email', 'Basic Salary (INR)', 'Bank Name', 'Account No', 'IFSC Code', 'PAN No', 'Aadhaar No', 'Status', 'Details'];
    const rows = filteredUsers.map(u => [
      `"${u.empCode || ''}"`,
      `"${u.displayName || u.name || ''}"`,
      `"${u.role || ''}"`,
      `"${u.designation || ''}"`,
      `"${u.department || ''}"`,
      `"${u.phone || ''}"`,
      `"${u.email || ''}"`,
      `"${u.basicSalary || ''}"`,
      `"${u.bankName || ''}"`,
      `"${u.accountNo || ''}"`,
      `"${u.ifscCode || ''}"`,
      `"${u.panNo || ''}"`,
      `"${u.aadhaarNo || ''}"`,
      `"${u.isActive ? 'Active' : 'Inactive'}"`,
      `"${u.role === 'Driver' ? (u.driverLicense ? `Lic: ${u.driverLicense}` : 'Driver') : (u.subjects || []).join(' / ')}"`
    ]);
    const csv = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csv);
    link.download = `Staff_Directory_Payroll_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Downloaded complete staff payroll CSV');
  };

  // Filtered List
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      // Role Filter
      if (roleTab === 'Teacher' && u.role !== 'Teacher' && u.category !== 'Teaching') return false;
      if (roleTab === 'Staff' && u.role !== 'Staff' && u.role !== 'Accountant' && u.role !== 'Office Staff' && u.category !== 'Non-Teaching') return false;
      if (roleTab === 'Driver' && u.role !== 'Driver' && u.category !== 'Transport') return false;
      if (roleTab === 'Admin' && u.role !== 'Admin' && u.category !== 'Management') return false;

      // Status Filter
      if (statusFilter === 'ACTIVE' && !u.isActive) return false;
      if (statusFilter === 'INACTIVE' && u.isActive) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const str = `${u.name || ''} ${u.displayName || ''} ${u.empCode || ''} ${u.phone || ''} ${u.email || ''} ${u.role || ''} ${u.designation || ''} ${u.department || ''} ${u.driverLicense || ''} ${u.vehicleAssigned || ''} ${u.bankName || ''} ${u.accountNo || ''} ${u.panNo || ''} ${u.aadhaarNo || ''}`.toLowerCase();
        if (!str.includes(q)) return false;
      }
      return true;
    });
  }, [users, roleTab, statusFilter, searchQuery]);

  // Master Checkbox
  const allSelected = filteredUsers.length > 0 && filteredUsers.every(u => selectedIds.includes(u.id));
  const toggleSelectAll = () => {
    if (allSelected) {
      const fIds = new Set(filteredUsers.map(u => u.id));
      setSelectedIds(prev => prev.filter(id => !fIds.has(id)));
    } else {
      setSelectedIds(Array.from(new Set([...selectedIds, ...filteredUsers.map(u => u.id)])));
    }
  };

  // Counts
  const totalCount = users.length;
  const teachersCount = users.filter(u => u.role === 'Teacher' || u.category === 'Teaching').length;
  const staffCount = users.filter(u => u.role === 'Staff' || u.role === 'Accountant' || u.role === 'Office Staff' || u.category === 'Non-Teaching').length;
  const driversCount = users.filter(u => u.role === 'Driver' || u.category === 'Transport').length;
  const adminCount = users.filter(u => u.role === 'Admin' || u.category === 'Management').length;

  return (
    <div className="p-4 sm:p-6 bg-slate-50 min-h-screen text-slate-800 space-y-4 max-w-7xl mx-auto">
      {/* 1. Header with Breadcrumb & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900">Staff Management</h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {totalCount} Total
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Add and manage teachers, office staff, drivers, and administrators
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleOpenAdd(roleTab !== 'ALL' && roleTab !== 'PRIVILEGE' ? roleTab : 'Teacher')}
            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" /> + Add Staff
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" /> Export CSV
          </button>
        </div>
      </div>

      {/* 2. Modern Navigation Tabs & Toolbar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-3.5">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { id: 'ALL', label: 'All Staff', count: totalCount, icon: Users },
              { id: 'Teacher', label: 'Teachers', count: teachersCount, icon: GraduationCap },
              { id: 'Staff', label: 'Office Staff', count: staffCount, icon: Briefcase },
              { id: 'Driver', label: 'Drivers', count: driversCount, icon: Bus },
              { id: 'Admin', label: 'Admins', count: adminCount, icon: Shield },
              { id: 'PRIVILEGE', label: 'User Privileges', count: null, icon: ShieldCheck }
            ].map(tab => {
              const Icon = tab.icon;
              const isSelected = roleTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setRoleTab(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 border border-slate-200/90 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                  {tab.count !== null && (
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Status Filter (When in staff list views) */}
          {roleTab !== 'PRIVILEGE' && (
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="text-xs font-semibold px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active Only</option>
                <option value="INACTIVE">Inactive Only</option>
              </select>
            </div>
          )}
        </div>

        {/* Search Input (When in staff list views) */}
        {roleTab !== 'PRIVILEGE' && (
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by name, phone, department, bank account, Aadhaar, license..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full text-xs sm:text-sm pl-10 pr-9 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-slate-50/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Bulk Action Bar (When selected) */}
        {roleTab !== 'PRIVILEGE' && selectedIds.length > 0 && (
          <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-between text-xs">
            <span className="font-semibold text-indigo-900">
              {selectedIds.length} staff selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkAction('activate')}
                className="px-2.5 py-1 bg-white text-emerald-700 border border-emerald-300 font-semibold rounded-lg text-xs hover:bg-emerald-50"
              >
                Mark Active
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                className="px-2.5 py-1 bg-white text-amber-700 border border-amber-300 font-semibold rounded-lg text-xs hover:bg-amber-50"
              >
                Mark Inactive
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-2.5 py-1 bg-white text-rose-700 border border-rose-300 font-semibold rounded-lg text-xs hover:bg-rose-50"
              >
                Delete Selected
              </button>
              <button
                onClick={() => setSelectedIds([])}
                className="text-slate-500 underline ml-2 hover:text-slate-800"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Main Content: User Privileges Matrix OR Staff List Table */}
      {roleTab === 'PRIVILEGE' ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                Role-Based Access Control (RBAC) Matrix
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                School ERP modules aur features ki access permissions configure aur live save karein
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleResetPrivileges}
                className="px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1"
                title="Reset permissions to standard defaults"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Defaults
              </button>
              <button
                type="button"
                disabled={savingPrivileges}
                onClick={handleSavePrivileges}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
              >
                {savingPrivileges ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" /> Save Privileges
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Toolbar for Privileges: Search & Fast Column Toggles */}
          <div className="p-3 sm:px-5 bg-white border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search modules (e.g. Student, Fee, Transport)..."
                value={privilegeSearch}
                onChange={e => setPrivilegeSearch(e.target.value)}
                className="w-full text-xs pl-9 pr-8 py-2 border border-slate-200 rounded-xl bg-slate-50/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              {privilegeSearch && (
                <button
                  type="button"
                  onClick={() => setPrivilegeSearch('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Multi-column Toggles */}
            <div className="flex items-center gap-1.5 text-xs flex-wrap">
              <span className="text-slate-400 text-[11px] font-semibold mr-1">Quick Sets:</span>
              <button
                type="button"
                onClick={() => handleToggleAllForRole('teacher', true)}
                className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-[11px] font-semibold transition-colors"
              >
                + Allow All Teachers
              </button>
              <button
                type="button"
                onClick={() => handleToggleAllForRole('staff', true)}
                className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg text-[11px] font-semibold transition-colors"
              >
                + Allow All Staff
              </button>
              <button
                type="button"
                onClick={() => handleToggleAllForRole('driver', false)}
                className="px-2.5 py-1 bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200 rounded-lg text-[11px] font-semibold transition-colors"
              >
                Restrict Drivers
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px] tracking-wider">
                  <th className="py-3.5 px-4 w-12 text-center">#</th>
                  <th className="py-3.5 px-4">MODULE / FEATURE</th>
                  <th className="py-3.5 px-4 text-center">
                    <div>ADMINISTRATOR</div>
                    <span className="text-[9px] text-purple-600 font-medium normal-case">full access</span>
                  </th>
                  <th className="py-3.5 px-4 text-center">
                    <div>TEACHERS</div>
                    <button
                      type="button"
                      onClick={() => {
                        const allActive = privileges.every(p => p.teacher);
                        handleToggleAllForRole('teacher', !allActive);
                      }}
                      className="text-[9px] text-indigo-600 hover:underline font-semibold normal-case"
                    >
                      toggle all
                    </button>
                  </th>
                  <th className="py-3.5 px-4 text-center">
                    <div>OFFICE STAFF</div>
                    <button
                      type="button"
                      onClick={() => {
                        const allActive = privileges.every(p => p.staff);
                        handleToggleAllForRole('staff', !allActive);
                      }}
                      className="text-[9px] text-indigo-600 hover:underline font-semibold normal-case"
                    >
                      toggle all
                    </button>
                  </th>
                  <th className="py-3.5 px-4 text-center">
                    <div>DRIVERS</div>
                    <button
                      type="button"
                      onClick={() => {
                        const allActive = privileges.every(p => p.driver);
                        handleToggleAllForRole('driver', !allActive);
                      }}
                      className="text-[9px] text-indigo-600 hover:underline font-semibold normal-case"
                    >
                      toggle all
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {privileges
                  .filter(p => !privilegeSearch.trim() || p.name.toLowerCase().includes(privilegeSearch.toLowerCase()))
                  .map((p, idx) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-center font-mono text-slate-400 text-xs">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {p.name}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                        ✓ Full Access
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setPrivileges(prev =>
                            prev.map(item => item.id === p.id ? { ...item, teacher: !item.teacher } : item)
                          );
                        }}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                          p.teacher
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs'
                            : 'bg-slate-100 text-slate-400 border border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {p.teacher ? '✓ Allowed' : '✕ Disabled'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setPrivileges(prev =>
                            prev.map(item => item.id === p.id ? { ...item, staff: !item.staff } : item)
                          );
                        }}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                          p.staff
                            ? 'bg-blue-100 text-blue-800 border border-blue-300 shadow-2xs'
                            : 'bg-slate-100 text-slate-400 border border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {p.staff ? '✓ Allowed' : '✕ Disabled'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setPrivileges(prev =>
                            prev.map(item => item.id === p.id ? { ...item, driver: !item.driver } : item)
                          );
                        }}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                          p.driver
                            ? 'bg-amber-100 text-amber-800 border border-amber-300 shadow-2xs'
                            : 'bg-slate-100 text-slate-400 border border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {p.driver ? '✓ Allowed' : '✕ Disabled'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px]">
                  <th className="py-3 px-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                      className="w-3.5 h-3.5 rounded text-indigo-600 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-3">STAFF MEMBER</th>
                  <th className="py-3 px-3">ROLE & TITLE</th>
                  <th className="py-3 px-3">DEPARTMENT</th>
                  <th className="py-3 px-3">SALARY & BANK</th>
                  <th className="py-3 px-3">ASSIGNMENT & KYC</th>
                  <th className="py-3 px-3 text-center">STATUS</th>
                  <th className="py-3 px-3 text-center w-24">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="py-12 text-center text-slate-400">
                      Loading staff...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-12 text-center text-slate-400">
                      No staff found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(user => {
                    const isDriver = user.role === 'Driver';
                    const isTeacher = user.role === 'Teacher';
                    const isSelected = selectedIds.includes(user.id);

                    return (
                      <tr
                        key={user.id}
                        className={`hover:bg-slate-50/70 transition-colors ${
                          isSelected ? 'bg-indigo-50/30' : ''
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="py-3 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              setSelectedIds(prev =>
                                prev.includes(user.id) ? prev.filter(i => i !== user.id) : [...prev, user.id]
                              );
                            }}
                            className="w-3.5 h-3.5 rounded text-indigo-600 cursor-pointer"
                          />
                        </td>

                        {/* Name & Phone */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={user.pic}
                              alt="Avatar"
                              className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200"
                            />
                            <div>
                              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                <span>{user.displayName || user.name.replace(/^\[.*?\]\s*/, '')}</span>
                                {user.empCode && (
                                  <span className="text-[10px] text-slate-500 font-mono bg-slate-100 px-1 rounded">
                                    #{user.empCode}
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                                <span className="flex items-center gap-1 font-mono">
                                  <Phone className="w-3 h-3 text-slate-400" /> {user.phone}
                                </span>
                                {user.email && (
                                  <span className="hidden sm:inline-block text-slate-400">
                                    • {user.email}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Role & Title */}
                        <td className="py-3 px-3">
                          <div className="space-y-1">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              isTeacher
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : isDriver
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : user.role === 'Admin'
                                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}>
                              {isTeacher && <GraduationCap className="w-3 h-3" />}
                              {isDriver && <Bus className="w-3 h-3" />}
                              {!isTeacher && !isDriver && <Briefcase className="w-3 h-3" />}
                              {user.role === 'Accountant' ? 'Office Staff' : (user.role || 'Staff')}
                            </span>
                            {user.designation && (
                              <div className="text-[11px] text-slate-600 font-medium truncate max-w-[150px]">
                                {user.designation}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Department */}
                        <td className="py-3 px-3 font-semibold text-slate-700">
                          {user.department || (isDriver ? 'Transport' : 'Academics')}
                        </td>

                        {/* SALARY & BANK (ERP Payroll) */}
                        <td className="py-3 px-3">
                          {user.basicSalary ? (
                            <div>
                              <div className="font-bold text-slate-900 flex items-center gap-0.5 font-mono text-[12px]">
                                <IndianRupee className="w-3 h-3 text-emerald-600" />
                                {Number(user.basicSalary).toLocaleString('en-IN')}
                                <span className="text-[10px] text-slate-400 font-sans font-normal ml-0.5">/mo</span>
                              </div>
                              <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                                <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="truncate max-w-[125px]" title={user.bankName}>
                                  {user.bankName ? user.bankName.replace(/ Bank.*/i, '') : 'Bank'}
                                  {user.accountNo ? ` (..${user.accountNo.slice(-4)})` : ''}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[11px] italic">Not set</span>
                          )}
                        </td>

                        {/* Details / Assignment & KYC */}
                        <td className="py-3 px-3">
                          {isDriver ? (
                            <div className="space-y-0.5">
                              {user.driverLicense ? (
                                <div className="font-mono text-xs font-semibold text-slate-800">
                                  Lic: {user.driverLicense}
                                </div>
                              ) : (
                                <div className="text-xs text-slate-500 font-medium">
                                  Transport Driver
                                </div>
                              )}
                              {user.vehicleAssigned && (
                                <div className="text-[11px] text-amber-700 font-medium flex items-center gap-1">
                                  <span>🚌 {user.vehicleAssigned}</span>
                                </div>
                              )}
                            </div>
                          ) : isTeacher ? (
                            <div className="space-y-0.5">
                              <div className="font-semibold text-slate-800">
                                📚 {(user.subjects && user.subjects.length > 0) ? user.subjects.join(', ') : 'All Subjects'}
                              </div>
                              {(user.classes && user.classes.length > 0) && (
                                <div className="text-[10px] text-slate-500">
                                  Classes: {user.classes.join(', ')}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-slate-600 font-medium">
                              {user.workArea || user.designation || 'Administrative Duties'}
                            </div>
                          )}

                          {/* KYC Tags */}
                          <div className="flex items-center gap-1 mt-1 flex-wrap">
                            {user.aadhaarNo && (
                              <span className="inline-flex items-center text-[9px] text-slate-600 font-mono bg-slate-100 px-1 py-0.2 rounded border border-slate-200" title={`Aadhaar: ${user.aadhaarNo}`}>
                                UID ••{user.aadhaarNo.slice(-4)}
                              </span>
                            )}
                            {user.panNo && (
                              <span className="inline-flex items-center text-[9px] text-indigo-700 font-mono bg-indigo-50 px-1 py-0.2 rounded border border-indigo-200" title={`PAN: ${user.panNo}`}>
                                PAN {user.panNo}
                              </span>
                            )}
                            {user.documents && Object.values(user.documents).some(d => d && d.name) && (
                              <span className="inline-flex items-center gap-0.5 text-[9px] text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200" title="KYC Docs Uploaded">
                                <FileCheck className="w-2.5 h-2.5 text-emerald-600" /> Docs
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => handleToggleStatus(user)}
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase transition-colors ${
                              user.isActive
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                            }`}
                          >
                            {user.isActive ? 'Active' : 'Inactive'}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleOpenEdit(user)}
                              className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                              title="Edit Staff & Accounts"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(user.id, user.displayName || user.name)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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

      {/* 4. Complete, Professional 3-Tabbed ERP Add / Edit Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-6 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/90 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 font-bold shadow-2xs">
                  {editingId ? <Edit2 className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    {editingId ? 'Edit Staff Member & Payroll Profile' : 'Add New Staff Member'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Complete School ERP profile, payroll compensation, bank details, and KYC verification records
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 3 ERP Step Tabs (Full-Width Stepper Grid, No Overflow Scrollbar!) */}
            <div className="grid grid-cols-3 gap-2 px-6 py-2.5 bg-slate-100/90 border-b border-slate-200 shrink-0">
              <button
                type="button"
                onClick={() => setActiveModalTab('profile')}
                className={`flex items-center justify-center gap-2.5 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                  activeModalTab === 'profile'
                    ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/90'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  activeModalTab === 'profile' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  1
                </span>
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4" /> Profile & Role
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModalTab('accounts')}
                className={`flex items-center justify-center gap-2.5 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                  activeModalTab === 'accounts'
                    ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/90'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  activeModalTab === 'accounts' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  2
                </span>
                <span className="flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4" /> Bank & Salary
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModalTab('documents')}
                className={`flex items-center justify-center gap-2.5 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                  activeModalTab === 'documents'
                    ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/90'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  activeModalTab === 'documents' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  3
                </span>
                <span className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4" /> Documents & KYC
                </span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
              {/* Scrollable Form Body with Comfortable Padding and Spacing */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* ================= TAB 1: PROFILE & ROLE ================= */}
                {activeModalTab === 'profile' && (
                  <div className="space-y-5 animate-in fade-in duration-100">
                    {/* Identity & Photo Card */}
                    <div className="p-4 bg-slate-50/80 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center gap-5">
                      {/* Photo Avatar with Camera Button */}
                      <div className="relative shrink-0">
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="w-20 h-20 rounded-full border-2 border-indigo-200 overflow-hidden relative group cursor-pointer bg-white shadow-xs flex items-center justify-center ring-4 ring-slate-100"
                          title="Click to change staff photo"
                        >
                          <img
                            src={formData.pic || getRoleDefaultAvatar(formData.role)}
                            alt="Staff"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-slate-900/50 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="w-5 h-5" />
                            <span className="text-[10px] font-semibold mt-1">Change</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute -bottom-1 -right-1 p-1.5 bg-indigo-600 text-white rounded-full shadow-md hover:bg-indigo-700 transition-colors"
                          title="Upload Photo"
                        >
                          <Camera className="w-3.5 h-3.5" />
                        </button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </div>

                      {/* Name, Emp Code, Gender, and Joining Date Grid */}
                      <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-12 gap-3">
                        <div className="sm:col-span-8">
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                            Full Name <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Pooja Kanwar"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                          />
                        </div>

                        <div className="sm:col-span-4">
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                            Emp Code <span className="text-slate-400 font-normal lowercase">(optional)</span>
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 301"
                            value={formData.empCode}
                            onChange={e => setFormData({ ...formData, empCode: e.target.value })}
                            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-mono uppercase text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                          />
                        </div>

                        <div className="sm:col-span-6">
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                            Gender
                          </label>
                          <select
                            value={formData.gender || 'Female'}
                            onChange={e => setFormData({ ...formData, gender: e.target.value })}
                            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                          >
                            <option value="Female">Female</option>
                            <option value="Male">Male</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div className="sm:col-span-6">
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                            Date of Joining
                          </label>
                          <div className="relative">
                            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                            <input
                              type="date"
                              value={formData.joiningDate || ''}
                              onChange={e => setFormData({ ...formData, joiningDate: e.target.value })}
                              className="w-full pl-9 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Role Selection (4 Clear, Spacious Cards) */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        Staff Role Category <span className="text-rose-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {ROLES.map(r => {
                          const isSelected = formData.role === r.id;
                          const IconComp = r.icon;
                          return (
                            <button
                              type="button"
                              key={r.id}
                              onClick={() => setFormData({
                                ...formData,
                                role: r.id,
                                department: r.defaultDept,
                                designation: r.defaultDesignation,
                                basicSalary: r.id === 'Driver' ? 22000 : r.id === 'Teacher' ? 35000 : 38000
                              })}
                              className={`p-3.5 rounded-2xl border text-center transition-all ${
                                isSelected
                                  ? 'bg-indigo-600 text-white font-bold border-indigo-600 shadow-md ring-2 ring-indigo-500/20'
                                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 font-medium hover:border-slate-300'
                              }`}
                            >
                              <IconComp className={`w-6 h-6 mx-auto mb-1.5 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                              <div className="text-sm font-bold">{r.label}</div>
                              <div className={`text-[10px] mt-0.5 line-clamp-1 ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                                {r.defaultDept}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Designation & Department (2-col grid) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Designation / Job Title
                        </label>
                        <input
                          type="text"
                          list="designation-suggestions"
                          placeholder="e.g. Senior Subject Teacher"
                          value={formData.designation}
                          onChange={e => setFormData({ ...formData, designation: e.target.value })}
                          className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                        />
                        <datalist id="designation-suggestions">
                          {(DESIGNATION_PRESETS[formData.role] || []).map(p => (
                            <option key={p} value={p} />
                          ))}
                        </datalist>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Department
                        </label>
                        <select
                          value={formData.department}
                          onChange={e => setFormData({ ...formData, department: e.target.value })}
                          className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                        >
                          {COMMON_DEPARTMENTS.map(d => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Phone & Email (2-col grid) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Phone Number <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          <input
                            type="tel"
                            required
                            placeholder="e.g. 9829012345"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full pl-9 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-mono text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Email Address <span className="text-slate-400 font-normal lowercase">(optional)</span>
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          <input
                            type="email"
                            placeholder="e.g. staff@school.edu"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            className="w-full pl-9 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Role-Specific Assignment Details */}
                    {formData.role === 'Teacher' && (
                      <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3">
                        <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                          <GraduationCap className="w-5 h-5 text-emerald-700" /> Academic Subject & Class Assignment
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Teaching Subject(s)
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. English, EVS, Mathematics"
                              value={formData.teachingSubject}
                              onChange={e => setFormData({ ...formData, teachingSubject: e.target.value })}
                              className="w-full px-3.5 py-2.5 border border-emerald-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Assigned Class(es)
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Class I-A, Class II-B"
                              value={formData.assignedClass}
                              onChange={e => setFormData({ ...formData, assignedClass: e.target.value })}
                              className="w-full px-3.5 py-2.5 border border-emerald-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {formData.role === 'Driver' && (
                      <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-3">
                        <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                          <Bus className="w-5 h-5 text-amber-700" /> Driver Transport Credentials
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Commercial Driving License No.
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. RJ14-201600104"
                            value={formData.driverLicense}
                            onChange={e => setFormData({ ...formData, driverLicense: e.target.value })}
                            className="w-full px-3.5 py-2.5 border border-amber-200 rounded-xl text-sm font-mono uppercase bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                          />
                        </div>
                        <p className="text-xs text-amber-800/90 flex items-center gap-1.5">
                          <span>ℹ️</span> Bus vehicle allocation aur route schedule Transport module se direct assign hoga.
                        </p>
                      </div>
                    )}

                    {(formData.role === 'Staff' || formData.role === 'Admin') && (
                      <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-3">
                        <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
                          <Briefcase className="w-5 h-5 text-blue-700" /> Key Responsibility & Work Area
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="e.g. Fee Counter, Student Records & Admissions, Library Incharge"
                            value={formData.workArea}
                            onChange={e => setFormData({ ...formData, workArea: e.target.value })}
                            className="w-full px-3.5 py-2.5 border border-blue-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    )}

                    {/* Account Status Switch */}
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                      <div>
                        <div className="font-bold text-sm text-slate-900">ERP Account Status</div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {formData.isActive
                            ? 'Active staff member (authorized to perform school operations)'
                            : 'Inactive staff member (login and operations disabled)'}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          formData.isActive
                            ? 'bg-emerald-600 text-white shadow-xs hover:bg-emerald-700'
                            : 'bg-rose-600 text-white shadow-xs hover:bg-rose-700'
                        }`}
                      >
                        {formData.isActive ? '✓ Active Staff' : '✕ Inactive'}
                      </button>
                    </div>
                  </div>
                )}

                {/* ================= TAB 2: BANK & SALARY DETAILS ================= */}
                {activeModalTab === 'accounts' && (
                  <div className="space-y-4 animate-in fade-in duration-100">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-indigo-600" />
                          Bank Account & Salary Details
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Staff member ki banking details aur monthly remuneration record karein
                        </p>
                      </div>
                    </div>

                    {/* 2-Column Clean Grid for all Bank & Salary Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Monthly Salary */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Monthly Salary (₹) <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <IndianRupee className="w-4 h-4 text-emerald-600 absolute left-3 top-3" />
                          <input
                            type="number"
                            required
                            min="0"
                            step="500"
                            placeholder="e.g. 35000"
                            value={formData.basicSalary}
                            onChange={e => setFormData({ ...formData, basicSalary: Number(e.target.value) })}
                            className="w-full pl-9 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-bold font-mono text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                          />
                        </div>
                      </div>

                      {/* Bank Name */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Bank Name <span className="text-slate-400 font-normal lowercase">(select or type)</span>
                        </label>
                        <div className="relative">
                          <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          <input
                            type="text"
                            list="popular-banks"
                            placeholder="e.g. State Bank of India"
                            value={formData.bankName}
                            onChange={e => setFormData({ ...formData, bankName: e.target.value })}
                            className="w-full pl-9 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                          />
                          <datalist id="popular-banks">
                            {POPULAR_BANKS.map(b => (
                              <option key={b} value={b} />
                            ))}
                          </datalist>
                        </div>
                      </div>

                      {/* Bank Account Number */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Bank Account Number
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 30894102910"
                          value={formData.accountNo}
                          onChange={e => setFormData({ ...formData, accountNo: e.target.value })}
                          className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-mono text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                        />
                      </div>

                      {/* IFSC Code */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          IFSC Code
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. SBIN0001234"
                          value={formData.ifscCode}
                          onChange={e => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
                          className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-mono uppercase text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                        />
                      </div>

                      {/* Account Holder Name */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Account Holder Name
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          <input
                            type="text"
                            placeholder={formData.name || 'As per Bank Passbook'}
                            value={formData.accountHolder}
                            onChange={e => setFormData({ ...formData, accountHolder: e.target.value })}
                            className="w-full pl-9 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                          />
                        </div>
                      </div>

                      {/* PAN Card Number */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          PAN Card Number <span className="text-slate-400 font-normal lowercase">(for identity & records)</span>
                        </label>
                        <input
                          type="text"
                          maxLength="10"
                          placeholder="e.g. ABCDE1234F"
                          value={formData.panNo}
                          onChange={e => setFormData({ ...formData, panNo: e.target.value.toUpperCase() })}
                          className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-mono uppercase text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                        />
                      </div>

                      {/* UAN / EPF Number */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          UAN / EPF Number <span className="text-slate-400 font-normal lowercase">(optional provident fund no)</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 100928374619"
                          value={formData.uanNo}
                          onChange={e => setFormData({ ...formData, uanNo: e.target.value })}
                          className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-mono text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ================= TAB 3: DOCUMENTS & KYC ================= */}
                {activeModalTab === 'documents' && (
                  <div className="space-y-5 animate-in fade-in duration-100">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                          <FileCheck className="w-4 h-4 text-emerald-600" />
                          Staff Verification Documents & Certificates
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Staff verification records ke liye scanned documents aur ID copies attach karein
                        </p>
                      </div>
                    </div>

                    {/* Educational Qualification & Aadhaar */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Highest Educational Qualification
                        </label>
                        <div className="relative">
                          <Award className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          <input
                            type="text"
                            placeholder="e.g. B.Ed, M.Sc Mathematics, MA English"
                            value={formData.qualification}
                            onChange={e => setFormData({ ...formData, qualification: e.target.value })}
                            className="w-full pl-9 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Aadhaar Number (12 Digits)
                        </label>
                        <input
                          type="text"
                          maxLength="14"
                          placeholder="e.g. 5412 8901 2345"
                          value={formData.aadhaarNo}
                          onChange={e => setFormData({ ...formData, aadhaarNo: e.target.value })}
                          className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-mono text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                        />
                      </div>
                    </div>

                    {/* Document Upload Grid (4 Large, Clear Cards) */}
                    <div className="space-y-3">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Upload Scanned KYC Documents & Certificates
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {/* 1. Aadhaar Card Upload */}
                        <div className="p-4 border border-slate-200 rounded-2xl bg-slate-50/70 hover:bg-slate-50 transition-colors flex flex-col justify-between">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                                <FileText className="w-4 h-4 text-indigo-600" /> Aadhaar Card Scan
                              </div>
                              <div className="text-xs text-slate-500 mt-1">
                                PDF or image scan (front & back)
                              </div>
                            </div>
                            {formData.documents?.aadhaar ? (
                              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                                <Check className="w-3 h-3" /> Attached
                              </span>
                            ) : (
                              <span className="text-[11px] bg-slate-200/80 text-slate-600 font-medium px-2 py-0.5 rounded-full shrink-0">
                                Required
                              </span>
                            )}
                          </div>
                          <div className="mt-4 flex items-center gap-2 flex-wrap">
                            <label className="cursor-pointer px-3 py-1.5 bg-white border border-slate-200 hover:bg-indigo-50 hover:border-indigo-300 text-slate-700 hover:text-indigo-700 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors">
                              <Upload className="w-3.5 h-3.5 text-slate-500" />
                              {formData.documents?.aadhaar ? 'Change File' : 'Upload File'}
                              <input
                                type="file"
                                accept=".pdf,image/*"
                                onChange={e => handleDocumentUpload('aadhaar', e.target.files?.[0])}
                                className="hidden"
                              />
                            </label>
                            {formData.documents?.aadhaar?.name && (
                              <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1 rounded-xl shadow-2xs">
                                <span className="text-xs text-slate-700 font-mono truncate max-w-[130px]" title={formData.documents.aadhaar.name}>
                                  📄 {formData.documents.aadhaar.name}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveDocument('aadhaar')}
                                  className="p-0.5 text-slate-400 hover:text-rose-600 rounded transition-colors"
                                  title="Remove attached file"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 2. PAN Card Upload */}
                        <div className="p-4 border border-slate-200 rounded-2xl bg-slate-50/70 hover:bg-slate-50 transition-colors flex flex-col justify-between">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-indigo-600" /> PAN Card Copy
                              </div>
                              <div className="text-xs text-slate-500 mt-1">
                                Official document copy for tax compliance
                              </div>
                            </div>
                            {formData.documents?.pan ? (
                              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                                <Check className="w-3 h-3" /> Attached
                              </span>
                            ) : (
                              <span className="text-[11px] bg-slate-200/80 text-slate-600 font-medium px-2 py-0.5 rounded-full shrink-0">
                                Required
                              </span>
                            )}
                          </div>
                          <div className="mt-4 flex items-center gap-2 flex-wrap">
                            <label className="cursor-pointer px-3 py-1.5 bg-white border border-slate-200 hover:bg-indigo-50 hover:border-indigo-300 text-slate-700 hover:text-indigo-700 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors">
                              <Upload className="w-3.5 h-3.5 text-slate-500" />
                              {formData.documents?.pan ? 'Change File' : 'Upload File'}
                              <input
                                type="file"
                                accept=".pdf,image/*"
                                onChange={e => handleDocumentUpload('pan', e.target.files?.[0])}
                                className="hidden"
                              />
                            </label>
                            {formData.documents?.pan?.name && (
                              <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1 rounded-xl shadow-2xs">
                                <span className="text-xs text-slate-700 font-mono truncate max-w-[130px]" title={formData.documents.pan.name}>
                                  📄 {formData.documents.pan.name}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveDocument('pan')}
                                  className="p-0.5 text-slate-400 hover:text-rose-600 rounded transition-colors"
                                  title="Remove attached file"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 3. Degree / Qualification Certificate */}
                        <div className="p-4 border border-slate-200 rounded-2xl bg-slate-50/70 hover:bg-slate-50 transition-colors flex flex-col justify-between">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                                <Award className="w-4 h-4 text-emerald-600" /> Degree / Marksheet
                              </div>
                              <div className="text-xs text-slate-500 mt-1">
                                Highest qualification certificate or B.Ed
                              </div>
                            </div>
                            {formData.documents?.qualificationDoc ? (
                              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                                <Check className="w-3 h-3" /> Attached
                              </span>
                            ) : (
                              <span className="text-[11px] bg-slate-200/80 text-slate-600 font-medium px-2 py-0.5 rounded-full shrink-0">
                                Optional
                              </span>
                            )}
                          </div>
                          <div className="mt-4 flex items-center gap-2 flex-wrap">
                            <label className="cursor-pointer px-3 py-1.5 bg-white border border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 text-slate-700 hover:text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors">
                              <Upload className="w-3.5 h-3.5 text-slate-500" />
                              {formData.documents?.qualificationDoc ? 'Change File' : 'Upload File'}
                              <input
                                type="file"
                                accept=".pdf,image/*"
                                onChange={e => handleDocumentUpload('qualificationDoc', e.target.files?.[0])}
                                className="hidden"
                              />
                            </label>
                            {formData.documents?.qualificationDoc?.name && (
                              <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1 rounded-xl shadow-2xs">
                                <span className="text-xs text-slate-700 font-mono truncate max-w-[130px]" title={formData.documents.qualificationDoc.name}>
                                  📄 {formData.documents.qualificationDoc.name}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveDocument('qualificationDoc')}
                                  className="p-0.5 text-slate-400 hover:text-rose-600 rounded transition-colors"
                                  title="Remove attached file"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 4. Driver License Copy (or Resume for other staff) */}
                        {formData.role === 'Driver' ? (
                          <div className="p-4 border border-amber-200 rounded-2xl bg-amber-50/50 hover:bg-amber-50/80 transition-colors flex flex-col justify-between">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="font-bold text-amber-950 text-sm flex items-center gap-2">
                                  <Bus className="w-4 h-4 text-amber-700" /> Driving License Scan
                                </div>
                                <div className="text-xs text-amber-800/80 mt-1">
                                  Commercial badge & heavy vehicle scan
                                </div>
                              </div>
                              {formData.documents?.driverLicenseDoc ? (
                                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                                  <Check className="w-3 h-3" /> Attached
                                </span>
                              ) : (
                                <span className="text-[11px] bg-amber-200/80 text-amber-900 font-medium px-2 py-0.5 rounded-full shrink-0">
                                  Driver Mandatory
                                </span>
                              )}
                            </div>
                            <div className="mt-4 flex items-center gap-2 flex-wrap">
                              <label className="cursor-pointer px-3 py-1.5 bg-white border border-amber-200 hover:bg-amber-100/60 text-amber-950 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors">
                                <Upload className="w-3.5 h-3.5 text-amber-700" />
                                {formData.documents?.driverLicenseDoc ? 'Change License' : 'Upload License'}
                                <input
                                  type="file"
                                  accept=".pdf,image/*"
                                  onChange={e => handleDocumentUpload('driverLicenseDoc', e.target.files?.[0])}
                                  className="hidden"
                                />
                              </label>
                              {formData.documents?.driverLicenseDoc?.name && (
                                <div className="flex items-center gap-1.5 bg-white border border-amber-200 px-2.5 py-1 rounded-xl shadow-2xs">
                                  <span className="text-xs text-amber-950 font-mono truncate max-w-[130px]" title={formData.documents.driverLicenseDoc.name}>
                                    📄 {formData.documents.driverLicenseDoc.name}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveDocument('driverLicenseDoc')}
                                    className="p-0.5 text-amber-700 hover:text-rose-600 rounded transition-colors"
                                    title="Remove attached file"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 border border-slate-200 rounded-2xl bg-slate-50/70 hover:bg-slate-50 transition-colors flex flex-col justify-between">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                                  <File className="w-4 h-4 text-blue-600" /> Staff Resume / Biodata
                                </div>
                                <div className="text-xs text-slate-500 mt-1">
                                  CV, experience letter, or bio records
                                </div>
                              </div>
                              {formData.documents?.resumeDoc ? (
                                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                                  <Check className="w-3 h-3" /> Attached
                                </span>
                              ) : (
                                <span className="text-[11px] bg-slate-200/80 text-slate-600 font-medium px-2 py-0.5 rounded-full shrink-0">
                                  Optional
                                </span>
                              )}
                            </div>
                            <div className="mt-4 flex items-center gap-2 flex-wrap">
                              <label className="cursor-pointer px-3 py-1.5 bg-white border border-slate-200 hover:bg-blue-50 hover:border-blue-300 text-slate-700 hover:text-blue-700 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors">
                                <Upload className="w-3.5 h-3.5 text-slate-500" />
                                {formData.documents?.resumeDoc ? 'Change File' : 'Upload File'}
                                <input
                                  type="file"
                                  accept=".pdf,image/*"
                                  onChange={e => handleDocumentUpload('resumeDoc', e.target.files?.[0])}
                                  className="hidden"
                                />
                              </label>
                              {formData.documents?.resumeDoc?.name && (
                                <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1 rounded-xl shadow-2xs">
                                  <span className="text-xs text-slate-700 font-mono truncate max-w-[130px]" title={formData.documents.resumeDoc.name}>
                                    📄 {formData.documents.resumeDoc.name}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveDocument('resumeDoc')}
                                    className="p-0.5 text-slate-400 hover:text-rose-600 rounded transition-colors"
                                    title="Remove attached file"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Pinned Action & Multi-step Navigation Footer */}
              <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/90 flex items-center justify-between gap-3 shrink-0">
                {/* Step / Back Button */}
                <div>
                  {activeModalTab === 'accounts' && (
                    <button
                      type="button"
                      onClick={() => setActiveModalTab('profile')}
                      className="px-4 py-2 border border-slate-300 bg-white text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                    >
                      <ChevronLeft className="w-4 h-4" /> Back: Profile
                    </button>
                  )}
                  {activeModalTab === 'documents' && (
                    <button
                      type="button"
                      onClick={() => setActiveModalTab('accounts')}
                      className="px-4 py-2 border border-slate-300 bg-white text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                    >
                      <ChevronLeft className="w-4 h-4" /> Back: Bank Details
                    </button>
                  )}
                  {activeModalTab === 'profile' && (
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 border border-slate-300 bg-white text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-100 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                {/* Next Tab / Save Buttons */}
                <div className="flex items-center gap-3">
                  {activeModalTab === 'profile' && (
                    <button
                      type="button"
                      onClick={() => setActiveModalTab('accounts')}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      Next: Bank & Salary <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                  {activeModalTab === 'accounts' && (
                    <button
                      type="button"
                      onClick={() => setActiveModalTab('documents')}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      Next: Documents & KYC <ChevronRight className="w-4 h-4" />
                    </button>
                  )}

                  {/* Primary Save Staff Member (always accessible) */}
                  <button
                    type="submit"
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    {editingId ? <Edit2 className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                    {editingId ? 'Save Changes' : 'Save Staff Member'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export default ManageUsersPage;
