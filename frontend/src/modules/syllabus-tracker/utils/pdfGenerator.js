import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import katex from 'katex';
import html2canvas from 'html2canvas';

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function stripHtmlToPlain(html = '') {
  return String(html || '')
    .replace(/<span[^>]*data-latex="([^"]+)"[^>]*>[\s\S]*?<\/span>/gi, ' $1 ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<li[^>]*>/gi, '\n• ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function hasUnicodeOrMath(str = '') {
  return /[^\x00-\x7F]/.test(str) || /<span[^>]*data-latex=|\$[^$]+\$|<(strong|b|em|i|u|sup|sub|ul|li)/i.test(str);
}

function formatRichHtmlForCanvas(rawHtml = '') {
  let res = String(rawHtml || '');
  res = res.replace(/<span[^>]*data-latex="([^"]+)"[^>]*>[\s\S]*?<\/span>/gi, (_, latex) => {
    try {
      return katex.renderToString(latex, { throwOnError: false, displayMode: false });
    } catch {
      return latex;
    }
  });
  res = res.replace(/\$([^$]+)\$/g, (_, latex) => {
    try {
      return katex.renderToString(latex, { throwOnError: false, displayMode: false });
    } catch {
      return latex;
    }
  });
  return res;
}

async function renderHtmlBlockToImage(html, widthMm, { fontSizePt = 11, fontFamily = 'Times New Roman', color = '#000000' } = {}) {
  const pxPerMm = 3.7795;
  const widthPx = Math.max(120, Math.round(widthMm * pxPerMm));
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-99999px';
  container.style.top = '0';
  container.style.width = `${widthPx}px`;
  container.style.fontFamily = `${fontFamily}, "Noto Sans Devanagari", system-ui, sans-serif`;
  container.style.fontSize = `${fontSizePt}pt`;
  container.style.lineHeight = '1.42';
  container.style.color = color;
  container.style.background = '#ffffff';
  container.style.padding = '1px 2px';
  container.style.wordBreak = 'break-word';
  container.innerHTML = formatRichHtmlForCanvas(html);
  document.body.appendChild(container);

  try {
    if (document.fonts) await document.fonts.ready;
    const canvas = await html2canvas(container, {
      scale: 2,
      backgroundColor: null,
      logging: false,
      useCORS: true,
    });
    const heightMm = (canvas.height / 2) / pxPerMm;
    return {
      dataUrl: canvas.toDataURL('image/png'),
      widthMm,
      heightMm,
    };
  } finally {
    document.body.removeChild(container);
  }
}

