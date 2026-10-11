import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { DashboardPage } from './modules/dashboard/DashboardPage';
import { StudentRegistrationPage } from './modules/students/StudentRegistrationPage';
import { AssignRollNumberPage } from './modules/students/AssignRollNumberPage';
import { OnlineClassesPage } from './modules/students/OnlineClassesPage';
import { PromotionPage } from './modules/students/PromotionPage';
import { StudentPortfolioPage } from './modules/students/StudentPortfolioPage';
import { IdCardGeneratorPage } from './modules/students/IdCardGeneratorPage';
import { AdmitCardGeneratorPage } from './modules/students/AdmitCardGeneratorPage';
import { ExamDateSheetPage } from './modules/students/ExamDateSheetPage';
import { FeeCollectionPage } from './modules/fees/FeeCollectionPage';
import { FeeStructurePage } from './modules/fees/FeeStructurePage';
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
  PreviousYearPaperPage
} from './modules/study-material';
import {
  CrmDashboardPage,
  CrmEnquiriesPage,
  CrmTasksPage,
  CrmAssessmentsPage,
  CrmAdmissionFormPage,
  CrmQrLinksPage,
  CrmThankYouCmsPage
} from './modules/crm';

function App() {
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

  const handleToggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div className="flex min-h-screen bg-[#f3f4f6] text-slate-800 antialiased font-sans">
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
          schoolName="J D International School"
          session="2026-2027"
          onToggleSidebar={handleToggleSidebar}
        />

        {/* Dynamic Canvas Routing */}
        <main className="flex-1 overflow-y-auto">
          {(() => {
            switch (currentPath) {
              case '/':
                return <DashboardPage onNavigate={handleNavigate} />;
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
              case '/fee-structure':
                return <FeeStructurePage onNavigate={handleNavigate} />;
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

export default App;
