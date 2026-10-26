import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { PageHeader } from '../../components/erp/PagePrimitives';
import {
  QrCode,
  Trash2,
  X,
  Send,
  CheckCheck,
  RefreshCw,
  FileText,
  Calendar,
  DollarSign,
  Copy,
  CheckCircle2,
  LogOut,
  Smartphone,
  AlertCircle,
  GraduationCap,
  UserCheck,
  Search,
  Users,
  ShieldCheck,
  Building2,
  Sparkles
} from 'lucide-react';

const STORAGE_KEY = 'school_whatsapp_session';
const LOGS_STORAGE_KEY = 'school_whatsapp_test_logs';

const SAMPLE_TEMPLATES = [
  {
    id: 'absent',
    title: 'Absent Alert',
    module: 'Attendance',
    icon: Calendar,
    message: 'Dear Parent, Your ward Rahul Sharma (Class 8-A, Roll: 14) is marked ABSENT today. If this is an uninformed absence, please contact school desk immediately.',
  },
  {
    id: 'fee',
    title: 'Fee Receipt',
    module: 'Fees',
    icon: DollarSign,
    message: 'Dear Parent, Fee payment of ₹8,500 has been received successfully for Aditi Verma (Class 10-B). Receipt No: #REC-2026-904. Thank you, J D International School.',
  },
  {
    id: 'marksheet',
    title: 'Marksheet PDF',
    module: 'Examinations',
    icon: FileText,
    message: 'Dear Parent, Term-1 Examination Progress Report Card for Priya Sen (Class 10-A) is published. Click here to download verified digital Marksheet: https://jdischool.edu.in/marksheet/2026/jd-8049',
  },
  {
    id: 'custom',
    title: 'Custom',
    module: 'Manual',
    icon: Send,
    message: 'Greetings from J D International School! This is a test message sent directly from your connected WhatsApp instance.',
  }
];

