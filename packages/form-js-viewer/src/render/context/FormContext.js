import { createContext } from 'preact';

/**
 * @param {string} type
 * @param {boolean} [strict]
 *
 * @returns {any}
 */
function getService(type, strict) {}

export const FormContext = createContext({
  getService,
  formId: null
});
