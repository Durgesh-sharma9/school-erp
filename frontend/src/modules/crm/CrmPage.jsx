import React, { useState } from 'react';
import {
  Home,
  Plus,
  Search,
  Phone,
  Mail,
  Calendar,
  User,
  CheckCircle,
  Clock,
  Flame,
  ArrowRight,
  Filter,
  X,
  MessageCircle,
  MoreVertical,
  Trash2,
  Edit,
  GraduationCap,
  Users,
  ChevronRight,
  TrendingUp,
  Award,
  Layers
} from 'lucide-react';
import { SCHOOL_CLASSES } from '../students/reports/studentReportsData';

export function CrmPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('leads'); // 'leads' | 'followups' | 'pipeline' | 'calls'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [classFilter, setClassFilter] = useState('ALL');

  const [leads, setLeads] = useState([
    {
      id: 1,
      leadNo: 'ENQ-2026-001',
      studentName: 'Aarav Sharma',
      parentName: 'Ramesh Sharma',
      mobile: '9876543210',
      email: 'ramesh.sharma@gmail.com',
      className: 'X',
      source: 'Walk-in',
      status: 'Hot',
      priority: 'High',
      stage: 'Campus Visit',
      followUpDate: '2026-10-12',
      counselor: 'Rajesh Verma',
      notes: 'Visited school campus. Interested in Science stream. Requested fee concession details.',
      createdAt: '2026-10-09'
    },
    {
      id: 2,
      leadNo: 'ENQ-2026-002',
      studentName: 'Ananya Verma',
      parentName: 'Sanjay Verma',
      mobile: '9812345678',
      email: 'sanjay.verma@yahoo.com',
      className: 'XI-SCIENCE',
      source: 'Website',
      status: 'Warm',
      priority: 'Medium',
      stage: 'Application',
      followUpDate: '2026-10-11',
      counselor: 'Pooja Singh',
      notes: 'Filled online admission enquiry. Awaiting board result mark sheet copy.',
      createdAt: '2026-10-08'
    },
    {
      id: 3,
      leadNo: 'ENQ-2026-003',
      studentName: 'Vihaan Patel',
      parentName: 'Nitin Patel',
      mobile: '9923456789',
      email: 'nitin.patel@gmail.com',
      className: 'I',
      source: 'Referral',
      status: 'Enrolled',
      priority: 'Low',
      stage: 'Admitted',
      followUpDate: '2026-10-15',
      counselor: 'Rajesh Verma',
      notes: 'Admission confirmed and fee paid. Transport seat allocated.',
      createdAt: '2026-10-05'
    },
    {
      id: 4,
      leadNo: 'ENQ-2026-004',
      studentName: 'Ishita Gupta',
      parentName: 'Sunil Gupta',
      mobile: '9789012345',
      email: 'sunil.g@outlook.com',
      className: 'IX',
      source: 'Social Media',
      status: 'New',
      priority: 'High',
      stage: 'Inquiry',
      followUpDate: '2026-10-11',
      counselor: 'Pooja Singh',
      notes: 'Inquired about hostel facility and scholarship exam.',
      createdAt: '2026-10-11'
    },
    {
      id: 5,
      leadNo: 'ENQ-2026-005',
      studentName: 'Kabir Singh',
      parentName: 'Harpreet Singh',
      mobile: '9654321987',
      email: 'harpreet.s@gmail.com',
      className: 'Pre-Nursery',
      source: 'Phone Call',
      status: 'Follow Up',
      priority: 'Medium',
      stage: 'Campus Visit',
      followUpDate: '2026-10-13',
      counselor: 'Rajesh Verma',
      notes: 'Scheduled school campus tour with parents on Saturday.',
      createdAt: '2026-10-10'
    }
  ]);

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedLeadForFollowUp, setSelectedLeadForFollowUp] = useState(null);
  const [followUpNote, setFollowUpNote] = useState('');
  const [newFollowUpDate, setNewFollowUpDate] = useState('');
  const [newStatus, setNewStatus] = useState('');

  // Add Lead Form State
  const [newLeadForm, setNewLeadForm] = useState({
    studentName: '',
    parentName: '',
    mobile: '',
    email: '',
    className: 'I',
    source: 'Walk-in',
    priority: 'High',
    status: 'New',
    stage: 'Inquiry',
    followUpDate: new Date().toISOString().split('T')[0],
    counselor: 'Pooja Singh',
    notes: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLeadForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddLeadSubmit = (e) => {
    e.preventDefault();
    if (!newLeadForm.studentName || !newLeadForm.mobile) {
      alert('Please fill mandatory fields: Student Name and Mobile Number');
      return;
    }

    const newEntry = {
      ...newLeadForm,
      id: Date.now(),
      leadNo: `ENQ-2026-${String(leads.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setLeads(prev => [newEntry, ...prev]);
    setShowAddModal(false);
    setNewLeadForm({
      studentName: '',
      parentName: '',
      mobile: '',
      email: '',
      className: 'I',
      source: 'Walk-in',
      priority: 'High',
      status: 'New',
      stage: 'Inquiry',
      followUpDate: new Date().toISOString().split('T')[0],
      counselor: 'Pooja Singh',
      notes: ''
    });
  };

  const handleSaveFollowUp = () => {
    if (!selectedLeadForFollowUp) return;
    setLeads(prev => prev.map(l => {
      if (l.id === selectedLeadForFollowUp.id) {
        return {
          ...l,
          status: newStatus || l.status,
          followUpDate: newFollowUpDate || l.followUpDate,
          notes: followUpNote ? `${l.notes} | ${new Date().toLocaleDateString('en-GB')}: ${followUpNote}` : l.notes
        };
      }
      return l;
    }));
    setSelectedLeadForFollowUp(null);
    setFollowUpNote('');
  };

  const handleDeleteLead = (id) => {
    if (confirm('Are you sure you want to delete this enquiry?')) {
      setLeads(prev => prev.filter(l => l.id !== id));
    }
  };

  // Filtered Leads
  const filteredLeads = leads.filter(l => {
    const matchSearch =
      !searchQuery ||
      l.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.mobile.includes(searchQuery) ||
      l.leadNo.toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus = statusFilter === 'ALL' || l.status === statusFilter;
    const matchClass = classFilter === 'ALL' || l.className === classFilter;

    return matchSearch && matchStatus && matchClass;
  });

  const todayStr = '2026-10-11';
  const todayFollowUps = leads.filter(l => l.followUpDate === todayStr || l.status === 'Follow Up');

  // Metrics
  const totalLeads = leads.length;
  const hotLeadsCount = leads.filter(l => l.status === 'Hot').length;
  const enrolledCount = leads.filter(l => l.status === 'Enrolled').length;
  const conversionRate = totalLeads > 0 ? Math.round((enrolledCount / totalLeads) * 100) : 0;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Hot':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-600 border border-rose-200 flex items-center gap-1 w-max"><Flame className="w-3 h-3" /> Hot</span>;
      case 'Warm':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-200 flex items-center gap-1 w-max"><Clock className="w-3 h-3" /> Warm</span>;
      case 'Follow Up':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-600 border border-blue-200 flex items-center gap-1 w-max"><Phone className="w-3 h-3" /> Follow Up</span>;
      case 'Enrolled':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center gap-1 w-max"><CheckCircle className="w-3 h-3" /> Enrolled</span>;
      case 'New':
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center gap-1 w-max"><User className="w-3 h-3" /> New</span>;
    }
  };

  const stages = ['Inquiry', 'Campus Visit', 'Application', 'Test/Interview', 'Admitted'];

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      {/* Top Toolbar matching UAB Style */}
      <div className="bg-white border-b border-slate-200/80 px-4 md:px-8 py-3 flex items-center justify-between shadow-xs sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <h1 className="text-base md:text-lg font-semibold text-slate-800">
            CRM & Admission Enquiries
          </h1>
          <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400 pl-3 border-l border-slate-200">
            <button onClick={() => onNavigate && onNavigate('/')} className="hover:text-indigo-600">
              <Home className="w-3.5 h-3.5" />
            </button>
            <span>•</span>
            <span className="text-slate-500">School ERP</span>
            <span>•</span>
            <span className="text-indigo-600 font-medium">CRM</span>
          </div>
        </div>

        {/* Purple Mini FAB (+ Add Enquiry) */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="h-9 px-3.5 rounded-full bg-[#5c67f6] hover:bg-indigo-600 text-white flex items-center space-x-1.5 shadow-md hover:shadow-lg transition-transform hover:scale-105 text-xs font-semibold"
            title="Add New Enquiry"
          >
            <Plus className="w-4 h-4" />
            <span>New Lead</span>
          </button>
        </div>
      </div>

      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-5">
        {/* KPI Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Total Enquiries</p>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">{totalLeads}</h3>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-1">
                <TrendingUp className="w-3 h-3" /> Active pipeline
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Today's Follow-ups</p>
              <h3 className="text-xl font-bold text-blue-600 mt-0.5">{todayFollowUps.length}</h3>
              <span className="text-[11px] text-blue-500 font-semibold flex items-center gap-0.5 mt-1">
                <Clock className="w-3 h-3" /> Due today
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Hot Leads</p>
              <h3 className="text-xl font-bold text-rose-600 mt-0.5">{hotLeadsCount}</h3>
              <span className="text-[11px] text-rose-500 font-semibold flex items-center gap-0.5 mt-1">
                <Flame className="w-3 h-3" /> Priority follow-up
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Enrolled Students</p>
              <h3 className="text-xl font-bold text-emerald-600 mt-0.5">{enrolledCount}</h3>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-1">
                <Award className="w-3 h-3" /> {conversionRate}% conversion
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* View Tabs Header */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 overflow-hidden">
          <div className="border-b border-slate-200 px-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex space-x-1 sm:space-x-3">
              <button
                onClick={() => setActiveTab('leads')}
                className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'leads'
                    ? 'border-[#5c67f6] text-[#5c67f6]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>All Enquiries ({leads.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('pipeline')}
                className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'pipeline'
                    ? 'border-[#5c67f6] text-[#5c67f6]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Admission Pipeline</span>
              </button>
              <button
                onClick={() => setActiveTab('followups')}
                className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'followups'
                    ? 'border-[#5c67f6] text-[#5c67f6]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Follow-ups ({todayFollowUps.length})</span>
              </button>
            </div>

            {/* Global Search & Filters */}
            <div className="flex items-center space-x-2 py-2">
              <div className="relative w-48 sm:w-60">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search lead, parent, phone..."
                  className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs py-1.5 px-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-700 bg-white"
              >
                <option value="ALL">All Status</option>
                <option value="New">New</option>
                <option value="Hot">Hot</option>
                <option value="Warm">Warm</option>
                <option value="Follow Up">Follow Up</option>
                <option value="Enrolled">Enrolled</option>
              </select>

              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="text-xs py-1.5 px-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-700 bg-white"
              >
                <option value="ALL">All Classes</option>
                {SCHOOL_CLASSES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* TAB 1: ALL LEADS TABLE */}
          {activeTab === 'leads' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">ENQ NO.</th>
                    <th className="py-3 px-4">STUDENT NAME</th>
                    <th className="py-3 px-4">CLASS</th>
                    <th className="py-3 px-4">PARENT & CONTACT</th>
                    <th className="py-3 px-4">SOURCE</th>
                    <th className="py-3 px-4">STATUS</th>
                    <th className="py-3 px-4">FOLLOW-UP</th>
                    <th className="py-3 px-4">COUNSELOR</th>
                    <th className="py-3 px-4 text-center">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredLeads.length > 0 ? (
                    filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-indigo-600">
                          {lead.leadNo}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900">{lead.studentName}</div>
                          <div className="text-[11px] text-slate-400">Reg: {lead.createdAt}</div>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-800">
                          {lead.className}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-800">{lead.parentName}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" /> {lead.mobile}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium">
                            {lead.source}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(lead.status)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-mono text-slate-700">{lead.followUpDate}</div>
                          <div className="text-[11px] text-slate-400 truncate max-w-[120px]" title={lead.notes}>
                            {lead.notes}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {lead.counselor}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <button
                              onClick={() => {
                                setSelectedLeadForFollowUp(lead);
                                setNewStatus(lead.status);
                                setNewFollowUpDate(lead.followUpDate);
                              }}
                              className="p-1 rounded text-blue-600 hover:bg-blue-50"
                              title="Update Follow-up"
                            >
                              <Phone className="w-4 h-4" />
                            </button>
                            <a
                              href={`https://wa.me/91${lead.mobile}?text=Hello%20${encodeURIComponent(lead.parentName)},%20Greetings%20from%20J%20D%20International%20School.%20Regarding%20admission%20enquiry%20for%20${encodeURIComponent(lead.studentName)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 rounded text-emerald-600 hover:bg-emerald-50"
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>
                            <button
                              onClick={() => {
                                if (onNavigate) {
                                  onNavigate('/student-registration');
                                }
                              }}
                              className="p-1 rounded text-indigo-600 hover:bg-indigo-50"
                              title="Convert to Admission"
                            >
                              <GraduationCap className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteLead(lead.id)}
                              className="p-1 rounded text-rose-500 hover:bg-rose-50"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center py-10 text-slate-400">
                        No enquiries matching filters found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 2: ADMISSION PIPELINE KANBAN */}
          {activeTab === 'pipeline' && (
            <div className="p-4 grid grid-cols-1 md:grid-cols-5 gap-3 bg-slate-50/60 min-h-[450px]">
              {stages.map((stage) => {
                const stageLeads = leads.filter(l => (l.stage || 'Inquiry') === stage);
                return (
                  <div key={stage} className="bg-slate-100/80 rounded-xl p-3 flex flex-col border border-slate-200">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                      <span className="font-bold text-xs text-slate-800">{stage}</span>
                      <span className="px-2 py-0.5 rounded-full bg-white text-[11px] font-bold text-indigo-600 shadow-2xs">
                        {stageLeads.length}
                      </span>
                    </div>

                    <div className="space-y-2 flex-1 overflow-y-auto">
                      {stageLeads.map((l) => (
                        <div
                          key={l.id}
                          className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs hover:shadow-md transition-shadow text-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900">{l.studentName}</span>
                            <span className="font-mono text-[10px] text-slate-400">{l.className}</span>
                          </div>
                          <p className="text-[11px] text-slate-500">{l.parentName} • {l.mobile}</p>
                          <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                            {getStatusBadge(l.status)}
                            <button
                              onClick={() => {
                                const currentIndex = stages.indexOf(stage);
                                if (currentIndex < stages.length - 1) {
                                  const nextStage = stages[currentIndex + 1];
                                  setLeads(prev => prev.map(item => item.id === l.id ? { ...item, stage: nextStage } : item));
                                }
                              }}
                              className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5"
                              title="Move to Next Stage"
                            >
                              <span>Next</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {stageLeads.length === 0 && (
                        <div className="text-center py-8 text-[11px] text-slate-400">
                          Empty stage
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: TODAY FOLLOW-UPS */}
          {activeTab === 'followups' && (
            <div className="p-4 space-y-3">
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-xs text-amber-800 flex items-center justify-between">
                <span>Showing follow-ups due for action today ({todayFollowUps.length} Pending Leads)</span>
                <span className="font-bold text-amber-900">{todayStr}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {todayFollowUps.map(lead => (
                  <div key={lead.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono font-bold text-indigo-600 text-xs">{lead.leadNo}</span>
                        {getStatusBadge(lead.status)}
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">{lead.studentName} (Class: {lead.className})</h4>
                      <p className="text-xs text-slate-600 mt-0.5">Parent: {lead.parentName} • Ph: {lead.mobile}</p>
                      <p className="text-xs bg-slate-50 p-2 rounded mt-2 text-slate-700 italic border border-slate-100">
                        "{lead.notes}"
                      </p>
                    </div>

                    <div className="flex items-center justify-end space-x-2 mt-4 pt-3 border-t">
                      <a
                        href={`tel:${lead.mobile}`}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold flex items-center gap-1"
                      >
                        <Phone className="w-3.5 h-3.5" /> Call
                      </a>
                      <a
                        href={`https://wa.me/91${lead.mobile}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold flex items-center gap-1"
                      >
                        <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                      </a>
                      <button
                        onClick={() => {
                          setSelectedLeadForFollowUp(lead);
                          setNewStatus(lead.status);
                          setNewFollowUpDate(lead.followUpDate);
                        }}
                        className="px-3 py-1.5 bg-[#5c67f6] hover:bg-indigo-600 text-white rounded-lg text-xs font-semibold"
                      >
                        Log Outcome
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* NEW ADMISSION ENQUIRY MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-base font-bold text-slate-900 tracking-wide uppercase border-b pb-3 mb-4">
              NEW ADMISSION ENQUIRY / LEAD
            </h2>

            <form onSubmit={handleAddLeadSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Student Name*</label>
                  <input
                    type="text"
                    name="studentName"
                    value={newLeadForm.studentName}
                    onChange={handleInputChange}
                    placeholder="e.g. Aarav Sharma"
                    required
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Class Seeking Admission*</label>
                  <select
                    name="className"
                    value={newLeadForm.className}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                  >
                    {SCHOOL_CLASSES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Parent / Guardian Name</label>
                  <input
                    type="text"
                    name="parentName"
                    value={newLeadForm.parentName}
                    onChange={handleInputChange}
                    placeholder="e.g. Ramesh Sharma"
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Contact Mobile Number*</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={newLeadForm.mobile}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile number"
                    required
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Email ID</label>
                  <input
                    type="email"
                    name="email"
                    value={newLeadForm.email}
                    onChange={handleInputChange}
                    placeholder="parent@example.com"
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Enquiry Source</label>
                  <select
                    name="source"
                    value={newLeadForm.source}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                  >
                    <option value="Walk-in">Walk-in</option>
                    <option value="Website">Website</option>
                    <option value="Phone Call">Phone Call</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Referral">Friend / Referral</option>
                    <option value="Newspaper Ad">Newspaper Ad</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Priority / Status</label>
                  <select
                    name="status"
                    value={newLeadForm.status}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                  >
                    <option value="New">New</option>
                    <option value="Hot">Hot (High Probability)</option>
                    <option value="Warm">Warm (Medium)</option>
                    <option value="Follow Up">Follow Up Required</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Follow-up Date*</label>
                  <input
                    type="date"
                    name="followUpDate"
                    value={newLeadForm.followUpDate}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Assigned Counselor</label>
                <select
                  name="counselor"
                  value={newLeadForm.counselor}
                  onChange={handleInputChange}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                >
                  <option value="Pooja Singh">Pooja Singh (Admission Counselor)</option>
                  <option value="Rajesh Verma">Rajesh Verma (Vice Principal)</option>
                  <option value="Neha Sharma">Neha Sharma (Front Desk Executive)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Initial Discussion Notes</label>
                <textarea
                  name="notes"
                  rows="3"
                  value={newLeadForm.notes}
                  onChange={handleInputChange}
                  placeholder="Record parent queries, transport requirement, previous school details..."
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#5c67f6] hover:bg-indigo-600 text-white rounded-lg font-semibold shadow-md transition-colors"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPDATE FOLLOW-UP MODAL */}
      {selectedLeadForFollowUp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedLeadForFollowUp(null)}
              className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-slate-900 text-sm mb-1">
              Log Follow-up: {selectedLeadForFollowUp.studentName}
            </h3>
            <p className="text-xs text-slate-500 mb-4 font-mono">
              {selectedLeadForFollowUp.leadNo} • Class: {selectedLeadForFollowUp.className}
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Update Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                >
                  <option value="New">New</option>
                  <option value="Hot">Hot</option>
                  <option value="Warm">Warm</option>
                  <option value="Follow Up">Follow Up</option>
                  <option value="Enrolled">Enrolled</option>
                  <option value="Dropped">Dropped / Not Interested</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Next Follow-up Date</label>
                <input
                  type="date"
                  value={newFollowUpDate}
                  onChange={(e) => setNewFollowUpDate(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Call / Meeting Outcome Note</label>
                <textarea
                  rows="3"
                  value={followUpNote}
                  onChange={(e) => setFollowUpNote(e.target.value)}
                  placeholder="Enter details of conversation with parent..."
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-5 pt-3 border-t">
              <button
                onClick={() => setSelectedLeadForFollowUp(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveFollowUp}
                className="px-5 py-2 bg-[#5c67f6] hover:bg-indigo-600 text-white rounded-lg text-xs font-semibold shadow-md"
              >
                Save Outcome
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
