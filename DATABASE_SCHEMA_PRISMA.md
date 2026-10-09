# 🗄️ Unified Database Schema Specification (Prisma + PostgreSQL)

This document contains the complete database schema design for the **Unified School ERP SaaS Platform**, structured using **Prisma ORM** for **PostgreSQL**.

---

## 📐 Complete `schema.prisma` Design

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// -------------------------------------------------------------
// 1. SAAS PLATFORM & MULTI-TENANCY ENGINE
// -------------------------------------------------------------

model SaaSPlan {
  id              String            @id @default(uuid())
  name            String            // Starter, Growth, Enterprise
  code            String            @unique
  maxStudents     Int               @default(300)
  maxStaff        Int               @default(30)
  priceMonthly    Float
  priceYearly     Float
  hasCrm          Boolean           @default(false)
  hasTimeTable    Boolean           @default(false)
  hasSyllabus     Boolean           @default(false)
  hasHireHub      Boolean           @default(false)
  hasSalary       Boolean           @default(false)
  isActive        Boolean           @default(true)
  schools         School[]
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt
}

model School {
  id              String            @id @default(uuid())
  code            String            @unique // Unique School Code (e.g. SCH-101)
  name            String
  slug            String            @unique // Subdomain slug (e.g. dps-delhi)
  logoUrl         String?
  address         String?
  city            String?
  state           String?
  phone           String?
  email           String?
  website         String?
  isActive        Boolean           @default(true)
  planId          String?
  plan            SaaSPlan?         @relation(fields: [planId], references: [id])
  planExpiresAt   DateTime?
  
  // Feature module overrides per school
  crmEnabled       Boolean          @default(true)
  timetableEnabled Boolean          @default(true)
  syllabusEnabled  Boolean          @default(true)
  hirehubEnabled   Boolean          @default(true)
  salaryEnabled    Boolean          @default(true)

  // Relations
  users           User[]
  sessions        AcademicSession[]
  classes         Class[]
  students        Student[]
  staff           Staff[]
  feeStructures   FeeStructure[]
  feeReceipts     FeeReceipt[]
  exams           Exam[]
  chapters        SyllabusChapter[]
  timetableSlots  TimeTableSlot[]
  salarySlips     PayrollSlip[]
  crmLeads        CrmLead[]
  hireJobs        HireJobOpening[]

  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt
}

enum Role {
  SUPER_ADMIN
  SCHOOL_ADMIN
  ACCOUNTANT
  TEACHER
  STUDENT
  PARENT
}

model User {
  id              String            @id @default(uuid())
  schoolId        String?
  school          School?           @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  name            String
  email           String
  phone           String?
  password        String            // Hashed with bcrypt
  role            Role              @default(TEACHER)
  isActive        Boolean           @default(true)
  lastLogin       DateTime?

  // Relations
  staffProfile    Staff?
  studentProfile  Student?
  parentChildren  ParentStudentLink[]

  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt

  @@unique([schoolId, email])
  @@index([schoolId, role])
}

// -------------------------------------------------------------
// 2. ACADEMIC STRUCTURE & SESSIONS
// -------------------------------------------------------------

model AcademicSession {
  id              String            @id @default(uuid())
  schoolId        String
  school          School            @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  name            String            // e.g. "2026-2027"
  startDate       DateTime
  endDate         DateTime
  isCurrent       Boolean           @default(false)

  classes         Class[]
  students        Student[]
  feeStructures   FeeStructure[]
  exams           Exam[]

  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt

  @@unique([schoolId, name])
}

model Class {
  id              String            @id @default(uuid())
  schoolId        String
  school          School            @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  sessionId       String
  session         AcademicSession   @relation(fields: [sessionId], references: [id])
  name            String            // e.g. "Class 10"
  numericOrder    Int               // 10

  sections        Section[]
  students        Student[]
  subjects        Subject[]
  feeStructures   FeeStructure[]

  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt

  @@unique([schoolId, sessionId, name])
}

model Section {
  id              String            @id @default(uuid())
  classId         String
  class           Class             @relation(fields: [classId], references: [id], onDelete: Cascade)
  name            String            // e.g. "A", "B"

  students        Student[]
  teacherAssigns  TeacherAssignment[]
  timetableSlots  TimeTableSlot[]

  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt

  @@unique([classId, name])
}

model Subject {
  id              String            @id @default(uuid())
  classId         String
  class           Class             @relation(fields: [classId], references: [id], onDelete: Cascade)
  name            String            // Mathematics, English, Science
  code            String?

  teacherAssigns  TeacherAssignment[]
  syllabusChapters SyllabusChapter[]
  timetableSlots  TimeTableSlot[]
  markEntries     MarkEntry[]

  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt
}

// -------------------------------------------------------------
// 3. STAFF, STUDENTS & PARENTS
// -------------------------------------------------------------

