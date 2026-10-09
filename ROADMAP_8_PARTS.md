# 🗺️ Phased Implementation Roadmap (8 Parts)

This roadmap details the 8 distinct phases of development. Each part is self-contained, testable, and establishes the foundation for subsequent modules.

---

## 🔹 Part 1: Core Foundation & School Setup (Base Engine)
* **Goal:** Initialize project, set up PostgreSQL with Prisma, build public SaaS landing page, multi-step school signup, unified login, and school master setup (academic sessions, classes, students, and staff).
* **Database Models:** `School`, `User`, `AcademicSession`, `Class`, `Section`, `Subject`, `Student`, `Staff`.
* **Key Endpoints:**
  * `POST /api/auth/register-school` - Self-serve school signup with 14-day free trial.
  * `POST /api/auth/login` - User login with JWT token & role detection.
  * `GET /api/school/profile` - Current school settings & branding.
  * `POST /api/academics/classes` - Create classes & sections.
  * `POST /api/students` & `GET /api/students` - Student admission and directory.
  * `POST /api/staff` & `GET /api/staff` - Staff onboarding and teacher assignments.
* **Frontend Deliverables:**
  * **🌐 Public SaaS Landing Page:** Hero section, module showcase, pricing table, trust metrics, and FAQ.
  * **🔐 Glassmorphism Login Page:** Role-based auto-redirect, forgot password flow.
  * **📝 Multi-Step School Signup Wizard:** Step-by-step school onboarding with instant account creation.
  * **🏛️ Modern Dashboard Shell:** Sidebar, Navbar, Academic Year switcher, Dark/Light mode.
  * **🎒 Student Directory & Admission Form:** Multi-field form with ImageKit photo upload.
  * **👩‍🏫 Staff Management:** Teacher profiles & Class Teacher assignment modal.
* **Testing Checklist:**
  - [ ] Visitor can view landing page and pricing.
  - [ ] New school can register via multi-step signup and start free trial.
  - [ ] School Admin and staff can log in via login page.
  - [ ] Can create Class 1 to 10 with sections A, B.
  - [ ] Can admit a new student with auto Roll No and Class allocation.
  - [ ] Can register a teacher and assign subjects/classes.

---

## 🔹 Part 2: Fee Flow Module (Complete Fee Management)
* **Goal:** Full tuition and incidental fee collection with printable receipts and defaulters tracking.
* **Database Models:** `FeeHead`, `FeeStructure`, `StudentFeeLedger`, `FeeReceipt`, `FeeDiscount`.
* **Key Endpoints:**
  * `POST /api/fees/structures` - Class-wise fee structure templates (Tuition, Transport, Exam).
  * `POST /api/fees/collect` - Collect fee (Cash, UPI, Cheque) in a safe DB transaction.
  * `GET /api/fees/receipts/:id` - Fetch receipt details for printing.
  * `GET /api/fees/defaulters` - List students with overdue balance.
  * `GET /api/fees/daybook` - Daily collection summary register.
* **Frontend Deliverables:**
  * Quick Fee Counter page with student auto-search.
  * High-quality printable A4 PDF Fee Slip with school logo and barcode/receipt number.
  * Fee Dues Report with class-wise filters.
  * Financial Analytics Dashboard (Total Collected, Pending Dues, Month-on-Month trends).
* **Testing Checklist:**
  - [ ] Fee collected properly updates student ledger.
  - [ ] PDF receipt prints accurately with balance carry-forward.
  - [ ] Defaulter list shows real-time pending dues.

---

## 🔹 Part 3: DailyTest & Student Attendance
* **Goal:** Daily student attendance tracking, unit tests scheduling, and automated marksheet generation.
* **Database Models:** `StudentAttendance`, `Exam`, `Test`, `MarkEntry`, `GradeRule`.
* **Key Endpoints:**
  * `POST /api/attendance/student/bulk` - Mark attendance for an entire section in 1 click.
  * `GET /api/attendance/student/class/:classId` - Attendance registers and monthly percentages.
  * `POST /api/exams` - Create unit test or term exam schedule.
  * `POST /api/marks/entry` - Enter marks by class, subject, and test.
  * `GET /api/reports/marksheet/:studentId/:examId` - Consolidated student report card.
* **Frontend Deliverables:**
  * Mobile-friendly quick Attendance Marker (Present, Absent, Leave, Late).
  * Bulk Mark Entry Sheet (Excel-like keyboard navigation).
  * Printable Marksheet / Report Card with grades and remarks.
  * Performance analytics (Subject averages, class toppers, struggling students).
* **Testing Checklist:**
  - [ ] Class teacher can mark daily attendance in under 30 seconds.
  - [ ] Marks entry validates against maximum marks.
  - [ ] Marksheet calculates percentages and grades automatically.

---

## 🔹 Part 4: 📖 Syllabus Tracker Module
* **Goal:** Track subject chapters and topics progress percentage, lesson plans, and student notebook check logs.
* **Database Models:** `SyllabusChapter`, `SyllabusTopic`, `LessonPlan`, `NotebookCheckLog`.
* **Key Endpoints:**
  * `POST /api/syllabus/chapters` - Define chapters and sub-topics for class/subject.
  * `PUT /api/syllabus/topics/:id/status` - Mark topic (Pending, In Progress, Completed) with date.
  * `POST /api/syllabus/lesson-plans` - Teacher weekly/daily lesson notes.
  * `POST /api/syllabus/notebook-checks` - Record student notebook completion (Checked, Incomplete, Remarks).
