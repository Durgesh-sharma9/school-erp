import React, { useState, useEffect, useRef } from 'react';
import { 
  Copy, 
  ExternalLink, 
  Link2, 
  QrCode, 
  Share2, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Download, 
  Printer, 
  MessageCircle, 
  Mail, 
  Sparkles, 
  School,
  Check,
  FileText,
  Users,
  Smartphone,
  Building2,
  Layers,
  Image as ImageIcon,
  MessageSquare,
  Send,
  CheckCheck,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  FileCheck,
  Clock,
  Eye,
  GraduationCap,
  Briefcase,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { tenantStore } from '../../services/tenantStore';
import { PageHeader } from './components/PageHeader';
import WhatsAppIcon from './components/WhatsAppIcon';

export function JobOpeningsPage({ onNavigate }) {
  const { user } = useAuth();
  const schoolId = user?.schoolId || 'sch_jd_intl';
  const schoolProfile = tenantStore.getSchoolProfile(schoolId) || {};

  const schoolName = schoolProfile.schoolName || user?.schoolName || 'J D International School';
  const schoolAddress = schoolProfile.address || 'Mahapura, Ajmer Road, Jaipur';
  const schoolPhone = schoolProfile.phone1 || '8947919195';
  const schoolEmail = schoolProfile.email || '10964@cbseshiksha.in';
  const schoolLogo = schoolProfile.logoUrl || '';

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [copiedBroadcast, setCopiedBroadcast] = useState(false);
  const [qrViewMode, setQrViewMode] = useState('standee'); // 'standee' | 'minimal'
  const [broadcastTab, setBroadcastTab] = useState('whatsapp'); // 'whatsapp' | 'walkin' | 'teachers' | 'non_teaching' | 'sms'
  const [broadcastPreviewOpen, setBroadcastPreviewOpen] = useState(false);
  const [downloadingQr, setDownloadingQr] = useState(false);
  const [qrShareFeedback, setQrShareFeedback] = useState('');

  // Target Candidate Apply URL
  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
  const applySlug = 'jd-international-school';
  const applyUrl = `${origin}/apply?school=${applySlug}`;
  const qrDataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=10&data=${encodeURIComponent(applyUrl)}`;

  const copyToClipboard = (text, type = 'link') => {
    navigator.clipboard.writeText(text);
    if (type === 'link') {
      setCopiedLink(true);
      toast.success('Application link copied to clipboard!');
      setTimeout(() => setCopiedLink(false), 2200);
    }
  };

  const getBroadcastMessage = (type) => {
    const addressLine = schoolAddress ? `📍 *Campus Venue:* ${schoolAddress}\n` : '';
    const phoneLine = schoolPhone ? `📞 *Recruitment Desk:* ${schoolPhone}\n` : '';
    const cleanUrl = applyUrl;

    if (type === 'whatsapp') {
      return `📢 *TEACHING & STAFF VACANCIES — ${schoolName.toUpperCase()}* 📢\n\n` +
        `We are inviting passionate, qualified teachers & administrative staff to join our vibrant academic team.\n\n` +
        `💼 *Open Positions:*\n` +
        `• PGT / TGT / PRT (All Subjects)\n` +
        `• Pre-Primary & Kindergarten Teachers (NTT)\n` +
        `• Activity, Sports, Art & Music Faculty\n` +
        `• Front Desk & Administrative Executives\n\n` +
        `👉 *Direct 2-Minute Application:* \n` +
        `🔗 ${cleanUrl}\n\n` +
        `No password or complex registration needed. Simply tap the link above and submit your details!\n\n` +
        addressLine +
        phoneLine;
    }

    if (type === 'walkin') {
      return `🚨 *URGENT WALK-IN INTERVIEW — ${schoolName.toUpperCase()}* 🚨\n\n` +
        `We are conducting direct Walk-In Interviews for passionate educators and staff for the upcoming academic session.\n\n` +
        `🎯 *Positions Available:*\n` +
        `• Senior & High School Faculty (PGT / TGT)\n` +
        `• Primary & Mother Teachers (PRT / NTT)\n` +
        `• Front Office & Campus Support Staff\n\n` +
        `⏰ *Timings:* 09:00 AM - 02:00 PM (Mon-Sat)\n` +
        addressLine +
        phoneLine +
        `\n📝 *Fill your biodata in 2 mins before visiting:* \n` +
        `🔗 ${cleanUrl}\n\n` +
        `Kindly carry your updated resume and recent photograph.`;
    }

    if (type === 'teachers') {
      return `🎓 *FACULTY RECRUITMENT — ${schoolName.toUpperCase()}* 🎓\n\n` +
        `Inviting applications from qualified, dynamic teachers with strong subject knowledge and communication skills:\n\n` +
        `📚 *Subject Openings:*\n` +
        `• PGT: Physics, Chemistry, Mathematics, Biology, English, Commerce, Economics, Computer Science\n` +
        `• TGT: Science, Mathematics, English, Social Studies, Hindi, Sanskrit\n` +
        `• PRT / Primary: All Subjects & Mother Teachers\n` +
        `• Special Faculty: Physical Education (PTI), Art & Craft, Music & Dance\n\n` +
        `🎯 *Eligibility:* Relevant Degree with B.Ed / D.El.Ed & Teaching Experience.\n\n` +
        `👉 *Instant Direct Application:* \n` +
        `🔗 ${cleanUrl}\n\n` +
        `Submit your biodata in 2 minutes for an immediate interview call!\n\n` +
        phoneLine;
    }

    if (type === 'non_teaching') {
      return `🏢 *NON-TEACHING & ADMINISTRATIVE VACANCIES — ${schoolName.toUpperCase()}*\n\n` +
        `We are hiring responsible and competent staff members for campus operations:\n\n` +
        `💼 *Available Roles:*\n` +
        `• Receptionist / Front Desk Executive\n` +
        `• School Accountant / Fee Clerk\n` +
        `• Admissions Counselor / Coordinator\n` +
        `• Computer & Science Lab Assistants\n` +
        `• Transport Coordinator & Campus Caretaker\n\n` +
        `👉 *Apply Online in 2 Minutes:* \n` +
        `🔗 ${cleanUrl}\n\n` +
        `Selected candidates will be called directly for an interview at the campus.\n\n` +
        addressLine +
        phoneLine;
    }

    // sms
    return `📢 Vacancies at ${schoolName}! We are hiring Teachers (PGT/TGT/PRT) & Admin Staff. Apply online in 2 mins: ${cleanUrl} (Free / No login required)`;
  };

  const copyBroadcastMessage = () => {
    const msg = getBroadcastMessage(broadcastTab);
    navigator.clipboard.writeText(msg);
    setCopiedBroadcast(true);
    toast.success('Broadcast message copied to clipboard!');
    setTimeout(() => setCopiedBroadcast(false), 2200);
  };

  const shareBroadcastWhatsApp = () => {
    const msg = getBroadcastMessage(broadcastTab);
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const shareWhatsApp = () => {
    const text = `📢 *Job Vacancies & Walk-In Recruitment — ${schoolName}*\n\nPoint your phone camera to scan our QR code, or apply directly at:\n🔗 ${applyUrl}\n\nTakes only 2 minutes. Submit your biodata for direct interview call!`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareEmail = () => {
    const subject = encodeURIComponent(`Job Vacancies at ${schoolName}`);
    const body = encodeURIComponent(getBroadcastMessage('whatsapp'));
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  const downloadStandeePNG = async () => {
    setDownloadingQr(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 760;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Crisp white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, 600, 760);

      // 2. Gradient top banner
      const grad = ctx.createLinearGradient(0, 0, 600, 0);
      grad.addColorStop(0, '#0F766E');
      grad.addColorStop(0.5, '#8A3BD4');
      grad.addColorStop(1, '#EC4899');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 600, 12);

      // 3. Card outer border
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 3;
      ctx.strokeRect(4, 4, 592, 752);

      // 4. Header: School Name
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(schoolName, 300, 60);

      // Subtitle Pill
      ctx.fillStyle = '#FAF5FF';
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(160, 78, 280, 28, 14) : ctx.rect(160, 78, 280, 28);
      ctx.fill();
      ctx.strokeStyle = '#DDD6FE';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#7C3AED';
      ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('WALK-IN CAREERS & JOB PORTAL', 300, 96);

      // 5. Draw QR Code
      const qrImg = new Image();
      qrImg.crossOrigin = 'anonymous';
      await new Promise((resolve, reject) => {
        qrImg.onload = resolve;
        qrImg.onerror = reject;
        qrImg.src = qrDataUrl;
      });

      ctx.fillStyle = '#F8FAFC';
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(110, 130, 380, 380, 18) : ctx.rect(110, 130, 380, 380);
      ctx.fill();
      ctx.stroke();

      ctx.drawImage(qrImg, 130, 150, 340, 340);

      // 6. Instructions & Footer
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('Scan with Phone Camera to Apply', 300, 545);

      ctx.fillStyle = '#64748B';
      ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('Direct school submission • Instant biodata delivery', 300, 570);

      ctx.fillStyle = '#0F766E';
      ctx.font = 'bold 13px monospace';
      ctx.fillText(applyUrl, 300, 615);

      ctx.fillStyle = '#94A3B8';
      ctx.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(`${schoolAddress} | Contact: ${schoolPhone}`, 300, 720);

      // Download
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `${applySlug}-recruitment-standee.png`;
      a.click();
      toast.success('Standee PNG downloaded successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate standee image');
    } finally {
      setDownloadingQr(false);
    }
  };

  const printStandee = () => {
    const existingIframe = document.getElementById('qr-print-frame');
    if (existingIframe) existingIframe.remove();

    const iframe = document.createElement('iframe');
    iframe.id = 'qr-print-frame';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.style.visibility = 'hidden';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${schoolName} - Recruitment Standee</title>
          <style>
            @page { size: A4 portrait; margin: 10mm; }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; text-align: center; margin: 0; padding: 20px; color: #0f172a; }
            .card { border: 3px solid #7c3aed; border-radius: 24px; padding: 30px; max-width: 500px; margin: 0 auto; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
            .badge { background: #ede9fe; color: #6d28d9; padding: 6px 16px; border-radius: 999px; font-size: 12px; font-weight: 800; display: inline-block; margin-top: 8px; }
            h1 { font-size: 26px; margin: 10px 0 0 0; }
            .qr-box { margin: 25px auto; padding: 15px; border: 2px dashed #a855f7; border-radius: 20px; display: inline-block; background: #faf5ff; }
            .qr-box img { width: 280px; height: 280px; display: block; }
            .instr { font-size: 16px; font-weight: bold; margin-top: 15px; }
            .sub { font-size: 12px; color: #64748b; margin-top: 4px; }
            .url { font-family: monospace; font-size: 12px; color: #0f766e; margin-top: 15px; font-weight: bold; }
            .footer { margin-top: 25px; border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 11px; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>${schoolName}</h1>
            <div class="badge">WALK-IN CAREERS & JOB PORTAL</div>
            <div class="qr-box">
              <img src="${qrDataUrl}" alt="QR Code" />
            </div>
            <div class="instr">Scan with Phone Camera to Apply</div>
            <div class="sub">Direct school submission • Instant biodata delivery</div>
            <div class="url">${applyUrl}</div>
            <div class="footer">
              ${schoolAddress} • Ph: ${schoolPhone}
            </div>
          </div>
        </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    }, 400);
  };

  const copyImageToClipboard = async () => {
    try {
      const response = await fetch(qrDataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob })
      ]);
      setCopiedImage(true);
      toast.success('QR Code image copied to clipboard!');
      setTimeout(() => setCopiedImage(false), 2200);
    } catch (err) {
      console.warn('Clipboard write failed:', err);
      // Fallback download
      downloadStandeePNG();
    }
  };

  const renderFormattedMessage = (text) => {
    return text.split('\n').map((line, lineIdx) => {
      const parts = line.split(/(\*[^*]+\*)/g);
      return (
        <div key={lineIdx} className={line.trim() === '' ? 'h-2' : 'min-h-[1.2rem]'}>
          {parts.map((part, pIdx) => {
            if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
              return (
                <strong key={pIdx} className="font-bold text-slate-900">
                  {part.slice(1, -1)}
                </strong>
              );
            }
            return <span key={pIdx}>{part}</span>;
          })}
        </div>
      );
    });
  };

  return (
    <div className="p-3 sm:p-4 lg:p-5 space-y-5 w-full antialiased text-slate-800 pb-16 min-h-screen bg-[#F4F7F6]/60">
      
      {/* ─── 1. PAGE HEADER (1:1 with HireHub) ─── */}
      <PageHeader
        title="Application Links & QR Code"
        description="Share your custom job application portal URL or QR code with candidates, teacher networks, and recruitment portals."
        icon={QrCode}
        action={
          <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-2xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Portal Live & Active</span>
          </div>
        }
      />

      {/* ─── 2. MAIN 2-COLUMN GRID (1:1 with HireHub) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Public Application Link & Broadcast Messages (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* CARD 1: Direct Application Portal */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#0F766E]/10 text-[#0F766E] rounded-xl ring-1 ring-[#0F766E]/20">
                  <Link2 className="h-5 w-5 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    Direct Application Portal
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Direct application portal tailored for {schoolName}
                  </p>
                </div>
              </div>

              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-[11px] font-mono text-slate-600 font-semibold border border-slate-200">
                <School className="h-3 w-3 text-[#0F766E]" />
                {applySlug}
              </span>
            </div>

            <div className="p-4 sm:p-5 space-y-4">
              {/* URL Display Box */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  TARGET CANDIDATE URL
                </label>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    readOnly
                    value={applyUrl}
                    onClick={() => copyToClipboard(applyUrl, 'link')}
                    className="flex-1 h-11 px-3.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 bg-slate-50/60 hover:bg-slate-50 cursor-pointer focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(applyUrl, 'link')}
                    className={`h-11 px-5 rounded-xl font-bold text-xs transition-all duration-200 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-xs ${
                      copiedLink
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gradient-to-r from-[#8A3BD4] to-[#A855F7] text-white hover:opacity-95'
                    }`}
                  >
                    {copiedLink ? (
                      <>
                        <Check className="h-4 w-4 stroke-[2.5]" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Fast Distribution Channels */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  FAST DISTRIBUTION CHANNELS
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={shareWhatsApp}
                    className="h-9 px-3.5 rounded-xl text-xs font-semibold border border-emerald-200 bg-emerald-50/50 text-emerald-700 hover:bg-emerald-100 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <WhatsAppIcon className="h-3.5 w-3.5 fill-emerald-600" />
                    <span>Share on WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={shareEmail}
                    className="h-9 px-3.5 rounded-xl text-xs font-semibold border border-sky-200 bg-sky-50/50 text-sky-700 hover:bg-sky-100 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Mail className="h-3.5 w-3.5 text-sky-600" />
                    <span>Send via Email</span>
                  </button>
                </div>
              </div>

              {/* Direct School Ownership Guarantee Callout */}
              <div className="p-3.5 rounded-xl border border-[#0F766E]/20 bg-[#0F766E]/5 flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-[#0F766E]/10 text-[#0F766E] shrink-0 mt-0.5">
                  <Share2 className="h-4 w-4" />
                </div>
                <div className="space-y-0.5 text-xs">
                  <div className="font-bold text-slate-900">
                    Direct School Ownership Guarantee
                  </div>
                  <p className="text-slate-600 leading-relaxed font-normal text-[11px]">
                    Candidates who register through this link or QR code will be designated with source <span className="bg-[#0F766E]/15 px-1 py-0.5 rounded text-[#0F766E] font-mono font-bold text-[10px]">SCHOOL_LINK</span> and assigned exclusively with full access to your school.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* CARD 2: Ready-to-Share Job Announcements */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl ring-1 ring-emerald-500/20 shadow-2xs shrink-0">
                  <MessageSquare className="h-5 w-5 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    Ready-to-Share Job Announcements
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Pre-formatted templates with your school name & application link.
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Sparkles className="h-3 w-3 text-emerald-600" />
                1-Click Copy
              </span>
            </div>

            <div className="p-4 sm:p-5 space-y-4">
              {/* Segmented Channel Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="inline-flex flex-wrap items-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold gap-1">
                  {[
                    { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, color: 'text-emerald-700' },
                    { id: 'walkin', label: 'Walk-In Alert', icon: Clock, color: 'text-amber-700' },
                    { id: 'teachers', label: 'Subject Teachers', icon: GraduationCap, color: 'text-[#0F766E]' },
                    { id: 'non_teaching', label: 'Admin & Staff', icon: Briefcase, color: 'text-blue-700' },
                    { id: 'sms', label: 'Short SMS / Status', icon: Send, color: 'text-purple-700' },
                  ].map((tab) => {
                    const TabIcon = tab.icon;
                    const isActive = broadcastTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setBroadcastTab(tab.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                          isActive
                            ? `bg-white ${tab.color} shadow-xs font-bold`
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        <TabIcon className="h-3.5 w-3.5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                <span className="text-[11px] font-mono text-slate-400">
                  {getBroadcastMessage(broadcastTab).length} characters
                </span>
              </div>

              {/* Template Brief Box */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      {broadcastTab === 'whatsapp' ? 'WhatsApp Broadcast Announcement' :
                       broadcastTab === 'walkin' ? 'Urgent Walk-In Interview Notice' :
                       broadcastTab === 'teachers' ? 'Subject Teachers & Faculty Recruitment' :
                       broadcastTab === 'non_teaching' ? 'Administrative & Campus Staff Vacancies' :
                       'Ultra-Short SMS & WhatsApp Status Alert'}
                    </span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Most Popular
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setBroadcastPreviewOpen(true)}
                    className="text-xs font-bold text-[#8A3BD4] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5" /> Preview Message
                  </button>
                </div>

                {/* Formatted snippet */}
                <div className="bg-white rounded-xl border border-slate-200 p-3 text-xs text-slate-700 font-mono leading-relaxed line-clamp-3 overflow-hidden shadow-2xs">
                  {getBroadcastMessage(broadcastTab)}
                </div>
              </div>

              {/* Bottom Actions Row */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setBroadcastPreviewOpen(true)}
                    className="px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Preview Message</span>
                  </button>

                  <button
                    type="button"
                    onClick={copyBroadcastMessage}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#8A3BD4] hover:bg-[#7A2EC4] text-white flex items-center gap-1.5 transition shadow-sm shadow-purple-500/20 active:scale-95 cursor-pointer"
                  >
                    {copiedBroadcast ? (
                      <>
                        <CheckCheck className="h-3.5 w-3.5 stroke-[2.5]" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Broadcast Message</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={shareBroadcastWhatsApp}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <WhatsAppIcon className="h-3.5 w-3.5 fill-emerald-600" />
                    <span>Send via WhatsApp</span>
                  </button>
                </div>

                <span className="text-[11px] text-slate-400 font-medium">
                  ✨ Pre-filled for <strong className="text-slate-700">{schoolName}</strong>
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Reception Standee & Print Flyers (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            
            {/* Header with Standee / Clean QR switcher */}
            <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-50 text-[#8A3BD4] rounded-xl ring-1 ring-purple-200 shadow-2xs">
                  <QrCode className="h-5 w-5 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    Instant Scan QR Code
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Reception Standee & Print Flyers
                  </p>
                </div>
              </div>

              {/* View Switcher: Standee vs Minimal */}
              <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold shrink-0">
                <button
                  type="button"
                  onClick={() => setQrViewMode('standee')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    qrViewMode === 'standee'
                      ? 'bg-white text-[#0F766E] shadow-2xs font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Standee
                </button>
                <button
                  type="button"
                  onClick={() => setQrViewMode('minimal')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    qrViewMode === 'minimal'
                      ? 'bg-white text-[#0F766E] shadow-2xs font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Clean QR
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 flex flex-col items-center justify-center space-y-5">
              
              {/* STANDEE PREVIEW CONTAINER */}
              {qrViewMode === 'standee' ? (
                <div className="w-full flex flex-col items-center">
                  <div className="relative w-full max-w-[320px] rounded-3xl p-5 bg-gradient-to-b from-white via-purple-50/40 to-slate-50 text-slate-800 shadow-xl border-2 border-purple-200/90 overflow-hidden transition-all duration-300 hover:scale-[1.01]">
                    {/* Top Accent Gradient Line */}
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#0F766E] via-[#c084fc] to-[#7928CA]" />
                    
                    {/* Ambient Glow */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-44 h-24 bg-[#0F766E]/15 blur-2xl rounded-full pointer-events-none" />

                    {/* Standee Header */}
                    <div className="relative z-10 flex flex-col items-center text-center mb-3.5 space-y-1.5">
                      <div className="h-12 w-12 rounded-2xl bg-white border-2 border-purple-200 p-1 flex items-center justify-center shadow-md overflow-hidden">
                        {schoolLogo ? (
                          <img src={schoolLogo} alt={schoolName} className="h-full w-full object-contain" />
                        ) : (
                          <Building2 className="h-6 w-6 text-[#0F766E]" />
                        )}
                      </div>
                      <h4 className="text-base font-extrabold tracking-tight text-slate-900 line-clamp-1">
                        {schoolName}
                      </h4>
                      <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-100 border border-purple-200 text-[10px] font-bold text-purple-700 tracking-wide uppercase">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        Walk-In Careers Portal
                      </div>
                    </div>

                    {/* White QR Box with Branded Corner Markers */}
                    <div className="relative z-10 bg-white rounded-2xl p-3.5 shadow-md border-2 border-purple-100 flex flex-col items-center">
                      <div className="relative">
                        {/* Corner Markers */}
                        <div className="absolute -top-1 -left-1 h-4 w-4 border-t-2 border-l-2 border-[#0F766E] rounded-tl-md" />
                        <div className="absolute -top-1 -right-1 h-4 w-4 border-t-2 border-r-2 border-[#0F766E] rounded-tr-md" />
                        <div className="absolute -bottom-1 -left-1 h-4 w-4 border-b-2 border-l-2 border-[#0F766E] rounded-bl-md" />
                        <div className="absolute -bottom-1 -right-1 h-4 w-4 border-b-2 border-r-2 border-[#0F766E] rounded-br-md" />

                        <img 
                          src={qrDataUrl} 
                          alt="Recruitment QR Code" 
                          className="w-48 h-48 rounded-xl object-contain"
                        />
                      </div>

                      <div className="mt-2.5 flex items-center gap-1.5 text-xs font-bold text-slate-800">
                        <Smartphone className="h-3.5 w-3.5 text-[#0F766E]" />
                        <span>Scan with Camera to Apply</span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="relative z-10 mt-3.5 text-center text-[10px] text-slate-500 font-medium">
                      Direct school submission • Instant biodata delivery
                    </div>
                  </div>
                </div>
              ) : (
                /* CLEAN QR VIEW */
                <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-200 shadow-inner">
                  <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <img 
                      src={qrDataUrl} 
                      alt="Clean QR" 
                      className="w-56 h-56 rounded-xl"
                    />
                  </div>
                  <span className="text-xs font-mono text-slate-500 mt-3 font-semibold">
                    {applyUrl}
                  </span>
                </div>
              )}

              {/* Action Buttons Row */}
              <div className="w-full space-y-2 pt-2 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={downloadStandeePNG}
                    disabled={downloadingQr}
                    className="h-10 rounded-xl bg-gradient-to-r from-[#8A3BD4] to-[#A855F7] hover:opacity-95 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm shadow-purple-500/20 active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    {downloadingQr ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                    <span>Download PNG</span>
                  </button>

                  <button
                    type="button"
                    onClick={printStandee}
                    className="h-10 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-2xs"
                  >
                    <Printer className="h-4 w-4" />
                    <span>Print Standee</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={copyImageToClipboard}
                    className="h-10 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-2xs"
                  >
                    <ImageIcon className="h-4 w-4" />
                    <span>{copiedImage ? 'Image Copied!' : 'Copy Image'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={shareWhatsApp}
                    className="h-10 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <WhatsAppIcon className="h-4 w-4 fill-emerald-600" />
                    <span>WhatsApp</span>
                  </button>
                </div>

                {/* Direct Link Input with copy button */}
                <div className="relative pt-2">
                  <input
                    readOnly
                    value={applyUrl}
                    onClick={() => copyToClipboard(applyUrl, 'link')}
                    className="w-full h-9 pl-3 pr-8 border border-slate-200 rounded-xl text-[11px] font-mono text-slate-600 bg-slate-50 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(applyUrl, 'link')}
                    className="absolute right-2 top-3 text-slate-400 hover:text-slate-600"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Broadcast Preview Modal */}
      {broadcastPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <WhatsAppIcon className="h-4 w-4 fill-emerald-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">WhatsApp Broadcast Preview</h4>
                  <p className="text-[11px] text-slate-500">Live preview of the message candidates will receive</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setBroadcastPreviewOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Chat Bubble Content */}
            <div className="p-5 overflow-y-auto flex-1 bg-[#ECE5DD]/40">
              <div className="bg-white rounded-2xl rounded-tl-xs p-4 shadow-sm border border-slate-200 max-w-md space-y-2 text-xs text-slate-800 leading-relaxed font-sans">
                {renderFormattedMessage(getBroadcastMessage(broadcastTab))}
                <div className="text-[10px] text-slate-400 text-right pt-1">
                  12:00 PM • Sent
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-slate-100 bg-white flex items-center justify-between">
              <button
                type="button"
                onClick={() => setBroadcastPreviewOpen(false)}
                className="px-4 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={copyBroadcastMessage}
                  className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Message</span>
                </button>
                <button
                  type="button"
                  onClick={shareBroadcastWhatsApp}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <WhatsAppIcon className="h-3.5 w-3.5 fill-white" />
                  <span>Send WhatsApp</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
