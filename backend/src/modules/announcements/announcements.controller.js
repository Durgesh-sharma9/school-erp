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
        phone: '7891008092'
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
    { id: 't_1', name: 'Mr. Rakesh Sharma', subject: 'Mathematics (PGT)', department: 'Mathematics Faculty', phone: '7891008092', email: 'rakesh.sharma@jd.edu' },
    { id: 't_2', name: 'Mrs. Kavita Verma', subject: 'Science (TGT)', department: 'Science & Technology', phone: '7891008092', email: 'kavita.v@jd.edu' },
    { id: 't_3', name: 'Dr. Arun Joshi', subject: 'Physics (PGT)', department: 'Science & Technology', phone: '7891008092', email: 'arun.joshi@jd.edu' },
    { id: 't_4', name: 'Ms. Neha Gupta', subject: 'English (TGT)', department: 'Languages & Humanities', phone: '7891008092', email: 'neha.gupta@jd.edu' },
    { id: 't_5', name: 'Mrs. Monika Rani', subject: 'Social Science (PRT)', department: 'Primary Wing Faculty', phone: '7891008092', email: 'monika.r@jd.edu' },
    { id: 't_6', name: 'Mr. Vikram Rathore', subject: 'Physical Education (PTI)', department: 'Sports & Activities', phone: '7891008092', email: 'vikram.r@jd.edu' },
    { id: 't_7', name: 'Ms. Pooja Saxena', subject: 'Computer Science (PGT)', department: 'Science & Technology', phone: '7891008092', email: 'pooja.s@jd.edu' },
    { id: 't_8', name: 'Mrs. Sunita Kumari', subject: 'Hindi (TGT)', department: 'Languages & Humanities', phone: '7891008092', email: 'sunita.k@jd.edu' },
    { id: 't_9', name: 'Mr. Rajesh Meena', subject: 'Art & Craft (PRT)', department: 'Primary Wing Faculty', phone: '7891008092', email: 'rajesh.m@jd.edu' },
    { id: 't_10', name: 'Mrs. Deepa Bhatt', subject: 'Chemistry (PGT)', department: 'Science & Technology', phone: '7891008092', email: 'deepa.b@jd.edu' }
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
    { id: 'std_1', className: 'I', section: 'A', rollNo: '1', admNo: '1621', name: 'Aaditya Singh Choudhary', fatherName: 'Narendra Singh', phone: '7891008092' },
    { id: 'std_2', className: 'I', section: 'A', rollNo: '2', admNo: 'A135', name: 'Advik Rao', fatherName: 'Pradeep Rao', phone: '7891008092' },
    { id: 'std_3', className: 'I', section: 'A', rollNo: '3', admNo: '1625', name: 'Ananya Sharma', fatherName: 'Manish Sharma', phone: '7891008092' },
    { id: 'std_4', className: 'X', section: 'A', rollNo: '14', admNo: '1402', name: 'Rohan Meena', fatherName: 'Suresh Meena', phone: '7891008092' },
    { id: 'std_5', className: 'X', section: 'A', rollNo: '22', admNo: '1408', name: 'Priya Shekhawat', fatherName: 'Rajendra Singh', phone: '7891008092' },
    { id: 'std_6', className: 'X', section: 'A', rollNo: '31', admNo: '1415', name: 'Dhruv Agarwal', fatherName: 'Alok Agarwal', phone: '7891008092' },
    { id: 'std_7', className: 'X', section: 'B', rollNo: '8', admNo: '1420', name: 'Aryan Joshi', fatherName: 'Hemant Joshi', phone: '7891008092' },
    { id: 'std_8', className: 'X', section: 'B', rollNo: '19', admNo: '1424', name: 'Tanya Verma', fatherName: 'Kamal Verma', phone: '7891008092' },
    { id: 'std_9', className: 'XII', section: 'A (Sci)', rollNo: '5', admNo: '1205', name: 'Sameer Khan', fatherName: 'Imran Khan', phone: '7891008092' },
    { id: 'std_10', className: 'XII', section: 'A (Sci)', rollNo: '18', admNo: '1218', name: 'Divya Rathore', fatherName: 'Mahendra Singh', phone: '7891008092' },
    { id: 'std_11', className: 'IX', section: 'A', rollNo: '12', admNo: '1501', name: 'Kartik Somani', fatherName: 'Rajesh Somani', phone: '7891008092' },
    { id: 'std_12', className: 'VIII', section: 'B', rollNo: '9', admNo: '1540', name: 'Bhavya Patel', fatherName: 'Nitin Patel', phone: '7891008092' }
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

