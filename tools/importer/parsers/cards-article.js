/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-article. Base: cards.
 * Source: https://wknd-trendsetters.site/
 * Structure: 2 columns; first row = block name; each subsequent row = one card
 * [image cell, text-content cell]. Text cell holds meta, heading and a CTA link.
 */
export default function parse(element, { document }) {
  // Each card is an anchor with the article-card class (with fallbacks).
  const cards = element.querySelectorAll(
    ':scope > a.article-card, :scope > .article-card, :scope > a.card-link'
  );

  const cells = [];

  cards.forEach((card) => {
    // Image cell: the card cover image.
    const img = card.querySelector('img');

    // Text cell: collect meta and the heading. The whole card is a link, so
    // wrap the heading text in an anchor to preserve the destination without
    // duplicating the text.
    const textContent = [];
    const meta = card.querySelector('.article-card-meta');
    if (meta) textContent.push(meta);
    const heading = card.querySelector('h1, h2, h3, h4, h5, h6, [class*="heading"]');
    // Strip any synthetic "#card-<slug>" disambiguation fragment added to the
    // scrape snapshot so identical-href cards survive html2md's anchor dedup.
    // The real destination is the href without that fragment.
    const rawHref = card.getAttribute('href');
    const href = rawHref ? rawHref.replace(/#card-[a-z0-9-]+$/i, '') : rawHref;
    if (heading) {
      if (href) {
        const link = document.createElement('a');
        link.href = href;
        link.textContent = heading.textContent.trim();
        heading.textContent = '';
        heading.appendChild(link);
      }
      textContent.push(heading);
    }

    if (img || textContent.length) {
      cells.push([img || '', textContent.length ? textContent : '']);
    }
  });

  // Empty-block guard.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
