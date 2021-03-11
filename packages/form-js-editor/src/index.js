import { FormEditorCore } from './core';
import { FormEditorRenderer } from './rendering';

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
    properties = {}
  } = options;

  const form = new FormEditorCore({
    schema,
    properties
  });

  new FormEditorRenderer({
    container,
    form
  });

  return form;
}