import { ApiResponse } from '../../core/utils/apiResponse.js';
import { asyncHandler } from '../../core/utils/asyncHandler.js';

// Pre-seeded multi-tenant store for Targeted Announcements
const TENANT_ANNOUNCEMENTS = {
  'sch_jd_intl': [
    {
      id: 'ann_001',
      title: 'Mandatory Monthly Faculty Meeting - NEP 2020 Rubrics & Assessment Review',
      content: 'Dear Teachers, all faculty members are requested to attend the monthly academic briefing today at 02:45 PM in the Audio-Visual Hall. Agenda: Formative assessment entry deadlines and co-scholastic grading parameters.',
      targetType: 'ALL_TEACHERS',
      targetSummary: 'All Faculty (10 Teachers)',
      targetDetails: {
        allStaff: true,
        count: 10
      },
      priority: 'High',
      category: 'Staff Notice',
      sender: 'Abhilasha Bhatt (Principal)',
      channels: { inApp: true, sms: true, whatsapp: false, push: true },
      ackRequired: true,
      attachmentUrl: 'Faculty_Meeting_Agenda_Oct2026.pdf',
      stats: { targeted: 10, delivered: 10, read: 8, acknowledged: 7 },
      createdAt: '2026-10-21T09:30:00.000Z',
      status: 'Sent'
    },
    {
      id: 'ann_002',
      title: 'Science & Robotics Olympiad 2026 - Mentor Guidance Schedule',
      content: 'Respected Mentors, please conduct special doubt sessions for the shortlisted Olympiad participants during zero period starting this Thursday. Practical kits are ready in the Physics & Robotics labs.',
      targetType: 'SELECTIVE_TEACHERS',
      targetSummary: '2 Teachers (Dr. Arun Joshi, Mrs. Kavita Verma)',
      targetDetails: {
        teacherIds: ['t_2', 't_3'],
        teachers: [
          { id: 't_2', name: 'Mrs. Kavita Verma', subject: 'Science (TGT)' },
          { id: 't_3', name: 'Dr. Arun Joshi', subject: 'Physics (PGT)' }
        ]
      },
      priority: 'Normal',
      category: 'Academic',
      sender: 'Academic Coordinator',
      channels: { inApp: true, sms: false, whatsapp: true, push: true },
      ackRequired: false,
      attachmentUrl: 'Olympiad_Shortlisted_Students.pdf',
      stats: { targeted: 2, delivered: 2, read: 2, acknowledged: 2 },
      createdAt: '2026-10-20T14:15:00.000Z',
      status: 'Sent'
    },
    {
      id: 'ann_003',
      title: 'Primary Wing Annual Craft & Science Expo - Booth Layout Allocation',
      content: 'Dear Primary Wing Teachers, the stall layout and craft materials for Grades 1 to 5 have been sanctioned. Please submit your class models list to the art coordinator by Friday 1:00 PM.',
      targetType: 'TEACHER_GROUP',
      targetSummary: 'Group: Primary Wing Faculty (3 Teachers)',
      targetDetails: {
        groupId: 'grp_primary',
        groupName: 'Primary Wing Faculty (Grades 1-5)',
        count: 3
      },
      priority: 'Normal',
      category: 'Staff Notice',
      sender: 'Headmistress Office',
      channels: { inApp: true, sms: true, whatsapp: true, push: false },
      ackRequired: true,
      attachmentUrl: 'Stall_Layout_Primary_Expo.pdf',
      stats: { targeted: 3, delivered: 3, read: 3, acknowledged: 3 },
      createdAt: '2026-10-19T11:00:00.000Z',
      status: 'Sent'
    },
    {
      id: 'ann_004',
      title: 'Class 10-A Special Remedial Mathematics & Pre-Board Prep Session',
      content: 'Dear Students and Parents of Class 10-A, a special remedial session for Polynomials and Trigonometry will be held this Saturday between 09:00 AM and 11:30 AM. School bus transport will be available.',
      targetType: 'ENTIRE_CLASS',
      targetSummary: 'Class X - Section A (42 Students)',
      targetDetails: {
        className: 'X',
        section: 'A',
        studentCount: 42
      },
      priority: 'High',
      category: 'Academic',
      sender: 'Mr. Rakesh Sharma (HOD Mathematics)',
      channels: { inApp: true, sms: true, whatsapp: true, push: true },
      ackRequired: false,
      attachmentUrl: 'Class10_Maths_Worksheet_SetA.pdf',
      stats: { targeted: 42, delivered: 42, read: 36, acknowledged: 31 },
      createdAt: '2026-10-18T16:20:00.000Z',
      status: 'Sent'
    },
    {
      id: 'ann_005',
      title: 'Urgent: State Level Debate Championship Representation - Briefing Notice',
      content: 'Dear Rohan Meena, congratulations on being selected to represent J D International School at the Inter-State Bilingual Debate at SMS Stadium Convention Hall. Please report to the Principal Office at 11:00 AM with your speech draft.',
      targetType: 'SPECIFIC_STUDENT',
      targetSummary: 'Student: Rohan Meena (Adm: 1402, Roll: 14, Class X-A)',
      targetDetails: {
        studentId: 'std_4',
        studentName: 'Rohan Meena',
        admNo: '1402',
        rollNo: '14',
        className: 'X',
        section: 'A',
        parentName: 'Suresh Meena',
        phone: '9829044556'
      },
      priority: 'Urgent',
      category: 'Academic',
      sender: 'Principal Office',
      channels: { inApp: true, sms: true, whatsapp: true, push: true },
      ackRequired: true,
      attachmentUrl: 'State_Debate_Invitation_Pass.pdf',
      stats: { targeted: 1, delivered: 1, read: 1, acknowledged: 1 },
      createdAt: '2026-10-21T08:00:00.000Z',
      status: 'Sent'
    }
  ]
};

