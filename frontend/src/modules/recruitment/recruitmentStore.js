// recruitmentStore.js - Complete Talent Hub & Recruitment State Management for School ERP
// Ported and enhanced from HireHub (School Staff Recruitment OS)

const CANDIDATES_STORAGE_KEY = 'erp_recruitment_candidates';
const OPENINGS_STORAGE_KEY = 'erp_recruitment_openings';
const STAFF_STORAGE_KEY = 'erp_staff_roster';
const SALARY_STRUCTURES_KEY = 'erp_salary_structures';

// Realistic initial seed job openings matching JD International School
const INITIAL_JOB_OPENINGS = [
  {
    id: 'JOB-2026-01',
    title: 'PGT Mathematics (Classes XI & XII)',
    department: 'Teaching',
    role: 'PGT Teacher',
    vacancies: 2,
    minExperience: 3,
    qualifications: 'M.Sc (Mathematics) + B.Ed (Mandatory)',
    salaryRange: '₹35,000 - ₹48,000 / month',
    deadline: '2026-11-20',
    status: 'Active',
    type: 'Full-Time',
    description: 'Responsible for teaching CBSE Grade XI & XII Mathematics curriculum, preparing students for competitive board exams, and leading remedial classes.',
    skills: ['CBSE Curriculum', 'Calculus & Algebra', 'Smart Class Pedagogy', 'Board Exam Prep'],
    applicantCount: 7
  },
  {
    id: 'JOB-2026-02',
    title: 'TGT English & Social Science',
    department: 'Teaching',
    role: 'TGT Teacher',
    vacancies: 3,
    minExperience: 2,
    qualifications: 'M.A / B.A (English) + B.Ed + CTET Qualified',
    salaryRange: '₹28,000 - ₹38,000 / month',
    deadline: '2026-11-25',
    status: 'Active',
    type: 'Full-Time',
    description: 'Teaching middle school classes (VI to X), conducting debate clubs, school editorial team guidance, and interactive language workshops.',
    skills: ['Fluency in English', 'Phonics & Grammar', 'Debate Mentorship', 'Classroom Management'],
    applicantCount: 12
  },
  {
    id: 'JOB-2026-03',
    title: 'PRT Mother Teacher (Primary Classes I-III)',
    department: 'Teaching',
    role: 'PRT Teacher',
    vacancies: 4,
    minExperience: 1,
    qualifications: 'Graduation + D.El.Ed / NTT / B.Ed',
    salaryRange: '₹22,000 - ₹30,000 / month',
    deadline: '2026-11-30',
    status: 'Active',
    type: 'Full-Time',
    description: 'Handling foundational literacy, numeracy, and activity-based learning for lower primary sections. Warm, caring, and student-first mindset.',
    skills: ['Activity Based Learning', 'Storytelling', 'Phonics', 'Child Psychology'],
    applicantCount: 9
  },
  {
    id: 'JOB-2026-04',
    title: 'Senior Physical Education Teacher & Sports Coach',
    department: 'Sports',
    role: 'Sports Coach',
    vacancies: 1,
    minExperience: 2,
    qualifications: 'B.P.Ed / M.P.Ed / NIS Certificate',
    salaryRange: '₹26,000 - ₹36,000 / month',
    deadline: '2026-12-05',
    status: 'Active',
    type: 'Full-Time',
    description: 'Coaching school football, basketball, and athletics teams for CBSE cluster tournaments and managing daily morning drills.',
    skills: ['CBSE Sports Guidelines', 'Athletics Training', 'First Aid', 'Tournament Coordination'],
    applicantCount: 5
  },
  {
    id: 'JOB-2026-05',
    title: 'School Bus Driver (Heavy Vehicle License)',
    department: 'Transport',
    role: 'Bus Driver',
    vacancies: 2,
    minExperience: 4,
    qualifications: 'Valid Commercial HMV Driving License + Clean Record',
    salaryRange: '₹18,000 - ₹24,000 / month',
    deadline: '2026-11-18',
    status: 'Active',
    type: 'Full-Time',
    description: 'Operating school transport bus on assigned Jaipur suburban routes. Punctuality, student safety, and adherence to RTO traffic guidelines required.',
    skills: ['HMV License', 'Route Knowledge (Jaipur)', 'Safe Driving', 'Vehicle Maintenance'],
    applicantCount: 4
  },
  {
    id: 'JOB-2026-06',
    title: 'Senior School Accountant (Tally Prime & ERP)',
    department: 'Administration',
    role: 'Accountant',
    vacancies: 1,
    minExperience: 3,
    qualifications: 'B.Com / M.Com + Tally Prime / GST Certification',
    salaryRange: '₹30,000 - ₹42,000 / month',
    deadline: '2026-11-28',
    status: 'Active',
    type: 'Full-Time',
    description: 'Managing fee collections, bank reconciliations, vendor payables, staff salary payroll computations, and statutory compliance (EPF/ESIC/PT).',
    skills: ['Tally Prime', 'GST & TDS', 'Bank Reconciliation', 'Payroll Calculations'],
    applicantCount: 6
  }
];

