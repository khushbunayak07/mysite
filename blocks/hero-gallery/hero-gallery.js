export default function decorate(block) {
  // The content column is the row without a picture; mark full-line CTA links
  // as pill buttons so they render like the source (not plain links).
  const contentRow = [...block.querySelectorAll(':scope > div')]
    .find((row) => !row.querySelector('picture'));
  if (contentRow) {
    contentRow.querySelectorAll('p > a').forEach((a) => {
      const p = a.closest('p');
      if (p && p.textContent.trim() === a.textContent.trim()) {
        a.classList.add('button');
      }
    });
  }
}
