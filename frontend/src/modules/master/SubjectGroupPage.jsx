import React, { useState, useEffect, useMemo } from 'react';
import {
  Layers,
  Home,
  Search,
  Plus,
  Trash2,
  Edit2,
  X,
  BookOpen,
  GraduationCap,
  Sparkles,
  Award,
  Download,
  RefreshCw,
  LayoutGrid,
  List,
  CheckCircle2,
  HelpCircle,
  FileSpreadsheet
} from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORY_CONFIG = {
  'Scholastic': {
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
    title: 'Scholastic (Academic)',
    icon: BookOpen,
    description: 'Core academic curriculum evaluated by exam marks (0-100) & subject grades'
  },
  'Senior Streams': {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
    title: 'Senior Secondary Streams',
    icon: GraduationCap,
    description: 'Specialized 11th & 12th streams (Commerce, Science, Humanities / Arts)'
  },
  'Co-Scholastic': {
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
    title: 'Co-Scholastic & Activities',
    icon: Sparkles,
    description: 'Arts, Sports, ICT, Physical Education evaluated by CCE letter grades (A-E)'
  },
  'Discipline & Habits': {
    badge: 'bg-purple-50 text-purple-700 border-purple-200',
    dot: 'bg-purple-500',
    title: 'Discipline & Life Skills',
    icon: Award,
    description: 'Report card personality traits (Neatness, Confidence, Conduct & Punctuality)'
  }
};

const QUICK_GROUP_SUGGESTIONS = [
  { name: 'VOCATIONAL SKILLS', category: 'Co-Scholastic', evalType: 'Marks & Grade', desc: 'Applied technical & skill training' },
  { name: 'MUSIC & PERFORMING ARTS', category: 'Co-Scholastic', evalType: 'CCE Grade (A-E)', desc: 'Vocal, instrumental music & dance' },
  { name: 'FOREIGN LANGUAGE', category: 'Scholastic', evalType: 'Marks & Grade', desc: 'German, French, Spanish electives' },
  { name: 'ENVIRONMENTAL ETHICS', category: 'Scholastic', evalType: 'Marks & Grade', desc: 'Eco club and climate awareness' },
  { name: 'LEADERSHIP & TEAMWORK', category: 'Discipline & Habits', evalType: 'Rating (1-5 / A-E)', desc: 'House activities and club leadership' }
];

