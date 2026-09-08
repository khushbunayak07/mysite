/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-feature. Base: columns.
 * Source: https://wknd-trendsetters.site/
 * Structure: first row = block name; second row = one row with as many columns
 * as the visual layout. Here: 2 columns (image | text content group).
 */
export default function parse(element, { document }) {
  // The grid holds the columns; fall back to the element itself.
  const grid = element.querySelector('.grid-layout') || element;

  // Each direct child div of the grid becomes a column.
  let columns = Array.from(grid.querySelectorAll(':scope > div'));

  // Fallback: if no direct div children, use the grid's children.
  if (columns.length === 0) {
    columns = Array.from(grid.children);
  }

  // Filter out empty columns.
  columns = columns.filter((col) => col.textContent.trim() || col.querySelector('img'));

  // Empty-block guard.
  if (columns.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [columns];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-feature', cells });
  element.replaceWith(block);
}
