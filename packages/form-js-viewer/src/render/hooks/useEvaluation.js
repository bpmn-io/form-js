import useService from './useService.js';

/**
 *
 * @param {string | undefined} expression
 * @param {import('../../types').Data} data
 */
export function useEvaluation(expression, data) {
  const conditionChecker = useService('conditionChecker', false);

  if (!conditionChecker) {
    return null;
  }

  return conditionChecker.evaluate(expression, data);
}
