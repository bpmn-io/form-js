import { FormEditor } from './FormEditor';

import { schemaVersion } from '@bpmn-io/form-js-viewer';

export {
  FormEditor,
  schemaVersion
};

export {
  useDebounce,
  usePrevious,
  useService
} from './render/hooks';

export {
  useService as usePropertiesPanelService,
  useVariables
} from './features/properties-panel/hooks';

/**
 * @typedef { import('./types').CreateFormEditorOptions } CreateFormEditorOptions
 */

/**
 * Create a form editor.
 *
 * @param {CreateFormEditorOptions} options
 *
 * @return {Promise<FormEditor>}
 */
export function createFormEditor(options) {
  const {
    schema,
    ...rest
  } = options;

  const formEditor = new FormEditor(rest);

  return formEditor.importSchema(schema).then(() => {
    return formEditor;
  });
}