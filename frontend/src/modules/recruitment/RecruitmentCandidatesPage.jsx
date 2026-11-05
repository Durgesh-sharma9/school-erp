import React, { useState, useEffect, useMemo } from 'react';
import {
  Users, Search, SlidersHorizontal, Plus, Eye, Trash2, Pencil,
  MapPin, Briefcase, GraduationCap, Calendar, IndianRupee,
  Phone, MessageSquare, Mail, RotateCcw, ChevronDown, ChevronUp,
  List, LayoutGrid, Download, CheckCircle2, Award, Clock,
  ArrowUpDown, FileText
} from 'lucide-react';
import { recruitmentStore, PIPELINE_STAGES } from './recruitmentStore';
import { PageHeader } from './components/PageHeader';
import WhatsAppIcon from './components/WhatsAppIcon';
import { CandidateProfileModal } from './CandidateProfileModal';
import { CandidateDocumentsModal } from './components/CandidateDocumentsModal';

function formatDisplayDate(dateStr) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export function RecruitmentCandidatesPage({ onNavigate }) {
  const navigate = (path) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const [candidates, setCandidates] = useState([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'
  
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [docsModalCandidate, setDocsModalCandidate] = useState(null);
  const [sortField, setSortField] = useState('appliedDate');
  const [sortOrder, setSortOrder] = useState('desc');

  // Filters matching HireHub
  const [filters, setFilters] = useState({
    name: '',
    position: '',
    qualification: '',
    status: '',
    experience: '',
    city: '',
    area: '',
    expectedSalaryMin: '',
    expectedSalaryMax: '',
  });

  const loadData = () => {
    setCandidates(recruitmentStore.getCandidates());
  };

  useEffect(() => {
    loadData();
    try {
      const sp = new URLSearchParams(window.location.search);
      const pos = sp.get('position');
      const st = sp.get('status');
      if (pos || st) {
        setFilters(prev => ({
          ...prev,
          position: pos || prev.position,
          status: st || prev.status
        }));
      }
    } catch {}

    const handleUpdate = () => loadData();
    window.addEventListener('recruitment_updated', handleUpdate);
    return () => window.removeEventListener('recruitment_updated', handleUpdate);
  }, []);

  const updateFilter = (key, val) => {
    setFilters(prev => ({ ...prev, [key]: val }));
  };

  const clearAllFilters = () => {
    setFilters({
      name: '',
      position: '',
      qualification: '',
      status: '',
      experience: '',
      city: '',
      area: '',
      expectedSalaryMin: '',
      expectedSalaryMax: '',
    });
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Distinct Positions & Qualifications for dropdowns
  const distinctPositions = useMemo(() => {
    const set = new Set();
    candidates.forEach(c => { if (c.appliedPosition) set.add(c.appliedPosition); });
    return Array.from(set);
  }, [candidates]);

  const distinctQualifications = useMemo(() => {
    const set = new Set();
    candidates.forEach(c => { if (c.qualification) set.add(c.qualification); });
    return Array.from(set);
  }, [candidates]);

  // Filter & sort candidates
  const filteredCandidates = useMemo(() => {
    const res = candidates.filter(c => {
      if (filters.name.trim()) {
        const q = filters.name.toLowerCase().trim();
        const matchName = c.name?.toLowerCase().includes(q);
        const matchPhone = c.phone?.includes(q);
        const matchCity = c.city?.toLowerCase().includes(q);
        const matchArea = c.address?.toLowerCase().includes(q);
        if (!matchName && !matchPhone && !matchCity && !matchArea) return false;
      }
      if (filters.position && c.appliedPosition !== filters.position) return false;
      if (filters.status && c.status !== filters.status) return false;
      if (filters.qualification && c.qualification !== filters.qualification) return false;
      if (filters.experience && (c.experienceYears || 0) < Number(filters.experience)) return false;
      if (filters.city && !c.city?.toLowerCase().includes(filters.city.toLowerCase())) return false;
      if (filters.expectedSalaryMin && (c.expectedSalary || 0) < Number(filters.expectedSalaryMin)) return false;
      if (filters.expectedSalaryMax && (c.expectedSalary || 0) > Number(filters.expectedSalaryMax)) return false;

      return true;
    });

    return res.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (sortField === 'fullName' || sortField === 'name') {
        aVal = (a.name || '').toLowerCase();
        bVal = (b.name || '').toLowerCase();
      } else if (sortField === 'position' || sortField === 'appliedPosition') {
        aVal = (a.appliedPosition || '').toLowerCase();
        bVal = (b.appliedPosition || '').toLowerCase();
      } else if (sortField === 'experienceYears') {
        aVal = Number(a.experienceYears || 0);
        bVal = Number(b.experienceYears || 0);
      } else if (sortField === 'expectedSalary') {
        aVal = Number(a.expectedSalary || 0);
        bVal = Number(b.expectedSalary || 0);
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [candidates, filters, sortField, sortOrder]);

  const activeAdvancedCount = [
    filters.status,
    filters.experience,
    filters.city,
    filters.area,
    filters.expectedSalaryMin,
    filters.expectedSalaryMax
  ].filter(Boolean).length;

  const hasAnyActiveFilter = Object.values(filters).some(Boolean);

  const handleDeleteCandidate = (candidateId, name) => {
    if (window.confirm(`Are you sure you want to delete candidate ${name}?`)) {
      recruitmentStore.deleteCandidate(candidateId);
      loadData();
    }
  };

  const exportCSV = () => {
    const headers = ['ID,Name,Phone,Email,Applied Position,Department,Experience,Expected Salary,Status,Applied Date\n'];
    const rows = filteredCandidates.map(c => 
      `"${c.id}","${c.name}","${c.phone}","${c.email}","${c.appliedPosition}","${c.department}","${c.experienceYears} Years","${c.expectedSalary}","${c.status}","${c.appliedDate}"\n`
    );
    const blob = new Blob([...headers, ...rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Candidates_Talent_Pool_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-5 w-full antialiased text-slate-800 pb-16 max-w-7xl mx-auto min-h-screen bg-[#F4F7F6]/60">
      
      {/* ─── 1. PAGE HEADER (1:1 with HireHub) ─── */}
      <PageHeader
        title="My Candidates"
        description="Candidates added directly or received via school apply links."
        icon={Briefcase}
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={exportCSV}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-2xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
            <button
              onClick={() => navigate('/recruitment-add')}
              className="bg-gradient-to-r from-[#8A3BD4] to-[#A855F7] hover:opacity-95 text-white font-bold rounded-xl transition-all duration-200 active:scale-95 shrink-0 shadow-md shadow-purple-500/20 h-9 text-xs px-4 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5 stroke-[3]" /> Add Candidate
            </button>
          </div>
        }
      />

      {/* ─── 2. COMPACT & SLEEK FILTER CONTROL CENTER (HireHub style) ─── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-3.5 sm:p-4 space-y-3">
        
        {/* Primary Quick Search Bar Row */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              placeholder="Search by candidate name, location..."
              className="w-full pl-9 pr-3 h-9 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] text-xs font-medium bg-slate-50/50"
              value={filters.name}
              onChange={(e) => updateFilter('name', e.target.value)}
            />
          </div>

          {/* Quick Selects - Desktop */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <select
              value={filters.position}
              onChange={(e) => updateFilter('position', e.target.value)}
              className="h-9 px-3 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 bg-white focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] min-w-[150px]"
            >
              <option value="">All Positions</option>
              {distinctPositions.map(pos => (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </select>

            <select
              value={filters.qualification}
              onChange={(e) => updateFilter('qualification', e.target.value)}
              className="h-9 px-3 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 bg-white focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] min-w-[160px]"
            >
              <option value="">All Qualifications</option>
              {distinctQualifications.map(q => (
                <option key={q} value={q}>{q}</option>
              ))}
            </select>
          </div>

          {/* Advanced Filters Toggle Button */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`h-9 px-3 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                showAdvancedFilters
                  ? 'bg-teal-50 text-[#0F766E] border-[#0F766E]/40'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-[#0F766E]" />
              Filters
              {activeAdvancedCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-[#0F766E] text-white text-[10px] font-bold">
                  {activeAdvancedCount}
                </span>
              )}
              {showAdvancedFilters ? (
                <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              )}
            </button>

            {hasAnyActiveFilter && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="hidden sm:inline-flex h-9 px-2.5 text-xs text-slate-500 hover:text-slate-800 rounded-xl items-center cursor-pointer"
                title="Clear all filters"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1" /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Expandable Advanced Filters Drawer */}
        {showAdvancedFilters && (
          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2.5 animate-in fade-in duration-150">
            {/* Status Filter */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Pipeline Stage</label>
              <select
                value={filters.status}
                onChange={(e) => updateFilter('status', e.target.value)}
                className="w-full h-8 px-2.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 bg-white"
              >
                <option value="">All Stages</option>
                {PIPELINE_STAGES.filter(s => s.id !== 'all').map(s => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>

            {/* Min Experience */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Min Experience (Yrs)</label>
              <input
                type="number"
                placeholder="e.g. 2"
                value={filters.experience}
                onChange={(e) => updateFilter('experience', e.target.value)}
                className="w-full h-8 px-2.5 border border-slate-200 rounded-lg text-xs bg-white"
              />
            </div>

            {/* Min Salary */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Min Monthly ₹</label>
              <input
                type="number"
                placeholder="Min ₹"
                value={filters.expectedSalaryMin}
                onChange={(e) => updateFilter('expectedSalaryMin', e.target.value)}
                className="w-full h-8 px-2.5 border border-slate-200 rounded-lg text-xs bg-white"
              />
            </div>

            {/* Max Salary */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Max Monthly ₹</label>
              <input
                type="number"
                placeholder="Max ₹"
                value={filters.expectedSalaryMax}
                onChange={(e) => updateFilter('expectedSalaryMax', e.target.value)}
                className="w-full h-8 px-2.5 border border-slate-200 rounded-lg text-xs bg-white"
              />
            </div>

            {/* Drawer Bottom Actions */}
            <div className="col-span-2 sm:col-span-4 flex items-center justify-between pt-2 border-t border-slate-100">
              {hasAnyActiveFilter ? (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-xs text-rose-600 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" /> Reset Filters
                </button>
              ) : (
                <span className="text-[11px] text-slate-400 font-medium">Select options to filter</span>
              )}
              <button
                type="button"
                onClick={() => setShowAdvancedFilters(false)}
                className="px-3 py-1 text-xs font-bold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}

      </div>

      {/* ─── 3. CANDIDATES TABLE & LIST CONTAINER (HireHub style) ─── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        
        {/* Sub-header Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 bg-slate-50/50">
          <div className="text-xs font-semibold text-slate-500">
            Showing <span className="font-bold text-slate-800">{filteredCandidates.length}</span> candidates
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'list' ? 'bg-white shadow-2xs text-[#8A3BD4]' : 'text-slate-500'
              }`}
              title="List View"
            >
              <List className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'grid' ? 'bg-white shadow-2xs text-[#8A3BD4]' : 'text-slate-500'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Candidates View: List or Grid */}
        {filteredCandidates.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-slate-400 mx-auto flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">No candidates detected</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              We couldn't find matches for your active parameters. Try expanding your filters or add a new record.
            </p>
            <button
              onClick={clearAllFilters}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === 'list' ? (
          
          /* TABLE VIEW (1:1 with HireHub Screenshot) */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-700 uppercase tracking-wider select-none">
                  <th className="py-3 px-3 pl-4 w-[50px]">PHOTO</th>
                  <th 
                    className="py-3 px-3 cursor-pointer hover:text-[#8A3BD4] transition-colors"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      NAME <ArrowUpDown className="h-3 w-3 opacity-60" />
                    </div>
                  </th>
                  <th 
                    className="py-3 px-3 cursor-pointer hover:text-[#8A3BD4] transition-colors"
                    onClick={() => handleSort('appliedPosition')}
                  >
                    <div className="flex items-center gap-1">
                      POSITION <ArrowUpDown className="h-3 w-3 opacity-60" />
                    </div>
                  </th>
                  <th className="py-3 px-3">
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3 text-[#0F766E]" /> CONTACT
                    </div>
                  </th>
                  <th className="py-3 px-3">
                    <div className="flex items-center gap-1">
                      <GraduationCap className="h-3 w-3" /> QUALIFICATION
                    </div>
                  </th>
                  <th 
                    className="py-3 px-3 cursor-pointer hover:text-[#8A3BD4] transition-colors"
                    onClick={() => handleSort('experienceYears')}
                  >
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3" /> EXPERIENCE <ArrowUpDown className="h-3 w-3 opacity-60" />
                    </div>
                  </th>
                  <th 
                    className="py-3 px-3 cursor-pointer hover:text-[#8A3BD4] transition-colors"
                    onClick={() => handleSort('expectedSalary')}
                  >
                    <div className="flex items-center gap-1">
                      <IndianRupee className="h-3 w-3" /> SALARY <ArrowUpDown className="h-3 w-3 opacity-60" />
                    </div>
                  </th>
                  <th 
                    className="py-3 px-3 cursor-pointer hover:text-[#8A3BD4] transition-colors whitespace-nowrap"
                    onClick={() => handleSort('appliedDate')}
                  >
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> DATE <ArrowUpDown className="h-3 w-3 opacity-60" />
                    </div>
                  </th>
                  <th className="py-3 px-3 pr-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredCandidates.map(c => {
                  const hasShortlist = c.status === 'shortlisted';
                  const docCount = (c.documents && c.documents.length) || (c.resumeUrl ? 1 : 0);

                  return (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors group">
                      
                      {/* 1. PHOTO */}
                      <td className="py-2.5 px-3 pl-4">
                        {c.photoUrl ? (
                          <div className="h-9 w-9 rounded-full p-0.5 border border-slate-200 overflow-hidden shadow-2xs">
                            <img src={c.photoUrl} alt={c.name} className="h-full w-full rounded-full object-cover" />
                          </div>
                        ) : (
                          <div className="h-9 w-9 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center border border-slate-200">
                            {c.name?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                        )}
                      </td>

                      {/* 2. NAME */}
                      <td className="py-2.5 px-3 font-bold text-slate-800">
                        <div className="flex flex-col">
                          <span 
                            onClick={() => {
                              setSelectedCandidate(c);
                              setShowProfileModal(true);
                            }}
                            className="cursor-pointer hover:text-[#0F766E] transition-colors truncate max-w-[180px]"
                          >
                            {c.name}
                          </span>
                          {hasShortlist && (
                            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-200 w-fit mt-0.5">
                              SHORTLISTED
                            </span>
                          )}
                          {!hasShortlist && c.status && c.status !== 'new' && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider bg-slate-100 text-slate-600 w-fit mt-0.5">
                              {c.status.replace(/_/g, ' ')}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 3. POSITION */}
                      <td className="py-2.5 px-3 font-semibold text-slate-700">
                        <div className="truncate max-w-[160px]">{c.appliedPosition}</div>
                        {c.subject && (
                          <div className="text-[10px] text-[#0F766E] font-medium truncate max-w-[160px]">
                            {c.subject}
                          </div>
                        )}
                      </td>

                      {/* 4. CONTACT */}
                      <td className="py-2.5 px-3">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-800 text-xs font-mono tracking-tight">
                            {c.phone}
                          </span>
                          {c.email && (
                            <span className="text-[10px] text-slate-400 truncate max-w-[150px]">
                              {c.email}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 5. QUALIFICATION */}
                      <td className="py-2.5 px-3 text-slate-600 font-medium text-xs truncate max-w-[140px]">
                        {c.qualification || '—'}
                      </td>

                      {/* 6. EXPERIENCE */}
                      <td className="py-2.5 px-3 text-xs font-semibold text-slate-700 whitespace-nowrap">
                        {c.experienceYears > 0 ? `${c.experienceYears} yrs` : 'Fresher'}
                      </td>

                      {/* 7. SALARY */}
                      <td className="py-2.5 px-3 text-xs font-bold text-slate-800 font-mono whitespace-nowrap">
                        {c.expectedSalary ? `₹${Number(c.expectedSalary).toLocaleString('en-IN')}` : '—'}
                      </td>

                      {/* 8. DATE */}
                      <td className="py-2.5 px-3 text-slate-500 font-medium text-xs whitespace-nowrap">
                        {formatDisplayDate(c.appliedDate)}
                      </td>

                      {/* 9. ACTIONS (1:1 with HireHub Buttons) */}
                      <td className="py-2.5 px-3 pr-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Call Button */}
                          {c.phone && (
                            <a
                              href={`tel:${c.phone}`}
                              className="h-7 w-7 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center border border-blue-200/70 transition-all hover:scale-105 shadow-2xs"
                              title={`Call ${c.phone}`}
                            >
                              <Phone className="h-3.5 w-3.5" />
                            </a>
                          )}

                          {/* WhatsApp Button */}
                          {c.phone && (
                            <a
                              href={`https://wa.me/91${String(c.whatsapp || c.phone).replace(/\D/g, '').slice(-10)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="h-7 w-7 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center border border-emerald-200/70 transition-all hover:scale-105 shadow-2xs"
                              title="WhatsApp Chat"
                            >
                              <WhatsAppIcon className="h-3.5 w-3.5 fill-emerald-600" />
                            </a>
                          )}

                          {/* Documents Button */}
                          <button
                            type="button"
                            onClick={() => setDocsModalCandidate(c)}
                            className="h-7 w-7 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 flex items-center justify-center border border-purple-200/70 transition-all hover:scale-105 shadow-2xs cursor-pointer relative"
                            title="View Attached Documents"
                          >
                            <FileText className="h-3.5 w-3.5 text-purple-600" />
                            {docCount > 0 && (
                              <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-purple-600 text-white text-[8px] font-extrabold flex items-center justify-center">
                                {docCount}
                              </span>
                            )}
                          </button>

                          {/* View Eye Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCandidate(c);
                              setShowProfileModal(true);
                            }}
                            className="h-7 w-7 rounded-lg bg-purple-50 hover:bg-purple-100 text-[#8A3BD4] flex items-center justify-center border border-purple-200/70 transition-all hover:scale-105 shadow-2xs cursor-pointer"
                            title="View Profile"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>

                          {/* Edit Pencil Button */}
                          <button
                            type="button"
                            onClick={() => navigate(`/recruitment-add?id=${c.id}`)}
                            className="h-7 w-7 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 flex items-center justify-center border border-amber-200/70 transition-all hover:scale-105 shadow-2xs cursor-pointer"
                            title="Edit Candidate"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        ) : (

          /* GRID VIEW */
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredCandidates.map(c => (
              <div
                key={c.id}
                className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-600 text-white font-bold flex items-center justify-center shrink-0">
                        {c.name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <h4 
                          onClick={() => {
                            setSelectedCandidate(c);
                            setShowProfileModal(true);
                          }}
                          className="font-bold text-slate-900 hover:text-[#8A3BD4] cursor-pointer text-sm"
                        >
                          {c.name}
                        </h4>
                        <p className="text-xs text-[#0F766E] font-medium">{c.appliedPosition}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-slate-500 space-y-1">
                    <p><span className="text-slate-400">Qual:</span> {c.qualification || '—'}</p>
                    <p><span className="text-slate-400">Exp:</span> {c.experienceYears} yrs</p>
                    <p><span className="text-slate-400">Salary:</span> ₹{Number(c.expectedSalary || 0).toLocaleString('en-IN')}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">{formatDisplayDate(c.appliedDate)}</span>
                  <button
                    onClick={() => {
                      setSelectedCandidate(c);
                      setShowProfileModal(true);
                    }}
                    className="text-[#8A3BD4] font-bold hover:underline flex items-center gap-1"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Profile Modal */}
      {showProfileModal && selectedCandidate && (
        <CandidateProfileModal
          candidate={selectedCandidate}
          isOpen={showProfileModal}
          onClose={() => {
            setShowProfileModal(false);
            setSelectedCandidate(null);
          }}
          onStatusChange={() => loadData()}
          onCandidateDeleted={() => loadData()}
        />
      )}

      {/* Candidate Documents Modal */}
      {docsModalCandidate && (
        <CandidateDocumentsModal
          isOpen={Boolean(docsModalCandidate)}
          onClose={() => setDocsModalCandidate(null)}
          candidate={{
            fullName: docsModalCandidate.name,
            documents: docsModalCandidate.documents || (docsModalCandidate.resumeUrl ? [{ name: 'Resume / CV', url: docsModalCandidate.resumeUrl }] : [])
          }}
        />
      )}

    </div>
  );
}
