import React, { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { DashboardPage } from './modules/dashboard/DashboardPage';
import { StudentRegistrationPage } from './modules/students/StudentRegistrationPage';
import { StudentPortfolioPage } from './modules/students/StudentPortfolioPage';
import { FeeCollectionPage } from './modules/fees/FeeCollectionPage';
import { FeeStructurePage } from './modules/fees/FeeStructurePage';
import { StudentAttendancePage } from './modules/attendance/StudentAttendancePage';
import { MarksEntryPage } from './modules/examination/MarksEntryPage';
import { SchoolInfoPage } from './modules/school/SchoolInfoPage';
import { WhatsappQrPage } from './modules/school/WhatsappQrPage';
import { SettingsAndPermissionsPage } from './modules/school/SettingsAndPermissionsPage';
import { ClassMasterPage } from './modules/master/ClassMasterPage';

function App() {
  const [currentPath, setCurrentPath] = useState('/');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleNavigate = (path) => {
    setCurrentPath(path);
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
              case '/student-registration':
                return <StudentRegistrationPage onNavigate={handleNavigate} />;
              case '/student-portfolio':
                return <StudentPortfolioPage onNavigate={handleNavigate} />;
              case '/fee-collection':
                return <FeeCollectionPage onNavigate={handleNavigate} />;
              case '/fee-structure':
                return <FeeStructurePage onNavigate={handleNavigate} />;
              case '/student-attendance':
                return <StudentAttendancePage onNavigate={handleNavigate} />;
              case '/marks-entry':
                return <MarksEntryPage onNavigate={handleNavigate} />;
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
