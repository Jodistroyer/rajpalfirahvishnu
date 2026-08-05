/**
 * insights-format.js — Shared Firm Insights markdown → HTML formatter.
 * Used by modal.js (preview) and generate-insights-seo.mjs (static pages).
 */

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Signature name lines that should link to a people profile. */
function isAuthorNameLine(line) {
  return /^(?:[A-Z]\.\s+)?Vishnu\s+Kumar\b/i.test(line)
    || /^Dato'\s+Rajpal\s+Singh\b/i.test(line);
}

/** Signature / byline lines — muted body style, not headings. */
function isSignatureLine(line) {
  if (/^(Advocate\s*&\s*Solicitor|Peguambela\s*&\s*Peguamcara)\b/i.test(line)) return true;
  if (/^(Civil Law Subcommittee|Pengerusi Subjawatankuasa|Certified Mediator|Pengantara Bertauliah)\b/i.test(line)) return true;
  if (/^(?:[A-Z]\.\s+)?[A-ZÀ-Ý][a-zà-ÿ]+(?:\s+[A-ZÀ-Ý][a-zà-ÿ'.-]+){0,3}$/.test(line) && line.length < 40) {
    return true;
  }
  return false;
}

/** @param {string} line */
function detectHeading(line) {
  if (line.length > 140) return null;
  if (/[.?!]$/.test(line) && !/^[A-G]\./.test(line) && line.length > 60) return null;
  if (isSignatureLine(line)) return null;

  const letters = line.replace(/[^A-Za-zÀ-ÿ]/g, '');
  if (letters.length >= 8) {
    const upper = (letters.match(/[A-ZÀ-Ý]/g) || []).length;
    if (upper / letters.length >= 0.88) {
      return { level: 3, text: titleCaseAllCaps(line) };
    }
  }

  if (/^[A-G]\.\s+\S/.test(line)) return { level: 3, text: line };
  if (
    /^\d+\.\s+[A-ZÀ-Ý]/.test(line) &&
    line.length < 110 &&
    !/[.;,]$/.test(line) &&
    !/\b(and|or|dan)\s*$/i.test(line)
  ) {
    return { level: 4, text: line };
  }

  const sub = /^(Law\s*&\s*Drafting|Approach(\s+To)?\b|Undang-undang\b|Pendekatan\b|FUNDAMENTAL RULE|NOTE\b|Nota\b|PENGENALAN|KESIMPULAN|INTRODUCTION|CONCLUSION)\b/i;
  if (sub.test(line) && line.length < 100) return { level: 4, text: line };

  return null;
}

/** @param {string} s */
function titleCaseAllCaps(s) {
  return s.replace(/[A-ZÀ-Ý]{2,}(?:'[A-ZÀ-Ý]+)?/g, (word) => {
    if (word.length <= 4) return word;
    return word.charAt(0) + word.slice(1).toLowerCase();
  });
}

/** Escape then apply **bold** and light auto-emphasis for citations / sections. */
function inlineFormat(str) {
  let s = escHtml(str);
  s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  s = s.replace(
    /\b([A-ZÀ-Ý][\w'&.]*(?:\s+(?:v\.|v|bin|binti|&amp;|and|&)\s+[A-ZÀ-Ý][\w'&.]*)+(?:\s+[A-ZÀ-Ý][\w'&.]*)*\s*\[[^\]]+\])/g,
    '<strong>$1</strong>'
  );
  s = s.replace(
    /\b(Section|Seksyen|Order|Perintah|Rule|Kaedah|Practice Direction|Arahan Amalan)\s+(\d+[A-Za-z]?(?:\s*\([a-z0-9]+\))?(?:\s*r\.?\s*\d+[A-Za-z]?)?)/gi,
    '<strong>$1 $2</strong>'
  );
  return s;
}

/**
 * Render Firm Insights body text as structured HTML.
 * @param {string} raw
 * @param {string} [authorProfileHref]
 * @param {{ headingOffset?: number }} [opts] headingOffset adds to # / ## / ### levels (use 1 on article pages)
 */
export function formatArticleContent(raw, authorProfileHref = '', opts = {}) {
  const headingOffset = opts.headingOffset ?? 0;
  const text = String(raw || '').replace(/\r\n/g, '\n').trim();
  if (!text) return '';

  const lines = text.split('\n');
  /** @type {string[]} */
  const out = [];
  /** @type {string[]} */
  let para = [];
  /** @type {string[]} */
  let list = [];
  /** @type {string[]} */
  let quote = [];

  const flushPara = () => {
    if (!para.length) return;
    out.push(`<p>${inlineFormat(para.join(' '))}</p>`);
    para = [];
  };
  const flushList = () => {
    if (!list.length) return;
    out.push(`<ul>${list.map(i => `<li>${inlineFormat(i)}</li>`).join('')}</ul>`);
    list = [];
  };
  const flushQuote = () => {
    if (!quote.length) return;
    out.push(`<blockquote><p>${inlineFormat(quote.join(' '))}</p></blockquote>`);
    quote = [];
  };
  const flushAll = () => {
    flushList();
    flushQuote();
    flushPara();
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushAll();
      continue;
    }

    const mdH = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (mdH) {
      flushAll();
      const level = mdH[1].length + 2 + headingOffset;
      out.push(`<h${level}>${inlineFormat(mdH[2])}</h${level}>`);
      continue;
    }

    if (trimmed.startsWith('> ')) {
      flushList();
      flushPara();
      quote.push(trimmed.slice(2));
      continue;
    }
    if (quote.length) flushQuote();

    if (/^[-•]\s+/.test(trimmed)) {
      flushPara();
      list.push(trimmed.replace(/^[-•]\s+/, ''));
      continue;
    }
    if (list.length) flushList();

    const heading = detectHeading(trimmed);
    if (heading) {
      flushAll();
      const level = heading.level + headingOffset;
      out.push(`<h${level}>${inlineFormat(heading.text)}</h${level}>`);
      continue;
    }

    if (isSignatureLine(trimmed)) {
      flushAll();
      if (authorProfileHref && isAuthorNameLine(trimmed)) {
        out.push(
          `<p class="article-modal__sign"><a class="article-modal__author-link" href="${escHtml(authorProfileHref)}">${inlineFormat(trimmed)}</a></p>`
        );
      } else {
        out.push(`<p class="article-modal__sign">${inlineFormat(trimmed)}</p>`);
      }
      continue;
    }

    if (
      (trimmed.startsWith("'") || trimmed.startsWith('"') || trimmed.startsWith('\u2018') || trimmed.startsWith('\u201C')) &&
      trimmed.length > 40
    ) {
      flushAll();
      const q = trimmed.replace(/^['"\u2018\u201C]/, '').replace(/['"\u2019\u201D]\.?$/, '');
      out.push(`<blockquote><p>${inlineFormat(q)}</p></blockquote>`);
      continue;
    }

    para.push(trimmed);
  }

  flushAll();
  return out.join('');
}

export { escHtml };
