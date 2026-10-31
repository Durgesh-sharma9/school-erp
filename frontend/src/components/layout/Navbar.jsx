import React, { useState, useEffect, useRef } from 'react';
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
  ChevronDown,
  User,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { GlobalSearchModal } from './GlobalSearchModal';
import { AnnouncementModal } from '../announcements/AnnouncementModal';
import toast from 'react-hot-toast';

export function Navbar({
  session = "2026-2027",
  onToggleSidebar,
  onNavigate
}) {
  const { user, role, schoolId, schoolName, switchRole, switchSchool, AVAILABLE_SCHOOLS, logout } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSessionMenuOpen, setIsSessionMenuOpen] = useState(false);

  const profileMenuRef = useRef(null);
  const sessionMenuRef = useRef(null);

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

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setIsProfileMenuOpen(false);
      }
      if (sessionMenuRef.current && !sessionMenuRef.current.contains(e.target)) {
        setIsSessionMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleChange = (newRole) => {
    switchRole(newRole);
    toast.success(`Switched role to ${newRole}`);
  };

  const handleSchoolChange = (targetSchoolId) => {
    switchSchool(targetSchoolId);
    const target = AVAILABLE_SCHOOLS?.find(s => s.id === targetSchoolId);
    toast.success(`Switched active tenant to: ${target ? target.name : 'SuperAdmin HQ'}`, { icon: '🏢' });
  };

  const handleLogout = () => {
    logout();
    if (onNavigate) onNavigate('/login');
    toast.success('Logged out successfully');
  };

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-3 sm:px-6 shadow-2xs backdrop-blur-md gap-2 sm:gap-3">
        {/* ================= LEFT SECTION: Hamburger + School Identity ================= */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink-0">
          <button
            onClick={onToggleSidebar}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors md:hidden shrink-0 cursor-pointer"
            title="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => onNavigate && onNavigate('/dashboard')}
            className="flex items-center gap-2.5 min-w-0 cursor-pointer select-none group"
            title="Go to School Dashboard"
          >
            <div className="h-9 w-9 rounded-xl border border-slate-200/80 bg-white flex items-center justify-center overflow-hidden p-0.5 shadow-2xs shrink-0 group-hover:border-indigo-400 group-hover:shadow-xs transition-all">
              <img
                src="https://temp.erichost.app/assets/schools/jdisjr_221/school/1_school_photo_1766831297_f7516d5fc58b9af84fb1.jpg"
                alt="School Logo"
                className="h-full w-full object-contain rounded-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <div className="flex flex-col min-w-0 leading-tight">
              <span className="font-bold text-slate-900 text-xs sm:text-sm tracking-tight truncate max-w-[120px] xs:max-w-[150px] sm:max-w-[200px] lg:max-w-[260px] group-hover:text-indigo-600 transition-colors">
                {schoolName || 'WellFair International School'}
              </span>
              <span className="hidden sm:block text-[10px] text-slate-400 font-medium truncate max-w-[180px]">
                Jaisinghpura bhankrota jaipur
              </span>
            </div>
          </div>
        </div>

        {/* ================= CENTER SECTION: Universal Search Pill (⌘K) ================= */}
        <div className="hidden sm:block flex-1 max-w-[160px] md:max-w-[220px] lg:max-w-[280px] xl:max-w-[340px] mx-1 sm:mx-2 min-w-0">
          <button
            type="button"
            id="global-search-trigger"
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-full bg-slate-100/80 border border-slate-200/70 hover:bg-white hover:border-indigo-400 cursor-pointer shadow-2xs hover:shadow-xs transition-all group text-left"
            title="Search modules, teachers, students, actions (Ctrl + K)"
          >
            <div className="flex items-center gap-2 text-slate-400 group-hover:text-indigo-600 transition-colors min-w-0">
              <Search className="w-3.5 h-3.5 shrink-0 text-slate-400 group-hover:text-indigo-600" />
              <span className="text-xs text-slate-500 truncate">Quick Search...</span>
            </div>
            <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded bg-white text-[10px] font-mono text-slate-400 border border-slate-200/80 shadow-2xs shrink-0">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* ================= RIGHT SECTION: Controls + Dropdowns + Logout ================= */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* Quick Offline Fee Voucher Entry Portal */}
          <button
            title="Offline Fee Collection Voucher"
            onClick={() => onNavigate && onNavigate('/fee-voucher-entry')}
            className="w-9 h-9 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-2xs hover:shadow-xs"
          >
            <Receipt className="w-4 h-4" />
          </button>

          {/* Academic Session Pill & Switcher */}
          <div className="relative shrink-0 hidden md:block" ref={sessionMenuRef}>
            <button
              onClick={() => setIsSessionMenuOpen(!isSessionMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs hover:shadow-xs transition-all cursor-pointer shrink-0"
              title="Academic Session"
            >
              <CalendarDays className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="font-bold text-slate-800">{session || '2026-27'}</span>
              <span className="text-[9.5px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-bold">
                Active
              </span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isSessionMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isSessionMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-1.5 z-50 text-left animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Academic Sessions
                </div>
                {['2026-2027', '2025-2026', '2024-2025'].map((sess) => (
                  <button
                    key={sess}
                    onClick={() => {
                      setIsSessionMenuOpen(false);
                      toast.success(`Active session: ${sess}`);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold hover:bg-slate-50 transition-colors text-left cursor-pointer ${
                      sess === '2026-2027' ? 'text-indigo-600 font-bold bg-indigo-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>{sess}</span>
                    {sess === '2026-2027' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Refresh Action Button */}
          <button
            title="Refresh Page"
            onClick={() => window.location.reload()}
            className="hidden sm:flex w-9 h-9 rounded-xl bg-slate-100/90 hover:bg-slate-200/80 text-slate-600 hover:text-indigo-600 items-center justify-center transition-all cursor-pointer shrink-0 shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* Notification Bell Button */}
          <button
            onClick={() => onNavigate && onNavigate('/all-notifications')}
            className="w-9 h-9 rounded-xl bg-slate-100/90 hover:bg-slate-200/80 text-slate-600 hover:text-indigo-600 flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-2xs relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white"></span>
          </button>

          {/* Megaphone Announcement Button (Purple/Violet Gradient) */}
          <button
            onClick={() => setIsAnnouncementModalOpen(true)}
            className="w-9 h-9 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white flex items-center justify-center shadow-xs transition-all cursor-pointer shrink-0"
            title="Broadcast Announcements"
          >
            <Megaphone className="w-4 h-4" />
          </button>

          {/* ================= USER PROFILE CHIP & DROPDOWN ================= */}
          <div className="relative shrink-0" ref={profileMenuRef}>
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 p-1 sm:px-2 sm:py-1 rounded-xl hover:bg-slate-100 border border-transparent hover:border-slate-200/80 transition-all cursor-pointer shrink-0"
              title="User Profile & Quick Settings"
            >
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'}
                alt="User"
                className="w-8 h-8 rounded-xl object-cover ring-2 ring-indigo-500/20 shadow-2xs shrink-0"
              />
              <div className="hidden lg:block text-left shrink-0 leading-tight">
                <p className="text-xs font-bold text-slate-800 truncate max-w-[90px] xl:max-w-[120px]">
                  {user?.name || 'Admin'}
                </p>
                <p className="text-[9.5px] font-bold text-indigo-600 uppercase">
                  {role || 'ADMIN'}
                </p>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 hidden sm:block transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Test Master Pro Polished Profile Dropdown */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 z-50 text-left animate-in fade-in zoom-in-95">
                {/* Header User Info */}
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900 truncate">{user?.name || 'School Admin'}</p>
                  <p className="text-[10px] text-slate-500 truncate">{user?.email || 'admin@school.com'}</p>
                  <span className="inline-block mt-1 text-[9px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md uppercase">
                    Role: {role}
                  </span>
                </div>

                {/* Quick Role Switcher inside dropdown (accessible on all screen sizes) */}
                <div className="px-4 py-2 border-b border-slate-100">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Switch Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => {
                      handleRoleChange(e.target.value);
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="SUPER_ADMIN">SuperAdmin</option>
                    <option value="ADMIN">Admin</option>
                    <option value="STAFF">Staff</option>
                    <option value="ATTENDER">Attender</option>
                    <option value="STUDENT">Student</option>
                  </select>
                </div>

                {/* Quick Tenant Switcher inside dropdown */}
                <div className="px-4 py-2 border-b border-slate-100">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Active Branch
                  </label>
                  <select
                    value={schoolId || 'superadmin'}
                    onChange={(e) => {
                      handleSchoolChange(e.target.value);
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer truncate"
                  >
                    {AVAILABLE_SCHOOLS && AVAILABLE_SCHOOLS.map((sch) => (
                      <option key={sch.id} value={sch.id}>
                        {sch.name}
                      </option>
                    ))}
                    <option value="superadmin">SuperAdmin HQ</option>
                  </select>
                </div>

                {/* Settings Navigation */}
                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      if (onNavigate) onNavigate('/school-info');
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors text-left cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    <span>School Profile & Info</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      if (onNavigate) onNavigate('/settings-and-permissions');
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors text-left cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                    <span>Settings & Permissions</span>
                  </button>
                </div>

                {/* Logout inside dropdown */}
                <div className="pt-1 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ================= DIRECT LOGOUT BUTTON (Never Cut Off, Always Shrink-0) ================= */}
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200/90 bg-rose-50/80 hover:bg-rose-100 hover:border-rose-300 text-rose-700 text-xs font-bold shadow-2xs hover:shadow-xs transition-all cursor-pointer shrink-0 whitespace-nowrap"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span className="hidden xs:inline">Logout</span>
          </button>

        </div>
      </header>

      {/* Test Master Pro Style Announcement & Poll Modal */}
      <AnnouncementModal
        isOpen={isAnnouncementModalOpen}
        onClose={() => setIsAnnouncementModalOpen(false)}
        onSuccess={() => onNavigate && onNavigate('/targeted-announcements')}
      />

      {/* Global Spotlight Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={onNavigate}
      />
    </>
  );
}
export default Navbar;
