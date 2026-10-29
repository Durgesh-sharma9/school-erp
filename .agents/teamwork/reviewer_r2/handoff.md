# Reviewer Round 2 Handoff Report

## Executive Summary
Adversarial review identified 6 concrete defects and edge cases in the Round 1 implementation, including a critical race condition where media stream tracks were leaked if the user cancelled or unmounted the modal while `getUserMedia` was in-flight, missing camera toggle functionality (open-issues ledger item 2), lack of `OverconstrainedError` fallback on desktop USB webcams, stale preview retention across modal sessions, and document viewfinder aspect ratio mismatch. All issues have been resolved, verified with 6 new automated test cases (40 total passing unit/integration tests), and confirmed with a successful Vite production build.

---

## 1. What the prior attempt got wrong

### Issue 1: Race condition & MediaStream track leak on in-flight `getUserMedia`
- **Input:** User opens modal and immediately clicks 'X' or 'Cancel' (or navigates away) while `navigator.mediaDevices.getUserMedia(...)` is pending.
- **Expected:** When the async promise resolves, since the modal was already closed/unmounted, all acquired tracks must be stopped immediately so the camera indicator turns off.
- **Actual:** `stopTracks()` ran when `streamRef.current` was still null. When `getUserMedia` resolved, `streamRef.current = stream` was set, but nothing ever called `stop()` on the newly acquired stream, leaking the active camera hardware stream indefinitely.
- **Root Cause:** Missing cancellation tracking (`isCancelledRef`) to discard and stop streams acquired after modal close/unmount.

### Issue 2: Missing Front / Back / External Camera Toggle (Open Issues Ledger Item 2)
- **Input:** User registering student on a mobile device, tablet, or PC with both front-facing and rear/external webcams.
- **Expected:** Ability to switch between Front (`user`) and Back/External (`environment`) camera to photograph students.
- **Actual:** Prior attempt hardcoded `facingMode: 'user'` with zero camera switching capabilities.
- **Root Cause:** No `facingMode` state, re-acquisition logic, or `<SwitchCamera />` toggle UI.

### Issue 3: External USB webcams failing on `OverconstrainedError`
- **Input:** Desktop USB webcams that don't support or report hardware facing mode.
- **Expected:** Fallback to standard `{ video: true, audio: false }` constraint.
- **Actual:** Camera threw `OverconstrainedError` and failed without recovery.
- **Root Cause:** Strict facingMode constraint without fallback handling.

### Issue 4: Stale photo preview glitch on reopening modal
- **Input:** User captures a snapshot, clicks Cancel / 'X', then reopens modal for another photo.
- **Expected:** Modal opens in live feed view with Capture button.
- **Actual:** Reopening modal rendered the old stale snapshot with "Retake" and "Done" buttons while `getUserMedia` initialized.
- **Root Cause:** `capturedImage` was not reset on modal close or `isOpen: false`.

### Issue 5: Viewfinder aspect ratio mismatch for documents
- **Input:** Capturing document photos in Tab 5 (e.g. Birth Certificate, Transfer Certificate).
- **Expected:** 4:3 rectangular viewfinder matching document framing and capture aspect ratio.
- **Actual:** Viewfinder was locked at `w-64 h-64` square with `object-cover`, cropping the sides of rectangular documents in the preview.
- **Root Cause:** Non-adaptive viewport styling.

### Issue 6: Unconstrained canvas payload risking LocalStorage quota
- **Input:** Snapping multiple high-res document images with 1080p/4K webcams.
- **Expected:** Canvas scales down to max 1280px with quality 0.88 (~80-120KB).
- **Actual:** Canvas saved full unconstrained resolution (1-3MB per document), risking `QuotaExceededError` in `localStorage`.
- **Root Cause:** Missing dimension clamping on document snapshot canvas.

---

## 2. What I changed

1. **`frontend/src/modules/students/StudentRegistrationPage.jsx`**:
   - Added `isCancelledRef` to cancel in-flight `getUserMedia` requests and stop all tracks immediately if closed/unmounted before resolution.
   - Added camera flip / toggle state (`facingMode`: `'user'` | `'environment'`), toggle handler, and interactive `<SwitchCamera />` control button in the live viewport header.
   - Added fallback recovery for `OverconstrainedError` to `{ video: true, audio: false }`.
   - Added stale preview cleanup on modal close / unmount (`setCapturedImage(null)` and `setCameraError(null)`).
   - Added Escape key handler for accessible modal dismissal.
   - Adaptive viewport aspect ratio: `w-64 h-64 sm:w-72 sm:h-72` with circular face guide for avatars, `w-full max-w-sm aspect-[4/3]` with document frame for documents.
   - Clamped document canvas max dimension to 1280px with JPEG quality 0.88 to prevent LocalStorage quota overflow.
   - Added explicit `videoRef.current.muted = true` to prevent browser autoplay policy rejection.
   - Added accessibility `aria-label` attributes to modal action buttons and camera trigger buttons in `StudentAvatar` and `DocumentCard`.

2. **`frontend/src/modules/students/__tests__/StudentWebcamCapture.test.jsx`**:
   - Added test: race condition track stoppage when `getUserMedia` resolves after unmount.
   - Added test: camera toggle between Front and Back camera with constraint verification.
   - Added test: automatic fallback to `{ video: true }` upon `OverconstrainedError`.
   - Added test: Escape key modal close and track stoppage.
   - Added test: stale preview prevention upon modal reopen.
   - Added test: document card camera capture in Documents tab.

---

## 3. Verification Record

- **Deep Verification (ran actual tests):**
  - Command: `npm --prefix "frontend" test` (`npx vitest run`)
  - Output: **4 passed files, 40 passed tests, 0 failures**:
    - `src/modules/students/__tests__/StudentWebcamCapture.test.jsx`: 18 tests passed
    - `src/modules/students/reports/StudentProfileModal.test.jsx`: 13 tests passed
    - `src/modules/students/reports/StudentListPage.test.jsx`: 5 tests passed
    - `src/modules/students/__tests__/StudentRegistrationEditFlow.test.jsx`: 4 tests passed
  - Command: `npm --prefix "frontend" run build` (`vite build`)
  - Output: Transformed 3445 modules, bundled dist cleanly in 11.89s with exit code 0.

- **Shallow Verification (manual only):**
  - Verified component structure, Tailwind styles, and responsive layout across desktop and mobile breakpoints.
  - Verified keyboard Escape key handling and focus management.

- **Unverified aspects:**
  - Physical camera hardware switching on physical iOS/Android mobile devices (tested in simulated JSDOM environment with mocked MediaDevices and constraint assertions).

---

## 4. Known Issues
- `Minor Robustness Risk`: On browsers with third-party cookie restrictions or strict iframe permissions, `navigator.mediaDevices` may be undefined unless served over HTTPS or localhost; handled gracefully with user-friendly error guidance and fallback to the Browse file picker.

---

## 5. Remaining risk & next step
The implementation is solid and verified. Ready for sentinel commit and final handoff.
