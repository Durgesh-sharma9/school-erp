import React, { useEffect, useState } from 'react';
import {
  IndianRupee,
  Users,
  UserCheck,
  TrendingUp,
  Receipt,
  ArrowUpRight,
  UserPlus,
  CreditCard,
  ClipboardCheck,
  FileSpreadsheet,
  CalendarDays,
  Percent
} from 'lucide-react';
import axios from 'axios';

export function DashboardPage({ onNavigate }) {
  const [stats, setStats] = useState({
    todayCollection: { total: 0, receiptsCount: 0, cash: 0, bank: 0 },
    feeRevenueSummary: { totalRevenue: 31221901, totalReceivedYTD: 30943456, totalDue: 283445, receivedPercentage: 99.1 },
    totalStudents: { total: 928, boys: 494, girls: 434, newAdmissions: 168, oldStudents: 760, growthRate: "+18.1%" },
    attendanceToday: { percentage: 0, totalPresent: 0, totalAbsent: 0, trend: "0% ↓" }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/dashboard/stats');
        if (res.data?.success && res.data.data) {
          setStats(res.data.data);
        }
      } catch (err) {
        // Graceful fallback to default UAB metrics
        console.log('Using default UAB stats');
      }
    };
    fetchStats();
  }, []);

  const formatINR = (val) => {
    return Number(val || 0).toLocaleString('en-IN');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Breadcrumb & Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Overview
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Dashboard
          </h2>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate && onNavigate('/student-registration')}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ New Admission</span>
          </button>
          <button
            onClick={() => onNavigate && onNavigate('/fee-collection')}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>+ Fee Entry</span>
          </button>
          <button
            onClick={() => onNavigate && onNavigate('/student-attendance')}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <ClipboardCheck className="w-3.5 h-3.5" />
            <span>Mark Attendance</span>
          </button>
        </div>
      </div>

      {/* 4 Executive Stats Cards (UAB Layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Today Collection */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Today Collection
            </span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <IndianRupee className="w-4 h-4" />
            </span>
          </div>

          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-slate-900">
              ₹ {formatINR(stats.todayCollection.total)}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Receipts: {stats.todayCollection.receiptsCount}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
            <div className="bg-slate-50 p-2 rounded-lg">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Cash</div>
              <div className="font-bold text-slate-800">₹ {formatINR(stats.todayCollection.cash)}</div>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Bank / Online</div>
              <div className="font-bold text-slate-800">₹ {formatINR(stats.todayCollection.bank)}</div>
            </div>
          </div>
        </div>

        {/* Card 2: Fee Revenue Summary */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Fee Revenue Summary
            </span>
            <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Receipt className="w-4 h-4" />
            </span>
          </div>

          <div className="text-2xl font-extrabold text-slate-900">
            ₹ {formatINR(stats.feeRevenueSummary.totalRevenue)}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-0.5">
            Total Due: <span className="font-bold text-rose-600">₹ {formatINR(stats.feeRevenueSummary.totalDue)}</span>
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
              <span>Received (YTD)</span>
              <span className="text-emerald-600">{stats.feeRevenueSummary.receivedPercentage}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${stats.feeRevenueSummary.receivedPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Card 3: Total Student */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Student
            </span>
            <div className="flex items-center space-x-1.5">
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-100">
                {stats.totalStudents.growthRate}
              </span>
              <span className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                <Users className="w-4 h-4" />
              </span>
            </div>
          </div>

          <div className="text-2xl font-extrabold text-slate-900">
            {formatINR(stats.totalStudents.total)}
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
            <div className="bg-sky-50/60 p-2 rounded-lg">
              <div className="text-[10px] text-sky-700 uppercase font-semibold">Boys / Girls</div>
              <div className="font-bold text-slate-800">{stats.totalStudents.boys} / {stats.totalStudents.girls}</div>
            </div>
            <div className="bg-indigo-50/60 p-2 rounded-lg">
              <div className="text-[10px] text-indigo-700 uppercase font-semibold">New / Old</div>
              <div className="font-bold text-slate-800">{stats.totalStudents.newAdmissions} / {stats.totalStudents.oldStudents}</div>
            </div>
          </div>
        </div>

        {/* Card 4: Student Attendance */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Student Attendance
            </span>
            <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <UserCheck className="w-4 h-4" />
            </span>
          </div>

          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-slate-900">
              {stats.attendanceToday.percentage}%
            </span>
            <span className="text-xs text-rose-500 font-semibold">
              {stats.attendanceToday.trend}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
            <div className="bg-emerald-50 p-2 rounded-lg">
              <div className="text-[10px] text-emerald-700 uppercase font-semibold">Present</div>
              <div className="font-bold text-emerald-800">{stats.attendanceToday.totalPresent}</div>
            </div>
            <div className="bg-rose-50 p-2 rounded-lg">
              <div className="text-[10px] text-rose-700 uppercase font-semibold">Absent</div>
              <div className="font-bold text-rose-800">{stats.attendanceToday.totalAbsent}</div>
            </div>
          </div>
        </div>

      </div>

      {/* Class Capacity & Quick Operations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Class Distribution / Capacity Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Class Summary & Capacity
              </h3>
              <p className="text-xs text-slate-500">Registered students count across academic classes</p>
            </div>
            <button
              onClick={() => onNavigate && onNavigate('/class')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              View Class Master &rarr;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold text-[10px] bg-slate-50/50">
                  <th className="py-2.5 px-3">S.No</th>
                  <th className="py-2.5 px-3">Class Name</th>
                  <th className="py-2.5 px-3">Sections</th>
                  <th className="py-2.5 px-3">Capacity</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {[
                  { sNo: 1, name: "Nursery", sections: "A, B", capacity: 60, status: "Active" },
                  { sNo: 2, name: "L.K.G", sections: "A, B", capacity: 60, status: "Active" },
                  { sNo: 3, name: "U.K.G", sections: "A, B", capacity: 60, status: "Active" },
                  { sNo: 4, name: "Class 1", sections: "A, B, C", capacity: 90, status: "Active" },
                  { sNo: 5, name: "Class 5", sections: "A, B", capacity: 70, status: "Active" },
                  { sNo: 6, name: "Class 10", sections: "A, B", capacity: 80, status: "Active" },
                  { sNo: 7, name: "Class 12", sections: "Sci, Comm", capacity: 80, status: "Active" }
                ].map((row) => (
                  <tr key={row.sNo} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-2.5 px-3 text-slate-400 font-mono">{row.sNo}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{row.name}</td>
                    <td className="py-2.5 px-3 text-slate-600">{row.sections}</td>
                    <td className="py-2.5 px-3 text-slate-600">{row.capacity} Seats</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100">
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Quick Module Shortcuts */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Quick Shortcuts
            </h3>
            <p className="text-xs text-slate-500">Most frequent administrative actions</p>
          </div>

          <div className="space-y-2">
            {[
              { title: "Student Registration", desc: "Admit new student with 7-tab biodata", path: "/student-registration", icon: UserPlus, color: "text-indigo-600 bg-indigo-50" },
              { title: "Fee Collection Counter", desc: "Instant receipt search & payment", path: "/fee-collection", icon: CreditCard, color: "text-emerald-600 bg-emerald-50" },
              { title: "Class Attendance", desc: "One-tap student daily attendance", path: "/student-attendance", icon: ClipboardCheck, color: "text-amber-600 bg-amber-50" },
              { title: "Marks Entry Grid", desc: "Term exam and unit test marks fill", path: "/marks-entry", icon: FileSpreadsheet, color: "text-sky-600 bg-sky-50" },
              { title: "Edit School Profile", desc: "UDISE, Affiliation, Header logo", path: "/school-info", icon: CalendarDays, color: "text-purple-600 bg-purple-50" },
            ].map((shortcut) => {
              const Icon = shortcut.icon;
              return (
                <button
                  key={shortcut.path}
                  onClick={() => onNavigate && onNavigate(shortcut.path)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50/70 transition-all text-left group"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${shortcut.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                        {shortcut.title}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {shortcut.desc}
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
