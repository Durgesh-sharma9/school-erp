import React from 'react';
import { FileText, Briefcase } from 'lucide-react';

export function PageHeader({ title, description, icon: Icon = Briefcase, action }) {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden mb-4 border border-slate-200/80 shadow-2xs">
      {/* Soft Pastel Gradient Strip from HireHub */}
      <div className="bg-gradient-to-r from-[#F0FCF5] via-[#EFF6FF] to-[#FAF5FF] px-4 sm:px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Icon + Title */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="h-9 w-9 rounded-xl bg-white text-[#8A3BD4] flex items-center justify-center shrink-0 border border-slate-200/80 shadow-2xs">
            <Icon className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 truncate">
              {title}
            </h1>
            {description && (
              <p className="text-[11.5px] font-medium text-slate-500 truncate mt-0.5">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Action Slot */}
        {action && (
          <div className="flex items-center shrink-0">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}
