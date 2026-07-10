/**
 * media-rights-log-page.js — Renders the rights log page table from media-rights-log data.
 */

import {
  MEDIA_RIGHTS_META,
  PRESS_IMAGE_RIGHTS,
  CLIPPINGS_IMAGE_RIGHTS,
} from './media-rights-log.js';
import { getPressItems, getClippings } from './media-locale.js';

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

function isMsPage() {
  return document.documentElement.lang?.startsWith('ms')
    || /\/ms\//.test(window.location.pathname);
}

function renderPressRows() {
  const items = getPressItems();
  const byId = new Map(items.map(i => [i.id, i]));
  return PRESS_IMAGE_RIGHTS.map(entry => {
    const localized = byId.get(entry.id);
    const title = localized?.title || entry.title;
    return `
    <tr>
      <td>${esc(title)}</td>
      <td>${esc(entry.publisher)}</td>
      <td>${esc(formatSource(entry.imageSource))}</td>
      <td>${esc(entry.rightsHolder)}</td>
      <td><a href="${esc(entry.sourceUrl)}" target="_blank" rel="noopener noreferrer">${isMsPage() ? 'Asal' : 'Original'}</a></td>
    </tr>`;
  }).join('');
}

function renderClippingRows() {
  const items = getClippings();
  const byFile = new Map(items.map(c => [c.file, c]));
  return CLIPPINGS_IMAGE_RIGHTS.map(entry => {
    const localized = byFile.get(entry.file);
    const dateLabel = localized?.dateLabel || entry.dateLabel;
    return `
    <tr>
      <td>${esc(entry.file)}</td>
      <td>${esc(entry.publisher)}</td>
      <td>${esc(dateLabel)}</td>
      <td>${esc(formatSource(entry.imageSource))}</td>
      <td>${esc(entry.rightsHolder)}</td>
    </tr>`;
  }).join('');
}

export function initRightsLogPage() {
  const metaEl = document.getElementById('rights-log-meta');
  const pressBody = document.getElementById('rights-log-press');
  const clippingsBody = document.getElementById('rights-log-clippings');
  const ms = isMsPage();

  if (metaEl) {
    metaEl.textContent = ms
      ? `Kemas kini terakhir ${MEDIA_RIGHTS_META.lastUpdated}. ${PRESS_IMAGE_RIGHTS.length} item media, ${CLIPPINGS_IMAGE_RIGHTS.length} keratan akhbar.`
      : `Last updated ${MEDIA_RIGHTS_META.lastUpdated}. ${PRESS_IMAGE_RIGHTS.length} press items, ${CLIPPINGS_IMAGE_RIGHTS.length} clippings.`;
  }
  if (pressBody) pressBody.innerHTML = renderPressRows();
  if (clippingsBody) clippingsBody.innerHTML = renderClippingRows();
}

document.addEventListener('DOMContentLoaded', initRightsLogPage);
