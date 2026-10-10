import React, { useState, useEffect } from 'react';
import {
  ArrowUpDown,
  Check,
  ChevronDown
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

export function AssignRollNumberPage({ onNavigate }) {
  const [type, setType] = useState('Roll No');
  const [selectedClass, setSelectedClass] = useState('I');
  const [selectedDivision, setSelectedDivision] = useState('A');
  const [prefixNo, setPrefixNo] = useState('');
  const [suffixNo, setSuffixNo] = useState('');
  const [startNo, setStartNo] = useState(1);
  const [sortAsc, setSortAsc] = useState(true);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Fetch students on class/division change
  useEffect(() => {
    fetchStudents();
  }, [selectedClass, selectedDivision]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:5000/api/students?className=${encodeURIComponent(
          selectedClass
        )}&section=${encodeURIComponent(selectedDivision)}`
      );
      if (res.ok) {
        const json = await res.json();
        setStudents(json.data || []);
      }
    } catch {
      // Fallback local students
      setStudents([
        {
          id: 'std_1',
          rollNo: '0',
          enrollNo: '',
          srNo: '1621',
          admNo: '1621',
          firstName: 'AADITYA SINGH',
          lastName: 'CHOUDHARY',
          fatherName: 'NARENDRA SINGH CHOUDHARY',
          gender: 'Male'
        },
        {
          id: 'std_2',
          rollNo: '0',
          enrollNo: '',
          srNo: '0',
          admNo: 'A135',
          firstName: 'ADVIK',
          lastName: 'RAO',
          fatherName: 'PRADEEP RAO',
          gender: 'Male'
        },
        {
          id: 'std_3',
          rollNo: '0',
          enrollNo: '',
          srNo: '0',
          admNo: 'A160',
          firstName: 'ANANYA RAJESH',
          lastName: 'KUMAR YADAV',
          fatherName: 'RAJESH KUMAR YADAV',
          gender: 'Female'
        },
        {
          id: 'std_4',
          rollNo: '0',
          enrollNo: '',
          srNo: '1590',
          admNo: '1590',
          firstName: 'ANVI',
          lastName: 'VERMA',
          fatherName: 'DINESH VERMA',
          gender: 'Female'
        },
        {
          id: 'std_5',
          rollNo: '0',
          enrollNo: '',
          srNo: '2051',
          admNo: '2051',
          firstName: 'ARADIYA',
          lastName: 'SAINI',
          fatherName: 'GANESH SAINI',
          gender: 'Male'
        },
        {
          id: 'std_6',
          rollNo: '0',
          enrollNo: '',
          srNo: '2061',
          admNo: '2061',
          firstName: 'ARJUN',
          lastName: 'SHARMA',
          fatherName: 'UMAKANT SHARMA',
          gender: 'Male'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Generate roll numbers starting from startNo
  const handleGenerate = () => {
    let current = parseInt(startNo, 10) || 1;
    const updated = students.map((s) => {
      const generated = `${prefixNo}${current}${suffixNo}`;
      current++;
      return { ...s, rollNo: generated };
    });
    setStudents(updated);
    setToastMessage(`Roll numbers generated successfully starting from ${startNo}!`);
    setTimeout(() => setToastMessage(null), 3000);
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
  };

  // Save updates to backend
  const handleSave = async () => {
    try {
      const updates = students.map((s) => ({ id: s.id, rollNo: s.rollNo }));
      const res = await fetch('http://localhost:5000/api/students/assign-roll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates })
      });
      if (res.ok) {
        setToastMessage('Roll numbers saved successfully to database!');
      } else {
        setToastMessage('Saved locally in memory!');
      }
    } catch {
      setToastMessage('Saved locally in memory!');
    }
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="p-4 md:p-6 bg-[#f3f4f6] min-h-screen text-slate-800">
      {/* Breadcrumbs matching Live UAB */}
      <div className="flex items-center gap-2 mb-3">
        <h1 className="text-base md:text-lg font-bold text-gray-800">Roll Number</h1>
        <span className="text-gray-400 text-xs flex items-center gap-1.5 font-normal">
          <span>🏠</span>
          <span>•</span>
          <span>Students</span>
          <span>•</span>
          <span className="text-gray-600 font-medium">Roll Number</span>
        </span>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-2xs p-4 md:p-5 mb-4">
        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-3">
          {/* Type */}
          <div className="relative">
            <label className="absolute -top-2 left-2.5 px-1 text-[11px] font-medium text-gray-500 bg-white z-10">
              Type*
            </label>
            <div className="relative">
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 text-xs md:text-sm text-gray-800 bg-white border border-gray-300 rounded focus:border-indigo-600 focus:outline-none appearance-none cursor-pointer"
              >
                <option value="Roll No">Roll No</option>
                <option value="Feebook No">Feebook No</option>
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Class */}
          <div className="relative">
            <label className="absolute -top-2 left-2.5 px-1 text-[11px] font-medium text-gray-500 bg-white z-10">
              Class*
            </label>
            <div className="relative">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 text-xs md:text-sm text-gray-800 bg-white border border-gray-300 rounded focus:border-indigo-600 focus:outline-none appearance-none cursor-pointer"
              >
                {CLASSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Division */}
          <div className="relative">
            <label className="absolute -top-2 left-2.5 px-1 text-[11px] font-medium text-gray-500 bg-white z-10">
              Division*
            </label>
            <div className="relative">
              <select
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                className="w-full px-3 py-2 text-xs md:text-sm text-gray-800 bg-white border border-gray-300 rounded focus:border-indigo-600 focus:outline-none appearance-none cursor-pointer"
              >
                {DIVISIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Prefix No */}
          <div className="relative">
            <label className="absolute -top-2 left-2.5 px-1 text-[11px] font-medium text-gray-500 bg-white z-10">
              Prefix No
            </label>
            <input
              type="text"
              value={prefixNo}
              onChange={(e) => setPrefixNo(e.target.value)}
              placeholder=""
              className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 rounded focus:border-indigo-600 focus:outline-none"
            />
          </div>

          {/* Sufix No */}
          <div className="relative">
            <label className="absolute -top-2 left-2.5 px-1 text-[11px] font-medium text-gray-500 bg-white z-10">
              Sufix No
            </label>
            <input
              type="text"
              value={suffixNo}
              onChange={(e) => setSuffixNo(e.target.value)}
              placeholder=""
              className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 rounded focus:border-indigo-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Row 2: Start No & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="relative w-48">
            <label className="absolute -top-2 left-2.5 px-1 text-[11px] font-medium text-gray-500 bg-white z-10">
              Start No
            </label>
            <input
              type="number"
              value={startNo}
              onChange={(e) => setStartNo(e.target.value)}
              className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 rounded focus:border-indigo-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Toggle Button */}
            <button
              type="button"
              onClick={handleSort}
              className="p-2 text-indigo-600 hover:bg-indigo-50 border border-indigo-200 rounded transition-colors"
              title="Sort Names Alphabetically"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>

            {/* Red Generate Button matching Live UAB */}
            <button
              type="button"
              onClick={handleGenerate}
              className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded text-xs md:text-sm shadow-xs transition-colors cursor-pointer"
            >
              Generate
            </button>

            {/* Purple Save Button matching Live UAB */}
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded text-xs md:text-sm shadow-xs transition-colors cursor-pointer"
            >
              Save
            </button>
          </div>
        </div>

        {/* Toast Feedback */}
        {toastMessage && (
          <div className="mt-3 p-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded flex items-center gap-2 animate-fade-in">
            <Check className="w-4 h-4" />
            {toastMessage}
          </div>
        )}
      </div>

      {/* Student List Table matching Live UAB */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="bg-gray-300 text-gray-800 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-4">ROLL NO</th>
                <th className="py-2.5 px-4">ENROLL NO.</th>
                <th className="py-2.5 px-4">SR.NO.</th>
                <th className="py-2.5 px-4">ADM NO.</th>
                <th className="py-2.5 px-4">STUDENT NAME</th>
                <th className="py-2.5 px-4">FATHER'S NAME</th>
                <th className="py-2.5 px-4">GENDER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-700 font-medium">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-400">
                    Loading student list...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-400">
                    No students found for this class and division.
                  </td>
                </tr>
              ) : (
                students.map((std, idx) => (
                  <tr key={std.id || idx} className="hover:bg-gray-50 transition-colors">
                    <td className="py-2 px-4">
                      <input
                        type="text"
                        value={std.rollNo || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setStudents((prev) =>
                            prev.map((s, i) => (i === idx ? { ...s, rollNo: val } : s))
                          );
                        }}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-xs font-semibold focus:border-indigo-600 focus:outline-none"
                      />
                    </td>
                    <td className="py-2.5 px-4 text-gray-500">{std.enrollNo || '-'}</td>
                    <td className="py-2.5 px-4">{std.srNo || '-'}</td>
                    <td className="py-2.5 px-4 font-semibold text-gray-900">{std.admNo}</td>
                    <td className="py-2.5 px-4 font-semibold text-gray-800">
                      {`${std.firstName} ${std.lastName}`.trim()}
                    </td>
                    <td className="py-2.5 px-4 text-gray-600">{std.fatherName}</td>
                    <td className="py-2.5 px-4">{std.gender}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
