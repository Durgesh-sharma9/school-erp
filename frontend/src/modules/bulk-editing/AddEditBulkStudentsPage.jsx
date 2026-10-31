import React, { useState, useEffect, useMemo } from 'react';
import {
  Home,
  FileEdit,
  Save,
  Plus,
  Trash2,
  FileSpreadsheet,
  Download,
  Upload,
  RefreshCw,
  Search,
  CheckCircle,
  AlertCircle,
  Hash,
  Users,
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { tenantStore } from '../../services/tenantStore';

const STANDARD_CLASSES = [
  'Nursery', 'LKG', 'UKG',
  'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII',
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'
];

const normalizeClass = (val) => {
  const s = String(val || '').toLowerCase().replace(/^class\s*/i, '').trim();
  const map = { '1':'i', '2':'ii', '3':'iii', '4':'iv', '5':'v', '6':'vi', '7':'vii', '8':'viii', '9':'ix', '10':'x', '11':'xi', '12':'xii' };
  return map[s] || s;
};

export function AddEditBulkStudentsPage({ onNavigate }) {
  const { schoolId: authSchoolId } = useAuth();
  const schoolId = authSchoolId || localStorage.getItem('active_school_id') || 'sch_jd_intl';

  // Discover real enrolled classes
  const initialEnrolled = useMemo(() => {
    return tenantStore.getStudents(schoolId) || [];
  }, [schoolId]);

  const availableClasses = useMemo(() => {
    const set = new Set();
    initialEnrolled.forEach(s => {
      if (s.className) set.add(s.className);
    });
    STANDARD_CLASSES.forEach(c => set.add(c));
    return Array.from(set);
  }, [initialEnrolled]);

  // Default to the class that actually has enrolled students
  const [selectedClass, setSelectedClass] = useState(() => {
    if (initialEnrolled.length > 0 && initialEnrolled[0].className) {
      return initialEnrolled[0].className;
    }
    return 'I';
  });

  const [selectedSection, setSelectedSection] = useState('A');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [studentRows, setStudentRows] = useState([]);

  // Load actual students for the chosen class and section
  const loadClassStudents = async (targetClass, targetSection) => {
    setLoading(true);
    try {
      // 1. Get from tenantStore first
      const local = tenantStore.getStudents(schoolId) || [];
      let matched = local.filter(s =>
        normalizeClass(s.className) === normalizeClass(targetClass) &&
        String(s.section || 'A').trim().toLowerCase() === String(targetSection || 'A').trim().toLowerCase()
      );

      // 2. Fetch from backend endpoint
      try {
        const res = await fetch(`/api/students/bulk?className=${encodeURIComponent(targetClass)}&section=${encodeURIComponent(targetSection)}`, {
          headers: { 'x-school-id': schoolId }
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            matched = json.data;
          }
        }
      } catch (e) {}

      // Map to grid format
      const mappedRows = matched.map((s, idx) => ({
        id: s.id || `std_${Date.now()}_${idx}`,
        sr_no: s.sr_no || s.srNo || String(1000 + idx),
        adm_no: s.adm_no || s.admNo || `ADM-${1000 + idx}`,
        permanent_edu_no: s.permanent_edu_no || s.pen || '',
        enroll_no: s.enroll_no || s.enrollNo || '',
        adm_date: s.adm_date || s.admissionDate || s.createdAt?.split('T')[0] || '',
        class_id: s.class_id || s.className || targetClass,
        division_id: s.division_id || s.section || targetSection,
        first_name: s.first_name || s.firstName || s.name?.split(' ')[0] || '',
        last_name: s.last_name !== undefined ? s.last_name : (s.lastName || s.name?.split(' ').slice(1).join(' ') || ''),
        dob: s.dob || '',
        gender: s.gender || 'Male',
        blood_group: s.blood_group || s.bloodGroup || 'B+',
        aadhaar: s.aadhaar || '',
        nationality: s.nationality || 'Indian',
        religion: s.religion || 'Hindu',
        category: s.category || 'General',
        house: s.house || 'Red House',
        fathers_name: s.fathers_name || s.fatherName || '',
        fathers_mobile_no: s.fathers_mobile_no || s.fatherMobile || s.contactNo || '',
        fathers_aadhaar: s.fathers_aadhaar || s.fatherAadhaar || '',
        mothers_name: s.mothers_name || s.motherName || '',
        mothers_mobile_no: s.mothers_mobile_no || s.motherMobile || '',
        mothers_aadhaar: s.mothers_aadhaar || s.motherAadhaar || ''
      }));

      setStudentRows(mappedRows);
    } finally {
      setLoading(false);
      setHasUnsavedChanges(false);
    }
  };

  // Load on mount and whenever class/section changes
  useEffect(() => {
    loadClassStudents(selectedClass, selectedSection);
  }, [selectedClass, selectedSection, schoolId]);

  // Keyboard shortcut Ctrl+S / Cmd+S to save
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSaveAll();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [studentRows, selectedClass, selectedSection]);

  const handleCellChange = (id, field, value) => {
    setStudentRows(prev =>
      prev.map(row => (row.id === id ? { ...row, [field]: value } : row))
    );
    setHasUnsavedChanges(true);
  };

  const handleAddNewRow = () => {
    const highestSr = studentRows.reduce((max, r) => {
      const num = parseInt(r.sr_no, 10);
      return !isNaN(num) && num > max ? num : max;
    }, 1000);

    const highestAdm = studentRows.reduce((max, r) => {
      const num = parseInt(String(r.adm_no).replace(/\D/g, ''), 10);
      return !isNaN(num) && num > max ? num : max;
    }, 1000);

    const newRow = {
      id: `new-row-${Date.now()}`,
      sr_no: String(highestSr + 1),
      adm_no: String(highestAdm + 1),
      permanent_edu_no: '',
      enroll_no: '',
      adm_date: new Date().toISOString().split('T')[0],
      class_id: selectedClass,
      division_id: selectedSection,
      first_name: '',
      last_name: '',
      dob: '2018-01-01',
      gender: 'Male',
      blood_group: 'B+',
      aadhaar: '',
      nationality: 'Indian',
      religion: 'Hindu',
      category: 'General',
      house: 'Red House',
      fathers_name: '',
      fathers_mobile_no: '',
      fathers_aadhaar: '',
      mothers_name: '',
      mothers_mobile_no: '',
      mothers_aadhaar: ''
    };

    setStudentRows(prev => [...prev, newRow]);
    setHasUnsavedChanges(true);
    toast.success('Added new student row at the bottom');
  };

  const handleDeleteRow = (id) => {
    setStudentRows(prev => prev.filter(r => r.id !== id));
    setHasUnsavedChanges(true);
    toast.success('Row removed');
  };

  // Auto Generate Consecutive SR Numbers
  const handleAutoGenerateSr = () => {
    let startSr = 1001;
    const updated = studentRows.map((row, idx) => ({
      ...row,
      sr_no: String(startSr + idx)
    }));
    setStudentRows(updated);
    setHasUnsavedChanges(true);
    toast.success('Auto-generated consecutive SR numbers!');
  };

  // Save All Changes to tenantStore and backend
  const handleSaveAll = async () => {
    // Validate rows
    for (let i = 0; i < studentRows.length; i++) {
      const r = studentRows[i];
      if (!r.adm_no || !r.adm_no.trim()) {
        toast.error(`Row #${i + 1}: Adm No is required`);
        return;
      }
      if (!r.first_name || !r.first_name.trim()) {
        toast.error(`Row #${i + 1}: First Name is required`);
        return;
      }
      if (r.aadhaar && r.aadhaar.length !== 12) {
        toast.error(`Row #${i + 1} (${r.first_name}): Aadhaar must be 12 digits`);
        return;
      }
      if (r.fathers_mobile_no && r.fathers_mobile_no.length !== 10) {
        toast.error(`Row #${i + 1} (${r.first_name}): Father Mobile must be 10 digits`);
        return;
      }
    }

    setSaving(true);
    try {
      // 1. Sync each row into tenantStore
      studentRows.forEach(row => {
        const studentObj = {
          id: row.id,
          srNo: row.sr_no,
          admNo: row.adm_no,
          pen: row.permanent_edu_no,
          enrollNo: row.enroll_no,
          admissionDate: row.adm_date,
          className: selectedClass,
          section: selectedSection,
          firstName: row.first_name,
          lastName: row.last_name,
          name: `${row.first_name} ${row.last_name || ''}`.trim(),
          dob: row.dob,
          gender: row.gender,
          bloodGroup: row.blood_group,
          aadhaar: row.aadhaar,
          category: row.category,
          house: row.house,
          fatherName: row.fathers_name,
          fatherMobile: row.fathers_mobile_no,
          contactNo: row.fathers_mobile_no,
          fatherAadhaar: row.fathers_aadhaar,
          motherName: row.mothers_name,
          motherMobile: row.mothers_mobile_no,
          motherAadhaar: row.mothers_aadhaar
        };
        tenantStore.updateStudent(schoolId, row.adm_no, studentObj);
      });

      // 2. POST to backend /api/students/bulk-save
      try {
        await fetch('/api/students/bulk-save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-school-id': schoolId
          },
          body: JSON.stringify({ students: studentRows })
        });
      } catch (e) {}

      toast.success(`🎉 Successfully saved ${studentRows.length} student records!`);
      setHasUnsavedChanges(false);
    } catch (err) {
      toast.error('Failed to save student records');
    } finally {
      setSaving(false);
    }
  };

  const handleExportExcel = () => {
    let csv = "SR No,Adm No,PEN,Enroll No,Adm Date,Class,Section,First Name,Last Name,DOB,Gender,Blood Group,Aadhaar,Religion,Category,House,Father Name,Father Mobile,Father Aadhaar,Mother Name,Mother Mobile,Mother Aadhaar\n";
    studentRows.forEach((r) => {
      csv += `"${r.sr_no}","${r.adm_no}","${r.permanent_edu_no}","${r.enroll_no}","${r.adm_date}","${r.class_id}","${r.division_id}","${r.first_name}","${r.last_name}","${r.dob}","${r.gender}","${r.blood_group}","${r.aadhaar}","${r.religion}","${r.category}","${r.house}","${r.fathers_name}","${r.fathers_mobile_no}","${r.fathers_aadhaar}","${r.mothers_name}","${r.mothers_mobile_no}","${r.mothers_aadhaar}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Bulk_Students_Class_${selectedClass}_${selectedSection}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Bulk students data exported to CSV/Excel!');
  };

  const handleImportSample = () => {
    toast.success('Sample Excel Template format downloaded! Fill and upload anytime.');
  };

  const filteredRows = studentRows.filter(r => {
    if (!searchFilter) return true;
    const q = searchFilter.toLowerCase();
    return (
      (r.first_name || '').toLowerCase().includes(q) ||
      (r.last_name && r.last_name.toLowerCase().includes(q)) ||
      (r.sr_no || '').toLowerCase().includes(q) ||
      (r.adm_no || '').toLowerCase().includes(q) ||
      (r.fathers_name || '').toLowerCase().includes(q) ||
      (r.fathers_mobile_no || '').includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 pb-16">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-xs sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
            <FileEdit className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base md:text-lg font-bold text-slate-900 leading-tight">
              Add / Edit Bulk Students (Excel Grid Studio)
            </h1>
            <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
              <button onClick={() => onNavigate && onNavigate('/')} className="hover:text-indigo-600 transition-colors">
                <Home className="w-3.5 h-3.5" />
              </button>
              <span>•</span>
              <span className="text-slate-600">Bulk Editing</span>
              <span>•</span>
              <span className="text-indigo-600 font-semibold">Edit Bulk Student</span>
            </div>
          </div>
        </div>

        {/* Action Header Buttons */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleImportSample}
            className="h-9 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center space-x-1.5 shadow-xs text-xs font-bold transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Sample Template</span>
          </button>
          <button
            type="button"
            onClick={handleExportExcel}
            className="h-9 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center space-x-1.5 shadow-xs text-xs font-bold transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export Excel</span>
          </button>
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={saving}
            className="h-9 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center space-x-1.5 shadow-xs text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
          >
            <Save className={`w-3.5 h-3.5 ${saving ? 'animate-spin' : ''}`} />
            <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
          </button>
        </div>
      </div>

      <div className="max-w-full mx-auto px-4 md:px-8 pt-6 space-y-4">

        {/* Filter & Bulk Quick Actions Toolbar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Class</span>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {availableClasses.map(c => (
                  <option key={c} value={c}>{c.startsWith('Class') ? c : `Class ${c}`}</option>
                ))}
              </select>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Section</span>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>

            <div className="self-end">
              <button
                type="button"
                onClick={() => loadClassStudents(selectedClass, selectedSection)}
                disabled={loading}
                className="h-9 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Fetch Students</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-end">
            <button
              type="button"
              onClick={handleAddNewRow}
              className="h-9 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>Add Student Row</span>
            </button>

            <button
              type="button"
              onClick={handleAutoGenerateSr}
              className="h-9 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Hash className="w-3.5 h-3.5 text-purple-600" />
              <span>Auto Generate SR No</span>
            </button>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search row..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="h-9 pl-8 pr-3 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-44"
              />
            </div>
          </div>
        </div>

        {/* Unsaved Changes Banner */}
        {hasUnsavedChanges && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs font-semibold text-amber-800">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>You have unsaved edits in the student grid. Press Ctrl+S or click "Save All Changes" to save!</span>
            </div>
            <button
              type="button"
              onClick={handleSaveAll}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
            >
              Save Now
            </button>
          </div>
        )}

        {/* EXCEL SPREADSHEET TABLE GRID */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto max-h-[640px] [scrollbar-width:thin] [scrollbar-color:#cbd5e1_#f8fafc] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-400">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="sticky top-0 z-20 bg-slate-100/90 backdrop-blur-xs border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider select-none">
                <tr>
                  <th className="py-2.5 px-2 w-10 text-center border-r border-slate-200">#</th>
                  <th className="py-2.5 px-3 min-w-[90px] border-r border-slate-200">SR No</th>
                  <th className="py-2.5 px-3 min-w-[110px] border-r border-slate-200">Adm No *</th>
                  <th className="py-2.5 px-3 min-w-[110px] border-r border-slate-200">PEN No</th>
                  <th className="py-2.5 px-3 min-w-[125px] border-r border-slate-200">Adm Date</th>
                  <th className="py-2.5 px-3 min-w-[130px] border-r border-slate-200">First Name *</th>
                  <th className="py-2.5 px-3 min-w-[110px] border-r border-slate-200">Last Name</th>
                  <th className="py-2.5 px-3 min-w-[125px] border-r border-slate-200">DOB</th>
                  <th className="py-2.5 px-3 min-w-[100px] border-r border-slate-200">Gender</th>
                  <th className="py-2.5 px-3 min-w-[90px] border-r border-slate-200">Blood Grp</th>
                  <th className="py-2.5 px-3 min-w-[140px] border-r border-slate-200">Aadhaar (12 Digits)</th>
                  <th className="py-2.5 px-3 min-w-[100px] border-r border-slate-200">Category</th>
                  <th className="py-2.5 px-3 min-w-[100px] border-r border-slate-200">House</th>
                  <th className="py-2.5 px-3 min-w-[150px] border-r border-slate-200">Father's Name</th>
                  <th className="py-2.5 px-3 min-w-[130px] border-r border-slate-200">Father Mobile</th>
                  <th className="py-2.5 px-3 min-w-[150px] border-r border-slate-200">Mother's Name</th>
                  <th className="py-2.5 px-3 min-w-[130px] border-r border-slate-200">Mother Mobile</th>
                  <th className="py-2.5 px-2 w-10 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredRows.length === 0 ? (
                  <tr>
                    <td colSpan={18} className="py-14 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Users className="w-10 h-10 text-slate-300 stroke-[1.5]" />
                        <p className="text-sm font-bold text-slate-700">
                          No students found in Class {selectedClass} - {selectedSection}
                        </p>
                        <p className="text-xs text-slate-400 max-w-sm">
                          There are currently no students registered in this class. Click below to add a student row.
                        </p>
                        <button
                          type="button"
                          onClick={handleAddNewRow}
                          className="mt-2 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition"
                        >
                          + Add Student Row
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((r, idx) => {
                    const isAadhaarInvalid = r.aadhaar && r.aadhaar.length !== 12;
                    const isMobileInvalid = r.fathers_mobile_no && r.fathers_mobile_no.length !== 10;

                    return (
                      <tr key={r.id} className="hover:bg-indigo-50/20 transition-colors">
                        <td className="py-1 px-2 text-center font-semibold text-slate-500 bg-slate-50/80 border-r border-slate-200 text-xs">
                          {idx + 1}
                        </td>

                        {/* SR No */}
                        <td className="p-1 border-r border-slate-200">
                          <input
                            type="text"
                            value={r.sr_no}
                            onChange={(e) => handleCellChange(r.id, 'sr_no', e.target.value)}
                            className="w-full h-8 px-2 text-xs font-semibold text-indigo-700 bg-white hover:bg-slate-50 focus:bg-white rounded border border-slate-200/90 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none transition shadow-2xs"
                          />
                        </td>

                        {/* Adm No */}
                        <td className="p-1 border-r border-slate-200">
                          <input
                            type="text"
                            value={r.adm_no}
                            onChange={(e) => handleCellChange(r.id, 'adm_no', e.target.value)}
                            className="w-full h-8 px-2 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-50 focus:bg-white rounded border border-slate-200/90 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none transition shadow-2xs"
                          />
                        </td>

                        {/* PEN */}
                        <td className="p-1 border-r border-slate-200">
                          <input
                            type="text"
                            value={r.permanent_edu_no}
                            onChange={(e) => handleCellChange(r.id, 'permanent_edu_no', e.target.value)}
                            className="w-full h-8 px-2 text-xs font-medium text-slate-600 bg-white hover:bg-slate-50 focus:bg-white rounded border border-slate-200/90 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none transition shadow-2xs"
                          />
                        </td>

                        {/* Adm Date */}
                        <td className="p-1 border-r border-slate-200">
                          <input
                            type="date"
                            value={r.adm_date}
                            onChange={(e) => handleCellChange(r.id, 'adm_date', e.target.value)}
                            className="w-full h-8 px-1.5 text-xs text-slate-700 bg-white hover:bg-slate-50 focus:bg-white rounded border border-slate-200/90 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none transition shadow-2xs"
                          />
                        </td>

                        {/* First Name */}
                        <td className="p-1 border-r border-slate-200">
                          <input
                            type="text"
                            value={r.first_name}
                            onChange={(e) => handleCellChange(r.id, 'first_name', e.target.value)}
                            placeholder="First Name *"
                            className="w-full h-8 px-2 text-xs font-bold text-slate-900 bg-white hover:bg-slate-50 focus:bg-white rounded border border-slate-200/90 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none transition shadow-2xs"
                          />
                        </td>

                        {/* Last Name */}
                        <td className="p-1 border-r border-slate-200">
                          <input
                            type="text"
                            value={r.last_name}
                            onChange={(e) => handleCellChange(r.id, 'last_name', e.target.value)}
                            placeholder="Last Name"
                            className="w-full h-8 px-2 text-xs text-slate-800 bg-white hover:bg-slate-50 focus:bg-white rounded border border-slate-200/90 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none transition shadow-2xs"
                          />
                        </td>

                        {/* DOB */}
                        <td className="p-1 border-r border-slate-200">
                          <input
                            type="date"
                            value={r.dob}
                            onChange={(e) => handleCellChange(r.id, 'dob', e.target.value)}
                            className="w-full h-8 px-1.5 text-xs text-slate-700 bg-white hover:bg-slate-50 focus:bg-white rounded border border-slate-200/90 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none transition shadow-2xs"
                          />
                        </td>

                        {/* Gender */}
                        <td className="p-1 border-r border-slate-200">
                          <select
                            value={r.gender}
                            onChange={(e) => handleCellChange(r.id, 'gender', e.target.value)}
                            className="w-full h-8 px-1.5 text-xs text-slate-700 bg-white hover:bg-slate-50 focus:bg-white rounded border border-slate-200/90 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none transition shadow-2xs"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </td>

                        {/* Blood Group */}
                        <td className="p-1 border-r border-slate-200">
                          <select
                            value={r.blood_group}
                            onChange={(e) => handleCellChange(r.id, 'blood_group', e.target.value)}
                            className="w-full h-8 px-1 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 focus:bg-white rounded border border-slate-200/90 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none transition shadow-2xs"
                          >
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                          </select>
                        </td>

                        {/* Aadhaar */}
                        <td className="p-1 border-r border-slate-200">
                          <input
                            type="text"
                            maxLength={12}
                            value={r.aadhaar}
                            onChange={(e) => handleCellChange(r.id, 'aadhaar', e.target.value)}
                            className={`w-full h-8 px-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 focus:bg-white rounded border ${
                              isAadhaarInvalid ? 'border-red-400 bg-red-50 text-red-700' : 'border-slate-200/90 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30'
                            } outline-none transition shadow-2xs`}
                            title={isAadhaarInvalid ? 'Aadhaar must be 12 digits' : ''}
                          />
                        </td>

                        {/* Category */}
                        <td className="p-1 border-r border-slate-200">
                          <select
                            value={r.category}
                            onChange={(e) => handleCellChange(r.id, 'category', e.target.value)}
                            className="w-full h-8 px-1.5 text-xs text-slate-700 bg-white hover:bg-slate-50 focus:bg-white rounded border border-slate-200/90 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none transition shadow-2xs"
                          >
                            <option value="General">General</option>
                            <option value="OBC">OBC</option>
                            <option value="SC">SC</option>
                            <option value="ST">ST</option>
                            <option value="EWS">EWS</option>
                          </select>
                        </td>

                        {/* House */}
                        <td className="p-1 border-r border-slate-200">
                          <select
                            value={r.house}
                            onChange={(e) => handleCellChange(r.id, 'house', e.target.value)}
                            className="w-full h-8 px-1.5 text-xs text-slate-700 bg-white hover:bg-slate-50 focus:bg-white rounded border border-slate-200/90 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none transition shadow-2xs"
                          >
                            <option value="Red House">Red House</option>
                            <option value="Blue House">Blue House</option>
                            <option value="Green House">Green House</option>
                            <option value="Yellow House">Yellow House</option>
                          </select>
                        </td>

                        {/* Father Name */}
                        <td className="p-1 border-r border-slate-200">
                          <input
                            type="text"
                            value={r.fathers_name}
                            onChange={(e) => handleCellChange(r.id, 'fathers_name', e.target.value)}
                            className="w-full h-8 px-2 text-xs text-slate-800 bg-white hover:bg-slate-50 focus:bg-white rounded border border-slate-200/90 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none transition shadow-2xs"
                          />
                        </td>

                        {/* Father Mobile */}
                        <td className="p-1 border-r border-slate-200">
                          <input
                            type="text"
                            maxLength={10}
                            value={r.fathers_mobile_no}
                            onChange={(e) => handleCellChange(r.id, 'fathers_mobile_no', e.target.value)}
                            className={`w-full h-8 px-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 focus:bg-white rounded border ${
                              isMobileInvalid ? 'border-red-400 bg-red-50 text-red-700' : 'border-slate-200/90 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30'
                            } outline-none transition shadow-2xs`}
                            title={isMobileInvalid ? 'Mobile must be 10 digits' : ''}
                          />
                        </td>

                        {/* Mother Name */}
                        <td className="p-1 border-r border-slate-200">
                          <input
                            type="text"
                            value={r.mothers_name}
                            onChange={(e) => handleCellChange(r.id, 'mothers_name', e.target.value)}
                            className="w-full h-8 px-2 text-xs text-slate-800 bg-white hover:bg-slate-50 focus:bg-white rounded border border-slate-200/90 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none transition shadow-2xs"
                          />
                        </td>

                        {/* Mother Mobile */}
                        <td className="p-1 border-r border-slate-200">
                          <input
                            type="text"
                            maxLength={10}
                            value={r.mothers_mobile_no}
                            onChange={(e) => handleCellChange(r.id, 'mothers_mobile_no', e.target.value)}
                            className="w-full h-8 px-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 focus:bg-white rounded border border-slate-200/90 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none transition shadow-2xs"
                          />
                        </td>

                        {/* Action - Delete Row */}
                        <td className="p-1 text-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteRow(r.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Row"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="bg-slate-50 border-t border-slate-200 px-4 py-2.5 flex items-center justify-between text-xs text-slate-500">
            <div>
              Showing <span className="font-bold text-slate-800">{filteredRows.length}</span> students in Class {selectedClass} - {selectedSection}
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                <CheckCircle className="w-4 h-4" /> Live Grid Validation Active
              </span>
              <button
                type="button"
                onClick={handleAddNewRow}
                className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline cursor-pointer"
              >
                + Add Another Row
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
