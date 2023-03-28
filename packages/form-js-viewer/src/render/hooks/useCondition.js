import useService from './useService.js';
import useFilteredFormData from './useFilteredFormData.js';
import { useMemo } from 'preact/hooks';

/**
 * Evaluate if condition is met reactively based on the conditionChecker and form data.
 *
 * @param {string | undefined} condition
 *
 * @returns {boolean} true if condition is met or no condition or condition checker exists
 */
export default function useCondition(condition) {
  const conditionChecker = useService('conditionChecker', false);
  const filteredData = useFilteredFormData();

  return useMemo(() => {
    return conditionChecker ? conditionChecker.check(condition, filteredData) : null;
  }, [ conditionChecker, condition, filteredData ]);
}
