/**
 * Note / Alert block — adapted from kronnox/extra-block-collection (Block Party):
 * https://github.com/kronnox/extra-block-collection/tree/main/blocks/note
 *
 * Adapted for this project: the original loaded SVG icons via `decorateIcons`
 * and relied on `--color-*` design tokens. This version is self-contained —
 * the status glyph is provided by CSS, and colours live in note.css.
 *
 * Variants (block classes): `warning` | `error` | `success` (default: info).
 * Modifiers: `no-icon`, `accent-border`.
 * @param {Element} block
 */
export default function decorate(block) {
  // Turn an authored heading into the note's bold heading line.
  block.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((oldHeading) => {
    const heading = document.createElement('p');
    heading.className = 'note-heading';
    heading.textContent = oldHeading.textContent;
    oldHeading.replaceWith(heading);
  });

  // Group the authored content so it stacks beside the icon regardless of
  // how many cells/rows the author used.
  const body = document.createElement('div');
  body.className = 'note-body';
  body.append(...block.children);
  block.append(body);

  // Decorative status icon; the glyph per variant comes from CSS.
  if (!block.classList.contains('no-icon')) {
    const icon = document.createElement('span');
    icon.className = 'note-icon';
    icon.setAttribute('aria-hidden', 'true');
    block.prepend(icon);
  }
}
