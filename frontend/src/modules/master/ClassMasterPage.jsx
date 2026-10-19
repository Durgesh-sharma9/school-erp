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
  FileSpreadsheet,
  Download,
  Filter,
  CheckCircle2,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';
import toast from 'react-hot-toast';

// Helper to determine division from class name
const getDivision = (name = '') => {
  const upper = name.toUpperCase();
  if (upper.includes('NURSERY') || upper.includes('KINDERGARTEN') || upper.includes('PP3') || upper.includes('PP4') || upper.includes('PP5') || upper.includes('LKG') || upper.includes('UKG')) {
    return 'Pre-Primary';
  }
  if (upper.startsWith('XI') || upper.startsWith('XII')) {
    return 'Senior Secondary';
  }
  if (upper === 'IX' || upper === 'X' || upper.startsWith('IX ') || upper.startsWith('X ')) {
    return 'Secondary';
  }
  if (upper === 'VI' || upper === 'VII' || upper === 'VIII' || upper.startsWith('VI ') || upper.startsWith('VII ') || upper.startsWith('VIII ')) {
    return 'Middle';
  }
  return 'Primary';
};

const DIVISION_TAG_COLORS = {
  'Pre-Primary': 'bg-pink-50 text-pink-700 border-pink-200',
  'Primary': 'bg-blue-50 text-blue-700 border-blue-200',
  'Middle': 'bg-amber-50 text-amber-700 border-amber-200',
  'Secondary': 'bg-purple-50 text-purple-700 border-purple-200',
  'Senior Secondary': 'bg-emerald-50 text-emerald-700 border-emerald-200'
};

const AVAILABLE_SECTIONS = ['A', 'B', 'C', 'D', 'E', 'F'];

