import React from 'react';

export function CpdQuotaProgressBar({
  cbseHours = 0,
  schoolHours = 0,
  targetCbse = 25,
  targetSchool = 25,
  effectiveTotalHours,
  showLegend = false,
}) {
  const totalTarget = Math.max(1, targetCbse + targetSchool);
  const effCbse = Math.min(targetCbse, Math.max(0, Number(cbseHours || 0)));
  const effSchool = Math.min(targetSchool, Math.max(0, Number(schoolHours || 0)));
  const providerSum = effCbse + effSchool;
  const cappedEffectiveTotal =
    effectiveTotalHours !== undefined
      ? Math.min(totalTarget, Math.max(0, Number(effectiveTotalHours)))
      : providerSum;
  const scale = providerSum > 0 ? Math.min(1, cappedEffectiveTotal / providerSum) : 0;
  const cbsePct = ((effCbse * scale) / totalTarget) * 100;
  const schoolPct = ((effSchool * scale) / totalTarget) * 100;

  return (
    <div className="w-full space-y-1">
      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-100 flex">
        {cbsePct > 0 && (
          <div
            style={{ width: `${cbsePct}%` }}
            className="h-full bg-indigo-600 transition-all duration-300"
            title={`CBSE Quota: ${cbseHours}h (${effCbse}/${targetCbse}h effective)`}
          />
        )}
        {schoolPct > 0 && (
          <div
            style={{ width: `${schoolPct}%` }}
            className="h-full bg-emerald-500 transition-all duration-300"
            title={`School/Sahodaya Quota: ${schoolHours}h (${effSchool}/${targetSchool}h effective)`}
          />
        )}
      </div>
      {showLegend && (
        <div className="flex items-center gap-3 text-[10px] text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block" />
            CBSE: {effCbse}/{targetCbse}h
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            School: {effSchool}/{targetSchool}h
          </span>
        </div>
      )}
    </div>
  );
}

export function DomainStackedProgressBar({
  domain1Hours = 0,
  domain2Hours = 0,
  domain3Hours = 0,
  totalHours = 0,
  targetHours = 50,
  showLegend = false,
}) {
  const effectiveMax = Math.max(targetHours, totalHours, 1);
  const p1 = (Math.max(0, domain1Hours) / effectiveMax) * 100;
  const p2 = (Math.max(0, domain2Hours) / effectiveMax) * 100;
  const p3 = (Math.max(0, domain3Hours) / effectiveMax) * 100;

  return (
    <div className="w-full space-y-1">
      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-100 flex">
        {p1 > 0 && (
          <div
            style={{ width: `${p1}%` }}
            className="h-full bg-indigo-500 transition-all duration-300"
            title={`Domain 1 (Ethics): ${domain1Hours}/12h`}
          />
        )}
        {p2 > 0 && (
          <div
            style={{ width: `${p2}%` }}
            className="h-full bg-sky-500 transition-all duration-300"
            title={`Domain 2 (Knowledge & Practice): ${domain2Hours}/24h`}
          />
        )}
        {p3 > 0 && (
          <div
            style={{ width: `${p3}%` }}
            className="h-full bg-emerald-500 transition-all duration-300"
            title={`Domain 3 (Growth): ${domain3Hours}/14h`}
          />
        )}
      </div>
      {showLegend && (
        <div className="flex items-center gap-3 text-[10px] text-slate-500">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" /> D1: {domain1Hours}/12h</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-500 inline-block" /> D2: {domain2Hours}/24h</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> D3: {domain3Hours}/14h</span>
        </div>
      )}
    </div>
  );
}
