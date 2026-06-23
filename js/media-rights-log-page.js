/**
 * media-rights-log.js — Renders the rights log page table from media-rights-log data.
 */

import {
  MEDIA_RIGHTS_META,
  PRESS_IMAGE_RIGHTS,
  CLIPPINGS_IMAGE_RIGHTS,
} from './media-rights-log.js';

/** @param {string} str */
function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** @param {string} label */
function formatSource(label) {
  return label.replace(/-/g, ' ');
}

function renderPressRows() {
  return PRESS_IMAGE_RIGHTS.map(entry => `
    <tr>
      <td>${esc(entry.title)}</td>
      <td>${esc(entry.publisher)}</td>
      <td>${esc(formatSource(entry.imageSource))}</td>
      <td>${esc(entry.rightsHolder)}</td>
      <td><a href="${esc(entry.sourceUrl)}" target="_blank" rel="noopener noreferrer">Original</a></td>
    </tr>`).join('');
}

function renderClippingRows() {
  return CLIPPINGS_IMAGE_RIGHTS.map(entry => `
    <tr>
      <td>${esc(entry.file)}</td>
      <td>${esc(entry.publisher)}</td>
      <td>${esc(entry.dateLabel)}</td>
      <td>${esc(formatSource(entry.imageSource))}</td>
      <td>${esc(entry.rightsHolder)}</td>
    </tr>`).join('');
}

export function initRightsLogPage() {
  const metaEl = document.getElementById('rights-log-meta');
  const pressBody = document.getElementById('rights-log-press');
  const clippingsBody = document.getElementById('rights-log-clippings');

  if (metaEl) {
    metaEl.textContent = `Last updated ${MEDIA_RIGHTS_META.lastUpdated}. ${PRESS_IMAGE_RIGHTS.length} press items, ${CLIPPINGS_IMAGE_RIGHTS.length} clippings.`;
  }
  if (pressBody) pressBody.innerHTML = renderPressRows();
  if (clippingsBody) clippingsBody.innerHTML = renderClippingRows();
}

document.addEventListener('DOMContentLoaded', initRightsLogPage);
