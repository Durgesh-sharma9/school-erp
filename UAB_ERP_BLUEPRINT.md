# 🏫 UAB School ERP - 1:1 Complete UI & Functional Blueprint

This blueprint is directly extracted from the live **UAB Infosol School ERP** portal (`schools.uabinfosol.com`) for **J D International School (Session 2026-2027)**.

---

## 🎨 1. UI & Visual Design System (1:1 Match)

* **Layout Structure:**
  * **Left Sidebar (Collapsible):** Width ~260px, Light gray (`#f4f4f5`) background with dark slate text (`#030712`), active item highlight (`#030712 / 10%`), purple/indigo active icon accents (`#4f46e5`).
  * **Top Navbar:** School Name header (*"J D International School"*), Academic Session dropdown (*"2026-2027"*), User profile chip (*"Admin"*), New released feature ticker.
  * **Main Content Canvas:** Clean white/slate-50 background, elevated white cards with subtle border (`border-slate-200`) and shadow (`shadow-sm`).
* **Typography:** Modern clean sans-serif (Inter / Plus Jakarta Sans) with font-weight 500 for headers and 400 for table cells.
* **Badges & Highlights:**
  * Primary actions: Royal Indigo / Violet (`#4f46e5` / `#6366f1`)
  * Today's Collection: Emerald Green (`#10b981`)
  * Total Dues: Rose / Amber (`#f43f5e` / `#f59e0b`)
  * Total Students: Cyan / Blue (`#0284c7`)

---

## 🧭 2. Complete Navigation & Route Hierarchy

| Menu Category | Submenu Item | Route Path | Core Functionality |
| :--- | :--- | :--- | :--- |
| **Dashboard** | Main Dashboard | `/` | Real-time statistics (Today Collection, Fee Revenue, Students count, Attendance %). |
| **School** | Edit School Info | `/school-info` | School name, affiliation no, UDISE no, logo, receipt notes. |
| | WhatsApp Settings | `/whatsapp-qr-settings` | WhatsApp QR and messaging integration. |
| | Settings & Permissions | `/settings-and-permissions` | System preferences and role toggles. |
| **Master** | Class Master | `/class` | Class name, sections (A, B, C), priority order. |
| | Subject Group | `/subject-group` | Grouping subjects (e.g. Science stream, Arts). |
| | Subject Master | `/subject` | Subject list (English, Hindi, Math, Science). |
| | Subject Link | `/subject-link` | Class-wise subject assignment. |
| | Stream Master | `/add-update-stream` | Stream definitions (Science, Commerce, Arts). |
| **Student** | Registration (Admission) | `/student-registration` | 7-Tab Student Admission Form (SR No, Class, Parents, Photo). |
| | Assign Roll / Feebook No | `/assign-roll-number` | Bulk roll number & feebook number allocator. |
| | Daily Attendance | `/student-attendance` | Class-wise one-tap student attendance marker (P, A, L). |
| | Promotion | `/promotion` | Session-end student class promotion. |
| | Student Portfolio | `/student-portfolio` | Searchable student directory & comprehensive profile cards. |
| | ID Card Generator | `/id-card-generator` | Bulk printable student ID cards. |
| | Admit Card Generator | `/admit-card-generator` | Exam admit cards with timetable and photo. |
| **Certificates** | CC / BC / TF | `/certificate-generater-new`| Character Certificate, Bonafide Certificate. |
| | TC Generation | `/transfer-certificate` | Transfer Certificate (TC) generator & print register. |
| **Fee** | Fee Group | `/fee-head-group` | Fee head groupings (Monthly, Annual, Optional). |
| | Fee Head | `/fee-head` | Tuition, Admission, Exam, Transport, Computer heads. |
| | Concession Category | `/fee-concession-type` | Sibling discount, Staff child discount, Scholarship. |
| | Fee Fine Master | `/fee-fine-master` | Late fee fine rules per day/month. |
| | Fee Structure | `/fee-structure` | Class-wise fee schedule & installments. |
| | Fee Collection (Counter) | `/fee-collection` | Search student ➔ view pending dues ➔ collect ➔ instant PDF receipt. |
| | Sibling Fee Entry | `/sibling-fee-collection`| Collect fee for multiple brothers/sisters in 1 receipt. |
| | Cancel Fee / Refund | `/fee-refund` | Cancel accidental receipt & log refund reason. |
| **Examination** | Exam Terms | `/exam-terms` | Term 1, Term 2, Annual terms. |
| | Exam Names | `/exam-names` | Unit Test 1, Half Yearly Exam, Final Exam. |
| | Grade Master | `/grade-master` | A1, A2, B1, B2 grading boundaries. |
| | Marks Entry | `/marks-entry` | Class & subject-wise student marks fill grid. |
| | Marksheet Generator | `/marksheet-builder` | Automated printable CBSE / State Board report cards. |
| **Payroll** | Staff Registration | `/payroll-registration` | Teacher & staff onboarding with salary setup. |
| | Staff Attendance | `/staff-attendance` | Daily teacher attendance marker. |
| | Generate Salary | `/generate-staff-salary` | Monthly payroll slip generator. |
| | Staff ID Card | `/staff-id-card-generator`| Printable staff identity cards. |
| **Front Office** | Visitor Enquiry | `/visitor-enquiry` | Parent inquiry & follow-up logs. |
| | Student Gate Pass | `/gate-pass` | Digital gate pass for students leaving early. |

