import React from 'react';
import { Building, Bed, Users, AlertCircle, ArrowRight, Printer } from 'lucide-react';

export function HostelReportsPage({ onNavigate }) {
  const reportCards = [
    {
      id: 'rooms',
      title: 'Hostel Room Report',
      path: '/hostel-report',
      icon: Bed,
      count: '6 Rooms',
      desc: 'Room inventory, floor/block mapping, bed occupancy, and vacancy analysis'
    },
    {
      id: 'boarders',
      title: 'Hostel Students Report',
      path: '/hostel-students-report',
      icon: Users,
      count: '4 Boarders',
      desc: 'Current student resident roster with bed numbers and guardian contacts'
    },
    {
      id: 'due',
      title: 'Hostel Fee Due Report',
      path: '/hostel-due-report',
      icon: AlertCircle,
      count: '₹75,000 Due',
      desc: 'Outstanding accommodation and mess fee balances by hostel & student'
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* 1:1 Breadcrumbs & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-400 mb-1">
            <span>Hostel</span>
            <span>&gt;</span>
            <span className="text-indigo-600 font-medium">Reports Hub</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Building className="w-6 h-6 text-indigo-600" />
            Hostel Master Reports Hub
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Residential Facilities, Room Allocations, Occupancy Rates & Financial Summaries
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl">
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>
      </div>

      {/* 3 Report Shortcut Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reportCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              onClick={() => onNavigate ? onNavigate(card.path) : null}
              className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    {card.count}
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {card.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
                <span>View Full Report</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
          <div className="text-xs font-semibold text-slate-500 uppercase">Total Residential Capacity</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">300 Beds</div>
          <p className="text-xs text-slate-500 mt-1">Across 3 Hostels (Boys & Girls Wings)</p>
        </div>

        <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100">
          <div className="text-xs font-semibold text-emerald-600 uppercase">Current Boarders</div>
          <div className="text-2xl font-extrabold text-emerald-900 mt-1">4 Enrolled</div>
          <p className="text-xs text-emerald-700 mt-1">Active residential students</p>
        </div>

        <div className="bg-rose-50/50 p-5 rounded-2xl border border-rose-100">
          <div className="text-xs font-semibold text-rose-600 uppercase">Outstanding Hostel Fee</div>
          <div className="text-2xl font-extrabold text-rose-900 mt-1">₹75,000</div>
          <p className="text-xs text-rose-700 mt-1">Pending term fee collections</p>
        </div>
      </div>
    </div>
  );
}
