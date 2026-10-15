import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Search,
  Home,
  CheckCircle2,
  Calendar,
  X,
  FileDown,
  Edit2
} from 'lucide-react';

const INITIAL_PRC_CLASSES = [
  { id: '1', className: 'I-A', term: 'Half Yearly Examination', openDays: 110, status: 'Active' },
  { id: '2', className: 'I-A', term: 'Annual Examination', openDays: 120, status: 'Active' },
  { id: '3', className: 'II-A', term: 'Half Yearly Examination', openDays: 110, status: 'Active' },
  { id: '4', className: 'II-A', term: 'Annual Examination', openDays: 120, status: 'Active' },
  { id: '5', className: 'X-A', term: 'Half Yearly Examination', openDays: 115, status: 'Active' },
  { id: '6', className: 'X-A', term: 'Annual Examination', openDays: 125, status: 'Active' }
];

export function PrcCommentPage({ onNavigate }) {
  const [data, setData] = useState(INITIAL_PRC_CLASSES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);
  const [studentComments, setStudentComments] = useState([]);

  const filteredData = data.filter(item =>
    item.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.term.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenStudentComments = (item) => {
    setSelectedClass(item);
    const mockRoster = [
      { id: '1', rollNo: '01', scholarNo: 'JD-101', name: 'Aarav Sharma', attendance: 104, height: '128 cm', weight: '26 kg', remark: 'Good, keeps participating actively.' },
      { id: '2', rollNo: '02', scholarNo: 'JD-102', name: 'Ananya Gupta', attendance: 108, height: '125 cm', weight: '24 kg', remark: 'Excellent student, consistently performs well.' },
      { id: '3', rollNo: '03', scholarNo: 'JD-103', name: 'Chirag Sethi', attendance: 98, height: '130 cm', weight: '27 kg', remark: 'Needs more focus on mathematics calculations.' },
      { id: '4', rollNo: '04', scholarNo: 'JD-104', name: 'Diya Choudhary', attendance: 110, height: '127 cm', weight: '25 kg', remark: 'Outstanding academic excellence and behavior.' }
    ];
    setStudentComments(mockRoster);
  };

  const handleCommentChange = (id, field, val) => {
    setStudentComments(prev => prev.map(s => s.id === id ? { ...s, [field]: val } : s));
  };

  const handleSaveAll = () => {
    setSelectedClass(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1:1 Secondary Top Header Toolbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-bold text-slate-800 pr-3 border-r border-slate-300">
            PRC Comment
          </h1>
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <button onClick={() => onNavigate?.('/')} className="hover:text-indigo-600 flex items-center">
              <Home className="w-3.5 h-3.5 mr-1" />
            </button>
            <span>•</span>
            <span className="hover:text-indigo-600 cursor-pointer" onClick={() => onNavigate?.('/prc-comment')}>Examination</span>
            <span>•</span>
            <span className="text-slate-800 font-medium">PRC Comment</span>
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
              placeholder="Search class or term..."
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
                  <th className="py-3 px-4 w-1/4">Class Name</th>
                  <th className="py-3 px-4">Term</th>
                  <th className="py-3 px-4 w-44 text-center">School Open Days</th>
                  <th className="py-3 px-4 w-36 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center font-bold text-slate-500">{index + 1}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{item.className}</td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">{item.term}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                        {item.openDays} Days
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleOpenStudentComments(item)}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg font-bold text-[11px]"
                      >
                        Enter Comments
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Student Comments Modal */}
      {selectedClass && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">
                  Report Card Comments & Attendance ({selectedClass.className})
                </h3>
                <p className="text-[11px] text-slate-500">
                  Term: {selectedClass.term} | Working Days: {selectedClass.openDays}
                </p>
              </div>
              <button onClick={() => setSelectedClass(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto space-y-3">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 sticky top-0">
                    <th className="py-2 px-3 w-16">Roll No</th>
                    <th className="py-2 px-3 w-36">Student Name</th>
                    <th className="py-2 px-3 w-24 text-center">Attendance</th>
                    <th className="py-2 px-3 w-24 text-center">Height</th>
                    <th className="py-2 px-3 w-24 text-center">Weight</th>
                    <th className="py-2 px-3">Teacher's PRC Remark</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentComments.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-mono font-bold text-slate-600">{s.rollNo}</td>
                      <td className="py-2 px-3 font-bold text-slate-900">{s.name}</td>
                      <td className="py-2 px-3 text-center">
                        <input
                          type="number"
                          max={selectedClass.openDays}
                          value={s.attendance}
                          onChange={(e) => handleCommentChange(s.id, 'attendance', e.target.value)}
                          className="w-16 px-1.5 py-1 border border-slate-300 rounded text-center font-bold"
                        />
                      </td>
                      <td className="py-2 px-3 text-center">
                        <input
                          type="text"
                          value={s.height}
                          onChange={(e) => handleCommentChange(s.id, 'height', e.target.value)}
                          className="w-18 px-1.5 py-1 border border-slate-300 rounded text-center"
                        />
                      </td>
                      <td className="py-2 px-3 text-center">
                        <input
                          type="text"
                          value={s.weight}
                          onChange={(e) => handleCommentChange(s.id, 'weight', e.target.value)}
                          className="w-18 px-1.5 py-1 border border-slate-300 rounded text-center"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={s.remark}
                          onChange={(e) => handleCommentChange(s.id, 'remark', e.target.value)}
                          className="w-full px-2 py-1 border border-slate-300 rounded"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-slate-200 flex items-center justify-end gap-2 bg-slate-50">
              <button
                type="button"
                onClick={() => setSelectedClass(null)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAll}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs"
              >
                Save All Comments
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
