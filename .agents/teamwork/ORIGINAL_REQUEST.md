# Original User Request

## Approved Task Prompt — 2026-10-29T07:03:15Z

This is a single self-contained fix; keep it small and focused. In the School ERP system, fix the student registration and editing flow so modifying an existing student updates their record instead of creating a duplicate entry, and remove all hardcoded mock student data so all records are dynamically handled per school tenant.

Working directory: C:\webncode\school erp
Integrity mode: development

## Requirements

### R1. Student Update & Edit Mode Handling
In `frontend/src/modules/students/StudentRegistrationPage.jsx` and `backend/src/modules/students/students.controller.js`, editing an existing student must update their existing record in-place rather than creating a new student entry. If an admission number already exists in that school tenant, submitting modifications must update the existing record, and the registration form must correctly track edit mode versus new registration mode and clear the edit state upon saving.

### R2. Dynamic Multi-Tenant Data Storage
Remove hardcoded or mock student records from the backend controller (such as initial records in `TENANT_STUDENTS`), ensuring all student records are dynamically fetched, created, and updated strictly partitioned per school tenant (`x-school-id`).

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


## Approved Task Prompt — 2026-10-29T07:20:41Z

This is a single self-contained fix; keep it small and focused. In the School ERP student registration page (`frontend/src/modules/students/StudentRegistrationPage.jsx`), add an image removal cross button to all photo upload containers (Student Photo, Father's Photo, Mother's Photo) that immediately clears an uploaded or captured image and resets the container.

Working directory: C:\webncode\school erp
Integrity mode: development

## Requirements

### R1. Photo Removal Cross Button
In `frontend/src/modules/students/StudentRegistrationPage.jsx`, for each of the three photo containers (Student Photo, Father's Photo, Mother's Photo), display a remove/cross button (`X` icon, e.g. from `lucide-react`) on the image preview whenever an image is present (whether uploaded via file selection or captured via webcam). When no photo is present (default avatar/placeholder displayed), do not display the cross button.

### R2. Photo Clear and Input Reset Behavior
Clicking the cross button must immediately:
1. Remove and clear the photo from the form state and revert the preview back to the default avatar/placeholder.
2. Reset the associated file input value so that selecting the same file again triggers an upload and updates the preview.
3. Reset webcam capture state if the image was captured via webcam so subsequent captures work without issue.
4. Execute immediately without requiring a confirmation dialog.

### R3. Verification
Verify the implementation by ensuring the frontend builds and type-checks without errors, and writing automated component tests covering cross button appearance, click behavior, state reset, and file input clearing.

## Acceptance Criteria

### UI and Reset Behavior
- [ ] When a photo is present in Student Photo, Father's Photo, or Mother's Photo, a cross/remove button (`X` icon) is visible on top of or badge-aligned with the preview.
- [ ] When a container shows the default placeholder/avatar (no photo), the cross/remove button is not rendered.
- [ ] Clicking the cross button immediately removes the photo from the component state and resets the preview to the default placeholder/avatar without showing a confirmation popup.
- [ ] After clicking the cross button to remove an image, browsing and selecting the exact same image file from the file picker successfully uploads and displays the image again.
- [ ] When a photo is captured via webcam, the cross button appears and clicking it clears the captured photo, resets the state, and restores the default placeholder/avatar.

### Verification
- [ ] Frontend build / check succeeds with zero errors.
- [ ] Automated tests pass, verifying cross button visibility toggling, immediate removal on click, form state reset, and file input reset across all three photo upload containers.


## Approved Task Prompt — 2026-10-29T07:00:00Z

This is a single self-contained fix; keep it small and focused. In the School ERP Student List page (`frontend/src/modules/students/reports/StudentListPage.jsx`), add a View button in the Actions column that opens a comprehensive, styled student profile modal displaying all available student details.

Working directory: C:\webncode\school erp
Integrity mode: development

## Requirements

### R1. Student List View Action
In the ACTIONS column of the Student List table on `/student-list`, add a View button rendered with the `Eye` icon from `lucide-react`. Clicking the button opens a centered modal dialog displaying the full profile details of the selected student.

### R2. Student Profile Modal Content & Layout
The modal must include:
- A header displaying the student's photo (or photo placeholder/avatar), full name, Class-Section, Roll No, Admission No, and an Active/Enrolled status badge.
- A clean, tabbed or sectioned layout displaying all available student information organized into:
  1. Basic & Personal Details: Date of Birth, Gender, Category, Blood Group, Nationality, Mother Tongue.
  2. Parent / Guardian Details: Father's name, phone, occupation; Mother's name, phone, occupation; Guardian details.
  3. Contact & Address: Full address, contact numbers, email.
  4. Academic & School Info: Enrollment No, Admission Date, Student Type (New/Old), Fee Type (Day Scholar/Hosteller), Stream, House.

### R3. Profile Modal Actions
The modal footer must provide the following action buttons:
- "Edit Student": navigates/loads the student into edit mode in `StudentRegistrationPage`.
- "Print Profile / Slip": triggers the browser print dialog (`window.print()`) with print styling appropriate for a profile slip.
- "Close": dismisses the modal and returns to the Student List view.

### R4. Verification
Verify the implementation by ensuring the frontend builds without errors and writing automated component tests covering modal opening, section rendering, and action triggers.

## Acceptance Criteria

### UI and Modal Behavior
- [ ] Clicking the View (Eye icon) button on any row in the Student List table opens the centered student profile modal with that student's details.
- [ ] The modal header displays the student's photo/avatar, full name, Class-Section, Roll No, Admission No, and status badge.
- [ ] All four detail sections (Basic & Personal Details, Parent/Guardian Details, Contact & Address, Academic & School Info) render the corresponding student data fields.
- [ ] Clicking "Close" or outside/escape dismisses the modal.
- [ ] Clicking "Edit Student" transitions to the student registration page with the current student loaded for editing.
- [ ] Clicking "Print Profile / Slip" invokes `window.print()` with printable layout formatting.

### Verification
- [ ] Frontend build/type-check succeeds without errors.
- [ ] Automated component tests pass, verifying the View button click, modal rendering of student profile data, and modal action button behaviors.

---
Working directory: C:\webncode\school erp\.agents\teamwork\swe_1\
Original Request path: C:\webncode\school erp\.agents\teamwork\ORIGINAL_REQUEST.md
Project directory: C:\webncode\school erp
Your identity: teamwork_swe
