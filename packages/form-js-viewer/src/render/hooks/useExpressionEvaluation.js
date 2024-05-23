import { useService } from './useService';
import { ExpressionContextInfo } from '../context/ExpressionContextInfo';
import { useContext, useMemo } from 'preact/hooks';
import { runExpressionEvaluation } from '../../util/expressions';

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
  const expressionContextInfo = useContext(ExpressionContextInfo);
  return useMemo(
    () => runExpressionEvaluation(expressionLanguage, value, expressionContextInfo),
    [expressionLanguage, expressionContextInfo, value],
  );
}