export function WhatsappQrPage() {
  // Session State
  const [session, setSession] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      loggedIn: false,
      phone: '',
      accountName: '',
      instanceId: '',
      accessToken: '',
      status: 'Disconnected',
      connectedAt: null,
    };
  });

  const isActive = session.loggedIn && session.status === 'Connected';

  // Modal & Loading States
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [liveQr, setLiveQr] = useState(null);
  const [isQrLoading, setIsQrLoading] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [showConfirmDisconnect, setShowConfirmDisconnect] = useState(false);

  // Test sandbox fields
  const [recipientType, setRecipientType] = useState('student'); // 'student' | 'staff' | 'manual'
  const [studentsList, setStudentsList] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [searchContactQuery, setSearchContactQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [testPhone, setTestPhone] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('absent');
  const [testMessageText, setTestMessageText] = useState(SAMPLE_TEMPLATES[0].message);
  const [isSending, setIsSending] = useState(false);

  // Fetch Students & Staff Contacts for Auto-fill
  useEffect(() => {
    fetch('http://localhost:5000/api/students')
      .then((r) => r.json())
      .then((d) => {
        const list = Array.isArray(d) ? d : (d.data || []);
        setStudentsList(list);
        if (list.length > 0) {
          const s = list[0];
          const phone = '7891008092';
          setTestPhone(phone);
          setSelectedContact({
            type: 'student',
            name: `${s.firstName || ''} ${s.lastName || ''}`.trim(),
            parentName: s.fatherName || 'Parent',
            className: `${s.className || ''}-${s.section || ''}`,
            phone,
          });
          setTestMessageText(
            `Dear Parent, Your ward ${s.firstName} ${s.lastName || ''} (Class ${s.className}-${s.section}) is marked ABSENT today. If this is an uninformed absence, please contact school desk immediately.`
          );
        }
      })
      .catch(() => {});

    fetch('http://localhost:5000/api/user-management/users')
      .then((r) => r.json())
      .then((d) => {
        const list = Array.isArray(d) ? d : (d.data || []);
        setStaffList(list);
      })
      .catch(() => {});
  }, []);

  const applyTemplateToContact = (templateId, contact = selectedContact) => {
    setSelectedTemplateId(templateId);
    if (!contact) {
      const defaultTpl = SAMPLE_TEMPLATES.find((t) => t.id === templateId);
      if (defaultTpl) setTestMessageText(defaultTpl.message);
      return;
    }

    if (contact.type === 'student') {
      const sName = contact.name || 'Student';
      const cName = contact.className || 'Class';
      const pName = contact.parentName || 'Parent';

      if (templateId === 'absent') {
        setTestMessageText(`Dear Parent, Your ward ${sName} (${cName}) is marked ABSENT today. If this is an uninformed absence, please contact school desk immediately.`);
      } else if (templateId === 'fee') {
        setTestMessageText(`Dear ${pName}, Fee payment of ₹8,500 has been received successfully for ${sName} (${cName}). Receipt No: #REC-2026-904. Thank you, J D International School.`);
      } else if (templateId === 'marksheet') {
        setTestMessageText(`Dear Parent, Term-1 Examination Progress Report Card for ${sName} (${cName}) is published. Click here to download verified digital Marksheet: https://jdischool.edu.in/marksheet/2026/jd-8049`);
      } else {
        setTestMessageText(`Greetings from J D International School! This is an official notice regarding your ward ${sName} (${cName}).`);
      }
    } else if (contact.type === 'staff') {
      setTestMessageText(`Dear ${contact.name} (${contact.designation || 'Staff'}),\nThis is an official communication from J D International School administration desk regarding academic schedule.`);
    }
  };

  const [testLogs, setTestLogs] = useState(() => {
    try {
      const saved = localStorage.getItem(LOGS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'msg_init_01',
        recipient: '+91 7891008092',
        template: 'Absent Alert',
        message: 'Dear Parent, Your ward Rahul Sharma is marked ABSENT today.',
        time: 'Today, 02:30 PM',
        status: 'Delivered',
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }, [session]);

  useEffect(() => {
    localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(testLogs));
  }, [testLogs]);

  const fetchStatus = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/whatsapp/status');
      const data = await res.json();
      if (data.success && data.active && data.session?.loggedIn) {
        setSession(data.session);
        return data.session;
      } else if (data.success && !data.active) {
        setSession((prev) => ({
          ...prev,
          status: 'Disconnected',
          loggedIn: false,
        }));
      }
    } catch {}
    return null;
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!qrModalOpen) return;

    let isMounted = true;
    setIsQrLoading(true);

    const checkQr = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/whatsapp/qr');
        const data = await res.json();

        if (isMounted && data.success) {
          if (data.active && data.session?.loggedIn) {
            setSession(data.session);
            setQrModalOpen(false);
            toast.success(`WhatsApp successfully connected to ${data.session.phone}!`, {
              icon: '🎉',
              duration: 4000,
            });
            return;
          }

          if (data.qr) {
            setLiveQr(data.qr);
            setIsQrLoading(false);
          }
        }
      } catch {
        if (isMounted) setIsQrLoading(false);
      }
    };

    checkQr();
    const qrInterval = setInterval(checkQr, 2000);

    return () => {
      isMounted = false;
      clearInterval(qrInterval);
    };
  }, [qrModalOpen]);

  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    try {
      const res = await fetch('http://localhost:5000/api/whatsapp/logout', {
        method: 'POST',
      });
      const data = await res.json();

      if (data.success) {
        const clearedSession = {
          loggedIn: false,
          phone: '',
          accountName: '',
          instanceId: '',
          accessToken: '',
          status: 'Disconnected',
          connectedAt: null,
        };
        setSession(clearedSession);
        setShowConfirmDisconnect(false);
        setLiveQr(null);
        toast.success('WhatsApp session disconnected successfully!');
      } else {
        toast.error('Failed to disconnect WhatsApp session');
      }
    } catch {
      toast.error('Error contacting backend server.');
    } finally {
      setIsDisconnecting(false);
    }
  };

  const handleSendTestMessage = async (e) => {
    e.preventDefault();

    if (!testPhone.trim()) {
      toast.error('Please enter a recipient 10-digit mobile number.');
      return;
    }

    if (!testMessageText.trim()) {
      toast.error('Message text cannot be empty.');
      return;
    }

    setIsSending(true);

    let currentSession = session;
    if (!currentSession.loggedIn || currentSession.status !== 'Connected') {
      const fresh = await fetchStatus();
      if (fresh) currentSession = fresh;
    }

    if (!currentSession.loggedIn || currentSession.status !== 'Connected') {
      setIsSending(false);
      toast.error('WhatsApp device is not linked. Please scan QR code first!', {
        icon: '⚠️'
      });
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: testPhone, message: testMessageText }),
      });
      const data = await res.json();
      setIsSending(false);

      if (data.success) {
        const newLog = {
          id: `msg_${Date.now()}`,
          recipient: data.recipient || (testPhone.startsWith('+91') ? testPhone : `+91 ${testPhone}`),
          template: SAMPLE_TEMPLATES.find((t) => t.id === selectedTemplateId)?.title || 'Custom',
          message: testMessageText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }),
          status: 'Delivered',
        };
        setTestLogs((prev) => [newLog, ...prev.slice(0, 9)]);
        toast.success(`Message sent live to ${newLog.recipient}!`, {
          icon: '✅',
          duration: 4000,
        });
      } else {
        toast.error(data.error || 'Failed to dispatch live message');
      }
    } catch {
      setIsSending(false);
      toast.error('Could not connect to WhatsApp backend server.');
    }
  };

  const copyToken = () => {
    if (session.accessToken) {
      navigator.clipboard.writeText(session.accessToken);
      toast.success('Access Token copied to clipboard!');
    }
  };

  return (
    <div className="space-y-3 max-w-6xl mx-auto pt-0 pb-12 px-2 sm:px-4 text-slate-800">
      {/* 1:1 Test Master Pro Page Header */}
      <PageHeader
        title="WhatsApp Gateway & Cloud Integration"
        description="Link school official WhatsApp device via Baileys QR for automated attendance, fee receipts, and marksheet delivery."
      >
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
          isActive
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : 'bg-slate-100 text-slate-600 border-slate-200'
        }`}>
          <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
          <span>{isActive ? 'Live Connected' : 'Device Disconnected'}</span>
        </span>
      </PageHeader>

      <div className="space-y-4">
        {/* Device Status Card */}
        <div className="bg-white rounded-xl shadow-2xs hover:shadow-xs border border-slate-200/90 overflow-hidden">
          <div className="px-4 sm:px-5 py-3 bg-gradient-to-r from-emerald-50/80 via-teal-50/30 to-white border-b border-emerald-100 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                📱
              </div>
              <span className="text-xs font-bold text-slate-900 tracking-tight uppercase">
                Connected WhatsApp Instance
              </span>
            </div>
            {isActive && (
              <span className="text-[11px] text-slate-500 font-medium">
                Last synced: Just now
              </span>
            )}
          </div>

          {isActive ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse table-fixed min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50/90 text-slate-600 font-bold text-[11px] border-b border-slate-200 uppercase tracking-wider">
                    <th className="py-2.5 px-5 text-center w-[22%]">Phone Number</th>
                    <th className="py-2.5 px-5 text-center w-[20%]">Instance ID</th>
                    <th className="py-2.5 px-5 text-center w-[25%]">Access Token</th>
                    <th className="py-2.5 px-5 text-center w-[18%]">Status</th>
                    <th className="py-2.5 px-5 text-center w-[15%]">Action</th>
                  </tr>
                </thead>
                <tbody className="text-xs text-slate-700">
                  <tr className="text-center h-16 border-b border-slate-100 hover:bg-slate-50/40 transition-colors">
                    {/* Logged In Phone */}
                    <td className="py-3 px-5 font-semibold">
                      <div className="flex flex-col items-center justify-center">
                        <div className="flex items-center space-x-1.5 text-emerald-700 font-bold text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{session.phone}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-normal">
                          {session.accountName || 'School Official WhatsApp'}
                        </span>
                      </div>
                    </td>

                    {/* Instance ID */}
                    <td className="py-3 px-5 font-mono text-slate-800 font-semibold">
                      {session.instanceId || 'INST-JD-725239'}
                    </td>

                    {/* Access Token */}
                    <td className="py-3 px-5 font-mono text-slate-600">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="select-all text-slate-600">
                          {session.accessToken ? `${session.accessToken.substring(0, 10)}••••••••` : 'wa_sec_live_••••'}
                        </span>
                        <button
                          type="button"
                          onClick={copyToken}
                          title="Copy Full Access Token"
                          className="p-1 text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-5">
                      <div className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full inline-flex items-center space-x-1.5 font-bold text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>Connected</span>
                      </div>
                    </td>

                    {/* Action: Clear Disconnect Button */}
                    <td className="py-3 px-5">
                      <button
                        type="button"
                        onClick={() => setShowConfirmDisconnect(true)}
                        className="px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50/50 hover:bg-rose-100 text-rose-600 text-xs font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Disconnect</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center flex flex-col items-center justify-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
                <Smartphone className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="font-bold text-sm text-slate-800">No WhatsApp Device Connected</h3>
              <p className="text-xs text-slate-500 max-w-md leading-relaxed">
                Link your school smartphone to enable automated attendance notifications, fee receipts, and marksheet PDF delivery to parents.
              </p>
              <button
                type="button"
                onClick={() => setQrModalOpen(true)}
                className="mt-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
              >
                <QrCode className="w-4 h-4" />
                <span>Scan QR Code to Connect</span>
              </button>
            </div>
          )}
        </div>

        {/* Live Test Messenger Sandbox */}
        <div className="bg-white rounded-xl shadow-2xs hover:shadow-xs border border-slate-200/90 p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-slate-900 tracking-tight">Test Live WhatsApp Delivery</h3>
                <p className="text-[11px] text-slate-500">Verify real-time delivery from linked school number</p>
              </div>
            </div>
            <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold border ${
              isActive
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}>
              {isActive ? '● Socket Active' : '○ Standby'}
            </span>
          </div>

          <form onSubmit={handleSendTestMessage} className="space-y-4">
            {/* Preset Templates */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                Choose Template:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {SAMPLE_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => applyTemplateToContact(tpl.id)}
                    className={`text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                      selectedTemplateId === tpl.id
                        ? 'border-indigo-600 bg-indigo-50/70 font-bold text-indigo-950 shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50/50'
                    }`}
                  >
                    <div className="font-bold text-[11px] truncate">{tpl.module}</div>
                    <div className="text-[10px] text-slate-500 truncate">{tpl.title}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Target Audience Switcher */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                Select Recipient:
              </label>
              <div className="flex gap-2">
                {[
                  { id: 'student', label: 'Student / Parent', icon: GraduationCap },
                  { id: 'staff', label: 'Teacher / Staff', icon: UserCheck },
                  { id: 'manual', label: 'Direct Mobile No', icon: Smartphone },
                ].map((t) => {
                  const Icon = t.icon;
                  const active = recipientType === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setRecipientType(t.id);
                        setSelectedContact(null);
                        setSearchContactQuery('');
                        setIsDropdownOpen(false);
                      }}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        active
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 shadow-2xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-slate-50/50'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${active ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Contact Search or Manual Input */}
            {recipientType === 'student' && (
              <div className="relative">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Search &amp; Fetch Student / Parent Contact:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchContactQuery}
                    onFocus={() => setIsDropdownOpen(true)}
                    onChange={(e) => {
                      setSearchContactQuery(e.target.value);
                      setIsDropdownOpen(true);
                    }}
                    placeholder="Search by student name, father name, class (e.g. Aaditya, Choudhary, Class I)..."
                    className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 bg-slate-50/50 focus:bg-white"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  {selectedContact && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedContact(null);
                        setSearchContactQuery('');
                        setTestPhone('');
                      }}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Selected Contact Chip Preview */}
                {selectedContact && (
                  <div className="mt-2 p-2.5 rounded-lg bg-emerald-50/80 border border-emerald-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <span className="font-bold text-slate-800">{selectedContact.name}</span>
                        <span className="text-slate-500 text-[11px] ml-2">Class: {selectedContact.className}</span>
                        <span className="text-slate-500 text-[11px] ml-2">• Parent: {selectedContact.parentName}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-emerald-800 font-bold bg-white px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                        📱 +91 {selectedContact.phone}
                      </span>
                    </div>
                  </div>
                )}

                {/* Autocomplete Dropdown List */}
                {isDropdownOpen && (
                  <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-52 overflow-y-auto divide-y divide-slate-100">
                    {studentsList
                      .filter((s) => {
                        if (!searchContactQuery.trim()) return true;
                        const q = searchContactQuery.toLowerCase();
                        const fullName = `${s.firstName || ''} ${s.lastName || ''}`.toLowerCase();
                        const father = (s.fatherName || '').toLowerCase();
                        const cls = `${s.className || ''}-${s.section || ''}`.toLowerCase();
                        const phone = String(s.smsWhatsappNo || s.fatherMobile || '');
                        return fullName.includes(q) || father.includes(q) || cls.includes(q) || phone.includes(q);
                      })
                      .slice(0, 10)
                      .map((s) => {
                        const sName = `${s.firstName || ''} ${s.lastName || ''}`.trim();
                        const phone = '7891008092';
                        return (
                          <div
                            key={s.id || s._id}
                            onClick={() => {
                              const contactObj = {
                                type: 'student',
                                name: sName,
                                parentName: s.fatherName || 'Parent',
                                className: `${s.className || ''}-${s.section || ''}`,
                                phone,
                              };
                              setSelectedContact(contactObj);
                              setTestPhone(phone);
                              setSearchContactQuery(sName);
                              setIsDropdownOpen(false);
                              applyTemplateToContact(selectedTemplateId, contactObj);
                              toast.success(`Selected ${sName} (Parent: ${contactObj.parentName})`);
                            }}
                            className="p-2.5 hover:bg-slate-50 cursor-pointer flex items-center justify-between text-xs transition-colors"
                          >
                            <div>
                              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                                <span>{sName}</span>
                                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-normal">
                                  Class {s.className}-{s.section}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-500">
                                Parent: <span className="font-medium text-slate-700">{s.fatherName || 'Not specified'}</span>
                              </div>
                            </div>
                            <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-semibold">
                              +91 {phone}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            )}

            {recipientType === 'staff' && (
              <div className="relative">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Search &amp; Fetch Teacher / Staff Contact:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchContactQuery}
                    onFocus={() => setIsDropdownOpen(true)}
                    onChange={(e) => {
                      setSearchContactQuery(e.target.value);
                      setIsDropdownOpen(true);
                    }}
                    placeholder="Search by teacher name, designation, department (e.g. Pooja, Faculty, Academics)..."
                    className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 bg-slate-50/50 focus:bg-white"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  {selectedContact && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedContact(null);
                        setSearchContactQuery('');
                        setTestPhone('');
                      }}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Selected Staff Chip Preview */}
                {selectedContact && (
                  <div className="mt-2 p-2.5 rounded-lg bg-indigo-50/80 border border-indigo-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                      <div>
                        <span className="font-bold text-slate-800">{selectedContact.name}</span>
                        <span className="text-slate-500 text-[11px] ml-2">• {selectedContact.designation}</span>
                      </div>
                    </div>
                    <span className="font-mono text-indigo-800 font-bold bg-white px-2 py-0.5 rounded border border-indigo-200 text-[11px]">
                      📱 +91 {selectedContact.phone}
                    </span>
                  </div>
                )}

                {/* Autocomplete Dropdown List */}
                {isDropdownOpen && (
                  <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-52 overflow-y-auto divide-y divide-slate-100">
                    {staffList
                      .filter((st) => {
                        if (!searchContactQuery.trim()) return true;
                        const q = searchContactQuery.toLowerCase();
                        const sName = (st.displayName || st.name || '').toLowerCase();
                        const des = (st.designation || st.role || '').toLowerCase();
                        const dept = (st.department || '').toLowerCase();
                        const ph = String(st.phone || '');
                        return sName.includes(q) || des.includes(q) || dept.includes(q) || ph.includes(q);
                      })
                      .slice(0, 10)
                      .map((st) => {
                        const sName = st.displayName || st.name || 'Staff Member';
                        const phone = '7891008092';
                        return (
                          <div
                            key={st.id || st._id}
                            onClick={() => {
                              const contactObj = {
                                type: 'staff',
                                name: sName,
                                designation: st.designation || st.role || 'Faculty',
                                phone,
                              };
                              setSelectedContact(contactObj);
                              setTestPhone(phone);
                              setSearchContactQuery(sName);
                              setIsDropdownOpen(false);
                              applyTemplateToContact(selectedTemplateId, contactObj);
                              toast.success(`Selected ${sName} (${contactObj.designation})`);
                            }}
                            className="p-2.5 hover:bg-slate-50 cursor-pointer flex items-center justify-between text-xs transition-colors"
                          >
                            <div>
                              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                                <span>{sName}</span>
                                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-normal">
                                  {st.designation || st.role}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-500">
                                Dept: <span className="font-medium text-slate-700">{st.department || 'School Staff'}</span>
                              </div>
                            </div>
                            <span className="font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[11px] font-semibold">
                              +91 {phone}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Recipient Phone (Editable) */}
              <div className="md:col-span-5">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Recipient Mobile Number:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    placeholder="7891008092"
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 font-mono bg-slate-50/50 focus:bg-white font-bold"
                  />
                  <span className="absolute right-3 top-2 text-[10px] text-slate-400 font-medium">
                    10-digit mobile
                  </span>
                </div>
              </div>

              {/* Message Body */}
              <div className="md:col-span-7">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Message Content:
                </label>
                <textarea
                  rows={3}
                  value={testMessageText}
                  onChange={(e) => setTestMessageText(e.target.value)}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 leading-relaxed bg-slate-50/50 focus:bg-white"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={isSending || !isActive}
                className={`px-6 py-2.5 rounded-lg text-xs font-bold text-white shadow-xs flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-emerald-600 hover:bg-emerald-700 cursor-pointer active:scale-95'
                    : 'bg-slate-300 cursor-not-allowed'
                }`}
              >
                {isSending ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Sending WhatsApp...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Live WhatsApp</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Recent Delivery Logs */}
          <div className="border-t border-slate-100 pt-3 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Recent Dispatches
            </span>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {testLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] flex justify-between items-center"
                >
                  <div className="truncate pr-2">
                    <strong className="text-slate-800">{log.recipient}</strong>
                    <span className="text-slate-400 mx-1.5">|</span>
                    <span className="text-slate-600">{log.message}</span>
                  </div>
                  <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[10px] shrink-0 font-semibold flex items-center gap-1">
                    <CheckCheck className="w-3 h-3 text-emerald-600" />
                    <span>{log.status}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal: Disconnect WhatsApp */}
      {showConfirmDisconnect && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-bold text-base text-slate-800">Disconnect WhatsApp?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to disconnect <strong>{session.phone}</strong>? Outgoing automated alerts (Attendance, Fees, Marksheets) will be paused until reconnected.
              </p>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmDisconnect(false)}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDisconnecting}
                onClick={handleDisconnect}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isDisconnecting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Disconnecting...</span>
                  </>
                ) : (
                  <span>Yes, Disconnect</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clean QR Scan Modal */}
      {qrModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center space-y-4 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setQrModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="w-10 h-10 rounded-full bg-[#25d366]/10 text-[#25d366] flex items-center justify-center mx-auto mb-2">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12.001 2.002c-5.522 0-9.999 4.477-9.999 9.999 0 1.763.456 3.42 1.254 4.863l-1.256 4.606 4.735-1.242c1.393.754 2.979 1.173 4.666 1.173 5.522 0 9.999-4.477 9.999-9.999s-4.477-10-9.999-10zm5.836 14.154c-.244.686-1.233 1.258-1.789 1.341-.519.077-1.189.109-3.486-.843-2.673-1.109-4.385-3.83-4.518-4.009-.133-.178-1.077-1.433-1.077-2.733 0-1.3.686-1.942.93-2.208.244-.266.533-.333.71-.333.178 0 .355.002.511.01.166.009.388-.063.609.467.244.577.822 2.019.889 2.164.067.144.111.311.022.489-.089.178-.133.289-.267.444-.133.155-.278.344-.4.466-.133.133-.272.278-.117.544.155.266.69 1.133 1.48 1.834 1.017.904 1.874 1.185 2.14 1.318.266.133.422.111.577-.067.155-.178.666-.777.844-1.043.178-.266.355-.222.6-.133.244.089 1.555.733 1.821.866.266.133.444.2.511.311.066.111.066.644-.178 1.33z" />
                </svg>
              </div>
              <h3 className="font-bold text-base text-slate-800">Scan QR Code</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Link official school WhatsApp account
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 text-left text-xs text-slate-600 space-y-1.5 border border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0">1</span>
                <span>Open <strong>WhatsApp</strong> on your school smartphone</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0">2</span>
                <span>Tap <strong>Menu (⋮)</strong> &gt; <strong>Linked Devices</strong> &gt; <strong>Link a Device</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0">3</span>
                <span>Point your phone camera to this QR code</span>
              </div>
            </div>

            <div className="relative w-52 h-52 mx-auto bg-white border border-slate-200 rounded-xl p-2.5 flex items-center justify-center shadow-inner">
              {liveQr ? (
                <img
                  src={liveQr}
                  alt="Live WhatsApp QR Code"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-3 text-center space-y-1.5">
                  <RefreshCw className="w-6 h-6 text-emerald-600 animate-spin" />
                  <p className="text-xs font-semibold text-slate-700">Connecting Socket...</p>
                  <p className="text-[10px] text-slate-400">Loading handshake QR</p>
                </div>
              )}
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Waiting for WhatsApp scan...</span>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setQrModalOpen(false)}
                className="w-full py-2 rounded-xl text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors font-medium cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WhatsappQrPage;
