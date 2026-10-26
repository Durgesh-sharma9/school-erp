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
  Command,
  ChevronDown
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
    const target = AVAILABLE_SCHOOLS?.find(s => s.id === targetSchoolId);
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
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200/70 bg-white/95 px-3 sm:px-5 shadow-2xs backdrop-blur-md gap-2">
        {/* Left: Hamburger + School Logo & Name (matching Test Master Pro) */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink-0">
          <button
            onClick={onToggleSidebar}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors md:hidden shrink-0 cursor-pointer"
            title="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => onNavigate && onNavigate('/dashboard')}
            className="flex items-center gap-2.5 min-w-0 cursor-pointer select-none group"
            title="Go to School Dashboard"
          >
            <div className="h-9 w-9 rounded-full border border-slate-200/80 bg-white flex items-center justify-center overflow-hidden p-0.5 shadow-2xs shrink-0 group-hover:border-indigo-300 transition-colors">
              <img
                src="https://temp.erichost.app/assets/schools/jdisjr_221/school/1_school_photo_1766831297_f7516d5fc58b9af84fb1.jpg"
                alt="School Logo"
                className="h-full w-full object-contain rounded-full"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <div className="flex flex-col min-w-0 leading-tight">
              <span className="font-bold text-slate-900 text-xs sm:text-sm tracking-tight truncate max-w-[120px] sm:max-w-[180px] md:max-w-[240px] group-hover:text-indigo-600 transition-colors">
                {schoolName || 'WellFair International School'}
              </span>
              <span className="hidden sm:block text-[10.5px] text-slate-500 font-medium truncate max-w-[200px]">
                Jaisinghpura bhankrota jaipur
              </span>
            </div>
          </div>
        </div>

        {/* Center: Test Master Pro Universal Search Pill (⌘K) */}
        <div className="max-w-xs md:max-w-sm lg:max-w-md w-full mx-2 hidden md:block">
          <button
            type="button"
            id="global-search-trigger"
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-full bg-slate-100/90 border border-slate-200/80 hover:bg-white hover:border-indigo-400 cursor-pointer shadow-2xs transition-all group text-left"
            title="Search modules, teachers, students, actions (Ctrl + K)"
          >
            <div className="flex items-center gap-2 text-slate-400 group-hover:text-indigo-600 transition-colors">
              <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
              <span className="text-xs text-slate-500">Search...</span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded bg-white text-[10px] font-mono text-slate-400 border border-slate-200/80 shadow-2xs">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Controls: Tenant Switcher + Role Switcher + Fee Receipt + Session Pill + Refresh + Bell + Megaphone + User Profile + Logout */}
        <div className="flex items-center gap-1.5 sm:gap-2 ml-auto shrink-0">
          
          {/* Quick Offline Fee Voucher Entry Portal */}
          <button
            title="Offline Fee Collection Portal"
            onClick={() => onNavigate && onNavigate('/fee-voucher-entry')}
            className="w-9 h-9 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-2xs"
          >
            <Receipt className="w-4 h-4" />
          </button>

          {/* Instant Multi-Tenant Switcher */}
          <div className="hidden xl:flex items-center bg-slate-50 border border-slate-200/90 rounded-full px-2.5 py-1 shadow-2xs shrink-0">
            <Building2 className="w-3.5 h-3.5 text-indigo-600 mr-1.5 shrink-0" />
            <select
              value={schoolId || 'superadmin'}
              onChange={handleSchoolChange}
              className="text-xs font-semibold text-slate-700 bg-transparent focus:outline-none cursor-pointer max-w-[125px] truncate"
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

          {/* Quick Role Switcher */}
          <div className="hidden lg:flex items-center bg-slate-50 border border-slate-200/90 rounded-full px-2.5 py-1 shadow-2xs shrink-0">
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

          {/* Academic Session Pill matching Test Master Pro */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-50/90 border border-slate-200/90 rounded-full text-xs shadow-2xs">
            <CalendarDays className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span className="hidden md:inline text-slate-500 font-normal">Session:</span>
            <span className="font-bold text-slate-800">{session || '2026-27'}</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-semibold">
              Active
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
          </div>

          {/* Refresh Action Button */}
          <button
            title="Refresh Page"
            onClick={() => window.location.reload()}
            className="w-9 h-9 rounded-full bg-slate-100/90 hover:bg-slate-200/80 text-slate-600 flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* Notification Bell Button */}
          <button
            onClick={() => onNavigate && onNavigate('/all-notifications')}
            className="w-9 h-9 rounded-full bg-slate-100/90 hover:bg-slate-200/80 text-slate-600 flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-2xs"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
          </button>

          {/* Megaphone Announcement Button (Purple/Violet Gradient) */}
          <button
            onClick={() => onNavigate && onNavigate('/targeted-announcements')}
            className="w-9 h-9 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white flex items-center justify-center shadow-xs transition-all cursor-pointer shrink-0"
            title="Broadcast Announcements"
          >
            <Megaphone className="w-4 h-4" />
          </button>

          {/* User Profile Chip */}
          <div className="flex items-center gap-2 pl-1.5 border-l border-slate-200 shrink-0">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'}
              alt="User"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20 shrink-0 shadow-2xs"
            />
            <div className="hidden 2xl:block text-left shrink-0">
              <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[100px]">
                {user?.name || 'Admin'}
              </p>
              <p className="text-[9px] font-semibold text-indigo-600 uppercase leading-none">
                {role}
              </p>
            </div>
          </div>

          {/* Logout Button matching Test Master Pro */}
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/90 hover:border-rose-200 hover:bg-rose-50 text-slate-700 hover:text-rose-600 text-xs font-semibold shadow-2xs transition-all cursor-pointer shrink-0"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-500 hover:text-rose-600" />
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
