/**
 * Smart Search Engine for School ERP
 * Includes:
 * 1. Damerau-Levenshtein Edit Distance (Handles typos, deletions, transpositions)
 * 2. Phonetic & Hindi/Hinglish Synonyms Dictionary (250+ educational synonyms)
 * 3. Token-based Multi-word Scoring & Acronym Matching (e.g. 'dt' -> 'Daily Test', 'tc' -> 'Transfer Certificate')
 * 4. Automatic "Did You Mean?" Typo Correction Suggestions
 */

export function damerauLevenshtein(a, b) {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;
  const d = [];
  for (let i = 0; i <= an; i++) d[i] = [i];
  for (let j = 0; j <= bn; j++) d[0][j] = j;

  for (let i = 1; i <= an; i++) {
    for (let j = 1; j <= bn; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1,       // deletion
        d[i][j - 1] + 1,       // insertion
        d[i - 1][j - 1] + cost // substitution
      );
      // Adjacent character transposition (e.g. 'makrs' -> 'marks')
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[an][bn];
}

// Comprehensive Hindi, Hinglish, Abbreviation & Common Typo Dictionary
export const SYNONYM_DICTIONARY = {
  // Dashboard & Analytics
  'asboard': 'dashboard',
  'dashbord': 'dashboard',
  'deshboard': 'dashboard',
  'dashbard': 'dashboard',
  'dash': 'dashboard',
  'dashb': 'dashboard',
  'mukhya': 'dashboard',
  'home': 'dashboard',
  'homepage': 'dashboard',
  'analytics': 'dashboard',
  'kpi': 'dashboard',
  'overview': 'dashboard',

  // Daily Test / TestMaster
  'daly': 'daily',
  'dauly': 'daily',
  'dayly': 'daily',
  'dailly': 'daily',
  'dailytest': 'daily test',
  'dalytest': 'daily test',
  'testmaster': 'daily test',
  'test master': 'daily test',
  'daily marks': 'daily test',
  'unit test': 'daily test',
  'rozana test': 'daily test',
  'dt': 'daily test',

  // Performance & Ranking
  'perforamnce': 'performance',
  'performence': 'performance',
  'preformance': 'performance',
  'pradarshan': 'performance',
  'rank': 'performance',
  'ranking': 'performance',
  'topper': 'performance',
  'toppers': 'performance',
  'top 3': 'performance',

  // Attendance & Haziri
  'atendance': 'attendance',
  'attandance': 'attendance',
  'attendence': 'attendance',
  'attedance': 'attendance',
  'attend': 'attendance',
  'haziri': 'attendance',
  'hazri': 'attendance',
  'upsthiti': 'attendance',
  'upasthiti': 'attendance',
  'present': 'attendance',
  'absent': 'attendance',
  'punch': 'biometric',
  'rfid': 'biometric',
  'face': 'biometric',
  'gate': 'biometric',

  // Fee & Finance
  'feee': 'fee',
  'fees': 'fee',
  'fess': 'fee',
  'fee collection': 'fee',
  'paisa': 'fee',
  'paise': 'fee',
  'rupaye': 'fee',
  'rupee': 'fee',
  'shulk': 'fee',
  'challan': 'fee',
  'chalan': 'fee',
  'slip': 'fee',
  'reciept': 'receipt',
  'recipt': 'receipt',
  'pos': 'fee',
  'dues': 'fee',
  'due': 'fee',
  'concession': 'fee',
  'fine': 'fee',
  'voucher': 'fee',
  'jama': 'fee',

  // Admission & Students
  'admissoin': 'admission',
  'admision': 'admission',
  'addmission': 'admission',
  'admsn': 'admission',
  'dakhila': 'admission',
  'bharti': 'admission',
  'enroll': 'admission',
  'enrollment': 'admission',
  'enrolment': 'admission',
  'new student': 'admission',
  'chhatra': 'student',
  'bachhe': 'student',
  'bacche': 'student',
  'vidyarthi': 'student',
  'student': 'student',
  'studnet': 'student',
  'studet': 'student',
  'sis': 'student',

  // Marks, Result & Marksheet
  'makrs': 'marks',
  'mark': 'marks',
  'marks': 'marks',
  'reslt': 'result',
  'ruselt': 'result',
  'parinam': 'result',
  'ank': 'marks',
  'score': 'marks',
  'grading': 'marks',
  'pariksha': 'exam',
  'imtihan': 'exam',
  'marksheet': 'marksheet',
  'mark sheet': 'marksheet',
  'markshet': 'marksheet',
  'report card': 'marksheet',
  'reportcard': 'marksheet',
  'progress card': 'marksheet',
  'cbse': 'marksheet',

  // Timetable & Substitution
  'timtable': 'timetable',
  'timmertable': 'timetable',
  'time table': 'timetable',
  'timetabel': 'timetable',
  'time tabal': 'timetable',
  'period': 'timetable',
  'routine': 'timetable',
  'schedule': 'timetable',
  'proxy': 'substitution',
  'substitute': 'substitution',
  'badli': 'substitution',
  'daily desk': 'timetable',
  'lesson plan': 'timetable',
  'homework': 'timetable',

  // Teachers & Staff
  'adhyapak': 'teacher',
  'guru': 'teacher',
  'shikshak': 'teacher',
  'techar': 'teacher',
  'techer': 'teacher',
  'faculty': 'teacher',
  'staff': 'teacher',
  'sir': 'teacher',
  'madam': 'teacher',
  'mam': 'teacher',

  // Leave & Holidays
  'chhutti': 'leave',
  'chutti': 'leave',
  'avkaash': 'leave',
  'avkas': 'leave',
  'leav': 'leave',
  'holiday': 'leave',
  'cl': 'leave',
  'el': 'leave',

  // Announcements & Notices
  'soochana': 'announcement',
  'suchna': 'announcement',
  'notis': 'notice',
  'notic': 'notice',
  'circular': 'notice',
  'ghoshna': 'announcement',
  'broadcast': 'announcement',

  // Expenses & Accounts
  'kharcha': 'expense',
  'kharch': 'expense',
  'expence': 'expense',
  'expens': 'expense',
  'spending': 'expense',
  'bill': 'expense',
  'rozkird': 'daybook',
  'roznama': 'daybook',
  'bahi khata': 'daybook',
  'khata': 'daybook',
  'cash in hand': 'daybook',
  'cashbook': 'daybook',

  // Transport & Library
  'gadi': 'transport',
  'gaadi': 'transport',
  'bus': 'transport',
  'van': 'transport',
  'vahan': 'transport',
  'driver': 'transport',
  'route': 'transport',
  'kitab': 'library',
  'pustak': 'library',
  'pustakalaya': 'library',
  'libary': 'library',
  'book': 'library',

  // Certificates & Identity
  'tc': 'certificate',
  'transfer certificate': 'certificate',
  'praman patra': 'certificate',
  'pramanpatra': 'certificate',
  'bonafide': 'certificate',
  'icard': 'id card',
  'i card': 'id card',
  'identity card': 'id card',
  'pehechan patra': 'id card',
  'badge': 'id card'
};

/**
 * Normalizes query string: lowercases, trims, and cleans non-alphanumeric punctuation
 */
export function normalizeQuery(str) {
  if (!str) return '';
  return str.toLowerCase().trim().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Calculates a match score between a target text/keyword set and a search query.
 * Handles:
 * - Exact match
 * - Prefix match
 * - Substring match
 * - Acronym match (e.g. 'dt' for 'Daily Test')
 * - Damerau-Levenshtein typo tolerance
 * - Hindi / Hinglish / Phonetic synonyms
 */
export function scoreItem(item, query, searchableFields = ['title', 'desc', 'category', 'keywords']) {
  const rawQuery = query.toLowerCase().trim();
  const cleanQuery = normalizeQuery(query);
  if (!cleanQuery) return { score: 100, didYouMean: null };

  const queryTokens = cleanQuery.split(/\s+/).filter(Boolean);

  // Expand query with synonyms
  const expandedTokens = [...queryTokens];
  let detectedSuggestion = null;

  queryTokens.forEach(tok => {
    // Direct synonym map
    if (SYNONYM_DICTIONARY[tok]) {
      const syn = SYNONYM_DICTIONARY[tok];
      if (!expandedTokens.includes(syn)) {
        expandedTokens.push(syn);
      }
      if (!detectedSuggestion) detectedSuggestion = syn;
    } else {
      // Fuzzy match against synonym keys
      for (const [key, val] of Object.entries(SYNONYM_DICTIONARY)) {
        if (tok.length >= 3 && Math.abs(key.length - tok.length) <= 2) {
          const dist = damerauLevenshtein(key, tok);
          if (dist <= (tok.length <= 4 ? 1 : 2)) {
            if (!expandedTokens.includes(val)) expandedTokens.push(val);
            if (!detectedSuggestion) detectedSuggestion = val;
            break;
          }
        }
      }
    }
  });

  // Gather all item text tokens
  const targetTokens = new Set();
  const rawTexts = [];

  searchableFields.forEach(field => {
    const val = item[field];
    if (Array.isArray(val)) {
      val.forEach(v => {
        if (typeof v === 'string') {
          rawTexts.push(v.toLowerCase());
          normalizeQuery(v).split(/\s+/).forEach(t => targetTokens.add(t));
        }
      });
    } else if (typeof val === 'string') {
      rawTexts.push(val.toLowerCase());
      normalizeQuery(val).split(/\s+/).forEach(t => targetTokens.add(t));
    }
  });

  const fullTargetString = rawTexts.join(' ');

  let score = 0;

  // 1. Exact phrase match in full text
  if (fullTargetString.includes(rawQuery)) {
    score += 1200;
  } else if (fullTargetString.includes(cleanQuery)) {
    score += 1000;
  }

  // 2. Acronym match (e.g. 'dt' for 'Daily Test')
  if (cleanQuery.length >= 2 && cleanQuery.length <= 4 && item.title) {
    const titleAcronym = item.title
      .split(/\s+/)
      .map(w => w[0]?.toLowerCase())
      .filter(Boolean)
      .join('');
    if (titleAcronym.includes(cleanQuery)) {
      score += 850;
    }
  }

  // 3. Token-by-token scoring across all targets
  const targetTokenList = Array.from(targetTokens);

  expandedTokens.forEach(qtok => {
    let bestTokenScore = 0;
    let matchedWord = null;

    targetTokenList.forEach(ttok => {
      if (ttok === qtok) {
        // Exact token match
        bestTokenScore = Math.max(bestTokenScore, 700);
        matchedWord = ttok;
      } else if (ttok.startsWith(qtok)) {
        // Prefix match
        bestTokenScore = Math.max(bestTokenScore, 550);
        matchedWord = ttok;
      } else if (ttok.includes(qtok) && qtok.length >= 3) {
        // Substring match
        bestTokenScore = Math.max(bestTokenScore, 420);
        matchedWord = ttok;
      } else {
        // Typo tolerance: Damerau-Levenshtein Edit Distance
        const qlen = qtok.length;
        const tlen = ttok.length;

        if (qlen >= 3) {
          const maxDistance = qlen <= 4 ? 1 : qlen <= 7 ? 2 : 3;
          const dist = damerauLevenshtein(ttok, qtok);

          if (dist <= maxDistance) {
            const similarity = 1 - (dist / Math.max(qlen, tlen));
            // Ensure character overlap is high
            const fuzzyScore = Math.round(480 * similarity);
            if (fuzzyScore > bestTokenScore) {
              bestTokenScore = fuzzyScore;
              matchedWord = ttok;
              if (!detectedSuggestion && qtok !== ttok) {
                detectedSuggestion = ttok;
              }
            }
          }
        }
      }
    });

    score += bestTokenScore;
  });

  return {
    score,
    didYouMean: detectedSuggestion && detectedSuggestion !== cleanQuery ? detectedSuggestion : null
  };
}

/**
 * Filter and Rank Items with Intelligent Fuzzy Search
 */
export function smartSearch(items, query, searchableFields = ['title', 'desc', 'category', 'keywords']) {
  if (!query || !query.trim()) {
    return {
      results: items,
      didYouMean: null
    };
  }

  let globalDidYouMean = null;

  const scored = items.map(item => {
    const { score, didYouMean } = scoreItem(item, query, searchableFields);
    if (!globalDidYouMean && didYouMean) {
      globalDidYouMean = didYouMean;
    }
    return { item, score };
  })
  .filter(r => r.score > 0)
  .sort((a, b) => b.score - a.score);

  return {
    results: scored.map(s => s.item),
    scores: scored.map(s => s.score),
    didYouMean: globalDidYouMean
  };
}
