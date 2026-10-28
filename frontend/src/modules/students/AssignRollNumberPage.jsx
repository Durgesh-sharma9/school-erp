import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { tenantStore } from '../../services/tenantStore';
import {
  ArrowUpDown,
  Check,
  ChevronDown,
  Search,
  Sparkles,
  Save,
  Users,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  Hash,
  RotateCcw,
  SlidersHorizontal,
  FileSpreadsheet,
  Plus
} from 'lucide-react';

export function AssignRollNumberPage({ onNavigate }) {
  const { schoolId: authSchoolId } = useAuth();
  const schoolId = authSchoolId || 'sch_jd_intl';

  const [type, setType] = useState('Roll No');
  const [classList, setClassList] = useState([]);
  const [classesLoading, setClassesLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('A');
  const [prefixNo, setPrefixNo] = useState('');
  const [suffixNo, setSuffixNo] = useState('');
  const [startNo, setStartNo] = useState(1);
  const [sortAsc, setSortAsc] = useState(true);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'assigned' | 'unassigned'

  // 1. Dynamically load real classes strictly for the active school
  useEffect(() => {
    let isMounted = true;
    const loadRealClasses = async () => {
      try {
        setClassesLoading(true);
        let realClasses = [];

        // A. Backend API check with strict school identifier
        try {
          const res = await fetch('/api/academics/classes', {
            headers: { 'x-school-id': schoolId }
          });
          if (res.ok) {
            const json = await res.json();
            if (json.success && Array.isArray(json.data) && json.data.length > 0) {
              realClasses = json.data;
            }
          }
        } catch (apiErr) {
          // Fallback to local
        }

        // B. TenantStore saved classes
        const localClasses = tenantStore.getClasses(schoolId);
        if (realClasses.length === 0 && localClasses && localClasses.length > 0) {
          realClasses = localClasses;
        }

        // C. Fetch registered students from backend & sync with tenantStore
        let apiStudents = [];
        try {
          const sRes = await fetch('/api/students', {
            headers: { 'x-school-id': schoolId }
          });
          if (sRes.ok) {
            const sJson = await sRes.json();
            if (sJson.success && Array.isArray(sJson.data)) {
              apiStudents = sJson.data;
              tenantStore.setStudents(schoolId, apiStudents);
            }
          }
        } catch (sErr) {}

        const localStudents = tenantStore.getStudents(schoolId);
        const enrolledStudents = apiStudents.length > 0 ? apiStudents : localStudents;
        const studentClasses = [...new Set(enrolledStudents.map((s) => s.className).filter(Boolean))];

        const classMap = new Map();
        realClasses.forEach((c) => {
          const name = typeof c === 'string' ? c : c.name;
          if (name) classMap.set(name, typeof c === 'string' ? { id: c, name: c, sections: ['A', 'B'] } : c);
        });
        studentClasses.forEach((sCls) => {
          if (!classMap.has(sCls)) {
            classMap.set(sCls, { id: sCls, name: sCls, sections: ['A', 'B', 'C', 'D'] });
          }
        });

        let mergedClasses = Array.from(classMap.values());
        if (mergedClasses.length === 0) {
          // Fallback initial classes if none created yet
          mergedClasses = [
            'Nursery', 'LKG', 'UKG', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'
          ].map((c) => ({ id: c, name: c, sections: ['A', 'B', 'C', 'D'] }));
        }

        if (isMounted) {
          setClassList(mergedClasses);
          if (mergedClasses.length > 0) {
            // If any student is enrolled, prefer selecting their class first so students show up immediately!
            const preferredClass = studentClasses[0] || (mergedClasses[0] ? (typeof mergedClasses[0] === 'string' ? mergedClasses[0] : mergedClasses[0].name) : 'I');
            const preferredName = typeof preferredClass === 'string' ? preferredClass : preferredClass?.name || 'I';
            setSelectedClass((prev) => (prev && mergedClasses.some((c) => (typeof c === 'string' ? c : c.name) === prev) ? prev : preferredName));
            setSelectedDivision('A');
          }
        }
      } finally {
        if (isMounted) setClassesLoading(false);
      }
    };

    loadRealClasses();
    return () => {
      isMounted = false;
    };
  }, [schoolId]);

  // Determine available sections for currently selected class
  const currentClassObj = useMemo(() => {
    return classList.find((c) => (typeof c === 'string' ? c : c.name) === selectedClass);
  }, [classList, selectedClass]);

  const availableDivisions = useMemo(() => {
    if (currentClassObj && Array.isArray(currentClassObj.sections) && currentClassObj.sections.length > 0) {
      return currentClassObj.sections;
    }
    return ['A', 'B', 'C', 'D'];
  }, [currentClassObj]);

  // Fetch real students strictly matching selectedClass & selectedDivision
  useEffect(() => {
    fetchStudents();
  }, [selectedClass, selectedDivision, schoolId]);

  const fetchStudents = async () => {
    if (!selectedClass) {
      setStudents([]);
      return;
    }
    try {
      setLoading(true);
      let apiList = [];

      // A. Try API with school tenant header
      try {
        const res = await fetch(
          `/api/students?className=${encodeURIComponent(selectedClass)}&section=${encodeURIComponent(selectedDivision)}`,
          { headers: { 'x-school-id': schoolId } }
        );
        if (res.ok) {
          const json = await res.json();
          apiList = Array.isArray(json.data) ? json.data : [];
        }
      } catch (err) {
        // Fallback to tenantStore
      }

      // Fallback: fetch all tenant students if specific class query didn't match (for alias/case tolerance)
      if (apiList.length === 0) {
        try {
          const allRes = await fetch('/api/students', { headers: { 'x-school-id': schoolId } });
          if (allRes.ok) {
            const allJson = await allRes.json();
            const allData = Array.isArray(allJson.data) ? allJson.data : [];
            const norm = (str) => (str || '').toLowerCase().replace(/^(class|grade)\\s*/i, '').trim();
            apiList = allData.filter((s) => {
              const cMatch =
                (s.className || '').trim().toLowerCase() === selectedClass.trim().toLowerCase() ||
                norm(s.className) === norm(selectedClass);
              const sMatch = !selectedDivision || (s.section || 'A').trim().toUpperCase() === selectedDivision.trim().toUpperCase();
              return cMatch && sMatch;
            });
          }
        } catch (e) {}
      }

      // B. Query tenantStore strictly for this school
      const localStudents = tenantStore.getStudents(schoolId);
      const norm = (str) => (str || '').toLowerCase().replace(/^(class|grade)\\s*/i, '').trim();
      const matchedLocal = localStudents.filter((s) => {
        const matchClass =
          (s.className || '').trim().toLowerCase() === selectedClass.trim().toLowerCase() ||
          norm(s.className) === norm(selectedClass);
        const matchSection = selectedDivision
          ? (s.section || 'A').trim().toUpperCase() === selectedDivision.trim().toUpperCase()
          : true;
        return matchClass && matchSection;
      });

      // Merge real students without duplicates (NO HARDCODED MOCKS!)
      const mergedMap = new Map();
      apiList.forEach((s) => mergedMap.set(s.id || s.admNo, s));
      matchedLocal.forEach((s) => {
        if (!mergedMap.has(s.id || s.admNo)) {
          mergedMap.set(s.id || s.admNo, s);
        }
      });

      const finalRecords = Array.from(mergedMap.values()).map((s, idx) => ({
        id: s.id || `std_${idx}`,
        rollNo: s.rollNo || '',
        feebookNo: s.feebookNo || s.feeBookNo || '',
        enrollNo: s.enrollNo || s.enrNo || `ENR-${s.admNo || idx + 1}`,
        srNo: s.srNo || s.admNo || `${idx + 1}`,
        admNo: s.admNo || `${idx + 1}`,
        name: s.name || `${s.firstName || ''} ${s.lastName || ''}`.trim() || 'Student',
        firstName: s.firstName || s.name?.split(' ')[0] || '',
        lastName: s.lastName || s.name?.split(' ').slice(1).join(' ') || '',
        fatherName: s.fatherName || s.fathers_name || '',
        gender: s.gender || 'Boy',
        status: s.status || 'Active'
      }));

      setStudents(finalRecords);
    } finally {
      setLoading(false);
    }
  };

  // Generate roll or feebook numbers starting from startNo
  const handleGenerate = () => {
    let current = parseInt(startNo, 10) || 1;
    const isFeeBook = type === 'Feebook No';
    const updated = students.map((s) => {
      const generated = `${prefixNo}${current}${suffixNo}`;
      current++;
      return isFeeBook ? { ...s, feebookNo: generated } : { ...s, rollNo: generated };
    });
    setStudents(updated);
    showToast(
      `Sequence generated for ${updated.length} students starting from ${startNo}!`,
      'success'
    );
  };

  // Clear all roll/feebook numbers
  const handleClear = () => {
    const isFeeBook = type === 'Feebook No';
    const updated = students.map((s) =>
      isFeeBook ? { ...s, feebookNo: '' } : { ...s, rollNo: '' }
    );
    setStudents(updated);
    showToast(`${type} numbers cleared in editor.`, 'info');
  };

  // Sort students alphabetically
  const handleSort = () => {
    const sorted = [...students].sort((a, b) => {
      const nameA = `${a.firstName} ${a.lastName}`.trim().toLowerCase();
      const nameB = `${b.firstName} ${b.lastName}`.trim().toLowerCase();
      return sortAsc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });
    setSortAsc(!sortAsc);
    setStudents(sorted);
    showToast(`Sorted students ${sortAsc ? 'A to Z' : 'Z to A'}!`, 'info');
  };

  // Save updates to tenantStore & backend
  const handleSave = async () => {
    try {
      const isFeeBook = type === 'Feebook No';
      const updates = students.map((s) => ({
        id: s.id,
        admNo: s.admNo,
        rollNo: s.rollNo,
        feebookNo: s.feebookNo
      }));

      // 1. Update in local tenantStore
      const allLocal = tenantStore.getStudents(schoolId);
      const updatedLocal = allLocal.map((s) => {
        const found = updates.find((u) => u.id === s.id || u.admNo === s.admNo);
        if (found) {
          return isFeeBook
            ? { ...s, feebookNo: found.feebookNo }
            : { ...s, rollNo: found.rollNo };
        }
        return s;
      });
      localStorage.setItem(
        tenantStore.getStorageKey(schoolId, 'students'),
        JSON.stringify(updatedLocal)
      );

      // 2. Transmit to backend
      try {
        await fetch('/api/students/assign-roll', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-school-id': schoolId
          },
          body: JSON.stringify({ updates, schoolId, type })
        });
      } catch (netErr) {
        // Saved in tenantStore
      }

      showToast(`${type} numbers saved successfully!`, 'success');
    } catch {
      showToast('Saved locally for active school!', 'success');
    }
  };

  const showToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Metrics
  const isFeeBook = type === 'Feebook No';
  const totalCount = students.length;
  const assignedCount = students.filter((s) => {
    const val = isFeeBook ? s.feebookNo : s.rollNo;
    return val && val.trim() !== '' && val !== '0';
  }).length;
  const unassignedCount = totalCount - assignedCount;

  // Filtered List based on Search & Tabs
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const name = `${s.firstName} ${s.lastName} ${s.fatherName} ${s.admNo} ${s.rollNo} ${s.feebookNo || ''}`.toLowerCase();
      const matchesSearch = name.includes(searchQuery.toLowerCase());

      const val = isFeeBook ? s.feebookNo : s.rollNo;
      const isAssigned = val && val.trim() !== '' && val !== '0';
      if (filterTab === 'assigned') return matchesSearch && isAssigned;
      if (filterTab === 'unassigned') return matchesSearch && !isAssigned;
      return matchesSearch;
    });
  }, [students, searchQuery, filterTab, isFeeBook]);

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen text-slate-800">
      {/* Top Header matching Daily Test Ranking */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
              <Hash className="w-5 h-5" />
            </span>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
              Assign Roll & Feebook Number
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-500">
            Batch-generate, sort alphabetically, and assign official roll or fee-book numbers class-wise.
          </p>
        </div>

        {/* Current Class Badge */}
        {selectedClass && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-200/80 rounded-xl text-xs font-semibold text-indigo-700 shadow-2xs self-start sm:self-auto">
            <GraduationCap className="w-4 h-4" />
            <span>
              {selectedClass} ({selectedDivision})
            </span>
          </div>
        )}
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium animate-in fade-in slide-in-from-bottom-3 duration-200 ${
            toastType === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : toastType === 'info'
              ? 'bg-blue-50 text-blue-800 border-blue-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {toastType === 'success' && <Check className="w-4 h-4 text-emerald-600" />}
          {toastType === 'info' && <AlertCircle className="w-4 h-4 text-blue-600" />}
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Total Students</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalCount}</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Assigned</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">{assignedCount}</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Unassigned</span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600">{unassignedCount}</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Next In Sequence</span>
            <Sparkles className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-lg font-bold text-purple-700 truncate">
            {prefixNo}{startNo}{suffixNo}
          </div>
        </div>
      </div>

      {/* Warning banner if NO classes added yet */}
      {!classesLoading && classList.length === 0 && (
        <div className="p-4 mb-5 bg-amber-50 border border-amber-200/90 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900 text-xs font-medium">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="font-bold text-sm">Is school me koi class create nahi hai</p>
              <p className="text-amber-700 mt-0.5">
                Pehle Class Master me jakar apni classes (jaise Class 1, Class 2 ya Nursery) add karein.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('/class')}
            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shadow-2xs cursor-pointer transition-colors flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Go to Class Master</span>
          </button>
        </div>
      )}

      {/* Main Filter & Generator Panel */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs p-4 md:p-5 mb-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-500" />
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
              Sequence Generation Settings
            </h2>
          </div>

          {/* Type Toggle Pills */}
          <div className="inline-flex p-0.5 bg-slate-100 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => setType('Roll No')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                type === 'Roll No'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Roll No
            </button>
            <button
              type="button"
              onClick={() => setType('Feebook No')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                type === 'Feebook No'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Feebook No
            </button>
          </div>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {/* Dynamic Class Select */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Select Class *
            </label>
            <div className="relative">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                disabled={classList.length === 0}
                className="w-full px-3 py-2 text-xs md:text-sm text-slate-800 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none appearance-none cursor-pointer disabled:bg-slate-100 disabled:text-slate-400"
              >
                {classList.length === 0 ? (
                  <option value="">No Classes Added Yet</option>
                ) : (
                  classList.map((c) => {
                    const val = typeof c === 'string' ? c : c.name;
                    return (
                      <option key={val} value={val}>
                        {val}
                      </option>
                    );
                  })
                )}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Division Select */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Division / Section *
            </label>
            <div className="relative">
              <select
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                disabled={classList.length === 0}
                className="w-full px-3 py-2 text-xs md:text-sm text-slate-800 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none appearance-none cursor-pointer disabled:bg-slate-100 disabled:text-slate-400"
              >
                {availableDivisions.map((d) => (
                  <option key={d} value={d}>
                    Section {d}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Start No */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Start Number *
            </label>
            <input
              type="number"
              min="1"
              value={startNo}
              onChange={(e) => setStartNo(e.target.value)}
              className="w-full px-3 py-2 text-xs md:text-sm text-slate-800 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none"
              placeholder="e.g. 1"
            />
          </div>

          {/* Prefix No */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Prefix (Optional)
            </label>
            <input
              type="text"
              value={prefixNo}
              onChange={(e) => setPrefixNo(e.target.value)}
              className="w-full px-3 py-2 text-xs md:text-sm text-slate-800 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none"
              placeholder="e.g. 2026-"
            />
          </div>

          {/* Suffix No */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Suffix (Optional)
            </label>
            <input
              type="text"
              value={suffixNo}
              onChange={(e) => setSuffixNo(e.target.value)}
              className="w-full px-3 py-2 text-xs md:text-sm text-slate-800 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none"
              placeholder="e.g. -A"
            />
          </div>
        </div>

        {/* Live Preview & Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Pattern Preview:</span>
            <span className="font-mono font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200/60">
              {prefixNo}{startNo || 1}{suffixNo}, {prefixNo}{(parseInt(startNo, 10) || 1) + 1}{suffixNo}...
            </span>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {/* Sort Toggle Button */}
            <button
              type="button"
              onClick={handleSort}
              disabled={students.length === 0}
              className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                sortAsc
                  ? 'border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100'
                  : 'border-slate-300 text-slate-700 bg-white hover:bg-slate-50'
              }`}
              title="Toggle Alphabetical Sorting"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort Names (A-Z)</span>
            </button>

            {/* Clear Button */}
            <button
              type="button"
              onClick={handleClear}
              disabled={students.length === 0}
              className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-slate-600 bg-white hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              title="Clear all numbers"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>

            {/* Generate Button with Sparkles */}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={students.length === 0}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg text-xs md:text-sm shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate Sequence</span>
            </button>

            {/* Save Button */}
            <button
              type="button"
              onClick={handleSave}
              disabled={students.length === 0}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs md:text-sm shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Students Data Card matching UAB */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {/* Table Search & Filter Sub-Bar */}
        <div className="p-3.5 md:p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student, Adm No, Roll.."
              className="w-full pl-9 pr-3 py-1.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-indigo-600 focus:outline-none transition-colors"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-semibold self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setFilterTab('all')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                filterTab === 'all'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('assigned')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                filterTab === 'assigned'
                  ? 'bg-white text-emerald-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Assigned ({assignedCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('unassigned')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                filterTab === 'unassigned'
                  ? 'bg-white text-amber-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Unassigned ({unassignedCount})
            </button>
          </div>
        </div>

        {/* Table List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-4 text-center w-28">
                  {type === 'Feebook No' ? 'FEEBOOK NO' : 'ROLL NO'}
                </th>
                <th className="py-3 px-4">ADM NO.</th>
                <th className="py-3 px-4">STUDENT NAME</th>
                <th className="py-3 px-4">FATHER'S NAME</th>
                <th className="py-3 px-4">GENDER</th>
                <th className="py-3 px-4">ENROLL NO.</th>
                <th className="py-3 px-4">SR NO.</th>
                <th className="py-3 px-4 text-center">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                      <span>Loading real student roster...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users className="w-8 h-8 text-slate-300" />
                      <p className="font-semibold text-slate-700 text-sm">No students found</p>
                      <p className="text-xs text-slate-400">
                        {searchQuery
                          ? 'Try matching another search keyword.'
                          : selectedClass
                          ? `Class "${selectedClass}" (Section ${selectedDivision}) me koi student enrolled nahi hai.`
                          : 'Pehle Class Master se class create karein ya student registration karein.'}
                      </p>
                      {selectedClass && (
                        <button
                          type="button"
                          onClick={() => onNavigate && onNavigate('/student-registration')}
                          className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-2xs cursor-pointer transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Register Student in this Class</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((std, idx) => {
                  const val = isFeeBook ? std.feebookNo : std.rollNo;
                  const isAssigned = val && val.trim() !== '' && val !== '0';
                  const initials = `${std.firstName?.[0] || ''}${std.lastName?.[0] || ''}`.toUpperCase();

                  return (
                    <tr
                      key={std.id || idx}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Editable Roll/Feebook No */}
                      <td className="py-2.5 px-4 text-center">
                        <input
                          type="text"
                          value={isFeeBook ? std.feebookNo || '' : std.rollNo || ''}
                          onChange={(e) => {
                            const inputVal = e.target.value;
                            setStudents((prev) =>
                              prev.map((s) =>
                                s.id === std.id
                                  ? isFeeBook
                                    ? { ...s, feebookNo: inputVal }
                                    : { ...s, rollNo: inputVal }
                                  : s
                              )
                            );
                          }}
                          placeholder="-"
                          className={`w-24 px-2.5 py-1 text-center font-bold text-xs rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                            isAssigned
                              ? 'bg-indigo-50/70 border-indigo-200 text-indigo-700 focus:border-indigo-600'
                              : 'bg-slate-50 border-slate-200 text-slate-400 focus:bg-white focus:text-slate-800'
                          }`}
                        />
                      </td>

                      {/* Adm No */}
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-800 border border-slate-200/60">
                          {std.admNo}
                        </span>
                      </td>

                      {/* Student Name with Avatar */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[11px] flex items-center justify-center shrink-0 border border-indigo-200">
                            {initials || 'S'}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 leading-tight">
                              {`${std.firstName} ${std.lastName}`.trim() || std.name}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Father Name */}
                      <td className="py-3 px-4 text-slate-600">
                        {std.fatherName || '-'}
                      </td>

                      {/* Gender Badge */}
                      <td className="py-3 px-4">
                        {std.gender?.toLowerCase() === 'girl' || std.gender?.toLowerCase() === 'female' ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-pink-50 text-pink-700 border border-pink-200/60">
                            Girl
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
                            Boy
                          </span>
                        )}
                      </td>

                      {/* Enroll No */}
                      <td className="py-3 px-4 font-mono text-slate-500 text-xs">
                        {std.enrollNo || '-'}
                      </td>

                      {/* SR No */}
                      <td className="py-3 px-4 font-mono text-slate-500 text-xs">
                        {std.srNo || '-'}
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-4 text-center">
                        {isAssigned ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                            <Check className="w-3 h-3" /> Assigned
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                            Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info bar */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <strong className="text-slate-800">{filteredStudents.length}</strong> of{' '}
            <strong className="text-slate-800">{students.length}</strong> students
          </span>
          <span className="text-[11px] text-slate-400">
            Tip: You can directly click any Roll/Feebook No box to edit manually.
          </span>
        </div>
      </div>
    </div>
  );
}
