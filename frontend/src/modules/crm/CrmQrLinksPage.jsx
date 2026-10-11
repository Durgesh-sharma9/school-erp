import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import {
  Home,
  QrCode,
  Copy,
  Download,
  ExternalLink,
  Printer,
  Sparkles,
  Share2,
  Check,
  Layout,
  Link as LinkIcon,
  FileText,
  RefreshCw,
  Maximize2,
  Upload,
  Trash2,
  ChevronRight,
  X,
  Eye,
  Phone,
  Palette,
  CheckCircle2,
  GraduationCap,
  MapPin,
  Globe,
  Mail
} from 'lucide-react';
import Input from './components/Input';
import Button from './components/Button';

// Utility: convert image URL to base64 to avoid CORS canvas tainting
const urlToBase64 = async (url) => {
  if (!url) return null;
  if (url.startsWith('data:image')) return url;

  try {
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) return url;
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => resolve(url);
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    return url;
  }
};

const oklchCache = new Map();
const oklchToRgb = (oklchString) => {
  if (oklchCache.has(oklchString)) return oklchCache.get(oklchString);
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.fillStyle = oklchString;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
    const resolved = `rgba(${r}, ${g}, ${b}, ${a / 255})`;
    oklchCache.set(oklchString, resolved);
    return resolved;
  } catch (e) {
    return 'rgb(0, 0, 0)';
  }
};

