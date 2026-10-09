# 📦 Unified Modules Detailed Specification

This document details the functional and workflow specifications for all modules integrated into the **Unified School ERP Platform**.

---

## 0. 🌐 Public SaaS Landing Page, Login & School Signup

### A. 🚀 Public Landing Page (`frontend/src/modules/landing/`)
* **Purpose:** Public-facing commercial website for the School ERP SaaS product to convert visiting school owners and principals into registered schools.
* **Sections:**
  1. **Hero Section:** Dynamic title ("Transform Your School into a Smart Digital Campus"), punchy CTA buttons ("Start 14-Day Free Trial", "Book Live Demo"), product UI preview mockup with neon accents.
  2. **Ecosystem Showcase:** Interactive cards for all 7+ integrated modules (Campus CRM, Fee Flow, DailyTest, Syllabus Tracker, TimeTable Pro, Salary Payroll, HireHub, Mobile Portals).
  3. **Live Feature Metrics & Trust Counters:** Total Schools onboarded, Total Students managed, Total Fee processed counter.
  4. **Transparent Pricing Grid:** Starter, Growth, Enterprise with Monthly / Annual toggle (showing savings).
  5. **Interactive Feature Comparison Table:** Clear checklist of what's included in each plan.
  6. **Interactive FAQ Section:** Accordion answering common school management queries.
  7. **Footer:** Contact information, WhatsApp support link, demo request form, privacy policy.

### B. 🔐 Unified Login Portal (`frontend/src/modules/auth/LoginPage.jsx`)
* **Purpose:** Single entry door for all 6 user roles (`super_admin`, `school_admin`, `teacher`, `accountant`, `parent`, `student`).
* **Features:**
  * Clean modern glassmorphism UI with school ERP branding.
  * Email / Mobile / School Code login input with password visibility toggle.
  * Role detection and automated redirect to the user's specific dashboard.
  * "Remember Me" session persistence.
  * "Forgot Password?" flow with OTP verification via Nodemailer / SMS.

### C. 📝 Self-Serve School Signup Wizard (`frontend/src/modules/auth/SignupPage.jsx`)
* **Purpose:** Allows new schools to register their school in under 2 minutes and start a free 14-day trial.
* **Multi-Step Onboarding Wizard:**
  * **Step 1: School Identity:** School Name, Subdomain Slug (e.g. `dps-delhi`), Affiliation Board (CBSE / ICSE / State), City, Phone.
  * **Step 2: Admin Credentials:** Principal / Owner Full Name, Email, Mobile No, Secure Password.
  * **Step 3: Plan Selection:** Select plan (Free 14-Day Trial default or chosen subscription).
  * **Outcome:** Creates `School` + `School Admin User` + default `AcademicSession (2026-27)`, sends welcome email/WhatsApp, and redirects directly into the School Setup Wizard!

---

## 1. 🎯 Campus CRM (Admissions & Leads)
* **Problem Solved:** Schools lose prospective students due to unorganized paper inquiry registers and lack of scheduled parent follow-ups.
* **Key Features:**
  * **Lead Capture:** Record walk-in visits, website forms, and phone call inquiries.
  * **Lead Stages:** `New Inquiry` ➔ `Follow-Up Scheduled` ➔ `Campus Tour Done` ➔ `Form Purchased` ➔ `Admitted` ➔ `Dropped`.
  * **Call History Logs:** Add notes on parent conversations with follow-up date picker.
  * **1-Click Admission:** Converts prospective lead into full student record without re-typing.

---

## 2. 💳 Fee Flow (Fee Management & Receipts)
* **Problem Solved:** Cash counter delays, receipt book loss, fee head errors, and difficult dues tracking.
* **Key Features:**
  * **Configurable Heads:** Tuition, Annual Charges, Transport (by bus stop distance), Lab, Examination.
  * **Installment Rules:** Monthly, Quarterly, Half-Yearly, Yearly plans.
  * **Counter POS Interface:** Type student name/roll number ➔ see live pending dues ➔ collect via Cash, UPI, Cheque, Card ➔ instant PDF receipt.
  * **Auto Receipt Numbering:** Sequential per-school formatting (e.g. `DPS/2026/00452`).
  * **Dues & Defaulter Register:** Filter by class, overdue days, with bulk WhatsApp reminder trigger.

