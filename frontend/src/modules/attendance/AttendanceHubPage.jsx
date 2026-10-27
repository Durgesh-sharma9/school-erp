import React, { useState } from 'react';
import { PageHeader, PageStack } from '../../components/erp/PagePrimitives';
import { StudentAttendancePage } from './StudentAttendancePage';
import { StaffAttendancePage } from '../payroll/StaffAttendancePage';
import { UserCheck, Users, CalendarCheck, Sparkles } from 'lucide-react';
import { cn } from '../../utils/cn';

export function AttendanceHubPage({ onNavigate, initialTab = 'student' }) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'student' | 'staff'

  return (
    <div className="min-h-screen bg-slate-50/40 pb-12">
      {/* Top Hub Navigation Bar */}
      <div className="bg-white border-b border-slate-200/90 shadow-2xs sticky top-16 z-30">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-2xs shrink-0">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
                  Attendance Central
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                  Daily Register
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Switch seamlessly between Student and Staff daily attendance registers
              </p>
            </div>
          </div>

          {/* 2 Sub-Tabs Switcher */}
          <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200/80 shadow-2xs self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('student')}
              className={cn(
                'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer',
                activeTab === 'student'
                  ? 'bg-white text-emerald-700 shadow-xs border border-emerald-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              )}
            >
              <Users className="w-4 h-4 text-emerald-600" />
              <span>Student Attendance</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('staff')}
              className={cn(
                'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer',
                activeTab === 'staff'
                  ? 'bg-white text-blue-700 shadow-xs border border-blue-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              )}
            >
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span>Staff Attendance</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="mt-2">
        {activeTab === 'student' ? (
          <StudentAttendancePage onNavigate={onNavigate} />
        ) : (
          <StaffAttendancePage onNavigate={onNavigate} />
        )}
      </div>
    </div>
  );
}

export default AttendanceHubPage;
