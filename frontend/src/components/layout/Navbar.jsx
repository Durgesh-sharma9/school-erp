import React from 'react';
import { Menu, Bell, Megaphone, Settings, RefreshCw, LogOut, Building2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export function Navbar({
  session = "2026-2027",
  onToggleSidebar,
  onNavigate
}) {
  const { user, role, schoolId, schoolName, switchRole, switchSchool, AVAILABLE_SCHOOLS, logout } = useAuth();

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    switchRole(newRole);
    toast.success(`Switched role to ${newRole}`);
  };

  const handleSchoolChange = (e) => {
    const targetSchoolId = e.target.value;
    switchSchool(targetSchoolId);
    const target = AVAILABLE_SCHOOLS.find(s => s.id === targetSchoolId);
    toast.success(`Switched active tenant to: ${target ? target.name : 'SuperAdmin HQ'}`, { icon: '🏢' });
  };

  const handleLogout = () => {
    logout();
    if (onNavigate) onNavigate('/login');
    toast.success('Logged out successfully');
  };

  const isSchoolB = schoolId === 'sch_dps_branch2';

  return (
    <header className="h-14 bg-slate-50 border-b border-slate-200 px-3 flex items-center justify-between shrink-0 sticky top-0 z-30 shadow-xs">
      {/* Left: School Logo + Hamburger + Name & Session */}
      <div className="flex items-center space-x-2">
        {/* Dynamic School Logo */}
        {isSchoolB ? (
          <div className="w-8 h-8 rounded-md bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            DPS
          </div>
        ) : (
          <img
            src="https://temp.erichost.app/assets/schools/jdisjr_221/school/1_school_photo_1766831297_f7516d5fc58b9af84fb1.jpg"
            alt="School Logo"
            className="w-8 h-8 object-contain rounded-sm"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        )}

        {/* Hamburger Menu Toggle */}
        <button
          onClick={onToggleSidebar}
          className="p-1 rounded text-slate-700 hover:bg-slate-200/60 transition-colors"
          title="Toggle Navigation"
        >
          <Menu className="w-5 h-5 text-slate-700" />
        </button>

        {/* Title & Orange Session Tag */}
        <div className="ml-1">
          <div className="flex items-center space-x-1.5">
            <h1 className="font-semibold text-xs sm:text-sm md:text-base text-gray-800 leading-tight truncate max-w-[200px] sm:max-w-[320px]">
              {schoolName}
            </h1>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider ${
              isSchoolB ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {schoolId === 'sch_dps_branch2' ? 'School B' : schoolId === 'sch_jd_intl' ? 'School A' : 'HQ'}
            </span>
          </div>
          <p className="text-[11px] font-semibold text-orange-600 leading-none">
            {session} &bull; <span className="text-slate-400 font-normal">Tenant Sandbox Active</span>
          </p>
        </div>
      </div>

      {/* Right: Tenant Switcher + Role Selector + User Profile Chip */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Instant Multi-Tenant Switcher (School A vs School B) */}
        <div className="flex items-center bg-white border border-slate-200 rounded-lg px-2 py-1 shadow-2xs">
          <Building2 className="w-3.5 h-3.5 text-indigo-600 mr-1.5 shrink-0" />
          <span className="text-[10px] font-bold text-slate-400 uppercase mr-1 hidden md:inline">Tenant:</span>
          <select
            value={schoolId || 'superadmin'}
            onChange={handleSchoolChange}
            className="text-xs font-bold text-slate-800 bg-transparent focus:outline-hidden cursor-pointer"
            title="Switch between School Tenants"
          >
            {AVAILABLE_SCHOOLS && AVAILABLE_SCHOOLS.map((sch) => (
              <option key={sch.id} value={sch.id}>
                🏫 {sch.name}
              </option>
            ))}
            <option value="superadmin">👑 SuperAdmin HQ</option>
          </select>
        </div>

        {/* Quick Role Switcher Selector */}
        <div className="hidden sm:flex items-center bg-white border border-slate-200 rounded-lg px-2 py-1 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase mr-1.5">Role:</span>
          <select
            value={role}
            onChange={handleRoleChange}
            className="text-xs font-bold text-slate-800 bg-transparent focus:outline-hidden cursor-pointer"
          >
            <option value="SUPER_ADMIN">👑 SuperAdmin</option>
            <option value="ADMIN">🛡️ Admin</option>
            <option value="STAFF">👩‍🏫 Staff</option>
            <option value="STUDENT">🎓 Student</option>
          </select>
        </div>

        {/* User Profile Chip */}
        <div className="flex items-center space-x-2 pl-1 border-l border-slate-200">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'}
            alt="User"
            className="w-7 h-7 rounded-full object-cover border border-slate-300"
          />
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[120px]">
              {user?.name || 'Admin'}
            </p>
            <p className="text-[10px] font-semibold text-indigo-600 uppercase leading-none">
              {role}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="hidden xl:flex items-center space-x-1.5">
          <button
            title="Refresh"
            onClick={() => window.location.reload()}
            className="w-7 h-7 rounded-full ring-2 ring-indigo-500 text-indigo-600 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition-all shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          title="Sign Out"
          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
