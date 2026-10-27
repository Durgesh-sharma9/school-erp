import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Home, Plus, Search, CheckSquare, Menu, FileText, Download, Trash2, X, Eye } from 'lucide-react';
import { SCHOOL_CLASSES } from '../students/reports/studentReportsData';

export function StudyMaterialPage({ onNavigate }) {
  const [materials, setMaterials] = useState([
    {
      id: 1,
      sNo: 1,
      date: '2026-10-10',
      className: 'X',
      division: 'A',
      subject: 'Mathematics Standard',
      days: '7',
      type: 'Study Material',
      title: 'Chapter 4 Quadratic Equations Formulas and Notes',
      description: 'Detailed NCERT chapter notes with solved exemplar questions.',
      fileName: 'Quadratic_Equations_Notes_Ch4.pdf'
    },
    {
      id: 2,
      sNo: 2,
      date: '2026-10-09',
      className: 'XII-NON-MEDICAL',
      division: 'A',
      subject: 'Physics',
      days: '10',
      type: 'Assignment',
      title: 'Electromagnetic Induction Practice Worksheet',
      description: 'Practice questions for upcoming unit test.',
      fileName: 'EMI_Practice_Worksheet_XII.pdf'
    },
    {
      id: 3,
      sNo: 3,
      date: '2026-10-08',
      className: 'IX',
      division: 'A',
      subject: 'Science',
      days: '14',
      type: 'Syllabus',
      title: 'Term-1 Half Yearly Syllabus and Marks Breakdown',
      description: 'Complete chapterwise syllabus and weightage for Term 1.',
      fileName: 'Science_Term1_Syllabus_IX.pdf'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState(null);

  // Modal Form State
  const [formData, setFormData] = useState({
    type: 'Study Material',
    date: new Date().toISOString().split('T')[0],
    className: 'X',
    division: 'A',
    subject: 'Mathematics Standard',
    days: '7',
    title: '',
    description: '',
    fileName: 'Uploaded_Document.pdf'
  });

  const filtered = materials.filter(m =>
    !searchQuery ||
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.className.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error('Please enter a title for the study material');
      return;
    }

    const newEntry = {
      ...formData,
      id: Date.now(),
      sNo: materials.length + 1
    };

    setMaterials(prev => [newEntry, ...prev]);
    setShowAddModal(false);
    setFormData({
      type: 'Study Material',
      date: new Date().toISOString().split('T')[0],
      className: 'X',
      division: 'A',
      subject: 'Mathematics Standard',
      days: '7',
      title: '',
      description: '',
      fileName: 'Uploaded_Document.pdf'
    });
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this study material entry?')) {
      setMaterials(prev => prev.filter(m => m.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      {/* Top Toolbar */}
      <div className="bg-white border-b border-slate-200/80 px-4 md:px-8 py-3 flex items-center justify-between shadow-xs sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <h1 className="text-base md:text-lg font-semibold text-slate-800">
            Study Material
          </h1>
          <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400 pl-3 border-l border-slate-200">
            <button onClick={() => onNavigate && onNavigate('/')} className="hover:text-indigo-600">
              <Home className="w-3.5 h-3.5" />
            </button>
            <span>•</span>
            <span className="text-slate-500">Students</span>
            <span>•</span>
            <span className="text-indigo-600 font-medium">Study Material</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {/* Purple Mini FAB */}
          <button
            onClick={() => setShowAddModal(true)}
            className="w-9 h-9 rounded-full bg-[#5c67f6] hover:bg-indigo-600 text-white flex items-center justify-center shadow-md hover:shadow-lg transition-transform hover:scale-105"
            title="Add Study Material"
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
              Total Materials: <strong className="text-slate-900">{filtered.length}</strong>
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
                  <th className="py-3 px-4 text-center">DAYS</th>
                  <th className="py-3 px-4 text-center">TYPE</th>
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
                        {r.className} - {r.division}
                      </td>
                      <td className="py-3 px-4 font-medium text-indigo-600">{r.subject}</td>
                      <td className="py-3 px-4 font-medium text-slate-800 max-w-xs truncate">
                        {r.title}
                      </td>
                      <td className="py-3 px-4 text-center text-slate-600">{r.days}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">
                          {r.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center space-x-2">
                        <button
                          onClick={() => setSelectedPreview(r)}
                          className="p-1 rounded text-indigo-600 hover:bg-indigo-50"
                          title="Preview Document"
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
                    <td colSpan="8" className="text-center py-10 text-slate-400">
                      No Study Material Found !
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* STUDY MATERIAL ADD MODAL (1:1 with all extracted UAB fields) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-base font-bold text-slate-900 tracking-wide uppercase border-b pb-3 mb-4">
              STUDY MATERIAL
            </h2>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Type*</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                  >
                    <option value="Study Material">Study Material</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Syllabus">Syllabus</option>
                    <option value="Teaching Video">Teaching Video</option>
                    <option value="Time Table">Time Table</option>
                    <option value="Webinar">Webinar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Date*</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Class*</label>
                  <select
                    name="className"
                    value={formData.className}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    {SCHOOL_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Division*</label>
                  <select
                    name="division"
                    value={formData.division}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Days</label>
                  <input
                    type="number"
                    name="days"
                    value={formData.days}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Subject*</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Mathematics, Science, English..."
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Title*</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter material title..."
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Provide instructions or syllabus notes..."
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Upload Buttons matching UAB exactly: Browse Img, Browse PDF, Browse Doc, Browse PPT */}
              <div>
                <label className="block text-slate-600 font-semibold mb-2">Upload File</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, fileName: 'Image_Attachment.jpg' }))}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700"
                  >
                    Browse Img
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, fileName: 'Document_Attachment.pdf' }))}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-indigo-50 hover:bg-indigo-100 text-xs font-medium text-indigo-700"
                  >
                    Browse PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, fileName: 'Document_Attachment.docx' }))}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700"
                  >
                    Browse Doc
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, fileName: 'Presentation_Attachment.pptx' }))}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700"
                  >
                    Browse PPT
                  </button>
                </div>
                {formData.fileName && (
                  <p className="text-[11px] text-slate-500 mt-1.5">
                    Selected File: <strong className="text-slate-800">{formData.fileName}</strong>
                  </p>
                )}
              </div>

              <div className="flex justify-end pt-4 border-t space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#5c67f6] hover:bg-indigo-600 text-white font-semibold rounded-lg shadow-xs"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {selectedPreview && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedPreview(null)}
              className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{selectedPreview.title}</h3>
                  <p className="text-xs text-slate-500">
                    {selectedPreview.className}-{selectedPreview.division} • {selectedPreview.subject}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl text-xs space-y-2 text-slate-700">
                <p><strong>Type:</strong> {selectedPreview.type}</p>
                <p><strong>Published Date:</strong> {selectedPreview.date}</p>
                <p><strong>Validity:</strong> {selectedPreview.days} Days</p>
                <p><strong>Description:</strong> {selectedPreview.description}</p>
                <p><strong>Attached File:</strong> <span className="font-mono text-indigo-600 underline">{selectedPreview.fileName}</span></p>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  onClick={() => (() => {
                      const blob = new Blob([`Study Material: ${selectedPreview.title}\nClass: ${selectedPreview.className}\nSubject: ${selectedPreview.subject}\nDescription: ${selectedPreview.description || ''}`], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = selectedPreview.fileName || 'material.pdf';
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                      toast.success(`Downloaded ${selectedPreview.fileName}`);
                    })()}
                  className="px-4 py-2 bg-[#5c67f6] text-white text-xs font-semibold rounded-lg shadow-xs inline-flex items-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Document</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
