import fs from 'fs';

for (const file of ['index.html', 'media/index.html']) {
  let html = fs.readFileSync(file, 'utf8');
  const heading = file.includes('media/') ? 'h2' : 'h3';

  const firmTitle = `<${heading} class="media-room__subsection-title">Firm Insights</${heading}>`;
  const pressTitle = `<${heading} class="media-room__subsection-title">In the Press</${heading}>`;

  const firmTitleIdx = html.indexOf(firmTitle);
  const pressTitleIdx = html.indexOf(pressTitle);
  if (firmTitleIdx === -1 || pressTitleIdx === -1 || firmTitleIdx > pressTitleIdx) {
    console.error('Markers not found or already reordered in', file);
    process.exit(1);
  }

  const firmStart = html.lastIndexOf('<div class="media-room__subsection">', firmTitleIdx);
  const pressSubStart = html.lastIndexOf('<div class="media-room__subsection', pressTitleIdx);

  let firmBlock = html.slice(firmStart, pressSubStart);
  firmBlock = firmBlock.replace(
    '<div class="media-room__subsection">',
    '<div class="media-room__subsection media-room__subsection--insights">'
  );

  html = html.slice(0, firmStart) + html.slice(pressSubStart);
  html = html.replace(
    'media-room__subsection media-room__subsection--press',
    'media-room__subsection'
  );

  const galleryClose = html.indexOf('id="clippings-gallery"') !== -1
    ? 'id="clippings-gallery"'
    : 'id="clippings"';
  const galleryIdx = html.indexOf(galleryClose);
  const galleryDivStart = html.lastIndexOf('<div ', galleryIdx);
  const afterGallery = html.indexOf('</div>', html.indexOf('itemprop="description"', galleryIdx)) + '</div>'.length;

  html = html.slice(0, afterGallery) + '\n' + firmBlock + html.slice(afterGallery);

  fs.writeFileSync(file, html);
  console.log('Reordered', file);
}