export function SubjectGroupPage({ onNavigate }) {
  const [groups, setGroups] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Scholastic');
  const [evaluationType, setEvaluationType] = useState('Marks & Grade');
  const [description, setDescription] = useState('');

  // Fetch groups and subjects from backend API
  const fetchData = async () => {
    try {
      setLoading(true);
      const [groupsRes, subjectsRes] = await Promise.all([
        fetch('/api/academics/subject-groups'),
        fetch('/api/academics/subjects')
      ]);

      const groupsData = await groupsRes.json();
      const subjectsData = await subjectsRes.json();

      if (groupsData.success && groupsData.data) {
        setGroups(groupsData.data);
      }
      if (subjectsData.success && subjectsData.data) {
        setSubjects(subjectsData.data);
      }
    } catch (err) {
      console.error('Failed to fetch subject groups:', err);
      toast.error('Failed to load subject groups from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Map each group to its linked subjects from subjectsStore
  const subjectsByGroup = useMemo(() => {
    const map = {};
    subjects.forEach(sub => {
      const gName = (sub.group || '').toUpperCase().trim();
      if (!map[gName]) map[gName] = [];
      map[gName].push(sub);
    });
    return map;
  }, [subjects]);

  const handleOpenAdd = () => {
    setEditingGroup(null);
    setName('');
    setCategory('Scholastic');
    setEvaluationType('Marks & Grade');
    setDescription('');
    setModalOpen(true);
  };

  const handleOpenEdit = (group) => {
    setEditingGroup(group);
    setName(group.name || '');
    setCategory(group.category || 'Scholastic');
    setEvaluationType(group.evaluationType || 'Marks & Grade');
    setDescription(group.description || '');
    setModalOpen(true);
  };

  const handleSaveGroup = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter a group name');
      return;
    }

    const payload = {
      name: name.trim().toUpperCase(),
      category,
      evaluationType,
      description: description.trim()
    };

    try {
      if (editingGroup) {
        const res = await fetch(`/api/academics/subject-groups/${editingGroup.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          toast.success(`Group "${payload.name}" updated!`, { icon: '✨' });
          setModalOpen(false);
          fetchData();
        } else {
          toast.error(data.message || 'Failed to update group');
        }
      } else {
        const res = await fetch('/api/academics/subject-groups', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          toast.success(`Group "${payload.name}" created!`, { icon: '🎉' });
          setModalOpen(false);
          fetchData();
        } else {
          toast.error(data.message || 'Failed to create group');
        }
      }
    } catch (err) {
      console.error('Error saving subject group:', err);
      toast.error('Network error. Please try again.');
    }
  };

  const handleDeleteGroup = async (id, groupName) => {
    if (!window.confirm(`Are you sure you want to delete the group "${groupName}"?`)) return;

    try {
      const res = await fetch(`/api/academics/subject-groups/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Group "${groupName}" deleted`);
        fetchData();
      } else {
        toast.error(data.message || 'Failed to delete group');
      }
    } catch (err) {
      console.error('Error deleting group:', err);
      toast.error('Network error');
    }
  };

  // Filter groups
  const filteredGroups = useMemo(() => {
    return groups.filter(g => {
      const cat = g.category || 'Scholastic';
      if (selectedCategory !== 'ALL' && cat !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = g.name?.toLowerCase().includes(q);
        const matchesDesc = g.description?.toLowerCase().includes(q);
        const matchesCat = cat.toLowerCase().includes(q);
        const linked = subjectsByGroup[g.name] || [];
        const matchesSub = linked.some(s => s.name?.toLowerCase().includes(q) || s.code?.includes(q));
        return matchesName || matchesDesc || matchesCat || matchesSub;
      }
      return true;
    });
  }, [groups, selectedCategory, searchQuery, subjectsByGroup]);

  // Counts
  const totalCount = groups.length;
  const scholasticCount = groups.filter(g => (g.category || 'Scholastic') === 'Scholastic').length;
  const streamsCount = groups.filter(g => g.category === 'Senior Streams').length;
  const coScholasticCount = groups.filter(g => g.category === 'Co-Scholastic').length;
  const disciplineCount = groups.filter(g => g.category === 'Discipline & Habits').length;

  const handleExportCSV = () => {
    const headers = ['S.No.,Subject Group,Category,Evaluation Mode,Linked Subjects Count,Description'];
    const rows = filteredGroups.map((g, i) => {
      const linked = subjectsByGroup[g.name] || [];
      return `${i + 1},"${g.name}","${g.category || 'Scholastic'}","${g.evaluationType || 'Marks & Grade'}",${linked.length},"${g.description || ''}"`;
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Subject_Groups_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Subject groups exported to CSV');
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
              onClick={() => onNavigate && onNavigate('/class-master')}
            >
              Academics & Masters
            </span>
            <span>/</span>
            <span className="text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded-md">
              Group Subject Master
            </span>
          </div>

          <h1 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm shadow-indigo-200">
              <Layers className="w-5 h-5" />
            </div>
            Subject Group Master (विषय समूह निर्देशिका)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Categorize subjects into Scholastic, Co-Scholastic, Streams & CCE Life Skills for Report Cards & Marksheets
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={fetchData}
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
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-indigo-200 transition-all active:scale-95"
            title="Add New Subject Group"
          >
            <Plus className="w-4 h-4" /> Add Subject Group
          </button>
        </div>
      </div>

      {/* 4 Explanatory KPI Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Scholastic (Academic) */}
        <div
          onClick={() => setSelectedCategory('Scholastic')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            selectedCategory === 'Scholastic'
              ? 'bg-blue-50/70 border-blue-300 ring-2 ring-blue-500/20 shadow-xs'
              : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-blue-700">
            <span>SCHOLASTIC (ACADEMIC)</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl md:text-3xl font-black text-blue-950">{scholasticCount}</span>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/60">
              Exam Marks (0-100)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            Math, Science, Hindi, English, SST, EVS
          </p>
        </div>

        {/* Card 2: Senior Streams */}
        <div
          onClick={() => setSelectedCategory('Senior Streams')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            selectedCategory === 'Senior Streams'
              ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500/20 shadow-xs'
              : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-emerald-700">
            <span>SENIOR STREAMS (11 & 12)</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl md:text-3xl font-black text-emerald-950">{streamsCount}</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
              Board Streams
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            Commerce, Humanities, Science Stream
          </p>
        </div>

        {/* Card 3: Co-Scholastic & Activities */}
        <div
          onClick={() => setSelectedCategory('Co-Scholastic')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            selectedCategory === 'Co-Scholastic'
              ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-500/20 shadow-xs'
              : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-amber-700">
            <span>CO-SCHOLASTIC & SKILLS</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl md:text-3xl font-black text-amber-950">{coScholasticCount}</span>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
              CCE Grades (A-E)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            Arts, Computer, PE, Sports, Work Edu.
          </p>
        </div>

        {/* Card 4: Discipline & Personality Traits */}
        <div
          onClick={() => setSelectedCategory('Discipline & Habits')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            selectedCategory === 'Discipline & Habits'
              ? 'bg-purple-50/70 border-purple-300 ring-2 ring-purple-500/20 shadow-xs'
              : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-purple-700">
            <span>DISCIPLINE & LIFE SKILLS</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl md:text-3xl font-black text-purple-950">{disciplineCount}</span>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200/60">
              Rating (A-C)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            Conduct, Neatness, Regularity, Confidence
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="bg-white p-3.5 md:p-4 rounded-2xl shadow-xs border border-slate-200/80 space-y-3">
        {/* Category Tabs */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 border-b border-slate-100">
          <div className="flex items-center gap-1.5 flex-nowrap">
            {[
              { id: 'ALL', label: 'All Groups', count: totalCount },
              { id: 'Scholastic', label: 'Scholastic (Academic)', count: scholasticCount },
              { id: 'Senior Streams', label: 'Senior Streams (11-12)', count: streamsCount },
              { id: 'Co-Scholastic', label: 'Co-Scholastic & Skills', count: coScholasticCount },
              { id: 'Discipline & Habits', label: 'Discipline & Life Skills', count: disciplineCount }
            ].map(tab => {
              const isActive = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
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

          {/* View Mode Toggle */}
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
              title="Category Cards View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
          </div>
        </div>

        {/* Search Input & Live Counts */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              placeholder="Search by group name (e.g. Science, Commerce, Discipline) or subject..."
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
            <span>Showing <strong className="text-slate-900">{filteredGroups.length}</strong> of {totalCount} groups</span>
            <span className="text-slate-300">•</span>
            <span className="text-indigo-600 font-semibold">{subjects.length} Total Subjects Configured</span>
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
                  <th className="py-3.5 px-4">SUBJECT GROUP & ROLE</th>
                  <th className="py-3.5 px-4">CATEGORY</th>
                  <th className="py-3.5 px-4 min-w-[280px]">MAPPED / LINKED SUBJECTS</th>
                  <th className="py-3.5 px-4 text-center">EVALUATION MODE</th>
                  <th className="py-3.5 px-4 text-center w-24">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-14 text-center text-slate-400">
                      <div className="inline-block animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full mb-2"></div>
                      <div className="text-xs font-semibold">Loading subject groups...</div>
                    </td>
                  </tr>
                ) : filteredGroups.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-14 text-center text-slate-400">
                      <Layers className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                      <div className="text-sm font-bold text-slate-700">No subject groups found</div>
                      <div className="text-xs text-slate-400 mt-1">Try clearing your search query or category filter</div>
                    </td>
                  </tr>
                ) : (
                  filteredGroups.map((g, idx) => {
                    const cat = g.category || 'Scholastic';
                    const config = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG['Scholastic'];
                    const linkedSubs = subjectsByGroup[g.name] || [];

                    return (
                      <tr key={g.id || idx} className="hover:bg-slate-50/90 transition-colors group">
                        {/* S.No. */}
                        <td className="py-3.5 px-4 text-center font-mono text-slate-400 font-bold text-xs">
                          {idx + 1}
                        </td>

                        {/* Group Name & Description */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <span className={`w-2 h-2 rounded-full ${config.dot} shrink-0`}></span>
                            <div>
                              <div className="font-bold text-slate-900 text-sm">
                                {g.name}
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                {g.description || config.description}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Category Tag */}
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold ${config.badge}`}>
                            <config.icon className="w-3.5 h-3.5" />
                            {cat}
                          </span>
                        </td>

                        {/* Mapped Subjects */}
                        <td className="py-3.5 px-4">
                          {linkedSubs.length > 0 ? (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {linkedSubs.map(s => (
                                <span
                                  key={s.id}
                                  className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px] border border-slate-200/70"
                                >
                                  {s.shortName || s.name}
                                </span>
                              ))}
                              <span className="text-[10px] text-slate-400 font-bold ml-1">
                                ({linkedSubs.length} {linkedSubs.length > 1 ? 'Subjects' : 'Subject'})
                              </span>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic flex items-center gap-1">
                              <span>No subjects mapped yet</span>
                              <span
                                onClick={() => onNavigate && onNavigate('/subject-master')}
                                className="text-indigo-600 font-semibold hover:underline cursor-pointer not-italic ml-1"
                              >
                                + Link in Subject Master
                              </span>
                            </span>
                          )}
                        </td>

                        {/* Evaluation Mode */}
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-block px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-mono text-[11px] font-bold">
                            {g.evaluationType || 'Marks & Grade'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(g)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                              title="Edit Group"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteGroup(g.id, g.name)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete Group"
                            >
                              <Trash2 className="w-4 h-4" />
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
          <div className="p-3.5 bg-slate-50/80 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2 font-medium">
            <div>
              Total Subject Groups: <strong className="text-slate-800">{filteredGroups.length}</strong>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] bg-slate-200/60 px-2 py-0.5 rounded-md">
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
              <span>These groups structure the Marksheet sections for Academic & Co-Scholastic report cards.</span>
            </div>
          </div>
        </div>
      ) : (
        /* Visual Cards Grid View */
        <div className="space-y-6">
          {['Scholastic', 'Senior Streams', 'Co-Scholastic', 'Discipline & Habits'].map(cat => {
            const catGroups = filteredGroups.filter(g => (g.category || 'Scholastic') === cat);
            if (catGroups.length === 0) return null;
            const config = CATEGORY_CONFIG[cat];

            return (
              <div key={cat} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${config.dot}`}></span>
                    <h2 className="text-base font-bold text-slate-900">{config.title}</h2>
                    <span className="text-xs text-slate-400 font-medium">({config.description})</span>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${config.badge}`}>
                    {catGroups.length} Groups
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
                  {catGroups.map(g => {
                    const linked = subjectsByGroup[g.name] || [];

                    return (
                      <div
                        key={g.id}
                        className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-bold text-sm text-slate-900">{g.name}</h3>
                              <span className="inline-block mt-0.5 text-[10px] font-mono font-bold text-slate-500">
                                {g.evaluationType || 'Marks & Grade'}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleOpenEdit(g)}
                                className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                                title="Edit"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteGroup(g.id, g.name)}
                                className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <p className="text-[11px] text-slate-500 mt-2 line-clamp-2">
                            {g.description || config.description}
                          </p>

                          {/* Linked Subjects */}
                          <div className="mt-3 pt-2.5 border-t border-slate-100">
                            <div className="text-[11px] font-semibold text-slate-500 mb-1.5">
                              Mapped Subjects ({linked.length}):
                            </div>
                            {linked.length > 0 ? (
                              <div className="flex items-center gap-1 flex-wrap">
                                {linked.map(s => (
                                  <span
                                    key={s.id}
                                    className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold"
                                  >
                                    {s.shortName || s.name}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-400 italic">No subjects mapped</span>
                            )}
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

      {/* ADD / EDIT GROUP MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4.5 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-slate-50 to-indigo-50/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">
                    {editingGroup ? 'Edit Subject Group' : 'Create Subject Group'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Define subject category & evaluation type for marksheets
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
            <form onSubmit={handleSaveGroup} className="p-6 space-y-4 text-xs overflow-y-auto max-h-[calc(90vh-80px)]">
              {/* Quick Suggestions (Zero-scroll wrapped chips) */}
              {!editingGroup && (
                <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Common Group Suggestions
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">Click to autofill</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_GROUP_SUGGESTIONS.map(sug => (
                      <button
                        type="button"
                        key={sug.name}
                        onClick={() => {
                          setName(sug.name);
                          setCategory(sug.category);
                          setEvaluationType(sug.evalType);
                          setDescription(sug.desc);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 font-semibold border border-slate-200 text-xs shadow-2xs transition-colors"
                      >
                        {sug.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Group Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Subject Group Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. LANGUAGES, COMPUTER SCIENCE, SPORTS"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white uppercase transition-all"
                />
              </div>

              {/* Category & Evaluation Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Group Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white transition-all"
                  >
                    <option value="Scholastic">Scholastic (Academic Subjects)</option>
                    <option value="Senior Streams">Senior Secondary Streams (11-12)</option>
                    <option value="Co-Scholastic">Co-Scholastic & Skills</option>
                    <option value="Discipline & Habits">Discipline & Life Skills (CCE)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Evaluation Mode <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={evaluationType}
                    onChange={e => setEvaluationType(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white transition-all"
                  >
                    <option value="Marks & Grade">Marks (0-100) & Grade</option>
                    <option value="CCE Grade (A-E)">CCE Letter Grade (A to E)</option>
                    <option value="Rating (1-5 / A-E)">Point Rating (1 to 5 / A to C)</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description / Report Card Note
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="e.g. Core mathematical skills and conceptual understanding"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-normal focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white transition-all"
                />
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
                  {editingGroup ? 'Save Changes' : 'Create Group'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubjectGroupPage;
