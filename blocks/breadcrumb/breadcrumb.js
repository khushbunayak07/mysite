import { getMetadata } from '../../scripts/aem.js';

/**
 * Turns a URL path segment into a human label, e.g. `my-page` -> `My Page`.
 * @param {string} segment
 */
function segmentToLabel(segment) {
  return decodeURIComponent(segment)
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Builds the breadcrumb trail from the current page path:
 * Home -> each intermediate path segment -> the current page (no link).
 * @returns {{ text: string, link?: string }[]}
 */
function buildTrail() {
  const trail = [{ text: 'Home', link: '/' }];
  const segments = window.location.pathname.split('/').filter((s) => s);
  let path = '';
  segments.forEach((segment, i) => {
    path += `/${segment}`;
    const isLast = i === segments.length - 1;
    trail.push({
      text: isLast ? (getMetadata('og:title') || segmentToLabel(segment)) : segmentToLabel(segment),
      link: isLast ? undefined : path,
    });
  });
  return trail;
}

/**
 * Decorates the breadcrumb block.
 * @param {HTMLElement} block
 */
export default function decorate(block) {
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Breadcrumb');
  const ul = document.createElement('ul');
  nav.append(ul);

  buildTrail().forEach((step) => {
    const li = document.createElement('li');
    let wrap = li;
    if (step.link) {
      wrap = document.createElement('a');
      wrap.href = step.link;
      li.append(wrap);
    } else {
      li.setAttribute('aria-current', 'page');
    }
    const span = document.createElement('span');
    span.textContent = step.text;
    wrap.append(span);
    ul.append(li);
  });

  block.replaceChildren(nav);
}
