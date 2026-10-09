# 👥 Roles & Permissions Specification (RBAC)

This document defines the Role-Based Access Control (RBAC) matrix and tenant security boundaries for the **Unified School ERP**.

---

## 🎭 User Roles Hierarchy

```text
👑 SUPER_ADMIN (Platform Owner - Software Provider)
      │
      └── 🏫 SCHOOL_ADMIN (School Principal / Director)
            │
            ├── 💰 ACCOUNTANT (Fees & Expenses Counter)
            ├── 👩‍🏫 TEACHER (Assigned Classes & Subjects)
            ├── 👨‍👩‍👦 PARENT (Linked Children Only)
            └── 🎒 STUDENT (Own Profile & Records Only)
```

---

## 📊 Detailed Permissions Matrix

| Functional Capability | `SUPER_ADMIN` | `SCHOOL_ADMIN` | `ACCOUNTANT` | `TEACHER` | `PARENT` | `STUDENT` |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Manage Schools & Subscriptions** | ✅ Full | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No |
| **Configure Plans & Expiry Dates** | ✅ Full | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No |
| **Toggle Modules (CRM, TimeTable)** | ✅ Full | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No |
| **Create Academic Sessions & Classes**| ❌ No | ✅ Full | ❌ No | ❌ No | ❌ No | ❌ No |
| **Create Teacher/Staff Accounts** | ❌ No | ✅ Full | ❌ No | ❌ No | ❌ No | ❌ No |
| **Student Admission Registration** | ❌ No | ✅ Full | 👁️ View | 👁️ View | ❌ No | ❌ No |
| **Setup Fee Structures** | ❌ No | ✅ Full | ✅ Full | ❌ No | ❌ No | ❌ No |
| **Collect Fees & Print Slips** | ❌ No | ✅ Full | ✅ Full | ❌ No | ❌ No | ❌ No |
| **View Fee Dues & Defaulters** | ❌ No | ✅ Full | ✅ Full | ❌ No | ❌ No | ❌ No |
| **Mark Daily Student Attendance** | ❌ No | ✅ Full | ❌ No | ✅ Assigned | ❌ No | ❌ No |
| **Schedule Exams & Enter Marks** | ❌ No | ✅ Full | ❌ No | ✅ Assigned | ❌ No | ❌ No |
| **Generate & Print Marksheets** | ❌ No | ✅ Full | ❌ No | ✅ Assigned | 👁️ Own Child | 👁️ Self |
| **Syllabus Tracker & Lesson Plans** | ❌ No | ✅ Full | ❌ No | ✅ Assigned | 👁️ Own Child | 👁️ Self |
| **Manage Class Timetable** | ❌ No | ✅ Full | ❌ No | 👁️ View | 👁️ Own Child | 👁️ Self |
| **Substitute Teacher Allocation** | ❌ No | ✅ Full | ❌ No | ❌ No | ❌ No | ❌ No |
| **Staff Salary Structure & Payout** | ❌ No | ✅ Full | 👁️ View | ❌ No | ❌ No | ❌ No |
| **Campus CRM Admission Inquiries** | ❌ No | ✅ Full | 👁️ View | ❌ No | ❌ No | ❌ No |
| **HireHub Teacher Recruitment** | ❌ No | ✅ Full | ❌ No | ❌ No | ❌ No | ❌ No |
| **Online Fee Payment** | ❌ No | ❌ No | ❌ No | ❌ No | ✅ Own Child | ❌ No |
| **Digital Leave Application** | ❌ No | ❌ No | ❌ No | ✅ Apply Self | ✅ Apply Child| ❌ No |

---

## 🔒 Strict Data Scoping Implementation

### 1. Tenant Scoping Middleware (`backend/src/middleware/tenant.js`)

```javascript
export const enforceTenant = (req, res, next) => {
  // Super Admin can switch tenants or view all
  if (req.user.role === 'SUPER_ADMIN') {
    return next();
  }

  // All other users MUST belong to a valid school
  if (!req.user.schoolId) {
    return res.status(403).json({ success: false, message: 'Forbidden: No school associated.' });
  }

  // Force query filter to match user's school
  req.schoolFilter = { schoolId: req.user.schoolId };
  next();
};
```

### 2. Teacher Class Assignment Scoping
When a teacher queries students, attendance, or marks, the query must verify that the teacher is explicitly assigned to that class section or subject:

```javascript
const teacherAssignments = await prisma.teacherAssignment.findMany({
  where: { staff: { userId: req.user.id } }
});
const allowedSectionIds = teacherAssignments.map(a => a.sectionId);
```

### 3. Parent Child Scoping
Parents are linked to specific students via `ParentStudentLink`:
```javascript
const parentLinks = await prisma.parentStudentLink.findMany({
  where: { parentId: req.user.id }
});
const allowedStudentIds = parentLinks.map(l => l.studentId);
```
Parents cannot view or modify any records outside this array.
