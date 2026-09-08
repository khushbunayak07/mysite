/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-testimonial. Base: tabs.
 * Source: https://wknd-trendsetters.site/
 * Structure: 2 columns; first row = block name; each subsequent row = one tab
 * [tab label cell, tab content cell]. Labels come from the tab menu buttons,
 * content from the matching tab panes (paired by order).
 */
export default function parse(element, { document }) {
  const panes = Array.from(element.querySelectorAll('.tabs-content > .tab-pane, .tab-pane'));
  const labels = Array.from(element.querySelectorAll('.tab-menu .tab-menu-link, .tab-menu-link'));

  const cells = [];

  panes.forEach((pane, i) => {
    const label = labels[i];

    // Label cell: prefer the menu button's inner content (avatar + name + role).
    // Fall back to a text label derived from the pane.
    let labelContent = '';
    if (label) {
      labelContent = label.querySelector(':scope > *') || label;
    }

    // Content cell: the pane's inner content (image + name/role + quote).
    const contentInner = pane.querySelector(':scope > .grid-layout') || pane;

    cells.push([labelContent, contentInner]);
  });

  // Empty-block guard.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-testimonial', cells });
  element.replaceWith(block);
}
