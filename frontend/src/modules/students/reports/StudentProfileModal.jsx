import React, { useState, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import {
  X,
  Printer,
  Pencil,
  User,
  Users,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Calendar,
  BadgeCheck,
  CreditCard,
  BookOpen,
  HeartPulse,
  Globe,
  Building2,
  Shield,
  Layers,
  Home
} from 'lucide-react';
import { tenantStore } from '../../../services/tenantStore';

export function StudentProfileModal({ student, schoolName = 'School ERP', onClose, onNavigate }) {
  const [activeTab, setActiveTab] = useState('all');
  const [imgError, setImgError] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previousActiveElementRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Focus restoration on close & initial focus on open
  useEffect(() => {
    previousActiveElementRef.current = document.activeElement;
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    return () => {
      clearTimeout(timer);
      if (
        previousActiveElementRef.current &&
        typeof previousActiveElementRef.current.focus === 'function' &&
        document.body.contains(previousActiveElementRef.current)
      ) {
        previousActiveElementRef.current.focus();
      }
    };
  }, []);

  // Trap focus within modal and close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onCloseRef.current?.();
        return;
      }

      if (e.key === 'Tab') {
        if (!modalRef.current) return;
        const focusableSelectors = [
          'button:not([disabled])',
          '[href]',
          'input:not([disabled])',
          'select:not([disabled])',
          'textarea:not([disabled])',
          '[tabindex]:not([tabindex="-1"])'
        ].join(', ');
        const focusableElements = Array.from(modalRef.current.querySelectorAll(focusableSelectors))
          .filter(el => {
            if (el.disabled || el.getAttribute('aria-hidden') === 'true' || el.getAttribute('tabindex') === '-1') return false;
            if (typeof window !== 'undefined' && window.getComputedStyle) {
              const style = window.getComputedStyle(el);
              if (style.display === 'none' || style.visibility === 'hidden') return false;
            }
            return true;
          });

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement || !modalRef.current.contains(document.activeElement)) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement || !modalRef.current.contains(document.activeElement)) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent background scrolling while modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Reset imgError whenever the student or photo changes
  useEffect(() => {
    setImgError(false);
  }, [student?.photoUrl, student?.photo, student?.photo_url, student?.student_photo, student?.admNo, student?.adm_no, student?.id]);

  // Listen for browser native beforeprint / afterprint events (e.g. Ctrl+P)
  useEffect(() => {
    const handleBeforePrint = () => {
      try {
        flushSync(() => {
          setIsPrinting(true);
        });
      } catch (e) {
        setIsPrinting(true);
      }
    };
    const handleAfterPrint = () => setIsPrinting(false);
    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, []);

  if (!student) return null;

  // Safe cleaner helper that trims whitespace and falls back cleanly without treating '0' as missing
  const clean = (val, fallback = '-') => {
    if (val === null || val === undefined) return fallback;
    const str = String(val).trim();
    return str.length > 0 && str !== '-' && str.toLowerCase() !== 'null' && str.toLowerCase() !== 'undefined'
      ? str
      : fallback;
  };

  // Header Data Mapping
  const rawName = student.name || [student.firstName || student.first_name, student.lastName || student.last_name].filter(Boolean).join(' ');
  const fullName = clean(rawName, 'Student');
  const rawAdmNo = student.admNo !== undefined && student.admNo !== null ? student.admNo : student.adm_no;
  const admNo = clean(rawAdmNo);
  const rawRollNo = student.rollNo !== undefined && student.rollNo !== null ? student.rollNo : student.roll_no;
  const rollNo = clean(rawRollNo);
  const className = clean(student.className || student.class_id || student.class_name);
  const section = clean(student.section || student.division_id || student.section_name);
  const classSection = className !== '-' && section !== '-'
    ? `${className} - ${section}`
    : (className !== '-' ? className : (section !== '-' ? section : '-'));
  const rawStatus = student.status || student.status_type;
  const statusBadgeText = rawStatus && rawStatus !== 'Studying' ? String(rawStatus).trim() : 'Active / Enrolled';
  const isInactive = /inactive|left|suspended|withdrawn|tc issued|dropped/i.test(statusBadgeText);
  const photoUrl = clean(student.photoUrl || student.photo || student.photo_url || student.student_photo, '');

  // Section 1: Basic & Personal Details
  const dob = clean(student.dob || student.dateOfBirth || student.date_of_birth || student.birth_date);
  const gender = clean(student.gender);
  const category = clean(student.category || student.cast || student.caste, 'General');
  const bloodGroup = clean(student.bloodGroup || student.blood_group || student.b_group);
  const nationality = clean(student.nationality || student.student_nationality, 'Indian');
  const motherTongue = clean(student.motherTongue || student.mother_tongue || student.m_tongue, 'Hindi');

  // Section 2: Parent / Guardian Details
  const fatherName = clean(student.fatherName || student.fathers_name || student.father_name);
  const fatherPhone = clean(student.fatherMobile || student.father_mobile || student.fathers_mobile_no || student.fatherWhatsapp || student.fathers_whatsapp_no || student.contactNo);
  const fatherOccupation = clean(student.fatherOccupation || student.father_occupation || student.fathers_occupation);

  const motherName = clean(student.motherName || student.mothers_name || student.mother_name);
  const motherPhone = clean(student.motherMobile || student.mother_mobile || student.mothers_mobile_no || student.motherWhatsapp || student.mothers_whatsapp_no);
  const motherOccupation = clean(student.motherOccupation || student.mother_occupation || student.mothers_occupation);

  const guardianName = clean(student.guardianName || student.guardian_name || student.guardian1_name || student.guardian, 'N/A');
  const guardianPhone = clean(student.guardianMobile || student.guardian_mobile || student.guardianPhone || student.guardian_phone || student.guardian1_mobile_no, 'N/A');
  const guardianOccupation = clean(student.guardianOccupation || student.guardian_occupation || student.guardian1_remark, 'N/A');
  const guardianRelation = clean(student.guardianRelation || student.guardian_relation || student.guardian1_relation, 'Parent / Guardian');

  // Section 3: Contact & Address
  const fullAddress = clean(student.address || student.present_address || student.permanent_address);
  const primaryPhone = clean(student.contactNo || student.contact_no_sms || student.smsWhatsappNo || student.fatherMobile);
  const altPhone = clean(student.fatherWhatsapp || student.fathers_whatsapp_no || student.emergencyContact || student.contactPhoneNo || student.contact_phone_no);
  const email = clean(student.email || student.studentEmail || student.student_email || student.fatherEmail || student.fathers_email);

  // Section 4: Academic & School Info
  const enrollNo = clean(student.enrollNo || student.enroll_no || student.enrNo || student.enr_no || ('ENR-' + (admNo !== '-' ? admNo : '1001')));
  const admDate = clean(student.admDate || student.adm_date || student.admissionDate || student.admission_date);
  const rawStudentType = student.studentType || student.stu_type || student.student_type || (student.isNew !== undefined ? (student.isNew ? 'New' : 'Old') : undefined);
  const studentType = clean(rawStudentType, 'New');
  const feeType = clean(student.feeType || student.fee_type || student.fee_id, 'Day Scholar');
  const stream = clean(student.stream || student.stream_name || student.stream_id, 'General');
  const house = clean(student.house || student.house_name || student.houseName, 'None');

  // Section visibility: during print, all sections must render regardless of the screen tab
  const isSectionVisible = (tabId) => isPrinting || activeTab === 'all' || activeTab === tabId;

  const tabsList = [
    { id: 'all', label: 'All Details', icon: Layers },
    { id: 'basic', label: 'Basic & Personal Details', icon: User },
    { id: 'parent', label: 'Parent / Guardian Details', icon: Users },
    { id: 'contact', label: 'Contact & Address', icon: MapPin },
    { id: 'academic', label: 'Academic & School Info', icon: GraduationCap }
  ];

  const handleTabKeyDown = (e, index) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (index + 1) % tabsList.length;
      setActiveTab(tabsList[nextIndex].id);
      document.getElementById(`profile-tab-${tabsList[nextIndex].id}`)?.focus();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (index - 1 + tabsList.length) % tabsList.length;
      setActiveTab(tabsList[prevIndex].id);
      document.getElementById(`profile-tab-${tabsList[prevIndex].id}`)?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveTab(tabsList[0].id);
      document.getElementById(`profile-tab-${tabsList[0].id}`)?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveTab(tabsList[tabsList.length - 1].id);
      document.getElementById(`profile-tab-${tabsList[tabsList.length - 1].id}`)?.focus();
    }
  };

  // Handlers
  const handleEditStudent = () => {
    const sanitizeForEdit = (val) => {
      if (val === null || val === undefined) return '';
      const str = String(val).trim();
      if (str === '-' || str === 'N/A' || str.toLowerCase() === 'null' || str.toLowerCase() === 'undefined') {
        return '';
      }
      return str;
    };

    const studentToEdit = {
      ...student,
      admNo: sanitizeForEdit(admNo) || sanitizeForEdit(student.admNo) || sanitizeForEdit(student.adm_no),
      rollNo: sanitizeForEdit(rollNo) || (student.rollNo !== undefined && student.rollNo !== null ? String(student.rollNo) : ''),
      name: sanitizeForEdit(fullName),
      firstName: sanitizeForEdit(student.firstName) || sanitizeForEdit(student.first_name) || sanitizeForEdit(fullName.split(' ')[0]),
      lastName: sanitizeForEdit(student.lastName) || sanitizeForEdit(student.last_name) || sanitizeForEdit(fullName.split(' ').slice(1).join(' ')),
      className: sanitizeForEdit(className) || sanitizeForEdit(student.className) || sanitizeForEdit(student.class_id),
      section: sanitizeForEdit(section) || sanitizeForEdit(student.section) || sanitizeForEdit(student.division_id),
      gender: sanitizeForEdit(gender) || sanitizeForEdit(student.gender),
      dob: sanitizeForEdit(dob) || sanitizeForEdit(student.dob) || sanitizeForEdit(student.dateOfBirth) || sanitizeForEdit(student.date_of_birth),
      category: sanitizeForEdit(category) || sanitizeForEdit(student.category) || sanitizeForEdit(student.cast) || sanitizeForEdit(student.caste),
      bloodGroup: sanitizeForEdit(bloodGroup) || sanitizeForEdit(student.bloodGroup) || sanitizeForEdit(student.blood_group),
      blood_group: sanitizeForEdit(bloodGroup) || sanitizeForEdit(student.blood_group) || sanitizeForEdit(student.bloodGroup),
      nationality: sanitizeForEdit(nationality) || sanitizeForEdit(student.nationality),
      motherTongue: sanitizeForEdit(motherTongue) || sanitizeForEdit(student.motherTongue) || sanitizeForEdit(student.mother_tongue),
      mother_tongue: sanitizeForEdit(motherTongue) || sanitizeForEdit(student.mother_tongue) || sanitizeForEdit(student.motherTongue),
      fatherName: sanitizeForEdit(fatherName) || sanitizeForEdit(student.fatherName) || sanitizeForEdit(student.fathers_name),
      motherName: sanitizeForEdit(motherName) || sanitizeForEdit(student.motherName) || sanitizeForEdit(student.mothers_name),
      fatherMobile: sanitizeForEdit(fatherPhone) || sanitizeForEdit(student.fatherMobile) || sanitizeForEdit(student.fathers_mobile_no),
      fatherOccupation: sanitizeForEdit(fatherOccupation) || sanitizeForEdit(student.fatherOccupation) || sanitizeForEdit(student.fathers_occupation),
      motherOccupation: sanitizeForEdit(motherOccupation) || sanitizeForEdit(student.motherOccupation) || sanitizeForEdit(student.mothers_occupation),
      guardianName: sanitizeForEdit(guardianName) || sanitizeForEdit(student.guardianName) || sanitizeForEdit(student.guardian_name),
      guardianPhone: sanitizeForEdit(guardianPhone) || sanitizeForEdit(student.guardianPhone) || sanitizeForEdit(student.guardian_phone),
      guardianRelation: sanitizeForEdit(guardianRelation) || sanitizeForEdit(student.guardianRelation) || sanitizeForEdit(student.guardian_relation),
      guardianOccupation: sanitizeForEdit(guardianOccupation) || sanitizeForEdit(student.guardianOccupation) || sanitizeForEdit(student.guardian_occupation),
      contactNo: sanitizeForEdit(primaryPhone) || sanitizeForEdit(student.contactNo) || sanitizeForEdit(student.contact_no_sms),
      contact_no_sms: sanitizeForEdit(primaryPhone) || sanitizeForEdit(student.contact_no_sms) || sanitizeForEdit(student.contactNo),
      address: sanitizeForEdit(fullAddress) || sanitizeForEdit(student.address) || sanitizeForEdit(student.present_address),
      email: sanitizeForEdit(email) || sanitizeForEdit(student.email) || sanitizeForEdit(student.student_email),
      photoUrl: photoUrl || student.photoUrl || student.photo_url || student.student_photo || ''
    };
    tenantStore.setPendingEditStudent(studentToEdit);
    onClose();
    if (onNavigate) {
      onNavigate('/student-registration');
    }
  };

  const handlePrint = () => {
    try {
      flushSync(() => {
        setIsPrinting(true);
      });
    } catch (e) {
      setIsPrinting(true);
    }
    try {
      window.print();
    } finally {
      setIsPrinting(false);
    }
  };

  // Avatar Initials
  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('') || 'ST';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="student-profile-title"
    >
      {/* Media print style overrides */}
      <style>{`
        @media print {
          @page {
            size: auto;
            margin: 10mm 12mm;
          }
          html, body {
            background: white !important;
            height: auto !important;
            overflow: visible !important;
          }
          body * {
            visibility: hidden !important;
          }
          [role="dialog"] {
            position: static !important;
            display: block !important;
            overflow: visible !important;
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          [role="dialog"], #student-profile-modal-root, #student-profile-modal-root * {
            visibility: visible !important;
          }
          #student-profile-modal-root {
            position: static !important;
            left: auto !important;
            top: auto !important;
            width: 100% !important;
            max-width: 100% !important;
            max-height: none !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            overflow: visible !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-header-contrast {
            background: #f8fafc !important;
            color: #0f172a !important;
            border-color: #cbd5e1 !important;
          }
          .print-header-contrast * {
            color: #0f172a !important;
          }
          .no-print {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
          .print-break-avoid {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
        }
      `}</style>

      <div
        ref={modalRef}
        id="student-profile-modal-root"
        tabIndex={-1}
        className="relative bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 outline-none"
      >
        {/* Print Header (Visible only on print slip) */}
        <div className="hidden print:block border-b-2 border-slate-800 pb-3 mb-4 text-center">
          <h1 className="text-xl font-bold uppercase tracking-wide text-slate-900">{schoolName}</h1>
          <p className="text-xs text-slate-600 font-semibold uppercase tracking-wider mt-0.5">
            Student Admission Profile & Information Slip
          </p>
          <div className="flex justify-between items-center text-[11px] text-slate-500 mt-2 px-2 border-t border-slate-200 pt-1">
            <span>Admission No: <strong>{admNo}</strong></span>
            <span>Printed Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 relative flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 border-b border-slate-800 print-header-contrast print:p-3 print:border-slate-300">
          {/* Close button */}
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="no-print print:hidden absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Student Avatar / Photo */}
          <div className="relative shrink-0">
            {photoUrl && !imgError ? (
              <img
                src={photoUrl}
                alt={fullName}
                onError={() => setImgError(true)}
                className="w-20 h-20 sm:w-22 sm:h-22 rounded-full object-cover border-3 border-indigo-400/50 shadow-md bg-slate-800 print:border-slate-400"
              />
            ) : (
              <div
                data-testid="student-avatar-placeholder"
                className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-2xl shadow-md border-3 border-white/20 tracking-wider print:bg-slate-200 print:text-slate-800 print:border-slate-400"
              >
                {initials}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 rounded-full border-2 border-slate-900 shadow-xs no-print print:hidden" title="Enrolled Student">
              <BadgeCheck className="w-3.5 h-3.5 text-white" />
            </div>
          </div>

          {/* Header Info */}
          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mb-1.5">
              <h2 id="student-profile-title" className="text-xl sm:text-2xl font-bold tracking-tight truncate text-white print:text-slate-900">
                {fullName}
              </h2>
              {/* Active/Enrolled or Inactive Status Badge */}
              <span
                data-testid="student-status-badge"
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  isInactive
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 print:text-rose-700 print:border-rose-400'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 print:text-emerald-800 print:border-emerald-400'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isInactive ? 'bg-rose-400' : 'bg-emerald-400 animate-pulse'}`}></span>
                {statusBadgeText}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-xs text-slate-300 print:text-slate-700">
              <span className="flex items-center gap-1.5 font-medium">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-400 print:text-slate-700" />
                Class: <strong className="text-white font-semibold print:text-slate-900">{classSection}</strong>
              </span>
              <span className="text-slate-600 hidden sm:inline print:text-slate-400">&bull;</span>
              <span className="flex items-center gap-1.5">
                Roll No: <strong className="text-white font-semibold print:text-slate-900">{rollNo}</strong>
              </span>
              <span className="text-slate-600 hidden sm:inline print:text-slate-400">&bull;</span>
              <span className="flex items-center gap-1.5">
                Admission No: <strong className="text-indigo-300 font-mono font-semibold print:text-slate-900">{admNo}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Tabbed layout with WAI-ARIA) */}
        <div
          role="tablist"
          aria-label="Student profile sections"
          aria-orientation="horizontal"
          className="no-print print:hidden border-b border-slate-200 bg-slate-50/80 px-4 flex items-center gap-1 overflow-x-auto scrollbar-none"
        >
          {tabsList.map((tab, idx) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`profile-tab-${tab.id}`}
                role="tab"
                aria-selected={isActive}
                aria-controls={tab.id === 'all' ? 'profile-panel-all' : `profile-panel-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                onKeyDown={(e) => handleTabKeyDown(e, idx)}
                className={`flex items-center gap-2 py-3 px-3.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-indigo-600 text-indigo-700 bg-white shadow-2xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body - Scrollable content with all 4 sections */}
        <div
          id="profile-panel-all"
          className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 bg-slate-50/50 print:p-0 print:space-y-4 print:bg-white print:overflow-visible print:h-auto"
        >
          {/* SECTION 1: Basic & Personal Details */}
          {isSectionVisible('basic') && (
            <div
              id="profile-panel-basic"
              role="tabpanel"
              aria-labelledby="profile-tab-basic"
              data-testid="section-basic-details"
              className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden print:border-slate-300 print-break-avoid"
            >
              <div className="bg-slate-100/90 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Basic & Personal Details
                  </h3>
                </div>
              </div>
              <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Date of Birth</span>
                  <span className="font-semibold text-slate-900 mt-0.5 block">{dob}</span>
                </div>
                <div>
                  <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Gender</span>
                  <span className="font-semibold text-slate-900 mt-0.5 block">{gender}</span>
                </div>
                <div>
                  <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Category</span>
                  <span className="font-semibold text-slate-900 mt-0.5 block">{category}</span>
                </div>
                <div>
                  <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Blood Group</span>
                  <span className="font-semibold text-slate-900 mt-0.5 block">{bloodGroup}</span>
                </div>
                <div>
                  <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Nationality</span>
                  <span className="font-semibold text-slate-900 mt-0.5 block">{nationality}</span>
                </div>
                <div>
                  <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Mother Tongue</span>
                  <span className="font-semibold text-slate-900 mt-0.5 block">{motherTongue}</span>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: Parent / Guardian Details */}
          {isSectionVisible('parent') && (
            <div
              id="profile-panel-parent"
              role="tabpanel"
              aria-labelledby="profile-tab-parent"
              data-testid="section-parent-details"
              className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden print:border-slate-300 print-break-avoid"
            >
              <div className="bg-slate-100/90 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Parent / Guardian Details
                  </h3>
                </div>
              </div>
              <div className="p-4 space-y-4 text-xs">
                {/* Father Info */}
                <div className="rounded-lg bg-slate-50/70 p-3 border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2">
                    Father's Information
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <span className="block text-[11px] text-slate-500">Father's Name</span>
                      <span className="font-semibold text-slate-900 mt-0.5 block">{fatherName}</span>
                    </div>
                    <div>
                      <span className="block text-[11px] text-slate-500">Phone / Mobile</span>
                      <span className="font-semibold font-mono text-slate-900 mt-0.5 block">{fatherPhone}</span>
                    </div>
                    <div>
                      <span className="block text-[11px] text-slate-500">Occupation</span>
                      <span className="font-semibold text-slate-900 mt-0.5 block">{fatherOccupation}</span>
                    </div>
                  </div>
                </div>

                {/* Mother Info */}
                <div className="rounded-lg bg-slate-50/70 p-3 border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2">
                    Mother's Information
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <span className="block text-[11px] text-slate-500">Mother's Name</span>
                      <span className="font-semibold text-slate-900 mt-0.5 block">{motherName}</span>
                    </div>
                    <div>
                      <span className="block text-[11px] text-slate-500">Phone / Mobile</span>
                      <span className="font-semibold font-mono text-slate-900 mt-0.5 block">{motherPhone}</span>
                    </div>
                    <div>
                      <span className="block text-[11px] text-slate-500">Occupation</span>
                      <span className="font-semibold text-slate-900 mt-0.5 block">{motherOccupation}</span>
                    </div>
                  </div>
                </div>

                {/* Guardian Info */}
                <div className="rounded-lg bg-slate-50/70 p-3 border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2">
                    Guardian Details
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <span className="block text-[11px] text-slate-500">Guardian Name</span>
                      <span className="font-semibold text-slate-900 mt-0.5 block">{guardianName}</span>
                    </div>
                    <div>
                      <span className="block text-[11px] text-slate-500">Guardian Phone</span>
                      <span className="font-semibold font-mono text-slate-900 mt-0.5 block">{guardianPhone}</span>
                    </div>
                    <div>
                      <span className="block text-[11px] text-slate-500">Relation</span>
                      <span className="font-semibold text-slate-900 mt-0.5 block">{guardianRelation}</span>
                    </div>
                    <div>
                      <span className="block text-[11px] text-slate-500">Occupation / Remark</span>
                      <span className="font-semibold text-slate-900 mt-0.5 block">{guardianOccupation}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: Contact & Address */}
          {isSectionVisible('contact') && (
            <div
              id="profile-panel-contact"
              role="tabpanel"
              aria-labelledby="profile-tab-contact"
              data-testid="section-contact-details"
              className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden print:border-slate-300 print-break-avoid"
            >
              <div className="bg-slate-100/90 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Contact & Address
                  </h3>
                </div>
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Full Address</span>
                  <span className="font-semibold text-slate-900 mt-0.5 block leading-relaxed break-words">{fullAddress}</span>
                </div>
                <div>
                  <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Email Address</span>
                  <span className="font-semibold font-mono text-slate-900 mt-0.5 block break-all">{email}</span>
                </div>
                <div>
                  <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Primary Contact (SMS)</span>
                  <span className="font-semibold font-mono text-slate-900 mt-0.5 block">{primaryPhone}</span>
                </div>
                <div>
                  <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide">WhatsApp / Alt. Phone</span>
                  <span className="font-semibold font-mono text-slate-900 mt-0.5 block">{altPhone}</span>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: Academic & School Info */}
          {isSectionVisible('academic') && (
            <div
              id="profile-panel-academic"
              role="tabpanel"
              aria-labelledby="profile-tab-academic"
              data-testid="section-academic-details"
              className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden print:border-slate-300 print-break-avoid"
            >
              <div className="bg-slate-100/90 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center">
                    <GraduationCap className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Academic & School Info
                  </h3>
                </div>
              </div>
              <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Enrollment No.</span>
                  <span className="font-semibold font-mono text-indigo-700 mt-0.5 block">{enrollNo}</span>
                </div>
                <div>
                  <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Admission Date</span>
                  <span className="font-semibold text-slate-900 mt-0.5 block">{admDate}</span>
                </div>
                <div>
                  <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Student Type</span>
                  <span className="font-semibold text-slate-900 mt-0.5 block">
                    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                      studentType.toLowerCase() === 'new' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {studentType}
                    </span>
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Fee Type</span>
                  <span className="font-semibold text-slate-900 mt-0.5 block">{feeType}</span>
                </div>
                <div>
                  <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Stream</span>
                  <span className="font-semibold text-slate-900 mt-0.5 block">{stream}</span>
                </div>
                <div>
                  <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide">House</span>
                  <span className="font-semibold text-slate-900 mt-0.5 block">{house}</span>
                </div>
              </div>
            </div>
          )}

          {/* Print Signatures Block (Shown strictly when printing) */}
          <div className="hidden print:block pt-8 mt-6 border-t border-slate-300 print-break-avoid">
            <div className="grid grid-cols-3 gap-8 text-center text-xs text-slate-700">
              <div className="border-t border-slate-400 pt-2 font-medium">Student Signature</div>
              <div className="border-t border-slate-400 pt-2 font-medium">Parent / Guardian Signature</div>
              <div className="border-t border-slate-400 pt-2 font-medium">Principal / Signatory Stamp</div>
            </div>
          </div>
        </div>

        {/* Modal Footer with Actions */}
        <div className="no-print print:hidden bg-white p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
          <div className="text-xs text-slate-500 hidden sm:block">
            Admission: <strong className="text-slate-800">{admNo}</strong> &bull; Class: <strong className="text-slate-800">{classSection}</strong>
          </div>

          <div className="flex items-center gap-2.5 ml-auto w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-lg border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Profile / Slip</span>
            </button>
            <button
              type="button"
              onClick={handleEditStudent}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit Student</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

