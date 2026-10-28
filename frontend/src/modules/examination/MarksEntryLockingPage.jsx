import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  Search,
  Home,
  CheckCircle2,
  Filter,
  ShieldCheck,
  FileDown
} from 'lucide-react';

const INITIAL_LOCKS = [];

export function MarksEntryLockingPage({ onNavigate }) {
  const [data, setData] = useState(INITIAL_LOCKS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserFilter, setSelectedUserFilter] = useState('All');
  const [selectedClassFilter, setSelectedClassFilter] = useState('All');

  const filteredData = data.filter(item => {
    const matchesSearch = item.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.className.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUser = selectedUserFilter === 'All' || item.user === selectedUserFilter;
    const matchesClass = selectedClassFilter === 'All' || item.className === selectedClassFilter;
    return matchesSearch && matchesUser && matchesClass;
  });

  const handleToggleLock = (id) => {
    setData(prev => prev.map(item => {
      if (item.id === id) {
        const nextState = !item.isLocked;
        return {
          ...item,
          isLocked: nextState,
          lockedDate: nextState ? new Date().toISOString().split('T')[0] : null
        };
      }
      return item;
    }));
  };

  const handleLockAll = () => {
    const today = new Date().toISOString().split('T')[0];
    setData(prev => prev.map(item => ({ ...item, isLocked: true, lockedDate: today })));
  };

  const handleUnlockAll = () => {
    setData(prev => prev.map(item => ({ ...item, isLocked: false, lockedDate: null })));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1:1 Secondary Top Header Toolbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-bold text-slate-800 pr-3 border-r border-slate-300">
            Marks Entry Locking
          </h1>
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <button onClick={() => onNavigate?.('/')} className="hover:text-indigo-600 flex items-center">
              <Home className="w-3.5 h-3.5 mr-1" />
            </button>
            <span>•</span>
            <span className="hover:text-indigo-600 cursor-pointer" onClick={() => onNavigate?.('/marks-entry-locking')}>Examination</span>
            <span>•</span>
            <span className="text-slate-800 font-medium">Marks Entry Lock</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleLockAll}
            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-bold flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock All</span>
          </button>
          <button
            onClick={handleUnlockAll}
            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1.5"
          >
            <Unlock className="w-3.5 h-3.5" />
            <span>Unlock All</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 max-w-7xl mx-auto w-full space-y-4">
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search teacher, class, subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div>
              <span className="text-slate-500 font-semibold mr-1.5">User:</span>
              <select
                value={selectedUserFilter}
                onChange={(e) => setSelectedUserFilter(e.target.value)}
                className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 font-semibold"
              >
                <option value="All">All Teachers</option>
                <option value="Sunita Sharma (T-102)">Sunita Sharma (T-102)</option>
                <option value="Rakesh Verma (T-108)">Rakesh Verma (T-108)</option>
                <option value="Pooja Jain (T-115)">Pooja Jain (T-115)</option>
              </select>
            </div>

            <div>
              <span className="text-slate-500 font-semibold mr-1.5">Class:</span>
              <select
                value={selectedClassFilter}
                onChange={(e) => setSelectedClassFilter(e.target.value)}
                className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 font-semibold"
              >
                <option value="All">All Classes</option>
                <option value="I">Class I</option>
                <option value="II">Class II</option>
                <option value="X">Class X</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table View */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4 w-16 text-center">S.No.</th>
                  <th className="py-3 px-4">User / Faculty</th>
                  <th className="py-3 px-4 w-28">Class</th>
                  <th className="py-3 px-4 w-24">Section</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Term</th>
                  <th className="py-3 px-4 w-32 text-center">Lock Status</th>
                  <th className="py-3 px-4 w-32 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center font-bold text-slate-500">{index + 1}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{item.user}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">Class {item.className}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-600">{item.section}</td>
                    <td className="py-3.5 px-4 font-bold text-indigo-700">{item.subject}</td>
                    <td className="py-3.5 px-4 text-slate-600">{item.term}</td>
                    <td className="py-3.5 px-4 text-center">
                      {item.isLocked ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
                          <Lock className="w-3 h-3" /> Locked
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Unlock className="w-3 h-3" /> Open
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleLock(item.id)}
                        className={`px-3 py-1 rounded-lg font-bold text-[11px] border transition-colors ${
                          item.isLocked
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                            : 'bg-red-50 text-red-700 border-red-300 hover:bg-red-100'
                        }`}
                      >
                        {item.isLocked ? 'Unlock' : 'Lock'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
