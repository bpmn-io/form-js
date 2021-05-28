import { FormEditorCore } from './core';
import { FormEditorRenderer } from './rendering';

import { schemaVersion } from '@bpmn-io/form-js-viewer';

export { schemaVersion };

/**
 * @typedef { { container: Element; schema: any; data: any; properties?: any } } FormOptions
 */

/**
 * Create a form editor.
 *
 * @param {FormOptions} options
 *
 * @return {FormEditorCore}
 */
export function createFormEditor(options) {

  const {
    container,
    schema,
    properties = {},
    exporter
  } = options;

  const form = new FormEditorCore({
    schema,
    properties,
    schemaVersion,
    exporter
  });

  new FormEditorRenderer({
    container,
    form
  });

  return form;
}