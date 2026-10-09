# 📁 Enterprise Folder Structure Specification

This document defines the production-grade, modular folder structure for the **Unified School ERP Platform**. 

It follows the **Vertical Slice / Modular Feature Architecture**, ensuring that each module (Fees, Timetable, Syllabus, DailyTest, CRM, Salary, etc.) is self-contained, easy to maintain, and completely isolated from other modules.

---

## 🏗️ High-Level Project Overview

```text
C:\webncode\school erp\
├── backend/                       # Node.js + Express + Prisma + PostgreSQL
└── frontend/                      # React 18+ (Vite) + Tailwind CSS + Lucide Icons
```

---

## ⚙️ Backend Structure (`backend/`)

```text
backend/
├── prisma/
│   ├── schema.prisma              # Complete PostgreSQL database schema
│   ├── seed.js                    # Seeder script for demo school, roles & classes
│   └── migrations/                # Version-controlled SQL migration history
│
├── src/
│   ├── config/                    # Global configurations
│   │   ├── db.js                  # Prisma Client singleton
│   │   └── env.js                 # Environment variable loader & validator
│   │
│   ├── core/                      # Shared infrastructure & utilities
│   │   ├── middleware/            # Core HTTP middlewares
│   │   │   ├── auth.js            # JWT verification & user attachment
│   │   │   ├── tenant.js          # Multi-tenant getSchoolFilter & validation
│   │   │   ├── rbac.js            # Role-Based Access Control guards
│   │   │   └── errorHandler.js    # Global error handler with ApiError
│   │   └── utils/                 # Shared helper functions
│   │       ├── apiResponse.js     # Standardized JSON response envelope
│   │       ├── apiError.js        # Custom error class with HTTP status codes
│   │       ├── asyncHandler.js    # Async route wrapper (eliminates try/catch boilerplate)
│   │       └── pdfService.js      # Reusable PDF generator for receipts & payslips
│   │
│   ├── modules/                   # 📦 Self-Contained Feature Modules
│   │   ├── auth/                  # Login, Logout, Password Change, Token Refresh
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.routes.js
│   │   │   └── auth.service.js
│   │   │
│   │   ├── schools/               # School profile, settings, branding, session
│   │   │   ├── schools.controller.js
│   │   │   └── schools.routes.js
│   │   │
│   │   ├── academics/             # Sessions, Classes, Sections, Subjects
│   │   │   ├── academics.controller.js
│   │   │   └── academics.routes.js
│   │   │
│   │   ├── students/              # Admissions, Student directory, Parent linking
│   │   │   ├── students.controller.js
│   │   │   └── students.routes.js
│   │   │
│   │   ├── staff/                 # Staff directory, Teacher subject assignments
│   │   │   ├── staff.controller.js
│   │   │   └── staff.routes.js
│   │   │
│   │   ├── fees/                  # Fee structures, Counter collection, Receipts, Dues
│   │   │   ├── fees.controller.js
│   │   │   └── fees.routes.js
│   │   │
│   │   ├── attendance/            # Student & Staff daily attendance
│   │   │   ├── attendance.controller.js
│   │   │   └── attendance.routes.js
│   │   │
│   │   ├── dailytest/             # Daily tests, Marks entry, Automated marksheets
│   │   │   ├── dailytest.controller.js
│   │   │   └── dailytest.routes.js
│   │   │
│   │   ├── syllabus/              # Chapters, Topic progress %, Notebook checking
│   │   │   ├── syllabus.controller.js
│   │   │   └── syllabus.routes.js
│   │   │
│   │   ├── timetable/             # Period matrix, Clash prevention, Substitutes
│   │   │   ├── timetable.controller.js
│   │   │   └── timetable.routes.js
│   │   │
│   │   ├── salary/                # Staff payroll, Salary rules, Monthly payslips
│   │   │   ├── salary.controller.js
│   │   │   └── salary.routes.js
│   │   │
│   │   ├── crm/                   # Admission inquiries, Follow-up logs, 1-Click admission
│   │   │   ├── crm.controller.js
│   │   │   └── crm.routes.js
│   │   │
│   │   ├── hirehub/               # Teacher job vacancies, Applicant tracking
│   │   │   ├── hirehub.controller.js
│   │   │   └── hirehub.routes.js
│   │   │
│   │   └── saas/                  # Super Admin: Plans, Tenant management, Billing
│   │       ├── saas.controller.js
│   │       └── saas.routes.js
│   │
│   ├── app.js                     # Express app instance, security middlewares, route mounter
│   └── server.js                  # HTTP server bootstrap, port listener & graceful shutdown
│
├── .env.example                   # Template environment variables
├── .gitignore
└── package.json
```

