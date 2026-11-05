import React, { useState } from 'react';
import { 
  Briefcase, 
  BookOpen, 
  GraduationCap, 
  Plus, 
  Trash2, 
  Save
} from 'lucide-react';
import toast from 'react-hot-toast';
import { PageHeader } from './components/PageHeader';

export function RecruitmentSettingsPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('positions');

  const [positions, setPositions] = useState([
    'PGT Mathematics (Classes XI & XII)',
    'PGT Physics (Classes XI & XII)',
    'PGT Chemistry (Classes XI & XII)',
    'PGT Biology (Classes XI & XII)',
    'TGT English & Social Science',
    'TGT Science & Mathematics',
    'TGT Hindi & Sanskrit',
    'PRT Mother Teacher (Primary Classes I-III)',
    'Senior Physical Education Teacher & Sports Coach',
    'Senior School Accountant (Tally Prime & ERP)',
    'School Bus Driver (Heavy Vehicle License)',
    'Computer Teacher / AI Lab Incharge',
    'Music & Dance Teacher',
    'School Receptionist / Front Desk Executive'
  ]);

  const [subjects, setSubjects] = useState([
    'Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 
    'Hindi', 'Sanskrit', 'Social Science', 'Computer Science & AI', 
    'Physical Education', 'Economics', 'Business Studies', 'Accountancy', 'General Science'
  ]);

  const [qualifications, setQualifications] = useState([
    'Ph.D in Relevant Subject', 'M.Sc + B.Ed', 'M.A + B.Ed', 'M.Com + Tally', 
    'B.Sc + B.Ed', 'B.A + B.Ed', 'B.P.Ed / M.P.Ed / NIS', 'B.Com / M.Com', 
    'B.Ed (Bachelor of Education)', 'D.El.Ed / NTT', 'B.Tech / MCA'
  ]);

  const [newItemText, setNewItemText] = useState('');

  const handleAddItem = (e) => {
    e.preventDefault();
    const trimmed = newItemText.trim();
    if (!trimmed) return;

    if (activeTab === 'positions') {
      if (positions.includes(trimmed)) {
        toast.error('Position already exists');
        return;
      }
      setPositions(p => [...p, trimmed]);
    } else if (activeTab === 'subjects') {
      if (subjects.includes(trimmed)) {
        toast.error('Subject already exists');
        return;
      }
      setSubjects(s => [...s, trimmed]);
    } else if (activeTab === 'qualifications') {
      if (qualifications.includes(trimmed)) {
        toast.error('Qualification already exists');
        return;
      }
      setQualifications(q => [...q, trimmed]);
    }

    setNewItemText('');
    toast.success(`Added new entry to ${activeTab}!`);
  };

  const handleRemoveItem = (itemToRemove) => {
    if (activeTab === 'positions') {
      setPositions(p => p.filter(i => i !== itemToRemove));
    } else if (activeTab === 'subjects') {
      setSubjects(s => s.filter(i => i !== itemToRemove));
    } else if (activeTab === 'qualifications') {
      setQualifications(q => q.filter(i => i !== itemToRemove));
    }
    toast.success('Removed entry successfully');
  };

  const handleSaveAll = () => {
    toast.success('Recruitment master criteria saved successfully!');
  };

  return (
    <div className="p-3 sm:p-4 lg:p-5 space-y-4 max-w-5xl mx-auto pb-16 antialiased text-slate-800">
      {/* ─── Page Header (1:1 HireHub) ─── */}
      <PageHeader
        title="Recruitment Master Settings"
        description="Configure open teaching positions, recognized qualification standards, and teaching subjects."
        action={
          <button
            type="button"
            onClick={handleSaveAll}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white rounded-xl bg-gradient-to-r from-[#8A3BD4] to-[#A855F7] hover:opacity-95 shadow-md shadow-purple-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Settings</span>
          </button>
        }
      />

      {/* ─── Category Tabs ─── */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { id: 'positions', label: 'Staff Positions', count: positions.length, icon: Briefcase },
          { id: 'subjects', label: 'Teaching Subjects', count: subjects.length, icon: BookOpen },
          { id: 'qualifications', label: 'Qualifications', count: qualifications.length, icon: GraduationCap }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-[#0F766E] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ─── Tab Content ─── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-black text-slate-900 capitalize">Active {activeTab}</h2>
            <p className="text-[11px] text-slate-500">
              These options appear in dropdown filters and candidate application forms.
            </p>
          </div>

          {/* Quick Add Form */}
          <form onSubmit={handleAddItem} className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              placeholder={`Add new ${activeTab.slice(0, -1)}...`}
              className="px-3.5 py-1.5 text-xs border border-slate-200 rounded-xl bg-white w-full sm:w-64 focus:ring-2 focus:ring-[#0F766E]/20"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-[#0F766E] hover:bg-[#0D655E] shadow-xs cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>
        </div>

        {/* Tag Pills List */}
        <div className="flex flex-wrap gap-2.5">
          {(activeTab === 'positions' ? positions : activeTab === 'subjects' ? subjects : qualifications).map((item, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-800 transition group"
            >
              <span>{item}</span>
              <button
                type="button"
                onClick={() => handleRemoveItem(item)}
                className="text-slate-400 hover:text-rose-500 transition cursor-pointer"
                title="Remove"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RecruitmentSettingsPage;
