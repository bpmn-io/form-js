import useService from './useService.js';
import useFilteredFormData from './useFilteredFormData.js';

/**
 * Retrieve readonly value of a form field, given it can be an
 * expression optionally or configured globally.
 *
 * @typedef { import('../../types').FormProperties } FormProperties
 *
 * @param {any} formField
 * @param {FormProperties} properties
 *
 * @returns {boolean}
 */
export default function useReadonly(formField, properties = {}) {
  const expressionLanguage = useService('expressionLanguage');
  const conditionChecker = useService('conditionChecker', false);
  const filteredData = useFilteredFormData();

  const { readonly } = formField;

  if (properties.readOnly) {
    return true;
  }

  if (expressionLanguage && expressionLanguage.isExpression(readonly)) {
    return conditionChecker ? conditionChecker.check(readonly, filteredData) : false;
  }

  return readonly || false;
}
