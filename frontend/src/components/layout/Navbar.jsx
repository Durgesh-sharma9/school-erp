import React from 'react';
import { Menu, Bell, Megaphone, PlayCircle, Settings, RefreshCw } from 'lucide-react';

export function Navbar({
  schoolName = "J D International School",
  session = "2026-2027",
  onToggleSidebar
}) {
  return (
    <header className="h-14 bg-slate-50 border-b border-slate-200 px-3 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: School Logo + Hamburger + Name & Session */}
      <div className="flex items-center space-x-2">
        {/* School Logo */}
        <img
          src="https://temp.erichost.app/assets/schools/jdisjr_221/school/1_school_photo_1766831297_f7516d5fc58b9af84fb1.jpg"
          alt="School Logo"
          className="w-8 h-8 object-contain rounded-sm"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />

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
          <h1 className="font-semibold text-sm sm:text-base text-gray-800 leading-tight">
            {schoolName}
          </h1>
          <p className="text-[11px] font-semibold text-orange-600 leading-none">
            {session}
          </p>
        </div>
      </div>

      {/* Right: Round Indigo Ring Action Buttons */}
      <div className="flex items-center space-x-2">
        {/* Notifications Button */}
        <button
          title="Notifications"
          className="w-7 h-7 rounded-full ring-2 ring-indigo-500 text-indigo-600 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition-all shadow-xs"
        >
          <Bell className="w-3.5 h-3.5" />
        </button>

        {/* What's New Megaphone */}
        <button
          title="What's New?"
          className="w-7 h-7 rounded-full ring-2 ring-indigo-500 text-indigo-600 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition-all shadow-xs"
        >
          <Megaphone className="w-3.5 h-3.5" />
        </button>

        {/* Play Video (Red Pulse) */}
        <button
          title="Play Tutorial Video"
          className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center animate-pulse shadow-xs"
        >
          <PlayCircle className="w-4 h-4" />
        </button>

        {/* Settings Button */}
        <button
          title="Settings"
          className="w-7 h-7 rounded-full ring-2 ring-indigo-500 text-indigo-600 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition-all shadow-xs"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>

        {/* Refresh Sync Button */}
        <button
          title="Refresh"
          onClick={() => window.location.reload()}
          className="w-7 h-7 rounded-full ring-2 ring-indigo-500 text-indigo-600 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition-all shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
}
