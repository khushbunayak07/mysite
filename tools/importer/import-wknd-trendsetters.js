/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import accordionFaqParser from './parsers/accordion-faq.js';
import cardsArticleParser from './parsers/cards-article.js';
import cardsGalleryParser from './parsers/cards-gallery.js';
import columnsContactParser from './parsers/columns-contact.js';
import columnsFeatureParser from './parsers/columns-feature.js';
import heroArticleParser from './parsers/hero-article.js';
import heroGalleryParser from './parsers/hero-gallery.js';
import heroOverlayParser from './parsers/hero-overlay.js';
import heroSupportParser from './parsers/hero-support.js';
import tabsTestimonialParser from './parsers/tabs-testimonial.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-trendsetters-cleanup.js';
import sectionsTransformer from './transformers/wknd-trendsetters-sections.js';

// PARSER REGISTRY
const parsers = {
  'accordion-faq': accordionFaqParser,
  'cards-article': cardsArticleParser,
  'cards-gallery': cardsGalleryParser,
  'columns-contact': columnsContactParser,
  'columns-feature': columnsFeatureParser,
  'hero-article': heroArticleParser,
  'hero-gallery': heroGalleryParser,
  'hero-overlay': heroOverlayParser,
  'hero-support': heroSupportParser,
  'tabs-testimonial': tabsTestimonialParser,
};

// ALL PAGE TEMPLATES — embedded from page-templates.json
const PAGE_TEMPLATES = [
  {
    name: 'landing-page',
    urls: [
      'https://wknd-trendsetters.site/',
      'https://wknd-trendsetters.site/fashion-trends-of-the-season',
      'https://wknd-trendsetters.site/fashion-trends-young-adults',
    ],
    blocks: [
      { name: 'hero-gallery', instances: ['#main-content > header.section.secondary-section'] },
      { name: 'columns-feature', instances: ['#main-content > section.section:nth-of-type(1)'] },
      { name: 'cards-gallery', instances: ['#main-content > section.section.secondary-section:nth-of-type(2) .grid-layout.grid-gap-sm'] },
      { name: 'tabs-testimonial', instances: ['#main-content > section.section:nth-of-type(3) .tabs-wrapper'] },
      { name: 'cards-article', instances: ['#main-content > section.section.secondary-section:nth-of-type(4) .grid-layout.grid-gap-md'] },
      { name: 'accordion-faq', instances: ['#main-content > section.section:nth-of-type(5) .faq-list'] },
      { name: 'hero-overlay', instances: ['#main-content > section.section.inverse-section'] },
    ],
    sections: [
      { id: 'section-1', name: 'Hero', selector: '#main-content > header.section.secondary-section', style: 'grey', blocks: ['hero-gallery'], defaultContent: [] },
      { id: 'section-2', name: 'Featured case study', selector: '#main-content > section.section:nth-of-type(1)', style: 'light', blocks: ['columns-feature'], defaultContent: [] },
      { id: 'section-3', name: 'Gallery', selector: '#main-content > section.section.secondary-section:nth-of-type(2)', style: 'grey', blocks: ['cards-gallery'], defaultContent: ['#main-content > section.section.secondary-section:nth-of-type(2) .utility-text-align-center'] },
      { id: 'section-4', name: 'Testimonials', selector: '#main-content > section.section:nth-of-type(3)', style: 'light', blocks: ['tabs-testimonial'], defaultContent: [] },
      { id: 'section-5', name: 'Latest articles', selector: '#main-content > section.section.secondary-section:nth-of-type(4)', style: 'grey', blocks: ['cards-article'], defaultContent: ['#main-content > section.section.secondary-section:nth-of-type(4) .utility-text-align-center'] },
      { id: 'section-6', name: 'FAQ', selector: '#main-content > section.section:nth-of-type(5)', style: 'light', blocks: ['accordion-faq'], defaultContent: [] },
      { id: 'section-7', name: 'Closing CTA', selector: '#main-content > section.section.inverse-section', style: 'dark', blocks: ['hero-overlay'], defaultContent: [] },
    ],
  },
  {
    name: 'content-listing',
    urls: [
      'https://wknd-trendsetters.site/blog',
      'https://wknd-trendsetters.site/case-studies',
      'https://wknd-trendsetters.site/fashion-insights',
    ],
    blocks: [
      { name: 'columns-feature', instances: ['#main-content > section.section:nth-of-type(1)'] },
      { name: 'cards-article', instances: ['#articles .grid-layout.grid-gap-md'] },
    ],
    sections: [
      { id: 'section-1', name: 'Blog hero header', selector: '#main-content > header.section.secondary-section', style: 'grey', blocks: [], defaultContent: ['#main-content > header.section.secondary-section'] },
      { id: 'section-2', name: 'Featured teaser', selector: '#main-content > section.section:nth-of-type(1)', style: 'light', blocks: ['columns-feature'], defaultContent: [] },
      { id: 'section-3', name: 'Latest articles', selector: '#articles', style: 'grey', blocks: ['cards-article'], defaultContent: ['#articles .utility-text-align-center'] },
      { id: 'section-4', name: 'Subscribe CTA', selector: '#main-content > section.section.accent-section', style: 'accent', blocks: [], defaultContent: ['#main-content > section.section.accent-section'] },
    ],
  },
  {
    name: 'blog-article',
    urls: [
      'https://wknd-trendsetters.site/blog/ace-pro-court-polo',
      'https://wknd-trendsetters.site/blog/fashion-blog-post',
      'https://wknd-trendsetters.site/blog/fashion-trends-young-culture',
      'https://wknd-trendsetters.site/blog/fashion-trends-young-style',
      'https://wknd-trendsetters.site/blog/flip-flop-summer-style',
      'https://wknd-trendsetters.site/blog/latest-trends-young-casual-fashion',
      'https://wknd-trendsetters.site/blog/street-style-trends',
    ],
    blocks: [
      { name: 'hero-article', instances: ['#main-content > section.section:nth-of-type(1)'] },
    ],
    sections: [
      { id: 'section-1', name: 'Article masthead', selector: '#main-content > section.section:nth-of-type(1)', style: 'light', blocks: ['hero-article'], defaultContent: [] },
      { id: 'section-2', name: 'Article body', selector: '#main-content > section.section:nth-of-type(2)', style: null, blocks: [], defaultContent: ['#main-content > section.section:nth-of-type(2)'] },
    ],
  },
  {
    name: 'faq-page',
    urls: ['https://wknd-trendsetters.site/faq'],
    blocks: [
      { name: 'hero-support', instances: ['#main-content > header.section.secondary-section'] },
      { name: 'accordion-faq', instances: ['#main-content > section.section:nth-of-type(1) .faq-list'] },
      { name: 'columns-contact', instances: ['#main-content > section.section.secondary-section .grid-layout.grid-gap-xxl'] },
    ],
    sections: [
      { id: 'section-1', name: 'FAQ hero', selector: '#main-content > header.section.secondary-section', style: 'grey', blocks: ['hero-support'], defaultContent: [] },
      { id: 'section-2', name: 'FAQ accordion', selector: '#main-content > section.section:nth-of-type(1)', style: 'light', blocks: ['accordion-faq'], defaultContent: [] },
      { id: 'section-3', name: 'Contact', selector: '#main-content > section.section.secondary-section', style: 'grey', blocks: ['columns-contact'], defaultContent: [] },
      { id: 'section-4', name: 'Closing CTA', selector: '#main-content > section.section.accent-section', style: 'accent', blocks: [], defaultContent: ['#main-content > section.section.accent-section'] },
    ],
  },
  {
    name: 'category-grid',
    urls: ['https://wknd-trendsetters.site/fashion-trends-young-adults-casual-sport'],
    blocks: [
      { name: 'hero-gallery', instances: ['#main-content > header.section.secondary-section'] },
      { name: 'cards-article', instances: ['#trends .grid-layout.grid-gap-md'] },
      { name: 'columns-feature', instances: ['#main-content > section.section.secondary-section'] },
    ],
    sections: [
      { id: 'section-1', name: 'Hero header', selector: '#main-content > header.section.secondary-section', style: 'grey', blocks: ['hero-gallery'], defaultContent: [] },
      { id: 'section-2', name: 'Trend grid', selector: '#trends', style: 'light', blocks: ['cards-article'], defaultContent: ['#trends .utility-text-align-center'] },
      { id: 'section-3', name: 'Feature callout', selector: '#main-content > section.section.secondary-section', style: 'grey', blocks: ['columns-feature'], defaultContent: [] },
      { id: 'section-4', name: 'Subscribe CTA', selector: '#main-content > section.section.accent-section', style: 'accent', blocks: [], defaultContent: ['#main-content > section.section.accent-section'] },
    ],
  },
];

