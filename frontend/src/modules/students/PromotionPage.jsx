import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { tenantStore } from '../../services/tenantStore';
import {
  Search,
  Plus,
  X,
  ChevronDown,
  ChevronsRight,
  ChevronsLeft,
  Check,
  RefreshCw
} from 'lucide-react';

const CLASSES = [
  'Nursery - PP3+',
  'Lower Kindergarten - PP4+',
  'Upper Kindergarten - PP5+',
  'I',
  'II',
  'III',
  'IV',
  'V',
  'VI',
  'VII',
  'VIII',
  'IX',
  'X',
  'XI- HUMANITIES',
  'XII-HUMANITIES',
  'XI-MEDICAL',
  'XII-MEDICAL',
  'XI-NON-MEDICAL',
  'XII-NON-MEDICAL',
  'XI-COMMERCE'
];

const DIVISIONS = ['A', 'B', 'C', 'D'];

export function PromotionPage({ onNavigate }) {
  const { schoolId, schoolName } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Real students loaded for this school tenant (NO SEEDED/MOCK DATA)
  const [allStudents, setAllStudents] = useState([]);

  // Dynamically computed class list from real registered students
  const [classList, setClassList] = useState([]);

  // Dynamic classes for active school
  const availableClasses = useMemo(() => {
    const list = new Set();
    allStudents.forEach((s) => {
      const c = s.className || s.class_id;
      if (c) list.add(c);
    });
    (tenantStore.getClasses(schoolId) || []).forEach((c) => {
      const name = typeof c === 'string' ? c : c.name;
      if (name) list.add(name);
    });
    if (list.size === 0) {
      return ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
    }
    return Array.from(list);
  }, [allStudents, schoolId]);

  const targetClassesList = useMemo(() => {
    const stdClasses = ['Nursery', 'LKG', 'UKG', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    return Array.from(new Set([...availableClasses, ...stdClasses]));
  }, [availableClasses]);

  // Modal State
  const [sourceSession, setSourceSession] = useState('2025-2026');
  const [sourceClass, setSourceClass] = useState('I');
  const [sourceDivision, setSourceDivision] = useState('A');
  const [targetClass, setTargetClass] = useState('II');
  const [targetDivision, setTargetDivision] = useState('A');

  // Auto-set initial class
  useEffect(() => {
    if (availableClasses.length > 0 && !availableClasses.includes(sourceClass)) {
      setSourceClass(availableClasses[0]);
    }
  }, [availableClasses]);

  // Source list students (dynamically filtered from allStudents)
  const [sourceStudents, setSourceStudents] = useState([]);

  // Target list students (transferred by user)
  const [targetStudents, setTargetStudents] = useState([]);

  // Load real students dynamically from tenantStore and backend API
  const loadStudents = async () => {
    try {
      setLoading(true);
      // 1. Load from tenant store (localStorage partition)
      let students = tenantStore.getStudents(schoolId) || [];

      // 2. Transmit fetch to backend API
      try {
        const res = await fetch('/api/students', {
          headers: {
            'x-school-id': schoolId || 'sch_jd_intl'
          }
        });
        if (res.ok) {
          const json = await res.json();
          const backendStudents = json.data || [];
          if (backendStudents.length > 0) {
            students = backendStudents;
          }
        }
      } catch {
        // Fallback silently to tenantStore cache
      }

      setAllStudents(students);
      recalculateClassList(students);
    } catch (err) {
      console.error('[PromotionPage] Error loading students:', err);
    } finally {
      setLoading(false);
    }
  };

  const recalculateClassList = (students) => {
    if (!students || students.length === 0) {
      setClassList([]);
      return;
    }

    const countMap = {};
    students.forEach((s) => {
      const cls = s.className || s.class_id || 'I';
      const sec = s.section || s.division_id || 'A';
      const key = `${cls}-${sec}`;
      countMap[key] = (countMap[key] || 0) + 1;
    });

    const list = Object.entries(countMap).map(([name, count], idx) => ({
      id: idx + 1,
      name,
      count
    }));

    setClassList(list);
  };

  useEffect(() => {
    loadStudents();
  }, [schoolId]);

  // Synchronize sourceStudents when modal opens or source class/division changes
  useEffect(() => {
    if (!isModalOpen) return;

    const targetIds = new Set(targetStudents.map((t) => String(t.id)));
    const matching = allStudents.filter((s) => {
      const sId = String(s.id || s._id || s.admNo || '');
      const cls = (s.className || s.class_id || '').trim().toLowerCase();
      const div = (s.section || s.division_id || 'A').trim().toLowerCase();
      const targetCls = sourceClass.trim().toLowerCase();
      const targetDiv = sourceDivision.trim().toLowerCase();

      return cls === targetCls && div === targetDiv && !targetIds.has(sId);
    });

    setSourceStudents(
      matching.map((s) => ({
        id: s.id || s._id || s.admNo,
        srNo: s.srNo || s.admNo || '-',
        rollNo: s.rollNo || '-',
        name: s.name || [s.firstName, s.lastName].filter(Boolean).join(' ') || 'Student',
        fatherName: s.fatherName || s.father_name || '-',
        selected: false
      }))
    );
  }, [isModalOpen, sourceClass, sourceDivision, allStudents]);

  // Transfer actions
  const handleTransferForward = () => {
    const toMove = sourceStudents.filter((s) => s.selected);
    if (toMove.length === 0) return;

    setTargetStudents((prev) => [
      ...prev,
      ...toMove.map((s) => ({
        ...s,
        selected: false,
        resultStatus: 'Pass',
        status: 'Promoted'
      }))
    ]);
    setSourceStudents((prev) => prev.filter((s) => !s.selected));
  };

  const handleTransferBackward = () => {
    const toReturn = targetStudents.filter((s) => s.selected);
    if (toReturn.length === 0) return;

    setSourceStudents((prev) => [
      ...prev,
      ...toReturn.map((s) => ({ ...s, selected: false }))
    ]);
    setTargetStudents((prev) => prev.filter((s) => !s.selected));
  };

  const handleSavePromotion = async () => {
    if (targetStudents.length === 0) {
      setIsModalOpen(false);
      return;
    }

    const studentIds = targetStudents.map((s) => s.id);

    // 1. Update localStorage via tenantStore
    tenantStore.promoteStudents(schoolId, studentIds, targetClass, targetDivision);

    // 2. Persist to backend
    try {
      await fetch('/api/students/promote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-school-id': schoolId || 'sch_jd_intl'
        },
        body: JSON.stringify({
          studentIds,
          targetClass,
          targetDivision
        })
      });
    } catch (err) {
      console.warn('[Promotion] Backend sync error:', err);
    }

    // 3. Reload real students to recalculate class breakdown
    await loadStudents();

    setToastMessage(`Successfully promoted ${targetStudents.length} student(s) to ${targetClass}-${targetDivision}!`);
    setTargetStudents([]);
    setIsModalOpen(false);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filtered = classList.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 bg-[#f3f4f6] min-h-screen text-slate-800">
      {/* Breadcrumbs matching Live UAB */}
      <div className="flex items-center gap-2 mb-3">
        <h1 className="text-base md:text-lg font-bold text-gray-800">Promotion</h1>
        <span className="text-gray-400 text-xs flex items-center gap-1.5 font-normal">
          <span>🏠</span>
          <span>•</span>
          <span>Students</span>
          <span>•</span>
          <span className="text-gray-600 font-medium">Promotion</span>
        </span>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-2xs p-4 md:p-5">
        {/* Top Search + FAB Bar matching Live UAB */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search class..."
              className="w-full pl-9 pr-4 py-2 text-xs md:text-sm border border-gray-200 rounded-full focus:border-indigo-600 focus:outline-none bg-gray-50/50"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              setTargetStudents([]);
              setIsModalOpen(true);
            }}
            className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-md transition-all hover:scale-105 cursor-pointer"
            title="Promote Students"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Toast */}
        {toastMessage && (
          <div className="mb-4 p-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded flex items-center gap-2">
            <Check className="w-4 h-4" />
            {toastMessage}
          </div>
        )}

        {/* Table matching Live UAB Screenshot Step 1904 */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">S.NO.</th>
                <th className="py-3 px-4">CLASS</th>
                <th className="py-3 px-4">NO. OF STUDENTS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
              {loading ? (
                <tr>
                  <td colSpan="3" className="py-8 text-center text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
                      <span>Loading promotion statistics...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="3" className="py-8 text-center text-gray-400">
                    {searchQuery
                      ? `No classes matching "${searchQuery}"`
                      : 'No student records found in this school yet. Register students in Student Registration to view promotion statistics.'}
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">{idx + 1}</td>
                    <td className="py-3 px-4 font-semibold text-gray-900">{item.name}</td>
                    <td className="py-3 px-4">{item.count}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-end text-xs text-gray-500 gap-4">
          <span>Items per page:</span>
          <select className="border border-gray-200 rounded px-2 py-1 bg-white focus:outline-none">
            <option>100</option>
            <option>50</option>
          </select>
          <span>
            {filtered.length > 0 ? `1 - ${filtered.length} of ${filtered.length}` : '0 of 0'}
          </span>
        </div>
      </div>

      {/* PROMOTE STUDENTS MODAL matching Live UAB Screenshot Step 1910 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl overflow-hidden animate-scale-in max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 flex justify-between items-center border-b border-gray-100">
              <h2 className="text-sm md:text-base font-bold text-gray-800 tracking-wide">
                PROMOTE STUDENTS
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-center">
                {/* Left Panel (Source) - col-span-5 */}
                <div className="col-span-5 border border-gray-200 rounded-lg p-3 bg-white">
                  {/* Filters */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="relative">
                      <label className="absolute -top-2 left-2 px-1 text-[10px] font-medium text-gray-500 bg-white z-10">
                        Session*
                      </label>
                      <select
                        value={sourceSession}
                        onChange={(e) => setSourceSession(e.target.value)}
                        className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:border-indigo-600 focus:outline-none bg-white"
                      >
                        <option>2025-2026</option>
                        <option>2026-2027</option>
                      </select>
                    </div>

                    <div className="relative">
                      <label className="absolute -top-2 left-2 px-1 text-[10px] font-medium text-gray-500 bg-white z-10">
                        Class*
                      </label>
                      <select
                        value={sourceClass}
                        onChange={(e) => setSourceClass(e.target.value)}
                        className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:border-indigo-600 focus:outline-none bg-white"
                      >
                        {availableClasses.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div className="relative">
                      <label className="absolute -top-2 left-2 px-1 text-[10px] font-medium text-gray-500 bg-white z-10">
                        Division*
                      </label>
                      <select
                        value={sourceDivision}
                        onChange={(e) => setSourceDivision(e.target.value)}
                        className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:border-indigo-600 focus:outline-none bg-white"
                      >
                        {DIVISIONS.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="max-h-56 overflow-y-auto border border-gray-200 rounded">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-gray-400 text-gray-900 font-bold sticky top-0">
                        <tr>
                          <th className="p-1.5">
                            <input
                              type="checkbox"
                              checked={sourceStudents.length > 0 && sourceStudents.every((s) => s.selected)}
                              onChange={(e) => {
                                const chk = e.target.checked;
                                setSourceStudents((prev) =>
                                  prev.map((s) => ({ ...s, selected: chk }))
                                );
                              }}
                            />
                          </th>
                          <th className="p-1.5">SR NO</th>
                          <th className="p-1.5">ROLL NO</th>
                          <th className="p-1.5">STUDENT NAME</th>
                          <th className="p-1.5">FATHER'S NAME</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {sourceStudents.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="p-4 text-center text-gray-400">
                              {targetStudents.length > 0
                                ? 'All students in this class transferred.'
                                : `No students registered in Class ${sourceClass}-${sourceDivision}.`}
                            </td>
                          </tr>
                        ) : (
                          sourceStudents.map((s) => (
                            <tr key={s.id} className="hover:bg-gray-50">
                              <td className="p-1.5">
                                <input
                                  type="checkbox"
                                  checked={s.selected}
                                  onChange={(e) => {
                                    const val = e.target.checked;
                                    setSourceStudents((prev) =>
                                      prev.map((item) =>
                                        item.id === s.id ? { ...item, selected: val } : item
                                      )
                                    );
                                  }}
                                />
                              </td>
                              <td className="p-1.5">{s.srNo}</td>
                              <td className="p-1.5">{s.rollNo}</td>
                              <td className="p-1.5 font-semibold text-gray-800">{s.name}</td>
                              <td className="p-1.5 text-gray-600">{s.fatherName}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Transfer Buttons - col-span-1 */}
                <div className="col-span-1 flex flex-col items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleTransferForward}
                    className="w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-md transition-transform hover:scale-105 cursor-pointer"
                    title="Transfer Forward"
                  >
                    <ChevronsRight className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleTransferBackward}
                    className="w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-md transition-transform hover:scale-105 cursor-pointer"
                    title="Transfer Backward"
                  >
                    <ChevronsLeft className="w-5 h-5" />
                  </button>
                </div>

                {/* Right Panel (Target) - col-span-5 */}
                <div className="col-span-5 border border-gray-200 rounded-lg p-3 bg-white">
                  {/* Filters */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="relative">
                      <label className="absolute -top-2 left-2 px-1 text-[10px] font-medium text-gray-500 bg-white z-10">
                        Class*
                      </label>
                      <select
                        value={targetClass}
                        onChange={(e) => setTargetClass(e.target.value)}
                        className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:border-indigo-600 focus:outline-none bg-white"
                      >
                        {targetClassesList.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div className="relative">
                      <label className="absolute -top-2 left-2 px-1 text-[10px] font-medium text-gray-500 bg-white z-10">
                        Division*
                      </label>
                      <select
                        value={targetDivision}
                        onChange={(e) => setTargetDivision(e.target.value)}
                        className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:border-indigo-600 focus:outline-none bg-white"
                      >
                        {DIVISIONS.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="max-h-56 overflow-y-auto border border-gray-200 rounded">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-gray-400 text-gray-900 font-bold sticky top-0">
                        <tr>
                          <th className="p-1.5">
                            <input
                              type="checkbox"
                              checked={targetStudents.length > 0 && targetStudents.every((s) => s.selected)}
                              onChange={(e) => {
                                const chk = e.target.checked;
                                setTargetStudents((prev) =>
                                  prev.map((s) => ({ ...s, selected: chk }))
                                );
                              }}
                            />
                          </th>
                          <th className="p-1.5">SR NO</th>
                          <th className="p-1.5">ROLL NO</th>
                          <th className="p-1.5">STUDENT NAME</th>
                          <th className="p-1.5">FATHER'S NAME</th>
                          <th className="p-1.5">RESULT</th>
                          <th className="p-1.5">STATUS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {targetStudents.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="p-4 text-center text-gray-400">
                              Select students on left and click '»' to transfer.
                            </td>
                          </tr>
                        ) : (
                          targetStudents.map((s) => (
                            <tr key={s.id} className="hover:bg-gray-50">
                              <td className="p-1.5">
                                <input
                                  type="checkbox"
                                  checked={s.selected}
                                  onChange={(e) => {
                                    const val = e.target.checked;
                                    setTargetStudents((prev) =>
                                      prev.map((item) =>
                                        item.id === s.id ? { ...item, selected: val } : item
                                      )
                                    );
                                  }}
                                />
                              </td>
                              <td className="p-1.5">{s.srNo}</td>
                              <td className="p-1.5">{s.rollNo}</td>
                              <td className="p-1.5 font-semibold text-gray-800">{s.name}</td>
                              <td className="p-1.5 text-gray-600">{s.fatherName}</td>
                              <td className="p-1.5 text-emerald-600 font-bold">{s.resultStatus}</td>
                              <td className="p-1.5 font-medium text-indigo-600">{s.status}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end items-center gap-3 pt-4 border-t border-gray-100 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs md:text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSavePromotion}
                  disabled={targetStudents.length === 0}
                  className={`px-6 py-2 text-xs md:text-sm font-semibold rounded shadow-xs ${
                    targetStudents.length === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
                  }`}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
