import { createContext } from 'preact';

const FormContext = createContext({
  fields: {
    add(id, registeredField) {},
    get(id) {},
    getAll() {},
    remove(id) {}
  },
  properties: {},
  getFieldRenderer(type) { return null; },
  fieldRenderers: [],
  addField() {},
  editField() {},
  moveField() {},
  removeField() {}
});

export default FormContext;