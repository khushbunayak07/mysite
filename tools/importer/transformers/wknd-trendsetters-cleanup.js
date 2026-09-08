/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND Trendsetters site-wide cleanup.
 * Removes non-authorable site chrome and strips build-tool attributes.
 * All selectors verified against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Non-authorable navigation chrome removed before block parsing so it is
    // never pulled into a block's cells.
    // Found in cleaned.html: <a href="#main-content" class="skip-link">
    // Found in cleaned.html: <div class="navbar"> (logo, nav-menu, mega-menu, mobile toggle)
    // Found in cleaned.html: <div class="breadcrumbs"> inside the featured case-study section
    WebImporter.DOMUtils.remove(element, [
      'a.skip-link',
      '.navbar',
      '.breadcrumbs',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable site footer.
    // Found in cleaned.html: <footer class="footer inverse-footer">
    WebImporter.DOMUtils.remove(element, [
      'footer',
    ]);

    // Strip Astro build-tool attributes present throughout cleaned.html
    // (e.g. data-astro-cid-37fxchfa, data-astro-cid-rbygaycu).
    element.querySelectorAll('*').forEach((el) => {
      [...el.attributes].forEach((attr) => {
        if (attr.name.startsWith('data-astro-cid')) {
          el.removeAttribute(attr.name);
        }
      });
    });

    // The source is itself an EDS site: article bodies embed a native
    // ".spec" key-value block that has no counterpart block in this project
    // (it would 404 at runtime). It is genuine default content, so convert
    // each ".spec" grid into a plain 2-column <table> that renders as-is.
    const doc = (payload && payload.document) || element.ownerDocument;
    element.querySelectorAll('div.spec').forEach((spec) => {
      const table = doc.createElement('table');
      spec.querySelectorAll(':scope > div').forEach((row) => {
        const tr = doc.createElement('tr');
        row.querySelectorAll(':scope > div').forEach((cell) => {
          const td = doc.createElement('td');
          td.innerHTML = cell.innerHTML;
          tr.appendChild(td);
        });
        table.appendChild(tr);
      });
      spec.replaceWith(table);
    });
  }
}
