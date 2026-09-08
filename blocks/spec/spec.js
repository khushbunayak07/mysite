/*
 * Spec block — renders a two-column key/value specification list.
 * Authored as a table: each row is [label, value].
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.classList.add('spec-row');
    const cells = [...row.children];
    if (cells[0]) cells[0].classList.add('spec-label');
    if (cells[1]) cells[1].classList.add('spec-value');
  });
}
