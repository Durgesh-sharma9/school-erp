import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { StudentListPage } from './StudentListPage';
import { tenantStore } from '../../../services/tenantStore';

// Mock useAuth context hook
vi.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({
    schoolId: 'sch_test',
    schoolName: 'Delhi Public Academy'
  })
}));

describe('StudentListPage Actions & Profile Modal Integration', () => {
  const mockStudents = [
    {
      sNo: 1,
      admNo: '1001',
      srNo: '1001',
      rollNo: '1',
      name: 'Rohan Verma',
      firstName: 'Rohan',
      lastName: 'Verma',
      className: 'Class 8',
      section: 'B',
      fatherName: 'Alok Verma',
      motherName: 'Meena Verma',
      contactNo: '9876500001',
      enrollNo: 'ENR-1001',
      dob: '2012-06-10',
      gender: 'Male',
      category: 'OBC',
      bloodGroup: 'B+',
      nationality: 'Indian',
      motherTongue: 'Hindi',
      fatherMobile: '9876500001',
      fatherOccupation: 'Engineer',
      motherMobile: '9876500002',
      motherOccupation: 'Teacher',
      guardianName: 'Ramesh Verma',
      guardianPhone: '9876500003',
      guardianRelation: 'Uncle',
      guardianOccupation: 'Doctor',
      address: 'Plot 15, Sector 5, Jaipur',
      email: 'rohan.verma@example.com',
      admDate: '2023-04-05',
      studentType: 'New',
      feeType: 'Day Scholar',
      stream: 'General',
      house: 'Blue House',
      status: 'Active'
    },
    {
      sNo: 2,
      admNo: '1002',
      srNo: '1002',
      rollNo: '2',
      name: 'Ananya Sharma',
      firstName: 'Ananya',
      lastName: 'Sharma',
      className: 'Class 10',
      section: 'A',
      fatherName: 'Suresh Sharma',
      motherName: 'Pooja Sharma',
      contactNo: '9876500004',
      enrollNo: 'ENR-1002',
      status: 'Active'
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(tenantStore, 'getStudents').mockReturnValue(mockStudents);
    vi.spyOn(tenantStore, 'getClasses').mockReturnValue(['Class 8', 'Class 10']);
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: mockStudents })
    });
  });

  it('renders student list table with View (Eye icon) button in ACTIONS column', async () => {
    render(<StudentListPage onNavigate={vi.fn()} />);

    // Check table headers
    expect(screen.getByText('ACTIONS')).toBeInTheDocument();

    // Check student names rendered
    expect(await screen.findByText('Rohan Verma')).toBeInTheDocument();
    expect(screen.getByText('Ananya Sharma')).toBeInTheDocument();

    // Check View buttons rendered for each student row
    const viewButtons = screen.getAllByRole('button', { name: /View Student Profile/i });
    expect(viewButtons.length).toBe(2);
  });

  it('opens centered student profile modal when clicking View button on a student row', async () => {
    render(<StudentListPage onNavigate={vi.fn()} />);

    const viewButtons = await screen.findAllByRole('button', { name: /View Student Profile/i });
    fireEvent.click(viewButtons[0]);

    // Modal opens displaying selected student's details
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByRole('heading', { name: 'Rohan Verma' })).toBeInTheDocument();
    expect(screen.getAllByText('Class 8 - B').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByTestId('student-status-badge')).toBeInTheDocument();

    // Four detail sections rendered
    expect(screen.getByTestId('section-basic-details')).toHaveTextContent('2012-06-10');
    expect(screen.getByTestId('section-parent-details')).toHaveTextContent('Alok Verma');
    expect(screen.getByTestId('section-contact-details')).toHaveTextContent('Plot 15, Sector 5, Jaipur');
    expect(screen.getByTestId('section-academic-details')).toHaveTextContent('ENR-1001');
  });

  it('closes modal when clicking Close button and returns to list view', async () => {
    render(<StudentListPage onNavigate={vi.fn()} />);

    const viewButtons = await screen.findAllByRole('button', { name: /View Student Profile/i });
    fireEvent.click(viewButtons[0]);

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: 'Close' });
    fireEvent.click(closeBtn);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes modal when clicking outside (backdrop click)', async () => {
    render(<StudentListPage onNavigate={vi.fn()} />);

    const viewButtons = await screen.findAllByRole('button', { name: /View Student Profile/i });
    fireEvent.click(viewButtons[0]);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();

    fireEvent.click(dialog);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('navigates to student registration edit mode when clicking Edit Student in modal', async () => {
    const onNavigate = vi.fn();
    const setPendingEditSpy = vi.spyOn(tenantStore, 'setPendingEditStudent').mockImplementation(() => {});

    render(<StudentListPage onNavigate={onNavigate} />);

    const viewButtons = await screen.findAllByRole('button', { name: /View Student Profile/i });
    fireEvent.click(viewButtons[0]);

    const dialog = screen.getByRole('dialog');
    const editBtn = within(dialog).getByRole('button', { name: 'Edit Student' });
    fireEvent.click(editBtn);

    expect(setPendingEditSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        admNo: '1001',
        name: 'Rohan Verma'
      })
    );
    expect(onNavigate).toHaveBeenCalledWith('/student-registration');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    setPendingEditSpy.mockRestore();
  });

  it('retains mapped properties (enrollNo, contactNo, fatherName) after search filtering and opens modal', async () => {
    render(<StudentListPage onNavigate={vi.fn()} />);
    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: /View Student Profile/i }).length).toBe(2);
    });
    expect(screen.getByText('Rohan Verma')).toBeInTheDocument();

    // Search for Rohan
    const searchInput = screen.getByPlaceholderText(/Search by name, adm no/i);
    fireEvent.change(searchInput, { target: { value: 'Rohan' } });
    fireEvent.keyUp(searchInput, { key: 'Enter', code: 'Enter' });

    // Table displays filtered result with mapped enrollNo and contactNo
    expect(screen.getByText('Rohan Verma')).toBeInTheDocument();
    expect(screen.queryByText('Ananya Sharma')).not.toBeInTheDocument();
    expect(screen.getByText('ENR-1001')).toBeInTheDocument();
    expect(screen.getByText('Alok Verma')).toBeInTheDocument();
    expect(screen.getByText('9876500001')).toBeInTheDocument();

    // Click View on filtered row
    const viewBtn = screen.getByRole('button', { name: /View Student Profile - Rohan Verma/i });
    fireEvent.click(viewBtn);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByRole('heading', { name: 'Rohan Verma' })).toBeInTheDocument();
  });

  it('correctly maps raw students stored from StudentRegistrationPage (snake_case)', async () => {
    const rawStudent = [{
      adm_no: '5001',
      first_name: 'Simran',
      last_name: 'Kaur',
      className: 'Class 5',
      section: 'A',
      fathers_name: 'Gurpreet Singh',
      mothers_name: 'Harpreet Kaur',
      contact_no_sms: '9988776655'
    }];
    vi.spyOn(tenantStore, 'getStudents').mockReturnValue(rawStudent);
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: rawStudent })
    });

    render(<StudentListPage onNavigate={vi.fn()} />);

    expect(await screen.findByText('Simran Kaur')).toBeInTheDocument();
    expect(screen.getByText('ENR-5001')).toBeInTheDocument();
    expect(screen.getByText('Gurpreet Singh')).toBeInTheDocument();
    expect(screen.getByText('9988776655')).toBeInTheDocument();

    const viewBtn = screen.getByRole('button', { name: /View Student Profile - Simran Kaur/i });
    fireEvent.click(viewBtn);

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByRole('heading', { name: 'Simran Kaur' })).toBeInTheDocument();
    expect(within(dialog).getByTestId('section-parent-details')).toHaveTextContent('Gurpreet Singh');
  });

  it('correctly displays adm_no in ADM.NO. column for snake_case students', async () => {
    const rawStudent = [{
      adm_no: '5001',
      sr_no: 'SR-5001',
      first_name: 'Simran',
      last_name: 'Kaur',
      className: 'Class 5',
      section: 'A'
    }];
    vi.spyOn(tenantStore, 'getStudents').mockReturnValue(rawStudent);
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: rawStudent })
    });

    render(<StudentListPage onNavigate={vi.fn()} />);
    expect(await screen.findByText('5001')).toBeInTheDocument();
    expect(screen.getByText('SR-5001')).toBeInTheDocument();
  });

  it('filters students by enrollment number in search input', async () => {
    render(<StudentListPage onNavigate={vi.fn()} />);
    expect(await screen.findByText('Rohan Verma')).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText(/Search by name, adm no/i);
    fireEvent.change(searchInput, { target: { value: 'ENR-1002' } });
    fireEvent.keyUp(searchInput, { key: 'Enter', code: 'Enter' });

    expect(screen.getByText('Ananya Sharma')).toBeInTheDocument();
    expect(screen.queryByText('Rohan Verma')).not.toBeInTheDocument();
  });

  it('supports sorting by Enroll. No.', async () => {
    render(<StudentListPage onNavigate={vi.fn()} />);
    expect(await screen.findByText('Rohan Verma')).toBeInTheDocument();

    const sortSelect = screen.getAllByRole('combobox')[1];
    fireEvent.change(sortSelect, { target: { value: 'Enroll. No.' } });

    const searchBtn = screen.getByRole('button', { name: 'Search' });
    fireEvent.click(searchBtn);

    const rows = screen.getAllByRole('row');
    expect(rows.length).toBeGreaterThanOrEqual(3);
  });
});
