import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * True when `value` is a colour the browser understands
 * (hex, rgb()/hsl(), or a named keyword like `blue`).
 * @param {string} value
 */
function isColor(value) {
  return !!value && CSS.supports('background-color', value);
}

/**
 * Decorates the Banner block.
 *
 * Authored as a single-column (or single-row) block with, in any order:
 *   - an image
 *   - a title (heading or plain text)
 *   - an optional background colour (hex/rgb/keyword)
 *
 * When the author omits the colour the CSS default applies: blue for the
 * base block, a dark theme for the `banner (dark)` variant. An explicit
 * author colour always wins, in either variant.
 *
 * Cells may be omitted or rearranged, so content is identified by shape
 * rather than by position.
 * @param {Element} block
 */
export default function decorate(block) {
  // Flatten to leaf cells so both "one cell per row" and "one row, many
  // cells" authoring layouts are handled the same way.
  const cells = [...block.children].flatMap((row) => (
    row.children.length ? [...row.children] : [row]
  ));

  const picture = block.querySelector('picture');
  const textCells = cells.filter(
    (cell) => !cell.querySelector('picture') && cell.textContent.trim(),
  );

  // Only treat a cell as the background colour when it is not the sole text
  // cell, so a one-word title (e.g. "Red") is never mistaken for a colour.
  let colorCell;
  if (textCells.length > 1) {
    colorCell = textCells.find((cell) => isColor(cell.textContent.trim()));
  }
  const bgColor = colorCell?.textContent.trim();
  const [titleCell] = textCells.filter((cell) => cell !== colorCell);

  const image = document.createElement('div');
  image.className = 'banner-image';
  if (picture) {
    const img = picture.querySelector('img');
    image.append(createOptimizedPicture(img.src, img.alt, false, [{ width: '2000' }]));
  }

  const content = document.createElement('div');
  content.className = 'banner-content';
  if (titleCell) {
    let title = titleCell.querySelector('h1, h2, h3, h4, h5, h6');
    if (!title) {
      title = document.createElement('h2');
      title.textContent = titleCell.textContent.trim();
    }
    title.classList.add('banner-title');
    content.append(title);
  }

  block.replaceChildren(image, content);
  // Set the colour only when authored; the per-variant default lives in CSS
  // (as the `--banner-bg` fallback) so the `dark` variant can theme it.
  if (bgColor) block.style.setProperty('--banner-bg', bgColor);
}
