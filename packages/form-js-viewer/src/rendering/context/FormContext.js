import { createContext } from 'preact';

const FormContext = createContext({
  fields: new Map(),
  data: {},
  errors: {},
  properties: {},
  getFieldRenderer(type) { return null; }
});

export default FormContext;