const transformers = [cleanupTransformer, sectionsTransformer];

/**
 * Pick the template whose urls[] contains the page URL. Falls back to path match.
 */
function resolveTemplate(url, originalURL) {
  const candidates = [url, originalURL].filter(Boolean);
  for (const tmpl of PAGE_TEMPLATES) {
    for (const c of candidates) {
      if (tmpl.urls.includes(c)) return tmpl;
      try {
        const p = new URL(c).pathname.replace(/\/$/, '') || '/';
        if (tmpl.urls.some((u) => (new URL(u).pathname.replace(/\/$/, '') || '/') === p)) return tmpl;
      } catch (e) { /* ignore */ }
    }
  }
  return null;
}

function executeTransformers(hookName, element, payload, template) {
  const enhancedPayload = { ...payload, template };
  transformers.forEach((transformerFn) => {
    // Section transformer only runs when the template has 2+ sections
    if (transformerFn === sectionsTransformer && !(template.sections && template.sections.length > 1)) return;
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      elements.forEach((element) => {
        pageBlocks.push({ name: blockDef.name, selector, element, section: blockDef.section || null });
      });
    });
  });
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const template = resolveTemplate(url, params && params.originalURL);
    if (!template) {
      console.warn(`No template matched for ${url} — importing as default content only`);
    }
    const main = document.body;
    const tmpl = template || { name: 'unknown', blocks: [], sections: [] };

    executeTransformers('beforeTransform', main, payload, tmpl);

    const pageBlocks = findBlocksOnPage(document, tmpl);
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // already replaced by earlier parser
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    executeTransformers('afterTransform', main, payload, tmpl);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: tmpl.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