// Targetable metadata pool
const TARGET_METADATA = {
  teachers: [
    { id: 't_1', name: 'Mr. Rakesh Sharma', subject: 'Mathematics (PGT)', department: 'Mathematics Faculty', phone: '9829989330', email: 'rakesh.sharma@jd.edu' },
    { id: 't_2', name: 'Mrs. Kavita Verma', subject: 'Science (TGT)', department: 'Science & Technology', phone: '9870943695', email: 'kavita.v@jd.edu' },
    { id: 't_3', name: 'Dr. Arun Joshi', subject: 'Physics (PGT)', department: 'Science & Technology', phone: '9414023456', email: 'arun.joshi@jd.edu' },
    { id: 't_4', name: 'Ms. Neha Gupta', subject: 'English (TGT)', department: 'Languages & Humanities', phone: '9829012345', email: 'neha.gupta@jd.edu' },
    { id: 't_5', name: 'Mrs. Monika Rani', subject: 'Social Science (PRT)', department: 'Primary Wing Faculty', phone: '9511719644', email: 'monika.r@jd.edu' },
    { id: 't_6', name: 'Mr. Vikram Rathore', subject: 'Physical Education (PTI)', department: 'Sports & Activities', phone: '8107187618', email: 'vikram.r@jd.edu' },
    { id: 't_7', name: 'Ms. Pooja Saxena', subject: 'Computer Science (PGT)', department: 'Science & Technology', phone: '9079909813', email: 'pooja.s@jd.edu' },
    { id: 't_8', name: 'Mrs. Sunita Kumari', subject: 'Hindi (TGT)', department: 'Languages & Humanities', phone: '9672992836', email: 'sunita.k@jd.edu' },
    { id: 't_9', name: 'Mr. Rajesh Meena', subject: 'Art & Craft (PRT)', department: 'Primary Wing Faculty', phone: '9636644293', email: 'rajesh.m@jd.edu' },
    { id: 't_10', name: 'Mrs. Deepa Bhatt', subject: 'Chemistry (PGT)', department: 'Science & Technology', phone: '9829112233', email: 'deepa.b@jd.edu' }
  ],
  teacherGroups: [
    { id: 'grp_science', name: 'Science & Technology Department', description: 'Physics, Chemistry, Biology, and Computer Science Faculty', memberCount: 4 },
    { id: 'grp_maths', name: 'Mathematics Faculty', description: 'Primary to Senior Secondary Maths Teachers', memberCount: 2 },
    { id: 'grp_languages', name: 'Languages & Humanities Wing', description: 'English, Hindi, and Sanskrit Departments', memberCount: 2 },
    { id: 'grp_primary', name: 'Primary Wing Faculty (Grades 1-5)', description: 'Primary Class Incharges & Subject Mentors', memberCount: 3 },
    { id: 'grp_senior', name: 'Senior Secondary Wing (PGT)', description: 'Classes 11 & 12 Board Subject Specialists', memberCount: 3 },
    { id: 'grp_sports', name: 'Sports & Physical Education Dept', description: 'Coaches, PTI, and Yoga Instructors', memberCount: 2 },
    { id: 'grp_exam', name: 'Examination & Evaluation Cell', description: 'Confidential Exam Cell Committee', memberCount: 3 }
  ],
  classes: [
    { name: 'Nursery', sections: ['A', 'B'] },
    { name: 'KG', sections: ['A', 'B'] },
    { name: 'I', sections: ['A', 'B', 'C'] },
    { name: 'II', sections: ['A', 'B'] },
    { name: 'III', sections: ['A', 'B'] },
    { name: 'IV', sections: ['A', 'B'] },
    { name: 'V', sections: ['A', 'B'] },
    { name: 'VI', sections: ['A', 'B'] },
    { name: 'VII', sections: ['A', 'B'] },
    { name: 'VIII', sections: ['A', 'B'] },
    { name: 'IX', sections: ['A', 'B', 'C'] },
    { name: 'X', sections: ['A', 'B', 'C'] },
    { name: 'XI', sections: ['A (Sci)', 'B (Comm)', 'C (Arts)'] },
    { name: 'XII', sections: ['A (Sci)', 'B (Comm)', 'C (Arts)'] }
  ],
  students: [
    { id: 'std_1', className: 'I', section: 'A', rollNo: '1', admNo: '1621', name: 'Aaditya Singh Choudhary', fatherName: 'Narendra Singh', phone: '9829012345' },
    { id: 'std_2', className: 'I', section: 'A', rollNo: '2', admNo: 'A135', name: 'Advik Rao', fatherName: 'Pradeep Rao', phone: '9414023456' },
    { id: 'std_3', className: 'I', section: 'A', rollNo: '3', admNo: '1625', name: 'Ananya Sharma', fatherName: 'Manish Sharma', phone: '9829033445' },
    { id: 'std_4', className: 'X', section: 'A', rollNo: '14', admNo: '1402', name: 'Rohan Meena', fatherName: 'Suresh Meena', phone: '9829044556' },
    { id: 'std_5', className: 'X', section: 'A', rollNo: '22', admNo: '1408', name: 'Priya Shekhawat', fatherName: 'Rajendra Singh', phone: '9829055667' },
    { id: 'std_6', className: 'X', section: 'A', rollNo: '31', admNo: '1415', name: 'Dhruv Agarwal', fatherName: 'Alok Agarwal', phone: '9829066778' },
    { id: 'std_7', className: 'X', section: 'B', rollNo: '8', admNo: '1420', name: 'Aryan Joshi', fatherName: 'Hemant Joshi', phone: '9829077889' },
    { id: 'std_8', className: 'X', section: 'B', rollNo: '19', admNo: '1424', name: 'Tanya Verma', fatherName: 'Kamal Verma', phone: '9829088990' },
    { id: 'std_9', className: 'XII', section: 'A (Sci)', rollNo: '5', admNo: '1205', name: 'Sameer Khan', fatherName: 'Imran Khan', phone: '9829099001' },
    { id: 'std_10', className: 'XII', section: 'A (Sci)', rollNo: '18', admNo: '1218', name: 'Divya Rathore', fatherName: 'Mahendra Singh', phone: '9829011223' },
    { id: 'std_11', className: 'IX', section: 'A', rollNo: '12', admNo: '1501', name: 'Kartik Somani', fatherName: 'Rajesh Somani', phone: '9829022334' },
    { id: 'std_12', className: 'VIII', section: 'B', rollNo: '9', admNo: '1540', name: 'Bhavya Patel', fatherName: 'Nitin Patel', phone: '9829033445' }
  ]
};

