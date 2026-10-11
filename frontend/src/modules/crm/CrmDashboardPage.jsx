import React, { useState } from 'react';
import {
  Home,
  Plus,
  Search,
  Users,
  CheckCircle,
  Clock,
  Flame,
  TrendingUp,
  FileQuestion,
  Phone,
  QrCode,
  FileText,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Calendar,
  MessageCircle,
  GraduationCap
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { DEFAULT_ENQUIRIES, DEFAULT_TASKS, DEFAULT_ASSESSMENTS } from './crmData';

const CHART_MONTHS = [
  { month: 'Apr', enquiries: 18, conversions: 5 },
  { month: 'May', enquiries: 28, conversions: 12 },
  { month: 'Jun', enquiries: 45, conversions: 24 },
  { month: 'Jul', enquiries: 38, conversions: 19 },
  { month: 'Aug', enquiries: 22, conversions: 9 },
  { month: 'Sep', enquiries: 29, conversions: 14 },
  { month: 'Oct', enquiries: 35, conversions: 18 }
];

const SOURCE_DISTRIBUTION = [
  { name: 'Walk-in', value: 35, color: '#5c67f6' },
  { name: 'Website', value: 25, color: '#38bdf8' },
  { name: 'Social Media', value: 20, color: '#f43f5e' },
  { name: 'Referral', value: 15, color: '#10b981' },
  { name: 'Phone Call', value: 5, color: '#f59e0b' }
];

export function CrmDashboardPage({ onNavigate }) {
  const [enquiries] = useState(DEFAULT_ENQUIRIES);
  const [tasks] = useState(DEFAULT_TASKS);
  const [assessments] = useState(DEFAULT_ASSESSMENTS);

  const pendingTasks = tasks.filter(t => t.status === 'Pending' || t.dueDate === '2026-10-11');
  const hotLeads = enquiries.filter(e => e.status === 'Hot');
  const enrolledCount = enquiries.filter(e => e.status === 'Enrolled').length;

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      {/* Top Breadcrumb Toolbar */}
      <div className="bg-white border-b border-slate-200/80 px-4 md:px-8 py-3 flex items-center justify-between shadow-xs sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <h1 className="text-base md:text-lg font-semibold text-slate-800">
            Campus CRM Dashboard
          </h1>
          <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400 pl-3 border-l border-slate-200">
            <button onClick={() => onNavigate && onNavigate('/')} className="hover:text-indigo-600">
              <Home className="w-3.5 h-3.5" />
            </button>
            <span>•</span>
            <span className="text-slate-500">CRM</span>
            <span>•</span>
            <span className="text-indigo-600 font-medium">Dashboard</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onNavigate && onNavigate('/crm/enquiries')}
            className="h-9 px-3 rounded-lg bg-[#5c67f6] hover:bg-indigo-600 text-white flex items-center space-x-1.5 shadow-xs text-xs font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Enquiry</span>
          </button>
        </div>
      </div>

      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-5">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => onNavigate && onNavigate('/crm/enquiries')}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs cursor-pointer hover:border-indigo-300 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Total Enquiries</span>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Users className="w-4.5 h-4.5" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mt-2">{enquiries.length}</h3>
            <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +24% this admission session
            </p>
          </div>

          <div
            onClick={() => onNavigate && onNavigate('/crm/tasks')}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs cursor-pointer hover:border-blue-300 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Today's Tasks</span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Clock className="w-4.5 h-4.5" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-blue-600 mt-2">{pendingTasks.length}</h3>
            <p className="text-[11px] text-blue-500 font-semibold flex items-center gap-1 mt-1">
              <Phone className="w-3 h-3" /> Follow-ups due today
            </p>
          </div>

          <div
            onClick={() => onNavigate && onNavigate('/crm/enquiries')}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs cursor-pointer hover:border-rose-300 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Hot Leads</span>
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Flame className="w-4.5 h-4.5" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-rose-600 mt-2">{hotLeads.length}</h3>
            <p className="text-[11px] text-rose-500 font-semibold flex items-center gap-1 mt-1">
              <Flame className="w-3 h-3" /> Priority conversions
            </p>
          </div>

          <div
            onClick={() => onNavigate && onNavigate('/crm/assessments')}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs cursor-pointer hover:border-emerald-300 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Assessments</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FileQuestion className="w-4.5 h-4.5" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-emerald-600 mt-2">{assessments.length}</h3>
            <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <CheckCircle className="w-3 h-3" /> Entrance tests active
            </p>
          </div>
        </div>

        {/* Quick Module Navigation Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={() => onNavigate && onNavigate('/crm/enquiries')}
            className="p-3 bg-white border border-slate-200 hover:border-indigo-400 rounded-xl text-left shadow-2xs hover:shadow-xs transition-all flex items-center space-x-2.5"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-800">Enquiries</p>
              <p className="text-[10px] text-slate-400 truncate">Manage leads</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate && onNavigate('/crm/tasks')}
            className="p-3 bg-white border border-slate-200 hover:border-indigo-400 rounded-xl text-left shadow-2xs hover:shadow-xs transition-all flex items-center space-x-2.5"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-800">Today's Tasks</p>
              <p className="text-[10px] text-slate-400 truncate">Follow-up queue</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate && onNavigate('/crm/assessments')}
            className="p-3 bg-white border border-slate-200 hover:border-indigo-400 rounded-xl text-left shadow-2xs hover:shadow-xs transition-all flex items-center space-x-2.5"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <FileQuestion className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-800">Assessments</p>
              <p className="text-[10px] text-slate-400 truncate">Entrance tests</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate && onNavigate('/crm/admission-form')}
            className="p-3 bg-white border border-slate-200 hover:border-indigo-400 rounded-xl text-left shadow-2xs hover:shadow-xs transition-all flex items-center space-x-2.5"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-800">Admission Form</p>
              <p className="text-[10px] text-slate-400 truncate">Public form setup</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate && onNavigate('/crm/qr-code')}
            className="p-3 bg-white border border-slate-200 hover:border-indigo-400 rounded-xl text-left shadow-2xs hover:shadow-xs transition-all flex items-center space-x-2.5"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <QrCode className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-800">QR Code / Links</p>
              <p className="text-[10px] text-slate-400 truncate">Branded posters</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate && onNavigate('/crm/thankyou-cms')}
            className="p-3 bg-white border border-slate-200 hover:border-indigo-400 rounded-xl text-left shadow-2xs hover:shadow-xs transition-all flex items-center space-x-2.5"
          >
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-800">Enquiry Banner</p>
              <p className="text-[10px] text-slate-400 truncate">CMS Thank you</p>
            </div>
          </button>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Trend Area Chart */}
          <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm text-slate-800">Enquiries & Admission Conversion Trend</h3>
                <p className="text-xs text-slate-400">Monthly student acquisition pipeline</p>
              </div>
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                Session 2026-2027
              </span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CHART_MONTHS}>
                  <defs>
                    <linearGradient id="enqGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5c67f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#5c67f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="convGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip />
                  <Area type="monotone" dataKey="enquiries" stroke="#5c67f6" strokeWidth={2} fillOpacity={1} fill="url(#enqGradient)" name="Enquiries" />
                  <Area type="monotone" dataKey="conversions" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#convGradient)" name="Admitted" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Source Breakdown Donut Chart */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-800">Enquiry Sources</h3>
              <p className="text-xs text-slate-400 mb-3">Where parents discovered our school</p>
              <div className="h-44 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={SOURCE_DISTRIBUTION}
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {SOURCE_DISTRIBUTION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t text-xs">
              {SOURCE_DISTRIBUTION.map(s => (
                <div key={s.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-slate-600">{s.name}</span>
                  </div>
                  <span className="font-bold text-slate-800">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Enquiries & Follow-up Queue */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Recent Enquiries Table */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-800">Recent Admission Enquiries</h3>
                <p className="text-xs text-slate-400">Latest parent interactions</p>
              </div>
              <button
                onClick={() => onNavigate && onNavigate('/crm/enquiries')}
                className="text-xs text-[#5c67f6] hover:text-indigo-700 font-semibold flex items-center gap-1"
              >
                <span>View All ({enquiries.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b">
                  <tr>
                    <th className="py-2.5 px-4">ENQ ID</th>
                    <th className="py-2.5 px-4">STUDENT</th>
                    <th className="py-2.5 px-4">CLASS</th>
                    <th className="py-2.5 px-4">PARENT & CONTACT</th>
                    <th className="py-2.5 px-4">STATUS</th>
                    <th className="py-2.5 px-4 text-center">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700">
                  {enquiries.slice(0, 4).map(enq => (
                    <tr key={enq.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-4 font-mono font-bold text-indigo-600">{enq.enquiryId}</td>
                      <td className="py-2.5 px-4 font-semibold text-slate-900">{enq.studentName}</td>
                      <td className="py-2.5 px-4 font-medium text-slate-800">{enq.className}</td>
                      <td className="py-2.5 px-4">
                        <div className="text-slate-800">{enq.parentName}</div>
                        <div className="text-[11px] text-slate-400">{enq.mobile}</div>
                      </td>
                      <td className="py-2.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          enq.status === 'Hot' ? 'bg-rose-50 text-rose-600 border border-rose-200' :
                          enq.status === 'Enrolled' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                          'bg-indigo-50 text-indigo-600 border border-indigo-200'
                        }`}>
                          {enq.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <button
                          onClick={() => onNavigate && onNavigate('/crm/enquiries')}
                          className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Today's Follow-up Tasks */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b mb-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-800">Pending Tasks Due</h3>
                  <p className="text-xs text-slate-400">Counsellor action required</p>
                </div>
                <button
                  onClick={() => onNavigate && onNavigate('/crm/tasks')}
                  className="text-xs text-[#5c67f6] hover:text-indigo-700 font-semibold"
                >
                  Tasks ({tasks.length})
                </button>
              </div>

              <div className="space-y-2.5">
                {tasks.slice(0, 3).map(t => (
                  <div key={t.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{t.studentName}</span>
                      <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                        {t.priority}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">{t.description}</p>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-500">
                      <span>Due: {t.dueDate}</span>
                      <a href={`tel:${t.mobile}`} className="text-indigo-600 font-semibold hover:underline flex items-center gap-1">
                        <Phone className="w-3 h-3" /> Call
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => onNavigate && onNavigate('/crm/tasks')}
              className="mt-4 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>View Full Task Calendar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
