import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Star,
  Users,
  CreditCard,
  Calendar,
  BookOpen,
  Bus,
  Clock,
  Sparkles,
  Layers,
  ChevronRight,
  TrendingUp,
  FileText,
  Smartphone,
  Headphones,
  Database,
  Building2,
  ExternalLink,
  Lock,
  Play,
  Check,
  Zap,
  Globe,
  Award,
  ChevronLeft,
  Activity,
  CheckCircle,
  ShoppingBag,
  Package,
  Cpu,
  FolderGit2,
  DollarSign,
  Shield
} from 'lucide-react';

export function LandingPage({ onNavigate }) {
  const { login } = useAuth();
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [selectedDemoTenant, setSelectedDemoTenant] = useState('sch_jd_intl');

  const handleLaunchDemo = (tenantId = 'sch_jd_intl') => {
    if (tenantId === 'sch_dps_branch2') {
      login('9810011223', '12345678', 'sch_dps_branch2');
    } else {
      login('8947919195', '12345678', 'sch_jd_intl');
    }
    if (onNavigate) onNavigate('/dashboard');
  };

  const navLinks = [
    { label: 'Solutions', href: '#solutions' },
    { label: 'Modules', href: '#modules' },
    { label: 'Integrations', href: '#integrations' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Reviews', href: '#reviews' }
  ];

  const schoolModules = [
    {
      title: 'Fee Counter & Online POS',
      desc: 'Head-wise fee collection, instant thermal & computerized receipts, auto late fines, and UPI gateway reconciliation.',
      icon: CreditCard,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100'
    },
    {
      title: 'Admissions & Student CRM',
      desc: 'Track walk-in enquiries, digital admission forms, parent assessment interviews, and 2-minute paperless onboarding.',
      icon: Users,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100'
    },
    {
      title: 'Timetable Pro & AI Substitution',
      desc: 'Automated conflict-free period scheduling, room allocations, teacher daily desks, and 1-tap substitution.',
      icon: Calendar,
      color: 'text-amber-600 bg-amber-50 border-amber-100'
    },
    {
      title: 'Attendance & Biometrics',
      desc: 'Direct TCP/IP sync for facial recognition, RFID turnstiles, class teacher mobile attendance, and automated WhatsApp alerts.',
      icon: Clock,
      color: 'text-purple-600 bg-purple-50 border-purple-100'
    },
    {
      title: 'NEP 2020 Exams & Gradebook',
      desc: 'Continuous Comprehensive Evaluation (CCE), customizable CBSE/ICSE marksheet templates, and instant SMS results.',
      icon: Award,
      color: 'text-rose-600 bg-rose-50 border-rose-100'
    },
    {
      title: 'HR, Staff & Biometric Payroll',
      desc: 'Staff service records, biometric attendance punch sync, automated PF/ESI deductions, and 1-click payslips.',
      icon: FileText,
      color: 'text-teal-600 bg-teal-50 border-teal-100'
    },
    {
      title: 'Transport & GPS Fleet Safety',
      desc: 'Live school bus GPS tracking on parent mobile apps, pickup/drop geofencing, and transport fee integration.',
      icon: Bus,
      color: 'text-cyan-600 bg-cyan-50 border-cyan-100'
    },
    {
      title: 'Lesson Planning & LMS',
      desc: 'Weekly syllabus pacing, digital homework submissions, study material vaults, and teacher lesson diaries.',
      icon: BookOpen,
      color: 'text-blue-600 bg-blue-50 border-blue-100'
    },
    {
      title: 'Multi-Tenant Trust OS',
      desc: 'Manage multiple school branches under one umbrella with bank-grade data partition, central analytics, and audit logs.',
      icon: Building2,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100'
    }
  ];

  const marqueeTrack1 = [
    { title: 'Fee Counter & POS', desc: '₹ Instant Receipts & Tenders', icon: CreditCard, color: 'bg-indigo-50 text-indigo-600' },
    { title: 'Timetable Pro', desc: '0 Conflict AI Scheduling', icon: Calendar, color: 'bg-amber-50 text-amber-600' },
    { title: 'Biometric Turnstiles', desc: '874 RFID Students Present', icon: Clock, color: 'bg-emerald-50 text-emerald-600' },
    { title: 'CBSE Gradebook', desc: 'NEP 2020 CCE Marksheets', icon: Award, color: 'bg-rose-50 text-rose-600' },
    { title: 'WhatsApp Cloud API', desc: '100% Parent Notice Delivery', icon: Smartphone, color: 'bg-teal-50 text-teal-600' },
    { title: 'Admissions CRM', desc: 'Enquiry to Paperless Enroll', icon: Users, color: 'bg-purple-50 text-purple-600' },
    { title: 'Student Mobile App', desc: 'Real-time Homework & Notices', icon: Smartphone, color: 'bg-blue-50 text-blue-600' }
  ];

  const marqueeTrack2 = [
    { title: 'GPS Fleet Tracking', desc: 'Live Telematics & Geofence', icon: Bus, color: 'bg-cyan-50 text-cyan-600' },
    { title: 'Staff Payroll & HR', desc: 'Biometric Punch & EPF Slips', icon: FileText, color: 'bg-indigo-50 text-indigo-600' },
    { title: 'Library RFID Manager', desc: 'Auto Book Return Alerts', icon: BookOpen, color: 'bg-emerald-50 text-emerald-600' },
    { title: 'Hostel & Mess Desk', desc: 'Daily Meal & Bed Logs', icon: Building2, color: 'bg-amber-50 text-amber-600' },
    { title: 'Tally Prime Sync', desc: 'Direct CA Ledger Export', icon: Database, color: 'bg-teal-50 text-teal-600' },
    { title: 'Parent Fee Portal', desc: 'UPI, QR & NetBanking', icon: DollarSign, color: 'bg-purple-50 text-purple-600' },
    { title: 'Multi-Branch Trust OS', desc: 'Consolidated MIS Reports', icon: Shield, color: 'bg-rose-50 text-rose-600' }
  ];

  const integrations = [
    {
      name: 'Google Workspace & Meet',
      desc: 'Single sign-on (SSO), Google Classroom assignments, and automated Meet links for hybrid classes.',
      iconUrl: 'https://www.gstatic.com/images/branding/product/1x/workspace_2020q4_48dp.png'
    },
    {
      name: 'Razorpay & UPI / QR',
      desc: 'Zero-reconciliation instant fee collections with automated computerized receipt dispatch and daily bank settlements.',
      iconUrl: 'https://cdn.worldvectorlogo.com/logos/razorpay.svg'
    },
    {
      name: 'WhatsApp Cloud API',
      desc: 'Official green-tick notifications for daily attendance, fee due reminders, and exam marks directly on parents\' WhatsApp.',
      iconUrl: 'https://cdn.worldvectorlogo.com/logos/whatsapp-symbol.svg'
    },
    {
      name: 'Biometric Machines (Essl/ZKTeco)',
      desc: 'Direct network sync for staff and student thumbprint scanners, facial recognition, and RFID gate turnstiles.',
      iconUrl: 'https://img.icons8.com/color/48/fingerprint.png'
    },
    {
      name: 'Tally Prime & Busy Sync',
      desc: 'One-click financial journal voucher exports and general ledger syncing for chartered accountants and audit compliance.',
      iconUrl: 'https://img.icons8.com/color/48/accounting.png'
    },
    {
      name: 'Govt. DLT SMS Gateways',
      desc: 'Pre-approved 100% compliant DLT SMS templates for emergency school notices, OTP logins, and administrative circulars.',
      iconUrl: 'https://img.icons8.com/color/48/sms.png'
    }
  ];

  return (
    <div className="w-full bg-white text-slate-900 font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900 scroll-smooth">
      
      {/* ========================================================
          1. TOP NAVIGATION BAR (Exact Reference Match)
      ======================================================== */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo: Circular Icon + SchoolNexus Brand */}
          <div
            className="flex items-center space-x-2.5 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-10 h-10 rounded-full bg-[#232688] flex items-center justify-center text-white shadow-xs">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-[#232688] tracking-tight">
              SchoolNexus
            </span>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center space-x-10 text-sm font-semibold text-slate-600">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-[#232688] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action Buttons: Sign In (Pill) + Get In Touch (Link) */}
          {/* Action Buttons: Sign In (Pill) + Get Started (Link) */}
          <div className="flex items-center space-x-5">
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('/login')}
              className="lp-btn px-6 py-2.5 rounded-full bg-[#232688] hover:bg-[#1a1d68] text-white text-xs sm:text-sm font-bold shadow-sm cursor-pointer"
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => onNavigate && onNavigate('/register')}
              className="text-xs sm:text-sm font-bold text-[#232688] hover:text-indigo-950 transition-colors cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================
          2. HERO SECTION (100% Exact Reference Reproduction)
      ======================================================== */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pt-28 lg:pb-36 bg-white">
        
        {/* Soft Peach/Blush Diagonal Shape Covering Left Half */}
        <div
          className="absolute top-0 left-0 w-full lg:w-[62%] h-full pointer-events-none z-0"
          style={{
            background: 'linear-gradient(125deg, #fcebe5 0%, #fdece6 50%, #fef3ef 100%)',
            clipPath: 'polygon(0 0, 100% 0, 72% 100%, 0 100%)'
          }}
        />

        {/* Top-Right Soft Coral Half-Circle Blob */}
        <div
          className="absolute top-0 right-0 w-80 h-44 rounded-bl-[160px] pointer-events-none z-0"
          style={{
            background: 'linear-gradient(135deg, #fba691 0%, #fcb6a3 100%)'
          }}
        />

        {/* WBPRO Ambient Background Drift Orbs */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-indigo-300/20 blur-3xl pointer-events-none lp-orb-1 z-0" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-rose-200/25 blur-3xl pointer-events-none lp-orb-2 z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Headline, Subtitle, Pill Buttons */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <h1 className="lp-hero-h1-unified text-4xl sm:text-5xl lg:text-[3.35rem] font-extrabold tracking-tight leading-[1.12]">
                The World's Best <br />
                100% Next-Gen ERP
              </h1>

              <p className="text-base text-slate-600 leading-relaxed max-w-md font-normal">
                Used by more than <strong>500+ progressive schools</strong> across the country,
                SchoolNexus is the modern cloud-native alternative to <strong>clunky legacy ERPs</strong>.
              </p>

              {/* Exact CTA Buttons: Sign In (Purple Pill) + Get Started (Bordered Pill) */}
              <div className="flex items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('/login')}
                  className="lp-btn px-7 py-3 rounded-full bg-[#232688] hover:bg-[#1a1d68] text-white font-bold text-sm shadow-md shadow-indigo-900/15 cursor-pointer"
                >
                  Sign In
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('/register')}
                  className="px-7 py-3 rounded-full border-2 border-[#232688] text-[#232688] hover:bg-[#232688]/5 bg-transparent font-bold text-sm transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  Get Started
                </button>
              </div>
            </div>

            {/* Right Column: 3D Layered Mockup Cluster (Exact Reference Layout) */}
            <div className="lg:col-span-7 relative flex justify-center lg:justify-end pt-12 lg:pt-10">
              
              {/* Pink/Coral Dot Matrix Grid (Tucked under bottom-left corner of screen) */}
              <div className="absolute -left-6 bottom-4 w-32 h-28 pointer-events-none z-0">
                <div className="grid grid-cols-6 gap-2.5">
                  {[...Array(30)].map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#f87171]" />
                  ))}
                </div>
              </div>

              {/* Deep Royal Blue Card (Prominently Peeking Out from Behind the Screen) */}
              <div className="absolute -top-7 right-20 w-80 h-44 bg-[#232688] rounded-3xl shadow-xl transform rotate-2 z-0" />

              {/* Top-Right: Analytics Bar Chart Card (Floats Top Right with WBPRO 3D Chip Tilt) */}
              <div className="absolute -top-10 -right-2 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 w-64 z-20 lp-chip-2">
                <div className="flex items-center justify-between pb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ATTENDANCE & FEES</span>
                  <span className="text-xs font-black text-emerald-600 font-mono">96.5%</span>
                </div>
                {/* Vertical Bar Chart Mockup (Green, Violet, Orange alternating) */}
                <div className="flex items-end justify-between space-x-1.5 h-14 pt-2">
                  <div className="w-2.5 bg-emerald-400 rounded-t h-8" />
                  <div className="w-2.5 bg-emerald-500 rounded-t h-12" />
                  <div className="w-2.5 bg-emerald-600 rounded-t h-14" />
                  <div className="w-2.5 bg-indigo-500 rounded-t h-10" />
                  <div className="w-2.5 bg-indigo-600 rounded-t h-13" />
                  <div className="w-2.5 bg-amber-400 rounded-t h-8" />
                  <div className="w-2.5 bg-emerald-500 rounded-t h-14" />
                  <div className="w-2.5 bg-emerald-600 rounded-t h-12" />
                </div>
                <div className="flex justify-between text-[9px] text-slate-400 pt-1.5 font-mono">
                  <span>Mon 1</span>
                  <span>Tue 2</span>
                  <span>Wed 3</span>
                  <span>Thu 4</span>
                </div>
              </div>

              {/* Top-Center: Floating Avatar Card with WBPRO Chip Float */}
              <div className="absolute -top-7 left-14 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 px-4 flex items-center space-x-3 z-20 lp-chip-1">
                <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-200 overflow-hidden flex items-center justify-center text-xl">
                  🎓
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-slate-800 leading-none">Admission Confirmed</p>
                  <p className="text-[9px] text-slate-400 leading-none">Rohan Sharma &bull; Class 10-A</p>
                </div>
              </div>

              {/* Main White POS Terminal with WBPRO Smooth Vertical Float */}
              <div className="relative z-10 w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden lp-mock-float">
                
                {/* Mockup Header Bar */}
                <div className="bg-white px-4 py-2.5 border-b border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block" />
                    <span className="font-bold text-slate-800">Fee Counter POS</span>
                    <span className="text-[10px] text-slate-400">/ Aaditya Singh (Class I-A)</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full lp-pulse-emerald">
                    COUNTER ACTIVE
                  </span>
                </div>

                {/* Internal Split: Left Fee Counter & Payment Tender, Right Live School ERP Operations */}
                <div className="grid grid-cols-12 divide-x divide-slate-100 text-xs">
                  
                  {/* Left Column (7 cols): Student Fee Ledger Table + Payment Tender Box */}
                  <div className="col-span-7 p-4 space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <span>STUDENT FEE LEDGER</span>
                      <span className="text-indigo-600 font-mono">ADM #1621</span>
                    </div>

                    {/* Clean Realistic Fee Heads Table */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/50 border border-emerald-100 text-[11px]">
                        <div className="flex items-center space-x-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span className="font-semibold text-slate-800">Tuition Fee (Quarter 1)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">PAID</span>
                          <span className="font-mono font-bold text-slate-900">₹ 12,000</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-lg bg-rose-50/50 border border-rose-100 text-[11px]">
                        <div className="flex items-center space-x-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          <span className="font-semibold text-slate-800">Tuition Fee (Quarter 2)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-800">DUE</span>
                          <span className="font-mono font-bold text-rose-600">₹ 12,000</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50/50 border border-amber-100 text-[11px]">
                        <div className="flex items-center space-x-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <span className="font-semibold text-slate-800">Activity & Sports Fee</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">DUE</span>
                          <span className="font-mono font-bold text-rose-600">₹ 1,500</span>
                        </div>
                      </div>
                    </div>

                    {/* Total Tally Line */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-400 text-[11px] block">Total Annual Structure</span>
                        <span className="font-mono text-slate-800 font-bold">₹ 25,500</span>
                      </div>
                      <div className="text-right">
                        <span className="text-rose-600 text-[11px] font-bold block uppercase tracking-wider">Due to Collect</span>
                        <span className="font-mono text-rose-600 font-black text-sm">₹ 13,500</span>
                      </div>
                    </div>

                    {/* Payment Tender Selector & One-Click POS Collection */}
                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      <div className="grid grid-cols-4 gap-1 text-[10px] font-bold">
                        <button type="button" className="py-1 px-1.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 text-center font-medium">
                          UPI / QR
                        </button>
                        <button type="button" className="py-1 px-1.5 rounded bg-slate-50 border border-slate-200 text-slate-600 text-center font-medium">
                          NetBanking
                        </button>
                        <button type="button" className="py-1 px-1.5 rounded bg-slate-50 border border-slate-200 text-slate-600 text-center font-medium">
                          Cash
                        </button>
                        <button type="button" className="py-1 px-1.5 rounded bg-slate-50 border border-slate-200 text-slate-600 text-center font-medium">
                          Cheque
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleLaunchDemo('sch_jd_intl')}
                        className="lp-btn w-full py-2.5 px-3 rounded-xl bg-[#232688] hover:bg-[#1a1d68] text-white font-bold text-xs shadow-sm flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Collect ₹ 13,500 & Print Receipt</span>
                      </button>
                    </div>
                  </div>

                  {/* Right Column (5 cols): Live School ERP Operations & Widgets */}
                  <div className="col-span-5 p-4 space-y-2.5 bg-slate-50/50">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <span>CAMPUS LIVE DESK</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>

                    <div className="space-y-2">
                      {/* School Widget 1: Timetable Pro */}
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1.5">
                            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                            <span className="font-bold text-slate-800 text-[11px]">Timetable Pro</span>
                          </div>
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                            0 Conflicts
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-tight">
                          Class 10-A &bull; Period 2: <strong>Mathematics (Room 102)</strong>
                        </p>
                      </div>

                      {/* School Widget 2: Biometric Turnstile */}
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1.5">
                            <Clock className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="font-bold text-slate-800 text-[11px]">Biometric Gate</span>
                          </div>
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 font-mono">
                            96.5% Synced
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-tight">
                          Gate #1 RFID Turnstile &bull; <strong>874 Students Present</strong>
                        </p>
                      </div>

                      {/* School Widget 3: NEP 2020 Gradebook */}
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1.5">
                            <Award className="w-3.5 h-3.5 text-rose-600" />
                            <span className="font-bold text-slate-800 text-[11px]">CBSE Gradebook</span>
                          </div>
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-50 text-amber-800">
                            NEP 2020
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-tight">
                          Term 1 CCE Marksheets &bull; <strong>928 Ready to Export</strong>
                        </p>
                      </div>

                      {/* School Widget 4: WhatsApp Cloud API */}
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1.5">
                            <Smartphone className="w-3.5 h-3.5 text-teal-600" />
                            <span className="font-bold text-slate-800 text-[11px]">WhatsApp Alerts</span>
                          </div>
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-teal-50 text-teal-800">
                            Live API
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-tight">
                          Daily Attendance & Fee Slips &bull; <strong>100% Delivered</strong>
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>

          </div>
        </div>

        {/* ========================================================
            ANIMATED FLUID RUNNING WAVE DIVIDER (Exact Reference Match)
        ======================================================== */}
        <div
          className="absolute -bottom-1 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none z-10"
          style={{ filter: 'drop-shadow(0 -4px 14px rgba(35, 38, 136, 0.08))' }}
        >
          <svg
            viewBox="0 24 150 28"
            preserveAspectRatio="none"
            shapeRendering="auto"
            className="relative block w-full h-14 sm:h-20 lg:h-24 -mb-px"
          >
            <defs>
              <path
                id="lp-gentle-wave"
                d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
              />
              {/* Layer 1: Elegant Soft Peach / Coral Wave (Matches hero background shape) */}
              <linearGradient id="lp-wave-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fba691" stopOpacity="0.55" />
                <stop offset="50%" stopColor="#fcb6a3" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#fdece6" stopOpacity="0.55" />
              </linearGradient>
              {/* Layer 2: Deep Brand Royal Blue / Indigo Wave (#232688) */}
              <linearGradient id="lp-wave-grad-2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#232688" stopOpacity="0.28" />
                <stop offset="50%" stopColor="#3730a3" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.30" />
              </linearGradient>
              {/* Layer 3: Soft Lavender / Indigo Ice Wave */}
              <linearGradient id="lp-wave-grad-3" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#c7d2fe" stopOpacity="0.80" />
                <stop offset="50%" stopColor="#e0e7ff" stopOpacity="0.90" />
                <stop offset="100%" stopColor="#ede9fe" stopOpacity="0.85" />
              </linearGradient>
            </defs>
            <g className="lp-wave-parallax">
              <use href="#lp-gentle-wave" xlinkHref="#lp-gentle-wave" x="48" y="0" fill="url(#lp-wave-grad-1)" />
              <use href="#lp-gentle-wave" xlinkHref="#lp-gentle-wave" x="48" y="2" fill="url(#lp-wave-grad-2)" />
              <use href="#lp-gentle-wave" xlinkHref="#lp-gentle-wave" x="48" y="4" fill="url(#lp-wave-grad-3)" />
              <use href="#lp-gentle-wave" xlinkHref="#lp-gentle-wave" x="48" y="6" fill="#ffffff" />
            </g>
          </svg>
        </div>
      </section>

      {/* ========================================================
          3. CAMPUS / DIGITAL SMART CLASSROOM PANORAMA PHOTO
      ======================================================== */}
      <section id="solutions" className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 max-h-[420px]">
          <img
            src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1600&auto=format&fit=crop"
            alt="Modern High-Tech Campus Lab and Faculty"
            className="w-full h-full object-cover object-center filter brightness-[0.94]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6 sm:p-10">
            <div className="text-white space-y-1">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/20 backdrop-blur-md uppercase tracking-wider">
                Digital Campus Operations
              </span>
              <h3 className="text-xl sm:text-2xl font-black">
                Transforming Daily School Life for 250,000+ Students & Teachers
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 max-w-xl">
                From morning biometric attendance to afternoon fee reconciliation and exam gradebooks, SchoolNexus streamlines all campus workflows.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. WBPRO CONTINUOUS DUAL-TRACK MODULE MARQUEE (wbpro.in style)
      ======================================================== */}
      <section className="py-12 bg-slate-50/80 border-y border-slate-200/80 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center space-y-2">
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/70 px-3 py-1 rounded-full uppercase tracking-wider inline-block">
            Enterprise Campus Engine
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#232688] tracking-tight">
            30+ Dedicated Modules Operating in Real-Time
          </h3>
        </div>

        {/* Track 1: Smooth Left Flow */}
        <div className="relative w-full overflow-hidden mb-3">
          <div className="lp-mod-track-left">
            {[...marqueeTrack1, ...marqueeTrack1].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center space-x-3 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-2xs hover:border-indigo-300 transition-all cursor-default"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.color}`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-800 leading-tight whitespace-nowrap">{item.title}</p>
                  <p className="text-[10px] text-slate-400 whitespace-nowrap">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Track 2: Smooth Right Flow */}
        <div className="relative w-full overflow-hidden">
          <div className="lp-mod-track-right">
            {[...marqueeTrack2, ...marqueeTrack2].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center space-x-3 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-2xs hover:border-indigo-300 transition-all cursor-default"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.color}`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-800 leading-tight whitespace-nowrap">{item.title}</p>
                  <p className="text-[10px] text-slate-400 whitespace-nowrap">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          5. ONE STOP SHOP FOR YOUR SCHOOL (WBPRO Interactive Grid)
      ======================================================== */}
      <section id="modules" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#232688] tracking-tight">
              One Stop Shop for your School
            </h2>
            <p className="text-sm sm:text-base text-slate-500">
              Everything your administration, accounts, academics, and parents need—seamlessly connected under one roof.
            </p>
          </div>

          {/* 3x3 Cards Grid with WBPRO Lift & Icon Tilt */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schoolModules.map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.title}
                  className="lp-feature-card bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between group cursor-default"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-[#232688] transition-colors">
                        {m.title}
                      </h3>
                      <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${m.color} lp-icon-badge`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed">
                      {m.desc}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#232688]">
                    <span>Explore Module Details</span>
                    <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center pt-4">
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('/login')}
              className="lp-btn px-6 py-2.5 rounded-full border border-slate-300 hover:border-[#232688] text-slate-700 hover:text-[#232688] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Read Full Documentation
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          6. DEEP BLUE TESTIMONIAL BANNER (Exact ERPuppy Style)
      ======================================================== */}
      <section id="reviews" className="py-20 bg-[#232688] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Rating Badge */}
            <div className="lg:col-span-4 bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/15 text-center flex flex-col items-center justify-center space-y-2">
              <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-indigo-200">
                <span>EdTech Excellence Rating</span>
              </div>

              <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight">
                4.92
              </div>

              <div className="flex items-center space-x-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400" />
                ))}
              </div>
            </div>

            {/* Right Large Quotation */}
            <div className="lg:col-span-8 space-y-5 lg:pl-6 text-left">
              <blockquote className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-snug tracking-tight">
                "Fast setup, catering for all CBSE, ICSE, and state board needs and ready to use from day one! Our fee collection cycle dropped from 3 weeks to 4 days."
              </blockquote>

              <div className="pt-2">
                <p className="text-sm font-bold text-white">Dr. Rajeshwar Sharma</p>
                <p className="text-xs text-indigo-200">Director of Academic Operations &bull; Delhi Public Academy Network</p>
              </div>

              {/* Pagination Dots */}
              <div className="flex items-center space-x-2 pt-2">
                <div className="w-6 h-2 rounded-full bg-white" />
                <div className="w-2 h-2 rounded-full bg-white/40" />
                <div className="w-2 h-2 rounded-full bg-white/40" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          7. WORKS WITH YOUR FAVOURITE APPS (Exact 6 Cards)
      ======================================================== */}
      <section id="integrations" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#232688] tracking-tight">
              Works With Your Favourite Apps
            </h2>
            <p className="text-sm sm:text-base text-slate-500">
              SchoolNexus has a host of built-in native integrations to help your institution take off faster.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrations.map((app) => (
              <div
                key={app.name}
                className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-2">
                    <img src={app.iconUrl} alt={app.name} className="w-full h-full object-contain" />
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900">{app.name}</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{app.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('/login')}
              className="px-6 py-2.5 rounded-full border border-slate-300 hover:border-slate-800 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
            >
              View All Integrations
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          8. READY TO GET STARTED? (Peach Banner + 2 Cards)
      ======================================================== */}
      <section id="pricing" className="py-16 sm:py-24 bg-[#fff1ee]/80 border-t border-rose-100/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Header & Main Call to Action */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-rose-200/60">
            <div className="space-y-2 max-w-xl">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#232688] tracking-tight">
                Ready to Get Started?
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Start a 14 day trial to get instant access to your own dedicated SchoolNexus sandbox.
                Get expert onboarding and world-class cloud hosting too.
              </p>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('/login')}
                className="px-8 py-3.5 rounded-full bg-[#232688] hover:bg-[#1a1d68] text-white font-bold text-sm shadow-lg shadow-indigo-950/20 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </div>

          {/* 2 Benefit Cards (Support & 100% Next-Gen Cloud) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">Dedicated School Support</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  For self-registered & enterprise schools, we assign dedicated onboarding engineers, daily hotline phone support, and WhatsApp helpdesks.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('/register')}
                  className="px-5 py-2 rounded-full border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Get a Quote
                </button>
                <Headphones className="w-6 h-6 text-rose-300" />
              </div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">100% Next-Gen Cloud</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Zero on-premise server maintenance. Multi-tenant database partition, daily automated encrypted backups, and ISO 27001 compliance.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setDemoModalOpen(true)}
                  className="px-5 py-2 rounded-full border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Explore Demo
                </button>
                <FolderGit2 className="w-6 h-6 text-indigo-300" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          9. FOOTER
      ======================================================== */}
      <footer className="bg-white border-t border-slate-200 py-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-[#232688] flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-base font-black text-slate-900">SchoolNexus</span>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('/login')}
                className="hover:text-slate-900 font-semibold cursor-pointer"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('/register')}
                className="hover:text-slate-900 font-semibold cursor-pointer"
              >
                Get Started
              </button>
              <button
                type="button"
                onClick={() => handleLaunchDemo('sch_jd_intl')}
                className="hover:text-slate-900 font-semibold cursor-pointer text-indigo-600"
              >
                Demo Sandbox A (JDIS)
              </button>
              <button
                type="button"
                onClick={() => handleLaunchDemo('sch_dps_branch2')}
                className="hover:text-slate-900 font-semibold cursor-pointer text-emerald-600"
              >
                Demo Sandbox B (DPS)
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400">
            <p>&copy; 2026 SchoolNexus ERP Inc. All rights reserved. The World's Best Next-Gen School ERP.</p>
            <p>99.99% Cloud Uptime &bull; Multi-Tenant Architecture &bull; CBSE / ICSE Compliant</p>
          </div>
        </div>
      </footer>

      {/* ========================================================
          10. INTERACTIVE 1-CLICK DEMO MODAL
      ======================================================== */}
      {demoModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-[#232688] flex items-center justify-center mx-auto text-xl font-bold">
                🚀
              </div>
              <h3 className="text-lg font-black text-slate-900">Select Interactive School Demo</h3>
              <p className="text-xs text-slate-500">
                Experience live multi-tenant isolation. Both schools run on isolated ledgers with real pre-loaded students & fee accounts.
              </p>
            </div>

            <div className="space-y-3">
              <div
                onClick={() => setSelectedDemoTenant('sch_jd_intl')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedDemoTenant === 'sch_jd_intl'
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-2 ring-indigo-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                      JD
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">J D International School</h4>
                      <p className="text-[11px] text-slate-500">Jaipur &bull; CBSE #1730619</p>
                    </div>
                  </div>
                  {selectedDemoTenant === 'sch_jd_intl' && (
                    <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                  )}
                </div>
              </div>

              <div
                onClick={() => setSelectedDemoTenant('sch_dps_branch2')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedDemoTenant === 'sch_dps_branch2'
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                      DPS
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Delhi Public Academy</h4>
                      <p className="text-[11px] text-slate-500">Dwarka, New Delhi &bull; CBSE #2730119</p>
                    </div>
                  </div>
                  {selectedDemoTenant === 'sch_dps_branch2' && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setDemoModalOpen(false)}
                className="w-1/2 py-2.5 rounded-full border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setDemoModalOpen(false);
                  handleLaunchDemo(selectedDemoTenant);
                }}
                className="w-1/2 py-2.5 rounded-full bg-[#232688] hover:bg-indigo-900 text-white text-xs font-bold shadow-md cursor-pointer transition-colors"
              >
                Launch Sandbox &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
