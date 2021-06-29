import 'preact/debug';

import { insertCSS } from './helper';

// @ts-ignore-next-line
import formCSS from '@bpmn-io/form-js-viewer/dist/assets/form-js.css';

// @ts-ignore-next-line
import formEditorCSS from '../dist/assets/form-js-editor.css';

// @ts-ignore-next-line
import dragulaCSS from '../dist/assets/dragula.css';

// @ts-ignore-next-line
import testCSS from './test.css';

export function isSingleStart(topic) {

  // @ts-ignore-next-line
  return window.__env__ && window.__env__.SINGLE_START === topic;
}

export function insertStyles() {
  insertCSS('form-js.css', formCSS);
  insertCSS('form-js-editor.css', formEditorCSS);
  insertCSS('dragula.css', dragulaCSS);
  insertCSS('test.css', testCSS);
}

insertStyles();

export * from './helper';