import { useService } from './useService';
import { LocalExpressionContext } from '../context/LocalExpressionContext';
import { useContext, useMemo } from 'preact/hooks';
import { runUnaryTestEvaluation } from '../../util/expressions';

/**
 * Evaluate a unary test expression reactively. Returns null for invalid/missing expressions.
 * The function is memoized to minimize re-renders.
 *
 * @param {string | undefined} value - A unary test expression to evaluate.
 * @returns {boolean | null} - Evaluated result, or null if expression is invalid/missing.
 */
export function useUnaryTestEvaluation(value) {
  const expressionLanguage = useService('expressionLanguage');
  const expressionContextInfo = useContext(LocalExpressionContext);
  return useMemo(
    () => runUnaryTestEvaluation(expressionLanguage, value, expressionContextInfo),
    [expressionLanguage, expressionContextInfo, value],
  );
}