// ==========================================
// INTERACTIVE POLLS STORE & CONTROLLERS
// ==========================================

const TENANT_POLLS = {
  'sch_jd_intl': [
    {
      id: 'poll_001',
      title: 'Annual Winter Carnival & Sports Day - Preferred Time Schedule',
      description: 'Dear Parents & Faculty, please vote for the preferred time slot for the upcoming Winter Sports & Carnival 2026 celebration.',
      audience: 'parents',
      audienceScope: 'all',
      selectedClassIds: ['All Classes'],
      pollType: 'single',
      options: [
        { id: 'opt_1', text: 'Morning Slot (08:30 AM - 12:30 PM)', votes: 74 },
        { id: 'opt_2', text: 'Afternoon / Evening Slot (02:30 PM - 06:30 PM)', votes: 132 },
        { id: 'opt_3', text: 'Weekend Sunday Special (09:00 AM - 02:00 PM)', votes: 45 }
      ],
      totalVotes: 251,
      allowEdit: false,
      expiryDate: '2026-11-20T23:59:59.000Z',
      status: 'Active',
      createdAt: '2026-10-22T10:00:00.000Z',
      votedUsers: ['user_admin_1']
    },
    {
      id: 'poll_002',
      title: 'Senior Secondary Saturday Skill Workshop - Subject Preference',
      description: 'Vote for the vocational / tech skill track you want prioritized for Saturday zero-period practical masterclasses.',
      audience: 'teachers',
      audienceScope: 'all',
      selectedClassIds: ['XI - SCI', 'XII - SCI'],
      pollType: 'multiple',
      options: [
        { id: 'opt_201', text: 'AI & Python Robotics Automation', votes: 19 },
        { id: 'opt_202', text: 'Financial Literacy & Stock Market Fundamentals', votes: 14 },
        { id: 'opt_203', text: 'Public Speaking, MUN & Debating Excellence', votes: 16 }
      ],
      totalVotes: 49,
      allowEdit: true,
      expiryDate: '2026-11-30T23:59:59.000Z',
      status: 'Active',
      createdAt: '2026-10-24T14:30:00.000Z',
      votedUsers: []
    }
  ]
};

// GET /api/announcements/polls
export const getPolls = asyncHandler(async (req, res) => {
  const schoolId = req.schoolId || 'sch_jd_intl';
  const list = TENANT_POLLS[schoolId] || [];

  // Recalculate percentages
  const pollsWithPercentages = list.map(poll => {
    const total = poll.options.reduce((sum, o) => sum + (o.votes || 0), 0);
    const optionsWithPercent = poll.options.map(opt => ({
      ...opt,
      percentage: total > 0 ? Math.round(((opt.votes || 0) / total) * 100) : 0
    }));
    return {
      ...poll,
      totalVotes: total,
      options: optionsWithPercent
    };
  });

  return res.status(200).json(
    new ApiResponse(200, { polls: pollsWithPercentages }, 'Polls retrieved successfully')
  );
});

// POST /api/announcements/polls
export const createPoll = asyncHandler(async (req, res) => {
  const schoolId = req.schoolId || 'sch_jd_intl';
  const { title, description, audience, audienceScope, selectedClassIds, pollType, options, expiryDate, allowEdit } = req.body;

  if (!title || !description) {
    return res.status(400).json(new ApiResponse(400, null, 'Title and description are required'));
  }

  const rawOpts = Array.isArray(options) ? options : [];
  if (rawOpts.length < 2) {
    return res.status(400).json(new ApiResponse(400, null, 'At least 2 options are required'));
  }

  const formattedOptions = rawOpts.map((opt, idx) => ({
    id: `opt_${Date.now()}_${idx}`,
    text: typeof opt === 'string' ? opt.trim() : (opt.text || '').trim(),
    votes: 0
  })).filter(o => o.text);

  const newPoll = {
    id: `poll_${Date.now()}`,
    title,
    description,
    audience: audience || 'parents',
    audienceScope: audienceScope || 'all',
    selectedClassIds: selectedClassIds || [],
    pollType: pollType || 'single',
    options: formattedOptions,
    totalVotes: 0,
    allowEdit: Boolean(allowEdit),
    expiryDate: expiryDate || null,
    status: 'Active',
    createdAt: new Date().toISOString(),
    votedUsers: []
  };

  if (!TENANT_POLLS[schoolId]) {
    TENANT_POLLS[schoolId] = [];
  }
  TENANT_POLLS[schoolId].unshift(newPoll);

  return res.status(201).json(
    new ApiResponse(201, newPoll, 'Poll published successfully')
  );
});

