import React, { useState } from 'react';
import { Home, Plus, Search, Trash2, X, Eye, FileText, Download, Calendar, User } from 'lucide-react';
import { SCHOOL_CLASSES } from '../students/reports/studentReportsData';

export function HomeworkPage({ onNavigate }) {
  const [homeworkList, setHomeworkList] = useState([
    {
      id: 1,
      sNo: 1,
      date: '2026-10-10',
      className: 'X',
      section: 'A',
      subject: 'Mathematics Standard',
      title: 'Exercise 4.2 Quadratic Equations All Questions',
      description: 'Solve question 1 to 6 in your homework notebook and show all working steps clearly.',
      createdBy: 'Admin / Rajesh Sharma',
      fileName: 'Homework_Math_Ex4.2.pdf'
    },
    {
      id: 2,
      sNo: 2,
      date: '2026-10-09',
      className: 'IX',
      section: 'A',
      subject: 'Science',
      title: 'Chapter 5 Cell Structure Diagram & Worksheet',
      description: 'Draw labeled diagrams of Plant Cell and Animal Cell in fair notebook.',
      createdBy: 'Teacher / Neha Gupta',
      fileName: 'Science_Cell_Homework.pdf'
    },
    {
      id: 3,
      sNo: 3,
      date: '2026-10-08',
      className: 'XII-NON-MEDICAL',
      section: 'A',
      subject: 'Physics',
      title: 'Numerical Problems on Faraday Laws',
      description: 'Complete questions 12 to 20 from NCERT textbook chapter on Electromagnetic Induction.',
      createdBy: 'Admin / Rajesh Sharma',
      fileName: null
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState(null);

  // Modal Form State (1:1 with UAB fields)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    className: 'X',
    section: 'A',
    subject: 'Mathematics Standard',
    title: '',
    description: '',
    fileName: ''
  });

  const filtered = homeworkList.filter(h =>
    !searchQuery ||
    h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.createdBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit.');
        return;
      }
      setFormData(prev => ({ ...prev, fileName: file.name }));
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) {
      alert('Please enter a title for the homework');
      return;
    }

    const newEntry = {
      ...formData,
      id: Date.now(),
      sNo: homeworkList.length + 1,
      createdBy: 'Admin / Current User',
      fileName: formData.fileName || 'Attached_Homework_Sheet.pdf'
    };

    setHomeworkList(prev => [newEntry, ...prev]);
    setShowAddModal(false);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      className: 'X',
      section: 'A',
      subject: 'Mathematics Standard',
      title: '',
      description: '',
      fileName: ''
    });
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this homework entry?')) {
      setHomeworkList(prev => prev.filter(h => h.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      {/* Top Toolbar matching UAB */}
      <div className="bg-white border-b border-slate-200/80 px-4 md:px-8 py-3 flex items-center justify-between shadow-xs sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <h1 className="text-base md:text-lg font-semibold text-slate-800">
            Home Work
          </h1>
          <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400 pl-3 border-l border-slate-200">
            <button onClick={() => onNavigate && onNavigate('/')} className="hover:text-indigo-600">
              <Home className="w-3.5 h-3.5" />
            </button>
            <span>•</span>
            <span className="text-slate-500">Students</span>
            <span>•</span>
            <span className="text-indigo-600 font-medium">Home Work</span>
          </div>
        </div>

        {/* Purple Mini FAB */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="w-9 h-9 rounded-full bg-[#5c67f6] hover:bg-indigo-600 text-white flex items-center justify-center shadow-md hover:shadow-lg transition-transform hover:scale-105"
            title="Add Home Work"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4">
        {/* Table Container */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 overflow-hidden">
          <div className="p-4 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-medium text-slate-600">
              Total Homework Assigned: <strong className="text-slate-900">{filtered.length}</strong>
            </span>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">S.NO.</th>
                  <th className="py-3 px-4">DATE</th>
                  <th className="py-3 px-4">CLASS</th>
                  <th className="py-3 px-4">SUBJECT</th>
                  <th className="py-3 px-4">TITLE</th>
                  <th className="py-3 px-4">CREATED BY</th>
                  <th className="py-3 px-4 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.length > 0 ? (
                  filtered.map((r, i) => (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 text-slate-500">{i + 1}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{r.date}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {r.className} - {r.section}
                      </td>
                      <td className="py-3 px-4 font-medium text-indigo-600">{r.subject}</td>
                      <td className="py-3 px-4 font-medium text-slate-800 max-w-sm truncate">
                        {r.title}
                      </td>
                      <td className="py-3 px-4 text-slate-600">{r.createdBy}</td>
                      <td className="py-3 px-4 text-center space-x-2">
                        <button
                          onClick={() => setSelectedPreview(r)}
                          className="p-1 rounded text-indigo-600 hover:bg-indigo-50"
                          title="Preview Homework"
                        >
                          <Eye className="w-4 h-4 inline" />
                        </button>
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="p-1 rounded text-rose-500 hover:bg-rose-50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-10 text-slate-400">
                      No Home Work Found !
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* HOME WORK ADD MODAL (1:1 with UAB fields) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-base font-bold text-slate-900 tracking-wide uppercase border-b pb-3 mb-4">
              HOME WORK
            </h2>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Date*</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Class*</label>
                  <select
                    name="className"
                    value={formData.className}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                  >
                    {SCHOOL_CLASSES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Section*</label>
                  <select
                    name="section"
                    value={formData.section}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                    <option value="ALL">All Sections</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Subject*</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                  >
                    <option value="Mathematics Standard">Mathematics Standard</option>
                    <option value="Science">Science</option>
                    <option value="Social Science">Social Science</option>
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="Computer Applications">Computer Applications</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Title*</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Chapter 4 Exercise 4.2 Questions 1-6"
                  required
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Description</label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Provide instructions or homework guidelines for students..."
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              {/* File Attachment UAB Style */}
              <div className="border border-dashed border-slate-200 rounded-xl p-4 bg-slate-50/50">
                <label className="block text-slate-700 font-semibold mb-2">Attachment</label>
                <div className="flex items-center space-x-3">
                  <label className="cursor-pointer px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-50 transition-colors shadow-xs inline-flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    <span>Browse</span>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept="image/*,.pdf"
                      className="hidden"
                    />
                  </label>
                  <span className="text-xs text-slate-500">
                    {formData.fileName || 'Image & PDF Files Only (Max 5MB)'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#5c67f6] hover:bg-indigo-600 text-white rounded-lg font-semibold shadow-md transition-colors"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Homework Preview Modal */}
      {selectedPreview && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedPreview(null)}
              className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3 mb-4 border-b pb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">{selectedPreview.title}</h3>
                <p className="text-xs text-slate-500">
                  {selectedPreview.className} • {selectedPreview.subject}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600 mb-6">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="font-semibold block text-slate-700 mb-1">Description / Instructions:</span>
                <p className="whitespace-pre-line">{selectedPreview.description || 'No description provided.'}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center space-x-1.5 text-slate-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Assigned Date: <strong>{selectedPreview.date}</strong></span>
                </div>
                <div className="flex items-center space-x-1.5 text-slate-500">
                  <User className="w-3.5 h-3.5" />
                  <span>Created By: <strong>{selectedPreview.createdBy}</strong></span>
                </div>
              </div>

              {selectedPreview.fileName && (
                <div className="mt-3 p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2 truncate">
                    <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span className="font-semibold text-slate-800 truncate">{selectedPreview.fileName}</span>
                  </div>
                  <button
                    onClick={() => alert(`Downloading attachment: ${selectedPreview.fileName}`)}
                    className="flex items-center space-x-1 text-xs px-2.5 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shrink-0 font-medium"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedPreview(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
