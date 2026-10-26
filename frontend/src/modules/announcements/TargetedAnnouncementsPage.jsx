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
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { AnnouncementModal } from '../../components/announcements/AnnouncementModal';

export default function TargetedAnnouncementsPage({ onNavigate }) {
  // Top Tabs matching Test Master Pro: 'notifications' | 'feedback' | 'polls'
  const [activeTab, setActiveTab] = useState('notifications');

  // Announcement Modal State
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [announcementModalTab, setAnnouncementModalTab] = useState('announcement');

  // ==========================================
  // TAB 1: NOTIFICATIONS & ANNOUNCEMENTS
  // ==========================================
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/announcements?priority=${priorityFilter}&search=${encodeURIComponent(searchQuery)}`);
      const d = await res.json();
      if (d.success) {
        const list = d.data.announcements || [];
        setNotifications(list);
        setUnreadCount(list.filter(n => n.priority === 'High' || n.priority === 'Urgent').length);
      }
    } catch {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async (id) => {
    try {
      const res = await fetch(`/api/announcements/${id}/resend`, { method: 'POST' });
      const d = await res.json();
      if (d.success) {
        toast.success('Broadcast re-sent to all channels! 🚀');
        fetchNotifications();
      }
    } catch {
      toast.error('Failed to resend');
    }
  };

  const handleDeleteNotification = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      const res = await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
      const d = await res.json();
      if (d.success) {
        toast.success('Announcement removed');
        fetchNotifications();
      }
    } catch {
      toast.error('Failed to delete');
    }
  };

  // ==========================================
  // TAB 2: FEEDBACK & COMPLAINTS
  // ==========================================
  const [feedback, setFeedback] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackFilter, setFeedbackFilter] = useState('all');
  const [feedbackSearch, setFeedbackSearch] = useState('');
  const [feedbackCounts, setFeedbackCounts] = useState({ all: 0, open: 0, inProgress: 0, resolved: 0 });

  // Conversation Modal
  const [conversationOpen, setConversationOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  // Create Feedback Form
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    senderName: '',
    senderRole: 'Parent',
    senderContact: '7891008092',
    category: 'Academic',
    subject: '',
    description: '',
    priority: 'Medium'
  });

  const fetchFeedback = async () => {
    try {
      setFeedbackLoading(true);
      const res = await fetch(`/api/announcements/feedback/list?status=${feedbackFilter}&search=${encodeURIComponent(feedbackSearch)}`);
      const d = await res.json();
      if (d.success) {
        setFeedback(d.data.tickets || []);
        if (d.data.counts) setFeedbackCounts(d.data.counts);
      }
    } catch {
      toast.error('Failed to load feedback tickets');
    } finally {
      setFeedbackLoading(false);
    }
  };

  const openConversation = (ticket) => {
    setSelectedFeedback(ticket);
    setConversationOpen(true);
    setReplyContent('');
  };

  const closeConversation = () => {
    setConversationOpen(false);
    setSelectedFeedback(null);
    setReplyContent('');
  };

  const handleSendReply = async () => {
    if (!replyContent.trim() || !selectedFeedback) return;
    setSendingReply(true);
    try {
      const res = await fetch(`/api/announcements/feedback/${selectedFeedback.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          replyText: replyContent.trim(),
          senderName: 'Principal Office / Admin',
          senderRole: 'Admin'
        })
      });
      const d = await res.json();
      if (d.success) {
        toast.success('Reply dispatched! 💬');
        setReplyContent('');
        setSelectedFeedback(d.data);
        fetchFeedback();
      }
    } catch {
      toast.error('Failed to send reply');
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
        toast.success(`Status updated to ${newStatus}`);
        setSelectedFeedback(d.data);
        fetchFeedback();
      }
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleCreateFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!createForm.subject.trim() || !createForm.description.trim()) {
      toast.error('Title and description are required');
      return;
    }
    try {
      const res = await fetch('/api/announcements/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm)
      });
      const d = await res.json();
      if (d.success) {
        toast.success('Feedback ticket created successfully! 📋');
        setIsCreateFormOpen(false);
        setCreateForm({
          senderName: '',
          senderRole: 'Parent',
          senderContact: '7891008092',
          category: 'Academic',
          subject: '',
          description: '',
          priority: 'Medium'
        });
        fetchFeedback();
      }
    } catch {
      toast.error('Failed to create ticket');
    }
  };

  // ==========================================
  // TAB 3: POLLS & POLL ANALYTICS
  // ==========================================
  const [polls, setPolls] = useState([]);
  const [pollsLoading, setPollsLoading] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [userSelectedVote, setUserSelectedVote] = useState({});

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

  const handleVoteSubmit = async (pollId) => {
    const selected = userSelectedVote[pollId];
    if (!selected || selected.length === 0) {
      toast.error('Please choose at least one option to vote');
      return;
    }
    try {
      const res = await fetch(`/api/announcements/polls/${pollId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optionIds: selected, userId: 'admin' })
      });
      const d = await res.json();
      if (d.success) {
        toast.success('Your vote has been counted! 🗳️');
        fetchPolls();
      }
    } catch {
      toast.error('Failed to vote');
    }
  };

  const handleTogglePollStatus = async (pollId, currentStatus) => {
    const next = currentStatus === 'Active' ? 'Closed' : 'Active';
    try {
      const res = await fetch(`/api/announcements/polls/${pollId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next })
      });
      const d = await res.json();
      if (d.success) {
        toast.success(`Poll marked as ${next}`);
        fetchPolls();
      }
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDeletePoll = async (pollId) => {
    if (!window.confirm('Delete this poll?')) return;
    try {
      const res = await fetch(`/api/announcements/polls/${pollId}`, { method: 'DELETE' });
      const d = await res.json();
      if (d.success) {
        toast.success('Poll removed');
        fetchPolls();
      }
    } catch {
      toast.error('Failed to delete');
    }
  };

  const exportPollCSV = (poll) => {
    const headers = ['Option Number', 'Option Text', 'Votes Received', 'Percentage (%)'];
    const rows = poll.options.map((opt, i) => [
      `"${i + 1}"`,
      `"${opt.text.replace(/"/g, '""')}"`,
      `"${opt.votes || 0}"`,
      `"${opt.percentage || 0}%"`
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `poll_analytics_${poll.id}.csv`;
    link.click();
    toast.success('Poll telemetry exported to CSV! 📥');
  };

  // Switch Tabs Effect
  useEffect(() => {
    if (activeTab === 'notifications') fetchNotifications();
    else if (activeTab === 'feedback') fetchFeedback();
    else if (activeTab === 'polls') fetchPolls();
  }, [activeTab, priorityFilter, feedbackFilter]);

  const buttonGradient = "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-indigo-500/25 text-white";

  return (
    <div className="p-4 sm:p-6 bg-slate-50 min-h-screen text-slate-800 space-y-5">
      
      {/* Page Title & Subtitle matching Test Master Pro PageHeader */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          School Communications
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Manage notifications, feedback, and interactive polls comprehensively.
        </p>
      </div>

      {/* Classy Pill Tabs Bar (Exact 1:1 Test Master Pro styling) */}
      <div className="mb-2">
        <div className="inline-flex items-center gap-1.5 p-1.5 bg-slate-100/90 backdrop-blur-md border border-slate-200/80 rounded-full shadow-inner overflow-x-auto max-w-full custom-scrollbar">
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
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. NOTIFICATIONS TAB (Matching Test Master Pro AdminNotifications.jsx) */}
      {/* ========================================================================= */}
      {activeTab === 'notifications' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 rounded-2xl border border-slate-200/80 shadow-md bg-white overflow-hidden">
          
          {/* Header Bar matching Test Master Pro */}
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
                className={`h-8 text-[11px] font-bold rounded-lg px-4 flex items-center gap-1.5 cursor-pointer ${buttonGradient}`}
              >
                <Bell className="h-3 w-3" /> Create Announcement
              </button>
              <button
                onClick={() => {
                  setAnnouncementModalTab('poll');
                  setIsAnnouncementModalOpen(true);
                }}
                className="h-8 text-[11px] font-bold rounded-lg px-4 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <BarChart3 className="h-3 w-3 text-indigo-600" /> Create Poll
              </button>
              <button
                onClick={() => {
                  setActiveTab('feedback');
                  setIsCreateFormOpen(true);
                }}
                className="h-8 text-[11px] font-bold rounded-lg px-4 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <MessageSquare className="h-3 w-3 text-indigo-600" /> Create Feedback
              </button>
            </div>
          </div>

          {/* Subbar with Counts and Filters */}
          <div className="p-3 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between text-[12px] font-bold text-slate-600 border-b border-slate-100 gap-3">
            <div className="flex items-center gap-4">
              <span>Total: <strong className="text-slate-900">{notifications.length}</strong></span>
              <span>Important/Urgent: <strong className="text-rose-600">{unreadCount}</strong></span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={priorityFilter}
                onChange={e => setPriorityFilter(e.target.value)}
                className="text-[11px] font-semibold border border-slate-200 rounded-lg px-2 py-1 bg-white focus:outline-none"
              >
                <option value="ALL">All Priorities</option>
                <option value="Normal">Normal</option>
                <option value="High">Important</option>
                <option value="Urgent">Urgent</option>
              </select>

              <div className="relative flex-1 sm:w-60">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search notices..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && fetchNotifications()}
                  className="w-full text-xs pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="divide-y divide-slate-100">
            {notifications.map((n) => {
              const isUrgent = n.priority === 'Urgent';
              const isHigh = n.priority === 'High';
              return (
                <div
                  key={n.id}
                  className={`p-4 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                    isUrgent ? 'bg-rose-50/20 hover:bg-rose-50/40' : 'bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className={`border px-2.5 py-0.5 text-[9px] font-black uppercase rounded-full tracking-wider ${
                        isUrgent
                          ? 'bg-rose-100 text-rose-700 border-rose-200'
                          : isHigh
                          ? 'bg-amber-100 text-amber-800 border-amber-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {n.priority || 'INFO'}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500">
                        Target: <strong className="text-slate-800">{n.targetSummary || 'Community'}</strong>
                      </span>
                      <span className="text-[11px] text-slate-400">
                        • {new Date(n.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 className="font-bold text-[14px] text-slate-900 leading-snug mb-1">
                      {n.title}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {n.content}
                    </p>

                    <div className="mt-2 text-[11px] font-semibold text-slate-400 flex items-center gap-3">
                      <span>Sender: <strong className="text-slate-700">{n.sender}</strong></span>
                      {n.attachmentUrl && (
                        <span className="flex items-center gap-1 text-indigo-600">
                          <Paperclip className="w-3 h-3" /> Attachment
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleResend(n.id)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                      title="Resend broadcast"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteNotification(n.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Delete notice"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {notifications.length === 0 && !loading && (
            <div className="text-center py-16 bg-gradient-to-b from-slate-50/50 to-white">
              <Bell className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <p className="text-[14px] font-bold text-slate-500">No active notices found</p>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. FEEDBACK CENTER TAB (Matching Test Master Pro AdminNotifications.jsx) */}
      {/* ========================================================================= */}
      {activeTab === 'feedback' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
          
          {/* Header with Filters and Create Button */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <select
                value={feedbackFilter}
                onChange={e => setFeedbackFilter(e.target.value)}
                className="h-8 text-[11px] font-bold border border-slate-200 bg-white rounded-lg px-2 shadow-xs focus:outline-none"
              >
                <option value="all">All Tickets</option>
                <option value="open">Open</option>
                <option value="in progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
              <span className="text-[11px] font-bold text-slate-500">{feedback.length} tickets</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCreateFormOpen(true)}
                className={`h-8 text-[11px] font-bold rounded-lg px-4 flex items-center gap-1.5 cursor-pointer ${buttonGradient}`}
              >
                <Plus className="h-3 w-3" /> Create Feedback
              </button>
              <button
                onClick={() => {
                  setAnnouncementModalTab('poll');
                  setIsAnnouncementModalOpen(true);
                }}
                className="h-8 text-[11px] font-bold rounded-lg px-4 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <BarChart3 className="h-3 w-3 text-indigo-600" /> Create Poll
              </button>
            </div>
          </div>

          {/* Create Feedback Form (Dropdown Panel) */}
          {isCreateFormOpen && (
            <form onSubmit={handleCreateFeedbackSubmit} className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50/50 to-white p-4 sm:p-5 shadow-md space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                <h4 className="text-[14px] font-bold text-indigo-900">Create New Feedback Ticket</h4>
                <button type="button" onClick={() => setIsCreateFormOpen(false)} className="p-1 text-slate-400 hover:text-rose-500 rounded-md hover:bg-rose-50 transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Complainant Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar (Parent)"
                    value={createForm.senderName}
                    onChange={e => setCreateForm({ ...createForm, senderName: e.target.value })}
                    className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Category</label>
                  <select
                    value={createForm.category}
                    onChange={e => setCreateForm({ ...createForm, category: e.target.value })}
                    className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Transport">Transport</option>
                    <option value="Fees">Fees & Accounts</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Discipline">Discipline</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Priority</label>
                  <select
                    value={createForm.priority}
                    onChange={e => setCreateForm({ ...createForm, priority: e.target.value })}
                    className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Subject *</label>
                <input
                  type="text"
                  required
                  placeholder="Brief summary of feedback..."
                  value={createForm.subject}
                  onChange={e => setCreateForm({ ...createForm, subject: e.target.value })}
                  className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg bg-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Detailed Description *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Elaborate details..."
                  value={createForm.description}
                  onChange={e => setCreateForm({ ...createForm, description: e.target.value })}
                  className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsCreateFormOpen(false)} className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">
                  Cancel
                </button>
                <button type="submit" className={`px-4 py-1.5 text-xs font-bold rounded-lg ${buttonGradient}`}>
                  Save & Publish Ticket
                </button>
              </div>
            </form>
          )}

          {/* Feedback Tickets List */}
          <div className="space-y-3">
            {feedback.map((ticket) => (
              <div
                key={ticket.id}
                className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      {ticket.id}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      ticket.status === 'Resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : ticket.status === 'In Progress'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {ticket.status}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {ticket.category}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm leading-snug mb-1">
                    {ticket.subject}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-1 leading-relaxed">
                    {ticket.description}
                  </p>

                  <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-3">
                    <span className="font-semibold text-slate-700">{ticket.senderName}</span>
                    <span>• {ticket.senderContact}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openConversation(ticket)}
                    className="h-8 px-4 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    Conversation ({ticket.conversation?.length || 1})
                  </button>
                  <select
                    value={ticket.status}
                    onChange={async (e) => {
                      const newStatus = e.target.value;
                      await fetch(`/api/announcements/feedback/${ticket.id}/status`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status: newStatus })
                      });
                      toast.success(`Marked as ${newStatus}`);
                      fetchFeedback();
                    }}
                    className="h-8 text-xs font-semibold px-2 border border-slate-200 rounded-xl bg-white focus:outline-none"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          {feedback.length === 0 && !feedbackLoading && (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
              <MessageSquare className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-500">No feedback tickets logged</p>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. POLL ANALYTICS TAB (Matching Test Master Pro AdminNotifications.jsx) */}
      {/* ========================================================================= */}
      {activeTab === 'polls' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
          
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Active Polls & Survey Analytics</h3>
              <p className="text-xs text-slate-500">Live community participation, vote breakdowns, and CSV export.</p>
            </div>
            <button
              onClick={() => {
                setAnnouncementModalTab('poll');
                setIsAnnouncementModalOpen(true);
              }}
              className={`h-8 text-[11px] font-bold rounded-lg px-4 flex items-center gap-1.5 cursor-pointer ${buttonGradient}`}
            >
              <Plus className="h-3 w-3" /> Create Poll
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {polls.map((poll) => {
              const isSingle = poll.pollType === 'single';
              const selectedOpts = userSelectedVote[poll.id] || [];
              return (
                <div
                  key={poll.id}
                  className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          poll.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {poll.status}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 uppercase">
                          {poll.audience}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                        {poll.totalVotes || 0} Total Votes
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm leading-snug mb-1">
                      {poll.title}
                    </h4>
                    <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                      {poll.description}
                    </p>

                    {/* Progress Options with Live Voting */}
                    <div className="space-y-2.5 mb-4">
                      {poll.options.map((opt) => {
                        const isSelected = selectedOpts.includes(opt.id);
                        return (
                          <div
                            key={opt.id}
                            onClick={() => {
                              if (poll.status !== 'Active') return;
                              setUserSelectedVote(prev => {
                                const cur = prev[poll.id] || [];
                                return {
                                  ...prev,
                                  [poll.id]: isSingle ? [opt.id] : (cur.includes(opt.id) ? cur.filter(x => x !== opt.id) : [...cur, opt.id])
                                };
                              });
                            }}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                              isSelected
                                ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                                : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                            }`}
                          >
                            <div
                              className="absolute left-0 top-0 bottom-0 bg-indigo-100/60 transition-all duration-500 pointer-events-none"
                              style={{ width: `${opt.percentage || 0}%` }}
                            />
                            <div className="relative z-10 flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <div className={`w-4 h-4 rounded-${isSingle ? 'full' : 'md'} border flex items-center justify-center shrink-0 ${
                                  isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 bg-white'
                                }`}>
                                  {isSelected && <div className={`w-1.5 h-1.5 rounded-${isSingle ? 'full' : 'xs'} bg-white`} />}
                                </div>
                                <span className="text-xs font-semibold text-slate-800 truncate">
                                  {opt.text}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-[11px] font-bold text-slate-700">{opt.votes || 0} votes</span>
                                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-600 text-white">
                                  {opt.percentage || 0}%
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    {poll.status === 'Active' ? (
                      <button
                        type="button"
                        onClick={() => handleVoteSubmit(poll.id)}
                        className={`h-8 px-4 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${buttonGradient}`}
                      >
                        <Vote className="h-3.5 w-3.5" /> Submit Vote
                      </button>
                    ) : (
                      <span className="text-xs font-semibold text-slate-400 italic">Voting Closed</span>
                    )}

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => exportPollCSV(poll)}
                        title="Export responses to CSV"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition cursor-pointer"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTogglePollStatus(poll.id, poll.status)}
                        title={poll.status === 'Active' ? 'Close poll' : 'Reopen poll'}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition cursor-pointer"
                      >
                        {poll.status === 'Active' ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePoll(poll.id)}
                        title="Delete poll"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {polls.length === 0 && !pollsLoading && (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
              <BarChart3 className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-500">No active polls running</p>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2-WAY CHAT THREAD CONVERSATION MODAL (Matching Test Master Pro) */}
      {/* ========================================================================= */}
      {conversationOpen && selectedFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            
            {/* Header */}
            <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-indigo-50/30 flex items-center justify-between gap-3 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                    {selectedFeedback.id}
                  </span>
                  <select
                    value={selectedFeedback.status}
                    onChange={e => handleStatusChange(e.target.value)}
                    className="text-xs font-bold px-2 py-0.5 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
                <h4 className="font-bold text-slate-900 text-[15px] mt-1">{selectedFeedback.subject}</h4>
                <p className="text-[11px] text-slate-500">From: {selectedFeedback.senderName} ({selectedFeedback.senderContact})</p>
              </div>
              <button onClick={closeConversation} className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Chat Messages Thread */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar bg-slate-50/50">
              {selectedFeedback.conversation?.map((msg, i) => {
                const isAdmin = msg.senderRole === 'Admin' || msg.senderRole === 'School Staff';
                return (
                  <div key={msg.id || i} className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}>
                    <span className="text-[10px] font-bold text-slate-400 mb-0.5">
                      {msg.sender} ({msg.senderRole}) • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <div className={`p-3.5 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                      isAdmin
                        ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-tr-none shadow-md'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-2xs'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Reply Area */}
            <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
              <input
                type="text"
                placeholder="Draft your reply as Admin..."
                value={replyContent}
                onChange={e => setReplyContent(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendReply()}
                className="flex-1 text-xs px-3.5 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              />
              <button
                type="button"
                onClick={handleSendReply}
                disabled={sendingReply || !replyContent.trim()}
                className={`h-9 px-4 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${buttonGradient}`}
              >
                <Send className="h-3.5 w-3.5" />
                {sendingReply ? 'Sending...' : 'Send Reply'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Universal Announcement & Poll Modal */}
      <AnnouncementModal
        isOpen={isAnnouncementModalOpen}
        onClose={() => setIsAnnouncementModalOpen(false)}
        initialTab={announcementModalTab}
        onSuccess={() => {
          if (activeTab === 'notifications') fetchNotifications();
          else if (activeTab === 'polls') fetchPolls();
          else if (activeTab === 'feedback') fetchFeedback();
        }}
      />

    </div>
  );
}
