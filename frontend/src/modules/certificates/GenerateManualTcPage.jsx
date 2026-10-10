import React, { useState, useEffect } from 'react';
import { Home, Plus, Search, Printer, Trash2, X, FileText, CheckCircle } from 'lucide-react';

export function GenerateManualTcPage({ onNavigate }) {
  const [tcList, setTcList] = useState([
    {
      id: 1,
      sNo: 1,
      srNo: '1120',
      admNo: 'JD-2021-120',
      enrollNo: 'ENR-2021-120',
      penNo: 'PEN-994422',
      studentRegNo: 'REG-2021-120',
      name: 'HARSH VARDHAN',
      className: 'VIII',
      fatherName: 'SURENDRA KUMAR',
      motherName: 'ANITA DEVI',
      nationality: 'Indian',
      category: 'OBC',
      dob: '2012-07-22',
      admDate: '2021-04-05',
      failed: 'No',
      gotLastExamResult: 'Promoted to VIII',
      promotion: 'Yes',
      feesPaid: 'Yes',
      generalConduct: 'Good',
      attendance: '198',
      schoolOpenDays: '210',
      tcNo: 'TC-2026/041',
      issueDate: '2026-09-15',
      dateOfLeaving: '2026-09-10',
      reasonOfLeaving: 'Parent job transfer to Jaipur',
      subjects: 'English, Hindi, Mathematics, Science, Social Science',
      remark: 'Conduct was good'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedTc, setSelectedTc] = useState(null);

  // Form State for all 28 fields
  const [formData, setFormData] = useState({
    admNo: '',
    enrollNo: '',
    studentRegNo: '',
    penNo: '',
    name: '',
    className: 'X',
    motherName: '',
    fatherName: '',
    nationality: 'Indian',
    category: 'GEN',
    dob: '',
    admDate: '',
    failed: 'No',
    gotLastExamResult: 'Passed',
    promotion: 'Yes',
    feesPaid: 'Yes',
    lastFeePaidDate: '',
    feesConcession: 'No',
    nccScout: 'No',
    attendance: '205',
    schoolOpenDays: '220',
    generalConduct: 'Good',
    issueDate: new Date().toISOString().split('T')[0],
    dateOfLeaving: new Date().toISOString().split('T')[0],
    reasonOfLeaving: 'Parent Wish',
    subjects: 'English, Hindi, Mathematics, Science, Social Science',
    remark: 'Good character and conduct',
    printType: 'Original'
  });

  const filtered = tcList.filter(tc =>
    !searchQuery ||
    tc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tc.tcNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tc.admNo.toLowerCase().includes(searchQuery.toLowerCase())
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

    const newId = tcList.length + 1;
    const newEntry = {
      ...formData,
      id: Date.now(),
      sNo: newId,
      srNo: formData.admNo,
      tcNo: `TC-2026/${String(tcList.length + 42).padStart(3, '0')}`
    };

    setTcList(prev => [newEntry, ...prev]);
    setShowAddModal(false);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this manual TC record?')) {
      setTcList(prev => prev.filter(tc => tc.id !== id));
    }
  };

  const handlePrint = (tc) => {
    setSelectedTc(tc);
    setShowPrintModal(true);
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      {/* Top Toolbar */}
      <div className="bg-white border-b border-slate-200/80 px-4 md:px-8 py-3 flex items-center justify-between shadow-xs sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <h1 className="text-base md:text-lg font-semibold text-slate-800">
            Generate TC Manual
          </h1>
          <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400 pl-3 border-l border-slate-200">
            <button onClick={() => onNavigate && onNavigate('/')} className="hover:text-indigo-600">
              <Home className="w-3.5 h-3.5" />
            </button>
            <span>•</span>
            <span className="text-slate-500">Student</span>
            <span>•</span>
            <span className="text-indigo-600 font-medium">Generate TC Manual</span>
          </div>
        </div>

        {/* Purple Mini FAB */}
        <button
          onClick={() => setShowAddModal(true)}
          className="w-9 h-9 rounded-full bg-[#5c67f6] hover:bg-indigo-600 text-white flex items-center justify-center shadow-md hover:shadow-lg transition-transform hover:scale-105"
          title="Add Manual TC"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4">
        {/* Table Container */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 overflow-hidden">
          <div className="p-4 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-medium text-slate-600">
              Total Generated TCs: <strong className="text-slate-900">{filtered.length}</strong>
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
                  <th className="py-3 px-4">SR.NO.</th>
                  <th className="py-3 px-4">NAME</th>
                  <th className="py-3 px-4">CLASS</th>
                  <th className="py-3 px-4">FATHER'S NAME</th>
                  <th className="py-3 px-4">MOTHER'S NAME</th>
                  <th className="py-3 px-4">TC NO.</th>
                  <th className="py-3 px-4">ISSUE DATE</th>
                  <th className="py-3 px-4 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.length > 0 ? (
                  filtered.map((r, i) => (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 text-slate-500">{i + 1}</td>
                      <td className="py-3 px-4 text-slate-600">{r.srNo}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900">{r.name}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium">
                          {r.className}
                        </span>
                      </td>
                      <td className="py-3 px-4">{r.fatherName}</td>
                      <td className="py-3 px-4">{r.motherName}</td>
                      <td className="py-3 px-4 font-mono font-bold text-amber-700">{r.tcNo}</td>
                      <td className="py-3 px-4 text-slate-600">{r.issueDate}</td>
                      <td className="py-3 px-4 text-center space-x-2">
                        <button
                          onClick={() => handlePrint(r)}
                          className="p-1 rounded text-indigo-600 hover:bg-indigo-50"
                          title="Print TC"
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
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-10 text-slate-400">
                      No Record Found !
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* GENERATE MANUAL TC MODAL (1:1 with all 28 extracted fields) */}
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
              GENERATE MANUAL TC
            </h2>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Adm.No.*</label>
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
                  <label className="block text-slate-600 font-semibold mb-1">Enroll.No.</label>
                  <input
                    type="text"
                    name="enrollNo"
                    value={formData.enrollNo}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Student Registration No</label>
                  <input
                    type="text"
                    name="studentRegNo"
                    value={formData.studentRegNo}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">PEN No</label>
                  <input
                    type="text"
                    name="penNo"
                    value={formData.penNo}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
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
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Class Name</label>
                  <input
                    type="text"
                    name="className"
                    value={formData.className}
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
                  <label className="block text-slate-600 font-semibold mb-1">Father's Name</label>
                  <input
                    type="text"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Nationality</label>
                  <input
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="GEN">General</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                  </select>
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
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Adm. Date</label>
                  <input
                    type="date"
                    name="admDate"
                    value={formData.admDate}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Failed</label>
                  <select
                    name="failed"
                    value={formData.failed}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Got Last Exam Result</label>
                  <input
                    type="text"
                    name="gotLastExamResult"
                    value={formData.gotLastExamResult}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Promotion</label>
                  <select
                    name="promotion"
                    value={formData.promotion}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Fees Paid</label>
                  <select
                    name="feesPaid"
                    value={formData.feesPaid}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Last Fee Paid date</label>
                  <input
                    type="date"
                    name="lastFeePaidDate"
                    value={formData.lastFeePaidDate}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Fees Concession</label>
                  <select
                    name="feesConcession"
                    value={formData.feesConcession}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">NCC/Scout</label>
                  <input
                    type="text"
                    name="nccScout"
                    value={formData.nccScout}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Attendance</label>
                  <input
                    type="number"
                    name="attendance"
                    value={formData.attendance}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">School Open days</label>
                  <input
                    type="number"
                    name="schoolOpenDays"
                    value={formData.schoolOpenDays}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">General Conduct</label>
                  <input
                    type="text"
                    name="generalConduct"
                    value={formData.generalConduct}
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
                  <label className="block text-slate-600 font-semibold mb-1">Date of Leaving</label>
                  <input
                    type="date"
                    name="dateOfLeaving"
                    value={formData.dateOfLeaving}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Reason of Leaving</label>
                  <input
                    type="text"
                    name="reasonOfLeaving"
                    value={formData.reasonOfLeaving}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">subjects</label>
                  <input
                    type="text"
                    name="subjects"
                    value={formData.subjects}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
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
                    <option value="Triplicate">Triplicate</option>
                  </select>
                </div>
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

      {/* Printable CBSE Transfer Certificate Modal */}
      {showPrintModal && selectedTc && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowPrintModal(false)}
              className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Official TC Document Design */}
            <div className="border-4 border-double border-slate-900 p-8 rounded-lg bg-amber-50/10 space-y-4">
              <div className="text-center border-b-2 border-slate-900 pb-4">
                <h2 className="text-2xl font-black text-slate-950 uppercase">J D INTERNATIONAL SCHOOL</h2>
                <p className="text-xs text-slate-600">Affiliated to CBSE, New Delhi • Affiliation No: 1730000 • School Code: 20000</p>
                <p className="text-[11px] text-slate-500">Mansarovar, Jaipur, Rajasthan</p>
                <div className="inline-block mt-3 px-5 py-1 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-md">
                  TRANSFER CERTIFICATE
                </div>
              </div>

              <div className="flex justify-between text-xs text-slate-700 font-semibold border-b pb-2">
                <span>TC No: <strong className="text-slate-950">{selectedTc.tcNo}</strong></span>
                <span>Admission No: <strong className="text-slate-950">{selectedTc.admNo}</strong></span>
                <span>Date: <strong className="text-slate-950">{selectedTc.issueDate}</strong></span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs text-slate-800">
                <div>1. Name of Pupil: <strong className="text-slate-950 uppercase">{selectedTc.name}</strong></div>
                <div>2. Mother's Name: <strong className="text-slate-950">{selectedTc.motherName}</strong></div>
                <div>3. Father's / Guardian's Name: <strong className="text-slate-950">{selectedTc.fatherName}</strong></div>
                <div>4. Nationality: <strong>{selectedTc.nationality || 'Indian'}</strong></div>
                <div>5. Date of Birth: <strong>{selectedTc.dob || '14/05/2010'}</strong></div>
                <div>6. Class in which pupil last studied: <strong>{selectedTc.className}</strong></div>
                <div>7. School / Board Annual Exam last taken: <strong>{selectedTc.gotLastExamResult || 'Passed'}</strong></div>
                <div>8. Whether qualified for promotion: <strong>{selectedTc.promotion || 'Yes'}</strong></div>
                <div>9. Month up to which dues paid: <strong>{selectedTc.feesPaid === 'Yes' ? 'All Clear' : 'Pending'}</strong></div>
                <div>10. Total working days: <strong>{selectedTc.schoolOpenDays || '210'}</strong></div>
                <div>11. Total present days: <strong>{selectedTc.attendance || '198'}</strong></div>
                <div>12. General Conduct: <strong>{selectedTc.generalConduct || 'Good'}</strong></div>
                <div>13. Date of Application for Certificate: <strong>{selectedTc.dateOfLeaving || selectedTc.issueDate}</strong></div>
                <div>14. Reason for Leaving: <strong>{selectedTc.reasonOfLeaving || 'Parent Request'}</strong></div>
              </div>

              <div className="pt-12 flex justify-between items-end text-xs text-slate-700 font-semibold">
                <div className="text-center border-t border-slate-700 pt-1 w-32">Class Teacher</div>
                <div className="text-center border-t border-slate-700 pt-1 w-32">Checked By (Clerk)</div>
                <div className="text-center border-t border-slate-700 pt-1 w-36">Principal (With Seal)</div>
              </div>
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-lg bg-[#5c67f6] hover:bg-indigo-600 text-white text-xs font-semibold shadow-xs"
              >
                Print TC
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
