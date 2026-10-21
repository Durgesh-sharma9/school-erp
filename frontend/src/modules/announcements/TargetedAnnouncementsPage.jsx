import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Megaphone,
  Users,
  UserCheck,
  GraduationCap,
  Layers,
  Send,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  Trash2,
  RefreshCw,
  FileText,
  Smartphone,
  MessageSquare,
  Eye,
  Paperclip,
  ChevronRight,
  Plus,
  X,
  Radio,
  Sparkles,
  Phone,
  ShieldAlert,
  Info
} from 'lucide-react';
import toast from 'react-hot-toast';

const API_BASE = '/api/announcements';

export default function TargetedAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [counts, setCounts] = useState({ all: 0, teachers: 0, classes: 0, students: 0, urgent: 0 });
  const [loading, setLoading] = useState(true);
  const [metadata, setMetadata] = useState({ teachers: [], teacherGroups: [], classes: [], students: [] });

  // Filter state
  const [activeTab, setActiveTab] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State for new Announcement
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    targetType: 'ALL_TEACHERS', // 'ALL_TEACHERS' | 'SELECTIVE_TEACHERS' | 'TEACHER_GROUP' | 'ENTIRE_CLASS' | 'SPECIFIC_STUDENT'
    priority: 'Normal',
    category: 'Academic',
    channels: { inApp: true, sms: false, whatsapp: false, push: true },
    ackRequired: false,
    attachmentUrl: '',
    sender: 'Principal Office',
    // Target specific details
    selectiveTeacherIds: [],
    selectedGroupId: 'grp_science',
    selectedClass: 'X',
    selectedSection: 'A',
    selectedStudentId: ''
  });

  // Fetch Announcements & Targeting Metadata
  const fetchData = async () => {
    try {
      setLoading(true);
      const [annRes, metaRes] = await Promise.all([
        fetch(`${API_BASE}?targetType=${activeTab}&priority=${priorityFilter}&search=${encodeURIComponent(searchQuery)}`),
        fetch(`${API_BASE}/meta`)
      ]);

      const annData = await annRes.json();
      const metaData = await metaRes.json();

      if (annData.success) {
        setAnnouncements(annData.data.announcements || []);
        if (annData.data.counts) setCounts(annData.data.counts);
      }
      if (metaData.success) {
        setMetadata(metaData.data || { teachers: [], teacherGroups: [], classes: [], students: [] });
      }
    } catch (err) {
      console.error('Failed to load announcements:', err);
      toast.error('Failed to load announcements data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, priorityFilter]);

  // Handle Search submit
  const handleSearch = (e) => {
    e.preventDefault();
    fetchData();
  };

  // Toggle selective teacher selection
  const handleToggleTeacher = (tId) => {
    setFormData(prev => {
      const exists = prev.selectiveTeacherIds.includes(tId);
      const updated = exists
        ? prev.selectiveTeacherIds.filter(id => id !== tId)
        : [...prev.selectiveTeacherIds, tId];
      return { ...prev, selectiveTeacherIds: updated };
    });
  };

  // Quick preset template application
  const applyPresetTemplate = (type) => {
    if (type === 'staff_meeting') {
      setFormData(prev => ({
        ...prev,
        title: 'Emergency Academic Faculty Briefing - CBSE Board Guidelines',
        content: 'All faculty members are requested to attend a 20-minute briefing today at 02:45 PM in the Staff Conference Room. Key agenda: Internal assessment upload timeline and revision class rosters.',
        category: 'Staff Notice',
        priority: 'High',
        targetType: 'ALL_TEACHERS'
      }));
    } else if (type === 'remedial_class') {
      setFormData(prev => ({
        ...prev,
        title: 'Important: Extra Remedial Support Classes for Board Preparation',
        content: 'Dear Students, extra remedial sessions for Science and Mathematics will commence from this Saturday from 08:30 AM to 11:30 AM. Attendance is mandatory for all students.',
        category: 'Academic',
        priority: 'Normal',
        targetType: 'ENTIRE_CLASS'
      }));
    } else if (type === 'student_praise') {
      setFormData(prev => ({
        ...prev,
        title: 'Commendation & Official Selection Notice for Inter-School Tournament',
        content: 'Dear Student & Parents, hearty congratulations on your selection to represent the school at the upcoming Inter-School Championship. Please collect your official event kit and consent form from the sports desk.',
        category: 'Academic',
        priority: 'Urgent',
        targetType: 'SPECIFIC_STUDENT'
      }));
    } else if (type === 'dept_review') {
      setFormData(prev => ({
        ...prev,
        title: 'Department Practical Syllabus & Lab Inventory Audit',
        content: 'All members of this department are instructed to finalize their Term 1 practical experiment record books and submit laboratory equipment requisition by 3:00 PM tomorrow.',
        category: 'Staff Notice',
        priority: 'Normal',
        targetType: 'TEACHER_GROUP'
      }));
    }
    toast.success('Quick template loaded!');
  };

  // Submit new Announcement
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Please enter announcement title and content');
      return;
    }

    // Build targetDetails based on targetType
    let targetDetails = {};
    if (formData.targetType === 'ALL_TEACHERS') {
      targetDetails = { allStaff: true };
    } else if (formData.targetType === 'SELECTIVE_TEACHERS') {
      if (formData.selectiveTeacherIds.length === 0) {
        toast.error('Please select at least one teacher');
        return;
      }
      const selectedTeachers = metadata.teachers.filter(t => formData.selectiveTeacherIds.includes(t.id));
      targetDetails = {
        teacherIds: formData.selectiveTeacherIds,
        teachers: selectedTeachers
      };
    } else if (formData.targetType === 'TEACHER_GROUP') {
      const grp = metadata.teacherGroups.find(g => g.id === formData.selectedGroupId);
      targetDetails = {
        groupId: formData.selectedGroupId,
        groupName: grp ? grp.name : 'Faculty Wing'
      };
    } else if (formData.targetType === 'ENTIRE_CLASS') {
      targetDetails = {
        className: formData.selectedClass,
        section: formData.selectedSection,
        studentCount: formData.selectedSection === 'ALL' ? 85 : 42
      };
    } else if (formData.targetType === 'SPECIFIC_STUDENT') {
      const student = metadata.students.find(s => s.id === formData.selectedStudentId);
      if (!student) {
        toast.error('Please select a student');
        return;
      }
      targetDetails = {
        studentId: student.id,
        studentName: student.name,
        admNo: student.admNo,
        rollNo: student.rollNo,
        className: student.className,
        section: student.section,
        parentName: student.fatherName,
        phone: student.phone
      };
    }

    try {
      setSubmitting(true);
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          targetType: formData.targetType,
          targetDetails,
          priority: formData.priority,
          category: formData.category,
          channels: formData.channels,
          ackRequired: formData.ackRequired,
          attachmentUrl: formData.attachmentUrl,
          sender: formData.sender
        })
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Announcement broadcasted successfully!');
        setShowComposeModal(false);
        // Reset form
        setFormData({
          title: '',
          content: '',
          targetType: 'ALL_TEACHERS',
          priority: 'Normal',
          category: 'Academic',
          channels: { inApp: true, sms: false, whatsapp: false, push: true },
          ackRequired: false,
          attachmentUrl: '',
          sender: 'Principal Office',
          selectiveTeacherIds: [],
          selectedGroupId: 'grp_science',
          selectedClass: 'X',
          selectedSection: 'A',
          selectedStudentId: ''
        });
        fetchData();
      } else {
        toast.error(data.message || 'Failed to broadcast announcement');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error broadcasting announcement');
    } finally {
      setSubmitting(false);
    }
  };

  // Resend Announcement
  const handleResend = async (id, title) => {
    try {
      const res = await fetch(`${API_BASE}/${id}/resend`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        toast.success(`Broadcast re-triggered for: "${title.slice(0, 30)}..."`);
        fetchData();
      }
    } catch (err) {
      toast.error('Failed to resend announcement');
    }
  };

  // Delete Announcement
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this broadcast?')) return;
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Announcement deleted');
        fetchData();
      }
    } catch (err) {
      toast.error('Failed to delete announcement');
    }
  };

  // Helper icon by target type
  const getTargetIcon = (type) => {
    switch (type) {
      case 'ALL_TEACHERS':
        return <UserCheck className="w-4 h-4 text-emerald-600" />;
      case 'SELECTIVE_TEACHERS':
        return <Users className="w-4 h-4 text-blue-600" />;
      case 'TEACHER_GROUP':
        return <Layers className="w-4 h-4 text-purple-600" />;
      case 'ENTIRE_CLASS':
        return <GraduationCap className="w-4 h-4 text-indigo-600" />;
      case 'SPECIFIC_STUDENT':
        return <UserCheck className="w-4 h-4 text-amber-600" />;
      default:
        return <Megaphone className="w-4 h-4 text-slate-600" />;
    }
  };

  // Filter students based on selected class in Compose modal
  const filteredStudents = metadata.students.filter(s =>
    (!formData.selectedClass || s.className === formData.selectedClass)
  );

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-7xl mx-auto">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-xs text-slate-500">
        <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Targeted Announcements</span>
        <span>&bull;</span>
        <Megaphone className="w-3.5 h-3.5 text-indigo-500" />
        <span className="text-slate-400">&bull; Communications Hub</span>
      </div>

      {/* Modern Executive Page Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
            <Megaphone className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Targeted Announcements Hub
              </h1>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Broadcast
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Directly communicate with All Teachers, Selective Staff, Faculty Departments, Entire Classes, or Specific Students.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowComposeModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Compose Announcement</span>
        </button>
      </div>

      {/* KPI Stats Cards - 5 Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
        {/* Card 1: Total Sent */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-all hover:shadow-md">
          <div className="bg-blue-50/70 dark:bg-blue-950/40 border-b border-blue-100 dark:border-blue-900/40 py-1.5 px-3.5 flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-900 dark:text-blue-300">Total Sent</span>
            <Megaphone className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="p-3.5">
            <p className="text-2xl font-bold text-slate-900 dark:text-white leading-none">{counts.all}</p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5">Active broadcast logs</p>
          </div>
        </div>

        {/* Card 2: Faculty Notices */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-all hover:shadow-md">
          <div className="bg-indigo-50/70 dark:bg-indigo-950/40 border-b border-indigo-100 dark:border-indigo-900/40 py-1.5 px-3.5 flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-900 dark:text-indigo-300">Faculty Notices</span>
            <Users className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="p-3.5">
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 leading-none">{counts.teachers}</p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5">Teachers & wings</p>
          </div>
        </div>

        {/* Card 3: Class Broadcasts */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-all hover:shadow-md">
          <div className="bg-purple-50/70 dark:bg-purple-950/40 border-b border-purple-100 dark:border-purple-900/40 py-1.5 px-3.5 flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-900 dark:text-purple-300">Class Broadcasts</span>
            <GraduationCap className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="p-3.5">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 leading-none">{counts.classes}</p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5">Grades & sections</p>
          </div>
        </div>

        {/* Card 4: Student Notices */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-all hover:shadow-md">
          <div className="bg-amber-50/70 dark:bg-amber-950/40 border-b border-amber-100 dark:border-amber-900/40 py-1.5 px-3.5 flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-900 dark:text-amber-300">Student Notices</span>
            <UserCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="p-3.5">
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 leading-none">{counts.students}</p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5">Targeted individual</p>
          </div>
        </div>

        {/* Card 5: Urgent Priority */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden col-span-2 md:col-span-1 transition-all hover:shadow-md">
          <div className="bg-rose-50/70 dark:bg-rose-950/40 border-b border-rose-100 dark:border-rose-900/40 py-1.5 px-3.5 flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-900 dark:text-rose-300">Urgent Priority</span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
          </div>
          <div className="p-3.5">
            <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 leading-none">{counts.urgent}</p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5">Immediate action</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar with Lucide Icons */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3 sm:p-4 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-3">
          {/* Target Tabs (Clean SVG Icons instead of raw emojis) */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-xl">
            {[
              { id: 'ALL', label: 'All Targets', icon: Radio },
              { id: 'ALL_TEACHERS', label: 'All Teachers', icon: Users },
              { id: 'SELECTIVE_TEACHERS', label: 'Selective Staff', icon: UserCheck },
              { id: 'TEACHER_GROUP', label: 'Teacher Groups', icon: Layers },
              { id: 'ENTIRE_CLASS', label: 'Entire Class', icon: GraduationCap },
              { id: 'SPECIFIC_STUDENT', label: 'Specific Student', icon: UserCheck }
            ].map(tab => {
              const IconComp = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs border border-slate-200 dark:border-slate-700'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <IconComp className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="flex gap-2 min-w-[260px] sm:min-w-[320px]">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search announcement, student, teacher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/70 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition"
              />
            </div>
            <button
              type="submit"
              className="px-3.5 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-xs transition shrink-0"
            >
              Filter
            </button>
          </form>
        </div>
      </div>

      {/* Announcements Feed List */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-12 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-indigo-500 mb-2" />
            <p className="text-sm">Fetching targeted announcements...</p>
          </div>
        ) : announcements.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center">
            <Megaphone className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300">No Announcements Found</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              No broadcast announcements match the current filter. Click "Compose Announcement" above to send one.
            </p>
          </div>
        ) : (
          announcements.map((ann) => {
            const isUrgent = ann.priority === 'Urgent';
            const isHigh = ann.priority === 'High';
            const borderAccent = isUrgent 
              ? 'border-l-4 border-l-rose-500' 
              : isHigh 
              ? 'border-l-4 border-l-amber-500' 
              : 'border-l-4 border-l-indigo-500';

            return (
              <div
                key={ann.id}
                className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 ${borderAccent} p-4 sm:p-5 shadow-xs hover:shadow-md transition-all group`}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2.5">
                  {/* Header & Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Priority Badge */}
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                        isUrgent
                          ? 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/40'
                          : isHigh
                          ? 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/40'
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800/40'
                      }`}
                    >
                      {isUrgent && <AlertTriangle className="w-3 h-3" />}
                      {ann.priority} Priority
                    </span>

                    {/* Target Audience Pill */}
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {getTargetIcon(ann.targetType)}
                      <span className="font-semibold">{ann.targetSummary}</span>
                    </span>

                    {/* Category Pill */}
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700">
                      {ann.category}
                    </span>

                    {/* Acknowledgment required badge */}
                    {ann.ackRequired && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200">
                        Sign-off Required
                      </span>
                    )}
                  </div>

                  {/* Delivery Date */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {new Date(ann.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} at{' '}
                      {new Date(ann.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {/* Title & Content */}
                <div className="mt-3">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {ann.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1.5 line-clamp-2 leading-relaxed">
                    {ann.content}
                  </p>
                </div>

                {/* Footer: Channels, Stats, and Action Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  {/* Delivery Channels */}
                  <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500">
                    <span className="font-medium text-slate-400">Channels:</span>
                    <div className="flex items-center gap-1.5">
                      {ann.channels?.inApp && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-[10px] font-medium text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900">
                          <Smartphone className="w-3 h-3 text-indigo-500" /> App
                        </span>
                      )}
                      {ann.channels?.sms && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-[10px] font-medium text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900">
                          <MessageSquare className="w-3 h-3 text-blue-500" /> SMS
                        </span>
                      )}
                      {ann.channels?.whatsapp && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-[10px] font-medium text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900">
                          <Phone className="w-3 h-3 text-emerald-500" /> WhatsApp
                        </span>
                      )}
                    </div>

                    <span className="text-slate-300 dark:text-slate-700">|</span>
                    <span className="text-slate-600 dark:text-slate-400 text-xs">
                      Delivered: <strong className="text-emerald-600 dark:text-emerald-400">{ann.stats?.delivered || 0}/{ann.stats?.targeted || 0}</strong>
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <button
                      onClick={() => {
                        setSelectedAnnouncement(ann);
                        setShowDetailModal(true);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Details</span>
                    </button>

                    <button
                      onClick={() => handleResend(ann.id, ann.title)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition"
                      title="Resend to audience"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Resend</span>
                    </button>

                    <button
                      onClick={() => handleDelete(ann.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                      title="Delete announcement"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ========================================================================= */}
      {/* COMPOSE ANNOUNCEMENT MODAL (Mounted to document.body via Portal) */}
      {/* ========================================================================= */}
      {showComposeModal && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md overflow-hidden animate-in fade-in duration-150">
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">
            {/* ENTERPRISE MODAL HEADER */}
            <div className="px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200/60 dark:border-indigo-800/60 shadow-2xs">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">Compose Targeted Announcement</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Send precision circulars & alerts to teachers, departments, classes, or students</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowComposeModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* SCROLLABLE FORM BODY */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden min-h-0">
              <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-5">
                {/* STEP 1: TARGET AUDIENCE PICKER */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Step 1: Choose Target Audience Type
                    </label>
                    <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                      5 Targeting Modes Available
                    </span>
                  </div>

                  {/* 5-Card Grid for Audience Modes */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                    {/* Mode 1: All Teachers */}
                    <div
                      onClick={() => setFormData(prev => ({ ...prev, targetType: 'ALL_TEACHERS' }))}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                        formData.targetType === 'ALL_TEACHERS'
                          ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/60 ring-2 ring-indigo-500/20 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                          <UserCheck className="w-3.5 h-3.5" />
                        </div>
                        {formData.targetType === 'ALL_TEACHERS' && (
                          <span className="w-2 h-2 rounded-full bg-indigo-600" />
                        )}
                      </div>
                      <div className="mt-2">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-white leading-tight">All Teachers</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Whole faculty</p>
                      </div>
                    </div>

                    {/* Mode 2: Selective Teachers */}
                    <div
                      onClick={() => setFormData(prev => ({ ...prev, targetType: 'SELECTIVE_TEACHERS' }))}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                        formData.targetType === 'SELECTIVE_TEACHERS'
                          ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/60 ring-2 ring-indigo-500/20 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                          <Users className="w-3.5 h-3.5" />
                        </div>
                        {formData.targetType === 'SELECTIVE_TEACHERS' && (
                          <span className="w-2 h-2 rounded-full bg-indigo-600" />
                        )}
                      </div>
                      <div className="mt-2">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-white leading-tight">Selective Staff</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Pick teachers</p>
                      </div>
                    </div>

                    {/* Mode 3: Teacher Groups */}
                    <div
                      onClick={() => setFormData(prev => ({ ...prev, targetType: 'TEACHER_GROUP' }))}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                        formData.targetType === 'TEACHER_GROUP'
                          ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/60 ring-2 ring-indigo-500/20 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
                          <Layers className="w-3.5 h-3.5" />
                        </div>
                        {formData.targetType === 'TEACHER_GROUP' && (
                          <span className="w-2 h-2 rounded-full bg-indigo-600" />
                        )}
                      </div>
                      <div className="mt-2">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-white leading-tight">Faculty Group</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Dept / Wing</p>
                      </div>
                    </div>

                    {/* Mode 4: Entire Class */}
                    <div
                      onClick={() => setFormData(prev => ({ ...prev, targetType: 'ENTIRE_CLASS' }))}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                        formData.targetType === 'ENTIRE_CLASS'
                          ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/60 ring-2 ring-indigo-500/20 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
                          <GraduationCap className="w-3.5 h-3.5" />
                        </div>
                        {formData.targetType === 'ENTIRE_CLASS' && (
                          <span className="w-2 h-2 rounded-full bg-indigo-600" />
                        )}
                      </div>
                      <div className="mt-2">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-white leading-tight">Entire Class</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Grade & Sec</p>
                      </div>
                    </div>

                    {/* Mode 5: Specific Student */}
                    <div
                      onClick={() => setFormData(prev => ({ ...prev, targetType: 'SPECIFIC_STUDENT' }))}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between col-span-2 sm:col-span-1 ${
                        formData.targetType === 'SPECIFIC_STUDENT'
                          ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/60 ring-2 ring-indigo-500/20 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
                          <UserCheck className="w-3.5 h-3.5" />
                        </div>
                        {formData.targetType === 'SPECIFIC_STUDENT' && (
                          <span className="w-2 h-2 rounded-full bg-indigo-600" />
                        )}
                      </div>
                      <div className="mt-2">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-white leading-tight">Single Student</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Roll / Adm No</p>
                      </div>
                    </div>
                  </div>

                  {/* DYNAMIC RECIPIENT PICKERS ACCORDING TO TARGET TYPE */}
                  <div className="bg-slate-50 dark:bg-slate-800/70 p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-700/70">
                    {/* If SELECTIVE_TEACHERS */}
                    {formData.targetType === 'SELECTIVE_TEACHERS' && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Select Teachers ({formData.selectiveTeacherIds.length} Selected):
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setFormData(p => ({ ...p, selectiveTeacherIds: metadata.teachers.map(t => t.id) }))}
                              className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                            >
                              Select All
                            </button>
                            <span className="text-slate-300 dark:text-slate-600">|</span>
                            <button
                              type="button"
                              onClick={() => setFormData(p => ({ ...p, selectiveTeacherIds: [] }))}
                              className="text-[11px] font-medium text-slate-500 hover:underline"
                            >
                              Clear
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                          {metadata.teachers.map((teacher) => {
                            const isSelected = formData.selectiveTeacherIds.includes(teacher.id);
                            return (
                              <div
                                key={teacher.id}
                                onClick={() => handleToggleTeacher(teacher.id)}
                                className={`p-2 rounded-lg border text-xs cursor-pointer flex items-center justify-between transition ${
                                  isSelected
                                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-900 dark:text-indigo-200 font-medium'
                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                                }`}
                              >
                                <div>
                                  <p className="font-semibold">{teacher.name}</p>
                                  <p className="text-[10px] text-slate-400">{teacher.subject}</p>
                                </div>
                                {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* If TEACHER_GROUP */}
                    {formData.targetType === 'TEACHER_GROUP' && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                          Select Department / Faculty Wing:
                        </label>
                        <select
                          value={formData.selectedGroupId}
                          onChange={(e) => setFormData(p => ({ ...p, selectedGroupId: e.target.value }))}
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        >
                          {metadata.teacherGroups.map(grp => (
                            <option key={grp.id} value={grp.id}>
                              {grp.name} ({grp.memberCount} Members) — {grp.description}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* If ENTIRE_CLASS */}
                    {formData.targetType === 'ENTIRE_CLASS' && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                            Select Class:
                          </label>
                          <select
                            value={formData.selectedClass}
                            onChange={(e) => setFormData(p => ({ ...p, selectedClass: e.target.value }))}
                            className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500"
                          >
                            {metadata.classes.map(c => (
                              <option key={c.name} value={c.name}>Class {c.name}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                            Select Section:
                          </label>
                          <select
                            value={formData.selectedSection}
                            onChange={(e) => setFormData(p => ({ ...p, selectedSection: e.target.value }))}
                            className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="A">Section A</option>
                            <option value="B">Section B</option>
                            <option value="C">Section C</option>
                            <option value="ALL">All Sections (Entire Grade)</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {/* If SPECIFIC_STUDENT */}
                    {formData.targetType === 'SPECIFIC_STUDENT' && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                              Filter Class:
                            </label>
                            <select
                              value={formData.selectedClass}
                              onChange={(e) => setFormData(p => ({ ...p, selectedClass: e.target.value, selectedStudentId: '' }))}
                              className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
                            >
                              <option value="">All Classes</option>
                              {metadata.classes.map(c => (
                                <option key={c.name} value={c.name}>Class {c.name}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                              Choose Specific Student:
                            </label>
                            <select
                              value={formData.selectedStudentId}
                              onChange={(e) => setFormData(p => ({ ...p, selectedStudentId: e.target.value }))}
                              className="w-full text-xs p-2 rounded-lg border border-indigo-400 bg-white dark:bg-slate-900 text-slate-800 dark:text-white font-medium"
                            >
                              <option value="">-- Choose Student --</option>
                              {filteredStudents.map(s => (
                                <option key={s.id} value={s.id}>
                                  {s.name} (Adm: {s.admNo}, Roll: {s.rollNo}, Class {s.className}-{s.section})
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {formData.selectedStudentId && (
                          <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-xs flex items-center justify-between text-emerald-800 dark:text-emerald-300">
                            <div>
                              <strong>Targeted Recipient:</strong>{' '}
                              {metadata.students.find(s => s.id === formData.selectedStudentId)?.name}
                              <span className="text-[11px] block text-emerald-600 dark:text-emerald-400">
                                Father: {metadata.students.find(s => s.id === formData.selectedStudentId)?.fatherName} | Mobile: {metadata.students.find(s => s.id === formData.selectedStudentId)?.phone}
                              </span>
                            </div>
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          </div>
                        )}
                      </div>
                    )}

                    {/* If ALL_TEACHERS */}
                    {formData.targetType === 'ALL_TEACHERS' && (
                      <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
                        <Info className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>
                          This will dispatch to all <strong>{metadata.teachers.length} registered teachers</strong> and coordinators in the school.
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* STEP 2: QUICK TEMPLATE BUTTONS */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Quick Announcement Presets:</span>
                    <span className="text-[10px] text-slate-400">1-click autofill</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => applyPresetTemplate('staff_meeting')}
                      className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/40 hover:bg-indigo-100 transition"
                    >
                      📝 Staff Meeting
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPresetTemplate('dept_review')}
                      className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40 hover:bg-purple-100 transition"
                    >
                      🔬 Dept Lab Review
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPresetTemplate('remedial_class')}
                      className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40 hover:bg-blue-100 transition"
                    >
                      📐 Class Remedial Prep
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPresetTemplate('student_praise')}
                      className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40 hover:bg-amber-100 transition"
                    >
                      🏆 Student Commendation
                    </button>
                  </div>
                </div>

                {/* STEP 3: CONTENT & DETAILS */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Step 2: Announcement Details & Message
                  </label>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Announcement Title / Subject *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Urgent Faculty Briefing regarding Term 1 Assessments"
                        value={formData.title}
                        onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Priority Level
                      </label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData(p => ({ ...p, priority: e.target.value }))}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                      >
                        <option value="Normal">Normal</option>
                        <option value="High">High</option>
                        <option value="Urgent">Urgent (Immediate Alert)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      >
                        <option value="Academic">Academic</option>
                        <option value="Staff Notice">Staff Notice / Faculty Circular</option>
                        <option value="Discipline">Discipline & Conduct</option>
                        <option value="Examination">Examination & Pre-Board</option>
                        <option value="Fee / Accounts">Fee & Accounts Clearance</option>
                        <option value="Sports & Co-curricular">Sports & Co-curricular</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Attachment PDF / Document Name (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Schedule_Notice_Oct2026.pdf"
                        value={formData.attachmentUrl}
                        onChange={(e) => setFormData(p => ({ ...p, attachmentUrl: e.target.value }))}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Announcement Body / Full Message *
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Enter comprehensive instructions, dates, timings, and expectations..."
                      value={formData.content}
                      onChange={(e) => setFormData(p => ({ ...p, content: e.target.value }))}
                      className="w-full text-xs p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <div className="text-right text-[10px] text-slate-400 mt-0.5">
                      {formData.content.length} characters
                    </div>
                  </div>

                  {/* STEP 4: CHANNELS & SETTINGS */}
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
                      Step 3: Delivery Channels & Tracking
                    </span>

                    <div className="flex flex-wrap gap-4 text-xs">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.channels.inApp}
                          disabled
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="font-medium text-slate-700 dark:text-slate-300">Mobile & Web In-App (Active)</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.channels.sms}
                          onChange={(e) => setFormData(p => ({ ...p, channels: { ...p.channels, sms: e.target.checked } }))}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-slate-700 dark:text-slate-300">Dispatch SMS</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.channels.whatsapp}
                          onChange={(e) => setFormData(p => ({ ...p, channels: { ...p.channels, whatsapp: e.target.checked } }))}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-slate-700 dark:text-slate-300">WhatsApp Alert</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.ackRequired}
                          onChange={(e) => setFormData(p => ({ ...p, ackRequired: e.target.checked }))}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-slate-700 dark:text-slate-300 font-medium text-indigo-600 dark:text-indigo-400">
                          Require Read Sign-Off
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* STICKY MODAL FOOTER */}
              <div className="px-5 sm:px-6 py-3.5 bg-slate-50 dark:bg-slate-800/90 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 shadow-inner">
                <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Target: <strong>{formData.targetType.replace('_', ' ')}</strong></span>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => setShowComposeModal(false)}
                    className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md transition disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submitting ? 'Broadcasting...' : 'Send Broadcast Now'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* DETAILS / RECIPIENT INSPECTOR MODAL (Mounted to document.body via Portal) */}
      {/* ========================================================================= */}
      {showDetailModal && selectedAnnouncement && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md overflow-hidden animate-in fade-in duration-150">
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 bg-slate-100 dark:bg-slate-800 flex justify-between items-center border-b border-slate-200 dark:border-slate-700 shrink-0">
              <div className="flex items-center gap-2.5">
                <Megaphone className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Announcement Details & Telemetry</h3>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1 min-h-0">
              <div>
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  {selectedAnnouncement.category} • {selectedAnnouncement.priority} Priority
                </span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  {selectedAnnouncement.title}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Broadcasted by: {selectedAnnouncement.sender} on {new Date(selectedAnnouncement.createdAt).toLocaleString('en-IN')}
                </p>
              </div>

              {/* Target Details Card */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    {getTargetIcon(selectedAnnouncement.targetType)}
                    {selectedAnnouncement.targetSummary}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                    Status: {selectedAnnouncement.status || 'Delivered'}
                  </span>
                </div>

                {/* Extended Details */}
                {selectedAnnouncement.targetType === 'SELECTIVE_TEACHERS' && selectedAnnouncement.targetDetails?.teachers && (
                  <div className="text-xs text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                    <p className="font-semibold text-slate-500 mb-1">Targeted Staff List:</p>
                    <ul className="list-disc list-inside space-y-0.5">
                      {selectedAnnouncement.targetDetails.teachers.map((t, idx) => (
                        <li key={idx}>{t.name} ({t.subject})</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedAnnouncement.targetType === 'SPECIFIC_STUDENT' && (
                  <div className="text-xs text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-700/60 space-y-1">
                    <p><strong>Student Name:</strong> {selectedAnnouncement.targetDetails?.studentName}</p>
                    <p><strong>Admission No:</strong> {selectedAnnouncement.targetDetails?.admNo} | <strong>Roll No:</strong> {selectedAnnouncement.targetDetails?.rollNo}</p>
                    <p><strong>Class:</strong> {selectedAnnouncement.targetDetails?.className} - {selectedAnnouncement.targetDetails?.section}</p>
                    <p><strong>Parent Contact:</strong> {selectedAnnouncement.targetDetails?.parentName} ({selectedAnnouncement.targetDetails?.phone})</p>
                  </div>
                )}
              </div>

              {/* Message Content */}
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Message Content:</label>
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {selectedAnnouncement.content}
                </div>
              </div>

              {/* Attachment */}
              {selectedAnnouncement.attachmentUrl && (
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/40 text-xs text-indigo-700 dark:text-indigo-300">
                  <Paperclip className="w-4 h-4" />
                  <span>Attachment: <strong>{selectedAnnouncement.attachmentUrl}</strong></span>
                </div>
              )}

              {/* Delivery Stats Bar */}
              <div className="grid grid-cols-3 gap-3 text-center pt-2">
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 block">Total Targeted</span>
                  <span className="text-base font-bold text-slate-800 dark:text-white">
                    {selectedAnnouncement.stats?.targeted || 1}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 block">Delivered</span>
                  <span className="text-base font-bold text-emerald-600">
                    {selectedAnnouncement.stats?.delivered || 1}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 block">Read / Ack</span>
                  <span className="text-base font-bold text-indigo-600">
                    {selectedAnnouncement.stats?.read || 0}
                  </span>
                </div>
              </div>
            </div>

            <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-700 flex justify-end shrink-0">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-1.5 text-xs font-medium rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-white transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
