import React, { useState } from 'react';
import { Home, Printer, Search, X, Award, CheckCircle } from 'lucide-react';
import { MOCK_STUDENTS } from '../students/reports/studentReportsData';

export function CertificateGeneratorPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('student'); // 'student' | 'staff'
  const [selectedStudent, setSelectedStudent] = useState(MOCK_STUDENTS[0] || null);
  const [searchQuery, setSearchQuery] = useState(MOCK_STUDENTS[0]?.name || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [reportType, setReportType] = useState('Bonafide Certificate');
  const [withOption, setWithOption] = useState("Father's Name");
  const [format, setFormat] = useState('Standard');
  const [border, setBorder] = useState('Single Border');
  const [showPrintModal, setShowPrintModal] = useState(false);

  const filteredSuggestions = MOCK_STUDENTS.filter(s =>
    searchQuery && s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setSearchQuery(student.name);
    setShowSuggestions(false);
  };

  const handlePrint = () => {
    setShowPrintModal(true);
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      {/* Top Header / Toolbar (1:1 UAB style) */}
      <div className="bg-white border-b border-slate-200/80 px-4 md:px-8 py-3 flex items-center justify-between shadow-xs sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <h1 className="text-base md:text-lg font-semibold text-slate-800">
            Generate Computer Slip
          </h1>
          <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400 pl-3 border-l border-slate-200">
            <button onClick={() => onNavigate && onNavigate('/')} className="hover:text-indigo-600">
              <Home className="w-3.5 h-3.5" />
            </button>
            <span>•</span>
            <span className="text-slate-500">Student</span>
            <span>•</span>
            <span className="text-indigo-600 font-medium">Generate Computer Slip</span>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-[#5c67f6] hover:bg-indigo-600 text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Certificate</span>
        </button>
      </div>

      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4">
        {/* Tabs Bar */}
        <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2">
          <button
            onClick={() => setActiveTab('student')}
            className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'student'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Student Certificate Details
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'staff'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Staff Certificate Details
          </button>
        </div>

        {/* Filter / Configuration Card */}
        <div className="bg-white rounded-b-xl shadow-xs border border-slate-200/80 p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
            {/* Search Input with Autocomplete */}
            <div className="relative">
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Search Student*
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Enter student name..."
                  className="w-full text-xs pl-8 pr-3 py-2.5 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                  {filteredSuggestions.map(s => (
                    <div
                      key={s.sNo}
                      onClick={() => handleSelectStudent(s)}
                      className="px-3 py-2 text-xs hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0"
                    >
                      <div className="font-semibold text-slate-900">{s.name}</div>
                      <div className="text-[11px] text-slate-500">
                        Class: {s.className}-{s.section} • Adm: {s.admNo}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Report Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Report Type*
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                <option value="Bonafide Certificate">Bonafide Certificate</option>
                <option value="Character Certificate">Character Certificate</option>
                <option value="Tution Fee Report">Tution Fee Report</option>
                <option value="Participation Certificate">Participation Certificate</option>
                <option value="Participation Achievement">Participation Achievement</option>
                <option value="Study Certificate">Study Certificate</option>
              </select>
            </div>

            {/* With Option */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                With
              </label>
              <select
                value={withOption}
                onChange={(e) => setWithOption(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Father's Name">Father's Name</option>
                <option value="Mother's Name">Mother's Name</option>
                <option value="Both">Both (Father & Mother)</option>
              </select>
            </div>

            {/* Format */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Format
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Standard">Standard Format</option>
                <option value="Formal">Formal School Format</option>
                <option value="Board">CBSE Board Affiliated</option>
              </select>
            </div>

            {/* Border */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Border
              </label>
              <select
                value={border}
                onChange={(e) => setBorder(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="None">None</option>
                <option value="Single Border">Single Border</option>
                <option value="Double Border">Double Border</option>
                <option value="Ornate Border">Ornate Border</option>
              </select>
            </div>
          </div>
        </div>

        {/* Live Certificate Preview Sheet */}
        {selectedStudent && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-8 max-w-4xl mx-auto">
            <div className={`p-8 bg-amber-50/20 rounded-xl relative ${
              border === 'Double Border' ? 'border-4 border-double border-slate-800' :
              border === 'Ornate Border' ? 'border-4 border-dashed border-indigo-900' :
              border === 'Single Border' ? 'border-2 border-slate-800' : ''
            }`}>
              {/* Header */}
              <div className="text-center space-y-1 border-b-2 border-slate-800 pb-5">
                <div className="flex justify-center mb-2">
                  <div className="w-14 h-14 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xl">
                    JD
                  </div>
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-wider uppercase">
                  J D INTERNATIONAL SCHOOL
                </h2>
                <p className="text-xs text-slate-600 font-medium">
                  Affiliated to CBSE, New Delhi • Affiliation No: 1730000 • School Code: 20000
                </p>
                <p className="text-[11px] text-slate-500">
                  Main Campus, Mansarovar, Jaipur (Rajasthan) - 302020 • Phone: 0141-2780000
                </p>
              </div>

              {/* Certificate Title Banner */}
              <div className="text-center my-6">
                <span className="inline-block px-6 py-1.5 rounded-full bg-slate-900 text-white text-xs font-bold tracking-widest uppercase shadow-xs">
                  {reportType}
                </span>
              </div>

              {/* Body Content */}
              <div className="text-sm leading-relaxed text-slate-800 space-y-4 my-8 text-justify">
                <p>
                  This is to certify that Master / Miss <strong className="text-slate-950 font-bold underline">{selectedStudent.name}</strong>,
                  {withOption === "Father's Name" && <> son/daughter of Mr. <strong className="text-slate-950 font-bold">{selectedStudent.fatherName}</strong></>}
                  {withOption === "Mother's Name" && <> son/daughter of Mrs. <strong className="text-slate-950 font-bold">{selectedStudent.motherName}</strong></>}
                  {withOption === "Both" && <> son/daughter of Mr. <strong className="text-slate-950 font-bold">{selectedStudent.fatherName}</strong> and Mrs. <strong className="text-slate-950 font-bold">{selectedStudent.motherName}</strong></>},
                  bearing Admission Number <strong className="text-slate-950 font-bold">{selectedStudent.admNo}</strong> and SR No. <strong className="text-slate-950 font-bold">{selectedStudent.srNo}</strong>,
                  is a bonafide student of Class <strong className="text-slate-950 font-bold">{selectedStudent.className} - Section {selectedStudent.section}</strong> of this institution during the academic session <strong className="text-slate-950 font-bold">2026-2027</strong>.
                </p>

                {reportType === 'Character Certificate' && (
                  <p>
                    During his/her tenure at this school, his/her character, general conduct, and moral demeanor have been found to be <strong className="font-bold">EXCELLENT</strong>. To the best of our knowledge, he/she bears an exemplary reputation and participated actively in co-curricular activities.
                  </p>
                )}

                {reportType === 'Tution Fee Report' && (
                  <p>
                    As per school office records, tuition fee has been cleared for the session 2026-2027. Total school tuition fees deposited for the academic year amounts to <strong className="font-bold">₹42,000/-</strong> (Rupees Forty-Two Thousand Only).
                  </p>
                )}

                <p>
                  We wish him/her all the best and continued success in all future academic endeavors.
                </p>
              </div>

              {/* Meta & Signatures Footer */}
              <div className="pt-12 flex justify-between items-end text-xs text-slate-700">
                <div>
                  <p><span className="text-slate-500">Date of Issue:</span> <strong className="text-slate-900">{new Date().toLocaleDateString('en-GB')}</strong></p>
                  <p><span className="text-slate-500">Place:</span> <strong className="text-slate-900">Jaipur</strong></p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full border border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400 mx-auto mb-1">
                    [School Seal]
                  </div>
                  <span className="text-[10px] text-slate-400">OFFICIAL SEAL</span>
                </div>
                <div className="text-center">
                  <div className="w-36 border-t-2 border-slate-800 pt-1 font-bold text-slate-900">
                    Principal
                  </div>
                  <span className="text-[10px] text-slate-500">J D International School</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Print View Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowPrintModal(false)}
              className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-2xl font-bold">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Ready to Print Certificate
              </h3>
              <p className="text-xs text-slate-500">
                {reportType} for <strong>{selectedStudent.name}</strong> (Class {selectedStudent.className}-{selectedStudent.section})
              </p>
              <div className="pt-4 flex justify-center space-x-3">
                <button
                  onClick={() => {
                    setShowPrintModal(false);
                    window.print();
                  }}
                  className="px-5 py-2.5 rounded-lg bg-[#5c67f6] hover:bg-indigo-600 text-white text-xs font-semibold shadow-xs"
                >
                  Send to Printer
                </button>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
