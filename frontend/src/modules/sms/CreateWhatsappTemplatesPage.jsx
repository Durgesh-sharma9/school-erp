import React, { useState, useEffect } from 'react';
import {
  MessageSquareCode,
  RefreshCw,
  Plus,
  Home,
  Trash2,
  Eye,
  X,
  CheckCircle2,
  AlertCircle,
  FileCode2
} from 'lucide-react';
import toast from 'react-hot-toast';

export function CreateWhatsappTemplatesPage({ onNavigate }) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingTemplate, setViewingTemplate] = useState(null);

  // Modal form states
  const [tempName, setTempName] = useState('');
  const [language, setLanguage] = useState('English');
  const [tempType, setTempType] = useState('Text');
  const [content, setContent] = useState('');

  const fetchTemplates = () => {
    setLoading(true);
    fetch('/api/sms/templates')
      .then(res => res.json())
      .then(d => {
        if (d.success) setTemplates(d.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleSync = async () => {
    toast.loading('Syncing templates with Meta WhatsApp Business API...', { id: 'sync' });
    try {
      const res = await fetch('/api/sms/templates/sync', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message || 'Templates synced successfully!', { id: 'sync' });
        setTemplates(data.data);
      } else {
        toast.error('Sync failed', { id: 'sync' });
      }
    } catch {
      toast.error('Network error during sync', { id: 'sync' });
    }
  };

  const handleCreateTemplate = async (e) => {
    e.preventDefault();
    if (!tempName.trim()) {
      toast.error('Please enter template name');
      return;
    }
    if (!content.trim()) {
      toast.error('Please enter message template text');
      return;
    }

    try {
      const res = await fetch('/api/sms/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tempName,
          language,
          tempType,
          content
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message || 'WhatsApp template created successfully!');
        setIsModalOpen(false);
        setTempName('');
        setContent('');
        fetchTemplates();
      } else {
        toast.error(data.message || 'Failed to create template');
      }
    } catch {
      toast.error('Network error while saving template');
    }
  };

  const handleDeleteTemplate = async (id) => {
    if (!window.confirm('Are you sure you want to delete this template?')) return;
    try {
      const res = await fetch(`/api/sms/templates/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Template deleted');
        fetchTemplates();
      }
    } catch {
      toast.error('Failed to delete template');
    }
  };

  const insertVariable = (variable) => {
    setContent(prev => prev + ` {{${variable}}}`);
  };

  return (
    <div className="p-4 bg-slate-50 min-h-screen text-slate-800">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 bg-white p-3 rounded-lg shadow-sm border border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <MessageSquareCode className="w-6 h-6 text-emerald-600" />
            WhatsApp Templates
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span
              className="flex items-center gap-1 hover:text-indigo-600 cursor-pointer"
              onClick={() => onNavigate && onNavigate('/')}
            >
              <Home className="w-3.5 h-3.5" /> School
            </span>
            <span>/</span>
            <span className="text-indigo-600 font-semibold">Create WhatsApp Templates</span>
          </div>
        </div>

        {/* Action Toolbar matching UAB */}
        <div className="flex items-center gap-2 mt-3 md:mt-0">
          <button
            onClick={handleSync}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-800 text-white rounded text-xs font-semibold shadow-sm transition-all"
            title="Sync with Meta WhatsApp API"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Sync
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold shadow-sm transition-all"
            title="Create New Template"
          >
            <Plus className="w-4 h-4" /> Template Create
          </button>
        </div>
      </div>

      {/* Main Table matching UAB columns */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3 w-16">S.NO.</th>
                <th className="py-2.5 px-3">TEMP. ID</th>
                <th className="py-2.5 px-3">TEMP. NAME</th>
                <th className="py-2.5 px-3 text-center">TEMP. TYPE</th>
                <th className="py-2.5 px-3 text-center">LANGUAGE</th>
                <th className="py-2.5 px-3 text-center">CATEGORY</th>
                <th className="py-2.5 px-3 text-center">STATUS</th>
                <th className="py-2.5 px-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {templates.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-400">
                    No WhatsApp templates registered. Click "Template Create" to add one.
                  </td>
                </tr>
              ) : (
                templates.map((tpl, index) => (
                  <tr key={tpl.id || index} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2 px-3 text-slate-500">{index + 1}</td>
                    <td className="py-2 px-3 font-mono text-indigo-600 text-[11px]">{tpl.tempId}</td>
                    <td className="py-2 px-3 font-semibold text-slate-800">{tpl.tempName}</td>
                    <td className="py-2 px-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                        {tpl.tempType}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center text-slate-600">{tpl.language}</td>
                    <td className="py-2 px-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                        {tpl.category}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {tpl.status}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingTemplate(tpl)}
                          className="p-1 hover:bg-slate-100 text-indigo-600 rounded"
                          title="Preview Template Content"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteTemplate(tpl.id)}
                          className="p-1 hover:bg-slate-100 text-rose-600 rounded"
                          title="Delete Template"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Template Create Dialog Modal matching UAB 1:1 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                WHATSAPP TEMPLATE
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTemplate} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-1">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Template Name</label>
                  <input
                    type="text"
                    placeholder="e.g. fee_reminder_june"
                    value={tempName}
                    onChange={e => setTempName(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Language</label>
                  <select
                    value={language}
                    onChange={e => setLanguage(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Message type</label>
                  <select
                    value={tempType}
                    onChange={e => setTempType(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Text">Text</option>
                    <option value="Media">Media (Image/Document)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Msg Here (Required)</label>
                <textarea
                  rows={4}
                  placeholder="Enter template content. Use dynamic variables like {{name}}, {{class}}, {{due_amount}}..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Exact Variable Reference Note matching UAB 1:1 */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-[11px] leading-relaxed">
                <div className="font-bold text-amber-950 mb-1 flex items-center gap-1.5">
                  <FileCode2 className="w-3.5 h-3.5 text-amber-700" />
                  Available Placeholders / Variables:
                </div>
                <p className="text-slate-700">
                  <strong>Note :</strong> {'{{sr_no}}'} = Sr.No., {'{{adm_no}}'} = Adm.No., {'{{name}}'} = Name, {'{{class}}'} = class, {'{{stream}}'} = Stream, {'{{from_month}}'} = Fee from month, {'{{to_month}}'} = Fee to month, {'{{months}}'} = Months (Apr - Mar), {'{{total_amount}}'} = Fee total amt, {'{{paid_amount}}'} = Fee paid amt, {'{{due_amount}}'} = Fee due amt, {'{{amount}}'} = Fee closing, {'{{discount_amount}}'} = Fee dis amt, {'{{otp}}'} = One Time Password, {'{{subject}}'} = Subject Name, {'{{date}}'} = Test Date, {'{{obtmarks}}'} = Obt Marks, {'{{totalmarks}}'} = Total Marks
                </p>

                {/* Quick Insert Pills */}
                <div className="mt-2 pt-2 border-t border-amber-200/60 flex flex-wrap gap-1.5">
                  {['name', 'class', 'due_amount', 'months', 'date', 'adm_no'].map(varName => (
                    <button
                      key={varName}
                      type="button"
                      onClick={() => insertVariable(varName)}
                      className="px-2 py-0.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-mono text-[10px] rounded border border-amber-300 transition-colors"
                    >
                      + {`{{${varName}}}`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-1.5 border border-slate-300 rounded text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold shadow-sm transition-colors"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Dialog */}
      {viewingTemplate && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800">
                Template: {viewingTemplate.tempName}
              </h2>
              <button
                onClick={() => setViewingTemplate(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex gap-2 text-xs">
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">ID: {viewingTemplate.tempId}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">{viewingTemplate.status}</span>
              </div>
              <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-lg text-xs font-sans text-slate-800 leading-relaxed whitespace-pre-wrap">
                {viewingTemplate.content}
              </div>
            </div>
            <div className="p-3 bg-slate-50 border-t border-slate-100 text-right">
              <button
                onClick={() => setViewingTemplate(null)}
                className="px-4 py-1.5 bg-slate-700 text-white rounded text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default CreateWhatsappTemplatesPage;
