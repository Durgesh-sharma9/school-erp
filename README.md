# 🏫 Unified School ERP (Multi-Tenant SaaS)

Welcome to the **Unified School ERP Platform** repository. This is an enterprise-grade, multi-tenant Software-as-a-Service (SaaS) school management suite developed for the **WebNCode** ecosystem.

It unifies the best features of:
* 🎯 **Campus CRM** (Admissions pipeline, parent follow-ups, 1-click admission)
* 💳 **Fee Flow** (Tuition fees, counter collection, printable PDF slips, dues & defaulters)
* 🎓 **DailyTest & Academics** (Daily student attendance, unit tests, automated term marksheets)
* 📖 **Syllabus Tracker** (Chapters & subtopics progression %, lesson planning, notebook checking logs)
* 📅 **TimeTable Pro** (Period scheduling matrix, zero teacher clashes, automatic substitute allotment)
* 💵 **Salary & Payroll** (Staff attendance-linked salary, allowances, deductions, payslip PDFs)
* 💼 **HireHub** (Teacher & staff job openings, candidate screening, interview pipeline)
* 📱 **Student & Parent Portals** (Real-time attendance alerts, report cards, online fee payment)
* 👑 **SaaS Super Admin Platform** (Tenant onboarding, plans, billing cut-offs, feature flags)

---

## 🛠️ Technology Stack

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Frontend** | React 18+ (Vite) | Lightning-fast development & HMR, modular architecture |
| **Styling & UI** | Tailwind CSS + Lucide Icons | Clean, responsive modern SaaS dashboard |
| **Data Tables** | TanStack Table (v8) | High-performance search, filtering, and pagination for 1,000+ student records |
| **Charts & Analytics**| Recharts | Interactive visual revenue, fee collection, and attendance charts |
| **Backend Runtime** | Node.js (v20+) & Express.js | Scalable, lightweight REST API engine |
| **Database** | PostgreSQL | 100% ACID compliance for fee transactions, referential integrity |
| **ORM Layer** | Prisma ORM | Typesafe client, database-agnostic schema, seamless migrations |
| **Authentication** | JWT (JSON Web Tokens) + bcryptjs | Multi-tenant Role-Based Access Control (RBAC) |
| **PDF Generation** | PDFMake / jsPDF-autotable | High-quality printable receipts, marksheets, and payslips |
| **Excel Export/Import**| XLSX (SheetJS) | Bulk student & staff data onboarding |

---

## 📚 Project Documentation Hub

This project is divided into modular specification documents so that developers and AI pair programmers have crystal-clear context at every step:

| Document | Purpose |
| :--- | :--- |
| [INSTRUCTIONS.md](./INSTRUCTIONS.md) | Standard development guidelines, folder rules, coding conventions, testing steps. |
| [ROADMAP_8_PARTS.md](./ROADMAP_8_PARTS.md) | Phase-by-phase implementation plan (Part 1 through Part 8) with testing checklists. |
| [DATABASE_SCHEMA_PRISMA.md](./DATABASE_SCHEMA_PRISMA.md) | Complete PostgreSQL relational schema definitions for all modules using Prisma. |
| [ROLES_AND_PERMISSIONS.md](./ROLES_AND_PERMISSIONS.md) | Detailed RBAC permissions matrix and TestMaster multi-tenant isolation rules. |
| [MODULES_SPECIFICATION.md](./MODULES_SPECIFICATION.md) | Deep functional breakdown for each of the 8 individual modules. |
| [dashboard.html](./dashboard.html) | Interactive HTML visual dashboard with Dark Mode and Glow Flow Diagrams. |

---

## 📁 Repository Directory Structure

```text
school erp/
├── backend/                   # Express.js REST API server
│   ├── prisma/
│   │   ├── schema.prisma      # Unified database schema
│   │   └── migrations/        # SQL migration history
│   ├── src/
│   │   ├── config/            # Prisma client, environment variables
│   │   ├── middleware/        # auth.js, tenant.js, errorHandler.js
│   │   ├── modules/           # Feature modules (auth, fees, syllabus, timetable, etc.)
│   │   └── utils/             # Helper functions, PDF generators, excel parsers
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/                  # React (Vite) Single Page Application
│   ├── src/
│   │   ├── assets/            # Logos, static illustrations
│   │   ├── components/        # Reusable UI components (Sidebar, Navbar, Tables, Modals)
│   │   ├── context/           # AuthContext, TenantContext
│   │   ├── modules/           # Dedicated pages per ERP module
│   │   ├── services/          # Axios API communication layer
│   │   └── App.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── README.md                  # Master project guide (This file)
├── INSTRUCTIONS.md            # Developer coding instructions & rules
├── ROADMAP_8_PARTS.md         # 8-Part step-by-step phased plan
├── DATABASE_SCHEMA_PRISMA.md  # Unified database schema
├── ROLES_AND_PERMISSIONS.md   # Role & security matrix
└── dashboard.html             # Visual glow flow architecture dashboard
```