---

## 🗄️ 3. Exact Database Schema (Prisma + PostgreSQL)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// 1. School Information
model School {
  id              String            @id @default(uuid())
  schoolName      String            @default("J D International School")
  schoolCode      String?           @default("10964")
  udiseNo         String?           @default("08121204312")
  affiliationNo   String?           @default("1730619")
  address         String?
  place           String?           @default("Jaipur")
  pinCode         String?           @default("302026")
  phone1          String?           @default("8947919195")
  phone2          String?
  email           String?           @default("10964@cbseshiksha.in")
  website         String?           @default("www.jdschooljaipur.com")
  logoUrl         String?
  receiptNotes    String?

  sessions        AcademicSession[]
  classes         Class[]
  students        Student[]
  staff           Staff[]
  feeHeads        FeeHead[]
  feeStructures   FeeStructure[]
  feeReceipts     FeeReceipt[]
  exams           Exam[]

  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt
}

model AcademicSession {
  id              String            @id @default(uuid())
  schoolId        String
  school          School            @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  sessionName     String            // e.g. "2026-2027"
  isCurrent       Boolean           @default(true)

  classes         Class[]
  students        Student[]
  feeReceipts     FeeReceipt[]
  exams           Exam[]

  createdAt       DateTime          @default(now())
}

// 2. Class & Section
model Class {
  id              String            @id @default(uuid())
  schoolId        String
  school          School            @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  sessionId       String
  session         AcademicSession   @relation(fields: [sessionId], references: [id])
  className       String            // e.g. "Class 10", "Nursery"
  priority        Int               @default(1)

  sections        Section[]
  subjects        Subject[]
  students        Student[]
  feeStructures   FeeStructure[]

  createdAt       DateTime          @default(now())
}

model Section {
  id              String            @id @default(uuid())
  classId         String
  class           Class             @relation(fields: [classId], references: [id], onDelete: Cascade)
  sectionName     String            // "A", "B", "C"

  students        Student[]
  attendance      StudentAttendance[]

  createdAt       DateTime          @default(now())
}

model Subject {
  id              String            @id @default(uuid())
  classId         String
  class           Class             @relation(fields: [classId], references: [id], onDelete: Cascade)
  subjectName     String            // English, Hindi, Math
  subjectCode     String?

  markEntries     MarkEntry[]
  createdAt       DateTime          @default(now())
}

// 3. Student (Matching all UAB Registration Form Tabs)
model Student {
  id              String            @id @default(uuid())
  schoolId        String
  school          School            @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  sessionId       String
  session         AcademicSession   @relation(fields: [sessionId], references: [id])
  classId         String
  class           Class             @relation(fields: [classId], references: [id])
  sectionId       String
  section         Section           @relation(fields: [sectionId], references: [id])

  // Student Details Tab
  srNo            String?
  admNo           String            @unique
  enrollNo        String?
  permanentEduNo  String?
  admDate         DateTime          @default(now())
  dob             DateTime?
  studentType     String            @default("OLD") // NEW, OLD
  stream          String?
  firstName       String
  lastName        String?
  gender          String            @default("Boy") // Boy, Girl
  photoUrl        String?

  // Contact & Parent Details Tab
  contactName     String?
  contactNoSms    String?
  fatherName      String
  motherName      String?
  fatherMobile    String?
  motherMobile    String?
  address         String?

  // Financial & Academic Relations
  attendance      StudentAttendance[]
  feeLedger       StudentFeeLedger?
  receipts        FeeReceipt[]
  markEntries     MarkEntry[]

  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt
}