// Realistic initial seed candidates
const INITIAL_CANDIDATES = [
  {
    id: 'CAND-2026-001',
    name: 'Vikram Singh Shekhawat',
    gender: 'Male',
    dob: '1991-08-14',
    fatherHusbandName: 'Raghavendra Singh Shekhawat',
    phone: '9829012345',
    whatsapp: '9829012345',
    email: 'vikram.shekhawat91@gmail.com',
    appliedPosition: 'PGT Mathematics (Classes XI & XII)',
    department: 'Teaching',
    subject: 'Mathematics',
    qualification: 'M.Sc (Maths), B.Ed, Rajasthan REET Qualified',
    experienceYears: 6,
    currentEmployer: 'St. Xavier Public School, Mansarovar',
    currentSalary: 38000,
    expectedSalary: 45000,
    noticePeriod: '15 Days',
    address: 'Plot 42, Ganga Sagar Colony, Vaishali Nagar',
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: '302021',
    status: 'interview_scheduled',
    rating: 4.5,
    source: 'Online Portal',
    appliedDate: '2026-11-01',
    interviewDate: '2026-11-06',
    interviewTime: '11:00 AM',
    interviewLocation: 'Principal Conference Room / Google Meet',
    interviewerNotes: 'Impressive demonstration on Integral Calculus during pre-screening. Strong CBSE experience with Grade 12 students. Good communication skills.',
    bEdCompleted: true,
    ctetQualified: true,
    resumeUrl: '#',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'CAND-2026-002',
    name: 'Pooja Sharma',
    gender: 'Female',
    dob: '1994-03-22',
    fatherHusbandName: 'Deepak Sharma',
    phone: '9414088921',
    whatsapp: '9414088921',
    email: 'pooja.sharma.edu@gmail.com',
    appliedPosition: 'TGT English & Social Science',
    department: 'Teaching',
    subject: 'English',
    qualification: 'M.A (English Literature), B.Ed, CTET Paper II',
    experienceYears: 4,
    currentEmployer: 'Ryan International Academy, Ajmer Road',
    currentSalary: 28000,
    expectedSalary: 34000,
    noticePeriod: 'Immediate',
    address: 'B-14, Tagore Lane, C-Scheme',
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: '302001',
    status: 'demo_class',
    rating: 5,
    source: 'Walk-in / QR',
    appliedDate: '2026-10-29',
    interviewDate: '2026-11-05',
    interviewTime: '10:30 AM',
    interviewLocation: 'Classroom IX-B (Demo Class with students)',
    interviewerNotes: 'Excellent command over spoken English and active phonetics. Demo class scheduled for Class 9 English Poetry.',
    bEdCompleted: true,
    ctetQualified: true,
    resumeUrl: '#',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'CAND-2026-003',
    name: 'Anjali Verma',
    gender: 'Female',
    dob: '1998-11-05',
    fatherHusbandName: 'Manoj Verma',
    phone: '9887711223',
    whatsapp: '9887711223',
    email: 'anjali.verma.prt@gmail.com',
    appliedPosition: 'PRT Mother Teacher (Primary Classes I-III)',
    department: 'Teaching',
    subject: 'General Primary / English & EVS',
    qualification: 'B.Sc (Home Science), D.El.Ed, NTT Diploma',
    experienceYears: 2,
    currentEmployer: 'EuroKids Preschool, Chitrakoot',
    currentSalary: 19000,
    expectedSalary: 24000,
    noticePeriod: '1 Month',
    address: 'Flat 301, Royal Enclave, Nirman Nagar',
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: '302019',
    status: 'shortlisted',
    rating: 4,
    source: 'Online Portal',
    appliedDate: '2026-11-02',
    interviewDate: '',
    interviewTime: '',
    interviewLocation: '',
    interviewerNotes: 'Strong creative flair with origami and activity-based learning. Shortlisted for round 1 HR interview.',
    bEdCompleted: false,
    ctetQualified: false,
    resumeUrl: '#',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'CAND-2026-004',
    name: 'Rajendra Kumar Yadav',
    gender: 'Male',
    dob: '1988-06-19',
    fatherHusbandName: 'Sohan Lal Yadav',
    phone: '9783144556',
    whatsapp: '9783144556',
    email: 'rajendra.yadav.driver@gmail.com',
    appliedPosition: 'School Bus Driver (Heavy Vehicle License)',
    department: 'Transport',
    subject: 'Commercial Driving',
    qualification: 'Secondary (10th Pass) + Commercial HMV Badge',
    experienceYears: 8,
    currentEmployer: 'Delhi Public School Transport Dept',
    currentSalary: 18000,
    expectedSalary: 22000,
    noticePeriod: 'Immediate',
    address: 'Village Bhankrota, NH-8',
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: '302026',
    status: 'hired',
    rating: 4.8,
    source: 'Referral',
    appliedDate: '2026-10-25',
    interviewDate: '2026-10-28',
    interviewTime: '02:00 PM',
    interviewLocation: 'Transport In-charge Office',
    interviewerNotes: 'Clean track record, medical and eye fitness certificate verified. Verified 8 years of school bus driving experience. Hired for Route 4.',
    bEdCompleted: false,
    ctetQualified: false,
    resumeUrl: '#',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'CAND-2026-005',
    name: 'Gaurav Khandelwal',
    gender: 'Male',
    dob: '1993-01-12',
    fatherHusbandName: 'Ram Avatar Khandelwal',
    phone: '9928133445',
    whatsapp: '9928133445',
    email: 'gaurav.khandelwal.ca@gmail.com',
    appliedPosition: 'Senior School Accountant (Tally Prime & ERP)',
    department: 'Administration',
    subject: 'Finance & Accounts',
    qualification: 'M.Com, Certified Tally Prime Professional, CA Inter',
    experienceYears: 5,
    currentEmployer: 'Apex Group of Colleges, Mansarovar',
    currentSalary: 32000,
    expectedSalary: 38000,
    noticePeriod: '30 Days',
    address: 'House 18, Mahaveer Nagar, Tonk Road',
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: '302018',
    status: 'offered',
    rating: 4.7,
    source: 'Online Portal',
    appliedDate: '2026-10-27',
    interviewDate: '2026-11-01',
    interviewTime: '03:30 PM',
    interviewLocation: 'Director Chamber',
    interviewerNotes: 'Clear understanding of school fee structures, concession accounting, and PF/ESIC compliances. Formal offer letter generated at ₹36,500/month.',
    bEdCompleted: false,
    ctetQualified: false,
    resumeUrl: '#',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'CAND-2026-006',
    name: 'Sunita Meena',
    gender: 'Female',
    dob: '1996-09-30',
    fatherHusbandName: 'Kailash Chand Meena',
    phone: '9660255881',
    whatsapp: '9660255881',
    email: 'sunita.meena.sports@gmail.com',
    appliedPosition: 'Senior Physical Education Teacher & Sports Coach',
    department: 'Sports',
    subject: 'Athletics & Basketball',
    qualification: 'B.P.Ed, National Level Basketball Player, CPR Certified',
    experienceYears: 3,
    currentEmployer: 'Kendriya Vidyalaya No. 1, Bajaj Nagar',
    currentSalary: 24000,
    expectedSalary: 30000,
    noticePeriod: '15 Days',
    address: 'Quarters 5-B, Malviya Nagar',
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: '302017',
    status: 'new',
    rating: 4,
    source: 'Direct Walk-in',
    appliedDate: '2026-11-04',
    interviewDate: '',
    interviewTime: '',
    interviewLocation: '',
    interviewerNotes: 'New walk-in application submitted at school reception desk today. Documents verified by HR.',
    bEdCompleted: false,
    ctetQualified: false,
    resumeUrl: '#',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  }
];

