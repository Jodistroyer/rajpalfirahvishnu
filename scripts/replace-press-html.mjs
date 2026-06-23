import fs from 'fs';

const file = 'media/index.html';
let html = fs.readFileSync(file, 'utf8');
const startMarker = '<h2 class="media-room__subsection-title">In the Press</h2>';
const endMarker = '<div class="media-room__subsection media-room__subsection--clippings"';

const start = html.indexOf(startMarker);
const end = html.indexOf(endMarker);
if (start === -1 || end === -1) {
  console.error('markers not found', start, end);
  process.exit(1);
}

const sectionStart = html.lastIndexOf('<div class="media-room__subsection">', start);
const replacement = `<div class="media-room__subsection" id="press">
          <div class="media-room__subsection-header">
            <div class="media-room__subsection-copy">
              <h2 class="media-room__subsection-title">In the Press</h2>
              <p class="media-room__subsection-desc">
                Press, broadcast, and online coverage featuring Datuk Rajpal Singh and our advocates across Malaysia.
                Filter by topic below.
              </p>
            </div>
          </div>
        </div>

        <div id="press-grid"
             class="press-grid"
             data-press-mode="full"
             aria-label="Press coverage archive"></div>

        `;

html = html.slice(0, sectionStart) + replacement + html.slice(end);
fs.writeFileSync(file, html);
console.log('Updated', file);
