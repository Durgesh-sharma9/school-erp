import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-lg w-full bg-slate-800 border border-slate-700 rounded-2xl p-8 text-center shadow-xl">
        <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-3xl font-bold mb-4 shadow-lg shadow-indigo-500/20">
          🏫
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">School ERP</h1>
        <p className="text-sm text-slate-400 mb-4">Clean slate ready for new Basic ERP requirements.</p>
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Awaiting New Project Plan</span>
        </div>
      </div>
    </div>
  );
}

export default App;
