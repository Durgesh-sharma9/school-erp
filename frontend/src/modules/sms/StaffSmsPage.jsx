import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Home,
  CheckSquare,
  Square,
  Users,
  Briefcase,
  Info
} from 'lucide-react';
import toast from 'react-hot-toast';

const MOCK_BRANCHES = ['All Branches', 'Main Campus', 'City Branch'];
const MOCK_DEPTS = ['All Departments', 'Teaching', 'Administration', 'Accounts', 'Transport', 'Library'];
const MOCK_DESIGS = ['All Designations', 'Principal', 'Vice Principal', 'PGT', 'TGT', 'PRT', 'Accountant', 'Librarian', 'Office Assistant'];

const SAMPLE_STAFF = [
  { id: '1', empCode: 'EMP-001', name: 'RAJESH SHARMA', department: 'Administration', designation: 'Principal', phone: '9999900001' },
  { id: '2', empCode: 'EMP-002', name: 'SUNITA VERMA', department: 'Teaching', designation: 'PGT English', phone: '9999900002' },
  { id: '3', empCode: 'EMP-003', name: 'VIKRAM CHOUDHARY', department: 'Teaching', designation: 'TGT Mathematics', phone: '9999900003' },
  { id: '4', empCode: 'EMP-004', name: 'ANIL GUPTA', department: 'Accounts', designation: 'Accountant', phone: '9999900004' },
  { id: '5', empCode: 'EMP-005', name: 'SURESH JOSHI', department: 'Library', designation: 'Librarian', phone: '9999900005' }
];

export function StaffSmsPage({ onNavigate }) {
  const [selectedBranch, setSelectedBranch] = useState('All Branches');
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [selectedDesig, setSelectedDesig] = useState('All Designations');
  const [messageType, setMessageType] = useState('Text');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [templates, setTemplates] = useState([]);
  const [balance, setBalance] = useState({ textSms: 4500, whatsapp: 2200 });
  const [selectedStaffIds, setSelectedStaffIds] = useState(SAMPLE_STAFF.map(s => s.id));
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

  const filteredStaff = SAMPLE_STAFF.filter(s => {
    const deptMatch = selectedDept === 'All Departments' || s.department === selectedDept;
    const desigMatch = selectedDesig === 'All Designations' || s.designation.includes(selectedDesig);
    return deptMatch && desigMatch;
  });

  const toggleSelectAll = () => {
    if (selectedStaffIds.length === filteredStaff.length) {
      setSelectedStaffIds([]);
    } else {
      setSelectedStaffIds(filteredStaff.map(s => s.id));
    }
  };

  const toggleStaff = (id) => {
    setSelectedStaffIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error('Please enter message text to send');
      return;
    }
    if (selectedStaffIds.length === 0) {
      toast.error('Please select at least one staff recipient');
      return;
    }

    setSending(true);
    try {
      const res = await fetch('/api/sms/send-staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branches: [selectedBranch],
          departments: [selectedDept],
          designations: [selectedDesig],
          title,
          message,
          messageType,
          recipientCount: selectedStaffIds.length
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message || 'Staff SMS dispatched successfully!');
        setMessage('');
        setTitle('');
        fetch('/api/sms/balance').then(r => r.json()).then(b => { if (b.success) setBalance(b.data); });
      } else {
        toast.error(data.message || 'Failed to dispatch staff SMS');
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
            <Briefcase className="w-6 h-6 text-indigo-600" />
            Staff SMS
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span
              className="flex items-center gap-1 hover:text-indigo-600 cursor-pointer"
              onClick={() => onNavigate && onNavigate('/')}
            >
              <Home className="w-3.5 h-3.5" /> School
            </span>
            <span>/</span>
            <span className="text-indigo-600 font-semibold">Staff SMS</span>
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
            <MessageSquare className="w-4 h-4 text-indigo-600" />
            Compose Staff Broadcast
          </h2>

          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Branch</label>
              <select
                value={selectedBranch}
                onChange={e => setSelectedBranch(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {MOCK_BRANCHES.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Department</label>
                <select
                  value={selectedDept}
                  onChange={e => setSelectedDept(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {MOCK_DEPTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Designation</label>
                <select
                  value={selectedDesig}
                  onChange={e => setSelectedDesig(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {MOCK_DESIGS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Select Template</label>
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
                placeholder="Staff Notice Title / Topic"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Write Message</label>
              <textarea
                rows={4}
                placeholder="Write your staff announcement or notice here..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1">
                <span>{message.length} characters</span>
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

            <button
              type="submit"
              disabled={sending}
              className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {sending ? 'Sending...' : `Send to ${selectedStaffIds.length} Staff Member(s)`}
            </button>
          </form>
        </div>

        {/* Right Preview Table Panel */}
        <div className="lg:col-span-7 bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <Users className="w-4 h-4 text-indigo-600" />
              Target Staff Members ({filteredStaff.length})
            </div>
            <button
              type="button"
              onClick={toggleSelectAll}
              className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              {selectedStaffIds.length === filteredStaff.length ? (
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
                  <th className="py-2 px-3">EMP ID</th>
                  <th className="py-2 px-3">STAFF NAME</th>
                  <th className="py-2 px-3">DEPARTMENT</th>
                  <th className="py-2 px-3">DESIGNATION</th>
                  <th className="py-2 px-3">MOBILE NO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStaff.map(staff => {
                  const isSelected = selectedStaffIds.includes(staff.id);
                  return (
                    <tr
                      key={staff.id}
                      onClick={() => toggleStaff(staff.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-indigo-50/50' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="py-2 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="py-2 px-3 font-mono text-indigo-600 text-[11px]">{staff.empCode}</td>
                      <td className="py-2 px-3 font-bold text-slate-800">{staff.name}</td>
                      <td className="py-2 px-3 text-slate-600">{staff.department}</td>
                      <td className="py-2 px-3 text-slate-600">{staff.designation}</td>
                      <td className="py-2 px-3 font-mono text-slate-700">{staff.phone}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
            <span>Selected Recipients: <strong className="text-indigo-600">{selectedStaffIds.length}</strong> of {filteredStaff.length}</span>
            <span>Est. Credit Deduction: <strong>{selectedStaffIds.length} Credits</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
export default StaffSmsPage;
