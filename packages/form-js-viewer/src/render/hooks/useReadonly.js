import { useService } from './useService.js';
import { useUnaryTestEvaluation } from './useUnaryTestEvaluation.js';

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
export function useReadonly(formField, properties = {}) {
  const expressionLanguage = useService('expressionLanguage');

  const { readonly } = formField;

  const isExpression = expressionLanguage && expressionLanguage.isExpression(readonly);

  const evaluatedReadonly = useUnaryTestEvaluation(isExpression ? readonly : undefined);

  if (properties.readOnly) {
    return true;
  }

  if (isExpression) {
    return evaluatedReadonly === true;
  }

  return readonly || false;
}
