import toast from 'react-hot-toast';
import React, { useState } from 'react';
import {
  Home,
  Sliders,
  User,
  CreditCard,
  ChevronRight,
  Plus,
  Trash2,
  X,
  Search,
  ListFilter,
  Check,
  CheckSquare,
  FileText,
  Shield,
  MessageSquare,
  Bus,
  Smartphone,
  Layers,
  Sparkles,
  Info,
  Calendar,
  Settings,
  UploadCloud,
  CheckCircle2,
  HelpCircle,
  Hash,
  Award,
  Send,
  Upload
} from 'lucide-react';
import { PageHeader, ErpSection, FormField } from '../../components/erp/PagePrimitives';

export function SettingsAndPermissionsPage() {
  const [activeTab, setActiveTab] = useState('masters');

  const tabs = [
    { id: 'masters', label: 'Masters', icon: Layers, count: 4 },
    { id: 'smsTemplate', label: 'Add SMS Template', icon: MessageSquare },
    { id: 'transportSettings', label: 'Transport Settings', icon: Bus },
    { id: 'appSettings', label: 'Student App Settings', icon: Smartphone },
    { id: 'appModule', label: 'Student App Module', icon: Shield, count: 38 },
    { id: 'comingSoon', label: 'Coming Soon', icon: Sparkles }
  ];

  // ==========================================
  // TAB 1: MASTERS STATE
  // ==========================================
  const [activeMasterModal, setActiveMasterModal] = useState(null); // 'house' | 'stream' | 'concessionBy' | 'concessionType'
  const [activeNestedAddModal, setActiveNestedAddModal] = useState(null); // 'addHouse' | 'addStream' | 'addConcessionBy' | 'addConcessionType'
  const [masterSearchQuery, setMasterSearchQuery] = useState('');

  // 1. House Master
  const [houseList, setHouseList] = useState([
    { sNo: 1, house: 'RED', priority: 1 },
    { sNo: 2, house: 'BLUE', priority: 2 },
    { sNo: 3, house: 'GREEN', priority: 3 },
    { sNo: 4, house: 'YELLOW', priority: 4 }
  ]);
  const [newHouseData, setNewHouseData] = useState({ name: '', priority: '' });

  // 2. Stream Master
  const [streamList, setStreamList] = useState([
    { sNo: 1, stream: 'SCIENCE' },
    { sNo: 2, stream: 'COMMERCE' },
    { sNo: 3, stream: 'HUMANITIES' }
  ]);
  const [newStreamName, setNewStreamName] = useState('');

  // 3. Fee Concession By
  const [concessionByList, setConcessionByList] = useState([
    { sNo: 1, name: 'Management' },
    { sNo: 2, name: 'Principal' }
  ]);
  const [newConcessionByName, setNewConcessionByName] = useState('');

  // 4. Fee Concession Type
  const [concessionTypeList, setConcessionTypeList] = useState([
    { sNo: 1, type: 'Handicap', description: '' },
    { sNo: 2, type: 'Poor Student', description: '' },
    { sNo: 3, type: 'Staff', description: '' },
    { sNo: 4, type: 'Principal', description: '' },
    { sNo: 5, type: 'Management', description: '' },
    { sNo: 6, type: 'Other', description: '' },
    { sNo: 7, type: '3rd Child', description: '' }
  ]);
  const [newConcessionTypeData, setNewConcessionTypeData] = useState({
    type: '',
    mode: 'Amount', // 'Amount' or 'Percentage'
    heads: {
      'Transport': '',
      'Hostel': '',
      'Extra Concession': '',
      'Admission Fee': '',
      'Tuition Fee': '',
      'Activity Fee': '',
      'Digital Learning fee': '',
      'Registration fee': '',
      'Examination Fee': '',
      'School Application Fee': ''
    }
  });

  // ==========================================
  // TAB 2: SMS TEMPLATE STATE
  // ==========================================
  const [smsSearchQuery, setSmsSearchQuery] = useState('');
  const [smsAddModalOpen, setSmsAddModalOpen] = useState(false);
  const [smsUploadModalOpen, setSmsUploadModalOpen] = useState(false);
  const [smsFormData, setSmsFormData] = useState({
    categoryIcon: 'chat', // 'target', 'chat', 'circle', 'bell'
    templateId: '',
    templateTitle: '',
    type: 'Common',
    language: 'English',
    companyName: 'Default SMS Gateway',
    senderId: '',
    message: '',
    status: 'Temporary'
  });
  const [smsTemplatesList, setSmsTemplatesList] = useState([]);

  // ==========================================
  // TAB 3: TRANSPORT SETTINGS STATE
  // ==========================================
  const [transportMonths, setTransportMonths] = useState([
    { no: 1, month: 'April', active: true },
    { no: 2, month: 'May', active: true },
    { no: 3, month: 'June', active: false },
    { no: 4, month: 'July', active: true },
    { no: 5, month: 'August', active: true },
    { no: 6, month: 'September', active: true },
    { no: 7, month: 'October', active: true },
    { no: 8, month: 'November', active: true },
    { no: 9, month: 'December', active: true },
    { no: 10, month: 'January', active: true },
    { no: 11, month: 'February', active: true },
    { no: 12, month: 'March', active: true }
  ]);

  // ==========================================
  // TAB 4: STUDENT APP SETTINGS STATE
  // ==========================================
  const [appSettings, setAppSettings] = useState([
    { sNo: 6, module: 'App Session', status: false },
    { sNo: 1, module: 'Fee', status: true },
    { sNo: 3, module: 'Result', status: true, termSetting: true }
  ]);
  const [resultTermModalOpen, setResultTermModalOpen] = useState(false);
  const [resultTermList, setResultTermList] = useState([
    { className: 'Nursery - PP3+', halfYearly: true, annual: true },
    { className: 'Lower Kindergarten - PP4+', halfYearly: true, annual: true },
    { className: 'Upper Kindergarten - PP5+', halfYearly: true, annual: true },
    { className: 'I', halfYearly: true, annual: true },
    { className: 'II', halfYearly: true, annual: true },
    { className: 'III', halfYearly: true, annual: true },
    { className: 'IV', halfYearly: true, annual: true },
    { className: 'V', halfYearly: true, annual: true },
    { className: 'VI', halfYearly: true, annual: true },
    { className: 'VII', halfYearly: true, annual: true },
    { className: 'VIII', halfYearly: true, annual: true },
    { className: 'IX', halfYearly: true, annual: true },
    { className: 'X', halfYearly: true, annual: true },
    { className: 'XI- HUMANITIES', halfYearly: true, annual: true },
    { className: 'XII-HUMANITIES', halfYearly: true, annual: true, annualLabel: 'Pre- Board Examinations' },
    { className: 'XI-MEDICAL', halfYearly: true, annual: true },
    { className: 'XII-MEDICAL', halfYearly: true, annual: true, annualLabel: 'Pre- Board Examinations' },
    { className: 'XI-NON-MEDICAL', halfYearly: true, annual: true },
    { className: 'XII-NON-MEDICAL', halfYearly: true, annual: true, annualLabel: 'Pre- Board Examinations' }
  ]);

  // ==========================================
  // TAB 5: STUDENT APP MODULE (38 MODULES) STATE
  // ==========================================
  const [appModules, setAppModules] = useState([
    { sNo: 1, name: 'Home', icon: 'home', url: 'home', order: 0, dashboardIcon: false, isReport: false, active: true },
    { sNo: 2, name: 'Profile', icon: 'account_circle', url: 'profile', order: 1, dashboardIcon: false, isReport: false, active: true },
    { sNo: 3, name: 'Homework', icon: 'menu_book', url: 'get-homework', order: 1, dashboardIcon: false, isReport: false, active: true },
    { sNo: 4, name: 'Fee', icon: 'currency_rupee', url: 'get-fee', order: 1, dashboardIcon: false, isReport: false, active: true },
    { sNo: 5, name: 'DateSheet', icon: 'today', url: 'get-datesheet', order: 1, dashboardIcon: false, isReport: false, active: true },
    { sNo: 6, name: 'Attendance', icon: 'fact_check', url: 'get-attendance', order: 1, dashboardIcon: false, isReport: false, active: true },
    { sNo: 7, name: 'Sms', icon: 'chat', url: 'get-sms', order: 1, dashboardIcon: false, isReport: false, active: true },
    { sNo: 8, name: 'Calendar Planing', icon: 'date_range', url: 'get-calendar-planing', order: 2, dashboardIcon: false, isReport: false, active: true },
    { sNo: 9, name: 'Birthday', icon: 'cake', url: 'get-birthday', order: 2, dashboardIcon: false, isReport: false, active: true },
    { sNo: 10, name: 'Id Card', icon: 'badge', url: 'get-idcard', order: 2, dashboardIcon: false, isReport: false, active: true },
    { sNo: 11, name: 'Syllabus', icon: 'description', url: 'get-syllabus', order: 2, dashboardIcon: false, isReport: false, active: true },
    { sNo: 12, name: 'Fee Receipt', icon: 'receipt_long', url: 'get-fee-receipt', order: 2, dashboardIcon: false, isReport: false, active: true },
    { sNo: 13, name: 'Admit Card', icon: 'receipt', url: 'get-admit-card', order: 2, dashboardIcon: false, isReport: false, active: true },
    { sNo: 14, name: 'Gate Pass', icon: 'airplane_ticket', url: 'get-gate-pass', order: 2, dashboardIcon: false, isReport: false, active: true },
    { sNo: 15, name: 'Notifications', icon: 'notifications', url: 'get-notification', order: 3, dashboardIcon: false, isReport: false, active: true },
    { sNo: 16, name: 'Transport', icon: 'directions_bus', url: 'get-transport', order: 3, dashboardIcon: false, isReport: false, active: true },
    { sNo: 17, name: 'Study Material', icon: 'import_contacts', url: 'get-study-material', order: 3, dashboardIcon: false, isReport: false, active: true },
    { sNo: 18, name: 'Result', icon: 'assessment', url: 'get-result', order: 3, dashboardIcon: false, isReport: false, active: true },
    { sNo: 19, name: 'Hostel', icon: 'meeting_room', url: 'get-hostel', order: 3, dashboardIcon: false, isReport: false, active: true },
    { sNo: 20, name: 'Time Table', icon: 'calendar_month', url: 'get-time-table', order: 3, dashboardIcon: false, isReport: false, active: true },
    { sNo: 21, name: 'Gallery', icon: 'photo_library', url: 'get-gallery', order: 4, dashboardIcon: false, isReport: false, active: true },
    { sNo: 22, name: 'Help', icon: 'help', url: 'get-help', order: 4, dashboardIcon: false, isReport: false, active: true },
    { sNo: 23, name: 'About School', icon: 'info', url: 'about-school', order: 4, dashboardIcon: false, isReport: false, active: true },
    { sNo: 24, name: 'Teacher Details', icon: 'people', url: 'get-teacher-details', order: 4, dashboardIcon: false, isReport: false, active: true },
    { sNo: 25, name: 'Leave Application', icon: 'flight_takeoff', url: 'get-leave-application', order: 4, dashboardIcon: false, isReport: false, active: true },
    { sNo: 26, name: 'Feedback & Query', icon: 'rate_review', url: 'get-feedback', order: 4, dashboardIcon: false, isReport: false, active: true },
    { sNo: 27, name: 'Download Center', icon: 'download', url: 'get-download-center', order: 5, dashboardIcon: false, isReport: false, active: true },
    { sNo: 28, name: 'Rules & Regulations', icon: 'rule', url: 'get-rules-regulations', order: 5, dashboardIcon: false, isReport: false, active: true },
    { sNo: 29, name: 'Daily Attendance', icon: 'today', url: 'get-daily-attendance', order: 5, dashboardIcon: false, isReport: false, active: true },
    { sNo: 30, name: 'Visitor History', icon: 'person_pin', url: 'get-visitor-history', order: 5, dashboardIcon: false, isReport: false, active: true },
    { sNo: 31, name: 'Daily Task', icon: 'assignment', url: 'get-daily-task', order: 5, dashboardIcon: false, isReport: false, active: true },
    { sNo: 32, name: 'Digital Diary', icon: 'import_contacts', url: 'get-digital-dairy', order: 5, dashboardIcon: false, isReport: false, active: true },
    { sNo: 33, name: 'Change Password', icon: 'lock', url: 'change-password', order: 6, dashboardIcon: false, isReport: false, active: true },
    { sNo: 34, name: 'Class Room Activity', icon: 'nature_people', url: 'get-class-room-activity', order: 6, dashboardIcon: false, isReport: false, active: true },
    { sNo: 35, name: 'Online Test', icon: 'laptop', url: 'get-online-test', order: 7, dashboardIcon: false, isReport: false, active: true },
    { sNo: 36, name: 'Online Classes', icon: 'videocam', url: 'get-online-classes', order: 8, dashboardIcon: false, isReport: false, active: true },
    { sNo: 37, name: 'Lesson Plan', icon: 'menu_book', url: 'get-lesson-plan', order: 8, dashboardIcon: false, isReport: false, active: true },
    { sNo: 38, name: 'Pre year Paper', icon: 'local_library', url: 'get-pre-year-paper', order: 8, dashboardIcon: false, isReport: false, active: true }
  ]);

  const [moduleSearch, setModuleSearch] = useState('');

  return (
    <div className="space-y-3 max-w-6xl mx-auto pt-0 pb-12 px-2 sm:px-4">
      {/* 1:1 Test Master Pro Page Header */}
      <PageHeader 
        title="Settings & Permissions" 
        description="Configure school masters, SMS gateway templates, transport months, and student mobile app permissions."
      />

      {/* Segmented control style horizontal tabs - Exact Test Master Pro style */}
      <div className="hidden md:inline-flex flex-wrap p-1 bg-slate-100/80 border border-slate-200/60 rounded-full shadow-sm gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-sm border-0' 
                  : 'text-slate-500 hover:text-slate-800 bg-transparent border-0'
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Mobile Tab Selector */}
      <div className="md:hidden flex overflow-x-auto gap-1 pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full whitespace-nowrap transition-all ${
                isActive ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* TAB 1: Masters (Exact vex-all-masters list)              */}
      {/* ======================================================== */}
      {activeTab === 'masters' && (
        <ErpSection 
          title="Master Configuration Hub" 
          icon={Layers} 
          tone="indigo"
          className="bg-white border-slate-200/80 shadow-sm"
        >
          <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4 p-1">
            {/* House Master Card */}
            <div
              onClick={() => {
                setMasterSearchQuery('');
                setActiveMasterModal('house');
              }}
              className="relative group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:border-blue-300 overflow-hidden min-h-[140px] cursor-pointer"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-blue-600" />
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100 border border-indigo-100 shadow-sm text-indigo-600">
                    <Home className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                    {houseList.length} Records
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">
                  House Master
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                  Configure school houses, student allocation, and priority levels.
                </p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2 text-xs font-semibold text-indigo-600">
                <span>Manage Houses</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Stream Master Card */}
            <div
              onClick={() => {
                setMasterSearchQuery('');
                setActiveMasterModal('stream');
              }}
              className="relative group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:border-emerald-300 overflow-hidden min-h-[140px] cursor-pointer"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600" />
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-100 shadow-sm text-emerald-600">
                    <Sliders className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                    {streamList.length} Active
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-800 tracking-tight group-hover:text-emerald-600 transition-colors">
                  Stream Master
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                  Senior secondary academic streams: Science, Commerce &amp; Humanities.
                </p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2 text-xs font-semibold text-emerald-600">
                <span>Manage Streams</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Fee Concession By Card */}
            <div
              onClick={() => {
                setMasterSearchQuery('');
                setActiveMasterModal('concessionBy');
              }}
              className="relative group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:border-purple-300 overflow-hidden min-h-[140px] cursor-pointer"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 via-violet-500 to-purple-600" />
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-100 shadow-sm text-purple-600">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
                    {concessionByList.length} Roles
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-800 tracking-tight group-hover:text-purple-600 transition-colors">
                  Fee Concession By
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                  Authorities with approval rights for student fee concessions.
                </p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2 text-xs font-semibold text-purple-600">
                <span>Manage Roles</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Fee Concession Type Card */}
            <div
              onClick={() => {
                setMasterSearchQuery('');
                setActiveMasterModal('concessionType');
              }}
              className="relative group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:border-amber-300 overflow-hidden min-h-[140px] cursor-pointer"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600" />
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-100 shadow-sm text-amber-600">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                    {concessionTypeList.length} Types
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-800 tracking-tight group-hover:text-amber-600 transition-colors">
                  Fee Concession Type
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                  Categories and head-wise discount deduction percentages/amounts.
                </p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2 text-xs font-semibold text-amber-600">
                <span>Manage Concessions</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </ErpSection>
      )}

      {/* ======================================================== */}
      {/* TAB 2: Add SMS Template (1:1 UAB Exact Match)            */}
      {/* ======================================================== */}
      {activeTab === 'smsTemplate' && (
        <ErpSection
          title="SMS Communication Templates"
          icon={MessageSquare}
          tone="blue"
          action={
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSmsUploadModalOpen(true)}
                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold px-2.5 py-1.5 shadow-xs flex items-center gap-1 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-indigo-600" />
                <span>Upload File</span>
              </button>
              <button
                type="button"
                onClick={() => setSmsAddModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-xs font-semibold px-3 py-1.5 shadow-xs flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Template</span>
              </button>
            </div>
          }
        >
          {/* Top Bar with Search Input */}
          <div className="p-2 border-b border-slate-100 flex items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search template title or ID..."
                value={smsSearchQuery}
                onChange={(e) => setSmsSearchQuery(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-200 pl-8 pr-3 py-1.5 bg-white focus:outline-none focus:border-indigo-500 shadow-2xs"
              />
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              {smsTemplatesList.length} Registered
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold text-[11px] uppercase tracking-wider">
                  <th className="py-2.5 px-3">S.No.</th>
                  <th className="py-2.5 px-3">Temp. ID</th>
                  <th className="py-2.5 px-3">Sender ID</th>
                  <th className="py-2.5 px-3">Temp. Name</th>
                  <th className="py-2.5 px-3">Temp. Type</th>
                  <th className="py-2.5 px-3">Lang</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Date &amp; Time</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {smsTemplatesList.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">
                      <MessageSquare className="w-8 h-8 mx-auto text-slate-300 mb-1.5" />
                      <p className="font-semibold text-slate-600 text-xs">No SMS templates configured</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Use &ldquo;Add Template&rdquo; or &ldquo;Upload File&rdquo; to add DLT approved templates.</p>
                    </td>
                  </tr>
                ) : (
                  smsTemplatesList
                    .filter((st) =>
                      smsSearchQuery
                        ? st.templateTitle?.toLowerCase().includes(smsSearchQuery.toLowerCase()) ||
                          st.templateId?.toLowerCase().includes(smsSearchQuery.toLowerCase())
                        : true
                    )
                    .map((st, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2 px-3 font-mono text-slate-500">{idx + 1}</td>
                        <td className="py-2 px-3 font-mono font-bold text-indigo-700">{st.templateId}</td>
                        <td className="py-2 px-3">{st.senderId || '--'}</td>
                        <td className="py-2 px-3 font-semibold text-slate-800">{st.templateTitle}</td>
                        <td className="py-2 px-3">{st.type}</td>
                        <td className="py-2 px-3">{st.language}</td>
                        <td className="py-2 px-3">{st.status}</td>
                        <td className="py-2 px-3 text-slate-500">{new Date().toLocaleString()}</td>
                        <td className="py-2 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </ErpSection>
      )}

      {/* ======================================================== */}
      {/* TAB 3: Transport Settings (Exact 12 Months Table)        */}
      {/* ======================================================== */}
      {activeTab === 'transportSettings' && (
        <ErpSection
          title="Transport Operational Months"
          icon={Bus}
          tone="orange"
          action={
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-orange-100 text-[#8E3200] border border-orange-200">
              {transportMonths.filter((m) => m.active).length} of 12 Months Active
            </span>
          }
        >
          <div className="max-w-2xl mx-auto p-1">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold text-[11px] uppercase">
                  <th className="py-2 px-3 w-16">No.</th>
                  <th className="py-2 px-3">Month</th>
                  <th className="py-2 px-3 text-right">Operational Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {transportMonths.map((m) => (
                  <tr key={m.no} className="hover:bg-slate-50/50">
                    <td className="py-2 px-3 font-mono text-slate-500">{m.no}</td>
                    <td className="py-2 px-3 font-semibold text-slate-800">{m.month}</td>
                    <td className="py-2 px-3 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          setTransportMonths((prev) =>
                            prev.map((x) => (x.no === m.no ? { ...x, active: !x.active } : x))
                          )
                        }
                        className={`inline-flex items-center w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                          m.active ? 'bg-indigo-600 justify-end' : 'bg-slate-300 justify-start'
                        }`}
                      >
                        <div className="bg-white w-4 h-4 rounded-full shadow-md"></div>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ErpSection>
      )}

      {/* ======================================================== */}
      {/* TAB 4: Student App Settings                              */}
      {/* ======================================================== */}
      {activeTab === 'appSettings' && (
        <ErpSection
          title="Student Mobile App Permissions"
          icon={Smartphone}
          tone="green"
          action={
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-200">
              {appSettings.length} Core Modules
            </span>
          }
        >
          <div className="max-w-2xl mx-auto p-1">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold text-[11px] uppercase">
                  <th className="py-2 px-3 w-16">S.No.</th>
                  <th className="py-2 px-3">Module Name</th>
                  <th className="py-2 px-3 text-right">Permission Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appSettings.map((s) => (
                  <tr key={s.sNo} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-mono text-slate-500">{s.sNo}</td>
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-slate-800">{s.module}</span>
                      <span className="text-[10px] text-slate-400 block">Student Mobile App Access</span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="inline-flex items-center space-x-2">
                        {s.termSetting && (
                          <button
                            type="button"
                            onClick={() => setResultTermModalOpen(true)}
                            className="px-2.5 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 cursor-pointer shadow-2xs"
                          >
                            Result Term Setting
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            setAppSettings((prev) =>
                              prev.map((x) => (x.sNo === s.sNo ? { ...x, status: !x.status } : x))
                            )
                          }
                          className={`w-10 h-5 inline-flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                            s.status ? 'bg-indigo-600 justify-end' : 'bg-slate-300 justify-start'
                          }`}
                        >
                          <div className="bg-white w-4 h-4 rounded-full shadow-md"></div>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ErpSection>
      )}

      {/* ======================================================== */}
      {/* TAB 5: Student App Module (38 Modules Table with Toggles)*/}
      {/* ======================================================== */}
      {activeTab === 'appModule' && (
        <ErpSection
          title="Student Mobile App Directory"
          icon={Shield}
          tone="purple"
          action={
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-950 border border-violet-200">
              38 Active Modules
            </span>
          }
        >
          <div className="p-2 border-b border-slate-100 flex items-center justify-between">
            <div className="relative max-w-xs w-full">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search modules..."
                value={moduleSearch}
                onChange={(e) => setModuleSearch(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-200 pl-8 pr-3 py-1.5 bg-white focus:outline-none focus:border-indigo-500 shadow-2xs"
              />
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              Real-time synchronization active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold text-[11px] uppercase tracking-wider">
                  <th className="py-2 px-3">S.No.</th>
                  <th className="py-2 px-3">Module Name</th>
                  <th className="py-2 px-3">Module Icon</th>
                  <th className="py-2 px-3">Module URL</th>
                  <th className="py-2 px-3">Order</th>
                  <th className="py-2 px-3 text-center">Dashboard Icon</th>
                  <th className="py-2 px-3 text-center">Is Report</th>
                  <th className="py-2 px-3 text-center">Is Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {appModules
                  .filter((m) =>
                    moduleSearch
                      ? m.name.toLowerCase().includes(moduleSearch.toLowerCase()) ||
                        m.url.toLowerCase().includes(moduleSearch.toLowerCase())
                      : true
                  )
                  .map((m) => (
                    <tr key={m.sNo} className="hover:bg-slate-50/50">
                      <td className="py-2 px-3 font-mono text-slate-500">{m.sNo}</td>
                      <td className="py-2 px-3 font-bold text-slate-800">{m.name}</td>
                      <td className="py-2 px-3 font-mono text-indigo-600">{m.icon}</td>
                      <td className="py-2 px-3 font-mono text-slate-400 text-[11px]">{m.url}</td>
                      <td className="py-2 px-3 font-mono">{m.order}</td>

                      {/* Dashboard Icon slide toggle */}
                      <td className="py-2 px-3 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            setAppModules((prev) =>
                              prev.map((x) => (x.sNo === m.sNo ? { ...x, dashboardIcon: !x.dashboardIcon } : x))
                            )
                          }
                          className={`w-8 h-4 inline-flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                            m.dashboardIcon ? 'bg-indigo-600 justify-end' : 'bg-slate-300 justify-start'
                          }`}
                        >
                          <div className="bg-white w-3 h-3 rounded-full shadow-md"></div>
                        </button>
                      </td>

                      {/* Is Report slide toggle */}
                      <td className="py-2 px-3 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            setAppModules((prev) =>
                              prev.map((x) => (x.sNo === m.sNo ? { ...x, isReport: !x.isReport } : x))
                            )
                          }
                          className={`w-8 h-4 inline-flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                            m.isReport ? 'bg-indigo-600 justify-end' : 'bg-slate-300 justify-start'
                          }`}
                        >
                          <div className="bg-white w-3 h-3 rounded-full shadow-md"></div>
                        </button>
                      </td>

                      {/* Is Active slide toggle */}
                      <td className="py-2 px-3 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            setAppModules((prev) =>
                              prev.map((x) => (x.sNo === m.sNo ? { ...x, active: !x.active } : x))
                            )
                          }
                          className={`w-8 h-4 inline-flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                            m.active ? 'bg-emerald-600 justify-end' : 'bg-slate-300 justify-start'
                          }`}
                        >
                          <div className="bg-white w-3 h-3 rounded-full shadow-md"></div>
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </ErpSection>
      )}

      {/* ======================================================== */}
      {/* TAB 6: Coming Soon                                      */}
      {/* ======================================================== */}
      {activeTab === 'comingSoon' && (
        <ErpSection title="Upcoming Platform Capabilities" icon={Sparkles} tone="yellow">
          <div className="p-8 text-center max-w-md mx-auto space-y-2">
            <div className="text-3xl">🚀</div>
            <h3 className="font-bold text-sm text-slate-800">Advanced Features In Pipeline</h3>
            <p className="text-xs text-slate-500">
              Multi-branch synchronization, AI Attendance anomaly detection, and automated WhatsApp balance reminders are currently under active development.
            </p>
          </div>
        </ErpSection>
      )}

      {/* ========================================================================= */}
      {/* 1:1 MASTER SUB-PAGE DIALOG: HOUSE MASTER                                  */}
      {/* ========================================================================= */}
      {activeMasterModal === 'house' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full flex flex-col max-h-[85vh] overflow-hidden border border-slate-200">
            {/* Top Bar with Breadcrumbs & Close */}
            <div className="bg-gradient-to-r from-blue-100/70 via-indigo-50 to-blue-100/50 border-b border-blue-200 px-5 py-2.5 flex items-center justify-between text-indigo-950">
              <div className="flex items-center space-x-2 text-xs">
                <span className="font-bold text-sm">House Master</span>
                <span className="text-slate-300">|</span>
                <Home className="w-3.5 h-3.5 text-indigo-600" />
                <span className="text-slate-400">&bull;</span>
                <span className="text-slate-500">Masters</span>
                <span className="text-slate-400">&bull;</span>
                <span className="text-indigo-600 font-semibold">House Master</span>
              </div>
              <button
                onClick={() => setActiveMasterModal(null)}
                className="w-7 h-7 rounded-lg bg-white/80 hover:bg-white text-slate-600 flex items-center justify-center cursor-pointer shadow-2xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Action Bar (Search, Filter Checklist, Add Mini Button) */}
            <div className="px-5 py-2.5 border-b border-slate-100 bg-white flex items-center justify-between">
              <div className="relative max-w-xs w-full">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search house..."
                  value={masterSearchQuery}
                  onChange={(e) => setMasterSearchQuery(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-200 pl-8 pr-3 py-1.5 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center space-x-2">
                <button 
                  type="button" 
                  onClick={() => toast.success('Active table columns filtered')} 
                  title="Filter Columns" 
                  className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  <ListFilter className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNewHouseData({ name: '', priority: '' });
                    setActiveNestedAddModal('addHouse');
                  }}
                  title="Add House"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-xs font-semibold px-3 py-1.5 shadow-sm flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add House</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-y-auto flex-1">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold text-[11px] uppercase sticky top-0">
                    <th className="py-2.5 px-4">S.No.</th>
                    <th className="py-2.5 px-4">House</th>
                    <th className="py-2.5 px-4">Priority</th>
                    <th className="py-2.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {houseList
                    .filter((h) =>
                      masterSearchQuery
                        ? h.house.toLowerCase().includes(masterSearchQuery.toLowerCase())
                        : true
                    )
                    .map((h, idx) => (
                      <tr key={h.sNo} className="hover:bg-slate-50">
                        <td className="py-2.5 px-4 font-mono text-slate-500">{idx + 1}</td>
                        <td className="py-2.5 px-4 font-bold text-slate-800">{h.house}</td>
                        <td className="py-2.5 px-4 font-mono">{h.priority}</td>
                        <td className="py-2.5 px-4 text-right">
                          <button
                            onClick={() => setHouseList((prev) => prev.filter((x) => x.sNo !== h.sNo))}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>{houseList.length} items total</span>
              <span>1 – {houseList.length} of {houseList.length}</span>
            </div>
          </div>
        </div>
      )}

      {/* NESTED ADD HOUSE MODAL */}
      {activeNestedAddModal === 'addHouse' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-4 space-y-3 border border-slate-200">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-xs uppercase text-slate-800">Add New House</h3>
              <button
                onClick={() => setActiveNestedAddModal(null)}
                className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newHouseData.name) return;
                setHouseList((prev) => [
                  ...prev,
                  {
                    sNo: prev.length + 1,
                    house: newHouseData.name.toUpperCase(),
                    priority: Number(newHouseData.priority) || prev.length + 1
                  }
                ]);
                setActiveNestedAddModal(null);
                toast.success('House added successfully');
              }}
              className="space-y-2.5 text-xs"
            >
              <FormField label="House Name" required>
                <input
                  type="text"
                  required
                  value={newHouseData.name}
                  onChange={(e) => setNewHouseData((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-1.5 focus:border-indigo-500 focus:outline-none text-xs"
                  placeholder="e.g. ORANGE"
                />
              </FormField>

              <FormField label="Priority" required>
                <input
                  type="number"
                  required
                  value={newHouseData.priority}
                  onChange={(e) => setNewHouseData((prev) => ({ ...prev, priority: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-1.5 focus:border-indigo-500 focus:outline-none text-xs"
                  placeholder="5"
                />
              </FormField>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setActiveNestedAddModal(null)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold cursor-pointer shadow-sm"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1:1 MASTER SUB-PAGE DIALOG: STREAM MASTER                                 */}
      {/* ========================================================================= */}
      {activeMasterModal === 'stream' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full flex flex-col max-h-[85vh] overflow-hidden border border-slate-200">
            {/* Top Bar with Breadcrumbs & Close */}
            <div className="bg-gradient-to-r from-emerald-100/70 via-teal-50 to-emerald-100/50 border-b border-emerald-200 px-5 py-2.5 flex items-center justify-between text-emerald-950">
              <div className="flex items-center space-x-2 text-xs">
                <span className="font-bold text-sm">Stream Master</span>
                <span className="text-slate-300">|</span>
                <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-slate-400">&bull;</span>
                <span className="text-slate-500">Masters</span>
                <span className="text-slate-400">&bull;</span>
                <span className="text-emerald-700 font-semibold">Stream</span>
              </div>
              <button
                onClick={() => setActiveMasterModal(null)}
                className="w-7 h-7 rounded-lg bg-white/80 hover:bg-white text-slate-600 flex items-center justify-center cursor-pointer shadow-2xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Action Bar */}
            <div className="px-5 py-2.5 border-b border-slate-100 bg-white flex items-center justify-between">
              <div className="relative max-w-xs w-full">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search stream..."
                  value={masterSearchQuery}
                  onChange={(e) => setMasterSearchQuery(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-200 pl-8 pr-3 py-1.5 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center space-x-2">
                <button 
                  type="button" 
                  onClick={() => toast.success('Active table columns filtered')} 
                  title="Filter Columns" 
                  className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  <ListFilter className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNewStreamName('');
                    setActiveNestedAddModal('addStream');
                  }}
                  title="Add Stream"
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg text-xs font-semibold px-3 py-1.5 shadow-sm flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Stream</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-y-auto flex-1">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold text-[11px] uppercase sticky top-0">
                    <th className="py-2.5 px-4">S.No.</th>
                    <th className="py-2.5 px-4">Stream</th>
                    <th className="py-2.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {streamList
                    .filter((s) =>
                      masterSearchQuery
                        ? s.stream.toLowerCase().includes(masterSearchQuery.toLowerCase())
                        : true
                    )
                    .map((s, idx) => (
                      <tr key={s.sNo} className="hover:bg-slate-50">
                        <td className="py-2.5 px-4 font-mono text-slate-500">{idx + 1}</td>
                        <td className="py-2.5 px-4 font-bold text-slate-800">{s.stream}</td>
                        <td className="py-2.5 px-4 text-right">
                          <button
                            onClick={() => setStreamList((prev) => prev.filter((x) => x.sNo !== s.sNo))}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>{streamList.length} streams total</span>
              <span>1 – {streamList.length} of {streamList.length}</span>
            </div>
          </div>
        </div>
      )}

      {/* NESTED ADD STREAM MODAL */}
      {activeNestedAddModal === 'addStream' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-4 space-y-3 border border-slate-200">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-xs uppercase text-slate-800">Add Academic Stream</h3>
              <button
                onClick={() => setActiveNestedAddModal(null)}
                className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newStreamName) return;
                setStreamList((prev) => [
                  ...prev,
                  { sNo: prev.length + 1, stream: newStreamName.toUpperCase() }
                ]);
                setActiveNestedAddModal(null);
                toast.success('Stream added successfully');
              }}
              className="space-y-2.5 text-xs"
            >
              <FormField label="Stream Name" required>
                <input
                  type="text"
                  required
                  value={newStreamName}
                  onChange={(e) => setNewStreamName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-1.5 focus:border-indigo-500 focus:outline-none text-xs"
                  placeholder="e.g. VOCATIONAL"
                />
              </FormField>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setActiveNestedAddModal(null)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold cursor-pointer shadow-sm"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1:1 MASTER SUB-PAGE DIALOG: FEE CONCESSION BY                             */}
      {/* ========================================================================= */}
      {activeMasterModal === 'concessionBy' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full flex flex-col max-h-[85vh] overflow-hidden border border-slate-200">
            {/* Top Bar with Breadcrumbs & Close */}
            <div className="bg-gradient-to-r from-violet-100/70 via-purple-50 to-violet-100/50 border-b border-violet-200 px-5 py-2.5 flex items-center justify-between text-violet-950">
              <div className="flex items-center space-x-2 text-xs">
                <span className="font-bold text-sm">Fee Concession By</span>
                <span className="text-slate-300">|</span>
                <User className="w-3.5 h-3.5 text-violet-600" />
                <span className="text-slate-400">&bull;</span>
                <span className="text-slate-500">Fees</span>
                <span className="text-slate-400">&bull;</span>
                <span className="text-violet-700 font-semibold">Fee Concession By</span>
              </div>
              <button
                onClick={() => setActiveMasterModal(null)}
                className="w-7 h-7 rounded-lg bg-white/80 hover:bg-white text-slate-600 flex items-center justify-center cursor-pointer shadow-2xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Action Bar */}
            <div className="px-5 py-2.5 border-b border-slate-100 bg-white flex items-center justify-between">
              <div className="relative max-w-xs w-full">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search authority..."
                  value={masterSearchQuery}
                  onChange={(e) => setMasterSearchQuery(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-200 pl-8 pr-3 py-1.5 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center space-x-2">
                <button 
                  type="button" 
                  onClick={() => toast.success('Active table columns filtered')} 
                  title="Filter Columns" 
                  className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  <ListFilter className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNewConcessionByName('');
                    setActiveNestedAddModal('addConcessionBy');
                  }}
                  title="Add Fee Concession By"
                  className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-lg text-xs font-semibold px-3 py-1.5 shadow-sm flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Authority</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-y-auto flex-1">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold text-[11px] uppercase sticky top-0">
                    <th className="py-2.5 px-4">S.No.</th>
                    <th className="py-2.5 px-4">Name</th>
                    <th className="py-2.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {concessionByList
                    .filter((c) =>
                      masterSearchQuery
                        ? c.name.toLowerCase().includes(masterSearchQuery.toLowerCase())
                        : true
                    )
                    .map((c, idx) => (
                      <tr key={c.sNo} className="hover:bg-slate-50">
                        <td className="py-2.5 px-4 font-mono text-slate-500">{idx + 1}</td>
                        <td className="py-2.5 px-4 font-bold text-slate-800">{c.name}</td>
                        <td className="py-2.5 px-4 text-right">
                          <button
                            onClick={() => setConcessionByList((prev) => prev.filter((x) => x.sNo !== c.sNo))}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>{concessionByList.length} authorities</span>
              <span>1 – {concessionByList.length} of {concessionByList.length}</span>
            </div>
          </div>
        </div>
      )}

      {/* NESTED ADD FEE CONCESSION BY MODAL */}
      {activeNestedAddModal === 'addConcessionBy' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-4 space-y-3 border border-slate-200">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-xs uppercase text-slate-800">Add Concession Authority</h3>
              <button
                onClick={() => setActiveNestedAddModal(null)}
                className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newConcessionByName) return;
                setConcessionByList((prev) => [
                  ...prev,
                  { sNo: prev.length + 1, name: newConcessionByName }
                ]);
                setActiveNestedAddModal(null);
                toast.success('Authority added successfully');
              }}
              className="space-y-2.5 text-xs"
            >
              <FormField label="Authority Name" required>
                <input
                  type="text"
                  required
                  value={newConcessionByName}
                  onChange={(e) => setNewConcessionByName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-1.5 focus:border-indigo-500 focus:outline-none text-xs"
                  placeholder="e.g. Director"
                />
              </FormField>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setActiveNestedAddModal(null)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold cursor-pointer shadow-sm"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1:1 MASTER SUB-PAGE DIALOG: FEE CONCESSION TYPE                           */}
      {/* ========================================================================= */}
      {activeMasterModal === 'concessionType' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full flex flex-col max-h-[85vh] overflow-hidden border border-slate-200">
            {/* Top Bar with Breadcrumbs & Close */}
            <div className="bg-gradient-to-r from-amber-100/70 via-yellow-50 to-amber-100/50 border-b border-amber-200 px-5 py-2.5 flex items-center justify-between text-amber-950">
              <div className="flex items-center space-x-2 text-xs">
                <span className="font-bold text-sm">Fee Concession Type</span>
                <span className="text-slate-300">|</span>
                <CreditCard className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-slate-400">&bull;</span>
                <span className="text-slate-500">Fees</span>
                <span className="text-slate-400">&bull;</span>
                <span className="text-amber-800 font-semibold">Concession Category</span>
              </div>
              <button
                onClick={() => setActiveMasterModal(null)}
                className="w-7 h-7 rounded-lg bg-white/80 hover:bg-white text-slate-600 flex items-center justify-center cursor-pointer shadow-2xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Action Bar */}
            <div className="px-5 py-2.5 border-b border-slate-100 bg-white flex items-center justify-between">
              <div className="relative max-w-xs w-full">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search concession type..."
                  value={masterSearchQuery}
                  onChange={(e) => setMasterSearchQuery(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-200 pl-8 pr-3 py-1.5 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center space-x-2">
                <button 
                  type="button" 
                  onClick={() => toast.success('Active table columns filtered')} 
                  title="Filter Columns" 
                  className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  <ListFilter className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNewConcessionTypeData({
                      type: '',
                      mode: 'Amount',
                      heads: {
                        'Transport': '',
                        'Hostel': '',
                        'Extra Concession': '',
                        'Admission Fee': '',
                        'Tuition Fee': '',
                        'Activity Fee': '',
                        'Digital Learning fee': '',
                        'Registration fee': '',
                        'Examination Fee': '',
                        'School Application Fee': ''
                      }
                    });
                    setActiveNestedAddModal('addConcessionType');
                  }}
                  title="Add Fee Concession Type"
                  className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-lg text-xs font-semibold px-3 py-1.5 shadow-sm flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Type</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-y-auto flex-1">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold text-[11px] uppercase sticky top-0">
                    <th className="py-2.5 px-4">S.No.</th>
                    <th className="py-2.5 px-4">Concession Type</th>
                    <th className="py-2.5 px-4">Description</th>
                    <th className="py-2.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {concessionTypeList
                    .filter((ct) =>
                      masterSearchQuery
                        ? ct.type.toLowerCase().includes(masterSearchQuery.toLowerCase())
                        : true
                    )
                    .map((ct, idx) => (
                      <tr key={ct.sNo} className="hover:bg-slate-50">
                        <td className="py-2.5 px-4 font-mono text-slate-500">{idx + 1}</td>
                        <td className="py-2.5 px-4 font-bold text-slate-800">{ct.type}</td>
                        <td className="py-2.5 px-4 text-slate-500">{ct.description || '--'}</td>
                        <td className="py-2.5 px-4 text-right">
                          <button
                            onClick={() => setConcessionTypeList((prev) => prev.filter((x) => x.sNo !== ct.sNo))}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>{concessionTypeList.length} types total</span>
              <span>1 – {concessionTypeList.length} of {concessionTypeList.length}</span>
            </div>
          </div>
        </div>
      )}

      {/* NESTED ADD FEE CONCESSION MODAL (WITH HEADS TABLE) */}
      {activeNestedAddModal === 'addConcessionType' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-4 space-y-3 max-h-[90vh] flex flex-col border border-slate-200">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-xs uppercase text-slate-800">Add Concession Category</h3>
              <button
                onClick={() => setActiveNestedAddModal(null)}
                className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newConcessionTypeData.type) return;
                setConcessionTypeList((prev) => [
                  ...prev,
                  {
                    sNo: prev.length + 1,
                    type: newConcessionTypeData.type,
                    description: `${newConcessionTypeData.mode} concession applied`
                  }
                ]);
                setActiveNestedAddModal(null);
                toast.success('Concession type created');
              }}
              className="space-y-3 text-xs overflow-y-auto flex-1 pr-1"
            >
              <FormField label="Concession Type" required>
                <input
                  type="text"
                  required
                  value={newConcessionTypeData.type}
                  onChange={(e) =>
                    setNewConcessionTypeData((prev) => ({ ...prev, type: e.target.value }))
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-1.5 focus:border-indigo-500 focus:outline-none text-xs"
                  placeholder="e.g. Sibling Concession"
                />
              </FormField>

              {/* Amount / Percentage radio */}
              <div className="flex items-center space-x-6 py-1 bg-slate-50 p-2 rounded-lg border border-slate-200">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="concessionMode"
                    value="Amount"
                    checked={newConcessionTypeData.mode === 'Amount'}
                    onChange={() =>
                      setNewConcessionTypeData((prev) => ({ ...prev, mode: 'Amount' }))
                    }
                    className="text-indigo-600"
                  />
                  <span className="font-semibold text-slate-700">Amount (₹)</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="concessionMode"
                    value="Percentage"
                    checked={newConcessionTypeData.mode === 'Percentage'}
                    onChange={() =>
                      setNewConcessionTypeData((prev) => ({ ...prev, mode: 'Percentage' }))
                    }
                    className="text-indigo-600"
                  />
                  <span className="font-semibold text-slate-700">Percentage (%)</span>
                </label>
              </div>

              {/* HEADS | AMOUNT Table */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                    <tr>
                      <th className="py-1.5 px-3">Fee Heads</th>
                      <th className="py-1.5 px-3 text-right">
                        {newConcessionTypeData.mode === 'Amount' ? 'Amount (₹)' : 'Percentage (%)'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {Object.keys(newConcessionTypeData.heads).map((head) => (
                      <tr key={head} className="hover:bg-slate-50/50">
                        <td className="py-1.5 px-3 font-semibold text-slate-800">{head}</td>
                        <td className="py-1 px-3 text-right">
                          <input
                            type="number"
                            placeholder="0"
                            value={newConcessionTypeData.heads[head]}
                            onChange={(e) => {
                              const val = e.target.value;
                              setNewConcessionTypeData((prev) => ({
                                ...prev,
                                heads: { ...prev.heads, [head]: val }
                              }));
                            }}
                            className="w-20 text-right rounded border border-slate-200 px-2 py-0.5 text-xs focus:outline-none focus:border-indigo-500"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setActiveNestedAddModal(null)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold cursor-pointer shadow-sm"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1:1 RESULT TERM WISE SETTING MODAL                                        */}
      {/* ========================================================================= */}
      {resultTermModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full flex flex-col max-h-[90vh] overflow-hidden border border-slate-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-100/70 via-teal-50 to-emerald-100/50 border-b border-emerald-200 px-5 py-2.5 flex items-center justify-between text-emerald-950">
              <div>
                <h3 className="font-bold text-sm uppercase tracking-wide">
                  Result Term Wise Setting
                </h3>
                <p className="text-[11px] text-emerald-800">Configure examination visibility on student portal &amp; mobile app</p>
              </div>
              <button
                onClick={() => setResultTermModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-white/80 hover:bg-white text-slate-600 flex items-center justify-center cursor-pointer shadow-2xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Table */}
            <div className="overflow-y-auto flex-1">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold text-[11px] sticky top-0">
                    <th className="py-2.5 px-4 uppercase">Class</th>
                    <th className="py-2.5 px-4">
                      <div className="flex items-center space-x-2">
                        <span>Show Half Yearly Examination</span>
                        <label className="flex items-center space-x-1 cursor-pointer font-normal text-slate-600 text-[10px]">
                          <input
                            type="checkbox"
                            checked={resultTermList.every((r) => r.halfYearly)}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setResultTermList((prev) =>
                                prev.map((r) => ({ ...r, halfYearly: checked }))
                              );
                            }}
                            className="rounded w-3.5 h-3.5 text-indigo-600"
                          />
                          <span>All</span>
                        </label>
                      </div>
                    </th>
                    <th className="py-2.5 px-4">
                      <div className="flex items-center space-x-2">
                        <span>Show Annual Examination</span>
                        <label className="flex items-center space-x-1 cursor-pointer font-normal text-slate-600 text-[10px]">
                          <input
                            type="checkbox"
                            checked={resultTermList.every((r) => r.annual)}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setResultTermList((prev) =>
                                prev.map((r) => ({ ...r, annual: checked }))
                              );
                            }}
                            className="rounded w-3.5 h-3.5 text-indigo-600"
                          />
                          <span>All</span>
                        </label>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {resultTermList.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2 px-4 font-bold text-slate-800">{row.className}</td>
                      <td className="py-2 px-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={row.halfYearly}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setResultTermList((prev) =>
                                prev.map((r, i) => (i === idx ? { ...r, halfYearly: checked } : r))
                              );
                            }}
                            className="rounded w-3.5 h-3.5 text-indigo-600"
                          />
                          <span>Half Yearly Examination</span>
                        </label>
                      </td>
                      <td className="py-2 px-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={row.annual}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setResultTermList((prev) =>
                                prev.map((r, i) => (i === idx ? { ...r, annual: checked } : r))
                              );
                            }}
                            className="rounded w-3.5 h-3.5 text-indigo-600"
                          />
                          <span>{row.annualLabel || 'Annual Examination'}</span>
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer with Save button */}
            <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
              <button
                type="button"
                onClick={() => {
                  toast.success('Result Term Wise Settings saved successfully!');
                  setResultTermModalOpen(false);
                }}
                className="px-5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-sm cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1:1 SMS ADD MODAL (Matches user screenshot 1 exactly)                     */}
      {/* ========================================================================= */}
      {smsAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full p-5 space-y-3 relative border border-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wide">
                SMS Template Configuration
              </h3>
              <button
                onClick={() => setSmsAddModalOpen(false)}
                className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Radio Category Icons (Red bullseye, Blue chat, Circle, Yellow bell) */}
            <div className="flex items-center space-x-3 pt-1">
              <button
                type="button"
                onClick={() => setSmsFormData((prev) => ({ ...prev, categoryIcon: 'target' }))}
                className={`p-1.5 rounded-full border cursor-pointer ${
                  smsFormData.categoryIcon === 'target' ? 'border-red-500 bg-red-50' : 'border-transparent'
                }`}
              >
                <span className="w-4 h-4 rounded-full border-2 border-red-500 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSmsFormData((prev) => ({ ...prev, categoryIcon: 'chat' }))}
                className={`p-1.5 rounded-full border cursor-pointer ${
                  smsFormData.categoryIcon === 'chat' ? 'border-blue-500 bg-blue-50' : 'border-transparent'
                }`}
              >
                <span className="text-blue-500 text-base">💬</span>
              </button>

              <button
                type="button"
                onClick={() => setSmsFormData((prev) => ({ ...prev, categoryIcon: 'circle' }))}
                className={`p-1.5 rounded-full border cursor-pointer ${
                  smsFormData.categoryIcon === 'circle' ? 'border-slate-400 bg-slate-50' : 'border-transparent'
                }`}
              >
                <span className="w-4 h-4 rounded-full border-2 border-slate-400 inline-block"></span>
              </button>

              <button
                type="button"
                onClick={() => setSmsFormData((prev) => ({ ...prev, categoryIcon: 'bell' }))}
                className={`p-1.5 rounded-full border cursor-pointer ${
                  smsFormData.categoryIcon === 'bell' ? 'border-amber-500 bg-amber-50' : 'border-transparent'
                }`}
              >
                <span className="text-amber-500 text-base">🔔</span>
              </button>
            </div>

            {/* Form Fields */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!smsFormData.templateId || !smsFormData.templateTitle) return;
                setSmsTemplatesList((prev) => [...prev, { ...smsFormData }]);
                setSmsAddModalOpen(false);
                toast.success('SMS Template saved');
                setSmsFormData({
                  categoryIcon: 'chat',
                  templateId: '',
                  templateTitle: '',
                  type: 'Common',
                  language: 'English',
                  companyName: 'Default SMS Gateway',
                  senderId: '',
                  message: '',
                  status: 'Temporary'
                });
              }}
              className="space-y-2.5 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <FormField label="Template ID" required>
                  <input
                    type="text"
                    required
                    value={smsFormData.templateId}
                    onChange={(e) => setSmsFormData((prev) => ({ ...prev, templateId: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-1.5 bg-white focus:outline-none focus:border-indigo-500 font-mono text-xs"
                    placeholder="e.g. 110716..."
                  />
                </FormField>

                <FormField label="Template Title" required>
                  <input
                    type="text"
                    required
                    value={smsFormData.templateTitle}
                    onChange={(e) => setSmsFormData((prev) => ({ ...prev, templateTitle: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-1.5 bg-white focus:outline-none focus:border-indigo-500 text-xs"
                    placeholder="Fee Due Reminder"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <FormField label="Type" required>
                  <select
                    value={smsFormData.type}
                    onChange={(e) => setSmsFormData((prev) => ({ ...prev, type: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-1.5 bg-white focus:outline-none focus:border-indigo-500 text-xs"
                  >
                    <option value="Common">Common</option>
                    <option value="Transactional">Transactional</option>
                    <option value="Service Implicit">Service Implicit</option>
                    <option value="Promotional">Promotional</option>
                  </select>
                </FormField>

                <FormField label="Language" required>
                  <select
                    value={smsFormData.language}
                    onChange={(e) => setSmsFormData((prev) => ({ ...prev, language: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-1.5 bg-white focus:outline-none focus:border-indigo-500 text-xs"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Unicode">Unicode</option>
                  </select>
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <FormField label="SMS Company Name" required>
                  <select
                    value={smsFormData.companyName}
                    onChange={(e) => setSmsFormData((prev) => ({ ...prev, companyName: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-1.5 bg-white focus:outline-none focus:border-indigo-500 text-xs"
                  >
                    <option value="Default SMS Gateway">Default SMS Gateway</option>
                    <option value="Textlocal">Textlocal</option>
                    <option value="Msg91">Msg91</option>
                    <option value="Fast2SMS">Fast2SMS</option>
                  </select>
                </FormField>

                <FormField label="Sender ID (Optional)">
                  <input
                    type="text"
                    value={smsFormData.senderId}
                    onChange={(e) => setSmsFormData((prev) => ({ ...prev, senderId: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-1.5 bg-white focus:outline-none focus:border-indigo-500 font-mono text-xs"
                    placeholder="SCHOLEX"
                  />
                </FormField>
              </div>

              <FormField label="Message Template" required>
                <textarea
                  rows={3}
                  required
                  value={smsFormData.message}
                  onChange={(e) => setSmsFormData((prev) => ({ ...prev, message: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-1.5 bg-white focus:outline-none focus:border-indigo-500 text-xs"
                  placeholder="Dear Parent, your ward {#var#} fee is due..."
                />
              </FormField>

              <FormField label="Template Status">
                <select
                  value={smsFormData.status}
                  onChange={(e) => setSmsFormData((prev) => ({ ...prev, status: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-1.5 bg-white focus:outline-none focus:border-indigo-500 text-xs"
                >
                  <option value="Temporary">Temporary</option>
                  <option value="Permanent">Permanent</option>
                </select>
              </FormField>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setSmsAddModalOpen(false)}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-sm cursor-pointer"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1:1 UPLOAD TEMPLATE FILE MODAL (Matches user screenshot 2 exactly)        */}
      {/* ========================================================================= */}
      {smsUploadModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-5 space-y-4 relative border border-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wide">
                Upload Template File
              </h3>
              <button
                onClick={() => setSmsUploadModalOpen(false)}
                className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Choose file input */}
            <div className="p-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 flex flex-col items-center justify-center text-center">
              <UploadCloud className="w-8 h-8 text-indigo-500 mb-2" />
              <p className="text-xs font-semibold text-slate-700">Choose CSV or Excel file</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Supports .csv, .xlsx, .xls, .txt</p>
              <input
                type="file"
                accept=".csv, .xlsx, .xls, .txt"
                className="mt-3 text-xs text-slate-600 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
              />
            </div>

            {/* Footer Buttons: Cancel & Upload */}
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setSmsUploadModalOpen(false)}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  toast.success('Template file uploaded successfully!');
                  setSmsUploadModalOpen(false);
                }}
                className="px-5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-sm cursor-pointer"
              >
                Upload File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
