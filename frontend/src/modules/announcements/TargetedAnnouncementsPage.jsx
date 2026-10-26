import React, { useState, useEffect } from 'react';
import {
  Bell,
  Check,
  BarChart3,
  Vote,
  Clock3,
  Users,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  Search,
  Download,
  FileText,
  MessageSquare,
  Paperclip,
  X,
  Send,
  User,
  GraduationCap,
  Eye,
  CheckCheck,
  ExternalLink,
  Plus,
  RefreshCw,
  Trash2,
  Lock,
  Unlock,
  Radio,
  FileIcon,
  ShieldCheck,
  Calendar,
  AlertCircle,
  MessageCircleMore,
  PieChart as PieChartIcon,
  ArrowRight,
  Inbox,
  File as LucideFile,
  FileSpreadsheet,
  Archive,
  Image as ImageIcon
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer
} from 'recharts';
import { AnnouncementModal } from '../../components/announcements/AnnouncementModal';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#6366f1'];
const buttonGradient = "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-indigo-500/25 text-white";

export default function TargetedAnnouncementsPage({ onNavigate }) {
  // Pill Tab state: 'notifications' | 'feedback' | 'polls'
  const [activeTab, setActiveTab] = useState('notifications');

  // Announcement & Poll Modal state
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [announcementModalTab, setAnnouncementModalTab] = useState('announcement');

  // ==========================================
  // TAB 1: NOTIFICATIONS (Alerts & Notices)
  // ==========================================
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [readNotificationIds, setReadNotificationIds] = useState(new Set());
  const [attachmentDropdownOpen, setAttachmentDropdownOpen] = useState(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/announcements');
      const d = await res.json();
      if (d.success) {
        const items = d.data.announcements || [];
        setNotifications(items);
        setUnreadCount(items.filter(n => !readNotificationIds.has(n.id) && (n.priority === 'High' || n.priority === 'Urgent' || !n.stats?.read)).length);
      }
    } catch (err) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (id) => {
    setReadNotificationIds(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    const allIds = new Set(notifications.map(n => n.id));
    setReadNotificationIds(allIds);
    setUnreadCount(0);
    toast.success('All notifications marked as read');
  };

  const isUnread = (n) => {
    if (readNotificationIds.has(n.id)) return false;
    return n.priority === 'High' || n.priority === 'Urgent';
  };

  const handleNotificationClick = (n) => {
    markAsRead(n.id);
    if (n.category === 'Feedback' || n.id.startsWith('TKT')) {
      setActiveTab('feedback');
    }
  };

  // ==========================================
  // TAB 2: FEEDBACK CENTER (2-Way Complaints)
  // ==========================================
  const [feedback, setFeedback] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackFilter, setFeedbackFilter] = useState('all');

  // Conversation Modal state
  const [conversationOpen, setConversationOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [replyAttachments, setReplyAttachments] = useState([]);
  const [sendingReply, setSendingReply] = useState(false);

  // Create Feedback Form state
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [recipientType, setRecipientType] = useState('parent');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [createTitle, setCreateTitle] = useState('');
  const [createDescription, setCreateDescription] = useState('');
  const [createAttachments, setCreateAttachments] = useState([]);
  const [creating, setCreating] = useState(false);

  const sampleClasses = [
    { id: 'c_1', name: 'Class X - Section A' },
    { id: 'c_2', name: 'Class IX - Section B' },
    { id: 'c_3', name: 'Class VIII - Section A' },
    { id: 'c_4', name: 'Class II - Section A' },
    { id: 'c_5', name: 'Class I - Section A' }
  ];

  const sampleStudents = [
    { id: 's_1', name: 'Aarav Sharma', rollNo: '01', parentName: 'Rajesh Sharma', phone: '7891008092', classId: 'c_5' },
    { id: 's_2', name: 'Ananya Verma', rollNo: '04', parentName: 'Sunita Verma', phone: '7891008092', classId: 'c_4' },
    { id: 's_3', name: 'Rohan Meena', rollNo: '14', parentName: 'Suresh Meena', phone: '7891008092', classId: 'c_1' },
    { id: 's_4', name: 'Kabir Choudhary', rollNo: '18', parentName: 'Pooja Choudhary', phone: '7891008092', classId: 'c_2' }
  ];

  const sampleTeachers = [
    { id: 't_1', name: 'Mr. Rakesh Sharma (Mathematics)' },
    { id: 't_2', name: 'Mrs. Kavita Verma (Science)' },
    { id: 't_3', name: 'Dr. Arun Joshi (Physics)' },
    { id: 't_4', name: 'Ms. Neha Gupta (English)' }
  ];

  const fetchFeedback = async () => {
    try {
      setFeedbackLoading(true);
      const res = await fetch(`/api/announcements/feedback/list?status=${feedbackFilter}`);
      const d = await res.json();
      if (d.success) {
        setFeedback(d.data.tickets || []);
      }
    } catch {
      toast.error('Failed to load feedback');
    } finally {
      setFeedbackLoading(false);
    }
  };

  const getFilteredFeedback = () => {
    if (feedbackFilter === 'all') return feedback;
    if (feedbackFilter === 'parent') return feedback.filter(f => (f.senderRole || f.createdByRole || '').toLowerCase() === 'parent');
    if (feedbackFilter === 'teacher') return feedback.filter(f => (f.senderRole || f.createdByRole || '').toLowerCase() === 'teacher');
    if (feedbackFilter === 'admin') return feedback.filter(f => (f.senderRole || f.createdByRole || '').toLowerCase().includes('admin'));
    if (feedbackFilter === 'open') return feedback.filter(f => f.status === 'Open');
    if (feedbackFilter === 'resolved') return feedback.filter(f => f.status === 'Resolved');
    if (feedbackFilter === 'closed') return feedback.filter(f => f.status === 'Closed' || f.status === 'Resolved');
    return feedback;
  };

  const openConversation = (ticket) => {
    setSelectedFeedback(ticket);
    setConversationOpen(true);
    setReplyContent('');
    setReplyAttachments([]);
  };

  const closeConversation = () => {
    setConversationOpen(false);
    setSelectedFeedback(null);
    setReplyContent('');
    setReplyAttachments([]);
  };

  const handleSendReply = async () => {
    if (!replyContent.trim() && replyAttachments.length === 0) {
      toast.error('Please enter a reply or attach a file');
      return;
    }

    try {
      setSendingReply(true);
      const res = await fetch(`/api/announcements/feedback/${selectedFeedback.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          replyText: replyContent,
          senderName: 'Principal & Administration',
          senderRole: 'School Staff'
        })
      });
      const d = await res.json();
      if (d.success) {
        toast.success('Reply dispatched successfully! 💬');
        setSelectedFeedback(d.data);
        setReplyContent('');
        setReplyAttachments([]);
        fetchFeedback();
      } else {
        toast.error(d.message || 'Failed to send reply');
      }
    } catch {
      toast.error('Network error sending reply');
    } finally {
      setSendingReply(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!selectedFeedback) return;
    try {
      const res = await fetch(`/api/announcements/feedback/${selectedFeedback.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const d = await res.json();
      if (d.success) {
        toast.success(`Ticket status updated to ${newStatus}`);
        setSelectedFeedback(d.data);
        fetchFeedback();
      }
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleCreateFeedback = async (e) => {
    e.preventDefault();
    if (!createTitle.trim() || !createDescription.trim()) {
      toast.error('Title and description are required');
      return;
    }

    try {
      setCreating(true);
      const selectedStudentObj = sampleStudents.find(s => s.id === selectedStudent);
      const res = await fetch('/api/announcements/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: createTitle,
          description: createDescription,
          senderName: selectedStudentObj ? `${selectedStudentObj.parentName} (${selectedStudentObj.name})` : (recipientType === 'teacher' ? 'Faculty Staff' : 'Parent Representative'),
          senderRole: recipientType === 'teacher' ? 'Teacher' : 'Parent',
          senderContact: '7891008092',
          category: 'Academic & Admin',
          priority: 'Medium'
        })
      });
      const d = await res.json();
      if (d.success) {
        toast.success(`Feedback created successfully. Ticket ID: ${d.data.id}`);
        setCreateTitle('');
        setCreateDescription('');
        setCreateAttachments([]);
        setSelectedClass('');
        setSelectedStudent('');
        setSelectedTeacher('');
        setIsCreateFormOpen(false);
        fetchFeedback();
      } else {
        toast.error(d.message || 'Failed to create ticket');
      }
    } catch {
      toast.error('Network error creating feedback');
    } finally {
      setCreating(false);
    }
  };

  // ==========================================
  // TAB 3: POLL ANALYTICS & DIRECTORY
  // ==========================================
  const [polls, setPolls] = useState([]);
  const [pollsLoading, setPollsLoading] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [pollAnalytics, setPollAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [pendingResponsesOpen, setPendingResponsesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [votingState, setVotingState] = useState({});

  const fetchPolls = async () => {
    try {
      setPollsLoading(true);
      const res = await fetch('/api/announcements/polls/list');
      const d = await res.json();
      if (d.success) {
        setPolls(d.data.polls || []);
      }
    } catch {
      toast.error('Failed to load polls');
    } finally {
      setPollsLoading(false);
    }
  };

  const openPollAnalytics = async (pollId) => {
    try {
      setAnalyticsLoading(true);
      setSelectedPoll(pollId);
      const res = await fetch(`/api/announcements/polls/${pollId}/analytics`);
      const d = await res.json();
      if (d.success) {
        setPollAnalytics(d.data.analytics);
      } else {
        toast.error('Failed to load poll analytics');
      }
    } catch {
      toast.error('Error fetching analytics');
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const closePollAnalytics = () => {
    setSelectedPoll(null);
    setPollAnalytics(null);
    setPendingResponsesOpen(false);
    setCurrentPage(1);
    setSearchQuery('');
  };

  const handleInlineVote = async (pollId, optionId) => {
    try {
      const res = await fetch(`/api/announcements/polls/${pollId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optionIds: [optionId], userId: 'current_admin_user' })
      });
      const d = await res.json();
      if (d.success) {
        toast.success('Vote recorded successfully! 🗳️');
        setVotingState(prev => ({ ...prev, [pollId]: optionId }));
        fetchPolls();
      }
    } catch {
      toast.error('Failed to record vote');
    }
  };

  const exportResponseHistory = () => {
    if (!pollAnalytics?.responses) return;
    const audience = pollAnalytics.poll.audience;
    let headers = audience === 'teachers'
      ? ['Teacher Name', 'Vote Choice', 'Submitted Date', 'Submitted Time']
      : ['Parent Name', 'Student Name', 'Class', 'Selected Option', 'Submitted Date', 'Submitted Time'];

    const csvContent = [
      headers.join(','),
      ...pollAnalytics.responses.map(r => {
        if (audience === 'teachers') {
          return [`"${r.name}"`, `"${r.selectedOption}"`, formatDate(r.submittedAt), new Date(r.submittedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })].join(',');
        } else {
          return [`"${r.name}"`, `"${r.studentName || 'N/A'}"`, `"${r.className || 'N/A'}"`, `"${r.selectedOption}"`, formatDate(r.submittedAt), new Date(r.submittedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })].join(',');
        }
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `poll_responses_${pollAnalytics.poll.title.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Response history exported successfully');
  };

  // Lifecycle
  useEffect(() => {
    if (activeTab === 'notifications') {
      fetchNotifications();
    } else if (activeTab === 'feedback') {
      fetchFeedback();
    } else if (activeTab === 'polls') {
      fetchPolls();
    }
  }, [activeTab]);

  // Format Helpers
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  const getPriorityBadge = (priority = 'INFO') => {
    const p = String(priority).toUpperCase();
    if (p === 'URGENT') return 'bg-gradient-to-r from-rose-50 to-red-100 text-rose-700 border-rose-200';
    if (p === 'HIGH' || p === 'IMPORTANT') return 'bg-gradient-to-r from-orange-50 to-amber-100 text-orange-700 border-orange-200';
    return 'bg-gradient-to-r from-blue-50 to-indigo-100 text-blue-700 border-blue-200';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
      case 'Open':
        return 'bg-gradient-to-r from-emerald-50 to-teal-100 text-emerald-700 border-emerald-200';
      case 'Closed':
      case 'Resolved':
        return 'bg-gradient-to-r from-slate-50 to-slate-100 text-slate-600 border-slate-200';
      case 'In Progress':
        return 'bg-gradient-to-r from-amber-50 to-orange-100 text-amber-700 border-amber-200';
      default:
        return 'bg-gradient-to-r from-slate-50 to-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getAudienceLabel = (audience, scope) => {
    if (audience === 'teachers') return 'All Teachers';
    if (audience === 'parents') return scope === 'all' ? 'All Parents' : 'Selected Classes';
    return 'All Faculty & Parents';
  };

  // Filtered poll responses
  const filteredResponses = pollAnalytics?.responses?.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.studentName && r.studentName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (r.className && r.className.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (r.selectedOption && r.selectedOption.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];

  const totalPages = Math.ceil(filteredResponses.length / itemsPerPage);
  const paginatedResponses = filteredResponses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Header matching Test Master Pro */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">School Communications</h1>
          <p className="text-xs font-medium text-slate-500 mt-0.5">
            Manage notifications, feedback, and interactive polls comprehensively.
          </p>
        </div>
      </div>

      {/* Classy Pill Tabs matching Test Master Pro */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 p-1.5 bg-slate-100/80 backdrop-blur-md border border-slate-200/60 rounded-full shadow-inner overflow-x-auto max-w-full custom-scrollbar">
          {[
            { id: 'notifications', label: 'Alerts & Notices', icon: Bell },
            { id: 'feedback', label: 'Feedback Center', icon: MessageSquare },
            { id: 'polls', label: 'Poll Analytics', icon: BarChart3 }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-[13px] font-bold rounded-full transition-all duration-300 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm border-0'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 border border-transparent'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================== */}
      {/* TAB 1: NOTIFICATIONS (ALERTS & NOTICES)    */}
      {/* ========================================== */}
      {activeTab === 'notifications' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 rounded-2xl border border-slate-200/80 shadow-md bg-white overflow-hidden">
          {/* Header Bar matching image */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50/30 p-4 border-b border-emerald-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-emerald-800">
              <Bell className="h-5 w-5" />
              <h3 className="font-bold text-[15px]">Received Notifications</h3>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => {
                  setAnnouncementModalTab('announcement');
                  setIsAnnouncementModalOpen(true);
                }}
                className={`h-8 text-[11px] font-bold rounded-lg px-4 flex items-center cursor-pointer transition-all ${buttonGradient}`}
              >
                <Bell className="mr-1.5 h-3.5 w-3.5" /> Create Announcement
              </button>
              <button
                onClick={() => {
                  setAnnouncementModalTab('poll');
                  setIsAnnouncementModalOpen(true);
                }}
                className="h-8 text-[11px] font-bold rounded-lg px-4 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center cursor-pointer shadow-sm"
              >
                <BarChart3 className="mr-1.5 h-3.5 w-3.5 text-indigo-600" /> Create Poll
              </button>
              <button
                onClick={() => {
                  setActiveTab('feedback');
                  setIsCreateFormOpen(true);
                }}
                className="h-8 text-[11px] font-bold rounded-lg px-4 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center cursor-pointer shadow-sm"
              >
                <MessageSquare className="mr-1.5 h-3.5 w-3.5 text-indigo-600" /> Create Feedback
              </button>
            </div>
          </div>

          {/* Subheader with Total / Unread stats & Mark all read */}
          <div className="p-4 bg-white flex items-center justify-between text-[12px] font-bold text-slate-600 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <span>Total: <span className="text-slate-900">{notifications.length}</span></span>
              <span>Unread: <span className="text-rose-600">{unreadCount}</span></span>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="h-7 text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck className="mr-1 h-3.5 w-3.5" /> Mark all read
              </button>
            )}
          </div>

          {loading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-12 animate-pulse bg-slate-100 rounded-lg" />)}
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-16 bg-gradient-to-b from-slate-50/50 to-white">
              <Bell className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <p className="text-[14px] font-bold text-slate-500">No active notifications</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto p-4">
                <table className="w-full text-left text-[12px] table-fixed border-separate border-spacing-y-3">
                  <colgroup>
                    <col style={{ width: '12%' }} />
                    <col style={{ width: '22%' }} />
                    <col style={{ width: '32%' }} />
                    <col style={{ width: '14%' }} />
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '10%' }} />
                  </colgroup>
                  <thead className="bg-transparent">
                    <tr className="text-rose-900/80 font-black tracking-wider text-[10px] uppercase">
                      <th className="px-4 py-3.5">Priority</th>
                      <th className="px-4 py-3.5">Title</th>
                      <th className="px-4 py-3.5">Message</th>
                      <th className="px-4 py-3.5">From</th>
                      <th className="px-4 py-3.5">Date</th>
                      <th className="px-4 py-3.5 text-center">Files</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-0">
                    {notifications.map((n) => {
                      const unread = isUnread(n);
                      const isFeedback = n.category === 'Feedback' || n.id.startsWith('TKT');

                      return (
                        <tr
                          key={n.id}
                          onClick={() => handleNotificationClick(n)}
                          className={`transition-all duration-200 group relative ${
                            unread
                              ? 'bg-gradient-to-r from-blue-50 via-white to-purple-50'
                              : 'bg-gradient-to-r from-gray-50 via-white to-gray-50'
                          } hover:shadow-lg hover:-translate-y-0.5 hover:bg-gradient-to-r hover:from-blue-100/50 hover:via-white hover:to-purple-100/50 cursor-pointer`}
                        >
                          <td className={`px-4 py-3 rounded-l-xl border border-slate-200/60 ${unread ? 'border-l-4 border-l-blue-500' : ''}`}>
                            <span className={`border px-2.5 py-1 text-[9px] font-black uppercase rounded-full tracking-wider inline-block ${getPriorityBadge(n.priority)}`}>
                              {n.priority || 'INFO'}
                            </span>
                          </td>
                          <td className="px-4 py-3 border-t border-b border-slate-200/60">
                            <div className="flex items-start gap-2 min-w-0">
                              {unread && <span className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 shrink-0" aria-hidden />}
                              <div className="min-w-0 flex-1">
                                <div className={`line-clamp-2 break-words leading-snug ${unread ? 'font-bold text-slate-900' : 'font-medium text-slate-900'}`} title={n.title}>
                                  {n.title}
                                </div>
                              </div>
                              {isFeedback && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleNotificationClick(n);
                                  }}
                                  className="h-7 px-3 text-xs font-medium rounded-full border border-indigo-200 text-indigo-700 hover:bg-indigo-50 flex items-center gap-1.5 shrink-0 cursor-pointer"
                                >
                                  <Eye className="h-3 w-3" /> View
                                </button>
                              )}
                            </div>
                          </td>
                          <td className={`px-4 py-3 border-t border-b border-slate-200/60 ${unread ? 'font-semibold text-slate-800' : 'font-medium text-slate-600'}`}>
                            <div className="line-clamp-2" title={n.content}>{n.content}</div>
                          </td>
                          <td className="px-4 py-3 border-t border-b border-slate-200/60 font-semibold text-slate-700 capitalize whitespace-nowrap">
                            {n.sender || 'System Admin'}
                          </td>
                          <td className="px-4 py-3 border-t border-b border-slate-200/60 font-medium text-slate-500 whitespace-nowrap">
                            {formatDate(n.createdAt)}
                          </td>
                          <td className="px-4 py-3 rounded-r-xl border border-slate-200/60 text-center">
                            {n.attachmentUrl ? (
                              <div className="relative inline-flex items-center justify-center gap-1.5">
                                <Paperclip className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                                <span className="text-[11px] font-bold text-indigo-700 whitespace-nowrap">Attachment</span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toast.success(`Opening file: ${n.attachmentUrl}`);
                                  }}
                                  className="h-6 text-xs font-medium text-indigo-600 hover:text-indigo-700 px-1 cursor-pointer"
                                  title="View Attachment"
                                >
                                  <Eye className="h-3 w-3 inline" />
                                </button>
                              </div>
                            ) : (
                              <span className="text-slate-400 text-xs">No Attachment</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile / Tablet Card View */}
              <div className="lg:hidden p-4 space-y-3">
                {notifications.map((n) => {
                  const unread = isUnread(n);
                  return (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className={`border border-slate-200 rounded-xl p-4 transition-colors cursor-pointer ${
                        unread ? 'bg-[#F8FBFF] border-l-4 border-l-blue-500' : 'bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <span className={`border px-2.5 py-1 text-[9px] font-black uppercase rounded-full tracking-wider ${getPriorityBadge(n.priority)}`}>
                          {n.priority || 'INFO'}
                        </span>
                        <span className="text-[11px] font-medium text-slate-500">{formatDate(n.createdAt)}</span>
                      </div>
                      <h4 className="font-bold text-[13px] text-slate-900 mb-1">{n.title}</h4>
                      <p className="text-[12px] text-slate-600 line-clamp-2 mb-2">{n.content}</p>
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 pt-2 border-t border-slate-100">
                        <span>From: {n.sender}</span>
                        {n.attachmentUrl && (
                          <span className="text-indigo-600 flex items-center gap-1 font-bold">
                            <Paperclip className="h-3 w-3" /> Attachment
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 2: FEEDBACK CENTER (COMPLAINTS)        */}
      {/* ========================================== */}
      {activeTab === 'feedback' && (
        <div className="rounded-2xl border border-slate-200/80 shadow-md bg-gradient-to-b from-[#f9fbff] to-[#f5f9ff] p-5">
          {/* Header Bar */}
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-indigo-100">
            <MessageSquare className="h-5 w-5 text-indigo-600" />
            <h3 className="font-bold text-[15px] text-slate-900">Feedback Center</h3>
          </div>

          {/* Filter Bar & Action Buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <select
                value={feedbackFilter}
                onChange={(e) => setFeedbackFilter(e.target.value)}
                className="h-8 w-[150px] text-[11px] font-bold border border-slate-200 rounded-lg px-2 bg-white shadow-sm outline-none"
              >
                <option value="all">All Tickets</option>
                <option value="parent">Parent Tickets</option>
                <option value="teacher">Teacher Tickets</option>
                <option value="admin">Admin Tickets</option>
                <option value="open">Open</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
              <span className="text-[11px] font-bold text-slate-500">{getFilteredFeedback().length} tickets</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCreateFormOpen(true)}
                className={`h-8 text-[11px] font-bold rounded-lg px-4 flex items-center cursor-pointer transition-all ${buttonGradient}`}
              >
                <Plus className="mr-1 h-3.5 w-3.5" /> Create Feedback
              </button>
              <button
                onClick={() => {
                  setAnnouncementModalTab('poll');
                  setIsAnnouncementModalOpen(true);
                }}
                className="h-8 text-[11px] font-bold rounded-lg px-4 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center cursor-pointer shadow-sm"
              >
                <BarChart3 className="mr-1 h-3.5 w-3.5 text-indigo-600" /> Create Poll
              </button>
            </div>
          </div>

          {/* Create Feedback Form (Collapsible) */}
          {isCreateFormOpen && (
            <form onSubmit={handleCreateFeedback} className="mb-4 rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50/50 to-white p-4 shadow-md animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-[13px] font-bold text-indigo-900">Create New Feedback Ticket</h4>
                <button
                  type="button"
                  onClick={() => setIsCreateFormOpen(false)}
                  className="p-1 text-slate-400 hover:text-rose-500 rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Recipient</label>
                  <select
                    value={recipientType}
                    onChange={(e) => {
                      setRecipientType(e.target.value);
                      setSelectedClass('');
                      setSelectedStudent('');
                      setSelectedTeacher('');
                    }}
                    className="w-full h-8 text-[11px] font-bold border border-slate-200 rounded-lg px-2 bg-white"
                  >
                    <option value="parent">Parent</option>
                    <option value="teacher">Teacher</option>
                    <option value="both">Parent + Teacher</option>
                  </select>
                </div>

                {recipientType === 'teacher' && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Teacher *</label>
                    <select
                      value={selectedTeacher}
                      onChange={(e) => setSelectedTeacher(e.target.value)}
                      className="w-full h-8 text-[11px] font-bold border border-slate-200 rounded-lg px-2 bg-white"
                    >
                      <option value="">Select teacher</option>
                      {sampleTeachers.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {(recipientType === 'parent' || recipientType === 'both') && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Class *</label>
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="w-full h-8 text-[11px] font-bold border border-slate-200 rounded-lg px-2 bg-white"
                    >
                      <option value="">Select class</option>
                      {sampleClasses.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {(recipientType === 'parent' || recipientType === 'both') && selectedClass && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Student *</label>
                    <select
                      value={selectedStudent}
                      onChange={(e) => setSelectedStudent(e.target.value)}
                      className="w-full h-8 text-[11px] font-bold border border-slate-200 rounded-lg px-2 bg-white"
                    >
                      <option value="">Select student</option>
                      {sampleStudents.map(s => (
                        <option key={s.id} value={s.id}>{s.name} (Roll: {s.rollNo})</option>
                      ))}
                    </select>
                  </div>
                )}

                {(recipientType === 'parent' || recipientType === 'both') && selectedStudent && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Parent</label>
                    <div className="h-8 rounded-lg border border-slate-200 bg-slate-50 flex items-center px-3 text-[11px] font-bold text-slate-700">
                      {sampleStudents.find(s => s.id === selectedStudent)?.parentName || 'Parent'}
                      <span className="ml-2 text-slate-500 font-normal">(7891008092)</span>
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Title / Subject *</label>
                  <input
                    type="text"
                    required
                    value={createTitle}
                    onChange={(e) => setCreateTitle(e.target.value)}
                    placeholder="Enter feedback subject"
                    className="w-full h-8 text-[11px] font-bold border border-slate-200 rounded-lg px-2.5 bg-white outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Description *</label>
                  <textarea
                    required
                    rows={3}
                    value={createDescription}
                    onChange={(e) => setCreateDescription(e.target.value)}
                    placeholder="Enter detailed feedback or query"
                    className="w-full min-h-[60px] text-[11px] font-medium border border-slate-200 rounded-lg p-2.5 bg-white outline-none focus:border-indigo-500 resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Attachments</label>
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                      <Paperclip className="h-3.5 w-3.5" />
                      <span>Attach Files</span>
                      <input
                        type="file"
                        className="hidden"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          setCreateAttachments(prev => [...prev, ...files]);
                        }}
                      />
                    </label>
                    {createAttachments.length > 0 && (
                      <span className="text-[10px] font-bold text-indigo-600">{createAttachments.length} file(s) attached</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateFormOpen(false)}
                    className="h-8 text-[11px] font-bold rounded-lg px-4 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className={`h-8 text-[11px] font-bold rounded-lg px-4 cursor-pointer disabled:opacity-50 ${buttonGradient}`}
                  >
                    {creating ? 'Creating...' : 'Create Feedback'}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Ticket Cards List */}
          {feedbackLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-24 animate-pulse bg-slate-100 rounded-xl" />)}
            </div>
          ) : getFilteredFeedback().length === 0 ? (
            <div className="text-center py-10 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
              <Inbox className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-500">No feedback tickets found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {getFilteredFeedback().map((ticket) => {
                const replyCount = ticket.conversation?.length > 1 ? ticket.conversation.length - 1 : 0;
                return (
                  <div
                    key={ticket.id}
                    className={`border border-blue-100 p-4 rounded-2xl bg-gradient-to-br from-white via-[#f8fbff] to-[#f5f8ff] shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 relative ${
                      ticket.status === 'Open'
                        ? 'border-l-4 border-l-emerald-500'
                        : ticket.status === 'Resolved'
                        ? 'border-l-4 border-l-blue-500'
                        : 'border-l-4 border-l-gray-400'
                    }`}
                  >
                    {/* Top Row: Ticket ID | Status | Category | Date | Reply Badge */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3 bg-blue-50/60 rounded-lg p-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 tracking-wider">
                          ID: {ticket.id}
                        </span>
                        <span className={`border px-2 py-0.5 text-[10px] font-bold uppercase rounded tracking-wider ${getStatusBadge(ticket.status)}`}>
                          {ticket.status}
                        </span>
                        <span className={`border px-2 py-0.5 text-[10px] font-bold uppercase rounded tracking-wider ${
                          (ticket.senderRole || '').toLowerCase() === 'parent'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-violet-50 text-violet-700 border-violet-200'
                        }`}>
                          {ticket.senderRole || 'Parent'}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                          <Clock3 className="h-3 w-3" /> {formatDate(ticket.createdAt)}
                        </span>
                      </div>
                      {replyCount > 0 && (
                        <div className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-50 text-violet-600 border border-violet-100">
                          <MessageCircleMore className="h-3 w-3" />
                          {replyCount} {replyCount === 1 ? 'Reply' : 'Replies'}
                        </div>
                      )}
                    </div>

                    {/* Second Row: Title | Action Buttons */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h4 className="font-bold text-sm text-slate-900 line-clamp-1 flex-1">{ticket.subject}</h4>
                      <button
                        onClick={() => openConversation(ticket)}
                        className="h-8 text-xs font-bold rounded-full px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-sm flex items-center cursor-pointer transition-transform hover:-translate-y-0.5 shrink-0"
                      >
                        View Thread <ArrowRight className="ml-1 h-3 w-3" />
                      </button>
                    </div>

                    {/* Third Row: Message Preview */}
                    <div className="mb-3">
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-white/80 backdrop-blur-sm p-2 rounded-xl border border-slate-100">
                        {ticket.description}
                      </p>
                    </div>

                    {/* Bottom Row: Metadata Chips */}
                    <div className="flex flex-wrap items-center gap-2 text-[10px]">
                      <span className="flex items-center gap-1 text-slate-600 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                        <User className="h-3 w-3 text-gray-400" />
                        {ticket.senderName}
                      </span>
                      <span className="flex items-center gap-1 text-slate-600 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                        <User className="h-3 w-3 text-sky-400" />
                        Contact: 7891008092
                      </span>
                      <span className="flex items-center gap-1 text-slate-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        <GraduationCap className="h-3 w-3 text-purple-400" />
                        Category: {ticket.category || 'General'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Support Thread Modal (Conversation modal) */}
      {conversationOpen && selectedFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="flex flex-col w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/20">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-indigo-100 bg-gradient-to-r from-indigo-50 to-white p-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-indigo-500 to-violet-500 p-2 rounded-lg shadow-sm">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-[15px] font-black text-slate-800">Support Thread</h3>
                  <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-0.5">Ticket: {selectedFeedback.id}</p>
                </div>
              </div>
              <button
                onClick={closeConversation}
                className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors bg-white shadow-sm border border-slate-100 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Context Block */}
            <div className="p-4 bg-white border-b border-slate-100 shadow-sm shrink-0">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <h4 className="font-black text-[15px] text-slate-900">{selectedFeedback.subject}</h4>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px] font-bold text-slate-500">
                    <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 shadow-sm">
                      <User className="h-3 w-3 text-indigo-500" /> {selectedFeedback.senderName}
                    </span>
                    <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 shadow-sm">
                      <GraduationCap className="h-3 w-3 text-indigo-500" /> {selectedFeedback.category}
                    </span>
                  </div>
                </div>
                <div className="w-32 shrink-0">
                  <select
                    value={selectedFeedback.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="w-full h-8 text-[11px] font-bold border border-indigo-200 bg-indigo-50/50 rounded-lg px-2 text-indigo-700 outline-none shadow-sm cursor-pointer"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-50 to-white rounded-lg p-3 text-[12px] font-medium text-slate-700 leading-relaxed border border-slate-200/60 shadow-inner">
                {selectedFeedback.description}
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30 custom-scrollbar">
              {selectedFeedback.conversation?.map((message, index) => {
                const isAdmin = (message.senderRole || '').toLowerCase().includes('staff') || (message.senderRole || '').toLowerCase().includes('admin');
                return (
                  <div key={index} className={`flex w-full ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 shadow-md border ${
                        isAdmin
                          ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-tr-sm border-indigo-700/50'
                          : 'bg-gradient-to-br from-white to-indigo-50/50 text-slate-800 border-indigo-100 rounded-tl-sm'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5 border-b border-black/10 pb-1.5">
                        <span className={`text-[11px] font-black ${isAdmin ? 'text-white' : 'text-slate-800'}`}>
                          {message.sender}
                        </span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ml-auto shadow-sm ${
                          isAdmin ? 'bg-white/20 text-white' : 'bg-white text-indigo-600 border border-indigo-100'
                        }`}>
                          {message.senderRole}
                        </span>
                        <span className={`text-[9px] font-bold ${isAdmin ? 'text-white/70' : 'text-slate-400'}`}>
                          {formatDateTime(message.timestamp)}
                        </span>
                      </div>
                      <p className="text-[12px] leading-relaxed whitespace-pre-wrap font-medium">
                        {message.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reply Input Area */}
            <div className="p-3 bg-gradient-to-b from-white to-slate-50 border-t border-slate-200 shrink-0">
              <div className="flex flex-col gap-2 rounded-xl border border-indigo-100 bg-white p-2 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all shadow-sm">
                <textarea
                  rows={2}
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Draft your reply as Admin..."
                  className="w-full resize-none border-0 bg-transparent p-2 text-[12px] font-medium focus:ring-0 outline-none placeholder:text-slate-400"
                />
                <div className="flex items-center justify-between border-t border-slate-100 pt-2 px-1">
                  <label className="cursor-pointer flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] font-bold text-slate-500 hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
                    <div className="bg-slate-100 p-1 rounded-md shadow-inner"><Paperclip className="h-3 w-3" /></div>
                    <span>Attach File</span>
                    <input type="file" className="hidden" multiple onChange={(e) => setReplyAttachments(Array.from(e.target.files || []))} />
                  </label>
                  <button
                    onClick={handleSendReply}
                    disabled={sendingReply}
                    className={`h-9 px-5 text-[11px] font-bold rounded-xl shadow-md transition-transform hover:-translate-y-0.5 flex items-center cursor-pointer disabled:opacity-50 ${buttonGradient}`}
                  >
                    {sendingReply ? 'Sending...' : <span className="flex items-center"><Send className="h-3.5 w-3.5 mr-1.5" /> Send Reply</span>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 3: POLL ANALYTICS                      */}
      {/* ========================================== */}
      {activeTab === 'polls' && !selectedPoll && (
        <div className="rounded-2xl border border-slate-200/80 shadow-md bg-white p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Vote className="h-5 w-5 text-indigo-600" />
              <h3 className="font-bold text-[15px] text-slate-900">Live & Past Polls</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setAnnouncementModalTab('poll');
                  setIsAnnouncementModalOpen(true);
                }}
                className={`h-8 text-[11px] font-bold rounded-lg px-4 flex items-center cursor-pointer transition-all ${buttonGradient}`}
              >
                <BarChart3 className="mr-1.5 h-3.5 w-3.5" /> Create Poll
              </button>
              <button
                onClick={() => {
                  setActiveTab('feedback');
                  setIsCreateFormOpen(true);
                }}
                className="h-8 text-[11px] font-bold rounded-lg px-4 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center cursor-pointer shadow-sm"
              >
                <MessageSquare className="mr-1.5 h-3.5 w-3.5 text-indigo-600" /> Create Feedback
              </button>
            </div>
          </div>

          {pollsLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map(i => <div key={i} className="h-44 animate-pulse bg-slate-100 rounded-xl" />)}
            </div>
          ) : polls.length === 0 ? (
            <div className="text-center py-10 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
              <BarChart3 className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-500">No polls generated yet</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {polls.map((poll) => {
                const totalTarget = poll.audience === 'teachers' ? 24 : 320;
                const completionRate = totalTarget ? Math.round((poll.totalVotes / totalTarget) * 100) : 0;

                return (
                  <div
                    key={poll.id}
                    className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white to-violet-50/30 p-5 shadow-sm hover:shadow-lg hover:border-violet-300 transition-all flex flex-col h-full"
                  >
                    <div className="flex items-start justify-between mb-3 gap-2">
                      <h3 className="font-bold text-[14px] text-slate-900 line-clamp-2 leading-tight">{poll.title}</h3>
                      <span className={`shrink-0 border rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider shadow-sm ${getStatusBadge(poll.status)}`}>
                        {poll.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-slate-600 bg-white/70 p-2.5 rounded-lg border border-slate-100 mb-4 shadow-sm">
                      <div className="flex items-center gap-1.5"><Users className="h-3 w-3 text-slate-400" />{getAudienceLabel(poll.audience, poll.audienceScope)}</div>
                      <div className="flex items-center gap-1.5"><Clock3 className="h-3 w-3 text-slate-400" />{formatDate(poll.createdAt)}</div>
                      {poll.expiryDate && (
                        <div className="flex items-center gap-1.5 col-span-2 text-amber-600 font-semibold">
                          <Clock3 className="h-3 w-3" />Expires: {formatDate(poll.expiryDate)}
                        </div>
                      )}
                    </div>

                    {/* 3 Metric Summary Boxes */}
                    <div className="grid grid-cols-3 gap-2 text-center mb-4">
                      <div className="bg-gradient-to-b from-emerald-50 to-emerald-100/50 rounded-lg py-2 border border-emerald-100 shadow-sm">
                        <div className="text-[15px] font-black text-emerald-700">{poll.totalVotes || 0}</div>
                        <div className="text-[9px] font-bold text-emerald-600/70 uppercase">Votes</div>
                      </div>
                      <div className="bg-gradient-to-b from-amber-50 to-amber-100/50 rounded-lg py-2 border border-amber-100 shadow-sm">
                        <div className="text-[15px] font-black text-amber-700">{Math.max(0, totalTarget - (poll.totalVotes || 0))}</div>
                        <div className="text-[9px] font-bold text-amber-600/70 uppercase">Pending</div>
                      </div>
                      <div className="bg-gradient-to-b from-indigo-50 to-indigo-100/50 rounded-lg py-2 border border-indigo-100 shadow-sm">
                        <div className="text-[15px] font-black text-indigo-700">{completionRate}%</div>
                        <div className="text-[9px] font-bold text-indigo-600/70 uppercase">Done</div>
                      </div>
                    </div>

                    {/* Interactive Inline Voting Options */}
                    <div className="space-y-2 mb-4 bg-white/60 p-3 rounded-xl border border-slate-100">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Cast Vote:</div>
                      {poll.options?.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => handleInlineVote(poll.id, opt.id)}
                          className={`w-full text-left p-2 rounded-lg border text-xs transition-all flex items-center justify-between cursor-pointer ${
                            votingState[poll.id] === opt.id
                              ? 'border-indigo-500 bg-indigo-50/70 font-bold text-indigo-900'
                              : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <span className="truncate pr-2">{opt.text}</span>
                          <span className="text-[11px] font-black text-indigo-600 shrink-0">{opt.percentage || 0}%</span>
                        </button>
                      ))}
                    </div>

                    {/* Button: View Full Analytics */}
                    <button
                      onClick={() => openPollAnalytics(poll.id)}
                      className={`w-full h-9 text-[12px] font-bold rounded-xl mt-auto flex items-center justify-center cursor-pointer transition-transform hover:-translate-y-0.5 ${buttonGradient}`}
                    >
                      <BarChart3 className="mr-2 h-4 w-4" /> View Full Analytics
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================== */}
      {/* DETAILED POLL ANALYTICS VIEW               */}
      {/* ========================================== */}
      {selectedPoll && pollAnalytics && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-4">
          <div>
            <button
              onClick={closePollAnalytics}
              className="h-8 text-[11px] font-bold rounded-full border border-slate-300 hover:bg-slate-100 shadow-sm px-4 flex items-center text-slate-700 cursor-pointer"
            >
              <ChevronLeft className="mr-1.5 h-4 w-4" /> Back to Directory
            </button>
          </div>

          {/* Section 1 & 2: Overview & Summary Cards */}
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 shadow-md bg-white p-5">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                <FileText className="h-5 w-5 text-indigo-600" />
                <h3 className="font-bold text-[14px] text-slate-900">Poll Overview</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="bg-gradient-to-br from-slate-50 to-white p-2.5 rounded-lg border border-slate-100 shadow-sm">
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Title</div>
                  <div className="text-[11px] font-bold text-slate-900 mt-0.5 truncate">{pollAnalytics.poll.title}</div>
                </div>
                <div className="bg-gradient-to-br from-slate-50 to-white p-2.5 rounded-lg border border-slate-100 shadow-sm col-span-2">
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Description</div>
                  <div className="text-[11px] font-medium text-slate-700 mt-0.5 truncate">{pollAnalytics.poll.description}</div>
                </div>
                <div className="bg-gradient-to-br from-slate-50 to-white p-2.5 rounded-lg border border-slate-100 shadow-sm">
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Audience</div>
                  <div className="text-[11px] font-bold text-indigo-700 mt-0.5">{getAudienceLabel(pollAnalytics.poll.audience, pollAnalytics.poll.audienceScope)}</div>
                </div>
                <div className="bg-gradient-to-br from-slate-50 to-white p-2.5 rounded-lg border border-slate-100 shadow-sm">
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Created By</div>
                  <div className="text-[11px] font-bold text-slate-900 mt-0.5">{pollAnalytics.poll.createdByName || 'Admin Office'}</div>
                </div>
                <div className="bg-gradient-to-br from-slate-50 to-white p-2.5 rounded-lg border border-slate-100 shadow-sm">
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Timeline</div>
                  <div className="text-[11px] font-medium text-slate-700 mt-0.5">
                    {formatDate(pollAnalytics.poll.createdAt)} - {pollAnalytics.poll.expiryDate ? formatDate(pollAnalytics.poll.expiryDate) : 'Ongoing'}
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Summary Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 border border-indigo-200 flex flex-col justify-center shadow-sm">
                <div className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest">Audience Size</div>
                <div className="text-3xl font-black text-indigo-900 mt-1">{pollAnalytics.summary.totalAudience}</div>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 border border-emerald-200 flex flex-col justify-center shadow-sm">
                <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Votes In</div>
                <div className="text-3xl font-black text-emerald-900 mt-1">{pollAnalytics.summary.responsesReceived}</div>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 p-4 border border-amber-200 flex flex-col justify-center shadow-sm">
                <div className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">Pending</div>
                <div className="text-3xl font-black text-amber-900 mt-1">{pollAnalytics.summary.pendingResponses}</div>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-violet-50 to-violet-100 p-4 border border-violet-200 flex flex-col justify-center shadow-sm">
                <div className="text-[10px] font-bold text-violet-700 uppercase tracking-widest">Completion</div>
                <div className="text-3xl font-black text-violet-900 mt-1">{pollAnalytics.summary.completionPercent}%</div>
              </div>
            </div>
          </div>

          {/* Section 3 & 4: Vote Distribution & Quick Insights */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Vote Distribution */}
            <div className="rounded-2xl border border-slate-200/80 shadow-md bg-white p-5">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                <PieChartIcon className="h-5 w-5 text-indigo-600" />
                <h3 className="font-bold text-[14px] text-slate-900">Vote Distribution</h3>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={pollAnalytics.optionSummary}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="option" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={40}>
                      {pollAnalytics.optionSummary.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Insights */}
            <div className="rounded-2xl border border-slate-200/80 shadow-md bg-white p-5">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                <BarChart3 className="h-5 w-5 text-amber-600" />
                <h3 className="font-bold text-[14px] text-slate-900">Quick Insights</h3>
              </div>
              <div className="flex flex-col gap-3 justify-center">
                <div className="rounded-xl bg-gradient-to-r from-indigo-50 to-white border border-indigo-100 p-4 shadow-sm flex items-center gap-4">
                  <div className="bg-indigo-100 p-3 rounded-full shadow-inner"><Vote className="h-5 w-5 text-indigo-600" /></div>
                  <div>
                    <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Winning Option</div>
                    <div className="text-[15px] font-black text-slate-800">
                      {pollAnalytics.optionSummary.sort((a, b) => b.count - a.count)[0]?.option || 'N/A'}
                    </div>
                    <div className="text-[11px] font-medium text-slate-500">
                      Secured {pollAnalytics.optionSummary.sort((a, b) => b.count - a.count)[0]?.count || 0} total votes
                    </div>
                  </div>
                </div>

                {pollAnalytics.parentBreakdown && pollAnalytics.parentBreakdown.length > 0 && (
                  <>
                    <div className="rounded-xl bg-gradient-to-r from-emerald-50 to-white border border-emerald-100 p-4 shadow-sm flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Most Active Class</div>
                        <div className="text-[14px] font-bold text-slate-800">Class {pollAnalytics.parentBreakdown[0].className}</div>
                      </div>
                      <div className="text-xl font-black text-emerald-600">{pollAnalytics.parentBreakdown[0].completion}%</div>
                    </div>

                    <div className="rounded-xl bg-gradient-to-r from-rose-50 to-white border border-rose-100 p-4 shadow-sm flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-bold text-rose-600 uppercase tracking-widest">Needs Follow-up</div>
                        <div className="text-[14px] font-bold text-slate-800">Class {pollAnalytics.parentBreakdown[pollAnalytics.parentBreakdown.length - 1].className}</div>
                      </div>
                      <div className="text-xl font-black text-rose-600">{pollAnalytics.parentBreakdown[pollAnalytics.parentBreakdown.length - 1].completion}%</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Section 5: Engagement by Class */}
          {pollAnalytics.parentBreakdown && pollAnalytics.parentBreakdown.length > 0 && (
            <div className="rounded-2xl border border-slate-200/80 shadow-md bg-white p-5">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                <Users className="h-5 w-5 text-emerald-600" />
                <h3 className="font-bold text-[14px] text-slate-900">Engagement by Class</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {pollAnalytics.parentBreakdown.map((classData, index) => (
                  <div key={index} className="rounded-xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/30 p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-bold text-[13px] text-slate-800">Class {classData.className}</div>
                      <div className="text-[11px] font-black bg-white text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-md shadow-sm">
                        {classData.completion}% Done
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden border border-slate-200/50 shadow-inner">
                      <div
                        className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${classData.completion}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-500">
                      <span className="text-emerald-600">{classData.responded} In</span>
                      <span className="text-amber-500">{classData.pending} Pending</span>
                      <span>{classData.totalParents} Total</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 6: Complete Response History / Live Ledger */}
          <div className="rounded-2xl border border-slate-200/80 shadow-md bg-white p-5">
            <div className="flex flex-col sm:flex-row gap-3 mb-4 justify-between items-start sm:items-center">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search voter, student, or option..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 w-full text-[12px] bg-white border border-slate-200 shadow-sm rounded-lg outline-none focus:border-indigo-500"
                />
              </div>
              <button
                onClick={exportResponseHistory}
                className="h-9 text-[11px] font-bold rounded-lg border border-indigo-200 text-indigo-700 hover:bg-indigo-50 px-4 flex items-center cursor-pointer shadow-sm"
              >
                <Download className="mr-1.5 h-3.5 w-3.5" /> Export to CSV
              </button>
            </div>

            <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      {pollAnalytics.poll.audience === 'teachers' ? (
                        <>
                          <th className="px-4 py-3">Teacher Name</th>
                          <th className="px-4 py-3">Vote Choice</th>
                          <th className="px-4 py-3">Timestamp</th>
                        </>
                      ) : (
                        <>
                          <th className="px-4 py-3">Parent Name</th>
                          <th className="px-4 py-3">Student Name</th>
                          <th className="px-4 py-3">Class</th>
                          <th className="px-4 py-3">Vote Choice</th>
                          <th className="px-4 py-3">Timestamp</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredResponses.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center bg-slate-50/50">
                          <p className="text-[12px] font-medium text-slate-500">No records found matching criteria.</p>
                        </td>
                      </tr>
                    ) : (
                      paginatedResponses.map((r, idx) => (
                        <tr key={idx} className="hover:bg-indigo-50/30 transition-colors">
                          <td className="px-4 py-2.5 text-[12px] font-bold text-slate-800">{r.name}</td>
                          {pollAnalytics.poll.audience !== 'teachers' && (
                            <>
                              <td className="px-4 py-2.5 text-[12px] font-semibold text-slate-700">{r.studentName}</td>
                              <td className="px-4 py-2.5 text-[12px] font-semibold text-slate-700">{r.className}</td>
                            </>
                          )}
                          <td className="px-4 py-2.5">
                            <span className="bg-white text-indigo-700 px-2 py-0.5 rounded-md text-[11px] font-bold border border-indigo-200 shadow-sm">
                              {r.selectedOption}
                            </span>
                          </td>
                          <td className="px-4 py-2.5">
                            <div className="text-[11px] font-semibold text-slate-600">{formatDate(r.submittedAt)}</div>
                            <div className="text-[9px] font-medium text-slate-400">{new Date(r.submittedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-3 bg-gradient-to-r from-slate-50 to-white p-2 rounded-lg border border-slate-100 shadow-sm">
                <div className="text-[11px] font-semibold text-slate-500 ml-2">
                  Showing <span className="text-slate-800">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="text-slate-800">{Math.min(currentPage * itemsPerPage, filteredResponses.length)}</span> of {filteredResponses.length}
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="h-7 px-2.5 text-[10px] font-bold rounded bg-white border border-slate-200 disabled:opacity-50 cursor-pointer"
                  >
                    Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`h-7 w-7 text-[10px] font-bold rounded cursor-pointer ${
                        currentPage === i + 1
                          ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white'
                          : 'bg-white border border-slate-200 text-slate-700'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="h-7 px-2.5 text-[10px] font-bold rounded bg-white border border-slate-200 disabled:opacity-50 cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Section 7: Pending Action Required */}
          {pollAnalytics.summary.pendingResponses > 0 && (
            <div className="rounded-2xl border border-rose-200 bg-white p-5 shadow-sm">
              <button
                onClick={() => setPendingResponsesOpen(!pendingResponsesOpen)}
                className="flex items-center justify-between w-full p-3 rounded-xl bg-gradient-to-r from-rose-50 to-white border border-rose-200 hover:border-rose-300 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 text-[12px] font-bold text-rose-700">
                  <Users className="h-4 w-4" /> {pollAnalytics.summary.pendingResponses} {getAudienceLabel(pollAnalytics.poll.audience, pollAnalytics.poll.audienceScope)} Pending Response
                </div>
                {pendingResponsesOpen ? <ChevronUp className="h-4 w-4 text-rose-500" /> : <ChevronDown className="h-4 w-4 text-rose-500" />}
              </button>

              {pendingResponsesOpen && (
                <div className="mt-3 rounded-xl border border-rose-200 bg-white p-4 shadow-sm animate-in slide-in-from-top-2">
                  <p className="text-[12px] font-medium text-slate-600 mb-3">
                    The following classes still require parent follow-ups:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {pollAnalytics.parentBreakdown?.map(c => (
                      <div key={c.className} className="bg-rose-50/50 border border-rose-100 px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm">
                        <span className="text-[11px] font-bold text-slate-700">Class {c.className}</span>
                        <span className="bg-white text-rose-600 text-[10px] font-black px-1.5 py-0.5 rounded shadow-sm border border-rose-100">{c.pending} Left</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Announcement Modal Popup */}
      <AnnouncementModal
        isOpen={isAnnouncementModalOpen}
        open={isAnnouncementModalOpen}
        onClose={() => setIsAnnouncementModalOpen(false)}
        onOpenChange={setIsAnnouncementModalOpen}
        initialTab={announcementModalTab}
        onSuccess={() => {
          fetchNotifications();
          fetchPolls();
        }}
      />
    </div>
  );
}
