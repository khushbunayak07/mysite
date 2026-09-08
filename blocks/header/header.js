// media query match that indicates desktop width
const isDesktop = window.matchMedia('(min-width: 900px)');

/**
 * Fetch the nav fragment. Metadata-independent dual-fetch:
 * /content first (localhost / aem up), then root (DA/EDS production).
 */
async function fetchNav() {
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) resp = await fetch('/nav.plain.html');
  if (!resp.ok) return null;
  const html = await resp.text();
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp;
}

/**
 * Close every open nav dropdown/megamenu in the given scope.
 */
function closeAllDrops(scope, except) {
  if (!scope) return;
  scope.querySelectorAll('.nav-drop[aria-expanded="true"]').forEach((drop) => {
    if (drop !== except) drop.setAttribute('aria-expanded', 'false');
  });
}

/**
 * Wire a top-level section that owns a panel (megamenu or simple dropdown).
 * Generic — works for any section that has a nested panel.
 */
function decorateDrop(li) {
  const panel = li.querySelector(':scope > ul');
  if (!panel) return;
  li.classList.add('nav-drop');
  li.setAttribute('aria-expanded', 'false');

  // Replace the leading text label with a span for styling/handlers.
  const label = li.firstChild;
  if (label && label.nodeType === Node.TEXT_NODE && label.textContent.trim()) {
    const span = document.createElement('span');
    span.className = 'nav-drop-label';
    span.textContent = label.textContent.trim();
    li.replaceChild(span, label);
  }

  // Desktop: open on hover.
  li.addEventListener('mouseenter', () => {
    if (isDesktop.matches) {
      closeAllDrops(li.closest('.nav-sections'), li);
      li.setAttribute('aria-expanded', 'true');
    }
  });
  li.addEventListener('mouseleave', () => {
    if (isDesktop.matches) li.setAttribute('aria-expanded', 'false');
  });

  // Click on the label toggles (works on desktop and mobile).
  const labelEl = li.querySelector(':scope > .nav-drop-label');
  if (labelEl) {
    labelEl.addEventListener('click', (e) => {
      e.stopPropagation();
      const expanded = li.getAttribute('aria-expanded') === 'true';
      closeAllDrops(li.closest('.nav-sections'), li);
      li.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    });
  }
}

function toggleMenu(nav, expanded) {
  nav.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  document.body.classList.toggle('nav-open', expanded);
  const btn = nav.querySelector('.nav-hamburger button');
  if (btn) btn.setAttribute('aria-label', expanded ? 'Close navigation' : 'Open navigation');
}

/**
 * Reset nav state when crossing the desktop/mobile breakpoint.
 */
function handleBreakpointChange(nav) {
  closeAllDrops(nav.querySelector('.nav-sections'));
  toggleMenu(nav, false);
}

/**
 * Loads and decorates the header nav.
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const fragment = await fetchNav();
  block.textContent = '';

  const nav = document.createElement('nav');
  nav.id = 'nav';
  if (fragment) {
    while (fragment.firstElementChild) nav.append(fragment.firstElementChild);
  }

  // The three EDS nav sections: brand, sections, tools.
  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  // Brand: tag the logo link.
  const navBrand = nav.querySelector('.nav-brand');
  if (navBrand) {
    const brandLink = navBrand.querySelector('a');
    if (brandLink) brandLink.classList.add('nav-brand-link');
  }

  // Sections: wire every top-level item that owns a panel.
  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    navSections.querySelectorAll(':scope > ul > li').forEach((li) => decorateDrop(li));
  }

  // Tools: style the links as CTA buttons.
  const navTools = nav.querySelector('.nav-tools');
  if (navTools) {
    navTools.querySelectorAll('a').forEach((a) => a.classList.add('nav-cta'));
  }

  // Hamburger (mobile).
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => {
    const expanded = nav.getAttribute('aria-expanded') === 'true';
    toggleMenu(nav, !expanded);
  });
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');

  // Close open desktop dropdowns on outside click.
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && isDesktop.matches) closeAllDrops(nav);
  });
  // Escape closes menus.
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') {
      closeAllDrops(nav);
      if (!isDesktop.matches) toggleMenu(nav, false);
    }
  });

  // Reset state when crossing the breakpoint (no page refresh).
  isDesktop.addEventListener('change', () => handleBreakpointChange(nav));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
