import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  X,
  Calendar,
  Clock,
  Video,
  ExternalLink,
  ChevronDown,
  Check
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
const SUBJECTS = ['Mathematics', 'Science', 'English', 'Hindi', 'Social Science', 'Physics', 'Chemistry', 'Biology'];
const TEACHERS = ['Mr. Rajesh Sharma', 'Dr. Suresh Kumar', 'Mrs. Sunita Verma', 'Ms. Pooja Jain'];

export function OnlineClassesPage({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [onlineClasses, setOnlineClasses] = useState([
    {
      id: 'oc_1',
      className: 'X',
      division: 'A',
      teacher: 'Mr. Rajesh Sharma',
      subject: 'Mathematics',
      meetingUrl: 'https://meet.google.com/abc-defg-hij',
      topic: 'Quadratic Equations & Solutions',
      dateTime: '2026-10-12 10:00 AM'
    },
    {
      id: 'oc_2',
      className: 'XII-NON-MEDICAL',
      division: 'A',
      teacher: 'Dr. Suresh Kumar',
      subject: 'Physics',
      meetingUrl: 'https://meet.google.com/xyz-uvwx-rst',
      topic: 'Electromagnetic Induction',
      dateTime: '2026-10-12 11:30 AM'
    }
  ]);

  const [toastMessage, setToastMessage] = useState(null);

  // New Class Form State
  const [newClass, setNewClass] = useState({
    className: 'X',
    division: 'A',
    subject: 'Mathematics',
    date: '2026-10-14',
    time: '10:00',
    title: '',
    duration: '45 mins',
    teacher: 'Mr. Rajesh Sharma',
    meetingId: '',
    password: '',
    link: '',
    description: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClass((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddClass = () => {
    const item = {
      id: `oc_${Date.now()}`,
      className: newClass.className,
      division: newClass.division,
      teacher: newClass.teacher,
      subject: newClass.subject,
      meetingUrl: newClass.link || 'https://meet.google.com/new-class',
      topic: newClass.title || 'General Interactive Session',
      dateTime: `${newClass.date} ${newClass.time}`
    };

    setOnlineClasses((prev) => [item, ...prev]);
    setIsModalOpen(false);
    setToastMessage('Online Class scheduled successfully!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filtered = onlineClasses.filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.className.toLowerCase().includes(q) ||
      c.teacher.toLowerCase().includes(q) ||
      c.subject.toLowerCase().includes(q) ||
      c.topic.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-4 md:p-6 bg-[#f3f4f6] min-h-screen text-slate-800">
      {/* Breadcrumbs matching Live UAB */}
      <div className="flex items-center gap-2 mb-3">
        <h1 className="text-base md:text-lg font-bold text-gray-800">Online Class Master</h1>
        <span className="text-gray-400 text-xs flex items-center gap-1.5 font-normal">
          <span>🏠</span>
          <span>•</span>
          <span>Online Class</span>
          <span>•</span>
          <span className="text-gray-600 font-medium">Online Class Master</span>
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
              placeholder="Search..."
              className="w-full pl-9 pr-4 py-2 text-xs md:text-sm border border-gray-200 rounded-full focus:border-indigo-600 focus:outline-none bg-gray-50/50"
            />
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-md transition-all hover:scale-105 cursor-pointer"
            title="Add Online Class"
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

        {/* Online Classes Table matching Live UAB */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">S.NO.</th>
                <th className="py-3 px-4">CLASS</th>
                <th className="py-3 px-4">TEACHER</th>
                <th className="py-3 px-4">SUBJECT</th>
                <th className="py-3 px-4">MEETING URL</th>
                <th className="py-3 px-4">TOPIC</th>
                <th className="py-3 px-4">DATE & TIME</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-400">
                    No online classes found. Click '+' to create one.
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">{idx + 1}</td>
                    <td className="py-3 px-4 font-semibold text-gray-900">
                      {item.className} - {item.division}
                    </td>
                    <td className="py-3 px-4">{item.teacher}</td>
                    <td className="py-3 px-4 text-indigo-600 font-semibold">{item.subject}</td>
                    <td className="py-3 px-4">
                      <a
                        href={item.meetingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <Video className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate max-w-[150px]">{item.meetingUrl}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-800">{item.topic}</td>
                    <td className="py-3 px-4 text-gray-500">{item.dateTime}</td>
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

      {/* ADD ONLINE CLASS MODAL matching Live UAB Screenshot Step 1896 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl overflow-hidden animate-scale-in">
            {/* Header */}
            <div className="px-6 py-4 flex justify-between items-center border-b border-gray-100">
              <h2 className="text-sm md:text-base font-bold text-gray-800 tracking-wide">
                ADD ONLINE CLASS
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
            <div className="p-6 space-y-3">
              {/* Row 1 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <label className="absolute -top-2 left-2.5 px-1 text-[11px] font-medium text-gray-500 bg-white z-10">
                    Class*
                  </label>
                  <div className="relative">
                    <select
                      name="className"
                      value={newClass.className}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-xs md:text-sm bg-white border border-gray-300 rounded focus:border-indigo-600 focus:outline-none appearance-none"
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
                    Division*
                  </label>
                  <div className="relative">
                    <select
                      name="division"
                      value={newClass.division}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-xs md:text-sm bg-white border border-gray-300 rounded focus:border-indigo-600 focus:outline-none appearance-none"
                    >
                      {DIVISIONS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <label className="absolute -top-2 left-2.5 px-1 text-[11px] font-medium text-gray-500 bg-white z-10">
                    Subject*
                  </label>
                  <div className="relative">
                    <select
                      name="subject"
                      value={newClass.subject}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-xs md:text-sm bg-white border border-gray-300 rounded focus:border-indigo-600 focus:outline-none appearance-none"
                    >
                      {SUBJECTS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                  </div>
                </div>

                <div className="relative">
                  <label className="absolute -top-2 left-2.5 px-1 text-[11px] font-medium text-gray-500 bg-white z-10">
                    Select Date*
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={newClass.date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 rounded focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <label className="absolute -top-2 left-2.5 px-1 text-[11px] font-medium text-gray-500 bg-white z-10">
                    Time*
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="time"
                      name="time"
                      value={newClass.time}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 rounded focus:border-indigo-600 focus:outline-none"
                    />
                    <Clock className="w-4 h-4 absolute right-2.5 pointer-events-none text-indigo-600" />
                  </div>
                </div>

                <div className="relative">
                  <label className="absolute -top-2 left-2.5 px-1 text-[11px] font-medium text-gray-500 bg-white z-10">
                    Title*
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={newClass.title}
                    onChange={handleInputChange}
                    placeholder="Enter topic..."
                    className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 rounded focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 4 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <label className="absolute -top-2 left-2.5 px-1 text-[11px] font-medium text-gray-500 bg-white z-10">
                    Duration*
                  </label>
                  <div className="relative">
                    <select
                      name="duration"
                      value={newClass.duration}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-xs md:text-sm bg-white border border-gray-300 rounded focus:border-indigo-600 focus:outline-none appearance-none"
                    >
                      <option>30 mins</option>
                      <option>45 mins</option>
                      <option>60 mins</option>
                      <option>90 mins</option>
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                  </div>
                </div>

                <div className="relative">
                  <label className="absolute -top-2 left-2.5 px-1 text-[11px] font-medium text-gray-500 bg-white z-10">
                    Teacher*
                  </label>
                  <div className="relative">
                    <select
                      name="teacher"
                      value={newClass.teacher}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-xs md:text-sm bg-white border border-gray-300 rounded focus:border-indigo-600 focus:outline-none appearance-none"
                    >
                      {TEACHERS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Row 5 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <label className="absolute -top-2 left-2.5 px-1 text-[11px] font-medium text-gray-500 bg-white z-10">
                    Meeting ID*
                  </label>
                  <input
                    type="text"
                    name="meetingId"
                    value={newClass.meetingId}
                    onChange={handleInputChange}
                    placeholder="e.g. 984 212 4432"
                    className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 rounded focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div className="relative">
                  <label className="absolute -top-2 left-2.5 px-1 text-[11px] font-medium text-gray-500 bg-white z-10">
                    Password
                  </label>
                  <input
                    type="text"
                    name="password"
                    value={newClass.password}
                    onChange={handleInputChange}
                    placeholder="e.g. jdis"
                    className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 rounded focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 6 */}
              <div className="relative">
                <label className="absolute -top-2 left-2.5 px-1 text-[11px] font-medium text-gray-500 bg-white z-10">
                  Link*
                </label>
                <input
                  type="text"
                  name="link"
                  value={newClass.link}
                  onChange={handleInputChange}
                  placeholder="https://meet.google.com/..."
                  className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 rounded focus:border-indigo-600 focus:outline-none"
                />
              </div>

              {/* Row 7 */}
              <div className="relative">
                <label className="absolute -top-2 left-2.5 px-1 text-[11px] font-medium text-gray-500 bg-white z-10">
                  Description
                </label>
                <textarea
                  name="description"
                  value={newClass.description}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Instructions or syllabus for students..."
                  className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 rounded focus:border-indigo-600 focus:outline-none"
                />
              </div>

              {/* Footer */}
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
                  onClick={handleAddClass}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs md:text-sm font-semibold rounded shadow-xs"
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
