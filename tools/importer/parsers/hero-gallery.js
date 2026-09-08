/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-gallery. Base: hero.
 * Source: https://wknd-trendsetters.site/
 * Structure: 1 column, 3 rows. Row 1 = block name; row 2 = image(s); row 3 =
 * title, subheading and CTA links.
 */
export default function parse(element, { document }) {
  const heading = element.querySelector('h1, h2, .h1-heading, [class*="heading"]');
  const subheading = element.querySelector('.subheading, p');
  const ctaLinks = Array.from(element.querySelectorAll('.button-group a, a.button'));
  const images = Array.from(element.querySelectorAll('img'));

  const cells = [];

  // Row 2: background / gallery image(s).
  const imageCell = [];
  images.forEach((img) => imageCell.push(img));
  cells.push([imageCell.length ? imageCell : '']);

  // Row 3: text content and CTAs.
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  contentCell.push(...ctaLinks);

  // Empty-block guard.
  if (contentCell.length === 0 && imageCell.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  cells.push([contentCell.length ? contentCell : '']);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-gallery', cells });
  element.replaceWith(block);
}
