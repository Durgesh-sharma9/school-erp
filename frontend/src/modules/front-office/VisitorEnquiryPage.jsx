import React, { useState } from 'react';
import {
  UserCheck,
  Search,
  Home,
  Plus,
  Printer,
  FileDown,
  X,
  Phone,
  MapPin,
  FileText,
  Calendar,
  Eye,
  Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';

const INITIAL_VISITORS = [
  {
    id: '1',
    enquiryDate: '2026-10-15',
    visitorName: 'Dr. Alok Nath',
    contactNo: '9828012345',
    purpose: 'Admission Query',
    type: 'Prospective Parent',
    studentName: 'Aarav Nath',
    className: 'Nursery',
    gender: 'Male',
    address: 'Flat 402, Royal Palms, C-Scheme, Jaipur',
    description: 'Looking for Nursery admission for upcoming academic session. Enquired about fee structure, sports academy, and school bus routes.',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: '2',
    enquiryDate: '2026-10-14',
    visitorName: 'Sanjay Mathur',
    contactNo: '9414088990',
    purpose: 'Document Verification',
    type: 'Official / Education Board',
    studentName: 'N/A',
    className: 'CBSE Secondary',
    gender: 'Male',
    address: 'CBSE Regional Office, Sector 5, Mansarovar, Jaipur',
    description: 'Annual affiliation checklist inspection and lab infrastructure verification.',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80'
  }
];

export function VisitorEnquiryPage({ onNavigate }) {
  const [visitors, setVisitors] = useState(INITIAL_VISITORS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState(null);

  const [formData, setFormData] = useState({
    enquiryDate: new Date().toISOString().slice(0, 10),
    visitorName: '',
    contactNo: '',
    purpose: 'Admission Query',
    type: 'Visitor',
    studentName: '',
    className: '',
    gender: 'Male',
    address: '',
    description: '',
    photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'
  });

  const openAddModal = () => {
    setFormData({
      enquiryDate: new Date().toISOString().slice(0, 10),
      visitorName: '',
      contactNo: '',
      purpose: 'Admission Query',
      type: 'Visitor',
      studentName: '',
      className: '',
      gender: 'Male',
      address: '',
      description: '',
      photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'
    });
    setIsModalOpen(true);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!formData.visitorName || !formData.contactNo) {
      toast.error('Please enter name and contact number');
      return;
    }
    const newVisitor = {
      id: String(Date.now()),
      ...formData
    };
    setVisitors([newVisitor, ...visitors]);
    toast.success('Visitor enquiry logged successfully');
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this enquiry?')) {
      setVisitors(visitors.filter(v => v.id !== id));
      toast.success('Visitor enquiry deleted');
    }
  };

  const filteredVisitors = visitors.filter(v =>
    v.visitorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.contactNo.includes(searchQuery) ||
    v.purpose.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportCSV = () => {
    const headers = ['S.NO.', 'DATE', 'VISITOR NAME', 'CONTACT NO.', 'PURPOSE', 'TYPE', 'STUDENT NAME', 'CLASS', 'ADDRESS', 'DESCRIPTION'];
    const rows = filteredVisitors.map((v, i) => [
      i + 1,
      `"${v.enquiryDate}"`,
      `"${v.visitorName}"`,
      `"${v.contactNo}"`,
      `"${v.purpose}"`,
      `"${v.type}"`,
      `"${v.studentName}"`,
      `"${v.className}"`,
      `"${v.address}"`,
      `"${v.description}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Visitor_Enquiries_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1:1 Secondary Top Header Toolbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20 print:hidden">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-bold text-slate-800 pr-3 border-r border-slate-300 flex items-center gap-2">
            <UserCheck size={18} className="text-blue-600" />
            <span>Visitor Enquiry</span>
          </h1>
          <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
            <button onClick={() => onNavigate && onNavigate('/')} className="hover:text-blue-600 flex items-center gap-1 transition-colors">
              <Home size={13} />
              <span>Home</span>
            </button>
            <span>/</span>
            <span className="text-slate-400">Front Office</span>
            <span>/</span>
            <span className="text-slate-700 font-semibold">Visitor Enquiry</span>
          </nav>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={exportCSV}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold shadow-sm transition-all"
          >
            <FileDown size={14} />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-semibold shadow-sm transition-all"
          >
            <Printer size={14} />
            <span>Print List</span>
          </button>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* Search Bar & FAB */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between gap-4 print:hidden">
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search Visitor, Phone, Purpose..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={openAddModal}
            className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105"
            title="Add Visitor Enquiry"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Visitors Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 uppercase font-semibold">
                  <th className="py-3 px-4 w-12 text-center">S.NO.</th>
                  <th className="py-3 px-4 w-16">PHOTO</th>
                  <th className="py-3 px-4">DATE</th>
                  <th className="py-3 px-4">VISITOR NAME</th>
                  <th className="py-3 px-4">CONTACT NO.</th>
                  <th className="py-3 px-4">PURPOSE</th>
                  <th className="py-3 px-4">STUDENT / CLASS</th>
                  <th className="py-3 px-4 text-right print:hidden">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredVisitors.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-8 text-center text-slate-400">
                      No visitor enquiries recorded. Click + to add one.
                    </td>
                  </tr>
                ) : (
                  filteredVisitors.map((v, idx) => (
                    <tr key={v.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 text-center font-medium text-slate-500">{idx + 1}</td>
                      <td className="py-3 px-4">
                        <img
                          src={v.photo}
                          alt={v.visitorName}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-xs"
                        />
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">{v.enquiryDate}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{v.visitorName}</td>
                      <td className="py-3 px-4 font-mono text-slate-700">{v.contactNo}</td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          {v.purpose}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {v.studentName ? `${v.studentName} (${v.className})` : '--'}
                      </td>
                      <td className="py-3 px-4 text-right space-x-1.5 print:hidden">
                        <button
                          onClick={() => setSelectedVisitor(v)}
                          className="p-1 text-slate-400 hover:text-blue-600 rounded transition-colors"
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(v.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 1:1 VISITOR ENQUIRY Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="font-bold text-sm uppercase tracking-wide">VISITOR ENQUIRY</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-5 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Enquiry Date</label>
                  <input
                    type="date"
                    required
                    value={formData.enquiryDate}
                    onChange={e => setFormData({ ...formData, enquiryDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Purpose *</label>
                  <select
                    value={formData.purpose}
                    onChange={e => setFormData({ ...formData, purpose: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Admission Query">Admission Query</option>
                    <option value="Fee Query">Fee Query</option>
                    <option value="Meeting Principal">Meeting Principal</option>
                    <option value="Document Submission">Document Submission</option>
                    <option value="Vendor / Supply">Vendor / Supply</option>
                    <option value="Official Visit">Official Visit</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Visitors Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter full name"
                    value={formData.visitorName}
                    onChange={e => setFormData({ ...formData, visitorName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Contact Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile"
                    value={formData.contactNo}
                    onChange={e => setFormData({ ...formData, contactNo: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Address</label>
                <input
                  type="text"
                  placeholder="Residential or office address"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Student Name (if applicable)</label>
                  <input
                    type="text"
                    placeholder="Student Name"
                    value={formData.studentName}
                    onChange={e => setFormData({ ...formData, studentName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Class</label>
                  <input
                    type="text"
                    placeholder="e.g. Class I, Nursery"
                    value={formData.className}
                    onChange={e => setFormData({ ...formData, className: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Description / Discussion Notes</label>
                <textarea
                  rows={3}
                  placeholder="Enquiry details and outcome..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                >
                  Add Enquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Visitor Detail Modal */}
      {selectedVisitor && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden">
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="font-bold text-sm">Visitor Enquiry Details</h3>
              <button onClick={() => setSelectedVisitor(null)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-3 text-xs">
              <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
                <img src={selectedVisitor.photo} alt={selectedVisitor.visitorName} className="w-12 h-12 rounded-full object-cover border" />
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{selectedVisitor.visitorName}</h4>
                  <p className="text-slate-500 font-mono">{selectedVisitor.contactNo}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><span className="text-slate-400 block">Date:</span> <strong>{selectedVisitor.enquiryDate}</strong></div>
                <div><span className="text-slate-400 block">Purpose:</span> <strong>{selectedVisitor.purpose}</strong></div>
                <div><span className="text-slate-400 block">Student:</span> <strong>{selectedVisitor.studentName || 'N/A'}</strong></div>
                <div><span className="text-slate-400 block">Class:</span> <strong>{selectedVisitor.className || 'N/A'}</strong></div>
              </div>
              <div>
                <span className="text-slate-400 block">Address:</span>
                <p className="text-slate-700 font-medium">{selectedVisitor.address || 'Not specified'}</p>
              </div>
              <div>
                <span className="text-slate-400 block">Description:</span>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-200">{selectedVisitor.description}</p>
              </div>
            </div>
            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-end">
              <button onClick={() => setSelectedVisitor(null)} className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded text-xs font-semibold">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
