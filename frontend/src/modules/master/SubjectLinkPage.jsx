import React, { useState, useEffect } from 'react';
import {
  Home,
  Search,
  ListFilter,
  Plus,
  Trash2,
  X,
  Check
} from 'lucide-react';

export function SubjectLinkPage() {
  const [links, setLinks] = useState([]);
  const [classes, setClasses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassForEdit, setSelectedClassForEdit] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedClassForAdd, setSelectedClassForAdd] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState(new Set());

  // Grouped subject schema (Extracted 1:1 from live UAB portal)
  const subjectGroupsData = [
    {
      group: 'HINDI',
      subjects: ['HINDI READER', 'HINDI GRAMMAR', 'HINDI COURSE A', 'HINDI']
    },
    {
      group: 'ENGLISH',
      subjects: [
        'ENGLISH READER',
        'ENGLISH GRAMMAR',
        'ENGLISH LANGUAGE & LITERATURE(184)',
        'ENGLISH CORE(301)',
        'ENGLISH ELECTIVE(001)',
        'ENGLISH'
      ]
    },
    {
      group: 'COMPUTER',
      subjects: ['COMPUTER']
    },
    {
      group: 'EVS',
      subjects: ['EVS']
    },
    {
      group: 'GENERAL KNOWLEDGE',
      subjects: ['GENERAL KNOWLEDGE']
    },
    {
      group: 'MORAL SCIENCE',
      subjects: ['MORAL SCIENCE']
    },
    {
      group: 'SCIENCE',
      subjects: ['SCIENCE']
    },
    {
      group: 'SOCIAL SCIENCE',
      subjects: ['SOCIAL SCIENCE']
    },
    {
      group: 'MATHEMATICS',
      subjects: ['MATHEMATICS BASIC', 'MATHEMATICS STANDARD', 'MATHEMATICS']
    },
    {
      group: 'HUMANITIES',
      subjects: ['GEOGRAPHY(029)', 'SOCIOLOGY(039)', 'HISTORY(027)', 'POLITICAL SCIENCE(028)']
    },
    {
      group: 'SCIENCE STREAM',
      subjects: ['PHYSICS(042)', 'CHEMISTRY(043)', 'BIOLOGY(044)']
    },
    {
      group: 'SKILL SUBJECTS',
      subjects: ['FRONT OFFICE OPERATIONS', 'ABACUS', 'Information Technology']
    },
    {
      group: 'PHYSICAL EDUCATION',
      subjects: ['PHYSICAL EDUCATION (048)']
    },
    {
      group: 'ART EDUCATION',
      subjects: ['ART EDUCATION']
    },
    {
      group: 'WORK EDUCATION',
      subjects: ['WORK EDUCATION']
    },
    {
      group: 'HEALTH & PHYSICAL EDUCATION',
      subjects: ['HEALTH & PHYSICAL EDUCATION']
    },
    {
      group: 'ICT',
      subjects: ['ICT']
    },
    {
      group: 'CLASS XI & XII',
      subjects: ['WORK EXPERIENCE', 'HEALTH & PHY. EDUCATION', 'GENERAL STUDIES']
    },
    {
      group: 'THIRD LANGUAGE',
      subjects: ['SANSKRIT']
    },
    {
      group: 'COMMERCE',
      subjects: ['ACCOUNTANCY', 'BUSINESS STUDIES', 'ECONOMICS']
    },
    {
      group: 'DISCIPLINE',
      subjects: ['DISCIPLINE']
    },
    {
      group: 'CONFIDENCE',
      subjects: ['CONFIDENCE']
    },
    {
      group: 'SPORTS',
      subjects: ['SPORTS']
    },
    {
      group: 'CREATIVITY SKILLS',
      subjects: ['CREATIVITY SKILLS']
    },
    {
      group: 'NEATNESS',
      subjects: ['NEATNESS']
    },
    {
      group: 'REGULARITY & PUNCTUALITY',
      subjects: ['REGULARITY & PUNCTUALITY']
    },
    {
      group: 'GENERAL AWARENESS',
      subjects: ['GENERAL AWARENESS']
    }
  ];

  const fetchLinks = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/academics/subject-links');
      const data = await res.json();
      if (data.success && data.data) {
        setLinks(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/academics/classes');
      const data = await res.json();
      if (data.success && data.data) {
        setClasses(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLinks();
    fetchClasses();
  }, []);

  const handleOpenRowEdit = (row) => {
    setSelectedClassForEdit(row.className);
    const initialSelected = new Set(row.linkedSubjectNames || []);
    setSelectedSubjects(initialSelected);
  };

  const handleToggleSubject = (sub) => {
    setSelectedSubjects((prev) => {
      const next = new Set(prev);
      if (next.has(sub)) next.delete(sub);
      else next.add(sub);
      return next;
    });
  };

  const handleSaveLinks = async (className) => {
    try {
      const res = await fetch('http://localhost:5000/api/academics/subject-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          className,
          linkedSubjects: Array.from(selectedSubjects)
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchLinks();
        setSelectedClassForEdit(null);
        setAddModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredLinks = links.filter((l) =>
    searchQuery ? l.className.toLowerCase().includes(searchQuery.toLowerCase()) : true
  );

  return (
    <div className="bg-[#f3f4f6] min-h-screen">
      {/* 1:1 Secondary Toolbar Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs">
          <h1 className="text-xl font-bold text-slate-800 pr-3 border-r border-slate-300">
            Subject Link
          </h1>
          <Home className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">&bull;</span>
          <span className="text-slate-500 hover:text-indigo-600 cursor-pointer">Examination</span>
          <span className="text-slate-400">&bull;</span>
          <span className="text-indigo-600 font-semibold">Subject Link</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="p-6">
        <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
          {/* Action Bar */}
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs rounded-full border border-slate-200 pl-9 pr-4 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                title="Filter Columns"
                className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <ListFilter className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedClassForAdd(classes[0]?.name || '');
                  setSelectedSubjects(new Set());
                  setAddModalOpen(true);
                }}
                title="Add Subject Link"
                className="w-9 h-9 rounded-full bg-[#5c67f6] hover:bg-indigo-700 text-white flex items-center justify-center shadow-md transition-transform hover:scale-105 active:scale-95"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-700 font-bold text-[11px] uppercase">
                  <th className="py-3 px-4 w-16">S.NO.</th>
                  <th className="py-3 px-4">CLASS</th>
                  <th className="py-3 px-4">LINKED SUBJECT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredLinks.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-slate-400">
                      No records found
                    </td>
                  </tr>
                ) : (
                  filteredLinks.map((l, idx) => (
                    <tr
                      key={idx}
                      onClick={() => handleOpenRowEdit(l)}
                      className="hover:bg-indigo-50/50 cursor-pointer transition-colors group"
                    >
                      <td className="py-3 px-4 font-mono">{idx + 1}</td>
                      <td className="py-3 px-4 font-bold text-slate-900 group-hover:text-indigo-600">
                        {l.className}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[11px] border border-slate-200">
                          {l.linkedSubjectsCount || 10}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-end space-x-6 text-xs text-slate-500">
            <div className="flex items-center space-x-2">
              <span>Items per page:</span>
              <select className="border border-slate-200 rounded px-2 py-1 bg-white text-xs">
                <option value="50">50</option>
                <option value="25">25</option>
              </select>
            </div>
            <span>1 – {filteredLinks.length} of {filteredLinks.length}</span>
            <div className="flex items-center space-x-1">
              <button disabled className="p-1 text-slate-300 cursor-not-allowed">&lt;</button>
              <button disabled className="p-1 text-slate-300 cursor-not-allowed">&gt;</button>
            </div>
          </div>
        </div>
      </div>

      {/* 1:1 SUBJECT LINK DIALOG (Matches exact UAB layout with grouped checklist) */}
      {(selectedClassForEdit || addModalOpen) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[85vh] overflow-hidden">
            {/* Header */}
            <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 uppercase">
                SUBJECT LINK
              </h3>
              <button
                onClick={() => {
                  setSelectedClassForEdit(null);
                  setAddModalOpen(false);
                }}
                className="w-7 h-7 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Class Selector / Header */}
            <div className="p-4 border-b border-slate-200 bg-white">
              {selectedClassForEdit ? (
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-0.5">Class</label>
                  <input
                    type="text"
                    disabled
                    value={selectedClassForEdit}
                    className="w-full rounded border border-slate-200 bg-slate-50 px-3 py-1.5 font-bold text-slate-800 text-xs"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Class*</label>
                  <select
                    value={selectedClassForAdd}
                    onChange={(e) => setSelectedClassForAdd(e.target.value)}
                    className="w-full rounded border border-slate-300 px-3 py-1.5 bg-white text-xs focus:border-indigo-500 focus:outline-none"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Grouped Subject Checklists */}
            <div className="overflow-y-auto flex-1 p-6 space-y-5">
              {subjectGroupsData.map((grp) => (
                <div key={grp.group} className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
                  <div className="font-bold text-xs text-indigo-900 uppercase tracking-wide border-b border-slate-200 pb-1.5 mb-2.5 flex items-center justify-between">
                    <span>{grp.group}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const allSelected = grp.subjects.every((s) => selectedSubjects.has(s));
                        setSelectedSubjects((prev) => {
                          const next = new Set(prev);
                          grp.subjects.forEach((s) => {
                            if (allSelected) next.delete(s);
                            else next.add(s);
                          });
                          return next;
                        });
                      }}
                      className="text-[10px] text-indigo-600 hover:text-indigo-800 font-semibold"
                    >
                      {grp.subjects.every((s) => selectedSubjects.has(s)) ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {grp.subjects.map((sub) => {
                      const isChecked = selectedSubjects.has(sub);
                      return (
                        <label
                          key={sub}
                          className="flex items-center space-x-2 text-slate-700 hover:text-slate-900 cursor-pointer p-1 rounded hover:bg-slate-100"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleSubject(sub)}
                            className="rounded w-4 h-4 text-indigo-600 focus:ring-0"
                          />
                          <span className="font-medium">{sub}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons: Cancel & Modify / Add */}
            <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedClassForEdit(null);
                  setAddModalOpen(false);
                }}
                className="px-4 py-2 rounded text-slate-600 hover:bg-slate-100 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSaveLinks(selectedClassForEdit || selectedClassForAdd)}
                className="px-6 py-2 rounded bg-[#5c67f6] hover:bg-indigo-700 text-white font-bold text-xs shadow-md"
              >
                {selectedClassForEdit ? 'Modify' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubjectLinkPage;
