import { buildExpressionContext } from '../../util/simple';
import { LocalExpressionContext } from '../context/LocalExpressionContext.js';
import { useService } from './useService.js';
import { useContext } from 'preact/hooks';

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
  const conditionChecker = useService('conditionChecker', false);
  const expressionContextInfo = useContext(LocalExpressionContext);

  const { readonly } = formField;

  if (properties.readOnly) {
    return true;
  }

  if (expressionLanguage && expressionLanguage.isExpression(readonly)) {
    return conditionChecker ? conditionChecker.check(readonly, buildExpressionContext(expressionContextInfo)) : false;
  }

  return readonly || false;
}
