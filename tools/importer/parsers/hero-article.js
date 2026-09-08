/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-article. Base: hero.
 * Source: https://wknd-trendsetters.site/blog/ace-pro-court-polo
 * Structure: 1 column, 3 rows. Row 1 = block name; row 2 = cover image;
 * row 3 = article masthead content (breadcrumbs, title, byline, date, tag).
 * Light background, no CTAs.
 */
export default function parse(element, { document }) {
  // Cover / lead image (row 2).
  const coverImage = element.querySelector(
    'img.cover-image, [class*="cover-image"], img',
  );

  // Masthead text content (row 3).
  const breadcrumbs = element.querySelector('.breadcrumbs');
  const heading = element.querySelector('h1, h2, [class*="heading"]');
  // Byline / date / read-time blocks — direct text wrappers under the content column.
  const metaBlocks = Array.from(
    element.querySelectorAll('.flex-horizontal'),
  );
  const tag = element.querySelector('.tag, [class*="tag"]');

  const cells = [];

  // Row 2: cover image (optional).
  cells.push([coverImage || '']);

  // Row 3: title, meta, tag.
  const contentCell = [];
  if (breadcrumbs) contentCell.push(breadcrumbs);
  if (heading) contentCell.push(heading);
  metaBlocks.forEach((block) => contentCell.push(block));
  if (tag) contentCell.push(tag);

  // Empty-block guard.
  if (contentCell.length === 0 && !coverImage) {
    element.replaceWith(...element.childNodes);
    return;
  }

  cells.push([contentCell.length ? contentCell : '']);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-article', cells });
  element.replaceWith(block);
}
