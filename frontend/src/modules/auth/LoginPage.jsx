import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Eye, EyeOff, Smile } from 'lucide-react';
import toast from 'react-hot-toast';

export function LoginPage({ onNavigate }) {
  const { login, DEMO_USERS } = useAuth();

  // Multi-tenant school: 'sch_jd_intl' (School A) vs 'sch_dps_branch2' (School B)
  const [selectedTenant, setSelectedTenant] = useState('sch_jd_intl');

  // Active tab: 'admin', 'staff', 'student'
  const [activeTab, setActiveTab] = useState('admin');
  
  // Form fields
  const [username, setUsername] = useState('8947919195');
  const [password, setPassword] = useState('12345678');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Helper to sync inputs based on tenant and tab
  const syncCredentials = (tenant, tab) => {
    if (tab === 'admin') {
      if (tenant === 'sch_dps_branch2') {
        setUsername('9810011223');
        setPassword('12345678');
      } else {
        setUsername('8947919195');
        setPassword('12345678');
      }
    } else if (tab === 'staff') {
      if (tenant === 'sch_dps_branch2') {
        setUsername('9810022334');
        setPassword('12345678');
      } else {
        setUsername('9079909813');
        setPassword('12345678');
      }
    } else if (tab === 'student') {
      if (tenant === 'sch_dps_branch2') {
        setUsername('9810033445');
        setPassword('9810033445');
      } else {
        setUsername('6377281034');
        setPassword('6377281034');
      }
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    syncCredentials(selectedTenant, tab);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!username.trim()) {
      toast.error('Enter registered mobile no. or email!');
      return;
    }
    if (!password) {
      toast.error('Enter password!');
      return;
    }

    setIsLoading(true);

    try {
      // Call backend auth endpoint with tenant header
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-school-id': selectedTenant
        },
        body: JSON.stringify({
          username,
          password,
          type: activeTab === 'admin' ? (username === 'superadmin' ? 1 : 2) : activeTab === 'staff' ? 3 : 4,
          isSuperAdmin: username === 'superadmin'
        })
      });

      if (res.ok) {
        const data = await res.json();
        login(data.data.user, data.data.token);
        toast.success(`Welcome ${data.data.user.name || 'User'}! (${data.data.user.schoolName})`);
        if (onNavigate) onNavigate('/dashboard');
        return;
      }
    } catch (err) {
      // Backend offline fallback
    } finally {
      setIsLoading(false);
    }

    // Client-side fallback authentication strictly scoped to active tenant
    let targetUser = DEMO_USERS.ADMIN;
    if (username.trim() === '6377281034' || activeTab === 'student') {
      targetUser = selectedTenant === 'sch_dps_branch2' ? DEMO_USERS.STUDENT_B : DEMO_USERS.STUDENT;
    } else if (username === 'superadmin') {
      targetUser = DEMO_USERS.SUPER_ADMIN;
    } else if (selectedTenant === 'sch_dps_branch2') {
      targetUser = activeTab === 'admin' ? DEMO_USERS.ADMIN_B : activeTab === 'staff' ? DEMO_USERS.STAFF_B : DEMO_USERS.STUDENT_B;
    } else {
      targetUser = activeTab === 'admin' ? DEMO_USERS.ADMIN : activeTab === 'staff' ? DEMO_USERS.STAFF : DEMO_USERS.STUDENT;
    }

    login(targetUser, 'local_demo_token');
    toast.success(`Welcome, ${targetUser.name}! (${targetUser.schoolName})`);
    if (onNavigate) onNavigate('/dashboard');
  };

  const handleQuickLogin = (roleKey) => {
    const userObj = DEMO_USERS[roleKey];
    if (userObj) {
      login(userObj, `token_${roleKey.toLowerCase()}`);
      toast.success(`Logged into ${userObj.schoolName} as ${userObj.name}`);
      if (onNavigate) onNavigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-[#f4f5f9] px-4 py-8">
      {/* Background Subtle Geometric Tile Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(135deg, #e5e7eb 25%, transparent 25%),
            linear-gradient(225deg, #e5e7eb 25%, transparent 25%),
            linear-gradient(45deg, #e5e7eb 25%, transparent 25%),
            linear-gradient(315deg, #e5e7eb 25%, #f4f5f9 25%)
          `,
          backgroundPosition: '20px 0, 20px 0, 0 0, 0 0',
          backgroundSize: '40px 40px',
          backgroundRepeat: 'repeat'
        }}
      />

      {/* Main Centered Login Card */}
      <div className="relative z-10 w-full max-w-[440px] bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 sm:p-8 backdrop-blur-xs transition-all duration-300">
        {/* Top Header Links */}
        <div className="flex items-center justify-between mb-3 w-full">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('/')}
            className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 cursor-pointer"
          >
            <span>&larr; Back to Overview</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('/register')}
            className="text-[11px] font-bold text-emerald-600 hover:text-emerald-800 cursor-pointer"
          >
            + Register School
          </button>
        </div>

        {/* Top Logo */}
        <div className="flex flex-col items-center justify-center mb-3">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center relative shadow-sm">
            <svg
              viewBox="0 0 100 110"
              className="w-14 h-14 filter drop-shadow-xs"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M50 5 L88 22 C88 65 65 95 50 105 C35 95 12 65 12 22 L50 5 Z"
                fill="#1e3a8a"
                stroke="#3b82f6"
                strokeWidth="2.5"
              />
              <circle cx="35" cy="35" r="3.5" fill="#60a5fa" />
              <circle cx="65" cy="35" r="3.5" fill="#60a5fa" />
              <circle cx="50" cy="45" r="3" fill="#93c5fd" />
              <path d="M35 38 L35 55 L45 65" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" />
              <path d="M65 38 L65 55 L55 65" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" />
              <path d="M50 48 L50 70" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
              <text
                x="50"
                y="85"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="14"
                fontWeight="900"
                fontFamily="system-ui, sans-serif"
                letterSpacing="1"
              >
                UAB
              </text>
            </svg>
          </div>
          <h2 className="text-lg font-bold text-slate-800 mt-1">School Portal Login</h2>
          <p className="text-[11px] text-slate-400">Sign in to access your dashboard</p>
        </div>

        {/* 3 Role Tabs: Admin | Staff | Student */}
        <div className="grid grid-cols-3 border border-slate-200 rounded-xl overflow-hidden mb-4 p-1 bg-slate-50 gap-1">
          {/* Admin Tab */}
          <button
            type="button"
            onClick={() => handleTabChange('admin')}
            className={`flex flex-col items-center justify-center py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              activeTab === 'admin'
                ? 'bg-[#dbeafe] text-[#1d4ed8] shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4 mb-0.5" />
            <span>Admin</span>
          </button>

          {/* Staff Tab */}
          <button
            type="button"
            onClick={() => handleTabChange('staff')}
            className={`flex flex-col items-center justify-center py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              activeTab === 'staff'
                ? 'bg-[#ffedd5] text-[#c2410c] shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4 mb-0.5 text-orange-600" />
            <span>Staff</span>
          </button>

          {/* Student Tab */}
          <button
            type="button"
            onClick={() => handleTabChange('student')}
            className={`flex flex-col items-center justify-center py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              activeTab === 'student'
                ? 'bg-[#dcfce7] text-[#15803d] shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
            }`}
          >
            <Smile className="w-4 h-4 mb-0.5 text-green-600" />
            <span>Student</span>
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Mobile/Email Input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 flex items-center justify-between">
              <span>Mobile / Username*</span>
              <span className="text-[10px] text-slate-400 font-mono">
                {activeTab === 'admin' ? '8947919195' : activeTab === 'staff' ? '9079909813' : '6377281034'}
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Mobile / Username"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">Password*</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white pr-9"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2.5 px-4 rounded-xl text-white font-semibold text-xs shadow-md transition-all duration-200 flex items-center justify-center space-x-2 ${
              activeTab === 'staff'
                ? 'bg-[#ea580c] hover:bg-[#c2410c]'
                : activeTab === 'student'
                ? 'bg-[#16a34a] hover:bg-[#15803d]'
                : 'bg-[#4f46e5] hover:bg-[#4338ca]'
            }`}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span>SIGN IN</span>
            )}
          </button>
        </form>

        {/* 1-Tap Quick Credentials Testing Bar */}
        <div className="mt-5 pt-3 border-t border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
            🚀 1-Tap Multi-Tenant Sandbox Tester
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickLogin('ADMIN')}
              className="px-2 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-bold text-left flex items-center space-x-1 border border-blue-200/60"
            >
              <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>
              <span className="truncate">School A Admin</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('ADMIN_B')}
              className="px-2 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-bold text-left flex items-center space-x-1 border border-emerald-200/60"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0"></span>
              <span className="truncate">School B Admin</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('STUDENT')}
              className="px-2 py-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 text-[10px] font-semibold text-left flex items-center space-x-1 border border-green-200/60"
            >
              <span className="w-2 h-2 rounded-full bg-green-600 shrink-0"></span>
              <span className="truncate">School A Student (Aadhya)</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('STUDENT_B')}
              className="px-2 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 text-[10px] font-semibold text-left flex items-center space-x-1 border border-teal-200/60"
            >
              <span className="w-2 h-2 rounded-full bg-teal-600 shrink-0"></span>
              <span className="truncate">School B Student (Rohan)</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('SUPER_ADMIN')}
              className="col-span-2 px-2 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-[10px] font-bold text-center flex items-center justify-center space-x-1.5 border border-purple-200/60"
            >
              <span className="w-2 h-2 rounded-full bg-purple-600"></span>
              <span className="truncate">👑 SuperAdmin (Consolidated Group View)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="mt-4 text-center text-xs text-slate-400">
        <p>Enterprise Multi-Tenant SaaS Architecture &bull; UAB Infosol ERP 2026-2027</p>
      </div>
    </div>
  );
}
