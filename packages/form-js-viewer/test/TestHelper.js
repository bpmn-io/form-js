import 'preact/debug';

import { insertCSS } from './helper';

// @ts-ignore-next-line
import formCSS from '../dist/assets/form-js.css';

// @ts-ignore-next-line
import testCSS from './test.css';

// @ts-ignore-next-line
import themeCSS from './theme.scss';



export function isSingleStart(topic) {

  // @ts-ignore-next-line
  return window.__env__ && window.__env__.SINGLE_START === topic;
}

function insertStyles() {
  insertCSS('form-js.css', formCSS);
  insertCSS('test.css', testCSS);
}

export function insertTheme() {
  insertCSS('theme.css', themeCSS);
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

export * from './helper';