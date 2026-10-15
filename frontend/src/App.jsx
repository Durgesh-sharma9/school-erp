import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { LoginPage } from './modules/auth/LoginPage';
import { SchoolRegistrationPage } from './modules/auth/SchoolRegistrationPage';
import { DashboardPage } from './modules/dashboard/DashboardPage';
import { StudentPortalPage } from './modules/student-portal/StudentPortalPage';
import { StaffPortalPage } from './modules/staff-portal/StaffPortalPage';
import { SuperAdminDashboardPage } from './modules/superadmin/SuperAdminDashboardPage';
import { StudentRegistrationPage } from './modules/students/StudentRegistrationPage';
import { AssignRollNumberPage } from './modules/students/AssignRollNumberPage';
import { OnlineClassesPage } from './modules/students/OnlineClassesPage';
import { PromotionPage } from './modules/students/PromotionPage';
import { StudentPortfolioPage } from './modules/students/StudentPortfolioPage';
import { IdCardGeneratorPage } from './modules/students/IdCardGeneratorPage';
import { AdmitCardGeneratorPage } from './modules/students/AdmitCardGeneratorPage';
import { ExamDateSheetPage } from './modules/students/ExamDateSheetPage';
import {
  FeeCollectionPage,
  FeeHeadGroupPage,
  FeeHeadPage,
  FeeConcessionTypePage,
  FeeFineMasterPage,
  FeeStructurePage,
  FeeEditManualPage,
  FeeConcessionPage,
  SiblingFeeCollectionPage,
  FeeRefundPage,
  BoardFeeManualCollectionPage,
  FeeReportsPage,
  FeeCollectionSummaryReportPage,
  OnlineCollectionSummaryReportPage,
  BoardCollectionSummaryReportPage,
  BoardFeeDueListReportPage,
  FeeDueListReportPage,
  FeeConcessionSummaryReportPage,
  FeeAdvanceReportPage,
  FeeStructureReportPage,
  FeeOpeningBalanceReportPage,
  StudentFeeStatementReportPage,
  FeeBookReportPage,
  CancelFeeReceiptReportPage,
  DiscountFeeReceiptReportPage
} from './modules/fees';
import { StudentAttendancePage } from './modules/attendance/StudentAttendancePage';
import { MarksEntryPage } from './modules/examination/MarksEntryPage';
import { SchoolInfoPage } from './modules/school/SchoolInfoPage';
import { WhatsappQrPage } from './modules/school/WhatsappQrPage';
import { SettingsAndPermissionsPage } from './modules/school/SettingsAndPermissionsPage';
import { ClassMasterPage } from './modules/master/ClassMasterPage';
import { SubjectGroupPage } from './modules/master/SubjectGroupPage';
import { SubjectMasterPage } from './modules/master/SubjectMasterPage';
import { SubjectLinkPage } from './modules/master/SubjectLinkPage';
import { StreamMasterPage } from './modules/master/StreamMasterPage';
import { ClassListPage } from './modules/master/ClassListPage';
import { SubjectListPage } from './modules/master/SubjectListPage';
import {
  StudentListPage,
  DonationReportPage,
  StudentBoardDataSummaryPage,
  StudentPromotionListPage,
  InactiveStudentListPage,
  StudentBoardRegistrationPage,
  StudentConsolidatedReportPage,
  GenerateSlipsReportPage,
  AttendanceReportPage,
  DayWiseAttendanceSummaryPage,
  MonthlyAttendanceReportPage,
  StudentWiseSubjectListPage,
  DateSheetReportPage,
  SiblingReportPage,
  TcReportPage,
  CancelTcReportPage,
  StudentCallListPage,
  SubjectWiseStudentListPage
} from './modules/students/reports';
import {
  CertificateGeneratorPage,
  GenerateManualTcPage,
  BulkTcPage,
  ManualCcBcPage,
  TransferCertificatePage
} from './modules/certificates';
import {
  StudyMaterialPage,
  HomeworkPage,
  PreviousYearPaperPage,
  HomeworkStatusReportPage
} from './modules/study-material';
import {
  SendGreetingCardPage,
  BirthdayReportPage
} from './modules/greeting-card';
import {
  AddEditBulkStudentsPage,
  StudentPhotoManagementPage
} from './modules/bulk-editing';
import {
  CrmDashboardPage,
  CrmEnquiriesPage,
  CrmTasksPage,
  CrmAssessmentsPage,
  CrmAdmissionFormPage,
  CrmQrLinksPage,
  CrmThankYouCmsPage
} from './modules/crm';
import { Toaster } from 'react-hot-toast';

