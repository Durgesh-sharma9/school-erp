// Greeting Card & Birthday Report Controller - Unified School ERP
// 1:1 Parity with UAB Infosol send-greeting-card-msg and birthday-report

// Sample student recipients with birthday info
let studentRecipients = [
  {
    id: 1,
    sr_no: "2059",
    adm_no: "ADM-2023-01",
    name: "Aadhya Choudhary",
    first_name: "Aadhya",
    last_name: "Choudhary",
    class_name: "X",
    division_name: "A",
    fathers_name: "Ramesh Choudhary",
    mothers_name: "Sunita Choudhary",
    mobile_no: "6377281034",
    fathers_mobile: "6377281034",
    mothers_mobile: "9414012345",
    dob: "2010-10-15",
    birth_date: "15 Oct",
    birth_month: 10,
    gender: "Female",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aadhya"
  },
  {
    id: 2,
    sr_no: "2060",
    adm_no: "ADM-2023-02",
    name: "Rohan Sharma",
    first_name: "Rohan",
    last_name: "Sharma",
    class_name: "X",
    division_name: "A",
    fathers_name: "Mukesh Sharma",
    mothers_name: "Kavita Sharma",
    mobile_no: "9829012345",
    fathers_mobile: "9829012345",
    mothers_mobile: "9829099887",
    dob: "2010-10-18",
    birth_date: "18 Oct",
    birth_month: 10,
    gender: "Male",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan"
  },
  {
    id: 3,
    sr_no: "2061",
    adm_no: "ADM-2023-03",
    name: "Priya Kumawat",
    first_name: "Priya",
    last_name: "Kumawat",
    class_name: "IX",
    division_name: "A",
    fathers_name: "Surendra Kumawat",
    mothers_name: "Geeta Kumawat",
    mobile_no: "9876543210",
    fathers_mobile: "9876543210",
    mothers_mobile: "9876511223",
    dob: "2011-10-22",
    birth_date: "22 Oct",
    birth_month: 10,
    gender: "Female",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya"
  },
  {
    id: 4,
    sr_no: "2062",
    adm_no: "ADM-2023-04",
    name: "Aditya Singh Rathore",
    first_name: "Aditya",
    last_name: "Singh",
    class_name: "XI-SCIENCE",
    division_name: "A",
    fathers_name: "Bhawani Singh",
    mothers_name: "Manju Kanwar",
    mobile_no: "9414011223",
    fathers_mobile: "9414011223",
    mothers_mobile: "9414099881",
    dob: "2009-11-05",
    birth_date: "05 Nov",
    birth_month: 11,
    gender: "Male",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aditya"
  },
  {
    id: 5,
    sr_no: "2063",
    adm_no: "ADM-2023-05",
    name: "Kavya Meena",
    first_name: "Kavya",
    last_name: "Meena",
    class_name: "VIII",
    division_name: "B",
    fathers_name: "Rajendra Meena",
    mothers_name: "Urmila Meena",
    mobile_no: "9828114455",
    fathers_mobile: "9828114455",
    mothers_mobile: "9828199000",
    dob: "2012-10-29",
    birth_date: "29 Oct",
    birth_month: 10,
    gender: "Female",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kavya"
  }
];

// Sample staff recipients
let staffRecipients = [
  {
    id: 1,
    emp_code: "EMP-101",
    name: "Sunil Verma",
    department: "Science",
    designation: "Senior PGT Physics",
    mobile_no: "9079909813",
    dob: "1985-10-16",
    birth_date: "16 Oct",
    birth_month: 10,
    gender: "Male"
  },
  {
    id: 2,
    emp_code: "EMP-102",
    name: "Sunita Kumari",
    department: "Mathematics",
    designation: "TGT Mathematics",
    mobile_no: "9511719644",
    dob: "1989-10-24",
    birth_date: "24 Oct",
    birth_month: 10,
    gender: "Female"
  },
  {
    id: 3,
    emp_code: "EMP-103",
    name: "Bharat Jangid",
    department: "Physical Education",
    designation: "Sports Coach / PTI",
    mobile_no: "8107187618",
    dob: "1992-11-12",
    birth_date: "12 Nov",
    birth_month: 11,
    gender: "Male"
  }
];

// Greeting card delivery logs
let sentGreetingLogs = [];

/**
 * Get greeting card recipients based on type
 * type: 'student' | 'staff' | 'father' | 'mother'
 */
