import React, { useState, useEffect } from 'react';
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
  Filter
} from 'lucide-react';
import toast from 'react-hot-toast';

const ALL_MODULES = [
  'Dashboard', 'Student', 'Academics', 'Fee', 'Transport', 'Hostel',
  'Examination', 'Payroll', 'Front Office', 'Library', 'Stationary', 'SMS'
];

const ALL_CLASSES = [
  'Nursery', 'LKG', 'UKG', 'I - A', 'I - B', 'II - A', 'II - B', 'III - A',
  'IV - A', 'V - A', 'VI - A', 'VII - A', 'VIII - A', 'IX - A', 'X - A',
  'XI - SCI', 'XII - SCI'
];

const ALL_SUBJECTS = [
  'English', 'Hindi', 'Mathematics', 'Science', 'Social Science',
  'Physics', 'Chemistry', 'Biology', 'Computer Science', 'EVS', 'General Knowledge'
];

const ALL_EXAMS = [
  'Term 1 (Half Yearly)', 'Term 2 (Annual)', 'Unit Test 1', 'Unit Test 2', 'Pre Board'
];

const ALL_BULK_COLUMNS = [
  'Father Name', 'Mother Name', 'Mobile No.', 'Address', 'DOB',
  'Gender', 'Blood Group', 'Aadhaar No', 'Roll No', 'Fee Category'
];

const ROLE_OPTIONS = [
  { value: 'Staff', label: 'Office / Admin Staff', icon: Briefcase, color: 'blue' },
  { value: 'Teacher', label: 'Teacher / Faculty', icon: GraduationCap, color: 'emerald' },
  { value: 'Driver', label: 'Driver / Transport Staff', icon: Bus, color: 'amber' },
  { value: 'Admin', label: 'System Admin / Principal', icon: Shield, color: 'purple' },
  { value: 'Accountant', label: 'Accountant / Cashier', icon: Award, color: 'indigo' },
  { value: 'Support', label: 'Security / Peon / Helper', icon: Users, color: 'slate' }
];

