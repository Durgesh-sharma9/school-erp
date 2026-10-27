import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Home, CheckCircle2, Search, X } from 'lucide-react';
import { SCHOOL_CLASSES, MOCK_STUDENTS } from '../students/reports/studentReportsData';

export function BulkTcPage({ onNavigate }) {
  const [selectedClass, setSelectedClass] = useState('X');
  const [selectedSection, setSelectedSection] = useState('A');
  const [reason, setReason] = useState('Parent Wish');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedCount, setGeneratedCount] = useState(0);

  const students = MOCK_STUDENTS.filter(s =>
    (selectedClass === 'All' || s.className === selectedClass) &&
    (selectedSection === 'All' || s.section === selectedSection)
  );

  const filtered = students.filter(s =>
    !searchQuery ||
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.admNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.fatherName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelect = (id) => {
    setSelectedStudents(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedStudents.length === filtered.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filtered.map(s => s.sNo));
    }
  };

  const handleGenerate = () => {
    if (selectedStudents.length === 0) {
      toast.error('Please select at least one student to generate TC');
      return;
    }
    setGeneratedCount(selectedStudents.length);
    setShowSuccessModal(true);
    setSelectedStudents([]);
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      {/* Top Toolbar */}
      <div className="bg-white border-b border-slate-200/80 px-4 md:px-8 py-3 flex items-center justify-between shadow-xs sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <h1 className="text-base md:text-lg font-semibold text-slate-800">
            Generate bulk Tc
          </h1>
          <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400 pl-3 border-l border-slate-200">
            <button onClick={() => onNavigate && onNavigate('/')} className="hover:text-indigo-600">
              <Home className="w-3.5 h-3.5" />
            </button>
            <span>•</span>
            <span className="text-slate-500">Students</span>
            <span>•</span>
            <span className="text-indigo-600 font-medium">Generate bulk Tc</span>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4">
        {/* Filter Card */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Class*
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="All">All Classes</option>
                {SCHOOL_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Section*
              </label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="All">All Sections</option>
                <option value="A">A</option>
                <option value="B">B</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Select Reason*
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Parent Wish">Parent Wish</option>
                <option value="Family Relocation">Family Relocation</option>
                <option value="Completed Course">Completed Course</option>
                <option value="Higher Education Admission">Higher Education Admission</option>
              </select>
            </div>

            <div>
              {/* Red Generate Button matching 1:1 UAB */}
              <button
                onClick={handleGenerate}
                disabled={selectedStudents.length === 0}
                className="w-full bg-[#ef4444] hover:bg-red-600 disabled:opacity-50 text-white text-xs font-semibold py-2.5 px-4 rounded-lg shadow-xs transition-colors"
              >
                Generate {selectedStudents.length > 0 && `(${selectedStudents.length})`}
              </button>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 overflow-hidden">
          <div className="p-4 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-medium text-slate-600">
              Eligible Students: <strong className="text-slate-900">{filtered.length}</strong> (Selected: {selectedStudents.length})
            </span>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student..."
                className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={selectedStudents.length === filtered.length && filtered.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                  </th>
                  <th className="py-3 px-4">S.NO.</th>
                  <th className="py-3 px-4">ADM. NO.</th>
                  <th className="py-3 px-4">SR. NO.</th>
                  <th className="py-3 px-4">NAME</th>
                  <th className="py-3 px-4">CLASS</th>
                  <th className="py-3 px-4">FATHER'S NAME</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.length > 0 ? (
                  filtered.map((r, i) => (
                    <tr key={r.sNo} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(r.sNo)}
                          onChange={() => toggleSelect(r.sNo)}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="py-3 px-4 text-slate-500">{i + 1}</td>
                      <td className="py-3 px-4 font-semibold text-indigo-600">{r.admNo}</td>
                      <td className="py-3 px-4 text-slate-600">{r.srNo}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900">{r.name}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium">
                          {r.className} - {r.section}
                        </span>
                      </td>
                      <td className="py-3 px-4">{r.fatherName}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-10 text-slate-400">
                      No Students Found for Selected Class & Section
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute right-4 top-4 p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Bulk TC Generated Successfully
            </h3>
            <p className="text-xs text-slate-500">
              Generated {generatedCount} Transfer Certificate(s) for Class {selectedClass} with reason: <strong>{reason}</strong>.
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-2 bg-[#5c67f6] hover:bg-indigo-600 text-white text-xs font-semibold rounded-lg shadow-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
