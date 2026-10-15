import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Plus,
  Search,
  Home,
  X,
  Edit2,
  Trash2,
  FileDown
} from 'lucide-react';

const INITIAL_EXAM_NAMES = [
  { id: '1', className: 'I', term: 'Half Yearly Examination', exams: ['Unit Test 1', 'Periodic Test 1', 'Half Yearly Theory'] },
  { id: '2', className: 'I', term: 'Annual Examination', exams: ['Unit Test 2', 'Periodic Test 2', 'Annual Theory'] },
  { id: '3', className: 'II', term: 'Half Yearly Examination', exams: ['Unit Test 1', 'Half Yearly Exam'] },
  { id: '4', className: 'II', term: 'Annual Examination', exams: ['Unit Test 2', 'Annual Exam'] },
  { id: '5', className: 'X', term: 'Half Yearly Examination', exams: ['Periodic Test 1', 'Periodic Test 2', 'Half Yearly Theory', 'Practical'] },
  { id: '6', className: 'X', term: 'Annual Examination', exams: ['Pre-Board 1', 'Pre-Board 2', 'Board Exam'] },
  { id: '7', className: 'XII-HUMANITIES', term: 'Half Yearly Examination', exams: ['UT 1', 'Half Yearly Exam'] },
  { id: '8', className: 'XII-HUMANITIES', term: 'Pre- Board Examinations', exams: ['Pre-Board 1', 'Pre-Board 2'] }
];

export function ExamNamesPage({ onNavigate }) {
  const [data, setData] = useState(INITIAL_EXAM_NAMES);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formClass, setFormClass] = useState('I');
  const [formTerm, setFormTerm] = useState('Half Yearly Examination');
  const [formExams, setFormExams] = useState(['Unit Test 1', 'Periodic Test 1']);
  const [newExamInput, setNewExamInput] = useState('');

  const filteredData = data.filter(item =>
    item.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.exams.some(e => e.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormClass('I');
    setFormTerm('Half Yearly Examination');
    setFormExams(['Unit Test 1']);
    setNewExamInput('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormClass(item.className);
    setFormTerm(item.term);
    setFormExams([...item.exams]);
    setNewExamInput('');
    setIsModalOpen(true);
  };

  const handleAddExam = () => {
    if (newExamInput.trim() && !formExams.includes(newExamInput.trim())) {
      setFormExams([...formExams, newExamInput.trim()]);
      setNewExamInput('');
    }
  };

  const handleRemoveExam = (nameToRemove) => {
    setFormExams(formExams.filter(e => e !== nameToRemove));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingItem) {
      setData(prev => prev.map(item => item.id === editingItem.id ? { ...item, className: formClass, term: formTerm, exams: formExams } : item));
    } else {
      const newItem = {
        id: Date.now().toString(),
        className: formClass,
        term: formTerm,
        exams: formExams
      };
      setData(prev => [newItem, ...prev]);
    }
    setIsModalOpen(false);
  };

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["S.No,Class,Term,Exams"].concat(
        data.map((d, i) => `"${i + 1}","${d.className}","${d.term}","${d.exams.join(', ')}"`)
      ).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "exam_names.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1:1 Secondary Top Header Toolbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-bold text-slate-800 pr-3 border-r border-slate-300">
            Exam Name
          </h1>
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <button onClick={() => onNavigate?.('/')} className="hover:text-indigo-600 flex items-center">
              <Home className="w-3.5 h-3.5 mr-1" />
            </button>
            <span>•</span>
            <span className="hover:text-indigo-600 cursor-pointer" onClick={() => onNavigate?.('/exam-names')}>Examination</span>
            <span>•</span>
            <span className="text-slate-800 font-medium">Exam Name</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={exportCSV}
            title="Export CSV"
            className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 text-xs font-semibold flex items-center gap-1.5"
          >
            <FileDown className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 max-w-7xl mx-auto w-full space-y-4">
        {/* Search & Actions Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search class, term, or exam..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleOpenAdd}
              className="w-9 h-9 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-sm transition-transform active:scale-95"
              title="Add Exam Name"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Table View */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4 w-16 text-center">S.No.</th>
                  <th className="py-3 px-4 w-1/5">Class</th>
                  <th className="py-3 px-4 w-1/4">Term</th>
                  <th className="py-3 px-4">Exams</th>
                  <th className="py-3 px-4 w-28 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center font-bold text-slate-500">{index + 1}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{item.className}</td>
                    <td className="py-3.5 px-4 text-slate-600">{item.term}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1.5">
                        {item.exams.map((e, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100"
                          >
                            {e}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 hover:bg-slate-100 rounded text-slate-600 hover:text-indigo-600"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setData(prev => prev.filter(d => d.id !== item.id))}
                          className="p-1.5 hover:bg-red-50 rounded text-slate-400 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-10 text-slate-400">
                      No exam names found matching criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm">
                {editingItem ? 'Edit Exam Name' : 'Add Exam Name'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-600 mb-1">Class *</label>
                <select
                  value={formClass}
                  onChange={(e) => setFormClass(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white font-semibold"
                >
                  <option value="Nursery - PP3+">Nursery - PP3+</option>
                  <option value="I">Class I</option>
                  <option value="II">Class II</option>
                  <option value="III">Class III</option>
                  <option value="IV">Class IV</option>
                  <option value="V">Class V</option>
                  <option value="VI">Class VI</option>
                  <option value="VII">Class VII</option>
                  <option value="VIII">Class VIII</option>
                  <option value="IX">Class IX</option>
                  <option value="X">Class X</option>
                  <option value="XI-COMMERCE">XI-COMMERCE</option>
                  <option value="XII-HUMANITIES">XII-HUMANITIES</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Term *</label>
                <select
                  value={formTerm}
                  onChange={(e) => setFormTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white font-semibold"
                >
                  <option value="Half Yearly Examination">Half Yearly Examination</option>
                  <option value="Annual Examination">Annual Examination</option>
                  <option value="Pre- Board Examinations">Pre- Board Examinations</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Exams List *</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="e.g. Unit Test 1, Theory, Viva"
                    value={newExamInput}
                    onChange={(e) => setNewExamInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleAddExam}
                    className="px-3 py-1.5 bg-emerald-50 text-emerald-700 font-bold rounded-lg border border-emerald-200 hover:bg-emerald-100"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 min-h-[40px] p-2 bg-slate-50 border border-slate-200 rounded-lg">
                  {formExams.map((exam, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-slate-300 text-slate-700 font-medium"
                    >
                      {exam}
                      <button
                        type="button"
                        onClick={() => handleRemoveExam(exam)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {formExams.length === 0 && (
                    <span className="text-slate-400 italic">No exams added.</span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-xs"
                >
                  Save Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