// 4. Attendance (One-tap class attendance)
model StudentAttendance {
  id              String            @id @default(uuid())
  studentId       String
  student         Student           @relation(fields: [studentId], references: [id], onDelete: Cascade)
  sectionId       String
  section         Section           @relation(fields: [sectionId], references: [id], onDelete: Cascade)
  date            DateTime          @db.Date
  status          String            @default("P") // P (Present), A (Absent), L (Leave)

  @@unique([studentId, date])
}

// 5. Fee Management (Matching UAB Counter POS)
model FeeHead {
  id              String            @id @default(uuid())
  schoolId        String
  school          School            @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  headName        String            // Tuition, Transport, Exam, Admission

  items           FeeStructureItem[]
  createdAt       DateTime          @default(now())
}

model FeeStructure {
  id              String            @id @default(uuid())
  schoolId        String
  school          School            @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  classId         String
  class           Class             @relation(fields: [classId], references: [id])
  stream          String?
  structureType   String            @default("Annual")

  items           FeeStructureItem[]
  createdAt       DateTime          @default(now())
}

model FeeStructureItem {
  id              String            @id @default(uuid())
  structureId     String
  structure       FeeStructure      @relation(fields: [structureId], references: [id], onDelete: Cascade)
  feeHeadId       String
  feeHead         FeeHead           @relation(fields: [feeHeadId], references: [id])
  amount          Float
}

model StudentFeeLedger {
  id              String            @id @default(uuid())
  studentId       String            @unique
  student         Student           @relation(fields: [studentId], references: [id], onDelete: Cascade)
  totalDue        Float             @default(0)
  totalPaid       Float             @default(0)
  totalDiscount   Float             @default(0)
  balanceDue      Float             @default(0)

  updatedAt       DateTime          @updatedAt
}

model FeeReceipt {
  id              String            @id @default(uuid())
  schoolId        String
  school          School            @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  sessionId       String
  session         AcademicSession   @relation(fields: [sessionId], references: [id])
  studentId       String
  student         Student           @relation(fields: [studentId], references: [id], onDelete: Cascade)
  receiptNo       String            @unique
  receiptDate     DateTime          @default(now())
  payMode         String            @default("Cash") // Cash, UPI, Cheque, Bank
  totalAmount     Float
  discount        Float             @default(0)
  payableAmount   Float
  paidAmount      Float
  dueAmount       Float             @default(0)
  remarks         String?
  collectedBy     String            @default("Admin")

  createdAt       DateTime          @default(now())
}

// 6. Examination & Marksheet
model Exam {
  id              String            @id @default(uuid())
  schoolId        String
  school          School            @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  sessionId       String
  session         AcademicSession   @relation(fields: [sessionId], references: [id])
  examName        String            // Unit Test 1, Half Yearly, Annual Exam
  term            String            @default("Term 1")

  markEntries     MarkEntry[]
  createdAt       DateTime          @default(now())
}

model MarkEntry {
  id              String            @id @default(uuid())
  examId          String
  exam            Exam              @relation(fields: [examId], references: [id], onDelete: Cascade)
  studentId       String
  student         Student           @relation(fields: [studentId], references: [id], onDelete: Cascade)
  subjectId       String
  subject         Subject           @relation(fields: [subjectId], references: [id], onDelete: Cascade)
  maxMarks        Float             @default(100)
  marksObtained   Float
  grade           String?

  @@unique([examId, studentId, subjectId])
}

// 7. Staff & User Authentication
model Staff {
  id              String            @id @default(uuid())
  schoolId        String
  school          School            @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  employeeCode    String            @unique
  name            String
  mobile          String
  email           String?
  designation     String            // Teacher, Principal, Accountant
  department      String?
  joiningDate     DateTime          @default(now())
  salary          Float             @default(0)

  createdAt       DateTime          @default(now())
}

model User {
  id              String            @id @default(uuid())
  username        String            @unique // e.g. "8947919195"
  password        String            // Hashed bcrypt
  role            String            @default("ADMIN") // ADMIN, STAFF, STUDENT
  name            String            @default("Admin")
  isActive        Boolean           @default(true)

  createdAt       DateTime          @default(now())
}
```
