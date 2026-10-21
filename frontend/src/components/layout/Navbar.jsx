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
      <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 sm:px-4 flex items-center justify-between gap-2 shrink-0 sticky top-0 z-30 shadow-xs">
        {/* Left: School Logo + Hamburger + Name & Session */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Dynamic School Logo */}
          {isSchoolB ? (
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
              DPS
            </div>
          ) : (
            <img
              src="https://temp.erichost.app/assets/schools/jdisjr_221/school/1_school_photo_1766831297_f7516d5fc58b9af84fb1.jpg"
              alt="School Logo"
              className="w-8 h-8 object-contain rounded-lg shrink-0"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}

          {/* Hamburger Menu Toggle */}
          <button
            onClick={onToggleSidebar}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
            title="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Title & Branch / Session Info */}
          <div
            onClick={() => onNavigate && onNavigate('/dashboard')}
            className="cursor-pointer select-none group hidden sm:block shrink-0"
            title="Go to Dashboard"
          >
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight truncate max-w-[130px] md:max-w-[190px]">
                {schoolName}
              </h1>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider whitespace-nowrap shrink-0 border ${
                isSchoolB 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800' 
                  : 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800'
              }`}>
                {schoolId === 'sch_dps_branch2' ? 'School B' : schoolId === 'sch_jd_intl' ? 'School A' : 'HQ'}
              </span>
            </div>
            <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-none mt-0.5 whitespace-nowrap">
              <span className="font-semibold text-amber-600 dark:text-amber-400">{session}</span> &bull; Active Session
            </p>
          </div>
        </div>

        {/* Center: Global Omni-Search Bar (Interactive Spotlight Trigger) */}
        <div className="flex-1 max-w-xs sm:max-w-sm md:max-w-md mx-1 sm:mx-3 min-w-[130px] sm:min-w-[180px]">
          <button
            type="button"
            id="global-search-trigger"
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center justify-between px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 cursor-pointer shadow-2xs transition-all group text-left"
            title="Search modules, teachers, students, actions (Ctrl + K)"
          >
            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors min-w-0">
              <Search className="w-3.5 h-3.5 shrink-0" />
              <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                Search modules, staff, students...
              </span>
            </div>
            <kbd className="hidden sm:inline-flex items-center font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300 border border-slate-200 dark:border-slate-600 whitespace-nowrap shrink-0 shadow-2xs ml-1.5">
              Ctrl + K
            </kbd>
          </button>
        </div>

        {/* Right: Direct Access Icons + Tenant Switcher + Role + Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Direct Quick Action: Announcements Hub */}
          <button
            onClick={() => onNavigate && onNavigate('/targeted-announcements')}
            className="relative w-8 h-8 rounded-lg flex items-center justify-center bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition shadow-2xs shrink-0"
            title="Targeted Announcements Hub"
          >
            <Megaphone className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
          </button>

          {/* Direct Quick Action: Day Book Cash Ledger */}
          <button
            onClick={() => onNavigate && onNavigate('/day-book')}
            className="w-8 h-8 rounded-lg hidden sm:flex items-center justify-center bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition shadow-2xs shrink-0"
            title="Daily Cash Day Book Ledger"
          >
            <Receipt className="w-4 h-4" />
          </button>

          {/* Instant Multi-Tenant Switcher */}
          <div className="hidden lg:flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 shadow-2xs shrink-0">
            <Building2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 mr-1.5 shrink-0" />
            <select
              value={schoolId || 'superadmin'}
              onChange={handleSchoolChange}
              className="text-xs font-semibold text-slate-700 dark:text-slate-200 bg-transparent focus:outline-none cursor-pointer max-w-[125px] truncate"
              title="Switch School Branch"
            >
              {AVAILABLE_SCHOOLS && AVAILABLE_SCHOOLS.map((sch) => (
                <option key={sch.id} value={sch.id} className="dark:bg-slate-900">
                  {sch.name}
                </option>
              ))}
              <option value="superadmin" className="dark:bg-slate-900">SuperAdmin HQ</option>
            </select>
          </div>

          {/* Quick Role Switcher */}
          <div className="hidden md:flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 shadow-2xs shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase mr-1 whitespace-nowrap">Role:</span>
            <select
              value={role}
              onChange={handleRoleChange}
              className="text-xs font-semibold text-slate-700 dark:text-slate-200 bg-transparent focus:outline-none cursor-pointer"
              title="Switch Role"
            >
              <option value="SUPER_ADMIN" className="dark:bg-slate-900">SuperAdmin</option>
              <option value="ADMIN" className="dark:bg-slate-900">Admin</option>
              <option value="STAFF" className="dark:bg-slate-900">Staff</option>
              <option value="STUDENT" className="dark:bg-slate-900">Student</option>
            </select>
          </div>

          {/* User Profile Chip */}
          <div className="flex items-center gap-1.5 pl-1.5 border-l border-slate-200 dark:border-slate-800 shrink-0">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'}
              alt="User"
              className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
            />
            <div className="hidden xl:block text-left shrink-0">
              <p className="text-xs font-bold text-slate-800 dark:text-white leading-tight truncate max-w-[95px]">
                {user?.name || 'Admin'}
              </p>
              <p className="text-[9px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase leading-none">
                {role}
              </p>
            </div>
          </div>

          {/* Refresh Action */}
          <button
            title="Refresh Page"
            onClick={() => window.location.reload()}
            className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-all shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="w-8 h-8 rounded-lg border border-transparent hover:border-rose-200 dark:hover:border-rose-900/40 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center justify-center transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
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