model Staff {
  id              String            @id @default(uuid())
  schoolId        String
  school          School            @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  userId          String            @unique
  user            User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  employeeCode    String
  designation     String            // PGT Math, Accountant, Peon
  department      String?           // Academics, Accounts, Admin
  joiningDate     DateTime
  baseSalary      Float             @default(0)

  teacherAssigns  TeacherAssignment[]
  attendance      StaffAttendance[]
  salaryStructure SalaryStructure?
  payslips        PayrollSlip[]
  timetableSlots  TimeTableSlot[]

  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt

  @@unique([schoolId, employeeCode])
}

model TeacherAssignment {
  id              String            @id @default(uuid())
  staffId         String
  staff           Staff             @relation(fields: [staffId], references: [id], onDelete: Cascade)
  sectionId       String
  section         Section           @relation(fields: [sectionId], references: [id], onDelete: Cascade)
  subjectId       String
  subject         Subject           @relation(fields: [subjectId], references: [id], onDelete: Cascade)
  isClassTeacher  Boolean           @default(false)

  createdAt       DateTime          @default(now())

  @@unique([staffId, sectionId, subjectId])
}

model Student {
  id              String            @id @default(uuid())
  schoolId        String
  school          School            @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  userId          String?           @unique
  user            User?             @relation(fields: [userId], references: [id])
  admissionNumber String
  rollNumber      String?
  firstName       String
  lastName        String
  gender          String            // Male, Female, Other
  dob             DateTime?
  admissionDate   DateTime          @default(now())
  photoUrl        String?
  fatherName      String?
  motherName      String?
  primaryPhone    String
  email           String?

  classId         String
  class           Class             @relation(fields: [classId], references: [id])
  sectionId       String
  section         Section           @relation(fields: [sectionId], references: [id])
  sessionId       String
  session         AcademicSession   @relation(fields: [sessionId], references: [id])

  parents         ParentStudentLink[]
  attendance      StudentAttendance[]
  feeLedgers      StudentFeeLedger[]
  markEntries     MarkEntry[]
  notebookChecks  NotebookCheckLog[]

  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt

  @@unique([schoolId, admissionNumber])
  @@index([schoolId, classId, sectionId])
}

model ParentStudentLink {
  id              String            @id @default(uuid())
  parentId        String
  parent          User              @relation(fields: [parentId], references: [id], onDelete: Cascade)
  studentId       String
  student         Student           @relation(fields: [studentId], references: [id], onDelete: Cascade)
  relationType    String            @default("Father") // Father, Mother, Guardian

  @@unique([parentId, studentId])
}

// -------------------------------------------------------------
// 4. FEE FLOW (FEE MANAGEMENT)
// -------------------------------------------------------------

model FeeHead {
  id              String            @id @default(uuid())
  schoolId        String
  name            String            // Tuition, Transport, Exam, Admission
  isOptional      Boolean           @default(false)
  items           FeeStructureItem[]

  createdAt       DateTime          @default(now())
}

model FeeStructure {
  id              String            @id @default(uuid())
  schoolId        String
  school          School            @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  sessionId       String
  session         AcademicSession   @relation(fields: [sessionId], references: [id])
  classId         String
  class           Class             @relation(fields: [classId], references: [id])
  name            String            // "Class 10 General 2026-27"
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
  frequency       String            // Monthly, Quarterly, Yearly, One-time
}

model StudentFeeLedger {
  id              String            @id @default(uuid())
  studentId       String
  student         Student           @relation(fields: [studentId], references: [id], onDelete: Cascade)
  totalPayable    Float             @default(0)
  totalDiscount   Float             @default(0)
  totalPaid       Float             @default(0)
  dueBalance      Float             @default(0)

  receipts        FeeReceipt[]
  updatedAt       DateTime          @updatedAt
}

model FeeReceipt {
  id              String            @id @default(uuid())
  schoolId        String
  school          School            @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  receiptNumber   String            // Auto-increment string e.g. RCP-2026-0001
  ledgerId        String
  ledger          StudentFeeLedger  @relation(fields: [ledgerId], references: [id])
  amountPaid      Float
  paymentMode     String            // CASH, UPI, CHEQUE, ONLINE
  transactionRef  String?
  collectedBy     String            // Staff name
  collectedAt     DateTime          @default(now())
  remarks         String?

  @@unique([schoolId, receiptNumber])
}

// -------------------------------------------------------------
// 5. DAILYTEST & ATTENDANCE & ACADEMICS
// -------------------------------------------------------------

enum AttendanceStatus {
  PRESENT
  ABSENT
  LATE
  HALF_DAY
  LEAVE
}

model StudentAttendance {
  id              String            @id @default(uuid())
  studentId       String
  student         Student           @relation(fields: [studentId], references: [id], onDelete: Cascade)
  date            DateTime          @db.Date
  status          AttendanceStatus  @default(PRESENT)
  remarks         String?

  @@unique([studentId, date])
}

model Exam {
  id              String            @id @default(uuid())
  schoolId        String
  school          School            @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  sessionId       String
  session         AcademicSession   @relation(fields: [sessionId], references: [id])
  name            String            // e.g. "Term 1 Final Exam", "Unit Test 1"
  startDate       DateTime
  endDate         DateTime

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
  remarks         String?

  @@unique([examId, studentId, subjectId])
}

// -------------------------------------------------------------
// 6. SYLLABUS TRACKER
// -------------------------------------------------------------

