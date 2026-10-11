import React, { useState } from 'react';
import {
  Home,
  QrCode,
  Copy,
  Check,
  Download,
  ExternalLink,
  Printer,
  Sparkles,
  Share2,
  Phone,
  Mail,
  MapPin,
  GraduationCap
} from 'lucide-react';

export function CrmQrLinksPage({ onNavigate }) {
  const [copied, setCopied] = useState(false);
  const publicUrl = `${window.location.origin}/crm/admission-form`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrintPoster = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      {/* Top Breadcrumb Toolbar */}
      <div className="bg-white border-b border-slate-200/80 px-4 md:px-8 py-3 flex items-center justify-between shadow-xs sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <h1 className="text-base md:text-lg font-semibold text-slate-800">
            QR Code & Public Admission Links
          </h1>
          <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400 pl-3 border-l border-slate-200">
            <button onClick={() => onNavigate && onNavigate('/')} className="hover:text-indigo-600">
              <Home className="w-3.5 h-3.5" />
            </button>
            <span>•</span>
            <button onClick={() => onNavigate && onNavigate('/crm')} className="hover:text-indigo-600">
              CRM
            </button>
            <span>•</span>
            <span className="text-indigo-600 font-medium">QR Code & Links</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrintPoster}
            className="h-9 px-3 rounded-lg bg-[#5c67f6] hover:bg-indigo-600 text-white flex items-center space-x-1.5 shadow-xs text-xs font-semibold transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Poster</span>
          </button>
        </div>
      </div>

      <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-5">
        {/* Public Shareable Link Card */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-5 space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Public Online Enquiry Form URL</h3>
              <p className="text-xs text-slate-500">Share this direct link on social media, WhatsApp groups, or school website.</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-mono text-xs text-slate-700 truncate">
              {publicUrl}
            </div>
            <button
              onClick={handleCopyLink}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors shrink-0 ${
                copied ? 'bg-emerald-600 text-white' : 'bg-slate-800 hover:bg-slate-900 text-white'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
            <button
              onClick={() => onNavigate && onNavigate('/crm/admission-form')}
              className="px-3 py-2 border border-slate-300 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 flex items-center space-x-1 shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
              <span>Open Form</span>
            </button>
          </div>
        </div>

        {/* Branded QR Poster Display & Customization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Printable Admission Poster Mockup */}
          <div className="bg-white rounded-2xl border-2 border-indigo-100 shadow-md p-6 text-center space-y-4 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

            <div className="pt-2">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center font-extrabold text-2xl shadow-xs">
                JD
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight mt-2">
                J D INTERNATIONAL SCHOOL
              </h2>
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-widest mt-0.5">
                Affiliated to CBSE, New Delhi
              </p>
            </div>

            <div className="bg-indigo-50/70 p-3 rounded-xl border border-indigo-100 text-xs text-indigo-900 font-semibold">
              🎓 Admissions Open for Session 2026-2027 • Pre-Nursery to Grade XII
            </div>

            {/* QR Code Graphic */}
            <div className="py-2 flex flex-col items-center">
              <div className="p-4 bg-white border-2 border-slate-900 rounded-2xl shadow-sm inline-block">
                {/* SVG QR Code Simulation */}
                <svg className="w-40 h-40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="100" height="100" fill="white" />
                  <path d="M10 10h24v24H10zM14 14v16h16V14H14z" fill="#1e1b4b" />
                  <rect x="18" y="18" width="8" height="8" fill="#1e1b4b" />
                  <path d="M66 10h24v24H66zM70 14v16h16V14H70z" fill="#1e1b4b" />
                  <rect x="74" y="18" width="8" height="8" fill="#1e1b4b" />
                  <path d="M10 66h24v24H10zM14 70v16h16V70H14z" fill="#1e1b4b" />
                  <rect x="18" y="74" width="8" height="8" fill="#1e1b4b" />
                  <rect x="42" y="14" width="6" height="16" fill="#1e1b4b" />
                  <rect x="52" y="24" width="8" height="6" fill="#1e1b4b" />
                  <rect x="14" y="42" width="16" height="6" fill="#1e1b4b" />
                  <rect x="24" y="52" width="6" height="8" fill="#1e1b4b" />
                  <rect x="42" y="42" width="16" height="16" fill="#5c67f6" />
                  <rect x="66" y="42" width="8" height="8" fill="#1e1b4b" />
                  <rect x="78" y="42" width="12" height="6" fill="#1e1b4b" />
                  <rect x="66" y="54" width="6" height="12" fill="#1e1b4b" />
                  <rect x="42" y="66" width="8" height="12" fill="#1e1b4b" />
                  <rect x="54" y="72" width="16" height="6" fill="#1e1b4b" />
                  <rect x="74" y="74" width="16" height="16" fill="#1e1b4b" />
                </svg>
              </div>
              <p className="text-xs font-bold text-slate-800 mt-2">
                Scan to Register Admission Enquiry
              </p>
              <p className="text-[11px] text-slate-500">
                Point your phone camera to open online form
              </p>
            </div>

            <div className="border-t pt-3 space-y-1 text-xs text-slate-600">
              <div className="flex items-center justify-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-indigo-600" />
                <span className="font-semibold">+91 89479 19195 / 98765 43210</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-[11px] text-slate-400">
                <MapPin className="w-3.5 h-3.5" />
                <span>Sector 12, Main Ring Road, Jaipur</span>
              </div>
            </div>
          </div>

          {/* Download & Instructions Card */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-5 space-y-3">
              <h3 className="font-bold text-slate-900 text-sm">Download Options</h3>
              <p className="text-xs text-slate-500">
                Export high-resolution files suitable for flex printing, reception display standees, and school flyers.
              </p>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => alert('Downloading High-Resolution QR Code (PNG)...')}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download QR Code Image (PNG)</span>
                </button>

                <button
                  onClick={handlePrintPoster}
                  className="w-full py-2.5 bg-[#5c67f6] hover:bg-indigo-600 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Admission Reception Standee (A4)</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-5 space-y-3">
              <h3 className="font-bold text-slate-900 text-sm">Best Practices for School Outreach</h3>
              <ul className="text-xs text-slate-600 space-y-2 list-disc pl-4">
                <li>Place the printed QR standee at your school reception desk and security gate.</li>
                <li>Include this QR code in newspaper advertisements and admission pamphlets.</li>
                <li>Post the public enquiry link on your school’s Instagram and Facebook bios.</li>
                <li>Parents submitting via QR automatically appear in the <strong>CRM Enquiries</strong> tab instantly.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
