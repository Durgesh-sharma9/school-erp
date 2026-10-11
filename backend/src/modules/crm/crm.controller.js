let mockLeads = [
  {
    id: 1,
    leadNo: 'ENQ-2026-001',
    studentName: 'Aarav Sharma',
    parentName: 'Ramesh Sharma',
    mobile: '9876543210',
    email: 'ramesh.sharma@gmail.com',
    className: 'X',
    source: 'Walk-in',
    status: 'Hot',
    priority: 'High',
    stage: 'Campus Visit',
    followUpDate: '2026-10-12',
    counselor: 'Rajesh Verma',
    notes: 'Visited school campus. Interested in Science stream. Requested fee concession details.',
    createdAt: '2026-10-09'
  },
  {
    id: 2,
    leadNo: 'ENQ-2026-002',
    studentName: 'Ananya Verma',
    parentName: 'Sanjay Verma',
    mobile: '9812345678',
    email: 'sanjay.verma@yahoo.com',
    className: 'XI-SCIENCE',
    source: 'Website',
    status: 'Warm',
    priority: 'Medium',
    stage: 'Application',
    followUpDate: '2026-10-11',
    counselor: 'Pooja Singh',
    notes: 'Filled online admission enquiry. Awaiting board result mark sheet copy.',
    createdAt: '2026-10-08'
  },
  {
    id: 3,
    leadNo: 'ENQ-2026-003',
    studentName: 'Vihaan Patel',
    parentName: 'Nitin Patel',
    mobile: '9923456789',
    email: 'nitin.patel@gmail.com',
    className: 'I',
    source: 'Referral',
    status: 'Enrolled',
    priority: 'Low',
    stage: 'Admitted',
    followUpDate: '2026-10-15',
    counselor: 'Rajesh Verma',
    notes: 'Admission confirmed and fee paid. Transport seat allocated.',
    createdAt: '2026-10-05'
  },
  {
    id: 4,
    leadNo: 'ENQ-2026-004',
    studentName: 'Ishita Gupta',
    parentName: 'Sunil Gupta',
    mobile: '9789012345',
    email: 'sunil.g@outlook.com',
    className: 'IX',
    source: 'Social Media',
    status: 'New',
    priority: 'High',
    stage: 'Inquiry',
    followUpDate: '2026-10-11',
    counselor: 'Pooja Singh',
    notes: 'Inquired about hostel facility and scholarship exam.',
    createdAt: '2026-10-11'
  },
  {
    id: 5,
    leadNo: 'ENQ-2026-005',
    studentName: 'Kabir Singh',
    parentName: 'Harpreet Singh',
    mobile: '9654321987',
    email: 'harpreet.s@gmail.com',
    className: 'Pre-Nursery',
    source: 'Phone Call',
    status: 'Follow Up',
    priority: 'Medium',
    stage: 'Campus Visit',
    followUpDate: '2026-10-13',
    counselor: 'Rajesh Verma',
    notes: 'Scheduled school campus tour with parents on Saturday.',
    createdAt: '2026-10-10'
  }
];

export const getLeads = (req, res) => {
  res.status(200).json({
    success: true,
    data: mockLeads,
    total: mockLeads.length
  });
};

export const createLead = (req, res) => {
  const newLead = {
    id: Date.now(),
    leadNo: `ENQ-2026-${String(mockLeads.length + 1).padStart(3, '0')}`,
    createdAt: new Date().toISOString().split('T')[0],
    stage: req.body.stage || 'Inquiry',
    ...req.body
  };
  mockLeads = [newLead, ...mockLeads];
  res.status(201).json({
    success: true,
    data: newLead,
    message: 'Admission Enquiry Lead created successfully'
  });
};

export const updateLeadStatus = (req, res) => {
  const { id } = req.params;
  const { status, stage, notes } = req.body;
  const leadIndex = mockLeads.findIndex(l => l.id === Number(id));
  if (leadIndex === -1) {
    return res.status(404).json({ success: false, message: 'Lead not found' });
  }
  mockLeads[leadIndex] = {
    ...mockLeads[leadIndex],
    ...(status && { status }),
    ...(stage && { stage }),
    ...(notes && { notes: `${mockLeads[leadIndex].notes} | ${notes}` })
  };
  res.status(200).json({
    success: true,
    data: mockLeads[leadIndex],
    message: 'Lead updated successfully'
  });
};

export const deleteLead = (req, res) => {
  const { id } = req.params;
  mockLeads = mockLeads.filter(l => l.id !== Number(id));
  res.status(200).json({
    success: true,
    message: 'Lead deleted successfully'
  });
};
