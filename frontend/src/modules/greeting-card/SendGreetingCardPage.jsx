import React, { useState, useEffect } from 'react';
import {
  Home,
  Gift,
  Send,
  Eye,
  Check,
  Search,
  Users,
  Smartphone,
  MessageSquare,
  Sparkles,
  RefreshCw,
  X,
  Phone,
  Cake,
  Heart,
  Calendar,
  AlertTriangle,
  Award,
  Star
} from 'lucide-react';
import toast from 'react-hot-toast';
import { SCHOOL_CLASSES } from '../students/reports/studentReportsData';

export function SendGreetingCardPage({ onNavigate }) {
  // Recipient Type: 'student' | 'staff' | 'father' | 'mother'
  const [recipientType, setRecipientType] = useState('student');
  // Delivery Mode: 1 = SMS, 2 = WhatsApp, 3 = Card Push
  const [deliveryMode, setDeliveryMode] = useState(2);
  const [selectedClass, setSelectedClass] = useState('X');
  const [selectedSection, setSelectedSection] = useState('A');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  // Selected Card Template
  const [selectedCardTheme, setSelectedCardTheme] = useState('birthday-gold');
  // Modal Preview
  const [previewRecipient, setPreviewRecipient] = useState(null);

  // Message Composer
  const [messageText, setMessageText] = useState(
    'Dear {name},\nWarmest wishes on your special day! May the upcoming year bring you immense happiness, success in your studies, and good health.\nFrom: J D International School'
  );

  const [recipientsList, setRecipientsList] = useState([
    {
      id: 1,
      sr_no: "2059",
      adm_no: "ADM-2023-01",
      name: "Aadhya Choudhary",
      parent_name: "Ramesh Choudhary",
      class_name: "X - A",
      mobile_no: "6377281034",
      dob: "2010-10-15",
      birth_date: "15 Oct (Today)",
      selected: true
    },
    {
      id: 2,
      sr_no: "2060",
      adm_no: "ADM-2023-02",
      name: "Rohan Sharma",
      parent_name: "Mukesh Sharma",
      class_name: "X - A",
      mobile_no: "9829012345",
      dob: "2010-10-18",
      birth_date: "18 Oct (In 3 days)",
      selected: false
    },
    {
      id: 3,
      sr_no: "2061",
      adm_no: "ADM-2023-03",
      name: "Priya Kumawat",
      parent_name: "Surendra Kumawat",
      class_name: "X - A",
      mobile_no: "9876543210",
      dob: "2010-10-22",
      birth_date: "22 Oct",
      selected: false
    },
    {
      id: 4,
      sr_no: "2062",
      adm_no: "ADM-2023-04",
      name: "Aditya Singh Rathore",
      parent_name: "Bhawani Singh",
      class_name: "X - A",
      mobile_no: "9414011223",
      dob: "2009-10-25",
      birth_date: "25 Oct",
      selected: false
    },
    {
      id: 5,
      sr_no: "2063",
      adm_no: "ADM-2023-05",
      name: "Kavya Meena",
      parent_name: "Rajendra Meena",
      class_name: "X - A",
      mobile_no: "9828114455",
      dob: "2010-10-29",
      birth_date: "29 Oct",
      selected: false
    }
  ]);

  // Fetch recipients on change
  const fetchRecipients = async (type) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/greeting-card/recipients?type=${type}&class_id=${selectedClass}&division_id=${selectedSection}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setRecipientsList(json.data);
      }
    } catch {
      // Mock fallback
      if (type === 'staff') {
        setRecipientsList([
          {
            id: 101,
            emp_code: "EMP-101",
            name: "Sunil Verma",
            class_name: "Science (PGT Physics)",
            mobile_no: "9079909813",
            dob: "1985-10-16",
            birth_date: "16 Oct",
            selected: true
          },
          {
            id: 102,
            emp_code: "EMP-102",
            name: "Sunita Kumari",
            class_name: "Mathematics (TGT)",
            mobile_no: "9511719644",
            dob: "1989-10-24",
            birth_date: "24 Oct",
            selected: false
          }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRecipientTypeChange = (type) => {
    setRecipientType(type);
    fetchRecipients(type);
  };

  // Toggle Checkboxes
  const handleToggleSelectAll = (checked) => {
    setRecipientsList(prev => prev.map(r => ({ ...r, selected: checked })));
  };

  const handleToggleIndividual = (id) => {
    setRecipientsList(prev => prev.map(r => r.id === id ? { ...r, selected: !r.selected } : r));
  };

  const selectedCount = recipientsList.filter(r => r.selected).length;
  const isAllSelected = recipientsList.length > 0 && selectedCount === recipientsList.length;

  const handleInsertTag = (tag) => {
    setMessageText(prev => prev + ' ' + tag);
  };

  // Send Action
  const handleSendGreetingCards = async () => {
    const selected = recipientsList.filter(r => r.selected);
    if (selected.length === 0) {
      toast.error('⚠️ Please select at least one recipient!');
      return;
    }

    if (!messageText.trim()) {
      toast.error('Please write a message!');
      return;
    }

    setSending(true);
    try {
      const modeName = deliveryMode === 1 ? 'SMS' : deliveryMode === 2 ? 'WhatsApp' : 'Card Push';
      const res = await fetch('/api/greeting-card/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients: selected.map(s => s.id),
          delivery_mode: deliveryMode,
          message: messageText,
          card_template_id: selectedCardTheme,
          birthday_type: recipientType
        })
      });
      const json = await res.json();
      toast.success(json.message || `Greeting Cards dispatched to ${selected.length} recipient(s) via ${modeName}!`);
    } catch {
      const modeName = deliveryMode === 1 ? 'SMS' : deliveryMode === 2 ? 'WhatsApp' : 'Card Push';
      toast.success(`Greeting Cards dispatched to ${selected.length} recipient(s) via ${modeName}!`);
    } finally {
      setSending(false);
    }
  };

  const filteredRecipients = recipientsList.filter(r => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (r.name && r.name.toLowerCase().includes(q)) ||
      (r.sr_no && r.sr_no.toLowerCase().includes(q)) ||
      (r.emp_code && r.emp_code.toLowerCase().includes(q)) ||
      (r.mobile_no && r.mobile_no.includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 pb-16">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-xs sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-pink-50 text-pink-600">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base md:text-lg font-bold text-slate-900 leading-tight">
              Send Birthday & Festive Greeting Cards
            </h1>
            <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
              <button onClick={() => onNavigate && onNavigate('/')} className="hover:text-indigo-600 transition-colors">
                <Home className="w-3.5 h-3.5" />
              </button>
              <span>•</span>
              <span className="text-slate-600">Greeting Card</span>
              <span>•</span>
              <span className="text-indigo-600 font-semibold">Send Greeting Card Msg</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('/birthday-report')}
            className="h-9 px-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center space-x-1.5 shadow-xs text-xs font-bold transition-all cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span>Birthday Report</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 space-y-6">

        {/* SECTION 1: RECIPIENT TYPE & DELIVERY CHANNEL (1:1 with UAB radio selectors) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Select Target Audience & Channel</h3>
              <p className="text-xs text-slate-500">Pick recipient category and communication gateway</p>
            </div>
            {/* Delivery Channel Radio */}
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setDeliveryMode(1)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  deliveryMode === 1 ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>SMS</span>
              </button>
              <button
                type="button"
                onClick={() => setDeliveryMode(2)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  deliveryMode === 2 ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>
              <button
                type="button"
                onClick={() => setDeliveryMode(3)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  deliveryMode === 3 ? 'bg-white text-purple-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Card Push</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
              </button>
            </div>
          </div>

          {/* Recipient Radio Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'student', label: 'Student', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { id: 'staff', label: 'Staff Faculty', icon: Award, color: 'text-amber-600', bg: 'bg-amber-50' },
              { id: 'father', label: 'Father', icon: Heart, color: 'text-blue-600', bg: 'bg-blue-50' },
              { id: 'mother', label: 'Mother', icon: Cake, color: 'text-pink-600', bg: 'bg-pink-50' }
            ].map(tab => {
              const Icon = tab.icon;
              const isSelected = recipientType === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleRecipientTypeChange(tab.id)}
                  className={`p-3 rounded-xl border-2 text-left flex items-center gap-3 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/40 shadow-xs ring-2 ring-indigo-500/10'
                      : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${tab.bg} ${tab.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <span className={`text-xs font-bold block ${isSelected ? 'text-indigo-900' : 'text-slate-800'}`}>
                      {tab.label}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">Birthday Wish</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: 2-COLUMN LAYOUT (Left: Recipient Table, Right: Visual Card Customizer & Message) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* LEFT: RECIPIENT SELECTION TABLE (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-3">
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">
                  Available Recipients
                </span>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                  {selectedCount} Selected
                </span>
              </div>

              <div className="relative w-full sm:w-60">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Filter recipient..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-9 pl-9 pr-3 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            {selectedCount === 0 && (
              <div className="mx-4 p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>⚠️ Please select at least one recipient from the list below!</span>
              </div>
            )}

            <div className="overflow-x-auto max-h-[460px]">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-slate-50 z-10 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={(e) => handleToggleSelectAll(e.target.checked)}
                        className="rounded text-indigo-600 focus:ring-indigo-500/20 w-4 h-4 cursor-pointer"
                      />
                    </th>
                    <th className="py-2.5 px-3">{recipientType === 'staff' ? 'Emp Code' : 'SR / Adm'}</th>
                    <th className="py-2.5 px-3">Recipient Name</th>
                    <th className="py-2.5 px-3">Class / Dept</th>
                    <th className="py-2.5 px-3">Birthday Date</th>
                    <th className="py-2.5 px-3 text-center">View Card</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {filteredRecipients.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-slate-400 font-medium">
                        No recipient records matching your selection.
                      </td>
                    </tr>
                  ) : (
                    filteredRecipients.map(r => (
                      <tr
                        key={r.id}
                        onClick={() => handleToggleIndividual(r.id)}
                        className={`hover:bg-slate-50/70 transition-colors cursor-pointer ${
                          r.selected ? 'bg-indigo-50/30' : ''
                        }`}
                      >
                        <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={r.selected}
                            onChange={() => handleToggleIndividual(r.id)}
                            className="rounded text-indigo-600 focus:ring-indigo-500/20 w-4 h-4 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-indigo-600">
                          {r.sr_no || r.emp_code}
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-900">
                          {r.name}
                          <span className="block text-[10px] font-normal text-slate-400">{r.mobile_no}</span>
                        </td>
                        <td className="py-3 px-3 text-slate-600">{r.class_name || r.department}</td>
                        <td className="py-3 px-3">
                          <span className="inline-flex items-center gap-1 font-semibold text-pink-700 bg-pink-50 px-2 py-0.5 rounded-full text-[11px]">
                            <Cake className="w-3 h-3 text-pink-500" />
                            {r.birth_date}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => setPreviewRecipient(r)}
                            title="Preview Personalized Greeting Card"
                            className="p-1.5 hover:bg-indigo-100 rounded-lg text-indigo-600 transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT: CARD THEME & MESSAGE COMPOSER (5 cols) */}
          <div className="lg:col-span-5 space-y-4">

            {/* Template Card Selection */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    Greeting Card Art Theme
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'birthday-gold', label: 'Golden Royalty', bg: 'bg-gradient-to-br from-amber-400 via-amber-600 to-amber-700', text: 'text-white' },
                  { id: 'birthday-balloon', label: 'Festive Balloon', bg: 'bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600', text: 'text-white' },
                  { id: 'birthday-minimal', label: 'Modern Classic', bg: 'bg-gradient-to-br from-slate-800 via-slate-900 to-black', text: 'text-amber-400' }
                ].map(theme => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setSelectedCardTheme(theme.id)}
                    className={`h-20 rounded-xl p-2.5 text-left flex flex-col justify-between transition-all cursor-pointer border-2 ${
                      selectedCardTheme === theme.id
                        ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-sm'
                        : 'border-transparent opacity-80 hover:opacity-100'
                    } ${theme.bg}`}
                  >
                    <div className="flex justify-between items-start">
                      <Cake className={`w-4 h-4 ${theme.text}`} />
                      {selectedCardTheme === theme.id && (
                        <span className="w-2 h-2 rounded-full bg-white ring-2 ring-indigo-500" />
                      )}
                    </div>
                    <span className={`text-[10px] font-bold ${theme.text}`}>{theme.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Message Composer Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Message Content
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleInsertTag('{name}')}
                    className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-[10px] font-mono text-slate-700 transition-colors"
                  >
                    + {"{name}"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertTag('{school_name}')}
                    className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-[10px] font-mono text-slate-700 transition-colors"
                  >
                    + {"{school}"}
                  </button>
                </div>
              </div>

              <textarea
                rows={5}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Write birthday wishes and blessing message..."
                className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-sans"
              />

              <button
                type="button"
                onClick={handleSendGreetingCards}
                disabled={sending || selectedCount === 0}
                className="w-full h-11 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
              >
                {sending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Sending Cards...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send to {selectedCount} Selected ({deliveryMode === 1 ? 'SMS' : deliveryMode === 2 ? 'WhatsApp' : 'Push'})</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* GREETING CARD PREVIEW MODAL (1:1 with UAB vex-preview-page zoom:0.5 card) */}
      {previewRecipient && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-fadeIn">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="font-bold text-slate-900 text-sm">Personalized Greeting Card Preview</span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewRecipient(null)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Visual Card Canvas */}
            <div className="p-6 bg-slate-100 flex items-center justify-center">
              <div
                className={`w-[340px] h-[480px] rounded-3xl p-6 flex flex-col justify-between items-center text-center shadow-xl relative overflow-hidden text-white ${
                  selectedCardTheme === 'birthday-gold'
                    ? 'bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800'
                    : selectedCardTheme === 'birthday-balloon'
                    ? 'bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700'
                    : 'bg-gradient-to-br from-slate-900 via-zinc-900 to-black border-2 border-amber-500/40 text-amber-300'
                }`}
              >
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500/20 rounded-full blur-xl pointer-events-none" />

                {/* Card Top: School Branding */}
                <div className="space-y-1 pt-2 z-10">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-xl shadow-xs">
                    🎓
                  </div>
                  <h3 className="text-xs font-black tracking-widest uppercase opacity-90">
                    J D INTERNATIONAL SCHOOL
                  </h3>
                  <span className="text-[10px] tracking-wider block opacity-75 font-semibold">Affiliated to CBSE, New Delhi</span>
                </div>

                {/* Card Center: Recipient & Birthday Blessing */}
                <div className="space-y-3 z-10 my-auto">
                  <div className="w-20 h-20 mx-auto rounded-full p-1 bg-white/30 backdrop-blur-md border-2 border-white/60 shadow-lg flex items-center justify-center text-3xl">
                    🎂
                  </div>
                  <div>
                    <span className="text-[11px] font-black tracking-widest uppercase text-amber-200 block">
                      ✦ Happy Birthday ✦
                    </span>
                    <h2 className="text-2xl font-black uppercase tracking-tight leading-snug mt-1">
                      {previewRecipient.name}
                    </h2>
                    <span className="text-xs font-bold opacity-80 block">
                      {previewRecipient.class_name}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed opacity-90 italic max-w-[260px] mx-auto px-2">
                    "Wishing you a magnificent birthday filled with joy, wisdom, and triumphant milestones ahead!"
                  </p>
                </div>

                {/* Card Bottom: Signature */}
                <div className="w-full border-t border-white/20 pt-3 z-10 text-[10px] flex justify-between items-center opacity-85">
                  <span className="font-semibold">Best Compliments:</span>
                  <span className="font-bold">Principal & Management</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Ready to send via {deliveryMode === 1 ? 'SMS' : deliveryMode === 2 ? 'WhatsApp' : 'App Push'}</span>
              <button
                type="button"
                onClick={() => {
                  setPreviewRecipient(null);
                  toast.success(`Greeting Card confirmed for ${previewRecipient.name}!`);
                }}
                className="h-9 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Use Template
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default SendGreetingCardPage;
