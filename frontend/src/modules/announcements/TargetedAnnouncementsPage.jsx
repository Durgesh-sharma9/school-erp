import React, { useState, useEffect } from 'react';
import {
  Megaphone,
  BarChart3,
  MessageSquare,
  Users,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Trash2,
  RefreshCw,
  FileText,
  Send,
  Plus,
  X,
  Sparkles,
  AlertCircle,
  Eye,
  CheckSquare,
  Square,
  ShieldAlert,
  ArrowRight,
  MessageCircle,
  Phone,
  User,
  Vote,
  Calendar,
  Lock,
  Unlock,
  Radio
} from 'lucide-react';
import toast from 'react-hot-toast';
import { AnnouncementModal } from '../../components/announcements/AnnouncementModal';

export default function TargetedAnnouncementsPage({ onNavigate }) {
  // Main Module Tab: 'announcements' | 'polls' | 'feedback'
  const [currentModuleTab, setCurrentModuleTab] = useState('announcements');

  // Modal open states
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [announcementModalTab, setAnnouncementModalTab] = useState('announcement');

  // ==========================================
  // 1. ANNOUNCEMENTS STATE & LOGIC
  // ==========================================
  const [announcements, setAnnouncements] = useState([]);
  const [annCounts, setAnnCounts] = useState({ all: 0, teachers: 0, classes: 0, urgent: 0 });
  const [annLoading, setAnnLoading] = useState(true);
  const [annSearch, setAnnSearch] = useState('');
  const [annPriorityFilter, setAnnPriorityFilter] = useState('ALL');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  const fetchAnnouncements = async () => {
    try {
      setAnnLoading(true);
      const res = await fetch(`/api/announcements?priority=${annPriorityFilter}&search=${encodeURIComponent(annSearch)}`);
      const d = await res.json();
      if (d.success) {
        setAnnouncements(d.data.announcements || []);
        if (d.data.counts) setAnnCounts(d.data.counts);
      }
    } catch {
      toast.error('Failed to load announcements');
    } finally {
      setAnnLoading(false);
    }
  };

  const handleResendAnnouncement = async (id) => {
    try {
      const res = await fetch(`/api/announcements/${id}/resend`, { method: 'POST' });
      const d = await res.json();
      if (d.success) {
        toast.success('Announcement re-sent to all channels! 🚀');
        fetchAnnouncements();
      }
    } catch {
      toast.error('Failed to resend');
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm('Are you sure you want to delete this broadcast?')) return;
    try {
      const res = await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
      const d = await res.json();
      if (d.success) {
        toast.success('Announcement removed');
        fetchAnnouncements();
      }
    } catch {
      toast.error('Failed to delete');
    }
  };

  // ==========================================
  // 2. INTERACTIVE POLLS STATE & LOGIC
  // ==========================================
  const [polls, setPolls] = useState([]);
  const [pollsLoading, setPollsLoading] = useState(true);
  const [pollFilter, setPollFilter] = useState('ALL'); // 'ALL' | 'Active' | 'Closed'
  const [userSelectedVote, setUserSelectedVote] = useState({}); // { [pollId]: ['opt_1'] }

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

  const handleOptionSelect = (pollId, optId, isMultiple) => {
    setUserSelectedVote(prev => {
      const current = prev[pollId] || [];
      if (isMultiple) {
        const next = current.includes(optId)
          ? current.filter(id => id !== optId)
          : [...current, optId];
        return { ...prev, [pollId]: next };
      } else {
        return { ...prev, [pollId]: [optId] };
      }
    });
  };

  const handleCastVote = async (pollId) => {
    const selected = userSelectedVote[pollId];
    if (!selected || selected.length === 0) {
      toast.error('Please choose at least one option to vote');
      return;
    }

    try {
      const res = await fetch(`/api/announcements/polls/${pollId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optionIds: selected, userId: 'user_admin' })
      });
      const d = await res.json();
      if (d.success) {
        toast.success('Your vote has been counted! 🗳️');
        fetchPolls();
      } else {
        toast.error(d.message || 'Failed to submit vote');
      }
    } catch {
      toast.error('Failed to submit vote');
    }
  };

  const handleTogglePollStatus = async (pollId, currentStatus) => {
    const nextStatus = currentStatus === 'Active' ? 'Closed' : 'Active';
    try {
      const res = await fetch(`/api/announcements/polls/${pollId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      const d = await res.json();
      if (d.success) {
        toast.success(`Poll marked as ${nextStatus}`);
        fetchPolls();
      }
    } catch {
      toast.error('Failed to update poll status');
    }
  };

  const handleDeletePoll = async (pollId) => {
    if (!window.confirm('Delete this poll and its voting telemetry?')) return;
    try {
      const res = await fetch(`/api/announcements/polls/${pollId}`, { method: 'DELETE' });
      const d = await res.json();
      if (d.success) {
        toast.success('Poll deleted');
        fetchPolls();
      }
    } catch {
      toast.error('Failed to delete poll');
    }
  };

  // ==========================================
  // 3. COMPLAINTS & FEEDBACK STATE & LOGIC
  // ==========================================
  const [feedbackTickets, setFeedbackTickets] = useState([]);
  const [feedbackCounts, setFeedbackCounts] = useState({ all: 0, open: 0, inProgress: 0, resolved: 0 });
  const [feedbackLoading, setFeedbackLoading] = useState(true);
  const [feedbackFilter, setFeedbackFilter] = useState('ALL'); // 'ALL' | 'Open' | 'In Progress' | 'Resolved'
  const [feedbackCategory, setFeedbackCategory] = useState('ALL');
  const [feedbackSearch, setFeedbackSearch] = useState('');

  // Conversation Modal state
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);

  // New Ticket Modal state
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [newTicketForm, setNewTicketForm] = useState({
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
      const res = await fetch(`/api/announcements/feedback/list?status=${feedbackFilter}&category=${feedbackCategory}&search=${encodeURIComponent(feedbackSearch)}`);
      const d = await res.json();
      if (d.success) {
        setFeedbackTickets(d.data.tickets || []);
        if (d.data.counts) setFeedbackCounts(d.data.counts);
      }
    } catch {
      toast.error('Failed to load complaints');
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    setReplying(true);
    try {
      const res = await fetch(`/api/announcements/feedback/${selectedTicket.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          replyText: replyText.trim(),
          senderName: 'Principal Office / School Admin',
          senderRole: 'Admin'
        })
      });
      const d = await res.json();
      if (d.success) {
        toast.success('Reply dispatched to parent/student! 💬');
        setReplyText('');
        setSelectedTicket(d.data);
        fetchFeedback();
      }
    } catch {
      toast.error('Failed to send reply');
    } finally {
      setReplying(false);
    }
  };

  const handleUpdateTicketStatus = async (ticketId, newStatus) => {
    try {
      const res = await fetch(`/api/announcements/feedback/${ticketId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const d = await res.json();
      if (d.success) {
        toast.success(`Ticket marked as ${newStatus}`);
        if (selectedTicket && selectedTicket.id === ticketId) {
          setSelectedTicket(d.data);
        }
        fetchFeedback();
      }
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleCreateTicketSubmit = async (e) => {
    e.preventDefault();
    if (!newTicketForm.subject.trim() || !newTicketForm.description.trim()) {
      toast.error('Please enter subject and description');
      return;
    }

    try {
      const res = await fetch('/api/announcements/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTicketForm)
      });
      const d = await res.json();
      if (d.success) {
        toast.success('Complaint ticket registered successfully! 📋');
        setIsNewTicketOpen(false);
        setNewTicketForm({
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

  // Initial Data Fetch
  useEffect(() => {
    if (currentModuleTab === 'announcements') fetchAnnouncements();
    else if (currentModuleTab === 'polls') fetchPolls();
    else if (currentModuleTab === 'feedback') fetchFeedback();
  }, [currentModuleTab, annPriorityFilter, feedbackFilter, feedbackCategory]);

  return (
    <div className="p-3 sm:p-5 bg-slate-50 min-h-screen text-slate-800 space-y-4">
      
      {/* Top Header Card matching Test Master Pro styling */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20 shrink-0">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Communication & Announcement Hub
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 uppercase tracking-wider">
                  Test Master Suite
                </span>
              </h1>
              <p className="text-xs text-slate-500">
                Broadcast announcements, run community polls, and resolve complaints & grievances.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setAnnouncementModalTab('announcement');
              setIsAnnouncementModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <Megaphone className="w-3.5 h-3.5" />
            Broadcast Notice
          </button>

          <button
            onClick={() => {
              setAnnouncementModalTab('poll');
              setIsAnnouncementModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold shadow-2xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Create Poll
          </button>
        </div>
      </div>

      {/* 3 Main Unified Tabs Matching Test Master Pro */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setCurrentModuleTab('announcements')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            currentModuleTab === 'announcements'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>Announcements</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
            currentModuleTab === 'announcements' ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            {announcements.length}
          </span>
        </button>

        <button
          onClick={() => setCurrentModuleTab('polls')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            currentModuleTab === 'polls'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Interactive Polls</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
            currentModuleTab === 'polls' ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            {polls.length}
          </span>
        </button>

        <button
          onClick={() => setCurrentModuleTab('feedback')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            currentModuleTab === 'feedback'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Complaints & Feedback</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
            currentModuleTab === 'feedback' ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            {feedbackCounts.open > 0 ? `${feedbackCounts.open} Open` : feedbackTickets.length}
          </span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: ANNOUNCEMENTS CONTENT */}
      {/* ========================================================= */}
      {currentModuleTab === 'announcements' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white rounded-xl p-3 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-500">Priority:</span>
              <div className="flex items-center gap-1">
                {['ALL', 'Normal', 'High', 'Urgent'].map(p => (
                  <button
                    key={p}
                    onClick={() => setAnnPriorityFilter(p)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                      annPriorityFilter === p
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search announcements..."
                value={annSearch}
                onChange={e => setAnnSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && fetchAnnouncements()}
                className="w-full text-xs pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Announcements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {announcements.map(ann => (
              <div
                key={ann.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      ann.priority === 'Urgent'
                        ? 'bg-rose-100 text-rose-700 border border-rose-200'
                        : ann.priority === 'High'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      {ann.priority} Priority
                    </span>
                    <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(ann.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm leading-snug mb-1.5 hover:text-indigo-600 transition-colors">
                    {ann.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-3">
                    {ann.content}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px] font-semibold text-slate-500">
                    Target: <strong className="text-slate-700">{ann.targetSummary || 'Faculty & Students'}</strong>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleResendAnnouncement(ann.id)}
                      title="Resend broadcast"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteAnnouncement(ann.id)}
                      title="Delete broadcast"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {announcements.length === 0 && !annLoading && (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              <Megaphone className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="text-xs font-semibold">No announcements found matching criteria</p>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: INTERACTIVE POLLS CONTENT */}
      {/* ========================================================= */}
      {currentModuleTab === 'polls' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-3 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Status:</span>
              <div className="flex items-center gap-1">
                {['ALL', 'Active', 'Closed'].map(st => (
                  <button
                    key={st}
                    onClick={() => setPollFilter(st)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                      pollFilter === st
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setAnnouncementModalTab('poll');
                setIsAnnouncementModalOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold shadow-xs hover:shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> New Poll
            </button>
          </div>

          {/* Polls Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {polls
              .filter(p => pollFilter === 'ALL' || p.status === pollFilter)
              .map(poll => {
                const isSingle = poll.pollType === 'single';
                const selectedOpts = userSelectedVote[poll.id] || [];
                return (
                  <div
                    key={poll.id}
                    className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex flex-col justify-between"
                  >
                    <div>
                      {/* Poll Header Badges */}
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
                            Audience: {poll.audience}
                          </span>
                        </div>

                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                          {poll.totalVotes || 0} Total Votes
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-sm leading-snug mb-1">
                        {poll.title}
                      </h3>
                      <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                        {poll.description}
                      </p>

                      {/* Options with Live Voting & Bar Charts */}
                      <div className="space-y-2.5 mb-4">
                        {poll.options.map(opt => {
                          const isSelected = selectedOpts.includes(opt.id);
                          return (
                            <div
                              key={opt.id}
                              onClick={() => poll.status === 'Active' && handleOptionSelect(poll.id, opt.id, !isSingle)}
                              className={`p-2.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                                isSelected
                                  ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                              }`}
                            >
                              {/* Background Percentage Progress Fill */}
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
                                  <span className="text-[11px] font-bold text-slate-700">
                                    {opt.votes || 0} votes
                                  </span>
                                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-600 text-white shadow-2xs">
                                    {opt.percentage || 0}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      {poll.status === 'Active' ? (
                        <button
                          type="button"
                          onClick={() => handleCastVote(poll.id)}
                          className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold shadow-xs hover:shadow-md transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Vote className="w-3.5 h-3.5" /> Submit Vote
                        </button>
                      ) : (
                        <span className="text-xs font-semibold text-slate-400 italic">Voting Closed</span>
                      )}

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleTogglePollStatus(poll.id, poll.status)}
                          title={poll.status === 'Active' ? 'Close poll' : 'Reopen poll'}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition cursor-pointer"
                        >
                          {poll.status === 'Active' ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePoll(poll.id)}
                          title="Delete poll"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {polls.length === 0 && !pollsLoading && (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              <BarChart3 className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="text-xs font-semibold">No interactive polls published yet</p>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: COMPLAINTS & GRIEVANCE FEEDBACK */}
      {/* ========================================================= */}
      {currentModuleTab === 'feedback' && (
        <div className="space-y-4">
          
          {/* Summary Metric Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-3 border border-slate-200/90 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Total Tickets</span>
              <p className="text-xl font-extrabold text-slate-800 mt-0.5">{feedbackCounts.all}</p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-rose-200/80 bg-rose-50/20 shadow-2xs">
              <span className="text-[11px] font-bold text-rose-600 uppercase">Open / Pending</span>
              <p className="text-xl font-extrabold text-rose-700 mt-0.5">{feedbackCounts.open}</p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-amber-200/80 bg-amber-50/20 shadow-2xs">
              <span className="text-[11px] font-bold text-amber-600 uppercase">In Progress</span>
              <p className="text-xl font-extrabold text-amber-700 mt-0.5">{feedbackCounts.inProgress}</p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-emerald-200/80 bg-emerald-50/20 shadow-2xs">
              <span className="text-[11px] font-bold text-emerald-600 uppercase">Resolved</span>
              <p className="text-xl font-extrabold text-emerald-700 mt-0.5">{feedbackCounts.resolved}</p>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="bg-white rounded-xl p-3 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              {['ALL', 'Open', 'In Progress', 'Resolved'].map(st => (
                <button
                  key={st}
                  onClick={() => setFeedbackFilter(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition shrink-0 ${
                    feedbackFilter === st
                      ? 'bg-slate-900 text-white font-bold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-60">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search complaints..."
                  value={feedbackSearch}
                  onChange={e => setFeedbackSearch(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && fetchFeedback()}
                  className="w-full text-xs pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <button
                onClick={() => setIsNewTicketOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold shadow-xs hover:shadow-md transition flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" /> Log Ticket
              </button>
            </div>
          </div>

          {/* Feedback Tickets List */}
          <div className="space-y-3">
            {feedbackTickets.map(ticket => (
              <div
                key={ticket.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
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

                  <h3 className="font-bold text-slate-900 text-sm mb-1 leading-snug">
                    {ticket.subject}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-1 leading-relaxed">
                    {ticket.description}
                  </p>

                  <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" />
                      <strong>{ticket.senderName}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {ticket.senderContact}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setSelectedTicket(ticket)}
                    className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Conversation ({ticket.conversation?.length || 1})
                  </button>

                  <select
                    value={ticket.status}
                    onChange={e => handleUpdateTicketStatus(ticket.id, e.target.value)}
                    className="text-xs font-semibold px-2 py-1.5 border border-slate-200 rounded-xl bg-white focus:outline-none"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          {feedbackTickets.length === 0 && !feedbackLoading && (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              <MessageSquare className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="text-xs font-semibold">No complaints or feedback found</p>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 2-WAY CONVERSATION CHAT MODAL (COMPLAINTS) */}
      {/* ========================================================= */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between gap-3 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    {selectedTicket.id}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    selectedTicket.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedTicket.status}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm mt-1">{selectedTicket.subject}</h3>
                <p className="text-[11px] text-slate-500">From: {selectedTicket.senderName} ({selectedTicket.senderContact})</p>
              </div>

              <button
                onClick={() => setSelectedTicket(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conversation Messages Thread */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-slate-50/30">
              {selectedTicket.conversation?.map((msg, i) => {
                const isAdmin = msg.senderRole === 'Admin' || msg.senderRole === 'School Staff';
                return (
                  <div
                    key={msg.id || i}
                    className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                  >
                    <span className="text-[10px] font-bold text-slate-400 mb-0.5">
                      {msg.sender} ({msg.senderRole}) • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <div className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                      isAdmin
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-none shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-2xs'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Fast Reply Box */}
            <form onSubmit={handleSendReply} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2 shrink-0">
              <input
                type="text"
                placeholder="Type response to parent/student..."
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                className="flex-1 text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              />
              <button
                type="submit"
                disabled={replying || !replyText.trim()}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold shadow-sm hover:shadow-md transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {replying ? 'Sending...' : 'Reply'}
              </button>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* NEW TICKET REGISTRATION MODAL */}
      {/* ========================================================= */}
      {isNewTicketOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Register New Grievance / Complaint</h3>
              <button onClick={() => setIsNewTicketOpen(false)} className="text-slate-400 hover:text-rose-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTicketSubmit} className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Complainant / Parent Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar (Father of Rohan - II-B)"
                  value={newTicketForm.senderName}
                  onChange={e => setNewTicketForm({ ...newTicketForm, senderName: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newTicketForm.category}
                    onChange={e => setNewTicketForm({ ...newTicketForm, category: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Transport">Transport</option>
                    <option value="Fees">Fees & Accounts</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Discipline">Discipline</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={newTicketForm.priority}
                    onChange={e => setNewTicketForm({ ...newTicketForm, priority: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Delayed textbook delivery"
                  value={newTicketForm.subject}
                  onChange={e => setNewTicketForm({ ...newTicketForm, subject: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description / Details *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detailed description of issue..."
                  value={newTicketForm.description}
                  onChange={e => setNewTicketForm({ ...newTicketForm, description: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewTicketOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold shadow-md hover:shadow-lg"
                >
                  Register Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Universal Announcement & Poll Modal */}
      <AnnouncementModal
        isOpen={isAnnouncementModalOpen}
        onClose={() => setIsAnnouncementModalOpen(false)}
        initialTab={announcementModalTab}
        onSuccess={() => {
          if (currentModuleTab === 'announcements') fetchAnnouncements();
          else if (currentModuleTab === 'polls') fetchPolls();
        }}
      />

    </div>
  );
}
