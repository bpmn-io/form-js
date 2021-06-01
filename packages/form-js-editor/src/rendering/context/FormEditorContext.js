import { createContext } from 'preact';

const FormEditorContext = createContext({
  fields: new Map(),
  properties: {},
  schema: {},
  getFieldRenderer(type) { return null; },
  fieldRenderers: [],

  addField(...args) {},
  editField(...args) {},
  moveField(...args) {},
  removeField(...args) {},

  /**
   * @param {string} event
   * @param {any?} payload
   */
  emit(event, payload) {},

  /**
   * @param {string} event
   * @param {function} callback
   */
  on(event, callback) {},

  /**
   * @param {string} event
   * @param {function?} callback
   */
  off(event, callback) {}
});

export default FormEditorContext;