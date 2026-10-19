import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  ShieldCheck,
  Plus,
  FileText,
  Search,
  Home,
  Check,
  X,
  Edit2,
  Trash2,
  UserPlus,
  AlertCircle,
  Eye,
  Bus,
  Briefcase,
  GraduationCap,
  Shield,
  Phone,
  Mail,
  Award,
  Filter,
  Download,
  Key,
  CheckCircle2,
  XCircle,
  Layers,
  BookOpen,
  Calendar,
  Settings2,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

const ALL_MODULES = [
  'Dashboard', 'Student', 'Academics', 'Fee', 'Transport', 'Hostel',
  'Examination', 'Payroll', 'Front Office', 'Library', 'Stationary', 'SMS'
];

const ALL_CLASSES = [
  'Nursery', 'LKG', 'UKG',
  'I - A', 'I - B', 'II - A', 'II - B', 'III - A',
  'IV - A', 'V - A', 'VI - A', 'VII - A', 'VIII - A',
  'IX - A', 'X - A', 'XI - SCI', 'XII - SCI'
];

const ALL_SUBJECTS = [
  'English', 'Hindi', 'Mathematics', 'Science', 'Social Science',
  'Physics', 'Chemistry', 'Biology', 'Computer Science', 'EVS', 'General Knowledge'
];

const ALL_VEHICLES = [
  { no: 'RJ02PA2762', name: 'Bus 01 (42 Seater)', route: 'Route 1 (Kalyanpura)' },
  { no: 'RJ14PC1019', name: 'Bus 02 (42 Seater)', route: 'Route 2 (Mansarovar)' },
  { no: 'RJ14PC1037', name: 'Bus 03 (50 Seater)', route: 'Route 3 (Vaishali)' },
  { no: 'RJ14PC2278', name: 'Bus 04 (40 Seater)', route: 'Route 4 (Jagatpura)' }
];

const ROLE_OPTIONS = [
  { value: 'Teacher', label: 'Teacher / Faculty', icon: GraduationCap, color: 'emerald' },
  { value: 'Staff', label: 'Office / Admin Staff', icon: Briefcase, color: 'blue' },
  { value: 'Driver', label: 'Driver / Transport Staff', icon: Bus, color: 'amber' },
  { value: 'Accountant', label: 'Accountant / Cashier', icon: Award, color: 'indigo' },
  { value: 'Admin', label: 'System Admin / Principal', icon: Shield, color: 'purple' }
];

