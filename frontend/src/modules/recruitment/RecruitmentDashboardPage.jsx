import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, Plus, ArrowRight, Sparkles, Loader2, 
  Briefcase, Eye, GraduationCap, Phone, UserCheck,
  PieChart, BarChart3, QrCode, CheckCircle2, Award, Calendar,
  Clock, ChevronRight, Inbox, BookmarkCheck, MessageCircle, 
  Search, ShieldCheck, ArrowUpRight
} from 'lucide-react';
import { recruitmentStore, PIPELINE_STAGES } from './recruitmentStore';
import { CandidateProfileModal } from './CandidateProfileModal';
import { CandidateAddEditModal } from './CandidateAddEditModal';
import WhatsAppIcon from './components/WhatsAppIcon';

/* ─────────────────────────────────────────────────────────────
   Executive Subject Breakdown Donut Chart (Pure SVG & Interactive)
   Identical to HireHub Dashboard
   ───────────────────────────────────────────────────────────── */
function SubjectDonutChart({ segments = [], totalLabel = 'Total', totalValue = 0, onRoleClick }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const total = segments.reduce((sum, s) => sum + (s.value || 0), 0) || totalValue || 0;

  const radius = 54;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius; // ~339.29

  const gap = segments.length > 1 ? 3.5 : 0;
  let accumulatedLength = 0;
  const computedSegments = segments.map((seg) => {
    const val = seg.value || 0;
    const ratio = total > 0 ? val / total : 0;
    const rawDash = ratio * circumference;
    const dashLength = Math.max(1, rawDash - gap);
    const strokeDasharray = `${dashLength} ${circumference - dashLength}`;
    const strokeDashoffset = -accumulatedLength;
    accumulatedLength += rawDash;

    return {
      ...seg,
      percentage: total > 0 ? Math.round(ratio * 100) : 0,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  const activeSegment = hoveredIndex !== null ? computedSegments[hoveredIndex] : null;

  return (
    <div className="flex flex-col items-center justify-between h-full space-y-3.5">
      {/* Central SVG Ring with Interactive Center */}
      <div 
        className="relative flex items-center justify-center cursor-pointer group select-none"
        onClick={() => onRoleClick && onRoleClick(activeSegment ? activeSegment.label : '')}
        title={activeSegment ? `Click to view ${activeSegment.value} ${activeSegment.label} candidates` : 'Click to view all biodatas'}
      >
        <svg
          viewBox="0 0 150 150"
          className="w-36 h-36 sm:w-44 sm:h-44 -rotate-90 transform drop-shadow-xs"
        >
          {/* Background Track */}
          <circle
            cx="75"
            cy="75"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-100"
          />

          {/* Slices */}
          {total > 0 ? (
            computedSegments.map((seg, idx) => {
              const isHovered = hoveredIndex === idx;
              const hasActiveHover = hoveredIndex !== null;
              return (
                <circle
                  key={idx}
                  cx="75"
                  cy="75"
                  r={radius}
                  fill="transparent"
                  stroke={seg.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={seg.strokeDasharray}
                  strokeDashoffset={seg.strokeDashoffset}
                  strokeLinecap="butt"
                  className={`transition-all duration-200 cursor-pointer ${
                    hasActiveHover && !isHovered ? 'opacity-40' : 'opacity-100'
                  }`}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              );
            })
          ) : (
            <circle
              cx="75"
              cy="75"
              r={radius}
              fill="transparent"
              stroke="#CBD5E1"
              strokeWidth={strokeWidth}
              strokeDasharray="4 4"
            />
          )}
        </svg>

        {/* Center Interactive Information */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2 pointer-events-none">
          {activeSegment ? (
            <div className="animate-in fade-in zoom-in-95 duration-150 flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none">
                {activeSegment.value}
              </span>
              <span className="text-[10px] font-extrabold text-[#8A3BD4] uppercase tracking-wider truncate max-w-[110px] mt-0.5">
                {activeSegment.label}
              </span>
              <span className="text-[9.5px] font-bold text-slate-500 mt-0.5">
                {activeSegment.percentage}% of pool
              </span>
              <span className="text-[9px] font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5">
                View →
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none">
                {totalValue}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                {totalLabel}
              </span>
              <span className="text-[9px] text-slate-400 mt-0.5">
                {segments.length} Roles
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Legend List */}
      <div className="w-full space-y-1.5 pt-1 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
        {total === 0 ? (
          <p className="text-xs text-slate-400 text-center py-2">No candidate subjects recorded yet.</p>
        ) : (
          computedSegments.map((seg, idx) => {
            const isHovered = hoveredIndex === idx;
            return (
              <div
                key={idx}
                onClick={() => onRoleClick && onRoleClick(seg.label)}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs group active:scale-[0.98] ${
                  isHovered
                    ? 'bg-purple-50/90 border-[#8A3BD4]/40 shadow-xs'
                    : 'bg-slate-50/70 border-slate-200/60 hover:border-slate-300'
                }`}
                title={`Filter biodatas for ${seg.label}`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0 transition-transform group-hover:scale-125"
                    style={{ backgroundColor: seg.color }}
                  />
                  <span className="font-bold text-slate-800 truncate group-hover:text-[#8A3BD4] transition-colors">
                    {seg.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono text-slate-500 text-[11px]">
                    {seg.value}
                  </span>
                  <span className="font-extrabold text-slate-900 text-xs">
                    {seg.percentage}%
                  </span>
                  <ArrowUpRight className="h-3 w-3 text-slate-400 group-hover:text-[#8A3BD4] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main Executive Dashboard Page (Identical to HireHub Dashboard)
   ───────────────────────────────────────────────────────────── */
export function RecruitmentDashboardPage({ onNavigate }) {
  const navigate = (path) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const [candidates, setCandidates] = useState([]);
  const [openings, setOpenings] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const loadData = () => {
    setCandidates(recruitmentStore.getCandidates());
    setOpenings(recruitmentStore.getJobOpenings());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('recruitment_updated', handleUpdate);
    window.addEventListener('recruitment_openings_updated', handleUpdate);
    return () => {
      window.removeEventListener('recruitment_updated', handleUpdate);
      window.removeEventListener('recruitment_openings_updated', handleUpdate);
    };
  }, []);

  const totalCandidates = candidates.length;
  const shortlisted = candidates.filter(c => c.status === 'shortlisted').length;
  const demoInterview = candidates.filter(c => c.status === 'interview_scheduled' || c.status === 'demo_class').length;
  const hired = candidates.filter(c => c.status === 'hired').length;
  const bEdCount = candidates.filter(c => c.bEdCompleted).length;
  const bEdPercentage = totalCandidates > 0 ? Math.round((bEdCount / totalCandidates) * 100) : 0;

  // Donut Colors for Subject Categories
  const SUBJECT_COLORS = ['#00D2FF', '#8A3BD4', '#0F766E', '#3B82F6', '#F59E0B', '#EC4899'];

  // Calculate position breakdown
  const positionMap = {};
  candidates.forEach(c => {
    const pos = c.appliedPosition || 'General Staff';
    positionMap[pos] = (positionMap[pos] || 0) + 1;
  });

  const subjectSegments = Object.entries(positionMap).map(([role, count], idx) => ({
    label: role,
    value: count,
    color: SUBJECT_COLORS[idx % SUBJECT_COLORS.length],
  }));

  const handleRoleClick = (roleName) => {
    if (!roleName) {
      navigate('/recruitment-candidates');
      return;
    }
    navigate(`/recruitment-candidates?position=${encodeURIComponent(roleName)}`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-5 w-full antialiased text-slate-800 pb-16 max-w-7xl mx-auto min-h-screen bg-[#F4F7F6]/60">
      
      {/* ─── 1. TOP HEADER: Clean Recruiter Desk Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-[#F0FCF5] via-[#EFF6FF] to-[#FAF5FF] p-3.5 sm:px-5 sm:py-3.5 rounded-2xl shadow-2xs border border-slate-200/80">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2.5 bg-white text-[#8A3BD4] rounded-xl border border-slate-200/80 shadow-2xs shrink-0">
            <Briefcase className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 truncate">
                Teacher Recruitment Desk
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-50 text-[#8A3BD4] border border-purple-200/60 shrink-0">
                {totalCandidates} Total Biodatas
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
              Manage incoming applications, demo interviews & teacher selections • JD International School
            </p>
          </div>
        </div>
        
        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex-1 sm:flex-initial h-9 px-3.5 rounded-lg bg-gradient-to-r from-[#7C3AED] via-[#8A3BD4] to-[#00D2FF] hover:from-[#6D28D9] hover:via-[#7E22CE] hover:to-[#0284C7] text-white font-bold text-xs shadow-sm shadow-cyan-500/20 transition-all cursor-pointer border-none flex items-center justify-center gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Biodata</span>
          </button>

          <button
            onClick={() => navigate('/recruitment-openings')}
            className="flex-1 sm:flex-initial h-9 px-3.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-cyan-50/50 hover:text-[#00D2FF] hover:border-[#00D2FF]/40 text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <QrCode className="h-3.5 w-3.5 text-[#00D2FF]" />
            <span>QR & Apply Links</span>
          </button>
        </div>
      </div>

      {/* ─── 2. THE 4 RECRUITMENT PIPELINE STAGES (Compact & Real-Time) ─── */}
      <div className="grid gap-2.5 sm:gap-3 grid-cols-2 lg:grid-cols-4">
        
        {/* Stage 1: Total Biodatas */}
        <div 
          onClick={() => navigate('/recruitment-candidates')}
          className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-br from-[#FAF5FF] via-white to-purple-50/50 border border-purple-200/80 shadow-2xs hover:border-[#8A3BD4] hover:shadow-xs transition-all flex flex-col justify-between group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold text-purple-700/80 uppercase tracking-wider">
              1. Total Biodatas
            </span>
            <div className="p-1.5 rounded-lg bg-purple-100/80 text-[#8A3BD4] group-hover:scale-105 transition-transform">
              <Users className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 space-y-0.5">
            <h3 className="text-xl sm:text-2xl font-black text-purple-950 tracking-tight">
              {totalCandidates}
            </h3>
            <p className="text-[10px] text-purple-600 font-semibold flex items-center gap-1 truncate">
              <UserCheck className="h-2.5 w-2.5" /> All School Records
            </p>
          </div>
        </div>

        {/* Stage 2: Shortlisted */}
        <div 
          onClick={() => navigate('/recruitment-candidates?status=shortlisted')}
          className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-br from-[#F0FDF4] via-white to-teal-50/50 border border-teal-200/80 shadow-2xs hover:border-teal-500 hover:shadow-xs transition-all flex flex-col justify-between group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold text-teal-700/80 uppercase tracking-wider">
              2. Shortlisted
            </span>
            <div className="p-1.5 rounded-lg bg-teal-100/80 text-teal-700 group-hover:scale-105 transition-transform">
              <BookmarkCheck className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 space-y-0.5">
            <h3 className="text-xl sm:text-2xl font-black text-teal-950 tracking-tight">
              {shortlisted}
            </h3>
            <p className="text-[10px] text-teal-700 font-semibold flex items-center gap-1 truncate">
              <UserCheck className="h-2.5 w-2.5" /> Ready for Department Call
            </p>
          </div>
        </div>

        {/* Stage 3: Demo & Interview Scheduled */}
        <div 
          onClick={() => navigate('/recruitment-candidates?status=interview_scheduled')}
          className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-br from-[#EFF6FF] via-white to-indigo-50/50 border border-indigo-200/80 shadow-2xs hover:border-indigo-400 hover:shadow-xs transition-all flex flex-col justify-between group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold text-indigo-700/80 uppercase tracking-wider">
              3. Demo & Interview
            </span>
            <div className="p-1.5 rounded-lg bg-indigo-100/80 text-indigo-600 group-hover:scale-105 transition-transform">
              <Calendar className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 space-y-0.5">
            <h3 className="text-xl sm:text-2xl font-black text-indigo-950 tracking-tight">
              {demoInterview}
            </h3>
            <p className="text-[10px] text-indigo-600 font-semibold flex items-center gap-1 truncate">
              <Users className="h-2.5 w-2.5" /> Class Demo or Panel Round
            </p>
          </div>
        </div>

        {/* Stage 4: Selected / Hired */}
        <div 
          onClick={() => navigate('/recruitment-candidates?status=hired')}
          className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-br from-[#ECFDF5] via-white to-emerald-50/50 border border-emerald-200/80 shadow-2xs hover:border-emerald-400 hover:shadow-xs transition-all flex flex-col justify-between group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700/80 uppercase tracking-wider">
              4. Selected / Hired
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-100/80 text-emerald-600 group-hover:scale-105 transition-transform">
              <Award className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 space-y-0.5">
            <h3 className="text-xl sm:text-2xl font-black text-emerald-950 tracking-tight">
              {hired}
            </h3>
            <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 truncate">
              <CheckCircle2 className="h-2.5 w-2.5" /> Joined School Faculty
            </p>
          </div>
        </div>

      </div>

      {/* ─── 3. SECOND ROW: Subject / Department Breakdown (Donut + Bars) (1:1 with HireHub) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        
        {/* Left Column (5 cols): Subject & Role Split Donut */}
        <div className="lg:col-span-5 border border-slate-200/80 shadow-2xs rounded-2xl overflow-hidden bg-white flex flex-col justify-between">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-row items-center justify-between space-y-0">
            <div>
              <h3 className="text-xs sm:text-sm font-bold tracking-tight text-slate-900 flex items-center gap-2">
                <PieChart className="h-4 w-4 text-[#0F766E]" />
                Subject & Role Split
              </h3>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                Teacher candidate pool by designation
              </p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
              {subjectSegments.length} Subjects
            </span>
          </div>

          <div className="p-4 sm:p-5 flex-1 flex flex-col justify-center">
            <SubjectDonutChart
              segments={subjectSegments}
              totalLabel="Biodatas"
              totalValue={totalCandidates}
              onRoleClick={handleRoleClick}
            />
          </div>
        </div>

        {/* Right Column (7 cols): Experience Distribution */}
        <div className="lg:col-span-7 border border-slate-200/80 shadow-2xs rounded-2xl overflow-hidden bg-white flex flex-col justify-between">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-row items-center justify-between space-y-0">
            <div>
              <h3 className="text-xs sm:text-sm font-bold tracking-tight text-slate-900 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-indigo-600" />
                Experience Distribution
              </h3>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                Faculty seniority breakdown & candidate acquisition channels
              </p>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
              Seniority Tiers
            </span>
          </div>

          <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              {[
                {
                  key: 'Fresher',
                  label: 'Fresher / Trainee',
                  color: '#0284C7',
                  filter: (c) => Number(c.experienceYears || 0) === 0
                },
                {
                  key: '1 - 2 Years',
                  label: '1 - 2 Years (Junior)',
                  color: '#0D9488',
                  filter: (c) => Number(c.experienceYears || 0) >= 1 && Number(c.experienceYears || 0) <= 2
                },
                {
                  key: '3 - 5 Years',
                  label: '3 - 5 Years (Mid-Level)',
                  color: '#6366F1',
                  filter: (c) => Number(c.experienceYears || 0) >= 3 && Number(c.experienceYears || 0) <= 5
                },
                {
                  key: '5+ Years',
                  label: '5+ Years (Senior Faculty)',
                  color: '#8B5CF6',
                  filter: (c) => Number(c.experienceYears || 0) > 5
                },
              ].map((tier) => {
                const count = candidates.filter(tier.filter).length;
                const percentage = totalCandidates > 0 ? Math.round((count / totalCandidates) * 100) : 0;

                return (
                  <div
                    key={tier.key}
                    onClick={() => navigate('/recruitment-candidates')}
                    className="block space-y-1.5 p-1.5 -mx-1.5 rounded-lg hover:bg-slate-50 transition-colors group cursor-pointer"
                    title={`${count} candidates with ${tier.label}`}
                  >
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-700 truncate group-hover:text-indigo-600 transition-colors">
                        {tier.label}
                      </span>
                      <span className="text-slate-500 font-mono text-[11px] group-hover:text-slate-700">
                        {count} {count === 1 ? 'candidate' : 'candidates'} ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-md overflow-hidden">
                      <div 
                        className="h-full rounded-md transition-all duration-700" 
                        style={{ width: `${Math.min(100, Math.max(count > 0 ? 8 : 0, percentage))}%`, backgroundColor: tier.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">B.Ed / Specialized Degrees</span>
              <span className="font-extrabold text-[#0F766E] bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                {bEdPercentage}% of candidate pool
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ─── 4. THIRD ROW: RECENT APPLICATIONS TABLE ─── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-purple-50 text-[#8A3BD4] rounded-xl border border-purple-100">
                  <Inbox className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Incoming Applications & Biodatas
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Latest submissions received from website QR code & walk-in candidates
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate('/recruitment-candidates')}
                className="text-xs font-bold text-[#8A3BD4] hover:text-[#7C3AED] flex items-center gap-1 cursor-pointer"
              >
                View All →
              </button>
            </div>

            {/* Candidates Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Candidate Profile</th>
                    <th className="py-3 px-4">Applied Position</th>
                    <th className="py-3 px-4">Experience</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {candidates.slice(0, 5).map(c => (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-2xs overflow-hidden">
                            {c.photoUrl ? (
                              <img src={c.photoUrl} alt={c.name} className="h-full w-full object-cover" />
                            ) : (
                              c.name.charAt(0)
                            )}
                          </div>
                          <div>
                            <div 
                              onClick={() => {
                                setSelectedCandidate(c);
                                setShowProfileModal(true);
                              }}
                              className="font-bold text-slate-900 hover:text-[#8A3BD4] cursor-pointer flex items-center gap-1.5"
                            >
                              {c.name}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {c.city || 'Jaipur'} • {c.phone}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-[#0F766E]">
                        {c.appliedPosition}
                        <div className="text-[11px] text-slate-400 font-normal">
                          {c.qualification}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-800">{c.experienceYears}y</span>
                        <span className="text-[11px] text-slate-400 ml-1">teaching</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                          c.status === 'shortlisted' ? 'bg-teal-50 text-teal-700 border border-teal-200' :
                          c.status === 'interview_scheduled' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          c.status === 'demo_class' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                          c.status === 'offered' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                          c.status === 'hired' ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-extrabold' :
                          c.status === 'rejected' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {c.status.replace(/_/g, ' ')}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={`https://wa.me/91${c.phone}?text=Hello%20${encodeURIComponent(c.name)},%20greetings%20from%20JD%20International%20School.`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition"
                            title="Chat on WhatsApp"
                          >
                            <WhatsAppIcon className="h-3.5 w-3.5" />
                          </a>
                          <button
                            onClick={() => {
                              setSelectedCandidate(c);
                              setShowProfileModal(true);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-[#8A3BD4] font-bold text-xs transition cursor-pointer flex items-center gap-1"
                          >
                            <Eye className="h-3.5 w-3.5" /> View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table Bottom Footer */}
          <div className="p-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Showing top recent applicants of {totalCandidates}</span>
            <button
              onClick={() => navigate('/recruitment-candidates')}
              className="font-bold text-[#8A3BD4] hover:underline cursor-pointer"
            >
              Open Complete Talent Pool →
            </button>
          </div>
        </div>

      {/* Candidate Profile Modal */}
      <CandidateProfileModal
        candidate={selectedCandidate}
        isOpen={showProfileModal}
        onClose={() => {
          setShowProfileModal(false);
          setSelectedCandidate(null);
        }}
        onCandidateUpdated={loadData}
        onHireSuccess={(res) => {
          alert(`Congratulations! ${res.staffName} has been hired and ported to Staff Roster! (Staff Code: ${res.staffId})`);
          loadData();
        }}
      />

      {/* Add Candidate Modal */}
      <CandidateAddEditModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onCandidateCreated={loadData}
      />

    </div>
  );
}
