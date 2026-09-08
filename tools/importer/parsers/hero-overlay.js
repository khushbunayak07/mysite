/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-overlay. Base: hero.
 * Source: https://wknd-trendsetters.site/
 * Structure: 1 column, 3 rows. Row 1 = block name; row 2 = background image;
 * row 3 = title, subheading and CTA link (overlay content).
 */
export default function parse(element, { document }) {
  const bgImage = element.querySelector('img');
  const heading = element.querySelector('h1, h2, .h1-heading, [class*="heading"]');
  const subheading = element.querySelector('.subheading, p');
  const ctaLinks = Array.from(element.querySelectorAll('.button-group a, a.button'));

  const cells = [];

  // Row 2: background image.
  cells.push([bgImage || '']);

  // Row 3: overlay text content and CTAs.
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  contentCell.push(...ctaLinks);

  // Empty-block guard.
  if (contentCell.length === 0 && !bgImage) {
    element.replaceWith(...element.childNodes);
    return;
  }

  cells.push([contentCell.length ? contentCell : '']);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-overlay', cells });
  element.replaceWith(block);
}
