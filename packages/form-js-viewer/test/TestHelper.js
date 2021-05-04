// @ts-ignore-next-line
import formCSS from '../dist/assets/form-js.css';

// @ts-ignore-next-line
import testCSS from './test.css';

export function isSingleStart(topic) {

  // @ts-ignore-next-line
  return window.__env__ && window.__env__.SINGLE_START === topic;
}

function insertStyles() {
  insertCSS('form-js.css', formCSS);
  insertCSS('test.css', testCSS);
}

export function insertCSS(name, css) {
  if (document.querySelector('[data-css-file="' + name + '"]')) {
    return;
  }

  const head = document.head || document.getElementsByTagName('head')[0];
  const style = document.createElement('style');
  style.setAttribute('data-css-file', name);

  style.type = 'text/css';
  style.appendChild(document.createTextNode(css));

  head.appendChild(style);
}


insertStyles();

/**
 * Create form container:
 *
 * <div class="fjs-container">
 *   <div class="fjs-form"></div>
 * </div>
 *
 * @returns {Element}
 */
export function createFormContainer() {
  const container = document.createElement('div');

  container.classList.add('fjs-container');

  document.body.appendChild(container);

  const formContainer = document.createElement('div');

  formContainer.classList.add('fjs-form');

  container.appendChild(formContainer);

  return container;
}