import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import StudentRegistrationPage, { WebcamCaptureModal } from '../StudentRegistrationPage';

// Helper to create mock media stream with spyable tracks
function createMockStream() {
  const tracks = [
    {
      id: 'mock-track-1',
      kind: 'video',
      readyState: 'live',
      stop: vi.fn(function () {
        this.readyState = 'ended';
      })
    }
  ];

  return {
    getTracks: vi.fn(() => tracks),
    getVideoTracks: vi.fn(() => tracks),
    getAudioTracks: vi.fn(() => []),
    _tracks: tracks
  };
}

// Mock AuthContext
vi.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-admin', role: 'admin', schoolId: 'SCH-001' }
  })
}));

// Mock tenantStore
vi.mock('../../../services/tenantStore', async (importOriginal) => {
  const actual = await importOriginal();
  Object.assign(actual.tenantStore, {
    getStudents: vi.fn(() => []),
    saveStudent: vi.fn((student) => student),
    updateStudent: vi.fn((id, student) => student),
    getPendingEditStudent: vi.fn(() => null),
    clearPendingEditStudent: vi.fn(),
    getPendingRegistration: vi.fn(() => null),
    clearPendingRegistration: vi.fn()
  });
  return actual;
});

describe('WebcamCaptureModal Component Lifecycle & Controls', () => {
  let mockStream;

  beforeEach(() => {
    mockStream = createMockStream();

    // Mock HTMLMediaElement.prototype.play
    window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);

    // Mock HTMLCanvasElement.prototype.getContext
    window.HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
      drawImage: vi.fn(),
      getImageData: vi.fn()
    }));
    window.HTMLCanvasElement.prototype.toDataURL = vi.fn(
      () => 'data:image/jpeg;base64,capturedSnapshotMock'
    );

    // Mock navigator.mediaDevices
    Object.defineProperty(navigator, 'mediaDevices', {
      writable: true,
      configurable: true,
      value: {
        getUserMedia: vi.fn().mockResolvedValue(mockStream)
      }
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('R1: starts live webcam stream and renders live video view when opened', async () => {
    render(
      <WebcamCaptureModal
        isOpen={true}
        onClose={vi.fn()}
        onCapture={vi.fn()}
        title="Student Photo"
      />
    );

    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith(
      expect.objectContaining({
        video: expect.any(Object),
        audio: false
      })
    );

    expect(screen.getByText(/Capturing: Student Photo/i)).toBeTruthy();

    await waitFor(() => {
      expect(screen.getByText('LIVE')).toBeTruthy();
      expect(screen.getByRole('button', { name: /Capture/i })).toBeTruthy();
    });
  });

  it('R1 & Acceptance: provides Capture, Retake, and Done/Use Photo buttons in flow', async () => {
    const handleCaptureMock = vi.fn();
    const handleCloseMock = vi.fn();

    render(
      <WebcamCaptureModal
        isOpen={true}
        onClose={handleCloseMock}
        onCapture={handleCaptureMock}
        title="Father's Photo"
      />
    );

    // 1. Initial Live view: Capture button exists
    const captureButton = await screen.findByRole('button', { name: /Capture/i });
    expect(captureButton).toBeTruthy();

    // 2. Click Capture
    fireEvent.click(captureButton);

    // 3. Snapshot preview view: Retake and Done / Use Photo buttons exist
    const retakeButton = await screen.findByRole('button', { name: /Retake/i });
    const doneButton = await screen.findByRole('button', { name: /Done \/ Use Photo/i });
    expect(retakeButton).toBeTruthy();
    expect(doneButton).toBeTruthy();

    // 4. Click Retake -> switches back to Live view with Capture button
    fireEvent.click(retakeButton);
    expect(await screen.findByRole('button', { name: /Capture/i })).toBeTruthy();

    // 5. Capture again and click Done / Use Photo
    fireEvent.click(screen.getByRole('button', { name: /Capture/i }));
    const doneButton2 = await screen.findByRole('button', { name: /Done \/ Use Photo/i });
    fireEvent.click(doneButton2);

    // onCapture called with snapshot dataUrl and onClose called
    expect(handleCaptureMock).toHaveBeenCalledWith('data:image/jpeg;base64,capturedSnapshotMock');
    expect(handleCloseMock).toHaveBeenCalled();
  });

  it('R1 & Acceptance: stops all media tracks when Done/Use Photo is completed', async () => {
    const handleCaptureMock = vi.fn();
    const handleCloseMock = vi.fn();

    render(
      <WebcamCaptureModal
        isOpen={true}
        onClose={handleCloseMock}
        onCapture={handleCaptureMock}
        title="Mother's Photo"
      />
    );

    const captureButton = await screen.findByRole('button', { name: /Capture/i });
    fireEvent.click(captureButton);

    const doneButton = await screen.findByRole('button', { name: /Done \/ Use Photo/i });
    fireEvent.click(doneButton);

    expect(mockStream._tracks[0].stop).toHaveBeenCalled();
  });

  it('R1 & Acceptance: cleanly stops all media tracks when modal is cancelled or closed via X', async () => {
    const handleCloseMock = vi.fn();

    render(
      <WebcamCaptureModal
        isOpen={true}
        onClose={handleCloseMock}
        onCapture={vi.fn()}
        title="Student Photo"
      />
    );

    await screen.findByRole('button', { name: /Capture/i });

    // Click Close (X) button
    const closeBtn = screen.getByLabelText(/Close modal/i);
    fireEvent.click(closeBtn);

    expect(handleCloseMock).toHaveBeenCalled();
    expect(mockStream._tracks[0].stop).toHaveBeenCalled();
  });

  it('R1 & Acceptance: cleanly stops all media tracks on component unmount', async () => {
    const { unmount } = render(
      <WebcamCaptureModal
        isOpen={true}
        onClose={vi.fn()}
        onCapture={vi.fn()}
        title="Student Photo"
      />
    );

    await screen.findByRole('button', { name: /Capture/i });
    expect(mockStream._tracks[0].stop).not.toHaveBeenCalled();

    unmount();

    expect(mockStream._tracks[0].stop).toHaveBeenCalled();
  });

  it('R1 & Acceptance: displays informative error message when camera permission is denied', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const permissionError = new Error('Permission denied');
    permissionError.name = 'NotAllowedError';

    navigator.mediaDevices.getUserMedia = vi.fn().mockRejectedValue(permissionError);

    render(
      <WebcamCaptureModal
        isOpen={true}
        onClose={vi.fn()}
        onCapture={vi.fn()}
        title="Student Photo"
      />
    );

    const errorMsg = await screen.findByText(/Camera permission was denied/i);
    expect(errorMsg).toBeTruthy();

    // Check for "Try Again" retry button
    expect(screen.getByRole('button', { name: /Try Again/i })).toBeTruthy();
    warnSpy.mockRestore();
  });

  it('R1 & Acceptance: displays informative error message when no camera device is found', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const notFoundError = new Error('Devices not found');
    notFoundError.name = 'NotFoundError';

    navigator.mediaDevices.getUserMedia = vi.fn().mockRejectedValue(notFoundError);

    render(
      <WebcamCaptureModal
        isOpen={true}
        onClose={vi.fn()}
        onCapture={vi.fn()}
        title="Student Photo"
      />
    );

    const errorMsg = await screen.findByText(/No camera device found/i);
    expect(errorMsg).toBeTruthy();
    warnSpy.mockRestore();
  });

  it('R1 edge case: cleanly stops tracks if getUserMedia resolves AFTER modal unmounts (race condition guard)', async () => {
    let resolveGUM;
    const delayedStreamPromise = new Promise((resolve) => {
      resolveGUM = resolve;
    });

    navigator.mediaDevices.getUserMedia = vi.fn(() => delayedStreamPromise);

    const { unmount } = render(
      <WebcamCaptureModal
        isOpen={true}
        onClose={vi.fn()}
        onCapture={vi.fn()}
        title="Student Photo"
      />
    );

    // Unmount before getUserMedia resolves
    unmount();

    // Now resolve getUserMedia after unmount
    const lateStream = createMockStream();
    resolveGUM(lateStream);

    await waitFor(() => {
      expect(lateStream._tracks[0].stop).toHaveBeenCalled();
    });
  });

  it('R1 feature: toggles between Front and Back cameras via switch camera button', async () => {
    render(
      <WebcamCaptureModal
        isOpen={true}
        onClose={vi.fn()}
        onCapture={vi.fn()}
        title="Student Photo"
      />
    );

    // Initially starts with Front camera
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Switch camera/i })).toBeTruthy();
    });
    expect(screen.getByText('Front')).toBeTruthy();

    // Click Switch camera button
    const switchBtn = screen.getByRole('button', { name: /Switch camera/i });
    fireEvent.click(switchBtn);

    // Stops previous stream tracks and restarts with environment (Back) camera
    await waitFor(() => {
      expect(screen.getByText('Back')).toBeTruthy();
      expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith(
        expect.objectContaining({
          video: expect.objectContaining({
            facingMode: expect.objectContaining({ ideal: 'environment' })
          })
        })
      );
      // Clean single switch without redundant background double-invocation
      expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledTimes(2);
    });
  });

  it('R1 UX & Lifecycle: clicking modal backdrop calls onClose and cleanly stops camera tracks', async () => {
    const onCloseMock = vi.fn();
    render(
      <WebcamCaptureModal
        isOpen={true}
        onClose={onCloseMock}
        onCapture={vi.fn()}
        title="Student Photo"
      />
    );

    await screen.findByRole('button', { name: /Capture/i });
    expect(mockStream._tracks[0].stop).not.toHaveBeenCalled();

    // Clicking the backdrop div (role="dialog") triggers onClose
    const backdrop = screen.getByRole('dialog');
    fireEvent.click(backdrop);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
    expect(mockStream._tracks[0].stop).toHaveBeenCalled();
  });

  it('R1 resilience: automatically falls back to basic video constraint when OverconstrainedError occurs', async () => {
    const overconstrainedErr = new Error('Constraint not satisfied');
    overconstrainedErr.name = 'OverconstrainedError';

    const fallbackStream = createMockStream();
    navigator.mediaDevices.getUserMedia = vi
      .fn()
      .mockRejectedValueOnce(overconstrainedErr)
      .mockResolvedValueOnce(fallbackStream);

    render(
      <WebcamCaptureModal
        isOpen={true}
        onClose={vi.fn()}
        onCapture={vi.fn()}
        title="Student Photo"
      />
    );

    await waitFor(() => {
      expect(screen.getByText('LIVE')).toBeTruthy();
    });

    // Second call was fallback with video: true
    expect(navigator.mediaDevices.getUserMedia).toHaveBeenLastCalledWith({
      video: true,
      audio: false
    });
  });

  it('R1 Lifecycle: clears video.srcObject when stopping tracks upon close', async () => {
    const handleClose = vi.fn();
    const { container } = render(
      <WebcamCaptureModal
        isOpen={true}
        onClose={handleClose}
        onCapture={vi.fn()}
        title="Student Photo"
      />
    );

    await screen.findByRole('button', { name: /Capture/i });
    const video = container.querySelector('video');
    expect(video).toBeTruthy();
    expect(video.srcObject).toBe(mockStream);

    // Close modal via Close button
    fireEvent.click(screen.getByLabelText(/Close modal/i));

    // Video srcObject is cleanly unlinked
    expect(video.srcObject).toBeNull();
  });

  it('R1 Resilience: falls back to default video constraint if switching to environment camera throws NotFoundError on single-camera hardware', async () => {
    render(
      <WebcamCaptureModal
        isOpen={true}
        onClose={vi.fn()}
        onCapture={vi.fn()}
        title="Student Photo"
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Switch camera/i })).toBeTruthy();
    });

    const notFoundErr = new Error('No environment camera');
    notFoundErr.name = 'NotFoundError';
    const fallbackStream = createMockStream();

    navigator.mediaDevices.getUserMedia = vi
      .fn()
      .mockRejectedValueOnce(notFoundErr)
      .mockResolvedValueOnce(fallbackStream);

    fireEvent.click(screen.getByRole('button', { name: /Switch camera/i }));

    await waitFor(() => {
      expect(screen.getByText('Back')).toBeTruthy();
      expect(screen.getByText('LIVE')).toBeTruthy();
    });

    // Fallback was called with { video: true, audio: false }
    expect(navigator.mediaDevices.getUserMedia).toHaveBeenLastCalledWith({
      video: true,
      audio: false
    });
  });

  it('R1 a11y: closes modal and stops tracks when Escape key is pressed', async () => {
    const handleClose = vi.fn();
    render(
      <WebcamCaptureModal
        isOpen={true}
        onClose={handleClose}
        onCapture={vi.fn()}
        title="Student Photo"
      />
    );

    await screen.findByRole('button', { name: /Capture/i });

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(handleClose).toHaveBeenCalled();
    expect(mockStream._tracks[0].stop).toHaveBeenCalled();
  });

  it('R1 lifecycle: resets captured image when closed so next open starts fresh without stale preview', async () => {
    const { rerender } = render(
      <WebcamCaptureModal
        isOpen={true}
        onClose={vi.fn()}
        onCapture={vi.fn()}
        title="Student Photo"
      />
    );

    // Capture an image
    const captureBtn = await screen.findByRole('button', { name: /Capture/i });
    fireEvent.click(captureBtn);

    expect(await screen.findByRole('button', { name: /Retake/i })).toBeTruthy();

    // Close modal
    rerender(
      <WebcamCaptureModal
        isOpen={false}
        onClose={vi.fn()}
        onCapture={vi.fn()}
        title="Student Photo"
      />
    );

    // Reopen modal
    rerender(
      <WebcamCaptureModal
        isOpen={true}
        onClose={vi.fn()}
        onCapture={vi.fn()}
        title="Student Photo"
      />
    );

    // Stale image is cleared and live capture view is rendered
    expect(await screen.findByRole('button', { name: /Capture/i })).toBeTruthy();
    expect(screen.queryByRole('button', { name: /Retake/i })).toBeNull();
  });

  it('R1 & Acceptance: does not render anything when isOpen is false', () => {
    const { container } = render(
      <WebcamCaptureModal
        isOpen={false}
        onClose={vi.fn()}
        onCapture={vi.fn()}
        title="Student Photo"
      />
    );

    expect(container.firstChild).toBeNull();
    expect(navigator.mediaDevices.getUserMedia).not.toHaveBeenCalled();
  });
});

