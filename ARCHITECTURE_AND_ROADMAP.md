# 🌟 UNIFIED SCHOOL ERP (SaaS Platform) - ARCHITECTURE & FLOW DOCUMENTATION

---

## 📌 Executive Overview
**School ERP** is an enterprise-grade, multi-tenant SaaS platform integrating:
* 🎓 **DailyTest** (Attendance, Daily Tests, Marksheet Generation & Performance Analytics)
* 📅 **TimeTable Pro** (Period Scheduling, Teacher Conflict Prevention, Substitutes)
* 💼 **HireHub** (Staff Recruitment, Vacancies, Interview Pipeline)
* 📖 **Syllabus Tracker** (Chapter & Topic Progression, Notebook Checks)
* 🎯 **Campus CRM** (Admissions Pipeline, Inquiries, Follow-up Logs)
* 💳 **Fee Flow** (Fee Structure, Counter Collection, Invoices, Dues & Defaulters)
* 💵 **Salary & Payroll** (Staff Biometric Attendance, Salary Rules, Payslips, Advances)
* 📱 **Student & Parent Portals** (Real-time updates, Leave Requests, Online Fee Payments)

---

## 🌌 Platform Hierarchy Flow (SaaS Level vs Tenant Level)

```mermaid
flowchart TD
    classDef superAdmin fill:#6366f1,stroke:#4338ca,stroke-width:3px,color:#fff;
    classDef school fill:#0284c7,stroke:#0369a1,stroke-width:2px,color:#fff;
    classDef module fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#38bdf8;
    classDef userRole fill:#1e293b,stroke:#a855f7,stroke-width:2px,color:#e2e8f0;

    SA["👑 SUPER ADMIN (You / Software Owner)"]:::superAdmin

    SA --> Plans["💳 Subscription & Billing Engine<br/>(Starter / Growth / Pro)"]:::module
    SA --> TenantMgr["🏫 School Onboarding & Tenant Manager"]:::module
    SA --> ModuleToggles["🎛️ Feature & Module Access Controller"]:::module

    TenantMgr --> Sch1["School A (e.g. DPS)"]:::school
    TenantMgr --> Sch2["School B (e.g. St. Xavier)"]:::school
    TenantMgr --> Sch3["School C (e.g. Model School)"]:::school

    Sch1 --> Adm["🏫 School Admin / Principal"]:::userRole

    Adm --> M1["🎯 Campus CRM"]:::module
    Adm --> M2["💳 Fee Flow"]:::module
    Adm --> M3["💵 Salary & Payroll"]:::module
    Adm --> M4["🎓 DailyTest & Attendance"]:::module
    Adm --> M5["📖 Syllabus Tracker"]:::module
    Adm --> M6["📅 TimeTable Pro"]:::module
    Adm --> M7["💼 HireHub"]:::module

    Adm --> RoleStaff["👩‍🏫 Teachers & 💰 Accountants"]:::userRole
    Adm --> RoleEnd["🎒 Students & 👨‍👩‍👦 Parents"]:::userRole
```

---

## 👥 Multi-Role & Permissions Matrix (RBAC)

| Role Code | Role Title | Tenant Filter Scope | Core Permissions & Capabilities |
| :--- | :--- | :--- | :--- |
| `super_admin` | **Platform Master** | `{}` *(Global - All Schools)* | Onboard schools, define subscription plans, handle billing cutoffs, toggle modules, impersonate school admin for support. |
| `school_admin`| **Principal / Director** | `{ school: user.school }` | Manage school academic sessions, classes, sections, staff accounts, approve admissions, school-wide reports. |
| `accountant` | **Fee & Cash Clerk** | `{ school: user.school }` | Fee collection counter, print payment slips, manage dues list, record school expenses, fee discount approvals. |
| `teacher` | **Faculty Member** | `{ school: user.school, assignedClasses: [...] }` | Mark daily class attendance, assign homework, upload study notes, enter exam & test marks, report remarks. |
| `student` | **Enrolled Student** | `{ school: user.school, _id: studentId }` | View personal attendance, class timetable, homework, download fee slips, view exam report cards. |
| `parent` | **Guardian** | `{ school: user.school, _id: { $in: linkedStudents } }` | Switch between children, real-time attendance alerts, pay fee online, inspect test performance, apply leave. |

---

## 🔒 Multi-Tenant Data Isolation Architecture (TestMaster Pattern)

