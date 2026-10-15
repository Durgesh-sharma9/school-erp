// In-memory data store for Leave Management (Student & Staff Leave Requests)

let studentLeaves = [
  {
    id: 'STU-LV-001',
    studentId: '1',
    studentName: 'AARAV SHARMA',
    className: 'I',
    section: 'A',
    rollNo: '12',
    fromDate: '2026-04-10',
    toDate: '2026-04-12',
    totalDays: 3,
    leaveType: 'Medical Leave',
    reason: 'Down with viral fever and doctor advised 3 days bed rest.',
    appliedDate: '2026-04-09',
    status: 'Approved',
    approvedBy: 'Principal',
    attachment: 'medical_certificate_aarav.pdf'
  },
  {
    id: 'STU-LV-002',
    studentId: '2',
    studentName: 'ANANYA VERMA',
    className: 'I',
    section: 'A',
    rollNo: '14',
    fromDate: '2026-04-15',
    toDate: '2026-04-16',
    totalDays: 2,
    leaveType: 'Casual Leave',
    reason: 'Attending cousin wedding ceremony in Jaipur with family.',
    appliedDate: '2026-04-13',
    status: 'Pending',
    approvedBy: '-',
    attachment: null
  },
  {
    id: 'STU-LV-003',
    studentId: '3',
    studentName: 'KABIR MEHTA',
    className: 'V',
    section: 'B',
    rollNo: '23',
    fromDate: '2026-04-18',
    toDate: '2026-04-18',
    totalDays: 1,
    leaveType: 'Personal Leave',
    reason: 'Passport biometric appointment at regional passport office.',
    appliedDate: '2026-04-16',
    status: 'Approved',
    approvedBy: 'Class Teacher',
    attachment: 'appointment_slip.pdf'
  },
  {
    id: 'STU-LV-004',
    studentId: '4',
    studentName: 'DIVYA SINGH',
    className: 'IX',
    section: 'A',
    rollNo: '08',
    fromDate: '2026-04-20',
    toDate: '2026-04-22',
    totalDays: 3,
    leaveType: 'Sports Leave',
    reason: 'Participating in State Level Under-14 Badminton Championship.',
    appliedDate: '2026-04-17',
    status: 'Approved',
    approvedBy: 'Sports Incharge',
    attachment: 'tournament_selection_letter.pdf'
  }
];

let staffLeaves = [
  {
    id: 'STF-LV-001',
    staffId: '1',
    staffName: 'VIKRAM CHOUDHARY',
    empCode: 'EMP-003',
    department: 'Teaching',
    designation: 'TGT Mathematics',
    fromDate: '2026-04-11',
    toDate: '2026-04-12',
    totalDays: 2,
    leaveType: 'Casual Leave (CL)',
    reason: 'Urgent domestic work at ancestral village.',
    appliedDate: '2026-04-09',
    status: 'Approved',
    approvedBy: 'Principal'
  },
  {
    id: 'STF-LV-002',
    staffId: '2',
    staffName: 'SUNITA VERMA',
    empCode: 'EMP-002',
    department: 'Teaching',
    designation: 'PGT English',
    fromDate: '2026-04-14',
    toDate: '2026-04-16',
    totalDays: 3,
    leaveType: 'Medical Leave (ML)',
    reason: 'Dental surgery and prescribed recovery.',
    appliedDate: '2026-04-12',
    status: 'Pending',
    approvedBy: '-'
  },
  {
    id: 'STF-LV-003',
    staffId: '3',
    staffName: 'ANIL GUPTA',
    empCode: 'EMP-004',
    department: 'Accounts',
    designation: 'Accountant',
    fromDate: '2026-04-21',
    toDate: '2026-04-21',
    totalDays: 1,
    leaveType: 'Earned Leave (EL)',
    reason: 'Personal financial audit errands.',
    appliedDate: '2026-04-19',
    status: 'Approved',
    approvedBy: 'Director'
  }
];

export const getStudentLeaves = (req, res) => {
  const { type, fromDate, toDate, className, studentId } = req.query;
  let filtered = [...studentLeaves];

  if (type === 'Date Wise') {
    if (fromDate) filtered = filtered.filter(l => l.fromDate >= fromDate);
    if (toDate) filtered = filtered.filter(l => l.toDate <= toDate);
  } else if (type === 'Class Wise') {
    if (className && className !== 'All') {
      filtered = filtered.filter(l => l.className === className);
    }
    if (studentId && studentId !== 'All') {
      filtered = filtered.filter(l => l.studentId === studentId || l.studentName.includes(studentId));
    }
  }

  return res.json({
    success: true,
    data: filtered,
    summary: {
      total: filtered.length,
      approved: filtered.filter(l => l.status === 'Approved').length,
      pending: filtered.filter(l => l.status === 'Pending').length,
      rejected: filtered.filter(l => l.status === 'Rejected').length
    }
  });
};

