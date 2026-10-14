import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Clock,
  CheckCircle2,
  CalendarCheck,
  BookOpen,
  FileSpreadsheet,
  Award,
  CalendarDays,
  DoorOpen,
  Users2,
  Receipt,
  IdCard,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

export function StaffPortalPage({ onNavigate }) {
  const { user, schoolName, schoolCode } = useAuth();

  // Live clock
  const [currentTime, setCurrentTime] = useState(new Date());
  const [attendancePunched, setAttendancePunched] = useState(true);
  const [punchInTime, setPunchInTime] = useState('08:15 AM');
  const [punchOutTime, setPunchOutTime] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const staff = {
    name: user?.name || 'PRITI VERMA',
    employeeCode: user?.employeeCode || '102',
    designation: user?.designation || 'Administrator & Teacher',
    department: user?.department || 'ADMINISTRATIVE & MANAGEMENT',
    mobile: user?.username || '9079909813',
    joiningDate: '01-07-2022',
    salary: '₹38,500',
    avatar: user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    assignedClasses: ['Nursery - PP3+ - A', 'Class I - A', 'Class X - A'],
    assignedSubjects: ['Mathematics', 'English', 'Science']
  };

  const handlePunchToggle = () => {
    if (!punchOutTime) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setPunchOutTime(timeStr);
      toast.success(`Mark Out Attendance recorded at ${timeStr}`);
    } else {
      toast('Attendance already punched for today.', { icon: 'ℹ️' });
    }
  };

  // Staff core operations
  const teacherModules = [
    {
      id: 'student-attendance',
      title: 'Student Attendance',
      desc: 'One-tap daily attendance marker for assigned classes',
      icon: CalendarCheck,
      color: 'bg-emerald-50 text-emerald-600',
      path: '/student-attendance',
      badge: 'Today: Pending'
    },
    {
      id: 'homework',
      title: 'Upload Homework',
      desc: 'Assign daily homework and upload worksheets',
      icon: BookOpen,
      color: 'bg-indigo-50 text-indigo-600',
      path: '/homework',
      badge: '4 Active'
    },
    {
      id: 'marks-entry',
      title: 'Marks Entry',
      desc: 'Fill marks grid with automated CBSE grading',
      icon: Award,
      color: 'bg-rose-50 text-rose-600',
      path: '/marks-entry',
      badge: 'Term 1 Open'
    },
    {
      id: 'syllabus',
      title: 'Syllabus Tracker',
      desc: 'Track chapter progress and curriculum completion',
      icon: FileSpreadsheet,
      color: 'bg-cyan-50 text-cyan-600',
      path: '/study-material',
      badge: '72% Done'
    },
    {
      id: 'leaves',
      title: 'Staff Leave Request',
      desc: 'Apply for Casual or Medical Leave (CL/ML balance: 8)',
      icon: CalendarDays,
      color: 'bg-purple-50 text-purple-600',
      action: () => toast.success('Leave balance: 8 Casual Leaves, 4 Medical Leaves remaining'),
      badge: '8 CL Left'
    },
    {
      id: 'gate-pass',
      title: 'Staff Gate Pass',
      desc: 'Request gate pass for official or personal visits',
      icon: DoorOpen,
      color: 'bg-amber-50 text-amber-600',
      action: () => toast.success('Staff Gate Pass request initiated'),
      badge: 'Digital Pass'
    },
    {
      id: 'salary',
      title: 'Salary & Payslip',
      desc: 'View monthly salary slip, deductions and PF summary',
      icon: Receipt,
      color: 'bg-teal-50 text-teal-600',
      action: () => toast.success(`Generated Pay Slip for September 2026: Net ₹38,500`),
      badge: 'Paid (Sep)'
    },
    {
      id: 'staff-id',
      title: 'Staff ID Card',
      desc: 'Print official school employee identity card',
      icon: IdCard,
      color: 'bg-blue-50 text-blue-600',
      action: () => toast.success('Staff ID card ready for download'),
      badge: 'Print'
    }
  ];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* 1:1 UAB Staff Header Profile Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-lg border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          {/* Avatar & Staff Details */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={staff.avatar}
                alt={staff.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-3 border-orange-500 shadow-md"
              />
              <span className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center text-[10px]">
                ✓
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg sm:text-2xl font-bold tracking-tight">{staff.name}</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 font-medium">
                  🏫 {user?.schoolName || schoolName}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="px-2.5 py-0.5 rounded-md bg-orange-500 text-white font-bold text-xs tracking-wide shadow-xs">
                  {staff.designation}
                </span>
                <span className="text-xs text-slate-300">Code: #{staff.employeeCode}</span>
                <span className="text-xs text-slate-300">&bull; {staff.department}</span>
                <span className="text-xs text-slate-300">&bull; Mobile: {staff.mobile}</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <span className="text-xs text-slate-400">Assigned Classes:</span>
                {staff.assignedClasses.map((cls, idx) => (
                  <span key={idx} className="text-[11px] px-2 py-0.5 rounded bg-white/10 text-white font-medium">
                    {cls}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Exact UAB Staff Punch In / Out Attendance Card */}
          <div className="w-full sm:w-auto bg-white/10 border border-white/10 rounded-xl p-3.5 flex flex-col items-center sm:items-end space-y-2">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-orange-400 animate-pulse" />
              <span className="font-mono text-sm font-bold text-white tracking-wider">
                {currentTime.toLocaleTimeString()}
              </span>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                ● Present Today (P)
              </span>
            </div>

            <div className="text-[11px] text-slate-300 flex items-center space-x-3">
              <span>In: <strong className="text-white">{punchInTime}</strong></span>
              <span>Out: <strong className="text-white">{punchOutTime || '--:--'}</strong></span>
            </div>

            <button
              onClick={handlePunchToggle}
              className={`w-full py-1.5 px-3 rounded-lg text-xs font-semibold shadow-xs transition-all ${
                punchOutTime
                  ? 'bg-slate-700 text-slate-300 cursor-not-allowed'
                  : 'bg-orange-600 hover:bg-orange-700 text-white'
              }`}
            >
              {punchOutTime ? 'Shift Completed' : 'Mark Out Attendance'}
            </button>
          </div>
        </div>
      </div>

      {/* Staff Operations Action Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-slate-800">Faculty & Operations Tools</h3>
          <span className="text-xs text-slate-500">Term 1 (2026-2027)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {teacherModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                onClick={() => {
                  if (mod.path && onNavigate) {
                    onNavigate(mod.path);
                  } else if (mod.action) {
                    mod.action();
                  }
                }}
                className="bg-white hover:bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${mod.color} group-hover:scale-105 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {mod.badge}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                    {mod.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {mod.desc}
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
                  <span>Open Tool</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Class Teaching Schedule */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center space-x-2">
            <CalendarCheck className="w-5 h-5 text-indigo-600" />
            <h4 className="font-bold text-slate-800 text-sm">Today's Class Schedule & Periods</h4>
          </div>
          <span className="text-xs text-slate-500">Total 4 Periods Today</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl border border-indigo-100 bg-indigo-50/50">
            <div className="flex justify-between items-center text-xs font-bold text-indigo-700 mb-1">
              <span>Period 1</span>
              <span>08:30 - 09:15</span>
            </div>
            <p className="font-bold text-slate-900 text-sm">Nursery - PP3+ (A)</p>
            <p className="text-xs text-slate-600 mt-0.5">Subject: Mathematics (Shapes & Counting)</p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1">
              <span>Period 2</span>
              <span>09:20 - 10:05</span>
            </div>
            <p className="font-bold text-slate-900 text-sm">Class I - A</p>
            <p className="text-xs text-slate-600 mt-0.5">Subject: English Grammar</p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1">
              <span>Period 3</span>
              <span>10:25 - 11:10</span>
            </div>
            <p className="font-bold text-slate-900 text-sm">Class X - A</p>
            <p className="text-xs text-slate-600 mt-0.5">Subject: Science (Physics Practical)</p>
          </div>

          <div className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/50">
            <div className="flex justify-between items-center text-xs font-bold text-emerald-700 mb-1">
              <span>Period 4</span>
              <span>11:15 - 12:00</span>
            </div>
            <p className="font-bold text-slate-900 text-sm">Free Period / Prep</p>
            <p className="text-xs text-slate-600 mt-0.5">Staff Room Evaluation</p>
          </div>
        </div>
      </div>
    </div>
  );
}