function AppContent() {
  const { user, isAuthenticated, role } = useAuth();

  const [currentPath, setCurrentPath] = useState(() => {
    return window.location.pathname && window.location.pathname !== '' ? window.location.pathname : '/';
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (path) => {
    setCurrentPath(path);
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route protection and canonical redirects
  useEffect(() => {
    if (currentPath === '/') {
      if (isAuthenticated) {
        handleNavigate('/dashboard');
      } else {
        handleNavigate('/login');
      }
    } else if (!isAuthenticated && currentPath !== '/login' && currentPath !== '/register') {
      handleNavigate('/login');
    }
  }, [currentPath, isAuthenticated]);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  // If navigating to /register, show self-serve SchoolRegistrationPage
  if (currentPath === '/register') {
    return (
      <>
        <Toaster position="top-right" />
        <SchoolRegistrationPage onNavigate={handleNavigate} />
      </>
    );
  }

  // If unauthenticated or navigating to /login, show full LoginPage
  if (!isAuthenticated || currentPath === '/login') {
    return (
      <>
        <Toaster position="top-right" />
        <LoginPage onNavigate={handleNavigate} />
      </>
    );
  }

  // Helper for root dashboard view based on active role
  const renderDashboardByRole = () => {
    if (role === 'STUDENT') {
      return <StudentPortalPage onNavigate={handleNavigate} />;
    }
    if (role === 'STAFF') {
      return <StaffPortalPage onNavigate={handleNavigate} />;
    }
    if (role === 'SUPER_ADMIN') {
      return <SuperAdminDashboardPage onNavigate={handleNavigate} />;
    }
    // Default ADMIN role
    return <DashboardPage onNavigate={handleNavigate} />;
  };

  return (
    <div className="flex min-h-screen bg-[#f3f4f6] text-slate-800 antialiased font-sans">
      <Toaster position="top-right" />

      {/* 1:1 UAB Collapsible Navigation Sidebar */}
      <Sidebar
        currentPath={currentPath}
        onNavigate={handleNavigate}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Full-Width Canvas Container */}
      <div className="flex-1 flex flex-col min-w-0 w-full overflow-hidden">
        {/* Top Navbar */}
        <Navbar
          session="2026-2027"
          onToggleSidebar={handleToggleSidebar}
          onNavigate={handleNavigate}
        />

        {/* Dynamic Canvas Routing */}
        <main className="flex-1 overflow-y-auto">
          {(() => {
            switch (currentPath) {
              case '/':
              case '/dashboard':
                return renderDashboardByRole();
              case '/register':
                return <SchoolRegistrationPage onNavigate={handleNavigate} />;
              case '/superadmin-analytics':
                return <SuperAdminDashboardPage onNavigate={handleNavigate} />;
              case '/student-portal':
                return <StudentPortalPage onNavigate={handleNavigate} />;
              case '/staff-portal':
                return <StaffPortalPage onNavigate={handleNavigate} />;
              case '/school-info':
                return <SchoolInfoPage onNavigate={handleNavigate} />;
              case '/whatsapp-qr-settings':
                return <WhatsappQrPage onNavigate={handleNavigate} />;
              case '/settings-and-permissions':
                return <SettingsAndPermissionsPage onNavigate={handleNavigate} />;
              case '/class':
                return <ClassMasterPage onNavigate={handleNavigate} />;
              case '/subject-group':
                return <SubjectGroupPage onNavigate={handleNavigate} />;
              case '/subject':
                return <SubjectMasterPage onNavigate={handleNavigate} />;
              case '/subject-link':
                return <SubjectLinkPage onNavigate={handleNavigate} />;
              case '/add-update-stream':
                return <StreamMasterPage onNavigate={handleNavigate} />;
              case '/class-list':
                return <ClassListPage onNavigate={handleNavigate} />;
              case '/subject-list':
                return <SubjectListPage onNavigate={handleNavigate} />;
              case '/student-registration':
                return <StudentRegistrationPage onNavigate={handleNavigate} />;
              case '/assign-roll-number':
                return <AssignRollNumberPage onNavigate={handleNavigate} />;
              case '/student-attendance':
                return <StudentAttendancePage onNavigate={handleNavigate} />;
              case '/create-online-classes':
                return <OnlineClassesPage onNavigate={handleNavigate} />;
              case '/promotion':
                return <PromotionPage onNavigate={handleNavigate} />;
              case '/student-portfolio':
                return <StudentPortfolioPage onNavigate={handleNavigate} />;
              case '/id-card-generator':
                return <IdCardGeneratorPage onNavigate={handleNavigate} />;
              case '/admit-card-generator':
                return <AdmitCardGeneratorPage onNavigate={handleNavigate} />;
              case '/exam-date-sheet':
                return <ExamDateSheetPage onNavigate={handleNavigate} />;
              case '/fee-collection':
                return <FeeCollectionPage onNavigate={handleNavigate} />;
              case '/fee-head-group':
                return <FeeHeadGroupPage onNavigate={handleNavigate} />;
              case '/fee-head':
                return <FeeHeadPage onNavigate={handleNavigate} />;
              case '/fee-concession-type':
                return <FeeConcessionTypePage onNavigate={handleNavigate} />;
              case '/fee-fine-master':
                return <FeeFineMasterPage onNavigate={handleNavigate} />;
              case '/fee-structure':
                return <FeeStructurePage onNavigate={handleNavigate} />;
              case '/fee-edit-manual':
                return <FeeEditManualPage onNavigate={handleNavigate} />;
              case '/fee-concession':
                return <FeeConcessionPage onNavigate={handleNavigate} />;
              case '/sibling-fee-collection':
                return <SiblingFeeCollectionPage onNavigate={handleNavigate} />;
              case '/fee-refund':
                return <FeeRefundPage onNavigate={handleNavigate} />;
              case '/board-fee-manual-collection':
                return <BoardFeeManualCollectionPage onNavigate={handleNavigate} />;
              case '/fee-reports':
                return <FeeReportsPage onNavigate={handleNavigate} />;
              case '/fee-collection-summary':
                return <FeeCollectionSummaryReportPage onNavigate={handleNavigate} />;
              case '/online-collection-summary':
                return <OnlineCollectionSummaryReportPage onNavigate={handleNavigate} />;
              case '/board-online-collection-summary':
                return <BoardCollectionSummaryReportPage onNavigate={handleNavigate} />;
              case '/board-fee-due-list':
                return <BoardFeeDueListReportPage onNavigate={handleNavigate} />;
              case '/fee-due-list':
              case '/fee-due-list-month-wise':
                return <FeeDueListReportPage onNavigate={handleNavigate} />;
              case '/fee-concession-summary':
                return <FeeConcessionSummaryReportPage onNavigate={handleNavigate} />;
              case '/fee-advance-report':
                return <FeeAdvanceReportPage onNavigate={handleNavigate} />;
              case '/fee-structure-report':
                return <FeeStructureReportPage onNavigate={handleNavigate} />;
              case '/fee-opening-balance-report':
                return <FeeOpeningBalanceReportPage onNavigate={handleNavigate} />;
              case '/student-fees-statement':
                return <StudentFeeStatementReportPage onNavigate={handleNavigate} />;
              case '/fee-book-report':
                return <FeeBookReportPage onNavigate={handleNavigate} />;
              case '/cancel-fee-receipt-report':
                return <CancelFeeReceiptReportPage onNavigate={handleNavigate} />;
              case '/discount-fee-receipt-report':
                return <DiscountFeeReceiptReportPage onNavigate={handleNavigate} />;
              case '/marks-entry':
                return <MarksEntryPage onNavigate={handleNavigate} />;
              case '/students-report':
              case '/student-reports':
                return <StudentListPage onNavigate={handleNavigate} />;
              case '/donation-collection-report':
                return <DonationReportPage onNavigate={handleNavigate} />;
              case '/student-upload-data-summary':
                return <StudentBoardDataSummaryPage onNavigate={handleNavigate} />;
              case '/students-promotion-report':
                return <StudentPromotionListPage onNavigate={handleNavigate} />;
              case '/inactive-student-list':
                return <InactiveStudentListPage onNavigate={handleNavigate} />;
              case '/student-board-registration':
                return <StudentBoardRegistrationPage onNavigate={handleNavigate} />;
              case '/student-consolidated-report':
                return <StudentConsolidatedReportPage onNavigate={handleNavigate} />;
              case '/generate-slips-report':
                return <GenerateSlipsReportPage onNavigate={handleNavigate} />;
              case '/attendance-report':
                return <AttendanceReportPage onNavigate={handleNavigate} />;
              case '/student-attedance-summary':
                return <DayWiseAttendanceSummaryPage onNavigate={handleNavigate} />;
              case '/monthly-attendance-report':
                return <MonthlyAttendanceReportPage onNavigate={handleNavigate} />;
              case '/student-wise-subject-list':
                return <StudentWiseSubjectListPage onNavigate={handleNavigate} />;
              case '/date-sheet-report':
                return <DateSheetReportPage onNavigate={handleNavigate} />;
              case '/sibling-report':
                return <SiblingReportPage onNavigate={handleNavigate} />;
              case '/tc-report':
                return <TcReportPage onNavigate={handleNavigate} />;
              case '/cancel-tc-report':
                return <CancelTcReportPage onNavigate={handleNavigate} />;
              case '/student-call-list':
                return <StudentCallListPage onNavigate={handleNavigate} />;
              case '/subject-wise-student-details':
                return <SubjectWiseStudentListPage onNavigate={handleNavigate} />;
              case '/certificate-generater-new':
                return <CertificateGeneratorPage onNavigate={handleNavigate} />;
              case '/transfer-certificate':
                return <TransferCertificatePage onNavigate={handleNavigate} />;
              case '/generate-manual-tc':
                return <GenerateManualTcPage onNavigate={handleNavigate} />;
              case '/add-update-tc-bulk':
                return <BulkTcPage onNavigate={handleNavigate} />;
              case '/manual-cc-bc':
                return <ManualCcBcPage onNavigate={handleNavigate} />;
              case '/study-material':
                return <StudyMaterialPage onNavigate={handleNavigate} />;
              case '/homework':
                return <HomeworkPage onNavigate={handleNavigate} />;
              case '/upload-pre-year-paper':
                return <PreviousYearPaperPage onNavigate={handleNavigate} />;
              case '/get-homework-status-report':
              case '/study-material-reports':
                return <HomeworkStatusReportPage onNavigate={handleNavigate} />;
              case '/send-greeting-card-msg':
                return <SendGreetingCardPage onNavigate={handleNavigate} />;
              case '/birthday-report':
              case '/greeting-card-reports':
                return <BirthdayReportPage onNavigate={handleNavigate} />;
              case '/add-edit-bulk-students':
                return <AddEditBulkStudentsPage onNavigate={handleNavigate} />;
              case '/student-photo-management':
                return <StudentPhotoManagementPage onNavigate={handleNavigate} />;
              case '/crm':
              case '/crm/dashboard':
                return <CrmDashboardPage onNavigate={handleNavigate} />;
              case '/crm/enquiries':
                return <CrmEnquiriesPage onNavigate={handleNavigate} />;
              case '/crm/tasks':
                return <CrmTasksPage onNavigate={handleNavigate} />;
              case '/crm/assessments':
                return <CrmAssessmentsPage onNavigate={handleNavigate} />;
              case '/crm/admission-form':
                return <CrmAdmissionFormPage onNavigate={handleNavigate} />;
              case '/crm/qr-code':
                return <CrmQrLinksPage onNavigate={handleNavigate} />;
              case '/crm/thankyou-cms':
                return <CrmThankYouCmsPage onNavigate={handleNavigate} />;
              default:
                return (
                  <div className="p-8 max-w-4xl mx-auto text-center py-20 space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto text-2xl font-bold shadow-xs">
                      📄
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-900">
                      Route: <span className="font-mono text-indigo-600">{currentPath}</span>
                    </h3>
                    <p className="text-sm text-slate-500 max-w-md mx-auto">
                      Ready for implementation in the next step.
                    </p>
                    <button
                      onClick={() => handleNavigate('/')}
                      className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
                    >
                      &larr; Return to Dashboard
                    </button>
                  </div>
                );
            }
          })()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
