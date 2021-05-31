import { FormEditorCore } from './core';
import { FormEditorRenderer } from './rendering';

import { schemaVersion } from '@bpmn-io/form-js-viewer';

export { schemaVersion };

/**
 * @typedef { { container: Element; exporter?: { name: string, version: string }; schema: any; data: any; properties?: any } } FormEditorOptions
 */

/**
 * Create a form editor.
 *
 * @param {FormEditorOptions} options
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