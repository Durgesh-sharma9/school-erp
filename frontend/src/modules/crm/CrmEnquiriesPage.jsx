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
  FileText,
  Eye
} from 'lucide-react';
import toast from 'react-hot-toast';
import { SCHOOL_CLASSES } from '../students/reports/studentReportsData';
import { DEFAULT_ENQUIRIES } from './crmData';
import AdmissionJourneyTimeline from './components/AdmissionJourneyTimeline';
import CRMProfileModal from './components/CRMProfileModal';
import ContactModal from './components/ContactModal';

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
  const [selectedContact, setSelectedContact] = useState(null);

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
      toast.error('Please fill mandatory fields: Student Name and Contact Mobile');
      return;
    }

    const newEnquiry = {
      ...formData,
      id: Date.now(),
      enquiryId: `ENQ-2026-${String(enquiries.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString().split('T')[0],
      academicSession: '2026-2027',
      followUpDate: new Date().toISOString().split('T')[0],
      journey: [
        { stage: 'Form Submitted', status: 'Completed', completedAt: new Date(), notes: 'Form submitted at reception', createdBy: 'System' },
        { stage: 'Call', status: 'Pending', followUpDate: new Date().toISOString().split('T')[0], notes: 'Initial counseling call required' },
        { stage: 'Campus Visit', status: 'Pending', notes: '' },
        { stage: 'Application', status: 'Pending', notes: '' },
        { stage: 'Assessment', status: 'Pending', notes: '' },
        { stage: 'Admission Confirmed', status: 'Pending', notes: '' }
      ]
    };

    setEnquiries(prev => [newEnquiry, ...prev]);
    setShowAddModal(false);
    toast.success(`Enquiry ${newEnquiry.enquiryId} registered successfully!`);
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

  const handleSaveJourney = async (enquiryId, updatedJourney, journeyStatus) => {
    setEnquiries(prev => prev.map(enq => {
      if (enq.id === enquiryId || enq.enquiryId === enquiryId) {
        return {
          ...enq,
          journey: updatedJourney,
          journeyStatus: journeyStatus || enq.journeyStatus,
          status: journeyStatus === 'CLOSED' ? 'Closed' : enq.status
        };
      }
      return enq;
    }));
    toast.success('Admission Journey updated successfully!');
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this enquiry?')) {
      setEnquiries(prev => prev.filter(e => e.id !== id));
      toast.success('Enquiry deleted successfully!');
    }
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
            className="h-9 px-3.5 rounded-full bg-[#5c67f6] hover:bg-indigo-600 text-white flex items-center space-x-1.5 shadow-md hover:shadow-lg transition-transform hover:scale-105 text-xs font-semibold cursor-pointer"
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
                              className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-100 cursor-pointer"
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
                            <button
                              onClick={() => setSelectedProfile(enq)}
                              className="font-bold text-slate-900 hover:text-indigo-600 text-left cursor-pointer"
                            >
                              {enq.studentName}
                            </button>
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
                              {/* Quick Contact Modal Launcher */}
                              <button
                                onClick={() => setSelectedContact(enq)}
                                className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 cursor-pointer"
                                title="Contact (Call / WhatsApp)"
                              >
                                <MessageCircle className="w-4 h-4" />
                              </button>

                              {/* Profile Drawer */}
                              <button
                                onClick={() => setSelectedProfile(enq)}
                                className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 cursor-pointer"
                                title="View Complete CRM Profile"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              {/* Convert to Student Registration */}
                              <button
                                onClick={() => onNavigate && onNavigate('/student-registration')}
                                className="p-1.5 rounded-lg text-purple-600 hover:bg-purple-50 cursor-pointer"
                                title="Convert to Admission Registration"
                              >
                                <GraduationCap className="w-4 h-4" />
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => handleDelete(enq.id)}
                                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer"
                                title="Delete Enquiry"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Authentic Campus CRM Admission Journey Timeline */}
                        {isExpanded && (
                          <tr className="bg-slate-50/80">
                            <td colSpan="10" className="p-4 border-b border-indigo-100">
                              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                                <div className="flex items-center justify-between pb-2 border-b">
                                  <div className="flex items-center space-x-2">
                                    <GitCommit className="w-4 h-4 text-indigo-600" />
                                    <span className="font-bold text-xs text-slate-800">
                                      Admission Journey Pipeline: {enq.studentName} ({enq.enquiryId})
                                    </span>
                                  </div>
                                  <span className="text-[11px] text-slate-400">
                                    Interactive node timeline • Click any node to add stage or complete
                                  </span>
                                </div>

                                {/* Render Campus CRM Horizontal Timeline */}
                                <AdmissionJourneyTimeline
                                  enquiry={enq}
                                  onSaveJourney={(updatedNormalized, journeyStatus) =>
                                    handleSaveJourney(enq.id, updatedNormalized, journeyStatus)
                                  }
                                  counselorName={enq.counselor || 'Admin'}
                                />
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
              className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
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
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#5c67f6] hover:bg-indigo-600 text-white rounded-lg font-semibold shadow-md transition-colors cursor-pointer"
                >
                  Save Enquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FULL CAMPUS CRM PROFILE DRAWER MODAL */}
      <CRMProfileModal
        isOpen={!!selectedProfile}
        onClose={() => setSelectedProfile(null)}
        data={selectedProfile}
        type="school"
        onConvert={() => {
          setSelectedProfile(null);
          onNavigate && onNavigate('/student-registration');
        }}
        onSaveJourney={(updatedJourney, journeyStatus) => {
          if (selectedProfile) {
            handleSaveJourney(selectedProfile.id, updatedJourney, journeyStatus);
          }
        }}
        schoolName="J D International School"
      />

      {/* CAMPUS CRM CONTACT MODAL (WhatsApp +91, Phone, Templates) */}
      <ContactModal
        isOpen={!!selectedContact}
        onClose={() => setSelectedContact(null)}
        data={selectedContact}
        type="school"
      />
    </div>
  );
}
