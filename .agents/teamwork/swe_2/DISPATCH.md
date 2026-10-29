# Dispatch Log

## 2026-10-29T07:21:35Z
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

---
Metadata & Directives:
- Working directory: C:\webncode\school erp\.agents\teamwork\swe_2
- Workspace root: C:\webncode\school erp
- Original request path: C:\webncode\school erp\.agents\teamwork\ORIGINAL_REQUEST.md
- Identity: teamwork_swe
