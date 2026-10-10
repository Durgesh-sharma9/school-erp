import React, { useState } from 'react';
import { Home, Plus, Search, Printer, Trash2, X, Award, CheckCircle } from 'lucide-react';

export function ManualCcBcPage({ onNavigate }) {
  const [certList, setCertList] = useState([
    {
      id: 1,
      sNo: 1,
      admNo: '1245',
      srNo: '1245',
      penNo: 'PEN-889911',
      name: 'PAYAL BUNKAR',
      className: 'CLASS XII',
      fatherName: 'RAMESH BUNKAR',
      motherName: 'GEETA BUNKAR',
      dob: '2008-05-14',
      academicYr: '2026-2027',
      issueDate: '2026-10-10',
      reportType: 'Character Certificate',
      withOption: "Father's Name",
      format: 'Standard',
      remark: 'Exemplary character and conduct'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);

  // Modal Form State (17 extracted fields)
  const [formData, setFormData] = useState({
    admNo: '',
    srNo: '',
    penNo: '',
    name: '',
    className: 'CLASS X - A',
    fatherName: '',
    motherName: '',
    dob: '',
    fromYearToYear: '2025-2026',
    academicYr: '2026-2027',
    issueDate: new Date().toISOString().split('T')[0],
    remark: 'Good character and moral behavior',
    gender: 'Male',
    reportType: 'Character Certificate',
    withOption: "Father's Name",
    format: 'Standard',
    printType: 'Original'
  });

  const filtered = certList.filter(c =>
    !searchQuery ||
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.admNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.fatherName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.admNo) {
      alert('Please fill at least Student Name and Adm No');
      return;
    }

    const newId = certList.length + 1;
    const newEntry = {
      ...formData,
      id: Date.now(),
      sNo: newId
    };

    setCertList(prev => [newEntry, ...prev]);
    setShowAddModal(false);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this certificate record?')) {
      setCertList(prev => prev.filter(c => c.id !== id));
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
            <button onClick={() => onNavigate && onNavigate('/')} className="hover:text-indigo-600">
              <Home className="w-3.5 h-3.5" />
            </button>
            <span>•</span>
            <span className="text-slate-500">Student</span>
            <span>•</span>
            <span className="text-indigo-600 font-medium">Generate Manual Certificate</span>
          </div>
        </div>

        {/* Purple Mini FAB */}
        <button
          onClick={() => setShowAddModal(true)}
          className="w-9 h-9 rounded-full bg-[#5c67f6] hover:bg-indigo-600 text-white flex items-center justify-center shadow-md hover:shadow-lg transition-transform hover:scale-105"
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
                  <th className="py-3 px-4">ISSUE DATE</th>
                  <th className="py-3 px-4 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((r, i) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-slate-500">{i + 1}</td>
                    <td className="py-3 px-4 font-semibold text-indigo-600">{r.admNo}</td>
                    <td className="py-3 px-4 text-slate-600">{r.srNo}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{r.name}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium">
                        {r.className}
                      </span>
                    </td>
                    <td className="py-3 px-4">{r.fatherName}</td>
                    <td className="py-3 px-4 text-slate-600">{r.issueDate}</td>
                    <td className="py-3 px-4 text-center space-x-2">
                      <button
                        onClick={() => handlePrint(r)}
                        className="p-1 rounded text-indigo-600 hover:bg-indigo-50"
                        title="Print Certificate"
                      >
                        <Printer className="w-4 h-4 inline" />
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="p-1 rounded text-rose-500 hover:bg-rose-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* GENERATE CERTIFICATE MODAL (17 exact extracted fields) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-base font-bold text-slate-900 tracking-wide uppercase border-b pb-3 mb-4">
              GENERATE CERTIFICATE
            </h2>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Adm No*</label>
                  <input
                    type="text"
                    name="admNo"
                    value={formData.admNo}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Sr No</label>
                  <input
                    type="text"
                    name="srNo"
                    value={formData.srNo}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Pen No</label>
                  <input
                    type="text"
                    name="penNo"
                    value={formData.penNo}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Student Name*</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Class & Division</label>
                  <input
                    type="text"
                    name="className"
                    value={formData.className}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Father's Name</label>
                  <input
                    type="text"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Mother's Name</label>
                  <input
                    type="text"
                    name="motherName"
                    value={formData.motherName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">DOB</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">From Year to Year</label>
                  <input
                    type="text"
                    name="fromYearToYear"
                    value={formData.fromYearToYear}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Academic Yr</label>
                  <input
                    type="text"
                    name="academicYr"
                    value={formData.academicYr}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Issue Date</label>
                  <input
                    type="date"
                    name="issueDate"
                    value={formData.issueDate}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Report Type</label>
                  <select
                    name="reportType"
                    value={formData.reportType}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                  >
                    <option value="Bonafide Certificate">Bonafide Certificate</option>
                    <option value="Character Certificate">Character Certificate</option>
                    <option value="Tution Fee Report">Tution Fee Report</option>
                    <option value="Participation Certificate">Participation Certificate</option>
                    <option value="Study Certificate">Study Certificate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">With</label>
                  <select
                    name="withOption"
                    value={formData.withOption}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Father's Name">Father's Name</option>
                    <option value="Mother's Name">Mother's Name</option>
                    <option value="Both">Both</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Format</label>
                  <select
                    name="format"
                    value={formData.format}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Detailed">Detailed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Print Type</label>
                  <select
                    name="printType"
                    value={formData.printType}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Original">Original</option>
                    <option value="Duplicate">Duplicate</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Remark</label>
                <input
                  type="text"
                  name="remark"
                  value={formData.remark}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end pt-4 border-t space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#5c67f6] hover:bg-indigo-600 text-white font-semibold rounded-lg shadow-xs"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Certificate Modal */}
      {showPrintModal && selectedCert && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowPrintModal(false)}
              className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-4 border-double border-slate-900 p-8 rounded-lg bg-amber-50/10 space-y-4">
              <div className="text-center border-b-2 border-slate-900 pb-3">
                <h2 className="text-2xl font-black text-slate-950 uppercase">J D INTERNATIONAL SCHOOL</h2>
                <p className="text-xs text-slate-600">Affiliated to CBSE, New Delhi • Affiliation No: 1730000</p>
                <div className="inline-block mt-3 px-5 py-1 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-md">
                  {selectedCert.reportType}
                </div>
              </div>

              <div className="text-xs leading-relaxed text-slate-800 space-y-3 py-4 text-justify">
                <p>
                  This is to certify that <strong className="text-slate-950 underline">{selectedCert.name}</strong>,
                  son/daughter of Mr. <strong className="text-slate-950">{selectedCert.fatherName}</strong>,
                  bearing Admission No. <strong className="text-slate-950">{selectedCert.admNo}</strong>,
                  has been a student of Class <strong className="text-slate-950">{selectedCert.className}</strong> of this institution.
                </p>
                <p>
                  His/her character and conduct have been <strong className="font-bold">SATISFACTORY & GOOD</strong>. {selectedCert.remark}.
                </p>
              </div>

              <div className="pt-8 flex justify-between items-end text-xs text-slate-700 font-semibold">
                <div>Date: {selectedCert.issueDate}</div>
                <div className="text-center border-t border-slate-700 pt-1 w-32">Principal Signature</div>
              </div>
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-lg bg-[#5c67f6] hover:bg-indigo-600 text-white text-xs font-semibold shadow-xs"
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
