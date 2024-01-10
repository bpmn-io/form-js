import { useService } from './useService';
import { LocalExpressionContext } from '../context/LocalExpressionContext';
import { useContext, useMemo } from 'preact/hooks';
import { buildExpressionContext } from '../../util/simple';

/**
 * Evaluate a string reactively based on the expressionLanguage and form data.
 * If the string is not an expression, it is returned as is.
 * The function is memoized to minimize re-renders.
 *
 * @param {string} value - The string to evaluate.
 * @returns {any} - Evaluated value or the original value if not an expression.
 */
export function useExpressionEvaluation(value) {
  const expressionLanguage = useService('expressionLanguage');
  const expressionContextInfo = useContext(LocalExpressionContext);

  return useMemo(() => {
    if (expressionLanguage && expressionLanguage.isExpression(value)) {
      return expressionLanguage.evaluate(value, buildExpressionContext(expressionContextInfo));
    }
    return value;
  }, [ expressionLanguage, expressionContextInfo, value ]);
}
