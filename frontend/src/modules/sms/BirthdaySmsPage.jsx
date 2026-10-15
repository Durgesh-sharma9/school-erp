import React, { useState, useEffect } from 'react';
import {
  Gift,
  Send,
  Home,
  CheckSquare,
  Square,
  Users,
  Cake,
  AlertCircle,
  Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';

const MOCK_BIRTHDAYS = [
  { id: '1', srNo: '101', name: 'AARAV SHARMA', className: 'I - A', fatherName: 'RAJESH SHARMA', phone: '9876543210', category: 'Student', dob: '15 Oct' },
  { id: '2', srNo: '102', name: 'ANANYA VERMA', className: 'II - A', fatherName: 'SURESH VERMA', phone: '9829012345', category: 'Student', dob: '15 Oct' },
  { id: '3', srNo: 'EMP-12', name: 'VIKRAM CHOUDHARY', className: 'Mathematics', fatherName: 'RAMESHWAR CHOUDHARY', phone: '9414056789', category: 'Staff', dob: '15 Oct' },
  { id: '4', srNo: 'F-101', name: 'RAJESH SHARMA', className: 'I - A', fatherName: 'HARI SHARMA', phone: '9876543210', category: 'Father', dob: '15 Oct' },
  { id: '5', srNo: 'M-102', name: 'SUNITA VERMA', className: 'II - A', fatherName: 'RAM LAL', phone: '9829012345', category: 'Mother', dob: '15 Oct' }
];

export function BirthdaySmsPage({ onNavigate }) {
  const [selectedCategory, setSelectedCategory] = useState('Student'); // Student, Staff, Father, Mother
  const [selectedIds, setSelectedIds] = useState(['1', '2']);
  const [messageType, setMessageType] = useState('Text');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('Happy Birthday [name]! Wishing you great health, joy, and wonderful success on your special day. - J D International School');
  const [templates, setTemplates] = useState([]);
  const [balance, setBalance] = useState({ textSms: 4500, whatsapp: 2200 });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch('/api/sms/balance')
      .then(res => res.json())
      .then(d => { if (d.success) setBalance(d.data); })
      .catch(() => {});

    fetch('/api/sms/templates')
      .then(res => res.json())
      .then(d => { if (d.success) setTemplates(d.data); })
      .catch(() => {});
  }, []);

  const filteredRecipients = MOCK_BIRTHDAYS.filter(b => b.category === selectedCategory);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredRecipients.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredRecipients.map(r => r.id));
    }
  };

  const toggleRecipient = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (selectedIds.length === 0) {
      toast.error('Please select at least one recipient!');
      return;
    }
    if (!message.trim()) {
      toast.error('Please enter greeting message');
      return;
    }

    setSending(true);
    try {
      const res = await fetch('/api/sms/send-birthday', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientIds: selectedIds,
          message,
          messageType
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message || 'Birthday wishes dispatched successfully!');
        fetch('/api/sms/balance').then(r => r.json()).then(b => { if (b.success) setBalance(b.data); });
      } else {
        toast.error(data.message || 'Failed to dispatch birthday SMS');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-4 bg-slate-50 min-h-screen text-slate-800">
      {/* Top Breadcrumb & Balance */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 bg-white p-3 rounded-lg shadow-sm border border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Cake className="w-6 h-6 text-pink-600" />
            Birthday SMS
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span
              className="flex items-center gap-1 hover:text-indigo-600 cursor-pointer"
              onClick={() => onNavigate && onNavigate('/')}
            >
              <Home className="w-3.5 h-3.5" /> School
            </span>
            <span>/</span>
            <span className="text-indigo-600 font-semibold">Birthday SMS</span>
          </div>
        </div>

        {/* SMS Credits Balance Badge */}
        <div className="flex items-center gap-2 mt-3 md:mt-0">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-lg text-xs font-semibold text-indigo-700">
            <span>SMS Credits:</span>
            <span className="font-mono text-sm font-bold text-indigo-900">{balance.textSms}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-700">
            <span>WhatsApp Credits:</span>
            <span className="font-mono text-sm font-bold text-emerald-900">{balance.whatsapp}</span>
          </div>
        </div>
      </div>

      {/* Category Tabs matching UAB: Student, Staff, Father, Mother */}
      <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 mb-4 flex items-center gap-2 overflow-x-auto">
        {['Student', 'Staff', 'Father', 'Mother'].map(cat => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setSelectedIds([]);
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              selectedCategory === cat
                ? 'bg-pink-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
        <span className="text-xs text-slate-400 ml-auto flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-pink-500" /> Today's Celebrants
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Table Panel */}
        <div className="lg:col-span-7 bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <Gift className="w-4 h-4 text-pink-600" />
              {selectedCategory} Birthday List ({filteredRecipients.length})
            </div>
            <button
              type="button"
              onClick={toggleSelectAll}
              className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              {selectedIds.length === filteredRecipients.length ? (
                <>
                  <CheckSquare className="w-4 h-4" /> Deselect All
                </>
              ) : (
                <>
                  <Square className="w-4 h-4" /> Select All
                </>
              )}
            </button>
          </div>

          {selectedIds.length === 0 && (
            <div className="bg-amber-50 border-b border-amber-200 p-2.5 text-amber-800 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Please select at least one !</span>
            </div>
          )}

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3 w-12 text-center">✓</th>
                  <th className="py-2.5 px-3">SR.NO.</th>
                  <th className="py-2.5 px-3">NAME</th>
                  <th className="py-2.5 px-3">CLASS</th>
                  <th className="py-2.5 px-3">FATHER'S NAME</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecipients.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-400">
                      No birthdays recorded today for {selectedCategory}
                    </td>
                  </tr>
                ) : (
                  filteredRecipients.map(r => {
                    const isSelected = selectedIds.includes(r.id);
                    return (
                      <tr
                        key={r.id}
                        onClick={() => toggleRecipient(r.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-pink-50/50' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-2.5 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="rounded text-pink-600 focus:ring-pink-500"
                          />
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-600">{r.srNo}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-800 flex items-center gap-1.5">
                          <Cake className="w-3.5 h-3.5 text-pink-500" />
                          {r.name}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">{r.className}</td>
                        <td className="py-2.5 px-3 text-slate-600">{r.fatherName}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
            <span>Selected Recipients: <strong className="text-pink-600">{selectedIds.length}</strong></span>
            <span>Date: <strong>Today</strong></span>
          </div>
        </div>

        {/* Right Compose Form */}
        <div className="lg:col-span-5 bg-white p-5 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Send className="w-4 h-4 text-pink-600" />
            Compose Birthday Greeting
          </h2>

          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Select Template</label>
              <select
                onChange={e => setMessage(e.target.value)}
                defaultValue=""
                className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-pink-500 bg-white"
              >
                <option value="" disabled>Choose Birthday Template...</option>
                {templates.filter(t => t.category === 'MARKETING' || t.tempName.includes('birth')).map(tpl => (
                  <option key={tpl.id} value={tpl.content}>{tpl.tempName}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Title</label>
              <input
                type="text"
                placeholder="Happy Birthday Wishes"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Write Message</label>
              <textarea
                rows={5}
                placeholder="Type your birthday greeting message here..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
              <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1">
                <span>{message.length} characters</span>
                <span className="text-pink-600 cursor-pointer font-medium" onClick={() => setMessage(prev => prev + ' [name]')}>
                  + Insert [name]
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Message Type</label>
              <select
                value={messageType}
                onChange={e => setMessageType(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-pink-500 font-semibold"
              >
                <option value="Text">Standard SMS (Text)</option>
                <option value="WhatsApp">WhatsApp Business API</option>
              </select>
            </div>

            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded text-rose-700 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>Note:[name] = Student Name</span>
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full py-2 px-4 bg-pink-600 hover:bg-pink-700 text-white rounded text-xs font-bold shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {sending ? 'Sending...' : `Send Birthday Wishes (${selectedIds.length})`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default BirthdaySmsPage;