export const getGreetingCardRecipients = async (req, res) => {
  try {
    const { type = 'student', class_id, division_id } = req.query;

    if (type === 'staff') {
      const data = staffRecipients.map(s => ({
        id: s.id,
        emp_code: s.emp_code,
        name: s.name,
        department: s.department,
        designation: s.designation,
        mobile_no: s.mobile_no,
        dob: s.dob,
        birth_date: s.birth_date,
        selected: false
      }));
      return res.status(200).json({ success: true, type: 'staff', data });
    }

    let list = studentRecipients;
    if (class_id) {
      list = list.filter(s => s.class_name === class_id);
    }
    if (division_id) {
      list = list.filter(s => s.division_name === division_id);
    }

    const data = list.map(s => {
      let displayName = s.name;
      let displayMobile = s.mobile_no;

      if (type === 'father') {
        displayName = `${s.fathers_name} (F/O ${s.name})`;
        displayMobile = s.fathers_mobile || s.mobile_no;
      } else if (type === 'mother') {
        displayName = `${s.mothers_name} (M/O ${s.name})`;
        displayMobile = s.mothers_mobile || s.mobile_no;
      }

      return {
        id: s.id,
        sr_no: s.sr_no,
        adm_no: s.adm_no,
        student_name: s.name,
        recipient_name: displayName,
        class_name: s.class_name,
        division_name: s.division_name,
        mobile_no: displayMobile,
        dob: s.dob,
        birth_date: s.birth_date,
        selected: false
      };
    });

    res.status(200).json({ success: true, type, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Send Greeting Card / SMS / WhatsApp
 */
export const sendGreetingCard = async (req, res) => {
  try {
    const {
      recipients = [],
      delivery_mode = 2, // 1: SMS, 2: WhatsApp, 3: Card Push
      message,
      card_template_id,
      birthday_type = 'student'
    } = req.body;

    if (!recipients || recipients.length === 0) {
      return res.status(400).json({ success: false, message: 'Please select at least one recipient' });
    }

    if (!message || message.trim() === '') {
      return res.status(400).json({ success: false, message: 'Please write a message' });
    }

    const logEntry = {
      id: Date.now(),
      sent_at: new Date().toISOString(),
      recipients_count: recipients.length,
      delivery_mode,
      mode_name: delivery_mode === 1 ? 'SMS' : delivery_mode === 2 ? 'WhatsApp' : 'Card Push',
      birthday_type,
      message,
      card_template_id: card_template_id || 'template_birthday_classic',
      status: 'Sent Successfully'
    };

    sentGreetingLogs.unshift(logEntry);

    res.status(200).json({
      success: true,
      message: `Greeting cards dispatched successfully to ${recipients.length} recipient(s) via ${logEntry.mode_name}!`,
      data: logEntry
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Birthday Report (Month wise and Type wise)
 * 1:1 with UAB birthday-report
 */
export const getBirthdayReport = async (req, res) => {
  try {
    const { month = 10, type = 'all', class_id, division_id } = req.query;
    const targetMonth = parseInt(month, 10) || 10;

    let students = studentRecipients.filter(s => s.birth_month === targetMonth);
    let staff = staffRecipients.filter(s => s.birth_month === targetMonth);

    if (class_id) {
      students = students.filter(s => s.class_name === class_id);
    }
    if (division_id) {
      students = students.filter(s => s.division_name === division_id);
    }

    let reportList = [];

    if (type === 'staff') {
      reportList = staff.map((s, idx) => ({
        sNo: idx + 1,
        type: 'Staff',
        emp_code: s.emp_code,
        name: s.name,
        department: s.department,
        designation: s.designation,
        mobile_no: s.mobile_no,
        dob: s.dob,
        birth_date: s.birth_date
      }));
    } else if (type === 'father') {
      reportList = students.map((s, idx) => ({
        sNo: idx + 1,
        type: 'Father',
        adm_no: s.adm_no,
        sr_no: s.sr_no,
        name: s.name,
        parent_name: s.fathers_name,
        class_name: `${s.class_name} - ${s.division_name}`,
        mobile_no: s.fathers_mobile || s.mobile_no,
        dob: s.dob,
        birth_date: s.birth_date
      }));
    } else if (type === 'mother') {
      reportList = students.map((s, idx) => ({
        sNo: idx + 1,
        type: 'Mother',
        adm_no: s.adm_no,
        sr_no: s.sr_no,
        name: s.name,
        parent_name: s.mothers_name,
        class_name: `${s.class_name} - ${s.division_name}`,
        mobile_no: s.mothers_mobile || s.mobile_no,
        dob: s.dob,
        birth_date: s.birth_date
      }));
    } else if (type === 'student') {
      reportList = students.map((s, idx) => ({
        sNo: idx + 1,
        type: 'Student',
        adm_no: s.adm_no,
        sr_no: s.sr_no,
        name: s.name,
        parent_name: s.fathers_name,
        class_name: `${s.class_name} - ${s.division_name}`,
        mobile_no: s.mobile_no,
        dob: s.dob,
        birth_date: s.birth_date
      }));
    } else {
      // All
      const studentEntries = students.map((s, idx) => ({
        sNo: idx + 1,
        type: 'Student',
        adm_no: s.adm_no,
        sr_no: s.sr_no,
        name: s.name,
        parent_name: s.fathers_name,
        class_name: `${s.class_name} - ${s.division_name}`,
        mobile_no: s.mobile_no,
        dob: s.dob,
        birth_date: s.birth_date
      }));

      const staffEntries = staff.map((s, idx) => ({
        sNo: studentEntries.length + idx + 1,
        type: 'Staff',
        emp_code: s.emp_code,
        name: s.name,
        department: s.department,
        designation: s.designation,
        mobile_no: s.mobile_no,
        dob: s.dob,
        birth_date: s.birth_date
      }));

      reportList = [...studentEntries, ...staffEntries];
    }

    res.status(200).json({
      success: true,
      month: targetMonth,
      total_count: reportList.length,
      data: reportList
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
