# Dispatch to teamwork_victory_auditor

Working directory: C:\webncode\school erp\.agents\teamwork\victory_auditor
Repository root: C:\webncode\school erp
Role: teamwork_victory_auditor
Audit Target: SWE Light Student Registration Webcam Capture Modal

## 2026-10-29T08:05:53Z
You are teamwork_victory_auditor.
Your working directory is C:\webncode\school erp\.agents\teamwork\victory_auditor.
Your parent is swe_1 orchestrator (conversation ID: b315118b-d672-4dd5-ad34-154c30b3041f).
The project repository root is C:\webncode\school erp.

<original_task>
This is a single self-contained fix; keep it small and focused. Fix the camera button in the School ERP student registration photo upload cards to open a live webcam capture modal instead of the folder/file picker dialog, while keeping the Browse button opening the file dialog.

Working directory: C:\webncode\school erp
Integrity mode: development

## Requirements

### R1. Live Webcam Capture Modal
In `frontend/src/modules/students/StudentRegistrationPage.jsx` (and any related photo upload cards for Student Photo, Father's Photo, and Mother's Photo), clicking the Camera icon button must open a live webcam capture modal using browser `navigator.mediaDevices.getUserMedia({ video: true })` with a live video feed, "Capture", "Retake", and "Done/Use Photo" controls. Closing or cancelling the modal must cleanly stop all active media stream tracks.

### R2. Photo Form State Integration & File Browse Preservation
The snapshot captured via canvas must be converted to an image format compatible with the existing photo upload state and set as the selected image for the corresponding photo card. The "Browse" button must continue opening the system file picker to select images from disk as before.

## Acceptance Criteria

### Webcam Capture Modal & Lifecycle
- [ ] Clicking the camera icon on Student Photo, Father's Photo, or Mother's Photo opens a modal showing the live webcam video feed.
- [ ] The modal provides Capture, Retake, and Done/Use Photo buttons.
- [ ] Closing the modal or completing photo capture stops all media tracks so the camera indicator turns off.
- [ ] If camera access fails or is denied, an informative error message is displayed to the user.

### State & File Picker
- [ ] Clicking the "Browse" button continues to open the OS file selection dialog without opening the camera modal.
- [ ] Capturing a photo through the webcam modal updates the preview and sets the photo in the form state for the selected role (Student, Father, or Mother).

### Verification
- [ ] Project frontend builds and passes linting checks with no errors or regressions introduced.
- [ ] Component behavior verifies that camera stream tracks are cleanly stopped upon modal unmount or close.
</original_task>

The team claims completion of this task with 3 review rounds and 77 passing automated tests plus clean Vite build.
Conduct your independent 3-phase audit:
1. Timeline reconstruction
2. Cheating / test manipulation detection
3. Independent test execution (`npm --prefix "frontend" test` and `npm --prefix "frontend" run build`)
Deliver your audit report with CONFIRMED or REJECTED verdict to C:\webncode\school erp\.agents\teamwork\victory_auditor\handoff.md and send a message with your verdict.
