import React, { useState, useEffect } from 'react';
import {
  Award,
  Plus,
  Search,
  Download,
  BookOpen,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { syllabusApi } from '../../services/syllabusApi';
import { CpdQuotaProgressBar, DomainStackedProgressBar } from '../../components/CpdProgressBars';
import { LogTrainingDialog } from '../../components/LogTrainingDialog';
import { TeacherCpdDrawer } from '../../components/TeacherCpdDrawer';
import { CbseGuidelinesModal } from '../../components/CbseGuidelinesModal';
import { SyllabusSessionBanner } from '../../components/SyllabusSessionBanner';

export function AdminTeacherTrainingPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const [logOpen, setLogOpen] = useState(false);
  const [defaultTeacherId, setDefaultTeacherId] = useState('');
  const [drawerTeacherId, setDrawerTeacherId] = useState(null);
  const [guidelinesOpen, setGuidelinesOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await syllabusApi.listTeacherCpd({ complianceStatus: statusFilter, search });
      setData(res);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const sync = () => loadData();
    window.addEventListener('syllabus-session-changed', sync);
    return () => window.removeEventListener('syllabus-session-changed', sync);
  }, [statusFilter]);

  const handleApproval = async (recordId, status) => {
    try {
      await syllabusApi.updateTrainingRecord(recordId, { status });
      toast.success(status === 'VERIFIED' ? 'Training verified & credited to 50h quota!' : 'Submission rejected');
      await loadData();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const handleExportOasisCsv = () => {
    const rows = data?.teachers || [];
    const header = ['Teacher Name', 'Emp Code', 'Email', 'Compliance Status', 'Effective Hours / 50', 'CBSE Hours / 25', 'School Hours / 25', 'Domain 1 (12h)', 'Domain 2 (24h)', 'Domain 3 (14h)'];
    const lines = [
      header.join(','),
      ...rows.map((t) =>
        [
          `"${t.name}"`,
          t.empCode || '',
          t.email || '',
          t.complianceStatus,
          t.effectiveTotalHours,
          t.cbseHours,
          t.schoolHours,
          t.domain1Hours,
          t.domain2Hours,
          t.domain3Hours,
        ].join(','),
      ),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CBSE_OASIS_CPD_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CBSE OASIS Compliance CSV exported!');
  };

  const stats = data?.stats || {};
  const teachers = data?.teachers || [];
  const pendingApprovals = data?.pendingApprovals || [];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-600 text-white">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900">CBSE 50-Hour Teacher Training (CPD)</h1>
              <SyllabusSessionBanner onSessionReload={loadData} />
            </div>
            <p className="text-xs text-slate-500">Circular TRG-02/2025: 25h CBSE + 25h School • NPST Domain Split (12h / 24h / 14h)</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setGuidelinesOpen(true)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 inline-flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4 text-indigo-600" /> CBSE Guidelines
          </button>
          <button
            type="button"
            onClick={handleExportOasisCsv}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 inline-flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-emerald-600" /> OASIS CSV
          </button>
          <button
            type="button"
            onClick={() => {
              setDefaultTeacherId('');
              setLogOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Log Training (Single / Bulk)
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Synced Faculty</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">{stats.totalTeachers || 0}</div>
          <div className="text-[11px] text-emerald-600 font-semibold">{stats.compliantCount || 0} Full 50h Compliant</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <div className="text-xs font-bold text-slate-500">Avg Effective CPD Hours</div>
          <div className="text-2xl font-black text-indigo-700 mt-1">{stats.avgEffectiveHours || 0} / 50h</div>
          <div className="text-[11px] text-slate-400">{stats.inProgressCount || 0} Teachers In Progress</div>
        </div>
        <div className="bg-white rounded-2xl border border-amber-200 p-4">
          <div className="flex items-center justify-between text-xs font-bold text-amber-700">
            <span>Pending Approvals</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-800 mt-1">{stats.pendingApprovalsCount || 0}</div>
          <div className="text-[11px] text-amber-700">Teacher self-logs needing review</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <div className="text-xs font-bold text-slate-500">Logged Workshops</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{stats.totalLoggedRecords || 0}</div>
          <div className="text-[11px] text-slate-400">Across Annexure I / II / III</div>
        </div>
      </div>

      {/* Pending Approval Queue */}
      {pendingApprovals.length > 0 && (
        <div className="bg-amber-50/70 rounded-2xl border border-amber-200 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-900">
              Pending Faculty CPD Submissions ({pendingApprovals.length})
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingApprovals.map((rec) => (
              <div key={rec.id} className="bg-white rounded-xl border border-amber-200 p-3.5 flex items-center justify-between gap-3">
                <div className="space-y-0.5 min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">{rec.title}</div>
                  <div className="text-[11px] text-slate-600">
                    <strong>{rec.teacherName}</strong> • {rec.hours} hrs ({rec.provider}) • {rec.trainingDate}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleApproval(rec.id, 'VERIFIED')}
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold inline-flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApproval(rec.id, 'REJECTED')}
                    className="px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 text-[11px] font-bold inline-flex items-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Faculty Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {['ALL', 'COMPLIANT', 'IN_PROGRESS', 'NON_COMPLIANT'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                statusFilter === st ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') loadData(); }}
              placeholder="Search teacher or subject..."
              className="w-full rounded-xl border border-slate-200 pl-8 pr-3 py-1.5 text-xs"
            />
          </div>
          <button type="button" onClick={loadData} className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold">
            Search
          </button>
        </div>
      </div>

      {/* Faculty Compliance Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Teacher</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 w-56">Provider Split (25h + 25h)</th>
                <th className="py-3 px-4 w-56">Domain Split (12 / 24 / 14h)</th>
                <th className="py-3 px-4">Effective</th>
                <th className="py-3 px-4 text-right">Portfolio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && !data ? (
                <tr><td colSpan={6} className="py-10 text-center text-slate-400">Loading faculty CPD metrics...</td></tr>
              ) : teachers.length === 0 ? (
                <tr><td colSpan={6} className="py-10 text-center text-slate-400">No teachers found.</td></tr>
              ) : (
                teachers.map((t) => (
                  <tr
                    key={t.teacherId}
                    onClick={() => setDrawerTeacherId(t.teacherId)}
                    className="hover:bg-indigo-50/40 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{t.name}</div>
                      <div className="text-[11px] text-slate-500">{t.subjectNames?.join(', ') || t.designation}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          t.complianceStatus === 'COMPLIANT'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : t.complianceStatus === 'IN_PROGRESS'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {t.complianceStatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <CpdQuotaProgressBar
                        cbseHours={t.cbseHours}
                        schoolHours={t.schoolHours}
                        effectiveTotalHours={t.effectiveTotalHours}
                        showLegend
                      />
                    </td>
                    <td className="py-3 px-4">
                      <DomainStackedProgressBar
                        domain1Hours={t.domain1Hours}
                        domain2Hours={t.domain2Hours}
                        domain3Hours={t.domain3Hours}
                        totalHours={t.totalRawHours}
                        showLegend
                      />
                    </td>
                    <td className="py-3 px-4 font-black text-indigo-700">{t.effectiveTotalHours} / 50h</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDrawerTeacherId(t.teacherId);
                        }}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-bold text-slate-700"
                      >
                        View ({t.recordCount})
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <LogTrainingDialog
        open={logOpen}
        onOpenChange={setLogOpen}
        teachers={teachers}
        defaultTeacherId={defaultTeacherId}
        onSuccess={loadData}
      />

      <TeacherCpdDrawer
        open={Boolean(drawerTeacherId)}
        onOpenChange={(v) => { if (!v) setDrawerTeacherId(null); }}
        teacherId={drawerTeacherId}
        onAddTrainingClick={(tid) => {
          setDefaultTeacherId(tid);
          setLogOpen(true);
        }}
        onUpdated={loadData}
      />

      <CbseGuidelinesModal open={guidelinesOpen} onOpenChange={setGuidelinesOpen} />
    </div>
  );
}