---

## 🎨 Frontend Structure (`frontend/`)

```text
frontend/
├── public/                        # Static assets (favicons, default school logos)
│
├── src/
│   ├── assets/                    # Illustrations, SVG logos, placeholder avatars
│   │
│   ├── components/                # Shared Reusable UI Components
│   │   ├── ui/                    # Atom design components
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Dropdown.jsx
│   │   │   ├── Table.jsx          # TanStack Table wrapper
│   │   │   └── Spinner.jsx
│   │   │
│   │   ├── layout/                # Shell & navigation components
│   │   │   ├── Sidebar.jsx        # Dynamic role-based sidebar
│   │   │   ├── Navbar.jsx         # Search, notification bell, user profile
│   │   │   ├── PageHeader.jsx     # Breadcrumbs, title & action buttons
│   │   │   └── TenantSwitcher.jsx # Academic year & branch dropdown
│   │   │
│   │   ├── feedback/              # User feedback elements
│   │   │   ├── Toast.jsx
│   │   │   ├── ConfirmModal.jsx
│   │   │   └── EmptyState.jsx
│   │   │
│   │   └── print/                 # Printable document templates (A4 ready)
│   │       ├── PrintableReceipt.jsx
│   │       ├── PrintableMarksheet.jsx
│   │       └── PrintablePayslip.jsx
│   │
│   ├── context/                   # Global React State Management
│   │   ├── AuthContext.jsx        # Current user, JWT token, login/logout
│   │   └── TenantContext.jsx      # Active school details, session, module flags
│   │
│   ├── hooks/                     # Custom React Hooks
│   │   ├── useAuth.js             # Convenient auth context consumer
│   │   ├── useTenant.js           # Convenient school context consumer
│   │   └── usePrint.js            # Trigger browser print dialog cleanly
│   │
│   ├── services/                  # Network & API Layer
│   │   ├── api.js                 # Axios instance with auth interceptors
│   │   └── endpoints.js           # Centralized API route URLs
│   │
│   ├── modules/                   # 📦 Feature-Specific Pages & Components
│   │   ├── auth/                  # Login screen, Forgot password
│   │   ├── dashboard/             # Role-specific dashboards (Admin, Teacher, Parent)
│   │   ├── academics/             # Classes, Sections & Subjects setup page
│   │   ├── students/              # Student directory, Admission form, Profile view
│   │   ├── staff/                 # Staff list, Teacher class assignments
│   │   ├── fees/                  # Fee counter, Printable receipt, Dues report
│   │   ├── attendance/            # Bulk attendance sheet, Monthly percentage registers
│   │   ├── dailytest/             # Test planner, Mark entry grid, Marksheet generator
│   │   ├── syllabus/              # Chapter completion tree, Lesson plans, Notebook checks
│   │   ├── timetable/             # Weekly period grid, Clash alert, Substitute finder
│   │   ├── salary/                # Monthly payroll wizard, Payslip generator
│   │   ├── crm/                   # Kanban admission pipeline, Follow-up call logs
│   │   ├── hirehub/               # Vacancy postings, Applicant review board
│   │   ├── portals/               # Clean mobile views for Parents & Students
│   │   └── saas/                  # Super Admin platform billing & school controls
│   │
│   ├── routes/                    # Routing System
│   │   ├── AppRoutes.jsx          # Route definitions
│   │   └── ProtectedRoute.jsx     # Guard for role & authenticated sessions
│   │
│   ├── utils/                     # Formatting & calculation utilities
│   │   ├── formatCurrency.js      # Indian Rupee format (₹12,500)
│   │   └── formatDate.js          # DD/MM/YYYY formatting
│   │
│   ├── App.jsx                    # Root component with providers
│   ├── index.css                  # Tailwind styles & print CSS
│   └── main.jsx                   # React entrypoint
│
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

---

## 🌟 Why This Structure is Industry Best-Practice:

1. **Modular Slice Architecture:** Ek feature ke badalne se dusre feature me koi bug nahi aata. Agar kal ko `hostel` ya `transport` add karna ho, to sirf ek naya folder `modules/transport/` add hoga!
2. **Zero Confusion:** Naye developer ko 50 files me dhoondna nahi padega—fees ka kaam hai to direct `modules/fees/` me mil jayega.
3. **Enterprise Scalable:** 10,000 students aur 500 schools ke scale par bhi codebase ultra-clean aur manageable rahega.
