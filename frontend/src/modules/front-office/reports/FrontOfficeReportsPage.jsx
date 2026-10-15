import React, { useState } from 'react';
import {
  FileText,
  Home,
  ArrowRight,
  ShieldAlert,
  UserCheck,
  GraduationCap,
  CalendarDays,
  Bell,
  AlertCircle,
  FileWarning,
  Briefcase,
  IdCard,
  MessageSquare
} from 'lucide-react';
import { ManualComplaintReportPage } from './ManualComplaintReportPage';
import { NotificationCountReportPage } from './NotificationCountReportPage';
import { VisitorEnquiryReportPage } from './VisitorEnquiryReportPage';
import { PreAdmissionReportPage } from './PreAdmissionReportPage';
import { StaffVisitReportPage } from './StaffVisitReportPage';
import { GatePassReportPage } from './GatePassReportPage';
import { CalendarPlanningReportPage } from './CalendarPlanningReportPage';
import { ReminderReportPage } from './ReminderReportPage';
import { StudentComplaintReportPage } from './StudentComplaintReportPage';
import { StaffGatePassReportPage } from './StaffGatePassReportPage';

export function FrontOfficeReportsPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('hub');

  const reportCards = [
    {
      id: 'staff-complaint',
      path: 'manual-complaint-reports',
      title: 'Staff Complaint Report',
      description: 'Faculty grievances, service conduct reviews, and resolution tracking for staff members.',
      icon: FileWarning,
      color: 'rose',
      count: '3 Logged'
    },
    {
      id: 'notification-count',
      path: 'class-wise-notification-count-report',
      title: 'Notification Count Report',
      description: 'Class-wise mobile app push notifications, SMS dispatches, and circular deliveries summary.',
      icon: Bell,
      color: 'blue',
      count: '1,258 Delivered'
    },
    {
      id: 'visitor-report',
      path: 'visitor-enquiry-report',
      title: 'Visitor Enquiry Report',
      description: 'Audit log of campus visitors, prospective parents, official inspections, and contact records.',
      icon: UserCheck,
      color: 'emerald',
      count: '4 Enquiries'
    },
    {
      id: 'pre-admission',
      path: 'pre-admission-report',
      title: 'Pre-Admission Report',
      description: 'New applicant registrations, class preferences, family details, and admission status.',
      icon: GraduationCap,
      color: 'purple',
      count: '4 Candidates'
    },
    {
      id: 'staff-visit',
      path: 'payroll-visit-staff-meeting-report',
      title: 'Visit Staff Meeting Report',
      description: 'External staff deputations, inter-school conferences, and official training meetings.',
      icon: Briefcase,
      color: 'amber',
      count: '3 Visits'
    },
    {
      id: 'student-gate-pass',
      path: 'gate-pass-report',
      title: 'Student Gate Pass Report',
      description: 'Early pickup logs, guardian verification timestamps, and authorized student exit passes.',
      icon: IdCard,
      color: 'indigo',
      count: '3 Passes'
    },
    {
      id: 'calendar-planning',
      path: 'calendar-planning-report',
      title: 'Calendar Planning Report',
      description: 'Annual activity roadmap, STEM exhibitions, parent meetings, and holiday declarations.',
      icon: CalendarDays,
      color: 'teal',
      count: '4 Milestones'
    },
    {
      id: 'reminder-report',
      path: 'reminder-report',
      title: 'Reminders Report',
      description: 'Front office task schedules, administrative alerts, and event notification schedules.',
      icon: Bell,
      color: 'cyan',
      count: '4 Reminders'
    },
    {
      id: 'student-complaint',
      path: 'complaint-report',
      title: 'Student Complaint Report',
      description: 'Disciplinary reports, peer conflict resolution logs, and student grievance records.',
      icon: AlertCircle,
      color: 'orange',
      count: '3 Reports'
    },
    {
      id: 'staff-gate-pass',
      path: 'staff-gate-pass-report',
      title: 'Staff Gate Pass Report',
      description: 'Faculty in/out gate movements, temporary duties, and permission slip records.',
      icon: ShieldAlert,
      color: 'slate',
      count: '3 Gate Passes'
    }
  ];

  if (activeTab === 'staff-complaint') return <ManualComplaintReportPage onNavigate={onNavigate} />;
  if (activeTab === 'notification-count') return <NotificationCountReportPage onNavigate={onNavigate} />;
  if (activeTab === 'visitor-report') return <VisitorEnquiryReportPage onNavigate={onNavigate} />;
  if (activeTab === 'pre-admission') return <PreAdmissionReportPage onNavigate={onNavigate} />;
  if (activeTab === 'staff-visit') return <StaffVisitReportPage onNavigate={onNavigate} />;
  if (activeTab === 'student-gate-pass') return <GatePassReportPage onNavigate={onNavigate} />;
  if (activeTab === 'calendar-planning') return <CalendarPlanningReportPage onNavigate={onNavigate} />;
  if (activeTab === 'reminder-report') return <ReminderReportPage onNavigate={onNavigate} />;
  if (activeTab === 'student-complaint') return <StudentComplaintReportPage onNavigate={onNavigate} />;
  if (activeTab === 'staff-gate-pass') return <StaffGatePassReportPage onNavigate={onNavigate} />;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1:1 Secondary Top Header Toolbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-bold text-slate-800 pr-3 border-r border-slate-300">
            Front Office Reports Hub
          </h1>
          <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
            <button
              onClick={() => onNavigate && onNavigate('/')}
              className="hover:text-blue-600 flex items-center gap-1 transition-colors"
            >
              <Home size={13} />
              <span>Home</span>
            </button>
            <span>/</span>
            <button
              onClick={() => onNavigate && onNavigate('/app-users')}
              className="hover:text-blue-600 transition-colors"
            >
              Front Office
            </button>
            <span>/</span>
            <span className="text-slate-700 font-semibold">Reports</span>
          </nav>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportCards.map(card => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-blue-50 text-slate-700 group-hover:text-blue-600 flex items-center justify-center transition-colors">
                      <Icon size={24} />
                    </div>
                    <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
                      {card.count}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-6">
                    {card.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => onNavigate ? onNavigate(card.path) : setActiveTab(card.id)}
                    className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 group-hover:text-blue-700 transition-colors"
                  >
                    <span>Open Report</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={() => setActiveTab(card.id)}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium transition-colors"
                  >
                    Quick View
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