describe('StudentRegistrationPage Integration & File Browse Preservation', () => {
  let mockStream;

  beforeEach(() => {
    mockStream = createMockStream();
    window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
    window.HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
      drawImage: vi.fn(),
      getImageData: vi.fn()
    }));
    window.HTMLCanvasElement.prototype.toDataURL = vi.fn(
      () => 'data:image/jpeg;base64,registeredStudentSnapshot'
    );

    global.URL.createObjectURL = vi.fn((file) => `blob:http://localhost/${file.name}`);
    global.URL.revokeObjectURL = vi.fn();

    Object.defineProperty(navigator, 'mediaDevices', {
      writable: true,
      configurable: true,
      value: {
        getUserMedia: vi.fn().mockResolvedValue(mockStream)
      }
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('R2 & Acceptance: Browse button clicks file input and does NOT open camera modal', () => {
    render(<StudentRegistrationPage />);

    // Spy on the file input click
    const fileInputs = document.querySelectorAll('input[type="file"]');
    expect(fileInputs.length).toBeGreaterThan(0);
    const firstFileInput = fileInputs[0];
    const fileClickSpy = vi.spyOn(firstFileInput, 'click');

    // Find the Browse button in Student Details tab
    const browseButtons = screen.getAllByRole('button', { name: /Browse/i });
    expect(browseButtons.length).toBeGreaterThan(0);

    fireEvent.click(browseButtons[0]);

    // File input click was invoked
    expect(fileClickSpy).toHaveBeenCalled();

    // Webcam modal must NOT be open
    expect(screen.queryByText(/Capturing: Student Photo/i)).toBeNull();
  });

  it('R1, R2 & Acceptance: Camera button opens webcam modal and captures snapshot into student photo', async () => {
    render(<StudentRegistrationPage />);

    // Find Camera button on Student Photo card
    const cameraButton = screen.getByTitle('Take Photo');
    expect(cameraButton).toBeTruthy();

    // Click camera button
    fireEvent.click(cameraButton);

    // Modal is opened
    expect(await screen.findByText(/Capturing: Student Photo/i)).toBeTruthy();

    // Capture button in modal
    const captureBtn = await screen.findByRole('button', { name: /Capture/i });
    fireEvent.click(captureBtn);

    // Done button in modal
    const doneBtn = await screen.findByRole('button', { name: /Done \/ Use Photo/i });
    fireEvent.click(doneBtn);

    // Modal closes
    await waitFor(() => {
      expect(screen.queryByText(/Capturing: Student Photo/i)).toBeNull();
    });

    // The avatar preview image now displays the captured dataUrl!
    const previewImg = document.querySelector('img[alt="student"]');
    expect(previewImg).toBeTruthy();
    expect(previewImg.getAttribute('src')).toBe('data:image/jpeg;base64,registeredStudentSnapshot');
  });

  it('R1 & Acceptance: Camera button on Father photo in Parent tab opens webcam modal for Father', async () => {
    render(<StudentRegistrationPage />);

    // Switch to Parent's Details tab
    const parentTabBtn = screen.getByRole('button', { name: /Parent's Details/i });
    fireEvent.click(parentTabBtn);

    expect(await screen.findByText(/FATHER DETAILS/i)).toBeTruthy();

    // Find camera buttons (Father and Mother cards)
    const cameraButtons = screen.getAllByTitle('Take Photo');
    expect(cameraButtons.length).toBe(2);

    // Click Father photo camera button
    fireEvent.click(cameraButtons[0]);

    // Modal opens for Father's Photo
    expect(await screen.findByText(/Capturing: Father's Photo/i)).toBeTruthy();

    // Capture and save
    fireEvent.click(await screen.findByRole('button', { name: /Capture/i }));
    fireEvent.click(await screen.findByRole('button', { name: /Done \/ Use Photo/i }));

    // Preview image is updated for father
    await waitFor(() => {
      const fatherImg = document.querySelector('img[alt="father"]');
      expect(fatherImg).toBeTruthy();
      expect(fatherImg.getAttribute('src')).toBe('data:image/jpeg;base64,registeredStudentSnapshot');
    });
  });

  it('R1 & Acceptance: Camera button on Mother photo in Parent tab opens webcam modal for Mother', async () => {
    render(<StudentRegistrationPage />);

    // Switch to Parent's Details tab
    const parentTabBtn = screen.getByRole('button', { name: /Parent's Details/i });
    fireEvent.click(parentTabBtn);

    expect(await screen.findByText(/MOTHER DETAILS/i)).toBeTruthy();

    const cameraButtons = screen.getAllByTitle('Take Photo');
    // Mother is the second photo card
    fireEvent.click(cameraButtons[1]);

    expect(await screen.findByText(/Capturing: Mother's Photo/i)).toBeTruthy();

    // Capture and save
    fireEvent.click(await screen.findByRole('button', { name: /Capture/i }));
    fireEvent.click(await screen.findByRole('button', { name: /Done \/ Use Photo/i }));

    // Preview image is updated for mother
    await waitFor(() => {
      const motherImg = document.querySelector('img[alt="mother"]');
      expect(motherImg).toBeTruthy();
      expect(motherImg.getAttribute('src')).toBe('data:image/jpeg;base64,registeredStudentSnapshot');
    });
  });

  it('R1, R2 & Acceptance: Document card camera button in Documents tab opens webcam modal and captures snapshot', async () => {
    render(<StudentRegistrationPage />);

    // Switch to Documents tab
    const docTabBtn = screen.getByRole('button', { name: /Documents/i });
    fireEvent.click(docTabBtn);

    // Find camera button for Birth Certificate
    const birthCertCameraBtn = screen.getByLabelText(/Camera capture for Birth Certificate/i);
    expect(birthCertCameraBtn).toBeTruthy();

    fireEvent.click(birthCertCameraBtn);

    // Modal opens for Birth Certificate with document framing
    expect(await screen.findByText(/Capturing: Birth Certificate/i)).toBeTruthy();

    // Capture and done
    fireEvent.click(await screen.findByRole('button', { name: /^Capture$/i }));
    fireEvent.click(await screen.findByRole('button', { name: /Done \/ Use Photo/i }));

    // Modal closes and document preview is updated
    await waitFor(() => {
      expect(screen.queryByText(/Capturing: Birth Certificate/i)).toBeNull();
    });

    const birthCertImg = document.querySelector('img[alt="Birth Certificate"]');
    expect(birthCertImg).toBeTruthy();
    expect(birthCertImg.getAttribute('src')).toBe('data:image/jpeg;base64,registeredStudentSnapshot');
  });

  it('R2 & Memory Management: revokes previous object URL when taking webcam photo over an uploaded file', async () => {
    const { container } = render(<StudentRegistrationPage />);

    const studentFileInput = container.querySelector('input[type="file"]');
    expect(studentFileInput).toBeTruthy();

    const testFile = new File(['upload data'], 'student_initial.png', { type: 'image/png' });
    fireEvent.change(studentFileInput, { target: { files: [testFile] } });

    await waitFor(() => {
      const img = container.querySelector('img[alt="student"]');
      expect(img).toBeTruthy();
      expect(img.getAttribute('src')).toBe('blob:http://localhost/student_initial.png');
    });

    // Now capture a photo via Webcam
    const cameraBtn = screen.getByTitle('Take Photo');
    fireEvent.click(cameraBtn);

    expect(await screen.findByText(/Capturing: Student Photo/i)).toBeTruthy();
    fireEvent.click(await screen.findByRole('button', { name: /Capture/i }));
    fireEvent.click(await screen.findByRole('button', { name: /Done \/ Use Photo/i }));

    await waitFor(() => {
      expect(screen.queryByText(/Capturing: Student Photo/i)).toBeNull();
    });

    // The previous blob URL was revoked to prevent memory leaks
    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:http://localhost/student_initial.png');

    // And the preview displays the new webcam snapshot
    const updatedImg = container.querySelector('img[alt="student"]');
    expect(updatedImg.getAttribute('src')).toBe('data:image/jpeg;base64,registeredStudentSnapshot');
  });

  it('R2 & Browse Re-selection: re-selecting the exact same file after webcam capture resets input value and fires onChange', async () => {
    const { container } = render(<StudentRegistrationPage />);

    const studentFileInput = container.querySelector('input[type="file"]');
    const testFile = new File(['upload data'], 'same_photo.png', { type: 'image/png' });

    // 1. Initial file upload
    fireEvent.change(studentFileInput, { target: { files: [testFile] } });
    await waitFor(() => {
      expect(container.querySelector('img[alt="student"]')?.getAttribute('src')).toBe('blob:http://localhost/same_photo.png');
    });

    // 2. Take webcam snapshot replacing it
    const cameraBtn = screen.getByTitle('Take Photo');
    fireEvent.click(cameraBtn);
    fireEvent.click(await screen.findByRole('button', { name: /Capture/i }));
    fireEvent.click(await screen.findByRole('button', { name: /Done \/ Use Photo/i }));

    await waitFor(() => {
      expect(container.querySelector('img[alt="student"]')?.getAttribute('src')).toBe('data:image/jpeg;base64,registeredStudentSnapshot');
    });

    // 3. User clicks Browse again - verify file input value was reset so selecting the same file fires onChange
    const browseBtn = screen.getAllByRole('button', { name: /Browse/i })[0];
    fireEvent.click(browseBtn);
    expect(studentFileInput.value).toBe('');

    fireEvent.change(studentFileInput, { target: { files: [testFile] } });
    await waitFor(() => {
      expect(container.querySelector('img[alt="student"]')?.getAttribute('src')).toBe('blob:http://localhost/same_photo.png');
    });
  });
});