```mermaid
sequenceDiagram
    autonumber
    actor Client as User / Browser
    participant Auth as Auth & JWT Middleware
    participant Tenant as Tenant Middleware (getSchoolFilter)
    participant DB as MongoDB Database

    Client->>Auth: Request + Bearer JWT Token
    Auth->>Tenant: Verify JWT & Attach req.user (school, role)
    
    alt User is super_admin
        Tenant->>DB: Query with filter {} (Sees all schools)
    else User is school_admin / accountant
        Tenant->>DB: Query with filter { school: req.user.school }
    else User is teacher
        Tenant->>DB: Query with filter { school: req.user.school, class: { $in: assignedClasses } }
    else User is parent
        Tenant->>DB: Query with filter { school: req.user.school, _id: { $in: linkedStudents } }
    end

    DB-->>Client: Returns strictly isolated school/user data
```

---

## 🧩 Unified Modules Integration Breakdown

```mermaid
graph LR
    classDef crm fill:#f97316,stroke:#c2410c,stroke-width:2px,color:#fff;
    classDef fee fill:#10b981,stroke:#047857,stroke-width:2px,color:#fff;
    classDef salary fill:#06b6d4,stroke:#0e7490,stroke-width:2px,color:#fff;
    classDef test fill:#8b5cf6,stroke:#6d28d9,stroke-width:2px,color:#fff;
    classDef syl fill:#ec4899,stroke:#be185d,stroke-width:2px,color:#fff;
    classDef time fill:#3b82f6,stroke:#1d4ed8,stroke-width:2px,color:#fff;
    classDef hire fill:#64748b,stroke:#334155,stroke-width:2px,color:#fff;

    A["🎯 Campus CRM<br/>(Admission Pipeline)"]:::crm --> B["🏫 Enrolled Student<br/>(Student Master)"]
    B --> C["💳 Fee Flow<br/>(Tuition, Dues & Receipts)"]:::fee
    B --> D["🎓 DailyTest<br/>(Attendance & Marksheet)"]:::test
    B --> E["📖 Syllabus Tracker<br/>(Topic Progress & Notebook)"]:::syl

    F["💼 HireHub<br/>(Teacher Recruitment)"]:::hire --> G["👩‍🏫 Hired Teacher<br/>(Staff Master)"]
    G --> H["💵 Salary & Payroll<br/>(Attendance, Allowance & Payslip)"]:::salary
    G --> I["📅 TimeTable Pro<br/>(Period Allocation & Substitutes)"]:::time
    G --> D
```

---

## 🗺️ Step-by-Step Modular Roadmap

1. **Step 1: Foundation Setup (Architecture Base)**
   * Frontend: React + Vite + Tailwind CSS + Lucide Icons + TanStack Table
   * Backend: Node.js (Express) + PostgreSQL + Prisma ORM + JWT Auth
   * Multi-Tenant Middleware (`tenant.js`) & Role-Based Access Control (`checkRole`)
   * Core Schema: `School`, `User`, `AcademicSession`, `Class`, `Section`, `Subject`

2. **Step 2: Super Admin Platform Engine**
   * School Onboarding & Approval workflow
   * Subscription Plans & Pricing engine (Student limits, expiry dates)
   * Feature & Module flags (Enable/disable CRM, Fee, Salary, etc. per school)
   * Login as School Admin (Impersonation for customer support)

3. **Step 3: Campus CRM Module**
   * Enquiry registration form & lead categorization (Hot / Warm / Cold)
   * Follow-up call logs and status tracking
   * 1-Click admission conversion into student master

4. **Step 4: Fee Flow Module**
   * Class-wise fee structure templates (Tuition, Transport, Exam, Term)
   * Fast Counter Collection with auto-generated receipt numbering
   * Dues & Defaulter tracking with printable reminders & WhatsApp/SMS alerts
   * Daily cash collection register & daybook

5. **Step 5: Salary & Payroll Module**
   * Staff salary components (Basic, HRA, Allowance, PF, ESI, Deductions)
   * Attendance-linked working days & unpaid leaves calculation
   * Advance salary & loan installment deductions
   * 1-Click monthly payroll generation & printable Payslips

6. **Step 6: DailyTest & Academic Performance**
   * Quick bulk student attendance marking (Web & Mobile optimized)
   * Daily test scheduling & subject mark entries
   * Automated grading, ranks, and customizable term marksheet generation

7. **Step 7: Syllabus Tracker Module**
   * Class & subject-wise chapter breakdown with sub-topics
   * Completed vs Pending topic progress percentages
   * Daily lesson plan logs & student notebook checking records

8. **Step 8: TimeTable Pro Module**
   * Dynamic class period schedule matrix
   * Teacher timetable & clash prevention algorithm
   * Absentee teacher substitution auto-recommender

9. **Step 9: HireHub Module**
   * School vacancy postings (Subject Teacher, Accountant, Peon, etc.)
   * Applicant screening pipeline (Applied -> Interview -> Offer -> Hired)
   * Direct 1-click staff onboarding into Staff Master

10. **Step 10: Student & Parent Mobile Portal**
    * Multi-child switching for parents
    * Real-time attendance, test score alerts, fee payments & leave applications
