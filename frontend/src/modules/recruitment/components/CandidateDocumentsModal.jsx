import React from 'react';
import { 
  FileText, ExternalLink, Download, FileCheck, Image as ImageIcon, 
  File, X, Eye
} from 'lucide-react';

export function CandidateDocumentsModal({ isOpen, onClose, candidate }) {
  if (!isOpen || !candidate) return null;

  const documents = Array.isArray(candidate.documents) ? candidate.documents : [];
  const candidateName = candidate.fullName || candidate.name || 'Candidate';

  const isImageFile = (url = '', name = '') => {
    const testStr = `${url} ${name}`.toLowerCase();
    return /\.(jpg|jpeg|png|webp|gif|svg)($|\?)/i.test(testStr);
  };

  const isPdfFile = (url = '', name = '') => {
    const testStr = `${url} ${name}`.toLowerCase();
    return /\.pdf($|\?)/i.test(testStr);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200/70 shadow-2xs shrink-0">
              <FileCheck className="h-5 w-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-slate-900 truncate">
                Attached Documents & Resumes
              </h3>
              <p className="text-xs text-slate-500 truncate">
                {candidateName} • {documents.length} document{documents.length === 1 ? '' : 's'} available
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Documents Content */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3">
          {documents.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <div className="h-12 w-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <FileText className="h-6 w-6 stroke-[1.8]" />
              </div>
              <p className="text-sm font-bold text-slate-700">No documents attached</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                No resumes, certificates or portfolio documents have been uploaded for {candidateName} yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {documents.map((doc, idx) => {
                const docUrl = typeof doc === 'string' ? doc : doc.url;
                const docName = typeof doc === 'string' ? doc.split('/').pop() : (doc.name || `Document #${idx + 1}`);
                const docNote = typeof doc === 'string' ? null : doc.note;
                const isImg = isImageFile(docUrl, docName);
                const isPdf = isPdfFile(docUrl, docName);

                return (
                  <div
                    key={idx}
                    className="group flex flex-col justify-between p-3.5 rounded-xl border border-slate-200/80 hover:border-purple-300 bg-white hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      {/* Thumbnail / Icon */}
                      <div className="shrink-0">
                        {isImg && docUrl ? (
                          <div className="h-10 w-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                            <img src={docUrl} alt={docName} className="h-full w-full object-cover" />
                          </div>
                        ) : isPdf ? (
                          <div className="h-10 w-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200/60 font-bold text-[10px]">
                            PDF
                          </div>
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-teal-50 text-[#0F766E] flex items-center justify-center border border-teal-200/60">
                            <File className="h-5 w-5" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-800 truncate group-hover:text-purple-600 transition-colors" title={docName}>
                          {docName}
                        </p>
                        {docNote && (
                          <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                            {docNote}
                          </p>
                        )}
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {isPdf ? 'PDF Document' : isImg ? 'Image File' : 'Attachment'}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-end gap-1.5">
                      {docUrl && (
                        <a
                          href={docUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1 transition"
                        >
                          <Eye className="h-3 w-3" /> View
                        </a>
                      )}
                      {docUrl && (
                        <a
                          href={docUrl}
                          download={docName}
                          className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold flex items-center gap-1 transition"
                        >
                          <Download className="h-3 w-3" /> Download
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
