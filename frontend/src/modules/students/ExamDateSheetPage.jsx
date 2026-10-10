import React, { useState } from 'react';
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

const TERMS = ['Term 1', 'Term 2', 'Annual Examination'];
const EXAMS = ['None', 'Mid Term Exam 2026', 'Final Board Examination 2027'];
const SUBJECTS = ['English', 'Mathematics', 'Science', 'Social Science', 'Hindi', 'Sanskrit', 'Computer'];

export function ExamDateSheetPage({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Date sheet list matching Live UAB Screenshot Step 1936
  const [dateSheets, setDateSheets] = useState([
    {
      id: '1',
      className: 'X',
      examTerm: 'Term 1',
      examName: 'Mid Term Exam 2026',
      file: 'DateSheet_X_MidTerm.pdf'
    },
    {
      id: '2',
      className: 'XII-NON-MEDICAL',
      examTerm: 'Term 1',
      examName: 'Mid Term Exam 2026',
      file: 'DateSheet_XII_MidTerm.pdf'
    }
  ]);

  // Modal Form State matching Live UAB Screenshot Step 1942
  const [entryMode, setEntryMode] = useState('manual'); // 'manual' | 'upload'
  const [modalClass, setModalClass] = useState('X');
  const [modalTerm, setModalTerm] = useState('Term 1');
  const [modalExam, setModalExam] = useState('None');
  const [examNotes, setExamNotes] = useState('');

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
        date: '2026-11-10',
        subject: 'Social Science',
        from: '09:00 AM',
        to: '12:00 PM'
      }
    ]);
  };

  const removeScheduleRow = (id) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSaveDateSheet = () => {
    const newSheet = {
      id: String(Date.now()),
      className: modalClass,
      examTerm: modalTerm,
      examName: modalExam !== 'None' ? modalExam : 'Exam Date Sheet 2026',
      file: `${modalClass}_DateSheet.pdf`
    };

    setDateSheets((prev) => [newSheet, ...prev]);
    setIsModalOpen(false);
    setToastMessage('Exam Date Sheet saved successfully!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filtered = dateSheets.filter((d) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      d.className.toLowerCase().includes(q) ||
      d.examTerm.toLowerCase().includes(q) ||
      d.examName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-4 md:p-6 bg-[#f3f4f6] min-h-screen text-slate-800">
      {/* Breadcrumbs matching Live UAB */}
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
        {/* Top Action Bar matching Live UAB Screenshot Step 1936 */}
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
              className="p-2 text-indigo-600 hover:bg-indigo-50 border border-indigo-100 rounded-lg transition-colors"
              title="SMS Notification"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-2 text-gray-600 hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors"
              title="Filter"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-md transition-all hover:scale-105 cursor-pointer"
              title="Add Exam Date Sheet"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toast */}
        {toastMessage && (
          <div className="mb-4 p-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded flex items-center gap-2">
            <Check className="w-4 h-4" />
            {toastMessage}
          </div>
        )}

        {/* Table matching Live UAB Screenshot Step 1936 */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">S.NO.</th>
                <th className="py-3 px-4">CLASS</th>
                <th className="py-3 px-4">EXAM TERM</th>
                <th className="py-3 px-4">EXAM NAME</th>
                <th className="py-3 px-4">FILE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-400">
                    No exam date sheets found. Click '+' to add one.
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">{idx + 1}</td>
                    <td className="py-3 px-4 font-semibold text-gray-900">{item.className}</td>
                    <td className="py-3 px-4 font-semibold text-indigo-600">{item.examTerm}</td>
                    <td className="py-3 px-4 font-semibold text-gray-800">{item.examName}</td>
                    <td className="py-3 px-4">
                      <span className="text-blue-600 hover:underline flex items-center gap-1.5 cursor-pointer">
                        <FileText className="w-3.5 h-3.5 text-red-500" />
                        {item.file}
                      </span>
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
          <select className="border border-gray-200 rounded px-2 py-1 bg-white focus:outline-none">
            <option>50</option>
            <option>100</option>
          </select>
          <span>1 - {filtered.length} of {filtered.length}</span>
        </div>
      </div>

      {/* EXAM DATE SHEET MODAL matching Live UAB Screenshot Step 1942 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 flex justify-between items-center border-b border-gray-100">
              <h2 className="text-sm md:text-base font-bold text-gray-800 tracking-wide">
                EXAM DATE SHEET
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
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {/* Radio Options matching Live UAB */}
              <div className="flex items-center gap-6 text-xs font-semibold text-gray-700">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="entryMode"
                    value="manual"
                    checked={entryMode === 'manual'}
                    onChange={() => setEntryMode('manual')}
                    className="text-red-500 accent-red-500"
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
                    className="text-red-500 accent-red-500"
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
                      {CLASSES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                  </div>
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
                        <option key={t} value={t}>{t}</option>
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
                        <option key={x} value={x}>{x}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Sub-Table matching Live UAB Screenshot Step 1942 */}
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
                        <td className="p-2 text-center font-semibold border-r border-gray-200">{idx + 1}</td>
                        <td className="p-1 border-r border-gray-200">
                          <input
                            type="date"
                            value={s.date}
                            onChange={(e) => {
                              const v = e.target.value;
                              setSchedules((prev) =>
                                prev.map((item) => (item.id === s.id ? { ...item, date: v } : item))
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
                                prev.map((item) => (item.id === s.id ? { ...item, subject: v } : item))
                              );
                            }}
                            className="w-full px-1.5 py-1 text-xs border border-gray-200 rounded bg-white"
                          >
                            {SUBJECTS.map((sub) => (
                              <option key={sub} value={sub}>{sub}</option>
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
                                prev.map((item) => (item.id === s.id ? { ...item, from: v } : item))
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
                                prev.map((item) => (item.id === s.id ? { ...item, to: v } : item))
                              );
                            }}
                            className="w-full px-1 py-1 text-xs border border-gray-200 rounded text-center"
                          />
                        </td>
                        <td className="p-1 text-center">
                          <button
                            type="button"
                            onClick={() => removeScheduleRow(s.id)}
                            className="text-red-500 hover:text-red-700 p-1"
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
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded border border-gray-300"
                >
                  + Add Subject Row
                </button>
              </div>

              {/* Exam Notes Textarea */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600">Exam Notes</label>
                <textarea
                  value={examNotes}
                  onChange={(e) => setExamNotes(e.target.value)}
                  rows={3}
                  placeholder="Instructions for students..."
                  className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 rounded focus:border-indigo-600 focus:outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end items-center gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs md:text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveDateSheet}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs md:text-sm font-semibold rounded shadow-xs"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
