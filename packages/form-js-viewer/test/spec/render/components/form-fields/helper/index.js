import { FormContext } from '../../../../../../src/render/context';

/**
 * @param {string} type
 * @param {boolean} [strict]
 *
 * @returns {any}
 */
function getService(type, strict) {}

export function WithFormContext(Component, formId = 'foo') {
  const formContext = {
    getService,
    formId
  };

  return (
    <FormContext.Provider value={ formContext }>
      { Component }
    </FormContext.Provider>
  );
}