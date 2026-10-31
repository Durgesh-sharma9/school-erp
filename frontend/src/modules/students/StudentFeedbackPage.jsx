import React, { useState, useEffect, useMemo } from 'react';
import {
  MessageSquare,
  Star,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  ThumbsUp,
  Award,
  User,
  School,
  Building,
  Send,
  Printer,
  Download,
  Calendar,
  X,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Smile,
  Frown,
  Meh,
  Eye,
  RefreshCw,
  Home
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { tenantStore } from '../../services/tenantStore';

const CATEGORIES_STUDENT_TO_SCHOOL = [
  'All Categories',
  'Academics & Teaching',
  'Library & Study Resources',
  'Infrastructure & Smart Classes',
  'Cleanliness & Sanitation',
  'Sports & Extra-Curricular',
  'School Transport / Bus',
  'Cafeteria / Drinking Water',
  'Admin & Front Office Support',
  'Other Suggestions'
];

const CATEGORIES_SCHOOL_TO_STUDENT = [
  'All Categories',
  'Academic Progress & Excellence',
  'Classroom Conduct & Attentiveness',
  'Homework & Project Submission',
  'Discipline & Punctuality',
  'Sports & Physical Activity',
  'Arts, Music & Creativity',
  'Special Appreciation & Badge'
];

const RECOGNITION_BADGES = [
  'None',
  'Star Student 🌟',
  'Most Improved 🚀',
  'Punctual & Disciplined ⏰',
  'Creative Mind 🎨',
  'Helping Hand 🤝',
  'Academic Topper 🏆'
];

export function StudentFeedbackPage({ onNavigate }) {
  const { schoolId, user, role } = useAuth();
  const effectiveSchoolId = schoolId || 'sch_jd_intl';
  const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN';

  // Active top tab: 'student-to-school' | 'school-to-student' | 'analytics'
  const [activeTab, setActiveTab] = useState('student-to-school');

  // Feedbacks from tenantStore
  const [feedbacks, setFeedbacks] = useState(() => {
    return tenantStore.getFeedbacks(effectiveSchoolId) || [];
  });

  // Registered students for dropdown selection
  const [students, setStudents] = useState([]);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedClass, setSelectedClass] = useState('ALL');

  // Modals
  const [isSubmitStudentFbOpen, setIsSubmitStudentFbOpen] = useState(false);
  const [isSubmitSchoolRemarkOpen, setIsSubmitSchoolRemarkOpen] = useState(false);
  const [replyModalData, setReplyModalData] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyStatus, setReplyStatus] = useState('Action Taken');

  // Form State: Student ➔ School
  const [studentFbForm, setStudentFbForm] = useState({
    studentId: '',
    studentName: '',
    admNo: '',
    className: '',
    category: 'Academics & Teaching',
    subject: '',
    feedbackText: '',
    rating: 5,
    isAnonymous: false
  });

  // Form State: School ➔ Student
  const [schoolRemarkForm, setSchoolRemarkForm] = useState({
    studentId: '',
    studentName: '',
    admNo: '',
    className: '',
    teacherName: user?.name || 'Class Teacher',
    category: 'Academic Progress & Excellence',
    subject: '',
    feedbackText: '',
    rating: 5,
    badge: 'Star Student 🌟',
    isParentVisible: true
  });

  useEffect(() => {
    // Load feedbacks and students
    const fbList = tenantStore.getFeedbacks(effectiveSchoolId) || [];
    setFeedbacks(fbList);

    const stdList = tenantStore.getStudents(effectiveSchoolId) || [];
    setStudents(stdList);

    if (stdList.length > 0) {
      const first = stdList[0];
      setStudentFbForm(prev => ({
        ...prev,
        studentId: first.id || first.admNo,
        studentName: first.name || `${first.firstName || ''} ${first.lastName || ''}`.trim(),
        admNo: first.admNo || first.admissionNo || '',
        className: first.className || first.class_id || ''
      }));

      setSchoolRemarkForm(prev => ({
        ...prev,
        studentId: first.id || first.admNo,
        studentName: first.name || `${first.firstName || ''} ${first.lastName || ''}`.trim(),
        admNo: first.admNo || first.admissionNo || '',
        className: first.className || first.class_id || ''
      }));
    }
  }, [effectiveSchoolId]);

  // Handle student selection in student-to-school form
  const handleStudentSelectForFb = (val) => {
    const found = students.find(s => (s.id || s.admNo) === val);
    if (found) {
      setStudentFbForm(prev => ({
        ...prev,
        studentId: val,
        studentName: found.name || `${found.firstName || ''} ${found.lastName || ''}`.trim(),
        admNo: found.admNo || found.admissionNo || '',
        className: found.className || found.class_id || ''
      }));
    }
  };

  // Handle student selection in school-to-student form
  const handleStudentSelectForRemark = (val) => {
    const found = students.find(s => (s.id || s.admNo) === val);
    if (found) {
      setSchoolRemarkForm(prev => ({
        ...prev,
        studentId: val,
        studentName: found.name || `${found.firstName || ''} ${found.lastName || ''}`.trim(),
        admNo: found.admNo || found.admissionNo || '',
        className: found.className || found.class_id || ''
      }));
    }
  };

  // Filtered lists
  const studentToSchoolList = useMemo(() => {
    return feedbacks.filter(fb => {
      const isType = fb.direction === 'STUDENT_TO_SCHOOL' || fb.type === 'to_school';
      if (!isType) return false;

      const matchesSearch =
        (fb.studentName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (fb.subject || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (fb.feedbackText || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (fb.admNo || '').includes(searchQuery);

      const matchesCategory = selectedCategory === 'All Categories' || fb.category === selectedCategory;
      const matchesStatus = selectedStatus === 'ALL' || fb.status === selectedStatus;
      const matchesClass = selectedClass === 'ALL' || (fb.className || '').includes(selectedClass);

      return matchesSearch && matchesCategory && matchesStatus && matchesClass;
    });
  }, [feedbacks, searchQuery, selectedCategory, selectedStatus, selectedClass]);

  const schoolToStudentList = useMemo(() => {
    return feedbacks.filter(fb => {
      const isType = fb.direction === 'SCHOOL_TO_STUDENT' || fb.type === 'from_school';
      if (!isType) return false;

      const matchesSearch =
        (fb.studentName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (fb.subject || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (fb.feedbackText || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (fb.teacherName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (fb.admNo || '').includes(searchQuery);

      const matchesCategory = selectedCategory === 'All Categories' || fb.category === selectedCategory;
      const matchesClass = selectedClass === 'ALL' || (fb.className || '').includes(selectedClass);

      return matchesSearch && matchesCategory && matchesClass;
    });
  }, [feedbacks, searchQuery, selectedCategory, selectedClass]);

  // Submit Student Feedback
  const handleSaveStudentFb = (e) => {
    e.preventDefault();
    if (!studentFbForm.feedbackText || !studentFbForm.subject) {
      toast.error('Please enter Subject and Feedback details');
      return;
    }

    const newFb = tenantStore.addFeedback(effectiveSchoolId, {
      direction: 'STUDENT_TO_SCHOOL',
      type: 'to_school',
      studentName: studentFbForm.isAnonymous ? 'Anonymous Student' : (studentFbForm.studentName || 'Student'),
      admNo: studentFbForm.isAnonymous ? '-' : (studentFbForm.admNo || '-'),
      className: studentFbForm.className || 'General',
      category: studentFbForm.category,
      subject: studentFbForm.subject,
      feedbackText: studentFbForm.feedbackText,
      rating: studentFbForm.rating,
      status: 'Submitted',
      submittedBy: studentFbForm.isAnonymous ? 'Anonymous' : `Student (${studentFbForm.studentName})`
    });

    setFeedbacks(tenantStore.getFeedbacks(effectiveSchoolId));
    toast.success('Student feedback submitted to school administration!');
    setIsSubmitStudentFbOpen(false);
    setStudentFbForm(prev => ({ ...prev, subject: '', feedbackText: '', rating: 5 }));
  };

  // Submit School Remark
  const handleSaveSchoolRemark = (e) => {
    e.preventDefault();
    if (!schoolRemarkForm.feedbackText || !schoolRemarkForm.subject) {
      toast.error('Please enter Title and Remarks for the student');
      return;
    }

    const newFb = tenantStore.addFeedback(effectiveSchoolId, {
      direction: 'SCHOOL_TO_STUDENT',
      type: 'from_school',
      studentName: schoolRemarkForm.studentName || 'Student',
      admNo: schoolRemarkForm.admNo || '-',
      className: schoolRemarkForm.className || 'Class I - A',
      teacherName: schoolRemarkForm.teacherName || 'Faculty',
      category: schoolRemarkForm.category,
      subject: schoolRemarkForm.subject,
      feedbackText: schoolRemarkForm.feedbackText,
      rating: schoolRemarkForm.rating,
      badge: schoolRemarkForm.badge,
      status: 'Delivered',
      isParentVisible: schoolRemarkForm.isParentVisible
    });

    setFeedbacks(tenantStore.getFeedbacks(effectiveSchoolId));
    toast.success('Feedback & remarks recorded for the student!');
    setIsSubmitSchoolRemarkOpen(false);
    setSchoolRemarkForm(prev => ({ ...prev, subject: '', feedbackText: '', rating: 5 }));
  };

  // School Action / Reply on Student Feedback
  const handleSaveSchoolReply = (e) => {
    e.preventDefault();
    if (!replyModalData) return;

    tenantStore.updateFeedback(effectiveSchoolId, replyModalData.id, {
      status: replyStatus,
      schoolReply: replyText,
      repliedAt: new Date().toISOString().split('T')[0],
      repliedBy: user?.name || 'School Principal / Admin'
    });

    setFeedbacks(tenantStore.getFeedbacks(effectiveSchoolId));
    toast.success('School reply and action status saved!');
    setReplyModalData(null);
    setReplyText('');
  };

  // Statistics
  const avgStudentRating = useMemo(() => {
    const list = feedbacks.filter(f => f.direction === 'STUDENT_TO_SCHOOL' || f.type === 'to_school');
    if (!list.length) return '4.8';
    const sum = list.reduce((acc, curr) => acc + (Number(curr.rating) || 5), 0);
    return (sum / list.length).toFixed(1);
  }, [feedbacks]);

  const actionTakenCount = useMemo(() => {
    return feedbacks.filter(f => f.status === 'Action Taken' || f.status === 'Resolved').length;
  }, [feedbacks]);

  const schoolRemarksCount = useMemo(() => {
    return feedbacks.filter(f => f.direction === 'SCHOOL_TO_STUDENT' || f.type === 'from_school').length;
  }, [feedbacks]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 text-slate-800">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <button
              onClick={() => onNavigate?.('/dashboard')}
              className="hover:text-indigo-600 transition-colors flex items-center gap-1 font-medium"
            >
              <Home className="w-3.5 h-3.5" />
              Home
            </button>
            <span>/</span>
            <span>Student Management</span>
            <span>/</span>
            <span className="text-indigo-600 font-semibold">Student & School Feedback</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            Two-Way Student & School Feedback Hub
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Collect, respond to, and evaluate feedback between students, parents, and school administration.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSubmitStudentFbOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-indigo-700 bg-white hover:bg-indigo-50 border border-indigo-200 rounded-lg shadow-sm transition-all"
          >
            <User className="w-3.5 h-3.5 text-indigo-600" />
            + Student ➔ School Feedback
          </button>
          <button
            onClick={() => setIsSubmitSchoolRemarkOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all"
          >
            <School className="w-3.5 h-3.5" />
            + School ➔ Student Remark
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Student Satisfaction</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-2xl font-bold text-slate-900">{avgStudentRating}</span>
              <span className="text-amber-500 text-lg">★</span>
              <span className="text-[11px] text-slate-400 font-medium">/ 5.0</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Student ➔ School Submissions</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-bold text-indigo-600">{feedbacks.filter(f => f.direction === 'STUDENT_TO_SCHOOL' || f.type === 'to_school').length}</span>
              <span className="text-[11px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold">Active</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Action Taken & Resolved</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-bold text-emerald-600">{actionTakenCount}</span>
              <span className="text-[11px] text-slate-500 font-medium">Resolved Cases</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">School ➔ Student Remarks</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-bold text-purple-600">{schoolRemarksCount}</span>
              <span className="text-[11px] text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded font-semibold">Feedback Issued</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Segmented Top Navigation Tabs */}
      <div className="flex border-b border-slate-200 mb-6 bg-white rounded-t-xl px-4 pt-2 shadow-sm">
        <button
          onClick={() => { setActiveTab('student-to-school'); setSelectedCategory('All Categories'); }}
          className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'student-to-school'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <User className="w-4 h-4" />
          Student ➔ School Feedback
          <span className="ml-1 px-1.5 py-0.2 bg-indigo-50 text-indigo-700 rounded-full text-[10px]">
            {feedbacks.filter(f => f.direction === 'STUDENT_TO_SCHOOL' || f.type === 'to_school').length}
          </span>
        </button>

        <button
          onClick={() => { setActiveTab('school-to-student'); setSelectedCategory('All Categories'); }}
          className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'school-to-student'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <School className="w-4 h-4" />
          School ➔ Student Remarks & Guidance
          <span className="ml-1 px-1.5 py-0.2 bg-purple-50 text-purple-700 rounded-full text-[10px]">
            {schoolRemarksCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'analytics'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Satisfaction Analytics & Overview
        </button>
      </div>

      {/* TAB 1: Student to School Feedback */}
      {activeTab === 'student-to-school' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full md:max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by student name, adm no, topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {CATEGORIES_STUDENT_TO_SCHOOL.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="ALL">All Status</option>
                <option value="Submitted">Submitted / Pending</option>
                <option value="Acknowledged">Acknowledged</option>
                <option value="Under Review">Under Review</option>
                <option value="Action Taken">Action Taken</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>

          {/* Feedback Feed Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studentToSchoolList.length > 0 ? (
              studentToSchoolList.map(item => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md inline-block mb-1">
                          {item.category}
                        </span>
                        <h3 className="text-sm font-bold text-slate-800 leading-tight">
                          {item.subject}
                        </h3>
                      </div>
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i < (item.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Feedback Content */}
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/70 p-3 rounded-lg border border-slate-100 my-2">
                      "{item.feedbackText}"
                    </p>

                    {/* School Response Box (if any) */}
                    {item.schoolReply && (
                      <div className="mt-2.5 p-3 rounded-lg bg-emerald-50/70 border border-emerald-100 text-xs">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-800 mb-1">
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            School Response & Action Taken:
                          </span>
                          <span className="text-[10px] text-emerald-600 font-normal">
                            {item.repliedAt || item.date}
                          </span>
                        </div>
                        <p className="text-emerald-900 leading-relaxed">
                          {item.schoolReply}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Footer Meta & Actions */}
                  <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="text-[11px] text-slate-500">
                      From: <strong className="text-slate-700">{item.studentName}</strong>
                      {item.className ? ` (${item.className})` : ''} • {item.date}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        item.status === 'Resolved' || item.status === 'Action Taken'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'Under Review'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {item.status || 'Submitted'}
                      </span>

                      {isAdmin && (
                        <button
                          onClick={() => {
                            setReplyModalData(item);
                            setReplyText(item.schoolReply || '');
                            setReplyStatus(item.status || 'Action Taken');
                          }}
                          className="px-2.5 py-1 text-[11px] font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
                        >
                          {item.schoolReply ? 'Edit Reply' : 'Add Reply / Action'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 py-12 text-center text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="font-semibold text-sm">No Student Feedback Matching Current Filters</p>
                <p className="text-xs text-slate-400 mt-1">Click "+ Student ➔ School Feedback" to record feedback.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: School to Student Remarks & Guidance */}
      {activeTab === 'school-to-student' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full md:max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search student, teacher, topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {CATEGORIES_SCHOOL_TO_STUDENT.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {schoolToStudentList.length > 0 ? (
              schoolToStudentList.map(item => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-purple-100 shadow-sm p-4 hover:shadow-md transition-shadow relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full pointer-events-none -z-0 opacity-50" />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                            {item.category}
                          </span>
                          {item.badge && item.badge !== 'None' && (
                            <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-bold text-slate-800">
                          {item.subject}
                        </h3>
                      </div>

                      <div className="flex items-center gap-0.5 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i < (item.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="p-3 bg-purple-50/40 rounded-lg border border-purple-100 my-2.5">
                      <p className="text-xs text-slate-700 leading-relaxed font-normal">
                        "{item.feedbackText}"
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <div>
                        For: <strong className="text-slate-800">{item.studentName}</strong> ({item.className})
                      </div>
                      <div className="text-[11px]">
                        By: <span className="font-semibold text-indigo-700">{item.teacherName || 'Faculty'}</span> • {item.date}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 py-12 text-center text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
                <Award className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="font-semibold text-sm">No Teacher Remarks Issued Yet</p>
                <p className="text-xs text-slate-400 mt-1">Click "+ School ➔ Student Remark" to issue performance guidance or appreciation.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Analytics & Satisfaction Overview */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
              Overall School Sentiment
            </h3>

            <div className="text-center py-4 bg-amber-50/50 rounded-xl border border-amber-100">
              <div className="text-4xl font-extrabold text-slate-900">{avgStudentRating}</div>
              <div className="flex justify-center gap-1 my-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-amber-900 font-medium">Based on student & parent evaluations</p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>5 Star (Excellent)</span>
                <span className="font-semibold text-slate-800">78%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full w-[78%]" />
              </div>

              <div className="flex justify-between text-slate-600 pt-1">
                <span>4 Star (Good)</span>
                <span className="font-semibold text-slate-800">18%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-indigo-500 h-2 rounded-full w-[18%]" />
              </div>

              <div className="flex justify-between text-slate-600 pt-1">
                <span>3 Star (Average)</span>
                <span className="font-semibold text-slate-800">4%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full w-[4%]" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-indigo-600" />
              Departmental Satisfaction Breakdown
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-slate-700">Academics & Teaching</span>
                  <span className="font-bold text-emerald-600">4.9 ★</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div className="bg-emerald-500 h-1.5 rounded-full w-[96%]" />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-slate-700">Cleanliness & Hygiene</span>
                  <span className="font-bold text-emerald-600">4.8 ★</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div className="bg-emerald-500 h-1.5 rounded-full w-[94%]" />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-slate-700">Library & Study Resources</span>
                  <span className="font-bold text-indigo-600">4.6 ★</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div className="bg-indigo-500 h-1.5 rounded-full w-[90%]" />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-slate-700">Sports & Ground Facilities</span>
                  <span className="font-bold text-indigo-600">4.7 ★</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div className="bg-indigo-500 h-1.5 rounded-full w-[92%]" />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-slate-700">School Bus & Transport</span>
                  <span className="font-bold text-amber-600">4.4 ★</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div className="bg-amber-500 h-1.5 rounded-full w-[85%]" />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-slate-700">Administrative Support</span>
                  <span className="font-bold text-emerald-600">4.8 ★</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div className="bg-emerald-500 h-1.5 rounded-full w-[95%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: Submit Student ➔ School Feedback */}
      {isSubmitStudentFbOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-600" />
                Submit Student ➔ School Feedback
              </h3>
              <button
                onClick={() => setIsSubmitStudentFbOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveStudentFb} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Student</label>
                <select
                  value={studentFbForm.studentId}
                  onChange={(e) => handleStudentSelectForFb(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {students.map(s => (
                    <option key={s.id || s.admNo} value={s.id || s.admNo}>
                      {s.name || `${s.firstName || ''} ${s.lastName || ''}`.trim()} (Adm: {s.admNo || s.admissionNo}, Class: {s.className})
                    </option>
                  ))}
                  {students.length === 0 && (
                    <option value="1001">Aarav Sharma (Adm: 1001, Class X-A)</option>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={studentFbForm.category}
                    onChange={(e) => setStudentFbForm({ ...studentFbForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    {CATEGORIES_STUDENT_TO_SCHOOL.filter(c => c !== 'All Categories').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Overall Rating</label>
                  <div className="flex items-center gap-1 pt-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setStudentFbForm({ ...studentFbForm, rating: star })}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= studentFbForm.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 font-bold text-slate-700">{studentFbForm.rating} / 5</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Subject / Topic <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Science Lab Timings / Library Books Availability"
                  value={studentFbForm.subject}
                  onChange={(e) => setStudentFbForm({ ...studentFbForm, subject: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Detailed Feedback / Suggestion <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Share details of experience or constructive suggestion for the school..."
                  value={studentFbForm.feedbackText}
                  onChange={(e) => setStudentFbForm({ ...studentFbForm, feedbackText: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="anonymousCheck"
                  checked={studentFbForm.isAnonymous}
                  onChange={(e) => setStudentFbForm({ ...studentFbForm, isAnonymous: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="anonymousCheck" className="text-slate-600 text-xs cursor-pointer">
                  Submit anonymously (Name will not be displayed on public boards)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSubmitStudentFbOpen(false)}
                  className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
                >
                  Submit Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Submit School ➔ Student Remark */}
      {isSubmitSchoolRemarkOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-purple-50/50">
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-600" />
                Issue School ➔ Student Remark / Guidance
              </h3>
              <button
                onClick={() => setIsSubmitSchoolRemarkOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSchoolRemark} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Student</label>
                <select
                  value={schoolRemarkForm.studentId}
                  onChange={(e) => handleStudentSelectForRemark(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                >
                  {students.map(s => (
                    <option key={s.id || s.admNo} value={s.id || s.admNo}>
                      {s.name || `${s.firstName || ''} ${s.lastName || ''}`.trim()} (Adm: {s.admNo || s.admissionNo}, Class: {s.className})
                    </option>
                  ))}
                  {students.length === 0 && (
                    <option value="1002">Dev Sharma (Adm: 1002, Class I - A)</option>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={schoolRemarkForm.category}
                    onChange={(e) => setSchoolRemarkForm({ ...schoolRemarkForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    {CATEGORIES_SCHOOL_TO_STUDENT.filter(c => c !== 'All Categories').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Recognition Badge</label>
                  <select
                    value={schoolRemarkForm.badge}
                    onChange={(e) => setSchoolRemarkForm({ ...schoolRemarkForm, badge: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    {RECOGNITION_BADGES.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Remark Title / Headline <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Excellent Reading Fluency / Consistent Homework Effort"
                  value={schoolRemarkForm.subject}
                  onChange={(e) => setSchoolRemarkForm({ ...schoolRemarkForm, subject: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Teacher Remarks & Feedback Details <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Write clear, constructive feedback or appreciation for the student..."
                  value={schoolRemarkForm.feedbackText}
                  onChange={(e) => setSchoolRemarkForm({ ...schoolRemarkForm, feedbackText: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Faculty / Evaluator</label>
                  <input
                    type="text"
                    value={schoolRemarkForm.teacherName}
                    onChange={(e) => setSchoolRemarkForm({ ...schoolRemarkForm, teacherName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Score / Rating</label>
                  <div className="flex items-center gap-1 pt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setSchoolRemarkForm({ ...schoolRemarkForm, rating: star })}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= schoolRemarkForm.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSubmitSchoolRemarkOpen(false)}
                  className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm"
                >
                  Issue Feedback Remark
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Admin Reply & Action Taken */}
      {replyModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-indigo-50/50">
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                School Response & Action Taken
              </h3>
              <button
                onClick={() => setReplyModalData(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSchoolReply} className="p-5 space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="font-semibold text-indigo-700">{replyModalData.category}: </span>
                <span className="font-bold text-slate-800">{replyModalData.subject}</span>
                <p className="text-slate-600 mt-1 italic">"{replyModalData.feedbackText}"</p>
                <div className="text-[10px] text-slate-400 mt-1">
                  Submitted by {replyModalData.studentName} on {replyModalData.date}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status Update</label>
                <select
                  value={replyStatus}
                  onChange={(e) => setReplyStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Under Review">Under Review</option>
                  <option value="Action Taken">Action Taken</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Acknowledged">Acknowledged</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  School Reply / Action Details <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Explain the step taken by administration or guidance for the student..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setReplyModalData(null)}
                  className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
                >
                  Save Response
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
