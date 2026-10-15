import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Search,
  Home,
  CheckCircle2,
  Users,
  X,
  FileDown
} from 'lucide-react';

const INITIAL_LINKS = [
  { id: '1', className: 'Lower Kindergarten - PP4+-A', subject: 'MATHEMATICS', totalLinked: 41 },
  { id: '2', className: 'Lower Kindergarten - PP4+-A', subject: 'ENGLISH', totalLinked: 41 },
  { id: '3', className: 'Lower Kindergarten - PP4+-A', subject: 'HINDI', totalLinked: 41 },
  { id: '4', className: 'Upper Kindergarten - PP5+-A', subject: 'MATHEMATICS', totalLinked: 54 },
  { id: '5', className: 'Upper Kindergarten - PP5+-A', subject: 'EVS', totalLinked: 54 },
  { id: '6', className: 'Upper Kindergarten - PP5+-A', subject: 'ENGLISH', totalLinked: 54 },
  { id: '7', className: 'Upper Kindergarten - PP5+-A', subject: 'HINDI', totalLinked: 54 },
  { id: '8', className: 'I-A', subject: 'MATHEMATICS', totalLinked: 60 },
  { id: '9', className: 'I-A', subject: 'EVS', totalLinked: 60 },
  { id: '10', className: 'I-A', subject: 'ENGLISH', totalLinked: 60 },
  { id: '11', className: 'I-A', subject: 'HINDI', totalLinked: 60 },
  { id: '12', className: 'X-A', subject: 'MATHEMATICS', totalLinked: 38 },
  { id: '13', className: 'X-A', subject: 'SCIENCE', totalLinked: 38 },
  { id: '14', className: 'X-A', subject: 'SOCIAL SCIENCE', totalLinked: 38 }
];

export function LinkStudentSubjectPage({ onNavigate }) {
  const [data, setData] = useState(INITIAL_LINKS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLink, setSelectedLink] = useState(null);
  const [linkedStudents, setLinkedStudents] = useState([]);

  const filteredData = data.filter(item =>
    item.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenLinkModal = (item) => {
    setSelectedLink(item);
    // Generate dummy roster of students for this class
    const roster = Array.from({ length: item.totalLinked }).map((_, i) => ({
      id: i + 1,
      rollNo: (i + 1).toString().padStart(2, '0'),
      scholarNo: `JD-2026-${100 + i + 1}`,
      name: `Student Name ${i + 1}`,
      father: `Father Name ${i + 1}`,
      isLinked: true
    }));
    setLinkedStudents(roster);
  };

  const handleToggleStudent = (id) => {
    setLinkedStudents(prev => prev.map(s => s.id === id ? { ...s, isLinked: !s.isLinked } : s));
  };

  const handleSaveLinks = () => {
    const activeCount = linkedStudents.filter(s => s.isLinked).length;
    setData(prev => prev.map(item => item.id === selectedLink.id ? { ...item, totalLinked: activeCount } : item));
    setSelectedLink(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1:1 Secondary Top Header Toolbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-bold text-slate-800 pr-3 border-r border-slate-300">
            Link Student With Subject
          </h1>
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <button onClick={() => onNavigate?.('/')} className="hover:text-indigo-600 flex items-center">
              <Home className="w-3.5 h-3.5 mr-1" />
            </button>
            <span>•</span>
            <span className="hover:text-indigo-600 cursor-pointer" onClick={() => onNavigate?.('/link-student-with-subject')}>Examination</span>
            <span>•</span>
            <span className="text-slate-800 font-medium">Link Student With Subject</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 max-w-7xl mx-auto w-full space-y-4">
        {/* Search Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search class or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Table View */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4 w-16 text-center">S.No.</th>
                  <th className="py-3 px-4 w-1/3">Class</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4 w-36 text-center">Total Linked</th>
                  <th className="py-3 px-4 w-32 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center font-bold text-slate-500">{index + 1}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{item.className}</td>
                    <td className="py-3.5 px-4 font-bold text-indigo-700">{item.subject}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {item.totalLinked} Students
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleOpenLinkModal(item)}
                        className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-md font-bold text-[11px]"
                      >
                        Manage Links
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Student Link Modal */}
      {selectedLink && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">
                  Link Students: {selectedLink.className}
                </h3>
                <p className="text-[11px] text-slate-500">Subject: <span className="font-bold text-indigo-600">{selectedLink.subject}</span></p>
              </div>
              <button onClick={() => setSelectedLink(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto space-y-2">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 sticky top-0">
                    <th className="py-2 px-3 w-12 text-center">Select</th>
                    <th className="py-2 px-3 w-16">Roll No</th>
                    <th className="py-2 px-3">Scholar No</th>
                    <th className="py-2 px-3">Student Name</th>
                    <th className="py-2 px-3">Father Name</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {linkedStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="py-2 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={s.isLinked}
                          onChange={() => handleToggleStudent(s.id)}
                          className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                        />
                      </td>
                      <td className="py-2 px-3 font-mono font-bold text-slate-600">{s.rollNo}</td>
                      <td className="py-2 px-3 font-semibold text-slate-700">{s.scholarNo}</td>
                      <td className="py-2 px-3 font-bold text-slate-900">{s.name}</td>
                      <td className="py-2 px-3 text-slate-500">{s.father}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="text-xs text-slate-600 font-semibold">
                Total Linked: <span className="text-indigo-600 font-bold">{linkedStudents.filter(s => s.isLinked).length}</span> of {linkedStudents.length}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedLink(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveLinks}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs"
                >
                  Save Links
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
