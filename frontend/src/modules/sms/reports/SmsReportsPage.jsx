import React from 'react';
import {
  MessageSquare,
  Cake,
  Home,
  Printer,
  ArrowRight,
  Send,
  MessageSquareCode
} from 'lucide-react';

export function SmsReportsPage({ onNavigate }) {
  const reports = [
    {
      title: 'Message Report',
      path: '/sms-status-report',
      desc: 'Audit trail of all dispatched SMS and WhatsApp notifications with delivery statuses (Success, Failed, Pending) and gateway error diagnostics.',
      icon: MessageSquare,
      color: 'bg-indigo-50 text-indigo-600',
      badge: 'Delivery Logs'
    },
    {
      title: 'Birthday Report',
      path: '/birthday-report',
      desc: 'Comprehensive calendar list of student, staff, and parent birthdays categorized month-wise with greeting status and contact details.',
      icon: Cake,
      color: 'bg-pink-50 text-pink-600',
      badge: 'Greetings & Calendar'
    }
  ];

  return (
    <div className="p-4 bg-slate-50 min-h-screen text-slate-800">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-indigo-600" />
            SMS & Notification Reports Hub
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span
              className="flex items-center gap-1 hover:text-indigo-600 cursor-pointer"
              onClick={() => onNavigate && onNavigate('dashboard')}
            >
              <Home className="w-3.5 h-3.5" /> Home
            </span>
            <span>/</span>
            <span className="text-indigo-600 font-semibold">SMS Reports</span>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        {reports.map((report, idx) => {
          const Icon = report.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigate && onNavigate(report.path.replace(/^\//, ''))}
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
                <span>Access Detailed Report</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default SmsReportsPage;
