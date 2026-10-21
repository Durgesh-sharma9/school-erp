import { ApiResponse } from '../../core/utils/apiResponse.js';
import { asyncHandler } from '../../core/utils/asyncHandler.js';

const TENANT_NOTICES = {
  'sch_jd_intl': [
    {
      id: 'not_001',
      title: 'Term 1 Parent-Teacher Meeting (PTM) & Progress Report Distribution',
      category: 'Academic',
      target: 'Parents',
      priority: 'High',
      date: '2026-10-25',
      time: '08:30 AM to 01:00 PM',
      description: 'Dear Parents, the Term 1 PTM will be conducted on Saturday, 25th October 2026. You are cordially requested to visit the school as per your roll number time slot to discuss your child\'s academic growth and receive the Holisitic Progress Card.',
      publishedBy: 'Principal Office',
      attachment: 'PTM_Schedule_Oct2026.pdf',
      isActive: true
    },
    {
      id: 'not_002',
      title: 'CBSE Pre-Board Examination Schedule for Classes X and XII',
      category: 'Exam',
      target: 'Students',
      priority: 'Urgent',
      date: '2026-11-10',
      time: '09:00 AM',
      description: 'The tentative timetable for Pre-Board Examination I (Session 2026-27) has been released. Admit cards will be distributed from 1st November. Clearance of all second-quarter fee dues is required for admit card collection.',
      publishedBy: 'Examination Controller',
      attachment: 'PreBoard_Datesheet_2026.pdf',
      isActive: true
    },
    {
      id: 'not_003',
      title: 'Diwali Festival Break & Vacation Notification',
      category: 'Holiday',
      target: 'All',
      priority: 'Normal',
      date: '2026-10-29',
      time: 'Full Day',
      description: 'The school will remain closed on account of Diwali festivities from Thursday, 29th October to Tuesday, 3rd November 2026. Regular classes will resume on Wednesday, 4th November.',
      publishedBy: 'Administration',
      attachment: null,
      isActive: true
    },
    {
      id: 'not_004',
      title: 'Inter-School Athletics & Sports Meet Registration',
      category: 'Sports',
      target: 'Students',
      priority: 'Normal',
      date: '2026-11-05',
      time: '02:30 PM',
      description: 'Students interested in participating in 100m, 400m sprint, long jump, and relay events are advised to register their names with the Physical Education department by Friday.',
      publishedBy: 'Sports Department',
      attachment: 'Sports_Trial_Entry_Form.pdf',
      isActive: true
    }
  ],
  'sch_dps_branch2': [
    {
      id: 'not_dps_001',
      title: 'Science Exhibition 2026 Guidelines',
      category: 'Academic',
      target: 'All',
      priority: 'Normal',
      date: '2026-11-12',
      time: '10:00 AM',
      description: 'Students from Classes VI to XII can submit working science models.',
      publishedBy: 'Science Club',
      attachment: null,
      isActive: true
    }
  ]
};

export const getNotices = asyncHandler(async (req, res) => {
  const schoolId = req.schoolId || 'sch_jd_intl';
  const notices = TENANT_NOTICES[schoolId] || [];
  const { category, target, search } = req.query;

  let filtered = [...notices];
  if (category && category !== 'All') {
    filtered = filtered.filter(n => n.category.toLowerCase() === category.toLowerCase());
  }
  if (target && target !== 'All') {
    filtered = filtered.filter(n => n.target.toLowerCase() === target.toLowerCase() || n.target === 'All');
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(n => n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q));
  }

  return res.status(200).json(
    new ApiResponse(200, {
      notices: filtered,
      totalCount: filtered.length
    }, 'Notices fetched successfully')
  );
});

export const createNotice = asyncHandler(async (req, res) => {
  const schoolId = req.schoolId || 'sch_jd_intl';
  const { title, category, target, priority, date, time, description, attachment } = req.body;

  if (!title || !description) {
    return res.status(400).json(new ApiResponse(400, null, 'Title and description are required'));
  }

  if (!TENANT_NOTICES[schoolId]) {
    TENANT_NOTICES[schoolId] = [];
  }

  const newNotice = {
    id: `not_${Date.now()}`,
    title,
    category: category || 'General',
    target: target || 'All',
    priority: priority || 'Normal',
    date: date || new Date().toISOString().split('T')[0],
    time: time || 'All Day',
    description,
    publishedBy: req.user?.name || 'School Principal',
    attachment: attachment || null,
    isActive: true,
    createdAt: new Date().toISOString()
  };

  TENANT_NOTICES[schoolId].unshift(newNotice);

  return res.status(201).json(
    new ApiResponse(201, newNotice, 'Notice broadcasted successfully')
  );
});

export const deleteNotice = asyncHandler(async (req, res) => {
  const schoolId = req.schoolId || 'sch_jd_intl';
  const { id } = req.params;

  if (TENANT_NOTICES[schoolId]) {
    TENANT_NOTICES[schoolId] = TENANT_NOTICES[schoolId].filter(n => n.id !== id);
  }

  return res.status(200).json(
    new ApiResponse(200, { id }, 'Notice deleted successfully')
  );
});
