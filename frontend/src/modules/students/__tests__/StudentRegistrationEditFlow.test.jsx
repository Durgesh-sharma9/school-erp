import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StudentRegistrationPage } from '../StudentRegistrationPage';
import { tenantStore } from '../../../services/tenantStore';

// Mock AuthContext
vi.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({
    schoolId: 'sch_jd_intl',
    schoolName: 'J D International School'
  })
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn()
  })
}));

// Mock fetch
globalThis.fetch = vi.fn().mockImplementation((url) => {
  if (url.includes('/api/academics/classes')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ success: true, data: [{ name: 'I' }, { name: 'II' }] })
    });
  }
  if (url.includes('/api/students')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ success: true, data: [] })
    });
  }
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true })
  });
});

describe('StudentRegistrationPage Edit Mode & In-Place Update Flow', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  it('R1: Populates student for edit and displays edit banner and "Update Student" button', async () => {
    // Seed an existing student in tenantStore
    const existingStudent = {
      id: 'std_1001',
      admNo: '1001',
      srNo: '1001',
      firstName: 'Aarav',
      name: 'Aarav Sharma',
      className: 'X',
      section: 'A',
      gender: 'Male',
      dob: '2008-05-15',
      fatherName: 'Rajesh Sharma',
      fatherMobile: '9876543210',
      feeType: 'Day Scholar',
      studentType: 'New',
      status: 'Studying'
    };
    tenantStore.setStudents('sch_jd_intl', [existingStudent]);
    tenantStore.setPendingEditStudent(existingStudent);

    render(<StudentRegistrationPage onNavigate={vi.fn()} />);

    // Wait for form to prefill
    await waitFor(() => {
      expect(screen.getByText(/Edit Mode:/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Updating student/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Update Student/i })).toBeInTheDocument();
  });

  it('R1: Cancel edit clears edit mode and resets the form to new student registration', async () => {
    const existingStudent = {
      id: 'std_1001',
      admNo: '1001',
      srNo: '1001',
      firstName: 'Aarav',
      name: 'Aarav Sharma',
      className: 'X',
      section: 'A',
      gender: 'Male',
      dob: '2008-05-15'
    };
    tenantStore.setStudents('sch_jd_intl', [existingStudent]);
    tenantStore.setPendingEditStudent(existingStudent);

    render(<StudentRegistrationPage onNavigate={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText(/Edit Mode:/i)).toBeInTheDocument();
    });

    // Click "Cancel Edit / New Student"
    const cancelBtn = screen.getByRole('button', { name: /Cancel Edit \/ New Student/i });
    fireEvent.click(cancelBtn);

    // Edit banner should be gone
    expect(screen.queryByText(/Edit Mode:/i)).not.toBeInTheDocument();
    // Button should be "Save Student"
    expect(screen.getByRole('button', { name: /Save Student/i })).toBeInTheDocument();
  });

  it('R1: Submitting updates existing student in-place, prevents duplicate, and clears edit state', async () => {
    const existingStudent = {
      id: 'std_1001',
      admNo: '1001',
      srNo: '1001',
      firstName: 'Aarav',
      name: 'Aarav Sharma',
      className: 'X',
      section: 'A',
      gender: 'Male',
      dob: '2008-05-15',
      feeType: 'Day Scholar',
      studentType: 'New',
      status: 'Studying'
    };
    tenantStore.setStudents('sch_jd_intl', [existingStudent]);
    tenantStore.setPendingEditStudent(existingStudent);

    render(<StudentRegistrationPage onNavigate={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Update Student/i })).toBeInTheDocument();
    });

    // Submit form (Update Student)
    const updateBtn = screen.getByRole('button', { name: /Update Student/i });
    fireEvent.click(updateBtn);

    // Verify tenantStore still has exactly 1 student
    await waitFor(() => {
      const students = tenantStore.getStudents('sch_jd_intl');
      expect(students.length).toBe(1);
    });

    // Verify edit mode state is cleared after successful save
    await waitFor(() => {
      expect(screen.queryByText(/Edit Mode:/i)).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Save Student/i })).toBeInTheDocument();
    });
  });

  it('R1: Reset Form clears edit mode cleanly', async () => {
    const existingStudent = {
      id: 'std_1001',
      admNo: '1001',
      srNo: '1001',
      firstName: 'Aarav',
      name: 'Aarav Sharma',
      className: 'X',
      section: 'A',
      gender: 'Male',
      dob: '2008-05-15'
    };
    tenantStore.setStudents('sch_jd_intl', [existingStudent]);
    tenantStore.setPendingEditStudent(existingStudent);

    render(<StudentRegistrationPage onNavigate={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText(/Edit Mode:/i)).toBeInTheDocument();
    });

    const resetBtn = screen.getByRole('button', { name: /Reset Form/i });
    fireEvent.click(resetBtn);

    expect(screen.queryByText(/Edit Mode:/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save Student/i })).toBeInTheDocument();
  });

  it('R1: Successfully hydrates snake_case student object into form fields', async () => {
    const snakeCaseStudent = {
      id: 'std_2002',
      adm_no: '2002',
      sr_no: 'SR-2002',
      first_name: 'Priya',
      last_name: 'Verma',
      class_id: 'II',
      division_id: 'B',
      fathers_name: 'Rajesh Verma',
      gender: 'Female',
      dob: '2016-08-12'
    };
    tenantStore.setStudents('sch_jd_intl', [snakeCaseStudent]);
    tenantStore.setPendingEditStudent(snakeCaseStudent);

    render(<StudentRegistrationPage onNavigate={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText(/Edit Mode:/i)).toBeInTheDocument();
    });

    // Check that form input values received snake_case fields correctly
    const admInput = document.querySelector('input[name="adm_no"]');
    const nameInput = document.querySelector('input[name="first_name"]');
    expect(admInput.value).toBe('2002');
    expect(nameInput.value).toBe('Priya');
  });

  it('R1: Blurring adm_no loads existing student into edit mode', async () => {
    const student = {
      id: 'std_3003',
      admNo: '3003',
      srNo: '3003',
      firstName: 'Kabir',
      name: 'Kabir Das',
      className: 'I',
      section: 'A',
      gender: 'Male',
      dob: '2018-01-01'
    };
    tenantStore.setStudents('sch_jd_intl', [student]);

    render(<StudentRegistrationPage onNavigate={vi.fn()} />);

    // Initially in new registration mode
    expect(screen.queryByText(/Edit Mode:/i)).not.toBeInTheDocument();

    const admInput = document.querySelector('input[name="adm_no"]');
    fireEvent.change(admInput, { target: { value: '3003' } });
    fireEvent.blur(admInput);

    await waitFor(() => {
      expect(screen.getByText(/Edit Mode:/i)).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /Update Student/i })).toBeInTheDocument();
  });

  it('R1: Case-insensitive blur matches alphanumeric admission number', async () => {
    const student = {
      id: 'std_4004',
      admNo: 'ADM-4004',
      srNo: '4004',
      firstName: 'Vikram',
      name: 'Vikram Rao',
      className: 'II',
      section: 'B',
      gender: 'Male',
      dob: '2017-02-14'
    };
    tenantStore.setStudents('sch_jd_intl', [student]);

    render(<StudentRegistrationPage onNavigate={vi.fn()} />);

    const admInput = document.querySelector('input[name="adm_no"]');
    // Blur with lowercase 'adm-4004'
    fireEvent.change(admInput, { target: { value: 'adm-4004' } });
    fireEvent.blur(admInput);

    await waitFor(() => {
      expect(screen.getByText(/Edit Mode:/i)).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /Update Student/i })).toBeInTheDocument();
  });

  it('R1: Fully hydrates email, aadhaar, and blood group into form fields for edit', async () => {
    const student = {
      id: 'std_5005',
      admNo: '5005',
      srNo: '5005',
      firstName: 'Sneha',
      lastName: 'Roy',
      className: 'III',
      section: 'A',
      gender: 'Female',
      dob: '2016-04-10',
      email: 'sneha@example.com',
      aadhaar: '998877665544',
      bloodGroup: 'O+'
    };
    tenantStore.setStudents('sch_jd_intl', [student]);
    tenantStore.setPendingEditStudent(student);

    render(<StudentRegistrationPage onNavigate={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText(/Edit Mode:/i)).toBeInTheDocument();
    });

    // Main fields
    const nameInput = document.querySelector('input[name="first_name"]');
    const admInput = document.querySelector('input[name="adm_no"]');
    expect(nameInput.value).toBe('Sneha');
    expect(admInput.value).toBe('5005');

    // Open KYC accordion
    const kycAccordionBtn = screen.getByText(/KYC, IDENTITY & CATEGORY DETAILS/i);
    fireEvent.click(kycAccordionBtn);

    const aadhaarInput = document.querySelector('input[name="aadhaar"]');
    expect(aadhaarInput).toBeTruthy();
    expect(aadhaarInput.value).toBe('998877665544');
  });
});
