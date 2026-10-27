import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
  Home,
  Plus,
  Search,
  FileQuestion,
  Clock,
  BookOpen,
  Award,
  CheckCircle,
  X,
  Copy,
  Trash2,
  Edit,
  GraduationCap,
  Play,
  Users
} from 'lucide-react';
import { SCHOOL_CLASSES } from '../students/reports/studentReportsData';
import { DEFAULT_ASSESSMENTS, DEFAULT_ENQUIRIES } from './crmData';

export function CrmAssessmentsPage({ onNavigate }) {
  const [assessments, setAssessments] = useState(DEFAULT_ASSESSMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedForAssign, setSelectedForAssign] = useState(null);
  const [assignedStudent, setAssignedStudent] = useState(DEFAULT_ENQUIRIES[0].studentName);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    targetClass: 'X',
    subject: 'General Mathematics & Aptitude',
    durationMinutes: 45,
    totalMarks: 50,
    passingMarks: 25,
    questionsCount: 25,
    instructions: 'Multiple choice test. No negative marking. Calculator not permitted.'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error('Please enter a title for the assessment test');
      return;
    }

    const newAssessment = {
      ...formData,
      id: Date.now(),
      status: 'Active',
      totalAssigned: 0,
      totalCompleted: 0,
      avgScore: '0%'
    };

    setAssessments(prev => [newAssessment, ...prev]);
    setShowAddModal(false);
    setFormData({
      title: '',
      targetClass: 'X',
      subject: 'General Mathematics & Aptitude',
      durationMinutes: 45,
      totalMarks: 50,
      passingMarks: 25,
      questionsCount: 25,
      instructions: 'Multiple choice test. No negative marking.'
    });
  };

  const handleDuplicate = (id) => {
    const item = assessments.find(a => a.id === id);
    if (!item) return;
    const duplicated = {
      ...item,
      id: Date.now(),
      title: `${item.title} (Copy)`,
      totalAssigned: 0,
      totalCompleted: 0
    };
    setAssessments(prev => [duplicated, ...prev]);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this assessment test?')) {
      setAssessments(prev => prev.filter(a => a.id !== id));
    }
  };

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    alert(`Assessment test "${selectedForAssign.title}" successfully assigned to ${assignedStudent}! A test link SMS/Email has been dispatched.`);
    setSelectedForAssign(null);
  };

  const filtered = assessments.filter(a => {
    const matchSearch =
      !searchQuery ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchClass = classFilter === 'ALL' || a.targetClass === classFilter;
    return matchSearch && matchClass;
  });

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      {/* Top Breadcrumb Toolbar */}
      <div className="bg-white border-b border-slate-200/80 px-4 md:px-8 py-3 flex items-center justify-between shadow-xs sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <h1 className="text-base md:text-lg font-semibold text-slate-800">
            Admission Assessments & Entrance Tests
          </h1>
          <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400 pl-3 border-l border-slate-200">
            <button onClick={() => onNavigate && onNavigate('/')} className="hover:text-indigo-600">
              <Home className="w-3.5 h-3.5" />
            </button>
            <span>•</span>
            <button onClick={() => onNavigate && onNavigate('/crm')} className="hover:text-indigo-600">
              CRM
            </button>
            <span>•</span>
            <span className="text-indigo-600 font-medium">Assessments</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="h-9 px-3.5 rounded-full bg-[#5c67f6] hover:bg-indigo-600 text-white flex items-center space-x-1.5 shadow-md hover:shadow-lg transition-transform hover:scale-105 text-xs font-semibold"
          >
            <Plus className="w-4 h-4" />
            <span>Create Assessment</span>
          </button>
        </div>
      </div>

      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4">
        {/* Filter Bar */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-700">Available Tests:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              {filtered.length} Active Tests
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search assessments..."
                className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="text-xs py-1.5 px-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 text-slate-700 bg-white"
            >
              <option value="ALL">All Classes</option>
              {SCHOOL_CLASSES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Assessment Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(test => (
            <div
              key={test.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between hover:border-indigo-300 transition-all space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Class {test.targetClass}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {test.status}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm leading-snug">{test.title}</h3>
                <p className="text-xs text-indigo-600 font-medium mt-1">{test.subject}</p>

                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-center text-xs">
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Duration</span>
                    <span className="font-bold text-slate-800">{test.durationMinutes} mins</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Total Marks</span>
                    <span className="font-bold text-slate-800">{test.totalMarks}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Pass Marks</span>
                    <span className="font-bold text-emerald-600">{test.passingMarks}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-3 pt-2">
                  <span>Assigned: <strong>{test.totalAssigned}</strong></span>
                  <span>Completed: <strong>{test.totalCompleted}</strong></span>
                  <span>Avg Score: <strong>{test.avgScore}</strong></span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t flex items-center justify-between gap-2">
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleDuplicate(test.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100"
                    title="Duplicate Template"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(test.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                    title="Delete Test"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => setSelectedForAssign(test)}
                  className="px-3.5 py-1.5 bg-[#5c67f6] hover:bg-indigo-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Assign Test</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CREATE ASSESSMENT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-base font-bold text-slate-900 tracking-wide uppercase border-b pb-3 mb-4">
              CREATE ENTRANCE ASSESSMENT TEST
            </h2>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Assessment Test Title*</label>
                <input
                  type="text"
                  required
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Grade 10 Science & Math Diagnostic"
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Target Class*</label>
                  <select
                    name="targetClass"
                    value={formData.targetClass}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                  >
                    {SCHOOL_CLASSES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Subject / Domain*</label>
                  <input
                    type="text"
                    required
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="e.g. Mathematics"
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Duration (Min)*</label>
                  <input
                    type="number"
                    required
                    name="durationMinutes"
                    value={formData.durationMinutes}
                    onChange={handleInputChange}
                    min="10"
                    max="180"
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Total Marks*</label>
                  <input
                    type="number"
                    required
                    name="totalMarks"
                    value={formData.totalMarks}
                    onChange={handleInputChange}
                    min="10"
                    max="200"
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Pass Marks*</label>
                  <input
                    type="number"
                    required
                    name="passingMarks"
                    value={formData.passingMarks}
                    onChange={handleInputChange}
                    min="5"
                    max="100"
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Test Instructions for Student</label>
                <textarea
                  rows="3"
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleInputChange}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#5c67f6] hover:bg-indigo-600 text-white rounded-lg font-semibold shadow-md"
                >
                  Save Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGN TEST MODAL */}
      {selectedForAssign && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedForAssign(null)}
              className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-slate-900 text-sm mb-1">Assign Assessment to Enquiry</h3>
            <p className="text-xs text-slate-500 mb-4">{selectedForAssign.title}</p>

            <form onSubmit={handleAssignSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Select Registered Enquiry Applicant*</label>
                <select
                  value={assignedStudent}
                  onChange={(e) => setAssignedStudent(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                >
                  {DEFAULT_ENQUIRIES.map(enq => (
                    <option key={enq.id} value={enq.studentName}>
                      {enq.studentName} ({enq.enquiryId} - Class {enq.className})
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-indigo-50/60 p-3 rounded-lg border border-indigo-100 text-[11px] text-indigo-700 space-y-1">
                <p><strong>Note:</strong> An online test link with login passcode will be sent automatically to parent's registered mobile number via SMS and WhatsApp.</p>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setSelectedForAssign(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#5c67f6] hover:bg-indigo-600 text-white rounded-lg font-semibold shadow-md"
                >
                  Send Test Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
