import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Search,
  Plus,
  Home,
  Trash2,
  Edit2,
  CheckCircle2,
  FileDown
} from 'lucide-react';

const INITIAL_REMARKS = [
  { id: '1', remarkNumber: '352', remarkTitle: 'Not Submitted Activities, Work Hard', createdDate: '2026-08-10', updatedDate: '2026-09-01' },
  { id: '2', remarkNumber: '351', remarkTitle: 'Careless attitude, not submitted activities on time', createdDate: '2026-08-10', updatedDate: '2026-09-01' },
  { id: '3', remarkNumber: '350', remarkTitle: 'Good, You Can Still Do Better, but Hard Work Is Required In Maths', createdDate: '2026-08-11', updatedDate: '2026-09-02' },
  { id: '4', remarkNumber: '349', remarkTitle: 'Careless attitude, not submitted activities', createdDate: '2026-08-11', updatedDate: '2026-09-02' },
  { id: '5', remarkNumber: '348', remarkTitle: 'Careless attitude, not submitted notebooks', createdDate: '2026-08-12', updatedDate: '2026-09-02' },
  { id: '6', remarkNumber: '347', remarkTitle: 'Careless attitude, not submitted notebooks and activities', createdDate: '2026-08-12', updatedDate: '2026-09-03' },
  { id: '7', remarkNumber: '346', remarkTitle: 'She is introvert but has caliber to do much better', createdDate: '2026-08-14', updatedDate: '2026-09-03' },
  { id: '8', remarkNumber: '345', remarkTitle: 'Wants to do work on an average', createdDate: '2026-08-14', updatedDate: '2026-09-03' },
  { id: '9', remarkNumber: '344', remarkTitle: 'You Have Caliber To Do Better', createdDate: '2026-08-15', updatedDate: '2026-09-04' },
  { id: '10', remarkNumber: '343', remarkTitle: 'Work Is Appreciable', createdDate: '2026-08-15', updatedDate: '2026-09-04' },
  { id: '11', remarkNumber: '342', remarkTitle: 'Well Done ! Keep It Up', createdDate: '2026-08-16', updatedDate: '2026-09-05' },
  { id: '12', remarkNumber: '341', remarkTitle: 'Well disciplined, shows concern for others', createdDate: '2026-08-16', updatedDate: '2026-09-05' },
  { id: '13', remarkNumber: '340', remarkTitle: 'Well Behaved, Follows Instructions, Respects Teachers A Lot', createdDate: '2026-08-17', updatedDate: '2026-09-06' },
  { id: '14', remarkNumber: '339', remarkTitle: 'Well Behaved Student', createdDate: '2026-08-17', updatedDate: '2026-09-06' },
  { id: '15', remarkNumber: '338', remarkTitle: 'Well Behaved And Hard Working', createdDate: '2026-08-18', updatedDate: '2026-09-07' },
  { id: '16', remarkNumber: '337', remarkTitle: 'Very courteous, sincere towards teachers', createdDate: '2026-08-18', updatedDate: '2026-09-07' }
];

