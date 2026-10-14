import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  BookOpen,
  CreditCard,
  Calendar,
  FileText,
  Award,
  BookMarked,
  Contact,
  Ticket,
  DoorOpen,
  Bus,
  ClipboardCheck,
  Bell,
  Cake,
  Download,
  CheckCircle2,
  Clock,
  ChevronRight,
  ArrowLeft,
  Printer,
  FileCheck,
  AlertCircle,
  Video,
  FileSpreadsheet,
  FileEdit,
  Landmark,
  Receipt,
  CalendarCheck,
  CalendarDays,
  Mail,
  MessageSquare,
  HelpCircle,
  GraduationCap,
  FolderHeart,
  Users,
  Newspaper,
  Image,
  Share2,
  ExternalLink,
  Check,
  X,
  Upload,
  User,
  Phone,
  MapPin,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import toast from 'react-hot-toast';

export function StudentPortalPage({ onNavigate }) {
  const { user, schoolName } = useAuth();

  // Active view or modal: null (dashboard) or modal id
  const [activeModal, setActiveModal] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('October 2026');
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [paymentStep, setPaymentStep] = useState(null); // 'gateway' | 'success'
  const [leaveForm, setLeaveForm] = useState({ type: 'Sick Leave', from: '2026-10-15', to: '2026-10-16', reason: '' });
  const [leaveHistory, setLeaveHistory] = useState([
    { id: 1, type: 'Sick Leave', from: '02-Aug-2026', to: '03-Aug-2026', reason: 'Viral fever & doctor rest advice', status: 'Approved' }
  ]);
  const [homeworkStatus, setHomeworkStatus] = useState({
    1: 'Submitted',
    2: 'Pending',
    3: 'Submitted',
    4: 'Pending'
  });

  // Authentic Student Metadata (1:1 with UAB production student 6377281034)
  const student = {
    name: user?.name || 'AADHYA CHOUDHARY',
    className: user?.className || 'Nursery - PP3+',
    division: user?.division || 'A',
    srNo: user?.srNo || '2059',
    rollNo: user?.rollNo || '14',
    admDate: '01-04-2026',
    fatherName: user?.fatherName || 'OM PRAKASH JAT',
    motherName: user?.motherName || 'KIRAN JAT',
    contactNo: user?.contactNo || '6377281034',
    dob: user?.dob || '2022-12-20',
    gender: user?.gender || 'Female',
    bloodGroup: user?.bloodGroup || 'O+',
    address: user?.address || 'Mahapura, Ajmer Road, Jaipur, Rajasthan - 302026',
    schoolName: user?.schoolName || schoolName || 'J D International School',
    schoolCode: user?.schoolCode || '10964',
    afflNo: '1730619',
    sessionId: '2026-2027',
    attendancePercent: 92,
    presentDays: 23,
    absentDays: 2,
    totalWorkingDays: 25,
    feeStatus: 'Paid',
    totalFees: 36000,
    paidFees: 36000,
    dueFees: 0,
    avatar: user?.avatar || 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=150',
    schoolLogo: '/logo.svg'
  };

  // Sibling switcher data
  const [activeSiblingId, setActiveSiblingId] = useState('822');
  const siblings = [
    { id: '822', name: 'Aadhya Choudhary', class: 'Nursery - PP3+', avatar: student.avatar },
    { id: '823', name: 'Vivaan Choudhary', class: 'Class 2-B', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' }
  ];

  // Fee Heads Breakdown
  const feeHeads = [
    { head: 'Tuition Fee (Quarterly)', total: 24000, paid: 24000, due: 0, status: 'Paid' },
    { head: 'Annual Development Charges', total: 6000, paid: 6000, due: 0, status: 'Paid' },
    { head: 'Computer & Smart Class Fee', total: 3000, paid: 3000, due: 0, status: 'Paid' },
    { head: 'Examination & Activity Fee', total: 3000, paid: 3000, due: 0, status: 'Paid' }
  ];

  // Fee Receipts
  const feeReceipts = [
    { receiptNo: 'JDIS/2026/0892', date: '10-Apr-2026', head: 'Term 1 Tuition + Admission', amount: 18000, mode: 'UPI / Online', status: 'Success' },
    { receiptNo: 'JDIS/2026/1420', date: '08-Jul-2026', head: 'Term 2 Tuition + Smart Class', amount: 9000, mode: 'Net Banking', status: 'Success' },
    { receiptNo: 'JDIS/2026/2180', date: '05-Oct-2026', head: 'Term 3 Tuition + Activity', amount: 9000, mode: 'Cash Counter', status: 'Success' }
  ];

  // Homework items
  const homeworkList = [
    { id: 1, subject: 'English', title: 'Alphabet cursive writing pages 12-14', dueDate: '15-Oct-2026', teacher: 'Sunita Kumari', desc: 'Complete letter tracing P to T in workbook.' },
    { id: 2, subject: 'Mathematics', title: 'Numbers counting 1 to 50 worksheet', dueDate: '16-Oct-2026', teacher: 'Priti Verma', desc: 'Count the stars and fill correct numbers in box.' },
    { id: 3, subject: 'Hindi', title: 'Swar varnamala recognition & drawing', dueDate: '17-Oct-2026', teacher: 'Kavita Sharma', desc: 'Draw pictures matching varnamala letters.' },
    { id: 4, subject: 'General Awareness', title: 'Color the fruits & vegetables chart', dueDate: '18-Oct-2026', teacher: 'Sunita Kumari', desc: 'Color apples red and peas green.' }
  ];

  // Exam DateSheet
  const dateSheet = [
    { date: '20-Oct-2026', day: 'Tuesday', subject: 'English Oral & Rhymes', time: '09:00 AM - 11:30 AM', room: 'Room 102', syllabus: 'Rhymes: Twinkle Twinkle, Baa Baa Black Sheep' },
    { date: '22-Oct-2026', day: 'Thursday', subject: 'Mathematics Written', time: '09:00 AM - 11:30 AM', room: 'Room 102', syllabus: 'Numbers 1 to 50 & Shapes identification' },
    { date: '24-Oct-2026', day: 'Saturday', subject: 'Hindi & Kavita', time: '09:00 AM - 11:30 AM', room: 'Room 102', syllabus: 'Swar Varnamala & Chanda Mama poem' },
    { date: '27-Oct-2026', day: 'Tuesday', subject: 'General Awareness & Drawing', time: '09:00 AM - 11:30 AM', room: 'Room 102', syllabus: 'Colors, Fruits, Animals & Free hand drawing' }
  ];

  // Result / Marksheet
  const results = [
    { subject: 'English Oral & Writing', maxMarks: 100, obtained: 95, grade: 'A1', remarks: 'Outstanding phonetics & expression' },
    { subject: 'Mathematics & Numbers', maxMarks: 100, obtained: 98, grade: 'A1', remarks: 'Exceptional number concepts' },
    { subject: 'Hindi (Kavita & Swar)', maxMarks: 100, obtained: 92, grade: 'A1', remarks: 'Very neat handwriting' },
    { subject: 'General Awareness & EVS', maxMarks: 100, obtained: 96, grade: 'A1', remarks: 'Active classroom curiosity' },
    { subject: 'Art, Craft & Rhymes', maxMarks: 100, obtained: 94, grade: 'A1', remarks: 'Creative color sense & rhythm' }
  ];

  // Monthly Attendance Matrix (October 2026)
  const attendanceCalendar = [
    { day: 1, status: 'P', timeIn: '08:04 AM', timeOut: '02:15 PM' },
    { day: 2, status: 'H', desc: 'Gandhi Jayanti' },
    { day: 3, status: 'P', timeIn: '08:05 AM', timeOut: '02:15 PM' },
    { day: 4, status: 'Sun', desc: 'Sunday' },
    { day: 5, status: 'P', timeIn: '08:02 AM', timeOut: '02:15 PM' },
    { day: 6, status: 'P', timeIn: '08:07 AM', timeOut: '02:15 PM' },
    { day: 7, status: 'P', timeIn: '08:01 AM', timeOut: '02:15 PM' },
    { day: 8, status: 'P', timeIn: '08:05 AM', timeOut: '02:15 PM' },
    { day: 9, status: 'Ab', desc: 'Leave note submitted' },
    { day: 10, status: 'P', timeIn: '08:06 AM', timeOut: '02:15 PM' },
    { day: 11, status: 'Sun', desc: 'Sunday' },
    { day: 12, status: 'P', timeIn: '08:03 AM', timeOut: '02:15 PM' },
    { day: 13, status: 'P', timeIn: '08:05 AM', timeOut: '02:15 PM' },
    { day: 14, status: 'P', timeIn: '08:00 AM', timeOut: '02:15 PM' },
    { day: 15, status: 'Upcoming' },
    { day: 16, status: 'Upcoming' },
    { day: 17, status: 'Upcoming' },
    { day: 18, status: 'Sun', desc: 'Sunday' }
  ];

  // Circulars & Notices
  const circulars = [
    { id: 1, date: '10-Oct-2026', title: 'Dussehra & Autumn Break Notification', desc: 'School will observe Autumn Break from 20th Oct to 24th Oct 2026.', file: 'Autumn_Break_2026.pdf' },
    { id: 2, date: '05-Oct-2026', title: 'Periodic Test 2 Datesheet & Syllabus', desc: 'Please find enclosed the timetable for upcoming PT-2 examinations.', file: 'PT2_Timetable.pdf' },
    { id: 3, date: '28-Sep-2026', title: 'Winter Uniform Transition Guidelines', desc: 'Winter uniform guidelines applicable from 1st November 2026.', file: 'Winter_Uniform_Policy.pdf' }
  ];

  // UAB Module Categories (1:1 with live Angular categories)
  const primaryCategories = [
    {
      id: 'academics',
      title: 'Academics',
      icon: BookOpen,
      iconColor: 'text-indigo-600 bg-indigo-50',
      items: [
        { id: 'syllabus', label: 'Syllabus', icon: BookMarked },
        { id: 'study-material', label: 'Study Material', icon: FileSpreadsheet },
        { id: 'assignment', label: 'Assignment', icon: FileEdit },
        { id: 'online-classes', label: 'Online Classes', icon: Video },
        { id: 'homework', label: 'Homework', icon: BookOpen },
        { id: 'timetable', label: 'Time Table', icon: Clock }
      ]
    },
    {
      id: 'fees',
      title: 'Fees & Payments',
      icon: Landmark,
      iconColor: 'text-emerald-600 bg-emerald-50',
      items: [
        { id: 'fee', label: 'Fee Ledger', icon: CreditCard },
        { id: 'fee-receipt', label: 'Fee Receipt', icon: Receipt },
        { id: 'pay-online', label: 'Pay Online', icon: CreditCard },
        { id: 'fee-statement', label: 'Fee Statement', icon: FileText }
      ]
    },
    {
      id: 'exams',
      title: 'Exam & Result',
      icon: Award,
      iconColor: 'text-rose-600 bg-rose-50',
      items: [
        { id: 'datesheet', label: 'DateSheet', icon: Calendar },
        { id: 'admit-card', label: 'Admit Card', icon: Ticket },
        { id: 'result', label: 'Result', icon: Award }
      ]
    },
    {
      id: 'attendance-disp',
      title: 'Attendance & Discipline',
      icon: CalendarCheck,
      iconColor: 'text-purple-600 bg-purple-50',
      items: [
        { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
        { id: 'gate-pass', label: 'Gate Pass', icon: DoorOpen },
        { id: 'leave-request', label: 'Leave Request', icon: ClipboardCheck }
      ]
    }
  ];

  const secondaryCategories = [
    {
      id: 'comm',
      title: 'Communication',
      icon: Mail,
      iconColor: 'text-sky-600 bg-sky-50',
      items: [
        { id: 'circular', label: 'Circular', icon: Bell },
        { id: 'notifications', label: 'Notifications', icon: AlertCircle },
        { id: 'sms', label: 'SMS Alerts', icon: MessageSquare },
        { id: 'complaint', label: 'Complaints', icon: HelpCircle }
      ]
    },
    {
      id: 'student-info',
      title: 'Student Information',
      icon: GraduationCap,
      iconColor: 'text-teal-600 bg-teal-50',
      items: [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'id-card', label: 'ID Card', icon: Contact },
        { id: 'transport', label: 'Transport', icon: Bus },
        { id: 'portfolio', label: 'Portfolio', icon: FolderHeart }
      ]
    },
    {
      id: 'planning',
      title: 'Planning & Scheduling',
      icon: CalendarDays,
      iconColor: 'text-blue-600 bg-blue-50',
      items: [
        { id: 'calendar-planning', label: 'Calendar Planning', icon: CalendarDays }
      ]
    },
    {
      id: 'social',
      title: 'Social & Community',
      icon: Users,
      iconColor: 'text-amber-600 bg-amber-50',
      items: [
        { id: 'birthday', label: 'Birthday', icon: Cake },
        { id: 'batchmates', label: 'Batchmates', icon: Users },
        { id: 'news', label: 'School News', icon: Newspaper },
        { id: 'gallery', label: 'Gallery', icon: Image }
      ]
    }
  ];

  const handlePayOnlineSubmit = () => {
    setPaymentStep('success');
    toast.success('Payment of ₹36,000 verified via Atom Payment Gateway!');
  };

  const handleLeaveSubmit = (e) => {
    e.preventDefault();
    if (!leaveForm.reason.trim()) {
      toast.error('Please enter reason for leave!');
      return;
    }
    const newEntry = {
      id: Date.now(),
      type: leaveForm.type,
      from: leaveForm.from,
      to: leaveForm.to,
      reason: leaveForm.reason,
      status: 'Pending'
    };
    setLeaveHistory([newEntry, ...leaveHistory]);
    setLeaveForm({ ...leaveForm, reason: '' });
    toast.success('Leave application submitted to Class Teacher!');
  };

  return (
    <div className="bg-[#f3f6fa] min-h-screen px-3 sm:px-6 py-4 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* ==================== TOP SIBLING SELECTOR BAR ==================== */}
        <div className="relative w-full">
          <div className="flex gap-2 sm:gap-3 py-1 overflow-x-auto no-scrollbar scroll-smooth">
            {siblings.map((sib) => {
              const isActive = sib.id === activeSiblingId;
              return (
                <div
                  key={sib.id}
                  onClick={() => setActiveSiblingId(sib.id)}
                  className={`flex-shrink-0 rounded-xl px-3 py-1.5 flex items-center gap-2.5 cursor-pointer transition-all duration-200 border ${
                    isActive
                      ? 'bg-white border-blue-600 shadow-md ring-2 ring-blue-500/20 scale-[1.02]'
                      : 'bg-white/80 border-slate-200/80 hover:bg-white hover:shadow-xs'
                  }`}
                >
                  <img
                    src={sib.avatar}
                    alt={sib.name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-slate-200"
                  />
                  <div className="flex flex-col">
                    <span className="text-[11px] sm:text-xs font-bold text-slate-800 whitespace-nowrap leading-tight">
                      {sib.name}
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-blue-600 font-semibold leading-tight">
                      {sib.class}
                    </span>
                  </div>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 ml-1"></span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ==================== 1:1 AUTHENTIC HERO PROFILE CARD ==================== */}
        <div className="relative overflow-hidden rounded-[24px] shadow-lg bg-white border border-slate-100">
          {/* Background Illustration from Live UAB Production */}
          <img
            src="/student-background-image.png"
            alt="Hero Background"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-95"
            onError={(e) => {
              // Fallback gradient if image not found
              e.currentTarget.style.display = 'none';
            }}
          />

          {/* Top-Left Date Pill */}
          <div
            onClick={() => setActiveModal('attendance')}
            className="absolute left-4 top-3.5 z-20 flex items-center gap-2 bg-[#2563EB] text-white rounded-full px-3 sm:px-4 py-1.5 shadow-md cursor-pointer hover:bg-blue-700 transition-colors"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span className="font-semibold text-xs tracking-tight">13 Oct 2026</span>
            <ChevronRight className="w-3 h-3 opacity-80" />
          </div>

          {/* Top-Right Pulse Button */}
          <button
            onClick={() => setActiveModal('online-classes')}
            className="absolute top-3.5 right-4 z-20 bg-blue-600 hover:bg-blue-500 text-white text-xs px-4 py-1.5 rounded-full shadow-md transition-all duration-200 animate-pulse font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Join Live Class</span>
          </button>

          {/* Hero Card Grid */}
          <div className="grid grid-cols-12 h-full relative z-10 pt-16 pb-6 px-4 sm:px-6 gap-4 items-center">
            {/* Student Avatar + Personal Info */}
            <div className="col-span-12 md:col-span-7 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
              <div className="relative shrink-0">
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-20 h-20 rounded-full border-4 border-white shadow-xl object-cover"
                />
                <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#10d85a] border-2 border-white shadow-xs"></span>
              </div>
              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-tight">
                  {student.name}
                </h1>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-0.5">
                  <span className="inline-block px-3 py-0.5 rounded-full bg-[#2563EB] text-white font-semibold text-xs shadow-xs">
                    {student.className} - {student.division}
                  </span>
                  <span className="text-xs font-semibold text-slate-600">
                    SR No: {student.srNo}
                  </span>
                  <span className="text-xs font-semibold text-slate-600">
                    &bull; Roll No: {student.rollNo}
                  </span>
                </div>
                <p className="text-xs text-slate-600 pt-0.5">
                  Father: <span className="font-semibold text-slate-800">{student.fatherName}</span> &bull; Mother: <span className="font-semibold text-slate-800">{student.motherName}</span>
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-2 pt-1 text-xs">
                  <span className="text-[#10d85a] font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#10d85a]"></span> Present Today (08:05 AM)
                  </span>
                  <span className="text-slate-400">&bull;</span>
                  <span className="text-slate-500">{student.schoolName}</span>
                </div>
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="hidden md:flex col-span-1 justify-center items-center">
              <div className="h-28 border-r border-slate-300/80"></div>
            </div>

            {/* Attendance Doughnut Progress Widget (1:1 with chunk 935) */}
            <div className="col-span-12 md:col-span-4 flex flex-col items-center justify-center">
              <div className="flex gap-4 sm:gap-6 mb-1 text-xs font-bold">
                <span className="text-[#10d85a] flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#10d85a]"></span> P: 92%
                </span>
                <span className="text-[#FF4F7A] flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#FF4F7A]"></span> Ab: 8%
                </span>
              </div>

              {/* Circular Doughnut SVG */}
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Background Track */}
                  <path
                    className="text-slate-200"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Absent Track (Pink) */}
                  <path
                    className="text-[#FF4F7A]"
                    strokeDasharray="100, 100"
                    strokeDashoffset="0"
                    strokeWidth="4"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Present Track (Green) */}
                  <path
                    className="text-[#56C271]"
                    strokeDasharray="92, 100"
                    strokeDashoffset="0"
                    strokeWidth="4"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-sm font-extrabold text-slate-800 leading-none">92%</span>
                </div>
              </div>
              <span className="font-bold text-xs text-slate-600 mt-1">Attendance</span>
            </div>
          </div>
        </div>

        {/* ==================== SUMMARY METRIC CARDS (2 COLUMNS) ==================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 1: Attendance Progress */}
          <div
            onClick={() => setActiveModal('attendance')}
            className="rounded-[24px] shadow-sm hover:shadow-md transition-shadow border border-slate-200/80 bg-white p-4 cursor-pointer"
          >
            <div className="flex justify-between items-center">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="text-right">
                <div className="text-gray-500 text-[11px] font-semibold uppercase tracking-wider">Attendance</div>
                <div className="font-bold text-blue-600 text-2xl leading-none mt-1">92%</div>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="mt-3 h-2 rounded-full bg-blue-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-400 to-blue-700 transition-all duration-500"
                style={{ width: '92%' }}
              ></div>
            </div>
            {/* Bottom Row */}
            <div className="flex justify-between items-center mt-2.5 text-xs">
              <span className="text-gray-500 font-medium">This Month</span>
              <span className="text-green-600 font-bold">92% (23/25 Days)</span>
            </div>
          </div>

          {/* Card 2: Fee Status Card */}
          <div
            onClick={() => setActiveModal('fee')}
            className="rounded-[24px] shadow-sm hover:shadow-md transition-shadow border border-slate-200/80 bg-white p-4 cursor-pointer"
          >
            <div className="flex justify-between items-center">
              <div className="w-10 h-10 rounded-2xl bg-green-100 flex items-center justify-center text-green-600">
                <CreditCard className="w-5 h-5" />
              </div>
              <div className="text-right">
                <div className="text-gray-500 text-[11px] font-semibold uppercase tracking-wider">Total Fee</div>
                <div className="font-bold text-slate-900 text-xl leading-none mt-1">₹ 36,000</div>
              </div>
            </div>
            {/* Middle Row */}
            <div className="flex justify-between items-center mt-2 text-xs">
              <span className="text-gray-500 font-medium">T. Paid</span>
              <span className="font-bold text-green-600">₹ 36,000</span>
            </div>
            {/* Bottom Row */}
            <div className="flex justify-between items-center mt-3 text-xs">
              <span className="font-bold text-slate-700">Total Due: ₹ 0</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveModal('fee');
                }}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg px-3.5 py-1 shadow-xs transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>View Ledger</span>
              </button>
            </div>
          </div>
        </div>

        {/* ==================== REMARKS ROW (1:1 with chunk 935) ==================== */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <FileText className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="font-bold">Document Remark:</span>
            <span className="text-slate-500">All admission documents verified (Aadhaar, Birth Certificate, Photo).</span>
          </div>
          <div className="hidden md:block h-5 w-px bg-slate-200"></div>
          <div className="flex items-center gap-2 text-slate-700">
            <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-bold">General/Fee Remark:</span>
            <span className="text-slate-500">Academic progress excellent. Fee fully cleared for 2026-27.</span>
          </div>
        </div>

        {/* ==================== CATEGORISED MENUS SECTION (1:1 with UAB) ==================== */}
        <div className="space-y-3 pt-1">
          {primaryCategories.map((cat) => {
            const CatIcon = cat.icon;
            return (
              <div key={cat.id} className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-4">
                {/* Category Header */}
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${cat.iconColor}`}>
                      <CatIcon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 tracking-tight">
                      {cat.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveModal(cat.items[0].id)}
                    className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 cursor-pointer"
                  >
                    <span>View More</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Submodule Items Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3">
                  {cat.items.map((item) => {
                    const ItemIcon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveModal(item.id)}
                        className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl hover:bg-indigo-50/60 border border-transparent hover:border-indigo-100 transition-all duration-200 group cursor-pointer"
                      >
                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-slate-100 group-hover:bg-indigo-600 flex items-center justify-center text-slate-700 group-hover:text-white transition-all duration-200 shadow-2xs group-hover:scale-105 mb-1.5">
                          <ItemIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <span className="text-[11px] sm:text-xs font-semibold text-slate-700 group-hover:text-indigo-900 text-center leading-tight">
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* ==================== EXPANDABLE ACCORDION FOR REMAINING MENUS ==================== */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="w-full p-4 flex justify-between items-center font-bold text-sm text-indigo-900 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Show More Categories (Communication, Profile, Planning & Social)</span>
              </div>
              {showAllCategories ? (
                <ChevronUp className="w-5 h-5 text-indigo-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-indigo-600" />
              )}
            </button>

            {showAllCategories && (
              <div className="p-4 pt-1 space-y-4 border-t border-slate-100">
                {secondaryCategories.map((cat) => {
                  const CatIcon = cat.icon;
                  return (
                    <div key={cat.id} className="border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`p-1.5 rounded-lg ${cat.iconColor}`}>
                          <CatIcon className="w-4 h-4" />
                        </div>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                          {cat.title}
                        </h4>
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                        {cat.items.map((item) => {
                          const ItemIcon = item.icon;
                          return (
                            <button
                              key={item.id}
                              onClick={() => setActiveModal(item.id)}
                              className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-indigo-50/60 border border-transparent hover:border-indigo-100 transition-all group cursor-pointer"
                            >
                              <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-indigo-600 flex items-center justify-center text-slate-700 group-hover:text-white transition-all shadow-2xs mb-1">
                                <ItemIcon className="w-5 h-5" />
                              </div>
                              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-700 text-center leading-tight">
                                {item.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ==================== 1:1 INTERACTIVE SUBMODULE MODALS ==================== */}
      {/* ========================================================================= */}

      {/* 1. STUDENT PROFILE MODAL (1:1 with ProfileComponent chunk 733) */}
      {activeModal === 'profile' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-indigo-900 text-white px-5 py-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <GraduationCap className="w-6 h-6 text-yellow-400" />
                <div>
                  <h3 className="font-bold text-base leading-tight">Student Profile Information</h3>
                  <p className="text-xs text-indigo-200">Academic Year 2026-2027 &bull; {student.schoolName}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Profile Card Header */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-16 h-16 rounded-full border-2 border-indigo-600 object-cover"
                />
                <div>
                  <h4 className="text-lg font-bold text-slate-900">{student.name}</h4>
                  <p className="text-xs text-indigo-700 font-semibold">{student.className} - Section {student.division}</p>
                  <p className="text-xs text-slate-500">SR No: {student.srNo} &bull; Roll No: {student.rollNo}</p>
                </div>
              </div>

              {/* Personal Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 font-medium">Father's Name:</span>
                  <p className="font-bold text-slate-800 text-sm">{student.fatherName}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 font-medium">Mother's Name:</span>
                  <p className="font-bold text-slate-800 text-sm">{student.motherName}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 font-medium">Date of Birth:</span>
                  <p className="font-bold text-slate-800 text-sm">{student.dob} (Age: 3 yrs)</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 font-medium">Gender:</span>
                  <p className="font-bold text-slate-800 text-sm">{student.gender}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 font-medium">Blood Group:</span>
                  <p className="font-bold text-slate-800 text-sm">{student.bloodGroup}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 font-medium">House:</span>
                  <p className="font-bold text-slate-800 text-sm">Blue House</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 sm:col-span-2">
                  <span className="text-slate-500 font-medium">Registered SMS Mobile:</span>
                  <p className="font-bold text-slate-800 text-sm">{student.contactNo}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 sm:col-span-2">
                  <span className="text-slate-500 font-medium">Permanent Address:</span>
                  <p className="font-bold text-slate-800 text-sm">{student.address}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => toast.success('Profile details update request sent to administration!')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Update Details Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ATTENDANCE REGISTER MODAL (1:1 with AttendanceComponent chunk 7585) */}
      {activeModal === 'attendance' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            {/* Top Banner with attendance-bg.png */}
            <div className="relative h-44 overflow-hidden bg-gradient-to-r from-blue-900 to-indigo-900">
              <img
                src="/attendance-bg.png"
                alt="Attendance Banner"
                className="absolute inset-0 w-full h-full object-cover opacity-80"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <div className="relative z-10 p-5 text-white flex justify-between items-start">
                <div>
                  <button
                    onClick={() => setActiveModal(null)}
                    className="p-1 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer mb-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <h3 className="text-xl font-bold">Attendance Register</h3>
                  <p className="text-xs text-blue-200">Session 2026-2027 &bull; {student.name}</p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold shadow-md">
                    92% Present
                  </span>
                </div>
              </div>
            </div>

            {/* Attendance Counters Pill Box */}
            <div className="bg-white rounded-2xl shadow-lg p-3 -mt-6 mx-5 relative z-20 border border-slate-100 grid grid-cols-4 gap-2 text-center">
              <div className="bg-green-50 p-2 rounded-xl">
                <span className="text-[10px] font-bold text-green-700 block uppercase">Present</span>
                <span className="text-lg font-extrabold text-green-700">23 Days</span>
              </div>
              <div className="bg-red-50 p-2 rounded-xl">
                <span className="text-[10px] font-bold text-red-700 block uppercase">Absent</span>
                <span className="text-lg font-extrabold text-red-700">2 Days</span>
              </div>
              <div className="bg-amber-50 p-2 rounded-xl">
                <span className="text-[10px] font-bold text-amber-700 block uppercase">Holiday</span>
                <span className="text-lg font-extrabold text-amber-700">5 Days</span>
              </div>
              <div className="bg-blue-50 p-2 rounded-xl">
                <span className="text-[10px] font-bold text-blue-700 block uppercase">Total Working</span>
                <span className="text-lg font-extrabold text-blue-700">25 Days</span>
              </div>
            </div>

            {/* Month Matrix */}
            <div className="p-5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-slate-800">Monthly Log: October 2026</span>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="text-xs border border-slate-300 rounded-lg px-2.5 py-1 font-semibold text-slate-700"
                >
                  <option>October 2026</option>
                  <option>September 2026</option>
                  <option>August 2026</option>
                  <option>July 2026</option>
                </select>
              </div>

              {/* Day Badges Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs">
                {attendanceCalendar.map((item) => (
                  <div
                    key={item.day}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      item.status === 'P'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold'
                        : item.status === 'Ab'
                        ? 'bg-rose-50 border-rose-200 text-rose-800 font-bold'
                        : item.status === 'H'
                        ? 'bg-amber-50 border-amber-200 text-amber-800 font-medium'
                        : item.status === 'Sun'
                        ? 'bg-slate-100 border-slate-200 text-slate-600 font-medium'
                        : 'bg-slate-50 border-slate-100 text-slate-400'
                    }`}
                  >
                    <div className="text-[10px] text-slate-500 font-semibold">{item.day} Oct</div>
                    <div className="text-sm font-extrabold mt-0.5">
                      {item.status === 'P' ? '● P' : item.status === 'Ab' ? '● Ab' : item.status === 'H' ? 'Holiday' : item.status === 'Sun' ? 'Sunday' : '-'}
                    </div>
                    {item.timeIn && (
                      <div className="text-[9px] text-emerald-700 mt-0.5">{item.timeIn}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. FEE LEDGER & PAYMENT MODAL (1:1 with FeeComponent chunk 2357) */}
      {(activeModal === 'fee' || activeModal === 'pay-online') && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-emerald-800 text-white px-5 py-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base">Fee Ledger & Payment Center</h3>
                <p className="text-xs text-emerald-200">{student.schoolName} &bull; AADHYA CHOUDHARY</p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Fee Table */}
            <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <span className="text-xs text-emerald-800 font-semibold block">Total Annual Fee</span>
                  <span className="text-2xl font-black text-emerald-950">₹ 36,000</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-emerald-700 font-semibold block">Outstanding Dues</span>
                  <span className="text-xl font-bold text-emerald-600">₹ 0 (Cleared)</span>
                </div>
              </div>

              {/* Breakdown Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Fee Head</th>
                      <th className="p-2.5 text-right">Amount</th>
                      <th className="p-2.5 text-right">Paid</th>
                      <th className="p-2.5 text-right">Balance</th>
                      <th className="p-2.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {feeHeads.map((f, i) => (
                      <tr key={i} className="hover:bg-slate-50/50">
                        <td className="p-2.5 font-semibold text-slate-800">{f.head}</td>
                        <td className="p-2.5 text-right font-medium">₹ {f.total.toLocaleString()}</td>
                        <td className="p-2.5 text-right font-bold text-emerald-600">₹ {f.paid.toLocaleString()}</td>
                        <td className="p-2.5 text-right font-medium text-slate-500">₹ {f.due}</td>
                        <td className="p-2.5 text-center">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            {f.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Payment Gateway Actions */}
              <div className="pt-2 flex justify-between items-center">
                <button
                  onClick={() => setActiveModal('fee-receipt')}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  View Receipts History
                </button>
                <button
                  onClick={handlePayOnlineSubmit}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Atom Payment Gateway</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. FEE RECEIPT MODAL (1:1 with FeeRecieptComponent chunk 1789) */}
      {activeModal === 'fee-receipt' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-slate-900 text-white px-5 py-3.5 flex justify-between items-center">
              <h3 className="font-bold text-sm">Official Fee Receipt &bull; {feeReceipts[0].receiptNo}</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Receipt Printable Card */}
            <div className="p-6 space-y-4">
              <div className="text-center border-b border-slate-200 pb-3">
                <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">{student.schoolName}</h2>
                <p className="text-xs text-slate-500">Mahapura, Ajmer Road, Jaipur &bull; Affiliation No: {student.afflNo}</p>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px] tracking-wider uppercase">
                  Cash / Online Fee Receipt
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-slate-500">Receipt No:</span> <strong className="text-slate-800">{feeReceipts[0].receiptNo}</strong></div>
                <div><span className="text-slate-500">Date:</span> <strong className="text-slate-800">{feeReceipts[0].date}</strong></div>
                <div><span className="text-slate-500">Student:</span> <strong className="text-slate-800">{student.name}</strong></div>
                <div><span className="text-slate-500">Class & Sec:</span> <strong className="text-slate-800">{student.className} - {student.division}</strong></div>
                <div><span className="text-slate-500">SR No:</span> <strong className="text-slate-800">{student.srNo}</strong></div>
                <div><span className="text-slate-500">Payment Mode:</span> <strong className="text-slate-800">{feeReceipts[0].mode}</strong></div>
              </div>

              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-slate-800">{feeReceipts[0].head}</span>
                  <p className="text-[10px] text-slate-500">Transaction Status: Verified & Cleared</p>
                </div>
                <div className="text-right">
                  <span className="text-base font-extrabold text-emerald-600">₹ {feeReceipts[0].amount.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between items-end pt-4 border-t border-slate-200 text-[10px] text-slate-500">
                <div>
                  <p>Authorized Cashier / Accounts Signatory</p>
                  <p className="font-mono text-[9px] mt-1 text-slate-400">Generated via UAB ERP System</p>
                </div>
                <button
                  onClick={() => toast.success('Printing Official Receipt PDF...')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. HOMEWORK MODAL (1:1 with HomeworkComponent chunk 7963) */}
      {activeModal === 'homework' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-blue-900 text-white px-5 py-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base">Class Homework & Worksheets</h3>
                <p className="text-xs text-blue-200">{student.className} &bull; Teacher Assignments</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg hover:bg-white/20 text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3 max-h-[80vh] overflow-y-auto">
              {homeworkList.map((hw) => (
                <div key={hw.id} className="border border-slate-200 rounded-xl p-4 hover:border-blue-300 transition-colors bg-white">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold uppercase">
                        {hw.subject}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 mt-1">{hw.title}</h4>
                      <p className="text-xs text-slate-600 mt-0.5">{hw.desc}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      homeworkStatus[hw.id] === 'Submitted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {homeworkStatus[hw.id]}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <span>Teacher: <strong>{hw.teacher}</strong> &bull; Due: {hw.dueDate}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toast.success(`Worksheet downloaded for ${hw.subject}!`)}
                        className="px-2.5 py-1 rounded-lg border border-slate-300 hover:bg-slate-50 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        <span>Worksheet</span>
                      </button>
                      <button
                        onClick={() => {
                          setHomeworkStatus({ ...homeworkStatus, [hw.id]: 'Submitted' });
                          toast.success(`Homework for ${hw.subject} submitted successfully!`);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold cursor-pointer"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. DATESHEET MODAL (1:1 with DateSheetComponent chunk 6923) */}
      {activeModal === 'datesheet' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-rose-900 text-white px-5 py-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base">Examination DateSheet & Schedule</h3>
                <p className="text-xs text-rose-200">Term Examination 2026-27 &bull; {student.className}</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg hover:bg-white/20 text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Date & Day</th>
                      <th className="p-2.5">Subject</th>
                      <th className="p-2.5">Time</th>
                      <th className="p-2.5">Room</th>
                      <th className="p-2.5">Syllabus Portion</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {dateSheet.map((ds, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="p-2.5 font-bold text-slate-800 whitespace-nowrap">
                          {ds.date} <span className="block text-[10px] text-slate-500 font-normal">{ds.day}</span>
                        </td>
                        <td className="p-2.5 font-semibold text-rose-700">{ds.subject}</td>
                        <td className="p-2.5 font-medium text-slate-600 whitespace-nowrap">{ds.time}</td>
                        <td className="p-2.5 font-medium text-slate-600">{ds.room}</td>
                        <td className="p-2.5 text-[11px] text-slate-500">{ds.syllabus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => toast.success('Downloading Examination DateSheet PDF...')}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download DateSheet PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. RESULT / MARKSHEET MODAL (1:1 with ResultComponent chunk 9245) */}
      {activeModal === 'result' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-900 text-white px-5 py-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base">Progress Report Card &bull; Academic Evaluation</h3>
                <p className="text-xs text-slate-300">Term 1 Assessment &bull; {student.name}</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg hover:bg-white/20 text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="text-center border-b border-slate-200 pb-3">
                <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">{student.schoolName}</h2>
                <p className="text-xs text-slate-500">Senior Secondary &bull; CBSE Affiliation: {student.afflNo}</p>
                <span className="inline-block mt-1 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                  Overall Result: PASSED (Grade A1 &bull; 95%)
                </span>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Subject</th>
                      <th className="p-2.5 text-right">Max Marks</th>
                      <th className="p-2.5 text-right">Obtained</th>
                      <th className="p-2.5 text-center">Grade</th>
                      <th className="p-2.5">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {results.map((r, i) => (
                      <tr key={i} className="hover:bg-slate-50/50">
                        <td className="p-2.5 font-bold text-slate-800">{r.subject}</td>
                        <td className="p-2.5 text-right text-slate-500">{r.maxMarks}</td>
                        <td className="p-2.5 text-right font-extrabold text-blue-700">{r.obtained}</td>
                        <td className="p-2.5 text-center">
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                            {r.grade}
                          </span>
                        </td>
                        <td className="p-2.5 text-[11px] text-slate-600">{r.remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-slate-500">Teacher: Sunita Kumari &bull; Principal Seal: Affixed</span>
                <button
                  onClick={() => toast.success('Printing Official Marksheet PDF...')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Marksheet</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. DIGITAL ID CARD MODAL (1:1 with StudentIdCardComponent chunk 1197) */}
      {activeModal === 'id-card' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-indigo-900 text-white px-4 py-3 flex justify-between items-center">
              <span className="font-bold text-xs uppercase tracking-wider">Digital Student ID Card</span>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded hover:bg-white/20 text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Vertical ID Card Layout */}
            <div className="p-5 text-center space-y-3 bg-gradient-to-b from-orange-50/50 to-white">
              {/* School Header */}
              <div className="border-b border-slate-200 pb-2">
                <h3 className="font-extrabold text-slate-900 text-sm leading-tight uppercase">{student.schoolName}</h3>
                <p className="text-[10px] text-slate-500">Mahapura, Ajmer Road, Jaipur &bull; Code: {student.schoolCode}</p>
              </div>

              {/* Student Photo */}
              <div className="flex justify-center">
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-24 h-24 rounded-full border-4 border-indigo-600 object-cover shadow-md"
                />
              </div>

              <div>
                <h4 className="text-base font-black text-slate-900">{student.name}</h4>
                <p className="text-xs font-bold text-indigo-700">{student.className} - {student.division}</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-3 text-left text-xs space-y-1 shadow-2xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">SR No:</span>
                  <strong className="text-slate-800">{student.srNo}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Roll No:</span>
                  <strong className="text-slate-800">{student.rollNo}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Father:</span>
                  <strong className="text-slate-800">{student.fatherName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Phone:</span>
                  <strong className="text-slate-800">{student.contactNo}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Blood Group:</span>
                  <strong className="text-slate-800">{student.bloodGroup}</strong>
                </div>
              </div>

              {/* Signature & Barcode */}
              <div className="pt-2 flex justify-between items-center text-[10px] text-slate-500 border-t border-slate-100">
                <span>Principal Signature</span>
                <span className="font-mono text-[9px] bg-slate-100 px-2 py-0.5 rounded">||||| | ||||| ||||</span>
              </div>

              <button
                onClick={() => toast.success('Printing ID Card PDF...')}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Print Student ID Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. ADMIT CARD MODAL (1:1 with StudentAdmitCardComponent chunk 5931) */}
      {activeModal === 'admit-card' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-indigo-950 text-white px-5 py-3.5 flex justify-between items-center">
              <h3 className="font-bold text-sm">Examination Admit Card &bull; Hall Ticket 2026-27</h3>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded hover:bg-white/20 text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="text-center border-b border-slate-200 pb-3">
                <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">{student.schoolName}</h2>
                <p className="text-xs text-slate-500">Center Code: 10964 &bull; Examination Term 1 (October 2026)</p>
              </div>

              <div className="flex items-center gap-4 border border-slate-200 rounded-xl p-3 bg-slate-50">
                <img src={student.avatar} alt={student.name} className="w-16 h-16 rounded-lg object-cover border" />
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs w-full">
                  <div><span className="text-slate-500">Student:</span> <strong>{student.name}</strong></div>
                  <div><span className="text-slate-500">Roll No:</span> <strong>{student.rollNo}</strong></div>
                  <div><span className="text-slate-500">Class:</span> <strong>{student.className}</strong></div>
                  <div><span className="text-slate-500">SR No:</span> <strong>{student.srNo}</strong></div>
                </div>
              </div>

              <p className="text-xs text-slate-600 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                <strong>Instruction:</strong> Candidate must report 15 minutes before exam commencement with pencil box & official ID card.
              </p>

              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-slate-500">Controller of Examinations</span>
                <button
                  onClick={() => toast.success('Printing Official Exam Admit Card...')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Admit Card</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 10. LEAVE REQUEST MODAL (1:1 with AppLeaveSetupComponent chunk 5636) */}
      {activeModal === 'leave-request' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-indigo-900 text-white px-5 py-3.5 flex justify-between items-center">
              <h3 className="font-bold text-sm">Apply for Student Leave</h3>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded hover:bg-white/20 text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleLeaveSubmit} className="p-5 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Leave Type</label>
                <select
                  value={leaveForm.type}
                  onChange={(e) => setLeaveForm({ ...leaveForm, type: e.target.value })}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2 font-medium"
                >
                  <option>Sick Leave</option>
                  <option>Family Function</option>
                  <option>Medical Emergency</option>
                  <option>Casual Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">From Date</label>
                  <input
                    type="date"
                    value={leaveForm.from}
                    onChange={(e) => setLeaveForm({ ...leaveForm, from: e.target.value })}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">To Date</label>
                  <input
                    type="date"
                    value={leaveForm.to}
                    onChange={(e) => setLeaveForm({ ...leaveForm, to: e.target.value })}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Leave</label>
                <textarea
                  rows="3"
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  placeholder="State reason for absence..."
                  className="w-full text-xs border border-slate-300 rounded-lg p-2 font-medium"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Submit Leave Application
              </button>

              {/* History */}
              <div className="pt-2 border-t border-slate-200">
                <span className="text-[11px] font-bold text-slate-700 block mb-1">Past Applications:</span>
                {leaveHistory.map((lh) => (
                  <div key={lh.id} className="text-xs p-2 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center mb-1">
                    <div>
                      <span className="font-semibold">{lh.type} ({lh.from} to {lh.to})</span>
                      <p className="text-[10px] text-slate-500">{lh.reason}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      {lh.status}
                    </span>
                  </div>
                ))}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 11. TRANSPORT / BUS ROUTE MODAL */}
      {activeModal === 'transport' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-amber-600 text-white px-5 py-3.5 flex justify-between items-center">
              <h3 className="font-bold text-sm">School Bus Route & Transport Details</h3>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded hover:bg-white/20 text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex justify-between items-center">
                <div>
                  <span className="text-amber-800 font-bold text-sm block">Route #04 &bull; Mahapura - Ajmer Road</span>
                  <span className="text-slate-600 text-xs">Vehicle: RJ-14-PA-2026 (Tata Starbus)</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  GPS Live
                </span>
              </div>

              <div className="space-y-2 border border-slate-200 rounded-xl p-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Driver Name:</span>
                  <strong className="text-slate-800">Ramphal Gurjar</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Driver Mobile:</span>
                  <strong className="text-slate-800">+91 98290 12345</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Morning Pickup:</span>
                  <strong className="text-slate-800">07:45 AM (Mahapura Bus Stop)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Afternoon Drop:</span>
                  <strong className="text-slate-800">02:25 PM (Mahapura Bus Stop)</strong>
                </div>
              </div>

              <button
                onClick={() => toast.success('Live Bus GPS Location: At Ring Road Crossing (2 mins away)')}
                className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold cursor-pointer transition-colors"
              >
                Track Live Bus GPS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 12. CIRCULAR & NOTICES MODAL (1:1 with CircularComponent chunk 7141) */}
      {activeModal === 'circular' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-sky-900 text-white px-5 py-3.5 flex justify-between items-center">
              <h3 className="font-bold text-sm">Official School Circulars & Circulars</h3>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded hover:bg-white/20 text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3 max-h-[80vh] overflow-y-auto text-xs">
              {circulars.map((c) => (
                <div key={c.id} className="border border-slate-200 rounded-xl p-3.5 hover:bg-slate-50/50 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-slate-900 text-xs">{c.title}</h4>
                    <span className="text-[10px] text-slate-500 whitespace-nowrap">{c.date}</span>
                  </div>
                  <p className="text-slate-600 mb-2">{c.desc}</p>
                  <button
                    onClick={() => toast.success(`Downloading circular ${c.file}...`)}
                    className="px-2.5 py-1 rounded bg-sky-100 hover:bg-sky-200 text-sky-800 font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download PDF Attachment</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 13. ONLINE CLASSES MODAL */}
      {activeModal === 'online-classes' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-blue-900 text-white px-5 py-3.5 flex justify-between items-center">
              <h3 className="font-bold text-sm">Live Online Classes</h3>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded hover:bg-white/20 text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
                <Video className="w-6 h-6 animate-pulse" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">Nursery Rhymes & Storytelling</h4>
              <p className="text-slate-500">Teacher: Sunita Kumari &bull; Live via Google Meet / Zoom</p>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 font-bold">
                ● Live Now &bull; Scheduled 08:30 AM - 09:15 AM
              </div>
              <button
                onClick={() => toast.success('Connecting to School Virtual Classroom...')}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold cursor-pointer transition-colors"
              >
                Join Live Classroom Meeting
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
