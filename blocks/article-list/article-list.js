import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Article List block — an index-driven, dynamic list.
 *
 * Reads the site's query index (default `/query-index.json`) and renders one
 * card per row. Because the index is regenerated on publish, publishing a new
 * page makes it appear here automatically — no code change required.
 *
 * Authoring (all cells optional):
 *
 *   | Article List |            ← lists every indexed page
 *
 *   | Article List      |
 *   | /query-index.json |       ← explicit index source
 *   | /blog/            |       ← optional: only paths starting with this
 *
 * The pipeline adds a `path` field to every index row; other fields depend on
 * the index config (this project indexes title, description, image, tags,
 * template, lastModified).
 * @param {Element} block
 */

const DEFAULT_SOURCE = '/query-index.json';

/** Read a value from an index row by key, case-insensitively. */
function field(row, name) {
  const key = Object.keys(row).find((k) => k.toLowerCase() === name.toLowerCase());
  return key ? String(row[key]).trim() : '';
}

/** Build the card element for a single index row. */
function renderArticle(row) {
  const path = field(row, 'path');
  const li = document.createElement('li');
  li.className = 'article-list-item';

  const link = document.createElement('a');
  link.className = 'article-list-link';
  link.href = path || '#';

  const image = field(row, 'image');
  if (image) {
    const picture = createOptimizedPicture(
      image,
      field(row, 'title') || 'Article image',
      false,
      [{ width: '750' }],
    );
    picture.classList.add('article-list-image');
    link.append(picture);
  }

  const body = document.createElement('div');
  body.className = 'article-list-body';

  const title = field(row, 'title') || path;
  if (title) {
    const el = document.createElement('h3');
    el.className = 'article-list-title';
    el.textContent = title;
    body.append(el);
  }

  const description = field(row, 'description');
  if (description) {
    const el = document.createElement('p');
    el.className = 'article-list-description';
    el.textContent = description;
    body.append(el);
  }

  link.append(body);
  li.append(link);
  return li;
}

export default async function decorate(block) {
  // Config rows: first non-empty cell is the source, an optional second is a
  // path prefix filter.
  const rows = [...block.children]
    .map((row) => {
      const a = row.querySelector('a');
      return (a ? a.getAttribute('href') : row.textContent).trim();
    })
    .filter(Boolean);

  let source = rows[0] || DEFAULT_SOURCE;
  const prefix = rows[1] || '';

  // Normalise the source to an absolute `*.json` path.
  try {
    source = new URL(source).pathname;
  } catch (e) {
    // already a path
  }
  if (!source.startsWith('/')) source = `/${source}`;
  if (!source.endsWith('.json')) source = `${source.replace(/\/+$/, '')}/query-index.json`;

  const list = document.createElement('ul');
  list.className = 'article-list-items';

  const status = document.createElement('p');
  status.className = 'article-list-status';
  status.setAttribute('aria-live', 'polite');
  status.textContent = 'Loading…';

  block.replaceChildren(list, status);

  try {
    const resp = await fetch(source);
    if (!resp.ok) throw new Error(`${resp.status} ${resp.statusText}`);
    const json = await resp.json();

    let data = json.data || [];
    if (prefix) data = data.filter((row) => field(row, 'path').startsWith(prefix));

    // Newest first when the index exposes a timestamp.
    data.sort((a, b) => Number(field(b, 'lastModified')) - Number(field(a, 'lastModified')));

    if (data.length === 0) {
      status.textContent = 'No pages found.';
      return;
    }

    data.forEach((row) => list.append(renderArticle(row)));
    status.remove();
  } catch (error) {
    status.textContent = 'Could not load the list. Please try again.';
    // eslint-disable-next-line no-console
    console.error('Article List: failed to load index', source, error);
  }
}
