import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import StudentRegistrationPage, { StudentAvatar } from '../StudentRegistrationPage';
import { tenantStore } from '../../../services/tenantStore';

// Helper to create mock media stream
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

describe('StudentAvatar Component Unit Tests', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('R1 & Acceptance: does not display cross button when previewUrl is null', () => {
    render(
      <StudentAvatar
        previewUrl={null}
        onFileSelect={vi.fn()}
        onCameraClick={vi.fn()}
        onRemove={vi.fn()}
        role="student"
      />
    );

    // Cross button must NOT be present
    expect(screen.queryByTestId('remove-student-photo')).toBeNull();
    expect(screen.queryByTitle(/remove/i)).toBeNull();
  });

  it('R1 & Acceptance: displays cross button when previewUrl is present', () => {
    render(
      <StudentAvatar
        previewUrl="data:image/png;base64,mockPreview"
        onFileSelect={vi.fn()}
        onCameraClick={vi.fn()}
        onRemove={vi.fn()}
        role="student"
      />
    );

    // Cross button MUST be present
    const removeBtn = screen.getByTestId('remove-student-photo');
    expect(removeBtn).toBeTruthy();
    expect(removeBtn.getAttribute('title')).toBe('Remove Student Photo');
  });

  it('R2 & Acceptance: clicking cross button immediately invokes onRemove without confirmation and resets input', () => {
    const onRemoveMock = vi.fn();
    const confirmSpy = vi.spyOn(window, 'confirm');

    const { container } = render(
      <StudentAvatar
        previewUrl="data:image/png;base64,mockPreview"
        onFileSelect={vi.fn()}
        onCameraClick={vi.fn()}
        onRemove={onRemoveMock}
        role="father"
      />
    );

    const fileInput = container.querySelector('input[type="file"]');
    expect(fileInput).toBeTruthy();
    // Simulate an attached file value
    Object.defineProperty(fileInput, 'value', {
      writable: true,
      value: 'C:\\fakepath\\father.png'
    });
    expect(fileInput.value).toBe('C:\\fakepath\\father.png');

    const removeBtn = screen.getByTestId('remove-father-photo');
    fireEvent.click(removeBtn);

    // Confirmation dialog must NOT have been called
    expect(confirmSpy).not.toHaveBeenCalled();
    // onRemove callback invoked
    expect(onRemoveMock).toHaveBeenCalledTimes(1);
    // File input value reset to empty string
    expect(fileInput.value).toBe('');
  });

  it('R2 & Robustness: rapid double clicking on cross button does not throw and executes safely', () => {
    const onRemoveMock = vi.fn();
    render(
      <StudentAvatar
        previewUrl="data:image/png;base64,mockPreview"
        onFileSelect={vi.fn()}
        onCameraClick={vi.fn()}
        onRemove={onRemoveMock}
        role="student"
      />
    );

    const removeBtn = screen.getByTestId('remove-student-photo');
    expect(() => {
      fireEvent.click(removeBtn);
      fireEvent.click(removeBtn);
    }).not.toThrow();

    expect(onRemoveMock).toHaveBeenCalledTimes(2);
  });

  it('R2 & Input Reset: clears file input reactively whenever previewUrl becomes falsy/null', () => {
    const { container, rerender } = render(
      <StudentAvatar
        previewUrl="data:image/png;base64,mockPreview"
        onFileSelect={vi.fn()}
        onCameraClick={vi.fn()}
        onRemove={vi.fn()}
        role="student"
      />
    );

    const fileInput = container.querySelector('input[type="file"]');
    Object.defineProperty(fileInput, 'value', {
      writable: true,
      value: 'C:\\fakepath\\student.png'
    });
    expect(fileInput.value).toBe('C:\\fakepath\\student.png');

    // Simulate parent state resetting previewUrl to null
    rerender(
      <StudentAvatar
        previewUrl={null}
        onFileSelect={vi.fn()}
        onCameraClick={vi.fn()}
        onRemove={vi.fn()}
        role="student"
      />
    );

    expect(fileInput.value).toBe('');
  });
});

