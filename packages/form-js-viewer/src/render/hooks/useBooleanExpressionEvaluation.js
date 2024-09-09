import { useService } from './useService';
import { LocalExpressionContext } from '../context/LocalExpressionContext';
import { useContext, useMemo } from 'preact/hooks';
import { runExpressionEvaluation } from '../../util/expressions';

/**
 * If the value is a valid expression, we evaluate it. Otherwise, we continue with the value as-is.
 * If the resulting value isn't a boolean, we return 'false'
 * The function is memoized to minimize re-renders.
 *
 * @param {boolean | string} value - A static boolean or expression to evaluate.
 * @returns {boolean} - Evaluated boolean result.
 */
export function useBooleanExpressionEvaluation(value) {
  const expressionLanguage = useService('expressionLanguage');
  const expressionContextInfo = useContext(LocalExpressionContext);
  return useMemo(() => {
    const evaluationResult = runExpressionEvaluation(expressionLanguage, value, expressionContextInfo);
    return typeof evaluationResult === 'boolean' ? evaluationResult : false;
  }, [expressionLanguage, expressionContextInfo, value]);
}