export const PIPELINE_STAGES = [
  { id: 'all', label: 'All Candidates', badge: 'bg-slate-100 text-slate-700' },
  { id: 'new', label: 'New Applied', badge: 'bg-blue-100 text-blue-700 border-blue-200' },
  { id: 'shortlisted', label: 'Shortlisted', badge: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  { id: 'interview_scheduled', label: 'Interview Scheduled', badge: 'bg-amber-100 text-amber-700 border-amber-200' },
  { id: 'demo_class', label: 'Demo Class', badge: 'bg-purple-100 text-purple-700 border-purple-200' },
  { id: 'offered', label: 'Offer Extended', badge: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200' },
  { id: 'hired', label: 'Hired & Onboarded', badge: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold' },
  { id: 'rejected', label: 'Rejected', badge: 'bg-rose-100 text-rose-700 border-rose-200' }
];

export const recruitmentStore = {
  // Candidate Operations
  getCandidates: (filterCriteria = {}) => {
    try {
      const stored = localStorage.getItem(CANDIDATES_STORAGE_KEY);
      let list = stored ? JSON.parse(stored) : INITIAL_CANDIDATES;
      if (!stored) {
        localStorage.setItem(CANDIDATES_STORAGE_KEY, JSON.stringify(INITIAL_CANDIDATES));
      }

      if (filterCriteria.status && filterCriteria.status !== 'all') {
        list = list.filter(c => c.status === filterCriteria.status);
      }
      if (filterCriteria.department && filterCriteria.department !== 'all') {
        list = list.filter(c => c.department === filterCriteria.department);
      }
      if (filterCriteria.search) {
        const q = filterCriteria.search.toLowerCase().trim();
        list = list.filter(c =>
          c.name.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.appliedPosition.toLowerCase().includes(q) ||
          (c.qualification && c.qualification.toLowerCase().includes(q))
        );
      }
      if (filterCriteria.minExp) {
        const exp = Number(filterCriteria.minExp);
        list = list.filter(c => (c.experienceYears || 0) >= exp);
      }
      return list;
    } catch (err) {
      console.error('Error fetching candidates:', err);
      return INITIAL_CANDIDATES;
    }
  },

  getCandidateById: (id) => {
    const list = recruitmentStore.getCandidates();
    return list.find(c => c.id === id) || null;
  },

  createCandidate: (candidateData) => {
    const list = recruitmentStore.getCandidates();
    const newId = `CAND-${new Date().getFullYear()}-${String(list.length + 1).padStart(3, '0')}`;
    const newCandidate = {
      id: newId,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'new',
      rating: 0,
      interviewerNotes: '',
      ...candidateData
    };
    const updated = [newCandidate, ...list];
    localStorage.setItem(CANDIDATES_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('recruitment_updated'));
    return newCandidate;
  },

  updateCandidate: (id, updates) => {
    const list = recruitmentStore.getCandidates();
    const index = list.findIndex(c => c.id === id);
    if (index === -1) return null;

    list[index] = { ...list[index], ...updates };
    localStorage.setItem(CANDIDATES_STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event('recruitment_updated'));
    return list[index];
  },

  deleteCandidate: (id) => {
    const list = recruitmentStore.getCandidates();
    const updated = list.filter(c => c.id !== id);
    localStorage.setItem(CANDIDATES_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('recruitment_updated'));
    return true;
  },

  // 1-Click Hire: Converts candidate into School ERP Staff Roster and initializes their Salary Structure
  hireCandidateToStaff: (candidateId, hireConfig = {}) => {
    const candidate = recruitmentStore.getCandidateById(candidateId);
    if (!candidate) throw new Error('Candidate not found');

    // 1. Mark candidate status as 'hired'
    recruitmentStore.updateCandidate(candidateId, {
      status: 'hired',
      hiredAt: new Date().toISOString(),
      ...hireConfig
    });

    // 2. Fetch existing staff roster
    let staffList = [];
    try {
      const stored = localStorage.getItem(STAFF_STORAGE_KEY);
      staffList = stored ? JSON.parse(stored) : [];
    } catch (e) {
      staffList = [];
    }

    // Check if staff already exists with same phone or email
    const exists = staffList.find(s => s.phone === candidate.phone || (s.email && s.email === candidate.email));
    let staffId = exists ? exists.id : null;

    if (!exists) {
      staffId = `STAFF-${new Date().getFullYear()}-${String(staffList.length + 1).padStart(3, '0')}`;
      const newStaff = {
        id: staffId,
        staffCode: staffId,
        name: candidate.name,
        gender: candidate.gender || 'Other',
        dob: candidate.dob || '1995-01-01',
        fatherHusbandName: candidate.fatherHusbandName || '',
        phone: candidate.phone,
        email: candidate.email,
        address: candidate.address || '',
        city: candidate.city || 'Jaipur',
        state: candidate.state || 'Rajasthan',
        pincode: candidate.pincode || '302001',
        department: candidate.department || 'Teaching',
        designation: candidate.appliedPosition || 'Teacher',
        qualification: candidate.qualification || '',
        experience: `${candidate.experienceYears || 0} Years`,
        joiningDate: new Date().toISOString().split('T')[0],
        status: 'Active',
        role: 'Staff',
        recruitedVia: 'HireHub Recruitment OS',
        photo: candidate.photoUrl || ''
      };
      staffList.push(newStaff);
      localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(staffList));
    }

    // 3. Initialize Salary Structure in erp_salary_structures
    let salaryStructures = [];
    try {
      const storedSalary = localStorage.getItem(SALARY_STRUCTURES_KEY);
      salaryStructures = storedSalary ? JSON.parse(storedSalary) : [];
    } catch (e) {
      salaryStructures = [];
    }

    const monthlyCtc = Number(hireConfig.finalSalary || candidate.expectedSalary || 30000);
    const basic = Math.round(monthlyCtc * 0.50);
    const hra = Math.round(monthlyCtc * 0.20);
    const da = Math.round(monthlyCtc * 0.10);
    const specialAllowance = Math.max(0, monthlyCtc - (basic + hra + da));

    const existingStructureIndex = salaryStructures.findIndex(s => s.staffId === staffId || s.staffName === candidate.name);
    const structureData = {
      staffId: staffId,
      staffName: candidate.name,
      designation: candidate.appliedPosition,
      department: candidate.department,
      grossMonthly: monthlyCtc,
      annualCtc: monthlyCtc * 12,
      basic: basic,
      hra: hra,
      da: da,
      specialAllowance: specialAllowance,
      epfApplicable: true,
      esicApplicable: monthlyCtc <= 21000,
      ptApplicable: true,
      effectiveFrom: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString()
    };

    if (existingStructureIndex >= 0) {
      salaryStructures[existingStructureIndex] = structureData;
    } else {
      salaryStructures.push(structureData);
    }
    localStorage.setItem(SALARY_STRUCTURES_KEY, JSON.stringify(salaryStructures));

    window.dispatchEvent(new Event('staff_roster_updated'));
    window.dispatchEvent(new Event('salary_structures_updated'));

    return {
      success: true,
      staffId,
      staffName: candidate.name,
      monthlyCtc,
      message: `${candidate.name} has been successfully hired and ported to Staff Roster!`
    };
  },

  // Job Openings Operations
  getJobOpenings: () => {
    try {
      const stored = localStorage.getItem(OPENINGS_STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(OPENINGS_STORAGE_KEY, JSON.stringify(INITIAL_JOB_OPENINGS));
        return INITIAL_JOB_OPENINGS;
      }
      return JSON.parse(stored);
    } catch (e) {
      return INITIAL_JOB_OPENINGS;
    }
  },

  getJobOpeningById: (id) => {
    const list = recruitmentStore.getJobOpenings();
    return list.find(j => j.id === id) || null;
  },

  createJobOpening: (openingData) => {
    const list = recruitmentStore.getJobOpenings();
    const newOpening = {
      id: `JOB-${new Date().getFullYear()}-${String(list.length + 1).padStart(2, '0')}`,
      status: 'Active',
      applicantCount: 0,
      createdAt: new Date().toISOString(),
      ...openingData
    };
    const updated = [newOpening, ...list];
    localStorage.setItem(OPENINGS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('recruitment_openings_updated'));
    return newOpening;
  },

  updateJobOpening: (id, updates) => {
    const list = recruitmentStore.getJobOpenings();
    const index = list.findIndex(j => j.id === id);
    if (index === -1) return null;

    list[index] = { ...list[index], ...updates };
    localStorage.setItem(OPENINGS_STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event('recruitment_openings_updated'));
    return list[index];
  },

  deleteJobOpening: (id) => {
    const list = recruitmentStore.getJobOpenings();
    const updated = list.filter(j => j.id !== id);
    localStorage.setItem(OPENINGS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('recruitment_openings_updated'));
    return true;
  },

  // Analytics Metrics
  getRecruitmentStats: () => {
    const candidates = recruitmentStore.getCandidates();
    const openings = recruitmentStore.getJobOpenings();

    const totalApplicants = candidates.length;
    const shortlisted = candidates.filter(c => c.status === 'shortlisted').length;
    const interviewsScheduled = candidates.filter(c => c.status === 'interview_scheduled' || c.status === 'demo_class').length;
    const hired = candidates.filter(c => c.status === 'hired').length;
    const offered = candidates.filter(c => c.status === 'offered').length;
    const newApplied = candidates.filter(c => c.status === 'new').length;
    const activeOpenings = openings.filter(o => o.status === 'Active').length;

    return {
      totalApplicants,
      shortlisted,
      interviewsScheduled,
      hired,
      offered,
      newApplied,
      activeOpenings,
      openingsCount: openings.length
    };
  }
};
