import React, { useState, useEffect } from 'react';
import {
  Menu,
  Bell,
  Megaphone,
  Search,
  Settings,
  RefreshCw,
  LogOut,
  Building2,
  Receipt,
  CalendarDays,
  Sparkles,
  Command
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { GlobalSearchModal } from './GlobalSearchModal';
import toast from 'react-hot-toast';

export function Navbar({
  session = "2026-2027",
  onToggleSidebar,
  onNavigate
}) {
  const { user, role, schoolId, schoolName, switchRole, switchSchool, AVAILABLE_SCHOOLS, logout } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Global Ctrl + K / Cmd + K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
    <>
      <header className="h-16 bg-white border-b border-slate-200/90 px-3 sm:px-6 flex items-center justify-between gap-3 shrink-0 sticky top-0 z-30 shadow-2xs">
        {/* Left: School Logo + Hamburger + Name & Session */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Hamburger Menu Toggle */}
          <button
            onClick={onToggleSidebar}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
            title="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Dynamic School Logo */}
          <div className="shrink-0 flex items-center">
            {isSchoolB ? (
              <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                DPS
              </div>
            ) : (
              <img
                src="https://temp.erichost.app/assets/schools/jdisjr_221/school/1_school_photo_1766831297_f7516d5fc58b9af84fb1.jpg"
                alt="School Logo"
                className="w-8 h-8 object-contain rounded-lg border border-slate-200 shadow-2xs"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
          </div>

          {/* Title & Branch / Session Info */}
          <div
            onClick={() => onNavigate && onNavigate('/dashboard')}
            className="cursor-pointer select-none group hidden sm:block shrink-0"
            title="Go to Dashboard"
          >
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight truncate max-w-[140px] md:max-w-[200px]">
                {schoolName}
              </h1>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider whitespace-nowrap shrink-0 border ${
                isSchoolB 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-indigo-50 text-indigo-700 border-indigo-200'
              }`}>
                {schoolId === 'sch_dps_branch2' ? 'School B' : schoolId === 'sch_jd_intl' ? 'School A' : 'HQ'}
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 leading-none mt-0.5 whitespace-nowrap">
              <span className="font-semibold text-indigo-600">{session}</span> &bull; Active Academic Year
            </p>
          </div>
        </div>

        {/* Center: Global Omni-Search Bar (Interactive Spotlight Trigger) */}
        <div className="flex-1 max-w-xs sm:max-w-sm md:max-w-md mx-1 sm:mx-4 min-w-[120px] sm:min-w-[180px]">
          <button
            type="button"
            id="global-search-trigger"
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-white hover:border-indigo-400 cursor-pointer shadow-2xs transition-all group text-left"
            title="Search modules, teachers, students, actions (Ctrl + K)"
          >
            <div className="flex items-center gap-2 text-slate-400 group-hover:text-indigo-600 transition-colors min-w-0">
              <Search className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-indigo-600" />
              <span className="text-xs text-slate-500 truncate">
                Search modules, staff, students...
              </span>
            </div>
            <kbd className="hidden sm:inline-flex items-center font-mono text-[10px] font-semibold px-2 py-0.5 rounded bg-white text-slate-500 border border-slate-200 whitespace-nowrap shrink-0 shadow-2xs ml-1.5">
              Ctrl + K
            </kbd>
          </button>
        </div>

        {/* Right: Direct Actions + Multi-Tenant + Role + Profile + Logout */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Quick Action: Announcements */}
          <button
            onClick={() => onNavigate && onNavigate('/targeted-announcements')}
            className="relative w-9 h-9 rounded-lg flex items-center justify-center bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-indigo-600 transition shadow-2xs shrink-0 cursor-pointer"
            title="Targeted Announcements"
          >
            <Megaphone className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
          </button>

          {/* Quick Action: Cash Day Book */}
          <button
            onClick={() => onNavigate && onNavigate('/day-book')}
            className="w-9 h-9 rounded-lg hidden sm:flex items-center justify-center bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-emerald-600 transition shadow-2xs shrink-0 cursor-pointer"
            title="Cash Day Book Ledger"
          >
            <Receipt className="w-4 h-4" />
          </button>

          {/* Multi-Tenant School Switcher */}
          <div className="hidden lg:flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-2xs shrink-0">
            <Building2 className="w-3.5 h-3.5 text-indigo-600 mr-1.5 shrink-0" />
            <select
              value={schoolId || 'superadmin'}
              onChange={handleSchoolChange}
              className="text-xs font-semibold text-slate-700 bg-transparent focus:outline-none cursor-pointer max-w-[120px] truncate"
              title="Switch School Branch"
            >
              {AVAILABLE_SCHOOLS && AVAILABLE_SCHOOLS.map((sch) => (
                <option key={sch.id} value={sch.id}>
                  {sch.name}
                </option>
              ))}
              <option value="superadmin">SuperAdmin HQ</option>
            </select>
          </div>

          {/* Role Switcher */}
          <div className="hidden md:flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-2xs shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase mr-1 whitespace-nowrap">Role:</span>
            <select
              value={role}
              onChange={handleRoleChange}
              className="text-xs font-semibold text-slate-700 bg-transparent focus:outline-none cursor-pointer"
              title="Switch Role"
            >
              <option value="SUPER_ADMIN">SuperAdmin</option>
              <option value="ADMIN">Admin</option>
              <option value="STAFF">Staff</option>
              <option value="STUDENT">Student</option>
            </select>
          </div>

          {/* User Profile Info (matching C:\fro_test) */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 shrink-0">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'}
              alt="User"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-100 shadow-2xs shrink-0"
            />
            <div className="hidden xl:block text-left shrink-0">
              <p className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[100px]">
                {user?.name || 'Admin User'}
              </p>
              <span className="inline-block text-[10px] font-semibold text-indigo-700 uppercase leading-none">
                {role}
              </span>
            </div>
          </div>

          {/* Dedicated Logout Button matching C:\fro_test */}
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-rose-200 hover:bg-rose-50 text-slate-700 hover:text-rose-600 text-xs font-semibold shadow-2xs transition-all cursor-pointer shrink-0 ml-1"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-500 group-hover:text-rose-600 shrink-0" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Global Spotlight Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={onNavigate}
      />
    </>
  );
}
