import React, { useState, useEffect, useMemo } from 'react';
import {
  GraduationCap,
  Home,
  Search,
  Plus,
  Trash2,
  Edit2,
  X,
  Layers,
  Users,
  Check,
  Download,
  Filter,
  Sparkles,
  BookOpen,
  UserCheck,
  DoorOpen,
  LayoutGrid,
  List,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Info,
  RefreshCw,
  Printer
} from 'lucide-react';
import toast from 'react-hot-toast';

// Helper to determine division/wing from class name
const getDivision = (name = '') => {
  const upper = name.toUpperCase();
  if (
    upper.includes('NURSERY') ||
    upper.includes('KINDERGARTEN') ||
    upper.includes('PP3') ||
    upper.includes('PP4') ||
    upper.includes('PP5') ||
    upper.includes('LKG') ||
    upper.includes('UKG')
  ) {
    return 'Pre-Primary';
  }
  if (upper.includes('XI') || upper.includes('XII')) {
    return 'Senior Secondary';
  }
  if (
    upper.includes('IX') ||
    upper.includes('X ') ||
    upper.endsWith('X') ||
    upper === 'CLASS X' ||
    upper === 'CLASS IX'
  ) {
    return 'Secondary';
  }
  if (
    upper.includes('VI') ||
    upper.includes('VII') ||
    upper.includes('VIII')
  ) {
    return 'Middle';
  }
  return 'Primary';
};

const DIVISION_CONFIG = {
  'Pre-Primary': {
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    border: 'border-l-rose-500',
    cardBg: 'from-rose-50/50 to-pink-50/20',
    dot: 'bg-rose-500',
    title: 'Pre-Primary Wing',
    subtitle: 'Nursery, LKG, UKG (Foundation Stage)'
  },
  'Primary': {
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    border: 'border-l-blue-500',
    cardBg: 'from-blue-50/50 to-sky-50/20',
    dot: 'bg-blue-500',
    title: 'Primary Wing',
    subtitle: 'Class 1 to 5 (Preparatory Stage)'
  },
  'Middle': {
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    border: 'border-l-amber-500',
    cardBg: 'from-amber-50/50 to-orange-50/20',
    dot: 'bg-amber-500',
    title: 'Middle Wing',
    subtitle: 'Class 6 to 8 (Middle Stage)'
  },
  'Secondary': {
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    border: 'border-l-indigo-500',
    cardBg: 'from-indigo-50/50 to-purple-50/20',
    dot: 'bg-indigo-500',
    title: 'Secondary Wing',
    subtitle: 'Class 9 & 10 (Secondary Stage)'
  },
  'Senior Secondary': {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    border: 'border-l-emerald-500',
    cardBg: 'from-emerald-50/50 to-teal-50/20',
    dot: 'bg-emerald-500',
    title: 'Senior Secondary Wing',
    subtitle: 'Class 11 & 12 (Science, Commerce, Arts)'
  }
};

const AVAILABLE_SECTIONS = ['A', 'B', 'C', 'D', 'E', 'F'];

const TEACHERS_LIST = [
  'Mrs. Suman Meena',
  'Mrs. Aarti Sen',
  'Mrs. Rekha Sharma',
  'Mrs. Monika Rani',
  'Mrs. Sunita Kumari',
  'Mr. Rajesh Meena',
  'Ms. Neha Gupta',
  'Mrs. Priya Kanwar',
  'Mr. Amit Pareek',
  'Mrs. Kavita Verma',
  'Mr. Vikram Rathore',
  'Dr. Arun Joshi',
  'Mr. Rakesh Sharma',
  'Ms. Ananya Roy',
  'Mr. Manish Yadav',
  'Mrs. Deepa Bhatt',
  'Mr. Dinesh Choudhary',
  'Ms. Pooja Saxena',
  'Mr. Hemant Soni'
];

