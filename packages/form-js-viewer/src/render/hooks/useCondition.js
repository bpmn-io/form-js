import { useUnaryTestEvaluation } from './useUnaryTestEvaluation';

/**
 * Evaluate if condition is met reactively based on the expression language and form data.
 *
 * @param {string | undefined} condition
 *
 * @returns {boolean | null} true if condition is met, false if not, null if no condition or expression language
 */
export function useCondition(condition) {
  return useUnaryTestEvaluation(condition);
}
