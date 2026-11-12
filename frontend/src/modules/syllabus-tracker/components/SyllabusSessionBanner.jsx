import React, { useState, useEffect } from 'react';
import { Eye, RotateCcw, CalendarCheck } from 'lucide-react';
import { getViewingSession, setViewingSession, syllabusApi } from '../services/syllabusApi';

export function SyllabusSessionBanner({ onSessionReload }) {
  const [viewing, setViewing] = useState(() => getViewingSession());
  const [activeSess, setActiveSess] = useState(null);

  useEffect(() => {
    const sync = () => setViewing(getViewingSession());
    window.addEventListener('syllabus-session-changed', sync);
    syllabusApi.listSessions().then((res) => {
      const act = (res.sessions || []).find((s) => s.isActive);
      setActiveSess(act || null);
    }).catch(() => {});
    return () => window.removeEventListener('syllabus-session-changed', sync);
  }, []);

  if (viewing && !viewing.isActive) {
    return (
      <div className="mb-4 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-amber-900 font-semibold">
          <Eye className="w-4 h-4 text-amber-600" />
          <span>
            Viewing Archived Session: <strong>{viewing.name}</strong> (Historical Preview Mode)
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            setViewingSession(null, null);
            onSessionReload?.();
          }}
          className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold inline-flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Return to Active ({activeSess?.name || 'Current'})
        </button>
      </div>
    );
  }

  return activeSess ? (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
      <CalendarCheck className="w-3.5 h-3.5" />
      Session: {activeSess.name}
    </div>
  ) : null;
}
