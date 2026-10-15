import React, { useState } from 'react';
import {
  GraduationCap,
  Search,
  Home,
  Plus,
  Printer,
  FileDown,
  X,
  Phone,
  Mail,
  Calendar,
  Building2,
  Eye,
  CheckCircle,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

const INITIAL_PRE_ADMISSIONS = [
  {
    id: '1',
    regNo: 'PRE-2026-101',
    firstName: 'Vivaan',
    lastName: 'Sharma',
    gender: 'Male',
    dob: '2022-04-12',
    contactNo: '9829033445',
    email: 'vivaan.parents@gmail.com',
    className: 'Nursery - PP3+',
    fatherName: 'Gaurav Sharma',
    fatherOccupation: 'Chartered Accountant',
    motherName: 'Megha Sharma',
    motherOccupation: 'Software Engineer',
    address: 'D-84, Hanuman Nagar, Vaishali Nagar, Jaipur',
    prevSchool: 'Kids Care Play School, Jaipur',
    feedback: 'Child is very active and communicative. Cleared basic interaction session.',
    status: 'Shortlisted',
    photo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: '2',
    regNo: 'PRE-2026-102',
    firstName: 'Ananya',
    lastName: 'Singhal',
    gender: 'Female',
    dob: '2020-09-18',
    contactNo: '9783011223',
    email: 'ananya.singhal@yahoo.com',
    className: 'Class I',
    fatherName: 'Amit Singhal',
    fatherOccupation: 'Businessman',
    motherName: 'Ritu Singhal',
    motherOccupation: 'Homemaker',
    address: 'Plot 12, Tonk Road, Jaipur',
    prevSchool: 'Seedling Nursery, Jaipur',
    feedback: 'Good academic readiness and polite behavior.',
    status: 'Admitted',
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80'
  }
];

export function PreAdmissionPage({ onNavigate }) {
  const [list, setList] = useState(INITIAL_PRE_ADMISSIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: 'Male',
    dob: '2022-01-01',
    contactNo: '',
    email: '',
    className: 'Nursery',
    fatherName: '',
    fatherOccupation: '',
    motherName: '',
    motherOccupation: '',
    address: '',
    prevSchool: '',
    feedback: '',
    photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'
  });

  const openAddModal = () => {
    setFormData({
      firstName: '',
      lastName: '',
      gender: 'Male',
      dob: '2022-01-01',
      contactNo: '',
      email: '',
      className: 'Nursery',
      fatherName: '',
      fatherOccupation: '',
      motherName: '',
      motherOccupation: '',
      address: '',
      prevSchool: '',
      feedback: '',
      photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'
    });
    setIsModalOpen(true);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.contactNo) {
      toast.error('Please enter first name and contact number');
      return;
    }
    const newApplicant = {
      id: String(Date.now()),
      regNo: `PRE-2026-${100 + list.length + 1}`,
      status: 'Registered',
      ...formData
    };
    setList([newApplicant, ...list]);
    toast.success('Pre-Admission registration completed successfully');
    setIsModalOpen(false);
  };

  const filteredList = list.filter(a =>
    `${a.firstName} ${a.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.contactNo.includes(searchQuery) ||
    a.fatherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.regNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportCSV = () => {
    const headers = ['S.NO.', 'REG NO.', 'FIRST NAME', 'LAST NAME', 'CLASS', 'GENDER', 'DOB', 'CONTACT NO', 'EMAIL', 'FATHER NAME', 'PREV SCHOOL', 'STATUS'];
    const rows = filteredList.map((a, i) => [
      i + 1,
      `"${a.regNo}"`,
      `"${a.firstName}"`,
      `"${a.lastName}"`,
      `"${a.className}"`,
      `"${a.gender}"`,
      `"${a.dob}"`,
      `"${a.contactNo}"`,
      `"${a.email}"`,
      `"${a.fatherName}"`,
      `"${a.prevSchool}"`,
      `"${a.status}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Pre_Admission_List_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1:1 Secondary Top Header Toolbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20 print:hidden">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-bold text-slate-800 pr-3 border-r border-slate-300 flex items-center gap-2">
            <GraduationCap size={18} className="text-blue-600" />
            <span>Pre-Admission Registration</span>
          </h1>
          <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
            <button onClick={() => onNavigate && onNavigate('/')} className="hover:text-blue-600 flex items-center gap-1 transition-colors">
              <Home size={13} />
              <span>Home</span>
            </button>
            <span>/</span>
            <span className="text-slate-400">Front Office</span>
            <span>/</span>
            <span className="text-slate-700 font-semibold">Pre-Admission</span>
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
              placeholder="Search Student, Reg No, Phone, Father Name..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={openAddModal}
            className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105"
            title="Register Pre-Admission"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 uppercase font-semibold">
                  <th className="py-3 px-4 w-12 text-center">S.NO.</th>
                  <th className="py-3 px-4 w-16">PHOTO</th>
                  <th className="py-3 px-4">NAME</th>
                  <th className="py-3 px-4">CONTACT NO</th>
                  <th className="py-3 px-4">EMAIL</th>
                  <th className="py-3 px-4">FATHER NAME</th>
                  <th className="py-3 px-4">CLASS & PREV SCHOOL</th>
                  <th className="py-3 px-4">FEEDBACK</th>
                  <th className="py-3 px-4 text-center">STATUS</th>
                  <th className="py-3 px-4 text-right print:hidden">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredList.map((a, idx) => (
                  <tr key={a.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-center font-medium text-slate-500">{idx + 1}</td>
                    <td className="py-3 px-4">
                      <img
                        src={a.photo}
                        alt={a.firstName}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-xs"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{a.firstName} {a.lastName}</div>
                      <div className="text-[11px] font-mono font-bold text-blue-600">{a.regNo}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">{a.contactNo}</td>
                    <td className="py-3 px-4 text-slate-600">{a.email}</td>
                    <td className="py-3 px-4 text-slate-700">{a.fatherName}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{a.className}</div>
                      <div className="text-[11px] text-slate-400">{a.prevSchool || 'Fresher'}</div>
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate text-slate-600" title={a.feedback}>
                      {a.feedback}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        a.status === 'Admitted' ? 'bg-emerald-100 text-emerald-800' :
                        a.status === 'Shortlisted' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5 print:hidden">
                      <button
                        onClick={() => setSelectedApplicant(a)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded text-[11px] font-medium transition-colors inline-flex items-center gap-1"
                      >
                        <Eye size={12} />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 1:1 PRE ADMISSION Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="font-bold text-sm uppercase tracking-wide">PRE ADMISSION</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Candidate first name"
                    value={formData.firstName}
                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Last Name</label>
                  <input
                    type="text"
                    placeholder="Surname"
                    value={formData.lastName}
                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={e => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Date Of Birth</label>
                  <input
                    type="date"
                    required
                    value={formData.dob}
                    onChange={e => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Admission Class *</label>
                  <select
                    value={formData.className}
                    onChange={e => setFormData({ ...formData, className: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Play Group">Play Group</option>
                    <option value="Nursery">Nursery</option>
                    <option value="LKG">LKG</option>
                    <option value="UKG">UKG</option>
                    <option value="Class I">Class I</option>
                    <option value="Class II">Class II</option>
                    <option value="Class VI">Class VI</option>
                    <option value="Class IX">Class IX</option>
                    <option value="Class XI">Class XI</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Contact No *</label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile"
                    value={formData.contactNo}
                    onChange={e => setFormData({ ...formData, contactNo: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="parent@example.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Father Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Father full name"
                    value={formData.fatherName}
                    onChange={e => setFormData({ ...formData, fatherName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Father's Occupation</label>
                  <input
                    type="text"
                    placeholder="Occupation / Business"
                    value={formData.fatherOccupation}
                    onChange={e => setFormData({ ...formData, fatherOccupation: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Mother Name</label>
                  <input
                    type="text"
                    placeholder="Mother full name"
                    value={formData.motherName}
                    onChange={e => setFormData({ ...formData, motherName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Mother's Occupation</label>
                  <input
                    type="text"
                    placeholder="Occupation / Homemaker"
                    value={formData.motherOccupation}
                    onChange={e => setFormData({ ...formData, motherOccupation: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Residential Address</label>
                <input
                  type="text"
                  placeholder="Complete home address"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Previous School Name (if any)</label>
                <input
                  type="text"
                  placeholder="Last attended school / Pre-school"
                  value={formData.prevSchool}
                  onChange={e => setFormData({ ...formData, prevSchool: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Counselor / Interview Feedback</label>
                <textarea
                  rows={2}
                  placeholder="Notes from initial interaction or child readiness..."
                  value={formData.feedback}
                  onChange={e => setFormData({ ...formData, feedback: e.target.value })}
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
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                >
                  Register Pre-Admission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Applicant Detail Modal */}
      {selectedApplicant && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">{selectedApplicant.firstName} {selectedApplicant.lastName}</h3>
                <span className="text-[11px] text-slate-400 font-mono">Reg No: {selectedApplicant.regNo}</span>
              </div>
              <button onClick={() => setSelectedApplicant(null)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-100">
                <div><span className="text-slate-400 block">Class Applied:</span> <strong>{selectedApplicant.className}</strong></div>
                <div><span className="text-slate-400 block">Date of Birth:</span> <strong>{selectedApplicant.dob}</strong></div>
                <div><span className="text-slate-400 block">Gender:</span> <strong>{selectedApplicant.gender}</strong></div>
                <div><span className="text-slate-400 block">Status:</span> <strong>{selectedApplicant.status}</strong></div>
              </div>
              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-100">
                <div><span className="text-slate-400 block">Father:</span> <strong>{selectedApplicant.fatherName}</strong> ({selectedApplicant.fatherOccupation})</div>
                <div><span className="text-slate-400 block">Mother:</span> <strong>{selectedApplicant.motherName}</strong> ({selectedApplicant.motherOccupation})</div>
                <div><span className="text-slate-400 block">Mobile:</span> <strong className="font-mono">{selectedApplicant.contactNo}</strong></div>
                <div><span className="text-slate-400 block">Email:</span> <strong>{selectedApplicant.email}</strong></div>
              </div>
              <div>
                <span className="text-slate-400 block">Address:</span>
                <p className="text-slate-700">{selectedApplicant.address}</p>
              </div>
              <div>
                <span className="text-slate-400 block">Counselor Feedback:</span>
                <p className="text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-200">{selectedApplicant.feedback}</p>
              </div>
            </div>
            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-end">
              <button onClick={() => setSelectedApplicant(null)} className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded text-xs font-semibold">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
