import { useService } from './useService';
import { LocalExpressionContext } from '../context/LocalExpressionContext';
import { useContext, useMemo } from 'preact/hooks';
import { runExpressionEvaluation } from '../../util/expressions';

/**
 * If the value is a valid expression, it is evaluated and returned. Otherwise, it is returned as-is.
 * The function is memoized to minimize re-renders.
 *
 * @param {any} value - A static value or expression to evaluate.
 * @returns {any} - Evaluated value or the original value if not an expression.
 */
export function useExpressionEvaluation(value) {
  const expressionLanguage = useService('expressionLanguage');
  const expressionContextInfo = useContext(LocalExpressionContext);
  return useMemo(
    () => runExpressionEvaluation(expressionLanguage, value, expressionContextInfo),
    [expressionLanguage, expressionContextInfo, value],
  );
}
