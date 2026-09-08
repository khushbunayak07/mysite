/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq. Base: accordion.
 * Source: https://wknd-trendsetters.site/
 * Structure: 2 columns; first row = block name; each subsequent row = one
 * accordion item [title cell, content cell].
 */
export default function parse(element, { document }) {
  // Each FAQ item is a <details> (fallback to generic accordion item classes)
  const items = element.querySelectorAll(
    ':scope > details.faq-item, :scope > details, :scope > .faq-item, :scope > .accordion-item'
  );

  const cells = [];

  items.forEach((item) => {
    // Title: prefer the inner text span (excludes the toggle icon image),
    // fall back to the summary/question element itself.
    const questionSpan = item.querySelector('summary span, .faq-question span');
    const summary = item.querySelector('summary, .faq-question');

    let titleContent;
    if (questionSpan) {
      titleContent = questionSpan;
    } else if (summary) {
      // Clone summary and strip icons/images so only the label text remains.
      titleContent = summary.cloneNode(true);
      titleContent.querySelectorAll('img, svg').forEach((el) => el.remove());
    }

    // Content: the answer body.
    const answer = item.querySelector('.faq-answer, .accordion-content, .faq-item > div:not(summary)');

    // Only add a row if we have at least a title.
    if (titleContent || answer) {
      cells.push([titleContent || '', answer || '']);
    }
  });

  // Empty-block guard: nothing extracted, unwrap in place.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