// POST /api/announcements/polls/:id/vote
export const castVote = asyncHandler(async (req, res) => {
  const schoolId = req.schoolId || 'sch_jd_intl';
  const { id } = req.params;
  const { optionIds, userId } = req.body;

  const list = TENANT_POLLS[schoolId] || [];
  const poll = list.find(p => p.id === id);

  if (!poll) {
    return res.status(404).json(new ApiResponse(404, null, 'Poll not found'));
  }

  if (poll.status !== 'Active') {
    return res.status(400).json(new ApiResponse(400, null, 'This poll is no longer active'));
  }

  const targetOptionIds = Array.isArray(optionIds) ? optionIds : [optionIds];
  let voteAdded = false;

  poll.options.forEach(opt => {
    if (targetOptionIds.includes(opt.id)) {
      opt.votes = (opt.votes || 0) + 1;
      voteAdded = true;
    }
  });

  if (voteAdded) {
    poll.totalVotes = poll.options.reduce((sum, o) => sum + (o.votes || 0), 0);
    if (userId) {
      if (!poll.votedUsers) poll.votedUsers = [];
      poll.votedUsers.push(userId);
    }
  }

  return res.status(200).json(
    new ApiResponse(200, poll, 'Vote recorded successfully')
  );
});

// POST /api/announcements/polls/:id/status
export const togglePollStatus = asyncHandler(async (req, res) => {
  const schoolId = req.schoolId || 'sch_jd_intl';
  const { id } = req.params;
  const { status } = req.body;

  const list = TENANT_POLLS[schoolId] || [];
  const poll = list.find(p => p.id === id);

  if (!poll) {
    return res.status(404).json(new ApiResponse(404, null, 'Poll not found'));
  }

  poll.status = status || (poll.status === 'Active' ? 'Closed' : 'Active');

  return res.status(200).json(
    new ApiResponse(200, poll, `Poll status changed to ${poll.status}`)
  );
});

// DELETE /api/announcements/polls/:id
export const deletePoll = asyncHandler(async (req, res) => {
  const schoolId = req.schoolId || 'sch_jd_intl';
  const { id } = req.params;

  if (TENANT_POLLS[schoolId]) {
    TENANT_POLLS[schoolId] = TENANT_POLLS[schoolId].filter(p => p.id !== id);
  }

  return res.status(200).json(
    new ApiResponse(200, { id }, 'Poll deleted successfully')
  );
});

