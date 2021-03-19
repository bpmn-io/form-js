import { createContext } from 'preact';

const FormContext = createContext({
  fields: new Map(),
  properties: {},
  getFieldRenderer(type) { return null; },
  fieldRenderers: [],
  addField() {},
  editField() {},
  moveField() {},
  removeField() {}
});

export default FormContext;