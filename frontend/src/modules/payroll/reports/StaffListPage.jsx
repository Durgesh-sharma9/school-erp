import React, { useState } from 'react';
import {
  Users,
  Search,
  Home,
  Printer,
  FileDown,
  Filter,
  UserCheck,
  UserX,
  Briefcase,
  GraduationCap,
  Eye,
  X,
  Phone,
  Mail,
  Calendar,
  MapPin
} from 'lucide-react';

const INITIAL_STAFF_LIST = [
  {
    id: '1',
    code: '101',
    name: 'ABHILASHA BHATT',
    fatherName: 'R. K. Bhatt',
    gender: 'Female',
    desig: 'Principal',
    dept: 'ADMINISTRATIVE & MANAGEMENT',
    mobile: '9829012345',
    email: 'abhilasha.bhatt@jdinternationalschool.com',
    doj: '2020-04-01',
    qualification: 'M.Sc., M.Ed., Ph.D',
    experience: '16 Years',
    address: 'Plot 45, Vidhyadhar Nagar, Jaipur, Rajasthan',
    status: 'Active',
    emergencyContact: '9829098765',
    bloodGroup: 'B+',
    bankName: 'State Bank of India',
    accountNo: '34892019482',
    ifsc: 'SBIN0001234'
  },
  {
    id: '2',
    code: '102',
    name: 'PRITI VERMA',
    fatherName: 'S. N. Sharma',
    gender: 'Female',
    desig: 'Administrator',
    dept: 'ADMINISTRATIVE & MANAGEMENT',
    mobile: '9414023456',
    email: 'priti.verma@jdinternationalschool.com',
    doj: '2021-07-15',
    qualification: 'MBA, B.Com',
    experience: '8 Years',
    address: 'B-12, Vaishali Nagar, Jaipur, Rajasthan',
    status: 'Active',
    emergencyContact: '9414098765',
    bloodGroup: 'O+',
    bankName: 'HDFC Bank',
    accountNo: '501002394821',
    ifsc: 'HDFC0000456'
  },
  {
    id: '3',
    code: '201',
    name: 'MONIKA RANI VERMA',
    fatherName: 'Mahesh Verma',
    gender: 'Female',
    desig: 'Teacher',
    dept: 'TEACHING',
    mobile: '9783034567',
    email: 'monika.verma@jdinternationalschool.com',
    doj: '2022-06-10',
    qualification: 'M.A. (English), B.Ed',
    experience: '6 Years',
    address: '14, Mansarovar Sector 3, Jaipur, Rajasthan',
    status: 'Active',
    emergencyContact: '9783098765',
    bloodGroup: 'A+',
    bankName: 'ICICI Bank',
    accountNo: '10293847562',
    ifsc: 'ICIC0000789'
  },
  {
    id: '4',
    code: '202',
    name: 'SUNITA KUMARI',
    fatherName: 'Rameshwar Lal',
    gender: 'Female',
    desig: 'Teacher',
    dept: 'TEACHING',
    mobile: '9672045678',
    email: 'sunita.k@jdinternationalschool.com',
    doj: '2022-08-01',
    qualification: 'M.Sc. (Maths), B.Ed',
    experience: '5 Years',
    address: 'H-302, Malviya Nagar, Jaipur, Rajasthan',
    status: 'Active',
    emergencyContact: '9672098765',
    bloodGroup: 'AB+',
    bankName: 'Bank of Baroda',
    accountNo: '09876543210',
    ifsc: 'BARB0MALVIY'
  },
  {
    id: '5',
    code: '501',
    name: 'BHARAT JANGID',
    fatherName: 'Gopal Lal Jangid',
    gender: 'Male',
    desig: 'Driver',
    dept: 'TRANSPORT',
    mobile: '9587056789',
    email: 'bharat.driver@jdinternationalschool.com',
    doj: '2023-01-10',
    qualification: '10th Pass (Commercial DL)',
    experience: '10 Years',
    address: 'Vill. Bindayaka, Sirsi Road, Jaipur',
    status: 'Active',
    emergencyContact: '9587098765',
    bloodGroup: 'O+',
    bankName: 'Punjab National Bank',
    accountNo: '29384756102',
    ifsc: 'PUNB0123400'
  },
  {
    id: '6',
    code: '502',
    name: 'HANSRAJ JAT',
    fatherName: 'Ramkishan Jat',
    gender: 'Male',
    desig: 'Driver',
    dept: 'TRANSPORT',
    mobile: '9460067890',
    email: 'hansraj.jat@jdinternationalschool.com',
    doj: '2023-03-01',
    qualification: '8th Pass (Heavy Commercial DL)',
    experience: '12 Years',
    address: 'Near Bus Stand, Bassi, Jaipur',
    status: 'Active',
    emergencyContact: '9460098765',
    bloodGroup: 'B+',
    bankName: 'State Bank of India',
    accountNo: '49382019472',
    ifsc: 'SBIN0005678'
  },
  {
    id: '7',
    code: '301',
    name: 'RAJENDRA SINGH',
    fatherName: 'Kailash Singh',
    gender: 'Male',
    desig: 'Security Supervisor',
    dept: 'SECURITY & MAINTENANCE',
    mobile: '9828078901',
    email: 'rajendra.security@jdinternationalschool.com',
    doj: '2021-11-01',
    qualification: 'Ex-Serviceman / 12th',
    experience: '15 Years',
    address: 'Plot 78, Khatipura, Jaipur',
    status: 'Inactive',
    emergencyContact: '9828098765',
    bloodGroup: 'A+',
    bankName: 'State Bank of India',
    accountNo: '10293847501',
    ifsc: 'SBIN0001234'
  }
];

