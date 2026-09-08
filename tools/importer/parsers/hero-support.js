/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-support. Base: hero.
 * Source: https://wknd-trendsetters.site/faq
 * Structure: 1 column, 3 rows. Row 1 = block name; row 2 = cover/background image;
 * row 3 = title (H1), subheading and intro paragraph. This FAQ hero has no CTAs.
 */
export default function parse(element, { document }) {
  // Background/cover image (optional).
  const bgImage = element.querySelector('img.cover-image, img[class*="cover"], img');

  // Title heading.
  const heading = element.querySelector('h1, h2, .h1-heading, [class*="heading"]');

  // Subheading (styled emphasis paragraph) and intro paragraph(s).
  const subheading = element.querySelector('.subheading, p.subheading');

  // All paragraphs, excluding the subheading, become intro copy.
  const paragraphs = Array.from(element.querySelectorAll('p')).filter(
    (p) => p !== subheading,
  );

  // Optional CTA links (none expected here, but handle the variation).
  const ctaLinks = Array.from(element.querySelectorAll('.button-group a, a.button'));

  const cells = [];

  // Row 2: background/cover image.
  cells.push([bgImage || '']);

  // Row 3: text content group.
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  contentCell.push(...paragraphs);
  contentCell.push(...ctaLinks);

  // Empty-block guard.
  if (contentCell.length === 0 && !bgImage) {
    element.replaceWith(...element.childNodes);
    return;
  }

  cells.push([contentCell.length ? contentCell : '']);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-support', cells });
  element.replaceWith(block);
}
