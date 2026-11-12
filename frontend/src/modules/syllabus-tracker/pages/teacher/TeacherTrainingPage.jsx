import React, { useState, useEffect } from 'react';
import { Award, Plus, BookOpen, Download, Trash2, Clock, Building, Laptop, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { syllabusApi } from '../../services/syllabusApi';
import { CpdQuotaProgressBar, DomainStackedProgressBar } from '../../components/CpdProgressBars';
import { LogTrainingDialog } from '../../components/LogTrainingDialog';
import { CbseGuidelinesModal } from '../../components/CbseGuidelinesModal';
import { DOMAIN_INFO } from '../../constants/cbseCatalog';

export function TeacherTrainingPage() {
  const [cpd, setCpd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [logOpen, setLogOpen] = useState(false);
  const [guidelinesOpen, setGuidelinesOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await syllabusApi.getMyCpd();
      setCpd(data);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (recordId) => {
    if (!window.confirm('Remove this training record?')) return;
    try {
      await syllabusApi.deleteTrainingRecord(recordId);
      toast.success('Record removed');
      await loadData();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const handleExportCsv = () => {
    const records = cpd?.records || [];
    const header = ['Title', 'Provider', 'Domain', 'Hours', 'Mode', 'Date', 'Certificate No', 'Status'];
    const lines = [
      header.join(','),
      ...records.map((r) =>
        [`"${r.title}"`, r.provider, r.domain, r.hours, r.mode, r.trainingDate, `"${r.certificateNo || ''}"`, r.status].join(','),
      ),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `My_CPD_Portfolio_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Personal CPD portfolio exported!');
  };

  if (loading && !cpd) {
    return <div className="p-8 text-center text-sm text-slate-400">Loading your CPD training portfolio...</div>;
  }

  const records = (cpd?.records || []).filter((r) => statusFilter === 'ALL' || r.status === statusFilter);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-600 text-white">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">My 50-Hour CBSE CPD Training Portfolio</h1>
            <p className="text-xs text-slate-500">Circular TRG-02/2025: 25h CBSE + 25h School • Submit certificates for Principal/Admin verification</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setGuidelinesOpen(true)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 inline-flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4 text-indigo-600" /> CBSE Guidelines
          </button>
          <button
            type="button"
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 inline-flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-emerald-600" /> Export CSV
          </button>
          <button
            type="button"
            onClick={() => setLogOpen(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Submit Training Record
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase">Verified Effective Hours</span>
            <span className="text-lg font-black text-indigo-700">{cpd?.effectiveTotalHours || 0} / 50 hrs</span>
          </div>
          <CpdQuotaProgressBar
            cbseHours={cpd?.cbseHours || 0}
            schoolHours={cpd?.schoolHours || 0}
            effectiveTotalHours={cpd?.effectiveTotalHours || 0}
            showLegend
          />
          <div className="text-[11px] text-slate-500">
            Compliance Status: <strong>{cpd?.complianceStatus?.replace('_', ' ')}</strong> • Pending Review: {cpd?.pendingCount || 0}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase">NPST Domain Distribution (12 / 24 / 14h)</span>
            <span className="text-sm font-black text-slate-800">Raw Verified: {cpd?.totalRawHours || 0}h</span>
          </div>
          <DomainStackedProgressBar
            domain1Hours={cpd?.domain1Hours || 0}
            domain2Hours={cpd?.domain2Hours || 0}
            domain3Hours={cpd?.domain3Hours || 0}
            totalHours={cpd?.totalRawHours || 0}
            showLegend
          />
          <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-800 font-bold">D1 Ethics: {cpd?.domain1Hours || 0}/12h</div>
            <div className="p-2 rounded-lg bg-sky-50 text-sky-800 font-bold">D2 Practice: {cpd?.domain2Hours || 0}/24h</div>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 font-bold">D3 Growth: {cpd?.domain3Hours || 0}/14h</div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-1.5">
        {['ALL', 'VERIFIED', 'SUBMITTED', 'REJECTED'].map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
              statusFilter === st ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Records List */}
      <div className="space-y-3">
        {records.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center text-xs text-slate-400">
            No CPD training records under this filter.
          </div>
        ) : (
          records.map((rec) => {
            const domInfo = DOMAIN_INFO[rec.domain];
            return (
              <div key={rec.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{rec.title}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        rec.status === 'VERIFIED'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : rec.status === 'REJECTED'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {rec.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1"><Building className="w-3 h-3" /> {rec.provider}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {rec.hours} hrs</span>
                    <span className="flex items-center gap-1"><Laptop className="w-3 h-3" /> {rec.mode}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {rec.trainingDate}</span>
                    {rec.certificateNo && <span>Cert: {rec.certificateNo}</span>}
                    {domInfo && <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${domInfo.badgeClass}`}>{domInfo.shortTitle}</span>}
                  </div>
                </div>

                {rec.status !== 'VERIFIED' && (
                  <button
                    type="button"
                    onClick={() => handleDelete(rec.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl self-end sm:self-center"
                    title="Delete Pending Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      <LogTrainingDialog
        open={logOpen}
        onOpenChange={setLogOpen}
        isTeacherSelf
        onSuccess={loadData}
      />

      <CbseGuidelinesModal open={guidelinesOpen} onOpenChange={setGuidelinesOpen} />
    </div>
  );
}
