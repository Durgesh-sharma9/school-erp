import { ApiResponse } from '../../core/utils/apiResponse.js';
import { asyncHandler } from '../../core/utils/asyncHandler.js';

// Default Period Slots (Indian School Pattern)
export const PERIOD_SLOTS = [
  { period: 1, time: '08:00 AM - 08:45 AM', label: 'Period 1' },
  { period: 2, time: '08:45 AM - 09:30 AM', label: 'Period 2' },
  { period: 3, time: '09:30 AM - 10:15 AM', label: 'Period 3' },
  { period: 4, time: '10:15 AM - 11:00 AM', label: 'Period 4' },
  { period: 'Break', time: '11:00 AM - 11:30 AM', label: 'Recess / Lunch' },
  { period: 5, time: '11:30 AM - 12:15 PM', label: 'Period 5' },
  { period: 6, time: '12:15 PM - 01:00 PM', label: 'Period 6' },
  { period: 7, time: '01:00 PM - 01:45 PM', label: 'Period 7' },
  { period: 8, time: '01:45 PM - 02:30 PM', label: 'Period 8' }
];

// Pre-seeded Class Timetables
const CLASS_TIMETABLES = {
  'X-A': {
    Monday: [
      { period: 1, subject: 'Mathematics', teacher: 'R. K. Sharma', room: 'Room 204' },
      { period: 2, subject: 'Physics', teacher: 'Dr. Suresh Sen', room: 'Physics Lab' },
      { period: 3, subject: 'English Core', teacher: 'Priti Verma', room: 'Room 204' },
      { period: 4, subject: 'Chemistry', teacher: 'Meenakshi Joshi', room: 'Chem Lab' },
      { period: 5, subject: 'Computer Science', teacher: 'Amit Saxena', room: 'CS Lab 1' },
      { period: 6, subject: 'Social Studies', teacher: 'Pooja Kanwar', room: 'Room 204' },
      { period: 7, subject: 'Hindi Literature', teacher: 'Kavita Sharma', room: 'Room 204' },
      { period: 8, subject: 'Physical Education', teacher: 'Vikram Singh', room: 'Playground' }
    ],
    Tuesday: [
      { period: 1, subject: 'English Core', teacher: 'Priti Verma', room: 'Room 204' },
      { period: 2, subject: 'Mathematics', teacher: 'R. K. Sharma', room: 'Room 204' },
      { period: 3, subject: 'Biology', teacher: 'Dr. Suresh Sen', room: 'Bio Lab' },
      { period: 4, subject: 'Chemistry', teacher: 'Meenakshi Joshi', room: 'Chem Lab' },
      { period: 5, subject: 'Hindi Literature', teacher: 'Kavita Sharma', room: 'Room 204' },
      { period: 6, subject: 'Computer Science', teacher: 'Amit Saxena', room: 'CS Lab 1' },
      { period: 7, subject: 'Social Studies', teacher: 'Pooja Kanwar', room: 'Room 204' },
      { period: 8, subject: 'Library / Reading', teacher: 'Sunita Meena', room: 'Main Library' }
    ],
    Wednesday: [
      { period: 1, subject: 'Mathematics', teacher: 'R. K. Sharma', room: 'Room 204' },
      { period: 2, subject: 'Physics', teacher: 'Dr. Suresh Sen', room: 'Physics Lab' },
      { period: 3, subject: 'English Core', teacher: 'Priti Verma', room: 'Room 204' },
      { period: 4, subject: 'Chemistry', teacher: 'Meenakshi Joshi', room: 'Chem Lab' },
      { period: 5, subject: 'Social Studies', teacher: 'Pooja Kanwar', room: 'Room 204' },
      { period: 6, subject: 'Mathematics', teacher: 'R. K. Sharma', room: 'Room 204' },
      { period: 7, subject: 'Art & Craft', teacher: 'Neetu Rathore', room: 'Art Studio' },
      { period: 8, subject: 'Sports', teacher: 'Vikram Singh', room: 'Playground' }
    ],
    Thursday: [
      { period: 1, subject: 'Physics', teacher: 'Dr. Suresh Sen', room: 'Room 204' },
      { period: 2, subject: 'Mathematics', teacher: 'R. K. Sharma', room: 'Room 204' },
      { period: 3, subject: 'Hindi Literature', teacher: 'Kavita Sharma', room: 'Room 204' },
      { period: 4, subject: 'English Core', teacher: 'Priti Verma', room: 'Room 204' },
      { period: 5, subject: 'Computer Science', teacher: 'Amit Saxena', room: 'CS Lab 1' },
      { period: 6, subject: 'Chemistry', teacher: 'Meenakshi Joshi', room: 'Chem Lab' },
      { period: 7, subject: 'Social Studies', teacher: 'Pooja Kanwar', room: 'Room 204' },
      { period: 8, subject: 'Music & Dance', teacher: 'Ananya Roy', room: 'Music Room' }
    ],
    Friday: [
      { period: 1, subject: 'Mathematics', teacher: 'R. K. Sharma', room: 'Room 204' },
      { period: 2, subject: 'Chemistry', teacher: 'Meenakshi Joshi', room: 'Chem Lab' },
      { period: 3, subject: 'Physics', teacher: 'Dr. Suresh Sen', room: 'Physics Lab' },
      { period: 4, subject: 'English Core', teacher: 'Priti Verma', room: 'Room 204' },
      { period: 5, subject: 'Social Studies', teacher: 'Pooja Kanwar', room: 'Room 204' },
      { period: 6, subject: 'Hindi Literature', teacher: 'Kavita Sharma', room: 'Room 204' },
      { period: 7, subject: 'Environmental Studies', teacher: 'Dr. Suresh Sen', room: 'Room 204' },
      { period: 8, subject: 'Clubs / Activities', teacher: 'Priti Verma', room: 'Auditorium' }
    ],
    Saturday: [
      { period: 1, subject: 'Mathematics Quiz', teacher: 'R. K. Sharma', room: 'Room 204' },
      { period: 2, subject: 'Science Practical', teacher: 'Dr. Suresh Sen', room: 'Physics Lab' },
      { period: 3, subject: 'English Debate', teacher: 'Priti Verma', room: 'Room 204' },
      { period: 4, subject: 'Sports Tournament', teacher: 'Vikram Singh', room: 'Playground' }
    ]
  }
};

