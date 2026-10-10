import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Save,
  CheckCircle2,
  Trash2,
  Edit2
} from 'lucide-react';

export function FeeStructurePage() {
  const [feeStructures, setFeeStructures] = useState([
    { id: '1', className: 'Nursery', tuition: 18000, exam: 2500, activity: 2000, total: 22500 },
    { id: '2', className: 'L.K.G', tuition: 18000, exam: 2500, activity: 2000, total: 22500 },
    { id: '3', className: 'U.K.G', tuition: 20000, exam: 2500, activity: 2000, total: 24500 },
    { id: '4', className: 'Class 1', tuition: 24000, exam: 3000, activity: 2500, total: 29500 },
    { id: '5', className: 'Class 5', tuition: 28000, exam: 3500, activity: 3000, total: 34500 },
    { id: '6', className: 'Class 8', tuition: 32000, exam: 4000, activity: 3500, total: 39500 },
    { id: '7', className: 'Class 10', tuition: 36000, exam: 5000, activity: 4000, total: 45000 },
    { id: '8', className: 'Class 12', tuition: 42000, exam: 6000, activity: 4500, total: 52500 }
  ]);

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Fee Management
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <span>Class-Wise Fee Structure Schedule</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
              Session 2026-2027
            </span>
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold text-[10px] bg-slate-50/70">
              <th className="py-3 px-4">Class</th>
              <th className="py-3 px-4">Tuition Fee</th>
              <th className="py-3 px-4">Exam Fee</th>
              <th className="py-3 px-4">Activity & Lab</th>
              <th className="py-3 px-4 font-bold text-slate-900 text-right">Total Annual Fee</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
            {feeStructures.map((f) => (
              <tr key={f.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3 px-4 font-bold text-slate-900">{f.className}</td>
                <td className="py-3 px-4 font-mono">₹ {f.tuition.toLocaleString('en-IN')}</td>
                <td className="py-3 px-4 font-mono">₹ {f.exam.toLocaleString('en-IN')}</td>
                <td className="py-3 px-4 font-mono">₹ {f.activity.toLocaleString('en-IN')}</td>
                <td className="py-3 px-4 font-mono font-extrabold text-indigo-700 text-right">
                  ₹ {f.total.toLocaleString('en-IN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
