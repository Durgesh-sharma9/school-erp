import React, { useState } from 'react';
import {
  FileText,
  IndianRupee,
  Users,
  Calendar,
  Clock,
  ArrowRight,
  Home,
  FileCheck,
  CheckCircle2,
  TrendingUp,
  BarChart2,
  Printer,
  FileDown
} from 'lucide-react';
import { StaffSalaryReportPage } from './StaffSalaryReportPage';
import { StaffListPage } from './StaffListPage';
import { MonthlyStaffAttendanceReportPage } from './MonthlyStaffAttendanceReportPage';
import { StaffAttendanceTimeReportPage } from './StaffAttendanceTimeReportPage';

export function PayrollReportsPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('hub');

  const reportCards = [
    {
      id: 'salary',
      path: 'payroll-staff-salary',
      title: 'Staff Salary Report',
      description: 'Comprehensive payroll disbursement breakdown, basic pay, allowances, deductions & net payable per staff member.',
      icon: IndianRupee,
      color: 'blue',
      metrics: '₹2,65,310 total disbursed this month'
    },
    {
      id: 'staff-list',
      path: 'staff-list',
      title: 'Staff Master Directory',
      description: 'Complete roster of all teaching & non-teaching staff, designations, departments, contact and banking details.',
      icon: Users,
      color: 'emerald',
      metrics: '7 Registered staff members'
    },
    {
      id: 'monthly-attendance',
      path: 'staff-attendance-report',
      title: 'Monthly Staff Attendance Matrix',
      description: 'Day-by-day 1-to-31 attendance register with P/A/L/HD badges, total working days & payable day calculations.',
      icon: Calendar,
      color: 'purple',
      metrics: '94.8% average attendance rate'
    },
    {
      id: 'time-attendance',
      path: 'staff-attendance-time-report',
      title: 'Staff Punch & Time Report',
      description: 'In/out biometric punch timestamps, total working hours, late arrivals tracking, and overtime calculation.',
      icon: Clock,
      color: 'amber',
      metrics: 'Today: 6 Present, 1 Late'
    }
  ];

  if (activeTab === 'salary') {
    return <StaffSalaryReportPage onNavigate={onNavigate} />;
  }
  if (activeTab === 'staff-list') {
    return <StaffListPage onNavigate={onNavigate} />;
  }
  if (activeTab === 'monthly-attendance') {
    return <MonthlyStaffAttendanceReportPage onNavigate={onNavigate} />;
  }
  if (activeTab === 'time-attendance') {
    return <StaffAttendanceTimeReportPage onNavigate={onNavigate} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1:1 Secondary Top Header Toolbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-bold text-slate-800 pr-3 border-r border-slate-300">
            Payroll & Staff Reports Hub
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
              onClick={() => onNavigate && onNavigate('/payroll-registration')}
              className="hover:text-blue-600 transition-colors"
            >
              Payroll
            </button>
            <span>/</span>
            <span className="text-slate-700 font-semibold">Reports</span>
          </nav>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* Quick KPI Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users size={24} />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">Total Registered Staff</div>
              <div className="text-xl font-bold text-slate-800">7 Members</div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">6 Active · 1 Inactive</div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IndianRupee size={24} />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">Last Disbursed Payroll</div>
              <div className="text-xl font-bold text-slate-800">₹2,65,310</div>
              <div className="text-[11px] text-blue-600 font-semibold mt-0.5">September 2026</div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">Average Attendance</div>
              <div className="text-xl font-bold text-slate-800">94.8%</div>
              <div className="text-[11px] text-purple-600 font-semibold mt-0.5">Current Academic Term</div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock size={24} />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">Punctuality Score</div>
              <div className="text-xl font-bold text-slate-800">91.2%</div>
              <div className="text-[11px] text-amber-600 font-semibold mt-0.5">Morning Shifts</div>
            </div>
          </div>
        </div>

        {/* 4 Dedicated Report Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                      {card.metrics}
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
                    <span>Open Dedicated Report</span>
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