export const updateStudentLeaveStatus = (req, res) => {
  const { id } = req.params;
  const { status, approvedBy } = req.body;
  const leave = studentLeaves.find(l => l.id === id);
  if (!leave) {
    return res.status(404).json({ success: false, message: 'Leave record not found' });
  }
  leave.status = status;
  leave.approvedBy = approvedBy || 'Admin';
  return res.json({
    success: true,
    message: `Leave request ${status.toLowerCase()} successfully`,
    data: leave
  });
};

export const deleteStudentLeave = (req, res) => {
  const { id } = req.params;
  studentLeaves = studentLeaves.filter(l => l.id !== id);
  return res.json({ success: true, message: 'Leave request deleted' });
};

export const getStaffLeaves = (req, res) => {
  const { type, fromDate, toDate } = req.query;
  let filtered = [...staffLeaves];

  if (type === 'Date Wise') {
    if (fromDate) filtered = filtered.filter(l => l.fromDate >= fromDate);
    if (toDate) filtered = filtered.filter(l => l.toDate <= toDate);
  }

  return res.json({
    success: true,
    data: filtered,
    summary: {
      total: filtered.length,
      approved: filtered.filter(l => l.status === 'Approved').length,
      pending: filtered.filter(l => l.status === 'Pending').length,
      rejected: filtered.filter(l => l.status === 'Rejected').length
    }
  });
};

export const updateStaffLeaveStatus = (req, res) => {
  const { id } = req.params;
  const { status, approvedBy } = req.body;
  const leave = staffLeaves.find(l => l.id === id);
  if (!leave) {
    return res.status(404).json({ success: false, message: 'Leave record not found' });
  }
  leave.status = status;
  leave.approvedBy = approvedBy || 'Principal';
  return res.json({
    success: true,
    message: `Staff leave request ${status.toLowerCase()} successfully`,
    data: leave
  });
};

export const deleteStaffLeave = (req, res) => {
  const { id } = req.params;
  staffLeaves = staffLeaves.filter(l => l.id !== id);
  return res.json({ success: true, message: 'Staff leave record deleted' });
};

export const applyLeave = (req, res) => {
  const { applicantType, applicantName, className, section, fromDate, toDate, leaveType, reason, attachment } = req.body;
  if (!applicantName || !fromDate || !toDate) {
    return res.status(400).json({ success: false, message: 'Applicant name and dates are required' });
  }

  const d1 = new Date(fromDate);
  const d2 = new Date(toDate);
  const diffTime = Math.abs(d2 - d1);
  const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  if (applicantType === 'Staff') {
    const newStaffLeave = {
      id: `STF-LV-${String(staffLeaves.length + 1).padStart(3, '0')}`,
      staffId: String(staffLeaves.length + 1),
      staffName: applicantName.toUpperCase(),
      empCode: `EMP-0${String(staffLeaves.length + 1).padStart(2, '0')}`,
      department: 'General Staff',
      designation: 'Faculty',
      fromDate,
      toDate,
      totalDays,
      leaveType: leaveType || 'Casual Leave (CL)',
      reason: reason || 'Personal Leave',
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      approvedBy: '-'
    };
    staffLeaves.unshift(newStaffLeave);
    return res.json({
      success: true,
      message: 'Staff leave application submitted successfully',
      data: newStaffLeave
    });
  } else {
    const newStudentLeave = {
      id: `STU-LV-${String(studentLeaves.length + 1).padStart(3, '0')}`,
      studentId: String(studentLeaves.length + 1),
      studentName: applicantName.toUpperCase(),
      className: className || 'I',
      section: section || 'A',
      rollNo: String(studentLeaves.length + 1),
      fromDate,
      toDate,
      totalDays,
      leaveType: leaveType || 'Casual Leave',
      reason: reason || 'Domestic work / Medical',
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      approvedBy: '-',
      attachment: attachment || null
    };
    studentLeaves.unshift(newStudentLeave);
    return res.json({
      success: true,
      message: 'Student leave application submitted successfully',
      data: newStudentLeave
    });
  }
};
