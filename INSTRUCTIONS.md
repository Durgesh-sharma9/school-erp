# 📋 Project Instructions & Developer Guidelines

This document establishes the architectural rules, coding standards, multi-tenant security protocols, and phased execution workflow for developing the **Unified School ERP**.

---

## 📁 0. Strict Folder Structure Integrity Rule (Zero Clutter Policy)

**This is a strictly enforced project rule for all developers and AI pair programmers:**
1. **Never Create Loose Files in Root or Generic Folders:**
   * No loose `.js` or `.jsx` files placed in `src/` or `src/components/` without clear categorization.
   * Every new feature MUST live inside its dedicated feature module under `backend/src/modules/<feature_name>/` and `frontend/src/modules/<feature_name>/`.
2. **Follow Vertical Slice Architecture:**
   * Backend feature module structure:
     `controller.js` ➔ `routes.js` ➔ `service.js` (inside `src/modules/<feature>/`).
   * Frontend feature module structure:
     `Pages`, `Components`, and `Services` specific to that module (inside `src/modules/<feature>/`).
3. **Keep Shared Folders Pure:**
   * `components/ui/` is ONLY for atom UI components (Button, Modal, Input, Badge).
   * `core/utils/` is ONLY for cross-cutting helpers (ImageKit, Nodemailer, WhatsApp, PDF).
   * If a utility is used by only one module, keep it inside that module's folder.
4. **Professional Naming Convention:**
   * PascalCase for React components (`StudentList.jsx`, `FeeCounter.jsx`).
   * camelCase for controllers, services, routes (`fees.controller.js`, `fees.routes.js`).

---

## 🚦 Mandatory Pre-Flight Rule (Read Before Starting Work)

**Before starting ANY new part, module, feature, or bug fix:**
1. 📖 **Read [INSTRUCTIONS.md](./INSTRUCTIONS.md):** Re-verify zero-clutter folder rules, multi-tenant scoping (`schoolId`), and ACID transaction requirements.
2. 🗺️ **Read [ROADMAP_8_PARTS.md](./ROADMAP_8_PARTS.md):** Check the exact scope, deliverable APIs, frontend pages, and testing criteria for the active part.
3. 🗄️ **Read [DATABASE_SCHEMA_PRISMA.md](./DATABASE_SCHEMA_PRISMA.md) & [MODULES_SPECIFICATION.md](./MODULES_SPECIFICATION.md):** Ensure model fields and business logic match the specification exactly.
4. 🚀 **Only then write code:** Always code inside the designated module directory (`modules/<feature>/`). Never create unorganized files.

---

## 📝 Mandatory Post-Task Rule (Update PROJECT_JOURNEY.md After Every Task)

**Immediately after finishing ANY task, feature, or code change:**
1. 🖊️ **Update [PROJECT_JOURNEY.md](./PROJECT_JOURNEY.md):** Add a new numbered entry `[Entry #XX]` recording:
   * **Timestamp & Phase**
   * **Goal / Prompt** from user
   * **Exact Actions Taken** (Files created/edited, commands executed)
   * **Verification Status**
   * **Next Task in Queue**
2. 🔄 Keep the summary header in `PROJECT_JOURNEY.md` (Active Phase, Last Updated) in sync.

---

## 🔒 1. Golden Multi-Tenant Security Rules

The School ERP is a multi-tenant platform. A breach where School A sees School B's students or fee collection is catastrophic. Follow these non-negotiable rules:

1. **Mandatory `schoolId` on All Tenant Models:**
   * Every model (except global SaaS models like `Plan`, `SuperAdminUser`) MUST contain a `schoolId String` foreign key referencing `School.id`.
2. **Never Trust Client-Supplied `schoolId`:**
   * In POST/PUT/DELETE requests, NEVER read `schoolId` from `req.body.schoolId`.
   * Always override or inject `schoolId` from the authenticated JWT session:
     ```javascript
     const schoolId = req.user.schoolId;
     ```
3. **Always Scope Prisma Queries:**
   * In every query (findMany, findUnique, update, delete), enforce `where: { schoolId, ... }`.
4. **Super Admin Exemption:**
   * Only requests where `req.user.role === 'super_admin'` are allowed to query globally across schools.
5. **Parent & Teacher Fine-Grained Isolation:**
   * A teacher can only query classes/sections assigned to them in `teacherAssignment`.
   * A parent can only query student records matching `parent.linkedStudents`.

---

## 🛠️ 2. Coding & Architectural Standards

### Backend (Node.js + Express + Prisma)
* **Modular Structure:** Group by feature modules (e.g. `src/modules/fees`, `src/modules/attendance`, `src/modules/timetable`) rather than placing 50 controllers in one folder.
* **Async Error Handling:** Wrap all controller methods with `asyncHandler` and throw custom `ApiError(statusCode, message)`.
* **ACID Transactions for Money:** All fee payments, receipts, and salary payout generation MUST run inside `prisma.$transaction([...])`.
* **Password Security:** Always hash passwords using `bcrypt.hash(password, 12)`. Never return password fields in JSON responses.
* **Database Migrations:** Never alter the database manually. Always use `npx prisma migrate dev --name <migration_name>`.

### Frontend (React + Vite + Tailwind CSS)
* **Design Language:** Modern, clean, professional SaaS dashboard (Slate/Indigo/Cyan theme).
* **Responsive First:** Teacher and Parent portals MUST be 100% mobile responsive (touch-friendly buttons, card layouts on mobile).
* **Performance:** Heavy tables (Students list, Fee register) must use pagination and TanStack Table to avoid DOM lag.
* **Feedback & Toasts:** Every user action (Save, Delete, Collect Fee, Mark Attendance) must trigger an instant toast notification.
* **Print Styles:** Printable receipts, marksheets, and payslips must have dedicated `@media print` CSS classes so they print on clean A4 paper without headers or sidebars.

---

## ⚙️ 3. Phased Execution Protocol

To keep this massive project manageable, robust, and bug-free:
1. **Develop One Part at a Time:**
   * We will NEVER attempt to build Part 4 before Part 1, 2, and 3 are functionally operational.
2. **Verification Checkpoints:**
   * At the end of each Part, verify against the testing checklist in [ROADMAP_8_PARTS.md](./ROADMAP_8_PARTS.md).
   * Ensure APIs return proper responses and UI renders correctly.
3. **Seed Data:**
   * Keep a `seed.js` script updated so a new developer can seed a demo school ("DPS International"), demo classes (1 to 10), demo students, and staff with 1 command.

---

## 🚀 4. How to Run & Test (Quick Reference)

### Backend:
```bash
cd backend
npm install
# Set DATABASE_URL in .env
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

### Frontend:
```bash
cd frontend
npm install
npm run dev
```
