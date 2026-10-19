import React from 'react';
import {
  ShieldCheck,
  FileText,
  Home,
  Printer,
  ArrowRight,
  Users
} from 'lucide-react';

export function UserReportsPage({ onNavigate }) {
  const reports = [
    {
      title: 'User Privilege Report',
      path: '/user-privilege-report',
      desc: 'Comprehensive audit log of system user access, division allocations, assigned modules, classes, subjects, exam rights, and CRUD privileges.',
      icon: ShieldCheck,
      color: 'bg-indigo-50 text-indigo-600',
      badge: 'Access & Permissions'
    },
    {
      title: 'Staff Directory & Remuneration',
      path: '/users',
      desc: 'Full directory of teachers, office staff, drivers, and administrators with banking accounts, IFSC, and payroll reference data.',
      icon: Users,
      color: 'bg-emerald-50 text-emerald-600',
      badge: 'Staff Directory'
    },
    {
      title: 'Role-Based Access Control (RBAC)',
      path: '/user-privilege',
      desc: 'Live interactive matrix of system module access permissions across Administrators, Teachers, Office Staff, and Transport Drivers.',
      icon: FileText,
      color: 'bg-purple-50 text-purple-600',
      badge: 'RBAC Matrix'
    }
  ];

  return (
    <div className="p-4 bg-slate-50 min-h-screen text-slate-800">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-indigo-600" />
            User Management Reports
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span
              className="flex items-center gap-1 hover:text-indigo-600 cursor-pointer"
              onClick={() => onNavigate && onNavigate('/')}
            >
              <Home className="w-3.5 h-3.5" /> Home
            </span>
            <span>/</span>
            <span className="text-indigo-600 font-semibold">User Reports</span>
          </div>
        </div>

        <div className="mt-3 md:mt-0 flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-800 text-white rounded text-xs font-semibold shadow-sm transition-all"
          >
            <Printer className="w-4 h-4" /> Print Overview
          </button>
        </div>
      </div>

      {/* Grid of Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {reports.map((report, idx) => {
          const Icon = report.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigate && onNavigate(report.path)}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${report.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 uppercase">
                    {report.badge}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors mb-2">
                  {report.title}
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {report.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform">
                <span>View Report / Matrix</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default UserReportsPage;
