import React, { useState, useEffect } from 'react';
import {
  PhoneCall,
  Send,
  Home,
  Link as LinkIcon,
  HelpCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

export function IndividualSmsPage({ onNavigate }) {
  const [numbers, setNumbers] = useState('');
  const [sendingType, setSendingType] = useState('Instant'); // Instant or Scheduled
  const [scheduledTime, setScheduledTime] = useState('');
  const [messageType, setMessageType] = useState('Text');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
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

  const handleTemplateSelect = (content) => {
    setMessage(content);
  };

  const parsedNumbers = numbers
    .split(/[,\n]/)
    .map(n => n.trim().replace(/\D/g, ''))
    .filter(n => n.length >= 10);

  const handleSend = async (e) => {
    e.preventDefault();
    if (parsedNumbers.length === 0) {
      toast.error('Please enter at least one valid 10-digit mobile number');
      return;
    }
    if (!message.trim()) {
      toast.error('Please enter message text to send');
      return;
    }

    setSending(true);
    try {
      const res = await fetch('/api/sms/send-individual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          numbers,
          message,
          messageType,
          sendingType
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message || 'Individual SMS dispatched successfully!');
        setNumbers('');
        setMessage('');
        setTitle('');
        fetch('/api/sms/balance').then(r => r.json()).then(b => { if (b.success) setBalance(b.data); });
      } else {
        toast.error(data.message || 'Failed to dispatch individual SMS');
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
            <PhoneCall className="w-6 h-6 text-indigo-600" />
            Individual SMS
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span
              className="flex items-center gap-1 hover:text-indigo-600 cursor-pointer"
              onClick={() => onNavigate && onNavigate('dashboard')}
            >
              <Home className="w-3.5 h-3.5" /> School
            </span>
            <span>/</span>
            <span className="text-indigo-600 font-semibold">Individual SMS</span>
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

      {/* Main Center Card */}
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <h2 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          Direct Number SMS / WhatsApp Dispatch
        </h2>

        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-slate-600">Enter Numbers</label>
              <span className="text-[11px] text-slate-400">
                Valid Count: <strong className="text-indigo-600">{parsedNumbers.length}</strong>
              </span>
            </div>
            <textarea
              rows={3}
              placeholder="Enter mobile numbers (comma separated or each on a new line) e.g. 9876543210, 9829012345"
              value={numbers}
              onChange={e => setNumbers(e.target.value)}
              className="w-full text-xs font-mono border border-slate-300 rounded px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Sending Type</label>
              <select
                value={sendingType}
                onChange={e => setSendingType(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="Instant">Instant Delivery</option>
                <option value="Scheduled">Scheduled Queue</option>
              </select>
            </div>

            {sendingType === 'Scheduled' && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Schedule Time</label>
                <input
                  type="datetime-local"
                  value={scheduledTime}
                  onChange={e => setScheduledTime(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Select Template</label>
              <select
                onChange={e => handleTemplateSelect(e.target.value)}
                defaultValue=""
                className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
              >
                <option value="" disabled>Choose Existing Template...</option>
                {templates.map(tpl => (
                  <option key={tpl.id} value={tpl.content}>{tpl.tempName} ({tpl.language})</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Title</label>
            <input
              type="text"
              placeholder="Message Subject / Heading"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Write Message</label>
            <textarea
              rows={4}
              placeholder="Type your message text here..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1">
              <span>{message.length} characters</span>
              <span className="text-indigo-600 cursor-pointer font-medium" onClick={() => setMessage(prev => prev + ' {{https://school.edu}}')}>
                + Insert Link Format
              </span>
            </div>
          </div>

          {/* Link helper banner matching UAB */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded text-blue-800 text-xs flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span>If you want to add a link in your message, use this format: <strong>{'{{https://example.com}}'}</strong></span>
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
            {sending ? 'Sending...' : `Send to ${parsedNumbers.length} Mobile Number(s)`}
          </button>
        </form>
      </div>
    </div>
  );
}
export default IndividualSmsPage;
