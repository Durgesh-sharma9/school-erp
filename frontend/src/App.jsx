import React, { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { DashboardPage } from './modules/dashboard/DashboardPage';

function App() {
  const [currentPath, setCurrentPath] = useState('/');

  const handleNavigate = (path) => {
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-800 antialiased font-sans">
      {/* 1:1 UAB Collapsible Navigation Sidebar */}
      <Sidebar currentPath={currentPath} onNavigate={handleNavigate} />

      {/* Main App Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <Navbar
          schoolName="J D International School"
          session="2026-2027"
          userRole="Admin"
        />

        {/* Dynamic Canvas Routing */}
        <main className="flex-1 overflow-y-auto">
          {currentPath === '/' && (
            <DashboardPage onNavigate={handleNavigate} />
          )}

          {currentPath !== '/' && (
            <div className="p-8 max-w-4xl mx-auto text-center py-20 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto text-2xl font-bold shadow-xs">
                📄
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                Route: <span className="font-mono text-indigo-600">{currentPath}</span>
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                This page is queued for implementation in the next step.
              </p>
              <button
                onClick={() => handleNavigate('/')}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                &larr; Return to Dashboard
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
