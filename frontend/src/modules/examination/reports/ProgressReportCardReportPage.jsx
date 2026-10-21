import React, { useState, useEffect, useRef } from 'react';
import {
  Award,
  Printer,
  RotateCcw,
  Plus,
  Trash2,
  Sparkles,
  Edit3,
  Columns,
  Eye,
  CheckCircle2,
  Save,
  Download,
  School,
  GraduationCap,
  Calendar,
  FileText,
  User,
  Sliders,
  Check,
  RefreshCw,
  LayoutGrid,
  Search,
  ChevronLeft,
  ChevronRight,
  Database,
  ArrowRight,
  Zap,
  CheckCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import JdInternationalMarksheet from './components/JdInternationalMarksheet';

// Default Fallback Sample Student from J D International School
const DEFAULT_STUDENT = {
  id: 'std_demo_1',
  name: 'AARAV SHARMA',
  fatherName: 'MANOJ SHARMA',
  motherName: 'POOJA SHARMA',
  class: 'Class VII',
  admissionNo: '10964/21',
  rollNo: '24',
  dob: '14/08/2012',
  photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  hyPresent: 110,
  hyTotal: 115,
  annPresent: 115,
  annTotal: 120,
  promotion: 'Class : VIII',
  resultStatus: 'Passed',
  teacherRemarks: '🌟 Extra-ordinary academic performance & exemplary discipline throughout the academic session.',
  coScholasticGrades: {
    'ART EDUCATION': 'A1',
    'ART EDUCATION_TERM2': 'A1',
    'WORK EDUCATION': 'A1',
    'WORK EDUCATION_TERM2': 'A1',
    'HEALTH & PHYSICAL EDUCATION': 'A1',
    'HEALTH & PHYSICAL EDUCATION_TERM2': 'A1',
    'ICT': 'A1',
    'ICT_TERM2': 'A1',
    'DISCIPLINE': 'A1',
    'DISCIPLINE_TERM2': 'A1'
  },
  subjects: [
    { name: 'ENGLISH', pa1: 9, nb1: 5, sea1: 5, hy: 74, pa2: 10, nb2: 5, sea2: 5, annual: 76 },
    { name: 'HINDI', pa1: 9, nb1: 5, sea1: 4, hy: 72, pa2: 9, nb2: 5, sea2: 5, annual: 75 },
    { name: 'MATHEMATICS', pa1: 10, nb1: 5, sea1: 5, hy: 78, pa2: 10, nb2: 5, sea2: 5, annual: 79 },
    { name: 'SCIENCE', pa1: 9, nb1: 4, sea1: 5, hy: 71, pa2: 10, nb2: 5, sea2: 5, annual: 76 },
    { name: 'SOCIAL SCIENCE', pa1: 9, nb1: 5, sea1: 4, hy: 70, pa2: 9, nb2: 5, sea2: 5, annual: 74 },
    { name: 'SANSKRIT', pa1: 10, nb1: 5, sea1: 5, hy: 75, pa2: 10, nb2: 5, sea2: 5, annual: 78 },
    { name: 'COMPUTER', pa1: 10, nb1: 5, sea1: 5, hy: 79, pa2: 10, nb2: 5, sea2: 5, annual: 80 }
  ]
};

// Built-in Database Student Pool for Instant Auto-Fetch & Testing
const DEMO_DATABASE_STUDENTS = [
  {
    id: 'std_jd_1',
    admNo: '10964/21',
    rollNo: '24',
    firstName: 'AARAV',
    lastName: 'SHARMA',
    fatherName: 'MANOJ SHARMA',
    motherName: 'POOJA SHARMA',
    className: 'Class VII',
    section: 'A',
    dob: '2012-08-14',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    marksProfile: {
      hyPresent: 110,
      hyTotal: 115,
      annPresent: 115,
      annTotal: 120,
      promotion: 'Class : VIII',
      resultStatus: 'Passed',
      teacherRemarks: '🌟 Extra-ordinary academic performance & exemplary discipline throughout the academic session.',
      subjects: [
        { name: 'ENGLISH', pa1: 9, nb1: 5, sea1: 5, hy: 74, pa2: 10, nb2: 5, sea2: 5, annual: 76 },
        { name: 'HINDI', pa1: 9, nb1: 5, sea1: 4, hy: 72, pa2: 9, nb2: 5, sea2: 5, annual: 75 },
        { name: 'MATHEMATICS', pa1: 10, nb1: 5, sea1: 5, hy: 78, pa2: 10, nb2: 5, sea2: 5, annual: 79 },
        { name: 'SCIENCE', pa1: 9, nb1: 4, sea1: 5, hy: 71, pa2: 10, nb2: 5, sea2: 5, annual: 76 },
        { name: 'SOCIAL SCIENCE', pa1: 9, nb1: 5, sea1: 4, hy: 70, pa2: 9, nb2: 5, sea2: 5, annual: 74 },
        { name: 'SANSKRIT', pa1: 10, nb1: 5, sea1: 5, hy: 75, pa2: 10, nb2: 5, sea2: 5, annual: 78 },
        { name: 'COMPUTER', pa1: 10, nb1: 5, sea1: 5, hy: 79, pa2: 10, nb2: 5, sea2: 5, annual: 80 }
      ]
    }
  },
  {
    id: 'std_jd_2',
    admNo: 'A135',
    rollNo: '2',
    firstName: 'ADVIK',
    lastName: 'RAO',
    fatherName: 'PRADEEP RAO',
    motherName: 'PRIYANKA RAO',
    className: 'Class I',
    section: 'A',
    dob: '2019-07-20',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    marksProfile: {
      hyPresent: 105,
      hyTotal: 110,
      annPresent: 112,
      annTotal: 118,
      promotion: 'Class : II',
      resultStatus: 'Passed',
      teacherRemarks: '📚 Sincere, obedient and attentive in class lessons. Great progress in reading.',
      subjects: [
        { name: 'ENGLISH', pa1: 10, nb1: 5, sea1: 5, hy: 76, pa2: 10, nb2: 5, sea2: 5, annual: 78 },
        { name: 'HINDI', pa1: 8, nb1: 5, sea1: 4, hy: 70, pa2: 9, nb2: 5, sea2: 4, annual: 72 },
        { name: 'MATHEMATICS', pa1: 10, nb1: 5, sea1: 5, hy: 80, pa2: 10, nb2: 5, sea2: 5, annual: 80 },
        { name: 'EVS', pa1: 9, nb1: 5, sea1: 5, hy: 75, pa2: 9, nb2: 5, sea2: 5, annual: 77 },
        { name: 'COMPUTER', pa1: 10, nb1: 5, sea1: 5, hy: 78, pa2: 10, nb2: 5, sea2: 5, annual: 79 },
        { name: 'GENERAL KNOWLEDGE', pa1: 9, nb1: 5, sea1: 5, hy: 72, pa2: 9, nb2: 5, sea2: 5, annual: 75 }
      ]
    }
  },
  {
    id: 'std_jd_3',
    admNo: '2059',
    rollNo: '14',
    firstName: 'AADHYA',
    lastName: 'CHOUDHARY',
    fatherName: 'RAMESH CHOUDHARY',
    motherName: 'SUNITA CHOUDHARY',
    className: 'Class X',
    section: 'A',
    dob: '2010-03-10',
    photoUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=200&auto=format&fit=crop&q=80',
    marksProfile: {
      hyPresent: 112,
      hyTotal: 115,
      annPresent: 116,
      annTotal: 120,
      promotion: 'Class : XI-MEDICAL',
      resultStatus: 'Passed with First Division',
      teacherRemarks: '🎯 Sharp analytical mindset with outstanding distinction in Science and Mathematics.',
      subjects: [
        { name: 'ENGLISH COMMUNICATIVE', pa1: 10, nb1: 5, sea1: 5, hy: 77, pa2: 10, nb2: 5, sea2: 5, annual: 79 },
        { name: 'HINDI COURSE-A', pa1: 9, nb1: 5, sea1: 5, hy: 74, pa2: 9, nb2: 5, sea2: 5, annual: 76 },
        { name: 'MATHEMATICS STANDARD', pa1: 10, nb1: 5, sea1: 5, hy: 79, pa2: 10, nb2: 5, sea2: 5, annual: 80 },
        { name: 'SCIENCE & TECHNOLOGY', pa1: 10, nb1: 5, sea1: 5, hy: 78, pa2: 10, nb2: 5, sea2: 5, annual: 80 },
        { name: 'SOCIAL SCIENCE', pa1: 9, nb1: 5, sea1: 4, hy: 73, pa2: 9, nb2: 5, sea2: 5, annual: 75 },
        { name: 'INFORMATION TECHNOLOGY', pa1: 10, nb1: 5, sea1: 5, hy: 79, pa2: 10, nb2: 5, sea2: 5, annual: 80 }
      ]
    }
  },
  {
    id: 'std_jd_4',
    admNo: '10964/45',
    rollNo: '08',
    firstName: 'DEV',
    lastName: 'KAPOOR',
    fatherName: 'SUNIL KAPOOR',
    motherName: 'NEELAM KAPOOR',
    className: 'Class VII',
    section: 'A',
    dob: '2012-11-25',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    marksProfile: {
      hyPresent: 98,
      hyTotal: 115,
      annPresent: 102,
      annTotal: 120,
      promotion: 'Class : VIII',
      resultStatus: 'Passed',
      teacherRemarks: '📈 Good progress shown; capable of achieving even higher distinction with regular revision.',
      subjects: [
        { name: 'ENGLISH', pa1: 8, nb1: 4, sea1: 4, hy: 65, pa2: 8, nb2: 4, sea2: 4, annual: 68 },
        { name: 'HINDI', pa1: 8, nb1: 4, sea1: 4, hy: 64, pa2: 8, nb2: 4, sea2: 4, annual: 66 },
        { name: 'MATHEMATICS', pa1: 9, nb1: 5, sea1: 4, hy: 72, pa2: 9, nb2: 5, sea2: 5, annual: 74 },
        { name: 'SCIENCE', pa1: 8, nb1: 4, sea1: 4, hy: 68, pa2: 9, nb2: 4, sea2: 4, annual: 70 },
        { name: 'SOCIAL SCIENCE', pa1: 7, nb1: 4, sea1: 4, hy: 62, pa2: 8, nb2: 4, sea2: 4, annual: 65 },
        { name: 'SANSKRIT', pa1: 8, nb1: 4, sea1: 4, hy: 67, pa2: 8, nb2: 4, sea2: 4, annual: 70 },
        { name: 'COMPUTER', pa1: 9, nb1: 5, sea1: 5, hy: 75, pa2: 9, nb2: 5, sea2: 5, annual: 77 }
      ]
    }
  }
];

// Default School Header
const DEFAULT_HEADER = {
  schoolName: 'J D INTERNATIONAL SCHOOL',
  tagline: 'Affiliated to CBSE, New Delhi',
  address: 'Sector-4, R.K. Puram, New Delhi - 110022',
  contact: 'Ph.: 011-26178901, 26178902 | Email: info@jdinternationalschool.edu.in',
  schoolCode: '10964',
  affiliationNo: '1730619',
  logo: 'https://temp.erichost.app/assets/schools/jdisjr_221/school/1_school_photo_1766831297_f7516d5fc58b9af84fb1.jpg',
  boardType: 'CBSE',
  issueDate: '28-03-2026'
};

const REMARK_PRESETS = [
  'Very Good',
  '🌟 Extra-ordinary academic performance & exemplary discipline throughout the academic session.',
  '📚 Hardworking, sincere, obedient and attentive in class lessons.',
  '📈 Good progress shown; capable of achieving even higher distinction with regular revision.',
  '🎯 Promising student with sharp analytical skills and enthusiastic participation.',
  '✍️ Needs more focus on daily handwriting, notebook upkeep and test revisions.'
];

const PROMOTION_PRESETS = [
  'Class : VIII',
  'Class : II',
  'Class : XI-MEDICAL',
  'PROMOTED TO HIGHER CLASS',
  'PASSED WITH FIRST DIVISION',
  'PASSED',
  'NEEDS IMPROVEMENT',
  'DETAINED FOR RE-EXAMINATION'
];

export function ProgressReportCardReportPage() {
  // Load saved state or default
  const [student, setStudent] = useState(() => {
    try {
      const saved = localStorage.getItem('school_erp_marksheet_student');
      return saved ? JSON.parse(saved) : DEFAULT_STUDENT;
    } catch {
      return DEFAULT_STUDENT;
    }
  });

  const [headerConfig, setHeaderConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('school_erp_marksheet_header');
      return saved ? JSON.parse(saved) : DEFAULT_HEADER;
    } catch {
      return DEFAULT_HEADER;
    }
  });

  // Assessment Mode
  // 'annual': 13-Column Bi-Term
  // 'half_yearly': 7-Column Term 1
  // 'periodic': 5-Column Single Exam
  const [examMode, setExamMode] = useState('annual');
  const [sessionText, setSessionText] = useState('2025-2026');
  const [examTitleText, setExamTitleText] = useState('ANNUAL PROGRESS REPORT');

  // UI layout view: 'split' | 'editor' | 'preview'
  const [viewMode, setViewMode] = useState('split');
  const [activeEditorTab, setActiveEditorTab] = useState('marks');
  const [isSaved, setIsSaved] = useState(false);

  // ─── AUTO-FETCH STATE ───
  const [isAutoFetchOpen, setIsAutoFetchOpen] = useState(true);
  const [availableClasses, setAvailableClasses] = useState([
    'All Classes', 'Class VII', 'Class I', 'Class X', 'Class II', 'Class III', 'Class IV', 'Class V', 'Class VI', 'Class VIII', 'Class IX', 'Class XI', 'Class XII'
  ]);
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [selectedSection, setSelectedSection] = useState('A');
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [fetchedStudentsList, setFetchedStudentsList] = useState(DEMO_DATABASE_STUDENTS);
  const [selectedStudentId, setSelectedStudentId] = useState(DEMO_DATABASE_STUDENTS[0].id);
  const [isFetching, setIsFetching] = useState(false);
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);

  const marksheetRef = useRef(null);

  // Auto-sync examTitleText with mode
  useEffect(() => {
    if (examMode === 'annual') {
      setExamTitleText('ANNUAL PROGRESS REPORT');
    } else if (examMode === 'half_yearly') {
      setExamTitleText('HALF YEARLY EXAMINATION');
    } else {
      setExamTitleText('PERIODIC ASSESSMENT - 1');
    }
  }, [examMode]);

  // Try fetching classes and students from backend API on mount
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        // Fetch classes
        const classRes = await fetch('http://localhost:5000/api/academics/classes').catch(() => null);
        if (classRes && classRes.ok) {
          const classData = await classRes.json();
          if (classData?.data && Array.isArray(classData.data)) {
            const classNames = classData.data.map(c => c.name || c.className).filter(Boolean);
            if (classNames.length > 0) setAvailableClasses(['All Classes', ...classNames]);
          }
        }

        // Fetch students
        const stdRes = await fetch('http://localhost:5000/api/students').catch(() => null);
        if (stdRes && stdRes.ok) {
          const stdData = await stdRes.json();
          if (stdData?.data && Array.isArray(stdData.data) && stdData.data.length > 0) {
            // Merge backend students with demo profiles
            const merged = stdData.data.map((s, idx) => {
              const demo = DEMO_DATABASE_STUDENTS[idx % DEMO_DATABASE_STUDENTS.length];
              return {
                id: s.id || `std_be_${idx}`,
                admNo: s.admNo || s.enrollNo || `ADM-2026-${100 + idx}`,
                rollNo: s.rollNo || String(idx + 1),
                firstName: s.firstName || 'STUDENT',
                lastName: s.lastName || String(idx + 1),
                fatherName: s.fatherName || 'MANOJ SHARMA',
                motherName: s.motherName || 'POOJA SHARMA',
                className: s.className || 'Class VII',
                section: s.section || selectedSection,
                dob: s.dob || '2012-08-14',
                photoUrl: s.photoUrl || demo.photoUrl,
                marksProfile: demo.marksProfile
              };
            });
            setFetchedStudentsList(merged);
            setSelectedStudentId(merged[0].id);
          }
        }
      } catch (err) {
        console.log('Using in-memory student database pool');
      }
    };

    fetchBackendData();
  }, []);

  // Filter student list by class and search query
  const filteredStudents = fetchedStudentsList.filter(s => {
    const matchesClass = !selectedClass || selectedClass === 'All Classes' || 
      s.className?.toLowerCase() === selectedClass.toLowerCase() ||
      s.className?.toLowerCase().includes(selectedClass.toLowerCase()) ||
      selectedClass.toLowerCase().includes(s.className?.toLowerCase());
    const matchesSearch = !studentSearchQuery || 
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
      s.admNo?.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
      s.rollNo?.includes(studentSearchQuery);
    return matchesClass && matchesSearch;
  });

  // Ensure selectedStudentId is valid when filtered list changes
  useEffect(() => {
    if (filteredStudents.length > 0) {
      const exists = filteredStudents.some(s => s.id === selectedStudentId);
      if (!exists) {
        setSelectedStudentId(filteredStudents[0].id);
      }
    }
  }, [filteredStudents, selectedStudentId]);

  // Load a student from DB into Marksheet
  const loadStudentIntoMarksheet = (studentObj) => {
    if (!studentObj) return;

    setIsFetching(true);
    setTimeout(() => {
      const p = studentObj.marksProfile || DEMO_DATABASE_STUDENTS[0].marksProfile;
      const formattedDOB = studentObj.dob 
        ? studentObj.dob.split('-').reverse().join('/') 
        : '14/08/2012';

      const updated = {
        id: studentObj.id,
        name: `${studentObj.firstName || ''} ${studentObj.lastName || ''}`.trim().toUpperCase(),
        fatherName: (studentObj.fatherName || 'MANOJ SHARMA').toUpperCase(),
        motherName: (studentObj.motherName || 'POOJA SHARMA').toUpperCase(),
        class: studentObj.className || selectedClass,
        admissionNo: studentObj.admNo || '10964/21',
        rollNo: studentObj.rollNo || '24',
        dob: formattedDOB,
        photo: studentObj.photoUrl || '',
        hyPresent: p.hyPresent || 110,
        hyTotal: p.hyTotal || 115,
        annPresent: p.annPresent || 115,
        annTotal: p.annTotal || 120,
        promotion: p.promotion || 'PROMOTED TO HIGHER CLASS',
        resultStatus: p.resultStatus || 'Passed',
        teacherRemarks: p.teacherRemarks || 'Very Good',
        coScholasticGrades: {
          'ART EDUCATION': 'A1',
          'ART EDUCATION_TERM2': 'A1',
          'WORK EDUCATION': 'A1',
          'WORK EDUCATION_TERM2': 'A1',
          'HEALTH & PHYSICAL EDUCATION': 'A1',
          'HEALTH & PHYSICAL EDUCATION_TERM2': 'A1',
          'ICT': 'A1',
          'ICT_TERM2': 'A1',
          'DISCIPLINE': 'A1',
          'DISCIPLINE_TERM2': 'A1'
        },
        subjects: p.subjects && p.subjects.length > 0 ? p.subjects : DEFAULT_STUDENT.subjects
      };

      setStudent(updated);
      setSelectedStudentId(studentObj.id);
      setIsFetching(false);
      toast.success(`⚡ Auto-fetched: ${updated.name} (Adm: ${updated.admissionNo})`);
    }, 250);
  };

  // Cycle Next/Previous student
  const handleCycleStudent = (direction) => {
    if (filteredStudents.length === 0) return;
    let nextIdx = direction === 'next' ? currentStudentIndex + 1 : currentStudentIndex - 1;
    if (nextIdx >= filteredStudents.length) nextIdx = 0;
    if (nextIdx < 0) nextIdx = filteredStudents.length - 1;

    setCurrentStudentIndex(nextIdx);
    loadStudentIntoMarksheet(filteredStudents[nextIdx]);
  };

  // Persist to localStorage
  const handleSave = () => {
    try {
      localStorage.setItem('school_erp_marksheet_student', JSON.stringify(student));
      localStorage.setItem('school_erp_marksheet_header', JSON.stringify(headerConfig));
      setIsSaved(true);
      toast.success('Marksheet details saved successfully!');
      setTimeout(() => setIsSaved(false), 2000);
    } catch (e) {
      toast.error('Failed to save to local storage');
    }
  };

  // Reset to default sample
  const handleReset = () => {
    if (window.confirm('Reset all marksheet data back to default sample?')) {
      setStudent(DEFAULT_STUDENT);
      setHeaderConfig(DEFAULT_HEADER);
      setExamMode('annual');
      localStorage.removeItem('school_erp_marksheet_student');
      localStorage.removeItem('school_erp_marksheet_header');
      toast.success('Reset to standard CBSE J D International sample!');
    }
  };

  // Handle Mark change for a subject
  const updateSubjectMark = (index, field, value) => {
    setStudent(prev => {
      const updatedSubjects = [...prev.subjects];
      const val = value === '' ? '' : (isNaN(Number(value)) ? value : Number(value));
      updatedSubjects[index] = {
        ...updatedSubjects[index],
        [field]: val
      };
      return { ...prev, subjects: updatedSubjects };
    });
  };

  // Add new subject
  const handleAddSubject = () => {
    const newName = prompt('Enter New Subject Name (e.g. MORAL SCIENCE, FRENCH, DRAWING):');
    if (!newName || !newName.trim()) return;

    setStudent(prev => ({
      ...prev,
      subjects: [
        ...prev.subjects,
        {
          name: newName.trim().toUpperCase(),
          pa1: 10,
          nb1: 5,
          sea1: 5,
          hy: 75,
          pa2: 10,
          nb2: 5,
          sea2: 5,
          annual: 75
        }
      ]
    }));
    toast.success(`Subject "${newName.trim().toUpperCase()}" added`);
  };

  // Remove a subject
  const handleRemoveSubject = (index, subName) => {
    if (student.subjects.length <= 1) {
      toast.error('At least one subject is required!');
      return;
    }
    if (window.confirm(`Delete subject "${subName}" from marksheet?`)) {
      setStudent(prev => ({
        ...prev,
        subjects: prev.subjects.filter((_, i) => i !== index)
      }));
      toast.success(`Subject "${subName}" removed`);
    }
  };

  // Co-scholastic grade change
  const updateCoGrade = (trait, termKey, value) => {
    setStudent(prev => ({
      ...prev,
      coScholasticGrades: {
        ...(prev.coScholasticGrades || {}),
        [termKey ? `${trait}_TERM2` : trait]: value
      }
    }));
  };

  // Print marksheet
  const handlePrint = () => {
    window.print();
  };

  const GRADE_OPTIONS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D', 'E'];

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* ─── PRINT SPECIFIC STYLES ─── */}
      <style>{`
        @media print {
          body, html {
            background: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print, header, nav, aside, footer {
            display: none !important;
          }
          .print-sheet-wrapper {
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            width: 100% !important;
            max-width: 100% !important;
          }
        }
      `}</style>

      {/* ─── TOP CONTROL BAR ─── */}
      <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Left Title & Status */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-sm shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-800 leading-tight">
                  Marksheet Studio (J D International CBSE 1:1)
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-emerald-600" />
                  Auto-Fetch + Manual Override
                </span>
              </div>
              <p className="text-xs text-slate-500">
                1-Click database auto-fetch • Complete manual editing • Live 1:1 physical replica
              </p>
            </div>
          </div>

          {/* Center Mode Selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setExamMode('annual')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                examMode === 'annual'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Annual Bi-Term (13-Col)
            </button>
            <button
              onClick={() => setExamMode('half_yearly')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                examMode === 'half_yearly'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Half Yearly (7-Col)
            </button>
            <button
              onClick={() => setExamMode('periodic')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                examMode === 'periodic'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Periodic / PA-1 (5-Col)
            </button>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => setViewMode('split')}
                title="Split View (Editor + Live Marksheet)"
                className={`p-1.5 rounded-lg cursor-pointer transition-all ${
                  viewMode === 'split' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Columns className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('editor')}
                title="Editor Only"
                className={`p-1.5 rounded-lg cursor-pointer transition-all ${
                  viewMode === 'editor' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('preview')}
                title="Print Preview Only"
                className={`p-1.5 rounded-lg cursor-pointer transition-all ${
                  viewMode === 'preview' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleReset}
              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 transition-all cursor-pointer"
              title="Reset Back to Default Sample"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              {isSaved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Save className="w-3.5 h-3.5" />}
              <span>{isSaved ? 'Saved!' : 'Save'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print A4 Marksheet</span>
            </button>
          </div>
        </div>
      </header>

      {/* ─── MAIN WORKSPACE ─── */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto p-3 sm:p-5 flex flex-col lg:flex-row gap-5 items-start">
        {/* ─── LEFT: MANUAL ENTRY & AUTO-FETCH STUDIO ─── */}
        {(viewMode === 'split' || viewMode === 'editor') && (
          <div className="no-print w-full lg:w-[46%] xl:w-[44%] shrink-0 flex flex-col gap-4">
            
            {/* ════ ⚡ AUTO-FETCH FROM DATABASE PANEL ════ */}
            <div className="bg-gradient-to-br from-indigo-50/90 via-sky-50/60 to-white rounded-2xl border border-indigo-200/90 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-indigo-600 text-white shadow-2xs">
                    <Database className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="text-xs font-black text-indigo-950 uppercase tracking-wide flex items-center gap-1.5">
                      Auto-Fetch From Database
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-indigo-200 text-indigo-900">
                        Smart Sync
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Select class & student to auto-populate bio, attendance and marks in 1-click
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleCycleStudent('prev')}
                    className="p-1 rounded bg-white hover:bg-indigo-100 text-slate-700 border border-slate-200 transition-all cursor-pointer shadow-2xs"
                    title="Previous Student in Class"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10.5px] font-mono font-bold text-indigo-800 px-1">
                    {filteredStudents.length > 0 ? `${currentStudentIndex + 1}/${filteredStudents.length}` : '0/0'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCycleStudent('next')}
                    className="p-1 rounded bg-white hover:bg-indigo-100 text-slate-700 border border-slate-200 transition-all cursor-pointer shadow-2xs"
                    title="Next Student in Class"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Controls Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                {/* Class */}
                <div>
                  <label className="text-[10.5px] font-bold text-slate-700 block mb-1">Select Class</label>
                  <select
                    value={selectedClass}
                    onChange={(e) => {
                      setSelectedClass(e.target.value);
                      setCurrentStudentIndex(0);
                    }}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 shadow-2xs"
                  >
                    {availableClasses.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>

                {/* Section */}
                <div>
                  <label className="text-[10.5px] font-bold text-slate-700 block mb-1">Section</label>
                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 shadow-2xs"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                  </select>
                </div>

                {/* Quick Search */}
                <div>
                  <label className="text-[10.5px] font-bold text-slate-700 block mb-1">Search Student</label>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      placeholder="Name, Roll, Adm..."
                      value={studentSearchQuery}
                      onChange={(e) => setStudentSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 placeholder:text-slate-400 shadow-2xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Student Picker Cards / Dropdown */}
              <div className="flex items-center gap-2 pt-1 flex-wrap sm:flex-nowrap">
                <select
                  value={selectedStudentId}
                  onChange={(e) => {
                    const found = fetchedStudentsList.find(s => s.id === e.target.value);
                    if (found) {
                      setSelectedStudentId(found.id);
                      loadStudentIntoMarksheet(found);
                    }
                  }}
                  className="flex-1 bg-white border border-indigo-300 rounded-xl px-3 py-2 text-xs font-bold text-indigo-900 shadow-2xs cursor-pointer focus:ring-2 focus:ring-indigo-500"
                >
                  {filteredStudents.length === 0 ? (
                    <option value="">No students found in this class</option>
                  ) : (
                    filteredStudents.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.firstName} {s.lastName} • Roll: {s.rollNo} • Adm: {s.admNo}
                      </option>
                    ))
                  )}
                </select>

                <button
                  type="button"
                  onClick={() => {
                    const cur = fetchedStudentsList.find(s => s.id === selectedStudentId) || filteredStudents[0];
                    if (cur) loadStudentIntoMarksheet(cur);
                  }}
                  disabled={isFetching}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
                  <span>{isFetching ? 'Fetching...' : 'Auto-Fetch Now'}</span>
                </button>
              </div>
            </div>

            {/* Editor Nav Tabs */}
            <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-2xs flex items-center gap-1.5 overflow-x-auto text-xs font-bold">
              {[
                { id: 'marks', label: '📝 Subject Marks', icon: FileText },
                { id: 'student', label: '👤 Student Bio', icon: User },
                { id: 'co_scholastic', label: '🏆 Co-Scholastic', icon: Award },
                { id: 'remarks', label: '💬 Remarks & Attendance', icon: Sparkles },
                { id: 'school', label: '🏫 School Info', icon: School }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveEditorTab(t.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                    activeEditorTab === t.id
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
                  }`}
                >
                  <t.icon className="w-3.5 h-3.5" />
                  <span>{t.label}</span>
                </button>
              ))}
            </div>

            {/* TAB 1: SUBJECT MARKS MANUAL INPUT */}
            {activeEditorTab === 'marks' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h2 className="text-sm font-bold text-slate-800">
                      Scholastic Subjects & Term Marks
                    </h2>
                    <p className="text-xs text-slate-500">
                      Type marks directly or override auto-fetched marks. Totals and CBSE grades recalculate live.
                    </p>
                  </div>
                  <button
                    onClick={handleAddSubject}
                    className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Subject</span>
                  </button>
                </div>

                {/* Table of Subjects */}
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                      {examMode === 'annual' ? (
                        <>
                          <tr>
                            <th rowSpan={2} className="p-2 border-r border-slate-200 w-28">Subject</th>
                            <th colSpan={4} className="p-1.5 text-center border-r border-slate-200 bg-blue-50/70 text-blue-900 font-serif">
                              Term 1 (Half Yearly)
                            </th>
                            <th colSpan={4} className="p-1.5 text-center border-r border-slate-200 bg-indigo-50/70 text-indigo-900 font-serif">
                              Term 2 (Annual)
                            </th>
                            <th rowSpan={2} className="p-2 text-center w-10">Del</th>
                          </tr>
                          <tr className="text-[10px] text-slate-600 bg-slate-100 border-t border-slate-200 font-serif">
                            <th className="p-1 text-center w-11">PA1 (10)</th>
                            <th className="p-1 text-center w-10">NB (5)</th>
                            <th className="p-1 text-center w-10">SEA (5)</th>
                            <th className="p-1 text-center w-12 border-r border-slate-200">HY (80)</th>
                            <th className="p-1 text-center w-11">PA2 (10)</th>
                            <th className="p-1 text-center w-10">NB (5)</th>
                            <th className="p-1 text-center w-10">SEA (5)</th>
                            <th className="p-1 text-center w-12 border-r border-slate-200">Ann (80)</th>
                          </tr>
                        </>
                      ) : examMode === 'half_yearly' ? (
                        <tr>
                          <th className="p-2 border-r border-slate-200">Subject</th>
                          <th className="p-1.5 text-center w-16">PA-1 (10)</th>
                          <th className="p-1.5 text-center w-14">NB (5)</th>
                          <th className="p-1.5 text-center w-14">SEA (5)</th>
                          <th className="p-1.5 text-center w-18">HY (80)</th>
                          <th className="p-2 text-center w-12">Del</th>
                        </tr>
                      ) : (
                        <tr>
                          <th className="p-2 border-r border-slate-200">Subject</th>
                          <th className="p-2 text-center w-24">Max Marks</th>
                          <th className="p-2 text-center w-28">Marks Obtained</th>
                          <th className="p-2 text-center w-12">Del</th>
                        </tr>
                      )}
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {student.subjects.map((sub, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-2 border-r border-slate-200">
                            <input
                              type="text"
                              value={sub.name}
                              onChange={(e) => {
                                const val = e.target.value.toUpperCase();
                                setStudent(prev => {
                                  const list = [...prev.subjects];
                                  list[idx] = { ...list[idx], name: val };
                                  return { ...prev, subjects: list };
                                });
                              }}
                              className="w-full text-xs font-bold text-slate-800 bg-transparent border-b border-transparent focus:border-indigo-500 focus:outline-none"
                            />
                          </td>

                          {examMode === 'annual' ? (
                            <>
                              <td className="p-1 text-center">
                                <input
                                  type="number"
                                  min="0"
                                  max="10"
                                  value={sub.pa1 ?? ''}
                                  onChange={(e) => updateSubjectMark(idx, 'pa1', e.target.value)}
                                  className="w-11 h-7 text-center font-bold text-indigo-700 bg-white border border-slate-200 rounded text-xs focus:ring-1 focus:ring-indigo-500"
                                />
                              </td>
                              <td className="p-1 text-center">
                                <input
                                  type="number"
                                  min="0"
                                  max="5"
                                  value={sub.nb1 ?? ''}
                                  onChange={(e) => updateSubjectMark(idx, 'nb1', e.target.value)}
                                  className="w-10 h-7 text-center font-medium text-slate-700 bg-white border border-slate-200 rounded text-xs"
                                />
                              </td>
                              <td className="p-1 text-center">
                                <input
                                  type="number"
                                  min="0"
                                  max="5"
                                  value={sub.sea1 ?? ''}
                                  onChange={(e) => updateSubjectMark(idx, 'sea1', e.target.value)}
                                  className="w-10 h-7 text-center font-medium text-slate-700 bg-white border border-slate-200 rounded text-xs"
                                />
                              </td>
                              <td className="p-1 text-center border-r border-slate-200">
                                <input
                                  type="number"
                                  min="0"
                                  max="80"
                                  value={sub.hy ?? ''}
                                  onChange={(e) => updateSubjectMark(idx, 'hy', e.target.value)}
                                  className="w-12 h-7 text-center font-bold text-blue-900 bg-blue-50/50 border border-blue-200 rounded text-xs"
                                />
                              </td>

                              <td className="p-1 text-center">
                                <input
                                  type="number"
                                  min="0"
                                  max="10"
                                  value={sub.pa2 ?? ''}
                                  onChange={(e) => updateSubjectMark(idx, 'pa2', e.target.value)}
                                  className="w-11 h-7 text-center font-bold text-indigo-700 bg-white border border-slate-200 rounded text-xs"
                                />
                              </td>
                              <td className="p-1 text-center">
                                <input
                                  type="number"
                                  min="0"
                                  max="5"
                                  value={sub.nb2 ?? ''}
                                  onChange={(e) => updateSubjectMark(idx, 'nb2', e.target.value)}
                                  className="w-10 h-7 text-center font-medium text-slate-700 bg-white border border-slate-200 rounded text-xs"
                                />
                              </td>
                              <td className="p-1 text-center">
                                <input
                                  type="number"
                                  min="0"
                                  max="5"
                                  value={sub.sea2 ?? ''}
                                  onChange={(e) => updateSubjectMark(idx, 'sea2', e.target.value)}
                                  className="w-10 h-7 text-center font-medium text-slate-700 bg-white border border-slate-200 rounded text-xs"
                                />
                              </td>
                              <td className="p-1 text-center border-r border-slate-200">
                                <input
                                  type="number"
                                  min="0"
                                  max="80"
                                  value={sub.annual ?? ''}
                                  onChange={(e) => updateSubjectMark(idx, 'annual', e.target.value)}
                                  className="w-12 h-7 text-center font-bold text-indigo-900 bg-indigo-50/50 border border-indigo-200 rounded text-xs"
                                />
                              </td>
                            </>
                          ) : examMode === 'half_yearly' ? (
                            <>
                              <td className="p-1 text-center">
                                <input
                                  type="number"
                                  min="0"
                                  max="10"
                                  value={sub.pa1 ?? ''}
                                  onChange={(e) => updateSubjectMark(idx, 'pa1', e.target.value)}
                                  className="w-12 h-7 text-center font-bold text-indigo-700 bg-white border border-slate-200 rounded text-xs"
                                />
                              </td>
                              <td className="p-1 text-center">
                                <input
                                  type="number"
                                  min="0"
                                  max="5"
                                  value={sub.nb1 ?? ''}
                                  onChange={(e) => updateSubjectMark(idx, 'nb1', e.target.value)}
                                  className="w-10 h-7 text-center font-medium text-slate-700 bg-white border border-slate-200 rounded text-xs"
                                />
                              </td>
                              <td className="p-1 text-center">
                                <input
                                  type="number"
                                  min="0"
                                  max="5"
                                  value={sub.sea1 ?? ''}
                                  onChange={(e) => updateSubjectMark(idx, 'sea1', e.target.value)}
                                  className="w-10 h-7 text-center font-medium text-slate-700 bg-white border border-slate-200 rounded text-xs"
                                />
                              </td>
                              <td className="p-1 text-center">
                                <input
                                  type="number"
                                  min="0"
                                  max="80"
                                  value={sub.hy ?? ''}
                                  onChange={(e) => updateSubjectMark(idx, 'hy', e.target.value)}
                                  className="w-14 h-7 text-center font-bold text-blue-900 bg-blue-50/50 border border-blue-200 rounded text-xs"
                                />
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="p-1 text-center">
                                <input
                                  type="number"
                                  value={sub.maxMarks || 20}
                                  onChange={(e) => updateSubjectMark(idx, 'maxMarks', e.target.value)}
                                  className="w-16 h-7 text-center font-bold text-slate-700 bg-white border border-slate-200 rounded text-xs"
                                />
                              </td>
                              <td className="p-1 text-center">
                                <input
                                  type="number"
                                  value={sub.marks !== undefined ? sub.marks : (sub.pa1 || '')}
                                  onChange={(e) => {
                                    updateSubjectMark(idx, 'marks', e.target.value);
                                    updateSubjectMark(idx, 'pa1', e.target.value);
                                  }}
                                  className="w-20 h-7 text-center font-bold text-indigo-700 bg-white border border-slate-200 rounded text-xs"
                                />
                              </td>
                            </>
                          )}

                          <td className="p-1 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveSubject(idx, sub.name)}
                              className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                              title="Delete Subject"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: STUDENT PROFILE BIO */}
            {activeEditorTab === 'student' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-4">
                <div className="pb-3 border-b border-slate-100">
                  <h2 className="text-sm font-bold text-slate-800">
                    Student Details & Identifiers
                  </h2>
                  <p className="text-xs text-slate-500">
                    Printed in the official student dossier box at the top of the marksheet.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Student Full Name</label>
                    <input
                      type="text"
                      value={student.name}
                      onChange={(e) => setStudent({ ...student, name: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Class & Section</label>
                    <input
                      type="text"
                      value={student.class}
                      onChange={(e) => setStudent({ ...student, class: e.target.value })}
                      placeholder="e.g. Class VII"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Father's Name</label>
                    <input
                      type="text"
                      value={student.fatherName}
                      onChange={(e) => setStudent({ ...student, fatherName: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Mother's Name</label>
                    <input
                      type="text"
                      value={student.motherName}
                      onChange={(e) => setStudent({ ...student, motherName: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Admission / SRN No.</label>
                    <input
                      type="text"
                      value={student.admissionNo}
                      onChange={(e) => setStudent({ ...student, admissionNo: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Date of Birth (DOB)</label>
                    <input
                      type="text"
                      value={student.dob}
                      onChange={(e) => setStudent({ ...student, dob: e.target.value })}
                      placeholder="DD/MM/YYYY"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">Student Photo URL (Optional)</label>
                    <input
                      type="text"
                      value={student.photo || ''}
                      onChange={(e) => setStudent({ ...student, photo: e.target.value })}
                      placeholder="https://... or data:image..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: CO-SCHOLASTIC & DISCIPLINE */}
            {activeEditorTab === 'co_scholastic' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-4">
                <div className="pb-3 border-b border-slate-100">
                  <h2 className="text-sm font-bold text-slate-800">
                    B. Co-Scholastic Areas & C. Discipline
                  </h2>
                  <p className="text-xs text-slate-500">
                    CBSE 8-Point Grading Scale (A1, A2, B1, B2, C1, C2, D, E)
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    'ART EDUCATION',
                    'WORK EDUCATION',
                    'HEALTH & PHYSICAL EDUCATION',
                    'ICT',
                    'DISCIPLINE'
                  ].map(trait => {
                    const t1Val = student.coScholasticGrades?.[trait] || 'A1';
                    const t2Val = student.coScholasticGrades?.[`${trait}_TERM2`] || 'A1';

                    return (
                      <div key={trait} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 flex-wrap">
                        <span className="font-bold text-xs text-slate-800 uppercase font-serif tracking-wide">
                          {trait}
                        </span>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-slate-500 font-medium">Term 1:</span>
                            <select
                              value={t1Val}
                              onChange={(e) => updateCoGrade(trait, false, e.target.value)}
                              className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-indigo-700 cursor-pointer"
                            >
                              {GRADE_OPTIONS.map(g => (
                                <option key={g} value={g}>{g}</option>
                              ))}
                            </select>
                          </div>

                          {examMode === 'annual' && (
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] text-slate-500 font-medium">Annual:</span>
                              <select
                                value={t2Val}
                                onChange={(e) => updateCoGrade(trait, true, e.target.value)}
                                className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-indigo-700 cursor-pointer"
                              >
                                {GRADE_OPTIONS.map(g => (
                                  <option key={g} value={g}>{g}</option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 4: REMARKS, ATTENDANCE & PROMOTION */}
            {activeEditorTab === 'remarks' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-4">
                <div className="pb-3 border-b border-slate-100">
                  <h2 className="text-sm font-bold text-slate-800">
                    Attendance, Result Status & Class Teacher's Remarks
                  </h2>
                </div>

                {/* Attendance */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">HY Present Days</label>
                    <input
                      type="number"
                      value={student.hyPresent ?? ''}
                      onChange={(e) => setStudent({ ...student, hyPresent: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">HY Total Days</label>
                    <input
                      type="number"
                      value={student.hyTotal ?? ''}
                      onChange={(e) => setStudent({ ...student, hyTotal: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                    />
                  </div>
                  {examMode === 'annual' && (
                    <>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Annual Present</label>
                        <input
                          type="number"
                          value={student.annPresent ?? ''}
                          onChange={(e) => setStudent({ ...student, annPresent: Number(e.target.value) })}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-bold"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Annual Total</label>
                        <input
                          type="number"
                          value={student.annTotal ?? ''}
                          onChange={(e) => setStudent({ ...student, annTotal: Number(e.target.value) })}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Result Status */}
                <div>
                  <label className="font-bold text-xs text-slate-700 block mb-1">Status Verdict</label>
                  <select
                    value={student.resultStatus || 'Passed'}
                    onChange={(e) => setStudent({ ...student, resultStatus: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-emerald-800"
                  >
                    <option value="Passed">Passed</option>
                    <option value="Passed with First Division">Passed with First Division</option>
                    <option value="Needs Improvement">Needs Improvement</option>
                    <option value="Detained">Detained</option>
                  </select>
                </div>

                {/* Promoted to Class */}
                {examMode === 'annual' && (
                  <div>
                    <label className="font-bold text-xs text-slate-700 block mb-1">Promoted to Class</label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {PROMOTION_PRESETS.map((p, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setStudent({ ...student, promotion: p })}
                          className="text-[11px] px-2 py-0.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 rounded border border-slate-200 cursor-pointer"
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={student.promotion || ''}
                      onChange={(e) => setStudent({ ...student, promotion: e.target.value })}
                      placeholder="e.g. Class : VIII"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                    />
                  </div>
                )}

                {/* Teacher Remarks */}
                <div>
                  <label className="font-bold text-xs text-slate-700 block mb-1">Class Teacher Remarks</label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {REMARK_PRESETS.map((preset, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setStudent({ ...student, teacherRemarks: preset })}
                        className="text-[10.5px] px-2 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg border border-slate-200 text-left cursor-pointer transition-all truncate max-w-[280px]"
                        title={preset}
                      >
                        {preset.slice(0, 36)}...
                      </button>
                    ))}
                  </div>
                  <textarea
                    rows={3}
                    value={student.teacherRemarks || ''}
                    onChange={(e) => setStudent({ ...student, teacherRemarks: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
              </div>
            )}

            {/* TAB 5: SCHOOL & EXAM SETTINGS */}
            {activeEditorTab === 'school' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-4">
                <div className="pb-3 border-b border-slate-100">
                  <h2 className="text-sm font-bold text-slate-800">
                    School Profile & Exam Header
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">School Full Name</label>
                    <input
                      type="text"
                      value={headerConfig.schoolName}
                      onChange={(e) => setHeaderConfig({ ...headerConfig, schoolName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900 font-serif"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">School No.</label>
                    <input
                      type="text"
                      value={headerConfig.schoolCode}
                      onChange={(e) => setHeaderConfig({ ...headerConfig, schoolCode: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Affiliation No.</label>
                    <input
                      type="text"
                      value={headerConfig.affiliationNo}
                      onChange={(e) => setHeaderConfig({ ...headerConfig, affiliationNo: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">Tagline / Motto</label>
                    <input
                      type="text"
                      value={headerConfig.tagline}
                      onChange={(e) => setHeaderConfig({ ...headerConfig, tagline: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 italic font-serif"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">Address</label>
                    <input
                      type="text"
                      value={headerConfig.address}
                      onChange={(e) => setHeaderConfig({ ...headerConfig, address: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">Contact Details</label>
                    <input
                      type="text"
                      value={headerConfig.contact}
                      onChange={(e) => setHeaderConfig({ ...headerConfig, contact: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Academic Session</label>
                    <input
                      type="text"
                      value={sessionText}
                      onChange={(e) => setSessionText(e.target.value)}
                      placeholder="2025-2026"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Issue Date</label>
                    <input
                      type="text"
                      value={headerConfig.issueDate}
                      onChange={(e) => setHeaderConfig({ ...headerConfig, issueDate: e.target.value })}
                      placeholder="DD-MM-YYYY"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── RIGHT: LIVE 1:1 MARKSHEET PREVIEW ─── */}
        {(viewMode === 'split' || viewMode === 'preview') && (
          <div
            className={`w-full ${
              viewMode === 'split' ? 'lg:flex-1' : 'max-w-4xl mx-auto'
            } flex flex-col items-center`}
          >
            {/* Sheet wrapper with authentic paper shadow */}
            <div
              ref={marksheetRef}
              className="print-sheet-wrapper w-full max-w-[850px] bg-white shadow-xl rounded-sm border border-slate-200 overflow-hidden"
            >
              <JdInternationalMarksheet
                student={student}
                headerConfig={headerConfig}
                sessionText={sessionText}
                examTitleText={examTitleText}
                selectedExamType={
                  examMode === 'annual'
                    ? 'ALL'
                    : examMode === 'half_yearly'
                    ? 'Half Yearly'
                    : 'PA 1'
                }
              />
            </div>

            {/* Print Note below */}
            <div className="no-print mt-3 text-center text-xs text-slate-400">
              A4 Physical Format: 210mm × 297mm • Press <span className="font-mono bg-slate-200 px-1 py-0.5 rounded text-slate-700 font-bold">Ctrl+P</span> or the Print button to print.
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ProgressReportCardReportPage;
