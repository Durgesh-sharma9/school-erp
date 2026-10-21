import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Download, 
  Printer, 
  Calendar, 
  Clock, 
  Tag, 
  Users, 
  AlertCircle,
  FileText,
  Share2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export function NoticeBoardPage() {
  const { schoolId, schoolName } = useAuth();
  const [notices, setNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [printNotice, setPrintNotice] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Academic',
    target: 'All',
    priority: 'Normal',
    date: new Date().toISOString().split('T')[0],
    time: 'All Day',
    description: '',
    attachment: ''
  });

  const categories = ['All', 'Academic', 'Exam', 'Holiday', 'Sports', 'General', 'Fees'];

  const fetchNotices = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/notices?category=${selectedCategory}`, {
        headers: { 'x-school-id': schoolId }
      });
      if (res.ok) {
        const json = await res.json();
        setNotices(json.data.notices || []);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [schoolId, selectedCategory]);

  const handleCreateNotice = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error('Please enter notice title and description');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/notices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-school-id': schoolId
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success('Notice published and broadcasted to mobile apps!');
        setIsModalOpen(false);
        setFormData({
          title: '',
          category: 'Academic',
          target: 'All',
          priority: 'Normal',
          date: new Date().toISOString().split('T')[0],
          time: 'All Day',
          description: '',
          attachment: ''
        });
        fetchNotices();
      }
    } catch {
      toast.error('Failed to publish notice');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this notice circular?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/notices/${id}`, {
        method: 'DELETE',
        headers: { 'x-school-id': schoolId }
      });
      if (res.ok) {
        toast.success('Notice deleted');
        setNotices(prev => prev.filter(n => n.id !== id));
      }
    } catch {
      toast.error('Error deleting notice');
    }
  };

  const filtered = notices.filter(n => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-indigo-600" />
            Official Notice Board & Circulars Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Broadcast institutional circulars, PTM notifications, exam schedules, and holiday announcements.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Broadcast Notice
          </button>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 sm:pb-0 custom-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search circulars..."
            className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white shadow-2xs"
          />
        </div>
      </div>

      {/* Notices Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
            No circulars published under this category.
          </div>
        ) : (
          filtered.map((notice) => {
            const isUrgent = notice.priority === 'Urgent';
            const isHigh = notice.priority === 'High';

            return (
              <div 
                key={notice.id} 
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between hover:shadow-md transition-all space-y-4"
              >
                <div className="space-y-3">
                  {/* Badges Bar */}
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {notice.category}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {isUrgent && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 animate-pulse">
                          🔴 Urgent
                        </span>
                      )}
                      {isHigh && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          🟡 High Priority
                        </span>
                      )}
                      <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                        👥 {notice.target}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                      {notice.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                      {notice.description}
                    </p>
                  </div>
                </div>

                {/* Footer Info & Actions */}
                <div className="border-t border-slate-100 pt-3 space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {notice.date}
                    </span>
                    <span className="truncate max-w-[120px]">By {notice.publishedBy}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    {notice.attachment ? (
                      <button
                        onClick={() => toast.success(`Downloading ${notice.attachment}...`)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" /> PDF Attached
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-300 italic">No attachment</span>
                    )}

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setPrintNotice(notice)}
                        className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="Print Circular"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(notice.id)}
                        className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Notice"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Printable Circular Modal */}
      {printNotice && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl border border-slate-200">
            {/* School Header */}
            <div className="text-center border-b-2 border-slate-900 pb-4 mb-6">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{schoolName}</h2>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">Affiliated to CBSE, New Delhi &bull; Affiliation No: 1730619</p>
              <p className="text-xs text-slate-500">Vidhyadhar Nagar, Jaipur, Rajasthan - 302026</p>
              <div className="inline-block px-4 py-1 mt-3 bg-slate-900 text-white font-bold text-xs uppercase tracking-widest rounded-full">
                OFFICIAL CIRCULAR / NOTIFICATION
              </div>
            </div>

            {/* Circular Content */}
            <div className="space-y-4">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Ref No: CIR/2026/{printNotice.id}</span>
                <span>Date: {printNotice.date}</span>
              </div>

              <div className="text-center font-bold text-base text-slate-900 underline decoration-indigo-600 decoration-2 underline-offset-4">
                {printNotice.title}
              </div>

              <p className="text-sm text-slate-800 leading-relaxed font-serif whitespace-pre-line pt-2">
                {printNotice.description}
              </p>

              <div className="pt-8 flex justify-between items-end text-xs font-bold text-slate-800">
                <div>
                  <p>Copy to:</p>
                  <p className="font-normal text-slate-500 text-[11px]">1. Notice Board<br />2. Staff Room<br />3. Student Portal</p>
                </div>
                <div className="text-center">
                  <p className="border-t border-slate-900 pt-1 w-40">Authorized Signatory</p>
                  <p className="font-normal text-slate-500 text-[11px]">{printNotice.publishedBy}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-2 border-t border-slate-100 pt-4 print:hidden">
              <button
                onClick={() => setPrintNotice(null)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700"
              >
                Print Official Circular
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Broadcast Notice Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-600" />
              Broadcast School Notice
            </h2>
            <p className="text-xs text-slate-500 mt-1">Publish announcement directly to parent and teacher apps.</p>

            <form onSubmit={handleCreateNotice} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase">Notice Title*</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Annual Sports Meet 2026"
                  className="mt-1 w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="mt-1 w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                  >
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase">Target</label>
                  <select
                    value={formData.target}
                    onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                    className="mt-1 w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="All">All School</option>
                    <option value="Parents">Parents Only</option>
                    <option value="Students">Students Only</option>
                    <option value="Staff">Faculty / Staff</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="mt-1 w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent 🔴</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase">Detailed Description*</label>
                <textarea
                  rows="4"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Complete details of the announcement..."
                  className="mt-1 w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase">Attachment File Name (Optional)</label>
                <input
                  type="text"
                  value={formData.attachment}
                  onChange={(e) => setFormData({ ...formData, attachment: e.target.value })}
                  placeholder="e.g. Schedule_2026.pdf"
                  className="mt-1 w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-semibold text-xs sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-xs sm:text-sm shadow-xs"
                >
                  Publish & Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
