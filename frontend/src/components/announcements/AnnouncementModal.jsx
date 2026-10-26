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
  Calendar,
  CheckCircle2,
  AlertCircle,
  User,
  Search,
  Check
} from 'lucide-react';
import toast from 'react-hot-toast';

export function AnnouncementModal({ isOpen, open, onClose, onOpenChange, onSuccess, initialTab = 'announcement', role = 'ADMIN' }) {
  const isModalOpen = isOpen !== undefined ? isOpen : open;
  const handleClose = () => {
    if (onClose) onClose();
    if (onOpenChange) onOpenChange(false);
  };

  const [activeTab, setActiveTab] = useState(initialTab);

  // Metadata
  const [meta, setMeta] = useState({
    teachers: [],
    teacherGroups: [],
    classes: [],
    students: []
  });
  const [metaLoaded, setMetaLoaded] = useState(false);

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

  // Individual / Selective Target Details
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [teacherSearch, setTeacherSearch] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [selectedClass, setSelectedClass] = useState('X');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentClassFilter, setStudentClassFilter] = useState('ALL');
  const [studentSearch, setStudentSearch] = useState('');

  // Channels
  const [channels, setChannels] = useState({
    inApp: true,
    sms: false,
    whatsapp: false,
    push: true
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
  const [attachmentFile, setAttachmentFile] = useState(null);

  // Load Meta on open
  useEffect(() => {
    if (isModalOpen) {
      setActiveTab(initialTab);
      fetch('/api/announcements/meta')
        .then(res => res.json())
        .then(d => {
          if (d.success) {
            setMeta(d.data);
            setMetaLoaded(true);
            if (d.data.teacherGroups?.length > 0) setSelectedGroupId(d.data.teacherGroups[0].id);
            if (d.data.classes?.length > 0) setSelectedClass(d.data.classes[0].name);
          }
        })
        .catch(() => {});
    }
  }, [isModalOpen, initialTab]);

  if (!isModalOpen) return null;

  // Toggle teacher checkbox
  const toggleTeacher = (teacher) => {
    setSelectedTeachers(prev => {
      const exists = prev.some(t => t.id === teacher.id);
      if (exists) return prev.filter(t => t.id !== teacher.id);
      return [...prev, teacher];
    });
  };

  // Filtered lists
  const filteredTeachers = (meta.teachers || []).filter(t =>
    t.name.toLowerCase().includes(teacherSearch.toLowerCase()) ||
    t.subject.toLowerCase().includes(teacherSearch.toLowerCase())
  );

  const filteredStudents = (meta.students || []).filter(s => {
    const classMatch = studentClassFilter === 'ALL' || s.className === studentClassFilter;
    const q = studentSearch.toLowerCase();
    const searchMatch = !q || s.name.toLowerCase().includes(q) || s.admNo.toLowerCase().includes(q) || s.rollNo.includes(q);
    return classMatch && searchMatch;
  });

  // Handle Announcement Submit
  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault();
    if (!announcementForm.title.trim() || !announcementForm.content.trim()) {
      toast.error('Please enter both title and message content');
      return;
    }

    // Build target details based on targetType
    let targetDetails = {};
    if (announcementForm.targetType === 'SELECTIVE_TEACHERS') {
      if (selectedTeachers.length === 0) {
        toast.error('Please select at least one teacher');
        return;
      }
      targetDetails = { teachers: selectedTeachers };
    } else if (announcementForm.targetType === 'SPECIFIC_STUDENT') {
      if (!selectedStudent) {
        toast.error('Please search and select an individual student');
        return;
      }
      targetDetails = {
        studentId: selectedStudent.id,
        studentName: selectedStudent.name,
        admNo: selectedStudent.admNo,
        rollNo: selectedStudent.rollNo,
        className: selectedStudent.className,
        section: selectedStudent.section,
        parentName: selectedStudent.fatherName,
        phone: '7891008092'
      };
    } else if (announcementForm.targetType === 'ENTIRE_CLASS') {
      targetDetails = {
        className: selectedClass,
        section: selectedSection,
        studentCount: 40
      };
    } else if (announcementForm.targetType === 'TEACHER_GROUP') {
      const grp = meta.teacherGroups?.find(g => g.id === selectedGroupId);
      targetDetails = {
        groupId: selectedGroupId,
        groupName: grp ? grp.name : 'Faculty Group'
      };
    }

    setSubmitting(true);
    try {
      const payload = {
        ...announcementForm,
        targetDetails,
        channels,
        attachmentUrl: attachmentFile ? attachmentFile.name : announcementForm.attachmentUrl
      };

      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Announcement sent successfully to ${data.data.targetSummary}! 📢`);
        setAnnouncementForm({
          title: '',
          content: '',
          priority: 'Normal',
          category: 'Academic',
          targetType: 'ALL_TEACHERS',
          sender: 'Principal Office',
          attachmentUrl: ''
        });
        setSelectedTeachers([]);
        setSelectedStudent(null);
        setAttachmentFile(null);
        if (onSuccess) onSuccess();
        handleClose();
      } else {
        toast.error(data.message || 'Failed to dispatch announcement');
      }
    } catch {
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
        handleClose();
      } else {
        toast.error(data.message || 'Failed to publish poll');
      }
    } catch {
      toast.error('Network error while creating poll');
    } finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-indigo-50/30 shrink-0">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 shadow-md shadow-indigo-500/20 text-white shrink-0">
                <Megaphone className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                  Announcement & Broadcast Center
                </h3>
                <p className="text-xs text-slate-500">
                  Target entire school, classes, or specific individual teachers & students
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
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
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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
              
              {/* Target Audience Selector */}
              <div className="p-3 bg-gradient-to-r from-indigo-50/70 to-purple-50/40 rounded-xl border border-indigo-100 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-indigo-950 mb-1">
                    Target Audience / Recipient Type *
                  </label>
                  <select
                    value={announcementForm.targetType}
                    onChange={e => {
                      setAnnouncementForm({ ...announcementForm, targetType: e.target.value });
                      setSelectedTeachers([]);
                      setSelectedStudent(null);
                    }}
                    className="w-full text-xs font-bold px-3 py-2 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white shadow-xs"
                  >
                    <option value="ALL_TEACHERS">📢 All Teachers & Staff (Whole School)</option>
                    <option value="SELECTIVE_TEACHERS">👤 Individual Teacher(s) (Selective Selection)</option>
                    <option value="ENTIRE_CLASS">🏫 Entire Class (Class-wise Students & Parents)</option>
                    <option value="SPECIFIC_STUDENT">🎓 Individual Student / Parent (1-to-1 Direct Notice)</option>
                    <option value="TEACHER_GROUP">🏢 Teacher Department / Wing Group</option>
                  </select>
                </div>

                {/* 1. SELECTIVE / INDIVIDUAL TEACHERS UI */}
                {announcementForm.targetType === 'SELECTIVE_TEACHERS' && (
                  <div className="space-y-2 bg-white p-3 rounded-xl border border-indigo-200">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-700">
                        Choose Individual Teachers ({selectedTeachers.length} Selected)
                      </span>
                      {selectedTeachers.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setSelectedTeachers([])}
                          className="text-[10px] font-bold text-rose-600 hover:underline"
                        >
                          Clear Selection
                        </button>
                      )}
                    </div>

                    <div className="relative">
                      <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search teacher by name or subject..."
                        value={teacherSearch}
                        onChange={e => setTeacherSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="max-h-36 overflow-y-auto space-y-1.5 custom-scrollbar pr-1">
                      {filteredTeachers.map(teacher => {
                        const isSelected = selectedTeachers.some(t => t.id === teacher.id);
                        return (
                          <div
                            key={teacher.id}
                            onClick={() => toggleTeacher(teacher)}
                            className={`flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer transition ${
                              isSelected
                                ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-bold'
                                : 'bg-slate-50/50 border-slate-200 hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {}}
                                className="rounded text-indigo-600 pointer-events-none"
                              />
                              <span>{teacher.name}</span>
                              <span className="text-[10px] font-medium text-slate-500">({teacher.subject})</span>
                            </div>
                            <span className="text-[10px] text-slate-400">{teacher.department}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. SPECIFIC / INDIVIDUAL STUDENT UI */}
                {announcementForm.targetType === 'SPECIFIC_STUDENT' && (
                  <div className="space-y-2 bg-white p-3 rounded-xl border border-indigo-200">
                    <span className="text-[11px] font-bold text-slate-700 block">
                      Search & Select Individual Student (1-to-1)
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <select
                          value={studentClassFilter}
                          onChange={e => setStudentClassFilter(e.target.value)}
                          className="w-full text-xs font-semibold px-2 py-1.5 border border-slate-200 rounded-lg bg-white outline-none"
                        >
                          <option value="ALL">All Classes</option>
                          <option value="X">Class X</option>
                          <option value="IX">Class IX</option>
                          <option value="VIII">Class VIII</option>
                          <option value="I">Class I</option>
                          <option value="XII">Class XII</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2 relative">
                        <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search student by name, roll no, adm no..."
                          value={studentSearch}
                          onChange={e => setStudentSearch(e.target.value)}
                          className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    {/* Student List */}
                    <div className="max-h-36 overflow-y-auto space-y-1.5 custom-scrollbar pr-1">
                      {filteredStudents.map(student => {
                        const isSelected = selectedStudent?.id === student.id;
                        return (
                          <div
                            key={student.id}
                            onClick={() => setSelectedStudent(student)}
                            className={`flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer transition ${
                              isSelected
                                ? 'bg-indigo-50 border-indigo-400 text-indigo-900 font-bold ring-1 ring-indigo-400'
                                : 'bg-slate-50/50 border-slate-200 hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <GraduationCap className={`h-4 w-4 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                              <span>{student.name}</span>
                              <span className="text-[10px] text-slate-500">(Roll: {student.rollNo}, Class {student.className}-{student.section})</span>
                            </div>
                            <span className="text-[10px] text-slate-500">Father: {student.fatherName}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Selected Student Pill */}
                    {selectedStudent && (
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-bold">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          <span>Selected Student: {selectedStudent.name} (Class {selectedStudent.className}-{selectedStudent.section})</span>
                          <span className="text-[10px] text-emerald-700 font-normal">| Parent: {selectedStudent.fatherName}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedStudent(null)}
                          className="text-rose-600 hover:text-rose-700 cursor-pointer"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. ENTIRE CLASS SELECTION */}
                {announcementForm.targetType === 'ENTIRE_CLASS' && (
                  <div className="grid grid-cols-2 gap-3 bg-white p-3 rounded-xl border border-indigo-200">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Class *</label>
                      <select
                        value={selectedClass}
                        onChange={e => setSelectedClass(e.target.value)}
                        className="w-full text-xs font-semibold px-3 py-1.5 border border-slate-200 rounded-lg bg-white"
                      >
                        {meta.classes?.map(c => (
                          <option key={c.name} value={c.name}>Class {c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Section *</label>
                      <select
                        value={selectedSection}
                        onChange={e => setSelectedSection(e.target.value)}
                        className="w-full text-xs font-semibold px-3 py-1.5 border border-slate-200 rounded-lg bg-white"
                      >
                        <option value="ALL">All Sections (Entire Class)</option>
                        <option value="A">Section A</option>
                        <option value="B">Section B</option>
                        <option value="C">Section C</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* 4. TEACHER GROUP SELECTION */}
                {announcementForm.targetType === 'TEACHER_GROUP' && (
                  <div className="bg-white p-3 rounded-xl border border-indigo-200">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Select Department / Faculty Group *</label>
                    <select
                      value={selectedGroupId}
                      onChange={e => setSelectedGroupId(e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-1.5 border border-slate-200 rounded-lg bg-white"
                    >
                      {meta.teacherGroups?.map(g => (
                        <option key={g.id} value={g.id}>{g.name} ({g.memberCount} Members)</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Science Olympiad Briefing / Remedial Math Session"
                  value={announcementForm.title}
                  onChange={e => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition"
                />
              </div>

              {/* Message Content */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Message Content *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Type broadcast details, instructions, venue, and timings..."
                  value={announcementForm.content}
                  onChange={e => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition resize-none"
                />
              </div>

              {/* Priority and Sender Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={announcementForm.priority}
                    onChange={e => setAnnouncementForm({ ...announcementForm, priority: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white font-medium"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Info">Info</option>
                    <option value="High">Important</option>
                    <option value="Urgent">Urgent / Emergency</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Dispatched By</label>
                  <input
                    type="text"
                    value={announcementForm.sender}
                    onChange={e => setAnnouncementForm({ ...announcementForm, sender: e.target.value })}
                    placeholder="Principal / Admin Office"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white font-medium"
                  />
                </div>
              </div>

              {/* Channels Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Dispatch Channels</label>
                <div className="flex flex-wrap items-center gap-4 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <label className="flex items-center gap-1.5 font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={channels.inApp}
                      onChange={e => setChannels({ ...channels, inApp: e.target.checked })}
                      className="rounded text-indigo-600"
                    />
                    In-App Portal Notice
                  </label>
                  <label className="flex items-center gap-1.5 font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={channels.sms}
                      onChange={e => setChannels({ ...channels, sms: e.target.checked })}
                      className="rounded text-indigo-600"
                    />
                    SMS Gateway (7891008092)
                  </label>
                  <label className="flex items-center gap-1.5 font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={channels.whatsapp}
                      onChange={e => setChannels({ ...channels, whatsapp: e.target.checked })}
                      className="rounded text-indigo-600"
                    />
                    WhatsApp
                  </label>
                  <label className="flex items-center gap-1.5 font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={channels.push}
                      onChange={e => setChannels({ ...channels, push: e.target.checked })}
                      className="rounded text-indigo-600"
                    />
                    Push Alert
                  </label>
                </div>
              </div>

              {/* Attachment */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Attachment (Optional)</label>
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                    <Paperclip className="h-3.5 w-3.5 text-indigo-500" />
                    <span>Choose File (PDF, Image, Doc)</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files[0];
                        if (file) setAttachmentFile(file);
                      }}
                    />
                  </label>
                  {attachmentFile && (
                    <span className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                      {attachmentFile.name}
                      <button
                        type="button"
                        onClick={() => setAttachmentFile(null)}
                        className="text-slate-400 hover:text-rose-500 p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submitting ? 'Dispatching...' : 'Dispatch Announcement'}
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: CREATE POLL */}
          {activeTab === 'poll' && (
            <form onSubmit={handlePollSubmit} className="space-y-4">
              <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 leading-relaxed">
                <strong>Publish a New Interactive Poll:</strong> Target either Teachers or Parents, define multiple answer choices, and receive real-time voting percentages with live analytics.
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
                  onClick={handleClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
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
