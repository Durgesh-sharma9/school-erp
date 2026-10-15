import React, { useState } from 'react';
import { Bus, Users, AlertCircle, ShieldCheck, Download, Printer, Search, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export function TransportReportsPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('summary');
  const [searchQuery, setSearchQuery] = useState('');

  const reportCards = [
    {
      id: 'summary',
      title: 'Transport Summary',
      path: '/transport-summary',
      icon: Bus,
      color: 'indigo',
      count: '10 Vehicles',
      desc: 'Vehicle, capacity, operational route, and destination fare matrix'
    },
    {
      id: 'students',
      title: 'Transport Students',
      path: '/transport-students',
      icon: Users,
      color: 'emerald',
      count: '428 Students',
      desc: 'Enrolled transport student roster with route allocation & SMS alerts'
    },
    {
      id: 'due',
      title: 'Transport Due Report',
      path: '/transport-due-report',
      icon: AlertCircle,
      color: 'rose',
      count: '₹92,800 Due',
      desc: 'Month-wise bus fee dues, collection register, and printable bus passes'
    },
    {
      id: 'vehicle',
      title: 'Transport Vehicle Report',
      path: '/transport-vehicle-report',
      icon: ShieldCheck,
      color: 'purple',
      count: '100% Compliant',
      desc: 'Fleet fitness, PUC validity, driver licensing, and RTO compliance audit'
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* 1:1 Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-400 mb-1">
            <span>Transport</span>
            <span>&gt;</span>
            <span className="text-indigo-600 font-medium">Reports Hub</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bus className="w-6 h-6 text-indigo-600" />
            Transport Master Reports Hub
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Unified School Fleet Management, Student Route Rosters, Dues & Compliance Register
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl">
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>
      </div>

      {/* 4 Report Shortcut Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {reportCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              onClick={() => onNavigate ? onNavigate(card.path) : null}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {card.count}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {card.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
                <span>Open Report</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Summary Fleet Overview */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Fleet Operations & Compliance At A Glance</h3>
            <p className="text-xs text-slate-500 mt-0.5">Session 2026-2027 live transport status</p>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs font-semibold text-slate-500 uppercase">Total Active Fleet</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">10 Buses</div>
            <p className="text-[11px] text-slate-500 mt-1">Serving 82 destinations across Jaipur</p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
            <div className="text-xs font-semibold text-emerald-600 uppercase">Passenger Capacity</div>
            <div className="text-2xl font-extrabold text-emerald-900 mt-1">437 Seats</div>
            <p className="text-[11px] text-emerald-700 mt-1">98% utilization across 10 routes</p>
          </div>

          <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100">
            <div className="text-xs font-semibold text-indigo-600 uppercase">GPS & Safety Track</div>
            <div className="text-2xl font-extrabold text-indigo-900 mt-1">100% Online</div>
            <p className="text-[11px] text-indigo-700 mt-1">Real-time telematics enabled</p>
          </div>
        </div>
      </div>
    </div>
  );
}