// Substitutions State
let ACTIVE_SUBSTITUTIONS = [
  {
    id: 'sub_001',
    date: '2026-10-21',
    absentTeacher: 'Dr. Suresh Sen',
    reason: 'Casual Leave (Approved)',
    period: 2,
    time: '08:45 AM - 09:30 AM',
    class: 'Class X-A',
    subject: 'Physics',
    assignedSubstitute: 'Amit Saxena',
    status: 'Assigned',
    notifiedAt: '2026-10-21 07:45 AM'
  }
];

export const getClassTimetable = asyncHandler(async (req, res) => {
  const className = req.query.className || 'X';
  const section = req.query.section || 'A';
  const key = `${className}-${section}`;

  const schedule = CLASS_TIMETABLES[key] || CLASS_TIMETABLES['X-A'];

  return res.status(200).json(
    new ApiResponse(200, {
      className,
      section,
      periodSlots: PERIOD_SLOTS,
      schedule
    }, 'Timetable fetched successfully')
  );
});

export const getTeacherSubstitutions = asyncHandler(async (req, res) => {
  const date = req.query.date || new Date().toISOString().split('T')[0];

  // Absent teachers demo for today
  const absentTeachers = [
    {
      id: 'emp_sen',
      name: 'Dr. Suresh Sen',
      code: 'EMP-104',
      department: 'Science',
      leaveType: 'Casual Leave',
      affectedPeriods: [
        { period: 2, time: '08:45 AM - 09:30 AM', class: 'Class X-A', subject: 'Physics' },
        { period: 3, time: '09:30 AM - 10:15 AM', class: 'Class IX-B', subject: 'General Science' },
        { period: 7, time: '01:00 PM - 01:45 PM', class: 'Class VIII-A', subject: 'Environmental Studies' }
      ]
    }
  ];

  // Available free teachers who can take substitutions
  const freeTeachers = [
    { id: 'emp_amit', name: 'Amit Saxena', department: 'Computer Science', freePeriods: [2, 4, 7] },
    { id: 'emp_vikram', name: 'Vikram Singh', department: 'Physical Education', freePeriods: [1, 2, 3, 5] },
    { id: 'emp_kavita', name: 'Kavita Sharma', department: 'Hindi', freePeriods: [3, 4, 6] },
    { id: 'emp_pooja', name: 'Pooja Kanwar', department: 'Social Science', freePeriods: [1, 3, 7] }
  ];

  return res.status(200).json(
    new ApiResponse(200, {
      date,
      absentTeachers,
      freeTeachers,
      activeSubstitutions: ACTIVE_SUBSTITUTIONS
    }, 'Substitutions data fetched successfully')
  );
});

export const assignSubstitution = asyncHandler(async (req, res) => {
  const { absentTeacher, period, time, className, subject, assignedSubstitute } = req.body;

  if (!absentTeacher || !assignedSubstitute || !period) {
    return res.status(400).json(new ApiResponse(400, null, 'All substitution parameters are required'));
  }

  const newSub = {
    id: `sub_${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    absentTeacher,
    period,
    time: time || 'During period slot',
    class: className || 'General',
    subject: subject || 'Substitution Class',
    assignedSubstitute,
    status: 'Assigned',
    notifiedAt: new Date().toLocaleTimeString()
  };

  ACTIVE_SUBSTITUTIONS.unshift(newSub);

  return res.status(201).json(
    new ApiResponse(201, newSub, 'Substitute teacher assigned successfully and notification sent')
  );
});
