import React, { useState } from 'react';
import {
  Download,
  Smartphone,
  Laptop,
  CheckCircle2,
  Share,
  PlusSquare,
  X,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Info
} from 'lucide-react';
import { usePwaInstall } from './usePwaInstall';

export function PwaDownloadButton() {
  const {
    isInstallable,
    isInstalled,
    promptInstall,
    hasPrompt,
    isIOS,
    isAndroid,
    isWindows,
    isMac,
    isSafari
  } = usePwaInstall();

  const [modalOpen, setModalOpen] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);

  const handleDownloadClick = async () => {
    if (isInstalled) {
      setModalOpen(true);
      return;
    }

    if (hasPrompt) {
      const res = await promptInstall();
      if (res.outcome === 'accepted') {
        setJustInstalled(true);
      } else if (res.outcome === 'manual_guide') {
        setModalOpen(true);
      }
    } else {
      // Show guided install modal
      setModalOpen(true);
    }
  };

  return (
    <>
      {/* Floating Bottom-Right Download Button */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end group">
        {/* Subtle Tooltip / Callout pill */}
        <div className="mb-2 hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900/90 text-white text-[11px] font-medium backdrop-blur-md shadow-lg border border-slate-700/50 opacity-90 group-hover:opacity-100 transition-opacity">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{isInstalled ? 'App Installed' : 'Fast PWA &bull; Install on any device'}</span>
        </div>

        <button
          id="pwa-download-btn"
          type="button"
          onClick={handleDownloadClick}
          aria-label="Download School ERP App"
          className="relative inline-flex items-center gap-3 px-5 py-3.5 rounded-full bg-gradient-to-r from-[#012970] via-[#1a237e] to-[#232688] text-white font-semibold text-sm shadow-2xl shadow-indigo-950/40 hover:shadow-indigo-500/30 hover:scale-[1.03] active:scale-[0.98] border border-white/20 backdrop-blur-md transition-all duration-300 cursor-pointer focus:outline-none focus:ring-4 focus:ring-indigo-500/30"
        >
          {/* Animated Glow Halo */}
          <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 opacity-30 group-hover:opacity-60 blur-sm transition duration-500 -z-10"></span>

          {/* Icon with mini badge */}
          <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white/15 text-white">
            {isInstalled ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-300" />
            ) : (
              <Download className="w-5 h-5 animate-bounce" style={{ animationDuration: '2.5s' }} />
            )}
          </div>

          <div className="flex flex-col text-left pr-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-200 leading-tight">
              {isInstalled ? 'Installed' : 'Free App'}
            </span>
            <span className="text-sm font-bold tracking-tight text-white leading-tight">
              {isInstalled ? 'Launch ERP App' : 'Download App'}
            </span>
          </div>

          {/* Badge */}
          <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-900 shadow-xs">
            PWA
          </span>
        </button>
      </div>

      {/* Guided Installation / Info Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800 p-6 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Accent Gradient */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600"></div>

            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* App Header */}
            <div className="flex items-center space-x-3.5 mt-1 mb-5">
              <img
                src="/icon-192.png"
                alt="School ERP"
                className="w-14 h-14 rounded-2xl shadow-md border border-slate-200/50 dark:border-slate-700 object-cover"
              />
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                  School ERP Portal
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Progressive Web App &bull; Version 1.0.0
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    <ShieldCheck className="w-3 h-3" /> Secure & Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Content Based on Platform / State */}
            {isInstalled || justInstalled ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                      School ERP is installed!
                    </h4>
                    <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                      You can launch School ERP directly from your device home screen, application menu, or desktop taskbar without browser borders.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                    <p className="font-semibold text-slate-900 dark:text-white">&check; Works Offline</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Core cached data available</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                    <p className="font-semibold text-slate-900 dark:text-white">&check; Instant Launch</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Zero load lag</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="w-full py-3 rounded-xl bg-[#232688] hover:bg-indigo-900 text-white font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  Got It
                </button>
              </div>
            ) : isIOS ? (
              /* iOS Safari instructions */
              <div className="space-y-4">
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Install School ERP on your iPhone or iPad for quick 1-tap access:
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
                      1
                    </div>
                    <div>
                      Tap the <strong className="font-bold">Share</strong> button{' '}
                      <span className="inline-block px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-[11px]">
                        <Share className="w-3.5 h-3.5 inline mb-0.5" /> Share
                      </span>{' '}
                      in Safari’s bottom toolbar.
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
                      2
                    </div>
                    <div>
                      Scroll down and tap{' '}
                      <strong className="font-bold">Add to Home Screen</strong>{' '}
                      <span className="inline-block px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-[11px]">
                        <PlusSquare className="w-3.5 h-3.5 inline mb-0.5" />
                      </span>.
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
                      3
                    </div>
                    <div>
                      Tap <strong className="font-bold text-blue-600">Add</strong> in the top right corner. Done!
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="w-full py-3 rounded-xl bg-[#232688] hover:bg-indigo-900 text-white font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              /* Chrome / Edge / Android / Desktop Instructions */
              <div className="space-y-4">
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Install the native app version to get a desktop/mobile icon, offline caching, and faster response times:
                </p>

                <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-950 dark:text-indigo-200">
                    <Laptop className="w-4 h-4 text-indigo-600" /> Desktop & Laptop (Chrome, Edge, Brave)
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    Look for the <strong className="font-semibold text-indigo-700 dark:text-indigo-300">Install icon</strong> (computer screen with a down arrow) in your browser’s URL address bar, or click browser menu (three dots) &rarr; <span className="underline">Install School ERP</span>.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                    <Smartphone className="w-4 h-4 text-indigo-600" /> Android Devices
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    Tap the 3-dots menu in Chrome &rarr; select <strong className="font-semibold text-slate-800 dark:text-slate-200">&ldquo;Install App&rdquo;</strong> or <strong className="font-semibold text-slate-800 dark:text-slate-200">&ldquo;Add to Home Screen&rdquo;</strong>.
                  </p>
                </div>

                {hasPrompt ? (
                  <button
                    type="button"
                    onClick={async () => {
                      const res = await promptInstall();
                      if (res.outcome === 'accepted') {
                        setJustInstalled(true);
                      }
                    }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-[#232688] hover:from-blue-700 hover:to-indigo-900 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> Install App Now
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="w-full py-3 rounded-xl bg-[#232688] hover:bg-indigo-900 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                )}
              </div>
            )}

            {/* Footer Features */}
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Zero Storage Footprint
              </span>
              <span>Always Up-to-Date</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PwaDownloadButton;