* **Frontend Deliverables:**
  * Visual Syllabus Completion Progress Bar (% completed per subject).
  * Chapter & Topic management drawer.
  * Teacher Daily Lesson Planner.
  * Student Notebook Checking tracker sheet.
* **Testing Checklist:**
  - [ ] Subject progress updates in real-time when topics are checked off.
  - [ ] Notebook checking status flags incomplete students.

---

## 🔹 Part 5: 📅 TimeTable Pro Module
* **Goal:** Generate class and teacher period schedules with zero conflicts and substitute teacher allotment.
* **Database Models:** `TimeTableSlot`, `PeriodSetting`, `TeacherSubstitute`.
* **Key Endpoints:**
  * `POST /api/timetable/slots` - Assign teacher, subject, class, room for Day & Period.
  * `GET /api/timetable/class/:classId` - Weekly grid for a class.
  * `GET /api/timetable/teacher/:teacherId` - Weekly schedule for a teacher.
  * `POST /api/timetable/substitutes` - Allocate substitute teacher for an absent faculty member.
* **Frontend Deliverables:**
  * Interactive Weekly Period Schedule Grid.
  * Real-time Clash Detection alert if a teacher is double-booked.
  * 1-Click Substitute Finder (Displays list of teachers free in that period).
  * Printable Class & Teacher Timetable PDFs.
* **Testing Checklist:**
  - [ ] System blocks assigning a teacher to two simultaneous classes.
  - [ ] Free teacher list accurately displays when allocating substitutes.

---

## 🔹 Part 6: 💵 Salary & Payroll Management
* **Goal:** Attendance-linked staff payroll, allowances, deductions, and professional payslip generation.
* **Database Models:** `SalaryStructure`, `StaffAttendance`, `StaffAdvanceLoan`, `PayrollSlip`.
* **Key Endpoints:**
  * `POST /api/salary/structures` - Set basic pay, HRA, TA, PF, ESI, deductions per staff member.
  * `POST /api/salary/advance-loan` - Record staff loan and monthly recovery installments.
  * `POST /api/salary/generate-monthly` - Auto-calculate monthly payroll based on working days and leaves.
  * `GET /api/salary/payslips/:id` - Printable PDF Payslip.
* **Frontend Deliverables:**
  * Staff Payroll Dashboard with total payout preview.
  * Monthly Salary Generation wizard.
  * Printable PDF Payslip with detailed earnings and deductions.
  * Expense Daybook integration (salary entries auto-logged into school expense).
* **Testing Checklist:**
  - [ ] Unpaid leaves deduct appropriate daily wage.
  - [ ] Loan EMI auto-deducted from net payable salary.
  - [ ] Printable payslip matches net payout.

---

## 🔹 Part 7: 🎯 Campus CRM & 💼 HireHub (Admissions & Hiring)
* **Goal:** Manage admission lead inquiries through a pipeline and manage teacher recruitment from job posting to onboarding.
* **Database Models:** `CrmLead`, `CrmFollowUp`, `HireJobOpening`, `HireApplicant`.
* **Key Endpoints:**
  * `POST /api/crm/leads` - Add admission inquiry (Walk-in, Phone, Online).
  * `POST /api/crm/followups` - Log parent call outcome and schedule next reminder.
  * `POST /api/crm/leads/:id/convert` - 1-Click convert lead into enrolled student.
  * `POST /api/hire/jobs` - Create staff opening (e.g. "Senior Math Teacher").
  * `POST /api/hire/applicants/:id/status` - Move candidate (Applied -> Interview -> Offer -> Hired).
  * `POST /api/hire/applicants/:id/onboard` - Convert hired applicant directly into Staff master.
* **Frontend Deliverables:**
  * Kanban Board for Admission Leads (New -> Follow-up -> Visited -> Admitted).
  * Follow-up reminders panel.
  * Recruitment Pipeline Board for job applicants.
* **Testing Checklist:**
  - [ ] Converting a lead creates student record without re-typing information.
  - [ ] Onboarding a hired applicant creates a teacher user account with login credentials.

---

## 🔹 Part 8: 📱 Parent/Student Portal & 👑 SaaS Super Admin
* **Goal:** Provide mobile-responsive access for parents & students and provide software owner platform control.
* **Database Models:** `SaaSPlan`, `SaaSSubscription`, `SaaSInvoice`, `ParentStudentLink`.
* **Key Endpoints:**
  * `GET /api/portal/parent/children` - Switch between linked children.
  * `GET /api/portal/student/overview` - Consolidated student attendance, timetable, homework, and fees.
  * `POST /api/super-admin/schools` - Create new school tenant with plan allocation.
  * `PUT /api/super-admin/schools/:id/toggle-module` - Enable/disable individual modules (CRM, TimeTable, HireHub).
  * `POST /api/super-admin/impersonate/:schoolId` - Super admin instant login as school admin for support.
* **Frontend Deliverables:**
  * Mobile-first responsive Parent & Student app.
  * Super Admin SaaS Control Center (Total MRR, Onboarded Schools, Module Feature Flags).
* **Testing Checklist:**
  - [ ] Parent can only see their own children.
  - [ ] Super Admin can disable a module and it disappears from the school's navigation.
  - [ ] Expired subscriptions trigger read-only or payment required screen.
