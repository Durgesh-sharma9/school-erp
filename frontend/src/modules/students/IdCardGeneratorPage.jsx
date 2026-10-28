import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { tenantStore } from '../../services/tenantStore';
import {
  Printer,
  ChevronDown,
  X,
  Eye,
  SlidersHorizontal
} from 'lucide-react';
import { CbseEmblemSvg } from '../examination/reports/components/BoardLogo';



/**
 * 1:1 Pixel-Perfect J.D. International School PVC ID Card Component
 * Faithfully styled against physical student card reference:
 * - Top-Left: School Logo (from /school-info)
 * - Top-Right Corner: Board Logo / CBSE Emblem (from /school-info) + Affiliation No.
 * - Center: Bold Navy School Header + Red Medium + Address & Phone
 * - Purple divider bar
 * - Left: Portrait photo on red studio background
 * - Bold red student name + 5 light-blue rounded info stripes (F. Name, M. Name, D.O.B/SR No, Contact, Address)
 * - Bottom badges: Class badge, Dark navy Session badge, and Principal signature badge (from /school-info)
 */
export function JdStudentIdCard({ student, profile, cardType = 'Horizontal', session = '2026-27' }) {
  const schoolName = (profile?.schoolName || 'J.D.INTERNATIONAL SCHOOL').toUpperCase();
  const affNo = profile?.affiliationNo || '1730619';
  const address = profile?.address || 'Mahapura, Ajmer Road, Jaipur';
  const phone = profile?.phone1 || '8947919195';

  // 1. School Logo (strictly from /school-info brandingImages.school_logo or logoUrl)
  const schoolLogoUrl =
    profile?.brandingImages?.school_logo ||
    profile?.logoUrl ||
    'https://temp.erichost.app/assets/schools/jdisjr_221/school/1_school_photo_1766831297_f7516d5fc58b9af84fb1.jpg';

  // 2. Board Logo (strictly from /school-info brandingImages.board_logo or boardLogoUrl)
  const boardLogoUrl =
    profile?.brandingImages?.board_logo ||
    profile?.boardLogoUrl ||
    '';

  // 3. Principal Signature (strictly from /school-info brandingImages.principal_sig or principalSigUrl)
  const principalSigUrl =
    profile?.brandingImages?.principal_sig ||
    profile?.principalSigUrl ||
    '';

  const formatDob = (dobStr) => {
    if (!dobStr) return '28.09.2009';
    if (dobStr.includes('.')) return dobStr;
    try {
      const parts = dobStr.split('-');
      if (parts.length === 3) {
        if (parts[0].length === 4) return `${parts[2]}.${parts[1]}.${parts[0]}`;
        return `${parts[0]}.${parts[1]}.${parts[2]}`;
      }
    } catch {}
    return dobStr;
  };

  const isVertical = cardType === 'Vertical';

  if (isVertical) {
    return (
      <div
        className="jd-id-card jd-id-card-vertical relative bg-white rounded-2xl shadow-md border-2 border-slate-300 flex flex-col justify-between select-none p-2.5 print:shadow-none print:border-slate-400"
        style={{
          width: '100%',
          maxWidth: '260px',
          minHeight: '390px',
          boxSizing: 'border-box'
        }}
      >
        {/* Top Punch Slot */}
        <div className="w-10 h-2 bg-slate-300 rounded-full mx-auto -mt-1 mb-1.5 border border-slate-400/60 print:hidden" />

        {/* Header with School Logo (Left) + Board Logo (Right) */}
        <div className="text-center">
          <div className="flex justify-between items-center mb-1 px-1">
            {/* School Logo */}
            <div className="w-9 h-9 shrink-0 flex items-center justify-center">
              {schoolLogoUrl ? (
                <img
                  src={schoolLogoUrl}
                  alt="School Logo"
                  className="w-8 h-8 object-contain"
                  crossOrigin="anonymous"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#0c2461] text-amber-300 flex items-center justify-center text-[10px] font-black border border-amber-300">
                  JD
                </div>
              )}
            </div>

            <span className="text-[7.5px] font-bold text-slate-800 tracking-tight">
              (Aff. No. : {affNo})
            </span>

            {/* Board Logo in Right Top Corner */}
            <div className="w-9 h-9 shrink-0 flex items-center justify-center">
              {boardLogoUrl ? (
                <img
                  src={boardLogoUrl}
                  alt="Board Logo"
                  className="w-8 h-8 object-contain"
                  crossOrigin="anonymous"
                />
              ) : (
                <CbseEmblemSvg className="w-7 h-7" />
              )}
            </div>
          </div>

          <h2 className="text-[#0c2461] font-black text-[11.5px] uppercase leading-tight tracking-tight px-1">
            {schoolName}
          </h2>
          <p className="text-[#dc2626] font-bold text-[8.5px] leading-tight">
            Co-Educational - English Medium
          </p>
          <p className="text-slate-900 font-extrabold text-[7.5px] leading-tight mt-0.5">
            {address} | Mob. : {phone}
          </p>
          <div className="w-full h-[2px] bg-[#6b21a8] mt-1.5" />
        </div>

        {/* Photo + Name */}
        <div className="flex flex-col items-center my-1">
          <div className="w-20 h-24 bg-[#dc2626] rounded border border-slate-300 overflow-hidden flex items-center justify-center shadow-xs">
            {student.photoUrl ? (
              <img
                src={student.photoUrl}
                alt={student.name}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-b from-[#e11d48] to-[#b91c1c] flex flex-col items-center justify-end">
                <div className="w-9 h-9 rounded-full bg-[#fed7aa] border-2 border-[#ea580c] -mb-1 shadow-inner" />
                <div className="w-16 h-11 bg-[#facc15] rounded-t-full border-t border-[#ca8a04]" />
              </div>
            )}
          </div>
          <h3 className="text-[#dc2626] font-black text-xs uppercase tracking-wide text-center mt-1">
            {student.name}
          </h3>
        </div>

        {/* Info Bars */}
        <div className="space-y-1 text-[8.5px] text-[#0a194f]">
          <div className="bg-[#c8f0fb] rounded px-1.5 py-0.5 truncate">
            <span className="font-extrabold">F. Name : </span>
            <span className="font-bold">{student.fatherName || '-'}</span>
          </div>
          <div className="bg-[#c8f0fb] rounded px-1.5 py-0.5 truncate">
            <span className="font-extrabold">M. Name : </span>
            <span className="font-bold">{student.motherName || '-'}</span>
          </div>
          <div className="bg-[#c8f0fb] rounded px-1.5 py-0.5 flex justify-between">
            <span><strong>D.O.B. : </strong>{formatDob(student.dob)}</span>
            <span><strong>SR. No. : </strong>{student.srNo || student.admNo || '-'}</span>
          </div>
          <div className="bg-[#c8f0fb] rounded px-1.5 py-0.5 truncate">
            <span className="font-extrabold">Contact : </span>
            <span className="font-bold">{student.mobile || '-'}</span>
          </div>
          <div className="bg-[#c8f0fb] rounded px-1.5 py-0.5 truncate">
            <span className="font-extrabold">Address : </span>
            <span className="font-bold">{student.address || '-'}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex items-center justify-between">
          <div className="bg-[#c8f0fb] text-[#0a194f] font-extrabold text-[9px] px-2 py-0.5 rounded-xl">
            Class : {student.className}
          </div>
          <div className="bg-[#0c1a40] text-white font-black text-[9px] px-2.5 py-0.5 rounded-xl">
            Session : {session}
          </div>
          {/* Principal Badge with Signature (from /school-info) */}
          <div className="bg-[#c8f0fb] text-[#0a194f] px-2 py-0.5 rounded-xl text-center min-w-[62px]">
            {principalSigUrl ? (
              <img
                src={principalSigUrl}
                alt="Principal Sig."
                className="h-3.5 max-w-[55px] object-contain mx-auto -mb-0.5"
                crossOrigin="anonymous"
              />
            ) : (
              <span style={{ fontFamily: "'Brush Script MT', 'Segoe Script', cursive, sans-serif" }} className="text-xs italic block -mb-1">
                Abhilash
              </span>
            )}
            <span className="text-[7.5px] font-black uppercase">Principal</span>
          </div>
        </div>
      </div>
    );
  }

  // Horizontal Card (1:1 Reference match)
  return (
    <div
      className="jd-id-card jd-id-card-horizontal relative bg-white rounded-2xl shadow-md border-2 border-slate-300 flex flex-col justify-between select-none p-2 print:shadow-none print:border-slate-400 print:rounded-2xl"
      style={{
        width: '100%',
        maxWidth: '380px',
        minHeight: '232px',
        boxSizing: 'border-box'
      }}
    >
      {/* Top Punch Slot indicator */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-1 z-20 print:hidden">
        <div className="w-12 h-2 bg-slate-300 rounded-full border border-slate-400/60" />
      </div>

      {/* ─── CARD HEADER ─── */}
      <div className="pt-0.5 px-0.5">
        <div className="flex items-center gap-1.5 justify-between">
          {/* Left: School Logo (from /school-info) */}
          <div className="w-11 h-11 shrink-0 flex items-center justify-center">
            {schoolLogoUrl ? (
              <img
                src={schoolLogoUrl}
                alt="School Logo"
                className="w-10 h-10 object-contain shrink-0"
                crossOrigin="anonymous"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#0c2461] text-amber-400 flex items-center justify-center font-black text-xs border-2 border-amber-400 shadow-2xs">
                JD
              </div>
            )}
          </div>

          {/* Center: School Details */}
          <div className="flex-1 text-center px-1 min-w-0">
            <h2 className="text-[#0c2461] font-black text-[13px] leading-tight tracking-tight uppercase truncate">
              {schoolName}
            </h2>
            <p className="text-[#dc2626] font-bold text-[9px] leading-tight mt-0.5">
              Co-Educational - English Medium
            </p>
            <p className="text-slate-900 font-extrabold text-[7.5px] leading-tight mt-0.5 truncate">
              {address} | Mob. : {phone}
            </p>
          </div>

          {/* Right Top Corner: Board Logo (from /school-info) */}
          <div className="shrink-0 flex flex-col items-center justify-center pl-0.5">
            <div className="w-9 h-9 flex items-center justify-center">
              {boardLogoUrl ? (
                <img
                  src={boardLogoUrl}
                  alt="Board Logo"
                  className="w-full h-full object-contain"
                  crossOrigin="anonymous"
                />
              ) : (
                <CbseEmblemSvg className="w-8 h-8" />
              )}
            </div>
            <span className="text-[7px] font-bold text-slate-800 tracking-tight leading-none mt-0.5 whitespace-nowrap">
              (Aff. No. : {affNo})
            </span>
          </div>
        </div>

        {/* Purple Accent Divider Line */}
        <div className="w-full h-[2px] bg-[#6b21a8] mt-1" />
      </div>

      {/* ─── CARD BODY ─── */}
      <div className="px-0.5 flex gap-2 items-stretch flex-1 my-0.5">
        {/* Left Photo (Studio Red Backdrop like reference) */}
        <div className="w-[88px] h-[108px] bg-[#dc2626] rounded border border-slate-300 overflow-hidden shrink-0 flex flex-col items-center justify-end relative shadow-2xs">
          {student.photoUrl ? (
            <img
              src={student.photoUrl}
              alt={student.name}
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-b from-[#e11d48] to-[#b91c1c] flex flex-col items-center justify-end">
              <div className="w-9 h-9 rounded-full bg-[#fed7aa] border-2 border-[#ea580c] -mb-1 shadow-inner" />
              <div className="w-16 h-11 bg-[#facc15] rounded-t-full border-t border-[#ca8a04] flex items-center justify-center shadow-xs">
                <div className="w-3 h-3 border-l-2 border-r-2 border-slate-700/30 rounded-full mt-1" />
              </div>
            </div>
          )}
        </div>

        {/* Right Info Section */}
        <div className="flex-1 flex flex-col justify-between py-0 min-w-0">
          {/* Student Name in Bold Red font */}
          <h3 className="text-[#dc2626] font-black text-[12px] tracking-wide uppercase text-center truncate leading-tight mb-0.5">
            {student.name}
          </h3>

          {/* 5 Stacked Light Blue Rounded Bars */}
          <div className="space-y-[2px]">
            {/* Row 1: F. Name */}
            <div className="bg-[#c8f0fb] rounded-[3px] px-1.5 py-[1.5px] text-[#0a194f] text-[9px] leading-tight truncate">
              <span className="font-extrabold">F. Name : </span>
              <span className="font-bold">{student.fatherName || '-'}</span>
            </div>

            {/* Row 2: M. Name */}
            <div className="bg-[#c8f0fb] rounded-[3px] px-1.5 py-[1.5px] text-[#0a194f] text-[9px] leading-tight truncate">
              <span className="font-extrabold">M. Name : </span>
              <span className="font-bold">{student.motherName || '-'}</span>
            </div>

            {/* Row 3: D.O.B & SR. No */}
            <div className="bg-[#c8f0fb] rounded-[3px] px-1.5 py-[1.5px] text-[#0a194f] text-[9px] leading-tight flex justify-between items-center">
              <span>
                <span className="font-extrabold">D.O.B. : </span>
                <span className="font-bold">{formatDob(student.dob)}</span>
              </span>
              <span>
                <span className="font-extrabold">SR. No. : </span>
                <span className="font-bold">{student.srNo || student.admNo || '-'}</span>
              </span>
            </div>

            {/* Row 4: Contact No */}
            <div className="bg-[#c8f0fb] rounded-[3px] px-1.5 py-[1.5px] text-[#0a194f] text-[9px] leading-tight truncate">
              <span className="font-extrabold">Contact No. : </span>
              <span className="font-bold">{student.mobile || '-'}</span>
            </div>

            {/* Row 5: Address */}
            <div className="bg-[#c8f0fb] rounded-[3px] px-1.5 py-[1.5px] text-[#0a194f] text-[9px] leading-tight truncate">
              <span className="font-extrabold">Address : </span>
              <span className="font-bold">{student.address || '-'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── CARD FOOTER ─── */}
      <div className="px-0.5 pb-0.5 pt-1 flex items-center justify-between">
        {/* Class Badge */}
        <div className="bg-[#c8f0fb] text-[#0a194f] font-extrabold text-[9.5px] px-2.5 py-0.5 rounded-xl shadow-2xs">
          Class : {student.className}
        </div>

        {/* Session Badge */}
        <div className="bg-[#0c1a40] text-white font-black text-[9.5px] px-3 py-0.5 rounded-xl tracking-wide shadow-xs">
          Session : {session}
        </div>

        {/* Principal Badge with Signature (from /school-info) */}
        <div className="bg-[#c8f0fb] text-[#0a194f] px-2.5 py-0.5 rounded-xl flex flex-col items-center justify-center min-w-[72px] shadow-2xs">
          {principalSigUrl ? (
            <img
              src={principalSigUrl}
              alt="Principal Sig."
              className="h-4 max-w-[65px] object-contain my-0.5"
              crossOrigin="anonymous"
            />
          ) : (
            <span
              style={{ fontFamily: "'Brush Script MT', 'Segoe Script', cursive, sans-serif" }}
              className="text-[12px] text-slate-800 -mb-1 font-semibold italic"
            >
              Abhilash
            </span>
          )}
          <span className="text-[7.5px] font-black uppercase tracking-tight text-[#0a194f]">
            Principal
          </span>
        </div>
      </div>
    </div>
  );
}

export function IdCardGeneratorPage({ onNavigate }) {
  const { schoolId, schoolName } = useAuth();
  const [profile, setProfile] = useState(() => tenantStore.getSchoolProfile(schoolId));

  const [highlightStudent, setHighlightStudent] = useState(null);
  const [classList, setClassList] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [cardType, setCardType] = useState('Horizontal');
  const [format, setFormat] = useState('Board Badges Format');
  const [isMultiple, setIsMultiple] = useState(true);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [activePreviewStudent, setActivePreviewStudent] = useState(null);

  // Dynamic students list from tenantStore (0 hardcoded seed data)
  const [students, setStudents] = useState([]);

  // Dynamically load ONLY added classes (from Master / Class Master + registered students)
  useEffect(() => {
    let isMounted = true;

    const fetchClasses = async () => {
      // 1. Classes from registered students of this tenant
      const rawStudents = tenantStore.getStudents(schoolId) || [];
      const studentClasses = rawStudents
        .map((s) => (s.className || s.class_id || '').trim())
        .filter(Boolean);

      // 2. Pending student class if arrived from registration
      const pending = tenantStore.getPendingIdCardStudent();
      const pendingClass = (pending?.className || '').trim();

      // 3. Classes added in Class Master (/api/academics/classes)
      let masterClasses = [];
      try {
        const res = await fetch('/api/academics/classes', {
          headers: { 'x-school-id': schoolId || '' }
        });
        const d = await res.json();
        if (d.success && Array.isArray(d.data)) {
          masterClasses = d.data.map((c) => (c.name || '').trim()).filter(Boolean);
        }
      } catch (err) {
        // Fallback to student classes
      }

      if (!isMounted) return;

      const combined = Array.from(
        new Set([
          ...masterClasses,
          ...studentClasses,
          ...(pendingClass ? [pendingClass] : [])
        ])
      ).filter(Boolean);

      setClassList(combined);

      setSelectedClass((prev) => {
        if (pendingClass && combined.includes(pendingClass)) return pendingClass;
        if (prev && combined.includes(prev)) return prev;
        return combined[0] || '';
      });
    };

    fetchClasses();

    return () => {
      isMounted = false;
    };
  }, [schoolId]);

  // Fetch school profile live from tenantStore + backend /api/schools/profile
  useEffect(() => {
    const prof = tenantStore.getSchoolProfile(schoolId);
    setProfile(prof);

    fetch('/api/schools/profile', {
      headers: { 'x-school-id': schoolId || '' }
    })
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data) {
          const item = d.data;
          const merged = {
            ...prof,
            ...item,
            schoolName: item.schoolName ?? prof.schoolName,
            affiliationNo: item.affiliationNo ?? prof.affiliationNo,
            phone1: item.phone1 ?? prof.phone1,
            address: item.address ?? prof.address,
            logoUrl: item.brandingImages?.school_logo || item.logoUrl || prof.logoUrl,
            brandingImages: {
              ...(prof.brandingImages || {}),
              ...(item.brandingImages || {}),
              ...(item.logoUrl ? { school_logo: item.logoUrl } : {})
            }
          };
          setProfile(merged);
          tenantStore.updateSchoolProfile(schoolId, merged);
        }
      })
      .catch(() => {});
  }, [schoolId]);

  // Load real students based on selectedClass
  useEffect(() => {
    const rawList = tenantStore.getStudents(schoolId) || [];
    const filtered = rawList.filter((s) => {
      const cls = s.className || s.class_id || '';
      return !selectedClass || cls.toLowerCase().trim() === selectedClass.toLowerCase().trim();
    });

    const mapped = filtered.map((s, idx) => ({
      id: s.id || `std_${idx}`,
      rollNo: s.rollNo || String(idx + 1),
      admNo: s.admNo || '',
      srNo: s.srNo || s.admNo || '',
      name: (s.name || `${s.firstName || ''} ${s.lastName || ''}`).toUpperCase().trim() || 'STUDENT',
      className: s.className || selectedClass,
      fatherName: (s.fatherName || s.fathers_name || '').toUpperCase().trim() || '-',
      motherName: (s.motherName || s.mothers_name || s.mother_name || '').toUpperCase().trim() || '-',
      dob: s.dob || '28.09.2009',
      mobile: s.contactNo || s.fatherMobile || s.smsWhatsappNo || '-',
      address: s.address || s.present_address || 'Local',
      photoUrl: s.photoUrl || '',
      selected: true
    }));

    const pending = tenantStore.getPendingIdCardStudent();
    if (pending) {
      setHighlightStudent(pending);
      if (pending.className && pending.className !== selectedClass) {
        setSelectedClass(pending.className);
      }
      const exists = mapped.find((s) => String(s.admNo) === String(pending.admNo));
      if (!exists && (!selectedClass || pending.className === selectedClass)) {
        mapped.unshift({
          id: `pending_${Date.now()}`,
          rollNo: pending.rollNo || '1',
          admNo: pending.admNo || '',
          srNo: pending.admNo || '',
          name: (pending.name || '').toUpperCase(),
          className: pending.className || selectedClass,
          fatherName: (pending.fatherName || '').toUpperCase() || '-',
          motherName: (pending.motherName || '').toUpperCase() || '-',
          dob: pending.dob || '28.09.2009',
          mobile: pending.mobile || '-',
          address: pending.address || 'Local',
          photoUrl: '',
          selected: true
        });
      }
    }

    setStudents(mapped);
    if (mapped.length > 0 && !activePreviewStudent) {
      setActivePreviewStudent(mapped[0]);
    }
  }, [schoolId, selectedClass]);

  const toggleSelectAll = (checked) => {
    setStudents((prev) => prev.map((s) => ({ ...s, selected: checked })));
  };

  const toggleStudent = (id) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, selected: !s.selected } : s))
    );
  };

  const selectedCount = students.filter((s) => s.selected).length;

  return (
    <div className="p-4 md:p-6 bg-[#f3f4f6] min-h-screen text-slate-800">
      {/* Print Specific CSS to ensure exact PVC card rendering without clipping */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          body * {
            visibility: hidden;
          }
          #print-cards-container, #print-cards-container * {
            visibility: visible;
          }
          #print-cards-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 6mm !important;
            justify-content: flex-start !important;
          }
          .jd-id-card {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            margin: 0 0 4mm 0 !important;
            box-shadow: none !important;
            border: 1.5px solid #94a3b8 !important;
            print-color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
            height: auto !important;
            max-height: none !important;
            overflow: visible !important;
          }
          .jd-id-card-horizontal {
            width: 88mm !important;
            min-height: 56mm !important;
          }
          .jd-id-card-vertical {
            width: 56mm !important;
            min-height: 88mm !important;
          }
        }
      `}</style>

      {/* Breadcrumbs matching Live UAB */}
      <div className="flex items-center gap-2 mb-3">
        <h1 className="text-base md:text-lg font-bold text-gray-800">ID Card Generator</h1>
        <span className="text-gray-400 text-xs flex items-center gap-1.5 font-normal">
          <span>🏠</span>
          <span>•</span>
          <span>Students</span>
          <span>•</span>
          <span className="text-gray-600 font-medium">ID Card Generator</span>
        </span>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-2xs p-4 md:p-5">
        {/* Highlight notification if arrived from student registration */}
        {highlightStudent && (
          <div className="mb-4 p-3 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center justify-between text-xs text-indigo-900 font-medium">
            <span>
              Target Student Ready:{' '}
              <strong className="font-bold text-indigo-700">
                {highlightStudent.name} (Adm #{highlightStudent.admNo})
              </strong>{' '}
              is selected below.
            </span>
            <button
              type="button"
              onClick={() => {
                tenantStore.clearPendingIdCardStudent();
                setHighlightStudent(null);
              }}
              className="text-indigo-400 hover:text-indigo-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Filter Toolbar with Clean Alignment and Fixed Names */}
        <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-5 pb-4 border-b border-gray-100">
          {/* Class */}
          <div className="w-40 sm:w-44 relative">
            <label className="absolute -top-2 left-2.5 px-1 text-[11px] font-medium text-gray-500 bg-white z-10">
              Class
            </label>
            <div className="relative">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                disabled={classList.length === 0}
                className="w-full px-3 py-2 text-xs md:text-sm bg-white border border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none appearance-none cursor-pointer disabled:bg-gray-50 disabled:text-gray-400"
              >
                {classList.length === 0 ? (
                  <option value="">No Classes Added</option>
                ) : (
                  classList.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))
                )}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
            </div>
          </div>

          {/* Orientation */}
          <div className="w-44 relative">
            <label className="absolute -top-2 left-2.5 px-1 text-[11px] font-medium text-gray-500 bg-white z-10">
              Orientation
            </label>
            <div className="relative">
              <select
                value={cardType}
                onChange={(e) => setCardType(e.target.value)}
                className="w-full px-3 py-2 text-xs md:text-sm bg-white border border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none appearance-none cursor-pointer"
              >
                <option value="Horizontal">Horizontal (Standard PVC)</option>
                <option value="Vertical">Vertical (Lanyard Badge)</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
            </div>
          </div>

          {/* Template Format (Renamed from CBSE Badge Format to Board Badges Format) */}
          <div className="w-56 sm:w-60 relative">
            <label className="absolute -top-2 left-2.5 px-1 text-[11px] font-medium text-gray-500 bg-white z-10">
              Template Format
            </label>
            <div className="relative">
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full px-3 py-2 text-xs md:text-sm bg-white border border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none appearance-none cursor-pointer font-medium"
              >
                <option value="Board Badges Format">Board Badges Format</option>
                <option value="J.D. International Format (PVC)">J.D. International Format (PVC)</option>
                <option value="Standard Format">Standard Format</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
            </div>
          </div>

          {/* Multiple Checkbox */}
          <label className="flex items-center gap-2 text-xs md:text-sm font-semibold text-gray-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isMultiple}
              onChange={(e) => setIsMultiple(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
            />
            <span>Multiple</span>
          </label>

          {/* Action Button */}
          <div className="ml-auto flex items-center gap-3">
            <button
              type="button"
              disabled={selectedCount === 0}
              onClick={() => setShowPrintPreview(true)}
              className={`px-5 py-2 text-white text-xs md:text-sm font-semibold rounded-lg flex items-center gap-2 shadow-xs transition-all ${
                selectedCount === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer shadow-md'
              }`}
            >
              <Printer className="w-4 h-4" />
              <span>Print Preview ({selectedCount})</span>
            </button>
          </div>
        </div>

        {/* Main Content Layout: Table on Left + Non-Overflowing Live Card Preview on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Table (Col-span-7) */}
          <div className="lg:col-span-7 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="border-b border-gray-300 text-gray-700 font-bold uppercase tracking-wider text-[11px] bg-gray-50/60">
                  <th className="py-2.5 px-3 w-10">
                    <input
                      type="checkbox"
                      checked={students.length > 0 && selectedCount === students.length}
                      onChange={(e) => toggleSelectAll(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 accent-indigo-600 cursor-pointer"
                    />
                  </th>
                  <th className="py-2.5 px-3">S.NO.</th>
                  <th className="py-2.5 px-3">ROLL NO.</th>
                  <th className="py-2.5 px-3">ADM. NO.</th>
                  <th className="py-2.5 px-3">SR. NO.</th>
                  <th className="py-2.5 px-3">NAME</th>
                  <th className="py-2.5 px-3">CLASS</th>
                  <th className="py-2.5 px-3">FATHER'S NAME</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-700 font-medium">
                {students.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-8 text-center text-gray-400">
                      {classList.length === 0
                        ? 'No classes added yet. Add classes under Master > Class Master or register students.'
                        : `No students registered in Class ${selectedClass || '-'}. Register students under Student Registration to generate ID cards.`}
                    </td>
                  </tr>
                ) : (
                  students.map((std, idx) => {
                    const isSelected = std.selected;
                    const isActive = activePreviewStudent?.id === std.id;
                    return (
                      <tr
                        key={std.id}
                        onClick={() => setActivePreviewStudent(std)}
                        className={`cursor-pointer transition-colors ${
                          isActive ? 'bg-indigo-50/80 font-semibold' : 'hover:bg-gray-50'
                        }`}
                      >
                        <td className="py-2.5 px-3" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleStudent(std.id)}
                            className="w-4 h-4 rounded text-indigo-600 accent-indigo-600 cursor-pointer"
                          />
                        </td>
                        <td className="py-2.5 px-3">{idx + 1}</td>
                        <td className="py-2.5 px-3 font-semibold text-gray-900">{std.rollNo}</td>
                        <td className="py-2.5 px-3 font-semibold text-indigo-600">{std.admNo}</td>
                        <td className="py-2.5 px-3">{std.srNo}</td>
                        <td className="py-2.5 px-3 font-bold text-gray-900">{std.name}</td>
                        <td className="py-2.5 px-3">{std.className}</td>
                        <td className="py-2.5 px-3 text-gray-600">{std.fatherName}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Live Card Preview Box on Right (Col-span-5) - Guaranteed No Overflow */}
          <div className="lg:col-span-5 bg-gradient-to-b from-gray-50 to-slate-100/70 border border-gray-200 rounded-2xl p-4 flex flex-col items-center overflow-hidden shadow-2xs">
            <div className="w-full flex items-center justify-between mb-3 pb-2.5 border-b border-gray-200">
              <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5 uppercase tracking-wide">
                <Eye className="w-3.5 h-3.5 text-indigo-600" />
                Live Card Template Preview
              </span>
              <span className="text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full font-bold">
                Board Badges Format
              </span>
            </div>

            {activePreviewStudent ? (
              <div className="w-full flex justify-center items-center py-2">
                <div className="transform transition-transform hover:scale-[1.01] flex justify-center w-full max-w-full">
                  <JdStudentIdCard
                    student={activePreviewStudent}
                    profile={profile}
                    cardType={cardType}
                    session="2026-27"
                  />
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-gray-400 text-xs">
                Select a student in the table to see the live ID card preview.
              </div>
            )}

            <div className="w-full mt-3 pt-2.5 border-t border-gray-200 flex items-center justify-between text-[11px] text-gray-500 font-medium">
              <span>PVC Spec: CR80 (85.6 × 54mm)</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                ✓ Synced with /school-info
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Printable ID Cards Preview Modal */}
      {showPrintPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-2xs p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-y-auto p-6 animate-scale-in">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-6">
              <div>
                <h2 className="text-base font-bold text-gray-800">
                  Print Preview: Student ID Cards ({selectedCount})
                </h2>
                <p className="text-xs text-gray-500">
                  Ready to print onto PVC card stock or sheet paper.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all hover:scale-105"
                >
                  <Printer className="w-4 h-4" /> Print All ({selectedCount})
                </button>
                <button
                  type="button"
                  onClick={() => setShowPrintPreview(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Print Container: Grid of Exact 1:1 Cards */}
            <div id="print-cards-container" className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center">
              {students
                .filter((s) => s.selected)
                .map((std) => (
                  <div key={std.id} className="transition-transform hover:scale-[1.01]">
                    <JdStudentIdCard
                      student={std}
                      profile={profile}
                      cardType={cardType}
                      session="2026-27"
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
