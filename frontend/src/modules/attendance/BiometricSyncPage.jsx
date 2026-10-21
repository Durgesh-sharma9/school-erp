import React, { useState } from 'react';
import { 
  Cpu, 
  Wifi, 
  WifiOff, 
  CheckCircle, 
  Clock, 
  User, 
  Send, 
  RefreshCw, 
  Zap,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';

export function BiometricSyncPage() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [punches, setPunches] = useState([
    {
      id: 'p_101',
      time: '07:42:15 AM',
      name: 'AADITYA SINGH CHOUDHARY',
      code: 'ADM: 1621',
      role: 'Student (Class I-A)',
      device: 'Main Gate Face Device 01',
      type: 'IN PUNCH',
      status: 'On Time',
      smsDispatched: true
    },
    {
      id: 'p_102',
      time: '07:45:30 AM',
      name: 'PRITI VERMA',
      code: 'EMP: 102',
      role: 'Staff (Admin & Faculty)',
      device: 'Staff Room Biometric 02',
      type: 'IN PUNCH',
      status: 'On Time',
      smsDispatched: false
    },
    {
      id: 'p_103',
      time: '08:08:44 AM',
      name: 'ADVIK RAO',
      code: 'ADM: A135',
      role: 'Student (Class I-A)',
      device: 'Main Gate Face Device 01',
      type: 'IN PUNCH',
      status: 'Late Arrival (8m)',
      smsDispatched: true
    },
    {
      id: 'p_104',
      time: '08:12:10 AM',
      name: 'DR. SURESH SEN',
      code: 'EMP: 104',
      role: 'Staff (Senior Faculty)',
      device: 'Staff Room Biometric 02',
      type: 'IN PUNCH',
      status: 'Late Arrival (12m)',
      smsDispatched: true
    }
  ]);

  const devices = [
    { name: 'Main Campus Gate Face Terminal', ip: '192.168.1.150', port: '4370', status: 'Online', lastPing: 'Just now', brand: 'eSSL ZKTeco SilkBio' },
    { name: 'Primary Wing RFID Turnstile', ip: '192.168.1.151', port: '4370', status: 'Online', lastPing: 'Just now', brand: 'Realtime T52' },
    { name: 'Staff Faculty Biometric Scanner', ip: '192.168.1.152', port: '4370', status: 'Online', lastPing: 'Just now', brand: 'Matrix COSEC Door' }
  ];

  const handleSimulatePunch = () => {
    const newPunch = {
      id: `p_${Date.now()}`,
      time: new Date().toLocaleTimeString(),
      name: 'AADHYA CHOUDHARY',
      code: 'ADM: 2059',
      role: 'Student (Nursery-A)',
      device: 'Main Campus Gate Face Terminal',
      type: 'IN PUNCH',
      status: 'On Time',
      smsDispatched: true
    };
    setPunches([newPunch, ...punches]);
    toast.success('Live RFID punch registered! Parent WhatsApp alert triggered.', { icon: '🔔' });
  };

  const handleSyncDevices = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      toast.success('Successfully synchronized 482 punches from all 3 biometric machines!');
    }, 1200);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Cpu className="w-6 h-6 text-indigo-600" />
            Biometric & RFID Attendance Machine Sync
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time biometric terminal telemetry, instant late-arrival detection, and automated parent SMS dispatch.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulatePunch}
            className="flex items-center gap-2 px-3 py-1.5 border border-indigo-200 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors shadow-2xs"
          >
            <Zap className="w-3.5 h-3.5" /> Simulate Test Punch
          </button>
          <button
            onClick={handleSyncDevices}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs sm:text-sm font-semibold transition-all shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            Sync Hardware Now
          </button>
        </div>
      </div>

      {/* Hardware Devices Live Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {devices.map((dev, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 truncate">{dev.name}</span>
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                <Wifi className="w-3 h-3 text-emerald-600" /> Online
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono">IP: {dev.ip}:{dev.port}</p>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
              <span>{dev.brand}</span>
              <span className="text-emerald-600 font-medium">{dev.lastPing}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Live Punch Telemetry Stream */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Live Hardware Punch Feed (Today)
          </span>
          <span className="text-xs font-semibold text-slate-500">{punches.length} Total punches recorded</span>
        </div>

        <div className="divide-y divide-slate-100">
          {punches.map((p) => {
            const isLate = p.status.includes('Late');

            return (
              <div key={p.id} className="p-3.5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center font-bold text-indigo-700 shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{p.name}</span>
                      <span className="font-mono text-[11px] text-slate-400">({p.code})</span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5">{p.role} &bull; <span className="text-slate-400">{p.device}</span></p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    isLate ? 'bg-amber-100 text-amber-800' : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    {p.status}
                  </span>

                  <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">
                    {p.time}
                  </span>

                  {p.smsDispatched ? (
                    <span className="text-[10px] text-indigo-600 font-semibold flex items-center gap-1 bg-indigo-50 px-2 py-0.5 rounded">
                      <Send className="w-2.5 h-2.5" /> SMS Sent
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 italic">No SMS</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
