import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Home,
  CheckSquare,
  Square,
  Users,
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';

const MOCK_CLASSES = ['All Classes', 'Nursery', 'LKG', 'UKG', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI - SCI', 'XII - SCI'];
const MOCK_SECTIONS = ['All Sections', 'A', 'B', 'C'];

const SAMPLE_STUDENTS = [
  { id: '1', admNo: 'ADM-2024-001', name: 'DEMO TEST STUDENT', className: 'I', section: 'A', father: 'TEST GUARDIAN', phone: '7891008092' }
];

export function StudentSmsPage({ onNavigate }) {
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [selectedSection, setSelectedSection] = useState('All Sections');
  const [messageType, setMessageType] = useState('Text'); // 'Text' or 'WhatsApp'
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [templates, setTemplates] = useState([]);
  const [balance, setBalance] = useState({ textSms: 4500, whatsapp: 2200 });
  const [selectedStudentIds, setSelectedStudentIds] = useState(SAMPLE_STUDENTS.map(s => s.id));
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

  const handleTemplateSelect = (tplContent) => {
    setMessage(tplContent);
  };

  const filteredStudents = SAMPLE_STUDENTS.filter(s => {
    const classMatch = selectedClass === 'All Classes' || s.className === selectedClass;
    const secMatch = selectedSection === 'All Sections' || s.section === selectedSection;
    return classMatch && secMatch;
  });

  const toggleSelectAll = () => {
    if (selectedStudentIds.length === filteredStudents.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(filteredStudents.map(s => s.id));
    }
  };

  const toggleStudent = (id) => {
    setSelectedStudentIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error('Please enter message text to send');
      return;
    }
    if (selectedStudentIds.length === 0) {
      toast.error('Please select at least one student recipient');
      return;
    }

    setSending(true);
    try {
      const res = await fetch('/api/sms/send-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classes: [selectedClass],
          sections: [selectedSection],
          title,
          message,
          messageType,
          recipientCount: selectedStudentIds.length,
          phone: '7891008092'
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message || 'SMS broadcast dispatched successfully!');
        setMessage('');
        setTitle('');
        // Refresh balance
        fetch('/api/sms/balance').then(r => r.json()).then(b => { if (b.success) setBalance(b.data); });
      } else {
        toast.error(data.message || 'Failed to dispatch SMS');
      }
    } catch {
      toast.error('Network error while dispatching SMS');
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
            <MessageSquare className="w-6 h-6 text-indigo-600" />
            Student SMS
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span
              className="flex items-center gap-1 hover:text-indigo-600 cursor-pointer"
              onClick={() => onNavigate && onNavigate('/')}
            >
              <Home className="w-3.5 h-3.5" /> School
            </span>
            <span>/</span>
            <span className="text-indigo-600 font-semibold">Student SMS</span>
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
        {/* Left Form Panel */}
        <div className="lg:col-span-5 bg-white p-5 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            Compose Student Broadcast
          </h2>

          <form onSubmit={handleSend} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Class</label>
                <select
                  value={selectedClass}
                  onChange={e => setSelectedClass(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {MOCK_CLASSES.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Section</label>
                <select
                  value={selectedSection}
                  onChange={e => setSelectedSection(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {MOCK_SECTIONS.map(sec => (
                    <option key={sec} value={sec}>{sec}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Select Template (Autocomplete)</label>
              <select
                onChange={e => handleTemplateSelect(e.target.value)}
                defaultValue=""
                className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
              >
                <option value="" disabled>Start typing / choose template...</option>
                {templates.map(tpl => (
                  <option key={tpl.id} value={tpl.content}>{tpl.tempName} ({tpl.language})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Title</label>
              <input
                type="text"
                placeholder="Message Subject / Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Write Message</label>
              <textarea
                rows={4}
                placeholder="Type your message here..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1">
                <span>{message.length} characters (1 credit = 160 chars)</span>
                <span className="text-indigo-600 cursor-pointer font-medium" onClick={() => setMessage(prev => prev + ' [NAME]')}>
                  + Insert [NAME]
                </span>
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

            {/* Note banner matching UAB */}
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded text-rose-700 text-xs font-medium flex items-center gap-2">
              <Info className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>Note: [NAME] = Student Name</span>
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {sending ? 'Sending...' : `Send to ${selectedStudentIds.length} Student(s)`}
            </button>
          </form>
        </div>

        {/* Right Preview Table Panel */}
        <div className="lg:col-span-7 bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <Users className="w-4 h-4 text-indigo-600" />
              Target Student Recipients ({filteredStudents.length})
            </div>
            <button
              type="button"
              onClick={toggleSelectAll}
              className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              {selectedStudentIds.length === filteredStudents.length ? (
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

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-2 px-3 w-10 text-center">✓</th>
                  <th className="py-2 px-3">SR/ADM NO.</th>
                  <th className="py-2 px-3">NAME</th>
                  <th className="py-2 px-3">CLASS</th>
                  <th className="py-2 px-3">FATHER</th>
                  <th className="py-2 px-3">PHONE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map(student => {
                  const isSelected = selectedStudentIds.includes(student.id);
                  return (
                    <tr
                      key={student.id}
                      onClick={() => toggleStudent(student.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-indigo-50/50' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="py-2 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}} // handled by row click
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="py-2 px-3 font-mono text-indigo-600 text-[11px]">{student.admNo}</td>
                      <td className="py-2 px-3 font-bold text-slate-800">{student.name}</td>
                      <td className="py-2 px-3 text-slate-600">{student.className} - {student.section}</td>
                      <td className="py-2 px-3 text-slate-600">{student.father}</td>
                      <td className="py-2 px-3 font-mono text-slate-700">{student.phone}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
            <span>Selected Recipients: <strong className="text-indigo-600">{selectedStudentIds.length}</strong> of {filteredStudents.length}</span>
            <span>Est. Credit Deduction: <strong>{selectedStudentIds.length} Credits</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
export default StudentSmsPage;
