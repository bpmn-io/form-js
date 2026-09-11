/**
 * @param {string?} prefix
 *
 * @returns Element
 */
export function createFormContainer(prefix = 'fjs') {
  const container = document.createElement('div');

  container.classList.add(`${prefix}-container`, 'bio-theme-parent');

  return container;
}
