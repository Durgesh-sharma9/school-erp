// Certificates Controller - Unified School ERP
// 1:1 Parity with UAB Infosol Certificate Generation workflows

let manualCertificates = [
  {
    id: 1,
    admNo: '1245',
    srNo: '1245',
    penNo: 'PEN-889911',
    name: 'PAYAL BUNKAR',
    className: 'CLASS XII',
    division: 'A',
    fatherName: 'RAMESH BUNKAR',
    motherName: 'GEETA BUNKAR',
    dob: '2008-05-14',
    academicYear: '2026-2027',
    issueDate: '2026-10-10',
    reportType: 'Character Certificate',
    withOption: "Father's Name",
    format: 'Standard',
    status: 'Issued'
  }
];

let manualTcList = [
  {
    id: 1,
    admNo: 'JD-2021-120',
    srNo: '1120',
    penNo: 'PEN-994422',
    studentRegNo: 'REG-2021-120',
    name: 'HARSH VARDHAN',
    className: 'VIII',
    fatherName: 'SURENDRA KUMAR',
    motherName: 'ANITA DEVI',
    tcNo: 'TC-2026/041',
    issueDate: '2026-09-15',
    dateOfLeaving: '2026-09-10',
    reasonOfLeaving: 'Parent job transfer to Jaipur',
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
    status: 'Issued'
  }
];

export const getManualCertificates = async (req, res) => {
  try {
    res.status(200).json({ success: true, data: manualCertificates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createManualCertificate = async (req, res) => {
  try {
    const newCert = {
      id: Date.now(),
      issueDate: new Date().toISOString().split('T')[0],
      status: 'Issued',
      ...req.body
    };
    manualCertificates.unshift(newCert);
    res.status(201).json({ success: true, message: 'Certificate generated successfully', data: newCert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getManualTcList = async (req, res) => {
  try {
    res.status(200).json({ success: true, data: manualTcList });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createManualTc = async (req, res) => {
  try {
    const tcCount = manualTcList.length + 42;
    const newTc = {
      id: Date.now(),
      tcNo: `TC-2026/${String(tcCount).padStart(3, '0')}`,
      issueDate: req.body.issueDate || new Date().toISOString().split('T')[0],
      status: 'Issued',
      ...req.body
    };
    manualTcList.unshift(newTc);
    res.status(201).json({ success: true, message: 'Manual TC generated successfully', data: newTc });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const bulkGenerateTc = async (req, res) => {
  try {
    const { studentIds, reason, className, section } = req.body;
    res.status(200).json({
      success: true,
      message: `Bulk TC generated successfully for ${studentIds?.length || 0} students with reason: ${reason}`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
