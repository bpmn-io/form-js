import { useService } from './useService.js';
import { useContext, useMemo } from 'preact/hooks';
import { LocalExpressionContext } from '../context/LocalExpressionContext.js';
import { buildExpressionContext } from '../../util/simple';

/**
 * Evaluate if condition is met reactively based on the conditionChecker and form data.
 *
 * @param {string | undefined} condition
 *
 * @returns {boolean} true if condition is met or no condition or condition checker exists
 */
export function useCondition(condition) {
  const conditionChecker = useService('conditionChecker', false);
  const expressionContextInfo = useContext(LocalExpressionContext);

  return useMemo(() => {
    return conditionChecker ? conditionChecker.check(condition, buildExpressionContext(expressionContextInfo)) : null;
  }, [ conditionChecker, condition, expressionContextInfo ]);
}
