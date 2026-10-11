import React, { useState } from 'react';
import {
  Home,
  Plus,
  Search,
  Filter,
  Phone,
  Mail,
  Calendar,
  User,
  Users,
  CheckCircle,
  Clock,
  Flame,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  X,
  MessageCircle,
  Trash2,
  Edit,
  GraduationCap,
  MapPin,
  Sparkles,
  GitCommit,
  Check,
  FileQuestion,
  FileText
} from 'lucide-react';
import { SCHOOL_CLASSES } from '../students/reports/studentReportsData';
import { DEFAULT_ENQUIRIES } from './crmData';

const STAGES = [
  'Inquiry',
  'Campus Visit',
  'Application',
  'Assessment',
  'Interview',
  'Final Decision'
];

export function CrmEnquiriesPage({ onNavigate }) {
  const [enquiries, setEnquiries] = useState(DEFAULT_ENQUIRIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [classFilter, setClassFilter] = useState('ALL');
  const [sourceFilter, setSourceFilter] = useState('ALL');

  // Expanded Journey row
  const [expandedId, setExpandedId] = useState(null);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedForFollowUp, setSelectedForFollowUp] = useState(null);

  // Follow-up form
  const [followUpNote, setFollowUpNote] = useState('');
  const [nextFollowUpDate, setNextFollowUpDate] = useState('');
  const [newStatus, setNewStatus] = useState('');

  // Add Enquiry Form State
  const [formData, setFormData] = useState({
    studentName: '',
    gender: 'Male',
    dob: '2015-01-01',
    parentName: '',
    motherName: '',
    mobile: '',
    altMobile: '',
    email: '',
    className: 'I',
    previousSchool: '',
    locality: '',
    city: 'Jaipur',
    source: 'Walk-in',
    status: 'New',
    priority: 'High',
    counselor: 'Pooja Singh',
    notes: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.studentName || !formData.mobile) {
      alert('Please fill mandatory fields: Student Name and Contact Mobile');
      return;
    }

    const newEnquiry = {
      ...formData,
      id: Date.now(),
      enquiryId: `ENQ-2026-${String(enquiries.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString().split('T')[0],
      academicSession: '2026-2027',
      followUpDate: new Date().toISOString().split('T')[0],
      journey: STAGES.map((st, idx) => ({
        stage: st,
        date: idx === 0 ? new Date().toISOString().split('T')[0] : '',
        status: idx === 0 ? 'Completed' : 'Pending',
        note: idx === 0 ? 'Enquiry submitted' : ''
      }))
    };

    setEnquiries(prev => [newEnquiry, ...prev]);
    setShowAddModal(false);
    setFormData({
      studentName: '',
      gender: 'Male',
      dob: '2015-01-01',
      parentName: '',
      motherName: '',
      mobile: '',
      altMobile: '',
      email: '',
      className: 'I',
      previousSchool: '',
      locality: '',
      city: 'Jaipur',
      source: 'Walk-in',
      status: 'New',
      priority: 'High',
      counselor: 'Pooja Singh',
      notes: ''
    });
  };

  const handleSaveFollowUp = () => {
    if (!selectedForFollowUp) return;
    setEnquiries(prev => prev.map(e => {
      if (e.id === selectedForFollowUp.id) {
        return {
          ...e,
          status: newStatus || e.status,
          followUpDate: nextFollowUpDate || e.followUpDate,
          notes: followUpNote ? `${e.notes} | ${new Date().toLocaleDateString('en-GB')}: ${followUpNote}` : e.notes
        };
      }
      return e;
    }));
    setSelectedForFollowUp(null);
    setFollowUpNote('');
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this enquiry?')) {
      setEnquiries(prev => prev.filter(e => e.id !== id));
    }
  };

  const updateStageStatus = (enquiryId, stageName, newStageStatus) => {
    setEnquiries(prev => prev.map(enq => {
      if (enq.id === enquiryId) {
        const updatedJourney = enq.journey.map(j => {
          if (j.stage === stageName) {
            return {
              ...j,
              status: newStageStatus,
              date: newStageStatus === 'Completed' ? new Date().toISOString().split('T')[0] : j.date
            };
          }
          return j;
        });
        return { ...enq, journey: updatedJourney };
      }
      return enq;
    }));
  };

  // Filtered List
  const filtered = enquiries.filter(e => {
    const matchSearch =
      !searchQuery ||
      e.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.enquiryId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.mobile.includes(searchQuery) ||
      (e.locality && e.locality.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchStatus = statusFilter === 'ALL' || e.status === statusFilter;
    const matchClass = classFilter === 'ALL' || e.className === classFilter;
    const matchSource = sourceFilter === 'ALL' || e.source === sourceFilter;

    return matchSearch && matchStatus && matchClass && matchSource;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Hot':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-600 border border-rose-200 inline-flex items-center gap-1"><Flame className="w-3 h-3" /> Hot</span>;
      case 'Warm':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-200 inline-flex items-center gap-1"><Clock className="w-3 h-3" /> Warm</span>;
      case 'Follow Up':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-600 border border-blue-200 inline-flex items-center gap-1"><Phone className="w-3 h-3" /> Follow Up</span>;
      case 'Enrolled':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 inline-flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Enrolled</span>;
      case 'New':
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-200 inline-flex items-center gap-1"><User className="w-3 h-3" /> New</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      {/* Top Breadcrumbs Toolbar */}
      <div className="bg-white border-b border-slate-200/80 px-4 md:px-8 py-3 flex items-center justify-between shadow-xs sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <h1 className="text-base md:text-lg font-semibold text-slate-800">
            Admission Enquiries
          </h1>
          <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400 pl-3 border-l border-slate-200">
            <button onClick={() => onNavigate && onNavigate('/')} className="hover:text-indigo-600">
              <Home className="w-3.5 h-3.5" />
            </button>
            <span>•</span>
            <button onClick={() => onNavigate && onNavigate('/crm')} className="hover:text-indigo-600">
              CRM
            </button>
            <span>•</span>
            <span className="text-indigo-600 font-medium">Enquiries</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="h-9 px-3.5 rounded-full bg-[#5c67f6] hover:bg-indigo-600 text-white flex items-center space-x-1.5 shadow-md hover:shadow-lg transition-transform hover:scale-105 text-xs font-semibold"
          >
            <Plus className="w-4 h-4" />
            <span>New Enquiry</span>
          </button>
        </div>
      </div>

      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4">
        {/* Filters Header */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-slate-700">Total Enquiries:</span>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
                {filtered.length} of {enquiries.length}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Search */}
              <div className="relative w-48 sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search student, parent, phone..."
                  className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs py-1.5 px-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 text-slate-700 bg-white"
              >
                <option value="ALL">All Status</option>
                <option value="New">New</option>
                <option value="Hot">Hot</option>
                <option value="Warm">Warm</option>
                <option value="Follow Up">Follow Up</option>
                <option value="Enrolled">Enrolled</option>
              </select>

              {/* Class Filter */}
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="text-xs py-1.5 px-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 text-slate-700 bg-white"
              >
                <option value="ALL">All Classes</option>
                {SCHOOL_CLASSES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              {/* Source Filter */}
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="text-xs py-1.5 px-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 text-slate-700 bg-white"
              >
                <option value="ALL">All Sources</option>
                <option value="Walk-in">Walk-in</option>
                <option value="Website">Website</option>
                <option value="Social Media">Social Media</option>
                <option value="Referral">Referral</option>
                <option value="Phone Call">Phone Call</option>
              </select>
            </div>
          </div>
        </div>

        {/* Enquiries Table with Journey Expanders */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3 w-8"></th>
                  <th className="py-3 px-3">ENQ ID</th>
                  <th className="py-3 px-3">STUDENT NAME</th>
                  <th className="py-3 px-3">CLASS</th>
                  <th className="py-3 px-3">PARENT & PHONE</th>
                  <th className="py-3 px-3">LOCALITY</th>
                  <th className="py-3 px-3">SOURCE</th>
                  <th className="py-3 px-3">STATUS</th>
                  <th className="py-3 px-3">COUNSELOR</th>
                  <th className="py-3 px-3 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.length > 0 ? (
                  filtered.map((enq) => {
                    const isExpanded = expandedId === enq.id;
                    return (
                      <React.Fragment key={enq.id}>
                        <tr className={`hover:bg-slate-50 transition-colors ${isExpanded ? 'bg-indigo-50/20' : ''}`}>
                          <td className="py-3 px-3 text-center">
                            <button
                              onClick={() => setExpandedId(isExpanded ? null : enq.id)}
                              className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-100"
                              title="Toggle Admission Journey"
                            >
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-indigo-600" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                            </button>
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-indigo-600">
                            {enq.enquiryId}
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-bold text-slate-900">{enq.studentName}</div>
                            <div className="text-[11px] text-slate-400">{enq.gender} • DOB: {enq.dob}</div>
                          </td>
                          <td className="py-3 px-3 font-semibold text-slate-800">
                            {enq.className}
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-medium text-slate-800">{enq.parentName}</div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate-400" /> {enq.mobile}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-slate-600 max-w-[120px] truncate" title={enq.locality}>
                            {enq.locality || '—'}
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium">
                              {enq.source}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            {getStatusBadge(enq.status)}
                          </td>
                          <td className="py-3 px-3 text-slate-600">
                            {enq.counselor}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <div className="flex items-center justify-center space-x-1">
                              <button
                                onClick={() => {
                                  setSelectedForFollowUp(enq);
                                  setNewStatus(enq.status);
                                  setNextFollowUpDate(enq.followUpDate);
                                }}
                                className="p-1 rounded text-blue-600 hover:bg-blue-50"
                                title="Log Follow-up Call"
                              >
                                <Phone className="w-4 h-4" />
                              </button>
                              <a
                                href={`https://wa.me/91${enq.mobile}?text=Hello%20${encodeURIComponent(enq.parentName)},%20Greetings%20from%20J%20D%20International%20School.%20Regarding%20admission%20enquiry%20for%20${encodeURIComponent(enq.studentName)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1 rounded text-emerald-600 hover:bg-emerald-50"
                                title="Chat on WhatsApp"
                              >
                                <MessageCircle className="w-4 h-4" />
                              </a>
                              <button
                                onClick={() => setSelectedProfile(enq)}
                                className="p-1 rounded text-purple-600 hover:bg-purple-50"
                                title="View Complete CRM Profile"
                              >
                                <User className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => onNavigate && onNavigate('/student-registration')}
                                className="p-1 rounded text-indigo-600 hover:bg-indigo-50"
                                title="Enroll / Register Student"
                              >
                                <GraduationCap className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(enq.id)}
                                className="p-1 rounded text-rose-500 hover:bg-rose-50"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Expandable Admission Journey Timeline (Campus CRM Feature) */}
                        {isExpanded && (
                          <tr className="bg-slate-50/80">
                            <td colSpan="10" className="p-4 border-b border-indigo-100">
                              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                                <div className="flex items-center justify-between pb-2 border-b">
                                  <div className="flex items-center space-x-2">
                                    <GitCommit className="w-4 h-4 text-indigo-600" />
                                    <span className="font-bold text-xs text-slate-800">
                                      Admission Journey Pipeline: {enq.studentName} ({enq.enquiryId})
                                    </span>
                                  </div>
                                  <span className="text-[11px] text-slate-500">
                                    Click any stage to change status
                                  </span>
                                </div>

                                {/* Journey Stage Steps */}
                                <div className="grid grid-cols-2 md:grid-cols-6 gap-2 pt-1">
                                  {enq.journey.map((step, idx) => {
                                    const isDone = step.status === 'Completed';
                                    const isInProg = step.status === 'In Progress';
                                    return (
                                      <div
                                        key={step.stage}
                                        onClick={() => {
                                          const nextSt = isDone ? 'Pending' : isInProg ? 'Completed' : 'In Progress';
                                          updateStageStatus(enq.id, step.stage, nextSt);
                                        }}
                                        className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                                          isDone
                                            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800'
                                            : isInProg
                                            ? 'bg-blue-50/70 border-blue-300 text-blue-800'
                                            : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'
                                        }`}
                                      >
                                        <div className="flex items-center justify-between mb-1">
                                          <span className="font-bold text-[11px]">{idx + 1}. {step.stage}</span>
                                          {isDone ? (
                                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                                          ) : (
                                            <span className="w-2 h-2 rounded-full bg-slate-300" />
                                          )}
                                        </div>
                                        <div className="text-[10px] font-medium">
                                          {step.status} {step.date ? `(${step.date})` : ''}
                                        </div>
                                        {step.note && (
                                          <div className="text-[10px] text-slate-500 mt-1 italic truncate">
                                            {step.note}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>

                                <div className="text-xs text-slate-600 pt-2 border-t flex items-center justify-between">
                                  <span><strong>Notes / Conversation History:</strong> {enq.notes}</span>
                                  <button
                                    onClick={() => {
                                      setSelectedForFollowUp(enq);
                                      setNewStatus(enq.status);
                                      setNextFollowUpDate(enq.followUpDate);
                                    }}
                                    className="text-xs text-indigo-600 font-semibold hover:underline"
                                  >
                                    + Add Follow-up Note
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center py-10 text-slate-400">
                      No enquiries found matching selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* NEW ENQUIRY MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-base font-bold text-slate-900 tracking-wide uppercase border-b pb-3 mb-4">
              NEW ADMISSION ENQUIRY
            </h2>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-600 font-semibold mb-1">Student Full Name*</label>
                  <input
                    type="text"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleInputChange}
                    placeholder="e.g. Aarav Sharma"
                    required
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Gender*</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Class Seeking Admission*</label>
                  <select
                    name="className"
                    value={formData.className}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                  >
                    {SCHOOL_CLASSES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Previous School</label>
                  <input
                    type="text"
                    name="previousSchool"
                    value={formData.previousSchool}
                    onChange={handleInputChange}
                    placeholder="e.g. St. Xavier Public School"
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Father / Guardian Name*</label>
                  <input
                    type="text"
                    name="parentName"
                    value={formData.parentName}
                    onChange={handleInputChange}
                    placeholder="e.g. Ramesh Sharma"
                    required
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Primary Mobile Number*</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
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
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="parent@example.com"
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Locality / Address</label>
                  <input
                    type="text"
                    name="locality"
                    value={formData.locality}
                    onChange={handleInputChange}
                    placeholder="e.g. Model Town"
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Enquiry Source</label>
                  <select
                    name="source"
                    value={formData.source}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                  >
                    <option value="Walk-in">Walk-in</option>
                    <option value="Website">Website</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Referral">Friend / Referral</option>
                    <option value="Phone Call">Phone Call</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Priority Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                  >
                    <option value="New">New</option>
                    <option value="Hot">Hot Lead</option>
                    <option value="Warm">Warm</option>
                    <option value="Follow Up">Follow Up Required</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Initial Discussion Remarks</label>
                <textarea
                  name="notes"
                  rows="3"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Record parent queries, subjects interested, transport requirements..."
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
                  Save Enquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FULL CRM PROFILE MODAL (Campus CRM Profile Drawer) */}
      {selectedProfile && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedProfile(null)}
              className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 border-b pb-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg">
                {selectedProfile.studentName.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">{selectedProfile.studentName}</h3>
                <p className="text-xs text-slate-500 font-mono">
                  {selectedProfile.enquiryId} • Class {selectedProfile.className} • {selectedProfile.gender}
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[11px]">Father / Guardian</span>
                  <span className="font-bold text-slate-800">{selectedProfile.parentName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Contact Mobile</span>
                  <span className="font-bold text-indigo-600">{selectedProfile.mobile}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Email Address</span>
                  <span className="font-medium text-slate-700">{selectedProfile.email || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Locality / City</span>
                  <span className="font-medium text-slate-700">{selectedProfile.locality || selectedProfile.city}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Previous School</span>
                  <span className="font-medium text-slate-700">{selectedProfile.previousSchool || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Lead Source</span>
                  <span className="font-semibold text-slate-800">{selectedProfile.source}</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-1">Conversation Notes:</span>
                <p className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 leading-relaxed">
                  {selectedProfile.notes}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                <a
                  href={`https://wa.me/91${selectedProfile.mobile}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-semibold flex items-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
                <button
                  onClick={() => {
                    setSelectedProfile(null);
                    onNavigate && onNavigate('/student-registration');
                  }}
                  className="px-4 py-2 bg-[#5c67f6] hover:bg-indigo-600 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-md"
                >
                  <GraduationCap className="w-4 h-4" /> Convert to Admission
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LOG FOLLOW-UP MODAL */}
      {selectedForFollowUp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedForFollowUp(null)}
              className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-slate-900 text-sm mb-1">
              Log Follow-up: {selectedForFollowUp.studentName}
            </h3>
            <p className="text-xs text-slate-500 mb-4 font-mono">
              {selectedForFollowUp.enquiryId} • Class {selectedForFollowUp.className}
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
                  value={nextFollowUpDate}
                  onChange={(e) => setNextFollowUpDate(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Conversation Notes / Outcome</label>
                <textarea
                  rows="3"
                  value={followUpNote}
                  onChange={(e) => setFollowUpNote(e.target.value)}
                  placeholder="Parent discussed fee structure, scheduled visit for Saturday..."
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-5 pt-3 border-t">
              <button
                onClick={() => setSelectedForFollowUp(null)}
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
