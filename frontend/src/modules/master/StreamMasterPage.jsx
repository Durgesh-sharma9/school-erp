import React, { useState, useEffect } from 'react';
import {
  Home,
  Search,
  ListFilter,
  Plus,
  Trash2,
  X
} from 'lucide-react';

export function StreamMasterPage() {
  const [streams, setStreams] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newStreamName, setNewStreamName] = useState('');

  // Fetch streams
  const fetchStreams = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/academics/streams');
      const data = await res.json();
      if (data.success && data.data) {
        setStreams(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch streams:', err);
    }
  };

  useEffect(() => {
    fetchStreams();
  }, []);

  const handleAddStream = async (e) => {
    e.preventDefault();
    if (!newStreamName) return;

    try {
      const res = await fetch('http://localhost:5000/api/academics/streams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stream: newStreamName })
      });
      const data = await res.json();
      if (data.success) {
        fetchStreams();
        setAddModalOpen(false);
        setNewStreamName('');
      }
    } catch (err) {
      console.error('Error adding stream:', err);
    }
  };

  const handleDeleteStream = async (id) => {
    if (!window.confirm('Are you sure you want to delete this stream?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/academics/streams/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        fetchStreams();
      }
    } catch (err) {
      console.error('Error deleting stream:', err);
    }
  };

  const filteredStreams = streams.filter((s) =>
    searchQuery ? s.stream.toLowerCase().includes(searchQuery.toLowerCase()) : true
  );

  return (
    <div className="bg-[#f3f4f6] min-h-screen">
      {/* 1:1 Secondary Toolbar Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs">
          <h1 className="text-xl font-bold text-slate-800 pr-3 border-r border-slate-300">
            Stream
          </h1>
          <Home className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">&bull;</span>
          <span className="text-slate-500 hover:text-indigo-600 cursor-pointer">Masters</span>
          <span className="text-slate-400">&bull;</span>
          <span className="text-indigo-600 font-semibold">Stream</span>
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
                onClick={() => setAddModalOpen(true)}
                title="Add Stream"
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
                  <th className="py-3 px-4">STREAM</th>
                  <th className="py-3 px-4 text-right w-16"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredStreams.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-slate-400">
                      No records found
                    </td>
                  </tr>
                ) : (
                  filteredStreams.map((s, idx) => (
                    <tr key={s.id || idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono">{idx + 1}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{s.stream}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteStream(s.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
            <span>1 – {filteredStreams.length} of {filteredStreams.length}</span>
            <div className="flex items-center space-x-1">
              <button disabled className="p-1 text-slate-300 cursor-not-allowed">&lt;</button>
              <button disabled className="p-1 text-slate-300 cursor-not-allowed">&gt;</button>
            </div>
          </div>
        </div>
      </div>

      {/* 1:1 ADD STREAM MODAL */}
      {addModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-sm text-slate-900 uppercase">STREAM</h3>
              <button
                onClick={() => setAddModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddStream} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                  Stream Name*
                </label>
                <input
                  type="text"
                  required
                  value={newStreamName}
                  onChange={(e) => setNewStreamName(e.target.value)}
                  className="w-full rounded border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
                  placeholder="e.g. ARTS"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-[#5c67f6] hover:bg-indigo-700 text-white font-bold shadow-md"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default StreamMasterPage;
