import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-xl w-full bg-slate-800/80 border border-slate-700/80 rounded-2xl p-8 shadow-2xl backdrop-blur-sm text-center">
        <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-cyan-400 rounded-2xl mx-auto flex items-center justify-center text-3xl font-bold mb-4 shadow-lg shadow-indigo-500/30">
          🎓
        </div>
        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-indigo-200 to-cyan-300 bg-clip-text text-transparent mb-2">
          Unified School ERP
        </h1>
        <p className="text-sm text-slate-400 mb-6">
          Enterprise Multi-Tenant SaaS Platform (WebNCode Ecosystem)
        </p>
        
        <div className="grid grid-cols-2 gap-3 text-left text-xs mb-6 font-mono">
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <span className="text-indigo-400 font-semibold block mb-1">Frontend:</span>
            React + Vite + Tailwind
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <span className="text-cyan-400 font-semibold block mb-1">Backend:</span>
            Node.js + Express
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <span className="text-emerald-400 font-semibold block mb-1">Database:</span>
            PostgreSQL + Prisma
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <span className="text-purple-400 font-semibold block mb-1">Services:</span>
            ImageKit + SMTP + WhatsApp
          </div>
        </div>

        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Ready for Part 1: Core Foundation & Master Setup</span>
        </div>
      </div>
    </div>
  );
}

export default App;
