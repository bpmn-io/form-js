import 'preact/debug';

import { insertCSS } from './helper';

// @ts-ignore-next-line
import formCSS from '@bpmn-io/form-js-viewer/dist/assets/form-js.css';

// @ts-ignore-next-line
import formEditorCSS from '../dist/assets/form-js-editor.css';

// @ts-ignore-next-line
import testCSS from './test.css';

export { expectNoViolations } from '../../form-js-viewer/test/helper';

export { insertTheme } from '../../form-js-viewer/test/TestHelper';

export function isSingleStart(topic) {

  // @ts-ignore-next-line
  return window.__env__ && window.__env__.SINGLE_START === topic;
}

export function insertStyles() {
  insertCSS('form-js.css', formCSS);
  insertCSS('form-js-editor.css', formEditorCSS);
  insertCSS('test-editor.css', testCSS);
}

insertStyles();

export { createFormContainer } from '../../form-js-viewer/test/TestHelper';

export * from './helper';