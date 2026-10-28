import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { tenantStore } from '../../services/tenantStore';
import {
  Printer,
  ChevronDown,
  X
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

export function IdCardGeneratorPage({ onNavigate }) {
  const { schoolId, schoolName } = useAuth();

  const [highlightStudent, setHighlightStudent] = useState(null);
  const [selectedClass, setSelectedClass] = useState('I');
  const [cardType, setCardType] = useState('Horizontal');
  const [format, setFormat] = useState('Standard Format');
  const [isMultiple, setIsMultiple] = useState(true);
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  // Dynamic students list from tenantStore (NO HARDCODED SEEDED DATA)
  const [students, setStudents] = useState([]);

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
      dob: s.dob || '01-01-2019',
      mobile: s.contactNo || s.fatherMobile || '-',
      address: s.address || 'Local',
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
          dob: pending.dob || '01-01-2019',
          mobile: pending.mobile || '-',
          address: pending.address || 'Local',
          photoUrl: '',
          selected: true
        });
      }
    }

    setStudents(mapped);
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
      <div className="bg-white rounded-lg border border-gray-200 shadow-2xs p-4 md:p-5">
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
              className="text-indigo-400 hover:text-indigo-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Filter Toolbar matching Live UAB Screenshot Step 1898 */}
        <div className="flex flex-wrap items-center gap-4 mb-5 pb-4 border-b border-gray-100">
          {/* Class */}
          <div className="w-48 relative">
            <label className="absolute -top-2 left-2.5 px-1 text-[11px] font-medium text-gray-500 bg-white z-10">
              Class
            </label>
            <div className="relative">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 text-xs md:text-sm bg-white border border-gray-300 rounded focus:border-indigo-600 focus:outline-none appearance-none cursor-pointer"
              >
                {CLASSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
            </div>
          </div>

          {/* Type */}
          <div className="w-48 relative">
            <label className="absolute -top-2 left-2.5 px-1 text-[11px] font-medium text-gray-500 bg-white z-10">
              Type
            </label>
            <div className="relative">
              <select
                value={cardType}
                onChange={(e) => setCardType(e.target.value)}
                className="w-full px-3 py-2 text-xs md:text-sm bg-white border border-gray-300 rounded focus:border-indigo-600 focus:outline-none appearance-none cursor-pointer"
              >
                <option>Horizontal</option>
                <option>Vertical</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
            </div>
          </div>

          {/* Format */}
          <div className="w-48 relative">
            <label className="absolute -top-2 left-2.5 px-1 text-[11px] font-medium text-gray-500 bg-white z-10">
              Format
            </label>
            <div className="relative">
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full px-3 py-2 text-xs md:text-sm bg-white border border-gray-300 rounded focus:border-indigo-600 focus:outline-none appearance-none cursor-pointer"
              >
                <option>Standard Format</option>
                <option>CBSE Badge Format</option>
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

          {/* Print Button */}
          <div className="ml-auto">
            <button
              type="button"
              disabled={selectedCount === 0}
              onClick={() => setShowPrintPreview(true)}
              className={`px-5 py-2 text-white text-xs md:text-sm font-semibold rounded flex items-center gap-2 shadow-xs transition-all ${
                selectedCount === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'
              }`}
            >
              <Printer className="w-4 h-4" />
              <span>Print ({selectedCount})</span>
            </button>
          </div>
        </div>

        {/* Table matching Live UAB Screenshot Step 1898 */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="border-b border-gray-300 text-gray-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={students.length > 0 && selectedCount === students.length}
                    onChange={(e) => toggleSelectAll(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 accent-indigo-600 cursor-pointer"
                  />
                </th>
                <th className="py-2.5 px-4">S.NO.</th>
                <th className="py-2.5 px-4">ROLL NO.</th>
                <th className="py-2.5 px-4">ADM. NO.</th>
                <th className="py-2.5 px-4">SR. NO.</th>
                <th className="py-2.5 px-4">NAME</th>
                <th className="py-2.5 px-4">CLASS</th>
                <th className="py-2.5 px-4">FATHER'S NAME</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-700 font-medium">
              {students.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-gray-400">
                    No students registered in Class {selectedClass}. Register students under Student Registration to generate ID cards.
                  </td>
                </tr>
              ) : (
                students.map((std, idx) => (
                  <tr key={std.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-2.5 px-4">
                      <input
                        type="checkbox"
                        checked={std.selected}
                        onChange={() => toggleStudent(std.id)}
                        className="w-4 h-4 rounded text-indigo-600 accent-indigo-600 cursor-pointer"
                      />
                    </td>
                    <td className="py-2.5 px-4">{idx + 1}</td>
                    <td className="py-2.5 px-4 font-semibold text-gray-900">{std.rollNo}</td>
                    <td className="py-2.5 px-4 font-semibold text-indigo-600">{std.admNo}</td>
                    <td className="py-2.5 px-4">{std.srNo}</td>
                    <td className="py-2.5 px-4 font-semibold text-gray-800">{std.name}</td>
                    <td className="py-2.5 px-4">{std.className}</td>
                    <td className="py-2.5 px-4 text-gray-600">{std.fatherName}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable ID Cards Preview Modal */}
      {showPrintPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-2xs p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 animate-scale-in">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-6">
              <h2 className="text-sm md:text-base font-bold text-gray-800">
                Print Preview: Student ID Cards ({selectedCount})
              </h2>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-1.5 bg-indigo-600 text-white rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" /> Print Cards
                </button>
                <button
                  type="button"
                  onClick={() => setShowPrintPreview(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Grid of Preview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {students
                .filter((s) => s.selected)
                .map((std) => (
                  <div
                    key={std.id}
                    className="border-2 border-indigo-600 rounded-xl overflow-hidden bg-white shadow-md flex flex-col"
                    style={{ width: '100%', minHeight: cardType === 'Vertical' ? '380px' : '230px' }}
                  >
                    {/* ID Card Header */}
                    <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-indigo-900 text-white p-2.5 text-center">
                      <p className="text-[12px] font-black uppercase tracking-wide leading-tight">
                        {schoolName || 'J D INTERNATIONAL SCHOOL'}
                      </p>
                      <p className="text-[9px] text-indigo-200">Affiliated to CBSE, New Delhi</p>
                    </div>

                    {/* ID Card Body */}
                    <div className="p-3 flex-1 flex flex-col justify-between text-xs">
                      <div className="flex gap-3">
                        <div className="w-16 h-20 bg-gray-100 border border-gray-200 rounded flex items-center justify-center shrink-0">
                          {std.photoUrl ? (
                            <img src={std.photoUrl} alt="Photo" className="w-full h-full object-cover rounded" />
                          ) : (
                            <span className="text-[10px] text-gray-400 font-bold">PHOTO</span>
                          )}
                        </div>
                        <div className="space-y-0.5 text-[11px]">
                          <p className="font-bold text-gray-900 text-xs truncate max-w-[150px]">{std.name}</p>
                          <p className="text-gray-600">
                            <strong>Class:</strong> {std.className}
                          </p>
                          <p className="text-gray-600">
                            <strong>Roll No:</strong> {std.rollNo}
                          </p>
                          <p className="text-gray-600">
                            <strong>Adm No:</strong> #{std.admNo}
                          </p>
                          <p className="text-gray-600">
                            <strong>Father:</strong> {std.fatherName}
                          </p>
                          <p className="text-gray-600">
                            <strong>Contact:</strong> {std.mobile}
                          </p>
                        </div>
                      </div>

                      {/* Footer Signature Bar */}
                      <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between items-end text-[9px] text-gray-500 font-semibold">
                        <span>Card Valid: 2026-2027</span>
                        <div className="text-center">
                          <div className="w-16 border-b border-gray-400 mb-0.5"></div>
                          <span>Principal</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