const STANDARD_PRESETS = [
  { name: 'Nursery - PP3+', wing: 'Pre-Primary', room: 'KG-01' },
  { name: 'Lower Kindergarten - PP4+', wing: 'Pre-Primary', room: 'KG-02' },
  { name: 'Upper Kindergarten - PP5+', wing: 'Pre-Primary', room: 'KG-03' },
  { name: 'Class I', wing: 'Primary', room: '101' },
  { name: 'Class II', wing: 'Primary', room: '102' },
  { name: 'Class III', wing: 'Primary', room: '103' },
  { name: 'Class IV', wing: 'Primary', room: '104' },
  { name: 'Class V', wing: 'Primary', room: '105' },
  { name: 'Class VI', wing: 'Middle', room: '201' },
  { name: 'Class VII', wing: 'Middle', room: '202' },
  { name: 'Class VIII', wing: 'Middle', room: '203' },
  { name: 'Class IX', wing: 'Secondary', room: '204' },
  { name: 'Class X', wing: 'Secondary', room: '205' },
  { name: 'Class XI - Science', wing: 'Senior Secondary', stream: 'SCIENCE', room: '301' },
  { name: 'Class XII - Science', wing: 'Senior Secondary', stream: 'SCIENCE', room: '302' },
  { name: 'Class XI - Commerce', wing: 'Senior Secondary', stream: 'COMMERCE', room: '303' },
  { name: 'Class XII - Commerce', wing: 'Senior Secondary', stream: 'COMMERCE', room: '304' },
  { name: 'Class XI - Humanities', wing: 'Senior Secondary', stream: 'HUMANITIES', room: '305' },
  { name: 'Class XII - Humanities', wing: 'Senior Secondary', stream: 'HUMANITIES', room: '306' }
];