async function fetchImageDataUrl(url) {
  if (!url) return null;
  if (url.startsWith('data:image/')) return url;
  const resp = await fetch(url);
  const blob = await resp.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function formatDuration(minutes = 0) {
  const m = Number(minutes || 0);
  const h = Math.floor(m / 60);
  const rem = m % 60;
  if (h > 0 && rem > 0) return `${h} hr ${rem} min`;
  if (h > 0) return `${h} hr`;
  return `${rem} min`;
}

function hexToRgb(hex = '#000000') {
  const clean = String(hex).replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean.padEnd(6, '0');
  const num = parseInt(full.slice(0, 6), 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

export async function generateExamPaperPdf(paper, rollNumber = '') {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const fontSize = Math.min(Math.max(parseFloat(String(paper.styleFontSize || '11').replace(/[^\d.]/g, '')) || 11, 8), 18);
  const lineHeight = Math.max(4.2, fontSize * 0.3528 * 1.32);
  const fontFamily = paper.styleFontFamily === 'Arial' || paper.styleFontFamily === 'Helvetica' ? 'Helvetica' : 'Times';
  const color = paper.styleColor || '#000000';
  const rgb = hexToRgb(color);
  const isSplit = paper.templateType === 'SPLIT';

  const PAGE_W = 210;
  const CONTENT_END_Y = 280;
  const COL_W = isSplit ? 85 : 180;

  let currentPage = 1;
  let currentCol = 0;
  let y = 72;

  let logoDataUrl = null;
  if (paper.logoUrl) {
    try {
      logoDataUrl = await fetchImageDataUrl(paper.logoUrl);
    } catch {
      logoDataUrl = null;
    }
  }

  const paintPageChrome = (pNum) => {
    if (logoDataUrl) {
      try {
        doc.saveGraphicsState();
        doc.setGState(new doc.GState({ opacity: 0.04 }));
        doc.addImage(logoDataUrl, 'PNG', 60, 103, 90, 90);
        doc.restoreGraphicsState();
      } catch {
        // Skip watermark if GState unavailable
      }
    }
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(`Page ${pNum}`, 105, 289, { align: 'center' });
    doc.text(paper.examName || 'Examination Paper', 195, 289, { align: 'right' });
    if (isSplit) {
      doc.setDrawColor(210, 210, 210);
      doc.setLineWidth(0.2);
      doc.line(105, pNum === 1 ? 70 : 18, 105, 282);
    }
    doc.setTextColor(rgb.r, rgb.g, rgb.b);
  };

  const paintHeader = () => {
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.35);
    doc.rect(15, 14, 180, 33);

    if (logoDataUrl) {
      try {
        doc.addImage(logoDataUrl, 'PNG', 18, 17, 22, 22);
      } catch {
        // Ignore broken image
      }
    }
    const centerX = logoDataUrl ? 116 : 105;
    doc.setTextColor(rgb.r, rgb.g, rgb.b);
    doc.setFont(fontFamily, 'bold');
    doc.setFontSize(14);
    doc.text(String(paper.schoolName || 'SCHOOL ACADEMIC PORTAL').toUpperCase(), centerX, 22, { align: 'center' });

    doc.setFontSize(11);
    doc.text(String(paper.examName || 'EXAMINATION QUESTION PAPER'), centerX, 28, { align: 'center' });

    doc.setFont(fontFamily, 'normal');
    doc.setFontSize(9);
    const meta = [paper.className || 'Class', `Subject: ${paper.subjectName || 'General'}`];
    if (paper.examDate) meta.push(`Date: ${new Date(paper.examDate).toLocaleDateString()}`);
    if (paper.showTeacherName !== false && paper.teacherName) meta.push(`Faculty: ${paper.teacherName}`);
    doc.text(meta.join('   |   '), centerX, 35, { align: 'center' });
    doc.text(`Duration: ${formatDuration(paper.duration)}   |   Max Marks: ${paper.totalMarks || 0}`, centerX, 41, { align: 'center' });

    doc.rect(15, 51, 180, 12);
    doc.setFont(fontFamily, 'bold');
    doc.setFontSize(9.5);
    doc.text('Student Name: ___________________________________', 18, 59);
    doc.text(`Roll No: ${rollNumber || '________________'}`, 136, 59);
  };

  paintPageChrome(1);
  paintHeader();

  const getColX = () => (isSplit ? (currentCol === 0 ? 15 : 110) : 15);

  const ensureSpace = (neededMm) => {
    if (y + neededMm <= CONTENT_END_Y) return;
    if (isSplit && currentCol === 0) {
      currentCol = 1;
      y = currentPage === 1 ? 72 : 18;
      return;
    }
    doc.addPage();
    currentPage += 1;
    currentCol = 0;
    y = 18;
    paintPageChrome(currentPage);
  };

  const drawRichOrPlain = async (htmlText, xOffset, maxW, fSize = fontSize) => {
    const raw = String(htmlText || '');
    if (!raw.trim()) return;
    if (hasUnicodeOrMath(raw)) {
      const rendered = await renderHtmlBlockToImage(raw, maxW, {
        fontSizePt: fSize,
        fontFamily: paper.styleFontFamily || 'Times New Roman',
        color,
      });
      ensureSpace(rendered.heightMm + 1);
      doc.addImage(rendered.dataUrl, 'PNG', xOffset, y - 3.2, rendered.widthMm, rendered.heightMm);
      y += rendered.heightMm + 1.5;
    } else {
      const clean = stripHtmlToPlain(raw);
      doc.setFont(fontFamily, 'normal');
      doc.setFontSize(fSize);
      doc.setTextColor(rgb.r, rgb.g, rgb.b);
      const lines = doc.splitTextToSize(clean, maxW);
      lines.forEach((line) => {
        ensureSpace(lineHeight);
        doc.text(line, xOffset, y);
        y += lineHeight;
      });
    }
  };

  // General Instructions
  if (paper.instructions && paper.instructions.trim()) {
    ensureSpace(12);
    doc.setFont(fontFamily, 'bold');
    doc.setFontSize(fontSize);
    doc.text('General Instructions:', getColX(), y);
    y += lineHeight + 0.5;
    await drawRichOrPlain(paper.instructions.replace(/\n/g, '<br/>'), getColX(), COL_W, Math.max(9, fontSize - 1));
    y += 2;
  }

  let qNum = 0;
  for (const sec of paper.sections || []) {
    ensureSpace(14);
    const colX = getColX();
    doc.setFont(fontFamily, 'bold');
    doc.setFontSize(fontSize + 1.5);
    doc.text(sec.sectionTitle || 'Section', colX + COL_W / 2, y, { align: 'center' });
    y += lineHeight;
    if (sec.sectionDescription) {
      doc.setFont(fontFamily, 'italic');
      doc.setFontSize(fontSize - 1);
      doc.text(sec.sectionDescription, colX + COL_W / 2, y, { align: 'center' });
      y += lineHeight;
    }
    y += 1.5;

    for (const q of sec.questions || []) {
      qNum += 1;
      ensureSpace(12);
      const colStartX = getColX();
      const marksLabel = `[${q.marks || 1}]`;
      doc.setFont(fontFamily, 'bold');
      doc.setFontSize(fontSize);
      doc.text(`Q${qNum}.`, colStartX, y);
      doc.text(marksLabel, colStartX + COL_W, y, { align: 'right' });

      const qBodyWidth = q.imageUrl ? COL_W - 46 : COL_W - 18;
      const startQ_Y = y;
      await drawRichOrPlain(q.questionText || q.passageText || q.assertion || '', colStartX + 9, qBodyWidth, fontSize);

      if (q.imageUrl) {
        try {
          const qImg = await fetchImageDataUrl(q.imageUrl);
          if (qImg) {
            doc.addImage(qImg, 'PNG', colStartX + COL_W - 36, startQ_Y - 3, 28, 22);
            y = Math.max(y, startQ_Y + 21);
          }
        } catch {
          // Ignore image load issue
        }
      }

      if (q.segmentType === 'ASSERTION_REASONING') {
        await drawRichOrPlain(`<strong>Assertion (A):</strong> ${q.assertion || ''}`, colStartX + 9, COL_W - 14, fontSize - 0.5);
        await drawRichOrPlain(`<strong>Reason (R):</strong> ${q.reason || ''}`, colStartX + 9, COL_W - 14, fontSize - 0.5);
      }

      if (q.segmentType === 'MATCHING' && Array.isArray(q.matchingPairs)) {
        for (let mIdx = 0; mIdx < q.matchingPairs.length; mIdx++) {
          const pair = q.matchingPairs[mIdx];
          ensureSpace(lineHeight);
          doc.setFont(fontFamily, 'normal');
          doc.setFontSize(fontSize - 0.5);
          doc.text(`(${mIdx + 1}) ${pair.left || ''}`, colStartX + 10, y);
          doc.text(`(${String.fromCharCode(97 + mIdx)}) ${pair.right || ''}`, colStartX + COL_W * 0.54, y);
          y += lineHeight;
        }
      }

      if (q.segmentType === 'PASSAGE' && Array.isArray(q.subQuestions)) {
        for (let sqIdx = 0; sqIdx < q.subQuestions.length; sqIdx++) {
          const sq = q.subQuestions[sqIdx];
          await drawRichOrPlain(`<strong>(${String.fromCharCode(105 + sqIdx)})</strong> ${sq.questionText || ''} <em>(${sq.marks || 1}m)</em>`, colStartX + 10, COL_W - 14, fontSize - 0.5);
        }
      }

      if (Array.isArray(q.options) && q.options.length > 0) {
        const optLabels = ['(a)', '(b)', '(c)', '(d)'];
        for (let oIdx = 0; oIdx < q.options.length; oIdx++) {
          const optText = typeof q.options[oIdx] === 'string' ? q.options[oIdx] : q.options[oIdx]?.text || '';
          await drawRichOrPlain(`${optLabels[oIdx] || `(${oIdx + 1})`} ${optText}`, colStartX + 10, COL_W - 15, fontSize - 0.5);
        }
      }

      // Internal choice OR alternatives
      if (Array.isArray(q.alternatives) && q.alternatives.length > 0) {
        for (const alt of q.alternatives) {
          ensureSpace(lineHeight * 2);
          doc.setFont(fontFamily, 'bold');
          doc.setFontSize(fontSize - 0.5);
          doc.text('OR', colStartX + COL_W / 2, y, { align: 'center' });
          y += lineHeight;
          await drawRichOrPlain(alt.questionText || '', colStartX + 9, COL_W - 16, fontSize);
          if (Array.isArray(alt.options) && alt.options.length > 0) {
            const optLabels = ['(a)', '(b)', '(c)', '(d)'];
            for (let oIdx = 0; oIdx < alt.options.length; oIdx++) {
              const optText = typeof alt.options[oIdx] === 'string' ? alt.options[oIdx] : alt.options[oIdx]?.text || '';
              await drawRichOrPlain(`${optLabels[oIdx] || `(${oIdx + 1})`} ${optText}`, colStartX + 10, COL_W - 15, fontSize - 0.5);
            }
          }
        }
      }

      y += 2.5;
    }
    y += 3;
  }

  return doc.output('blob');
}

export async function generateBulkExamPapersZip(paper, studentCount = 10) {
  const zip = new JSZip();
  const count = Math.min(Math.max(Number(studentCount) || 1, 1), 100);
  for (let i = 1; i <= count; i++) {
    const rollNo = `ROLL-${String(i).padStart(3, '0')}`;
    const pdfBlob = await generateExamPaperPdf(paper, rollNo);
    zip.file(`${(paper.subjectName || 'Paper').replace(/\s+/g, '_')}_${rollNo}.pdf`, pdfBlob);
  }
  return zip.generateAsync({ type: 'blob' });
}
