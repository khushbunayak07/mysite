/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-gallery. Base: cards.
 * Source: https://wknd-trendsetters.site/
 * Image-only gallery. Structure: 2 columns; first row = block name; each
 * subsequent row = one card [image cell, text cell]. No text present in
 * source, so the second cell is left empty to preserve the 2-column shape.
 */
export default function parse(element, { document }) {
  // Each gallery item wraps a cover image (fallback to any direct child holding an img).
  const items = element.querySelectorAll(':scope > .utility-aspect-1x1, :scope > div');

  const cells = [];

  items.forEach((item) => {
    const img = item.matches('img') ? item : item.querySelector('img');
    if (!img) return;

    // Text content, if any is ever present.
    const textContent = [];
    const heading = item.querySelector('h1, h2, h3, h4, h5, h6, [class*="heading"]');
    if (heading) textContent.push(heading);
    const desc = item.querySelector('p');
    if (desc) textContent.push(desc);

    cells.push([img, textContent.length ? textContent : '']);
  });

  // Empty-block guard.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-gallery', cells });
  element.replaceWith(block);
}
