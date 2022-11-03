import useService from './useService.js';

/**
 *
 * @param {{ expression?: string } | undefined} condition
 * @param {import('../../types').Data} data
 */
export function useCondition(condition, data) {
  const conditionChecker = useService('conditionChecker', false);

  if (!conditionChecker) {
    return true;
  }

  return conditionChecker.check(condition, data);
}