export function ClassMasterPage({ onNavigate }) {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('ALL');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [expandedClassId, setExpandedClassId] = useState(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [className, setClassName] = useState('');
  const [wing, setWing] = useState('Primary');
  const [stream, setStream] = useState('');
  const [selectedSections, setSelectedSections] = useState(['A', 'B']);
  const [classTeacher, setClassTeacher] = useState('');
  const [roomNo, setRoomNo] = useState('');
  const [studentCount, setStudentCount] = useState(0);

  // Fetch classes from backend API
  const fetchClasses = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/academics/classes');
      const data = await res.json();
      if (data.success && data.data) {
        setClasses(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch classes:', err);
      toast.error('Failed to load classes from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleOpenAdd = () => {
    setEditingClass(null);
    setClassName('');
    setWing('Primary');
    setStream('');
    setSelectedSections(['A', 'B']);
    setClassTeacher(TEACHERS_LIST[0]);
    setRoomNo('');
    setStudentCount(0);
    setModalOpen(true);
  };

  const handleOpenEdit = (cls) => {
    setEditingClass(cls);
    setClassName(cls.name || '');
    setWing(cls.wing || getDivision(cls.name));
    setStream(cls.stream || '');
    setSelectedSections(Array.isArray(cls.sections) && cls.sections.length > 0 ? cls.sections : ['A']);
    setClassTeacher(cls.classTeacher || TEACHERS_LIST[0]);
    setRoomNo(cls.roomNo || '');
    setStudentCount(cls.studentCount || 0);
    setModalOpen(true);
  };

  const handleToggleSection = (sec) => {
    if (selectedSections.includes(sec)) {
      if (selectedSections.length === 1) {
        toast.error('At least one section (e.g. Section A) is required');
        return;
      }
      setSelectedSections(selectedSections.filter(s => s !== sec));
    } else {
      setSelectedSections([...selectedSections, sec].sort());
    }
  };

  // Instant 1-Click Quick Add Section to a Class
  const handleQuickAddSection = async (cls, e) => {
    e.stopPropagation();
    const currentSections = Array.isArray(cls.sections) && cls.sections.length > 0 ? cls.sections : ['A'];
    // Find next available section letter
    const nextSec = AVAILABLE_SECTIONS.find(s => !currentSections.includes(s));
    if (!nextSec) {
      toast.error(`All standard sections (A through F) are already added for ${cls.name}`);
      return;
    }

    const updatedSections = [...currentSections, nextSec].sort();

    try {
      const res = await fetch(`http://localhost:5000/api/academics/classes/${cls.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sections: updatedSections
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Section ${nextSec} added to ${cls.name}!`, { icon: '✨' });
        // Optimistic UI update
        setClasses(prev => prev.map(c => c.id === cls.id ? { ...c, sections: updatedSections } : c));
      } else {
        toast.error(data.message || 'Failed to add section');
      }
    } catch (err) {
      console.error('Error adding section:', err);
      toast.error('Network error. Could not add section.');
    }
  };

  // 1-Click Quick Remove Section
  const handleQuickRemoveSection = async (cls, secToRemove, e) => {
    e.stopPropagation();
    const currentSections = Array.isArray(cls.sections) ? cls.sections : ['A'];
    if (currentSections.length <= 1) {
      toast.error('Cannot remove the only remaining section');
      return;
    }
    const updatedSections = currentSections.filter(s => s !== secToRemove);

    try {
      const res = await fetch(`http://localhost:5000/api/academics/classes/${cls.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sections: updatedSections
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Section ${secToRemove} removed from ${cls.name}`);
        setClasses(prev => prev.map(c => c.id === cls.id ? { ...c, sections: updatedSections } : c));
      }
    } catch (err) {
      console.error('Error removing section:', err);
      toast.error('Failed to remove section');
    }
  };

  const handleSaveClass = async (e) => {
    e.preventDefault();
    if (!className.trim()) {
      toast.error('Please enter class name');
      return;
    }
    if (selectedSections.length === 0) {
      toast.error('Please select at least one section');
      return;
    }

    const payload = {
      name: className.trim(),
      wing: wing || getDivision(className),
      stream: stream.trim(),
      sections: selectedSections,
      classTeacher: classTeacher.trim(),
      roomNo: roomNo.trim(),
      studentCount: Number(studentCount) || 0
    };

    try {
      if (editingClass) {
        // Update
        const res = await fetch(`http://localhost:5000/api/academics/classes/${editingClass.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          toast.success('Class updated successfully');
          setModalOpen(false);
          fetchClasses();
        } else {
          toast.error(data.message || 'Failed to update class');
        }
      } else {
        // Add New
        const res = await fetch('http://localhost:5000/api/academics/classes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          toast.success('Class created successfully');
          setModalOpen(false);
          fetchClasses();
        } else {
          toast.error(data.message || 'Failed to create class');
        }
      }
    } catch (err) {
      console.error('Error saving class:', err);
      toast.error('Network error. Please try again.');
    }
  };

  const handleDeleteClass = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) return;
    try {
      const res = await fetch(`http://localhost:5000/api/academics/classes/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Class "${name}" deleted`);
        fetchClasses();
      } else {
        toast.error(data.message || 'Failed to delete class');
      }
    } catch (err) {
      console.error('Error deleting class:', err);
      toast.error('Network error');
    }
  };

  // Filtered classes by search and division tab
  const filteredClasses = useMemo(() => {
    return classes.filter(cls => {
      const division = cls.wing || getDivision(cls.name);
      if (selectedDivision !== 'ALL' && division !== selectedDivision) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = cls.name?.toLowerCase().includes(query);
        const matchesDivision = division.toLowerCase().includes(query);
        const matchesSec = cls.sections?.some(s => s.toLowerCase().includes(query));
        const matchesTeacher = cls.classTeacher?.toLowerCase().includes(query);
        const matchesRoom = cls.roomNo?.toLowerCase().includes(query);
        const matchesStream = cls.stream?.toLowerCase().includes(query);
        return matchesName || matchesDivision || matchesSec || matchesTeacher || matchesRoom || matchesStream;
      }
      return true;
    });
  }, [classes, searchQuery, selectedDivision]);

  // Statistics
  const totalClassesCount = classes.length;
  const totalSectionsCount = classes.reduce((sum, c) => sum + (Array.isArray(c.sections) ? c.sections.length : 1), 0);
  const totalEnrolled = classes.reduce((sum, c) => sum + (c.studentCount || 0), 0);
  const multiSectionClassesCount = classes.filter(c => Array.isArray(c.sections) && c.sections.length > 1).length;

  const handleExportCSV = () => {
    const headers = ['S.No.,Class Name,Wing,Stream,Sections,Class Incharge,Room No.,Students'];
    const rows = filteredClasses.map((c, i) =>
      `${i + 1},"${c.name}","${c.wing || getDivision(c.name)}","${c.stream || '-'}","${(c.sections || ['A']).join(', ')}","${c.classTeacher || 'Unassigned'}","${c.roomNo || '-'}","${c.studentCount || 0}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Class_Directory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Classes exported to CSV');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="pt-4 sm:pt-5 pb-12 px-4 md:px-6 bg-slate-50 min-h-screen text-slate-800 space-y-4">
      {/* Top Header Card */}
      <div className="bg-white p-4 md:p-5 rounded-2xl shadow-xs border border-slate-200/90 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5 font-medium">
            <span
              className="flex items-center gap-1 hover:text-indigo-600 cursor-pointer transition-colors"
              onClick={() => onNavigate && onNavigate('/')}
            >
              <Home className="w-3.5 h-3.5 text-slate-400" /> Dashboard
            </span>
            <span>/</span>
            <span
              className="hover:text-indigo-600 cursor-pointer transition-colors"
              onClick={() => onNavigate && onNavigate('/class-list')}
            >
              Academics & Masters
            </span>
            <span>/</span>
            <span className="text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded-md">
              Class & Section Directory
            </span>
          </div>

          <h1 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm shadow-indigo-200">
              <GraduationCap className="w-5 h-5" />
            </div>
            Class Master & Section Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Academic Session 2026-2027 • Manage standard grades, section division, class teachers & rooms
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={fetchClasses}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl border border-slate-200/80 transition-colors"
            title="Refresh Directory"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 shadow-2xs transition-all"
            title="Export CSV"
          >
            <Download className="w-4 h-4 text-slate-500" /> Export CSV
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 shadow-2xs transition-all"
            title="Print Class Directory"
          >
            <Printer className="w-4 h-4 text-slate-500" /> Print
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-indigo-200 transition-all active:scale-95"
            title="Add New Class"
          >
            <Plus className="w-4 h-4" /> Add New Class
          </button>
        </div>
      </div>

      {/* KPI Stats Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Classes & Sections */}
        <div
          onClick={() => setSelectedDivision('ALL')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            selectedDivision === 'ALL'
              ? 'bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
              : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>TOTAL CLASSES</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl md:text-3xl font-black text-slate-900">{totalClassesCount}</span>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200/60">
              {totalSectionsCount} Sections
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            {multiSectionClassesCount} classes have multiple sections
          </p>
        </div>

        {/* Card 2: Enrolled Students */}
        <div className="p-4 rounded-2xl border bg-white border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-700">
            <span>STUDENT ENROLLMENT</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl md:text-3xl font-black text-emerald-950">{totalEnrolled}</span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
              Active
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            Avg. ~{totalSectionsCount > 0 ? Math.round(totalEnrolled / totalSectionsCount) : 0} students per section
          </p>
        </div>

        {/* Card 3: Pre-Primary & Primary */}
        <div
          onClick={() => setSelectedDivision('Primary')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            selectedDivision === 'Primary' || selectedDivision === 'Pre-Primary'
              ? 'bg-blue-50/70 border-blue-300 ring-2 ring-blue-500/20 shadow-xs'
              : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-blue-700">
            <span>FOUNDATION & PRIMARY</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl md:text-3xl font-black text-blue-950">
              {classes.filter(c => ['Pre-Primary', 'Primary'].includes(c.wing || getDivision(c.name))).length}
            </span>
            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/60">
              Nursery - 5th
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            Foundational & Preparatory Wing
          </p>
        </div>

        {/* Card 4: Middle & Senior Wing */}
        <div
          onClick={() => setSelectedDivision('Senior Secondary')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            selectedDivision === 'Senior Secondary' || selectedDivision === 'Secondary' || selectedDivision === 'Middle'
              ? 'bg-purple-50/70 border-purple-300 ring-2 ring-purple-500/20 shadow-xs'
              : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-purple-700">
            <span>MIDDLE & SENIOR WING</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl md:text-3xl font-black text-purple-950">
              {classes.filter(c => ['Middle', 'Secondary', 'Senior Secondary'].includes(c.wing || getDivision(c.name))).length}
            </span>
            <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200/60">
              6th - 12th
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            Science, Commerce, Arts streams
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="bg-white p-3.5 md:p-4 rounded-2xl shadow-xs border border-slate-200/80 space-y-3">
        {/* Wing Filter Tabs */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 border-b border-slate-100">
          <div className="flex items-center gap-1.5 flex-nowrap">
            {[
              { id: 'ALL', label: 'All Classes', count: totalClassesCount },
              { id: 'Pre-Primary', label: 'Pre-Primary (Nursery - UKG)', count: classes.filter(c => (c.wing || getDivision(c.name)) === 'Pre-Primary').length },
              { id: 'Primary', label: 'Primary (I - V)', count: classes.filter(c => (c.wing || getDivision(c.name)) === 'Primary').length },
              { id: 'Middle', label: 'Middle (VI - VIII)', count: classes.filter(c => (c.wing || getDivision(c.name)) === 'Middle').length },
              { id: 'Secondary', label: 'Secondary (IX - X)', count: classes.filter(c => (c.wing || getDivision(c.name)) === 'Secondary').length },
              { id: 'Senior Secondary', label: 'Senior Secondary (XI - XII)', count: classes.filter(c => (c.wing || getDivision(c.name)) === 'Senior Secondary').length }
            ].map(tab => {
              const isActive = selectedDivision === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedDivision(tab.id)}
                  className={`px-3 py-1.5 rounded-xl font-semibold text-xs whitespace-nowrap transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* View Mode Toggle: Table or Card Grid */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'table' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Wing Card View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
          </div>
        </div>

        {/* Search Input & Results Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              placeholder="Search by class name, section, teacher, room, or stream..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-10 pr-9 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/70 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>Showing <strong className="text-slate-900">{filteredClasses.length}</strong> of {totalClassesCount} classes</span>
            <span className="text-slate-300">•</span>
            <span className="text-indigo-600 font-semibold">{totalSectionsCount} Sections Active</span>
          </div>
        </div>
      </div>

      {/* Main Content: Table View */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 w-12 text-center">#</th>
                  <th className="py-3.5 px-4">CLASS & WING</th>
                  <th className="py-3.5 px-4 min-w-[240px]">
                    <div className="flex items-center gap-1.5">
                      <span>CONFIGURED SECTIONS</span>
                      <span className="text-[10px] lowercase font-normal text-slate-400">(click + to add)</span>
                    </div>
                  </th>
                  <th className="py-3.5 px-4">CLASS INCHARGE</th>
                  <th className="py-3.5 px-4 text-center">ROOM</th>
                  <th className="py-3.5 px-4 text-center">STUDENTS</th>
                  <th className="py-3.5 px-4 text-center w-28">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-14 text-center text-slate-400">
                      <div className="inline-block animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full mb-2"></div>
                      <div className="text-xs font-semibold">Loading class directory...</div>
                    </td>
                  </tr>
                ) : filteredClasses.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-14 text-center text-slate-400">
                      <GraduationCap className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                      <div className="text-sm font-bold text-slate-700">No classes found</div>
                      <div className="text-xs text-slate-400 mt-1">Try clearing your search query or division filter</div>
                    </td>
                  </tr>
                ) : (
                  filteredClasses.map((item, idx) => {
                    const division = item.wing || getDivision(item.name);
                    const divStyle = DIVISION_CONFIG[division] || DIVISION_CONFIG['Primary'];
                    const sectionsList = Array.isArray(item.sections) && item.sections.length > 0 ? item.sections : ['A'];
                    const isExpanded = expandedClassId === item.id;

                    return (
                      <React.Fragment key={item.id || idx}>
                        <tr
                          className={`hover:bg-slate-50/90 transition-colors group ${
                            isExpanded ? 'bg-indigo-50/30' : ''
                          }`}
                        >
                          {/* Order Index */}
                          <td className="py-3.5 px-4 text-center">
                            <span className="font-mono text-slate-400 font-bold text-xs">
                              {idx + 1}
                            </span>
                          </td>

                          {/* Class Name + Wing + Stream */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <span className={`w-2 h-2 rounded-full ${divStyle.dot} shrink-0`}></span>
                              <div>
                                <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                                  <span>{item.name}</span>
                                  {item.stream && (
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                                      {item.stream}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className={`text-[10px] font-semibold px-2 py-0.2 rounded-full border ${divStyle.badge}`}>
                                    {division}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Configured Sections with 1-Click Quick Add */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {sectionsList.map(sec => (
                                <div
                                  key={sec}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50/80 border border-indigo-200/80 text-indigo-700 font-bold text-xs font-mono shadow-2xs group/sec transition-all"
                                >
                                  <span>Sec {sec}</span>
                                  {sectionsList.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={(e) => handleQuickRemoveSection(item, sec, e)}
                                      className="opacity-0 group-hover/sec:opacity-100 hover:text-rose-600 p-0.5 rounded transition-opacity"
                                      title={`Remove Section ${sec}`}
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                              ))}

                              {/* 1-Click Quick Add Section Pill */}
                              {sectionsList.length < AVAILABLE_SECTIONS.length && (
                                <button
                                  type="button"
                                  onClick={(e) => handleQuickAddSection(item, e)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-dashed border-indigo-300 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-400 font-bold text-xs transition-colors"
                                  title="Add next section"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>Add Sec</span>
                                </button>
                              )}

                              <span className="text-[11px] text-slate-400 font-medium ml-1">
                                ({sectionsList.length} {sectionsList.length > 1 ? 'Sections' : 'Section'})
                              </span>
                            </div>
                          </td>

                          {/* Class Incharge / Teacher */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5 text-slate-700">
                              <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="font-medium text-xs">
                                {item.classTeacher || 'Not Assigned'}
                              </span>
                            </div>
                          </td>

                          {/* Room No */}
                          <td className="py-3.5 px-4 text-center">
                            {item.roomNo ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-[11px] font-bold">
                                <DoorOpen className="w-3 h-3 text-slate-400" />
                                {item.roomNo}
                              </span>
                            ) : (
                              <span className="text-slate-400 text-[11px]">—</span>
                            )}
                          </td>

                          {/* Enrolled Students */}
                          <td className="py-3.5 px-4 text-center">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-xs">
                              <Users className="w-3.5 h-3.5 text-slate-400" />
                              {item.studentCount || 0}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(item)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                                title="Edit Class, Sections & Teacher"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteClass(item.id, item.name)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                title="Delete Class"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="p-3.5 bg-slate-50/80 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2 font-medium">
            <div>
              Total Active Classes: <strong className="text-slate-800">{filteredClasses.length}</strong> | Total Sections: <strong className="text-indigo-600">{totalSectionsCount}</strong>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] bg-slate-200/60 px-2 py-0.5 rounded-md">
                Tip: Click <strong>+ Add Sec</strong> directly in any row to create additional sections!
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Wing Cards Grid View */
        <div className="space-y-6">
          {['Pre-Primary', 'Primary', 'Middle', 'Secondary', 'Senior Secondary'].map(wingCategory => {
            const wingClasses = filteredClasses.filter(c => (c.wing || getDivision(c.name)) === wingCategory);
            if (wingClasses.length === 0) return null;
            const style = DIVISION_CONFIG[wingCategory];

            return (
              <div key={wingCategory} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${style.dot}`}></span>
                    <h2 className="text-base font-bold text-slate-900">{style.title}</h2>
                    <span className="text-xs text-slate-400 font-medium">({style.subtitle})</span>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${style.badge}`}>
                    {wingClasses.length} Classes
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
                  {wingClasses.map(cls => {
                    const sections = Array.isArray(cls.sections) && cls.sections.length > 0 ? cls.sections : ['A'];

                    return (
                      <div
                        key={cls.id}
                        className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-bold text-sm text-slate-900">{cls.name}</h3>
                              {cls.stream && (
                                <span className="inline-block mt-0.5 text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  Stream: {cls.stream}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleOpenEdit(cls)}
                                className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                                title="Edit"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteClass(cls.id, cls.name)}
                                className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Class Teacher & Room */}
                          <div className="mt-3 space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400 flex items-center gap-1">
                                <UserCheck className="w-3.5 h-3.5" /> Incharge:
                              </span>
                              <span className="font-semibold text-slate-800 text-[11px] truncate max-w-[140px]">
                                {cls.classTeacher || 'Unassigned'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400 flex items-center gap-1">
                                <DoorOpen className="w-3.5 h-3.5" /> Room No:
                              </span>
                              <span className="font-mono font-bold text-slate-700 text-[11px]">
                                {cls.roomNo || 'N/A'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400 flex items-center gap-1">
                                <Users className="w-3.5 h-3.5" /> Total Students:
                              </span>
                              <span className="font-bold text-slate-900 text-xs">
                                {cls.studentCount || 0}
                              </span>
                            </div>
                          </div>

                          {/* Sections List */}
                          <div className="mt-3 pt-2.5 border-t border-slate-100">
                            <div className="text-[11px] font-semibold text-slate-500 mb-1.5 flex items-center justify-between">
                              <span>Sections ({sections.length}):</span>
                            </div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {sections.map(sec => (
                                <span
                                  key={sec}
                                  className="px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 font-mono font-bold text-[11px]"
                                >
                                  Sec {sec}
                                </span>
                              ))}
                              {sections.length < AVAILABLE_SECTIONS.length && (
                                <button
                                  type="button"
                                  onClick={(e) => handleQuickAddSection(cls, e)}
                                  className="px-1.5 py-0.5 rounded-md border border-dashed border-indigo-300 text-indigo-600 hover:bg-indigo-50 font-bold text-[11px] flex items-center gap-0.5"
                                  title="Add Section"
                                >
                                  <Plus className="w-3 h-3" /> Add
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD / EDIT CLASS MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4.5 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-slate-50 to-indigo-50/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">
                    {editingClass ? 'Edit Class Configuration' : 'Create New Class'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Set grade level, wing, sections, assigned teacher & room
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveClass} className="p-6 space-y-4 text-xs overflow-y-auto max-h-[calc(90vh-80px)]">
              {/* Presets Bar (Zero-scroll wrapped chips) */}
              {!editingClass && (
                <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Quick Grade Presets
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">Click to autofill</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { name: 'Nursery - PP3+', wing: 'Pre-Primary', room: 'KG-01' },
                      { name: 'LKG - PP4+', wing: 'Pre-Primary', room: 'KG-02' },
                      { name: 'UKG - PP5+', wing: 'Pre-Primary', room: 'KG-03' },
                      { name: 'Class I', wing: 'Primary', room: '101' },
                      { name: 'Class II', wing: 'Primary', room: '102' },
                      { name: 'Class III', wing: 'Primary', room: '103' },
                      { name: 'Class IV', wing: 'Primary', room: '104' },
                      { name: 'Class V', wing: 'Primary', room: '105' },
                      { name: 'Class VI', wing: 'Middle', room: '201' },
                      { name: 'Class VII', wing: 'Middle', room: '202' },
                      { name: 'Class VIII', wing: 'Middle', room: '203' },
                      { name: 'Class IX', wing: 'Secondary', room: '204' },
                      { name: 'Class X', wing: 'Secondary', room: '205' },
                      { name: 'Class XI - Science', wing: 'Senior Secondary', stream: 'SCIENCE', room: '301' },
                      { name: 'Class XII - Commerce', wing: 'Senior Secondary', stream: 'COMMERCE', room: '304' }
                    ].map(preset => {
                      const isSelected = className === preset.name;
                      return (
                        <button
                          type="button"
                          key={preset.name}
                          onClick={() => {
                            setClassName(preset.name);
                            setWing(preset.wing);
                            setStream(preset.stream || '');
                            if (preset.room && !roomNo) setRoomNo(preset.room);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                            isSelected
                              ? 'bg-indigo-600 text-white shadow-xs scale-102 ring-2 ring-indigo-300'
                              : 'bg-white hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 border border-slate-200/90 shadow-2xs'
                          }`}
                        >
                          {preset.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Class Name & Wing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Class / Grade Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={className}
                    onChange={e => {
                      setClassName(e.target.value);
                      if (!editingClass) {
                        setWing(getDivision(e.target.value));
                      }
                    }}
                    placeholder="e.g. Class I, Class IX, Nursery"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-normal focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Academic Wing / Level <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={wing}
                    onChange={e => setWing(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white transition-all"
                  >
                    <option value="Pre-Primary">Pre-Primary (Nursery - UKG)</option>
                    <option value="Primary">Primary (I - V)</option>
                    <option value="Middle">Middle (VI - VIII)</option>
                    <option value="Secondary">Secondary (IX - X)</option>
                    <option value="Senior Secondary">Senior Secondary (XI - XII)</option>
                  </select>
                </div>
              </div>

              {/* Optional Stream for 11th & 12th */}
              {(wing === 'Senior Secondary' || className.includes('XI') || className.includes('XII')) && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Academic Stream (Senior Secondary)
                  </label>
                  <select
                    value={stream}
                    onChange={e => setStream(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="">None / General</option>
                    <option value="SCIENCE">Science (Medical & Non-Medical)</option>
                    <option value="COMMERCE">Commerce</option>
                    <option value="HUMANITIES">Humanities / Arts</option>
                  </select>
                </div>
              )}

              {/* Sections Selection Chips */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Configure Active Sections <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Active: <strong className="text-indigo-600">{selectedSections.map(s => `Sec ${s}`).join(', ')}</strong> ({selectedSections.length} {selectedSections.length > 1 ? 'sections' : 'section'})
                  </span>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {AVAILABLE_SECTIONS.map(sec => {
                    const isChecked = selectedSections.includes(sec);
                    return (
                      <button
                        type="button"
                        key={sec}
                        onClick={() => handleToggleSection(sec)}
                        className={`py-2 rounded-xl font-mono text-xs flex flex-col items-center justify-center transition-all ${
                          isChecked
                            ? 'bg-indigo-600 text-white font-black shadow-sm shadow-indigo-200 ring-2 ring-indigo-400/30'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 font-bold'
                        }`}
                      >
                        <span className="text-sm">{sec}</span>
                        <span className="text-[9px] font-sans font-medium opacity-80">
                          {isChecked ? 'Active' : '+ Add'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Class Incharge / Teacher & Room No */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Designated Class Incharge
                  </label>
                  <select
                    value={classTeacher}
                    onChange={e => setClassTeacher(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="">-- Select Teacher --</option>
                    {TEACHERS_LIST.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Room No. / Hall
                  </label>
                  <input
                    type="text"
                    value={roomNo}
                    onChange={e => setRoomNo(e.target.value)}
                    placeholder="e.g. 101, KG-01, Lab 2"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-800 bg-white placeholder:text-slate-400 placeholder:font-normal focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Estimated Enrolled Students */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Total Student Strength (Approx.)
                </label>
                <input
                  type="number"
                  min="0"
                  value={studentCount === 0 ? '' : studentCount}
                  onChange={e => setStudentCount(e.target.value === '' ? 0 : Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-normal bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  placeholder="e.g. 60 (or leave empty if new)"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Auto-calculated from student registrations, but can be set manually for planning
                </p>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-xs shadow-sm shadow-indigo-200 transition-all active:scale-95"
                >
                  {editingClass ? 'Save Changes' : 'Create Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClassMasterPage;
