/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-wknd-trendsetters.js
  var import_wknd_trendsetters_exports = {};
  __export(import_wknd_trendsetters_exports, {
    default: () => import_wknd_trendsetters_default
  });

  // tools/importer/parsers/accordion-faq.js
  function parse(element, { document: document2 }) {
    const items = element.querySelectorAll(
      ":scope > details.faq-item, :scope > details, :scope > .faq-item, :scope > .accordion-item"
    );
    const cells = [];
    items.forEach((item) => {
      const questionSpan = item.querySelector("summary span, .faq-question span");
      const summary = item.querySelector("summary, .faq-question");
      let titleContent;
      if (questionSpan) {
        titleContent = questionSpan;
      } else if (summary) {
        titleContent = summary.cloneNode(true);
        titleContent.querySelectorAll("img, svg").forEach((el) => el.remove());
      }
      const answer = item.querySelector(".faq-answer, .accordion-content, .faq-item > div:not(summary)");
      if (titleContent || answer) {
        cells.push([titleContent || "", answer || ""]);
      }
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse2(element, { document: document2 }) {
    const cards = element.querySelectorAll(
      ":scope > a.article-card, :scope > .article-card, :scope > a.card-link"
    );
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector("img");
      const textContent = [];
      const meta = card.querySelector(".article-card-meta");
      if (meta) textContent.push(meta);
      const heading = card.querySelector('h1, h2, h3, h4, h5, h6, [class*="heading"]');
      const rawHref = card.getAttribute("href");
      const href = rawHref ? rawHref.replace(/#card-[a-z0-9-]+$/i, "") : rawHref;
      if (heading) {
        if (href) {
          const link = document2.createElement("a");
          link.href = href;
          link.textContent = heading.textContent.trim();
          heading.textContent = "";
          heading.appendChild(link);
        }
        textContent.push(heading);
      }
      if (img || textContent.length) {
        cells.push([img || "", textContent.length ? textContent : ""]);
      }
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-gallery.js
  function parse3(element, { document: document2 }) {
    const items = element.querySelectorAll(":scope > .utility-aspect-1x1, :scope > div");
    const cells = [];
    items.forEach((item) => {
      const img = item.matches("img") ? item : item.querySelector("img");
      if (!img) return;
      const textContent = [];
      const heading = item.querySelector('h1, h2, h3, h4, h5, h6, [class*="heading"]');
      if (heading) textContent.push(heading);
      const desc = item.querySelector("p");
      if (desc) textContent.push(desc);
      cells.push([img, textContent.length ? textContent : ""]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-gallery", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-contact.js
  function parse4(element, { document: document2 }) {
    const grid = element.querySelector(".grid-layout") || element;
    let columns = Array.from(grid.querySelectorAll(":scope > div"));
    if (columns.length === 0) {
      columns = Array.from(grid.children);
    }
    columns = columns.filter(
      (col) => col.textContent.trim() || col.querySelector("img")
    );
    if (columns.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [columns];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-contact", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-feature.js
  function parse5(element, { document: document2 }) {
    const grid = element.querySelector(".grid-layout") || element;
    let columns = Array.from(grid.querySelectorAll(":scope > div"));
    if (columns.length === 0) {
      columns = Array.from(grid.children);
    }
    columns = columns.filter((col) => col.textContent.trim() || col.querySelector("img"));
    if (columns.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [columns];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-article.js
  function parse6(element, { document: document2 }) {
    const coverImage = element.querySelector(
      'img.cover-image, [class*="cover-image"], img'
    );
    const breadcrumbs = element.querySelector(".breadcrumbs");
    const heading = element.querySelector('h1, h2, [class*="heading"]');
    const metaBlocks = Array.from(
      element.querySelectorAll(".flex-horizontal")
    );
    const tag = element.querySelector('.tag, [class*="tag"]');
    const cells = [];
    cells.push([coverImage || ""]);
    const contentCell = [];
    if (breadcrumbs) contentCell.push(breadcrumbs);
    if (heading) contentCell.push(heading);
    metaBlocks.forEach((block2) => contentCell.push(block2));
    if (tag) contentCell.push(tag);
    if (contentCell.length === 0 && !coverImage) {
      element.replaceWith(...element.childNodes);
      return;
    }
    cells.push([contentCell.length ? contentCell : ""]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-gallery.js
  function parse7(element, { document: document2 }) {
    const heading = element.querySelector('h1, h2, .h1-heading, [class*="heading"]');
    const subheading = element.querySelector(".subheading, p");
    const ctaLinks = Array.from(element.querySelectorAll(".button-group a, a.button"));
    const images = Array.from(element.querySelectorAll("img"));
    const cells = [];
    const imageCell = [];
    images.forEach((img) => imageCell.push(img));
    cells.push([imageCell.length ? imageCell : ""]);
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subheading) contentCell.push(subheading);
    contentCell.push(...ctaLinks);
    if (contentCell.length === 0 && imageCell.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    cells.push([contentCell.length ? contentCell : ""]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-gallery", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-overlay.js
  function parse8(element, { document: document2 }) {
    const bgImage = element.querySelector("img");
    const heading = element.querySelector('h1, h2, .h1-heading, [class*="heading"]');
    const subheading = element.querySelector(".subheading, p");
    const ctaLinks = Array.from(element.querySelectorAll(".button-group a, a.button"));
    const cells = [];
    cells.push([bgImage || ""]);
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subheading) contentCell.push(subheading);
    contentCell.push(...ctaLinks);
    if (contentCell.length === 0 && !bgImage) {
      element.replaceWith(...element.childNodes);
      return;
    }
    cells.push([contentCell.length ? contentCell : ""]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-overlay", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-support.js
  function parse9(element, { document: document2 }) {
    const bgImage = element.querySelector('img.cover-image, img[class*="cover"], img');
    const heading = element.querySelector('h1, h2, .h1-heading, [class*="heading"]');
    const subheading = element.querySelector(".subheading, p.subheading");
    const paragraphs = Array.from(element.querySelectorAll("p")).filter(
      (p) => p !== subheading
    );
    const ctaLinks = Array.from(element.querySelectorAll(".button-group a, a.button"));
    const cells = [];
    cells.push([bgImage || ""]);
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subheading) contentCell.push(subheading);
    contentCell.push(...paragraphs);
    contentCell.push(...ctaLinks);
    if (contentCell.length === 0 && !bgImage) {
      element.replaceWith(...element.childNodes);
      return;
    }
    cells.push([contentCell.length ? contentCell : ""]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-support", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-testimonial.js
  function parse10(element, { document: document2 }) {
    const panes = Array.from(element.querySelectorAll(".tabs-content > .tab-pane, .tab-pane"));
    const labels = Array.from(element.querySelectorAll(".tab-menu .tab-menu-link, .tab-menu-link"));
    const cells = [];
    panes.forEach((pane, i) => {
      const label = labels[i];
      let labelContent = "";
      if (label) {
        labelContent = label.querySelector(":scope > *") || label;
      }
      const contentInner = pane.querySelector(":scope > .grid-layout") || pane;
      cells.push([labelContent, contentInner]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "tabs-testimonial", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-trendsetters-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "a.skip-link",
        ".navbar",
        ".breadcrumbs"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "footer"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        [...el.attributes].forEach((attr) => {
          if (attr.name.startsWith("data-astro-cid")) {
            el.removeAttribute(attr.name);
          }
        });
      });
      const doc = payload && payload.document || element.ownerDocument;
      element.querySelectorAll("div.spec").forEach((spec) => {
        const table = doc.createElement("table");
        spec.querySelectorAll(":scope > div").forEach((row) => {
          const tr = doc.createElement("tr");
          row.querySelectorAll(":scope > div").forEach((cell) => {
            const td = doc.createElement("td");
            td.innerHTML = cell.innerHTML;
            tr.appendChild(td);
          });
          table.appendChild(tr);
        });
        spec.replaceWith(table);
      });
    }
  }

  // tools/importer/transformers/wknd-trendsetters-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function transform2(hookName, element, payload) {
    const sections = payload.template && payload.template.sections || [];
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        if (i === 0) {
          if (section.style) {
            const marker = document.createElement("hr");
            marker.setAttribute(SECTION_MARKER_ATTR, section.id);
            sectionEl.before(marker);
          }
          continue;
        }
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || element.querySelector(section.selector);
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/import-wknd-trendsetters.js
  var parsers = {
    "accordion-faq": parse,
    "cards-article": parse2,
    "cards-gallery": parse3,
    "columns-contact": parse4,
    "columns-feature": parse5,
    "hero-article": parse6,
    "hero-gallery": parse7,
    "hero-overlay": parse8,
    "hero-support": parse9,
    "tabs-testimonial": parse10
  };
  var PAGE_TEMPLATES = [
    {
      name: "landing-page",
      urls: [
        "https://wknd-trendsetters.site/",
        "https://wknd-trendsetters.site/fashion-trends-of-the-season",
        "https://wknd-trendsetters.site/fashion-trends-young-adults"
      ],
      blocks: [
        { name: "hero-gallery", instances: ["#main-content > header.section.secondary-section"] },
        { name: "columns-feature", instances: ["#main-content > section.section:nth-of-type(1)"] },
        { name: "cards-gallery", instances: ["#main-content > section.section.secondary-section:nth-of-type(2) .grid-layout.grid-gap-sm"] },
        { name: "tabs-testimonial", instances: ["#main-content > section.section:nth-of-type(3) .tabs-wrapper"] },
        { name: "cards-article", instances: ["#main-content > section.section.secondary-section:nth-of-type(4) .grid-layout.grid-gap-md"] },
        { name: "accordion-faq", instances: ["#main-content > section.section:nth-of-type(5) .faq-list"] },
        { name: "hero-overlay", instances: ["#main-content > section.section.inverse-section"] }
      ],
      sections: [
        { id: "section-1", name: "Hero", selector: "#main-content > header.section.secondary-section", style: "grey", blocks: ["hero-gallery"], defaultContent: [] },
        { id: "section-2", name: "Featured case study", selector: "#main-content > section.section:nth-of-type(1)", style: "light", blocks: ["columns-feature"], defaultContent: [] },
        { id: "section-3", name: "Gallery", selector: "#main-content > section.section.secondary-section:nth-of-type(2)", style: "grey", blocks: ["cards-gallery"], defaultContent: ["#main-content > section.section.secondary-section:nth-of-type(2) .utility-text-align-center"] },
        { id: "section-4", name: "Testimonials", selector: "#main-content > section.section:nth-of-type(3)", style: "light", blocks: ["tabs-testimonial"], defaultContent: [] },
        { id: "section-5", name: "Latest articles", selector: "#main-content > section.section.secondary-section:nth-of-type(4)", style: "grey", blocks: ["cards-article"], defaultContent: ["#main-content > section.section.secondary-section:nth-of-type(4) .utility-text-align-center"] },
        { id: "section-6", name: "FAQ", selector: "#main-content > section.section:nth-of-type(5)", style: "light", blocks: ["accordion-faq"], defaultContent: [] },
        { id: "section-7", name: "Closing CTA", selector: "#main-content > section.section.inverse-section", style: "dark", blocks: ["hero-overlay"], defaultContent: [] }
      ]
    },
    {
      name: "content-listing",
      urls: [
        "https://wknd-trendsetters.site/blog",
        "https://wknd-trendsetters.site/case-studies",
        "https://wknd-trendsetters.site/fashion-insights"
      ],
      blocks: [
        { name: "columns-feature", instances: ["#main-content > section.section:nth-of-type(1)"] },
        { name: "cards-article", instances: ["#articles .grid-layout.grid-gap-md"] }
      ],
      sections: [
        { id: "section-1", name: "Blog hero header", selector: "#main-content > header.section.secondary-section", style: "grey", blocks: [], defaultContent: ["#main-content > header.section.secondary-section"] },
        { id: "section-2", name: "Featured teaser", selector: "#main-content > section.section:nth-of-type(1)", style: "light", blocks: ["columns-feature"], defaultContent: [] },
        { id: "section-3", name: "Latest articles", selector: "#articles", style: "grey", blocks: ["cards-article"], defaultContent: ["#articles .utility-text-align-center"] },
        { id: "section-4", name: "Subscribe CTA", selector: "#main-content > section.section.accent-section", style: "accent", blocks: [], defaultContent: ["#main-content > section.section.accent-section"] }
      ]
    },
    {
      name: "blog-article",
      urls: [
        "https://wknd-trendsetters.site/blog/ace-pro-court-polo",
        "https://wknd-trendsetters.site/blog/fashion-blog-post",
        "https://wknd-trendsetters.site/blog/fashion-trends-young-culture",
        "https://wknd-trendsetters.site/blog/fashion-trends-young-style",
        "https://wknd-trendsetters.site/blog/flip-flop-summer-style",
        "https://wknd-trendsetters.site/blog/latest-trends-young-casual-fashion",
        "https://wknd-trendsetters.site/blog/street-style-trends"
      ],
      blocks: [
        { name: "hero-article", instances: ["#main-content > section.section:nth-of-type(1)"] }
      ],
      sections: [
        { id: "section-1", name: "Article masthead", selector: "#main-content > section.section:nth-of-type(1)", style: "light", blocks: ["hero-article"], defaultContent: [] },
        { id: "section-2", name: "Article body", selector: "#main-content > section.section:nth-of-type(2)", style: null, blocks: [], defaultContent: ["#main-content > section.section:nth-of-type(2)"] }
      ]
    },
    {
      name: "faq-page",
      urls: ["https://wknd-trendsetters.site/faq"],
      blocks: [
        { name: "hero-support", instances: ["#main-content > header.section.secondary-section"] },
        { name: "accordion-faq", instances: ["#main-content > section.section:nth-of-type(1) .faq-list"] },
        { name: "columns-contact", instances: ["#main-content > section.section.secondary-section .grid-layout.grid-gap-xxl"] }
      ],
      sections: [
        { id: "section-1", name: "FAQ hero", selector: "#main-content > header.section.secondary-section", style: "grey", blocks: ["hero-support"], defaultContent: [] },
        { id: "section-2", name: "FAQ accordion", selector: "#main-content > section.section:nth-of-type(1)", style: "light", blocks: ["accordion-faq"], defaultContent: [] },
        { id: "section-3", name: "Contact", selector: "#main-content > section.section.secondary-section", style: "grey", blocks: ["columns-contact"], defaultContent: [] },
        { id: "section-4", name: "Closing CTA", selector: "#main-content > section.section.accent-section", style: "accent", blocks: [], defaultContent: ["#main-content > section.section.accent-section"] }
      ]
    },
    {
      name: "category-grid",
      urls: ["https://wknd-trendsetters.site/fashion-trends-young-adults-casual-sport"],
      blocks: [
        { name: "hero-gallery", instances: ["#main-content > header.section.secondary-section"] },
        { name: "cards-article", instances: ["#trends .grid-layout.grid-gap-md"] },
        { name: "columns-feature", instances: ["#main-content > section.section.secondary-section"] }
      ],
      sections: [
        { id: "section-1", name: "Hero header", selector: "#main-content > header.section.secondary-section", style: "grey", blocks: ["hero-gallery"], defaultContent: [] },
        { id: "section-2", name: "Trend grid", selector: "#trends", style: "light", blocks: ["cards-article"], defaultContent: ["#trends .utility-text-align-center"] },
        { id: "section-3", name: "Feature callout", selector: "#main-content > section.section.secondary-section", style: "grey", blocks: ["columns-feature"], defaultContent: [] },
        { id: "section-4", name: "Subscribe CTA", selector: "#main-content > section.section.accent-section", style: "accent", blocks: [], defaultContent: ["#main-content > section.section.accent-section"] }
      ]
    }
  ];
  var transformers = [transform, transform2];
  function resolveTemplate(url, originalURL) {
    const candidates = [url, originalURL].filter(Boolean);
    for (const tmpl of PAGE_TEMPLATES) {
      for (const c of candidates) {
        if (tmpl.urls.includes(c)) return tmpl;
        try {
          const p = new URL(c).pathname.replace(/\/$/, "") || "/";
          if (tmpl.urls.some((u) => (new URL(u).pathname.replace(/\/$/, "") || "/") === p)) return tmpl;
        } catch (e) {
        }
      }
    }
    return null;
  }
  function executeTransformers(hookName, element, payload, template) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template });
    transformers.forEach((transformerFn) => {
      if (transformerFn === transform2 && !(template.sections && template.sections.length > 1)) return;
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        elements.forEach((element) => {
          pageBlocks.push({ name: blockDef.name, selector, element, section: blockDef.section || null });
        });
      });
    });
    return pageBlocks;
  }
  var import_wknd_trendsetters_default = {
    transform: (payload) => {
      const { document: document2, url, params } = payload;
      const template = resolveTemplate(url, params && params.originalURL);
      if (!template) {
        console.warn(`No template matched for ${url} \u2014 importing as default content only`);
      }
      const main = document2.body;
      const tmpl = template || { name: "unknown", blocks: [], sections: [] };
      executeTransformers("beforeTransform", main, payload, tmpl);
      const pageBlocks = findBlocksOnPage(document2, tmpl);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload, tmpl);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: tmpl.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_wknd_trendsetters_exports);
})();
