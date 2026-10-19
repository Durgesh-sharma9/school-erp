import React, { useState, useEffect, useMemo } from 'react';
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
  Filter
} from 'lucide-react';
import toast from 'react-hot-toast';

const ROLES = [
  { id: 'Teacher', label: 'Teacher', icon: GraduationCap, color: 'emerald', defaultDept: 'Academics' },
  { id: 'Staff', label: 'Office Staff', icon: Briefcase, color: 'blue', defaultDept: 'Accounts & Finance' },
  { id: 'Driver', label: 'Driver', icon: Bus, color: 'amber', defaultDept: 'Transport & Fleet' },
  { id: 'Admin', label: 'Admin', icon: Shield, color: 'purple', defaultDept: 'Administration' }
];

const COMMON_DEPARTMENTS = [
  'Academics',
  'Accounts & Finance',
  'Administration',
  'Transport & Fleet',
  'Library',
  'Front Office'
];

export function ManageUsersPage({ onNavigate, currentPath = '' }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleTab, setRoleTab] = useState(
    currentPath.includes('driver') ? 'Driver' : currentPath.includes('staff') ? 'Staff' : 'ALL'
  );
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'INACTIVE'
  const [selectedIds, setSelectedIds] = useState([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: 'Teacher',
    department: 'Academics',
    phone: '',
    email: '',
    // Teacher specific
    teachingSubject: '',
    assignedClass: '',
    // Driver specific
    driverLicense: '',
    vehicleAssigned: ''
  });

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

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (currentPath.includes('driver')) setRoleTab('Driver');
    else if (currentPath.includes('staff')) setRoleTab('Staff');
  }, [currentPath]);

  // Open Add Modal
  const handleOpenAdd = (presetRole = 'Teacher') => {
    setEditingId(null);
    setFormData({
      name: '',
      role: presetRole,
      department: presetRole === 'Teacher' ? 'Academics' : presetRole === 'Driver' ? 'Transport & Fleet' : presetRole === 'Admin' ? 'Administration' : 'Accounts & Finance',
      phone: '',
      email: '',
      teachingSubject: '',
      assignedClass: '',
      driverLicense: '',
      vehicleAssigned: ''
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (user) => {
    setEditingId(user.id);
    const resolvedRole = user.role === 'Accountant' ? 'Staff' : (user.role || 'Teacher');
    setFormData({
      name: user.displayName || user.name.replace(/^\[.*?\]\s*/, ''),
      role: resolvedRole,
      department: user.department || 'Academics',
      phone: user.phone || '',
      email: user.email || '',
      teachingSubject: (user.subjects && user.subjects.length > 0) ? user.subjects.join(', ') : '',
      assignedClass: (user.classes && user.classes.length > 0) ? user.classes.join(', ') : '',
      driverLicense: user.driverLicense || '',
      vehicleAssigned: user.vehicleAssigned || ''
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
      role: formData.role,
      department: formData.department,
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      driverLicense: formData.role === 'Driver' ? formData.driverLicense.trim() : '',
      vehicleAssigned: formData.role === 'Driver' ? formData.vehicleAssigned.trim() : '',
      classes: formData.role === 'Teacher' && formData.assignedClass ? formData.assignedClass.split(',').map(s => s.trim()).filter(Boolean) : [],
      subjects: formData.role === 'Teacher' && formData.teachingSubject ? formData.teachingSubject.split(',').map(s => s.trim()).filter(Boolean) : [],
      modules: formData.role === 'Driver' ? ['Transport'] : formData.role === 'Teacher' ? ['Student', 'Attendance', 'Academics'] : ['Fee', 'Payroll', 'Front Office']
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
    const headers = ['Code', 'Name', 'Role', 'Department', 'Phone', 'Email', 'Status', 'Details'];
    const rows = filteredUsers.map(u => [
      `"${u.empCode || ''}"`,
      `"${u.displayName || u.name || ''}"`,
      `"${u.role || ''}"`,
      `"${u.department || ''}"`,
      `"${u.phone || ''}"`,
      `"${u.email || ''}"`,
      `"${u.isActive ? 'Active' : 'Inactive'}"`,
      `"${u.role === 'Driver' ? `${u.driverLicense || ''} - ${u.vehicleAssigned || ''}` : (u.subjects || []).join(' / ')}"`
    ]);
    const csv = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csv);
    link.download = `Staff_Directory_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Downloaded CSV');
  };

  // Filtered List
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      // Role Filter
      if (roleTab === 'Teacher' && u.role !== 'Teacher') return false;
      if (roleTab === 'Staff' && u.role !== 'Staff' && u.role !== 'Accountant') return false;
      if (roleTab === 'Driver' && u.role !== 'Driver') return false;
      if (roleTab === 'Admin' && u.role !== 'Admin') return false;

      // Status Filter
      if (statusFilter === 'ACTIVE' && !u.isActive) return false;
      if (statusFilter === 'INACTIVE' && u.isActive) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const str = `${u.name || ''} ${u.displayName || ''} ${u.phone || ''} ${u.email || ''} ${u.role || ''} ${u.department || ''} ${u.driverLicense || ''} ${u.vehicleAssigned || ''}`.toLowerCase();
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
  const teachersCount = users.filter(u => u.role === 'Teacher').length;
  const staffCount = users.filter(u => u.role === 'Staff' || u.role === 'Accountant').length;
  const driversCount = users.filter(u => u.role === 'Driver').length;
  const adminCount = users.filter(u => u.role === 'Admin').length;

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
            onClick={() => handleOpenAdd(roleTab !== 'ALL' ? roleTab : 'Teacher')}
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

      {/* 2. Simple Role Tabs & Search Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
        {/* Role Tabs */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: 'ALL', label: 'All Staff', count: totalCount },
              { id: 'Teacher', label: 'Teachers', count: teachersCount },
              { id: 'Staff', label: 'Office Staff', count: staffCount },
              { id: 'Driver', label: 'Drivers', count: driversCount },
              { id: 'Admin', label: 'Admins', count: adminCount }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setRoleTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  roleTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-slate-50 text-slate-600 border border-slate-200/80 hover:bg-slate-100'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  roleTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active Only</option>
              <option value="INACTIVE">Inactive Only</option>
            </select>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, phone, department, bus no..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-8 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-slate-50/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Bulk Action Bar (When selected) */}
        {selectedIds.length > 0 && (
          <div className="p-2 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center justify-between text-xs">
            <span className="font-semibold text-indigo-900">
              {selectedIds.length} staff selected
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleBulkAction('activate')}
                className="px-2 py-1 bg-white text-emerald-700 border border-emerald-300 font-semibold rounded text-xs hover:bg-emerald-50"
              >
                Mark Active
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                className="px-2 py-1 bg-white text-amber-700 border border-amber-300 font-semibold rounded text-xs hover:bg-amber-50"
              >
                Mark Inactive
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-2 py-1 bg-white text-rose-700 border border-rose-300 font-semibold rounded text-xs hover:bg-rose-50"
              >
                Delete Selected
              </button>
              <button
                onClick={() => setSelectedIds([])}
                className="text-slate-500 underline ml-2"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Simple & Clean Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
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
                <th className="py-3 px-3">ROLE</th>
                <th className="py-3 px-3">DEPARTMENT</th>
                <th className="py-3 px-3">DETAILS / ASSIGNMENT</th>
                <th className="py-3 px-3 text-center">STATUS</th>
                <th className="py-3 px-3 text-center w-24">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    Loading staff...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
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

                      {/* Role Badge */}
                      <td className="py-3 px-3">
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
                      </td>

                      {/* Department */}
                      <td className="py-3 px-3 font-semibold text-slate-700">
                        {user.department || (isDriver ? 'Transport' : 'Academics')}
                      </td>

                      {/* Details / Assignment (Simple & Clean!) */}
                      <td className="py-3 px-3">
                        {isDriver ? (
                          <div className="space-y-0.5">
                            {user.driverLicense ? (
                              <div className="font-mono text-xs font-semibold text-slate-800">
                                Lic: {user.driverLicense}
                              </div>
                            ) : (
                              <div className="text-xs text-slate-500 font-medium">
                                Transport Staff
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
                            {user.designation || 'Administrative Duties'}
                          </div>
                        )}
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
                            title="Edit"
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

      {/* 4. Simple, Fast, 1-Page Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
              <h3 className="font-bold text-sm text-slate-900">
                {editingId ? 'Edit Staff Member' : 'Add New Staff Member'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simple Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              {/* Role Selection (Simple 4 Buttons!) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Role <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-4 gap-1.5">
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
                          department: r.defaultDept
                        })}
                        className={`p-2 rounded-lg border text-center transition-all ${
                          isSelected
                            ? 'bg-indigo-600 text-white font-bold border-indigo-600 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 font-medium'
                        }`}
                      >
                        <IconComp className="w-4 h-4 mx-auto mb-1" />
                        <span className="text-[11px] block">{r.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9829012345"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. staff@school.edu"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              {/* Department */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Department
                </label>
                <select
                  value={formData.department}
                  onChange={e => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:ring-2 focus:ring-indigo-500/20"
                >
                  {COMMON_DEPARTMENTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* If Teacher: Subject & Class */}
              {formData.role === 'Teacher' && (
                <div className="grid grid-cols-2 gap-3 p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Teaching Subject
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mathematics"
                      value={formData.teachingSubject}
                      onChange={e => setFormData({ ...formData, teachingSubject: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-emerald-200 rounded-lg text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Assigned Class
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Class I-A, II-B"
                      value={formData.assignedClass}
                      onChange={e => setFormData({ ...formData, assignedClass: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-emerald-200 rounded-lg text-xs bg-white"
                    />
                  </div>
                </div>
              )}

              {/* If Driver: License No only (Bus assignment is in Transport module) */}
              {formData.role === 'Driver' && (
                <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl space-y-1.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Driving License No. <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. DL-1420110012345"
                      value={formData.driverLicense}
                      onChange={e => setFormData({ ...formData, driverLicense: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-amber-200 rounded-lg text-xs bg-white font-mono uppercase focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>
                  <p className="text-[10px] text-amber-800/80">
                    ℹ️ Bus & Route assignment Transport module se manage kiya jayega.
                  </p>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  {editingId ? 'Save Changes' : 'Add Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export default ManageUsersPage;