model SyllabusChapter {
  id              String            @id @default(uuid())
  schoolId        String
  school          School            @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  subjectId       String
  subject         Subject           @relation(fields: [subjectId], references: [id], onDelete: Cascade)
  chapterNumber   Int
  title           String
  totalHours      Float?
  isCompleted     Boolean           @default(false)

  topics          SyllabusTopic[]
  createdAt       DateTime          @default(now())
}

model SyllabusTopic {
  id              String            @id @default(uuid())
  chapterId       String
  chapter         SyllabusChapter   @relation(fields: [chapterId], references: [id], onDelete: Cascade)
  title           String
  status          String            @default("PENDING") // PENDING, IN_PROGRESS, COMPLETED
  completedAt     DateTime?

  createdAt       DateTime          @default(now())
}

model NotebookCheckLog {
  id              String            @id @default(uuid())
  studentId       String
  student         Student           @relation(fields: [studentId], references: [id], onDelete: Cascade)
  chapterId       String
  status          String            @default("CHECKED") // CHECKED, INCOMPLETE, MISSING
  checkDate       DateTime          @default(now())
  remarks         String?
}

// -------------------------------------------------------------
// 7. TIMETABLE PRO
// -------------------------------------------------------------

model TimeTableSlot {
  id              String            @id @default(uuid())
  schoolId        String
  school          School            @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  sectionId       String
  section         Section           @relation(fields: [sectionId], references: [id], onDelete: Cascade)
  subjectId       String
  subject         Subject           @relation(fields: [subjectId], references: [id], onDelete: Cascade)
  staffId         String
  staff           Staff             @relation(fields: [staffId], references: [id], onDelete: Cascade)
  dayOfWeek       Int               // 1 = Monday, 6 = Saturday
  periodNumber    Int               // 1 to 8
  startTime       String            // "09:00 AM"
  endTime         String            // "09:45 AM"
  roomNumber      String?

  @@unique([schoolId, staffId, dayOfWeek, periodNumber]) // Clash Prevention on Teacher
  @@unique([sectionId, dayOfWeek, periodNumber])          // Clash Prevention on Class
}

// -------------------------------------------------------------
// 8. SALARY & PAYROLL
// -------------------------------------------------------------

model StaffAttendance {
  id              String            @id @default(uuid())
  staffId         String
  staff           Staff             @relation(fields: [staffId], references: [id], onDelete: Cascade)
  date            DateTime          @db.Date
  status          AttendanceStatus  @default(PRESENT)

  @@unique([staffId, date])
}

model SalaryStructure {
  id              String            @id @default(uuid())
  staffId         String            @unique
  staff           Staff             @relation(fields: [staffId], references: [id], onDelete: Cascade)
  basicPay        Float
  hra             Float             @default(0)
  da              Float             @default(0)
  specialAllowance Float            @default(0)
  pfDeduction     Float             @default(0)
  esiDeduction    Float             @default(0)
  tdsDeduction    Float             @default(0)
}

model PayrollSlip {
  id              String            @id @default(uuid())
  schoolId        String
  school          School            @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  staffId         String
  staff           Staff             @relation(fields: [staffId], references: [id], onDelete: Cascade)
  month           Int               // 1 to 12
  year            Int               // 2026
  workingDays     Int
  presentDays     Float
  leaveDays       Float
  grossEarnings   Float
  totalDeductions Float
  netSalary       Float
  status          String            @default("PAID") // GENERATED, PAID
  paidAt          DateTime?

  @@unique([staffId, month, year])
}

// -------------------------------------------------------------
// 9. CAMPUS CRM & HIREHUB
// -------------------------------------------------------------

model CrmLead {
  id              String            @id @default(uuid())
  schoolId        String
  school          School            @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  parentName      String
  studentName     String
  phone           String
  email           String?
  targetClass     String
  status          String            @default("NEW") // NEW, CONTACTED, VISITED, ADMITTED, DROPPED
  source          String            @default("WALK_IN")
  followUps       CrmFollowUp[]

  createdAt       DateTime          @default(now())
}

model CrmFollowUp {
  id              String            @id @default(uuid())
  leadId          String
  lead            CrmLead           @relation(fields: [leadId], references: [id], onDelete: Cascade)
  callDate        DateTime          @default(now())
  notes           String
  nextFollowUp    DateTime?
}

model HireJobOpening {
  id              String            @id @default(uuid())
  schoolId        String
  school          School            @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  title           String            // "PGT Physics Teacher"
  department      String
  experienceReq   String
  status          String            @default("OPEN") // OPEN, CLOSED
  applicants      HireApplicant[]

  createdAt       DateTime          @default(now())
}

model HireApplicant {
  id              String            @id @default(uuid())
  jobId           String
  job             HireJobOpening    @relation(fields: [jobId], references: [id], onDelete: Cascade)
  name            String
  phone           String
  email           String
  resumeUrl       String?
  currentStage    String            @default("APPLIED") // APPLIED, SHORTLISTED, INTERVIEWED, HIRED, REJECTED

  createdAt       DateTime          @default(now())
}
```
