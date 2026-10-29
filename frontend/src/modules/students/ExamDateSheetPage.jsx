import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Plus,
  MessageSquare,
  SlidersHorizontal,
  X,
  FileText,
  Trash2,
  Calendar,
  Check,
  ChevronDown,
  Upload,
  Eye,
  Edit2,
  Printer,
  Download,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { tenantStore } from '../../services/tenantStore';

const TERMS = [
  'Term 1',
  'Term 2',
  'Annual Examination',
  'Half Yearly Examination',
  'Pre-Board Examination',
  'Unit Test 1',
  'Unit Test 2'
];

const EXAMS = [
  'None',
  'Mid Term Exam 2026',
  'Final Board Examination 2027',
  'Annual Examination 2026-27',
  'Half Yearly Exam 2026',
  'Periodic Assessment 1'
];

const SUBJECTS = [
  'English',
  'Mathematics',
  'Science',
  'Social Science',
  'Hindi',
  'Sanskrit',
  'Computer',
  'Physics',
  'Chemistry',
  'Biology',
  'Accountancy',
  'Business Studies',
  'Economics',
  'History',
  'Political Science'
];

export function ExamDateSheetPage({ onNavigate }) {
  const { schoolId } = useAuth();
  const effectiveSchoolId = schoolId || 'sch_jd_intl';
  const profile = tenantStore.getSchoolProfile(effectiveSchoolId) || {};

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [previewDateSheet, setPreviewDateSheet] = useState(null);

  // Dynamic date sheets loaded from tenantStore & backend (0 hardcoded seed data)
  const [dateSheets, setDateSheets] = useState(() => {
    return tenantStore.getExamDateSheets(effectiveSchoolId) || [];
  });

  // Dynamic classes: ONLY classes added in Class Master (Zero seeded classes)
  const [availableClasses, setAvailableClasses] = useState([]);

  // Dynamically load strictly classes added in Class Master (/api/academics/classes + tenantStore)
  useEffect(() => {
    let isMounted = true;

    const loadClassMasterClasses = async () => {
      // 1. Classes from Class Master cached in tenantStore
      const localClasses = (tenantStore.getClasses(effectiveSchoolId) || [])
        .map((c) => (typeof c === 'string' ? c : c.name || c.className || '').trim())
        .filter(Boolean);

      // 2. Fetch live from Class Master API endpoint
      let backendClasses = [];
      try {
        const res = await fetch('/api/academics/classes', {
          headers: { 'x-school-id': effectiveSchoolId }
        });
        if (res.ok) {
          const d = await res.json();
          if (d.success && Array.isArray(d.data)) {
            backendClasses = d.data
              .map((c) => (typeof c === 'string' ? c : c.name || c.className || '').trim())
              .filter(Boolean);
            tenantStore.saveClasses(effectiveSchoolId, d.data);
          }
        }
      } catch (err) {
        console.warn('Class Master API fetch error:', err);
      }

      // 3. Classes from registered students of this tenant
      const studentClasses = (tenantStore.getStudents(effectiveSchoolId) || [])
        .map((s) => (s.className || s.class_id || '').trim())
        .filter(Boolean);

      if (!isMounted) return;

      const combined = Array.from(
        new Set([...localClasses, ...backendClasses, ...studentClasses])
      ).filter(Boolean);

      setAvailableClasses(combined);

      setModalClass((prev) => {
        if (prev && combined.includes(prev)) return prev;
        return combined[0] || '';
      });
    };

    loadClassMasterClasses();

    return () => {
      isMounted = false;
    };
  }, [effectiveSchoolId]);

  // Load date sheets from backend and sync with tenantStore
  useEffect(() => {
    const localData = tenantStore.getExamDateSheets(effectiveSchoolId) || [];
    setDateSheets(localData);

    const fetchDateSheets = async () => {
      try {
        const res = await fetch('/api/students/exam-date-sheets', {
          headers: { 'x-school-id': effectiveSchoolId }
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            if (json.data.length > 0) {
              setDateSheets(json.data);
              tenantStore.setExamDateSheets(effectiveSchoolId, json.data);
            } else if (localData.length > 0) {
              // Sync local items to backend
              for (const item of localData) {
                await fetch('/api/students/exam-date-sheets', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'x-school-id': effectiveSchoolId
                  },
                  body: JSON.stringify(item)
                });
              }
            }
          }
        }
      } catch (err) {
        console.warn('Backend fetch failed, relying on local tenantStore:', err);
      }
    };

    fetchDateSheets();
  }, [effectiveSchoolId]);

  // Modal Form State
  const [editingSheetId, setEditingSheetId] = useState(null);
  const [entryMode, setEntryMode] = useState('manual'); // 'manual' | 'upload'
  const [modalClass, setModalClass] = useState('');
  const [modalTerm, setModalTerm] = useState('Term 1');
  const [modalExam, setModalExam] = useState('None');
  const [customExamName, setCustomExamName] = useState('');
  const [examNotes, setExamNotes] = useState('');

  // Uploaded file state
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);

  // Manual schedule rows
  const [schedules, setSchedules] = useState([
    { id: 1, date: '2026-11-02', subject: 'English', from: '09:00 AM', to: '12:00 PM' },
    { id: 2, date: '2026-11-04', subject: 'Mathematics', from: '09:00 AM', to: '12:00 PM' },
    { id: 3, date: '2026-11-06', subject: 'Science', from: '09:00 AM', to: '12:00 PM' }
  ]);

  const addScheduleRow = () => {
    setSchedules((prev) => [
      ...prev,
      {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        subject: 'Social Science',
        from: '09:00 AM',
        to: '12:00 PM'
      }
    ]);
  };

  const removeScheduleRow = (id) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  };

  const handleOpenAddModal = () => {
    setEditingSheetId(null);
    setEntryMode('manual');
    setModalClass(availableClasses[0] || '');
    setModalTerm('Term 1');
    setModalExam('None');
    setCustomExamName('');
    setExamNotes('');
    setUploadedFile(null);
    setSchedules([
      { id: 1, date: '2026-11-02', subject: 'English', from: '09:00 AM', to: '12:00 PM' },
      { id: 2, date: '2026-11-04', subject: 'Mathematics', from: '09:00 AM', to: '12:00 PM' },
      { id: 3, date: '2026-11-06', subject: 'Science', from: '09:00 AM', to: '12:00 PM' }
    ]);
    setIsModalOpen(true);
  };

  const handleEditDateSheet = (item, e) => {
    if (e) e.stopPropagation();
    setEditingSheetId(item.id);
    const mode = item.entryMode || (item.fileData && (!item.schedules || item.schedules.length === 0) ? 'upload' : 'manual');
    setEntryMode(mode);
    setModalClass(item.className || availableClasses[0] || '');
    setModalTerm(item.examTerm || 'Term 1');

    if (EXAMS.includes(item.examName)) {
      setModalExam(item.examName);
      setCustomExamName('');
    } else {
      setModalExam('None');
      setCustomExamName(item.examName || '');
    }

    setExamNotes(item.notes || '');

    if (item.schedules && item.schedules.length > 0) {
      setSchedules(item.schedules);
    } else {
      setSchedules([
        { id: 1, date: new Date().toISOString().split('T')[0], subject: 'English', from: '09:00 AM', to: '12:00 PM' }
      ]);
    }

    if (item.fileData) {
      setUploadedFile({
        name: item.file || `${item.className}_DateSheet.pdf`,
        size: item.fileSize || 'Uploaded File',
        dataUrl: item.fileData
      });
    } else {
      setUploadedFile(null);
    }

    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedFile({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        type: file.type,
        dataUrl: reader.result
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSaveDateSheet = async () => {
    if (!modalClass) {
      alert('Please select a class! If no classes exist, please add them in Class Master first.');
      return;
    }

    if (entryMode === 'upload' && !uploadedFile) {
      alert('Please choose or upload a file first!');
      return;
    }

    if (entryMode === 'manual' && schedules.length === 0) {
      alert('Please add at least one subject row!');
      return;
    }

    const resolvedExamName =
      customExamName.trim() ||
      (modalExam !== 'None' ? modalExam : `${modalTerm} Examination 2026`);

    const fileName =
      entryMode === 'upload' && uploadedFile
        ? uploadedFile.name
        : `${modalClass.replace(/\s+/g, '_')}_DateSheet.pdf`;

    const sheetId = editingSheetId || `eds_${Date.now()}`;

    const sheetData = {
      id: sheetId,
      schoolId: effectiveSchoolId,
      entryMode,
      className: modalClass,
      examTerm: modalTerm,
      examName: resolvedExamName,
      file: fileName,
      fileData: entryMode === 'upload' ? uploadedFile?.dataUrl : '',
      fileSize: entryMode === 'upload' ? uploadedFile?.size : '',
      notes: examNotes,
      schedules: entryMode === 'manual' ? schedules : [],
      updatedAt: new Date().toISOString()
    };

    if (editingSheetId) {
      // 1. Update existing sheet in local tenantStore
      tenantStore.updateExamDateSheet(effectiveSchoolId, editingSheetId, sheetData);
      setDateSheets((prev) =>
        prev.map((item) => (item.id === editingSheetId ? { ...item, ...sheetData } : item))
      );

      // 2. Update existing sheet in backend API
      try {
        await fetch(`/api/students/exam-date-sheets/${editingSheetId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-school-id': effectiveSchoolId
          },
          body: JSON.stringify(sheetData)
        });
      } catch (e) {
        console.warn('Backend update sync error:', e);
      }

      setToastMessage('Exam Date Sheet updated successfully!');
    } else {
      // 1. Create new sheet in local tenantStore
      sheetData.createdAt = new Date().toISOString();
      tenantStore.addExamDateSheet(effectiveSchoolId, sheetData);
      setDateSheets((prev) => [sheetData, ...prev.filter((item) => item.id !== sheetData.id)]);

      // 2. Create new sheet in backend API
      try {
        await fetch('/api/students/exam-date-sheets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-school-id': effectiveSchoolId
          },
          body: JSON.stringify(sheetData)
        });
      } catch (e) {
        console.warn('Backend create sync error:', e);
      }

      setToastMessage('Exam Date Sheet saved successfully!');
    }

    // Reset Form
    setIsModalOpen(false);
    setEditingSheetId(null);
    setUploadedFile(null);
    setCustomExamName('');
    setExamNotes('');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDeleteDateSheet = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this Exam Date Sheet?')) return;

    tenantStore.deleteExamDateSheet(effectiveSchoolId, id);
    setDateSheets((prev) => prev.filter((s) => s.id !== id));

    try {
      await fetch(`/api/students/exam-date-sheets/${id}`, {
        method: 'DELETE',
        headers: { 'x-school-id': effectiveSchoolId }
      });
    } catch (e) {
      console.warn('Backend delete sync error:', e);
    }

    setToastMessage('Exam Date Sheet deleted successfully!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Open PDF / Preview functionality
  const handleOpenPdf = (item) => {
    if (item.fileData) {
      // User uploaded file
      const win = window.open();
      if (win) {
        win.document.write(`
          <!DOCTYPE html>
          <html>
            <head><title>${item.file || 'Exam Date Sheet'}</title></head>
            <body style="margin:0;padding:0;background:#525659;display:flex;justify-content:center;align-items:center;height:100vh;">
              <iframe src="${item.fileData}" style="width:100%;height:100%;border:none;"></iframe>
            </body>
          </html>
        `);
        win.document.close();
      } else {
        const a = document.createElement('a');
        a.href = item.fileData;
        a.download = item.file || `${item.className}_DateSheet.pdf`;
        a.click();
      }
    } else {
      // Manual entry date sheet -> open beautiful printable preview modal
      setPreviewDateSheet(item);
    }
  };

  const getDayName = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-US', { weekday: 'long' });
      }
    } catch (e) {}
    return '';
  };

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
    } catch (e) {}
    return dateStr;
  };

  const filtered = dateSheets.filter((d) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (d.className || '').toLowerCase().includes(q) ||
      (d.examTerm || '').toLowerCase().includes(q) ||
      (d.examName || '').toLowerCase().includes(q) ||
      (d.file || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-4 md:p-6 bg-[#f3f4f6] min-h-screen text-slate-800">
      {/* Print Specific CSS Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-date-sheet, #printable-date-sheet * {
            visibility: visible !important;
          }
          #printable-date-sheet {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            background: white !important;
            padding: 20px !important;
            margin: 0 !important;
          }
        }
      `}</style>

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 mb-3">
        <h1 className="text-base md:text-lg font-bold text-gray-800">Exam Date Sheet</h1>
        <span className="text-gray-400 text-xs flex items-center gap-1.5 font-normal">
          <span>🏠</span>
          <span>•</span>
          <span>Students</span>
          <span>•</span>
          <span className="text-gray-600 font-medium">Exam Date Sheet</span>
        </span>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-2xs p-4 md:p-5">
        {/* Top Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full pl-9 pr-4 py-2 text-xs md:text-sm border border-gray-200 rounded-full focus:border-indigo-600 focus:outline-none bg-gray-50/50"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('/student-sms')}
              className="p-2 text-indigo-600 hover:bg-indigo-50 border border-indigo-100 rounded-lg transition-colors cursor-pointer"
              title="SMS Notification"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setToastMessage('Date sheet view refreshed');
                setTimeout(() => setToastMessage(null), 2500);
              }}
              className="p-2 text-gray-600 hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors cursor-pointer"
              title="Filter"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-md transition-all hover:scale-105 cursor-pointer"
              title="Add Exam Date Sheet"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toast */}
        {toastMessage && (
          <div className="mb-4 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-lg flex items-center gap-2 animate-fade-in">
            <Check className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-700 font-bold uppercase tracking-wider text-[11px] bg-gray-50/40">
                <th className="py-3 px-4">S.NO.</th>
                <th className="py-3 px-4">CLASS</th>
                <th className="py-3 px-4">EXAM TERM</th>
                <th className="py-3 px-4">EXAM NAME</th>
                <th className="py-3 px-4">FILE / PREVIEW</th>
                <th className="py-3 px-4 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-400">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    No exam date sheets found. Click the &apos;+&apos; button to create or upload one.
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-4">{idx + 1}</td>
                    <td className="py-3 px-4 font-semibold text-gray-900">{item.className}</td>
                    <td className="py-3 px-4 font-semibold text-indigo-600">{item.examTerm}</td>
                    <td className="py-3 px-4 font-semibold text-gray-800">{item.examName}</td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => handleOpenPdf(item)}
                        className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1.5 cursor-pointer font-medium text-left"
                        title="Click to View / Download PDF"
                      >
                        <FileText className="w-4 h-4 text-red-500 shrink-0" />
                        <span>{item.file || `${item.className}_DateSheet.pdf`}</span>
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenPdf(item)}
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded transition-colors cursor-pointer"
                          title="View / Print PDF"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleEditDateSheet(item, e)}
                          className="p-1.5 text-amber-600 hover:bg-amber-50 rounded transition-colors cursor-pointer"
                          title="Edit Date Sheet"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteDateSheet(item.id, e)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer"
                          title="Delete Date Sheet"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-end text-xs text-gray-500 gap-4">
          <span>Items per page:</span>
          <select className="border border-gray-200 rounded px-2 py-1 bg-white focus:outline-none cursor-pointer">
            <option>50</option>
            <option>100</option>
          </select>
          <span>
            1 - {filtered.length} of {filtered.length}
          </span>
        </div>
      </div>

      {/* EXAM DATE SHEET MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 flex justify-between items-center border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-sm md:text-base font-bold text-gray-800 tracking-wide uppercase">
                {editingSheetId ? 'EDIT EXAM DATE SHEET' : 'EXAM DATE SHEET'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {/* Radio Options */}
              <div className="flex items-center gap-6 text-xs font-semibold text-gray-700">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="entryMode"
                    value="manual"
                    checked={entryMode === 'manual'}
                    onChange={() => setEntryMode('manual')}
                    className="text-red-500 accent-red-500 cursor-pointer"
                  />
                  <span>Manual Entry</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="entryMode"
                    value="upload"
                    checked={entryMode === 'upload'}
                    onChange={() => setEntryMode('upload')}
                    className="text-red-500 accent-red-500 cursor-pointer"
                  />
                  <span>Upload File</span>
                </label>
              </div>

              {/* Filters Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="relative">
                  <label className="absolute -top-2 left-2.5 px-1 text-[11px] font-medium text-gray-500 bg-white z-10">
                    Class*
                  </label>
                  <div className="relative">
                    <select
                      value={modalClass}
                      onChange={(e) => setModalClass(e.target.value)}
                      className="w-full px-3 py-2 text-xs md:text-sm bg-white border border-gray-300 rounded focus:border-indigo-600 focus:outline-none appearance-none cursor-pointer"
                    >
                      {availableClasses.length === 0 ? (
                        <option value="" disabled>
                          -- No classes added in Class Master --
                        </option>
                      ) : (
                        availableClasses.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))
                      )}
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                  </div>
                  {availableClasses.length === 0 && (
                    <div className="text-[10px] text-amber-600 mt-1 flex items-center justify-between font-medium">
                      <span>No classes found in Class Master.</span>
                      {onNavigate && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsModalOpen(false);
                            onNavigate('/class-master');
                          }}
                          className="text-indigo-600 underline font-semibold hover:text-indigo-800 cursor-pointer"
                        >
                          Add in Class Master
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <label className="absolute -top-2 left-2.5 px-1 text-[11px] font-medium text-gray-500 bg-white z-10">
                    Term*
                  </label>
                  <div className="relative">
                    <select
                      value={modalTerm}
                      onChange={(e) => setModalTerm(e.target.value)}
                      className="w-full px-3 py-2 text-xs md:text-sm bg-white border border-gray-300 rounded focus:border-indigo-600 focus:outline-none appearance-none cursor-pointer"
                    >
                      {TERMS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                  </div>
                </div>

                <div className="relative">
                  <label className="absolute -top-2 left-2.5 px-1 text-[11px] font-medium text-gray-500 bg-white z-10">
                    Exam
                  </label>
                  <div className="relative">
                    <select
                      value={modalExam}
                      onChange={(e) => setModalExam(e.target.value)}
                      className="w-full px-3 py-2 text-xs md:text-sm bg-white border border-gray-300 rounded focus:border-indigo-600 focus:outline-none appearance-none cursor-pointer"
                    >
                      {EXAMS.map((x) => (
                        <option key={x} value={x}>
                          {x}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Optional Custom Exam Name */}
              {modalExam === 'None' && (
                <div>
                  <input
                    type="text"
                    value={customExamName}
                    onChange={(e) => setCustomExamName(e.target.value)}
                    placeholder="Enter custom exam title (e.g. Final Board Examination 2027)"
                    className="w-full px-3 py-1.5 text-xs md:text-sm border border-gray-300 rounded focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              )}

              {/* CONDITIONAL: Upload File View */}
              {entryMode === 'upload' ? (
                <div className="space-y-3 pt-1">
                  <label className="block text-xs font-semibold text-gray-700">
                    Upload Date Sheet Document (PDF / Image / Word)
                  </label>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                    className="hidden"
                  />

                  {!uploadedFile ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 hover:border-indigo-500 bg-gray-50/50 hover:bg-indigo-50/20 rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
                    >
                      <div className="w-12 h-12 rounded-full bg-indigo-50 group-hover:bg-indigo-100 flex items-center justify-center text-indigo-600 transition-colors">
                        <Upload className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-semibold text-gray-700">
                        Click or drag & drop to choose a file
                      </p>
                      <p className="text-xs text-gray-400">
                        Supports PDF, PNG, JPG, DOC (Max file size: 10MB)
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 border border-indigo-200 bg-indigo-50/30 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-800 truncate">
                            {uploadedFile.name}
                          </p>
                          <p className="text-xs text-gray-500">{uploadedFile.size}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-100 rounded cursor-pointer"
                        >
                          Change
                        </button>
                        <button
                          type="button"
                          onClick={() => setUploadedFile(null)}
                          className="p-1 text-red-500 hover:bg-red-100 rounded cursor-pointer"
                          title="Remove file"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* CONDITIONAL: Manual Entry Sub-Table */
                <>
                  <div className="border border-gray-300 rounded overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-gray-400 text-gray-900 font-bold uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="p-2 border-r border-gray-300 w-12 text-center">S.NO.</th>
                          <th className="p-2 border-r border-gray-300">DATE</th>
                          <th className="p-2 border-r border-gray-300">SUBJECT</th>
                          <th className="p-2 border-r border-gray-300 text-center" colSpan="2">
                            TIME (FROM - TO)
                          </th>
                          <th className="p-2 text-center w-14">ACTION</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {schedules.map((s, idx) => (
                          <tr key={s.id} className="hover:bg-gray-50">
                            <td className="p-2 text-center font-semibold border-r border-gray-200">
                              {idx + 1}
                            </td>
                            <td className="p-1 border-r border-gray-200">
                              <input
                                type="date"
                                value={s.date}
                                onChange={(e) => {
                                  const v = e.target.value;
                                  setSchedules((prev) =>
                                    prev.map((item) =>
                                      item.id === s.id ? { ...item, date: v } : item
                                    )
                                  );
                                }}
                                className="w-full px-1.5 py-1 text-xs border border-gray-200 rounded"
                              />
                            </td>
                            <td className="p-1 border-r border-gray-200">
                              <select
                                value={s.subject}
                                onChange={(e) => {
                                  const v = e.target.value;
                                  setSchedules((prev) =>
                                    prev.map((item) =>
                                      item.id === s.id ? { ...item, subject: v } : item
                                    )
                                  );
                                }}
                                className="w-full px-1.5 py-1 text-xs border border-gray-200 rounded bg-white"
                              >
                                {SUBJECTS.map((sub) => (
                                  <option key={sub} value={sub}>
                                    {sub}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="p-1 border-r border-gray-200 w-24">
                              <input
                                type="text"
                                value={s.from}
                                onChange={(e) => {
                                  const v = e.target.value;
                                  setSchedules((prev) =>
                                    prev.map((item) =>
                                      item.id === s.id ? { ...item, from: v } : item
                                    )
                                  );
                                }}
                                className="w-full px-1 py-1 text-xs border border-gray-200 rounded text-center"
                              />
                            </td>
                            <td className="p-1 border-r border-gray-200 w-24">
                              <input
                                type="text"
                                value={s.to}
                                onChange={(e) => {
                                  const v = e.target.value;
                                  setSchedules((prev) =>
                                    prev.map((item) =>
                                      item.id === s.id ? { ...item, to: v } : item
                                    )
                                  );
                                }}
                                className="w-full px-1 py-1 text-xs border border-gray-200 rounded text-center"
                              />
                            </td>
                            <td className="p-1 text-center">
                              <button
                                type="button"
                                onClick={() => removeScheduleRow(s.id)}
                                className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                                title="Remove row"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={addScheduleRow}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded border border-gray-300 cursor-pointer"
                    >
                      + Add Subject Row
                    </button>
                  </div>
                </>
              )}

              {/* Exam Notes Textarea */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600">Exam Notes</label>
                <textarea
                  value={examNotes}
                  onChange={(e) => setExamNotes(e.target.value)}
                  rows={2}
                  placeholder="Instructions for students (e.g. Bring admit card, reporting time 15 minutes before exam)..."
                  className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 rounded focus:border-indigo-600 focus:outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end items-center gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs md:text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveDateSheet}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs md:text-sm font-semibold rounded shadow-xs cursor-pointer"
                >
                  {editingSheetId ? 'Update Date Sheet' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRINTABLE / PDF PREVIEW MODAL */}
      {previewDateSheet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-2xs p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden max-h-[92vh] flex flex-col">
            {/* Modal Top Bar (Hidden on print) */}
            <div className="px-5 py-3.5 flex justify-between items-center border-b border-gray-200 bg-gray-50 print:hidden">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-gray-800 text-sm md:text-base">
                  Date Sheet Preview & Print
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  Print / Save PDF
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDateSheet(null)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 rounded-md cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Content (Visible on screen and on print) */}
            <div className="p-6 md:p-8 overflow-y-auto flex-1 bg-gray-100/50">
              <div
                id="printable-date-sheet"
                className="bg-white border-2 border-gray-800 rounded-lg p-6 md:p-8 shadow-sm text-gray-900 max-w-2xl mx-auto"
              >
                {/* Header */}
                <div className="text-center border-b-2 border-gray-800 pb-4 mb-4">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    {profile?.brandingImages?.school_logo || profile?.logoUrl ? (
                      <img
                        src={profile?.brandingImages?.school_logo || profile?.logoUrl}
                        alt="Logo"
                        className="w-14 h-14 object-contain shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-indigo-900 text-amber-300 font-bold flex items-center justify-center text-sm">
                        JD
                      </div>
                    )}
                    <div className="flex-1 text-center">
                      <h2 className="text-xl md:text-2xl font-black text-indigo-950 uppercase tracking-tight">
                        {profile?.schoolName || 'J D INTERNATIONAL SCHOOL'}
                      </h2>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {profile?.address || 'Mahapura, Ajmer Road, Jaipur'} | Mob:{' '}
                        {profile?.phone1 || '8947919195'}
                      </p>
                      <p className="text-[11px] font-semibold text-gray-500">
                        CBSE Affiliation No.: {profile?.affiliationNo || '1730619'} | School Code:{' '}
                        {profile?.schoolCode || '10964'}
                      </p>
                    </div>
                    <div className="w-14 h-14 shrink-0" />
                  </div>

                  <div className="inline-block bg-indigo-900 text-white font-extrabold text-xs md:text-sm px-4 py-1 rounded-full uppercase tracking-wider mt-2">
                    {previewDateSheet.examName || 'EXAMINATION DATE SHEET'}
                  </div>
                </div>

                {/* Meta details */}
                <div className="flex justify-between items-center text-xs md:text-sm font-bold border-b border-gray-300 pb-2 mb-4 text-gray-700">
                  <div>
                    <span>CLASS: </span>
                    <span className="text-indigo-900 uppercase font-black">
                      {previewDateSheet.className}
                    </span>
                  </div>
                  <div>
                    <span>TERM: </span>
                    <span className="text-indigo-900 font-black">
                      {previewDateSheet.examTerm}
                    </span>
                  </div>
                  <div>
                    <span>ACADEMIC SESSION: </span>
                    <span className="text-indigo-900 font-black">2026 - 2027</span>
                  </div>
                </div>

                {/* Schedules Table */}
                <div className="mb-6 overflow-x-auto">
                  <table className="w-full text-left border-collapse border border-gray-800 text-xs md:text-sm">
                    <thead>
                      <tr className="bg-gray-100 border-b border-gray-800 font-bold text-gray-900 text-center uppercase">
                        <th className="p-2 border-r border-gray-800 w-12">S.No.</th>
                        <th className="p-2 border-r border-gray-800">Date</th>
                        <th className="p-2 border-r border-gray-800">Day</th>
                        <th className="p-2 border-r border-gray-800">Subject</th>
                        <th className="p-2">Exam Timing</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewDateSheet.schedules && previewDateSheet.schedules.length > 0 ? (
                        previewDateSheet.schedules.map((s, idx) => (
                          <tr
                            key={s.id || idx}
                            className={`border-b border-gray-300 ${
                              idx % 2 === 1 ? 'bg-gray-50/50' : ''
                            }`}
                          >
                            <td className="p-2 border-r border-gray-800 text-center font-bold">
                              {idx + 1}
                            </td>
                            <td className="p-2 border-r border-gray-800 text-center font-semibold">
                              {formatDateDisplay(s.date)}
                            </td>
                            <td className="p-2 border-r border-gray-800 text-center text-gray-700 font-medium">
                              {getDayName(s.date)}
                            </td>
                            <td className="p-2 border-r border-gray-800 font-bold text-indigo-950">
                              {s.subject}
                            </td>
                            <td className="p-2 text-center font-semibold text-gray-800">
                              {s.from} - {s.to}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="p-4 text-center text-gray-500 italic">
                            Uploaded Document: {previewDateSheet.file}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Notes & Instructions */}
                <div className="bg-gray-50 border border-gray-200 rounded p-3 text-xs mb-8">
                  <p className="font-bold text-gray-800 mb-1">GENERAL INSTRUCTIONS:</p>
                  <ul className="list-disc list-inside space-y-0.5 text-gray-600 text-[11px]">
                    <li>Students must report to the examination hall 15 minutes before start.</li>
                    <li>School ID Card and Examination Admit Card are compulsory.</li>
                    <li>No electronic devices or mobile phones are allowed inside the hall.</li>
                    {previewDateSheet.notes && (
                      <li className="font-semibold text-gray-900 mt-1">
                        Note: {previewDateSheet.notes}
                      </li>
                    )}
                  </ul>
                </div>

                {/* Signatures */}
                <div className="flex justify-between items-end pt-4 mt-6 border-t border-dashed border-gray-400 text-xs font-bold text-gray-800">
                  <div className="text-center">
                    <div className="w-32 border-b border-gray-700 mb-1" />
                    <span>Exam In-Charge</span>
                  </div>
                  <div className="text-center">
                    {profile?.brandingImages?.principal_sig || profile?.principalSigUrl ? (
                      <img
                        src={profile?.brandingImages?.principal_sig || profile?.principalSigUrl}
                        alt="Signature"
                        className="h-7 mx-auto mb-1 object-contain"
                      />
                    ) : (
                      <div className="w-32 border-b border-gray-700 mb-1" />
                    )}
                    <span>Principal Signature</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
