import React from 'react';
import { Search, Bell, Sparkles, User, Calendar, Maximize2, School as SchoolIcon } from 'lucide-react';

export function Navbar({ schoolName = "J D International School", session = "2026-2027", userRole = "Admin" }) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Left: School Title & Current Session */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <SchoolIcon className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-tight">
              {schoolName}
            </h1>
            <div className="flex items-center space-x-2 text-[11px] text-slate-500">
              <span className="flex items-center space-x-1">
                <Calendar className="w-3 h-3 text-indigo-500" />
                <span className="font-semibold text-slate-700">Session:</span>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">
                {session}
              </span>
            </div>
          </div>
        </div>

        {/* New Feature Ticker */}
        <div className="hidden lg:flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium ml-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>New Released Feature &bull; Automated CBSE Marksheet</span>
        </div>
      </div>

      {/* Right: Search, Notification & User Chip */}
      <div className="flex items-center space-x-3">
        {/* Global Search */}
        <div className="relative hidden md:block w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search student, fee, staff..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Notification Bell */}
        <button className="w-9 h-9 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2 ring-2 ring-white"></span>
        </button>

        {/* User Profile Chip */}
        <div className="flex items-center space-x-2.5 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {userRole.charAt(0)}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-slate-800 leading-none">
              {userRole}
            </div>
            <div className="text-[10px] text-emerald-600 font-medium flex items-center space-x-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Online</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
