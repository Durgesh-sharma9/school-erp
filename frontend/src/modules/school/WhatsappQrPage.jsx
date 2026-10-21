import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  QrCode,
  Plus,
  Trash2,
  X,
  Send,
  CheckCheck,
  Smartphone,
  RefreshCw,
  ShieldCheck,
  AlertCircle,
  MessageSquare,
  Clock,
  Power,
  FileText,
  Calendar,
  DollarSign,
  Copy,
  Info,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

const STORAGE_KEY = 'school_whatsapp_session';
const LOGS_STORAGE_KEY = 'school_whatsapp_test_logs';
const RULES_STORAGE_KEY = 'school_whatsapp_automation_rules';

const DEFAULT_RULES = {
  absentAlerts: true,
  feeReceipts: true,
  marksheetDispatch: true,
  holidayCirculars: true,
};

const SAMPLE_TEMPLATES = [
  {
    id: 'absent',
    title: 'Daily Absent Alert (Attendance)',
    module: 'Attendance',
    icon: Calendar,
    color: 'amber',
    message: 'Dear Parent, Your ward Rahul Sharma (Class 8-A, Roll: 14) is marked ABSENT today, 21-Oct-2026. If this is an uninformed absence, please contact school desk immediately.',
  },
  {
    id: 'fee',
    title: 'Fee Payment Receipt (Accounts)',
    module: 'Fees',
    icon: DollarSign,
    color: 'emerald',
    message: 'Dear Parent, Fee payment of ₹8,500 has been received successfully for Aditi Verma (Class 10-B). Receipt No: #REC-2026-904. Thank you, J D International School.',
  },
  {
    id: 'marksheet',
    title: 'Exam Marksheet PDF Link (Exam Studio)',
    module: 'Examinations',
    icon: FileText,
    color: 'indigo',
    message: 'Dear Parent, Term-1 Examination 2025-26 Progress Report Card for Priya Sen (Class 10-A) is published. Click here to download verified digital Marksheet: https://jdischool.edu.in/marksheet/2026/jd-8049',
  },
  {
    id: 'circular',
    title: 'School Notice / Circular (Announcements)',
    module: 'Circulars',
    icon: MessageSquare,
    color: 'sky',
    message: 'Dear Parents, Please note that the school will remain closed tomorrow on account of district administrative orders. Online classes will be conducted as per schedule.',
  },
  {
    id: 'custom',
    title: 'Custom Message',
    module: 'Manual',
    icon: Send,
    color: 'purple',
    message: 'Greetings from J D International School! This is a verification message sent directly from your connected WhatsApp instance.',
  }
];