// 5 Premium Template Cards with Miniature Poster Thumbnails
const TEMPLATE_REGISTRY = [
  {
    id: 'modern-premium',
    name: 'Modern Premium',
    description: 'Clean white canvas with professional blue/purple gradient branding, structured guidelines, and modern design hierarchy.',
    thumbnail: (
      <div className="w-12 h-16 bg-white border border-slate-200 rounded relative overflow-hidden flex flex-col justify-between p-1 shrink-0 shadow-xs">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
        <div className="w-4 h-4 bg-indigo-50 rounded-sm mx-auto mt-1" />
        <div className="w-6 h-6 bg-slate-100 border border-indigo-100 rounded-sm mx-auto flex items-center justify-center">
          <div className="w-3.5 h-3.5 bg-slate-400 rounded-xs" />
        </div>
        <div className="space-y-0.5">
          <div className="w-8 h-1 bg-slate-200 mx-auto rounded-full" />
          <div className="w-6 h-0.5 bg-slate-150 mx-auto rounded-full" />
        </div>
      </div>
    )
  },
  {
    id: 'corporate-split',
    name: 'Corporate Split',
    description: 'Modern side-by-side corporate layout with left aligned QR scanner frame, right aligned branding, and navy/orange highlights.',
    thumbnail: (
      <div className="w-12 h-16 bg-white border border-slate-200 rounded relative overflow-hidden flex justify-between items-center p-1 shrink-0 gap-1 shadow-xs">
        <div className="w-4.5 h-7 bg-slate-50 border border-slate-200 rounded-sm flex items-center justify-center shrink-0">
          <div className="w-3 h-3 bg-slate-400 rounded-xs" />
        </div>
        <div className="flex-1 flex flex-col justify-between h-full py-1">
          <div className="w-3 h-3 bg-indigo-900 rounded-sm" />
          <div className="w-6 h-1 bg-amber-500 rounded-full" />
          <div className="space-y-0.5">
            <div className="w-6 h-0.5 bg-slate-300 rounded-full" />
            <div className="w-5 h-0.5 bg-slate-200 rounded-full" />
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'luxury-black',
    name: 'Luxury Black',
    description: 'Elegant deep navy luxury layout with gold accents, white QR border contrast, and premium display serif typography.',
    thumbnail: (
      <div className="w-12 h-16 bg-slate-900 border border-slate-800 rounded relative overflow-hidden flex flex-col justify-between p-1 shrink-0 shadow-xs">
        <div className="absolute inset-0 border border-amber-500/20 m-0.5 rounded-xs" />
        <div className="w-4 h-4 bg-amber-500/10 rounded-full mx-auto mt-1 border border-amber-500/20" />
        <div className="w-5 h-5 bg-white border border-amber-500/30 rounded mx-auto flex items-center justify-center">
          <div className="w-3 h-3 bg-slate-800 rounded-xs" />
        </div>
        <div className="space-y-0.5 z-10">
          <div className="w-7 h-0.5 bg-amber-400/60 mx-auto rounded-full" />
          <div className="w-5 h-0.5 bg-slate-400 mx-auto rounded-full" />
        </div>
      </div>
    )
  },
  {
    id: 'color-burst',
    name: 'Color Burst',
    description: 'Bright modern youthful layout featuring purple/blue/orange gradient backdrops with floating cards, perfect for active campus life.',
    thumbnail: (
      <div className="w-12 h-16 bg-gradient-to-tr from-purple-500 via-pink-400 to-orange-400 border border-purple-300 rounded relative overflow-hidden flex flex-col justify-between p-1 shrink-0 shadow-xs">
        <div className="w-4 h-4 bg-white/40 rounded-full mx-auto mt-1" />
        <div className="w-6 h-6 bg-white/50 border border-white/20 rounded-md mx-auto flex items-center justify-center">
          <div className="w-3 h-3 bg-purple-700 rounded-xs" />
        </div>
        <div className="space-y-0.5">
          <div className="w-7 h-1 bg-white/60 mx-auto rounded-full" />
          <div className="w-5 h-0.5 bg-white/40 mx-auto rounded-full" />
        </div>
      </div>
    )
  },
  {
    id: 'creative-gradient',
    name: 'Creative Gradient',
    description: 'Vibrant clean layout with soft purple-cyan gradients, spacious grids, neon indicators, and high contrast details.',
    thumbnail: (
      <div className="w-12 h-16 bg-gradient-to-br from-indigo-600 to-cyan-500 border border-indigo-400 rounded relative overflow-hidden flex flex-col justify-between p-1 shrink-0 shadow-xs">
        <div className="w-3.5 h-3.5 bg-white/30 rounded mx-auto mt-1" />
        <div className="w-6 h-6 bg-white/90 rounded-xl mx-auto flex items-center justify-center">
          <div className="w-3.5 h-3.5 bg-indigo-900 rounded-xs" />
        </div>
        <div className="space-y-0.5">
          <div className="w-8 h-0.5 bg-white/80 mx-auto" />
          <div className="w-6 h-0.5 bg-white/50 mx-auto" />
        </div>
      </div>
    )
  }
];

export function CrmQrLinksPage({ onNavigate }) {
  // URLs
  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
  const publicLink = `${origin}/crm/admission-form`;
  const receptionLink = `${origin}/crm/admission-form?role=reception`;

  // Real Scannable QR Code URL
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=15&data=${encodeURIComponent(publicLink)}`;

  // Link States
  const [copyingPublic, setCopyingPublic] = useState(false);
  const [copyingReception, setCopyingReception] = useState(false);
  const [downloadingQrOnly, setDownloadingQrOnly] = useState(false);

  // Template / Theme states
  const [selectedTemplate, setSelectedTemplate] = useState('modern-premium');
  const [posterTheme, setPosterTheme] = useState('brand'); // 'brand' or 'bw'
  const [activeTab, setActiveTab] = useState('branding'); // 'branding' | 'preview'
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [expandedSection, setExpandedSection] = useState('branding');

  // Load Initial Branding from localStorage or Defaults
  const defaultBranding = {
    name: 'J D INTERNATIONAL SCHOOL',
    tagline: 'Affiliated to CBSE, New Delhi',
    phone: '+91 89479 19195 / 98765 43210',
    address: 'Sector 12, Main Ring Road, Jaipur, Rajasthan 302020',
    website: 'www.jdinternationalschool.edu.in',
    academicSession: '2026-2027',
    posterTitle: 'Student Admission Portal',
    posterSubtitle: 'Pre-Nursery to Grade XII Admissions Open',
    primaryColor: '#4f46e5',
    secondaryColor: '#f59e0b',
    footerMessage: 'Thank You For Visiting Our School. We Look Forward To Welcoming Your Child.',
    highlights: [
      'Experienced & Caring CBSE Faculty',
      'Smart Classrooms & Modern STEM Labs',
      'Holistic Sports & Activity Arena',
      'Safe CCTV Campus & GPS Transport'
    ],
    showLogo: true,
    showName: true,
    showTagline: true,
    showContact: true,
    showWebsite: true,
    showAddress: true,
    showAcademicSession: true,
    showHighlights: true
  };

  const [savedSettings, setSavedSettings] = useState(() => {
    try {
      const stored = localStorage.getItem('crm_qr_branding');
      return stored ? { ...defaultBranding, ...JSON.parse(stored) } : defaultBranding;
    } catch {
      return defaultBranding;
    }
  });

  const [name, setName] = useState(savedSettings.name);
  const [tagline, setTagline] = useState(savedSettings.tagline);
  const [phone, setPhone] = useState(savedSettings.phone);
  const [address, setAddress] = useState(savedSettings.address);
  const [website, setWebsite] = useState(savedSettings.website);
  const [academicSession, setAcademicSession] = useState(savedSettings.academicSession);
  const [posterTitle, setPosterTitle] = useState(savedSettings.posterTitle);
  const [posterSubtitle, setPosterSubtitle] = useState(savedSettings.posterSubtitle);
  const [primaryColor, setPrimaryColor] = useState(savedSettings.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(savedSettings.secondaryColor);
  const [footerMessage, setFooterMessage] = useState(savedSettings.footerMessage);
  const [highlights, setHighlights] = useState(savedSettings.highlights);
  const [logo, setLogo] = useState(savedSettings.logo || '');
  const [visibility, setVisibility] = useState({
    showLogo: savedSettings.showLogo ?? true,
    showName: savedSettings.showName ?? true,
    showTagline: savedSettings.showTagline ?? true,
    showContact: savedSettings.showContact ?? true,
    showWebsite: savedSettings.showWebsite ?? true,
    showAddress: savedSettings.showAddress ?? true,
    showAcademicSession: savedSettings.showAcademicSession ?? true,
    showHighlights: savedSettings.showHighlights ?? true,
  });

  // Export / Print loading
  const [downloadingPng, setDownloadingPng] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [savingBranding, setSavingBranding] = useState(false);

  // Preloaded Base64 Image
  const [qrBase64, setQrBase64] = useState(null);
  const [logoBase64, setLogoBase64] = useState(null);

  useEffect(() => {
    urlToBase64(qrCodeImageUrl).then((b64) => setQrBase64(b64));
  }, [qrCodeImageUrl]);

  useEffect(() => {
    if (logo) {
      urlToBase64(logo).then((b64) => setLogoBase64(b64));
    } else {
      setLogoBase64(null);
    }
  }, [logo]);

  // Handle ESC key for fullscreen modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsFullScreen(false);
    };
    if (isFullScreen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreen]);

  // Dimensions
  const posterDims = { width: 800, height: 1130 }; // Standard A4 Aspect Ratio

  // Theme colors calculation
  const effectivePrimary = posterTheme === 'bw'
    ? (selectedTemplate === 'luxury-black' ? '#ffffff' : '#000000')
    : primaryColor;
  const effectiveSecondary = posterTheme === 'bw'
    ? (selectedTemplate === 'luxury-black' ? '#a1a1aa' : '#4b5563')
    : secondaryColor;

  const effectiveBg = selectedTemplate === 'luxury-black'
    ? (posterTheme === 'bw' ? '#000000' : '#0b1329')
    : (selectedTemplate === 'color-burst'
      ? (posterTheme === 'bw' ? '#18181b' : '#7c3aed')
      : '#ffffff');

  const isDarkBg = selectedTemplate === 'luxury-black' ||
    selectedTemplate === 'color-burst' ||
    (selectedTemplate === 'creative-gradient' && posterTheme === 'brand');

  const effectiveTextColor = isDarkBg
    ? '#ffffff'
    : (posterTheme === 'bw' ? '#111827' : primaryColor);

  // Copy helper
  const handleCopyLink = async (text, setCopyState) => {
    try {
      setCopyState(true);
      await navigator.clipboard.writeText(text);
      toast.success('Link copied to clipboard!');
    } catch {
      toast.error('Failed to copy');
    } finally {
      setTimeout(() => setCopyState(false), 1500);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: name || 'School Admission Portal',
          url: publicLink
        });
      } catch { }
    } else {
      await navigator.clipboard.writeText(publicLink);
      toast.success('Admission link copied for sharing!');
    }
  };

  // Download Standalone QR Code Image (PNG)
  const handleDownloadQrOnly = async () => {
    setDownloadingQrOnly(true);
    toast.loading('Generating high-res QR Code...', { id: 'qr-toast' });
    try {
      const highResUrl = `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&margin=25&data=${encodeURIComponent(publicLink)}`;
      const response = await fetch(highResUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      const cleanSchool = (name || 'School').replace(/[^a-zA-Z0-9_-]/g, '_');
      a.download = `${cleanSchool}_Admission_QR_Code.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
      toast.success('QR Code image downloaded successfully!', { id: 'qr-toast' });
    } catch (err) {
      console.error('QR download error:', err);
      // Direct open fallback
      window.open(qrCodeImageUrl, '_blank');
      toast.success('QR code opened in new tab for saving.', { id: 'qr-toast' });
    } finally {
      setDownloadingQrOnly(false);
    }
  };

  // Save Branding to LocalStorage
  const handleSaveBranding = (e) => {
    if (e) e.preventDefault();
    setSavingBranding(true);
    try {
      const dataToSave = {
        name,
        tagline,
        phone,
        address,
        website,
        academicSession,
        posterTitle,
        posterSubtitle,
        primaryColor,
        secondaryColor,
        footerMessage,
        highlights,
        logo,
        ...visibility
      };
      localStorage.setItem('crm_qr_branding', JSON.stringify(dataToSave));
      setSavedSettings(dataToSave);
      toast.success('Studio Branding Settings Saved Successfully!');
    } catch (err) {
      toast.error('Failed to save settings');
    } finally {
      setSavingBranding(false);
    }
  };

  // Handle Logo Upload
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      toast.error('Logo file must be under 4MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setLogo(event.target.result);
      setLogoBase64(event.target.result);
      toast.success('Logo uploaded! Click "Save Studio Settings" to persist.');
    };
    reader.readAsDataURL(file);
  };

  const handleClearLogo = () => {
    setLogo('');
    setLogoBase64(null);
    toast.success('Logo cleared');
  };

  // Download High-Res Canvas Poster (PNG / PDF)
  const handleDownloadFlyer = async (format) => {
    const posterEl = document.getElementById('admission-poster-canvas') || document.getElementById('modal-poster-canvas');
    if (!posterEl) {
      toast.error('Poster canvas not found. Please refresh and try again.');
      return;
    }

    if (format === 'png') setDownloadingPng(true);
    if (format === 'pdf') setDownloadingPdf(true);

    try {
      toast.loading(`Preparing high-res ${format.toUpperCase()} export...`, { id: 'export-toast' });

      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }
      await new Promise((resolve) => setTimeout(resolve, 150));

      const canvas = await html2canvas(posterEl, {
        scale: 2.2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: effectiveBg,
        logging: false,
        onclone: (clonedDoc) => {
          // Clean OKLCH colors that might break html2canvas
          const styleTags = clonedDoc.querySelectorAll('style');
          styleTags.forEach((tag) => {
            let cssText = tag.textContent;
            if (cssText && (cssText.includes('oklch') || cssText.includes('oklab'))) {
              cssText = cssText.replace(/(oklch|oklab)\([^)]+\)/g, (match) => {
                try { return oklchToRgb(match); } catch { return 'rgb(0,0,0)'; }
              });
              tag.textContent = cssText;
            }
          });
          const allElements = clonedDoc.getElementsByTagName('*');
          for (const el of allElements) {
            const styleAttr = el.getAttribute('style');
            if (styleAttr && (styleAttr.includes('oklch') || styleAttr.includes('oklab'))) {
              el.setAttribute('style', styleAttr.replace(/(oklch|oklab)\([^)]+\)/g, (match) => {
                try { return oklchToRgb(match); } catch { return 'rgb(0,0,0)'; }
              }));
            }
          }
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const cleanSchool = (name || 'School').replace(/[^a-zA-Z0-9_-]/g, '_');

      if (format === 'pdf') {
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${cleanSchool}_Admission_Reception_Standee.pdf`);
        toast.success('A4 PDF Standee downloaded!', { id: 'export-toast' });
      } else {
        const link = document.createElement('a');
        link.href = imgData;
        link.download = `${cleanSchool}_Admission_Poster.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('High-Resolution PNG Poster downloaded!', { id: 'export-toast' });
      }
    } catch (err) {
      console.error('Export error:', err);
      toast.error(`Export failed: ${err.message || 'Rendering error'}`, { id: 'export-toast' });
    } finally {
      setDownloadingPng(false);
      setDownloadingPdf(false);
    }
  };

  // Direct Invisible Iframe Print Engine
  const handlePrintStandee = async () => {
    const posterEl = document.getElementById('admission-poster-canvas') || document.getElementById('modal-poster-canvas');
    if (!posterEl) {
      toast.error('Poster canvas not found');
      return;
    }

    toast.loading('Preparing Standee for print...', { id: 'print-toast' });

    try {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }
      await new Promise((resolve) => setTimeout(resolve, 150));

      const canvas = await html2canvas(posterEl, {
        scale: 2.2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: effectiveBg,
        logging: false,
        onclone: (clonedDoc) => {
          const styleTags = clonedDoc.querySelectorAll('style');
          styleTags.forEach((tag) => {
            let cssText = tag.textContent;
            if (cssText && (cssText.includes('oklch') || cssText.includes('oklab'))) {
              cssText = cssText.replace(/(oklch|oklab)\([^)]+\)/g, (match) => {
                try { return oklchToRgb(match); } catch { return 'rgb(0,0,0)'; }
              });
              tag.textContent = cssText;
            }
          });
        }
      });

      const imgData = canvas.toDataURL('image/png');

      const existingIframe = document.getElementById('poster-print-iframe');
      if (existingIframe) existingIframe.remove();

      const printIframe = document.createElement('iframe');
      printIframe.id = 'poster-print-iframe';
      printIframe.style.position = 'fixed';
      printIframe.style.right = '0';
      printIframe.style.bottom = '0';
      printIframe.style.width = '0';
      printIframe.style.height = '0';
      printIframe.style.border = '0';
      document.body.appendChild(printIframe);

      const doc = printIframe.contentWindow.document;
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print Admission Reception Standee</title>
            <style>
              @page { size: A4 portrait; margin: 0; }
              body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: white; }
              img { width: 100%; height: auto; max-height: 100vh; object-fit: contain; }
            </style>
          </head>
          <body>
            <img src="${imgData}" onload="window.focus(); window.print();" />
          </body>
        </html>
      `);
      doc.close();
      toast.success('Print dialog opened!', { id: 'print-toast' });
    } catch (err) {
      console.error('Print error:', err);
      toast.error('Failed to prepare print document', { id: 'print-toast' });
    }
  };

  // Render Canvas with All 5 Distinct Templates
  const renderPosterCanvas = (scaleVal, canvasId) => {
    const displayLogo = logoBase64 || logo;
    const displayQr = qrBase64 || qrCodeImageUrl;
    const displayTitle = posterTitle.trim() || 'Admission Enquiry Portal';

    return (
      <div
        id={canvasId}
        style={{
          width: `${posterDims.width}px`,
          height: `${posterDims.height}px`,
          transform: `scale(${scaleVal})`,
          transformOrigin: 'top left',
          backgroundColor: effectiveBg,
          color: effectiveTextColor,
          fontFamily: selectedTemplate === 'luxury-black' ? "'Georgia', serif" : "'Inter', sans-serif"
        }}
        className="p-14 flex flex-col justify-between items-center text-center relative shrink-0 transition-all duration-200 select-none"
      >
        {/* TEMPLATE 1: MODERN PREMIUM */}
        {selectedTemplate === 'modern-premium' && (
          <>
            <div
              style={{
                background: posterTheme === 'bw'
                  ? '#000000'
                  : `linear-gradient(to right, ${effectivePrimary}, ${effectiveSecondary})`
              }}
              className="absolute top-0 inset-x-0 h-4"
            />

            {/* School Header */}
            <div className="w-full flex flex-col items-center space-y-3 pt-4">
              {visibility.showLogo && (
                displayLogo ? (
                  <img src={displayLogo} crossOrigin="anonymous" className="h-28 w-28 object-contain p-2 rounded-2xl bg-slate-50 border shadow-xs" alt="logo" />
                ) : (
                  <div style={{ color: effectivePrimary }} className="h-24 w-24 bg-indigo-50 border rounded-2xl flex items-center justify-center font-black text-3xl">
                    JD
                  </div>
                )
              )}
              {visibility.showName && (
                <div className="space-y-1.5">
                  <h2 style={{ color: effectiveTextColor }} className="text-4xl font-black tracking-tight uppercase leading-snug">
                    {name}
                  </h2>
                  {visibility.showTagline && tagline && (
                    <span
                      style={{
                        backgroundColor: posterTheme === 'bw' ? '#f3f4f6' : `${effectivePrimary}15`,
                        borderColor: posterTheme === 'bw' ? '#d1d5db' : `${effectivePrimary}30`,
                        color: effectiveTextColor
                      }}
                      className="py-1 px-4 border rounded-full font-bold text-xs uppercase tracking-widest block w-fit mx-auto"
                    >
                      {tagline}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Central QR Frame */}
            <div className="w-full flex flex-col items-center space-y-4 my-auto">
              <div className="space-y-1.5">
                {visibility.showAcademicSession && (
                  <span style={{ color: effectivePrimary }} className="text-sm font-black tracking-widest uppercase block">
                    Admissions Open {academicSession}
                  </span>
                )}
                <h1
                  style={posterTheme === 'bw' ? { color: effectiveTextColor } : {
                    background: `linear-gradient(to right, ${effectivePrimary}, ${effectiveSecondary})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                  className="text-4xl font-black uppercase tracking-tight leading-none"
                >
                  {displayTitle}
                </h1>
                {posterSubtitle.trim() && (
                  <p style={{ color: effectiveSecondary }} className="text-base font-bold tracking-wide uppercase mt-1">
                    {posterSubtitle}
                  </p>
                )}
              </div>

              <div className="p-5 bg-white border-2 border-slate-900 rounded-3xl shadow-xl flex items-center justify-center">
                <img src={displayQr} crossOrigin="anonymous" className="h-56 w-56 object-contain" alt="QR" />
              </div>
              <span style={{ color: effectiveTextColor }} className="text-xs font-bold tracking-wider uppercase opacity-75">
                Scan QR code with phone camera to apply online
              </span>
            </div>

            {/* Highlights Box */}
            {visibility.showHighlights && highlights.length > 0 && (
              <div className="w-full max-w-2xl py-4 px-8 bg-slate-50 border border-slate-200 rounded-2xl text-left space-y-2.5 my-auto">
                <span style={{ color: effectiveTextColor }} className="text-xs font-black uppercase tracking-widest block">
                  Why Choose Our School
                </span>
                <ul style={{ color: effectiveTextColor }} className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm font-semibold opacity-90">
                  {highlights.filter(h => h.trim()).map((highlight, idx) => (
                    <li key={idx} className="flex gap-2 items-center">
                      <span style={{ color: effectivePrimary }}>✦</span>
                      <span className="truncate">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Footer Contact bar */}
            <div style={{ color: effectiveTextColor }} className="w-full border-t pt-4 flex flex-col items-center space-y-2 text-xs font-semibold opacity-85">
              <div className="flex gap-6">
                {visibility.showWebsite && website && <span>🌐 {website}</span>}
                {visibility.showContact && phone && <span>📞 {phone}</span>}
              </div>
              {visibility.showAddress && address && (
                <span className="opacity-80 text-[11px] truncate max-w-full">📍 {address}</span>
              )}
              {footerMessage && (
                <p style={{ borderColor: effectiveTextColor }} className="text-[10px] italic pt-1.5 border-t w-full border-dashed opacity-75">
                  {footerMessage}
                </p>
              )}
            </div>
          </>
        )}

        {/* TEMPLATE 2: CORPORATE SPLIT */}
        {selectedTemplate === 'corporate-split' && (
          <div style={{ color: effectiveTextColor }} className="w-full h-full flex flex-col justify-between py-2 text-left">
            <div className="flex justify-between items-center border-b-4 border-indigo-900/10 pb-5">
              {visibility.showName && (
                <div className="space-y-1">
                  <h2 style={{ color: effectiveTextColor }} className="text-4xl font-black tracking-tight uppercase leading-tight">
                    {name}
                  </h2>
                  {visibility.showTagline && tagline && (
                    <span className="text-xs font-bold uppercase tracking-wider block opacity-75">
                      {tagline}
                    </span>
                  )}
                </div>
              )}
              {visibility.showLogo && (
                displayLogo ? (
                  <img src={displayLogo} crossOrigin="anonymous" className="h-24 w-24 object-contain p-1 bg-white border rounded-2xl shadow-xs shrink-0" alt="logo" />
                ) : (
                  <div style={{ color: effectivePrimary }} className="h-20 w-20 bg-indigo-50 border rounded-2xl flex items-center justify-center font-black text-2xl shrink-0">
                    JD
                  </div>
                )
              )}
            </div>

            {/* Split Grid */}
            <div className="grid grid-cols-12 gap-8 my-auto items-center py-4">
              <div className="col-span-5 flex flex-col items-center space-y-3">
                <div style={{ borderColor: effectivePrimary }} className="p-5 bg-white border-2 rounded-3xl flex items-center justify-center shadow-lg">
                  <img src={displayQr} crossOrigin="anonymous" className="h-52 w-52 object-contain" alt="QR" />
                </div>
                <span className="text-[11px] font-black tracking-wider uppercase text-center opacity-75">
                  Scan to Apply Online
                </span>
              </div>

              <div className="col-span-7 space-y-4">
                <div className="space-y-1.5">
                  {visibility.showAcademicSession && (
                    <span
                      style={{
                        backgroundColor: posterTheme === 'bw' ? '#f3f4f6' : `${effectiveSecondary}20`,
                        color: effectiveTextColor
                      }}
                      className="inline-block py-1 px-3.5 font-black text-xs uppercase tracking-widest rounded-lg"
                    >
                      Admissions Open {academicSession}
                    </span>
                  )}
                  <h1 style={{ color: effectiveTextColor }} className="text-4xl font-black uppercase tracking-tight leading-snug">
                    {displayTitle}
                  </h1>
                  {posterSubtitle.trim() && (
                    <p style={{ color: effectiveSecondary }} className="text-sm font-bold tracking-wide uppercase mt-1">
                      {posterSubtitle}
                    </p>
                  )}
                </div>

                {visibility.showHighlights && highlights.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    <ul className="space-y-2 text-sm font-semibold opacity-85">
                      {highlights.filter(h => h.trim()).map((highlight, idx) => (
                        <li key={idx} className="flex gap-2 items-center">
                          <span style={{ color: effectiveSecondary }}>✔</span>
                          <span className="truncate">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t pt-4 flex flex-col justify-between items-center gap-2 text-xs font-bold opacity-80">
              <div className="flex justify-between w-full">
                {visibility.showWebsite && website && <span>🌐 {website}</span>}
                {visibility.showContact && phone && <span>📞 {phone}</span>}
              </div>
              {visibility.showAddress && address && (
                <span className="opacity-75 font-semibold truncate max-w-full">📍 {address}</span>
              )}
              {footerMessage && (
                <div style={{ borderColor: effectiveTextColor }} className="w-full text-center text-[10px] italic pt-1.5 border-t border-dashed opacity-75">
                  {footerMessage}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TEMPLATE 3: LUXURY BLACK */}
        {selectedTemplate === 'luxury-black' && (
          <>
            <div className="absolute inset-0 border border-amber-500/25 m-4 pointer-events-none rounded-2xl" />

            <div className="w-full flex flex-col items-center space-y-3 pt-3">
              {visibility.showLogo && (
                displayLogo ? (
                  <img src={displayLogo} crossOrigin="anonymous" className="h-28 w-28 object-contain p-2 rounded-full bg-white/10 border border-amber-500/30" alt="logo" />
                ) : (
                  <div className="h-24 w-24 bg-amber-500/10 border border-amber-500/40 rounded-full flex items-center justify-center font-black text-amber-400 text-2xl">
                    JD
                  </div>
                )
              )}
              {visibility.showName && (
                <div className="space-y-1.5">
                  <h2 style={{ color: effectiveSecondary }} className="text-4xl font-black tracking-widest uppercase leading-snug">
                    {name}
                  </h2>
                  {visibility.showTagline && tagline && (
                    <span className="text-xs uppercase tracking-widest block font-bold font-sans opacity-70">
                      {tagline}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="w-full flex flex-col items-center space-y-4 my-auto">
              <div className="space-y-1.5">
                {visibility.showAcademicSession && (
                  <span style={{ color: effectiveSecondary }} className="text-sm font-bold tracking-widest uppercase block font-sans">
                    Admissions Open {academicSession}
                  </span>
                )}
                <h1 style={{ color: effectiveTextColor }} className="text-4xl font-extrabold uppercase tracking-tight leading-none">
                  {displayTitle}
                </h1>
                {posterSubtitle.trim() && (
                  <p style={{ color: effectiveSecondary }} className="text-base font-bold tracking-wide uppercase mt-1">
                    {posterSubtitle}
                  </p>
                )}
              </div>

              <div className="p-5 bg-white rounded-3xl border-2 border-amber-500/50 shadow-2xl flex items-center justify-center">
                <img src={displayQr} crossOrigin="anonymous" className="h-56 w-56 object-contain" alt="QR" />
              </div>
              <span className="text-xs tracking-wider uppercase opacity-70 font-sans">
                Scan QR code to apply online
              </span>
            </div>

            {visibility.showHighlights && highlights.length > 0 && (
              <div className="w-full max-w-2xl py-4 px-8 bg-white/5 border border-white/15 rounded-2xl text-left space-y-2.5 my-auto">
                <span style={{ color: effectiveSecondary }} className="text-xs font-bold uppercase tracking-widest block font-sans">
                  Highlights
                </span>
                <ul className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm font-medium font-sans opacity-85">
                  {highlights.filter(h => h.trim()).map((highlight, idx) => (
                    <li key={idx} className="flex gap-2 items-center">
                      <span style={{ color: effectiveSecondary }}>✦</span>
                      <span className="truncate">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="w-full border-t border-white/15 pt-4 flex flex-col items-center space-y-2 text-xs font-medium font-sans opacity-80">
              <div className="flex gap-6">
                {visibility.showWebsite && website && <span>🌐 {website}</span>}
                {visibility.showContact && phone && <span>📞 {phone}</span>}
              </div>
              {visibility.showAddress && address && (
                <span className="opacity-80 text-[11px] truncate max-w-full">📍 {address}</span>
              )}
              {footerMessage && (
                <p className="text-[10px] italic pt-1.5 border-t border-white/15 w-full text-center opacity-70">
                  {footerMessage}
                </p>
              )}
            </div>
          </>
        )}

        {/* TEMPLATE 4: COLOR BURST */}
        {selectedTemplate === 'color-burst' && (
          <div style={{ color: effectiveTextColor }} className="w-full h-full flex flex-col justify-between py-2 relative z-10 font-sans">
            <div className="w-full p-5 bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl flex items-center justify-between gap-4">
              {visibility.showName && (
                <div className="text-left space-y-1">
                  <h2 className="text-3xl font-extrabold tracking-tight uppercase leading-none">
                    {name}
                  </h2>
                  {visibility.showTagline && tagline && (
                    <span style={{ color: posterTheme === 'bw' ? '#ffffff' : '#f59e0b' }} className="text-xs font-bold uppercase tracking-widest block">
                      {tagline}
                    </span>
                  )}
                </div>
              )}
              {visibility.showLogo && (
                displayLogo ? (
                  <img src={displayLogo} crossOrigin="anonymous" className="h-16 w-16 object-contain p-1 bg-white/90 border rounded-xl shrink-0" alt="logo" />
                ) : (
                  <div className="h-16 w-16 bg-white/20 rounded-xl flex items-center justify-center font-black text-xl shrink-0">
                    JD
                  </div>
                )
              )}
            </div>

            <div className="flex flex-col items-center space-y-4 my-auto">
              <div className="space-y-1.5">
                {visibility.showAcademicSession && (
                  <div
                    style={{
                      backgroundColor: posterTheme === 'bw' ? '#ffffff' : '#f59e0b',
                      color: posterTheme === 'bw' ? '#000000' : '#1e1b4b'
                    }}
                    className="py-1 px-4 rounded-full font-black text-xs uppercase tracking-widest inline-block shadow-sm"
                  >
                    Admissions Open {academicSession}
                  </div>
                )}
                <h1 className="text-4xl font-black uppercase tracking-tight leading-none">
                  {displayTitle}
                </h1>
                {posterSubtitle.trim() && (
                  <p style={{ color: posterTheme === 'bw' ? '#ffffff' : '#f59e0b' }} className="text-base font-bold tracking-wide uppercase mt-1">
                    {posterSubtitle}
                  </p>
                )}
              </div>

              <div className="p-5 bg-white border-2 border-white/40 rounded-3xl shadow-2xl flex items-center justify-center">
                <img src={displayQr} crossOrigin="anonymous" className="h-56 w-56 object-contain" alt="QR" />
              </div>
              <span className="text-xs font-bold tracking-wider uppercase opacity-85">
                Scan QR code to Apply Now
              </span>
            </div>

            {visibility.showHighlights && highlights.length > 0 && (
              <div className="grid grid-cols-2 gap-3.5 text-left w-full my-auto">
                {highlights.filter(h => h.trim()).slice(0, 4).map((highlight, idx) => (
                  <div key={idx} className="p-3.5 bg-white/15 border border-white/20 rounded-xl backdrop-blur-md">
                    <span style={{ color: posterTheme === 'bw' ? '#ffffff' : '#f59e0b' }} className="text-[10px] font-bold uppercase tracking-widest block mb-1">
                      Feature
                    </span>
                    <p className="text-xs leading-snug font-semibold opacity-95">{highlight}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-white/20 pt-4 grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs font-bold opacity-85">
              {visibility.showWebsite && website && <span className="text-left">🌐 {website}</span>}
              {visibility.showContact && phone && <span className="text-right">📞 {phone}</span>}
              {visibility.showAddress && address && (
                <span className="col-span-2 text-center text-[11px] truncate pt-1 opacity-85">📍 {address}</span>
              )}
              {footerMessage && (
                <p className="col-span-2 text-center text-[10px] italic pt-1 border-t border-white/10 opacity-75">{footerMessage}</p>
              )}
            </div>
          </div>
        )}

        {/* TEMPLATE 5: CREATIVE GRADIENT */}
        {selectedTemplate === 'creative-gradient' && (
          <div
            style={{ color: effectiveTextColor }}
            className={`w-full h-full flex flex-col justify-between py-2 relative z-10 p-10 rounded-2xl ${
              posterTheme === 'bw'
                ? 'bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200 border border-slate-200'
                : 'bg-gradient-to-br from-indigo-700 via-indigo-900 to-cyan-800'
            }`}
          >
            <div className="w-full flex items-center justify-between border-b border-white/15 pb-4">
              {visibility.showName && (
                <div className="text-left space-y-1">
                  <h2 className="text-3xl font-extrabold tracking-tight uppercase">
                    {name}
                  </h2>
                  {visibility.showTagline && tagline && (
                    <span className={`text-xs font-bold uppercase tracking-widest block ${posterTheme === 'bw' ? 'opacity-70' : 'text-cyan-300'}`}>
                      {tagline}
                    </span>
                  )}
                </div>
              )}
              {visibility.showLogo && (
                displayLogo ? (
                  <img src={displayLogo} crossOrigin="anonymous" className="h-16 w-16 object-contain p-1 bg-white rounded-xl shrink-0" alt="logo" />
                ) : (
                  <div className={`h-16 w-16 rounded-xl flex items-center justify-center font-black text-xl shrink-0 ${posterTheme === 'bw' ? 'bg-slate-200 text-slate-700' : 'bg-white/20 text-white'}`}>
                    JD
                  </div>
                )
              )}
            </div>

            <div className="flex flex-col items-center space-y-4 my-auto">
              <div className="space-y-1.5 text-center">
                {visibility.showAcademicSession && (
                  <span
                    style={{
                      backgroundColor: posterTheme === 'bw' ? '#1f2937' : '#22d3ee',
                      color: '#ffffff'
                    }}
                    className="py-1 px-4 rounded-full font-black text-xs uppercase tracking-widest inline-block shadow-sm"
                  >
                    Admissions Open {academicSession}
                  </span>
                )}
                <h1 className="text-4xl font-black uppercase tracking-tight leading-none">
                  {displayTitle}
                </h1>
                {posterSubtitle.trim() && (
                  <p style={{ color: posterTheme === 'bw' ? '#ffffff' : '#22d3ee' }} className="text-base font-bold tracking-wide uppercase mt-1">
                    {posterSubtitle}
                  </p>
                )}
              </div>

              <div className="p-5 bg-white rounded-3xl shadow-2xl flex items-center justify-center">
                <img src={displayQr} crossOrigin="anonymous" className="h-56 w-56 object-contain" alt="QR" />
              </div>
              <span className="text-xs font-bold tracking-wider uppercase opacity-80">
                Scan with smartphone to register
              </span>
            </div>

            {visibility.showHighlights && highlights.length > 0 && (
              <div className="w-full py-4 px-6 bg-white/10 border border-white/15 rounded-xl backdrop-blur-sm text-left my-auto">
                <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs font-semibold opacity-90">
                  {highlights.filter(h => h.trim()).map((highlight, idx) => (
                    <li key={idx} className="flex gap-2 items-center">
                      <span className={posterTheme === 'bw' ? 'text-slate-700' : 'text-cyan-300'}>✦</span>
                      <span className="truncate">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="w-full border-t border-white/15 pt-4 flex flex-col items-center space-y-1.5 text-xs font-semibold opacity-85">
              <div className="flex justify-between w-full">
                {visibility.showWebsite && website && <span>🌐 {website}</span>}
                {visibility.showContact && phone && <span>📞 {phone}</span>}
              </div>
              {visibility.showAddress && address && (
                <span className="opacity-80 text-[11px] truncate max-w-full">📍 {address}</span>
              )}
              {footerMessage && (
                <p className="text-[10px] italic pt-1 border-t border-white/15 w-full text-center opacity-70">
                  {footerMessage}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 pb-16">
      {/* Top Breadcrumb Toolbar */}
      <div className="bg-white border-b border-slate-200 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-xs sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base md:text-lg font-bold text-slate-900 leading-tight">
              QR Code & Admission Links Studio
            </h1>
            <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
              <button onClick={() => onNavigate && onNavigate('/')} className="hover:text-indigo-600 transition-colors">
                <Home className="w-3.5 h-3.5" />
              </button>
              <span>•</span>
              <button onClick={() => onNavigate && onNavigate('/crm')} className="hover:text-indigo-600 transition-colors">
                CRM
              </button>
              <span>•</span>
              <span className="text-indigo-600 font-semibold">QR Code & Poster Generator</span>
            </div>
          </div>
        </div>

        {/* Top Header Actions */}
        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            onClick={handleDownloadQrOnly}
            disabled={downloadingQrOnly}
            className="h-9 px-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center space-x-1.5 shadow-xs text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600" />
            <span>Download QR Only</span>
          </button>
          <button
            type="button"
            onClick={handlePrintStandee}
            className="h-9 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center space-x-1.5 shadow-sm text-xs font-bold transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Standee (A4)</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 space-y-6">

        {/* SECTION 1: PUBLIC & FRONT DESK LINKS CARD */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                <LinkIcon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Official Admission Enquiry Links</h3>
                <p className="text-xs text-slate-500">Live URLs for parent online registration & reception kiosk tablet entry</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Share URL</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Public Link */}
            <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Public Parent Admission Portal
                </span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100/60 px-2 py-0.5 rounded">
                  Social & WhatsApp
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-1.5 pl-3">
                <span className="truncate flex-1 font-mono text-xs text-slate-600 select-all">{publicLink}</span>
                <button
                  type="button"
                  onClick={() => handleCopyLink(publicLink, setCopyingPublic)}
                  className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md text-slate-700 text-xs font-bold shrink-0 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copyingPublic ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                  <span>{copyingPublic ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.open(publicLink, '_blank')}
                  className="p-1.5 hover:bg-slate-100 rounded-md text-slate-600 shrink-0 transition-colors"
                  title="Open Form in New Tab"
                >
                  <ExternalLink className="w-4 h-4 text-indigo-600" />
                </button>
              </div>
            </div>

            {/* Reception Kiosk Link */}
            <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Front Desk Kiosk Enquiry Link
                </span>
                <span className="text-[10px] text-amber-700 font-bold bg-amber-100/60 px-2 py-0.5 rounded">
                  Reception Tablet
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-1.5 pl-3">
                <span className="truncate flex-1 font-mono text-xs text-slate-600 select-all">{receptionLink}</span>
                <button
                  type="button"
                  onClick={() => handleCopyLink(receptionLink, setCopyingReception)}
                  className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md text-slate-700 text-xs font-bold shrink-0 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copyingReception ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                  <span>{copyingReception ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.open(receptionLink, '_blank')}
                  className="p-1.5 hover:bg-slate-100 rounded-md text-slate-600 shrink-0 transition-colors"
                  title="Open Reception Mode in New Tab"
                >
                  <ExternalLink className="w-4 h-4 text-indigo-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: TEMPLATE SELECTOR STRIP */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Layout className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm">Choose Poster Layout & Design</h3>
            </div>
            {/* Monochrome vs Brand Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setPosterTheme('brand')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  posterTheme === 'brand' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Brand Colors
              </button>
              <button
                type="button"
                onClick={() => setPosterTheme('bw')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  posterTheme === 'bw' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Black & White
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-1">
            {TEMPLATE_REGISTRY.map((tmpl) => {
              const isSelected = selectedTemplate === tmpl.id;
              return (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => setSelectedTemplate(tmpl.id)}
                  className={`p-3 rounded-xl border-2 text-left flex flex-col items-center justify-center gap-2.5 transition-all cursor-pointer relative ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/40 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                  }`}
                >
                  {tmpl.thumbnail}
                  <span className={`text-xs font-bold text-center block ${isSelected ? 'text-indigo-700' : 'text-slate-700'}`}>
                    {tmpl.name}
                  </span>
                  {isSelected && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-indigo-200" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 3: 2-COLUMN STUDIO (Left: Controls, Right: Sticky Live Preview) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* LEFT COLUMN: EDITABLE BRANDING STUDIO (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">

            {/* Accordion 1: Branding Identity */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <button
                type="button"
                onClick={() => setExpandedSection(expandedSection === 'branding' ? '' : 'branding')}
                className="w-full flex items-center justify-between p-4 px-5 text-left font-bold text-slate-800 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-none">School Identity & Logo</h4>
                    <p className="text-xs text-slate-500 font-normal mt-1">School name, affiliation tagline and crest logo</p>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${expandedSection === 'branding' ? 'rotate-90 text-indigo-600' : ''}`} />
              </button>

              {expandedSection === 'branding' && (
                <div className="p-5 border-t border-slate-100 space-y-4 bg-white">
                  {/* Logo Upload Row */}
                  <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                      {logo ? (
                        <img src={logo} alt="Logo" className="w-full h-full object-contain p-1" />
                      ) : (
                        <span className="text-[10px] text-slate-400 font-bold">No Logo</span>
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <span className="text-xs font-bold text-slate-700 block">School Crest / Logo Image</span>
                      <div className="flex items-center gap-2">
                        <label className="h-8 px-3 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors">
                          <Upload className="w-3.5 h-3.5 text-slate-500" />
                          <span>Upload File</span>
                          <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                        </label>
                        {logo && (
                          <button
                            type="button"
                            onClick={handleClearLogo}
                            className="h-8 px-3 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-xs font-bold text-red-600 flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <Input
                    label="School Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. J D INTERNATIONAL SCHOOL"
                  />
                  <Input
                    label="School Tagline / Affiliation"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g. Affiliated to CBSE, New Delhi"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase mb-1">
                        Primary Brand Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="w-10 h-10 rounded-lg border border-slate-300 cursor-pointer p-0.5"
                        />
                        <span className="font-mono text-xs text-slate-600 font-bold">{primaryColor}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase mb-1">
                        Secondary Accent Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={secondaryColor}
                          onChange={(e) => setSecondaryColor(e.target.value)}
                          className="w-10 h-10 rounded-lg border border-slate-300 cursor-pointer p-0.5"
                        />
                        <span className="font-mono text-xs text-slate-600 font-bold">{secondaryColor}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 2: Poster Text & Session */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <button
                type="button"
                onClick={() => setExpandedSection(expandedSection === 'content' ? '' : 'content')}
                className="w-full flex items-center justify-between p-4 px-5 text-left font-bold text-slate-800 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-none">Poster Headings & Academic Session</h4>
                    <p className="text-xs text-slate-500 font-normal mt-1">Main announcement title, subheadings, and academic session</p>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${expandedSection === 'content' ? 'rotate-90 text-indigo-600' : ''}`} />
              </button>

              {expandedSection === 'content' && (
                <div className="p-5 border-t border-slate-100 space-y-4 bg-white">
                  <Input
                    label="Main Announcement Title"
                    value={posterTitle}
                    onChange={(e) => setPosterTitle(e.target.value)}
                    placeholder="e.g. Student Admission Portal"
                  />
                  <Input
                    label="Subtitle / Classes"
                    value={posterSubtitle}
                    onChange={(e) => setPosterSubtitle(e.target.value)}
                    placeholder="e.g. Pre-Nursery to Grade XII Admissions Open"
                  />
                  <Input
                    label="Academic Session"
                    value={academicSession}
                    onChange={(e) => setAcademicSession(e.target.value)}
                    placeholder="e.g. 2026-2027"
                  />
                </div>
              )}
            </div>

            {/* Accordion 3: Contact & Campus Address */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <button
                type="button"
                onClick={() => setExpandedSection(expandedSection === 'contact' ? '' : 'contact')}
                className="w-full flex items-center justify-between p-4 px-5 text-left font-bold text-slate-800 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-none">Contact Details & Campus Address</h4>
                    <p className="text-xs text-slate-500 font-normal mt-1">Reception helpline phone numbers, website URL and campus address</p>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${expandedSection === 'contact' ? 'rotate-90 text-indigo-600' : ''}`} />
              </button>

              {expandedSection === 'contact' && (
                <div className="p-5 border-t border-slate-100 space-y-4 bg-white">
                  <Input
                    label="Helpline Phone Number(s)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 89479 19195 / 98765 43210"
                  />
                  <Input
                    label="Official School Website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="www.jdinternationalschool.edu.in"
                  />
                  <Input
                    label="Campus Address"
                    type="textarea"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Sector 12, Main Ring Road, Jaipur"
                  />
                </div>
              )}
            </div>

            {/* Accordion 4: Highlights & USPs */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <button
                type="button"
                onClick={() => setExpandedSection(expandedSection === 'highlights' ? '' : 'highlights')}
                className="w-full flex items-center justify-between p-4 px-5 text-left font-bold text-slate-800 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-none">Why Choose Our School (USPs)</h4>
                    <p className="text-xs text-slate-500 font-normal mt-1">Key bullet points and footer greeting</p>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${expandedSection === 'highlights' ? 'rotate-90 text-indigo-600' : ''}`} />
              </button>

              {expandedSection === 'highlights' && (
                <div className="p-5 border-t border-slate-100 space-y-4 bg-white">
                  <Input
                    label="Highlights (One point per line)"
                    type="textarea"
                    value={highlights.join('\n')}
                    onChange={(e) => setHighlights(e.target.value.split('\n'))}
                    placeholder="Experienced CBSE Faculty&#10;Smart Classrooms & STEM Labs&#10;Safe CCTV Campus"
                    rows={4}
                  />
                  <Input
                    label="Footer Greeting Message"
                    type="textarea"
                    value={footerMessage}
                    onChange={(e) => setFooterMessage(e.target.value)}
                    placeholder="Thank You For Visiting Our School. We Look Forward To Welcoming Your Child."
                    rows={2}
                  />
                </div>
              )}
            </div>

            {/* Accordion 5: Visibility Controls */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <button
                type="button"
                onClick={() => setExpandedSection(expandedSection === 'visibility' ? '' : 'visibility')}
                className="w-full flex items-center justify-between p-4 px-5 text-left font-bold text-slate-800 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-pink-50 text-pink-600">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-none">Elements Visibility Toggles</h4>
                    <p className="text-xs text-slate-500 font-normal mt-1">Show or hide specific poster components</p>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${expandedSection === 'visibility' ? 'rotate-90 text-indigo-600' : ''}`} />
              </button>

              {expandedSection === 'visibility' && (
                <div className="p-5 border-t border-slate-100 bg-white">
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { key: 'showLogo', label: 'School Crest Logo' },
                      { key: 'showName', label: 'School Name' },
                      { key: 'showTagline', label: 'Affiliation Tagline' },
                      { key: 'showContact', label: 'Phone Numbers' },
                      { key: 'showWebsite', label: 'Website URL' },
                      { key: 'showAddress', label: 'Address Bar' },
                      { key: 'showAcademicSession', label: 'Academic Session' },
                      { key: 'showHighlights', label: 'Highlights List' },
                    ].map((item) => (
                      <label key={item.key} className="flex items-center space-x-2.5 cursor-pointer bg-slate-50 hover:bg-slate-100/80 p-2.5 rounded-xl border border-slate-200 transition-colors">
                        <input
                          type="checkbox"
                          checked={visibility[item.key]}
                          onChange={(e) => setVisibility({ ...visibility, [item.key]: e.target.checked })}
                          className="rounded text-indigo-600 focus:ring-indigo-500/20 w-4 h-4 cursor-pointer"
                        />
                        <span className="text-xs font-semibold text-slate-700 truncate">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Save Studio Settings Bar */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <span className="text-xs text-slate-500 font-semibold">
                Permanent Studio Branding Profile
              </span>
              <Button
                type="button"
                onClick={handleSaveBranding}
                isLoading={savingBranding}
                className="h-10 px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                Save Studio Settings
              </Button>
            </div>

          </div>

          {/* RIGHT COLUMN: STICKY LIVE POSTER CANVAS & EXPORT (5 Cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">

            {/* Poster Canvas Preview Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <Layout className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Live Standee Preview</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFullScreen(true)}
                  title="Full Screen Preview"
                  className="h-7 w-7 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-indigo-600 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Scaled Preview Frame */}
              <div className="bg-slate-100/80 rounded-xl p-3 flex items-center justify-center min-h-[460px] max-h-[580px] overflow-hidden border border-slate-200/80 relative">
                <div
                  style={{
                    width: `${posterDims.width * 0.44}px`,
                    height: `${posterDims.height * 0.44}px`,
                    overflow: 'hidden'
                  }}
                  className="rounded-xl shadow-md border border-slate-200 bg-white shrink-0 transition-all duration-300"
                >
                  {renderPosterCanvas(0.44, 'admission-poster-canvas')}
                </div>
              </div>
            </div>

            {/* Export & Download Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <Download className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Export Admission Standee & Flyers
                </span>
              </div>

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => handleDownloadFlyer('png')}
                  disabled={downloadingPng || downloadingPdf}
                  className="w-full h-11 justify-center text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                >
                  {downloadingPng ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Exporting High-Res PNG...</span>
                    </span>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download Poster Image (PNG)</span>
                    </>
                  )}
                </button>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleDownloadFlyer('pdf')}
                    disabled={downloadingPng || downloadingPdf}
                    className="w-full h-10 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-2xs disabled:opacity-50 cursor-pointer"
                  >
                    {downloadingPdf ? (
                      <span className="flex items-center gap-1.5">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-500" />
                        <span>Rendering...</span>
                      </span>
                    ) : (
                      <>
                        <FileText className="w-3.5 h-3.5 text-indigo-600" />
                        <span>A4 PDF Flyer</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handlePrintStandee}
                    className="w-full h-10 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Print Standee</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-indigo-50/50 rounded-2xl border border-indigo-100 p-4 space-y-2 text-xs text-indigo-900">
              <span className="font-bold flex items-center gap-1.5 text-indigo-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Standee Best Practices
              </span>
              <ul className="space-y-1 text-slate-600 list-disc pl-4 text-[11px] leading-relaxed">
                <li>Place the printed A4 reception standee prominently at the main gate & front desk.</li>
                <li>The QR code points directly to your school admission enquiry form.</li>
                <li>Share the public URL on your school’s Instagram bio & admission WhatsApp broadcast.</li>
              </ul>
            </div>

          </div>

        </div>

      </div>

      {/* FULL SCREEN PREVIEW MODAL */}
      {isFullScreen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">Full Screen Preview — {TEMPLATE_REGISTRY.find(t => t.id === selectedTemplate)?.name}</span>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">A4 Portrait</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrintStandee}
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsFullScreen(false)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-6 bg-slate-100 flex items-center justify-center">
              <div
                style={{
                  width: `${posterDims.width * 0.7}px`,
                  height: `${posterDims.height * 0.7}px`,
                  overflow: 'hidden'
                }}
                className="rounded-xl shadow-xl border border-slate-300 bg-white shrink-0"
              >
                {renderPosterCanvas(0.7, 'modal-poster-canvas')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CrmQrLinksPage;
