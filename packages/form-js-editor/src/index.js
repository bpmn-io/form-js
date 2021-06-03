import FormEditor from './FormEditor';

import { schemaVersion } from '@bpmn-io/form-js-viewer';

export {
  FormEditor,
  schemaVersion
};

/**
 * @typedef { import('didi').Injector } Injector
 * @typedef { any[] } Modules
 * @typedef { { [x: string]: any } } FormEditorProperties
 * @typedef { any } Schema
 *
 * @typedef { {
 *   additionalModules?: Modules,
 *   container?: Element|string,
 *   exporter?: { name: string, version: string },
 *   injector?: Injector,
 *   modules?: Modules,
 *   properties?: FormEditorProperties,
 *   schema?: Schema
 * } } FormEditorOptions
 */

/**
 * Create a form editor.
 *
 * @param {FormEditorOptions} options
 *
 * @return {FormEditor}
 */
export function createFormEditor(options) {
  const {
    schema,
    ...rest
  } = options;

  const formEditor = new FormEditor({
    ...rest,
    schemaVersion
  });

  formEditor.importSchema(schema);

  return formEditor;
}