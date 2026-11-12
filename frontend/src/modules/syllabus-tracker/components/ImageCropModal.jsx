import React, { useState, useRef } from 'react';
import { Crop, RotateCcw, Check, X } from 'lucide-react';

export function ImageCropModal({ isOpen, onClose, onCropComplete, imageSrc }) {
  const imgRef = useRef(null);
  const [box, setBox] = useState({ x: 5, y: 5, w: 90, h: 90 });

  if (!isOpen || !imageSrc) return null;

  const handleApply = () => {
    const img = imgRef.current;
    if (!img) {
      onCropComplete(imageSrc);
      onClose();
      return;
    }
    const canvas = document.createElement('canvas');
    const sx = Math.round((box.x / 100) * img.naturalWidth);
    const sy = Math.round((box.y / 100) * img.naturalHeight);
    const sw = Math.max(10, Math.round((box.w / 100) * img.naturalWidth));
    const sh = Math.max(10, Math.round((box.h / 100) * img.naturalHeight));

    const maxDim = 1000;
    const scale = Math.min(1, maxDim / Math.max(sw, sh));
    canvas.width = Math.round(sw * scale);
    canvas.height = Math.round(sh * scale);

    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
    onCropComplete(canvas.toDataURL('image/png', 0.92));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Crop className="w-4 h-4 text-indigo-600" />
            Adjust Diagram / Crop Image
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="relative bg-slate-900/5 rounded-xl overflow-hidden flex items-center justify-center max-h-72 border border-slate-200">
            <img ref={imgRef} src={imageSrc} alt="Crop source" className="max-h-72 object-contain" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <label className="space-y-1">
              <span className="font-bold text-slate-600">Left % ({box.x}%)</span>
              <input type="range" min="0" max="60" value={box.x} onChange={(e) => setBox((b) => ({ ...b, x: Number(e.target.value) }))} className="w-full" />
            </label>
            <label className="space-y-1">
              <span className="font-bold text-slate-600">Top % ({box.y}%)</span>
              <input type="range" min="0" max="60" value={box.y} onChange={(e) => setBox((b) => ({ ...b, y: Number(e.target.value) }))} className="w-full" />
            </label>
            <label className="space-y-1">
              <span className="font-bold text-slate-600">Width % ({box.w}%)</span>
              <input type="range" min="20" max="100" value={box.w} onChange={(e) => setBox((b) => ({ ...b, w: Math.min(100 - b.x, Number(e.target.value)) }))} className="w-full" />
            </label>
            <label className="space-y-1">
              <span className="font-bold text-slate-600">Height % ({box.h}%)</span>
              <input type="range" min="20" max="100" value={box.h} onChange={(e) => setBox((b) => ({ ...b, h: Math.min(100 - b.y, Number(e.target.value)) }))} className="w-full" />
            </label>
          </div>
        </div>

        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setBox({ x: 0, y: 0, w: 100, h: 100 })}
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-200 inline-flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Full
          </button>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">
              Cancel
            </button>
            <button type="button" onClick={handleApply} className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold inline-flex items-center gap-1 hover:bg-indigo-700">
              <Check className="w-3.5 h-3.5" /> Apply Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