// GET /api/announcements/polls/:id/analytics
export const getPollAnalytics = asyncHandler(async (req, res) => {
  const schoolId = req.schoolId || 'sch_jd_intl';
  const { id } = req.params;

  const list = TENANT_POLLS[schoolId] || [];
  const poll = list.find(p => p.id === id);

  if (!poll) {
    return res.status(404).json(new ApiResponse(404, null, 'Poll not found'));
  }

  const totalVotes = poll.options.reduce((sum, o) => sum + (o.votes || 0), 0);
  const totalAudience = poll.audience === 'teachers' ? 24 : 320;
  const pendingResponses = Math.max(0, totalAudience - totalVotes);
  const completionPercent = totalAudience > 0 ? Math.round((totalVotes / totalAudience) * 100) : 0;

  const optionSummary = poll.options.map(opt => ({
    option: opt.text,
    count: opt.votes || 0,
    percent: totalVotes > 0 ? Math.round(((opt.votes || 0) / totalVotes) * 100) : 0
  }));

  const parentBreakdown = [
    { className: 'X-A', totalParents: 42, responded: 34, pending: 8, completion: 81 },
    { className: 'IX-B', totalParents: 40, responded: 32, pending: 8, completion: 80 },
    { className: 'VIII-A', totalParents: 38, responded: 28, pending: 10, completion: 74 },
    { className: 'VII-C', totalParents: 36, responded: 24, pending: 12, completion: 67 },
    { className: 'VI-A', totalParents: 35, responded: 22, pending: 13, completion: 63 },
    { className: 'V-B', totalParents: 32, responded: 18, pending: 14, completion: 56 }
  ];

  const sampleNames = [
    { name: 'Suresh Verma', studentName: 'Ananya Verma', rollNo: '04', className: 'II-A', timeOffset: 12 },
    { name: 'Dr. Meenakshi Joshi', studentName: 'Aditya Joshi', rollNo: '11', className: 'X-A', timeOffset: 25 },
    { name: 'Rajesh Sharma', studentName: 'Aarav Sharma', rollNo: '01', className: 'I-A', timeOffset: 45 },
    { name: 'Pooja Choudhary', studentName: 'Kabir Choudhary', rollNo: '18', className: 'IX-B', timeOffset: 80 },
    { name: 'Sunil Rao', studentName: 'Diya Rao', rollNo: '22', className: 'VIII-A', timeOffset: 110 },
    { name: 'Anita Saxena', studentName: 'Manav Saxena', rollNo: '09', className: 'VII-C', timeOffset: 140 },
    { name: 'Manoj Kumar', studentName: 'Tanya Kumar', rollNo: '15', className: 'VI-A', timeOffset: 175 },
    { name: 'Geeta Rathore', studentName: 'Kunal Rathore', rollNo: '07', className: 'V-B', timeOffset: 210 },
    { name: 'Vikram Shekhawat', studentName: 'Pranav Shekhawat', rollNo: '14', className: 'X-A', timeOffset: 260 },
    { name: 'Rekha Agarwal', studentName: 'Ishaan Agarwal', rollNo: '19', className: 'IX-B', timeOffset: 310 }
  ];

  const teacherNames = [
    { name: 'Dr. Arun Joshi', selectedOption: poll.options[0]?.text || '', timeOffset: 15 },
    { name: 'Mrs. Kavita Verma', selectedOption: poll.options[1]?.text || poll.options[0]?.text || '', timeOffset: 45 },
    { name: 'Mr. Rakesh Sharma', selectedOption: poll.options[0]?.text || '', timeOffset: 70 },
    { name: 'Ms. Neha Gupta', selectedOption: poll.options[1]?.text || '', timeOffset: 120 },
    { name: 'Mr. Vikram Rathore', selectedOption: poll.options[2]?.text || poll.options[0]?.text || '', timeOffset: 180 },
    { name: 'Ms. Pooja Saxena', selectedOption: poll.options[0]?.text || '', timeOffset: 220 }
  ];

  const now = Date.now();
  const responses = poll.audience === 'teachers' 
    ? teacherNames.map(t => ({
        name: t.name,
        selectedOption: t.selectedOption,
        submittedAt: new Date(now - t.timeOffset * 60000).toISOString()
      }))
    : sampleNames.map((s, idx) => ({
        name: s.name,
        studentName: s.studentName,
        rollNo: s.rollNo,
        className: s.className,
        selectedOption: poll.options[idx % poll.options.length]?.text || poll.options[0]?.text || '',
        submittedAt: new Date(now - s.timeOffset * 60000).toISOString()
      }));

  const analytics = {
    poll: {
      _id: poll.id,
      title: poll.title,
      description: poll.description,
      audience: poll.audience,
      audienceScope: poll.audienceScope,
      pollType: poll.pollType,
      options: poll.options,
      createdAt: poll.createdAt,
      expiryDate: poll.expiryDate,
      createdByName: 'Admin Office',
      status: poll.status
    },
    summary: {
      totalAudience,
      responsesReceived: totalVotes,
      pendingResponses,
      completionPercent
    },
    optionSummary,
    parentBreakdown: poll.audience === 'teachers' ? [] : parentBreakdown,
    responses
  };

  return res.status(200).json(
    new ApiResponse(200, { analytics }, 'Poll analytics retrieved successfully')
  );
});


