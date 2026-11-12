import React, { useState } from 'react';
import { Award, Clock, Layers, Search, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import {
  ANNEXURE_I_TOPICS,
  ANNEXURE_II_TOPICS,
  ANNEXURE_III_TOPICS,
  ACADEMIC_ACTIVITIES,
  DOMAIN_INFO,
} from '../constants/cbseCatalog';

export function CbseGuidelinesModal({ open, onOpenChange }) {
  const [activeTab, setActiveTab] = useState('annexure1');
  const [search, setSearch] = useState('');

  if (!open) return null;

  const filterTopics = (topics) => {
    if (!search.trim()) return topics;
    const q = search.toLowerCase();
    return topics.filter((t) => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q));
  };

  const tabs = [
    { id: 'annexure1', label: `Annexure I (${ANNEXURE_I_TOPICS.length})`, items: ANNEXURE_I_TOPICS },
    { id: 'annexure2', label: `Annexure II (${ANNEXURE_II_TOPICS.length})`, items: ANNEXURE_II_TOPICS },
    { id: 'annexure3', label: `Annexure III (${ANNEXURE_III_TOPICS.length})`, items: ANNEXURE_III_TOPICS },
    { id: 'activities', label: `Academic Duties (${ACADEMIC_ACTIVITIES.length})`, items: ACADEMIC_ACTIVITIES },
  ];

  const currentItems = filterTopics(tabs.find((t) => t.id === activeTab)?.items || []);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-blue-50/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">CBSE Continuous Professional Development (CPD) Guidelines</h3>
              <p className="text-xs text-slate-500">Circular TRG-02/2025 • Ref: Affiliation Notification 16/2021 &amp; Clause 12.2.9</p>
            </div>
          </div>
          <button onClick={() => onOpenChange(false)} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5">
              <div className="flex items-center justify-between text-xs font-bold text-blue-800 uppercase">
                <span>Annual Mandate</span>
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-xl font-black text-blue-900 mt-1">50 Hours / Year</p>
              <p className="text-xs text-blue-700 mt-0.5">Every teacher &amp; principal must complete 50 verified CPD hours each session.</p>
            </div>
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3.5">
              <div className="flex items-center justify-between text-xs font-bold text-indigo-800 uppercase">
                <span>Provider Quotas</span>
                <Layers className="w-4 h-4 text-indigo-600" />
              </div>
              <p className="text-xl font-black text-indigo-900 mt-1">25h CBSE + 25h School</p>
              <p className="text-xs text-indigo-700 mt-0.5">25h via CBSE COE &amp; 25h via School/Sahodaya/Academic activities.</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-800 uppercase">
                <span>NPST Domain Split</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-xl font-black text-emerald-900 mt-1">12h / 24h / 14h</p>
              <p className="text-xs text-emerald-700 mt-0.5">D1 Ethics (12h), D2 Pedagogy (24h), D3 Growth (14h, max 11h duties).</p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Notice: Only <strong>VERIFIED</strong> training records count toward effective hours. Domain hours exceeding a domain cap or academic activity cap (11h max) do not roll over to another domain.
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="flex flex-wrap gap-1.5">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    activeTab === t.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter CBSE topics..."
                className="w-full rounded-xl border border-slate-200 pl-8 pr-3 py-1.5 text-xs"
              />
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 max-h-72 overflow-y-auto">
            {currentItems.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">No matching CBSE topics</div>
            ) : (
              currentItems.map((item) => (
                <div key={item.id} className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50">
                  <div>
                    <div className="text-xs font-bold text-slate-800">{item.title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {DOMAIN_INFO[item.domain]?.title} • {item.description}
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-bold shrink-0">
                    {item.defaultHours} hrs
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
          >
            Close Guidelines
          </button>
        </div>
      </div>
    </div>
  );
}
