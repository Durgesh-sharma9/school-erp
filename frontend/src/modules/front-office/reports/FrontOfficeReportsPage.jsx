import React, { useState } from 'react';
import {
  FileText,
  UserCheck,
  GraduationCap,
  CalendarDays,
  Bell,
  AlertCircle,
  FileWarning,
  Briefcase,
  IdCard,
  Search,
  ArrowRight
} from 'lucide-react';

export const ALL_FRONT_OFFICE_REPORTS = [
  {
    id: 'staff-complaint',
    path: '/manual-complaint-reports',
    title: 'Staff Complaint Report',
    description: 'Faculty grievances, service conduct reviews, and resolution tracking for staff members.',
    icon: FileWarning,
    badge: 'Faculty Issues'
  },
  {
    id: 'notification-count',
    path: '/class-wise-notification-count-report',
    title: 'Notification Count Report',
    description: 'Class-wise mobile app push notifications, SMS dispatches, and circular deliveries summary.',
    icon: Bell,
    badge: 'Dispatches'
  },
  {
    id: 'visitor-report',
    path: '/visitor-enquiry-report',
    title: 'Visitor Enquiry Report',
    description: 'Audit log of campus visitors, prospective parents, official inspections, and contact records.',
    icon: UserCheck,
    badge: 'Campus Visitors'
  },
  {
    id: 'pre-admission',
    path: '/pre-admission-report',
    title: 'Pre-Admission Report',
    description: 'New applicant registrations, class preferences, family details, and admission status.',
    icon: GraduationCap,
    badge: 'Enquiries'
  },
  {
    id: 'staff-visit',
    path: '/payroll-visit-staff-meeting-report',
    title: 'Visit Staff Meeting Report',
    description: 'External staff deputations, inter-school conferences, and official training meetings.',
    icon: Briefcase,
    badge: 'Meetings'
  },
  {
    id: 'student-gate-pass',
    path: '/gate-pass-report',
    title: 'Student Gate Pass Report',
    description: 'Early pickup logs, guardian verification timestamps, and authorized student exit passes.',
    icon: IdCard,
    badge: 'Exit Passes'
  },
  {
    id: 'calendar-planning',
    path: '/calendar-planning-report',
    title: 'Calendar Planning Report',
    description: 'Annual activity roadmap, STEM exhibitions, parent meetings, and holiday declarations.',
    icon: CalendarDays,
    badge: 'Academic Roadmap'
  },
  {
    id: 'reminder-report',
    path: '/reminder-report',
    title: 'Reminders Report',
    description: 'Front office task schedules, administrative alerts, and event notification schedules.',
    icon: Bell,
    badge: 'Scheduled Tasks'
  },
  {
    id: 'student-complaint',
    path: '/complaint-report',
    title: 'Student Complaint Report',
    description: 'Disciplinary reports, peer conflict resolution logs, and student grievance records.',
    icon: AlertCircle,
    badge: 'Discipline'
  },
  {
    id: 'staff-gate-pass',
    path: '/staff-gate-pass-report',
    title: 'Staff Gate Pass Report',
    description: 'Official gate entry/exit logs for teachers and administrative personnel during school hours.',
    icon: IdCard,
    badge: 'Staff Movement'
  }
];

export function FrontOfficeReportsPage({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReports = ALL_FRONT_OFFICE_REPORTS.filter(report => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      report.title.toLowerCase().includes(q) ||
      report.description.toLowerCase().includes(q) ||
      report.badge.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50/60 p-3 md:p-5 flex flex-col space-y-3.5">
      {/* Compact Controls Bar: Title and Search */}
      <div className="bg-white rounded-xl p-3 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
            <FileText className="w-3.5 h-3.5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 leading-tight">
              Front Office Reports Directory
            </h1>
            <p className="text-[11px] text-slate-400">
              Showing {filteredReports.length} of {ALL_FRONT_OFFICE_REPORTS.length} front office reports
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search front office reports..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Grid of Compact Report Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filteredReports.map(report => {
          const Icon = report.icon;
          return (
            <div
              key={report.id}
              onClick={() => onNavigate && onNavigate(report.path)}
              className="bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-200 flex items-center justify-center font-bold shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-700 rounded-md transition-colors truncate max-w-[120px]">
                    {report.badge}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-[13px] leading-tight mb-1 group-hover:text-indigo-600 transition-colors">
                  {report.title}
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                  {report.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-indigo-600">
                <span className="group-hover:underline">Open Report</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FrontOfficeReportsPage;