export function ClassMasterPage({ onNavigate }) {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('ALL');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [className, setClassName] = useState('');
  const [selectedSections, setSelectedSections] = useState(['A']);
  const [priority, setPriority] = useState(1);
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
    setSelectedSections(['A']);
    setPriority(classes.length + 1);
    setStudentCount(0);
    setModalOpen(true);
  };

  const handleOpenEdit = (cls) => {
    setEditingClass(cls);
    setClassName(cls.name || '');
    setSelectedSections(Array.isArray(cls.sections) && cls.sections.length > 0 ? cls.sections : ['A']);
    setPriority(cls.priority || 1);
    setStudentCount(cls.studentCount || 0);
    setModalOpen(true);
  };

  const handleToggleSection = (sec) => {
    if (selectedSections.includes(sec)) {
      if (selectedSections.length === 1) {
        toast.error('At least one section is required');
        return;
      }
      setSelectedSections(selectedSections.filter(s => s !== sec));
    } else {
      setSelectedSections([...selectedSections, sec].sort());
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

    try {
      if (editingClass) {
        // Update existing class
        const res = await fetch(`http://localhost:5000/api/academics/classes/${editingClass.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: className.trim(),
            sections: selectedSections,
            priority: Number(priority) || 1,
            studentCount: Number(studentCount) || 0
          })
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
        // Add new class
        const res = await fetch('http://localhost:5000/api/academics/classes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: className.trim(),
            sections: selectedSections,
            priority: Number(priority) || classes.length + 1
          })
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
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
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
      const division = getDivision(cls.name);
      if (selectedDivision !== 'ALL' && division !== selectedDivision) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = cls.name?.toLowerCase().includes(query);
        const matchesDivision = division.toLowerCase().includes(query);
        const matchesSec = cls.sections?.some(s => s.toLowerCase().includes(query));
        const matchesPriority = String(cls.priority).includes(query);
        return matchesName || matchesDivision || matchesSec || matchesPriority;
      }
      return true;
    });
  }, [classes, searchQuery, selectedDivision]);

  // Statistics
  const totalClassesCount = classes.length;
  const totalSectionsCount = classes.reduce((sum, c) => sum + (Array.isArray(c.sections) ? c.sections.length : 1), 0);
  const primaryCount = classes.filter(c => ['Pre-Primary', 'Primary'].includes(getDivision(c.name))).length;
  const secondaryCount = classes.filter(c => ['Middle', 'Secondary', 'Senior Secondary'].includes(getDivision(c.name))).length;
  const totalEnrolled = classes.reduce((sum, c) => sum + (c.studentCount || 0), 0);

  const handleExportCSV = () => {
    const headers = ['S.No.,Class Name,Division,Sections,Priority,Estimated Students'];
    const rows = filteredClasses.map((c, i) =>
      `${i + 1},"${c.name}","${getDivision(c.name)}","${(c.sections || ['A']).join(', ')}",${c.priority || i + 1},${c.studentCount || 0}`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Class_Master_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Classes exported to CSV');
  };

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen text-slate-800 space-y-4">
      {/* Top Header Card */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white p-4 rounded-xl shadow-xs border border-slate-200/80 gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200/80 text-indigo-600 flex items-center justify-center shadow-2xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            Class Master & Section Directory
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span
              className="flex items-center gap-1 hover:text-indigo-600 cursor-pointer"
              onClick={() => onNavigate && onNavigate('/')}
            >
              <Home className="w-3.5 h-3.5" /> Dashboard
            </span>
            <span>/</span>
            <span
              className="hover:text-indigo-600 cursor-pointer"
              onClick={() => onNavigate && onNavigate('/class-list')}
            >
              Masters
            </span>
            <span>/</span>
            <span className="text-indigo-600 font-semibold">Class Master</span>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200/90 shadow-2xs transition-all"
            title="Export CSV"
          >
            <Download className="w-4 h-4 text-slate-500" /> Export CSV
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-all active:scale-95"
            title="Add New Class"
          >
            <Plus className="w-4 h-4" /> Add Class
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          onClick={() => setSelectedDivision('ALL')}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            selectedDivision === 'ALL'
              ? 'bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
              : 'bg-white border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Total Classes</span>
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalClassesCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">{totalSectionsCount} total sections configured</div>
        </div>

        <div className="p-3.5 rounded-xl border bg-white border-slate-200/80">
          <div className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider flex items-center justify-between">
            <span>Enrolled Students</span>
            <Users className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-950 mt-1">{totalEnrolled}</div>
          <div className="text-[11px] text-emerald-700 mt-0.5">Across all standard grades</div>
        </div>

        <div
          onClick={() => setSelectedDivision('Primary')}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            selectedDivision === 'Primary' || selectedDivision === 'Pre-Primary'
              ? 'bg-blue-50/70 border-blue-300 ring-2 ring-blue-500/20 shadow-xs'
              : 'bg-white border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider flex items-center justify-between">
            <span>Pre-Primary & Primary</span>
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-blue-950 mt-1">{primaryCount}</div>
          <div className="text-[11px] text-blue-700 mt-0.5">Nursery through Grade 5</div>
        </div>

        <div
          onClick={() => setSelectedDivision('Senior Secondary')}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            selectedDivision === 'Senior Secondary' || selectedDivision === 'Secondary'
              ? 'bg-purple-50/70 border-purple-300 ring-2 ring-purple-500/20 shadow-xs'
              : 'bg-white border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-semibold text-purple-600 uppercase tracking-wider flex items-center justify-between">
            <span>Middle & Senior Wing</span>
            <GraduationCap className="w-3.5 h-3.5 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-purple-950 mt-1">{secondaryCount}</div>
          <div className="text-[11px] text-purple-700 mt-0.5">Grade 6 through Grade 12</div>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="bg-white p-3.5 rounded-xl shadow-xs border border-slate-200/80 space-y-3">
        {/* Division Filter Tabs */}
        <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2.5 overflow-x-auto text-xs">
          {[
            { id: 'ALL', label: 'All Classes', count: totalClassesCount },
            { id: 'Pre-Primary', label: 'Pre-Primary (Nursery - UKG)', count: classes.filter(c => getDivision(c.name) === 'Pre-Primary').length },
            { id: 'Primary', label: 'Primary (I - V)', count: classes.filter(c => getDivision(c.name) === 'Primary').length },
            { id: 'Middle', label: 'Middle (VI - VIII)', count: classes.filter(c => getDivision(c.name) === 'Middle').length },
            { id: 'Secondary', label: 'Secondary (IX - X)', count: classes.filter(c => getDivision(c.name) === 'Secondary').length },
            { id: 'Senior Secondary', label: 'Senior Secondary (XI - XII)', count: classes.filter(c => getDivision(c.name) === 'Senior Secondary').length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedDivision(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                selectedDivision === tab.id
                  ? 'bg-indigo-600 text-white shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                selectedDivision === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by class name, section (e.g. PP3+, X, Section A)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-indigo-600">{filteredClasses.length}</strong> of {totalClassesCount} classes
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 w-14 text-center">S.NO.</th>
                <th className="py-3 px-4">CLASS & DIVISION</th>
                <th className="py-3 px-4">CONFIGURED SECTIONS</th>
                <th className="py-3 px-4 text-center">STUDENTS</th>
                <th className="py-3 px-4 text-center w-24">PRIORITY</th>
                <th className="py-3 px-4 text-center w-24">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="inline-block animate-spin w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full mb-2"></div>
                    <div>Loading classes...</div>
                  </td>
                </tr>
              ) : filteredClasses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <GraduationCap className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    No classes found matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredClasses.map((item, idx) => {
                  const division = getDivision(item.name);
                  const sectionsList = Array.isArray(item.sections) && item.sections.length > 0
                    ? item.sections
                    : ['A'];

                  return (
                    <tr key={item.id || idx} className="hover:bg-slate-50/80 transition-colors">
                      {/* S.No */}
                      <td className="py-3 px-4 text-center font-mono text-slate-500 font-semibold">
                        {idx + 1}
                      </td>

                      {/* Class Name + Division Tag */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <span className="font-bold text-slate-900 text-sm">
                            {item.name}
                          </span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${DIVISION_TAG_COLORS[division] || 'bg-slate-50 text-slate-700 border-slate-200'}`}>
                            {division}
                          </span>
                        </div>
                      </td>

                      {/* Sections Badges */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {sectionsList.map(sec => (
                            <span
                              key={sec}
                              className="px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-200/80 text-indigo-700 font-bold text-[11px] font-mono shadow-2xs"
                            >
                              Sec {sec}
                            </span>
                          ))}
                          <span className="text-[11px] text-slate-400 font-medium ml-1">
                            ({sectionsList.length} {sectionsList.length > 1 ? 'Sections' : 'Section'})
                          </span>
                        </div>
                      </td>

                      {/* Enrolled Students */}
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px]">
                          <Users className="w-3 h-3 text-slate-400" />
                          {item.studentCount || 0}
                        </span>
                      </td>

                      {/* Priority Badge */}
                      <td className="py-3 px-4 text-center">
                        <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                          #{item.priority || idx + 1}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            title="Edit Class & Sections"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteClass(item.id, item.name)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Class"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-3 bg-slate-50/70 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
          <div className="font-medium">
            Total configured classes: <strong className="text-slate-800">{filteredClasses.length}</strong>
          </div>
          <div className="flex items-center space-x-2">
            <span>Showing all {filteredClasses.length} records</span>
          </div>
        </div>
      </div>

      {/* ADD / EDIT CLASS MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center font-bold">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    {editingClass ? 'Edit Class Details' : 'Add New Class'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Configure class grade, sections, and priority ranking
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveClass} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Class Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={className}
                  onChange={e => setClassName(e.target.value)}
                  placeholder="e.g. Nursery - PP3+, Grade X, XI - SCIENCE"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-semibold"
                />
              </div>

              {/* Sections Selection Chips */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Assigned Sections <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {AVAILABLE_SECTIONS.map(sec => {
                    const isChecked = selectedSections.includes(sec);
                    return (
                      <button
                        type="button"
                        key={sec}
                        onClick={() => handleToggleSection(sec)}
                        className={`w-9 h-9 rounded-lg font-mono font-bold text-xs flex items-center justify-center transition-all ${
                          isChecked
                            ? 'bg-indigo-600 text-white shadow-2xs scale-105'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {sec}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Selected: <strong>{selectedSections.join(', ')}</strong> ({selectedSections.length} sections)
                </p>
              </div>

              {/* Priority & Student Count */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Display Priority Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={priority}
                    onChange={e => setPriority(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                  <p className="text-[10px] text-slate-400 mt-0.5">Controls position in dropdowns</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Est. Students Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={studentCount}
                    onChange={e => setStudentCount(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                  <p className="text-[10px] text-slate-400 mt-0.5">Approx enrollment</p>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-xs transition-colors"
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
