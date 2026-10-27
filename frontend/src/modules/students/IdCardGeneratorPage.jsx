import React, { useState, useEffect } from 'react';
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
  const [highlightStudent, setHighlightStudent] = useState(null);
  const [selectedClass, setSelectedClass] = useState('I');
  const [cardType, setCardType] = useState('Horizontal');
  const [format, setFormat] = useState('Standard Format');
  const [isMultiple, setIsMultiple] = useState(true);
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  const [students, setStudents] = useState([
    {
      id: '1',
      rollNo: '1',
      admNo: '1621',
      srNo: '1621',
      name: 'AADITYA SINGH CHOUDHARY',
      className: 'I',
      fatherName: 'NARENDRA SINGH CHOUDHARY',
      dob: '12-04-2019',
      mobile: '9829012345',
      address: 'Vidhyadhar Nagar, Jaipur',
      selected: true
    },
    {
      id: '2',
      rollNo: '2',
      admNo: 'A135',
      srNo: '0',
      name: 'ADVIK RAO',
      className: 'I',
      fatherName: 'PRADEEP RAO',
      dob: '20-07-2019',
      mobile: '9414023456',
      address: 'Central Park, Jaipur',
      selected: true
    },
    {
      id: '3',
      rollNo: '3',
      admNo: 'A160',
      srNo: '0',
      name: 'ANANYA RAJESH KUMAR YADAV',
      className: 'I',
      fatherName: 'RAJESH KUMAR YADAV',
      dob: '15-02-2019',
      mobile: '9828034567',
      address: 'Shyam Nagar, Jaipur',
      selected: false
    },
    {
      id: '4',
      rollNo: '4',
      admNo: '1590',
      srNo: '1590',
      name: 'ANVI VERMA',
      className: 'I',
      fatherName: 'DINESH VERMA',
      dob: '05-09-2019',
      mobile: '9784045678',
      address: 'Malviya Nagar, Jaipur',
      selected: false
    }
  ]);

  const toggleSelectAll = (checked) => {
    setStudents((prev) => prev.map((s) => ({ ...s, selected: checked })));
  };

  const toggleStudent = (id) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, selected: !s.selected } : s))
    );
  };

  useEffect(() => {
    const pending = tenantStore.getPendingIdCardStudent();
    if (pending) {
      setHighlightStudent(pending);
      if (pending.className) {
        setSelectedClass(pending.className);
      }
      setStudents((prev) => {
        const exists = prev.find((s) => String(s.admNo) === String(pending.admNo));
        if (exists) {
          return prev.map((s) => ({
            ...s,
            selected: String(s.admNo) === String(pending.admNo)
          }));
        }
        const newCard = {
          id: `pending_${Date.now()}`,
          rollNo: pending.rollNo || '1',
          admNo: pending.admNo || '',
          srNo: pending.admNo || '',
          name: (pending.name || '').toUpperCase(),
          className: pending.className || 'I',
          fatherName: (pending.fatherName || '').toUpperCase(),
          dob: pending.dob || '01-01-2019',
          mobile: pending.mobile || '',
          address: pending.address || 'Local',
          selected: true
        };
        return [newCard, ...prev.map((s) => ({ ...s, selected: false }))];
      });
    }
  }, []);

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

      {highlightStudent && (
        <div className="mb-4 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
              🪪
            </div>
            <div>
              <p className="text-xs font-bold text-indigo-900">
                Ready to print ID Card for {highlightStudent.name} (Adm: #{highlightStudent.admNo})
              </p>
              <p className="text-[11px] text-indigo-600">
                Student pre-selected from registration / student directory action.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowPrintPreview(true)}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Instant Preview & Print</span>
          </button>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-2xs p-4 md:p-5 mb-4">
        {/* Filters Row matching Live UAB Screenshot Step 1924 */}
        <div className="flex flex-wrap items-center gap-3">
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
                  <option key={c} value={c}>{c}</option>
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
              className={`px-6 py-2 rounded text-xs md:text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                selectedCount > 0
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs cursor-pointer'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Printer className="w-4 h-4" />
              Print ({selectedCount})
            </button>
          </div>
        </div>
      </div>

      {/* Table matching Live UAB Screenshot Step 1924 */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="bg-gray-400 text-gray-900 font-bold uppercase tracking-wider text-[11px]">
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
              {students.map((std, idx) => (
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
              ))}
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
                  className="px-4 py-1.5 bg-indigo-600 text-white rounded text-xs font-semibold flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" /> Print Cards
                </button>
                <button
                  type="button"
                  onClick={() => setShowPrintPreview(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Generated ID Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {students
                .filter((s) => s.selected)
                .map((std) => (
                  <div
                    key={std.id}
                    className="border-2 border-indigo-600 rounded-xl overflow-hidden bg-white shadow-md flex flex-col p-4 relative"
                    style={{ minHeight: cardType === 'Vertical' ? '380px' : '220px' }}
                  >
                    {/* ID Card Header */}
                    <div className="text-center border-b border-indigo-100 pb-2 mb-3">
                      <h3 className="text-sm font-extrabold text-indigo-900 tracking-wider">
                        J D INTERNATIONAL SCHOOL
                      </h3>
                      <p className="text-[10px] text-gray-500 font-medium">
                        Affiliated to CBSE, New Delhi • Session 2026-2027
                      </p>
                    </div>

                    {/* ID Card Body */}
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-24 bg-indigo-50 border border-indigo-200 rounded flex items-center justify-center shrink-0">
                        <svg className="w-16 h-16 text-gray-600" viewBox="0 0 100 100" fill="currentColor">
                          <polygon points="50,15 85,28 50,40 15,28" fill="#1e293b" />
                          <circle cx="50" cy="45" r="16" fill="#fbcfe8" />
                          <path d="M25,88 C25,65 38,62 50,62 C62,62 75,65 75,88 Z" fill="#1e293b" />
                        </svg>
                      </div>

                      <div className="text-xs space-y-1 text-gray-700">
                        <p className="font-extrabold text-gray-900 text-sm">{std.name}</p>
                        <p><span className="font-semibold text-gray-500">Class:</span> {std.className} &nbsp;|&nbsp; <span className="font-semibold text-gray-500">Roll:</span> {std.rollNo}</p>
                        <p><span className="font-semibold text-gray-500">Adm No:</span> {std.admNo} &nbsp;|&nbsp; <span className="font-semibold text-gray-500">DOB:</span> {std.dob}</p>
                        <p><span className="font-semibold text-gray-500">Father:</span> {std.fatherName}</p>
                        <p><span className="font-semibold text-gray-500">Phone:</span> {std.mobile}</p>
                      </div>
                    </div>

                    {/* ID Card Footer */}
                    <div className="mt-auto pt-3 border-t border-indigo-100 flex justify-between items-center text-[10px] text-gray-400">
                      <span>Card No: JDIS-{std.admNo}</span>
                      <span className="font-bold text-gray-600">Principal Signature</span>
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
