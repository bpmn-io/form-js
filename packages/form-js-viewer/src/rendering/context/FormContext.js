import { createContext } from 'preact';

const FormContext = createContext({
  fields: {
    add(id, field) {},
    remove(id) {}
  },
  data: {},
  errors: {},
  properties: {},
  getFieldRenderer(type) { return null; }
});

export default FormContext;