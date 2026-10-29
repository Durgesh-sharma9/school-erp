import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StudentProfileModal } from './StudentProfileModal';
import { tenantStore } from '../../../services/tenantStore';

describe('StudentProfileModal Component', () => {
  const mockStudent = {
    admNo: '2026-101',
    srNo: '101',
    rollNo: '15',
    name: 'Aarav Sharma',
    firstName: 'Aarav',
    lastName: 'Sharma',
    className: 'Class 10',
    section: 'A',
    gender: 'Male',
    dob: '2010-08-15',
    category: 'General',
    bloodGroup: 'O+',
    nationality: 'Indian',
    motherTongue: 'Hindi',
    fatherName: 'Rajesh Sharma',
    fatherMobile: '9876543210',
    fatherOccupation: 'Chartered Accountant',
    motherName: 'Sunita Sharma',
    motherMobile: '9876543211',
    motherOccupation: 'Professor',
    guardianName: 'Vikram Sharma',
    guardianPhone: '9876543212',
    guardianRelation: 'Uncle',
    guardianOccupation: 'Advocate',
    address: '42, Shanti Path, Mansarovar, Jaipur, Rajasthan',
    contactNo: '9876543210',
    smsWhatsappNo: '9876543210',
    email: 'aarav.sharma@example.com',
    enrollNo: 'ENR-2026-101',
    admDate: '2022-04-01',
    studentType: 'Old',
    feeType: 'Day Scholar',
    stream: 'Science',
    house: 'Red House',
    status: 'Active / Enrolled',
    photoUrl: 'https://example.com/photos/aarav.jpg'
  };

  const defaultProps = {
    student: mockStudent,
    schoolName: 'Delhi Public Academy',
    onClose: vi.fn(),
    onNavigate: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal header with student photo, full name, class-section, roll no, admission no, and status badge', () => {
    render(<StudentProfileModal {...defaultProps} />);

    // Header student name
    expect(screen.getByRole('heading', { name: 'Aarav Sharma' })).toBeInTheDocument();

    // Class and section
    expect(screen.getAllByText('Class 10 - A').length).toBeGreaterThanOrEqual(1);

    // Roll No
    expect(screen.getByText('15')).toBeInTheDocument();

    // Admission No
    expect(screen.getAllByText('2026-101').length).toBeGreaterThanOrEqual(1);

    // Status badge
    const statusBadge = screen.getByTestId('student-status-badge');
    expect(statusBadge).toBeInTheDocument();
    expect(statusBadge).toHaveTextContent(/Active \/ Enrolled/i);

    // Student photo
    const img = screen.getByAltText('Aarav Sharma');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', mockStudent.photoUrl);
  });

  it('renders avatar placeholder with initials when photoUrl is absent', () => {
    const studentWithoutPhoto = { ...mockStudent, photoUrl: '' };
    render(<StudentProfileModal {...defaultProps} student={studentWithoutPhoto} />);

    const placeholder = screen.getByTestId('student-avatar-placeholder');
    expect(placeholder).toBeInTheDocument();
    expect(placeholder).toHaveTextContent('AS');
  });

  it('renders Section 1: Basic & Personal Details with all required data fields', () => {
    render(<StudentProfileModal {...defaultProps} />);

    const basicSection = screen.getByTestId('section-basic-details');
    expect(basicSection).toBeInTheDocument();
    expect(basicSection).toHaveTextContent('2010-08-15');
    expect(basicSection).toHaveTextContent('Male');
    expect(basicSection).toHaveTextContent('General');
    expect(basicSection).toHaveTextContent('O+');
    expect(basicSection).toHaveTextContent('Indian');
    expect(basicSection).toHaveTextContent('Hindi');
  });

  it('renders Section 2: Parent / Guardian Details with father, mother, and guardian fields', () => {
    render(<StudentProfileModal {...defaultProps} />);

    const parentSection = screen.getByTestId('section-parent-details');
    expect(parentSection).toBeInTheDocument();

    // Father details
    expect(parentSection).toHaveTextContent('Rajesh Sharma');
    expect(parentSection).toHaveTextContent('9876543210');
    expect(parentSection).toHaveTextContent('Chartered Accountant');

    // Mother details
    expect(parentSection).toHaveTextContent('Sunita Sharma');
    expect(parentSection).toHaveTextContent('9876543211');
    expect(parentSection).toHaveTextContent('Professor');

    // Guardian details
    expect(parentSection).toHaveTextContent('Vikram Sharma');
    expect(parentSection).toHaveTextContent('9876543212');
    expect(parentSection).toHaveTextContent('Uncle');
    expect(parentSection).toHaveTextContent('Advocate');
  });

  it('renders Section 3: Contact & Address with address, contact numbers, and email', () => {
    render(<StudentProfileModal {...defaultProps} />);

    const contactSection = screen.getByTestId('section-contact-details');
    expect(contactSection).toBeInTheDocument();
    expect(contactSection).toHaveTextContent('42, Shanti Path, Mansarovar, Jaipur, Rajasthan');
    expect(contactSection).toHaveTextContent('9876543210');
    expect(contactSection).toHaveTextContent('aarav.sharma@example.com');
  });

  it('renders Section 4: Academic & School Info with enrollment, admission date, student type, fee type, stream, house', () => {
    render(<StudentProfileModal {...defaultProps} />);

    const academicSection = screen.getByTestId('section-academic-details');
    expect(academicSection).toBeInTheDocument();
    expect(academicSection).toHaveTextContent('ENR-2026-101');
    expect(academicSection).toHaveTextContent('2022-04-01');
    expect(academicSection).toHaveTextContent('Old');
    expect(academicSection).toHaveTextContent('Day Scholar');
    expect(academicSection).toHaveTextContent('Science');
    expect(academicSection).toHaveTextContent('Red House');
  });

  it('supports tab navigation between detail sections', () => {
    render(<StudentProfileModal {...defaultProps} />);

    // Default "all" tab renders all 4 sections
    expect(screen.getByTestId('section-basic-details')).toBeInTheDocument();
    expect(screen.getByTestId('section-parent-details')).toBeInTheDocument();
    expect(screen.getByTestId('section-contact-details')).toBeInTheDocument();
    expect(screen.getByTestId('section-academic-details')).toBeInTheDocument();

    // Click "Basic & Personal Details" tab
    fireEvent.click(screen.getByRole('tab', { name: /Basic & Personal Details/i }));
    expect(screen.getByTestId('section-basic-details')).toBeInTheDocument();
    expect(screen.queryByTestId('section-parent-details')).not.toBeInTheDocument();
    expect(screen.queryByTestId('section-contact-details')).not.toBeInTheDocument();
    expect(screen.queryByTestId('section-academic-details')).not.toBeInTheDocument();

    // Click "Contact & Address" tab
    fireEvent.click(screen.getByRole('tab', { name: /Contact & Address/i }));
    expect(screen.queryByTestId('section-basic-details')).not.toBeInTheDocument();
    expect(screen.getByTestId('section-contact-details')).toBeInTheDocument();

    // Return to "All Details"
    fireEvent.click(screen.getByRole('tab', { name: /All Details/i }));
    expect(screen.getByTestId('section-basic-details')).toBeInTheDocument();
    expect(screen.getByTestId('section-parent-details')).toBeInTheDocument();
  });

  it('calls onClose when clicking the Close button in the footer', () => {
    render(<StudentProfileModal {...defaultProps} />);

    const closeBtn = screen.getByRole('button', { name: 'Close' });
    fireEvent.click(closeBtn);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking the header X button', () => {
    render(<StudentProfileModal {...defaultProps} />);

    const xBtn = screen.getByLabelText('Close modal');
    fireEvent.click(xBtn);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when pressing the Escape key', () => {
    render(<StudentProfileModal {...defaultProps} />);

    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking on the backdrop overlay', () => {
    render(<StudentProfileModal {...defaultProps} />);

    const dialog = screen.getByRole('dialog');
    fireEvent.click(dialog);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('invokes window.print() when clicking Print Profile / Slip', () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});
    render(<StudentProfileModal {...defaultProps} />);

    const printBtn = screen.getByRole('button', { name: /Print Profile \/ Slip/i });
    fireEvent.click(printBtn);

    expect(printSpy).toHaveBeenCalledTimes(1);
    printSpy.mockRestore();
  });

  it('renders all sections during print execution even when user has selected a specific tab', () => {
    let capturedSectionsDuringPrint = 0;
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {
      // Assert that during print execution, all 4 sections are in DOM
      const basic = screen.queryByTestId('section-basic-details');
      const parent = screen.queryByTestId('section-parent-details');
      const contact = screen.queryByTestId('section-contact-details');
      const academic = screen.queryByTestId('section-academic-details');
      if (basic && parent && contact && academic) {
        capturedSectionsDuringPrint = 4;
      }
    });

    render(<StudentProfileModal {...defaultProps} />);

    // User navigates to single tab "Contact & Address"
    fireEvent.click(screen.getByRole('tab', { name: /Contact & Address/i }));
    expect(screen.queryByTestId('section-basic-details')).not.toBeInTheDocument();
    expect(screen.getByTestId('section-contact-details')).toBeInTheDocument();

    // Trigger Print
    const printBtn = screen.getByRole('button', { name: /Print Profile \/ Slip/i });
    fireEvent.click(printBtn);

    expect(printSpy).toHaveBeenCalledTimes(1);
    expect(capturedSectionsDuringPrint).toBe(4);

    // After print finishes, restores active tab view
    expect(screen.queryByTestId('section-basic-details')).not.toBeInTheDocument();
    expect(screen.getByTestId('section-contact-details')).toBeInTheDocument();

    printSpy.mockRestore();
  });

  it('switches to initials placeholder when photoUrl triggers onError', () => {
    render(<StudentProfileModal {...defaultProps} />);

    const img = screen.getByAltText('Aarav Sharma');
    expect(img).toBeInTheDocument();

    // Fire error event simulating broken image URL or network error
    fireEvent.error(img);

    expect(screen.queryByAltText('Aarav Sharma')).not.toBeInTheDocument();
    const placeholder = screen.getByTestId('student-avatar-placeholder');
    expect(placeholder).toBeInTheDocument();
    expect(placeholder).toHaveTextContent('AS');
  });

  it('correctly maps snake_case properties from backend / registration payloads', () => {
    const backendStudent = {
      adm_no: '2026-999',
      roll_no: '42',
      first_name: 'Pooja',
      last_name: 'Kumari',
      class_id: 'Class 9',
      division_id: 'C',
      date_of_birth: '2011-03-21',
      caste: 'SC',
      blood_group: 'AB+',
      mother_tongue: 'Bhojpuri',
      fathers_name: 'Ram Kumar',
      fathers_mobile_no: '9876599991',
      fathers_occupation: 'Farmer',
      mothers_name: 'Sita Devi',
      mothers_mobile_no: '9876599992',
      mothers_occupation: 'Homemaker',
      guardian_name: 'Mohan Kumar',
      guardian_phone: '9876599993',
      guardian_relation: 'Grandfather',
      guardian_occupation: 'Retired',
      present_address: 'Village Rampur, District Patna',
      contact_no_sms: '9876599991',
      student_email: 'pooja.k@example.com',
      enr_no: 'ENR-2026-999',
      admission_date: '2024-04-10',
      student_type: 'New',
      fee_id: 'Hosteller',
      stream_name: 'Arts',
      house: 'Green House',
      status: 'Studying'
    };

    render(<StudentProfileModal {...defaultProps} student={backendStudent} />);

    // Header checks
    expect(screen.getByRole('heading', { name: 'Pooja Kumari' })).toBeInTheDocument();
    expect(screen.getAllByText('Class 9 - C').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getAllByText('2026-999').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByTestId('student-status-badge')).toHaveTextContent(/Active \/ Enrolled/i);

    // Section 1
    const basic = screen.getByTestId('section-basic-details');
    expect(basic).toHaveTextContent('2011-03-21');
    expect(basic).toHaveTextContent('SC');
    expect(basic).toHaveTextContent('AB+');
    expect(basic).toHaveTextContent('Bhojpuri');

    // Section 2
    const parent = screen.getByTestId('section-parent-details');
    expect(parent).toHaveTextContent('Ram Kumar');
    expect(parent).toHaveTextContent('Farmer');
    expect(parent).toHaveTextContent('Sita Devi');
    expect(parent).toHaveTextContent('Homemaker');
    expect(parent).toHaveTextContent('Mohan Kumar');
    expect(parent).toHaveTextContent('Grandfather');

    // Section 3
    const contact = screen.getByTestId('section-contact-details');
    expect(contact).toHaveTextContent('Village Rampur, District Patna');
    expect(contact).toHaveTextContent('pooja.k@example.com');

    // Section 4
    const academic = screen.getByTestId('section-academic-details');
    expect(academic).toHaveTextContent('ENR-2026-999');
    expect(academic).toHaveTextContent('2024-04-10');
    expect(academic).toHaveTextContent('Hosteller');
    expect(academic).toHaveTextContent('Arts');
    expect(academic).toHaveTextContent('Green House');
  });

  it('safely handles whitespace-only strings and falls back to placeholders', () => {
    const whitespaceStudent = {
      admNo: ' ',
      name: '   ',
      className: '   ',
      section: '   ',
      dob: '   ',
      bloodGroup: '   ',
      fatherName: '   ',
      motherName: '   ',
      address: '   '
    };

    render(<StudentProfileModal {...defaultProps} student={whitespaceStudent} />);

    // Fallbacks applied without rendering blank text
    expect(screen.getByRole('heading', { name: 'Student' })).toBeInTheDocument();
    const basic = screen.getByTestId('section-basic-details');
    expect(basic).toBeInTheDocument();
  });

  it('handles Edit Student action by loading student into tenantStore and navigating to registration', () => {
    const setPendingEditSpy = vi.spyOn(tenantStore, 'setPendingEditStudent').mockImplementation(() => {});
    render(<StudentProfileModal {...defaultProps} />);

    const editBtn = screen.getByRole('button', { name: /Edit Student/i });
    fireEvent.click(editBtn);

    expect(setPendingEditSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        admNo: '2026-101',
        name: 'Aarav Sharma',
        firstName: 'Aarav',
        lastName: 'Sharma'
      })
    );
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    expect(defaultProps.onNavigate).toHaveBeenCalledWith('/student-registration');

    setPendingEditSpy.mockRestore();
  });

  it('supports keyboard arrow navigation between tablist tabs', () => {
    render(<StudentProfileModal {...defaultProps} />);

    const allTab = screen.getByRole('tab', { name: /All Details/i });
    allTab.focus();
    expect(allTab).toHaveAttribute('aria-selected', 'true');

    // Press ArrowRight to move to "Basic & Personal Details"
    fireEvent.keyDown(allTab, { key: 'ArrowRight' });
    const basicTab = screen.getByRole('tab', { name: /Basic & Personal Details/i });
    expect(basicTab).toHaveAttribute('aria-selected', 'true');

    // Press ArrowRight again to move to "Parent / Guardian Details"
    fireEvent.keyDown(basicTab, { key: 'ArrowRight' });
    const parentTab = screen.getByRole('tab', { name: /Parent \/ Guardian Details/i });
    expect(parentTab).toHaveAttribute('aria-selected', 'true');

    // Press ArrowLeft to return to "Basic & Personal Details"
    fireEvent.keyDown(parentTab, { key: 'ArrowLeft' });
    expect(screen.getByRole('tab', { name: /Basic & Personal Details/i })).toHaveAttribute('aria-selected', 'true');
  });

  it('traps focus within the modal container when tabbing forwards and backwards', () => {
    render(<StudentProfileModal {...defaultProps} />);

    const closeBtn = screen.getByLabelText('Close modal');
    const editBtn = screen.getByRole('button', { name: /Edit Student/i });

    // Focus last focusable element and press Tab -> should wrap to first focusable element
    editBtn.focus();
    expect(document.activeElement).toBe(editBtn);
    fireEvent.keyDown(window, { key: 'Tab' });
    expect(document.activeElement).toBe(closeBtn);

    // Focus first focusable element and press Shift+Tab -> should wrap to last focusable element
    closeBtn.focus();
    expect(document.activeElement).toBe(closeBtn);
    fireEvent.keyDown(window, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(editBtn);
  });

  it('restores focus to previous active element upon modal close', () => {
    const triggerBtn = document.createElement('button');
    triggerBtn.textContent = 'Open Profile';
    document.body.appendChild(triggerBtn);
    triggerBtn.focus();
    expect(document.activeElement).toBe(triggerBtn);

    const { unmount } = render(<StudentProfileModal {...defaultProps} />);
    unmount();

    expect(document.activeElement).toBe(triggerBtn);
    document.body.removeChild(triggerBtn);
  });

  it('preserves numeric 0 for rollNo rather than falling back to placeholder', () => {
    const studentWithZeroRoll = {
      ...mockStudent,
      rollNo: 0
    };
    render(<StudentProfileModal {...defaultProps} student={studentWithZeroRoll} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('renders rose status badge styling for inactive / withdrawn students', () => {
    const inactiveStudent = {
      ...mockStudent,
      status: 'Inactive'
    };
    render(<StudentProfileModal {...defaultProps} student={inactiveStudent} />);
    const badge = screen.getByTestId('student-status-badge');
    expect(badge).toHaveTextContent('Inactive');
    expect(badge.className).toContain('text-rose-300');
  });

  it('passes normalized dob, gender, address, and photoUrl to tenantStore.setPendingEditStudent', () => {
    const setPendingEditSpy = vi.spyOn(tenantStore, 'setPendingEditStudent').mockImplementation(() => {});
    render(<StudentProfileModal {...defaultProps} />);

    const editBtn = screen.getByRole('button', { name: /Edit Student/i });
    fireEvent.click(editBtn);

    expect(setPendingEditSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        admNo: '2026-101',
        dob: '2010-08-15',
        gender: 'Male',
        address: '42, Shanti Path, Mansarovar, Jaipur, Rajasthan',
        photoUrl: 'https://example.com/photos/aarav.jpg'
      })
    );
    setPendingEditSpy.mockRestore();
  });
});