export function ReportCardRemarksReportPage({ onNavigate }) {
  const [remarks, setRemarks] = useState(INITIAL_REMARKS);
  const [searchTerm, setSearchTerm] = useState('');
  const [remarkNumber, setRemarkNumber] = useState('');
  const [remarkTitle, setRemarkTitle] = useState('');
  const [editingId, setEditingId] = useState(null);

  const filteredRemarks = remarks.filter(r =>
    r.remarkNumber.includes(searchTerm) ||
    r.remarkTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddOrUpdate = (e) => {
    e.preventDefault();
    if (!remarkTitle.trim()) return;

    const today = new Date().toISOString().split('T')[0];

    if (editingId) {
      setRemarks(prev => prev.map(r => r.id === editingId ? {
        ...r,
        remarkNumber: remarkNumber || r.remarkNumber,
        remarkTitle: remarkTitle.trim(),
        updatedDate: today
      } : r));
      setEditingId(null);
    } else {
      const nextNum = remarkNumber.trim() || (remarks.length + 340).toString();
      const newRemark = {
        id: Date.now().toString(),
        remarkNumber: nextNum,
        remarkTitle: remarkTitle.trim(),
        createdDate: today,
        updatedDate: today
      };
      setRemarks(prev => [newRemark, ...prev]);
    }
    setRemarkNumber('');
    setRemarkTitle('');
  };

  const handleEdit = (r) => {
    setEditingId(r.id);
    setRemarkNumber(r.remarkNumber);
    setRemarkTitle(r.remarkTitle);
  };

  const handleDelete = (id) => {
    setRemarks(prev => prev.filter(r => r.id !== id));
  };

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["S.No,Remark Number,Remark Title,Created Date,Updated Date"].concat(
        remarks.map((r, i) =>
          `"${i + 1}","${r.remarkNumber}","${r.remarkTitle}","${r.createdDate}","${r.updatedDate}"`
        )
      ).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "report_card_remarks.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1:1 Secondary Top Header Toolbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-bold text-slate-800 pr-3 border-r border-slate-300">
            Report Card Remark
          </h1>
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <button onClick={() => onNavigate?.('/')} className="hover:text-indigo-600 flex items-center">
              <Home className="w-3.5 h-3.5 mr-1" />
            </button>
            <span>•</span>
            <span className="hover:text-indigo-600 cursor-pointer" onClick={() => onNavigate?.('/examination-reports')}>Examination</span>
            <span>•</span>
            <span className="text-slate-800 font-medium">Report Card Remark</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={exportCSV}
            className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 text-xs font-semibold flex items-center gap-1.5"
            title="Excel Export"
          >
            <FileDown className="w-4 h-4" />
            <span className="hidden sm:inline">Excel</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 max-w-7xl mx-auto w-full space-y-4">
        {/* Top Input Form matching UAB 1:1 */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <form onSubmit={handleAddOrUpdate} className="flex flex-wrap items-center gap-4 text-xs">
            <div className="w-40">
              <label className="block font-bold text-slate-600 mb-1">Remark Number</label>
              <input
                type="text"
                placeholder="Auto / e.g. 353"
                value={remarkNumber}
                onChange={(e) => setRemarkNumber(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-semibold focus:bg-white focus:outline-hidden"
              />
            </div>

            <div className="flex-1 min-w-[280px]">
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-slate-600">Remark Title *</label>
                <span className="text-[11px] text-slate-400 font-medium">{remarkTitle.length}/250</span>
              </div>
              <input
                type="text"
                required
                maxLength={250}
                placeholder="Enter feedback or performance remark for report cards..."
                value={remarkTitle}
                onChange={(e) => setRemarkTitle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-medium focus:bg-white focus:outline-hidden focus:border-indigo-500"
              />
            </div>

            <div className="self-end flex gap-2">
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-xs active:scale-95 transition-transform"
              >
                {editingId ? 'Update' : 'Add'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setRemarkNumber('');
                    setRemarkTitle('');
                  }}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by remark number or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden"
            />
          </div>
          <div className="text-xs text-slate-500 font-semibold">
            Total Saved Remarks: <span className="text-slate-900 font-bold">{remarks.length}</span>
          </div>
        </div>

        {/* Table View */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4 w-16 text-center">S.No.</th>
                  <th className="py-3 px-4 w-36 text-center">Remark Number</th>
                  <th className="py-3 px-4">Remark Title</th>
                  <th className="py-3 px-4 w-28 text-center">Action</th>
                  <th className="py-3 px-4 w-32 text-center">Created Date</th>
                  <th className="py-3 px-4 w-32 text-center">Updated Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredRemarks.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center font-bold text-slate-500">{index + 1}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md font-mono font-bold text-xs bg-slate-100 text-slate-800 border border-slate-200">
                        {item.remarkNumber}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{item.remarkTitle}</td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-1.5 hover:bg-slate-100 rounded text-slate-600 hover:text-indigo-600"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 hover:bg-red-50 rounded text-slate-400 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center text-slate-500 font-mono text-[11px]">{item.createdDate}</td>
                    <td className="py-3.5 px-4 text-center text-slate-500 font-mono text-[11px]">{item.updatedDate}</td>
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
