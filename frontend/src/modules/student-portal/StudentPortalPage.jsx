import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  BookOpen,
  CreditCard,
  Calendar,
  FileText,
  Award,
  BookMarked,
  Contact,
  Ticket,
  DoorOpen,
  Bus,
  ClipboardCheck,
  Bell,
  Cake,
  Download,
  CheckCircle2,
  Clock,
  ChevronRight,
  ChevronsLeft,
  ArrowLeft,
  Printer,
  FileCheck,
  AlertCircle,
  Video,
  FileSpreadsheet,
  FileEdit,
  Landmark,
  Receipt,
  CalendarCheck,
  CalendarDays,
  Mail,
  MessageSquare,
  HelpCircle,
  GraduationCap,
  FolderHeart,
  Users,
  Newspaper,
  Image,
  Share2,
  ExternalLink,
  Check,
  X,
  Upload,
  User,
  Phone,
  MapPin,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  Search,
  Eye,
  Send,
  Volume2,
  Camera,
  Filter,
  Shield,
  Heart,
  Smile,
  CheckCircle,
  IndianRupee,
  Navigation
} from 'lucide-react';
import toast from 'react-hot-toast';

export function StudentPortalPage({ onNavigate, currentPath }) {
  const { user, schoolName } = useAuth();

  // Active view: null (dashboard) or route identifier
  const [activeView, setActiveView] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('October 2026');
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Month-wise Fees State (1:1 with Live UAB /get-fee)
  const [monthWiseFees, setMonthWiseFees] = useState([
    { month: 'Apr', label: 'April 2026 (Admission + Term 1)', amt: 7825, paid: 0, due: 7825, status: 'Due' },
    { month: 'May', label: 'May 2026', amt: 0, paid: 0, due: 0, status: 'N/A' },
    { month: 'Jun', label: 'June 2026', amt: 0, paid: 0, due: 0, status: 'N/A' },
    { month: 'Jul', label: 'July 2026 (Term 2 Tuition)', amt: 4625, paid: 0, due: 4625, status: 'Due' },
    { month: 'Aug', label: 'August 2026', amt: 0, paid: 0, due: 0, status: 'N/A' },
    { month: 'Sep', label: 'September 2026', amt: 0, paid: 0, due: 0, status: 'N/A' },
    { month: 'Oct', label: 'October 2026 (Term 3 Tuition)', amt: 4625, paid: 0, due: 4625, status: 'Due' },
    { month: 'Nov', label: 'November 2026', amt: 0, paid: 0, due: 0, status: 'N/A' },
    { month: 'Dec', label: 'December 2026', amt: 0, paid: 0, due: 0, status: 'N/A' },
    { month: 'Jan', label: 'January 2027 (Term 4 Tuition)', amt: 4625, paid: 0, due: 4625, status: 'Due' },
    { month: 'Feb', label: 'February 2027', amt: 0, paid: 0, due: 0, status: 'N/A' },
    { month: 'Mar', label: 'March 2027', amt: 0, paid: 0, due: 0, status: 'N/A' }
  ]);

  // Payment Gateway Modal State
  const [paymentGatewayOpen, setPaymentGatewayOpen] = useState(false);
  const [payingItem, setPayingItem] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [upiId, setUpiId] = useState('6377281034@upi');
  const [cardDetails, setCardDetails] = useState({ number: '4532 •••• •••• 9012', exp: '08/29', cvv: '•••' });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Fee Receipts History State
  const [feeReceipts, setFeeReceipts] = useState([
    { receiptNo: 'JDIS/2026/0892', date: '10-Apr-2026', head: 'Term 1 Tuition + Admission', amount: 7825, mode: 'UPI / Online', status: 'Success' },
    { receiptNo: 'JDIS/2026/1420', date: '08-Jul-2026', head: 'Term 2 Tuition + Smart Class', amount: 4625, mode: 'Net Banking', status: 'Success' }
  ]);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Homework State
  const [homeworkDateFilter, setHomeworkDateFilter] = useState('');
  const [homeworkStatus, setHomeworkStatus] = useState({
    1: 'Submitted',
    2: 'Pending',
    3: 'Submitted',
    4: 'Pending'
  });
  const [submitHwModal, setSubmitHwModal] = useState(null);
  const [hwRemarks, setHwRemarks] = useState('');

  // Leave Request State
  const [leaveForm, setLeaveForm] = useState({ type: 'Sick Leave', from: '2026-10-18', to: '2026-10-19', reason: '' });
  const [leaveHistory, setLeaveHistory] = useState([
    { id: 1, type: 'Sick Leave', from: '02-Aug-2026', to: '03-Aug-2026', reason: 'Viral fever & doctor rest advice', status: 'Approved', teacherRemark: 'Granted. Take care!' },
    { id: 2, type: 'Casual Leave', from: '12-Sep-2026', to: '12-Sep-2026', reason: 'Family religious ceremony in village', status: 'Approved', teacherRemark: 'Approved by Class Teacher.' }
  ]);

  // Gate Pass State
  const [gatePasses, setGatePasses] = useState([
    { id: 1, passNo: 'GP-2026-081', date: '09-Oct-2026', exitTime: '12:30 PM', escort: 'Om Prakash Jat (Father)', reason: 'Pediatric dental clinic appointment', status: 'Approved & Exited' },
    { id: 2, passNo: 'GP-2026-042', date: '16-Aug-2026', exitTime: '01:15 PM', escort: 'Kiran Jat (Mother)', reason: 'Child having slight headache', status: 'Approved & Exited' }
  ]);
  const [gatePassForm, setGatePassForm] = useState({ escort: 'Om Prakash Jat (Father)', exitTime: '12:00 PM', reason: '', contact: '6377281034' });
  const [showGatePassModal, setShowGatePassModal] = useState(false);

  // Complaints / Grievances State
  const [complaints, setComplaints] = useState([
    { id: 'TKT-8912', category: 'Bus / Transport', subject: 'Morning bus arrived 10 mins early at Mahapura stop', date: '04-Oct-2026', status: 'Resolved', adminReply: 'Transport supervisor instructed driver Ramphal to strictly adhere to 07:45 AM scheduled time.' },
    { id: 'TKT-7820', category: 'Academics', subject: 'Cursive writing notebook correction pending', date: '21-Sep-2026', status: 'Resolved', adminReply: 'Checked with teacher Sunita Kumari. All notebooks verified and returned.' }
  ]);
  const [complaintForm, setComplaintForm] = useState({ category: 'Bus / Transport', subject: '', desc: '', priority: 'Normal' });

  // Voice SMS Player State
  const [playingVoiceId, setPlayingVoiceId] = useState(null);

  // Filter States
  const [syllabusSubject, setSyllabusSubject] = useState('English');
  const [studyMaterialFilter, setStudyMaterialFilter] = useState('All');
  const [batchmateSearch, setBatchmateSearch] = useState('');
  const [galleryAlbum, setGalleryAlbum] = useState('Annual Day 2026');
  const [commTab, setCommTab] = useState('notifications');

  // Synchronize route paths with active student full page views
  useEffect(() => {
    if (!currentPath || currentPath === '/' || currentPath === '/dashboard' || currentPath === '/student-portal') {
      setActiveView(null);
    } else if (currentPath === '/get-homework' || currentPath === '/homework') {
      setActiveView('homework');
    } else if (currentPath === '/get-fee' || currentPath === '/822' || currentPath === '/pay-fee') {
      setActiveView('fee');
    } else if (currentPath === '/get-fee-receipt') {
      setActiveView('fee-receipt');
    } else if (currentPath === '/get-datesheet') {
      setActiveView('datesheet');
    } else if (currentPath === '/student-admit-card') {
      setActiveView('admit-card');
    } else if (currentPath === '/get-result') {
      setActiveView('result');
    } else if (currentPath === '/get-attendance') {
      setActiveView('attendance');
    } else if (currentPath === '/leave-request') {
      setActiveView('leave-request');
    } else if (currentPath === '/get-gate-pass') {
      setActiveView('gate-pass');
    } else if (currentPath === '/profile') {
      setActiveView('profile');
    } else if (currentPath === '/student-id-card') {
      setActiveView('id-card');
    } else if (currentPath === '/get-transport') {
      setActiveView('transport');
    } else if (currentPath === '/get-circular') {
      setActiveView('circular');
    } else if (currentPath === '/get-online-classes') {
      setActiveView('online-classes');
    } else if (currentPath === '/get-syllabus') {
      setActiveView('syllabus');
    } else if (currentPath === '/get-study-material') {
      setActiveView('study-material');
    } else if (currentPath === '/get-assignment') {
      setActiveView('assignment');
    } else if (currentPath === '/get-sms') {
      setActiveView('notifications');
      setCommTab('sms');
    } else if (currentPath === '/all-notifications') {
      setActiveView('notifications');
      setCommTab('notifications');
    } else if (currentPath === '/get-voice-sms') {
      setActiveView('notifications');
      setCommTab('voice');
    } else if (currentPath === '/get-complaint') {
      setActiveView('complaint');
    } else if (currentPath === '/get-calendar-planing') {
      setActiveView('calendar-planning');
    } else if (currentPath === '/student-birthday' || currentPath === '/get-birthday') {
      setActiveView('birthday');
    } else if (currentPath === '/get-batch-mate') {
      setActiveView('batchmate');
    } else if (currentPath === '/get-news') {
      setActiveView('news');
    } else if (currentPath === '/get-gallary') {
      setActiveView('gallery');
    } else if (currentPath === '/get-social-media') {
      setActiveView('social-media');
    }
  }, [currentPath]);

  const closeModal = () => {
    setActiveView(null);
    if (onNavigate) {
      onNavigate('/dashboard');
    }
  };

  const navigateTo = (path, viewId) => {
    setActiveView(viewId);
    if (onNavigate) onNavigate(path);
  };

  // Fee calculation
  const totalFeesAmount = 21700;
  const currentPaidAmount = monthWiseFees.reduce((acc, m) => acc + (m.paid || 0), 0);
  const currentDueAmount = monthWiseFees.reduce((acc, m) => acc + (m.due || 0), 0);
  const isAllPaid = currentDueAmount === 0;

  // Authentic Student Metadata (1:1 with UAB production student 6377281034)
  const student = {
    name: user?.name || 'AADHYA CHOUDHARY',
    className: user?.className || 'Nursery - PP3+',
    division: user?.division || 'A',
    srNo: user?.srNo || '2059',
    rollNo: user?.rollNo || '14',
    admDate: '01-04-2026',
    fatherName: user?.fatherName || 'OM PRAKASH JAT',
    motherName: user?.motherName || 'KIRAN JAT',
    contactNo: user?.contactNo || '6377281034',
    dob: user?.dob || '2022-12-20',
    gender: user?.gender || 'Female',
    bloodGroup: user?.bloodGroup || 'O+',
    address: user?.address || 'Mahapura, Ajmer Road, Jaipur, Rajasthan - 302026',
    schoolName: user?.schoolName || schoolName || 'J D International School',
    schoolCode: user?.schoolCode || '10964',
    afflNo: '1730619',
    sessionId: '2026-2027',
    attendancePercent: 92,
    presentDays: 23,
    absentDays: 2,
    todayStatus: 'Ab',
    totalWorkingDays: 25,
    feeStatus: isAllPaid ? 'Paid' : 'Due',
    totalFees: totalFeesAmount,
    paidFees: currentPaidAmount,
    dueFees: currentDueAmount,
    avatar: user?.avatar || 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=150',
    schoolLogo: '/logo.svg'
  };

  // Sibling switcher data
  const [activeSiblingId, setActiveSiblingId] = useState('822');
  const siblings = [
    { id: '822', name: 'Aadhya Choudhary', class: 'Nursery - PP3+', avatar: student.avatar },
    { id: '823', name: 'Vivaan Choudhary', class: 'Class 2-B', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' }
  ];

  // Homework items
  const homeworkList = [
    { id: 1, subject: 'English', title: 'Alphabet cursive writing pages 12-14', dueDate: '18-Oct-2026', teacher: 'Sunita Kumari', desc: 'Complete letter tracing P to T in English workbook.' },
    { id: 2, subject: 'Mathematics', title: 'Numbers counting 1 to 50 worksheet', dueDate: '19-Oct-2026', teacher: 'Priti Verma', desc: 'Count the stars and fill correct numbers in box.' },
    { id: 3, subject: 'Hindi', title: 'Swar varnamala recognition & drawing', dueDate: '20-Oct-2026', teacher: 'Kavita Sharma', desc: 'Draw pictures matching varnamala letters (अ से अः).' },
    { id: 4, subject: 'General Awareness', title: 'Color the fruits & vegetables chart', dueDate: '21-Oct-2026', teacher: 'Sunita Kumari', desc: 'Color apples red, bananas yellow, and peas green.' }
  ];

  // Syllabus Data
  const syllabusData = {
    English: [
      { unit: 'Unit 1: Phonics & Letter Recognition', topics: 'Letter sounds A-Z, Letter Tracing, Sight words: I, A, The, In', progress: 95 },
      { unit: 'Unit 2: Picture Identification', topics: 'Animals, Birds, Fruits, Classroom objects recognition', progress: 85 },
      { unit: 'Unit 3: Nursery Rhymes & Conversation', topics: 'Twinkle Twinkle, Johny Johny, Baa Baa Black Sheep, Self Introduction', progress: 90 }
    ],
    Mathematics: [
      { unit: 'Unit 1: Pre-Math Concepts', topics: 'Big/Small, Tall/Short, Heavy/Light, More/Less, Inside/Outside', progress: 100 },
      { unit: 'Unit 2: Numbers 1 to 50', topics: 'Oral counting 1-50, Written practice 1-20, Count and Match', progress: 88 },
      { unit: 'Unit 3: Shapes & Patterns', topics: 'Circle, Square, Triangle, Rectangle identification and coloring', progress: 92 }
    ],
    Hindi: [
      { unit: 'इकाई 1: स्वर पहचान (अ से अः)', topics: 'अक्षर ज्ञान, चित्र देखकर अक्षर मिलाना, मौखिक अभ्यास', progress: 90 },
      { unit: 'इकाई 2: बाल गीत एवं कविताएँ', topics: 'मछली जल की रानी है, चंदा मामा दूर के, तितली उड़ी', progress: 95 }
    ],
    'Rhymes & EVS': [
      { unit: 'Theme 1: Myself & My Family', topics: 'My body parts, Family members, Healthy eating habits', progress: 94 },
      { unit: 'Theme 2: Seasons & Nature', topics: 'Summer, Rainy, Winter seasons, Trees and flowers around us', progress: 85 }
    ]
  };

  // Study Materials Data
  const studyMaterials = [
    { id: 1, title: 'English Phonics Fun Workbook (A to Z)', subject: 'English', type: 'Worksheet PDF', size: '2.4 MB', date: '12-Oct-2026' },
    { id: 2, title: 'Maths Numbers 1-50 Tracing Book', subject: 'Mathematics', type: 'Worksheet PDF', size: '1.8 MB', date: '10-Oct-2026' },
    { id: 3, title: 'Hindi Swar Chitrawali & Practice Sheet', subject: 'Hindi', type: 'Flashcard PDF', size: '3.1 MB', date: '08-Oct-2026' },
    { id: 4, title: 'Interactive Nursery Rhymes & Action Songs', subject: 'Rhymes & EVS', type: 'Video Tutorial', size: '15.4 MB', date: '05-Oct-2026' },
    { id: 5, title: 'Good Habits & Manners Visual Storybook', subject: 'General Awareness', type: 'Storybook PDF', size: '4.2 MB', date: '02-Oct-2026' }
  ];

  // Assignments Data
  const assignmentsList = [
    { id: 1, title: 'Weekly Alphabet Tracing & Coloring', subject: 'English', dueDate: '18-Oct-2026', maxMarks: 20, status: 'Submitted', score: '19/20', feedback: 'Very neat curve lines and handwriting!' },
    { id: 2, title: 'Count and Circle Objects (1 to 20)', subject: 'Mathematics', dueDate: '21-Oct-2026', maxMarks: 20, status: 'Pending', score: '-', feedback: 'Pending submission' },
    { id: 3, title: 'Match Picture with Hindi Swar', subject: 'Hindi', dueDate: '24-Oct-2026', maxMarks: 20, status: 'Pending', score: '-', feedback: 'Pending submission' }
  ];

  // Exam DateSheet
  const dateSheet = [
    { date: '20-Oct-2026', day: 'Tuesday', subject: 'English Oral & Rhymes', time: '09:00 AM - 11:30 AM', room: 'Room 102', syllabus: 'Rhymes: Twinkle Twinkle, Baa Baa Black Sheep & Phonics' },
    { date: '22-Oct-2026', day: 'Thursday', subject: 'Mathematics Written', time: '09:00 AM - 11:30 AM', room: 'Room 102', syllabus: 'Numbers 1 to 50 & Shapes identification' },
    { date: '24-Oct-2026', day: 'Saturday', subject: 'Hindi & Kavita', time: '09:00 AM - 11:30 AM', room: 'Room 102', syllabus: 'Swar Varnamala & Chanda Mama poem' },
    { date: '27-Oct-2026', day: 'Tuesday', subject: 'General Awareness & Drawing', time: '09:00 AM - 11:30 AM', room: 'Room 102', syllabus: 'Colors, Fruits, Animals & Free hand coloring' }
  ];

  // Result / Marksheet
  const results = [
    { subject: 'English Oral & Writing', maxMarks: 100, obtained: 95, grade: 'A1', remarks: 'Outstanding phonetics & expression' },
    { subject: 'Mathematics & Numbers', maxMarks: 100, obtained: 98, grade: 'A1', remarks: 'Exceptional number concepts' },
    { subject: 'Hindi (Kavita & Swar)', maxMarks: 100, obtained: 92, grade: 'A1', remarks: 'Very neat handwriting' },
    { subject: 'General Awareness & EVS', maxMarks: 100, obtained: 96, grade: 'A1', remarks: 'Active classroom curiosity' },
    { subject: 'Art, Craft & Rhymes', maxMarks: 100, obtained: 94, grade: 'A1', remarks: 'Creative color sense & rhythm' }
  ];

  // Monthly Attendance Matrix (October 2026)
  const attendanceCalendar = [
    { day: 1, status: 'P', timeIn: '08:04 AM', timeOut: '02:15 PM' },
    { day: 2, status: 'H', desc: 'Gandhi Jayanti' },
    { day: 3, status: 'P', timeIn: '08:05 AM', timeOut: '02:15 PM' },
    { day: 4, status: 'Sun', desc: 'Sunday' },
    { day: 5, status: 'P', timeIn: '08:02 AM', timeOut: '02:15 PM' },
    { day: 6, status: 'P', timeIn: '08:07 AM', timeOut: '02:15 PM' },
    { day: 7, status: 'P', timeIn: '08:01 AM', timeOut: '02:15 PM' },
    { day: 8, status: 'P', timeIn: '08:05 AM', timeOut: '02:15 PM' },
    { day: 9, status: 'Ab', desc: 'Medical checkup' },
    { day: 10, status: 'P', timeIn: '08:06 AM', timeOut: '02:15 PM' },
    { day: 11, status: 'Sun', desc: 'Sunday' },
    { day: 12, status: 'P', timeIn: '08:03 AM', timeOut: '02:15 PM' },
    { day: 13, status: 'Ab', desc: 'Family function' },
    { day: 14, status: 'P', timeIn: '08:00 AM', timeOut: '02:15 PM' },
    { day: 15, status: 'P', timeIn: '08:05 AM', timeOut: '02:15 PM' },
    { day: 16, status: 'P', timeIn: '08:02 AM', timeOut: '02:15 PM' },
    { day: 17, status: 'P', timeIn: '08:04 AM', timeOut: '02:15 PM' },
    { day: 18, status: 'Sun', desc: 'Sunday' },
    { day: 19, status: 'Upcoming' },
    { day: 20, status: 'H', desc: 'Dussehra Break' },
    { day: 21, status: 'H', desc: 'Dussehra Break' },
    { day: 22, status: 'H', desc: 'Dussehra Break' },
    { day: 23, status: 'H', desc: 'Dussehra Break' },
    { day: 24, status: 'H', desc: 'Dussehra Break' },
    { day: 25, status: 'Sun', desc: 'Sunday' },
    { day: 26, status: 'Upcoming' },
    { day: 27, status: 'Upcoming' },
    { day: 28, status: 'Upcoming' },
    { day: 29, status: 'Upcoming' },
    { day: 30, status: 'Upcoming' },
    { day: 31, status: 'Upcoming' }
  ];

  // Circulars & Notices
  const circulars = [
    { id: 1, date: '10-Oct-2026', title: 'Dussehra & Autumn Break Notification', desc: 'School will observe Autumn Break from 20th Oct to 24th Oct 2026. School re-opens on 26th Oct.', file: 'Autumn_Break_2026.pdf' },
    { id: 2, date: '05-Oct-2026', title: 'Periodic Assessment 2 Timetable & Guidelines', desc: 'Please find enclosed the timetable for upcoming Term Assessment examinations.', file: 'PT2_Timetable.pdf' },
    { id: 3, date: '28-Sep-2026', title: 'Winter Uniform Transition Policy', desc: 'Winter uniform guidelines applicable from 1st November 2026 for all junior wing students.', file: 'Winter_Uniform_Policy.pdf' }
  ];

  // Classmates Directory (Nursery - PP3+ - A)
  const classmates = [
    { roll: '01', name: 'Aarav Sharma', father: 'Vikram Sharma', contact: '98290 11001', bday: '18-Oct' },
    { roll: '02', name: 'Ananya Verma', father: 'Rajesh Verma', contact: '98290 11002', bday: '04-Nov' },
    { roll: '03', name: 'Bhavik Soni', father: 'Mukesh Soni', contact: '98290 11003', bday: '12-Dec' },
    { roll: '04', name: 'Divya Rathore', father: 'Karnail Rathore', contact: '98290 11004', bday: '26-Oct' },
    { roll: '05', name: 'Ishan Goyal', father: 'Sanjay Goyal', contact: '98290 11005', bday: '15-Jan' },
    { roll: '06', name: 'Kabir Meena', father: 'Dinesh Meena', contact: '98290 11006', bday: '22-Feb' },
    { roll: '07', name: 'Myra Jain', father: 'Pramod Jain', contact: '98290 11007', bday: '09-Mar' },
    { roll: '08', name: 'Reyansh Gupta', father: 'Amit Gupta', contact: '98290 11008', bday: '14-Apr' },
    { roll: '09', name: 'Saanvi Patel', father: 'Prakash Patel', contact: '98290 11009', bday: '30-May' },
    { roll: '10', name: 'Vihaan Yadav', father: 'Rohit Yadav', contact: '98290 11010', bday: '08-Jun' },
    { roll: '11', name: 'Avani Singhal', father: 'Gaurav Singhal', contact: '98290 11011', bday: '19-Jul' },
    { roll: '12', name: 'Devansh Khandelwal', father: 'Arun Khandelwal', contact: '98290 11012', bday: '11-Aug' },
    { roll: '13', name: 'Navya Mittal', father: 'Harish Mittal', contact: '98290 11013', bday: '25-Sep' },
    { roll: '14', name: 'Aadhya Choudhary (Self)', father: 'Om Prakash Jat', contact: '6377281034', bday: '20-Dec' }
  ];

  // School News Feed
  const schoolNews = [
    {
      id: 1,
      title: 'J D International School Wins Green Campus & Eco-Leadership Award 2026',
      date: '12-Oct-2026',
      author: 'Principal Office',
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=400',
      desc: 'Our school has been honored with the Prestigious Rajasthan Green School award for zero-waste initiatives, solar energy usage, and rich organic botanic gardens.'
    },
    {
      id: 2,
      title: 'Inter-School Rhyme Recitation Competition - Junior Wing Triumphs',
      date: '06-Oct-2026',
      author: 'Cultural Wing',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400',
      desc: 'Nursery students secured 1st prize at the Jaipur District Sahodaya Rhyme Festival. Hearty congratulations to our little blooming stars!'
    },
    {
      id: 3,
      title: 'Annual Sports Meet 2026 Scheduled for 28th November',
      date: '29-Sep-2026',
      author: 'Sports Dept',
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400',
      desc: 'Get ready for races, march-past, and fun-filled sports drill displays. Parents and alumni cordially invited to witness sportsmanship in action.'
    }
  ];

  // Photo Gallery Albums
  const galleryAlbums = {
    'Annual Day 2026': [
      'https://images.unsplash.com/photo-1511578314322-379afb476865?w=500',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500',
      'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=500'
    ],
    'Independence Day Celebrations': [
      'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=500',
      'https://images.unsplash.com/photo-1544717305-2782549b5136?w=500'
    ],
    'Kids Fancy Dress Carnival': [
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=500',
      'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=500'
    ]
  };

  // UAB Module Categories (1:1 with live Angular categories)
  const primaryCategories = [
    {
      id: 'academics',
      title: 'Academics',
      icon: BookOpen,
      iconColor: 'text-indigo-600 bg-indigo-50',
      items: [
        { id: 'homework', label: 'Homework', icon: BookOpen, path: '/get-homework' },
        { id: 'syllabus', label: 'Syllabus', icon: BookMarked, path: '/get-syllabus' },
        { id: 'study-material', label: 'Study Material', icon: FileSpreadsheet, path: '/get-study-material' },
        { id: 'assignment', label: 'Assignment', icon: FileEdit, path: '/get-assignment' },
        { id: 'online-classes', label: 'Online Classes', icon: Video, path: '/get-online-classes' }
      ]
    },
    {
      id: 'fees',
      title: 'Fees & Payments',
      icon: Landmark,
      iconColor: 'text-emerald-600 bg-emerald-50',
      items: [
        { id: 'fee', label: 'Fee Details', icon: CreditCard, path: '/get-fee' },
        { id: 'fee-receipt', label: 'Fee Receipt', icon: Receipt, path: '/get-fee-receipt' }
      ]
    },
    {
      id: 'exams',
      title: 'Exam & Result',
      icon: Award,
      iconColor: 'text-rose-600 bg-rose-50',
      items: [
        { id: 'datesheet', label: 'DateSheet', icon: Calendar, path: '/get-datesheet' },
        { id: 'admit-card', label: 'Admit Card', icon: Ticket, path: '/student-admit-card' },
        { id: 'result', label: 'Result', icon: Award, path: '/get-result' }
      ]
    },
    {
      id: 'attendance-disp',
      title: 'Attendance & Discipline',
      icon: CalendarCheck,
      iconColor: 'text-purple-600 bg-purple-50',
      items: [
        { id: 'attendance', label: 'Attendance', icon: CalendarCheck, path: '/get-attendance' },
        { id: 'gate-pass', label: 'Gate Pass', icon: DoorOpen, path: '/get-gate-pass' },
        { id: 'leave-request', label: 'Leave Request', icon: ClipboardCheck, path: '/leave-request' }
      ]
    }
  ];

  const secondaryCategories = [
    {
      id: 'comm',
      title: 'Communication',
      icon: Mail,
      iconColor: 'text-sky-600 bg-sky-50',
      items: [
        { id: 'circular', label: 'Circular', icon: Bell, path: '/get-circular' },
        { id: 'notifications', label: 'Notifications', icon: AlertCircle, path: '/all-notifications' },
        { id: 'sms', label: 'SMS Alerts', icon: MessageSquare, path: '/get-sms' },
        { id: 'complaint', label: 'Complaints', icon: HelpCircle, path: '/get-complaint' }
      ]
    },
    {
      id: 'student-info',
      title: 'Student Information',
      icon: GraduationCap,
      iconColor: 'text-teal-600 bg-teal-50',
      items: [
        { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
        { id: 'id-card', label: 'ID Card', icon: Contact, path: '/student-id-card' },
        { id: 'transport', label: 'Transport', icon: Bus, path: '/get-transport' }
      ]
    },
    {
      id: 'planning',
      title: 'Planning & Scheduling',
      icon: CalendarDays,
      iconColor: 'text-blue-600 bg-blue-50',
      items: [
        { id: 'calendar-planning', label: 'Calendar Planing', icon: CalendarDays, path: '/get-calendar-planing' }
      ]
    },
    {
      id: 'social',
      title: 'Social & Community',
      icon: Users,
      iconColor: 'text-amber-600 bg-amber-50',
      items: [
        { id: 'birthday', label: 'Birthday', icon: Cake, path: '/student-birthday' },
        { id: 'batchmate', label: 'Batchmate', icon: Users, path: '/get-batch-mate' },
        { id: 'news', label: 'School News', icon: Newspaper, path: '/get-news' },
        { id: 'gallery', label: 'Gallery', icon: Image, path: '/get-gallary' },
        { id: 'social-media', label: 'Social Media', icon: Share2, path: '/get-social-media' }
      ]
    }
  ];

  // Initiate Atom Payment Gateway
  const handleInitiatePayment = (item) => {
    setPayingItem(item);
    setPaymentSuccess(false);
    setPaymentGatewayOpen(true);
  };

  // Submit Payment in Atom Gateway Simulator
  const handleProcessAtomPayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentSuccess(true);

      const paidAmount = payingItem.amt;
      const paidHead = payingItem.label;

      // Update monthWiseFees state
      setMonthWiseFees(prev => prev.map(m => {
        if (payingItem.isAll || m.month === payingItem.month) {
          return { ...m, paid: m.amt, due: 0, status: 'Paid' };
        }
        return m;
      }));

      // Add to official fee receipts list
      const newReceipt = {
        receiptNo: `JDIS/2026/${Math.floor(1000 + Math.random() * 9000)}`,
        date: '16-Oct-2026',
        head: paidHead,
        amount: paidAmount,
        mode: `Atom Gateway (${paymentMethod})`,
        status: 'Success'
      };
      setFeeReceipts([newReceipt, ...feeReceipts]);

      toast.success(`Payment of ₹${paidAmount.toLocaleString()} verified successfully via Atom Payment Gateway!`);
    }, 1200);
  };

  // Handle Leave Submission
  const handleLeaveSubmit = (e) => {
    e.preventDefault();
    if (!leaveForm.reason.trim()) {
      toast.error('Please enter reason for leave!');
      return;
    }
    const newEntry = {
      id: Date.now(),
      type: leaveForm.type,
      from: leaveForm.from,
      to: leaveForm.to,
      reason: leaveForm.reason,
      status: 'Pending',
      teacherRemark: 'Application submitted for class teacher review.'
    };
    setLeaveHistory([newEntry, ...leaveHistory]);
    setLeaveForm({ ...leaveForm, reason: '' });
    toast.success('Leave application submitted successfully!');
  };

  // Handle Gate Pass Submission
  const handleGatePassSubmit = (e) => {
    e.preventDefault();
    if (!gatePassForm.reason.trim()) {
      toast.error('Please enter reason for Gate Pass!');
      return;
    }
    const newPass = {
      id: Date.now(),
      passNo: `GP-2026-0${Math.floor(50 + Math.random() * 50)}`,
      date: '16-Oct-2026',
      exitTime: gatePassForm.exitTime,
      escort: gatePassForm.escort,
      reason: gatePassForm.reason,
      status: 'Approved & Gate Ready'
    };
    setGatePasses([newPass, ...gatePasses]);
    setGatePassForm({ escort: 'Om Prakash Jat (Father)', exitTime: '12:00 PM', reason: '', contact: '6377281034' });
    setShowGatePassModal(false);
    toast.success('Gate pass issued! Sent to main security gate.');
  };

  // Handle Complaint Submission
  const handleComplaintSubmit = (e) => {
    e.preventDefault();
    if (!complaintForm.subject.trim() || !complaintForm.desc.trim()) {
      toast.error('Please fill both Subject and Complaint details!');
      return;
    }
    const newTicket = {
      id: `TKT-${Math.floor(8000 + Math.random() * 1000)}`,
      category: complaintForm.category,
      subject: complaintForm.subject,
      date: '16-Oct-2026',
      status: 'Under Review',
      adminReply: 'Ticket forwarded to school coordinator. Resolution within 24 business hours.'
    };
    setComplaints([newTicket, ...complaints]);
    setComplaintForm({ category: 'Bus / Transport', subject: '', desc: '', priority: 'Normal' });
    toast.success(`Complaint registered successfully! Ticket ID: ${newTicket.id}`);
  };

  // Helper Header Component (1:1 with Live UAB Secondary Toolbar)
  const renderPageHeader = (title) => (
    <div className="flex items-center gap-3 mb-4">
      <button
        onClick={closeModal}
        className="w-8 h-8 rounded bg-indigo-700 hover:bg-indigo-800 text-white flex items-center justify-center cursor-pointer shadow-xs transition-colors shrink-0"
        title="Back to Dashboard"
      >
        <ChevronsLeft className="w-5 h-5" />
      </button>
      <h1 className="text-xl font-bold text-slate-800 tracking-tight">
        {title}
      </h1>
    </div>
  );

  // =========================================================================
  // ==================== FULL INLINE PAGES RENDERING (1:1 UAB) ====================
  // =========================================================================

  // If a subpage is active, render it as a full dedicated page (NOT a popup modal!)
  if (activeView) {
    return (
      <div className="bg-[#f3f6fa] min-h-[calc(100vh-64px)] p-3 sm:p-6 font-sans text-slate-800">
        <div className="max-w-6xl mx-auto space-y-4">

          {/* 1. HOMEWORK FULL PAGE (1:1 with schools.uabinfosol.com/get-homework) */}
          {activeView === 'homework' && (
            <div>
              {renderPageHeader('Homework')}
              <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5 space-y-4">
                {/* Date Range Picker Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Date Range"
                        value={homeworkDateFilter}
                        onChange={(e) => setHomeworkDateFilter(e.target.value)}
                        className="pl-3 pr-9 py-2 border border-slate-300 rounded-lg text-xs font-medium w-64 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                      <Calendar className="w-4 h-4 text-indigo-600 absolute right-3 top-2.5 pointer-events-none" />
                    </div>
                    {homeworkDateFilter && (
                      <button
                        onClick={() => setHomeworkDateFilter('')}
                        className="text-xs text-rose-600 hover:underline cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <span className="text-xs text-slate-500">
                    Class: <strong>{student.className} - {student.division}</strong>
                  </span>
                </div>

                {/* Homework List or No Data */}
                {homeworkDateFilter && !homeworkList.some(h => h.dueDate.includes(homeworkDateFilter)) ? (
                  <div className="text-center py-16 text-slate-400 font-semibold text-sm">
                    No Data Found
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {homeworkList.map((hw) => (
                      <div key={hw.id} className="border border-slate-200 rounded-xl p-4 bg-white hover:border-indigo-300 transition-colors shadow-2xs space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase">
                              {hw.subject}
                            </span>
                            <h4 className="font-bold text-sm text-slate-900 mt-1">{hw.title}</h4>
                            <p className="text-xs text-slate-600 mt-0.5">{hw.desc}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            homeworkStatus[hw.id] === 'Submitted'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {homeworkStatus[hw.id]}
                          </span>
                        </div>

                        <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-100">
                          <span>Teacher: <strong>{hw.teacher}</strong> &bull; Due: {hw.dueDate}</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => toast.success(`Worksheet downloaded for ${hw.subject}!`)}
                              className="px-2.5 py-1 rounded-lg border border-slate-300 hover:bg-slate-50 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <Download className="w-3 h-3" />
                              <span>Worksheet</span>
                            </button>
                            <button
                              onClick={() => {
                                setSubmitHwModal(hw);
                                setHwRemarks('');
                              }}
                              className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-semibold cursor-pointer"
                            >
                              {homeworkStatus[hw.id] === 'Submitted' ? 'Re-Submit' : 'Submit'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2. FEE DETAILS FULL PAGE (1:1 with schools.uabinfosol.com/get-fee) */}
          {activeView === 'fee' && (
            <div>
              {renderPageHeader('Fee')}
              <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5 space-y-4">
                {/* Metric Strip (Fee 21700, Paid 0, Due 21700, Paid: 0%, Due: 100%) */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex flex-wrap items-center gap-4 text-xs font-bold">
                    <span className="text-slate-700">Fee: <strong className="text-slate-900 text-sm">₹{totalFeesAmount.toLocaleString()}</strong></span>
                    <span className="text-emerald-700">Paid: <strong className="text-emerald-800 text-sm">₹{currentPaidAmount.toLocaleString()}</strong></span>
                    <span className="text-rose-700">Due: <strong className="text-rose-800 text-sm">₹{currentDueAmount.toLocaleString()}</strong></span>
                    <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-[11px]">
                      Paid: {Math.round((currentPaidAmount / totalFeesAmount) * 100)}%
                    </span>
                    <span className="bg-rose-100 text-rose-800 px-2.5 py-1 rounded-full text-[11px]">
                      Due: {Math.round((currentDueAmount / totalFeesAmount) * 100)}%
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigateTo('/get-fee-receipt', 'fee-receipt')}
                      className="px-4 py-2 border border-slate-300 hover:bg-white bg-white text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                    >
                      View Receipt
                    </button>
                    {currentDueAmount > 0 && (
                      <button
                        onClick={() => handleInitiatePayment({ month: 'All', amt: currentDueAmount, label: 'Full Academic Year Fees (All Quarters)', isAll: true })}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Pay Full ₹{currentDueAmount.toLocaleString()}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 12-Month Table (1:1 with Live UAB /get-fee table) */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase text-[11px]">
                      <tr>
                        <th className="p-3">MONTH</th>
                        <th className="p-3 text-right">AMT.</th>
                        <th className="p-3 text-right">PAID</th>
                        <th className="p-3 text-right">DUE</th>
                        <th className="p-3 text-center">STATUS</th>
                        <th className="p-3 text-right">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {monthWiseFees.map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50/60">
                          <td className="p-3 font-bold text-slate-800">
                            {row.month}
                            <span className="block text-[10px] text-slate-400 font-normal">{row.label}</span>
                          </td>
                          <td className="p-3 text-right font-medium">{row.amt > 0 ? `₹${row.amt.toLocaleString()}` : '0'}</td>
                          <td className="p-3 text-right font-bold text-emerald-600">{row.paid > 0 ? `₹${row.paid.toLocaleString()}` : '0'}</td>
                          <td className="p-3 text-right font-bold text-rose-600">{row.due > 0 ? `₹${row.due.toLocaleString()}` : '0'}</td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              row.status === 'Paid'
                                ? 'bg-emerald-100 text-emerald-800'
                                : row.status === 'Due'
                                ? 'bg-rose-100 text-rose-800'
                                : 'text-slate-400'
                            }`}>
                              {row.status === 'N/A' ? '-' : row.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            {row.amt > 0 && row.due > 0 ? (
                              <button
                                onClick={() => handleInitiatePayment({ month: row.month, amt: row.due, label: row.label })}
                                className="px-3.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs"
                              >
                                Pay
                              </button>
                            ) : row.paid > 0 ? (
                              <button
                                onClick={() => navigateTo('/get-fee-receipt', 'fee-receipt')}
                                className="px-3 py-1 border border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-lg text-xs font-semibold cursor-pointer"
                              >
                                Receipt
                              </button>
                            ) : (
                              <span className="text-slate-300 text-xs">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 3. PROFILE FULL PAGE (1:1 with schools.uabinfosol.com/profile) */}
          {activeView === 'profile' && (
            <div>
              {renderPageHeader('Profile')}
              <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6 space-y-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 border-b border-slate-100 pb-5">
                  <img src={student.avatar} alt={student.name} className="w-24 h-24 rounded-full border-4 border-indigo-600 object-cover shadow-md" />
                  <div className="space-y-1 text-center sm:text-left">
                    <span className="font-mono text-xs text-indigo-600 font-bold">[ {student.srNo} ]</span>
                    <h2 className="text-2xl font-black text-slate-900">{student.name}</h2>
                    <p className="text-xs font-bold text-slate-600">{student.className} - {student.division}</p>
                    <span className="inline-block mt-1 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Active Student &bull; Session 2026-27
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-500 font-semibold block mb-0.5">D.O.B:</span>
                    <strong className="text-slate-900 text-sm">{student.dob}</strong>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-500 font-semibold block mb-0.5">Gender:</span>
                    <strong className="text-slate-900 text-sm">{student.gender}</strong>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-500 font-semibold block mb-0.5">Contact No:</span>
                    <strong className="text-slate-900 text-sm">{student.contactNo}</strong>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-500 font-semibold block mb-0.5">Father's Name:</span>
                    <strong className="text-slate-900 text-sm">{student.fatherName}</strong>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-500 font-semibold block mb-0.5">Mother's Name:</span>
                    <strong className="text-slate-900 text-sm">{student.motherName}</strong>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-500 font-semibold block mb-0.5">Blood Group:</span>
                    <strong className="text-slate-900 text-sm">{student.bloodGroup}</strong>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 md:col-span-2">
                    <span className="text-slate-500 font-semibold block mb-0.5">Address:</span>
                    <strong className="text-slate-900 text-sm">{student.address}</strong>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                  <button
                    onClick={() => navigateTo('/student-id-card', 'id-card')}
                    className="px-4 py-2 border border-slate-300 hover:bg-slate-50 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    View Digital ID Card
                  </button>
                  <button
                    onClick={() => toast.success('Profile details update request submitted to school office!')}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Request Profile Update
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 4. ATTENDANCE FULL PAGE (1:1 with schools.uabinfosol.com/get-attendance) */}
          {activeView === 'attendance' && (
            <div>
              {renderPageHeader('Attendance')}
              <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6 space-y-5">
                <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-5 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h3 className="text-lg font-bold">Hello, {student.name} 👋</h3>
                    <p className="text-xs text-blue-200 mt-0.5">Let's keep your attendance perfect! Great job, you're on the right track.</p>
                  </div>
                  <div className="flex gap-3 text-center">
                    <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/20">
                      <span className="text-[10px] text-blue-200 block uppercase font-bold">Overall</span>
                      <span className="text-base font-black">92%</span>
                    </div>
                    <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/20">
                      <span className="text-[10px] text-emerald-300 block uppercase font-bold">Present</span>
                      <span className="text-base font-black">23</span>
                    </div>
                    <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/20">
                      <span className="text-[10px] text-rose-300 block uppercase font-bold">Absent</span>
                      <span className="text-base font-black">2</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="font-bold text-sm text-slate-800">Monthly Attendance Matrix</span>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="text-xs border border-slate-300 rounded-lg px-3 py-1.5 font-semibold text-slate-700"
                  >
                    <option>October 2026</option>
                    <option>September 2026</option>
                    <option>August 2026</option>
                  </select>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5 text-xs">
                  {attendanceCalendar.map((item) => (
                    <div
                      key={item.day}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        item.status === 'P'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold'
                          : item.status === 'Ab'
                          ? 'bg-rose-50 border-rose-200 text-rose-800 font-bold'
                          : item.status === 'H'
                          ? 'bg-amber-50 border-amber-200 text-amber-800 font-medium'
                          : item.status === 'Sun'
                          ? 'bg-slate-100 border-slate-200 text-slate-600 font-medium'
                          : 'bg-slate-50 border-slate-100 text-slate-400'
                      }`}
                    >
                      <div className="text-[10px] text-slate-500 font-semibold">{item.day} Oct</div>
                      <div className="text-sm font-extrabold mt-0.5">
                        {item.status === 'P' ? '● P' : item.status === 'Ab' ? '● Ab' : item.status === 'H' ? 'Holiday' : item.status === 'Sun' ? 'Sun' : '-'}
                      </div>
                      {item.timeIn && (
                        <div className="text-[9px] text-emerald-700 mt-1">{item.timeIn}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 5. SYLLABUS FULL PAGE (/get-syllabus) */}
          {activeView === 'syllabus' && (
            <div>
              {renderPageHeader('Syllabus')}
              <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6 space-y-4 text-xs">
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {['English', 'Mathematics', 'Hindi', 'Rhymes & EVS'].map((subj) => (
                    <button
                      key={subj}
                      onClick={() => setSyllabusSubject(subj)}
                      className={`px-4 py-2 rounded-xl font-bold cursor-pointer transition-all ${
                        syllabusSubject === subj ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {subj}
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  {syllabusData[syllabusSubject]?.map((item, idx) => (
                    <div key={idx} className="border border-slate-200 rounded-xl p-4 bg-white space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-slate-900 text-sm">{item.unit}</h4>
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                          {item.progress}% Covered
                        </span>
                      </div>
                      <p className="text-slate-600">{item.topics}</p>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${item.progress}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 flex justify-between items-center border-t border-slate-100">
                  <span className="text-slate-500">CBSE Affiliation Curriculum Aligned</span>
                  <button
                    onClick={() => toast.success(`Downloading complete ${syllabusSubject} Syllabus PDF...`)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Full Syllabus PDF</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 6. STUDY MATERIAL FULL PAGE (/get-study-material) */}
          {activeView === 'study-material' && (
            <div>
              {renderPageHeader('Study Material')}
              <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6 space-y-3 text-xs">
                {studyMaterials.map((sm) => (
                  <div key={sm.id} className="border border-slate-200 rounded-xl p-4 hover:border-teal-300 transition-colors bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-700 font-bold text-[10px] uppercase">
                        {sm.subject} &bull; {sm.type}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm mt-1">{sm.title}</h4>
                      <span className="text-[10px] text-slate-400">Uploaded: {sm.date} &bull; File Size: {sm.size}</span>
                    </div>
                    <button
                      onClick={() => toast.success(`Downloading ${sm.title}...`)}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. ASSIGNMENT FULL PAGE (/get-assignment) */}
          {activeView === 'assignment' && (
            <div>
              {renderPageHeader('Assignment')}
              <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6 space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {assignmentsList.map((asg) => (
                    <div key={asg.id} className="border border-slate-200 rounded-xl p-4 bg-white space-y-2.5">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-bold uppercase">
                            {asg.subject}
                          </span>
                          <h4 className="font-bold text-sm text-slate-900 mt-1">{asg.title}</h4>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          asg.status === 'Submitted' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {asg.status}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-500 text-[11px]">
                        <span>Due Date: <strong>{asg.dueDate}</strong> &bull; Max Marks: {asg.maxMarks}</span>
                        <span className="font-bold text-purple-700">Score: {asg.score}</span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-lg text-slate-600 text-[11px]">
                        <strong>Teacher Feedback:</strong> {asg.feedback}
                      </div>
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => toast.success(`Solution uploaded for ${asg.subject}!`)}
                          className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold cursor-pointer"
                        >
                          {asg.status === 'Submitted' ? 'Re-Upload Solution' : 'Submit Solution'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 8. ONLINE CLASSES FULL PAGE (/get-online-classes) */}
          {activeView === 'online-classes' && (
            <div>
              {renderPageHeader('Online Classes')}
              <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-8 text-center max-w-xl mx-auto space-y-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
                  <Video className="w-8 h-8 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Nursery Rhymes & Storytelling</h3>
                  <p className="text-xs text-slate-500 mt-1">Teacher: Sunita Kumari &bull; Google Meet / Zoom Classroom</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 font-bold text-xs inline-block">
                  ● Scheduled Live: 08:30 AM - 09:15 AM
                </div>
                <button
                  onClick={() => toast.success('Connecting to School Virtual Classroom meeting...')}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold cursor-pointer transition-colors shadow-md text-sm"
                >
                  Join Live Classroom Meeting
                </button>
              </div>
            </div>
          )}

          {/* 9. DATESHEET FULL PAGE (/get-datesheet) */}
          {activeView === 'datesheet' && (
            <div>
              {renderPageHeader('DateSheet')}
              <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6 space-y-4 text-xs">
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase text-[11px]">
                      <tr>
                        <th className="p-3">Date & Day</th>
                        <th className="p-3">Subject</th>
                        <th className="p-3">Time</th>
                        <th className="p-3">Room</th>
                        <th className="p-3">Syllabus Portion</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {dateSheet.map((ds, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="p-3 font-bold text-slate-800 whitespace-nowrap">
                            {ds.date} <span className="block text-[10px] text-slate-500 font-normal">{ds.day}</span>
                          </td>
                          <td className="p-3 font-semibold text-rose-700">{ds.subject}</td>
                          <td className="p-3 font-medium text-slate-600 whitespace-nowrap">{ds.time}</td>
                          <td className="p-3 font-medium text-slate-600">{ds.room}</td>
                          <td className="p-3 text-[11px] text-slate-500">{ds.syllabus}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => toast.success('Downloading Examination DateSheet PDF...')}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download DateSheet PDF</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 10. ADMIT CARD FULL PAGE (/student-admit-card) */}
          {activeView === 'admit-card' && (
            <div>
              {renderPageHeader('Admit Card')}
              <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6 max-w-2xl mx-auto space-y-4 text-xs">
                <div className="text-center border-b border-slate-200 pb-3">
                  <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">{student.schoolName}</h2>
                  <p className="text-xs text-slate-500">Center Code: {student.schoolCode} &bull; Affiliation: {student.afflNo}</p>
                  <span className="inline-block mt-1 px-3 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold text-[10px] uppercase">
                    Candidate Examination Hall Ticket 2026-27
                  </span>
                </div>
                <div className="flex items-center gap-4 border border-slate-200 rounded-xl p-4 bg-slate-50">
                  <img src={student.avatar} alt={student.name} className="w-16 h-16 rounded-lg object-cover border" />
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 w-full">
                    <div><span className="text-slate-500">Candidate:</span> <strong>{student.name}</strong></div>
                    <div><span className="text-slate-500">Roll No:</span> <strong>{student.rollNo}</strong></div>
                    <div><span className="text-slate-500">Class & Sec:</span> <strong>{student.className} - {student.division}</strong></div>
                    <div><span className="text-slate-500">SR No:</span> <strong>{student.srNo}</strong></div>
                    <div><span className="text-slate-500">Father:</span> <strong>{student.fatherName}</strong></div>
                    <div><span className="text-slate-500">DOB:</span> <strong>{student.dob}</strong></div>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                  <span className="text-slate-500">Controller of Examinations</span>
                  <button
                    onClick={() => toast.success('Printing Official Exam Admit Card PDF...')}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Admit Card</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 11. RESULT FULL PAGE (/get-result) */}
          {activeView === 'result' && (
            <div>
              {renderPageHeader('Result')}
              <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6 space-y-4 text-xs">
                <div className="text-center border-b border-slate-200 pb-3">
                  <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">{student.schoolName}</h2>
                  <span className="inline-block mt-1 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                    Overall Result: PASSED (Grade A1 &bull; 95%)
                  </span>
                </div>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Subject</th>
                        <th className="p-3 text-right">Max Marks</th>
                        <th className="p-3 text-right">Obtained</th>
                        <th className="p-3 text-center">Grade</th>
                        <th className="p-3">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {results.map((r, i) => (
                        <tr key={i} className="hover:bg-slate-50/50">
                          <td className="p-3 font-bold text-slate-800">{r.subject}</td>
                          <td className="p-3 text-right text-slate-500">{r.maxMarks}</td>
                          <td className="p-3 text-right font-extrabold text-blue-700">{r.obtained}</td>
                          <td className="p-3 text-center">
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">{r.grade}</span>
                          </td>
                          <td className="p-3 text-[11px] text-slate-600">{r.remarks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => toast.success('Printing Official Marksheet PDF...')}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Marksheet</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 12. LEAVE REQUEST FULL PAGE (/leave-request) */}
          {activeView === 'leave-request' && (
            <div>
              {renderPageHeader('Leave Request')}
              <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6 space-y-5 text-xs">
                <form onSubmit={handleLeaveSubmit} className="space-y-4 max-w-xl">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Leave Type</label>
                    <select
                      value={leaveForm.type}
                      onChange={(e) => setLeaveForm({ ...leaveForm, type: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2 font-medium"
                    >
                      <option>Sick Leave</option>
                      <option>Family Function</option>
                      <option>Medical Emergency</option>
                      <option>Casual Leave</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">From Date</label>
                      <input
                        type="date"
                        value={leaveForm.from}
                        onChange={(e) => setLeaveForm({ ...leaveForm, from: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg p-2 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">To Date</label>
                      <input
                        type="date"
                        value={leaveForm.to}
                        onChange={(e) => setLeaveForm({ ...leaveForm, to: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg p-2 font-medium"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Reason for Leave</label>
                    <textarea
                      rows="3"
                      value={leaveForm.reason}
                      onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                      placeholder="State reason for absence..."
                      className="w-full border border-slate-300 rounded-lg p-2 font-medium"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold cursor-pointer transition-colors shadow-xs"
                  >
                    Submit Leave Application
                  </button>
                </form>

                <div className="pt-4 border-t border-slate-200">
                  <span className="font-bold text-slate-700 block mb-2 text-sm">Past Applications:</span>
                  <div className="space-y-2">
                    {leaveHistory.map((lh) => (
                      <div key={lh.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                        <div>
                          <span className="font-semibold text-slate-900">{lh.type} ({lh.from} to {lh.to})</span>
                          <p className="text-[11px] text-slate-500 mt-0.5">{lh.reason}</p>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          {lh.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 13. GATE PASS FULL PAGE (/get-gate-pass) */}
          {activeView === 'gate-pass' && (
            <div>
              {renderPageHeader('Gate Pass')}
              <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6 space-y-4 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800 text-sm">Authorized Gate Passes</span>
                  <button
                    onClick={() => setShowGatePassModal(true)}
                    className="px-4 py-2 bg-cyan-700 hover:bg-cyan-800 text-white rounded-xl font-bold cursor-pointer shadow-xs"
                  >
                    + Apply New Gate Pass
                  </button>
                </div>
                <div className="space-y-3">
                  {gatePasses.map((gp) => (
                    <div key={gp.id} className="border border-slate-200 rounded-xl p-4 bg-white space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-bold text-cyan-800 text-sm">{gp.passNo}</span>
                          <p className="text-[11px] text-slate-500">Date: {gp.date} &bull; Exit Time: {gp.exitTime}</p>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          {gp.status}
                        </span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-lg">
                        <p className="text-slate-700"><strong>Authorized Escort:</strong> {gp.escort}</p>
                        <p className="text-slate-500 text-[11px]"><strong>Reason:</strong> {gp.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 14. TRANSPORT FULL PAGE (/get-transport) */}
          {activeView === 'transport' && (
            <div>
              {renderPageHeader('Transport')}
              <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6 space-y-4 text-xs max-w-2xl">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <span className="text-amber-800 font-bold text-base block">Route #04 &bull; Mahapura - Ajmer Road</span>
                    <span className="text-slate-600 text-xs">Vehicle: RJ-14-PA-2026 (Tata Starbus)</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                    ● GPS Active
                  </span>
                </div>
                <div className="space-y-2 border border-slate-200 rounded-xl p-4">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Driver Name:</span>
                    <strong className="text-slate-800">Ramphal Gurjar</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Driver Mobile:</span>
                    <strong className="text-slate-800">+91 98290 12345</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Morning Pickup:</span>
                    <strong className="text-slate-800">07:45 AM (Mahapura Bus Stop)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Afternoon Drop:</span>
                    <strong className="text-slate-800">02:25 PM (Mahapura Bus Stop)</strong>
                  </div>
                </div>
                <button
                  onClick={() => toast.success('Live Bus GPS refreshed: Current speed 34 km/h, reaching Mahapura in 6 mins')}
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold cursor-pointer transition-colors shadow-xs"
                >
                  Refresh Live Bus GPS
                </button>
              </div>
            </div>
          )}

          {/* 15. NOTIFICATIONS FULL PAGE (/all-notifications, /get-sms, /get-voice-sms) */}
          {activeView === 'notifications' && (
            <div>
              {renderPageHeader('Notifications')}
              <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6 space-y-4 text-xs">
                <div className="flex gap-2 border-b border-slate-200 pb-2">
                  <button
                    onClick={() => setCommTab('notifications')}
                    className={`px-4 py-2 rounded-xl font-bold cursor-pointer transition-all ${
                      commTab === 'notifications' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    All Notifications
                  </button>
                  <button
                    onClick={() => setCommTab('sms')}
                    className={`px-4 py-2 rounded-xl font-bold cursor-pointer transition-all ${
                      commTab === 'sms' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    SMS Alerts (6377281034)
                  </button>
                  <button
                    onClick={() => setCommTab('voice')}
                    className={`px-4 py-2 rounded-xl font-bold cursor-pointer transition-all ${
                      commTab === 'voice' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Voice SMS
                  </button>
                </div>
                {commTab === 'notifications' && (
                  <div className="space-y-3">
                    <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/60">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-blue-900 text-sm">Term Assessment 2026 Timetable Released</span>
                        <span className="text-[10px] text-slate-500">14-Oct-2026</span>
                      </div>
                      <p className="text-slate-600 mt-1">Please check the Exam DateSheet section for junior wing examination details.</p>
                    </div>
                  </div>
                )}
                {commTab === 'sms' && (
                  <div className="space-y-3">
                    <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
                      <div className="flex justify-between text-slate-500">
                        <span>Sender: <strong>JDIS-JAIPUR</strong></span>
                        <span className="text-emerald-600 font-bold">● Delivered</span>
                      </div>
                      <p className="text-slate-800 font-mono">"Dear Parent, Aadhya Choudhary (Roll 14) is marked Absent today (16-Oct-2026)."</p>
                    </div>
                  </div>
                )}
                {commTab === 'voice' && (
                  <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50 space-y-2">
                    <span className="font-bold text-indigo-950 text-sm">Principal's Address: Autumn Break & Diwali Safety</span>
                    <button
                      onClick={() => {
                        setPlayingVoiceId(playingVoiceId === 1 ? null : 1);
                        toast.success('Playing School Voice Announcement...');
                      }}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      {playingVoiceId === 1 ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      <span>{playingVoiceId === 1 ? 'Pause Voice Note' : 'Play Voice Message'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 16. CIRCULAR FULL PAGE (/get-circular) */}
          {activeView === 'circular' && (
            <div>
              {renderPageHeader('Circular')}
              <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6 space-y-3 text-xs">
                {circulars.map((c) => (
                  <div key={c.id} className="border border-slate-200 rounded-xl p-4 bg-white space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-slate-900 text-sm">{c.title}</h4>
                      <span className="text-slate-500">{c.date}</span>
                    </div>
                    <p className="text-slate-600">{c.desc}</p>
                    <button
                      onClick={() => toast.success(`Downloading circular ${c.file}...`)}
                      className="px-3 py-1.5 rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-800 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF Attachment</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 17. COMPLAINTS FULL PAGE (/get-complaint) */}
          {activeView === 'complaint' && (
            <div>
              {renderPageHeader('Complaint')}
              <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6 space-y-5 text-xs">
                <form onSubmit={handleComplaintSubmit} className="space-y-4 max-w-xl bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-800 text-sm">Register Grievance / Complaint</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Category</label>
                      <select
                        value={complaintForm.category}
                        onChange={(e) => setComplaintForm({ ...complaintForm, category: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium"
                      >
                        <option>Bus / Transport</option>
                        <option>Academics & Teaching</option>
                        <option>Hygiene & Sanitation</option>
                        <option>Fee & Accounts</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Priority</label>
                      <select
                        value={complaintForm.priority}
                        onChange={(e) => setComplaintForm({ ...complaintForm, priority: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium"
                      >
                        <option>Normal</option>
                        <option>High</option>
                        <option>Urgent</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Subject</label>
                    <input
                      type="text"
                      value={complaintForm.subject}
                      onChange={(e) => setComplaintForm({ ...complaintForm, subject: e.target.value })}
                      placeholder="Brief topic..."
                      className="w-full bg-white border border-slate-300 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Description</label>
                    <textarea
                      rows="3"
                      value={complaintForm.desc}
                      onChange={(e) => setComplaintForm({ ...complaintForm, desc: e.target.value })}
                      placeholder="Detailed explanation..."
                      className="w-full bg-white border border-slate-300 rounded-lg p-2"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold cursor-pointer"
                  >
                    Submit Grievance Ticket
                  </button>
                </form>

                <div className="space-y-3 pt-2 border-t border-slate-200">
                  <span className="font-bold text-slate-800 text-sm block">Previous Grievance Tickets:</span>
                  {complaints.map((c) => (
                    <div key={c.id} className="border border-slate-200 rounded-xl p-4 bg-white space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-bold text-slate-900 text-sm">{c.subject}</span>
                          <p className="text-[10px] text-slate-500">Ticket: <strong>{c.id}</strong> &bull; Category: {c.category} &bull; Date: {c.date}</p>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          {c.status}
                        </span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-lg text-slate-600">
                        <strong>Admin Resolution Note:</strong> {c.adminReply}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 18. ID CARD FULL PAGE (/student-id-card) */}
          {activeView === 'id-card' && (
            <div>
              {renderPageHeader('Id Card')}
              <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6 max-w-sm mx-auto text-center space-y-4 text-xs">
                <div className="border-b border-slate-200 pb-2">
                  <h3 className="font-extrabold text-slate-900 text-sm uppercase">{student.schoolName}</h3>
                  <p className="text-[10px] text-slate-500">Mahapura, Ajmer Road, Jaipur &bull; Code: {student.schoolCode}</p>
                </div>
                <img src={student.avatar} alt={student.name} className="w-24 h-24 rounded-full border-4 border-indigo-600 object-cover shadow-md mx-auto" />
                <div>
                  <h4 className="text-base font-black text-slate-900">{student.name}</h4>
                  <p className="text-xs font-bold text-indigo-700">{student.className} - {student.division}</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-left space-y-1">
                  <div className="flex justify-between"><span>SR No:</span><strong>{student.srNo}</strong></div>
                  <div className="flex justify-between"><span>Roll No:</span><strong>{student.rollNo}</strong></div>
                  <div className="flex justify-between"><span>Father:</span><strong>{student.fatherName}</strong></div>
                  <div className="flex justify-between"><span>Phone:</span><strong>{student.contactNo}</strong></div>
                </div>
                <button
                  onClick={() => toast.success('Printing Official Student ID Card PDF...')}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold cursor-pointer transition-colors"
                >
                  Print Student ID Card
                </button>
              </div>
            </div>
          )}

          {/* 19. CALENDAR PLANNING FULL PAGE (/get-calendar-planing) */}
          {activeView === 'calendar-planning' && (
            <div>
              {renderPageHeader('Calendar Planing')}
              <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border border-indigo-200 bg-indigo-50/50 p-4 rounded-xl">
                    <span className="font-bold text-indigo-900 block text-sm">October 2026</span>
                    <ul className="mt-2 space-y-1 text-slate-700">
                      <li>&bull; <strong>02 Oct:</strong> Gandhi Jayanti (Holiday)</li>
                      <li>&bull; <strong>20-24 Oct:</strong> Autumn & Dussehra Break</li>
                      <li>&bull; <strong>27-31 Oct:</strong> Term 1 Assessment Exams</li>
                    </ul>
                  </div>
                  <div className="border border-slate-200 bg-slate-50 p-4 rounded-xl">
                    <span className="font-bold text-slate-900 block text-sm">November 2026</span>
                    <ul className="mt-2 space-y-1 text-slate-700">
                      <li>&bull; <strong>14 Nov:</strong> Children's Day Gala Carnival</li>
                      <li>&bull; <strong>28 Nov:</strong> Annual Athletic Sports Meet</li>
                    </ul>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => toast.success('Downloading Annual Calendar PDF...')}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Annual Calendar PDF</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 20. BIRTHDAY FULL PAGE (/student-birthday, /get-birthday) */}
          {activeView === 'birthday' && (
            <div>
              {renderPageHeader('Birthday')}
              <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6 space-y-5 text-xs text-center max-w-xl mx-auto">
                <div className="p-6 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl text-white shadow-md space-y-2">
                  <div className="text-3xl">🎂</div>
                  <h4 className="text-xl font-black">{student.name}</h4>
                  <p className="text-xs text-pink-100">Birthday: <strong>20th December</strong></p>
                </div>
                <div className="text-left space-y-2">
                  <span className="font-bold text-slate-800 text-sm block">Upcoming Classmate Birthdays:</span>
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex justify-between items-center">
                    <div>
                      <strong className="text-slate-900">Aarav Sharma (Roll 01)</strong>
                      <p className="text-[10px] text-slate-500">18th October &bull; Turning 4 Years Old</p>
                    </div>
                    <button
                      onClick={() => toast.success('Birthday wish sent to Aarav Sharma!')}
                      className="px-3.5 py-1.5 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-bold cursor-pointer"
                    >
                      Send Wish
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 21. BATCHMATES FULL PAGE (/get-batch-mate) */}
          {activeView === 'batchmate' && (
            <div>
              {renderPageHeader('Batchmate')}
              <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6 space-y-4 text-xs">
                <div className="relative max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={batchmateSearch}
                    onChange={(e) => setBatchmateSearch(e.target.value)}
                    placeholder="Search classmate by name or roll number..."
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {classmates
                    .filter(c => c.name.toLowerCase().includes(batchmateSearch.toLowerCase()) || c.roll.includes(batchmateSearch))
                    .map((c) => (
                      <div key={c.roll} className="border border-slate-200 rounded-xl p-3.5 bg-white flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs shrink-0">
                          {c.roll}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs">{c.name}</h4>
                          <p className="text-[10px] text-slate-500">Father: {c.father}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* 22. NEWS FULL PAGE (/get-news) */}
          {activeView === 'news' && (
            <div>
              {renderPageHeader('News')}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {schoolNews.map((n) => (
                  <div key={n.id} className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs space-y-2">
                    <img src={n.image} alt={n.title} className="w-full h-40 object-cover" />
                    <div className="p-4 space-y-2">
                      <span className="text-[10px] text-slate-400">{n.date} &bull; By {n.author}</span>
                      <h4 className="font-bold text-sm text-slate-900">{n.title}</h4>
                      <p className="text-slate-600">{n.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 23. GALLERY FULL PAGE (/get-gallary) */}
          {activeView === 'gallery' && (
            <div>
              {renderPageHeader('Gallery')}
              <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6 space-y-4 text-xs">
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {Object.keys(galleryAlbums).map((album) => (
                    <button
                      key={album}
                      onClick={() => setGalleryAlbum(album)}
                      className={`px-4 py-2 rounded-xl font-bold cursor-pointer whitespace-nowrap ${
                        galleryAlbum === album ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {album}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {galleryAlbums[galleryAlbum]?.map((imgUrl, i) => (
                    <div key={i} className="rounded-xl overflow-hidden border border-slate-200 aspect-video shadow-xs">
                      <img src={imgUrl} alt="Gallery" className="w-full h-full object-cover hover:scale-105 transition-transform" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 24. SOCIAL MEDIA FULL PAGE (/get-social-media) */}
          {activeView === 'social-media' && (
            <div>
              {renderPageHeader('Social Media')}
              <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6 max-w-xl mx-auto space-y-3 text-xs">
                <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">YouTube Channel</h4>
                    <span className="text-[11px] text-slate-500">@JDInternationalSchoolJaipur</span>
                  </div>
                  <button onClick={() => toast.success('Visiting YouTube...')} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold">Visit</button>
                </div>
                <div className="p-4 rounded-xl border border-pink-200 bg-pink-50/50 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Instagram Handle</h4>
                    <span className="text-[11px] text-slate-500">@jdis_jaipur</span>
                  </div>
                  <button onClick={() => toast.success('Visiting Instagram...')} className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-bold">Visit</button>
                </div>
              </div>
            </div>
          )}

          {/* 25. FEE RECEIPT FULL PAGE (/get-fee-receipt) */}
          {activeView === 'fee-receipt' && (
            <div>
              {renderPageHeader('Fee Receipt')}
              <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6 space-y-4 text-xs">
                {feeReceipts.map((rcpt, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
                    <div className="flex justify-between items-start border-b border-slate-100 pb-2">
                      <div>
                        <span className="font-bold text-indigo-700 text-sm">{rcpt.receiptNo}</span>
                        <p className="text-[11px] text-slate-500">Date: {rcpt.date} &bull; Mode: {rcpt.mode}</p>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">{rcpt.status}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-semibold text-slate-800">{rcpt.head}</span>
                        <p className="text-[10px] text-slate-500">Student: {student.name} ({student.className})</p>
                      </div>
                      <span className="text-lg font-black text-emerald-700">₹{rcpt.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-end pt-1 border-t border-slate-100">
                      <button
                        onClick={() => toast.success(`Downloading Receipt ${rcpt.receiptNo} PDF...`)}
                        className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Receipt</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ==================== ACTION-SPECIFIC DIALOGS ==================== */}

        {/* Atom Payment Gateway Dialog */}
        {paymentGatewayOpen && (
          <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-slate-900 text-white px-5 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h3 className="font-bold text-sm">Atom Technologies Gateway</h3>
                    <p className="text-[10px] text-slate-400">J D International School &bull; Merchant Portal</p>
                  </div>
                </div>
                <button onClick={() => setPaymentGatewayOpen(false)} className="p-1 rounded text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {paymentSuccess ? (
                <div className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10 animate-bounce" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-900">Payment Successful!</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Amount of <strong>₹{payingItem?.amt?.toLocaleString()}</strong> received for {payingItem?.label}.
                    </p>
                  </div>
                  <div className="pt-3 flex gap-2">
                    <button
                      onClick={() => {
                        setPaymentGatewayOpen(false);
                        setActiveView('fee-receipt');
                      }}
                      className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      View Receipt
                    </button>
                    <button
                      onClick={() => setPaymentGatewayOpen(false)}
                      className="flex-1 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-5 space-y-4 text-xs">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex justify-between items-center">
                    <div>
                      <span className="text-emerald-800 font-semibold text-xs block">{payingItem?.label}</span>
                      <span className="text-[11px] text-slate-500">Aadhya Choudhary (SR #2059)</span>
                    </div>
                    <span className="text-lg font-black text-emerald-900">₹{payingItem?.amt?.toLocaleString()}</span>
                  </div>

                  <div>
                    <span className="font-bold text-slate-700 block mb-2">Choose Payment Option:</span>
                    <div className="grid grid-cols-3 gap-2">
                      {['UPI', 'CARD', 'NETBANKING'].map((method) => (
                        <button
                          key={method}
                          onClick={() => setPaymentMethod(method)}
                          className={`p-2 rounded-xl border text-center font-bold text-xs cursor-pointer transition-all ${
                            paymentMethod === method
                              ? 'border-emerald-600 bg-emerald-50/80 text-emerald-800 shadow-xs'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                          }`}
                        >
                          {method === 'UPI' ? 'UPI / QR' : method === 'CARD' ? 'Debit/Credit' : 'NetBanking'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {paymentMethod === 'UPI' && (
                    <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <label className="font-bold text-slate-700 block text-[11px]">Virtual Payment Address (VPA / UPI ID)</label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-mono"
                      />
                    </div>
                  )}

                  <button
                    disabled={isProcessingPayment}
                    onClick={handleProcessAtomPayment}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-bold cursor-pointer transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    {isProcessingPayment ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Verifying with Atom Gateway...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        <span>Pay Securely ₹{payingItem?.amt?.toLocaleString()}</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Homework Submission Modal */}
        {submitHwModal && (
          <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-5 space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h4 className="font-bold text-sm text-slate-900">Submit Homework: {submitHwModal.subject}</h4>
                <button onClick={() => setSubmitHwModal(null)} className="p-1 rounded text-slate-400">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-600">{submitHwModal.title}</p>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Upload Homework Photo / PDF</label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center cursor-pointer hover:bg-slate-50">
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <span className="text-xs text-slate-600 font-semibold">Choose photo or scanned PDF</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Student / Parent Remarks</label>
                <textarea
                  rows="2"
                  value={hwRemarks}
                  onChange={(e) => setHwRemarks(e.target.value)}
                  placeholder="Completed pages nicely..."
                  className="w-full text-xs border border-slate-300 rounded-lg p-2"
                ></textarea>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSubmitHwModal(null)}
                  className="flex-1 py-2 border border-slate-300 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setHomeworkStatus({ ...homeworkStatus, [submitHwModal.id]: 'Submitted' });
                    setSubmitHwModal(null);
                    toast.success(`Homework for ${submitHwModal.subject} submitted to ${submitHwModal.teacher}!`);
                  }}
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold"
                >
                  Upload & Mark Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Apply Gate Pass Dialog */}
        {showGatePassModal && (
          <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-5 space-y-3 text-xs animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h4 className="font-bold text-sm text-slate-900">Request Gate Pass</h4>
                <button onClick={() => setShowGatePassModal(false)} className="p-1 rounded text-slate-400">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleGatePassSubmit} className="space-y-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Escort / Guardian Name</label>
                  <input
                    type="text"
                    value={gatePassForm.escort}
                    onChange={(e) => setGatePassForm({ ...gatePassForm, escort: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Exit Time</label>
                    <input
                      type="text"
                      value={gatePassForm.exitTime}
                      onChange={(e) => setGatePassForm({ ...gatePassForm, exitTime: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Contact No</label>
                    <input
                      type="text"
                      value={gatePassForm.contact}
                      onChange={(e) => setGatePassForm({ ...gatePassForm, contact: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Reason for Leaving Early</label>
                  <textarea
                    rows="2"
                    value={gatePassForm.reason}
                    onChange={(e) => setGatePassForm({ ...gatePassForm, reason: e.target.value })}
                    placeholder="Doctor appointment, sudden fever, etc."
                    className="w-full border border-slate-300 rounded-lg p-2"
                  ></textarea>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowGatePassModal(false)}
                    className="flex-1 py-2 border border-slate-300 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-cyan-700 hover:bg-cyan-800 text-white rounded-xl font-bold"
                  >
                    Issue Pass
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // ==================== DEFAULT / ROOT DASHBOARD VIEW ====================
  // =========================================================================
  return (
    <div className="bg-[#f3f6fa] min-h-screen px-3 sm:px-6 py-4 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto space-y-4">

        {/* ==================== TOP SIBLING SELECTOR BAR ==================== */}
        <div className="relative w-full">
          <div className="flex gap-2 sm:gap-3 py-1 overflow-x-auto no-scrollbar scroll-smooth">
            {siblings.map((sib) => {
              const isActive = sib.id === activeSiblingId;
              return (
                <div
                  key={sib.id}
                  onClick={() => setActiveSiblingId(sib.id)}
                  className={`flex-shrink-0 rounded-xl px-3 py-1.5 flex items-center gap-2.5 cursor-pointer transition-all duration-200 border ${
                    isActive
                      ? 'bg-white border-blue-600 shadow-md ring-2 ring-blue-500/20 scale-[1.02]'
                      : 'bg-white/80 border-slate-200/80 hover:bg-white hover:shadow-xs'
                  }`}
                >
                  <img
                    src={sib.avatar}
                    alt={sib.name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-slate-200"
                  />
                  <div className="flex flex-col">
                    <span className="text-[11px] sm:text-xs font-bold text-slate-800 whitespace-nowrap leading-tight">
                      {sib.name}
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-blue-600 font-semibold leading-tight">
                      {sib.class}
                    </span>
                  </div>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 ml-1"></span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ==================== 1:1 AUTHENTIC HERO PROFILE CARD ==================== */}
        <div className="relative overflow-hidden rounded-[24px] shadow-lg bg-white border border-slate-100">
          <img
            src="/student-background-image.png"
            alt="Hero Background"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-95"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />

          {/* Top-Left Date Pill */}
          <div
            onClick={() => navigateTo('/get-attendance', 'attendance')}
            className="absolute left-4 top-3.5 z-20 flex items-center gap-2 bg-[#2563EB] text-white rounded-full px-3 sm:px-4 py-1.5 shadow-md cursor-pointer hover:bg-blue-700 transition-colors"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span className="font-semibold text-xs tracking-tight">16 Oct 2026</span>
            <ChevronRight className="w-3 h-3 opacity-80" />
          </div>

          {/* Top-Right Pulse Button */}
          <button
            onClick={() => navigateTo('/get-online-classes', 'online-classes')}
            className="absolute top-3.5 right-4 z-20 bg-blue-600 hover:bg-blue-500 text-white text-xs px-4 py-1.5 rounded-full shadow-md transition-all duration-200 animate-pulse font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Join Live Class</span>
          </button>

          {/* Hero Card Grid */}
          <div className="grid grid-cols-12 h-full relative z-10 pt-16 pb-6 px-4 sm:px-6 gap-4 items-center">
            {/* Student Avatar + Personal Info */}
            <div className="col-span-12 md:col-span-7 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
              <div className="relative shrink-0">
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-20 h-20 rounded-full border-4 border-white shadow-xl object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => navigateTo('/profile', 'profile')}
                />
                <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#10d85a] border-2 border-white shadow-xs"></span>
              </div>
              <div className="space-y-1">
                <h1
                  onClick={() => navigateTo('/profile', 'profile')}
                  className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-tight cursor-pointer hover:text-indigo-600 transition-colors"
                >
                  {student.name}
                </h1>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-0.5">
                  <span className="inline-block px-3 py-0.5 rounded-full bg-[#2563EB] text-white font-semibold text-xs shadow-xs">
                    {student.className} - {student.division}
                  </span>
                  <span className="text-xs font-semibold text-slate-600">
                    SR No: {student.srNo}
                  </span>
                  <span className="text-xs font-semibold text-slate-600">
                    &bull; Roll No: {student.rollNo}
                  </span>
                </div>
                <p className="text-xs text-slate-600 pt-0.5">
                  Father: <span className="font-semibold text-slate-800">{student.fatherName}</span> &bull; Mother: <span className="font-semibold text-slate-800">{student.motherName}</span>
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-2 pt-1 text-xs">
                  <span
                    onClick={() => navigateTo('/get-attendance', 'attendance')}
                    className="text-[#FF4F7A] font-bold flex items-center gap-1 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 cursor-pointer hover:bg-rose-100"
                  >
                    Attend: <span className="font-extrabold uppercase">Ab</span>
                  </span>
                  <span className="text-slate-400">&bull;</span>
                  <span className="text-slate-500">{student.schoolName}</span>
                </div>
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="hidden md:flex col-span-1 justify-center items-center">
              <div className="h-28 border-r border-slate-300/80"></div>
            </div>

            {/* Attendance Doughnut Progress Widget (1:1 with chunk 935) */}
            <div
              onClick={() => navigateTo('/get-attendance', 'attendance')}
              className="col-span-12 md:col-span-4 flex flex-col items-center justify-center cursor-pointer group"
            >
              <div className="flex gap-4 sm:gap-6 mb-1 text-xs font-bold">
                <span className="text-[#10d85a] flex items-center gap-1">
                  ● P: 92%
                </span>
                <span className="text-[#FF4F7A] flex items-center gap-1">
                  ● Ab: 8%
                </span>
              </div>

              {/* Circular Doughnut SVG */}
              <div className="relative w-20 h-20 flex items-center justify-center group-hover:scale-105 transition-transform">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-200"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#FF4F7A]"
                    strokeDasharray="100, 100"
                    strokeDashoffset="0"
                    strokeWidth="4"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#56C271]"
                    strokeDasharray="92, 100"
                    strokeDashoffset="0"
                    strokeWidth="4"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-sm font-extrabold text-slate-800 leading-none">92%</span>
                </div>
              </div>
              <span className="font-bold text-xs text-slate-600 mt-1 group-hover:text-indigo-600 transition-colors">
                Attendance Log &rarr;
              </span>
            </div>
          </div>
        </div>

        {/* ==================== SUMMARY METRIC CARDS (2 COLUMNS) ==================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 1: Attendance Progress */}
          <div
            onClick={() => navigateTo('/get-attendance', 'attendance')}
            className="rounded-[24px] shadow-sm hover:shadow-md transition-shadow border border-slate-200/80 bg-white p-4 cursor-pointer"
          >
            <div className="flex justify-between items-center">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="text-right">
                <div className="text-gray-500 text-[11px] font-semibold uppercase tracking-wider">Attendance %</div>
                <div className="font-bold text-blue-600 text-2xl leading-none mt-1">92%</div>
              </div>
            </div>
            <div className="mt-3 h-2 rounded-full bg-blue-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-400 to-blue-700 transition-all duration-500"
                style={{ width: '92%' }}
              ></div>
            </div>
            <div className="flex justify-between items-center mt-2.5 text-xs">
              <span className="text-gray-500 font-medium">23 Present &bull; 2 Absent</span>
              <span className="text-green-600 font-bold">Excellent Ratio</span>
            </div>
          </div>

          {/* Card 2: Fee Status Card (1:1 with UAB Live) */}
          <div
            onClick={() => navigateTo('/get-fee', 'fee')}
            className="rounded-[24px] shadow-sm hover:shadow-md transition-shadow border border-slate-200/80 bg-white p-4 cursor-pointer"
          >
            <div className="flex justify-between items-center">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-lg">
                ₹
              </div>
              <div className="text-right">
                <div className="text-gray-500 text-[11px] font-semibold uppercase tracking-wider">Total Fee</div>
                <div className="font-bold text-slate-900 text-xl leading-none mt-1">₹{student.totalFees.toLocaleString()}</div>
              </div>
            </div>
            <div className="flex justify-between items-center mt-2 text-xs">
              <span className="text-gray-500 font-medium">Total Paid</span>
              <span className="font-bold text-emerald-600">₹{student.paidFees.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center mt-3 text-xs">
              <span className="font-bold text-slate-700">
                Total Due: <span className={student.dueFees > 0 ? 'text-rose-600' : 'text-emerald-600'}>₹{student.dueFees.toLocaleString()}</span>
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateTo('/get-fee', 'fee');
                }}
                className={`font-bold rounded-full px-5 py-1 text-xs shadow-xs transition-all cursor-pointer ${
                  student.dueFees > 0 ? 'bg-[#10d85a] hover:bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {student.dueFees > 0 ? 'Pay Now' : 'Receipts'}
              </button>
            </div>
          </div>
        </div>

        {/* ==================== REMARKS ROW (1:1 with chunk 935) ==================== */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <FileText className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="font-bold">Document Remark:</span>
            <span className="text-slate-500">All admission documents verified (Aadhaar, Birth Certificate, Photo).</span>
          </div>
          <div className="hidden md:block h-5 w-px bg-slate-200"></div>
          <div className="flex items-center gap-2 text-slate-700">
            <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-bold">General/Fee Remark:</span>
            <span className="text-slate-500">Quarterly fee installments due for Academic Session 2026-2027.</span>
          </div>
        </div>

        {/* ==================== CATEGORISED MENUS SECTION (1:1 with UAB) ==================== */}
        <div className="space-y-3 pt-1">
          {primaryCategories.map((cat) => {
            const CatIcon = cat.icon;
            return (
              <div key={cat.id} className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${cat.iconColor}`}>
                      <CatIcon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 tracking-tight">
                      {cat.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => navigateTo(cat.items[0].path, cat.items[0].id)}
                    className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 cursor-pointer"
                  >
                    <span>View More</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-3">
                  {cat.items.map((item) => {
                    const ItemIcon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => navigateTo(item.path, item.id)}
                        className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl hover:bg-indigo-50/60 border border-transparent hover:border-indigo-100 transition-all duration-200 group cursor-pointer"
                      >
                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-slate-100 group-hover:bg-indigo-600 flex items-center justify-center text-slate-700 group-hover:text-white transition-all duration-200 shadow-2xs group-hover:scale-105 mb-1.5">
                          <ItemIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <span className="text-[11px] sm:text-xs font-semibold text-slate-700 group-hover:text-indigo-900 text-center leading-tight">
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* ==================== EXPANDABLE ACCORDION FOR REMAINING MENUS ==================== */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="w-full p-4 flex justify-between items-center font-bold text-sm text-indigo-900 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Show More Categories (Communication, Profile, Planning & Social)</span>
              </div>
              {showAllCategories ? (
                <ChevronUp className="w-5 h-5 text-indigo-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-indigo-600" />
              )}
            </button>

            {showAllCategories && (
              <div className="p-4 pt-1 space-y-4 border-t border-slate-100">
                {secondaryCategories.map((cat) => {
                  const CatIcon = cat.icon;
                  return (
                    <div key={cat.id} className="border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`p-1.5 rounded-lg ${cat.iconColor}`}>
                          <CatIcon className="w-4 h-4" />
                        </div>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                          {cat.title}
                        </h4>
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                        {cat.items.map((item) => {
                          const ItemIcon = item.icon;
                          return (
                            <button
                              key={item.id}
                              onClick={() => navigateTo(item.path, item.id)}
                              className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-indigo-50/60 border border-transparent hover:border-indigo-100 transition-all group cursor-pointer"
                            >
                              <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-indigo-600 flex items-center justify-center text-slate-700 group-hover:text-white transition-all shadow-2xs mb-1">
                                <ItemIcon className="w-5 h-5" />
                              </div>
                              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-700 text-center leading-tight">
                                {item.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