describe('StudentRegistrationPage Photo Removal & Reset Integration Tests', () => {
  let mockStream;

  beforeEach(() => {
    mockStream = createMockStream();
    window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
    window.HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
      drawImage: vi.fn(),
      getImageData: vi.fn()
    }));
    window.HTMLCanvasElement.prototype.toDataURL = vi.fn(
      () => 'data:image/jpeg;base64,mockWebcamSnapshot'
    );

    // Mock URL.createObjectURL and URL.revokeObjectURL
    global.URL.createObjectURL = vi.fn((file) => `blob:http://localhost/${file.name}`);
    global.URL.revokeObjectURL = vi.fn();

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

  it('R1, R2 & Acceptance: Student Photo file upload, cross button appearance, removal, and re-selection of the same file', async () => {
    const { container } = render(<StudentRegistrationPage />);

    // Initially no photo, no cross button
    expect(screen.queryByTestId('remove-student-photo')).toBeNull();

    // Find the student file input (in Student Details tab)
    const studentFileInput = container.querySelector('input[type="file"]');
    expect(studentFileInput).toBeTruthy();

    const testFile = new File(['mock content'], 'student_pic.png', { type: 'image/png' });

    // 1. Upload student photo
    fireEvent.change(studentFileInput, { target: { files: [testFile] } });

    // Preview image is now visible
    await waitFor(() => {
      const img = container.querySelector('img[alt="student"]');
      expect(img).toBeTruthy();
      expect(img.getAttribute('src')).toBe('blob:http://localhost/student_pic.png');
    });

    // Cross button is now visible
    const removeBtn = screen.getByTestId('remove-student-photo');
    expect(removeBtn).toBeTruthy();

    // 2. Click the cross button to remove the photo immediately
    fireEvent.click(removeBtn);

    // Photo is removed from state and preview reverts to default avatar
    await waitFor(() => {
      expect(container.querySelector('img[alt="student"]')).toBeNull();
      expect(screen.queryByTestId('remove-student-photo')).toBeNull();
    });

    // File input value was cleared
    expect(studentFileInput.value).toBe('');

    // 3. Select the EXACT same file again to verify input reset behavior
    fireEvent.change(studentFileInput, { target: { files: [testFile] } });

    // Preview image is restored with the same file
    await waitFor(() => {
      const img = container.querySelector('img[alt="student"]');
      expect(img).toBeTruthy();
      expect(img.getAttribute('src')).toBe('blob:http://localhost/student_pic.png');
    });

    // Cross button reappears
    expect(screen.getByTestId('remove-student-photo')).toBeTruthy();
  });

  it('R1, R2 & Acceptance: Student Photo webcam capture, cross button appearance, removal, and subsequent webcam capture', async () => {
    const { container } = render(<StudentRegistrationPage />);

    // Click camera button on Student photo card
    const cameraButtons = screen.getAllByTitle('Take Photo');
    fireEvent.click(cameraButtons[0]);

    // Modal opens
    expect(await screen.findByText(/Capturing: Student Photo/i)).toBeTruthy();

    // Capture & Done
    fireEvent.click(await screen.findByRole('button', { name: /Capture/i }));
    fireEvent.click(await screen.findByRole('button', { name: /Done \/ Use Photo/i }));

    // Modal closes
    await waitFor(() => {
      expect(screen.queryByText(/Capturing: Student Photo/i)).toBeNull();
    });

    // Student preview is set to webcam snapshot
    const studentImg = container.querySelector('img[alt="student"]');
    expect(studentImg).toBeTruthy();
    expect(studentImg.getAttribute('src')).toBe('data:image/jpeg;base64,mockWebcamSnapshot');

    // Cross button is rendered
    const removeBtn = screen.getByTestId('remove-student-photo');
    expect(removeBtn).toBeTruthy();

    // Click cross button
    fireEvent.click(removeBtn);

    // Snapshot cleared and preview reverted
    await waitFor(() => {
      expect(container.querySelector('img[alt="student"]')).toBeNull();
      expect(screen.queryByTestId('remove-student-photo')).toBeNull();
    });

    // Subsequent webcam capture works without error
    fireEvent.click(screen.getAllByTitle('Take Photo')[0]);
    expect(await screen.findByText(/Capturing: Student Photo/i)).toBeTruthy();
    fireEvent.click(await screen.findByRole('button', { name: /Capture/i }));
    fireEvent.click(await screen.findByRole('button', { name: /Done \/ Use Photo/i }));

    await waitFor(() => {
      expect(screen.queryByText(/Capturing: Student Photo/i)).toBeNull();
    });
    expect(container.querySelector('img[alt="student"]')).toBeTruthy();
  });

  it('R1, R2 & Acceptance: Father Photo file upload, cross button, removal, and re-selection of the same file', async () => {
    const { container } = render(<StudentRegistrationPage />);

    // Switch to Parent's Details tab
    fireEvent.click(screen.getByRole('button', { name: /Parent's Details/i }));
    expect(await screen.findByText(/FATHER DETAILS/i)).toBeTruthy();

    // No cross button initially
    expect(screen.queryByTestId('remove-father-photo')).toBeNull();

    // Locate father file input within Father Details section
    const fatherSection = screen.getByText(/FATHER DETAILS/i).closest('div.bg-white');
    const fatherFileInput = fatherSection.querySelector('input[type="file"]');
    expect(fatherFileInput).toBeTruthy();

    const testFile = new File(['father photo content'], 'father_pic.jpg', { type: 'image/jpeg' });

    // 1. Upload father photo
    fireEvent.change(fatherFileInput, { target: { files: [testFile] } });

    await waitFor(() => {
      const img = container.querySelector('img[alt="father"]');
      expect(img).toBeTruthy();
      expect(img.getAttribute('src')).toBe('blob:http://localhost/father_pic.jpg');
    });

    // Cross button is visible
    const removeFatherBtn = screen.getByTestId('remove-father-photo');
    expect(removeFatherBtn).toBeTruthy();

    // 2. Click cross button to remove father photo
    fireEvent.click(removeFatherBtn);

    await waitFor(() => {
      expect(container.querySelector('img[alt="father"]')).toBeNull();
      expect(screen.queryByTestId('remove-father-photo')).toBeNull();
      // Default placeholder is shown
      expect(screen.getByText("Father's Photo")).toBeTruthy();
    });

    // File input value was cleared
    expect(fatherFileInput.value).toBe('');

    // 3. Re-select the exact same file
    fireEvent.change(fatherFileInput, { target: { files: [testFile] } });

    await waitFor(() => {
      const img = container.querySelector('img[alt="father"]');
      expect(img).toBeTruthy();
      expect(img.getAttribute('src')).toBe('blob:http://localhost/father_pic.jpg');
    });
  });

  it('R1, R2 & Acceptance: Father Photo webcam capture, cross button appearance, and removal', async () => {
    const { container } = render(<StudentRegistrationPage />);

    fireEvent.click(screen.getByRole('button', { name: /Parent's Details/i }));
    expect(await screen.findByText(/FATHER DETAILS/i)).toBeTruthy();

    const fatherSection = screen.getByText(/FATHER DETAILS/i).closest('div.bg-white');
    const cameraBtn = fatherSection.querySelector('button[title="Take Photo"]');
    fireEvent.click(cameraBtn);

    expect(await screen.findByText(/Capturing: Father's Photo/i)).toBeTruthy();
    fireEvent.click(await screen.findByRole('button', { name: /Capture/i }));
    fireEvent.click(await screen.findByRole('button', { name: /Done \/ Use Photo/i }));

    await waitFor(() => {
      expect(screen.queryByText(/Capturing: Father's Photo/i)).toBeNull();
    });

    const fatherImg = container.querySelector('img[alt="father"]');
    expect(fatherImg).toBeTruthy();
    expect(fatherImg.getAttribute('src')).toBe('data:image/jpeg;base64,mockWebcamSnapshot');

    const removeBtn = screen.getByTestId('remove-father-photo');
    expect(removeBtn).toBeTruthy();
    fireEvent.click(removeBtn);

    await waitFor(() => {
      expect(container.querySelector('img[alt="father"]')).toBeNull();
      expect(screen.queryByTestId('remove-father-photo')).toBeNull();
      expect(screen.getByText("Father's Photo")).toBeTruthy();
    });
  });

  it('R1, R2 & Acceptance: Mother Photo file upload, cross button, removal, and re-selection of the same file', async () => {
    const { container } = render(<StudentRegistrationPage />);

    // Switch to Parent's Details tab
    fireEvent.click(screen.getByRole('button', { name: /Parent's Details/i }));
    expect(await screen.findByText(/MOTHER DETAILS/i)).toBeTruthy();

    // No cross button initially
    expect(screen.queryByTestId('remove-mother-photo')).toBeNull();

    // Locate mother file input within Mother Details section
    const motherSection = screen.getByText(/MOTHER DETAILS/i).closest('div.bg-white');
    const motherFileInput = motherSection.querySelector('input[type="file"]');
    expect(motherFileInput).toBeTruthy();

    const testFile = new File(['mother photo content'], 'mother_pic.jpg', { type: 'image/jpeg' });

    // 1. Upload mother photo
    fireEvent.change(motherFileInput, { target: { files: [testFile] } });

    await waitFor(() => {
      const img = container.querySelector('img[alt="mother"]');
      expect(img).toBeTruthy();
      expect(img.getAttribute('src')).toBe('blob:http://localhost/mother_pic.jpg');
    });

    // Cross button is visible
    const removeMotherBtn = screen.getByTestId('remove-mother-photo');
    expect(removeMotherBtn).toBeTruthy();

    // 2. Click cross button to remove mother photo
    fireEvent.click(removeMotherBtn);

    await waitFor(() => {
      expect(container.querySelector('img[alt="mother"]')).toBeNull();
      expect(screen.queryByTestId('remove-mother-photo')).toBeNull();
      // Default placeholder is shown
      expect(screen.getByText("Mother's Photo")).toBeTruthy();
    });

    // File input value was cleared
    expect(motherFileInput.value).toBe('');

    // 3. Re-select the exact same file
    fireEvent.change(motherFileInput, { target: { files: [testFile] } });

    await waitFor(() => {
      const img = container.querySelector('img[alt="mother"]');
      expect(img).toBeTruthy();
      expect(img.getAttribute('src')).toBe('blob:http://localhost/mother_pic.jpg');
    });
  });

  it('R1, R2 & Acceptance: Mother Photo webcam capture, cross button appearance, and removal', async () => {
    const { container } = render(<StudentRegistrationPage />);

    fireEvent.click(screen.getByRole('button', { name: /Parent's Details/i }));
    expect(await screen.findByText(/MOTHER DETAILS/i)).toBeTruthy();

    const motherSection = screen.getByText(/MOTHER DETAILS/i).closest('div.bg-white');
    const cameraBtn = motherSection.querySelector('button[title="Take Photo"]');
    fireEvent.click(cameraBtn);

    expect(await screen.findByText(/Capturing: Mother's Photo/i)).toBeTruthy();
    fireEvent.click(await screen.findByRole('button', { name: /Capture/i }));
    fireEvent.click(await screen.findByRole('button', { name: /Done \/ Use Photo/i }));

    await waitFor(() => {
      expect(screen.queryByText(/Capturing: Mother's Photo/i)).toBeNull();
    });

    const motherImg = container.querySelector('img[alt="mother"]');
    expect(motherImg).toBeTruthy();
    expect(motherImg.getAttribute('src')).toBe('data:image/jpeg;base64,mockWebcamSnapshot');

    const removeBtn = screen.getByTestId('remove-mother-photo');
    expect(removeBtn).toBeTruthy();
    fireEvent.click(removeBtn);

    await waitFor(() => {
      expect(container.querySelector('img[alt="mother"]')).toBeNull();
      expect(screen.queryByTestId('remove-mother-photo')).toBeNull();
      expect(screen.getByText("Mother's Photo")).toBeTruthy();
    });
  });

  it('R1 & R2: Removing Father Photo does not clear Mother Photo when both are uploaded', async () => {
    const { container } = render(<StudentRegistrationPage />);

    fireEvent.click(screen.getByRole('button', { name: /Parent's Details/i }));
    expect(await screen.findByText(/MOTHER DETAILS/i)).toBeTruthy();

    const fatherSection = screen.getByText(/FATHER DETAILS/i).closest('div.bg-white');
    const fatherFileInput = fatherSection.querySelector('input[type="file"]');

    const motherSection = screen.getByText(/MOTHER DETAILS/i).closest('div.bg-white');
    const motherFileInput = motherSection.querySelector('input[type="file"]');

    const fatherFile = new File(['f'], 'f.png', { type: 'image/png' });
    const motherFile = new File(['m'], 'm.png', { type: 'image/png' });

    fireEvent.change(fatherFileInput, { target: { files: [fatherFile] } });
    fireEvent.change(motherFileInput, { target: { files: [motherFile] } });

    await waitFor(() => {
      expect(container.querySelector('img[alt="father"]')).toBeTruthy();
      expect(container.querySelector('img[alt="mother"]')).toBeTruthy();
    });

    // Remove only father photo
    const removeFatherBtn = screen.getByTestId('remove-father-photo');
    fireEvent.click(removeFatherBtn);

    await waitFor(() => {
      expect(container.querySelector('img[alt="father"]')).toBeNull();
      expect(screen.queryByTestId('remove-father-photo')).toBeNull();
      // Mother photo must still be present!
      expect(container.querySelector('img[alt="mother"]')).toBeTruthy();
      expect(screen.getByTestId('remove-mother-photo')).toBeTruthy();
    });
  });

  it('R2 & Memory Management: revokes blob URL on cross button removal', async () => {
    const { container } = render(<StudentRegistrationPage />);
    const studentFileInput = container.querySelector('input[type="file"]');
    const testFile = new File(['mock content'], 'test_pic.png', { type: 'image/png' });

    fireEvent.change(studentFileInput, { target: { files: [testFile] } });

    await waitFor(() => {
      expect(screen.getByTestId('remove-student-photo')).toBeTruthy();
    });

    const removeBtn = screen.getByTestId('remove-student-photo');
    fireEvent.click(removeBtn);

    await waitFor(() => {
      expect(screen.queryByTestId('remove-student-photo')).toBeNull();
      expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:http://localhost/test_pic.png');
    });
  });

  it('R1 & R2: edit mode pre-fills existing photos with cross buttons, and removing student photo updates state', async () => {
    const existingStudent = {
      id: 'std_9009',
      admNo: '9009',
      srNo: '9009',
      firstName: 'Simran',
      name: 'Simran Kaur',
      className: 'IV',
      section: 'B',
      gender: 'Female',
      dob: '2015-04-10',
      photoUrl: 'https://school.erp/photos/student_9009.jpg',
      fatherPhoto: 'https://school.erp/photos/father_9009.jpg',
      motherPhoto: 'https://school.erp/photos/mother_9009.jpg',
      status: 'Studying'
    };

    tenantStore.getPendingEditStudent.mockReturnValueOnce(existingStudent);
    tenantStore.getStudents.mockReturnValue([existingStudent]);

    render(<StudentRegistrationPage onNavigate={vi.fn()} />);

    // Cross button must appear for student photo loaded in edit mode
    expect(await screen.findByTestId('remove-student-photo')).toBeTruthy();

    // Remove student photo
    const removeBtn = screen.getByTestId('remove-student-photo');
    fireEvent.click(removeBtn);

    // Cross button removed and preview reverted
    await waitFor(() => {
      expect(screen.queryByTestId('remove-student-photo')).toBeNull();
    });

    // Update student
    const updateBtn = screen.getByRole('button', { name: /Update Student/i });
    fireEvent.click(updateBtn);

    await waitFor(() => {
      expect(tenantStore.updateStudent).toHaveBeenCalled();
      const updatedPayload = tenantStore.updateStudent.mock.calls[0][2];
      expect(updatedPayload.photoUrl).toBe('');
    });
  });

  it('R2 & Input Reset: Reset Form button clears photo preview and resets file input', async () => {
    const { container } = render(<StudentRegistrationPage />);
    const studentFileInput = container.querySelector('input[type="file"]');
    const testFile = new File(['pic data'], 'fresh_pic.png', { type: 'image/png' });

    // Upload photo
    fireEvent.change(studentFileInput, { target: { files: [testFile] } });

    await waitFor(() => {
      expect(screen.getByTestId('remove-student-photo')).toBeTruthy();
    });

    // Click Reset Form
    const resetBtn = screen.getByRole('button', { name: /Reset Form/i });
    fireEvent.click(resetBtn);

    // Photo preview and cross button are removed
    await waitFor(() => {
      expect(screen.queryByTestId('remove-student-photo')).toBeNull();
      expect(container.querySelector('img[alt="student"]')).toBeNull();
    });

    // File input value was reactively reset
    expect(studentFileInput.value).toBe('');

    // Re-selecting the exact same file works immediately
    fireEvent.change(studentFileInput, { target: { files: [testFile] } });

    await waitFor(() => {
      expect(container.querySelector('img[alt="student"]')).toBeTruthy();
      expect(screen.getByTestId('remove-student-photo')).toBeTruthy();
    });
  });

  it('R1 & R2: edit mode student without photo does not inherit previous photo and does not show cross button', async () => {
    const student1 = {
      id: 'std_101',
      admNo: '101',
      firstName: 'Rahul',
      photoUrl: 'https://school.erp/photos/rahul.jpg',
      fatherPhoto: 'https://school.erp/photos/rahul_f.jpg',
      motherPhoto: 'https://school.erp/photos/rahul_m.jpg'
    };
    const student2 = {
      id: 'std_102',
      admNo: '102',
      firstName: 'Pooja',
      photoUrl: '', // No photo
      fatherPhoto: null,
      motherPhoto: null
    };

    tenantStore.getStudents.mockReturnValue([student1, student2]);

    const { container } = render(<StudentRegistrationPage onNavigate={vi.fn()} />);

    // 1. Search and select Student 1
    const searchInput = screen.getByPlaceholderText(/Search existing student/i);
    fireEvent.change(searchInput, { target: { value: 'Rahul' } });
    const rahulOption = await screen.findByText(/Adm: #101/i);
    fireEvent.click(rahulOption);

    // Cross button should be visible for student 1
    await waitFor(() => {
      expect(screen.getByTestId('remove-student-photo')).toBeTruthy();
    });

    // 2. Search and select Student 2 (who has no photo)
    fireEvent.change(searchInput, { target: { value: 'Pooja' } });
    const poojaOption = await screen.findByText(/Adm: #102/i);
    fireEvent.click(poojaOption);

    // Cross button must NOT be present and student image must be null (default avatar SVG shown)
    await waitFor(() => {
      expect(screen.queryByTestId('remove-student-photo')).toBeNull();
      expect(container.querySelector('img[alt="student"]')).toBeNull();
      expect(screen.queryByTestId('remove-father-photo')).toBeNull();
      expect(screen.queryByTestId('remove-mother-photo')).toBeNull();
    });
  });

  it('R2 & Memory Management: replacing uploaded photo with webcam capture revokes previous blob URL', async () => {
    const { container } = render(<StudentRegistrationPage />);
    const studentFileInput = container.querySelector('input[type="file"]');
    const testFile = new File(['pic data'], 'uploaded_sample.png', { type: 'image/png' });

    // Upload via file
    fireEvent.change(studentFileInput, { target: { files: [testFile] } });

    await waitFor(() => {
      expect(screen.getByTestId('remove-student-photo')).toBeTruthy();
    });

    // Now capture photo via webcam to replace the uploaded photo
    const cameraBtn = screen.getAllByTitle('Take Photo')[0];
    fireEvent.click(cameraBtn);

    expect(await screen.findByText(/Capturing: Student Photo/i)).toBeTruthy();
    fireEvent.click(await screen.findByRole('button', { name: /Capture/i }));
    fireEvent.click(await screen.findByRole('button', { name: /Done \/ Use Photo/i }));

    await waitFor(() => {
      expect(screen.queryByText(/Capturing: Student Photo/i)).toBeNull();
    });

    // Previous blob URL was cleanly revoked
    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:http://localhost/uploaded_sample.png');

    // New webcam snapshot preview is displayed with cross button
    const img = container.querySelector('img[alt="student"]');
    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toBe('data:image/jpeg;base64,mockWebcamSnapshot');
    expect(screen.getByTestId('remove-student-photo')).toBeTruthy();
  });

  it('R2 & Memory Cleanup: unmounting component revokes all active blob URLs', async () => {
    const { container, unmount } = render(<StudentRegistrationPage />);
    const studentFileInput = container.querySelector('input[type="file"]');
    const testFile = new File(['pic data'], 'unmount_test.png', { type: 'image/png' });

    fireEvent.change(studentFileInput, { target: { files: [testFile] } });

    await waitFor(() => {
      expect(screen.getByTestId('remove-student-photo')).toBeTruthy();
    });

    unmount();

    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:http://localhost/unmount_test.png');
  });
});