export function StaffListPage({ onNavigate, fromModule = 'payroll' }) {
  const [staffList, setStaffList] = useState(INITIAL_STAFF_LIST);
  const [reportType, setReportType] = useState('Standard');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedDesig, setSelectedDesig] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('Active');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStaff, setSelectedStaff] = useState(null);

  const departments = ['All', ...new Set(staffList.map(s => s.dept))];
  const designations = ['All', ...new Set(staffList.map(s => s.desig))];

  const filteredStaff = staffList.filter(s => {
    const matchesDept = selectedDept === 'All' || s.dept === selectedDept;
    const matchesDesig = selectedDesig === 'All' || s.desig === selectedDesig;
    const matchesStatus = selectedStatus === 'All' || s.status === selectedStatus;
    const matchesQuery =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.mobile.includes(searchQuery) ||
      s.qualification.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesDesig && matchesStatus && matchesQuery;
  });

  const totalStaffCount = staffList.length;
  const activeCount = staffList.filter(s => s.status === 'Active').length;
  const inactiveCount = staffList.filter(s => s.status === 'Inactive').length;
  const teachingCount = staffList.filter(s => s.dept === 'TEACHING').length;
  const nonTeachingCount = totalStaffCount - teachingCount;

  const exportCSV = () => {
    const headers = [
      'S.No', 'Emp Code', 'Staff Name', 'Gender', 'Designation', 'Department',
      'Mobile No', 'Email', 'Date of Joining', 'Qualification', 'Experience',
      'Address', 'Blood Group', 'Bank Name', 'Account No', 'IFSC', 'Status'
    ];
    const rows = filteredStaff.map((s, i) => [
      i + 1,
      `"${s.code}"`,
      `"${s.name}"`,
      `"${s.gender}"`,
      `"${s.desig}"`,
      `"${s.dept}"`,
      `"${s.mobile}"`,
      `"${s.email}"`,
      `"${s.doj}"`,
      `"${s.qualification}"`,
      `"${s.experience}"`,
      `"${s.address}"`,
      `"${s.bloodGroup}"`,
      `"${s.bankName}"`,
      `"${s.accountNo}"`,
      `"${s.ifsc}"`,
      `"${s.status}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Staff_List_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1:1 Secondary Top Header Toolbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20 print:hidden">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-bold text-slate-800 pr-3 border-r border-slate-300">
            Staff List Report
          </h1>
          <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
            <button
              onClick={() => onNavigate && onNavigate('/')}
              className="hover:text-blue-600 flex items-center gap-1 transition-colors"
            >
              <Home size={13} />
              <span>Home</span>
            </button>
            <span>/</span>
            {fromModule === 'users' ? (
              <>
                <button
                  onClick={() => onNavigate && onNavigate('/users')}
                  className="hover:text-blue-600 transition-colors"
                >
                  User Management
                </button>
                <span>/</span>
                <span className="text-slate-700 font-semibold">Staff List Report</span>
              </>
            ) : (
              <>
                <button
                  onClick={() => onNavigate && onNavigate('/payroll-reports')}
                  className="hover:text-blue-600 transition-colors"
                >
                  Payroll Reports
                </button>
                <span>/</span>
                <span className="text-slate-700 font-semibold">Staff List</span>
              </>
            )}
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
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 print:hidden">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Users size={20} />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">Total Staff</div>
              <div className="text-lg font-bold text-slate-800">{totalStaffCount}</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <UserCheck size={20} />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">Active Staff</div>
              <div className="text-lg font-bold text-emerald-600">{activeCount}</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <UserX size={20} />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">Inactive</div>
              <div className="text-lg font-bold text-rose-600">{inactiveCount}</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <GraduationCap size={20} />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">Teaching Staff</div>
              <div className="text-lg font-bold text-purple-600">{teachingCount}</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Briefcase size={20} />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">Non-Teaching</div>
              <div className="text-lg font-bold text-amber-600">{nonTeachingCount}</div>
            </div>
          </div>
        </div>

        {/* Filters Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm print:hidden">
          <div className="flex items-center space-x-2 text-slate-700 font-bold text-sm mb-4 border-b pb-2">
            <Filter size={16} className="text-blue-600" />
            <span>Search & Filter Staff Directory</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Report Format</label>
              <select
                value={reportType}
                onChange={e => setReportType(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="Standard">Standard List</option>
                <option value="BioData">Bio-Data & Details</option>
                <option value="Banking">Bank Account Details</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Department</label>
              <select
                value={selectedDept}
                onChange={e => setSelectedDept(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {departments.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Designation</label>
              <select
                value={selectedDesig}
                onChange={e => setSelectedDesig(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {designations.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Staff Status</label>
              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active Only</option>
                <option value="Inactive">Inactive Only</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Quick Search</label>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Name, ID, Mobile..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Printable Letterhead */}
        <div className="hidden print:block text-center border-b pb-4 mb-4">
          <h2 className="text-xl font-bold uppercase tracking-wider text-slate-900">J D International School</h2>
          <p className="text-xs text-slate-500">Near City Palace, Jaipur, Rajasthan - 302002 | Affiliated to CBSE</p>
          <h3 className="text-sm font-semibold mt-2 underline">STAFF ROSTER & MASTER DIRECTORY REPORT</h3>
          <p className="text-xs text-slate-400">Generated on: {new Date().toLocaleString()} | Filter: {selectedDept} / {selectedStatus}</p>
        </div>

        {/* Staff Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">
              Showing {filteredStaff.length} Staff Member{filteredStaff.length === 1 ? '' : 's'}
            </span>
            <span className="text-xs text-slate-400">
              Sorted by Employee Code
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/75 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4 w-12 text-center">S.No</th>
                  <th className="py-3 px-4">Emp Code</th>
                  <th className="py-3 px-4">Staff Member</th>
                  <th className="py-3 px-4">Designation</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">DOJ</th>
                  {reportType === 'Banking' ? (
                    <>
                      <th className="py-3 px-4">Bank Name</th>
                      <th className="py-3 px-4">Account Number</th>
                      <th className="py-3 px-4">IFSC Code</th>
                    </>
                  ) : (
                    <>
                      <th className="py-3 px-4">Qualification</th>
                      <th className="py-3 px-4">Experience</th>
                    </>
                  )}
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right print:hidden">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStaff.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="py-8 text-center text-slate-400">
                      No staff members match the selected criteria.
                    </td>
                  </tr>
                ) : (
                  filteredStaff.map((staff, index) => (
                    <tr key={staff.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 text-center text-slate-500 font-medium">{index + 1}</td>
                      <td className="py-3 px-4 font-mono font-bold text-blue-700">{staff.code}</td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{staff.name}</div>
                        <div className="text-[11px] text-slate-400">S/D/W of: {staff.fatherName}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium">{staff.desig}</td>
                      <td className="py-3 px-4 text-slate-600">{staff.dept}</td>
                      <td className="py-3 px-4 text-slate-600">
                        <div>{staff.mobile}</div>
                        <div className="text-[11px] text-slate-400">{staff.email}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-mono whitespace-nowrap">{staff.doj}</td>
                      {reportType === 'Banking' ? (
                        <>
                          <td className="py-3 px-4 font-medium text-slate-700">{staff.bankName}</td>
                          <td className="py-3 px-4 font-mono text-slate-600">{staff.accountNo}</td>
                          <td className="py-3 px-4 font-mono text-slate-600">{staff.ifsc}</td>
                        </>
                      ) : (
                        <>
                          <td className="py-3 px-4 text-slate-600">{staff.qualification}</td>
                          <td className="py-3 px-4 text-slate-600">{staff.experience}</td>
                        </>
                      )}
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          staff.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {staff.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right print:hidden">
                        <button
                          onClick={() => setSelectedStaff(staff)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 rounded text-[11px] font-medium border border-slate-200 transition-colors inline-flex items-center gap-1"
                          title="View Profile"
                        >
                          <Eye size={12} />
                          <span>View</span>
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

      {/* Staff Profile Modal */}
      {selectedStaff && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">{selectedStaff.name}</h3>
                <p className="text-xs text-slate-300 font-mono">Employee Code: {selectedStaff.code}</p>
              </div>
              <button
                onClick={() => setSelectedStaff(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-slate-400 block mb-0.5">Designation:</span>
                  <span className="font-semibold text-slate-800">{selectedStaff.desig}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Department:</span>
                  <span className="font-semibold text-slate-800">{selectedStaff.dept}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Date of Joining:</span>
                  <span className="font-semibold text-slate-800 font-mono">{selectedStaff.doj}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Blood Group:</span>
                  <span className="font-semibold text-rose-600">{selectedStaff.bloodGroup}</span>
                </div>
              </div>

              <div className="space-y-2 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone size={14} className="text-blue-500" />
                  <span>{selectedStaff.mobile}</span>
                  <span className="text-slate-400">(Emergency: {selectedStaff.emergencyContact})</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail size={14} className="text-amber-500" />
                  <span>{selectedStaff.email}</span>
                </div>
                <div className="flex items-start gap-2 text-slate-600">
                  <MapPin size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                  <span>{selectedStaff.address}</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="font-bold text-slate-700 mb-2">Banking & Compensation Details</div>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div>
                    <span className="text-slate-400 block">Bank Name</span>
                    <span className="font-medium text-slate-800">{selectedStaff.bankName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Account No</span>
                    <span className="font-mono text-slate-800">{selectedStaff.accountNo}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">IFSC Code</span>
                    <span className="font-mono text-slate-800">{selectedStaff.ifsc}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Staff Status</span>
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                      selectedStaff.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {selectedStaff.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedStaff(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded text-xs font-semibold"
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
