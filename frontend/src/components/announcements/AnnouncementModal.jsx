import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Megaphone,
  BarChart3,
  Paperclip,
  Users,
  GraduationCap,
  Plus,
  Trash2,
  X,
  Send,
  Sparkles,
  Calendar,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

export function AnnouncementModal({ isOpen, onClose, onSuccess, initialTab = 'announcement', role = 'ADMIN' }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  // Announcement Form State
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
    priority: 'Normal',
    category: 'Academic',
    targetType: 'ALL_TEACHERS',
    sender: 'Principal Office',
    attachmentUrl: ''
  });

  // Poll Form State
  const [pollForm, setPollForm] = useState({
    title: '',
    description: '',
    audience: 'parents',
    audienceScope: 'all',
    pollType: 'single',
    expiryDate: '',
    allowEdit: false
  });
  const [pollOptions, setPollOptions] = useState([
    { text: 'Morning Slot (08:30 AM - 12:30 PM)' },
    { text: 'Afternoon / Evening Slot (02:30 PM - 06:30 PM)' }
  ]);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  // Handle Announcement Submit
  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault();
    if (!announcementForm.title.trim() || !announcementForm.content.trim()) {
      toast.error('Please enter both title and message content');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(announcementForm)
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Announcement broadcasted successfully! 📢');
        setAnnouncementForm({
          title: '',
          content: '',
          priority: 'Normal',
          category: 'Academic',
          targetType: 'ALL_TEACHERS',
          sender: 'Principal Office',
          attachmentUrl: ''
        });
        if (onSuccess) onSuccess();
        onClose();
      } else {
        toast.error(data.message || 'Failed to dispatch announcement');
      }
    } catch (err) {
      toast.error('Network error while dispatching announcement');
    } finally {
      setSubmitting(false);
    }
  };

  // Poll Option Helpers
  const handlePollOptionChange = (index, value) => {
    const updated = [...pollOptions];
    updated[index] = { ...updated[index], text: value };
    setPollOptions(updated);
  };

  const addPollOption = () => {
    if (pollOptions.length >= 8) {
      toast.error('Maximum 8 options allowed');
      return;
    }
    setPollOptions([...pollOptions, { text: '' }]);
  };

  const removePollOption = (index) => {
    if (pollOptions.length <= 2) {
      toast.error('Minimum 2 options are required');
      return;
    }
    setPollOptions(pollOptions.filter((_, i) => i !== index));
  };

  // Handle Poll Submit
  const handlePollSubmit = async (e) => {
    e.preventDefault();
    if (!pollForm.title.trim() || !pollForm.description.trim()) {
      toast.error('Please enter both poll title and description');
      return;
    }
    const validOptions = pollOptions.map(o => o.text.trim()).filter(Boolean);
    if (validOptions.length < 2) {
      toast.error('Please provide at least 2 valid options');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/announcements/polls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...pollForm,
          options: validOptions
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Interactive Poll published successfully! 📊');
        setPollForm({
          title: '',
          description: '',
          audience: 'parents',
          audienceScope: 'all',
          pollType: 'single',
          expiryDate: '',
          allowEdit: false
        });
        setPollOptions([{ text: '' }, { text: '' }]);
        if (onSuccess) onSuccess();
        onClose();
      } else {
        toast.error(data.message || 'Failed to publish poll');
      }
    } catch (err) {
      toast.error('Network error while creating poll');
    } finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header matching Test Master Pro Announcement Center */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-indigo-50/30 shrink-0">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 shadow-md shadow-indigo-500/20 text-white shrink-0">
                <Megaphone className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                  Announcement & Poll Center
                </h3>
                <p className="text-xs text-slate-500">
                  Broadcast notices and launch interactive community polls
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
              title="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => setActiveTab('announcement')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'announcement'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Megaphone className="w-3.5 h-3.5" />
              Create Announcement
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('poll')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'poll'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Create Poll
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 custom-scrollbar space-y-4">
          
          {/* TAB 1: CREATE ANNOUNCEMENT */}
          {activeTab === 'announcement' && (
            <form onSubmit={handleAnnouncementSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annual Sports Day & Carnival Announcement"
                  value={announcementForm.title}
                  onChange={e => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Message Content *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Type full broadcast details, guidelines, venue, and timings..."
                  value={announcementForm.content}
                  onChange={e => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={announcementForm.priority}
                    onChange={e => setAnnouncementForm({ ...announcementForm, priority: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Info">Info</option>
                    <option value="High">Important</option>
                    <option value="Urgent">Urgent / Emergency</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Audience</label>
                  <select
                    value={announcementForm.targetType}
                    onChange={e => setAnnouncementForm({ ...announcementForm, targetType: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white"
                  >
                    <option value="ALL_TEACHERS">All Teachers & Staff</option>
                    <option value="ENTIRE_CLASS">All Students & Parents</option>
                    <option value="TEACHER_GROUP">Primary Wing Group</option>
                    <option value="SELECTIVE_TEACHERS">Selective Mentors Only</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submitting ? 'Broadcasting...' : 'Broadcast Announcement'}
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: CREATE POLL */}
          {activeTab === 'poll' && (
            <form onSubmit={handlePollSubmit} className="space-y-4">
              <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 leading-relaxed">
                <strong>Publish a New Interactive Poll:</strong> Target either Teachers or Parents, define multiple answer choices, and receive real-time voting percentages with live bar charts.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Audience *</label>
                  <div className="flex items-center gap-4 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="poll-audience"
                        checked={pollForm.audience === 'parents'}
                        onChange={() => setPollForm({ ...pollForm, audience: 'parents' })}
                        className="text-indigo-600"
                      />
                      Parents
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="poll-audience"
                        checked={pollForm.audience === 'teachers'}
                        onChange={() => setPollForm({ ...pollForm, audience: 'teachers' })}
                        className="text-indigo-600"
                      />
                      Teachers
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Choice Mode *</label>
                  <div className="flex items-center gap-4 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="poll-type"
                        checked={pollForm.pollType === 'single'}
                        onChange={() => setPollForm({ ...pollForm, pollType: 'single' })}
                        className="text-indigo-600"
                      />
                      Single Choice
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="poll-type"
                        checked={pollForm.pollType === 'multiple'}
                        onChange={() => setPollForm({ ...pollForm, pollType: 'multiple' })}
                        className="text-indigo-600"
                      />
                      Multiple Choice
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Poll Question / Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annual Sports Day Timing Preference"
                  value={pollForm.title}
                  onChange={e => setPollForm({ ...pollForm, title: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Brief context or instructions for voters..."
                  value={pollForm.description}
                  onChange={e => setPollForm({ ...pollForm, description: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition resize-none"
                />
              </div>

              {/* Dynamic Options */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700">Options ({pollOptions.length})</label>
                  <button
                    type="button"
                    onClick={addPollOption}
                    className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Option
                  </button>
                </div>

                <div className="space-y-2">
                  {pollOptions.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-5 text-center text-xs font-bold text-slate-400">{idx + 1}.</span>
                      <input
                        type="text"
                        required
                        placeholder={`Option ${idx + 1} text`}
                        value={opt.text}
                        onChange={e => handlePollOptionChange(idx, e.target.value)}
                        className="flex-1 text-xs px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                      />
                      {pollOptions.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removePollOption(idx)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Remove option"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  {submitting ? 'Publishing...' : 'Publish Poll'}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>,
    document.body
  );
}

export default AnnouncementModal;