export function ManageUsersPage({ onNavigate }) {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'TEACHER' | 'STAFF' | 'DRIVER' | 'ADMIN'
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Add / Edit User Form State
  const [formData, setFormData] = useState({
    staffName: '',
    role: 'Staff',
    department: 'Administration',
    mobileNo: '',
    email: '',
    password: '',
    driverLicense: '',
    vehicleAssigned: '',
    division: 'Primary',
    modules: ['Student', 'Attendance']
  });

  // Permission Configuration Modal
  const [configModal, setConfigModal] = useState({
    isOpen: false,
    user: null,
    type: '',
    title: '',
    items: [],
    selected: []
  });

  const fetchUsers = () => {
    fetch('/api/user-management/users')
      .then(res => res.json())
      .then(d => {
        if (d.success) setUsers(d.data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenAddModal = (presetRole = 'Staff') => {
    setFormData({
      staffName: '',
      role: presetRole,
      department: presetRole === 'Driver' ? 'Transport' : presetRole === 'Teacher' ? 'Academics' : 'Administration',
      mobileNo: '',
      email: '',
      password: '',
      driverLicense: '',
      vehicleAssigned: '',
      division: presetRole === 'Driver' ? 'Transport' : 'Primary',
      modules: presetRole === 'Driver' ? ['Transport'] : ['Student', 'Attendance']
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
      password: '',
      driverLicense: user.driverLicense || '',
      vehicleAssigned: user.vehicleAssigned || '',
      division: user.division || 'Primary',
      modules: user.modules || []
    });
    setIsAddUserOpen(true);
  };

  const handleSubmitUser = async (e) => {
    e.preventDefault();
    if (!formData.staffName.trim()) {
      toast.error('Please enter user / staff name');
      return;
    }
    if (!formData.mobileNo.trim()) {
      toast.error('Please enter mobile number');
      return;
    }

    try {
      if (editingUser) {
        // Update User
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
            vehicleAssigned: formData.vehicleAssigned
          })
        });
        const data = await res.json();
        if (data.success) {
          toast.success(data.message || 'User updated successfully');
          setIsAddUserOpen(false);
          setEditingUser(null);
          fetchUsers();
        } else {
          toast.error(data.message || 'Failed to update user');
        }
      } else {
        // Create New User
        const res = await fetch('/api/user-management/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const data = await res.json();
        if (data.success) {
          toast.success(data.message || 'User created successfully');
          setIsAddUserOpen(false);
          fetchUsers();
        } else {
          toast.error(data.message || 'Failed to create user');
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
        toast.success(data.message);
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
        fetchUsers();
      }
    } catch {
      toast.error('Failed to delete user');
    }
  };

  const openConfigModal = (user, type) => {
    let title = '';
    let items = [];
    if (type === 'modules') {
      title = 'Assign Modules';
      items = ALL_MODULES;
    } else if (type === 'classes') {
      title = 'Assign Classes';
      items = ALL_CLASSES;
    } else if (type === 'subjects') {
      title = 'Assign Subjects';
      items = ALL_SUBJECTS;
    } else if (type === 'examNames') {
      title = 'Assign Exam Names';
      items = ALL_EXAMS;
    } else if (type === 'bulkEditingColumns') {
      title = 'Assign Bulk Editing Columns';
      items = ALL_BULK_COLUMNS;
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
        toast.success(`${configModal.title} saved`);
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

  // Filter users by Active Tab & Search Query
  const filteredUsers = users.filter(u => {
    // Tab filter
    if (activeTab === 'TEACHER' && u.role !== 'Teacher') return false;
    if (activeTab === 'STAFF' && u.role !== 'Staff' && u.role !== 'Accountant') return false;
    if (activeTab === 'DRIVER' && u.role !== 'Driver') return false;
    if (activeTab === 'ADMIN' && u.role !== 'Admin') return false;

    // Search query filter
    const query = searchQuery.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(query)) ||
      (u.displayName && u.displayName.toLowerCase().includes(query)) ||
      (u.phone && u.phone.includes(query)) ||
      (u.email && u.email.toLowerCase().includes(query)) ||
      (u.role && u.role.toLowerCase().includes(query)) ||
      (u.department && u.department.toLowerCase().includes(query)) ||
      (u.driverLicense && u.driverLicense.toLowerCase().includes(query)) ||
      (u.vehicleAssigned && u.vehicleAssigned.toLowerCase().includes(query))
    );
  });

  // KPI Metrics
  const totalCount = users.length;
  const teachersCount = users.filter(u => u.role === 'Teacher').length;
  const staffCount = users.filter(u => u.role === 'Staff' || u.role === 'Accountant').length;
  const driversCount = users.filter(u => u.role === 'Driver').length;
  const activeCount = users.filter(u => u.isActive).length;

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen text-slate-800 space-y-4">
      {/* Top Header Card */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white p-4 rounded-xl shadow-xs border border-slate-200/80 gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200/80 text-indigo-600 flex items-center justify-center shadow-2xs">
              <Users className="w-5 h-5" />
            </div>
            Users & Staff Directory
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span
              className="flex items-center gap-1 hover:text-indigo-600 cursor-pointer"
              onClick={() => onNavigate && onNavigate('/')}
            >
              <Home className="w-3.5 h-3.5" /> Dashboard
            </span>
            <span>/</span>
            <span className="text-indigo-600 font-semibold">User Management</span>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleOpenAddModal('Staff')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-all active:scale-95"
          >
            <UserPlus className="w-4 h-4" /> Add User / Staff
          </button>
          <button
            onClick={() => handleOpenAddModal('Driver')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold shadow-xs transition-all active:scale-95"
          >
            <Bus className="w-4 h-4" /> Add Driver
          </button>
          <button
            onClick={() => onNavigate && onNavigate('/user-privilege-report')}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200/80 transition-all"
          >
            <FileText className="w-4 h-4 text-slate-500" /> Privilege Report
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          onClick={() => setActiveTab('ALL')}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            activeTab === 'ALL'
              ? 'bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
              : 'bg-white border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Users</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">{activeCount} active in system</div>
        </div>

        <div
          onClick={() => setActiveTab('TEACHER')}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            activeTab === 'TEACHER'
              ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500/20 shadow-xs'
              : 'bg-white border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
            <GraduationCap className="w-3.5 h-3.5" /> Teachers / Faculty
          </div>
          <div className="text-2xl font-black text-emerald-950 mt-1">{teachersCount}</div>
          <div className="text-[11px] text-emerald-700 mt-0.5">Academic staff</div>
        </div>

        <div
          onClick={() => setActiveTab('STAFF')}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            activeTab === 'STAFF'
              ? 'bg-blue-50/70 border-blue-300 ring-2 ring-blue-500/20 shadow-xs'
              : 'bg-white border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5" /> Office & Admin
          </div>
          <div className="text-2xl font-black text-blue-950 mt-1">{staffCount}</div>
          <div className="text-[11px] text-blue-700 mt-0.5">Admin & Accounts</div>
        </div>

        <div
          onClick={() => setActiveTab('DRIVER')}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            activeTab === 'DRIVER'
              ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-500/20 shadow-xs'
              : 'bg-white border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider flex items-center gap-1">
            <Bus className="w-3.5 h-3.5" /> Drivers & Fleet
          </div>
          <div className="text-2xl font-black text-amber-950 mt-1">{driversCount}</div>
          <div className="text-[11px] text-amber-700 mt-0.5">Transport staff</div>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="bg-white p-3.5 rounded-xl shadow-xs border border-slate-200/80 space-y-3">
        {/* Role Tabs */}
        <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2.5 overflow-x-auto text-xs">
          {[
            { id: 'ALL', label: 'All Users', count: totalCount },
            { id: 'TEACHER', label: 'Teachers', count: teachersCount },
            { id: 'STAFF', label: 'Staff & Accounts', count: staffCount },
            { id: 'DRIVER', label: 'Drivers', count: driversCount },
            { id: 'ADMIN', label: 'Admins', count: users.filter(u => u.role === 'Admin').length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Results counter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by name, role, phone, license, vehicle..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
            />
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-indigo-600">{filteredUsers.length}</strong> of {totalCount} users
          </div>
        </div>
      </div>

      {/* Main Directory Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3 w-8 text-center">✓</th>
                <th className="py-3 px-2 w-10 text-center">PIC</th>
                <th className="py-3 px-3">USER / STAFF</th>
                <th className="py-3 px-3 text-center">ROLE</th>
                <th className="py-3 px-3">DEPARTMENT / DETAILS</th>
                <th className="py-3 px-3 text-center">*MODULES</th>
                <th className="py-3 px-3 text-center">*CLASSES</th>
                <th className="py-3 px-3 text-center">SUBJECT</th>
                <th className="py-3 px-2 text-center w-12">ADD</th>
                <th className="py-3 px-2 text-center w-12">VIEW</th>
                <th className="py-3 px-2 text-center w-12">MODIFY</th>
                <th className="py-3 px-2 text-center w-12">STATUS</th>
                <th className="py-3 px-3 text-center w-24">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="13" className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => {
                  const isDriver = user.role === 'Driver';
                  return (
                    <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Checkbox */}
                      <td className="py-2.5 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={selectedUserIds.includes(user.id)}
                          onChange={() => {
                            setSelectedUserIds(prev =>
                              prev.includes(user.id) ? prev.filter(i => i !== user.id) : [...prev, user.id]
                            );
                          }}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                      </td>

                      {/* PIC */}
                      <td className="py-2.5 px-2 text-center">
                        <img
                          src={user.pic}
                          alt="Avatar"
                          className="w-8 h-8 rounded-full object-cover mx-auto border border-slate-200 shadow-2xs"
                        />
                      </td>

                      {/* USER / STAFF NAME */}
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-900">{user.displayName || user.name}</div>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                          <span className="flex items-center gap-1 font-mono">
                            <Phone className="w-3 h-3 text-slate-400" /> {user.phone}
                          </span>
                          {user.email && (
                            <span className="hidden sm:inline-block text-slate-400 truncate max-w-[130px]">
                              • {user.email}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* ROLE BADGE */}
                      <td className="py-2.5 px-3 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          user.role === 'Teacher'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : user.role === 'Driver'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : user.role === 'Admin'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : user.role === 'Accountant'
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          {isDriver && <Bus className="w-3 h-3" />}
                          {user.role || 'Staff'}
                        </span>
                      </td>

                      {/* DEPARTMENT / DRIVER SPECIFIC DETAILS */}
                      <td className="py-2.5 px-3">
                        {isDriver ? (
                          <div className="space-y-0.5">
                            <div className="text-[11px] font-mono text-slate-700 font-semibold">
                              Lic: {user.driverLicense || 'Not Added'}
                            </div>
                            <div className="text-[10px] text-indigo-600 truncate max-w-[180px]">
                              {user.vehicleAssigned ? `🚌 ${user.vehicleAssigned}` : 'No Bus Assigned'}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <span className="font-semibold text-slate-700">{user.department || 'Academics'}</span>
                            <span className="text-[10px] text-slate-400 block">{user.division || 'Primary'}</span>
                          </div>
                        )}
                      </td>

                      {/* *MODULE button */}
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => openConfigModal(user, 'modules')}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-all ${
                            user.modules && user.modules.length > 0
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                              : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                          }`}
                          title="Configure Module Permissions"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>{user.modules ? user.modules.length : 0} Mod</span>
                        </button>
                      </td>

                      {/* *CLASS button */}
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => openConfigModal(user, 'classes')}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-all ${
                            user.classes && user.classes.length > 0
                              ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                              : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                          }`}
                          title="Configure Class Permissions"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>{user.classes ? user.classes.length : 0} Cls</span>
                        </button>
                      </td>

                      {/* SUBJECT button */}
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => openConfigModal(user, 'subjects')}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-all ${
                            user.subjects && user.subjects.length > 0
                              ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                              : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                          }`}
                          title="Configure Subject Permissions"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>{user.subjects ? user.subjects.length : 0} Sub</span>
                        </button>
                      </td>

                      {/* ADD Permission Toggle */}
                      <td className="py-2.5 px-2 text-center">
                        <button
                          onClick={() => togglePermission(user, 'isAdd')}
                          className={`p-1 rounded transition-colors ${
                            user.isAdd ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' : 'text-slate-300 hover:bg-slate-100'
                          }`}
                          title="Toggle Add Permission"
                        >
                          {user.isAdd ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                        </button>
                      </td>

                      {/* VIEW Permission Toggle */}
                      <td className="py-2.5 px-2 text-center">
                        <button
                          onClick={() => togglePermission(user, 'isView')}
                          className={`p-1 rounded transition-colors ${
                            user.isView ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' : 'text-slate-300 hover:bg-slate-100'
                          }`}
                          title="Toggle View Permission"
                        >
                          {user.isView ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                        </button>
                      </td>

                      {/* MODIFY Permission Toggle */}
                      <td className="py-2.5 px-2 text-center">
                        <button
                          onClick={() => togglePermission(user, 'isModify')}
                          className={`p-1 rounded transition-colors ${
                            user.isModify ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' : 'text-slate-300 hover:bg-slate-100'
                          }`}
                          title="Toggle Modify Permission"
                        >
                          {user.isModify ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                        </button>
                      </td>

                      {/* ACTIVE / INACTIVE TOGGLE */}
                      <td className="py-2.5 px-2 text-center">
                        <button
                          onClick={() => toggleActiveStatus(user)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase transition-colors ${
                            user.isActive
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                          }`}
                          title="Click to toggle status"
                        >
                          {user.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>

                      {/* ACTIONS */}
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(user)}
                            className="p-1.5 rounded-md text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            title="Edit User Info"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id, user.displayName || user.name)}
                            className="p-1.5 rounded-md text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
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

      {/* ADD / EDIT USER MODAL */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center font-bold">
                  {formData.role === 'Driver' ? <Bus className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    {editingUser ? 'Edit User Details' : 'Add New System User'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Staff, teachers, drivers, and campus administration
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddUserOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSubmitUser} className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
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
                            department: opt.value === 'Driver' ? 'Transport' : opt.value === 'Teacher' ? 'Academics' : formData.department,
                            division: opt.value === 'Driver' ? 'Transport' : formData.division
                          });
                        }}
                        className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                          isSelected
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold ring-1 ring-indigo-500'
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar / Shaitan Singh"
                  value={formData.staffName}
                  onChange={e => setFormData({ ...formData, staffName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. user@school.edu"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Driver Specific Fields (if role === Driver) */}
              {formData.role === 'Driver' && (
                <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900 text-xs">
                    <Bus className="w-3.5 h-3.5 text-amber-600" />
                    <span>Driver & Vehicle Allocation</span>
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
                        Assigned Vehicle / Bus No.
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. RJ02PA2762 (Bus 1)"
                        value={formData.vehicleAssigned}
                        onChange={e => setFormData({ ...formData, vehicleAssigned: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-amber-200 rounded-lg text-xs bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Department & Division */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department
                  </label>
                  <select
                    value={formData.department}
                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="Academics">Academics (Teaching)</option>
                    <option value="Administration">Administration</option>
                    <option value="Transport">Transport & Fleet</option>
                    <option value="Accounts">Accounts & Finance</option>
                    <option value="Library">Library</option>
                    <option value="Front Office">Front Office</option>
                    <option value="Support">Campus Support</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
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
                    <option value="Transport">Transport</option>
                    <option value="All">All Divisions</option>
                  </select>
                </div>
              </div>

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

      {/* PERMISSION CONFIGURATION MODAL */}
      {configModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
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
                          ? 'bg-indigo-50 border-indigo-400 text-indigo-900 font-semibold'
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