---

## 3. 🎓 DailyTest & Academic Performance (TestMaster Engine)
* **Problem Solved:** Cumbersome paper marksheets, lack of trend analysis for struggling students, slow attendance marking.
* **Key Features:**
  * **Fast Student Attendance:** Grid view for entire section with default `All Present` and quick toggle for absentees.
  * **Daily Tests & Exam Setup:** Unit tests, Mid-term, Annual exams with maximum marks and weightages.
  * **Bulk Marks Entry:** Excel-like table navigation for rapid marks entry.
  * **Automated Marksheets:** Generates CBSE/State Board format report cards with grades, ranks, attendance percentage, and teacher remarks.
  * **Performance Analytics:** Subject score averages, top rankers, and students needing remedial classes.

---

## 4. 📖 Syllabus Tracker
* **Problem Solved:** Lack of visibility on whether teachers will finish the curriculum before examinations.
* **Key Features:**
  * **Curriculum Hierarchy:** Class ➔ Subject ➔ Chapter ➔ Sub-topics.
  * **Progress Gauge:** Visual % completion meter per subject.
  * **Daily Lesson Planning:** Teacher logs what was taught today, homework given, and target date for completion.
  * **Notebook Checking Logs:** Track which students completed notebook work and which have pending corrections.

---

## 5. 📅 TimeTable Pro
* **Problem Solved:** Manual timetable creation takes days and frequently results in two teachers assigned to the same room or class.
* **Key Features:**
  * **Interactive Period Grid:** Monday to Saturday, Periods 1 to 8, customizable recess breaks.
  * **Zero Clash Engine:** Instant warning and prevention if a teacher or room is double-booked.
  * **Daily Substitute Recommender:** When a teacher takes leave, system automatically recommends teachers who are free in those specific periods.
  * **Printable Schedules:** Class timetable for students and teacher-specific weekly master schedules.

---

## 6. 💵 Salary & Payroll Management
* **Problem Solved:** Staff salary calculation errors, manual attendance deduction disputes, untracked salary advances.
* **Key Features:**
  * **Custom Salary Structures:** Basic pay, HRA, Dearness Allowance, Conveyance, PF, ESI, TDS.
  * **Attendance-Linked Calculations:** Automatically calculates payable days based on biometric/manual staff attendance.
  * **Advance & Loan Repayment:** Auto-deducts monthly EMI from staff payslip until loan is cleared.
  * **1-Click Monthly Payroll Generation:** Generates slips for 100+ staff in seconds with printable PDF payslips.

---

## 7. 💼 HireHub (Staff Recruitment)
* **Problem Solved:** Chaos in managing teacher resumes, interview scheduling, and re-entering employee data upon hiring.
* **Key Features:**
  * **Job Openings:** Post openings with subject, experience required, and salary range.
  * **Applicant Tracking:** `Applied` ➔ `Shortlisted` ➔ `Demo Class` ➔ `Interview` ➔ `Offered` ➔ `Hired`.
  * **1-Click Staff Onboarding:** Hired candidate is directly converted into an active staff profile with login credentials created.

---

## 8. 📱 Student & Parent Portals
* **Problem Solved:** Parents calling school repeatedly for homework, exam dates, fee balances, and attendance status.
* **Key Features:**
  * **Multi-Child Switching:** Single parent login handles multiple siblings in the same school.
  * **Real-time Attendance Alerts:** Instant status (Present / Absent) daily.
  * **Online Fee Payment:** Integrated payment gateway (Razorpay / Stripe / UPI) with instant receipt download.
  * **Digital Leave Application:** Parent applies for student sick leave with principal approval status.

---

## 9. 👑 SaaS Super Admin Platform
* **Problem Solved:** Manual school onboarding and difficulty controlling multi-school subscriptions and renewals.
* **Key Features:**
  * **School Directory:** View all onboarded schools, active student count, and storage used.
  * **Plan Packages:** Starter, Growth, Enterprise with student limits and module access toggles.
  * **Automated Expiry & Cut-offs:** Grace period alerts, auto-lock on non-payment.
  * **Impersonation Support:** 1-Click "Login as School Admin" for rapid client support and troubleshooting.
