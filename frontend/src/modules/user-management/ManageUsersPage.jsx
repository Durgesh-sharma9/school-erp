import React, { useState, useEffect } from 'react';
import {
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
  CheckSquare,
  Square
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

export function ManageUsersPage({ onNavigate }) {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  // Add User Form
  const [staffName, setStaffName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Permission Configuration Modal
  const [configModal, setConfigModal] = useState({
    isOpen: false,
    user: null,
    type: '', // 'modules', 'classes', 'subjects', 'examNames', 'bulkEditingColumns'
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

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!staffName.trim()) {
      toast.error('Please enter staff name');
      return;
    }
    try {
      const res = await fetch('/api/user-management/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffName, mobileNo, email, password })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message || 'User created successfully');
        setIsAddUserOpen(false);
        setStaffName('');
        setMobileNo('');
        setEmail('');
        setPassword('');
        fetchUsers();
      } else {
        toast.error(data.message || 'Failed to create user');
      }
    } catch {
      toast.error('Network error');
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
        toast.success(`Permission updated for ${user.name}`);
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

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await fetch(`/api/user-management/users/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('User removed');
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

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.phone.includes(searchQuery) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 bg-slate-50 min-h-screen text-slate-800">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 bg-white p-3 rounded-lg shadow-sm border border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-indigo-600" />
            Manage Users
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span
              className="flex items-center gap-1 hover:text-indigo-600 cursor-pointer"
              onClick={() => onNavigate && onNavigate('/')}
            >
              <Home className="w-3.5 h-3.5" /> User Privilege
            </span>
            <span>/</span>
            <span className="text-indigo-600 font-semibold">Manage Users</span>
          </div>
        </div>

        {/* Action Toolbar matching UAB Mini FABs */}
        <div className="flex items-center gap-2 mt-3 md:mt-0">
          <button
            onClick={() => setIsAddUserOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold shadow-sm transition-all"
            title="Add User"
          >
            <UserPlus className="w-4 h-4" /> Add User
          </button>
          <button
            onClick={() => onNavigate && onNavigate('/user-privilege-report')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-800 text-white rounded text-xs font-semibold shadow-sm transition-all"
            title="View User Privilege Report"
          >
            <FileText className="w-4 h-4" /> View Report
          </button>
        </div>
      </div>

      {/* Mandatory Note Banner matching UAB 1:1 */}
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs font-bold flex items-center gap-2 mb-4">
        <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
        <span>NOTE: CLASS and MODULE are Compulsary while adding user.</span>
      </div>

      {/* Search Bar Row */}
      <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2" />
          <input
            type="text"
            placeholder="Search by staff name, emp code, phone, email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Total Users: <strong className="text-indigo-600">{filteredUsers.length}</strong>
        </div>
      </div>

      {/* Main Table matching UAB columns */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-2 w-8 text-center">✓</th>
                <th className="py-2.5 px-2 w-10 text-center">PIC</th>
                <th className="py-2.5 px-3">EMP NAME</th>
                <th className="py-2.5 px-3 text-center">*MODULE</th>
                <th className="py-2.5 px-3 text-center">*CLASS</th>
                <th className="py-2.5 px-3 text-center">SUBJECT</th>
                <th className="py-2.5 px-3 text-center">EXAM NAME</th>
                <th className="py-2.5 px-3 text-center">BULK EDITING COLUMN</th>
                <th className="py-2.5 px-2 text-center w-12">ADD</th>
                <th className="py-2.5 px-2 text-center w-12">VIEW</th>
                <th className="py-2.5 px-2 text-center w-12">MODIFY</th>
                <th className="py-2.5 px-2 text-center w-12">DELETE</th>
                <th className="py-2.5 px-2 text-center w-12">ACTIVE</th>
                <th className="py-2.5 px-2 text-center w-10">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="14" className="py-8 text-center text-slate-400">
                    No users found matching search criteria
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    {/* Checkbox */}
                    <td className="py-2 px-2 text-center">
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
                    <td className="py-2 px-2 text-center">
                      <img
                        src={user.pic}
                        alt="Avatar"
                        className="w-7 h-7 rounded-full object-cover mx-auto border border-slate-200"
                      />
                    </td>

                    {/* EMP NAME */}
                    <td className="py-2 px-3">
                      <div className="font-bold text-slate-800">{user.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{user.phone}</div>
                    </td>

                    {/* *MODULE button */}
                    <td className="py-2 px-3 text-center">
                      <button
                        onClick={() => openConfigModal(user, 'modules')}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold border transition-all ${
                          user.modules && user.modules.length > 0
                            ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                            : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                        }`}
                        title="Configure Module Permissions"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>{user.modules ? user.modules.length : 0} Mod</span>
                      </button>
                    </td>

                    {/* *CLASS button */}
                    <td className="py-2 px-3 text-center">
                      <button
                        onClick={() => openConfigModal(user, 'classes')}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold border transition-all ${
                          user.classes && user.classes.length > 0
                            ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                            : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                        }`}
                        title="Configure Class Permissions"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>{user.classes ? user.classes.length : 0} Cls</span>
                      </button>
                    </td>

                    {/* SUBJECT button */}
                    <td className="py-2 px-3 text-center">
                      <button
                        onClick={() => openConfigModal(user, 'subjects')}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold border transition-all ${
                          user.subjects && user.subjects.length > 0
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                        }`}
                        title="Configure Subject Permissions"
                      >
                        <Plus className="w-3 h-3" />
                        <span>{user.subjects ? user.subjects.length : 0} Sub</span>
                      </button>
                    </td>

                    {/* EXAM NAME button */}
                    <td className="py-2 px-3 text-center">
                      <button
                        onClick={() => openConfigModal(user, 'examNames')}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold border transition-all ${
                          user.examNames && user.examNames.length > 0
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                        }`}
                        title="Configure Exam Permissions"
                      >
                        <Plus className="w-3 h-3" />
                        <span>{user.examNames ? user.examNames.length : 0} Exm</span>
                      </button>
                    </td>

                    {/* BULK EDITING COLUMN button */}
                    <td className="py-2 px-3 text-center">
                      <button
                        onClick={() => openConfigModal(user, 'bulkEditingColumns')}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold border transition-all ${
                          user.bulkEditingColumns && user.bulkEditingColumns.length > 0
                            ? 'bg-purple-50 text-purple-800 border-purple-300 hover:bg-purple-100'
                            : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                        }`}
                        title="Configure Allowed Bulk Editing Columns"
                      >
                        <Plus className="w-3 h-3" />
                        <span>{user.bulkEditingColumns ? user.bulkEditingColumns.length : 0} Col</span>
                      </button>
                    </td>

                    {/* ADD Checkbox */}
                    <td className="py-2 px-2 text-center">
                      <input
                        type="checkbox"
                        checked={user.isAdd}
                        onChange={() => togglePermission(user, 'isAdd')}
                        className="rounded text-rose-600 focus:ring-rose-500"
                      />
                    </td>

                    {/* VIEW Checkbox */}
                    <td className="py-2 px-2 text-center">
                      <input
                        type="checkbox"
                        checked={user.isView}
                        onChange={() => togglePermission(user, 'isView')}
                        className="rounded text-rose-600 focus:ring-rose-500"
                      />
                    </td>

                    {/* MODIFY Checkbox */}
                    <td className="py-2 px-2 text-center">
                      <input
                        type="checkbox"
                        checked={user.isModify}
                        onChange={() => togglePermission(user, 'isModify')}
                        className="rounded text-rose-600 focus:ring-rose-500"
                      />
                    </td>

                    {/* DELETE Checkbox */}
                    <td className="py-2 px-2 text-center">
                      <input
                        type="checkbox"
                        checked={user.isDelete}
                        onChange={() => togglePermission(user, 'isDelete')}
                        className="rounded text-rose-600 focus:ring-rose-500"
                      />
                    </td>

                    {/* ACTIVE Toggle */}
                    <td className="py-2 px-2 text-center">
                      <input
                        type="checkbox"
                        checked={user.isActive}
                        onChange={() => toggleActiveStatus(user)}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                    </td>

                    {/* ACTION */}
                    <td className="py-2 px-2 text-center">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        title="Delete User"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 1: Add User Permission (USER PERMISSION matching UAB) */}
      {isAddUserOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                USER PERMISSION
              </h2>
              <button
                onClick={() => setIsAddUserOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Select Staff</label>
                <input
                  type="text"
                  placeholder="Enter staff name e.g. RAKESH JOSHI"
                  value={staffName}
                  onChange={e => setStaffName(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Mobile No.</label>
                <input
                  type="tel"
                  placeholder="10 digit mobile number"
                  value={mobileNo}
                  onChange={e => setMobileNo(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="staff@jdintl.edu"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
                <input
                  type="password"
                  placeholder="Login password for staff portal"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-4 py-1.5 border border-slate-300 rounded text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold shadow-sm transition-colors"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Multi-select Permission Picker (Modules, Classes, Subjects, Exams, Columns) */}
      {configModal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-800">
                  {configModal.title}
                </h2>
                <div className="text-xs text-slate-500 font-semibold mt-0.5">
                  User: {configModal.user?.name}
                </div>
              </div>
              <button
                onClick={() => setConfigModal({ isOpen: false, user: null, type: '', title: '', items: [], selected: [] })}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 max-h-[60vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 text-xs">
                <span className="font-semibold text-slate-600">
                  Selected: {configModal.selected.length} of {configModal.items.length}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const allSelected = configModal.selected.length === configModal.items.length;
                    setConfigModal(prev => ({
                      ...prev,
                      selected: allSelected ? [] : [...prev.items]
                    }));
                  }}
                  className="text-indigo-600 hover:text-indigo-800 font-bold"
                >
                  {configModal.selected.length === configModal.items.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {configModal.items.map(item => {
                  const isChecked = configModal.selected.includes(item);
                  return (
                    <div
                      key={item}
                      onClick={() => toggleConfigItem(item)}
                      className={`p-2 rounded border cursor-pointer text-xs flex items-center gap-2 transition-colors ${
                        isChecked
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-semibold'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>{item}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setConfigModal({ isOpen: false, user: null, type: '', title: '', items: [], selected: [] })}
                className="px-4 py-1.5 border border-slate-300 rounded text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={saveConfig}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold shadow-sm"
              >
                Save Privileges
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default ManageUsersPage;
