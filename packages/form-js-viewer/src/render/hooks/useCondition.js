import useService from './useService.js';

/**
 *
 * @param {{ expression?: string } | undefined} condition
 * @param {import('../../types').Data} data
 */
export function useCondition(condition, data, defaultValue) {
  const conditionChecker = useService('conditionChecker', false);

  if (!conditionChecker) {
    return defaultValue;
  }

  return conditionChecker.check(condition, data, defaultValue);
}

export function useConditionEvaluation(condition, data, defaultValue) {
  const conditionChecker = useService('conditionChecker', false);

  if (!conditionChecker) {
    return defaultValue;
  }

  return conditionChecker.evaluate(condition, data, defaultValue);
}
