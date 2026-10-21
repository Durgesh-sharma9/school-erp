import React, { useState } from 'react';
import { Award, Landmark, BookOpen } from 'lucide-react';

export const COMMON_BOARDS = [
  { id: 'auto', name: '⚡ Auto-Detect (From Affiliation Text)', short: 'AUTO' },
  { id: 'cbse', name: 'CBSE — Central Board of Secondary Education', short: 'CBSE DELHI' },
  { id: 'rbse', name: 'RBSE — Rajasthan Board of Secondary Education (BSER)', short: 'RBSE AJMER' },
  { id: 'icse', name: 'ICSE / CISCE — Council for Indian School Cert. Exams', short: 'CISCE DELHI' },
  { id: 'upmsp', name: 'UP Board — Madhyamik Shiksha Parishad (UPMSP)', short: 'UPMSP PRAYAGRAJ' },
  { id: 'mpbse', name: 'MP Board — Board of Secondary Education (MPBSE)', short: 'MPBSE BHOPAL' },
  { id: 'bseb', name: 'BSEB — Bihar School Examination Board', short: 'BSEB PATNA' },
  { id: 'hbse', name: 'HBSE / BSEH — Haryana Board of School Education', short: 'BSEH BHIWANI' },
  { id: 'msbshse', name: 'Maharashtra State Board (MSBSHSE)', short: 'MSBSHSE PUNE' },
  { id: 'gseb', name: 'GSEB — Gujarat Secondary & Higher Secondary Board', short: 'GSEB GANDHINAGAR' },
  { id: 'none', name: '🚫 None (Do not show Board Logo)', short: '' },
];

export const DEFAULT_CO_SCHOLASTIC_TRAITS = [
  { name: 'ART EDUCATION', grade: 'A1' },
  { name: 'WORK EDUCATION', grade: 'A1' },
  { name: 'HEALTH & PHYSICAL EDUCATION', grade: 'A1' },
  { name: 'ICT', grade: 'A1' },
  { name: 'DISCIPLINE', grade: 'A1' },
];

/**
 * Authentic vector representation of CBSE (Central Board of Secondary Education) Emblem
 */
export const CbseEmblemSvg = ({ className = "w-14 h-14" }) => (
  <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="58" fill="#F8FAFC" stroke="#C59B27" strokeWidth="3" />
    <circle cx="60" cy="60" r="54" fill="#003B73" stroke="#C59B27" strokeWidth="1.5" />
    <circle cx="60" cy="60" r="41" fill="#FFFFFF" stroke="#C59B27" strokeWidth="1.5" />
    
    <path id="cbseTopArc" d="M 22,60 A 38,38 0 0,1 98,60" fill="none" />
    <text fill="#FFFFFF" fontSize="7" fontWeight="bold" letterSpacing="0.5">
      <textPath href="#cbseTopArc" startOffset="50%" textAnchor="middle">
        केन्द्रीय माध्यमिक शिक्षा बोर्ड
      </textPath>
    </text>

    <path id="cbseBottomArc" d="M 98,60 A 38,38 0 0,1 22,60" fill="none" />
    <text fill="#FFFFFF" fontSize="6.5" fontWeight="bold" letterSpacing="0.5">
      <textPath href="#cbseBottomArc" startOffset="50%" textAnchor="middle">
        CENTRAL BOARD OF SEC. EDU.
      </textPath>
    </text>

    <g transform="translate(60, 58)">
      <circle cx="0" cy="-6" r="14" fill="#FEF08A" opacity="0.4" />
      <path d="M 0,-18 L 0,-21 M -9,-14 L -11,-16 M 9,-14 L 11,-16 M -13,-6 L -16,-6 M 13,-6 L 16,-6" stroke="#C59B27" strokeWidth="1.5" strokeLinecap="round" />

      <path d="M 0,-15 C -4,-10 -4,-5 0,-2 C 4,-5 4,-10 0,-15 Z" fill="#E65100" />
      <path d="M 0,-11 C -2,-8 -2,-5 0,-3 C 2,-5 2,-8 0,-11 Z" fill="#FBBF24" />

      <path d="M -9,-2 C -8,5 8,5 9,-2 C 6,0 -6,0 -9,-2 Z" fill="#C59B27" stroke="#003B73" strokeWidth="0.75" />
      <path d="M -3,5 L 3,5 L 5,8 L -5,8 Z" fill="#C59B27" />

      <g transform="translate(0, 14)">
        <path d="M 0,0 C -8,-2 -16,-1 -20,3 L -20,11 C -16,7 -8,6 0,8 Z" fill="#F8FAFC" stroke="#003B73" strokeWidth="1" />
        <path d="M 0,0 C 8,-2 16,-1 20,3 L 20,11 C 16,7 8,6 0,8 Z" fill="#F8FAFC" stroke="#003B73" strokeWidth="1" />
        <line x1="0" y1="0" x2="0" y2="8" stroke="#003B73" strokeWidth="1.5" />
        <line x1="-16" y1="3" x2="-4" y2="1.5" stroke="#94A3B8" strokeWidth="0.6" />
        <line x1="-16" y1="6" x2="-4" y2="4.5" stroke="#94A3B8" strokeWidth="0.6" />
        <line x1="4" y1="1.5" x2="16" y2="3" stroke="#94A3B8" strokeWidth="0.6" />
        <line x1="4" y1="4.5" x2="16" y2="6" stroke="#94A3B8" strokeWidth="0.6" />
      </g>
    </g>

    <g transform="translate(60, 104)">
      <rect x="-28" y="-6" width="56" height="11" rx="2" fill="#C59B27" stroke="#003B73" strokeWidth="0.75" />
      <text x="0" y="2" textAnchor="middle" fill="#003B73" fontSize="5.5" fontWeight="900" letterSpacing="0.2">
        असतो मा सद्गमय
      </text>
    </g>
  </svg>
);

