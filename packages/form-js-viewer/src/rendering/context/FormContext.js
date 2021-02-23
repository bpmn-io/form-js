import { createContext } from 'solid-js';

const FormContext = createContext({
  fields: {
    add(path, field) {},
    update(path, newPath) {},
    remove(path) {}
  },
  data: {},
  errors: {},
  properties: {},
  getFieldRenderer(type) { return null; }
});

export default FormContext;