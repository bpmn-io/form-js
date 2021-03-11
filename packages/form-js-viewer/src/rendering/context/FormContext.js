import { createContext } from 'preact';

const FormContext = createContext({
  fields: {
    add(id, registeredField) {},
    get(id) {},
    getAll() {},
    remove(id) {}
  },
  data: {},
  errors: {},
  properties: {},
  getFieldRenderer(type) { return null; }
});

export default FormContext;