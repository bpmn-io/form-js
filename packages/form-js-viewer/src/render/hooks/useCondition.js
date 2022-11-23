import useService from './useService.js';

/**
 * Check if condition is met with given variables.
 *
 * @param {string | undefined} condition
 * @param {import('../../types').Data} data
 *
 * @returns {boolean} true if condition is met or no condition or condition checker exists
 */
export function useCondition(condition, data) {
  const conditionChecker = useService('conditionChecker', false);

  if (!conditionChecker) {
    return null;
  }

  return conditionChecker.check(condition, data);
}
