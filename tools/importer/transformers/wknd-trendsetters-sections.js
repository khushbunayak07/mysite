/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND Trendsetters section breaks and Section Metadata.
 * Adds an <hr> before each non-first section and a Section Metadata block
 * for every section that declares a style, using payload.template.sections.
 *
 * Uses BOTH hooks. Breaks are inserted in beforeTransform (while every
 * section element still exists — block parsers replace section elements
 * between the hooks). A temporary marker attribute on each inserted <hr>
 * gives a stable anchor for the metadata block placed in afterTransform.
 * Selectors come from page-templates.json (DOM-verified section boundaries).
 */
const SECTION_MARKER_ATTR = 'data-excat-section-id';

export default function transform(hookName, element, payload) {
  const sections = (payload.template && payload.template.sections) || [];

  if (hookName === 'beforeTransform') {
    // Insert breaks now, before parsers can replace any section element.
    // Reverse order: inserting relative to a live element only affects nodes
    // after it, so unprocessed sections stay where querySelector found them.
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      // First section: no leading break, but still marked so its metadata
      // block has a stable anchor after parsers run.
      const sectionEl = element.querySelector(section.selector);
      if (!sectionEl) continue; // selector didn't match on this page — skip, never guess

      if (i === 0) {
        if (section.style) {
          const marker = document.createElement('hr');
          marker.setAttribute(SECTION_MARKER_ATTR, section.id);
          sectionEl.before(marker);
        }
        continue;
      }

      const hr = document.createElement('hr');
      if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
      sectionEl.before(hr);
    }
  }

  if (hookName === 'afterTransform') {
    // Parsers have run and may have replaced section elements. Anchor each
    // styled section's Section Metadata block to whichever still exists: the
    // marker <hr>, or the original element if it survived.
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (!section.style) continue;

      const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
      const anchor = marker || element.querySelector(section.selector);
      if (!anchor) continue; // neither survived — skip, never guess

      const metadataBlock = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      anchor.after(metadataBlock);

      if (marker) {
        marker.removeAttribute(SECTION_MARKER_ATTR);
        if (i === 0) marker.remove(); // section 0 never gets a real leading break
      }
    }
  }
}