/**
 * Authentic vector representation of RBSE Emblem
 */
export const RbseEmblemSvg = ({ className = "w-14 h-14" }) => (
  <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="58" fill="#FFFBEB" stroke="#991B1B" strokeWidth="3" />
    <circle cx="60" cy="60" r="54" fill="#991B1B" stroke="#D97706" strokeWidth="1.5" />
    <circle cx="60" cy="60" r="41" fill="#FFFFFF" stroke="#991B1B" strokeWidth="1.5" />

    <path id="rbseTopArc" d="M 22,60 A 38,38 0 0,1 98,60" fill="none" />
    <text fill="#FFFFFF" fontSize="6.5" fontWeight="bold">
      <textPath href="#rbseTopArc" startOffset="50%" textAnchor="middle">
        माध्यमिक शिक्षा बोर्ड राजस्थान
      </textPath>
    </text>

    <path id="rbseBottomArc" d="M 98,60 A 38,38 0 0,1 22,60" fill="none" />
    <text fill="#FFFFFF" fontSize="6" fontWeight="bold" letterSpacing="0.5">
      <textPath href="#rbseBottomArc" startOffset="50%" textAnchor="middle">
        BOARD OF SEC. EDU. RAJASTHAN
      </textPath>
    </text>

    <g transform="translate(60, 56)">
      <circle cx="0" cy="-6" r="13" fill="#FEF3C7" />
      <g stroke="#D97706" strokeWidth="1.2" strokeLinecap="round">
        <line x1="0" y1="-18" x2="0" y2="-21" />
        <line x1="-10" y1="-15" x2="-13" y2="-18" />
        <line x1="10" y1="-15" x2="13" y2="-18" />
        <line x1="-14" y1="-6" x2="-18" y2="-6" />
        <line x1="14" y1="-6" x2="18" y2="-6" />
      </g>
      <path d="M 0,-15 C -4,-10 -3,-5 0,-2 C 3,-5 4,-10 0,-15 Z" fill="#DC2626" />
      <path d="M 0,-11 C -2,-8 -1,-5 0,-3 C 1,-5 2,-8 0,-11 Z" fill="#FBBF24" />
      <path d="M -5,-2 L 5,-2 L 3,7 L -3,7 Z" fill="#D97706" stroke="#991B1B" strokeWidth="0.75" />
      <rect x="-2" y="7" width="4" height="6" fill="#B45309" />
    </g>

    <g transform="translate(60, 104)">
      <rect x="-26" y="-6" width="52" height="11" rx="2" fill="#D97706" stroke="#991B1B" strokeWidth="0.75" />
      <text x="0" y="2" textAnchor="middle" fill="#FFFFFF" fontSize="5.5" fontWeight="bold">
        सिद्धिर्भवति कर्मजा
      </text>
    </g>
  </svg>
);

export default function BoardLogo({ 
  src, 
  boardType = 'auto', 
  affiliation = '', 
  boardTitle = '', 
  className = "w-14 h-14",
  showSubText = false,
}) {
  const [imgError, setImgError] = useState(false);

  // If explicit custom image is supplied and valid
  if (src && !imgError) {
    return (
      <div className="flex flex-col items-center justify-center shrink-0 w-14 sm:w-16 max-w-16 overflow-hidden">
        <div className="h-14 w-14 sm:h-16 sm:w-16 max-h-16 max-w-16 overflow-hidden flex items-center justify-center shrink-0">
          <img 
            src={src} 
            alt={boardTitle || "Board Logo"} 
            className="max-h-full max-w-full w-auto h-auto object-contain"
            crossOrigin="anonymous"
            onError={() => setImgError(true)}
          />
        </div>
        {showSubText && boardTitle && (
          <span className="text-[8px] font-black text-amber-800 tracking-wider mt-0.5 uppercase text-center leading-none truncate max-w-full">
            {boardTitle}
          </span>
        )}
      </div>
    );
  }

  // Resolve board type
  let resolvedType = (boardType || 'auto').toLowerCase().trim();
  if (resolvedType === 'auto') {
    const affLower = (affiliation || '').toLowerCase();
    if (affLower.includes('cbse') || affLower.includes('central board')) {
      resolvedType = 'cbse';
    } else if (affLower.includes('rbse') || affLower.includes('rajasthan')) {
      resolvedType = 'rbse';
    } else {
      resolvedType = 'cbse';
    }
  }

  return (
    <div className="flex flex-col items-center justify-center shrink-0 w-14 sm:w-16 max-w-16 overflow-hidden">
      <div className="h-14 w-14 sm:h-16 sm:w-16 max-h-16 max-w-16 overflow-hidden flex items-center justify-center shrink-0">
        {resolvedType === 'rbse' ? (
          <RbseEmblemSvg className={className} />
        ) : (
          <CbseEmblemSvg className={className} />
        )}
      </div>
    </div>
  );
}
