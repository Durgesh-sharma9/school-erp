import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Save,
  CheckCircle2,
  Trash2,
  Edit2
} from 'lucide-react';

export function ClassMasterPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newClassName, setNewClassName] = useState('');
  const [newPriority, setNewPriority] = useState('');
  const [newSections, setNewSections] = useState('A, B');

  // Fetch classes from backend API
  const fetchClasses = () => {
    fetch('http://localhost:5000/api/academics/classes')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setClasses(data.data);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  React.useEffect(() => {
    fetchClasses();
  }, []);

  const handleAddClass = async (e) => {
    e.preventDefault();
    if (!newClassName) return;

    try {
      const res = await fetch('http://localhost:5000/api/academics/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newClassName,
          priority: newPriority,
          sections: newSections
        })
      });
      const result = await res.json();
      if (result.success) {
        fetchClasses();
        setNewClassName('');
        setNewPriority('');
      }
    } catch (err) {
      console.error(err);
      const newClass = {
        id: String(Date.now()),
        name: newClassName,
        priority: Number(newPriority) || classes.length + 1,
        sections: newSections.split(',').map(s => s.trim()),
        status: 'Active'
      };
      setClasses(prev => [...prev, newClass]);
      setNewClassName('');
      setNewPriority('');
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Master Configuration
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <span>Class & Section Master</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              Total {classes.length} Classes
            </span>
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Add Class Form */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs h-fit space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
            <Plus className="w-4 h-4 text-indigo-600" />
            <h3 className="font-extrabold text-sm text-slate-900">Add New Class</h3>
          </div>

          <form onSubmit={handleAddClass} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Class Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Class 11"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Display Priority / Sort Order
              </label>
              <input
                type="number"
                placeholder="e.g. 14"
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Sections (Comma Separated)
              </label>
              <input
                type="text"
                placeholder="A, B, C"
                value={newSections}
                onChange={(e) => setNewSections(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              + Create Class
            </button>
          </form>
        </div>

        {/* Right: Classes Table */}
        <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold text-[10px] bg-slate-50/70">
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Class Name</th>
                <th className="py-3 px-4">Sections</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {classes.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-400">{c.priority}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{c.name}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1">
                      {c.sections.map(s => (
                        <span key={s} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-100">
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setClasses(prev => prev.filter(x => x.id !== c.id))}
                      className="p-1 rounded text-rose-500 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
