import { createContext } from 'preact';

/**
 * @param {string} type
 * @param {boolean} [strict]
 *
 * @returns {any}
 */
function getService(type, strict) {}

const FormContext = createContext({
  getService,
  formId: null
});

export default FormContext;