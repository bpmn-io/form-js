import { createContext } from 'preact';

/**
 * @param {string} type
 * @param {boolean} [strict]
 *
 * @returns {any}
 */
function getService(type, strict) {}

const PropertiesPanelContext = createContext({
  getService
});

export default PropertiesPanelContext;