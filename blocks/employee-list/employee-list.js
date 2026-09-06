import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Employee List block.
 *
 * Renders employees from a published DA/EDS sheet, one "page" at a time,
 * with a "Load more" button that fetches the next page until the sheet is
 * exhausted. Pagination uses the sheet's own `?limit=&offset=` support, so
 * only the rows on screen are ever transferred.
 *
 * Authoring (single cell holds the sheet path; an optional second cell sets
 * the page size):
 *
 *   | Employee List |
 *   | /employees    |
 *
 *   | Employee List |
 *   | /employees  3 |   ← page size of 3 (default is 6)
 *
 * The path may be plain text or a link; `.json` is appended automatically.
 * Expected (case-insensitive) sheet columns, all optional: Name, Title,
 * Department, Email, Image.
 * @param {Element} block
 */

const DEFAULT_PAGE_SIZE = 6;

/** Read a value from a sheet row by header name, case-insensitively. */
function field(row, name) {
  const key = Object.keys(row).find((k) => k.toLowerCase() === name.toLowerCase());
  return key ? String(row[key]).trim() : '';
}

/** Build the card element for a single employee record. */
function renderEmployee(row) {
  const li = document.createElement('li');
  li.className = 'employee-list-item';

  const image = field(row, 'image');
  if (image) {
    const picture = createOptimizedPicture(
      image,
      field(row, 'name') || 'Employee photo',
      false,
      [{ width: '200' }],
    );
    picture.classList.add('employee-list-photo');
    li.append(picture);
  }

  const body = document.createElement('div');
  body.className = 'employee-list-body';

  const name = field(row, 'name');
  if (name) {
    const el = document.createElement('p');
    el.className = 'employee-list-name';
    el.textContent = name;
    body.append(el);
  }

  const title = field(row, 'title');
  if (title) {
    const el = document.createElement('p');
    el.className = 'employee-list-title';
    el.textContent = title;
    body.append(el);
  }

  const department = field(row, 'department');
  if (department) {
    const el = document.createElement('p');
    el.className = 'employee-list-department';
    el.textContent = department;
    body.append(el);
  }

  const email = field(row, 'email');
  if (email) {
    const link = document.createElement('a');
    link.className = 'employee-list-email';
    link.href = `mailto:${email}`;
    link.textContent = email;
    body.append(link);
  }

  li.append(body);
  return li;
}

export default async function decorate(block) {
  // Resolve the sheet path (link href wins over plain text) and page size.
  const link = block.querySelector('a');
  const text = block.textContent.trim();
  let sheetPath = (link ? link.getAttribute('href') : text).trim();
  const sizeMatch = text.match(/\b(\d+)\b\s*$/);
  const pageSize = sizeMatch ? parseInt(sizeMatch[1], 10) : DEFAULT_PAGE_SIZE;

  // Normalise: absolute paths only, without the `.json` suffix.
  try {
    sheetPath = new URL(sheetPath).pathname;
  } catch (e) {
    // already a path
  }
  sheetPath = sheetPath.replace(/\.json$/, '').replace(/\/+$/, '');
  if (!sheetPath.startsWith('/')) sheetPath = `/${sheetPath}`;

  const list = document.createElement('ul');
  list.className = 'employee-list-items';

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'employee-list-more';
  button.textContent = 'Load more';

  const status = document.createElement('p');
  status.className = 'employee-list-status';
  status.setAttribute('aria-live', 'polite');

  block.replaceChildren(list, status, button);

  let offset = 0;

  const loadPage = async () => {
    button.disabled = true;
    try {
      const resp = await fetch(`${sheetPath}.json?limit=${pageSize}&offset=${offset}`);
      if (!resp.ok) throw new Error(`${resp.status} ${resp.statusText}`);
      const json = await resp.json();
      const rows = json.data || [];
      const total = Number(json.total ?? rows.length);

      rows.forEach((row) => list.append(renderEmployee(row)));
      offset += rows.length;

      if (offset >= total || rows.length === 0) {
        button.remove();
        status.textContent = list.children.length
          ? `Showing all ${list.children.length} employees.`
          : 'No employees found.';
      } else {
        status.textContent = `Showing ${offset} of ${total} employees.`;
        button.disabled = false;
      }
    } catch (error) {
      button.disabled = false;
      status.textContent = 'Could not load employees. Please try again.';
      // eslint-disable-next-line no-console
      console.error('Employee List: failed to load sheet', sheetPath, error);
    }
  };

  button.addEventListener('click', loadPage);
  await loadPage();
}
