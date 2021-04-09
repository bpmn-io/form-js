import { createContext } from 'preact';

const FormContext = createContext({
  fields: new Map(),
  properties: {},
  getFieldRenderer(type) { return null; },
  fieldRenderers: [],
  addField() {},
  editField() {},
  moveField() {},
  removeField() {},
  emit() {},
  on() {},
  off() {}
});

export default FormContext;