// ==========================================
// COMPLAINTS & FEEDBACK STORE & CONTROLLERS
// ==========================================

const TENANT_FEEDBACK = {
  'sch_jd_intl': [
    {
      id: 'TKT-2026-081',
      senderName: 'Sunita Verma (Mother of Ananya - II-A)',
      senderRole: 'Parent',
      senderContact: '7891008092',
      category: 'Transport',
      subject: 'Bus Route No. 4 Arrival Delay in Morning',
      description: 'Bus No. 4 was delayed by 25 minutes at Bhankrota circle this morning. Requesting school management to ensure timely pickup during winter timings.',
      priority: 'High',
      status: 'In Progress',
      createdAt: '2026-10-25T08:30:00.000Z',
      updatedAt: '2026-10-25T11:15:00.000Z',
      conversation: [
        {
          id: 'msg_1',
          sender: 'Sunita Verma',
          senderRole: 'Parent',
          text: 'Bus No. 4 was delayed by 25 minutes at Bhankrota circle this morning. Requesting school management to ensure timely pickup during winter timings.',
          timestamp: '2026-10-25T08:30:00.000Z'
        },
        {
          id: 'msg_2',
          sender: 'Transport Coordinator (Admin Office)',
          senderRole: 'School Staff',
          text: 'Dear Parent, thank you for bringing this to our attention. Route 4 driver experienced tyre puncture near the expressway. A spare bus was deployed. Driver has been instructed to keep buffer time.',
          timestamp: '2026-10-25T11:15:00.000Z'
        }
      ]
    },
    {
      id: 'TKT-2026-082',
      senderName: 'Rajesh Sharma (Father of Aarav - I-A)',
      senderRole: 'Parent',
      senderContact: '7891008092',
      category: 'Academic',
      subject: 'Request for Extra Mathematics Worksheets',
      description: 'Aarav is finding 2-digit carry-over addition a bit challenging. Could the class teacher please share extra practice worksheets?',
      priority: 'Medium',
      status: 'Resolved',
      createdAt: '2026-10-23T15:20:00.000Z',
      updatedAt: '2026-10-24T09:40:00.000Z',
      conversation: [
        {
          id: 'msg_101',
          sender: 'Rajesh Sharma',
          senderRole: 'Parent',
          text: 'Aarav is finding 2-digit carry-over addition a bit challenging. Could the class teacher please share extra practice worksheets?',
          timestamp: '2026-10-23T15:20:00.000Z'
        },
        {
          id: 'msg_102',
          sender: 'Mrs. Kavita (Primary Math Faculty)',
          senderRole: 'Teacher',
          text: 'Dear Mr. Sharma, I have uploaded a curated 15-page visual addition worksheet in Aarav\'s study material portal and handed a hardcopy in class today.',
          timestamp: '2026-10-24T09:40:00.000Z'
        }
      ]
    },
    {
      id: 'TKT-2026-083',
      senderName: 'Vikram Choudhary (PGT Mathematics)',
      senderRole: 'Teacher',
      senderContact: '7891008092',
      category: 'Infrastructure',
      subject: 'Projector HDMI port loose in Room 204',
      description: 'The projector in Class 10-B (Room 204) frequently flickers during digital blackboard presentations due to a loose HDMI connection.',
      priority: 'Low',
      status: 'Open',
      createdAt: '2026-10-26T09:10:00.000Z',
      updatedAt: '2026-10-26T09:10:00.000Z',
      conversation: [
        {
          id: 'msg_201',
          sender: 'Vikram Choudhary',
          senderRole: 'Teacher',
          text: 'The projector in Class 10-B (Room 204) frequently flickers during digital blackboard presentations due to a loose HDMI connection.',
          timestamp: '2026-10-26T09:10:00.000Z'
        }
      ]
    }
  ]
};

