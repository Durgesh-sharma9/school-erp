import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Send,
  Home,
  CheckSquare,
  Square,
  Users,
  Search,
  Calendar,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

const SAMPLE_VISITORS = [
  { id: '1', name: 'MUKESH AGRAWAL', enquiryDate: '2026-04-10', contactNo: '9999900001', purpose: 'Class XI Admission Inquiry' },
  { id: '2', name: 'SUNIL JAIN', enquiryDate: '2026-04-11', contactNo: '9999900002', purpose: 'Fee Structure Information' },
  { id: '3', name: 'NEERAJ SHARMA', enquiryDate: '2026-04-12', contactNo: '9999900003', purpose: 'Hostel Facility Visit' },
  { id: '4', name: 'PRIYANKA VERMA', enquiryDate: '2026-04-13', contactNo: '9999900004', purpose: 'Pre-Primary Admission' },
  { id: '5', name: 'DEEPAK MEENA', enquiryDate: '2026-04-14', contactNo: '9999900005', purpose: 'Transport Route Inquiry' }
];

export function VisitorSmsPage({ onNavigate }) {
  const [filterType, setFilterType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVisitorIds, setSelectedVisitorIds] = useState(SAMPLE_VISITORS.map(v => v.id));
  const [messageType, setMessageType] = useState('Text');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('Dear Visitor, thank you for visiting J D International School. For any further admission inquiries, call us at 8947919195.');
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

  const filteredVisitors = SAMPLE_VISITORS.filter(v =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.contactNo.includes(searchQuery) ||
    v.purpose.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelectAll = () => {
    if (selectedVisitorIds.length === filteredVisitors.length) {
      setSelectedVisitorIds([]);
    } else {
      setSelectedVisitorIds(filteredVisitors.map(v => v.id));
    }
  };

  const toggleVisitor = (id) => {
    setSelectedVisitorIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (selectedVisitorIds.length === 0) {
      toast.error('Please select at least one visitor recipient');
      return;
    }
    if (!message.trim()) {
      toast.error('Please write a message to dispatch');
      return;
    }

    setSending(true);
    try {
      const res = await fetch('/api/sms/send-visitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorIds: selectedVisitorIds,
          message,
          messageType
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message || 'Visitor SMS dispatched successfully!');
        setMessage('');
        setTitle('');
        fetch('/api/sms/balance').then(r => r.json()).then(b => { if (b.success) setBalance(b.data); });
      } else {
        toast.error(data.message || 'Failed to dispatch visitor SMS');
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
            <UserCheck className="w-6 h-6 text-indigo-600" />
            Visitor SMS
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span
              className="flex items-center gap-1 hover:text-indigo-600 cursor-pointer"
              onClick={() => onNavigate && onNavigate('/')}
            >
              <Home className="w-3.5 h-3.5" /> School
            </span>
            <span>/</span>
            <span className="text-indigo-600 font-semibold">Visitor SMS</span>
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Visitor Table Panel */}
        <div className="lg:col-span-7 bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-3 bg-slate-100 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <Users className="w-4 h-4 text-indigo-600" />
              Visitor Enquiries ({filteredVisitors.length})
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
                <input
                  type="text"
                  placeholder="Search visitor..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="text-xs pl-7 pr-2.5 py-1 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 w-36"
                />
              </div>

              <button
                type="button"
                onClick={toggleSelectAll}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                {selectedVisitorIds.length === filteredVisitors.length ? (
                  <>
                    <CheckSquare className="w-4 h-4" /> Deselect
                  </>
                ) : (
                  <>
                    <Square className="w-4 h-4" /> Select All
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3 w-10 text-center">✓</th>
                  <th className="py-2.5 px-3">NAME</th>
                  <th className="py-2.5 px-3">ENQUIRY DATE</th>
                  <th className="py-2.5 px-3">CONTACT NO.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredVisitors.map(visitor => {
                  const isSelected = selectedVisitorIds.includes(visitor.id);
                  return (
                    <tr
                      key={visitor.id}
                      onClick={() => toggleVisitor(visitor.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-indigo-50/50' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="py-2.5 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-800">{visitor.name}</div>
                        <div className="text-[10px] text-slate-400">{visitor.purpose}</div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">{visitor.enquiryDate}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-700">{visitor.contactNo}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
            <span>Selected: <strong className="text-indigo-600">{selectedVisitorIds.length}</strong> of {filteredVisitors.length}</span>
            <span>Estimated Credits: <strong>{selectedVisitorIds.length}</strong></span>
          </div>
        </div>

        {/* Right Compose Panel */}
        <div className="lg:col-span-5 bg-white p-5 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            Compose Visitor Follow-Up
          </h2>

          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Select Template</label>
              <select
                onChange={e => setMessage(e.target.value)}
                defaultValue=""
                className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
              >
                <option value="" disabled>Choose Visitor Template...</option>
                {templates.map(tpl => (
                  <option key={tpl.id} value={tpl.content}>{tpl.tempName} ({tpl.language})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Title</label>
              <input
                type="text"
                placeholder="Visitor Thank You / Information"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Write Message</label>
              <textarea
                rows={5}
                placeholder="Type your message text here..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1">
                <span>{message.length} characters</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Message Type</label>
              <select
                value={messageType}
                onChange={e => setMessageType(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
              >
                <option value="Text">Standard SMS (Text)</option>
                <option value="WhatsApp">WhatsApp Business API</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {sending ? 'Sending...' : `Send to ${selectedVisitorIds.length} Visitor(s)`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default VisitorSmsPage;
