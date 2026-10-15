import React, { useState } from 'react';
import {
  QrCode,
  Plus,
  Trash2,
  SignalZero,
  X
} from 'lucide-react';

export function WhatsappQrPage() {
  const [isActive, setIsActive] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [session, setSession] = useState({
    loggedIn: false,
    instanceId: '',
    accessToken: '',
    status: 'Disconnected'
  });

  const handleReset = () => {
    if (window.confirm('Are you sure you want to delete and reset the WhatsApp instance?')) {
      setSession({
        loggedIn: false,
        instanceId: '',
        accessToken: '',
        status: 'Disconnected'
      });
      setIsActive(false);
    }
  };

  const handleSimulateScan = () => {
    setSession({
      loggedIn: true,
      instanceId: `INST-${Math.floor(100000 + Math.random() * 900000)}`,
      accessToken: `tok_live_${Math.random().toString(36).substring(2, 15)}`,
      status: 'Connected'
    });
    setIsActive(true);
    setQrModalOpen(false);
  };

  return (
    <div className="bg-[#f3f4f6] min-h-screen">
      {/* 1:1 UAB Exact Sticky Sub-Navbar */}
      <div className="bg-[#f8fafc] px-6 h-14 border-b border-slate-200 sticky top-0 left-0 flex justify-start items-center space-x-3 z-10 shadow-2xs">
        {/* WhatsApp Brand Icon & Status */}
        <div className="flex items-center space-x-2">
          {/* WhatsApp logo in red/green depending on status */}
          <span className={`text-3xl ${isActive ? 'text-emerald-500' : 'text-rose-500'}`}>
            <svg
              className="w-8 h-8 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12.001 2.002c-5.522 0-9.999 4.477-9.999 9.999 0 1.763.456 3.42 1.254 4.863l-1.256 4.606 4.735-1.242c1.393.754 2.979 1.173 4.666 1.173 5.522 0 9.999-4.477 9.999-9.999s-4.477-10-9.999-10zm5.836 14.154c-.244.686-1.233 1.258-1.789 1.341-.519.077-1.189.109-3.486-.843-2.673-1.109-4.385-3.83-4.518-4.009-.133-.178-1.077-1.433-1.077-2.733 0-1.3.686-1.942.93-2.208.244-.266.533-.333.71-.333.178 0 .355.002.511.01.166.009.388-.063.609.467.244.577.822 2.019.889 2.164.067.144.111.311.022.489-.089.178-.133.289-.267.444-.133.155-.278.344-.4.466-.133.133-.272.278-.117.544.155.266.69 1.133 1.48 1.834 1.017.904 1.874 1.185 2.14 1.318.266.133.422.111.577-.067.155-.178.666-.777.844-1.043.178-.266.355-.222.6-.133.244.089 1.555.733 1.821.866.266.133.444.2.511.311.066.111.066.644-.178 1.33z" />
            </svg>
          </span>

          <span className="text-xs font-semibold text-slate-800">
            {isActive ? 'Active' : 'In-Active'}
          </span>
        </div>

        {/* Circular Mini FAB 1: QR Scan (Indigo circle) */}
        <button
          type="button"
          onClick={() => setQrModalOpen(true)}
          title="Qr Scan"
          className="w-10 h-10 rounded-full bg-[#5c67f6] hover:bg-[#4a55ea] text-white flex items-center justify-center shadow-md transition-transform hover:scale-105 active:scale-95"
        >
          <QrCode className="w-5 h-5 text-white" />
        </button>

        {/* Circular Mini FAB 2: Add */}
        <button
          type="button"
          onClick={() => toast.error('Maximum 1 WhatsApp instance allowed per school account')}
          title="Add Instance"
          className="w-10 h-10 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center cursor-pointer shadow-none transition-colors"
        >
          <Plus className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      {/* 1:1 Table Section (Matches UAB exactly) */}
      <div className="p-4">
        <div className="bg-white rounded-lg shadow-xs border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-200 text-slate-800 font-bold text-xs">
                <th className="py-3 px-4 text-center">Logged In</th>
                <th className="p-3 text-center">Instance ID</th>
                <th className="p-3 text-center">Access Token</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Reset Instance</th>
              </tr>
            </thead>
            <tbody className="text-xs text-slate-700">
              <tr className="text-center hover:bg-slate-50/60 transition-colors">
                {/* Logged In */}
                <td className="py-5 px-4 font-semibold">
                  {session.loggedIn ? (
                    <span className="text-emerald-600 font-bold">Yes</span>
                  ) : (
                    <span>--</span>
                  )}
                </td>

                {/* Instance ID */}
                <td className="p-5 font-mono font-medium text-slate-800">
                  {session.instanceId || ''}
                </td>

                {/* Access Token */}
                <td className="p-5 font-mono text-slate-500">
                  {session.accessToken || ''}
                </td>

                {/* Status Column (Disconnected in red with signal_cellular_alt icon) */}
                <td className="py-5 px-4">
                  {session.loggedIn ? (
                    <div className="text-emerald-600 flex justify-center items-center space-x-1 font-semibold">
                      <span>Connected</span>
                    </div>
                  ) : (
                    <div className="text-red-500 flex justify-center items-center space-x-1 font-semibold">
                      {/* signal_cellular_alt SVG */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 fill-current inline-block"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17 4h3v16h-3V4zM5 14h3v6H5v-6zm6-5h3v11h-3V9z" />
                      </svg>
                      <p>Disconnected</p>
                    </div>
                  )}
                </td>

                {/* Reset Instance (Delete bin icon) */}
                <td className="py-5 px-4 cursor-pointer">
                  <button
                    type="button"
                    onClick={handleReset}
                    title="Delete Instance"
                    className="p-1.5 rounded-full hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-colors inline-flex items-center justify-center"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Code Scan Modal */}
      {qrModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 text-center space-y-4 relative">
            <button
              onClick={() => setQrModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
              📱
            </div>

            <h3 className="font-bold text-base text-slate-900">Scan QR Code</h3>
            <p className="text-xs text-slate-500">
              Open WhatsApp on your mobile &bull; Linked Devices &bull; Scan the QR Code below to link your school account
            </p>

            <div className="w-48 h-48 mx-auto bg-white border-2 border-slate-200 rounded-xl p-2 flex items-center justify-center shadow-inner">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=UAB_INFOSOL_JD_INTERNATIONAL_2026"
                alt="QR Code"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleSimulateScan}
                className="w-full py-2.5 rounded-lg bg-[#5c67f6] hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors"
              >
                Simulate Successful Scan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
