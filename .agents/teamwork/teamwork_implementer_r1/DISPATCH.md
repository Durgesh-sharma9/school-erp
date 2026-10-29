# Dispatch: teamwork_implementer (Round 1)

Working directory: C:\webncode\school erp\.agents\teamwork\teamwork_implementer_r1
Parent directory: C:\webncode\school erp\.agents\teamwork\swe_1
Repository root: C:\webncode\school erp
Role: teamwork_implementer
Round: r1

<original_task>
This is a single self-contained fix; keep it small and focused. In the School ERP system, fix the student registration and editing flow so modifying an existing student updates their record instead of creating a duplicate entry, and remove all hardcoded mock student data so all records are dynamically handled per school tenant.

Working directory: C:\webncode\school erp
Integrity mode: development

## Requirements

### R1. Student Update & Edit Mode Handling
In `frontend/src/modules/students/StudentRegistrationPage.jsx` and `backend/src/modules/students/students.controller.js`, editing an existing student must update their existing record in-place rather than creating a new student entry. If an admission number already exists in that school tenant, submitting modifications must update the existing record, and the registration form must correctly track edit mode versus new registration mode and clear the edit state upon saving.

### R2. Dynamic Multi-Tenant Data Storage
Remove hardcoded mock student records from the backend controller (such as initial records in `TENANT_STUDENTS`), ensuring all student records are dynamically fetched, created, and updated strictly partitioned per school tenant (`x-school-id`).

## Acceptance Criteria

### Student Update and Edit State
- [ ] Modifying an existing student updates their record in-place (matched by admission number) without creating duplicate entries.
- [ ] If a student with the given admission number exists in the active tenant, updating modifies that existing student record.
- [ ] The student registration form correctly distinguishes between edit mode and new registration mode, and clears edit state upon successful save.

### Dynamic Tenant Storage
- [ ] Hardcoded mock student records are removed from `backend/src/modules/students/students.controller.js`.
- [ ] Each school tenant operates dynamically with clean data persistence partitioned by `x-school-id`.

### Verification
- [ ] Automated verification script tests student creation, in-place updates by admission number, prevention of duplicate records, and tenant isolation.
- [ ] Project frontend and backend build and lint checks pass without errors.
</original_task>
