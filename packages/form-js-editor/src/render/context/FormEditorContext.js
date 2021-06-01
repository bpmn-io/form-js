import { createContext } from 'preact';

/**
 * @param {string} type
 * @param {boolean} [strict]
 *
 * @returns {any}
 */
function getService(type, strict) {}

const FormEditorContext = createContext({
  getService
});

export default FormEditorContext;