// GET /api/announcements/feedback
export const getFeedbackTickets = asyncHandler(async (req, res) => {
  const schoolId = req.schoolId || 'sch_jd_intl';
  const { status, category, search } = req.query;
  let list = TENANT_FEEDBACK[schoolId] || [];

  if (status && status !== 'ALL') {
    list = list.filter(t => t.status.toLowerCase() === status.toLowerCase());
  }
  if (category && category !== 'ALL') {
    list = list.filter(t => t.category.toLowerCase() === category.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(t => 
      t.subject.toLowerCase().includes(q) || 
      t.senderName.toLowerCase().includes(q) || 
      t.id.toLowerCase().includes(q)
    );
  }

  const counts = {
    all: (TENANT_FEEDBACK[schoolId] || []).length,
    open: (TENANT_FEEDBACK[schoolId] || []).filter(t => t.status === 'Open').length,
    inProgress: (TENANT_FEEDBACK[schoolId] || []).filter(t => t.status === 'In Progress').length,
    resolved: (TENANT_FEEDBACK[schoolId] || []).filter(t => t.status === 'Resolved').length
  };

  return res.status(200).json(
    new ApiResponse(200, { tickets: list, counts }, 'Feedback tickets retrieved successfully')
  );
});

// POST /api/announcements/feedback
export const createFeedbackTicket = asyncHandler(async (req, res) => {
  const schoolId = req.schoolId || 'sch_jd_intl';
  const { senderName, senderRole, senderContact, category, subject, description, priority } = req.body;

  if (!subject || !description) {
    return res.status(400).json(new ApiResponse(400, null, 'Subject and description are required'));
  }

  const newTicket = {
    id: `TKT-2026-${String(Math.floor(100 + Math.random() * 900))}`,
    senderName: senderName || 'Parent / Student',
    senderRole: senderRole || 'Parent',
    senderContact: senderContact || '7891008092',
    category: category || 'General',
    subject,
    description,
    priority: priority || 'Medium',
    status: 'Open',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    conversation: [
      {
        id: `msg_${Date.now()}`,
        sender: senderName || 'Parent / Student',
        senderRole: senderRole || 'Parent',
        text: description,
        timestamp: new Date().toISOString()
      }
    ]
  };

  if (!TENANT_FEEDBACK[schoolId]) {
    TENANT_FEEDBACK[schoolId] = [];
  }
  TENANT_FEEDBACK[schoolId].unshift(newTicket);

  return res.status(201).json(
    new ApiResponse(201, newTicket, 'Complaint ticket registered successfully')
  );
});

// POST /api/announcements/feedback/:id/reply
export const replyFeedbackTicket = asyncHandler(async (req, res) => {
  const schoolId = req.schoolId || 'sch_jd_intl';
  const { id } = req.params;
  const { replyText, senderName, senderRole, changeStatus } = req.body;

  if (!replyText || !replyText.trim()) {
    return res.status(400).json(new ApiResponse(400, null, 'Reply message cannot be empty'));
  }

  const list = TENANT_FEEDBACK[schoolId] || [];
  const ticket = list.find(t => t.id === id);

  if (!ticket) {
    return res.status(404).json(new ApiResponse(404, null, 'Ticket not found'));
  }

  const newMsg = {
    id: `msg_${Date.now()}`,
    sender: senderName || 'School Admin',
    senderRole: senderRole || 'Staff',
    text: replyText.trim(),
    timestamp: new Date().toISOString()
  };

  ticket.conversation.push(newMsg);
  ticket.updatedAt = new Date().toISOString();

  if (changeStatus) {
    ticket.status = changeStatus;
  } else if (ticket.status === 'Open') {
    ticket.status = 'In Progress';
  }

  return res.status(200).json(
    new ApiResponse(200, ticket, 'Reply sent successfully')
  );
});

// PATCH /api/announcements/feedback/:id/status
export const updateFeedbackStatus = asyncHandler(async (req, res) => {
  const schoolId = req.schoolId || 'sch_jd_intl';
  const { id } = req.params;
  const { status } = req.body;

  const list = TENANT_FEEDBACK[schoolId] || [];
  const ticket = list.find(t => t.id === id);

  if (!ticket) {
    return res.status(404).json(new ApiResponse(404, null, 'Ticket not found'));
  }

  ticket.status = status;
  ticket.updatedAt = new Date().toISOString();

  return res.status(200).json(
    new ApiResponse(200, ticket, `Ticket status updated to ${status}`)
  );
});
