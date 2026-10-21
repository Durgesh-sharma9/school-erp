import React from 'react';
import BoardLogo from './BoardLogo';

/**
 * JdInternationalMarksheet - Authentic 1:1 Physical Replica of CBSE Report Card
 * Based on the J D International School physical marksheet from daily-test.
 * Supports 3 Dynamic Modes based on selectedExamType / examTitleText:
 * 1. Annual / Full Year (Default): Full 13-Column Bi-Term Table (PA1, NB, SEA, HY, TOTAL, PA2, NB, SEA, ANNUAL, TOTAL, MARKS OBT, GRADE)
 * 2. Half Yearly / Term 1: Dedicated 7-Column Table (PA1, NB, SEA, HY, TOTAL, GRADE) + Term 1 Co-Scholastic & Attendance
 * 3. Periodic / Formative Assessments (PA 1, PA 2, Unit Test, etc.):
 *    Dedicated 5-Column Clean Format (Subject, Max Marks, Marks Obtained, Percentage, Grade)
 */
export default function JdInternationalMarksheet({ 
  student = {}, 
  headerConfig = {}, 
  sessionText = '2025-2026', 
  examTitleText = 'ANNUAL PROGRESS REPORT',
  selectedExamType = 'ALL',
}) {
  // Mode detection
  const examLower = (selectedExamType || '').toLowerCase().trim();
  const titleLower = (examTitleText || '').toLowerCase().trim();

  const isHalfYearly = examLower === 'half yearly' || examLower === 'term 1' || titleLower.includes('half yearly') || titleLower.includes('term 1');
  
  const isPeriodicOrFormative = !isHalfYearly && (
    examLower.startsWith('pa') ||
    examLower.startsWith('fa') ||
    examLower.includes('periodic') ||
    examLower.includes('formative') ||
    examLower.includes('unit test') ||
    examLower.includes('quarterly') ||
    titleLower.includes('periodic') ||
    titleLower.includes('formative') ||
    titleLower.includes('unit test') ||
    titleLower.includes('quarterly') ||
    /^pa\s*\d/i.test(examLower) ||
    /^fa\s*\d/i.test(examLower)
  );

  const isAnnual = !isHalfYearly && !isPeriodicOrFormative;

  // 1. School Information
  const schoolName = headerConfig.schoolName || 'J D INTERNATIONAL SCHOOL';
  const tagline = headerConfig.tagline || headerConfig.motto || 'Affiliated to CBSE, New Delhi';
  const address = headerConfig.address || 'Sector-4, R.K. Puram, New Delhi - 110022';
  const contact = headerConfig.contact || 'Ph.: 011-26178901, 26178902 | Email: info@jdinternationalschool.edu.in';
  const schoolNo = headerConfig.schoolCode || headerConfig.schoolNo || '10964';
  const affiliationNo = headerConfig.affiliationNo || '1730619';
  const logoUrl = headerConfig.logo || 'https://temp.erichost.app/assets/schools/jdisjr_221/school/1_school_photo_1766831297_f7516d5fc58b9af84fb1.jpg';
  const photoUrl = student.photo || student.photoUrl || student.avatar || '';

  // 2. CBSE 8-Point Scale Evaluator
  const getCbseGrade = (pct) => {
    if (pct === null || pct === undefined || isNaN(pct)) return '—';
    const p = Number(pct);
    if (p >= 91) return 'A1';
    if (p >= 81) return 'A2';
    if (p >= 71) return 'B1';
    if (p >= 61) return 'B2';
    if (p >= 51) return 'C1';
    if (p >= 41) return 'C2';
    if (p >= 33) return 'D';
    return 'E';
  };

  const parseMark = (val) => {
    if (val === undefined || val === null) return null;
    const s = String(val).trim();
    if (s === '' || s === '-' || s === '—') return null;
    const n = Number(s);
    return isNaN(n) ? null : n;
  };

  const formatMark = (num, padZero = false) => {
    if (num === null || num === undefined) return '—';
    if (padZero && num >= 0 && num < 10) return `0${num}`;
    return String(num);
  };

  const defaultSubjectList = [
    { name: 'ENGLISH' },
    { name: 'HINDI' },
    { name: 'MATHEMATICS' },
    { name: 'SCIENCE' },
    { name: 'SOCIAL SCIENCE' },
    { name: 'SANSKRIT' },
    { name: 'COMPUTER' },
  ];

  const manualSubjectMarks = student.manualSubjectMarks || {};
  const rawSubjects = (student.subjects && student.subjects.length > 0)
    ? student.subjects
    : defaultSubjectList;

  const subjectsToRender = rawSubjects.map((sub, idx) => {
    const subName = (sub.name || `SUBJECT ${idx + 1}`).toUpperCase().trim();
    const manual = manualSubjectMarks[sub.name] || manualSubjectMarks[subName] || {};

    // Term 1 (PA1: 10, NB1: 5, SEA1: 5, Half Yearly Theory: 80 -> Total 100)
    const pa1 = parseMark(manual.oral1 ?? manual.pa1 ?? sub.pa1 ?? sub.oral1);
    const nb1 = parseMark(manual.nb ?? manual.nb1 ?? sub.nb ?? sub.nb1);
    const sea1 = parseMark(manual.sea1 ?? sub.sea1);
    const hy = parseMark(manual.hy ?? sub.hy ?? sub.theory ?? sub.marks);

    const hasTerm1 = (pa1 !== null || nb1 !== null || sea1 !== null || hy !== null);
    const total1 = hasTerm1 ? ((pa1 || 0) + (nb1 || 0) + (sea1 || 0) + (hy || 0)) : null;
    const term1Grade = total1 !== null ? getCbseGrade(total1) : '—';

    // Term 2 (PA2: 10, NB2: 5, SEA2: 5, Annual Theory: 80 -> Total 100)
    const pa2 = parseMark(manual.oral2 ?? manual.pa2 ?? sub.pa2 ?? sub.oral2);
    const nb2 = parseMark(manual.nb2 ?? sub.nb2);
    const sea2 = parseMark(manual.sea2 ?? sub.sea2);
    const ann = parseMark(manual.annual ?? manual.ann ?? sub.annual ?? sub.ann);

    const hasTerm2 = (pa2 !== null || nb2 !== null || sea2 !== null || ann !== null);
    const total2 = hasTerm2 ? ((pa2 || 0) + (nb2 || 0) + (sea2 || 0) + (ann || 0)) : null;
    const term2Grade = total2 !== null ? getCbseGrade(total2) : '—';

    // Grand Total (out of 200)
    const hasAnyMarks = hasTerm1 || hasTerm2;
    const grandMarks = hasAnyMarks ? ((total1 || 0) + (total2 || 0)) : null;
    const grandPct = grandMarks !== null ? (grandMarks / 200) * 100 : null;
    const grade = grandPct !== null ? getCbseGrade(grandPct) : '—';

    // Periodic / Formative Exam Dynamic Marks Extraction (PA 1, PA 2, etc.)
    let singleExamObt = null;
    let singleExamMax = null;

    if (sub.examMarks && sub.examMarks[selectedExamType]) {
      const e = sub.examMarks[selectedExamType];
      singleExamObt = parseMark(e.obtained);
      if (e.max !== undefined && e.max !== null && e.max !== '') {
        singleExamMax = Number(e.max);
      }
    }

    if (singleExamObt === null) {
      if (examLower.includes('pa1') || examLower.includes('pa 1') || examLower === 'pa-1') {
        singleExamObt = parseMark(manual.oral1 ?? manual.pa1 ?? sub.pa1 ?? sub.oral1);
        if (singleExamObt !== null && singleExamMax === null) singleExamMax = 10;
      } else if (examLower.includes('pa2') || examLower.includes('pa 2') || examLower === 'pa-2') {
        singleExamObt = parseMark(manual.oral2 ?? manual.pa2 ?? sub.pa2 ?? sub.oral2);
        if (singleExamObt !== null && singleExamMax === null) singleExamMax = 10;
      } else if (manual[selectedExamType] !== undefined) {
        singleExamObt = parseMark(manual[selectedExamType]);
      } else if (sub.marks !== undefined) {
        singleExamObt = parseMark(sub.marks);
        if (sub.maxMarks) singleExamMax = Number(sub.maxMarks);
      }
    }

    if (singleExamObt !== null && singleExamMax === null) {
      singleExamMax = sub.maxMarks ? Number(sub.maxMarks) : 100;
    }

    const singlePct = (singleExamObt !== null && singleExamMax && singleExamMax > 0) 
      ? (singleExamObt / singleExamMax) * 100 
      : null;
    const singleGrade = singlePct !== null ? getCbseGrade(singlePct) : '—';

    return {
      name: subName,
      pa1: formatMark(pa1, true),
      nb1: formatMark(nb1, true),
      sea1: formatMark(sea1, true),
      hy: formatMark(hy),
      total1: formatMark(total1),
      term1Grade,
      pa2: formatMark(pa2, true),
      nb2: formatMark(nb2, true),
      sea2: formatMark(sea2, true),
      ann: formatMark(ann),
      total2: formatMark(total2),
      term2Grade,
      grandMarks: formatMark(grandMarks),
      grade,
      singleExamObt: formatMark(singleExamObt),
      singleExamMax: singleExamMax !== null ? String(singleExamMax) : '—',
      rawSingleMax: singleExamMax,
      singlePct,
      singleGrade,
      rawSingleObt: singleExamObt,
      rawPa1: pa1,
      rawTot1: total1,
      rawTot2: total2,
      rawGrand: grandMarks,
    };
  });

  const subjectCount = subjectsToRender.length || 7;
  const maxTermMarks = subjectCount * 100;
  const maxGrandMarks = subjectCount * 200;

  const anyTerm1Entered = subjectsToRender.some(s => s.rawTot1 !== null);
  const anyTerm2Entered = subjectsToRender.some(s => s.rawTot2 !== null);
  const anyMarksEntered = anyTerm1Entered || anyTerm2Entered;

  const totalTerm1Obt = anyTerm1Entered 
    ? subjectsToRender.reduce((sum, s) => sum + (s.rawTot1 || 0), 0) 
    : null;
  const totalTerm2Obt = anyTerm2Entered 
    ? subjectsToRender.reduce((sum, s) => sum + (s.rawTot2 || 0), 0) 
    : null;
  const totalGrandObt = anyMarksEntered 
    ? ((totalTerm1Obt || 0) + (totalTerm2Obt || 0)) 
    : null;

  const term1Pct = totalTerm1Obt !== null ? ((totalTerm1Obt / maxTermMarks) * 100).toFixed(2) : null;
  const term2Pct = totalTerm2Obt !== null ? ((totalTerm2Obt / maxTermMarks) * 100).toFixed(2) : null;
  const grandPct = totalGrandObt !== null ? ((totalGrandObt / maxGrandMarks) * 100).toFixed(2) : null;

  const term1Grade = term1Pct !== null ? getCbseGrade(Number(term1Pct)) : '—';
  const term2Grade = term2Pct !== null ? getCbseGrade(Number(term2Pct)) : '—';
  const overallGrade = grandPct !== null ? getCbseGrade(Number(grandPct)) : '—';

  // Single Periodic / Formative Exam calculations
  const anySingleEntered = subjectsToRender.some(s => s.rawSingleObt !== null);
  const totalSingleObt = anySingleEntered 
    ? subjectsToRender.reduce((sum, s) => sum + (s.rawSingleObt || 0), 0) 
    : null;
  const totalSingleMax = anySingleEntered
    ? subjectsToRender.reduce((sum, s) => sum + (s.rawSingleMax || 0), 0)
    : null;
  const singleOverallPct = (totalSingleObt !== null && totalSingleMax && totalSingleMax > 0)
    ? ((totalSingleObt / totalSingleMax) * 100).toFixed(2)
    : null;
  const singleOverallGrade = singleOverallPct !== null ? getCbseGrade(Number(singleOverallPct)) : '—';

  // Co-Scholastic & Discipline
  const coScholasticRows = [
    { 
      name: 'ART EDUCATION', 
      term1: student.coScholasticGrades?.['ART EDUCATION'] || student.coScholasticGrades?.['Art Education'] || 'A1', 
      term2: student.coScholasticGrades?.['ART EDUCATION_TERM2'] || 'A1' 
    },
    { 
      name: 'WORK EDUCATION', 
      term1: student.coScholasticGrades?.['WORK EDUCATION'] || student.coScholasticGrades?.['Work Education'] || 'A1', 
      term2: student.coScholasticGrades?.['WORK EDUCATION_TERM2'] || 'A1' 
    },
    { 
      name: 'HEALTH & PHYSICAL EDUCATION', 
      term1: student.coScholasticGrades?.['HEALTH & PHYSICAL EDUCATION'] || student.coScholasticGrades?.['Health & Physical Education'] || 'A1', 
      term2: student.coScholasticGrades?.['HEALTH & PHYSICAL EDUCATION_TERM2'] || 'A1' 
    },
    { 
      name: 'ICT', 
      term1: student.coScholasticGrades?.['ICT'] || student.coScholasticGrades?.['COMPUTER'] || 'A1', 
      term2: student.coScholasticGrades?.['ICT_TERM2'] || 'A1' 
    },
  ];

  const disciplineGradeTerm1 = student.coScholasticGrades?.['DISCIPLINE'] || student.disciplineGrades?.punctuality || 'A1';
  const disciplineGradeTerm2 = student.coScholasticGrades?.['DISCIPLINE_TERM2'] || student.disciplineGrades?.behaviour || 'A1';

  // Attendance
  const parseAtt = (val) => {
    if (val === undefined || val === null) return null;
    const s = String(val).trim();
    if (s === '') return null;
    const n = Number(s);
    return isNaN(n) ? null : n;
  };

  const hyPresent = parseAtt(student.hyPresent ?? student.attendancePresent ?? 110);
  const hyTotal = parseAtt(student.hyTotal ?? student.attendanceTotal ?? 115);
  const annPresent = parseAtt(student.annPresent ?? 115);
  const annTotal = parseAtt(student.annTotal ?? 120);

  const hasHyAtt = hyPresent !== null;
  const hasAnnAtt = annPresent !== null;

  const totPresent = (hasHyAtt || hasAnnAtt) ? ((hyPresent || 0) + (annPresent || 0)) : null;
  const totWorking = (hyTotal !== null || annTotal !== null) ? ((hyTotal || 0) + (annTotal || 0)) : null;
  const attPct = (totPresent !== null && totWorking && totWorking > 0) ? ((totPresent / totWorking) * 100).toFixed(2) : null;

  const rawPromotion = student.promotion || 'Class : VII';
  const promotedClass = rawPromotion
    ? rawPromotion.replace(/^promoted to /i, '').replace(/^class\s*[:\s]*/i, '')
    : '';

  const activePct = isHalfYearly ? term1Pct : (isPeriodicOrFormative ? singleOverallPct : grandPct);
  const resultStatus = student.resultStatus 
    ? student.resultStatus 
    : (activePct !== null ? (Number(activePct) >= 33 ? 'Passed' : 'Needs Improvement') : 'Passed');

  const teacherRemarks = student.teacherRemarks || student.remarks || 'Very Good';

  // Dynamic Report Card Title depending on Mode
  const getExamDisplayTitle = () => {
    if (isHalfYearly) {
      return `Half Yearly Examination Progress Report (Session ${sessionText})`;
    }
    if (isPeriodicOrFormative) {
      return `${examTitleText || selectedExamType || 'Periodic Assessment'} Progress Report (Session ${sessionText})`;
    }
    return `Progress Report (Session ${sessionText})`;
  };

  const attTermLabel = isHalfYearly 
    ? 'Half Yearly Examination' 
    : (isPeriodicOrFormative ? (examTitleText || selectedExamType || 'Term Record') : 'Half Yearly Examination');

  const coScholasticHeader = isHalfYearly 
    ? 'HALF YEARLY' 
    : (isPeriodicOrFormative ? (selectedExamType || 'EVALUATION').toUpperCase() : 'HALF YEARLY');

  return (
    <div 
      className="w-full bg-white text-black relative select-none box-border p-2 sm:p-4 print:p-0 print:m-0"
      style={{ 
        fontFamily: '"Times New Roman", Times, Georgia, serif',
        color: '#000000',
        backgroundColor: '#ffffff'
      }}
    >
      {/* ─── SINGLE CRISP OUTER BLACK FRAME ─── */}
      <div 
        className="border border-black p-2.5 sm:p-3 print:p-2 bg-white relative overflow-visible flex flex-col justify-between min-h-[1020px] print:min-h-[1020px] box-border"
        style={{ 
          borderColor: '#000000', 
          pageBreakInside: 'avoid', 
          breakInside: 'avoid',
          boxSizing: 'border-box',
        }}
      >

        {/* ─── WATERMARK: SCHOOL LOGO IN BACKGROUND (Crisp, subtle vector watermark) ─── */}
        {logoUrl ? (
          <div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0"
          >
            <div 
              className="w-80 h-80 sm:w-96 sm:h-96 md:w-[420px] md:h-[420px] flex items-center justify-center"
              style={{ opacity: 0.06 }}
            >
              <img 
                src={logoUrl} 
                alt="Watermark Crest" 
                className="w-full h-full object-contain" 
                style={{ mixBlendMode: 'multiply' }} 
                crossOrigin="anonymous" 
              />
            </div>
          </div>
        ) : null}

        {/* ─── 1. TOP HEADER SECTION ─── */}
        <div 
          className="relative z-10 flex flex-row flex-nowrap items-start justify-between gap-2 pb-0.5 mb-0.5 px-1"
          style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}
        >
          {/* Top Left: School No. & School Crest */}
          <div className="w-28 shrink-0 flex flex-col items-center justify-start text-center pt-0.5">
            {schoolNo ? (
              <span className="text-[9.5px] font-sans font-medium text-black tracking-tight block">
                School No.: <span className="font-mono">{schoolNo}</span>
              </span>
            ) : (
              <span className="text-[9.5px] font-sans font-medium text-transparent select-none block">
                School
              </span>
            )}
            <div className="h-16 w-16 max-h-16 max-w-16 overflow-hidden mt-0.5 flex items-center justify-center shrink-0">
              {logoUrl ? (
                <img src={logoUrl} alt={schoolName} className="max-h-16 max-w-16 object-contain" crossOrigin="anonymous" />
              ) : null}
            </div>
          </div>

          {/* Top Center: Tagline, School Name, Address, Contact, Progress Report Title */}
          <div className="flex-1 text-center px-1">
            {tagline && (
              <p className="text-[11px] italic text-black font-serif font-medium leading-none mb-0.5">
                {tagline}
              </p>
            )}

            <h1 
              className="text-[25px] sm:text-[28px] font-black text-black tracking-normal leading-tight font-serif uppercase"
              style={{ fontFamily: '"Times New Roman", Times, Georgia, serif' }}
            >
              {schoolName}
            </h1>

            {address && (
              <p className="text-[10.5px] text-black font-serif mt-0.5 leading-tight">
                {address}
              </p>
            )}

            {contact && (
              <p className="text-[9.5px] text-black font-sans mt-0.5 leading-tight">
                {contact}
              </p>
            )}

            {/* Dynamic Report Card Title depending on Mode */}
            <h2 className="text-[12.5px] font-bold text-black uppercase mt-1 tracking-wide font-serif leading-tight">
              {getExamDisplayTitle()}
            </h2>
          </div>

          {/* Top Right: Affiliation No. & CBSE Board Emblem */}
          <div className="w-28 shrink-0 flex flex-col items-center justify-start text-center pt-0.5">
            {affiliationNo ? (
              <span className="text-[9.5px] font-sans font-medium text-black tracking-tight block">
                Affiliation No.: {affiliationNo}
              </span>
            ) : (
              <span className="text-[9.5px] font-sans font-medium text-transparent select-none block">
                CBSE
              </span>
            )}
            <div className="h-16 w-16 max-h-16 max-w-16 overflow-hidden mt-0.5 flex items-center justify-center shrink-0">
              <BoardLogo 
                src={headerConfig.boardLogo} 
                boardType={headerConfig.boardType || 'CBSE'} 
                affiliation={affiliationNo ? `Affiliation No.: ${affiliationNo}` : ''} 
                boardTitle={headerConfig.boardTitle} 
                className="w-14 h-14 max-w-14 max-h-14"
                showSubText={false}
              />
            </div>
          </div>
        </div>

        {/* ─── 2. STUDENT INFORMATION DOSSIER ─── */}
        <div 
          className="relative z-10 border border-black mb-1 py-1 px-2.5 text-[10px] bg-transparent"
          style={{ borderColor: '#000000', pageBreakInside: 'avoid', breakInside: 'avoid' }}
        >
          <div className="flex items-center justify-between">
            {/* Column 1: Names */}
            <div className="w-[45%] space-y-0.5">
              <div className="flex items-baseline">
                <span className="w-28 font-bold text-black text-[9.5px] uppercase font-serif">STUDENT'S NAME</span>
                <span className="mr-2 font-bold">:</span>
                <span className="font-bold text-black uppercase tracking-wide text-[10.5px] font-serif">{student.name || '—'}</span>
              </div>
              <div className="flex items-baseline">
                <span className="w-28 font-bold text-black text-[9.5px] uppercase font-serif">FATHER'S NAME</span>
                <span className="mr-2 font-bold">:</span>
                <span className="font-bold text-black uppercase text-[10px] font-serif">{student.fatherName || '—'}</span>
              </div>
              <div className="flex items-baseline">
                <span className="w-28 font-bold text-black text-[9.5px] uppercase font-serif">MOTHER'S NAME</span>
                <span className="mr-2 font-bold">:</span>
                <span className="font-bold text-black uppercase text-[10px] font-serif">{student.motherName || '—'}</span>
              </div>
            </div>

            {/* Column 2: Class, Adm No, DOB */}
            <div className="w-[38%] space-y-0.5">
              <div className="flex items-baseline">
                <span className="w-18 font-bold text-black text-[9.5px] uppercase font-serif">CLASS</span>
                <span className="mr-2 font-bold">:</span>
                <span className="font-bold text-black text-[10px] font-serif">{student.class || student.className || 'Class VI'}</span>
              </div>
              <div className="flex items-baseline">
                <span className="w-18 font-bold text-black text-[9.5px] uppercase font-serif">ADM. NO.</span>
                <span className="mr-2 font-bold">:</span>
                <span className="font-mono font-bold text-black text-[10px]">{student.admissionNo || student.scholarNo || student.rollNo || '1024'}</span>
              </div>
              <div className="flex items-baseline">
                <span className="w-18 font-bold text-black text-[9.5px] uppercase font-serif">DOB</span>
                <span className="mr-2 font-bold">:</span>
                <span className="font-mono font-bold text-black text-[10px]">{student.dob || '14/08/2012'}</span>
              </div>
            </div>

            {/* Column 3: Passport Photo */}
            <div className="w-[17%] flex items-center justify-end">
              <div className="w-14 h-18 border border-black bg-white flex items-center justify-center overflow-hidden">
                {photoUrl ? (
                  <img src={photoUrl} alt={student.name} className="w-full h-full object-cover" crossOrigin="anonymous" />
                ) : (
                  <div className="w-full h-full bg-rose-50/50 flex flex-col items-center justify-center p-1 text-center">
                    <span className="text-[7px] text-rose-900 font-bold font-sans">PHOTO</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ─── 3. A. SCHOLASTIC-AREAS (DYNAMIC TABLE FOR ALL MODES) ─── */}
        <div className="relative z-10 mb-1.5">
          {isHalfYearly ? (
            /* 7-COLUMN DEDICATED HALF YEARLY SCHOLASTIC TABLE */
            <table 
              className="w-full border-collapse border border-black text-center text-[9px]"
              style={{ borderCollapse: 'collapse', borderColor: '#000000' }}
            >
              <thead>
                <tr className="border-b border-black">
                  <th 
                    colSpan={7} 
                    className="border border-black py-0.5 text-center font-bold font-serif text-[10px] uppercase tracking-wider"
                    style={{ backgroundColor: '#faeaed' }}
                  >
                    A. SCHOLASTIC-AREAS
                  </th>
                </tr>

                <tr 
                  className="font-bold text-black border-b border-black text-[9.5px]"
                  style={{ backgroundColor: '#fdf2f5' }}
                >
                  <th 
                    rowSpan={3} 
                    className="border border-black px-2 py-1 text-center align-middle w-48 uppercase font-serif font-bold text-[10px]"
                  >
                    SUBJECT
                  </th>
                  <th colSpan={5} className="border border-black py-1 uppercase tracking-wider font-serif">
                    HALF YEARLY EXAMINATION
                  </th>
                  <th 
                    rowSpan={3} 
                    className="border border-black p-0.5 w-16 font-serif font-bold align-middle text-center text-[10px]"
                  >
                    GRADE
                  </th>
                </tr>

                <tr 
                  className="font-bold text-[8.5px] text-black border-b border-black"
                  style={{ backgroundColor: '#fdf4f6' }}
                >
                  <th className="border border-black p-0.5 w-14 font-serif">P.A.- 1</th>
                  <th className="border border-black p-0.5 w-12 font-serif">N.B.</th>
                  <th className="border border-black p-0.5 w-12 font-serif">S.E.A.</th>
                  <th className="border border-black p-0.5 w-20 font-serif leading-tight">HALF<br/>YEARLY</th>
                  <th className="border border-black p-0.5 w-16 font-serif font-bold">TOTAL</th>
                </tr>

                <tr className="border-b border-black font-serif font-bold text-[8.5px] text-black bg-white">
                  <th className="border border-black p-0.5 font-bold">10</th>
                  <th className="border border-black p-0.5 font-bold">5</th>
                  <th className="border border-black p-0.5 font-bold">5</th>
                  <th className="border border-black p-0.5 font-bold">80</th>
                  <th className="border border-black p-0.5 font-bold">100</th>
                </tr>
              </thead>

              <tbody className="text-black bg-transparent">
                {subjectsToRender.map((sub, idx) => (
                  <tr key={sub.name || idx} className="border-b border-black">
                    <td className="border border-black px-2 py-0.5 text-left font-serif font-bold text-[9px] uppercase">
                      {sub.name}
                    </td>
                    <td className="border border-black py-0.5 font-mono">{sub.pa1}</td>
                    <td className="border border-black py-0.5 font-mono">{sub.nb1}</td>
                    <td className="border border-black py-0.5 font-mono">{sub.sea1}</td>
                    <td className="border border-black py-0.5 font-mono">{sub.hy}</td>
                    <td className="border border-black py-0.5 font-mono font-bold">{sub.total1}</td>
                    <td className="border border-black py-0.5 font-serif font-bold">{sub.term1Grade}</td>
                  </tr>
                ))}

                {/* Summary Row 1: GRAND TOTAL */}
                <tr className="font-bold border-t border-black text-[9px] bg-transparent">
                  <td colSpan={5} className="border border-black px-2 py-0.5 text-left uppercase font-serif">
                    GRAND TOTAL
                  </td>
                  <td className="border border-black py-0.5 font-mono font-bold">
                    {anyTerm1Entered && totalTerm1Obt !== null ? `${totalTerm1Obt} / ${maxTermMarks}` : '—'}
                  </td>
                  <td className="border border-black"></td>
                </tr>

                {/* Summary Row 2: PERCENTAGE */}
                <tr className="font-bold border-b border-black text-[9px] bg-transparent">
                  <td colSpan={5} className="border border-black px-2 py-0.5 text-left uppercase font-serif">
                    PERCENTAGE
                  </td>
                  <td className="border border-black py-0.5 font-mono font-bold">
                    {anyTerm1Entered && term1Pct !== null ? `${term1Pct}%` : '—'}
                  </td>
                  <td className="border border-black"></td>
                </tr>

                {/* Summary Row 3: GRADE */}
                <tr className="font-bold text-[9px] bg-transparent">
                  <td colSpan={5} className="border border-black px-2 py-0.5 text-left uppercase font-serif">
                    GRADE
                  </td>
                  <td className="border border-black py-0.5 font-mono font-bold">
                    {anyTerm1Entered ? term1Grade : '—'}
                  </td>
                  <td className="border border-black py-0.5 font-serif font-bold text-center">
                    {anyTerm1Entered ? term1Grade : '—'}
                  </td>
                </tr>
              </tbody>
            </table>
          ) : isPeriodicOrFormative ? (
            /* 5-COLUMN UNIFIED PERIODIC / FORMATIVE ASSESSMENT TABLE */
            <table 
              className="w-full border-collapse border border-black text-center text-[9px]"
              style={{ borderCollapse: 'collapse', borderColor: '#000000' }}
            >
              <thead>
                <tr className="border-b border-black">
                  <th 
                    colSpan={5} 
                    className="border border-black py-0.5 text-center font-bold font-serif text-[10px] uppercase tracking-wider"
                    style={{ backgroundColor: '#faeaed' }}
                  >
                    A. SCHOLASTIC-AREAS ({(examTitleText || selectedExamType).toUpperCase()})
                  </th>
                </tr>
                <tr 
                  className="font-bold text-black border-b border-black text-[9.5px]"
                  style={{ backgroundColor: '#fdf2f5' }}
                >
                  <th className="border border-black px-2 py-1 text-left uppercase font-serif font-bold text-[10px]">
                    SUBJECT
                  </th>
                  <th className="border border-black py-1 w-24 font-serif">MAX MARKS</th>
                  <th className="border border-black py-1 w-36 font-serif uppercase">
                    {(examTitleText || selectedExamType)} MARKS OBT.
                  </th>
                  <th className="border border-black py-1 w-24 font-serif">PERCENTAGE</th>
                  <th className="border border-black py-1 w-20 font-serif">GRADE</th>
                </tr>
              </thead>
              <tbody className="text-black bg-transparent">
                {subjectsToRender.map((sub, idx) => (
                  <tr key={sub.name || idx} className="border-b border-black">
                    <td className="border border-black px-2 py-0.5 text-left font-serif font-bold text-[9px] uppercase">
                      {sub.name}
                    </td>
                    <td className="border border-black py-0.5 font-mono">
                      {sub.rawSingleMax !== null ? sub.rawSingleMax : '—'}
                    </td>
                    <td className="border border-black py-0.5 font-mono font-bold">
                      {sub.singleExamObt}
                    </td>
                    <td className="border border-black py-0.5 font-mono">
                      {sub.singlePct !== null ? `${sub.singlePct.toFixed(1)}%` : '—'}
                    </td>
                    <td className="border border-black py-0.5 font-serif font-bold">
                      {sub.singleGrade}
                    </td>
                  </tr>
                ))}

                {/* Summary Rows */}
                <tr className="font-bold border-t border-black text-[9px] bg-transparent">
                  <td className="border border-black px-2 py-0.5 text-left uppercase font-serif">
                    GRAND TOTAL
                  </td>
                  <td className="border border-black py-0.5 font-mono font-bold">
                    {anySingleEntered && totalSingleMax !== null ? totalSingleMax : '—'}
                  </td>
                  <td className="border border-black py-0.5 font-mono font-bold">
                    {anySingleEntered && totalSingleObt !== null && totalSingleMax !== null 
                      ? `${totalSingleObt} / ${totalSingleMax}` 
                      : '—'}
                  </td>
                  <td className="border border-black py-0.5 font-mono font-bold">
                    {anySingleEntered && singleOverallPct !== null ? `${singleOverallPct}%` : '—'}
                  </td>
                  <td className="border border-black py-0.5 font-serif font-bold text-center">
                    {anySingleEntered ? singleOverallGrade : '—'}
                  </td>
                </tr>

                <tr className="font-bold border-t border-b border-black text-[9px] bg-transparent">
                  <td colSpan={3} className="border border-black px-2 py-0.5 text-left uppercase font-serif">
                    OVERALL PERCENTAGE & GRADE
                  </td>
                  <td className="border border-black py-0.5 font-mono font-bold">
                    {anySingleEntered && singleOverallPct !== null ? `${singleOverallPct}%` : '—'}
                  </td>
                  <td className="border border-black py-0.5 font-serif font-bold text-center">
                    {anySingleEntered ? singleOverallGrade : '—'}
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            /* 13-COLUMN FULL DUAL-TERM ANNUAL SCHOLASTIC TABLE */
            <table 
              className="w-full border-collapse border border-black text-center text-[9px]"
              style={{ borderCollapse: 'collapse', borderColor: '#000000' }}
            >
              <thead>
                <tr className="border-b border-black">
                  <th 
                    colSpan={13} 
                    className="border border-black py-0.5 text-center font-bold font-serif text-[10px] uppercase tracking-wider"
                    style={{ backgroundColor: '#faeaed' }}
                  >
                    A. SCHOLASTIC-AREAS
                  </th>
                </tr>

                <tr 
                  className="font-bold text-black border-b border-black text-[9.5px]"
                  style={{ backgroundColor: '#fdf2f5' }}
                >
                  <th 
                    rowSpan={3} 
                    className="border border-black px-2 py-1 text-center align-middle w-36 uppercase font-serif font-bold text-[10px]"
                  >
                    SUBJECT
                  </th>
                  <th colSpan={5} className="border border-black py-1 uppercase tracking-wider font-serif">
                    HALF YEARLY EXAMINATION
                  </th>
                  <th colSpan={5} className="border border-black py-1 uppercase tracking-wider font-serif">
                    ANNUAL EXAMINATION
                  </th>
                  <th colSpan={2} className="border border-black py-1 uppercase tracking-wider font-serif">
                    ANNUAL RESULT
                  </th>
                </tr>

                <tr 
                  className="font-bold text-[8.5px] text-black border-b border-black"
                  style={{ backgroundColor: '#fdf4f6' }}
                >
                  <th className="border border-black p-0.5 w-9 font-serif">P.A.- 1</th>
                  <th className="border border-black p-0.5 w-8 font-serif">N.B.</th>
                  <th className="border border-black p-0.5 w-8 font-serif">S.E.A.</th>
                  <th className="border border-black p-0.5 w-14 font-serif leading-tight">HALF<br/>YEARLY</th>
                  <th className="border border-black p-0.5 w-11 font-serif font-bold">TOTAL</th>

                  <th className="border border-black p-0.5 w-9 font-serif">P.A.- 2</th>
                  <th className="border border-black p-0.5 w-8 font-serif">N.B.</th>
                  <th className="border border-black p-0.5 w-8 font-serif">S.E.A.</th>
                  <th className="border border-black p-0.5 w-14 font-serif">ANNUAL</th>
                  <th className="border border-black p-0.5 w-11 font-serif font-bold">TOTAL</th>

                  <th className="border border-black p-0.5 w-14 font-serif font-bold leading-tight">MARKS<br/>OBT.</th>
                  <th 
                    rowSpan={2} 
                    className="border border-black p-0.5 w-11 font-serif font-bold align-middle text-center"
                  >
                    GRADE
                  </th>
                </tr>

                <tr className="border-b border-black font-serif font-bold text-[8.5px] text-black bg-white">
                  <th className="border border-black p-0.5 font-bold">10</th>
                  <th className="border border-black p-0.5 font-bold">5</th>
                  <th className="border border-black p-0.5 font-bold">5</th>
                  <th className="border border-black p-0.5 font-bold">80</th>
                  <th className="border border-black p-0.5 font-bold">100</th>

                  <th className="border border-black p-0.5 font-bold">10</th>
                  <th className="border border-black p-0.5 font-bold">5</th>
                  <th className="border border-black p-0.5 font-bold">5</th>
                  <th className="border border-black p-0.5 font-bold">80</th>
                  <th className="border border-black p-0.5 font-bold">100</th>

                  <th className="border border-black p-0.5 font-bold">200</th>
                </tr>
              </thead>

              <tbody className="text-black bg-transparent">
                {subjectsToRender.map((sub, idx) => (
                  <tr key={sub.name || idx} className="border-b border-black">
                    <td className="border border-black px-2 py-1 text-left font-serif font-bold text-[9px] uppercase">
                      {sub.name}
                    </td>

                    {/* Half Yearly columns */}
                    <td className="border border-black py-1 font-mono">{sub.pa1}</td>
                    <td className="border border-black py-1 font-mono">{sub.nb1}</td>
                    <td className="border border-black py-1 font-mono">{sub.sea1}</td>
                    <td className="border border-black py-1 font-mono">{sub.hy}</td>
                    <td className="border border-black py-1 font-mono font-bold">{sub.total1}</td>

                    {/* Annual Exam columns */}
                    <td className="border border-black py-1 font-mono">{sub.pa2}</td>
                    <td className="border border-black py-1 font-mono">{sub.nb2}</td>
                    <td className="border border-black py-1 font-mono">{sub.sea2}</td>
                    <td className="border border-black py-1 font-mono">{sub.ann}</td>
                    <td className="border border-black py-1 font-mono font-bold">{sub.total2}</td>

                    {/* Annual Result columns */}
                    <td className="border border-black py-1 font-mono font-bold">{sub.grandMarks}</td>
                    <td className="border border-black py-1 font-serif font-bold">{sub.grade}</td>
                  </tr>
                ))}

                {/* Summary Row 1: GRAND TOTAL */}
                <tr className="font-bold border-t border-black text-[9px] bg-transparent">
                  <td colSpan={5} className="border border-black px-2 py-1 text-left uppercase font-serif">
                    GRAND TOTAL
                  </td>
                  <td className="border border-black py-1 font-mono font-bold">
                    {anyMarksEntered && totalTerm1Obt !== null ? `${totalTerm1Obt} / ${maxTermMarks}` : '—'}
                  </td>
                  <td colSpan={4} className="border border-black"></td>
                  <td className="border border-black py-1 font-mono font-bold">
                    {anyMarksEntered && totalTerm2Obt !== null ? `${totalTerm2Obt} / ${maxTermMarks}` : '—'}
                  </td>
                  <td className="border border-black py-1 font-mono font-bold">
                    {anyMarksEntered && totalGrandObt !== null ? `${totalGrandObt} / ${maxGrandMarks}` : '—'}
                  </td>
                  <td className="border border-black"></td>
                </tr>

                {/* Summary Row 2: PERCENTAGE */}
                <tr className="font-bold border-b border-black text-[9px] bg-transparent">
                  <td colSpan={5} className="border border-black px-2 py-1 text-left uppercase font-serif">
                    PERCENTAGE
                  </td>
                  <td className="border border-black py-1 font-mono font-bold">
                    {anyMarksEntered && term1Pct !== null ? `${term1Pct}%` : '—'}
                  </td>
                  <td colSpan={4} className="border border-black"></td>
                  <td className="border border-black py-1 font-mono font-bold">
                    {anyMarksEntered && term2Pct !== null ? `${term2Pct}%` : '—'}
                  </td>
                  <td className="border border-black py-1 font-mono font-bold">
                    {anyMarksEntered && grandPct !== null ? `${grandPct}%` : '—'}
                  </td>
                  <td className="border border-black"></td>
                </tr>

                {/* Summary Row 3: GRADE */}
                <tr className="font-bold text-[9px] bg-transparent">
                  <td colSpan={5} className="border border-black px-2 py-1 text-left uppercase font-serif">
                    GRADE
                  </td>
                  <td className="border border-black py-1 font-mono font-bold">
                    {anyMarksEntered ? term1Grade : '—'}
                  </td>
                  <td colSpan={4} className="border border-black"></td>
                  <td className="border border-black py-1 font-mono font-bold">
                    {anyMarksEntered ? term2Grade : '—'}
                  </td>
                  <td className="border border-black py-1"></td>
                  <td className="border border-black py-1 font-serif font-bold text-center">
                    {anyMarksEntered ? overallGrade : '—'}
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>

        {/* ─── 4. MIDDLE SECTION: TWO BALANCED 50% COLUMNS ─── */}
        <div className="relative z-10 grid grid-cols-2 gap-2 mb-1.5 text-[8.5px]">
          
          {/* LEFT HALF: B. CO-SCHOLASTIC AREAS & C. DISCIPLINE */}
          <div className="flex flex-col justify-between">
            {/* B. CO-SCHOLASTIC AREAS */}
            <div>
              <table 
                className="w-full border-collapse border border-black text-center"
                style={{ borderCollapse: 'collapse', borderColor: '#000000' }}
              >
                <thead>
                  <tr className="border-b border-black">
                    <th 
                      colSpan={isAnnual ? 3 : 2} 
                      className="border border-black py-0.5 text-center font-bold font-serif text-[9.5px] uppercase"
                      style={{ backgroundColor: '#faeaed' }}
                    >
                      B. CO-SCHOLASTIC AREAS
                    </th>
                  </tr>
                  <tr 
                    className="font-bold border-b border-black text-[8px]"
                    style={{ backgroundColor: '#fdf2f5' }}
                  >
                    <th className="border border-black p-0.5 text-left w-36 font-serif">SUBJECT</th>
                    <th className="border border-black px-1 py-0.5 font-serif">
                      <div className="text-[8px] font-bold uppercase leading-snug">{coScholasticHeader}</div>
                      <div className="text-[7.5px] font-bold uppercase leading-snug">EXAMINATION</div>
                      <div className="text-[7px] font-normal leading-tight text-neutral-800">(GRADE)</div>
                    </th>
                    {isAnnual && (
                      <th className="border border-black px-1 py-0.5 font-serif">
                        <div className="text-[8px] font-bold uppercase leading-snug">ANNUAL</div>
                        <div className="text-[7.5px] font-bold uppercase leading-snug">EXAMINATION</div>
                        <div className="text-[7px] font-normal leading-tight text-neutral-800">(GRADE)</div>
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-transparent">
                  {coScholasticRows.map((item, idx) => (
                    <tr key={item.name || idx} className="border-b border-black">
                      <td className="border border-black px-1.5 py-0.5 text-left font-serif font-bold text-[8.5px]">
                        {item.name}
                      </td>
                      <td className="border border-black py-0.5 font-bold font-serif">{item.term1}</td>
                      {isAnnual && (
                        <td className="border border-black py-0.5 font-bold font-serif">{item.term2}</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* C. DISCIPLINE */}
            <div className="mt-1">
              <table 
                className="w-full border-collapse border border-black text-center"
                style={{ borderCollapse: 'collapse', borderColor: '#000000' }}
              >
                <thead>
                  <tr className="border-b border-black">
                    <th 
                      colSpan={isAnnual ? 3 : 2} 
                      className="border border-black py-0.5 text-center font-bold font-serif text-[9.5px] uppercase"
                      style={{ backgroundColor: '#faeaed' }}
                    >
                      C. DISCIPLINE
                    </th>
                  </tr>
                  <tr 
                    className="font-bold border-b border-black text-[8px]"
                    style={{ backgroundColor: '#fdf2f5' }}
                  >
                    <th className="border border-black p-0.5 text-left w-36 font-serif">SUBJECT</th>
                    <th className="border border-black px-1 py-0.5 font-serif">
                      <div className="text-[8px] font-bold uppercase leading-snug">{coScholasticHeader}</div>
                      <div className="text-[7.5px] font-bold uppercase leading-snug">EXAMINATION</div>
                      <div className="text-[7px] font-normal leading-tight text-neutral-800">(GRADE)</div>
                    </th>
                    {isAnnual && (
                      <th className="border border-black px-1 py-0.5 font-serif">
                        <div className="text-[8px] font-bold uppercase leading-snug">ANNUAL</div>
                        <div className="text-[7.5px] font-bold uppercase leading-snug">EXAMINATION</div>
                        <div className="text-[7px] font-normal leading-tight text-neutral-800">(GRADE)</div>
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-transparent">
                  <tr>
                    <td className="border border-black px-1.5 py-1 text-left font-serif font-bold text-[8.5px]">
                      DISCIPLINE
                    </td>
                    <td className="border border-black py-1 font-bold font-serif">{disciplineGradeTerm1}</td>
                    {isAnnual && (
                      <td className="border border-black py-1 font-bold font-serif">{disciplineGradeTerm2}</td>
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT HALF: ATTENDANCE, STATUS/REMARKS & PROMOTION */}
          <div className="flex flex-col justify-between">
            {/* ATTENDANCE Table */}
            <div>
              <table 
                className="w-full border-collapse border border-black text-center"
                style={{ borderCollapse: 'collapse', borderColor: '#000000' }}
              >
                <thead>
                  <tr className="border-b border-black">
                    <th 
                      colSpan={3} 
                      className="border border-black py-0.5 text-center font-bold font-serif text-[9.5px] uppercase"
                      style={{ backgroundColor: '#faeaed' }}
                    >
                      ATTENDANCE
                    </th>
                  </tr>
                  <tr 
                    className="font-bold border-b border-black text-[8px]"
                    style={{ backgroundColor: '#fdf2f5' }}
                  >
                    <th className="border border-black p-0.5 text-left font-serif">TERMS</th>
                    <th className="border border-black p-0.5 font-serif">PRESENT/WORKING DAYS</th>
                    <th className="border border-black p-0.5 font-serif">PER %</th>
                  </tr>
                </thead>
                <tbody className="text-[8.5px] font-mono bg-transparent">
                  {isAnnual ? (
                    <>
                      <tr className="border-b border-black">
                        <td className="border border-black px-1.5 py-0.5 text-left font-serif">
                          Half Yearly Examination
                        </td>
                        <td className="border border-black py-0.5">{hasHyAtt ? `${hyPresent} / ${hyTotal !== null ? hyTotal : '—'}` : '—'}</td>
                        <td className="border border-black py-0.5">{hasHyAtt && hyTotal ? `${((hyPresent / hyTotal) * 100).toFixed(2)}%` : '—'}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="border border-black px-1.5 py-0.5 text-left font-serif">
                          Annual Examination
                        </td>
                        <td className="border border-black py-0.5">{hasAnnAtt ? `${annPresent} / ${annTotal !== null ? annTotal : '—'}` : '—'}</td>
                        <td className="border border-black py-0.5">{hasAnnAtt && annTotal ? `${((annPresent / annTotal) * 100).toFixed(2)}%` : '—'}</td>
                      </tr>
                      <tr className="font-bold">
                        <td className="border border-black px-1.5 py-0.5 text-left font-serif">
                          TOTAL
                        </td>
                        <td className="border border-black py-0.5 font-bold">{totPresent !== null ? `${totPresent} / ${totWorking !== null ? totWorking : '—'}` : '—'}</td>
                        <td className="border border-black py-0.5 font-bold">{attPct !== null ? `${attPct}%` : '—'}</td>
                      </tr>
                    </>
                  ) : (
                    <tr>
                      <td className="border border-black px-1.5 py-1 text-left font-serif">
                        {attTermLabel}
                      </td>
                      <td className="border border-black py-1 font-mono">{hasHyAtt ? `${hyPresent} / ${hyTotal !== null ? hyTotal : '—'}` : '—'}</td>
                      <td className="border border-black py-1 font-mono font-bold">{hasHyAtt && hyTotal ? `${((hyPresent / hyTotal) * 100).toFixed(2)}%` : '—'}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* STATUS Box */}
            <div className="border border-black mt-1 px-2 py-0.5 text-[8.5px] bg-transparent flex items-center">
              <span className="font-bold uppercase font-serif text-[8.5px] w-20">STATUS</span>
              <span className="font-serif text-[9px] font-medium">: {resultStatus}</span>
            </div>

            {/* REMARKS Box */}
            <div className="border border-black mt-1 text-[8.5px] bg-transparent flex items-center">
              <div className="w-24 border-r border-black py-0.5 px-2 font-bold uppercase font-serif text-[8.5px] text-center">
                REMARKS
              </div>
              <div className="flex-1 py-0.5 px-2.5 text-center font-serif text-[8.5px] font-medium leading-tight">
                {teacherRemarks}
              </div>
            </div>

            {/* PROMOTED TO CLASS */}
            <div className="mt-1 text-[9.5px] font-bold font-serif flex items-baseline">
              <span className="shrink-0 text-black">Promoted to class :</span>
              <span className="border-b border-black flex-1 ml-1.5 px-2 pb-0.5 font-bold text-black min-h-[16px] inline-block">
                {isAnnual ? (promotedClass || '—') : '—'}
              </span>
            </div>
          </div>
        </div>

        {/* ─── 5. INSTRUCTIONS & GRADING SCALE (TWO 50% SIDE-BY-SIDE TABLES) ─── */}
        <div className="relative z-10 mb-0.5" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
          <div 
            className="border border-black border-b-0 py-0.5 text-center font-bold font-serif text-[9.5px] uppercase"
            style={{ backgroundColor: '#faeaed' }}
          >
            INSTRUCTIONS
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Table 1: Marks Range & Grade */}
            <div>
              <table 
                className="w-full border-collapse border border-black text-center text-[8.5px]"
                style={{ borderCollapse: 'collapse', borderColor: '#000000' }}
              >
                <thead>
                  <tr 
                    className="font-bold border-b border-black"
                    style={{ backgroundColor: '#fdf2f5' }}
                  >
                    <th className="border border-black py-0.5 px-1 font-serif">MARKS RANGE</th>
                    <th className="border border-black py-0.5 px-1 font-serif">GRADE</th>
                    <th className="border border-black py-0.5 px-1 font-serif">MARKS RANGE</th>
                    <th className="border border-black py-0.5 px-1 font-serif">GRADE</th>
                  </tr>
                </thead>
                <tbody className="font-mono bg-transparent">
                  <tr>
                    <td className="border border-black py-0.5 px-1 align-middle leading-normal">91 - 100</td>
                    <td className="border border-black py-0.5 px-1 align-middle leading-normal font-bold font-serif">A1</td>
                    <td className="border border-black py-0.5 px-1 align-middle leading-normal">51 - 60</td>
                    <td className="border border-black py-0.5 px-1 align-middle leading-normal font-bold font-serif">C1</td>
                  </tr>
                  <tr>
                    <td className="border border-black py-0.5 px-1 align-middle leading-normal">81 - 90</td>
                    <td className="border border-black py-0.5 px-1 align-middle leading-normal font-bold font-serif">A2</td>
                    <td className="border border-black py-0.5 px-1 align-middle leading-normal">41 - 50</td>
                    <td className="border border-black py-0.5 px-1 align-middle leading-normal font-bold font-serif">C2</td>
                  </tr>
                  <tr>
                    <td className="border border-black py-0.5 px-1 align-middle leading-normal">71 - 80</td>
                    <td className="border border-black py-0.5 px-1 align-middle leading-normal font-bold font-serif">B1</td>
                    <td className="border border-black py-0.5 px-1 align-middle leading-normal">33 - 40</td>
                    <td className="border border-black py-0.5 px-1 align-middle leading-normal font-bold font-serif">D</td>
                  </tr>
                  <tr>
                    <td className="border border-black py-0.5 px-1 align-middle leading-normal">61 - 70</td>
                    <td className="border border-black py-0.5 px-1 align-middle leading-normal font-bold font-serif">B2</td>
                    <td className="border border-black py-0.5 px-1 align-middle leading-normal">00 - 32</td>
                    <td className="border border-black py-0.5 px-1 align-middle leading-normal font-bold font-serif">E</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Table 2: Grade & Indicator */}
            <div>
              <table 
                className="w-full border-collapse border border-black text-center text-[8.5px]"
                style={{ borderCollapse: 'collapse', borderColor: '#000000' }}
              >
                <thead>
                  <tr 
                    className="font-bold border-b border-black"
                    style={{ backgroundColor: '#fdf2f5' }}
                  >
                    <th className="border border-black py-0.5 px-1 font-serif">GRADE</th>
                    <th className="border border-black py-0.5 px-1 font-serif">GRADE POINT</th>
                    <th className="border border-black py-0.5 px-1 font-serif">INDICATOR</th>
                  </tr>
                </thead>
                <tbody className="font-serif bg-transparent text-[8.5px]">
                  <tr>
                    <td className="border border-black py-0.5 px-1 align-middle leading-normal font-bold">A1</td>
                    <td className="border border-black py-0.5 px-1 align-middle leading-normal font-mono">91</td>
                    <td className="border border-black py-0.5 px-1 align-middle leading-normal">Excellent</td>
                  </tr>
                  <tr>
                    <td className="border border-black py-0.5 px-1 align-middle leading-normal font-bold">A2</td>
                    <td className="border border-black py-0.5 px-1 align-middle leading-normal font-mono">81</td>
                    <td className="border border-black py-0.5 px-1 align-middle leading-normal">Very Good</td>
                  </tr>
                  <tr>
                    <td className="border border-black py-0.5 px-1 align-middle leading-normal font-bold">B1</td>
                    <td className="border border-black py-0.5 px-1 align-middle leading-normal font-mono">71</td>
                    <td className="border border-black py-0.5 px-1 align-middle leading-normal">Good</td>
                  </tr>
                  <tr>
                    <td className="border border-black py-0.5 px-1 align-middle leading-normal font-bold">B2</td>
                    <td className="border border-black py-0.5 px-1 align-middle leading-normal font-mono">61</td>
                    <td className="border border-black py-0.5 px-1 align-middle leading-normal">Satisfactory</td>
                  </tr>
                  <tr>
                    <td className="border border-black py-0.5 px-1 align-middle leading-normal font-bold">C1</td>
                    <td className="border border-black py-0.5 px-1 align-middle leading-normal font-mono">51</td>
                    <td className="border border-black py-0.5 px-1 align-middle leading-normal">Average</td>
                  </tr>
                  <tr>
                    <td className="border border-black py-0.5 px-1 align-middle leading-normal font-bold">C2</td>
                    <td className="border border-black py-0.5 px-1 align-middle leading-normal font-mono">41</td>
                    <td className="border border-black py-0.5 px-1 align-middle leading-normal">Below Average</td>
                  </tr>
                  <tr>
                    <td className="border border-black py-0.5 px-1 align-middle leading-normal font-bold">D</td>
                    <td className="border border-black py-0.5 px-1 align-middle leading-normal font-mono">33</td>
                    <td className="border border-black py-0.5 px-1 align-middle leading-normal">Need Improvement</td>
                  </tr>
                  <tr>
                    <td className="border border-black py-0.5 px-1 align-middle leading-normal font-bold">E</td>
                    <td className="border border-black py-0.5 px-1 align-middle leading-normal font-mono">00</td>
                    <td className="border border-black py-0.5 px-1 align-middle leading-normal">Essential Repeat</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ─── 6. FOOTER: DATE & ATTESTATION SIGNATURES ─── */}
        <div 
          className="relative z-10 pt-1 px-1 text-[9.5px] mt-auto"
          style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}
        >
          {/* Top of footer: Date on Left */}
          <div className="mb-1">
            <span className="font-bold text-black font-serif text-[9.5px]">
              DATE : <span className="font-mono font-medium">{headerConfig.issueDate || '03-10-2026'}</span>
            </span>
          </div>

          {/* Signatures */}
          {isAnnual ? (
            /* Annual / Final: 2 Signatures (Class Teacher, Principal) */
            <div className="grid grid-cols-2 gap-12 items-end pt-0.5">
              <div className="flex flex-col items-center">
                <div className="h-8 w-full flex items-end justify-center mb-0.5">
                  {headerConfig.teacherSignatureImg ? (
                    <img 
                      src={headerConfig.teacherSignatureImg} 
                      alt="Class Teacher Signature" 
                      className="max-h-full max-w-full object-contain" 
                      style={{ mixBlendMode: 'multiply' }} 
                      crossOrigin="anonymous" 
                    />
                  ) : null}
                </div>
                <div 
                  className="w-52 max-w-[85%] border-t border-black pt-1 text-center font-bold text-black font-serif text-[10px]"
                  style={{ borderColor: '#000000' }}
                >
                  Class Teacher's Signature
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="h-8 w-full flex items-end justify-center mb-0.5 relative">
                  {headerConfig.sealStampImg ? (
                    <img 
                      src={headerConfig.sealStampImg} 
                      alt="School Seal" 
                      className="max-h-full max-w-full object-contain" 
                      style={{ mixBlendMode: 'multiply' }} 
                      crossOrigin="anonymous" 
                    />
                  ) : null}
                </div>
                <div 
                  className="w-52 max-w-[85%] border-t border-black pt-1 text-center font-bold text-black font-serif text-[10px]"
                  style={{ borderColor: '#000000' }}
                >
                  Principal's Signature
                </div>
              </div>
            </div>
          ) : (
            /* Periodic / Term: 3 Signatures (Parent, Class Teacher, Principal) */
            <div className="grid grid-cols-3 gap-6 items-end pt-0.5">
              <div className="flex flex-col items-center">
                <div className="h-8 w-full flex items-end justify-center mb-0.5" />
                <div 
                  className="w-40 max-w-[85%] border-t border-black pt-1 text-center font-bold text-black font-serif text-[9.5px]"
                  style={{ borderColor: '#000000' }}
                >
                  Parent's Signature
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="h-8 w-full flex items-end justify-center mb-0.5" />
                <div 
                  className="w-40 max-w-[85%] border-t border-black pt-1 text-center font-bold text-black font-serif text-[9.5px]"
                  style={{ borderColor: '#000000' }}
                >
                  Class Teacher's Signature
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="h-8 w-full flex items-end justify-center mb-0.5" />
                <div 
                  className="w-40 max-w-[85%] border-t border-black pt-1 text-center font-bold text-black font-serif text-[9.5px]"
                  style={{ borderColor: '#000000' }}
                >
                  Principal's Signature
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