// GET /api/announcements/meta
export const getTargetMetadata = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(200, TARGET_METADATA, 'Targeting metadata loaded successfully')
  );
});

// GET /api/announcements
export const getAnnouncements = asyncHandler(async (req, res) => {
  const schoolId = req.schoolId || 'sch_jd_intl';
  const { targetType, priority, search } = req.query;

  let list = TENANT_ANNOUNCEMENTS[schoolId] || TENANT_ANNOUNCEMENTS['sch_jd_intl'] || [];

  if (targetType && targetType !== 'ALL') {
    list = list.filter(item => item.targetType === targetType);
  }

  if (priority && priority !== 'ALL') {
    list = list.filter(item => item.priority.toLowerCase() === priority.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.content.toLowerCase().includes(q) ||
      item.targetSummary.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  }

  return res.status(200).json(
    new ApiResponse(200, {
      announcements: list,
      total: list.length,
      counts: {
        all: list.length,
        teachers: list.filter(a => ['ALL_TEACHERS', 'SELECTIVE_TEACHERS', 'TEACHER_GROUP'].includes(a.targetType)).length,
        classes: list.filter(a => a.targetType === 'ENTIRE_CLASS').length,
        students: list.filter(a => a.targetType === 'SPECIFIC_STUDENT').length,
        urgent: list.filter(a => a.priority === 'Urgent').length
      }
    }, 'Announcements retrieved successfully')
  );
});

// POST /api/announcements
export const createAnnouncement = asyncHandler(async (req, res) => {
  const schoolId = req.schoolId || 'sch_jd_intl';
  const {
    title,
    content,
    targetType,
    targetDetails,
    priority = 'Normal',
    category = 'Academic',
    channels = { inApp: true, sms: false, whatsapp: false, push: true },
    ackRequired = false,
    attachmentUrl = null,
    sender = 'Admin / Principal'
  } = req.body;

  if (!title || !content || !targetType) {
    return res.status(400).json(
      new ApiResponse(400, null, 'Title, content, and targetType are required')
    );
  }

  // Derive target summary & target count
  let targetSummary = 'Target Audience';
  let targetedCount = 1;

  if (targetType === 'ALL_TEACHERS') {
    targetedCount = TARGET_METADATA.teachers.length;
    targetSummary = `All Faculty (${targetedCount} Teachers)`;
  } else if (targetType === 'SELECTIVE_TEACHERS') {
    const names = targetDetails?.teachers?.map(t => t.name) || [];
    targetedCount = names.length || 1;
    targetSummary = `${targetedCount} Selected Teacher${targetedCount > 1 ? 's' : ''} (${names.slice(0, 2).join(', ')}${names.length > 2 ? ' +' + (names.length - 2) + ' more' : ''})`;
  } else if (targetType === 'TEACHER_GROUP') {
    const grp = TARGET_METADATA.teacherGroups.find(g => g.id === targetDetails?.groupId);
    targetedCount = grp ? grp.memberCount : 4;
    targetSummary = `Group: ${targetDetails?.groupName || 'Faculty Wing'} (${targetedCount} Teachers)`;
  } else if (targetType === 'ENTIRE_CLASS') {
    const sec = targetDetails?.section === 'ALL' ? 'All Sections' : `Sec ${targetDetails?.section}`;
    targetedCount = targetDetails?.studentCount || 40;
    targetSummary = `Class ${targetDetails?.className} - ${sec} (${targetedCount} Students)`;
  } else if (targetType === 'SPECIFIC_STUDENT') {
    targetedCount = 1;
    targetSummary = `Student: ${targetDetails?.studentName} (Adm: ${targetDetails?.admNo || 'N/A'}, Class ${targetDetails?.className}-${targetDetails?.section})`;
  }

  const newAnnouncement = {
    id: `ann_${Date.now()}`,
    title,
    content,
    targetType,
    targetSummary,
    targetDetails: targetDetails || {},
    priority,
    category,
    sender,
    channels: {
      inApp: true,
      sms: Boolean(channels?.sms),
      whatsapp: Boolean(channels?.whatsapp),
      push: Boolean(channels?.push)
    },
    ackRequired: Boolean(ackRequired),
    attachmentUrl: attachmentUrl || null,
    stats: {
      targeted: targetedCount,
      delivered: targetedCount,
      read: 0,
      acknowledged: 0
    },
    createdAt: new Date().toISOString(),
    status: 'Sent'
  };

  if (!TENANT_ANNOUNCEMENTS[schoolId]) {
    TENANT_ANNOUNCEMENTS[schoolId] = [];
  }

  TENANT_ANNOUNCEMENTS[schoolId].unshift(newAnnouncement);

  return res.status(201).json(
    new ApiResponse(201, newAnnouncement, 'Announcement broadcasted successfully')
  );
});

// POST /api/announcements/:id/resend
export const resendAnnouncement = asyncHandler(async (req, res) => {
  const schoolId = req.schoolId || 'sch_jd_intl';
  const { id } = req.params;

  const list = TENANT_ANNOUNCEMENTS[schoolId] || [];
  const item = list.find(a => a.id === id);

  if (!item) {
    return res.status(404).json(new ApiResponse(404, null, 'Announcement not found'));
  }

  // Update delivered stats
  item.stats.delivered = item.stats.targeted;
  item.lastResentAt = new Date().toISOString();

  return res.status(200).json(
    new ApiResponse(200, item, 'Announcement re-broadcasted to all recipients successfully')
  );
});

// DELETE /api/announcements/:id
export const deleteAnnouncement = asyncHandler(async (req, res) => {
  const schoolId = req.schoolId || 'sch_jd_intl';
  const { id } = req.params;

  if (TENANT_ANNOUNCEMENTS[schoolId]) {
    TENANT_ANNOUNCEMENTS[schoolId] = TENANT_ANNOUNCEMENTS[schoolId].filter(a => a.id !== id);
  }

  return res.status(200).json(
    new ApiResponse(200, { id }, 'Announcement deleted successfully')
  );
});
