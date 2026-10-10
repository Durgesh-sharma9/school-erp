import React, { useState } from 'react';
import {
  MessageSquare,
  QrCode,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Wifi,
  WifiOff
} from 'lucide-react';

export function WhatsappQrPage() {
  const [status, setStatus] = useState('In-Active');
  const [instanceData, setInstanceData] = useState({
    loggedIn: false,
    instanceId: 'INST-2026-98124',
    accessToken: 'tok_live_*******************',
    connectionStatus: 'Disconnected'
  });

  const [qrCodeModal, setQrCodeModal] = useState(false);

  const handleResetInstance = () => {
    if (window.confirm('Are you sure you want to reset your WhatsApp instance?')) {
      setInstanceData(prev => ({
        ...prev,
        instanceId: `INST-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        connectionStatus: 'Disconnected',
        loggedIn: false
      }));
      setStatus('In-Active');
    }
  };

  return (
    <div className="bg-[#f3f4f6] min-h-screen p-3 space-y-3">
      {/* Breadcrumb Header */}
      <div className="flex items-center justify-between pt-1 pb-1">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <span className="font-semibold text-gray-800 text-sm">School</span>
          <span>&bull;</span>
          <span className="text-gray-400">School &bull; Whatsapp Link</span>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-lg shadow-md border border-slate-200 p-4 space-y-4">
        {/* Status Chip Row */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-700">Instance State:</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
              status === 'Active'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}>
              {status}
            </span>
          </div>

          <button
            onClick={() => setQrCodeModal(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Scan QR Code</span>
          </button>
        </div>

        {/* 1:1 UAB Table */}
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600 font-bold bg-slate-50/70">
                <th className="py-3 px-4">Logged In</th>
                <th className="py-3 px-4">Instance ID</th>
                <th className="py-3 px-4">Access Token</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Reset Instance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4">
                  <span className="flex items-center space-x-1.5">
                    {instanceData.loggedIn ? (
                      <>
                        <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Yes</span>
                      </>
                    ) : (
                      <>
                        <WifiOff className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-slate-500 font-bold">No</span>
                      </>
                    )}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono font-bold text-indigo-700">
                  {instanceData.instanceId}
                </td>
                <td className="py-3 px-4 font-mono text-slate-500">
                  {instanceData.accessToken}
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-600 border border-rose-100">
                    {instanceData.connectionStatus}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={handleResetInstance}
                    className="inline-flex items-center space-x-1 px-3 py-1 rounded border border-rose-200 bg-white hover:bg-rose-50 text-rose-700 font-bold text-xs shadow-2xs"
                  >
                    <RotateCcw className="w-3 h-3 text-rose-600" />
                    <span>Reset</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Code Modal */}
      {qrCodeModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 text-center space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Scan WhatsApp QR Code</h3>
            <p className="text-xs text-slate-500">
              Open WhatsApp on your school phone ➔ Linked Devices ➔ Scan this code
            </p>
            <div className="w-48 h-48 mx-auto bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center p-2">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=UAB_SCHOOL_WHATSAPP_LINK_2026"
                alt="WhatsApp QR Code"
                className="w-full h-full"
              />
            </div>
            <button
              onClick={() => {
                setQrCodeModal(false);
                setStatus('Active');
                setInstanceData(prev => ({
                  ...prev,
                  loggedIn: true,
                  connectionStatus: 'Connected'
                }));
              }}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-xs"
            >
              Simulate Connect
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
