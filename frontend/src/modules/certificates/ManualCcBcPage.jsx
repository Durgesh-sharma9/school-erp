import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import {
  Home,
  Plus,
  Search,
  Printer,
  Trash2,
  X,
  Calendar,
  Paperclip,
  FileText,
  Download,
  CheckCircle,
  Eye,
  ChevronDown
} from 'lucide-react';
import { tenantStore } from '../../services/tenantStore';

export function ManualCcBcPage({ onNavigate }) {
  const INITIAL_CERTS = [
    {
      id: 1,
      sNo: 1,
      admNo: '1245',
      srNo: '1245',
      penNo: 'PEN-889911',
      name: 'PAYAL BUNKAR',
      className: 'CLASS XII - A',
      fatherName: 'RAMESH BUNKAR',
      motherName: 'GEETA BUNKAR',
      dob: '2008-05-14',
      fromYearToYear: '2025-2026',
      academicYr: '2026-2027',
      issueDate: '2026-10-10',
      gender: 'Female',
      reportType: 'Character Certificate',
      withOption: "Father's Name",
      format: 'Standard',
      printType: 'Original',
      remark: 'Exemplary character and conduct',
      attachedFile: {
        name: 'payal_transfer_application.pdf',
        size: '142 KB',
        type: 'application/pdf',
        dataUrl: null
      }
    }
  ];

  const [certList, setCertList] = useState(() => {
    try {
      const saved = localStorage.getItem('erp_manual_cc_bc_certs');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_CERTS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);
  const [viewingAttachment, setViewingAttachment] = useState(null);
  const fileInputRef = useRef(null);

  // Live School Profile
  const [schoolProfile, setSchoolProfile] = useState(() => {
    try {
      const active = tenantStore?.getActiveSchool ? tenantStore.getActiveSchool() : null;
      return (tenantStore?.getSchoolProfile ? tenantStore.getSchoolProfile(active?.id || 'sch_jd_intl') : null) || {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      const active = tenantStore?.getActiveSchool ? tenantStore.getActiveSchool() : null;
      const local = tenantStore?.getSchoolProfile ? tenantStore.getSchoolProfile(active?.id || 'sch_jd_intl') : null;
      if (local && Object.keys(local).length > 0) setSchoolProfile(local);
    } catch {}

    fetch('/api/schools/profile')
      .then(res => res.json())
      .then(d => {
        if (d.success && d.data) {
          setSchoolProfile(prev => ({
            ...prev,
            ...d.data,
            schoolName: d.data.schoolName || prev.schoolName || 'J D INTERNATIONAL SCHOOL',
            affiliationNo: d.data.affiliationNo || prev.affiliationNo || '1730619',
            schoolCode: d.data.schoolCode || prev.schoolCode || '20000',
            place: d.data.place || prev.place || 'Jaipur',
            address: d.data.address || prev.address || 'Mahapura, Ajmer Road, Jaipur',
            brandingImages: {
              ...(prev.brandingImages || {}),
              ...(d.data.brandingImages || {})
            }
          }));
        }
      })
      .catch(() => {});
  }, []);

  // Save to localStorage whenever certList updates
  useEffect(() => {
    try {
      localStorage.setItem('erp_manual_cc_bc_certs', JSON.stringify(certList));
    } catch (e) {}
  }, [certList]);

  // Modal Form State (Exact parity with Image 2)
  const initialFormState = {
    admNo: '',
    srNo: '',
    penNo: '',
    name: '',
    className: '',
    fatherName: '',
    motherName: '',
    dob: '',
    fromYearToYear: '',
    academicYr: '2026-2027',
    issueDate: new Date().toISOString().split('T')[0],
    remark: '',
    gender: 'Male',
    reportType: 'Character Certificate',
    withOption: "Father's Name",
    format: 'Standard',
    printType: 'Original',
    attachedFile: null
  };

  const [formData, setFormData] = useState(initialFormState);

  const filtered = certList.filter(c =>
    !searchQuery ||
    (c.name && c.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (c.admNo && c.admNo.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (c.fatherName && c.fatherName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (c.className && c.className.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // File Upload Handler (Data URL capture for instant preview / persistence)
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      toast.error('File size exceeds 15MB limit');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({
        ...prev,
        attachedFile: {
          name: file.name,
          size: file.size > 1024 * 1024
            ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
            : `${(file.size / 1024).toFixed(1)} KB`,
          type: file.type,
          dataUrl: reader.result
        }
      }));
      toast.success(`Attached: ${file.name}`);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setFormData(prev => ({ ...prev, attachedFile: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleOpenAddModal = () => {
    setFormData({
      ...initialFormState,
      issueDate: new Date().toISOString().split('T')[0]
    });
    setShowAddModal(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.admNo.trim()) {
      toast.error('Please fill at least Student Name and Admission No');
      return;
    }

    const newId = certList.length + 1;
    const newEntry = {
      ...formData,
      id: Date.now(),
      sNo: newId,
      name: formData.name.toUpperCase().trim(),
      fatherName: formData.fatherName ? formData.fatherName.toUpperCase().trim() : '',
      motherName: formData.motherName ? formData.motherName.toUpperCase().trim() : '',
      className: formData.className ? formData.className.toUpperCase().trim() : 'CLASS X - A'
    };

    setCertList(prev => [newEntry, ...prev]);
    toast.success(`Certificate created for ${newEntry.name}${newEntry.attachedFile ? ' with attachment' : ''}!`);
    setShowAddModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this certificate record?')) {
      setCertList(prev => prev.filter(c => c.id !== id));
      toast.success('Certificate record removed');
    }
  };

  const handlePrint = (cert) => {
    setSelectedCert(cert);
    setShowPrintModal(true);
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      {/* Top Toolbar */}
      <div className="bg-white border-b border-slate-200/80 px-4 md:px-8 py-3 flex items-center justify-between shadow-xs sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <h1 className="text-base md:text-lg font-semibold text-slate-800">
            Generate Manual Certificate
          </h1>
          <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400 pl-3 border-l border-slate-200">
            <button onClick={() => onNavigate && onNavigate('/')} className="hover:text-indigo-600 cursor-pointer">
              <Home className="w-3.5 h-3.5" />
            </button>
            <span>•</span>
            <span className="text-slate-500">Certificates</span>
            <span>•</span>
            <span className="text-indigo-600 font-medium">Manual CC/BC/TF</span>
          </div>
        </div>

        {/* Purple Mini FAB */}
        <button
          onClick={handleOpenAddModal}
          className="w-9 h-9 rounded-full bg-[#5c67f6] hover:bg-indigo-600 text-white flex items-center justify-center shadow-md hover:shadow-lg transition-transform hover:scale-105 cursor-pointer"
          title="Add Manual Certificate"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4">
        {/* Results Table */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 overflow-hidden">
          <div className="p-4 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-medium text-slate-600">
              Generated Certificates: <strong className="text-slate-900">{filtered.length}</strong>
            </span>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">S.NO.</th>
                  <th className="py-3 px-4">ADM.NO.</th>
                  <th className="py-3 px-4">SR.NO.</th>
                  <th className="py-3 px-4">NAME</th>
                  <th className="py-3 px-4">CLASS</th>
                  <th className="py-3 px-4">FATHER'S NAME</th>
                  <th className="py-3 px-4">CERTIFICATE TYPE</th>
                  <th className="py-3 px-4">ATTACHMENT</th>
                  <th className="py-3 px-4">ISSUE DATE</th>
                  <th className="py-3 px-4 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-8 text-center text-slate-400">
                      No certificate records found. Click the + button above to generate one.
                    </td>
                  </tr>
                ) : (
                  filtered.map((r, i) => (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 text-slate-500">{i + 1}</td>
                      <td className="py-3 px-4 font-semibold text-indigo-600">{r.admNo}</td>
                      <td className="py-3 px-4 text-slate-600">{r.srNo || '-'}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900">{r.name}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium">
                          {r.className || '-'}
                        </span>
                      </td>
                      <td className="py-3 px-4">{r.fatherName || '-'}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-medium">
                          {r.reportType}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {r.attachedFile ? (
                          <button
                            type="button"
                            onClick={() => setViewingAttachment(r.attachedFile)}
                            className="inline-flex items-center gap-1.5 px-2 py-1 bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 rounded-md text-[11px] font-medium transition-colors cursor-pointer"
                            title="Click to view attachment"
                          >
                            <Paperclip className="w-3.5 h-3.5" />
                            <span className="max-w-[110px] truncate">{r.attachedFile.name}</span>
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[11px] italic">No file</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-600">{r.issueDate}</td>
                      <td className="py-3 px-4 text-center space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => handlePrint(r)}
                          className="p-1 rounded text-indigo-600 hover:bg-indigo-50 cursor-pointer"
                          title="Print Certificate"
                        >
                          <Printer className="w-4 h-4 inline" />
                        </button>
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="p-1 rounded text-rose-500 hover:bg-rose-50 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-3 bg-slate-50/50 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center space-x-2">
              <span>Items per page:</span>
              <select className="border border-slate-300 rounded px-2 py-0.5 bg-white text-xs text-slate-700">
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
            <div>
              1 - {filtered.length} of {filtered.length}
            </div>
          </div>
        </div>
      </div>

      {/* GENERATE CERTIFICATE MODAL (Exact 1:1 Parity with Provided Reference Screenshot) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm sm:text-base font-bold text-slate-800 tracking-wider uppercase">
                GENERATE CERTIFICATE
              </h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              {/* Row 1: Adm No | Sr No | Pen No */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <input
                    type="text"
                    name="admNo"
                    placeholder="Adm No"
                    value={formData.admNo}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="srNo"
                    placeholder="Sr No"
                    value={formData.srNo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="penNo"
                    placeholder="Pen No"
                    value={formData.penNo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  />
                </div>
              </div>

              {/* Row 2: Student Name | Class & Division | Father's Name */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Student Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="className"
                    placeholder="Class & Division"
                    value={formData.className}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="fatherName"
                    placeholder="Father's Name"
                    value={formData.fatherName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  />
                </div>
              </div>

              {/* Row 3: Mother's Name | DOB | From Year to Year */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <input
                    type="text"
                    name="motherName"
                    placeholder="Mother's Name"
                    value={formData.motherName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  />
                </div>
                <div className="relative">
                  <input
                    type={formData.dob ? 'date' : 'text'}
                    name="dob"
                    placeholder="DOB"
                    value={formData.dob}
                    onFocus={(e) => (e.target.type = 'date')}
                    onBlur={(e) => {
                      if (!formData.dob) e.target.type = 'text';
                    }}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 pr-10 border border-slate-300 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors cursor-pointer"
                  />
                  <Calendar className="w-4 h-4 text-indigo-600 absolute right-3 top-3 pointer-events-none" />
                </div>
                <div>
                  <input
                    type="text"
                    name="fromYearToYear"
                    placeholder="From Year to Year"
                    value={formData.fromYearToYear}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  />
                </div>
              </div>

              {/* Row 4: Academic Yr | Issue Date | Remark */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <input
                    type="text"
                    name="academicYr"
                    placeholder="Academic Yr"
                    value={formData.academicYr}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  />
                </div>
                <div className="relative">
                  <input
                    type={formData.issueDate ? 'date' : 'text'}
                    name="issueDate"
                    placeholder="Issue Date"
                    value={formData.issueDate}
                    onFocus={(e) => (e.target.type = 'date')}
                    onBlur={(e) => {
                      if (!formData.issueDate) e.target.type = 'text';
                    }}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 pr-10 border border-slate-300 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors cursor-pointer"
                  />
                  <Calendar className="w-4 h-4 text-indigo-600 absolute right-3 top-3 pointer-events-none" />
                </div>
                <div>
                  <input
                    type="text"
                    name="remark"
                    placeholder="Remark"
                    value={formData.remark}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  />
                </div>
              </div>

              {/* Row 5: Gender | Select A File (Exact Layout from Reference Image) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <div className="relative">
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-xs text-slate-700 bg-white appearance-none focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors cursor-pointer"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>

                {/* File Upload Section */}
                <div className="md:col-span-2">
                  <label className="block text-[11px] text-slate-500 mb-1">
                    Select A File
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx"
                      className="block w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border file:border-slate-300 file:text-xs file:font-medium file:bg-slate-100 hover:file:bg-slate-200 file:text-slate-700 file:cursor-pointer cursor-pointer"
                    />
                    {formData.attachedFile && (
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors cursor-pointer shrink-0"
                        title="Remove attached file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {formData.attachedFile && (
                    <div className="mt-1 text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate max-w-sm">
                        Selected: {formData.attachedFile.name} ({formData.attachedFile.size})
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Row 6: Report Type | With | Format* | Print Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-1">
                <div className="relative">
                  <select
                    name="reportType"
                    value={formData.reportType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-xs text-slate-700 bg-white appearance-none focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors cursor-pointer"
                  >
                    <option value="Character Certificate">Character Certificate</option>
                    <option value="Bonafide Certificate">Bonafide Certificate</option>
                    <option value="Tution Fee Report">Tution Fee Report</option>
                    <option value="Participation Certificate">Participation Certificate</option>
                    <option value="Study Certificate">Study Certificate</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-3 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    name="withOption"
                    value={formData.withOption}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-xs text-slate-700 bg-white appearance-none focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors cursor-pointer"
                  >
                    <option value="Father's Name">Father's Name</option>
                    <option value="Mother's Name">Mother's Name</option>
                    <option value="Both">Both</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-3 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    name="format"
                    value={formData.format}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-xs text-slate-700 bg-white appearance-none focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors cursor-pointer"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Detailed">Detailed</option>
                    <option value="Format 1">Format 1</option>
                    <option value="Format 2">Format 2</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-3 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    name="printType"
                    value={formData.printType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-xs text-slate-700 bg-white appearance-none focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors cursor-pointer"
                  >
                    <option value="Original">Original</option>
                    <option value="Duplicate">Duplicate</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Action Button: Add (Right Aligned, Matching Reference Image) */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="px-8 py-2.5 bg-[#4f46e5] hover:bg-indigo-700 text-white font-medium text-xs rounded-md shadow-xs transition-colors cursor-pointer"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Attachment Preview Modal */}
      {viewingAttachment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 truncate max-w-xs">
                    {viewingAttachment.name}
                  </h3>
                  <p className="text-[11px] text-slate-500">{viewingAttachment.size}</p>
                </div>
              </div>
              <button
                onClick={() => setViewingAttachment(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4">
              {viewingAttachment.dataUrl && viewingAttachment.dataUrl.startsWith('data:image/') ? (
                <div className="max-h-[60vh] overflow-auto rounded-lg border border-slate-200 p-2 flex justify-center bg-slate-50">
                  <img
                    src={viewingAttachment.dataUrl}
                    alt={viewingAttachment.name}
                    className="max-h-[50vh] object-contain rounded"
                  />
                </div>
              ) : (
                <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <FileText className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-700">{viewingAttachment.name}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {viewingAttachment.type || 'Document File'} • {viewingAttachment.size}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              {viewingAttachment.dataUrl && (
                <a
                  href={viewingAttachment.dataUrl}
                  download={viewingAttachment.name}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </a>
              )}
              <button
                onClick={() => setViewingAttachment(null)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Certificate Modal */}
      {showPrintModal && selectedCert && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setShowPrintModal(false)}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors shadow-2xs cursor-pointer ml-auto mb-2"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-4 border-double border-slate-900 p-8 rounded-lg bg-amber-50/10 space-y-4">
              <div className="text-center border-b-2 border-slate-900 pb-3">
                {schoolProfile?.logoUrl && (
                  <img
                    src={schoolProfile.logoUrl}
                    alt="School Logo"
                    className="w-14 h-14 mx-auto mb-2 object-contain"
                  />
                )}
                <h2 className="text-2xl font-black text-slate-950 uppercase">
                  {schoolProfile?.schoolName || 'J D INTERNATIONAL SCHOOL'}
                </h2>
                <p className="text-xs text-slate-600">
                  Affiliated to CBSE, New Delhi • Affiliation No: {schoolProfile?.affiliationNo || '1730619'} • School Code: {schoolProfile?.schoolCode || '10964'}
                </p>
                <p className="text-[11px] text-slate-500">
                  {schoolProfile?.address || 'Mahapura, Ajmer Road, Jaipur (Rajasthan)'}
                </p>
                <div className="inline-block mt-3 px-5 py-1 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-md">
                  {selectedCert.reportType}
                </div>
              </div>

              <div className="text-xs leading-relaxed text-slate-800 space-y-3 py-4 text-justify">
                <p>
                  This is to certify that <strong className="text-slate-950 underline">{selectedCert.name}</strong>,{' '}
                  {selectedCert.gender === 'Female' ? 'daughter' : 'son'} of{' '}
                  {selectedCert.withOption === "Mother's Name" ? (
                    <>Mrs. <strong className="text-slate-950">{selectedCert.motherName || 'Guardian'}</strong></>
                  ) : selectedCert.withOption === 'Both' ? (
                    <>
                      Mr. <strong className="text-slate-950">{selectedCert.fatherName || 'Father'}</strong> and Mrs.{' '}
                      <strong className="text-slate-950">{selectedCert.motherName || 'Mother'}</strong>
                    </>
                  ) : (
                    <>Mr. <strong className="text-slate-950">{selectedCert.fatherName || 'Father'}</strong></>
                  )}
                  , bearing Admission No. <strong className="text-slate-950">{selectedCert.admNo}</strong>
                  {selectedCert.srNo && <> (Sr No. <strong>{selectedCert.srNo}</strong>)</>}, has been a student of{' '}
                  <strong className="text-slate-950">{selectedCert.className || 'this institution'}</strong> for the academic year{' '}
                  <strong className="text-slate-950">{selectedCert.academicYr}</strong>.
                </p>
                <p>
                  His/her character and conduct have been <strong className="font-bold">SATISFACTORY & GOOD</strong>.{' '}
                  {selectedCert.remark ? selectedCert.remark + '.' : ''}
                </p>

                {selectedCert.attachedFile && (
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-600 flex items-center gap-2">
                    <Paperclip className="w-3.5 h-3.5 text-indigo-600" />
                    <span>
                      Supporting Document Attached: <strong>{selectedCert.attachedFile.name}</strong> ({selectedCert.attachedFile.size})
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-8 flex justify-between items-end text-xs text-slate-700 font-semibold">
                <div>
                  Date: {selectedCert.issueDate}
                  <div className="text-[10px] text-slate-400 font-normal">Print Type: {selectedCert.printType}</div>
                </div>

                {schoolProfile?.brandingImages?.school_stamp && (
                  <div className="text-center">
                    <img
                      src={schoolProfile.brandingImages.school_stamp}
                      alt="Official Stamp"
                      className="w-16 h-16 object-contain mx-auto opacity-80"
                    />
                    <div className="text-[10px] text-slate-400 font-normal mt-0.5">School Stamp</div>
                  </div>
                )}

                <div className="text-center w-36">
                  {schoolProfile?.brandingImages?.principal_sig ? (
                    <img
                      src={schoolProfile.brandingImages.principal_sig}
                      alt="Principal Signature"
                      className="h-9 mx-auto object-contain mb-1"
                    />
                  ) : (
                    <div className="h-9"></div>
                  )}
                  <div className="border-t border-slate-700 pt-1">Principal Signature</div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end space-x-2.5 pt-2">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-lg bg-[#5c67f6] hover:bg-indigo-600 text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                Print
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