export function ManageUsersPage({ onNavigate }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'TEACHER' | 'STAFF' | 'DRIVER' | 'ADMIN'
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'INACTIVE'
  const [departmentFilter, setDepartmentFilter] = useState('ALL');

  // Modals state
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Driver vehicle allocation modal
  const [driverModal, setDriverModal] = useState({
    isOpen: false,
    user: null,
    vehicleNo: '',
    routeName: '',
    driverLicense: ''
  });

  // Assignment Modal (Classes / Subjects / Modules)
  const [configModal, setConfigModal] = useState({
    isOpen: false,
    user: null,
    type: '',
    title: '',
    items: [],
    selected: []
  });

  // Add / Edit User Form State
  const [formData, setFormData] = useState({
    staffName: '',
    role: 'Teacher',
    department: 'Academics',
    mobileNo: '',
    email: '',
    driverLicense: '',
    vehicleAssigned: '',
    division: 'Primary',
    modules: ['Student', 'Attendance', 'Academics'],
    classes: ['I - A', 'I - B'],
    subjects: ['English', 'Mathematics']
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/user-management/users');
      const d = await res.json();
      if (d.success) {
        setUsers(d.data);
      }
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenAddModal = (presetRole = 'Staff') => {
    setFormData({
      staffName: '',
      role: presetRole,
      department: presetRole === 'Driver' ? 'Transport' : presetRole === 'Teacher' ? 'Academics' : presetRole === 'Accountant' ? 'Accounts' : 'Administration',
      mobileNo: '',
      email: '',
      driverLicense: presetRole === 'Driver' ? 'RJ14-' : '',
      vehicleAssigned: presetRole === 'Driver' ? 'RJ02PA2762 - Route 1 (Kalyanpura)' : '',
      division: presetRole === 'Driver' ? 'Transport' : 'Primary',
      modules: presetRole === 'Driver' ? ['Transport'] : presetRole === 'Teacher' ? ['Student', 'Attendance', 'Examination'] : ['Fee', 'Front Office'],
      classes: presetRole === 'Teacher' ? ['I - A'] : [],
      subjects: presetRole === 'Teacher' ? ['English'] : []
    });
    setEditingUser(null);
    setIsAddUserOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      staffName: user.displayName || user.name.replace(/^\[.*?\]\s*/, ''),
      role: user.role || 'Staff',
      department: user.department || 'Academics',
      mobileNo: user.phone || '',
      email: user.email || '',
      driverLicense: user.driverLicense || '',
      vehicleAssigned: user.vehicleAssigned || '',
      division: user.division || 'Primary',
      modules: user.modules || [],
      classes: user.classes || [],
      subjects: user.subjects || []
    });
    setIsAddUserOpen(true);
  };

  const handleSubmitUser = async (e) => {
    e.preventDefault();
    if (!formData.staffName.trim()) {
      toast.error('Please enter name');
      return;
    }
    if (!formData.mobileNo.trim()) {
      toast.error('Please enter mobile number');
      return;
    }

    try {
      if (editingUser) {
        const res = await fetch(`/api/user-management/users/${editingUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            displayName: formData.staffName,
            role: formData.role,
            department: formData.department,
            phone: formData.mobileNo,
            email: formData.email,
            driverLicense: formData.driverLicense,
            vehicleAssigned: formData.vehicleAssigned,
            division: formData.division
          })
        });
        const data = await res.json();
        if (data.success) {
          toast.success('User updated successfully');
          setIsAddUserOpen(false);
          setEditingUser(null);
          fetchUsers();
        } else {
          toast.error(data.message || 'Failed to update user');
        }
      } else {
        const res = await fetch('/api/user-management/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const data = await res.json();
        if (data.success) {
          toast.success(data.message || 'User added successfully');
          setIsAddUserOpen(false);
          fetchUsers();
        } else {
          toast.error(data.message || 'Failed to add user');
        }
      }
    } catch {
      toast.error('Network error. Please try again.');
    }
  };

  const togglePermission = async (user, field) => {
    const updatedValue = !user[field];
    try {
      const res = await fetch(`/api/user-management/users/${user.id}/permissions`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: updatedValue })
      });
      const data = await res.json();
      if (data.success) {
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, [field]: updatedValue } : u));
        toast.success(`Permission updated for ${user.displayName || user.name}`);
      }
    } catch {
      toast.error('Failed to update permission');
    }
  };

  const toggleActiveStatus = async (user) => {
    try {
      const res = await fetch(`/api/user-management/users/${user.id}/status`, {
        method: 'PUT'
      });
      const data = await res.json();
      if (data.success) {
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isActive: !u.isActive } : u));
        toast.success(`${user.displayName || user.name} is now ${!user.isActive ? 'Active' : 'Inactive'}`);
      }
    } catch {
      toast.error('Failed to toggle status');
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name || 'this user'}?`)) return;
    try {
      const res = await fetch(`/api/user-management/users/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('User removed successfully');
        setSelectedUserIds(prev => prev.filter(i => i !== id));
        fetchUsers();
      }
    } catch {
      toast.error('Failed to delete user');
    }
  };

  // Bulk actions handler
  const handleBulkAction = async (action) => {
    if (selectedUserIds.length === 0) return;
    if (action === 'delete' && !window.confirm(`Are you sure you want to delete ${selectedUserIds.length} selected users?`)) {
      return;
    }

    try {
      const res = await fetch('/api/user-management/users/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, userIds: selectedUserIds })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        if (action === 'delete') setSelectedUserIds([]);
        fetchUsers();
      } else {
        toast.error(data.message || 'Bulk action failed');
      }
    } catch {
      toast.error('Network error during bulk action');
    }
  };

  // Open driver vehicle allocation modal
  const openDriverVehicleModal = (user) => {
    const currentVehicle = ALL_VEHICLES.find(v => (user.vehicleAssigned || '').includes(v.no)) || ALL_VEHICLES[0];
    setDriverModal({
      isOpen: true,
      user,
      vehicleNo: currentVehicle.no,
      routeName: currentVehicle.route,
      driverLicense: user.driverLicense || ''
    });
  };

  const saveDriverVehicleAllocation = async () => {
    const { user, vehicleNo, routeName, driverLicense } = driverModal;
    const vehicleObj = ALL_VEHICLES.find(v => v.no === vehicleNo);
    const assignedStr = vehicleObj ? `${vehicleObj.no} - ${vehicleObj.route}` : vehicleNo;

    try {
      const res = await fetch(`/api/user-management/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleAssigned: assignedStr,
          driverLicense: driverLicense
        })
      });
      const data = await res.json();
      if (data.success) {
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, vehicleAssigned: assignedStr, driverLicense } : u));
        toast.success(`Vehicle allocated to ${user.displayName || user.name}`);
        setDriverModal({ isOpen: false, user: null, vehicleNo: '', routeName: '', driverLicense: '' });
      }
    } catch {
      toast.error('Failed to update driver vehicle');
    }
  };

  // Open assignment modal (Classes / Subjects / Modules)
  const openConfigModal = (user, type) => {
    let title = '';
    let items = [];
    if (type === 'modules') {
      title = 'Accessible System Modules';
      items = ALL_MODULES;
    } else if (type === 'classes') {
      title = 'Assigned Teaching Classes';
      items = ALL_CLASSES;
    } else if (type === 'subjects') {
      title = 'Assigned Teaching Subjects';
      items = ALL_SUBJECTS;
    }

    setConfigModal({
      isOpen: true,
      user,
      type,
      title,
      items,
      selected: [...(user[type] || [])]
    });
  };

  const saveConfig = async () => {
    const { user, type, selected } = configModal;
    try {
      const res = await fetch(`/api/user-management/users/${user.id}/permissions`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [type]: selected })
      });
      const data = await res.json();
      if (data.success) {
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, [type]: selected } : u));
        toast.success(`${configModal.title} updated for ${user.displayName || user.name}`);
        setConfigModal({ isOpen: false, user: null, type: '', title: '', items: [], selected: [] });
      }
    } catch {
      toast.error('Failed to save configuration');
    }
  };

  const toggleConfigItem = (item) => {
    setConfigModal(prev => {
      const exists = prev.selected.includes(item);
      return {
        ...prev,
        selected: exists ? prev.selected.filter(i => i !== item) : [...prev.selected, item]
      };
    });
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (users.length === 0) return;
    const headers = ['Employee Code', 'Full Name', 'Role', 'Department', 'Phone', 'Email', 'Status', 'License / Vehicle', 'Classes / Subjects'];
    const rows = filteredUsers.map(u => [
      `"${u.empCode || ''}"`,
      `"${u.displayName || u.name || ''}"`,
      `"${u.role || ''}"`,
      `"${u.department || ''}"`,
      `"${u.phone || ''}"`,
      `"${u.email || ''}"`,
      `"${u.isActive ? 'Active' : 'Inactive'}"`,
      `"${u.role === 'Driver' ? `${u.driverLicense || ''} | ${u.vehicleAssigned || ''}` : ''}"`,
      `"${u.role === 'Teacher' ? `Classes: ${(u.classes || []).join(', ')} | Subjects: ${(u.subjects || []).join(', ')}` : ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `School_Users_Directory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Users list exported as CSV');
  };

  // Filtered users logic
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      // Tab filter
      if (activeTab === 'TEACHER' && u.role !== 'Teacher') return false;
      if (activeTab === 'STAFF' && u.role !== 'Staff' && u.role !== 'Accountant') return false;
      if (activeTab === 'DRIVER' && u.role !== 'Driver') return false;
      if (activeTab === 'ADMIN' && u.role !== 'Admin') return false;

      // Status filter
      if (statusFilter === 'ACTIVE' && !u.isActive) return false;
      if (statusFilter === 'INACTIVE' && u.isActive) return false;

      // Department filter
      if (departmentFilter !== 'ALL' && u.department !== departmentFilter) return false;

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = (u.name && u.name.toLowerCase().includes(q)) || (u.displayName && u.displayName.toLowerCase().includes(q));
        const matchPhone = u.phone && u.phone.includes(q);
        const matchEmail = u.email && u.email.toLowerCase().includes(q);
        const matchRole = u.role && u.role.toLowerCase().includes(q);
        const matchDept = u.department && u.department.toLowerCase().includes(q);
        const matchLicense = u.driverLicense && u.driverLicense.toLowerCase().includes(q);
        const matchVehicle = u.vehicleAssigned && u.vehicleAssigned.toLowerCase().includes(q);
        if (!matchName && !matchPhone && !matchEmail && !matchRole && !matchDept && !matchLicense && !matchVehicle) {
          return false;
        }
      }
      return true;
    });
  }, [users, activeTab, statusFilter, departmentFilter, searchQuery]);

  // Master Checkbox Logic
  const allFilteredSelected = filteredUsers.length > 0 && filteredUsers.every(u => selectedUserIds.includes(u.id));
  const someFilteredSelected = filteredUsers.some(u => selectedUserIds.includes(u.id)) && !allFilteredSelected;

  const handleToggleSelectAll = () => {
    if (allFilteredSelected) {
      const filteredIds = new Set(filteredUsers.map(u => u.id));
      setSelectedUserIds(prev => prev.filter(id => !filteredIds.has(id)));
    } else {
      const filteredIds = filteredUsers.map(u => u.id);
      setSelectedUserIds(prev => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

  // KPI Metrics
  const totalCount = users.length;
  const teachersCount = users.filter(u => u.role === 'Teacher').length;
  const staffCount = users.filter(u => u.role === 'Staff' || u.role === 'Accountant').length;
  const driversCount = users.filter(u => u.role === 'Driver').length;
  const activeCount = users.filter(u => u.isActive).length;

  return (
    <div className="p-3 sm:p-5 bg-slate-50 min-h-screen text-slate-800 space-y-3">
      {/* 1. Sleek Compact Command Card (Header + Actions + KPI Pill Strip) */}
      <div className="bg-white p-3.5 rounded-xl shadow-xs border border-slate-200/80 space-y-3">
        {/* Row 1: Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center font-bold shadow-2xs shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 leading-tight">
                  Users & Campus Staff Directory
                </h1>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                  {totalCount} Total
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <span
                  onClick={() => onNavigate && onNavigate('/')}
                  className="hover:text-indigo-600 cursor-pointer flex items-center gap-1"
                >
                  <Home className="w-3 h-3" /> Dashboard
                </span>
                <span>/</span>
                <span className="text-indigo-600 font-semibold">User Management</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => handleOpenAddModal('Staff')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-all active:scale-95"
            >
              <UserPlus className="w-3.5 h-3.5" /> + Add User / Staff
            </button>
            <button
              onClick={() => handleOpenAddModal('Driver')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold shadow-xs transition-all active:scale-95"
            >
              <Bus className="w-3.5 h-3.5" /> + Add Driver
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200/90 shadow-2xs transition-all"
              title="Export CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" /> Export CSV
            </button>
            <button
              onClick={() => onNavigate && onNavigate('/user-privilege-report')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200/80 transition-all"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" /> Privileges
            </button>
          </div>
        </div>

        {/* Row 2: Role Filter Tabs & Live Counts */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: 'ALL', label: 'All Users', count: totalCount, icon: Users, color: 'indigo' },
              { id: 'TEACHER', label: 'Teachers', count: teachersCount, icon: GraduationCap, color: 'emerald' },
              { id: 'STAFF', label: 'Office & Accounts', count: staffCount, icon: Briefcase, color: 'blue' },
              { id: 'DRIVER', label: 'Drivers & Fleet', count: driversCount, icon: Bus, color: 'amber' },
              { id: 'ADMIN', label: 'Admins', count: users.filter(u => u.role === 'Admin').length, icon: Shield, color: 'purple' }
            ].map(tab => {
              const IconComp = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border border-slate-200/80 hover:bg-slate-100'
                  }`}
                >
                  <IconComp className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-700'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Active Badge & Reset */}
          <div className="flex items-center gap-2">
            <span
              onClick={() => setStatusFilter(statusFilter === 'ACTIVE' ? 'ALL' : 'ACTIVE')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer border transition-all ${
                statusFilter === 'ACTIVE'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-2 ring-emerald-500/20'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
              title="Click to toggle Active-only filter"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{activeCount} Active</span>
            </span>

            {(activeTab !== 'ALL' || statusFilter !== 'ALL' || departmentFilter !== 'ALL' || searchQuery) && (
              <button
                onClick={() => {
                  setActiveTab('ALL');
                  setStatusFilter('ALL');
                  setDepartmentFilter('ALL');
                  setSearchQuery('');
                }}
                className="text-[11px] font-semibold text-rose-600 hover:text-rose-800 hover:underline"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Row 3: Search & Quick Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
          <div className="flex items-center gap-2 flex-1 max-w-lg">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by name, phone, email, license, bus no..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-7 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/60"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Status Dropdown */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active Only</option>
              <option value="INACTIVE">Inactive Only</option>
            </select>

            {/* Department Dropdown */}
            <select
              value={departmentFilter}
              onChange={e => setDepartmentFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 hidden md:block"
            >
              <option value="ALL">All Departments</option>
              <option value="Academics">Academics</option>
              <option value="Administration">Administration</option>
              <option value="Accounts">Accounts</option>
              <option value="Transport">Transport</option>
              <option value="Library">Library</option>
            </select>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-indigo-600 font-bold">{filteredUsers.length}</strong> of {totalCount} users
          </div>
        </div>

        {/* Bulk Action Strip (When Rows are Checked) */}
        {selectedUserIds.length > 0 && (
          <div className="p-2 bg-indigo-50/90 border border-indigo-200 rounded-lg flex items-center justify-between flex-wrap gap-2 text-xs animate-in fade-in duration-150">
            <div className="flex items-center gap-2">
              <span className="font-bold text-indigo-900 bg-white px-2 py-0.5 rounded border border-indigo-200">
                {selectedUserIds.length} Selected
              </span>
              <span className="text-indigo-700">Actions:</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleBulkAction('activate')}
                className="px-2 py-0.5 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 font-semibold rounded shadow-2xs transition-colors"
              >
                ✓ Mark Active
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                className="px-2 py-0.5 bg-white hover:bg-amber-50 text-amber-700 border border-amber-300 font-semibold rounded shadow-2xs transition-colors"
              >
                ✕ Mark Inactive
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-2 py-0.5 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 font-semibold rounded shadow-2xs transition-colors"
              >
                🗑 Delete Selected
              </button>
              <button
                onClick={() => setSelectedUserIds([])}
                className="text-slate-500 hover:text-slate-800 underline px-1.5 font-medium"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. Main Directory Table (Clean, Role-Adaptive) */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                {/* Master Checkbox */}
                <th className="py-2.5 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={allFilteredSelected}
                    ref={el => el && (el.indeterminate = someFilteredSelected)}
                    onChange={handleToggleSelectAll}
                    className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    title="Select / Deselect All Filtered"
                  />
                </th>
                <th className="py-2.5 px-3">USER / EMPLOYEE</th>
                <th className="py-2.5 px-3">ROLE & DEPT</th>
                <th className="py-2.5 px-3">ROLE ASSIGNMENTS & DETAILS</th>
                <th className="py-2.5 px-3 text-center">MODULE ACCESS</th>
                <th className="py-2.5 px-3 text-center">PERMISSIONS</th>
                <th className="py-2.5 px-2 text-center w-20">STATUS</th>
                <th className="py-2.5 px-3 text-center w-20">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    <div className="animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto mb-2" />
                    Loading users directory...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    No users found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => {
                  const isDriver = user.role === 'Driver';
                  const isTeacher = user.role === 'Teacher';
                  const isStaff = user.role === 'Staff' || user.role === 'Accountant' || user.role === 'Admin';
                  const isSelected = selectedUserIds.includes(user.id);

                  return (
                    <tr
                      key={user.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isSelected ? 'bg-indigo-50/40' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-2.5 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {
                            setSelectedUserIds(prev =>
                              prev.includes(user.id) ? prev.filter(i => i !== user.id) : [...prev, user.id]
                            );
                          }}
                          className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                      </td>

                      {/* USER / EMPLOYEE INFO */}
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={user.pic}
                            alt="Avatar"
                            className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200 shadow-2xs"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900 hover:text-indigo-600 cursor-pointer" onClick={() => handleOpenEditModal(user)}>
                                {user.displayName || user.name.replace(/^\[.*?\]\s*/, '')}
                              </span>
                              {user.empCode && (
                                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                                  #{user.empCode}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                              <span className="flex items-center gap-1 font-mono text-slate-600">
                                <Phone className="w-3 h-3 text-slate-400" /> {user.phone}
                              </span>
                              {user.email && (
                                <span className="hidden md:inline-block text-slate-400 truncate max-w-[170px]" title={user.email}>
                                  • {user.email}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* ROLE & DEPT */}
                      <td className="py-2.5 px-3">
                        <div className="space-y-0.5">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            isTeacher
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : isDriver
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : user.role === 'Admin'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : user.role === 'Accountant'
                              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}>
                            {isDriver && <Bus className="w-3 h-3" />}
                            {isTeacher && <GraduationCap className="w-3 h-3" />}
                            {isStaff && <Briefcase className="w-3 h-3" />}
                            {user.role || 'Staff'}
                          </span>
                          <div className="text-[11px] text-slate-500 font-medium">
                            {user.department || (isDriver ? 'Transport' : 'Academics')}
                          </div>
                        </div>
                      </td>

                      {/* ROLE ASSIGNMENTS & DETAILS (Role-Adaptive) */}
                      <td className="py-2.5 px-3">
                        {isDriver ? (
                          /* DRIVER DETAILS: License + Vehicle + Route */
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-mono text-[10px] font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                                Lic: {user.driverLicense || 'Not Added'}
                              </span>
                              <button
                                onClick={() => openDriverVehicleModal(user)}
                                className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-1.5 py-0.5 rounded border border-indigo-200 transition-colors"
                              >
                                <Bus className="w-3 h-3" /> Change Bus/Route
                              </button>
                            </div>
                            <div className="text-[11px] text-slate-700 flex items-center gap-1 truncate max-w-xs">
                              <span className="text-amber-600 font-bold">🚌</span>
                              <span className="font-semibold">
                                {user.vehicleAssigned || 'No Bus Assigned'}
                              </span>
                            </div>
                          </div>
                        ) : isTeacher ? (
                          /* TEACHER DETAILS: Assigned Classes & Subjects */
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {/* Classes Button / Pills */}
                              <button
                                onClick={() => openConfigModal(user, 'classes')}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 transition-all"
                                title="Click to assign classes"
                              >
                                <Edit2 className="w-2.5 h-2.5" />
                                <span>{user.classes ? user.classes.length : 0} Classes</span>
                              </button>

                              {/* Preview First 2 Classes */}
                              {(user.classes || []).slice(0, 2).map(cls => (
                                <span key={cls} className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                                  {cls}
                                </span>
                              ))}
                              {(user.classes || []).length > 2 && (
                                <span className="text-[10px] text-slate-400 font-medium">+{user.classes.length - 2} more</span>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5 flex-wrap">
                              {/* Subjects Button / Pills */}
                              <button
                                onClick={() => openConfigModal(user, 'subjects')}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-all"
                                title="Click to assign subjects"
                              >
                                <Edit2 className="w-2.5 h-2.5" />
                                <span>{user.subjects ? user.subjects.length : 0} Subjects</span>
                              </button>

                              {/* Preview First 2 Subjects */}
                              {(user.subjects || []).slice(0, 2).map(sub => (
                                <span key={sub} className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                                  {sub}
                                </span>
                              ))}
                              {(user.subjects || []).length > 2 && (
                                <span className="text-[10px] text-slate-400 font-medium">+{user.subjects.length - 2} more</span>
                              )}
                            </div>
                          </div>
                        ) : (
                          /* STAFF / ADMIN DETAILS: Scope & Division */
                          <div className="space-y-0.5">
                            <div className="text-[11px] font-semibold text-slate-800">
                              {user.department === 'Accounts' ? 'Fee Collection & Finance Management' : user.department === 'Library' ? 'Book Circulation & Catalog' : 'Administrative Operations'}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              Division Scope: <span className="font-semibold text-slate-700">{user.division || 'All Divisions'}</span>
                            </div>
                          </div>
                        )}
                      </td>

                      {/* MODULE ACCESS */}
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => openConfigModal(user, 'modules')}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-all ${
                            user.modules && user.modules.length > 0
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                              : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                          }`}
                          title="Click to configure accessible ERP modules"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>{user.modules ? user.modules.length : 0} Modules</span>
                        </button>
                      </td>

                      {/* PERMISSIONS (CRUD Toggles) */}
                      <td className="py-2.5 px-3 text-center">
                        {isDriver ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Check className="w-3 h-3" /> Driver App Access
                          </span>
                        ) : (
                          <div className="flex items-center justify-center gap-1">
                            {/* ADD Permission Toggle */}
                            <button
                              onClick={() => togglePermission(user, 'isAdd')}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                                user.isAdd
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100 line-through'
                              }`}
                              title="Toggle Create / Add Permission"
                            >
                              Add
                            </button>

                            {/* VIEW Permission Toggle */}
                            <button
                              onClick={() => togglePermission(user, 'isView')}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                                user.isView
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100 line-through'
                              }`}
                              title="Toggle View Permission"
                            >
                              View
                            </button>

                            {/* MODIFY Permission Toggle */}
                            <button
                              onClick={() => togglePermission(user, 'isModify')}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                                user.isModify
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100 line-through'
                              }`}
                              title="Toggle Edit / Modify Permission"
                            >
                              Edit
                            </button>
                          </div>
                        )}
                      </td>

                      {/* STATUS (Interactive Toggle Pill) */}
                      <td className="py-2.5 px-2 text-center">
                        <button
                          onClick={() => toggleActiveStatus(user)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide transition-all ${
                            user.isActive
                              ? 'bg-emerald-100/80 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                              : 'bg-rose-100/80 text-rose-800 hover:bg-rose-200 border border-rose-300'
                          }`}
                          title="Click to toggle Active / Inactive"
                        >
                          {user.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>

                      {/* ACTIONS */}
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleOpenEditModal(user)}
                            className="p-1.5 rounded-md text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            title="Edit User Profile"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id, user.displayName || user.name)}
                            className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete User"
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

      {/* 3. ADD / EDIT USER MODAL */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center font-bold">
                  {formData.role === 'Driver' ? <Bus className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    {editingUser ? 'Edit User Details' : 'Add New System User'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Faculty, office staff, drivers, and school administrators
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddUserOpen(false)}
                className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitUser} className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Select User Role <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ROLE_OPTIONS.map(opt => {
                    const IconComp = opt.icon;
                    const isSelected = formData.role === opt.value;
                    return (
                      <button
                        type="button"
                        key={opt.value}
                        onClick={() => {
                          setFormData({
                            ...formData,
                            role: opt.value,
                            department: opt.value === 'Driver' ? 'Transport' : opt.value === 'Teacher' ? 'Academics' : opt.value === 'Accountant' ? 'Accounts' : formData.department,
                            division: opt.value === 'Driver' ? 'Transport' : formData.division
                          });
                        }}
                        className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                          isSelected
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold ring-1 ring-indigo-500 shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <IconComp className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                        <span className="truncate text-[11px]">{opt.value}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar / Pooja Kanwar"
                  value={formData.staffName}
                  onChange={e => setFormData({ ...formData, staffName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9829012345"
                    value={formData.mobileNo}
                    onChange={e => setFormData({ ...formData, mobileNo: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. user@jdintl.edu"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Driver Specific Fields */}
              {formData.role === 'Driver' && (
                <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900 text-xs">
                    <Bus className="w-3.5 h-3.5 text-amber-600" />
                    <span>Driver Commercial License & Vehicle</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Commercial Driving License No.
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. RJ14-201600104"
                        value={formData.driverLicense}
                        onChange={e => setFormData({ ...formData, driverLicense: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-amber-200 rounded-lg text-xs bg-white font-mono uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Select Assigned Bus & Route
                      </label>
                      <select
                        value={formData.vehicleAssigned}
                        onChange={e => setFormData({ ...formData, vehicleAssigned: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-amber-200 rounded-lg text-xs bg-white"
                      >
                        <option value="">-- Select Bus & Route --</option>
                        {ALL_VEHICLES.map(v => (
                          <option key={v.no} value={`${v.no} - ${v.route}`}>
                            {v.no} ({v.name} - {v.route})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Department & Division */}
              {formData.role !== 'Driver' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Department
                    </label>
                    <select
                      value={formData.department}
                      onChange={e => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    >
                      <option value="Academics">Academics (Teaching)</option>
                      <option value="Administration">Administration</option>
                      <option value="Accounts">Accounts & Finance</option>
                      <option value="Library">Library</option>
                      <option value="Front Office">Front Office</option>
                      <option value="Support">Campus Support</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Division
                    </label>
                    <select
                      value={formData.division}
                      onChange={e => setFormData({ ...formData, division: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    >
                      <option value="Primary">Primary</option>
                      <option value="Secondary">Secondary</option>
                      <option value="Senior Secondary">Senior Secondary</option>
                      <option value="All">All Divisions</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-xs transition-colors"
                >
                  {editingUser ? 'Save Changes' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. QUICK DRIVER ALLOCATION MODAL */}
      {driverModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-amber-50/80">
              <div className="flex items-center gap-2">
                <Bus className="w-5 h-5 text-amber-600" />
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Assign Vehicle & Route</h3>
                  <p className="text-[11px] text-slate-500">{driverModal.user?.displayName || driverModal.user?.name}</p>
                </div>
              </div>
              <button
                onClick={() => setDriverModal({ isOpen: false, user: null, vehicleNo: '', routeName: '', driverLicense: '' })}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Driving License Number
                </label>
                <input
                  type="text"
                  value={driverModal.driverLicense}
                  onChange={e => setDriverModal({ ...driverModal, driverLicense: e.target.value })}
                  placeholder="e.g. RJ14-201500892"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono uppercase bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Fleet Vehicle / Bus
                </label>
                <div className="space-y-2">
                  {ALL_VEHICLES.map(v => {
                    const isSelected = driverModal.vehicleNo === v.no;
                    return (
                      <div
                        key={v.no}
                        onClick={() => setDriverModal({ ...driverModal, vehicleNo: v.no, routeName: v.route })}
                        className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-amber-50 border-amber-400 ring-1 ring-amber-400 shadow-2xs font-semibold'
                            : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Bus className={`w-4 h-4 ${isSelected ? 'text-amber-600' : 'text-slate-400'}`} />
                          <div>
                            <div className="font-bold text-slate-900">{v.no} ({v.name})</div>
                            <div className="text-[10px] text-slate-500">{v.route}</div>
                          </div>
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDriverModal({ isOpen: false, user: null, vehicleNo: '', routeName: '', driverLicense: '' })}
                className="px-3.5 py-1.5 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveDriverVehicleAllocation}
                className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold shadow-xs"
              >
                Save Allocation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. CONFIGURATION MODAL (Classes / Subjects / Modules) */}
      {configModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
              <div>
                <h3 className="font-bold text-sm text-slate-900">{configModal.title}</h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  {configModal.user?.displayName || configModal.user?.name}
                </p>
              </div>
              <button
                onClick={() => setConfigModal({ isOpen: false, user: null, type: '', title: '', items: [], selected: [] })}
                className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto max-h-[50vh] space-y-2 text-xs">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1">
                <span>Select items ({configModal.selected.length} chosen)</span>
                <button
                  type="button"
                  onClick={() => {
                    const allSelected = configModal.selected.length === configModal.items.length;
                    setConfigModal(prev => ({
                      ...prev,
                      selected: allSelected ? [] : [...prev.items]
                    }));
                  }}
                  className="text-indigo-600 hover:underline font-bold"
                >
                  {configModal.selected.length === configModal.items.length ? 'Clear All' : 'Select All'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {configModal.items.map(item => {
                  const isChecked = configModal.selected.includes(item);
                  return (
                    <div
                      key={item}
                      onClick={() => toggleConfigItem(item)}
                      className={`p-2 rounded-lg border text-xs cursor-pointer flex items-center gap-2 transition-all select-none ${
                        isChecked
                          ? 'bg-indigo-50 border-indigo-400 text-indigo-900 font-bold'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="rounded text-indigo-600 focus:ring-indigo-500 pointer-events-none"
                      />
                      <span className="truncate">{item}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfigModal({ isOpen: false, user: null, type: '', title: '', items: [], selected: [] })}
                className="px-3 py-1.5 border border-slate-200 text-slate-700 rounded-md text-xs font-semibold hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveConfig}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-semibold shadow-2xs"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default ManageUsersPage;