export function WhatsappQrPage() {
  // Session State with localStorage persistence
  const [session, setSession] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      loggedIn: false,
      phone: '',
      accountName: '',
      instanceId: '',
      accessToken: '',
      status: 'Disconnected',
      connectedAt: null,
      deviceInfo: ''
    };
  });

  const isActive = session.loggedIn && session.status === 'Connected';

  // Automation Rules
  const [rules, setRules] = useState(() => {
    try {
      const saved = localStorage.getItem(RULES_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_RULES;
  });

  // Test Message Sandbox state
  const [testLogs, setTestLogs] = useState(() => {
    try {
      const saved = localStorage.getItem(LOGS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: 'msg_init_01',
        recipient: '+91 98290 54321',
        template: 'Absent Alert',
        message: 'Dear Parent, Your ward Rahul Sharma is marked ABSENT today.',
        time: 'Today, 09:35 AM',
        status: 'Delivered',
      }
    ];
  });

  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrTab, setQrTab] = useState('qr'); // 'qr' | 'code'
  const [qrCountdown, setQrCountdown] = useState(45);
  const [customPhone, setCustomPhone] = useState('98290 12345');
  const [customDeskName, setCustomDeskName] = useState('J D International School Desk');

  // Test sandbox fields
  const [testPhone, setTestPhone] = useState('98290 54321');
  const [selectedTemplateId, setSelectedTemplateId] = useState('absent');
  const [testMessageText, setTestMessageText] = useState(SAMPLE_TEMPLATES[0].message);
  const [isSending, setIsSending] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }, [session]);

  useEffect(() => {
    localStorage.setItem(RULES_STORAGE_KEY, JSON.stringify(rules));
  }, [rules]);

  useEffect(() => {
    localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(testLogs));
  }, [testLogs]);

  // Countdown timer for QR refresh
  useEffect(() => {
    if (!qrModalOpen) {
      setQrCountdown(45);
      return;
    }
    const timer = setInterval(() => {
      setQrCountdown((prev) => {
        if (prev <= 1) return 45;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [qrModalOpen]);

  // Handle template switch
  const handleTemplateSelect = (tplId) => {
    setSelectedTemplateId(tplId);
    const found = SAMPLE_TEMPLATES.find((t) => t.id === tplId);
    if (found) {
      setTestMessageText(found.message);
    }
  };

  // Connect Simulation
  const handleSimulateScan = () => {
    const formattedPhone = customPhone.startsWith('+91')
      ? customPhone
      : `+91 ${customPhone.trim()}`;

    const newSession = {
      loggedIn: true,
      phone: formattedPhone,
      accountName: customDeskName.trim() || 'School Reception Desk',
      instanceId: `INST-JD-${Math.floor(100000 + Math.random() * 900000)}`,
      accessToken: `wa_sec_live_${Math.random().toString(36).substring(2, 12)}${Math.random().toString(36).substring(2, 8)}`,
      status: 'Connected',
      connectedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
      deviceInfo: 'WhatsApp for Android (Verified Session)'
    };

    setSession(newSession);
    setQrModalOpen(false);
    toast.success(`WhatsApp successfully linked with ${formattedPhone}!`, {
      icon: '🟢',
      duration: 4000
    });
  };

  // Reset / Disconnect
  const handleReset = () => {
    if (!session.loggedIn) {
      toast('Instance is already disconnected', { icon: 'ℹ️' });
      return;
    }
    if (window.confirm('Are you sure you want to delete and reset the WhatsApp instance? Outgoing automated messages will be paused.')) {
      setSession({
        loggedIn: false,
        phone: '',
        accountName: '',
        instanceId: '',
        accessToken: '',
        status: 'Disconnected',
        connectedAt: null,
        deviceInfo: ''
      });
      toast.success('WhatsApp session disconnected and instance reset', {
        icon: '🗑️'
      });
    }
  };

  // Toggle Automation Rules
  const handleRuleToggle = (key) => {
    setRules((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      toast.success(
        `Automation rule "${key}" ${updated[key] ? 'ENABLED' : 'PAUSED'}`
      );
      return updated;
    });
  };

  // Send Test Message
  const handleSendTestMessage = (e) => {
    e.preventDefault();
    if (!session.loggedIn || session.status !== 'Connected') {
      toast.error('Cannot send: WhatsApp instance is disconnected. Please scan QR code first!', {
        icon: '⚠️'
      });
      return;
    }

    if (!testPhone.trim()) {
      toast.error('Please enter a recipient mobile number');
      return;
    }

    if (!testMessageText.trim()) {
      toast.error('Message body cannot be empty');
      return;
    }

    setIsSending(true);

    setTimeout(() => {
      setIsSending(false);
      const newLog = {
        id: `msg_${Date.now()}`,
        recipient: testPhone.startsWith('+91') ? testPhone : `+91 ${testPhone}`,
        template: SAMPLE_TEMPLATES.find((t) => t.id === selectedTemplateId)?.title || 'Custom',
        message: testMessageText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }),
        status: 'Delivered',
      };
      setTestLogs((prev) => [newLog, ...prev.slice(0, 9)]);
      toast.success(`Message successfully delivered to ${newLog.recipient}!`, {
        icon: '✅',
        duration: 3500
      });
    }, 800);
  };

  const copyToken = () => {
    if (session.accessToken) {
      navigator.clipboard.writeText(session.accessToken);
      toast.success('Access Token copied to clipboard!');
    }
  };

  return (
    <div className="bg-[#f3f4f6] min-h-screen text-slate-800 pb-16">
      {/* 1:1 UAB Exact Sticky Sub-Navbar */}
      <div className="bg-[#f8fafc] px-6 h-14 border-b border-slate-200 sticky top-0 left-0 flex justify-between items-center z-10 shadow-2xs">
        <div className="flex items-center space-x-3">
          {/* WhatsApp Brand Icon & Status */}
          <div className="flex items-center space-x-2 mr-2">
            <span className={`text-3xl ${isActive ? 'text-emerald-500' : 'text-rose-500'}`}>
              <svg
                className="w-7 h-7 fill-current transition-colors"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12.001 2.002c-5.522 0-9.999 4.477-9.999 9.999 0 1.763.456 3.42 1.254 4.863l-1.256 4.606 4.735-1.242c1.393.754 2.979 1.173 4.666 1.173 5.522 0 9.999-4.477 9.999-9.999s-4.477-10-9.999-10zm5.836 14.154c-.244.686-1.233 1.258-1.789 1.341-.519.077-1.189.109-3.486-.843-2.673-1.109-4.385-3.83-4.518-4.009-.133-.178-1.077-1.433-1.077-2.733 0-1.3.686-1.942.93-2.208.244-.266.533-.333.71-.333.178 0 .355.002.511.01.166.009.388-.063.609.467.244.577.822 2.019.889 2.164.067.144.111.311.022.489-.089.178-.133.289-.267.444-.133.155-.278.344-.4.466-.133.133-.272.278-.117.544.155.266.69 1.133 1.48 1.834 1.017.904 1.874 1.185 2.14 1.318.266.133.422.111.577-.067.155-.178.666-.777.844-1.043.178-.266.355-.222.6-.133.244.089 1.555.733 1.821.866.266.133.444.2.511.311.066.111.066.644-.178 1.33z" />
              </svg>
            </span>

            <span className="text-xs font-bold tracking-wide uppercase">
              <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
              {isActive ? 'Active' : 'In-Active'}
            </span>
          </div>

          {/* Circular Mini FAB 1: QR Scan (Indigo circle) */}
          <button
            type="button"
            onClick={() => setQrModalOpen(true)}
            title="Scan WhatsApp QR Code"
            className="w-9 h-9 rounded-full bg-[#5c67f6] hover:bg-[#4a55ea] text-white flex items-center justify-center shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-white" />
          </button>

          {/* Circular Mini FAB 2: Add */}
          <button
            type="button"
            onClick={() => {
              if (session.loggedIn) {
                toast.error('Maximum 1 active WhatsApp instance is allowed per school account.');
              } else {
                setQrModalOpen(true);
              }
            }}
            title={session.loggedIn ? 'Instance already configured' : 'Add New WhatsApp Instance'}
            className="w-9 h-9 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center cursor-pointer shadow-none transition-colors"
          >
            <Plus className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        {/* Quick summary info */}
        <div className="hidden md:flex items-center space-x-3 text-xs text-slate-600">
          <span className="font-medium">Gateway Protocol:</span>
          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono font-semibold border border-emerald-200">
            Multi-Device v2.24
          </span>
          <span className="text-slate-400">|</span>
          <span>School: <strong className="text-slate-800">J D International School</strong></span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">

        {/* 1:1 UAB Table Section */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-xs font-bold text-slate-700 tracking-wider uppercase flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-indigo-600" />
              Connected School Instance Details
            </h2>
            {isActive && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                Device Synchronized ({session.connectedAt || 'Active'})
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/90 text-slate-700 font-bold text-xs uppercase border-b border-slate-200">
                  <th className="py-3 px-4 text-center w-48">Logged In</th>
                  <th className="py-3 px-4 text-center">Instance ID</th>
                  <th className="py-3 px-4 text-center">Access Token</th>
                  <th className="py-3 px-4 text-center w-36">Status</th>
                  <th className="py-3 px-4 text-center w-28">Reset Instance</th>
                </tr>
              </thead>
              <tbody className="text-xs text-slate-700 divide-y divide-slate-100">
                <tr className="text-center hover:bg-slate-50/70 transition-colors">
                  {/* Logged In */}
                  <td className="py-4 px-4 font-semibold">
                    {session.loggedIn ? (
                      <div className="flex flex-col items-center justify-center">
                        <div className="flex items-center space-x-1.5 text-emerald-600 font-bold">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{session.phone || 'Connected'}</span>
                        </div>
                        {session.accountName && (
                          <span className="text-[11px] text-slate-500 font-normal mt-0.5">
                            {session.accountName}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400 font-mono">--</span>
                    )}
                  </td>

                  {/* Instance ID */}
                  <td className="py-4 px-4 font-mono font-medium text-slate-800">
                    {session.instanceId ? (
                      <span className="px-2.5 py-1 bg-slate-100 rounded text-indigo-700 font-semibold border border-slate-200">
                        {session.instanceId}
                      </span>
                    ) : (
                      <span className="text-slate-400 font-mono">--</span>
                    )}
                  </td>

                  {/* Access Token */}
                  <td className="py-4 px-4 font-mono text-slate-600">
                    {session.accessToken ? (
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-200 text-slate-700 select-all">
                          {session.accessToken.substring(0, 14)}••••••••••
                        </span>
                        <button
                          type="button"
                          onClick={copyToken}
                          title="Copy Full Access Token"
                          className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-400 font-mono">--</span>
                    )}
                  </td>

                  {/* Status Column */}
                  <td className="py-4 px-4">
                    {session.loggedIn && session.status === 'Connected' ? (
                      <div className="text-emerald-600 flex justify-center items-center space-x-1.5 font-bold">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 fill-current inline-block text-emerald-500"
                          viewBox="0 0 24 24"
                        >
                          <path d="M17 4h3v16h-3V4zM5 14h3v6H5v-6zm6-5h3v11h-3V9z" />
                        </svg>
                        <span>Connected</span>
                      </div>
                    ) : (
                      <div className="text-red-500 flex justify-center items-center space-x-1.5 font-bold">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 fill-current inline-block"
                          viewBox="0 0 24 24"
                        >
                          <path d="M17 4h3v16h-3V4zM5 14h3v6H5v-6zm6-5h3v11h-3V9z" />
                        </svg>
                        <span>Disconnected</span>
                      </div>
                    )}
                  </td>

                  {/* Reset Instance (Delete bin icon) */}
                  <td className="py-4 px-4">
                    <button
                      type="button"
                      onClick={handleReset}
                      title={session.loggedIn ? "Delete / Reset Instance" : "No active instance"}
                      disabled={!session.loggedIn}
                      className={`p-2 rounded-full transition-all inline-flex items-center justify-center ${
                        session.loggedIn
                          ? 'hover:bg-rose-50 text-slate-500 hover:text-rose-600 cursor-pointer shadow-2xs hover:scale-110'
                          : 'text-slate-300 cursor-not-allowed'
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 2-Column Grid: Test Sandbox + ERP Automation Triggers */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column (7 cols): Live WhatsApp Test Sandbox */}
          <div className="lg:col-span-7 bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-800">Send Test WhatsApp Message</h3>
                  <p className="text-[11px] text-slate-500">
                    Live interactive sandbox to verify WhatsApp delivery to any parent mobile number
                  </p>
                </div>
              </div>
              <span className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                {isActive ? '● Gateway Ready' : '○ Offline'}
              </span>
            </div>

            <form onSubmit={handleSendTestMessage} className="space-y-4">
              {/* Quick Template Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Choose ERP Message Template:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SAMPLE_TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => handleTemplateSelect(tpl.id)}
                      className={`text-left p-2 rounded-lg border text-xs transition-all ${
                        selectedTemplateId === tpl.id
                          ? 'border-indigo-600 bg-indigo-50/60 font-semibold text-indigo-900 shadow-2xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <tpl.icon className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span className="truncate">{tpl.module}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 truncate font-normal">
                        {tpl.title}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipient Phone Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Recipient Mobile No (Parent / Staff):
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-mono">
                    +91
                  </span>
                  <input
                    type="text"
                    value={testPhone.replace(/^\+91\s*/, '')}
                    onChange={(e) => setTestPhone(e.target.value)}
                    placeholder="98290 12345"
                    className="w-full pl-12 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                  />
                </div>
              </div>

              {/* Message Body */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  WhatsApp Message Body:
                </label>
                <textarea
                  rows={4}
                  value={testMessageText}
                  onChange={(e) => setTestMessageText(e.target.value)}
                  className="w-full p-3 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/30 font-sans leading-relaxed text-slate-800"
                />
              </div>

              {/* Send Button */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  E2E Encrypted via School Official SIM
                </span>

                <button
                  type="submit"
                  disabled={isSending || !isActive}
                  className={`px-5 py-2.5 rounded-lg text-xs font-bold text-white shadow-md flex items-center gap-2 transition-all ${
                    isActive
                      ? 'bg-[#5c67f6] hover:bg-[#4a55ea] active:scale-95 cursor-pointer'
                      : 'bg-slate-400 cursor-not-allowed opacity-80'
                  }`}
                >
                  {isSending ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Transmitting to Gateway...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Send Test WhatsApp
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Recent Transmissions Log */}
            <div className="border-t border-slate-100 pt-3">
              <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
                <span>Recent Gateway Dispatch Logs</span>
                <span className="text-[10px] text-slate-400 font-normal">Last 5 dispatches</span>
              </h4>

              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {testLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-start justify-between text-[11px] gap-2"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-800">{log.recipient}</span>
                        <span className="px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 font-semibold text-[10px]">
                          {log.template}
                        </span>
                        <span className="text-slate-400 text-[10px]">{log.time}</span>
                      </div>
                      <p className="text-slate-600 truncate mt-0.5">{log.message}</p>
                    </div>

                    <div className="shrink-0 flex items-center text-emerald-600 font-semibold gap-1 text-[10px]">
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>{log.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): ERP Automations & Practical Guide */}
          <div className="lg:col-span-5 space-y-6">

            {/* ERP Automation Triggers Card */}
            <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-800">ERP Automatic Triggers</h3>
                  <p className="text-[11px] text-slate-500">Modules configured to auto-dispatch via this WhatsApp link</p>
                </div>
                <Power className={`w-4 h-4 ${isActive ? 'text-emerald-500' : 'text-slate-300'}`} />
              </div>

              <div className="space-y-3">
                {/* Rule 1: Absent */}
                <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50/50">
                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 rounded-md bg-amber-100/70 text-amber-700 shrink-0">
                      <Calendar className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">Daily Absent Notification</div>
                      <div className="text-[11px] text-slate-500">Auto-sends at 09:30 AM to absent student parents</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRuleToggle('absentAlerts')}
                    className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                      rules.absentAlerts ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                  >
                    <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      rules.absentAlerts ? 'translate-x-5' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>

                {/* Rule 2: Fee Receipts */}
                <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50/50">
                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 rounded-md bg-emerald-100/70 text-emerald-700 shrink-0">
                      <DollarSign className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">Fee Receipts & Reminders</div>
                      <div className="text-[11px] text-slate-500">Instant PDF receipt on collection + due reminders</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRuleToggle('feeReceipts')}
                    className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                      rules.feeReceipts ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                  >
                    <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      rules.feeReceipts ? 'translate-x-5' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>

                {/* Rule 3: Marksheets */}
                <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50/50">
                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 rounded-md bg-indigo-100/70 text-indigo-700 shrink-0">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">Exam Marksheet Direct PDF Link</div>
                      <div className="text-[11px] text-slate-500">1-Click bulk WhatsApp dispatch from Marksheet Studio</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRuleToggle('marksheetDispatch')}
                    className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                      rules.marksheetDispatch ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                  >
                    <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      rules.marksheetDispatch ? 'translate-x-5' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>

                {/* Rule 4: Circulars */}
                <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50/50">
                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 rounded-md bg-sky-100/70 text-sky-700 shrink-0">
                      <MessageSquare className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">Emergency & Holiday Notices</div>
                      <div className="text-[11px] text-slate-500">Urgent broadcast announcements to all classes</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRuleToggle('holidayCirculars')}
                    className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                      rules.holidayCirculars ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                  >
                    <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      rules.holidayCirculars ? 'translate-x-5' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Setup Checklist */}
            <div className="bg-indigo-900 text-white rounded-xl shadow-xs p-5 space-y-3 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 text-indigo-800/40 pointer-events-none">
                <Smartphone className="w-32 h-32" />
              </div>

              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-200 flex items-center gap-2">
                <Info className="w-4 h-4" />
                How Schools Use This (Kaam Ki Baatein)
              </h4>

              <div className="space-y-2 text-xs text-indigo-100/90 leading-relaxed relative z-1">
                <p>
                  <strong>1. Zero DLT/SMS Cost:</strong> School ke official SIM number ko link karke unlimited WhatsApp messages free bheje jaate hain.
                </p>
                <p>
                  <strong>2. Trust & Branding:</strong> Parents ko message kisi anjaan 6-digit sender ID ki jagah School ke WhatsApp profile se milta hai.
                </p>
                <p>
                  <strong>3. 1-Click Marksheet & Receipts:</strong> Parents ko direct PDF link milta hai, unhe print lene school aane ki zaroorat nahi hoti.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setQrModalOpen(true)}
                  className="w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow transition-colors"
                >
                  <QrCode className="w-4 h-4" />
                  {isActive ? 'Scan Again / Reconnect Device' : 'Link School WhatsApp Now'}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* QR Code Scan Modal */}
      {qrModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center space-y-4 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setQrModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="space-y-1">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-xl shadow-xs">
                <Smartphone className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-bold text-base text-slate-900">
                Link School WhatsApp Account
              </h3>
              <p className="text-xs text-slate-500">
                Scan QR code using WhatsApp on the official school smartphone
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-slate-50 rounded-xl p-3 text-left text-xs text-slate-700 space-y-1.5 border border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center">1</span>
                <span>Open <strong>WhatsApp</strong> on your school phone</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center">2</span>
                <span>Tap <strong>Menu (⋮)</strong> on Android or <strong>Settings</strong> on iPhone</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center">3</span>
                <span>Select <strong>Linked Devices</strong> &rarr; <strong>Link a Device</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center">4</span>
                <span>Point your phone camera to this QR code</span>
              </div>
            </div>

            {/* QR Code Container with dynamic timer */}
            <div className="relative w-52 h-52 mx-auto bg-white border-2 border-slate-200 rounded-2xl p-3 flex flex-col items-center justify-center shadow-inner">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=190x190&data=UAB_INFOSOL_JD_INTERNATIONAL_WHATSAPP_${qrCountdown}`}
                alt="WhatsApp QR Code"
                className="w-full h-full object-contain"
              />
              <div className="absolute -bottom-3 bg-indigo-900 text-white text-[10px] font-bold px-3 py-0.5 rounded-full shadow flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-indigo-300 animate-spin" />
                Refreshes in {qrCountdown}s
              </div>
            </div>

            {/* Configurable school phone number */}
            <div className="text-left space-y-1 pt-2">
              <label className="text-[11px] font-semibold text-slate-600">
                School Phone Number to pair:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customPhone}
                  onChange={(e) => setCustomPhone(e.target.value)}
                  placeholder="98290 12345"
                  className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 text-slate-800 font-mono"
                />
                <input
                  type="text"
                  value={customDeskName}
                  onChange={(e) => setCustomDeskName(e.target.value)}
                  placeholder="Desk Name"
                  className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={handleSimulateScan}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                Simulate Successful Scan & Link
              </button>

              <button
                type="button"
                onClick={() => setQrModalOpen(false)}
                className="w-full py-2 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-semibold hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default WhatsappQrPage;
