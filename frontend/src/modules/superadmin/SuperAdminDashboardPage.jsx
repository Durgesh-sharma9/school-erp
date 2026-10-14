import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  TrendingUp,
  Users,
  CreditCard,
  Building,
  GraduationCap,
  CalendarCheck,
  Award,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Send,
  Download,
  Filter,
  CheckCircle,
  RefreshCw,
  Clock,
  ShieldCheck,
  Activity,
  Layers,
  Search
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import toast from 'react-hot-toast';

export function SuperAdminDashboardPage({ onNavigate }) {
  const { switchRole } = useAuth();

  // Filters
  const [selectedBranch, setSelectedBranch] = useState('ALL');
  const [timeRange, setTimeRange] = useState('YTD');
  const [isExporting, setIsExporting] = useState(false);

  // Revenue by month
  const monthlyRevenueData = [
    { month: 'Apr', projected: 28, collected: 26.5, dues: 1.5 },
    { month: 'May', projected: 18, collected: 17.2, dues: 0.8 },
    { month: 'Jun', projected: 14, collected: 13.0, dues: 1.0 },
    { month: 'Jul', projected: 24, collected: 22.8, dues: 1.2 },
    { month: 'Aug', projected: 20, collected: 18.5, dues: 1.5 },
    { month: 'Sep', projected: 22, collected: 20.2, dues: 1.8 },
    { month: 'Oct', projected: 26, collected: 24.1, dues: 1.9 },
    { month: 'Nov', projected: 15, collected: 5.9, dues: 9.1 }
  ];

  // Payment mode distribution
  const paymentModeData = [
    { name: 'UPI / QR', value: 48, color: '#4f46e5' },
    { name: 'Cash Counter', value: 30, color: '#10b981' },
    { name: 'Net Banking', value: 16, color: '#0ea5e9' },
    { name: 'Cheque', value: 6, color: '#f59e0b' }
  ];

  // Admission funnel
  const admissionFunnelData = [
    { stage: 'Inquiries', count: 420, percent: 100, fill: '#6366f1' },
    { stage: 'Campus Visits', count: 310, percent: 73.8, fill: '#8b5cf6' },
    { stage: 'Assessment Tests', count: 245, percent: 58.3, fill: '#ec4899' },
    { stage: 'Admissions Paid', count: 188, percent: 44.8, fill: '#10b981' }
  ];

  // Fee aging buckets
  const feeAgingData = [
    { bucket: '0-30 Days', amount: '₹4,20,000', students: 48, severity: 'low' },
    { bucket: '31-60 Days', amount: '₹5,80,000', students: 34, severity: 'medium' },
    { bucket: '61-90 Days', amount: '₹3,90,000', students: 18, severity: 'high' },
    { bucket: '90+ Days', amount: '₹2,89,500', students: 12, severity: 'critical' }
  ];

  // Multi-Branch comparative stats
  const branchComparison = [
    {
      id: 'main',
      name: 'J D International School (Main Campus)',
      city: 'Vidhyadhar Nagar, Jaipur',
      students: 1240,
      capacity: '95%',
      staff: 68,
      collected: '₹78,40,000',
      recoveryRate: '92.4%',
      status: 'Excellent'
    },
    {
      id: 'city',
      name: 'J D International (City Wing Campus)',
      city: 'Mansarovar, Jaipur',
      students: 760,
      capacity: '88%',
      staff: 44,
      collected: '₹46,20,000',
      recoveryRate: '88.1%',
      status: 'Good'
    },
    {
      id: 'junior',
      name: 'J D Kids World (Junior Branch)',
      city: 'Vaishali Nagar, Jaipur',
      students: 450,
      capacity: '92%',
      staff: 30,
      collected: '₹23,60,500',
      recoveryRate: '94.0%',
      status: 'Excellent'
    }
  ];

  // Audit event feed
  const liveAuditEvents = [
    { time: '12:44 PM', user: 'Admin (Counter #1)', action: 'Fee Receipt #RCP/2026/2180 issued for Class I-A (₹9,000 - UPI)', type: 'fee' },
    { time: '12:30 PM', user: 'Priti Verma (102)', action: 'Student Attendance marked for Class X-A (42/44 Present)', type: 'attendance' },
    { time: '11:50 AM', user: 'Admin', action: 'New Student Admission: Aarav Sharma (SR #2060, Nursery)', type: 'admission' },
    { time: '11:15 AM', user: 'Sunita Kumari (202)', action: 'Term 1 Exam Marks saved for Class I-A (Mathematics)', type: 'exam' },
    { time: '10:00 AM', user: 'System Automated', action: 'Daily Parent WhatsApp Attendance SMS broadcast completed (2,308 sent)', type: 'system' }
  ];

  const handleSendRecoveryAlerts = (bucketName) => {
    toast.success(`Automated WhatsApp & SMS payment reminders queued for ${bucketName} defaulters!`);
  };

  const handleExportReport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      toast.success('SuperAdmin Consolidated Executive Analytics Report PDF downloaded.');
    }, 1200);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* SuperAdmin Executive Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white p-5 rounded-2xl shadow-lg border border-purple-900/40">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-bold uppercase tracking-wider">
              👑 SuperAdmin Executive Suite
            </span>
            <span className="text-xs text-purple-200">Session 2026-2027</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black mt-1 tracking-tight">
            Multi-Campus Central Command & Analytics
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Real-time financial telemetry, student attendance velocity, and cross-campus performance.
          </p>
        </div>

        {/* Filter Controls & Actions */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Branch Filter */}
          <div className="flex items-center bg-white/10 rounded-xl px-3 py-1.5 border border-white/10 text-xs">
            <Building className="w-3.5 h-3.5 text-purple-300 mr-1.5" />
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="bg-transparent text-white focus:outline-hidden cursor-pointer font-semibold"
            >
              <option value="ALL" className="text-slate-900">All Campuses (Consolidated)</option>
              <option value="main" className="text-slate-900">Main Campus (Vidhyadhar Nagar)</option>
              <option value="city" className="text-slate-900">City Wing Campus (Mansarovar)</option>
              <option value="junior" className="text-slate-900">Junior Branch (Vaishali Nagar)</option>
            </select>
          </div>

          {/* Time Range */}
          <div className="flex items-center bg-white/10 rounded-xl p-0.5 border border-white/10 text-xs">
            {['Today', 'This Month', 'YTD'].map((t) => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  timeRange === t ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Export Executive PDF */}
          <button
            onClick={handleExportReport}
            disabled={isExporting}
            className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-md shadow-purple-900/30 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Generating...' : 'Export PDF'}</span>
          </button>
        </div>
      </div>

      {/* 6 Executive Core KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {/* 1. Total Fee Collection */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Total Collection</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-black text-slate-900">₹1,48,20,500</p>
          <div className="flex items-center text-[11px] text-emerald-600 font-semibold mt-1 space-x-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>89.8% Recovery</span>
          </div>
        </div>

        {/* 2. Total Pending Dues */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Total Dues</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-black text-amber-600">₹16,79,500</p>
          <p className="text-[11px] text-slate-500 mt-1">112 Defaulter accounts</p>
        </div>

        {/* 3. Total Students */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Total Students</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-black text-slate-900">2,450</p>
          <p className="text-[11px] text-blue-600 font-medium mt-1">Boy: 1,320 &bull; Girl: 1,130</p>
        </div>

        {/* 4. Total Staff */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Total Faculty & Staff</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-black text-slate-900">142</p>
          <div className="flex items-center text-[11px] text-indigo-600 font-semibold mt-1 space-x-1">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>96.4% Present Today</span>
          </div>
        </div>

        {/* 5. Student Attendance */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Today's Attendance</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-black text-slate-900">94.2%</p>
          <p className="text-[11px] text-purple-600 font-medium mt-1">2,308 of 2,450 Present</p>
        </div>

        {/* 6. Admission Conversion */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Admission Conversion</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-black text-rose-600">44.8%</p>
          <p className="text-[11px] text-slate-500 mt-1">188 of 420 Leads converted</p>
        </div>
      </div>

      {/* Row 2: Monthly Financial Collection Chart + Payment Mode Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Collection Bar & Line Trend (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2 mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Monthly Fee Collection vs Projected (in Lakhs ₹)</h3>
              <p className="text-xs text-slate-500">Academic Financial Year 2026-2027</p>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <span className="flex items-center space-x-1 text-indigo-600 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                <span>Collected</span>
              </span>
              <span className="flex items-center space-x-1 text-slate-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                <span>Projected</span>
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  formatter={(val, name) => [`₹${val} Lakhs`, name === 'collected' ? 'Collected' : 'Projected']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Bar dataKey="projected" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                <Bar dataKey="collected" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Mode Distribution Pie Chart (1 col) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-slate-100 mb-2">
              <h3 className="font-bold text-slate-900 text-sm">Pay Mode Breakdown</h3>
              <p className="text-xs text-slate-500">Payment channels preferred by parents</p>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentModeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {paymentModeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => [`${val}%`, 'Share']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            {paymentModeData.map((item) => (
              <div key={item.name} className="flex items-center space-x-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 truncate">{item.name}</span>
                <span className="font-bold text-slate-900 ml-auto">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Fee Defaulter Aging Buckets + Admission Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fee Aging Buckets */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Fee Dues Aging Analysis</h3>
              <p className="text-xs text-slate-500">Recovery prioritization & default age</p>
            </div>
            <button
              onClick={() => handleSendRecoveryAlerts('All Dues')}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 flex items-center space-x-1"
            >
              <Send className="w-3 h-3" />
              <span>Broadcast Reminder</span>
            </button>
          </div>

          <div className="space-y-3">
            {feeAgingData.map((bucket) => (
              <div
                key={bucket.bucket}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-900">{bucket.bucket}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase ${
                        bucket.severity === 'critical'
                          ? 'bg-rose-100 text-rose-700'
                          : bucket.severity === 'high'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {bucket.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{bucket.students} Student Accounts overdue</p>
                </div>

                <div className="text-right flex items-center space-x-3">
                  <span className="text-sm font-bold text-slate-900">{bucket.amount}</span>
                  <button
                    onClick={() => handleSendRecoveryAlerts(bucket.bucket)}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 text-xs shadow-2xs"
                    title="Send Targeted Recovery SMS"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Admission Funnel */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
          <div className="pb-3 border-b border-slate-100 mb-4">
            <h3 className="font-bold text-slate-900 text-sm">Campus Admission Funnel</h3>
            <p className="text-xs text-slate-500">Inquiry-to-enrollment conversion efficiency</p>
          </div>

          <div className="space-y-3">
            {admissionFunnelData.map((stage, idx) => (
              <div key={stage.stage} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">{stage.stage}</span>
                  <span className="font-bold text-slate-900">
                    {stage.count} leads ({stage.percent}%)
                  </span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${stage.percent}%`, backgroundColor: stage.fill }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-between text-xs text-emerald-800">
            <span>✨ Net Admission Conversion Rate:</span>
            <span className="font-bold text-sm">44.8% (Target: 40%)</span>
          </div>
        </div>
      </div>

      {/* Row 4: Multi-Branch Comparative Performance Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 mb-4 gap-2">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Multi-Campus Operational Matrix</h3>
            <p className="text-xs text-slate-500">Cross-branch benchmarking across students, collections and faculty ratio</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-100">
            3 Campuses Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 font-semibold text-slate-600">
              <tr>
                <th className="p-3">Campus Branch</th>
                <th className="p-3 text-center">Enrolled</th>
                <th className="p-3 text-center">Capacity</th>
                <th className="p-3 text-center">Faculty</th>
                <th className="p-3 text-right">Fee Revenue</th>
                <th className="p-3 text-center">Recovery %</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {branchComparison.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3">
                    <p className="font-bold text-slate-900">{b.name}</p>
                    <p className="text-[11px] text-slate-400">{b.city}</p>
                  </td>
                  <td className="p-3 text-center font-bold text-slate-800">{b.students}</td>
                  <td className="p-3 text-center font-medium text-slate-600">{b.capacity}</td>
                  <td className="p-3 text-center font-medium text-slate-600">{b.staff}</td>
                  <td className="p-3 text-right font-bold text-emerald-700">{b.collected}</td>
                  <td className="p-3 text-center font-bold text-indigo-600">{b.recoveryRate}</td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 5: Live System Audit Log */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-purple-600" />
            <h3 className="font-bold text-slate-900 text-sm">Real-time System Audit & Operator Stream</h3>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Live Sync &bull; 0s delay</span>
        </div>

        <div className="space-y-2.5">
          {liveAuditEvents.map((ev, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-slate-50/80 border border-slate-100">
              <div className="flex items-center space-x-3">
                <span className="font-mono text-[11px] text-slate-400 shrink-0">{ev.time}</span>
                <span className="font-bold text-slate-800 shrink-0">{ev.user}:</span>
                <span className="text-slate-600">{ev.action}</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-500 uppercase">
                {ev.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
