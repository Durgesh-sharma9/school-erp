import React, { useState } from 'react';
import { Home, Plus, Search, Trash2, X, Eye, FileText, Download, Calendar, GraduationCap } from 'lucide-react';
import { SCHOOL_CLASSES } from '../students/reports/studentReportsData';

export function PreviousYearPaperPage({ onNavigate }) {
  const [papersList, setPapersList] = useState([
    {
      id: 1,
      sNo: 1,
      title: 'CBSE Board Examination Class 10th Standard Mathematics Set-1',
      paperName: 'Mathematics Standard Board Paper 2024',
      className: 'X',
      year: '2024',
      fileName: 'CBSE_Class10_Math_2024_Set1.pdf'
    },
    {
      id: 2,
      sNo: 2,
      title: 'CBSE Board Examination Class 12th Physics Set-2 with Marking Scheme',
      paperName: 'Physics Theory Question Paper 2024',
      className: 'XII-NON-MEDICAL',
      year: '2024',
      fileName: 'CBSE_Class12_Physics_2024.pdf'
    },
    {
      id: 3,
      sNo: 3,
      title: 'Annual Examination Class 9th Science Question Paper',
      paperName: 'Science Summative Assessment Paper 2023',
      className: 'IX',
      year: '2023',
      fileName: 'Class9_Science_Annual_2023.pdf'
    },
    {
      id: 4,
      sNo: 4,
      title: 'CBSE Board Examination Class 10th Social Science Paper',
      paperName: 'Social Science All India Set-3',
      className: 'X',
      year: '2023',
      fileName: 'CBSE_Class10_SST_2023.pdf'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState(null);

  // Modal Form State (1:1 with UAB fields: Title, Select an class, Paper Name, Paper Year, Select File)
  const [formData, setFormData] = useState({
    title: '',
    className: 'X',
    paperName: '',
    year: '2024',
    fileName: ''
  });

  const filtered = papersList.filter(p =>
    !searchQuery ||
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.paperName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.year.toString().includes(searchQuery)
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, fileName: file.name }));
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.paperName) {
      alert('Please fill all mandatory fields: Title and Paper Name');
      return;
    }

    const newEntry = {
      ...formData,
      id: Date.now(),
      sNo: papersList.length + 1,
      fileName: formData.fileName || `${formData.paperName.replace(/\s+/g, '_')}_${formData.year}.pdf`
    };

    setPapersList(prev => [newEntry, ...prev]);
    setShowAddModal(false);
    setFormData({
      title: '',
      className: 'X',
      paperName: '',
      year: '2024',
      fileName: ''
    });
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this previous year question paper?')) {
      setPapersList(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      {/* Top Toolbar matching UAB */}
      <div className="bg-white border-b border-slate-200/80 px-4 md:px-8 py-3 flex items-center justify-between shadow-xs sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <h1 className="text-base md:text-lg font-semibold text-slate-800">
            Previous Year Questions
          </h1>
          <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400 pl-3 border-l border-slate-200">
            <button onClick={() => onNavigate && onNavigate('/')} className="hover:text-indigo-600">
              <Home className="w-3.5 h-3.5" />
            </button>
            <span>•</span>
            <span className="text-slate-500">Examination</span>
            <span>•</span>
            <span className="text-indigo-600 font-medium">Previous Year Questsions</span>
          </div>
        </div>

        {/* Purple Mini FAB */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="w-9 h-9 rounded-full bg-[#5c67f6] hover:bg-indigo-600 text-white flex items-center justify-center shadow-md hover:shadow-lg transition-transform hover:scale-105"
            title="Upload Previous Year Paper"
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
              Total Question Papers: <strong className="text-slate-900">{filtered.length}</strong>
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
                  <th className="py-3 px-4">TITLE</th>
                  <th className="py-3 px-4">PAPER NAME</th>
                  <th className="py-3 px-4">CLASS</th>
                  <th className="py-3 px-4">YEAR</th>
                  <th className="py-3 px-4 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.length > 0 ? (
                  filtered.map((r, i) => (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 text-slate-500">{i + 1}</td>
                      <td className="py-3 px-4 font-medium text-slate-900 max-w-sm truncate">
                        {r.title}
                      </td>
                      <td className="py-3 px-4 font-semibold text-indigo-600">
                        {r.paperName}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-800">{r.className}</td>
                      <td className="py-3 px-4 font-mono text-slate-700">{r.year}</td>
                      <td className="py-3 px-4 text-center space-x-2">
                        <button
                          onClick={() => setSelectedPreview(r)}
                          className="p-1 rounded text-indigo-600 hover:bg-indigo-50"
                          title="Preview / Download"
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
                    <td colSpan="6" className="text-center py-10 text-slate-400">
                      No Previous Year Papers Found !
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* PREVIOUS YEAR QUESTIONS ADD MODAL (1:1 with UAB fields) */}
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
              PREVIOUS YEAR QUESTIONS
            </h2>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Title*</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. CBSE 10th Standard Mathematics Set 1"
                  required
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Select an class*</label>
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
                  <label className="block text-slate-600 font-semibold mb-1">Paper Year*</label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    min="2000"
                    max="2030"
                    required
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Paper Name*</label>
                <input
                  type="text"
                  name="paperName"
                  value={formData.paperName}
                  onChange={handleInputChange}
                  placeholder="e.g. Mathematics Standard Board Paper"
                  required
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              {/* Select File (UAB field) */}
              <div className="border border-dashed border-slate-200 rounded-xl p-4 bg-slate-50/50">
                <label className="block text-slate-700 font-semibold mb-2">Select File*</label>
                <div className="flex items-center space-x-3">
                  <label className="cursor-pointer px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-50 transition-colors shadow-xs inline-flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    <span>Select File</span>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                    />
                  </label>
                  <span className="text-xs text-slate-500">
                    {formData.fileName || 'PDF or Word Documents only'}
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

      {/* Paper Preview / Download Modal */}
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
                <h3 className="font-bold text-slate-800 text-sm">{selectedPreview.paperName}</h3>
                <p className="text-xs text-slate-500">
                  Class {selectedPreview.className} • Year {selectedPreview.year}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600 mb-6">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="font-semibold block text-slate-700 mb-1">Title:</span>
                <p className="font-medium text-slate-900">{selectedPreview.title}</p>
              </div>

              <div className="mt-3 p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-center justify-between">
                <div className="flex items-center space-x-2 truncate">
                  <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span className="font-semibold text-slate-800 truncate">{selectedPreview.fileName}</span>
                </div>
                <button
                  onClick={() => alert(`Downloading paper: ${selectedPreview.fileName}`)}
                  className="flex items-center space-x-1 text-xs px-2.5 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shrink-0 font-medium"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
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
